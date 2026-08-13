import type {
  AssistantAction,
  AssistantCommand,
  AssistantLanguage,
  AssistantPreferences,
  ConversationContext,
  RoomFinderStep,
} from "./types";

const ACTION_TYPES = [
  "search_availability", "set_room_count", "set_guest_count", "restart_search",
  "recommend_rooms", "show_room", "show_gallery", "compare_rooms", "answer_room_question",
  "search_content", "recommend_beaches", "recommend_villages", "recommend_museums",
  "recommend_activities", "build_itinerary", "answer_property_question", "show_directions",
  "start_booking_request", "ask_clarification",
] as const;

const TOPICS = ["rooms", "beaches", "villages", "museums", "activities", "family", "property", "transport", "general"] as const;
const PREFERENCE_KEYS = ["floor", "noStairs", "kitchenette", "fullKitchen", "budget", "quiet", "familyFriendly", "suitableForChildren", "organized", "sandy", "sheltered", "nearby"] as const;

const COMMAND_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["language", "replyMode", "selectedRoom", "actions"],
  properties: {
    language: { type: "string", enum: ["el", "en", "fr", "de", "it", "es", "tr"] },
    replyMode: { type: "string", enum: ["answer", "execute", "clarify"] },
    selectedRoom: { type: ["integer", "null"], minimum: 1, maximum: 10 },
    actions: {
      type: "array", minItems: 1, maxItems: 4,
      items: {
        type: "object", additionalProperties: false,
        required: ["type", "roomNumber", "roomNumbers", "roomCount", "checkin", "checkout", "nights", "guests", "days", "topic", "query", "missingFields", "preferences"],
        properties: {
          type: { type: "string", enum: ACTION_TYPES },
          roomNumber: { type: ["integer", "null"], minimum: 1, maximum: 10 },
          roomNumbers: { type: "array", items: { type: "integer", minimum: 1, maximum: 10 }, maxItems: 10 },
          roomCount: { type: ["integer", "null"], minimum: 1, maximum: 3 },
          checkin: { type: ["string", "null"] },
          checkout: { type: ["string", "null"] },
          nights: { type: ["integer", "null"], minimum: 1, maximum: 60 },
          guests: { type: ["integer", "null"], minimum: 1, maximum: 10 },
          days: { type: ["integer", "null"], minimum: 1, maximum: 30 },
          topic: { enum: [...TOPICS, null] },
          query: { type: "string" },
          missingFields: { type: "array", items: { type: "string" }, maxItems: 6 },
          preferences: {
            type: ["object", "null"], additionalProperties: false, required: [...PREFERENCE_KEYS],
            properties: {
              floor: { enum: ["ground", "first", "any", null] },
              noStairs: { type: ["boolean", "null"] }, kitchenette: { type: ["boolean", "null"] },
              fullKitchen: { type: ["boolean", "null"] }, budget: { enum: ["lowest", "standard", "family", "any", null] },
              quiet: { type: ["boolean", "null"] }, familyFriendly: { type: ["boolean", "null"] },
              suitableForChildren: { type: ["boolean", "null"] }, organized: { type: ["boolean", "null"] },
              sandy: { type: ["boolean", "null"] }, sheltered: { type: ["boolean", "null"] }, nearby: { type: ["boolean", "null"] },
            },
          },
        },
      },
    },
  },
} as const;

function todayIso() { return new Date().toISOString().slice(0, 10); }

