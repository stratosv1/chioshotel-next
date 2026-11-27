import "server-only";
import type { PlanDeal } from "@/content/deals";
import { getDealsIntentData } from "@/content/deals-intent";
import { roomDefaults } from "@/lib/offers/catalog";
import type { OfferLanguage, OfferRoomKey } from "@/lib/offers/types";
import { listLivePlanOffers, type LivePlanOffer } from "@/lib/pyrgos/plan-offers";
import { roomByNumber, type RoomCategory } from "@/lib/pyrgos/rooms";

// Room offers declared from the staff booking plan → cards on the deals pages (owner, 2026-11-27).
// The guest taps the card and lands in the owner's WhatsApp with a ready message:
// Greek on the Greek page, English on every other language.

const WHATSAPP_NUMBER = "306944474226";

const ROOM_KEY: Partial<Record<RoomCategory, OfferRoomKey>> = {
  economy: "economy-double",
  first_floor: "first-floor-double",
  ground_floor: "ground-floor-double",
  apartment: "family-apartment",
};


function formatDay(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T12:00:00Z`),
  );
}

function categoryTitle(roomKey: OfferRoomKey, language: OfferLanguage) {
  const own = getDealsIntentData(language).offers.find((offer) => offer.id === roomKey)?.title;
  return own ?? getDealsIntentData("en").offers.find((offer) => offer.id === roomKey)?.title ?? roomKey;
}

function whatsappMessage(offer: LivePlanOffer, roomKey: OfferRoomKey, greek: boolean) {
  const locale = greek ? "el-GR" : "en-GB";
  const dates = `${formatDay(offer.from, locale)} – ${formatDay(offer.to, locale)}`;
  if (greek) {
    return [
      "Γεια σας! Θέλω αυτή την προσφορά που βρήκα στο site σας:",
      `Δωμάτιο ${offer.room} (${categoryTitle(roomKey, "el")})`,
      `${dates} · ${offer.nights} ${offer.nights === 1 ? "νύχτα" : "νύχτες"}`,
      `Έκπτωση ${offer.discount}% · Κωδικός ${offer.code}`,
    ].join("\n");
  }
  return [
    "Hello! I'd like this offer I found on your website:",
    `Room ${offer.room} (${categoryTitle(roomKey, "en")})`,
    `${dates} · ${offer.nights} ${offer.nights === 1 ? "night" : "nights"}`,
    `${offer.discount}% off · Code ${offer.code}`,
  ].join("\n");
}

export function toPlanDeals(offers: LivePlanOffer[], language: OfferLanguage): PlanDeal[] {
  return offers.flatMap((offer) => {
    const category = roomByNumber(offer.room)?.category;
    const roomKey = category ? ROOM_KEY[category] : undefined;
    if (!roomKey) return [];
    const defaults = roomDefaults(roomKey, language);
    const title = categoryTitle(roomKey, language);
    const text = whatsappMessage(offer, roomKey, language === "el");
    return [
      {
        id: `room-${offer.id}`,
        room: offer.room,
        title,
        image: defaults.image,
        imageAlt: defaults.imageAlt || title,
        roomPageHref: defaults.roomPageHref,
        from: offer.from,
        to: offer.to,
        nights: offer.nights,
        discount: offer.discount,
        code: offer.code,
        nightPrice: offer.nightPrice,
        dealNightPrice: offer.nightPrice === null ? null : Math.round(offer.nightPrice * (1 - offer.discount / 100)),
        whatsappHref: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      },
    ];
  });
}

/** Live plan offers for one language; never breaks the page (empty list on any error). */
export async function getPlanDeals(language: OfferLanguage): Promise<PlanDeal[]> {
  try {
    return toPlanDeals(await listLivePlanOffers(), language);
  } catch (error) {
    console.error("Plan offers: could not load", error);
    return [];
  }
}
