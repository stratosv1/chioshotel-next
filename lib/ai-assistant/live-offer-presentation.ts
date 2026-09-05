import type { AssistantLanguage } from "./types";
import { localizeRoomOffer } from "./room-card-catalog";

type RawOffer = Record<string, any> & {
  roomId?: string | number;
  unitId?: string | number;
};

export function presentLiveOffers(offers: RawOffer[], language: AssistantLanguage) {
  return offers.map((offer) => localizeRoomOffer(offer, language));
}
