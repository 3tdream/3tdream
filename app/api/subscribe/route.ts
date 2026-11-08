// POST /api/subscribe — footer "Build Notes" subscription intake (MC-557).
// Stateless: validates, filters bots (honeypot + time-trap), signs an HMAC
// token (lib/subscribe-token.ts), best-effort sends a confirmation email.
// US-05/AC-09: the 202 response is BYTE-IDENTICAL across new / already-
// subscribed / malformed-but-schema-passing / honeypot / time-trap / not-
// configured / delivery-failed outcomes — never a conditional field, never
// a 500.
import { NextRequest, NextResponse } from "next/server";
import { parseSubscribeRequest } from "@/lib/validation/subscribe-schema";
import { signSubscribeToken } from "@/lib/subscribe-token";
import { sendSubscribeConfirmationEmail } from "@/lib/subscribe-delivery";
import { buildSubscribeConfirmationEmail } from "@/lib/subscribe-values";

export const runtime = "nodejs";

// Minimum ms between client-stamped formRenderedAt and server receipt below
// which a submission is treated as bot traffic (AC-08).
const TIME_TRAP_MS = 3000;

// IP-based sliding-window rate limit: best-effort abuse guard for the
// public, unauthenticated POST endpoint (no DB per ADR, so in-memory only —
// resets on cold start, which is an accepted tradeoff for a low-volume form).
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateLimitHits = new Map<string, number[]>();

function isRateLimited(ip: string, now: number): boolean {
  const hits = (rateLimitHits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  hits.push(now);
  rateLimitHits.set(ip, hits);
  if (rateLimitHits.size > 5000) {
    // Guard against unbounded memory growth from a sustained distributed attack.
    rateLimitHits.clear();
  }
  return hits.length > RATE_LIMIT_MAX;
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  const receivedAt = Date.now();

  if (isRateLimited(clientIp(req), receivedAt)) {
    console.warn("[subscribe] rate limited");
    return NextResponse.json({ ok: true, delivered: false }, { status: 202 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, errors: { _: ["invalid JSON body"] } }, { status: 400 });
  }

  const parsed = parseSubscribeRequest(raw);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 });
  }

  const { email, replyLang, company_website, formRenderedAt } = parsed.data;

  const isHoneypotTriggered = company_website.trim().length > 0;
  const isTimeTrapTriggered = receivedAt - formRenderedAt < TIME_TRAP_MS;

  if (isHoneypotTriggered || isTimeTrapTriggered) {
    console.warn("[subscribe] bot rejected", isHoneypotTriggered ? "honeypot" : "time-trap");
    return NextResponse.json({ ok: true, delivered: false }, { status: 202 });
  }

  const secret = process.env.SUBSCRIBE_TOKEN_SECRET;
  const siteUrl = process.env.SITE_URL;
  const resendKey = process.env.RESEND_API_KEY;

  if (!secret || !siteUrl || !resendKey) {
    console.log("[subscribe] not configured");
    return NextResponse.json({ ok: true, delivered: false }, { status: 202 });
  }

  try {
    const token = signSubscribeToken(email, secret, replyLang);
    const confirmUrl = `${siteUrl.replace(/\/$/, "")}/api/subscribe/confirm?token=${encodeURIComponent(token)}`;
    const { subject, html } = buildSubscribeConfirmationEmail(confirmUrl, replyLang);

    const delivered = await sendSubscribeConfirmationEmail(email, subject, html);
    if (!delivered) {
      console.error("[subscribe] delivery failed");
    }
    return NextResponse.json({ ok: true, delivered }, { status: 202 });
  } catch (err) {
    console.error("[subscribe] delivery failed", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ ok: true, delivered: false }, { status: 202 });
  }
}
