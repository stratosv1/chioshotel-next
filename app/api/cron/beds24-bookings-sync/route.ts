import { NextRequest } from "next/server";
import { GET as runBeds24BookingsSync } from "@/app/api/staff/calendar/sync/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  return runBeds24BookingsSync(request);
}
