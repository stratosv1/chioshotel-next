import { NextRequest, NextResponse } from "next/server";
import { getToday } from "@/lib/pyrgos/today";
import { bedsText, BED_LABELS, saveExtras, setHousekeeping, type BedSetup, type HousekeepingStatus } from "@/lib/pyrgos/store";
import { appendBookingNote, getBeds24WriteToken } from "@/lib/crm/booking-notes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

const headers = { "Cache-Control": "no-store" };
const isDay = (value: unknown) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
const STATUSES: HousekeepingStatus[] = ["pending", "cleaning", "done"];

export async function GET(request: NextRequest) {
  const day = request.nextUrl.searchParams.get("day") ?? "";
  if (!isDay(day)) return NextResponse.json({ ok: false, error: "Μη έγκυρη ημέρα." }, { status: 400, headers });
  try {
    return NextResponse.json({ ok: true, data: await getToday(day) }, { headers });
  } catch (error) {
    console.error("[pyrgos] today failed", error);
    return NextResponse.json({ ok: false, error: "Δεν φόρτωσε η σημερινή εικόνα." }, { status: 500, headers });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "housekeeping") {
      const room = Number(body.room);
      if (!isDay(body.day) || !Number.isInteger(room) || room < 1 || room > 10 || !STATUSES.includes(body.status)) {
        return NextResponse.json({ ok: false, error: "Μη έγκυρα στοιχεία." }, { status: 400, headers });
      }
      await setHousekeeping(body.day, room, body.status);
      return NextResponse.json({ ok: true }, { headers });
    }

    if (body.action === "extras") {
      const bookingId = String(body.bookingId ?? "").trim();
      const bedSetup = body.bedSetup && body.bedSetup in BED_LABELS ? (body.bedSetup as BedSetup) : null;
      if (!/^\d{1,12}$/.test(bookingId)) {
        return NextResponse.json({ ok: false, error: "Μη έγκυρη κράτηση." }, { status: 400, headers });
      }
      const extras = {
        bookingId,
        bedSetup,
        cot: Boolean(body.cot),
        rollaway: Boolean(body.rollaway),
        other: String(body.other ?? "").replace(/\s+/g, " ").trim().slice(0, 120),
      };
      await saveExtras(extras);

      // Mirror into the Beds24 booking notes so the information lives there too.
      const text = bedsText(extras);
      let beds24 = "skipped";
      if (text) {
        try {
          const token = await getBeds24WriteToken();
          beds24 = await appendBookingNote(bookingId, `Κρεβάτια: ${text}`, `Κρεβάτια: ${text}`, token);
        } catch (error) {
          console.error("[pyrgos] beds24 note failed", error);
          beds24 = "failed";
        }
      }
      const noted = beds24 === "written" || beds24 === "already_noted" || beds24 === "skipped";
      return NextResponse.json({ ok: true, beds24: noted ? "ok" : "failed" }, { headers });
    }

    return NextResponse.json({ ok: false, error: "Άγνωστη ενέργεια." }, { status: 400, headers });
  } catch (error) {
    console.error("[pyrgos] action failed", error);
    return NextResponse.json({ ok: false, error: "Η αποθήκευση απέτυχε." }, { status: 500, headers });
  }
}
