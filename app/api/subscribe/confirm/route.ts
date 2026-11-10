// GET /api/subscribe/confirm?token= — verifies the signed token, sends ONE owner
// e-mail and redirects. Always 303 + no-store, never JSON, never a 500.
// Location is built from SITE_URL (relative /subscribe/invalid when it is missing).
// HEAD is exported explicitly: Next would otherwise run GET for HEAD probes
// (link scanners), which could send the owner e-mail with no human click.
import type { NextRequest } from "next/server";
import { verifySubscribeToken } from "@/lib/subscribe-token";
import { sendOwnerEmail } from "@/lib/subscribe-delivery";
import { SUBSCRIBE_TOKEN_MAX, getSiteOrigin } from "@/lib/subscribe-values";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function redirectTo(path: "/subscribe/done" | "/subscribe/invalid"): Response {
  const origin = getSiteOrigin();
  // Relative path only when SITE_URL is missing.
  const location = origin ? `${origin}${path}` : "/subscribe/invalid";
  return new Response(null, { status: 303, headers: { Location: location, "Cache-Control": "no-store" } });
}

export async function GET(req: NextRequest) {
  try {
    const token = new URL(req.url).searchParams.get("token");
    if (!token || token.length > SUBSCRIBE_TOKEN_MAX) return redirectTo("/subscribe/invalid");

    const payload = verifySubscribeToken(token);
    if (!payload) return redirectTo("/subscribe/invalid");

    try {
      await sendOwnerEmail(payload.email, payload.replyLang);
    } catch {
      console.error("[subscribe] owner notice failed: unexpected");
    }
    return redirectTo("/subscribe/done");
  } catch {
    return redirectTo("/subscribe/invalid");
  }
}

export async function HEAD() {
  return redirectTo("/subscribe/invalid");
}
