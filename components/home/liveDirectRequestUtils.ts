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

export type RoomMeta = Required<Pick<DealRoom, "id" | "roomId" | "unitId" | "displayName" | "type" | "location" | "maxGuests" | "images">>;

const ROOM_BASE = [
  { id: 1, roomId: 267788, unitId: 1, maxGuests: 4, image: "/images/rooms/voulamandis-house-chios-hotels-1-e1675700558710.webp" },
  { id: 2, roomId: 268803, unitId: 1, maxGuests: 2, image: "/images/rooms/DSC07803-1.webp" },
  { id: 3, roomId: 267788, unitId: 2, maxGuests: 3, image: "/images/rooms/DSC07867-1.webp" },
  { id: 4, roomId: 267788, unitId: 3, maxGuests: 3, image: "/images/rooms/received_1748354861920234.webp" },
  { id: 5, roomId: 626129, unitId: 1, maxGuests: 3, image: "/images/rooms/voulamandis-house-rooms.webp" },
  { id: 6, roomId: 268803, unitId: 2, maxGuests: 2, image: "/images/rooms/received_1753964631359257.webp" },
  { id: 7, roomId: 626129, unitId: 2, maxGuests: 3, image: "/images/rooms/double-triple-room.jpg" },
  { id: 8, roomId: 265595, unitId: 1, maxGuests: 4, image: "/images/rooms/chios-apartments-voulamandis.webp" },
  { id: 9, roomId: 265595, unitId: 2, maxGuests: 4, image: "/images/rooms/chios-apartments-voulamandis.webp" },
  { id: 10, roomId: 265595, unitId: 3, maxGuests: 4, image: "/images/rooms/DSC07899.webp" },
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

  return { original, direct };
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
      displayName: room.displayName || `Room ${base?.id || room.unitId}`,
      type: room.type || "Room / Apartment",
      location: room.location || "Voulamandis House",
      maxGuests: base?.maxGuests || room.maxGuests || 2,
      images: [base?.image || "/images/rooms/voulamandis-house-rooms.webp", ...(room.images || [])],
    };
  });
}
