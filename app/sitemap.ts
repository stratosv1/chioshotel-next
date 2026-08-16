import type { MetadataRoute } from "next";
import { getBeachSlugs } from "@/content/beach-details";
import { familyBeachPaths } from "@/content/family-beaches";
import { elintaBeachPaths, karfasBeachPaths } from "@/content/karfas-elinta-paths";
import { organizedBeachPaths } from "@/content/organized-beaches";
import { shelteredBeachPaths } from "@/content/sheltered-beaches";
import { quietBeachPaths } from "@/content/quiet-beaches";
import { nearbyBeachPaths } from "@/content/nearby-beaches";
import { sandyBeachPaths } from "@/content/sandy-beaches";
import { romanticStayPaths } from "@/content/romantic-stay";
import { villageCategoryPaths } from "@/content/village-categories";
import { getVillageSlugs } from "@/content/village-details";
import { getMuseumSlugs } from "@/content/museum-details";
import { CHIOS_HOTELS_GUIDE_PATHS } from "@/lib/chios-hotels-guide-i18n";
import { routeMap } from "@/lib/url-map";
import { absoluteUrl } from "@/lib/seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

// These timestamps come from the latest significant source/component changes
// for the corresponding canonical route groups. Keep them truthful: do not
// replace them with the build/deploy date unless the page content actually
// changed.
const VERIFIED_LAST_MODIFIED = {
  villageCategories: "2026-07-10T12:17:11Z",
  sandyBeaches: "2026-07-10T14:21:54Z",
  spanishAccommodation: "2026-07-27T05:02:55Z",
  romanticStay: "2026-08-04T17:43:25Z",
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const accommodationLandingRoutes: SitemapEntry[] = [
    ...Object.values(CHIOS_HOTELS_GUIDE_PATHS),
    "/chios-accommodation/",
    "/el/diamoni-sti-xio/",
    "/fr/hebergement-chios/",
    "/de/chios-unterkunft/",
    "/it/alloggio-chios/",
    "/es/alojamiento-chios/",
    "/tr/sakiz-adasi-konaklama/",
  ].map((path) => ({
    url: absoluteUrl(path),
    ...(path === "/es/alojamiento-chios/"
      ? { lastModified: VERIFIED_LAST_MODIFIED.spanishAccommodation }
      : {}),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const romanticStayRoutes: SitemapEntry[] = Object.values(romanticStayPaths).map(
    (path) => ({
      url: absoluteUrl(path),
      lastModified: VERIFIED_LAST_MODIFIED.romanticStay,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const polishRoutes: SitemapEntry[] = [
    "/pl/",
    "/pl/noclegi-chios/",
    "/pl/hotele-chios/",
    "/pl/pokoje-na-chios/",
    "/pl/pokoje-na-chios/pokoj-dwuosobowy-economy/",
    "/pl/pokoje-na-chios/pokoje-standardowe/",
    "/pl/apartamenty-na-chios/",
    "/pl/kambos-chios/",
    "/pl/rezerwacja/",
  ].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "weekly",
    priority: path === "/pl/" ? 1 : 0.9,
  }));

  const routes: SitemapEntry[] = routeMap
    .filter((route) => route.action === "KEEP")
    // These seven localized Find Your Room aliases are permanent redirects to
    // the noindex AI Room Finder application. Redirect/noindex URLs must not be
    // submitted as canonical sitemap entries.
    .filter((route) => route.itemId !== "find-your-room")
    .filter((route) => !isOldBeachDetailRoute(route.path))
    .filter((route) => !isOldVillageDetailRoute(route.path))
    .filter((route) => !isOldMuseumDetailRoute(route.path))
    .map((route) => ({
      url: absoluteUrl(route.path),
      changeFrequency: getChangeFrequency(route.priority),
      priority: getPriority(route.priority),
    }));

  const familyBeachRoutes: SitemapEntry[] = Object.values(familyBeachPaths).map(
    (path) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const organizedBeachRoutes: SitemapEntry[] = Object.values(
    organizedBeachPaths,
  ).map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const shelteredBeachRoutes: SitemapEntry[] = Object.values(
    shelteredBeachPaths,
  ).map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const quietBeachRoutes: SitemapEntry[] = Object.values(quietBeachPaths).map(
    (path) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const nearbyBeachRoutes: SitemapEntry[] = Object.values(nearbyBeachPaths).map(
    (path) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const sandyBeachRoutes: SitemapEntry[] = Object.values(sandyBeachPaths).map(
    (path) => ({
      url: absoluteUrl(path),
      lastModified: VERIFIED_LAST_MODIFIED.sandyBeaches,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const villageCategoryRoutes: SitemapEntry[] = Object.values(
    villageCategoryPaths,
  )
    .flatMap((paths) => Object.values(paths))
    .map((path) => ({
      url: absoluteUrl(path),
      lastModified: VERIFIED_LAST_MODIFIED.villageCategories,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const beachDetailRoutes: SitemapEntry[] = getBeachSlugs().map((slug) => ({
    url: absoluteUrl(`/chios/chios-beaches/${slug}/`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const karfasElintaBeachRoutes: SitemapEntry[] = [
    ...Object.values(karfasBeachPaths),
    ...Object.values(elintaBeachPaths),
  ].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const villageDetailRoutes: SitemapEntry[] = getVillageSlugs().map((slug) => ({
    url: absoluteUrl(`/chios/chios-villages/${slug}/`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const museumDetailRoutes: SitemapEntry[] = getMuseumSlugs().map((slug) => ({
    url: absoluteUrl(`/chios/chios-museums/${slug}/`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return deduplicateByCanonicalUrl([
    ...accommodationLandingRoutes,
    ...romanticStayRoutes,
    ...polishRoutes,
    ...routes,
    ...familyBeachRoutes,
    ...organizedBeachRoutes,
    ...shelteredBeachRoutes,
    ...quietBeachRoutes,
    ...nearbyBeachRoutes,
    ...sandyBeachRoutes,
    ...villageCategoryRoutes,
    ...beachDetailRoutes,
    ...karfasElintaBeachRoutes,
    ...villageDetailRoutes,
    ...museumDetailRoutes,
  ]);
}

function deduplicateByCanonicalUrl(entries: SitemapEntry[]): MetadataRoute.Sitemap {
  const byUrl = new Map<string, SitemapEntry>();

  for (const entry of entries) {
    const existing = byUrl.get(entry.url);

    if (!existing || (entry.priority ?? 0) > (existing.priority ?? 0)) {
      byUrl.set(entry.url, entry);
    }
  }

  return Array.from(byUrl.values());
}

function isOldBeachDetailRoute(path: string) {
  return (
    path.startsWith("/chios/chios-beaches/") &&
    path !== "/chios/chios-beaches/"
  );
}

function isOldVillageDetailRoute(path: string) {
  return (
    path.startsWith("/chios/chios-villages/") &&
    path !== "/chios/chios-villages/"
  );
}

function isOldMuseumDetailRoute(path: string) {
  return (
    path.startsWith("/chios/chios-museums/") &&
    path !== "/chios/chios-museums/"
  );
}

function getPriority(priority: "Critical" | "High" | "Medium" | "Low") {
  switch (priority) {
    case "Critical":
      return 1;
    case "High":
      return 0.8;
    case "Medium":
      return 0.6;
    case "Low":
      return 0.3;
    default:
      return 0.5;
  }
}

function getChangeFrequency(
  priority: "Critical" | "High" | "Medium" | "Low",
): MetadataRoute.Sitemap[number]["changeFrequency"] {
  switch (priority) {
    case "Critical":
      return "weekly";
    case "High":
      return "monthly";
    case "Medium":
      return "monthly";
    case "Low":
      return "yearly";
    default:
      return "monthly";
  }
}
