"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ALEXANDRIA_PERIODS,
  ALEXANDRIA_ROOMS,
  addDays,
  daysBetween,
  formatGreekDate,
  type AlexandriaPeriod,
} from "@/lib/alexandria/config";

type Booking = {
  id: string;
  room: string;
  checkin: string;
  checkout: string;
  firstName: string;
  lastName: string;
  country: string;
  phone: string;
  email: string;
  notes: string;
};

type Draft = Omit<Booking, "id"> & { id?: string };

const DAY_W = 46; // px per day column
const ROOM_W = 132; // px for the sticky room column
const WEEKDAYS = ["Κυρ", "Δευ", "Τρί", "Τετ", "Πέμ", "Παρ", "Σάβ"];

const BAR_COLORS = [
  "bg-[#9a5b1e]",
  "bg-[#2f6f6a]",
  "bg-[#6b4f8a]",
  "bg-[#a33a3a]",
  "bg-[#3d6a99]",
  "bg-[#5f7a2e]",
];

function daysOf(period: AlexandriaPeriod) {
  const out: string[] = [];
  for (let d = period.viewStart; d <= period.viewEnd; d = addDays(d, 1)) out.push(d);
  return out;
}

function weekday(iso: string) {
  return WEEKDAYS[new Date(`${iso}T12:00:00Z`).getUTCDay()];
}

function emptyDraft(room: string, checkin: string, period: AlexandriaPeriod): Draft {
  // Most students stay until the end of the programme.
  const checkout = checkin < period.programEnd ? period.programEnd : addDays(checkin, 1);
  return {
    room,
    checkin,
    checkout: checkout > period.viewEnd ? period.viewEnd : checkout,
    firstName: "",
    lastName: "",
    country: "",
    phone: "",
    email: "",
    notes: "",
  };
}

