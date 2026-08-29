"use client";

import { useEffect } from "react";
import type { RoomFinderLanguage } from "@/components/ai/room-finder-copy";

const AVAILABILITY_TOOL = "check_voulamandis_room_availability";
const ROOMS_TOOL = "get_voulamandis_rooms";
const OFFERS_TOOL = "get_voulamandis_offers";
const PROPERTY_TOOL = "get_voulamandis_property_info";
const KNOWLEDGE_TOOL = "search_chioshotel_information";
const AVAILABILITY_TIMEOUT_MS = 12_000;
const PUBLIC_DATA_TIMEOUT_MS = 8_000;
const SUPPORTED_LANGUAGES = new Set<RoomFinderLanguage>([
  "en",
  "el",
  "de",
  "fr",
  "it",
  "es",
  "tr",
]);

type WebMcpInput = Record<string, unknown>;

type WebMcpExecutionClient = {
  signal?: AbortSignal;
};

type WebMcpTool = {
  name: string;
  title?: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
  };
  execute: (
    input: WebMcpInput,
    client?: WebMcpExecutionClient,
  ) => Promise<unknown>;
};

type WebMcpModelContext = {
  registerTool: (
    tool: WebMcpTool,
    options?: { signal?: AbortSignal },
  ) => void | Promise<void>;
};

type WebMcpDocument = Document & {
  modelContext?: WebMcpModelContext;
};

const LANGUAGE_SCHEMA = {
  type: "string",
  enum: ["en", "el", "de", "fr", "it", "es", "tr"],
  description: "Preferred language for public property links and context.",
};

const READ_ONLY_ANNOTATIONS = {
  readOnlyHint: true,
  untrustedContentHint: false,
};

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeLanguage(value: unknown): RoomFinderLanguage {
  const requested = typeof value === "string" ? value : "en";
  return SUPPORTED_LANGUAGES.has(requested as RoomFinderLanguage)
    ? (requested as RoomFinderLanguage)
    : "en";
}

function compactOffer(offer: unknown) {
  if (!offer || typeof offer !== "object") return null;
  const value = offer as Record<string, unknown>;

  return {
    roomNumber: value.roomNumber,
    name: value.name,
    category: value.category,
    floor: value.floor,
    maxGuests: value.maxGuests,
    nights: value.nights,
    originalTotal: value.originalTotal,
    directTotal: value.directTotal,
    saving: value.saving,
    breakfastTotalIfAdded: value.breakfastTotalIfAdded,
    features: Array.isArray(value.features) ? value.features.slice(0, 6) : undefined,
    detailsUrl: value.detailsUrl,
  };
}

async function fetchPublicResource(
  resource: "rooms" | "offers" | "property" | "knowledge",
  input: WebMcpInput,
  client: WebMcpExecutionClient,
) {
  const language = normalizeLanguage(input.language);
  const query = new URLSearchParams({ resource, language });

  if (resource === "rooms") {
    const roomNumber = Number(input.roomNumber);
    const guests = Number(input.guests);
    if (Number.isInteger(roomNumber) && roomNumber >= 1 && roomNumber <= 10) {
      query.set("roomNumber", String(roomNumber));
    }
    if (Number.isInteger(guests) && guests >= 1 && guests <= 5) {
      query.set("guests", String(guests));
    }
  }

  if (resource === "knowledge") {
    if (typeof input.query === "string") query.set("q", input.query.trim());
    if (typeof input.kind === "string") query.set("kind", input.kind);
  }

  const requestController = new AbortController();
  const handleClientAbort = () => requestController.abort();
  if (client.signal?.aborted) {
    requestController.abort();
  } else {
    client.signal?.addEventListener("abort", handleClientAbort, { once: true });
  }

  const timeoutId = window.setTimeout(
    () => requestController.abort(),
    PUBLIC_DATA_TIMEOUT_MS,
  );

  try {
    const response = await fetch(
      `/api/agentic/voulamandis?${query.toString()}`,
      {
        cache: "no-store",
        signal: requestController.signal,
      },
    );
    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload || typeof payload !== "object") {
      return payload && typeof payload === "object"
        ? payload
        : {
            success: false,
            code: "PUBLIC_DATA_UNAVAILABLE",
            message: "Public Voulamandis House information could not be loaded right now.",
          };
    }

    return payload;
  } catch (error) {
    if (requestController.signal.aborted) {
      return client.signal?.aborted
        ? {
            success: false,
            code: "CANCELLED",
            message: "The information request was cancelled.",
          }
        : {
            success: false,
            code: "TIMEOUT",
            message: "Public property information did not respond in time.",
          };
    }

    console.error("WebMCP public property data failed", error);
    return {
      success: false,
      code: "PUBLIC_DATA_UNAVAILABLE",
      message: "Public Voulamandis House information could not be loaded right now.",
    };
  } finally {
    window.clearTimeout(timeoutId);
    client.signal?.removeEventListener("abort", handleClientAbort);
  }
}

