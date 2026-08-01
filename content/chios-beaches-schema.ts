import type { ChiosBeachesPageData } from "@/content/chios-beaches";
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
  itemListId,
  primaryImageId,
  schemaId,
  webPageId,
  websiteId,
  type SchemaObject,
} from "@/lib/structured-data";

type BeachSchemaLanguage = "en" | "el" | "de" | "fr" | "it" | "es" | "tr";

const beachSchemaLabelsByLanguage: Record<
  BeachSchemaLanguage,
  {
    chiosIsland: string;
    chiosIslandPath: string;
    chiosBeaches: string;
    topChiosBeaches: string;
    region: string;
    mood: string;
    tags: string;
    addressRegion: string;
  }
> = {
  en: {
    chiosIsland: "Chios Island",
    chiosIslandPath: "/chios-island/",
    chiosBeaches: "Chios Beaches",
    topChiosBeaches: "Top Chios beaches",
    region: "Region",
    mood: "Mood",
    tags: "Tags",
    addressRegion: "North Aegean",
  },
  el: {
    chiosIsland: "Νησί Χίος",
    chiosIslandPath: "/el/ti-na-do-sti-xio/",
    chiosBeaches: "Παραλίες Χίου",
    topChiosBeaches: "Κορυφαίες παραλίες της Χίου",
    region: "Περιοχή",
    mood: "Ύφος",
    tags: "Χαρακτηριστικά",
    addressRegion: "Βόρειο Αιγαίο",
  },
  de: {
    chiosIsland: "Insel Chios",
    chiosIslandPath: "/de/chios-insel/",
    chiosBeaches: "Strände von Chios",
    topChiosBeaches: "Die schönsten Strände auf Chios",
    region: "Region",
    mood: "Atmosphäre",
    tags: "Merkmale",
    addressRegion: "Nördliche Ägäis",
  },
  fr: {
    chiosIsland: "Île de Chios",
    chiosIslandPath: "/fr/chios-en-grece/",
    chiosBeaches: "Plages de Chios",
    topChiosBeaches: "Les plus belles plages de Chios",
    region: "Région",
    mood: "Ambiance",
    tags: "Caractéristiques",
    addressRegion: "Égée du Nord",
  },
  it: {
    chiosIsland: "Isola di Chios",
    chiosIslandPath: "/it/isola-di-chios/",
    chiosBeaches: "Spiagge di Chios",
    topChiosBeaches: "Le migliori spiagge di Chios",
    region: "Regione",
    mood: "Atmosfera",
    tags: "Caratteristiche",
    addressRegion: "Egeo Settentrionale",
  },
  es: {
    chiosIsland: "Isla de Quíos",
    chiosIslandPath: "/es/isla-de-quios/",
    chiosBeaches: "Playas de Quíos",
    topChiosBeaches: "Las mejores playas de Quíos",
    region: "Región",
    mood: "Ambiente",
    tags: "Características",
    addressRegion: "Egeo Septentrional",
  },
  tr: {
    chiosIsland: "Sakız Adası",
    chiosIslandPath: "/tr/sakiz-adasi/",
    chiosBeaches: "Sakız Plajları",
    topChiosBeaches: "Sakız Adası’nın en iyi plajları",
    region: "Bölge",
    mood: "Atmosfer",
    tags: "Özellikler",
    addressRegion: "Kuzey Ege",
  },
};

function isBeachSchemaLanguage(language: string): language is BeachSchemaLanguage {
  return ["en", "el", "de", "fr", "it", "es", "tr"].includes(language);
}

function getBeachSchemaLabels(path: string) {
  const language = getLanguageForPath(path);
  return beachSchemaLabelsByLanguage[isBeachSchemaLanguage(language) ? language : "en"];
}

