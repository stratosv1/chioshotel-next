import { getAgentRoomGuideData } from "@/lib/agent-room-guide-data";
import { SALES_KNOWLEDGE } from "@/lib/ai-assistant/knowledge";
import { AI_DISCOVERY_COPY } from "@/lib/ai-discovery/config";
import { resolveDiscoveryUrl } from "@/lib/ai-discovery/route-resolver";
import { isLanguageCode, type LanguageCode } from "@/lib/languages";

const PUBLIC_CACHE =
  "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400";

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": PUBLIC_CACHE,
      "X-Robots-Tag": "noindex",
    },
  });
}

function languageFromUrl(url: URL): LanguageCode {
  const requested = url.searchParams.get("language") || "en";
  return isLanguageCode(requested) ? requested : "en";
}

function detailsUrlForRoomType(roomType: string, language: LanguageCode) {
  if (roomType === "economy") {
    return resolveDiscoveryUrl("economy-double", language);
  }
  if (roomType === "family") {
    return resolveDiscoveryUrl("family-apartment", language);
  }
  return resolveDiscoveryUrl("standard-double", language);
}

async function roomsPayload(url: URL, language: LanguageCode) {
  const { rooms, commonAmenities } = await getAgentRoomGuideData();
  const requestedRoom = Number(url.searchParams.get("roomNumber") || 0);
  const requestedGuests = Number(url.searchParams.get("guests") || 0);

  const filteredRooms = rooms.filter((room) => {
    if (requestedRoom && room.roomNumber !== requestedRoom) return false;
    if (requestedGuests && room.maxGuests < requestedGuests) return false;
    return true;
  });

  return {
    success: true,
    property: "Voulamandis House",
    accommodationType: "rooms and family apartments",
    location: "Kambos, Chios, Greece",
    language,
    source: "booking_core.rooms + booking_core.room_features",
    commonAmenities,
    rooms: filteredRooms.map((room) => ({
      roomNumber: room.roomNumber,
      displayName: room.displayName,
      roomType: room.roomType,
      floor: room.floor,
      maxGuests: room.maxGuests,
      standardCapacity: room.standardCapacity,
      isEconomy: room.isEconomy,
      noStairs: room.noStairs,
      hasFullKitchen: room.hasFullKitchen,
      hasKitchenette: room.hasKitchenette,
      hasBalcony: room.hasBalcony,
      sizeM2: room.sizeM2,
      spaceLayout: room.spaceLayout,
      bedSetup: room.bedSetup,
      hasUpperFloorView: room.hasUpperFloorView,
      hasGardenView: room.hasGardenView,
      extraBedAvailable: room.extraBedAvailable,
      detailsUrl: detailsUrlForRoomType(room.roomType, language),
    })),
    liveAvailabilityUrl: resolveDiscoveryUrl("find-your-room", language),
    note:
      "Room characteristics are descriptive. Current availability and prices must be checked with the live availability tool.",
  };
}

async function propertyPayload(language: LanguageCode) {
  const property = SALES_KNOWLEDGE.find(
    (item) => item.id === "property-voulamandis-house",
  );
  const { commonAmenities } = await getAgentRoomGuideData();
  const discovery = AI_DISCOVERY_COPY[language];

  return {
    success: true,
    property: "Voulamandis House",
    accommodationType: "rooms and family apartments",
    location: "Kambos, Chios, Greece",
    language,
    summary: discovery.summary,
    description: discovery.info,
    classification: discovery.classification,
    facts: property?.facts || [],
    commonAmenities,
    links: {
      homepage: resolveDiscoveryUrl("home", language),
      rooms: resolveDiscoveryUrl("rooms-index", language),
      directBooking: resolveDiscoveryUrl("booking", language),
      liveRoomFinder: resolveDiscoveryUrl("find-your-room", language),
      contact: resolveDiscoveryUrl("contact", language),
      chiosGuide: resolveDiscoveryUrl("chios-index", language),
    },
  };
}

function offersPayload(language: LanguageCode) {
  const pricing = SALES_KNOWLEDGE.find((item) => item.id === "pricing-live");

  return {
    success: true,
    property: "Voulamandis House",
    language,
    livePricingRequired: true,
    offers: [
      {
        id: "direct-booking-10-percent",
        type: "direct_booking_discount",
        discountPercent: 10,
        stackable: false,
        appliesTo: "AI Room Finder direct offer flow",
        status: "active",
      },
    ],
    facts: pricing?.facts || [],
    links: {
      directBooking: resolveDiscoveryUrl("booking", language),
      liveRoomFinder: resolveDiscoveryUrl("find-your-room", language),
    },
    note:
      "Do not infer a final price from the discount alone. Use live availability for the selected dates and guest count.",
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource");
  const language = languageFromUrl(url);

  try {
    if (resource === "rooms") {
      return json(await roomsPayload(url, language));
    }
    if (resource === "property") {
      return json(await propertyPayload(language));
    }
    if (resource === "offers") {
      return json(offersPayload(language));
    }

    return json(
      {
        success: false,
        code: "INVALID_RESOURCE",
        message: "Use resource=rooms, resource=property, or resource=offers.",
      },
      400,
    );
  } catch (error) {
    console.error("Agentic Voulamandis public data failed", error);
    return json(
      {
        success: false,
        code: "PUBLIC_DATA_UNAVAILABLE",
        message: "Public property information could not be loaded right now.",
      },
      503,
    );
  }
}
