# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Production website for **Voulamandis House** (chioshotel.gr), a rooms/apartments rental business in Chios, Greece — not a hotel (see wording rules below). Next.js (App Router) + Vercel. Windows/PowerShell dev environment.

**This repo also has an `AGENTS.md`** with detailed, mandatory operating rules (safety, workflow, Tailwind migration process, i18n, SEO wording, PowerShell command conventions). Read it in full before making changes — it is the primary rulebook and is not duplicated here except for the load-bearing architectural points below.

## Commands

```powershell
npm.cmd run dev              # dev server
npm.cmd run build            # full production build (see "Build pipeline" below)
npm.cmd run lint             # eslint
```

Prefer `npm.cmd` / `npx.cmd` over bare `npm`/`npx` to avoid PowerShell execution-policy prompts.

QA scripts (also runnable individually):
```powershell
npm.cmd run qa:ai                          # all AI room-finder QA scripts
npm.cmd run qa:room-finder-flow
npm.cmd run qa:room-finder-mobile
npm.cmd run qa:room-finder-back-history
npm.cmd run qa:room-finder-cta-routing
npm.cmd run qa:room-finder-interpreter
npm.cmd run qa:gsc                         # GSC index routing QA
npm.cmd run qa:seo                         # SEO intent architecture QA
npm.cmd run qa:seo-snapshot                # SEO/GSC snapshot lifecycle QA
```

There is no separate `typecheck` script; `next build` performs type checking (TypeScript `strict: false`). Do not add `ignoreBuildErrors` or suppress TS/ESLint errors to force a build to pass.

## Build pipeline — read before touching `scripts/*.cjs`

`npm run build` is **not** just `next build`. It runs `scripts/prepare-build-clean.cjs` first, which sequentially executes a fixed list of "maintenance patch" scripts (see the `PATCHES` array in that file) before the QA scripts and `next build`. These patch scripts mutate source files at build time (legacy-redirect normalization, GSC/GA4 404 remediation, SEO redirect-chain fixes, SEO title/inventory alignment, an image correction, disabling a promo feature, etc.).

- `scripts/` also contains **dozens of one-off `fix-*.cjs` / `patch-*.cjs` scripts** that were written to apply a single historical change and are not part of the build pipeline unless listed in `PATCHES`. Treat scripts not in that array as historical/archival, not something to re-run blindly.
- The build pipeline explicitly excludes the AI Room Finder: per the comment in `prepare-build-clean.cjs`, "the AI Room Finder is fully materialized in source code. Production builds must not mutate AI components or AI API routes." Never add a patch script that touches `components/ai/`, `app/api/ai-*`, or `lib/ai-assistant/` to the `PATCHES` list.
- When asked to make a similar one-off fix, prefer editing the source directly over adding a new build-time patch script, unless the task explicitly asks for a repeatable/idempotent patch (matching the existing pattern).

### Build-safety rule: `scripts/prepare-build-clean.cjs` mutates files on disk

Because `npm.cmd run build` runs patch scripts that rewrite source files as a side effect, **never run it blind** — the resulting `git diff` will mix your intended change with unrelated, automated patch-script edits.

