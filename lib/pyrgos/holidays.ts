// Greek and Turkish public holidays for the booking plan (owner, 2026-11-25): shown as a small
// flag on the date header so he can see which periods to price differently.

export type HolidayCountry = "GR" | "TR";
export type Holiday = { country: HolidayCountry; name: string; note?: string };

const iso = (y: number, m: number, d: number) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const shift = (day: string, n: number) => new Date(Date.parse(`${day}T12:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

/** Orthodox Easter Sunday (Gregorian date), Meeus Julian algorithm + 13 days. */
function orthodoxEaster(year: number) {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;
  return shift(iso(year, month, day), 13);
}

function greek(year: number): [string, string][] {
  const easter = orthodoxEaster(year);
  return [
    [iso(year, 1, 1), "Πρωτοχρονιά"],
    [iso(year, 1, 6), "Θεοφάνεια"],
    [shift(easter, -48), "Καθαρά Δευτέρα"],
    [iso(year, 3, 25), "25η Μαρτίου"],
    [shift(easter, -2), "Μεγάλη Παρασκευή"],
    [shift(easter, -1), "Μεγάλο Σάββατο"],
    [easter, "Πάσχα"],
    [shift(easter, 1), "Δευτέρα του Πάσχα"],
    [iso(year, 5, 1), "Πρωτομαγιά"],
    [shift(easter, 50), "Αγίου Πνεύματος"],
    [iso(year, 8, 15), "Δεκαπενταύγουστος"],
    [iso(year, 10, 28), "28η Οκτωβρίου"],
    [iso(year, 12, 25), "Χριστούγεννα"],
    [iso(year, 12, 26), "Σύναξη της Θεοτόκου"],
  ];
}

function turkishFixed(year: number): [string, string][] {
  return [
    [iso(year, 1, 1), "Πρωτοχρονιά"],
    [iso(year, 4, 23), "Εθνική Κυριαρχία & Παιδιού"],
    [iso(year, 5, 1), "Πρωτομαγιά"],
    [iso(year, 5, 19), "Νεολαίας & Αθλητισμού (Ατατούρκ)"],
    [iso(year, 7, 15), "Δημοκρατίας & Εθνικής Ενότητας"],
    [iso(year, 8, 30), "Ημέρα Νίκης"],
    [iso(year, 10, 28), "Παραμονή Δημοκρατίας (μισή μέρα)"],
    [iso(year, 10, 29), "Ημέρα Δημοκρατίας"],
  ];
}

// Ramazan / Kurban Bayramı follow the lunar calendar: dates from the Diyanet calendar.
// first = 1st day; days = length (3 Ramazan, 4 Kurban); the day before is Arefe (half day).
const BAYRAMS: { name: string; first: string; days: number; estimate?: boolean }[] = [
  { name: "Ramazan Bayramı", first: "2026-03-20", days: 3 },
  { name: "Kurban Bayramı", first: "2026-05-27", days: 4 },
  { name: "Ramazan Bayramı", first: "2027-03-09", days: 3 },
  { name: "Kurban Bayramı", first: "2027-05-16", days: 4 },
  { name: "Ramazan Bayramı", first: "2028-02-26", days: 3 },
  { name: "Kurban Bayramı", first: "2028-05-05", days: 4 },
];

const cache = new Map<number, Map<string, Holiday[]>>();

function yearMap(year: number) {
  let map = cache.get(year);
  if (map) return map;
  map = new Map();
  const add = (day: string, h: Holiday) => {
    if (!day.startsWith(String(year))) return;
    map!.set(day, [...(map!.get(day) ?? []), h]);
  };
  for (const [day, name] of greek(year)) add(day, { country: "GR", name });
  for (const [day, name] of turkishFixed(year)) add(day, { country: "TR", name });
  for (const b of BAYRAMS) {
    const note = b.estimate ? "κατά προσέγγιση, δεν έχει ανακοινωθεί" : undefined;
    add(shift(b.first, -1), { country: "TR", name: `Παραμονή ${b.name} (μισή μέρα)`, note });
    for (let i = 0; i < b.days; i++) add(shift(b.first, i), { country: "TR", name: `${b.name} ${i + 1}η μέρα`, note });
  }
  cache.set(year, map);
  return map;
}

/** Holidays that fall on a day (YYYY-MM-DD), Greek first. */
export function holidaysOn(day: string): Holiday[] {
  return yearMap(Number(day.slice(0, 4))).get(day) ?? [];
}
