import { unstable_cache } from "next/cache";
import { neon } from "@neondatabase/serverless";
import {
  buildPropertyFaqPageFromItems,
  buildRelatedLink,
  getPropertyFaqItems,
  getPropertyFaqPage,
  type PropertyFaqCategory,
  type PropertyFaqItem,
  type PropertyFaqLinkKey,
  type PropertyFaqPageData,
  type PropertyFaqScope,
} from "@/content/property-faq";
import type { LanguageCode } from "@/lib/languages";

type KnowledgeRow = {
  id: string;
  category: PropertyFaqCategory;
  scopes: PropertyFaqScope[];
  related_link: PropertyFaqLinkKey | null;
  sort_order: number;
  question: string;
  answer: string;
  search_terms: string[];
  source_note: string;
  updated_at: string;
};

export type PublishedPropertyKnowledge = {
  id: string;
  category: PropertyFaqCategory;
  question: string;
  answer: string;
  searchTerms: string[];
  sourceNote: string;
  updatedAt: string;
};

export type PropertyKnowledgeResult = {
  id: string;
  kind: "property" | "room" | "booking" | "transport";
  category: PropertyFaqCategory;
  title: string;
  summary: string;
  question: string;
  answer: string;
  facts: string[];
  tags: string[];
  score: number;
  source: "neon_property_knowledge" | "owner_confirmed_fallback";
  attributes?: Record<string, boolean>;
  url?: string;
};

