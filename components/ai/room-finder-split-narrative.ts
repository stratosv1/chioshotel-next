import type { RoomFinderLanguage } from "./room-finder-copy";

export type SplitNarrativeOffer = {
  recoveryType?: "consolidated" | "split";
  features?: string[];
};

type Assignment = { room: string; guests: number };
type Segment = { start: string; assignments: Assignment[] };

const LOCALE: Record<RoomFinderLanguage, string> = {
  el: "el-GR",
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  es: "es-ES",
  tr: "tr-TR",
};

function parseSegment(value: string | undefined): Segment | null {
  if (!value) return null;
  const separator = value.indexOf(":");
  if (separator < 0) return null;

  const range = value.slice(0, separator).trim();
  const details = value.slice(separator + 1).trim();
  const start = range.split("–")[0]?.trim();
  if (!start || !details) return null;

  const assignments = details
    .split(" + ")
    .map(part => {
      const match = part.trim().match(/^(.*?)\s*\((\d+)\b/);
      if (!match) return null;
      return { room: match[1].trim(), guests: Number(match[2]) };
    })
    .filter((item): item is Assignment => Boolean(item && item.room && Number.isFinite(item.guests)));

  return assignments.length ? { start, assignments } : null;
}

function normalizeMonth(value: string, locale: string) {
  return value
    .trim()
    .replace(/[.,]/g, "")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase(locale);
}

function numericDate(value: string, language: RoomFinderLanguage) {
  const direct = value.trim().match(/^(\d{1,2})[/.\-](\d{1,2})(?:[/.\-]\d{2,4})?$/);
  if (direct) {
    return `${direct[1].padStart(2, "0")}/${direct[2].padStart(2, "0")}`;
  }

  const match = value.trim().match(/^(\d{1,2})\D+(.+)$/u);
  if (!match) return value;

  const day = Number(match[1]);
  const locale = LOCALE[language];
  const monthText = normalizeMonth(match[2], locale);
  if (!Number.isInteger(day) || day < 1 || day > 31 || !monthText) return value;

  for (let month = 1; month <= 12; month += 1) {
    const candidate = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" })
      .format(new Date(Date.UTC(2026, month - 1, 1)));
    const normalizedCandidate = normalizeMonth(candidate, locale);
    if (
      monthText === normalizedCandidate
      || monthText.startsWith(normalizedCandidate)
      || normalizedCandidate.startsWith(monthText)
    ) {
      return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`;
    }
  }

  return value;
}

function roomAllocation(assignments: Assignment[], language: RoomFinderLanguage) {
  const joiner = language === "el" ? " και " : language === "tr" ? " ve " : " + ";
  return assignments.map(item => `${item.room} (${item.guests})`).join(joiner);
}

function genericNarrative(first: Segment, second: Segment, language: RoomFinderLanguage) {
  const firstDate = numericDate(first.start, language);
  const secondDate = numericDate(second.start, language);
  const firstAllocation = roomAllocation(first.assignments, language);
  const secondAllocation = roomAllocation(second.assignments, language);

  switch (language) {
    case "el": return `${firstDate}: διαμονή σε ${firstAllocation}. ${secondDate}: η κατανομή αλλάζει σε ${secondAllocation}.`;
    case "de": return `${firstDate}: Aufenthalt in ${firstAllocation}. ${secondDate}: Aufteilung in ${secondAllocation}.`;
    case "fr": return `${firstDate} : séjour dans ${firstAllocation}. ${secondDate} : nouvelle répartition dans ${secondAllocation}.`;
    case "it": return `${firstDate}: soggiorno in ${firstAllocation}. ${secondDate}: nuova sistemazione in ${secondAllocation}.`;
    case "es": return `${firstDate}: estancia en ${firstAllocation}. ${secondDate}: nueva distribución en ${secondAllocation}.`;
    case "tr": return `${firstDate}: ${firstAllocation}. ${secondDate}: yeni dağılım ${secondAllocation}.`;
    default: return `${firstDate}: stay in ${firstAllocation}. ${secondDate}: room allocation changes to ${secondAllocation}.`;
  }
}

export function splitStayNarrative(offer: SplitNarrativeOffer, language: RoomFinderLanguage) {
  if (offer.recoveryType !== "split") return null;

  const first = parseSegment(offer.features?.[0]);
  const second = parseSegment(offer.features?.[1]);
  if (!first || !second) return null;

  const firstDate = numericDate(first.start, language);
  const secondDate = numericDate(second.start, language);

  if (first.assignments.length === 1) {
    const original = first.assignments[0];
    const continuing = second.assignments.find(item => item.room === original.room);
    const moved = second.assignments.filter(item => item.room !== original.room);

    if (continuing && moved.length > 0) {
      const movedGuests = moved.reduce((sum, item) => sum + item.guests, 0);
      const destinations = moved.map(item => item.room).join(" + ");
      const remainingGuests = continuing.guests;
      const totalGuests = original.guests;

      switch (language) {
        case "el":
          return `${firstDate}: και οι ${totalGuests} επισκέπτες θα μείνουν στο ${original.room}. ${secondDate}: ${movedGuests} ${movedGuests === 1 ? "επισκέπτης θα μεταφερθεί" : "επισκέπτες θα μεταφερθούν"} στο ${destinations}, ενώ ${remainingGuests === totalGuests - movedGuests ? "οι άλλοι " : ""}${remainingGuests} ${remainingGuests === 1 ? "θα παραμείνει" : "θα παραμείνουν"} στο ${original.room}.`;
        case "de":
          return `${firstDate}: alle ${totalGuests} Gäste wohnen im ${original.room}. ${secondDate}: ${movedGuests === 1 ? "1 Gast zieht" : `${movedGuests} Gäste ziehen`} in ${destinations} um, die übrigen ${remainingGuests} ${remainingGuests === 1 ? "bleibt" : "bleiben"} im ${original.room}.`;
        case "fr":
          return `${firstDate} : les ${totalGuests} personnes séjourneront dans ${original.room}. ${secondDate} : ${movedGuests} ${movedGuests === 1 ? "personne sera transférée" : "personnes seront transférées"} vers ${destinations}, les ${remainingGuests} autres resteront dans ${original.room}.`;
        case "it":
          return `${firstDate}: tutti e ${totalGuests} gli ospiti soggiorneranno in ${original.room}. ${secondDate}: ${movedGuests} ${movedGuests === 1 ? "ospite si sposterà" : "ospiti si sposteranno"} in ${destinations}, gli altri ${remainingGuests} rimarranno in ${original.room}.`;
        case "es":
          return `${firstDate}: los ${totalGuests} huéspedes se alojarán en ${original.room}. ${secondDate}: ${movedGuests} ${movedGuests === 1 ? "huésped se trasladará" : "huéspedes se trasladarán"} a ${destinations}, los otros ${remainingGuests} permanecerán en ${original.room}.`;
        case "tr":
          return `${firstDate}: ${totalGuests} misafirin tamamı ${original.room} odasında kalacak. ${secondDate}: ${movedGuests} misafir ${destinations} odasına geçecek, diğer ${remainingGuests} misafir ${original.room} odasında kalacak.`;
        default:
          return `${firstDate}: all ${totalGuests} guests will stay in ${original.room}. ${secondDate}: ${movedGuests} ${movedGuests === 1 ? "guest will move" : "guests will move"} to ${destinations}, while the other ${remainingGuests} ${remainingGuests === 1 ? "guest remains" : "guests remain"} in ${original.room}.`;
      }
    }
  }

  return genericNarrative(first, second, language);
}
