import { NextRequest, NextResponse } from "next/server";
import { runDueEmails } from "@/lib/crm/guest-emails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Morning run for automated guest emails. Sends nothing while every type is off.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json({ ok: true, ...(await runDueEmails()) });
  } catch (error) {
    console.error("crm guest emails cron failed", error);
    return NextResponse.json({ ok: false, error: "Run failed" }, { status: 500 });
  }
}
