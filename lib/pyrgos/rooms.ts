// Room catalogue of the control tower (owner, 2026-10-15 and 2026-11-18).
// Categories are fixed: Economy = 2, 6; First floor = 1, 3, 4; Ground floor = 5, 7;
// Family apartments = 8, 9, 10; Apt 11 is its own unit, sold only directly.

export type RoomCategory = "economy" | "first_floor" | "ground_floor" | "apartment" | "apt11";

export type PyrgosRoom = {
  number: number;
  label: string;
  category: RoomCategory;
  categoryLabel: string;
  roomId: number | null; // Beds24 room id (Apt 11 is resolved at runtime)
  unitId: number;
};

export const CATEGORY_LABELS: Record<RoomCategory, string> = {
  economy: "Economy",
  first_floor: "Α΄ όροφος",
  ground_floor: "Ισόγειο",
  apartment: "Οικογενειακό διαμ.",
  apt11: "Apt 11",
};

export const PYRGOS_ROOMS: PyrgosRoom[] = [
  { number: 1, label: "Δωμ. 1", category: "first_floor", categoryLabel: CATEGORY_LABELS.first_floor, roomId: 267788, unitId: 1 },
  { number: 2, label: "Δωμ. 2", category: "economy", categoryLabel: CATEGORY_LABELS.economy, roomId: 268803, unitId: 1 },
  { number: 3, label: "Δωμ. 3", category: "first_floor", categoryLabel: CATEGORY_LABELS.first_floor, roomId: 267788, unitId: 2 },
  { number: 4, label: "Δωμ. 4", category: "first_floor", categoryLabel: CATEGORY_LABELS.first_floor, roomId: 267788, unitId: 3 },
  { number: 5, label: "Δωμ. 5", category: "ground_floor", categoryLabel: CATEGORY_LABELS.ground_floor, roomId: 626129, unitId: 1 },
  { number: 6, label: "Δωμ. 6", category: "economy", categoryLabel: CATEGORY_LABELS.economy, roomId: 268803, unitId: 2 },
  { number: 7, label: "Δωμ. 7", category: "ground_floor", categoryLabel: CATEGORY_LABELS.ground_floor, roomId: 626129, unitId: 2 },
  { number: 8, label: "Διαμ. 8", category: "apartment", categoryLabel: CATEGORY_LABELS.apartment, roomId: 265595, unitId: 1 },
  { number: 9, label: "Διαμ. 9", category: "apartment", categoryLabel: CATEGORY_LABELS.apartment, roomId: 265595, unitId: 2 },
  { number: 10, label: "Διαμ. 10", category: "apartment", categoryLabel: CATEGORY_LABELS.apartment, roomId: 265595, unitId: 3 },
  { number: 11, label: "Apt 11", category: "apt11", categoryLabel: CATEGORY_LABELS.apt11, roomId: null, unitId: 1 },
];

export const roomByNumber = (n: number | null | undefined) => PYRGOS_ROOMS.find((room) => room.number === n);

export function isCategoryChange(from: number | null | undefined, to: number | null | undefined) {
  const a = roomByNumber(from);
  const b = roomByNumber(to);
  return Boolean(a && b && a.category !== b.category);
}
