const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, filename);
};
const { CASES } = require("../lib/cases.ts");
const { CASE_SLUGS, hasCase } = require("../lib/case-slugs.ts");
const { PROJECTS } = require("../lib/content.ts");
const { DESIGN_ARCHIVE, INVENTION, PORTFOLIO } = require("../lib/portfolio.ts");
const root = path.resolve(__dirname, "..");
assert.equal(new Set(PROJECTS.map(p => p.slug)).size, PROJECTS.length, "Unique project routes");
assert.deepEqual(CASE_SLUGS, Object.keys(CASES), "Case routes use the same source");
for (const invalid of ["missing-project", "__proto__", "constructor", "toString"]) assert.equal(hasCase(invalid), false);
for (const [slug, study] of Object.entries(CASES)) {
  assert(PROJECTS.some(p => p.slug === slug), `Case ${slug} must have a project`);
  for (const item of [study.intro, study.role, study.deliverable, study.result, study.evidenceNote, ...study.sections.flatMap(s => [s.title, s.body]), ...study.figures.map(f => f.caption)]) {
    for (const lang of ["ru", "en", "he"]) assert(item[lang]?.trim(), `Missing ${lang} copy for ${slug}`);
  }
  for (const figure of study.figures) {
    assert(figure.src.startsWith("/projects/"), "Use local reviewed project assets");
    assert(fs.existsSync(path.join(root, "public", figure.src)), `Missing ${figure.src}`);
    assert(figure.width > 0 && figure.height > 0);
  }
}
for (const item of [...Object.values(PORTFOLIO), INVENTION.text]) {
  for (const lang of ["ru", "en", "he"]) assert(item[lang]?.trim(), `Missing ${lang} portfolio copy`);
}
assert.equal(new Set(DESIGN_ARCHIVE.map(p => p.url)).size, DESIGN_ARCHIVE.length);
for (const item of DESIGN_ARCHIVE) {
  assert.equal(new URL(item.url).host, "www.behance.net");
  assert(item.title.trim());
}
assert.equal(new URL(INVENTION.url).host, "patents.google.com");
const catalog = fs.readFileSync(path.join(root, "components/portfolio-index.tsx"), "utf8");
assert.equal((catalog.match(/showImage={false}/g) || []).length, 2, "Projects cards must remain image-free");
assert(!catalog.includes("<Image"), "No thumbnails in the Projects catalog");
for (const id of ["case-studies", "products", "design-archive", "invention"]) {
  assert(catalog.includes(`id="${id}"`), `Jump target ${id} exists`);
}
const detail = fs.readFileSync(path.join(root, "components/project-detail.tsx"), "utf8");
assert(!detail.includes("<main"), "The SiteShell owns the main landmark");
assert(detail.includes("nextProject.title"), "Next case is derived from real data");
console.log(`PASS: ${PROJECTS.length} products, ${CASE_SLUGS.length} case routes, ${DESIGN_ARCHIVE.length} archive links, patent, RU/EN/HE copy, local assets and image-free catalog.`);

const sinornis = PROJECTS.find(p => p.slug === "sinornis");
assert(sinornis, "Sinornis project is present");
assert.equal(sinornis.url, "https://www.sinornis.com/");
assert.equal(sinornis.year, undefined, "Do not invent a project year");
assert.equal(sinornis.statuses.length, 0, "Do not infer product release status");
for (const item of [sinornis.tagline, sinornis.description, sinornis.role, sinornis.linkLabel]) {
  for (const lang of ["ru", "en", "he"]) assert(item[lang]?.trim(), "Sinornis copy is localized");
}
assert.deepEqual(PORTFOLIO.title, {ru:"Проекты", en:"Projects", he:"פרויקטים"});
console.log("PASS: Projects title and Sinornis URL, contribution boundaries and translations.");

