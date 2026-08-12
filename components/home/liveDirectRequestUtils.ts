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

type DealQuote = {
  available?: boolean;
  originalTotal?: number | string;
  directTotal?: number | string;
  directDiscountPercent?: number | string;
  saving?: number | string;
  guestNote?: string | null;
};

export type DealDay = {
  checkin: string;
  results?: Record<string, DealQuote>;
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

type VisualRoom = {
  id: number;
  roomId: number;
  unitId: number;
  displayName: string;
  type: string;
  location: string;
  image: string;
  primaryBadge: string;
  featureBadges: string[];
};

const ROOM_VISUALS: VisualRoom[] = [
  { id: 1, roomId: 267788, unitId: 1, displayName: "Room 1", type: "Upper Floor Double / Triple", location: "First floor", image: "/images/rooms/DSC07776-2-e1675109942622.webp", primaryBadge: "First floor", featureBadges: ["First floor", "No kitchenette", "Stairs"] },
  { id: 2, roomId: 268803, unitId: 1, displayName: "Room 2", type: "Economy Double", location: "First floor", image: "/images/rooms/DSC07803-1.webp", primaryBadge: "Economy", featureBadges: ["First floor", "No kitchenette", "Stairs"] },
  { id: 3, roomId: 267788, unitId: 2, displayName: "Room 3", type: "Upper Floor Double / Triple", location: "First floor", image: "/images/rooms/DSC07867-1.webp", primaryBadge: "Kitchenette", featureBadges: ["First floor", "Kitchenette", "Stairs"] },
  { id: 4, roomId: 267788, unitId: 3, displayName: "Room 4", type: "Upper Floor Double / Triple", location: "First floor", image: "/images/rooms/received_1748354861920234.webp", primaryBadge: "Kitchenette", featureBadges: ["First floor", "Kitchenette", "Stairs"] },
  { id: 5, roomId: 626129, unitId: 1, displayName: "Room 5", type: "Ground Floor Double / Triple", location: "Ground floor", image: "/images/rooms/voulamandis-house-rooms.webp", primaryBadge: "Ground floor", featureBadges: ["Ground floor", "No kitchenette", "No stairs"] },
  { id: 6, roomId: 268803, unitId: 2, displayName: "Room 6", type: "Economy Double", location: "Ground floor", image: "/images/rooms/received_1753964631359257.webp", primaryBadge: "Economy", featureBadges: ["Ground floor", "No kitchenette", "No stairs"] },
  { id: 7, roomId: 626129, unitId: 2, displayName: "Room 7", type: "Ground Floor Double / Triple", location: "Ground floor", image: "/images/rooms/double-triple-room.jpg", primaryBadge: "Ground floor", featureBadges: ["Ground floor", "No kitchenette", "No stairs"] },
  { id: 8, roomId: 265595, unitId: 1, displayName: "Apartment 8", type: "Family Apartment", location: "Ground floor", image: "/images/rooms/chios-apartments-voulamandis.webp", primaryBadge: "Kitchen", featureBadges: ["Ground floor", "Kitchen", "No stairs"] },
  { id: 9, roomId: 265595, unitId: 2, displayName: "Apartment 9", type: "Family Apartment", location: "Ground floor", image: "/images/rooms/chios-apartments-voulamandis.webp", primaryBadge: "Kitchen", featureBadges: ["Ground floor", "Kitchen", "No stairs"] },
  { id: 10, roomId: 265595, unitId: 3, displayName: "Apartment 10", type: "Family Apartment", location: "Ground floor", image: "/images/rooms/DSC07899.webp", primaryBadge: "Kitchen", featureBadges: ["Ground floor", "Kitchen", "No stairs"] },
];

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

function findVisualRoom(room: DealRoom) {
  const byKey = ROOM_VISUALS.find((item) => item.roomId === Number(room.roomId) && item.unitId === Number(room.unitId));
  if (byKey) return byKey;
  const id = Number(room.id || 0);
  return ROOM_VISUALS.find((item) => item.id === id) || null;
}

export function getNightInfo(deals: DealsResponse | null, room: RoomMeta, date: string | null, _guests = 2) {
  if (!deals || !date) return null;
  const raw = deals.days?.find((day) => day.checkin === date)?.results?.[roomKey(room)];
  if (!raw?.available) return null;

  const original = Number(raw.originalTotal || 0);
  const direct = Number(raw.directTotal || 0);
  if (!Number.isFinite(original) || original <= 0 || !Number.isFinite(direct) || direct <= 0) return null;

  return {
    original: Math.round(original * 100) / 100,
    direct: Math.round(direct * 100) / 100,
    price: Math.round(direct * 100) / 100,
    saving: Number(raw.saving || original - direct),
    discountPercent: Number(raw.directDiscountPercent || 0),
    guestNote: raw.guestNote || null,
  };
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
      original: Math.round((total.original + Number(night?.original || 0)) * 100) / 100,
      direct: Math.round((total.direct + Number(night?.direct || 0)) * 100) / 100,
      nights: total.nights + 1,
    }),
    { original: 0, direct: 0, nights: 0 },
  );
}

export function mergeDealRooms(deals: DealsResponse | null): RoomMeta[] {
  return (deals?.rooms || [])
    .map((room) => {
      const visual = findVisualRoom(room);
      const maxGuests = Number(room.maxGuests || 0);
      if (!visual || !Number.isInteger(maxGuests) || maxGuests < 1) return null;

      return {
        id: visual.id,
        roomId: Number(room.roomId),
        unitId: Number(room.unitId),
        displayName: room.displayName || visual.displayName,
        type: room.type || visual.type,
        location: room.location || visual.location,
        maxGuests,
        images: [visual.image],
        primaryBadge: visual.primaryBadge,
        featureBadges: [`👤×${maxGuests}`, ...visual.featureBadges].slice(0, 4),
      };
    })
    .filter((room): room is RoomMeta => Boolean(room));
}
