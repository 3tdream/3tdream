"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import { SubscribeCopy } from "@/lib/content";

// POST /api/subscribe: 202 -> "check your inbox" (same for every non-error branch), 400 -> inline error.
type Status = "idle" | "submitting" | "sent" | "error" | "failed";

const RING =
  "focus-visible:outline-[3px] focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-lime";
const FIELD = `min-h-11 w-full min-w-0 flex-1 border-2 border-paper bg-transparent px-4 py-2.5 text-paper placeholder:text-paper/60 disabled:opacity-50 ${RING}`;
const BUTTON = `min-h-11 shrink-0 whitespace-nowrap border-2 border-lime bg-lime px-6 py-2.5 font-bold text-ink transition-[transform,background-color] duration-150 ease-out hover:bg-paper active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 ${RING}`;
const STATUS_CLASS: Record<Status, string> = {
  idle: "text-paper/70",
  submitting: "text-paper/70",
  sent: "text-lime",
  error: "text-paper underline decoration-lime decoration-2 underline-offset-4",
  failed: "text-paper underline decoration-lime decoration-2 underline-offset-4",
};
// Clip-hidden in place (no off-screen offset): a -10000px offset adds a horizontal scrollbar in RTL (Hebrew).
const HIDDEN = {
  position: "absolute",
  top: 0,
  insetInlineStart: 0,
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  opacity: 0,
  pointerEvents: "none",
} as const;

export function SubscribeForm() {
  const { t, lang, dir } = useI18n();
  const copy = SubscribeCopy.form;
  const inputId = useId();
  const statusId = useId();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const renderedAt = useRef(0);
  const busy = status === "submitting";

  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  const statusText =
    status === "sent"
      ? t(copy.sent)
      : status === "error"
        ? t(copy.invalid)
        : status === "failed"
          ? t(copy.failed)
          : busy
            ? t(copy.submitting)
            : "";

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
          company_website: honeypot,
          formRenderedAt: renderedAt.current || Date.now(),
          replyLang: lang,
        }),
      });
      if (res.status === 202) {
        setStatus("sent");
        setEmail("");
        setHoneypot("");
      } else if (res.status === 400) {
        setStatus("error");
      } else {
        setStatus("failed");
      }
    } catch {
      setStatus("failed");
    }
  }

  return (
    <form data-testid="subscribe-form" dir={dir} noValidate aria-busy={busy} onSubmit={onSubmit} className="relative w-full max-w-md">
      <label htmlFor={inputId} className="label mb-3 block text-paper/80">
        {t(copy.label)}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={inputId}
          data-testid="subscribe-email"
          type="email"
          name="email"
          dir="ltr"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder={t(copy.placeholder)}
          disabled={busy}
          aria-invalid={status === "error"}
          aria-describedby={statusId}
          className={FIELD}
        />
        <button type="submit" data-testid="subscribe-submit" disabled={busy} className={BUTTON}>
          {busy ? t(copy.submitting) : t(copy.submit)}
        </button>
      </div>
      <div aria-hidden="true" style={HIDDEN}>
        <input
          name="company_website"
          type="text"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          value={honeypot}
          onChange={(ev) => setHoneypot(ev.target.value)}
        />
      </div>
      <p id={statusId} data-testid="subscribe-status" role="status" aria-live="polite" className={"mt-3 min-h-6 text-sm " + STATUS_CLASS[status]}>
        {statusText}
      </p>
    </form>
  );
}
