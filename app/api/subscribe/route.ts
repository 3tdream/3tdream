// POST /api/subscribe — footer "Build Notes" subscription intake (MC-557).
// Stateless: validates, filters bots (honeypot + time-trap), signs an HMAC
// token (lib/subscribe-token.ts), best-effort sends a confirmation email.
// US-05/AC-03: the 202 response is BYTE-IDENTICAL across new / already-
// subscribed / honeypot / time-trap / not-configured / delivery-failed
// outcomes — never a conditional field, never a 500.
import { NextRequest, NextResponse } from "next/server";
import { parseSubscribeRequest } from "@/lib/validation/subscribe-schema";
import { signSubscribeToken } from "@/lib/subscribe-token";
import { sendSubscribeConfirmationEmail } from "@/lib/subscribe-delivery";
import { buildSubscribeConfirmationEmail, SUBSCRIBE_TIMING_TRAP_MS } from "@/lib/subscribe-values";

export const runtime = "nodejs";

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
    return NextResponse.json({ ok: false, error: "invalid_field", field: parsed.field }, { status: 400 });
  }

  const { email, replyLang, company_website, formRenderedAt } = parsed.data;

  const isHoneypotTriggered = company_website.trim().length > 0;
  const isTimeTrapTriggered = receivedAt - formRenderedAt < SUBSCRIBE_TIMING_TRAP_MS;

  if (isHoneypotTriggered || isTimeTrapTriggered) {
    console.warn("[subscribe] bot suspected", isHoneypotTriggered ? "honeypot" : "time-trap");
    return NextResponse.json({ ok: true, delivered: false }, { status: 202 });
  }

  const secret = process.env.SUBSCRIBE_TOKEN_SECRET;
  const siteUrl = process.env.SITE_URL;

  if (!secret || !siteUrl) {
    console.log("[subscribe] not configured");
    return NextResponse.json({ ok: true, delivered: false }, { status: 202 });
  }

  try {
    const token = signSubscribeToken(email, replyLang, secret);
    const confirmUrl = `${siteUrl.replace(/\/$/, "")}/api/subscribe/confirm?token=${encodeURIComponent(token)}`;
    const content = buildSubscribeConfirmationEmail(confirmUrl, replyLang);

    const delivered = await sendSubscribeConfirmationEmail(email, content);
    return NextResponse.json({ ok: true, delivered }, { status: 202 });
  } catch (err) {
    console.error("[subscribe] delivery failed", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ ok: true, delivered: false }, { status: 202 });
  }
}
