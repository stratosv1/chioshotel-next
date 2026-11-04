import { NextRequest, NextResponse } from "next/server";
import { retryFailedEmailSyncs } from "@/lib/crm/booking-email-sync";
import { reconcileCancellations } from "@/lib/crm/cancellation-check";
import { runDueEmails } from "@/lib/crm/guest-emails";
import { runOutreachFollowUps } from "@/lib/crm/ota-outreach";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// A failed housekeeping step must never stop the guest emails.
async function housekeeping<T>(step: () => Promise<T>) {
  try {
    return await step();
  } catch (error) {
    console.error("crm morning housekeeping failed", error);
    return null;
  }
}

// Morning run, plus ?run=evening for the breakfast reminder. Sends nothing
// while every type is off.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const evening = request.nextUrl.searchParams.get("run") === "evening";
    // Cancellations first, so nothing is sent to a guest who has already cancelled.
    const cancellations = evening ? null : await housekeeping(reconcileCancellations);
    const emailSync = evening ? null : await housekeeping(retryFailedEmailSyncs);
    const emails = await runDueEmails(evening ? "evening" : "morning");
    const followUps = evening ? null : await runOutreachFollowUps();
    return NextResponse.json({ ok: true, ...emails, followUps, cancellations, emailSync });
  } catch (error) {
    console.error("crm guest emails cron failed", error);
    return NextResponse.json({ ok: false, error: "Run failed" }, { status: 500 });
  }
}
