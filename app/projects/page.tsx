"use client";

import { useState } from "react";
import { useI18n, L } from "@/lib/i18n";
import { PROJECTS, type ProjectStatus } from "@/lib/content";
import { ProjectCard } from "@/components/project-card";

type Filter = "all" | ProjectStatus;

export default function ProjectsPage() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");

  const filters: { id: Filter; label: ReturnType<typeof L> }[] = [
    { id: "all", label: L("Все", "All", "הכל") },
    { id: "live", label: L("Живут", "Live", "באוויר") },
    { id: "wip", label: L("В разработке", "In progress", "בפיתוח") },
  ];

  const visible = PROJECTS.filter((p) => filter === "all" || p.status === filter);

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
      {/* header */}
      <header className="border-b-2 border-ink pb-8 mb-10">
        <div className="label text-accent mb-3">/ 02 — {t(L("Проекты", "Work", "עבודות"))}</div>
        <h1 className="display text-[clamp(2.5rem,9vw,7rem)] uppercase">
          {t(L("Проекты", "Selected work", "עבודות"))}
        </h1>
        <p className="mt-4 max-w-2xl text-base sm:text-lg text-ink-soft">
          {t(
            L(
              "Продукты, которые я спроектировал и собрал — от живых сервисов до того, что сейчас в разработке.",
              "Products I designed and shipped — from live services to what's in the workshop right now.",
              "מוצרים שתכננתי ובניתי — משירותים חיים ועד מה שבפיתוח כרגע."
            )
          )}
        </p>
      </header>

      {/* filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {filters.map((f) => {
          const active = f.id === filter;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={active}
              className={[
                "px-4 py-2 text-sm font-bold hard-border transition-colors",
                active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-paper-alt",
              ].join(" ")}
            >
              {t(f.label)}
            </button>
          );
        })}
      </div>

      {/* grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <ProjectCard key={p.slug} project={p} index={PROJECTS.indexOf(p)} />
        ))}
      </div>
    </div>
  );
}
