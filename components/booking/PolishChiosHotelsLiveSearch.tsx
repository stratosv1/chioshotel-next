"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { track } from "@vercel/analytics";

const CONSENT_KEY = "vh_cookie_consent_v1";

type SearchRoom = {
  roomId: string;
  unitId: string;
  roomNumber?: number;
  name?: string;
  category?: string;
  floor?: string;
  maxGuests?: number;
  nights?: number;
  totalPrice?: number;
};

type SearchPayload = {
  success?: boolean;
  message?: string;
  nights?: number;
  rooms?: { available?: SearchRoom[] };
  summary?: { availableRooms?: number };
  _booking_engine?: { totalMs?: number };
};

const STANDARD_ROUTE = "/pl/pokoje-na-chios/pokoje-standardowe/";
const ECONOMY_ROUTE = "/pl/pokoje-na-chios/pokoj-dwuosobowy-economy/";
const FAMILY_ROUTE = "/pl/apartamenty-na-chios/";

const roomMeta: Record<number, { title: string; subtitle: string; image: string; href: string; features: string[] }> = {
  1: { title: "Pokój na piętrze 1", subtitle: "Pokój dwu- / trzyosobowy", image: "/images/rooms/DSC07776-2-e1675109942622.webp", href: STANDARD_ROUTE, features: ["Piętro", "Prywatny balkon", "Do 4 gości"] },
  2: { title: "Pokój ekonomiczny 2", subtitle: "Ekonomiczny pokój dwuosobowy", image: "/images/rooms/DSC07803-1.webp", href: ECONOMY_ROUTE, features: ["Piętro", "Łóżko podwójne", "2 gości"] },
  3: { title: "Pokój na piętrze 3", subtitle: "Pokój dwu- / trzyosobowy", image: "/images/rooms/DSC07867-1.webp", href: STANDARD_ROUTE, features: ["Piętro", "Aneks kuchenny", "Do 3 gości"] },
  4: { title: "Pokój na piętrze 4", subtitle: "Pokój dwu- / trzyosobowy", image: "/images/rooms/received_1748354861920234.webp", href: STANDARD_ROUTE, features: ["Piętro", "Aneks kuchenny", "Balkon"] },
  5: { title: "Pokój na parterze 5", subtitle: "Łatwy dostęp", image: "/images/rooms/voulamandis-house-rooms.webp", href: STANDARD_ROUTE, features: ["Parter", "Bez schodów", "Do 3 gości"] },
  6: { title: "Pokój ekonomiczny 6", subtitle: "Ekonomiczny pokój dwuosobowy", image: "/images/rooms/received_1753964631359257.webp", href: ECONOMY_ROUTE, features: ["Parter", "Bez schodów", "2 gości"] },
  7: { title: "Pokój na parterze 7", subtitle: "Pokój dwu- / trzyosobowy", image: "/images/rooms/double-triple-room.jpg", href: STANDARD_ROUTE, features: ["Parter", "Dostęp do ogrodu", "Do 3 gości"] },
  8: { title: "Apartament rodzinny 8", subtitle: "Niezależny apartament", image: "/images/rooms/chios-apartments-voulamandis.webp", href: FAMILY_ROUTE, features: ["Pełna kuchnia", "Salon", "Do 4 gości"] },
  9: { title: "Apartament rodzinny 9", subtitle: "Niezależny apartament", image: "/images/rooms/chios-apartments-voulamandis.webp", href: FAMILY_ROUTE, features: ["Pełna kuchnia", "Salon", "Do 4 gości"] },
  10: { title: "Apartament rodzinny 10", subtitle: "Duży niezależny apartament", image: "/images/rooms/DSC07899.webp", href: FAMILY_ROUTE, features: ["Pełna kuchnia", "Układ rodzinny", "Do 5 gości po uzgodnieniu"] },
};

function isoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function nextFriday(date: Date) {
  const copy = new Date(date);
  const offset = (5 - copy.getDay() + 7) % 7 || 7;
  copy.setDate(copy.getDate() + offset);
  return copy;
}

function emit(name: string, properties: Record<string, string | number | boolean | null | undefined>) {
  if (typeof window === "undefined" || window.localStorage.getItem(CONSENT_KEY) !== "accepted") return;
  const clean = Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined)) as Record<string, string | number | boolean | null>;
  track(name, clean);
  window.gtag?.("event", name, clean);
}

