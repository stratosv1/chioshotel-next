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
  nightlyPrices?: Array<{ date: string; price: number }>;
};

type SearchPayload = {
  success?: boolean;
  message?: string;
  checkin?: string;
  checkout?: string;
  guests?: number;
  nights?: number;
  rooms?: {
    available?: SearchRoom[];
    unavailable?: SearchRoom[];
  };
  summary?: {
    availableRooms?: number;
    unavailableRooms?: number;
  };
  _booking_engine?: {
    generatedAt?: string;
    totalMs?: number;
  };
};

type RoomPresentation = {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  features: string[];
};

const ROOM_PRESENTATION: Record<number, RoomPresentation> = {
  1: {
    title: "Upper-floor room 1",
    subtitle: "Double / triple room",
    image: "/images/rooms/DSC07776-2-e1675109942622.webp",
    href: "/chios-rooms/standard-double-room/",
    features: ["Upper floor", "Private balcony", "Up to 4 guests"],
  },
  2: {
    title: "Economy room 2",
    subtitle: "Best-value double room",
    image: "/images/rooms/DSC07803-1.webp",
    href: "/chios-rooms/economy-double-rooms/",
    features: ["Upper floor", "Double bed", "2 guests"],
  },
  3: {
    title: "Upper-floor room 3",
    subtitle: "Double / triple room",
    image: "/images/rooms/DSC07867-1.webp",
    href: "/chios-rooms/standard-double-room/",
    features: ["Upper floor", "Kitchenette", "Up to 3 guests"],
  },
  4: {
    title: "Upper-floor room 4",
    subtitle: "Double / triple room",
    image: "/images/rooms/received_1748354861920234.webp",
    href: "/chios-rooms/standard-double-room/",
    features: ["Upper floor", "Kitchenette", "Private balcony"],
  },
  5: {
    title: "Ground-floor room 5",
    subtitle: "Easy-access double / triple room",
    image: "/images/rooms/voulamandis-house-rooms.webp",
    href: "/chios-rooms/standard-double-room/",
    features: ["Ground floor", "No stairs", "Up to 3 guests"],
  },
  6: {
    title: "Economy room 6",
    subtitle: "Ground-floor double room",
    image: "/images/rooms/received_1753964631359257.webp",
    href: "/chios-rooms/economy-double-rooms/",
    features: ["Ground floor", "No stairs", "2 guests"],
  },
  7: {
    title: "Ground-floor room 7",
    subtitle: "Garden-access double / triple room",
    image: "/images/rooms/double-triple-room.jpg",
    href: "/chios-rooms/standard-double-room/",
    features: ["Ground floor", "Garden access", "Up to 3 guests"],
  },
  8: {
    title: "Family apartment 8",
    subtitle: "Independent apartment",
    image: "/images/rooms/chios-apartments-voulamandis.webp",
    href: "/chios-rooms/family-chios-apartments/",
    features: ["Full kitchen", "Living area", "Up to 4 guests"],
  },
  9: {
    title: "Family apartment 9",
    subtitle: "Independent apartment",
    image: "/images/rooms/chios-apartments-voulamandis.webp",
    href: "/chios-rooms/family-chios-apartments/",
    features: ["Full kitchen", "Living area", "Up to 4 guests"],
  },
  10: {
    title: "Family apartment 10",
    subtitle: "Large independent apartment",
    image: "/images/rooms/DSC07899.webp",
    href: "/chios-rooms/family-chios-apartments/",
    features: ["Full kitchen", "Family layout", "Up to 5 guests by arrangement"],
  },
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
  const day = copy.getDay();
  const offset = (5 - day + 7) % 7 || 7;
  copy.setDate(copy.getDate() + offset);
  return copy;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function emit(name: string, properties: Record<string, string | number | boolean | null | undefined>) {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(CONSENT_KEY) !== "accepted") return;

  const clean = Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined),
  ) as Record<string, string | number | boolean | null>;

  track(name, clean);
  window.gtag?.("event", name, clean);
}

