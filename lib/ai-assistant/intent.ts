import type { AssistantCommand, AssistantLanguage, ConversationContext, RoomFinderStep } from "./types";

const COMMAND_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["language", "replyMode", "actions"],
  properties: {
    language: { type: "string", enum: ["el", "en", "fr", "de", "it", "es", "tr"] },
    replyMode: { type: "string", enum: ["answer", "execute", "clarify"] },
    selectedRoom: { type: "integer", minimum: 1, maximum: 10 },
    actions: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["type"],
        properties: {
          type: {
            type: "string",
            enum: [
              "search_availability", "set_room_count", "set_guest_count", "restart_search",
              "recommend_rooms", "show_room", "show_gallery", "compare_rooms",
              "answer_room_question", "search_content", "recommend_beaches",
              "recommend_villages", "recommend_museums", "recommend_activities",
              "build_itinerary", "answer_property_question", "show_directions",
              "start_booking_request", "ask_clarification"
            ]
          },
          roomNumber: { type: "integer", minimum: 1, maximum: 10 },
          roomNumbers: { type: "array", items: { type: "integer", minimum: 1, maximum: 10 }, maxItems: 10 },
          roomCount: { type: "integer", minimum: 1, maximum: 3 },
          checkin: { type: "string" },
          checkout: { type: "string" },
          nights: { type: "integer", minimum: 1, maximum: 60 },
          guests: { type: "integer", minimum: 1, maximum: 10 },
          days: { type: "integer", minimum: 1, maximum: 30 },
          topic: { type: "string", enum: ["rooms", "beaches", "villages", "museums", "activities", "family", "property", "transport", "general"] },
          query: { type: "string" },
          missingFields: { type: "array", items: { type: "string" }, maxItems: 6 },
          preferences: {
            type: "object",
            additionalProperties: false,
            properties: {
              floor: { type: "string", enum: ["ground", "first", "any"] },
              noStairs: { type: "boolean" },
              kitchenette: { type: "boolean" },
              fullKitchen: { type: "boolean" },
              budget: { type: "string", enum: ["lowest", "standard", "family", "any"] },
              quiet: { type: "boolean" },
              familyFriendly: { type: "boolean" },
              suitableForChildren: { type: "boolean" },
              organized: { type: "boolean" },
              sandy: { type: "boolean" },
              sheltered: { type: "boolean" },
              nearby: { type: "boolean" }
            }
          }
        }
      }
    }
  }
} as const;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const SYSTEM_PROMPT = `You are the single Conversation Interpreter for the Voulamandis House AI Room Finder in Chios.

Interpret the user's latest message semantically using the current flow step, current booking state and recent conversation. The application must not need keyword lists or regular expressions to understand human phrasing.

Your role is interpretation only. Never decide live availability, prices, discounts, room eligibility or database results. Those are deterministic server responsibilities.

CORE RULES
- Never invent missing booking values.
- Never choose an arbitrary value from a range, approximation or broad period.
- Return only values explicitly supplied or unambiguously implied by the latest user message. Do not copy old context values into new action fields merely because they already exist.
- Use context to understand references, corrections and short replies.
- The user's semantic intent overrides the previous question. If the assistant asks for check-out but the user clearly changes check-in, interpret the check-in change.
- If the user wants to restart, return restart_search.

DATES
- A check-in or check-out may execute only when exactly one calendar date is identified with high confidence.
- Expressions that identify a broad period, date range, approximation or vague time window require ask_clarification. Examples include meanings such as late in a month, early next month, sometime next week, around a date, or between two dates.
- Relative dates may be resolved only when they map unambiguously to exactly one calendar date using today's date and conversation context.
- Never select one endpoint of a range unless the user explicitly identifies it as arrival or departure.
- If one message clearly supplies both exact arrival and exact departure dates, search_availability may contain both.
- Dates must be YYYY-MM-DD.

ROOM COUNT AND GUESTS
- When currentStep is rooms, an exact requested number of rooms from 1 to 3 becomes set_room_count with roomCount.
- When currentStep is guests, an exact number of guests for the current room from 1 to 5 becomes set_guest_count with guests.
- If the count is vague or ambiguous, use ask_clarification instead of guessing.

ROOM FINDER CONVERSATION
- Questions about a specific room may use show_room, show_gallery or answer_room_question.
- General room preferences may use recommend_rooms with structured preferences.
- If a required value is missing or ambiguous, use ask_clarification with missingFields and a concise natural-language question in query.
- replyMode=clarify whenever ask_clarification is the primary action.
- replyMode=execute for state-changing actions.
- replyMode=answer for informational actions.

LANGUAGE
- Reply in the user's language among Greek, English, German, French, Italian, Spanish and Turkish.
- The language field must reflect the language you use for clarification text.

Return only JSON matching the schema.`;

function getOutputText(payload: any): string {
  if (typeof payload?.output_text === "string") return payload.output_text;
  const output = Array.isArray(payload?.output) ? payload.output : [];
  for (const item of output) {
    for (const content of Array.isArray(item?.content) ? item.content : []) {
      if (typeof content?.text === "string") return content.text;
    }
  }
  return "";
}

