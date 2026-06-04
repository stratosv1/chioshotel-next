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
      addressRegion: "Chios",
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
        name: "Region",
        value: beach.region,
      },
      {
        "@type": "PropertyValue",
        name: "Mood",
        value: beach.mood,
      },
      {
        "@type": "PropertyValue",
        name: "Tags",
        value: beach.badges.join(", "),
      },
    ],
  };
}

function buildBeachesItemListSchema(data: ChiosBeachesPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": itemListId(canonicalPath),
    name: "Top Chios beaches",
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
    buildChiosBeachesCollectionPageSchema(data),
    buildBeachesItemListSchema(data),
    buildBeachPlanningSchema(data),
    buildBeachGuideTipSchema(data),
    ...data.beaches.map(buildBeachPlaceSchema),
    buildBeachStayActionSchema(data),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: "Chios Island",
        path: "/chios-island/",
      },
      {
        name: "Chios Beaches",
        path: canonicalPath,
      },
    ]),
  ]);
}