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
      className="mx-auto flex min-h-[60dvh] w-full max-w-3xl flex-col justify-center px-6 py-24 sm:px-8"
    >
      <div className="hard-border hard-shadow relative flex flex-col items-start gap-6 bg-paper py-8 pe-6 ps-12 sm:ps-16 sm:pe-10">
        <span
          aria-hidden="true"
          className="hard-border absolute start-3 top-8 bg-lime px-1 py-2 text-sm font-bold uppercase tracking-widest text-ink [writing-mode:vertical-rl] sm:start-4"
        >
          03/03
        </span>
        <h1 id="subscribe-result-title" className="display text-4xl sm:text-6xl">
          {t(SUBSCRIBE_DONE.heading)}
        </h1>
        <p role="status" className="max-w-[60ch] text-start text-base text-ink">
          {t(SUBSCRIBE_DONE.body)}
        </p>
        <Link
          href="/"
          className="hard-border inline-flex min-h-12 items-center justify-center bg-lime px-6 py-3 font-bold text-ink transition-[transform,background-color] duration-150 ease-out hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.98]"
        >
          {t(SUBSCRIBE_DONE.home)}
        </Link>
      </div>
    </section>
  );
}
