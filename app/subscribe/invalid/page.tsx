"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { BRAND, SUBSCRIBE_INVALID_TITLE, SUBSCRIBE_INVALID_BODY, SUBSCRIBE_BACK_HOME } from "@/lib/content";

// 303 target of GET /api/subscribe/confirm for every non-valid token.
export default function SubscribeInvalidPage() {
  const { t } = useI18n();

  return (
    <section
      data-testid="subscribe-invalid"
      aria-labelledby="subscribe-result-title"
      className="mx-auto flex min-h-[60dvh] w-full max-w-3xl flex-col items-start justify-center gap-6 px-6 py-24 sm:px-8"
    >
      <span className="label text-accent">{BRAND.name}</span>
      <h1 id="subscribe-result-title" className="display text-4xl font-extrabold sm:text-5xl">
        {t(SUBSCRIBE_INVALID_TITLE)}
      </h1>
      <p className="max-w-[60ch] text-base text-ink-soft">{t(SUBSCRIBE_INVALID_BODY)}</p>
      <Link
        href="/"
        className="hard-border hard-shadow inline-flex min-h-12 items-center justify-center bg-paper px-6 py-3 font-bold uppercase tracking-wide text-ink"
      >
        {t(SUBSCRIBE_BACK_HOME)}
      </Link>
    </section>
  );
}
