import type {
  AssistantAction,
  AssistantCommand,
  AssistantLanguage,
  AssistantPreferences,
  ConversationContext,
} from "./types";

export type DeterministicBookingFacts = {
  roomCount?: number;
  guests?: number;
  nights?: number;
  preferences?: AssistantPreferences;
};

type LanguageLexicon = {
  numbers: Record<string, number>;
  rooms: string;
  guests: string;
  nights: string;
  doubleRoom: RegExp;
  kitchen: RegExp;
  firstFloor: RegExp;
  groundFloor: RegExp;
  noStairs: RegExp;
  economy: RegExp;
  family: RegExp;
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLocaleLowerCase()
    .replace(/[’']/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const COMMON_NUMBERS = {
  el: { "ενα": 1, "εναν": 1, "μια": 1, "ενας": 1, "δυο": 2, "τρια": 3, "τρεις": 3, "τεσσερα": 4, "τεσσερις": 4, "πεντε": 5 },
  en: { one: 1, two: 2, three: 3, four: 4, five: 5 },
  de: { ein: 1, eine: 1, einen: 1, eins: 1, zwei: 2, drei: 3, vier: 4, funf: 5 },
  fr: { un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5 },
  it: { un: 1, una: 1, uno: 1, due: 2, tre: 3, quattro: 4, cinque: 5 },
  es: { un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5 },
  tr: { bir: 1, iki: 2, uc: 3, dort: 4, bes: 5 },
} satisfies Record<AssistantLanguage, Record<string, number>>;

const LEXICONS: Record<AssistantLanguage, LanguageLexicon> = {
  el: {
    numbers: COMMON_NUMBERS.el,
    rooms: "δωματι\\p{L}*",
    guests: "(?:ατομ\\p{L}*|επισκεπτ\\p{L}*)",
    nights: "(?:βραδι\\p{L}*|διανυκτερευ\\p{L}*)",
    doubleRoom: /\bδικλινο\b/u,
    kitchen: /\b(?:κουζιν\\p{L}*|κουζινακι)\b/u,
    firstFloor: /\b(?:στον\s+οροφο|πρωτ\\p{L}*\s+οροφ\\p{L}*)\b/u,
    groundFloor: /\bισογει\\p{L}*\b/u,
    noStairs: /\bχωρις\s+σκαλ\\p{L}*\b/u,
    economy: /\bοικονομικ\\p{L}*\b/u,
    family: /\bοικογενειακ\\p{L}*\b/u,
  },
  en: {
    numbers: COMMON_NUMBERS.en,
    rooms: "rooms?",
    guests: "(?:guests?|people|persons?)",
    nights: "nights?",
    doubleRoom: /\bdouble\s+room\b/u,
    kitchen: /\b(?:kitchen|kitchenette)\b/u,
    firstFloor: /\b(?:first\s+floor|upstairs)\b/u,
    groundFloor: /\bground\s+floor\b/u,
    noStairs: /\b(?:no\s+stairs|without\s+stairs)\b/u,
    economy: /\b(?:economy|budget)\b/u,
    family: /\bfamily\b/u,
  },
  de: {
    numbers: COMMON_NUMBERS.de,
    rooms: "zimmer",
    guests: "(?:gaste|personen)",
    nights: "(?:nacht|nachte)",
    doubleRoom: /\bdoppelzimmer\b/u,
    kitchen: /\b(?:kuche|kochnische)\b/u,
    firstFloor: /\b(?:erste[nr]?\s+stock|obergeschoss)\b/u,
    groundFloor: /\berdgeschoss\b/u,
    noStairs: /\b(?:ohne\s+treppen|keine\s+treppen)\b/u,
    economy: /\b(?:gunstig|budget)\b/u,
    family: /\bfamilien/u,
  },
  fr: {
    numbers: COMMON_NUMBERS.fr,
    rooms: "chambres?",
    guests: "personnes?",
    nights: "nuits?",
    doubleRoom: /\bchambre\s+double\b/u,
    kitchen: /\b(?:cuisine|kitchenette)\b/u,
    firstFloor: /\bpremier\s+etage\b/u,
    groundFloor: /\brez\s+de\s+chaussee\b/u,
    noStairs: /\bsans\s+escaliers?\b/u,
    economy: /\b(?:economique|budget)\b/u,
    family: /\bfamil/u,
  },
  it: {
    numbers: COMMON_NUMBERS.it,
    rooms: "(?:camera|camere)",
    guests: "(?:persona|persone|ospiti)",
    nights: "(?:notte|notti)",
    doubleRoom: /\bcamera\s+doppia\b/u,
    kitchen: /\b(?:cucina|angolo\s+cottura)\b/u,
    firstFloor: /\bprimo\s+piano\b/u,
    groundFloor: /\bpiano\s+terra\b/u,
    noStairs: /\bsenza\s+scale\b/u,
    economy: /\b(?:economica|economico|budget)\b/u,
    family: /\bfamili/u,
  },
  es: {
    numbers: COMMON_NUMBERS.es,
    rooms: "(?:habitacion|habitaciones)",
    guests: "(?:persona|personas|huespedes)",
    nights: "(?:noche|noches)",
    doubleRoom: /\bhabitacion\s+doble\b/u,
    kitchen: /\b(?:cocina|cocineta)\b/u,
    firstFloor: /\b(?:primer\s+piso|primera\s+planta)\b/u,
    groundFloor: /\bplanta\s+baja\b/u,
    noStairs: /\bsin\s+escaleras\b/u,
    economy: /\b(?:economica|economico|budget)\b/u,
    family: /\bfamili/u,
  },
  tr: {
    numbers: COMMON_NUMBERS.tr,
    rooms: "(?:oda|odalar)",
    guests: "(?:kisi|misafir)",
    nights: "gece",
    doubleRoom: /\bcift\s+kisilik\s+oda\b/u,
    kitchen: /\bmutfak/u,
    firstFloor: /\b(?:ust\s+kat|birinci\s+kat)\b/u,
    groundFloor: /\bzemin\s+kat\b/u,
    noStairs: /\bmerdivensiz\b/u,
    economy: /\b(?:ekonomik|uygun\s+fiyat)\b/u,
    family: /\baile/u,
  },
};

function numberExpression(numbers: Record<string, number>) {
  const words = Object.keys(numbers)
    .sort((a, b) => b.length - a.length)
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return `(?:\\d{1,2}|${words.join("|")})`;
}

function parseNumber(token: string, numbers: Record<string, number>): number | undefined {
  if (/^\d+$/.test(token)) return Number(token);
  return numbers[token];
}

function extractLabeledCount(
  text: string,
  numbers: Record<string, number>,
  labelPattern: string,
  max: number,
): number | undefined {
  const pattern = new RegExp(`\\b(${numberExpression(numbers)})\\s+(?:${labelPattern})\\b`, "u");
  const match = text.match(pattern);
  if (!match) return undefined;
  const value = parseNumber(match[1], numbers);
  return value && value >= 1 && value <= max ? value : undefined;
}

export function extractDeterministicBookingFacts(
  message: string,
  context: ConversationContext = {},
): DeterministicBookingFacts {
  const language = context.language || "en";
  const lexicon = LEXICONS[language];
  const text = normalize(message);

  let roomCount = extractLabeledCount(text, lexicon.numbers, lexicon.rooms, 3);
  let guests = extractLabeledCount(text, lexicon.numbers, lexicon.guests, 10);
  const nights = extractLabeledCount(text, lexicon.numbers, lexicon.nights, 60);

  if (lexicon.doubleRoom.test(text)) {
    roomCount ??= 1;
    guests ??= 2;
  }

  const preferences: AssistantPreferences = {};
  if (lexicon.kitchen.test(text)) preferences.kitchenette = true;
  if (lexicon.firstFloor.test(text)) preferences.floor = "first";
  if (lexicon.groundFloor.test(text)) preferences.floor = "ground";
  if (lexicon.noStairs.test(text)) preferences.noStairs = true;
  if (lexicon.economy.test(text)) preferences.budget = "lowest";
  if (lexicon.family.test(text)) preferences.familyFriendly = true;

  return {
    roomCount,
    guests,
    nights,
    preferences: Object.keys(preferences).length ? preferences : undefined,
  };
}

function suppliedFields(facts: DeterministicBookingFacts) {
  const fields = new Set<string>();
  if (facts.roomCount) fields.add("rooms");
  if (facts.guests) fields.add("guests");
  if (facts.nights) fields.add("checkout");
  if (facts.preferences) fields.add("preferences");
  return fields;
}

export function mergeDeterministicBookingFacts(
  command: AssistantCommand,
  facts: DeterministicBookingFacts,
): AssistantCommand {
  const factActions: AssistantAction[] = [];
  if (facts.roomCount) factActions.push({ type: "set_room_count", roomCount: facts.roomCount });
  if (facts.guests) factActions.push({ type: "set_guest_count", guests: facts.guests });
  if (facts.nights) factActions.push({ type: "search_availability", nights: facts.nights });
  if (facts.preferences) factActions.push({ type: "recommend_rooms", preferences: facts.preferences });
  if (!factActions.length) return command;

  const supplied = suppliedFields(facts);
  const actions = command.actions
    .map((action) => {
      if (action.type !== "ask_clarification" || !action.missingFields?.length) return action;
      const remaining = action.missingFields.filter((field) => !supplied.has(field));
      return remaining.length ? { ...action, missingFields: remaining } : null;
    })
    .filter((action): action is AssistantAction => Boolean(action));

  const hasExecutableFact = actions.some((action) => action.type !== "ask_clarification") || factActions.length > 0;
  const withoutRedundantClarifications = hasExecutableFact
    ? actions.filter((action) => action.type !== "ask_clarification")
    : actions;

  return {
    ...command,
    replyMode: "execute",
    actions: [...withoutRedundantClarifications, ...factActions],
  };
}
