import { after, NextRequest, NextResponse } from "next/server";
import { kickCampaignQueue, runCampaignQueue } from "@/lib/crm/campaign-runner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Slow background sending of campaigns (see lib/crm/campaign-runner.ts).
// Called by the daily Vercel cron, by the staff page when a send starts,
// and by itself while emails are still waiting.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const run = await runCampaignQueue();
    if (run.more) after(() => kickCampaignQueue(request.nextUrl.origin));
    return NextResponse.json({ ok: true, ...run });
  } catch (error) {
    console.error("campaign queue failed", error);
    return NextResponse.json({ ok: false, error: "Campaign queue failed" }, { status: 500 });
  }
}