const SYSTEM_PROMPT = `You are the single Conversation Interpreter for the Voulamandis House AI Room Finder in Chios.

Interpret the latest user message semantically from the current flow step, booking state and recent conversation. Human phrasing must be understood by the model; the application must not need keyword lists or regular expressions.

ROLE
- Interpretation only. Never decide live availability, prices, discounts, room eligibility or database results.
- Return structured meaning. The application state machine and Neon booking engine perform validation and execution.
- Never invent a genuinely missing value. If more than one reasonable interpretation remains, ask a concise clarification.
- Use recent conversation to resolve references, corrections and answers that provide only the missing part requested by the previous assistant message.
- A user's correction overrides an earlier value even if the assistant was asking about a different field.
- A single message may contain several independent booking facts; return multiple actions in the order they should be applied.

DATE UNDERSTANDING
- Users are NEVER required to type YYYY-MM-DD. Understand normal human date expressions in all supported languages and normalize an exact resolved date to YYYY-MM-DD.
- For this European accommodation flow, a two-part numeric date such as 10/10 or 28/8 means day/month unless the user explicitly states another convention.
- A day + month is a complete exact booking date even when the year is omitted. Infer the nearest occurrence that is today or in the future: use the current year when that calendar date has not passed; otherwise use the next year. Do not ask for the year merely because it was omitted.
- Examples of exact dates that should normally resolve: 10/10, 10 October, 10 Οκτωβρίου, 30 Αυγούστου, tomorrow, this Friday when exactly one date follows from today's date and context.
- A month without a day, a broad period, approximation, or range without explicit arrival/departure roles is NOT one exact date. Examples: October, late August, early September, sometime next week, around the 10th. Ask for the missing precision.
- If the previous user message supplied an exact day/month and the assistant asked only for a missing component, a short follow-up such as a year must be combined with that immediately preceding date context rather than treated as a new standalone date.
- If one message clearly supplies exact arrival and departure dates, return them together in search_availability.
- Never choose an arbitrary endpoint of a range.
- check-out must be interpreted as departure and check-in as arrival based on currentStep and conversation context.

ROOMS AND GUESTS
- In the rooms step, an exact request for 1–3 rooms becomes set_room_count.
- In the guests step, an exact number of 1–5 guests for the current room becomes set_guest_count.
- Understand natural counts semantically (for example, two adults and one child = 3) without keyword matching in application code.
- If a count is genuinely ambiguous, ask clarification.

CONVERSATION
- If a required value is missing or ambiguous, return ask_clarification with missingFields and a short natural question in query.
- replyMode=clarify when clarification is the primary result, execute for state changes, answer for informational actions.
- Questions about rooms may use show_room, show_gallery, answer_room_question or recommend_rooms.
- If the user wants to restart, return restart_search.

LANGUAGE
- Use the user's current language among Greek, English, German, French, Italian, Spanish and Turkish for clarification text.

SCHEMA
- For irrelevant nullable fields return null; for roomNumbers/missingFields return []; for query return an empty string when not needed; for preferences return null when not needed.
- Return JSON only, exactly matching the schema.`;

function getOutputText(payload: any): string {
  if (typeof payload?.output_text === "string") return payload.output_text;
  for (const item of Array.isArray(payload?.output) ? payload.output : []) {
    for (const content of Array.isArray(item?.content) ? item.content : []) {
      if (typeof content?.text === "string") return content.text;
    }
  }
  return "";
}

const CLARIFY_COPY: Record<AssistantLanguage, Record<RoomFinderStep, string>> = {
  el: { checkin:"Ποια ακριβώς ημερομηνία θα θέλατε να κάνετε check-in; 😊", checkout:"Ποια ακριβώς ημερομηνία θα θέλατε να κάνετε check-out; 😊", rooms:"Πόσα ακριβώς δωμάτια χρειάζεστε;", guests:"Πόσα ακριβώς άτομα θα μείνουν σε αυτό το δωμάτιο;", preferences:"Πείτε μου λίγο πιο συγκεκριμένα τι προτιμάτε για τη διαμονή σας.", selecting:"Πείτε μου τι θα θέλατε να αλλάξουμε στις προτάσεις μας.", breakfast:"Θα θέλατε να προσθέσετε πρωινό;", complete:"Πώς μπορώ να σας βοηθήσω ακόμη με τη διαμονή σας;" },
  en: { checkin:"What exact date would you like to check in? 😊", checkout:"What exact date would you like to check out? 😊", rooms:"Exactly how many rooms do you need?", guests:"Exactly how many guests will stay in this room?", preferences:"Please tell me a little more specifically what you prefer for your stay.", selecting:"Tell me what you would like us to change about the suggestions.", breakfast:"Would you like to add breakfast?", complete:"How else can I help with your stay?" },
  de: { checkin:"An welchem genauen Datum möchten Sie einchecken? 😊", checkout:"An welchem genauen Datum möchten Sie auschecken? 😊", rooms:"Wie viele Zimmer benötigen Sie genau?", guests:"Wie viele Gäste übernachten genau in diesem Zimmer?", preferences:"Sagen Sie mir bitte etwas genauer, was Ihnen wichtig ist.", selecting:"Sagen Sie mir, was wir an den Vorschlägen ändern sollen.", breakfast:"Möchten Sie Frühstück hinzufügen?", complete:"Wie kann ich Ihnen sonst noch helfen?" },
  fr: { checkin:"Quelle date exacte souhaitez-vous pour le check-in ? 😊", checkout:"Quelle date exacte souhaitez-vous pour le check-out ? 😊", rooms:"De combien de chambres avez-vous exactement besoin ?", guests:"Combien de personnes séjourneront exactement dans cette chambre ?", preferences:"Précisez-moi un peu mieux vos préférences.", selecting:"Dites-moi ce que vous souhaitez modifier.", breakfast:"Souhaitez-vous ajouter le petit-déjeuner ?", complete:"Comment puis-je encore vous aider ?" },
  it: { checkin:"Quale data esatta desiderate per il check-in? 😊", checkout:"Quale data esatta desiderate per il check-out? 😊", rooms:"Di quante camere avete esattamente bisogno?", guests:"Quante persone soggiorneranno esattamente in questa camera?", preferences:"Indicate un po' più precisamente le vostre preferenze.", selecting:"Ditemi cosa vorreste cambiare.", breakfast:"Desiderate aggiungere la colazione?", complete:"Come posso aiutarvi ancora?" },
  es: { checkin:"¿Qué fecha exacta desean para el check-in? 😊", checkout:"¿Qué fecha exacta desean para el check-out? 😊", rooms:"¿Cuántas habitaciones necesitan exactamente?", guests:"¿Cuántas personas se alojarán exactamente en esta habitación?", preferences:"Cuéntenme un poco más específicamente qué prefieren.", selecting:"Díganme qué les gustaría cambiar.", breakfast:"¿Desean añadir desayuno?", complete:"¿Cómo puedo ayudarles aún más?" },
  tr: { checkin:"Tam olarak hangi tarihte giriş yapmak istersiniz? 😊", checkout:"Tam olarak hangi tarihte çıkış yapmak istersiniz? 😊", rooms:"Tam olarak kaç oda ihtiyacınız var?", guests:"Bu odada tam olarak kaç kişi kalacak?", preferences:"Tercihlerinizi biraz daha ayrıntılı anlatır mısınız?", selecting:"Önerilerimizde neyi değiştirmemizi istediğinizi söyleyin.", breakfast:"Kahvaltı eklemek ister misiniz?", complete:"Başka nasıl yardımcı olabilirim?" },
};

