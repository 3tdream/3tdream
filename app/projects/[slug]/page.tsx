import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/project-detail";
import { CASE_SLUGS, hasCase } from "@/lib/case-slugs";
import { CASES } from "@/lib/cases";
import { PROJECTS } from "@/lib/content";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CASE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((item) => item.slug === slug);
  if (!project || !hasCase(slug)) return { title: "Project not found | 3TDream" };
  return {
    title: `${project.title} | Michael Shigrin Sokol`,
    description: CASES[slug].intro.en,
    openGraph: { title: `${project.title} | Michael Shigrin Sokol`, description: CASES[slug].intro.en, type: "article" },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  if (!hasCase(slug)) notFound();
  return <ProjectDetail slug={slug} />;
}