const CLARIFY_COPY: Record<AssistantLanguage, Record<RoomFinderStep, string>> = {
  el: {
    checkin: "Ποια ακριβώς ημερομηνία θα θέλατε να κάνετε check-in; 😊",
    checkout: "Ποια ακριβώς ημερομηνία θα θέλατε να κάνετε check-out; 😊",
    rooms: "Πόσα ακριβώς δωμάτια χρειάζεστε;",
    guests: "Πόσα ακριβώς άτομα θα μείνουν σε αυτό το δωμάτιο;",
    preferences: "Πείτε μου λίγο πιο συγκεκριμένα τι προτιμάτε για τη διαμονή σας.",
    selecting: "Πείτε μου τι θα θέλατε να αλλάξουμε στις προτάσεις μας.",
    breakfast: "Θα θέλατε να προσθέσετε πρωινό;",
    complete: "Πώς μπορώ να σας βοηθήσω ακόμη με τη διαμονή σας;"
  },
  en: {
    checkin: "What exact date would you like to check in? 😊",
    checkout: "What exact date would you like to check out? 😊",
    rooms: "Exactly how many rooms do you need?",
    guests: "Exactly how many guests will stay in this room?",
    preferences: "Please tell me a little more specifically what you prefer for your stay.",
    selecting: "Tell me what you would like us to change about the suggestions.",
    breakfast: "Would you like to add breakfast?",
    complete: "How else can I help with your stay?"
  },
  de: {
    checkin: "An welchem genauen Datum möchten Sie einchecken? 😊",
    checkout: "An welchem genauen Datum möchten Sie auschecken? 😊",
    rooms: "Wie viele Zimmer benötigen Sie genau?",
    guests: "Wie viele Gäste übernachten genau in diesem Zimmer?",
    preferences: "Sagen Sie mir bitte etwas genauer, was Ihnen für Ihren Aufenthalt wichtig ist.",
    selecting: "Sagen Sie mir, was wir an den Vorschlägen ändern sollen.",
    breakfast: "Möchten Sie Frühstück hinzufügen?",
    complete: "Wie kann ich Ihnen sonst noch bei Ihrem Aufenthalt helfen?"
  },
  fr: {
    checkin: "Quelle date exacte souhaitez-vous pour le check-in ? 😊",
    checkout: "Quelle date exacte souhaitez-vous pour le check-out ? 😊",
    rooms: "De combien de chambres avez-vous exactement besoin ?",
    guests: "Combien de personnes séjourneront exactement dans cette chambre ?",
    preferences: "Précisez-moi un peu mieux vos préférences pour le séjour.",
    selecting: "Dites-moi ce que vous souhaitez modifier dans nos propositions.",
    breakfast: "Souhaitez-vous ajouter le petit-déjeuner ?",
    complete: "Comment puis-je encore vous aider pour votre séjour ?"
  },
  it: {
    checkin: "Quale data esatta desiderate per il check-in? 😊",
    checkout: "Quale data esatta desiderate per il check-out? 😊",
    rooms: "Di quante camere avete esattamente bisogno?",
    guests: "Quante persone soggiorneranno esattamente in questa camera?",
    preferences: "Indicami un po' più precisamente le vostre preferenze per il soggiorno.",
    selecting: "Ditemi cosa vorreste cambiare nelle nostre proposte.",
    breakfast: "Desiderate aggiungere la colazione?",
    complete: "Come posso aiutarvi ancora per il soggiorno?"
  },
  es: {
    checkin: "¿Qué fecha exacta desean para el check-in? 😊",
    checkout: "¿Qué fecha exacta desean para el check-out? 😊",
    rooms: "¿Cuántas habitaciones necesitan exactamente?",
    guests: "¿Cuántas personas se alojarán exactamente en esta habitación?",
    preferences: "Cuéntenme un poco más específicamente qué prefieren para su estancia.",
    selecting: "Díganme qué les gustaría cambiar de nuestras propuestas.",
    breakfast: "¿Desean añadir desayuno?",
    complete: "¿Cómo puedo ayudarles aún más con su estancia?"
  },
  tr: {
    checkin: "Tam olarak hangi tarihte giriş yapmak istersiniz? 😊",
    checkout: "Tam olarak hangi tarihte çıkış yapmak istersiniz? 😊",
    rooms: "Tam olarak kaç oda ihtiyacınız var?",
    guests: "Bu odada tam olarak kaç kişi kalacak?",
    preferences: "Konaklamanız için tercihlerinizi biraz daha ayrıntılı anlatır mısınız?",
    selecting: "Önerilerimizde neyi değiştirmemizi istediğinizi söyleyin.",
    breakfast: "Kahvaltı eklemek ister misiniz?",
    complete: "Konaklamanızla ilgili başka nasıl yardımcı olabilirim?"
  }
};

function safeLanguage(value?: AssistantLanguage): AssistantLanguage {
  return value || "en";
}

function safeStep(value?: RoomFinderStep): RoomFinderStep {
  return value || "checkin";
}

function clarificationFallback(context: ConversationContext): AssistantCommand {
  const language = safeLanguage(context.language);
  const step = safeStep(context.currentStep);
  return {
    language,
    replyMode: "clarify",
    selectedRoom: context.selectedRoom,
    actions: [{
      type: "ask_clarification",
      query: CLARIFY_COPY[language][step],
      missingFields: [step],
    }],
  };
}

export async function interpretAssistantMessage(
  message: string,
  context: ConversationContext = {},
): Promise<AssistantCommand> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return clarificationFallback(context);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_CONCIERGE_MODEL || process.env.OPENAI_ASSISTANT_MODEL || "gpt-5-mini",
        instructions: `${SYSTEM_PROMPT}\nToday is ${todayIso()}.`,
        input: JSON.stringify({ message, context }),
        text: {
          format: {
            type: "json_schema",
            name: "assistant_command",
            strict: true,
            schema: COMMAND_SCHEMA,
          },
        },
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.error?.message || "Intent routing failed");
    const output = getOutputText(payload);
    if (!output) throw new Error("Intent router returned an empty response");
    return JSON.parse(output) as AssistantCommand;
  } catch (error) {
    console.error("AI conversation interpreter fallback used", error);
    return clarificationFallback(context);
  } finally {
    clearTimeout(timeout);
  }
}
