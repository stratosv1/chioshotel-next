import type { LanguageCode } from "./languages";
import { getRoutesByItemId } from "./url-map";

export const siteNavigationItemIds = {
  home: "home",
  rooms: "rooms-index",
  rates: "booking",
  deals: "deals",
  chios: "chios-index",
  beaches: "beaches-index",
  villages: "villages-index",
  museums: "museums-index",
  activities: "chios-activities-hub",
  contact: "contact",
  quiz: "chios-quiz",
} as const;

export type SiteNavigationKey = keyof typeof siteNavigationItemIds;

export function findPublishedLocalizedPath(
  itemId: string,
  language: LanguageCode,
): string | undefined {
  return getRoutesByItemId(itemId).find(
    (route) => route.language === language && route.action === "KEEP",
  )?.path;
}

export function getSiteNavigationPath(
  key: SiteNavigationKey,
  language: LanguageCode,
): string {
  const itemId = siteNavigationItemIds[key];
  const path = findPublishedLocalizedPath(itemId, language);

  if (!path) {
    throw new Error(
      `Missing published ${language} route for navigation item "${itemId}".`,
    );
  }

  return path;
}
