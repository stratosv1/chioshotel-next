const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;

  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    let value = match[2].trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[match[1]]) process.env[match[1]] = value;
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), ".env"));

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not found");
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const result = await client.query(`
    select
      u.id,
      u.room_id as unit_room_id,
      u.room_name,
      u.unit_id,
      u.unit_name,
      u.label,
      count(r.id)::int as matched_rate_days,
      min(r.stay_date)::text as first_rate_date,
      max(r.stay_date)::text as last_rate_date,
      min(r.price)::text as min_price,
      max(r.price)::text as max_price
    from staff_units u
    left join staff_rate_cache r
      on r.room_id = u.room_id
    where u.is_active = true
    group by u.id, u.room_id, u.room_name, u.unit_id, u.unit_name, u.label
    order by u.id asc;
  `);

  console.table(result.rows);

  await client.end();
}

main().catch((err) => {
  console.error("ERROR:", err.message);
  process.exit(1);
});
