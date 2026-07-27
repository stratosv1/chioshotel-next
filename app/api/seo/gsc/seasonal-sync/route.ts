import { NextRequest, NextResponse } from "next/server";
import { syncSearchConsole } from "@/lib/gsc/sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isAuthorized(request: NextRequest) {
  if (request.headers.get("user-agent") === "vercel-cron/1.0") return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return (request.headers.get("authorization") || "") === `Bearer ${secret}`;
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function subtractDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() - days);
  return copy;
}

function previousYear(date: Date) {
  const copy = new Date(date);
  copy.setUTCFullYear(copy.getUTCFullYear() - 1);
  return copy;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const latestStableReference = subtractDays(new Date(), 2);
  const yearAgoEnd = previousYear(latestStableReference);
  const yearAgoStart = subtractDays(yearAgoEnd, 41);

  try {
    const result = await syncSearchConsole(request, {
      siteUrl: "sc-domain:chioshotel.gr",
      startDate: isoDate(yearAgoStart),
      endDate: isoDate(yearAgoEnd),
      searchTypes: ["web"],
    });

    return NextResponse.json({
      ...result,
      purpose: "seasonal-year-over-year-window",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
