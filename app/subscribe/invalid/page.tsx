"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useI18n, L } from "@/lib/i18n";
import { SUBSCRIBE_INVALID } from "@/lib/content";

const UI = {
  needNew: L("Нужна новая ссылка?", "Need a new link?", "צריך קישור חדש?"),
  request: L("Запросить новую ссылку", "Request a new link", "בקשו קישור חדש"),
};

// 303 target of GET /api/subscribe/confirm for a missing, tampered or expired token.
export default function SubscribeInvalidPage() {
  const { t, lang } = useI18n();

  return (
    <section
      id="subscribe-invalid"
      data-testid="subscribe-invalid"
      aria-labelledby="subscribe-result-title"
      className="mx-auto flex min-h-[60dvh] w-full max-w-3xl flex-col items-start justify-center gap-6 px-6 py-24 sm:px-8"
    >
      <span
        aria-hidden="true"
        className="hard-border inline-flex size-16 items-center justify-center bg-paper-alt text-ink shadow-[4px_4px_0_var(--color-ink)]"
      >
        <X className="size-9" strokeWidth={3} />
      </span>
      <h1 id="subscribe-result-title" className="text-start text-4xl font-extrabold sm:text-5xl">
        {t(SUBSCRIBE_INVALID.heading)}
      </h1>
      <p role="alert" className="max-w-[60ch] text-start text-base text-ink">
        {t(SUBSCRIBE_INVALID.body)}
      </p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <Link
          href="/"
          className="hard-border inline-flex min-h-12 items-center justify-center bg-lime px-6 py-3 font-bold text-ink transition-[transform,background-color] duration-150 ease-out hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.98]"
        >
          {t(SUBSCRIBE_INVALID.home)}
        </Link>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-start text-sm text-ink-soft">
          <span>{t(UI.needNew)}</span>
          <Link
            href="/#subscribe"
            className="label inline-flex min-h-11 items-center gap-2 text-ink underline decoration-2 underline-offset-4 transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {t(UI.request)}
            <ArrowRight
              aria-hidden="true"
              className={`size-4 shrink-0 ${lang === "he" ? "-scale-x-100" : ""}`}
              strokeWidth={3}
            />
          </Link>
        </p>
      </div>
    </section>
  );
}
