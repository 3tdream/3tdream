/**
 * The "Build a bridge agent" course, read from the markdown that
 * scripts/sync-bridge-course.mjs copies out of the course's own repo.
 *
 * Rendering happens here, at build time, in a server module: the markdown
 * never reaches the browser and no client-side parser is shipped.
 */
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const DIR = path.join(process.cwd(), "content", "courses", "bridge-agent");
export const BASE = "/courses/bridge-agent";

export type Cost = "free" | "paid" | null;

export type BridgeModule = {
  file: string;
  slug: string;
  /** "00".."08", or an em dash for the opening page. */
  n: string;
  title: string;
  sub: string;
  cost: Cost;
};

type ModuleIndex = { title: string; tagline: string; modules: BridgeModule[] };

function index(): ModuleIndex {
  return JSON.parse(fs.readFileSync(path.join(DIR, "modules.json"), "utf8"));
}

export function courseMeta(): { title: string; tagline: string } {
  const { title, tagline } = index();
  return { title, tagline };
}

export function modules(): BridgeModule[] {
  return index().modules;
}

export function moduleBySlug(slug: string): BridgeModule | undefined {
  return modules().find((m) => m.slug === slug);
}

/** Previous and next in reading order, for the pager at the foot of a module. */
export function neighbours(slug: string): { prev?: BridgeModule; next?: BridgeModule } {
  const all = modules();
  const i = all.findIndex((m) => m.slug === slug);
  return { prev: all[i - 1], next: all[i + 1] };
}

/**
 * The modules link to each other by filename, because in the repo they are
 * files sitting next to each other. On the site they are routes, so those
 * links are rewritten — a course whose "next module" link 404s teaches the
 * reader that the whole thing is stale.
 */
function rewriteLinks(md: string): string {
  const byFile = new Map(modules().map((m) => [m.file, m.slug]));
  return md.replace(/\]\(([^)\s]+\.md)(#[^)]*)?\)/g, (whole, file: string, hash = "") => {
    const slug = byFile.get(file.replace(/^\.\//, ""));
    return slug ? `](${BASE}/${slug}${hash})` : whole;
  });
}

export function renderModule(m: BridgeModule): string {
  const raw = fs.readFileSync(path.join(DIR, m.file), "utf8");
  // The page header already carries the title; a leading H1 would repeat it.
  const body = raw.replace(/^#\s+.*\n+/, "");
  return marked.parse(rewriteLinks(body), { async: false, gfm: true });
}
