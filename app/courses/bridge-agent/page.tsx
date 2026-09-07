import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen } from "lucide-react";
import { BASE, courseMeta, modules } from "@/lib/bridge-course";

// The course is written in English and stays in English — it is engineering
// documentation, and translating it would mean three versions to keep true.
export const metadata: Metadata = {
  title: "Build a bridge agent — 3TDream",
  description:
    "Nine modules: read numbers off a desktop application nobody will give you an API for, check them, and post them to your own endpoint.",
};

export default function BridgeCoursePage() {
  const { title, tagline } = courseMeta();
  const all = modules();
  const [opening, ...rest] = all;

  return (
    <div>
      <section className="grid-paper border-b-2 border-ink">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
          <div className="label text-accent mb-3">
            / <Link href="/courses" className="hover:text-ink">Courses</Link> — Bridge agent
          </div>
          <h1 className="display text-[clamp(2.2rem,7vw,5.5rem)] uppercase max-w-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-ink-soft">{tagline}</p>
          <p className="mt-3 max-w-2xl text-sm text-muted leading-relaxed">
            Eight modules plus an opening. Seven of the eight cost nothing to run — only
            reading the screen spends, on your own key, about $0.02 a reading. Every module
            ends with a check you run, not a paragraph saying it should work.
          </p>
          <Link
            href={`${BASE}/${opening.slug}`}
            className="group mt-8 inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 font-bold hard-shadow-sm hover:bg-accent transition-colors"
          >
            Start reading
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
        <div className="label text-ink/50 mb-6 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> The modules
        </div>
        <ol className="grid gap-4 sm:grid-cols-2">
          {rest.map((m) => (
            <li key={m.slug}>
              <Link
                href={`${BASE}/${m.slug}`}
                className="group flex h-full gap-4 bg-paper hard-border hover-shadow p-5 sm:p-6 transition-all"
              >
                <span className="label text-accent shrink-0 pt-0.5">{m.n}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-lg leading-snug group-hover:text-accent transition-colors">
                    {m.title}
                  </span>
                  <span className="block mt-1 text-sm text-muted leading-relaxed">{m.sub}</span>
                </span>
                <span
                  className={`label shrink-0 self-start border px-2 py-0.5 ${
                    m.cost === "paid" ? "text-accent border-accent/40" : "text-ink/40 border-ink/20"
                  }`}
                >
                  {m.cost === "paid" ? "$" : "free"}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
