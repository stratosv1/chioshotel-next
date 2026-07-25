import { absoluteUrl, siteName, siteUrl } from "@/lib/seo";
import {
  buildOrganizationSchema,
  buildSchemaGraph,
  hotelId,
  itemListId,
  schemaId,
  webPageId,
  websiteId,
  type SchemaObject,
} from "@/lib/structured-data";

const path = "/pl/";

function buildWebsite(): SchemaObject {
  return {
    "@type": "WebSite",
    "@id": websiteId(),
    url: siteUrl,
    name: siteName,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: ["en", "el", "fr", "de", "it", "es", "tr", "pl"],
  };
}

function buildHomePage(): SchemaObject {
  return {
    "@type": "WebPage",
    "@id": webPageId(path),
    url: absoluteUrl(path),
    name: "Noclegi Chios | Pokoje i apartamenty w Kambos",
    headline: "Noclegi na Chios — pokoje i apartamenty w Kambos",
    description: "Noclegi na Chios w spokojnym Kambos. Pokoje i rodzinne apartamenty Voulamandis House, aktualna dostępność, bezpośrednia rezerwacja i praktyczna lokalizacja.",
    inLanguage: "pl",
    isPartOf: { "@id": websiteId() },
    about: { "@id": hotelId() },
    mainEntity: { "@id": hotelId() },
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

function buildCoreLinks(): SchemaObject {
  const items = [
    ["Noclegi na Chios", "/pl/noclegi-chios/"],
    ["Pokoje na Chios", "/pl/pokoje-na-chios/"],
    ["Apartamenty na Chios", "/pl/apartamenty-na-chios/"],
    ["Hotele na Chios — przewodnik", "/pl/hotele-chios/"],
    ["Rezerwacja bezpośrednia", "/pl/rezerwacja/"],
  ] as const;

  return {
    "@type": "ItemList",
    "@id": itemListId(path),
    name: "Najważniejsze strony o noclegach na Chios",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: items.length,
    itemListElement: items.map(([name, url], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      url: absoluteUrl(url),
    })),
  };
}

export function buildPolishHomeSchema(): SchemaObject {
  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildWebsite(),
    buildHomePage(),
    buildCoreLinks(),
    {
      "@type": "ImageObject",
      "@id": schemaId(path, "primaryimage"),
      url: absoluteUrl("/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp"),
      contentUrl: absoluteUrl("/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp"),
      caption: "Voulamandis House w Kambos na Chios",
    },
  ]);
}
