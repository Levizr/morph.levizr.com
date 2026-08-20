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

Create `.env.local`:

| Variable          | Required | Description                                                              |
| ----------------- | -------- | ------------------------------------------------------------------------ |
| `GITHUB_TOKEN`    | no       | GitHub token for higher API rate limits (public repo works without it)   |

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
