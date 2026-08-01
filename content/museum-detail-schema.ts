import type { MuseumDetailData } from "@/content/museum-details";
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
  primaryImageId,
  schemaId,
  webPageId,
  websiteId,
  type SchemaObject,
} from "@/lib/structured-data";

type MuseumDetailSchemaLanguage = "en" | "el" | "de" | "fr" | "it" | "es" | "tr";

const labelsByLanguage: Record<
  MuseumDetailSchemaLanguage,
  { category: string; tags: string; details: string }
> = {
  en: { category: "Chios Museums", tags: "Museum characteristics", details: "details" },
  el: { category: "Μουσεία της Χίου", tags: "Χαρακτηριστικά μουσείου", details: "πληροφορίες" },
  de: { category: "Museen auf Chios", tags: "Museumsmerkmale", details: "Informationen" },
  fr: { category: "Musées de Chios", tags: "Caractéristiques du musée", details: "informations" },
  it: { category: "Musei di Chios", tags: "Caratteristiche del museo", details: "informazioni" },
  es: { category: "Museos de Quíos", tags: "Características del museo", details: "información" },
  tr: { category: "Sakız Adası Müzeleri", tags: "Müze özellikleri", details: "bilgileri" },
};

function getSchemaLanguage(path: string): MuseumDetailSchemaLanguage {
  const language = getLanguageForPath(path);
  return ["en", "el", "de", "fr", "it", "es", "tr"].includes(language)
    ? (language as MuseumDetailSchemaLanguage)
    : "en";
}

function getParentPath(path: string): string {
  const segments = path.split("/").filter(Boolean);
  segments.pop();
  return `/${segments.join("/")}/`;
}

function buildMuseumWebPageSchema(museum: MuseumDetailData): SchemaObject {
  const canonicalPath = museum.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);

  return {
    "@type": "WebPage",
    "@id": webPageId(canonicalPath),
    url: getCanonicalUrl(canonicalPath),
    name: museum.seo.title,
    headline: museum.hero.title,
    description: museum.seo.description,
    inLanguage: language,
    isPartOf: {
      "@id": websiteId(),
    },
    about: [
      {
        "@id": schemaId(canonicalPath, "museum"),
      },
      {
        "@id": hotelId(),
      },
    ],
    mainEntity: {
      "@id": schemaId(canonicalPath, "museum"),
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

function buildMuseumPlaceSchema(museum: MuseumDetailData): SchemaObject {
  const canonicalPath = museum.seo.canonicalPath;
  const parentPath = getParentPath(canonicalPath);
  const labels = labelsByLanguage[getSchemaLanguage(canonicalPath)];
  const address = getLocalizedSchemaAddress(canonicalPath);

  return {
    "@type": ["Museum", "TouristAttraction"],
    "@id": schemaId(canonicalPath, "museum"),
    name: museum.hero.title,
    alternateName: museum.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    url: getCanonicalUrl(canonicalPath),
    description: museum.hero.description || museum.seo.description,
    image: absoluteUrl(museum.hero.image || museum.seo.ogImage),
    inLanguage: getLanguageForPath(canonicalPath),
    address: {
      "@type": "PostalAddress",
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      addressCountry: "GR",
    },
    touristType: museum.hero.tags,
    isAccessibleForFree: false,
    isPartOf: {
      "@id": webPageId(parentPath),
    },
    subjectOf: {
      "@id": webPageId(canonicalPath),
    },
    additionalProperty: [
      ...museum.details.map((detail) => ({
        "@type": "PropertyValue",
        name: detail.title,
        value: detail.text,
      })),
      {
        "@type": "PropertyValue",
        name: labels.tags,
        value: museum.hero.tags.join(", "),
      },
    ],
  };
}

function buildMuseumDetailsItemListSchema(
  museum: MuseumDetailData,
): SchemaObject {
  const canonicalPath = museum.seo.canonicalPath;
  const labels = labelsByLanguage[getSchemaLanguage(canonicalPath)];

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "museum-details"),
    name: `${museum.hero.title} — ${labels.details}`,
    description: museum.hero.description,
    inLanguage: getLanguageForPath(canonicalPath),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: museum.details.length,
    itemListElement: museum.details.map((detail, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: detail.title,
      description: detail.text,
    })),
  };
}

