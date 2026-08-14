import type { RoomFinderLanguage } from "./room-finder-copy";

const LOCALE: Record<RoomFinderLanguage, string> = {
  el: "el-GR",
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  es: "es-ES",
  tr: "tr-TR",
};

export function humanDate(value: string, language: RoomFinderLanguage) {
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(LOCALE[language], {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  })
    .format(date)
    .replace(/\.$/, "");
}

export function stayRange(checkin: string, checkout: string, language: RoomFinderLanguage) {
  if (!checkin) return "";
  const arrival = humanDate(checkin, language);
  return checkout ? `${arrival} → ${humanDate(checkout, language)}` : arrival;
}
