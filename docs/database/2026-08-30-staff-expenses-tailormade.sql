-- Staff expenses schema migration
-- Date: 2026-08-30
-- Purpose: keep DDL out of request handlers and add Tailormade as a first-class account.
-- Apply once to the production Neon database before enabling Tailormade writes.

BEGIN;

CREATE TABLE IF NOT EXISTS staff_expenses (
  id BIGSERIAL PRIMARY KEY,
  expense_date DATE NOT NULL,
  primary_account VARCHAR(20) NOT NULL,
  category VARCHAR(80) NOT NULL,
  entity VARCHAR(80) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE staff_expenses
  DROP CONSTRAINT IF EXISTS staff_expenses_primary_account_check;

ALTER TABLE staff_expenses
  ADD CONSTRAINT staff_expenses_primary_account_check
  CHECK (primary_account IN ('kampos', 'family', 'tailormade')) NOT VALID;

ALTER TABLE staff_expenses
  VALIDATE CONSTRAINT staff_expenses_primary_account_check;

CREATE INDEX IF NOT EXISTS staff_expenses_expense_date_idx
  ON staff_expenses (expense_date DESC);

CREATE INDEX IF NOT EXISTS staff_expenses_category_idx
  ON staff_expenses (category);

CREATE INDEX IF NOT EXISTS staff_expenses_entity_idx
  ON staff_expenses (entity);

CREATE INDEX IF NOT EXISTS staff_expenses_primary_account_date_idx
  ON staff_expenses (primary_account, expense_date DESC);

COMMIT;

-- Verification query:
-- SELECT primary_account, COUNT(*) AS rows, COALESCE(SUM(amount), 0) AS total
-- FROM staff_expenses
-- GROUP BY primary_account
-- ORDER BY primary_account;
