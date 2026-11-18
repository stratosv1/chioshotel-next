import type { RoomFinderLanguage } from "./room-finder-copy";

// Sales badges for the AI Room Finder result cards.
// Rule: a badge only appears when the data proves it, at most one ribbon per
// photo, and each ribbon kind is used on a single card of the result list, so
// five cards never repeat the same claim.

export type RoomCategoryKey = "economy" | "ground" | "upper" | "family";
export type RibbonKind = "lowest" | "popular" | "upper" | "ground" | "family";

type BadgeOffer = {
  roomNumber: number;
  directTotal: number;
  alternativeCheckin?: string;
  recoveryType?: "consolidated" | "split";
};

const CATEGORY_BY_ROOM: Record<number, RoomCategoryKey> = {
  1: "upper", 2: "economy", 3: "upper", 4: "upper", 5: "ground",
  6: "economy", 7: "ground", 8: "family", 9: "family", 10: "family",
};

const UNITS_PER_CATEGORY: Record<RoomCategoryKey, number> = { economy: 2, ground: 2, upper: 3, family: 3 };

export function roomCategory(roomNumber: number): RoomCategoryKey | null {
  return CATEGORY_BY_ROOM[Number(roomNumber)] ?? null;
}

type BedKind = "double" | "doubleSofa" | "doubleTwoSingles" | "doubleDoubleSofa";

const BED_BY_ROOM: Record<number, BedKind> = {
  1: "doubleTwoSingles", 2: "double", 3: "doubleSofa", 4: "doubleSofa", 5: "doubleSofa",
  6: "double", 7: "doubleSofa", 8: "doubleTwoSingles", 9: "doubleTwoSingles", 10: "doubleDoubleSofa",
};

const BED_LABELS: Record<BedKind, Record<RoomFinderLanguage, string>> = {
  double: { el: "1 διπλό κρεβάτι", en: "1 double bed", de: "1 Doppelbett", fr: "1 lit double", it: "1 letto matrimoniale", es: "1 cama doble", tr: "1 çift kişilik yatak" },
  doubleSofa: { el: "1 διπλό + καναπές-κρεβάτι", en: "1 double + sofa bed", de: "1 Doppelbett + Schlafsofa", fr: "1 lit double + canapé-lit", it: "1 matrimoniale + divano letto", es: "1 cama doble + sofá cama", tr: "1 çift kişilik yatak + çekyat" },
  doubleTwoSingles: { el: "1 διπλό + 2 μονά", en: "1 double + 2 single beds", de: "1 Doppelbett + 2 Einzelbetten", fr: "1 lit double + 2 lits simples", it: "1 matrimoniale + 2 singoli", es: "1 cama doble + 2 individuales", tr: "1 çift + 2 tek kişilik yatak" },
  doubleDoubleSofa: { el: "1 διπλό + διπλός καναπές-κρεβάτι", en: "1 double + double sofa bed", de: "1 Doppelbett + Doppel-Schlafsofa", fr: "1 lit double + canapé-lit double", it: "1 matrimoniale + divano letto matrimoniale", es: "1 cama doble + sofá cama doble", tr: "1 çift kişilik yatak + çift kişilik çekyat" },
};

export function bedLabel(roomNumber: number, language: RoomFinderLanguage) {
  const kind = BED_BY_ROOM[Number(roomNumber)];
  return kind ? BED_LABELS[kind][language] : null;
}

/** Feature text that repeats the bed info, so the plain feature line can skip it. */
export const BED_FEATURE_PATTERN = /κρεβ|καναπ|\bbed|sofa|bett|\blits?\b|canap|letto|divano|cama|sofá|yatak|çekyat/iu;

export const RIBBON_LABELS: Record<RibbonKind, Record<RoomFinderLanguage, string>> = {
  lowest: { el: "Χαμηλότερη τιμή", en: "Lowest price", de: "Günstigster Preis", fr: "Prix le plus bas", it: "Prezzo più basso", es: "Precio más bajo", tr: "En düşük fiyat" },
  popular: { el: "Δημοφιλής επιλογή", en: "Popular choice", de: "Beliebte Wahl", fr: "Choix populaire", it: "Scelta popolare", es: "Opción popular", tr: "Popüler seçim" },
  upper: { el: "Θέα από όροφο", en: "Upper-floor views", de: "Blick vom Obergeschoss", fr: "Vue depuis l’étage", it: "Vista dal piano superiore", es: "Vistas desde la planta alta", tr: "Üst kat manzarası" },
  ground: { el: "Χωρίς σκάλες · κήπος", en: "No stairs · garden", de: "Ohne Treppen · Garten", fr: "Sans escaliers · jardin", it: "Senza scale · giardino", es: "Sin escaleras · jardín", tr: "Merdivensiz · bahçe" },
  family: { el: "Ευρύχωρο · πλήρης κουζίνα", en: "Spacious · full kitchen", de: "Geräumig · volle Küche", fr: "Spacieux · cuisine complète", it: "Spazioso · cucina completa", es: "Amplio · cocina completa", tr: "Geniş · tam mutfak" },
};

