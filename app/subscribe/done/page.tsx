"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SUBSCRIBE_DONE } from "@/lib/content";

// 303 target of GET /api/subscribe/confirm for a valid token.
export default function SubscribeDonePage() {
  const { t } = useI18n();

  return (
    <section
      id="subscribe-done"
      data-testid="subscribe-done"
      aria-labelledby="subscribe-result-title"
      className="mx-auto flex min-h-[60dvh] w-full max-w-3xl flex-col items-start justify-center gap-6 px-6 py-24 sm:px-8"
    >
      <span
        aria-hidden="true"
        className="hard-border inline-flex size-16 items-center justify-center bg-lime text-ink shadow-[4px_4px_0_var(--color-ink)]"
      >
        <Check className="size-9" strokeWidth={3} />
      </span>
      <h1 id="subscribe-result-title" className="text-start text-4xl font-extrabold sm:text-5xl">
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
    </section>
  );
}
