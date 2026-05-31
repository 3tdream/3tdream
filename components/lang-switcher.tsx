"use client";

import { LANGS, useI18n, type Lang } from "@/lib/i18n";

const LABELS: Record<Lang, string> = { ru: "RU", en: "EN", he: "עב" };

export function LangSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex items-stretch hard-border" role="group" aria-label="Language">
      {LANGS.map((l, i) => {
        const active = l === lang;
        return (
          <button
            key={l}
            onClick={() => setLang(l)}
            aria-pressed={active}
            className={[
              "px-2.5 py-1 text-xs font-mono font-bold tracking-wider transition-colors",
              i > 0 ? "border-s-2 border-ink" : "",
              active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-paper-alt",
            ].join(" ")}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {LABELS[l]}
          </button>
        );
      })}
    </div>
  );
}
