"use client";

import Link from "next/link";
import { SUBSCRIBE_INVALID_COPY } from "@/lib/subscribe-values";

// Static trilingual page — pure Server Component, no hooks, no searchParams
// branching (ADR A4 / US-07). All three languages render unconditionally.
const BACK_LABEL = { ru: "На главную", en: "Back to home", he: "חזרה לעמוד הבית" } as const;

export default function SubscribeInvalidPage() {
  return (
    <main data-testid="subscribe-invalid" className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-10 py-20">
      <div className="max-w-xl w-full hard-border bg-paper-alt p-8 sm:p-12 text-center space-y-8">
        {(Object.keys(SUBSCRIBE_INVALID_COPY) as Array<keyof typeof SUBSCRIBE_INVALID_COPY>).map(
          (lang) => {
            const copy = SUBSCRIBE_INVALID_COPY[lang];
            return (
              <div key={lang} dir={lang === "he" ? "rtl" : "ltr"}>
                <h1 className="display text-2xl sm:text-3xl font-extrabold mb-2">
                  {copy.title}
                </h1>
                <p className="text-base text-muted">{copy.body}</p>
              </div>
            );
          }
        )}

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          {(Object.keys(BACK_LABEL) as Array<keyof typeof BACK_LABEL>).map((lang) => (
            <Link
              key={lang}
              href="/"
              dir={lang === "he" ? "rtl" : "ltr"}
              className="hard-border bg-lime px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-ink hover-shadow transition-colors"
            >
              {BACK_LABEL[lang]}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
