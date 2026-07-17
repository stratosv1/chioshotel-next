"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type RoomDetails = {
  name: string;
  category: string;
  badges: string[];
  originalPrice: string;
  directPrice: string;
  saving: string;
  images: string[];
  selectButton: HTMLButtonElement | null;
};

const DETAILS_LABELS = new Set([
  "Προβολή λεπτομερειών",
  "View details",
  "Details ansehen",
  "Voir les détails",
  "Vedi dettagli",
  "Ver detalles",
  "Detayları gör",
]);

// Exact photo sets copied from content/room-details.ts.
const ROOM_GALLERIES: Record<number, string[]> = {
  1: [
    "/images/rooms/DSC07776-2-e1675109942622.webp",
    "/images/rooms/DSC07769-1.webp",
    "/images/rooms/----1-1.webp",
    "/images/rooms/voulamandis-house-bathrooms-1.webp",
  ],
  2: [
    "/images/rooms/DSC07803-1.webp",
    "/images/rooms/DSC07839.webp",
    "/images/rooms/DSC07832.webp",
    "/images/rooms/received_1385287484893642_1500478431120_1200x800_3240x2160-1.webp",
  ],
  3: [
    "/images/rooms/DSC07867-1.webp",
    "/images/rooms/DSC07860-1.webp",
    "/images/rooms/DSC07849-1.webp",
    "/images/rooms/DSC07891-1.webp",
  ],
  4: [
    "/images/rooms/received_1748354861920234.webp",
    "/images/rooms/received_1748358935253160.webp",
    "/images/rooms/received_1748356725253381.webp",
    "/images/rooms/received_1748356718586715.webp",
  ],
  5: [
    "/images/rooms/voulamandis-house-rooms.webp",
    "/images/rooms/chios-hotels-triple-rooms_1646x1080.webp",
    "/images/rooms/voulamandis-house-double-room-bathroom_1620x1080.webp",
    "/images/rooms/hotels-chios-voulamandis_1620x1080.webp",
  ],
  6: [
    "/images/rooms/received_1753964631359257.webp",
    "/images/rooms/received_1753964581359262.webp",
    "/images/rooms/received_1753968691358851.webp",
    "/images/rooms/received_1753969201358800.webp",
  ],
  7: [
    "/images/rooms/double-triple-room.jpg",
    "/images/rooms/view-double-room-chios-hotels.webp",
    "/images/rooms/double-room-bathroom.webp",
    "/images/rooms/voulamandis-stone-bathroom.webp",
  ],
  8: [
    "/images/rooms/chios-apartments-voulamandis.webp",
    "/images/rooms/chios-hotels-family-apartments.webp",
    "/images/rooms/family-room.webp",
    "/images/rooms/voulamandis-apartment-bathroom..webp",
  ],
  9: [
    "/images/rooms/chios-apartments-voulamandis.webp",
    "/images/rooms/chios-hotels-family-apartments.webp",
    "/images/rooms/family-room.webp",
    "/images/rooms/voulamandis-apartment-bathroom..webp",
  ],
  10: [
    "/images/rooms/DSC07899.webp",
    "/images/rooms/DSC07909.webp",
    "/images/rooms/DSC07940.webp",
    "/images/rooms/DSC07943.webp",
  ],
};

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function roomNumber(value: string) {
  return Number(value.match(/(?:Room|Δωμάτιο|Zimmer|Chambre|Camera|Habitación|Oda|Apartment)\s*(10|[1-9])/i)?.[1] || 0);
}

