"use client";

import { useEffect, useMemo, useState } from "react";
import { Analytics, track } from "@vercel/analytics/react";

type LanguageCode = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
type ConsentValue = "accepted" | "rejected";

type ConsentAnalyticsProps = {
  language: LanguageCode;
};

const CONSENT_STORAGE_KEY = "vh_cookie_consent_v1";
const googleAnalyticsId = "G-844GGQ1TC7";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const copy: Record<
  LanguageCode,
  {
    title: string;
    text: string;
    accept: string;
    reject: string;
    manage: string;
    save: string;
    analytics: string;
    necessary: string;
    necessaryText: string;
    analyticsText: string;
    privacy: string;
    cookies: string;
  }
> = {
  en: {
    title: "Cookie preferences",
    text: "We use necessary technologies for the website to work and optional analytics to understand clicks and improve direct bookings. We do not send names, emails or phone numbers to analytics.",
    accept: "Accept analytics",
    reject: "Reject",
    manage: "Customize",
    save: "Save choices",
    analytics: "Analytics",
    necessary: "Necessary",
    necessaryText: "Required for core website functions. Always active.",
    analyticsText: "Helps us measure WhatsApp, call, booking and navigation clicks.",
    privacy: "Privacy policy",
    cookies: "Cookie policy",
  },
  el: {
    title: "Προτιμήσεις cookies",
    text: "Χρησιμοποιούμε απαραίτητες τεχνολογίες για τη λειτουργία του site και προαιρετικά analytics για να καταλαβαίνουμε τα clicks και να βελτιώνουμε τις απευθείας κρατήσεις. Δεν στέλνουμε ονόματα, email ή τηλέφωνα στα analytics.",
    accept: "Αποδοχή analytics",
    reject: "Απόρριψη",
    manage: "Ρυθμίσεις",
    save: "Αποθήκευση επιλογών",
    analytics: "Analytics",
    necessary: "Απαραίτητα",
    necessaryText: "Απαιτούνται για βασικές λειτουργίες του site. Είναι πάντα ενεργά.",
    analyticsText: "Μας βοηθούν να μετράμε clicks σε WhatsApp, τηλέφωνο, κράτηση και πλοήγηση.",
    privacy: "Πολιτική απορρήτου",
    cookies: "Πολιτική cookies",
  },
  fr: {
    title: "Préférences de cookies",
    text: "Nous utilisons des technologies nécessaires au fonctionnement du site et des analytics optionnels pour comprendre les clics et améliorer les réservations directes. Nous n’envoyons pas de noms, emails ou téléphones aux analytics.",
    accept: "Accepter analytics",
    reject: "Refuser",
    manage: "Personnaliser",
    save: "Enregistrer",
    analytics: "Analytics",
    necessary: "Nécessaires",
    necessaryText: "Requis pour les fonctions essentielles du site. Toujours actifs.",
    analyticsText: "Nous aide à mesurer les clics WhatsApp, appel, réservation et navigation.",
    privacy: "Politique de confidentialité",
    cookies: "Politique de cookies",
  },
  de: {
    title: "Cookie-Einstellungen",
    text: "Wir nutzen notwendige Technologien für den Betrieb der Website und optionale Analytics, um Klicks zu verstehen und Direktbuchungen zu verbessern. Namen, E-Mails oder Telefonnummern senden wir nicht an Analytics.",
    accept: "Analytics akzeptieren",
    reject: "Ablehnen",
    manage: "Anpassen",
    save: "Auswahl speichern",
    analytics: "Analytics",
    necessary: "Notwendig",
    necessaryText: "Für zentrale Website-Funktionen erforderlich. Immer aktiv.",
    analyticsText: "Hilft uns, WhatsApp-, Anruf-, Buchungs- und Navigationsklicks zu messen.",
    privacy: "Datenschutzerklärung",
    cookies: "Cookie-Richtlinie",
  },
  it: {
    title: "Preferenze cookie",
    text: "Usiamo tecnologie necessarie per il funzionamento del sito e analytics opzionali per capire i clic e migliorare le prenotazioni dirette. Non inviamo nomi, email o telefoni agli analytics.",
    accept: "Accetta analytics",
    reject: "Rifiuta",
    manage: "Personalizza",
    save: "Salva scelte",
    analytics: "Analytics",
    necessary: "Necessari",
    necessaryText: "Richiesti per le funzioni essenziali del sito. Sempre attivi.",
    analyticsText: "Ci aiuta a misurare clic su WhatsApp, telefono, prenotazione e navigazione.",
    privacy: "Privacy policy",
    cookies: "Cookie policy",
  },
  es: {
    title: "Preferencias de cookies",
    text: "Usamos tecnologías necesarias para que el sitio funcione y analytics opcionales para entender clics y mejorar las reservas directas. No enviamos nombres, emails ni teléfonos a analytics.",
    accept: "Aceptar analytics",
    reject: "Rechazar",
    manage: "Personalizar",
    save: "Guardar opciones",
    analytics: "Analytics",
    necessary: "Necesarias",
    necessaryText: "Requeridas para funciones básicas del sitio. Siempre activas.",
    analyticsText: "Nos ayuda a medir clics de WhatsApp, llamada, reserva y navegación.",
    privacy: "Política de privacidad",
    cookies: "Política de cookies",
  },
  tr: {
    title: "Çerez tercihleri",
    text: "Sitenin çalışması için gerekli teknolojileri ve doğrudan rezervasyonları geliştirmek için isteğe bağlı analytics kullanıyoruz. İsim, e-posta veya telefonları analytics’e göndermiyoruz.",
    accept: "Analytics kabul et",
    reject: "Reddet",
    manage: "Özelleştir",
    save: "Seçimleri kaydet",
    analytics: "Analytics",
    necessary: "Gerekli",
    necessaryText: "Temel site işlevleri için gereklidir. Her zaman aktiftir.",
    analyticsText: "WhatsApp, arama, rezervasyon ve gezinme tıklamalarını ölçmemize yardımcı olur.",
    privacy: "Gizlilik politikası",
    cookies: "Çerez politikası",
  },
};

