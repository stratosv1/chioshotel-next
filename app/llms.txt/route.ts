import { buildRootLlmsGuide } from "@/lib/ai-discovery/llms-builder";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildRootLlmsGuide(), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