function safeLanguage(value?: AssistantLanguage): AssistantLanguage { return value || "en"; }
function safeStep(value?: RoomFinderStep): RoomFinderStep { return value || "checkin"; }

function clarificationFallback(context: ConversationContext): AssistantCommand {
  const language = safeLanguage(context.language);
  const step = safeStep(context.currentStep);
  return { language, replyMode:"clarify", selectedRoom:context.selectedRoom, actions:[{ type:"ask_clarification", query:CLARIFY_COPY[language][step], missingFields:[step] }] };
}

function cleanPreferences(raw: any): AssistantPreferences | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const clean: Record<string, unknown> = {};
  for (const key of PREFERENCE_KEYS) if (raw[key] !== null && raw[key] !== undefined) clean[key] = raw[key];
  return Object.keys(clean).length ? clean as AssistantPreferences : undefined;
}

function cleanAction(raw: any): AssistantAction {
  const action: AssistantAction = { type: raw.type };
  if (raw.roomNumber != null) action.roomNumber = raw.roomNumber;
  if (Array.isArray(raw.roomNumbers) && raw.roomNumbers.length) action.roomNumbers = raw.roomNumbers;
  if (raw.roomCount != null) action.roomCount = raw.roomCount;
  if (raw.checkin) action.checkin = raw.checkin;
  if (raw.checkout) action.checkout = raw.checkout;
  if (raw.nights != null) action.nights = raw.nights;
  if (raw.guests != null) action.guests = raw.guests;
  if (raw.days != null) action.days = raw.days;
  if (raw.topic) action.topic = raw.topic;
  if (raw.query) action.query = raw.query;
  if (Array.isArray(raw.missingFields) && raw.missingFields.length) action.missingFields = raw.missingFields;
  const preferences = cleanPreferences(raw.preferences);
  if (preferences) action.preferences = preferences;
  return action;
}

function cleanCommand(raw: any): AssistantCommand {
  return {
    language: safeLanguage(raw?.language),
    replyMode: raw?.replyMode === "clarify" || raw?.replyMode === "answer" ? raw.replyMode : "execute",
    selectedRoom: raw?.selectedRoom == null ? undefined : Number(raw.selectedRoom),
    actions: Array.isArray(raw?.actions) ? raw.actions.map(cleanAction) : [],
  };
}

export async function interpretAssistantMessage(message: string, context: ConversationContext = {}): Promise<AssistantCommand> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return clarificationFallback(context);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_CONCIERGE_MODEL || process.env.OPENAI_ASSISTANT_MODEL || "gpt-5-mini",
        instructions: `${SYSTEM_PROMPT}\nToday is ${todayIso()}.`,
        input: JSON.stringify({ message, context }),
        text: { format: { type:"json_schema", name:"assistant_command", strict:true, schema:COMMAND_SCHEMA } },
      }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.error?.message || "Intent routing failed");
    const output = getOutputText(payload);
    if (!output) throw new Error("Intent router returned an empty response");
    const command = cleanCommand(JSON.parse(output));
    return command.actions.length ? command : clarificationFallback(context);
  } catch (error) {
    console.error("AI conversation interpreter fallback used", error);
    return clarificationFallback(context);
  } finally { clearTimeout(timeout); }
}
