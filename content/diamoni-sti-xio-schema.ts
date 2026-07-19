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
  return schemaId(path, `diamoni-${cardId}`);
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
    inLanguage: "el",
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
    inLanguage: "el",
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
    name: "Δωμάτια και διαμερίσματα στο Voulamandis House",
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

export function buildDiamoniStiXioSchema(data: ChiosAccommodationPageData) {
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
        "Το Voulamandis House είναι οικογενειακό κατάλυμα στον Κάμπο της Χίου με οικονομικά δωμάτια, ισόγειες και επιλογές ορόφου, καθώς και οικογενειακά διαμερίσματα κοντά στη Χώρα και το αεροδρόμιο.",
    }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.seo.ogImage,
        alt: data.seo.ogImageAlt,
        caption: "Δωμάτια και διαμερίσματα στο Voulamandis House στον Κάμπο της Χίου",
      },
      path,
    ),
    buildCollectionPage(data),
    buildItemList(data),
    ...buildAccommodationNodes(data),
    buildBreadcrumbSchema(path, [{ name: "Διαμονή στη Χίο", path }]),
    faq,
  ]);
}
