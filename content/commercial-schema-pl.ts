import { absoluteUrl, siteUrl } from "@/lib/seo";
import type { SchemaObject } from "@/lib/structured-data";

type BreadcrumbOverride = {
  name: string;
  path: string;
};

type PolishSchemaOptions = {
  breadcrumbs?: BreadcrumbOverride[];
};

const exactLabels: Record<string, string> = {
  Home: "Strona główna",
  "Chios accommodation": "Noclegi na Chios",
  "Rooms and apartments at Voulamandis House": "Pokoje i apartamenty w Voulamandis House",
  "Direct Booking": "Rezerwacja bezpośrednia",
  "Discount code": "Kod rabatowy",
  "Discount value": "Wartość rabatu",
  "Booking conditions": "Warunki rezerwacji",
  "Direct booking guests": "Goście rezerwujący bezpośrednio",
  "Free WiFi": "Bezpłatne Wi‑Fi",
  "Air conditioning": "Klimatyzacja",
  "Private bathroom": "Prywatna łazienka",
  "Flat-screen TV": "Telewizor z płaskim ekranem",
  "Garden and terrace": "Ogród i taras",
  "Parking available": "Dostępny parking",
  "Cleaning service": "Usługa sprzątania",
  Accommodation: "Zakwaterowanie",
};

function walk(value: unknown, options: PolishSchemaOptions): unknown {
  if (Array.isArray(value)) return value.map((item) => walk(item, options));

  if (!value || typeof value !== "object") {
    return typeof value === "string" && exactLabels[value] ? exactLabels[value] : value;
  }

  const source = value as Record<string, unknown>;
  const localized: Record<string, unknown> = {};

  for (const [key, child] of Object.entries(source)) {
    if (key === "inLanguage" && child === "en") {
      localized[key] = "pl";
      continue;
    }

    if (key === "inLanguage" && Array.isArray(child)) {
      localized[key] = Array.from(new Set([...child, "pl"]));
      continue;
    }

    localized[key] = walk(child, options);
  }

  if (localized["@id"] === `${siteUrl}/#lodging-business`) {
    localized.description = "Voulamandis House to rodzinny obiekt noclegowy w Kambos na Chios, oferujący pokoje i apartamenty blisko miasta, lotniska i plaż południowej części wyspy.";
    const address = localized.address;
    if (address && typeof address === "object" && !Array.isArray(address)) {
      localized.address = {
        ...(address as Record<string, unknown>),
        addressLocality: "Chios",
        addressRegion: "Północne Morze Egejskie",
      };
    }
  }

  if (localized["@type"] === "BreadcrumbList" && Array.isArray(localized.itemListElement) && options.breadcrumbs?.length) {
    localized.itemListElement = localized.itemListElement.map((item, index) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return item;
      const override = options.breadcrumbs?.[index];
      if (!override) return item;
      return {
        ...(item as Record<string, unknown>),
        name: override.name,
        item: absoluteUrl(override.path),
      };
    });
  }

  return localized;
}

export function localizePolishCommercialSchema(
  schema: SchemaObject,
  options: PolishSchemaOptions = {},
): SchemaObject {
  return walk(schema, options) as SchemaObject;
}
