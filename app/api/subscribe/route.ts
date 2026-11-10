// POST /api/subscribe — footer "Build Notes" subscription intake (MC-557).
// Stateless: validates, filters bots (honeypot + time-trap), signs an HMAC
// token (lib/subscribe-token.ts), best-effort sends a confirmation email.
// US-05/AC-07: the 202 response is BYTE-IDENTICAL across new / already-
// subscribed / malformed-but-schema-passing / honeypot / time-trap / not-
// configured / delivery-failed outcomes — never a conditional field, never
// a 500. Only a genuine zod failure returns 400.
import { NextRequest, NextResponse } from "next/server";
import { parseSubscribeRequest } from "@/lib/validation/subscribe-schema";
import { signSubscribeToken } from "@/lib/subscribe-token";
import { sendSubscribeConfirmationEmail } from "@/lib/subscribe-delivery";
import { buildSubscribeConfirmationEmail } from "@/lib/subscribe-values";

export const runtime = "nodejs";

// Minimum ms between client-stamped formRenderedAt and server receipt below
// which a submission is treated as bot traffic (US-04/AC-06).
const TIME_TRAP_MS = 3000;

export async function POST(req: NextRequest) {
  const receivedAt = Date.now();

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = parseSubscribeRequest(raw);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: "invalid_field", field: parsed.field },
      { status: 400 }
    );
  }

  const { email, replyLang, company_website, formRenderedAt } = parsed.data;

  const isHoneypotTriggered = company_website.trim().length > 0;
  const isTimeTrapTriggered = receivedAt - formRenderedAt < TIME_TRAP_MS;
  const suppressDelivery = isHoneypotTriggered || isTimeTrapTriggered;

  if (suppressDelivery) {
    // Never reveal which gate tripped, and never branch the response shape
    // (US-05/AC-07) — silently fold into the same 202 as every other case.
    return NextResponse.json({ ok: true, delivered: false }, { status: 202 });
  }

  const siteUrl = process.env.SITE_URL;
  if (!siteUrl) {
    console.log("[subscribe] not configured");
    return NextResponse.json({ ok: true, delivered: false }, { status: 202 });
  }

  const token = signSubscribeToken(email, replyLang);
  if (!token) {
    // signSubscribeToken returns null when SUBSCRIBE_TOKEN_SECRET is unset.
    console.log("[subscribe] not configured");
    return NextResponse.json({ ok: true, delivered: false }, { status: 202 });
  }

  const confirmUrl = `${siteUrl.replace(/\/$/, "")}/api/subscribe/confirm?token=${encodeURIComponent(token)}`;
  const content = buildSubscribeConfirmationEmail(confirmUrl, replyLang);
  const delivered = await sendSubscribeConfirmationEmail(email, content);

  return NextResponse.json({ ok: true, delivered }, { status: 202 });
}
