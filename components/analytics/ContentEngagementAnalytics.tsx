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
  "beach", "beaches", "paralia", "paralies", "plage", "plages", "strand", "spiaggia", "playa", "plaj",
  "village", "villages", "xoria", "chorio", "köy", "koy", "dorf", "villaggio", "pueblo",
  "museum", "museums", "mouseio", "musee", "museo", "muze",
  "activities", "activity", "drastiriotites", "aktivitaeten", "attivita", "actividades", "aktiviteler",
  "chios-island", "chios-el", "sakiz-adasi", "kambos", "kampos", "orchid", "thermal", "food", "taste",
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
  if (/beach|paralia|paralies|plage|strand|spiaggia|playa|plaj/.test(value)) return "beach";
  if (/village|xoria|chorio|köy|koy|dorf|villaggio|pueblo/.test(value)) return "village";
  if (/museum|mouseio|musee|museo|muze/.test(value)) return "museum";
  if (/activit|drastiriot|aktivitaet/.test(value)) return "activity";
  if (/kambos|kampos/.test(value)) return "kambos";
  return "chios_guide";
}

function destinationType(pathname: string) {
  const value = pathname.toLowerCase();
  if (value.includes("ai-assistant") || value.includes("find-your-room")) return "ai_room_finder";
  if (value.includes("chios-rooms") || value.includes("domatia-xios") || value.includes("chambres-a-chios") || value.includes("zimmer") || value.includes("camere") || value.includes("habitaciones") || value.includes("odalari")) return "rooms";
  if (value.includes("rates") || value.includes("times-domation") || value.includes("tarifs") || value.includes("preise") || value.includes("prezzi") || value.includes("precios") || value.includes("fiyatlari")) return "rates";
  if (["/", "/el/", "/fr/", "/de/", "/it/", "/es/", "/tr/"].includes(pathname)) return "homepage";
  if (isInformationPage(pathname)) return "other_information";
  return "other_internal";
}

function emit(name: string, properties: AnalyticsProperties) {
  const clean = Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined)) as Record<string, string | number | boolean | null>;
  track(name, clean);
  window.gtag?.("event", name, clean);
}

export function ContentEngagementAnalytics({ language, pathname }: Props) {
  useEffect(() => {
    if (!isInformationPage(pathname)) return;
    if (window.localStorage.getItem(CONSENT_KEY) !== "accepted") return;

    const startedAt = Date.now();
    const reached = new Set<number>();
    let maxScroll = 0;
    let internalClicks = 0;
    let summarySent = false;

    const common = {
      language,
      pathname,
      content_category: contentCategory(pathname),
      device_area: deviceArea(),
    };

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
      if (!anchor || anchor.target === "_blank") return;
      if (anchor.closest("header") || anchor.closest("footer")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.origin);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      internalClicks += 1;
      emit("content_internal_click", {
        ...common,
        destination_path: url.pathname,
        destination_type: destinationType(url.pathname),
        link_text: (anchor.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
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
      sendSummary();
    };
  }, [language, pathname]);

  return null;
}
