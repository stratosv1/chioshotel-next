import type { RoomFinderLanguage } from "./room-finder-copy";

// Public holidays in Türkiye that fall on a guest's stay.
// - Turkish-speaking guests always hear about them, in Turkish.
// - English-speaking guests hear about them only when their connection comes
//   from Türkiye (Vercel IP geolocation), worded as "if you're travelling
//   from Türkiye", since a VPN or a traveller abroad can make that wrong.
// Other languages are unchanged.

type Holiday = {
  id: string;
  name: string;
  nameEn: string;
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
  { id: "ramazan-bayrami-2027", name: "Ramazan Bayramı", nameEn: "Ramazan Bayramı / Eid al-Fitr", eve: "2027-03-08", start: "2027-03-09", end: "2027-03-11", greeting: BAYRAM_GREETING },
  { id: "kurban-bayrami-2027", name: "Kurban Bayramı", nameEn: "Kurban Bayramı / Eid al-Adha", eve: "2027-05-15", start: "2027-05-16", end: "2027-05-19", greeting: BAYRAM_GREETING },
];

// Fixed-date national holidays, repeated every year.
const FIXED_HOLIDAYS: Array<{ id: string; monthDay: string; name: string; nameEn: string; eveDay?: string; greeting?: string }> = [
  { id: "yilbasi", monthDay: "01-01", name: "Yılbaşı", nameEn: "New Year's Day", greeting: "Şimdiden mutlu yıllar!" },
  { id: "23-nisan", monthDay: "04-23", name: "Ulusal Egemenlik ve Çocuk Bayramı", nameEn: "National Sovereignty and Children's Day", greeting: BAYRAM_GREETING },
  { id: "1-mayis", monthDay: "05-01", name: "Emek ve Dayanışma Günü", nameEn: "Labour Day" },
  { id: "19-mayis", monthDay: "05-19", name: "Atatürk'ü Anma, Gençlik ve Spor Bayramı", nameEn: "Youth and Sports Day", greeting: BAYRAM_GREETING },
  { id: "15-temmuz", monthDay: "07-15", name: "Demokrasi ve Millî Birlik Günü", nameEn: "Democracy and National Unity Day" },
  { id: "30-agustos", monthDay: "08-30", name: "Zafer Bayramı", nameEn: "Victory Day", greeting: BAYRAM_GREETING },
  { id: "29-ekim", monthDay: "10-29", name: "Cumhuriyet Bayramı", nameEn: "Republic Day", eveDay: "10-28", greeting: BAYRAM_GREETING },
];

function holidaysForYears(years: number[]): Holiday[] {
  const fixed = years.flatMap(year => FIXED_HOLIDAYS.map(h => ({
    id: `${h.id}-${year}`,
    name: h.name,
    nameEn: h.nameEn,
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
  const years: number[] = [];
  for (let year = Number(checkin.slice(0, 4)); year <= Number(checkout.slice(0, 4)); year++) years.push(year);
  return holidaysForYears(years).filter(h => checkin <= h.end && checkout > (h.eve || h.start));
}

// Languages that get the note only when the visitor connects from Türkiye.
const GEO_LANGUAGES: RoomFinderLanguage[] = ["en"];

// Whether the visitor's country is needed to decide on a note for this stay.
export function homeHolidayNeedsCountry(
  language: RoomFinderLanguage,
  checkin: string,
  checkout: string,
  alreadyMentioned: ReadonlySet<string> = new Set(),
) {
  return GEO_LANGUAGES.includes(language)
    && turkishHolidaysForStay(checkin, checkout).some(h => !alreadyMentioned.has(h.id));
}

function utc(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function dayRange(h: Holiday, locale: string) {
  const dayMonth = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", timeZone: "UTC" });
  const full = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  if (h.start === h.end) return full.format(utc(h.start));
  return h.start.slice(0, 7) === h.end.slice(0, 7)
    ? `${Number(h.start.slice(8))}–${full.format(utc(h.end))}`
    : `${dayMonth.format(utc(h.start))} – ${full.format(utc(h.end))}`;
}

function joinList(items: string[], and: string) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${and} ${items[items.length - 1]}`;
}

// Note for a stay that falls on Turkish public holidays, or null.
// visitorCountry is needed only for GEO_LANGUAGES; holidays already
// mentioned in this conversation are skipped.
export function homeHolidayMessage(
  language: RoomFinderLanguage,
  checkin: string,
  checkout: string,
  alreadyMentioned: ReadonlySet<string> = new Set(),
  visitorCountry: string | null = null,
): { message: string; holidayIds: string[] } | null {
  const turkish = language === "tr";
  const fromTurkey = GEO_LANGUAGES.includes(language) && visitorCountry === "TR";
  if (!turkish && !fromTurkey) return null;

  const holidays = turkishHolidaysForStay(checkin, checkout).filter(h => !alreadyMentioned.has(h.id));
  if (!holidays.length) return null;
  const holidayIds = holidays.map(h => h.id);

  if (turkish) {
    const named = joinList(holidays.map(h => `${h.name} (${dayRange(h, "tr-TR")})`), "ve");
    const greeting = holidays.find(h => h.greeting)?.greeting;
    const message = [
      `🇹🇷 Seçtiğiniz tarihler Türkiye'de ${named} tatiline denk geliyor.`,
      "Bu dönemde Çeşme–Sakız feribotları ve adadaki konaklama yerleri yoğun olur; feribot biletinizi ve odanızı erkenden ayırtmanızı öneririz.",
      greeting,
    ].filter(Boolean).join("\n");
    return { message, holidayIds };
  }

  const named = joinList(holidays.map(h => `${h.nameEn} (${dayRange(h, "en-GB")})`), "and");
  const message = [
    `🇹🇷 If you're travelling from Türkiye: your dates fall on ${holidays.length > 1 ? "public holidays" : "a public holiday"} there, ${named}.`,
    "Ferries from Çeşme to Chios and accommodation on the island get busy over the holiday, so we recommend booking your ferry ticket and room early.",
  ].join("\n");
  return { message, holidayIds };
}
