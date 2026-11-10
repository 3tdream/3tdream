// GET /api/subscribe/confirm — verifies the signed token, notifies the owner
// only on success, and 303-redirects to a static outcome page (MC-557).
// US-06: verifySubscribeToken() NEVER throws (length pre-check before
// timingSafeEqual, MAC checked before JSON.parse, exp checked last) — this
// handler never produces a 500 or JSON body, only a 303 redirect.
import { NextRequest, NextResponse } from "next/server";
import { verifySubscribeToken } from "@/lib/subscribe-token";
import { sendSubscribeOwnerNotice } from "@/lib/subscribe-delivery";
import { buildSubscribeOwnerNoticeEmail } from "@/lib/subscribe-values";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const payload = verifySubscribeToken(token);

  if (!payload) {
    // Non-PII probing signal (cyber fix #2) — no token/email ever logged.
    console.warn("[subscribe] confirm rejected");
    return NextResponse.redirect(new URL("/subscribe/invalid", req.url), { status: 303 });
  }

  // AC-10: idempotent re-confirm — a repeat valid token always re-sends the
  // owner notice and redirects to /subscribe/done (no store to dedupe).
  const content = buildSubscribeOwnerNoticeEmail(payload.email);
  const delivered = await sendSubscribeOwnerNotice(content);
  if (!delivered) {
    // sendSubscribeOwnerNotice already logs the distinct failure/not-configured
    // line internally; nothing further to log here (no PII duplication).
  }

  return NextResponse.redirect(new URL("/subscribe/done", req.url), { status: 303 });
}
