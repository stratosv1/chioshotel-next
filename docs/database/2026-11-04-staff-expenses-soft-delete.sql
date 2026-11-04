-- Staff expenses: keep deleted rows and make saves safe to retry
-- Date: 2026-11-04
-- Production status: applied on 2026-11-04 before the matching code was deployed.

ALTER TABLE staff_expenses
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS client_ref TEXT UNIQUE;
