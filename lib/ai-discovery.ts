import sitemap from "@/app/sitemap";
import { propertyFaqPaths } from "@/content/property-faq";
import { ACCOMMODATION_LANDING_PATHS } from "@/lib/accommodation-landing-i18n";
import { CHIOS_HOTELS_GUIDE_PATHS } from "@/lib/chios-hotels-guide-i18n";
import { languages, type LanguageCode } from "@/lib/languages";
import { absoluteUrl, siteUrl } from "@/lib/seo";
import { businessData } from "@/lib/structured-data";
import { routeMap } from "@/lib/url-map";

type CuratedLink = {
  label: string;
  path: string;
  description: string;
};

type CanonicalEntry = ReturnType<typeof sitemap>[number];

const SITE_NAME = "Voulamandis House";
const FULL_INDEX_URL = absoluteUrl("/llms-full.txt");
const SITEMAP_URL = absoluteUrl("/sitemap.xml");
const ROBOTS_URL = absoluteUrl("/robots.txt");

const englishPrimaryLinks: readonly CuratedLink[] = [
  {
    label: "Homepage",
    path: "/",
    description:
      "Official overview of Voulamandis House, a family-run rooms and apartments property in Kambos, Chios.",
  },
  {
    label: "Accommodation in Chios",
    path: ACCOMMODATION_LANDING_PATHS.en,
    description:
      "Primary accommodation-intent landing page explaining where to stay in Chios and the role of Kambos as a base.",
  },
  {
    label: "Chios hotels guide",
    path: CHIOS_HOTELS_GUIDE_PATHS.en,
    description:
      "Guide for hotel-related search intent in Chios; Voulamandis House itself should be described as rooms and apartments, not a large hotel or resort.",
  },
  {
    label: "Rooms and apartments",
    path: routePath("en", "rooms-index"),
    description:
      "Canonical room-category hub for double rooms and family apartments.",
  },
  {
    label: "Economy double rooms",
    path: routePath("en", "economy-double"),
    description: "Canonical details for the Economy Double room category.",
  },
  {
    label: "Standard double rooms",
    path: routePath("en", "standard-double"),
    description: "Canonical details for the Standard Double room category.",
  },
  {
    label: "Family apartments",
    path: routePath("en", "family-apartment"),
    description: "Canonical details for the family apartment category.",
  },
  {
    label: "Rates and direct booking",
    path: routePath("en", "booking"),
    description:
      "Primary canonical page for current rates and direct-booking information. Do not infer live availability or final prices from llms.txt.",
  },
  {
    label: "Frequently asked questions",
    path: propertyFaqPaths.en,
    description:
      "First-party answers about the property, rooms, booking, location and arrival topics.",
  },
  {
    label: "Contact Voulamandis House",
    path: routePath("en", "contact"),
    description: "Official contact page for direct questions and booking support.",
  },
] as const;

const englishDestinationLinks: readonly CuratedLink[] = [
  {
    label: "Chios island guide",
    path: "/chios-island/",
    description: "First-party destination guide for planning a stay on Chios.",
  },
  {
    label: "Kambos Chios",
    path: "/chios/kampos-chios/",
    description:
      "Guide to the historic Kambos area where Voulamandis House is located, including its citrus-estate character.",
  },
  {
    label: "Chios beaches",
    path: "/chios/chios-beaches/",
    description: "Hub for Chios beach guides and beach-planning content.",
  },
  {
    label: "Chios villages",
    path: "/chios/chios-villages/",
    description: "Hub for Chios village guides, including medieval and mastic villages.",
  },
  {
    label: "Chios museums",
    path: "/chios/chios-museums/",
    description: "Hub for Chios museums and cultural attractions.",
  },
  {
    label: "Chios activities",
    path: "/chios-activities/",
    description: "Hub for activities, experiences and practical ideas for visitors to Chios.",
  },
] as const;

