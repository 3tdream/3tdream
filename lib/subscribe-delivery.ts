// lib/subscribe-delivery.ts — Resend delivery (fetch + 5s AbortController) for
// the confirmation and owner e-mails. NEVER throws. Logs only the cause
// category: never an address, a token or the Resend response body.
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
  failPrefix: string,
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
      console.error(`${failPrefix} ${res.status}`);
      return "failed";
    }
    return "sent";
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    console.error(`${failPrefix} ${aborted ? "timeout" : "network"}`);
    return aborted ? "timeout" : "failed";
  } finally {
    clearTimeout(timer);
  }
}

/** Confirmation mail to the subscriber. The link host always comes from SITE_URL. */
export async function sendConfirmationEmail(
  email: string,
  replyLang: ReplyLang,
  token: string,
): Promise<DeliveryOutcome> {
  const origin = getSiteOrigin();
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!origin || !apiKey) {
    console.log("[subscribe] not configured");
    return "not_configured";
  }
  const confirmUrl = `${origin}/api/subscribe/confirm?token=${encodeURIComponent(token)}`;
  return sendViaResend(
    apiKey,
    email,
    buildConfirmationEmail(confirmUrl, replyLang),
    "[subscribe] delivery failed:",
  );
}

/** One owner notification (LEAD_TO_EMAIL) after a verified token. */
export async function sendOwnerEmail(email: string, replyLang: ReplyLang): Promise<DeliveryOutcome> {
  const owner = process.env.LEAD_TO_EMAIL?.trim();
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!owner || !apiKey) {
    console.log("[subscribe] owner notice not configured");
    return "not_configured";
  }
  return sendViaResend(apiKey, owner, buildOwnerEmail(email, replyLang), "[subscribe] owner notice failed:");
}