function availabilityTool(): WebMcpTool {
  return {
    name: AVAILABILITY_TOOL,
    title: "Check Voulamandis House room availability",
    description:
      "Check live availability and direct room offers for Voulamandis House rooms and family apartments in Kambos, Chios, Greece. Use ISO dates (YYYY-MM-DD). This is a read-only search and does not create a booking or send an enquiry.",
    inputSchema: {
      type: "object",
      properties: {
        checkin: {
          type: "string",
          format: "date",
          description: "Arrival date in YYYY-MM-DD format.",
        },
        checkout: {
          type: "string",
          format: "date",
          description: "Departure date in YYYY-MM-DD format. Must be after check-in.",
        },
        guests: {
          type: "integer",
          minimum: 1,
          maximum: 5,
          description: "Number of guests sharing one room or apartment.",
        },
        language: LANGUAGE_SCHEMA,
        allowSplit: {
          type: "boolean",
          description:
            "When true, allow one room change during the stay if no single room is available for every night.",
        },
      },
      required: ["checkin", "checkout", "guests"],
      additionalProperties: false,
    },
    annotations: READ_ONLY_ANNOTATIONS,
    execute: async (input, client = {}) => {
      const checkin = typeof input.checkin === "string" ? input.checkin : "";
      const checkout = typeof input.checkout === "string" ? input.checkout : "";
      const guests = Number(input.guests);
      const language = normalizeLanguage(input.language);
      const allowSplit = input.allowSplit !== false;

      if (
        !isIsoDate(checkin) ||
        !isIsoDate(checkout) ||
        checkout <= checkin ||
        !Number.isInteger(guests) ||
        guests < 1 ||
        guests > 5
      ) {
        return {
          success: false,
          code: "INVALID_INPUT",
          message:
            "Use valid ISO check-in/check-out dates and an integer guest count from 1 to 5.",
        };
      }

      const query = new URLSearchParams({
        checkin,
        checkout,
        guests: String(guests),
        lang: language,
        allowSplit: allowSplit ? "1" : "0",
      });
      const requestController = new AbortController();
      const handleClientAbort = () => requestController.abort();

      if (client.signal?.aborted) {
        requestController.abort();
      } else {
        client.signal?.addEventListener("abort", handleClientAbort, { once: true });
      }

      const timeoutId = window.setTimeout(
        () => requestController.abort(),
        AVAILABILITY_TIMEOUT_MS,
      );

      try {
        const response = await fetch(
          `/api/ai-room-finder/availability?${query.toString()}`,
          {
            cache: "no-store",
            signal: requestController.signal,
          },
        );
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload || typeof payload !== "object") {
          return {
            success: false,
            code: "AVAILABILITY_UNAVAILABLE",
            message: "Live room availability could not be confirmed right now.",
          };
        }

        const value = payload as Record<string, unknown>;
        const offers = Array.isArray(value.offers)
          ? value.offers.map(compactOffer).filter(Boolean).slice(0, 10)
          : [];

        return {
          success: value.success === true,
          property: "Voulamandis House",
          accommodationType: "rooms and family apartments",
          location: "Kambos, Chios, Greece",
          checkin,
          checkout,
          guests,
          language,
          splitStay: value.splitStay === true,
          offers,
          bookingCreated: false,
          note:
            "Availability and prices are live search results. No booking or enquiry has been created.",
        };
      } catch (error) {
        if (requestController.signal.aborted) {
          if (client.signal?.aborted) {
            return {
              success: false,
              code: "CANCELLED",
              message: "Room availability search was cancelled.",
            };
          }

          return {
            success: false,
            code: "TIMEOUT",
            message: "Live room availability did not respond in time. Try the search again.",
          };
        }

        console.error("WebMCP room availability search failed", error);
        return {
          success: false,
          code: "AVAILABILITY_UNAVAILABLE",
          message: "Live room availability could not be confirmed right now.",
        };
      } finally {
        window.clearTimeout(timeoutId);
        client.signal?.removeEventListener("abort", handleClientAbort);
      }
    },
  };
}

