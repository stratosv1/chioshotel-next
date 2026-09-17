import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { assertSavvalasRangeIntegrity } from "@/lib/mixalis/savvalas-range-integrity";
import { upsertSavvalasSourceRange } from "@/lib/mixalis/savvalas-book-audit";
import { saveExerciseSolution } from "@/lib/mixalis/exercise-solutions";
import {
  normalizeExerciseIdentifier,
  solveSavvalasExercise,
} from "@/lib/mixalis/savvalas-exercise-solver";

export const runtime = "nodejs";
export const maxDuration = 300;

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

function positiveInteger(value: unknown) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function saveSavvalasRange(subchapterId: string, filePageFrom: number, filePageTo: number) {
  const sql = getSql();
  const rows = await sql`
    SELECT sd.id::text AS document_id
    FROM physics.subchapters sc
    JOIN physics.chapters c ON c.id = sc.chapter_id
    JOIN LATERAL (
      SELECT source.id
      FROM physics.source_documents source
      WHERE source.course_id = c.course_id
        AND source.source_kind = 'savvalas_book'
        AND source.status = 'ready'
      ORDER BY source.updated_at DESC NULLS LAST, source.created_at DESC
      LIMIT 1
    ) sd ON true
    WHERE sc.id::text = ${subchapterId}
      AND sc.status = 'active'
      AND c.status = 'active'
    LIMIT 1
  `;
  if (rows.length === 0) throw new Error("Το ενεργό PDF του Σαββάλα δεν βρέθηκε.");

  const documentId = String(rows[0].document_id);
  await assertSavvalasRangeIntegrity({ documentId, subchapterId, filePageFrom, filePageTo });
  const saved = await upsertSavvalasSourceRange({ documentId, subchapterId, filePageFrom, filePageTo });

  if (saved.changed) {
    await sql`
      UPDATE physics.subchapter_intelligence_versions
      SET status = 'superseded', updated_at = NOW()
      WHERE subchapter_id::text = ${subchapterId}
        AND status <> 'superseded'
    `;
  }
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
    const exerciseIdentifier = normalizeExerciseIdentifier(body?.exerciseIdentifier);
    if (!exerciseIdentifier) {
      return NextResponse.json(
        { error: "Γράψε τον αριθμό της άσκησης όπως εμφανίζεται στον Σαββάλα." },
        { status: 400 },
      );
    }

    const savvalasFrom = positiveInteger(body?.savvalasFrom);
    const savvalasTo = positiveInteger(body?.savvalasTo);
    if (savvalasFrom == null || savvalasTo == null || savvalasTo < savvalasFrom) {
      return NextResponse.json(
        { error: "Συμπλήρωσε σωστά τις ORIGINAL PDF σελίδες του Σαββάλα." },
        { status: 400 },
      );
    }

    await saveSavvalasRange(subchapterId, savvalasFrom, savvalasTo);
    const solution = await solveSavvalasExercise(subchapterId, exerciseIdentifier);
    const savedSolution = await saveExerciseSolution({
      subchapterId,
      exerciseIdentifier: solution.exerciseLabel || exerciseIdentifier,
      solution,
    });
    return NextResponse.json({ solution, savedSolution });
  } catch (error) {
    console.error("Mixalis Savvalas exercise solve failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Η επίλυση της άσκησης απέτυχε." },
      { status: 500 },
    );
  }
}
