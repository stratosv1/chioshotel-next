import type { RoomCategoryId } from "@/lib/booking-core/category-from-prices";

/**
 * Factual room-category data shared by the room cards and the room JSON-LD.
 * Only owner-confirmed facts belong here: bed setups for economy and family
 * were confirmed by the owner; ground/first floor keep the long-standing
 * "double + extra bed" wording already used on the site.
 */

export type RoomFactsLocale = "en" | "el" | "fr" | "de" | "it" | "es" | "tr" | "pl";

export type AmenityKey = "ac" | "wifi" | "bathroom" | "fridge" | "tv" | "kitchen";

type BedSpec = { type: string; count: number };

export type RoomCategoryFacts = {
  id: RoomCategoryId;
  maxGuests: number;
  minGuests: number;
  sizeM2?: { min: number; max: number };
  /** Confirmed bed setup for schema; undefined = not stated in schema. */
  beds?: BedSpec[];
  amenities: AmenityKey[];
  schemaType: "HotelRoom" | "Suite";
};

export const roomCategoryFacts: Record<RoomCategoryId, RoomCategoryFacts> = {
  "economy-double": {
    id: "economy-double",
    minGuests: 1,
    maxGuests: 2,
    sizeM2: { min: 16, max: 16 },
    beds: [{ type: "Double bed", count: 1 }],
    amenities: ["ac", "wifi", "bathroom", "fridge", "tv"],
    schemaType: "HotelRoom",
  },
  "ground-floor": {
    id: "ground-floor",
    minGuests: 1,
    maxGuests: 3,
    sizeM2: { min: 30, max: 35 },
    amenities: ["ac", "wifi", "bathroom", "fridge", "tv"],
    schemaType: "HotelRoom",
  },
  "first-floor": {
    id: "first-floor",
    minGuests: 1,
    maxGuests: 4,
    sizeM2: { min: 30, max: 35 },
    amenities: ["ac", "wifi", "bathroom", "fridge", "tv"],
    schemaType: "HotelRoom",
  },
  "family-apartments": {
    id: "family-apartments",
    minGuests: 1,
    maxGuests: 4,
    sizeM2: { min: 40, max: 45 },
    beds: [
      { type: "Double bed", count: 1 },
      { type: "Single bed", count: 2 },
    ],
    amenities: ["ac", "wifi", "bathroom", "kitchen", "tv"],
    schemaType: "Suite",
  },
};

/** Card ids are "economy-double" or, on the Polish page, "pl-economy-double". */
export function toRoomCategoryId(cardId: string): RoomCategoryId | null {
  const id = cardId.replace(/^pl-/, "");
  return id in roomCategoryFacts ? (id as RoomCategoryId) : null;
}

export const bedLabels: Record<RoomCategoryId, Record<RoomFactsLocale, string>> = {
  "economy-double": {
    en: "1 double bed",
    el: "1 διπλό κρεβάτι",
    fr: "1 lit double",
    de: "1 Doppelbett",
    it: "1 letto matrimoniale",
    es: "1 cama doble",
    tr: "1 çift kişilik yatak",
    pl: "1 łóżko podwójne",
  },
  "ground-floor": {
    en: "Double + extra bed",
    el: "Διπλό + extra κρεβάτι",
    fr: "Lit double + lit d'appoint",
    de: "Doppelbett + Zusatzbett",
    it: "Matrimoniale + letto extra",
    es: "Doble + cama extra",
    tr: "Çift kişilik + ek yatak",
    pl: "Podwójne + dostawka",
  },
  "first-floor": {
    en: "Double + extra bed",
    el: "Διπλό + extra κρεβάτι",
    fr: "Lit double + lit d'appoint",
    de: "Doppelbett + Zusatzbett",
    it: "Matrimoniale + letto extra",
    es: "Doble + cama extra",
    tr: "Çift kişilik + ek yatak",
    pl: "Podwójne + dostawka",
  },
  "family-apartments": {
    en: "1 double + 2 singles",
    el: "1 διπλό + 2 μονά",
    fr: "1 lit double + 2 lits simples",
    de: "1 Doppelbett + 2 Einzelbetten",
    it: "1 matrimoniale + 2 singoli",
    es: "1 cama doble + 2 individuales",
    tr: "1 çift + 2 tek kişilik yatak",
    pl: "1 podwójne + 2 pojedyncze",
  },
};

export const amenityLabels: Record<AmenityKey, Record<RoomFactsLocale, string>> = {
  ac: { en: "A/C", el: "A/C", fr: "Clim", de: "Klima", it: "A/C", es: "A/A", tr: "Klima", pl: "Klima" },
  wifi: { en: "Wi-Fi", el: "Wi-Fi", fr: "Wi-Fi", de: "WLAN", it: "Wi-Fi", es: "Wi-Fi", tr: "Wi-Fi", pl: "Wi-Fi" },
  bathroom: {
    en: "Private bathroom",
    el: "Ιδιωτικό μπάνιο",
    fr: "Salle de bain privée",
    de: "Eigenes Bad",
    it: "Bagno privato",
    es: "Baño privado",
    tr: "Özel banyo",
    pl: "Prywatna łazienka",
  },
  fridge: { en: "Fridge", el: "Ψυγείο", fr: "Réfrigérateur", de: "Kühlschrank", it: "Frigo", es: "Nevera", tr: "Buzdolabı", pl: "Lodówka" },
  tv: { en: "TV", el: "TV", fr: "TV", de: "TV", it: "TV", es: "TV", tr: "TV", pl: "TV" },
  kitchen: { en: "Full kitchen", el: "Πλήρης κουζίνα", fr: "Cuisine équipée", de: "Volle Küche", it: "Cucina completa", es: "Cocina completa", tr: "Tam mutfak", pl: "Pełna kuchnia" },
};

/** English schema names for amenityFeature (schema.org consumers expect stable names). */
export const amenitySchemaNames: Record<AmenityKey, string> = {
  ac: "Air conditioning",
  wifi: "Free Wi-Fi",
  bathroom: "Private bathroom",
  fridge: "Refrigerator",
  tv: "TV",
  kitchen: "Full kitchen",
};

export const roomCardUi: Record<RoomFactsLocale, { direct: string; perNight: string; from: string; view: string; bedAria: string }> = {
  en: { direct: "−10% direct booking", perNight: "/ night", from: "from", view: "View", bedAria: "Beds" },
  el: { direct: "−10% απευθείας κράτηση", perNight: "/ βράδυ", from: "από", view: "Δείτε", bedAria: "Κρεβάτια" },
  fr: { direct: "−10 % réservation directe", perNight: "/ nuit", from: "dès", view: "Voir", bedAria: "Lits" },
  de: { direct: "−10 % Direktbuchung", perNight: "/ Nacht", from: "ab", view: "Ansehen", bedAria: "Betten" },
  it: { direct: "−10% prenotazione diretta", perNight: "/ notte", from: "da", view: "Vedi", bedAria: "Letti" },
  es: { direct: "−10% reserva directa", perNight: "/ noche", from: "desde", view: "Ver", bedAria: "Camas" },
  tr: { direct: "Doğrudan rezervasyonda −%10", perNight: "/ gece", from: "", view: "İncele", bedAria: "Yataklar" },
  pl: { direct: "−10% rezerwacja bezpośrednia", perNight: "/ noc", from: "od", view: "Zobacz", bedAria: "Łóżka" },
};
