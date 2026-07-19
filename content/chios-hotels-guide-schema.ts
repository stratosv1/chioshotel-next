import type { ChiosHotelsGuideData } from "@/content/chios-hotels-guide";
import { absoluteUrl, getCanonicalUrl, siteUrl } from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
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

function roomCategoryId(path: string, index: number) {
  return schemaId(path, `room-category-${index + 1}`);
}

function buildCollectionPage(data: ChiosHotelsGuideData): SchemaObject {
  const path = data.seo.canonicalPath;

  return {
    "@type": "CollectionPage",
    "@id": webPageId(path),
    url: getCanonicalUrl(path),
    name: data.seo.title,
    headline: data.hero.title,
    description: data.seo.description,
    inLanguage: "en",
    isPartOf: { "@id": websiteId() },
    about: [
      { "@type": "Thing", name: "Chios hotels and accommodation" },
      { "@id": hotelId() },
    ],
    mainEntity: { "@id": itemListId(path) },
    primaryImageOfPage: { "@id": primaryImageId(path) },
    breadcrumb: { "@id": schemaId(path, "breadcrumb") },
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

function buildRoomCategoryNodes(data: ChiosHotelsGuideData): SchemaObject[] {
  const path = data.seo.canonicalPath;

  return data.roomCategories.items.map((room, index) => ({
    "@type": "Accommodation",
    "@id": roomCategoryId(path, index),
    name: room.title,
    url: absoluteUrl(room.href),
    description: room.text,
    image: absoluteUrl(room.image),
    inLanguage: "en",
    containedInPlace: { "@id": hotelId() },
    isPartOf: { "@id": hotelId() },
    amenityFeature: room.facts.map((fact) => ({
      "@type": "LocationFeatureSpecification",
      name: fact,
      value: true,
    })),
  }));
}

function buildRoomItemList(data: ChiosHotelsGuideData): SchemaObject {
  const path = data.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": itemListId(path),
    name: "Rooms and apartments at Voulamandis House",
    description: data.roomCategories.description,
    url: getCanonicalUrl(path),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.roomCategories.items.length,
    itemListElement: data.roomCategories.items.map((room, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: room.title,
      url: absoluteUrl(room.href),
      item: { "@id": roomCategoryId(path, index) },
    })),
  };
}

export function buildChiosHotelsGuideSchema(data: ChiosHotelsGuideData) {
  const path = data.seo.canonicalPath;

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({
      path,
      description:
        "Voulamandis House is a family-run guest accommodation in Kambos, Chios, offering private rooms and family apartments as an alternative to a traditional hotel stay.",
    }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.seo.image,
        alt: data.seo.imageAlt,
        caption: "Rooms and apartments in historic Kambos, Chios",
      },
      path,
    ),
    buildCollectionPage(data),
    buildRoomItemList(data),
    ...buildRoomCategoryNodes(data),
    buildBreadcrumbSchema(path, [{ name: "Chios hotels and where to stay", path }]),
    buildFaqSchema({
      path,
      questions: data.faq.items.map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
    }),
  ]);
}
