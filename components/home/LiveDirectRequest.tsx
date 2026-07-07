"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HomePageData } from "@/content/home";
import {
  firstAvailableDate,
  formatDate,
  getNightInfo,
  mergeDealRooms,
  minDirectPrice,
  money,
  roomKey,
  selectionTotals,
  type DealsResponse,
  type RoomMeta,
} from "@/components/home/liveDirectRequestUtils";

type LastMinuteData = HomePageData["lastMinute"];
type TrustIconType = "tag" | "chat" | "bed" | "card";
type NightInfo = NonNullable<ReturnType<typeof getNightInfo>>;

const CONTACT = {
  endpoint: "/api/deals",
  phoneHref: "tel:+302271031733",
  phoneDisplay: "+30 22710 31733",
  whatsapp: "306944474226",
};

const TRUST_ITEMS: { icon: TrustIconType; title: string; text: string }[] = [
  { icon: "tag", title: "Best direct offer", text: "Best available rate" },
  { icon: "chat", title: "Direct reply", text: "Reception response" },
  { icon: "bed", title: "Choose room", text: "Pick what suits you" },
  { icon: "card", title: "No card needed", text: "No payment now" },
];


type LiveRequestLocale = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

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
  footer: string;
  messageTitle: string;
  messageConfirm: string;
  topPick: string;
  directDeal: string;
  from: string;
  roomWord: string;
  apartmentWord: string;
  roomTypes: Record<string, string>;
  badges: Record<string, string>;
  trustItems: { icon: TrustIconType; title: string; text: string }[];
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
    call: "Call +30 22710 31733",
    footer: "Your instant request at chioshotel.gr",
    messageTitle: "Instant request to reception - Voulamandis House",
    messageConfirm: "Please confirm availability and send your best direct offer.",
    topPick: "Top pick",
    directDeal: "Direct deal",
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
    trustItems: [
      { icon: "tag", title: "Best direct offer", text: "Best available rate" },
      { icon: "chat", title: "Direct reply", text: "Reception response" },
      { icon: "bed", title: "Choose room", text: "Pick what suits you" },
      { icon: "card", title: "No card needed", text: "No payment now" },
    ],
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
    call: "Κλήση +30 22710 31733",
    footer: "Το άμεσο αίτημά σας στο chioshotel.gr",
    messageTitle: "Άμεσο αίτημα στη ρεσεψιόν - Voulamandis House",
    messageConfirm: "Παρακαλώ επιβεβαιώστε τη διαθεσιμότητα και στείλτε μου την καλύτερη απευθείας προσφορά.",
    topPick: "Κορυφαία επιλογή",
    directDeal: "Απευθείας προσφορά",
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
    trustItems: [
      { icon: "tag", title: "Καλύτερη απευθείας προσφορά", text: "Καλύτερη διαθέσιμη τιμή" },
      { icon: "chat", title: "Άμεση απάντηση", text: "Απάντηση από τη ρεσεψιόν" },
      { icon: "bed", title: "Επιλογή δωματίου", text: "Διαλέξτε αυτό που σας ταιριάζει" },
      { icon: "card", title: "Χωρίς κάρτα", text: "Καμία πληρωμή τώρα" },
    ],
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
    call: "Appeler +30 22710 31733",
    footer: "Votre demande instantanée sur chioshotel.gr",
    messageTitle: "Demande instantanée à la réception - Voulamandis House",
    messageConfirm: "Merci de confirmer la disponibilité et de m’envoyer votre meilleure offre directe.",
    topPick: "Meilleur choix",
    directDeal: "Offre directe",
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
    trustItems: [
      { icon: "tag", title: "Meilleure offre directe", text: "Meilleur tarif disponible" },
      { icon: "chat", title: "Réponse directe", text: "Réponse de la réception" },
      { icon: "bed", title: "Choisir la chambre", text: "Choisissez ce qui vous convient" },
      { icon: "card", title: "Sans carte bancaire", text: "Aucun paiement maintenant" },
    ],
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
    call: "Anrufen +30 22710 31733",
    footer: "Ihre Sofortanfrage auf chioshotel.gr",
    messageTitle: "Sofortanfrage an die Rezeption - Voulamandis House",
    messageConfirm: "Bitte bestätigen Sie die Verfügbarkeit und senden Sie mir Ihr bestes Direktangebot.",
    topPick: "Beste Wahl",
    directDeal: "Direktangebot",
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
    trustItems: [
      { icon: "tag", title: "Bestes Direktangebot", text: "Bester verfügbarer Preis" },
      { icon: "chat", title: "Direkte Antwort", text: "Antwort der Rezeption" },
      { icon: "bed", title: "Zimmer wählen", text: "Wählen Sie, was passt" },
      { icon: "card", title: "Keine Karte nötig", text: "Keine Zahlung jetzt" },
    ],
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
    call: "Chiama +30 22710 31733",
    footer: "La tua richiesta immediata su chioshotel.gr",
    messageTitle: "Richiesta immediata alla reception - Voulamandis House",
    messageConfirm: "Per favore confermate la disponibilità e inviatemi la vostra migliore offerta diretta.",
    topPick: "Scelta migliore",
    directDeal: "Offerta diretta",
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
    trustItems: [
      { icon: "tag", title: "Migliore offerta diretta", text: "Miglior prezzo disponibile" },
      { icon: "chat", title: "Risposta diretta", text: "Risposta dalla reception" },
      { icon: "bed", title: "Scegli camera", text: "Scegli ciò che fa per te" },
      { icon: "card", title: "Senza carta", text: "Nessun pagamento ora" },
    ],
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
    call: "Llamar +30 22710 31733",
    footer: "Su solicitud instantánea en chioshotel.gr",
    messageTitle: "Solicitud instantánea a recepción - Voulamandis House",
    messageConfirm: "Por favor confirme la disponibilidad y envíeme su mejor oferta directa.",
    topPick: "Mejor opción",
    directDeal: "Oferta directa",
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
    trustItems: [
      { icon: "tag", title: "Mejor oferta directa", text: "Mejor tarifa disponible" },
      { icon: "chat", title: "Respuesta directa", text: "Respuesta de recepción" },
      { icon: "bed", title: "Elija habitación", text: "Elija lo que le conviene" },
      { icon: "card", title: "Sin tarjeta", text: "Sin pago ahora" },
    ],
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
    call: "Ara +30 22710 31733",
    footer: "chioshotel.gr üzerinden anında talebiniz",
    messageTitle: "Resepsiyona anında talep - Voulamandis House",
    messageConfirm: "Lütfen uygunluğu onaylayın ve en iyi doğrudan teklifinizi gönderin.",
    topPick: "En iyi seçim",
    directDeal: "Doğrudan teklif",
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
    trustItems: [
      { icon: "tag", title: "En iyi doğrudan teklif", text: "En iyi mevcut fiyat" },
      { icon: "chat", title: "Doğrudan yanıt", text: "Resepsiyondan yanıt" },
      { icon: "bed", title: "Oda seçin", text: "Size uygun olanı seçin" },
      { icon: "card", title: "Kart gerekmez", text: "Şimdi ödeme yok" },
    ],
  },
};