export function buildLlmsTxt(): string {
  const canonicalUrls = canonicalUrlSet();

  validateCuratedLinks(englishPrimaryLinks, canonicalUrls);
  validateCuratedLinks(englishDestinationLinks, canonicalUrls);

  const sections: string[] = [
    `# ${SITE_NAME}`,
    "",
    "> Voulamandis House is a family-run accommodation property in Kambos, Chios, Greece, offering rooms and family apartments in a historic citrus-estate setting. The domain chioshotel.gr is historical; the property should not be described as a large hotel, hotel chain or resort.",
    "",
    `Official website: ${siteUrl}/`,
    `Business name: ${businessData.name}`,
    `Address: ${businessData.address.streetAddress}, ${businessData.address.postalCode} ${businessData.address.addressLocality}, ${businessData.address.addressRegion}, Greece`,
    `Telephone: ${businessData.telephone}`,
    `Email: ${businessData.email}`,
    `Supported website languages: ${languages.map((language) => language.code).join(", ")}`,
    "",
    "Use the canonical pages below as first-party sources. For live availability, current prices or reservation-specific details, use the rates/direct-booking page or contact Voulamandis House; do not infer changing commercial information from this file.",
    "",
    "## Primary property and booking sources",
    "",
    ...englishPrimaryLinks.map(renderCuratedLink),
    "",
    "## Chios destination knowledge",
    "",
    ...englishDestinationLinks.map(renderCuratedLink),
  ];

  for (const language of languages) {
    if (language.code === "en") {
      continue;
    }

    const localizedLinks = localizedCoreLinks(language.code);
    validateCuratedLinks(localizedLinks, canonicalUrls);

    sections.push(
      "",
      `## ${language.label} (${language.code})`,
      "",
      ...localizedLinks.map(renderCuratedLink),
    );
  }

  sections.push(
    "",
    "## Machine-readable discovery",
    "",
    `- [Full canonical AI index](${FULL_INDEX_URL}): Extended AI-readable index generated from the same canonical URL source as the XML sitemap.`,
    `- [XML sitemap](${SITEMAP_URL}): Canonical indexable page inventory used as the source of truth for the full AI index.`,
    `- [robots.txt](${ROBOTS_URL}): Crawl directives, including explicit access for major AI search and retrieval user agents.`,
    "",
    "## Optional",
    "",
    renderCuratedLink({
      label: "Deals and offers",
      path: routePath("en", "deals"),
      description:
        "Current promotional information; treat offer terms as time-sensitive and verify on the canonical page.",
    }),
    "",
  );

  return `${sections.join("\n")}\n`;
}

export function buildLlmsFullTxt(): string {
  const entries = uniqueCanonicalEntries();
  const groups = groupCanonicalEntries(entries);

  const lines: string[] = [
    `# ${SITE_NAME} full canonical AI index`,
    "",
    "> This extended file provides entity context plus every canonical URL currently exposed by the website XML sitemap. Use /llms.txt for the curated high-signal index and this file when complete canonical coverage is needed.",
    "",
    `Official website: ${siteUrl}/`,
    `Business name: ${businessData.name}`,
    "Primary offering: rooms and family apartments in Kambos, Chios, Greece.",
    "Classification: family-run guest accommodation / lodging; do not describe Voulamandis House as a large hotel chain or resort.",
    `Address: ${businessData.address.streetAddress}, ${businessData.address.postalCode} ${businessData.address.addressLocality}, ${businessData.address.addressRegion}, Greece`,
    `Telephone: ${businessData.telephone}`,
    `Email: ${businessData.email}`,
    `Officially supported website languages: ${languages.map((language) => language.code).join(", ")}`,
    `Canonical URL count: ${entries.length}`,
    "",
    "For current availability, prices and reservation-specific information, use the canonical booking/rates or contact pages. The page URLs below are generated from the sitemap source of truth so redirects and intentionally excluded noindex application routes are not manually duplicated here.",
  ];

  for (const group of groups) {
    if (group.entries.length === 0) {
      continue;
    }

    lines.push("", `## ${group.label} (${group.entries.length})`, "");

    for (const entry of group.entries) {
      lines.push(renderCanonicalEntry(entry));
    }
  }

  lines.push(
    "",
    "## Discovery files",
    "",
    `- [Curated llms.txt](${absoluteUrl("/llms.txt")}): High-signal first-party sources and entity guidance.`,
    `- [XML sitemap](${SITEMAP_URL}): Canonical page inventory.`,
    `- [Image sitemap](${absoluteUrl("/image-sitemap.xml")}): Canonical image discovery feed.`,
    `- [robots.txt](${ROBOTS_URL}): Crawler access policy.`,
    "",
  );

  return `${lines.join("\n")}\n`;
}

