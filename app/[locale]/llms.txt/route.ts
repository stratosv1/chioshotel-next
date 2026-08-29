import { buildLocalizedLlmsGuide } from "@/lib/ai-discovery/llms-builder";
import { AI_DISCOVERY_LANGUAGES } from "@/lib/ai-discovery/config";
import { isLanguageCode, type LanguageCode } from "@/lib/languages";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return AI_DISCOVERY_LANGUAGES
    .filter((locale) => locale !== "en")
    .map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;

  if (!isLanguageCode(locale) || locale === "en") {
    return new Response("Not found", { status: 404 });
  }

  return new Response(
    buildLocalizedLlmsGuide(locale as Exclude<LanguageCode, "en">),
    {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control":
          "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
