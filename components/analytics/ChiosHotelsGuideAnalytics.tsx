"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

const CONSENT_KEY = "vh_cookie_consent_v1";
const VIEW_KEY = "vh_chios_hotels_page_view";

function emit(name: string, properties: Record<string, string | number | boolean | null | undefined>) {
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

function actionFor(url: URL) {
  const value = `${url.pathname}${url.search}${url.hash}`.toLowerCase();
  if (url.hostname.includes("wa.me") || value.includes("whatsapp")) return "whatsapp";
  if (value.includes("ai-assistant")) return "ai_room_finder";
  if (value.includes("chios-hotels-rates")) return "booking";
  if (value.includes("chios-rooms")) return "rooms";
  if (value.includes("#live-availability")) return "live_search";
  if (value.includes("#where-to-stay") || value.includes("#kambos-alternative")) return "area_comparison";
  if (/chios-island|chios-beaches|chios-villages|kampos-chios/.test(value)) return "island_guide";
  return url.origin === window.location.origin ? "internal_other" : "external_other";
}

export function ChiosHotelsGuideAnalytics() {
  useEffect(() => {
    if (window.localStorage.getItem(CONSENT_KEY) !== "accepted") return;

    const common = {
      pathname: "/chios-hotels/",
      language: "en",
      search_intent: "chios_hotels",
      device_area: deviceArea(),
    };

    if (!window.sessionStorage.getItem(VIEW_KEY)) {
      window.sessionStorage.setItem(VIEW_KEY, "1");
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

      const label = (anchor.textContent || anchor.getAttribute("aria-label") || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 100);
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
  }, []);

  return null;
}