- **Before** running `npm.cmd run build`, capture a baseline: `git status --short` and `git diff` (or equivalent) for the current working tree.
- **After** the build, diff again and compare against the baseline to separate two categories of change: (1) the edits you made for the task, and (2) files touched only by the `PATCHES` scripts in `prepare-build-clean.cjs`.
- Never stage or commit patch-generated changes that are unrelated to the current task, even though the build produced them.
- Never revert, discard, or overwrite pre-existing changes that were already present in the working tree before the build ran (i.e. the user's or a prior session's uncommitted work) — the baseline exists precisely to distinguish "already there" from "build touched this."
- If the build modifies files you did not expect (outside both your task's files and the known `PATCHES` list), stop and report exactly which files, but leave them unstaged/uncommitted rather than guessing whether to keep or discard them.

## Routing & i18n architecture

- Supported languages: `en, el, de, fr, it, es, tr` — defined in `lib/languages.ts` (`languages`, `defaultLanguage`, `normalizePath`). English has no path prefix; other languages use `/el`, `/de`, etc.
- Most localized content is served through the catch-all route `app/[locale]/[...slug]/page.tsx`, driven by `lib/url-map.ts` (~3600 lines) — the central route registry mapping URL paths to `PageTemplate`s (`HomePage`, `RoomsCategoryPage`, `RoomDetailPage`, `ChiosGuidePage`, `Redirect`, etc.) and route actions (`KEEP`, `REDIRECT`, `REMOVE`, `MERGE`, `NOINDEX`, ...). Many top-level per-language directories under `app/` (e.g. `app/de/...`, `app/el/...`, `app/fr/...`) exist alongside this for legacy/static routes — check both `lib/url-map.ts` and whether a dedicated `app/<lang>/<slug>` directory exists before assuming where a page lives.
- `proxy.ts` (repo root, ~600 lines) is this project's Next.js middleware — it runs on every request and handles WordPress-legacy path "Gone" responses (`wordpressGonePrefixes`, `wordpressArchiveGonePrefixes`), a large `legacyRedirects` map, and SEO runtime-rule observation (`lib/seo-health/runtime.ts`). There is no separate `middleware.ts`.
- `next.config.ts` (~1000 lines) additionally holds a large static `redirects()` array (`legacyRedirects` + more) for permanent 301s, plus security/cache headers and image config. When adding a redirect, check whether it belongs in `proxy.ts`, `next.config.ts`'s redirects, or `lib/url-map.ts` — this codebase has three overlapping redirect mechanisms; match the existing pattern for the type of redirect you're adding rather than introducing a fourth.
- Do not describe Voulamandis House as a "hotel" in content/metadata except as a careful, non-misleading search term — see `AGENTS.md` for acceptable wording.

## AI Room Finder / AI Assistant

A self-contained conversational room-finder feature, deliberately isolated from the build-patch pipeline (see above):

- UI/logic: `components/ai/*` (chat UI, carousel, booking flow, intent/date parsing, copy, tone)
- Server logic/knowledge base: `lib/ai-assistant/*` (knowledge base, room catalog, sales-concierge logic, conversation store, live-offer presentation)
- API routes: `app/api/ai-assistant/*`, `app/api/ai-room-finder/*`
- Pages: `app/ai-assistant/page.tsx` (public), `app/staff/ai-room-finder/*` (staff inbox)
- Design/rollout background: `docs/ai-assistant-upgrade-plan.md`, `docs/ai-upgrade-step-1.md`, `docs/ai-preview-branch-note.md` (preview work belongs on a dedicated branch, not production).

## Booking, availability & staff area

- Booking/availability integrates with Beds24 (`app/api/beds24/`, `app/api/booking-core/`) and syncs on Vercel cron jobs defined in `vercel.json` (booking sync, occupancy sync, GSC/GA4 sync, SEO health, daily arrivals SMS — schedules there are the source of truth for sync cadence).
- `app/staff/*` is an internal staff area (booker, calendar, expenses, payroll, operations, SEO tools, WhatsApp status/test) — not public-facing; check `app/api/staff/*` for its backing routes.
- Data layer uses `@neondatabase/serverless` / `pg` (Postgres via Neon) — see `lib/ga4/store.ts`, `lib/gsc/store.ts`, `lib/seo-health/store.ts`, `data/` for query/store patterns.

## SEO subsystem

`lib/` contains an extensive, homegrown SEO tooling layer, not a single library: `lib/seo.ts`, `lib/structured-data.ts`, `lib/seo-health/*` (engine, live checks, GSC page import/audit), `lib/gsc/*` (Google Search Console client, sync, advisor/dashboard), `lib/ga4/*` (Google Analytics 4 client/sync), plus per-language correction modules (`lib/german-seo-corrections.ts`, `lib/french-seo-corrections.ts`, `lib/italian-seo-corrections.ts`, `lib/turkish-seo-corrections.ts`, `lib/greek-*-hardening.ts`, etc.). These feed both the staff `/staff/seo` tools and automated cron jobs (`vercel.json`). Before writing a new SEO fix, check whether an existing per-language correction module already owns that concern.

## Styling / Tailwind migration (in progress, treat as gradual)

- `docs/css-tailwind-migration-state.json` is the source of truth for migration status/history — always read it before any CSS/Tailwind work, and update it after a completed migration step (per `AGENTS.md`'s required workflow).
- Global CSS lives under `app/css-split/` (split from a single `globals.css` via `split-css.py`), organized as `base/`, `components/`, `overrides/`, `pages/`. `overrides.css` is intentionally imported last to win the cascade — do not reorder CSS imports without a documented reason.
- Migration is one small section/page at a time; never touch homepage, header, footer, booking engine, or other shared global components unless explicitly asked.

## Path alias

`@/*` maps to the repo root (see `tsconfig.json`), e.g. `@/lib/url-map`, `@/components/ai/...`.
