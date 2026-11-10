"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { SUBSCRIBE_DONE_HEADING, SUBSCRIBE_DONE_BODY, SUBSCRIBE_HOME_LINK } from "@/lib/content";

// 303 target of GET /api/subscribe/confirm for a valid token.
export default function SubscribeDonePage() {
  const { t, dir } = useI18n();

  return (
    <section
      dir={dir}
      data-testid="subscribe-done"
      aria-labelledby="subscribe-result-title"
      className="mx-auto flex min-h-[60dvh] w-full max-w-3xl flex-col items-start justify-center gap-6 px-6 py-24 sm:px-8"
    >
      <h1 id="subscribe-result-title" className="display text-4xl font-extrabold sm:text-5xl">
        {t(SUBSCRIBE_DONE_HEADING)}
      </h1>
      <p className="max-w-[60ch] text-base text-ink">{t(SUBSCRIBE_DONE_BODY)}</p>
      <Link
        href="/"
        className="hard-border inline-flex min-h-12 items-center justify-center bg-lime px-6 py-3 font-bold text-ink transition-colors hover:bg-paper active:scale-[0.98]"
      >
        {t(SUBSCRIBE_HOME_LINK)}
      </Link>
    </section>
  );
}
