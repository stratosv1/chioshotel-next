import { neon } from "@neondatabase/serverless";

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

export async function upsertOfficialSourceRange(input: {
  documentId: string;
  subchapterId: string;
  filePageFrom: number;
  filePageTo: number;
}) {
  const sql = getSql();
  const filePageFrom = Math.floor(input.filePageFrom);
  const filePageTo = Math.floor(input.filePageTo);
  if (!Number.isInteger(filePageFrom) || !Number.isInteger(filePageTo) || filePageFrom < 1 || filePageTo < filePageFrom) {
    throw new Error("Μη έγκυρο official PDF range.");
  }

  const rows = await sql`
    SELECT
      sd.page_count,
      sc.chapter_id::text AS chapter_id
    FROM physics.source_documents sd
    JOIN physics.subchapters sc ON sc.id::text = ${input.subchapterId}
    JOIN physics.chapters c
      ON c.id = sc.chapter_id
     AND c.course_id = sd.course_id
    WHERE sd.id::text = ${input.documentId}
      AND sd.source_kind = 'school_book'
      AND sd.status = 'ready'
      AND sc.status = 'active'
      AND c.status = 'active'
    LIMIT 1
  `;
  if (rows.length === 0) {
    throw new Error("Το σχολικό PDF και το υποκεφάλαιο δεν ανήκουν στο ίδιο μάθημα.");
  }

  const pageCount = Number((rows[0] as any).page_count || 0);
  if (pageCount > 0 && filePageTo > pageCount) {
    throw new Error(`Το σχολικό PDF έχει ${pageCount} PDF σελίδες.`);
  }
  const chapterId = String((rows[0] as any).chapter_id);

  const existing = await sql`
    SELECT id::text, file_page_from, file_page_to
    FROM physics.source_ranges
    WHERE document_id::text = ${input.documentId}
      AND subchapter_id::text = ${input.subchapterId}
    ORDER BY created_at ASC
    LIMIT 1
  `;

  let rangeId: string;
  let changed = true;
  if (existing.length > 0) {
    rangeId = String((existing[0] as any).id);
    changed =
      Number((existing[0] as any).file_page_from) !== filePageFrom ||
      Number((existing[0] as any).file_page_to) !== filePageTo;
    await sql`
      UPDATE physics.source_ranges
      SET chapter_id = ${chapterId}::uuid,
          file_page_from = ${filePageFrom},
          file_page_to = ${filePageTo},
          printed_page_from = NULL,
          printed_page_to = NULL
      WHERE id::text = ${rangeId}
    `;
  } else {
    const inserted = await sql`
      INSERT INTO physics.source_ranges (
        document_id, chapter_id, subchapter_id,
        file_page_from, file_page_to,
        printed_page_from, printed_page_to, created_at
      ) VALUES (
        ${input.documentId}::uuid, ${chapterId}::uuid, ${input.subchapterId}::uuid,
        ${filePageFrom}, ${filePageTo}, NULL, NULL, NOW()
      )
      RETURNING id::text
    `;
    rangeId = String((inserted[0] as any).id);
  }

  if (changed) {
    await sql`
      UPDATE physics.source_analyses
      SET status = 'superseded', updated_at = NOW()
      WHERE subchapter_id::text = ${input.subchapterId}
        AND source_role = 'official'
        AND status <> 'superseded'
    `;
    await sql`
      UPDATE physics.subchapter_intelligence_versions
      SET status = 'superseded', updated_at = NOW()
      WHERE subchapter_id::text = ${input.subchapterId}
        AND status <> 'superseded'
    `;
  }

  return { rangeId, changed, chapterId };
}
