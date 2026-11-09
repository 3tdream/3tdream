// GET /api/subscribe/confirm — verifies a signed token (lib/subscribe-token.ts),
// notifies the owner only on a valid/unexpired confirmation, and always
// redirects (303) to a static outcome page. NEVER throws, NEVER returns JSON,
// NEVER 500s (US-02, US-03, US-06, US-07, AC-06/07/10/11/12).
import { NextRequest, NextResponse } from "next/server";
import { verifySubscribeToken } from "@/lib/subscribe-token";
import { sendSubscribeOwnerNotice } from "@/lib/subscribe-delivery";
import { buildSubscribeOwnerNoticeEmail } from "@/lib/subscribe-values";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    const secret = process.env.SUBSCRIBE_TOKEN_SECRET;
    const siteUrl = process.env.SITE_URL;

    const payload = (secret && siteUrl) ? verifySubscribeToken(token, secret) : null;

    const invalidDest = siteUrl
      ? `${siteUrl.replace(/\/$/, "")}/subscribe/invalid`
      : "/subscribe/invalid";
    const doneDest = siteUrl
      ? `${siteUrl.replace(/\/$/, "")}/subscribe/done`
      : "/subscribe/done";

    if (!payload) {
      // No PII (no email/token/MAC) logged — only aggregate probing signal.
      console.warn("[subscribe] confirm rejected");
      return NextResponse.redirect(invalidDest, { status: 303 });
    }

    try {
      const content = buildSubscribeOwnerNoticeEmail(payload.email, payload.replyLang);
      const delivered = await sendSubscribeOwnerNotice(content);
      if (!delivered) {
        console.log("[subscribe] owner notice failed: delivery");
      }
    } catch (err) {
      console.log("[subscribe] owner notice failed:", err instanceof Error ? err.message : String(err));
    }

    return NextResponse.redirect(doneDest, { status: 303 });
  } catch {
    // Absolute last-resort guard: this route must never throw or 500.
    const siteUrl = process.env.SITE_URL;
    const invalidDest = siteUrl
      ? `${siteUrl.replace(/\/$/, "")}/subscribe/invalid`
      : "/subscribe/invalid";
    return NextResponse.redirect(invalidDest, { status: 303 });
  }
}
