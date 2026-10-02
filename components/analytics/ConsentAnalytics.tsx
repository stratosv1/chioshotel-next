"use client";

import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

type LanguageCode = "en" | "el" | "fr" | "de" | "it" | "es" | "tr" | "pl";

const GA_ID = "G-844GGQ1TC7";
const LEGACY_CONSENT_KEY = "vh_cookie_consent_v1";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function ConsentAnalytics({ language: _language }: { language: LanguageCode }) {
  return (
    <>
      <Script id="analytics-legacy-consent-bridge" strategy="afterInteractive">
        {`
          try {
            window.localStorage.setItem('${LEGACY_CONSENT_KEY}', 'accepted');
          } catch (error) {
            // Analytics still loads even when localStorage is unavailable.
          }
        `}
      </Script>
      {/*
        gtag.js loads after the page has finished loading so it never competes
        with the hero image (afterInteractive also preloads it in <head>). The
        inline queue below still runs right after hydration, so page views and
        events sent before gtag.js arrives wait in dataLayer and are delivered
        when it loads.
      */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
