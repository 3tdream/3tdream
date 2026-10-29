// lib/lead-delivery.ts — parallel fan-out to Webhook + Resend, each under
// its own 5s AbortController (ADR: never sequential). Unconfigured channels
// are "skipped" so the endpoint degrades gracefully with zero config
// (AC-09/US-05). Never throws — every branch resolves to a DeliveryAttempt.
import type { DeliveryAttempt, DeliveryChannel, DeliveryChannelConfig, LeadSubmission } from "@/types/lead";

const CHANNEL_TIMEOUT_MS = 5_000;

// Cast through globalThis instead of relying on the ambient `process` type —
// keeps this file compiling even when @types/node / tsconfig "types" isn't
// configured to include node in this workspace.
type EnvBag = { env?: Record<string, string | undefined> };
const getEnv = (key: string): string | undefined =>
  (globalThis as unknown as { process?: EnvBag }).process?.env?.[key];

function loadDeliveryChannelConfigFromEnv(): DeliveryChannelConfig {
  return {
    webhookUrl: getEnv("LEAD_WEBHOOK_URL") || undefined,
    resendApiKey: getEnv("RESEND_API_KEY") || undefined,
    resendFromEmail: getEnv("RESEND_FROM_EMAIL") || undefined,
    resendToEmail: getEnv("RESEND_TO_EMAIL") || undefined,
  };
}

// Non-PII only (AC-12/US-09): never logs name, contact, or brief content.
function logFailure(channel: DeliveryChannel, errorMessage: string | undefined, s: LeadSubmission) {
  console.error("[lead-delivery] channel_failed", {
    channel,
    errorMessage,
    replyLang: s.replyLang,
    role: s.role,
    industry: s.industry,
    companySize: s.companySize,
    briefLength: s.brief.length,
  });
}

export const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// Strips CR/LF to prevent header/content injection via free-text fields.
export const sanitizeLine = (v: string) => v.replace(/[\r\n]+/g, " ").trim();

export async function runChannel(
  channel: DeliveryChannel,
  submission: LeadSubmission,
  fn: (signal: AbortSignal) => Promise<void>
): Promise<DeliveryAttempt> {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CHANNEL_TIMEOUT_MS);
  try {
    await fn(controller.signal);
    return { channel, configured: true, status: "fulfilled", startedAt, durationMs: Date.now() - startedAt, timedOut: false };
  } catch (err) {
    const timedOut = controller.signal.aborted;
    const errorMessage = timedOut ? "timeout" : err instanceof Error ? err.message.slice(0, 200) : "unknown_error";
    logFailure(channel, errorMessage, submission);
    return { channel, configured: true, status: "rejected", startedAt, durationMs: Date.now() - startedAt, timedOut, errorMessage };
  } finally {
    clearTimeout(timer);
  }
}

export const skippedAttempt = (channel: DeliveryChannel): DeliveryAttempt => ({
  channel,
  configured: false,
  status: "skipped",
  startedAt: null,
  durationMs: null,
  timedOut: false,
});

export function loadConfigForDelivery(): DeliveryChannelConfig {
  return loadDeliveryChannelConfigFromEnv();
}

async function deliverWebhook(
  s: LeadSubmission,
  url: string,
  signal: AbortSignal,
  userAgent: string
): Promise<void> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      receivedAt: new Date(s.receivedAt).toISOString(),
      replyLang: s.replyLang,
      name: sanitizeLine(s.name),
      contact: sanitizeLine(s.contact),
      role: s.role,
      industry: s.industry,
      companySize: s.companySize,
      brief: s.brief,
      page: "/contact",
      userAgent,
    }),
    signal,
  });
  if (!res.ok) throw new Error(`webhook_http_${res.status}`);
}

async function deliverResend(
  s: LeadSubmission,
  cfg: { resendApiKey: string; resendFromEmail: string; resendToEmail: string },
  signal: AbortSignal,
  userAgent: string
): Promise<void> {
  // Subject: "New lead: <name> · <industry> · <companySize>" per contract.
  const subject = `New lead: ${sanitizeLine(s.name)} \u00b7 ${s.industry} \u00b7 ${s.companySize}`;

  // Plain-text body — one "Label: value" line per field in spec order.
  // Brief gets its own lines after a blank line per contract.
  const text = [
    `Received at: ${new Date(s.receivedAt).toISOString()}`,
    `Reply language: ${s.replyLang}`,
    `Name: ${sanitizeLine(s.name)}`,
    `Contact: ${sanitizeLine(s.contact)}`,
    `Role: ${s.role}`,
    `Industry: ${s.industry}`,
    `Company size: ${s.companySize}`,
    ``,
    `Brief:`,
    s.brief,
    ``,
    `Page: /contact`,
    `User agent: ${sanitizeLine(userAgent)}`,
  ].join("\n");

  const fromAddress = `3TDream Leads <${cfg.resendFromEmail}>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.resendApiKey}` },
    body: JSON.stringify({
      from: fromAddress,
      to: [cfg.resendToEmail],
      subject,
      text,
    }),
    signal,
  });
  if (!res.ok) throw new Error(`resend_http_${res.status}`);
}

export interface LeadDeliveryResult {
  delivered: boolean;
  attempts: DeliveryAttempt[];
}

/** Fans a validated, non-bot submission out to Webhook + Resend concurrently. */
export async function deliverLead(submission: LeadSubmission, userAgent: string): Promise<LeadDeliveryResult> {
  const cfg = loadDeliveryChannelConfigFromEnv();

  const webhookPromise: Promise<DeliveryAttempt> = cfg.webhookUrl
    ? runChannel("webhook", submission, (signal) => deliverWebhook(submission, cfg.webhookUrl as string, signal, userAgent))
    : Promise.resolve(skippedAttempt("webhook"));

  const resendPromise: Promise<DeliveryAttempt> =
    cfg.resendApiKey && cfg.resendFromEmail && cfg.resendToEmail
      ? runChannel("resend", submission, (signal) =>
          deliverResend(
            submission,
            {
              resendApiKey: cfg.resendApiKey as string,
              resendFromEmail: cfg.resendFromEmail as string,
              resendToEmail: cfg.resendToEmail as string,
            },
            signal,
            userAgent
          )
        )
      : Promise.resolve(skippedAttempt("resend"));

  const settled = await Promise.allSettled([webhookPromise, resendPromise]);
  const attempts: DeliveryAttempt[] = settled.map((r) => (r.status === "fulfilled" ? r.value : skippedAttempt("webhook")));
  const delivered = attempts.some((a) => a.status === "fulfilled");
  return { delivered, attempts };
}
