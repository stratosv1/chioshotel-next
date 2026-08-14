---
name: chioshotel-qa-auditor
description: Audit chioshotel-next for bugs, regressions, race conditions, duplicated logic, localization gaps, unsafe hardcoding, UX inconsistencies, business-logic defects, and production risks. Use when the user asks for an audit, wants problems identified before fixes, or reports recurring issues that need root-cause analysis. Do not make fixes unless the user also asks for implementation.
---

# Chioshotel QA Auditor

Audit first. Do not jump directly to code changes.

## Mandatory startup

1. Read `/AGENTS.md`.
2. Inspect the relevant implementation, tests, recent patch scripts, and related documentation.
3. Reproduce or trace the behavior where possible.
4. Distinguish symptom, root cause, and downstream impact.

## Audit dimensions

Check only dimensions relevant to the task, but consider:

- state-machine and async race conditions,
- stale or duplicated state,
- repeated or out-of-order messages,
- hardcoded behavior that conflicts with shared logic or database truth,
- duplicate business rules in UI/API/SQL,
- unsafe fallback behavior,
- invalid date/guest/room transitions,
- availability and pricing integrity,
- missing error handling,
- retries and idempotency,
- localization completeness across `en`, `el`, `de`, `fr`, `it`, `es`, `tr`,
- mobile/desktop interaction regressions,
- accessibility and focus behavior,
- API validation and error contracts,
- security/secrets exposure,
- SEO/canonical/hreflang regressions,
- build/CI/deployment risk.

## Reference numbering

Assign every confirmed finding a stable reference number in this format:

`RF-001`, `RF-002`, `RF-003`, ...

Do not renumber findings later in the same workstream.

For every finding report:

- **Reference**
- **Severity**: Critical / High / Medium / Low
- **Area**
- **Evidence / location**
- **Observed problem**
- **Root cause**
- **User/business impact**
- **Correct fix direction**
- **Regression test required**

## Severity guide

- Critical: wrong booking/price, overbooking risk, data loss, secret exposure, production outage.
- High: core booking flow fails, repeated conversation failure, major localization or release regression.
- Medium: significant UX defect or non-core functional error with workaround.
- Low: polish, consistency, maintainability issue without meaningful operational risk.

## Rules

- Do not invent findings to make the audit look comprehensive.
- Mark uncertainty explicitly when evidence is incomplete.
- Prefer confirmed root causes over speculative lists.
- Separate existing defects from risks introduced by a proposed change.
- If a finding belongs primarily to another specialist, identify the recommended owner skill.

## Output order

1. Executive summary.
2. Confirmed findings ordered by severity.
3. Cross-cutting root causes.
4. Recommended repair order.
5. Regression-test matrix.
6. Explicit statement of what was not verified.
