import { NextRequest, NextResponse } from "next/server";
import { interpretAssistantMessage } from "@/lib/ai-assistant/intent";
import { searchSalesKnowledge, type KnowledgeKind } from "@/lib/ai-assistant/knowledge";
import { searchExtraKnowledge } from "@/lib/ai-assistant/knowledge-extra";
import { recommendRooms } from "@/lib/ai-assistant/room-catalog";
import type { AssistantAction, AssistantCommand, AssistantLanguage, ConversationContext } from "@/lib/ai-assistant/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };
type SearchState = { checkin?: string; checkout?: string; guests?: number };
type KnowledgeResult = ReturnType<typeof searchSalesKnowledge>[number];
type RoomCard = ReturnType<typeof recommendRooms>[number];

function getLatestUserMessage(messages: ChatMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content.trim() || "";
}

function normalize(value: string) {
  return value.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
}

function shortDateToIso(message: string) {
  const match = message.trim().match(/^(\d{1,2})\s*[\/.\-]\s*(\d{1,2})(?:\s*[\/.\-]\s*(\d{2}|\d{4}))?$/);
  if (!match) return undefined;
  const day = Number(match[1]);
  const month = Number(match[2]);
  if (day < 1 || day > 31 || month < 1 || month > 12) return undefined;

  const now = new Date();
  let year = match[3] ? Number(match[3]) : now.getUTCFullYear();
  if (year < 100) year += 2000;
  let candidate = new Date(Date.UTC(year, month - 1, day, 12));
  if (candidate.getUTCDate() !== day || candidate.getUTCMonth() !== month - 1) return undefined;

  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12));
  if (!match[3] && candidate < today) candidate = new Date(Date.UTC(year + 1, month - 1, day, 12));
  return candidate.toISOString().slice(0, 10);
}

function forcedDateContinuation(input: {
  latest: string;
  messages: ChatMessage[];
  search: SearchState;
  language: AssistantLanguage;
  selectedRoom?: number;
}): AssistantCommand | undefined {
  const date = shortDateToIso(input.latest);
  if (!date) return undefined;

  const assistantContext = input.messages
    .filter((message) => message.role === "assistant")
    .slice(-4)
    .map((message) => normalize(message.content))
    .join(" ");
  const allContext = input.messages.slice(-8).map((message) => normalize(message.content)).join(" ");

  const askedArrival = /arrival|check.?in|arrivee|ankunft|arrivo|llegada|varis|αφιξ|ημερομηνια.*αφιξ/.test(assistantContext);
  const askedDeparture = /departure|check.?out|depart|abreise|partenza|salida|ayrilis|αναχωρ/.test(assistantContext);
  const isAvailabilityFlow = /availability|διαθεσιμ|verfugbar|disponibil|musait|price|rate|τιμ|preis|prix|prezzo|precio|fiyat/.test(allContext);

  if (!askedArrival && !askedDeparture && !isAvailabilityFlow && !input.search.checkin) return undefined;

  const action: AssistantAction = {
    type: "search_availability",
    checkin: askedDeparture || input.search.checkin ? input.search.checkin : date,
    checkout: askedDeparture || input.search.checkin ? date : input.search.checkout,
    guests: input.search.guests,
  };

  return {
    language: input.language,
    replyMode: "execute",
    selectedRoom: input.selectedRoom,
    actions: [action],
  };
}

function actionKinds(action: AssistantAction): KnowledgeKind[] | undefined {
  switch (action.type) {
    case "recommend_rooms":
    case "show_room":
    case "show_gallery":
    case "compare_rooms":
    case "answer_room_question": return ["room", "pricing", "booking"];
    case "recommend_beaches": return ["beach"];
    case "recommend_villages": return ["village"];
    case "recommend_museums": return ["museum"];
    case "recommend_activities": return ["activity", "family"];
    case "answer_property_question": return ["property", "booking", "pricing"];
    case "show_directions": return ["transport", "property"];
    case "build_itinerary": return ["beach", "village", "museum", "activity", "family"];
    case "search_content":
      if (!action.topic || action.topic === "general") return undefined;
      return [action.topic === "rooms" ? "room" : action.topic === "beaches" ? "beach" : action.topic === "villages" ? "village" : action.topic === "museums" ? "museum" : action.topic === "activities" ? "activity" : action.topic === "family" ? "family" : action.topic === "property" ? "property" : action.topic === "transport" ? "transport" : "property"];
    default: return undefined;
  }
}

