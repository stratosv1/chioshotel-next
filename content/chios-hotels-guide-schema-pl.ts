import { absoluteUrl, siteName, siteUrl } from "@/lib/seo";
import {
  buildFaqSchema,
  buildOrganizationSchema,
  buildSchemaGraph,
  hotelId,
  itemListId,
  schemaId,
  webPageId,
  websiteId,
  type SchemaObject,
} from "@/lib/structured-data";

const path = "/pl/hotele-chios/";
const title = "Hotele Chios | Gdzie nocować, pokoje i apartamenty";
const description = "Szukasz hoteli na Chios? Porównaj rejony, pokoje i apartamenty, sprawdź realną dostępność Voulamandis House w Kambos i wybierz właściwy styl pobytu.";
const image = "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp";

const rooms = [
  {
    name: "Ekonomiczne pokoje dwuosobowe",
    url: "/pl/pokoje-na-chios/pokoj-dwuosobowy-economy/",
    image: "/images/rooms/received_1753964631359257.webp",
    description: "Korzystna opcja dla dwóch osób w spokojnym Kambos.",
  },
  {
    name: "Pokoje na parterze",
    url: "/pl/pokoje-na-chios/pokoje-standardowe/",
    image: "/images/rooms/double-triple-room.jpg",
    description: "Pokoje dwu- i trzyosobowe z łatwym dostępem do dziedzińca i ogrodu.",
  },
  {
    name: "Pokoje na piętrze",
    url: "/pl/pokoje-na-chios/pokoje-standardowe/",
    image: "/images/rooms/DSC07776-2-e1675109942622.webp",
    description: "Jasne pokoje z tarasem i widokiem na otoczenie Kambos.",
  },
  {
    name: "Apartamenty rodzinne",
    url: "/pl/apartamenty-na-chios/",
    image: "/images/rooms/chios-apartments-voulamandis.webp",
    description: "Rodzinne apartamenty z pełną kuchnią i większą przestrzenią.",
  },
] as const;

const faq = [
  {
    question: "Czy Voulamandis House jest hotelem?",
    answer: "Nie. To rodzinny obiekt oferujący pokoje i apartamenty w Kambos. Strona odpowiada na popularne wyszukiwanie hotele Chios, ale jasno pokazuje różnice między typami zakwaterowania.",
  },
  {
    question: "Jaki rejon Chios wybrać?",
    answer: "Miasto Chios jest praktyczne dla portu i osób bez auta. Kambos oferuje spokojniejszą, historyczną bazę blisko miasta i lotniska. Karfas jest bardziej plażowy, a południowe wioski pasują do objazdu samochodem.",
  },
  {
    question: "Czy są noclegi blisko lotniska Chios?",
    answer: "Tak. Kambos znajduje się blisko lotniska, a Voulamandis House leży około 3 km od terminalu.",
  },
  {
    question: "Czy na Chios są apartamenty dla rodzin?",
    answer: "Tak. Voulamandis House oferuje rodzinne apartamenty z osobną sypialnią, salonem i kuchnią.",
  },
  {
    question: "Jak sprawdzić aktualną dostępność?",
    answer: "Skorzystaj z wyszukiwarki dostępności na stronie lub przejdź do polskiej strony rezerwacji bezpośredniej.",
  },
] as const;

function buildWebsite(): SchemaObject {
  return {
    "@type": "WebSite",
    "@id": websiteId(),
    url: siteUrl,
    name: siteName,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: ["en", "el", "fr", "de", "it", "es", "tr", "pl"],
  };
}

function buildCollectionPage(): SchemaObject {
  return {
    "@type": "CollectionPage",
    "@id": webPageId(path),
    url: absoluteUrl(path),
    name: title,
    headline: "Hotele na Chios, pokoje i apartamenty — gdzie najlepiej nocować?",
    description,
    inLanguage: "pl",
    isPartOf: { "@id": websiteId() },
    about: { "@id": hotelId() },
    mainEntity: { "@id": itemListId(path) },
    primaryImageOfPage: { "@id": schemaId(path, "primaryimage") },
    breadcrumb: { "@id": schemaId(path, "breadcrumb") },
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

function buildImage(): SchemaObject {
  return {
    "@type": "ImageObject",
    "@id": schemaId(path, "primaryimage"),
    url: absoluteUrl(image),
    contentUrl: absoluteUrl(image),
    caption: "Voulamandis House w historycznym Kambos na Chios",
  };
}

function buildRoomList(): SchemaObject {
  return {
    "@type": "ItemList",
    "@id": itemListId(path),
    name: "Pokoje i apartamenty Voulamandis House",
    description: "Główne kategorie zakwaterowania dostępne w Voulamandis House w Kambos na Chios.",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: rooms.length,
    itemListElement: rooms.map((room, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: room.name,
      url: absoluteUrl(room.url),
      image: absoluteUrl(room.image),
      description: room.description,
    })),
  };
}

function buildBreadcrumbs(): SchemaObject {
  return {
    "@type": "BreadcrumbList",
    "@id": schemaId(path, "breadcrumb"),
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: absoluteUrl("/pl/") },
      { "@type": "ListItem", position: 2, name: "Hotele na Chios", item: absoluteUrl(path) },
    ],
  };
}

export function buildPolishChiosHotelsGuideSchema(): SchemaObject {
  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildWebsite(),
    buildImage(),
    buildCollectionPage(),
    buildRoomList(),
    buildBreadcrumbs(),
    buildFaqSchema({ path, questions: faq.map((item) => ({ ...item })) }),
  ]);
}
