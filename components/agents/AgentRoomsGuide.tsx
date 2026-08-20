"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  Bath,
  BedDouble,
  Building2,
  Check,
  ChevronLeft,
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
  agentLanguageNames,
  agentRoomGuidePaths,
  type AgentRoomGuideCopy,
} from "@/content/agent-room-guide";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
  language: LanguageCode;
  copy: AgentRoomGuideCopy;
  rooms: AgentRoom[];
  commonAmenities: CommonAmenity[];
};

const CONTACT_EMAIL = "chioshotel@gmail.com";
const WHATSAPP_PHONE = "306944474226";
const LANGUAGES: LanguageCode[] = ["en", "el", "fr", "de", "it", "es", "tr"];

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

function PhotoGallery({
  room,
  copy,
  activeIndex,
  onSelect,
}: {
  room: AgentRoom;
  copy: AgentRoomGuideCopy;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const current = room.gallery[activeIndex] || room.gallery[0];
  if (!current) return null;

  return (
    <div className="min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 md:h-full md:min-h-[430px] md:aspect-auto">
        <Image
          src={current}
          alt={`${roomName(room, copy)} ${copy.labels.photo} ${activeIndex + 1}`}
          fill
          sizes="(max-width: 767px) 88vw, 36vw"
          className="object-cover"
          priority={room.roomNumber === 1}
        />
        <Badge className="absolute left-4 top-4 border-white/60 bg-white/90 text-[#554a3d] shadow-sm backdrop-blur hover:bg-white/90">
          {activeIndex + 1} / {room.gallery.length}
        </Badge>
        <div className="absolute inset-x-0 bottom-0 flex gap-2 overflow-x-auto bg-gradient-to-t from-black/45 to-transparent p-3 pt-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {room.gallery.map((photo, index) => (
            <Button
              type="button"
              variant="outline"
              key={`${room.roomNumber}-${photo}`}
              onClick={() => onSelect(index)}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 p-0 shadow-sm ${index === activeIndex ? "border-white" : "border-white/55 opacity-85"}`}
              aria-label={`${roomName(room, copy)} ${copy.labels.photo} ${index + 1}`}
            >
              <Image src={photo} alt="" fill sizes="80px" className="object-cover" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AgentRoomsGuide({ language, copy, rooms, commonAmenities }: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [guestCounts, setGuestCounts] = useState<Record<number, string>>({});
  const [activePhotos, setActivePhotos] = useState<Record<number, number>>({});
  const [copied, setCopied] = useState(false);

  const selected = useMemo(
    () => rooms.filter((room) => selectedRooms.includes(room.roomNumber)),
    [rooms, selectedRooms],
  );

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

  function scrollMobile(direction: -1 | 1) {
    const element = carouselRef.current;
    if (!element) return;
    element.scrollBy({ left: direction * element.clientWidth * 0.92, behavior: "smooth" });
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
    <main className="min-h-screen bg-[#f7f4ef] text-[#332d27]">
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
              <div className="flex flex-wrap gap-1.5 lg:justify-end" aria-label={copy.labels.language}>
                {LANGUAGES.map((code) => (
                  <a key={code} href={agentRoomGuidePaths[code]} hrefLang={code}>
                    <Badge
                      variant={code === language ? "default" : "outline"}
                      className={code === language
                        ? "border-[#6e5f50] bg-[#6e5f50] px-2.5 py-1.5 text-[11px] text-white hover:bg-[#6e5f50]"
                        : "border-[#cfc3b5] bg-transparent px-2.5 py-1.5 text-[11px] text-[#65594c] hover:border-[#9c8974]"}
                    >
                      {agentLanguageNames[code]}
                    </Badge>
                  </a>
                ))}
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

      <section className="mx-auto max-w-[1500px] py-6 md:px-6 md:py-9 lg:px-8">
        <div className="mb-5 flex items-center justify-between px-4 md:px-0">
          <div>
            <h2 className="text-lg font-bold text-[#3d352e]">{copy.labels.roomsTitle}</h2>
            <p className="mt-0.5 text-xs text-[#7a7066] md:hidden">{copy.labels.swipe}</p>
          </div>
          <div className="flex gap-2 md:hidden">
            <Button type="button" variant="ghost" size="icon" onClick={() => scrollMobile(-1)} className="rounded-full text-[#5d5144]" aria-label={copy.labels.previousRoom}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => scrollMobile(1)} className="rounded-full text-[#5d5144]" aria-label={copy.labels.nextRoom}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div ref={carouselRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:block md:space-y-8 md:overflow-visible md:px-0">
          {rooms.map((room) => {
            const isSelected = selectedRooms.includes(room.roomNumber);
            const assigned = Number(guestCounts[room.roomNumber] || 0);
            const needsExtraBed = room.extraBedAvailable && assigned > room.standardCapacity;
            const capacityText = room.standardCapacity < room.maxGuests
              ? format(copy.labels.standardMax, { standard: room.standardCapacity, max: room.maxGuests })
              : format(copy.labels.upToGuests, { count: room.maxGuests });
            const details = [
              { icon: "users", label: capacityText },
              { icon: "floor", label: floorText(room, copy) },
              { icon: "stairs", label: room.noStairs ? copy.labels.noStairs : copy.labels.stairsRequired },
              { icon: "size", label: `${room.sizeM2} m²` },
              { icon: "bed", label: spacesText(room.spaceLayout, copy) },
            ];
            const roomAmenities = [
              room.hasFullKitchen ? { icon: "kitchen", label: copy.labels.fullKitchen } : null,
              room.hasKitchenette ? { icon: "kitchen", label: copy.labels.kitchenette } : null,
              room.hasBalcony ? { icon: "balcony", label: copy.labels.privateBalcony } : null,
              room.hasUpperFloorView ? { icon: "view", label: copy.labels.upperFloorView } : null,
              room.hasGardenView ? { icon: "view", label: copy.labels.gardenView } : null,
              room.extraBedAvailable ? { icon: "bed", label: copy.labels.extraBedAvailable } : null,
            ].filter(Boolean) as { icon: string; label: string }[];

            return (
              <Card
                key={room.roomNumber}
                className={`min-w-[88vw] snap-center overflow-hidden rounded-[24px] border bg-white p-0 transition md:min-w-0 md:grid md:grid-cols-[minmax(300px,38%)_1fr_230px] ${isSelected ? "border-[#8b765f] shadow-[0_12px_36px_rgba(89,72,54,0.12)] ring-1 ring-[#8b765f]/20" : "border-[#ded5c9] shadow-[0_8px_26px_rgba(77,64,49,0.06)]"}`}
              >
                <PhotoGallery
                  room={room}
                  copy={copy}
                  activeIndex={activePhotos[room.roomNumber] || 0}
                  onSelect={(index) => setActivePhotos((current) => ({ ...current, [room.roomNumber]: index }))}
                />

                <div className="px-5 py-6 md:px-7 md:py-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-[#ece4da] px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-[#68594a] hover:bg-[#ece4da]">{copy.labels.room} {room.roomNumber}</Badge>
                    {room.isEconomy ? <Badge variant="outline" className="border-[#ddd2c4] px-2.5 py-1 text-[11px] text-[#756858]">{copy.labels.economy}</Badge> : null}
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#342d27]">{roomName(room, copy)}</h3>
                  <p className="mt-1 text-sm font-medium text-[#756858]">{roomCategory(room, copy)}</p>

                  <div className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
                    {details.map((detail) => (
                      <div key={`${detail.icon}-${detail.label}`} className="flex items-center gap-2 text-xs font-semibold leading-5 text-[#5c5146]">
                        <FeatureIcon type={detail.icon} className="h-4 w-4 shrink-0 text-[#766553]" />
                        <span>{detail.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-[#eee7df] pt-5">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.11em] text-[#7a6c5d]"><BedDouble className="h-4 w-4" /> {copy.labels.beds}</p>
                    <p className="mt-1.5 text-[15px] font-semibold leading-6 text-[#3f3730]">{bedsText(room, copy)}</p>
                    {room.roomNumber === 1 ? <p className="mt-1 text-xs leading-5 text-[#766b60]">{copy.labels.roomOneNote}</p> : null}
                    {room.roomNumber === 10 ? <p className="mt-1 text-xs leading-5 text-[#766b60]">{copy.labels.roomTenNote}</p> : null}
                  </div>

                  <div className="mt-5 grid gap-5 border-t border-[#eee7df] pt-5 lg:grid-cols-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.11em] text-[#7a6c5d]">{copy.labels.specificFeatures}</p>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-2">
                        {roomAmenities.length ? roomAmenities.map((item) => (
                          <span key={item.label} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5f5448]">
                            <FeatureIcon type={item.icon} className="h-3.5 w-3.5 text-[#847563]" />{item.label}
                          </span>
                        )) : <span className="text-xs text-[#7a7066]">{copy.labels.standardOnly}</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.11em] text-[#7a6c5d]">{copy.labels.standardAmenities}</p>
                      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
                        {commonAmenities.map((amenity) => (
                          <div key={`${room.roomNumber}-${amenity.key}`} className="flex items-center gap-1.5 text-[11px] font-medium text-[#6a6056]">
                            <FeatureIcon type={amenity.key} className="h-3.5 w-3.5 text-[#847563]" />
                            {copy.amenities[amenity.key] || amenity.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <aside className={`border-t border-[#e8e0d7] px-5 py-5 transition-colors md:border-l md:border-t-0 md:px-5 md:py-7 ${isSelected ? "bg-[#f2ece4]" : "bg-[#fbf9f6]"}`}>
                  <div className="md:sticky md:top-24">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#746657]">{copy.labels.allocation}</p>
                    <Button
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => toggleRoom(room)}
                      className={`mt-4 h-12 w-full rounded-xl text-sm font-bold ${isSelected ? "bg-[#6e5f50] text-white hover:bg-[#5d5043]" : "border-[#cfc3b5] bg-transparent text-[#554a3f] hover:border-[#9c8974] hover:bg-white"}`}
                    >
                      {isSelected ? <Check className="h-4 w-4" /> : <CircleCheck className="h-4 w-4" />}
                      {isSelected ? copy.labels.roomSelected : copy.labels.selectRoom}
                    </Button>

                    <label className="mt-5 block">
                      <span className="mb-2 block text-xs font-semibold text-[#6c6054]">{copy.labels.guestsStaying}</span>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={room.maxGuests}
                          disabled={!isSelected}
                          value={isSelected ? guestCounts[room.roomNumber] ?? "" : ""}
                          onChange={(event) => updateGuests(room, event.target.value)}
                          placeholder="—"
                          className="h-12 w-20 rounded-xl border-[#cfc4b7] bg-white text-center text-lg font-bold text-[#40362e] focus-visible:ring-[#796754]/30"
                        />
                        <span className="text-xs leading-5 text-[#756a5f]">{copy.labels.max}<br/><strong className="text-[#4d4339]">{room.maxGuests}</strong></span>
                      </div>
                    </label>

                    {needsExtraBed ? <p className="mt-4 border-l-2 border-[#cdb58f] pl-3 text-xs font-semibold leading-5 text-[#69563d]">{copy.labels.extraBedRequired}</p> : null}
                  </div>
                </aside>
              </Card>
            );
          })}
        </div>
      </section>

      <div className={`sticky bottom-0 z-30 border-t border-[#d7ccbf] bg-[#f7f2ec]/95 shadow-[0_-8px_26px_rgba(67,54,42,0.11)] backdrop-blur-lg transition ${selected.length ? "translate-y-0" : "translate-y-full"}`}>
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
