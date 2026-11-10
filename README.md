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
  projects/[slug]/page.tsx  # Case detail — renders <ShareCase slug={slug} />
  api/qr/[slug]/route.ts    # GET /api/qr/[slug] — public SVG QR endpoint
components/
  share-case.tsx    # ShareCase panel — copy-link, bdi raw URL, QR img, SVG download
lib/
  i18n.tsx          # trilingual context, RTL handling, localStorage persistence
  content.ts        # ALL copy + projects + services + contacts (edit here)
  qr-code.ts        # zero-import ISO 18004 QR encoder (qrMatrix, qrSvg)
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

## Build notes
A footer form (`components/subscribe-form.tsx`) runs a **stateless double opt-in**. There is
no database, no subscriber list and no new dependency — only `node:crypto` and `fetch`.

- `POST /api/subscribe` validates `{email, company_website?, formRenderedAt, lang}`, filters
  bots (honeypot + 3000 ms timing rule), then e-mails a confirm link through Resend.
  Responses: `400 {ok:false, error:"invalid_json"}` / `{ok:false, error:"invalid_field", field}`,
  otherwise always `202 {ok:true, delivered:boolean}` (same shape for new and repeat
  addresses, bots, missing config and Resend failures).
- `GET /api/subscribe/confirm?token=…` verifies the token, sends one notice to the owner
  (`LEAD_TO_EMAIL`) and answers `303` to `/subscribe/done`; any bad, expired, empty or
  repeated token goes to `/subscribe/invalid`. It never returns JSON or a 5xx.
- Token = `base64url(JSON{email, lang, exp}).hexHMAC-SHA256`, `exp` = issue + 24 h. The MAC is
  checked (length, then `timingSafeEqual`) before anything is decoded.

**Environment** (all read at request time — a missing value never breaks a build or preview):

| Variable | Purpose | If missing |
|---|---|---|
| `SUBSCRIBE_TOKEN_SECRET` | HMAC secret, ≥ 32 chars | POST → `202 delivered:false`; confirm → `/subscribe/invalid` |
| `SITE_URL` | absolute origin of the confirm link (https; `http://localhost` for dev) | POST → `202 delivered:false` |
| `RESEND_API_KEY` | existing, shared with `/api/lead` | POST → `delivered:false`; owner notice skipped |
| `LEAD_TO_EMAIL` | existing, owner notice recipient | owner notice skipped |

The code reads only `SITE_URL`; set `NEXT_PUBLIC_SITE_URL` to the same value so they never drift.

**Known limits of the stateless design (accepted):**
- **Replay:** a valid token can be opened repeatedly for 24 h and every open sends an owner
  e-mail (no dedupe without storage). Mail scanners that pre-fetch links can trigger this too.
- **No rate limiting or CAPTCHA:** a third party's address can be e-mail-bombed through the
  form, which also spends the shared Resend quota/reputation. Defence is the honeypot and
  timing rule only.
- **No list, no revocation, no unsubscribe:** the owner receives confirmed addresses by e-mail.
- **The token is signed, not encrypted:** the address is readable by whoever holds the link.
  Tokens and addresses are never logged; the only log lines are `[subscribe] not configured`,
  `[subscribe] delivery failed: <status>` and `[subscribe] owner notice failed: <status>`.
- **The UI says "check your inbox" even when `delivered:false`** (unconfigured or Resend
  failed) — the cause is only visible in the server log.

**QA:** `npm run build` may not enforce types or lint, so also run `npm run lint` and
`npm run typecheck`.

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
