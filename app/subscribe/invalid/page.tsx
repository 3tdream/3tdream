"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { SUBSCRIBE_INVALID } from "@/lib/content";

// 303 target of GET /api/subscribe/confirm for a missing, tampered or expired token.
export default function SubscribeInvalidPage() {
  const { t } = useI18n();

  return (
    <section
      data-testid="subscribe-invalid"
      aria-labelledby="subscribe-result-title"
      className="mx-auto flex min-h-[60dvh] w-full max-w-3xl flex-col items-start justify-center gap-6 px-6 py-24 sm:px-8"
    >
      <h1 id="subscribe-result-title" className="text-4xl font-extrabold sm:text-5xl">
        {t(SUBSCRIBE_INVALID.heading)}
      </h1>
      <p role="alert" className="max-w-[60ch] text-start text-base text-ink">
        {t(SUBSCRIBE_INVALID.body)}
      </p>
      <Link
        href="/"
        className="hard-border inline-flex min-h-12 items-center justify-center bg-lime px-6 py-3 font-bold text-ink transition-[transform,background-color] duration-150 ease-out hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.98]"
      >
        {t(SUBSCRIBE_INVALID.home)}
      </Link>
    </section>
  );
}
