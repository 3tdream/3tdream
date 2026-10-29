// Single source of truth for lead-form enum options and shared validation
// bounds, consumed by both the server (lib/validation/lead-schema.ts) and
// the client (components/lead-form.tsx) so they can never drift apart.
//
// Zero React/i18n runtime deps — Localized/L are small local primitives
// (not imported from lib/localized.ts) so this stays the lowest-level leaf
// module in the lead-capture import closure.
import type { ReplyLang } from "@/types/lead";

export type Localized = Record<"ru" | "en" | "he", string>;
const L = (ru: string, en: string, he: string): Localized => ({ ru, en, he });

export interface EnumOption<T extends string = string> {
  value: T;
  label: Localized;
}

export const ROLE_OPTIONS: EnumOption[] = [
  { value: "founder", label: L("Основатель / владелец", "Founder / owner", "מייסד/ת / בעלים") },
  { value: "product", label: L("Продукт или маркетинг", "Product or marketing", "מוצר או שיווק") },
  { value: "engineering", label: L("Разработка", "Engineering", "הנדסה") },
  { value: "other", label: L("Другое", "Other", "אחר") },
];

export const INDUSTRY_OPTIONS: EnumOption[] = [
  { value: "beauty", label: L("Красота и запись", "Beauty & booking", "יופי והזמנות") },
  { value: "ecommerce", label: L("Интернет-магазин", "Online store", "חנות מקוונת") },
  { value: "care", label: L("Здоровье и уход", "Care & wellness", "בריאות ורווחה") },
  { value: "education", label: L("Образование", "Education", "חינוך") },
  { value: "other", label: L("Другое", "Other", "אחר") },
];

export const COMPANY_SIZE_OPTIONS: EnumOption[] = [
  { value: "solo", label: L("Только я", "Just me", "רק אני") },
  { value: "small", label: L("2–10", "2–10", "2–10") },
  { value: "medium", label: L("11–50", "11–50", "11–50") },
  { value: "large", label: L("50+", "50+", "50+") },
];

export const REPLY_LANG_OPTIONS: EnumOption<ReplyLang>[] = [
  { value: "ru", label: L("Русский", "Russian", "רוסית") },
  { value: "en", label: L("English", "English", "אנגלית") },
  { value: "he", label: L("Иврит", "Hebrew", "עברית") },
];

// Tuple casts so these satisfy zod's z.enum([...] as [string, ...string[]])
// signature — each array is guaranteed non-empty above.
export const ROLE_VALUES = ROLE_OPTIONS.map((o) => o.value) as [string, ...string[]];
export const INDUSTRY_VALUES = INDUSTRY_OPTIONS.map((o) => o.value) as [string, ...string[]];
export const COMPANY_SIZE_VALUES = COMPANY_SIZE_OPTIONS.map((o) => o.value) as [string, ...string[]];
export const REPLY_LANG_VALUES = REPLY_LANG_OPTIONS.map((o) => o.value) as [ReplyLang, ...ReplyLang[]];

// Single aggregated lookup so components/lead-form.tsx can import one object
// instead of four separate names when rendering the role/industry/company
// size/reply-language <select> fields.
export const LEAD_FIELD_OPTIONS = {
  role: ROLE_OPTIONS,
  industry: INDUSTRY_OPTIONS,
  companySize: COMPANY_SIZE_OPTIONS,
  replyLang: REPLY_LANG_OPTIONS,
} as const;

// Shared validation bounds — single source of truth for schema + UI copy.
export const BRIEF_MIN_LENGTH = 20;
export const BRIEF_MAX_LENGTH = 2000;
// Render-to-submit faster than this looks non-human (AC-08 time-trap).
export const TIME_TRAP_MS_THRESHOLD = 10_000;
// Honeypot field name — shared so the form and schema never drift apart.
export const HONEYPOT_FIELD_NAME = "company_website" as const;
