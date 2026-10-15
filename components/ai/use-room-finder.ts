"use client";

import { FormEvent, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import { roomCatalogForLanguage, localizeRoomOffer } from "@/lib/ai-assistant/room-card-catalog";
import {
  encodeRoomFinderOfferSnapshot,
  ROOM_FINDER_OFFER_SNAPSHOT_MARKER,
  type RoomFinderOfferSnapshot,
} from "@/lib/ai-assistant/room-finder-offer-tracking";
import type { RoomFinderCommand, RoomFinderPreference } from "@/lib/ai-assistant/room-finder-types";
import type { RoomFinderLanguage } from "./room-finder-copy";
import { ROOM_FINDER_COPY } from "./room-finder-copy";
import { ROOM_FINDER_TONE } from "./room-finder-tone";
import { TURN_TIMING, type TurnPace } from "./room-finder-flow-helpers";
import {
  bookingFlowReducer,
  createInitialBookingFlowState,
  minimumRoomsForGuests,
  nextMissingGuestRoom,
  nightsBetween,
  resolveAssistantTurn,
  type BookingDraft,
  type FinderStep,
} from "./room-finder-booking-flow";
import {
  feasibleOffersForGroup,
  hasDistinctOfferPlan,
  roomOfferKey,
} from "./room-finder-offer-plan";
import { rewindToAssistantPrompt } from "./room-finder-conversation-history";
import {
  answerRoomPriceQuestion,
  answerRoomQuestion,
  roomInterestPriority,
  roomPreferenceScore,
} from "./room-finder-sales-intelligence";
import { fetchLongStayDiscount, longStayDiscountMessage } from "./room-finder-long-stay";
import { setRoomFinderTrackingFacts, type ChatItem, type MessageKind, type Reaction } from "./room-finder-chat-ui";
import type { RoomOffer } from "./room-finder-carousel";
import type { RoomChoice } from "./room-finder-selected-card";

export type { FinderStep } from "./room-finder-booking-flow";

const wait = (ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms));
const rid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

// Availability can take up to the server's 60s limit when inventory must be
// refreshed first, so the client waits a little longer than that. Fallback
// lookups are lighter and get a shorter limit. Without a timeout a stalled
// mobile connection would leave the guest on "searching" indefinitely.
const AVAILABILITY_TIMEOUT_MS = 65_000;
const FALLBACK_LOOKUP_TIMEOUT_MS = 30_000;

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { cache: "no-store", signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
}
const rank = (room: RoomOffer) => {
  const order = [2, 6, 5, 7, 1, 3, 4, 8, 9, 10];
  const index = order.indexOf(Number(room.roomNumber));
  return index < 0 ? 99 : index;
};

const INVENTORY_UNAVAILABLE: Record<RoomFinderLanguage, string> = {
  el: "Η live διαθεσιμότητα δεν μπορεί να επιβεβαιωθεί αυτή τη στιγμή. Τα στοιχεία που μου δώσατε παραμένουν αποθηκευμένα στη ροή. Δοκιμάστε ξανά ή επικοινωνήστε μαζί μας μέσω WhatsApp.",
  en: "Live availability cannot be confirmed right now. The details you already entered are still kept in this flow. Please try again or contact us on WhatsApp.",
  de: "Die Live-Verfügbarkeit kann momentan nicht bestätigt werden. Ihre bereits eingegebenen Angaben bleiben in dieser Suche erhalten. Versuchen Sie es erneut oder kontaktieren Sie uns über WhatsApp.",
  fr: "La disponibilité en direct ne peut pas être confirmée pour le moment. Les informations déjà saisies restent conservées dans cette recherche. Réessayez ou contactez-nous via WhatsApp.",
  it: "Al momento non posso confermare la disponibilità in tempo reale. I dati già inseriti restano conservati in questa ricerca. Riprovate oppure contattateci su WhatsApp.",
  es: "Ahora mismo no puedo confirmar la disponibilidad en tiempo real. Los datos que ya introdujeron se mantienen en esta búsqueda. Inténtenlo de nuevo o contáctennos por WhatsApp.",
  tr: "Canlı müsaitlik şu anda doğrulanamıyor. Daha önce girdiğiniz bilgiler bu aramada korunuyor. Tekrar deneyin veya WhatsApp üzerinden bize ulaşın.",
};

// Shown only when neither the AI interpreter nor the deterministic fallback
// could process the message. The guest's text is restored in the composer and
// the lead form below the message lets reception reply personally.
const INTERPRETER_UNAVAILABLE: Record<RoomFinderLanguage, string> = {
  el: "Συγγνώμη, αυτή τη στιγμή δεν μπορώ να επεξεργαστώ το μήνυμά σας αυτόματα. Το κείμενό σας παραμένει στο πεδίο για να το στείλετε ξανά. Αν προτιμάτε, αφήστε μας τα στοιχεία σας παρακάτω και η reception θα σας απαντήσει προσωπικά.",
  en: "Sorry, I can’t process your message automatically right now. Your text is still in the box so you can send it again. If you prefer, leave your details below and our reception will reply to you personally.",
  de: "Entschuldigung, ich kann Ihre Nachricht gerade nicht automatisch verarbeiten. Ihr Text steht noch im Eingabefeld, damit Sie ihn erneut senden können. Wenn Sie möchten, hinterlassen Sie unten Ihre Daten und unsere Rezeption antwortet Ihnen persönlich.",
  fr: "Désolé, je ne peux pas traiter votre message automatiquement pour le moment. Votre texte est toujours dans le champ pour que vous puissiez le renvoyer. Si vous préférez, laissez vos coordonnées ci-dessous et notre réception vous répondra personnellement.",
  it: "Spiacenti, al momento non riesco a elaborare automaticamente il vostro messaggio. Il testo è ancora nel campo per poterlo inviare di nuovo. Se preferite, lasciate i vostri dati qui sotto e la reception vi risponderà personalmente.",
  es: "Lo sentimos, ahora mismo no puedo procesar su mensaje automáticamente. Su texto sigue en el campo para que puedan enviarlo de nuevo. Si lo prefieren, dejen sus datos abajo y recepción les responderá personalmente.",
  tr: "Üzgünüz, mesajınızı şu anda otomatik olarak işleyemiyorum. Metniniz yeniden gönderebilmeniz için kutuda duruyor. İsterseniz bilgilerinizi aşağıya bırakın, resepsiyonumuz size kişisel olarak yanıt versin.",
};

const CAPACITY_ROOMS: Record<RoomFinderLanguage, (guests: number, rooms: number) => string> = {
  el: (guests, rooms) => `Κάθε δωμάτιο φιλοξενεί έως 5 άτομα, οπότε για ${guests} άτομα χρειάζονται τουλάχιστον ${rooms} δωμάτια. Πόσα δωμάτια θέλετε;`,
  en: (guests, rooms) => `Each room hosts up to 5 guests, so ${guests} guests need at least ${rooms} rooms. How many rooms would you like?`,
  de: (guests, rooms) => `Jedes Zimmer bietet Platz für bis zu 5 Gäste, für ${guests} Gäste brauchen Sie also mindestens ${rooms} Zimmer. Wie viele Zimmer möchten Sie?`,
  fr: (guests, rooms) => `Chaque chambre accueille jusqu’à 5 personnes : pour ${guests} personnes, il faut au moins ${rooms} chambres. Combien de chambres souhaitez-vous ?`,
  it: (guests, rooms) => `Ogni camera ospita fino a 5 persone, quindi per ${guests} ospiti servono almeno ${rooms} camere. Quante camere desiderate?`,
  es: (guests, rooms) => `Cada habitación aloja hasta 5 personas, así que para ${guests} personas se necesitan al menos ${rooms} habitaciones. ¿Cuántas habitaciones desean?`,
  tr: (guests, rooms) => `Her oda en fazla 5 kişi alır; ${guests} kişi için en az ${rooms} oda gerekir. Kaç oda istersiniz?`,
};

