import type { RoomDetailData } from "@/content/room-details";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { absoluteUrl, siteUrl } from "@/lib/seo";
import type { SchemaObject } from "@/lib/structured-data";

const exactLabels: Record<string, string> = {
  Home: "Strona główna",
  "Chios rooms and apartments": "Pokoje i apartamenty na Chios",
  "Room type": "Typ pokoju",
  Location: "Położenie",
  Beds: "Łóżka",
  Highlights: "Najważniejsze cechy",
  guests: "gości",
  "Free WiFi": "Bezpłatne Wi‑Fi",
  "Air conditioning": "Klimatyzacja",
  "Private bathroom": "Prywatna łazienka",
  "Flat-screen TV": "Telewizor z płaskim ekranem",
  "Garden and terrace": "Ogród i taras",
  "Parking available": "Dostępny parking",
  "Cleaning service": "Usługa sprzątania",
};

function localizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(localizeValue);
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

    localized[key] = localizeValue(child);
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

  if (localized["@type"] === "BreadcrumbList" && Array.isArray(localized.itemListElement)) {
    localized.itemListElement = localized.itemListElement.map((item, index) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return item;
      const entry = { ...(item as Record<string, unknown>) };
      if (index === 0) {
        entry.name = "Strona główna";
        entry.item = absoluteUrl("/pl/");
      }
      if (index === 1) {
        entry.name = "Pokoje i apartamenty na Chios";
        entry.item = absoluteUrl("/pl/pokoje-na-chios/");
      }
      return entry;
    });
  }

  return localized;
}

export function buildPolishRoomDetailSchema(data: RoomDetailData): SchemaObject {
  return localizeValue(buildRoomDetailSchema(data)) as SchemaObject;
}
