"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, ArrowUpRight, ArrowRight, Check } from "lucide-react";
import { useI18n, L } from "@/lib/i18n";
import { COURSES } from "@/lib/content";

export default function CoursesPage() {
  const { t } = useI18n();

  return (
    <div>
      {/* hero */}
      <section className="grid-paper border-b-2 border-ink">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
          <div className="label text-accent mb-3">/ 03 — {t(L("Курсы", "Courses", "קורסים"))}</div>
          <h1 className="display text-[clamp(2.5rem,9vw,7rem)] uppercase">
            {t(L("Курсы", "Courses", "קורסים"))}
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-ink-soft">
            {t(
              L(
                "Учу дизайну так же, как строю продукты — на практике и от результата. Ниже — живой курс, куда можно попасть.",
                "I teach design the way I build products — hands-on and outcome-first. Below is a live course you can join.",
                "אני מלמד עיצוב כמו שאני בונה מוצרים — בפרקטיקה ומהתוצאה. למטה קורס חי שאפשר להצטרף אליו."
              )
            )}
          </p>
        </div>
      </section>

      {/* course cards */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 sm:py-20 space-y-10">
        {COURSES.map((c, i) => (
          <motion.article
            key={c.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="bg-paper hard-border hard-shadow"
          >
            <div className="grid lg:grid-cols-2">
              {/* left: identity */}
              <div className="p-7 sm:p-10 border-b-2 lg:border-b-0 lg:border-e-2 border-ink flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <span className="grid place-items-center w-11 h-11 bg-ink text-paper">
                    <GraduationCap className="w-6 h-6" />
                  </span>
                  <span className="label text-accent">{t(c.level)}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold display">{c.title}</h2>
                <p className="mt-3 text-lg font-semibold text-ink-soft">{t(c.tagline)}</p>
                <p className="mt-4 text-sm text-muted leading-relaxed flex-1">
                  {t(c.description)}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 font-bold hard-shadow-sm hover:bg-accent transition-colors"
                  >
                    {t(c.cta)}
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-paper text-ink px-6 py-3.5 font-bold hard-border hover-shadow transition-all"
                  >
                    {t(L("Задать вопрос", "Ask a question", "לשאול שאלה"))}
                  </Link>
                </div>
              </div>

              {/* right: what's inside */}
              <div className="p-7 sm:p-10 bg-paper-alt">
                <div className="label text-ink/50 mb-5">
                  {t(L("Что внутри", "What's inside", "מה בפנים"))}
                </div>
                <ul className="space-y-3">
                  {c.meta.map((m, mi) => (
                    <li key={mi} className="flex items-start gap-3">
                      <span className="grid place-items-center w-5 h-5 bg-lime shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-ink" />
                      </span>
                      <span className="font-medium">{t(m)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t-2 border-ink/10">
                  <div className="label text-ink/50 mb-2">
                    {t(L("Для кого", "Who it's for", "למי זה"))}
                  </div>
                  <p className="text-sm text-ink-soft leading-relaxed">{t(c.audience)}</p>
                </div>
              </div>
            </div>
          </motion.article>
        ))}

        <p
          className="text-xs text-muted"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {t(L("Больше курсов — скоро.", "More courses — soon.", "עוד קורסים — בקרוב."))}
        </p>
      </section>

      {/* CTA */}
      <section className="border-t-2 border-ink bg-accent text-paper">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20 text-center">
          <h2 className="display text-[clamp(2.2rem,7vw,5rem)] uppercase">
            {t(L("Готовы учиться?", "Ready to learn?", "מוכנים ללמוד?"))}
          </h2>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 bg-paper text-ink px-7 py-4 font-bold hard-shadow hover:bg-lime transition-colors"
          >
            {t(L("Связаться", "Get in touch", "צרו קשר"))}
            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          </Link>
        </div>
      </section>
    </div>
  );
}