const legalPaths: Record<LanguageCode, { privacy: string; cookies: string }> = {
  en: { privacy: "/privacy-policy/", cookies: "/cookie-policy/" },
  el: { privacy: "/el/privacy-policy/", cookies: "/el/cookie-policy/" },
  fr: { privacy: "/fr/privacy-policy/", cookies: "/fr/cookie-policy/" },
  de: { privacy: "/de/privacy-policy/", cookies: "/de/cookie-policy/" },
  it: { privacy: "/it/privacy-policy/", cookies: "/it/cookie-policy/" },
  es: { privacy: "/es/privacy-policy/", cookies: "/es/cookie-policy/" },
  tr: { privacy: "/tr/privacy-policy/", cookies: "/tr/cookie-policy/" },
};

function getPageType(pathname: string) {
  if (pathname.includes("find-your-room") || pathname.includes("vres-to-domatio") || pathname.includes("trova-la-tua-camera")) return "room_wizard";
  if (pathname.includes("chios-rooms") || pathname.includes("domatia-xios") || pathname.includes("stanze-a-chios") || pathname.includes("habitaciones-en-chios")) return "rooms";
  if (pathname.includes("rates") || pathname.includes("kratisi") || pathname.includes("prezzi")) return "rates";
  if (pathname.includes("contact") || pathname.includes("epikoinonia") || pathname.includes("contattaci")) return "contact";
  if (["/", "/el/", "/fr/", "/de/", "/it/", "/es/", "/tr/"].includes(pathname)) return "homepage";
  return "content";
}

function getEventName(anchor: HTMLAnchorElement) {
  const href = anchor.href.toLowerCase();
  const text = anchor.textContent?.toLowerCase() || "";
  if (href.includes("wa.me") || href.includes("whatsapp")) return "whatsapp_click";
  if (href.startsWith("tel:")) return "call_click";
  if (href.includes("find-your-room") || text.includes("find your room")) return "find_room_click";
  if (href.includes("rates") || href.includes("availability") || text.includes("availability")) return "availability_click";
  if (text.includes("book") || text.includes("prenota") || text.includes("κρατ")) return "book_now_click";
  return null;
}

function getCtaLocation(element: HTMLElement) {
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  if (element.closest(".rb-inline-total")) return "last_minute_deals";
  if (element.closest(".rd-booking-card")) return "room_detail_booking_card";
  if (element.closest(".mobile-sticky") || element.closest(".vh-mobile-sticky")) return "sticky_bottom";
  return "page_body";
}

function loadGoogleAnalytics() {
  if (document.querySelector(`script[src*=\"${googleAnalyticsId}\"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag("js", new Date());
  window.gtag("config", googleAnalyticsId, { anonymize_ip: true });
}

export function ConsentAnalytics({ language }: ConsentAnalyticsProps) {
  const [consent, setConsent] = useState<ConsentValue | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const t = copy[language] || copy.en;
  const links = legalPaths[language] || legalPaths.en;

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY) as ConsentValue | null;
    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored);
      setAnalyticsEnabled(stored === "accepted");
    }
  }, []);

  useEffect(() => {
    if (!analyticsEnabled) return;
    loadGoogleAnalytics();
  }, [analyticsEnabled]);

  useEffect(() => {
    if (!analyticsEnabled) return;

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const eventName = getEventName(anchor);
      if (!eventName) return;
      const pathname = window.location.pathname;
      track(eventName, {
        language,
        page_type: getPageType(pathname),
        location: getCtaLocation(anchor),
        link_text: (anchor.textContent || "").trim().slice(0, 80),
      });
    }

    function handleSubmit(event: SubmitEvent) {
      const form = event.target as HTMLFormElement | null;
      if (!form) return;
      track("contact_form_submit", {
        language,
        page_type: getPageType(window.location.pathname),
        location: getCtaLocation(form),
      });
    }

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit);
    };
  }, [analyticsEnabled, language]);

  const saveConsent = (value: ConsentValue) => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
    setConsent(value);
    setAnalyticsEnabled(value === "accepted");
  };

  const banner = useMemo(() => {
    if (consent !== null) return null;
    return (
      <div className="vh-consent" role="dialog" aria-live="polite" aria-label={t.title}>
        <div className="vh-consent__card">
          <div>
            <strong>{t.title}</strong>
            <p>{t.text}</p>
            {showDetails ? (
              <div className="vh-consent__details">
                <div><b>{t.necessary}</b><span>{t.necessaryText}</span></div>
                <label><input type="checkbox" checked readOnly /> <b>{t.analytics}</b><span>{t.analyticsText}</span></label>
              </div>
            ) : null}
            <div className="vh-consent__links"><a href={links.privacy}>{t.privacy}</a><a href={links.cookies}>{t.cookies}</a></div>
          </div>
          <div className="vh-consent__actions">
            <button type="button" onClick={() => saveConsent("accepted")}>{t.accept}</button>
            <button type="button" onClick={() => saveConsent("rejected")}>{t.reject}</button>
            <button type="button" onClick={() => setShowDetails((v) => !v)}>{showDetails ? t.save : t.manage}</button>
          </div>
        </div>
      </div>
    );
  }, [consent, links.cookies, links.privacy, showDetails, t]);

  return (
    <>
      {analyticsEnabled ? <Analytics /> : null}
      {banner}
    </>
  );
}
