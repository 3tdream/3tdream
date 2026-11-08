// lib/subscribe-token.ts — stateless signed token: sole state carrier for
// the double opt-in subscription (no DB). HMAC-SHA256 over base64url(JSON),
// verified via timingSafeEqual on the RAW base64url signature string before
// any JSON.parse (MAC-before-parse). Never throws — always returns null on
// any malformed/tampered/expired input (US-06, AC-10, AC-12).
import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { SUBSCRIBE_TOKEN_TTL_MS } from "@/lib/subscribe-values";

export interface SubscribeTokenPayload {
  email: string;
  replyLang: string;
  exp: number;
  nonce: string;
}
const B64URL_RE = /^[A-Za-z0-9_-]+$/;

function hmac(payloadB64: string, secret: string): string {
  return createHmac("sha256", secret).update(payloadB64).digest("base64url");
}

export function signSubscribeToken(email: string, secret: string, replyLang = "en"): string {
  const payload: SubscribeTokenPayload = {
    email,
    replyLang,
    exp: Date.now() + SUBSCRIBE_TOKEN_TTL_MS,
    nonce: randomBytes(16).toString("base64url"),
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sigB64 = hmac(payloadB64, secret);
  return `${payloadB64}.${sigB64}`;
}

/**
 * Verifies a token produced by signSubscribeToken. NEVER throws:
 * - rejects malformed base64url shape before any MAC comparison (AC-12)
 * - compares MAC via timingSafeEqual, guarding length mismatch first so
 *   timingSafeEqual itself can never throw on attacker-controlled input
 * - only after MAC verifies does it JSON.parse the payload (AC-10)
 * - enforces strict exp < Date.now() rejection (AC-11)
 */
export function verifySubscribeToken(token: string | null | undefined, secret: string): SubscribeTokenPayload | null {
  try {
    if (!token || typeof token !== "string") return null;
    const dotIndex = token.indexOf(".");
    if (dotIndex <= 0 || dotIndex === token.length - 1) return null;
    const payloadB64 = token.slice(0, dotIndex);
    const sigB64 = token.slice(dotIndex + 1);
    if (!B64URL_RE.test(payloadB64) || !B64URL_RE.test(sigB64)) return null;

    const expectedSigB64 = hmac(payloadB64, secret);
    const expectedBuf = Buffer.from(expectedSigB64, "utf8");
    const receivedBuf = Buffer.from(sigB64, "utf8");
    if (expectedBuf.length !== receivedBuf.length) return null; // avoid timingSafeEqual throw
    if (!timingSafeEqual(expectedBuf, receivedBuf)) return null;

    const json = Buffer.from(payloadB64, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as Partial<SubscribeTokenPayload>;
    if (
      typeof parsed.email !== "string" ||
      !parsed.email ||
      typeof parsed.replyLang !== "string" ||
      !parsed.replyLang ||
      typeof parsed.exp !== "number" ||
      typeof parsed.nonce !== "string"
    ) {
      return null;
    }
    if (parsed.exp < Date.now()) return null; // strict, no grace window (AC-11)

    return { email: parsed.email, replyLang: parsed.replyLang, exp: parsed.exp, nonce: parsed.nonce };
  } catch {
    return null;
  }
}
