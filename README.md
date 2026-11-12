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
npm install
npm run dev        # http://localhost:3099
npm run build
npm run typecheck
```

## Structure
```
app/
  layout.tsx        # fonts, metadata, <SiteShell>
  page.tsx          # Home — hero, stats, featured work, services, CTA
  projects/page.tsx # Work — full grid + live/wip filter
  about/page.tsx    # About — principles, stats, stack
  contact/page.tsx  # Contact — direct channels
  subscribe/done/page.tsx     # confirmed outcome (303 target of a valid token)
  subscribe/invalid/page.tsx  # invalid/expired outcome (303 target of every other case)
  api/subscribe/route.ts          # POST — footer sign-up, sends the confirmation e-mail
  api/subscribe/confirm/route.ts  # GET/HEAD — token check, owner notice, always 303
  projects/[slug]/page.tsx  # Case detail — renders <ShareCase slug={slug} />
  api/qr/[slug]/route.ts    # GET /api/qr/[slug] — public SVG QR endpoint
components/
  site-shell.tsx    # I18nProvider + Nav + Footer
  nav.tsx · footer.tsx · lang-switcher.tsx
  project-card.tsx · status-badge.tsx · marquee.tsx · contact-buttons.tsx
  subscribe-form.tsx  # footer Build notes sign-up form
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
A footer e-mail subscription with **double opt-in**, fully stateless — no database, cache or
file store. The only state is a 24h HMAC-SHA256 signed token (`base64url(payload).hexMAC`).

**Where it lives:** `<SubscribeForm />` (`components/subscribe-form.tsx`) is rendered in the site
footer (`components/footer.tsx`), as the last child of the first column, under the tagline. Server
e-mail text and constants live in `lib/subscribe-values.ts`; the token in `lib/subscribe-token.ts`.

- `POST /api/subscribe` — body `{email, replyLang, formRenderedAt, company_website?}`. Sends a
  localized (RU/EN/HE) confirmation e-mail through Resend (`fetch`, 5s timeout). Always `202
  {ok, delivered}` after validation (same shape for new/repeat addresses, bots, missing config
  and Resend failures); `400` only for invalid JSON or a bad field.
- `GET /api/subscribe/confirm?token=…` — verifies the token and sends **one** owner e-mail
  (only if `RESEND_API_KEY` and `LEAD_TO_EMAIL` are set), then `303` to `/subscribe/done`. Any
  bad/expired token, or missing `SUBSCRIBE_TOKEN_SECRET`/`SITE_URL`, gives `303` to
  `/subscribe/invalid`. `HEAD` always redirects to `/subscribe/invalid` without verifying, so
  link probes cannot confirm an address.

**Env vars** (see `.env.example`; all read per request, so builds and previews never break):
- `SUBSCRIBE_TOKEN_SECRET` — server-only HMAC key (empty or unset counts as missing; generate
  with `openssl rand -hex 32`). When missing, sends degrade to `delivered:false` and only the
  `[subscribe] not configured` line is logged.
- `SITE_URL` — server-only absolute origin (`http:`/`https:`) for every confirm link and redirect.
  It is **distinct from `NEXT_PUBLIC_SITE_URL`** (used by Checkout and the QR route); the origin is
  never taken from `Host`/`Origin`.
- Reused: `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`. `LEAD_FROM_EMAIL` **must be on a
  domain verified in Resend**; the fallback `leads@3tdream.vercel.app` may be unverified, in which
  case sends end as `delivered:false`.

**Accepted limits:**
- **Replay:** a valid token can be reused for 24h; each replay sends another owner e-mail.
- **Scanner pre-fetch:** a mail scanner that follows the GET link can confirm an address.
- **No unsubscribe, dedupe, revocation or rate limiting.** Abuse control is only the honeypot and
  the 3000 ms timing rule, so third-party e-mail bombing is an accepted risk.
- The token is signed, not encrypted: the address is readable by anyone holding the link.
- The UI shows "check your inbox" even when `delivered:false`; the cause is logged server-side
  (never the address or token).
- Rotating `SUBSCRIBE_TOKEN_SECRET` invalidates all outstanding links.
- **The owner's inbox (`LEAD_TO_EMAIL`) is the subscriber list.** Nothing is stored server-side, so
  there is no list to export or query, and the owner notice is the only record of a confirmation.

**Follow-up:** a GDPR and Israeli anti-spam (Communications Law §30A) review.

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
