// lib/subscribe-values.ts — plain-string trilingual email templates and
// shared constants for the Build Notes double opt-in subscription flow
// (MC-557). Deliberately does NOT import Localized/L from lib/localized.ts:
// this file is server-only and stays isolated from the client-facing i18n
// type system (per ADR A4).
import { REPLY_LANG_VALUES } from "@/lib/validation/subscribe-schema";

/** Token lifetime in milliseconds (24 h). Used by lib/subscribe-token.ts. */
export const SUBSCRIBE_TOKEN_TTL_MS = 86_400_000;

/** Fallback sender address when LEAD_FROM_EMAIL is not set (AC-04). */
export const SUBSCRIBE_FROM_EMAIL_FALLBACK = "leads@3tdream.vercel.app";

export type ReplyLang = (typeof REPLY_LANG_VALUES)[number];

export type SubscribeEmailContent = { subject: string; html: string };

const CONFIRM_SUBJECT: Record<ReplyLang, string> = {
  ru: "Подтвердите подписку на Build Notes",
  en: "Confirm your Build Notes subscription",
  he: 'אשרו את ההרשמה ל-Build Notes',
};

const CONFIRM_BODY: Record<ReplyLang, (confirmUrl: string) => string> = {
  ru: (confirmUrl) => `
    <p>Спасибо за интерес к Build Notes!</p>
    <p>Чтобы подтвердить подписку, перейдите по ссылке ниже. Ссылка действует 24 часа.</p>
    <p><a href="${confirmUrl}">${confirmUrl}</a></p>
    <p>Если вы не запрашивали подписку — просто проигнорируйте это письмо.</p>
  `,
  en: (confirmUrl) => `
    <p>Thanks for your interest in Build Notes!</p>
    <p>Click the link below to confirm your subscription. The link is valid for 24 hours.</p>
    <p><a href="${confirmUrl}">${confirmUrl}</a></p>
    <p>If you didn't request this, just ignore this email.</p>
  `,
  he: (confirmUrl) => `
    <p>תודה על ההתעניינות ב-Build Notes!</p>
    <p>לחצו על הקישור למטה כדי לאשר את ההרשמה. הקישור בתוקף ל-24 שעות.</p>
    <p><a href="${confirmUrl}">${confirmUrl}</a></p>
    <p>אם לא ביקשתם זאת, פשוט התעלמו מההודעה הזו.</p>
  `,
};

/** Builds the confirmation-link email sent to the subscriber (US-09). */
export function buildSubscribeConfirmationEmail(confirmUrl: string, lang: ReplyLang): SubscribeEmailContent {
  const subject = CONFIRM_SUBJECT[lang] ?? CONFIRM_SUBJECT.en;
  const bodyFn = CONFIRM_BODY[lang] ?? CONFIRM_BODY.en;
  return { subject, html: bodyFn(confirmUrl) };
}

/** Builds the owner-notice email sent once a token is confirmed (US-03). */
export function buildSubscribeOwnerNoticeEmail(email: string): SubscribeEmailContent {
  return {
    subject: "New Build Notes subscriber confirmed",
    html: `<p>A new subscriber confirmed their Build Notes subscription: <strong>${email}</strong></p>`,
  };
}
