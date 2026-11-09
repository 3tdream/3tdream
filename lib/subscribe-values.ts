// lib/subscribe-values.ts — plain-string trilingual copy for the Build Notes
// double opt-in subscription (MC-557): confirmation/owner emails and the two
// static /subscribe/done /subscribe/invalid pages. Deliberately has ZERO
// module-level imports — no L/Localized from lib/i18n.tsx or lib/content.ts.
// This file is the server-safe, type-isolated copy source for the no-database
// subscribe flow (ADR A4); UI labels on the footer form live in lib/content.ts.

/** Must match the replyLang enum carried inside the signed token payload. */
export type ReplyLang = "ru" | "en" | "he";

/** Token lifetime in milliseconds (24 h). Used by lib/subscribe-token.ts. */
export const SUBSCRIBE_TOKEN_TTL_MS = 86_400_000;

/** Fallback sender address when no Resend "from" env is configured. */
export const SUBSCRIBE_FROM_EMAIL_FALLBACK = "leads@3tdream.vercel.app";

/** Display name paired with the sender address on outgoing confirm/owner emails. */
export const SUBSCRIBE_EMAIL_FROM_NAME = "3TDream Build Notes";

/** Minimum ms between form render and submit before a request is bot-suspected (US-04/AC-09). */
export const SUBSCRIBE_TIMING_TRAP_MS = 3000;

export type SubscribeEmailContent = { subject: string; text: string };

/** Exact confirmation subject required by the contract (MC-557). */
export const CONFIRM_SUBJECT = "Confirm your 3TDream build notes";

const CONFIRM_INTRO: Record<ReplyLang, string> = {
  ru: "Подтвердите подписку на заметки о разработке 3TDream по ссылке:",
  en: "Confirm your subscription to 3TDream build notes with this link:",
  he: "אשרו את ההרשמה לעדכוני הפיתוח של 3TDream בקישור הזה:",
};

const CONFIRM_EXPIRY: Record<ReplyLang, string> = {
  ru: "Ссылка действует 24 часа. Если вы не подписывались, просто проигнорируйте это письмо.",
  en: "The link is valid for 24 hours. If you did not subscribe, ignore this e-mail.",
  he: "הקישור תקף ל-24 שעות. אם לא נרשמתם, אפשר להתעלם מהודעה זו.",
};

/** Builds the confirmation-link email sent to the subscriber (MC-557). */
export function buildSubscribeConfirmationEmail(confirmUrl: string, lang: ReplyLang): SubscribeEmailContent {
  const intro = CONFIRM_INTRO[lang] ?? CONFIRM_INTRO.en;
  const expiry = CONFIRM_EXPIRY[lang] ?? CONFIRM_EXPIRY.en;
  const text = `${intro}\n\n${confirmUrl}\n\n${expiry}`;
  return { subject: CONFIRM_SUBJECT, text };
}

/** Builds the owner-notice email sent once a token is confirmed (MC-557). */
export function buildSubscribeOwnerNoticeEmail(email: string, lang: ReplyLang): SubscribeEmailContent {
  return {
    subject: "New build notes subscriber",
    text: `Email: ${email}\nLanguage: ${lang}`,
  };
}

/** Static copy for app/subscribe/done/page.tsx — unconditional, no searchParams branching. */
export const SUBSCRIBE_DONE_COPY: Record<ReplyLang, { title: string; body: string }> = {
  ru: { title: "Подписка подтверждена", body: "Вы успешно подписались на Build Notes. Спасибо!" },
  en: { title: "Subscription confirmed", body: "You're subscribed to Build Notes. Thank you!" },
  he: { title: "ההרשמה אושרה", body: "נרשמתם בהצלחה ל-Build Notes. תודה!" },
};

/** Static copy for app/subscribe/invalid/page.tsx — unconditional, no searchParams branching. */
export const SUBSCRIBE_INVALID_COPY: Record<ReplyLang, { title: string; body: string }> = {
  ru: { title: "Ссылка недействительна", body: "Эта ссылка подтверждения истекла или повреждена. Попробуйте подписаться заново." },
  en: { title: "Link invalid or expired", body: "This confirmation link is invalid or has expired. Please subscribe again." },
  he: { title: "הקישור אינו תקף", body: "קישור האישור פג תוקף או שגוי. אנא הירשמו מחדש." },
};
