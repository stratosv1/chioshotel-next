import { NextRequest, NextResponse } from "next/server";
import { interpretAssistantMessage } from "@/lib/ai-assistant/intent";
import { searchSalesKnowledge, type KnowledgeKind } from "@/lib/ai-assistant/knowledge";
import type { AssistantAction, AssistantLanguage, ConversationContext } from "@/lib/ai-assistant/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };
type SearchState = { checkin?: string; checkout?: string; guests?: number };

function getLatestUserMessage(messages: ChatMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content.trim() || "";
}

function actionKinds(action: AssistantAction): KnowledgeKind[] | undefined {
  switch (action.type) {
    case "recommend_rooms":
    case "show_room":
    case "show_gallery":
    case "compare_rooms":
    case "answer_room_question":
      return ["room", "pricing", "booking"];
    case "recommend_beaches":
      return ["beach"];
    case "recommend_villages":
      return ["village"];
    case "recommend_museums":
      return ["museum"];
    case "recommend_activities":
      return ["activity", "family"];
    case "answer_property_question":
      return ["property", "booking", "pricing"];
    case "show_directions":
      return ["transport", "property"];
    case "build_itinerary":
      return ["beach", "village", "museum", "activity", "family"];
    case "search_content":
      return action.topic && action.topic !== "general" ? [action.topic === "rooms" ? "room" : action.topic === "beaches" ? "beach" : action.topic === "villages" ? "village" : action.topic === "museums" ? "museum" : action.topic === "activities" ? "activity" : action.topic === "family" ? "family" : action.topic === "property" ? "property" : action.topic === "transport" ? "transport" : "property"] : undefined;
    default:
      return undefined;
  }
}

function localizedFallback(language: AssistantLanguage, hasResults: boolean) {
  if (hasResults) return language === "el" ? "Βρήκα σχετικές πληροφορίες από το επίσημο περιεχόμενο του Voulamandis House:" : "I found relevant information from the official Voulamandis House content:";
  return language === "el" ? "Δεν βρήκα αρκετή επιβεβαιωμένη πληροφορία στο περιεχόμενο του site. Μπορώ να βοηθήσω με δωμάτια, διαθεσιμότητα, τιμές και προτάσεις για τη Χίο." : "I could not find enough verified information in the site content. I can help with rooms, availability, prices and Chios recommendations.";
}

async function composeGroundedAnswer(input: {
  language: AssistantLanguage;
  message: string;
  results: ReturnType<typeof searchSalesKnowledge>;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !input.results.length) {
    const intro = localizedFallback(input.language, input.results.length > 0);
    const body = input.results.map((result) => `• ${result.title}: ${result.summary}${result.url ? ` — ${result.url}` : ""}`).join("\n");
    return body ? `${intro}\n${body}` : intro;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_CONCIERGE_MODEL || "gpt-5-mini",
      instructions: `You are the sales concierge for Voulamandis House in Chios. Answer in language code ${input.language}. Use only the supplied verified knowledge. Never invent prices, availability, distances, opening hours or amenities. Be helpful, persuasive but honest. Explain why a suggestion fits the guest. Mention that live prices and availability require dates and guest count when relevant. Include useful supplied URLs naturally. Keep the answer concise and practical.`,
      input: JSON.stringify({ userMessage: input.message, verifiedKnowledge: input.results }),
    }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error?.message || "Concierge response failed");
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) return payload.output_text.trim();
  for (const item of Array.isArray(payload?.output) ? payload.output : []) {
    for (const content of Array.isArray(item?.content) ? item.content : []) {
      if (typeof content?.text === "string" && content.text.trim()) return content.text.trim();
    }
  }
  throw new Error("Concierge returned an empty answer");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages.filter((message: any) => (message?.role === "user" || message?.role === "assistant") && typeof message?.content === "string").slice(-16)
      : [];
    const latest = getLatestUserMessage(messages);
    if (!latest) return NextResponse.json({ error: "Please enter a message." }, { status: 400 });

    const search: SearchState = body?.search && typeof body.search === "object" ? body.search : {};
    const context: ConversationContext = {
      checkin: search.checkin,
      checkout: search.checkout,
      guests: search.guests,
      language: body?.language,
    };

    const command = await interpretAssistantMessage(latest, context);
    const availabilityAction = command.actions.find((action) => action.type === "search_availability");

    if (availabilityAction) {
      const mergedSearch = {
        checkin: availabilityAction.checkin || search.checkin,
        checkout: availabilityAction.checkout || search.checkout,
        guests: availabilityAction.guests || search.guests,
      };
      const legacyResponse = await fetch(new URL("/api/ai-assistant", request.nextUrl.origin), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, search: mergedSearch, language: command.language }),
        cache: "no-store",
      });
      const legacyPayload = await legacyResponse.json().catch(() => null);
      return NextResponse.json(legacyPayload || { error: "Availability search failed." }, { status: legacyResponse.status });
    }

    const resultMap = new Map<string, ReturnType<typeof searchSalesKnowledge>[number]>();
    for (const action of command.actions) {
      const query = [latest, action.query, action.roomNumber ? `room ${action.roomNumber}` : "", action.roomNumbers?.map((room) => `room ${room}`).join(" ")].filter(Boolean).join(" ");
      const results = searchSalesKnowledge({
        query,
        language: command.language,
        kinds: actionKinds(action),
        preferences: action.preferences,
        limit: action.type === "build_itinerary" ? 8 : 5,
      });
      for (const result of results) resultMap.set(result.id, result);
    }

    const results = [...resultMap.values()].slice(0, 10);
    const answer = await composeGroundedAnswer({ language: command.language, message: latest, results });

    return NextResponse.json({
      answer,
      search,
      offers: [],
      language: command.language,
      command,
      knowledge: results,
    });
  } catch (error) {
    console.error("Smart AI assistant error", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "The concierge is temporarily unavailable." }, { status: 502 });
  }
}
