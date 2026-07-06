export type DealRoom = {
  id?: number;
  roomId: number;
  unitId: number;
  displayName?: string;
  type?: string;
  location?: string;
  maxGuests?: number;
  images?: string[];
};

export type DealDay = {
  checkin: string;
  results?: Record<string, { available?: boolean; totalPrice?: number | string }>;
};

export type DealsResponse = {
  rooms?: DealRoom[];
  days?: DealDay[];
  updatedAt?: string;
  updated_at?: string;
};

export type RoomMeta = Required<Pick<DealRoom, "id" | "roomId" | "unitId" | "displayName" | "type" | "location" | "maxGuests" | "images">> & {
  primaryBadge: string;
  featureBadges: string[];
};

const DIRECT_DISCOUNT_PERCENT = 15;
const CLIMATE_FEE_PER_NIGHT = 2;

const ROOM_BASE = [
  {
    id: 1,
    roomId: 267788,
    unitId: 1,
    displayName: "Room 1",
    type: "Upper Floor Double / Triple",
    location: "Upper floor",
    maxGuests: 4,
    image: "/images/rooms/DSC07776-2-e1675109942622.webp",
    primaryBadge: "Upper floor",
    featureBadges: ["Upper floor", "Up to 4 guests", "Stairs"],
  },
  {
    id: 2,
    roomId: 268803,
    unitId: 1,
    displayName: "Room 2",
    type: "Economy Double",
    location: "Upper floor",
    maxGuests: 2,
    image: "/images/rooms/DSC07803-1.webp",
    primaryBadge: "Economy",
    featureBadges: ["Economy", "Upper floor", "2 guests"],
  },
  {
    id: 3,
    roomId: 267788,
    unitId: 2,
    displayName: "Room 3",
    type: "Upper Floor Double / Triple",
    location: "Upper floor",
    maxGuests: 3,
    image: "/images/rooms/DSC07867-1.webp",
    primaryBadge: "Kitchenette",
    featureBadges: ["Upper floor", "Kitchenette", "Up to 3 guests"],
  },
  {
    id: 4,
    roomId: 267788,
    unitId: 3,
    displayName: "Room 4",
    type: "Upper Floor Double / Triple",
    location: "Upper floor",
    maxGuests: 3,
    image: "/images/rooms/received_1748354861920234.webp",
    primaryBadge: "Kitchenette",
    featureBadges: ["Upper floor", "Kitchenette", "Up to 3 guests"],
  },
  {
    id: 5,
    roomId: 626129,
    unitId: 1,
    displayName: "Room 5",
    type: "Ground Floor Double / Triple",
    location: "Ground floor",
    maxGuests: 3,
    image: "/images/rooms/voulamandis-house-rooms.webp",
    primaryBadge: "Garden view",
    featureBadges: ["Ground floor", "Garden view", "Up to 3 guests"],
  },
  {
    id: 6,
    roomId: 268803,
    unitId: 2,
    displayName: "Room 6",
    type: "Economy Double",
    location: "Ground floor",
    maxGuests: 2,
    image: "/images/rooms/received_1753964631359257.webp",
    primaryBadge: "Economy",
    featureBadges: ["Economy", "Ground floor", "Garden view"],
  },
  {
    id: 7,
    roomId: 626129,
    unitId: 2,
    displayName: "Room 7",
    type: "Ground Floor Double / Triple",
    location: "Ground floor",
    maxGuests: 3,
    image: "/images/rooms/double-triple-room.jpg",
    primaryBadge: "Garden view",
    featureBadges: ["Ground floor", "Garden view", "Up to 3 guests"],
  },
  {
    id: 8,
    roomId: 265595,
    unitId: 1,
    displayName: "Apartment 8",
    type: "Family Apartment",
    location: "Independent",
    maxGuests: 4,
    image: "/images/rooms/chios-apartments-voulamandis.webp",
    primaryBadge: "Apartment",
    featureBadges: ["Apartment", "Kitchen", "Up to 4 guests"],
  },
  {
    id: 9,
    roomId: 265595,
    unitId: 2,
    displayName: "Apartment 9",
    type: "Family Apartment",
    location: "Independent",
    maxGuests: 4,
    image: "/images/rooms/chios-apartments-voulamandis.webp",
    primaryBadge: "Apartment",
    featureBadges: ["Apartment", "Kitchen", "Up to 4 guests"],
  },
  {
    id: 10,
    roomId: 265595,
    unitId: 3,
    displayName: "Apartment 10",
    type: "Family Apartment",
    location: "Independent",
    maxGuests: 4,
    image: "/images/rooms/DSC07899.webp",
    primaryBadge: "Apartment",
    featureBadges: ["Apartment", "Kitchen", "Up to 4 guests"],
  },
] as const;

