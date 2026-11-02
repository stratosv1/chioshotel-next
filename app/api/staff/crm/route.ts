import { NextRequest, NextResponse } from "next/server";
import {
  addExclusion,
  getSummary,
  ignoreBooking,
  isValidEmail,
  isVirtualEmail,
  listExclusions,
  listGuests,
  listPendingBookings,
  normalizeEmail,
  removeExclusion,
  saveGuestOverride,
  setBookingRealEmail,
} from "@/lib/crm/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

const headers = { "Cache-Control": "no-store" };
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status, headers });

function optional(value: unknown, maxLength: number) {
  const text = String(value ?? "").trim().slice(0, maxLength);
  return text || null;
}

export async function GET(request: NextRequest) {
  try {
    const view = request.nextUrl.searchParams.get("view") || "summary";
    if (view === "guests") return NextResponse.json({ ok: true, guests: await listGuests() }, { headers });
    if (view === "pending") {
      const scope = request.nextUrl.searchParams.get("scope") === "all" ? "all" : "upcoming";
      return NextResponse.json({ ok: true, bookings: await listPendingBookings(scope) }, { headers });
    }
    if (view === "exclusions") return NextResponse.json({ ok: true, exclusions: await listExclusions() }, { headers });
    return NextResponse.json({ ok: true, summary: await getSummary() }, { headers });
  } catch (error) {
    console.error("staff crm GET failed", error);
    return fail("Δεν φορτώθηκαν τα δεδομένα.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = normalizeEmail(body.email);
    const bookingId = String(body.bookingId ?? "").trim();

    switch (body.action) {
      case "add_exclusion":
        if (!isValidEmail(email)) return fail("Μη έγκυρο email.");
        await addExclusion(email, optional(body.note, 200) ?? "");
        break;
      case "remove_exclusion":
        await removeExclusion(email);
        break;
      case "save_guest":
        if (!isValidEmail(email)) return fail("Μη έγκυρο email.");
        await saveGuestOverride(
          email,
          optional(body.country, 60),
          optional(body.language, 2)?.toLowerCase() ?? null,
        );
        break;
      case "set_real_email":
        if (!bookingId) return fail("Λείπει η κράτηση.");
        if (!isValidEmail(email) || isVirtualEmail(email)) return fail("Βάλε το πραγματικό email του πελάτη.");
        await setBookingRealEmail(bookingId, email);
        break;
      case "ignore_booking":
        if (!bookingId) return fail("Λείπει η κράτηση.");
        await ignoreBooking(bookingId);
        break;
      default:
        return fail("Άγνωστη ενέργεια.");
    }
    return NextResponse.json({ ok: true }, { headers });
  } catch (error) {
    console.error("staff crm POST failed", error);
    return fail("Δεν αποθηκεύτηκε.", 500);
  }
}
