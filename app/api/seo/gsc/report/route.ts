import { NextRequest, NextResponse } from "next/server";
import { getGscCoverageState, getGscEvaluationReport } from "@/lib/gsc/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  const days = Number(request.nextUrl.searchParams.get("days") || 28);
  const searchType = request.nextUrl.searchParams.get("type") || "web";

  try {
    const [coverage, report] = await Promise.all([
      getGscCoverageState(siteUrl),
      getGscEvaluationReport(siteUrl, days, searchType),
    ]);
    return NextResponse.json({ ok: true, coverage, report });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
