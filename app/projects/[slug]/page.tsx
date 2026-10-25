import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/project-detail";
import { CASE_SLUGS, hasCase } from "@/lib/case-slugs";
export function generateStaticParams() { return CASE_SLUGS.map(slug => ({ slug })); }
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!hasCase(slug)) notFound();
  return <ProjectDetail slug={slug} />;
}
