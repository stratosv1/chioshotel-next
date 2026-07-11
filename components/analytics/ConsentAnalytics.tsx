"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { Analytics } from "@vercel/analytics/react";

type LanguageCode = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
type ConsentValue = "accepted" | "rejected";

const CONSENT_KEY = "vh_cookie_consent_v1";
const GA_ID = "G-844GGQ1TC7";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const text: Record<LanguageCode, { title: string; body: string; accept: string; reject: string; privacy: string; cookies: string }> = {
  en: { title: "Cookie preferences", body: "We use necessary technologies for the site and optional analytics to improve direct bookings. We do not send names, emails or phone numbers to analytics.", accept: "Accept analytics", reject: "Reject", privacy: "Privacy policy", cookies: "Cookie policy" },
  el: { title: "Προτιμήσεις cookies", body: "Χρησιμοποιούμε απαραίτητες τεχνολογίες για το site και προαιρετικά analytics για βελτίωση των απευθείας κρατήσεων. Δεν στέλνουμε ονόματα, email ή τηλέφωνα στα analytics.", accept: "Αποδοχή analytics", reject: "Απόρριψη", privacy: "Πολιτική απορρήτου", cookies: "Πολιτική cookies" },
  fr: { title: "Préférences de cookies", body: "Nous utilisons des technologies nécessaires et des analytics optionnels pour améliorer les réservations directes. Nous n’envoyons pas de noms, emails ou téléphones aux analytics.", accept: "Accepter analytics", reject: "Refuser", privacy: "Politique de confidentialité", cookies: "Politique de cookies" },
  de: { title: "Cookie-Einstellungen", body: "Wir nutzen notwendige Technologien und optionale Analytics zur Verbesserung von Direktbuchungen. Namen, E-Mails oder Telefonnummern senden wir nicht an Analytics.", accept: "Analytics akzeptieren", reject: "Ablehnen", privacy: "Datenschutzerklärung", cookies: "Cookie-Richtlinie" },
  it: { title: "Preferenze cookie", body: "Usiamo tecnologie necessarie e analytics opzionali per migliorare le prenotazioni dirette. Non inviamo nomi, email o telefoni agli analytics.", accept: "Accetta analytics", reject: "Rifiuta", privacy: "Privacy policy", cookies: "Cookie policy" },
  es: { title: "Preferencias de cookies", body: "Usamos tecnologías necesarias y analytics opcionales para mejorar las reservas directas. No enviamos nombres, emails ni teléfonos a analytics.", accept: "Aceptar analytics", reject: "Rechazar", privacy: "Política de privacidad", cookies: "Política de cookies" },
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

function pageType(pathname: string) {
  if (pathname.includes("find-your-room") || pathname.includes("vres-to-domatio")) return "room_wizard";
  if (pathname.includes("chios-rooms") || pathname.includes("domatia-xios")) return "rooms";
  if (pathname.includes("contact") || pathname.includes("epikoinonia")) return "contact";
  if (pathname.includes("rates") || pathname.includes("kratisi")) return "rates";
  if (["/", "/el/", "/fr/", "/de/", "/it/", "/es/", "/tr/"].includes(pathname)) return "homepage";
  return "content";
}

function detectDeviceArea() {
  if (typeof window === "undefined") return "unknown";
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

function fallbackEventName(anchor: HTMLAnchorElement) {
  const href = anchor.href.toLowerCase();
  const label = (anchor.textContent || "").toLowerCase();
  if (href.includes("wa.me") || href.includes("whatsapp")) return "whatsapp_click";
  if (href.startsWith("tel:")) return "call_click";
  if (href.includes("find-your-room")) return "find_room_click";
  if (href.includes("rates") || label.includes("availability")) return "availability_click";
  if (label.includes("book") || label.includes("κρατ") || label.includes("prenota")) return "book_now_click";
  return null;
}

function getLocation(element: HTMLElement) {
  const explicit = element.dataset.analyticsLocation;
  if (explicit) return explicit;
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  return "content";
}

function getLabel(element: HTMLElement, anchor: HTMLAnchorElement | null) {
  return (
    element.dataset.analyticsLabel ||
    anchor?.dataset.analyticsLabel ||
    (anchor?.textContent || element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80)
  );
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
    if (!accepted) return;

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const element = target?.closest("[data-analytics-event]") as HTMLElement | null;
      const anchor = (element?.closest("a") || target?.closest("a")) as HTMLAnchorElement | null;
      const name = element?.dataset.analyticsEvent || (anchor ? fallbackEventName(anchor) : null);
      if (!name) return;

      track(name, {
        language,
        page_type: pageType(window.location.pathname),
        pathname: window.location.pathname,
        href: anchor ? normalizeUrl(anchor.href) : "",
        link_text: getLabel(element || anchor, anchor),
        cta_location: getLocation(element || anchor),
        device_area: detectDeviceArea(),
      });
    }

    function handleSubmit() {
      track("contact_form_submit", {
        language,
        page_type: pageType(window.location.pathname),
        pathname: window.location.pathname,
        cta_location: "contact_form",
        device_area: detectDeviceArea(),
      });
    }

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit);
    };
  }, [accepted, language]);

  function save(value: ConsentValue) {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  }

  return (
    <>
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
