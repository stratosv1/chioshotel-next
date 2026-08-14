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

const SYSTEM_PROMPT = `You are the Conversation Interpreter for the Voulamandis House AI Room Finder in Chios.

Your only job is to extract structured meaning from the user's latest message. The application state machine decides which booking field is still missing and which question comes next.

CORE RULES
- Extract every booking fact explicitly stated or uniquely implied by the latest message and recent conversation, regardless of the current UI step.
- Do not reject useful facts because the user answered a different field than the one currently requested.
- A single message can contain several facts. Return all executable actions needed to preserve them.
- Never invent a value that is genuinely absent.
- Missing booking fields are NOT an interpretation error. Do not ask clarification merely because check-in, check-out, rooms, or guests are still missing; the state machine handles that.
- Use ask_clarification only when a value the user actually attempted to provide is itself genuinely ambiguous or contradictory and cannot be resolved from context.
- If at least one booking fact is understood, return the executable fact actions. Do not add ask_clarification just for unrelated missing fields.
- Never decide availability, price, discount, room eligibility, or database results.

DATE EXTRACTION
- Users never need to type YYYY-MM-DD. Normalize any exact resolved date to YYYY-MM-DD.
- In this European accommodation flow, two-part numeric dates are day/month unless the user explicitly states another convention. Example: 10/10 = 10 October; 28/8 = 28 August.
- A day plus month is a complete exact date even without a year. Infer the nearest occurrence that is today or in the future: current year if it has not passed, otherwise next year.
- Exact forms such as 10/10, 10 October, 10 Οκτωβρίου, 28 Αυγούστου, tomorrow, or an unambiguous weekday must be returned as a date action, not clarification.
- When currentStep is checkin, a standalone exact date is check-in unless the user explicitly says otherwise.
- When currentStep is checkout, a standalone exact date is check-out unless the user explicitly says otherwise.
- If a message provides both arrival and departure dates, return both in search_availability.
- If a message provides check-in plus a number of nights, return checkin and nights in search_availability. The application calculates check-out deterministically.
- If check-in already exists in context and the user says only a number of nights, return nights in search_availability.
- Broad periods such as early October, sometime next week, or around the 10th are genuinely ambiguous and may use ask_clarification.
- Never choose an arbitrary endpoint of an ambiguous range.

ROOMS AND GUESTS
- Extract an exact requested room count from 1 to 3 with set_room_count, even if the current UI step is asking for a date.
- Extract an exact guest count with set_guest_count, even if the current UI step is asking for another field.
- Natural counts must be understood semantically; for example, two adults and one child = 3 guests.
- Phrases such as a double room / one room for two people normally imply roomCount=1 and guests=2 when that meaning is clear.
- Do not ask for a date merely because a room or guest fact was supplied first. Return the facts you understood and let the application ask the next missing field.

CONVERSATION
- Use recent conversation and current booking state to resolve short follow-ups, corrections, and references.
- A user's correction overrides an earlier value.
- If the user wants to restart, return restart_search.
- Room information questions may use show_room, show_gallery, answer_room_question, or recommend_rooms.

LANGUAGE
- Preserve the user's current supported language: Greek, English, German, French, Italian, Spanish, or Turkish.
- Clarification text, when genuinely necessary, must use that language.

SCHEMA
- For irrelevant nullable fields return null.
- For roomNumbers and missingFields return [] when not used.
- For query return an empty string when not used.
- For preferences return null when not used.
- replyMode=execute when returning booking facts; clarify only for genuine ambiguity; answer for informational actions.
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
  el: { checkin:"Πότε θα θέλατε να κάνετε check-in; 😊", checkout:"Πότε θα θέλατε να κάνετε check-out; 😊", rooms:"Πόσα δωμάτια χρειάζεστε;", guests:"Πόσα άτομα θα μείνουν σε αυτό το δωμάτιο;", preferences:"Πείτε μου λίγο πιο συγκεκριμένα τι προτιμάτε για τη διαμονή σας.", selecting:"Πείτε μου τι θα θέλατε να αλλάξουμε στις προτάσεις μας.", breakfast:"Θα θέλατε να προσθέσετε πρωινό;", complete:"Πώς μπορώ να σας βοηθήσω ακόμη με τη διαμονή σας;" },
  en: { checkin:"When would you like to check in? 😊", checkout:"When would you like to check out? 😊", rooms:"How many rooms do you need?", guests:"How many guests will stay in this room?", preferences:"Please tell me a little more specifically what you prefer for your stay.", selecting:"Tell me what you would like us to change about the suggestions.", breakfast:"Would you like to add breakfast?", complete:"How else can I help with your stay?" },
  de: { checkin:"Wann möchten Sie einchecken? 😊", checkout:"Wann möchten Sie auschecken? 😊", rooms:"Wie viele Zimmer benötigen Sie?", guests:"Wie viele Gäste übernachten in diesem Zimmer?", preferences:"Sagen Sie mir bitte etwas genauer, was Ihnen wichtig ist.", selecting:"Sagen Sie mir, was wir an den Vorschlägen ändern sollen.", breakfast:"Möchten Sie Frühstück hinzufügen?", complete:"Wie kann ich Ihnen sonst noch helfen?" },
  fr: { checkin:"Quand souhaitez-vous faire le check-in ? 😊", checkout:"Quand souhaitez-vous faire le check-out ? 😊", rooms:"De combien de chambres avez-vous besoin ?", guests:"Combien de personnes séjourneront dans cette chambre ?", preferences:"Précisez-moi un peu mieux vos préférences.", selecting:"Dites-moi ce que vous souhaitez modifier.", breakfast:"Souhaitez-vous ajouter le petit-déjeuner ?", complete:"Comment puis-je encore vous aider ?" },
  it: { checkin:"Quando desiderate fare il check-in? 😊", checkout:"Quando desiderate fare il check-out? 😊", rooms:"Di quante camere avete bisogno?", guests:"Quante persone soggiorneranno in questa camera?", preferences:"Indicate un po' più precisamente le vostre preferenze.", selecting:"Ditemi cosa vorreste cambiare.", breakfast:"Desiderate aggiungere la colazione?", complete:"Come posso aiutarvi ancora?" },
  es: { checkin:"¿Cuándo desean hacer el check-in? 😊", checkout:"¿Cuándo desean hacer el check-out? 😊", rooms:"¿Cuántas habitaciones necesitan?", guests:"¿Cuántas personas se alojarán en esta habitación?", preferences:"Cuéntenme un poco más específicamente qué prefieren.", selecting:"Díganme qué les gustaría cambiar.", breakfast:"¿Desean añadir desayuno?", complete:"¿Cómo puedo ayudarles aún más?" },
  tr: { checkin:"Ne zaman giriş yapmak istersiniz? 😊", checkout:"Ne zaman çıkış yapmak istersiniz? 😊", rooms:"Kaç odaya ihtiyacınız var?", guests:"Bu odada kaç kişi kalacak?", preferences:"Tercihlerinizi biraz daha ayrıntılı anlatır mısınız?", selecting:"Önerilerimizde neyi değiştirmemizi istediğinizi söyleyin.", breakfast:"Kahvaltı eklemek ister misiniz?", complete:"Başka nasıl yardımcı olabilirim?" },
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
