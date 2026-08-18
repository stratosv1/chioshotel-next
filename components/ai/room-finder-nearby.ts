export type NearbyAlternativePayload = {
  checkin?: unknown;
  checkout?: unknown;
  shiftDays?: unknown;
  offers?: unknown;
};

export type NearbyPayloadClassification =
  | { status: "ok"; alternatives: NearbyAlternativePayload[] }
  | { status: "unavailable"; code: string };

export function classifyNearbyPayload(
  responseOk: boolean,
  payload: any,
): NearbyPayloadClassification {
  if (!responseOk || !payload?.success || !Array.isArray(payload?.alternatives)) {
    return {
      status: "unavailable",
      code: String(payload?.code || "ALTERNATIVES_UNAVAILABLE"),
    };
  }

  return {
    status: "ok",
    alternatives: payload.alternatives as NearbyAlternativePayload[],
  };
}
