import { NextRequest, NextResponse } from "next/server";
import { runGa4404Report } from "@/lib/ga4/not-found-report";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isAuthorized(request: NextRequest) {
  if (process.env.VERCEL_ENV === "preview") return true;
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

  try {
    const result = await runGa4404Report(request, {
      startDate: request.nextUrl.searchParams.get("start") || undefined,
      endDate: request.nextUrl.searchParams.get("end") || undefined,
      hostName: request.nextUrl.searchParams.get("host") || undefined,
    });
    return NextResponse.json(result, {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[ga4-404-audit] failed", {
      message,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
