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
    doubleRoom: /δικλινο/u,
    kitchen: /(?:κουζιν\p{L}*|κουζινακι)/u,
    firstFloor: /(?:στον\s+οροφο|πρωτ\p{L}*\s+οροφ\p{L}*)/u,
    groundFloor: /ισογει\p{L}*/u,
    noStairs: /χωρις\s+σκαλ\p{L}*/u,
    economy: /οικονομικ\p{L}*/u,
    family: /οικογενειακ\p{L}*/u,
  },
  en: {
    numbers: COMMON_NUMBERS.en,
    rooms: "rooms?",
    guests: "(?:guests?|people|persons?)",
    nights: "nights?",
    doubleRoom: /double\s+room/u,
    kitchen: /(?:kitchen|kitchenette)/u,
    firstFloor: /(?:first\s+floor|upstairs)/u,
    groundFloor: /ground\s+floor/u,
    noStairs: /(?:no\s+stairs|without\s+stairs)/u,
    economy: /(?:economy|budget)/u,
    family: /family/u,
  },
  de: {
    numbers: COMMON_NUMBERS.de,
    rooms: "zimmer",
    guests: "(?:gaste|personen)",
    nights: "(?:nacht|nachte)",
    doubleRoom: /doppelzimmer/u,
    kitchen: /(?:kuche|kochnische)/u,
    firstFloor: /(?:erste[nr]?\s+stock|obergeschoss)/u,
    groundFloor: /erdgeschoss/u,
    noStairs: /(?:ohne\s+treppen|keine\s+treppen)/u,
    economy: /(?:gunstig|budget)/u,
    family: /familien/u,
  },
  fr: {
    numbers: COMMON_NUMBERS.fr,
    rooms: "chambres?",
    guests: "personnes?",
    nights: "nuits?",
    doubleRoom: /chambre\s+double/u,
    kitchen: /(?:cuisine|kitchenette)/u,
    firstFloor: /premier\s+etage/u,
    groundFloor: /rez\s+de\s+chaussee/u,
    noStairs: /sans\s+escaliers?/u,
    economy: /(?:economique|budget)/u,
    family: /famil/u,
  },
  it: {
    numbers: COMMON_NUMBERS.it,
    rooms: "(?:camera|camere)",
    guests: "(?:persona|persone|ospiti)",
    nights: "(?:notte|notti)",
    doubleRoom: /camera\s+doppia/u,
    kitchen: /(?:cucina|angolo\s+cottura)/u,
    firstFloor: /primo\s+piano/u,
    groundFloor: /piano\s+terra/u,
    noStairs: /senza\s+scale/u,
    economy: /(?:economica|economico|budget)/u,
    family: /famili/u,
  },
  es: {
    numbers: COMMON_NUMBERS.es,
    rooms: "(?:habitacion|habitaciones)",
    guests: "(?:persona|personas|huespedes)",
    nights: "(?:noche|noches)",
    doubleRoom: /habitacion\s+doble/u,
    kitchen: /(?:cocina|cocineta)/u,
    firstFloor: /(?:primer\s+piso|primera\s+planta)/u,
    groundFloor: /planta\s+baja/u,
    noStairs: /sin\s+escaleras/u,
    economy: /(?:economica|economico|budget)/u,
    family: /famili/u,
  },
  tr: {
    numbers: COMMON_NUMBERS.tr,
    rooms: "(?:oda|odalar)",
    guests: "(?:kisi|misafir)",
    nights: "gece",
    doubleRoom: /cift\s+kisilik\s+oda/u,
    kitchen: /mutfak/u,
    firstFloor: /(?:ust\s+kat|birinci\s+kat)/u,
    groundFloor: /zemin\s+kat/u,
    noStairs: /merdivensiz/u,
    economy: /(?:ekonomik|uygun\s+fiyat)/u,
    family: /aile/u,
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
  // JavaScript \b is ASCII-centric, so use explicit Unicode token edges.
  // Optional whitespace intentionally supports human inputs such as "2ατομα".
  const pattern = new RegExp(
    `(?:^|[^\\p{L}\\p{N}])(${numberExpression(numbers)})\\s*(?:${labelPattern})(?=$|[^\\p{L}\\p{N}])`,
    "u",
  );
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

  // Facts always win over a generic clarification. The client state machine
  // decides which truly missing booking field should be asked next.
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
