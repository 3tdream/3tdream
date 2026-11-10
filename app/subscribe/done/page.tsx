"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { L } from "@/lib/localized";
import { BRAND } from "@/lib/content";

const COPY = {
  title: L(
    "Подписка подтверждена",
    "Subscription confirmed",
    "ההרשמה אושרה"
  ),
  body: L(
    "Спасибо! Вы будете получать Build Notes — письма о новых проектах и процессе работы.",
    "Thanks! You'll now receive Build Notes — updates on new projects and process.",
    "תודה! מעכשיו תקבלו את Build Notes — עדכונים על פרויקטים חדשים ועל התהליך."
  ),
  back: L("На главную", "Back to home", "חזרה לדף הבית"),
};

export default function SubscribeDonePage() {
  const { t } = useI18n();

  return (
    <main data-testid="subscribe-done" className="mx-auto flex min-h-[70dvh] max-w-2xl flex-col items-start justify-center gap-6 px-6 py-24 sm:px-8">
      <span className="label text-accent">{BRAND.name}</span>
      <h1 className="display text-4xl font-extrabold sm:text-5xl">{t(COPY.title)}</h1>
      <p className="max-w-[60ch] text-base text-ink-soft">{t(COPY.body)}</p>
      <Link
        href="/"
        className="hard-border hard-shadow inline-flex items-center justify-center bg-accent px-6 py-3 font-bold uppercase tracking-wide text-ink transition-shadow hover:shadow-lg"
      >
        {t(COPY.back)}
      </Link>
    </main>
  );
}
