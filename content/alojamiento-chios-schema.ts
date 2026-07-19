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
  return schemaId(path, `alojamiento-${cardId}`);
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
    inLanguage: "es",
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
    inLanguage: "es",
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
    name: "Habitaciones y apartamentos en Voulamandis House",
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

export function buildAlojamientoChiosSchema(data: ChiosAccommodationPageData) {
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
        "Voulamandis House es un alojamiento familiar en Kambos, Chios, con habitaciones económicas, habitaciones en planta baja y superior y apartamentos familiares cerca de la ciudad y del aeropuerto.",
    }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.seo.ogImage,
        alt: data.seo.ogImageAlt,
        caption: "Habitaciones y apartamentos en Voulamandis House, Kambos, Chios",
      },
      path,
    ),
    buildCollectionPage(data),
    buildItemList(data),
    ...buildAccommodationNodes(data),
    buildBreadcrumbSchema(path, [{ name: "Alojamiento en Chios", path }]),
    faq,
  ]);
}