function readRoomCard(button: HTMLButtonElement): RoomDetails | null {
  const article = button.closest("article");
  if (!article) return null;

  const name = article.querySelector("h2")?.textContent?.trim() || "Room";
  const paragraphs = Array.from(article.querySelectorAll("p"));
  const category = paragraphs.find((node) => !node.classList.contains("line-through"))?.textContent?.trim() || "";
  const originalPrice = paragraphs.find((node) => node.classList.contains("line-through"))?.textContent?.trim() || "";
  const directPrice = Array.from(article.querySelectorAll<HTMLElement>("p, strong"))
    .map((node) => node.textContent?.trim() || "")
    .find((text) => /€/.test(text) && text !== originalPrice) || "";
  const badges = unique(Array.from(article.querySelectorAll("span")).map((node) => node.textContent?.trim() || ""));
  const number = roomNumber(name);
  const images = ROOM_GALLERIES[number] || [];
  const buttons = Array.from(article.querySelectorAll<HTMLButtonElement>("button"));
  const selectButton = buttons.find((item) => !DETAILS_LABELS.has((item.textContent || "").trim())) || null;
  const savingValue = originalPrice && directPrice
    ? (() => {
        const original = Number(originalPrice.replace(/[^0-9,.]/g, "").replace(",", "."));
        const direct = Number(directPrice.replace(/[^0-9,.]/g, "").replace(",", "."));
        return Number.isFinite(original) && Number.isFinite(direct) && original > direct ? `${Math.round(original - direct)} €` : "";
      })()
    : "";

  return { name, category, badges, originalPrice, directPrice, saving: savingValue, images, selectButton };
}

export function AiRoomDetailsEnhancer() {
  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [photo, setPhoto] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest<HTMLButtonElement>("button");
      if (!button || !DETAILS_LABELS.has((button.textContent || "").trim())) return;

      const details = readRoomCard(button);
      if (!details) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setPhoto(0);
      setRoom(details);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    if (!room) return;
    const scrollY = window.scrollY;
    const previous = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.documentElement.style.overflow,
    };

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.position = previous.position;
      document.body.style.top = previous.top;
      document.body.style.left = previous.left;
      document.body.style.right = previous.right;
      document.body.style.width = previous.width;
      document.documentElement.style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [room]);

  const selectedImage = useMemo(() => room?.images[photo] || room?.images[0] || "", [room, photo]);

  if (!mounted || !room) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) setRoom(null);
      }}
      role="dialog"
      aria-modal="true"
      aria-label={room.name}
    >
      <section
        className="flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]"
        style={{ overscrollBehavior: "contain" }}
        onWheel={(event) => event.stopPropagation()}
        onTouchMove={(event) => event.stopPropagation()}
      >
        <div className="relative shrink-0 bg-stone-100">
          <div className="relative h-[34dvh] min-h-[230px] max-h-[320px] w-full">
            <img src={selectedImage} alt={`${room.name} photo ${photo + 1}`} className="h-full w-full object-cover" />
          </div>

          <button
            type="button"
            onClick={() => setRoom(null)}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl shadow-lg"
            aria-label="Close"
          >
            ×
          </button>

          {room.images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => setPhoto((value) => (value - 1 + room.images.length) % room.images.length)}
                className="absolute left-3 top-[42%] flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-2xl shadow-lg"
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setPhoto((value) => (value + 1) % room.images.length)}
                className="absolute right-3 top-[42%] flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-2xl shadow-lg"
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          ) : null}

          <div className="absolute bottom-[76px] right-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold shadow">
            {photo + 1}/{room.images.length}
          </div>

          <div className="flex gap-2 overflow-x-auto border-t border-white/30 bg-black/35 p-2.5 backdrop-blur-sm [scrollbar-width:none]">
            {room.images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setPhoto(index)}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white shadow-sm ${index === photo ? "border-white ring-2 ring-[#ff385c]" : "border-white/70"}`}
                aria-label={`Photo ${index + 1}`}
              >
                <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-2xl font-black text-stone-950">{room.name}</h2>
              <p className="mt-1 text-sm text-stone-500">{room.category}</p>
            </div>
            <div className="shrink-0 text-right">
              {room.originalPrice ? <p className="text-xs text-stone-400 line-through">{room.originalPrice}</p> : null}
              <p className="text-2xl font-black text-[#43551b]">{room.directPrice}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {room.badges.slice(0, 5).map((badge) => (
              <span key={badge} className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-700">
                {badge}
              </span>
            ))}
          </div>

          {room.saving ? (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#f3f6e8] px-4 py-3 text-sm text-[#63752d]">
              <span>Εξοικονόμηση</span>
              <strong>{room.saving}</strong>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => {
              room.selectButton?.click();
              setRoom(null);
            }}
            className="mt-4 w-full rounded-2xl bg-[#ff385c] px-5 py-3.5 text-base font-bold text-white shadow-sm"
          >
            Επιλογή
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
