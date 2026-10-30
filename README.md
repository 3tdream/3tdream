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

## Leads
The trilingual lead-intake form (`components/lead-form.tsx`) posts to `POST /api/lead`
(single public, unversioned, unauthenticated endpoint — no database, no persistence layer).

**Validation:** `lib/validation/lead-schema.ts` (Zod) — required `name`, `contact`, `role`,
`industry`, `companySize`, `brief`, `replyLang`, plus hidden anti-bot fields `honeypot` and
`formRenderedAt`. Malformed/missing fields return `400 { ok: false, errors }`; a schema-valid
submission always returns `202 { ok: true, delivered }` — the visitor-facing response never
hard-fails, even when no delivery channel is configured (see `lib/lead-delivery.ts`).

**Anti-bot (no CAPTCHA):** a hidden honeypot input (must stay empty) plus a client-set
`formRenderedAt` timestamp — submissions faster than the configured threshold or with the
honeypot filled are silently accepted (`202`) but never delivered, and are logged server-side
as `[lead] bot detected: ...`.

**Delivery (best-effort, fire-and-forget within the request):**
1. `LEAD_WEBHOOK_URL` — if set, the full lead payload is POSTed there.
2. Resend email — only attempted when **both** `LEAD_TO_EMAIL` and `RESEND_API_KEY` are set;
   if only one is set, Resend is skipped and logged as `[lead] resend partially configured,
   skipping` (a real misconfiguration still never breaks the form).
3. Log fallback — if no channel is configured, or a configured channel fails, the attempt/
   failure/full payload is logged with a `[lead] ...` prefix for ops grep-ability.

No env configuration is required for the form to work in dev/staging (see `.env.example` for
the optional `LEAD_WEBHOOK_URL`, `LEAD_TO_EMAIL`, `RESEND_API_KEY` variables).

**Where it lives:** `<LeadForm />` is rendered on `app/contact/page.tsx`, below the direct
contact channels. It picks role/industry/company-size options from `lib/lead-values.ts`
(with an "other" free-text fallback) and localizes all copy via `lib/i18n.tsx`'s `L(ru, en, he)`
helper, independent of the `replyLang` the visitor selects for the reply itself.
