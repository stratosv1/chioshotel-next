import type { BeachDetailData } from "@/content/beach-details";
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

type BeachDetailSchemaLanguage = "en" | "el" | "de" | "fr" | "it" | "es" | "tr";

const beachDetailSchemaLabelsByLanguage: Record<
  BeachDetailSchemaLanguage,
  {
    chiosIsland: string;
    chiosIslandPath: string;
    chiosBeaches: string;
    distanceFromVoulamandis: string;
    travelTimeFromVoulamandis: string;
    tags: string;
    travelDetails: string;
    beachGuideBy: string;
    stayNearChiosBeaches: string;
    addressLocality: string;
    addressRegion: string;
  }
> = {
  en: {
    chiosIsland: "Chios Island",
    chiosIslandPath: "/chios-island/",
    chiosBeaches: "Chios Beaches",
    distanceFromVoulamandis: "Distance from Voulamandis House",
    travelTimeFromVoulamandis: "Travel time from Voulamandis House",
    tags: "Tags",
    travelDetails: "travel details",
    beachGuideBy: "Chios beach guide by",
    stayNearChiosBeaches: "stay near Chios beaches",
    addressLocality: "Chios",
    addressRegion: "North Aegean",
  },
  el: {
    chiosIsland: "Νησί Χίος",
    chiosIslandPath: "/el/ti-na-do-sti-xio/",
    chiosBeaches: "Παραλίες Χίου",
    distanceFromVoulamandis: "Απόσταση από το Voulamandis House",
    travelTimeFromVoulamandis: "Χρόνος διαδρομής από το Voulamandis House",
    tags: "Χαρακτηριστικά",
    travelDetails: "πληροφορίες πρόσβασης",
    beachGuideBy: "οδηγός παραλίας Χίου από",
    stayNearChiosBeaches: "διαμονή κοντά στις παραλίες της Χίου",
    addressLocality: "Χίος",
    addressRegion: "Βόρειο Αιγαίο",
  },
  de: {
    chiosIsland: "Insel Chios",
    chiosIslandPath: "/de/chios-insel/",
    chiosBeaches: "Strände von Chios",
    distanceFromVoulamandis: "Entfernung vom Voulamandis House",
    travelTimeFromVoulamandis: "Fahrzeit vom Voulamandis House",
    tags: "Merkmale",
    travelDetails: "Reisedetails",
    beachGuideBy: "Strandführer für Chios von",
    stayNearChiosBeaches: "Aufenthalt in der Nähe der Strände von Chios",
    addressLocality: "Chios",
    addressRegion: "Nördliche Ägäis",
  },
  fr: {
    chiosIsland: "Île de Chios",
    chiosIslandPath: "/fr/chios-en-grece/",
    chiosBeaches: "Plages de Chios",
    distanceFromVoulamandis: "Distance depuis Voulamandis House",
    travelTimeFromVoulamandis: "Temps de trajet depuis Voulamandis House",
    tags: "Caractéristiques",
    travelDetails: "informations d’accès",
    beachGuideBy: "guide des plages de Chios par",
    stayNearChiosBeaches: "séjour près des plages de Chios",
    addressLocality: "Chios",
    addressRegion: "Égée du Nord",
  },
  it: {
    chiosIsland: "Isola di Chios",
    chiosIslandPath: "/it/isola-di-chios/",
    chiosBeaches: "Spiagge di Chios",
    distanceFromVoulamandis: "Distanza da Voulamandis House",
    travelTimeFromVoulamandis: "Tempo di percorrenza da Voulamandis House",
    tags: "Caratteristiche",
    travelDetails: "dettagli di viaggio",
    beachGuideBy: "guida alle spiagge di Chios di",
    stayNearChiosBeaches: "soggiorno vicino alle spiagge di Chios",
    addressLocality: "Chios",
    addressRegion: "Egeo Settentrionale",
  },
  es: {
    chiosIsland: "Isla de Quíos",
    chiosIslandPath: "/es/isla-de-quios/",
    chiosBeaches: "Playas de Quíos",
    distanceFromVoulamandis: "Distancia desde Voulamandis House",
    travelTimeFromVoulamandis: "Tiempo de trayecto desde Voulamandis House",
    tags: "Características",
    travelDetails: "detalles de viaje",
    beachGuideBy: "guía de playas de Quíos por",
    stayNearChiosBeaches: "estancia cerca de las playas de Quíos",
    addressLocality: "Quíos",
    addressRegion: "Egeo Septentrional",
  },
  tr: {
    chiosIsland: "Sakız Adası",
    chiosIslandPath: "/tr/sakiz-adasi/",
    chiosBeaches: "Sakız Plajları",
    distanceFromVoulamandis: "Voulamandis House’a uzaklık",
    travelTimeFromVoulamandis: "Voulamandis House’tan yolculuk süresi",
    tags: "Özellikler",
    travelDetails: "ulaşım bilgileri",
    beachGuideBy: "Sakız plaj rehberi",
    stayNearChiosBeaches: "Sakız plajlarına yakın konaklama",
    addressLocality: "Sakız",
    addressRegion: "Kuzey Ege",
  },
};