function roomsTool(): WebMcpTool {
  return {
    name: ROOMS_TOOL,
    title: "Get Voulamandis House rooms and apartments",
    description:
      "Get structured public details for Voulamandis House rooms and family apartments, including capacity, beds, floor, stairs, kitchen facilities, room size and common amenities. Optionally filter by room number or minimum guest capacity. Use the live availability tool for dates and prices.",
    inputSchema: {
      type: "object",
      properties: {
        language: LANGUAGE_SCHEMA,
        roomNumber: {
          type: "integer",
          minimum: 1,
          maximum: 10,
          description: "Optional specific room number from 1 to 10.",
        },
        guests: {
          type: "integer",
          minimum: 1,
          maximum: 5,
          description: "Optional minimum guest capacity required.",
        },
      },
      additionalProperties: false,
    },
    annotations: READ_ONLY_ANNOTATIONS,
    execute: (input, client = {}) => fetchPublicResource("rooms", input, client),
  };
}

function offersTool(): WebMcpTool {
  return {
    name: OFFERS_TOOL,
    title: "Get Voulamandis House direct offers",
    description:
      "Get current public direct-booking offer rules for Voulamandis House. This tool explains the offer but never invents a final price; use live availability for the actual total for selected dates and guests.",
    inputSchema: {
      type: "object",
      properties: { language: LANGUAGE_SCHEMA },
      additionalProperties: false,
    },
    annotations: READ_ONLY_ANNOTATIONS,
    execute: (input, client = {}) => fetchPublicResource("offers", input, client),
  };
}

function propertyTool(): WebMcpTool {
  return {
    name: PROPERTY_TOOL,
    title: "Get Voulamandis House property information",
    description:
      "Get official structured information about Voulamandis House in Kambos, Chios: accommodation type, location, common amenities, positioning and canonical links for rooms, direct booking, contact and the Chios guide.",
    inputSchema: {
      type: "object",
      properties: { language: LANGUAGE_SCHEMA },
      additionalProperties: false,
    },
    annotations: READ_ONLY_ANNOTATIONS,
    execute: (input, client = {}) => fetchPublicResource("property", input, client),
  };
}

function knowledgeTool(): WebMcpTool {
  return {
    name: KNOWLEDGE_TOOL,
    title: "Search Voulamandis House and Chios information",
    description:
      "Search the existing curated information published by the chioshotel.gr experience about Voulamandis House, Kambos, breakfast, arrival and transport, beaches, villages, museums, activities, family travel, rooms, booking and pricing guidance. Use the dedicated availability tool for live prices and dates.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          minLength: 2,
          maxLength: 160,
          description: "What public property or Chios information to find.",
        },
        kind: {
          type: "string",
          enum: [
            "property",
            "room",
            "pricing",
            "booking",
            "beach",
            "village",
            "museum",
            "activity",
            "family",
            "transport",
          ],
          description: "Optional information category to narrow the search.",
        },
        language: LANGUAGE_SCHEMA,
      },
      required: ["query"],
      additionalProperties: false,
    },
    annotations: READ_ONLY_ANNOTATIONS,
    execute: (input, client = {}) => fetchPublicResource("knowledge", input, client),
  };
}

export function RoomFinderWebMCP() {
  useEffect(() => {
    const modelContext = (document as WebMcpDocument).modelContext;
    if (!modelContext) return;

    const registrationController = new AbortController();
    const tools = [
      availabilityTool(),
      roomsTool(),
      offersTool(),
      propertyTool(),
      knowledgeTool(),
    ];

    for (const tool of tools) {
      void Promise.resolve(
        modelContext.registerTool(tool, { signal: registrationController.signal }),
      ).catch((error) => {
        console.error(`WebMCP tool registration failed: ${tool.name}`, error);
      });
    }

    return () => registrationController.abort();
  }, []);

  return null;
}
