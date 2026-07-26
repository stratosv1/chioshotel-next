import { NextRequest, NextResponse } from "next/server";
import { syncSearchConsole } from "@/lib/gsc/sync";

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

  try {
    const result = await syncSearchConsole(request, {
      siteUrl: request.nextUrl.searchParams.get("site") || undefined,
      startDate: request.nextUrl.searchParams.get("start") || undefined,
      endDate: request.nextUrl.searchParams.get("end") || undefined,
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
