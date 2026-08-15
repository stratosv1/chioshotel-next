import { NextRequest, NextResponse } from "next/server";
import { runWeeklySeoHealth } from "@/lib/seo-health/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

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

  try {
    const result = await runWeeklySeoHealth(request, {
      siteUrl,
      limit: Number.isFinite(requestedLimit) && requestedLimit > 0 ? requestedLimit : undefined,
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[seo-health] weekly run failed", error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
