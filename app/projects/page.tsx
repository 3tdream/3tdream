"use client";

import { useI18n, L } from "@/lib/i18n";
import { PROJECTS } from "@/lib/content";
import { ProjectCard } from "@/components/project-card";



export default function ProjectsPage() {
  const { t } = useI18n();
  const visible = PROJECTS;

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
      {/* header */}
      <header className="border-b-2 border-ink pb-8 mb-10">
        <div className="label text-accent mb-3">/ 02 — {t(L("Проекты", "Projects", "עבודות"))}</div>
        <h1 className="display text-[clamp(2.5rem,9vw,7rem)] uppercase">
          {t(L("Проекты", "Projects", "עבודות"))}
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

      {/* grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <ProjectCard key={p.slug} project={p} index={PROJECTS.indexOf(p)} showImage={false} />
        ))}
      </div>
    </div>
  );
}
