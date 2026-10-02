"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HomePageData } from "@/content/home";
import {
  firstAvailableDate,
  formatDate,
  formatDayParts,
  getNightInfo,
  mergeDealRooms,
  minDirectPrice,
  money,
  nextIsoDate,
  nextSelection,
  roomKey,
  selectionTotals,
  type DealsResponse,
  type RoomMeta,
} from "@/components/home/liveDirectRequestUtils";
import {
  DATE_CHIP_HEIGHT_CLASS,
  GUESTS_SELECT_CLASS,
  LIVE_CARD_CLASS,
  LIVE_SECTION_CLASS,
  LiveDirectBodySkeleton,
  LiveDirectHeader,
  LiveFinderFooter,
  LiveTrustGrid,
  ROOM_CARD_HEIGHT_CLASS,
  SUMMARY_MIN_HEIGHT_CLASS,
  liveRequestLocale,
  type LiveRequestLocale,
} from "@/components/home/LiveDirectRequestFrame";

type LastMinuteData = HomePageData["lastMinute"];
type NightInfo = NonNullable<ReturnType<typeof getNightInfo>>;

const CONTACT = {
  endpoint: "/api/deals",
  whatsapp: "306944474226",
};

const LIVE_REQUEST_COPY: Record<LiveRequestLocale, {
  dateLocale: string;
  pill: string;
  subtitle: string;
  guests: string;
  available: string;
  empty: string;
  selectedText: string;
  directOffer: string;
  night: string;
  nights: string;
  whatsapp: string;
  sms: string;
  call: string;
  emailPrompt: string;
  emailPlaceholder: string;
  emailSend: string;
  emailSending: string;
  emailSent: string;
  emailError: string;
  messageTitle: string;
  messageConfirm: string;
  topPick: string;
  directDeal: string;
  selectedLabel: string;
  from: string;
  roomWord: string;
  apartmentWord: string;
  roomTypes: Record<string, string>;
  badges: Record<string, string>;
}> = {
  en: {
    dateLocale: "en-GB",
    pill: "Instant request to reception",
    subtitle: "Send an instant request to reception and get the best direct offer.",
    guests: "Guests",
    available: "Available",
    empty: "No available rooms match these guests right now.",
    selectedText: "Send a direct request for this room and receive a personal reply from reception with the best available offer.",
    directOffer: "Direct offer",
    night: "night",
    nights: "nights",
    whatsapp: "WhatsApp",
    sms: "Send SMS",
    call: "Email request",
    emailPrompt: "Enter your email so reception can reply.",
    emailPlaceholder: "Your email",
    emailSend: "Send request",
    emailSending: "Sending...",
    emailSent: "Request sent to reception.",
    emailError: "Please enter a valid email.",
    messageTitle: "Instant request to reception - Voulamandis House",
    messageConfirm: "Please confirm availability and send your best direct offer.",
    topPick: "Top pick",
    directDeal: "Direct deal",
    selectedLabel: "Your selection",
    from: "from",
    roomWord: "Room",
    apartmentWord: "Apartment",
    roomTypes: {
      "Upper Floor Double / Triple": "Upper Floor Double / Triple",
      "Economy Double": "Economy Double",
      "Ground Floor Double / Triple": "Ground Floor Double / Triple",
      "Family Apartment": "Family Apartment",
    },
    badges: {
      Economy: "Economy",
      Kitchenette: "Kitchenette",
      Kitchen: "Kitchen",
      "First floor": "First floor",
      "Ground floor": "Ground floor",
      "No kitchenette": "No kitchenette",
      Stairs: "Stairs",
      "No stairs": "No stairs",
    },
  },
  el: {
    dateLocale: "el-GR",
    pill: "Άμεσο αίτημα στη ρεσεψιόν",
    subtitle: "Στείλτε άμεσο αίτημα στη ρεσεψιόν και λάβετε την καλύτερη απευθείας προσφορά.",
    guests: "Επισκέπτες",
    available: "Διαθέσιμο",
    empty: "Δεν υπάρχουν διαθέσιμα δωμάτια για αυτόν τον αριθμό επισκεπτών αυτή τη στιγμή.",
    selectedText: "Στείλτε απευθείας αίτημα για αυτό το δωμάτιο και θα λάβετε προσωπική απάντηση από τη ρεσεψιόν με την καλύτερη διαθέσιμη προσφορά.",
    directOffer: "Απευθείας προσφορά",
    night: "νύχτα",
    nights: "νύχτες",
    whatsapp: "WhatsApp",
    sms: "Αποστολή SMS",
    call: "Αίτημα με email",
    emailPrompt: "Γράψτε το email σας για να σας απαντήσει η ρεσεψιόν.",
    emailPlaceholder: "Το email σας",
    emailSend: "Αποστολή αιτήματος",
    emailSending: "Αποστολή...",
    emailSent: "Το αίτημα στάλθηκε στη ρεσεψιόν.",
    emailError: "Συμπληρώστε ένα έγκυρο email.",
    messageTitle: "Άμεσο αίτημα στη ρεσεψιόν - Voulamandis House",
    messageConfirm: "Παρακαλώ επιβεβαιώστε τη διαθεσιμότητα και στείλτε μου την καλύτερη απευθείας προσφορά.",
    topPick: "Κορυφαία επιλογή",
    directDeal: "Απευθείας προσφορά",
    selectedLabel: "Η επιλογή σας",
    from: "από",
    roomWord: "Δωμάτιο",
    apartmentWord: "Διαμέρισμα",
    roomTypes: {
      "Upper Floor Double / Triple": "Δίκλινο / Τρίκλινο στον επάνω όροφο",
      "Economy Double": "Οικονομικό δίκλινο",
      "Ground Floor Double / Triple": "Δίκλινο / Τρίκλινο στο ισόγειο",
      "Family Apartment": "Οικογενειακό διαμέρισμα",
    },
    badges: {
      Economy: "Οικονομικό",
      Kitchenette: "Μικρή κουζίνα",
      Kitchen: "Κουζίνα",
      "First floor": "Επάνω όροφος",
      "Ground floor": "Ισόγειο",
      "No kitchenette": "Χωρίς μικρή κουζίνα",
      Stairs: "Σκάλες",
      "No stairs": "Χωρίς σκάλες",
    },
  },
  fr: {
    dateLocale: "fr-FR",
    pill: "Demande instantanée à la réception",
    subtitle: "Envoyez une demande instantanée à la réception et recevez la meilleure offre directe.",
    guests: "Voyageurs",
    available: "Disponible",
    empty: "Aucune chambre disponible ne correspond à ce nombre de voyageurs pour le moment.",
    selectedText: "Envoyez une demande directe pour cette chambre et recevez une réponse personnalisée de la réception avec la meilleure offre disponible.",
    directOffer: "Offre directe",
    night: "nuit",
    nights: "nuits",
    whatsapp: "WhatsApp",
    sms: "Envoyer SMS",
    call: "Demande par e-mail",
    emailPrompt: "Saisissez votre e-mail afin que la réception puisse vous répondre.",
    emailPlaceholder: "Votre e-mail",
    emailSend: "Envoyer la demande",
    emailSending: "Envoi...",
    emailSent: "Demande envoyée à la réception.",
    emailError: "Saisissez une adresse e-mail valide.",
    messageTitle: "Demande instantanée à la réception - Voulamandis House",
    messageConfirm: "Merci de confirmer la disponibilité et de m’envoyer votre meilleure offre directe.",
    topPick: "Meilleur choix",
    directDeal: "Offre directe",
    selectedLabel: "Votre sélection",
    from: "à partir de",
    roomWord: "Chambre",
    apartmentWord: "Appartement",
    roomTypes: {
      "Upper Floor Double / Triple": "Double / triple à l’étage",
      "Economy Double": "Double économique",
      "Ground Floor Double / Triple": "Double / triple au rez-de-chaussée",
      "Family Apartment": "Appartement familial",
    },
    badges: {
      Economy: "Économique",
      Kitchenette: "Kitchenette",
      Kitchen: "Cuisine",
      "First floor": "Étage",
      "Ground floor": "Rez-de-chaussée",
      "No kitchenette": "Sans kitchenette",
      Stairs: "Escaliers",
      "No stairs": "Sans escaliers",
    },
  },
  de: {
    dateLocale: "de-DE",
    pill: "Sofortanfrage an die Rezeption",
    subtitle: "Senden Sie eine Sofortanfrage an die Rezeption und erhalten Sie das beste Direktangebot.",
    guests: "Gäste",
    available: "Verfügbar",
    empty: "Für diese Gästezahl sind derzeit keine passenden Zimmer verfügbar.",
    selectedText: "Senden Sie eine Direktanfrage für dieses Zimmer und erhalten Sie eine persönliche Antwort der Rezeption mit dem besten verfügbaren Angebot.",
    directOffer: "Direktangebot",
    night: "Nacht",
    nights: "Nächte",
    whatsapp: "WhatsApp",
    sms: "SMS senden",
    call: "Anfrage per E-Mail",
    emailPrompt: "Geben Sie Ihre E-Mail-Adresse ein, damit die Rezeption antworten kann.",
    emailPlaceholder: "Ihre E-Mail-Adresse",
    emailSend: "Anfrage senden",
    emailSending: "Wird gesendet...",
    emailSent: "Anfrage an die Rezeption gesendet.",
    emailError: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    messageTitle: "Sofortanfrage an die Rezeption - Voulamandis House",
    messageConfirm: "Bitte bestätigen Sie die Verfügbarkeit und senden Sie mir Ihr bestes Direktangebot.",
    topPick: "Beste Wahl",
    directDeal: "Direktangebot",
    selectedLabel: "Ihre Auswahl",
    from: "ab",
    roomWord: "Zimmer",
    apartmentWord: "Apartment",
    roomTypes: {
      "Upper Floor Double / Triple": "Doppel- / Dreibettzimmer im Obergeschoss",
      "Economy Double": "Economy Doppelzimmer",
      "Ground Floor Double / Triple": "Doppel- / Dreibettzimmer im Erdgeschoss",
      "Family Apartment": "Familienapartment",
    },
    badges: {
      Economy: "Economy",
      Kitchenette: "Kitchenette",
      Kitchen: "Küche",
      "First floor": "Obergeschoss",
      "Ground floor": "Erdgeschoss",
      "No kitchenette": "Keine Kitchenette",
      Stairs: "Treppen",
      "No stairs": "Keine Treppen",
    },
  },
  it: {
    dateLocale: "it-IT",
    pill: "Richiesta immediata alla reception",
    subtitle: "Invia una richiesta immediata alla reception e ricevi la migliore offerta diretta.",
    guests: "Ospiti",
    available: "Disponibile",
    empty: "Al momento non ci sono camere disponibili per questo numero di ospiti.",
    selectedText: "Invia una richiesta diretta per questa camera e ricevi una risposta personale dalla reception con la migliore offerta disponibile.",
    directOffer: "Offerta diretta",
    night: "notte",
    nights: "notti",
    whatsapp: "WhatsApp",
    sms: "Invia SMS",
    call: "Richiesta via email",
    emailPrompt: "Inserisci la tua email per ricevere una risposta dalla reception.",
    emailPlaceholder: "La tua email",
    emailSend: "Invia richiesta",
    emailSending: "Invio...",
    emailSent: "Richiesta inviata alla reception.",
    emailError: "Inserisci un indirizzo email valido.",
    messageTitle: "Richiesta immediata alla reception - Voulamandis House",
    messageConfirm: "Per favore confermate la disponibilità e inviatemi la vostra migliore offerta diretta.",
    topPick: "Scelta migliore",
    directDeal: "Offerta diretta",
    selectedLabel: "La tua selezione",
    from: "da",
    roomWord: "Camera",
    apartmentWord: "Appartamento",
    roomTypes: {
      "Upper Floor Double / Triple": "Doppia / tripla al piano superiore",
      "Economy Double": "Doppia economy",
      "Ground Floor Double / Triple": "Doppia / tripla al piano terra",
      "Family Apartment": "Appartamento familiare",
    },
    badges: {
      Economy: "Economy",
      Kitchenette: "Angolo cottura",
      Kitchen: "Cucina",
      "First floor": "Piano superiore",
      "Ground floor": "Piano terra",
      "No kitchenette": "Senza angolo cottura",
      Stairs: "Scale",
      "No stairs": "Senza scale",
    },
  },
  es: {
    dateLocale: "es-ES",
    pill: "Solicitud instantánea a recepción",
    subtitle: "Envíe una solicitud instantánea a recepción y reciba la mejor oferta directa.",
    guests: "Huéspedes",
    available: "Disponible",
    empty: "No hay habitaciones disponibles para este número de huéspedes en este momento.",
    selectedText: "Envíe una solicitud directa para esta habitación y reciba una respuesta personal de recepción con la mejor oferta disponible.",
    directOffer: "Oferta directa",
    night: "noche",
    nights: "noches",
    whatsapp: "WhatsApp",
    sms: "Enviar SMS",
    call: "Solicitud por email",
    emailPrompt: "Introduce tu email para que recepción pueda responderte.",
    emailPlaceholder: "Tu email",
    emailSend: "Enviar solicitud",
    emailSending: "Enviando...",
    emailSent: "Solicitud enviada a recepción.",
    emailError: "Introduce una dirección de email válida.",
    messageTitle: "Solicitud instantánea a recepción - Voulamandis House",
    messageConfirm: "Por favor confirme la disponibilidad y envíeme su mejor oferta directa.",
    topPick: "Mejor opción",
    directDeal: "Oferta directa",
    selectedLabel: "Tu selección",
    from: "desde",
    roomWord: "Habitación",
    apartmentWord: "Apartamento",
    roomTypes: {
      "Upper Floor Double / Triple": "Doble / triple en planta superior",
      "Economy Double": "Doble económica",
      "Ground Floor Double / Triple": "Doble / triple en planta baja",
      "Family Apartment": "Apartamento familiar",
    },
    badges: {
      Economy: "Económica",
      Kitchenette: "Kitchenette",
      Kitchen: "Cocina",
      "First floor": "Planta superior",
      "Ground floor": "Planta baja",
      "No kitchenette": "Sin kitchenette",
      Stairs: "Escaleras",
      "No stairs": "Sin escaleras",
    },
  },
  tr: {
    dateLocale: "tr-TR",
    pill: "Resepsiyona anında talep",
    subtitle: "Resepsiyona anında talep gönderin ve en iyi doğrudan teklifi alın.",
    guests: "Misafirler",
    available: "Uygun",
    empty: "Şu anda bu misafir sayısı için uygun oda bulunmuyor.",
    selectedText: "Bu oda için doğrudan talep gönderin ve resepsiyondan en iyi mevcut teklif ile kişisel yanıt alın.",
    directOffer: "Doğrudan teklif",
    night: "gece",
    nights: "gece",
    whatsapp: "WhatsApp",
    sms: "SMS gönder",
    call: "E-posta ile talep",
    emailPrompt: "Resepsiyonun yanıt verebilmesi için e-posta adresinizi girin.",
    emailPlaceholder: "E-posta adresiniz",
    emailSend: "Talebi gönder",
    emailSending: "Gönderiliyor...",
    emailSent: "Talep resepsiyona gönderildi.",
    emailError: "Geçerli bir e-posta adresi girin.",
    messageTitle: "Resepsiyona anında talep - Voulamandis House",
    messageConfirm: "Lütfen uygunluğu onaylayın ve en iyi doğrudan teklifinizi gönderin.",
    topPick: "En iyi seçim",
    directDeal: "Doğrudan teklif",
    selectedLabel: "Seçiminiz",
    from: "başlayan",
    roomWord: "Oda",
    apartmentWord: "Daire",
    roomTypes: {
      "Upper Floor Double / Triple": "Üst kat çift / üç kişilik",
      "Economy Double": "Ekonomik çift kişilik",
      "Ground Floor Double / Triple": "Zemin kat çift / üç kişilik",
      "Family Apartment": "Aile dairesi",
    },
    badges: {
      Economy: "Ekonomik",
      Kitchenette: "Mini mutfak",
      Kitchen: "Mutfak",
      "First floor": "Üst kat",
      "Ground floor": "Zemin kat",
      "No kitchenette": "Mini mutfak yok",
      Stairs: "Merdiven",
      "No stairs": "Merdiven yok",
    },
  },
};

