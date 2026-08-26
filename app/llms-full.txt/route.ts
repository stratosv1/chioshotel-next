import sitemap from "@/app/sitemap";
import { buildLlmsFullGuide } from "@/lib/llms-full-guide";

export const dynamic = "force-static";

export function GET() {
  const canonicalUrls = sitemap().map((entry) => entry.url);
  const body = buildLlmsFullGuide(canonicalUrls);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
