import type { RoomFinderLanguage } from "./room-finder-copy";

/**
 * Ref 21: when the guest gives a detail the assistant did not ask for yet
 * (e.g. "2 άτομα" while it asks how many rooms), it is confirmed before the
 * open question is asked again, so the guest sees it was understood instead
 * of getting the same question (or the "tap a number" help) back.
 */

type Draft = { totalGuests: number | null; roomCount: number | null };

const COPY: Record<RoomFinderLanguage, {
  guests: (n: number) => string;
  rooms: (n: number) => string;
  and: string;
  noted: (parts: string) => string;
}> = {
  el: {
    guests: n => (n === 1 ? "1 άτομο" : `${n} άτομα`),
    rooms: n => (n === 1 ? "1 δωμάτιο" : `${n} δωμάτια`),
    and: " και ",
    noted: parts => `Σημείωσα ${parts}.`,
  },
  en: {
    guests: n => (n === 1 ? "1 guest" : `${n} guests`),
    rooms: n => (n === 1 ? "1 room" : `${n} rooms`),
    and: " and ",
    noted: parts => `Noted: ${parts}.`,
  },
  de: {
    guests: n => (n === 1 ? "1 Person" : `${n} Personen`),
    rooms: n => `${n} Zimmer`,
    and: " und ",
    noted: parts => `Notiert: ${parts}.`,
  },
  fr: {
    guests: n => (n === 1 ? "1 personne" : `${n} personnes`),
    rooms: n => (n === 1 ? "1 chambre" : `${n} chambres`),
    and: " et ",
    noted: parts => `C’est noté : ${parts}.`,
  },
  it: {
    guests: n => (n === 1 ? "1 persona" : `${n} persone`),
    rooms: n => (n === 1 ? "1 camera" : `${n} camere`),
    and: " e ",
    noted: parts => `Annotato: ${parts}.`,
  },
  es: {
    guests: n => (n === 1 ? "1 persona" : `${n} personas`),
    rooms: n => (n === 1 ? "1 habitación" : `${n} habitaciones`),
    and: " y ",
    noted: parts => `Anotado: ${parts}.`,
  },
  tr: {
    guests: n => `${n} kişi`,
    rooms: n => `${n} oda`,
    and: " ve ",
    noted: parts => `Not aldım: ${parts}.`,
  },
};

/**
 * "Σημείωσα 2 άτομα." for details the guest gave in this turn that were not
 * the question being asked (`askedStep`), or "" when there is nothing to note.
 */
export function notedDetails(
  language: RoomFinderLanguage,
  askedStep: string,
  previous: Draft,
  next: Draft,
): string {
  const copy = COPY[language] || COPY.en;
  const parts: string[] = [];
  if (askedStep !== "guests" && next.totalGuests && next.totalGuests !== previous.totalGuests) {
    parts.push(copy.guests(next.totalGuests));
  }
  if (askedStep !== "rooms" && next.roomCount && next.roomCount !== previous.roomCount) {
    parts.push(copy.rooms(next.roomCount));
  }
  return parts.length ? copy.noted(parts.join(copy.and)) : "";
}

/** The prompt with the note in front, or the prompt unchanged. */
export function withNotedDetails(note: string, prompt: string) {
  return note ? `${note}\n\n${prompt}` : prompt;
}