const loadRows = unstable_cache(
  async (language: LanguageCode): Promise<KnowledgeRow[]> => {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing for property knowledge");
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      select
        e.id,
        e.category,
        e.scopes,
        e.related_link,
        e.sort_order,
        t.question,
        t.answer,
        t.search_terms,
        e.source_note,
        greatest(e.updated_at, t.updated_at)::text as updated_at
      from property_knowledge.entries e
      join property_knowledge.translations t on t.entry_id = e.id
      where e.status = 'published'
        and e.owner_confirmed = true
        and t.language = ${language}
      order by e.sort_order, e.id
    `;
    return rows as unknown as KnowledgeRow[];
  },
  ["owner-confirmed-property-knowledge-v1"],
  { revalidate: 300 },
);

function fallbackRows(language: LanguageCode): KnowledgeRow[] {
  return getPropertyFaqItems(language).map((item, index) => ({
    id: item.id,
    category: item.category,
    scopes: ["all"],
    related_link: null,
    sort_order: index,
    question: item.question,
    answer: item.answer,
    search_terms: [],
    source_note: "Owner-confirmed Voulamandis House repository knowledge",
    updated_at: "2026-09-05T00:00:00.000Z",
  }));
}

async function publishedRows(language: LanguageCode) {
  if (!process.env.DATABASE_URL) {
    return { rows: fallbackRows(language), source: "owner_confirmed_fallback" as const };
  }
  try {
    const rows = await loadRows(language);
    return rows.length
      ? { rows, source: "neon_property_knowledge" as const }
      : { rows: fallbackRows(language), source: "owner_confirmed_fallback" as const };
  } catch (error) {
    console.error("Property knowledge Neon read failed; using owner-confirmed fallback", error);
    return { rows: fallbackRows(language), source: "owner_confirmed_fallback" as const };
  }
}

export async function getPublishedPropertyKnowledge(
  language: LanguageCode,
): Promise<{
  entries: PublishedPropertyKnowledge[];
  source: PropertyKnowledgeResult["source"];
}> {
  const { rows, source } = await publishedRows(language);
  return {
    source,
    entries: rows.map((row) => ({
      id: row.id,
      category: row.category,
      question: row.question,
      answer: row.answer,
      searchTerms: row.search_terms || [],
      sourceNote: row.source_note,
      updatedAt: row.updated_at,
    })),
  };
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP_WORDS = new Set([
  "the", "is", "are", "a", "an", "and", "or", "what", "which", "how", "much", "does", "do", "can", "i", "you", "price", "prices", "rate", "rates", "cost", "costs", "per",
  "το", "η", "ο", "τα", "οι", "και", "ή", "τι", "ποιο", "ποια", "πως", "πώς", "ποσο", "κοστιζει", "κοστιζουν", "κοστος", "τιμη", "τιμες", "ανα", "μπορω", "μπορώ", "εχει", "έχει",
  "le", "la", "les", "et", "ou", "quel", "quelle", "comment", "combien", "coute", "coutent", "prix", "tarif", "tarifs", "par", "est", "des",
  "der", "die", "das", "und", "oder", "wie", "was", "viel", "kostet", "kosten", "preis", "preise", "pro", "ist", "sind",
  "il", "la", "i", "gli", "e", "o", "come", "quale", "che", "quanto", "costa", "costano", "prezzo", "prezzi", "tariffa", "per",
  "el", "la", "los", "las", "y", "o", "como", "cómo", "cual", "cuál", "que", "qué", "cuanto", "cuesta", "cuestan", "precio", "precios", "tarifa", "por",
  "ve", "veya", "ne", "nasil", "nasıl", "kadar", "fiyat", "ucret", "ücret", "maliyet", "mi", "mı", "mu", "mü",
]);

const DYNAMIC_ROOM_PRICE_PATTERNS = [
  /(?:τιμ|κοστος|κοστιζ).*(?:δωματι|διαμον)|(?:δωματι|διαμον).*(?:τιμ|κοστος|κοστιζ)|ανα\s+διανυκτερευσ/iu,
  /(?:price|rate|cost).*(?:room|stay|accommodation)|(?:room|stay|accommodation).*(?:price|rate|cost)|per\s+night/iu,
  /(?:preis|kost).*(?:zimmer|aufenthalt|unterkunft)|(?:zimmer|aufenthalt|unterkunft).*(?:preis|kost)|pro\s+nacht/iu,
  /(?:prix|tarif|cout).*(?:chambre|sejour|hebergement)|(?:chambre|sejour|hebergement).*(?:prix|tarif|cout)|par\s+nuit/iu,
  /(?:prezzo|tariff|cost).*(?:camera|soggiorno|alloggio)|(?:camera|soggiorno|alloggio).*(?:prezzo|tariff|cost)|a\s+notte/iu,
  /(?:precio|tarifa|cost).*(?:habitacion|estancia|alojamiento)|(?:habitacion|estancia|alojamiento).*(?:precio|tarifa|cost)|por\s+noche/iu,
  /(?:fiyat|ucret|maliyet).*(?:oda|konaklama)|(?:oda|konaklama).*(?:fiyat|ucret|maliyet)|gecelik/iu,
];
const BREAKFAST_PRICE_QUERY = /πρωιν|breakfast|fruhstuck|petit[\s-]*dejeuner|colazione|desayuno|kahvalt/iu;
const LIVE_AVAILABILITY_NOUN = /διαθεσιμοτ|availability|verfugbarkeit|disponibilites?|disponibilita|disponibilidad|musaitlik/iu;
const ROOM_INVENTORY_CONTEXT = /δωματι|διαμον|room|stay|accommodation|zimmer|aufenthalt|chambre|sejour|camera|soggiorno|habitacion|estancia|oda|konaklama/iu;
const LIVE_ROOM_AVAILABLE = [
  /(?:διαθεσιμ).*(?:δωματι|διαμον|ημερομην)|(?:δωματι|διαμον|ημερομην).*(?:διαθεσιμ)/iu,
  /(?:available).*(?:room|stay|date)|(?:room|stay|date).*(?:available)/iu,
  /(?:verfugbar).*(?:zimmer|aufenthalt|datum)|(?:zimmer|aufenthalt|datum).*(?:verfugbar)/iu,
  /(?:disponible).*(?:chambre|sejour|date)|(?:chambre|sejour|date).*(?:disponible)/iu,
  /(?:disponibile).*(?:camera|soggiorno|data)|(?:camera|soggiorno|data).*(?:disponibile)/iu,
  /(?:disponible).*(?:habitacion|estancia|fecha)|(?:habitacion|estancia|fecha).*(?:disponible)/iu,
  /(?:musait).*(?:oda|konaklama|tarih)|(?:oda|konaklama|tarih).*(?:musait)/iu,
];

export function isDynamicRoomPriceKnowledgeQuery(query: string) {
  const normalizedQuery = normalize(query);
  return !BREAKFAST_PRICE_QUERY.test(normalizedQuery)
    && DYNAMIC_ROOM_PRICE_PATTERNS.some(pattern => pattern.test(normalizedQuery));
}

export function requiresLiveRoomInventory(query: string) {
  const normalizedQuery = normalize(query);
  if (BREAKFAST_PRICE_QUERY.test(normalizedQuery) && !ROOM_INVENTORY_CONTEXT.test(normalizedQuery)) return false;
  return isDynamicRoomPriceKnowledgeQuery(query)
    || LIVE_AVAILABILITY_NOUN.test(normalizedQuery)
    || LIVE_ROOM_AVAILABLE.some((pattern) => pattern.test(normalizedQuery));
}

function kindForCategory(category: PropertyFaqCategory): PropertyKnowledgeResult["kind"] {
  if (category === "rooms") return "room";
  if (category === "booking" || category === "arrival") return "booking";
  if (category === "location") return "transport";
  return "property";
}

export async function getPropertyFaqPageFromKnowledge(
  language: LanguageCode,
): Promise<PropertyFaqPageData> {
  const { rows, source } = await publishedRows(language);
  if (source === "owner_confirmed_fallback") return getPropertyFaqPage(language);
  if (!rows.length) return getPropertyFaqPage(language);

  const items: PropertyFaqItem[] = rows.map((row) => ({
    id: row.id,
    category: row.category,
    question: row.question,
    answer: row.answer,
    relatedLink: buildRelatedLink(language, row.related_link || undefined),
  }));

  return buildPropertyFaqPageFromItems(language, items);
}

export async function searchPropertyKnowledge(input: {
  query: string;
  language: LanguageCode;
  categories?: PropertyFaqCategory[];
  limit?: number;
}): Promise<PropertyKnowledgeResult[]> {
  if (requiresLiveRoomInventory(input.query)) return [];

  const { rows, source } = await publishedRows(input.language);
  const normalizedQuery = normalize(input.query);
  const terms = normalizedQuery
    .split(" ")
    .filter((term) => term.length > 1 && !STOP_WORDS.has(term));
  const limit = Math.max(1, Math.min(input.limit || 5, 8));

  if (!terms.length) return [];

  return rows
    .filter((row) => !input.categories?.length || input.categories.includes(row.category))
    .map((row) => {
      const question = normalize(row.question);
      const answer = normalize(row.answer);
      const keywords = (row.search_terms || []).map(normalize);
      const haystack = `${question} ${answer} ${keywords.join(" ")}`;
      const matchedTerms = terms.filter((term) => haystack.includes(term));
      const keywordMatches = matchedTerms.filter((term) => keywords.some((keyword) => keyword.includes(term))).length;
      const questionMatches = matchedTerms.filter((term) => question.includes(term)).length;
      const exactPhrase = haystack.includes(normalizedQuery) ? 8 : 0;
      const score = matchedTerms.length * 2 + keywordMatches * 5 + questionMatches * 3 + exactPhrase;
      return { row, score };
    })
    .filter(({ score }) => score >= 4)
    .sort((left, right) => right.score - left.score || left.row.sort_order - right.row.sort_order)
    .slice(0, limit)
    .map(({ row, score }) => ({
      id: row.id,
      kind: kindForCategory(row.category),
      category: row.category,
      title: row.question,
      summary: row.answer,
      question: row.question,
      answer: row.answer,
      facts: [row.answer],
      tags: row.search_terms || [],
      score,
      source,
    }));
}
