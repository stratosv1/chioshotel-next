import { NextRequest, NextResponse } from "next/server";
import { runWeeklySeoHealth } from "@/lib/seo-health/engine";
import {
  markStaleSeoHealthRunsFailed,
  seedSeoUrlsFromLiveSitemap,
} from "@/lib/seo-health/full-audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const SAFE_DAILY_LIMIT = 180;

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const siteUrl = request.nextUrl.searchParams.get("site") || "sc-domain:chioshotel.gr";
  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") || 0);
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
    ? Math.min(240, Math.trunc(requestedLimit))
    : SAFE_DAILY_LIMIT;

  try {
    await markStaleSeoHealthRunsFailed();
    const sitemapSeeded = await seedSeoUrlsFromLiveSitemap();
    const result = await runWeeklySeoHealth(request, { siteUrl, limit });
    return NextResponse.json({ ...result, sitemapSeeded, distributedScan: true, scanLimit: limit });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[seo-health] distributed scan failed", error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
