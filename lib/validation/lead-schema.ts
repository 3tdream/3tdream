// zod-backed validation for POST /api/lead. Field checks run in STRICT spec
// order (AC-04: name -> contact -> role -> industry -> companySize -> brief
// -> replyLang -> formRenderedAt) so the first failing field always wins,
// independent of zod's internal issue ordering. No React/content/i18n
// imports — this stays a pure leaf module.
import { z } from "zod";
import {
  ROLE_VALUES,
  INDUSTRY_VALUES,
  COMPANY_SIZE_VALUES,
  REPLY_LANG_VALUES,
  BRIEF_MIN_LENGTH,
  BRIEF_MAX_LENGTH,
} from "@/lib/lead-values";
import type { LeadRequestBody, ReplyLang, ValidationErrorKey } from "@/types/lead";

// Shape-only parse: every field is optional/unknown here so a missing or
// wrong-typed field never throws — it just fails the targeted check below.
const rawShape = z.object({
  name: z.unknown().optional(),
  contact: z.unknown().optional(),
  brief: z.unknown().optional(),
  role: z.unknown().optional(),
  industry: z.unknown().optional(),
  companySize: z.unknown().optional(),
  replyLang: z.unknown().optional(),
  company_website: z.unknown().optional(),
  formRenderedAt: z.unknown().optional(),
});

const nonEmptyString = z.string().trim().min(1);

export type LeadValidationResult =
  | { ok: true; data: LeadRequestBody }
  | { ok: false; error: ValidationErrorKey };

/** Parses + validates a raw, untyped JSON body into a LeadRequestBody. */
export function validateLeadRequest(raw: unknown): LeadValidationResult {
  const shaped = rawShape.safeParse(raw);
  if (!shaped.success) return { ok: false, error: "name_required" };
  // Route through `unknown` first: the parsed shape's properties are all
  // individually optional/unknown, so TS considers it an insufficient
  // structural overlap with Record<string, unknown> (TS2352) without this.
  const body = shaped.data as unknown as Record<string, unknown>;

  const name = nonEmptyString.safeParse(body.name);
  if (!name.success) return { ok: false, error: "name_required" };

  const contact = nonEmptyString.safeParse(body.contact);
  if (!contact.success) return { ok: false, error: "contact_required" };

  const role = nonEmptyString.safeParse(body.role);
  if (!role.success || !ROLE_VALUES.includes(role.data)) {
    return { ok: false, error: "role_required" };
  }

  const industry = nonEmptyString.safeParse(body.industry);
  if (!industry.success || !INDUSTRY_VALUES.includes(industry.data)) {
    return { ok: false, error: "industry_required" };
  }

  const companySize = nonEmptyString.safeParse(body.companySize);
  if (!companySize.success || !COMPANY_SIZE_VALUES.includes(companySize.data)) {
    return { ok: false, error: "companySize_required" };
  }

  const brief = nonEmptyString.safeParse(body.brief);
  if (!brief.success) return { ok: false, error: "brief_required" };
  if (brief.data.length < BRIEF_MIN_LENGTH || brief.data.length > BRIEF_MAX_LENGTH) {
    return { ok: false, error: "brief_length" };
  }

  const replyLang = nonEmptyString.safeParse(body.replyLang);
  const replyLangValue = replyLang.success ? (replyLang.data as ReplyLang) : undefined;
  if (!replyLang.success || !replyLangValue || !REPLY_LANG_VALUES.includes(replyLangValue)) {
    return { ok: false, error: "replyLang_required" };
  }

  const formRenderedAtRaw = body.formRenderedAt;
  const formRenderedAt =
    typeof formRenderedAtRaw === "number"
      ? formRenderedAtRaw
      : typeof formRenderedAtRaw === "string" && formRenderedAtRaw.trim() !== ""
        ? Number(formRenderedAtRaw)
        : NaN;
  if (!Number.isFinite(formRenderedAt) || formRenderedAt <= 0) {
    return { ok: false, error: "formRenderedAt_invalid" };
  }

  const companyWebsiteRaw = body.company_website;
  const company_website = typeof companyWebsiteRaw === "string" ? companyWebsiteRaw : "";

  return {
    ok: true,
    data: {
      name: name.data,
      contact: contact.data,
      brief: brief.data,
      role: role.data,
      industry: industry.data,
      companySize: companySize.data,
      replyLang: replyLangValue,
      company_website,
      formRenderedAt,
    },
  };
}
