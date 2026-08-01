import type { FindYourRoomPageData } from "@/content/find-your-room";
import {
  absoluteUrl,
  getCanonicalUrl,
  getLanguageForPath,
  siteName,
  siteUrl,
} from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildHotelSchema,
  buildImageSchema,
  buildOrganizationSchema,
  buildSchemaGraph,
  buildWebsiteSchema,
  hotelId,
  primaryImageId,
  schemaId,
  webPageId,
  websiteId,
  type SchemaObject,
} from "@/lib/structured-data";

type RoomOptionPaths = {
  economy: string;
  standard: string;
  apartments: string;
};

const roomOptionPathsByLanguage: Record<
  FindYourRoomPageData["language"],
  RoomOptionPaths
> = {
  en: {
    economy: "/chios-rooms/economy-double-rooms/",
    standard: "/chios-rooms/standard-double-room/",
    apartments: "/chios-rooms/family-chios-apartments/",
  },
  el: {
    economy: "/el/domatia-xios/oikonomiko-diklino-domatio/",
    standard: "/el/domatia-xios/diklina-triklina-domatia/",
    apartments: "/el/domatia-xios/oikogeneiako-diamerisma/",
  },
  fr: {
    economy: "/fr/chambres-a-chios/chambres-doubles-economiques/",
    standard: "/fr/chambres-a-chios/chambres-doubles-standard/",
    apartments: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
  },
  de: {
    economy: "/de/zimmer-chios/economy-zimmer-auf-chios/",
    standard: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
    apartments: "/de/zimmer-chios/familienapartments-in-chios/",
  },
  it: {
    economy: "/it/stanze-a-chios/camera-doppia-economica-chios/",
    standard: "/it/stanze-a-chios/camere-doppie-standard-chios/",
    apartments: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
  },
  es: {
    economy: "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/",
    standard: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
    apartments: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
  },
  tr: {
    economy: "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/",
    standard: "/tr/chios-odalari/standart-cift-kisilik-odalar/",
    apartments: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
  },
};

