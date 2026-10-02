import "server-only";

import { kamposChiosPaths } from "@/content/kampos-chios-paths";
import { getGroupedLanguagePath } from "@/lib/accommodation-landing-i18n";
import { languages, normalizePath, type LanguageCode } from "@/lib/languages";
import {
  findPublishedLocalizedPath,
  getSiteNavigationPath,
  siteNavigationItemIds as routeIds,
} from "@/lib/site-navigation";
import { getRouteByPath } from "@/lib/url-map";

// Resolves every localized href the site header needs on the server, so the
// header (a client component on every page) does not bundle the URL registry.
// The logic is the same the header previously ran in the browser.

const headerNavKeys = [
  "home",
  "rooms",
  "rates",
  "deals",
  "chios",
  "activities",
  "contact",
  "beaches",
  "villages",
  "museums",
] as const;

type HeaderNavKey = (typeof headerNavKeys)[number];

export type HeaderLinks = {
  nav: Record<HeaderNavKey, string>;
  languages: Record<LanguageCode, string>;
};

function pathFor(itemId: string, language: LanguageCode) {
  return (
    findPublishedLocalizedPath(itemId, language) ||
    getSiteNavigationPath("home", language)
  );
}

function languageHref(pathname: string, language: LanguageCode) {
  const normalizedPathname = normalizePath(pathname);
  const isKamposPage = (Object.values(kamposChiosPaths) as string[]).some(
    (path) => normalizePath(path) === normalizedPathname,
  );

  if (isKamposPage) {
    return kamposChiosPaths[language];
  }

  const groupedPath = getGroupedLanguagePath(pathname, language);
  if (groupedPath) return groupedPath;

  const route = getRouteByPath(normalizedPathname);
  if (!route) return pathFor(routeIds.home, language);
  return (
    findPublishedLocalizedPath(route.itemId, language) ||
    pathFor(routeIds.home, language)
  );
}

export function getHeaderLinks(language: LanguageCode, pathname: string): HeaderLinks {
  const nav = Object.fromEntries(
    headerNavKeys.map((key) => [key, pathFor(routeIds[key], language)]),
  ) as Record<HeaderNavKey, string>;
  const languageHrefs = Object.fromEntries(
    languages.map((item) => [item.code, languageHref(pathname, item.code)]),
  ) as Record<LanguageCode, string>;
  return { nav, languages: languageHrefs };
}
