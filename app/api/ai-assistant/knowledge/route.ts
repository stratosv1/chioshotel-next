import { NextRequest, NextResponse } from "next/server";
import { searchSalesKnowledge, type KnowledgeKind } from "@/lib/ai-assistant/knowledge";
import type { AssistantLanguage, AssistantPreferences } from "@/lib/ai-assistant/types";

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
    const body = await request.json();
    const query = typeof body?.query === "string" ? body.query.trim() : "";
    if (!query) return NextResponse.json({ error: "Query is required." }, { status: 400 });

    const language = LANGUAGES.includes(body?.language) ? body.language : "en";
    const kinds = Array.isArray(body?.kinds)
      ? body.kinds.filter((kind: KnowledgeKind) => KINDS.includes(kind))
      : undefined;
    const preferences: AssistantPreferences | undefined =
      body?.preferences && typeof body.preferences === "object" ? body.preferences : undefined;

    const results = searchSalesKnowledge({
      query,
      language,
      kinds,
      preferences,
      limit: Number(body?.limit) || 5,
    });

    return NextResponse.json({ ok: true, query, language, results });
  } catch (error) {
    console.error("AI assistant knowledge search error", error);
    return NextResponse.json({ error: "Knowledge search failed." }, { status: 500 });
  }
}
