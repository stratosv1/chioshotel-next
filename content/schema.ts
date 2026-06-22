import {
  absoluteUrl,
  siteName,
  siteUrl,
} from "@/lib/seo";
import {
  homePageEn,
  type HomePageData,
} from "@/content/home";
import {
  buildBreadcrumbSchema,
  buildHotelSchema,
  buildImageSchema,
  buildOrganizationSchema,
  buildSchemaGraph,
  buildWebsiteSchema,
  hotelId,
  itemListId,
  schemaId,
  webPageId,
  websiteId,
  type SchemaObject,
} from "@/lib/structured-data";

function getHomePageLanguage(canonicalPath: string): string {
  switch (canonicalPath) {
    case "/el/":
      return "el";
    case "/de/":
      return "de";
    case "/fr/":
      return "fr";
    case "/it/":
      return "it";
    case "/es/":
      return "es";
    case "/tr/":
      return "tr";
    case "/":
    default:
      return "en";
  }
}

function buildHomeWebPageSchema(data: HomePageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "WebPage",
    "@id": webPageId(canonicalPath),
    url: absoluteUrl(canonicalPath),
    name: data.seo.title,
    headline: data.seo.title,
    description: data.seo.description,
    inLanguage: getHomePageLanguage(canonicalPath),
    isPartOf: {
      "@id": websiteId(),
    },
    about: {
      "@id": hotelId(),
    },
    mainEntity: {
      "@id": hotelId(),
    },
    breadcrumb: {
      "@id": schemaId(canonicalPath, "breadcrumb"),
    },
    primaryImageOfPage: {
      "@id": schemaId(canonicalPath, "primaryimage"),
    },
  };
}

type HomeRoomSchemaContent = {
  listName: string;
  listDescription: string;
  rooms: {
    name: string;
    description: string;
    urlPath: string;
  }[];
};

