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

    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), ".env"));

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Δεν βρέθηκε DATABASE_URL");
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const units = await client.query(`
    SELECT
      id,
      room_id,
      room_name,
      unit_id,
      unit_name,
      label,
      location,
      max_guests
    FROM staff_units
    WHERE is_active = true
    ORDER BY id ASC;
  `);

  const ratesByRoom = await client.query(`
    SELECT
      room_id,
      COUNT(*)::int AS rate_days,
      MIN(stay_date)::text AS first_rate_date,
      MAX(stay_date)::text AS last_rate_date,
      MIN(price)::numeric AS min_price,
      MAX(price)::numeric AS max_price
    FROM staff_rate_cache
    GROUP BY room_id
    ORDER BY room_id;
  `);

  const unitRateMatch = await client.query(`
    SELECT
      u.id,
      u.room_id,
      u.room_name,
      u.unit_id,
      u.unit_name,
      u.label,
      COUNT(r.id)::int AS matched_rate_days,
      MIN(r.stay_date)::text AS first_rate_date,
      MAX(r.stay_date)::text AS last_rate_date,
      MIN(r.price)::numeric AS min_price,
      MAX(r.price)::numeric AS max_price
    FROM staff_units u
    LEFT JOIN staff_rate_cache r
      ON r.room_id = u.room_id
    WHERE u.is_active = true
    GROUP BY
      u.id,
      u.room_id,
      u.room_name,
      u.unit_id,
      u.unit_name,
      u.label
    ORDER BY u.id ASC;
  `);

  const ratesWithoutUnit = await client.query(`
    SELECT
      r.room_id,
      COUNT(*)::int AS rate_days,
      MIN(r.stay_date)::text AS first_rate_date,
      MAX(r.stay_date)::text AS last_rate_date,
      MIN(r.price)::numeric AS min_price,
      MAX(r.price)::numeric AS max_price
    FROM staff_rate_cache r
    LEFT JOIN staff_units u
      ON u.room_id = r.room_id
    WHERE u.room_id IS NULL
    GROUP BY r.room_id
    ORDER BY r.room_id;
  `);

  const report = {
    units: units.rows,
    ratesByRoom: ratesByRoom.rows,
    unitRateMatch: unitRateMatch.rows,
    ratesWithoutUnit: ratesWithoutUnit.rows,
  };

  fs.mkdirSync("reports", { recursive: true });
  fs.writeFileSync(
    "reports/neon-rate-room-mapping-audit.json",
    JSON.stringify(report, null, 2),
    "utf8"
  );

  console.log("OK - Δημιουργήθηκε reports/neon-rate-room-mapping-audit.json");
  console.log("");
  console.log("UNIT → RATE MATCH:");
  console.table(unitRateMatch.rows);
  console.log("");
  console.log("RATES WITHOUT MATCHING UNIT:");
  console.table(ratesWithoutUnit.rows);

  await client.end();
}

main().catch((err) => {
  console.error("ERROR:");
  console.error(err.message);
  process.exit(1);
});
