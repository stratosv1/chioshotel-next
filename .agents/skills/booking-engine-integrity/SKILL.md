---
name: booking-engine-integrity
description: Verify and repair booking availability, occupancy, pricing, discounts, taxes, breakfast totals, room eligibility, and split-stay calculations for chioshotel-next. Use when a room is wrongly available/unavailable, a total is wrong, guest capacity is wrong, room ordering depends on booking rules, or booking results disagree with source data. Do not solve pricing defects by hardcoding values in the UI.
---

# Booking Engine Integrity

Treat booking correctness as a financial and inventory integrity problem, not a presentation problem.

## Mandatory startup

1. Read `/AGENTS.md`.
2. Inspect the current booking API and the database-backed functions it calls.
3. Inspect current room catalog/config and relevant tests.
4. Verify current business rules from code/database/docs before changing them. Historical conversation knowledge is context only, never the source of truth.

Key current orientation includes:

- `app/api/ai-room-finder/availability/route.ts`
- `lib/ai-assistant/room-card-catalog*`
- Neon `booking_core` functions/tables referenced by the application
- booking/availability QA scripts under `scripts/`

## Source-of-truth hierarchy

Prefer, in order:

1. verified booking/inventory source data,
2. authoritative Neon schema/functions/config,
3. shared application booking contracts,
4. API presentation mapping,
5. UI rendering.

Never fix an upstream booking defect by adding a special case in level 4 or 5.

## Integrity checks

For the requested stay, verify:

- check-in and check-out boundaries,
- number of nights,
- room inventory for every night,
- maximum occupancy and room eligibility,
- room/guest allocation for multi-room requests,
- base price source,
- extra-person charges and exceptions,
- direct-booking discount,
- split-stay eligibility and maximum room changes,
- split-stay discount,
- breakfast total if shown,
- taxes/fees if shown or intentionally excluded,
- original total, direct total, and savings arithmetic,
- rounding behavior,
- room sort/order if it is part of business rules,
- freshness/sync status of source data.

## Invariants

Enforce or test invariants such as:

- checkout must be after checkin,
- availability means the room is free for every required night unless explicitly returned as split stay,
- a room must never be offered above verified capacity,
- direct totals must reconcile from authoritative price components,
- savings must equal the documented relationship between original and direct totals,
- split stays must be clearly distinguished from single-room availability,
- stale/unready inventory must fail safely rather than fabricate availability,
- one pricing rule must not be independently implemented in several layers.

## Debug workflow

1. Reproduce with exact dates, guests, and room allocation.
2. Capture API output.
3. Trace the responsible SQL/database function and source rows.
4. Recalculate the expected result independently from source components.
5. Identify whether the mismatch is data, SQL, API mapping, or UI.
6. Fix the earliest authoritative layer.
7. Add a regression case using the smallest deterministic fixture/query possible.
8. Re-test adjacent occupancy boundaries and at least one unaffected normal case.

## Safety

- Never modify production inventory merely to make a test pass.
- Never expose `DATABASE_URL` or other credentials.
- Prefer read-only diagnostic SQL until a data correction is explicitly required.
- For schema/function changes, coordinate with `chioshotel-data-debugger`.

## Completion report

Show expected versus actual result, root layer, arithmetic reconciliation, change made, regression tests, and any data freshness caveat.
