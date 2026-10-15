"use client";

import { track } from "@vercel/analytics";

export type LeadType =
  | "contact_form"
  | "live_deals_request"
  | "ai_room_finder_request"
  | "ai_room_finder_contact";

export type LeadProperties = Record<string, string | number | boolean | null | undefined>;

function cleanProperties(properties: LeadProperties) {
  return Object.fromEntries(
    Object.entries(properties)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 100) : value]),
  ) as Record<string, string | number | boolean>;
}

/**
 * Sends a single "generate_lead" conversion. Call it only after the server has
 * confirmed the request was received, never on form submit or button click.
 */
export function trackLead(leadType: LeadType, properties: LeadProperties = {}) {
  if (typeof window === "undefined") return;
  const payload = cleanProperties({
    ...properties,
    lead_type: leadType,
    pathname: window.location.pathname,
    language: document.documentElement.lang,
  });

  try {
    track("generate_lead", payload);
  } catch (error) {
    console.debug("Vercel analytics event skipped", error);
  }

  try {
    const analyticsWindow = window as typeof window & { gtag?: (...args: unknown[]) => void };
    analyticsWindow.gtag?.("event", "generate_lead", payload);
  } catch (error) {
    console.debug("GA event skipped", error);
  }
}
