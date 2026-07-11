import type { Metadata } from "next";
import { headers } from "next/headers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ConsentAnalytics } from "@/components/analytics/ConsentAnalytics";
import { BeachCategoryLanguageLinksHydrator } from "@/components/ui/BeachCategoryLanguageLinksHydrator";
import { CarouselArrowHydrator } from "@/components/ui/CarouselArrowHydrator";
import { VoulamandisFooterTailwind } from "@/components/VoulamandisFooterTailwind";
import { VoulamandisHeaderTailwind } from "@/components/VoulamandisHeaderTailwind";
import { siteName, siteUrl } from "@/lib/seo";
import "./css-split/core.css";
import "./css-split/overrides/home-mobile-hero-safe.css";
import "./css-split/overrides/header-mobile-menu-icons.css";
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
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
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

type SiteLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

function getHtmlLanguage(pathname: string): SiteLanguage {
  const firstSegment = pathname.split("/").filter(Boolean)[0];

  if (["el", "fr", "de", "it", "es", "tr"].includes(firstSegment)) {
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
    normalizedPathname.endsWith("/welcome/")
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-current-pathname") || "/";
  const htmlLanguage = getHtmlLanguage(pathname);
  const hideHeader = isGuidePath(pathname);

  return (
    <html lang={htmlLanguage}>
      <body>
        {!hideHeader ? (
          <VoulamandisHeaderTailwind language={htmlLanguage} pathname={pathname} />
        ) : null}
        {children}
        {!hideHeader ? <VoulamandisFooterTailwind language={htmlLanguage} /> : null}
        <BeachCategoryLanguageLinksHydrator />
        <CarouselArrowHydrator />
        <ConsentAnalytics language={htmlLanguage} />
        <SpeedInsights />
      </body>
    </html>
  );
}
