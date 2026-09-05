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
        t.search_terms
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
  "the", "is", "are", "a", "an", "and", "or", "what", "which", "how", "does", "do", "can", "i", "you",
  "το", "η", "ο", "τα", "οι", "και", "ή", "τι", "ποιο", "ποια", "πως", "πώς", "μπορω", "μπορώ", "εχει", "έχει",
  "le", "la", "les", "et", "ou", "quel", "quelle", "comment", "est", "des",
  "der", "die", "das", "und", "oder", "wie", "was", "ist", "sind",
  "il", "la", "i", "gli", "e", "o", "come", "quale", "che",
  "el", "la", "los", "las", "y", "o", "como", "cómo", "cual", "cuál", "que", "qué",
  "ve", "veya", "ne", "nasil", "nasıl", "mi", "mı", "mu", "mü",
]);

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
