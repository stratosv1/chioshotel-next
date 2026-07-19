"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

type LanguageCode = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsProperties = Record<string, AnalyticsValue>;

type Props = {
  language: LanguageCode;
  pathname: string;
};

const CONSENT_KEY = "vh_cookie_consent_v1";
const CONTENT_MARKERS = [
  "beach", "beaches", "paralia", "paralies", "plage", "plages", "strand", "spiaggia", "spiagge", "playa", "plaj",
  "village", "villages", "xoria", "chorio", "köy", "koy", "dorf", "villaggio", "villaggi", "pueblo",
  "museum", "museums", "mouseio", "musee", "museo", "musei", "muze",
  "activities", "activity", "drastiriotites", "aktivitaeten", "attivita", "actividades", "aktiviteler",
  "chios-island", "chios-el", "chios-lisola-in-grecia", "ti-na-do-sti-xio", "sakiz-adasi", "kambos", "kampos", "orchid", "thermal", "food", "taste",
  "chios-accommodation", "diamoni-sti-xio", "hebergement-chios", "chios-unterkunft", "alloggio-chios", "sakiz-adasi-konaklama",
];

function isInformationPage(pathname: string) {
  const normalized = pathname.toLowerCase();
  return CONTENT_MARKERS.some((marker) => normalized.includes(marker));
}

function deviceArea() {
  if (window.matchMedia("(max-width: 767px)").matches) return "mobile";
  if (window.matchMedia("(max-width: 1199px)").matches) return "tablet";
  return "desktop";
}

function contentCategory(pathname: string) {
  const value = pathname.toLowerCase();
  if (/chios-accommodation|diamoni-sti-xio|hebergement-chios|chios-unterkunft|alloggio-chios|sakiz-adasi-konaklama/.test(value)) return "accommodation";
  if (/beach|paralia|paralies|plage|strand|spiaggia|spiagge|playa|plaj/.test(value)) return "beach";
  if (/village|xoria|chorio|köy|koy|dorf|villaggio|villaggi|pueblo/.test(value)) return "village";
  if (/museum|mouseio|musee|museo|musei|muze/.test(value)) return "museum";
  if (/activit|drastiriot|aktivitaet/.test(value)) return "activity";
  if (/kambos|kampos/.test(value)) return "kambos";
  return "chios_guide";
}

function destinationType(pathname: string) {
  const value = pathname.toLowerCase();
  if (value.includes("ai-assistant") || value.includes("find-your-room") || value.includes("vres-to-domatio")) return "ai_room_finder";
  if (value.includes("chios-rooms") || value.includes("domatia-xios") || value.includes("chambres-a-chios") || value.includes("zimmer") || value.includes("camere") || value.includes("stanze") || value.includes("habitaciones") || value.includes("odalari")) return "rooms";
  if (value.includes("rates") || value.includes("times-domation") || value.includes("tarifs") || value.includes("preise") || value.includes("prezzi") || value.includes("precios") || value.includes("fiyatlari") || value.includes("kratis") || value.includes("sakiz-adasi-rezervasyon")) return "rates";
  if (/chios-accommodation|diamoni-sti-xio|hebergement-chios|chios-unterkunft|alloggio-chios|sakiz-adasi-konaklama/.test(value)) return "accommodation_landing";
  if (["/", "/el/", "/fr/", "/de/", "/it/", "/es/", "/tr/"].includes(pathname)) return "homepage";
  if (isInformationPage(pathname)) return "other_information";
  return "other_internal";
}

function emit(name: string, properties: AnalyticsProperties) {
  const clean = Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined)) as Record<string, string | number | boolean | null>;
  track(name, clean);
  window.gtag?.("event", name, clean);
}

function contentName() {
  return document.querySelector("h1")?.textContent?.trim().replace(/\s+/g, " ").slice(0, 120) || document.title.split("|")[0]?.trim();
}

