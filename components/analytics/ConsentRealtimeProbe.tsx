"use client";

import { useEffect } from "react";

const CONSENT_KEY = "vh_cookie_consent_v1";

export function ConsentRealtimeProbe({ language, pathname }: { language: string; pathname: string }) {
  useEffect(() => {
    if (pathname === "/staff" || pathname.startsWith("/staff/")) return;

    let sent = false;
    const trySend = () => {
      if (sent) return;
      if (window.localStorage.getItem(CONSENT_KEY) !== "accepted") return;
      if (typeof window.gtag !== "function") return;

      sent = true;
      window.gtag("event", "analytics_active", {
        language,
        pathname: window.location.pathname,
        page_title: document.title,
        engagement_time_msec: 1,
      });
    };

    trySend();
    const interval = window.setInterval(trySend, 500);
    return () => window.clearInterval(interval);
  }, [language, pathname]);

  return null;
}