function clarification(language: AssistantLanguage, missing: "checkin" | "checkout" | "guests") {
  const copy: Record<AssistantLanguage, Record<typeof missing, string>> = {
    el: { checkin: "Ποια ημερομηνία σκέφτεστε για άφιξη;", checkout: "Ωραία. Ποια ημερομηνία θέλετε για αναχώρηση;", guests: "Για πόσα άτομα να ελέγξω τη διαθεσιμότητα;" },
    en: { checkin: "What date are you considering for arrival?", checkout: "Great. What date would you like to check out?", guests: "How many guests should I check availability for?" },
    fr: { checkin: "Quelle date envisagez-vous pour l’arrivée ?", checkout: "Très bien. Quelle date souhaitez-vous pour le départ ?", guests: "Pour combien de personnes dois-je vérifier la disponibilité ?" },
    de: { checkin: "Welches Anreisedatum wünschen Sie?", checkout: "Gut. Welches Abreisedatum wünschen Sie?", guests: "Für wie viele Gäste soll ich die Verfügbarkeit prüfen?" },
    it: { checkin: "Quale data state considerando per l’arrivo?", checkout: "Perfetto. Quale data desiderate per la partenza?", guests: "Per quante persone devo controllare la disponibilità?" },
    es: { checkin: "¿Qué fecha está considerando para la llegada?", checkout: "Perfecto. ¿Qué fecha desea para la salida?", guests: "¿Para cuántas personas compruebo la disponibilidad?" },
    tr: { checkin: "Giriş için hangi tarihi düşünüyorsunuz?", checkout: "Tamam. Çıkış tarihi ne olsun?", guests: "Kaç kişi için müsaitlik kontrolü yapayım?" },
  };
  return copy[language][missing];
}

function localizedFallback(language: AssistantLanguage, hasResults: boolean, roomCards: number) {
  if (roomCards) {
    if (language === "el") return `Βρήκα ${roomCards} κατάλληλες επιλογές. Πατήστε σε κάθε κάρτα για φωτογραφίες και παροχές. Για πραγματική τιμή και διαθεσιμότητα χρειάζομαι ημερομηνίες και αριθμό ατόμων.`;
    if (language === "fr") return `J’ai trouvé ${roomCards} options adaptées. Ouvrez chaque carte pour voir les photos et équipements. Pour le tarif et la disponibilité en direct, indiquez les dates et le nombre de personnes.`;
    if (language === "de") return `Ich habe ${roomCards} passende Optionen gefunden. Öffnen Sie die Karten für Fotos und Ausstattung. Für Live-Preis und Verfügbarkeit brauche ich Reisedaten und Gästezahl.`;
    if (language === "it") return `Ho trovato ${roomCards} opzioni adatte. Apri le schede per foto e servizi. Per prezzo e disponibilità in tempo reale servono date e numero di ospiti.`;
    if (language === "es") return `He encontrado ${roomCards} opciones adecuadas. Abre cada tarjeta para ver fotos y servicios. Para precio y disponibilidad en directo necesito fechas y número de huéspedes.`;
    if (language === "tr") return `${roomCards} uygun seçenek buldum. Fotoğraflar ve olanaklar için kartları açın. Canlı fiyat ve müsaitlik için tarihleri ve kişi sayısını belirtin.`;
    return `I found ${roomCards} suitable options. Open each card for photos and amenities. For live price and availability, provide dates and guest count.`;
  }
  if (hasResults) {
    if (language === "el") return "Βρήκα σχετικές πληροφορίες από το επίσημο περιεχόμενο του Voulamandis House:";
    if (language === "fr") return "J’ai trouvé des informations pertinentes dans le contenu officiel de Voulamandis House :";
    if (language === "de") return "Ich habe passende Informationen aus den offiziellen Inhalten von Voulamandis House gefunden:";
    if (language === "it") return "Ho trovato informazioni pertinenti nei contenuti ufficiali di Voulamandis House:";
    if (language === "es") return "He encontrado información relevante en el contenido ufficiale di Voulamandis House:";
    if (language === "tr") return "Voulamandis House’un resmi içeriğinde ilgili bilgiler buldum:";
    return "I found relevant information from the official Voulamandis House content:";
  }
  return language === "el" ? "Δεν βρήκα αρκετή επιβεβαιωμένη πληροφορία στο site. Μπορώ να βοηθήσω με δωμάτια, διαθεσιμότητα, τιμές και προτάσεις για τη Χίο." : "I could not find enough verified information in the site content. I can help with rooms, availability, prices and Chios recommendations.";
}

