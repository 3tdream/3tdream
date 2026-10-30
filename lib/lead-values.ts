// Single source of truth for lead-form enum options, consumed by both the
// server (lib/validation/lead-schema.ts) and the client (components/lead-form.tsx)
// so they can never drift apart. Types imported from the shared contract
// (types/lead.ts) — this module only supplies the concrete option lists.
import type { RoleOption, IndustryOption, CompanySizeOption, ReplyLang } from "@/types/lead";

export const ROLE_OPTIONS: RoleOption[] = [
  { code: "founder", label: { ru: "Основатель / владелец", en: "Founder / owner", he: "מייסד/ת / בעלים" } },
  { code: "product", label: { ru: "Продукт или маркетинг", en: "Product or marketing", he: "מוצר או שיווק" } },
  { code: "engineering", label: { ru: "Разработка", en: "Engineering", he: "הנדסה" } },
  { code: "other", label: { ru: "Другое", en: "Other", he: "אחר" } },
];

export const INDUSTRY_OPTIONS: IndustryOption[] = [
  { code: "beauty", label: { ru: "Красота и запись", en: "Beauty & booking", he: "יופי והזמנות" } },
  { code: "ecommerce", label: { ru: "Интернет-магазин", en: "Online store", he: "חנות מקוונת" } },
  { code: "care", label: { ru: "Здоровье и уход", en: "Care & wellness", he: "בריאות ורווחה" } },
  { code: "education", label: { ru: "Образование", en: "Education", he: "חינוך" } },
  { code: "other", label: { ru: "Другое", en: "Other", he: "אחר" } },
];

export const COMPANY_SIZE_OPTIONS: CompanySizeOption[] = [
  { code: "solo", label: { ru: "Только я", en: "Just me", he: "רק אני" } },
  { code: "small", label: { ru: "2–10", en: "2–10", he: "2–10" } },
  { code: "medium", label: { ru: "11–50", en: "11–50", he: "11–50" } },
  { code: "large", label: { ru: "50+", en: "50+", he: "50+" } },
];

export const REPLY_LANG_OPTIONS: { code: ReplyLang; label: Record<ReplyLang, string> }[] = [
  { code: "ru", label: { ru: "Русский", en: "Russian", he: "רוסית" } },
  { code: "en", label: { ru: "English", en: "English", he: "אנגלית" } },
  { code: "he", label: { ru: "Иврит", en: "Hebrew", he: "עברית" } },
];

// Tuple casts so these satisfy zod's z.enum([...] as [string, ...string[]])
// signature — each array is guaranteed non-empty above.
export const ROLE_VALUES = ROLE_OPTIONS.map((o) => o.code) as [string, ...string[]];
export const INDUSTRY_VALUES = INDUSTRY_OPTIONS.map((o) => o.code) as [string, ...string[]];
export const COMPANY_SIZE_VALUES = COMPANY_SIZE_OPTIONS.map((o) => o.code) as [string, ...string[]];
export const REPLY_LANG_VALUES = REPLY_LANG_OPTIONS.map((o) => o.code) as [ReplyLang, ...ReplyLang[]];

// Single aggregated lookup so components/lead-form.tsx can import one object
// instead of four separate names when rendering the role/industry/company
// size/reply-language <select> fields.
export const LEAD_FIELD_OPTIONS = {
  role: ROLE_OPTIONS,
  industry: INDUSTRY_OPTIONS,
  companySize: COMPANY_SIZE_OPTIONS,
  replyLang: REPLY_LANG_OPTIONS,
} as const;

// Looks up the localized label for a given option code within one of the
// LEAD_FIELD_OPTIONS groups. Shared by components/lead-form.tsx so the
// <select> rendering logic (and the "other" free-text fallback) lives in one
// place instead of being re-implemented per field.
export function getOptionLabel(
  options: readonly { code: string; label: Record<ReplyLang, string> }[],
  code: string,
  lang: ReplyLang
): string {
  return options.find((o) => o.code === code)?.label[lang] ?? code;
}

// Shared validation bounds — single source of truth for schema + UI copy.
export const BRIEF_MIN_LENGTH = 1;
export const BRIEF_MAX_LENGTH = 2000;
export const NAME_MAX_LENGTH = 200;
export const CONTACT_MAX_LENGTH = 200;
export const OTHER_MAX_LENGTH = 200;
// Submissions faster than this look non-human (AC-09 timing heuristic).
export const TIME_TRAP_MS_THRESHOLD = 10_000;
// Honeypot field name — shared so the form and schema never drift apart.
export const HONEYPOT_FIELD_NAME = "company_website" as const;
// Default sender address for Resend delivery; override via LEAD_FROM_EMAIL env var.
export const LEAD_FROM_EMAIL = "leads@3tdream.vercel.app";