function isBeachDetailSchemaLanguage(
  language: string,
): language is BeachDetailSchemaLanguage {
  return ["en", "el", "de", "fr", "it", "es", "tr"].includes(language);
}

function getBeachDetailSchemaLabels(path: string) {
  const language = getLanguageForPath(path);
  return beachDetailSchemaLabelsByLanguage[
    isBeachDetailSchemaLanguage(language) ? language : "en"
  ];
}

function getParentPath(path: string): string {
  const segments = path.split("/").filter(Boolean);
  segments.pop();
  return `/${segments.join("/")}/`;
}

function buildBeachWebPageSchema(beach: BeachDetailData): SchemaObject {
  const canonicalPath = beach.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);
  const labels = getBeachDetailSchemaLabels(canonicalPath);

  return {
    "@type": "WebPage",
    "@id": webPageId(canonicalPath),
    url: getCanonicalUrl(canonicalPath),
    name: beach.seo.title,
    headline: beach.hero.title,
    description: beach.seo.description,
    inLanguage: language,
    isPartOf: {
      "@id": websiteId(),
    },
    about: [
      {
        "@id": schemaId(canonicalPath, "beach"),
      },
      {
        "@id": schemaId(labels.chiosIslandPath, "destination"),
      },
      {
        "@id": hotelId(),
      },
    ],
    mainEntity: {
      "@id": schemaId(canonicalPath, "beach"),
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

function buildBeachPlaceSchema(beach: BeachDetailData): SchemaObject {
  const canonicalPath = beach.seo.canonicalPath;
  const labels = getBeachDetailSchemaLabels(canonicalPath);

  return {
    "@type": ["Beach", "TouristAttraction"],
    "@id": schemaId(canonicalPath, "beach"),
    name: beach.hero.title,
    alternateName: beach.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    url: getCanonicalUrl(canonicalPath),
    description: beach.hero.description,
    image: absoluteUrl(beach.hero.image || beach.seo.ogImage),
    inLanguage: getLanguageForPath(canonicalPath),
    address: {
      "@type": "PostalAddress",
      addressLocality: labels.addressLocality,
      addressRegion: labels.addressRegion,
      addressCountry: "GR",
    },
    touristType: beach.hero.tags,
    isPartOf: [
      {
        "@id": schemaId(labels.chiosIslandPath, "destination"),
      },
      {
        "@id": webPageId(getParentPath(canonicalPath)),
      },
    ],
    subjectOf: {
      "@id": webPageId(canonicalPath),
    },
    hasMap: beach.media.map.gpsHref,
    additionalProperty: [
      ...beach.details.map((detail) => ({
        "@type": "PropertyValue",
        name: detail.title,
        value: detail.text,
      })),
      {
        "@type": "PropertyValue",
        name: labels.distanceFromVoulamandis,
        value: beach.media.map.distance,
      },
      {
        "@type": "PropertyValue",
        name: labels.travelTimeFromVoulamandis,
        value: beach.media.map.time,
      },
      {
        "@type": "PropertyValue",
        name: labels.tags,
        value: beach.hero.tags.join(", "),
      },
    ],
  };
}

function buildBeachVideoSchema(beach: BeachDetailData): SchemaObject {
  const canonicalPath = beach.seo.canonicalPath;

  return {
    "@type": "VideoObject",
    "@id": schemaId(canonicalPath, "video"),
    name: beach.media.video.title,
    description: beach.hero.description,
    thumbnailUrl: [absoluteUrl(beach.hero.image || beach.seo.ogImage)],
    uploadDate: "2026-01-01",
    embedUrl: beach.media.video.embedUrl,
    url: beach.media.video.embedUrl,
    creditText: beach.media.video.creditText,
    inLanguage: getLanguageForPath(canonicalPath),
    creator: {
      "@type": "Organization",
      name: beach.media.video.creditLabel,
      url: beach.media.video.creditHref,
    },
    about: {
      "@id": schemaId(canonicalPath, "beach"),
    },
    isPartOf: {
      "@id": webPageId(canonicalPath),
    },
  };
}

function buildBeachMapSchema(beach: BeachDetailData): SchemaObject {
  const canonicalPath = beach.seo.canonicalPath;

  return {
    "@type": "Map",
    "@id": schemaId(canonicalPath, "map"),
    name: beach.media.map.title,
    url: beach.media.map.gpsHref,
    mapType: "VenueMap",
    inLanguage: getLanguageForPath(canonicalPath),
    about: {
      "@id": schemaId(canonicalPath, "beach"),
    },
  };
}

function buildBeachDetailsItemListSchema(beach: BeachDetailData): SchemaObject {
  const canonicalPath = beach.seo.canonicalPath;
  const labels = getBeachDetailSchemaLabels(canonicalPath);

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "beach-details"),
    name: `${beach.hero.title} ${labels.travelDetails}`,
    description: beach.hero.description,
    inLanguage: getLanguageForPath(canonicalPath),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: beach.details.length,
    itemListElement: beach.details.map((detail, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: detail.title,
      description: detail.text,
    })),
  };
}

