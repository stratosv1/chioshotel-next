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

const path = "/pl/kambos-chios/";
const destinationId = schemaId(path, "kambos");

const faq = [
  {
    question: "Dlaczego warto nocować w Kambos?",
    answer: "Kambos łączy spokój, historyczny charakter i naturę, pozostając blisko miasta Chios, lotniska oraz dróg prowadzących do plaż i południowych wiosek.",
  },
  {
    question: "Czy są pokoje i apartamenty w Kambos?",
    answer: "Tak. Voulamandis House oferuje pokoje ekonomiczne, pokoje na parterze i piętrze oraz rodzinne apartamenty z kuchnią.",
  },
  {
    question: "Czy Kambos jest odpowiedni dla rodzin?",
    answer: "Tak. Spokojna okolica, ogród, parking i apartamenty rodzinne sprawiają, że jest to praktyczna baza także dla rodzin z dziećmi.",
  },
  {
    question: "Jak blisko są plaże?",
    answer: "Najbliższa plaża znajduje się około 1,5 km od obiektu, a Karfas, Megas Limnionas i plaże południowego Chios są łatwo dostępne samochodem.",
  },
] as const;

const rooms = [
  ["Ekonomiczne pokoje dwuosobowe", "/pl/pokoje-na-chios/pokoj-dwuosobowy-economy/", "/images/rooms/received_1753964631359257.webp"],
  ["Pokoje na parterze", "/pl/pokoje-na-chios/pokoje-standardowe/", "/images/rooms/double-triple-room.jpg"],
  ["Pokoje na piętrze", "/pl/pokoje-na-chios/pokoje-standardowe/", "/images/rooms/DSC07776-2-e1675109942622.webp"],
  ["Apartamenty rodzinne", "/pl/apartamenty-na-chios/", "/images/rooms/chios-apartments-voulamandis.webp"],
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

function buildPage(): SchemaObject {
  return {
    "@type": "WebPage",
    "@id": webPageId(path),
    url: absoluteUrl(path),
    name: "Kambos Chios | Noclegi w historycznej części wyspy",
    headline: "Noclegi w Kambos na Chios",
    description: "Kambos na Chios: historyczna okolica z kamiennymi murami, dawnymi rezydencjami i ogrodami cytrusowymi. Spokojny pobyt w Voulamandis House.",
    inLanguage: "pl",
    isPartOf: { "@id": websiteId() },
    about: [{ "@id": destinationId }, { "@id": hotelId() }],
    mainEntity: { "@id": destinationId },
    breadcrumb: { "@id": schemaId(path, "breadcrumb") },
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

function buildDestination(): SchemaObject {
  return {
    "@type": "TouristDestination",
    "@id": destinationId,
    name: "Kambos, Chios",
    description: "Historyczna część Chios znana z kamiennych rezydencji, wysokich murów, ogrodów cytrusowych i spokojnych uliczek.",
    url: absoluteUrl(path),
    image: absoluteUrl("/images/kampos/kambos-chios.jpg"),
    geo: {
      "@type": "GeoCoordinates",
      latitude: 38.3436,
      longitude: 26.1374,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kambos",
      addressRegion: "Chios",
      addressCountry: "GR",
    },
  };
}

function buildRooms(): SchemaObject {
  return {
    "@type": "ItemList",
    "@id": itemListId(path),
    name: "Pokoje i apartamenty w Kambos",
    numberOfItems: rooms.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: rooms.map(([name, url, image], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      url: absoluteUrl(url),
      image: absoluteUrl(image),
    })),
  };
}

function buildBreadcrumbs(): SchemaObject {
  return {
    "@type": "BreadcrumbList",
    "@id": schemaId(path, "breadcrumb"),
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: absoluteUrl("/pl/") },
      { "@type": "ListItem", position: 2, name: "Kambos Chios", item: absoluteUrl(path) },
    ],
  };
}

export function buildPolishKambosSchema(): SchemaObject {
  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildWebsite(),
    buildPage(),
    buildDestination(),
    buildRooms(),
    buildBreadcrumbs(),
    buildFaqSchema({ path, questions: faq.map((item) => ({ ...item })) }),
  ]);
}
