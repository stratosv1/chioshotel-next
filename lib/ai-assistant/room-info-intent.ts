/**
 * Deterministic detection of a question about one numbered room ("details
 * for room 3", "λεπτομέρειες για το δωμάτιο 5", "room #11 pictures"), so the
 * Room Finder can answer it from the room catalog without the AI interpreter.
 */

// "room 3", "δωμάτιο 5", "apartment 8", "#11" … in the supported languages.
const ROOM_REFERENCE = /(?:room|rooms|δωμάτιο|δωματιο|δωμάτια|διαμέρισμα|διαμερισμα|apartment|apt|zimmer|apartment|chambre|appartement|camera|appartamento|habitación|habitacion|apartamento|oda|daire)\s*(?:no\.?|nr\.?|n°|#|νο\.?|αρ\.?|number|numero|número)?\s*#?\s*(\d{1,2})\b|#\s*(\d{1,2})\b/iu;

// The guest wants to know about the room, not to book it or change a count.
const INFO_WORDS = /(detail|info|picture|photo|image|pic\b|pics\b|facilit|amenit|describe|description|look like|tell me (?:more )?about|what is .* like|show me|λεπτομ[έε]ρ|πληροφορ|φωτογραφ|φώτο|φωτο|εικ[όο]ν|παροχ|περιγρα|πες μου|πώς είναι|πως ειναι|τι έχει|τι εχει|δείξε|δειξε|bild|foto|details|beschreib|ausstattung|zeig|détail|photo|équipement|décri|montre|dettagl|immagin|servizi|mostra|detalle|imagen|servicio|muestr|describ|bilgi|fotoğraf|resim|özellik|göster)/iu;

export type RoomInfoRequest = { roomNumber: number; exists: boolean };

// Booking facts in the same message (a date, nights, guests) go to the AI
// interpreter instead, so a booking request is never answered with room info.
const BOOKING_FACTS = /\d{1,2}\s*[\/.\-]\s*\d{1,2}|\b\d+\s*(?:nights?|νύχτ|νυχτ|βράδ|βραδ|διανυκτ|nächte|nuits?|notti|noches|gece|people|persons?|guests?|adults?|άτομ|ατομ|personen|gäste|personnes|persone|personas|kişi)/iu;

/** A question about one numbered room, or null. */
export function detectRoomInfoRequest(text: string): RoomInfoRequest | null {
  if (BOOKING_FACTS.test(text) || text.trim().split(/\s+/).length > 14) return null;
  const match = text.match(ROOM_REFERENCE);
  if (!match || !INFO_WORDS.test(text)) return null;
  const roomNumber = Number(match[1] || match[2]);
  if (!Number.isInteger(roomNumber)) return null;
  return { roomNumber, exists: roomNumber >= 1 && roomNumber <= 10 };
}
