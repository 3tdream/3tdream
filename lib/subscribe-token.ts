// Stateless HMAC token for the Build Notes double opt-in (MC-557).
// Format: base64url(JSON{email, replyLang, exp}) + "." + hexMAC. No storage.
// Env is read at call time only, never at module scope.
import { createHmac, timingSafeEqual } from "node:crypto";
import {
  SUBSCRIBE_TOKEN_TTL_MS,
  isReplyLang,
  type ReplyLang,
} from "@/lib/subscribe-values";

export type SubscribeTokenPayload = { email: string; replyLang: ReplyLang; exp: number };

const MAC_HEX_LENGTH = 64;
const MAC_HEX_RE = /^[0-9a-f]{64}$/;
const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/;
const EMAIL_MAX = 254;

function getSecret(): string | null {
  const secret = process.env.SUBSCRIBE_TOKEN_SECRET;
  return secret ? secret : null;
}

function mac(secret: string, data: string): string {
  return createHmac("sha256", secret).update(data).digest("hex");
}

/** Returns null (never throws) when the secret is missing. */
export function issueSubscribeToken(email: string, lang: ReplyLang, now: number = Date.now()): string | null {
  try {
    const secret = getSecret();
    if (!secret) return null;
    const payload: SubscribeTokenPayload = {
      email,
      replyLang: lang,
      exp: now + SUBSCRIBE_TOKEN_TTL_MS,
    };
    const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
    return `${encoded}.${mac(secret, encoded)}`;
  } catch {
    return null;
  }
}

/**
 * Contract name. Accepts (email, lang, now?) or a payload object
 * { email, replyLang, exp? } (exp defaults to now + TTL). Returns null when the
 * secret is missing; never throws.
 */
export function signSubscribeToken(
  input: string | { email: string; replyLang: ReplyLang; exp?: number },
  lang?: ReplyLang,
  now: number = Date.now(),
): string | null {
  try {
    if (typeof input === "string") return issueSubscribeToken(input, lang ?? "en", now);
    const secret = getSecret();
    if (!secret) return null;
    const payload: SubscribeTokenPayload = {
      email: input.email,
      replyLang: input.replyLang,
      exp: typeof input.exp === "number" ? input.exp : now + SUBSCRIBE_TOKEN_TTL_MS,
    };
    const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
    return `${encoded}.${mac(secret, encoded)}`;
  } catch {
    return null;
  }
}

/** True when the token secret is present. */
export function isSubscribeSecretConfigured(): boolean {
  return getSecret() !== null;
}

/**
 * Order: split on last "." -> MAC length/hex shape -> buffer length ->
 * timingSafeEqual -> only then decode payload, parse, check exp/email/lang.
 * Never throws; any failure returns null.
 */
export function verifySubscribeToken(token: unknown): SubscribeTokenPayload | null {
  try {
    if (typeof token !== "string" || token.length === 0) return null;
    const secret = getSecret();
    if (!secret) return null;

    const dot = token.lastIndexOf(".");
    if (dot <= 0) return null;
    const encoded = token.slice(0, dot);
    const given = token.slice(dot + 1);

    if (given.length !== MAC_HEX_LENGTH || !MAC_HEX_RE.test(given)) return null;
    const a = Buffer.from(given, "hex");
    const b = Buffer.from(mac(secret, encoded), "hex");
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;

    const parsed: unknown = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (typeof parsed !== "object" || parsed === null) return null;
    const p = parsed as Record<string, unknown>;
    if (typeof p.exp !== "number" || !Number.isFinite(p.exp) || p.exp <= Date.now()) return null;
    if (!isReplyLang(p.replyLang)) return null;
    if (typeof p.email !== "string" || p.email.length === 0 || p.email.length > EMAIL_MAX || !EMAIL_RE.test(p.email)) {
      return null;
    }
    return { email: p.email, replyLang: p.replyLang, exp: p.exp };
  } catch {
    return null;
  }
}
