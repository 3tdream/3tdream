# 3TDream — Portfolio

> **Time To Team Dream** — a trilingual (RU / EN / HE) brutalist-creative portfolio for taking
> digital-product orders. No login. Direct-contact channels (Telegram / WhatsApp / Email / LinkedIn).

## Stack
- Next.js 15 (App Router) · React 19 · TypeScript
- Tailwind CSS 4 (CSS-first `@theme` tokens in `app/globals.css`)
- Framer Motion · Lucide icons
- Fonts: **Rubik** (Latin + Cyrillic + Hebrew) + **Space Mono** (labels/numbers)

## Run
```bash
pnpm --filter 3tdream-portfolio dev     # http://localhost:3099
pnpm --filter 3tdream-portfolio build
```

## Structure
```
app/
  layout.tsx        # fonts, metadata, <SiteShell>
  page.tsx          # Home — hero, stats, featured work, services, CTA
  projects/page.tsx # Work — full grid + live/wip filter
  about/page.tsx    # About — principles, stats, stack
  contact/page.tsx  # Contact — direct channels
components/
  site-shell.tsx    # I18nProvider + Nav + Footer
  nav.tsx · footer.tsx · lang-switcher.tsx
  project-card.tsx · status-badge.tsx · marquee.tsx · contact-buttons.tsx
lib/
  i18n.tsx          # trilingual context, RTL handling, localStorage persistence
  content.ts        # ALL copy + projects + services + contacts (edit here)
```

## Editing content
Everything user-facing lives in **`lib/content.ts`** as `L(ru, en, he)` triples.
Add a project → append to `PROJECTS`. Change copy → edit the relevant `L(...)`.

## Bio / timeline (About page)
`PROFILE` + `TIMELINE` in `lib/content.ts` drive the About page. Timeline `period` values are
**approximate** (`~`) — confirm exact years and the current employer/title, then drop the `~`.

## Contacts
`CONTACTS` in `lib/content.ts` are the verified public profiles: Email (`3tdream@gmail.com`),
LinkedIn, GitHub (`github.com/3tdream`), Behance (`behance.net/3TDream`). To re-add Telegram /
WhatsApp, append entries with real handles and map an icon in `components/contact-buttons.tsx`.

## i18n / RTL
- Language persists in `localStorage` (`3td-lang`) and auto-detects from the browser.
- Hebrew flips the document to `dir="rtl"`; hard shadows and arrows mirror automatically.
- All three languages share one font (Rubik) so the layout never reflows on switch.
