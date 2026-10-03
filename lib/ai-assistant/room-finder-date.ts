const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

export function parseStrictIsoDate(value: string): Date | null {
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day, 12));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

export function isStrictIsoDate(value: string) {
  return parseStrictIsoDate(value) !== null;
}

export function daysBetweenIsoDates(start: string, end: string) {
  const startDate = parseStrictIsoDate(start);
  const endDate = parseStrictIsoDate(end);
  if (!startDate || !endDate) return Number.NaN;
  return Math.round((endDate.getTime() - startDate.getTime()) / DAY_MS);
}

export function addDaysToIsoDate(iso: string, days: number) {
  const date = parseStrictIsoDate(iso);
  if (!date || !Number.isInteger(days) || days < 1 || days > 60) return "";
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function isoFromUtcDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

/** Orthodox Easter Sunday (Gregorian calendar), valid for 1900–2099. */
export function orthodoxEasterIso(year: number) {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;
  // Julian → Gregorian offset is 13 days between 1900 and 2099.
  return isoFromUtcDate(new Date(Date.UTC(year, month - 1, day + 13, 12)));
}

/** Western (Catholic/Protestant) Easter Sunday. */
export function westernEasterIso(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return isoFromUtcDate(new Date(Date.UTC(year, month - 1, day, 12)));
}

/** The next two Easter seasons that are today or later, for the interpreter prompt. */
export function upcomingEasterDates(today: string) {
  const year = Number(today.slice(0, 4));
  const rows: Array<{ year: number; orthodox: string; western: string }> = [];
  for (let candidate = year; rows.length < 2 && candidate < year + 4; candidate += 1) {
    const orthodox = orthodoxEasterIso(candidate);
    const western = westernEasterIso(candidate);
    if (orthodox >= today || western >= today) rows.push({ year: candidate, orthodox, western });
  }
  return rows;
}

export function todayInAthensIso(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Athens",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const value = (type: string) => parts.find(part => part.type === type)?.value || "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}
