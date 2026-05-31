import type { MetadataRoute } from "next";
import { routeMap } from "@/lib/url-map";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = routeMap
    .filter((route) => route.action === "KEEP")
    .map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: now,
      changeFrequency: getChangeFrequency(route.priority),
      priority: getPriority(route.priority),
    }));

  return routes;
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