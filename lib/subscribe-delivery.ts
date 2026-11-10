// lib/subscribe-delivery.ts (MC-557) — best-effort Resend sender for the
// Build Notes double opt-in flow. NEVER throws: missing config, network
// error, timeout, or non-2xx all resolve to `false` so the calling route can
// always answer 202/303 without hanging or 500ing (US-08, US-10). Every
// Resend fetch is guarded by a 5s AbortController timeout, mirroring
// lib/lead-delivery.ts's house pattern (cyber fix #1).
import { SUBSCRIBE_FROM_EMAIL_FALLBACK, type SubscribeEmailContent } from "@/lib/subscribe-values";

const RESEND_API_URL = "https://api.resend.com/emails";
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

async function safeStatus(res: Response): Promise<string> {
  return String(res.status);
}

async function sendEmail(to: string, content: SubscribeEmailContent, logLabel: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[subscribe] not configured");
    return false;
  }
  const from = process.env.SUBSCRIBE_FROM_EMAIL || SUBSCRIBE_FROM_EMAIL_FALLBACK;

  try {
    const res = await withTimeout(
      (signal) =>
        fetch(RESEND_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ from, to: [to], subject: content.subject, html: content.html }),
          signal,
        }),
      CHANNEL_TIMEOUT_MS
    );
    if (!res.ok) {
      console.error(`[subscribe] ${logLabel} failed: ${await safeStatus(res)}`);
      return false;
    }
    return true;
  } catch {
    console.error(`[subscribe] ${logLabel} failed: network`);
    return false;
  }
}

/** Sends the confirm-link email to the subscriber (US-09). Never throws. */
export async function sendSubscribeConfirmationEmail(to: string, content: SubscribeEmailContent): Promise<boolean> {
  return sendEmail(to, content, "delivery");
}

/** Sends the owner-notice email once a token is confirmed (US-03). Never throws. */
export async function sendSubscribeOwnerNotice(content: SubscribeEmailContent): Promise<boolean> {
  const ownerEmail = process.env.OWNER_NOTICE_EMAIL || process.env.CONTACT_EMAIL;
  if (!ownerEmail) {
    console.log("[subscribe] not configured");
    return false;
  }
  return sendEmail(ownerEmail, content, "owner notice");
}
