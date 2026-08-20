import { unstable_cache } from "next/cache";
import { neon } from "@neondatabase/serverless";
import type { AgentRoom } from "@/components/agents/AgentRoomsGuide";

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

type RoomRow = {
  room_number: number;
  display_name: string;
  room_type: string;
  floor: string;
  max_guests: number;
  is_economy: boolean;
  no_stairs: boolean;
  has_full_kitchen: boolean;
  has_kitchenette: boolean;
  has_balcony: boolean;
  standard_capacity: number;
  size_m2: number;
  space_layout: string;
  bed_setup: Record<string, number>;
  has_upper_floor_view: boolean;
  has_garden_view: boolean;
  extra_bed_available: boolean;
};

type AmenityRow = {
  amenity_key: string;
  label: string;
};

const AMENITY_ORDER = [
  "mini_fridge",
  "kettle",
  "coffee",
  "tea",
  "air_condition",
  "free_wifi",
  "flat_screen_tv",
  "private_bathroom",
  "non_smoking",
];

export const getAgentRoomGuideData = unstable_cache(
  async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is missing for the B2B agent room guide");
    }

    const sql = neon(process.env.DATABASE_URL);
    const roomRows = await sql`
      select
        r.room_number,
        r.display_name,
        r.room_type,
        r.floor,
        r.max_guests,
        r.is_economy,
        r.no_stairs,
        r.has_full_kitchen,
        r.has_kitchenette,
        r.has_balcony,
        f.standard_capacity,
        f.size_m2,
        f.space_layout,
        f.bed_setup,
        f.has_upper_floor_view,
        f.has_garden_view,
        f.extra_bed_available
      from booking_core.rooms r
      join booking_core.room_features f using (room_number)
      where r.is_active = true
        and r.room_number between 1 and 10
      order by r.room_number
    ` as RoomRow[];

    const amenityRows = await sql`
      select amenity_key, label
      from booking_core.room_common_amenities
    ` as AmenityRow[];

    const rooms: AgentRoom[] = roomRows.map((row) => ({
      roomNumber: Number(row.room_number),
      displayName: row.display_name,
      roomType: row.room_type,
      floor: row.floor,
      maxGuests: Number(row.max_guests),
      standardCapacity: Number(row.standard_capacity),
      isEconomy: Boolean(row.is_economy),
      noStairs: Boolean(row.no_stairs),
      hasFullKitchen: Boolean(row.has_full_kitchen),
      hasKitchenette: Boolean(row.has_kitchenette),
      hasBalcony: Boolean(row.has_balcony),
      sizeM2: Number(row.size_m2),
      spaceLayout: row.space_layout,
      bedSetup: row.bed_setup || {},
      hasUpperFloorView: Boolean(row.has_upper_floor_view),
      hasGardenView: Boolean(row.has_garden_view),
      extraBedAvailable: Boolean(row.extra_bed_available),
      gallery: ROOM_GALLERIES[Number(row.room_number)] || [],
    }));

    const amenityMap = new Map(
      amenityRows.map((row) => [row.amenity_key, row.label]),
    );

    const commonAmenities = AMENITY_ORDER
      .filter((key) => amenityMap.has(key))
      .map((key) => ({ key, label: amenityMap.get(key) || key }));

    return { rooms, commonAmenities };
  },
  ["agent-room-guide-neon-v2"],
  { revalidate: 3600 },
);
