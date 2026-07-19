"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

type LanguageCode = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
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

function normalize(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function roomIdFrom(element: HTMLElement) {
  return (
    element.dataset.roomId ||
    element.closest<HTMLElement>("[data-room-id]")?.dataset.roomId ||
    element.closest<HTMLElement>("[data-unit-id]")?.dataset.unitId ||
    undefined
  );
}

function roomNameFrom(element: HTMLElement) {
  return (
    element.dataset.roomName ||
    element.closest<HTMLElement>("[data-room-name]")?.dataset.roomName ||
    element.closest("article,section")?.querySelector("h1,h2,h3")?.textContent?.trim().slice(0, 100) ||
    undefined
  );
}

function bookingEvent(anchor: HTMLAnchorElement | null, button: HTMLButtonElement | null) {
  const element = (anchor || button) as HTMLElement | null;
  if (!element) return null;
  const href = (anchor?.href || "").toLowerCase();
  const label = normalize(element.textContent || element.getAttribute("aria-label") || "");

  if (href.includes("wa.me") || href.includes("whatsapp")) return "whatsapp_lead";
  if (href.startsWith("mailto:")) return "email_lead";
  if (href.startsWith("tel:")) return "phone_lead";
  if (href.includes("ai-assistant") || href.includes("find-your-room") || href.includes("vres-to-domatio")) return "availability_search";
  if (href.includes("rates") || href.includes("kratis") || href.includes("booking") || href.includes("beds24")) return "begin_booking";
  if (/book|reserve|κρατ|réserv|buch|prenot|reservar|rezerv/.test(label)) return "begin_booking";
  if (/availability|διαθεσιμό|disponibil|verfüg|disponib|müsait/.test(label)) return "availability_search";
  if (/interested|ενδιαφέρομαι|intéress|interess|interesado|ilgilen/.test(label)) return "generate_lead";
  if (/choose room|select room|επιλογή δωματίου|διάλεξε|zimmer wählen|choisir/.test(label)) return "select_room";
  return null;
}

export function BookingFunnelAnalytics({ language, pathname }: { language: LanguageCode; pathname: string }) {
  useEffect(() => {
    if (pathname === "/staff" || pathname.startsWith("/staff/")) return;
    if (window.localStorage.getItem(CONSENT_KEY) !== "accepted") return;

    const recent = new Map<string, number>();
    const common = () => ({ language, pathname: window.location.pathname, device_area: deviceArea() });

    function shouldSend(signature: string) {
      const now = Date.now();
      const previous = recent.get(signature) || 0;
      if (now - previous < DEDUP_MS) return false;
      recent.set(signature, now);
      window.setTimeout(() => recent.delete(signature), DEDUP_MS);
      return true;
    }

    const roomPage = /chios-rooms|domatia-xios|chambres-a-chios|zimmer|camere|habitaciones|odalari/.test(window.location.pathname.toLowerCase());
    if (roomPage) {
      const key = `vh_view_room:${window.location.pathname}`;
      if (!window.sessionStorage.getItem(key)) {
        window.sessionStorage.setItem(key, "1");
        emit("view_room", {
          ...common(),
          room_name: document.querySelector("h1")?.textContent?.trim().slice(0, 100),
        });
      }
    }

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const explicit = target?.closest<HTMLElement>("[data-analytics-event]");
      const anchor = (explicit?.closest("a") || target?.closest("a")) as HTMLAnchorElement | null;
      const button = (explicit?.closest("button") || target?.closest("button")) as HTMLButtonElement | null;
      const base = explicit || anchor || button;
      if (!base) return;

      const name = explicit?.dataset.analyticsEvent || bookingEvent(anchor, button);
      if (!name) return;

      const href = anchor ? `${new URL(anchor.href, window.location.origin).pathname}${new URL(anchor.href, window.location.origin).search}` : "";
      const label = (base.textContent || base.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 100);
      const signature = [name, window.location.pathname, href, label].join("|");
      if (!shouldSend(signature)) return;

      emit(name, {
        ...common(),
        href,
        link_text: label,
        room_id: roomIdFrom(base),
        room_name: roomNameFrom(base),
        cta_location: base.closest("header") ? "header" : base.closest("footer") ? "footer" : "content",
      });
    }

    function handleSubmit(event: SubmitEvent) {
      const form = event.target as HTMLFormElement | null;
      if (!form) return;
      const signature = `generate_lead|${window.location.pathname}|${form.action}|${form.id}`;
      if (!shouldSend(signature)) return;
      emit("generate_lead", {
        ...common(),
        form_id: form.id || undefined,
        form_action: form.action || undefined,
        lead_type: "form_submit",
      });
    }

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit);
      recent.clear();
    };
  }, [language, pathname]);

  return null;
}
