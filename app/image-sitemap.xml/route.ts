import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

// Page images are now listed inside the main sitemap.xml (see
// lib/image-sitemap.ts), so each page appears in exactly one sitemap.
// Keep this URL alive as a permanent redirect for anything that still has the
// old image sitemap submitted (e.g. Search Console).
export function GET() {
  return new Response(null, {
    status: 308,
    headers: {
      Location: absoluteUrl("/sitemap.xml"),
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
