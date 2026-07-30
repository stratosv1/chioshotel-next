import { NextRequest, NextResponse } from "next/server";
import { updateSeoAdvisorActionStatus } from "@/lib/gsc/advisor-actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED = new Set(["recommended", "implemented", "dismissed"]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const actionKey = typeof body?.actionKey === "string" ? body.actionKey.trim() : "";
    const status = typeof body?.status === "string" ? body.status.trim() : "";
    if (!actionKey || !ALLOWED.has(status)) {
      return NextResponse.json({ ok: false, error: "Invalid action update" }, { status: 400 });
    }

    const updated = await updateSeoAdvisorActionStatus(
      actionKey,
      status as "recommended" | "implemented" | "dismissed",
    );
    if (!updated) {
      return NextResponse.json({ ok: false, error: "Action not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, actionKey, status });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
