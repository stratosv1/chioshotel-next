"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

type LanguageCode = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
type ConsentValue = "accepted" | "rejected";
type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsProperties = Record<string, AnalyticsValue>;

const CONSENT_KEY = "vh_cookie_consent_v1";
const GA_ID = "G-844GGQ1TC7";
const EVENT_DEDUP_WINDOW_MS = 5000;
const AI_OPEN_SESSION_KEY = "vh_ai_assistant_open_tracked";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __vhConsentAnalyticsInstalled?: boolean;
  }
}

const text: Record<LanguageCode, { title: string; body: string; accept: string; reject: string; privacy: string; cookies: string }> = {
  en: { title: "Cookie preferences", body: "We use necessary technologies for the site and optional analytics to improve direct bookings. We do not send names, emails or phone numbers to analytics.", accept: "Accept analytics", reject: "Reject", privacy: "Privacy policy", cookies: "Cookie policy" },
  el: { title: "Προτιμήσεις cookies", body: "Χρησιμοποιούμε απαραίτητες τεχνολογίες για το site και προαιρετικά analytics για βελτίωση των απευθείας κρατήσεων. Δεν στέλνουμε ονόματα, email ή τηλέφωνα στα analytics.", accept: "Αποδοχή analytics", reject: "Απόρριψη", privacy: "Πολιτική απορρήτου", cookies: "Πολιτική cookies" },
  fr: { title: "Préférences cookie", body: "Nous utilisons des technologies nécessaires et des analytics optionnels pour améliorer les réservations directes. Nous n’envoyons pas de noms, emails ou téléphones aux analytics.", accept: "Accepter analytics", reject: "Refuser", privacy: "Politique de confidentialité", cookies: "Politique de cookies" },
  de: { title: "Cookie-Einstellungen", body: "Wir nutzen notwendige Technologien und optionale Analytics zur Verbesserung von Direktbuchungen. Namen, E-Mails oder Telefonnummern senden wir nicht an Analytics.", accept: "Analytics akzeptieren", reject: "Ablehnen", privacy: "Datenschutzerklärung", cookies: "Cookie-Richtlinie" },
  it: { title: "Preferenze cookie", body: "Usiamo tecnologie necessarie e analytics opzionali per migliorare le prenotazioni dirette. Non inviamo nomi, email o telefoni agli analytics.", accept: "Accetta analytics", reject: "Rifiuta", privacy: "Privacy policy", cookies: "Cookie policy" },
  es: { title: "Preferencias cookie", body: "Usamos tecnologías necesarias y analytics opcionales para mejorar las reservas directas. No enviamos nombres, emails ni teléfonos a analytics.", accept: "Aceptar analytics", reject: "Rechazar", privacy: "Política de privacidad", cookies: "Política de cookies" },
  tr: { title: "Çerez tercihleri", body: "Gerekli site teknolojilerini ve doğrudan rezervasyonları geliştirmek için isteğe bağlı analytics kullanıyoruz. Analytics’e isim, e-posta veya telefon göndermeyiz.", accept: "Analytics kabul et", reject: "Reddet", privacy: "Gizlilik politikası", cookies: "Çerez politikası" },
};

const policyPaths: Record<LanguageCode, { privacy: string; cookies: string }> = {
  en: { privacy: "/privacy-policy/", cookies: "/cookie-policy/" },
  el: { privacy: "/el/privacy-policy/", cookies: "/el/cookie-policy/" },
  fr: { privacy: "/fr/privacy-policy/", cookies: "/fr/cookie-policy/" },
  de: { privacy: "/de/privacy-policy/", cookies: "/de/cookie-policy/" },
  it: { privacy: "/it/privacy-policy/", cookies: "/it/cookie-policy/" },
  es: { privacy: "/es/privacy-policy/", cookies: "/es/cookie-policy/" },
  tr: { privacy: "/tr/privacy-policy/", cookies: "/tr/cookie-policy/" },
};

