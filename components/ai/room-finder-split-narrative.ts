import type { RoomFinderLanguage } from "./room-finder-copy";

export type SplitNarrativeOffer = {
  recoveryType?: "consolidated" | "split";
  features?: string[];
};

type Assignment = { room: string; guests: number };
type Segment = { start: string; assignments: Assignment[] };

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

function roomAllocation(assignments: Assignment[], language: RoomFinderLanguage) {
  const joiner = language === "el" ? " και " : language === "tr" ? " ve " : " + ";
  return assignments.map(item => `${item.room} (${item.guests})`).join(joiner);
}

function genericNarrative(first: Segment, second: Segment, language: RoomFinderLanguage) {
  const firstAllocation = roomAllocation(first.assignments, language);
  const secondAllocation = roomAllocation(second.assignments, language);

  switch (language) {
    case "el": return `Στις ${first.start}, η διαμονή ξεκινά με ${firstAllocation}. Στις ${second.start}, η κατανομή αλλάζει σε ${secondAllocation}.`;
    case "de": return `Am ${first.start} beginnt der Aufenthalt mit ${firstAllocation}. Am ${second.start} ändert sich die Aufteilung zu ${secondAllocation}.`;
    case "fr": return `Le ${first.start}, le séjour commence avec ${firstAllocation}. Le ${second.start}, la répartition devient ${secondAllocation}.`;
    case "it": return `Il ${first.start}, il soggiorno inizia con ${firstAllocation}. Il ${second.start}, la sistemazione cambia in ${secondAllocation}.`;
    case "es": return `El ${first.start}, la estancia comienza con ${firstAllocation}. El ${second.start}, la distribución cambia a ${secondAllocation}.`;
    case "tr": return `${first.start} tarihinde konaklama ${firstAllocation} ile başlar. ${second.start} tarihinde dağılım ${secondAllocation} olarak değişir.`;
    default: return `On ${first.start}, the stay starts with ${firstAllocation}. On ${second.start}, the room allocation changes to ${secondAllocation}.`;
  }
}

export function splitStayNarrative(offer: SplitNarrativeOffer, language: RoomFinderLanguage) {
  if (offer.recoveryType !== "split") return null;

  const first = parseSegment(offer.features?.[0]);
  const second = parseSegment(offer.features?.[1]);
  if (!first || !second) return null;

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
          return `Στις ${first.start}, και οι ${totalGuests} επισκέπτες θα μείνουν στο ${original.room}. Στις ${second.start}, ${movedGuests} ${movedGuests === 1 ? "επισκέπτης θα μεταφερθεί" : "επισκέπτες θα μεταφερθούν"} στο ${destinations}, ενώ ${remainingGuests} ${remainingGuests === 1 ? "επισκέπτης θα παραμείνει" : "επισκέπτες θα παραμείνουν"} στο ${original.room}.`;
        case "de":
          return `Am ${first.start} wohnen alle ${totalGuests} Gäste im ${original.room}. Am ${second.start} ${movedGuests === 1 ? "zieht 1 Gast" : `ziehen ${movedGuests} Gäste`} in ${destinations} um, während ${remainingGuests === 1 ? "1 Gast" : `${remainingGuests} Gäste`} im ${original.room} ${remainingGuests === 1 ? "bleibt" : "bleiben"}.`;
        case "fr":
          return `Le ${first.start}, les ${totalGuests} personnes séjourneront ensemble dans ${original.room}. Le ${second.start}, ${movedGuests} ${movedGuests === 1 ? "personne sera transférée" : "personnes seront transférées"} vers ${destinations}, tandis que ${remainingGuests} ${remainingGuests === 1 ? "personne restera" : "personnes resteront"} dans ${original.room}.`;
        case "it":
          return `Il ${first.start}, tutti e ${totalGuests} gli ospiti soggiorneranno in ${original.room}. Il ${second.start}, ${movedGuests} ${movedGuests === 1 ? "ospite si sposterà" : "ospiti si sposteranno"} in ${destinations}, mentre ${remainingGuests} ${remainingGuests === 1 ? "ospite rimarrà" : "ospiti rimarranno"} in ${original.room}.`;
        case "es":
          return `El ${first.start}, los ${totalGuests} huéspedes se alojarán juntos en ${original.room}. El ${second.start}, ${movedGuests} ${movedGuests === 1 ? "huésped se trasladará" : "huéspedes se trasladarán"} a ${destinations}, mientras ${remainingGuests} ${remainingGuests === 1 ? "huésped permanecerá" : "huéspedes permanecerán"} en ${original.room}.`;
        case "tr":
          return `${first.start} tarihinde ${totalGuests} misafirin tamamı ${original.room} odasında kalacak. ${second.start} tarihinde ${movedGuests} misafir ${destinations} odasına geçecek, ${remainingGuests} misafir ise ${original.room} odasında kalacak.`;
        default:
          return `On ${first.start}, all ${totalGuests} guests will stay in ${original.room}. On ${second.start}, ${movedGuests} ${movedGuests === 1 ? "guest will move" : "guests will move"} to ${destinations}, while ${remainingGuests} ${remainingGuests === 1 ? "guest remains" : "guests remain"} in ${original.room}.`;
      }
    }
  }

  return genericNarrative(first, second, language);
}
