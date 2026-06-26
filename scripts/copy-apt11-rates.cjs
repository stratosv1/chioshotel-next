const fs = require("fs");
const { Client } = require("pg");

for (const f of [".env.local", ".env"]) {
  if (fs.existsSync(f)) {
    for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
      const m = line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, "");
      }
    }
  }
}

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const before = await client.query(
    "select count(*)::int as count from staff_rate_cache where room_id = $1",
    ["345347"]
  );

  if (before.rows[0].count > 0) {
    console.log("STOP: Apt 11 already has rates. No changes made.");
    await client.end();
    return;
  }

  const inserted = await client.query(`
    insert into staff_rate_cache
      (room_id, stay_date, price, currency, source, created_at, updated_at)
    select
      '345347',
      stay_date,
      price,
      currency,
      'copied-from-apartment-265595',
      now(),
      now()
    from staff_rate_cache
    where room_id = '265595'
    returning id;
  `);

  console.log("Inserted Apt 11 rate rows:", inserted.rowCount);

  await client.end();
}

main().catch((err) => {
  console.error("ERROR:", err.message);
  process.exit(1);
});
