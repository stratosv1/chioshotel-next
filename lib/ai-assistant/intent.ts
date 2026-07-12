import type { AssistantCommand, AssistantLanguage, ConversationContext } from "./types";

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
Use the recent conversation and selected-room context for references such as “it”, “that room”, “the second option”, “show me photos”, or their equivalents.
When the user corrects dates, guest count or preferences, replace the old value instead of preserving the earlier one.
Dates are required only for live availability and prices, never for browsing rooms, galleries, beaches, villages, museums or activities.
A message can require multiple actions. Example: a family asking for a room and child-friendly beaches should create recommend_rooms and recommend_beaches.
Understand natural guest counts, e.g. “me and my wife” = 2, “two adults and two children” = 4.
Interpret “I do not want stairs” as noStairs=true and floor=ground.
For room photos use show_gallery. For general room browsing use recommend_rooms or show_room.
For information contained in the Chios website use search_content or the specific recommendation action.
Ask clarification only when a required field for the requested action is genuinely missing.
IMPORTANT: A short numeric reply such as 10/10, 10-10, 10.10 or 10 October, when the previous assistant message asked for arrival or departure, is a date continuation. It must never be interpreted as room 10 or as a general content search.
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

function detectFallbackLanguage(message: string, supplied?: AssistantLanguage): AssistantLanguage {
  if (supplied) return supplied;
  if (/[Α-Ωα-ωΆ-ώ]/.test(message)) return "el";
  if (/[ğüşöçıİĞÜŞÖÇ]/i.test(message)) return "tr";
  if (/[äöüß]/i.test(message)) return "de";
  if (/[éèêëàâçîïôùûüÿœ]/i.test(message)) return "fr";
  if (/\b(habitación|playa|pueblo|museo|niños)\b/i.test(message)) return "es";
  if (/\b(camera|spiaggia|villaggio|museo|bambini)\b/i.test(message)) return "it";
  return "en";
}

function normalizeText(value: string) {
  return value.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
}

