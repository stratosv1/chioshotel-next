import { NextRequest, NextResponse } from "next/server";
import { Beds24RateLimited, bookingsSummary, importFromBeds24Month, importFromLocal } from "@/lib/pyrgos/bookings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

const headers = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    return NextResponse.json({ ok: true, years: await bookingsSummary() }, { headers });
  } catch (error) {
    console.error("[pyrgos] history summary failed", error);
    return NextResponse.json({ ok: false, error: "Δεν φόρτωσε η βάση κρατήσεων." }, { status: 500, headers });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { step?: string; month?: string };
    if (body.step === "local") {
      const changed = await importFromLocal("2025-01-01", "2026-12-31");
      return NextResponse.json({ ok: true, changed }, { headers });
    }
    if (body.month && /^(2025|2026)-(0[1-9]|1[0-2])$/.test(body.month)) {
      return NextResponse.json({ ok: true, ...(await importFromBeds24Month(body.month)) }, { headers });
    }
    return NextResponse.json({ ok: false, error: "Μη έγκυρο αίτημα." }, { status: 400, headers });
  } catch (error) {
    if (error instanceof Beds24RateLimited) {
      return NextResponse.json({ ok: false, rateLimited: true }, { status: 429, headers });
    }
    console.error("[pyrgos] history import failed", error);
    return NextResponse.json({ ok: false, error: "Η άντληση απέτυχε." }, { status: 502, headers });
  }
}
