"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useI18n, L } from "@/lib/i18n";
import type { Project } from "@/lib/content";
import Link from "next/link";
import Image from "next/image";
import { hasCase } from "@/lib/case-slugs";
import { CASES } from "@/lib/cases";
import { PORTFOLIO } from "@/lib/portfolio";

export function ProjectCard({ project, index, showImage = true }: { project: Project; index: number; showImage?: boolean }) {
  const { t } = useI18n();
  const reducedMotion = useReducedMotion();
  const study = CASES[project.slug];
  const cover = study?.figures[0];
  const isCase = hasCase(project.slug);
  const isExternal = !isCase && Boolean(project.url);
  const action = isCase ? t(L("Читать кейс", "Read case study", "לקריאת מקרה הבוחן")) : t(project.linkLabel ?? L("Открыть проект", "Open project", "לפתיחת הפרויקט"));

  const inner = (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`group relative flex flex-col h-full bg-paper hard-border p-6 sm:p-7 transition-all duration-200 hover:-translate-y-1 ${project.accent ? "hover-shadow-accent" : "hover-shadow"}`}
    >
      {showImage && cover ? (
        <Image src={cover.src} alt={t(cover.caption)} width={cover.width} height={cover.height} sizes="(max-width: 768px) 100vw, 50vw" className="w-full aspect-[16/10] object-contain bg-paper-alt border border-ink/20 mb-6" />
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <span className="text-4xl font-extrabold text-ink/15 display leading-none font-mono" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        {isCase ? <span className="label text-accent text-end">{t(L("Кейс", "Case study", "מקרה בוחן"))}</span> : null}
        {project.aiGenerated ? (
          <span className="shrink-0 border border-ink/30 bg-paper-alt px-2 py-1 text-[10px] uppercase tracking-wider font-mono text-ink-soft text-end">
            {t(PORTFOLIO.aiGenerated)}
          </span>
        ) : null}
      </div>
      <h3 className="mt-5 text-2xl sm:text-[28px] font-extrabold leading-tight break-words">{project.title}</h3>
      <p className="mt-3 text-base font-medium leading-relaxed text-ink-soft">{t(study?.intro ?? project.tagline)}</p>
      <p className="mt-3 text-sm text-muted leading-relaxed flex-1">{t(study?.deliverable ?? project.description)}</p>
      <p className="mt-4 text-[11px] uppercase tracking-wider text-muted font-mono">{project.year ? `${project.year} · ` : ""}{t(study?.role ?? project.role)}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => <span key={tag} className="px-2 py-0.5 text-[11px] font-medium bg-paper-alt text-ink-soft border border-ink/15">{tag}</span>)}
      </div>
      {isCase || isExternal ? (
        <p className="mt-6 pt-4 border-t border-ink/20 font-bold text-sm text-accent flex items-center justify-between gap-3">
          <span>{action}{isExternal ? <span className="sr-only"> ({t(PORTFOLIO.opensNew)})</span> : null}</span>
          {isCase ? <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" /> : <ArrowUpRight className="w-4 h-4" aria-hidden="true" />}
        </p>
      ) : null}
    </motion.article>
  );

  const label = `${project.title}: ${action}${isExternal ? ` (${t(PORTFOLIO.opensNew)})` : ""}`;
  if (isCase) return <Link href={`/projects/${project.slug}`} aria-label={label} className="block h-full">{inner}</Link>;
  if (project.url) return <a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={label} className="block h-full">{inner}</a>;
  return inner;
}
