const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;

  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const key = match[1];
    let value = match[2].trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), ".env"));

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Δεν βρέθηκε DATABASE_URL σε .env.local ή .env");
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const sql = `
CREATE TABLE IF NOT EXISTS staff_guest_communications (
  id BIGSERIAL PRIMARY KEY,

  booking_id TEXT,
  beds24_booking_id TEXT,
  book_id TEXT,

  guest_name TEXT,
  first_name TEXT,
  last_name TEXT,

  channel TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'outbound',
  message_type TEXT NOT NULL DEFAULT 'manual',

  recipient_email TEXT,
  recipient_phone TEXT,
  sender TEXT,

  subject TEXT,
  message TEXT NOT NULL,

  status TEXT NOT NULL DEFAULT 'pending',
  provider TEXT,
  provider_message_id TEXT,
  provider_response JSONB,

  arrival_time TEXT,
  arrival_method TEXT,

  reviewed BOOLEAN NOT NULL DEFAULT false,
  reviewed_at TIMESTAMPTZ,

  source TEXT NOT NULL DEFAULT 'staff_calendar',
  raw_payload JSONB,

  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_staff_guest_communications_booking_id
  ON staff_guest_communications (booking_id);

CREATE INDEX IF NOT EXISTS idx_staff_guest_communications_beds24_booking_id
  ON staff_guest_communications (beds24_booking_id);

CREATE INDEX IF NOT EXISTS idx_staff_guest_communications_channel
  ON staff_guest_communications (channel);

CREATE INDEX IF NOT EXISTS idx_staff_guest_communications_status
  ON staff_guest_communications (status);

CREATE INDEX IF NOT EXISTS idx_staff_guest_communications_created_at
  ON staff_guest_communications (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_staff_guest_communications_reviewed
  ON staff_guest_communications (reviewed);

CREATE OR REPLACE FUNCTION set_staff_guest_communications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_staff_guest_communications_updated_at
ON staff_guest_communications;

CREATE TRIGGER trg_staff_guest_communications_updated_at
BEFORE UPDATE ON staff_guest_communications
FOR EACH ROW
EXECUTE FUNCTION set_staff_guest_communications_updated_at();
`;

  await client.query(sql);

  const check = await client.query(`
    SELECT 
      column_name,
      data_type,
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'staff_guest_communications'
    ORDER BY ordinal_position;
  `);

  const count = await client.query(`
    SELECT COUNT(*)::int AS rows
    FROM staff_guest_communications;
  `);

  fs.writeFileSync(
    "reports/neon-staff-guest-communications-columns.json",
    JSON.stringify(check.rows, null, 2),
    "utf8"
  );

  fs.writeFileSync(
    "reports/neon-staff-guest-communications-count.json",
    JSON.stringify(count.rows, null, 2),
    "utf8"
  );

  console.log("");
  console.log("OK - Δημιουργήθηκε/ελέγχθηκε ο πίνακας staff_guest_communications");
  console.log("");
  console.log("Rows:");
  console.table(count.rows);
  console.log("");
  console.log("Columns:");
  console.table(check.rows);
  console.log("");
  console.log("Reports:");
  console.log("reports/neon-staff-guest-communications-columns.json");
  console.log("reports/neon-staff-guest-communications-count.json");

  await client.end();
}

main().catch((err) => {
  console.error("");
  console.error("ERROR:");
  console.error(err.message);
  process.exit(1);
});
