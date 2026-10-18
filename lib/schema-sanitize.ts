/**
 * Output-time cleanup for JSON-LD so it validates against schema.org.
 *
 * The schema builders across content/* attach `inLanguage` and `isPartOf`
 * to every node. schema.org only allows those properties on CreativeWork
 * (and a few other) types, so validators (Ahrefs, Schema Markup Validator)
 * report "Unexpected property" on ItemList, BreadcrumbList, Accommodation,
 * Beach, ReserveAction, etc.
 *
 * This runs once, right before serialisation, and only:
 *  - removes `inLanguage` from nodes whose @type does not accept it;
 *  - on non-CreativeWork nodes, moves `isPartOf` references to
 *    `containedInPlace` (places) or `subjectOf` (web pages).
 * Nothing else is touched. Nodes without an @type (e.g. `{ "@id": ... }`
 * references) are left as-is.
 */

type JsonValue = unknown;
type JsonObject = Record<string, JsonValue>;

// Types (CreativeWork family + others) for which schema.org defines `inLanguage`.
const IN_LANGUAGE_TYPES = new Set([
  "CreativeWork",
  "WebPage",
  "AboutPage",
  "CheckoutPage",
  "CollectionPage",
  "ContactPage",
  "FAQPage",
  "ItemPage",
  "MediaGallery",
  "ImageGallery",
  "VideoGallery",
  "ProfilePage",
  "QAPage",
  "SearchResultsPage",
  "WebSite",
  "WebPageElement",
  "MediaObject",
  "ImageObject",
  "VideoObject",
  "AudioObject",
  "Map",
  "Article",
  "BlogPosting",
  "NewsArticle",
  "Blog",
  "Course",
  "Question",
  "Answer",
  "Comment",
  "Review",
  "Guide",
  "HowTo",
  "Recipe",
  "Book",
  "Dataset",
  "Event",
  "CommunicateAction",
  "WriteAction",
  "BroadcastService",
  "LinkRole",
  "PronounceableText",
]);

// Types for which schema.org defines `isPartOf` (CreativeWork family).
const IS_PART_OF_TYPES = new Set(
  [...IN_LANGUAGE_TYPES].filter(
    (type) =>
      ![
        "Event",
        "CommunicateAction",
        "WriteAction",
        "BroadcastService",
        "LinkRole",
        "PronounceableText",
      ].includes(type),
  ),
);

function isObject(value: JsonValue): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getTypes(node: JsonObject): string[] {
  const type = node["@type"];
  if (typeof type === "string") return [type];
  if (Array.isArray(type)) return type.filter((t): t is string => typeof t === "string");
  return [];
}

function isWebPageRef(value: JsonValue): boolean {
  if (!isObject(value)) return false;
  const id = value["@id"];
  if (typeof id === "string" && /#(webpage|website)$/.test(id)) return true;
  const types = getTypes(value);
  return types.some((t) => /Page$|^WebSite$/.test(t));
}

function toArray(value: JsonValue): JsonValue[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function single(values: JsonValue[]): JsonValue {
  return values.length === 1 ? values[0] : values;
}

function sameRef(a: JsonValue, b: JsonValue): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function mergeInto(node: JsonObject, key: string, additions: JsonValue[]) {
  if (!additions.length) return;
  const existing = toArray(node[key]);
  const merged = [...existing];
  for (const item of additions) {
    if (!merged.some((m) => sameRef(m, item))) merged.push(item);
  }
  node[key] = single(merged);
}

function sanitizeNode(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return value.map(sanitizeNode);
  if (!isObject(value)) return value;

  const out: JsonObject = {};
  for (const [key, child] of Object.entries(value)) {
    out[key] = sanitizeNode(child);
  }

  const types = getTypes(out);
  if (!types.length) return out;

  if ("inLanguage" in out && !types.some((t) => IN_LANGUAGE_TYPES.has(t))) {
    delete out.inLanguage;
  }

  if ("isPartOf" in out && !types.some((t) => IS_PART_OF_TYPES.has(t))) {
    const refs = toArray(out.isPartOf);
    delete out.isPartOf;
    const pages = refs.filter(isWebPageRef);
    const places = refs.filter((ref) => !isWebPageRef(ref));
    mergeInto(out, "containedInPlace", places);
    mergeInto(out, "subjectOf", pages);
  }

  return out;
}

export function sanitizeJsonLd<T>(data: T): T {
  return sanitizeNode(data) as T;
}