function clickEvent(anchor: HTMLAnchorElement, category: string) {
  const href = anchor.href.toLowerCase();
  const label = (anchor.textContent || anchor.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").toLowerCase();
  const image = anchor.querySelector("img");

  if (href.includes("google.com/maps") || href.includes("maps.app.goo.gl") || href.includes("goo.gl/maps")) return "google_maps_click";
  if (anchor.dataset.language || anchor.closest("[data-language-switcher]") || /english|ελλην|français|deutsch|italiano|español|türkçe/.test(label)) return "language_switch_from_content";
  if (image || anchor.closest("[role='dialog'],[data-gallery],[class*='gallery'],[class*='carousel']")) return "gallery_open";

  const target = destinationType(new URL(anchor.href, window.location.origin).pathname);
  if (target === "rooms") return "content_to_rooms";
  if (target === "rates") return "content_to_booking";
  if (target === "ai_room_finder") return "content_to_ai_assistant";
  if (target === "accommodation_landing") return "content_to_accommodation";
  if (target === "other_information" && category === "beach") return "related_beach_click";
  if (target === "other_information" && category === "village") return "related_village_click";
  return "content_internal_click";
}

export function ContentEngagementAnalytics({ language, pathname }: Props) {
  useEffect(() => {
    if (!isInformationPage(pathname)) return;
    if (window.localStorage.getItem(CONSENT_KEY) !== "accepted") return;

    const startedAt = Date.now();
    const reached = new Set<number>();
    const recent = new Map<string, number>();
    let maxScroll = 0;
    let internalClicks = 0;
    let summarySent = false;

    const common = {
      language,
      pathname,
      content_category: contentCategory(pathname),
      content_name: contentName(),
      device_area: deviceArea(),
    };

    function shouldSend(signature: string) {
      const now = Date.now();
      const previous = recent.get(signature) || 0;
      if (now - previous < 5000) return false;
      recent.set(signature, now);
      window.setTimeout(() => recent.delete(signature), 5000);
      return true;
    }

    emit("content_page_view", common);

    const timers = [
      window.setTimeout(() => emit("content_engaged_15s", common), 15_000),
      window.setTimeout(() => emit("content_engaged_30s", common), 30_000),
      window.setTimeout(() => emit("content_engaged_60s", common), 60_000),
    ];

    function handleScroll() {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const percentage = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      maxScroll = Math.max(maxScroll, percentage);

      for (const threshold of [25, 50, 75, 90]) {
        if (percentage < threshold || reached.has(threshold)) continue;
        reached.add(threshold);
        emit("content_scroll_depth", { ...common, scroll_percent: threshold });
      }
    }

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      const button = target?.closest("button") as HTMLButtonElement | null;

      if (button && button.closest("[role='dialog'],[data-gallery],[class*='gallery'],[class*='carousel']")) {
        const label = (button.textContent || button.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 80);
        const eventName = /next|right|επόμε|suivant|weiter|avanti|siguiente|sonraki/i.test(label) ? "gallery_next" : "gallery_open";
        const signature = `${eventName}|${pathname}|${label}`;
        if (shouldSend(signature)) emit(eventName, { ...common, control_label: label });
        return;
      }

      if (!anchor) return;
      if (anchor.closest("header") || anchor.closest("footer")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.origin);
      } catch {
        return;
      }

      const eventName = clickEvent(anchor, common.content_category);
      const label = (anchor.textContent || anchor.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 80);
      const signature = `${eventName}|${pathname}|${url.pathname}|${label}`;
      if (!shouldSend(signature)) return;

      if (url.origin === window.location.origin) internalClicks += 1;
      emit(eventName, {
        ...common,
        destination_path: url.pathname,
        destination_type: url.origin === window.location.origin ? destinationType(url.pathname) : "external",
        link_text: label,
        link_position: anchor.closest("main") ? "main_content" : "page_content",
      });
    }

    function sendSummary() {
      if (summarySent) return;
      summarySent = true;
      emit("content_exit_summary", {
        ...common,
        engaged_seconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
        max_scroll_percent: maxScroll,
        internal_clicks: internalClicks,
        continued_deeper: internalClicks > 0,
      });
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") sendSummary();
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", sendSummary);
    handleScroll();

    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", sendSummary);
      recent.clear();
      sendSummary();
    };
  }, [language, pathname]);

  return null;
}
