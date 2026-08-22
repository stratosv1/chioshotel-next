import { neon } from "@neondatabase/serverless";

export type PhysicsCourseCode = "general_education" | "orientation";

export type PhysicsSourceDocument = {
  id: string;
  courseId: string;
  courseCode: PhysicsCourseCode;
  courseTitle: string;
  title: string;
  sourceKind: string;
  originalName: string | null;
  contentType: string | null;
  sizeBytes: number | null;
  pageCount: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type SourceDocumentRow = {
  id: string;
  course_id: string;
  course_code: PhysicsCourseCode;
  course_title: string;
  title: string;
  source_kind: string;
  original_name: string | null;
  content_type: string | null;
  size_bytes: string | number | null;
  page_count: string | number | null;
  status: string;
  created_at: string;
  updated_at: string;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

function mapSourceDocument(row: SourceDocumentRow): PhysicsSourceDocument {
  return {
    id: row.id,
    courseId: row.course_id,
    courseCode: row.course_code,
    courseTitle: row.course_title,
    title: row.title,
    sourceKind: row.source_kind,
    originalName: row.original_name,
    contentType: row.content_type,
    sizeBytes: row.size_bytes == null ? null : Number(row.size_bytes),
    pageCount: row.page_count == null ? null : Number(row.page_count),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function isPhysicsCourseCode(value: string): value is PhysicsCourseCode {
  return value === "general_education" || value === "orientation";
}

export async function getCourseForSourceUpload(code: PhysicsCourseCode) {
  const sql = getSql();
  const rows = await sql`
    SELECT id::text, code, title
    FROM physics.courses
    WHERE code = ${code} AND status = 'active'
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  return rows[0] as { id: string; code: PhysicsCourseCode; title: string };
}

export async function listSchoolBookDocuments(): Promise<PhysicsSourceDocument[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      sd.id::text,
      sd.course_id::text,
      co.code AS course_code,
      co.title AS course_title,
      sd.title,
      sd.source_kind,
      sd.original_name,
      sd.content_type,
      sd.size_bytes,
      sd.page_count,
      sd.status,
      sd.created_at::text,
      sd.updated_at::text
    FROM physics.source_documents sd
    JOIN physics.courses co ON co.id = sd.course_id
    WHERE sd.source_kind = 'school_book'
      AND sd.status <> 'deleted'
    ORDER BY co.sort_order ASC, sd.created_at ASC
  `;

  return (rows as SourceDocumentRow[]).map(mapSourceDocument);
}

export async function registerSchoolBookDocument(input: {
  courseCode: PhysicsCourseCode;
  title: string;
  originalName: string;
  storageKey: string;
  contentType: string | null;
  sizeBytes: number | null;
  pageCount: number;
}) {
  const sql = getSql();
  const course = await getCourseForSourceUpload(input.courseCode);
  if (!course) throw new Error("Physics course not found.");

  const existingRows = await sql`
    SELECT id::text
    FROM physics.source_documents
    WHERE course_id = ${course.id}::uuid
      AND source_kind = 'school_book'
      AND status <> 'deleted'
    ORDER BY created_at ASC
    LIMIT 1
  `;

  if (existingRows.length > 0) {
    const existingId = String(existingRows[0].id);
    await sql`
      UPDATE physics.source_documents
      SET
        title = ${input.title},
        original_name = ${input.originalName.slice(0, 255)},
        storage_provider = 'vercel_blob',
        storage_key = ${input.storageKey},
        content_type = ${input.contentType},
        size_bytes = ${input.sizeBytes},
        page_count = ${input.pageCount},
        status = 'ready',
        updated_at = NOW()
      WHERE id = ${existingId}::uuid
    `;
    return existingId;
  }

  const rows = await sql`
    INSERT INTO physics.source_documents (
      course_id,
      title,
      source_kind,
      original_name,
      storage_provider,
      storage_key,
      content_type,
      size_bytes,
      page_count,
      status
    )
    VALUES (
      ${course.id}::uuid,
      ${input.title},
      'school_book',
      ${input.originalName.slice(0, 255)},
      'vercel_blob',
      ${input.storageKey},
      ${input.contentType},
      ${input.sizeBytes},
      ${input.pageCount},
      'ready'
    )
    RETURNING id::text
  `;

  return String(rows[0].id);
}
