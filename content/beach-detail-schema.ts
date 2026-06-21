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
    chiosIsland: "\u039d\u03b7\u03c3\u03af \u03a7\u03af\u03bf\u03c2",
    chiosBeaches: "\u03a0\u03b1\u03c1\u03b1\u03bb\u03af\u03b5\u03c2 \u03a7\u03af\u03bf\u03c5",
    distanceFromVoulamandis: "\u0391\u03c0\u03cc\u03c3\u03c4\u03b1\u03c3\u03b7 \u03b1\u03c0\u03cc \u03c4\u03bf Voulamandis House",
    travelTimeFromVoulamandis: "\u03a7\u03c1\u03cc\u03bd\u03bf\u03c2 \u03b4\u03b9\u03b1\u03b4\u03c1\u03bf\u03bc\u03ae\u03c2 \u03b1\u03c0\u03cc \u03c4\u03bf Voulamandis House",
    tags: "\u0395\u03c4\u03b9\u03ba\u03ad\u03c4\u03b5\u03c2",
    travelDetails: "\u03c0\u03bb\u03b7\u03c1\u03bf\u03c6\u03bf\u03c1\u03af\u03b5\u03c2 \u03c0\u03c1\u03cc\u03c3\u03b2\u03b1\u03c3\u03b7\u03c2",
    beachGuideBy: "\u03bf\u03b4\u03b7\u03b3\u03cc\u03c2 \u03c0\u03b1\u03c1\u03b1\u03bb\u03af\u03b1\u03c2 \u03a7\u03af\u03bf\u03c5 \u03b1\u03c0\u03cc",
    stayNearChiosBeaches: "\u03b4\u03b9\u03b1\u03bc\u03bf\u03bd\u03ae \u03ba\u03bf\u03bd\u03c4\u03ac \u03c3\u03c4\u03b9\u03c2 \u03c0\u03b1\u03c1\u03b1\u03bb\u03af\u03b5\u03c2 \u03c4\u03b7\u03c2 \u03a7\u03af\u03bf\u03c5",
    addressLocality: "\u03a7\u03af\u03bf\u03c2",
    addressRegion: "\u0392\u03cc\u03c1\u03b5\u03b9\u03bf \u0391\u03b9\u03b3\u03b1\u03af\u03bf",
  },
  de: {
    chiosIsland: "Insel Chios",
    chiosBeaches: "Str\u00e4nde von Chios",
    distanceFromVoulamandis: "Entfernung vom Voulamandis House",
    travelTimeFromVoulamandis: "Fahrzeit vom Voulamandis House",
    tags: "Merkmale",
    travelDetails: "Reisedetails",
    beachGuideBy: "Strandf\u00fchrer f\u00fcr Chios von",
    stayNearChiosBeaches: "Aufenthalt in der N\u00e4he der Str\u00e4nde von Chios",
    addressLocality: "Chios",
    addressRegion: "N\u00f6rdliche \u00c4g\u00e4is",
  },
  fr: {
    chiosIsland: "\u00cele de Chios",
    chiosBeaches: "Plages de Chios",
    distanceFromVoulamandis: "Distance depuis Voulamandis House",
    travelTimeFromVoulamandis: "Temps de trajet depuis Voulamandis House",
    tags: "Caract\u00e9ristiques",
    travelDetails: "informations d\u2019acc\u00e8s",
    beachGuideBy: "guide des plages de Chios par",
    stayNearChiosBeaches: "s\u00e9jour pr\u00e8s des plages de Chios",
    addressLocality: "Chios",
    addressRegion: "\u00c9g\u00e9e du Nord",
  },
  it: {
    chiosIsland: "Isola di Chios",
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
    chiosIsland: "Isla de Qu\u00edos",
    chiosBeaches: "Playas de Qu\u00edos",
    distanceFromVoulamandis: "Distancia desde Voulamandis House",
    travelTimeFromVoulamandis: "Tiempo de trayecto desde Voulamandis House",
    tags: "Caracter\u00edsticas",
    travelDetails: "detalles de viaje",
    beachGuideBy: "gu\u00eda de playas de Qu\u00edos por",
    stayNearChiosBeaches: "estancia cerca de las playas de Qu\u00edos",
    addressLocality: "Qu\u00edos",
    addressRegion: "Egeo Septentrional",
  },
  tr: {
    chiosIsland: "Sak\u0131z Adas\u0131",
    chiosBeaches: "Sak\u0131z Plajlar\u0131",
    distanceFromVoulamandis: "Voulamandis House\u2019a uzakl\u0131k",
    travelTimeFromVoulamandis: "Voulamandis House\u2019tan yolculuk s\u00fcresi",
    tags: "\u00d6zellikler",
    travelDetails: "ula\u015f\u0131m bilgileri",
    beachGuideBy: "Sak\u0131z plaj rehberi",
    stayNearChiosBeaches: "Sak\u0131z plajlar\u0131na yak\u0131n konaklama",
    addressLocality: "Sak\u0131z",
    addressRegion: "Kuzey Ege",
  },
};

function isBeachDetailSchemaLanguage(language: string): language is BeachDetailSchemaLanguage {
  return ["en", "el", "de", "fr", "it", "es", "tr"].includes(language);
}

function getBeachDetailSchemaLabels(language: string) {
  return beachDetailSchemaLabelsByLanguage[isBeachDetailSchemaLanguage(language) ? language : "en"];
}

function buildBeachWebPageSchema(beach: BeachDetailData): SchemaObject {
  const canonicalPath = beach.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);

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
        "@id": schemaId("/chios-island/", "destination"),
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
  const labels = getBeachDetailSchemaLabels(getLanguageForPath(canonicalPath));

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
    address: {
      "@type": "PostalAddress",
      addressLocality: labels.addressLocality,
      addressRegion: labels.addressRegion,
      addressCountry: "GR",
    },
    touristType: beach.hero.tags,
    isPartOf: {
      "@id": schemaId("/chios-island/", "destination"),
    },
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
    about: {
      "@id": schemaId(canonicalPath, "beach"),
    },
  };
}

function buildBeachDetailsItemListSchema(beach: BeachDetailData): SchemaObject {
  const canonicalPath = beach.seo.canonicalPath;
  const labels = getBeachDetailSchemaLabels(getLanguageForPath(canonicalPath));

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "beach-details"),
    name: `${beach.hero.title} ${labels.travelDetails}`,
    description: beach.hero.description,
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
  const labels = getBeachDetailSchemaLabels(getLanguageForPath(canonicalPath));

  return {
    "@type": "ReserveAction",
    "@id": schemaId(canonicalPath, "reserve-action"),
    name: beach.baseTip.linkLabel,
    description: beach.baseTip.text,
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
  const labels = getBeachDetailSchemaLabels(getLanguageForPath(canonicalPath));

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
        path: "/chios-island/",
      },
      {
        name: labels.chiosBeaches,
        path: "/chios/chios-beaches/",
      },
      {
        name: beach.hero.title,
        path: canonicalPath,
      },
    ]),
  ]);
}




