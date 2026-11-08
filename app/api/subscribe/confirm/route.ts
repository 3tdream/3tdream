// GET /api/subscribe/confirm — verifies the signed token (MC-557), sends the
// owner-notice email (best-effort), and 303-redirects to a static trilingual
// outcome page. Never JSON, never 500 (US-06): any malformed/tampered/
// expired/unconfigured input redirects to /subscribe/invalid.
import { NextRequest, NextResponse } from "next/server";
import { verifySubscribeToken } from "@/lib/subscribe-token";
import { sendSubscribeOwnerNotice } from "@/lib/subscribe-delivery";
import { buildSubscribeOwnerNoticeEmail } from "@/lib/subscribe-values";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const origin = process.env.SITE_URL || new URL(req.url).origin;
  const invalidUrl = new URL("/subscribe/invalid", origin);
  const doneUrl = new URL("/subscribe/done", origin);

  try {
    const secret = process.env.SUBSCRIBE_TOKEN_SECRET;
    if (!secret) {
      console.log("[subscribe-confirm] not configured");
      return NextResponse.redirect(invalidUrl, 303);
    }

    const token = req.nextUrl.searchParams.get("token");
    const payload = verifySubscribeToken(token, secret);
    if (!payload) {
      return NextResponse.redirect(invalidUrl, 303);
    }

    try {
      const { subject, html } = buildSubscribeOwnerNoticeEmail(payload.email);
      const sent = await sendSubscribeOwnerNotice(subject, html);
      if (!sent) {
        console.error("[subscribe-confirm] owner notice delivery failed");
      }
    } catch (err) {
      console.error("[subscribe-confirm] owner notice error", err instanceof Error ? err.message : String(err));
    }

    return NextResponse.redirect(doneUrl, 303);
  } catch (err) {
    console.error("[subscribe-confirm] unexpected error", err instanceof Error ? err.message : String(err));
    return NextResponse.redirect(invalidUrl, 303);
  }
}
