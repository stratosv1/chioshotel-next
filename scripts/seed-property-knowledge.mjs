import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import pg from "pg";

const { Client } = pg;
const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL is required");
}

const seedPath = path.join(process.cwd(), "db", "seeds", "property-knowledge.json");
const entries = JSON.parse(await fs.readFile(seedPath, "utf8"));
const languages = ["en", "el", "fr", "de", "it", "es", "tr"];
const SOURCE_NOTE = "Owner-confirmed Voulamandis House knowledge, 2026-09-05";
const client = new Client({ connectionString });

await client.connect();

try {
  await client.query("begin");

  for (const entry of entries) {
    await client.query(
      `insert into property_knowledge.entries
        (id, category, scopes, status, related_link, sort_order, owner_confirmed, source_note, updated_at)
       values ($1, $2, $3, $4, $5, $6, true, $7, now())
       on conflict (id) do update set
         category = excluded.category,
         scopes = excluded.scopes,
         status = excluded.status,
         related_link = excluded.related_link,
         sort_order = excluded.sort_order,
         owner_confirmed = true,
         source_note = excluded.source_note,
         updated_at = now()`,
      [
        entry.id,
        entry.category,
        entry.scopes,
        entry.status,
        entry.relatedLink || null,
        entry.sortOrder,
        SOURCE_NOTE,
      ],
    );

    for (const language of languages) {
      const translation = entry.translations[language];
      if (!translation) throw new Error(`Missing ${language} translation for ${entry.id}`);

      await client.query(
        `insert into property_knowledge.translations
          (entry_id, language, question, answer, search_terms, updated_at)
         values ($1, $2, $3, $4, $5, now())
         on conflict (entry_id, language) do update set
           question = excluded.question,
           answer = excluded.answer,
           search_terms = excluded.search_terms,
           updated_at = now()`,
        [entry.id, language, translation.question, translation.answer, translation.keywords || []],
      );
    }
  }

  await client.query(
      `update property_knowledge.entries
       set status = 'archived', updated_at = now()
       where source_note = $2
         and not (id = any($1::text[]))`,
      [entries.map((entry) => entry.id), SOURCE_NOTE],
    );

  await client.query("commit");
  console.log(`Seeded ${entries.length} owner-confirmed entries in ${languages.length} languages.`);
} catch (error) {
  await client.query("rollback");
  throw error;
} finally {
  await client.end();
}
