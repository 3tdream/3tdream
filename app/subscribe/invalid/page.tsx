"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { SUBSCRIBE_INVALID_HEADING, SUBSCRIBE_INVALID_BODY, SUBSCRIBE_HOME_LINK } from "@/lib/content";

// 303 target of GET /api/subscribe/confirm for every non-valid token.
export default function SubscribeInvalidPage() {
  const { t, dir } = useI18n();

  return (
    <section
      dir={dir}
      data-testid="subscribe-invalid"
      aria-labelledby="subscribe-result-title"
      className="mx-auto flex min-h-[60dvh] w-full max-w-3xl flex-col items-start justify-center gap-6 px-6 py-24 sm:px-8"
    >
      <h1 id="subscribe-result-title" className="display text-4xl font-extrabold sm:text-5xl">
        {t(SUBSCRIBE_INVALID_HEADING)}
      </h1>
      <p className="max-w-[60ch] text-base text-ink">{t(SUBSCRIBE_INVALID_BODY)}</p>
      <Link
        href="/"
        className="hard-border inline-flex min-h-12 items-center justify-center bg-paper px-6 py-3 font-bold text-ink transition-colors hover:bg-lime active:scale-[0.98]"
      >
        {t(SUBSCRIBE_HOME_LINK)}
      </Link>
    </section>
  );
}
