"use client";

import { RoomCard } from "@/components/rooms/RoomCard";
import type { RoomTypeCard } from "@/lib/ai-assistant/room-type-cards";
import type { RoomCategoryId } from "@/lib/booking-core/category-from-prices";
import type { RoomFinderLanguage } from "./room-finder-copy";

/**
 * "No dates yet" answer: the four Voulamandis House room types, shown with
 * the same room cards as the homepage. Nothing here claims availability;
 * availability is only checked once the guest gives dates.
 */

export type { RoomTypeCard };

type RoomTypesCopy = {
  intro: string;
  names: Record<RoomCategoryId, string>;
  rooms: string;
  apartments: string;
  priceNote: string;
  askDates: string;
};

const COPY: Record<RoomFinderLanguage, RoomTypesCopy> = {
  el: {
    intro: "Το Voulamandis House έχει 4 είδη δωματίων:",
    names: {
      "economy-double": "Οικονομικό δίκλινο",
      "first-floor": "Δωμάτια ορόφου",
      "ground-floor": "Δωμάτια ισογείου",
      "family-apartments": "Οικογενειακά διαμερίσματα",
    },
    rooms: "δωμάτια",
    apartments: "διαμερίσματα",
    priceNote: "Οι τιμές «από» στις κάρτες είναι ενδεικτικές, ανά βράδυ για 2 άτομα, και δεν δείχνουν διαθεσιμότητα.",
    askDates: "Όταν ξέρετε ημερομηνίες, γράψτε μου την ημέρα άφιξης και θα σας δείξω ποια δωμάτια είναι διαθέσιμα live.",
  },
  en: {
    intro: "Voulamandis House has 4 types of rooms:",
    names: {
      "economy-double": "Economy double",
      "first-floor": "First-floor rooms",
      "ground-floor": "Ground-floor rooms",
      "family-apartments": "Family apartments",
    },
    rooms: "rooms",
    apartments: "apartments",
    priceNote: "The “from” prices on the cards are indicative, per night for 2 guests, and do not show availability.",
    askDates: "When you know your dates, tell me your arrival day and I’ll show you which rooms are available live.",
  },
  de: {
    intro: "Das Voulamandis House hat 4 Zimmerarten:",
    names: {
      "economy-double": "Economy-Doppelzimmer",
      "first-floor": "Zimmer im Obergeschoss",
      "ground-floor": "Zimmer im Erdgeschoss",
      "family-apartments": "Familienapartments",
    },
    rooms: "Zimmer",
    apartments: "Apartments",
    priceNote: "Die „ab“-Preise auf den Karten sind Richtwerte pro Nacht für 2 Gäste und zeigen keine Verfügbarkeit.",
    askDates: "Sobald Sie Ihre Reisedaten kennen, nennen Sie mir Ihren Anreisetag und ich zeige Ihnen live, welche Zimmer frei sind.",
  },
  fr: {
    intro: "Voulamandis House propose 4 types de chambres :",
    names: {
      "economy-double": "Chambre double économique",
      "first-floor": "Chambres à l’étage",
      "ground-floor": "Chambres au rez-de-chaussée",
      "family-apartments": "Appartements familiaux",
    },
    rooms: "chambres",
    apartments: "appartements",
    priceNote: "Les prix « à partir de » sur les cartes sont indicatifs, par nuit pour 2 personnes, et n’indiquent pas la disponibilité.",
    askDates: "Quand vous connaîtrez vos dates, indiquez-moi votre jour d’arrivée et je vous montrerai en direct les chambres disponibles.",
  },
  it: {
    intro: "Voulamandis House offre 4 tipologie di camere:",
    names: {
      "economy-double": "Doppia economy",
      "first-floor": "Camere al primo piano",
      "ground-floor": "Camere al piano terra",
      "family-apartments": "Appartamenti familiari",
    },
    rooms: "camere",
    apartments: "appartamenti",
    priceNote: "I prezzi «da» sulle schede sono indicativi, a notte per 2 persone, e non indicano la disponibilità.",
    askDates: "Quando conoscete le date, scrivetemi il giorno di arrivo e vi mostrerò in tempo reale quali camere sono disponibili.",
  },
  es: {
    intro: "Voulamandis House tiene 4 tipos de habitaciones:",
    names: {
      "economy-double": "Doble económica",
      "first-floor": "Habitaciones en la planta alta",
      "ground-floor": "Habitaciones en la planta baja",
      "family-apartments": "Apartamentos familiares",
    },
    rooms: "habitaciones",
    apartments: "apartamentos",
    priceNote: "Los precios «desde» de las tarjetas son orientativos, por noche para 2 personas, y no indican disponibilidad.",
    askDates: "Cuando sepan sus fechas, díganme el día de llegada y les mostraré en vivo qué habitaciones están disponibles.",
  },
  tr: {
    intro: "Voulamandis House’ta 4 oda tipi bulunur:",
    names: {
      "economy-double": "Ekonomik çift kişilik",
      "first-floor": "Üst kat odaları",
      "ground-floor": "Zemin kat odaları",
      "family-apartments": "Aile daireleri",
    },
    rooms: "oda",
    apartments: "daire",
    priceNote: "Kartlardaki “başlangıç” fiyatları 2 kişi için gecelik tahmini fiyatlardır ve müsaitlik göstermez.",
    askDates: "Tarihlerinizi öğrendiğinizde bana varış gününüzü yazın, hangi odaların müsait olduğunu canlı olarak göstereyim.",
  },
};

