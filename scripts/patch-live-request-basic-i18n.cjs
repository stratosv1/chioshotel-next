const fs = require("fs");

const file = "components/home/LiveDirectRequest.tsx";
let s = fs.readFileSync(file, "utf8");

if (!s.includes("function getLiveRequestLocale")) {
  s = s.replace(
`const TRUST_ITEMS: { icon: TrustIconType; title: string; text: string }[] = [
  { icon: "tag", title: "Best direct offer", text: "Best available rate" },
  { icon: "chat", title: "Direct reply", text: "Reception response" },
  { icon: "bed", title: "Choose room", text: "Pick what suits you" },
  { icon: "card", title: "No card needed", text: "No payment now" },
];`,
`type LiveRequestLocale = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

const LIVE_REQUEST_COPY = {
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
    trustItems: [
      { icon: "tag" as const, title: "Best direct offer", text: "Best available rate" },
      { icon: "chat" as const, title: "Direct reply", text: "Reception response" },
      { icon: "bed" as const, title: "Choose room", text: "Pick what suits you" },
      { icon: "card" as const, title: "No card needed", text: "No payment now" },
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
    trustItems: [
      { icon: "tag" as const, title: "Καλύτερη απευθείας προσφορά", text: "Καλύτερη διαθέσιμη τιμή" },
      { icon: "chat" as const, title: "Άμεση απάντηση", text: "Απάντηση από τη ρεσεψιόν" },
      { icon: "bed" as const, title: "Επιλογή δωματίου", text: "Διαλέξτε αυτό που σας ταιριάζει" },
      { icon: "card" as const, title: "Χωρίς κάρτα", text: "Καμία πληρωμή τώρα" },
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
    trustItems: [
      { icon: "tag" as const, title: "Bestes Direktangebot", text: "Bester verfügbarer Preis" },
      { icon: "chat" as const, title: "Direkte Antwort", text: "Antwort der Rezeption" },
      { icon: "bed" as const, title: "Zimmer wählen", text: "Wählen Sie, was passt" },
      { icon: "card" as const, title: "Keine Karte nötig", text: "Keine Zahlung jetzt" },
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
    trustItems: [
      { icon: "tag" as const, title: "Meilleure offre directe", text: "Meilleur tarif disponible" },
      { icon: "chat" as const, title: "Réponse directe", text: "Réponse de la réception" },
      { icon: "bed" as const, title: "Choisir la chambre", text: "Choisissez ce qui vous convient" },
      { icon: "card" as const, title: "Sans carte bancaire", text: "Aucun paiement maintenant" },
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
    trustItems: [
      { icon: "tag" as const, title: "Migliore offerta diretta", text: "Miglior prezzo disponibile" },
      { icon: "chat" as const, title: "Risposta diretta", text: "Risposta dalla reception" },
      { icon: "bed" as const, title: "Scegli camera", text: "Scegli ciò che fa per te" },
      { icon: "card" as const, title: "Senza carta", text: "Nessun pagamento ora" },
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
    trustItems: [
      { icon: "tag" as const, title: "Mejor oferta directa", text: "Mejor tarifa disponible" },
      { icon: "chat" as const, title: "Respuesta directa", text: "Respuesta de recepción" },
      { icon: "bed" as const, title: "Elija habitación", text: "Elija lo que le conviene" },
      { icon: "card" as const, title: "Sin tarjeta", text: "Sin pago ahora" },
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
    trustItems: [
      { icon: "tag" as const, title: "En iyi doğrudan teklif", text: "En iyi mevcut fiyat" },
      { icon: "chat" as const, title: "Doğrudan yanıt", text: "Resepsiyondan yanıt" },
      { icon: "bed" as const, title: "Oda seçin", text: "Size uygun olanı seçin" },
      { icon: "card" as const, title: "Kart gerekmez", text: "Şimdi ödeme yok" },
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
}`);
}

s = s.replace(
  "export function LiveDirectRequest({ data }: { data: LastMinuteData; canonicalPath: string }) {",
  "export function LiveDirectRequest({ data, canonicalPath }: { data: LastMinuteData; canonicalPath: string }) {"
);

s = s.replace(
  '  const [error, setError] = useState("");',
  '  const [error, setError] = useState("");\n  const copy = LIVE_REQUEST_COPY[getLiveRequestLocale(canonicalPath)];'
);

s = s.replaceAll('"Instant request to reception - Voulamandis House"', "copy.messageTitle");
s = s.replaceAll('"Please confirm availability and send your best direct offer."', "copy.messageConfirm");
s = s.replaceAll('formatDate(date)', 'formatDate(date, copy.dateLocale)');
s = s.replaceAll('formatDate(day)', 'formatDate(day, copy.dateLocale)');

s = s.replace(
  '<span className="block text-[10px] font-bold leading-4 md:text-xs">{info ? "Available" : "-"}</span>',
  '<span className="block text-[10px] font-bold leading-4 md:text-xs">{info ? copy.available : "-"}</span>'
);

s = s.replace("Instant request to reception", "{copy.pill}");
s = s.replace(
  "Send an instant request to reception and get the best direct offer.",
  "{copy.subtitle}"
);
s = s.replace(">Guests</span>", ">{copy.guests}</span>");
s = s.replace(
  "No available rooms match these guests right now.",
  "{copy.empty}"
);
s = s.replace(
  "Send a direct request for this room and receive a personal reply from reception with the best available offer.",
  "{copy.selectedText}"
);
s = s.replace(
  `{selectedRoom?.displayName || "Selected room"} · Direct offer · {totals.nights} {totals.nights === 1 ? "night" : "nights"}`,
  `{selectedRoom?.displayName || "-"} · {copy.directOffer} · {totals.nights} {totals.nights === 1 ? copy.night : copy.nights}`
);
s = s.replace("TRUST_ITEMS.map", "copy.trustItems.map");
s = s.replace(">WhatsApp</a>", ">{copy.whatsapp}</a>");
s = s.replace(">Send SMS</a>", ">{copy.sms}</a>");
s = s.replace(">Call +30 22710 31733</a>", ">{copy.call}</a>");
s = s.replace("Your instant request at chioshotel.gr", "{copy.footer}");

fs.writeFileSync(file, s, "utf8");
console.log("Patched LiveDirectRequest basic multilingual visible copy.");
