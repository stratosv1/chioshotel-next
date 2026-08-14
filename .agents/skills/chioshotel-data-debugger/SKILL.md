---
name: chioshotel-data-debugger
description: Diagnose and safely repair Neon/Postgres data, schema, SQL functions, booking_core logic, sync freshness, duplicates, missing rows, and application/database mismatches for chioshotel-next. Use when behavior appears correct in the app layer but source data or database functions may be wrong, or when SQL/schema changes are required. Default to read-only diagnosis; do not mutate production data unless the user explicitly requests and the correction is verified.
---

# Chioshotel Data Debugger

Treat the database as an authoritative system that requires evidence-driven changes and safe reconciliation.

## Mandatory startup

1. Read `/AGENTS.md`.
2. Identify the exact application query/API contract that depends on the data.
3. Inspect relevant Neon schema, tables, views, functions, constraints, indexes, and sync metadata before proposing changes.
4. Prefer read-only SQL for diagnosis.
5. Never print, log, or expose database credentials or private guest data.

## Diagnostic workflow

1. Define the observed application mismatch with exact inputs.
2. Trace the request to the database query/function.
3. Query only the smallest relevant data slice.
4. Check source timestamps and freshness before concluding values are wrong.
5. Compare raw rows, derived function output, and API output.
6. Determine whether the root cause is:
   - upstream sync,
   - stale/incomplete data,
   - duplicate/missing rows,
   - date-boundary logic,
   - SQL function logic,
   - schema/constraint issue,
   - application mapping.
7. Propose the smallest authoritative fix.

## Booking data discipline

For booking/inventory work, inspect the current `booking_core` model and functions actually called by the application. Verify:

- room identity and external unit mapping,
- stay-date boundary semantics,
- availability across every night,
- occupancy/capacity data,
- price components and derived totals,
- source-generated and synced timestamps,
- split-stay function behavior,
- inventory readiness/failure state.

Coordinate result correctness with `booking-engine-integrity`.

## Safe write rules

Do not write production data unless the user has explicitly requested the correction and the target rows are unambiguous.

Before any write:

- show the diagnostic evidence,
- identify exact affected rows/objects,
- define rollback/reversal where practical,
- prefer transactional changes,
- avoid broad `UPDATE`/`DELETE` without restrictive predicates,
- preserve constraints and source-system ownership,
- do not manually overwrite data that will immediately be reintroduced by the upstream sync unless the source issue is also handled.

## Schema/function changes

For DDL or stored-function changes:

1. Inspect callers and dependent objects.
2. Maintain backwards compatibility unless a coordinated change is requested.
3. Use explicit types and deterministic date/price semantics.
4. Add constraints/checks when they encode a genuine invariant rather than masking bad source data.
5. Test representative normal and boundary cases.
6. Verify application API behavior after the database change.

## Reconciliation output

Report:

- exact mismatch,
- data/function evidence,
- freshness state,
- root cause layer,
- SQL or schema change made/proposed,
- rows/objects affected,
- validation queries,
- rollback/recovery consideration,
- remaining upstream risk.
