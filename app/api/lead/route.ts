// POST /api/lead — trilingual lead-intake endpoint (MC-557 / ADR-001).
// Node runtime, public, unauthenticated, unversioned, no persistence.
// Validates via zod, filters bots (honeypot + timing heuristic), attempts
// best-effort delivery, and ALWAYS returns 202 for schema-valid input — the
// ONLY non-202 response is a 400 schema validation failure.
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { parseLeadRequest } from "@/lib/validation/lead-schema";
import { deliverLead } from "@/lib/lead-delivery";
import { TIME_TRAP_MS_THRESHOLD } from "@/lib/lead-values";
import type { LeadResponseError, LeadResponseOk, LeadSubmission } from "@/types/lead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Cyber fix: reject oversized/streamed bodies BEFORE request.json() ever
// runs. A valid payload is ~2.5KB; 16KB gives ample UTF-8/extra-field
// headroom. Missing Content-Length (e.g. chunked streaming) is rejected too.
const MAX_BODY_BYTES = 16_384;

export async function POST(req: NextRequest): Promise<NextResponse<LeadResponseOk | LeadResponseError>> {
  const contentLength = req.headers.get("content-length");
  const length = contentLength ? Number(contentLength) : NaN;
  if (!Number.isFinite(length) || length <= 0 || length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, errors: { body: ["request body missing or too large"] } },
      { status: 400 }
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, errors: { body: ["invalid JSON"] } }, { status: 400 });
  }

  // Zod schema validation runs BEFORE the bot heuristic (contract AC-08): a
  // malformed/missing formRenderedAt fails HERE with 400, never reaching the
  // honeypot/timing bot-silent-202 path below.
  const result = parseLeadRequest(raw);
  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const data = result.data;
  const submittedAt = Date.now();
  const elapsedMs = submittedAt - data.formRenderedAt;

  const honeypotFilled = data.honeypot.trim().length > 0;
  const isBotByTiming = elapsedMs < TIME_TRAP_MS_THRESHOLD;
  const isBot = honeypotFilled || isBotByTiming;

  const requestId = randomUUID();

  if (isBot) {
    // AC-07/AC-09: silent 202 accept, no webhook/Resend attempted. Bot
    // signal is logged server-side only — the client response is byte-
    // identical to a legitimate log-fallback response, by design.
    console.warn("[lead] bot detected:", { requestId, honeypotFilled, elapsedMs });
    return NextResponse.json({ ok: true, delivered: false }, { status: 202 });
  }

  const submission: LeadSubmission = {
    ...data,
    requestId,
    submittedAt,
    elapsedMs,
  };

  console.log("[lead] received", { requestId, replyLang: submission.replyLang, elapsedMs });

  // Delivery orchestration settles before the response is sent (so
  // `delivered` reflects the real outcome), bounded by per-channel timeouts
  // inside deliverLead() so a slow/unreachable channel can't hang the
  // response relied on by the client's loading-state UX (US-07).
  const { delivered } = await deliverLead(submission);

  return NextResponse.json({ ok: true, delivered }, { status: 202 });
}