function buildFindYourRoomWebPageSchema(data: FindYourRoomPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);

  return {
    "@type": "SearchResultsPage",
    "@id": webPageId(canonicalPath),
    url: getCanonicalUrl(canonicalPath),
    name: data.seo.title,
    headline: data.hero.title,
    description: data.seo.description,
    inLanguage: language,
    isPartOf: {
      "@id": websiteId(),
    },
    about: {
      "@id": hotelId(),
    },
    mainEntity: {
      "@id": schemaId(canonicalPath, "room-finder-action"),
    },
    primaryImageOfPage: {
      "@id": primaryImageId(canonicalPath),
    },
    breadcrumb: {
      "@id": schemaId(canonicalPath, "breadcrumb"),
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

function buildRoomFinderActionSchema(data: FindYourRoomPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "SearchAction",
    "@id": schemaId(canonicalPath, "room-finder-action"),
    name: data.engine.basics.title,
    description: data.hero.description,
    inLanguage: getLanguageForPath(canonicalPath),
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${getCanonicalUrl(canonicalPath)}?checkin={checkin}&checkout={checkout}&guests={guests}&rooms={rooms}`,
      actionPlatform: [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform",
      ],
    },
    queryInput: [
      "required name=checkin",
      "required name=checkout",
      "required name=guests",
      "optional name=rooms",
    ],
    object: {
      "@id": hotelId(),
    },
    result: {
      "@id": schemaId(canonicalPath, "room-options"),
    },
  };
}

function buildRoomOptionsItemListSchema(data: FindYourRoomPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);
  const labels = data.engine.roomLabels;
  const paths = roomOptionPathsByLanguage[data.language];

  const roomOptions = [
    {
      name: labels.budgetDoubleRoom,
      description: `${labels.budgetDoubleRoom}. ${data.hero.description}`,
      url: paths.economy,
      roomId: "economy-double-rooms",
      tags: [labels.room, labels.budget, labels.wifi, labels.airConditioning],
    },
    {
      name: labels.firstFloorDoubleTriple,
      description: `${labels.firstFloorDoubleTriple}. ${data.hero.description}`,
      url: paths.standard,
      roomId: "standard-double-room-first-floor",
      tags: [
        labels.room,
        labels.firstFloor,
        labels.upperFloorView,
        labels.wifi,
        labels.airConditioning,
      ],
    },
    {
      name: labels.groundFloorDoubleTriple,
      description: `${labels.groundFloorDoubleTriple}. ${data.hero.description}`,
      url: paths.standard,
      roomId: "standard-double-room-ground-floor",
      tags: [
        labels.room,
        labels.groundFloor,
        labels.noStairs,
        labels.wifi,
        labels.airConditioning,
      ],
    },
    {
      name: labels.apartmentType,
      description: `${labels.apartmentType}. ${data.hero.description}`,
      url: paths.apartments,
      roomId: "family-chios-apartments",
      tags: [
        labels.apartment,
        labels.kitchen,
        labels.twoSpaces,
        labels.gardenView,
        labels.airConditioning,
      ],
    },
  ];

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "room-options"),
    name: data.engine.results.title,
    description: data.engine.results.noPerfectMatchText,
    inLanguage: language,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: roomOptions.length,
    itemListElement: roomOptions.map((room, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: room.name,
      description: room.description,
      url: absoluteUrl(room.url),
      item: {
        "@type": "Accommodation",
        "@id": schemaId(room.url, "room"),
        name: room.name,
        url: absoluteUrl(room.url),
        description: room.description,
        inLanguage: language,
        containedInPlace: {
          "@id": hotelId(),
        },
        amenityFeature: room.tags.map((tag) => ({
          "@type": "LocationFeatureSpecification",
          name: tag,
          value: true,
        })),
        additionalProperty: {
          "@type": "PropertyValue",
          name: data.engine.results.room,
          value: room.roomId,
        },
      },
    })),
  };
}

function buildReserveActionSchema(data: FindYourRoomPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ReserveAction",
    "@id": schemaId(canonicalPath, "reserve-action"),
    name: data.engine.contact.whatsapp,
    description: data.engine.contact.subtitle,
    inLanguage: getLanguageForPath(canonicalPath),
    target: {
      "@type": "EntryPoint",
      urlTemplate: getCanonicalUrl(canonicalPath),
      actionPlatform: [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform",
      ],
    },
    object: {
      "@id": hotelId(),
    },
    result: {
      "@type": "LodgingReservation",
      name: data.engine.contact.title,
    },
  };
}

function buildDirectBookingBenefitsSchema(data: FindYourRoomPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  const benefits = [
    {
      name: data.engine.topBenefits.live,
      description: data.engine.filters.checking,
    },
    {
      name: data.engine.topBenefits.directContact,
      description: data.engine.contact.subtitle,
    },
    {
      name: data.engine.topBenefits.discount,
      description: data.engine.results.bestPriceGuarantee,
    },
    {
      name: data.engine.topBenefits.commissions,
      description: data.engine.contact.subtitle,
    },
  ];

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "direct-booking-benefits"),
    name: data.engine.basics.title,
    inLanguage: getLanguageForPath(canonicalPath),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: benefits.length,
    itemListElement: benefits.map((benefit, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: benefit.name,
      description: benefit.description,
    })),
  };
}

export function buildFindYourRoomSchema(data: FindYourRoomPageData) {
  const canonicalPath = data.seo.canonicalPath;

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ path: canonicalPath }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.seo.ogImage,
        alt: data.hero.title,
        caption: `${data.hero.title} - ${siteName}`,
      },
      canonicalPath,
    ),
    buildFindYourRoomWebPageSchema(data),
    buildRoomFinderActionSchema(data),
    buildRoomOptionsItemListSchema(data),
    buildDirectBookingBenefitsSchema(data),
    buildReserveActionSchema(data),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: data.hero.title,
        path: canonicalPath,
      },
    ]),
  ]);
}
