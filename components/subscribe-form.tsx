"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import { SUBSCRIBE_HEADING, SUBSCRIBE_DESCRIPTION, SUBSCRIBE_LABEL, SUBSCRIBE_PLACEHOLDER } from "@/lib/content";
import { SUBSCRIBE_SUBMIT, SUBSCRIBE_SUBMITTING, SUBSCRIBE_SUCCESS } from "@/lib/content";
import { SUBSCRIBE_ERROR_EMAIL, SUBSCRIBE_ERROR_GENERIC } from "@/lib/content";

// API: POST /api/subscribe. Every 202 shows the same message; `delivered` is never read.
type Status = "idle" | "submitting" | "sent" | "invalid_email" | "error";
type ApiBody = { error?: string; field?: string } | null;

export function SubscribeForm() {
  const { t, lang, dir } = useI18n();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const renderedAt = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = status === "submitting";

  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          replyLang: lang,
          formRenderedAt: renderedAt.current,
          company_website: honeypot,
        }),
      });
      if (res.status === 202) {
        setStatus("sent");
        setEmail("");
        return;
      }
      const body = (await res.json().catch(() => null)) as ApiBody;
      if (res.status === 400 && body?.error === "invalid_field" && body.field === "email") {
        setStatus("invalid_email");
        inputRef.current?.focus();
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const errorText =
    status === "invalid_email" ? t(SUBSCRIBE_ERROR_EMAIL) : status === "error" ? t(SUBSCRIBE_ERROR_GENERIC) : "";

  return (
    <section dir={dir} aria-labelledby="subscribe-heading" className="w-full max-w-md">
      <h2 id="subscribe-heading" className="label mb-2 text-paper">
        {t(SUBSCRIBE_HEADING)}
      </h2>
      {
        <form data-testid="subscribe-form" onSubmit={onSubmit} noValidate className="relative flex flex-col gap-2">
          <p id="subscribe-hint" className="text-sm text-paper/70">
            {t(SUBSCRIBE_DESCRIPTION)}
          </p>
          <label htmlFor="subscribe-email" className="text-sm text-paper/80">
            {t(SUBSCRIBE_LABEL)}
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              ref={inputRef}
              id="subscribe-email"
              data-testid="subscribe-email"
              name="email"
              type="email"
              dir="ltr"
              inputMode="email"
              autoComplete="email"
              required
              disabled={busy}
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder={t(SUBSCRIBE_PLACEHOLDER)}
              aria-invalid={status === "invalid_email" ? true : undefined}
              aria-describedby={errorText ? "subscribe-error" : "subscribe-hint"}
              className="min-h-12 min-w-0 flex-1 rounded-none border-2 border-paper bg-ink px-4 py-3 text-base text-paper placeholder:text-paper/60 focus-visible:outline-lime disabled:opacity-60 aria-[invalid=true]:border-dashed"
            />
            <button
              type="submit"
              data-testid="subscribe-submit"
              disabled={busy}
              className="min-h-12 whitespace-nowrap rounded-none bg-lime px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] text-ink transition-transform duration-150 ease-out focus-visible:outline-lime active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? t(SUBSCRIBE_SUBMITTING) : t(SUBSCRIBE_SUBMIT)}
            </button>
          </div>
          <p
            id="subscribe-error"
            role="status"
            data-testid="subscribe-status"
            className={
              status === "sent"
                ? "hard-border bg-lime px-4 py-3 font-medium text-ink"
                : errorText
                  ? "self-start bg-paper px-2 py-1 text-sm font-medium text-red-800"
                  : "hidden"
            }
          >
            {status === "sent" ? t(SUBSCRIBE_SUCCESS) : errorText}
          </p>
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <input name="company_website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(ev) => setHoneypot(ev.target.value)} />
          </div>
        </form>
      }
    </section>
  );
}
