import { NextRequest, NextResponse } from "next/server";
import { syncGa4OrganicSearch } from "@/lib/ga4/sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isAuthorized(request: NextRequest) {
  if (request.headers.get("user-agent") === "vercel-cron/1.0") return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const authorization = request.headers.get("authorization") || "";
  return authorization === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();
  console.info("[ga4-sync] start", {
    host: request.headers.get("host"),
    userAgent: request.headers.get("user-agent"),
  });

  try {
    const result = await syncGa4OrganicSearch(request, {
      startDate: request.nextUrl.searchParams.get("start") || undefined,
      endDate: request.nextUrl.searchParams.get("end") || undefined,
    });
    console.info("[ga4-sync] success", { durationMs: Date.now() - startedAt, ...result });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[ga4-sync] failed", {
      durationMs: Date.now() - startedAt,
      message,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
