// Resend delivery for the Build Notes double opt-in (MC-557). Uses fetch only,
// a 5 s AbortController timeout, never throws, and logs only the three
// allowed lines (no e-mail address, no token, no error objects).
import {
  SUBSCRIBE_EMAIL_FROM_NAME,
  SUBSCRIBE_FETCH_TIMEOUT_MS,
  SUBSCRIBE_FROM_EMAIL_FALLBACK,
  buildSubscribeConfirmationEmail,
  buildSubscribeOwnerNoticeEmail,
  type ReplyLang,
  type SubscribeEmailContent,
} from "@/lib/subscribe-values";

const RESEND_API_URL = "https://api.resend.com/emails";

type SendResult = { ok: true } | { ok: false; status: string };

async function sendViaResend(apiKey: string, to: string, content: SubscribeEmailContent): Promise<SendResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SUBSCRIBE_FETCH_TIMEOUT_MS);
  try {
    const fromAddress = process.env.LEAD_FROM_EMAIL || SUBSCRIBE_FROM_EMAIL_FALLBACK;
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${SUBSCRIBE_EMAIL_FROM_NAME} <${fromAddress}>`,
        to: [to],
        subject: content.subject,
        text: content.text,
      }),
      signal: controller.signal,
      cache: "no-store",
    });
    return res.ok ? { ok: true } : { ok: false, status: String(res.status) };
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    return { ok: false, status: aborted ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Sends the confirmation link to the subscriber. Returns true only on a 2xx.
 * The route checks configuration first and logs "[subscribe] not configured";
 * a missing key here just returns false.
 */
export async function sendConfirmationEmail(to: string, lang: ReplyLang, confirmUrl: string): Promise<boolean> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return false;
    const result = await sendViaResend(apiKey, to, buildSubscribeConfirmationEmail(confirmUrl, lang));
    if (!result.ok) {
      console.error(`[subscribe] delivery failed: ${result.status}`);
      return false;
    }
    return true;
  } catch {
    console.error("[subscribe] delivery failed: error");
    return false;
  }
}

/** Sends one owner e-mail to LEAD_TO_EMAIL. Skips (and logs) if unconfigured. */
export async function sendOwnerNotice(email: string, lang: ReplyLang): Promise<boolean> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const ownerTo = process.env.LEAD_TO_EMAIL;
    if (!apiKey || !ownerTo) {
      console.error("[subscribe] not configured");
      return false;
    }
    const result = await sendViaResend(apiKey, ownerTo, buildSubscribeOwnerNoticeEmail(email, lang));
    if (!result.ok) {
      console.error(`[subscribe] owner notice failed: ${result.status}`);
      return false;
    }
    return true;
  } catch {
    console.error("[subscribe] owner notice failed: error");
    return false;
  }
}
