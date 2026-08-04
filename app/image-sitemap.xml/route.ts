import { absoluteUrl } from "@/lib/seo";
import { getAllSeoImageSets } from "@/lib/seo-image-registry";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const urls = getAllSeoImageSets()
    .map((set) => {
      const images = set.images
        .map(
          (image) => `
    <image:image>
      <image:loc>${escapeXml(absoluteUrl(image.src))}</image:loc>
    </image:image>`,
        )
        .join("");

      return `
  <url>
    <loc>${escapeXml(absoluteUrl(set.path))}</loc>${images}
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
