// zod schema for POST /api/lead (MC-557). Role/industry/companySize codes
// are imported from lib/lead-values.ts (the single RU/EN/HE label source of
// truth also consumed by components/lead-form.tsx) so the form's <select>
// options and this server-side validation can never drift out of sync.
import { z } from "zod";
import {
  BRIEF_MAX_LENGTH,
  COMPANY_SIZE_VALUES,
  CONTACT_MAX_LENGTH,
  INDUSTRY_VALUES,
  NAME_MAX_LENGTH,
  OTHER_MAX_LENGTH,
  REPLY_LANG_VALUES,
  ROLE_VALUES,
} from "@/lib/lead-values";

// z.enum needs a non-empty literal tuple; a runtime `.refine` against the
// shared arrays avoids an unsafe tuple cast (that cast was the source of a
// prior TS2352 failure on this exact file) while still rejecting unknown
// codes with a 400, not a silent fallback.
export const leadSchema = z
  .object({
    name: z.string().trim().min(1, "name is required").max(NAME_MAX_LENGTH),
    contact: z.string().trim().min(1, "contact is required").max(CONTACT_MAX_LENGTH),
    role: z
      .string()
      .trim()
      .min(1, "role is required")
      .refine((v: string) => (ROLE_VALUES as readonly string[]).includes(v), { message: "invalid role" }),
    roleOther: z.string().trim().max(OTHER_MAX_LENGTH).optional(),
    industry: z
      .string()
      .trim()
      .min(1, "industry is required")
      .refine((v: string) => (INDUSTRY_VALUES as readonly string[]).includes(v), {
        message: "invalid industry",
      }),
    industryOther: z.string().trim().max(OTHER_MAX_LENGTH).optional(),
    companySize: z
      .string()
      .trim()
      .min(1, "companySize is required")
      .refine((v: string) => (COMPANY_SIZE_VALUES as readonly string[]).includes(v), {
        message: "invalid companySize",
      }),
    brief: z.string().trim().min(1, "brief is required").max(BRIEF_MAX_LENGTH, "brief is too long"),
    replyLang: z
      .string()
      .refine((v: string) => (REPLY_LANG_VALUES as readonly string[]).includes(v), {
        message: "replyLang must be one of ru, en, he",
      })
      .transform((v: string) => v as "ru" | "en" | "he"),
    // Required per contract -- present but expected empty for real humans.
    honeypot: z.string().max(200, "honeypot is too long"),
    // Must be an integer epoch-ms; a missing/non-integer value fails schema
    // validation (400), distinct from the bot-heuristic 202 path (AC-08).
    formRenderedAt: z.number().int("formRenderedAt must be an integer"),
  })
  .superRefine((data: { role: string; roleOther?: string; industry: string; industryOther?: string }, ctx: z.RefinementCtx) => {
    if (data.role === "other" && !data.roleOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["roleOther"],
        message: "roleOther is required when role is other",
      });
    }
    if (data.industry === "other" && !data.industryOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["industryOther"],
        message: "industryOther is required when industry is other",
      });
    }
  });

export type LeadSchemaInput = z.infer<typeof leadSchema>;

// Field-keyed zod error map, matching the API contracts 400 body shape.
export function formatLeadErrors(error: z.ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "_";
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

export type LeadParseResult =
  | { ok: true; data: LeadSchemaInput }
  | { ok: false; errors: Record<string, string[]> };

// Parses + validates a raw, untyped JSON body posted to POST /api/lead.
export function parseLeadRequest(raw: unknown): LeadParseResult {
  const result = leadSchema.safeParse(raw);
  if (!result.success) return { ok: false, errors: formatLeadErrors(result.error) };
  return { ok: true, data: result.data };
}
