"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { useI18n, L } from "@/lib/i18n";
import { STATS, PROFILE } from "@/lib/content";
import { Timeline } from "@/components/timeline";

const STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind",
  "Framer Motion",
  "Figma",
  "UX / UI",
  "3D / Animation",
  "Node",
  "PostgreSQL",
  "LLM / Anthropic API",
  "Multi-agent pipelines",
  "Telegram Bot API",
  "Google Calendar API",
  "Vercel",
];

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div>
      {/* hero */}
      <section className="grid-paper border-b-2 border-ink">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
          <div className="label text-accent mb-3">/ 03 — {t(L("Обо мне", "About", "אודות"))}</div>
          <h1 className="display text-[clamp(2.2rem,7vw,5.5rem)] uppercase max-w-5xl">
            {t(PROFILE.headline)}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-lg font-extrabold">{PROFILE.name}</span>
            <span className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
              <MapPin className="w-4 h-4 text-accent" />
              {t(PROFILE.location)}
            </span>
          </div>

          <p className="mt-6 max-w-2xl text-lg text-ink-soft">{t(PROFILE.bio)}</p>
        </div>
      </section>

      {/* stats — same light bordered grid + accent numbers as Home */}
      <section className="border-b-2 border-ink">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink hard-border">
            {STATS.map((s) => (
              <div key={s.value} className="bg-paper p-5 sm:p-6">
                <div className="text-4xl sm:text-5xl font-extrabold display text-accent">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-ink-soft leading-tight">{t(s.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
        <div className="label text-accent mb-2">{t(L("Путь", "The path", "המסלול"))}</div>
        <h2 className="text-3xl sm:text-5xl font-extrabold display mb-3 max-w-3xl">
          {t(L("От рекламной графики до AI-продуктов", "From advertising graphics to AI products", "מגרפיקת פרסום למוצרי AI"))}
        </h2>
        <p
          className="mb-12 text-xs text-muted"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {t(L("даты ориентировочные", "dates are approximate", "התאריכים משוערים"))}
        </p>
        <div className="max-w-3xl">
          <Timeline />
        </div>
      </section>

      {/* stack */}
      <section className="border-t-2 border-ink bg-paper-alt">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
          <div className="label text-accent mb-2">{t(L("Стек", "Stack", "סטאק"))}</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold display mb-8">
            {t(L("Чем собираю", "What I build with", "עם מה אני בונה"))}
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {STACK.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-paper hard-border font-bold text-sm hover-shadow hover:-translate-y-0.5 transition-transform"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — same blue full-width block as Home */}
      <section className="border-t-2 border-ink bg-accent text-paper">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20 text-center">
          <h2 className="display text-[clamp(2.2rem,7vw,5rem)] uppercase">
            {t(L("Поработаем вместе?", "Let's work together?", "נעבוד יחד?"))}
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
