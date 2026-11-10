// POST /api/subscribe — Build notes double opt-in intake (MC-557).
// Stateless: nothing is stored or read. Every non-400 path returns the SAME
// 202 shape { ok: true, delivered } so the address list cannot be probed.
// Order: JSON -> schema -> honeypot/timing -> config -> sign -> send.
// Logs only cause categories — never an address, a token or a Resend body.
import { NextResponse, type NextRequest } from "next/server";
import { parseSubscribeRequest } from "@/lib/validation/subscribe-schema";
import { getSubscribeSecret, signSubscribeToken } from "@/lib/subscribe-token";
import { sendConfirmationEmail } from "@/lib/subscribe-delivery";
import { SUBSCRIBE_MIN_FILL_MS, getSiteOrigin } from "@/lib/subscribe-values";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const accepted = (delivered: boolean) =>
  NextResponse.json({ ok: true, delivered }, { status: 202, headers: { "Cache-Control": "no-store" } });

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = parseSubscribeRequest(raw);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: "invalid_field", field: parsed.field }, { status: 400 });
  }
  const { email, replyLang, formRenderedAt, company_website } = parsed.data;

  // Bots: honeypot filled, or submitted < 3000 ms after mount (a future-dated
  // formRenderedAt gives a negative delta and is a hit too). Nothing sent/signed.
  if (company_website.trim().length > 0 || Date.now() - formRenderedAt < SUBSCRIBE_MIN_FILL_MS) {
    return accepted(false);
  }

  try {
    if (!getSubscribeSecret() || !getSiteOrigin() || !process.env.RESEND_API_KEY?.trim()) {
      console.log("[subscribe] not configured");
      return accepted(false);
    }
    const token = signSubscribeToken(email, replyLang);
    if (!token) {
      console.log("[subscribe] not configured");
      return accepted(false);
    }
    const outcome = await sendConfirmationEmail(email, replyLang, token);
    return accepted(outcome === "sent");
  } catch {
    console.error("[subscribe] delivery failed: unexpected");
    return accepted(false);
  }
}
