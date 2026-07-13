import { NextRequest, NextResponse } from "next/server";
import {
  finishBookingCacheSync,
  listRecentlyUsedBookingSearches,
  startBookingCacheSync,
} from "@/lib/booking-search-cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret && request.headers.get("authorization") === `Bearer ${secret}`);
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const syncId = await startBookingCacheSync();
  let updated = 0;

  try {
    const searches = await listRecentlyUsedBookingSearches(80);

    for (const item of searches) {
      const url = new URL("/api/booking/search-range", request.nextUrl.origin);
      url.searchParams.set("checkin", item.checkin);
      url.searchParams.set("checkout", item.checkout);
      url.searchParams.set("guests", String(item.guests));
      url.searchParams.set("refresh", "1");

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
        cache: "no-store",
      });

      if (response.ok) updated += 1;
    }

    await finishBookingCacheSync(syncId || "", "success", updated);
    return NextResponse.json({ ok: true, checked: searches.length, updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown cache refresh error";
    await finishBookingCacheSync(syncId || "", "failed", updated, message);
    return NextResponse.json({ ok: false, updated, error: message }, { status: 500 });
  }
}
