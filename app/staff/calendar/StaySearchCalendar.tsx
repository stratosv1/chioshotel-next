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
  raw_booking?: unknown;
  tax_total?: number | null;
  room_charge_total?: number | null;
  rate_description?: string | null;
  charge_lines?: unknown;
};

type CalendarPayload = {
  ok: boolean;
  range: { start: string; end: string };
  units: CalendarUnit[];
  availability: AvailabilityRow[];
  bookings: BookingRow[];
  generatedAt: string;
  sources?: {
    occupancySheet?: { enabled?: boolean; bookings?: number; error?: string | null };
    snapshot?: { bookings?: number };
  };
  error?: string;
};

type DateSelection = {
  checkIn: string | null;
  checkOut: string | null;
};

type UnitStay = {
  unit: CalendarUnit;
  total: number;
  nights: number;
};

type SplitStay = {
  first: UnitStay;
  second: UnitStay;
  splitDate: string;
  total: number;
};

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

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("el-GR", { month: "long", year: "numeric" }).format(date);
}

function dayLabel(value: string) {
  const date = parseDate(value);
  return {
    day: new Intl.DateTimeFormat("el-GR", { day: "2-digit" }).format(date),
    week: new Intl.DateTimeFormat("el-GR", { weekday: "short" }).format(date),
  };
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("el-GR", { day: "2-digit", month: "short" }).format(parseDate(value));
}

function formatMoney(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `€${n.toFixed(0)}`;
}

function unitKey(roomId: string, unitId: string) {
  return `${roomId}:${unitId}`;
}

function isCancelled(status: string | null) {
  const value = String(status || "").toLowerCase();
  return value.includes("cancel") || value.includes("deleted");
}

function isBookingOnDate(booking: BookingRow, date: string) {
  if (isCancelled(booking.status)) return false;
  return booking.arrival <= date && booking.departure > date;
}

