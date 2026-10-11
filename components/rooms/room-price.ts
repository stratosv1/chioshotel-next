import { formatFromPrice, type CompareLocale } from "@/components/rooms/RoomsCompareSection";
import type { RoomDetailData } from "@/content/room-details";
import { getCategoryFromPrices, type RoomCategoryId } from "@/lib/booking-core/category-from-prices";

const categoryByRoomDetailId: Record<string, RoomCategoryId> = {
  "standard-double-room": "first-floor",
  "ground-floor-rooms": "ground-floor",
};

function localeForPath(path: string): CompareLocale {
  const prefix = path.split("/")[1];
  return (["el", "fr", "de", "it", "es", "tr", "pl"] as const).find((code) => code === prefix) ?? "en";
}

/** Live "from €X / night" label for a room detail page, or null (hidden) when unavailable. */
export async function getRoomDetailFromPriceLabel(data: RoomDetailData): Promise<string | null> {
  const category = categoryByRoomDetailId[data.id];
  if (!category) return null;
  const prices = await getCategoryFromPrices();
  const price = prices?.[category];
  return typeof price === "number" ? formatFromPrice(price, localeForPath(data.seo.canonicalPath)) : null;
}
