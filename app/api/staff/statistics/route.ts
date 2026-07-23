import { NextRequest, NextResponse } from "next/server";
import { staffStatisticsCheckIns } from "@/data/staff-statistics-checkins";
import { getCurrentSnapshots } from "@/lib/staff-statistics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const expectedUser = process.env.STAFF_USERNAME;
  const expectedPass = process.env.STAFF_PASSWORD;
  if (!expectedUser || !expectedPass) return false;
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return false;
  try {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    return separator > -1 && decoded.slice(0, separator) === expectedUser && decoded.slice(separator + 1) === expectedPass;
  } catch {
    return false;
  }
}

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Staff Statistics"',
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}

function remainingFromUploadedReport(year: number, comparisonStartDate: string) {
  const seasonEnd = `${year}-11-01`;
  const daily = staffStatisticsCheckIns[year] ?? {};
  let remainingCharges = 0;
  let remainingBookings = 0;

  for (const [checkIn, [charges, bookings]] of Object.entries(daily)) {
    if (checkIn >= comparisonStartDate && checkIn < seasonEnd) {
      remainingCharges += charges;
      remainingBookings += bookings;
    }
  }

  return {
    remainingCharges: Number(remainingCharges.toFixed(2)),
    remainingBookings,
  };
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();
  try {
    const snapshots = await getCurrentSnapshots();
    const completedSnapshots = snapshots.map((snapshot) => {
      if (snapshot.remainingCharges !== null && snapshot.remainingBookings !== null) return snapshot;
      return {
        ...snapshot,
        ...remainingFromUploadedReport(snapshot.year, snapshot.comparisonStartDate),
      };
    });

    return NextResponse.json(
      { ok: true, snapshots: completedSnapshots, generatedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown statistics error.";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
    );
  }
}
