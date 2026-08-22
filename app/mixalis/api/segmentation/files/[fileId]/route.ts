import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { getSourceFileForPrivateView } from "@/lib/mixalis/source-segmentation";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileId } = await params;
  const file = await getSourceFileForPrivateView(fileId);
  if (!file) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = await get(file.storageKey, { access: "private" });
  if (!result || result.statusCode !== 200) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new Response(result.stream, {
    status: 200,
    headers: {
      "Content-Type": file.contentType || result.blob.contentType || "application/octet-stream",
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
