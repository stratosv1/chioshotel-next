import type { LanguageCode } from "@/lib/languages";
import {
  getPropertyFaqItems,
  propertyFaqPaths,
  type PropertyFaqItem,
} from "@/content/property-faq";

export type PropertyFaqContext = "rooms" | "rates" | "kambos";

const itemIdsByContext: Record<PropertyFaqContext, readonly string[]> = {
  rooms: [
    "couples",
    "solo",
    "three-guests",
    "family-four",
    "kitchenette",
    "no-stairs",
    "specific-room-request",
  ],
  rates: [
    "direct-booking",
    "booking-details",
    "specific-room-request",
    "booking-confirmation",
  ],
  kambos: [
    "location",
    "airport-port",
    "parking",
    "getting-around",
    "nearby-beach",
  ],
};

const sectionCopy: Record<
  LanguageCode,
  Record<PropertyFaqContext, { kicker: string; title: string; description: string; allLabel: string }>
> = {
  en: {
    rooms: { kicker: "Helpful before choosing", title: "Questions about rooms and apartments", description: "Compare capacity, floors and kitchen facilities before choosing the room category that suits your stay.", allLabel: "See all frequently asked questions" },
    rates: { kicker: "Before you book", title: "Direct booking questions", description: "A few practical answers about availability, room requests and when a reservation is actually confirmed.", allLabel: "See all frequently asked questions" },
    kambos: { kicker: "Plan your stay", title: "Location and getting around", description: "Useful answers about Kambos, distances and transport before you organize your days in Chios.", allLabel: "See all frequently asked questions" },
  },
  el: {
    rooms: { kicker: "Πριν επιλέξετε", title: "Ερωτήσεις για δωμάτια & διαμερίσματα", description: "Συγκρίνετε χωρητικότητα, όροφο και δυνατότητες κουζίνας πριν επιλέξετε την κατηγορία που ταιριάζει στη διαμονή σας.", allLabel: "Δείτε όλες τις συχνές ερωτήσεις" },
    rates: { kicker: "Πριν την κράτηση", title: "Ερωτήσεις για την απευθείας κράτηση", description: "Χρήσιμες απαντήσεις για διαθεσιμότητα, αίτημα συγκεκριμένου δωματίου και το πότε μία κράτηση θεωρείται πραγματικά επιβεβαιωμένη.", allLabel: "Δείτε όλες τις συχνές ερωτήσεις" },
    kambos: { kicker: "Οργανώστε τη διαμονή", title: "Τοποθεσία & μετακινήσεις", description: "Χρήσιμες απαντήσεις για τον Κάμπο, τις αποστάσεις και τις μετακινήσεις πριν οργανώσετε τις ημέρες σας στη Χίο.", allLabel: "Δείτε όλες τις συχνές ερωτήσεις" },
  },
  fr: {
    rooms: { kicker: "Avant de choisir", title: "Questions sur les chambres et appartements", description: "Comparez capacité, étage et équipements de cuisine avant de choisir la catégorie adaptée à votre séjour.", allLabel: "Voir toutes les questions fréquentes" },
    rates: { kicker: "Avant de réserver", title: "Questions sur la réservation directe", description: "Des réponses pratiques sur les disponibilités, les demandes de chambre et le moment où une réservation est réellement confirmée.", allLabel: "Voir toutes les questions fréquentes" },
    kambos: { kicker: "Préparez votre séjour", title: "Emplacement et déplacements", description: "Des réponses utiles sur Kambos, les distances et les transports avant d'organiser vos journées à Chios.", allLabel: "Voir toutes les questions fréquentes" },
  },
  de: {
    rooms: { kicker: "Vor der Zimmerwahl", title: "Fragen zu Zimmern und Apartments", description: "Vergleichen Sie Belegung, Etage und Küchenausstattung, bevor Sie die passende Kategorie wählen.", allLabel: "Alle häufigen Fragen ansehen" },
    rates: { kicker: "Vor der Buchung", title: "Fragen zur Direktbuchung", description: "Praktische Antworten zu Verfügbarkeit, Zimmerwünschen und dazu, wann eine Reservierung wirklich bestätigt ist.", allLabel: "Alle häufigen Fragen ansehen" },
    kambos: { kicker: "Aufenthalt planen", title: "Lage und Mobilität", description: "Hilfreiche Antworten zu Kambos, Entfernungen und Verkehrsmitteln für die Planung Ihrer Tage auf Chios.", allLabel: "Alle häufigen Fragen ansehen" },
  },
  it: {
    rooms: { kicker: "Prima di scegliere", title: "Domande su camere e appartamenti", description: "Confrontate capienza, piano e dotazioni della cucina prima di scegliere la categoria più adatta al soggiorno.", allLabel: "Vedi tutte le domande frequenti" },
    rates: { kicker: "Prima di prenotare", title: "Domande sulla prenotazione diretta", description: "Risposte pratiche su disponibilità, richieste di camere specifiche e su quando una prenotazione è realmente confermata.", allLabel: "Vedi tutte le domande frequenti" },
    kambos: { kicker: "Organizza il soggiorno", title: "Posizione e spostamenti", description: "Risposte utili su Kambos, distanze e trasporti prima di organizzare le giornate a Chios.", allLabel: "Vedi tutte le domande frequenti" },
  },
  es: {
    rooms: { kicker: "Antes de elegir", title: "Preguntas sobre habitaciones y apartamentos", description: "Compara capacidad, planta y equipamiento de cocina antes de elegir la categoría que mejor encaje con tu estancia.", allLabel: "Ver todas las preguntas frecuentes" },
    rates: { kicker: "Antes de reservar", title: "Preguntas sobre la reserva directa", description: "Respuestas prácticas sobre disponibilidad, solicitudes de habitaciones y cuándo una reserva está realmente confirmada.", allLabel: "Ver todas las preguntas frecuentes" },
    kambos: { kicker: "Organiza tu estancia", title: "Ubicación y desplazamientos", description: "Respuestas útiles sobre Kambos, distancias y transporte antes de organizar tus días en Quíos.", allLabel: "Ver todas las preguntas frecuentes" },
  },
  tr: {
    rooms: { kicker: "Seçmeden önce", title: "Odalar ve daireler hakkında sorular", description: "Konaklamanıza uygun kategoriyi seçmeden önce kapasiteyi, katı ve mutfak olanaklarını karşılaştırın.", allLabel: "Tüm sık sorulan soruları görün" },
    rates: { kicker: "Rezervasyondan önce", title: "Doğrudan rezervasyon soruları", description: "Müsaitlik, belirli oda talepleri ve rezervasyonun ne zaman gerçekten onaylandığı hakkında pratik yanıtlar.", allLabel: "Tüm sık sorulan soruları görün" },
    kambos: { kicker: "Konaklamanızı planlayın", title: "Konum ve ulaşım", description: "Sakız Adası'ndaki günlerinizi planlamadan önce Kambos, mesafeler ve ulaşım hakkında yararlı yanıtlar.", allLabel: "Tüm sık sorulan soruları görün" },
  },
};

export function getPropertyFaqContext(language: LanguageCode, context: PropertyFaqContext): {
  copy: (typeof sectionCopy)[LanguageCode][PropertyFaqContext];
  items: PropertyFaqItem[];
  allHref: string;
} {
  const byId = new Map(getPropertyFaqItems(language).map((item) => [item.id, item]));
  const items = itemIdsByContext[context].flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });

  return {
    copy: sectionCopy[language][context],
    items,
    allHref: propertyFaqPaths[language],
  };
}
