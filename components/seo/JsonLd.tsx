import { TopicBadges, type TopicBadgeContext } from "@/components/seo/TopicBadges";
import { defaultLanguage, isLanguageCode, normalizePath, type LanguageCode } from "@/lib/languages";
import { getRouteByPath } from "@/lib/url-map";

type JsonLdProps = {
  data: unknown;
};

type SchemaNode = {
  [key: string]: unknown;
};

function getSchemaNodes(data: unknown): SchemaNode[] {
  if (!data || typeof data !== "object") {
    return [];
  }

  const maybeGraph = (data as SchemaNode)["@graph"];

  if (Array.isArray(maybeGraph)) {
    return maybeGraph.filter(
      (item): item is SchemaNode => Boolean(item) && typeof item === "object",
    );
  }

  return [data as SchemaNode];
}

function getSchemaPageNode(data: unknown): SchemaNode | undefined {
  const nodes = getSchemaNodes(data);

  return (
    nodes.find((node) => {
      const type = node["@type"];
      const types = Array.isArray(type) ? type : [type];

      return types.some(
        (item) =>
          item === "WebPage" ||
          item === "AboutPage" ||
          item === "ContactPage" ||
          item === "CollectionPage" ||
          item === "SearchResultsPage",
      );
    }) ?? nodes.find((node) => typeof node.url === "string")
  );
}

function getPathFromSchemaUrl(url: unknown) {
  if (typeof url !== "string" || !url) {
    return undefined;
  }

  try {
    return normalizePath(new URL(url).pathname || "/");
  } catch {
    return normalizePath(url);
  }
}

function getTopicContext(path: string): TopicBadgeContext | undefined {
  const route = getRouteByPath(path);

  if (!route || route.action !== "KEEP") {
    return undefined;
  }

  if (route.contentType === "home") return "home";
  if (route.contentType === "rooms-category") return "rooms-category";
  if (route.contentType === "room-detail") return "room-detail";
  if (route.contentType === "contact") return "contact";
  if (route.contentType === "chios-guide-index") return "chios-guide";

  if (route.contentType === "chios-category") {
    return "chios-guide";
  }

  if (route.contentType === "chios-detail" && route.category === "beaches") {
    return "beach-detail";
  }

  if (route.contentType === "chios-detail" && route.category === "villages") {
    return "village-detail";
  }

  return undefined;
}

function getLocaleForBadges(path: string, pageNode?: SchemaNode): LanguageCode {
  const route = getRouteByPath(path);

  if (route?.language) {
    return route.language;
  }

  const language = pageNode?.inLanguage;

  return typeof language === "string" && isLanguageCode(language)
    ? language
    : defaultLanguage;
}

export function JsonLd({ data }: JsonLdProps) {
  if (!data) {
    return null;
  }

  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  const pageNode = getSchemaPageNode(data);
  const path = getPathFromSchemaUrl(pageNode?.url);
  const topicContext = path ? getTopicContext(path) : undefined;
  const locale = path ? getLocaleForBadges(path, pageNode) : defaultLanguage;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: json }}
      />
      {topicContext ? <TopicBadges locale={locale} context={topicContext} /> : null}
    </>
  );
}
