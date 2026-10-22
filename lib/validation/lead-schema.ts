// zod schema for POST /api/lead. Every validator's custom message IS the
// final ValidationErrorKey string (e.g. "name_required") — no separate
// code->key mapping step, so the contract and the schema can never drift.
import { z } from "zod";
import {
  LEAD_ROLE_VALUES,
  LEAD_INDUSTRY_VALUES,
  LEAD_COMPANY_SIZE_VALUES,
} from "@/lib/lead-values";
import type { LeadRequestBody, ValidationErrorKey } from "@/types/lead";

// email OR intl phone OR @messenger-handle — permissive enough for RU/EN/HE
// input, strict enough to reject obvious garbage.
const CONTACT_PATTERN =
  /^(?:[^\s@]+@[^\s@]+\.[^\s@]+|\+?[0-9][0-9\s\-()]{6,19}|@?[\w.-]{3,32})$/u;

const VALID_ERROR_KEYS = new Set<string>([
  "name_required",
  "name_invalid",
  "contact_required",
  "contact_invalid",
  "brief_required",
  "brief_invalid",
  "brief_length",
  "role_required",
  "role_invalid",
  "industry_required",
  "industry_invalid",
  "companySize_required",
  "companySize_invalid",
  "replyLang_required",
  "replyLang_invalid",
  "body_invalid",
]);

export const leadRequestSchema = z.object({
  name: z
    .string({ required_error: "name_required", invalid_type_error: "name_invalid" })
    .trim()
    .min(2, "name_required")
    .max(80, "name_invalid"),
  contact: z
    .string({ required_error: "contact_required", invalid_type_error: "contact_invalid" })
    .trim()
    .min(3, "contact_required")
    .max(120, "contact_invalid")
    .regex(CONTACT_PATTERN, "contact_invalid"),
  brief: z
    .string({ required_error: "brief_required", invalid_type_error: "brief_invalid" })
    .trim()
    .min(1, "brief_required")
    .min(20, "brief_length")
    .max(2000, "brief_length"),
  role: z
    .string({ required_error: "role_required", invalid_type_error: "role_invalid" })
    .min(1, "role_required")
    .refine((v: string) => (LEAD_ROLE_VALUES as readonly string[]).includes(v), "role_invalid"),
  industry: z
    .string({ required_error: "industry_required", invalid_type_error: "industry_invalid" })
    .min(1, "industry_required")
    .refine(
      (v: string) => (LEAD_INDUSTRY_VALUES as readonly string[]).includes(v),
      "industry_invalid"
    ),
  companySize: z
    .string({
      required_error: "companySize_required",
      invalid_type_error: "companySize_invalid",
    })
    .min(1, "companySize_required")
    .refine(
      (v: string) => (LEAD_COMPANY_SIZE_VALUES as readonly string[]).includes(v),
      "companySize_invalid"
    ),
  replyLang: z
    .string({ required_error: "replyLang_required", invalid_type_error: "replyLang_invalid" })
    .min(1, "replyLang_required")
    .refine((v: string) => v === "ru" || v === "en" || v === "he", "replyLang_invalid"),
  // honeypot — never produces a validation error, just needs to be a string.
  company_website: z.string().optional().default(""),
  // time-trap stamp — any shape failure maps to the generic body_invalid
  // bucket (formRenderedAt is NOT one of the 6 user-facing validated fields).
  formRenderedAt: z.number({
    required_error: "body_invalid",
    invalid_type_error: "body_invalid",
  }),
});

export type LeadSchemaInput = z.infer<typeof leadRequestSchema>;

export type LeadValidationResult =
  | { ok: true; data: LeadRequestBody }
  | { ok: false; error: ValidationErrorKey };

/** Parses + validates a raw, untyped request body into a LeadRequestBody. */
export function validateLeadRequest(raw: unknown): LeadValidationResult {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { ok: false, error: "body_invalid" };
  }
  const result = leadRequestSchema.safeParse(raw);
  if (result.success) {
    return { ok: true, data: result.data as LeadRequestBody };
  }
  const message = result.error.issues[0]?.message ?? "body_invalid";
  const key = VALID_ERROR_KEYS.has(message) ? (message as ValidationErrorKey) : "body_invalid";
  return { ok: false, error: key };
}
