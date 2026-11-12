// GET /api/subscribe/confirm?token= — Build notes double opt-in confirmation (MC-557).
// Always answers 303: /subscribe/done for a valid token (after one best-effort
// owner e-mail), /subscribe/invalid for everything else. Never JSON, never 500.
// HEAD is explicit and fail-closed: a probe can never verify a token or send mail.
// The redirect is built by hand: NextResponse.redirect() throws on a relative or
// malformed URL, which would turn a missing SITE_URL into a 500.
import type { NextRequest } from "next/server";
import { getSubscribeSecret, verifySubscribeToken } from "@/lib/subscribe-token";
import { sendOwnerEmail } from "@/lib/subscribe-delivery";
import { SUBSCRIBE_TOKEN_MAX, getSiteOrigin } from "@/lib/subscribe-values";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function redirectTo(path: "/subscribe/done" | "/subscribe/invalid"): Response {
  let origin = "";
  try {
    origin = getSiteOrigin() ?? "";
  } catch {
    origin = "";
  }
  return new Response(null, {
    status: 303,
    // no-referrer: the request URL carries the live token; keep it out of Referer on the next hop.
    headers: { Location: `${origin}${path}`, "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
  });
}

export async function GET(req: NextRequest): Promise<Response> {
  try {
    // Order: token present and within SUBSCRIBE_TOKEN_MAX, then secret/SITE_URL, then verify.
    // Nothing is verified or sent on any early exit, and nothing is logged.
    const token = req.nextUrl.searchParams.get("token");
    if (!token || token.length > SUBSCRIBE_TOKEN_MAX) return redirectTo("/subscribe/invalid");
    if (!getSubscribeSecret() || getSiteOrigin() === null) return redirectTo("/subscribe/invalid");
    const payload = verifySubscribeToken(token);
    if (!payload) return redirectTo("/subscribe/invalid");
    // Best-effort: sendOwnerEmail never throws and logs no address or token.
    await sendOwnerEmail(payload.email, payload.replyLang);
    return redirectTo("/subscribe/done");
  } catch {
    return redirectTo("/subscribe/invalid");
  }
}

export async function HEAD(): Promise<Response> {
  return redirectTo("/subscribe/invalid");
}
