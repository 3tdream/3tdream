"use client";

import { motion } from "framer-motion";
import { useI18n, L } from "@/lib/i18n";
import { BRAND, CONTACT_CTA } from "@/lib/content";
import { ContactButtons } from "@/components/contact-buttons";

export default function ContactPage() {
  const { t } = useI18n();

  return (
    <div className="grid-paper min-h-[70vh]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* left */}
          <div className="lg:col-span-7">
            <div className="label text-accent mb-3">/ 04 — {t(L("Контакт", "Contact", "צור קשר"))}</div>
            <h1 className="display text-[clamp(2.5rem,10vw,8rem)] uppercase">
              {t(L("Поговорим", "Let's talk", "בואו נדבר"))}
            </h1>
            <p className="mt-6 max-w-xl text-lg sm:text-xl font-semibold">
              {t(CONTACT_CTA)}
            </p>
            <p className="mt-3 max-w-xl text-base text-ink-soft">
              {t(
                L(
                  "Опишите задачу в двух словах: что за продукт, для кого и в какие сроки. Дальше предложу, как это собрать.",
                  "Describe the task in two lines: what product, for whom, and the timeline. I'll propose how to build it.",
                  "תארו את המשימה בשתי שורות: איזה מוצר, למי, ובאיזה לוח זמנים. אציע איך לבנות."
                )
              )}
            </p>

            <div className="mt-8 inline-flex flex-col gap-1 hard-border bg-paper p-5">
              <span className="label text-ink/40">{t(BRAND.expansion)}</span>
              <span className="text-2xl font-extrabold display">3TDream</span>
              <span className="text-sm text-muted">{t(BRAND.tagline)}</span>
            </div>
          </div>

          {/* right — links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5"
          >
            <div className="label mb-4 text-ink/50">
              {t(L("Выберите канал", "Pick a channel", "בחרו ערוץ"))}
            </div>
            <ContactButtons variant="grid" />
            <p
              className="mt-6 text-xs text-muted"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {t(
                L(
                  "Отвечаю обычно в течение дня.",
                  "I usually reply within a day.",
                  "בדרך כלל עונה תוך יום."
                )
              )}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
