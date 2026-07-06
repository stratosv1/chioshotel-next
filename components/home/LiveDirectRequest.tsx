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
  selectionTotals,
  type DealsResponse,
  type RoomMeta,
} from "@/components/home/liveDirectRequestUtils";

type LastMinuteData = HomePageData["lastMinute"];
type TrustIconType = "tag" | "chat" | "bed" | "card";

const CONTACT = {
  endpoint: "/api/deals",
  phoneHref: "tel:+302271031733",
  phoneDisplay: "+30 22710 31733",
  whatsapp: "306944474226",
};

const TRUST_ITEMS: { icon: TrustIconType; title: string; text: string }[] = [
  { icon: "tag", title: "Best direct offer", text: "Best available rate" },
  { icon: "chat", title: "Direct reply", text: "Reception response" },
  { icon: "bed", title: "Choose room", text: "Pick what suits you" },
  { icon: "card", title: "No credit card", text: "No payment now" },
];

function buildRequestHref(room: RoomMeta | null, dates: string[], guests: number, totals: { original: number; direct: number; nights: number } | null) {
  const text = [
    "Instant request to reception - Voulamandis House",
    "",
    `Room: ${room ? `${room.displayName} - ${room.type}` : "-"}`,
    `Guests: ${guests}`,
    `Dates: ${dates.length ? dates.join(", ") : "-"}`,
    totals ? `Nights: ${totals.nights}` : null,
    totals ? `Original price: ${money(totals.original)}` : null,
    totals ? `Direct offer: ${money(totals.direct)}` : null,
    "",
    "Please confirm availability and send your best direct offer.",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

function updateStickyRequestLink(href: string) {
  if (typeof document === "undefined") return;
  const fixedLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("div.fixed a"));
  const chatLink = fixedLinks.find((link) => (link.textContent || "").toLowerCase().includes("whatsapp"));
  if (chatLink) {
    chatLink.href = href;
    chatLink.target = "_blank";
    chatLink.rel = "noopener noreferrer";
  }
}

function TrustIcon({ type }: { type: TrustIconType }) {
  const common = "h-5 w-5 text-amber-700 md:h-6 md:w-6";
  if (type === "tag") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true"><path d="M20 13.2 13.2 20a2.4 2.4 0 0 1-3.4 0L4 14.2V4h10.2L20 9.8a2.4 2.4 0 0 1 0 3.4Z" /><path d="M8.3 8.3h.01" strokeLinecap="round" /></svg>;
  if (type === "chat") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true"><path d="M5 17.5 3.8 21l3.8-1.1A9.5 9.5 0 1 0 4.5 17.5Z" /><path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01" strokeLinecap="round" /></svg>;
  if (type === "bed") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true"><path d="M4 19V8.5A2.5 2.5 0 0 1 6.5 6H10a2 2 0 0 1 2 2v2h5.5A2.5 2.5 0 0 1 20 12.5V19" /><path d="M4 14h16M7 19v-2M17 19v-2" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true"><rect x="3.5" y="6.5" width="17" height="11" rx="2" /><path d="M3.5 10h17M7 14.5h4" /></svg>;
}

function HeartIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1Z" /></svg>;
}

