import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { sanitizeDoc } from "@/lib/mixalis/drive/progress";
import { loadProgress, saveProgress } from "@/lib/mixalis/drive/progress-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 600_000;

export async function GET() {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const doc = await loadProgress(session.sub);
    return NextResponse.json(doc, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("drive progress load failed", error);
    return NextResponse.json({ error: "load failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const text = await request.text();
  if (text.length > MAX_BODY) return NextResponse.json({ error: "Too large" }, { status: 413 });

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }
  const doc = sanitizeDoc(body);
  if (!doc) return NextResponse.json({ error: "Bad progress" }, { status: 400 });

  const replace = new URL(request.url).searchParams.get("reset") === "1";
  try {
    const merged = await saveProgress(session.sub, doc, replace);
    return NextResponse.json(merged, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("drive progress save failed", error);
    return NextResponse.json({ error: "save failed" }, { status: 500 });
  }
}
