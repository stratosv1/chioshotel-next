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
      type: "array", minItems: 1, maxItems: 6,
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

const SYSTEM_PROMPT = `You are the single semantic interpreter for the Voulamandis House AI Room Finder in Chios.

EVERY customer message reaches you. Your job is to understand what the customer meant and translate it into the structured actions used by the booking state machine. The state machine, not you, decides which ordinary missing booking field should be asked next.

CORE CONTRACT
- Read the latest message together with the supplied booking context and recent conversation.
- Extract EVERY booking fact contained in the latest message, even when it answers a different question than the current UI step.
- A single sentence may contain check-in, check-out, nights, room count, guest count and room preferences. Preserve all of them in the same response.
- Corrections in the latest message override earlier context.
- Never discard a useful fact just because another fact is missing.
- Never invent a value that the customer did not state or uniquely imply.
- Never decide availability, price, discount or actual room inventory.

IMPORTANT DISTINCTION: MISSING VS AMBIGUOUS
- A value that the customer did NOT provide is simply missing. Do NOT use ask_clarification for ordinary missing fields. Return the facts you understood; the application will ask the next missing field.
- Use ask_clarification ONLY when the customer attempted to provide a value but that value is genuinely ambiguous, contradictory, or impossible to resolve from context.
- If some facts are clear and another attempted fact is ambiguous, return BOTH the clear executable fact actions AND one ask_clarification action for the ambiguous fact.
- A clarification query must be specific. Name exactly what is unclear and ask one concrete question.
- When useful, include one short example of a valid reply so the customer's second input is easy to give correctly.
- Never use vague clarification text such as “I did not understand”, “please be more specific”, or “I am not sure I understood the date” without identifying the exact ambiguity.

DATE UNDERSTANDING
- Normalize every exact resolved date to YYYY-MM-DD for the system.
- This is a European accommodation flow: a two-part numeric date means day/month unless the customer explicitly says otherwise. 10/10 means 10 October; 28/8 means 28 August.
- A day plus month is already an exact date. If the year is omitted, choose the nearest occurrence that is today or in the future.
- Exact expressions such as 10/10, 10 October, 10 Οκτωβρίου, 28 Αυγούστου, tomorrow, and an unambiguous weekday are NOT ambiguous.
- When currentStep=checkin, a standalone exact date is check-in unless the customer explicitly labels it as departure/check-out.
- When currentStep=checkout, a standalone exact date is check-out unless explicitly labelled otherwise.
- If the customer gives both arrival and departure in one message, return one search_availability action containing BOTH checkin and checkout.
- If the customer gives check-in plus nights, return checkin and nights. If check-in already exists in context and the customer only says nights, return nights.
- Phrases such as “early October”, “around the 10th”, “sometime next week” are ambiguous. Ask specifically for the exact date, for example: “Ποια ακριβώς ημερομηνία εννοείτε για check-in; π.χ. 3/10.”
- If two dates are contradictory (for example departure before arrival), still extract the dates exactly as stated; the state machine validates their relationship.

ROOMS, GUESTS AND PREFERENCES
- Extract exact room count 1-3 with set_room_count.
- Extract exact guest count with set_guest_count, including natural language such as “two adults and one child” = 3 guests.
- “A double room for two people” normally implies roomCount=1 and guests=2 when clear.
- Understand compact/typo-like human input semantically, such as “2ατομα”, “2 persons”, “2 kişi”.
- Room preferences belong in recommend_rooms.preferences. Examples include first floor, ground floor, no stairs, kitchenette/kitchen, economical, family-friendly, quiet, balcony-related intent when representable by the schema.
- “στον όροφο” in this property context means first floor. “ισόγειο” means ground floor.
- “με κουζίνα” means kitchenette=true unless the customer clearly asks for a full kitchen.

CONVERSATION BEHAVIOUR
- Use context to resolve short follow-ups such as “2 βράδια”, “12/10”, “3 άτομα”, or “στον όροφο”.
- Never repeat a question for a value already present in context unless the customer is correcting it or it is genuinely ambiguous.
- If the customer wants to restart, return restart_search.
- Preserve the UI-selected supported language from context. Clarification text must be in that language.

REFERENCE EXAMPLES
1) Greek full message:
Customer: “Θέλω ένα δωμάτιο για 2ατομα στον όροφο, άφιξη 10/10 αναχώρηση 12/10”
Meaning: checkin=10 October, checkout=12 October, roomCount=1, guests=2, floor=first. No clarification.

2) Partial but clear:
Customer: “Θέλω ένα δωμάτιο για 2 άτομα με κουζίνα” while no date is known.
Meaning: roomCount=1, guests=2, kitchenette=true. Do NOT ask clarification for the missing check-in. The state machine asks it next.

3) Exact short follow-up:
Context has check-in and customer says “2 βράδια 3 άτομα”.
Meaning: nights=2 and guests=3 in the same response.

4) Genuine ambiguity:
Customer: “Αρχές Οκτωβρίου”.
Return ask_clarification for checkin with a query like “Ποια ακριβώς ημερομηνία του Οκτωβρίου θέλετε για check-in; π.χ. 3/10.”

SCHEMA RULES
- For irrelevant nullable fields return null.
- For roomNumbers and missingFields return [] when unused.
- For query return an empty string when unused.
- For preferences return null when unused.
- replyMode=execute when returning booking facts; clarify when genuine ambiguity requires a customer answer; answer for informational actions.
- Return JSON only and exactly match the schema.`;

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
  el: { checkin:"Ποια ακριβώς ημερομηνία θέλετε για check-in; π.χ. 10/10.", checkout:"Ποια ακριβώς ημερομηνία θέλετε για check-out; π.χ. 12/10.", rooms:"Πόσα ακριβώς δωμάτια χρειάζεστε; π.χ. 1 δωμάτιο.", guests:"Πόσα ακριβώς άτομα θα μείνουν; π.χ. 2 άτομα.", preferences:"Ποια ακριβώς προτίμηση θέλετε να κρατήσω για το δωμάτιο;", selecting:"Ποιο ακριβώς στοιχείο θέλετε να αλλάξουμε στις προτάσεις;", breakfast:"Θέλετε να προσθέσετε πρωινό; Απαντήστε ναι ή όχι.", complete:"Τι ακριβώς θα θέλατε να αλλάξουμε στη διαμονή σας;" },
  en: { checkin:"What exact date would you like to check in? For example, 10/10.", checkout:"What exact date would you like to check out? For example, 12/10.", rooms:"How many rooms exactly do you need? For example, 1 room.", guests:"How many guests exactly will stay? For example, 2 guests.", preferences:"Which exact room preference would you like me to keep?", selecting:"What exactly would you like to change in the suggestions?", breakfast:"Would you like to add breakfast? Please answer yes or no.", complete:"What exactly would you like to change about your stay?" },
  de: { checkin:"Welches genaue Datum wünschen Sie für den Check-in? Zum Beispiel 10/10.", checkout:"Welches genaue Datum wünschen Sie für den Check-out? Zum Beispiel 12/10.", rooms:"Wie viele Zimmer benötigen Sie genau? Zum Beispiel 1 Zimmer.", guests:"Wie viele Gäste übernachten genau? Zum Beispiel 2 Personen.", preferences:"Welche genaue Zimmerpräferenz soll ich berücksichtigen?", selecting:"Was genau möchten Sie an den Vorschlägen ändern?", breakfast:"Möchten Sie Frühstück hinzufügen? Bitte antworten Sie mit Ja oder Nein.", complete:"Was genau möchten Sie an Ihrem Aufenthalt ändern?" },
  fr: { checkin:"Quelle date exacte souhaitez-vous pour le check-in ? Par exemple 10/10.", checkout:"Quelle date exacte souhaitez-vous pour le check-out ? Par exemple 12/10.", rooms:"De combien de chambres avez-vous exactement besoin ? Par exemple 1 chambre.", guests:"Combien de personnes séjourneront exactement ? Par exemple 2 personnes.", preferences:"Quelle préférence précise souhaitez-vous conserver pour la chambre ?", selecting:"Que souhaitez-vous exactement modifier dans les propositions ?", breakfast:"Souhaitez-vous ajouter le petit-déjeuner ? Répondez oui ou non.", complete:"Que souhaitez-vous exactement modifier pour votre séjour ?" },
  it: { checkin:"Quale data esatta desiderate per il check-in? Per esempio 10/10.", checkout:"Quale data esatta desiderate per il check-out? Per esempio 12/10.", rooms:"Di quante camere avete esattamente bisogno? Per esempio 1 camera.", guests:"Quante persone soggiorneranno esattamente? Per esempio 2 persone.", preferences:"Quale preferenza precisa desiderate per la camera?", selecting:"Che cosa desiderate modificare esattamente nelle proposte?", breakfast:"Desiderate aggiungere la colazione? Rispondete sì o no.", complete:"Che cosa desiderate modificare esattamente nel soggiorno?" },
  es: { checkin:"¿Qué fecha exacta desean para el check-in? Por ejemplo, 10/10.", checkout:"¿Qué fecha exacta desean para el check-out? Por ejemplo, 12/10.", rooms:"¿Cuántas habitaciones necesitan exactamente? Por ejemplo, 1 habitación.", guests:"¿Cuántas personas se alojarán exactamente? Por ejemplo, 2 personas.", preferences:"¿Qué preferencia exacta desean para la habitación?", selecting:"¿Qué desean cambiar exactamente en las propuestas?", breakfast:"¿Desean añadir desayuno? Respondan sí o no.", complete:"¿Qué desean cambiar exactamente en su estancia?" },
  tr: { checkin:"Giriş için tam olarak hangi tarihi istiyorsunuz? Örneğin 10/10.", checkout:"Çıkış için tam olarak hangi tarihi istiyorsunuz? Örneğin 12/10.", rooms:"Tam olarak kaç odaya ihtiyacınız var? Örneğin 1 oda.", guests:"Tam olarak kaç kişi kalacak? Örneğin 2 kişi.", preferences:"Oda için tam olarak hangi tercihi dikkate almamı istersiniz?", selecting:"Önerilerde tam olarak neyi değiştirmek istersiniz?", breakfast:"Kahvaltı eklemek ister misiniz? Lütfen evet veya hayır diye yanıtlayın.", complete:"Konaklamanızda tam olarak neyi değiştirmek istersiniz?" },
};

