"use client";
import { Fragment, useState } from "react";
import { ChevronRight, ChevronDown, Pause, Play, RotateCcw } from "lucide-react";
import { useI18n, L } from "@/lib/i18n";
import type { CaseFlow as Flow } from "@/lib/cases";

// Stagger so the dots read as one signal travelling through the stages.
const STEP_DELAY_S = 0.6;

function Connector({ index }: { index: number }) {
  const delay = { animationDelay: `${index * STEP_DELAY_S}s` };
  return (
    <li aria-hidden className="relative flex items-center justify-center shrink-0 h-10 xl:h-auto xl:w-12">
      <span className="absolute bg-ink left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 xl:left-0 xl:right-0 xl:top-1/2 xl:bottom-auto xl:w-auto xl:h-0.5 xl:translate-x-0 xl:-translate-y-1/2" />
      <span className="flow-dot flow-dot-y xl:hidden" style={delay} />
      <span className="flow-dot flow-dot-x hidden xl:block" style={delay} />
      <ChevronDown className="absolute -bottom-1 w-4 h-4 text-ink xl:hidden" />
      <ChevronRight className="absolute -right-1 w-4 h-4 text-ink hidden xl:block rtl:rotate-180 rtl:right-auto rtl:-left-1" />
    </li>
  );
}

export function CaseFlow({ flow }: { flow: Flow }) {
  const { t } = useI18n();
  const [paused, setPaused] = useState(false);
  return (
    <figure className={`mt-8 ${paused ? "flow-paused" : ""}`}>
      <ol className="flex flex-col xl:flex-row xl:items-stretch">
        {flow.stages.map((stage, i) => (
          <Fragment key={stage.title.en}>
            {i > 0 ? <Connector index={i - 1} /> : null}
            <li className="flex-1 min-w-0 hard-border bg-paper p-4">
              <p className="label text-accent">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-2 font-extrabold leading-tight">{t(stage.title)}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft [overflow-wrap:anywhere]">{t(stage.text)}</p>
            </li>
          </Fragment>
        ))}
      </ol>
      {flow.loop ? (
        <div className="mt-4 hard-border border-dashed bg-paper-alt p-4 flex items-center gap-3">
          <RotateCcw aria-hidden className="w-4 h-4 shrink-0 text-accent" />
          <div aria-hidden className="relative h-0.5 w-10 sm:w-20 shrink-0 bg-ink">
            <span className="flow-dot flow-dot-x flow-dot-back" style={{ animationDelay: `${flow.stages.length * STEP_DELAY_S}s` }} />
          </div>
          <p className="text-sm font-semibold leading-relaxed">{t(flow.loop)}</p>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="mt-4 inline-flex items-center gap-2 text-sm font-bold underline underline-offset-4 motion-reduce:hidden"
      >
        {paused ? <Play aria-hidden className="w-4 h-4" /> : <Pause aria-hidden className="w-4 h-4" />}
        {paused ? t(L("Запустить анимацию", "Play animation", "הפעלת האנימציה")) : t(L("Остановить анимацию", "Pause animation", "עצירת האנימציה"))}
      </button>
    </figure>
  );
}
