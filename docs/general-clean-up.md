# General Clean Up

## Mission

Make the public chioshotel.gr experience cleaner, safer and easier to maintain without weakening existing SEO, booking, availability or AI Room Finder flows.

## Scope

- Public pages and shared components for `en`, `el`, `fr`, `de`, `it`, `es` and `tr`.
- Routing, redirects, canonicals, hreflang, sitemap and indexability.
- Localized internal links, navigation and conversion paths.
- Public content accuracy and consistent Voulamandis House terminology.
- Mobile UI, accessibility, images, performance and obsolete code.
- Repeatable QA that prevents fixed issues from returning.

## Out of scope

- `/staff`, `/mixalis` and internal-only APIs, unless a shared change would break them.
- Deleting Polish pages. They are tracked separately while Polish expansion is paused.
- Redesigning working booking, Beds24 or AI Room Finder flows without a specific finding.
- Blocking `/_next/image` in `robots.txt`; optimized images must remain crawlable.

## Non-negotiable facts

- Voulamandis House is guest accommodation with rooms and family apartments in Kambos, not a large hotel or resort.
- The public active-language set is `en`, `el`, `fr`, `de`, `it`, `es`, `tr`.
- The canonical origin is `https://chioshotel.gr` without `www`.
- Localized CTAs must stay in the visitor's language.
- Existing indexed URLs are preserved or moved only through an intentional permanent redirect.

## Workstreams

| ID | Workstream | Initial status | Completion rule |
| --- | --- | --- | --- |
| GCU-01 | URL and indexation hygiene | Completed | Canonical host, redirects, robots, sitemap and legacy URLs pass QA |
| GCU-02 | Seven-language parity | Completed | Every public English owner page has the intended localized equivalents |
| GCU-03 | Localized links | Completed | Navigation and transactional CTAs resolve to the matching locale |
| GCU-04 | Content and internal linking | Planned | Facts are consistent and guide pages connect clearly to rooms and booking |
| GCU-05 | Mobile UI and accessibility | Planned | Readable type, usable controls, semantic structure and no overlapping UI |
| GCU-06 | Images and performance | Planned | Correct Next/Image usage, dimensions, alt text and no avoidable payload |
| GCU-07 | Code and dependency cleanup | Planned | Dead code and obsolete patch paths are removed only after usage proof |
| GCU-08 | Regression protection | Active | One command runs the cleanup guardrails and existing public SEO QA |

## First baseline

The first guardrail checks:

1. the exact seven active languages;
2. the seven localized booking destinations;
3. canonical `https://chioshotel.gr` configuration;
4. the permanent `www` to non-`www` redirect;
5. canonical robots and sitemap hosts;
6. absence of public links to the known misplaced Turkish museum URL;
7. absence of public links to `www.chioshotel.gr`;
8. crawlability of `/_next/image`;
9. a non-blocking inventory of raw `<img>`, TODO/FIXME and public console usage.

Baseline snapshot on 2026-09-29:

- 216 public page files in scope;
- 35 raw `<img>` references for image/performance review;
- 0 TODO/FIXME references;
- 13 public console references, all currently error-path diagnostics;
- all blocking baseline checks passed;
- existing GSC routing, search appearance, room-language parity, SEO architecture, AI discovery and property-knowledge checks passed.
- the production build previously rewrote seven tracked source files through ten patch scripts; those approved patches are now materialized in source and the build is read-only.

Run it with:

```bash
npm run qa:general-clean-up
npm run build
npm run qa:rendered-routes
```

## Current decisions

- The localized booking-link defect on beach detail pages was fixed before this tracker was created.
- Existing `/chios-hotels/`, `/chios-hotels-rates/` and localized deal pages are active Next.js owner pages, not abandoned WordPress pages.
- The misplaced Turkish museum URL already has a permanent redirect to `/tr/sakiz-adasi-muzeleri/`.
- `www.chioshotel.gr` already redirects permanently to the canonical non-`www` host.
- Historical maintenance patches remain available through `npm run maintenance:materialize`, but production builds must never execute them automatically.
- All 49 indexable route families have complete `en`, `el`, `fr`, `de`, `it`, `es`, `tr` coverage in the central route map.
- The last three unresolved route-map records are now explicit permanent redirects; no route remains in `CHECK` state.
- Seven retired Room Finder aliases now redirect directly to their localized AI Room Finder destination without an intermediate hop.
- A rendered crawl of every indexable route exposed seven obsolete Find Your Room URLs incorrectly marked as `KEEP`; the AI Assistant URLs are now the canonical route family and the old URLs are explicit redirects.
- The rendered-route QA now checks all 343 indexable URLs for HTTP 200, the expected canonical and the complete seven-language hreflang set plus `x-default`.
- The same rendered crawl validates 467 unique internal destinations, rejects broken or redirecting content links and verifies that non-language-selector links stay in the current locale.
- The Greek Trip Planner CTA now links directly to the tool's canonical `/trip-planner/` route instead of passing through `/el/trip-planner/`.
- The seven public travel-agent room guides have a database-independent fallback, so a missing or unavailable database no longer turns linked pages into HTTP 500 responses.
- The travel-agent presentation layer enforces the owner-confirmed step-free status of Apartments 8–10 even if an older database value is returned.
- All 168 rendered beach, village and museum detail pages now expose a contextual, localized path to rooms and direct rates; the rendered QA checks both destinations on every page.

## Definition of done

- All blocking General Clean Up checks pass.
- The production build succeeds.
- Every functional cleanup includes evidence of the affected routes and languages.
- Unrelated generated build changes are excluded from commits.
- Each completed workstream is updated here before the final project handoff.
