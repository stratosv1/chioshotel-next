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
    primaryBadge: "Flexible stay",
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
    primaryBadge: "Economy choice",
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
    primaryBadge: "Economy choice",
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
    primaryBadge: "Family apartment",
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
    primaryBadge: "Family apartment",
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
    primaryBadge: "Family apartment",
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

export function directPrice(value: number | string | undefined) {
  const base = Number(value || 0);
  return Math.round(base * 0.85 + 2);
}

export function getNightInfo(deals: DealsResponse | null, room: RoomMeta, date: string | null) {
  if (!deals || !date) return null;
  const raw = deals.days?.find((day) => day.checkin === date)?.results?.[roomKey(room)];
  if (!raw?.available) return null;

  const original = Math.round(Number(raw.totalPrice || 0) + 2);
  const direct = directPrice(raw.totalPrice);

  return { original, direct, price: direct };
}

export function firstAvailableDate(deals: DealsResponse | null, room: RoomMeta) {
  return (deals?.days || []).slice(0, 7).find((day) => getNightInfo(deals, room, day.checkin))?.checkin || null;
}

export function minDirectPrice(deals: DealsResponse | null, room: RoomMeta) {
  const prices = (deals?.days || [])
    .slice(0, 7)
    .map((day) => getNightInfo(deals, room, day.checkin)?.direct)
    .filter((item): item is number => typeof item === "number");
  return prices.length ? Math.min(...prices) : null;
}

export function selectionTotals(deals: DealsResponse | null, room: RoomMeta | null, dates: string[]) {
  if (!room || !dates.length) return null;

  const nights = dates.map((date) => getNightInfo(deals, room, date));
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
