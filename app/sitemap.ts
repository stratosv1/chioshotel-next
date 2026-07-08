import type { MetadataRoute } from "next";
import { getBeachSlugs } from "@/content/beach-details";
import { familyBeachPaths } from "@/content/family-beaches";
import { organizedBeachPaths } from "@/content/organized-beaches";
import { shelteredBeachPaths } from "@/content/sheltered-beaches";
import { getVillageSlugs } from "@/content/village-details";
import { getMuseumSlugs } from "@/content/museum-details";
import { routeMap } from "@/lib/url-map";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = routeMap
    .filter((route) => route.action === "KEEP")
    .filter((route) => !isOldBeachDetailRoute(route.path))
    .filter((route) => !isOldVillageDetailRoute(route.path))
    .filter((route) => !isOldMuseumDetailRoute(route.path))
    .map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: now,
      changeFrequency: getChangeFrequency(route.priority),
      priority: getPriority(route.priority),
    }));

  const familyBeachRoutes = Object.values(familyBeachPaths).map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const organizedBeachRoutes = Object.values(organizedBeachPaths).map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const shelteredBeachRoutes = Object.values(shelteredBeachPaths).map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const beachDetailRoutes = getBeachSlugs().map((slug) => ({
    url: absoluteUrl(`/chios/chios-beaches/${slug}/`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const villageDetailRoutes = getVillageSlugs().map((slug) => ({
    url: absoluteUrl(`/chios/chios-villages/${slug}/`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const museumDetailRoutes = getMuseumSlugs().map((slug) => ({
    url: absoluteUrl(`/chios/chios-museums/${slug}/`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...routes,
    ...familyBeachRoutes,
    ...organizedBeachRoutes,
    ...shelteredBeachRoutes,
    ...beachDetailRoutes,
    ...villageDetailRoutes,
    ...museumDetailRoutes,
  ];
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
