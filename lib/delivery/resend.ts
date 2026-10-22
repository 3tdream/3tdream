// lib/delivery/resend.ts — fan-out channel #2: Resend SDK email delivery.
// Skips entirely when any Resend env var is unset (AC-11/AC-12). All
// user-supplied content is HTML-escaped before interpolation (cyber fix:
// no raw string concatenation into the email body); `contact` is only used
// as replyTo if it parses as an email shape, and CR/LF are stripped from
// any value that reaches a header, to block header/content injection.
import { Resend } from "resend";
import type { DeliveryAttempt, DeliveryChannelConfig, LeadSubmission } from "@/types/lead";

const TIMEOUT_MS = 5000;
const EMAIL_RE = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function resendDeliver(
  submission: LeadSubmission,
  config: DeliveryChannelConfig,
): Promise<DeliveryAttempt> {
  const startedAt = Date.now();
  if (!config.resendApiKey || !config.resendFromEmail || !config.resendToEmail) {
    return { channel: "resend", status: "skipped", startedAt, durationMs: 0, timedOut: false };
  }

  const resend = new Resend(config.resendApiKey);
  const safeName = escapeHtml(sanitizeHeaderValue(submission.name));
  const safeContact = escapeHtml(sanitizeHeaderValue(submission.contact));
  const safeBrief = escapeHtml(submission.brief).replace(/\n/g, "<br/>");
  const html = `
    <h2>New lead (${escapeHtml(submission.replyLang.toUpperCase())})</h2>
    <p><strong>Name:</strong> ${safeName}</p>
    <p><strong>Contact:</strong> ${safeContact}</p>
    <p><strong>Role:</strong> ${escapeHtml(submission.role)}</p>
    <p><strong>Industry:</strong> ${escapeHtml(submission.industry)}</p>
    <p><strong>Company size:</strong> ${escapeHtml(submission.companySize)}</p>
    <p><strong>Brief:</strong><br/>${safeBrief}</p>
  `.trim();

  let timedOut = false;
  let timer!: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      timedOut = true;
      reject(new Error("timeout"));
    }, TIMEOUT_MS);
  });

  try {
    const contactSafe = sanitizeHeaderValue(submission.contact);
    const result = await Promise.race([
      resend.emails.send({
        from: config.resendFromEmail,
        to: config.resendToEmail,
        subject: `New lead: ${safeName}`.slice(0, 200),
        html,
        ...(EMAIL_RE.test(contactSafe) ? { replyTo: contactSafe } : {}),
      }),
      timeout,
    ]);
    const durationMs = Date.now() - startedAt;
    if (result && typeof result === "object" && "error" in result && result.error) {
      return {
        channel: "resend", status: "rejected", startedAt, durationMs, timedOut: false,
        errorMessage: "resend_api_error",
      };
    }
    return { channel: "resend", status: "fulfilled", startedAt, durationMs, timedOut: false };
  } catch {
    const durationMs = Date.now() - startedAt;
    return {
      channel: "resend", status: "rejected", startedAt, durationMs, timedOut,
      errorMessage: timedOut ? "timeout" : "send_error",
    };
  } finally {
    clearTimeout(timer);
  }
}