function getLiveRequestLocale(canonicalPath: string): LiveRequestLocale {
  if (canonicalPath.startsWith("/el")) return "el";
  if (canonicalPath.startsWith("/fr")) return "fr";
  if (canonicalPath.startsWith("/de")) return "de";
  if (canonicalPath.startsWith("/it")) return "it";
  if (canonicalPath.startsWith("/es")) return "es";
  if (canonicalPath.startsWith("/tr")) return "tr";
  return "en";
}

function localizeRoomName(value: string, copy: (typeof LIVE_REQUEST_COPY)[LiveRequestLocale]) {
  return value
    .replace(/^Room\s+(\d+)/i, `${copy.roomWord} $1`)
    .replace(/^Apartment\s+(\d+)/i, `${copy.apartmentWord} $1`);
}

function localizeRoomType(value: string, copy: (typeof LIVE_REQUEST_COPY)[LiveRequestLocale]) {
  return copy.roomTypes[value] || value;
}

function localizeBadge(value: string, copy: (typeof LIVE_REQUEST_COPY)[LiveRequestLocale]) {
  if (/^👤×\d+/.test(value)) return value;
  return copy.badges[value] || value;
}

function buildRequestHref(
  copy: (typeof LIVE_REQUEST_COPY)[LiveRequestLocale],
  room: RoomMeta | null,
  dates: string[],
  guests: number,
  totals: { original: number; direct: number; nights: number } | null,
) {
  const text = [
    copy.messageTitle,
    "",
    `Room: ${room ? `${room.displayName} - ${room.type}` : "-"}`,
    `Guests: ${guests}`,
    `Dates: ${dates.length ? dates.join(", ") : "-"}`,
    totals ? `Nights: ${totals.nights}` : null,
    totals ? `Original price: ${money(totals.original)}` : null,
    totals ? `Direct offer: ${money(totals.direct)}` : null,
    "",
    copy.messageConfirm,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

function updateStickyRequestLink(href: string) {
  if (typeof document === "undefined") return;
  const fixedLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("div.fixed a"));
  const chatLink = fixedLinks.find((link) => (link.textContent || "").toLowerCase().includes("whatsapp"));
  if (chatLink) {
    chatLink.href = href;
    chatLink.target = "_blank";
    chatLink.rel = "noopener noreferrer";
  }
}

function TrustIcon({ type }: { type: TrustIconType }) {
  const common = "h-5 w-5 text-amber-700 md:h-6 md:w-6";

  if (type === "tag") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true">
        <path d="M20 13.2 13.2 20a2.4 2.4 0 0 1-3.4 0L4 14.2V4h10.2L20 9.8a2.4 2.4 0 0 1 0 3.4Z" />
        <path d="M8.3 8.3h.01" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "chat") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true">
        <path d="M5 17.5 3.8 21l3.8-1.1A9.5 9.5 0 1 0 4.5 17.5Z" />
        <path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "bed") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true">
        <path d="M4 19V8.5A2.5 2.5 0 0 1 6.5 6H10a2 2 0 0 1 2 2v2h5.5A2.5 2.5 0 0 1 20 12.5V19" />
        <path d="M4 14h16M7 19v-2M17 19v-2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true">
      <rect x="3.5" y="6.5" width="17" height="11" rx="2" />
      <path d="M3.5 10h17M7 14.5h4" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
      <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1Z" />
    </svg>
  );
}