function deterministicAnswer(input: { language: AssistantLanguage; results: KnowledgeResult[]; roomCards: RoomCard[] }) {
  const intro = localizedFallback(input.language, input.results.length > 0, input.roomCards.length);
  const body = input.results.slice(0, 3).map((result) => `• ${result.title}: ${result.summary}${result.url ? ` — ${result.url}` : ""}`).join("\n");
  return body ? `${intro}\n${body}` : intro;
}

async function composeAvailabilityAnswer(input: { language: AssistantLanguage; message: string; legacyPayload: any }) {
  const fallback = typeof input.legacyPayload?.answer === "string" ? input.legacyPayload.answer : "";
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !fallback) return fallback;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_CONCIERGE_MODEL || "gpt-5-mini",
        instructions: `You are the sales concierge for Voulamandis House in Chios. Answer in language code ${input.language}. The supplied availability result is the only source of truth. Rewrite it into warm, natural, concise language. Preserve every date, guest count, room, price, discount, total and availability status exactly. Never calculate, alter, omit or invent numbers. If the system is asking for missing dates, nights or guest count, ask only that one necessary question. If no rooms are available, say so clearly and suggest only one practical next step. Do not mention JSON, APIs, systems or internal processing.`,
        input: JSON.stringify({ userMessage: input.message, verifiedAvailabilityResult: input.legacyPayload }),
      }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.error?.message || "Availability composition failed");
    if (typeof payload?.output_text === "string" && payload.output_text.trim()) return payload.output_text.trim();
    for (const item of Array.isArray(payload?.output) ? payload.output : []) {
      for (const content of Array.isArray(item?.content) ? item.content : []) {
        if (typeof content?.text === "string" && content.text.trim()) return content.text.trim();
      }
    }
    return fallback;
  } catch (error) {
    console.error("Availability answer fallback used", error);
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}

