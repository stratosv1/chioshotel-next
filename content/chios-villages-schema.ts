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
  hotelId,
  itemListId,
  primaryImageId,
  schemaId,
  webPageId,
  websiteId,
  type SchemaObject,
} from "@/lib/structured-data";

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

function buildVillagePlaceSchema(
  village: ChiosVillagesPageData["villages"][number],
): SchemaObject {
  return {
    "@type": ["Place", "TouristAttraction"],
    "@id": schemaId(village.href, "place"),
    name: village.name,
    alternateName: village.title,
    url: absoluteUrl(village.href),
    description: village.description,
    image: absoluteUrl(village.image),
    address: {
      "@type": "PostalAddress",
      addressLocality: village.region,
      addressRegion: "Chios",
      addressCountry: "GR",
    },
    touristType: village.badges,
    isPartOf: {
      "@id": schemaId("/chios-island/", "destination"),
    },
    subjectOf: {
      "@id": webPageId(village.href),
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Region",
        value: village.region,
      },
      {
        "@type": "PropertyValue",
        name: "Mood",
        value: village.mood,
      },
      {
        "@type": "PropertyValue",
        name: "Tags",
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
    name: "Top Chios villages",
    description: data.intro.description,
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
      name: `${siteName} stay for exploring Chios villages`,
    },
  };
}

export function buildChiosVillagesSchema(data: ChiosVillagesPageData) {
  const canonicalPath = data.seo.canonicalPath;

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema(),
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
    ...data.villages.map(buildVillagePlaceSchema),
    buildVillageStayActionSchema(data),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: "Chios Island",
        path: "/chios-island/",
      },
      {
        name: "Chios Villages",
        path: canonicalPath,
      },
    ]),
  ]);
}