"use client";

import { useEffect, useState } from "react";
import type { RoomDay, RoomStay } from "@/lib/crm/room-day";

const athensToday = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Athens" }).format(new Date());
const shiftDay = (day: string, delta: number) => new Date(Date.parse(day) + delta * 86_400_000).toISOString().slice(0, 10);
const dayLabel = (day: string) => new Intl.DateTimeFormat("el-GR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));
const shortDate = (day: string) => new Intl.DateTimeFormat("el-GR", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));
const roomKind = (room: number) => (room >= 8 ? "Διαμέρισμα" : "Δωμάτιο");
const navButton = "min-h-11 rounded-full border border-amber-800/30 bg-white px-4 text-sm font-black text-amber-900";

function people(stay: RoomStay) {
  if (stay.adults === null) return null;
  return stay.adults + (stay.children ?? 0);
}

function peopleDetail(stay: RoomStay) {
  if (stay.adults === null) return "";
  const adults = `${stay.adults} ${stay.adults === 1 ? "ενήλικας" : "ενήλικες"}`;
  if (!stay.children) return adults;
  return `${adults} + ${stay.children} ${stay.children === 1 ? "παιδί" : "παιδιά"}`;
}

function RoomRow({ stay, arriving }: { stay: RoomStay; arriving?: boolean }) {
  const count = people(stay);
  return (
    <li className="grid grid-cols-[3.25rem_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
      <span className="grid justify-items-center rounded-xl bg-[#f6efe5] py-2">
        <span className="text-xl font-black leading-none">{stay.room}</span>
      </span>
      <span className="grid min-w-0 gap-0.5">
        <span className="text-xs font-bold text-stone-500">{roomKind(stay.room)}</span>
        <span className="break-words text-sm font-black">{stay.name || "Χωρίς όνομα"}</span>
        <span className="text-xs text-stone-600">{count === null ? "Δες τα άτομα στο Beds24" : peopleDetail(stay)}</span>
        {stay.sameDayChange ? <span className="text-xs font-black text-red-800">Φεύγει και έρχεται την ίδια μέρα</span> : null}
        {arriving && stay.arrivalDetails ? <span className="text-xs text-stone-600">{stay.arrivalDetails}</span> : null}
      </span>
      <span className="grid justify-items-end gap-0.5 text-right">
        <span className="text-lg font-black leading-none">{count ?? "?"} <span className="text-xs font-bold">{count === 1 ? "άτομο" : "άτομα"}</span></span>
        {arriving ? <span className={`text-sm font-black ${stay.arrivalTime ? "text-emerald-800" : "text-amber-800"}`}>{stay.arrivalTime ?? "Ώρα άγνωστη"}</span> : null}
      </span>
    </li>
  );
}

export default function RoomDayPanel() {
  const today = athensToday();
  const [day, setDay] = useState(today);
  const [data, setData] = useState<RoomDay | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let current = true;
    setData(null);
    setError("");
    fetch(`/api/staff/rooms-day/?day=${day}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (!current) return;
        if (!payload.ok) throw new Error(payload.error);
        setData(payload.rooms);
      })
      .catch((reason) => { if (current) setError(reason instanceof Error ? reason.message : "Δεν φορτώθηκαν τα δωμάτια."); });
    return () => { current = false; };
  }, [day]);

  const label = day === today ? "Σήμερα" : day === shiftDay(today, 1) ? "Αύριο" : "";
  const incoming = data?.arriving.reduce((total, stay) => total + (people(stay) ?? 0), 0) ?? 0;

  return (
    <section className="grid gap-4" aria-label="Δωμάτια ημέρας">
      <div className="flex items-center justify-between gap-2">
        <button type="button" aria-label="Προηγούμενη μέρα" className={navButton} onClick={() => setDay(shiftDay(day, -1))}>←</button>
        <div className="min-w-0 text-center">
          <h2 className="text-lg font-black leading-tight">{label || "Δωμάτια"}</h2>
          <p className="text-sm font-bold text-stone-600">{dayLabel(day)}</p>
        </div>
        <button type="button" aria-label="Επόμενη μέρα" className={navButton} onClick={() => setDay(shiftDay(day, 1))}>→</button>
      </div>
      {day !== today ? <button type="button" className={`${navButton} justify-self-center`} onClick={() => setDay(today)}>Πίσω στο σήμερα</button> : null}

      {error ? <p role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-900">{error}</p> : null}
      {!data && !error ? <p className="text-sm text-stone-600">Φόρτωση…</p> : null}

      {data ? (
        <>
          <section className="grid gap-2">
            <h3 className="font-black">Φεύγουν · {data.leaving.length}</h3>
            {data.leaving.length ? <ul className="grid gap-2">{data.leaving.map((stay) => <RoomRow key={`${stay.room}-${stay.bookingId}`} stay={stay} />)}</ul> : <p className="text-sm text-stone-600">Δεν φεύγει κανείς.</p>}
          </section>

          <section className="grid gap-2">
            <h3 className="font-black">Έρχονται · {data.arriving.length}{incoming ? ` δωμάτια, ${incoming} άτομα` : ""}</h3>
            {data.arriving.length ? <ul className="grid gap-2">{data.arriving.map((stay) => <RoomRow key={`${stay.room}-${stay.bookingId}`} stay={stay} arriving />)}</ul> : <p className="text-sm text-stone-600">Δεν έρχεται κανείς.</p>}
          </section>

          {data.staying.length ? (
            <section className="grid gap-1">
              <h3 className="font-black">Μένουν · {data.staying.length}</h3>
              <ul className="grid gap-1 text-sm text-stone-700">
                {data.staying.map((stay) => (
                  <li key={`${stay.room}-${stay.bookingId}`}>
                    {roomKind(stay.room)} {stay.room} · {people(stay) ?? "?"} {people(stay) === 1 ? "άτομο" : "άτομα"}{stay.checkout ? ` · έως ${shortDate(stay.checkout)}` : ""}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <p className="text-sm text-stone-600"><span className="font-black">Ελεύθερα:</span> {data.free.length ? data.free.join(", ") : "κανένα"}</p>
        </>
      ) : null}
    </section>
  );
}