function localizeRoomName(value: string, copy: (typeof LIVE_REQUEST_COPY)[LiveRequestLocale]) {
  return value
    .replace(/^Room\s+(\d+)/i, `${copy.roomWord} $1`)
    .replace(/^Apartment\s+(\d+)/i, `${copy.apartmentWord} $1`);
}

function localizeRoomType(value: string, copy: (typeof LIVE_REQUEST_COPY)[LiveRequestLocale]) {
  if (/^apartment$/i.test(value.trim())) return copy.apartmentWord;
  if (/^room$/i.test(value.trim())) return copy.roomWord;
  return copy.roomTypes[value] || value;
}

function localizeBadge(value: string, copy: (typeof LIVE_REQUEST_COPY)[LiveRequestLocale]) {
  if (/^👤×\d+/.test(value)) return value;
  return copy.badges[value] || value;
}

type LiveCopy = (typeof LIVE_REQUEST_COPY)[LiveRequestLocale];

// Copy added in the Live Deals audit fixes (kept separate from the original
// per-locale block so translations stay reviewable).
const LIVE_EXTRA_COPY: Record<LiveRequestLocale, {
  error: string;
  previousRooms: string;
  nextRooms: string;
  booked: string;
  perNight: string;
  calculating: string;
  indicative: string;
  unavailable: string;
  checkin: string;
  checkout: string;
  room: string;
  guests: string;
  nights: string;
  originalPrice: string;
  directOffer: string;
  priceByReception: string;
}> = {
  en: { error: "Live availability is temporarily unavailable. Please try the AI Room Finder or contact us.", previousRooms: "Show previous rooms", nextRooms: "Show more rooms", booked: "Booked", perNight: "/night", calculating: "Calculating the exact price…", indicative: "Indicative price – reception will confirm the exact amount.", unavailable: "These dates are no longer free for this room – send the request and reception will suggest the closest option.", checkin: "Check-in", checkout: "Check-out", room: "Room", guests: "Guests", nights: "Nights", originalPrice: "Original price", directOffer: "Direct offer", priceByReception: "Price to be confirmed by reception" },
  el: { error: "Η ζωντανή διαθεσιμότητα είναι προσωρινά μη διαθέσιμη. Δοκιμάστε το AI Room Finder ή επικοινωνήστε μαζί μας.", previousRooms: "Προηγούμενα δωμάτια", nextRooms: "Περισσότερα δωμάτια", booked: "Κλειστό", perNight: "/νύχτα", calculating: "Υπολογισμός ακριβούς τιμής…", indicative: "Ενδεικτική τιμή – η ρεσεψιόν θα επιβεβαιώσει το ακριβές ποσό.", unavailable: "Οι ημερομηνίες δεν είναι πλέον διαθέσιμες για αυτό το δωμάτιο – στείλτε το αίτημα και η ρεσεψιόν θα προτείνει την πιο κοντινή επιλογή.", checkin: "Άφιξη", checkout: "Αναχώρηση", room: "Δωμάτιο", guests: "Επισκέπτες", nights: "Νύχτες", originalPrice: "Αρχική τιμή", directOffer: "Απευθείας προσφορά", priceByReception: "Η τιμή θα επιβεβαιωθεί από τη ρεσεψιόν" },
  fr: { error: "La disponibilité en direct est momentanément indisponible. Essayez l’AI Room Finder ou contactez-nous.", previousRooms: "Chambres précédentes", nextRooms: "Plus de chambres", booked: "Réservé", perNight: "/nuit", calculating: "Calcul du prix exact…", indicative: "Prix indicatif – la réception confirmera le montant exact.", unavailable: "Ces dates ne sont plus libres pour ce logement – envoyez la demande et la réception proposera l’option la plus proche.", checkin: "Arrivée", checkout: "Départ", room: "Chambre", guests: "Voyageurs", nights: "Nuits", originalPrice: "Prix initial", directOffer: "Offre directe", priceByReception: "Prix à confirmer par la réception" },
  de: { error: "Die Live-Verfügbarkeit ist vorübergehend nicht erreichbar. Nutzen Sie den AI Room Finder oder kontaktieren Sie uns.", previousRooms: "Vorherige Zimmer", nextRooms: "Weitere Zimmer", booked: "Belegt", perNight: "/Nacht", calculating: "Genauer Preis wird berechnet…", indicative: "Richtpreis – die Rezeption bestätigt den genauen Betrag.", unavailable: "Diese Daten sind für dieses Zimmer nicht mehr frei – senden Sie die Anfrage, die Rezeption schlägt die nächstbeste Option vor.", checkin: "Anreise", checkout: "Abreise", room: "Zimmer", guests: "Gäste", nights: "Nächte", originalPrice: "Ursprünglicher Preis", directOffer: "Direktangebot", priceByReception: "Preis wird von der Rezeption bestätigt" },
  it: { error: "La disponibilità in tempo reale non è al momento disponibile. Prova l’AI Room Finder o contattaci.", previousRooms: "Camere precedenti", nextRooms: "Altre camere", booked: "Occupata", perNight: "/notte", calculating: "Calcolo del prezzo esatto…", indicative: "Prezzo indicativo – la reception confermerà l’importo esatto.", unavailable: "Queste date non sono più libere per questa camera – invia la richiesta e la reception proporrà l’opzione più vicina.", checkin: "Arrivo", checkout: "Partenza", room: "Camera", guests: "Ospiti", nights: "Notti", originalPrice: "Prezzo iniziale", directOffer: "Offerta diretta", priceByReception: "Prezzo da confermare dalla reception" },
  es: { error: "La disponibilidad en directo no está disponible temporalmente. Pruebe el AI Room Finder o contáctenos.", previousRooms: "Habitaciones anteriores", nextRooms: "Más habitaciones", booked: "Ocupada", perNight: "/noche", calculating: "Calculando el precio exacto…", indicative: "Precio orientativo – recepción confirmará el importe exacto.", unavailable: "Estas fechas ya no están libres para esta habitación – envíe la solicitud y recepción le propondrá la opción más cercana.", checkin: "Llegada", checkout: "Salida", room: "Habitación", guests: "Huéspedes", nights: "Noches", originalPrice: "Precio inicial", directOffer: "Oferta directa", priceByReception: "Precio a confirmar por recepción" },
  tr: { error: "Canlı müsaitlik geçici olarak kullanılamıyor. AI Room Finder'ı deneyin veya bizimle iletişime geçin.", previousRooms: "Önceki odalar", nextRooms: "Daha fazla oda", booked: "Dolu", perNight: "/gece", calculating: "Kesin fiyat hesaplanıyor…", indicative: "Tahmini fiyat – resepsiyon kesin tutarı onaylayacak.", unavailable: "Bu tarihler bu oda için artık müsait değil – talebinizi gönderin, resepsiyon en yakın seçeneği önerecek.", checkin: "Giriş", checkout: "Çıkış", room: "Oda", guests: "Misafirler", nights: "Gece", originalPrice: "İlk fiyat", directOffer: "Doğrudan teklif", priceByReception: "Fiyat resepsiyon tarafından onaylanacak" },
};

