"use client";

import { useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import { SUBSCRIBE_FORM } from "@/lib/content";
import type { ReplyLang } from "@/lib/subscribe-values";

type Status = "idle" | "submitting" | "success" | "error";

// Must match the field name lib/validation/subscribe-schema.ts expects as the
// honeypot — any non-empty value silently routes the submission to the
// no-delivery success path server-side (bots fill every visible-looking
// field; sighted/keyboard users never reach it).
const HONEYPOT_FIELD_NAME = "company_website";

export function SubscribeForm() {
  const { t, lang } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const renderedAt = useRef(Date.now());
  const disabled = status === "submitting";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disabled) return;
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      email: String(data.get("email") || "").trim(),
      replyLang: lang as ReplyLang,
      company_website: String(data.get(HONEYPOT_FIELD_NAME) || ""),
      formRenderedAt: renderedAt.current,
    };

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as { ok: boolean; delivered?: boolean; errors?: unknown };
      if (body.ok) {
        setStatus("success");
        form.reset();
        renderedAt.current = Date.now();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="label text-accent">{t(SUBSCRIBE_FORM.label)}</p>
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex flex-col gap-3 sm:flex-row sm:items-start"
      >
        <label htmlFor="subscribe-email" className="sr-only">
          {t(SUBSCRIBE_FORM.placeholder)}
        </label>
        <input
          id="subscribe-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={disabled}
          placeholder={t(SUBSCRIBE_FORM.placeholder)}
          data-testid="subscribe-email"
          className="w-full rounded-none border-2 border-[var(--color-paper)] bg-transparent px-3 py-2 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-paper)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lime)] disabled:opacity-50 sm:max-w-xs"
        />

        {/* Honeypot: visually + programmatically hidden, never in tab order */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={HONEYPOT_FIELD_NAME}>{t(SUBSCRIBE_FORM.honeypotLabel)}</label>
          <input
            id={HONEYPOT_FIELD_NAME}
            name={HONEYPOT_FIELD_NAME}
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <button type="submit" disabled={disabled} data-testid="subscribe-submit" className="shrink-0 rounded-none border-2 border-[var(--color-lime)] bg-[var(--color-lime)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50">
          {status === "submitting" ? t(SUBSCRIBE_FORM.submitting) : t(SUBSCRIBE_FORM.submit)}
        </button>
      </form>

      {status === "success" && (
        <p className="label text-[var(--color-lime)]" role="status" data-testid="subscribe-status">
          {t(SUBSCRIBE_FORM.success)}
        </p>
      )}
      {status === "error" && (
        <p className="label text-red-400" role="alert" data-testid="subscribe-status">
          {t(SUBSCRIBE_FORM.genericError)}
        </p>
      )}
    </div>
  );
}
