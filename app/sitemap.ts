import type { MetadataRoute } from "next";
import { getBeachSlugs } from "@/content/beach-details";
import { familyBeachPaths } from "@/content/family-beaches";
import { organizedBeachPaths } from "@/content/organized-beaches";
import { shelteredBeachPaths } from "@/content/sheltered-beaches";
import { quietBeachPaths } from "@/content/quiet-beaches";
import { nearbyBeachPaths } from "@/content/nearby-beaches";
import { sandyBeachPaths } from "@/content/sandy-beaches";
import { villageCategoryPaths } from "@/content/village-categories";
import { getVillageSlugs } from "@/content/village-details";
import { getMuseumSlugs } from "@/content/museum-details";
import { routeMap } from "@/lib/url-map";
import { absoluteUrl } from "@/lib/seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

export default function sitemap(): MetadataRoute.Sitemap {
  const accommodationLandingRoutes: SitemapEntry[] = [
    "/chios-hotels/",
    "/chios-accommodation/",
    "/el/diamoni-sti-xio/",
    "/fr/hebergement-chios/",
    "/de/chios-unterkunft/",
    "/it/alloggio-chios/",
    "/es/alojamiento-chios/",
    "/tr/sakiz-adasi-konaklama/",
  ].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const routes: SitemapEntry[] = routeMap
    .filter((route) => route.action === "KEEP")
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
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const beachDetailRoutes: SitemapEntry[] = getBeachSlugs().map((slug) => ({
    url: absoluteUrl(`/chios/chios-beaches/${slug}/`),
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
    ...routes,
    ...familyBeachRoutes,
    ...organizedBeachRoutes,
    ...shelteredBeachRoutes,
    ...quietBeachRoutes,
    ...nearbyBeachRoutes,
    ...sandyBeachRoutes,
    ...villageCategoryRoutes,
    ...beachDetailRoutes,
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
