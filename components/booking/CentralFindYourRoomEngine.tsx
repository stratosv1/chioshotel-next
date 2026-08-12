"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { FindYourRoomPageData } from "@/content/find-your-room";

type Props = { data: FindYourRoomPageData };

type Quote = {
  roomId: string;
  unitId: string;
  roomNumber: number;
  name: string;
  category: string;
  floor: string;
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

type Visual = {
  image: string;
  ground?: boolean;
  first?: boolean;
  economy?: boolean;
  kitchen?: boolean;
  kitchenette?: boolean;
  noStairs?: boolean;
  garden?: boolean;
  balcony?: boolean;
};

const VISUALS: Record<number, Visual> = {
  1: { image: "/images/rooms/DSC07776-2-e1675109942622.webp", first: true, balcony: true },
  2: { image: "/images/rooms/DSC07803-1.webp", first: true, economy: true },
  3: { image: "/images/rooms/DSC07867-1.webp", first: true, kitchenette: true },
  4: { image: "/images/rooms/received_1748354861920234.webp", first: true, kitchenette: true, balcony: true },
  5: { image: "/images/rooms/voulamandis-house-rooms.webp", ground: true, noStairs: true, garden: true },
  6: { image: "/images/rooms/received_1753964631359257.webp", ground: true, noStairs: true, economy: true, garden: true },
  7: { image: "/images/rooms/double-triple-room.jpg", ground: true, noStairs: true, garden: true },
  8: { image: "/images/rooms/chios-apartments-voulamandis.webp", ground: true, noStairs: true, kitchen: true, garden: true },
  9: { image: "/images/rooms/chios-hotels-family-apartments.webp", ground: true, noStairs: true, kitchen: true, garden: true },
  10: { image: "/images/rooms/DSC07899.webp", ground: true, noStairs: true, kitchen: true, garden: true },
};

function money(value: number, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(value);
}

function roomKey(room: Quote) {
  return `${room.roomId}:${room.unitId}`;
}

function localizedName(room: Quote, data: FindYourRoomPageData) {
  const labels = data.engine.roomLabels;
  const prefix = room.roomNumber >= 8 ? (labels.apartment || "Apartment") : (data.engine.results.room || "Room");
  return `${prefix} ${room.roomNumber}`;
}

function matchesFilter(room: Quote, filter: string) {
  if (filter === "all") return true;
  const visual = VISUALS[room.roomNumber] || {};
  if (filter === "budget") return Boolean(visual.economy);
  if (filter === "stairs" || filter === "upperFloor") return Boolean(visual.first);
  if (filter === "ground") return Boolean(visual.ground);
  if (filter === "gardenView") return Boolean(visual.garden);
  if (filter === "upperFloorView") return Boolean(visual.first);
  if (filter === "kitchen") return Boolean(visual.kitchen || visual.kitchenette);
  if (filter === "noKitchen") return !visual.kitchen && !visual.kitchenette;
  return true;
}

export function CentralFindYourRoomEngine({ data }: Props) {
  const t = data.engine;
  const [firstName, setFirstName] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [roomCount, setRoomCount] = useState(1);
  const [guests, setGuests] = useState<number[]>([2]);
  const [filter, setFilter] = useState("all");
  const [results, setResults] = useState<Quote[][]>([]);
  const [selected, setSelected] = useState<(Quote | null)[]>([]);
  const [breakfast, setBreakfast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedKeys = useMemo(() => new Set(selected.filter(Boolean).map((room) => roomKey(room as Quote))), [selected]);
  const roomOriginalTotal = selected.reduce((sum, room) => sum + (room?.originalTotal || 0), 0);
  const roomDirectTotal = selected.reduce((sum, room) => sum + (room?.directTotal || 0), 0);
  const roomSavings = selected.reduce((sum, room) => sum + (room?.saving || 0), 0);
  const breakfastTotal = breakfast ? selected.reduce((sum, room) => sum + (room?.breakfastTotalIfAdded || 0), 0) : 0;
  const grandTotal = roomDirectTotal + breakfastTotal;
  const allSelected = selected.length === roomCount && selected.every(Boolean);
  const discountPercent = selected.find(Boolean)?.directDiscountPercent || 0;

  function changeRoomCount(value: number) {
    setRoomCount(value);
    setGuests((current) => Array.from({ length: value }, (_, index) => current[index] || 2));
    setResults([]);
    setSelected([]);
    setBreakfast(false);
  }

  function changeGuests(index: number, value: number) {
    setGuests((current) => current.map((item, i) => i === index ? value : item));
    setResults([]);
    setSelected([]);
    setBreakfast(false);
  }

  async function search() {
    setError("");
    if (!checkin || !checkout) {
      setError(t.validation.dates);
      return;
    }
    if (checkout <= checkin) {
      setError(t.validation.checkoutAfterCheckin);
      return;
    }
    if (guests.some((count) => !Number.isInteger(count) || count < 1 || count > 5)) {
      setError(t.validation.guests);
      return;
    }

    setLoading(true);
    try {
      const payloads = await Promise.all(guests.map(async (guestCount) => {
        const url = new URL("/api/booking/search-range", window.location.origin);
        url.searchParams.set("checkin", checkin);
        url.searchParams.set("checkout", checkout);
        url.searchParams.set("guests", String(guestCount));
        const response = await fetch(url.toString(), { cache: "no-store" });
        const payload = await response.json().catch(() => null) as ApiPayload | null;
        if (!response.ok || !payload?.success || !Array.isArray(payload.rooms?.available)) {
          throw new Error(payload?.message || t.validation.genericSearchError);
        }
        return payload.rooms.available;
      }));
      setResults(payloads);
      setSelected(Array.from({ length: roomCount }, () => null));
      setBreakfast(false);
      if (payloads.some((rooms) => rooms.length === 0)) setError(t.results.noAvailabilityText);
    } catch (cause) {
      setResults([]);
      setSelected([]);
      setError(cause instanceof Error ? cause.message : t.validation.genericSearchError);
    } finally {
      setLoading(false);
    }
  }

  function chooseRoom(groupIndex: number, room: Quote) {
    setSelected((current) => {
      const next = Array.from({ length: roomCount }, (_, index) => current[index] || null);
      next[groupIndex] = room;
      return next;
    });
  }

  const whatsappText = allSelected ? [
    t.contact.messageGreeting,
    firstName ? `${t.contact.messageName}: ${firstName}` : "",
    `${t.contact.messageCheckin}: ${checkin}`,
    `${t.contact.messageCheckout}: ${checkout}`,
    ...selected.map((room, index) => room ? `${t.basics.room} ${index + 1}: ${localizedName(room, data)} · ${money(room.directTotal, t.currencyLocale)}` : ""),
    `${t.contact.messageBreakfast}: ${breakfast ? t.contact.yes : t.contact.no}`,
    `${t.contact.messageDirectTotal}: ${money(grandTotal, t.currencyLocale)}`,
  ].filter(Boolean).join("\n") : "";

  const filterOptions = ["all", "budget", "upperFloor", "ground", "gardenView", "kitchen", "noKitchen"] as const;

  return (
    <div className="mx-auto max-w-6xl space-y-6 rounded-[28px] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-2 text-sm font-semibold text-stone-700">
          <span>{t.basics.firstName}</span>
          <input value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder={t.basics.firstNamePlaceholder} className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-stone-500" />
        </label>
        <label className="space-y-2 text-sm font-semibold text-stone-700">
          <span>{t.basics.checkin}</span>
          <input type="date" value={checkin} onChange={(event) => { setCheckin(event.target.value); setResults([]); }} className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-stone-500" />
        </label>
        <label className="space-y-2 text-sm font-semibold text-stone-700">
          <span>{t.basics.checkout}</span>
          <input type="date" value={checkout} onChange={(event) => { setCheckout(event.target.value); setResults([]); }} className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-stone-500" />
        </label>
        <label className="space-y-2 text-sm font-semibold text-stone-700">
          <span>{t.basics.roomsCount}</span>
          <select value={roomCount} onChange={(event) => changeRoomCount(Number(event.target.value))} className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-stone-500">
            {[1, 2, 3].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {guests.map((count, index) => (
          <label key={index} className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-700">
            <span>{t.basics.room} {index + 1} · {t.basics.guests}</span>
            <select value={count} onChange={(event) => changeGuests(index, Number(event.target.value))} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5">
              {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((key) => (
          <button key={key} type="button" onClick={() => setFilter(key)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${filter === key ? "border-stone-800 bg-stone-800 text-white" : "border-stone-300 bg-white text-stone-700"}`}>
            {t.filters[key]}
          </button>
        ))}
      </div>

      <button type="button" onClick={() => void search()} disabled={loading} className="w-full rounded-2xl bg-stone-800 px-6 py-4 font-bold text-white transition hover:bg-stone-700 disabled:cursor-wait disabled:opacity-60">
        {loading ? t.filters.checking : t.filters.search}
      </button>

      {error && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{error}</div>}

      {results.map((group, groupIndex) => {
        const visible = group.filter((room) => matchesFilter(room, filter)).filter((room) => !selectedKeys.has(roomKey(room)) || roomKey(selected[groupIndex] as Quote) === roomKey(room));
        return (
          <section key={groupIndex} className="space-y-4 border-t border-stone-200 pt-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900">{t.results.title} · {t.basics.room} {groupIndex + 1}</h2>
              <p className="mt-1 text-sm text-stone-600">{guests[groupIndex]} {guests[groupIndex] === 1 ? t.results.guest : t.results.guests}</p>
            </div>
            {visible.length === 0 ? (
              <div className="rounded-2xl bg-stone-50 p-5 text-stone-700">{t.results.noPerfectMatchText}</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visible.map((room) => {
                  const visual = VISUALS[room.roomNumber];
                  const chosen = selected[groupIndex] && roomKey(selected[groupIndex] as Quote) === roomKey(room);
                  return (
                    <article key={roomKey(room)} className={`overflow-hidden rounded-[24px] border bg-white ${chosen ? "border-stone-800 ring-2 ring-stone-200" : "border-stone-200"}`}>
                      <div className="relative aspect-[16/10] bg-stone-100">
                        {visual?.image && <Image src={visual.image} alt={localizedName(room, data)} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />}
                      </div>
                      <div className="space-y-3 p-5">
                        <div>
                          <h3 className="text-lg font-bold text-stone-900">{localizedName(room, data)}</h3>
                          <p className="text-sm text-stone-600">{room.floor} · {t.results.liveNow}</p>
                        </div>
                        {room.guestNote && <p className="rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-900">{room.guestNote}</p>}
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <div className="text-sm text-stone-500 line-through">{money(room.originalTotal, t.currencyLocale)}</div>
                            <div className="text-2xl font-black text-stone-900">{money(room.directTotal, t.currencyLocale)}</div>
                            <div className="text-xs font-semibold text-emerald-700">{t.results.discount}: {room.directDiscountPercent}% · {money(room.saving, t.currencyLocale)}</div>
                          </div>
                          <button type="button" onClick={() => chooseRoom(groupIndex, room)} className="rounded-xl bg-stone-800 px-4 py-3 text-sm font-bold text-white">
                            {chosen ? t.results.selected : t.results.select}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      {allSelected && (
        <section className="space-y-4 rounded-[24px] border border-stone-200 bg-stone-50 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-stone-900">{t.breakfast.title}</h2>
              <p className="mt-1 text-sm text-stone-600">{t.breakfast.directPrice}: {money(roomDirectTotal, t.currencyLocale)}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setBreakfast(false)} className={`rounded-xl border px-4 py-2.5 text-sm font-bold ${!breakfast ? "border-stone-800 bg-stone-800 text-white" : "border-stone-300 bg-white"}`}>{t.breakfast.withoutBreakfast}</button>
              <button type="button" onClick={() => setBreakfast(true)} className={`rounded-xl border px-4 py-2.5 text-sm font-bold ${breakfast ? "border-stone-800 bg-stone-800 text-white" : "border-stone-300 bg-white"}`}>{t.breakfast.withBreakfast}</button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-4"><div className="text-xs font-semibold text-stone-500">{t.topBenefits.total}</div><div className="mt-1 text-lg font-bold">{money(roomOriginalTotal, t.currencyLocale)}</div></div>
            <div className="rounded-2xl bg-white p-4"><div className="text-xs font-semibold text-stone-500">{t.results.discount} {discountPercent}%</div><div className="mt-1 text-lg font-bold text-emerald-700">−{money(roomSavings, t.currencyLocale)}</div></div>
            <div className="rounded-2xl bg-white p-4"><div className="text-xs font-semibold text-stone-500">{t.breakfast.breakfast}</div><div className="mt-1 text-lg font-bold">{breakfast ? money(breakfastTotal, t.currencyLocale) : t.breakfast.notAdded}</div></div>
            <div className="rounded-2xl bg-white p-4"><div className="text-xs font-semibold text-stone-500">{t.breakfast.total}</div><div className="mt-1 text-xl font-black">{money(grandTotal, t.currencyLocale)}</div></div>
          </div>

          <a href={`https://wa.me/306944474226?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noopener noreferrer" className="block w-full rounded-2xl bg-emerald-700 px-6 py-4 text-center font-bold text-white hover:bg-emerald-600">
            {t.contact.whatsapp}
          </a>
        </section>
      )}
    </div>
  );
}
