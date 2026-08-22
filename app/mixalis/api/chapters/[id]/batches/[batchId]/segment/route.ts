import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { runSourceSegmentation } from "@/lib/mixalis/source-segmentation-ai";

export const runtime = "nodejs";
export const maxDuration = 300;

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url), 303);
}

async function getActiveRun(batchId: string, chapterId: string) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;

  const sql = neon(databaseUrl);
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