function safeLanguage(value?: AssistantLanguage): AssistantLanguage { return value || "en"; }
function safeStep(value?: RoomFinderStep): RoomFinderStep { return value || "checkin"; }

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

function cleanCommand(raw: any, context: ConversationContext): AssistantCommand {
  return {
    language: safeLanguage(context.language || raw?.language),
    replyMode: raw?.replyMode === "clarify" || raw?.replyMode === "answer" ? raw.replyMode : "execute",
    selectedRoom: raw?.selectedRoom == null ? context.selectedRoom : Number(raw.selectedRoom),
    actions: Array.isArray(raw?.actions) ? raw.actions.map(cleanAction) : [],
  };
}

export async function interpretAssistantMessage(message: string, context: ConversationContext = {}): Promise<AssistantCommand> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_CONCIERGE_MODEL || process.env.OPENAI_ASSISTANT_MODEL || "gpt-5-mini",
        instructions: `${SYSTEM_PROMPT}\nToday is ${todayIso()}.\nSelected UI language is ${safeLanguage(context.language)}.`,
        input: JSON.stringify({ message, context }),
        text: { format: { type:"json_schema", name:"assistant_command", strict:true, schema:COMMAND_SCHEMA } },
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.error?.message || `OpenAI interpreter failed with HTTP ${response.status}`);

    const output = getOutputText(payload);
    if (!output) throw new Error("OpenAI interpreter returned an empty response");

    const command = cleanCommand(JSON.parse(output), context);
    if (!command.actions.length) throw new Error("OpenAI interpreter returned no actions");

    return command;
  } catch (error) {
    console.error("OpenAI conversation interpreter failed", error);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