const GUEST_TOTAL_ADJUSTED: Record<RoomFinderLanguage, (previous: number, next: number) => string> = {
  el: (previous, next) => `Σημείωση: με αυτή την κατανομή η αναζήτηση γίνεται για ${next} άτομα (είχατε αναφέρει ${previous}). Αν χρειάζεστε θέση για ${previous}, γράψτε μου «τελικά ${previous} άτομα».`,
  en: (previous, next) => `Note: with this allocation I’m searching for ${next} guests (you mentioned ${previous}). If you need space for ${previous}, write “actually ${previous} guests”.`,
  de: (previous, next) => `Hinweis: Mit dieser Aufteilung suche ich für ${next} Gäste (Sie hatten ${previous} genannt). Wenn Sie Platz für ${previous} brauchen, schreiben Sie „doch ${previous} Gäste“.`,
  fr: (previous, next) => `Remarque : avec cette répartition, je recherche pour ${next} personnes (vous en aviez indiqué ${previous}). S’il vous faut de la place pour ${previous}, écrivez « finalement ${previous} personnes ».`,
  it: (previous, next) => `Nota: con questa distribuzione cerco per ${next} ospiti (ne avevate indicati ${previous}). Se vi serve posto per ${previous}, scrivete « in realtà ${previous} ospiti ».`,
  es: (previous, next) => `Nota: con esta distribución busco para ${next} personas (habían indicado ${previous}). Si necesitan sitio para ${previous}, escriban « al final ${previous} personas ».`,
  tr: (previous, next) => `Not: Bu dağılımla ${next} kişi için arıyorum (${previous} kişi belirtmiştiniz). ${previous} kişilik yer gerekiyorsa “aslında ${previous} kişi” yazın.`,
};

const NO_BOOKING_CHANGE: Record<RoomFinderLanguage, string> = {
  el: "Είμαι εδώ αν χρειαστεί κάτι ακόμα 😊 Αν θέλετε να αλλάξουμε ημερομηνίες, δωμάτια ή άτομα, γράψτε μου π.χ. «τελικά 3 άτομα» ή «αναχώρηση 13/10». Για οτιδήποτε άλλο, η reception είναι στη διάθεσή σας στο τηλέφωνο ή στο WhatsApp.",
  en: "I’m here if you need anything else 😊 To change dates, rooms or guests, write for example “actually 3 guests” or “check-out 13/10”. For anything else, our reception is happy to help by phone or WhatsApp.",
  de: "Ich bin da, wenn Sie noch etwas brauchen 😊 Um Daten, Zimmer oder Gäste zu ändern, schreiben Sie z. B. „doch 3 Gäste“ oder „Check-out 13/10“. Für alles andere hilft Ihnen unsere Rezeption gern telefonisch oder über WhatsApp.",
  fr: "Je reste à votre disposition 😊 Pour modifier les dates, les chambres ou le nombre de personnes, écrivez par exemple « finalement 3 personnes » ou « check-out 13/10 ». Pour toute autre demande, notre réception vous aide volontiers par téléphone ou WhatsApp.",
  it: "Sono qui se serve altro 😊 Per modificare date, camere od ospiti scrivete per esempio « in realtà 3 ospiti » oppure « check-out 13/10 ». Per qualsiasi altra cosa la reception è a disposizione al telefono o su WhatsApp.",
  es: "Estoy aquí si necesitan algo más 😊 Para cambiar fechas, habitaciones o personas, escriban por ejemplo « al final 3 personas » o « check-out 13/10 ». Para cualquier otra cosa, recepción les ayuda encantada por teléfono o WhatsApp.",
  tr: "Başka bir şeye ihtiyacınız olursa buradayım 😊 Tarihleri, odaları veya kişi sayısını değiştirmek için örneğin “aslında 3 kişi” veya “çıkış 13/10” yazın. Diğer her konuda resepsiyonumuz telefonda veya WhatsApp’ta yardımcı olur.",
};

const CONTACT_ACKNOWLEDGED: Record<RoomFinderLanguage, string> = {
  el: "Βεβαίως 😊 Θα χαρούμε να σας εξυπηρετήσουμε. Μπορείτε να μας καλέσετε στο +30 694 476 4654 ή να μας στείλετε μήνυμα στο WhatsApp.",
  en: "Of course 😊 We’ll be happy to help. You can call us on +30 694 476 4654 or send us a message on WhatsApp.",
  de: "Natürlich 😊 Wir helfen Ihnen gerne. Sie können uns unter +30 694 476 4654 anrufen oder uns eine Nachricht über WhatsApp senden.",
  fr: "Bien sûr 😊 Nous serons ravis de vous aider. Vous pouvez nous appeler au +30 694 476 4654 ou nous envoyer un message sur WhatsApp.",
  it: "Certamente 😊 Saremo lieti di aiutarvi. Potete chiamarci al +30 694 476 4654 o inviarci un messaggio su WhatsApp.",
  es: "Por supuesto 😊 Estaremos encantados de ayudarles. Pueden llamarnos al +30 694 476 4654 o enviarnos un mensaje por WhatsApp.",
  tr: "Elbette 😊 Size yardımcı olmaktan memnuniyet duyarız. Bizi +30 694 476 4654 numaralı telefondan arayabilir veya WhatsApp’tan mesaj gönderebilirsiniz.",
};

const PREFERENCE_APPLIED: Record<RoomFinderLanguage, string> = {
  el: "Το σημείωσα. Θα βάλω πρώτα τις διαθέσιμες επιλογές που ταιριάζουν περισσότερο σε αυτό που ζητάτε, χωρίς να κρύψω τις υπόλοιπες.",
  en: "Noted. I’ll place the available options that best match your preference first, without hiding the other rooms.",
  de: "Vermerkt. Ich zeige zuerst die verfügbaren Optionen, die am besten zu Ihrem Wunsch passen, ohne andere Zimmer auszublenden.",
  fr: "C’est noté. Je placerai d’abord les options disponibles qui correspondent le mieux à votre préférence, sans masquer les autres chambres.",
  it: "Annotato. Mostrerò prima le opzioni disponibili più adatte alla vostra preferenza, senza nascondere le altre camere.",
  es: "Anotado. Mostraré primero las opciones disponibles que mejor encajan con su preferencia, sin ocultar las demás habitaciones.",
  tr: "Not ettim. Diğer odaları gizlemeden, tercihinize en çok uyan müsait seçenekleri önce göstereceğim.",
};

const ROOM_INTEREST_SAVED: Record<RoomFinderLanguage, (room: number) => string> = {
  el: room => `Σημείωσα ότι σας ενδιαφέρει το Δωμάτιο ${room}. Θα ελέγξω τη live διαθεσιμότητά του μόλις έχω τις ημερομηνίες και τα άτομα της διαμονής.`,
  en: room => `I’ve noted your interest in Room ${room}. I’ll check its live availability once I have the stay dates and guest details.`,
  de: room => `Ich habe Ihr Interesse an Zimmer ${room} vermerkt. Sobald Reisedaten und Gästeangaben vollständig sind, prüfe ich die Live-Verfügbarkeit.`,
  fr: room => `J’ai noté votre intérêt pour la chambre ${room}. Je vérifierai sa disponibilité en direct dès que les dates et le nombre de personnes seront renseignés.`,
  it: room => `Ho annotato il vostro interesse per la camera ${room}. Verificherò la disponibilità live non appena avrò le date e il numero di ospiti.`,
  es: room => `He anotado su interés por la habitación ${room}. Comprobaré su disponibilidad en vivo cuando tenga las fechas y el número de huéspedes.`,
  tr: room => `${room} numaralı odayla ilgilendiğinizi not ettim. Tarihler ve konuk bilgileri tamamlandığında canlı müsaitliğini kontrol edeceğim.`,
};

// Guest capacity of each room, for explaining why a room the guest asked for
// is not in the results.
const ROOM_MAX_GUESTS = new Map(roomCatalogForLanguage("en").map(room => [room.roomNumber, room.maxGuests]));

const ROOM_WORD: Record<RoomFinderLanguage, { room: string; apartment: string }> = {
  el: { room: "Δωμάτιο", apartment: "Διαμέρισμα" },
  en: { room: "Room", apartment: "Apartment" },
  de: { room: "Zimmer", apartment: "Apartment" },
  fr: { room: "La chambre", apartment: "L’appartement" },
  it: { room: "La camera", apartment: "L’appartamento" },
  es: { room: "La habitación", apartment: "El apartamento" },
  tr: { room: "Oda", apartment: "Daire" },
};

function roomName(language: RoomFinderLanguage, room: number) {
  const words = ROOM_WORD[language];
  return `${room >= 8 ? words.apartment : words.room} ${room}`;
}

const LOCALE: Record<RoomFinderLanguage, string> = {
  el: "el-GR", en: "en-GB", de: "de-DE", fr: "fr-FR", it: "it-IT", es: "es-ES", tr: "tr-TR",
};

function stayLabel(checkin: string, checkout: string) {
  const day = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
  return `${day(checkin)}–${day(checkout)}`;
}

