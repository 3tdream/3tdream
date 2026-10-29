// Shared TS interfaces for the trilingual lead-capture pipeline (MC-557).
// Every entity here is ephemeral / request-scoped only — NEVER persisted
// (ADR: "zero persistence... No DB/KV/file store anywhere in the path").

export type ReplyLang = "ru" | "en" | "he";

// Fixed validation/bot-check order per AC-04 (spec order).
export type LeadField =
  | "name"
  | "contact"
  | "role"
  | "industry"
  | "companySize"
  | "brief"
  | "replyLang"
  | "formRenderedAt";

// Exact error-key set the API contract requires — one key per 400 response.
export type ValidationErrorKey =
  | "name_required"
  | "contact_required"
  | "role_required"
  | "industry_required"
  | "companySize_required"
  | "brief_required"
  | "brief_length"
  | "replyLang_required"
  | "formRenderedAt_invalid";

// Raw request body shape as posted by components/lead-form.tsx.
export interface LeadRequestBody {
  name: string;
  contact: string;
  brief: string;
  role: string;
  industry: string;
  companySize: string;
  replyLang: ReplyLang;
  // Honeypot — CSS-hidden real <input>, must arrive empty from real users.
  company_website?: string;
  // Client-stamped epoch-ms set on form mount; time-trap input.
  formRenderedAt: number;
}

// Validated submission, built server-side after the zod parse passes.
// Lives only in process memory for the duration of the request.
export interface LeadSubmission {
  name: string;
  contact: string;
  brief: string;
  role: string;
  industry: string;
  companySize: string;
  replyLang: ReplyLang;
  company_website: string;
  formRenderedAt: number;
  // Server-stamped at handler entry — never client-supplied, never trusted.
  receivedAt: number;
}

// Derived from LeadSubmission before any other field validation runs, so
// bot traffic short-circuits to the identical 202 response (AC-08/AC-09).
export interface BotFilterResult {
  honeypotTriggered: boolean;
  // receivedAt - formRenderedAt; negative/unparsable is handled as
  // formRenderedAt_invalid upstream, never folded into this result.
  elapsedMs: number;
  timeTrapTriggered: boolean;
  isBot: boolean;
}

export type DeliveryChannel = "webhook" | "resend";
export type DeliveryStatus = "fulfilled" | "rejected" | "skipped";

export interface DeliveryAttempt {
  channel: DeliveryChannel;
  // false when the channel's env var is unset — skipped, not attempted.
  configured: boolean;
  status: DeliveryStatus;
  // widened to accept `undefined` in addition to `null` so callers that
  // omit the field (e.g. skippedAttempt builders) satisfy the type without
  // an explicit `?? null` coercion at every call site.
  startedAt: number | null | undefined;
  durationMs: number | null | undefined;
  timedOut: boolean;
  // Non-PII only (channel id + HTTP status/SDK error code) per AC-12/US-09 —
  // must never contain name/contact/brief content.
  errorMessage?: string;
}

// Env-derived config, read once per request — not a DB row.
export interface DeliveryChannelConfig {
  webhookUrl?: string;
  resendApiKey?: string;
  resendFromEmail?: string;
  resendToEmail?: string;
}

// The exact HTTP response bodies for POST /api/lead. The 202 shape is
// byte-identical across real-success, honeypot, time-trap, and zero-config
// cases (AC-08/AC-09) — it carries no field that could leak which case ran.
export interface LeadAcceptedResponse {
  status: "accepted";
}

export interface LeadErrorResponse {
  error: ValidationErrorKey;
}

export type LeadApiResponse = LeadAcceptedResponse | LeadErrorResponse;
