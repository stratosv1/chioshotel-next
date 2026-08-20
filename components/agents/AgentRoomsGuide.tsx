"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

export type AgentRoom = {
  roomNumber: number;
  displayName: string;
  roomType: string;
  floor: string;
  maxGuests: number;
  standardCapacity: number;
  isEconomy: boolean;
  noStairs: boolean;
  hasFullKitchen: boolean;
  hasKitchenette: boolean;
  hasBalcony: boolean;
  sizeM2: number;
  spaceLayout: string;
  bedSetup: Record<string, number>;
  hasUpperFloorView: boolean;
  hasGardenView: boolean;
  extraBedAvailable: boolean;
  gallery: string[];
};

type CommonAmenity = {
  key: string;
  label: string;
};

type Props = {
  rooms: AgentRoom[];
  commonAmenities: CommonAmenity[];
};

function Glyph({ type, className = "h-4 w-4" }: { type: string; className?: string }) {
  const base = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (type === "bed") {
    return <svg {...base}><path d="M3 18v-7h18v7"/><path d="M5 11V7h6a3 3 0 0 1 3 3v1"/><path d="M3 15h18M5 18v2M19 18v2"/></svg>;
  }
  if (type === "users") {
    return <svg {...base}><path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M21 20v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
  }
  if (type === "stairs") {
    return <svg {...base}><path d="M3 18h5v-4h4v-4h4V6h5"/></svg>;
  }
  if (type === "size") {
    return <svg {...base}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>;
  }
  if (type === "kitchen") {
    return <svg {...base}><path d="M5 3v18M19 3v18M5 8h14M8 5h3M8 12h2M14 12h2"/></svg>;
  }
  if (type === "balcony") {
    return <svg {...base}><path d="M4 21V9h16v12M8 9V4h8v5M4 15h16M8 15v6M12 15v6M16 15v6"/></svg>;
  }
  if (type === "view") {
    return <svg {...base}><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></svg>;
  }
  if (type === "mini_fridge") {
    return <svg {...base}><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M7 10h10M10 6h1M10 13h1"/></svg>;
  }
  if (type === "kettle") {
    return <svg {...base}><path d="M7 8h8l1 11H6L7 8Z"/><path d="M9 8V5h4v3M16 10h2a3 3 0 0 1 0 6h-1.5"/></svg>;
  }
  if (type === "coffee" || type === "tea") {
    return <svg {...base}><path d="M5 8h11v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z"/><path d="M16 10h2a2 2 0 0 1 0 4h-2M8 3v2M12 3v2"/></svg>;
  }
  if (type === "air_condition") {
    return <svg {...base}><rect x="3" y="4" width="18" height="7" rx="2"/><path d="M7 14c0 2 2 2 2 4M12 14c0 2 2 2 2 4M17 14c0 2 2 2 2 4"/></svg>;
  }
  if (type === "free_wifi") {
    return <svg {...base}><path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01"/></svg>;
  }
  if (type === "flat_screen_tv") {
    return <svg {...base}><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/></svg>;
  }
  if (type === "private_bathroom") {
    return <svg {...base}><path d="M4 13h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2Z"/><path d="M7 13V6a3 3 0 0 1 6 0M5 20v1M19 20v1"/></svg>;
  }
  if (type === "non_smoking") {
    return <svg {...base}><path d="M4 15h12M18 15h2M6 9c2 0 2 2 4 2s2-2 4-2M4 4l16 16"/></svg>;
  }
  return <svg {...base}><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>;
}

function roomCategory(room: AgentRoom) {
  if (room.roomNumber === 10) return "Large family apartment";
  if (room.roomType === "apartment") return "Family apartment";
  if (room.isEconomy) return "Economy double room";
  if (room.maxGuests === 4) return "Quadruple room";
  if (room.maxGuests === 3 && room.noStairs) return "Ground-floor triple room";
  if (room.maxGuests === 3) return "First-floor triple room";
  return "Guest room";
}

function bedLabel(key: string, count: number) {
  const labels: Record<string, [string, string]> = {
    double_bed: ["double bed", "double beds"],
    single_bed: ["single bed", "single beds"],
    sofa_bed: ["sofa bed", "sofa beds"],
    single_sofa_bed: ["single sofa bed", "single sofa beds"],
  };
  const label = labels[key] || [key.replaceAll("_", " "), key.replaceAll("_", " ")];
  return `${count} ${count === 1 ? label[0] : label[1]}`;
}

