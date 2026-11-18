// Alexandria Institute group stays at Voulamandis House (2027).
// Partner calendar at /andreas — Andreas (Alexandria Institute) enters the
// student bookings; Stratos gets an email on every change.

export type AlexandriaPeriod = {
  id: "june" | "september";
  label: string;
  // Group programme at Voulamandis House (check-in date / check-out date).
  programStart: string;
  programEnd: string;
  // Visible window: 3 days before the programme and 2 days after it, because
  // some students arrive earlier or leave later.
  viewStart: string;
  viewEnd: string;
};

export const ALEXANDRIA_PERIODS: AlexandriaPeriod[] = [
  {
    id: "june",
    label: "Ιούνιος 2027",
    programStart: "2027-06-06",
    programEnd: "2027-06-19",
    viewStart: "2027-06-03",
    viewEnd: "2027-06-21",
  },
  {
    id: "september",
    label: "Σεπτέμβριος 2027",
    programStart: "2027-09-05",
    programEnd: "2027-09-18",
    viewStart: "2027-09-02",
    viewEnd: "2027-09-20",
  },
];

export type AlexandriaRoom = { id: string; label: string; type: string };

// Fixed room categories (owner, 2026-10-15).
export const ALEXANDRIA_ROOMS: AlexandriaRoom[] = [
  { id: "1", label: "Δωμάτιο 1", type: "Α΄ όροφος" },
  { id: "2", label: "Δωμάτιο 2", type: "Economy" },
  { id: "3", label: "Δωμάτιο 3", type: "Α΄ όροφος" },
  { id: "4", label: "Δωμάτιο 4", type: "Α΄ όροφος" },
  { id: "5", label: "Δωμάτιο 5", type: "Ισόγειο" },
  { id: "6", label: "Δωμάτιο 6", type: "Economy" },
  { id: "7", label: "Δωμάτιο 7", type: "Ισόγειο" },
  { id: "8", label: "Διαμέρισμα 8", type: "Οικογενειακό" },
  { id: "9", label: "Διαμέρισμα 9", type: "Οικογενειακό" },
  { id: "10", label: "Διαμέρισμα 10", type: "Οικογενειακό" },
];

export function isAlexandriaRoom(value: string) {
  return ALEXANDRIA_ROOMS.some((room) => room.id === value);
}

/** A stay must sit fully inside one visible window (checkout may be the last day shown). */
export function periodForStay(checkin: string, checkout: string) {
  return ALEXANDRIA_PERIODS.find(
    (period) => checkin >= period.viewStart && checkout <= period.viewEnd && checkin < checkout,
  );
}

export function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string) {
  return Math.round(
    (new Date(`${to}T12:00:00Z`).getTime() - new Date(`${from}T12:00:00Z`).getTime()) / 86400000,
  );
}

export function formatGreekDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
