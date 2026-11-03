import { NextRequest, NextResponse } from "next/server";
import { getBankDetails, listRecentBookings, loadConfirmation, sendConfirmation } from "@/lib/crm/booking-confirmation";
import type { ConfirmationData } from "@/lib/crm/booking-confirmation-email";
import { getEmailSettings } from "@/lib/crm/guest-emails";
import { isValidEmail, normalizeEmail } from "@/lib/crm/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

const headers = { "Cache-Control": "no-store" };
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status, headers });

export async function GET(request: NextRequest) {
  try {
    const bookingId = request.nextUrl.searchParams.get("bookingId")?.trim();
    if (!bookingId) {
      const [bookings, bank] = await Promise.all([listRecentBookings(), getBankDetails()]);
      return NextResponse.json({ ok: true, bookings, bank }, { headers });
    }
    if (!/^\d{4,12}$/.test(bookingId)) return fail("Μη έγκυρος αριθμός κράτησης.");
    const loaded = await loadConfirmation(bookingId);
    if (!loaded) return fail("Δεν βρέθηκε η κράτηση.", 404);
    return NextResponse.json({ ok: true, ...loaded }, { headers });
  } catch (error) {
    console.error("staff crm confirmation GET failed", error);
    return fail("Δεν φορτώθηκε η κράτηση.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { action?: string; data?: ConfirmationData };
    const data = body.data;
    if (!data?.bookingIds?.length || !data.rooms?.length) return fail("Λείπουν στοιχεία κράτησης.");
    if (body.action === "test") {
      const { testEmail } = await getEmailSettings();
      if (!testEmail) return fail("Λείπει το δοκιμαστικό email.");
      await sendConfirmation(data, testEmail, "test");
      return NextResponse.json({ ok: true, sentTo: testEmail }, { headers });
    }
    if (body.action === "send") {
      const recipient = normalizeEmail(data.email);
      if (!isValidEmail(recipient)) return fail("Μη έγκυρο email πελάτη.");
      await sendConfirmation(data, recipient, "live");
      return NextResponse.json({ ok: true, sentTo: recipient }, { headers });
    }
    return fail("Άγνωστη ενέργεια.");
  } catch (error) {
    console.error("staff crm confirmation POST failed", error);
    return fail("Η αποστολή απέτυχε.", 500);
  }
}
