import type { MetadataRoute } from "next";
import { getBeachSlugs } from "@/content/beach-details";
import { routeMap } from "@/lib/url-map";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = routeMap
    .filter((route) => route.action === "KEEP")
    .filter((route) => !isOldBeachDetailRoute(route.path))
    .map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: now,
      changeFrequency: getChangeFrequency(route.priority),
      priority: getPriority(route.priority),
    }));

  const beachDetailRoutes = getBeachSlugs().map((slug) => ({
    url: absoluteUrl(`/chios/chios-beaches/${slug}/`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...routes, ...beachDetailRoutes];
}

function isOldBeachDetailRoute(path: string) {
  return (
    path.startsWith("/chios/chios-beaches/") &&
    path !== "/chios/chios-beaches/"
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