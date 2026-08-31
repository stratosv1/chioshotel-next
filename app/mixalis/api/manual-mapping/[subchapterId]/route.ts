import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { assertSavvalasRangeIntegrity } from "@/lib/mixalis/savvalas-range-integrity";
import { assertOfficialRangeIntegrity } from "@/lib/mixalis/official-range-integrity";
import { upsertSavvalasSourceRange } from "@/lib/mixalis/savvalas-book-audit";
import { upsertOfficialSourceRange } from "@/lib/mixalis/official-source-range";

export const runtime = "nodejs";

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

function positiveInteger(value: unknown) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ subchapterId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subchapterId } = await params;
  try {
    const body = await request.json().catch(() => null);
    const savvalasFrom = positiveInteger(body?.savvalasFrom);
    const savvalasTo = positiveInteger(body?.savvalasTo);
    const officialFrom = positiveInteger(body?.officialFrom);
    const officialTo = positiveInteger(body?.officialTo);

    if (savvalasFrom == null || savvalasTo == null || officialFrom == null || officialTo == null) {
      return NextResponse.json(
        { error: "Συμπλήρωσε και τα 4 πεδία με ORIGINAL PDF σελίδες." },
        { status: 400 },
      );
    }
    if (savvalasTo < savvalasFrom || officialTo < officialFrom) {
      return NextResponse.json({ error: "Η σελίδα «έως» δεν μπορεί να είναι μικρότερη από τη σελίδα «από»." }, { status: 400 });
    }

    const sql = getSql();
    const rows = await sql`
      SELECT
        sc.id::text AS subchapter_id,
        sc.chapter_id::text AS chapter_id,
        c.course_id::text AS course_id,
        sav.id::text AS savvalas_document_id,
        sav.page_count AS savvalas_page_count,
        off.id::text AS official_document_id,
        off.page_count AS official_page_count
      FROM physics.subchapters sc
      JOIN physics.chapters c ON c.id = sc.chapter_id
      LEFT JOIN LATERAL (
        SELECT sd.id, sd.page_count
        FROM physics.source_documents sd
        WHERE sd.course_id = c.course_id
          AND sd.source_kind = 'savvalas_book'
          AND sd.status = 'ready'
        ORDER BY sd.updated_at DESC NULLS LAST, sd.created_at DESC
        LIMIT 1
      ) sav ON true
      LEFT JOIN LATERAL (
        SELECT sd.id, sd.page_count
        FROM physics.source_documents sd
        WHERE sd.course_id = c.course_id
          AND sd.source_kind = 'school_book'
          AND sd.status = 'ready'
        ORDER BY sd.updated_at DESC NULLS LAST, sd.created_at DESC
        LIMIT 1
      ) off ON true
      WHERE sc.id::text = ${subchapterId}
        AND sc.status = 'active'
        AND c.status = 'active'
      LIMIT 1
    `;

    if (!rows.length) return NextResponse.json({ error: "Το υποκεφάλαιο δεν βρέθηκε." }, { status: 404 });
    const row = rows[0] as any;
    if (!row.savvalas_document_id || !row.official_document_id) {
      return NextResponse.json(
        { error: "Πρέπει να υπάρχουν αποθηκευμένα και έτοιμα PDF για Σαββάλα και επίσημο σχολικό βιβλίο." },
        { status: 409 },
      );
    }

    const savvalasDocumentId = String(row.savvalas_document_id);
    const officialDocumentId = String(row.official_document_id);

    // Manual mapping is authoritative. AI page detection is intentionally not used here.
    await assertSavvalasRangeIntegrity({
      documentId: savvalasDocumentId,
      subchapterId,
      filePageFrom: savvalasFrom,
      filePageTo: savvalasTo,
    });
    await assertOfficialRangeIntegrity({
      documentId: officialDocumentId,
      subchapterId,
      filePageFrom: officialFrom,
      filePageTo: officialTo,
    });

    const savvalas = await upsertSavvalasSourceRange({
      documentId: savvalasDocumentId,
      subchapterId,
      filePageFrom: savvalasFrom,
      filePageTo: savvalasTo,
    });
    const official = await upsertOfficialSourceRange({
      documentId: officialDocumentId,
      subchapterId,
      filePageFrom: officialFrom,
      filePageTo: officialTo,
    });

    if (savvalas.changed && !official.changed) {
      await sql`
        UPDATE physics.subchapter_intelligence_versions
        SET status = 'superseded', updated_at = NOW()
        WHERE subchapter_id::text = ${subchapterId}
          AND status <> 'superseded'
      `;
    }

    return NextResponse.json({
      saved: true,
      changed: savvalas.changed || official.changed,
      savvalas: { rangeId: savvalas.rangeId, from: savvalasFrom, to: savvalasTo },
      official: { rangeId: official.rangeId, from: officialFrom, to: officialTo },
    });
  } catch (error) {
    console.error("Mixalis manual PDF mapping failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Αποτυχία αποθήκευσης manual mapping." },
      { status: 409 },
    );
  }
}
