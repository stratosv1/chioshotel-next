import type { ChiosAccommodationPageData } from "@/content/chios-accommodation";
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

function accommodationId(path: string, cardId: string) {
  return schemaId(path, `unterkunft-${cardId}`);
}

function buildCollectionPage(data: ChiosAccommodationPageData): SchemaObject {
  const path = data.seo.canonicalPath;

  return {
    "@type": "CollectionPage",
    "@id": webPageId(path),
    url: getCanonicalUrl(path),
    name: data.seo.title,
    headline: data.hero.title,
    description: data.seo.description,
    inLanguage: "de",
    isPartOf: { "@id": websiteId() },
    about: { "@id": hotelId() },
    mainEntity: { "@id": itemListId(path) },
    primaryImageOfPage: { "@id": primaryImageId(path) },
    breadcrumb: { "@id": schemaId(path, "breadcrumb") },
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

function buildAccommodationNodes(data: ChiosAccommodationPageData): SchemaObject[] {
  const path = data.seo.canonicalPath;

  return data.rooms.cards.map((card) => ({
    "@type": "Accommodation",
    "@id": accommodationId(path, card.id),
    name: card.title,
    url: absoluteUrl(card.href),
    description: card.description,
    image: absoluteUrl(card.image),
    inLanguage: "de",
    containedInPlace: { "@id": hotelId() },
    isPartOf: { "@id": hotelId() },
    amenityFeature: card.facts.map((fact) => ({
      "@type": "LocationFeatureSpecification",
      name: fact,
      value: true,
    })),
  }));
}

function buildItemList(data: ChiosAccommodationPageData): SchemaObject {
  const path = data.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": itemListId(path),
    name: "Zimmer und Apartments im Voulamandis House",
    description: data.rooms.description,
    url: getCanonicalUrl(path),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.rooms.cards.length,
    itemListElement: data.rooms.cards.map((card, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: card.title,
      url: absoluteUrl(card.href),
      item: { "@id": accommodationId(path, card.id) },
    })),
  };
}

export function buildChiosUnterkunftSchema(data: ChiosAccommodationPageData) {
  const path = data.seo.canonicalPath;
  const faq = buildFaqSchema({
    path,
    questions: data.faq.items.map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  });

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({
      path,
      description:
        "Voulamandis House ist eine familiengeführte Gästeunterkunft in Kambos auf Chios mit Economy-Zimmern, Zimmern im Erd- und Obergeschoss sowie Familienapartments nahe Chios-Stadt und Flughafen.",
    }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.seo.ogImage,
        alt: data.seo.ogImageAlt,
        caption: "Zimmer und Apartments im Voulamandis House in Kambos auf Chios",
      },
      path,
    ),
    buildCollectionPage(data),
    buildItemList(data),
    ...buildAccommodationNodes(data),
    buildBreadcrumbSchema(path, [{ name: "Unterkunft auf Chios", path }]),
    faq,
  ]);
}
