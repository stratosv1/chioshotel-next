import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { BookingFunnelAnalytics } from "@/components/analytics/BookingFunnelAnalytics";
import { ConsentAnalytics } from "@/components/analytics/ConsentAnalytics";
import { ConsentRealtimeProbe } from "@/components/analytics/ConsentRealtimeProbe";
import { ContentEngagementAnalytics } from "@/components/analytics/ContentEngagementAnalytics";
import { RoutePageViewAnalytics } from "@/components/analytics/RoutePageViewAnalytics";
import { RoomFinderCtaRouter } from "@/components/navigation/RoomFinderCtaRouter";
import { ExploreVoulamandisJourney } from "@/components/seo/ExploreVoulamandisJourney";
import { VoulamandisFooterTailwind } from "@/components/VoulamandisFooterTailwind";
import { VoulamandisHeaderTailwind } from "@/components/VoulamandisHeaderTailwind";
import { ensureKarfasElintaBeachCards } from "@/content/karfas-beach-card";
import { siteName, siteUrl } from "@/lib/seo";
import "./css-split/core.css";
import "./css-split/overrides/home-mobile-hero-safe.css";
import "./css-split/overrides/home-compact-mobile-fixes.css";
import "./css-split/components/consent.css";
import "./css-split/overrides/cta-warm-contrast.css";

ensureKarfasElintaBeachCards();

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
      { url: "/favicon/vh-heart-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon/vh-heart-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon/favicon.ico" },
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

export const viewport: Viewport = {
  themeColor: "#a4907c",
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

function isMixalisPath(pathname: string): boolean {
  return pathname === "/mixalis" || pathname.startsWith("/mixalis/");
}

function isAgentRoomPath(pathname: string): boolean {
  const normalizedPathname = pathname.endsWith("/") ? pathname : pathname + "/";
  return (
    normalizedPathname === "/agents/rooms/" ||
    /^\/(el|fr|de|it|es|tr)\/agents\/rooms\/$/.test(normalizedPathname)
  );
}

function isTripPlannerPath(pathname: string): boolean {
  const normalizedPathname = pathname.endsWith("/") ? pathname : pathname + "/";
  return normalizedPathname === "/trip-planner/";
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
  const privatePhysicsPath = isMixalisPath(pathname);
  const hideGlobalChrome = hideHeader || isPolishPath || privatePhysicsPath;
  const hideJourney = isTripPlannerPath(pathname) || isAgentRoomPath(pathname) || privatePhysicsPath;
  const hideFooter = isTripPlannerPath(pathname) || privatePhysicsPath;
  const excludeAnalytics = isStaffPath(pathname) || privatePhysicsPath;

  return (
    <html lang={htmlLanguage}>
      <body>
        {!isPolishPath && !excludeAnalytics ? <RoomFinderCtaRouter /> : null}
        {!hideGlobalChrome ? (
          <VoulamandisHeaderTailwind language={sharedLanguage} pathname={pathname} />
        ) : null}
        {children}
        {!hideGlobalChrome && !hideJourney ? (
          <ExploreVoulamandisJourney language={sharedLanguage} pathname={pathname} />
        ) : null}
        {!hideGlobalChrome && !hideFooter ? (
          <VoulamandisFooterTailwind language={sharedLanguage} />
        ) : null}
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
