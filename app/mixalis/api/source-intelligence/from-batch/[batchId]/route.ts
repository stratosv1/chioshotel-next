import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { createAnalysesFromConfirmedSegmentation } from "@/lib/mixalis/source-intelligence";

export const runtime = "nodejs";
export const maxDuration = 60;

const DIRECT_MAPPING_MODEL = "direct-subchapter-v1";
const DEFAULT_PHYSICS_ANALYSIS_MODEL = "gpt-5.6";

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url), 303);
}

function ensurePhysicsAnalysisModel() {
  if (!process.env.PHYSICS_ANALYSIS_MODEL?.trim()) {
    process.env.PHYSICS_ANALYSIS_MODEL = DEFAULT_PHYSICS_ANALYSIS_MODEL;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ batchId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return redirectTo(request, "/mixalis/login");

  const { batchId } = await params;

  try {
    const sql = getSql();
    ensurePhysicsAnalysisModel();

    const batches = await sql`
      SELECT
        mb.id::text AS batch_id,
        mb.chapter_id::text AS chapter_id,
        mb.subchapter_id::text AS subchapter_id,
        sc.number_label AS subchapter_number_label,
        sc.title AS subchapter_title,
        COUNT(sf.id)::int AS source_file_count
      FROM physics.material_batches mb
      JOIN physics.subchapters sc
        ON sc.id = mb.subchapter_id
       AND sc.chapter_id = mb.chapter_id
      LEFT JOIN physics.source_files sf ON sf.batch_id = mb.id
      WHERE mb.id::text = ${batchId}
        AND mb.subchapter_id IS NOT NULL
      GROUP BY mb.id, sc.id
      LIMIT 1
    `;

    if (batches.length === 0) {
      throw new Error("Direct subchapter material batch not found.");
    }

    const batch = batches[0] as any;
    if (Number(batch.source_file_count) <= 0) {
      throw new Error("The material batch has no uploaded source files.");
    }

    const existingRuns = await sql`
      SELECT id::text
      FROM physics.source_segmentation_runs
      WHERE batch_id::text = ${batchId}
        AND chapter_id::text = ${String(batch.chapter_id)}
        AND model = ${DIRECT_MAPPING_MODEL}
        AND status = 'confirmed'
      ORDER BY confirmed_at DESC NULLS LAST, created_at DESC
      LIMIT 1
    `;

    let runId: string;

    if (existingRuns.length > 0) {
      runId = String(existingRuns[0].id);
    } else {
      const insertedRuns = await sql`
        INSERT INTO physics.source_segmentation_runs (
          batch_id,
          chapter_id,
          status,
          model,
          completed_at,
          confirmed_at
        )
        VALUES (
          ${batchId}::uuid,
          ${String(batch.chapter_id)}::uuid,
          'confirmed',
          ${DIRECT_MAPPING_MODEL},
          NOW(),
          NOW()
        )
        RETURNING id::text
      `;
      runId = String(insertedRuns[0].id);
    }

    const reason = `Direct upload scoped by the user to ${String(batch.subchapter_number_label)} — ${String(batch.subchapter_title)}.`;

    await sql`
      INSERT INTO physics.source_file_subchapter_links (
        run_id,
        batch_id,
        chapter_id,
        source_file_id,
        subchapter_id,
        relation,
        confidence,
        reason,
        assignment_source,
        status
      )
      SELECT
        ${runId}::uuid,
        mb.id,
        mb.chapter_id,
        sf.id,
        mb.subchapter_id,
        'primary',
        1,
        ${reason},
        'manual',
        'confirmed'
      FROM physics.material_batches mb
      JOIN physics.source_files sf ON sf.batch_id = mb.id
      WHERE mb.id::text = ${batchId}
        AND mb.subchapter_id IS NOT NULL
      ON CONFLICT (run_id, source_file_id, subchapter_id)
      DO UPDATE SET
        relation = 'primary',
        confidence = 1,
        reason = EXCLUDED.reason,
        assignment_source = 'manual',
        status = 'confirmed',
        updated_at = NOW()
    `;

    const analyses = await createAnalysesFromConfirmedSegmentation(runId);
    if (analyses.length !== 1) {
      throw new Error("Expected exactly one direct subchapter Source Intelligence analysis.");
    }

    return redirectTo(request, `/mixalis/source-intelligence/${analyses[0].id}`);
  } catch (error) {
    console.error("Mixalis direct Source Intelligence failed", error);
    return redirectTo(request, `/mixalis?error=source-intelligence-create`);
  }
}
