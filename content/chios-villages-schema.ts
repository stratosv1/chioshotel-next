import type { ChiosVillagesPageData } from "@/content/chios-villages";
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
  getLocalizedSchemaAddress,
  hotelId,
  itemListId,
  primaryImageId,
  schemaId,
  webPageId,
  websiteId,
  type SchemaObject,
} from "@/lib/structured-data";

type VillageSchemaLanguage = "en" | "el" | "de" | "fr" | "it" | "es" | "tr";

const propertyLabels: Record<
  VillageSchemaLanguage,
  { region: string; mood: string; tags: string }
> = {
  en: { region: "Region", mood: "Mood", tags: "Tags" },
  el: { region: "Περιοχή", mood: "Ατμόσφαιρα", tags: "Χαρακτηριστικά" },
  de: { region: "Region", mood: "Atmosphäre", tags: "Merkmale" },
  fr: { region: "Région", mood: "Ambiance", tags: "Caractéristiques" },
  it: { region: "Regione", mood: "Atmosfera", tags: "Caratteristiche" },
  es: { region: "Región", mood: "Ambiente", tags: "Características" },
  tr: { region: "Bölge", mood: "Atmosfer", tags: "Özellikler" },
};

function getVillageSchemaLanguage(path: string): VillageSchemaLanguage {
  const language = getLanguageForPath(path);
  return ["en", "el", "de", "fr", "it", "es", "tr"].includes(language)
    ? (language as VillageSchemaLanguage)
    : "en";
}

function buildChiosVillagesCollectionPageSchema(
  data: ChiosVillagesPageData,
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
    about: {
      "@id": hotelId(),
    },
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

function buildVillagePlaceSchema(
  village: ChiosVillagesPageData["villages"][number],
  collectionPath: string,
): SchemaObject {
  const language = getLanguageForPath(village.href);
  const labels = propertyLabels[getVillageSchemaLanguage(village.href)];
  const address = getLocalizedSchemaAddress(village.href);

  return {
    "@type": ["Place", "TouristAttraction"],
    "@id": schemaId(village.href, "place"),
    name: village.name,
    alternateName: village.title,
    url: absoluteUrl(village.href),
    description: village.description,
    image: absoluteUrl(village.image),
    inLanguage: language,
    address: {
      "@type": "PostalAddress",
      addressLocality: village.region || address.addressLocality,
      addressRegion: address.addressRegion,
      addressCountry: "GR",
    },
    touristType: village.badges,
    isPartOf: {
      "@id": webPageId(collectionPath),
    },
    subjectOf: {
      "@id": webPageId(village.href),
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: labels.region,
        value: village.region,
      },
      {
        "@type": "PropertyValue",
        name: labels.mood,
        value: village.mood,
      },
      {
        "@type": "PropertyValue",
        name: labels.tags,
        value: village.badges.join(", "),
      },
    ],
  };
}

function buildVillagesItemListSchema(data: ChiosVillagesPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": itemListId(canonicalPath),
    name: data.hero.title,
    description: data.intro.description,
    inLanguage: getLanguageForPath(canonicalPath),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.villages.length,
    itemListElement: data.villages.map((village, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: village.name,
      description: village.description,
      url: absoluteUrl(village.href),
      image: absoluteUrl(village.image),
      item: {
        "@id": schemaId(village.href, "place"),
      },
    })),
  };
}

function buildVillagePlanningSchema(data: ChiosVillagesPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "village-planning"),
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

function buildVillageGuideTipSchema(data: ChiosVillagesPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "CreativeWork",
    "@id": schemaId(canonicalPath, "local-village-tip"),
    name: data.intro.tip.title,
    text: data.intro.tip.text,
    url: absoluteUrl(data.intro.tip.href),
    inLanguage: getLanguageForPath(canonicalPath),
    about: {
      "@id": hotelId(),
    },
  };
}

function buildVillageStayActionSchema(data: ChiosVillagesPageData): SchemaObject {
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

export function buildChiosVillagesSchema(data: ChiosVillagesPageData) {
  const canonicalPath = data.seo.canonicalPath;

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
    buildChiosVillagesCollectionPageSchema(data),
    buildVillagesItemListSchema(data),
    buildVillagePlanningSchema(data),
    buildVillageGuideTipSchema(data),
    ...data.villages.map((village) =>
      buildVillagePlaceSchema(village, canonicalPath),
    ),
    buildVillageStayActionSchema(data),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: data.hero.title,
        path: canonicalPath,
      },
    ]),
  ]);
}
