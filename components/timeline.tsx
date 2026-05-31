"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { TIMELINE } from "@/lib/content";

export function Timeline() {
  const { t } = useI18n();

  return (
    <ol className="relative">
      {/* vertical rail */}
      <span
        aria-hidden
        className="absolute top-2 bottom-2 start-[14px] sm:start-[19px] w-0.5 bg-ink/15"
      />
      {TIMELINE.map((e, i) => (
        <motion.li
          key={e.period}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative ps-12 sm:ps-16 pb-10 last:pb-0"
        >
          {/* node marker */}
          <span
            className={[
              "absolute start-0 top-0 grid place-items-center w-8 h-8 sm:w-10 sm:h-10 hard-border text-xs font-bold",
              i === TIMELINE.length - 1 ? "bg-accent text-paper" : "bg-paper text-ink",
            ].join(" ")}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>

          <div className="bg-paper hard-border p-5 sm:p-6 hover-shadow hover:-translate-y-0.5 transition-transform">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className="px-2 py-0.5 text-[11px] font-bold bg-ink text-paper"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {e.period}
              </span>
              <span className="label text-accent">{t(e.kind)}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold display">{t(e.role)}</h3>
            <p
              className="mt-0.5 text-sm font-semibold text-ink-soft"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {t(e.org)}
            </p>
            <p className="mt-2 text-sm text-muted leading-relaxed">{t(e.desc)}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
