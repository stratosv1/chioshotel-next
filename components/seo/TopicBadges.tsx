import type { LanguageCode } from "@/lib/languages";
import { defaultLanguage } from "@/lib/languages";
import { getRoutesByItemId } from "@/lib/url-map";

export type TopicBadgeContext =
  | "home"
  | "rooms-category"
  | "room-detail"
  | "beach-detail"
  | "village-detail"
  | "contact"
  | "chios-guide";

type TopicBadgeKey =
  | "rooms"
  | "groundRooms"
  | "firstFloorRooms"
  | "familyStay"
  | "airportStay"
  | "beaches"
  | "villages"
  | "museums"
  | "chiosGuide"
  | "kambosStay"
  | "location";

type TopicBadgeCopy = {
  emoji: string;
  label: string;
  itemId?: string;
  hash?: string;
};

type TopicBadgesProps = {
  locale: LanguageCode;
  context: TopicBadgeContext;
  className?: string;
};

const badgeCopy: Record<LanguageCode, Record<TopicBadgeKey, TopicBadgeCopy>> = {
  en: {
    rooms: { emoji: "🏡", label: "Rooms in Chios", itemId: "rooms-index" },
    groundRooms: { emoji: "🌿", label: "Ground floor rooms", itemId: "rooms-index", hash: "#rooms-list" },
    firstFloorRooms: { emoji: "⬆️", label: "First floor rooms", itemId: "rooms-index", hash: "#rooms-list" },
    familyStay: { emoji: "👨‍👩‍👧", label: "Family stay in Chios", itemId: "family-apartment" },
    airportStay: { emoji: "📍", label: "Near Chios town", itemId: "contact" },
    beaches: { emoji: "🏖", label: "Beaches in Chios", itemId: "beaches-index" },
    villages: { emoji: "🏘", label: "Villages of Chios", itemId: "villages-index" },
    museums: { emoji: "🏛", label: "Museums in Chios", itemId: "museums-index" },
    chiosGuide: { emoji: "🧭", label: "What to see in Chios", itemId: "chios-index" },
    kambosStay: { emoji: "🌿", label: "Stay in Kambos Chios", itemId: "rooms-index" },
    location: { emoji: "📍", label: "Voulamandis House location", itemId: "contact" },
  },
  el: {
    rooms: { emoji: "🏡", label: "Δωμάτια στη Χίο", itemId: "rooms-index" },
    groundRooms: { emoji: "🌿", label: "Δωμάτια ισογείου", itemId: "rooms-index", hash: "#rooms-list" },
    firstFloorRooms: { emoji: "⬆️", label: "Δωμάτια ορόφου", itemId: "rooms-index", hash: "#rooms-list" },
    familyStay: { emoji: "👨‍👩‍👧", label: "Οικογενειακή διαμονή στη Χίο", itemId: "family-apartment" },
    airportStay: { emoji: "📍", label: "Κοντά στην πόλη της Χίου", itemId: "contact" },
    beaches: { emoji: "🏖", label: "Παραλίες στη Χίο", itemId: "beaches-index" },
    villages: { emoji: "🏘", label: "Χωριά της Χίου", itemId: "villages-index" },
    museums: { emoji: "🏛", label: "Μουσεία στη Χίο", itemId: "museums-index" },
    chiosGuide: { emoji: "🧭", label: "Τι να δείτε στη Χίο", itemId: "chios-index" },
    kambosStay: { emoji: "🌿", label: "Διαμονή στον Κάμπο Χίου", itemId: "rooms-index" },
    location: { emoji: "📍", label: "Τοποθεσία Voulamandis House", itemId: "contact" },
  },
  fr: {
    rooms: { emoji: "🏡", label: "Chambres à Chios", itemId: "rooms-index" },
    groundRooms: { emoji: "🌿", label: "Chambres au rez-de-chaussée", itemId: "rooms-index", hash: "#rooms-list" },
    firstFloorRooms: { emoji: "⬆️", label: "Chambres à l’étage", itemId: "rooms-index", hash: "#rooms-list" },
    familyStay: { emoji: "👨‍👩‍👧", label: "Séjour familial à Chios", itemId: "family-apartment" },
    airportStay: { emoji: "📍", label: "Près de la ville de Chios", itemId: "contact" },
    beaches: { emoji: "🏖", label: "Plages de Chios", itemId: "beaches-index" },
    villages: { emoji: "🏘", label: "Villages de Chios", itemId: "villages-index" },
    museums: { emoji: "🏛", label: "Musées de Chios", itemId: "museums-index" },
    chiosGuide: { emoji: "🧭", label: "Que voir à Chios", itemId: "chios-index" },
    kambosStay: { emoji: "🌿", label: "Séjour à Kambos Chios", itemId: "rooms-index" },
    location: { emoji: "📍", label: "Emplacement de Voulamandis House", itemId: "contact" },
  },
  de: {
    rooms: { emoji: "🏡", label: "Zimmer auf Chios", itemId: "rooms-index" },
    groundRooms: { emoji: "🌿", label: "Zimmer im Erdgeschoss", itemId: "rooms-index", hash: "#rooms-list" },
    firstFloorRooms: { emoji: "⬆️", label: "Zimmer im Obergeschoss", itemId: "rooms-index", hash: "#rooms-list" },
    familyStay: { emoji: "👨‍👩‍👧", label: "Familienaufenthalt auf Chios", itemId: "family-apartment" },
    airportStay: { emoji: "📍", label: "Nahe Chios-Stadt", itemId: "contact" },
    beaches: { emoji: "🏖", label: "Strände auf Chios", itemId: "beaches-index" },
    villages: { emoji: "🏘", label: "Dörfer auf Chios", itemId: "villages-index" },
    museums: { emoji: "🏛", label: "Museen auf Chios", itemId: "museums-index" },
    chiosGuide: { emoji: "🧭", label: "Was man auf Chios sehen kann", itemId: "chios-index" },
    kambosStay: { emoji: "🌿", label: "Aufenthalt in Kambos Chios", itemId: "rooms-index" },
    location: { emoji: "📍", label: "Lage von Voulamandis House", itemId: "contact" },
  },
  it: {
    rooms: { emoji: "🏡", label: "Camere a Chios", itemId: "rooms-index" },
    groundRooms: { emoji: "🌿", label: "Camere al piano terra", itemId: "rooms-index", hash: "#rooms-list" },
    firstFloorRooms: { emoji: "⬆️", label: "Camere al primo piano", itemId: "rooms-index", hash: "#rooms-list" },
    familyStay: { emoji: "👨‍👩‍👧", label: "Soggiorno familiare a Chios", itemId: "family-apartment" },
    airportStay: { emoji: "📍", label: "Vicino alla città di Chios", itemId: "contact" },
    beaches: { emoji: "🏖", label: "Spiagge di Chios", itemId: "beaches-index" },
    villages: { emoji: "🏘", label: "Villaggi di Chios", itemId: "villages-index" },
    museums: { emoji: "🏛", label: "Musei di Chios", itemId: "museums-index" },
    chiosGuide: { emoji: "🧭", label: "Cosa vedere a Chios", itemId: "chios-index" },
    kambosStay: { emoji: "🌿", label: "Soggiorno a Kambos Chios", itemId: "rooms-index" },
    location: { emoji: "📍", label: "Posizione di Voulamandis House", itemId: "contact" },
  },
  es: {
    rooms: { emoji: "🏡", label: "Habitaciones en Quíos", itemId: "rooms-index" },
    groundRooms: { emoji: "🌿", label: "Habitaciones en planta baja", itemId: "rooms-index", hash: "#rooms-list" },
    firstFloorRooms: { emoji: "⬆️", label: "Habitaciones en primera planta", itemId: "rooms-index", hash: "#rooms-list" },
    familyStay: { emoji: "👨‍👩‍👧", label: "Estancia familiar en Quíos", itemId: "family-apartment" },
    airportStay: { emoji: "📍", label: "Cerca de la ciudad de Quíos", itemId: "contact" },
    beaches: { emoji: "🏖", label: "Playas de Quíos", itemId: "beaches-index" },
    villages: { emoji: "🏘", label: "Pueblos de Quíos", itemId: "villages-index" },
    museums: { emoji: "🏛", label: "Museos de Quíos", itemId: "museums-index" },
    chiosGuide: { emoji: "🧭", label: "Qué ver en Quíos", itemId: "chios-index" },
    kambosStay: { emoji: "🌿", label: "Alojamiento en Kambos Quíos", itemId: "rooms-index" },
    location: { emoji: "📍", label: "Ubicación de Voulamandis House", itemId: "contact" },
  },
  tr: {
    rooms: { emoji: "🏡", label: "Sakız Adası odaları", itemId: "rooms-index" },
    groundRooms: { emoji: "🌿", label: "Zemin kat odaları", itemId: "rooms-index", hash: "#rooms-list" },
    firstFloorRooms: { emoji: "⬆️", label: "Üst kat odaları", itemId: "rooms-index", hash: "#rooms-list" },
    familyStay: { emoji: "👨‍👩‍👧", label: "Sakız Adası aile konaklaması", itemId: "family-apartment" },
    airportStay: { emoji: "📍", label: "Sakız şehir merkezine yakın", itemId: "contact" },
    beaches: { emoji: "🏖", label: "Sakız Adası plajları", itemId: "beaches-index" },
    villages: { emoji: "🏘", label: "Sakız Adası köyleri", itemId: "villages-index" },
    museums: { emoji: "🏛", label: "Sakız Adası müzeleri", itemId: "museums-index" },
    chiosGuide: { emoji: "🧭", label: "Sakız Adası’nda görülecek yerler", itemId: "chios-index" },
    kambosStay: { emoji: "🌿", label: "Kambos Sakız konaklaması", itemId: "rooms-index" },
    location: { emoji: "📍", label: "Voulamandis House konumu", itemId: "contact" },
  },
};

