// POST /api/subscribe — Build notes double opt-in intake (MC-557).
// Stateless: nothing is stored or read. Every non-400 path returns the SAME
// 202 shape { ok: true, delivered } so the address list cannot be probed.
// Order: JSON -> schema -> honeypot/timing -> config -> sign -> send.
// Logs only cause categories — never an address, a token or a link.
import { NextResponse, type NextRequest } from "next/server";
import { parseSubscribeRequest } from "@/lib/validation/subscribe-schema";
import { getSubscribeSecret, signSubscribeToken } from "@/lib/subscribe-token";
import { sendConfirmationEmail } from "@/lib/subscribe-delivery";
import { SUBSCRIBE_MIN_FILL_MS, getSiteOrigin } from "@/lib/subscribe-values";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const accepted = (delivered: boolean) =>
  NextResponse.json({ ok: true, delivered }, { status: 202, headers: { "Cache-Control": "no-store" } });

const rejected = (body: Record<string, unknown>) =>
  NextResponse.json(body, { status: 400, headers: { "Cache-Control": "no-store" } });

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return rejected({ ok: false, error: "invalid_json" });
  }

  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return rejected({ ok: false, error: "invalid_json" });
  }

  const parsed = parseSubscribeRequest(raw);
  if (!parsed.ok) {
    return rejected({ ok: false, error: "invalid_field", field: parsed.field });
  }
  const { email, replyLang, formRenderedAt, company_website } = parsed.data;

  // Bots: honeypot filled, or submitted < 3000 ms after mount (a future-dated
  // formRenderedAt gives a negative delta and is a hit too). Nothing signed/sent.
  if (company_website.length > 0 || Date.now() - formRenderedAt < SUBSCRIBE_MIN_FILL_MS) {
    return accepted(false);
  }

  try {
    if (!getSubscribeSecret() || !getSiteOrigin() || !process.env.RESEND_API_KEY?.trim()) {
      console.log("[subscribe] not configured");
      return accepted(false);
    }
    const token = signSubscribeToken(email, replyLang);
    const outcome = await sendConfirmationEmail(email, replyLang, token);
    return accepted(outcome === "sent");
  } catch {
    console.error("[subscribe] delivery failed: Error");
    return accepted(false);
  }
}
