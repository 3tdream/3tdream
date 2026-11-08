# Portfolio preview

Local review only. Nothing was committed, pushed or deployed.

## What changed
- The existing image-free Projects cards are preserved.
- Projects is organized into two detailed case studies, six additional project links, four design archive links and an invention.
- Mission Control and UXI retain their existing real images on their detail pages and the homepage.
- Internal case links and external product links have distinct labels and accessible names.
- Case routes, next-case navigation and metadata use the same case inventory.
- Case pages no longer nest a second main landmark inside the site shell.

## Content boundaries
- Existing Mission Control and UXI narratives and assets were preserved.
- Archive titles and ownership were confirmed by the site owner. No project-specific roles, dates, outcomes, screenshots or new client claims were added.
- Sinornis is linked to the owner-provided public website. The card limits personal scope to dashboard UX/UI updates within an existing product team. A full case still needs exact screen attribution and public-use permission for assets.
- The patent entry identifies the inventor's work and the 9 August 2022 grant. It does not claim current legal status, medical efficacy or certification.
- Additional product links retain existing site descriptions. Their full functionality and commercial results have not been independently revalidated by this change.

## Sources
- League of Odds: https://www.behance.net/gallery/143765943/Leauge-of-ODDS
- HOF Boulevard: https://www.behance.net/gallery/91308059/HOF-Boulevard-shop-feature
- Hot-Scores VR: https://www.behance.net/gallery/70269517/Hot-Scores-VR
- Music Trivia Master: https://www.behance.net/gallery/86819623/Music-Trivia-Master-App
- Patent: https://patents.google.com/patent/US11406202B2/en

The Behance links are source pointers, not a claim that their full detail pages were reviewed or are always accessible. Keep archive entries short until original materials and credits are reviewed.

## Checks
Run from the project directory:
- node scripts/check-portfolio.cjs
- node node_modules/typescript/bin/tsc --noEmit --incremental false
- npm run lint
- npm run build

No contact form, checkout, payment or external message was submitted during testing.

## Verification results (7 November 2026 task)
- Portfolio checks: passed for 7 current products, 2 case routes, 4 archive links, the patent, all three languages, local image paths and image-free catalog cards.
- TypeScript: passed with no output using --noEmit --incremental false.
- Lint: passed, with the pre-existing custom-font warning in app/layout.tsx and Next.js lint-command deprecation notice.
- Production build: passed after the final mobile-header fix; 21 static pages generated.
- HTTP smoke checks: /projects, /projects/mission-control and /projects/uxi-course returned 200; /projects/not-a-case returned 404.
- Browser: case navigation, next-case link, Back/Forward, return to catalog, section anchor, RU/EN/HE switching, Hebrew RTL and repeated mobile menu open/close passed.
- Responsive checks: no horizontal overflow at 320, 390, 768 and the default 1910-pixel viewport. A narrow-header overflow found at 320 pixels was fixed and rechecked after rebuilding.
- Existing case images loaded successfully. Catalog has zero images. Case pages have one main landmark. No browser console errors were observed.
- The viewport was restored to its original size. The local preview tab is left on the Russian portfolio index.

## Local preview
The production preview listens only on this computer at http://127.0.0.1:3101/projects.
To restart later from the project directory: node node_modules/next/dist/bin/next start -p 3101 -H 127.0.0.1
The server runs in the background for review. It is not a public deployment.

## Preserved work
The checkout remains on main at de1cc8dda84377b7581d04a1b602194a151413f7. No commit, push or deployment was made. The pre-existing untracked skills-lock.json was not changed. Original edited files were backed up outside the repository before changes.

## Requested update: Projects and Sinornis
- Renamed the page heading to Projects, with matching Russian and Hebrew translations and existing navigation. The /projects route stays unchanged.
- Updated page metadata and the section-navigation accessible label.
- Added Sinornis as an image-free external project card, linking to https://www.sinornis.com/. The public homepage supports the AI/IoT poultry-farming context.
- The personal contribution is limited to previously documented dashboard UX/UI updates within a team. No project year, live-product status, sole authorship, measured result or client screenshot is asserted.

