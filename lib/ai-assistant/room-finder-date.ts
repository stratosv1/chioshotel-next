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
