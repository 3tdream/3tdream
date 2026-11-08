import type { Metadata } from "next";
import { PortfolioIndex } from "@/components/portfolio-index";

export const metadata: Metadata = {
  title: "Projects | Michael Shigrin Sokol",
  description: "Product design, AI-assisted development, teaching, selected design work and invention by Michael Shigrin Sokol.",
};

export default function ProjectsPage() {
  return <PortfolioIndex />;
}
