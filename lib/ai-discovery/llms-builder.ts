import type { LanguageCode } from "@/lib/languages";
import {
  AI_DISCOVERY_COPY,
  AI_DISCOVERY_ITEM_IDS,
  AI_DISCOVERY_LANGUAGES,
  type AiDiscoveryItemId,
} from "@/lib/ai-discovery/config";
import {
  localizedLlmsUrl,
  resolveDiscoveryUrl,
  SITE_ORIGIN,
} from "@/lib/ai-discovery/route-resolver";

const SECTION_ORDER = ["accommodation", "booking", "property"] as const;

const FULL_INDEX_HEADINGS: Record<LanguageCode, string> = {
  en: "Complete AI-readable site index",
  el: "Πλήρες ευρετήριο του site για AI",
  fr: "Index complet du site pour les agents AI",
  de: "Vollständiger AI-lesbarer Website-Index",
  it: "Indice completo del sito per agenti AI",
  es: "Índice completo del sitio para agentes AI",
  tr: "AI ajanları için tam site dizini",
};

type DiscoverySection = (typeof SECTION_ORDER)[number];

function markdownLink(label: string, url: string, description: string) {
  return `- [${label}](${url}): ${description}`;
}

function sectionLinks(language: LanguageCode, section: DiscoverySection) {
  const copy = AI_DISCOVERY_COPY[language];

  return AI_DISCOVERY_ITEM_IDS
    .filter((itemId) => copy.links[itemId].section === section)
    .map((itemId) => {
      const item = copy.links[itemId];
      return markdownLink(
        item.label,
        resolveDiscoveryUrl(itemId, language),
        item.description,
      );
    })
    .join("\n");
}

function buildLanguageGuide(language: LanguageCode, includeLocalizedIndex: boolean) {
  const copy = AI_DISCOVERY_COPY[language];
  const sections = SECTION_ORDER.map((section) =>
    [
      `## ${copy.sections[section]}`,
      "",
      sectionLinks(language, section),
    ].join("\n"),
  );

  const localizedIndex = includeLocalizedIndex
    ? [
        "## Localized AI guides",
        "",
        ...AI_DISCOVERY_LANGUAGES.filter((candidate) => candidate !== "en").map(
          (candidate) =>
            markdownLink(
              AI_DISCOVERY_COPY[candidate].title,
              localizedLlmsUrl(candidate),
              AI_DISCOVERY_COPY[candidate].summary,
            ),
        ),
      ].join("\n")
    : "";

  return [
    `# ${copy.title}`,
    "",
    `> ${copy.summary}`,
    "",
    copy.info,
    "",
    copy.classification,
    "",
    ...sections,
    localizedIndex,
    `## ${FULL_INDEX_HEADINGS[language]}`,
    "",
    markdownLink(
      copy.fullGuideLabel,
      `${SITE_ORIGIN}/llms-full.txt`,
      copy.fullGuideDescription,
    ),
  ]
    .filter(Boolean)
    .join("\n\n")
    .concat("\n");
}

export function buildRootLlmsGuide() {
  return buildLanguageGuide("en", true);
}

export function buildLocalizedLlmsGuide(language: Exclude<LanguageCode, "en">) {
  return buildLanguageGuide(language, false);
}

export function getDiscoveryItemIds(): readonly AiDiscoveryItemId[] {
  return AI_DISCOVERY_ITEM_IDS;
}
