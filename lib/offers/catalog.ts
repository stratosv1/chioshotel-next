import { getDealsIntentData } from "@/content/deals-intent";
import type { DealsPageData } from "@/content/deals";
import {
  OFFER_LANGUAGES,
  OFFER_ROOM_KEYS,
  type OfferLanguage,
  type OfferRoomKey,
  type OfferTranslation,
  type StoredOffer,
} from "@/lib/offers/types";

/** Public deals page per language (where offers are shown). */
export const DEALS_PAGE_PATHS: Record<OfferLanguage, string> = {
  en: "/best-chios-travel-deals-for-chios-hotels/",
  el: "/el/crazy-travel-deals-for-chios-hotels/",
  fr: "/fr/offres-de-voyage-pour-les-hotels-a-chios/",
  de: "/de/beste-reiseangebote-fur-chios-hotels-auf-chios/",
  it: "/it/offerte-di-viaggio-hotels-chios/",
  es: "/es/mejores-ofertas-de-viaje-a-quios-para-hoteles-en-quios/",
  tr: "/tr/sakiz-adasi-otel-firsatlari/",
};

const BEDS24_ROOM_IDS: Record<OfferRoomKey, string> = {
  "economy-double": "268803",
  "ground-floor-double": "626129",
  "first-floor-double": "267788",
  "family-apartment": "265595",
};

export const ROOM_LABELS: Record<OfferRoomKey, string> = {
  "economy-double": "Οικονομικό δίκλινο",
  "ground-floor-double": "Δίκλινο ισογείου",
  "first-floor-double": "Δίκλινο πρώτου ορόφου",
  "family-apartment": "Οικογενειακό διαμέρισμα",
};

export function beds24BookingHref(roomKey: OfferRoomKey, language: OfferLanguage) {
  return `https://beds24.com/booking.php?propid=117813&roomid=${BEDS24_ROOM_IDS[roomKey]}&lang=${language}`;
}

type StaticOffer = DealsPageData["offers"][number];

function staticOffer(language: OfferLanguage, roomKey: OfferRoomKey): StaticOffer | undefined {
  return getDealsIntentData(language).offers.find((offer) => offer.id === roomKey);
}

export function roomDefaults(roomKey: OfferRoomKey, language: OfferLanguage) {
  const source = staticOffer(language, roomKey) ?? staticOffer("en", roomKey);
  return {
    image: source?.image ?? "/images/rooms/double-triple-room.jpg",
    imageAlt: source?.imageAlt ?? "",
    roomPageHref: source?.roomPageHref ?? "/chios-rooms/",
  };
}

/** Image choices offered in the staff form (the room photos already on the site). */
export function roomImageChoices() {
  return OFFER_ROOM_KEYS.map((key) => ({ key, label: ROOM_LABELS[key], image: roomDefaults(key, "en").image }));
}

/** The four offers that were hard-coded before the staff panel; used to seed the table and as a fallback. */
export function buildSeedOffers(): StoredOffer[] {
  return OFFER_ROOM_KEYS.map((roomKey, index) => {
    const translations: Partial<Record<OfferLanguage, OfferTranslation>> = {};
    let couponCode = "";
    for (const language of OFFER_LANGUAGES) {
      const offer = staticOffer(language, roomKey);
      if (!offer) continue;
      couponCode = couponCode || offer.couponCode;
      translations[language] = {
        title: offer.title,
        description: offer.description,
        tip: offer.tip,
        discountLabel: offer.discountLabel,
        tags: offer.tags,
      };
    }
    return {
      id: `seed-${roomKey}`,
      slug: roomKey,
      roomKey,
      couponCode,
      image: null,
      validFrom: null,
      validUntil: null,
      active: true,
      sortOrder: index,
      translations,
    };
  });
}

export function translationFor(offer: StoredOffer, language: OfferLanguage): OfferTranslation | null {
  return offer.translations[language] ?? offer.translations.en ?? offer.translations.el ?? null;
}

/** Map stored offers to the deals page shape for one language. */
export function toDealsOffers(offers: StoredOffer[], language: OfferLanguage): DealsPageData["offers"] {
  return offers.flatMap((offer) => {
    const text = translationFor(offer, language);
    if (!text) return [];
    const defaults = roomDefaults(offer.roomKey, language);
    return [
      {
        id: offer.slug,
        title: text.title,
        description: text.description,
        image: offer.image || defaults.image,
        imageAlt: defaults.imageAlt || text.title,
        tags: text.tags,
        tip: text.tip,
        couponCode: offer.couponCode,
        discountLabel: text.discountLabel,
        bookingHref: beds24BookingHref(offer.roomKey, language),
        roomPageHref: defaults.roomPageHref,
        validUntil: offer.validUntil,
      },
    ];
  });
}

/** Ready-made link for newsletters / social, with UTM tags and the offer anchor. */
export function offerShareLink(slug: string, language: OfferLanguage, source = "newsletter", medium = "email") {
  const params = new URLSearchParams({ utm_source: source, utm_medium: medium, utm_campaign: `offer-${slug}` });
  return `https://chioshotel.gr${DEALS_PAGE_PATHS[language]}?${params.toString()}#offer-${slug}`;
}
