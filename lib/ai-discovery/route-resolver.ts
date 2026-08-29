import type { LanguageCode } from "@/lib/languages";
import { routeMap } from "@/lib/url-map";
import type { AiDiscoveryItemId } from "@/lib/ai-discovery/config";

export const SITE_ORIGIN = "https://chioshotel.gr";

export function resolveDiscoveryUrl(
  itemId: AiDiscoveryItemId,
  language: LanguageCode,
) {
  const route = routeMap.find(
    (candidate) =>
      candidate.itemId === itemId &&
      candidate.language === language &&
      candidate.action === "KEEP",
  );

  if (!route) {
    throw new Error(
      `AI discovery: missing KEEP route for itemId "${itemId}" and language "${language}"`,
    );
  }

  return new URL(route.path, SITE_ORIGIN).toString();
}

export function localizedLlmsUrl(language: LanguageCode) {
  if (language === "en") return `${SITE_ORIGIN}/llms.txt`;
  return `${SITE_ORIGIN}/${language}/llms.txt`;
}