function buildBeachLocalTipSchema(beach: BeachDetailData): SchemaObject {
  const canonicalPath = beach.seo.canonicalPath;

  return {
    "@type": "CreativeWork",
    "@id": schemaId(canonicalPath, "local-tip"),
    name: beach.baseTip.title,
    text: beach.baseTip.text,
    url: absoluteUrl(beach.baseTip.href),
    inLanguage: getLanguageForPath(canonicalPath),
    about: [
      {
        "@id": schemaId(canonicalPath, "beach"),
      },
      {
        "@id": hotelId(),
      },
    ],
  };
}

function buildBeachStayActionSchema(beach: BeachDetailData): SchemaObject {
  const canonicalPath = beach.seo.canonicalPath;
  const labels = getBeachDetailSchemaLabels(canonicalPath);

  return {
    "@type": "ReserveAction",
    "@id": schemaId(canonicalPath, "reserve-action"),
    name: beach.baseTip.linkLabel,
    description: beach.baseTip.text,
    inLanguage: getLanguageForPath(canonicalPath),
    target: {
      "@type": "EntryPoint",
      urlTemplate: absoluteUrl(beach.baseTip.href),
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
      name: `${siteName} ${labels.stayNearChiosBeaches}`,
    },
  };
}

export function buildBeachDetailSchema(beach: BeachDetailData) {
  const canonicalPath = beach.seo.canonicalPath;
  const labels = getBeachDetailSchemaLabels(canonicalPath);
  const beachesPath = getParentPath(canonicalPath);

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ path: canonicalPath }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: beach.seo.ogImage || beach.hero.image,
        alt: beach.hero.title,
        caption: `${beach.hero.title} - ${labels.beachGuideBy} ${siteName}`,
      },
      canonicalPath,
    ),
    buildBeachWebPageSchema(beach),
    buildBeachPlaceSchema(beach),
    buildBeachVideoSchema(beach),
    buildBeachMapSchema(beach),
    buildBeachDetailsItemListSchema(beach),
    buildBeachLocalTipSchema(beach),
    buildBeachStayActionSchema(beach),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: labels.chiosIsland,
        path: labels.chiosIslandPath,
      },
      {
        name: labels.chiosBeaches,
        path: beachesPath,
      },
      {
        name: beach.hero.title,
        path: canonicalPath,
      },
    ]),
  ]);
}
