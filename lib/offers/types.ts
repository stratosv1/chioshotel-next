export const OFFER_LANGUAGES = ["el", "en", "fr", "de", "it", "es", "tr"] as const;
export type OfferLanguage = (typeof OFFER_LANGUAGES)[number];

export const OFFER_ROOM_KEYS = ["economy-double", "ground-floor-double", "first-floor-double", "family-apartment"] as const;
export type OfferRoomKey = (typeof OFFER_ROOM_KEYS)[number];

export type OfferTranslation = {
  title: string;
  description: string;
  tip: string;
  discountLabel: string;
  tags: string[];
};

export type StoredOffer = {
  id: string;
  slug: string;
  roomKey: OfferRoomKey;
  couponCode: string;
  image: string | null;
  validFrom: string | null;
  validUntil: string | null;
  active: boolean;
  sortOrder: number;
  translations: Partial<Record<OfferLanguage, OfferTranslation>>;
  createdAt?: string;
  updatedAt?: string;
};

export function isOfferLanguage(value: string): value is OfferLanguage {
  return (OFFER_LANGUAGES as readonly string[]).includes(value);
}

export function isOfferRoomKey(value: string): value is OfferRoomKey {
  return (OFFER_ROOM_KEYS as readonly string[]).includes(value);
}

/** An offer is live when active, already started and not yet expired. */
export function isOfferLive(offer: Pick<StoredOffer, "active" | "validFrom" | "validUntil">, now = Date.now()) {
  if (!offer.active) return false;
  if (offer.validFrom && new Date(offer.validFrom).getTime() > now) return false;
  if (offer.validUntil && new Date(offer.validUntil).getTime() <= now) return false;
  return true;
}
