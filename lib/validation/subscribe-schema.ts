// Validator for POST /api/subscribe (MC-557), mirroring lead-schema.ts but
// hand-written so the FIRST failing field is reported in the contract order:
// email -> company_website -> lang -> formRenderedAt. Also holds the bot gate.
import { SUBSCRIBE_MIN_FORM_AGE_MS, isReplyLang, type ReplyLang } from "@/lib/subscribe-values";

export const SUBSCRIBE_EMAIL_MAX_LENGTH = 254;
const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/;

export type SubscribeField = "email" | "company_website" | "replyLang" | "formRenderedAt";

export type SubscribeRequest = {
  /** Trimmed and lowercased. */
  email: string;
  company_website: string;
  formRenderedAt: number;
  lang: ReplyLang;
};

export type SubscribeParseResult =
  | { ok: true; data: SubscribeRequest }
  | { ok: false; error: "invalid_json" }
  | { ok: false; error: "invalid_field"; field: SubscribeField };

export function parseSubscribeRequest(raw: unknown): SubscribeParseResult {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { ok: false, error: "invalid_json" };
  }
  const body = raw as Record<string, unknown>;
  const bad = (field: SubscribeField): SubscribeParseResult => ({ ok: false, error: "invalid_field", field });

  if (typeof body.email !== "string") return bad("email");
  const email = body.email.trim().toLowerCase();
  if (email.length === 0 || email.length > SUBSCRIBE_EMAIL_MAX_LENGTH || !EMAIL_RE.test(email)) {
    return bad("email");
  }

  // Honeypot: absent or a string. null (or any non-string) is rejected.
  if (body.company_website !== undefined && typeof body.company_website !== "string") {
    return bad("company_website");
  }
  const company_website = typeof body.company_website === "string" ? body.company_website : "";

  // The contract field is `replyLang`.
  if (!isReplyLang(body.replyLang)) return bad("replyLang");

  if (
    typeof body.formRenderedAt !== "number" ||
    !Number.isInteger(body.formRenderedAt)
  ) {
    return bad("formRenderedAt");
  }

  return { ok: true, data: { email, company_website, formRenderedAt: body.formRenderedAt, lang: body.replyLang } };
}

/**
 * Bot gate: a non-empty honeypot, or a form younger than 3000 ms (a future
 * timestamp gives a negative age and also counts). True means suppress silently.
 */
export function isBotSubmission(
  data: Pick<SubscribeRequest, "company_website" | "formRenderedAt">,
  now: number = Date.now(),
): boolean {
  if (data.company_website.trim().length > 0) return true;
  return now - data.formRenderedAt < SUBSCRIBE_MIN_FORM_AGE_MS;
}
