import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import type { SavvalasExerciseSolution } from "@/lib/mixalis/savvalas-exercise-solver";

export type SavedExerciseSummary = {
  id: string;
  subchapterId: string;
  exerciseIdentifier: string;
  title: string;
  sourcePageFrom: number;
  sourcePageTo: number;
  updatedAt: string;
};

export type SavedExerciseView = SavedExerciseSummary & {
  chapterId: string;
  chapterNumberLabel: string | null;
  chapterTitle: string;
  subchapterNumberLabel: string;
  subchapterTitle: string;
  courseTitle: string;
  solution: SavvalasExerciseSolution;
};

let ensureTablePromise: Promise<void> | null = null;

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

export async function ensureExerciseSolutionsTable() {
  if (ensureTablePromise) return ensureTablePromise;
  ensureTablePromise = (async () => {
    const sql = getSql();
    await sql`
      CREATE TABLE IF NOT EXISTS physics.exercise_solutions (
        id uuid PRIMARY KEY,
        course_id uuid NOT NULL REFERENCES physics.courses(id),
        chapter_id uuid NOT NULL REFERENCES physics.chapters(id),
        subchapter_id uuid NOT NULL REFERENCES physics.subchapters(id),
        source_document_id uuid NOT NULL REFERENCES physics.source_documents(id),
        exercise_identifier text NOT NULL,
        title text NOT NULL,
        source_page_from integer NOT NULL CHECK (source_page_from > 0),
        source_page_to integer NOT NULL CHECK (source_page_to >= source_page_from),
        solution jsonb NOT NULL,
        created_at timestamptz NOT NULL DEFAULT NOW(),
        updated_at timestamptz NOT NULL DEFAULT NOW(),
        UNIQUE (
          subchapter_id,
          exercise_identifier,
          source_document_id,
          source_page_from,
          source_page_to
        )
      )
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS exercise_solutions_chapter_updated_idx
      ON physics.exercise_solutions (chapter_id, updated_at DESC)
    `;
  })().catch((error) => {
    ensureTablePromise = null;
    throw error;
  });
  return ensureTablePromise;
}

function parseSolution(value: unknown): SavvalasExerciseSolution {
  if (typeof value === "string") return JSON.parse(value) as SavvalasExerciseSolution;
  return value as SavvalasExerciseSolution;
}

export async function saveExerciseSolution(input: {
  subchapterId: string;
  exerciseIdentifier: string;
  solution: SavvalasExerciseSolution;
}) {
  if (!input.solution.found) return null;
  await ensureExerciseSolutionsTable();
  const sql = getSql();
  const contextRows = await sql`
    SELECT
      co.id::text AS course_id,
      c.id::text AS chapter_id,
      sc.id::text AS subchapter_id,
      sd.id::text AS source_document_id,
      sr.file_page_from,
      sr.file_page_to
    FROM physics.subchapters sc
    JOIN physics.chapters c ON c.id = sc.chapter_id
    JOIN physics.courses co ON co.id = c.course_id
    JOIN LATERAL (
      SELECT range_row.*
      FROM physics.source_ranges range_row
      JOIN physics.source_documents document ON document.id = range_row.document_id
      WHERE range_row.subchapter_id = sc.id
        AND document.source_kind = 'savvalas_book'
        AND document.status = 'ready'
      ORDER BY range_row.created_at DESC, range_row.file_page_from ASC
      LIMIT 1
    ) sr ON true
    JOIN physics.source_documents sd ON sd.id = sr.document_id
    WHERE sc.id::text = ${input.subchapterId}
      AND sc.status = 'active'
      AND c.status = 'active'
      AND co.status = 'active'
    LIMIT 1
  `;
  if (contextRows.length === 0) {
    throw new Error("Δεν βρέθηκε το ενεργό εύρος Σαββάλα για την αποθήκευση της λύσης.");
  }

  const context = contextRows[0] as any;
  const id = randomUUID();
  const title = input.solution.title || `Άσκηση ${input.exerciseIdentifier}`;
  const solutionJson = JSON.stringify(input.solution);
  const rows = await sql`
    INSERT INTO physics.exercise_solutions (
      id,
      course_id,
      chapter_id,
      subchapter_id,
      source_document_id,
      exercise_identifier,
      title,
      source_page_from,
      source_page_to,
      solution
    ) VALUES (
      ${id}::uuid,
      ${String(context.course_id)}::uuid,
      ${String(context.chapter_id)}::uuid,
      ${String(context.subchapter_id)}::uuid,
      ${String(context.source_document_id)}::uuid,
      ${input.exerciseIdentifier},
      ${title},
      ${Number(context.file_page_from)},
      ${Number(context.file_page_to)},
      ${solutionJson}::jsonb
    )
    ON CONFLICT (
      subchapter_id,
      exercise_identifier,
      source_document_id,
      source_page_from,
      source_page_to
    ) DO UPDATE SET
      title = EXCLUDED.title,
      solution = EXCLUDED.solution,
      updated_at = NOW()
    RETURNING id::text, updated_at::text
  `;

  return {
    id: String(rows[0].id),
    updatedAt: String(rows[0].updated_at),
  };
}

