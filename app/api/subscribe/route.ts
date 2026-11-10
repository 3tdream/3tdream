// POST /api/subscribe — Build Notes double opt-in intake (MC-557).
// Order: invalid_json 400 -> invalid_field 400 -> bot gate 202 -> missing
// config 202 -> issue token + send. Every non-400 branch returns the same 202
// shape. Never logs the e-mail or the token; env is read per request.
import { type NextRequest } from "next/server";
import { isSubscribeSecretConfigured, issueSubscribeToken } from "@/lib/subscribe-token";
import { sendConfirmationEmail } from "@/lib/subscribe-delivery";
import { isBotSubmission, parseSubscribeRequest } from "@/lib/validation/subscribe-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "no-store" };

function json(body: Record<string, unknown>, status: number): Response {
  return Response.json(body, { status, headers: HEADERS });
}

const accepted = (delivered: boolean): Response => json({ ok: true, delivered }, 202);

/** SITE_URL as given (trimmed, trailing slashes stripped); null when empty. */
function resolveSiteUrl(raw: string | undefined): string | null {
  const base = (raw ?? "").trim().replace(/\/+$/, "");
  return base.length > 0 ? base : null;
}

export async function POST(req: NextRequest): Promise<Response> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const parsed = parseSubscribeRequest(raw);
  if (!parsed.ok) {
    return parsed.error === "invalid_json"
      ? json({ ok: false, error: "invalid_json" }, 400)
      : json({ ok: false, error: "invalid_field", field: parsed.field }, 400);
  }

  try {
    const { email, lang } = parsed.data;
    if (isBotSubmission(parsed.data)) return accepted(false);

    const siteUrl = resolveSiteUrl(process.env.SITE_URL);
    if (!isSubscribeSecretConfigured() || !siteUrl || !process.env.RESEND_API_KEY) {
      console.error("[subscribe] not configured");
      return accepted(false);
    }

    const token = issueSubscribeToken(email, lang);
    if (!token) {
      console.error("[subscribe] not configured");
      return accepted(false);
    }

    const confirmUrl = `${siteUrl}/api/subscribe/confirm?token=${encodeURIComponent(token)}`;
    const delivered = await sendConfirmationEmail(email, lang, confirmUrl);
    return accepted(delivered);
  } catch {
    console.error("[subscribe] delivery failed: error");
    return accepted(false);
  }
}
