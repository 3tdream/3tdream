/**
 * The bridge-agent course is written and verified in its own repo
 * (3tdream/bridge-agent-mc, working copy at apps/bridge-agent-mc). That repo
 * is the source of truth: its `course/check-references.mjs` fails if a module
 * names a file that does not exist, which is a check this site cannot run.
 *
 * So the site does not re-author the modules — it copies them, and this script
 * is the only way they get in. Run it after changing the course upstream:
 *
 *   node scripts/sync-bridge-course.mjs            # report drift, change nothing
 *   node scripts/sync-bridge-course.mjs --write    # copy
 *
 * Without --write it exits non-zero when the site is behind, so "is the
 * published course the one we wrote?" has an answer that is not a memory.
 */
import fs from "node:fs";
import path from "node:path";

const WRITE = process.argv.includes("--write");
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const SITE = path.join(HERE, "..", "content", "courses", "bridge-agent");

const SOURCES = [
  process.env.BRIDGE_AGENT_REPO && path.join(process.env.BRIDGE_AGENT_REPO, "course"),
  path.join(HERE, "..", "..", "ai-projects", "apps", "bridge-agent-mc", "course"),
].filter(Boolean);

const source = SOURCES.find((p) => fs.existsSync(p));
if (!source) {
  console.error("bridge-agent-mc/course not found. Clone it, or set BRIDGE_AGENT_REPO.");
  console.error(`  looked in:\n${SOURCES.map((p) => `    ${p}`).join("\n")}`);
  process.exit(2);
}

fs.mkdirSync(SITE, { recursive: true });
const wanted = fs.readdirSync(source).filter((f) => f.endsWith(".md") || f === "modules.json").sort();
if (!wanted.includes("modules.json")) {
  console.error(`${source} has no modules.json — the site reads the order and titles from it`);
  process.exit(2);
}

let behind = 0;
for (const name of wanted) {
  const from = path.join(source, name);
  const to = path.join(SITE, name);
  const next = fs.readFileSync(from, "utf8");
  const now = fs.existsSync(to) ? fs.readFileSync(to, "utf8") : null;
  if (now === next) continue;
  behind++;
  console.log(`  ${now === null ? "new" : "changed"}: ${name}`);
  if (WRITE) fs.writeFileSync(to, next);
}

const extra = fs.readdirSync(SITE).filter((f) => !wanted.includes(f));
for (const name of extra) {
  behind++;
  console.log(`  removed upstream: ${name}`);
  if (WRITE) fs.unlinkSync(path.join(SITE, name));
}

console.log(`\n${wanted.length} module(s) from ${source}`);
if (!behind) console.log("site is up to date with the course repo");
else if (WRITE) console.log(`synced ${behind} file(s)`);
else { console.log(`site is BEHIND by ${behind} file(s) — re-run with --write`); process.exit(1); }