function SalesBadges({
  compact = false,
  copy,
}: {
  compact?: boolean;
  copy: (typeof LIVE_REQUEST_COPY)[LiveRequestLocale];
}) {
  const size = compact ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs";

  return (
    <div className="flex flex-wrap gap-1.5">
      <span className={`rounded-md bg-amber-100 font-black text-amber-900 ring-1 ring-amber-200 ${size}`}>{copy.trustItems[0].title}</span>
      <span className={`rounded-md bg-stone-100 font-black text-stone-700 ring-1 ring-stone-200 ${size}`}>{copy.trustItems[3].title}</span>
      <span className={`rounded-md bg-[#eef2dc] font-black text-[#5f6f35] ring-1 ring-[#d9dfbc] ${size}`}>{copy.trustItems[1].title}</span>
    </div>
  );
}

function RoomCard({
  room,
  active,
  index,
  amount,
  onSelect,
  copy,
}: {
  room: RoomMeta;
  active: boolean | null;
  index: number;
  amount: number | null;
  onSelect: () => void;
  copy: (typeof LIVE_REQUEST_COPY)[LiveRequestLocale];
}) {
  const roomName = localizeRoomName(room.displayName, copy);
  const roomType = localizeRoomType(room.type, copy);
  const primaryBadge = localizeBadge(room.primaryBadge, copy);
  const featureBadges = room.featureBadges.map((badge) => localizeBadge(badge, copy));
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-[82vw] max-w-[340px] flex-none snap-start rounded-[1.35rem] bg-white p-2.5 text-left transition md:w-[245px] md:max-w-none md:rounded-[1.3rem] xl:w-[270px] ${
        active
          ? "border border-[#7b8a4b] shadow-sm shadow-stone-300/60 ring-1 ring-[#7b8a4b]/35"
          : "border border-stone-200/70 shadow-md shadow-stone-900/5 hover:-translate-y-1 hover:border-[#7b8a4b]/40 hover:shadow-lg hover:shadow-stone-900/10"
      }`}
    >
      <div className="relative h-[190px] overflow-hidden rounded-[1.1rem] bg-stone-100 md:h-[150px] md:rounded-[1rem]">
        <Image
          src={room.images[0]}
          alt={`${roomName} ${roomType}`}
          width={640}
          height={460}
          sizes="(max-width: 768px) 82vw, 270px"
          className="h-full w-full scale-110 object-cover object-center transition duration-500 group-hover:scale-[1.16]"
        />
        {index === 0 ? (
          <span className="absolute left-2 top-2 rounded-md bg-amber-100 px-2.5 py-1.5 text-[10px] font-black text-amber-900 shadow-sm ring-1 ring-amber-200 md:text-[11px]">{copy.topPick}</span>
        ) : (
          <span className="absolute left-2 top-2 rounded-md bg-[#f8f1e4]/95 px-2.5 py-1.5 text-[10px] font-black text-[#765735] shadow-sm ring-1 ring-white/80">{copy.directDeal}</span>
        )}
        {active ? (
          <span className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-lg font-black text-[#6f7f3f] shadow-sm ring-1 ring-[#7b8a4b]/20 md:h-9 md:w-9">✓</span>
        ) : (
          <span className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-stone-950/30 text-white backdrop-blur-sm"><HeartIcon /></span>
        )}
      </div>
      <div className="px-1.5 pb-2 pt-3 md:px-2 md:pb-3 md:pt-4">
        <h3 className="truncate text-[18px] font-black leading-6 text-stone-950 md:text-lg md:leading-6">{roomName}</h3>
        <p className="mt-1 truncate text-[13px] text-stone-600 md:text-sm">{roomType}</p>
        <div className="mt-2"><SalesBadges compact copy={copy} /></div>
        <div className="mt-3 flex flex-wrap gap-1.5 md:mt-4">
          {featureBadges.slice(0, 4).map((badge) => (
            <span key={badge} className="inline-flex items-center rounded-md bg-stone-100/90 px-1.5 py-1 text-[9px] font-bold text-stone-700 ring-1 ring-stone-200 md:px-2 md:text-[10px]">{badge}</span>
          ))}
        </div>
        {amount ? (
          <div className="mt-3 flex items-end gap-1.5 md:mt-4">
            <span className="text-xs text-stone-500 md:text-sm">{copy.from}</span>
            <strong className="text-2xl font-black text-[#17351f] md:text-2xl">{money(amount)}</strong>
          </div>
        ) : null}
      </div>
    </button>
  );
}

function DateChip({
  day,
  info,
  active,
  onClick,
  copy,
}: {
  day: string;
  info: NightInfo | null;
  active: boolean;
  onClick: () => void;
  copy: (typeof LIVE_REQUEST_COPY)[LiveRequestLocale];
}) {
  return (
    <button
      type="button"
      disabled={!info}
      onClick={onClick}
      className={`relative w-[72px] flex-none snap-start rounded-2xl border px-1.5 py-3 text-center shadow-sm transition md:w-[92px] ${
        active
          ? "border-[#17351f] bg-[#17351f] text-white shadow-lg shadow-emerald-950/15"
          : info
            ? "border-stone-200 bg-white text-stone-900 hover:border-amber-700"
            : "border-stone-200 bg-stone-100 text-stone-400"
      }`}
    >
      <span className="block text-[11px] font-black leading-4 md:text-sm">{formatDate(day, copy.dateLocale)}</span>
      {active ? <span className="mx-auto my-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-black text-white shadow-sm">✓</span> : <span className="block h-2" aria-hidden="true" />}
      <span className="block text-[10px] font-bold leading-4 md:text-xs">{info ? copy.available : "-"}</span>
      {info ? (
        active ? (
          <span className="mt-1 block">
            <span className="block text-[10px] font-black leading-3 text-white/70 line-through">{money(info.original)}</span>
            <span className="block text-[13px] font-black leading-4 text-white md:text-sm">{money(info.direct)}</span>
          </span>
        ) : (
          <span className="mt-1 block text-[12px] font-black leading-4 text-[#17351f] md:text-sm">{money(info.original)}</span>
        )
      ) : null}
    </button>
  );
}

export function LiveDirectRequest({ data, canonicalPath }: { data: LastMinuteData; canonicalPath: string }) {
  const [deals, setDeals] = useState<DealsResponse | null>(null);
  const [guests, setGuests] = useState(2);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const copy = LIVE_REQUEST_COPY[getLiveRequestLocale(canonicalPath)];
  const roomsScrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDeals() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(CONTACT.endpoint, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Live availability is temporarily unavailable.");
        const json = (await response.json()) as DealsResponse;
        if (active) setDeals(json);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Live availability is temporarily unavailable.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadDeals();

    return () => {
      active = false;
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

  useEffect(() => {
    if (!selectedRoom) return;

    const nextKey = roomKey(selectedRoom);
    if (selectedKey !== nextKey) setSelectedKey(nextKey);

    const validSelectedDates = selectedDates.filter((date) => getNightInfo(deals, selectedRoom, date, guests));
    if (!validSelectedDates.length) {
      const firstDate = firstAvailableDate(deals, selectedRoom, guests);
      setSelectedDates(firstDate ? [firstDate] : []);
    } else if (validSelectedDates.length !== selectedDates.length) {
      setSelectedDates(validSelectedDates);
    }
  }, [deals, guests, selectedDates, selectedKey, selectedRoom]);

  const totals = selectionTotals(deals, selectedRoom, selectedDates, guests);
  const requestHref = buildRequestHref(copy, selectedRoom, selectedDates, guests, totals);
  const smsText = [
    copy.messageTitle,
    "",
    `Room: ${selectedRoom ? `${selectedRoom.displayName} - ${selectedRoom.type}` : "-"}`,
    `Guests: ${guests}`,
    `Dates: ${selectedDates.length ? selectedDates.join(", ") : "-"}`,
    totals ? `Nights: ${totals.nights}` : null,
    totals ? `Original price: ${money(totals.original)}` : null,
    totals ? `Direct offer: ${money(totals.direct)}` : null,
    "",
    copy.messageConfirm,
  ].filter(Boolean).join("\n");
  const smsHref = `sms:+306944474226?&body=${encodeURIComponent(smsText)}`;
  const selectedDateLabel = selectedDates.length ? selectedDates.map((date) => formatDate(date, copy.dateLocale)).join(" → ") : "";

  useEffect(() => {
    updateStickyRequestLink(requestHref);
    window.dispatchEvent(new CustomEvent("live-direct-request:update", { detail: { href: requestHref } }));
  }, [requestHref]);

  function handleDateClick(date: string) {
    if (!selectedRoom || !getNightInfo(deals, selectedRoom, date, guests)) return;

    const availableDates = visibleDays
      .filter((day) => getNightInfo(deals, selectedRoom, day.checkin, guests))
      .map((day) => day.checkin);

    if (!selectedDates.length) {
      setSelectedDates([date]);
      return;
    }

    const firstIndex = availableDates.indexOf(selectedDates[0]);
    const targetIndex = availableDates.indexOf(date);
    if (firstIndex < 0 || targetIndex < 0 || targetIndex < firstIndex) {
      setSelectedDates([date]);
      return;
    }

    setSelectedDates(availableDates.slice(firstIndex, targetIndex + 1));
  }

  return (
    <section className="px-4 py-8 md:px-8 md:pt-16 md:pb-8" aria-labelledby="live-direct-title">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-amber-900/10 bg-[#fffaf3] shadow-2xl shadow-stone-900/10 md:rounded-[2.5rem]">
        <div className="min-w-0 p-4 md:p-8 lg:p-9">
          <div className="mb-4 flex justify-center rounded-full bg-amber-100/90 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-amber-800 ring-1 ring-amber-900/10 md:inline-flex md:justify-start md:text-[11px]">
            <span className="mr-2" aria-hidden="true">⚡</span>
            {copy.pill}
          </div>
          <span className="pointer-events-none absolute right-7 top-24 text-5xl font-black text-amber-700/80 md:hidden" aria-hidden="true">⚡</span>

          <div className="grid gap-4 xl:grid-cols-[1fr_250px] xl:items-end">
            <div>
              <h2 id="live-direct-title" className="max-w-[640px] pr-12 font-serif text-[2.35rem] font-bold leading-[0.98] tracking-[-0.04em] text-[#17351f] md:pr-0 md:text-6xl">
                {data.title}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-stone-700 md:text-lg md:leading-8">
                {copy.subtitle}
              </p>
            </div>

            <label className="block">
              <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.16em] text-stone-500 md:text-xs">{copy.guests}</span>
              <select
                value={guests}
                onChange={(event) => setGuests(Number(event.target.value))}
                className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-base font-black text-stone-900 shadow-sm outline-none ring-amber-700/20 transition focus:ring-4 md:h-14"
              >
                {data.widget.guestButtons.map((button) => (
                  <option key={button.value} value={button.value}>{button.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6">
            {loading ? <div className="rounded-3xl bg-white p-6 text-sm font-bold text-stone-600 ring-1 ring-amber-900/10">{data.widget.loadingText}</div> : null}
            {error ? <div className="rounded-3xl bg-white p-6 text-sm font-bold text-stone-600 ring-1 ring-amber-900/10">{error}</div> : null}
            {!loading && !error && !rooms.length ? <div className="rounded-3xl bg-white p-6 text-sm font-bold text-stone-600 ring-1 ring-amber-900/10">{copy.empty}</div> : null}
            {!loading && !error && rooms.length ? (
              <div className="relative -mx-4 md:mx-0 lg:-mx-2">
                <button
                  type="button"
                  onClick={() => roomsScrollerRef.current?.scrollBy({ left: -330, behavior: "smooth" })}
                  className="absolute left-3 top-[88px] z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-xl font-black text-[#17351f] shadow-lg ring-1 ring-amber-900/10 transition hover:scale-105 hover:bg-amber-50 md:left-4 md:top-[84px] md:h-11 md:w-11 md:text-2xl"
                  aria-label="Show previous available rooms"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => roomsScrollerRef.current?.scrollBy({ left: 330, behavior: "smooth" })}
                  className="absolute right-3 top-[88px] z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-xl font-black text-[#17351f] shadow-lg ring-1 ring-amber-900/10 transition hover:scale-105 hover:bg-amber-50 md:right-4 md:top-[84px] md:h-11 md:w-11 md:text-2xl"
                  aria-label="Show more available rooms"
                >
                  →
                </button>
                <div ref={roomsScrollerRef} className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-5 pr-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-4 md:px-2 md:pr-16 xl:gap-5">
                  {rooms.map((room, index) => (
                    <RoomCard
                      key={roomKey(room)}
                      room={room}
                      copy={copy}
                      index={index}
                      active={selectedRoom && roomKey(selectedRoom) === roomKey(room)}
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
            ) : null}
          </div>

          {selectedRoom ? (
            <div className="mt-0 hidden gap-4 rounded-[1.45rem] bg-white p-4 shadow-sm ring-1 ring-amber-900/10 md:grid md:grid-cols-[240px_1fr]">
              <div className="relative min-h-[180px] overflow-hidden rounded-[1.1rem] bg-stone-100">
                <Image
                  src={selectedRoom.images[0]}
                  alt={`${localizeRoomName(selectedRoom.displayName, copy)} ${localizeRoomType(selectedRoom.type, copy)}`}
                  fill
                  sizes="240px"
                  className="scale-110 object-cover object-center"
                />
              </div>
              <div className="min-w-0 self-center">
                <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-amber-800 ring-1 ring-amber-900/10">{localizeBadge(selectedRoom.primaryBadge, copy)}</span>
                <h3 className="mt-2 font-serif text-3xl font-bold leading-tight text-stone-950">{localizeRoomName(selectedRoom.displayName, copy)}</h3>
                <p className="mt-1 font-bold text-amber-800">{localizeRoomType(selectedRoom.type, copy)}</p>
                <div className="mt-3"><SalesBadges copy={copy} /></div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedRoom.featureBadges.map((badge) => (
                    <span key={badge} className="rounded-md bg-stone-100/90 px-3 py-1.5 text-xs font-bold text-stone-700 ring-1 ring-stone-200">{localizeBadge(badge, copy)}</span>
                  ))}
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">
                  {copy.selectedText}
                </p>
              </div>
            </div>
          ) : null}

          {selectedRoom && visibleDays.length ? (
            <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-3">
              {visibleDays.map((day) => {
                const info = getNightInfo(deals, selectedRoom, day.checkin, guests);
                return <DateChip key={day.checkin} day={day.checkin} info={info} active={selectedDates.includes(day.checkin)} onClick={() => handleDateClick(day.checkin)} copy={copy} />;
              })}
            </div>
          ) : null}

          {totals ? (
            <div className="mt-2 rounded-[1.25rem] bg-white px-4 py-3 text-center shadow-sm ring-1 ring-amber-900/10 md:rounded-[1.4rem] md:py-4">
              <div className="text-[11px] font-black uppercase tracking-[0.14em] text-stone-500 md:text-xs">
                {selectedRoom ? localizeRoomName(selectedRoom.displayName, copy) : "-"} · {copy.directOffer} · {totals.nights} {totals.nights === 1 ? copy.night : copy.nights}
              </div>
              <div className="mt-1 text-[11px] font-bold text-stone-500 md:text-xs">{selectedDateLabel}</div>
              <div className="mt-1.5 flex items-end justify-center gap-3">
                <span className="text-base font-black text-red-600 line-through md:text-lg">{money(totals.original)}</span>
                <strong className="text-2xl font-black text-emerald-700 md:text-3xl">{money(totals.direct)}</strong>
              </div>
            </div>
          ) : null}

          <div className="mt-3 grid grid-cols-4 gap-0 rounded-[1.25rem] bg-white p-3 text-center shadow-sm ring-1 ring-amber-900/10 md:rounded-[1.4rem] md:p-4">
            {copy.trustItems.map((item) => (
              <div key={item.title} className="border-r border-stone-200 px-1 text-[9px] font-semibold leading-4 text-stone-800 last:border-r-0 md:text-xs md:leading-5">
                <span className="mb-1 flex justify-center" aria-hidden="true"><TrustIcon type={item.icon} /></span>
                <strong className="block font-black">{item.title}</strong>
                <span className="hidden text-stone-500 md:block">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 pb-10 md:grid-cols-3 md:pb-0">
            <a href={requestHref} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center rounded-2xl bg-[#17351f] px-5 text-center text-sm font-black uppercase tracking-[0.08em] !text-white shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-[#224d2d]">{copy.whatsapp}</a>
            <a href={smsHref} className="flex min-h-14 items-center justify-center rounded-2xl border border-emerald-700/30 bg-white px-5 text-center text-sm font-black uppercase tracking-[0.08em] !text-emerald-800 transition hover:bg-emerald-50">{copy.sms}</a>
            <a href={CONTACT.phoneHref} className="flex min-h-14 items-center justify-center rounded-2xl border border-stone-300 bg-white px-5 text-center text-sm font-black uppercase tracking-[0.08em] !text-stone-800 transition hover:border-amber-700 hover:bg-amber-50">{copy.call}</a>
          </div>
          <p className="mt-4 text-center text-xs font-semibold text-stone-500">{copy.footer}</p>
        </div>
      </div>
    </section>
  );
}
