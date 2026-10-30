// Shared types for the trilingual lead-capture feature (MC-557 / ADR-001).
// Everything here is request-scoped only — nothing is persisted; no DB.

export type ReplyLang = "ru" | "en" | "he";

export interface RoleOption {
  code: string;
  label: Record<ReplyLang, string>;
}

export interface IndustryOption {
  code: string;
  label: Record<ReplyLang, string>;
}

export interface CompanySizeOption {
  code: string;
  label: Record<ReplyLang, string>;
}

// Raw JSON body posted by components/lead-form.tsx to POST /api/lead.
export interface LeadRequestBody {
  name: string;
  contact: string;
  role: string;
  roleOther?: string;
  industry: string;
  industryOther?: string;
  companySize: string;
  brief: string;
  replyLang: ReplyLang;
  honeypot: string;
  formRenderedAt: number;
}

// Validated + server-enriched submission. Lives only for one request
// lifecycle — never written to disk, DB, or any queryable store.
export interface LeadSubmission extends LeadRequestBody {
  requestId: string;
  uiLangAtSubmit?: ReplyLang;
  submittedAt: number;
  elapsedMs: number;
}

export interface BotSignal {
  honeypotFilled: boolean;
  elapsedMs: number;
  isBotByHoneypot: boolean;
  isBotByTiming: boolean;
  isBot: boolean;
}

// Union covering lib/lead-values.ts LEAD_FIELD_OPTIONS entries (role /
// industry / companySize selects share this shape: code + per-language label).
export type LeadFieldOption = RoleOption | IndustryOption | CompanySizeOption;

export type DeliveryChannel = "webhook" | "resend" | "log";
export type DeliveryStatus = "success" | "failed" | "skipped";

export interface DeliveryAttempt {
  channel: DeliveryChannel;
  status: DeliveryStatus;
  skipReason?: string;
  httpStatus?: number;
  errorMessage?: string;
  attemptedAt: number;
}

export interface LeadResponseOk {
  ok: true;
  delivered: boolean;
}

export interface LeadResponseError {
  ok: false;
  errors: Record<string, string[]>;
}

export type LeadApiResponse = LeadResponseOk | LeadResponseError;
