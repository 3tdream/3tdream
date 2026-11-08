"use client";

import Link from "next/link";
import { useI18n, L } from "@/lib/i18n";
import { SUBSCRIBE_INVALID_PAGE } from "@/lib/content";

export default function SubscribeInvalidPage() {
  const { t } = useI18n();

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-10 py-20">
      <div className="max-w-xl w-full hard-border hard-shadow bg-paper-alt p-8 sm:p-12 text-center">
        <div className="label text-error mb-4">
          {t(L("Ошибка", "Error", "שגיאה"))}
        </div>
        <h1 className="display text-3xl sm:text-4xl font-extrabold mb-4">
          {t(SUBSCRIBE_INVALID_PAGE.title)}
        </h1>
        <p className="text-base text-muted mb-8">
          {t(SUBSCRIBE_INVALID_PAGE.body)}
        </p>
        <Link
          href="/"
          className="hard-border hard-shadow inline-flex items-center justify-center bg-accent px-6 py-3 font-bold uppercase tracking-wide text-ink transition-shadow hover:shadow-lg"
        >
          {t(SUBSCRIBE_INVALID_PAGE.back)}
        </Link>
      </div>
    </main>
  );
}
