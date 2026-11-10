// lib/subscribe-token.ts — stateless signed token: base64url(payload).hexMAC
// (HMAC-SHA256). The token is the ONLY state of the Build notes double opt-in.
// Never logs, never throws on verify. exp is epoch milliseconds.
import { createHmac, timingSafeEqual } from "node:crypto";
import {
  SUBSCRIBE_TOKEN_MAX,
  SUBSCRIBE_TOKEN_TTL_MS,
  isReplyLang,
  isValidEmail,
  type ReplyLang,
} from "@/lib/subscribe-values";

export type SubscribeTokenPayload = { email: string; replyLang: ReplyLang; exp: number };

const MAC_RE = /^[0-9a-f]{64}$/;

/** Secret from SUBSCRIBE_TOKEN_SECRET, or null when missing/empty. */
export function getSubscribeSecret(): string | null {
  const s = process.env.SUBSCRIBE_TOKEN_SECRET;
  return typeof s === "string" && s.length > 0 ? s : null;
}

function mac(payloadPart: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(payloadPart).digest();
}

/** Returns the signed token, or null when SUBSCRIBE_TOKEN_SECRET is missing/weak. */
export function signSubscribeToken(email: string, replyLang: ReplyLang, now: number = Date.now()): string | null {
  const secret = getSubscribeSecret();
  if (!secret) return null;
  const payload: SubscribeTokenPayload = { email, replyLang, exp: now + SUBSCRIBE_TOKEN_TTL_MS };
  const payloadPart = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${payloadPart}.${mac(payloadPart, secret).toString("hex")}`;
}

/** Verified payload or null. Order: shape, MAC length (decoded bytes), timingSafeEqual, payload, exp. */
export function verifySubscribeToken(token: unknown, now: number = Date.now()): SubscribeTokenPayload | null {
  try {
    const secret = getSubscribeSecret();
    if (!secret) return null;
    if (typeof token !== "string" || token.length === 0 || token.length > SUBSCRIBE_TOKEN_MAX) return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadPart, macPart] = parts;
    if (!payloadPart || !MAC_RE.test(macPart)) return null;

    const given = Buffer.from(macPart, "hex");
    const expected = mac(payloadPart, secret);
    if (given.length !== expected.length) return null;
    if (!timingSafeEqual(given, expected)) return null;

    const raw: unknown = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8"));
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return null;
    const { email, replyLang, exp } = raw as Record<string, unknown>;
    if (!isValidEmail(email) || email !== email.toLowerCase()) return null;
    if (!isReplyLang(replyLang)) return null;
    if (typeof exp !== "number" || !Number.isFinite(exp) || exp <= now) return null;
    return { email, replyLang, exp };
  } catch {
    return null;
  }
}
