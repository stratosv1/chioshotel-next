import { NextRequest, NextResponse } from "next/server";
import { runAvailabilityWatchCheck } from "@/lib/ai-assistant/availability-watch";
import { bookingCoreSyncUrl } from "@/lib/booking-core/sync-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Daily safety net for Room Finder availability alerts. Alerts are also
// checked after every successful Booking Core sync; this run makes sure they
// are checked at least once a day even when nobody searches on the site.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // Refresh inventory first so the check sees today's cancellations.
  let sync = "skipped";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35_000);
    const response = await fetch(bookingCoreSyncUrl(request.nextUrl.origin), {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "application/json", Authorization: `Bearer ${secret}` },
    }).finally(() => clearTimeout(timeout));
    sync = response.ok ? "ok" : `http_${response.status}`;
  } catch (error) {
    sync = error instanceof Error && error.name === "AbortError" ? "timeout" : "failed";
  }

  try {
    const result = await runAvailabilityWatchCheck();
    console.info(JSON.stringify({ level: "info", msg: "ai_room_finder_watch_check", trigger: "cron", sync, ...result }));
    return NextResponse.json({ ok: true, sync, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("AI Room Finder availability watch cron failed", error);
    return NextResponse.json({ ok: false, sync, error: "Watch check failed" }, { status: 500 });
  }
}
