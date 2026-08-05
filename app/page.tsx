"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, GraduationCap, Palette, PenTool, Boxes } from "lucide-react";
import { useI18n, L } from "@/lib/i18n";
import { BRAND, STATS, SERVICES, PROJECTS, COURSES, DESIGN } from "@/lib/content";
import { Marquee } from "@/components/marquee";
import { ProjectCard } from "@/components/project-card";

const DISC_ICONS: Record<string, React.ElementType> = {
  brand: Palette,
  product: PenTool,
  motion: Boxes,
};

export default function HomePage() {
  const { t } = useI18n();
  const featured = PROJECTS.slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="relative grid-paper border-b-2 border-ink overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 hard-border bg-paper px-3 py-1.5 mb-8"
          >
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="label">{t(BRAND.expansion)}</span>
          </motion.div>

          <h1 className="display text-[clamp(3rem,12vw,11rem)] uppercase">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="block"
            >
              Time To
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="block text-accent"
            >
              Team Dream
            </motion.span>
          </h1>

          <div className="mt-8 grid lg:grid-cols-12 gap-8 items-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-7"
            >
              <p className="text-xl sm:text-2xl font-semibold max-w-2xl">
                {t(BRAND.tagline)}
              </p>
              <p className="mt-3 text-base text-ink-soft max-w-xl">{t(BRAND.intro)}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 font-bold hard-shadow hover:bg-accent transition-colors"
                >
                  {t(L("Смотреть проекты", "See the work", "לעבודות"))}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-paper text-ink px-6 py-3.5 font-bold hard-border hover-shadow transition-all"
                >
                  {t(L("Обсудить заказ", "Start a project", "להתחיל פרויקט"))}
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="lg:col-span-5 grid grid-cols-2 gap-px bg-ink hard-border"
            >
              {STATS.map((s) => (
                <div key={s.value} className="bg-paper p-5">
                  <div className="text-4xl sm:text-5xl font-extrabold display text-accent">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-ink-soft leading-tight">
                    {t(s.label)}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee
        items={[
          "WEB APPS",
          "AI AGENTS",
          "BOOKING BOTS",
          "LANDING PAGES",
          "DESIGN SYSTEMS",
          "FROM BRIEF TO PRODUCTION",
        ]}
      />

      {/* FEATURED WORK */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <div className="label text-accent mb-2">/ 02 — {t(L("Работы", "Selected work", "עבודות נבחרות"))}</div>
            <h2 className="text-3xl sm:text-5xl font-extrabold display">
              {t(L("Над чем работаю", "What I build", "מה אני בונה"))}
            </h2>
          </div>
          <Link
            href="/projects"
            className="link-reveal inline-flex items-center gap-1.5 font-bold text-ink"
          >
            {t(L("Все проекты", "All projects", "כל הפרויקטים"))}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* DESIGN */}
      <section className="border-t-2 border-ink">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <div className="label text-accent mb-2">/ 03 — {t(L("Дизайн", "Design", "עיצוב"))}</div>
              <h2 className="text-3xl sm:text-5xl font-extrabold display max-w-2xl">
                {t(L("Дизайн — моя первая профессия", "Design is my first craft", "עיצוב הוא המקצוע הראשון שלי"))}
              </h2>
              <p className="mt-4 max-w-xl text-base text-ink-soft">
                {t(
                  L(
                    "10+ лет в визуале: бренд и реклама, продуктовый UX/UI, 3D и моушн. Продукты я не просто кодирую — я их проектирую.",
                    "10+ years in the visual craft: brand & advertising, product UX/UI, 3D & motion. I don't just code products — I design them.",
                    "10+ שנים בקראפט החזותי: מיתוג ופרסום, UX/UI מוצרי, תלת-ממד ומושן. אני לא רק מקודד מוצרים — אני מעצב אותם."
                  )
                )}
              </p>
            </div>
            <a
              href={DESIGN.behance}
              target="_blank"
              rel="noopener noreferrer"
              className="link-reveal inline-flex items-center gap-1.5 font-bold text-ink"
            >
              {t(L("Портфолио на Behance", "Portfolio on Behance", "הפורטפוליו ב-Behance"))}
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid gap-px bg-ink hard-border md:grid-cols-3">
            {DESIGN.disciplines.map((d) => {
              const Icon = DISC_ICONS[d.id] ?? Palette;
              return (
                <div key={d.id} className="bg-paper p-7 sm:p-8 flex flex-col">
                  <span className="grid place-items-center w-11 h-11 bg-ink text-paper mb-5">
                    <Icon className="w-6 h-6" />
                  </span>
                  <h3 className="text-xl font-extrabold">{t(d.title)}</h3>
                  <p
                    className="mt-1 text-[11px] font-bold uppercase tracking-wider text-accent"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {d.credit}
                  </p>
                  <p className="mt-3 text-sm text-muted leading-relaxed flex-1">{t(d.desc)}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {d.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[11px] font-medium bg-paper-alt text-ink-soft border border-ink/15"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="border-t-2 border-ink bg-paper-alt">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
          <div className="label text-accent mb-2">/ 04 — {t(L("Услуги", "Services", "שירותים"))}</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold display mb-10 max-w-3xl">
            {t(L("Ведём проект целиком — от идеи до живого продукта", "We oversee the whole project — idea to a live one", "מלווים את הפרויקט מקצה לקצה — מרעיון למוצר חי"))}
          </h2>
          <div className="grid gap-px bg-ink hard-border md:grid-cols-2">
            {SERVICES.map((s, i) => (
              <div key={s.id} className="bg-paper p-7 sm:p-8">
                <div
                  className="text-sm font-bold text-ink/30 mb-3"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-xl font-extrabold mb-2">{t(s.title)}</h3>
                <p className="text-sm text-muted leading-relaxed">{t(s.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES teaser */}
      <section className="border-t-2 border-ink">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="label text-accent mb-2">/ 05 — {t(L("Курсы", "Courses", "קורסים"))}</div>
              <h2 className="text-3xl sm:text-5xl font-extrabold display max-w-2xl">
                {t(L("Не только строю — ещё и учу", "I don't just build — I teach", "לא רק בונה — גם מלמד"))}
              </h2>
              <p className="mt-4 max-w-xl text-base text-ink-soft">
                {t(
                  L(
                    "Живой курс UX/UI с нуля: практика в Figma, разбор работ и реальный кейс в портфолио.",
                    "A live UX/UI course from scratch: hands-on Figma, live critique and a real portfolio case.",
                    "קורס UX/UI חי מאפס: תרגול ב-Figma, ביקורת חיה וקייס אמיתי לתיק."
                  )
                )}
              </p>
              <Link
                href="/courses"
                className="group mt-6 inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 font-bold hard-shadow hover:bg-accent transition-colors"
              >
                {t(L("Все курсы", "See courses", "לכל הקורסים"))}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
              </Link>
            </div>

            {/* mini course card */}
            <div className="lg:col-span-5">
              <Link href="/courses" className="group block bg-paper hard-border p-6 sm:p-7 hover-shadow hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between">
                  <span className="grid place-items-center w-11 h-11 bg-ink text-paper">
                    <GraduationCap className="w-6 h-6" />
                  </span>
                  <span className="label text-accent">{t(COURSES[0].level)}</span>
                </div>
                <h3 className="mt-5 text-2xl font-extrabold display">{COURSES[0].title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {t(COURSES[0].tagline)}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {COURSES[0].meta.map((m, mi) => (
                    <span
                      key={mi}
                      className="px-2 py-0.5 text-[11px] font-medium bg-paper-alt text-ink-soft border border-ink/15"
                    >
                      {t(m)}
                    </span>
                  ))}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t-2 border-ink bg-accent text-paper">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20 text-center">
          <h2 className="display text-[clamp(2.2rem,7vw,5rem)] uppercase">
            {t(L("Запустим ваш продукт", "Let's ship your product", "בואו נשיק את המוצר"))}
          </h2>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 bg-paper text-ink px-7 py-4 font-bold hard-shadow hover:bg-lime transition-colors"
          >
            {t(L("Написать мне", "Get in touch", "דברו איתי"))}
            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          </Link>
        </div>
      </section>
    </div>
  );
}