const homeRoomSchemaByLanguage: Record<string, HomeRoomSchemaContent> = {
  en: {
    listName: "Rooms and apartments at Voulamandis House",
    listDescription:
      "A selection of rooms and apartments at Voulamandis House in Kambos, Chios.",
    rooms: [
      {
        name: "Double and triple rooms in Chios",
        urlPath: "/chios-rooms/standard-double-room/",
        description:
          "Renovated double and triple rooms at Voulamandis House in Kambos, Chios, suitable for up to 4 guests.",
      },
      {
        name: "Economy double rooms in Chios",
        urlPath: "/chios-rooms/economy-double-rooms/",
        description:
          "Economy double rooms at Voulamandis House in Kambos, Chios, ideal for couples or two guests looking for comfortable value-for-money accommodation.",
      },
      {
        name: "Family apartments in Chios",
        urlPath: "/chios-rooms/family-chios-apartments/",
        description:
          "Spacious family apartments at Voulamandis House in Kambos, Chios, with a separate bedroom, kitchen and living area.",
      },
    ],
  },
  el: {
    listName: "Δωμάτια και διαμερίσματα στο Voulamandis House",
    listDescription:
      "Επιλογή από δωμάτια και διαμερίσματα στο Voulamandis House στον Κάμπο της Χίου.",
    rooms: [
      {
        name: "Δίκλινα και τρίκλινα δωμάτια στη Χίο",
        urlPath: "/el/domatia-xios/diklina-triklina-domatia/",
        description:
          "Ανακαινισμένα δίκλινα και τρίκλινα δωμάτια στο Voulamandis House στον Κάμπο της Χίου, κατάλληλα για έως 4 επισκέπτες.",
      },
      {
        name: "Οικονομικά δίκλινα δωμάτια στη Χίο",
        urlPath: "/el/domatia-xios/oikonomiko-diklino-domatio/",
        description:
          "Οικονομικά δίκλινα δωμάτια στο Voulamandis House στον Κάμπο της Χίου, ιδανικά για ζευγάρια ή δύο επισκέπτες που αναζητούν άνετη διαμονή σε καλή τιμή.",
      },
      {
        name: "Οικογενειακά διαμερίσματα στη Χίο",
        urlPath: "/el/domatia-xios/oikogeneiako-diamerisma/",
        description:
          "Ευρύχωρα οικογενειακά διαμερίσματα στο Voulamandis House στον Κάμπο της Χίου, με ξεχωριστό υπνοδωμάτιο, κουζίνα και καθιστικό.",
      },
    ],
  },
  de: {
    listName: "Zimmer und Apartments im Voulamandis House",
    listDescription:
      "Eine Auswahl an Zimmern und Apartments im Voulamandis House in Kambos, Chios.",
    rooms: [
      {
        name: "Doppel- und Dreibettzimmer auf Chios",
        urlPath: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
        description:
          "Renovierte Doppel- und Dreibettzimmer im Voulamandis House in Kambos, Chios, geeignet für bis zu 4 Gäste.",
      },
      {
        name: "Economy-Doppelzimmer auf Chios",
        urlPath: "/de/zimmer-chios/economy-zimmer-auf-chios/",
        description:
          "Economy-Doppelzimmer im Voulamandis House in Kambos, Chios, ideal für Paare oder zwei Gäste, die eine komfortable Unterkunft mit gutem Preis-Leistungs-Verhältnis suchen.",
      },
      {
        name: "Familienapartments auf Chios",
        urlPath: "/de/zimmer-chios/familienapartments-in-chios/",
        description:
          "Geräumige Familienapartments im Voulamandis House in Kambos, Chios, mit separatem Schlafzimmer, Küche und Wohnbereich.",
      },
    ],
  },
  fr: {
    listName: "Chambres et appartements au Voulamandis House",
    listDescription:
      "Une sélection de chambres et d’appartements au Voulamandis House à Kambos, Chios.",
    rooms: [
      {
        name: "Chambres doubles et triples à Chios",
        urlPath: "/fr/chambres-a-chios/chambres-doubles-standard/",
        description:
          "Chambres doubles et triples rénovées au Voulamandis House à Kambos, Chios, adaptées jusqu’à 4 personnes.",
      },
      {
        name: "Chambres doubles économiques à Chios",
        urlPath: "/fr/chambres-a-chios/chambres-doubles-economiques/",
        description:
          "Chambres doubles économiques au Voulamandis House à Kambos, Chios, idéales pour les couples ou deux personnes recherchant un hébergement confortable au bon rapport qualité-prix.",
      },
      {
        name: "Appartements familiaux à Chios",
        urlPath: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
        description:
          "Appartements familiaux spacieux au Voulamandis House à Kambos, Chios, avec chambre séparée, cuisine et coin salon.",
      },
    ],
  },
  it: {
    listName: "Camere e appartamenti al Voulamandis House",
    listDescription:
      "Una selezione di camere e appartamenti al Voulamandis House a Kambos, Chios.",
    rooms: [
      {
        name: "Camere doppie e triple a Chios",
        urlPath: "/it/stanze-a-chios/camere-doppie-standard-chios/",
        description:
          "Camere doppie e triple rinnovate al Voulamandis House a Kambos, Chios, adatte fino a 4 ospiti.",
      },
      {
        name: "Camere doppie economy a Chios",
        urlPath: "/it/stanze-a-chios/camera-doppia-economica-chios/",
        description:
          "Camere doppie economy al Voulamandis House a Kambos, Chios, ideali per coppie o due ospiti che cercano una sistemazione confortevole con un buon rapporto qualità-prezzo.",
      },
      {
        name: "Appartamenti familiari a Chios",
        urlPath: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
        description:
          "Spaziosi appartamenti familiari al Voulamandis House a Kambos, Chios, con camera separata, cucina e zona soggiorno.",
      },
    ],
  },
  es: {
    listName: "Habitaciones y apartamentos en Voulamandis House",
    listDescription:
      "Una selección de habitaciones y apartamentos en Voulamandis House, en Kambos, Chios.",
    rooms: [
      {
        name: "Habitaciones dobles y triples en Chios",
        urlPath: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
        description:
          "Habitaciones dobles y triples renovadas en Voulamandis House, en Kambos, Chios, adecuadas para hasta 4 huéspedes.",
      },
      {
        name: "Habitaciones dobles económicas en Chios",
        urlPath: "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/",
        description:
          "Habitaciones dobles económicas en Voulamandis House, en Kambos, Chios, ideales para parejas o dos huéspedes que buscan una estancia cómoda con buena relación calidad-precio.",
      },
      {
        name: "Apartamentos familiares en Chios",
        urlPath: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
        description:
          "Apartamentos familiares espaciosos en Voulamandis House, en Kambos, Chios, con dormitorio independiente, cocina y zona de estar.",
      },
    ],
  },
  tr: {
    listName: "Voulamandis House’ta odalar ve daireler",
    listDescription:
      "Sakız Adası Kambos’ta yer alan Voulamandis House’ta oda ve daire seçenekleri.",
    rooms: [
      {
        name: "Sakız Adası’nda çift ve üç kişilik odalar",
        urlPath: "/tr/chios-odalari/standart-cift-kisilik-odalar/",
        description:
          "Sakız Adası Kambos’ta yer alan Voulamandis House’ta, 4 kişiye kadar konaklama için uygun yenilenmiş çift ve üç kişilik odalar.",
      },
      {
        name: "Sakız Adası’nda ekonomik çift kişilik odalar",
        urlPath: "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/",
        description:
          "Voulamandis House’ta ekonomik çift kişilik odalar; çiftler veya iyi fiyat-performans sunan konforlu konaklama arayan iki misafir için idealdir.",
      },
      {
        name: "Sakız Adası’nda aile daireleri",
        urlPath: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
        description:
          "Voulamandis House’ta ayrı yatak odası, mutfak ve oturma alanı bulunan geniş aile daireleri.",
      },
    ],
  },
};

