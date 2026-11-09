"use client";

import Link from "next/link";
import { SUBSCRIBE_DONE_COPY } from "@/lib/subscribe-values";

// Pure Server Component — static trilingual copy, no hooks, no searchParams
// branching (US-07: this is a fixed redirect target, not a dynamic page).
export default function SubscribeDonePage() {
  const entries = Object.entries(SUBSCRIBE_DONE_COPY) as Array<
    [string, { title: string; body: string }]
  >;

  return (
    <main data-testid="subscribe-done" className="mx-auto flex min-h-[70dvh] max-w-2xl flex-col items-start justify-center gap-10 px-6 py-24 sm:px-8">
      {entries.map(([langKey, copy]) => (
        <div
          key={langKey}
          lang={langKey}
          dir={langKey === "he" ? "rtl" : "ltr"}
          className="w-full"
        >
          <h1 className="display text-3xl font-extrabold sm:text-4xl">{copy.title}</h1>
          <p className="mt-3 max-w-[60ch] text-base text-paper/70">{copy.body}</p>
        </div>
      ))}

      <Link
        href="/"
        className="hard-border bg-lime px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink hover-shadow transition-shadow"
      >
        3TDream →
      </Link>
    </main>
  );
}
