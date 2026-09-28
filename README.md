# morph.levizr.com

Marketing site and live documentation for the [Morph framework](https://github.com/Levizr/morph) — a compiler-based native UI framework. Built with Next.js 16 (App Router) + Tailwind CSS 4 + framer-motion.

## Features

- **Marketing landing page** — hero, animated particle grid, features, code examples, CLI section
- **Live docs** — Markdown is pulled at runtime from the `Levizr/morph` repo (`docs/` folder), rendered with `marked` + `highlight.js`, and cached at the edge (ISR, no rebuilds on doc changes)
- **Smart docs search** — command-palette search (`Ctrl/⌘+K` or `/`) with fuzzy scoring over a prebuilt index of all docs
- **Structured navigation** — sidebar, prev/next buttons, and page ordering are driven by `docs/docs.registry.json` in the morph repo (custom titles, URL slugs via the `file` field, metadata, logical ordering)
- **Themed docs 404** — deleted pages show a branded not-found screen
- **Instant revalidation** — on push, a GitHub Actions workflow purges the Vercel cache by tag (CDN + runtime + data cache) via the Vercel REST API — no webhook, no rebuilds

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create `.env.local` (see `.env.example`):

| Variable          | Required | Description                                                              |
| ----------------- | -------- | ------------------------------------------------------------------------ |
| `GITHUB_TOKEN`    | no       | GitHub token for higher API rate limits (public repo works without it)   |

### Sponsor donations (`/sponsor`)

The custom donate card (quick USD amounts, donor details, Razorpay
Checkout, MongoDB receipts) needs all four of these — without them the
page still renders and falls back to the `razorpay.me/@levizr` link:

| Variable                        | Required | Description                                                        |
| ------------------------------- | -------- | ------------------------------------------------------------------ |
| `MONGODB_URI`                   | yes      | MongoDB connection string (donation records + supporters list)     |
| `RAZORPAY_KEY_ID`               | yes      | Razorpay Key ID — **live** keys for real money                     |
| `RAZORPAY_KEY_SECRET`           | yes      | Razorpay Key Secret (server-side only, never the `NEXT_PUBLIC_` one) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID`   | yes      | Same Key ID, exposed to the browser for Checkout                   |

Flow: `POST /api/sponsor/order` creates a Razorpay order (USD cents, or
INR paise when the visitor picks ₹) and stores a `created` donation →
Checkout collects the payment → `POST /api/sponsor/verify` checks the
HMAC-SHA256 signature and marks it `paid` → `GET /api/sponsor/donors`
powers the supporters strip.

Dashboard checklist: enable **international payments** and the **USD**
currency on the Razorpay account so foreign cards can pay USD orders
(they settle to INR automatically); INR orders work with UPI, cards, and
netbanking out of the box.

### Webhooks (don't skip)

The browser callback (`/api/sponsor/verify`) is best-effort — closed
tabs and dead networks lose it. `POST /api/sponsor/webhook` is the
safety net: Razorpay retries it until every captured payment is recorded.

**Step-by-step setup (2 minutes):**

1. Open the [Razorpay Dashboard](https://dashboard.razorpay.com) (use the
   **Test Mode** toggle first to practice, repeat in **Live Mode** for real money)
2. Go to **Settings** (gear icon, left sidebar) → **Webhooks** → **Add New Webhook**
3. Webhook URL: `https://morph.levizr.com/api/sponsor/webhook`
4. Under **Events**, tick exactly these two (leave everything else unticked):
   - `payment.captured` — marks the donation `paid`
   - `payment.failed` — marks the donation `failed`
5. Set **Alert Email** to an address you read (you get mailed on repeated failures)
6. Click **Create** → click the **eye icon** next to the new webhook to reveal
   the **Webhook Secret** → copy it
7. Save it as `RAZORPAY_WEBHOOK_SECRET` in `.env.local` (local) **and** in
   Vercel → Project → Settings → Environment Variables (production), then
   redeploy/restart so the new value loads

**What our handler does with each event:**

| Event              | Action                                                        |
| ------------------ | ------------------------------------------------------------- |
| `payment.captured` | Finds the donation by order id → marks `paid`, stores payment id |
| `payment.failed`   | Finds the donation by order id → marks `failed`               |
| anything else      | Ignored (200 OK, no retry)                                    |

Security notes: every delivery must carry a valid `x-razorpay-signature`
header (HMAC-SHA256 of the raw body, keyed with the secret) or it gets a
400; deliveries for unknown orders are acked without retry (covers the
dashboard's test pings); re-deliveries of paid orders are deduped.

**Verify it works:** Dashboard → Settings → Webhooks → click the endpoint →
**View Logs** shows every delivery + our status code. Then make a test
donation and close the tab right after paying — the Mongo `donations`
record must still flip to `paid` within a minute.

**Local testing:** Razorpay can't reach `localhost`, so expose dev with a
tunnel (`ngrok http 3000` or `cloudflared tunnel --url http://localhost:3000`),
add that tunnel URL + `/api/sponsor/webhook` as a second webhook entry,
and use its secret locally. Delete the tunnel entry when done.

## Scripts

```bash
pnpm dev       # development server
pnpm build     # production build
pnpm start     # start production server
pnpm lint      # eslint
pnpm exec tsc --noEmit  # typecheck
```

## How the Docs System Works

Docs live in the [`Levizr/morph`](https://github.com/Levizr/morph) repository at `docs/**/*.md`. This site never rebuilds when docs change:

1. **Content fetching** — `lib/github-docs.ts` fetches `docs.registry.json` (navigation structure) and individual `.md` files from GitHub with `cache: "force-cache"` and revalidation tags (`navigation-menu`, `morph-docs`, `doc-<slug>`).
2. **Rendering** — pages are `force-static` ISR: the first visit to a docs URL renders and caches it; every subsequent visit is served from cache.
3. **Revalidation** — the [`revalidate-docs.yml` workflow](https://github.com/Levizr/morph/blob/main/.github/workflows/revalidate-docs.yml) in the morph repo fires on pushes touching `docs/**`, diffs the pushed range, and purges the Vercel cache by tag via `POST /v1/edge-cache/invalidate-by-tags` (one tag per changed page: `doc-<slug>`, plus `navigation-menu` / `morph-docs-tree` when structure changed). Purging by tag clears the CDN, runtime, and data caches in one call.
4. **Next user hit** — the tagged pages re-fetch from GitHub; deleted files render the branded 404.

### Editing Docs

- Edit/add `.md` files under `docs/` in the morph repo.
- Adding/removing a page, reordering, or renaming titles? Update `docs/docs.registry.json` (each item supports `title`, `slug` (URL path), optional `file` (markdown file, defaults to `slug`), plus metadata like `status`, `description`, `keywords`).
- Push to `main`. The workflow purges the affected pages — no manual steps.

### Configuring Revalidation

Set these in the morph repo (Settings → Secrets and variables → Actions):

- `VERCEL_TOKEN` (secret) — Vercel access token with cache-purge permission (vercel.com/account/tokens)
- `VERCEL_PROJECT_ID` (variable) — e.g. `morph-levizr-com`
- `VERCEL_TEAM_ID` (variable) — e.g. `levizr1`

## Structure

```
app/
  components/     # landing page sections, Navbar, Footer
  docs/           # docs layout, sidebar, search, pages, 404
  api/
    docs/search/  # search index API
lib/
  github-docs.ts  # GitHub fetch layer (docs.registry.json, markdown, caching tags)
  markdown.tsx    # marked + highlight.js rendering, link rewriting
  docs-search.ts  # search index builder
  clipboard.ts    # copy-to-clipboard with mobile fallback
  useIsMobile.ts  # mobile detection hook
```
