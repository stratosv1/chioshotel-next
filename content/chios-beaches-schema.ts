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
    chiosBeaches: string;
    topChiosBeaches: string;
    region: string;
    mood: string;
    tags: string;
    addressLocality: string;
    addressRegion: string;
  }
> = {
  en: {
    chiosIsland: "Chios Island",
    chiosBeaches: "Chios Beaches",
    topChiosBeaches: "Top Chios beaches",
    region: "Region",
    mood: "Mood",
    tags: "Tags",
    addressLocality: "Chios",
    addressRegion: "North Aegean",
  },
  el: {
    chiosIsland: "\u039d\u03b7\u03c3\u03af \u03a7\u03af\u03bf\u03c2",
    chiosBeaches: "\u03a0\u03b1\u03c1\u03b1\u03bb\u03af\u03b5\u03c2 \u03a7\u03af\u03bf\u03c5",
    topChiosBeaches: "\u039a\u03bf\u03c1\u03c5\u03c6\u03b1\u03af\u03b5\u03c2 \u03c0\u03b1\u03c1\u03b1\u03bb\u03af\u03b5\u03c2 \u03c4\u03b7\u03c2 \u03a7\u03af\u03bf\u03c5",
    region: "\u03a0\u03b5\u03c1\u03b9\u03bf\u03c7\u03ae",
    mood: "\u038e\u03c6\u03bf\u03c2",
    tags: "\u0395\u03c4\u03b9\u03ba\u03ad\u03c4\u03b5\u03c2",
    addressLocality: "\u03a7\u03af\u03bf\u03c2",
    addressRegion: "\u0392\u03cc\u03c1\u03b5\u03b9\u03bf \u0391\u03b9\u03b3\u03b1\u03af\u03bf",
  },
  de: {
    chiosIsland: "Insel Chios",
    chiosBeaches: "Str\u00e4nde von Chios",
    topChiosBeaches: "Die sch\u00f6nsten Str\u00e4nde auf Chios",
    region: "Region",
    mood: "Atmosph\u00e4re",
    tags: "Merkmale",
    addressLocality: "Chios",
    addressRegion: "N\u00f6rdliche \u00c4g\u00e4is",
  },
  fr: {
    chiosIsland: "\u00cele de Chios",
    chiosBeaches: "Plages de Chios",
    topChiosBeaches: "Les plus belles plages de Chios",
    region: "R\u00e9gion",
    mood: "Ambiance",
    tags: "Caract\u00e9ristiques",
    addressLocality: "Chios",
    addressRegion: "\u00c9g\u00e9e du Nord",
  },
  it: {
    chiosIsland: "Isola di Chios",
    chiosBeaches: "Spiagge di Chios",
    topChiosBeaches: "Le migliori spiagge di Chios",
    region: "Regione",
    mood: "Atmosfera",
    tags: "Caratteristiche",
    addressLocality: "Chios",
    addressRegion: "Egeo Settentrionale",
  },
  es: {
    chiosIsland: "Isla de Qu\u00edos",
    chiosBeaches: "Playas de Qu\u00edos",
    topChiosBeaches: "Las mejores playas de Qu\u00edos",
    region: "Regi\u00f3n",
    mood: "Ambiente",
    tags: "Caracter\u00edsticas",
    addressLocality: "Qu\u00edos",
    addressRegion: "Egeo Septentrional",
  },
  tr: {
    chiosIsland: "Sak\u0131z Adas\u0131",
    chiosBeaches: "Sak\u0131z Plajlar\u0131",
    topChiosBeaches: "Sak\u0131z Adas\u0131\u2019n\u0131n en iyi plajlar\u0131",
    region: "B\u00f6lge",
    mood: "Atmosfer",
    tags: "\u00d6zellikler",
    addressLocality: "Sak\u0131z",
    addressRegion: "Kuzey Ege",
  },
};

function isBeachSchemaLanguage(language: string): language is BeachSchemaLanguage {
  return ["en", "el", "de", "fr", "it", "es", "tr"].includes(language);
}

function getBeachSchemaLabels(language: string) {
  return beachSchemaLabelsByLanguage[isBeachSchemaLanguage(language) ? language : "en"];
}

function buildChiosBeachesCollectionPageSchema(
  data: ChiosBeachesPageData,
): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);

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
        "@id": schemaId("/chios-island/", "destination"),
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
): SchemaObject {
  const labels = getBeachSchemaLabels(getLanguageForPath(beach.href));

  return {
    "@type": ["Beach", "TouristAttraction"],
    "@id": schemaId(beach.href, "beach"),
    name: beach.name,
    alternateName: beach.title,
    url: absoluteUrl(beach.href),
    description: beach.description,
    image: absoluteUrl(beach.image),
    address: {
      "@type": "PostalAddress",
      addressLocality: beach.region,
      addressRegion: labels.addressRegion,
      addressCountry: "GR",
    },
    touristType: beach.badges,
    isPartOf: {
      "@id": schemaId("/chios-island/", "destination"),
    },
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
  const labels = getBeachSchemaLabels(getLanguageForPath(canonicalPath));

  return {
    "@type": "ItemList",
    "@id": itemListId(canonicalPath),
    name: labels.topChiosBeaches,
    description: data.intro.description,
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
      name: `${siteName} stay for a Chios beach holiday`,
    },
  };
}

export function buildChiosBeachesSchema(data: ChiosBeachesPageData) {
  const canonicalPath = data.seo.canonicalPath;
  const labels = getBeachSchemaLabels(getLanguageForPath(canonicalPath));

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ path: data.seo.canonicalPath }),
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
    ...data.beaches.map((beach) => buildBeachPlaceSchema(beach)),
    buildBeachStayActionSchema(data),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: labels.chiosIsland,
        path: "/chios-island/",
      },
      {
        name: labels.chiosBeaches,
        path: canonicalPath,
      },
    ]),
  ]);
}



