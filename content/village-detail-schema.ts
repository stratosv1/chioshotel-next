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
  hotelId,
  primaryImageId,
  schemaId,
  webPageId,
  websiteId,
  type SchemaObject,
  getLocalizedSchemaAddress,
} from "@/lib/structured-data";

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
        "@id": schemaId("/chios-island/", "destination"),
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
    address: {
      "@type": "PostalAddress",
      addressLocality: getLocalizedSchemaAddress(canonicalPath).addressLocality,
      addressRegion: getLocalizedSchemaAddress(canonicalPath).addressRegion,
      addressCountry: "GR",
    },
    touristType: village.hero.tags,
    isPartOf: {
      "@id": schemaId("/chios-island/", "destination"),
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
        name: "Village tags",
        value: village.hero.tags.join(", "),
      },
    ],
  };
}

function buildVillageDetailsItemListSchema(
  village: VillageDetailData,
): SchemaObject {
  const canonicalPath = village.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "village-details"),
    name: `${village.hero.title} details`,
    description: village.hero.description,
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
      name: `${siteName} stay for exploring Chios villages`,
    },
  };
}

export function buildVillageDetailSchema(village: VillageDetailData) {
  const canonicalPath = village.seo.canonicalPath;

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ path: canonicalPath }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: village.seo.ogImage || village.hero.image,
        alt: village.hero.title,
        caption: `${village.hero.title} - Chios village guide by ${siteName}`,
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
        name: "Chios Island",
        path: "/chios-island/",
      },
      {
        name: "Chios Villages",
        path: "/chios/chios-villages/",
      },
      {
        name: village.hero.title,
        path: canonicalPath,
      },
    ]),
  ]);
}
