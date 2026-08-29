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
    ) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), ".env"));

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    await client.query("begin");

    await client.query(`
      alter table booking_core.inventory
      add column if not exists booking_id text;
    `);

    await client.query(`
      create index if not exists booking_core_inventory_booking_id_idx
      on booking_core.inventory (booking_id)
      where booking_id is not null;
    `);

    await client.query("commit");

    const check = await client.query(`
      select
        exists (
          select 1
          from information_schema.columns
          where table_schema = 'booking_core'
            and table_name = 'inventory'
            and column_name = 'booking_id'
        ) as booking_id_column_exists,
        to_regclass('booking_core.booking_core_inventory_booking_id_idx') is not null
          as booking_id_index_exists;
    `);

    console.log("Booking Core booking_id migration check:");
    console.table(check.rows);
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