function buildChiosBeachesCollectionPageSchema(
  data: ChiosBeachesPageData,
): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);
  const labels = getBeachSchemaLabels(canonicalPath);

  return {
    "@type": "CollectionPage",
    "@id": webPageId(canonicalPath),
    url: getCanonicalUrl(canonicalPath),
    name: data.seo.title,
    headline: data.hero.title,
    description: data.seo.description,
    inLanguage: language,
    isPartOf: {
      "@id": websiteId(),
    },
    about: [
      {
        "@id": schemaId(labels.chiosIslandPath, "destination"),
      },
      {
        "@id": hotelId(),
      },
    ],
    mainEntity: {
      "@id": itemListId(canonicalPath),
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

function buildBeachPlaceSchema(
  beach: ChiosBeachesPageData["beaches"][number],
  collectionPath: string,
  destinationPath: string,
): SchemaObject {
  const labels = getBeachSchemaLabels(beach.href);

  return {
    "@type": ["Beach", "TouristAttraction"],
    "@id": schemaId(beach.href, "beach"),
    name: beach.name,
    alternateName: beach.title,
    url: absoluteUrl(beach.href),
    description: beach.description,
    image: absoluteUrl(beach.image),
    inLanguage: getLanguageForPath(beach.href),
    address: {
      "@type": "PostalAddress",
      addressLocality: beach.region,
      addressRegion: labels.addressRegion,
      addressCountry: "GR",
    },
    touristType: beach.badges,
    isPartOf: [
      {
        "@id": schemaId(destinationPath, "destination"),
      },
      {
        "@id": webPageId(collectionPath),
      },
    ],
    subjectOf: {
      "@id": webPageId(beach.href),
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: labels.region,
        value: beach.region,
      },
      {
        "@type": "PropertyValue",
        name: labels.mood,
        value: beach.mood,
      },
      {
        "@type": "PropertyValue",
        name: labels.tags,
        value: beach.badges.join(", "),
      },
    ],
  };
}

function buildBeachesItemListSchema(data: ChiosBeachesPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;
  const labels = getBeachSchemaLabels(canonicalPath);

  return {
    "@type": "ItemList",
    "@id": itemListId(canonicalPath),
    name: labels.topChiosBeaches,
    description: data.intro.description,
    inLanguage: getLanguageForPath(canonicalPath),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.beaches.length,
    itemListElement: data.beaches.map((beach, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: beach.name,
      description: beach.description,
      url: absoluteUrl(beach.href),
      image: absoluteUrl(beach.image),
      item: {
        "@id": schemaId(beach.href, "beach"),
      },
    })),
  };
}

function buildBeachPlanningSchema(data: ChiosBeachesPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "beach-planning"),
    name: data.planning.title,
    description: data.planning.description,
    inLanguage: getLanguageForPath(canonicalPath),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.planning.items.length,
    itemListElement: data.planning.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.text,
    })),
  };
}

function buildBeachGuideTipSchema(data: ChiosBeachesPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "CreativeWork",
    "@id": schemaId(canonicalPath, "local-beach-tip"),
    name: data.intro.tip.title,
    text: data.intro.tip.text,
    url: absoluteUrl(data.intro.tip.href),
    inLanguage: getLanguageForPath(canonicalPath),
    about: {
      "@id": hotelId(),
    },
  };
}

function buildBeachStayActionSchema(data: ChiosBeachesPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ReserveAction",
    "@id": schemaId(canonicalPath, "reserve-action"),
    name: data.stay.primaryCta.label,
    description: data.stay.text,
    inLanguage: getLanguageForPath(canonicalPath),
    target: {
      "@type": "EntryPoint",
      urlTemplate: absoluteUrl(data.stay.primaryCta.href),
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
      name: data.stay.title,
    },
  };
}

export function buildChiosBeachesSchema(data: ChiosBeachesPageData) {
  const canonicalPath = data.seo.canonicalPath;
  const labels = getBeachSchemaLabels(canonicalPath);

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ path: canonicalPath }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.seo.ogImage || data.hero.image,
        alt: data.hero.title,
        caption: `${data.hero.title} - ${siteName}`,
      },
      canonicalPath,
    ),
    buildChiosBeachesCollectionPageSchema(data),
    buildBeachesItemListSchema(data),
    buildBeachPlanningSchema(data),
    buildBeachGuideTipSchema(data),
    ...data.beaches.map((beach) =>
      buildBeachPlaceSchema(beach, canonicalPath, labels.chiosIslandPath),
    ),
    buildBeachStayActionSchema(data),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: labels.chiosIsland,
        path: labels.chiosIslandPath,
      },
      {
        name: labels.chiosBeaches,
        path: canonicalPath,
      },
    ]),
  ]);
}
