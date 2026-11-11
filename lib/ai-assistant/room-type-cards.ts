import { unstable_cache } from "next/cache";
import { neon } from "@neondatabase/serverless";
import { BOOKING_CORE_DEALS_CACHE_TAG } from "@/lib/booking-core/cache-tags";
import type { HomePageData } from "@/content/home";
import {
  homePageDe,
  homePageEl,
  homePageEn,
  homePageEs,
  homePageFr,
  homePageIt,
  homePageTr,
} from "@/content/home";
import type { RoomCategoryCard, RoomsCategoryPageData } from "@/content/rooms";
import {
  roomsCategoryDe,
  roomsCategoryEl,
  roomsCategoryEn,
  roomsCategoryEs,
  roomsCategoryFr,
  roomsCategoryIt,
  roomsCategoryTr,
} from "@/content/rooms";
import { homeRoomImages } from "@/components/home/homeTailwindImages";
import {
  getCategoryFromPrices,
  ROOM_CATEGORY_ROOMS,
  type RoomCategoryId,
} from "@/lib/booking-core/category-from-prices";
import { hardenGreekHomePageData } from "@/lib/greek-home-seo-hardening";
import { withHomepageSeoIntent } from "@/lib/homepage-seo-intent";
import type { RoomFinderAssistantLanguage } from "@/lib/ai-assistant/room-finder-types";

/**
 * The four Voulamandis House room types, shown in the Room Finder when a
 * guest has no dates yet. The cards are built exactly like the homepage room
 * cards (same homepage copy, images, category badge/meta and "from" price), so
 * the chat never shows different room information than the homepage.
 * Nothing here says a room is available: availability needs dates.
 */

export type RoomTypeCard = {
  categoryId: RoomCategoryId;
  roomNumbers: number[];
  card: RoomCategoryCard;
  /** Indicative lowest nightly direct price for 2 guests (null when unknown). */
  price: number | null;
};

// Owner order: economy double, first floor, ground floor, family apartments.
const CATEGORY_ORDER: RoomCategoryId[] = [
  "economy-double",
  "first-floor",
  "ground-floor",
  "family-apartments",
];

// Homepage room ids → room categories (same mapping as the homepage).
const HOME_ROOM_CATEGORY: Record<string, RoomCategoryId> = {
  "economy-double": "economy-double",
  "ground-floor-double-triple": "ground-floor",
  "upper-floor-double-triple": "first-floor",
  "family-apartment": "family-apartments",
};

const HOME_PAGES: Record<RoomFinderAssistantLanguage, HomePageData> = {
  en: homePageEn,
  el: homePageEl,
  fr: homePageFr,
  de: homePageDe,
  it: homePageIt,
  es: homePageEs,
  tr: homePageTr,
};

const ROOM_CATEGORY_PAGES: Record<RoomFinderAssistantLanguage, RoomsCategoryPageData> = {
  en: roomsCategoryEn,
  el: roomsCategoryEl,
  fr: roomsCategoryFr,
  de: roomsCategoryDe,
  it: roomsCategoryIt,
  es: roomsCategoryEs,
  tr: roomsCategoryTr,
};

function homePageData(language: RoomFinderAssistantLanguage): HomePageData {
  const data = withHomepageSeoIntent(HOME_PAGES[language], language);
  return language === "en" ? data : hardenGreekHomePageData(data);
}

export function buildRoomTypeCards(
  language: RoomFinderAssistantLanguage,
  prices: Partial<Record<RoomCategoryId, number>> | null,
): RoomTypeCard[] {
  const data = homePageData(language);
  const categoryCards = ROOM_CATEGORY_PAGES[language].cards;
  const byCategory = new Map<RoomCategoryId, RoomTypeCard>();

  for (const room of data.roomsPreview.rooms) {
    const categoryId = HOME_ROOM_CATEGORY[room.id];
    if (!categoryId || byCategory.has(categoryId)) continue;
    const categoryCard = categoryCards.find(card => card.id === categoryId);
    const price = prices?.[categoryId];

    byCategory.set(categoryId, {
      categoryId,
      roomNumbers: ROOM_CATEGORY_ROOMS[categoryId],
      price: typeof price === "number" && Number.isFinite(price) ? price : null,
      card: {
        id: room.id,
        title: room.title,
        subtitle: categoryCard?.subtitle ?? "",
        description: room.description,
        href: room.href,
        image: homeRoomImages[room.imageClass] || data.hero.image,
        imageAlt: categoryCard?.imageAlt ?? room.title,
        badge: categoryCard?.badge ?? room.liveBadge,
        ctaLabel: room.cta,
        meta: categoryCard?.meta ?? [],
      },
    });
  }

  return CATEGORY_ORDER
    .map(categoryId => byCategory.get(categoryId))
    .filter((card): card is RoomTypeCard => Boolean(card));
}

export async function getRoomTypeCards(language: RoomFinderAssistantLanguage) {
  return buildRoomTypeCards(language, await getCategoryFromPrices());
}

/** Direct-booking discounts by stay length (percent), from Booking Core. */
export type DirectDiscounts = {
  nights1to2: number;
  nights3to4: number;
  nights5to6: number;
  nights7plus: number;
};

async function loadDirectDiscounts(): Promise<DirectDiscounts> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing");
  const sql = neon(databaseUrl);
  const rows = (await sql`
    select setting_key, numeric_value
    from booking_core.settings
    where setting_key in (
      'direct_discount_percent',
      'los_total_discount_1_2_nights',
      'los_total_discount_3_4_nights',
      'los_total_discount_5_6_nights',
      'los_total_discount_7_plus_nights'
    )
  `) as Array<{ setting_key: string; numeric_value: number | string | null }>;
  const values = new Map(rows.map(row => [row.setting_key, Number(row.numeric_value)]));
  const base = values.get("direct_discount_percent");
  const pick = (key: string) => {
    const value = values.get(key) ?? base;
    if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`Missing ${key}`);
    return Math.round(value);
  };
  return {
    nights1to2: pick("los_total_discount_1_2_nights"),
    nights3to4: pick("los_total_discount_3_4_nights"),
    nights5to6: pick("los_total_discount_5_6_nights"),
    nights7plus: pick("los_total_discount_7_plus_nights"),
  };
}

const cachedDirectDiscounts = unstable_cache(loadDirectDiscounts, ["room-finder-direct-discounts-v1"], {
  revalidate: 6 * 60 * 60,
  tags: [BOOKING_CORE_DEALS_CACHE_TAG],
});

export async function getDirectDiscounts(): Promise<DirectDiscounts | null> {
  try {
    return await cachedDirectDiscounts();
  } catch (error) {
    console.error("Room Finder could not load direct-booking discounts", error);
    return null;
  }
}
