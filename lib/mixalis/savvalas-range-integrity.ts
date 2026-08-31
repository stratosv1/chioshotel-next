import { neon } from "@neondatabase/serverless";

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

export async function assertSavvalasRangeIntegrity(input: {
  documentId: string;
  subchapterId: string;
  filePageFrom: number;
  filePageTo: number;
}) {
  if (input.filePageFrom < 1 || input.filePageTo < input.filePageFrom) {
    throw new Error("Μη έγκυρο εύρος PDF σελίδων.");
  }

  const sql = getSql();
  const documentRows = await sql`
    SELECT sd.page_count, sd.course_id::text AS course_id
    FROM physics.source_documents sd
    WHERE sd.id::text = ${input.documentId}
      AND sd.source_kind = 'savvalas_book'
      AND sd.status = 'ready'
    LIMIT 1
  `;
  if (documentRows.length === 0) {
    throw new Error("Το ενεργό PDF του Σαββάλα δεν βρέθηκε.");
  }

  const pageCount = Number((documentRows[0] as any).page_count ?? 0);
  if (pageCount > 0 && input.filePageTo > pageCount) {
    throw new Error(`Το βιβλίο έχει ${pageCount} PDF σελίδες.`);
  }

  const overlaps = await sql`
    SELECT
      sr.file_page_from,
      sr.file_page_to,
      sc.number_label,
      sc.title
    FROM physics.source_ranges sr
    JOIN physics.subchapters sc ON sc.id = sr.subchapter_id
    WHERE sr.document_id::text = ${input.documentId}
      AND sr.subchapter_id::text <> ${input.subchapterId}
      AND sr.file_page_from <= ${input.filePageTo}
      AND sr.file_page_to >= ${input.filePageFrom}
    ORDER BY sr.file_page_from ASC
    LIMIT 1
  `;

  if (overlaps.length > 0) {
    const overlap = overlaps[0] as any;
    throw new Error(
      `Το PDF range ${input.filePageFrom}–${input.filePageTo} επικαλύπτεται με το ${String(overlap.number_label)} ${String(overlap.title)} (PDF ${Number(overlap.file_page_from)}–${Number(overlap.file_page_to)}). Διόρθωσε πρώτα τα όρια.`,
    );
  }
}
