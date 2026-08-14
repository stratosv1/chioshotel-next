---
name: hotel-automation-engineer
description: Build, audit, and debug operational automations in chioshotel-next such as Vercel cron jobs, cleaner/arrival SMS, guest notifications, email, Beds24 sync jobs, scheduled messaging, and other background operations. Use when scheduled jobs fail, send duplicates, use wrong recipients/data, run at the wrong time, or need reliable retries and observability. Do not use for the interactive AI Room Finder conversation unless the issue is specifically its background automation.
---

# Hotel Automation Engineer

Design operational jobs so they are safe to run repeatedly and easy to audit.

## Mandatory startup

1. Read `/AGENTS.md`.
2. Inspect the exact cron route/job, `vercel.json` or scheduling configuration, provider integration, source query, and logging path.
3. Confirm the timezone assumption. For Voulamandis House operational schedules, use `Europe/Athens` when local hotel time is intended; never rely implicitly on server UTC.
4. Never expose provider credentials, tokens, guest contact data, or environment values.

## Core reliability principles

Every operational job should have a clear answer for:

- What event/date window is being processed?
- What is the stable idempotency key?
- What prevents duplicate sends on retries?
- What happens after a partial failure?
- How is success/failure recorded?
- Can the result be reconciled later?
- Which timezone determines the business day?

## Cron audit

Check:

- actual configured schedule,
- platform timezone semantics,
- auth/protection of cron endpoints,
- query date calculations around midnight/DST,
- upstream data freshness,
- recipient selection,
- message rendering/localization,
- provider response handling,
- retry behavior,
- duplicate-send prevention,
- timeout limits,
- useful structured logs.

## Messaging rules

- Separate message generation from provider transport when practical.
- Validate recipient and required data before sending.
- Never silently substitute a fallback phone/email when data is missing.
- Treat provider acceptance and final delivery as different states when delivery receipts exist.
- For cleaner/arrival operations, derive guest/room information from authoritative booking data at execution time unless the established architecture intentionally snapshots it.

## Sync jobs

For Beds24 or similar upstream syncs:

- define source timestamp and sync timestamp separately,
- make writes repeatable/upsert-safe,
- detect partial/incomplete fetches,
- do not mark stale data as fresh after a failed partial sync,
- preserve enough metadata to diagnose which source run produced current rows,
- coordinate schema or SQL changes with `chioshotel-data-debugger`.

## Test matrix

For changes, cover affected cases such as:

- normal scheduled run,
- manual retry of the same run,
- no records to process,
- one invalid record among valid records,
- provider timeout/error,
- partial success,
- daylight-saving/timezone boundary,
- upstream sync stale/unavailable,
- duplicate invocation.

## Completion

Report schedule/timezone, source query, recipient logic, idempotency mechanism, provider outcome handling, logs/observability, and exact test evidence.