function bedsText(room: AgentRoom) {
  return Object.entries(room.bedSetup)
    .map(([key, count]) => bedLabel(key, count))
    .join(" + ");
}

function spacesText(layout: string) {
  if (layout === "two_spaces_without_connecting_door") return "2 sleeping areas · open connection";
  if (layout === "two_spaces") return "2 separate living/sleeping areas";
  return "1 room / sleeping area";
}

function PhotoGallery({ room, activeIndex, onSelect }: {
  room: AgentRoom;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const current = room.gallery[activeIndex] || room.gallery[0];

  return (
    <div className="p-3 sm:p-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-[#ece6de]">
        <Image
          src={current}
          alt={`${room.displayName} photo ${activeIndex + 1}`}
          fill
          sizes="(max-width: 767px) 88vw, 36vw"
          className="object-cover"
          priority={room.roomNumber === 1}
        />
        <div className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-[#554a3d] shadow-sm backdrop-blur">
          {activeIndex + 1} / {room.gallery.length}
        </div>
      </div>
      <div className="mt-2.5 grid grid-cols-4 gap-2">
        {room.gallery.map((photo, index) => (
          <button
            type="button"
            key={`${room.roomNumber}-${photo}`}
            onClick={() => onSelect(index)}
            className={`relative aspect-[4/3] overflow-hidden rounded-xl border transition ${index === activeIndex ? "border-[#756553] ring-1 ring-[#756553]" : "border-[#ddd3c7] hover:border-[#a79682]"}`}
            aria-label={`Show photo ${index + 1} of ${room.displayName}`}
          >
            <Image src={photo} alt="" fill sizes="100px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function AgentRoomsGuide({ rooms, commonAmenities }: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [guestCounts, setGuestCounts] = useState<Record<number, string>>({});
  const [activePhotos, setActivePhotos] = useState<Record<number, number>>({});
  const [copied, setCopied] = useState(false);

  const selected = useMemo(
    () => rooms.filter(room => selectedRooms.includes(room.roomNumber)),
    [rooms, selectedRooms],
  );

  const totalGuests = selected.reduce((sum, room) => {
    const value = Number(guestCounts[room.roomNumber] || 0);
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

  function toggleRoom(room: AgentRoom) {
    setSelectedRooms(current => {
      if (current.includes(room.roomNumber)) {
        setGuestCounts(counts => {
          const next = { ...counts };
          delete next[room.roomNumber];
          return next;
        });
        return current.filter(number => number !== room.roomNumber);
      }
      setGuestCounts(counts => ({ ...counts, [room.roomNumber]: "1" }));
      return [...current, room.roomNumber].sort((a, b) => a - b);
    });
  }

  function updateGuests(room: AgentRoom, raw: string) {
    if (raw === "") {
      setGuestCounts(current => ({ ...current, [room.roomNumber]: "" }));
      return;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;
    const clamped = Math.min(room.maxGuests, Math.max(1, Math.trunc(parsed)));
    setGuestCounts(current => ({ ...current, [room.roomNumber]: String(clamped) }));
  }

  function scrollMobile(direction: -1 | 1) {
    const element = carouselRef.current;
    if (!element) return;
    element.scrollBy({ left: direction * element.clientWidth * 0.9, behavior: "smooth" });
  }

  async function copyAllocation() {
    if (!selected.length) return;
    const lines = [
      "Voulamandis House — room allocation",
      ...selected.map(room => `${room.displayName}: ${guestCounts[room.roomNumber] || "—"} guest(s)`),
      `Total guests: ${totalGuests}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f2ec] text-[#332d27]">
      <section className="border-b border-[#ded5c9] bg-[#eee7de]">
        <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 md:py-9 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#796b5b]">Voulamandis House · Agent guide</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#332d27] md:text-4xl">Room allocation guide</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#665d53] md:text-base">
                Compare every room, bed configuration and amenity, then select the rooms you want and enter how many guests will stay in each one.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d3c7b8] bg-white/75 px-3 py-1.5 text-xs font-semibold text-[#65594c]">
              <Glyph type="users" className="h-3.5 w-3.5" />
              No prices shown
            </div>
          </div>

          <div className="mt-6 rounded-[20px] border border-[#d8cec1] bg-white/70 p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#eee7de] text-[#6b5e50]"><Glyph type="kettle" /></span>
              <div>
                <p className="text-sm font-bold text-[#40372f]">Included in every room</p>
                <p className="text-xs text-[#756b61]">These amenities apply to rooms 1–10.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {commonAmenities.map(amenity => (
                <span key={amenity.key} className="inline-flex items-center gap-1.5 rounded-full border border-[#e0d7cc] bg-[#faf8f5] px-2.5 py-1.5 text-xs font-medium text-[#5d5348]">
                  <Glyph type={amenity.key} className="h-3.5 w-3.5" />
                  {amenity.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] py-6 md:px-6 md:py-8 lg:px-8">
        <div className="mb-4 flex items-center justify-between px-4 md:px-0">
          <div>
            <h2 className="text-lg font-bold text-[#3d352e]">Rooms 1–10</h2>
            <p className="mt-0.5 text-xs text-[#7a7066] md:hidden">Swipe to compare rooms</p>
          </div>
          <div className="flex gap-2 md:hidden">
            <button type="button" onClick={() => scrollMobile(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d5cabd] bg-white text-xl text-[#5d5144] shadow-sm" aria-label="Previous room">‹</button>
            <button type="button" onClick={() => scrollMobile(1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d5cabd] bg-white text-xl text-[#5d5144] shadow-sm" aria-label="Next room">›</button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:block md:space-y-6 md:overflow-visible md:px-0"
        >
          {rooms.map(room => {
            const isSelected = selectedRooms.includes(room.roomNumber);
            const assigned = Number(guestCounts[room.roomNumber] || 0);
            const needsExtraBed = room.extraBedAvailable && assigned > room.standardCapacity;
            const details = [
              { icon: "users", label: room.standardCapacity < room.maxGuests ? `${room.standardCapacity} standard · max ${room.maxGuests}` : `Up to ${room.maxGuests} guests` },
              { icon: "stairs", label: room.noStairs ? "No stairs" : "Stairs required" },
              { icon: "size", label: `${room.sizeM2} m²` },
              { icon: "bed", label: spacesText(room.spaceLayout) },
            ];

            const roomAmenities = [
              room.hasFullKitchen ? { icon: "kitchen", label: "Full kitchen" } : null,
              room.hasKitchenette ? { icon: "kitchen", label: "Kitchenette" } : null,
              room.hasBalcony ? { icon: "balcony", label: "Private balcony" } : null,
              room.hasUpperFloorView ? { icon: "view", label: "Upper-floor view" } : null,
              room.hasGardenView ? { icon: "view", label: "Garden view / access" } : null,
              room.extraBedAvailable ? { icon: "bed", label: "Extra bed available for 5th guest" } : null,
            ].filter(Boolean) as { icon: string; label: string }[];

            return (
              <article
                key={room.roomNumber}
                className={`min-w-[88vw] snap-center overflow-hidden rounded-[24px] border bg-white shadow-[0_8px_30px_rgba(77,64,49,0.07)] transition md:min-w-0 md:grid md:grid-cols-[minmax(300px,36%)_1fr_235px] ${isSelected ? "border-[#8b765f] ring-2 ring-[#8b765f]/15" : "border-[#ded5c9]"}`}
              >
                <PhotoGallery
                  room={room}
                  activeIndex={activePhotos[room.roomNumber] || 0}
                  onSelect={index => setActivePhotos(current => ({ ...current, [room.roomNumber]: index }))}
                />

                <div className="border-t border-[#eee8e0] px-4 py-5 sm:px-5 md:border-l md:border-t-0 md:px-6 md:py-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#ece4da] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#68594a]">Room {room.roomNumber}</span>
                        {room.isEconomy ? <span className="rounded-full border border-[#ddd2c4] px-2.5 py-1 text-[11px] font-semibold text-[#756858]">Economy</span> : null}
                      </div>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#342d27]">{room.displayName}</h3>
                      <p className="mt-1 text-sm font-medium text-[#756858]">{roomCategory(room)}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2.5">
                    {details.map(detail => (
                      <div key={detail.label} className="flex min-h-[52px] items-center gap-2.5 rounded-2xl bg-[#f7f3ee] px-3 py-2.5 text-xs font-semibold leading-4 text-[#5c5146]">
                        <span className="text-[#766553]"><Glyph type={detail.icon} /></span>
                        {detail.label}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-[#eee7df] pt-4">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.11em] text-[#7a6c5d]"><Glyph type="bed" className="h-4 w-4" /> Beds</p>
                    <p className="mt-1.5 text-[15px] font-semibold leading-6 text-[#3f3730]">{bedsText(room)}</p>
                    {room.roomNumber === 1 ? <p className="mt-1 text-xs leading-5 text-[#766b60]">Two single sofa beds are used for the 3rd and 4th guests.</p> : null}
                    {room.roomNumber === 10 ? <p className="mt-1 text-xs leading-5 text-[#766b60]">Standard setup is for 4 guests. For 5 guests, an extra bed is added and the space is tighter.</p> : null}
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-[0.11em] text-[#7a6c5d]">Room-specific features</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {roomAmenities.length ? roomAmenities.map(item => (
                        <span key={item.label} className="inline-flex items-center gap-1.5 rounded-full border border-[#dfd6ca] bg-white px-2.5 py-1.5 text-xs font-medium text-[#5f5448]">
                          <Glyph type={item.icon} className="h-3.5 w-3.5" />{item.label}
                        </span>
                      )) : <span className="text-xs text-[#7a7066]">Standard room amenities only</span>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-[0.11em] text-[#7a6c5d]">Standard amenities in this room</p>
                    <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3">
                      {commonAmenities.map(amenity => (
                        <div key={`${room.roomNumber}-${amenity.key}`} className="flex items-center gap-1.5 text-[11px] font-medium text-[#6a6056]">
                          <span className="text-[#847563]"><Glyph type={amenity.key} className="h-3.5 w-3.5" /></span>
                          {amenity.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <aside className={`border-t border-[#e8e0d7] p-4 md:border-l md:border-t-0 md:p-5 ${isSelected ? "bg-[#f1ebe3]" : "bg-[#faf8f5]"}`}>
                  <div className="md:sticky md:top-5">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#746657]">Allocation</p>
                    <button
                      type="button"
                      onClick={() => toggleRoom(room)}
                      className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition ${isSelected ? "border-[#6e5f50] bg-[#6e5f50] text-white" : "border-[#cfc3b5] bg-white text-[#554a3f] hover:border-[#9c8974]"}`}
                    >
                      <span className={`flex h-5 w-5 items-center justify-center rounded-md border ${isSelected ? "border-white/70 bg-white/10" : "border-[#b8aa9a]"}`}>
                        {isSelected ? "✓" : ""}
                      </span>
                      {isSelected ? "Room selected" : "Select room"}
                    </button>

                    <label className="mt-4 block">
                      <span className="mb-1.5 block text-xs font-semibold text-[#6c6054]">Guests staying in this room</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={room.maxGuests}
                          disabled={!isSelected}
                          value={isSelected ? guestCounts[room.roomNumber] ?? "" : ""}
                          onChange={event => updateGuests(room, event.target.value)}
                          placeholder="—"
                          className="h-12 w-20 rounded-xl border border-[#cfc4b7] bg-white px-3 text-center text-lg font-bold text-[#40362e] outline-none transition focus:border-[#796754] focus:ring-2 focus:ring-[#796754]/15 disabled:cursor-not-allowed disabled:bg-[#f1ede8] disabled:text-[#aaa096]"
                        />
                        <span className="text-xs leading-5 text-[#756a5f]">Max<br/><strong className="text-[#4d4339]">{room.maxGuests}</strong></span>
                      </div>
                    </label>

                    {needsExtraBed ? (
                      <div className="mt-3 rounded-xl border border-[#d8c7ad] bg-[#fff9ed] px-3 py-2 text-xs font-semibold leading-5 text-[#69563d]">Extra bed required for the 5th guest.</div>
                    ) : null}
                  </div>
                </aside>
              </article>
            );
          })}
        </div>
      </section>

      <div className={`sticky bottom-0 z-20 border-t border-[#d7ccbf] bg-[#f7f2ec]/95 shadow-[0_-8px_26px_rgba(67,54,42,0.08)] backdrop-blur transition ${selected.length ? "translate-y-0" : "translate-y-full"}`}>
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-sm font-bold text-[#433930]">{selected.length} room{selected.length === 1 ? "" : "s"} selected · {totalGuests} guest{totalGuests === 1 ? "" : "s"}</p>
            <p className="mt-0.5 truncate text-xs text-[#766b60]">{selected.map(room => `${room.displayName}: ${guestCounts[room.roomNumber] || "—"}`).join(" · ")}</p>
          </div>
          <button type="button" onClick={copyAllocation} className="shrink-0 rounded-xl bg-[#665849] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#574a3d]">
            {copied ? "Copied" : "Copy allocation"}
          </button>
        </div>
      </div>
    </main>
  );
}
