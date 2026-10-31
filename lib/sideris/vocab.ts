import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";

export type VocabLanguage = "en" | "de";

export type VocabSubject = {
  slug: "agglika" | "germanika";
  language: VocabLanguage;
  name: string;
  speechLang: string;
  termLabel: string;
  accent: string;
  soft: string;
};

export const VOCAB_SUBJECTS: Record<VocabSubject["slug"], VocabSubject> = {
  agglika: {
    slug: "agglika",
    language: "en",
    name: "Αγγλικά",
    speechLang: "en-GB",
    termLabel: "English",
    accent: "bg-[#2f5d8a] text-white",
    soft: "bg-[#e6eef6] text-[#24496d]",
  },
  germanika: {
    slug: "germanika",
    language: "de",
    name: "Γερμανικά",
    speechLang: "de-DE",
    termLabel: "Deutsch",
    accent: "bg-[#b5562a] text-white",
    soft: "bg-[#f8e9e0] text-[#86391a]",
  },
};

export function getVocabSubject(slug: string): VocabSubject | null {
  return (VOCAB_SUBJECTS as Record<string, VocabSubject>)[slug] ?? null;
}

/** A revision test unlocks after every REVISION_BLOCK chapters. */
export const REVISION_BLOCK = 5;

export type VocabWordInput = {
  term: string;
  meaning: string;
  note: string;
  example: string;
};

export type VocabWord = VocabWordInput & {
  id: string;
  unitId: string;
  position: number;
};

export type VocabUnit = {
  id: string;
  language: VocabLanguage;
  number: number;
  title: string;
  wordCount: number;
  updatedAt: string;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

let ensurePromise: Promise<void> | null = null;

async function ensureVocabTables() {
  if (ensurePromise) return ensurePromise;
  ensurePromise = (async () => {
    const sql = getSql();
    await sql`
      CREATE TABLE IF NOT EXISTS sideris_vocab_units (
        id uuid PRIMARY KEY,
        language text NOT NULL CHECK (language IN ('en', 'de')),
        number integer NOT NULL CHECK (number > 0),
        title text NOT NULL DEFAULT '',
        created_at timestamptz NOT NULL DEFAULT NOW(),
        updated_at timestamptz NOT NULL DEFAULT NOW(),
        UNIQUE (language, number)
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS sideris_vocab_words (
        id uuid PRIMARY KEY,
        unit_id uuid NOT NULL REFERENCES sideris_vocab_units(id) ON DELETE CASCADE,
        position integer NOT NULL,
        term text NOT NULL,
        meaning text NOT NULL,
        note text NOT NULL DEFAULT '',
        example text NOT NULL DEFAULT ''
      )
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS sideris_vocab_words_unit_idx
      ON sideris_vocab_words (unit_id, position)
    `;
  })().catch((error) => {
    ensurePromise = null;
    throw error;
  });
  return ensurePromise;
}

function clean(value: unknown, max: number) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

export function cleanWords(raw: unknown): VocabWordInput[] {
  const list = Array.isArray(raw) ? raw : [];
  const words: VocabWordInput[] = [];
  for (const item of list.slice(0, 300)) {
    const term = clean(item?.term, 200);
    const meaning = clean(item?.meaning, 300);
    if (!term || !meaning) continue;
    words.push({ term, meaning, note: clean(item?.note, 200), example: clean(item?.example, 400) });
  }
  return words;
}

function mapUnit(row: any): VocabUnit {
  return {
    id: row.id,
    language: row.language,
    number: Number(row.number),
    title: row.title ?? "",
    wordCount: Number(row.word_count ?? 0),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function mapWord(row: any): VocabWord {
  return {
    id: row.id,
    unitId: row.unit_id,
    position: Number(row.position),
    term: row.term,
    meaning: row.meaning,
    note: row.note ?? "",
    example: row.example ?? "",
  };
}

export async function listVocabUnits(language: VocabLanguage): Promise<VocabUnit[]> {
  await ensureVocabTables();
  const sql = getSql();
  const rows = await sql`
    SELECT u.id, u.language, u.number, u.title, u.updated_at, COUNT(w.id) AS word_count
    FROM sideris_vocab_units u
    LEFT JOIN sideris_vocab_words w ON w.unit_id = u.id
    WHERE u.language = ${language}
    GROUP BY u.id
    ORDER BY u.number
  `;
  return rows.map(mapUnit);
}

export async function getVocabUnitByNumber(language: VocabLanguage, number: number) {
  await ensureVocabTables();
  const sql = getSql();
  const units = await sql`
    SELECT u.id, u.language, u.number, u.title, u.updated_at,
      (SELECT COUNT(*) FROM sideris_vocab_words w WHERE w.unit_id = u.id) AS word_count
    FROM sideris_vocab_units u
    WHERE u.language = ${language} AND u.number = ${number}
  `;
  if (units.length === 0) return null;
  const unit = mapUnit(units[0]);
  const words = await sql`
    SELECT id, unit_id, position, term, meaning, note, example
    FROM sideris_vocab_words WHERE unit_id = ${unit.id} ORDER BY position
  `;
  return { unit, words: words.map(mapWord) };
}

/** Words of chapters fromNumber..toNumber (inclusive), with their chapter number. */
export async function listVocabWordsInRange(language: VocabLanguage, fromNumber: number, toNumber: number) {
  await ensureVocabTables();
  const sql = getSql();
  const rows = await sql`
    SELECT w.id, w.unit_id, w.position, w.term, w.meaning, w.note, w.example, u.number AS unit_number
    FROM sideris_vocab_words w
    JOIN sideris_vocab_units u ON u.id = w.unit_id
    WHERE u.language = ${language} AND u.number BETWEEN ${fromNumber} AND ${toNumber}
    ORDER BY u.number, w.position
  `;
  return rows.map((row: any) => ({ ...mapWord(row), unitNumber: Number(row.unit_number) }));
}

/** Creates the chapter, or replaces its title and words if it already exists. */
export async function saveVocabUnit(input: {
  language: VocabLanguage;
  number: number;
  title: string;
  words: VocabWordInput[];
}) {
  await ensureVocabTables();
  const sql = getSql();
  const newId = randomUUID();
  const title = clean(input.title, 160);
  const rows = await sql`
    INSERT INTO sideris_vocab_units (id, language, number, title)
    VALUES (${newId}, ${input.language}, ${input.number}, ${title})
    ON CONFLICT (language, number)
    DO UPDATE SET title = EXCLUDED.title, updated_at = NOW()
    RETURNING id
  `;
  const unitId = rows[0].id as string;
  const ids = input.words.map(() => randomUUID());
  const positions = input.words.map((_, index) => index + 1);
  await sql.transaction([
    sql`DELETE FROM sideris_vocab_words WHERE unit_id = ${unitId}`,
    sql`
      INSERT INTO sideris_vocab_words (id, unit_id, position, term, meaning, note, example)
      SELECT id, ${unitId}::uuid, position, term, meaning, note, example
      FROM UNNEST(
        ${ids}::uuid[],
        ${positions}::int[],
        ${input.words.map((w) => w.term)}::text[],
        ${input.words.map((w) => w.meaning)}::text[],
        ${input.words.map((w) => w.note)}::text[],
        ${input.words.map((w) => w.example)}::text[]
      ) AS t(id, position, term, meaning, note, example)
    `,
  ]);
  return unitId;
}

export async function deleteVocabUnit(language: VocabLanguage, number: number) {
  await ensureVocabTables();
  const sql = getSql();
  await sql`DELETE FROM sideris_vocab_units WHERE language = ${language} AND number = ${number}`;
}
