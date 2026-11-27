import { NextRequest, NextResponse } from "next/server";
import { closedRooms, freeRooms, getBookingDetail, getPlan, searchBookings, suggestedNightPrice } from "@/lib/pyrgos/plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

const headers = { "Cache-Control": "no-store" };
const isDay = (v: string | null): v is string => Boolean(v && /^\d{4}-\d{2}-\d{2}$/.test(v));
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status, headers });

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  try {
    const id = p.get("id");
    if (id) {
      if (!/^[\w-]{1,30}$/.test(id)) return fail("Μη έγκυρη κράτηση.");
      const detail = await getBookingDetail(id);
      return detail ? NextResponse.json({ ok: true, ...detail }, { headers }) : fail("Η κράτηση δεν βρέθηκε.", 404);
    }
    const q = p.get("q");
    if (q !== null) {
      if (q.trim().length < 2) return NextResponse.json({ ok: true, results: [] }, { headers });
      return NextResponse.json({ ok: true, results: await searchBookings(q.slice(0, 60)) }, { headers });
    }
    const from = p.get("from");
    const to = p.get("to");
    if (!isDay(from) || !isDay(to) || to <= from) return fail("Μη έγκυρες ημερομηνίες.");
    if (p.get("free") !== null) {
      // Closed rooms are offered too (marked), because staff may book them (owner, 2026-11-19).
      const [free, closed] = await Promise.all([
        freeRooms(from, to, p.get("ignore") ?? undefined, { includeClosed: true }),
        closedRooms(from, to),
      ]);
      const room = Number(p.get("room"));
      const suggestion = room ? await suggestedNightPrice(room, from, to) : null;
      return NextResponse.json({ ok: true, free, closed, suggestion }, { headers });
    }
    const days = (Date.parse(to) - Date.parse(from)) / 86_400_000;
    if (days > 62) return fail("Μέγιστο 2 μήνες.");
    return NextResponse.json({ ok: true, ...(await getPlan(from, to)) }, { headers });
  } catch (error) {
    console.error("[pyrgos] plan failed", error);
    return fail("Δεν φόρτωσε το πλάνο.", 500);
  }
}
