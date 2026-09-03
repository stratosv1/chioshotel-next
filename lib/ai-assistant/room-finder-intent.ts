import { todayInAthensIso } from "./room-finder-date";
import type {
  RoomFinderAction,
  RoomFinderAssistantLanguage,
  RoomFinderCommand,
  RoomFinderConversationContext,
  RoomFinderPreference,
} from "./room-finder-types";

const ACTION_TYPES = [
  "set_stay_dates",
  "set_room_count",
  "set_guest_count",
  "set_preferences",
  "restart_search",
  "ask_clarification",
  "acknowledge_contact",
  "no_change",
] as const;

const PREFERENCES = [
  "ground_floor",
  "no_stairs",
  "kitchen",
  "balcony",
  "garden",
  "budget",
  "family",
] as const;

const COMMAND_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["language", "replyMode", "actions"],
  properties: {
    language: { type: "string", enum: ["el", "en", "fr", "de", "it", "es", "tr"] },
    replyMode: { type: "string", enum: ["execute", "clarify"] },
    actions: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "type",
          "checkin",
          "checkout",
          "nights",
          "roomCount",
          "totalGuests",
          "guests",
          "guestRoom",
          "preferences",
          "query",
          "missingFields",
        ],
        properties: {
          type: { type: "string", enum: ACTION_TYPES },
          checkin: { type: ["string", "null"] },
          checkout: { type: ["string", "null"] },
          nights: { type: ["integer", "null"], minimum: 1, maximum: 60 },
          roomCount: { type: ["integer", "null"], minimum: 1, maximum: 99 },
          totalGuests: { type: ["integer", "null"], minimum: 1, maximum: 15 },
          guests: { type: ["integer", "null"], minimum: 1, maximum: 5 },
          guestRoom: { type: ["integer", "null"], minimum: 1, maximum: 3 },
          preferences: {
            type: "array",
            items: { type: "string", enum: PREFERENCES },
            maxItems: 7,
          },
          query: { type: "string" },
          missingFields: { type: "array", items: { type: "string" }, maxItems: 6 },
        },
      },
    },
  },
} as const;

