"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { SUBSCRIBE_DONE } from "@/lib/content";

// 303 target of GET /api/subscribe/confirm for a valid token.
export default function SubscribeDonePage() {
  const { t } = useI18n();

  return (
    <section
      data-testid="subscribe-done"
      aria-labelledby="subscribe-result-title"
      className="mx-auto flex min-h-[60dvh] w-full max-w-3xl flex-col items-start justify-center gap-6 px-6 py-24 sm:px-8"
    >
      <h1 id="subscribe-result-title" className="text-4xl font-extrabold sm:text-5xl">
        {t(SUBSCRIBE_DONE.heading)}
      </h1>
      <p role="status" className="max-w-[60ch] text-start text-base text-ink">
        {t(SUBSCRIBE_DONE.body)}
      </p>
      <Link href="/" className="label inline-flex items-center border-2 border-ink bg-lime px-5 py-2.5 font-bold text-ink transition-colors hover:bg-ink hover:text-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.97]">
        {t(SUBSCRIBE_DONE.home)}
      </Link>
    </section>
  );
}
