"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { SUBSCRIBE_DONE_PAGE, BRAND } from "@/lib/content";

export default function SubscribeDonePage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-2xl flex-col items-start justify-center gap-6 px-6 py-24 sm:px-8">
      <span className="label text-accent">{BRAND.name}</span>
      <h1 className="display text-4xl font-extrabold sm:text-5xl">
        {t(SUBSCRIBE_DONE_PAGE.title)}
      </h1>
      <p className="max-w-[60ch] text-base text-ink-soft">{t(SUBSCRIBE_DONE_PAGE.body)}</p>
      <Link
        href="/"
        className="hard-border hard-shadow inline-flex items-center justify-center bg-accent px-6 py-3 font-bold uppercase tracking-wide text-ink transition-shadow hover:shadow-lg"
      >
        {t(SUBSCRIBE_DONE_PAGE.back)}
      </Link>
    </main>
  );
}