const SYSTEM_PROMPT = `You are the single semantic interpreter for the Voulamandis House AI Room Finder in Chios.

EVERY customer text message reaches you, including corrections after room results have already been shown. Your only job is to translate natural language into the small booking contract consumed by the Room Finder state machine. You do not search availability, calculate prices or invent room facts.

SUPPORTED CONTRACT
You may return only these actions:
- set_stay_dates: exact check-in/check-out/nights facts.
- set_room_count: exact number of rooms requested. Return the customer's exact number even when it is 4 or more; the application routes requests above 3 rooms to the front desk.
- set_guest_count: either a total booking guest count OR a guest count assigned to a specific room.
- set_preferences: SOFT room preferences used only to rank already-available rooms. Supported values: ground_floor, no_stairs, kitchen, balcony, garden, budget, family.
- restart_search: customer clearly wants to start over.
- ask_clarification: only for a value the customer attempted to provide but which is genuinely ambiguous/contradictory.
- acknowledge_contact: the customer says they will call, message, write to or otherwise contact the property/reception, now or later.
- no_change: no supported booking fact, supported room preference or contact intention was supplied in the latest message.

CORE RULES
- Read the latest message together with booking context and recent conversation.
- Extract EVERY supported booking fact from the latest message, even if it answers a different question from currentStep.
- Corrections in the latest message override earlier context, including during selecting, breakfast, complete or unavailable states.
- Never discard a clear fact because another fact is missing.
- Never invent dates, rooms or guests.
- If the customer says they will call, phone, message, WhatsApp, write to or contact the property/reception, return acknowledge_contact. Do not return no_change and do not suggest changing dates unless the customer actually asks to change them.
- Missing information is NOT ambiguity. Do not ask a clarification merely because another booking field is absent; return the facts you understood and let the application ask the next missing field.
- If part of a message is clear and another attempted fact is ambiguous, return the clear fact actions plus exactly one specific ask_clarification action.
- Clarification must identify the exact ambiguity and, when useful, include one short valid example.
- Never use vague wording such as “I did not understand” or “please be more specific” without naming what is unclear.

DATES
- Normalize each exact resolved date to YYYY-MM-DD.
- This is a European accommodation flow: 10/10 means 10 October; 28/8 means 28 August unless the customer explicitly indicates another convention.
- If year is omitted, use the nearest occurrence that is today or in the future. “Today” is supplied by the application in Europe/Athens local date.
- Exact forms such as 10/10, 10 October, 10 Οκτωβρίου, tomorrow, and an unambiguous weekday are not ambiguous.
- When currentStep=checkin, a standalone exact date is check-in unless explicitly labelled departure/check-out.
- When currentStep=checkout, a standalone exact date is check-out unless explicitly labelled arrival/check-in.
- When currentStep is selecting, breakfast, complete or unavailable AND both checkin and checkout already exist, a bare new date such as “11/10” is an ambiguous correction because it is unclear which date the customer wants to replace. Ask specifically whether they mean check-in or check-out. Do not overwrite either date.
- An explicitly labelled correction such as “τελικά άφιξη 11/10”, “check-in 11/10”, “αναχώρηση 13/10” or “check-out 13/10” is clear in every step and must be extracted directly.
- If both arrival and departure are supplied, use one set_stay_dates action containing both.
- If check-in plus nights are supplied, set checkin and nights. If check-in is already in context and the customer only supplies nights, set nights.
- If departure is before arrival, preserve the exact stated dates; deterministic code validates their relationship.
- Approximate phrases such as “early October”, “around the 10th”, or “sometime next week” are ambiguous. Ask for the exact date and provide an example.

ROOMS AND GUESTS
- roomCount is the number of rooms for the booking.
- The automated Room Finder supports up to 3 rooms, but you MUST still return the exact roomCount when the customer asks for 4 or more rooms. Never clamp 4+ to 3, never silently ignore it, and never convert it to a guest count. The application will stop the automated search and route the customer to the front desk.
- When roomCount is 4 or more, do not emit per-room guest assignments with guestRoom; return the exact roomCount and any other clear top-level facts that fit the schema.
- totalGuests is the number of people across the entire booking.
- guests + guestRoom is the number of people assigned to one specific room.
- Never use a single guests value to mean total guests for a multi-room booking.
- If the customer says “2 rooms for 4 people”, return roomCount=2 and totalGuests=4. Do NOT invent how the 4 people are divided between rooms.
- If the customer says “2 rooms, 2 people in each room”, return roomCount=2 and two set_guest_count actions: guestRoom=1 guests=2 and guestRoom=2 guests=2.
- If the customer says “3 in the first room and 1 in the second”, return the two explicit per-room assignments.
- When currentStep=guests and context.currentRoom is present, a standalone count such as “2” or “2 people” refers to that room: return guestRoom=context.currentRoom and guests=2.
- When not answering a specific room-allocation question, phrases such as “3 people”, “two adults and one child”, or “2ατομα” mean totalGuests.
- A downstream correction such as “τελικά 3 άτομα” means totalGuests=3 unless the customer explicitly names a particular room.
- For one room, totalGuests still means the booking total; deterministic code maps it to that room.
- Each room allocation supports 1-5 guests. Total guests across up to 3 rooms may be 1-15.

ROOM PREFERENCES
- Preferences are SOFT ranking signals. They must never alter availability, price, capacity or hide an otherwise valid room.
- Supported meanings:
  ground_floor = customer wants/is interested in a ground-floor room.
  no_stairs = customer wants to avoid stairs or has mobility concerns.
  kitchen = kitchen, kitchenette or cooking facilities requested.
  balcony = private balcony requested.
  garden = garden/courtyard access requested.
  budget = economy, cheapest, lower-price or value-first preference.
  family = family-oriented room/apartment preference.
- When the latest message adds preferences, return one set_preferences action containing the FULL desired preference set after applying the latest message to context.preferences.
- If the customer explicitly removes a preference, return the remaining full set. An empty preferences array clears preferences.
- Do not convert unsupported subjective requests into invented room traits. For example “romantic”, “best view” or “quietest room” are not supported ranking facts unless another supported preference is also explicit.
- A preference-only message is valid and should return set_preferences, not no_change.

LANGUAGE
- Preserve the selected UI language from context for command.language and clarification text.

REFERENCE EXAMPLES
1) “Θέλω ένα δωμάτιο για 2 άτομα χωρίς σκάλες, άφιξη 10/10 αναχώρηση 12/10”
=> set_stay_dates(checkin, checkout), set_room_count(roomCount=1), set_guest_count(totalGuests=2), set_preferences(preferences=[no_stairs]). No clarification.

2) “Θέλω ένα δωμάτιο για 2 άτομα με κουζίνα”
=> set_room_count(roomCount=1), set_guest_count(totalGuests=2), set_preferences(preferences=[kitchen]). Missing date is not a clarification.

3) Context has check-in and customer says “2 βράδια 3 άτομα”.
=> set_stay_dates(nights=2), set_guest_count(totalGuests=3).

4) “Θέλω 2 δωμάτια για 4 άτομα”.
=> set_room_count(roomCount=2), set_guest_count(totalGuests=4). Do not guess room allocation.

5) Context currentStep=guests, currentRoom=2 and customer says “2”.
=> set_guest_count(guestRoom=2, guests=2).

6) “Αρχές Οκτωβρίου”.
=> ask_clarification tied to checkin, with a concrete question such as “Ποια ακριβώς ημερομηνία του Οκτωβρίου θέλετε για check-in; π.χ. 3/10.”

7) Context is selecting with checkin=2026-10-10 and checkout=2026-10-12. Customer: “τελικά 3 άτομα”.
=> set_guest_count(totalGuests=3). No clarification.

8) Same selecting context. Customer: “11/10”.
=> ask_clarification asking whether 11/10 is the new check-in or new check-out; missingFields should contain checkin and checkout. Do not emit a new date fact.

9) “Θέλω 4 δωμάτια”.
=> set_room_count(roomCount=4). Do not clamp it to 3 and do not ask a clarification; the application routes this request to the front desk.

10) Context preferences=[budget]. Customer: “τελικά θέλω ισόγειο χωρίς σκάλες, η τιμή δεν με νοιάζει”.
=> set_preferences(preferences=[ground_floor,no_stairs]).

11) Context currentStep=unavailable. Customer: “Θα καλέσω αύριο στο τηλέφωνό σας”.
=> acknowledge_contact. Do not return no_change, do not ask for new dates and do not modify booking facts.

SCHEMA RULES
- For irrelevant nullable fields return null.
- preferences is [] when unused.
- query is an empty string when unused.
- missingFields is [] when unused.
- Use missingFields values from: checkin, checkout, roomCount, totalGuests, guests, guestRoom.
- replyMode=execute unless a genuine ambiguity requires an answer; then use clarify.
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

function safeLanguage(value?: RoomFinderAssistantLanguage): RoomFinderAssistantLanguage {
  return value || "en";
}

function cleanPreferences(value: unknown): RoomFinderPreference[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter((item): item is RoomFinderPreference =>
    PREFERENCES.includes(item as RoomFinderPreference),
  )));
}

function cleanAction(raw: any): RoomFinderAction {
  const type = ACTION_TYPES.includes(raw?.type) ? raw.type : "no_change";
  const action: RoomFinderAction = { type };

  if (raw?.checkin) action.checkin = raw.checkin;
  if (raw?.checkout) action.checkout = raw.checkout;
  if (raw?.nights != null) action.nights = Number(raw.nights);
  if (raw?.roomCount != null) action.roomCount = Number(raw.roomCount);
  if (raw?.totalGuests != null) action.totalGuests = Number(raw.totalGuests);
  if (raw?.guests != null) action.guests = Number(raw.guests);
  if (raw?.guestRoom != null) action.guestRoom = Number(raw.guestRoom);
  if (type === "set_preferences") action.preferences = cleanPreferences(raw?.preferences);
  if (raw?.query) action.query = String(raw.query);
  if (Array.isArray(raw?.missingFields) && raw.missingFields.length) {
    action.missingFields = raw.missingFields.map(String);
  }

  return action;
}

function cleanCommand(raw: any, context: RoomFinderConversationContext): RoomFinderCommand {
  return {
    language: safeLanguage(context.language || raw?.language),
    replyMode: raw?.replyMode === "clarify" ? "clarify" : "execute",
    actions: Array.isArray(raw?.actions) ? raw.actions.map(cleanAction) : [],
  };
}

export async function interpretRoomFinderMessage(
  message: string,
  context: RoomFinderConversationContext = {},
): Promise<RoomFinderCommand> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

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
        instructions: `${SYSTEM_PROMPT}\nToday in Europe/Athens is ${todayInAthensIso()}.\nSelected UI language is ${safeLanguage(context.language)}.`,
        input: JSON.stringify({ message, context }),
        text: {
          format: {
            type: "json_schema",
            name: "room_finder_command",
            strict: true,
            schema: COMMAND_SCHEMA,
          },
        },
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.error?.message || `OpenAI Room Finder interpreter failed with HTTP ${response.status}`);
    }

    const output = getOutputText(payload);
    if (!output) throw new Error("OpenAI Room Finder interpreter returned an empty response");

    const command = cleanCommand(JSON.parse(output), context);
    if (!command.actions.length) throw new Error("OpenAI Room Finder interpreter returned no actions");

    return command;
  } catch (error) {
    console.error("OpenAI Room Finder interpreter failed", error);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
