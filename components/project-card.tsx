"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useI18n, L } from "@/lib/i18n";
import type { Project } from "@/lib/content";
import Link from "next/link";
import Image from "next/image";
import { hasCase } from "@/lib/case-slugs";
import { CASES } from "@/lib/cases";

export function ProjectCard({ project, index, showImage = true }: { project: Project; index: number; showImage?: boolean }) {
  const { t } = useI18n();
  const num = String(index + 1).padStart(2, "0");

  const Inner = (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={[
        "group relative flex flex-col h-full bg-paper hard-border p-6 sm:p-7 transition-all duration-200",
        "hover:-translate-y-1",
        project.accent ? "hover-shadow-accent" : "hover-shadow",
      ].join(" ")}
    >
      {showImage && CASES[project.slug] ? <Image src={CASES[project.slug].figures[0].src} alt={t(CASES[project.slug].figures[0].caption)} width={CASES[project.slug].figures[0].width} height={CASES[project.slug].figures[0].height} sizes="(max-width: 768px) 100vw, 50vw" className="w-full aspect-[16/10] object-contain bg-paper-alt border border-ink/20 mb-6" /> : null}
      {/* top row */}
      <div className="flex items-start justify-between gap-3">
        <span
          className="text-4xl font-extrabold text-ink/15 display leading-none"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {num}
        </span>
        <div className="flex flex-wrap items-center justify-end gap-1.5">

        </div>
      </div>

      {/* title */}
      <div className="mt-5 flex items-center gap-2">
        <h3 className="text-2xl sm:text-[28px] font-extrabold display">{project.title}</h3>
        {project.url && (
          <ArrowUpRight className="w-5 h-5 text-accent opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        )}
      </div>

      <p className="mt-3 text-base font-medium leading-relaxed text-ink-soft">{t(CASES[project.slug]?.intro ?? project.tagline)}</p>
      <p className="mt-3 text-sm text-muted leading-relaxed flex-1">
        {t(CASES[project.slug]?.deliverable ?? project.description)}
      </p>

      {/* role */}
      <p
        className="mt-4 text-[11px] uppercase tracking-wider text-ink/50"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {project.year} — {t(project.role)}
      </p>

      {/* tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-[11px] font-medium bg-paper-alt text-ink-soft border border-ink/15"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-6 pt-4 border-t border-ink/20 font-bold text-sm text-accent">{hasCase(project.slug) ? t(L("Читать кейс", "Read case study", "לקריאת מקרה הבוחן")) : t(L("Открыть проект", "Open project", "פתיחת הפרויקט"))} <span aria-hidden>↗</span></p>
    </motion.article>
  );

  if (hasCase(project.slug)) return <Link href={`/projects/${project.slug}`} className="block h-full">{Inner}</Link>;
  if (project.url) return <a href={project.url} target="_blank" rel="noopener noreferrer" className="block h-full">{Inner}</a>;
  return Inner;
}
