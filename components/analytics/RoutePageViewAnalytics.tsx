"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA_ID = "G-844GGQ1TC7";

export function RoutePageViewAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPageLocation = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === "/staff" || pathname.startsWith("/staff/")) return;

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    const pageLocation = `${window.location.origin}${pagePath}`;

    if (lastPageLocation.current === pageLocation) return;
    lastPageLocation.current = pageLocation;

    const sendPageView = () => {
      window.gtag?.("event", "page_view", {
        send_to: GA_ID,
        page_title: document.title,
        page_location: pageLocation,
        page_path: pagePath,
      });
    };

    // Let Next.js finish updating the document metadata before reading title.
    const animationFrame = window.requestAnimationFrame(sendPageView);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [pathname, searchParams]);

  return null;
}
