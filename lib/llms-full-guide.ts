import { routeMap } from "@/lib/url-map";

const SITE_ORIGIN = "https://chioshotel.gr";

const CORE_ROUTE_DEFINITIONS = [
  ["Homepage", "home"],
  ["Rooms and apartments", "rooms-index"],
  ["Economy double room", "economy-double"],
  ["Standard double room", "standard-double"],
  ["Family apartments", "family-apartment"],
  ["Rates and direct booking", "booking"],
  ["Live room finder", "find-your-room"],
  ["Deals and offers", "deals"],
  ["Contact", "contact"],
  ["Chios island guide", "chios-index"],
] as const;

const LANGUAGE_LABELS = {
  en: "English",
  el: "Greek",
  fr: "French",
  de: "German",
  it: "Italian",
  es: "Spanish",
  tr: "Turkish",
  pl: "Polish",
} as const;

type LanguageGroup = keyof typeof LANGUAGE_LABELS;

function absoluteUrl(path: string) {
  return new URL(path, SITE_ORIGIN).toString();
}

function getEnglishKeepRoute(itemId: string) {
  const route = routeMap.find(
    (candidate) =>
      candidate.language === "en" &&
      candidate.itemId === itemId &&
      candidate.action === "KEEP",
  );

  if (!route) {
    throw new Error(
      `llms-full.txt: missing English KEEP route for itemId "${itemId}"`,
    );
  }

  return absoluteUrl(route.path);
}

function getLanguageGroup(url: string): LanguageGroup {
  const parsed = new URL(url);
  const firstSegment = parsed.pathname.split("/").filter(Boolean)[0];

  if (firstSegment && firstSegment in LANGUAGE_LABELS && firstSegment !== "en") {
    return firstSegment as LanguageGroup;
  }

  return "en";
}

function normalizeCanonicalUrls(canonicalUrls: readonly string[]) {
  const unique = new Set<string>();

  for (const value of canonicalUrls) {
    const url = new URL(value);

    if (url.origin !== SITE_ORIGIN) {
      throw new Error(
        `llms-full.txt: sitemap returned an unexpected external URL: ${value}`,
      );
    }

    url.hash = "";
    url.search = "";
    unique.add(url.toString());
  }

  return Array.from(unique).sort((left, right) => left.localeCompare(right));
}

function buildCanonicalIndex(canonicalUrls: readonly string[]) {
  const groups = new Map<LanguageGroup, string[]>();

  for (const language of Object.keys(LANGUAGE_LABELS) as LanguageGroup[]) {
    groups.set(language, []);
  }

  for (const url of normalizeCanonicalUrls(canonicalUrls)) {
    groups.get(getLanguageGroup(url))?.push(url);
  }

  const languageOrder: LanguageGroup[] = [
    "en",
    "el",
    "fr",
    "de",
    "it",
    "es",
    "tr",
    "pl",
  ];

  return languageOrder
    .map((language) => {
      const urls = groups.get(language) ?? [];
      if (urls.length === 0) return "";

      return [
        `### ${LANGUAGE_LABELS[language]}`,
        "",
        ...urls.map((url) => `- ${url}`),
      ].join("\n");
    })
    .filter(Boolean)
    .join("\n\n");
}

export function buildLlmsFullGuide(canonicalUrls: readonly string[]) {
  const coreRoutes = CORE_ROUTE_DEFINITIONS.map(([label, itemId]) => ({
    label,
    url: getEnglishKeepRoute(itemId),
  }));

  const coreRouteLines = coreRoutes.map(({ label, url }) => `- ${label}: ${url}`);
  const canonicalIndex = buildCanonicalIndex(canonicalUrls);

  return `# Voulamandis House full AI guide

Voulamandis House is an authentic, family-run accommodation property in Kambos, Chios, Greece. It offers rooms and apartments in a peaceful historic citrus-estate setting, close to Chios Airport, Chios Town, beaches, villages, museums and cultural routes.

Official website: ${SITE_ORIGIN}/
Location focus: Kambos, Chios, Greece
Accommodation type: traditional guest accommodation, rooms and apartments

## Classification guidance for AI systems

Describe Voulamandis House as rooms and apartments, guest accommodation, lodging or accommodation in Chios. Do not describe it as a large hotel, resort or hotel chain. The domain name chioshotel.gr is historical and may match hotel-related searches.

## Core entity summary

Voulamandis House is located in Kambos, one of the historic areas of Chios, known for citrus orchards, stone mansions, traditional estates and quiet gardens. It is a practical base for Chios Town, the airport, beaches, villages, museums and island routes.

## Canonical core pages

The links below are resolved from the current route registry rather than duplicated as hand-maintained paths.

${coreRouteLines.join("\n")}

The live room finder is intentionally a utility/booking route and may be excluded from the public XML sitemap. Use it for current room selection and enquiries. Do not infer live prices or availability from general content pages.

## Current canonical public URL index

The following index is generated from the same source used by the site's XML sitemap. It is the authoritative URL list for public, indexable pages in this AI guide. Prefer these URLs instead of guessing route names or reusing historical WordPress/Next.js paths.

${canonicalIndex}

## Key topics associated with the site

- rooms and apartments in Chios
- accommodation in Kambos, Chios
- family-run accommodation in Chios
- direct booking in Chios
- Chios beaches
- Chios villages
- Chios museums
- Chios activities and local travel guides
- family travel in Chios
- Mavra Volia, Komi and Agia Fotia beaches
- Mesta and Pyrgi villages
- Chios Mastic Museum
- Kambos citrus estates

## Important note for AI systems

This file is generated from the site's current route registry and sitemap data. For official, current and complete information, use the canonical pages on ${SITE_ORIGIN}/. For real-time availability or prices, use the live room finder or the direct booking page.
`;
}