type StayQuote = {
  key: string;
  status: "loading" | "exact" | "indicative" | "unavailable";
  original: number;
  direct: number;
  nights: number;
};

function discountPercent(original: number, direct: number) {
  if (!(original > direct) || original <= 0) return 0;
  return Math.round((1 - direct / original) * 100);
}

function buildRequestText(
  copy: LiveCopy,
  extra: (typeof LIVE_EXTRA_COPY)[LiveRequestLocale],
  room: RoomMeta | null,
  dates: string[],
  guests: number,
  quote: StayQuote | null,
) {
  const roomText = room ? `${localizeRoomName(room.displayName, copy)} - ${localizeRoomType(room.type, copy)}` : "-";
  const checkin = dates[0];
  const checkout = dates.length ? nextIsoDate(dates[dates.length - 1]) : "";
  const exact = quote?.status === "exact";
  return [
    copy.messageTitle,
    "",
    `${extra.room}: ${roomText}`,
    `${extra.guests}: ${guests}`,
    checkin ? `${extra.checkin}: ${formatDate(checkin, copy.dateLocale)} (${checkin})` : null,
    checkout ? `${extra.checkout}: ${formatDate(checkout, copy.dateLocale)} (${checkout})` : null,
    dates.length ? `${extra.nights}: ${dates.length}` : null,
    exact && quote ? `${extra.originalPrice}: ${money(quote.original, copy.dateLocale)}` : null,
    exact && quote ? `${extra.directOffer}: ${money(quote.direct, copy.dateLocale)}` : null,
    !exact && dates.length ? extra.priceByReception : null,
    "",
    copy.messageConfirm,
  ].filter((line) => line !== null).join("\n");
}

