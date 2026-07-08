import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/staff/calendar/sync") {
    return NextResponse.json(
      {
        ok: true,
        fetched: 0,
        saved: 0,
        skipped: 0,
        durationMs: 0,
        generatedAt: new Date().toISOString(),
        message: "Beds24 direct sync disabled. Staff Calendar reads OCCUPANCY_SCRIPT_URL as the primary occupancy source.",
      },
      {
        headers: {
          "X-Robots-Tag": "noindex, nofollow",
          "Cache-Control": "no-store",
        },
      },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/staff/calendar/sync"],
};
