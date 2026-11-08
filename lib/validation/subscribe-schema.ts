// zod schema for POST /api/subscribe (MC-557). Mirrors lib/validation/lead-schema.ts:
// genuinely malformed input (missing/wrong-typed email, missing/invalid
// replyLang enum, missing/non-numeric formRenderedAt) fails schema -> 400.
// A syntactically-valid-but-unusual email is NOT rejected here -- per AC-09
// it must reach the route and return the same 202 as any other submission;
// this schema only guards against shape, never against "is this subscribed".
import { z } from "zod";

export const REPLY_LANG_VALUES = ["ru", "en", "he"] as const;

export const subscribeSchema = z.object({
  email: z.string().trim().min(1, "email is required").email("email is invalid").max(255),
  replyLang: z.enum(REPLY_LANG_VALUES, {
    errorMap: () => ({ message: "replyLang must be one of ru, en, he" }),
  }),
  // Honeypot: optional, any non-empty value is a bot signal handled by the
  // route (silent 202), never a validation error. Trimmed so a stray space
  // (e.g. autofill quirks) isn't mistaken for a real honeypot fill.
  company_website: z.string().trim().max(200, "company_website is too long").optional().default(""),
  // Must be an integer epoch-ms; missing/non-numeric fails schema (400),
  // distinct from the time-trap bot heuristic (silent 202) the route applies
  // once this value is known to be a real number.
  formRenderedAt: z.number({ invalid_type_error: "formRenderedAt must be a number" }).int(
    "formRenderedAt must be an integer"
  ),
});

export type SubscribeSchemaInput = z.infer<typeof subscribeSchema>;

// Field-keyed zod error map, matching the API contracts 400 body shape:
// { ok: false, errors: { [field]: string[] } }.
export function formatSubscribeErrors(error: z.ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "_";
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

export type SubscribeParseResult =
  | { ok: true; data: SubscribeSchemaInput }
  | { ok: false; errors: Record<string, string[]> };

// Parses + validates a raw, untyped JSON body posted to POST /api/subscribe.
export function parseSubscribeRequest(raw: unknown): SubscribeParseResult {
  const result = subscribeSchema.safeParse(raw);
  if (!result.success) return { ok: false, errors: formatSubscribeErrors(result.error) };
  return { ok: true, data: result.data };
}