const { ARCHIVE_GROUPS, ARCHIVE_COPY, filterArchive } = require("../lib/design-archive.ts");
assert.equal(DESIGN_ARCHIVE.length, 34, "Complete verified public Work inventory");
assert.equal(new Set(DESIGN_ARCHIVE.map(p => new URL(p.url).pathname.split("/")[2])).size, 34, "No duplicate Behance project IDs");
const groups = ARCHIVE_GROUPS.map(g => g.id);
for (const p of DESIGN_ARCHIVE) {
  assert(groups.includes(p.group), `Known subject for ${p.title}`);
  assert.match(p.url, /^https:\/\/www\.behance\.net\/gallery\/\d+\/[\w-]+$/);
  assert.deepEqual(Object.keys(p).sort(), (p.collaborative ? ["title", "url", "group", "collaborative"] : ["title", "url", "group"]).sort(), "No unsupported project claims");
}
assert.equal(DESIGN_ARCHIVE.find(p => p.title === "VShapeJewelry").collaborative, true);
assert.equal(DESIGN_ARCHIVE.filter(p => p.collaborative).length, 1);
for (const item of [...Object.values(ARCHIVE_COPY), ...ARCHIVE_GROUPS.map(g => g.label)]) {
  for (const lang of ["ru", "en", "he"]) assert(item[lang]?.trim(), `Archive controls translated into ${lang}`);
}
assert.deepEqual(filterArchive("  ENERGY CENTER ").map(p => p.title), ["Energy Center Desktop App"]);
assert.deepEqual(filterArchive("pinka", "games").map(p => p.title), ["pinka games"]);
assert.equal(filterArchive("pinka", "product").length, 0);
assert.equal(filterArchive("unmatched-query-981").length, 0);
assert.equal(filterArchive("   ").length, 34);
assert.equal(ARCHIVE_GROUPS.reduce((sum, g) => sum + filterArchive("", g.id).length, 0), 34);
const archiveComponent = fs.readFileSync(path.join(root, "components/design-archive.tsx"), "utf8");
assert(!/<(?:Image|img)\b/.test(archiveComponent), "Expanded archive remains image-free");
assert(archiveComponent.includes('aria-pressed={group === item.id}'));
assert(archiveComponent.includes('role="status"'));
assert(archiveComponent.includes('target="_blank"'));
assert(archiveComponent.includes('rel="noopener noreferrer"'));
console.log("PASS: 34 verified archive projects, exact links, collaborative credit, localized filters, search and empty states.");

const nav = fs.readFileSync(path.join(root, "components/nav.tsx"), "utf8");
assert(nav.includes("hidden lg:flex"), "Full navigation starts at desktop width");
assert(!/md:(flex|block|hidden)/.test(nav), "Tablet retains compact navigation");
console.log("PASS: Compact navigation retained through tablet widths.");

const mc = CASES["mission-control"];
assert.equal(mc.measurements.items.length, 4, "Separate reliability and comparison measurements");
assert.deepEqual(mc.measurements.items.map(i => i.value), ["427", "13.3% → 0.2%", "−62% / −57%", "−47% / −63%"]);
for (const value of [mc.measurements.title, mc.measurements.intro, mc.measurements.period, mc.measurements.note, ...mc.measurements.items.flatMap(i => [i.label,i.note])]) {
  for (const lang of ["ru","en","he"]) assert(value[lang]?.trim(), "Measurement framing is fully localized");
}
const mcText=mc.sections.map(s=>s.body.en).join(" ");
assert(mc.role.en.includes("Product Designer"));
assert(mcText.includes("Six gates"));
assert(mcText.includes("sixth build"));
assert(mcText.includes("invisible"));
assert(mcText.includes("autonomously"));
assert(mcText.includes("A person initiates every paid run"));
assert(mcText.includes("96%") && mcText.includes("30-day"));
assert(mc.measurements.intro.en.includes("without independent verification"));
assert(mc.measurements.items[2].note.en.includes("not the cost of a debugging cycle"));
assert(mc.measurements.items[3].note.en.includes("invisible form"));
assert(mc.measurements.note.en.includes("different comparisons"));
assert(mc.measurements.note.en.includes("not controlled benchmarks"));
assert.equal(mc.figures.length,3,"Existing Mission Control screens remain");
assert(detail.includes('id="measurements"') && detail.includes('href="#measurements"'));
console.log("PASS: Author-reported MC case, separate metric series, caveats, localized copy and preserved screens.");

assert(!detail.slice(detail.indexOf("<nav"),detail.indexOf("</nav>")).includes("<a "), "Case anchors use router-managed links so Back restores the correct case");

// AI-generated artifacts must stay disclosed on the card, not only in prose.
const card = fs.readFileSync(path.join(root, "components/project-card.tsx"), "utf8");
assert(card.includes("project.aiGenerated"), "Cards render the AI-generated disclosure");
assert(card.includes("PORTFOLIO.aiGenerated"), "The disclosure uses localized copy");
const storefront = PROJECTS.find(p => p.slug === "storefront-runtime");
assert(storefront, "Danan Store is present");
assert.equal(storefront.aiGenerated, true, "Danan Store is marked AI-generated");
assert.equal(new URL(storefront.url).host, "storefront-runtime.vercel.app");
assert(storefront.tags.includes("AI-generated"), "The AI-generated tag stays on the card");
for (const lang of ["ru", "en", "he"]) {
  assert(PORTFOLIO.aiGenerated[lang]?.trim(), `Missing ${lang} AI disclosure`);
  assert(storefront.role[lang].includes("Agent Academy"), `Role names the generator in ${lang}`);
  for (const value of [storefront.tagline[lang], storefront.description[lang]]) assert(value?.trim(), `Missing ${lang} Danan Store copy`);
}
assert(storefront.description.en.includes("not hand-built work"), "Copy says the output is generated, not hand-built");
for (const p of PROJECTS) assert(p.aiGenerated === undefined || p.slug === "storefront-runtime", "Only disclosed projects carry the AI flag");
console.log(`PASS: AI-generated disclosure for Danan Store, localized badge and card rendering.`);