export function PolishChiosHotelsLiveSearch() {
  const today = useMemo(() => new Date(), []);
  const [checkin, setCheckin] = useState(isoDate(addDays(today, 1)));
  const [checkout, setCheckout] = useState(isoDate(addDays(today, 2)));
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState<SearchPayload | null>(null);
  const availableRooms = useMemo(() => [...(payload?.rooms?.available || [])].sort((a, b) => Number(a.totalPrice || 0) - Number(b.totalPrice || 0)), [payload]);
  const formatDate = (value: string) => new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`));
  const formatMoney = (value: number) => new Intl.NumberFormat("pl-PL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  function setShortcut(type: "tonight" | "tomorrow" | "weekend") {
    let start = new Date();
    let end = addDays(start, 1);
    if (type === "tomorrow") { start = addDays(start, 1); end = addDays(start, 1); }
    if (type === "weekend") { start = nextFriday(start); end = addDays(start, 2); }
    setCheckin(isoDate(start));
    setCheckout(isoDate(end));
    setPayload(null);
    setError("");
    emit("chios_hotels_date_shortcut_click", { shortcut: type, search_intent: "chios_hotels", language: "pl", pathname: "/pl/hotele-chios/" });
  }

  async function runSearch(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPayload(null);
    if (!checkin || !checkout || checkout <= checkin) {
      setError("Wybierz datę wyjazdu późniejszą niż data przyjazdu.");
      return;
    }
    setLoading(true);
    emit("chios_hotels_search_dates", { search_intent: "chios_hotels", language: "pl", pathname: "/pl/hotele-chios/", checkin, checkout, guests });
    try {
      const params = new URLSearchParams({ checkin, checkout, guests: String(guests) });
      const response = await fetch(`/api/booking/search-range?${params.toString()}`, { cache: "no-store" });
      const result = (await response.json().catch(() => null)) as SearchPayload | null;
      if (!response.ok || !result?.success) throw new Error(result?.message || "Aktualna dostępność jest chwilowo niedostępna.");
      setPayload(result);
      emit("chios_hotels_search_results", { search_intent: "chios_hotels", language: "pl", pathname: "/pl/hotele-chios/", checkin, checkout, guests, nights: result.nights, available_room_count: result.summary?.availableRooms || 0, response_ms: result._booking_engine?.totalMs });
    } catch (searchError) {
      const message = searchError instanceof Error ? searchError.message : "Aktualna dostępność jest chwilowo niedostępna.";
      setError(message);
      emit("chios_hotels_search_error", { search_intent: "chios_hotels", language: "pl", pathname: "/pl/hotele-chios/", error_message: message.slice(0, 120) });
    } finally {
      setLoading(false);
    }
  }

  const whatsappText = encodeURIComponent(`Dzień dobry Voulamandis House, sprawdzam nocleg na Chios od ${checkin} do ${checkout} dla ${guests} ${guests === 1 ? "gościa" : "gości"}. Czy możecie pomóc mi z dostępnością?`);

  return (
    <section id="live-availability" className="scroll-mt-24 bg-[#263127] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-24" aria-labelledby="live-availability-title-pl">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200 sm:text-xs">PRAWDZIWE DATY • AKTUALNE DANE OBIEKTU</p>
            <h2 id="live-availability-title-pl" className="mt-3 text-balance text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">Sprawdź dostępne pokoje i apartamenty na Chios</h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/78 sm:text-lg sm:leading-8">Podaj swoje daty i liczbę gości. Wyniki pochodzą z tego samego systemu dostępności, z którego korzystają narzędzia rezerwacyjne Voulamandis House.</p>
            <div className="mt-6 rounded-[24px] border border-amber-200/20 bg-white/8 p-5 text-sm leading-6 text-white/75"><strong className="text-white">Ważne:</strong> wyszukiwarka pokazuje wyłącznie pokoje i apartamenty Voulamandis House w Kambos. Nie jest katalogiem wszystkich hoteli na Chios.</div>
          </div>
          <div className="rounded-[30px] bg-[#fbf6ef] p-4 text-[#2f261f] shadow-2xl sm:p-7 lg:rounded-[38px] lg:p-9">
            <div className="flex flex-wrap gap-2" aria-label="Szybki wybór dat">
              <button type="button" onClick={() => setShortcut("tonight")} className="rounded-full border border-amber-900/15 bg-white px-4 py-2 text-xs font-black text-amber-900 transition hover:bg-amber-50">Dziś</button>
              <button type="button" onClick={() => setShortcut("tomorrow")} className="rounded-full border border-amber-900/15 bg-white px-4 py-2 text-xs font-black text-amber-900 transition hover:bg-amber-50">Jutro</button>
              <button type="button" onClick={() => setShortcut("weekend")} className="rounded-full border border-amber-900/15 bg-white px-4 py-2 text-xs font-black text-amber-900 transition hover:bg-amber-50">Ten weekend</button>
            </div>
            <form onSubmit={runSearch} className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-black">Przyjazd<input type="date" value={checkin} min={isoDate(today)} onChange={(event) => setCheckin(event.target.value)} className="min-h-12 rounded-2xl border border-amber-900/15 bg-white px-4 py-3 text-base font-semibold outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-200/40" required /></label>
              <label className="grid gap-2 text-sm font-black">Wyjazd<input type="date" value={checkout} min={checkin || isoDate(today)} onChange={(event) => setCheckout(event.target.value)} className="min-h-12 rounded-2xl border border-amber-900/15 bg-white px-4 py-3 text-base font-semibold outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-200/40" required /></label>
              <label className="grid gap-2 text-sm font-black">Goście<select value={guests} onChange={(event) => setGuests(Number(event.target.value))} className="min-h-12 rounded-2xl border border-amber-900/15 bg-white px-4 py-3 text-base font-semibold outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-200/40">{[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count} {count === 1 ? "gość" : "gości"}</option>)}</select></label>
              <button type="submit" disabled={loading} className="min-h-12 self-end rounded-2xl bg-[#2f261f] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-900 disabled:cursor-wait disabled:opacity-60">{loading ? "Sprawdzanie dostępności…" : "Sprawdź dostępność"}</button>
            </form>
            {error ? <div role="alert" className="mt-5 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-900">{error}</div> : null}
          </div>
        </div>

        {payload ? (
          <div className="mt-10 sm:mt-12">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">WYNIKI NA ŻYWO</p><h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">{availableRooms.length === 1 ? "1 dostępna opcja" : availableRooms.length > 1 ? `${availableRooms.length} dostępnych opcji` : "Brak potwierdzonej opcji dla tych dat"}</h3><p className="mt-2 text-sm text-white/70">{formatDate(checkin)} → {formatDate(checkout)} · {guests} {guests === 1 ? "gość" : "gości"} · {payload.nights || 0} {payload.nights === 1 ? "noc" : "nocy"}</p></div><p className="text-xs text-white/55">Sprawdzone na podstawie aktualnych danych obiektu</p></div>
            {availableRooms.length ? (
              <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 lg:pb-0 xl:grid-cols-3">
                {availableRooms.map((room) => {
                  const number = Number(room.roomNumber || 0);
                  const presentation = roomMeta[number] || { title: room.name || `Pokój ${number || ""}`, subtitle: room.category || "Voulamandis House", image: "/images/rooms/double-triple-room.jpg", href: "/pl/pokoje-na-chios/", features: [room.floor || "Kambos", `${room.maxGuests || guests} gości`] };
                  const total = Number(room.totalPrice || 0);
                  const nights = Number(room.nights || payload.nights || 1);
                  return (
                    <article key={`${room.roomId}:${room.unitId}`} className="min-w-[86vw] snap-start overflow-hidden rounded-[28px] bg-white text-[#2f261f] shadow-2xl sm:min-w-[68vw] lg:min-w-0">
                      <div className="relative h-52"><Image src={presentation.image} alt={`${presentation.title} · Voulamandis House`} fill sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 44vw, 86vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" /><span className="absolute bottom-4 left-4 rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-emerald-900">Dostępne w tych terminach</span></div>
                      <div className="p-5 sm:p-6"><p className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-800">{presentation.subtitle}</p><h4 className="mt-2 text-xl font-black tracking-[-0.03em]">{presentation.title}</h4><div className="mt-4 flex flex-wrap gap-2">{presentation.features.map((feature) => <span key={feature} className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-black text-amber-900 ring-1 ring-amber-900/10">{feature}</span>)}</div><div className="mt-5 flex items-end justify-between gap-4 border-t border-amber-900/10 pt-5"><div><p className="text-xs font-bold text-[#6f6257]">Cały pobyt</p><p className="mt-1 text-2xl font-black">{formatMoney(total)}</p><p className="mt-1 text-xs text-[#6f6257]">≈ {formatMoney(nights > 0 ? total / nights : total)} / noc</p></div><a href={presentation.href} onClick={() => emit("chios_hotels_room_view", { search_intent: "chios_hotels", language: "pl", pathname: "/pl/hotele-chios/", room_number: room.roomNumber, checkin, checkout, guests, total_price: room.totalPrice })} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2f261f] px-4 py-2 text-center text-[11px] font-black uppercase tracking-[0.06em] !text-white transition hover:bg-amber-900">Zobacz pokój</a></div></div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-[28px] border border-white/15 bg-white/8 p-6 sm:p-8"><p className="max-w-3xl text-base leading-7 text-white/80">Dla wybranych dat i liczby gości nie pokazuje się teraz potwierdzona opcja. Recepcja może sprawdzić alternatywne daty lub możliwość pobytu z jedną zmianą pokoju.</p><div className="mt-5"><a href={`https://wa.me/306944474226?text=${whatsappText}`} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-100 px-5 py-3 text-sm font-black !text-emerald-950">Zapytaj przez WhatsApp</a></div></div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