export function roomKey(room: Pick<DealRoom, "roomId" | "unitId">) {
  return `${room.roomId}_${room.unitId}`;
}

export function money(value: number) {
  return `€${Math.round(value)}`;
}

export function formatDate(value: string | null, locale = "en-GB") {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
}

function apiBaseGuests(room: RoomMeta) {
  return [8, 9, 10].includes(Number(room.id)) ? 4 : 2;
}

function extraGuestChargePerNight(room: RoomMeta, guests: number) {
  const base = apiBaseGuests(room);

  if (base >= 4) return 0;
  if (guests === 3) return 20;
  if (guests >= 4) return 30;

  return 0;
}

export function getNightInfo(deals: DealsResponse | null, room: RoomMeta, date: string | null, guests = 2) {
  if (!deals || !date) return null;
  const raw = deals.days?.find((day) => day.checkin === date)?.results?.[roomKey(room)];
  if (!raw?.available) return null;

  const base = Number(raw.totalPrice || 0);
  const discountableNight = base + extraGuestChargePerNight(room, guests);
  const original = Math.round(discountableNight + CLIMATE_FEE_PER_NIGHT);
  const direct = Math.round(discountableNight * (1 - DIRECT_DISCOUNT_PERCENT / 100) + CLIMATE_FEE_PER_NIGHT);

  return { original, direct, price: direct };
}

export function firstAvailableDate(deals: DealsResponse | null, room: RoomMeta, guests = 2) {
  return (deals?.days || []).slice(0, 7).find((day) => getNightInfo(deals, room, day.checkin, guests))?.checkin || null;
}

export function minDirectPrice(deals: DealsResponse | null, room: RoomMeta, guests = 2) {
  const prices = (deals?.days || [])
    .slice(0, 7)
    .map((day) => getNightInfo(deals, room, day.checkin, guests)?.direct)
    .filter((item): item is number => typeof item === "number");
  return prices.length ? Math.min(...prices) : null;
}

export function selectionTotals(deals: DealsResponse | null, room: RoomMeta | null, dates: string[], guests = 2) {
  if (!room || !dates.length) return null;

  const nights = dates.map((date) => getNightInfo(deals, room, date, guests));
  if (nights.some((night) => !night)) return null;

  return nights.reduce(
    (total, night) => ({
      original: total.original + Number(night?.original || 0),
      direct: total.direct + Number(night?.direct || 0),
      nights: total.nights + 1,
    }),
    { original: 0, direct: 0, nights: 0 },
  );
}

export function mergeDealRooms(deals: DealsResponse | null): RoomMeta[] {
  return (deals?.rooms || []).map((room) => {
    const base = ROOM_BASE.find((item) => item.roomId === room.roomId && item.unitId === room.unitId);

    return {
      id: base?.id || room.id || 0,
      roomId: room.roomId,
      unitId: room.unitId,
      displayName: base?.displayName || room.displayName || `Room ${room.unitId}`,
      type: base?.type || room.type || "Room / Apartment",
      location: base?.location || room.location || "Voulamandis House",
      maxGuests: base?.maxGuests || room.maxGuests || 2,
      images: [base?.image || "/images/rooms/voulamandis-house-rooms.webp", ...(room.images || [])],
      primaryBadge: base?.primaryBadge || "Direct offer",
      featureBadges: [...(base?.featureBadges || []), "Wi‑Fi"].slice(0, 4),
    };
  });
}
