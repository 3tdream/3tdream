// Validation for POST /api/subscribe. Mirrors lead-schema.ts (zod, shared
// constants) but checks fields in the fixed contract order — email, replyLang,
// formRenderedAt, company_website — so the FIRST failure names the field.
import { z } from "zod";
import { SUBSCRIBE_EMAIL_MAX, isReplyLang, isValidEmail, type ReplyLang } from "@/lib/subscribe-values";

export type SubscribeLang = ReplyLang;

export const subscribeFieldSchemas = {
  email: z
    .string()
    .trim()
    .max(SUBSCRIBE_EMAIL_MAX)
    .transform((v: string) => v.toLowerCase())
    .refine((v: string) => isValidEmail(v), { message: "invalid email" }),
  replyLang: z
    .string()
    .refine((v: string) => isReplyLang(v), { message: "replyLang must be one of ru, en, he" })
    .transform((v: string) => v as SubscribeLang),
  formRenderedAt: z.number().finite("formRenderedAt must be a finite number"),
  company_website: z.string().max(500, "company_website is too long").optional().default(""),
};

export type SubscribeRequest = {
  email: string;
  replyLang: SubscribeLang;
  formRenderedAt: number;
  company_website: string;
};

export type SubscribeField = keyof typeof subscribeFieldSchemas;

export type SubscribeParseResult =
  | { ok: true; data: SubscribeRequest }
  | { ok: false; field: SubscribeField };

const ORDER: readonly SubscribeField[] = ["email", "replyLang", "formRenderedAt", "company_website"];

export function parseSubscribeRequest(raw: unknown): SubscribeParseResult {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { ok: false, field: "email" };
  }
  const body = raw as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const field of ORDER) {
    const result = subscribeFieldSchemas[field].safeParse(body[field]);
    if (!result.success) return { ok: false, field };
    out[field] = result.data;
  }
  return { ok: true, data: out as SubscribeRequest };
}