export const RIBBON_STYLES: Record<RibbonKind, string> = {
  lowest: "bg-[#3b6d11]",
  popular: "bg-[#a32d2d]",
  upper: "bg-[#185fa5]",
  ground: "bg-[#0f6e56]",
  family: "bg-[#854f0b]",
};

export const RIBBON_ICONS: Record<RibbonKind, string> = {
  lowest: "€",
  popular: "🔥",
  upper: "🌿",
  ground: "🚪",
  family: "🏡",
};

export const ONLY_ONE_LABEL: Record<RoomFinderLanguage, string> = {
  el: "Μόνο 1 τέτοιο δωμάτιο διαθέσιμο",
  en: "Only 1 room like this left",
  de: "Nur noch 1 solches Zimmer frei",
  fr: "Plus qu’une chambre de ce type",
  it: "Solo 1 camera di questo tipo disponibile",
  es: "Solo queda 1 habitación así",
  tr: "Bu tipte yalnızca 1 oda kaldı",
};

export const YOU_SAVE_LABEL: Record<RoomFinderLanguage, string> = {
  el: "Εξοικονομείτε",
  en: "You save",
  de: "Sie sparen",
  fr: "Vous économisez",
  it: "Risparmiate",
  es: "Ahorra",
  tr: "Kazancınız",
};

export function guestsLabel(language: RoomFinderLanguage, n: number) {
  switch (language) {
    case "el": return `${n} ${n === 1 ? "άτομο" : "άτομα"}`;
    case "de": return `${n} ${n === 1 ? "Person" : "Personen"}`;
    case "fr": return `${n} ${n === 1 ? "personne" : "personnes"}`;
    case "it": return `${n} ${n === 1 ? "persona" : "persone"}`;
    case "es": return `${n} ${n === 1 ? "persona" : "personas"}`;
    case "tr": return `${n} kişi`;
    default: return `${n} ${n === 1 ? "guest" : "guests"}`;
  }
}

export function perPersonLabel(language: RoomFinderLanguage, amount: string) {
  switch (language) {
    case "el": return `${amount} / άτομο / βράδυ`;
    case "de": return `${amount} pro Person/Nacht`;
    case "fr": return `${amount} par personne/nuit`;
    case "it": return `${amount} a persona a notte`;
    case "es": return `${amount} por persona/noche`;
    case "tr": return `Kişi başı gecelik ${amount}`;
    default: return `${amount} per person per night`;
  }
}

export type CardBadges = { ribbon?: RibbonKind; onlyOne?: boolean };

/**
 * One ribbon per card, each kind on one card only:
 * lowest price → popular category → own category strength (upper/ground/family).
 * "Only 1 left" when the result list holds a single room of a category that has more units.
 */
export function computeCardBadges<T extends BadgeOffer>(offers: T[], popularCategory: RoomCategoryKey | null, keyOf: (offer: T) => string) {
  const result = new Map<string, CardBadges>();
  const regular = offers.filter(offer => !offer.recoveryType && !offer.alternativeCheckin && roomCategory(offer.roomNumber));
  const used = new Set<string>();
  const give = (offer: T | undefined, ribbon: RibbonKind) => {
    if (!offer) return;
    const key = keyOf(offer);
    if (used.has(key)) return;
    used.add(key);
    result.set(key, { ...result.get(key), ribbon });
  };

  if (regular.length >= 2) {
    const cheapest = [...regular].sort((a, b) => a.directTotal - b.directTotal)[0];
    give(cheapest, "lowest");
  }
  if (popularCategory) {
    give(regular.find(offer => roomCategory(offer.roomNumber) === popularCategory && !used.has(keyOf(offer))), "popular");
  }
  for (const category of ["upper", "ground", "family"] as const) {
    if (category === popularCategory) continue;
    give(regular.find(offer => roomCategory(offer.roomNumber) === category && !used.has(keyOf(offer))), category);
  }

  const counts = new Map<RoomCategoryKey, number>();
  for (const offer of regular) {
    const category = roomCategory(offer.roomNumber)!;
    counts.set(category, (counts.get(category) || 0) + 1);
  }
  for (const offer of regular) {
    const category = roomCategory(offer.roomNumber)!;
    if (counts.get(category) === 1 && UNITS_PER_CATEGORY[category] > 1) {
      const key = keyOf(offer);
      result.set(key, { ...result.get(key), onlyOne: true });
    }
  }
  return result;
}
