import { NextRequest, NextResponse } from "next/server";
import { checkBookingCommunication } from "@/lib/crm/booking-check";
import { getBookingNotes, listMonthBookings } from "@/lib/crm/bookings-board";
import { sendBookingSms } from "@/lib/crm/sms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

const headers = { "Cache-Control": "no-store" };
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status, headers });

export async function GET(request: NextRequest) {
  try {
    const notesFor = request.nextUrl.searchParams.get("notes");
    if (notesFor) {
      if (!/^\d{4,12}$/.test(notesFor)) return fail("Μη έγκυρη κράτηση.");
      return NextResponse.json({ ok: true, notes: await getBookingNotes(notesFor) }, { headers });
    }
    const month = request.nextUrl.searchParams.get("month") ?? "";
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return fail("Μη έγκυρος μήνας.");
    return NextResponse.json({ ok: true, bookings: await listMonthBookings(month) }, { headers });
  } catch (error) {
    console.error("staff crm bookings GET failed", error);
    return fail("Δεν φορτώθηκαν οι κρατήσεις.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (body.action === "check") {
      const bookingIds = (Array.isArray(body.bookingIds) ? body.bookingIds : []).map(String).filter((id) => /^\d{4,12}$/.test(id));
      if (!bookingIds.length) return fail("Μη έγκυρη κράτηση.");
      const email = typeof body.email === "string" && body.email ? body.email.trim().toLowerCase() : null;
      return NextResponse.json({ ok: true, ...(await checkBookingCommunication(bookingIds, email)) }, { headers });
    }
    const bookingId = String(body.bookingId ?? "").trim();
    const message = String(body.message ?? "").trim();
    if (!/^\d{4,12}$/.test(bookingId)) return fail("Μη έγκυρη κράτηση.");
    if (!message || message.length > 918) return fail("Το SMS πρέπει να έχει από 1 έως 918 χαρακτήρες.");
    await sendBookingSms({ bookingId, guestName: String(body.guestName ?? "").slice(0, 120), phone: String(body.phone ?? ""), message });
    return NextResponse.json({ ok: true }, { headers });
  } catch (error) {
    console.error("staff crm bookings POST failed", error);
    return fail(error instanceof Error ? error.message : "Το SMS απέτυχε.", 502);
  }
}
