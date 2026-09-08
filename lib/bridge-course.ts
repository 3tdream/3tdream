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
  return md.replace(
    /\[([^\]]+)\]\(([^)\s]+\.md)(#[^)]*)?\)/g,
    (whole, label: string, file: string, hash = "") => {
      const slug = byFile.get(file.replace(/^\.\//, ""));
      if (slug) return `[${label}](${BASE}/${slug}${hash})`;
      // A link to something else in the repository — `../docs/deploy.md`. That
      // path means nothing to a reader on this site, so the link is dropped and
      // the path kept as text: better a filename they can find in their own
      // checkout than a link that 404s.
      const inRepo = file.replace(/^(\.\.\/)+/, "");
      // Most such links are already labelled with the path; repeating it reads
      // like a stutter.
      return label.includes(inRepo) ? `\`${label}\`` : `${label} (\`${inRepo}\`)`;
    },
  );
}

export function renderModule(m: BridgeModule): string {
  const raw = fs.readFileSync(path.join(DIR, m.file), "utf8");
  // The page header already carries the title; a leading H1 would repeat it.
  // \r?\n matters: the files arrive through git on Windows with CRLF, and a
  // pattern anchored on \n alone left every module's title in its own body.
  const body = raw.replace(/^#\s+.*(\r?\n)+/, "");
  return marked.parse(rewriteLinks(body), { async: false, gfm: true });
}
