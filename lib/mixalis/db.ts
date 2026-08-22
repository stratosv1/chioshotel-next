import { neon } from "@neondatabase/serverless";

export type PhysicsCourse = {
  id: string;
  code: "general_education" | "orientation";
  title: string;
  sortOrder: number;
  chapterCount: number;
  subchapterCount: number;
  materialBatchCount: number;
};

export type PhysicsCourseChapter = {
  id: string;
  numberLabel: string | null;
  title: string;
  note: string | null;
  sortOrder: number;
  subchapterCount: number;
  materialBatchCount: number;
  sourceFileCount: number;
  updatedAt: string;
};

export type PhysicsSubchapter = {
  id: string;
  chapterId: string;
  numberLabel: string;
  title: string;
  note: string | null;
  sortOrder: number;
};

export type PhysicsChapter = {
  id: string;
  courseCode: PhysicsCourse["code"] | null;
  numberLabel: string | null;
  title: string;
  note: string | null;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
  subchapterCount: number;
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
  subchapterId: string | null;
  subchapterNumberLabel: string | null;
  subchapterTitle: string | null;
  sourceType: MaterialSourceType;
  label: string | null;
  lessonDate: string | null;
  notes: string | null;
  status: "draft" | "uploaded" | "processing" | "ready" | "error";
  createdAt: string;
  updatedAt: string;
  sourceFileCount: number;
};

type CourseRow = {
  id: string;
  code: PhysicsCourse["code"];
  title: string;
  sort_order: string | number;
  chapter_count: string | number;
  subchapter_count: string | number;
  material_batch_count: string | number;
};

type CourseChapterRow = {
  id: string;
  number_label: string | null;
  title: string;
  note: string | null;
  sort_order: string | number;
  subchapter_count: string | number;
  material_batch_count: string | number;
  source_file_count: string | number;
  updated_at: string;
};

type SubchapterRow = {
  id: string;
  chapter_id: string;
  number_label: string;
  title: string;
  note: string | null;
  sort_order: string | number;
};

type ChapterRow = {
  id: string;
  course_code?: PhysicsCourse["code"] | null;
  number_label?: string | null;
  title: string;
  note: string | null;
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
  subchapter_count?: string | number;
  material_batch_count: string | number;
  source_file_count: string | number;
};

type MaterialBatchRow = {
  id: string;
  chapter_id: string;
  subchapter_id?: string | null;
  subchapter_number_label?: string | null;
  subchapter_title?: string | null;
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

function mapCourse(row: CourseRow): PhysicsCourse {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    sortOrder: Number(row.sort_order ?? 0),
    chapterCount: Number(row.chapter_count ?? 0),
    subchapterCount: Number(row.subchapter_count ?? 0),
    materialBatchCount: Number(row.material_batch_count ?? 0),
  };
}

function mapCourseChapter(row: CourseChapterRow): PhysicsCourseChapter {
  return {
    id: row.id,
    numberLabel: row.number_label,
    title: row.title,
    note: row.note,
    sortOrder: Number(row.sort_order ?? 0),
    subchapterCount: Number(row.subchapter_count ?? 0),
    materialBatchCount: Number(row.material_batch_count ?? 0),
    sourceFileCount: Number(row.source_file_count ?? 0),
    updatedAt: row.updated_at,
  };
}

function mapSubchapter(row: SubchapterRow): PhysicsSubchapter {
  return {
    id: row.id,
    chapterId: row.chapter_id,
    numberLabel: row.number_label,
    title: row.title,
    note: row.note,
    sortOrder: Number(row.sort_order ?? 0),
  };
}

function mapChapter(row: ChapterRow): PhysicsChapter {
  return {
    id: row.id,
    courseCode: row.course_code ?? null,
    numberLabel: row.number_label ?? null,
    title: row.title,
    note: row.note,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    subchapterCount: Number(row.subchapter_count ?? 0),
    materialBatchCount: Number(row.material_batch_count ?? 0),
    sourceFileCount: Number(row.source_file_count ?? 0),
  };
}

