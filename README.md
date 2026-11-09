# 3TDream

## Build notes

### Subscribe (footer build notes)

- `POST /api/subscribe` accepts `{ email, replyLang, company_website, formRenderedAt }`
  from the footer `SubscribeForm` component, bot-gates via honeypot + timing-trap,
  and best-effort sends a signed-token confirmation email.
- `GET /api/subscribe/confirm?token=...` verifies the token and redirects to
  `/subscribe/done` or `/subscribe/invalid` — both static trilingual pages.
- Required env: `SUBSCRIBE_TOKEN_SECRET`, `SITE_URL`, `RESEND_API_KEY` (see `.env.example`). — Portfolio

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
  projects/[slug]/page.tsx  # Case detail — renders <ShareCase slug={slug} />
  api/qr/[slug]/route.ts    # GET /api/qr/[slug] — public SVG QR endpoint
components/
  share-case.tsx    # ShareCase panel — copy-link, bdi raw URL, QR img, SVG download
lib/
  i18n.tsx          # trilingual context, RTL handling, localStorage persistence
  content.ts        # ALL copy + projects + services + contacts (edit here)
  qr-code.ts        # zero-import ISO 18004 QR encoder (qrMatrix, qrSvg)
  subscribe-token.ts    # HMAC sign/verify of the stateless subscribe token
  subscribe-values.ts   # Build Notes subscription copy (isolated from i18n.tsx)
  subscribe-delivery.ts # best-effort Resend sends for subscribe/confirm
  validation/subscribe-schema.ts  # Zod schema for POST /api/subscribe
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

## Build Notes subscription (double opt-in, no database)
The footer (`components/footer.tsx`, Brand column) renders a one-field `SubscribeForm`
(email + language) backed by two public, unversioned, Node-runtime endpoints — no
subscriber table, no persistence layer anywhere:

- `POST /api/subscribe` — validates the body (`lib/validation/subscribe-schema.ts`,
  Zod), runs the same honeypot (`company_website`) + `formRenderedAt` timing-trap
  anti-bot checks as the lead form, and — on a genuine pass — signs a token
  (`lib/subscribe-token.ts`) carrying `{ email, replyLang, exp, nonce }` via
  HMAC-SHA256 (`SUBSCRIBE_TOKEN_SECRET`). The response is **always**
  `202 { ok: true, delivered: boolean }`, byte-identical whether the address is
  new, already pending, honeypot-triggered, timing-trap-triggered, or no delivery
  channel is configured — this prevents subscriber-status probing. Only a
  malformed `email`/`replyLang`/`formRenderedAt` fails schema validation and
  returns `400 { ok: false, errors }`.
- `GET /api/subscribe/confirm?token=...` — verifies the token (length-checked
  `timingSafeEqual` before any `JSON.parse`, strict `exp` check with no clock-skew
  grace) and, only on success, sends a one-line notice to the site owner. It
  **never** throws and **never** returns JSON: every outcome is a `303` redirect,
  to `/subscribe/done` (valid) or `/subscribe/invalid` (malformed, tampered, or
  expired token).

**No database, by design:** the signed token embedded in the confirmation email
link *is* the pending-subscription record — there is no subscriber list, no
resend, no revoke, and a link may be clicked more than once (each click is
independently valid until `exp`). Copy constants (email subject/body, static page
text) live in `lib/subscribe-values.ts`, deliberately isolated from `lib/i18n.tsx`'s
`Localized`/`L` chain. Required env: `SUBSCRIBE_TOKEN_SECRET` (see `.env.example`);
`RESEND_API_KEY`/`SITE_URL` are reused from the existing lead/QR configuration —
with any of these unset the form still responds `202 { ok: true, delivered: false }`
and logs `[subscribe] not configured`, never a 500.

## Share a case
Each case page (`/projects/<slug>`) shows a `ShareCase` panel (copy-link + QR + SVG download) after the "Open project" link, backed
by `GET /api/qr/[slug]` (public, unauthenticated, no database). The QR code is generated by a
**hand-rolled, zero-import ISO 18004 encoder** (`lib/qr-code.ts`, `qrMatrix`/`qrSvg`, versions
1–6 / 21–41 modules) — no new npm dependency.

**Env requirement:** `NEXT_PUBLIC_SITE_URL` must be set (see `.env.example`). The encoded/copied
URL is derived **only** from this variable — never from request headers (`Host`/`Origin`) — so a
request can't steer the QR target to another domain. If the variable is unset, the endpoint
returns `503 { ok: false, error: "not_configured" }` instead of guessing an origin, and the panel renders nothing.

**Validity gate:** `hasCase(slug)` from `lib/case-slugs.ts` is the sole check; unknown slugs get
`404 { ok: false, error: "unknown_case" }`. A URL beyond the encoder's version-6 capacity (106 bytes)
is a configuration fault and returns `500 { ok: false, error: "too_long" }`.