export default function AndreasCalendar() {
  const [periodId, setPeriodId] = useState<AlexandriaPeriod["id"]>("june");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");

  const period = ALEXANDRIA_PERIODS.find((p) => p.id === periodId) ?? ALEXANDRIA_PERIODS[0];
  const days = useMemo(() => daysOf(period), [period]);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/andreas/bookings/", { cache: "no-store" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setBookings(data.bookings);
    } catch {
      setLoadError("Δεν φόρτωσαν οι κρατήσεις. Ανανέωσε τη σελίδα.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const periodBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.checkin >= period.viewStart && b.checkout <= period.viewEnd)
        .sort((a, b) => a.checkin.localeCompare(b.checkin) || Number(a.room) - Number(b.room)),
    [bookings, period],
  );

  const colorFor = (id: string) => BAR_COLORS[Number(id) % BAR_COLORS.length];

  const occupied = (room: string, day: string) =>
    periodBookings.some((b) => b.room === room && b.checkin <= day && b.checkout > day);

  async function save() {
    if (!draft) return;
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch("/api/andreas/bookings/", {
        method: draft.id ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!data.ok) {
        setFormError(data.error || "Η αποθήκευση απέτυχε.");
        return;
      }
      setDraft(null);
      setToast(draft.id ? "Η κράτηση ενημερώθηκε" : "Η κράτηση καταχωρήθηκε");
      await load();
    } catch {
      setFormError("Πρόβλημα σύνδεσης. Δοκίμασε ξανά.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!draft?.id) return;
    if (!window.confirm(`Διαγραφή της κράτησης ${draft.firstName} ${draft.lastName};`)) return;
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch(`/api/andreas/bookings/?id=${encodeURIComponent(draft.id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) {
        setFormError(data.error || "Η διαγραφή απέτυχε.");
        return;
      }
      setDraft(null);
      setToast("Η κράτηση διαγράφηκε");
      await load();
    } catch {
      setFormError("Πρόβλημα σύνδεσης. Δοκίμασε ξανά.");
    } finally {
      setSaving(false);
    }
  }

  const gridWidth = ROOM_W + days.length * DAY_W;
  const programNights = daysBetween(period.programStart, period.programEnd);

  return (
    <main className="min-h-screen bg-[#f6efe5] text-stone-900">
      <div className="mx-auto max-w-[1400px] px-3 py-5 sm:px-6">
        <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Voulamandis House · Κάμπος Χίου</p>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Alexandria Institute — Κρατήσεις 2027</h1>
          </div>
          <button
            type="button"
            onClick={() => setDraft(emptyDraft("1", period.programStart, period))}
            className="rounded-full bg-[#805536] px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-[#6b4529] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
          >
            + Νέα κράτηση
          </button>
        </header>

        <div className="mb-3 flex flex-wrap items-center gap-2" role="tablist" aria-label="Περίοδος">
          {ALEXANDRIA_PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={p.id === periodId}
              onClick={() => setPeriodId(p.id)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                p.id === periodId ? "bg-stone-900 text-white" : "bg-white text-stone-700 hover:bg-stone-100"
              }`}
            >
              {p.label}
            </button>
          ))}
          <span className="ml-1 text-sm text-stone-600">
            Πρόγραμμα: <strong>{formatGreekDate(period.programStart)} – {formatGreekDate(period.programEnd)}</strong> ({programNights} νύχτες)
          </span>
        </div>

        <div className="mb-3 flex flex-wrap gap-4 text-xs text-stone-600">
          <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm bg-amber-100 ring-1 ring-amber-300" /> Μέρες προγράμματος</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm bg-white ring-1 ring-stone-300" /> Νωρίτερη άφιξη / αργότερη αναχώρηση</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm bg-sky-100 ring-1 ring-sky-300" /> Economy</span>
          <span>Πάτα σε κενό κελί για νέα κράτηση ή σε κράτηση για αλλαγή.</span>
        </div>

        {loadError && <p className="mb-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{loadError}</p>}

        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
          <div style={{ width: gridWidth }} className="relative">
            {/* Header row */}
            <div className="sticky top-0 z-20 flex border-b border-stone-200 bg-white">
              <div style={{ width: ROOM_W }} className="sticky left-0 z-30 flex items-end bg-white px-3 pb-2 text-xs font-bold text-stone-500">
                Δωμάτιο
              </div>
              {days.map((d) => {
                const inProgram = d >= period.programStart && d < period.programEnd;
                const edge = d === period.programStart ? "Άφιξη" : d === period.programEnd ? "Αναχώρ." : "";
                return (
                  <div
                    key={d}
                    style={{ width: DAY_W }}
                    className={`flex flex-col items-center border-l border-stone-100 py-1.5 text-center ${inProgram ? "bg-amber-50" : ""}`}
                  >
                    <span className="text-[10px] font-semibold uppercase text-stone-500">{weekday(d)}</span>
                    <span className="text-sm font-black">{Number(d.slice(8, 10))}</span>
                    <span className={`text-[9px] font-bold ${edge ? "text-amber-800" : "text-transparent"}`}>{edge || "·"}</span>
                  </div>
                );
              })}
            </div>

            {/* Room rows */}
            {ALEXANDRIA_ROOMS.map((room) => {
              const roomBookings = periodBookings.filter((b) => b.room === room.id);
              return (
                <div
                  key={room.id}
                  className={`relative flex h-14 border-b border-stone-100 last:border-b-0 ${room.economy ? "bg-sky-50" : ""}`}
                >
                  <div
                    style={{ width: ROOM_W }}
                    className={`sticky left-0 z-10 flex flex-col justify-center border-r px-3 ${
                      room.economy ? "border-sky-200 bg-sky-100" : "border-stone-200 bg-white"
                    }`}
                  >
                    <span className="text-sm font-black leading-tight">{room.label}</span>
                    {room.type && (
                      <span className={`text-[11px] ${room.economy ? "font-bold uppercase tracking-wide text-sky-800" : "text-stone-500"}`}>
                        {room.type}
                      </span>
                    )}
                  </div>
                  {days.map((d) => {
                    const inProgram = d >= period.programStart && d < period.programEnd;
                    const isLast = d === period.viewEnd;
                    const busy = occupied(room.id, d);
                    return (
                      <button
                        key={d}
                        type="button"
                        disabled={busy || isLast}
                        aria-label={`${room.label}, ${formatGreekDate(d)}${busy ? " (κρατημένο)" : ""}`}
                        onClick={() => setDraft(emptyDraft(room.id, d, period))}
                        style={{ width: DAY_W }}
                        className={`border-l ${room.economy ? "border-sky-100" : "border-stone-100"} ${inProgram && !room.economy ? "bg-amber-50/70" : ""} ${
                          busy || isLast ? "cursor-default" : "hover:bg-amber-100 focus:outline-none focus-visible:bg-amber-100"
                        }`}
                      />
                    );
                  })}
                  {roomBookings.map((b) => {
                    const start = daysBetween(period.viewStart, b.checkin);
                    const nights = daysBetween(b.checkin, b.checkout);
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setDraft({ ...b })}
                        title={`${b.firstName} ${b.lastName} · ${formatGreekDate(b.checkin)} – ${formatGreekDate(b.checkout)}`}
                        style={{
                          left: ROOM_W + start * DAY_W + DAY_W / 2 + 2,
                          width: nights * DAY_W - 4,
                        }}
                        className={`absolute top-2 z-[5] flex h-10 items-center overflow-hidden rounded-lg px-2 text-left text-white shadow ${colorFor(b.id)} hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900`}
                      >
                        <span className="truncate text-xs font-bold leading-tight">
                          {b.firstName} {b.lastName}
                          <span className="block truncate text-[10px] font-medium opacity-85">
                            {b.country || "—"} · {nights}ν
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* List view */}
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-black">
            Κρατήσεις {period.label} <span className="text-sm font-semibold text-stone-500">({periodBookings.length})</span>
          </h2>
          {loading ? (
            <p className="text-sm text-stone-500">Φόρτωση…</p>
          ) : periodBookings.length === 0 ? (
            <p className="rounded-xl bg-white px-4 py-3 text-sm text-stone-600 ring-1 ring-stone-200">Δεν υπάρχουν ακόμα κρατήσεις για αυτή την περίοδο.</p>
          ) : (
            <ul className="divide-y divide-stone-100 overflow-hidden rounded-xl bg-white ring-1 ring-stone-200">
              {periodBookings.map((b) => (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={() => setDraft({ ...b })}
                    className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-left text-sm hover:bg-amber-50"
                  >
                    <span className={`inline-block h-3 w-3 shrink-0 rounded-full ${colorFor(b.id)}`} />
                    <span className="min-w-[10rem] font-bold">{b.firstName} {b.lastName}</span>
                    <span className="text-stone-600">{ALEXANDRIA_ROOMS.find((r) => r.id === b.room)?.label}</span>
                    <span className="text-stone-600">
                      {formatGreekDate(b.checkin)} → {formatGreekDate(b.checkout)} ({daysBetween(b.checkin, b.checkout)} ν.)
                    </span>
                    <span className="text-stone-500">{b.country}</span>
                    <span className="text-stone-500">{b.phone}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Booking form */}
      {draft && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-form-title"
          onKeyDown={(e) => e.key === "Escape" && !saving && setDraft(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="booking-form-title" className="text-xl font-black">{draft.id ? "Αλλαγή κράτησης" : "Νέα κράτηση"}</h2>
              <button type="button" onClick={() => setDraft(null)} className="rounded-full px-3 py-1 text-xl text-stone-500 hover:bg-stone-100" aria-label="Κλείσιμο">×</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="col-span-2 text-sm font-semibold">
                Δωμάτιο
                <select
                  value={draft.room}
                  onChange={(e) => setDraft({ ...draft, room: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-base"
                >
                  {ALEXANDRIA_ROOMS.map((r) => (
                    <option key={r.id} value={r.id}>{r.type ? `${r.label} — ${r.type}` : r.label}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                Check-in
                <input
                  type="date"
                  required
                  min={period.viewStart}
                  max={addDays(period.viewEnd, -1)}
                  value={draft.checkin}
                  onChange={(e) => setDraft({ ...draft, checkin: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-base"
                />
              </label>
              <label className="text-sm font-semibold">
                Check-out
                <input
                  type="date"
                  required
                  min={addDays(period.viewStart, 1)}
                  max={period.viewEnd}
                  value={draft.checkout}
                  onChange={(e) => setDraft({ ...draft, checkout: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-base"
                />
              </label>
              <div className="col-span-2 -mt-1 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, checkin: period.programStart, checkout: period.programEnd })}
                  className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 hover:bg-amber-200"
                >
                  Όλο το πρόγραμμα ({formatGreekDate(period.programStart).slice(0, 5)}–{formatGreekDate(period.programEnd).slice(0, 5)})
                </button>
                {draft.checkin && draft.checkout > draft.checkin && (
                  <span className="self-center text-xs text-stone-500">{daysBetween(draft.checkin, draft.checkout)} νύχτες</span>
                )}
              </div>
              <label className="text-sm font-semibold">
                Όνομα
                <input
                  required
                  value={draft.firstName}
                  onChange={(e) => setDraft({ ...draft, firstName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-base"
                  autoComplete="off"
                />
              </label>
              <label className="text-sm font-semibold">
                Επώνυμο
                <input
                  required
                  value={draft.lastName}
                  onChange={(e) => setDraft({ ...draft, lastName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-base"
                  autoComplete="off"
                />
              </label>
              <label className="text-sm font-semibold">
                Χώρα
                <input
                  value={draft.country}
                  onChange={(e) => setDraft({ ...draft, country: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-base"
                  autoComplete="off"
                />
              </label>
              <label className="text-sm font-semibold">
                Τηλέφωνο
                <input
                  type="tel"
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-base"
                  autoComplete="off"
                />
              </label>
              <label className="col-span-2 text-sm font-semibold">
                Email <span className="font-normal text-stone-500">(του φοιτητή, για τα μηνύματα πριν και κατά τη διαμονή)</span>
                <input
                  type="email"
                  inputMode="email"
                  value={draft.email ?? ""}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-base"
                  autoComplete="off"
                />
              </label>
              <label className="col-span-2 text-sm font-semibold">
                Σημειώσεις <span className="font-normal text-stone-500">(προαιρετικά)</span>
                <textarea
                  rows={2}
                  value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base"
                />
              </label>
            </div>

            {formError && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">{formError}</p>}

            <div className="mt-5 flex items-center justify-between gap-3">
              {draft.id ? (
                <button type="button" disabled={saving} onClick={remove} className="rounded-full px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">
                  Διαγραφή
                </button>
              ) : (
                <span />
              )}
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#805536] px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-[#6b4529] disabled:opacity-60"
              >
                {saving ? "Αποθήκευση…" : "Αποθήκευση"}
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
