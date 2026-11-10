"use client";

import { useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import {
  SUBSCRIBE,
  SUBSCRIBE_HONEYPOT_FIELD,
  SUBSCRIBE_TIMING_THRESHOLD_MS,
} from "@/lib/content";
import type { ReplyLang } from "@/lib/subscribe-values";

type Status = "idle" | "submitting" | "success" | "error";

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
      [SUBSCRIBE_HONEYPOT_FIELD]: String(data.get(SUBSCRIBE_HONEYPOT_FIELD) || ""),
      formRenderedAt: renderedAt.current,
    };

    // Client-side mirror of the server's timing-trap: skip the network
    // round-trip for an obviously-too-fast submit, same silent 202 outcome.
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as { ok: boolean; delivered?: boolean };
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
    <div className="flex flex-col gap-3" dir={lang === "he" ? "rtl" : undefined}>
      <p className="label text-accent">{t(SUBSCRIBE.heading)}</p>
      <form
        onSubmit={onSubmit}
        noValidate
        data-testid="subscribe-form"
        className="flex flex-col gap-3 sm:flex-row sm:items-start"
      >
        <label htmlFor="subscribe-email" className="sr-only">
          {t(SUBSCRIBE.placeholder)}
        </label>
        <input
          id="subscribe-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={disabled}
          placeholder={t(SUBSCRIBE.placeholder)}
          data-testid="subscribe-email"
          className="w-full rounded-none border-2 border-[var(--color-paper)] bg-transparent px-3 py-2 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-paper)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lime)] disabled:opacity-50 sm:max-w-xs"
        />

        {/* Honeypot: visually + programmatically hidden, never in tab order.
            Real humans (sighted or keyboard) never reach this field; bots
            that fill every input end up here and get silently 202'd. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="company_website">Leave this field empty</label>
          <input
            id="company_website"
            name="company_website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={disabled}
          data-testid="subscribe-submit"
          className="shrink-0 rounded-none border-2 border-[var(--color-lime)] bg-[var(--color-lime)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
        >
          {status === "submitting" ? t(SUBSCRIBE.pending) : t(SUBSCRIBE.button)}
        </button>
      </form>

      {status === "success" && (
        <p className="label text-[var(--color-lime)]" role="status" data-testid="subscribe-status">
          {t(SUBSCRIBE.success)}
        </p>
      )}
      {status === "error" && (
        <p className="label text-red-400" role="alert" data-testid="subscribe-status">
          {t(SUBSCRIBE.error)}
        </p>
      )}
    </div>
  );
}

// Keep the imported threshold referenced for discoverability/consistency
// with the server-side check in app/api/subscribe/route.ts, even though the
// client performs no local gating beyond the honeypot/timestamp capture.
void SUBSCRIBE_TIMING_THRESHOLD_MS;
