"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { useI18n, L } from "@/lib/i18n";
import { SUBSCRIBE_FORM } from "@/lib/content";
import { SUBSCRIBE_EMAIL_MAX } from "@/lib/subscribe-values";

// API: POST /api/subscribe. Every 202 shows the same success text; `delivered` is never read.
type Status = "idle" | "submitting" | "success" | "error" | "invalid";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RING = "focus-visible:shadow-[0_0_0_2px_var(--color-lime)]";

export function SubscribeForm() {
  const { t, lang } = useI18n();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const renderedAt = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = status === "submitting";
  const invalid = status === "invalid";

  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const value = email.trim();
    if (!EMAIL_RE.test(value) || value.length > SUBSCRIBE_EMAIL_MAX) {
      setStatus("invalid");
      inputRef.current?.focus();
      return;
    }
    setStatus("submitting");
    // AC-19: replyLang is the current UI language; the annotation makes tsc prove it is ru | en | he.
    const replyLang: "ru" | "en" | "he" = lang;
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: value,
          replyLang,
          formRenderedAt: renderedAt.current,
          company_website: honeypot,
        }),
      });
      if (res.status === 202) {
        setStatus("success");
        return;
      }
      const body = (await res.json().catch(() => null)) as { field?: string } | null;
      setStatus(res.status === 400 && body?.field === "email" ? "invalid" : "error");
      inputRef.current?.focus();
    } catch {
      setStatus("error");
      inputRef.current?.focus();
    }
  }

  function reset() {
    setEmail("");
    setStatus("idle");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  const copy = SUBSCRIBE_FORM;

  if (status === "success") {
    return (
      <div data-testid="subscribe-success" className="flex w-full max-w-md flex-col items-start gap-3 text-start">
        <p
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 border-2 border-lime px-4 py-3 text-sm font-medium text-paper"
        >
          <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-lime" strokeWidth={3} />
          <span>{t(copy.success)}</span>
        </p>
        <button
          type="button"
          onClick={reset}
          className={`label text-paper/70 underline decoration-paper/40 underline-offset-4 transition-colors duration-150 hover:text-lime ${RING}`}
        >
          {t(L("Другой адрес", "Use another address", "כתובת אחרת"))}
        </button>
      </div>
    );
  }

  const message = status === "error" ? t(copy.error) : invalid ? t(copy.invalid) : "";
  const messageClass = message ? "border-s-4 border-lime ps-3 text-sm font-medium text-paper" : "sr-only";

  return (
    <form onSubmit={onSubmit} noValidate data-testid="subscribe-form" className="relative flex w-full max-w-md flex-col gap-3">
      <label htmlFor="subscribe-email" className="label text-paper/60">
        {t(copy.label)}
      </label>
      <input
        ref={inputRef}
        id="subscribe-email"
        data-testid="subscribe-email"
        type="email"
        name="email"
        dir="ltr"
        inputMode="email"
        autoComplete="email"
        value={email}
        onChange={(ev) => {
          setEmail(ev.target.value);
          if (status === "invalid" || status === "error") setStatus("idle");
        }}
        placeholder={t(copy.placeholder)}
        disabled={busy}
        aria-invalid={invalid || undefined}
        aria-describedby="subscribe-status"
        className={`w-full border-2 bg-transparent px-3 py-2.5 text-start text-base text-paper placeholder:text-paper/60 focus:bg-paper/10 disabled:opacity-60 ${RING} ${invalid ? "border-lime" : "border-paper"}`}
      />
      {/* Honeypot: off-screen, out of tab order, hidden from assistive tech */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={(ev) => setHoneypot(ev.target.value)}
        className="absolute -start-[9999px] top-0 h-px w-px overflow-hidden opacity-0"
      />
      <button
        type="submit"
        id="subscribe-submit"
        data-testid="subscribe-submit"
        disabled={busy}
        aria-busy={busy || undefined}
        className={`label self-start border-2 border-lime bg-lime px-5 py-2.5 font-bold text-ink hover:bg-transparent hover:text-lime disabled:opacity-60 ${RING}`}
      >
        {busy ? t(copy.submitting) : t(copy.submit)}
      </button>
      <p id="subscribe-status" role="status" aria-live="polite" data-testid="subscribe-status" className={messageClass}>
        {message}
      </p>
    </form>
  );
}
