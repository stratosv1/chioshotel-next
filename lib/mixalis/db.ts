import { neon } from "@neondatabase/serverless";

export type PhysicsChapter = {
  id: string;
  title: string;
  note: string | null;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
  materialBatchCount: number;
  sourceFileCount: number;
};

export type MaterialSourceType =
  | "school_theory"
  | "school_exercises"
  | "savvalas"
  | "tripolitis"
  | "school_teacher"
  | "other";

export type PhysicsMaterialBatch = {
  id: string;
  chapterId: string;
  sourceType: MaterialSourceType;
  label: string | null;
  lessonDate: string | null;
  notes: string | null;
  status: "draft" | "uploaded" | "processing" | "ready" | "error";
  createdAt: string;
  updatedAt: string;
  sourceFileCount: number;
};

type ChapterRow = {
  id: string;
  title: string;
  note: string | null;
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
  material_batch_count: string | number;
  source_file_count: string | number;
};

type MaterialBatchRow = {
  id: string;
  chapter_id: string;
  source_type: MaterialSourceType;
  label: string | null;
  lesson_date: string | null;
  notes: string | null;
  status: "draft" | "uploaded" | "processing" | "ready" | "error";
  created_at: string;
  updated_at: string;
  source_file_count: string | number;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }

  return neon(databaseUrl);
}

function mapChapter(row: ChapterRow): PhysicsChapter {
  return {
    id: row.id,
    title: row.title,
    note: row.note,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    materialBatchCount: Number(row.material_batch_count ?? 0),
    sourceFileCount: Number(row.source_file_count ?? 0),
  };
}

function mapMaterialBatch(row: MaterialBatchRow): PhysicsMaterialBatch {
  return {
    id: row.id,
    chapterId: row.chapter_id,
    sourceType: row.source_type,
    label: row.label,
    lessonDate: row.lesson_date,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sourceFileCount: Number(row.source_file_count ?? 0),
  };
}

export async function listPhysicsChapters(): Promise<PhysicsChapter[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      c.id::text,
      c.title,
      c.note,
      c.status,
      c.created_at::text,
      c.updated_at::text,
      COUNT(DISTINCT mb.id)::text AS material_batch_count,
      COUNT(DISTINCT sf.id)::text AS source_file_count
    FROM physics.chapters c
    LEFT JOIN physics.material_batches mb ON mb.chapter_id = c.id
    LEFT JOIN physics.source_files sf ON sf.batch_id = mb.id
    WHERE c.status = 'active'
    GROUP BY c.id
    ORDER BY c.updated_at DESC, c.created_at DESC
  `;

  return (rows as ChapterRow[]).map(mapChapter);
}

export async function getPhysicsChapter(id: string): Promise<PhysicsChapter | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      c.id::text,
      c.title,
      c.note,
      c.status,
      c.created_at::text,
      c.updated_at::text,
      COUNT(DISTINCT mb.id)::text AS material_batch_count,
      COUNT(DISTINCT sf.id)::text AS source_file_count
    FROM physics.chapters c
    LEFT JOIN physics.material_batches mb ON mb.chapter_id = c.id
    LEFT JOIN physics.source_files sf ON sf.batch_id = mb.id
    WHERE c.id::text = ${id}
    GROUP BY c.id
    LIMIT 1
  `;

  return rows.length > 0 ? mapChapter(rows[0] as ChapterRow) : null;
}

export async function createPhysicsChapter(input: {
  title: string;
  note?: string;
}): Promise<PhysicsChapter> {
  const sql = getSql();
  const title = input.title.trim();
  const note = input.note?.trim() || null;

  const rows = await sql`
    INSERT INTO physics.chapters (title, note)
    VALUES (${title}, ${note})
    RETURNING
      id::text,
      title,
      note,
      status,
      created_at::text,
      updated_at::text
  `;

  const row = rows[0] as Omit<ChapterRow, "material_batch_count" | "source_file_count">;
  return mapChapter({
    ...row,
    material_batch_count: 0,
    source_file_count: 0,
  });
}

export async function listMaterialBatches(chapterId: string): Promise<PhysicsMaterialBatch[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      mb.id::text,
      mb.chapter_id::text,
      mb.source_type,
      mb.label,
      mb.lesson_date::text,
      mb.notes,
      mb.status,
      mb.created_at::text,
      mb.updated_at::text,
      COUNT(sf.id)::text AS source_file_count
    FROM physics.material_batches mb
    LEFT JOIN physics.source_files sf ON sf.batch_id = mb.id
    WHERE mb.chapter_id::text = ${chapterId}
    GROUP BY mb.id
    ORDER BY mb.created_at DESC
  `;

  return (rows as MaterialBatchRow[]).map(mapMaterialBatch);
}

export async function createMaterialBatch(input: {
  chapterId: string;
  sourceType: MaterialSourceType;
  label?: string;
  lessonDate?: string;
  notes?: string;
}): Promise<PhysicsMaterialBatch> {
  const sql = getSql();
  const label = input.label?.trim() || null;
  const lessonDate = input.lessonDate?.trim() || null;
  const notes = input.notes?.trim() || null;

  const rows = await sql`
    INSERT INTO physics.material_batches (
      chapter_id,
      source_type,
      label,
      lesson_date,
      notes
    )
    VALUES (
      ${input.chapterId}::uuid,
      ${input.sourceType},
      ${label},
      ${lessonDate},
      ${notes}
    )
    RETURNING
      id::text,
      chapter_id::text,
      source_type,
      label,
      lesson_date::text,
      notes,
      status,
      created_at::text,
      updated_at::text
  `;

  await sql`
    UPDATE physics.chapters
    SET updated_at = NOW()
    WHERE id::text = ${input.chapterId}
  `;

  const row = rows[0] as Omit<MaterialBatchRow, "source_file_count">;
  return mapMaterialBatch({ ...row, source_file_count: 0 });
}

export function isMaterialSourceType(value: string): value is MaterialSourceType {
  return [
    "school_theory",
    "school_exercises",
    "savvalas",
    "tripolitis",
    "school_teacher",
    "other",
  ].includes(value);
}