async function composeGroundedAnswer(input: { language: AssistantLanguage; message: string; results: KnowledgeResult[]; roomCards: RoomCard[] }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || (!input.results.length && !input.roomCards.length)) return deterministicAnswer(input);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_CONCIERGE_MODEL || "gpt-5-mini",
        instructions: `You are the expert sales concierge for Voulamandis House in Chios. Answer in language code ${input.language}. Use only supplied verified knowledge and room card data. Never invent prices, availability, distances, opening hours, amenities or policies. Be warm, persuasive and practical without pressure. Explain briefly why the shown room cards or Chios suggestions fit the guest. Room cards without live totals are previews only; say that dates and guest count are needed for a live quote. End with exactly one useful next step. Prefer two or three strong recommendations over a generic list.`,
        input: JSON.stringify({ userMessage: input.message, verifiedKnowledge: input.results, roomCards: input.roomCards }),
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
  } catch (error) {
    console.error("Grounded answer fallback used", error);
    return deterministicAnswer(input);
  } finally {
    clearTimeout(timeout);
  }
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
    const language: AssistantLanguage = ["el", "en", "fr", "de", "it", "es", "tr"].includes(body?.language) ? body.language : "en";
    const selectedRoom = typeof body?.selectedRoom === "number" ? body.selectedRoom : undefined;
    const context: ConversationContext = { ...search, language, selectedRoom, recentMessages: messages.slice(-10) };

    const forcedCommand = forcedDateContinuation({ latest, messages, search, language, selectedRoom });
    const command = forcedCommand || await interpretAssistantMessage(latest, context);
    const availabilityAction = command.actions.find((action) => action.type === "search_availability");

    if (availabilityAction) {
      const mergedSearch: SearchState = {
        checkin: availabilityAction.checkin || search.checkin,
        checkout: availabilityAction.checkout || search.checkout,
        guests: availabilityAction.guests || search.guests,
      };

      const missing = !mergedSearch.checkin ? "checkin" : !mergedSearch.checkout ? "checkout" : !mergedSearch.guests ? "guests" : null;
      if (missing) {
        return NextResponse.json({
          answer: clarification(command.language, missing),
          search: mergedSearch,
          offers: [],
          knowledge: [],
          language: command.language,
          selectedRoom: command.selectedRoom,
          command,
        });
      }

      const legacyResponse = await fetch(new URL("/api/ai-assistant", request.nextUrl.origin), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, search: mergedSearch, language: command.language }),
        cache: "no-store",
      });
      const legacyPayload = await legacyResponse.json().catch(() => null);
      if (!legacyResponse.ok || !legacyPayload) {
        return NextResponse.json(legacyPayload || { error: "Availability search failed." }, { status: legacyResponse.status });
      }
      const answer = await composeAvailabilityAnswer({ language: command.language, message: latest, legacyPayload });
      return NextResponse.json({
        ...legacyPayload,
        search: mergedSearch,
        answer: answer || legacyPayload.answer,
        command,
        selectedRoom: command.selectedRoom,
        sourceAnswer: legacyPayload.answer,
      }, { status: legacyResponse.status });
    }

    const roomMap = new Map<string, RoomCard>();
    for (const action of command.actions.filter((item) => ["recommend_rooms", "show_room", "show_gallery", "compare_rooms"].includes(item.type))) {
      const effectiveAction: AssistantAction = { ...action, guests: action.guests || search.guests };
      for (const room of recommendRooms(effectiveAction, command.language)) roomMap.set(`${room.roomId}:${room.unitId}`, room);
    }
    const roomCards = [...roomMap.values()].slice(0, 6);

    const resultMap = new Map<string, KnowledgeResult>();
    for (const action of command.actions.filter((item) => item.type !== "ask_clarification")) {
      const query = [latest, action.query, action.roomNumber ? `room ${action.roomNumber}` : "", action.roomNumbers?.map((room) => `room ${room}`).join(" ")].filter(Boolean).join(" ");
      const kinds = actionKinds(action);
      if (action.type === "search_content" && (!action.topic || action.topic === "general") && /^\d{1,2}\s*[\/.\-]\s*\d{1,2}/.test(latest)) continue;
      const limit = action.type === "build_itinerary" ? 8 : 5;
      const baseResults = searchSalesKnowledge({ query, language: command.language, kinds, preferences: action.preferences, limit });
      const extraResults = searchExtraKnowledge({ query, language: command.language, kinds, preferences: action.preferences, limit });
      for (const result of [...baseResults, ...extraResults]) {
        const existing = resultMap.get(result.id);
        if (!existing || result.score > existing.score) resultMap.set(result.id, result);
      }
    }

    const results = [...resultMap.values()].sort((a, b) => b.score - a.score).slice(0, 10);
    const answer = await composeGroundedAnswer({ language: command.language, message: latest, results, roomCards });

    return NextResponse.json({ answer, search, offers: roomCards, language: command.language, selectedRoom: command.selectedRoom, command, knowledge: results });
  } catch (error) {
    console.error("Smart AI assistant error", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "The concierge is temporarily unavailable." }, { status: 502 });
  }
}
