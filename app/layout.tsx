import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { BookingFunnelAnalytics } from "@/components/analytics/BookingFunnelAnalytics";
import { ConsentAnalytics } from "@/components/analytics/ConsentAnalytics";
import { ConsentRealtimeProbe } from "@/components/analytics/ConsentRealtimeProbe";
import { ContentEngagementAnalytics } from "@/components/analytics/ContentEngagementAnalytics";
import { RoutePageViewAnalytics } from "@/components/analytics/RoutePageViewAnalytics";
import { ExploreVoulamandisJourney } from "@/components/seo/ExploreVoulamandisJourney";
import { VoulamandisFooterTailwind } from "@/components/VoulamandisFooterTailwind";
import { VoulamandisHeaderTailwind } from "@/components/VoulamandisHeaderTailwind";
import { siteName, siteUrl } from "@/lib/seo";
import "./css-split/core.css";
import "./css-split/overrides/home-mobile-hero-safe.css";
import "./css-split/overrides/home-compact-mobile-fixes.css";
import "./css-split/components/consent.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chios Rooms & Apartments | Voulamandis House",
    template: `%s | ${siteName}`,
  },
  description:
    "Quiet rooms and apartments in Kampos, Chios. Stay at Voulamandis House near Chios Town, the airport, beaches, villages and local attractions.",
  icons: {
    icon: [
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
};

type SharedSiteLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
type SiteLanguage = SharedSiteLanguage | "pl";

function getHtmlLanguage(pathname: string): SiteLanguage {
  const firstSegment = pathname.split("/").filter(Boolean)[0];

  if (["el", "fr", "de", "it", "es", "tr", "pl"].includes(firstSegment)) {
    return firstSegment as SiteLanguage;
  }

  return "en";
}

function isGuidePath(pathname: string): boolean {
  const normalizedPathname = pathname.endsWith("/") ? pathname : pathname + "/";

  return (
    normalizedPathname === "/pre-arrival/" ||
    normalizedPathname.endsWith("/pre-arrival/") ||
    normalizedPathname === "/welcome/" ||
    normalizedPathname.endsWith("/welcome/") ||
    normalizedPathname === "/ai-assistant/"
  );
}

function isStaffPath(pathname: string): boolean {
  return pathname === "/staff" || pathname.startsWith("/staff/");
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-current-pathname") || "/";
  const htmlLanguage = getHtmlLanguage(pathname);
  const isPolishPath = htmlLanguage === "pl";
  const sharedLanguage: SharedSiteLanguage = isPolishPath ? "en" : htmlLanguage;
  const hideHeader = isGuidePath(pathname);
  const hideGlobalChrome = hideHeader || isPolishPath;
  const excludeAnalytics = isStaffPath(pathname);

  return (
    <html lang={htmlLanguage}>
      <body>
        {!hideGlobalChrome ? (
          <VoulamandisHeaderTailwind language={sharedLanguage} pathname={pathname} />
        ) : null}
        {children}
        {!hideGlobalChrome ? (
          <ExploreVoulamandisJourney language={sharedLanguage} pathname={pathname} />
        ) : null}
        {!hideGlobalChrome ? <VoulamandisFooterTailwind language={sharedLanguage} /> : null}
        {!excludeAnalytics ? (
          <>
            <Suspense fallback={null}>
              <RoutePageViewAnalytics />
            </Suspense>
            <BookingFunnelAnalytics language={htmlLanguage} pathname={pathname} />
            <ContentEngagementAnalytics language={htmlLanguage} pathname={pathname} />
            <ConsentRealtimeProbe language={htmlLanguage} pathname={pathname} />
            <ConsentAnalytics language={htmlLanguage} />
          </>
        ) : null}
      </body>
    </html>
  );
}
