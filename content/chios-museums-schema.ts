import type { ChiosMuseumsPageData } from "@/content/chios-museums";
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

type MuseumSchemaLanguage = "en" | "el" | "de" | "fr" | "it" | "es" | "tr";

const propertyLabels: Record<
  MuseumSchemaLanguage,
  { region: string; theme: string; tags: string }
> = {
  en: { region: "Region", theme: "Theme", tags: "Tags" },
  el: { region: "Περιοχή", theme: "Θεματική", tags: "Χαρακτηριστικά" },
  de: { region: "Region", theme: "Thema", tags: "Merkmale" },
  fr: { region: "Région", theme: "Thème", tags: "Caractéristiques" },
  it: { region: "Regione", theme: "Tema", tags: "Caratteristiche" },
  es: { region: "Región", theme: "Tema", tags: "Características" },
  tr: { region: "Bölge", theme: "Tema", tags: "Özellikler" },
};

function getMuseumSchemaLanguage(path: string): MuseumSchemaLanguage {
  const language = getLanguageForPath(path);
  return ["en", "el", "de", "fr", "it", "es", "tr"].includes(language)
    ? (language as MuseumSchemaLanguage)
    : "en";
}

function buildChiosMuseumsCollectionPageSchema(
  data: ChiosMuseumsPageData,
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

function buildMuseumPlaceSchema(
  museum: ChiosMuseumsPageData["museums"][number],
  collectionPath: string,
): SchemaObject {
  const language = getLanguageForPath(museum.href);
  const labels = propertyLabels[getMuseumSchemaLanguage(museum.href)];
  const address = getLocalizedSchemaAddress(museum.href);

  return {
    "@type": ["Museum", "TouristAttraction"],
    "@id": schemaId(museum.href, "museum"),
    name: museum.name,
    alternateName: museum.title,
    url: absoluteUrl(museum.href),
    description: museum.description,
    image: absoluteUrl(museum.image),
    inLanguage: language,
    address: {
      "@type": "PostalAddress",
      addressLocality: museum.region || address.addressLocality,
      addressRegion: address.addressRegion,
      addressCountry: "GR",
    },
    touristType: museum.badges,
    isPartOf: {
      "@id": webPageId(collectionPath),
    },
    subjectOf: {
      "@id": webPageId(museum.href),
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: labels.region,
        value: museum.region,
      },
      {
        "@type": "PropertyValue",
        name: labels.theme,
        value: museum.mood,
      },
      {
        "@type": "PropertyValue",
        name: labels.tags,
        value: museum.badges.join(", "),
      },
    ],
  };
}

function buildMuseumsItemListSchema(data: ChiosMuseumsPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": itemListId(canonicalPath),
    name: data.hero.title,
    description: data.intro.description,
    inLanguage: getLanguageForPath(canonicalPath),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.museums.length,
    itemListElement: data.museums.map((museum, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: museum.name,
      description: museum.description,
      url: absoluteUrl(museum.href),
      image: absoluteUrl(museum.image),
      item: {
        "@id": schemaId(museum.href, "museum"),
      },
    })),
  };
}

function buildMuseumPlanningSchema(data: ChiosMuseumsPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "museum-planning"),
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

function buildMuseumGuideTipSchema(data: ChiosMuseumsPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "CreativeWork",
    "@id": schemaId(canonicalPath, "local-museum-tip"),
    name: data.intro.tip.title,
    text: data.intro.tip.text,
    url: absoluteUrl(data.intro.tip.href),
    inLanguage: getLanguageForPath(canonicalPath),
    about: [
      {
        "@id": itemListId(canonicalPath),
      },
      {
        "@id": hotelId(),
      },
    ],
  };
}

function buildMuseumStayActionSchema(data: ChiosMuseumsPageData): SchemaObject {
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

export function buildChiosMuseumsSchema(data: ChiosMuseumsPageData) {
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
    buildChiosMuseumsCollectionPageSchema(data),
    buildMuseumsItemListSchema(data),
    buildMuseumPlanningSchema(data),
    buildMuseumGuideTipSchema(data),
    ...data.museums.map((museum) =>
      buildMuseumPlaceSchema(museum, canonicalPath),
    ),
    buildMuseumStayActionSchema(data),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: data.hero.title,
        path: canonicalPath,
      },
    ]),
  ]);
}