export async function listSavedExerciseSolutionsByChapter(
  chapterId: string,
): Promise<SavedExerciseSummary[]> {
  await ensureExerciseSolutionsTable();
  const sql = getSql();
  const rows = await sql`
    SELECT
      id::text,
      subchapter_id::text,
      exercise_identifier,
      title,
      source_page_from,
      source_page_to,
      updated_at::text
    FROM physics.exercise_solutions
    WHERE chapter_id::text = ${chapterId}
    ORDER BY updated_at DESC, exercise_identifier ASC
  `;

  return rows.map((row: any) => ({
    id: String(row.id),
    subchapterId: String(row.subchapter_id),
    exerciseIdentifier: String(row.exercise_identifier),
    title: String(row.title),
    sourcePageFrom: Number(row.source_page_from),
    sourcePageTo: Number(row.source_page_to),
    updatedAt: String(row.updated_at),
  }));
}

export async function getSavedExerciseSolution(
  solutionId: string,
): Promise<SavedExerciseView | null> {
  await ensureExerciseSolutionsTable();
  const sql = getSql();
  const rows = await sql`
    SELECT
      es.id::text,
      es.chapter_id::text,
      es.subchapter_id::text,
      es.exercise_identifier,
      es.title,
      es.source_page_from,
      es.source_page_to,
      es.solution,
      es.updated_at::text,
      co.title AS course_title,
      c.number_label AS chapter_number_label,
      c.title AS chapter_title,
      sc.number_label AS subchapter_number_label,
      sc.title AS subchapter_title
    FROM physics.exercise_solutions es
    JOIN physics.courses co ON co.id = es.course_id
    JOIN physics.chapters c ON c.id = es.chapter_id
    JOIN physics.subchapters sc ON sc.id = es.subchapter_id
    WHERE es.id::text = ${solutionId}
    LIMIT 1
  `;
  if (rows.length === 0) return null;
  const row = rows[0] as any;
  return {
    id: String(row.id),
    chapterId: String(row.chapter_id),
    subchapterId: String(row.subchapter_id),
    exerciseIdentifier: String(row.exercise_identifier),
    title: String(row.title),
    sourcePageFrom: Number(row.source_page_from),
    sourcePageTo: Number(row.source_page_to),
    updatedAt: String(row.updated_at),
    courseTitle: String(row.course_title),
    chapterNumberLabel: row.chapter_number_label ? String(row.chapter_number_label) : null,
    chapterTitle: String(row.chapter_title),
    subchapterNumberLabel: String(row.subchapter_number_label),
    subchapterTitle: String(row.subchapter_title),
    solution: parseSolution(row.solution),
  };
}