const ROOM_NUMBERS: Record<RoomCategoryId, number[]> = {
  "economy-double": [2, 6],
  "first-floor": [1, 3, 4],
  "ground-floor": [5, 7],
  "family-apartments": [8, 9, 10],
};

const ORDER: RoomCategoryId[] = ["economy-double", "first-floor", "ground-floor", "family-apartments"];

/** The chat text. `askDates` is left out when the guest already gave dates. */
export function roomTypesMessage(
  language: RoomFinderLanguage,
  options: { askDates: boolean; hasPrices: boolean },
) {
  const copy = COPY[language] || COPY.en;
  const lines = ORDER.map(categoryId => {
    const label = categoryId === "family-apartments" ? copy.apartments : copy.rooms;
    return `• ${copy.names[categoryId]} (${label} ${ROOM_NUMBERS[categoryId].join(", ")})`;
  });
  return [
    copy.intro,
    lines.join("\n"),
    options.hasPrices ? copy.priceNote : "",
    options.askDates ? copy.askDates : "",
  ].filter(Boolean).join("\n\n");
}

export async function fetchRoomTypes(language: RoomFinderLanguage): Promise<RoomTypeCard[]> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(`/api/ai-room-finder/room-types/?lang=${language}`, {
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !Array.isArray(data?.roomTypes)) return [];
    return data.roomTypes as RoomTypeCard[];
  } catch {
    return [];
  } finally {
    window.clearTimeout(timeout);
  }
}

export function RoomTypeCards({
  roomTypes,
  language,
}: {
  roomTypes: RoomTypeCard[];
  language: RoomFinderLanguage;
}) {
  if (!roomTypes.length) return null;
  return (
    <div
      data-room-finder-room-types="true"
      className="msg -mr-3.5 mt-2.5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pl-10 pr-3.5 [scrollbar-width:none] sm:-mr-5 sm:pr-5 [&::-webkit-scrollbar]:hidden"
    >
      {roomTypes.map(roomType => (
        <RoomCard
          key={roomType.categoryId}
          card={roomType.card}
          locale={language}
          categoryId={roomType.categoryId}
          anchorId={null}
          price={roomType.price}
          priority={false}
          className="w-[78vw] max-w-[300px] flex-none snap-start"
        />
      ))}
    </div>
  );
}
