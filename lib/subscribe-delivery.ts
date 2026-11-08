// lib/subscribe-delivery.ts — best-effort Resend email sender for the
// subscribe double opt-in flow. NEVER throws: every failure (missing config,
// network error, non-2xx, timeout) resolves to `false` so the calling route
// can always answer 202/303 without hanging or 500ing (US-08, US-10).
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

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const from = process.env.SUBSCRIBE_FROM_EMAIL || "Build Notes <onboarding@resend.dev>";

  try {
    const res = await withTimeout(
      (signal) =>
        fetch(RESEND_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ from, to: [to], subject, html }),
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
export async function sendSubscribeConfirmationEmail(to: string, subject: string, html: string): Promise<boolean> {
  return sendEmail(to, subject, html);
}

/** Sends the owner-notice email once a token is confirmed. Best-effort, never throws. */
export async function sendSubscribeOwnerNotice(subject: string, html: string): Promise<boolean> {
  const ownerEmail = process.env.OWNER_NOTICE_EMAIL || process.env.CONTACT_EMAIL;
  if (!ownerEmail) return false;
  return sendEmail(ownerEmail, subject, html);
}
