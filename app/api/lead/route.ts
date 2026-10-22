// POST /api/lead — single public endpoint (Next.js 15 App Router).
// rate-limit -> zod-validate -> honeypot/time-trap bot filter -> parallel
// fan-out delivery -> byte-identical 202 for real/honeypot/time-trap outcomes.
// Zero persistence anywhere in this path, per ADR.
import { type NextRequest } from "next/server";
import { validateLeadRequest } from "@/lib/validation/lead-schema";
import { deliverLead, loadDeliveryChannelConfig } from "@/lib/delivery/fan-out";
import { logLeadEvent } from "@/lib/logger";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import type {
  AcceptedResponse,
  DeliveryChannel,
  LeadLogOutcome,
  LeadRequestBody,
  LeadSubmission,
  ValidationErrorResponse,
} from "@/types/lead";

export const dynamic = "force-dynamic";

const TIME_TRAP_MS = 10_000;
const ACCEPTED: AcceptedResponse = { status: "accepted" };

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = req.headers.get("x-vercel-id") ?? undefined;

  // Rate-limit check — first guard, before any body parsing.
  // 5 requests / 60 s per IP fingerprint (in-process sliding window).
  const rlKey = getRateLimitKey(req);
  const { allowed } = checkRateLimit(rlKey);
  if (!allowed) {
    return new Response(JSON.stringify({ error: "rate_limited" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": "60",
      },
    });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    const body: ValidationErrorResponse = { error: "body_invalid" };
    return Response.json(body, { status: 400 });
  }

  const result = validateLeadRequest(raw);
  if (!result.ok) {
    const body: ValidationErrorResponse = { error: result.error };
    return Response.json(body, { status: 400 });
  }

  const data: LeadRequestBody = result.data;
  const receivedAt = Date.now();
  const isHoneypot = Boolean(data.company_website && data.company_website.trim().length > 0);
  const delta = receivedAt - data.formRenderedAt;
  // Finding 5 fix: add an upper-bound check so a future-skewed client clock
  // (formRenderedAt > receivedAt, i.e. negative delta) does not silently
  // discard a legitimate submission as a time-trap bot.
  // - delta >= 0 && delta < TIME_TRAP_MS  → submitted too fast (bot)
  // - delta < -5000                        → clock >5 s ahead; treat as bot
  //   (prevents spoofing formRenderedAt = Date.now() - 11000 from the future)
  // - delta >= TIME_TRAP_MS               → normal human submission
  // - -5000 <= delta < 0                  → minor clock skew; allow through
  const isTimeTrap = delta >= 0
    ? delta < TIME_TRAP_MS
    : delta < -5_000;

  // Bot-filtered requests get the EXACT same 202 body as a real success,
  // with no delivery attempt and no distinguishing timing/header signal
  // (AC-08, AC-09, AC-10) — scrapers cannot tell filtered from delivered.
  if (isHoneypot || isTimeTrap) {
    logLeadEvent({
      timestamp: receivedAt,
      outcome: isHoneypot ? "filtered_honeypot" : "filtered_timetrap",
      channelsAttempted: [],
      channelsSucceeded: [],
      durationMs: Date.now() - startedAt,
      requestId,
    });
    return Response.json(ACCEPTED, { status: 202 });
  }

  const submission: LeadSubmission = {
    name: data.name,
    contact: data.contact,
    brief: data.brief,
    role: data.role,
    industry: data.industry,
    companySize: data.companySize,
    replyLang: data.replyLang,
    company_website: data.company_website ?? "",
    formRenderedAt: data.formRenderedAt,
    receivedAt,
    isBot: false,
  };

  // Delivery failures/timeouts are never client-facing — deliverLead() never
  // throws (each channel is internally guarded), so no try/catch is needed
  // here to still guarantee a 202 response (AC-11, AC-12, AC-13, AC-15).
  const config = loadDeliveryChannelConfig();
  const attempts = await deliverLead(submission, config);

  const channelsAttempted: DeliveryChannel[] = attempts
    .filter((a) => a.status !== "skipped")
    .map((a) => a.channel);
  const channelsSucceeded: DeliveryChannel[] = attempts
    .filter((a) => a.status === "fulfilled")
    .map((a) => a.channel);

  let outcome: LeadLogOutcome;
  if (channelsAttempted.length === 0) outcome = "no_delivery_configured";
  else if (channelsSucceeded.length === channelsAttempted.length) outcome = "delivered";
  else if (channelsSucceeded.length > 0) outcome = "partial";
  else outcome = "failed";

  logLeadEvent({
    timestamp: receivedAt,
    outcome,
    channelsAttempted,
    channelsSucceeded,
    durationMs: Date.now() - startedAt,
    requestId,
  });

  return Response.json(ACCEPTED, { status: 202 });
}