export function LiveDirectRequest({ data }: { data: LastMinuteData; canonicalPath: string }) {
  const [deals, setDeals] = useState<DealsResponse | null>(null);
  const [guests, setGuests] = useState(2);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadDeals() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(CONTACT.endpoint, { headers: { Accept: "application/json" }, cache: "no-store" });
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
    return () => { active = false; };
  }, []);

  const rooms = useMemo(() => mergeDealRooms(deals)
    .filter((room) => room.maxGuests >= guests)
    .filter((room) => firstAvailableDate(deals, room, guests))
    .sort((a, b) => Number(minDirectPrice(deals, a, guests) || Infinity) - Number(minDirectPrice(deals, b, guests) || Infinity)), [deals, guests]);

  const selectedRoom = rooms.find((room) => roomKey(room) === selectedKey) || rooms[0] || null;
  const visibleDays = useMemo(() => (deals?.days || []).slice(0, 7), [deals]);

  useEffect(() => {
    if (!selectedRoom) return;
    const nextKey = roomKey(selectedRoom);
    if (selectedKey !== nextKey) setSelectedKey(nextKey);
    const validSelectedDates = selectedDates.filter((date) => getNightInfo(deals, selectedRoom, date, guests));
    if (!validSelectedDates.length) {
      const firstDate = firstAvailableDate(deals, selectedRoom, guests);
      setSelectedDates(firstDate ? [firstDate] : []);
    } else if (validSelectedDates.length !== selectedDates.length) {
      setSelectedDates(validSelectedDates);
    }
  }, [deals, guests, selectedDates, selectedKey, selectedRoom]);

  const totals = selectionTotals(deals, selectedRoom, selectedDates, guests);
  const requestHref = buildRequestHref(selectedRoom, selectedDates, guests, totals);
  const selectedDateLabel = selectedDates.length ? selectedDates.map((date) => formatDate(date)).join(" → ") : "";

  useEffect(() => {
    updateStickyRequestLink(requestHref);
    window.dispatchEvent(new CustomEvent("live-direct-request:update", { detail: { href: requestHref } }));
  }, [requestHref]);

  function handleDateClick(date: string) {
    if (!selectedRoom || !getNightInfo(deals, selectedRoom, date, guests)) return;
    const availableDates = visibleDays.filter((day) => getNightInfo(deals, selectedRoom, day.checkin, guests)).map((day) => day.checkin);
    if (!selectedDates.length) return setSelectedDates([date]);
    const firstIndex = availableDates.indexOf(selectedDates[0]);
    const targetIndex = availableDates.indexOf(date);
    if (firstIndex < 0 || targetIndex < 0 || targetIndex < firstIndex) return setSelectedDates([date]);
    setSelectedDates(availableDates.slice(firstIndex, targetIndex + 1));
  }

  return (
    <section className="px-4 py-8 md:px-8 md:py-16" aria-labelledby="live-direct-title">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-amber-900/10 bg-[#fffaf3] shadow-2xl shadow-stone-900/10 md:rounded-[2.5rem]">
        <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="relative min-w-0 p-4 md:p-8 lg:p-9">
            <div className="mb-4 flex justify-center rounded-full bg-amber-100/90 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-amber-800 ring-1 ring-amber-900/10 md:inline-flex md:justify-start md:text-[11px]"><span className="mr-2" aria-hidden="true">⚡</span>Instant request to reception</div>
            <span className="pointer-events-none absolute right-7 top-24 text-5xl font-black text-amber-700/80 md:hidden" aria-hidden="true">⚡</span>
            <div className="grid gap-4 xl:grid-cols-[1fr_250px] xl:items-end">
              <div><h2 id="live-direct-title" className="max-w-[640px] pr-12 font-serif text-[2.35rem] font-bold leading-[0.98] tracking-[-0.04em] text-[#17351f] md:pr-0 md:text-6xl">{data.title}</h2><p className="mt-4 max-w-2xl text-[15px] leading-7 text-stone-700 md:text-lg md:leading-8">Send an instant request to reception and get the best direct offer.</p></div>
              <label className="block"><span className="mb-2 block text-[11px] font-black uppercase tracking-[0.16em] text-stone-500 md:text-xs">Guests</span><select value={guests} onChange={(event) => setGuests(Number(event.target.value))} className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-base font-black text-stone-900 shadow-sm outline-none ring-amber-700/20 transition focus:ring-4 md:h-14">{data.widget.guestButtons.map((button) => <option key={button.value} value={button.value}>{button.label}</option>)}</select></label>
            </div>

            <div className="mt-6">
              {loading ? <div className="rounded-3xl bg-white p-6 text-sm font-bold text-stone-600 ring-1 ring-amber-900/10">{data.widget.loadingText}</div> : null}
              {error ? <div className="rounded-3xl bg-white p-6 text-sm font-bold text-stone-600 ring-1 ring-amber-900/10">{error}</div> : null}
              {!loading && !error && !rooms.length ? <div className="rounded-3xl bg-white p-6 text-sm font-bold text-stone-600 ring-1 ring-amber-900/10">No available rooms match these guests right now.</div> : null}
              {!loading && !error && rooms.length ? (
                <div className="flex snap-x gap-3 overflow-x-auto px-1 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-4">
                  {rooms.map((room, index) => {
                    const active = selectedRoom && roomKey(selectedRoom) === roomKey(room);
                    const amount = minDirectPrice(deals, room, guests);
                    return (
                      <button key={roomKey(room)} type="button" onClick={() => { setSelectedKey(roomKey(room)); const date = firstAvailableDate(deals, room, guests); setSelectedDates(date ? [date] : []); }} className={`group w-[178px] flex-none snap-start rounded-[1.15rem] bg-white p-2 text-left transition md:w-[240px] md:rounded-[1.3rem] ${active ? "border border-amber-700 shadow-[0_14px_34px_rgba(146,64,14,0.18)] ring-1 ring-amber-600/40" : "border border-stone-200/70 shadow-md shadow-stone-900/5 hover:-translate-y-1 hover:border-amber-700/40 hover:shadow-lg hover:shadow-stone-900/10"}`}>
                        <div className="relative h-[122px] overflow-hidden rounded-[0.95rem] bg-stone-100 md:h-[150px] md:rounded-[1rem]">
                          <Image src={room.images[0]} alt={`${room.displayName} ${room.type}`} width={500} height={380} sizes="240px" className="h-full w-full scale-110 object-cover object-center transition duration-500 group-hover:scale-[1.16]" />
                          {index === 0 ? <span className="absolute left-2 top-2 rounded-full bg-amber-100/95 px-2.5 py-1 text-[10px] font-black text-amber-900 shadow-sm md:text-[11px]">Best match</span> : null}
                          {active ? <span className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-lg font-black text-amber-800 shadow-md md:h-9 md:w-9">✓</span> : <span className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-stone-950/30 text-white backdrop-blur-sm"><HeartIcon /></span>}
                        </div>
                        <div className="px-1.5 pb-2 pt-3 md:px-2 md:pb-3 md:pt-4">
                          <h3 className="truncate text-[16px] font-black leading-5 text-stone-950 md:text-lg md:leading-6">{room.displayName}</h3>
                          <p className="mt-1 truncate text-[13px] text-stone-600 md:text-sm">{room.type}</p>
                          <div className="mt-3 flex flex-wrap gap-1.5 md:mt-4">{room.featureBadges.slice(0, 3).map((badge) => <span key={badge} className="inline-flex items-center rounded-md bg-stone-100/90 px-1.5 py-1 text-[9px] font-bold text-stone-700 ring-1 ring-stone-200 md:px-2 md:text-[10px]">{badge}</span>)}</div>
                          {amount ? <div className="mt-3 flex items-end gap-1.5 md:mt-4"><span className="text-xs text-stone-500 md:text-sm">from</span><strong className="text-xl font-black text-[#17351f] md:text-2xl">{money(amount)}</strong></div> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {selectedRoom ? <div className="mt-4 hidden gap-4 rounded-[1.45rem] bg-white p-4 shadow-sm ring-1 ring-amber-900/10 md:grid md:grid-cols-[240px_1fr]"><div className="relative min-h-[180px] overflow-hidden rounded-[1.1rem] bg-stone-100"><Image src={selectedRoom.images[0]} alt={`${selectedRoom.displayName} ${selectedRoom.type}`} fill sizes="240px" className="scale-110 object-cover object-center" /></div><div className="min-w-0 self-center"><span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-amber-800 ring-1 ring-amber-900/10">{selectedRoom.primaryBadge}</span><h3 className="mt-2 font-serif text-3xl font-bold leading-tight text-stone-950">{selectedRoom.displayName}</h3><p className="mt-1 font-bold text-amber-800">{selectedRoom.type}</p><div className="mt-3 flex flex-wrap gap-2">{selectedRoom.featureBadges.map((badge) => <span key={badge} className="rounded-md bg-stone-100/90 px-3 py-1.5 text-xs font-bold text-stone-700 ring-1 ring-stone-200">{badge}</span>)}</div><p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">Send a direct request for this room and receive a personal reply from reception with the best available offer.</p></div></div> : null}

            {selectedRoom && visibleDays.length ? (
              <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-3">
                {visibleDays.map((day) => {
                  const info = getNightInfo(deals, selectedRoom, day.checkin, guests);
                  const active = selectedDates.includes(day.checkin);
                  return <button key={day.checkin} type="button" disabled={!info} onClick={() => handleDateClick(day.checkin)} className={`relative w-[66px] flex-none snap-start rounded-2xl border px-1.5 py-3 text-center shadow-sm transition md:w-[88px] ${active ? "border-[#17351f] bg-[#17351f] text-white shadow-lg shadow-emerald-950/15" : info ? "border-stone-200 bg-white text-stone-900 hover:border-amber-700" : "border-stone-200 bg-stone-100 text-stone-400"}`}><span className="block text-[11px] font-black leading-4 md:text-sm">{formatDate(day.checkin)}</span>{active ? <span className="mx-auto my-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-white shadow-sm">✓</span> : <span className="block h-2" aria-hidden="true" />}<span className="block text-[10px] font-bold leading-4 md:text-xs">{info ? "Available" : "-"}</span><span className={`mt-1 block text-[12px] font-black leading-4 md:text-sm ${active ? "text-white" : "text-[#17351f]"}`}>{info ? money(info.direct) : ""}</span></button>;
                })}
              </div>
            ) : null}

            {totals ? <div className="mt-2 rounded-[1.25rem] bg-white px-4 py-3 text-center shadow-sm ring-1 ring-amber-900/10 md:rounded-[1.4rem] md:py-4"><div className="text-[11px] font-black uppercase tracking-[0.14em] text-stone-500 md:text-xs">{selectedRoom?.displayName || "Selected room"} · Direct offer · {totals.nights} {totals.nights === 1 ? "night" : "nights"}</div><div className="mt-1 text-[11px] font-bold text-stone-500 md:text-xs">{selectedDateLabel}</div><div className="mt-1.5 flex items-end justify-center gap-3"><span className="text-base font-black text-red-600 line-through md:text-lg">{money(totals.original)}</span><strong className="text-2xl font-black text-emerald-700 md:text-3xl">{money(totals.direct)}</strong></div></div> : null}

            <div className="mt-3 grid grid-cols-4 gap-0 rounded-[1.25rem] bg-white p-3 text-center shadow-sm ring-1 ring-amber-900/10 md:rounded-[1.4rem] md:p-4">{TRUST_ITEMS.map((item) => <div key={item.title} className="border-r border-stone-200 px-1 text-[9px] font-semibold leading-4 text-stone-800 last:border-r-0 md:text-xs md:leading-5"><span className="mb-1 flex justify-center" aria-hidden="true"><TrustIcon type={item.icon} /></span><strong className="block font-black">{item.title}</strong><span className="hidden text-stone-500 md:block">{item.text}</span></div>)}</div>
            <p className="mt-4 pb-28 text-center text-xs font-semibold text-stone-500 lg:hidden md:pb-0">Your instant request at chioshotel.gr</p>
          </div>

          <aside className="hidden border-l border-amber-900/10 bg-white/70 p-8 lg:block"><div className="sticky top-24 rounded-[1.7rem] bg-white p-6 shadow-xl shadow-stone-900/10 ring-1 ring-amber-900/10"><div className="mb-5 flex items-center justify-between gap-4"><h3 className="text-xl font-black text-stone-950">Your request summary</h3><span className="text-3xl text-amber-700">⚡</span></div><div className="space-y-3"><div className="rounded-2xl border border-stone-200 bg-white p-4"><span className="block text-xs font-bold uppercase tracking-[0.12em] text-stone-400">Room</span><strong className="mt-1 block text-base text-stone-950">{selectedRoom?.displayName || "-"}</strong><span className="mt-1 block text-sm text-stone-500">{selectedRoom?.type || ""}</span></div><div className="rounded-2xl border border-stone-200 bg-white p-4"><span className="block text-xs font-bold uppercase tracking-[0.12em] text-stone-400">Dates</span><strong className="mt-1 block text-base text-stone-950">{selectedDateLabel || "-"}</strong></div><div className="rounded-2xl border border-stone-200 bg-white p-4"><span className="block text-xs font-bold uppercase tracking-[0.12em] text-stone-400">Guests</span><strong className="mt-1 block text-base text-stone-950">{guests}</strong></div>{totals ? <div className="rounded-2xl border border-stone-200 bg-white p-4"><span className="block text-xs font-bold uppercase tracking-[0.12em] text-stone-400">Direct offer</span><div className="mt-2 flex items-end gap-3"><span className="text-base font-black text-red-600 line-through">{money(totals.original)}</span><strong className="text-2xl font-black text-emerald-700">{money(totals.direct)}</strong></div></div> : null}<div className="rounded-2xl border border-stone-200 bg-white p-4"><span className="block text-xs font-bold uppercase tracking-[0.12em] text-stone-400">What happens next?</span><p className="mt-2 text-sm font-semibold leading-6 text-stone-700">We will reply with our best available direct offer.</p></div></div><div className="mt-5 space-y-3"><a href={requestHref} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center rounded-2xl bg-[#17351f] px-5 text-center text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-[#224d2d]">Send request</a><a href={CONTACT.phoneHref} className="flex min-h-14 items-center justify-center rounded-2xl border border-stone-300 bg-white px-5 text-center text-sm font-black uppercase tracking-[0.08em] text-stone-800 transition hover:border-amber-700 hover:bg-amber-50">Call reception<br />{CONTACT.phoneDisplay}</a><a href={requestHref} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center rounded-2xl border border-emerald-700/30 bg-white px-5 text-center text-sm font-black uppercase tracking-[0.08em] text-emerald-800 transition hover:bg-emerald-50">WhatsApp</a></div><p className="mt-5 text-center text-xs font-semibold text-stone-500">Your instant request at chioshotel.gr</p></div></aside>
        </div>
      </div>
    </section>
  );
}
