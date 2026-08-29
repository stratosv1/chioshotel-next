"use client";

import { useEffect } from "react";
import type { RoomFinderLanguage } from "@/components/ai/room-finder-copy";

const TOOL_NAME = "check_voulamandis_room_availability";
const AVAILABILITY_TIMEOUT_MS = 12_000;
const SUPPORTED_LANGUAGES = new Set<RoomFinderLanguage>([
  "en",
  "el",
  "de",
  "fr",
  "it",
  "es",
  "tr",
]);

type AvailabilityInput = {
  checkin?: unknown;
  checkout?: unknown;
  guests?: unknown;
  language?: unknown;
  allowSplit?: unknown;
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
  execute: (input: AvailabilityInput) => Promise<unknown>;
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

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
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

export function RoomFinderWebMCP() {
  useEffect(() => {
    const modelContext = (document as WebMcpDocument).modelContext;
    if (!modelContext) return;

    const registrationController = new AbortController();

    const tool: WebMcpTool = {
      name: TOOL_NAME,
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
          language: {
            type: "string",
            enum: ["en", "el", "de", "fr", "it", "es", "tr"],
            description: "Preferred language for room names and offer details.",
          },
          allowSplit: {
            type: "boolean",
            description:
              "When true, allow one room change during the stay if no single room is available for every night.",
          },
        },
        required: ["checkin", "checkout", "guests"],
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
        untrustedContentHint: false,
      },
      execute: async (input) => {
        const checkin = typeof input.checkin === "string" ? input.checkin : "";
        const checkout = typeof input.checkout === "string" ? input.checkout : "";
        const guests = Number(input.guests);
        const requestedLanguage =
          typeof input.language === "string" ? input.language : "en";
        const language: RoomFinderLanguage = SUPPORTED_LANGUAGES.has(
          requestedLanguage as RoomFinderLanguage,
        )
          ? (requestedLanguage as RoomFinderLanguage)
          : "en";
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
        }
      },
    };

    void Promise.resolve(
      modelContext.registerTool(tool, { signal: registrationController.signal }),
    ).catch((error) => {
      console.error("WebMCP room availability tool registration failed", error);
    });

    return () => registrationController.abort();
  }, []);

  return null;
}
