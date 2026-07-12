"use client";

import { track } from "@vercel/analytics";

export type AiConciergeEvent =
  | "ai_concierge_open"
  | "ai_language_change"
  | "ai_quick_prompt_click"
  | "ai_message_send"
  | "ai_response_received"
  | "ai_availability_search"
  | "ai_room_results"
  | "ai_content_results"
  | "ai_room_card_open"
  | "ai_knowledge_card_click"
  | "ai_booking_request_open"
  | "ai_booking_request_submit"
  | "ai_booking_request_success"
  | "ai_booking_request_error"
  | "ai_whatsapp_click";

export type AiConciergeEventProperties = Record<string, string | number | boolean | null | undefined>;

function cleanProperties(properties: AiConciergeEventProperties) {
  return Object.fromEntries(
    Object.entries(properties)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 120) : value]),
  ) as Record<string, string | number | boolean>;
}

export function trackAiConciergeEvent(event: AiConciergeEvent, properties: AiConciergeEventProperties = {}) {
  if (typeof window === "undefined") return;
  const payload = cleanProperties({ source: "ai_concierge", ...properties });

  try {
    track(event, payload);
  } catch (error) {
    console.debug("Vercel analytics event skipped", error);
  }

  try {
    const analyticsWindow = window as typeof window & {
      gtag?: (...args: unknown[]) => void;
      dataLayer?: Array<Record<string, unknown>>;
    };
    if (typeof analyticsWindow.gtag === "function") {
      analyticsWindow.gtag("event", event, payload);
    } else {
      analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
      analyticsWindow.dataLayer.push({ event, ...payload });
    }
  } catch (error) {
    console.debug("GA event skipped", error);
  }
}
