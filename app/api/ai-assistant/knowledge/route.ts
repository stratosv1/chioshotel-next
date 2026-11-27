import { NextRequest, NextResponse } from "next/server";
import { searchSalesKnowledge, type KnowledgeKind } from "@/lib/ai-assistant/knowledge";
import type { AssistantLanguage, AssistantPreferences } from "@/lib/ai-assistant/types";
import { searchPropertyKnowledge } from "@/lib/property-knowledge";
import { checkPublicRateLimit, readBoundedJson } from "@/lib/ai-assistant/public-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LANGUAGES: AssistantLanguage[] = ["el", "en", "fr", "de", "it", "es", "tr"];
const KINDS: KnowledgeKind[] = [
  "property",
  "room",
  "pricing",
  "booking",
  "beach",
  "village",
  "museum",
  "activity",
  "family",
  "transport",
];

export async function POST(request: NextRequest) {
  try {
    const rate = await checkPublicRateLimit(request, "room-finder:knowledge", { perMinute: 30, perHour: 180, failClosed: true });
    if (rate.limited) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds), "Cache-Control": "no-store" } });
    const parsed = await readBoundedJson(request, 64 * 1024);
    if (!parsed.ok) return NextResponse.json({ error: "Invalid or oversized request." }, { status: parsed.status });
    const body = parsed.value as { query?: unknown; language?: AssistantLanguage; kinds?: KnowledgeKind[]; preferences?: AssistantPreferences; limit?: unknown } | null;
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    const query = typeof body?.query === "string" ? body.query.trim() : "";
    if (!query || query.length > 2000) return NextResponse.json({ error: "Invalid query." }, { status: 400 });

    const language = body.language && LANGUAGES.includes(body.language) ? body.language : "en";
    const kinds = Array.isArray(body?.kinds)
      ? body.kinds.filter((kind: KnowledgeKind) => KINDS.includes(kind))
      : undefined;
    const preferences: AssistantPreferences | undefined =
      body?.preferences && typeof body.preferences === "object" ? body.preferences : undefined;

    const limit = Math.max(1, Math.min(Number(body?.limit) || 5, 8));
    const [propertyResults, salesResults] = await Promise.all([
      searchPropertyKnowledge({ query, language, limit }),
      Promise.resolve(searchSalesKnowledge({ query, language, kinds, preferences, limit })),
    ]);
    const filteredPropertyResults = kinds?.length
      ? propertyResults.filter((result) => kinds.includes(result.kind as KnowledgeKind))
      : propertyResults;
    const deduped = new Map<string, (typeof filteredPropertyResults)[number] | (typeof salesResults)[number]>();

    for (const result of [...filteredPropertyResults, ...salesResults]) {
      if (!deduped.has(result.id)) deduped.set(result.id, result);
    }

    const results = [...deduped.values()]
      .sort((left, right) => Number(right.score || 0) - Number(left.score || 0))
      .slice(0, limit);
    const answer = filteredPropertyResults[0]?.answer || null;

    return NextResponse.json({
      ok: true,
      query,
      language,
      answer,
      grounded: Boolean(answer),
      source: answer ? filteredPropertyResults[0].source : "existing_curated_site_knowledge",
      results,
    });
  } catch (error) {
    console.error("AI assistant knowledge search error", error);
    return NextResponse.json({ error: "Knowledge search failed." }, { status: 500 });
  }
}
