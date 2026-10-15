"use client";

import Image from "next/image";
import type React from "react";
import { useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  Bath,
  BedDouble,
  Building2,
  Check,
  ChevronRight,
  CircleCheck,
  Copy,
  Eye,
  Mail,
  MessageCircle,
  Ruler,
  Snowflake,
  Tv,
  Users,
  Utensils,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type { LanguageCode } from "@/lib/languages";
import {
  type AgentRoomGuideCopy,
} from "@/content/agent-room-guide";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChiosCollectionImageGallery } from "@/components/chios/ChiosCollectionImageGallery";
import {
  fillAgentTemplate,
  type AgentGuideStats,
  type AgentRoomGuideExtras,
} from "@/content/agent-room-guide-extras";

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
  sizeLabel: string | null;
  spaceLayout: string;
  outdoorSpace: string | null;
  entranceSteps: number;
  hasHandrail: boolean;
  wheelchairAccessible: boolean;
  kitchenType: string;
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
  language: LanguageCode;
  copy: AgentRoomGuideCopy;
  rooms: AgentRoom[];
  commonAmenities: CommonAmenity[];
  extras: AgentRoomGuideExtras;
  stats: AgentGuideStats;
  faq: { question: string; answer: string }[];
};

const CONTACT_EMAIL = "chioshotel@gmail.com";
const WHATSAPP_PHONE = "306944474226";

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  floor: Building2,
  stairs: ArrowUp,
  size: Ruler,
  bed: BedDouble,
  kitchen: Utensils,
  balcony: Eye,
  view: Eye,
  mini_fridge: CircleCheck,
  kettle: CircleCheck,
  coffee: CircleCheck,
  tea: CircleCheck,
  air_condition: Snowflake,
  free_wifi: Wifi,
  flat_screen_tv: Tv,
  private_bathroom: Bath,
  non_smoking: CircleCheck,
};

function FeatureIcon({ type, className = "h-4 w-4" }: { type: string; className?: string }) {
  const Icon = ICONS[type] || CircleCheck;
  return <Icon className={className} aria-hidden="true" />;
}

