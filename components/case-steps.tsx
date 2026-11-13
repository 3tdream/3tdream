"use client";
import { useState } from "react";
import { useI18n, L } from "@/lib/i18n";
import type { CaseCommand, CaseStep } from "@/lib/cases";

function CommandBlock({ command }: { command: CaseCommand }) {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command.code);
      setStatus("success");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 2000);
  };
  return (
    <div className="mt-3 hard-border bg-paper-alt">
      {command.label ? <p className="label text-muted px-4 pt-3">{command.label}</p> : null}
      <div className="flex items-start gap-3 p-4">
        <pre dir="ltr" className="flex-1 min-w-0 overflow-x-auto text-sm font-mono text-ink"><code>{command.code}</code></pre>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 bg-ink text-paper px-3 py-2 font-bold text-xs hard-border active:scale-95"
          aria-label={t(L("Скопировать команду", "Copy command", "העתקת הפקודה"))}
        >
          {status === "success"
            ? t(L("Скопировано", "Copied", "הועתק"))
            : status === "error"
            ? t(L("Ошибка", "Failed", "שגיאה"))
            : t(L("Копировать", "Copy", "העתק"))}
        </button>
      </div>
    </div>
  );
}

export function CaseSteps({ steps }: { steps: CaseStep[] }) {
  const { t } = useI18n();
  return (
    <ol className="mt-8 space-y-8 max-w-[70ch]">
      {steps.map((step, i) => (
        <li key={step.text.en} className="flex gap-4">
          <span className="label text-accent shrink-0 w-8 pt-1">{String(i + 1).padStart(2, "0")}</span>
          <div className="flex-1 min-w-0">
            <p className="text-base sm:text-lg leading-relaxed text-ink-soft">{t(step.text)}</p>
            {step.commands?.map((command) => <CommandBlock key={command.code} command={command} />)}
          </div>
        </li>
      ))}
    </ol>
  );
}
