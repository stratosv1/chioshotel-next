export const ROOM_FINDER_OFFER_SNAPSHOT_MARKER = "\n\n[[ROOM_FINDER_OFFER_SNAPSHOT]]\n";

export type RoomFinderTrackedOffer = {
  roomNumber: number;
  name: string;
  checkin: string;
  checkout: string;
  originalTotal: number;
  directTotal: number;
  saving: number;
  recoverySummary?: string;
};

export type RoomFinderTrackedOfferGroup = {
  groupNumber: number;
  guests: number;
  offers: RoomFinderTrackedOffer[];
};

export type RoomFinderOfferSnapshot = {
  version: 1;
  groups: RoomFinderTrackedOfferGroup[];
};

function isTrackedOffer(value: unknown): value is RoomFinderTrackedOffer {
  if (!value || typeof value !== "object") return false;
  const offer = value as Partial<RoomFinderTrackedOffer>;
  return Number.isFinite(offer.roomNumber)
    && typeof offer.name === "string"
    && typeof offer.checkin === "string"
    && typeof offer.checkout === "string"
    && Number.isFinite(offer.originalTotal)
    && Number.isFinite(offer.directTotal)
    && Number.isFinite(offer.saving)
    && (offer.recoverySummary === undefined || typeof offer.recoverySummary === "string");
}

function isOfferSnapshot(value: unknown): value is RoomFinderOfferSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<RoomFinderOfferSnapshot>;
  return snapshot.version === 1
    && Array.isArray(snapshot.groups)
    && snapshot.groups.every(group => (
      group
      && typeof group === "object"
      && Number.isInteger(group.groupNumber)
      && Number.isInteger(group.guests)
      && Array.isArray(group.offers)
      && group.offers.every(isTrackedOffer)
    ));
}

export function encodeRoomFinderOfferSnapshot(
  content: string,
  snapshot: RoomFinderOfferSnapshot,
) {
  if (!snapshot.groups.some(group => group.offers.length > 0)) return content;
  return `${content}${ROOM_FINDER_OFFER_SNAPSHOT_MARKER}${JSON.stringify(snapshot)}`;
}

export function decodeRoomFinderOfferSnapshot(content: string): {
  content: string;
  snapshot: RoomFinderOfferSnapshot | null;
} {
  const markerIndex = content.indexOf(ROOM_FINDER_OFFER_SNAPSHOT_MARKER);
  if (markerIndex < 0) return { content, snapshot: null };

  const visibleContent = content.slice(0, markerIndex);
  const rawSnapshot = content.slice(markerIndex + ROOM_FINDER_OFFER_SNAPSHOT_MARKER.length);

  try {
    const snapshot: unknown = JSON.parse(rawSnapshot);
    return isOfferSnapshot(snapshot)
      ? { content: visibleContent, snapshot }
      : { content: visibleContent, snapshot: null };
  } catch {
    return { content: visibleContent, snapshot: null };
  }
}
