import type { MetadataRoute } from "next";

const PUBLIC_DISALLOW = ["/api/", "/private/", "/admin/", "/wp-admin/"];

const AI_SEARCH_AND_RETRIEVAL_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [...AI_SEARCH_AND_RETRIEVAL_BOTS],
        allow: "/",
        disallow: PUBLIC_DISALLOW,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: PUBLIC_DISALLOW,
      },
    ],
    host: "https://chioshotel.gr",
    sitemap: [
      "https://chioshotel.gr/sitemap.xml",
      "https://chioshotel.gr/image-sitemap.xml",
    ],
  };
}
