// lib/subscribe-values.ts — server-only constants, env readers and plain-string
// trilingual e-mail templates for the Build notes double opt-in (MC-557).
// Nothing here logs, and nothing here touches the client i18n type system.
// Consumers: app/api/subscribe/route.ts, app/api/subscribe/confirm/route.ts,
// lib/subscribe-token.ts, lib/subscribe-delivery.ts, lib/validation/subscribe-schema.ts.

export const REPLY_LANGS = ["ru", "en", "he"] as const;
export type ReplyLang = (typeof REPLY_LANGS)[number];

/** Token lifetime: 24h, in epoch milliseconds (same unit as formRenderedAt). */
export const SUBSCRIBE_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
/** Minimum 3000 ms between form mount and submit (mirrors /api/lead). */
export const SUBSCRIBE_MIN_FILL_MS = 3000;
export const SUBSCRIBE_EMAIL_MAX = 254;
export const SUBSCRIBE_TOKEN_MAX = 2048;
export const SUBSCRIBE_FROM_FALLBACK = "leads@3tdream.vercel.app";

// Pragmatic e-mail shape check, shared by the schema and token payload check.
const EMAIL_RE = /^[^\s@<>"',;()[\]\\]+@[^\s@<>"',;()[\]\\]+\.[^\s@<>"',;()[\]\\]+$/;

export function isReplyLang(v: unknown): v is ReplyLang {
  return typeof v === "string" && (REPLY_LANGS as readonly string[]).includes(v);
}

export function isValidEmail(v: unknown): v is string {
  return typeof v === "string" && v.length > 0 && v.length <= SUBSCRIBE_EMAIL_MAX && EMAIL_RE.test(v);
}

/** Validated http(s) origin of SITE_URL, or null when missing/unparsable. */
export function getSiteOrigin(): string | null {
  const raw = process.env.SITE_URL?.trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    return u.protocol === "http:" || u.protocol === "https:" ? u.origin : null;
  } catch {
    return null;
  }
}

export function getFromAddress(): string {
  return process.env.LEAD_FROM_EMAIL?.trim() || SUBSCRIBE_FROM_FALLBACK;
}

export type SubscribeEmail = { subject: string; html: string; text: string };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type ConfirmCopy = { intro: string; expiry: string };

/** Confirmation subject: distinct from the owner subject, same for every language. */
export const CONFIRM_SUBJECT = "Confirm your 3TDream build notes";
/** Owner notice subject (kept separate from CONFIRM_SUBJECT). */
export const OWNER_SUBJECT = "New build notes subscriber";

const CONFIRM: Record<ReplyLang, ConfirmCopy> = {
  ru: {
    intro: "Подтвердите подписку на заметки о разработке 3TDream по ссылке:",
    expiry: "Ссылка действует 24 часа. Если вы не подписывались, просто проигнорируйте это письмо.",
  },
  en: {
    intro: "Confirm your subscription to 3TDream build notes with this link:",
    expiry: "The link is valid for 24 hours. If you did not subscribe, ignore this e-mail.",
  },
  he: {
    intro: "אשרו את ההרשמה לעדכוני הפיתוח של 3TDream בקישור הזה:",
    expiry: "הקישור תקף ל-24 שעות. אם לא נרשמתם, אפשר להתעלם מהודעה זו.",
  },
};

export function buildConfirmationEmail(confirmUrl: string, lang: ReplyLang): SubscribeEmail {
  const c = CONFIRM[lang];
  const url = esc(confirmUrl);
  const dir = lang === "he" ? "rtl" : "ltr";
  const html =
    `<div dir="${dir}" style="direction:${dir};text-align:${lang === "he" ? "right" : "left"};font-family:Arial,sans-serif">` +
    `<p>${c.intro}</p><p><a href="${url}">${url}</a></p>` +
    `<p>${c.expiry}</p></div>`;
  const text = `${c.intro}\n\n${confirmUrl}\n\n${c.expiry}`;
  return { subject: CONFIRM_SUBJECT, html, text };
}

/** Owner-facing e-mail is fixed text (always English). */
export function buildOwnerEmail(email: string, lang: ReplyLang): SubscribeEmail {
  const subject = OWNER_SUBJECT;
  const html = `<p>Email: ${esc(email)}<br/>Language: ${lang}</p>`;
  const text = `Email: ${email}\nLanguage: ${lang}`;
  return { subject, html, text };
}
