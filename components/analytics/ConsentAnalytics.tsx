"use client";

import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

type LanguageCode = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

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
      <Script
        id="google-analytics-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics-config" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            anonymize_ip: true,
            send_page_view: true
          });
        `}
      </Script>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
