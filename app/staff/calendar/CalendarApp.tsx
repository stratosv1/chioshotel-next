"use client";

import { useEffect, useMemo, useState } from "react";

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
  room_id: string;
  unit_id: string;
  guest_name: string | null;
  arrival: string;
  departure: string;
  status: string | null;
  referrer: string | null;
  price: number | null;
};

type CalendarPayload = {
  ok: boolean;
  range: {
    start: string;
    end: string;
  };
  units: CalendarUnit[];
  availability: AvailabilityRow[];
  bookings: BookingRow[];
  generatedAt: string;
};

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
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
  return new Intl.DateTimeFormat("el-GR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function shortDayLabel(value: string) {
  const date = parseDate(value);

  return {
    day: new Intl.DateTimeFormat("el-GR", { day: "2-digit" }).format(date),
    week: new Intl.DateTimeFormat("el-GR", { weekday: "short" }).format(date),
  };
}

function unitKey(roomId: string, unitId: string) {
  return `${roomId}:${unitId}`;
}

function bookingColor(referrer: string | null) {
  const text = String(referrer || "").toLowerCase();

  if (text.includes("booking")) {
    return "border-sky-300 bg-sky-100 text-sky-950";
  }

  if (text.includes("expedia")) {
    return "border-yellow-300 bg-yellow-100 text-yellow-950";
  }

  if (text.includes("direct")) {
    return "border-emerald-300 bg-emerald-100 text-emerald-950";
  }

  return "border-violet-300 bg-violet-100 text-violet-950";
}

function unitColor(category: string) {
  const text = category.toLowerCase();

  if (text.includes("economy")) {
    return "from-emerald-500 to-emerald-600";
  }

  if (text.includes("ground")) {
    return "from-orange-500 to-orange-600";
  }

  if (text.includes("first")) {
    return "from-blue-500 to-blue-600";
  }

  if (text.includes("apt 11")) {
    return "from-pink-600 to-pink-700";
  }

  return "from-violet-500 to-violet-600";
}

function isBookingOnDate(booking: BookingRow, date: string) {
  return booking.arrival <= date && booking.departure > date;
}

function isBookingStart(booking: BookingRow, date: string) {
  return booking.arrival === date;
}

