"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { SubscribeCopy } from "@/lib/content";

export default function SubscribeDonePage() {
  const { t, dir } = useI18n();
  const copy = SubscribeCopy.done;

  return (
    <main
      data-testid="subscribe-done"
      dir={dir}
      className="mx-auto flex min-h-[70dvh] max-w-2xl flex-col items-start justify-center gap-6 px-6 py-24 sm:px-8"
    >
      <h1 className="text-4xl font-extrabold leading-[1.1] sm:text-5xl">{t(copy.heading)}</h1>
      <p className="max-w-[60ch] text-base text-ink-soft">{t(copy.body)}</p>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center justify-center border-2 border-ink bg-lime px-6 py-3 font-bold text-ink transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline-[3px] focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        {t(copy.back)}
      </Link>
    </main>
  );
}
