import type { RoomsCategoryPageData } from "@/content/rooms";
import { absoluteUrl } from "@/lib/seo";

export function buildRoomsCategorySchema(data: RoomsCategoryPageData) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: data.seo.title,
    description: data.seo.description,
    url: absoluteUrl(data.seo.canonicalPath),
    itemListElement: data.cards.map((card, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(card.href),
      name: card.title,
    })),
  };
}