"use client";

import { useEffect, useMemo, useState } from "react";

const DAY_WIDTH = 96;
const ROOM_WIDTH = 210;
const ROW_HEIGHT = 78;

type CalendarUnit = {
  room_id: string;
  unit_id: string;
  display_name: string;
  category: string;
  floor: string | null;
  max_guests: number | null;
  sort_order: number | null;
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
  raw_booking: unknown;
  price: number | null;
};

type NewBookingDraft = {
  roomId: string;
  unitId: string;
  roomLabel: string;
  category: string;
  arrival: string;
  departure: string;
  price: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile: string;
  adults: number;
  children: number;
  notes: string;
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

type SyncPayload = {
  ok: boolean;
  fetched?: number;
  saved?: number;
  skipped?: number;
  durationMs?: number;
  generatedAt?: string;
  error?: string;
};

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
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

function shortDayLabel(value: string) {
  const date = parseDate(value);

  return {
    day: new Intl.DateTimeFormat("el-GR", { day: "2-digit" }).format(date),
    week: new Intl.DateTimeFormat("el-GR", { weekday: "short" }).format(date),
  };
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("el-GR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function unitKey(roomId: string, unitId: string) {
  return `${roomId}:${unitId}`;
}

function bookingColor(referrer: string | null) {
  const text = String(referrer || "").toLowerCase();

  if (text.includes("booking")) return "border-sky-300 bg-sky-50 text-sky-950";
  if (text.includes("expedia")) return "border-amber-300 bg-amber-50 text-amber-950";
  if (text.includes("direct")) return "border-emerald-300 bg-emerald-50 text-emerald-950";

  return "border-stone-300 bg-stone-50 text-stone-950";
}

function unitStyle(category: string) {
  const text = category.toLowerCase();

  if (text.includes("economy")) return "border-emerald-200 bg-emerald-50 text-emerald-950";
  if (text.includes("ground")) return "border-orange-200 bg-orange-50 text-orange-950";
  if (text.includes("first")) return "border-blue-200 bg-blue-50 text-blue-950";
  if (text.includes("apt 11")) return "border-rose-200 bg-rose-50 text-rose-950";

  return "border-violet-200 bg-violet-50 text-violet-950";
}

function isCancelled(status: string | null) {
  const value = String(status || "").toLowerCase();
  return value.includes("cancel") || value.includes("deleted");
}

function isBookingOnDate(booking: BookingRow, date: string) {
  if (isCancelled(booking.status)) return false;
  return booking.arrival <= date && booking.departure > date;
}

function clampDate(value: string, min: string, maxExclusive: string) {
  if (value < min) return min;
  if (value > maxExclusive) return maxExclusive;
  return value;
}

function getBookingBarPosition(booking: BookingRow, days: string[]) {
  if (days.length === 0) return null;

  const rangeStart = days[0];
  const rangeEndExclusive = addDays(days[days.length - 1], 1);
  const visibleStart = clampDate(booking.arrival, rangeStart, rangeEndExclusive);
  const visibleEnd = clampDate(booking.departure, rangeStart, rangeEndExclusive);
  const startIndex = days.indexOf(visibleStart);
  let endIndex = days.indexOf(visibleEnd);

  if (startIndex === -1) return null;
  if (endIndex === -1) endIndex = visibleEnd >= rangeEndExclusive ? days.length : startIndex + 1;

  const span = Math.max(0, endIndex - startIndex);
  if (span <= 0) return null;

  return { left: startIndex * DAY_WIDTH + 4, width: span * DAY_WIDTH - 8 };
}

async function readJsonResponse<T>(response: Response, fallbackLabel: string) {
  const responseText = await response.text();

  if (!responseText.trim()) throw new Error(`Empty ${fallbackLabel} response. Status ${response.status}`);

  let payload: T & { ok?: boolean; error?: string; message?: string };

  try {
    payload = JSON.parse(responseText) as T & { ok?: boolean; error?: string; message?: string };
  } catch {
    throw new Error(`Non-JSON ${fallbackLabel} response. Status ${response.status}. Body: ${responseText.slice(0, 220)}`);
  }

  if (!response.ok || payload.ok === false) {
    throw new Error(payload.error || payload.message || `${fallbackLabel} error. Status ${response.status}`);
  }

  return payload as T;
}

export default function CalendarApp() {
  const today = useMemo(() => new Date(), []);
  const [anchorMonth, setAnchorMonth] = useState(startOfMonth(today));
  const [data, setData] = useState<CalendarPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);
  const [newBooking, setNewBooking] = useState<NewBookingDraft | null>(null);
  const [newBookingSaving, setNewBookingSaving] = useState(false);
  const [newBookingError, setNewBookingError] = useState("");

  const range = useMemo(() => {
    const start = dateOnly(startOfMonth(anchorMonth));
    const end = dateOnly(endOfMonth(anchorMonth));
    return { start, end };
  }, [anchorMonth]);

  const days = useMemo(() => makeDays(range.start, range.end), [range.start, range.end]);

  useEffect(() => {
    let cancelled = false;

    async function loadCalendar() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/staff/calendar/?start=${encodeURIComponent(range.start)}&end=${encodeURIComponent(range.end)}`,
          { cache: "no-store", credentials: "same-origin" },
        );
        const payload = await readJsonResponse<CalendarPayload>(response, "calendar API");

        if (!cancelled) setData(payload);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCalendar();

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
        const list = map.get(key) || [];
        list.push(booking);
        map.set(key, list);
      });

    return map;
  }, [data]);

  const stats = useMemo(() => {
    const bookings = (data?.bookings || []).filter((booking) => !isCancelled(booking.status));
    const arrivals = bookings.filter((booking) => booking.arrival >= range.start && booking.arrival <= range.end).length;
    const departures = bookings.filter((booking) => booking.departure >= range.start && booking.departure <= range.end).length;
    const availablePrices = data?.availability.filter((row) => row.available && Number(row.price || 0) > 0).length || 0;

    return { units: data?.units.length || 0, bookings: bookings.length, arrivals, departures, availablePrices };
  }, [data, range.end, range.start]);

  function previousMonth() {
    setAnchorMonth(new Date(anchorMonth.getFullYear(), anchorMonth.getMonth() - 1, 1));
  }

  function nextMonth() {
    setAnchorMonth(new Date(anchorMonth.getFullYear(), anchorMonth.getMonth() + 1, 1));
  }

  function goToday() {
    setAnchorMonth(startOfMonth(new Date()));
  }

  function openNewBooking(unit: CalendarUnit, day: string, price: number | null) {
    setNewBookingError("");
    setNewBooking({
      roomId: unit.room_id,
      unitId: unit.unit_id,
      roomLabel: unit.display_name,
      category: unit.category,
      arrival: day,
      departure: addDays(day, 1),
      price,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      mobile: "",
      adults: 2,
      children: 0,
      notes: "",
    });
  }

  async function refreshFromBeds24(showSuccessAlert = true) {
    if (syncing) return;

    setSyncing(true);
    setSyncMessage("Syncing Beds24...");

    try {
      const response = await fetch("/api/staff/calendar/sync", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
      });
      const payload = await readJsonResponse<SyncPayload>(response, "Beds24 sync");
      const message = `Beds24 updated: fetched ${payload.fetched ?? 0}, saved ${payload.saved ?? 0}, skipped ${payload.skipped ?? 0}.`;
      setSyncMessage(message);
      setReloadToken((value) => value + 1);
      if (showSuccessAlert) alert(message);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown Beds24 sync error.";
      setSyncMessage(`Sync failed: ${message}`);
      if (showSuccessAlert) alert(`Beds24 sync failed: ${message}`);
    } finally {
      setSyncing(false);
    }
  }

  async function submitNewBooking() {
    if (!newBooking || newBookingSaving) return;

    setNewBookingSaving(true);
    setNewBookingError("");

    try {
      const response = await fetch("/api/staff/booker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({
          roomId: Number(newBooking.roomId),
          unitId: Number(newBooking.unitId),
          arrival: newBooking.arrival,
          departure: newBooking.departure,
          firstName: newBooking.firstName,
          lastName: newBooking.lastName,
          email: newBooking.email,
          phone: newBooking.phone,
          mobile: newBooking.mobile,
          adults: Number(newBooking.adults || 1),
          children: Number(newBooking.children || 0),
          price: newBooking.price ?? "",
          notes: newBooking.notes,
          comments: newBooking.notes,
          referrer: "Staff Direct",
          language: "en",
        }),
      });

      const result = await readJsonResponse<{ bookingId?: string }>(response, "booking API");
      setNewBooking(null);
      await refreshFromBeds24(false);
      alert(`Booking created in Beds24${result.bookingId ? `: ${result.bookingId}` : ""}`);
    } catch (err) {
      setNewBookingError(err instanceof Error ? err.message : "Unknown booking error.");
    } finally {
      setNewBookingSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-800">
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col">
        <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur-xl sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <a href="/staff" className="mb-3 inline-flex rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-black text-stone-700 transition hover:bg-stone-100">
                ← Επιστροφή στο Staff
              </a>

              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-200 bg-emerald-50 text-2xl text-emerald-800 shadow-sm">🏡</div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Staff Calendar</h1>
                  <p className="text-sm font-bold text-slate-500">Voulamandis House · availability · bookings · live rates</p>
                  <p className="mt-1 text-xs font-bold text-slate-400">Calendar loaded: {formatDateTime(data?.generatedAt)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 xl:min-w-[760px]">
              <StatCard label="Units" value={stats.units} />
              <StatCard label="Bookings" value={stats.bookings} />
              <StatCard label="Arrivals" value={stats.arrivals} tone="emerald" />
              <StatCard label="Departures" value={stats.departures} tone="rose" />
              <StatCard label="Prices" value={stats.availablePrices} tone="amber" />
            </div>
          </div>
        </header>

        <section className="border-b border-stone-200 bg-[#fbfaf6] px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={previousMonth} className="rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:bg-stone-50">←</button>
              <button type="button" onClick={goToday} className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800 shadow-sm transition hover:bg-emerald-100">Today</button>
              <button type="button" onClick={nextMonth} className="rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:bg-stone-50">→</button>
              <button
                type="button"
                disabled={syncing}
                onClick={() => refreshFromBeds24(true)}
                className="rounded-2xl border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60"
              >
                {syncing ? "Refreshing Beds24..." : "Refresh Beds24"}
              </button>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-center shadow-sm">
              <div className="text-lg font-black capitalize text-slate-950">{monthLabel(anchorMonth)}</div>
              <div className="text-xs font-bold text-slate-500">{range.start} → {range.end}</div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-black">
              <Legend label="Booking.com" className="border-sky-200 bg-sky-50 text-sky-800" />
              <Legend label="Expedia" className="border-amber-200 bg-amber-50 text-amber-800" />
              <Legend label="Direct" className="border-emerald-200 bg-emerald-50 text-emerald-800" />
              <Legend label="Other" className="border-stone-200 bg-stone-50 text-stone-700" />
            </div>
          </div>

          {syncMessage ? (
            <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-900">
              {syncMessage}
            </div>
          ) : null}
        </section>

        {loading ? (
          <CenteredMessage title="Loading calendar..." body="Διαβάζω τη Neon βάση." />
        ) : error ? (
          <CenteredMessage title="Calendar error" body={error} danger />
        ) : (
          <section className="flex-1 overflow-hidden bg-[#f7f3ea]">
            <div className="h-full overflow-auto p-4">
              <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-black text-amber-900 sm:hidden">
                Σύρε δεξιά/αριστερά για όλες τις ημέρες. Η αριστερή στήλη μένει σταθερή.
              </div>

              <div className="min-w-max overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
                <div className="flex">
                  <div className="sticky left-0 top-0 z-30 border-b border-r border-stone-200 bg-stone-100 p-3 text-sm font-black text-slate-900" style={{ width: ROOM_WIDTH, minWidth: ROOM_WIDTH }}>
                    Room / Unit
                  </div>

                  <div className="grid" style={{ width: days.length * DAY_WIDTH, gridTemplateColumns: `repeat(${days.length}, ${DAY_WIDTH}px)` }}>
                    {days.map((day) => {
                      const label = shortDayLabel(day);
                      const isToday = day === dateOnly(new Date());

                      return (
                        <div key={day} className={["sticky top-0 z-20 border-b border-r border-stone-200 p-2 text-center", isToday ? "bg-emerald-100 text-emerald-950" : "bg-stone-50 text-slate-700"].join(" ")}>
                          <div className="text-base font-black">{label.day}</div>
                          <div className="text-[10px] font-black uppercase opacity-70">{label.week}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {(data?.units || []).map((unit) => {
                  const key = unitKey(unit.room_id, unit.unit_id);
                  const unitBookings = bookingsByUnit.get(key) || [];

                  return (
                    <div key={key} className="flex">
                      <div className={`sticky left-0 z-10 border-b border-r p-3 shadow-sm ${unitStyle(unit.category)}`} style={{ width: ROOM_WIDTH, minWidth: ROOM_WIDTH, height: ROW_HEIGHT }}>
                        <div className="text-sm font-black">{unit.display_name}</div>
                        <div className="mt-1 text-[11px] font-bold opacity-80">{unit.category}</div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {unit.floor ? <span className="rounded-full bg-white/70 px-2 py-1 text-[10px] font-black">{unit.floor}</span> : null}
                          {unit.max_guests ? <span className="rounded-full bg-white/70 px-2 py-1 text-[10px] font-black">{unit.max_guests} pax</span> : null}
                        </div>
                      </div>

                      <div className="relative" style={{ width: days.length * DAY_WIDTH, minWidth: days.length * DAY_WIDTH, height: ROW_HEIGHT }}>
                        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${days.length}, ${DAY_WIDTH}px)` }}>
                          {days.map((day) => {
                            const booking = unitBookings.find((item) => isBookingOnDate(item, day));
                            const availability = availabilityMap.get(`${key}:${day}`);
                            const price = availability?.available && Number(availability.price || 0) > 0 ? Number(availability.price) : null;

                            return (
                              <button
                                key={`${key}-${day}`}
                                type="button"
                                onClick={() => {
                                  if (!booking && price) openNewBooking(unit, day, price);
                                }}
                                className={[
                                  "grid border-b border-r border-stone-200 p-1 text-center",
                                  booking ? "bg-white" : price ? "place-items-center bg-lime-50 text-lime-900 transition hover:bg-lime-100 hover:ring-2 hover:ring-emerald-300" : "place-items-center bg-white text-stone-300",
                                ].join(" ")}
                              >
                                {!booking && price ? <div className="rounded-xl border border-lime-200 bg-white px-2 py-1 text-xs font-black shadow-sm">€{price.toFixed(0)}</div> : null}
                                {!booking && !price ? <div className="text-[10px] font-black text-stone-200">—</div> : null}
                              </button>
                            );
                          })}
                        </div>

                        <div className="pointer-events-none absolute inset-0">
                          {unitBookings.map((booking) => {
                            const position = getBookingBarPosition(booking, days);
                            if (!position) return null;

                            return (
                              <button
                                key={booking.booking_id}
                                type="button"
                                onClick={() => setSelectedBooking(booking)}
                                className={["pointer-events-auto absolute top-2 h-[58px] overflow-hidden rounded-2xl border px-3 py-2 text-left shadow-sm transition hover:brightness-95", bookingColor(booking.referrer)].join(" ")}
                                style={{ left: position.left, width: position.width }}
                              >
                                <div className="truncate text-sm font-black">{booking.guest_name || "Guest"}</div>
                                <div className="mt-1 truncate text-[10px] font-black opacity-75">{(booking.referrer || "Other").toLowerCase()} · {booking.arrival.slice(5)} → {booking.departure.slice(5)} · ID {booking.booking_id}</div>
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

            {data?.units.length === 0 ? (
              <div className="p-8">
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center shadow-sm">
                  <div className="text-4xl">🗄️</div>
                  <h2 className="mt-3 text-xl font-black text-amber-950">Δεν υπάρχουν units στη Neon βάση.</h2>
                  <p className="mt-2 text-sm font-bold text-amber-800">Πρώτα πρέπει να υπάρχει το staff_units seed.</p>
                </div>
              </div>
            ) : null}
          </section>
        )}
      </div>

      {newBooking ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur" onClick={() => setNewBooking(null)}>
          <div className="w-full max-w-xl rounded-3xl border border-stone-200 bg-white p-5 text-slate-950 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase text-emerald-700">New Booking</div>
                <h2 className="mt-1 text-2xl font-black">{newBooking.roomLabel}</h2>
                <p className="mt-1 text-sm font-bold text-slate-500">{newBooking.arrival} → {newBooking.departure} · €{newBooking.price ?? "—"}</p>
              </div>
              <button type="button" onClick={() => setNewBooking(null)} className="grid h-10 w-10 place-items-center rounded-full bg-stone-100 text-xl font-black">×</button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <DraftInput label="First name" value={newBooking.firstName} onChange={(value) => setNewBooking({ ...newBooking, firstName: value })} />
              <DraftInput label="Last name" value={newBooking.lastName} onChange={(value) => setNewBooking({ ...newBooking, lastName: value })} />
              <DraftInput label="Arrival" type="date" value={newBooking.arrival} onChange={(value) => setNewBooking({ ...newBooking, arrival: value })} />
              <DraftInput label="Departure" type="date" value={newBooking.departure} onChange={(value) => setNewBooking({ ...newBooking, departure: value })} />
              <DraftInput label="Email" type="email" value={newBooking.email} onChange={(value) => setNewBooking({ ...newBooking, email: value })} />
              <DraftInput label="Mobile" value={newBooking.mobile} onChange={(value) => setNewBooking({ ...newBooking, mobile: value })} />
              <DraftInput label="Adults" type="number" value={String(newBooking.adults)} onChange={(value) => setNewBooking({ ...newBooking, adults: Number(value) })} />
              <DraftInput label="Children" type="number" value={String(newBooking.children)} onChange={(value) => setNewBooking({ ...newBooking, children: Number(value) })} />
            </div>

            <label className="mt-3 block">
              <span className="text-xs font-black uppercase text-slate-500">Notes</span>
              <textarea value={newBooking.notes} onChange={(event) => setNewBooking({ ...newBooking, notes: event.target.value })} className="mt-1 min-h-24 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-bold outline-none focus:border-emerald-400" />
            </label>

            {newBookingError ? <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-800">{newBookingError}</div> : null}

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => setNewBooking(null)} className="rounded-2xl bg-stone-100 px-4 py-3 text-sm font-black text-slate-700">Cancel</button>
              <button type="button" disabled={newBookingSaving} onClick={submitNewBooking} className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white disabled:opacity-50">{newBookingSaving ? "Saving..." : "Create booking"}</button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedBooking ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur" onClick={() => setSelectedBooking(null)}>
          <div className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-5 text-slate-950 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase text-slate-500">Booking details</div>
                <h2 className="mt-1 text-2xl font-black">{selectedBooking.guest_name || "Guest"}</h2>
              </div>
              <button type="button" onClick={() => setSelectedBooking(null)} className="grid h-10 w-10 place-items-center rounded-full bg-stone-100 text-xl font-black">×</button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Detail label="Booking ID" value={selectedBooking.booking_id} />
              <Detail label="Book ID" value={selectedBooking.book_id || "—"} />
              <Detail label="Arrival" value={selectedBooking.arrival} tone="emerald" />
              <Detail label="Departure" value={selectedBooking.departure} tone="rose" />
              <Detail label="Guest" value={selectedBooking.guest_name || `${selectedBooking.first_name || ""} ${selectedBooking.last_name || ""}`.trim() || "—"} tone="sky" />
              <Detail label="Guests" value={`Adults: ${selectedBooking.num_adult ?? "—"} · Children: ${selectedBooking.num_child ?? "—"}`} tone="amber" />
              <Detail label="Email" value={selectedBooking.email || "—"} />
              <Detail label="Phone / Mobile" value={selectedBooking.mobile || selectedBooking.phone || "—"} />
              <Detail label="Referrer" value={selectedBooking.referrer_label || selectedBooking.referrer || "Other"} />
              <Detail label="Channel / Source" value={`${selectedBooking.channel || "—"} / ${selectedBooking.source || "—"}`} />
              <Detail label="Status" value={selectedBooking.status || "—"} />
              <Detail label="Price" value={selectedBooking.price ? `€${Number(selectedBooking.price).toFixed(2)}` : "—"} />
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {selectedBooking.email ? <a href={`mailto:${selectedBooking.email}`} className="rounded-2xl bg-indigo-700 px-4 py-3 text-center text-sm font-black text-white shadow-sm hover:bg-indigo-800">Send Email</a> : null}
              {selectedBooking.mobile || selectedBooking.phone ? <a href={`tel:${selectedBooking.mobile || selectedBooking.phone}`} className="rounded-2xl bg-emerald-700 px-4 py-3 text-center text-sm font-black text-white">Call Guest</a> : null}
              {selectedBooking.mobile || selectedBooking.phone ? <a href={`sms:${selectedBooking.mobile || selectedBooking.phone}`} className="rounded-2xl bg-sky-700 px-4 py-3 text-center text-sm font-black text-white">SMS</a> : null}
            </div>

            <button type="button" onClick={() => setSelectedBooking(null)} className="mt-5 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white">Κλείσιμο</button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function StatCard({ label, value, tone = "stone" }: { label: string; value: number; tone?: "stone" | "emerald" | "rose" | "amber" }) {
  const styles = {
    stone: "border-stone-200 bg-white text-slate-950",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    rose: "border-rose-200 bg-rose-50 text-rose-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
  }[tone];

  const labelStyles = {
    stone: "text-slate-500",
    emerald: "text-emerald-700",
    rose: "text-rose-700",
    amber: "text-amber-700",
  }[tone];

  return (
    <div className={`rounded-2xl border p-3 shadow-sm ${styles}`}>
      <div className={`text-xs font-black uppercase ${labelStyles}`}>{label}</div>
      <div className="mt-1 text-2xl font-black">{value}</div>
    </div>
  );
}

function Legend({ label, className }: { label: string; className: string }) {
  return <span className={`rounded-full border px-3 py-2 ${className}`}>{label}</span>;
}

function CenteredMessage({ title, body, danger = false }: { title: string; body: string; danger?: boolean }) {
  return (
    <section className="grid flex-1 place-items-center p-8">
      <div className={`max-w-xl rounded-3xl border p-8 text-center shadow-sm ${danger ? "border-rose-200 bg-rose-50" : "border-stone-200 bg-white"}`}>
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" />
        <div className={`text-lg font-black ${danger ? "text-rose-950" : "text-slate-950"}`}>{title}</div>
        <div className={`mt-1 whitespace-pre-wrap break-words text-sm font-bold ${danger ? "text-rose-800" : "text-slate-500"}`}>{body}</div>
      </div>
    </section>
  );
}

function DraftInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-500">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-bold outline-none focus:border-emerald-400" />
    </label>
  );
}

function Detail({ label, value, tone = "stone" }: { label: string; value: string; tone?: "stone" | "emerald" | "rose" | "sky" | "amber" }) {
  const styles = {
    stone: "bg-stone-100 text-slate-500",
    emerald: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
    sky: "bg-sky-50 text-sky-700",
    amber: "bg-amber-50 text-amber-700",
  }[tone];

  return (
    <div className={`rounded-2xl p-4 ${styles}`}>
      <div className="text-xs font-black uppercase">{label}</div>
      <div className="mt-1 break-all text-sm font-black text-slate-950">{value}</div>
    </div>
  );
}
