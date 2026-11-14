import type { RoomFinderLanguage } from "./room-finder-copy";

// Public holidays in a guest's home country that fall on their stay.
// Shown only when the guest uses the Room Finder in that country's language
// (today: Turkish). We cannot tell a Turkish guest writing in English apart
// from anyone else, so English stays neutral.

type Holiday = {
  id: string;
  name: string;
  // Official holiday days, inclusive (yyyy-mm-dd).
  start: string;
  end: string;
  // Half-day eve (arife) before the holiday, when there is one.
  eve?: string;
  greeting?: string;
};

const BAYRAM_GREETING = "Şimdiden iyi bayramlar!";

// Religious holidays follow the lunar calendar: add each year from the
// Diyanet calendar once it is published (2028 is not published yet).
const RELIGIOUS_HOLIDAYS: Holiday[] = [
  { id: "ramazan-bayrami-2027", name: "Ramazan Bayramı", eve: "2027-03-08", start: "2027-03-09", end: "2027-03-11", greeting: BAYRAM_GREETING },
  { id: "kurban-bayrami-2027", name: "Kurban Bayramı", eve: "2027-05-15", start: "2027-05-16", end: "2027-05-19", greeting: BAYRAM_GREETING },
];

// Fixed-date national holidays, repeated every year.
const FIXED_HOLIDAYS: Array<{ id: string; monthDay: string; name: string; eveDay?: string; greeting?: string }> = [
  { id: "yilbasi", monthDay: "01-01", name: "Yılbaşı", greeting: "Şimdiden mutlu yıllar!" },
  { id: "23-nisan", monthDay: "04-23", name: "Ulusal Egemenlik ve Çocuk Bayramı", greeting: BAYRAM_GREETING },
  { id: "1-mayis", monthDay: "05-01", name: "Emek ve Dayanışma Günü" },
  { id: "19-mayis", monthDay: "05-19", name: "Atatürk'ü Anma, Gençlik ve Spor Bayramı", greeting: BAYRAM_GREETING },
  { id: "15-temmuz", monthDay: "07-15", name: "Demokrasi ve Millî Birlik Günü" },
  { id: "30-agustos", monthDay: "08-30", name: "Zafer Bayramı", greeting: BAYRAM_GREETING },
  { id: "29-ekim", monthDay: "10-29", name: "Cumhuriyet Bayramı", eveDay: "10-28", greeting: BAYRAM_GREETING },
];

function holidaysForYears(years: number[]): Holiday[] {
  const fixed = years.flatMap(year => FIXED_HOLIDAYS.map(h => ({
    id: `${h.id}-${year}`,
    name: h.name,
    start: `${year}-${h.monthDay}`,
    end: `${year}-${h.monthDay}`,
    eve: h.eveDay ? `${year}-${h.eveDay}` : undefined,
    greeting: h.greeting,
  })));
  return [...RELIGIOUS_HOLIDAYS, ...fixed].sort((a, b) => a.start.localeCompare(b.start));
}

// Holidays the stay touches: any night from the eve to the last holiday day.
// checkout is exclusive (the guest leaves that morning).
export function turkishHolidaysForStay(checkin: string, checkout: string): Holiday[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkin) || !/^\d{4}-\d{2}-\d{2}$/.test(checkout) || checkout <= checkin) return [];
  const firstYear = Number(checkin.slice(0, 4));
  const lastYear = Number(checkout.slice(0, 4));
  const years: number[] = [];
  for (let year = firstYear; year <= lastYear; year++) years.push(year);

  return holidaysForYears(years).filter(h => checkin <= h.end && checkout > (h.eve || h.start));
}

const TR_DATE = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", timeZone: "UTC" });
const TR_DATE_YEAR = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function utc(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function dayRange(h: Holiday) {
  if (h.start === h.end) return TR_DATE_YEAR.format(utc(h.start));
  const sameMonth = h.start.slice(0, 7) === h.end.slice(0, 7);
  return sameMonth
    ? `${Number(h.start.slice(8))}–${TR_DATE_YEAR.format(utc(h.end))}`
    : `${TR_DATE.format(utc(h.start))} – ${TR_DATE_YEAR.format(utc(h.end))}`;
}

function joinTurkish(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ve ${items[items.length - 1]}`;
}

// Turkish note for a stay that falls on Turkish public holidays, or null.
// Holidays already mentioned in this conversation are skipped.
export function homeHolidayMessage(
  language: RoomFinderLanguage,
  checkin: string,
  checkout: string,
  alreadyMentioned: ReadonlySet<string> = new Set(),
): { message: string; holidayIds: string[] } | null {
  if (language !== "tr") return null;
  const holidays = turkishHolidaysForStay(checkin, checkout).filter(h => !alreadyMentioned.has(h.id));
  if (!holidays.length) return null;

  const named = joinTurkish(holidays.map(h => `${h.name} (${dayRange(h)})`));
  const greeting = holidays.find(h => h.greeting)?.greeting;
  const message = [
    `🇹🇷 Seçtiğiniz tarihler Türkiye'de ${named} tatiline denk geliyor.`,
    "Bu dönemde Çeşme–Sakız feribotları ve adadaki konaklama yerleri yoğun olur; feribot biletinizi ve odanızı erkenden ayırtmanızı öneririz.",
    greeting,
  ].filter(Boolean).join("\n");

  return { message, holidayIds: holidays.map(h => h.id) };
}