function buildMuseumHighlightsSchema(museum: MuseumDetailData): SchemaObject {
  const canonicalPath = museum.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "highlights"),
    name: museum.highlights.title,
    description: museum.highlights.items.join(" "),
    inLanguage: getLanguageForPath(canonicalPath),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: museum.highlights.items.length,
    itemListElement: museum.highlights.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item,
    })),
  };
}

function buildMuseumExperienceSchema(museum: MuseumDetailData): SchemaObject {
  const canonicalPath = museum.seo.canonicalPath;

  return {
    "@type": "CreativeWork",
    "@id": schemaId(canonicalPath, "experience"),
    name: museum.experience.title,
    text: museum.experience.paragraphs.join(" "),
    inLanguage: getLanguageForPath(canonicalPath),
    about: {
      "@id": schemaId(canonicalPath, "museum"),
    },
    isPartOf: {
      "@id": webPageId(canonicalPath),
    },
  };
}

function buildMuseumRouteIdeasSchema(museum: MuseumDetailData): SchemaObject {
  const canonicalPath = museum.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "route-ideas"),
    name: museum.routeIdeas.title,
    description: museum.routeIdeas.items.map((item) => item.text).join(" "),
    inLanguage: getLanguageForPath(canonicalPath),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: museum.routeIdeas.items.length,
    itemListElement: museum.routeIdeas.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.text,
    })),
  };
}

function buildMuseumLocalTipSchema(museum: MuseumDetailData): SchemaObject {
  const canonicalPath = museum.seo.canonicalPath;

  return {
    "@type": "CreativeWork",
    "@id": schemaId(canonicalPath, "local-tip"),
    name: museum.baseTip.title,
    text: museum.baseTip.text,
    url: absoluteUrl(museum.baseTip.href),
    inLanguage: getLanguageForPath(canonicalPath),
    about: [
      {
        "@id": schemaId(canonicalPath, "museum"),
      },
      {
        "@id": hotelId(),
      },
    ],
  };
}

function buildMuseumStayActionSchema(museum: MuseumDetailData): SchemaObject {
  const canonicalPath = museum.seo.canonicalPath;

  return {
    "@type": "ReserveAction",
    "@id": schemaId(canonicalPath, "reserve-action"),
    name: museum.baseTip.linkLabel,
    description: museum.baseTip.text,
    inLanguage: getLanguageForPath(canonicalPath),
    target: {
      "@type": "EntryPoint",
      urlTemplate: absoluteUrl(museum.baseTip.href),
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
      name: museum.baseTip.title,
    },
  };
}

export function buildMuseumDetailSchema(museum: MuseumDetailData) {
  const canonicalPath = museum.seo.canonicalPath;
  const parentPath = getParentPath(canonicalPath);
  const labels = labelsByLanguage[getSchemaLanguage(canonicalPath)];

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ path: canonicalPath }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: museum.seo.ogImage || museum.hero.image,
        alt: museum.hero.title,
        caption: `${museum.hero.title} - ${labels.category} - ${siteName}`,
      },
      canonicalPath,
    ),
    buildMuseumWebPageSchema(museum),
    buildMuseumPlaceSchema(museum),
    buildMuseumDetailsItemListSchema(museum),
    buildMuseumHighlightsSchema(museum),
    buildMuseumExperienceSchema(museum),
    buildMuseumRouteIdeasSchema(museum),
    buildMuseumLocalTipSchema(museum),
    buildMuseumStayActionSchema(museum),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: labels.category,
        path: parentPath,
      },
      {
        name: museum.hero.title,
        path: canonicalPath,
      },
    ]),
  ]);
}
