"use client";

import { useState } from "react";
import type { FindYourRoomPageData } from "@/content/find-your-room";

type Props = { data: FindYourRoomPageData };

type Quote = {
  roomId: string;
  unitId: string;
  roomNumber: number;
  name: string;
  maxGuests: number;
  nights: number;
  originalTotal: number;
  directTotal: number;
  saving: number;
  directDiscountPercent: number;
  breakfastTotalIfAdded: number;
  guestNote: string | null;
};

type ApiPayload = {
  success?: boolean;
  message?: string;
  rooms?: { available?: Quote[] };
};

function money(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function key(room: Quote) {
  return `${room.roomId}:${room.unitId}`;
}

function roomLabel(room: Quote, data: FindYourRoomPageData) {
  const prefix = room.roomNumber >= 8
    ? (data.engine.roomLabels.apartment || "Apartment")
    : data.engine.results.room;
  return `${prefix} ${room.roomNumber}`;
}

export function CentralFindYourRoomEngine({ data }: Props) {
  const t = data.engine;
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [roomCount, setRoomCount] = useState(1);
  const [guests, setGuests] = useState<number[]>([2]);
  const [results, setResults] = useState<Quote[][]>([]);
  const [selected, setSelected] = useState<Array<Quote | null>>([]);
  const [breakfast, setBreakfast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedKeys = new Set(selected.filter((room): room is Quote => Boolean(room)).map(key));
  const allSelected = selected.length === roomCount && selected.every((room) => Boolean(room));
  const originalTotal = selected.reduce((sum, room) => sum + (room?.originalTotal ?? 0), 0);
  const directTotal = selected.reduce((sum, room) => sum + (room?.directTotal ?? 0), 0);
  const savings = selected.reduce((sum, room) => sum + (room?.saving ?? 0), 0);
  const breakfastTotal = breakfast
    ? selected.reduce((sum, room) => sum + (room?.breakfastTotalIfAdded ?? 0), 0)
    : 0;
  const finalTotal = directTotal + breakfastTotal;
  const discountPercent = selected.find((room): room is Quote => Boolean(room))?.directDiscountPercent ?? 0;

  function updateRoomCount(nextCount: number) {
    setRoomCount(nextCount);
    setGuests((current) => Array.from({ length: nextCount }, (_, index) => current[index] ?? 2));
    setResults([]);
    setSelected([]);
    setBreakfast(false);
  }

  function updateGuestCount(index: number, value: number) {
    setGuests((current) => current.map((guestCount, i) => i === index ? value : guestCount));
    setResults([]);
    setSelected([]);
    setBreakfast(false);
  }

  async function searchRooms() {
    setError("");
    if (!checkin || !checkout) {
      setError(t.validation.dates);
      return;
    }
    if (checkout <= checkin) {
      setError(t.validation.checkoutAfterCheckin);
      return;
    }

    setLoading(true);
    try {
      const searches = await Promise.all(guests.map(async (guestCount) => {
        const params = new URLSearchParams({ checkin, checkout, guests: String(guestCount) });
        const response = await fetch(`/api/booking/search-range?${params.toString()}`, { cache: "no-store" });
        const payload = await response.json().catch(() => null) as ApiPayload | null;
        if (!response.ok || !payload?.success || !Array.isArray(payload.rooms?.available)) {
          throw new Error(payload?.message || t.validation.genericSearchError);
        }
        return payload.rooms.available;
      }));

      setResults(searches);
      setSelected(Array.from({ length: roomCount }, () => null));
      setBreakfast(false);
      if (searches.some((rooms) => rooms.length === 0)) setError(t.results.noAvailabilityText);
    } catch (cause) {
      setResults([]);
      setSelected([]);
      setError(cause instanceof Error ? cause.message : t.validation.genericSearchError);
    } finally {
      setLoading(false);
    }
  }

  function selectRoom(groupIndex: number, room: Quote) {
    setSelected((current) => {
      const next = Array.from({ length: roomCount }, (_, index) => current[index] ?? null);
      next[groupIndex] = room;
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 rounded-[28px] bg-white p-4 shadow-sm sm:p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-sm font-semibold text-stone-700">
          <span>{t.basics.checkin}</span>
          <input type="date" value={checkin} onChange={(event) => { setCheckin(event.target.value); setResults([]); }} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
        </label>
        <label className="space-y-2 text-sm font-semibold text-stone-700">
          <span>{t.basics.checkout}</span>
          <input type="date" value={checkout} onChange={(event) => { setCheckout(event.target.value); setResults([]); }} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
        </label>
        <label className="space-y-2 text-sm font-semibold text-stone-700">
          <span>{t.basics.roomsCount}</span>
          <select value={roomCount} onChange={(event) => updateRoomCount(Number(event.target.value))} className="w-full rounded-2xl border border-stone-300 px-4 py-3">
            {[1, 2, 3].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {guests.map((guestCount, index) => (
          <label key={index} className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-700">
            <span>{t.basics.room} {index + 1} · {t.basics.guests}</span>
            <select value={guestCount} onChange={(event) => updateGuestCount(index, Number(event.target.value))} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5">
              {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
        ))}
      </div>

      <button type="button" onClick={() => void searchRooms()} disabled={loading} className="w-full rounded-2xl bg-stone-800 px-6 py-4 font-bold text-white disabled:opacity-60">
        {loading ? t.filters.checking : t.filters.search}
      </button>

      {error && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{error}</div>}

      {results.map((group, groupIndex) => {
        const current = selected[groupIndex] ?? null;
        const currentKey = current ? key(current) : null;
        const available = group.filter((room) => !selectedKeys.has(key(room)) || currentKey === key(room));
        return (
          <section key={groupIndex} className="space-y-3 border-t border-stone-200 pt-5">
            <h2 className="text-lg font-bold text-stone-900">{t.results.title} · {t.basics.room} {groupIndex + 1}</h2>
            {available.length === 0 ? <p className="rounded-2xl bg-stone-50 p-4 text-stone-700">{t.results.noAvailabilityText}</p> : null}
            <div className="grid gap-3 md:grid-cols-2">
              {available.map((room) => {
                const chosen = currentKey === key(room);
                return (
                  <article key={key(room)} className={`rounded-2xl border p-4 ${chosen ? "border-stone-800 bg-stone-50" : "border-stone-200"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-stone-900">{roomLabel(room, data)}</h3>
                        <p className="mt-1 text-xs text-stone-500">{t.results.liveNow}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-stone-500 line-through">{money(room.originalTotal, t.currencyLocale)}</div>
                        <div className="text-xl font-black text-stone-900">{money(room.directTotal, t.currencyLocale)}</div>
                      </div>
                    </div>
                    {room.guestNote ? <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{room.guestNote}</p> : null}
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-emerald-700">{room.directDiscountPercent}% · {t.results.discount}</span>
                      <button type="button" onClick={() => selectRoom(groupIndex, room)} className="rounded-xl bg-stone-800 px-4 py-2 text-sm font-bold text-white">
                        {chosen ? t.results.selected : t.results.select}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}

      {allSelected ? (
        <section className="space-y-4 rounded-2xl bg-stone-50 p-5">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setBreakfast(false)} className={`rounded-xl border px-4 py-2 text-sm font-bold ${!breakfast ? "bg-stone-800 text-white" : "bg-white text-stone-800"}`}>{t.breakfast.withoutBreakfast}</button>
            <button type="button" onClick={() => setBreakfast(true)} className={`rounded-xl border px-4 py-2 text-sm font-bold ${breakfast ? "bg-stone-800 text-white" : "bg-white text-stone-800"}`}>{t.breakfast.withBreakfast}</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white p-3"><div className="text-xs text-stone-500">{t.topBenefits.total}</div><div className="font-bold">{money(originalTotal, t.currencyLocale)}</div></div>
            <div className="rounded-xl bg-white p-3"><div className="text-xs text-stone-500">{t.results.discount} {discountPercent}%</div><div className="font-bold text-emerald-700">−{money(savings, t.currencyLocale)}</div></div>
            <div className="rounded-xl bg-white p-3"><div className="text-xs text-stone-500">{t.breakfast.breakfast}</div><div className="font-bold">{breakfast ? money(breakfastTotal, t.currencyLocale) : t.breakfast.notAdded}</div></div>
            <div className="rounded-xl bg-white p-3"><div className="text-xs text-stone-500">{t.breakfast.total}</div><div className="text-lg font-black">{money(finalTotal, t.currencyLocale)}</div></div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