function mapMaterialBatch(row: MaterialBatchRow): PhysicsMaterialBatch {
  return {
    id: row.id,
    chapterId: row.chapter_id,
    subchapterId: row.subchapter_id ?? null,
    subchapterNumberLabel: row.subchapter_number_label ?? null,
    subchapterTitle: row.subchapter_title ?? null,
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

export async function listPhysicsCourses(): Promise<PhysicsCourse[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      co.id::text,
      co.code,
      co.title,
      co.sort_order,
      COUNT(DISTINCT c.id)::text AS chapter_count,
      COUNT(DISTINCT sc.id)::text AS subchapter_count,
      COUNT(DISTINCT mb.id)::text AS material_batch_count
    FROM physics.courses co
    LEFT JOIN physics.chapters c
      ON c.course_id = co.id AND c.status = 'active'
    LEFT JOIN physics.subchapters sc
      ON sc.chapter_id = c.id AND sc.status = 'active'
    LEFT JOIN physics.material_batches mb ON mb.chapter_id = c.id
    WHERE co.status = 'active'
    GROUP BY co.id
    ORDER BY co.sort_order ASC, co.title ASC
  `;

  return (rows as CourseRow[]).map(mapCourse);
}

export async function getPhysicsCourse(
  code: string,
): Promise<PhysicsCourse | null> {
  const courses = await listPhysicsCourses();
  return courses.find((course) => course.code === code) ?? null;
}

export async function listPhysicsChaptersByCourse(
  courseCode: string,
): Promise<PhysicsCourseChapter[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      c.id::text,
      c.number_label,
      c.title,
      c.note,
      c.sort_order,
      c.updated_at::text,
      COUNT(DISTINCT sc.id)::text AS subchapter_count,
      COUNT(DISTINCT mb.id)::text AS material_batch_count,
      COUNT(DISTINCT sf.id)::text AS source_file_count
    FROM physics.chapters c
    JOIN physics.courses co ON co.id = c.course_id
    LEFT JOIN physics.subchapters sc
      ON sc.chapter_id = c.id AND sc.status = 'active'
    LEFT JOIN physics.material_batches mb ON mb.chapter_id = c.id
    LEFT JOIN physics.source_files sf ON sf.batch_id = mb.id
    WHERE co.code = ${courseCode}
      AND co.status = 'active'
      AND c.status = 'active'
    GROUP BY c.id
    ORDER BY c.sort_order ASC, c.number_label ASC, c.created_at ASC
  `;

  return (rows as CourseChapterRow[]).map(mapCourseChapter);
}

export async function listPhysicsSubchapters(
  chapterId: string,
): Promise<PhysicsSubchapter[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      sc.id::text,
      sc.chapter_id::text,
      sc.number_label,
      sc.title,
      sc.note,
      sc.sort_order
    FROM physics.subchapters sc
    WHERE sc.chapter_id::text = ${chapterId}
      AND sc.status = 'active'
    ORDER BY sc.sort_order ASC, sc.number_label ASC
  `;

  return (rows as SubchapterRow[]).map(mapSubchapter);
}

export async function isPhysicsSubchapterInChapter(
  chapterId: string,
  subchapterId: string,
): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`
    SELECT 1
    FROM physics.subchapters
    WHERE id::text = ${subchapterId}
      AND chapter_id::text = ${chapterId}
      AND status = 'active'
    LIMIT 1
  `;

  return rows.length > 0;
}

export async function listPhysicsChapters(): Promise<PhysicsChapter[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      c.id::text,
      co.code AS course_code,
      c.number_label,
      c.title,
      c.note,
      c.status,
      c.created_at::text,
      c.updated_at::text,
      COUNT(DISTINCT sc.id)::text AS subchapter_count,
      COUNT(DISTINCT mb.id)::text AS material_batch_count,
      COUNT(DISTINCT sf.id)::text AS source_file_count
    FROM physics.chapters c
    LEFT JOIN physics.courses co ON co.id = c.course_id
    LEFT JOIN physics.subchapters sc
      ON sc.chapter_id = c.id AND sc.status = 'active'
    LEFT JOIN physics.material_batches mb ON mb.chapter_id = c.id
    LEFT JOIN physics.source_files sf ON sf.batch_id = mb.id
    WHERE c.status = 'active'
    GROUP BY c.id, co.code
    ORDER BY c.updated_at DESC, c.created_at DESC
  `;

  return (rows as ChapterRow[]).map(mapChapter);
}

export async function getPhysicsChapter(id: string): Promise<PhysicsChapter | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      c.id::text,
      co.code AS course_code,
      c.number_label,
      c.title,
      c.note,
      c.status,
      c.created_at::text,
      c.updated_at::text,
      COUNT(DISTINCT sc.id)::text AS subchapter_count,
      COUNT(DISTINCT mb.id)::text AS material_batch_count,
      COUNT(DISTINCT sf.id)::text AS source_file_count
    FROM physics.chapters c
    LEFT JOIN physics.courses co ON co.id = c.course_id
    LEFT JOIN physics.subchapters sc
      ON sc.chapter_id = c.id AND sc.status = 'active'
    LEFT JOIN physics.material_batches mb ON mb.chapter_id = c.id
    LEFT JOIN physics.source_files sf ON sf.batch_id = mb.id
    WHERE c.id::text = ${id}
    GROUP BY c.id, co.code
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

  const row = rows[0] as Omit<
    ChapterRow,
    "material_batch_count" | "source_file_count"
  >;
  return mapChapter({
    ...row,
    course_code: null,
    number_label: null,
    subchapter_count: 0,
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
      mb.subchapter_id::text,
      sc.number_label AS subchapter_number_label,
      sc.title AS subchapter_title,
      mb.source_type,
      mb.label,
      mb.lesson_date::text,
      mb.notes,
      mb.status,
      mb.created_at::text,
      mb.updated_at::text,
      COUNT(sf.id)::text AS source_file_count
    FROM physics.material_batches mb
    LEFT JOIN physics.subchapters sc ON sc.id = mb.subchapter_id
    LEFT JOIN physics.source_files sf ON sf.batch_id = mb.id
    WHERE mb.chapter_id::text = ${chapterId}
    GROUP BY mb.id, sc.id
    ORDER BY mb.created_at DESC
  `;

  return (rows as MaterialBatchRow[]).map(mapMaterialBatch);
}

export async function createMaterialBatch(input: {
  chapterId: string;
  subchapterId?: string | null;
  sourceType: MaterialSourceType;
  label?: string;
  lessonDate?: string;
  notes?: string;
}): Promise<PhysicsMaterialBatch> {
  const sql = getSql();
  const subchapterId = input.subchapterId || null;
  const label = input.label?.trim() || null;
  const lessonDate = input.lessonDate?.trim() || null;
  const notes = input.notes?.trim() || null;

  const rows = await sql`
    INSERT INTO physics.material_batches (
      chapter_id,
      subchapter_id,
      source_type,
      label,
      lesson_date,
      notes
    )
    VALUES (
      ${input.chapterId}::uuid,
      ${subchapterId}::uuid,
      ${input.sourceType},
      ${label},
      ${lessonDate},
      ${notes}
    )
    RETURNING
      id::text,
      chapter_id::text,
      subchapter_id::text,
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
  let subchapterNumberLabel: string | null = null;
  let subchapterTitle: string | null = null;

  if (subchapterId) {
    const subchapterRows = await sql`
      SELECT number_label, title
      FROM physics.subchapters
      WHERE id::text = ${subchapterId}
      LIMIT 1
    `;
    const subchapter = subchapterRows[0] as
      | { number_label: string; title: string }
      | undefined;
    subchapterNumberLabel = subchapter?.number_label ?? null;
    subchapterTitle = subchapter?.title ?? null;
  }

  return mapMaterialBatch({
    ...row,
    subchapter_number_label: subchapterNumberLabel,
    subchapter_title: subchapterTitle,
    source_file_count: 0,
  });
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
