"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import type { ChiosHotelsGuideLocale } from "@/lib/chios-hotels-guide-i18n";

const CONSENT_KEY = "vh_cookie_consent_v1";

type AnalyticsValue = string | number | boolean | null | undefined;

function emit(name: string, properties: Record<string, AnalyticsValue>) {
  const clean = Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined)) as Record<string, string | number | boolean | null>;
  track(name, clean);
  window.gtag?.("event", name, clean);
}

function deviceArea() {
  if (window.matchMedia("(max-width: 767px)").matches) return "mobile";
  if (window.matchMedia("(max-width: 1199px)").matches) return "tablet";
  return "desktop";
}

function actionFor(url: URL) {
  const value = `${url.pathname}${url.search}${url.hash}`.toLowerCase();
  if (url.hostname.includes("wa.me") || value.includes("whatsapp")) return "whatsapp";
  if (value.includes("ai-assistant")) return "ai_room_finder";
  if (/chios-hotels-rates|amesi-kratisi|tarifs-des-hotels|hotelpreise|prezzi-hotel|precios-de-hotel|sakiz-adasi-rezervasyon/.test(value)) return "booking";
  if (/chios-rooms|domatia-xios|chambres-a-chios|chios-zimmer|zimmer-chios|camere-a-chios|stanze-a-chios|habitaciones-en-chios|sakiz-adasi-odalari|chios-odalari/.test(value)) return "rooms";
  if (value.includes("#live-availability")) return "live_search";
  if (value.includes("#where-to-stay") || value.includes("#kambos-alternative")) return "area_comparison";
  if (/chios-island|ti-na-do-sti-xio|chios-en-grece|chios-insel|chios-lisola|chios-en-grecia|sakiz-adasi|beach|paralia|plage|strand|spiaggia|playa|plaj|village|xoria|dorf|villaggio|pueblo|koy|kampos|kambos/.test(value)) return "island_guide";
  return url.origin === window.location.origin ? "internal_other" : "external_other";
}

export function LocalizedChiosHotelsGuideAnalytics({ locale, pathname }: { locale: ChiosHotelsGuideLocale; pathname: string }) {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const refresh = () => setAccepted(window.localStorage.getItem(CONSENT_KEY) === "accepted");
    refresh();
    const interval = window.setInterval(refresh, 300);
    window.addEventListener("storage", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    if (!accepted) return;

    const common = {
      pathname,
      language: locale,
      search_intent: "chios_hotels",
      device_area: deviceArea(),
    };
    const viewKey = `vh_chios_hotels_page_view:${pathname}`;
    if (!window.sessionStorage.getItem(viewKey)) {
      window.sessionStorage.setItem(viewKey, "1");
      emit("chios_hotels_page_view", {
        ...common,
        page_title: document.querySelector("h1")?.textContent?.trim().replace(/\s+/g, " ").slice(0, 120),
      });
    }

    const recent = new Map<string, number>();
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

      const label = (anchor.textContent || anchor.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 100);
      const action = actionFor(url);
      const section = anchor.closest("section");
      const sectionId = section?.id || section?.getAttribute("aria-labelledby") || "main_content";
      const signature = `${action}|${url.pathname}|${url.hash}|${label}`;
      const now = Date.now();
      const previous = recent.get(signature) || 0;
      if (now - previous < 5000) return;
      recent.set(signature, now);
      window.setTimeout(() => recent.delete(signature), 5000);

      emit("chios_hotels_cta_click", {
        ...common,
        action,
        destination_path: `${url.pathname}${url.search}${url.hash}`,
        destination_domain: url.hostname,
        link_text: label,
        section_id: sectionId,
      });

      if (sectionId === "where-to-stay" || /chios-town|kambos|karfas|mastic-villages/.test(sectionId)) {
        emit("chios_hotels_area_click", {
          ...common,
          area_interest: sectionId,
          destination_path: url.pathname,
          link_text: label,
        });
      }
    }

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      recent.clear();
    };
  }, [accepted, locale, pathname]);

  return null;
}
