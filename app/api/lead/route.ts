// POST /api/lead — stateless trilingual lead capture (MC-557). Validates via
// zod, filters bots (honeypot + time-trap) with byte-identical 202 responses,
// then fans out delivery via Promise.allSettled. Zero persistence — nothing
// touches a DB/KV/file store anywhere in this path.
import { NextRequest, NextResponse } from "next/server";
import { validateLeadRequest } from "@/lib/validation/lead-schema";
import { deliverLead } from "@/lib/lead-delivery";
import { TIME_TRAP_MS_THRESHOLD } from "@/lib/lead-values";
import type { BotFilterResult, LeadApiResponse, LeadSubmission } from "@/types/lead";

export const dynamic = "force-dynamic";

const ACCEPTED: LeadApiResponse = { status: "accepted" };

function evaluateBotFilter(
  input: Pick<LeadSubmission, "company_website" | "formRenderedAt">,
  receivedAt: number
): BotFilterResult {
  const honeypotTriggered = input.company_website.trim().length > 0;
  const elapsedMs = receivedAt - input.formRenderedAt;
  const timeTrapTriggered = elapsedMs < TIME_TRAP_MS_THRESHOLD;
  return { honeypotTriggered, elapsedMs, timeTrapTriggered, isBot: honeypotTriggered || timeTrapTriggered };
}

export async function POST(req: NextRequest): Promise<NextResponse<LeadApiResponse>> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    // Malformed JSON behaves like a missing first-in-order field — never a
    // 5xx in response to bad client input.
    return NextResponse.json({ error: "name_required" }, { status: 400 });
  }

  const receivedAt = Date.now();

  // Bot filter MUST run before field validation (AC-08): a honeypot/time-trap
  // hit returns the identical-202 silent path regardless of whether other
  // fields would otherwise fail validation. Read the two relevant raw fields
  // defensively — no trust, no validation side-effects — before anything else.
  const rawRecord = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};
  const rawHoneypot = typeof rawRecord.company_website === "string" ? rawRecord.company_website : "";
  const rawFormRenderedAt = typeof rawRecord.formRenderedAt === "number" ? rawRecord.formRenderedAt : receivedAt;

  const botFilter = evaluateBotFilter(
    { company_website: rawHoneypot, formRenderedAt: rawFormRenderedAt },
    receivedAt
  );
  if (botFilter.isBot) {
    // Byte-identical 202 — bots get zero signal distinguishing this from a
    // real success (AC-08/AC-09). No delivery attempted, no further checks.
    return NextResponse.json(ACCEPTED, { status: 202 });
  }

  const result = validateLeadRequest(raw);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const body = result.data;

  // A render timestamp in the future is malformed input, not a bot signal —
  // it must surface as formRenderedAt_invalid, distinct from the silent
  // bot-filter path (ERD: BotFilterResult.elapsedMs contract).
  if (receivedAt < body.formRenderedAt) {
    return NextResponse.json({ error: "formRenderedAt_invalid" }, { status: 400 });
  }

  const submission: LeadSubmission = {
    name: body.name,
    contact: body.contact,
    brief: body.brief,
    role: body.role,
    industry: body.industry,
    companySize: body.companySize,
    replyLang: body.replyLang,
    company_website: body.company_website ?? "",
    formRenderedAt: body.formRenderedAt,
    receivedAt,
  };

  // Fire-and-forget from the client's perspective: per-channel failures are
  // swallowed inside deliverLead and logged non-PII only (AC-12); total
  // response time stays bounded by each channel's own 5s AbortController.
  await deliverLead(submission, req.headers.get("user-agent") ?? "");

  return NextResponse.json(ACCEPTED, { status: 202 });
}
