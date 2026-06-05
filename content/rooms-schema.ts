import type { RoomCategoryCard, RoomsCategoryPageData } from "@/content/rooms";
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

function buildRoomCardSchema(card: RoomCategoryCard): SchemaObject {
  return {
    "@type": "HotelRoom",
    "@id": schemaId(card.href, "room"),
    name: card.title,
    alternateName: card.subtitle,
    url: absoluteUrl(card.href),
    description: card.description,
    image: absoluteUrl(card.image),
    containedInPlace: {
      "@id": hotelId(),
    },
    isPartOf: {
      "@id": hotelId(),
    },
    amenityFeature: card.meta.map((item) => ({
      "@type": "LocationFeatureSpecification",
      name: item,
      value: true,
    })),
  };
}

function buildRoomsItemListSchema(data: RoomsCategoryPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": itemListId(canonicalPath),
    name: data.seo.title,
    description: data.seo.description,
    url: getCanonicalUrl(canonicalPath),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.cards.length,
    itemListElement: data.cards.map((card, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(card.href),
      name: card.title,
      description: card.description,
      image: absoluteUrl(card.image),
      item: {
        "@id": schemaId(card.href, "room"),
      },
    })),
  };
}

function buildRoomsCollectionPageSchema(data: RoomsCategoryPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);

  return {
    "@type": "CollectionPage",
    "@id": webPageId(canonicalPath),
    url: getCanonicalUrl(canonicalPath),
    name: data.seo.title,
    headline: data.seo.title,
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

export function buildRoomsCategorySchema(data: RoomsCategoryPageData) {
  const canonicalPath = data.seo.canonicalPath;

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema(),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.seo.ogImage,
        alt: data.seo.title,
        caption: `${data.seo.title} - ${siteName}`,
      },
      canonicalPath,
    ),
    buildRoomsCollectionPageSchema(data),
    buildRoomsItemListSchema(data),
    ...data.cards.map(buildRoomCardSchema),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: "Chios Rooms",
        path: canonicalPath,
      },
    ]),
  ]);
}