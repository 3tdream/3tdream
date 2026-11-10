// GET /api/subscribe/confirm?token=… — verifies the signed token, sends one
// owner notice, and ALWAYS answers 303 (done / invalid). Never JSON, never 5xx.
// Location is `${SITE_URL}/subscribe/…`, relative when SITE_URL is missing.
import { type NextRequest } from "next/server";
import { isSubscribeSecretConfigured, verifySubscribeToken } from "@/lib/subscribe-token";
import { sendOwnerNotice } from "@/lib/subscribe-delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Base comes only from SITE_URL (never Host/Origin); trailing slashes stripped.
// Missing SITE_URL -> relative Location.
function siteBase(): string {
  return (process.env.SITE_URL ?? "").trim().replace(/\/+$/, "");
}

function redirectTo(path: "/subscribe/done" | "/subscribe/invalid"): Response {
  return new Response(null, {
    status: 303,
    headers: {
      Location: `${siteBase()}${path}`,
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export async function GET(req: NextRequest): Promise<Response> {
  try {
    if (!isSubscribeSecretConfigured() || !siteBase()) {
      console.error("[subscribe] not configured");
      return redirectTo("/subscribe/invalid");
    }

    const tokens = req.nextUrl.searchParams.getAll("token");
    if (tokens.length !== 1) return redirectTo("/subscribe/invalid");

    const payload = verifySubscribeToken(tokens[0]);
    if (!payload) return redirectTo("/subscribe/invalid");

    // Best-effort: sendOwnerNotice never throws and logs its own failure line.
    await sendOwnerNotice(payload.email, payload.replyLang);
    return redirectTo("/subscribe/done");
  } catch {
    return redirectTo("/subscribe/invalid");
  }
}
