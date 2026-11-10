// lib/subscribe-values.ts — server-side constants and plain-string trilingual
// e-mail templates for the Build Notes double opt-in (MC-557).
// Deliberately imports nothing from lib/content.ts or lib/i18n.tsx (client i18n).
// Reads no env at module scope.

/** Token lifetime in milliseconds (24 h). */
export const SUBSCRIBE_TOKEN_TTL_MS = 86_400_000;

/** Minimum bot-gate age of the rendered form, ms. */
export const SUBSCRIBE_MIN_FORM_AGE_MS = 3000;

/** Resend request timeout, ms. */
export const SUBSCRIBE_FETCH_TIMEOUT_MS = 5000;

/** Secrets shorter than this are treated as "not configured". */
export const SUBSCRIBE_MIN_SECRET_LENGTH = 32;

/** Fallback sender address when LEAD_FROM_EMAIL is not set. */
export const SUBSCRIBE_FROM_EMAIL_FALLBACK = "leads@3tdream.vercel.app";

/** Display name used in the From header for both subscribe e-mails. */
export const SUBSCRIBE_EMAIL_FROM_NAME = "3TDream Build Notes";

/** Languages supported by the subscribe flow; mirrors the client i18n set without importing it. */
export type ReplyLang = "ru" | "en" | "he";

export const SUBSCRIBE_LANGS: readonly ReplyLang[] = ["ru", "en", "he"];

export function isReplyLang(value: unknown): value is ReplyLang {
  return value === "ru" || value === "en" || value === "he";
}

export type SubscribeEmailContent = { subject: string; text: string };

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const CONFIRM_SUBJECT = "Confirm your 3TDream build notes";

const CONFIRM_BODY: Record<ReplyLang, readonly [string, string]> = {
  ru: [
    "Подтвердите подписку на заметки о разработке 3TDream по ссылке:",
    "Ссылка действует 24 часа. Если вы не подписывались, просто проигнорируйте это письмо.",
  ],
  en: [
    "Confirm your subscription to 3TDream build notes with this link:",
    "The link is valid for 24 hours. If you did not subscribe, ignore this e-mail.",
  ],
  he: [
    "אשרו את ההרשמה לעדכוני הפיתוח של 3TDream בקישור הזה:",
    "הקישור תקף ל-24 שעות. אם לא נרשמתם, אפשר להתעלם מהודעה זו.",
  ],
};

/** Plain-text confirmation e-mail: sentence, blank, link, blank, expiry sentence. */
export function buildSubscribeConfirmationEmail(
  confirmUrl: string,
  lang: ReplyLang,
): SubscribeEmailContent {
  const l: ReplyLang = isReplyLang(lang) ? lang : "en";
  const [sentence, expiry] = CONFIRM_BODY[l];
  return { subject: CONFIRM_SUBJECT, text: `${sentence}\n\n${confirmUrl}\n\n${expiry}` };
}

/** Owner notice sent once after a valid confirmation click. */
export function buildSubscribeOwnerNoticeEmail(
  email: string,
  lang: ReplyLang = "en",
): SubscribeEmailContent {
  const l: ReplyLang = isReplyLang(lang) ? lang : "en";
  return {
    subject: "New build notes subscriber",
    text: `Email: ${email}\nLanguage: ${l}`,
  };
}
