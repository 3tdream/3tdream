"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import {
  SUBSCRIBE_TITLE,
  SUBSCRIBE_EMAIL_LABEL,
  SUBSCRIBE_PLACEHOLDER,
  SUBSCRIBE_SUBMIT,
  SUBSCRIBE_SENDING,
  SUBSCRIBE_SUCCESS,
  SUBSCRIBE_ERROR_EMAIL,
  SUBSCRIBE_ERROR_GENERIC,
} from "@/lib/content";

type Status = "idle" | "submitting" | "success" | "invalid_email" | "error";

// API: POST /api/subscribe  { email, replyLang, formRenderedAt, company_website }
export function SubscribeForm() {
  const { lang, t } = useI18n();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [renderedAt, setRenderedAt] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = status === "submitting";

  useEffect(() => {
    setRenderedAt(Date.now());
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, replyLang: lang, formRenderedAt: renderedAt, company_website: honeypot }),
      });
      if (res.status === 202) return setStatus("success");
      const data = (await res.json().catch(() => null)) as { field?: string } | null;
      if (res.status === 400 && data?.field === "email") {
        setStatus("invalid_email");
        inputRef.current?.focus();
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const message =
    status === "success" ? t(SUBSCRIBE_SUCCESS)
    : status === "invalid_email" ? t(SUBSCRIBE_ERROR_EMAIL)
    : status === "error" ? t(SUBSCRIBE_ERROR_GENERIC)
    : status === "submitting" ? t(SUBSCRIBE_SENDING)
    : "";
  const emphasis = status === "invalid_email" || status === "error" ? "font-bold" : "";

  return (
    <form data-testid="subscribe-form" onSubmit={handleSubmit} noValidate className="flex w-full max-w-md flex-col gap-2">
      <p className="label text-paper">{t(SUBSCRIBE_TITLE)}</p>
      <label htmlFor="subscribe-email" className="text-sm text-paper/80">{t(SUBSCRIBE_EMAIL_LABEL)}</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          ref={inputRef}
          id="subscribe-email"
          data-testid="subscribe-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t(SUBSCRIBE_PLACEHOLDER)}
          aria-invalid={status === "invalid_email"}
          aria-describedby="subscribe-status"
          className="min-h-12 min-w-0 flex-1 rounded-none border-2 border-paper bg-ink px-4 py-3 text-base text-paper placeholder:text-paper/60 focus-visible:outline-lime aria-[invalid=true]:border-dashed"
        />
        <button
          type="submit"
          data-testid="subscribe-submit"
          disabled={busy}
          className="min-h-12 rounded-none bg-lime px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.08em] text-ink transition-transform duration-150 ease-out focus-visible:outline-lime active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? t(SUBSCRIBE_SENDING) : t(SUBSCRIBE_SUBMIT)}
        </button>
      </div>
      {/* Honeypot: visually hidden (not type=hidden), out of tab order and a11y tree. */}
      <div aria-hidden="true" className="sr-only">
        <input
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
      <p
        id="subscribe-status"
        data-testid="subscribe-status"
        data-status={status}
        role="status"
        aria-live="polite"
        className={`min-h-6 text-sm ${status === "success" ? "text-lime" : "text-paper"} ${emphasis}`}
      >
        {message}
      </p>
    </form>
  );
}
