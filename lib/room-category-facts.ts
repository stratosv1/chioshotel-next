import type { RoomCategoryId } from "@/lib/booking-core/category-from-prices";

/**
 * Factual room-category data shared by the room cards and the room JSON-LD.
 * Only owner-confirmed facts belong here: bed setups confirmed by the owner. Schema `beds` is set only where every
 * room in the category has the same setup (economy, ground floor); first floor
 * (Room 1 differs) and family (Apartment 10 differs) keep the long-standing
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
    beds: [
      { type: "Double bed", count: 1 },
      { type: "Sofa bed", count: 1 },
    ],
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
    en: "1 double + 1 sofa bed",
    el: "1 διπλό + 1 καναπές-κρεβάτι",
    fr: "1 lit double + 1 canapé-lit",
    de: "1 Doppelbett + 1 Schlafsofa",
    it: "1 matrimoniale + 1 divano letto",
    es: "1 cama doble + 1 sofá cama",
    tr: "1 çift kişilik yatak + 1 çekyat",
    pl: "1 podwójne + 1 sofa rozkładana",
  },
  "first-floor": {
    en: "1 double + sofa bed or 2 singles",
    el: "1 διπλό + καναπές-κρεβάτι ή 2 μονά",
    fr: "1 lit double + canapé-lit ou 2 simples",
    de: "1 Doppelbett + Schlafsofa oder 2 Einzelbetten",
    it: "1 matrimoniale + divano letto o 2 singoli",
    es: "1 doble + sofá cama o 2 individuales",
    tr: "1 çift + çekyat veya 2 tek yatak",
    pl: "1 podwójne + sofa lub 2 pojedyncze",
  },

  "family-apartments": {
    en: "1 double + 2 singles or sofa bed",
    el: "1 διπλό + 2 μονά ή καναπές-κρεβάτι",
    fr: "1 lit double + 2 simples ou canapé-lit",
    de: "1 Doppelbett + 2 Einzelbetten oder Schlafsofa",
    it: "1 matrimoniale + 2 singoli o divano letto",
    es: "1 doble + 2 individuales o sofá cama",
    tr: "1 çift + 2 tek yatak veya çekyat",
    pl: "1 podwójne + 2 pojedyncze lub sofa",
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