### Follow-up verification (8 November 2026)
- Portfolio checks pass: 8 products, 2 case routes, 4 archive links, patent and RU/EN/HE copy. Sinornis has the supplied URL, no unverified year or status, and localized contribution copy.
- TypeScript, lint and production build pass. Only the existing custom-font warning and Next.js lint-command deprecation remain.
- Local /projects responds 200 with Projects metadata and the Sinornis link.
- RU/EN/HE browser checks pass, including Hebrew RTL, zero catalog images, section anchor, Sinornis URL and safe new-tab attributes. No horizontal overflow at mobile widths 320 and 390 pixels. English and Hebrew Sinornis cards were visually inspected.
- Viewport restored. The browser is left on the English Projects index. No publish, push or commit was made.

## Requested update: expand projects
- Expanded the design archive from 4 to 34 verified Behance projects. Added search, subject filters, result counts and reset in all three languages.
- Kept original titles, with explicit collaborative credit for VShapeJewelry. No invented scope, dates, results or client relationships. Individual project details remain unverified because Behance returned HTTP 403.
- Source inventory: docs/design-archive-sources.md. Existing sections, image-free cards and case pages remain unchanged.

- Responsive review found the existing Russian desktop header overflowed at 768 pixels. Moved full navigation from the medium to large breakpoint, retaining compact menu controls on tablets.

### Expanded archive verification
- Content and filter tests pass for all 34 archive records, original URLs, unique IDs, subject groups, shared-authorship credit, search, combined filters and no-result behavior.
- TypeScript, lint and final production build pass; 21 static pages. Existing custom-font warning remains.
- Browser checks pass for all five subject filters, title search, empty state, repeated filter clicks, reset, language switching with active search, collaborative credit and safe external link attributes.
- Responsive checks pass at 320, 390, 768, 1024 and default 1910 pixels, including Hebrew RTL. Compact tablet menu opens and closes correctly. Zero catalog images and no browser console errors observed.
- Final HTTP checks: Projects and both existing cases return 200; unknown case returns 404.
- Preview remains local-only at http://127.0.0.1:3101/projects#design-archive, left in Russian with default viewport and all 34 archive entries. No commit, push, publication or deployment.

## Mission Control narrative update
- Applied the author-supplied case account (provided 8 November, compiled 6 November 2026) in RU/EN/HE. Reframed contribution as Product Designer: concept, workflow and interface.
- Covered six defect-driven gates, the invisible-form incident, autonomous stage acceptance/rework, human-initiated paid runs, cost limits, S0-S12 control and Academy evaluation.
- Added a qualified measurement block: 427 runs; failed agent steps 13.3% to 0.2%; reused repeat cost/time -62%/-57%; separate sixth-build series -47%/-63%. These are not combined, called debugging cost, or presented as independently audited/user outcomes.
- Caveats explain changing conditions, measurement rules and absent detailed comparison controls. The sixth-build card retains the invisible-form failure. All existing screens and other projects are preserved.

### Mission Control final verification
- Content/metric regression checks, standalone TypeScript and final production build pass. The build also passes lint/type validation, with only the existing custom-font warning.
- Compared against the pre-edit backup: all three MC figures/captions, the complete UXI case and every other project entry are unchanged. Archive remains at 34 entries.
- RU/EN/HE copy, explicit LTR metric values in Hebrew RTL, mobile widths 320/390, tablet 768 and default 1910 were reviewed without horizontal overflow. All three MC images loaded.
- Found and fixed an anchored history issue by making case-section links Next-managed. Verified MC -> measurement section -> UXI -> browser Back restores MC content, title and all four measurement cards. Normal next-case navigation also passes.
- Final route checks return 200 for Projects, MC and UXI. No browser console errors observed.
- Preview: http://127.0.0.1:3101/projects/mission-control, left in Russian with default viewport. No publication, push or commit.
