"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/lib/content";
import { hasCase } from "@/lib/case-slugs";
import { DESIGN_ARCHIVE, INVENTION, PORTFOLIO } from "@/lib/portfolio";
import { useI18n } from "@/lib/i18n";
import { ProjectCard } from "@/components/project-card";
import { DesignArchive } from "@/components/design-archive";

const caseProjects = PROJECTS.filter((project) => hasCase(project.slug));
const otherProjects = PROJECTS.filter((project) => !hasCase(project.slug));
const sections = [
  { id: "case-studies", label: PORTFOLIO.cases, count: caseProjects.length },
  { id: "products", label: PORTFOLIO.products, count: otherProjects.length },
  { id: "design-archive", label: PORTFOLIO.archive, count: DESIGN_ARCHIVE.length },
  { id: "invention", label: PORTFOLIO.invention, count: 1 },
];

export function PortfolioIndex() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
      <header className="border-b-2 border-ink pb-8 mb-12 sm:mb-16">
        <p className="label text-accent mb-3">/ 02</p>
        <h1 className="display text-[clamp(2.5rem,9vw,7rem)] uppercase break-words">{t(PORTFOLIO.title)}</h1>
        <p className="mt-5 max-w-2xl text-base sm:text-lg text-ink-soft leading-relaxed">{t(PORTFOLIO.intro)}</p>
        <nav aria-label={t(PORTFOLIO.nav)} className="mt-8">
          <ul className="flex flex-wrap gap-3">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="inline-flex items-center gap-3 hard-border px-4 py-3 text-sm font-bold hover:bg-ink hover:text-paper transition-colors">
                  {t(section.label)}<span className="font-mono text-xs opacity-60" aria-hidden="true">{String(section.count).padStart(2, "0")}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <section id="case-studies" aria-labelledby="cases-heading" className="scroll-mt-24">
        <div className="mb-7">
          <h2 id="cases-heading" className="display text-3xl sm:text-4xl">{t(PORTFOLIO.cases)}</h2>
          <p className="mt-3 max-w-2xl text-ink-soft leading-relaxed">{t(PORTFOLIO.casesIntro)}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {caseProjects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} showImage={false} />)}
        </div>
      </section>

      <section id="products" aria-labelledby="products-heading" className="scroll-mt-24 mt-16 sm:mt-20 pt-10 border-t-2 border-ink">
        <h2 id="products-heading" className="display text-3xl sm:text-4xl">{t(PORTFOLIO.products)}</h2>
        <p className="mt-3 mb-7 max-w-2xl text-ink-soft leading-relaxed">{t(PORTFOLIO.productsIntro)}</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {otherProjects.map((project, index) => <ProjectCard key={project.slug} project={project} index={caseProjects.length + index} showImage={false} />)}
        </div>
      </section>

      <section id="design-archive" aria-labelledby="archive-heading" className="scroll-mt-24 mt-16 sm:mt-20 pt-10 border-t-2 border-ink">
        <h2 id="archive-heading" className="display text-3xl sm:text-4xl">{t(PORTFOLIO.archive)}</h2>
        <p className="mt-3 mb-7 max-w-2xl text-ink-soft leading-relaxed">{t(PORTFOLIO.archiveIntro)}</p>
        <DesignArchive />
      </section>

      <section id="invention" aria-labelledby="invention-heading" className="scroll-mt-24 mt-16 sm:mt-20 grid md:grid-cols-3 gap-6 hard-border bg-paper-alt p-6 sm:p-8">
        <div><p className="label text-accent">{t(PORTFOLIO.invention)}</p><p className="mt-4 font-mono font-bold text-lg" dir="ltr">{INVENTION.number}</p></div>
        <div className="md:col-span-2 min-w-0">
          <h2 id="invention-heading" className="text-2xl sm:text-3xl font-extrabold leading-tight">{INVENTION.title}</h2>
          <p className="mt-4 max-w-2xl text-ink-soft leading-relaxed">{t(INVENTION.text)}</p>
          <a href={INVENTION.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-accent font-bold underline underline-offset-4">
            {t(PORTFOLIO.patent)}<span className="sr-only"> ({t(PORTFOLIO.opensNew)})</span><ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="mt-16 sm:mt-20 border-t-2 border-ink pt-10">
        <h2 className="display text-3xl sm:text-4xl">{t(PORTFOLIO.contact)}</h2>
        <p className="mt-4 text-ink-soft">{t(PORTFOLIO.contactText)}</p>
        <Link href="/contact#lead-form" className="mt-6 inline-flex items-center gap-3 bg-ink text-paper px-6 py-4 font-bold hard-shadow hover:bg-accent transition-colors">
          {t(PORTFOLIO.contactAction)}<ArrowRight className="w-5 h-5 rtl:rotate-180" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
