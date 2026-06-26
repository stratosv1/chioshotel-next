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

  const tables = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);

  const columns = await client.query(`
    SELECT 
      table_name,
      column_name,
      data_type,
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position;
  `);

  const rowCounts = [];

  for (const row of tables.rows) {
    const table = row.table_name;
    try {
      const countResult = await client.query(`SELECT COUNT(*)::int AS count FROM "${table}"`);
      rowCounts.push({
        table_name: table,
        rows: countResult.rows[0].count,
      });
    } catch (err) {
      rowCounts.push({
        table_name: table,
        rows: "ERROR: " + err.message,
      });
    }
  }

  const related = tables.rows.filter((row) => {
    const name = row.table_name.toLowerCase();
    return (
      name.includes("staff") ||
      name.includes("calendar") ||
      name.includes("booking") ||
      name.includes("unit") ||
      name.includes("availability") ||
      name.includes("communication") ||
      name.includes("guest") ||
      name.includes("room")
    );
  });

  fs.mkdirSync("reports", { recursive: true });

  fs.writeFileSync(
    "reports/neon-tables.json",
    JSON.stringify(tables.rows, null, 2),
    "utf8"
  );

  fs.writeFileSync(
    "reports/neon-columns.json",
    JSON.stringify(columns.rows, null, 2),
    "utf8"
  );

  fs.writeFileSync(
    "reports/neon-row-counts.json",
    JSON.stringify(rowCounts, null, 2),
    "utf8"
  );

  fs.writeFileSync(
    "reports/neon-calendar-related-tables.json",
    JSON.stringify(related, null, 2),
    "utf8"
  );

  console.log("");
  console.log("OK - Δημιουργήθηκαν τα reports:");
  console.log("reports/neon-tables.json");
  console.log("reports/neon-columns.json");
  console.log("reports/neon-row-counts.json");
  console.log("reports/neon-calendar-related-tables.json");
  console.log("");
  console.log("Tables:");
  console.table(tables.rows);
  console.log("");
  console.log("Calendar related:");
  console.table(related);

  await client.end();
}

main().catch((err) => {
  console.error("");
  console.error("ERROR:");
  console.error(err.message);
  process.exit(1);
});