function euros(value: number, language: RoomFinderLanguage) {
  return new Intl.NumberFormat(LOCALE[language], { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

// Single-room search for a room the guest asked for (from its page or by
// name): one clear answer about THAT room, then the other options.
const ROOM_INTEREST_AVAILABLE: Record<RoomFinderLanguage, (room: number) => string> = {
  el: room => `Καλά νέα! Το ${roomName("el", room)} είναι διαθέσιμο για τις ημερομηνίες σας. Το βλέπετε πρώτο παρακάτω, μαζί με τις άλλες διαθέσιμες επιλογές.`,
  en: room => `Good news! ${roomName("en", room)} is available for your dates. You’ll see it first below, together with the other available options.`,
  de: room => `Gute Nachrichten! ${roomName("de", room)} ist für Ihre Daten frei. Sie sehen es unten an erster Stelle, zusammen mit den anderen freien Optionen.`,
  fr: room => `Bonne nouvelle ! ${roomName("fr", room)} est disponible pour vos dates. Elle apparaît en premier ci-dessous, avec les autres options disponibles.`,
  it: room => `Buone notizie! ${roomName("it", room)} è disponibile per le vostre date. La trovate per prima qui sotto, insieme alle altre opzioni disponibili.`,
  es: room => `¡Buenas noticias! ${roomName("es", room)} está disponible para sus fechas. La verá primero abajo, junto con las demás opciones disponibles.`,
  tr: room => `İyi haber! ${roomName("tr", room)} tarihleriniz için müsait. Aşağıda ilk sırada, diğer müsait seçeneklerle birlikte görebilirsiniz.`,
};

const ROOM_INTEREST_NEARBY: Record<RoomFinderLanguage, (room: number, stay: string, alternative: string, price: string) => string> = {
  el: (room, stay, alt, price) => `Το ${roomName("el", room)} είναι κλεισμένο για ${stay}, αλλά είναι ελεύθερο για ${alt} (τιμή απευθείας κράτησης ${price}). Το βλέπετε πρώτο παρακάτω, μαζί με τα δωμάτια που είναι ελεύθερα για τις δικές σας ημερομηνίες.`,
  en: (room, stay, alt, price) => `${roomName("en", room)} is booked for ${stay}, but it’s free for ${alt} (direct price ${price}). You’ll see it first below, together with the rooms free for your own dates.`,
  de: (room, stay, alt, price) => `${roomName("de", room)} ist für ${stay} belegt, aber für ${alt} frei (Direktpreis ${price}). Sie sehen es unten an erster Stelle, zusammen mit den Zimmern, die für Ihre Daten frei sind.`,
  fr: (room, stay, alt, price) => `${roomName("fr", room)} est réservée pour ${stay}, mais libre pour ${alt} (tarif direct ${price}). Elle apparaît en premier ci-dessous, avec les chambres libres à vos dates.`,
  it: (room, stay, alt, price) => `${roomName("it", room)} è occupata per ${stay}, ma è libera per ${alt} (prezzo diretto ${price}). La trovate per prima qui sotto, insieme alle camere libere per le vostre date.`,
  es: (room, stay, alt, price) => `${roomName("es", room)} está reservada para ${stay}, pero está libre para ${alt} (precio directo ${price}). La verá primero abajo, junto con las habitaciones libres para sus fechas.`,
  tr: (room, stay, alt, price) => `${roomName("tr", room)} ${stay} için dolu, ancak ${alt} için boş (doğrudan fiyat ${price}). Aşağıda ilk sırada, kendi tarihleriniz için boş odalarla birlikte görebilirsiniz.`,
};

const ROOM_INTEREST_BOOKED: Record<RoomFinderLanguage, (room: number, stay: string) => string> = {
  el: (room, stay) => `Το ${roomName("el", room)} είναι δυστυχώς κλεισμένο για ${stay}. Για τις ημερομηνίες σας είναι ελεύθερα τα παρακάτω δωμάτια:`,
  en: (room, stay) => `Unfortunately ${roomName("en", room)} is booked for ${stay}. These rooms are free for your dates:`,
  de: (room, stay) => `Leider ist ${roomName("de", room)} für ${stay} belegt. Diese Zimmer sind für Ihre Daten frei:`,
  fr: (room, stay) => `Malheureusement, ${roomName("fr", room).toLowerCase()} est réservée pour ${stay}. Ces chambres sont libres à vos dates :`,
  it: (room, stay) => `Purtroppo ${roomName("it", room).toLowerCase()} è occupata per ${stay}. Queste camere sono libere per le vostre date:`,
  es: (room, stay) => `Lamentablemente, ${roomName("es", room).toLowerCase()} está reservada para ${stay}. Estas habitaciones están libres para sus fechas:`,
  tr: (room, stay) => `Maalesef ${roomName("tr", room)} ${stay} için dolu. Tarihleriniz için şu odalar boş:`,
};

// The room the guest asked for cannot host the whole party.
const ROOM_INTEREST_TOO_SMALL: Record<RoomFinderLanguage, (room: number, maxGuests: number, guests: number) => string> = {
  el: (room, max, guests) => `Το ${roomName("el", room)} φιλοξενεί έως ${max} ${max === 1 ? "άτομο" : "άτομα"}, οπότε δεν χωράει ${guests} άτομα. Σας προτείνω τα παρακάτω διαθέσιμα δωμάτια για τις ημερομηνίες σας.`,
  en: (room, max, guests) => `${roomName("en", room)} sleeps up to ${max}, so it can’t host ${guests} guests. Here are the rooms available for your dates.`,
  de: (room, max, guests) => `${roomName("de", room)} bietet Platz für bis zu ${max} Personen, also nicht für ${guests}. Hier sind die freien Zimmer für Ihre Daten.`,
  fr: (room, max, guests) => `${roomName("fr", room)} accueille jusqu’à ${max} personnes, elle ne convient donc pas pour ${guests}. Voici les chambres disponibles pour vos dates.`,
  it: (room, max, guests) => `${roomName("it", room)} ospita fino a ${max} persone, quindi non è adatta a ${guests}. Ecco le camere disponibili per le vostre date.`,
  es: (room, max, guests) => `${roomName("es", room)} admite hasta ${max} personas, así que no sirve para ${guests}. Estas son las habitaciones disponibles para sus fechas.`,
  tr: (room, max, guests) => `${roomName("tr", room)} en fazla ${max} kişiliktir, ${guests} kişi için uygun değil. Tarihleriniz için müsait odalar aşağıda.`,
};

// Guest question when the booking is one room: "how many guests", without
// numbering the room ("room 1" read like Room 1 to guests who came for Room 5).
const GUESTS_SINGLE_ROOM: Record<RoomFinderLanguage, string> = {
  el: "Για πόσα άτομα;",
  en: "How many guests?",
  de: "Für wie viele Personen?",
  fr: "Pour combien de personnes ?",
  it: "Per quante persone?",
  es: "¿Para cuántas personas?",
  tr: "Kaç kişi için?",
};


// First message when the guest arrives from a room's "Check availability"
// button: the room is remembered and checked first once dates are known.
const ROOM_FROM_LINK: Record<RoomFinderLanguage, (room: number) => string> = {
  el: room => `Βλέπω ότι σας ενδιαφέρει το ${roomName("el", room)}. Πείτε μου πότε θέλετε να έρθετε και για πόσα άτομα, και θα σας δείξω αμέσως αν είναι διαθέσιμο και σε ποια τιμή.`,
  en: room => `I see you’re interested in ${roomName("en", room)}. Tell me your dates and how many guests, and I’ll show you straight away whether it’s available and at what price.`,
  de: room => `Sie interessieren sich für ${roomName("de", room)}. Nennen Sie mir Ihre Reisedaten und die Anzahl der Gäste, dann zeige ich Ihnen sofort Verfügbarkeit und Preis.`,
  fr: room => `Vous vous intéressez à ${roomName("fr", room).toLowerCase()}. Indiquez-moi vos dates et le nombre de personnes, et je vous montre tout de suite sa disponibilité et son prix.`,
  it: room => `Vedo che vi interessa ${roomName("it", room).toLowerCase()}. Indicatemi le date e il numero di ospiti e vi mostro subito disponibilità e prezzo.`,
  es: room => `Veo que le interesa ${roomName("es", room).toLowerCase()}. Dígame sus fechas y cuántas personas, y le muestro enseguida si está disponible y a qué precio.`,
  tr: room => `${roomName("tr", room)} ile ilgilendiğinizi görüyorum. Tarihlerinizi ve kişi sayısını yazın, müsaitliğini ve fiyatını hemen göstereyim.`,
};

const ROOM_INTEREST_UNAVAILABLE: Record<RoomFinderLanguage, (room: number) => string> = {
  el: room => `Το Δωμάτιο ${room} δεν εμφανίζεται διαθέσιμο στα live αποτελέσματα για αυτά τα στοιχεία. Σας δείχνω τις διαθέσιμες εναλλακτικές χωρίς να αλλάξω την αναζήτησή σας.`,
  en: room => `Room ${room} is not shown as available in the live results for these details. I’m showing the available alternatives without changing your search.`,
  de: room => `Zimmer ${room} wird für diese Angaben in den Live-Ergebnissen nicht als verfügbar angezeigt. Ich zeige Ihnen die verfügbaren Alternativen, ohne Ihre Suche zu ändern.`,
  fr: room => `La chambre ${room} n’apparaît pas disponible dans les résultats en direct pour ces critères. Je vous montre les alternatives disponibles sans modifier votre recherche.`,
  it: room => `La camera ${room} non risulta disponibile nei risultati live per questi dati. Vi mostro le alternative disponibili senza modificare la ricerca.`,
  es: room => `La habitación ${room} no aparece disponible en los resultados en vivo para estos datos. Les muestro las alternativas disponibles sin modificar la búsqueda.`,
  tr: room => `${room} numaralı oda bu bilgiler için canlı sonuçlarda müsait görünmüyor. Aramanızı değiştirmeden müsait alternatifleri gösteriyorum.`,
};

const NEARBY_ALTERNATIVES: Record<RoomFinderLanguage, string> = {
  el: "Για τις ακριβείς ημερομηνίες δεν βρήκα διαθέσιμο δωμάτιο, αλλά βρήκα live διαθεσιμότητα πολύ κοντά στις ημερομηνίες σας. Οι κάρτες παρακάτω γράφουν καθαρά τη νέα περίοδο και οι ημερομηνίες αλλάζουν μόνο αν επιλέξετε μία από αυτές.",
  en: "I could not find a room for the exact dates, but I found live availability very close to them. Each card clearly shows the alternative period, and your dates change only if you select one.",
  de: "Für die exakten Daten habe ich kein Zimmer gefunden, aber sehr nahe daran gibt es Live-Verfügbarkeit. Jede Karte zeigt den alternativen Zeitraum deutlich; Ihre Daten ändern sich erst, wenn Sie eine Option auswählen.",
  fr: "Je n’ai pas trouvé de chambre pour les dates exactes, mais j’ai trouvé des disponibilités en direct très proches. Chaque carte indique clairement la période alternative et vos dates ne changent que si vous choisissez une option.",
  it: "Non ho trovato una camera per le date esatte, ma c’è disponibilità live molto vicina. Ogni scheda mostra chiaramente il periodo alternativo e le date cambiano solo se scegliete un’opzione.",
  es: "No encontré habitación para las fechas exactas, pero sí disponibilidad en vivo muy cerca de ellas. Cada tarjeta muestra claramente el periodo alternativo y sus fechas solo cambian si eligen una opción.",
  tr: "Tam tarihleriniz için oda bulamadım, ancak çok yakın tarihlerde canlı müsaitlik buldum. Her kart alternatif dönemi açıkça gösterir ve tarihleriniz yalnızca bir seçeneği seçerseniz değişir.",
};

const SALES_RECOVERY: Record<RoomFinderLanguage, string> = {
  el: "Δεν βρήκα ακριβώς την κατανομή δωματίων που ζητήσατε για όλη τη διαμονή. Πριν σας στείλω στη reception, έλεγξα ξανά τη live διαθεσιμότητα και βρήκα τις παρακάτω λύσεις για τις ίδιες ημερομηνίες, με όσο το δυνατόν λιγότερες αλλαγές.",
  en: "I could not match the exact room allocation for the whole stay. Before sending you to reception, I checked live availability again and found these options for the same dates, with as little room changing as possible.",
  de: "Die gewünschte Zimmeraufteilung ist nicht für den gesamten Aufenthalt verfügbar. Bevor ich Sie an die Rezeption verweise, habe ich die Live-Verfügbarkeit erneut geprüft und diese Lösungen für dieselben Daten mit möglichst wenigen Zimmerwechseln gefunden.",
  fr: "La répartition exacte des chambres n’est pas disponible pour tout le séjour. Avant de vous orienter vers la réception, j’ai revérifié les disponibilités en direct et trouvé ces solutions aux mêmes dates, avec le moins de changements possible.",
  it: "La distribuzione esatta delle camere non è disponibile per tutto il soggiorno. Prima di indirizzarvi alla reception, ho ricontrollato la disponibilità live e trovato queste soluzioni per le stesse date, con il minor numero possibile di cambi.",
  es: "La distribución exacta de habitaciones no está disponible durante toda la estancia. Antes de enviarles a recepción, he vuelto a comprobar la disponibilidad en vivo y encontré estas soluciones para las mismas fechas, con el menor número posible de cambios.",
  tr: "İstediğiniz oda dağılımı tüm konaklama boyunca müsait değil. Sizi resepsiyona yönlendirmeden önce canlı müsaitliği tekrar kontrol ettim ve aynı tarihler için mümkün olan en az oda değişikliğiyle bu çözümleri buldum.",
};

class InterpreterError extends Error {
  constructor(readonly code: string) {
    super(code);
    this.name = "InterpreterError";
  }
}

type InterpretResult = {
  command: RoomFinderCommand;
  degraded: boolean;
  cause: string;
};

// Shown as the guest's own message when they tap "try again" after a failed
// live-availability check.
const RETRY_SEARCH_LABEL: Record<RoomFinderLanguage, string> = {
  el: "Δοκιμάστε ξανά",
  en: "Try again",
  de: "Erneut versuchen",
  fr: "Réessayer",
  it: "Riprova",
  es: "Intentar de nuevo",
  tr: "Tekrar dene",
};

// Short replies that mean "try the same search again" after a failed live
// check. Recognized without the AI, so a retry works even when it is down.
const RETRY_WORDS = /^(?:ok(?:ay)?|ναι|οκ|εντάξει|ενταξει|ξανά|ξανα|(?:δοκίμασε|δοκιμασε|δοκιμάστε|δοκιμαστε|ψάξε|ψαξε|ψάξτε|ψαξτε)(?:\s+(?:ξανά|ξανα|πάλι|παλι))?|πάλι|παλι|(?:please\s+)?(?:try|search|check)(?:\s+it)?\s+again(?:\s+please)?|retry|again|yes|nochmal|noch\s*mal|erneut(?:\s+versuchen)?|ja|réessayer|reessayer|encore|oui|riprova|ancora|sì|si|de\s+nuevo|otra\s+vez|intentar\s+de\s+nuevo|tekrar(?:\s+dene)?|evet|tamam)[\s.!?]*$/iu;

// One quiet automatic retry covers short inventory refreshes and network
// blips before the guest ever sees a failure. Timeouts are not retried: the
// guest has already waited the full server limit.
const AVAILABILITY_AUTO_RETRY_DELAY_MS = 4_000;

function isRetryableAvailabilityFailure(error: unknown) {
  if (error instanceof Error && error.name === "AbortError") return false;
  if (error instanceof AvailabilityError) {
    return !["RATE_LIMITED", "INVALID_STAY"].includes(error.code);
  }
  return true;
}

class AvailabilityError extends Error {
  constructor(readonly code: string) {
    super(code);
    this.name = "AvailabilityError";
  }
}

function staffOfferContent(
  content: string,
  offerGroups: Array<{
    groupNumber: number;
    guests: number;
    offers: RoomOffer[];
  }>,
  searchDraft: BookingDraft,
) {
  const snapshot: RoomFinderOfferSnapshot = {
    version: 1,
    groups: offerGroups.map(group => ({
      groupNumber: group.groupNumber,
      guests: group.guests,
      offers: group.offers.map(offer => ({
        roomNumber: Number(offer.roomNumber),
        name: String(offer.name || `Room ${offer.roomNumber}`).slice(0, 160),
        checkin: offer.alternativeCheckin || searchDraft.checkin,
        checkout: offer.alternativeCheckout || searchDraft.checkout,
        originalTotal: Number(offer.originalTotal || 0),
        directTotal: Number(offer.directTotal || 0),
        saving: Number(offer.saving || 0),
        recoverySummary: offer.recoverySummary?.slice(0, 500) || undefined,
      })),
    })),
  };

  return encodeRoomFinderOfferSnapshot(content, snapshot);
}

function sortOffersForPreferences(
  roomOffers: RoomOffer[],
  preferences: RoomFinderPreference[],
  preferredRoomNumber: number | null,
) {
  const sorted = [...roomOffers].sort((left, right) => {
    const interestDifference = roomInterestPriority(Number(right.roomNumber), preferredRoomNumber)
      - roomInterestPriority(Number(left.roomNumber), preferredRoomNumber);
    const preferenceDifference = roomPreferenceScore(Number(right.roomNumber), preferences)
      - roomPreferenceScore(Number(left.roomNumber), preferences);
    return interestDifference || preferenceDifference || left.directTotal - right.directTotal || rank(left) - rank(right);
  });
  const bestScore = sorted.length ? roomPreferenceScore(Number(sorted[0].roomNumber), preferences) : 0;
  return sorted.map((offer, index) => {
    const requested = roomInterestPriority(Number(offer.roomNumber), preferredRoomNumber) > 0 && !offer.recoveryType;
    return {
      ...offer,
      // Every card of the room the guest asked for (also on nearby dates).
      requested,
      recommended: !requested && index === 0 && preferences.length > 0 && bestScore > 0,
    };
  });
}

export function useRoomFinder(language: RoomFinderLanguage) {
  const copy = ROOM_FINDER_COPY[language];
  const tone = ROOM_FINDER_TONE[language];
  const [flow, dispatchFlow] = useReducer(bookingFlowReducer, undefined, createInitialBookingFlowState);
  const [messages, setMessages] = useState<ChatItem[]>([
    { id: rid(), role: "assistant", content: copy.welcome },
  ]);
  const [input, setInput] = useState("");
  const [offers, setOffers] = useState<RoomOffer[][]>([]);
  const [activeGroup, setActiveGroup] = useState(0);
  const [choices, setChoices] = useState<RoomChoice[]>([]);
  const [preferences, setPreferences] = useState<RoomFinderPreference[]>([]);
  const [preferredRoomNumber, setPreferredRoomNumber] = useState<number | null>(null);
  const [breakfast, setBreakfast] = useState(false);
  const [typing, setTyping] = useState(false);
  const [selectingOfferKey, setSelectingOfferKey] = useState<string | null>(null);
  // The last search that failed because live availability could not be
  // confirmed, so the guest can retry it without re-entering anything.
  const [failedSearch, setFailedSearch] = useState<{ draft: BookingDraft; roomInterest: number | null } | null>(null);
  // The last search that found no rooms, for the "notify me if these dates
  // open up" card.
  const [unavailableSearch, setUnavailableSearch] = useState<BookingDraft | null>(null);
  const turnLocked = useRef(false);
  const languageRef = useRef(language);
  const announcedLongStayKey = useRef<string | null>(null);
  // Internal note attached to the next assistant message in the staff inbox
  // only (never shown to the guest), e.g. why a turn used the fallback.
  const pendingStaffNote = useRef<string | null>(null);

  const { step, draft } = flow;
  const {
    stayDestination,
    destinationKind,
    checkin,
    checkout,
    roomCount,
    totalGuests,
    groups,
  } = draft;
  const guestTotal = totalGuests || groups.reduce((sum, guests) => sum + guests, 0);
  const nights = checkin && checkout ? Math.max(0, nightsBetween(checkin, checkout)) : 0;
  const canGoBack = step !== "destination" && step !== "checkin" && step !== "searching" && step !== "unavailable";
  const selectedKeys = useMemo(
    () => new Set(choices.map(choice => roomOfferKey(choice.offer))),
    [choices],
  );
  const capacityEligibleOffers = useMemo(
    () => offers.map((groupOffers, groupIndex) => {
      const guests = groups[groupIndex] || 0;
      return groupOffers.filter(offer => !offer.maxGuests || offer.maxGuests >= guests);
    }),
    [offers, groups],
  );
  const visibleOffers = useMemo(() => {
    const feasible = feasibleOffersForGroup(capacityEligibleOffers, activeGroup, selectedKeys);
    return sortOffersForPreferences(feasible, preferences, preferredRoomNumber);
  }, [capacityEligibleOffers, activeGroup, selectedKeys, preferences, preferredRoomNumber]);

  // Layout effect: runs before the chat messages' tracking effects of the same
  // render, so a message is stored together with the facts it produced.
  useLayoutEffect(() => {
    setRoomFinderTrackingFacts({
      step,
      checkin,
      checkout,
      roomCount: roomCount || null,
      guestTotal: guestTotal || null,
      groups: groups.filter(guests => guests > 0),
      selectedRooms: choices.map(choice => ({
        group: choice.group,
        guests: choice.guests,
        roomNumber: choice.offer.roomNumber || choice.offer.roomId,
        name: String(choice.offer.name || "").slice(0, 160),
        directTotal: Number(choice.offer.directTotal || 0),
      })),
      breakfast,
    });
  }, [step, checkin, checkout, roomCount, guestTotal, groups, choices, breakfast]);

  const add = (
    role: ChatItem["role"],
    content: string,
    kind: MessageKind = "normal",
    staffContent?: string,
  ) => {
    let trackedContent = staffContent;
    if (role === "assistant" && pendingStaffNote.current) {
      const base = staffContent || content;
      const note = `\n\n[staff] ${pendingStaffNote.current}`;
      // Keep an encoded offer snapshot (if any) at the very end so it still parses.
      const markerIndex = base.indexOf(ROOM_FINDER_OFFER_SNAPSHOT_MARKER);
      trackedContent = markerIndex >= 0
        ? `${base.slice(0, markerIndex)}${note}${base.slice(markerIndex)}`
        : `${base}${note}`;
      pendingStaffNote.current = null;
    }
    setMessages(current => [...current, { id: rid(), role, content, kind, staffContent: trackedContent }]);
  };

  const rewindConversation = (...promptContents: string[]) =>
    setMessages(current => rewindToAssistantPrompt(current, promptContents));

  function clearSearchSelectionState() {
    setOffers([]);
    setActiveGroup(0);
    setChoices([]);
    setBreakfast(false);
    setSelectingOfferKey(null);
  }

  async function beginUserTurn(
    content: string,
    kind: MessageKind = "normal",
    reaction: Reaction = "👍",
    pace: TurnPace = "normal",
  ) {
    if (turnLocked.current) return false;
    turnLocked.current = true;
    setTyping(true);
    const timing = TURN_TIMING[pace];
    const id = rid();
    setMessages(current => [...current, { id, role: "user", content, kind }]);
    await wait(timing.reaction);
    setMessages(current => current.map(message => (
      message.id === id ? { ...message, reaction } : message
    )));
    await wait(timing.after);
    return true;
  }

  const endUserTurn = () => {
    turnLocked.current = false;
    setTyping(false);
  };

  async function maybeAnnounceLongStay(nextDraft: BookingDraft) {
    if (!nextDraft.checkin || !nextDraft.checkout) return false;

    const key = `${nextDraft.checkin}:${nextDraft.checkout}`;
    if (announcedLongStayKey.current === key) return false;

    try {
      const info = await fetchLongStayDiscount(nextDraft.checkin, nextDraft.checkout);
      if (!info) return false;

      announcedLongStayKey.current = key;
      if (!info.eligible) return false;

      add("assistant", longStayDiscountMessage(language, info));
      return true;
    } catch (error) {
      console.error("Room Finder long-stay notice failed", error);
      return false;
    }
  }

  function reset() {
    // A language change before the guest has written anything starts a fresh
    // conversation in the new language (welcome included); later changes keep
    // the conversation and only relocalize the live offers.
    const guestHasWritten = messages.some(message => message.role === "user");
    if (languageRef.current !== language && guestHasWritten) {
      languageRef.current = language;
      setOffers(current => current.map(group => group.map(offer => localizeRoomOffer(offer, language)) as RoomOffer[]));
      setChoices(current => current.map(choice => ({
        ...choice,
        offer: localizeRoomOffer(choice.offer, language) as RoomOffer,
      })));
      setTyping(false);
      return;
    }

    languageRef.current = language;
    turnLocked.current = false;
    announcedLongStayKey.current = null;
    dispatchFlow({ type: "reset" });
    setMessages([{ id: rid(), role: "assistant", content: copy.welcome }]);
    setInput("");
    setPreferences([]);
    setPreferredRoomNumber(null);
    clearSearchSelectionState();
    setFailedSearch(null);
    setUnavailableSearch(null);
    setTyping(false);
  }

  // Called once when the page was opened from a room's availability button
  // (?room=N): remembers the room so live results show it first.
  function focusRoomFromLink(room: number) {
    if (!Number.isInteger(room) || room < 1 || room > 10) return;
    setPreferredRoomNumber(room);
    dispatchFlow({ type: "prefill_single_room" });
    add("assistant", ROOM_FROM_LINK[language](room));
  }

  async function retryAvailability() {
    if (!failedSearch || step !== "unavailable") return;
    const retry = failedSearch;
    if (!await beginUserTurn(RETRY_SEARCH_LABEL[language], "normal", "👍")) return;
    try {
      clearSearchSelectionState();
      await runAvailabilitySearch(retry.draft, retry.roomInterest);
    } finally {
      endUserTurn();
    }
  }

  function goBack() {
    if (turnLocked.current || !canGoBack) return;

    const previousStep = step;
    const nextFlow = bookingFlowReducer(flow, { type: "go_back" });
    if (nextFlow === flow) return;

    if (previousStep === "breakfast") {
      const lastChoice = choices[choices.length - 1];
      if (!lastChoice) return;
      setChoices(current => current.slice(0, -1));
      setActiveGroup(Math.max(0, lastChoice.group - 1));
      setBreakfast(false);
      setSelectingOfferKey(null);
      dispatchFlow({ type: "commit_turn", state: nextFlow });
      rewindConversation(
        // Multi-room recovery offers came with the sales-recovery message;
        // a single-room split stay came with the normal results message.
        String(lastChoice.offer.roomId || "").startsWith("recovery:")
          ? SALES_RECOVERY[language]
          : tone.results(lastChoice.group, lastChoice.guests, groups.length),
      );
      return;
    }

    if (previousStep === "complete") {
      const lastChoice = choices[choices.length - 1];
      setBreakfast(false);
      setSelectingOfferKey(null);
      dispatchFlow({ type: "commit_turn", state: nextFlow });
      if (lastChoice) rewindConversation(tone.selected(lastChoice.offer.name));
      return;
    }

    clearSearchSelectionState();
    if (!nextFlow.draft.checkout) announcedLongStayKey.current = null;
    dispatchFlow({ type: "commit_turn", state: nextFlow });

    switch (nextFlow.step) {
      case "checkin":
        rewindConversation(tone.invalidDate, copy.welcome);
        return;
      case "checkout":
        rewindConversation(tone.checkout);
        return;
      case "rooms":
        rewindConversation(tone.rooms);
        return;
      case "guests":
        rewindConversation(guestsPrompt(nextFlow.draft, nextMissingGuestRoom(nextFlow.draft) || 1));
        return;
      default:
        return;
    }
  }

  function editDates() {
    if (turnLocked.current || step === "searching") return;
    const nextFlow = bookingFlowReducer(flow, { type: "edit_dates" });
    clearSearchSelectionState();
    announcedLongStayKey.current = null;
    dispatchFlow({ type: "commit_turn", state: nextFlow });
    add("assistant", tone.invalidDate);
  }

  async function interpret(value: string, current: FinderStep): Promise<InterpretResult> {
    const recentMessages = messages.slice(-8).map(({ role, content }) => ({ role, content }));
    const requestBody = JSON.stringify({
      message: value,
      context: {
        language,
        currentStep: current,
        stayDestination: stayDestination || undefined,
        destinationKind: destinationKind || undefined,
        checkin: checkin || undefined,
        checkout: checkout || undefined,
        totalGuests: totalGuests || undefined,
        roomCount: roomCount || undefined,
        preferredRoomNumber: preferredRoomNumber || undefined,
        guestGroups: groups,
        currentRoom: current === "guests" ? nextMissingGuestRoom(draft) || undefined : undefined,
        preferences,
        recentMessages,
      },
    });

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 38_000);

    try {
      const response = await fetch("/api/ai-assistant/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: requestBody,
      });
      const data = await response.json().catch(() => null);
      if (response.ok && data?.command) {
        return {
          command: data.command as RoomFinderCommand,
          degraded: data.degraded === true,
          cause: String(data.cause || ""),
        };
      }
      throw new InterpreterError(String(data?.code || `HTTP_${response.status}`));
    } catch (error) {
      if (error instanceof InterpreterError) throw error;
      const aborted = error instanceof Error && error.name === "AbortError";
      throw new InterpreterError(aborted ? "CLIENT_TIMEOUT" : "NETWORK_ERROR");
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function findNearbyOffers(searchDraft: BookingDraft) {
    if (searchDraft.roomCount !== 1 || searchDraft.groups.length !== 1) return [] as RoomOffer[];

    const query = new URLSearchParams({
      checkin: searchDraft.checkin,
      checkout: searchDraft.checkout,
      guests: String(searchDraft.groups[0]),
      lang: language,
    });

    try {
      const response = await fetchWithTimeout(`/api/ai-room-finder/alternatives?${query}`, FALLBACK_LOOKUP_TIMEOUT_MS);
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload.alternatives)) return [];

      return payload.alternatives.flatMap((alternative: any) =>
        (Array.isArray(alternative?.offers) ? alternative.offers : []).map((offer: RoomOffer) => ({
          ...offer,
          alternativeCheckin: String(alternative.checkin || ""),
          alternativeCheckout: String(alternative.checkout || ""),
          alternativeShiftDays: Number(alternative.shiftDays || 0),
        })),
      ) as RoomOffer[];
    } catch {
      return [];
    }
  }

  async function findSalesRecoveryOffers(searchDraft: BookingDraft) {
    if (!searchDraft.roomCount || searchDraft.roomCount <= 1 || searchDraft.groups.length <= 1) {
      return [] as RoomOffer[];
    }

    const query = new URLSearchParams({
      checkin: searchDraft.checkin,
      checkout: searchDraft.checkout,
      groups: searchDraft.groups.join(","),
      lang: language,
    });

    try {
      const response = await fetchWithTimeout(`/api/ai-room-finder/sales-recovery?${query}`, FALLBACK_LOOKUP_TIMEOUT_MS);
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload.offers)) return [];
      return payload.offers as RoomOffer[];
    } catch (error) {
      console.error("Room Finder sales recovery request failed", error);
      return [];
    }
  }

  async function runAvailabilitySearch(
    searchDraft: BookingDraft,
    roomInterest = preferredRoomNumber,
  ) {
    dispatchFlow({
      type: "commit_turn",
      state: { step: "searching", draft: searchDraft },
    });
    setFailedSearch(null);
    setUnavailableSearch(null);
    add("assistant", tone.searching);
    setTyping(true);

    const searchAllGroups = () => Promise.all(searchDraft.groups.map(async guests => {
        const query = new URLSearchParams({
          checkin: searchDraft.checkin,
          checkout: searchDraft.checkout,
          guests: String(guests),
          lang: language,
          allowSplit: searchDraft.roomCount === 1 ? "1" : "0",
        });
        const response = await fetchWithTimeout(`/api/ai-room-finder/availability?${query}`, AVAILABILITY_TIMEOUT_MS);
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new AvailabilityError(String(payload?.code || "REQUEST_FAILED"));
        }
        return (Array.isArray(payload.offers) ? payload.offers : []) as RoomOffer[];
      }));

    try {
      let result: RoomOffer[][];
      try {
        result = await searchAllGroups();
      } catch (firstError) {
        if (!isRetryableAvailabilityFailure(firstError)) throw firstError;
        console.warn("Room Finder availability failed once; retrying", firstError);
        await wait(AVAILABILITY_AUTO_RETRY_DELAY_MS);
        result = await searchAllGroups();
      }

      const eligible = result.map((groupOffers, groupIndex) => {
        const guests = searchDraft.groups[groupIndex] || 0;
        return groupOffers.filter(offer => !offer.maxGuests || offer.maxGuests >= guests);
      });

      if (!hasDistinctOfferPlan(eligible)) {
        const recovery = await findSalesRecoveryOffers(searchDraft);
        if (recovery.length) {
          setOffers([recovery]);
          setActiveGroup(0);
          dispatchFlow({
            type: "commit_turn",
            state: { step: "selecting", draft: searchDraft },
          });
          const content = SALES_RECOVERY[language];
          const recoveryGuests = searchDraft.totalGuests
            || searchDraft.groups.reduce((sum, guests) => sum + guests, 0);
          add(
            "assistant",
            content,
            "offers",
            staffOfferContent(content, [{
              groupNumber: 1,
              guests: recoveryGuests,
              offers: sortOffersForPreferences(recovery, preferences, roomInterest),
            }], searchDraft),
          );
          return;
        }

        const nearby = await findNearbyOffers(searchDraft);
        if (nearby.length) {
          setOffers([nearby]);
          setActiveGroup(0);
          dispatchFlow({
            type: "commit_turn",
            state: { step: "selecting", draft: searchDraft },
          });
          const content = NEARBY_ALTERNATIVES[language];
          add(
            "assistant",
            content,
            "offers",
            staffOfferContent(content, [{
              groupNumber: 1,
              guests: searchDraft.groups[0] || 0,
              offers: sortOffersForPreferences(nearby, preferences, roomInterest),
            }], searchDraft),
          );
          return;
        }

        setOffers([]);
        setActiveGroup(0);
        dispatchFlow({
          type: "commit_turn",
          state: { step: "unavailable", draft: searchDraft },
        });
        setUnavailableSearch(searchDraft);
        add("assistant", tone.unavailable, "lead");
        return;
      }

      const singleRoom = searchDraft.groups.length === 1;
      const interestAvailable = Boolean(roomInterest)
        && eligible.some(groupOffers => groupOffers.some(offer => Number(offer.roomNumber) === roomInterest && !offer.recoveryType));
      let resultOffers = eligible;
      let content = tone.results(1, searchDraft.groups[0], searchDraft.groups.length);

      if (roomInterest && singleRoom) {
        const stay = stayLabel(searchDraft.checkin, searchDraft.checkout);
        const maxGuests = ROOM_MAX_GUESTS.get(roomInterest) || 0;
        const partySize = searchDraft.groups[0] || 0;
        if (interestAvailable) {
          content = ROOM_INTEREST_AVAILABLE[language](roomInterest);
        } else if (maxGuests && partySize > maxGuests) {
          content = ROOM_INTEREST_TOO_SMALL[language](roomInterest, maxGuests, partySize);
        } else {
          // The room is booked: look for the same room a few days earlier or
          // later before falling back to the other rooms.
          const sameRoomNearby = (await findNearbyOffers(searchDraft))
            .filter(offer => Number(offer.roomNumber) === roomInterest && !offer.recoveryType)
            .slice(0, 2);
          if (sameRoomNearby.length) {
            const first = sameRoomNearby[0];
            content = ROOM_INTEREST_NEARBY[language](
              roomInterest,
              stay,
              stayLabel(String(first.alternativeCheckin), String(first.alternativeCheckout)),
              euros(Number(first.directTotal), language),
            );
            resultOffers = [[...sameRoomNearby, ...(eligible[0] || [])]];
          } else {
            content = ROOM_INTEREST_BOOKED[language](roomInterest, stay);
          }
        }
      } else if (roomInterest && !interestAvailable) {
        add("assistant", ROOM_INTEREST_UNAVAILABLE[language](roomInterest));
      }

      setOffers(resultOffers);
      setActiveGroup(0);
      dispatchFlow({
        type: "commit_turn",
        state: { step: "selecting", draft: searchDraft },
      });
      const firstGroupOffers = sortOffersForPreferences(
        feasibleOffersForGroup(resultOffers, 0, new Set()),
        preferences,
        roomInterest,
      );
      add(
        "assistant",
        content,
        "offers",
        staffOfferContent(content, [{
          groupNumber: 1,
          guests: searchDraft.groups[0] || 0,
          offers: firstGroupOffers,
        }], searchDraft),
      );
    } catch (error) {
      console.error("Room Finder availability request failed", error);
      setOffers([]);
      setActiveGroup(0);
      dispatchFlow({
        type: "commit_turn",
        state: { step: "unavailable", draft: searchDraft },
      });
      setFailedSearch({ draft: searchDraft, roomInterest: roomInterest || null });
      add("assistant", INVENTORY_UNAVAILABLE[language], "lead");
    } finally {
      setTyping(false);
    }
  }

  async function applyCommand(command: RoomFinderCommand) {
    const knowledgeActions = command.actions.filter(action =>
      action.type === "answer_property_question" && typeof action.answer === "string" && action.answer.trim(),
    );
    for (const action of knowledgeActions) add("assistant", action.answer!.trim());

    const executableActions = command.actions.filter(action =>
      action.type !== "answer_property_question"
      && !(knowledgeActions.length > 0 && action.type === "no_change"),
    );
    if (!executableActions.length) return;

    const executableCommand = { ...command, actions: executableActions };
    const liveAvailabilityRequested = executableActions.some(action =>
      action.type === "request_live_availability",
    );

    if (executableActions.some(action => action.type === "acknowledge_contact")) {
      add("assistant", CONTACT_ACKNOWLEDGED[language], "contact");
      // Facts given in the same message ("I'll call you, we are 3 people")
      // are still applied; a pure contact message ends here.
      const hasFacts = executableActions.some(action =>
        !["acknowledge_contact", "no_change", "ask_clarification"].includes(action.type),
      );
      if (!hasFacts) return;
    }

    const preferenceAction = [...executableActions]
      .reverse()
      .find(action => action.type === "set_preferences");
    if (preferenceAction) setPreferences(preferenceAction.preferences || []);

    const roomInterestAction = [...executableActions]
      .reverse()
      .find(action =>
        action.type === "set_room_interest"
        && Number.isInteger(action.roomNumber)
        && Number(action.roomNumber) >= 1
        && Number(action.roomNumber) <= 10,
      );
    const roomInterestNumber = roomInterestAction?.roomNumber || null;
    if (roomInterestNumber) {
      setPreferredRoomNumber(roomInterestNumber);
      const hasOtherExecutableAction = executableActions.some(action =>
        action.type !== "set_room_interest" && action.type !== "no_change",
      );

      if (step === "selecting" && !hasOtherExecutableAction) {
        const matchingOffer = visibleOffers.find(offer => Number(offer.roomNumber) === roomInterestNumber);
        if (matchingOffer) {
          await commitOfferSelection(matchingOffer);
        } else {
          add("assistant", ROOM_INTEREST_UNAVAILABLE[language](roomInterestNumber));
        }
        return;
      }

      add("assistant", ROOM_INTEREST_SAVED[language](roomInterestNumber));
    }

    const resolution = resolveAssistantTurn(flow, executableCommand);
    const commandSetTotalGuests = executableActions.some(action => action.totalGuests != null);

    if (resolution.outcome.kind === "restart") {
      reset();
      return;
    }

    if (resolution.changed) clearSearchSelectionState();
    dispatchFlow({ type: "commit_turn", state: resolution.state });

    if (resolution.outcome.kind === "destination_mismatch") {
      add("assistant", tone.destinationMismatch(resolution.outcome.destination));
      return;
    }

    if (resolution.outcome.kind === "invalid_checkout") {
      add("assistant", tone.invalidCheckout);
      return;
    }

    if (resolution.outcome.kind === "clarification") {
      add("assistant", resolution.outcome.query, resolution.outcome.lead ? "lead" : "normal");
      return;
    }

    if (resolution.outcome.kind === "capacity") {
      add("assistant", CAPACITY_ROOMS[language](resolution.outcome.guests, resolution.outcome.minimumRooms));
      return;
    }

    if (resolution.outcome.kind === "unchanged") {
      // "Try again", "ok", or the same details again after a failed live
      // check: rerun that search instead of answering "nothing changed".
      if (failedSearch && step === "unavailable") {
        clearSearchSelectionState();
        await runAvailabilitySearch(failedSearch.draft, failedSearch.roomInterest);
        return;
      }
      if (
        liveAvailabilityRequested
        && resolution.state.draft.destinationKind !== "other"
        && resolution.state.draft.checkin
        && resolution.state.draft.checkout
        && resolution.state.draft.roomCount
        && resolution.state.draft.groups.length === resolution.state.draft.roomCount
      ) {
        clearSearchSelectionState();
        await runAvailabilitySearch(
          resolution.state.draft,
          roomInterestNumber || preferredRoomNumber,
        );
        return;
      }
      if (roomInterestNumber) return;
      add("assistant", preferenceAction ? PREFERENCE_APPLIED[language] : NO_BOOKING_CHANGE[language]);
      return;
    }

    const shouldCheckLongStay = resolution.outcome.kind === "ready"
      || (resolution.outcome.kind === "prompt" && ["rooms", "guests"].includes(resolution.outcome.field));
    if (shouldCheckLongStay) {
      const announced = await maybeAnnounceLongStay(resolution.state.draft);
      if (announced) await wait(220);
    }

    if (!commandSetTotalGuests) announceGuestTotalAdjustment(flow.draft, resolution.state.draft);

    if (resolution.outcome.kind === "ready") {
      await runAvailabilitySearch(
        resolution.state.draft,
        roomInterestNumber || preferredRoomNumber,
      );
      return;
    }

    switch (resolution.outcome.field) {
      case "checkin":
        add("assistant", tone.invalidDate);
        return;
      case "checkout":
        add("assistant", tone.checkout);
        return;
      case "rooms":
        add("assistant", roomsPrompt(resolution.state.draft));
        return;
      case "guests":
        add("assistant", guestsPrompt(resolution.state.draft, resolution.outcome.guestRoom || 1));
    }
  }

  function guestsPrompt(nextDraft: BookingDraft, guestRoom: number) {
    return nextDraft.roomCount === 1 ? GUESTS_SINGLE_ROOM[language] : tone.guests(guestRoom);
  }

  function roomsPrompt(nextDraft: BookingDraft) {
    const groupSize = nextDraft.totalGuests || 0;
    const minimumRooms = groupSize ? minimumRoomsForGuests(groupSize) : 1;
    return minimumRooms > 1 ? CAPACITY_ROOMS[language](groupSize, minimumRooms) : tone.rooms;
  }

  // When per-room answers add up to a different total than the guest stated
  // (e.g. 8 people, then 2 + 5), say so instead of silently dropping guests.
  function announceGuestTotalAdjustment(previous: BookingDraft, next: BookingDraft) {
    const before = previous.totalGuests || 0;
    const after = next.totalGuests || 0;
    if (!before || !after || before === after) return;
    if (next.groups.length !== next.roomCount) return;
    add("assistant", GUEST_TOTAL_ADJUSTED[language](before, after));
  }

  // `text` lets the page send a message the guest already typed, e.g. after
  // switching the conversation to the language they wrote in.
  async function submit(event?: FormEvent, text?: string) {
    event?.preventDefault();
    const value = (text ?? input).trim();
    if (!value || turnLocked.current || step === "searching") return;

    const current = step;
    setInput("");

    if (failedSearch && current === "unavailable" && RETRY_WORDS.test(value)) {
      const retry = failedSearch;
      if (!await beginUserTurn(value, "normal", "👍")) return;
      try {
        clearSearchSelectionState();
        await runAvailabilitySearch(retry.draft, retry.roomInterest);
      } finally {
        endUserTurn();
      }
      return;
    }

    const contextualOffers = choices.length
      ? choices.map(choice => choice.offer)
      : offers.flat();
    const questionAnswer = (contextualOffers.length > 0
      ? answerRoomPriceQuestion(
          value,
          language,
          contextualOffers,
          choices.length > 0,
        )
      : null) || (["selecting", "breakfast", "complete"].includes(current)
      ? answerRoomQuestion(value, language, [
          ...offers.flat(),
          ...choices.map(choice => choice.offer),
        ])
      : null);

    if (questionAnswer) {
      if (!await beginUserTurn(value, "normal", "👍")) return;
      add("assistant", questionAnswer);
      endUserTurn();
      return;
    }

    const promise = interpret(value, current);
    const kind: MessageKind = current === "checkin" || current === "checkout"
      ? "date"
      : current === "rooms"
        ? "room"
        : current === "guests"
          ? "guest"
          : "normal";

    if (!await beginUserTurn(value, kind, current === "rooms" ? "❤️" : "👍")) return;

    let result: InterpretResult;
    try {
      result = await promise;
    } catch (error) {
      console.error("Room Finder interpreter request failed", error);
      const code = error instanceof InterpreterError ? error.code : "UNKNOWN";
      setInput(currentValue => currentValue || value);
      pendingStaffNote.current = `Interpreter failed (${code}); the guest was offered the contact form.`;
      add("assistant", INTERPRETER_UNAVAILABLE[language], "lead");
      endUserTurn();
      return;
    }

    if (result.degraded) {
      pendingStaffNote.current = `AI interpreter unavailable (${result.cause || "AI_UNAVAILABLE"}); this turn used the deterministic fallback parser.`;
    }

    try {
      await applyCommand(result.command);
    } catch (error) {
      // A bug while applying an understood command is not an interpreter
      // failure: log it separately so it can be found and fixed.
      console.error("Room Finder could not apply the interpreted command", error);
      pendingStaffNote.current = `Client error while applying the command: ${error instanceof Error ? error.message : String(error)}`;
      add("assistant", INTERPRETER_UNAVAILABLE[language], "lead");
    } finally {
      pendingStaffNote.current = null;
      endUserTurn();
    }
  }

  async function chooseRooms(roomCountValue: number) {
    if (!await beginUserTurn(copy.roomLabel(roomCountValue), "room", "❤️")) return;

    try {
      const nextFlow = bookingFlowReducer(flow, {
        type: "choose_rooms",
        roomCount: roomCountValue,
      });
      dispatchFlow({ type: "commit_turn", state: nextFlow });

      if (nextFlow.step === "rooms" && nextFlow.draft.totalGuests) {
        add("assistant", CAPACITY_ROOMS[language](
          nextFlow.draft.totalGuests,
          minimumRoomsForGuests(nextFlow.draft.totalGuests),
        ));
        return;
      }

      const announced = await maybeAnnounceLongStay(nextFlow.draft);
      if (announced) await wait(220);

      if (nextFlow.step === "searching") {
        await runAvailabilitySearch(nextFlow.draft);
      } else {
        add("assistant", guestsPrompt(nextFlow.draft, nextMissingGuestRoom(nextFlow.draft) || 1));
      }
    } finally {
      endUserTurn();
    }
  }

  async function chooseGuests(guests: number) {
    if (!await beginUserTurn(copy.guestLabel(guests), "guest", "👍")) return;

    try {
      const nextFlow = bookingFlowReducer(flow, { type: "choose_guests", guests });
      dispatchFlow({ type: "commit_turn", state: nextFlow });
      announceGuestTotalAdjustment(flow.draft, nextFlow.draft);

      const announced = await maybeAnnounceLongStay(nextFlow.draft);
      if (announced) await wait(220);

      if (nextFlow.step === "searching") {
        await runAvailabilitySearch(nextFlow.draft);
      } else {
        add("assistant", guestsPrompt(nextFlow.draft, nextMissingGuestRoom(nextFlow.draft) || 1));
      }
    } finally {
      endUserTurn();
    }
  }

  async function commitOfferSelection(offer: RoomOffer) {
    const key = roomOfferKey(offer);
    if (offer.alternativeCheckin && offer.alternativeCheckout) {
      dispatchFlow({
        type: "commit_turn",
        state: {
          step: "selecting",
          draft: {
            ...draft,
            checkin: offer.alternativeCheckin,
            checkout: offer.alternativeCheckout,
          },
        },
      });
    }

    const recoveryType = String((offer as any).recoveryType || "");
    if (recoveryType) {
      const recoveryGuests = guestTotal || groups.reduce((sum, value) => sum + value, 0);
      setChoices([{ group: 1, guests: recoveryGuests, offer }]);
      add("assistant", tone.selected(offer.name));

      if (recoveryType === "consolidated") {
        dispatchFlow({
          type: "commit_turn",
          state: {
            step: "breakfast",
            draft: {
              ...draft,
              roomCount: 1,
              totalGuests: recoveryGuests,
              groups: [recoveryGuests],
            },
          },
        });
      } else {
        dispatchFlow({ type: "set_step", step: "breakfast" });
      }
      return;
    }

    const nextChoices = [
      ...choices,
      { group: activeGroup + 1, guests: groups[activeGroup], offer },
    ];
    setChoices(nextChoices);
    add("assistant", tone.selected(offer.name));

    if (roomCount && activeGroup + 1 < roomCount) {
      const nextGroup = activeGroup + 1;
      setActiveGroup(nextGroup);
      const content = tone.results(nextGroup + 1, groups[nextGroup], groups.length);
      const nextSelectedKeys = new Set([...selectedKeys, key]);
      const nextGroupOffers = sortOffersForPreferences(
        feasibleOffersForGroup(capacityEligibleOffers, nextGroup, nextSelectedKeys),
        preferences,
        preferredRoomNumber,
      );
      add(
        "assistant",
        content,
        "offers",
        staffOfferContent(content, [{
          groupNumber: nextGroup + 1,
          guests: groups[nextGroup] || 0,
          offers: nextGroupOffers,
        }], draft),
      );
    } else {
      dispatchFlow({ type: "set_step", step: "breakfast" });
    }
  }

  async function selectOffer(offer: RoomOffer) {
    if (turnLocked.current) return;
    const key = roomOfferKey(offer);
    if (!visibleOffers.some(candidate => roomOfferKey(candidate) === key)) return;

    setSelectingOfferKey(key);
    try {
      if (!await beginUserTurn(`${copy.select}: ${offer.name}`, "room", "❤️", "quick")) return;
      await commitOfferSelection(offer);
    } finally {
      setSelectingOfferKey(null);
      endUserTurn();
    }
  }

  async function chooseBreakfast(value: boolean) {
    if (!await beginUserTurn(
      value ? copy.yesBreakfast : copy.noBreakfast,
      "normal",
      value ? "❤️" : "👍",
    )) return;

    setBreakfast(value);
    dispatchFlow({ type: "set_step", step: "complete" });
    add("assistant", tone.finalizing);
    endUserTurn();
  }

  return {
    copy,
    step,
    messages,
    input,
    setInput,
    checkin,
    checkout,
    roomCount,
    groups,
    offers,
    activeGroup,
    choices,
    preferences,
    breakfast,
    typing,
    selectingOfferKey,
    guestTotal,
    nights,
    visibleOffers,
    canGoBack,
    reset,
    goBack,
    editDates,
    submit,
    chooseRooms,
    chooseGuests,
    selectOffer,
    chooseBreakfast,
    retryAvailability,
    focusRoomFromLink,
    unavailableSearch: step === "unavailable" ? unavailableSearch : null,
    canRetryAvailability: Boolean(failedSearch) && step === "unavailable",
    retryLabel: RETRY_SEARCH_LABEL[language],
  };
}
