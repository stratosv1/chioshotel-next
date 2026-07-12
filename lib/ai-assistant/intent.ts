import type { AssistantCommand, ConversationContext } from "./types";

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
              "search_availability", "recommend_rooms", "show_room", "show_gallery",
              "compare_rooms", "answer_room_question", "search_content", "recommend_beaches",
              "recommend_villages", "recommend_museums", "recommend_activities", "build_itinerary",
              "answer_property_question", "show_directions", "start_booking_request", "ask_clarification"
            ]
          },
          roomNumber: { type: "integer", minimum: 1, maximum: 10 },
          roomNumbers: { type: "array", items: { type: "integer", minimum: 1, maximum: 10 }, maxItems: 10 },
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

const SYSTEM_PROMPT = `You are the intent router for the Voulamandis House digital concierge in Chios.
Convert every user message, in any supported language, into safe structured actions.
Do not answer the user directly and do not invent facts, prices, availability, room details, distances or opening hours.
Use conversation context for references such as “it”, “that room”, “show me photos”, or their equivalents.
Dates are required only for live availability and prices, never for browsing rooms, galleries, beaches, villages, museums or activities.
A message can require multiple actions. Example: a family asking for a room and child-friendly beaches should create recommend_rooms and recommend_beaches.
Understand natural guest counts, e.g. “me and my wife” = 2, “two adults and two children” = 4.
Interpret “I do not want stairs” as noStairs=true and floor=ground.
For room photos use show_gallery. For general room browsing use recommend_rooms or show_room.
For information contained in the Chios website use search_content or the specific recommendation action.
Ask clarification only when a required field for the requested action is genuinely missing.
Return only JSON matching the provided schema.`;

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

export async function interpretAssistantMessage(
  message: string,
  context: ConversationContext = {},
): Promise<AssistantCommand> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_INTENT_MODEL || "gpt-5-mini",
      instructions: SYSTEM_PROMPT,
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
  if (!response.ok) {
    throw new Error(payload?.error?.message || "Intent interpretation failed");
  }

  const text = getOutputText(payload);
  if (!text) throw new Error("Intent model returned an empty response");

  const command = JSON.parse(text) as AssistantCommand;
  if (!Array.isArray(command.actions) || !command.actions.length) {
    throw new Error("Intent model returned no actions");
  }
  return command;
}