export function ChiosHotelsLiveSearch() {
  const today = useMemo(() => new Date(), []);
  const [checkin, setCheckin] = useState(isoDate(addDays(today, 1)));
  const [checkout, setCheckout] = useState(isoDate(addDays(today, 2)));
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState<SearchPayload | null>(null);

  const availableRooms = useMemo(
    () => [...(payload?.rooms?.available || [])].sort((a, b) => Number(a.totalPrice || 0) - Number(b.totalPrice || 0)),
    [payload],
  );

  function setShortcut(type: "tonight" | "tomorrow" | "weekend") {
    let start = new Date();
    let end = addDays(start, 1);

    if (type === "tomorrow") {
      start = addDays(start, 1);
      end = addDays(start, 1);
    }

    if (type === "weekend") {
      start = nextFriday(start);
      end = addDays(start, 2);
    }

    setCheckin(isoDate(start));
    setCheckout(isoDate(end));
    setPayload(null);
    setError("");
    emit("chios_hotels_date_shortcut_click", {
      shortcut: type,
      search_intent: "chios_hotels",
    });
  }

  async function runSearch(event?: React.FormEvent) {
    event?.preventDefault();
    setError("");
    setPayload(null);

    if (!checkin || !checkout || checkout <= checkin) {
      setError("Please choose a checkout date after your check-in date.");
      return;
    }

    setLoading(true);
    emit("chios_hotels_search_dates", {
      search_intent: "chios_hotels",
      checkin,
      checkout,
      guests,
    });

    try {
      const params = new URLSearchParams({
        checkin,
        checkout,
        guests: String(guests),
      });
      const response = await fetch(`/api/booking/search-range?${params.toString()}`, {
        cache: "no-store",
      });
      const result = (await response.json().catch(() => null)) as SearchPayload | null;

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Live availability is temporarily unavailable.");
      }

      setPayload(result);
      emit("chios_hotels_search_results", {
        search_intent: "chios_hotels",
        checkin,
        checkout,
        guests,
        nights: result.nights,
        available_room_count: result.summary?.availableRooms || 0,
        response_ms: result._booking_engine?.totalMs,
      });
    } catch (searchError) {
      const message = searchError instanceof Error ? searchError.message : "Live availability is temporarily unavailable.";
      setError(message);
      emit("chios_hotels_search_error", {
        search_intent: "chios_hotels",
        error_message: message.slice(0, 120),
      });
    } finally {
      setLoading(false);
    }
  }

  function handleRoomClick(room: SearchRoom) {
    emit("chios_hotels_room_view", {
      search_intent: "chios_hotels",
      room_number: room.roomNumber,
      checkin,
      checkout,
      guests,
      total_price: room.totalPrice,
    });
  }

  const whatsappText = encodeURIComponent(
    `Hello Voulamandis House, I am checking accommodation in Chios for ${checkin} to ${checkout}, ${guests} guest${guests === 1 ? "" : "s"}. Could you help me with availability?`,
  );

  return (
    <section
      id="live-availability"
      className="scroll-mt-24 bg-[#263127] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-24"
      aria-labelledby="live-availability-title"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200 sm:text-xs">
              REAL DATES • REAL PROPERTY DATA
            </p>
            <h2 id="live-availability-title" className="mt-3 text-balance text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              Search live rooms and apartments in Chios
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/78 sm:text-lg sm:leading-8">
              Enter your actual dates and number of guests. Results come from the same availability system used by the Voulamandis House booking tools. Prices shown are for the complete stay and are not market averages for other Chios hotels.
            </p>
            <div className="mt-6 rounded-[24px] border border-amber-200/20 bg-white/8 p-5 text-sm leading-6 text-white/75">
              <strong className="text-white">Clear distinction:</strong> this search only shows rooms and apartments at Voulamandis House, a family-run guest accommodation in Kambos. It is not a directory of every hotel on Chios.
            </div>
          </div>

          <div className="rounded-[30px] bg-[#fbf6ef] p-4 text-[#2f261f] shadow-2xl sm:p-7 lg:rounded-[38px] lg:p-9">
            <div className="flex flex-wrap gap-2" aria-label="Popular date shortcuts">
              <button type="button" onClick={() => setShortcut("tonight")} className="rounded-full border border-amber-900/15 bg-white px-4 py-2 text-xs font-black text-amber-900 transition hover:bg-amber-50">
                Tonight
              </button>
              <button type="button" onClick={() => setShortcut("tomorrow")} className="rounded-full border border-amber-900/15 bg-white px-4 py-2 text-xs font-black text-amber-900 transition hover:bg-amber-50">
                Tomorrow
              </button>
              <button type="button" onClick={() => setShortcut("weekend")} className="rounded-full border border-amber-900/15 bg-white px-4 py-2 text-xs font-black text-amber-900 transition hover:bg-amber-50">
                This weekend
              </button>
            </div>

            <form onSubmit={runSearch} className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-black">
                Check-in
                <input
                  type="date"
                  value={checkin}
                  min={isoDate(today)}
                  onChange={(event) => setCheckin(event.target.value)}
                  className="min-h-12 rounded-2xl border border-amber-900/15 bg-white px-4 py-3 text-base font-semibold outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-200/40"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-black">
                Check-out
                <input
                  type="date"
                  value={checkout}
                  min={checkin || isoDate(today)}
                  onChange={(event) => setCheckout(event.target.value)}
                  className="min-h-12 rounded-2xl border border-amber-900/15 bg-white px-4 py-3 text-base font-semibold outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-200/40"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-black sm:col-span-1">
                Guests
                <select
                  value={guests}
                  onChange={(event) => setGuests(Number(event.target.value))}
                  className="min-h-12 rounded-2xl border border-amber-900/15 bg-white px-4 py-3 text-base font-semibold outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-200/40"
                >
                  {[1, 2, 3, 4, 5].map((count) => (
                    <option key={count} value={count}>{count} guest{count === 1 ? "" : "s"}</option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                disabled={loading}
                className="min-h-12 self-end rounded-2xl bg-[#2f261f] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-900 disabled:cursor-wait disabled:opacity-60"
              >
                {loading ? "Checking live availability…" : "Search available stays"}
              </button>
            </form>

            {error ? (
              <div role="alert" className="mt-5 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-900">
                {error}
              </div>
            ) : null}
          </div>
        </div>

        {payload ? (
          <div className="mt-10 sm:mt-12">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">LIVE RESULTS</p>
                <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  {availableRooms.length > 0
                    ? `${availableRooms.length} available option${availableRooms.length === 1 ? "" : "s"}`
                    : "No confirmed option is showing for these dates"}
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  {formatDate(checkin)} → {formatDate(checkout)} · {guests} guest{guests === 1 ? "" : "s"} · {payload.nights} night{payload.nights === 1 ? "" : "s"}
                </p>
              </div>
              <p className="text-xs text-white/55">
                Checked from current property data{payload._booking_engine?.totalMs ? ` in ${payload._booking_engine.totalMs} ms` : ""}.
              </p>
            </div>

            {availableRooms.length > 0 ? (
              <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 lg:pb-0 xl:grid-cols-3">
                {availableRooms.map((room) => {
                  const number = Number(room.roomNumber || 0);
                  const presentation = ROOM_PRESENTATION[number] || {
                    title: room.name || `Room ${number || ""}`,
                    subtitle: room.category || "Room or apartment",
                    image: "/images/rooms/double-triple-room.jpg",
                    href: "/chios-rooms/",
                    features: [room.floor || "Voulamandis House", `Up to ${room.maxGuests || guests} guests`],
                  };
                  const total = Number(room.totalPrice || 0);
                  const nights = Number(room.nights || payload.nights || 1);
                  const perNight = nights > 0 ? total / nights : total;

                  return (
                    <article key={`${room.roomId}:${room.unitId}`} className="min-w-[86vw] snap-start overflow-hidden rounded-[28px] bg-white text-[#2f261f] shadow-2xl sm:min-w-[68vw] lg:min-w-0">
                      <div className="relative h-52">
                        <Image src={presentation.image} alt={`${presentation.title} at Voulamandis House in Kambos, Chios`} fill sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 44vw, 86vw" className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                        <span className="absolute bottom-4 left-4 rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-emerald-900">
                          Available for these dates
                        </span>
                      </div>
                      <div className="p-5 sm:p-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-800">{presentation.subtitle}</p>
                        <h4 className="mt-2 text-xl font-black tracking-[-0.03em]">{presentation.title}</h4>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {presentation.features.map((feature) => (
                            <span key={feature} className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-black text-amber-900 ring-1 ring-amber-900/10">
                              {feature}
                            </span>
                          ))}
                        </div>
                        <div className="mt-5 flex items-end justify-between gap-4 border-t border-amber-900/10 pt-5">
                          <div>
                            <p className="text-xs font-bold text-[#6f6257]">Complete stay</p>
                            <p className="mt-1 text-2xl font-black">{formatMoney(total)}</p>
                            <p className="mt-1 text-xs text-[#6f6257]">Approx. {formatMoney(perNight)} per night</p>
                          </div>
                          <a
                            href={presentation.href}
                            onClick={() => handleRoomClick(room)}
                            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2f261f] px-4 py-2 text-center text-[11px] font-black uppercase tracking-[0.06em] !text-white transition hover:bg-amber-900"
                          >
                            View room
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-[28px] border border-white/15 bg-white/8 p-6 sm:p-8">
                <p className="max-w-3xl text-base leading-7 text-white/80">
                  No confirmed room is currently showing for the selected dates and guest count. This does not create a booking or waiting-list request. Reception can check alternatives, date flexibility or a possible split stay directly.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a href={`https://wa.me/306944474226?text=${whatsappText}`} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-100 px-5 py-3 text-sm font-black !text-emerald-950">
                    Ask on WhatsApp
                  </a>
                  <a href="/ai-assistant/?lang=en" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-5 py-3 text-sm font-black !text-white">
                    Try the AI Room Finder
                  </a>
                </div>
              </div>
            )}

            {availableRooms.length > 0 ? (
              <div className="mt-7 flex flex-col gap-3 rounded-[26px] border border-white/15 bg-white/8 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <p className="text-sm leading-6 text-white/75">
                  Need help choosing between floors, bed layouts or apartments? Send the dates to reception before starting a booking.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <a href={`https://wa.me/306944474226?text=${whatsappText}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-100 px-4 py-2 text-xs font-black !text-emerald-950">
                    WhatsApp reception
                  </a>
                  <a href="/chios-hotels-rates/" className="inline-flex min-h-11 items-center justify-center rounded-full bg-amber-200 px-4 py-2 text-xs font-black !text-[#2f261f]">
                    Continue to direct rates
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
