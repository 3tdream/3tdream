// Shared TS interfaces for the trilingual lead-capture pipeline.
// Ephemeral, request-scoped only — NEVER persisted (ADR: zero-persistence).

// ReplyLang is intentionally an alias of Lang ("ru"|"en"|"he") so that
// Localized (Record<Lang, string>) can be indexed by ReplyLang without
// producing TS7053 implicit-any errors.
import type { Lang } from "@/lib/i18n";
export type ReplyLang = Lang;

export type LeadField =
  | "name"
  | "contact"
  | "brief"
  | "role"
  | "industry"
  | "companySize"
  | "replyLang";

export type ValidationErrorKey =
  | `${LeadField}_required`
  | `${LeadField}_invalid`
  | "brief_length"
  | "body_invalid";

// Raw request body shape as posted by components/lead-form.tsx.
export interface LeadRequestBody {
  name: string;
  contact: string;
  brief: string;
  role: string;
  industry: string;
  companySize: string;
  replyLang: ReplyLang;
  company_website?: string; // honeypot — must arrive empty from real users
  formRenderedAt: number; // epoch ms, client-stamped on mount
}

// Validated + enriched submission, constructed server-side after zod parse.
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
  receivedAt: number;
  isBot: boolean;
}

export type DeliveryChannel = "webhook" | "resend";
export type DeliveryStatus = "fulfilled" | "rejected" | "skipped";

export interface DeliveryAttempt {
  channel: DeliveryChannel;
  status: DeliveryStatus;
  startedAt: number;
  durationMs: number;
  timedOut: boolean;
  errorMessage?: string; // non-PII only — never name/contact/brief
}

// Env-derived config, loaded once at cold start — not a DB row.
export interface DeliveryChannelConfig {
  webhookUrl?: string;
  resendApiKey?: string;
  resendFromEmail?: string;
  resendToEmail?: string;
}

// Response payloads — byte-identical across real/honeypot/time-trap cases.
export interface AcceptedResponse {
  status: "accepted";
}

export interface ValidationErrorResponse {
  error: ValidationErrorKey;
}

export type LeadLogOutcome =
  | "delivered"
  | "partial"
  | "failed"
  | "filtered_honeypot"
  | "filtered_timetrap"
  | "no_delivery_configured";

// Non-PII operational log line — stdout only, never stored by the app.
export interface LeadLogEntry {
  timestamp: number;
  outcome: LeadLogOutcome;
  channelsAttempted: DeliveryChannel[];
  channelsSucceeded: DeliveryChannel[];
  durationMs: number;
  requestId?: string;
}