const badgesByContext: Record<TopicBadgeContext, TopicBadgeKey[]> = {
  home: ["rooms", "beaches", "villages", "chiosGuide", "kambosStay"],
  "rooms-category": ["rooms", "groundRooms", "firstFloorRooms", "familyStay", "airportStay"],
  "room-detail": ["rooms", "kambosStay", "airportStay", "familyStay"],
  "beach-detail": ["beaches", "chiosGuide", "rooms", "kambosStay"],
  "village-detail": ["villages", "chiosGuide", "rooms", "kambosStay"],
  contact: ["location", "kambosStay", "airportStay", "rooms"],
  "chios-guide": ["beaches", "villages", "museums", "rooms"],
};

function getPathForItem(itemId?: string, locale: LanguageCode = defaultLanguage) {
  if (!itemId) return "/";

  const route =
    getRoutesByItemId(itemId).find((item) => item.language === locale && item.action === "KEEP") ??
    getRoutesByItemId(itemId).find((item) => item.language === defaultLanguage && item.action === "KEEP");

  return route?.path ?? "/";
}

export function TopicBadges({ locale, context, className = "" }: TopicBadgesProps) {
  const items = badgesByContext[context].map((key) => {
    const copy = badgeCopy[locale][key];
    return {
      key,
      ...copy,
      href: `${getPathForItem(copy.itemId, locale)}${copy.hash ?? ""}`,
    };
  });

  return (
    <nav
      aria-label="Related topics"
      className={`bg-[#fbf7ef] px-4 py-4 md:px-8 ${className}`}
    >
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible">
        {items.map((item) => (
          <a
            key={`${context}-${item.key}`}
            href={item.href}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-amber-800/15 bg-white px-3.5 py-2 text-xs font-black text-amber-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50 md:text-sm"
          >
            <span aria-hidden="true">{item.emoji}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
