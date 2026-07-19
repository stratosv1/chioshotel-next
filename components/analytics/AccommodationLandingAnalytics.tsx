"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";

type LanguageCode = "en" | "el" | "fr" | "de" | "tr";
type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsProperties = Record<string, AnalyticsValue>;

const CONSENT_KEY = "vh_cookie_consent_v1";
const DEDUP_MS = 5000;

function emit(name: string, properties: AnalyticsProperties) {
  const clean = Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined),
  ) as Record<string, string | number | boolean | null>;

  track(name, clean);
  window.gtag?.("event", name, clean);
}

function deviceArea() {
  if (window.matchMedia("(max-width: 767px)").matches) return "mobile";
  if (window.matchMedia("(max-width: 1199px)").matches) return "tablet";
  return "desktop";
}

function destinationAction(url: URL) {
  const value = `${url.pathname}${url.search}`.toLowerCase();

  if (url.hostname.includes("wa.me") || value.includes("whatsapp")) return "whatsapp";
  if (value.includes("ai-assistant") || value.includes("find-your-room")) return "ai_room_finder";
  if (
    value.includes("chios-hotels-rates") ||
    value.includes("sakiz-adasi-rezervasyon") ||
    value.includes("amesi-kratisi") ||
    value.includes("times-domation") ||
    value.includes("hotelpreise-auf-der-insel-chios") ||
    value.includes("tarifs-des-hotels-a-chios") ||
    value.includes("booking") ||
    value.includes("beds24")
  ) {
    return "booking";
  }
  if (
    value.includes("chios-rooms") ||
    value.includes("sakiz-adasi-odalari") ||
    value.includes("chios-odalari") ||
    value.includes("domatia-xios") ||
    value.includes("chios-zimmer") ||
    value.includes("zimmer-chios") ||
    value.includes("chambres-a-chios")
  ) {
    return "rooms";
  }
  if (url.hostname.includes("google.com") && value.includes("maps")) return "maps";
  if (
    value.includes("chios-island") ||
    value.includes("chios-insel") ||
    value.includes("chios-en-grece") ||
    value.includes("ti-na-do-sti-xio") ||
    value.includes("sakiz-adasi/") ||
    value.includes("paralia") ||
    value.includes("paralies") ||
    value.includes("plage") ||
    value.includes("straende") ||
    value.includes("village") ||
    value.includes("doerfer") ||
    value.includes("musee") ||
    value.includes("museen") ||
    value.includes("plaj") ||
    value.includes("xoria") ||
    value.includes("köy") ||
    value.includes("koy") ||
    value.includes("kambos") ||
    value.includes("kampos")
  ) {
    return "island_guide";
  }
  return url.origin === window.location.origin ? "internal_other" : "external_other";
}

function sectionName(anchor: HTMLAnchorElement) {
  const section = anchor.closest("section");
  return section?.getAttribute("aria-labelledby") || "main_content";
}

export function AccommodationLandingAnalytics({
  language,
  pathname,
}: {
  language: LanguageCode;
  pathname: string;
}) {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const refreshConsent = () => {
      setAccepted(window.localStorage.getItem(CONSENT_KEY) === "accepted");
    };

    refreshConsent();
    const interval = window.setInterval(refreshConsent, 300);
    window.addEventListener("storage", refreshConsent);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", refreshConsent);
    };
  }, []);

  useEffect(() => {
    if (!accepted) return;

    const common = {
      language,
      pathname,
      landing_type: "accommodation_seo",
      device_area: deviceArea(),
    };
    const viewKey = `vh_accommodation_landing_view:${pathname}`;

    if (!window.sessionStorage.getItem(viewKey)) {
      window.sessionStorage.setItem(viewKey, "1");
      emit("accommodation_landing_view", {
        ...common,
        page_title: document.querySelector("h1")?.textContent?.trim().replace(/\s+/g, " ").slice(0, 120),
      });
    }

    const recent = new Map<string, number>();

    function shouldSend(signature: string) {
      const now = Date.now();
      const previous = recent.get(signature) || 0;
      if (now - previous < DEDUP_MS) return false;
      recent.set(signature, now);
      window.setTimeout(() => recent.delete(signature), DEDUP_MS);
      return true;
    }

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor || !anchor.closest("main")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.origin);
      } catch {
        return;
      }

      const label = (anchor.textContent || anchor.getAttribute("aria-label") || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 100);
      const action = destinationAction(url);
      const signature = [pathname, action, url.pathname, label].join("|");
      if (!shouldSend(signature)) return;

      emit("accommodation_landing_cta", {
        ...common,
        action,
        destination_path: `${url.pathname}${url.search}`,
        destination_domain: url.hostname,
        link_text: label,
        section_id: sectionName(anchor),
      });
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      recent.clear();
    };
  }, [accepted, language, pathname]);

  return null;
}
