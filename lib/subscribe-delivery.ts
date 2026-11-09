// lib/subscribe-delivery.ts — best-effort Resend email sender for the
// subscribe double opt-in flow. NEVER throws: every failure (missing config,
// network error, non-2xx, timeout) resolves to `false` so the calling route
// can always answer 202/303 without hanging or 500ing (US-08, US-10).
import { SUBSCRIBE_FROM_EMAIL_FALLBACK, type SubscribeEmailContent } from "@/lib/subscribe-values";

const RESEND_API_URL = "https://api.resend.com/emails";
// Mirrors lib/lead-delivery.ts's CHANNEL_TIMEOUT_MS pattern (cyber fix #1):
// a non-responsive Resend must never hold the handler open past this bound.
const CHANNEL_TIMEOUT_MS = 5000;

async function withTimeout<T>(fn: (signal: AbortSignal) => Promise<T>, ms: number): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fn(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

async function sendEmail(to: string, content: SubscribeEmailContent): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[subscribe] not configured");
    return false;
  }
  const from = process.env.RESEND_FROM_EMAIL || SUBSCRIBE_FROM_EMAIL_FALLBACK;

  try {
    const res = await withTimeout(
      (signal) =>
        fetch(RESEND_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ from, to: [to], subject: content.subject, text: content.text }),
          signal,
        }),
      CHANNEL_TIMEOUT_MS
    );
    if (!res.ok) {
      console.error("[subscribe] delivery failed", res.status, await safeText(res));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[subscribe] delivery failed", err instanceof Error ? err.message : String(err));
    return false;
  }
}

/** Sends the confirm-link email to the subscriber. Best-effort, never throws. */
export async function sendSubscribeConfirmationEmail(
  to: string,
  content: SubscribeEmailContent
): Promise<boolean> {
  return sendEmail(to, content);
}

/** Sends the owner-notice email once a token is confirmed. Best-effort, never throws. */
export async function sendSubscribeOwnerNotice(content: SubscribeEmailContent): Promise<boolean> {
  const ownerEmail = process.env.LEAD_TO_EMAIL;
  if (!ownerEmail) {
    console.log("[subscribe] not configured");
    return false;
  }
  return sendEmail(ownerEmail, content);
}
