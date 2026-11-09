"use client";

// API: POST /api/subscribe — 202 { ok: true, delivered } | 400 { ok: false, errors }
// UI must never branch on `delivered`, only on HTTP status (US-05).

import { useRef, useState, type FormEvent } from "react";
import { useI18n, L } from "@/lib/i18n";
import type { ReplyLang } from "@/lib/subscribe-values";

type Status = "idle" | "submitting" | "success" | "error";
const HONEYPOT_FIELD = "company_website";

const INPUT =
  "w-full hard-border bg-ink border-paper/30 text-paper placeholder:text-paper/40 px-3 py-2.5 text-sm focus:bg-ink/60 disabled:opacity-60 sm:flex-1";
const BUTTON =
  "hard-border bg-lime px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-ink hover-shadow disabled:opacity-60 disabled:cursor-not-allowed transition-colors";

export function SubscribeForm() {
  const { t, lang } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const renderedAt = useRef(Date.now());
  const disabled = status === "submitting";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disabled) return;
    setStatus("submitting");
    setFieldError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      email: String(data.get("email") || "").trim(),
      replyLang: lang as ReplyLang,
      company_website: String(data.get(HONEYPOT_FIELD) || ""),
      formRenderedAt: renderedAt.current,
    };

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 400) {
        const body = (await res.json()) as { ok: false; errors: Record<string, string> };
        setFieldError(body.errors.email || t(L("Проверьте e-mail", "Check the email address", "בדקו את כתובת המייל")));
        setStatus("error");
        return;
      }

      await res.json().catch(() => null);
      setStatus("success");
      form.reset();
      renderedAt.current = Date.now();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div data-testid="subscribe-status" className="mt-4 hard-border bg-lime px-4 py-3 text-sm font-medium text-ink" role="status">
        {t(L("Проверьте почту — письмо с подтверждением уже в пути.", "Check your inbox — a confirmation email is on its way.", "בדקו את תיבת הדואר — מייל אישור כבר בדרך."))}
      </div>
    );
  }

  return (
    <form data-testid="subscribe-form" onSubmit={onSubmit} noValidate className="mt-4 flex flex-col gap-2" aria-label={t(L("Подписка", "Subscribe", "הרשמה"))}>
      <label htmlFor="subscribe-email" className="label text-paper/50">
        {t(L("Заметки о разработке", "Build notes", "עדכוני פיתוח"))}
      </label>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          data-testid="subscribe-email"
          id="subscribe-email"
          name="email"
          type="email"
          required
          disabled={disabled}
          placeholder={t(L("вы@почта.com", "you@email.com", "you@email.com"))}
          className={INPUT}
          aria-invalid={status === "error"}
          aria-describedby={fieldError ? "subscribe-email-error" : undefined}
        />
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" defaultValue="" />
        <button data-testid="subscribe-submit" type="submit" disabled={disabled} className={BUTTON}>
          {status === "submitting" ? t(L("Отправка…", "Sending…", "שולח…")) : t(L("Подписаться", "Subscribe", "הרשמה"))}
        </button>
      </div>

      {fieldError && (
        <p id="subscribe-email-error" className="text-xs font-medium text-lime">
          {fieldError}
        </p>
      )}
    </form>
  );
}
