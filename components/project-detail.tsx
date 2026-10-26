"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { PROJECTS } from "@/lib/content";
import { CASES, type CaseFigure } from "@/lib/cases";
import { useI18n, L } from "@/lib/i18n";

function EvidenceFigure({ figure, priority = false, cover = false }: { figure: CaseFigure; priority?: boolean; cover?: boolean }) {
  const { t } = useI18n();
  return <figure>
    <a href={figure.src} target="_blank" rel="noopener noreferrer" className="block hard-border bg-paper-alt p-2 sm:p-4 focus-visible:outline-offset-4" aria-label={t(L("Открыть экран в полном размере", "Open full-size screen", "פתיחת המסך בגודל מלא"))}>
      <Image src={figure.src} alt={t(figure.caption)} width={figure.width} height={figure.height} priority={priority} sizes={cover ? "(max-width: 1400px) 100vw, 1320px" : "(max-width: 768px) 100vw, 1000px"} className={cover ? "block w-full h-auto" : "block w-auto max-w-full h-auto max-h-[640px] mx-auto"} />
    </a>
    <figcaption className="mt-3 flex items-start gap-3 text-sm text-muted leading-relaxed">
      <span className="flex-1">{t(figure.caption)}</span><ArrowUpRight aria-hidden className="w-4 h-4 shrink-0 mt-1" />
    </figcaption>
  </figure>;
}
export function ProjectDetail({ slug }: { slug: string }) {
  const { t } = useI18n();
  const project = PROJECTS.find(project => project.slug === slug);
  const study = CASES[slug];
  if (!project || !study) return null;
  const nextSlug = slug === "mission-control" ? "uxi-course" : "mission-control";
  return <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
    <Link href="/projects" className="underline underline-offset-4 text-sm font-bold">{t(L("Все проекты", "All projects", "כל הפרויקטים"))}</Link>
    <header className="pt-10 pb-8 sm:pb-12">
      <p className="label text-accent">{t(L("Продуктовый кейс", "Product case study", "מקרה בוחן מוצר"))} / {project.tags.slice(0,2).join(" · ")}</p>
      <h1 className="display text-[clamp(2.8rem,8vw,7rem)] mt-5">{project.title}</h1>
      <p className="text-xl sm:text-3xl leading-snug max-w-4xl mt-6">{t(study.intro)}</p>
      <dl className="mt-10 grid sm:grid-cols-2 hard-border">
        <div className="p-5 sm:p-6 border-b-2 sm:border-b-0 sm:border-e-2 border-ink"><dt className="label text-muted">{t(L("Моя роль", "My role", "התפקיד שלי"))}</dt><dd className="mt-3 text-lg font-semibold">{t(study.role)}</dd></div>
        <div className="p-5 sm:p-6"><dt className="label text-muted">{t(L("Что создано", "Deliverable", "התוצר"))}</dt><dd className="mt-3 text-lg font-semibold">{t(study.deliverable)}</dd></div>
      </dl>
    </header>
    <EvidenceFigure figure={study.figures[0]} priority cover />
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 pt-14 sm:pt-20">
      <nav aria-label={t(L("Разделы кейса", "Case sections", "פרקי המקרה"))} className="lg:col-span-3">
        <ol className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3 lg:sticky lg:top-24">
          {study.sections.map((section,i)=><li key={section.title.en}><a href={`#section-${i}`} className="block py-2 text-sm font-semibold hover:text-accent"><span className="text-accent me-3">{String(i+1).padStart(2,"0")}</span>{t(section.title)}</a></li>)}
          <li><a href="#result" className="block py-2 text-sm font-semibold hover:text-accent"><span className="text-accent me-3">05</span>{t(L("Результат", "Result", "התוצאה"))}</a></li>
        </ol>
      </nav>
      <div className="lg:col-span-9 min-w-0">
        {study.sections.map((section,i)=><section id={`section-${i}`} key={section.title.en} className="scroll-mt-24 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">{t(section.title)}</h2>
          <p className="mt-5 text-base sm:text-lg leading-[1.75] max-w-[70ch] text-ink-soft">{t(section.body)}</p>
        </section>)}
        {study.figures.slice(1).map(figure=><div key={figure.src} className="mb-14"><EvidenceFigure figure={figure} /></div>)}
        <section id="result" className="scroll-mt-24 border-s-4 border-accent bg-paper-alt p-6 sm:p-8">
          <p className="label text-accent">{t(L("Результат, который можно показать", "A result you can inspect", "תוצאה שאפשר לבחון"))}</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-4">{t(study.deliverable)}</h2>
          <p className="mt-5 text-lg leading-relaxed">{t(study.result)}</p>
          <p className="mt-6 text-sm leading-relaxed text-muted">{t(study.evidenceNote)}</p>
        </section>
        <div className="flex flex-wrap gap-5 items-center mt-8">
          {project.url ? <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-ink text-paper px-6 py-4 font-bold hard-shadow">{t(L("Открыть проект", "Open project", "פתיחת הפרויקט"))}<ArrowUpRight aria-hidden className="w-4 h-4"/></a>:null}
          <Link href="/contact" className="font-bold underline underline-offset-4">{t(L("Обсудить работу", "Discuss working together", "לדבר על עבודה משותפת"))}</Link>
        </div>
      </div>
    </div>
    <div className="border-t-2 border-ink mt-16 pt-8"><Link href={`/projects/${nextSlug}`} className="inline-flex items-center gap-3 text-lg font-bold">{t(L("Следующий кейс", "Next case study", "מקרה הבוחן הבא"))}: {nextSlug==="uxi-course"?"UXI Course":"Mission Control"}<ArrowRight aria-hidden className="w-5 h-5 rtl:rotate-180"/></Link></div>
  </main>;
}
