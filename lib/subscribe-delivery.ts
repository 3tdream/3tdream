// lib/subscribe-delivery.ts — Resend delivery (fetch + 5 s AbortController) for
// the confirmation and owner e-mails. NEVER throws. Logs only the cause
// category: never an address, a token, a link or the Resend response body.
import {
  buildConfirmationEmail,
  buildOwnerEmail,
  getFromAddress,
  getSiteOrigin,
  type ReplyLang,
  type SubscribeEmail,
} from "@/lib/subscribe-values";

export type DeliveryOutcome = "sent" | "failed" | "timeout" | "not_configured";

const RESEND_URL = "https://api.resend.com/emails";
const TIMEOUT_MS = 5000;

async function sendViaResend(
  apiKey: string,
  to: string,
  mail: SubscribeEmail,
  failTag: string,
): Promise<DeliveryOutcome> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: getFromAddress(),
        to: [to],
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error(`${failTag}: ${res.status}`);
      return "failed";
    }
    return "sent";
  } catch (err) {
    const name = err instanceof Error && err.name ? err.name : "Error";
    console.error(`${failTag}: ${name}`);
    return name === "AbortError" ? "timeout" : "failed";
  } finally {
    clearTimeout(timer);
  }
}

/** Confirmation mail to the subscriber. The link origin always comes from SITE_URL. */
export async function sendConfirmationEmail(
  email: string,
  replyLang: ReplyLang,
  token: string,
): Promise<DeliveryOutcome> {
  try {
    const origin = getSiteOrigin();
    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!origin || !apiKey) {
      console.log("[subscribe] not configured");
      return "not_configured";
    }
    const confirmUrl = `${origin}/api/subscribe/confirm?token=${encodeURIComponent(token)}`;
    return await sendViaResend(
      apiKey,
      email,
      buildConfirmationEmail(confirmUrl, replyLang),
      "[subscribe] delivery failed",
    );
  } catch {
    console.error("[subscribe] delivery failed: Error");
    return "failed";
  }
}

/** One owner notice (LEAD_TO_EMAIL) after a verified token. Best-effort. */
export async function sendOwnerEmail(email: string, replyLang: ReplyLang): Promise<DeliveryOutcome> {
  try {
    const owner = process.env.LEAD_TO_EMAIL?.trim();
    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!owner || !apiKey) {
      console.log("[subscribe] owner notice not configured");
      return "not_configured";
    }
    return await sendViaResend(
      apiKey,
      owner,
      buildOwnerEmail(email, replyLang),
      "[subscribe] owner notice failed",
    );
  } catch {
    console.error("[subscribe] owner notice failed: Error");
    return "failed";
  }
}
