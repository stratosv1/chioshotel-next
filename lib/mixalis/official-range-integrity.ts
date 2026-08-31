import { neon } from "@neondatabase/serverless";

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

export async function assertOfficialRangeIntegrity(input: {
  documentId: string;
  subchapterId: string;
  filePageFrom: number;
  filePageTo: number;
}) {
  if (input.filePageFrom < 1 || input.filePageTo < input.filePageFrom) {
    throw new Error("Μη έγκυρο official PDF range.");
  }

  const sql = getSql();
  const documentRows = await sql`
    SELECT sd.page_count
    FROM physics.source_documents sd
    WHERE sd.id::text = ${input.documentId}
      AND sd.source_kind = 'school_book'
      AND sd.status = 'ready'
    LIMIT 1
  `;

  if (documentRows.length === 0) {
    throw new Error("Το ενεργό επίσημο σχολικό PDF δεν βρέθηκε.");
  }

  const pageCount = Number((documentRows[0] as any).page_count ?? 0);
  if (pageCount > 0 && input.filePageTo > pageCount) {
    throw new Error(`Το σχολικό PDF έχει ${pageCount} PDF σελίδες.`);
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
      `Το official PDF range ${input.filePageFrom}–${input.filePageTo} επικαλύπτεται με το ${String(overlap.number_label)} ${String(overlap.title)} (PDF ${Number(overlap.file_page_from)}–${Number(overlap.file_page_to)}). Έλεγξε τα όρια πριν το αποθηκεύσεις.`,
    );
  }
}