function format(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

function roomName(room: AgentRoom, copy: AgentRoomGuideCopy) {
  return `${room.roomType === "apartment" ? copy.labels.apartment : copy.labels.room} ${room.roomNumber}`;
}

function roomCategory(room: AgentRoom, copy: AgentRoomGuideCopy) {
  if (room.roomNumber === 1) return copy.categories.doubleTriple;
  if (room.roomNumber === 10) return copy.categories.largeFamilyApartment;
  if (room.roomType === "apartment") return copy.categories.familyApartment;
  if (room.isEconomy) return copy.categories.economyDouble;
  if (room.maxGuests === 4) return copy.categories.quadruple;
  if (room.maxGuests === 3 && room.noStairs) return copy.categories.groundTriple;
  if (room.maxGuests === 3) return copy.categories.firstTriple;
  return copy.categories.guestRoom;
}

function floorText(room: AgentRoom, copy: AgentRoomGuideCopy) {
  if (room.roomType === "apartment") return copy.labels.groundIndependent;
  if (room.noStairs) return copy.labels.groundFloor;
  return copy.labels.firstFloor;
}

function bedLabel(key: string, count: number, copy: AgentRoomGuideCopy) {
  const labels = copy.beds[key] || [key.replaceAll("_", " "), key.replaceAll("_", " ")];
  return `${count} ${count === 1 ? labels[0] : labels[1]}`;
}

function bedsText(room: AgentRoom, copy: AgentRoomGuideCopy) {
  return Object.entries(room.bedSetup)
    .map(([key, count]) => bedLabel(key, count, copy))
    .join(" + ");
}

function spacesText(layout: string, copy: AgentRoomGuideCopy) {
  if (layout === "two_spaces_without_connecting_door") return copy.spaces.twoOpen;
  if (layout === "two_spaces") return copy.spaces.twoSeparate;
  return copy.spaces.one;
}

function photoAlt(room: AgentRoom, copy: AgentRoomGuideCopy, extras: AgentRoomGuideExtras, index: number) {
  return fillAgentTemplate(extras.photoAlt, {
    name: roomName(room, copy),
    category: roomCategory(room, copy).toLowerCase(),
    index: index + 1,
  });
}

function PhotoGallery({
  room,
  copy,
  extras,
  activeIndex,
  onSelect,
}: {
  room: AgentRoom;
  copy: AgentRoomGuideCopy;
  extras: AgentRoomGuideExtras;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const current = room.gallery[activeIndex] || room.gallery[0];
  if (!current) return null;

  return (
    <div className="min-w-0">
      <div className="relative aspect-[3/2] overflow-hidden bg-stone-100">
        <Image
          src={current}
          alt={photoAlt(room, copy, extras, activeIndex)}
          fill
          sizes="(max-width: 639px) 92vw, (max-width: 1279px) 46vw, 31vw"
          className="object-cover"
        />
        <Badge className="absolute left-3 top-3 border-white/60 bg-white/90 text-[#554a3d] shadow-sm backdrop-blur hover:bg-white/90">
          {activeIndex + 1} / {room.gallery.length}
        </Badge>
        <div className="absolute inset-x-0 bottom-0 flex gap-1.5 overflow-x-auto bg-gradient-to-t from-black/45 to-transparent p-2.5 pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {room.gallery.map((photo, index) => (
            <Button
              type="button"
              variant="outline"
              key={`${room.roomNumber}-${photo}`}
              onClick={() => onSelect(index)}
              className={`relative h-9 w-12 shrink-0 overflow-hidden rounded-md border-2 p-0 shadow-sm ${index === activeIndex ? "border-white" : "border-white/55 opacity-85"}`}
              aria-label={`${roomName(room, copy)} ${copy.labels.photo} ${index + 1}`}
            >
              <Image src={photo} alt="" fill sizes="48px" className="object-cover" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function outdoorText(room: AgentRoom, copy: AgentRoomGuideCopy, extras: AgentRoomGuideExtras) {
  const parts = [
    room.hasBalcony ? copy.labels.privateBalcony : null,
    room.hasGardenView ? copy.labels.gardenView : null,
    room.hasUpperFloorView ? copy.labels.upperFloorView : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : extras.overview.none;
}

function kitchenText(room: AgentRoom, copy: AgentRoomGuideCopy, extras: AgentRoomGuideExtras) {
  if (room.hasFullKitchen) return copy.labels.fullKitchen;
  if (room.hasKitchenette) return copy.labels.kitchenette;
  return extras.overview.none;
}

export function AgentRoomsGuide({ language, copy, rooms, commonAmenities, extras, stats, faq }: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeRoom, setActiveRoom] = useState<number>(rooms[0]?.roomNumber ?? 1);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [guestCounts, setGuestCounts] = useState<Record<number, string>>({});
  const [activePhotos, setActivePhotos] = useState<Record<number, number>>({});
  const [copied, setCopied] = useState(false);

  const selected = useMemo(
    () => rooms.filter((room) => selectedRooms.includes(room.roomNumber)),
    [rooms, selectedRooms],
  );

  const heroRooms = [1, 10, 3]
    .map((number) => rooms.find((room) => room.roomNumber === number))
    .filter((room): room is AgentRoom => Boolean(room && room.gallery[0]));

  const statTiles = [
    { value: stats.units, label: extras.stats.units },
    { value: `${stats.rooms} + ${stats.apartments}`, label: fillAgentTemplate(extras.stats.roomsApartments, { rooms: stats.rooms, apartments: stats.apartments }) },
    { value: stats.guests, label: extras.stats.guests },
    { value: stats.stepFree.length, label: extras.stats.stepFree },
    { value: `${stats.minSize}–${stats.maxSize}`, label: extras.stats.size },
  ];

  const totalGuests = selected.reduce((sum, room) => {
    const value = Number(guestCounts[room.roomNumber] || 0);
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

  const allocationText = useMemo(() => {
    if (!selected.length) return "";
    return [
      copy.message.title,
      "",
      ...selected.map(
        (room) => `${roomName(room, copy)}: ${guestCounts[room.roomNumber] || "—"} ${copy.labels.totalGuests}`,
      ),
      "",
      `${copy.message.totalGuests}: ${totalGuests}`,
      copy.message.footer,
    ].join("\n");
  }, [copy, guestCounts, selected, totalGuests]);

  function toggleRoom(room: AgentRoom) {
    setSelectedRooms((current) => {
      if (current.includes(room.roomNumber)) {
        setGuestCounts((counts) => {
          const next = { ...counts };
          delete next[room.roomNumber];
          return next;
        });
        return current.filter((number) => number !== room.roomNumber);
      }
      setGuestCounts((counts) => ({ ...counts, [room.roomNumber]: "1" }));
      return [...current, room.roomNumber].sort((a, b) => a - b);
    });
  }

  function updateGuests(room: AgentRoom, raw: string) {
    if (raw === "") {
      setGuestCounts((current) => ({ ...current, [room.roomNumber]: "" }));
      return;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;
    const clamped = Math.min(room.maxGuests, Math.max(1, Math.trunc(parsed)));
    setGuestCounts((current) => ({ ...current, [room.roomNumber]: String(clamped) }));
  }

  function isCarousel() {
    const carousel = carouselRef.current;
    return Boolean(carousel && carousel.scrollWidth > carousel.clientWidth + 4);
  }

  function showRoom(roomNumber: number) {
    const carousel = carouselRef.current;
    const target = document.getElementById(`room-${roomNumber}`);
    if (!carousel || !target) return;
    carousel.scrollTo({ left: target.offsetLeft - carousel.offsetLeft - 16, behavior: "smooth" });
    setActiveRoom(roomNumber);
  }

  function onCarouselScroll() {
    const carousel = carouselRef.current;
    if (!carousel || !isCarousel()) return;
    const cards = Array.from(carousel.querySelectorAll<HTMLElement>("[data-room]"));
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    let best = cards[0];
    for (const card of cards) {
      if (Math.abs(card.offsetLeft - carousel.offsetLeft + card.offsetWidth / 2 - center) < Math.abs(best.offsetLeft - carousel.offsetLeft + best.offsetWidth / 2 - center)) best = card;
    }
    if (best) setActiveRoom(Number(best.dataset.room));
  }

  function goToRoom(event: React.MouseEvent<HTMLAnchorElement>, roomNumber: number) {
    const target = document.getElementById(`room-${roomNumber}`);
    if (!target) return;
    event.preventDefault();
    if (isCarousel()) showRoom(roomNumber);
    const anchor = isCarousel() && carouselRef.current ? carouselRef.current : target;
    window.scrollTo({ top: anchor.getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" });
    window.history.replaceState(null, "", `#room-${roomNumber}`);
  }


  async function copyAllocation() {
    if (!allocationText) return;
    try {
      await navigator.clipboard.writeText(allocationText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function sendEmail() {
    if (!allocationText) return;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(copy.message.emailSubject)}&body=${encodeURIComponent(allocationText)}`;
  }

  function sendWhatsApp() {
    if (!allocationText) return;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(allocationText)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main className={`min-h-screen bg-[#f7f4ef] text-[#332d27] ${selected.length ? "pb-36 lg:pb-24" : ""}`}>
      <section className="border-b border-[#ded5c9] bg-[#eee7de]">
        <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 md:py-11 lg:px-8">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#796b5b]">{copy.hero.kicker}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#332d27] md:text-[42px] md:leading-tight">{copy.hero.title}</h1>
              <p className="mt-3 text-sm leading-6 text-[#665d53] md:text-base">{copy.hero.description}</p>
            </div>
            <div className="space-y-3 lg:text-right">
              <div>
                <Badge variant="outline" className="gap-2 border-[#c9bcad] bg-transparent px-3 py-1.5 text-[#65594c]">
                  <Users className="h-3.5 w-3.5" />
                  {copy.hero.noPrices}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 border-t border-[#d8cec1] pt-6 lg:grid-cols-[1.2fr_.8fr] lg:gap-10">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#40372f]">
                <CircleCheck className="h-4 w-4 text-[#756553]" />
                {copy.labels.includedEveryRoom}
              </div>
              <p className="mt-1 text-xs text-[#756b61]">{copy.labels.includedEveryRoomText}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {commonAmenities.map((amenity) => (
                  <span key={amenity.key} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5d5348]">
                    <FeatureIcon type={amenity.key} className="h-3.5 w-3.5 text-[#847563]" />
                    {copy.amenities[amenity.key] || amenity.label}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-[#40372f]">{copy.how.title}</p>
              <ol className="mt-3 grid gap-2.5">
                {copy.how.steps.map((step, index) => (
                  <li key={step} className="flex items-start gap-2.5 text-xs leading-5 text-[#665d53]">
                    <span className="font-bold text-[#6e5f50]">0{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <ChiosCollectionImageGallery
        kind="rooms"
        language={language}
        priorityFirst
        items={heroRooms.map((room) => ({
          image: room.gallery[0],
          imageAlt: photoAlt(room, copy, extras, 0),
          title: `${roomName(room, copy)} · ${roomCategory(room, copy)}`,
          href: `#room-${room.roomNumber}`,
        }))}
      />

      <section className="mx-auto max-w-[1180px] px-4 pt-6 md:px-6" aria-label={extras.overview.title}>
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {statTiles.map((tile) => (
            <div key={tile.label} className="flex flex-col rounded-2xl border border-[#e2d9ce] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(77,64,49,0.05)]">
              <dt className="order-2 text-[11px] font-semibold leading-4 text-[#7a6c5d]">{tile.label}</dt>
              <dd className="text-xl font-bold text-[#3d342c] md:text-2xl">{tile.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto hidden max-w-[1500px] px-4 pt-8 md:block md:px-6 lg:px-8" aria-labelledby="agent-overview-title">
        <h2 id="agent-overview-title" className="text-lg font-bold text-[#3d352e] md:text-xl">{extras.overview.title}</h2>
        <p className="mt-1 text-xs leading-5 text-[#7a7066] md:text-sm">{extras.overview.intro}</p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-[#ded5c9] bg-white shadow-[0_8px_26px_rgba(77,64,49,0.06)]">
          <table className="w-full min-w-[860px] border-collapse text-left text-xs text-[#4f453b]">
            <thead className="bg-[#f2ece4] text-[11px] uppercase tracking-[0.08em] text-[#6f6152]">
              <tr>
                <th scope="col" className="px-4 py-3 font-bold">{extras.overview.unit}</th>
                <th scope="col" className="px-3 py-3 font-bold">{extras.overview.type}</th>
                <th scope="col" className="px-3 py-3 font-bold">{extras.overview.size}</th>
                <th scope="col" className="px-3 py-3 font-bold">{extras.overview.guests}</th>
                <th scope="col" className="px-3 py-3 font-bold">{extras.overview.beds}</th>
                <th scope="col" className="px-3 py-3 font-bold">{extras.overview.floor}</th>
                <th scope="col" className="px-3 py-3 font-bold">{extras.overview.kitchen}</th>
                <th scope="col" className="px-3 py-3 font-bold">{extras.overview.outdoor}</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">{extras.overview.view}</span></th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.roomNumber} className="border-t border-[#eee7df] align-middle">
                  <th scope="row" className="px-4 py-2.5">
                    <a href={`#room-${room.roomNumber}`} onClick={(event) => goToRoom(event, room.roomNumber)} className="flex items-center gap-3 font-bold text-[#3d342c] hover:text-[#6e5f50]">
                      <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                        {room.gallery[0] ? <Image src={room.gallery[0]} alt="" fill sizes="56px" className="object-cover" /> : null}
                      </span>
                      {roomName(room, copy)}
                    </a>
                  </th>
                  <td className="px-3 py-2.5">{roomCategory(room, copy)}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 font-semibold">{room.sizeM2} m²</td>
                  <td className="whitespace-nowrap px-3 py-2.5 font-semibold">
                    {room.standardCapacity < room.maxGuests ? `${room.standardCapacity}–${room.maxGuests}` : room.maxGuests}
                  </td>
                  <td className="px-3 py-2.5">{bedsText(room, copy)}</td>
                  <td className="px-3 py-2.5">{floorText(room, copy)} · {room.noStairs ? copy.labels.noStairs : copy.labels.stairsRequired}</td>
                  <td className="px-3 py-2.5">{kitchenText(room, copy, extras)}</td>
                  <td className="px-3 py-2.5">{outdoorText(room, copy, extras)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <a href={`#room-${room.roomNumber}`} onClick={(event) => goToRoom(event, room.roomNumber)} className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-[#d4c8ba] px-3 py-1.5 text-[11px] font-bold text-[#5d5144] hover:border-[#8d7965]">
                      {extras.overview.view}
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-8 md:px-6 md:py-10 lg:px-8" aria-labelledby="agent-rooms-title">
        <h2 id="agent-rooms-title" className="text-lg font-bold text-[#3d352e] md:text-xl">{copy.labels.roomsTitle}</h2>

        <p className="mt-0.5 text-xs text-[#7a7066] sm:hidden">{copy.labels.swipe}</p>
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden">
          {rooms.map((room) => (
            <button
              type="button"
              key={room.roomNumber}
              onClick={() => showRoom(room.roomNumber)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${activeRoom === room.roomNumber ? "border-[#6e5f50] bg-[#6e5f50] text-white" : selectedRooms.includes(room.roomNumber) ? "border-[#8b765f] bg-[#f2ece4] text-[#4f4336]" : "border-[#d4c8ba] bg-white text-[#5d5144]"}`}
            >
              {roomName(room, copy)}
            </button>
          ))}
        </div>
        <div
          ref={carouselRef}
          onScroll={onCarouselScroll}
          className="-mx-4 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:mt-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-3 [&::-webkit-scrollbar]:hidden"
        >
          {rooms.map((room) => {
            const isSelected = selectedRooms.includes(room.roomNumber);
            const assigned = Number(guestCounts[room.roomNumber] || 0);
            const needsExtraBed = room.extraBedAvailable && assigned > room.standardCapacity;
            const capacityText = room.standardCapacity < room.maxGuests
              ? format(copy.labels.standardMax, { standard: room.standardCapacity, max: room.maxGuests })
              : format(copy.labels.upToGuests, { count: room.maxGuests });
            const chips = [
              { icon: "users", label: capacityText },
              { icon: "size", label: `${room.sizeM2} m²` },
              { icon: room.noStairs ? "floor" : "stairs", label: `${floorText(room, copy)} · ${room.noStairs ? copy.labels.noStairs : copy.labels.stairsRequired}` },
              { icon: "bed", label: spacesText(room.spaceLayout, copy) },
              room.hasFullKitchen ? { icon: "kitchen", label: copy.labels.fullKitchen } : null,
              room.hasKitchenette ? { icon: "kitchen", label: copy.labels.kitchenette } : null,
              room.hasBalcony ? { icon: "balcony", label: copy.labels.privateBalcony } : null,
              room.hasUpperFloorView ? { icon: "view", label: copy.labels.upperFloorView } : null,
              room.hasGardenView ? { icon: "view", label: copy.labels.gardenView } : null,
            ].filter(Boolean) as { icon: string; label: string }[];
            const note = room.roomNumber === 1 ? copy.labels.roomOneNote : room.roomNumber === 10 ? copy.labels.roomTenNote : null;

            return (
              <Card
                key={room.roomNumber}
                id={`room-${room.roomNumber}`}
                data-room={room.roomNumber}
                className={`flex w-[86vw] max-w-[380px] shrink-0 snap-center self-start sm:self-auto scroll-mt-24 flex-col overflow-hidden rounded-[22px] sm:w-auto sm:max-w-none border bg-white p-0 transition ${isSelected ? "border-[#8b765f] shadow-[0_12px_36px_rgba(89,72,54,0.14)] ring-1 ring-[#8b765f]/25" : "border-[#ded5c9] shadow-[0_8px_26px_rgba(77,64,49,0.06)]"}`}
              >
                <PhotoGallery
                  room={room}
                  copy={copy}
                  extras={extras}
                  activeIndex={activePhotos[room.roomNumber] || 0}
                  onSelect={(index) => setActivePhotos((current) => ({ ...current, [room.roomNumber]: index }))}
                />

                <div className="flex flex-1 flex-col p-4 md:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold tracking-tight text-[#342d27]">{roomName(room, copy)}</h3>
                      <p className="text-xs font-medium text-[#756858]">{roomCategory(room, copy)}</p>
                    </div>
                    {room.isEconomy ? <Badge variant="outline" className="shrink-0 border-[#ddd2c4] px-2 py-0.5 text-[10px] text-[#756858]">{copy.labels.economy}</Badge> : null}
                  </div>

                  <p className="mt-3 flex items-start gap-2 text-sm font-semibold leading-5 text-[#3f3730]">
                    <BedDouble className="mt-0.5 h-4 w-4 shrink-0 text-[#766553]" aria-hidden="true" />
                    <span><span className="sr-only">{copy.labels.beds}: </span>{bedsText(room, copy)}</span>
                  </p>
                  {note ? <p className="mt-1 pl-6 text-[11px] leading-4 text-[#7a6f64]">{note}</p> : null}

                  <ul className="mb-4 mt-3 flex flex-wrap gap-1.5">
                    {chips.map((chip) => (
                      <li key={chip.label} className="inline-flex items-center gap-1.5 rounded-full bg-[#f4efe8] px-2.5 py-1 text-[11px] font-semibold text-[#5c5146]">
                        <FeatureIcon type={chip.icon} className="h-3.5 w-3.5 shrink-0 text-[#847563]" />
                        {chip.label}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center gap-2 border-t border-[#eee7df] pt-4">
                    <Button
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => toggleRoom(room)}
                      aria-pressed={isSelected}
                      className={`h-11 min-w-0 flex-1 rounded-xl px-3 text-sm font-bold ${isSelected ? "bg-[#6e5f50] text-white hover:bg-[#5d5043]" : "border-[#cfc3b5] bg-transparent text-[#554a3f] hover:border-[#9c8974] hover:bg-[#fbf9f6]"}`}
                    >
                      {isSelected ? <Check className="h-4 w-4 shrink-0" /> : <CircleCheck className="h-4 w-4 shrink-0" />}
                      <span className="truncate">{isSelected ? copy.labels.roomSelected : copy.labels.selectRoom}</span>
                    </Button>
                    {isSelected ? (
                      <div className="flex h-11 shrink-0 items-center rounded-xl border border-[#cfc4b7] bg-white" role="group" aria-label={copy.labels.guestsStaying}>
                        <button type="button" onClick={() => updateGuests(room, String(Math.max(1, (assigned || 1) - 1)))} className="h-full w-8 text-lg font-bold text-[#5d5144] disabled:opacity-30" disabled={assigned <= 1} aria-label="−">−</button>
                        <span className="min-w-[2.25rem] whitespace-nowrap text-center text-sm font-bold text-[#40362e]">
                          {assigned || 1}<span className="text-[11px] font-medium text-[#8a7e72]">/{room.maxGuests}</span>
                        </span>
                        <button type="button" onClick={() => updateGuests(room, String(Math.min(room.maxGuests, (assigned || 1) + 1)))} className="h-full w-8 text-lg font-bold text-[#5d5144] disabled:opacity-30" disabled={assigned >= room.maxGuests} aria-label="+">+</button>
                      </div>
                    ) : null}
                  </div>
                  {needsExtraBed ? <p className="mt-2 border-l-2 border-[#cdb58f] pl-3 text-[11px] font-semibold leading-4 text-[#69563d]">{copy.labels.extraBedRequired}</p> : null}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 pb-10 md:px-6" aria-labelledby="agent-contact-title">
        <div className="flex flex-col gap-4 rounded-[24px] bg-[#5f5244] px-6 py-6 text-white shadow-[0_14px_40px_rgba(67,54,42,0.18)] md:flex-row md:items-center md:justify-between md:px-8">
          <div className="max-w-2xl">
            <h2 id="agent-contact-title" className="text-lg font-bold md:text-xl">{extras.contact.title}</h2>
            <p className="mt-1 text-sm leading-6 text-white/85">{extras.contact.text}</p>
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-2">
            <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(copy.message.emailSubject)}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-[#4f4336] hover:bg-[#f4efe8]">
              <Mail className="h-4 w-4" aria-hidden="true" /> {copy.labels.sendEmail}
            </a>
            <a href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/40 px-4 text-sm font-bold text-white hover:bg-white/10">
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> {copy.labels.sendWhatsApp}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 pb-14 md:px-6" aria-labelledby="agent-faq-title">
        <h2 id="agent-faq-title" className="text-lg font-bold text-[#3d352e] md:text-xl">{extras.faqTitle}</h2>
        <div className="mt-4 divide-y divide-[#e6ddd2] rounded-2xl border border-[#ded5c9] bg-white">
          {faq.map((item) => (
            <details key={item.question} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-[#3f3730] [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronRight className="h-4 w-4 shrink-0 text-[#857463] transition-transform group-open:rotate-90" aria-hidden="true" />
              </summary>
              <p className="mt-2 text-sm leading-6 text-[#665d53]">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#d7ccbf] bg-[#f7f2ec]/95 shadow-[0_-8px_26px_rgba(67,54,42,0.11)] backdrop-blur-lg transition ${selected.length ? "translate-y-0" : "pointer-events-none invisible translate-y-full"}`}>
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#433930]">{selected.length} {copy.labels.selectedRooms} · {totalGuests} {copy.labels.totalGuests}</p>
            <p className="mt-0.5 truncate text-xs text-[#766b60]">{selected.map((room) => `${roomName(room, copy)}: ${guestCounts[room.roomNumber] || "—"}`).join(" · ")}</p>
          </div>
          <div className="grid shrink-0 grid-cols-3 gap-2">
            <Button type="button" variant="outline" onClick={sendEmail} className="min-h-11 rounded-xl border-[#c7b9aa] bg-white px-3 text-xs font-bold text-[#51463b] shadow-sm hover:border-[#8d7965] hover:bg-white">
              <Mail className="h-4 w-4" /> {copy.labels.sendEmail}
            </Button>
            <Button type="button" onClick={sendWhatsApp} className="min-h-11 rounded-xl bg-[#665849] px-3 text-xs font-bold text-white shadow-sm hover:bg-[#574a3d]">
              <MessageCircle className="h-4 w-4" /> {copy.labels.sendWhatsApp}
            </Button>
            <Button type="button" variant="outline" onClick={copyAllocation} className="min-h-11 rounded-xl border-[#c7b9aa] bg-white px-3 text-xs font-bold text-[#51463b] shadow-sm hover:border-[#8d7965] hover:bg-white">
              <Copy className="h-4 w-4" /> {copied ? copy.labels.copied : copy.labels.copyAllocation}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
