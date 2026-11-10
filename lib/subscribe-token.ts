// lib/subscribe-token.ts (MC-557) -- the SOLE state carrier for the Build Notes
// double opt-in flow. No database: { email, replyLang, exp } is HMAC-signed and
// embedded in the confirm-link URL; the mailbox holding that link is the only
// "storage". Verification is pure recomputation, never a lookup.
import crypto from "crypto";
import { SUBSCRIBE_TOKEN_TTL_MS, type ReplyLang } from "@/lib/subscribe-values";

const SECRET_ENV = "SUBSCRIBE_TOKEN_SECRET";

export interface SubscribeTokenPayload {
  email: string;
  replyLang: ReplyLang;
  exp: number;
}

function getSecret(): string | null {
  const secret = process.env[SECRET_ENV];
  return secret && secret.length > 0 ? secret : null;
}

function hmac(secret: string, data: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

// Returns null when SUBSCRIBE_TOKEN_SECRET is unset -- caller folds this into
// the byte-identical "202 { ok:true, delivered:false }" / "[subscribe] not
// configured" path (US-08/AC-12), never a throw.
export function signSubscribeToken(email: string, replyLang: ReplyLang): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const payload: SubscribeTokenPayload = {
    email,
    replyLang,
    exp: Date.now() + SUBSCRIBE_TOKEN_TTL_MS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const mac = hmac(secret, encodedPayload);
  return `${encodedPayload}.${mac}`;
}

// Never throws (US-06). Returns null on any malformed, tampered or expired
// token — never an object with outcome/payload, never a throw. Order, per ADR:
// length pre-check BEFORE crypto.timingSafeEqual (AC-08); MAC verified BEFORE
// JSON.parse (AC-08) so a tampered/truncated token never reaches the parser;
// exp checked last (AC-09). The entire body is wrapped in try/catch so no
// unexpected code path can escape as a throw.
export function verifySubscribeToken(token: string | null | undefined): SubscribeTokenPayload | null {
  try {
    const secret = getSecret();
    if (!secret || !token) return null;

    const dotIndex = token.lastIndexOf(".");
    if (dotIndex <= 0 || dotIndex === token.length - 1) return null;
    const encodedPayload = token.slice(0, dotIndex);
    const mac = token.slice(dotIndex + 1);

    // Recompute the expected MAC over the received header (encodedPayload).
    // Both sides are decoded from hex to raw bytes so timingSafeEqual gets
    // equal-typed Buffers. Hex is unambiguous: exactly 2 chars per byte, no
    // silent character skipping (unlike base64/base64url Buffer.from).
    const expectedHex = hmac(secret, encodedPayload); // hex string, always 64 chars
    const macBuf = Buffer.from(mac, "hex");
    const expectedBuf = Buffer.from(expectedHex, "hex");

    // Length pre-check BEFORE timingSafeEqual -- timingSafeEqual throws when
    // buffer lengths differ (AC-08). A MAC whose hex length != 64 (i.e. not a
    // valid 32-byte SHA-256 digest) is rejected here before the call.
    if (macBuf.length !== expectedBuf.length || macBuf.length === 0) return null;
    if (!crypto.timingSafeEqual(macBuf, expectedBuf)) return null;

    // MAC proven valid -- only now is it safe to decode/parse the payload.
    let payload: SubscribeTokenPayload;
    try {
      const json = Buffer.from(encodedPayload, "base64url").toString("utf8");
      const parsed = JSON.parse(json) as Partial<SubscribeTokenPayload>;
      if (
        typeof parsed !== "object" ||
        parsed === null ||
        typeof parsed.email !== "string" ||
        (parsed.replyLang !== "ru" && parsed.replyLang !== "en" && parsed.replyLang !== "he") ||
        typeof parsed.exp !== "number"
      ) {
        return null;
      }
      payload = { email: parsed.email, replyLang: parsed.replyLang, exp: parsed.exp };
    } catch {
      return null;
    }

    // Zero clock-skew grace, per ADR CONSEQUENCES.
    if (payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}
