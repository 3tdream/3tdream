// lib/subscribe-values.ts — constants, per-language (RU/EN/HE) e-mail copy and
// env readers for the Build notes double opt-in. Env is read per call (never at
// module load) so a missing var cannot break a build or preview.

export type ReplyLang = "ru" | "en" | "he";
export type SubscribeEmail = { subject: string; text: string; html: string };

export const SUBSCRIBE_TOKEN_TTL_MS = 86_400_000;
export const SUBSCRIBE_TOKEN_MAX = 2048;
export const SUBSCRIBE_MIN_FILL_MS = 3000;
export const SUBSCRIBE_EMAIL_MAX = 254;
export const DEFAULT_FROM_EMAIL = "leads@3tdream.vercel.app";

const LANGS: readonly ReplyLang[] = ["ru", "en", "he"];
const EMAIL_RE = /^[^\s@<>"',;:()[\]\\]+@[^\s@<>"',;:()[\]\\]+\.[^\s@<>"',;:()[\]\\]+$/;

export function isReplyLang(v: unknown): v is ReplyLang {
  return typeof v === "string" && (LANGS as readonly string[]).includes(v);
}

export function isValidEmail(v: unknown): v is string {
  return typeof v === "string" && v.length > 0 && v.length <= SUBSCRIBE_EMAIL_MAX && EMAIL_RE.test(v);
}

/** Absolute origin from SITE_URL (server-only), no trailing slash; null if missing/malformed. */
export function getSiteOrigin(): string | null {
  const raw = process.env.SITE_URL?.trim();
  if (!raw || !/^https?:\/\/[^\s/]+/i.test(raw)) return null;
  return raw.replace(/\/+$/, "");
}

export function getFromAddress(): string {
  return process.env.LEAD_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
}

type Copy = {
  confirmSubject: string;
  confirmIntro: string;
  confirmCta: string;
  confirmIgnore: string;
  ownerSubject: string;
};

export const SUBSCRIBE_EMAIL_COPY: Record<ReplyLang, Copy> = {
  ru: {
    confirmSubject: "Confirm your 3TDream build notes",
    confirmIntro: "Подтвердите подписку на заметки о разработке 3TDream по ссылке:",
    confirmCta: "Подтвердить подписку",
    confirmIgnore: "Ссылка действует 24 часа. Если вы не подписывались, просто проигнорируйте это письмо.",
    ownerSubject: "New build notes subscriber",
  },
  en: {
    confirmSubject: "Confirm your 3TDream build notes",
    confirmIntro: "Confirm your subscription to 3TDream build notes with this link:",
    confirmCta: "Confirm subscription",
    confirmIgnore: "The link is valid for 24 hours. If you did not subscribe, ignore this e-mail.",
    ownerSubject: "New build notes subscriber",
  },
  he: {
    confirmSubject: "Confirm your 3TDream build notes",
    confirmIntro: "אשרו את ההרשמה לעדכוני הפיתוח של 3TDream בקישור הזה:",
    confirmCta: "אישור הרשמה",
    confirmIgnore: "הקישור תקף ל-24 שעות. אם לא נרשמתם, אפשר להתעלם מהודעה זו.",
    ownerSubject: "New build notes subscriber",
  },
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrap(lang: ReplyLang, body: string): string {
  const dir = lang === "he" ? "rtl" : "ltr";
  return `<div dir="${dir}" lang="${lang}" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5">${body}</div>`;
}

export function buildConfirmationEmail(confirmUrl: string, lang: ReplyLang): SubscribeEmail {
  const c = SUBSCRIBE_EMAIL_COPY[lang];
  const u = esc(confirmUrl);
  return {
    subject: c.confirmSubject,
    text: `${c.confirmIntro}\n\n${confirmUrl}\n\n${c.confirmIgnore}`,
    html: wrap(
      lang,
      `<p>${esc(c.confirmIntro)}</p><p><a href="${u}">${esc(c.confirmCta)}</a></p><p>${esc(c.confirmIgnore)}</p>`,
    ),
  };
}

export function buildOwnerEmail(email: string, lang: ReplyLang): SubscribeEmail {
  const c = SUBSCRIBE_EMAIL_COPY[lang];
  return {
    subject: c.ownerSubject,
    text: `Email: ${email}\nLanguage: ${lang}`,
    html: wrap("en", `<p>Email: ${esc(email)}<br>Language: ${lang}</p>`),
  };
}