function getHomeRoomSchemaContent(canonicalPath: string): HomeRoomSchemaContent {
  const language = getHomePageLanguage(canonicalPath);
  return homeRoomSchemaByLanguage[language] ?? homeRoomSchemaByLanguage.en;
}

function buildHomeRoomsItemListSchema(canonicalPath: string): SchemaObject {
  const roomContent = getHomeRoomSchemaContent(canonicalPath);

  return {
    "@type": "ItemList",
    "@id": itemListId(canonicalPath),
    name: roomContent.listName,
    description: roomContent.listDescription,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: roomContent.rooms.length,
    itemListElement: roomContent.rooms.map((room, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(room.urlPath),
      name: room.name,
    })),
  };
}

function buildHomeRoomReferencesSchema(canonicalPath: string): SchemaObject[] {
  const roomContent = getHomeRoomSchemaContent(canonicalPath);

  return roomContent.rooms.map((room) => ({
    "@type": "Accommodation",
    "@id": schemaId(room.urlPath, "room"),
    name: room.name,
    url: absoluteUrl(room.urlPath),
    description: room.description,
    containedInPlace: {
      "@id": hotelId(),
    },
  }));
}
export function buildHomePageSchema(data: HomePageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ description: data.seo.description, path: canonicalPath }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.seo.ogImage,
        alt: data.seo.ogImageAlt,
        caption: data.seo.title || data.seo.ogImageAlt || siteName,
      },
      canonicalPath,
    ),
    buildHomeWebPageSchema(data),
    buildHomeRoomsItemListSchema(canonicalPath),
    ...buildHomeRoomReferencesSchema(canonicalPath),
    buildBreadcrumbSchema(canonicalPath, []),
  ]);
}

export const homePageSchema = buildHomePageSchema(homePageEn);