function loadGoogleAnalytics() {
  if (document.querySelector(`script[src*="${GA_ID}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { anonymize_ip: true });
}

function emitAnalyticsEvent(name: string, properties: AnalyticsProperties) {
  const cleanProperties = Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined)) as Record<string, string | number | boolean | null>;
  track(name, cleanProperties);
  window.gtag?.("event", name, cleanProperties);
}

function pageType(pathname: string) {
  if (pathname.includes("ai-assistant")) return "ai_room_finder";
  if (pathname.includes("find-your-room") || pathname.includes("vres-to-domatio")) return "room_wizard";
  if (pathname.includes("chios-rooms") || pathname.includes("domatia-xios")) return "rooms";
  if (pathname.includes("contact") || pathname.includes("epikoinonia")) return "contact";
  if (pathname.includes("rates") || pathname.includes("kratisi")) return "rates";
  if (["/", "/el/", "/fr/", "/de/", "/it/", "/es/", "/tr/"].includes(pathname)) return "homepage";
  return "content";
}

function detectDeviceArea() {
  if (window.matchMedia("(max-width: 767px)").matches) return "mobile";
  if (window.matchMedia("(max-width: 1199px)").matches) return "tablet";
  return "desktop";
}

function normalizeUrl(href: string) {
  try {
    const url = new URL(href);
    return `${url.pathname}${url.search}${url.hash}` || "/";
  } catch {
    return href;
  }
}

function getLocation(element: HTMLElement) {
  if (element.dataset.analyticsLocation) return element.dataset.analyticsLocation;
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  if (window.location.pathname.includes("ai-assistant")) return "ai_assistant";
  return "content";
}

function fallbackEventName(anchor: HTMLAnchorElement) {
  const href = anchor.href.toLowerCase();
  const label = (anchor.textContent || "").toLowerCase();
  const isAiAssistant = window.location.pathname.includes("ai-assistant");
  if (href.includes("wa.me") || href.includes("whatsapp")) return isAiAssistant ? "ai_whatsapp_click" : "whatsapp_click";
  if (href.startsWith("mailto:")) return isAiAssistant ? "ai_email_click" : "email_click";
  if (href.startsWith("tel:")) return "call_click";
  if (href.includes("ai-assistant") || href.includes("find-your-room")) return "ai_assistant_open_click";
  if (href.includes("rates") || label.includes("availability")) return "availability_click";
  if (label.includes("book") || label.includes("κρατ") || label.includes("prenota")) return "book_now_click";
  if (anchor.closest("header")) return "header_link_click";
  if (anchor.closest("footer")) return "footer_link_click";
  return null;
}

function fallbackButtonEvent(button: HTMLButtonElement) {
  if (window.location.pathname.includes("ai-assistant")) {
    const label = (button.textContent || "").trim().replace(/\s+/g, " ").toLowerCase();
    if (button.querySelector("img") && button.querySelector("h2")) return "ai_room_card_click";
    if (label.includes("interested") || label.includes("ενδιαφέρομαι")) return "ai_room_selected";
    const dialog = button.closest('[role="dialog"][aria-modal="true"]');
    const aria = (button.getAttribute("aria-label") || "").trim().toLowerCase();
    const isExactClose = ["close", "κλείσιμο", "schließen", "fermer", "chiudi", "cerrar", "kapat"].includes(aria);
    if (dialog && (label === "✕" || label === "×" || isExactClose)) return "ai_room_modal_close";
  }

  if (!button.closest("header") || !button.querySelector(".sr-only")) return null;
  const expanded = button.getAttribute("aria-expanded");
  if (expanded === "false") return "mobile_menu_open";
  if (expanded === "true") return "mobile_menu_close";
  return null;
}

function getLabel(element: HTMLElement, anchor: HTMLAnchorElement | null) {
  return element.dataset.analyticsLabel || anchor?.dataset.analyticsLabel || (anchor?.textContent || element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80);
}

function getRequestUrl(input: RequestInfo | URL) {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

function differenceInNights(checkin?: string, checkout?: string) {
  if (!checkin || !checkout) return undefined;
  const start = Date.parse(`${checkin}T12:00:00Z`);
  const end = Date.parse(`${checkout}T12:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return undefined;
  return Math.round((end - start) / 86_400_000);
}

export function ConsentAnalytics({ language }: { language: LanguageCode }) {
  const [consent, setConsent] = useState<ConsentValue | null>(null);
  const accepted = consent === "accepted";
  const copy = text[language] || text.en;
  const paths = policyPaths[language] || policyPaths.en;

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY) as ConsentValue | null;
    if (stored === "accepted" || stored === "rejected") setConsent(stored);
  }, []);

  useEffect(() => {
    if (accepted) loadGoogleAnalytics();
  }, [accepted]);

  useEffect(() => {
    if (!accepted || window.__vhConsentAnalyticsInstalled) return;
    window.__vhConsentAnalyticsInstalled = true;

    const recentEvents = new Map<string, number>();
    const shouldTrack = (signature: string) => {
      const now = Date.now();
      const previous = recentEvents.get(signature) || 0;
      if (now - previous < EVENT_DEDUP_WINDOW_MS) return false;
      recentEvents.set(signature, now);
      window.setTimeout(() => {
        if (recentEvents.get(signature) === now) recentEvents.delete(signature);
      }, EVENT_DEDUP_WINDOW_MS);
      return true;
    };

    const commonProperties = (): AnalyticsProperties => ({ language, page_type: pageType(window.location.pathname), pathname: window.location.pathname, device_area: detectDeviceArea() });

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const element = target?.closest("[data-analytics-event]") as HTMLElement | null;
      const anchor = (element?.closest("a") || target?.closest("a")) as HTMLAnchorElement | null;
      const button = (element?.closest("button") || target?.closest("button")) as HTMLButtonElement | null;
      const baseElement = element || anchor || button;
      const name = element?.dataset.analyticsEvent || (anchor ? fallbackEventName(anchor) : button ? fallbackButtonEvent(button) : null);
      if (!baseElement || !name) return;

      const href = anchor ? normalizeUrl(anchor.href) : "";
      const label = getLabel(baseElement, anchor);
      const signature = [name, window.location.pathname, href, label].join("|");
      if (!shouldTrack(signature)) return;

      emitAnalyticsEvent(name, { ...commonProperties(), href, link_text: label, cta_location: getLocation(baseElement) });
    };

    if (window.location.pathname.includes("ai-assistant") && !window.sessionStorage.getItem(AI_OPEN_SESSION_KEY)) {
      window.sessionStorage.setItem(AI_OPEN_SESSION_KEY, "1");
      emitAnalyticsEvent("ai_assistant_open", { ...commonProperties(), source_page: document.referrer ? normalizeUrl(document.referrer) : "direct" });
    }

    const originalFetch = window.fetch.bind(window);
    const analyticsFetch: typeof window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (!response.ok) return response;

      const requestUrl = getRequestUrl(args[0]);
      let pathname = requestUrl;
      try { pathname = new URL(requestUrl, window.location.origin).pathname; } catch { /* keep original */ }

      if (pathname === "/api/ai-assistant/smart") {
        void response.clone().json().then((data: { search?: { checkin?: string; checkout?: string; guests?: number }; offers?: unknown[]; noAvailability?: boolean }) => {
          const checkin = data.search?.checkin;
          const checkout = data.search?.checkout;
          const guests = data.search?.guests;
          if (!checkin || !checkout || !guests) return;

          const searchSignature = `${checkin}|${checkout}|${guests}`;
          const searchKey = `vh_ai_search_started:${searchSignature}`;
          if (!window.sessionStorage.getItem(searchKey)) {
            window.sessionStorage.setItem(searchKey, "1");
            emitAnalyticsEvent("ai_search_started", { ...commonProperties(), check_in: checkin, check_out: checkout, nights: differenceInNights(checkin, checkout), guests });
          }

          const offersCount = Array.isArray(data.offers) ? data.offers.length : 0;
          const resultName = data.noAvailability ? "ai_no_availability" : offersCount > 0 ? "ai_search_results" : null;
          if (!resultName) return;
          const resultKey = `vh_${resultName}:${searchSignature}`;
          if (window.sessionStorage.getItem(resultKey)) return;
          window.sessionStorage.setItem(resultKey, "1");
          emitAnalyticsEvent(resultName, { ...commonProperties(), check_in: checkin, check_out: checkout, nights: differenceInNights(checkin, checkout), guests, available_rooms_count: offersCount });
        }).catch(() => undefined);
      }

      if (pathname === "/api/ai-assistant/request-email") {
        const key = "vh_ai_lead_submit_once";
        if (!window.sessionStorage.getItem(key)) {
          window.sessionStorage.setItem(key, "1");
          emitAnalyticsEvent("ai_lead_submit", { ...commonProperties(), lead_type: "room_offer_email", conversion: true });
        }
      }

      if (pathname === "/api/ai-assistant/no-availability-request") {
        const key = "vh_ai_manual_lead_submit_once";
        if (!window.sessionStorage.getItem(key)) {
          window.sessionStorage.setItem(key, "1");
          emitAnalyticsEvent("ai_manual_lead_submit", { ...commonProperties(), lead_type: "no_availability_request", conversion: true });
        }
      }

      return response;
    };

    window.fetch = analyticsFetch;
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      if (window.fetch === analyticsFetch) window.fetch = originalFetch;
      window.__vhConsentAnalyticsInstalled = false;
      recentEvents.clear();
    };
  }, [accepted, language]);

  function save(value: ConsentValue) {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  }

  return (
    <>
      <SpeedInsights />
      {accepted ? <Analytics /> : null}
      {consent === null ? (
        <div className="vh-consent" role="dialog" aria-live="polite" aria-label={copy.title}>
          <div className="vh-consent__card">
            <div>
              <strong>{copy.title}</strong>
              <p>{copy.body}</p>
              <div className="vh-consent__links">
                <a href={paths.privacy}>{copy.privacy}</a>
                <a href={paths.cookies}>{copy.cookies}</a>
              </div>
            </div>
            <div className="vh-consent__actions">
              <button type="button" onClick={() => save("accepted")}>{copy.accept}</button>
              <button type="button" onClick={() => save("rejected")}>{copy.reject}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
