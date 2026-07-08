"use client";

import { useEffect, useMemo, useState } from "react";

const DAY_WIDTH = 92;
const ROOM_WIDTH = 230;
const ROW_HEIGHT = 68;

type CalendarUnit = {
  room_id: string;
  unit_id: string;
  display_name: string;
  category: string;
  floor: string | null;
  max_guests: number | null;
};

type AvailabilityRow = {
  date: string;
  room_id: string;
  unit_id: string;
  price: number | null;
  available: boolean | null;
  reason: string | null;
};

type BookingRow = {
  booking_id: string;
  book_id: string | null;
  room_id: string;
  unit_id: string;
  guest_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  num_adult: number | null;
  num_child: number | null;
  arrival: string;
  departure: string;
  status: string | null;
  referrer: string | null;
  referrer_label: string | null;
  channel: string | null;
  source: string | null;
  price: number | null;
};

type CalendarPayload = {
  ok: boolean;
  range: { start: string; end: string };
  units: CalendarUnit[];
  availability: AvailabilityRow[];
  bookings: BookingRow[];
  generatedAt: string;
  error?: string;
};

type UnitStay = { unit: CalendarUnit; total: number; nights: number };
type SplitStay = { first: UnitStay; second: UnitStay; splitDate: string; total: number };

type Selection = { checkIn: string | null; checkOut: string | null };

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(value: string, amount: number) {
  const date = parseDate(value);
  date.setDate(date.getDate() + amount);
  return dateOnly(date);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function makeDays(start: string, end: string) {
  const days: string[] = [];
  const current = parseDate(start);
  const last = parseDate(end);
  while (current <= last) {
    days.push(dateOnly(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function unitKey(roomId: string, unitId: string) {
  return `${roomId}:${unitId}`;
}

function money(value: unknown) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return `€${number.toFixed(0)}`;
}

function dayLabel(value: string) {
  const date = parseDate(value);
  return {
    day: new Intl.DateTimeFormat("el-GR", { day: "2-digit" }).format(date),
    week: new Intl.DateTimeFormat("el-GR", { weekday: "short" }).format(date),
  };
}

function formatShortDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("el-GR", { day: "2-digit", month: "short" }).format(parseDate(value));
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("el-GR", { month: "long", year: "numeric" }).format(date);
}

function nightsBetween(checkIn: string, checkOut: string) {
  return Math.max(0, Math.round((parseDate(checkOut).getTime() - parseDate(checkIn).getTime()) / 86400000));
}

function stayNights(checkIn: string, checkOut: string) {
  const nights: string[] = [];
  let current = checkIn;
  while (current < checkOut) {
    nights.push(current);
    current = addDays(current, 1);
  }
  return nights;
}

function isCancelled(status: string | null) {
  const value = String(status || "").toLowerCase();
  return value.includes("cancel") || value.includes("deleted");
}

function isBookingOnDate(booking: BookingRow, date: string) {
  if (isCancelled(booking.status)) return false;
  return booking.arrival <= date && booking.departure > date;
}

function channelTone(referrer: string | null) {
  const value = String(referrer || "").toLowerCase();
  if (value.includes("booking")) return { bar: "border-sky-300 bg-sky-50 text-sky-950", badge: "bg-sky-600 text-white", label: "Booking.com" };
  if (value.includes("expedia")) return { bar: "border-amber-300 bg-amber-50 text-amber-950", badge: "bg-amber-500 text-white", label: "Expedia" };
  if (value.includes("direct") || value.includes("voulamandis")) return { bar: "border-emerald-300 bg-emerald-50 text-emerald-950", badge: "bg-emerald-600 text-white", label: "Direct" };
  return { bar: "border-slate-300 bg-slate-50 text-slate-950", badge: "bg-slate-500 text-white", label: "Other" };
}

function roomAccent(category: string) {
  const value = category.toLowerCase();
  if (value.includes("economy")) return "border-l-emerald-400";
  if (value.includes("ground")) return "border-l-orange-300";
  if (value.includes("first")) return "border-l-blue-300";
  if (value.includes("apt")) return "border-l-violet-300";
  return "border-l-slate-300";
}

function bookingPosition(booking: BookingRow, days: string[]) {
  const start = booking.arrival < days[0] ? days[0] : booking.arrival;
  const rangeEnd = addDays(days[days.length - 1], 1);
  const end = booking.departure > rangeEnd ? rangeEnd : booking.departure;
  const startIndex = days.indexOf(start);
  let endIndex = days.indexOf(end);
  if (startIndex === -1) return null;
  if (endIndex === -1) endIndex = end >= rangeEnd ? days.length : startIndex + 1;
  const span = Math.max(0, endIndex - startIndex);
  if (span <= 0) return null;
  return { left: startIndex * DAY_WIDTH + 5, width: span * DAY_WIDTH - 10 };
}

function availableStay(unit: CalendarUnit, nights: string[], availability: Map<string, AvailabilityRow>) {
  let total = 0;
  for (const night of nights) {
    const row = availability.get(`${unitKey(unit.room_id, unit.unit_id)}:${night}`);
    const price = Number(row?.price || 0);
    if (!row?.available || price <= 0) return null;
    total += price;
  }
  return { unit, total, nights: nights.length };
}

function splitStays(units: CalendarUnit[], checkIn: string, checkOut: string, availability: Map<string, AvailabilityRow>) {
  const result: SplitStay[] = [];
  let splitDate = addDays(checkIn, 1);
  while (splitDate < checkOut) {
    const firstNights = stayNights(checkIn, splitDate);
    const secondNights = stayNights(splitDate, checkOut);
    const first = units.map((unit) => availableStay(unit, firstNights, availability)).filter(Boolean) as UnitStay[];
    const second = units.map((unit) => availableStay(unit, secondNights, availability)).filter(Boolean) as UnitStay[];
    for (const a of first) {
      for (const b of second) {
        if (unitKey(a.unit.room_id, a.unit.unit_id) !== unitKey(b.unit.room_id, b.unit.unit_id)) {
          result.push({ first: a, second: b, splitDate, total: a.total + b.total });
        }
      }
    }
    splitDate = addDays(splitDate, 1);
  }
  return result.sort((a, b) => a.total - b.total).slice(0, 8);
}

async function readCalendar(response: Response) {
  const body = await response.text();
  if (!body.trim()) throw new Error(`Empty calendar response. Status ${response.status}`);
  const json = JSON.parse(body) as CalendarPayload;
  if (!response.ok || json.ok === false) throw new Error(json.error || `Calendar API error ${response.status}`);
  return json;
}

export default function StaySearchCalendarSafe() {
  const [anchorMonth, setAnchorMonth] = useState(startOfMonth(new Date()));
  const [data, setData] = useState<CalendarPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [selection, setSelection] = useState<Selection>({ checkIn: null, checkOut: null });
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);

  const range = useMemo(() => ({ start: dateOnly(startOfMonth(anchorMonth)), end: dateOnly(endOfMonth(anchorMonth)) }), [anchorMonth]);
  const days = useMemo(() => makeDays(range.start, range.end), [range.end, range.start]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch(`/api/staff/calendar/?start=${encodeURIComponent(range.start)}&end=${encodeURIComponent(range.end)}`, { cache: "no-store", credentials: "same-origin" })
      .then(readCalendar)
      .then((payload) => {
        if (!cancelled) setData(payload);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown calendar error.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range.end, range.start, reloadToken]);

  const availability = useMemo(() => {
    const map = new Map<string, AvailabilityRow>();
    data?.availability.forEach((row) => map.set(`${unitKey(row.room_id, row.unit_id)}:${row.date}`, row));
    return map;
  }, [data]);

  const bookingsByUnit = useMemo(() => {
    const map = new Map<string, BookingRow[]>();
    data?.bookings.filter((booking) => !isCancelled(booking.status)).forEach((booking) => {
      const key = unitKey(booking.room_id, booking.unit_id);
      const rows = map.get(key) || [];
      rows.push(booking);
      map.set(key, rows);
    });
    return map;
  }, [data]);

  const search = useMemo(() => {
    if (!data || !selection.checkIn || !selection.checkOut || selection.checkOut <= selection.checkIn) return null;
    const nights = stayNights(selection.checkIn, selection.checkOut);
    const full = data.units.map((unit) => availableStay(unit, nights, availability)).filter(Boolean) as UnitStay[];
    const split = full.length ? [] : splitStays(data.units, selection.checkIn, selection.checkOut, availability);
    return { nights, full: full.sort((a, b) => a.total - b.total), split };
  }, [availability, data, selection.checkIn, selection.checkOut]);

  function chooseDate(day: string) {
    setSelection((current) => {
      if (!current.checkIn || current.checkOut || day <= current.checkIn) return { checkIn: day, checkOut: null };
      return { checkIn: current.checkIn, checkOut: day };
    });
  }

  const units = data?.units || [];

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-800">
      <div className="mx-auto flex min-h-screen w-full max-w-[1840px] flex-col gap-4 px-3 py-3 sm:px-5 sm:py-5">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <a href="/staff" className="mb-3 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-100">← Επιστροφή στο Staff</a>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Staff Calendar</h1>
              <p className="mt-1 text-sm font-bold text-slate-500">Πάτησε ημερομηνία στην πάνω σειρά: 1ο click check-in, 2ο click check-out.</p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:min-w-[520px]">
              <Stat label="Units" value={units.length} />
              <Stat label="Bookings" value={(data?.bookings || []).filter((booking) => !isCancelled(booking.status)).length} tone="sky" />
              <Stat label="Available" value={(data?.availability || []).filter((row) => row.available && Number(row.price || 0) > 0).length} tone="emerald" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setAnchorMonth(new Date(anchorMonth.getFullYear(), anchorMonth.getMonth() - 1, 1))} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50">←</button>
              <button type="button" onClick={() => setAnchorMonth(startOfMonth(new Date()))} className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800 hover:bg-emerald-100">Today</button>
              <button type="button" onClick={() => setAnchorMonth(new Date(anchorMonth.getFullYear(), anchorMonth.getMonth() + 1, 1))} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50">→</button>
              <button type="button" onClick={() => setReloadToken((value) => value + 1)} className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white hover:bg-slate-800">Refresh</button>
              <button type="button" onClick={() => setSelection({ checkIn: null, checkOut: null })} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50">Clear dates</button>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center shadow-sm">
              <div className="text-lg font-black capitalize text-slate-950">{monthLabel(anchorMonth)}</div>
              <div className="text-xs font-bold text-slate-500">{range.start} → {range.end}</div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-black">
              <Legend label="Available" className="border-emerald-200 bg-emerald-50 text-emerald-800" />
              <Legend label="Booking.com" className="border-sky-200 bg-sky-50 text-sky-800" />
              <Legend label="Expedia" className="border-amber-200 bg-amber-50 text-amber-800" />
              <Legend label="Direct" className="border-emerald-200 bg-teal-50 text-teal-800" />
            </div>
          </div>
        </section>

        <StaySearchSummary selection={selection} search={search} />

        {loading ? <Message title="Loading calendar..." body="Διαβάζω κρατήσεις και διαθεσιμότητα." /> : null}
        {error ? <Message title="Calendar error" body={error} danger /> : null}

        {!loading && !error ? (
          <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:p-5">
            <div className="flex overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
              <div style={{ width: ROOM_WIDTH, minWidth: ROOM_WIDTH }} className="shrink-0 border-r border-slate-200 bg-white shadow-[10px_0_24px_rgba(15,23,42,0.08)]">
                <div style={{ height: ROW_HEIGHT }} className="grid place-items-start border-b border-slate-200 p-4 text-sm font-black text-slate-950">Room / Unit</div>
                {units.map((unit) => (
                  <div key={unitKey(unit.room_id, unit.unit_id)} style={{ height: ROW_HEIGHT }} className={`border-b border-l-4 border-slate-200 bg-white p-3 ${roomAccent(unit.category)}`}>
                    <div className="truncate text-sm font-black text-slate-950">{unit.display_name}</div>
                    <div className="mt-1 truncate text-[11px] font-bold text-slate-500">{unit.category}</div>
                    <div className="mt-1 flex gap-1.5">
                      {unit.floor ? <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-black text-slate-600">{unit.floor}</span> : null}
                      {unit.max_guests ? <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-black text-slate-600">{unit.max_guests} pax</span> : null}
                    </div>
                  </div>
                ))}
              </div>

              <div className="min-w-0 flex-1 overflow-x-auto">
                <div style={{ width: days.length * DAY_WIDTH, minWidth: days.length * DAY_WIDTH }}>
                  <div className="grid" style={{ height: ROW_HEIGHT, gridTemplateColumns: `repeat(${days.length}, ${DAY_WIDTH}px)` }}>
                    {days.map((day) => {
                      const label = dayLabel(day);
                      const selected = selection.checkIn === day || selection.checkOut === day;
                      const inRange = Boolean(selection.checkIn && selection.checkOut && day > selection.checkIn && day < selection.checkOut);
                      return (
                        <button key={day} type="button" onClick={() => chooseDate(day)} className={["border-b border-r border-slate-200 p-2 text-center transition", selected ? "bg-slate-950 text-white" : inRange ? "bg-sky-100 text-sky-950" : "bg-white text-slate-700 hover:bg-sky-50"].join(" ")}>
                          <div className="text-base font-black">{label.day}</div>
                          <div className="text-[10px] font-black uppercase opacity-70">{label.week}</div>
                        </button>
                      );
                    })}
                  </div>

                  {units.map((unit) => {
                    const key = unitKey(unit.room_id, unit.unit_id);
                    const bookings = bookingsByUnit.get(key) || [];
                    return (
                      <div key={key} className="relative" style={{ height: ROW_HEIGHT, width: days.length * DAY_WIDTH }}>
                        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${days.length}, ${DAY_WIDTH}px)` }}>
                          {days.map((day) => {
                            const booking = bookings.find((row) => isBookingOnDate(row, day));
                            const row = availability.get(`${key}:${day}`);
                            const price = row?.available && Number(row.price || 0) > 0 ? Number(row.price) : null;
                            return (
                              <div key={`${key}-${day}`} className="grid place-items-center border-b border-r border-slate-200 bg-white p-1.5 text-center">
                                {!booking && price ? <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-800 shadow-sm">{money(price)}</span> : null}
                                {!booking && !price ? <span className="text-[10px] font-black text-slate-300">—</span> : null}
                              </div>
                            );
                          })}
                        </div>
                        <div className="pointer-events-none absolute inset-0">
                          {bookings.map((booking) => {
                            const position = bookingPosition(booking, days);
                            if (!position) return null;
                            const tone = channelTone(booking.referrer);
                            return (
                              <button key={booking.booking_id} type="button" onClick={() => setSelectedBooking(booking)} className={["pointer-events-auto absolute top-[7px] h-[54px] overflow-hidden rounded-2xl border px-3 py-2 text-left shadow-[0_8px_18px_rgba(15,23,42,0.08)]", tone.bar].join(" ")} style={{ left: position.left, width: position.width }}>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-black">{booking.guest_name || "Guest"}</div>
                                    <div className="mt-1 truncate text-[10px] font-black opacity-70">{booking.arrival.slice(5)} → {booking.departure.slice(5)} · {money(booking.price)}</div>
                                  </div>
                                  <span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-black uppercase ${tone.badge}`}>{tone.label}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
      {selectedBooking ? <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} /> : null}
    </main>
  );
}

function StaySearchSummary({ selection, search }: { selection: Selection; search: { nights: string[]; full: UnitStay[]; split: SplitStay[] } | null }) {
  const nights = selection.checkIn && selection.checkOut ? nightsBetween(selection.checkIn, selection.checkOut) : 0;
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-wide text-slate-500">Stay search</div>
          <h2 className="mt-1 text-xl font-black text-slate-950">{formatShortDate(selection.checkIn)} → {formatShortDate(selection.checkOut)}</h2>
          <p className="mt-1 text-sm font-bold text-slate-500">{selection.checkIn && !selection.checkOut ? "Τώρα πάτησε check-out ημερομηνία στην πάνω σειρά." : nights ? `${nights} nights` : "Πάτησε check-in και μετά check-out στην πάνω σειρά ημερομηνιών."}</p>
        </div>
        <div className="min-w-0 flex-1">
          {!search ? <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">Δεν έχει επιλεγεί ολοκληρωμένο διάστημα.</div> : null}
          {search?.full.length ? (
            <div>
              <div className="mb-2 text-sm font-black text-emerald-800">Available rooms for full stay</div>
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">{search.full.slice(0, 9).map((stay) => <StayCard key={unitKey(stay.unit.room_id, stay.unit.unit_id)} stay={stay} />)}</div>
            </div>
          ) : null}
          {search && !search.full.length && search.split.length ? (
            <div>
              <div className="mb-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-black text-amber-900">Δεν υπάρχει ίδιο δωμάτιο για όλο το διάστημα. Υπάρχει split stay με 1 αλλαγή δωματίου:</div>
              <div className="grid gap-2 xl:grid-cols-2">{search.split.map((split, index) => <SplitCard key={`${split.splitDate}-${index}`} split={split} />)}</div>
            </div>
          ) : null}
          {search && !search.full.length && !search.split.length ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-black text-rose-900">Δεν βρέθηκε ούτε full stay ούτε split stay με μία αλλαγή δωματίου.</div> : null}
        </div>
      </div>
    </section>
  );
}

function StayCard({ stay }: { stay: UnitStay }) {
  return <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-950"><div className="text-sm font-black">{stay.unit.display_name}</div><div className="mt-1 text-xs font-bold opacity-75">{stay.unit.category}</div><div className="mt-2 text-xs font-black">{stay.nights} nights · {money(stay.total)}</div></div>;
}

function SplitCard({ split }: { split: SplitStay }) {
  return <div className="rounded-2xl border border-amber-200 bg-white p-3 shadow-sm"><div className="mb-2 flex items-center justify-between gap-2"><div className="text-xs font-black uppercase text-amber-700">Split option</div><div className="rounded-full bg-amber-100 px-2 py-1 text-xs font-black text-amber-900">Total {money(split.total)}</div></div><div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="text-sm font-black text-slate-950">{split.first.unit.display_name}</div><div className="text-xs font-bold text-slate-500">{split.first.nights} nights · {money(split.first.total)}</div></div><div className="text-center text-xs font-black text-amber-700">change<br />{formatShortDate(split.splitDate)}</div><div className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="text-sm font-black text-slate-950">{split.second.unit.display_name}</div><div className="text-xs font-bold text-slate-500">{split.second.nights} nights · {money(split.second.total)}</div></div></div></div>;
}

function BookingModal({ booking, onClose }: { booking: BookingRow; onClose: () => void }) {
  const guest = booking.guest_name || `${booking.first_name || ""} ${booking.last_name || ""}`.trim() || "Guest";
  const phone = booking.mobile || booking.phone || "";
  const tone = channelTone(booking.referrer);
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur" onClick={onClose}><div className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-[#fffdf8] p-5 text-slate-950 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4"><div><div className={`mb-2 inline-flex rounded-full px-3 py-1 text-xs font-black ${tone.badge}`}>{tone.label}</div><h2 className="text-2xl font-black tracking-tight">{guest}</h2><p className="mt-1 text-sm font-bold text-slate-500">{booking.arrival} → {booking.departure} · ID {booking.booking_id}</p></div><button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-xl font-black">×</button></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><Detail label="Total charges" value={money(booking.price)} tone="emerald" /><Detail label="Status" value={booking.status || "—"} /><Detail label="Guests" value={`Adults: ${booking.num_adult ?? "—"} · Children: ${booking.num_child ?? "—"}`} /><Detail label="Referrer" value={booking.referrer_label || booking.referrer || "Other"} /><Detail label="Email" value={booking.email || "—"} /><Detail label="Phone" value={phone || "—"} /></div></div></div>;
}

function Stat({ label, value, tone = "stone" }: { label: string; value: number; tone?: "stone" | "emerald" | "sky" }) {
  const styles = { stone: "border-slate-200 bg-slate-50 text-slate-950", emerald: "border-emerald-200 bg-emerald-50 text-emerald-800", sky: "border-sky-200 bg-sky-50 text-sky-800" }[tone];
  return <div className={`rounded-2xl border p-3 shadow-sm ${styles}`}><div className="text-xs font-black uppercase opacity-70">{label}</div><div className="mt-1 text-2xl font-black">{value}</div></div>;
}

function Legend({ label, className }: { label: string; className: string }) {
  return <span className={`rounded-full border px-3 py-2 ${className}`}>{label}</span>;
}

function Message({ title, body, danger = false }: { title: string; body: string; danger?: boolean }) {
  return <section className={`rounded-[2rem] border p-8 text-center shadow-sm ${danger ? "border-rose-200 bg-rose-50" : "border-slate-200 bg-white"}`}><h2 className={`text-lg font-black ${danger ? "text-rose-950" : "text-slate-950"}`}>{title}</h2><p className={`mt-1 text-sm font-bold ${danger ? "text-rose-800" : "text-slate-500"}`}>{body}</p></section>;
}

function Detail({ label, value, tone = "stone" }: { label: string; value: string; tone?: "stone" | "emerald" }) {
  const styles = tone === "emerald" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500";
  return <div className={`rounded-2xl border p-4 shadow-sm ${styles}`}><div className="text-xs font-black uppercase">{label}</div><div className="mt-1 break-words text-sm font-black text-slate-950">{value}</div></div>;
}
