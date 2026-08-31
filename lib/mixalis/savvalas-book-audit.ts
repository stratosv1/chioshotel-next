import { neon } from "@neondatabase/serverless";
import type { PhysicsCourseCode } from "@/lib/mixalis/source-documents";

export type SavvalasRangeState = {
  id: string;
  filePageFrom: number;
  filePageTo: number;
  analysisId: string | null;
  analysisStatus: string | null;
  itemCount: number;
  updatedAt: string | null;
};

export type SavvalasAuditSubchapter = {
  id: string;
  numberLabel: string;
  title: string;
  sortOrder: number;
  range: SavvalasRangeState | null;
};

export type SavvalasAuditChapter = {
  id: string;
  numberLabel: string | null;
  title: string;
  sortOrder: number;
  subchapters: SavvalasAuditSubchapter[];
};

export type SavvalasAuditBook = {
  documentId: string;
  courseCode: PhysicsCourseCode;
  courseTitle: string;
  title: string;
  originalName: string | null;
  pageCount: number | null;
  sizeBytes: number | null;
  chapters: SavvalasAuditChapter[];
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

export async function hasSavvalasSourceRange(
  documentId: string,
  subchapterId: string,
) {
  const sql = getSql();
  const rows = await sql`
    SELECT 1
    FROM physics.source_ranges
    WHERE document_id::text = ${documentId}
      AND subchapter_id::text = ${subchapterId}
    LIMIT 1
  `;
  return rows.length > 0;
}

export async function listSavvalasAuditBooks(): Promise<SavvalasAuditBook[]> {
  const sql = getSql();
  const documents = await sql`
    SELECT
      sd.id::text AS document_id,
      sd.course_id::text AS course_id,
      co.code AS course_code,
      co.title AS course_title,
      sd.title,
      sd.original_name,
      sd.page_count,
      sd.size_bytes
    FROM physics.source_documents sd
    JOIN physics.courses co ON co.id = sd.course_id
    WHERE sd.source_kind = 'savvalas_book'
      AND sd.status = 'ready'
      AND co.status = 'active'
    ORDER BY co.sort_order ASC
  `;

  const books: SavvalasAuditBook[] = [];

  for (const document of documents as any[]) {
    const rows = await sql`
      SELECT
        c.id::text AS chapter_id,
        c.number_label AS chapter_number_label,
        c.title AS chapter_title,
        c.sort_order AS chapter_sort_order,
        sc.id::text AS subchapter_id,
        sc.number_label AS subchapter_number_label,
        sc.title AS subchapter_title,
        sc.sort_order AS subchapter_sort_order,
        sr.id::text AS range_id,
        sr.file_page_from,
        sr.file_page_to,
        sr.created_at::text AS range_updated_at,
        latest_analysis.id::text AS analysis_id,
        latest_analysis.status AS analysis_status,
        COALESCE(latest_analysis.item_count, 0)::text AS item_count
      FROM physics.chapters c
      JOIN physics.subchapters sc
        ON sc.chapter_id = c.id
       AND sc.status = 'active'
      LEFT JOIN physics.source_ranges sr
        ON sr.document_id = ${String(document.document_id)}::uuid
       AND sr.chapter_id = c.id
       AND sr.subchapter_id = sc.id
      LEFT JOIN LATERAL (
        SELECT
          a.id,
          a.status,
          (
            SELECT COUNT(*)
            FROM physics.intelligence_items ii
            WHERE ii.analysis_id = a.id
              AND ii.status = 'active'
          ) AS item_count
        FROM physics.source_analyses a
        WHERE a.source_range_id = sr.id
          AND a.source_kind = 'source_range'
          AND a.source_role = 'depth'
        ORDER BY a.created_at DESC
        LIMIT 1
      ) latest_analysis ON true
      WHERE c.course_id = ${String(document.course_id)}::uuid
        AND c.status = 'active'
      ORDER BY c.sort_order ASC, c.number_label ASC, sc.sort_order ASC, sc.number_label ASC
    `;

    const chapterMap = new Map<string, SavvalasAuditChapter>();
    for (const row of rows as any[]) {
      const chapterId = String(row.chapter_id);
      let chapter = chapterMap.get(chapterId);
      if (!chapter) {
        chapter = {
          id: chapterId,
          numberLabel: row.chapter_number_label ? String(row.chapter_number_label) : null,
          title: String(row.chapter_title),
          sortOrder: Number(row.chapter_sort_order ?? 0),
          subchapters: [],
        };
        chapterMap.set(chapterId, chapter);
      }

      chapter.subchapters.push({
        id: String(row.subchapter_id),
        numberLabel: String(row.subchapter_number_label),
        title: String(row.subchapter_title),
        sortOrder: Number(row.subchapter_sort_order ?? 0),
        range: row.range_id
          ? {
              id: String(row.range_id),
              filePageFrom: Number(row.file_page_from),
              filePageTo: Number(row.file_page_to),
              analysisId: row.analysis_id ? String(row.analysis_id) : null,
              analysisStatus: row.analysis_status ? String(row.analysis_status) : null,
              itemCount: Number(row.item_count ?? 0),
              updatedAt: row.range_updated_at ? String(row.range_updated_at) : null,
            }
          : null,
      });
    }

    books.push({
      documentId: String(document.document_id),
      courseCode: document.course_code as PhysicsCourseCode,
      courseTitle: String(document.course_title),
      title: String(document.title),
      originalName: document.original_name ? String(document.original_name) : null,
      pageCount: document.page_count == null ? null : Number(document.page_count),
      sizeBytes: document.size_bytes == null ? null : Number(document.size_bytes),
      chapters: Array.from(chapterMap.values()),
    });
  }

  return books;
}

export async function upsertSavvalasSourceRange(input: {
  documentId: string;
  subchapterId: string;
  filePageFrom: number;
  filePageTo: number;
}) {
  const sql = getSql();
  const filePageFrom = Math.floor(input.filePageFrom);
  const filePageTo = Math.floor(input.filePageTo);

  if (!Number.isInteger(filePageFrom) || !Number.isInteger(filePageTo)) {
    throw new Error("Οι σελίδες πρέπει να είναι ακέραιοι αριθμοί.");
  }
  if (filePageFrom < 1 || filePageTo < filePageFrom) {
    throw new Error("Μη έγκυρο εύρος PDF σελίδων.");
  }

  const rows = await sql`
    SELECT
      sd.id::text AS document_id,
      sd.course_id::text AS course_id,
      sd.page_count,
      sc.id::text AS subchapter_id,
      sc.chapter_id::text AS chapter_id
    FROM physics.source_documents sd
    JOIN physics.subchapters sc ON sc.id::text = ${input.subchapterId}
    JOIN physics.chapters c
      ON c.id = sc.chapter_id
     AND c.course_id = sd.course_id
    WHERE sd.id::text = ${input.documentId}
      AND sd.source_kind = 'savvalas_book'
      AND sd.status = 'ready'
      AND c.status = 'active'
      AND sc.status = 'active'
    LIMIT 1
  `;

  if (rows.length === 0) {
    throw new Error("Το βιβλίο και το υποκεφάλαιο δεν ανήκουν στο ίδιο μάθημα.");
  }

  const context = rows[0] as any;
  const pageCount = context.page_count == null ? null : Number(context.page_count);
  if (pageCount != null && filePageTo > pageCount) {
    throw new Error(`Το βιβλίο έχει ${pageCount} PDF σελίδες.`);
  }

  const existing = await sql`
    SELECT id::text, file_page_from, file_page_to
    FROM physics.source_ranges
    WHERE document_id::text = ${input.documentId}
      AND subchapter_id::text = ${input.subchapterId}
    ORDER BY created_at ASC
    LIMIT 1
  `;

  if (existing.length > 0) {
    const rangeId = String(existing[0].id);
    const changed =
      Number(existing[0].file_page_from) !== filePageFrom ||
      Number(existing[0].file_page_to) !== filePageTo;

    await sql`
      UPDATE physics.source_ranges
      SET
        chapter_id = ${String(context.chapter_id)}::uuid,
        file_page_from = ${filePageFrom},
        file_page_to = ${filePageTo},
        printed_page_from = NULL,
        printed_page_to = NULL
      WHERE id::text = ${rangeId}
    `;

    if (changed) {
      await sql`
        UPDATE physics.source_analyses
        SET status = 'superseded', updated_at = NOW()
        WHERE source_range_id::text = ${rangeId}
          AND source_kind = 'source_range'
          AND source_role = 'depth'
          AND status <> 'superseded'
      `;
    }

    return { rangeId, changed };
  }

  const inserted = await sql`
    INSERT INTO physics.source_ranges (
      document_id,
      chapter_id,
      subchapter_id,
      file_page_from,
      file_page_to,
      printed_page_from,
      printed_page_to,
      created_at
    ) VALUES (
      ${input.documentId}::uuid,
      ${String(context.chapter_id)}::uuid,
      ${input.subchapterId}::uuid,
      ${filePageFrom},
      ${filePageTo},
      NULL,
      NULL,
      NOW()
    )
    RETURNING id::text
  `;

  return { rangeId: String(inserted[0].id), changed: true };
}