export default function CalendarApp() {
  const today = useMemo(() => new Date(), []);
  const [anchorMonth, setAnchorMonth] = useState(startOfMonth(today));
  const [data, setData] = useState<CalendarPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);

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
        const response = await fetch(`/api/staff/calendar?start=${range.start}&end=${range.end}`, {
          cache: "no-store",
        });

        const payload = await response.json();

        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || "Calendar API error.");
        }

        if (!cancelled) {
          setData(payload);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCalendar();

    return () => {
      cancelled = true;
    };
  }, [range.start, range.end]);

  const availabilityMap = useMemo(() => {
    const map = new Map<string, AvailabilityRow>();

    data?.availability.forEach((row) => {
      map.set(`${unitKey(row.room_id, row.unit_id)}:${row.date}`, row);
    });

    return map;
  }, [data]);

  const bookingsByUnit = useMemo(() => {
    const map = new Map<string, BookingRow[]>();

    data?.bookings.forEach((booking) => {
      const key = unitKey(booking.room_id, booking.unit_id);
      const list = map.get(key) || [];
      list.push(booking);
      map.set(key, list);
    });

    return map;
  }, [data]);

  const stats = useMemo(() => {
    const bookings = data?.bookings || [];
    const arrivals = bookings.filter((booking) => booking.arrival >= range.start && booking.arrival <= range.end).length;
    const departures = bookings.filter((booking) => booking.departure >= range.start && booking.departure <= range.end).length;
    const availablePrices = data?.availability.filter((row) => row.available && Number(row.price || 0) > 0).length || 0;

    return {
      units: data?.units.length || 0,
      bookings: bookings.length,
      arrivals,
      departures,
      availablePrices,
    };
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <a
                href="/staff"
                className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-black text-slate-200 transition hover:bg-white/10"
              >
                ← Επιστροφή στο Staff
              </a>

              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-2xl shadow-lg shadow-cyan-500/20">
                  🏨
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                    Hotel Calendar
                  </h1>
                  <p className="text-sm font-bold text-slate-400">
                    Modern PMS view · rooms · availability · bookings
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 xl:min-w-[760px]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs font-black uppercase text-slate-400">Units</div>
                <div className="mt-1 text-2xl font-black text-white">{stats.units}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs font-black uppercase text-slate-400">Bookings</div>
                <div className="mt-1 text-2xl font-black text-white">{stats.bookings}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs font-black uppercase text-slate-400">Arrivals</div>
                <div className="mt-1 text-2xl font-black text-emerald-300">{stats.arrivals}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs font-black uppercase text-slate-400">Departures</div>
                <div className="mt-1 text-2xl font-black text-rose-300">{stats.departures}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs font-black uppercase text-slate-400">Prices</div>
                <div className="mt-1 text-2xl font-black text-amber-300">{stats.availablePrices}</div>
              </div>
            </div>
          </div>
        </header>

        <section className="border-b border-white/10 bg-slate-900/70 px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={previousMonth}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white transition hover:bg-white/10"
              >
                ←
              </button>
              <button
                type="button"
                onClick={goToday}
                className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/20"
              >
                Today
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white transition hover:bg-white/10"
              >
                →
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <div className="text-lg font-black capitalize text-white">{monthLabel(anchorMonth)}</div>
              <div className="text-xs font-bold text-slate-400">
                {range.start} → {range.end}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-black">
              <span className="rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-2 text-sky-100">Booking.com</span>
              <span className="rounded-full border border-yellow-300/30 bg-yellow-300/10 px-3 py-2 text-yellow-100">Expedia</span>
              <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-emerald-100">Direct</span>
              <span className="rounded-full border border-violet-300/30 bg-violet-300/10 px-3 py-2 text-violet-100">Other</span>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="grid flex-1 place-items-center p-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-300/20 border-t-cyan-300" />
              <div className="text-lg font-black text-white">Loading calendar...</div>
              <div className="mt-1 text-sm font-bold text-slate-400">Διαβάζω τη Neon βάση.</div>
            </div>
          </section>
        ) : error ? (
          <section className="grid flex-1 place-items-center p-8">
            <div className="max-w-xl rounded-3xl border border-rose-300/20 bg-rose-950/40 p-8 text-center shadow-2xl">
              <div className="text-4xl">⚠️</div>
              <h2 className="mt-3 text-xl font-black text-white">Calendar error</h2>
              <p className="mt-2 text-sm font-bold text-rose-100">{error}</p>
            </div>
          </section>
        ) : (
          <section className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto">
              <div
                className="grid min-w-max"
                style={{
                  gridTemplateColumns: `210px repeat(${days.length}, 96px)`,
                }}
              >
                <div className="sticky left-0 top-0 z-20 border-b border-r border-white/10 bg-slate-900 p-3 text-sm font-black text-white">
                  Room / Unit
                </div>

                {days.map((day) => {
                  const label = shortDayLabel(day);
                  const isToday = day === dateOnly(new Date());

                  return (
                    <div
                      key={day}
                      className={[
                        "sticky top-0 z-10 border-b border-r border-white/10 p-2 text-center",
                        isToday ? "bg-cyan-500 text-white" : "bg-slate-900 text-slate-200",
                      ].join(" ")}
                    >
                      <div className="text-base font-black">{label.day}</div>
                      <div className="text-[10px] font-black uppercase opacity-80">{label.week}</div>
                    </div>
                  );
                })}

                {(data?.units || []).map((unit) => {
                  const key = unitKey(unit.room_id, unit.unit_id);
                  const unitBookings = bookingsByUnit.get(key) || [];

                  return (
                    <div key={key} className="contents">
                      <div className={`sticky left-0 z-10 border-b border-r border-white/10 bg-gradient-to-br ${unitColor(unit.category)} p-3 shadow-xl shadow-slate-950/20`}>
                        <div className="text-sm font-black text-white">{unit.display_name}</div>
                        <div className="mt-1 text-[11px] font-bold text-white/85">{unit.category}</div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {unit.floor ? (
                            <span className="rounded-full bg-white/20 px-2 py-1 text-[10px] font-black text-white">
                              {unit.floor}
                            </span>
                          ) : null}
                          {unit.max_guests ? (
                            <span className="rounded-full bg-white/20 px-2 py-1 text-[10px] font-black text-white">
                              {unit.max_guests} pax
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {days.map((day) => {
                        const booking = unitBookings.find((item) => isBookingOnDate(item, day));
                        const availability = availabilityMap.get(`${key}:${day}`);

                        if (booking) {
                          const starts = isBookingStart(booking, day);

                          return (
                            <button
                              key={`${key}-${day}`}
                              type="button"
                              onClick={() => setSelectedBooking(booking)}
                              className={[
                                "relative min-h-[72px] border-b border-r border-white/10 p-1 text-left transition hover:brightness-110",
                                bookingColor(booking.referrer),
                              ].join(" ")}
                            >
                              {starts ? (
                                <div className="h-full rounded-xl border border-current/20 bg-white/35 p-2">
                                  <div className="truncate text-xs font-black">
                                    {booking.guest_name || "Guest"}
                                  </div>
                                  <div className="mt-1 truncate text-[10px] font-black opacity-80">
                                    {booking.referrer || "Other"}
                                  </div>
                                  <div className="mt-1 text-[10px] font-black opacity-80">
                                    {booking.arrival.slice(5)} → {booking.departure.slice(5)}
                                  </div>
                                </div>
                              ) : (
                                <div className="grid h-full place-items-center text-[10px] font-black opacity-70">
                                  stay
                                </div>
                              )}
                            </button>
                          );
                        }

                        if (availability?.available && Number(availability.price || 0) > 0) {
                          return (
                            <div
                              key={`${key}-${day}`}
                              className="grid min-h-[72px] place-items-center border-b border-r border-white/10 bg-lime-100 p-1 text-lime-950"
                            >
                              <div className="rounded-xl border border-lime-700/20 bg-white/70 px-2 py-1 text-xs font-black">
                                €{Number(availability.price).toFixed(0)}
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={`${key}-${day}`}
                            className="min-h-[72px] border-b border-r border-white/10 bg-slate-900/70 p-1"
                          >
                            {availability?.reason ? (
                              <div className="grid h-full place-items-center text-[10px] font-black uppercase text-slate-600">
                                {availability.reason}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {data?.units.length === 0 ? (
              <div className="p-8">
                <div className="rounded-3xl border border-amber-300/20 bg-amber-950/30 p-8 text-center">
                  <div className="text-4xl">🗄️</div>
                  <h2 className="mt-3 text-xl font-black text-white">Δεν υπάρχουν units στη Neon βάση.</h2>
                  <p className="mt-2 text-sm font-bold text-amber-100">
                    Πρώτα πρέπει να υπάρχει το staff_units seed.
                  </p>
                </div>
              </div>
            ) : null}
          </section>
        )}
      </div>

      {selectedBooking ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4 backdrop-blur" onClick={() => setSelectedBooking(null)}>
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white p-5 text-slate-950 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase text-slate-500">Booking details</div>
                <h2 className="mt-1 text-2xl font-black">{selectedBooking.guest_name || "Guest"}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-xl font-black"
              >
                ×
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-xs font-black uppercase text-slate-500">Booking ID</div>
                <div className="mt-1 break-all text-sm font-black">{selectedBooking.booking_id}</div>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-xs font-black uppercase text-slate-500">Referrer</div>
                <div className="mt-1 text-sm font-black">{selectedBooking.referrer || "Other"}</div>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4">
                <div className="text-xs font-black uppercase text-emerald-700">Arrival</div>
                <div className="mt-1 text-sm font-black">{selectedBooking.arrival}</div>
              </div>
              <div className="rounded-2xl bg-rose-50 p-4">
                <div className="text-xs font-black uppercase text-rose-700">Departure</div>
                <div className="mt-1 text-sm font-black">{selectedBooking.departure}</div>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-xs font-black uppercase text-slate-500">Status</div>
                <div className="mt-1 text-sm font-black">{selectedBooking.status || "—"}</div>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-xs font-black uppercase text-slate-500">Price</div>
                <div className="mt-1 text-sm font-black">
                  {selectedBooking.price ? `€${Number(selectedBooking.price).toFixed(2)}` : "—"}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="mt-5 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
            >
              Κλείσιμο
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