function nightsBetween(start: string, end: string) {
  const startDate = parseDate(start).getTime();
  const endDate = parseDate(end).getTime();
  return Math.max(0, Math.round((endDate - startDate) / 86400000));
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

function channelTone(referrer: string | null) {
  const value = String(referrer || "").toLowerCase();
  if (value.includes("booking")) {
    return {
      bar: "border-sky-300 bg-sky-50 text-sky-950",
      badge: "bg-sky-600 text-white",
      label: "Booking.com",
    };
  }
  if (value.includes("expedia")) {
    return {
      bar: "border-amber-300 bg-amber-50 text-amber-950",
      badge: "bg-amber-500 text-white",
      label: "Expedia",
    };
  }
  if (value.includes("direct") || value.includes("voulamandis")) {
    return {
      bar: "border-emerald-300 bg-emerald-50 text-emerald-950",
      badge: "bg-emerald-600 text-white",
      label: "Direct",
    };
  }
  return {
    bar: "border-slate-300 bg-slate-50 text-slate-950",
    badge: "bg-slate-500 text-white",
    label: "Other",
  };
}

function unitAccent(category: string) {
  const value = category.toLowerCase();
  if (value.includes("economy")) return "border-l-emerald-400";
  if (value.includes("ground")) return "border-l-orange-300";
  if (value.includes("first")) return "border-l-blue-300";
  if (value.includes("apt")) return "border-l-violet-300";
  return "border-l-slate-300";
}

function bookingPosition(booking: BookingRow, days: string[]) {
  if (!days.length) return null;
  const rangeStart = days[0];
  const rangeEnd = addDays(days[days.length - 1], 1);
  const start = booking.arrival < rangeStart ? rangeStart : booking.arrival;
  const end = booking.departure > rangeEnd ? rangeEnd : booking.departure;
  const startIndex = days.indexOf(start);
  let endIndex = days.indexOf(end);
  if (startIndex === -1) return null;
  if (endIndex === -1) endIndex = end >= rangeEnd ? days.length : startIndex + 1;
  const span = Math.max(0, endIndex - startIndex);
  if (span <= 0) return null;
  return { left: startIndex * DAY_WIDTH + 5, width: span * DAY_WIDTH - 10 };
}

async function readCalendar(response: Response) {
  const text = await response.text();
  if (!text.trim()) throw new Error(`Empty calendar response. Status ${response.status}`);
  const json = JSON.parse(text) as CalendarPayload;
  if (!response.ok || json.ok === false) throw new Error(json.error || `Calendar API error ${response.status}`);
  return json;
}

function isAvailableForStay(unit: CalendarUnit, nights: string[], availabilityMap: Map<string, AvailabilityRow>) {
  if (!nights.length) return null;
  let total = 0;
  for (const night of nights) {
    const row = availabilityMap.get(`${unitKey(unit.room_id, unit.unit_id)}:${night}`);
    const price = Number(row?.price || 0);
    if (!row?.available || price <= 0) return null;
    total += price;
  }
  return { unit, total, nights: nights.length };
}

function findSplitStays(units: CalendarUnit[], checkIn: string, checkOut: string, availabilityMap: Map<string, AvailabilityRow>) {
  const results: SplitStay[] = [];
  let splitDate = addDays(checkIn, 1);
  while (splitDate < checkOut) {
    const firstNights = stayNights(checkIn, splitDate);
    const secondNights = stayNights(splitDate, checkOut);
    const firstOptions = units.map((unit) => isAvailableForStay(unit, firstNights, availabilityMap)).filter(Boolean) as UnitStay[];
    const secondOptions = units.map((unit) => isAvailableForStay(unit, secondNights, availabilityMap)).filter(Boolean) as UnitStay[];
    for (const first of firstOptions) {
      for (const second of secondOptions) {
        if (unitKey(first.unit.room_id, first.unit.unit_id) === unitKey(second.unit.room_id, second.unit.unit_id)) continue;
        results.push({ first, second, splitDate, total: first.total + second.total });
      }
    }
    splitDate = addDays(splitDate, 1);
  }
  return results.sort((a, b) => a.total - b.total).slice(0, 8);
}

export default function StaySearchCalendar() {
  const today = useMemo(() => new Date(), []);
  const [anchorMonth, setAnchorMonth] = useState(startOfMonth(today));
  const [data, setData] = useState<CalendarPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);
  const [selection, setSelection] = useState<DateSelection>({ checkIn: null, checkOut: null });

  const range = useMemo(() => {
    const start = dateOnly(startOfMonth(anchorMonth));
    const end = dateOnly(endOfMonth(anchorMonth));
    return { start, end };
  }, [anchorMonth]);

  const days = useMemo(() => makeDays(range.start, range.end), [range.start, range.end]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch(`/api/staff/calendar/?start=${encodeURIComponent(range.start)}&end=${encodeURIComponent(range.end)}`, {
      cache: "no-store",
      credentials: "same-origin",
    })
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
  }, [range.start, range.end, reloadToken]);

  const availabilityMap = useMemo(() => {
    const map = new Map<string, AvailabilityRow>();
    data?.availability.forEach((row) => map.set(`${unitKey(row.room_id, row.unit_id)}:${row.date}`, row));
    return map;
  }, [data]);

  const bookingsByUnit = useMemo(() => {
    const map = new Map<string, BookingRow[]>();
    data?.bookings
      .filter((booking) => !isCancelled(booking.status))
      .forEach((booking) => {
        const key = unitKey(booking.room_id, booking.unit_id);
        const rows = map.get(key) || [];
        rows.push(booking);
        map.set(key, rows);
      });
    return map;
  }, [data]);

  const staySearch = useMemo(() => {
    if (!data || !selection.checkIn || !selection.checkOut || selection.checkOut <= selection.checkIn) return null;
    const nights = stayNights(selection.checkIn, selection.checkOut);
    const fullStay = data.units.map((unit) => isAvailableForStay(unit, nights, availabilityMap)).filter(Boolean) as UnitStay[];
    const splitStays = fullStay.length ? [] : findSplitStays(data.units, selection.checkIn, selection.checkOut, availabilityMap);
    return { nights, fullStay: fullStay.sort((a, b) => a.total - b.total), splitStays };
  }, [availabilityMap, data, selection.checkIn, selection.checkOut]);

  const stats = useMemo(() => {
    const bookings = (data?.bookings || []).filter((booking) => !isCancelled(booking.status));
    const availableCells = data?.availability.filter((row) => row.available && Number(row.price || 0) > 0).length || 0;
    return { units: data?.units.length || 0, bookings: bookings.length, availableCells };
  }, [data]);

  function chooseDate(day: string) {
    setSelection((current) => {
      if (!current.checkIn || current.checkOut || day <= current.checkIn) return { checkIn: day, checkOut: null };
      return { checkIn: current.checkIn, checkOut: day };
    });
  }

  function dayIsSelected(day: string) {
    return selection.checkIn === day || selection.checkOut === day;
  }

  function dayIsInRange(day: string) {
    return Boolean(selection.checkIn && selection.checkOut && day > selection.checkIn && day < selection.checkOut);
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-800">
      <div className="mx-auto flex min-h-screen w-full max-w-[1840px] flex-col gap-4 px-3 py-3 sm:px-5 sm:py-5">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <a href="/staff" className="mb-3 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-100">← Επιστροφή στο Staff</a>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Staff Calendar</h1>
              <p className="mt-1 text-sm font-bold text-slate-500">Πάτησε μία ημερομηνία για check-in και δεύτερη για check-out.</p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:min-w-[520px]">
              <Stat label="Units" value={stats.units} />
              <Stat label="Bookings" value={stats.bookings} tone="sky" />
              <Stat label="Available cells" value={stats.availableCells} tone="emerald" />
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

        <StaySearchPanel selection={selection} results={staySearch} />

        {loading ? <Message title="Loading calendar..." body="Διαβάζω κρατήσεις και διαθεσιμότητα." /> : null}
        {error ? <Message title="Calendar error" body={error} danger /> : null}

        {!loading && !error ? (
          <section className="flex-1 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            <div className="h-full overflow-auto p-4 sm:p-5">
              <div className="min-w-max overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
                <div className="flex bg-white">
                  <div className="sticky left-0 top-0 z-[90] border-b border-r border-slate-200 bg-white p-4 text-sm font-black text-slate-900 shadow-[10px_0_24px_rgba(15,23,42,0.08)]" style={{ width: ROOM_WIDTH, minWidth: ROOM_WIDTH }}>
                    Room / Unit
                  </div>
                  <div className="grid" style={{ width: days.length * DAY_WIDTH, gridTemplateColumns: `repeat(${days.length}, ${DAY_WIDTH}px)` }}>
                    {days.map((day) => {
                      const label = dayLabel(day);
                      const selected = dayIsSelected(day);
                      const inRange = dayIsInRange(day);
                      return (
                        <button key={day} type="button" onClick={() => chooseDate(day)} className={["sticky top-0 z-30 border-b border-r border-slate-200 p-2 text-center transition", selected ? "bg-slate-950 text-white" : inRange ? "bg-sky-100 text-sky-950" : "bg-white text-slate-700 hover:bg-sky-50"].join(" ")}>
                          <div className="text-base font-black">{label.day}</div>
                          <div className="text-[10px] font-black uppercase opacity-70">{label.week}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {(data?.units || []).map((unit) => {
                  const key = unitKey(unit.room_id, unit.unit_id);
                  const bookings = bookingsByUnit.get(key) || [];
                  return (
                    <div key={key} className="flex">
                      <div className={`sticky left-0 z-[70] border-b border-r border-l-4 border-slate-200 bg-white p-3 shadow-[10px_0_24px_rgba(15,23,42,0.08)] ${unitAccent(unit.category)}`} style={{ width: ROOM_WIDTH, minWidth: ROOM_WIDTH, height: ROW_HEIGHT }}>
                        <div className="truncate text-sm font-black text-slate-950">{unit.display_name}</div>
                        <div className="mt-1 truncate text-[11px] font-bold text-slate-500">{unit.category}</div>
                        <div className="mt-1 flex gap-1.5">
                          {unit.floor ? <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-black text-slate-600">{unit.floor}</span> : null}
                          {unit.max_guests ? <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-black text-slate-600">{unit.max_guests} pax</span> : null}
                        </div>
                      </div>

                      <div className="relative" style={{ width: days.length * DAY_WIDTH, minWidth: days.length * DAY_WIDTH, height: ROW_HEIGHT }}>
                        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${days.length}, ${DAY_WIDTH}px)` }}>
                          {days.map((day) => {
                            const booking = bookings.find((row) => isBookingOnDate(row, day));
                            const row = availabilityMap.get(`${key}:${day}`);
                            const price = row?.available && Number(row.price || 0) > 0 ? Number(row.price) : null;
                            const selected = dayIsSelected(day);
                            const inRange = dayIsInRange(day);
                            return (
                              <button key={`${key}-${day}`} type="button" onClick={() => chooseDate(day)} className={["grid place-items-center border-b border-r border-slate-200 p-1.5 text-center transition", booking ? "bg-white" : selected ? "bg-slate-100" : inRange ? "bg-sky-50" : "bg-white hover:bg-emerald-50"].join(" ")}>
                                {!booking && price ? <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-800 shadow-sm">{formatMoney(price)}</span> : null}
                                {!booking && !price ? <span className="text-[10px] font-black text-slate-300">—</span> : null}
                              </button>
                            );
                          })}
                        </div>

                        <div className="pointer-events-none absolute inset-0">
                          {bookings.map((booking) => {
                            const position = bookingPosition(booking, days);
                            if (!position) return null;
                            const tone = channelTone(booking.referrer);
                            return (
                              <button key={booking.booking_id} type="button" onClick={() => setSelectedBooking(booking)} className={["pointer-events-auto absolute top-[7px] h-[54px] overflow-hidden rounded-2xl border px-3 py-2 text-left shadow-[0_8px_18px_rgba(15,23,42,0.08)] transition hover:-translate-y-[1px]", tone.bar].join(" ")} style={{ left: position.left, width: position.width }}>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-black">{booking.guest_name || "Guest"}</div>
                                    <div className="mt-1 truncate text-[10px] font-black opacity-70">{booking.arrival.slice(5)} → {booking.departure.slice(5)} · {formatMoney(booking.price)}</div>
                                  </div>
                                  <span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-black uppercase ${tone.badge}`}>{tone.label}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}
      </div>
      {selectedBooking ? <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} /> : null}
    </main>
  );
}

function StaySearchPanel({ selection, results }: { selection: DateSelection; results: { nights: string[]; fullStay: UnitStay[]; splitStays: SplitStay[] } | null }) {
  const nights = selection.checkIn && selection.checkOut ? nightsBetween(selection.checkIn, selection.checkOut) : 0;
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-wide text-slate-500">Stay search</div>
          <h2 className="mt-1 text-xl font-black text-slate-950">{formatDate(selection.checkIn)} → {formatDate(selection.checkOut)}</h2>
          <p className="mt-1 text-sm font-bold text-slate-500">{selection.checkIn && !selection.checkOut ? "Τώρα πάτησε check-out ημερομηνία." : nights ? `${nights} nights` : "Πάτησε check-in και μετά check-out πάνω στο calendar."}</p>
        </div>

        <div className="min-w-0 flex-1">
          {!results ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">Δεν έχει επιλεγεί ολοκληρωμένο διάστημα.</div>
          ) : results.fullStay.length ? (
            <div>
              <div className="mb-2 text-sm font-black text-emerald-800">Available rooms for full stay</div>
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {results.fullStay.slice(0, 9).map((stay) => <StayCard key={unitKey(stay.unit.room_id, stay.unit.unit_id)} stay={stay} />)}
              </div>
            </div>
          ) : results.splitStays.length ? (
            <div>
              <div className="mb-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-black text-amber-900">Δεν υπάρχει ίδιο δωμάτιο για όλο το διάστημα. Υπάρχει split stay με 1 αλλαγή δωματίου:</div>
              <div className="grid gap-2 xl:grid-cols-2">
                {results.splitStays.map((split, index) => <SplitCard key={`${split.splitDate}-${index}`} split={split} />)}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-black text-rose-900">Δεν βρέθηκε ούτε full stay ούτε split stay με μία αλλαγή δωματίου.</div>
          )}
        </div>
      </div>
    </section>
  );
}

function StayCard({ stay }: { stay: UnitStay }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-950">
      <div className="text-sm font-black">{stay.unit.display_name}</div>
      <div className="mt-1 text-xs font-bold opacity-75">{stay.unit.category}</div>
      <div className="mt-2 text-xs font-black">{stay.nights} nights · {formatMoney(stay.total)}</div>
    </div>
  );
}

function SplitCard({ split }: { split: SplitStay }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-xs font-black uppercase text-amber-700">Split option</div>
        <div className="rounded-full bg-amber-100 px-2 py-1 text-xs font-black text-amber-900">Total {formatMoney(split.total)}</div>
      </div>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="text-sm font-black text-slate-950">{split.first.unit.display_name}</div>
          <div className="text-xs font-bold text-slate-500">{formatDate(split.first.unit ? split.first.unit.room_id && split.first.unit.unit_id ? "" : "" : "")} {split.first.nights} nights · {formatMoney(split.first.total)}</div>
        </div>
        <div className="text-center text-xs font-black text-amber-700">change<br />{formatDate(split.splitDate)}</div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="text-sm font-black text-slate-950">{split.second.unit.display_name}</div>
          <div className="text-xs font-bold text-slate-500">{split.second.nights} nights · {formatMoney(split.second.total)}</div>
        </div>
      </div>
    </div>
  );
}

function BookingModal({ booking, onClose }: { booking: BookingRow; onClose: () => void }) {
  const guest = booking.guest_name || `${booking.first_name || ""} ${booking.last_name || ""}`.trim() || "Guest";
  const phone = booking.mobile || booking.phone || "";
  const tone = channelTone(booking.referrer);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-[#fffdf8] p-5 text-slate-950 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className={`mb-2 inline-flex rounded-full px-3 py-1 text-xs font-black ${tone.badge}`}>{tone.label}</div>
            <h2 className="text-2xl font-black tracking-tight">{guest}</h2>
            <p className="mt-1 text-sm font-bold text-slate-500">{booking.arrival} → {booking.departure} · ID {booking.booking_id}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-xl font-black">×</button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Detail label="Total charges" value={formatMoney(booking.price)} tone="emerald" />
          <Detail label="Status" value={booking.status || "—"} />
          <Detail label="Guests" value={`Adults: ${booking.num_adult ?? "—"} · Children: ${booking.num_child ?? "—"}`} />
          <Detail label="Referrer" value={booking.referrer_label || booking.referrer || "Other"} />
          <Detail label="Email" value={booking.email || "—"} />
          <Detail label="Phone" value={phone || "—"} />
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {booking.email ? <a href={`mailto:${booking.email}`} className="rounded-2xl bg-indigo-700 px-4 py-3 text-center text-sm font-black text-white">Email</a> : null}
          {phone ? <a href={`tel:${phone}`} className="rounded-2xl bg-emerald-700 px-4 py-3 text-center text-sm font-black text-white">Call</a> : null}
          {phone ? <a href={`sms:${phone}`} className="rounded-2xl bg-sky-700 px-4 py-3 text-center text-sm font-black text-white">SMS</a> : null}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone = "stone" }: { label: string; value: number; tone?: "stone" | "emerald" | "sky" }) {
  const styles = {
    stone: "border-slate-200 bg-slate-50 text-slate-950",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    sky: "border-sky-200 bg-sky-50 text-sky-800",
  }[tone];
  return (
    <div className={`rounded-2xl border p-3 shadow-sm ${styles}`}>
      <div className="text-xs font-black uppercase opacity-70">{label}</div>
      <div className="mt-1 text-2xl font-black">{value}</div>
    </div>
  );
}

function Legend({ label, className }: { label: string; className: string }) {
  return <span className={`rounded-full border px-3 py-2 ${className}`}>{label}</span>;
}

function Message({ title, body, danger = false }: { title: string; body: string; danger?: boolean }) {
  return (
    <section className={`rounded-[2rem] border p-8 text-center shadow-sm ${danger ? "border-rose-200 bg-rose-50" : "border-slate-200 bg-white"}`}>
      <h2 className={`text-lg font-black ${danger ? "text-rose-950" : "text-slate-950"}`}>{title}</h2>
      <p className={`mt-1 text-sm font-bold ${danger ? "text-rose-800" : "text-slate-500"}`}>{body}</p>
    </section>
  );
}

function Detail({ label, value, tone = "stone" }: { label: string; value: string; tone?: "stone" | "emerald" }) {
  const styles = tone === "emerald" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500";
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${styles}`}>
      <div className="text-xs font-black uppercase">{label}</div>
      <div className="mt-1 break-words text-sm font-black text-slate-950">{value}</div>
    </div>
  );
}
