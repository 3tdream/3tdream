"use client";

import { useI18n, L } from "@/lib/i18n";
import type { ProjectStatus } from "@/lib/content";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { t } = useI18n();
  const live = status === "live";
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider hard-border",
        live ? "bg-lime text-ink" : "bg-paper text-ink",
      ].join(" ")}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <span
        className={[
          "w-1.5 h-1.5 rounded-full",
          live ? "bg-ink" : "bg-accent animate-pulse",
        ].join(" ")}
      />
      {live ? t(L("Живёт", "Live", "באוויר")) : t(L("В разработке", "In progress", "בפיתוח"))}
    </span>
  );
}