function RoomCard({
  room,
  active,
  amount,
  onSelect,
  copy,
  extra,
}: {
  room: RoomMeta;
  active: boolean;
  amount: number | null;
  onSelect: () => void;
  copy: LiveCopy;
  extra: (typeof LIVE_EXTRA_COPY)[LiveRequestLocale];
}) {
  const roomName = localizeRoomName(room.displayName, copy);
  const roomType = localizeRoomType(room.type, copy);
  const featureBadges = room.featureBadges.slice(0, 3).map((badge) => localizeBadge(badge, copy));

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-label={[roomName, roomType, amount ? `${copy.from} ${money(amount, copy.dateLocale)}${extra.perNight}` : ""].filter(Boolean).join(", ")}
      className={`group flex w-[78vw] max-w-[300px] flex-none snap-start flex-col overflow-hidden rounded-[1.35rem] bg-white text-left transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/40 md:w-[245px] md:max-w-none xl:w-[270px] ${ROOM_CARD_HEIGHT_CLASS} ${
        active
          ? "border border-[#58703b] shadow-lg shadow-emerald-950/15 ring-2 ring-[#7b8a4b]/35"
          : "border border-stone-200/80 shadow-md shadow-stone-900/5 hover:-translate-y-1 hover:border-[#7b8a4b]/40 hover:shadow-lg hover:shadow-stone-900/10"
      }`}
    >
      <span className="relative block h-[170px] w-full flex-none overflow-hidden bg-stone-100 md:h-[150px]">
        <Image
          src={room.images[0]}
          alt=""
          width={640}
          height={460}
          sizes="(max-width: 768px) 78vw, (max-width: 1280px) 245px, 270px"
          className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
        />
        {active ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#17351f]/95 px-3 py-1.5 text-[12px] font-black text-white shadow-lg backdrop-blur-sm">
            <span aria-hidden="true">✓</span> {copy.selectedLabel}
          </span>
        ) : null}
      </span>
      <span className="flex min-h-0 flex-1 flex-col p-3.5 md:p-4">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="block truncate text-[18px] font-black leading-6 text-stone-950">{roomName}</span>
            <span className="mt-0.5 block line-clamp-1 text-[13px] font-semibold leading-5 text-stone-600">{roomType}</span>
          </span>
          {amount ? (
            <span className="flex-none text-right">
              <span className="block text-[12px] font-bold leading-4 text-stone-500">{copy.from}</span>
              <strong className="block text-[1.4rem] font-black leading-7 text-[#17351f]">{money(amount, copy.dateLocale)}</strong>
              <span className="block text-[12px] font-semibold leading-4 text-stone-500">{extra.perNight}</span>
            </span>
          ) : null}
        </span>
        <span className="mt-auto flex flex-nowrap gap-1.5 overflow-hidden pt-2">
          {featureBadges.map((badge) => (
            <span key={badge} className="inline-flex flex-none items-center whitespace-nowrap rounded-md bg-stone-100/90 px-2 py-1 text-[12px] font-bold leading-4 text-stone-700 ring-1 ring-stone-200">{badge}</span>
          ))}
        </span>
      </span>
    </button>
  );
}

