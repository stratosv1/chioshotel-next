import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { runSourceSegmentation } from "@/lib/mixalis/source-segmentation-ai";

export const runtime = "nodejs";
export const maxDuration = 300;

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url), 303);
}

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

async function getActiveRun(batchId: string, chapterId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT id::text
    FROM physics.source_segmentation_runs
    WHERE batch_id::text = ${batchId}
      AND chapter_id::text = ${chapterId}
      AND status = 'processing'
      AND created_at > NOW() - INTERVAL '10 minutes'
    ORDER BY created_at DESC
    LIMIT 1
  `;

  return rows.length > 0 ? String(rows[0].id) : null;
}

async function getLatestRelevantRun(batchId: string, chapterId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT
      id::text,
      status,
      created_at::text,
      completed_at::text,
      confirmed_at::text
    FROM physics.source_segmentation_runs
    WHERE batch_id::text = ${batchId}
      AND chapter_id::text = ${chapterId}
    ORDER BY
      CASE WHEN status = 'confirmed' THEN 0 ELSE 1 END,
      created_at DESC
    LIMIT 1
  `;

  if (rows.length === 0) return null;

  return {
    id: String(rows[0].id),
    status: String(rows[0].status),
    createdAt: rows[0].created_at ? String(rows[0].created_at) : null,
    completedAt: rows[0].completed_at ? String(rows[0].completed_at) : null,
    confirmedAt: rows[0].confirmed_at ? String(rows[0].confirmed_at) : null,
  };
}

export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; batchId: string }>;
  },
) {
  const session = await getMixalisSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, batchId } = await params;

  try {
    const run = await getLatestRelevantRun(batchId, id);
    return NextResponse.json({ run });
  } catch (error) {
    console.error("Mixalis segmentation status failed", error);
    return NextResponse.json(
      { error: "Could not load segmentation status." },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; batchId: string }>;
  },
) {
  const session = await getMixalisSession();
  if (!session) return redirectTo(request, "/mixalis/login");

  const { id, batchId } = await params;

  try {
    const existingRun = await getLatestRelevantRun(batchId, id);
    if (existingRun?.status === "confirmed") {
      return redirectTo(
        request,
        `/mixalis/chapters/${id}/segmentation/${existingRun.id}`,
      );
    }

    const activeRunId = await getActiveRun(batchId, id);
    if (activeRunId) {
      return redirectTo(
        request,
        `/mixalis/chapters/${id}/segmentation/${activeRunId}`,
      );
    }

    const result = await runSourceSegmentation({
      chapterId: id,
      batchId,
    });

    return redirectTo(
      request,
      `/mixalis/chapters/${id}/segmentation/${result.runId}`,
    );
  } catch (error) {
    console.error("Mixalis source segmentation failed", error);
    return redirectTo(
      request,
      `/mixalis/chapters/${id}?error=segmentation`,
    );
  }
}
