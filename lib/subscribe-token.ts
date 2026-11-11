// lib/subscribe-token.ts — stateless signed token: base64url(payload).hexMAC
// (HMAC-SHA256). The token is the ONLY state of the Build notes double opt-in.
// Never logs; verify never throws. exp is epoch milliseconds (valid strictly before exp).
// No nonce: a valid token can be replayed until exp (accepted limit, see README).
// Runtime: Node only (node:crypto). Routes importing this must export runtime = "nodejs".
// Any failure (missing secret, bad MAC, bad payload, expired) yields null, which the confirm
// route maps to a 303 redirect to /subscribe/invalid.
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

/** SUBSCRIBE_TOKEN_SECRET, or null when missing or empty. Read per call. */
export function getSubscribeSecret(): string | null {
  const s = process.env.SUBSCRIBE_TOKEN_SECRET;
  return typeof s === "string" && s.length > 0 ? s : null;
}

function mac(payloadPart: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(payloadPart).digest();
}

/** Signed token. Throws when the secret is missing (routes check it first). */
export function signSubscribeToken(email: string, replyLang: ReplyLang, now: number = Date.now()): string {
  const secret = getSubscribeSecret();
  if (!secret) throw new Error("SUBSCRIBE_TOKEN_SECRET is not set");
  const payload: SubscribeTokenPayload = { email, replyLang, exp: now + SUBSCRIBE_TOKEN_TTL_MS };
  const payloadPart = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${payloadPart}.${mac(payloadPart, secret).toString("hex")}`;
}

/** Verified payload or null. Order: MAC format/length, timingSafeEqual, payload decode, shape, exp. */
export function verifySubscribeToken(
  token: unknown,
  now: number = Date.now(),
): SubscribeTokenPayload | null {
  try {
    const secret = getSubscribeSecret();
    if (!secret) return null;
    if (typeof token !== "string" || token.length === 0 || token.length > SUBSCRIBE_TOKEN_MAX) {
      return null;
    }
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
    if (!isValidEmail(email)) return null;
    if (!isReplyLang(replyLang)) return null;
    if (typeof exp !== "number" || !Number.isFinite(exp) || exp <= now) return null;
    return { email, replyLang, exp };
  } catch {
    return null;
  }
}
