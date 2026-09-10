import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Check } from "lucide-react";
import { BASE, courseMeta, modules } from "@/lib/bridge-course";
import { priceLabel } from "@/lib/course-product";
import { BuyCourseButton } from "@/components/buy-course-button";

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
  const price = priceLabel();

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
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`${BASE}/${opening.slug}`}
              className="group inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 font-bold hard-shadow-sm hover:bg-accent transition-colors"
            >
              Start reading — free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#get-the-code"
              className="inline-flex items-center gap-2 bg-paper text-ink px-6 py-3.5 font-bold hard-border hover-shadow transition-all"
            >
              Get the code — {price}
            </a>
          </div>
        </div>
      </section>

      {/* Pricing. The amount lives in lib/course-product.ts — the server reads it
          when it builds the Checkout session, and this page reads the same value. */}
      <section id="get-the-code" className="border-b-2 border-ink bg-paper-alt">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
          <div className="label text-ink/50 mb-6">What you get</div>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* free side */}
            <div className="bg-paper hard-border p-7 sm:p-9 flex flex-col">
              <div className="label text-ink/40">The course</div>
              <p className="display text-4xl sm:text-5xl mt-2">FREE</p>
              <p className="mt-4 text-sm text-ink-soft leading-relaxed">
                All nine modules, in full, for anyone. No account, no email, no drip.
                It is the whole method: what breaks, why, and the check that proves
                each part works.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {[
                  "Nine modules, start to finish",
                  "Every failure mode, named and explained",
                  "The check that ends each module",
                  "Readable now, no sign-up",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-ink/40" />
                    <span className="text-ink-soft">{t}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`${BASE}/${opening.slug}`}
                className="mt-8 inline-flex items-center justify-center gap-2 bg-paper text-ink px-6 py-3.5 font-bold hard-border hover-shadow transition-all"
              >
                Start reading
              </Link>
            </div>

            {/* paid side */}
            <div className="bg-paper hard-border hard-shadow p-7 sm:p-9 flex flex-col relative">
              <span className="absolute -top-3 left-7 bg-lime text-ink label px-3 py-1 border-2 border-ink">
                the working thing
              </span>
              <div className="label text-ink/40">The repository</div>
              <p className="display text-4xl sm:text-5xl mt-2">
                {price} <span className="text-lg align-middle text-muted font-normal">once</span>
              </p>
              <p className="mt-4 text-sm text-ink-soft leading-relaxed">
                The course tells you to open <code className="text-[13px]">agent/src/capture.ps1</code> and
                nineteen other files. This is those files — the system the course was
                written from, running in production today.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {[
                  "The agent kit: install, run, check, diagnose, uninstall",
                  "The receiver: enroll, ingest, read, gate, deliver, watchdog",
                  "The sandbox that writes down its own answers",
                  "19 tests, and the scorer that makes module 5 mean something",
                  "Source and target specs — a second application is JSON, not code",
                  "Commit history and every later fix",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                    <span className="text-ink-soft">{t}</span>
                  </li>
                ))}
              </ul>
              <BuyCourseButton label={`Buy access — ${price}`} />
              <p className="mt-3 text-xs text-muted" style={{ fontFamily: "var(--font-mono)" }}>
                One payment. Private GitHub access, yours to keep. No subscription.
              </p>
            </div>
          </div>
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
                {/* Runtime cost, NOT price: this says whether the module needs a
                    model key to run. Beside a price tag "free/$" would read as
                    paid content, which is a different thing entirely. */}
                <span
                  className={`label shrink-0 self-start border px-2 py-0.5 whitespace-nowrap ${
                    m.cost === "paid" ? "text-accent border-accent/40" : "text-ink/40 border-ink/20"
                  }`}
                >
                  {m.cost === "paid" ? "needs a key" : "no key"}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
