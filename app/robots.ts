import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/private/", "/admin/", "/mixalis/", "/sideris/", "/wp-admin/"],
    },
    host: "https://chioshotel.gr",
    sitemap: "https://chioshotel.gr/sitemap.xml",
  };
}
