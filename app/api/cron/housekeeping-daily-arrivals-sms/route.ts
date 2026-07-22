import { NextRequest, NextResponse } from "next/server";
import { GET as runHousekeepingSms } from "../../staff/housekeeping/daily-arrivals-sms/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (request.headers.get("user-agent") !== "vercel-cron/1.0") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const cronUrl = request.nextUrl.clone();
  cronUrl.searchParams.delete("force");

  const cronRequest = new NextRequest(cronUrl, {
    method: "GET",
    headers: request.headers,
  });

  return runHousekeepingSms(cronRequest);
}
