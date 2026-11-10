// Request validation for POST /api/subscribe (MC-557). Mirrors lead-schema.ts.
// Field order is part of the API contract: the FIRST failing field in the order
// email, replyLang, formRenderedAt, company_website is the one reported.
import { z } from "zod";
import { SUBSCRIBE_EMAIL_MAX, isReplyLang, type ReplyLang } from "@/lib/subscribe-values";

export const SUBSCRIBE_FIELD_ORDER = ["email", "replyLang", "formRenderedAt", "company_website"] as const;
export type SubscribeField = (typeof SUBSCRIBE_FIELD_ORDER)[number];

const emailField = z
  .string()
  .transform((v: string) => v.trim().toLowerCase())
  .pipe(z.string().email().max(SUBSCRIBE_EMAIL_MAX));
const replyLangField = z.unknown().refine((v: unknown) => isReplyLang(v));
const formRenderedAtField = z.number().int().finite();
const honeypotField = z.string().max(500).optional();

export type SubscribeInput = {
  email: string;
  replyLang: ReplyLang;
  formRenderedAt: number;
  company_website: string;
};

export type SubscribeParseResult =
  | { ok: true; data: SubscribeInput }
  | { ok: false; field: SubscribeField };

/** Validates a raw JSON body; on failure reports the first failing field in contract order. */
export function parseSubscribeRequest(raw: unknown): SubscribeParseResult {
  const body: Record<string, unknown> =
    raw !== null && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};

  const email = emailField.safeParse(body.email);
  if (!email.success) return { ok: false, field: "email" };

  const lang = replyLangField.safeParse(body.replyLang);
  if (!lang.success || !isReplyLang(body.replyLang)) return { ok: false, field: "replyLang" };

  const rendered = formRenderedAtField.safeParse(body.formRenderedAt);
  if (!rendered.success) return { ok: false, field: "formRenderedAt" };

  const honeypot = honeypotField.safeParse(body.company_website);
  if (!honeypot.success) return { ok: false, field: "company_website" };

  return {
    ok: true,
    data: {
      email: email.data,
      replyLang: body.replyLang,
      formRenderedAt: rendered.data,
      company_website: honeypot.data ?? "",
    },
  };
}
