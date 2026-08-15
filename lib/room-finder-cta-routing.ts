export type RoomFinderSiteLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

const SUPPORTED_LANGUAGES: RoomFinderSiteLanguage[] = ["en", "el", "fr", "de", "it", "es", "tr"];

export const ROOM_FINDER_HREFS: Record<RoomFinderSiteLanguage, string> = {
  en: "/ai-assistant/?lang=en",
  el: "/ai-assistant/?lang=el",
  fr: "/ai-assistant/?lang=fr",
  de: "/ai-assistant/?lang=de",
  it: "/ai-assistant/?lang=it",
  es: "/ai-assistant/?lang=es",
  tr: "/ai-assistant/?lang=tr",
};

const DISCOVERY_PATTERNS = [
  "room finder",
  "room wizard",
  "find your room",
  "find the right room",
  "find a room",
  "availability",
  "βρες το δωματι",
  "βρειτε το δωματι",
  "βρες δωματι",
  "διαθεσιμοτητα",
  "trouvez votre chambre",
  "trouver votre chambre",
  "trouver une chambre",
  "disponibilite",
  "finde dein zimmer",
  "finden sie ihr zimmer",
  "zimmer finden",
  "verfugbarkeit",
  "trova la tua camera",
  "trova camera",
  "disponibilita",
  "encuentra tu habitacion",
  "encontrar habitacion",
  "disponibilidad",
  "odani bul",
  "oda bul",
  "musaitlik",
  "uygunluk",
] as const;

const BOOKING_PATTERNS = [
  "book now",
  "book direct",
  "booking",
  "direct booking",
  "reserve now",
  "reservation",
  "κρατηση",
  "reserver",
  "reservation",
  "buchen",
  "buchung",
  "prenota",
  "prenotazione",
  "reservar",
  "reserva",
  "rezervasyon",
] as const;

export function normalizeRoomFinderCtaLabel(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .toLocaleLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function isExplicitBookingLabel(label: string) {
  const normalized = normalizeRoomFinderCtaLabel(label);
  return BOOKING_PATTERNS.some((pattern) => normalized.includes(pattern));
}

export function isRoomFinderDiscoveryLabel(label: string) {
  const normalized = normalizeRoomFinderCtaLabel(label);
  if (!normalized || isExplicitBookingLabel(normalized)) return false;
  return DISCOVERY_PATTERNS.some((pattern) => normalized.includes(pattern));
}

export function normalizeRoomFinderLanguage(value?: string | null): RoomFinderSiteLanguage {
  const candidate = value?.toLowerCase().split("-")[0] as RoomFinderSiteLanguage | undefined;
  return candidate && SUPPORTED_LANGUAGES.includes(candidate) ? candidate : "en";
}

export function roomFinderHrefForLanguage(value?: string | null) {
  return ROOM_FINDER_HREFS[normalizeRoomFinderLanguage(value)];
}
