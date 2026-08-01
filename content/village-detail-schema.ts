import type { VillageDetailData } from "@/content/village-details";
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

type VillageDetailSchemaLanguage = "en" | "el" | "de" | "fr" | "it" | "es" | "tr";

const labelsByLanguage: Record<
  VillageDetailSchemaLanguage,
  { category: string; tags: string; details: string }
> = {
  en: { category: "Chios Villages", tags: "Village characteristics", details: "details" },
  el: { category: "Χωριά της Χίου", tags: "Χαρακτηριστικά χωριού", details: "πληροφορίες" },
  de: { category: "Dörfer auf Chios", tags: "Dorfmerkmale", details: "Informationen" },
  fr: { category: "Villages de Chios", tags: "Caractéristiques du village", details: "informations" },
  it: { category: "Villaggi di Chios", tags: "Caratteristiche del villaggio", details: "informazioni" },
  es: { category: "Pueblos de Quíos", tags: "Características del pueblo", details: "información" },
  tr: { category: "Sakız Adası Köyleri", tags: "Köy özellikleri", details: "bilgileri" },
};

function getSchemaLanguage(path: string): VillageDetailSchemaLanguage {
  const language = getLanguageForPath(path);
  return ["en", "el", "de", "fr", "it", "es", "tr"].includes(language)
    ? (language as VillageDetailSchemaLanguage)
    : "en";
}

function getParentPath(path: string): string {
  const segments = path.split("/").filter(Boolean);
  segments.pop();
  return `/${segments.join("/")}/`;
}

function buildVillageWebPageSchema(village: VillageDetailData): SchemaObject {
  const canonicalPath = village.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);

  return {
    "@type": "WebPage",
    "@id": webPageId(canonicalPath),
    url: getCanonicalUrl(canonicalPath),
    name: village.seo.title,
    headline: village.hero.title,
    description: village.seo.description,
    inLanguage: language,
    isPartOf: {
      "@id": websiteId(),
    },
    about: [
      {
        "@id": schemaId(canonicalPath, "place"),
      },
      {
        "@id": hotelId(),
      },
    ],
    mainEntity: {
      "@id": schemaId(canonicalPath, "place"),
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

function buildVillagePlaceSchema(village: VillageDetailData): SchemaObject {
  const canonicalPath = village.seo.canonicalPath;
  const parentPath = getParentPath(canonicalPath);
  const labels = labelsByLanguage[getSchemaLanguage(canonicalPath)];
  const address = getLocalizedSchemaAddress(canonicalPath);

  return {
    "@type": ["Place", "TouristAttraction"],
    "@id": schemaId(canonicalPath, "place"),
    name: village.hero.title,
    alternateName: village.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    url: getCanonicalUrl(canonicalPath),
    description: village.hero.description || village.seo.description,
    image: absoluteUrl(village.hero.image || village.seo.ogImage),
    inLanguage: getLanguageForPath(canonicalPath),
    address: {
      "@type": "PostalAddress",
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      addressCountry: "GR",
    },
    touristType: village.hero.tags,
    isPartOf: {
      "@id": webPageId(parentPath),
    },
    subjectOf: {
      "@id": webPageId(canonicalPath),
    },
    additionalProperty: [
      ...village.details.map((detail) => ({
        "@type": "PropertyValue",
        name: detail.title,
        value: detail.text,
      })),
      {
        "@type": "PropertyValue",
        name: labels.tags,
        value: village.hero.tags.join(", "),
      },
    ],
  };
}

function buildVillageDetailsItemListSchema(
  village: VillageDetailData,
): SchemaObject {
  const canonicalPath = village.seo.canonicalPath;
  const labels = labelsByLanguage[getSchemaLanguage(canonicalPath)];

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "village-details"),
    name: `${village.hero.title} — ${labels.details}`,
    description: village.hero.description,
    inLanguage: getLanguageForPath(canonicalPath),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: village.details.length,
    itemListElement: village.details.map((detail, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: detail.title,
      description: detail.text,
    })),
  };
}

function buildVillageHighlightsSchema(village: VillageDetailData): SchemaObject {
  const canonicalPath = village.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "highlights"),
    name: village.highlights.title,
    description: village.highlights.items.join(" "),
    inLanguage: getLanguageForPath(canonicalPath),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: village.highlights.items.length,
    itemListElement: village.highlights.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item,
    })),
  };
}

function buildVillageExperienceSchema(village: VillageDetailData): SchemaObject {
  const canonicalPath = village.seo.canonicalPath;

  return {
    "@type": "CreativeWork",
    "@id": schemaId(canonicalPath, "experience"),
    name: village.experience.title,
    text: village.experience.paragraphs.join(" "),
    inLanguage: getLanguageForPath(canonicalPath),
    about: {
      "@id": schemaId(canonicalPath, "place"),
    },
    isPartOf: {
      "@id": webPageId(canonicalPath),
    },
  };
}

function buildVillageRouteIdeasSchema(village: VillageDetailData): SchemaObject {
  const canonicalPath = village.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "route-ideas"),
    name: village.routeIdeas.title,
    description: village.routeIdeas.items.map((item) => item.text).join(" "),
    inLanguage: getLanguageForPath(canonicalPath),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: village.routeIdeas.items.length,
    itemListElement: village.routeIdeas.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.text,
    })),
  };
}

function buildVillageLocalTipSchema(village: VillageDetailData): SchemaObject {
  const canonicalPath = village.seo.canonicalPath;

  return {
    "@type": "CreativeWork",
    "@id": schemaId(canonicalPath, "local-tip"),
    name: village.baseTip.title,
    text: village.baseTip.text,
    url: absoluteUrl(village.baseTip.href),
    inLanguage: getLanguageForPath(canonicalPath),
    about: [
      {
        "@id": schemaId(canonicalPath, "place"),
      },
      {
        "@id": hotelId(),
      },
    ],
  };
}

function buildVillageStayActionSchema(village: VillageDetailData): SchemaObject {
  const canonicalPath = village.seo.canonicalPath;

  return {
    "@type": "ReserveAction",
    "@id": schemaId(canonicalPath, "reserve-action"),
    name: village.baseTip.linkLabel,
    description: village.baseTip.text,
    inLanguage: getLanguageForPath(canonicalPath),
    target: {
      "@type": "EntryPoint",
      urlTemplate: absoluteUrl(village.baseTip.href),
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
      name: village.baseTip.title,
    },
  };
}

export function buildVillageDetailSchema(village: VillageDetailData) {
  const canonicalPath = village.seo.canonicalPath;
  const parentPath = getParentPath(canonicalPath);
  const labels = labelsByLanguage[getSchemaLanguage(canonicalPath)];

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ path: canonicalPath }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: village.seo.ogImage || village.hero.image,
        alt: village.hero.title,
        caption: `${village.hero.title} - ${labels.category} - ${siteName}`,
      },
      canonicalPath,
    ),
    buildVillageWebPageSchema(village),
    buildVillagePlaceSchema(village),
    buildVillageDetailsItemListSchema(village),
    buildVillageHighlightsSchema(village),
    buildVillageExperienceSchema(village),
    buildVillageRouteIdeasSchema(village),
    buildVillageLocalTipSchema(village),
    buildVillageStayActionSchema(village),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: labels.category,
        path: parentPath,
      },
      {
        name: village.hero.title,
        path: canonicalPath,
      },
    ]),
  ]);
}