function DateChip({
  day,
  info,
  active,
  onClick,
  copy,
  extra,
}: {
  day: string;
  info: NightInfo | null;
  active: boolean;
  onClick: () => void;
  copy: LiveCopy;
  extra: (typeof LIVE_EXTRA_COPY)[LiveRequestLocale];
}) {
  const parts = formatDayParts(day, copy.dateLocale);
  return (
    <button
      type="button"
      disabled={!info}
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${formatDate(day, copy.dateLocale)}, ${info ? `${money(info.direct, copy.dateLocale)}${extra.perNight}` : extra.booked}`}
      className={`relative flex w-[76px] flex-none snap-start flex-col items-center justify-center gap-0.5 rounded-2xl border px-1 text-center shadow-sm transition md:w-full md:flex-auto ${DATE_CHIP_HEIGHT_CLASS} ${
        active
          ? "border-[#17351f] bg-[#17351f] text-white shadow-lg shadow-emerald-950/15"
          : info
            ? "border-stone-200 bg-white text-stone-900 hover:border-amber-700"
            : "cursor-not-allowed border-stone-200 bg-stone-100/80 text-stone-400"
      }`}
    >
      <span className="block text-[12px] font-bold uppercase leading-4 tracking-[0.04em] opacity-80">{parts.weekday}</span>
      <span className="block whitespace-nowrap text-[13px] font-black leading-5">{parts.day}</span>
      <span className={`block whitespace-nowrap text-[13px] font-black leading-5 ${active ? "text-white" : info ? "text-[#17351f]" : ""}`}>
        {info ? money(info.direct, copy.dateLocale) : extra.booked}
      </span>
    </button>
  );
}

export function LiveDirectRequest({ data, canonicalPath }: { data: LastMinuteData; canonicalPath: string }) {
  const [deals, setDeals] = useState<DealsResponse | null>(null);
  const [guests, setGuests] = useState(2);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [emailFeedback, setEmailFeedback] = useState("");
  const [rangeQuote, setRangeQuote] = useState<StayQuote | null>(null);
  const locale = liveRequestLocale(canonicalPath);
  const copy = LIVE_REQUEST_COPY[locale];
  const extra = LIVE_EXTRA_COPY[locale];
  const roomsScrollerRef = useRef<HTMLDivElement | null>(null);
  const selectedDatesRef = useRef<string[]>([]);

  useEffect(() => {
    let active = true;
    let followUp: number | undefined;

    async function fetchDeals() {
      const response = await fetch(CONTACT.endpoint, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Live availability unavailable");
      return (await response.json()) as DealsResponse;
    }

    // The server answers instantly from its last snapshot and refreshes from
    // Beds24 in the background. When that happened, quietly fetch again so the
    // visitor sees the refreshed availability without any loading state. Dates
    // already picked are left alone; they are checked live instead.
    function scheduleSilentRefresh(attempt: number) {
      if (attempt > 2) return;
      followUp = window.setTimeout(async () => {
        try {
          const json = await fetchDeals();
          if (!active) return;
          if (selectedDatesRef.current.length === 0) setDeals(json);
          if (json.refreshing) scheduleSilentRefresh(attempt + 1);
        } catch {
          // Keep showing the snapshot already on screen.
        }
      }, attempt === 1 ? 20_000 : 30_000);
    }

    async function loadDeals() {
      setLoading(true);
      setFailed(false);

      try {
        const json = await fetchDeals();
        if (!active) return;
        setDeals(json);
        if (json.refreshing) scheduleSilentRefresh(1);
      } catch {
        if (active) setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadDeals();

    return () => {
      active = false;
      window.clearTimeout(followUp);
    };
  }, []);

  const rooms = useMemo(
    () =>
      mergeDealRooms(deals)
        .filter((room) => room.maxGuests >= guests)
        .filter((room) => firstAvailableDate(deals, room, guests))
        .sort(
          (a, b) =>
            Number(minDirectPrice(deals, a, guests) || Infinity) -
            Number(minDirectPrice(deals, b, guests) || Infinity),
        ),
    [deals, guests],
  );

  const selectedRoom = rooms.find((room) => roomKey(room) === selectedKey) || rooms[0] || null;
  const visibleDays = useMemo(() => (deals?.days || []).slice(0, 7), [deals]);
  const dayList = useMemo(() => visibleDays.map((day) => day.checkin), [visibleDays]);

  useEffect(() => {
    if (!selectedRoom) return;

    const nextKey = roomKey(selectedRoom);
    if (selectedKey !== nextKey) setSelectedKey(nextKey);

    // Keep only a consecutive run of bookable nights for the current room/guests.
    const available = (date: string) => Boolean(getNightInfo(deals, selectedRoom, date, guests));
    let valid: string[] = [];
    for (const date of selectedDates) {
      if (!available(date)) break;
      if (valid.length && dayList.indexOf(date) !== dayList.indexOf(valid[valid.length - 1]) + 1) break;
      valid = [...valid, date];
    }
    if (!valid.length) {
      const firstDate = firstAvailableDate(deals, selectedRoom, guests);
      setSelectedDates(firstDate ? [firstDate] : []);
    } else if (valid.length !== selectedDates.length) {
      setSelectedDates(valid);
    }
  }, [deals, guests, selectedDates, selectedKey, selectedRoom, dayList]);

  useEffect(() => {
    const scroller = roomsScrollerRef.current;
    if (!scroller || !selectedRoom) return;

    const selectedIndex = rooms.findIndex((room) => roomKey(room) === roomKey(selectedRoom));
    const selectedCard = scroller.children.item(selectedIndex);
    if (!(selectedCard instanceof HTMLElement)) return;

    const targetLeft = Math.max(0, selectedCard.offsetLeft - scroller.offsetLeft - 16);
    if (Math.abs(scroller.scrollLeft - targetLeft) > 16) {
      scroller.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  }, [rooms, selectedRoom]);

  selectedDatesRef.current = selectedDates;
  const nightlyTotals = selectionTotals(deals, selectedRoom, selectedDates, guests);
  // A fresh feed prices a single night exactly. If it came from an older
  // snapshot (background refresh running), check even one night live.
  const needsLiveQuote = selectedDates.length >= 2 || (selectedDates.length === 1 && deals?.fresh === false);
  const quoteKey = selectedRoom && selectedDates.length
    ? `${roomKey(selectedRoom)}:${guests}:${selectedDates.join(",")}`
    : "";

  // For longer stays (or any stay when the feed is an older snapshot), ask the
  // same live endpoint the AI Room Finder uses so the length-of-stay discount
  // is applied and the price matches what reception will offer. If the room is
  // no longer offered for those dates, say so; if the lookup fails, the nightly
  // sum is shown as indicative.
  useEffect(() => {
    if (!selectedRoom || !needsLiveQuote || !nightlyTotals) {
      setRangeQuote(null);
      return;
    }

    const controller = new AbortController();
    const key = quoteKey;
    const fallback: StayQuote = { key, status: "indicative", original: nightlyTotals.original, direct: nightlyTotals.direct, nights: nightlyTotals.nights };
    setRangeQuote({ ...fallback, status: "loading" });
    const timeout = window.setTimeout(() => controller.abort(), 30_000);

    const query = new URLSearchParams({
      checkin: selectedDates[0],
      checkout: nextIsoDate(selectedDates[selectedDates.length - 1]),
      guests: String(guests),
      lang: locale,
    });

    fetch(`/api/ai-room-finder/availability?${query}`, { cache: "no-store", signal: controller.signal })
      .then((response) => response.json().then((payload) => ({ ok: response.ok, payload })))
      .then(({ ok, payload }) => {
        const liveOffers = ok && payload?.success && Array.isArray(payload.offers) ? payload.offers : null;
        const offer = liveOffers
          ? liveOffers.find((item: { roomId?: unknown; unitId?: unknown }) =>
              String(item.roomId) === String(selectedRoom.roomId) && String(item.unitId) === String(selectedRoom.unitId))
          : null;
        const original = Number(offer?.originalTotal);
        const direct = Number(offer?.directTotal);
        setRangeQuote(offer && original > 0 && direct > 0
          ? { key, status: "exact", original, direct, nights: nightlyTotals.nights }
          : liveOffers && !offer
            ? { ...fallback, status: "unavailable" }
            : fallback);
      })
      .catch(() => {
        if (!controller.signal.aborted) setRangeQuote(fallback);
        else setRangeQuote((current) => (current?.key === key && current.status === "loading" ? fallback : current));
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
    // nightlyTotals is derived from the same inputs as quoteKey.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteKey, locale, needsLiveQuote]);

  const quote: StayQuote | null = !nightlyTotals
    ? null
    : !needsLiveQuote
      ? { key: quoteKey, status: "exact", original: nightlyTotals.original, direct: nightlyTotals.direct, nights: nightlyTotals.nights }
      : rangeQuote?.key === quoteKey
        ? rangeQuote
        : { key: quoteKey, status: "loading", original: nightlyTotals.original, direct: nightlyTotals.direct, nights: nightlyTotals.nights };

  const requestText = buildRequestText(copy, extra, selectedRoom, selectedDates, guests, quote);
  const requestHref = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(requestText)}`;
  const smsHref = `sms:+${CONTACT.whatsapp}?&body=${encodeURIComponent(requestText)}`;
  const selectedDateLabel = selectedDates.length
    ? `${formatDate(selectedDates[0], copy.dateLocale)} → ${formatDate(nextIsoDate(selectedDates[selectedDates.length - 1]), copy.dateLocale)}`
    : "";
  const quoteDiscount = quote && quote.status !== "loading" ? discountPercent(quote.original, quote.direct) : 0;

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("live-direct-request:update", { detail: { href: requestHref } }));
  }, [requestHref]);

  async function handleEmailRequest() {
    if (!selectedRoom || !quote || !selectedDates.length || emailState === "sending") return;

    const contact = emailValue.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      setEmailState("error");
      setEmailFeedback(copy.emailError);
      return;
    }

    setEmailState("sending");
    setEmailFeedback("");
    const exact = quote.status === "exact";

    try {
      const response = await fetch("/api/ai-assistant/request-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          requestId: `LIVE-${Date.now().toString(36).toUpperCase()}`,
          name: "Live Deals visitor",
          contact,
          message: exact
            ? `Live Deals request from ${canonicalPath}`
            : quote.status === "unavailable"
              ? `Live Deals request from ${canonicalPath} (room no longer free for these dates online - please suggest an alternative)`
              : `Live Deals request from ${canonicalPath} (price not confirmed online - please quote)`,
          checkin: selectedDates[0],
          checkout: nextIsoDate(selectedDates[selectedDates.length - 1]),
          guests,
          roomId: String(selectedRoom.roomId),
          unitId: String(selectedRoom.unitId),
          roomName: `${selectedRoom.displayName} - ${selectedRoom.type}`,
          originalTotal: exact ? quote.original : 0,
          directTotal: exact ? quote.direct : 0,
        }),
      });

      const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !result?.ok) throw new Error(result?.error || "Could not send request email.");

      setEmailState("sent");
      setEmailFeedback(copy.emailSent);
      setEmailOpen(false);
    } catch {
      setEmailState("error");
      setEmailFeedback(copy.emailError);
    }
  }

  function handleDateClick(date: string) {
    if (!selectedRoom) return;
    setSelectedDates((current) =>
      nextSelection(dayList, current, date, (value) => Boolean(getNightInfo(deals, selectedRoom, value, guests))),
    );
  }

  const showSkeleton = loading;

  return (
    <section className={LIVE_SECTION_CLASS} aria-labelledby="live-direct-title" aria-busy={loading}>
      <div className={LIVE_CARD_CLASS}>
        <div className="min-w-0 p-4 md:p-7 lg:p-8">
          <LiveDirectHeader
            locale={locale}
            title={data.title}
            headingId="live-direct-title"
            guestsControl={
              <select value={guests} onChange={(event) => setGuests(Number(event.target.value))} className={GUESTS_SELECT_CLASS}>
                {data.widget.guestButtons.map((button) => (
                  <option key={button.value} value={button.value}>{button.label}</option>
                ))}
              </select>
            }
          />

          {showSkeleton ? <LiveDirectBodySkeleton locale={locale} includeFinderLink={false} /> : null}

          {!loading && failed ? (
            <div className="mt-5 rounded-3xl bg-white p-6 text-sm font-bold leading-6 text-stone-600 ring-1 ring-amber-900/10" role="status">{extra.error}</div>
          ) : null}
          {!loading && !failed && !rooms.length ? (
            <div className="mt-5 rounded-3xl bg-white p-6 text-sm font-bold leading-6 text-stone-600 ring-1 ring-amber-900/10" role="status">{copy.empty}</div>
          ) : null}

          {!loading && !failed && rooms.length ? (
            <>
              <div className="relative mt-5 -mx-4 md:mx-0 lg:-mx-2">
                <button
                  type="button"
                  onClick={() => roomsScrollerRef.current?.scrollBy({ left: -310, behavior: "smooth" })}
                  className="absolute left-4 top-[55px] z-20 hidden h-10 w-10 items-center justify-center rounded-full bg-white/95 text-2xl font-black text-[#17351f] shadow-lg ring-1 ring-amber-900/10 transition hover:scale-105 hover:bg-amber-50 md:flex"
                  aria-label={extra.previousRooms}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => roomsScrollerRef.current?.scrollBy({ left: 310, behavior: "smooth" })}
                  className="absolute right-4 top-[55px] z-20 hidden h-10 w-10 items-center justify-center rounded-full bg-white/95 text-2xl font-black text-[#17351f] shadow-lg ring-1 ring-amber-900/10 transition hover:scale-105 hover:bg-amber-50 md:flex"
                  aria-label={extra.nextRooms}
                >
                  →
                </button>
                <div ref={roomsScrollerRef} className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 pr-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-4 md:px-2 md:pr-16 xl:gap-5">
                  {rooms.map((room) => (
                    <RoomCard
                      key={roomKey(room)}
                      room={room}
                      copy={copy}
                      extra={extra}
                      active={Boolean(selectedRoom && roomKey(selectedRoom) === roomKey(room))}
                      amount={minDirectPrice(deals, room, guests)}
                      onSelect={() => {
                        setSelectedKey(roomKey(room));
                        const date = firstAvailableDate(deals, room, guests);
                        setSelectedDates(date ? [date] : []);
                      }}
                    />
                  ))}
                </div>
              </div>

              {selectedRoom ? (
                <div className="mt-1 hidden h-[171px] gap-4 rounded-[1.45rem] bg-white p-3 shadow-sm ring-1 ring-amber-900/10 md:grid md:grid-cols-[170px_minmax(0,1fr)] md:items-center lg:h-[181px] lg:grid-cols-[190px_minmax(0,1fr)]">
                  <div className="relative h-[145px] overflow-hidden rounded-[1.05rem] bg-stone-100 lg:h-[155px]">
                    <Image src={selectedRoom.images[0]} alt="" fill sizes="190px" className="scale-110 object-cover object-center" />
                  </div>
                  <div className="min-w-0 py-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#17351f] px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] text-white"><span aria-hidden="true">✓</span>{copy.selectedLabel}</span>
                    </div>
                    <h3 className="mt-1.5 font-serif text-2xl font-bold leading-tight text-stone-950 lg:text-3xl">{localizeRoomName(selectedRoom.displayName, copy)}</h3>
                    <p className="mt-0.5 font-bold text-amber-800">{localizeRoomType(selectedRoom.type, copy)}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {selectedRoom.featureBadges.map((badge) => (
                        <span key={badge} className="rounded-md bg-stone-100/90 px-2.5 py-1 text-[12px] font-bold text-stone-700 ring-1 ring-stone-200">{localizeBadge(badge, copy)}</span>
                      ))}
                    </div>
                    <p className="mt-2 line-clamp-1 max-w-2xl text-sm leading-6 text-stone-600">{copy.selectedText}</p>
                  </div>
                </div>
              ) : null}

              {selectedRoom && visibleDays.length ? (
                <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-2 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-7 md:gap-3 md:overflow-visible">
                  {visibleDays.map((day) => {
                    const info = getNightInfo(deals, selectedRoom, day.checkin, guests);
                    return <DateChip key={day.checkin} day={day.checkin} info={info} active={selectedDates.includes(day.checkin)} onClick={() => handleDateClick(day.checkin)} copy={copy} extra={extra} />;
                  })}
                </div>
              ) : null}

              <div className={`mt-2 flex flex-col justify-center rounded-[1.25rem] bg-white px-4 py-3 text-center shadow-sm ring-1 ring-amber-900/10 md:rounded-[1.4rem] ${SUMMARY_MIN_HEIGHT_CLASS}`} aria-live="polite">
                {selectedRoom && quote ? (
                  <>
                    <div className="text-[12px] font-black uppercase leading-5 tracking-[0.12em] text-stone-500">
                      {localizeRoomName(selectedRoom.displayName, copy)} · {quote.nights} {quote.nights === 1 ? copy.night : copy.nights}
                    </div>
                    <div className="text-[13px] font-bold leading-5 text-stone-500">{selectedDateLabel}</div>
                    {quote.status === "loading" ? (
                      <div className="mt-1.5 text-[15px] font-bold leading-8 text-stone-500">{extra.calculating}</div>
                    ) : quote.status === "unavailable" ? (
                      <div className="mt-1 text-[13px] font-bold leading-5 text-[#9a4a1f]">{extra.unavailable}</div>
                    ) : (
                      <>
                        <div className="mt-1 flex items-center justify-center gap-2.5">
                          {quote.original > quote.direct ? <span className="text-base font-bold text-stone-400 line-through md:text-lg">{money(quote.original, copy.dateLocale)}</span> : null}
                          <strong className="text-2xl font-black text-[#17351f] md:text-3xl">{money(quote.direct, copy.dateLocale)}</strong>
                          {quoteDiscount > 0 ? <span className="rounded-full bg-[#c66a34] px-2 py-0.5 text-[12px] font-black text-white">−{quoteDiscount}%</span> : null}
                        </div>
                        {quote.status === "indicative" ? <div className="mt-1 text-[12px] font-semibold leading-4 text-stone-500">{extra.indicative}</div> : null}
                      </>
                    )}
                  </>
                ) : null}
              </div>

              <LiveTrustGrid locale={locale} />

              <div className="mt-3 grid grid-cols-2 gap-2">
                <a href={requestHref} target="_blank" rel="noopener noreferrer" className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#17351f] px-4 text-center text-[13px] font-black uppercase leading-tight tracking-[0.06em] !text-white shadow-md shadow-emerald-950/15 transition hover:-translate-y-0.5 hover:bg-[#224d2d] md:col-span-1">
                  <span aria-hidden="true">💬</span>{copy.whatsapp}
                </a>
                <a href={smsHref} className="flex min-h-12 items-center justify-center rounded-xl border border-emerald-700/30 bg-white px-3 text-center text-[13px] font-black uppercase leading-tight tracking-[0.06em] !text-emerald-800 transition hover:bg-emerald-50 md:hidden">{copy.sms}</a>
                <button
                  type="button"
                  onClick={() => {
                    if (emailState !== "sent") setEmailOpen((open) => !open);
                  }}
                  aria-expanded={emailOpen}
                  className="flex min-h-12 items-center justify-center rounded-xl border border-stone-300 bg-white px-3 text-center text-[13px] font-black uppercase leading-tight tracking-[0.06em] text-stone-800 transition hover:border-amber-700 hover:bg-amber-50"
                >
                  {emailState === "sent" ? copy.emailSent : copy.call}
                </button>
              </div>

              {emailOpen && emailState !== "sent" ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void handleEmailRequest();
                  }}
                  className="mx-auto mt-2 max-w-2xl rounded-2xl border border-amber-900/10 bg-white p-2.5 shadow-sm"
                >
                  <p className="mb-1.5 text-[12px] font-bold leading-4 text-stone-600">{copy.emailPrompt}</p>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                    <label className="min-w-0">
                      <span className="sr-only">{copy.emailPrompt}</span>
                      <input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={emailValue}
                        onChange={(event) => {
                          setEmailValue(event.target.value);
                          if (emailState === "error") {
                            setEmailState("idle");
                            setEmailFeedback("");
                          }
                        }}
                        placeholder={copy.emailPlaceholder}
                        required
                        className="h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-base text-stone-900 outline-none ring-amber-700/20 transition focus:border-amber-700 focus:ring-4"
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={emailState === "sending"}
                      className="min-h-11 rounded-xl bg-amber-700 px-3 text-[12px] font-black uppercase leading-tight tracking-[0.04em] text-white transition hover:bg-amber-800 disabled:cursor-wait disabled:opacity-70 sm:px-5"
                    >
                      {emailState === "sending" ? copy.emailSending : copy.emailSend}
                    </button>
                  </div>
                </form>
              ) : null}

              {emailFeedback && emailState !== "sent" ? (
                <p className="mt-2 text-center text-xs font-bold text-red-600" role="alert">{emailFeedback}</p>
              ) : null}
            </>
          ) : null}

          <LiveFinderFooter locale={locale} />
        </div>
      </div>
    </section>
  );
}
