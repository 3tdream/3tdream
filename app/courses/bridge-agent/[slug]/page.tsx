import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BASE, moduleBySlug, modules, neighbours, renderModule } from "@/lib/bridge-course";

export function generateStaticParams() {
  return modules().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const m = moduleBySlug((await params).slug);
  if (!m) return {};
  return { title: `${m.title} — Build a bridge agent`, description: m.sub };
}

export default async function BridgeModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = moduleBySlug(slug);
  if (!m) notFound();

  const html = renderModule(m);
  const { prev, next } = neighbours(slug);

  return (
    <div>
      <section className="grid-paper border-b-2 border-ink">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
          <div className="label text-accent mb-3">
            / <Link href="/courses" className="hover:text-ink">Courses</Link> —{" "}
            <Link href={BASE} className="hover:text-ink">Bridge agent</Link> — {m.n}
          </div>
          <h1 className="display text-[clamp(1.9rem,5.5vw,4rem)] uppercase max-w-4xl">{m.title}</h1>
          <p className="mt-3 text-base text-ink-soft">{m.sub}</p>
        </div>
      </section>

      <article className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        {/* The markdown comes from files in this repository, synced from the
            course repo by scripts/sync-bridge-course.mjs — never from a request. */}
        <div className="course-md" dangerouslySetInnerHTML={{ __html: html }} />

        <nav className="mt-16 pt-8 border-t-2 border-ink flex flex-wrap justify-between gap-4">
          {prev ? (
            <Link
              href={`${BASE}/${prev.slug}`}
              className="group inline-flex items-center gap-2 bg-paper text-ink px-5 py-3 font-bold hard-border hover-shadow transition-all"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="min-w-0 truncate">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`${BASE}/${next.slug}`}
              className="group inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 font-bold hard-shadow-sm hover:bg-accent transition-colors"
            >
              <span className="min-w-0 truncate">{next.title}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
