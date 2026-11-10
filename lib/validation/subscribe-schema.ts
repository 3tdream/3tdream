// zod schema for POST /api/subscribe (MC-557). Mirrors lib/validation/lead-schema.ts.
// Field order is part of the API contract: the FIRST failing field in the order
// email, replyLang, formRenderedAt, company_website is the one reported.
import { z } from "zod";
import { SUBSCRIBE_EMAIL_MAX, isReplyLang, isValidEmail, type ReplyLang } from "@/lib/subscribe-values";

export const SUBSCRIBE_FIELD_ORDER = ["email", "replyLang", "formRenderedAt", "company_website"] as const;
export type SubscribeField = (typeof SUBSCRIBE_FIELD_ORDER)[number];

export const subscribeSchema = z.object({
  email: z
    .string()
    .max(SUBSCRIBE_EMAIL_MAX * 2)
    .transform((v: string) => v.trim().toLowerCase())
    .refine((v: string) => isValidEmail(v), { message: "email is invalid" }),
  replyLang: z.unknown().refine((v: unknown) => isReplyLang(v), {
    message: "replyLang must be one of ru, en, he",
  }),
  formRenderedAt: z.number().int("formRenderedAt must be an integer"),
  company_website: z.string().max(500, "company_website is too long").optional(),
});

export type SubscribeInput = {
  email: string;
  replyLang: ReplyLang;
  formRenderedAt: number;
  company_website: string;
};

export type SubscribeParseResult = { ok: true; data: SubscribeInput } | { ok: false; field: SubscribeField };

function rank(issue: z.ZodIssue): number {
  const idx = SUBSCRIBE_FIELD_ORDER.indexOf(String(issue.path[0]) as SubscribeField);
  return idx === -1 ? 0 : idx;
}

/** Validates a raw JSON body; on failure returns the first failing field in contract order. */
export function parseSubscribeRequest(raw: unknown): SubscribeParseResult {
  const result = subscribeSchema.safeParse(raw);
  if (!result.success) {
    const first = [...result.error.issues].sort((a, b) => rank(a) - rank(b))[0];
    const field = first ? SUBSCRIBE_FIELD_ORDER[rank(first)] : "email";
    return { ok: false, field };
  }
  const { email, replyLang, formRenderedAt, company_website } = result.data;
  if (!isReplyLang(replyLang)) return { ok: false, field: "replyLang" };
  return { ok: true, data: { email, replyLang, formRenderedAt, company_website: company_website ?? "" } };
}
