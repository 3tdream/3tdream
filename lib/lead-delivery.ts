// lib/lead-delivery.ts — best-effort webhook -> Resend -> log delivery for
// POST /api/lead (ADR-001). Never throws; every channel failure degrades to
// a "failed" DeliveryAttempt + a structured `[lead] ...` log line.
import type { DeliveryAttempt, LeadSubmission } from "@/types/lead";
import { LEAD_FROM_EMAIL as DEFAULT_FROM_EMAIL } from "@/lib/lead-values";

const CHANNEL_TIMEOUT_MS = 5_000;

function withTimeout(ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(timer) };
}

function webhookBody(s: LeadSubmission) {
  return {
    requestId: s.requestId, name: s.name, contact: s.contact, role: s.role,
    roleOther: s.roleOther, industry: s.industry, industryOther: s.industryOther,
    companySize: s.companySize, brief: s.brief, replyLang: s.replyLang, submittedAt: s.submittedAt,
  };
}

async function attemptWebhook(url: string, s: LeadSubmission): Promise<DeliveryAttempt> {
  const attemptedAt = Date.now();
  const { signal, clear } = withTimeout(CHANNEL_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookBody(s)), signal,
    });
    if (!res.ok) {
      console.warn(`[lead] delivery failed: webhook ${res.status}`);
      return { channel: "webhook", status: "failed", httpStatus: res.status, attemptedAt };
    }
    return { channel: "webhook", status: "success", httpStatus: res.status, attemptedAt };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    console.warn(`[lead] delivery failed: webhook ${message}`);
    return { channel: "webhook", status: "failed", errorMessage: message.slice(0, 500), attemptedAt };
  } finally {
    clear();
  }
}

async function attemptResend(apiKey: string, toEmail: string, s: LeadSubmission): Promise<DeliveryAttempt> {
  const attemptedAt = Date.now();
  const { signal, clear } = withTimeout(CHANNEL_TIMEOUT_MS);
  try {
    const subject = `New lead (${s.replyLang}): ${s.name}`;
    const text = [
      `Name: ${s.name}`, `Contact: ${s.contact}`,
      `Role: ${s.role}${s.roleOther ? ` (${s.roleOther})` : ""}`,
      `Industry: ${s.industry}${s.industryOther ? ` (${s.industryOther})` : ""}`,
      `Company size: ${s.companySize}`, `Reply language: ${s.replyLang}`, "", "Brief:", s.brief,
    ].join("\n");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ from: `3TDream Leads <${envVar("LEAD_FROM_EMAIL") ?? DEFAULT_FROM_EMAIL}>`, to: [toEmail], subject, text }), signal,
    });
    if (!res.ok) {
      console.warn(`[lead] delivery failed: resend ${res.status}`);
      return { channel: "resend", status: "failed", httpStatus: res.status, attemptedAt };
    }
    return { channel: "resend", status: "success", httpStatus: res.status, attemptedAt };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    console.warn(`[lead] delivery failed: resend ${message}`);
    return { channel: "resend", status: "failed", errorMessage: message.slice(0, 500), attemptedAt };
  } finally {
    clear();
  }
}

function logFallback(s: LeadSubmission, reason: string): DeliveryAttempt {
  console.log(`[lead] ${reason}`, {
    replyLang: s.replyLang,
    role: s.role,
    industry: s.industry,
    companySize: s.companySize,
    briefLength: s.brief.length,
  });
  return { channel: "log", status: "success", skipReason: reason, attemptedAt: Date.now() };
}

export interface DeliveryResult { delivered: boolean; attempts: DeliveryAttempt[]; }

// Read via globalThis (not the bare `process` identifier) so this file
// compiles even when @types/node isn't in this workspace's tsconfig "types".
function envVar(key: string): string | undefined {
  return (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[key];
}

export async function deliverLead(submission: LeadSubmission): Promise<DeliveryResult> {
  const attempts: DeliveryAttempt[] = [];
  const webhookUrl = envVar("LEAD_WEBHOOK_URL");
  const resendApiKey = envVar("RESEND_API_KEY");
  const leadToEmail = envVar("LEAD_TO_EMAIL");

  let webhookDelivered = false;
  if (webhookUrl) {
    const attempt = await attemptWebhook(webhookUrl, submission);
    attempts.push(attempt);
    webhookDelivered = attempt.status === "success";
  } else {
    attempts.push({ channel: "webhook", status: "skipped", skipReason: "unconfigured", attemptedAt: Date.now() });
  }

  let resendDelivered = false;
  const resendFully = Boolean(resendApiKey && leadToEmail);
  const resendPartial = Boolean(resendApiKey) !== Boolean(leadToEmail);
  if (resendFully) {
    const attempt = await attemptResend(resendApiKey as string, leadToEmail as string, submission);
    attempts.push(attempt);
    resendDelivered = attempt.status === "success";
  } else if (resendPartial) {
    console.warn("[lead] resend partially configured, skipping");
    attempts.push({ channel: "resend", status: "skipped", skipReason: "resend partially configured", attemptedAt: Date.now() });
  } else {
    attempts.push({ channel: "resend", status: "skipped", skipReason: "unconfigured", attemptedAt: Date.now() });
  }

  const delivered = webhookDelivered || resendDelivered;
  if (!webhookUrl && !resendFully) attempts.push(logFallback(submission, "no delivery channels configured, logging lead"));
  return { delivered, attempts };
}
