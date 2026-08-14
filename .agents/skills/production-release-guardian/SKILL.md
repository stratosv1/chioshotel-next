---
name: production-release-guardian
description: Perform pre-merge, pre-deploy, and production-release checks for chioshotel-next. Use when the user asks to commit, push, merge, deploy, release, go to production, or verify whether a change is ready for production. Do not trigger merely because code was edited if no release action is requested.
---

# Production Release Guardian

Protect `main` and production from unverified changes.

## Release principle

A passing build is necessary but not sufficient. A release is ready only when the requested change, relevant regression surface, repository diff, and deployment path have been checked.

## Mandatory startup

1. Read `/AGENTS.md` completely.
2. Identify the exact source branch, target branch, and requested release scope.
3. Inspect repository status and diff.
4. Confirm that no unrelated or generated files are included.
5. Identify high-risk domains touched: booking, AI flow, database, SEO, localization, cron/notifications, shared layout, environment-dependent API routes.

## Pre-merge gate

Check:

- only intended files changed,
- no `.next` or generated artifacts committed,
- no secret/token/environment values exposed,
- no accidental dependency changes,
- no unexplained patch scripts or temporary debug code,
- relevant unit/QA scripts pass,
- project build passes,
- lint/type checks pass when configured/relevant,
- seven-language behavior is checked when localization/shared UI/SEO is touched,
- mobile/desktop behavior is checked for visible UI changes,
- booking calculations are independently verified for booking changes,
- database migrations/functions are compatible and reviewed for data changes,
- API error/fallback paths remain safe,
- canonical/hreflang/schema/sitemap behavior is checked for SEO/route changes.

## Failure policy

If a required gate fails:

1. Stop the release path.
2. Report the exact failing gate and evidence.
3. Do not bypass or disable the check.
4. Do not make broad unrelated fixes.
5. Route the defect to the appropriate specialist.
6. Re-run the failed gate after the smallest correction.

Never describe a release as production-ready while a known required gate is failing.

## Preview before production

When the deployment workflow supports it and the user requested production:

1. Prefer validating a preview/deployment candidate before merging to `main`.
2. Smoke-test the exact affected routes/workflows.
3. For customer-facing flows, test at least one happy path and one relevant failure/edge path.
4. Verify no new runtime/console/server errors related to the change.

## Production action

Only commit/push/merge/deploy when the user explicitly requested that action. Follow existing repository/GitHub/Vercel workflow rather than inventing a new release mechanism.

After production, if live verification tooling is available, verify the affected production path and distinguish deployment success from functional success.

## Release report

Return a gate table or concise checklist with PASS / FAIL / NOT APPLICABLE for:

- diff scope,
- secrets/dependencies,
- tests,
- build,
- type/lint,
- domain-specific integrity,
- localization,
- visual verification,
- preview smoke test,
- production smoke test.

State the exact commit/PR/deployment identifiers when available and whether rollback risk remains.
