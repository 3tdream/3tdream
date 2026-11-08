"use client";

import { useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { ARCHIVE_COPY, ARCHIVE_GROUPS, DESIGN_ARCHIVE, filterArchive, type ArchiveGroup } from "@/lib/design-archive";
import { PORTFOLIO } from "@/lib/portfolio";
import { useI18n } from "@/lib/i18n";

export function DesignArchive() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<ArchiveGroup | "all">("all");
  const projects = filterArchive(query, group);
  const filtered = query.length > 0 || group !== "all";
  const reset = () => { setQuery(""); setGroup("all"); };
  const filters = [
    { id: "all" as const, label: ARCHIVE_COPY.all, count: DESIGN_ARCHIVE.length },
    ...ARCHIVE_GROUPS.map(item => ({
      ...item,
      count: DESIGN_ARCHIVE.filter(project => project.group === item.id).length,
    })),
  ];

  return (
    <>
      <div className="mb-7 space-y-5">
        <div className="max-w-xl">
          <label htmlFor="archive-search" className="block text-sm font-bold mb-2">{t(ARCHIVE_COPY.search)}</label>
          <div className="relative">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-soft pointer-events-none" aria-hidden="true" />
            <input
              id="archive-search"
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder={t(ARCHIVE_COPY.placeholder)}
              aria-controls="archive-results"
              className="w-full min-w-0 hard-border bg-paper py-3 ps-12 pe-4 text-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            />
          </div>
        </div>
        <div role="group" aria-label={t(ARCHIVE_COPY.filters)} className="flex flex-wrap gap-2">
          {filters.map(item => (
            <button
              type="button"
              key={item.id}
              onClick={() => setGroup(item.id)}
              aria-pressed={group === item.id}
              aria-controls="archive-results"
              className={`inline-flex items-center gap-2 hard-border px-3 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${group === item.id ? "bg-ink text-paper" : "hover:bg-paper-alt"}`}
            >
              {t(item.label)}<span className="font-mono text-xs opacity-60">{String(item.count).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <p role="status" className="font-mono text-ink-soft">{t(ARCHIVE_COPY.shown)} <bdi>{projects.length} / {DESIGN_ARCHIVE.length}</bdi></p>
          {filtered && <button type="button" onClick={reset} className="font-bold text-accent underline underline-offset-4">{t(ARCHIVE_COPY.reset)}</button>}
        </div>
      </div>

      <ul id="archive-results" className="grid md:grid-cols-2 gap-4">
        {projects.map(project => (
          <li key={project.url}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full items-center justify-between gap-5 hard-border p-5 sm:p-6 hover-shadow transition-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <div className="min-w-0">
                <h3 dir="auto" className="text-xl font-bold leading-snug break-words">{project.title}</h3>
                {project.collaborative && <p className="mt-2 text-sm text-ink-soft">{t(ARCHIVE_COPY.collaborative)}</p>}
                <p className="mt-3 text-sm text-accent font-semibold">{t(PORTFOLIO.source)}<span className="sr-only"> ({t(PORTFOLIO.opensNew)})</span></p>
              </div>
              <ArrowUpRight className="w-5 h-5 shrink-0 text-accent" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      {projects.length === 0 && <p className="hard-border p-6 text-ink-soft leading-relaxed">{t(ARCHIVE_COPY.empty)}</p>}
      <a href="https://www.behance.net/3TDream" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-accent font-bold underline underline-offset-4">
        {t(ARCHIVE_COPY.profile)}<span className="sr-only"> ({t(PORTFOLIO.opensNew)})</span><ArrowUpRight className="w-4 h-4" aria-hidden="true" />
      </a>
    </>
  );
}
