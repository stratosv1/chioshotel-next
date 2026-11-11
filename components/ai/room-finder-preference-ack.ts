import type { RoomFinderPreference } from "@/lib/ai-assistant/room-finder-types";
import type { RoomFinderLanguage } from "./room-finder-copy";
import { roomsWithTrait, traitLabel } from "./room-finder-sales-intelligence";

/**
 * Ref 3: a preference the guest states ("with kitchen", "no stairs") is
 * confirmed before the next booking question, with the rooms that have it.
 * Things every room has (private bathroom, A/C, Wi-Fi) are answered as such,
 * from the verified common-amenities facts. Nothing claims availability.
 */

type AckCopy = {
  noted: (labels: string) => string;
  rooms: string;
  first: string;
  cleared: string;
  everyRoom: string;
};

const COPY: Record<RoomFinderLanguage, AckCopy> = {
  el: {
    noted: labels => `Σημείωσα: ${labels}.`,
    rooms: "δωμάτια",
    first: "Αν είναι διαθέσιμα για τις ημερομηνίες σας, θα σας τα δείξω πρώτα, χωρίς να κρύψω τα υπόλοιπα.",
    cleared: "Εντάξει, αφαίρεσα τις προτιμήσεις σας.",
    everyRoom: "Όλα τα δωμάτια και διαμερίσματα έχουν ιδιωτικό μπάνιο με ντους, κλιματισμό και δωρεάν Wi‑Fi.",
  },
  en: {
    noted: labels => `Noted: ${labels}.`,
    rooms: "rooms",
    first: "If they are available for your dates, I’ll show them first, without hiding the others.",
    cleared: "OK, I removed your preferences.",
    everyRoom: "Every room and apartment has a private bathroom with shower, air conditioning and free Wi‑Fi.",
  },
  de: {
    noted: labels => `Vermerkt: ${labels}.`,
    rooms: "Zimmer",
    first: "Wenn sie für Ihre Daten frei sind, zeige ich sie zuerst, ohne die anderen auszublenden.",
    cleared: "In Ordnung, ich habe Ihre Wünsche entfernt.",
    everyRoom: "Alle Zimmer und Apartments haben ein eigenes Bad mit Dusche, Klimaanlage und kostenloses WLAN.",
  },
  fr: {
    noted: labels => `C’est noté : ${labels}.`,
    rooms: "chambres",
    first: "Si elles sont disponibles à vos dates, je vous les montrerai en premier, sans masquer les autres.",
    cleared: "D’accord, j’ai retiré vos préférences.",
    everyRoom: "Toutes les chambres et tous les appartements ont une salle de bain privée avec douche, la climatisation et le Wi‑Fi gratuit.",
  },
  it: {
    noted: labels => `Annotato: ${labels}.`,
    rooms: "camere",
    first: "Se sono disponibili per le vostre date, ve le mostrerò per prime, senza nascondere le altre.",
    cleared: "Va bene, ho rimosso le vostre preferenze.",
    everyRoom: "Tutte le camere e gli appartamenti hanno bagno privato con doccia, aria condizionata e Wi‑Fi gratuito.",
  },
  es: {
    noted: labels => `Anotado: ${labels}.`,
    rooms: "habitaciones",
    first: "Si están disponibles para sus fechas, se las mostraré primero, sin ocultar las demás.",
    cleared: "De acuerdo, he quitado sus preferencias.",
    everyRoom: "Todas las habitaciones y apartamentos tienen baño privado con ducha, aire acondicionado y Wi‑Fi gratis.",
  },
  tr: {
    noted: labels => `Not ettim: ${labels}.`,
    rooms: "odalar",
    first: "Tarihleriniz için müsaitlerse, diğerlerini gizlemeden önce bunları göstereceğim.",
    cleared: "Tamam, tercihlerinizi kaldırdım.",
    everyRoom: "Tüm oda ve dairelerde duşlu özel banyo, klima ve ücretsiz Wi‑Fi bulunur.",
  },
};

// Amenities every unit has (verified common-amenities knowledge).
const EVERY_ROOM_WORDS = /(bath|shower|toilet|wc\b|wi-?fi|wifi|internet|air ?con|a\/c|\bac\b|μπάνι|μπανι|ντους|τουαλέτ|κλιματισ|ίντερνετ|bad\b|badezimmer|dusche|klima|wlan|salle de bain|douche|climatis|bagno|doccia|aria condizionata|baño|ducha|aire acondicionado|banyo|duş|klima)/iu;

export function mentionsEveryRoomAmenity(text: string) {
  return EVERY_ROOM_WORDS.test(text);
}

/**
 * The confirmation for a preference change, or "" when nothing new was
 * added. `everyRoomAmenity` adds the "every room has…" line.
 */
export function preferenceAckMessage(
  language: RoomFinderLanguage,
  previous: readonly RoomFinderPreference[],
  next: readonly RoomFinderPreference[],
  everyRoomAmenity: boolean,
) {
  const copy = COPY[language] || COPY.en;
  const lines: string[] = [];
  const added = next.filter(preference => !previous.includes(preference));

  if (added.length) {
    lines.push(copy.noted(added.map(preference => traitLabel(language, preference)).join(", ")));
    lines.push(added
      .map(preference => `• ${traitLabel(language, preference)}: ${copy.rooms} ${roomsWithTrait(preference).join(", ")}`)
      .join("\n"));
  } else if (!next.length && previous.length) {
    lines.push(copy.cleared);
  }
  if (everyRoomAmenity) lines.push(copy.everyRoom);
  if (added.length) lines.push(copy.first);

  return lines.join("\n\n");
}
