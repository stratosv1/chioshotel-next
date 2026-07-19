"use client";

import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

type LanguageCode = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

const GA_ID = "G-844GGQ1TC7";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function ConsentAnalytics({ language: _language }: { language: LanguageCode }) {
  return (
    <>
      <Script
        id="google-analytics-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-config" strategy="afterInteractive">
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
