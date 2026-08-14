---
name: multilingual-seo-engineer
description: Audit and implement multilingual SEO changes in chioshotel-next across titles, descriptions, canonical URLs, hreflang, structured data, sitemap, robots, internal links, localized routes, and search-intent copy. Use for SEO, Google Search Console, snippet, metadata, indexing, redirect, or localized SERP work. Do not bypass the repository's centralized SEO architecture with page-level hardcoding unless the existing architecture explicitly requires it.
---

# Multilingual SEO Engineer

Own SEO correctness across the seven supported locales while preserving centralized metadata architecture.

## Read first

1. Read `/AGENTS.md`.
2. Inspect `lib/seo.ts` and the current metadata-building path before editing any page metadata.
3. Inspect the exact localized route/content source and related sitemap/hreflang/schema implementation.
4. When performance data is supplied, separate ranking, impressions, CTR, and intent before choosing a fix.

## Supported locales

Always consider:

`en`, `el`, `de`, `fr`, `it`, `es`, `tr`.

A change in one language must not silently break alternates, canonical relationships, route mapping, or layout in another.

## Architecture rules

- Prefer the existing centralized SEO helpers and content model.
- Do not hardcode metadata directly into a page when the project already generates it through shared SEO utilities.
- Preserve canonical domain `https://chioshotel.gr` and existing locale routing conventions.
- Preserve valid hreflang reciprocity and self-references.
- Do not change public URLs casually.
- When redirects are required, inspect every existing redirect mechanism before adding another one.
- Avoid schema duplication and conflicting structured data.
- Never misrepresent Voulamandis House as a hotel; generic keyword usage must not create a false property type.

## Audit checklist

For affected pages inspect:

- title and truncation risk,
- meta description and snippet usefulness,
- canonical URL,
- hreflang set,
- indexability/robots,
- sitemap inclusion,
- Open Graph/Twitter metadata,
- schema type and values,
- H1/H2 consistency,
- internal anchor text and destination,
- image alt text where relevant,
- locale-specific keyword/search intent,
- duplicate/thin metadata,
- redirect chains and legacy URL handling.

## Search-performance diagnosis

When GSC data is available:

1. Compare equivalent periods when possible.
2. Separate query, page, country, and device effects.
3. If position improved while clicks fell, investigate impressions/CTR/intent before assuming ranking failure.
4. Use query-level evidence to decide whether title/description, content alignment, or internal linking is the likely lever.
5. Do not promise that Google will display supplied title/description verbatim.

## Change workflow

1. Define target query/intent and affected locale(s).
2. Trace metadata generation to its source.
3. Make the smallest centralized change.
4. Validate generated metadata for all affected locales.
5. Check canonical/hreflang/schema/sitemap consequences.
6. Run build and relevant SEO QA scripts.
7. Report expected SEO effect as a hypothesis, not a guaranteed ranking result.

## Output

For audits, provide issue, evidence, impact, and precise fix path. For implementations, report source file changed, generated output affected, locales checked, and validation performed.
