import { NextRequest, NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { runSourceSegmentation } from "@/lib/mixalis/source-segmentation-ai";

export const runtime = "nodejs";
export const maxDuration = 300;

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url), 303);
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