function localizedCoreLinks(language: LanguageCode): CuratedLink[] {
  return [
    {
      label: `${language.toUpperCase()} homepage`,
      path: routePath(language, "home"),
      description: "Localized homepage and primary brand entry point.",
    },
    {
      label: `${language.toUpperCase()} accommodation guide`,
      path: ACCOMMODATION_LANDING_PATHS[language],
      description: "Localized accommodation-intent landing page.",
    },
    {
      label: `${language.toUpperCase()} Chios hotels guide`,
      path: CHIOS_HOTELS_GUIDE_PATHS[language],
      description: "Localized guide for hotel-related search intent in Chios.",
    },
    {
      label: `${language.toUpperCase()} rooms and apartments`,
      path: routePath(language, "rooms-index"),
      description: "Localized canonical room-category hub.",
    },
    {
      label: `${language.toUpperCase()} rates and direct booking`,
      path: routePath(language, "booking"),
      description: "Localized canonical rates/direct-booking page.",
    },
    {
      label: `${language.toUpperCase()} frequently asked questions`,
      path: propertyFaqPaths[language],
      description: "Localized first-party FAQ about the property and stay.",
    },
  ];
}

function routePath(language: LanguageCode, itemId: string): string {
  const route = routeMap.find(
    (record) =>
      record.language === language &&
      record.itemId === itemId &&
      record.action === "KEEP",
  );

  if (!route) {
    throw new Error(
      `[ai-discovery] Missing KEEP route for itemId=${itemId} language=${language}`,
    );
  }

  return route.path;
}

function canonicalUrlSet(): Set<string> {
  return new Set(uniqueCanonicalEntries().map((entry) => entry.url));
}

function uniqueCanonicalEntries(): CanonicalEntry[] {
  const byUrl = new Map<string, CanonicalEntry>();

  for (const entry of sitemap()) {
    if (!entry.url.startsWith(`${siteUrl}/`) && entry.url !== siteUrl) {
      continue;
    }

    byUrl.set(entry.url, entry);
  }

  return [...byUrl.values()].sort((a, b) =>
    new URL(a.url).pathname.localeCompare(new URL(b.url).pathname),
  );
}

function validateCuratedLinks(
  links: readonly CuratedLink[],
  canonicalUrls: Set<string>,
): void {
  for (const link of links) {
    const url = absoluteUrl(link.path);

    if (!canonicalUrls.has(url)) {
      throw new Error(
        `[ai-discovery] Curated llms.txt URL is not canonical in sitemap: ${url}`,
      );
    }
  }
}

function renderCuratedLink(link: CuratedLink): string {
  return `- [${link.label}](${absoluteUrl(link.path)}): ${link.description}`;
}

function groupCanonicalEntries(entries: CanonicalEntry[]): Array<{
  label: string;
  entries: CanonicalEntry[];
}> {
  const languageGroups = languages.map((language) => ({
    code: language.code,
    label: `${language.label} canonical pages`,
    entries: [] as CanonicalEntry[],
  }));
  const other: CanonicalEntry[] = [];

  for (const entry of entries) {
    const language = languageForCanonicalUrl(entry.url);

    if (!language) {
      other.push(entry);
      continue;
    }

    languageGroups.find((group) => group.code === language)?.entries.push(entry);
  }

  return [
    ...languageGroups.map(({ label, entries: groupEntries }) => ({
      label,
      entries: groupEntries,
    })),
    {
      label: "Other canonical pages present in the sitemap",
      entries: other,
    },
  ];
}

function languageForCanonicalUrl(url: string): LanguageCode | undefined {
  const pathname = new URL(url).pathname;

  for (const language of languages) {
    if (language.code === "en") {
      continue;
    }

    const prefix = `${language.pathPrefix}/`;
    if (pathname === prefix || pathname.startsWith(prefix)) {
      return language.code;
    }
  }

  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (firstSegment === "pl") {
    return undefined;
  }

  return "en";
}

function renderCanonicalEntry(entry: CanonicalEntry): string {
  const pathname = new URL(entry.url).pathname;
  const priority = entry.priority === undefined ? "" : `; sitemap priority ${entry.priority}`;
  const changeFrequency = entry.changeFrequency
    ? `; change frequency ${entry.changeFrequency}`
    : "";

  return `- [${pathname}](${entry.url}): Canonical website page${priority}${changeFrequency}.`;
}
