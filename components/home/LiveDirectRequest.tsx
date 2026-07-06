"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { HomePageData } from "@/content/home";
import {
  firstAvailableDate,
  formatDate,
  getNightInfo,
  mergeDealRooms,
  minDirectPrice,
  money,
  roomKey,
  type DealsResponse,
  type RoomMeta,
} from "@/components/home/liveDirectRequestUtils";

type LastMinuteData = HomePageData["lastMinute"];

const CONTACT = {
  endpoint: "/api/deals",
  phoneHref: "tel:+302271031733",
  phoneDisplay: "+30 22710 31733",
  whatsapp: "306944474226",
};

function requestHref(room: RoomMeta | null, date: string | null, guests: number, price: number | null) {
  const text = [
    "Instant request to reception - Voulamandis House",
    "",
    `Room: ${room ? `${room.displayName} - ${room.type}` : "-"}`,
    `Date: ${date || "-"}`,
    `Guests: ${guests}`,
    price ? `Direct price from: ${money(price)}` : null,
    "",
    "Please reply with your best direct offer and availability confirmation.",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function LiveDirectRequest({ data }: { data: LastMinuteData; canonicalPath: string }) {
  const [deals, setDeals] = useState<DealsResponse | null>(null);
  const [guests, setGuests] = useState(2);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDeals() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(CONTACT.endpoint, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Live availability is temporarily unavailable.");
        const json = (await response.json()) as DealsResponse;
        if (active) setDeals(json);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Live availability is temporarily unavailable.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadDeals();
    return () => {
      active = false;
    };
  }, []);

  const rooms = useMemo(() => {
    return mergeDealRooms(deals)
      .filter((room) => room.maxGuests >= guests)
      .filter((room) => firstAvailableDate(deals, room))
      .sort((a, b) => Number(minDirectPrice(deals, a) || Infinity) - Number(minDirectPrice(deals, b) || Infinity));
  }, [deals, guests]);

  const selectedRoom = rooms.find((room) => roomKey(room) === selectedKey) || rooms[0] || null;

  useEffect(() => {
    if (!selectedRoom) return;

    const nextKey = roomKey(selectedRoom);
    if (selectedKey !== nextKey) setSelectedKey(nextKey);
    if (!getNightInfo(deals, selectedRoom, selectedDate)) {
      setSelectedDate(firstAvailableDate(deals, selectedRoom));
    }
  }, [deals, selectedDate, selectedKey, selectedRoom]);

  const currentNight = selectedRoom ? getNightInfo(deals, selectedRoom, selectedDate) : null;
  const currentPrice = currentNight?.price || (selectedRoom ? minDirectPrice(deals, selectedRoom) : null);
  const href = requestHref(selectedRoom, selectedDate, guests, currentPrice);

  return (
    <section className="px-4 py-10 md:px-8 md:py-18" aria-labelledby="live-direct-title">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-amber-900/10 bg-[#fffaf3] shadow-2xl shadow-stone-900/10 md:rounded-[2.5rem]">
        <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 p-5 md:p-9 lg:p-10">
            <div className="mb-6 flex justify-center rounded-full bg-amber-100 px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-amber-800 ring-1 ring-amber-900/10 md:inline-flex md:justify-start">
              <span className="mr-2" aria-hidden="true">⚡</span>Instant request to reception
            </div>

            <div className="grid gap-5 xl:grid-cols-[1fr_260px] xl:items-end">
              <div>
                <h2 id="live-direct-title" className="text-balance font-serif text-[2.55rem] font-bold leading-[0.98] tracking-[-0.04em] text-[#17351f] md:text-6xl">
                  {data.title}
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-stone-700 md:text-lg">
                  Send an instant request to reception and get the best direct offer.
                </p>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-stone-500">Guests</span>
                <select
                  value={guests}
                  onChange={(event) => setGuests(Number(event.target.value))}
                  className="h-14 w-full rounded-2xl border border-stone-200 bg-white px-4 text-base font-black text-stone-900 shadow-sm outline-none ring-amber-700/20 transition focus:ring-4"
                >
                  {data.widget.guestButtons.map((button) => (
                    <option key={button.value} value={button.value}>{button.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-7">
              {loading ? (
                <div className="rounded-3xl bg-white p-6 text-sm font-bold text-stone-600 ring-1 ring-amber-900/10">{data.widget.loadingText}</div>
              ) : null}
              {error ? (
                <div className="rounded-3xl bg-white p-6 text-sm font-bold text-stone-600 ring-1 ring-amber-900/10">{error}</div>
              ) : null}
              {!loading && !error && !rooms.length ? (
                <div className="rounded-3xl bg-white p-6 text-sm font-bold text-stone-600 ring-1 ring-amber-900/10">No available rooms match these guests right now.</div>
              ) : null}
              {!loading && !error && rooms.length ? (
                <div className="flex snap-x gap-4 overflow-x-auto pb-3">
                  {rooms.map((room, index) => {
                    const active = selectedRoom && roomKey(selectedRoom) === roomKey(room);
                    const amount = minDirectPrice(deals, room);
                    return (
                      <button
                        key={roomKey(room)}
                        type="button"
                        onClick={() => {
                          setSelectedKey(roomKey(room));
                          setSelectedDate(firstAvailableDate(deals, room));
                        }}
                        className={`group min-w-[245px] snap-start overflow-hidden rounded-[1.35rem] bg-white p-2 text-left shadow-lg shadow-stone-900/5 ring-1 transition md:min-w-[260px] ${active ? "ring-2 ring-amber-700" : "ring-amber-900/10 hover:-translate-y-1 hover:ring-amber-700/40"}`}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.05rem] bg-stone-100">
                          <Image src={room.images[0]} alt={`${room.displayName} ${room.type}`} width={520} height={390} sizes="260px" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                          {index === 0 ? <span className="absolute left-2 top-2 rounded-full bg-amber-100 px-3 py-1.5 text-[11px] font-black text-amber-900 shadow-sm">Best match</span> : null}
                          {active ? <span className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-amber-800 shadow-lg">✓</span> : null}
                        </div>
                        <div className="px-2 pb-3 pt-4">
                          <h3 className="truncate text-lg font-black leading-6 text-stone-950">{room.displayName}</h3>
                          <p className="mt-1 truncate text-sm text-stone-600">{room.type}</p>
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-bold text-stone-700">{room.location}</span>
                            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-bold text-stone-700">Wi-Fi</span>
                          </div>
                          {amount ? <div className="mt-5 flex items-end gap-2"><span className="text-sm text-stone-500">from</span><strong className="text-2xl font-black text-[#17351f]">{money(amount)}</strong></div> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {selectedRoom && deals?.days?.length ? (
              <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-3">
                {deals.days.slice(0, 7).map((day) => {
                  const info = getNightInfo(deals, selectedRoom, day.checkin);
                  const active = selectedDate === day.checkin;
                  return (
                    <button
                      key={day.checkin}
                      type="button"
                      disabled={!info}
                      onClick={() => setSelectedDate(day.checkin)}
                      className={`min-w-[86px] snap-start rounded-2xl border px-3 py-4 text-center shadow-sm transition md:min-w-[100px] ${active ? "border-[#17351f] bg-[#17351f] text-white" : info ? "border-stone-200 bg-white text-stone-800 hover:border-amber-700" : "border-stone-200 bg-stone-100 text-stone-400"}`}
                    >
                      <span className="block text-sm font-black leading-5">{formatDate(day.checkin)}</span>
                      <span className="mt-2 block text-xs font-bold">{info ? "Available" : "-"}</span>
                      {info ? <span className="mt-1 block text-sm font-black">{money(info.price)}</span> : null}
                    </button>
                  );
                })}
              </div>
            ) : null}

            <div className="mt-3 grid grid-cols-2 gap-3 rounded-[1.4rem] bg-white p-4 text-center shadow-sm ring-1 ring-amber-900/10 md:grid-cols-4">
              {["Best direct offer", "Direct reply", "Choose your room", "No credit card"].map((item) => (
                <div key={item} className="text-xs font-black leading-5 text-stone-900 md:text-sm"><span className="mb-1 block text-xl text-amber-700">✓</span>{item}</div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 lg:hidden">
              <a href={CONTACT.phoneHref} className="flex min-h-14 items-center justify-center rounded-2xl border border-stone-300 bg-white px-5 text-center text-sm font-black uppercase tracking-[0.08em] text-stone-800 shadow-sm">☎ Call</a>
              <a href={href} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center rounded-2xl bg-[#17351f] px-5 text-center text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-emerald-950/20">WhatsApp</a>
            </div>
            <p className="mt-4 text-center text-xs font-semibold text-stone-500 lg:hidden">Your instant request at chioshotel.gr</p>
          </div>

          <aside className="hidden border-l border-amber-900/10 bg-white/70 p-8 lg:block">
            <div className="sticky top-24 rounded-[1.7rem] bg-white p-6 shadow-xl shadow-stone-900/10 ring-1 ring-amber-900/10">
              <div className="mb-5 flex items-center justify-between gap-4"><h3 className="text-xl font-black text-stone-950">Your request summary</h3><span className="text-3xl text-amber-700">⚡</span></div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-stone-200 bg-white p-4"><span className="block text-xs font-bold uppercase tracking-[0.12em] text-stone-400">Room</span><strong className="mt-1 block text-base text-stone-950">{selectedRoom?.displayName || "-"}</strong><span className="mt-1 block text-sm text-stone-500">{selectedRoom?.type || ""}</span></div>
                <div className="rounded-2xl border border-stone-200 bg-white p-4"><span className="block text-xs font-bold uppercase tracking-[0.12em] text-stone-400">Date</span><strong className="mt-1 block text-base text-stone-950">{formatDate(selectedDate)}</strong></div>
                <div className="rounded-2xl border border-stone-200 bg-white p-4"><span className="block text-xs font-bold uppercase tracking-[0.12em] text-stone-400">Guests</span><strong className="mt-1 block text-base text-stone-950">{guests}</strong></div>
                <div className="rounded-2xl border border-stone-200 bg-white p-4"><span className="block text-xs font-bold uppercase tracking-[0.12em] text-stone-400">What happens next?</span><p className="mt-2 text-sm font-semibold leading-6 text-stone-700">We will reply with our best available direct offer.</p></div>
              </div>
              <div className="mt-5 space-y-3">
                <a href={href} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center rounded-2xl bg-[#17351f] px-5 text-center text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-[#224d2d]">Send request</a>
                <a href={CONTACT.phoneHref} className="flex min-h-14 items-center justify-center rounded-2xl border border-stone-300 bg-white px-5 text-center text-sm font-black uppercase tracking-[0.08em] text-stone-800 transition hover:border-amber-700 hover:bg-amber-50">Call reception<br />{CONTACT.phoneDisplay}</a>
                <a href={href} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center rounded-2xl border border-emerald-700/30 bg-white px-5 text-center text-sm font-black uppercase tracking-[0.08em] text-emerald-800 transition hover:bg-emerald-50">WhatsApp</a>
              </div>
              <p className="mt-5 text-center text-xs font-semibold text-stone-500">Your instant request at chioshotel.gr</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
