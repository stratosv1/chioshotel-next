import fs from "node:fs/promises";
import path from "node:path";

const seedPath = path.join(process.cwd(), "db", "seeds", "property-knowledge.json");
const entries = JSON.parse(await fs.readFile(seedPath, "utf8"));
const languages = ["en", "el", "fr", "de", "it", "es", "tr"];
const sourceNote = "Owner-confirmed Voulamandis House knowledge, 2026-09-05";

function literal(value) {
  if (value === null || value === undefined) return "null";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function textArray(values) {
  return `array[${values.map(literal).join(", ")}]::text[]`;
}

const entryRows = entries.map((entry) =>
  `(${[
    literal(entry.id),
    literal(entry.category),
    textArray(entry.scopes),
    literal(entry.status),
    literal(entry.relatedLink),
    Number(entry.sortOrder),
  ].join(", ")})`,
);

const translationRows = entries.flatMap((entry) =>
  languages.map((language) => {
    const translation = entry.translations[language];
    if (!translation) throw new Error(`Missing ${language} translation for ${entry.id}`);
    return `(${[
      literal(entry.id),
      literal(language),
      literal(translation.question),
      literal(translation.answer),
      textArray(translation.keywords || []),
    ].join(", ")})`;
  }),
);

const activeIds = textArray(entries.map((entry) => entry.id));

process.stdout.write(`with seed_entries (id, category, scopes, status, related_link, sort_order) as (
  values
    ${entryRows.join(",\n    ")}
),
upsert_entries as (
  insert into property_knowledge.entries
    (id, category, scopes, status, related_link, sort_order, owner_confirmed, source_note, updated_at)
  select id, category, scopes, status, related_link, sort_order, true, ${literal(sourceNote)}, now()
  from seed_entries
  on conflict (id) do update set
    category = excluded.category,
    scopes = excluded.scopes,
    status = excluded.status,
    related_link = excluded.related_link,
    sort_order = excluded.sort_order,
    owner_confirmed = true,
    source_note = excluded.source_note,
    updated_at = now()
  returning id
),
archive_removed as (
  update property_knowledge.entries
  set status = 'archived', updated_at = now()
  where source_note = ${literal(sourceNote)}
    and not (id = any(${activeIds}))
  returning id
),
seed_translations (entry_id, language, question, answer, search_terms) as (
  values
    ${translationRows.join(",\n    ")}
),
upsert_translations as (
  insert into property_knowledge.translations
    (entry_id, language, question, answer, search_terms, updated_at)
  select seed.entry_id, seed.language, seed.question, seed.answer, seed.search_terms, now()
  from seed_translations seed
  join upsert_entries entry on entry.id = seed.entry_id
  on conflict (entry_id, language) do update set
    question = excluded.question,
    answer = excluded.answer,
    search_terms = excluded.search_terms,
    updated_at = now()
  returning entry_id
)
select
  (select count(*) from upsert_entries)::int as entries_upserted,
  (select count(*) from upsert_translations)::int as translations_upserted,
  (select count(*) from archive_removed)::int as entries_archived;\n`);