function isoDateFromShortReply(message: string) {
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

function dateContinuationCommand(message: string, context: ConversationContext): AssistantCommand | undefined {
  const date = isoDateFromShortReply(message);
  if (!date) return undefined;

  const recent = context.recentMessages || [];
  const previousAssistant = [...recent].reverse().find((item) => item.role === "assistant")?.content || "";
  const previous = normalizeText(previousAssistant);
  const language = detectFallbackLanguage(message, context.language);

  const askedArrival = /arrival|check.?in|arrivee|ankunft|arrivo|llegada|varis|αφιξ|ημερομηνια σκεφτεστε για αφιξ/i.test(previous);
  const askedDeparture = /departure|check.?out|depart|abreise|partenza|salida|ayrilis|αναχωρ/i.test(previous);
  const availabilityConversation = recent.some((item) => /availability|διαθεσιμ|verfugbar|disponibil|musait|τιμ|price|rate|preis|prix|prezzo|precio|fiyat/i.test(normalizeText(item.content)));

  if (!askedArrival && !askedDeparture && !availabilityConversation && !context.checkin) return undefined;

  if (askedDeparture || context.checkin) {
    return {
      language,
      replyMode: "execute",
      selectedRoom: context.selectedRoom,
      actions: [{
        type: "search_availability",
        checkin: context.checkin,
        checkout: date,
        guests: context.guests,
      }],
    };
  }

  return {
    language,
    replyMode: "execute",
    selectedRoom: context.selectedRoom,
    actions: [{
      type: "search_availability",
      checkin: date,
      checkout: context.checkout,
      guests: context.guests,
    }],
  };
}

function fallbackCommand(message: string, context: ConversationContext): AssistantCommand {
  const dateContinuation = dateContinuationCommand(message, context);
  if (dateContinuation) return dateContinuation;

  const language = detectFallbackLanguage(message, context.language);
  const text = message.toLowerCase();
  const roomMatch = text.match(/(?:room|δωμάτιο|δωματιο|zimmer|chambre|camera|habitación|oda|apartment|διαμέρισμα|διαμερισμα)\s*(10|[1-9])\b/i);
  const roomNumber = roomMatch ? Number(roomMatch[1]) : context.selectedRoom;
  const preferences = {
    noStairs: /χωρίς\s+σκάλα|χωρις\s+σκαλα|no\s+stairs|without\s+stairs|ohne\s+treppe|sans\s+escalier|senza\s+scale|sin\s+escaleras|merdivensiz/i.test(text) || undefined,
    floor: /χωρίς\s+σκάλα|χωρις\s+σκαλα|ground\s*floor|ισόγει|isogei|erdgeschoss|rez.de.chaussée|piano\s+terra|planta\s+baja|zemin\s+kat/i.test(text) ? "ground" as const : undefined,
    fullKitchen: /full\s+kitchen|πλήρη\s+κουζίνα|πληρη\s+κουζινα|voll.*küche|cuisine\s+complète|cucina\s+completa|cocina\s+completa|tam\s+mutfak/i.test(text) || undefined,
    familyFriendly: /family|οικογέν|παιδι|children|kids|familie|enfant|bambin|niñ|çocuk/i.test(text) || undefined,
    nearby: /near|nearby|κοντά|κοντιν|proche|nahe|vicin|cerca|yakın/i.test(text) || undefined,
    quiet: /quiet|ήσυχ|ησυχ|ruhig|calme|tranquill|tranquil|sakin/i.test(text) || undefined,
  };

  if (/availability|διαθεσιμό|διαθεσιμο|price|τιμ|rate|preis|prix|prezzo|precio|fiyat|book|κράτηση|κρατηση/i.test(text)) {
    return { language, replyMode: "execute", selectedRoom: roomNumber, actions: [{ type: "search_availability", guests: context.guests, checkin: context.checkin, checkout: context.checkout, preferences }] };
  }
  if (/photo|gallery|φωτογραφ|bilder|photos|foto|fotos|resim/i.test(text)) {
    return { language, replyMode: "execute", selectedRoom: roomNumber, actions: [{ type: "show_gallery", roomNumber, preferences }] };
  }
  if (/beach|παραλί|παραλι|strand|plage|spiaggia|playa|plaj/i.test(text)) {
    return { language, replyMode: "answer", selectedRoom: roomNumber, actions: [{ type: "recommend_beaches", query: message, preferences }] };
  }
  if (/village|χωρι|dorf|village|villaggio|pueblo|köy/i.test(text)) {
    return { language, replyMode: "answer", selectedRoom: roomNumber, actions: [{ type: "recommend_villages", query: message, preferences }] };
  }
  if (/museum|μουσεί|μουσει|musee|museo|müze/i.test(text)) {
    return { language, replyMode: "answer", selectedRoom: roomNumber, actions: [{ type: "recommend_museums", query: message, preferences }] };
  }
  if (/room|δωμάτι|δωματι|zimmer|chambre|camera|habitación|oda|apartment|διαμέρισμα|διαμερισμα/i.test(text)) {
    return { language, replyMode: "execute", selectedRoom: roomNumber, actions: [{ type: roomNumber ? "show_room" : "recommend_rooms", roomNumber, guests: context.guests, preferences }] };
  }
  return { language, replyMode: "answer", selectedRoom: roomNumber, actions: [{ type: "search_content", topic: "general", query: message, preferences }] };
}

export async function interpretAssistantMessage(
  message: string,
  context: ConversationContext = {},
): Promise<AssistantCommand> {
  const deterministicDateContinuation = dateContinuationCommand(message, context);
  if (deterministicDateContinuation) return deterministicDateContinuation;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackCommand(message, context);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_INTENT_MODEL || "gpt-5-mini",
        instructions: SYSTEM_PROMPT,
        input: JSON.stringify({
          message,
          context: {
            ...context,
            recentMessages: context.recentMessages?.slice(-10),
          },
        }),
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
    if (!response.ok) throw new Error(payload?.error?.message || "Intent interpretation failed");

    const text = getOutputText(payload);
    if (!text) throw new Error("Intent model returned an empty response");

    const command = JSON.parse(text) as AssistantCommand;
    if (!Array.isArray(command.actions) || !command.actions.length) throw new Error("Intent model returned no actions");
    return command;
  } catch (error) {
    console.error("Intent routing fallback used", error);
    return fallbackCommand(message, context);
  } finally {
    clearTimeout(timeout);
  }
}
