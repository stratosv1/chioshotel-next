import {
  isStrictIsoDate,
  todayInAthensIso,
} from "./room-finder-date";
import type {
  RoomFinderAction,
  RoomFinderCommand,
  RoomFinderConversationContext,
  RoomFinderPreference,
} from "./room-finder-types";

const NUMERIC_DATE_SOURCE = String.raw`\b(\d{1,2})[\/.\-](\d{1,2})(?:[\/.\-](\d{2,4}))?\b`;
const NUMERIC_DATE_HINT = new RegExp(NUMERIC_DATE_SOURCE, "u");

const ROOM_WORDS = /(δωμάτι(?:ο|α)|rooms?|zimmer|chambres?|camere?|habitaciones?|odas?)/iu;
const GUEST_WORDS = /(άτομα|ατομα|επισκέπτες|επισκεπτες|guests?|people|persons?|gäste|personen|personnes?|persone|personas?|kişi)/iu;
const ADULT_WORDS = /(ενήλικ(?:ας|ες|ων)?|adult(?:s)?|erwachsene[nr]?|adultes?|adulti|adultos?|yetişkin(?:ler)?)/iu;
const CHILD_WORDS = /(παιδ(?:ί|ι|ιά|ια)|children|child|kinder|kind|enfants?|enfant|bambini?|bambino|niñ(?:o|os|a|as)|çocuk(?:lar)?)/iu;
const NIGHT_WORDS = /(βραδι(?:ά|ες)|διανυκτερ(?:εύσεις|ευσεις|εύση|ευση)|nights?|nächte|nachte|nuits?|notti|noches|gece)/iu;
const ROOM_WORD_SOURCE = "(?:δωματι(?:ο|α)|rooms?|zimmer|chambres?|camer(?:a|e)|habitacion(?:es)?|oda(?:lar)?)";
const GUEST_WORD_SOURCE = "(?:ατομα|επισκεπτες|guests?|people|persons?|gaste|personen|personnes?|persone|personas?|kisi)";
const ADULT_WORD_SOURCE = "(?:ενηλικ(?:ας|ες|ων)?|adults?|erwachsene[nr]?|adultes?|adulti|adultos?|yetiskin(?:ler)?)";
const CHILD_WORD_SOURCE = "(?:παιδ(?:ι|ια)|children|child|kinder|kind|enfants?|enfant|bambini?|bambino|nin(?:o|os|a|as)|cocuk(?:lar)?)";
const NIGHT_WORD_SOURCE = "(?:βραδι(?:α|ες)|διανυκτερ(?:ευσεις|ευση)|nights?|nachte|nuits?|notti|noches|gece)";
const COMPLEX_GUEST_HINT = /(adult|child|children|ενήλικ|ενηλικ|παιδ|kinder|erwachsene|adulte|enfant|adulti|bambin|adultos|niñ|nino|çocuk|cocuk|yetişkin|yetiskin)/iu;
const RESTART_WORDS = /(από την αρχή|απο την αρχη|νέα αναζήτηση|νεα αναζητηση|start over|new search|restart|neu beginnen|nouvelle recherche|ricomincia|nueva búsqueda|yeniden başla|yeni arama)/iu;
const CHECKIN_WORDS = /(check\s*-?\s*in|άφιξ|αφιξ|arrival|ankunft|arrivée|arrivo|llegada|giriş)/iu;
const CHECKOUT_WORDS = /(check\s*-?\s*out|αναχώρ|αναχωρ|departure|abreise|départ|partenza|salida|çıkış)/iu;
const PREFERENCE_REMOVAL_WORDS = /(δεν\s+(?:με\s+)?νοιάζ|δεν\s+θέλω\s+πια|όχι\s+πια|χωρίς\s+προτίμηση|δεν\s+έχω\s+προτίμηση|don['’]?t\s+care|do\s+not\s+care|no\s+longer|don['’]?t\s+want|do\s+not\s+want|no\s+preference|nicht\s+mehr|nicht\s+wichtig|egal|peu\s+importe|ne\s+veux\s+plus|sans\s+préférence|non\s+importa|non\s+voglio\s+più|nessuna\s+preferenza|ya\s+no|no\s+me\s+importa|no\s+quiero|sin\s+preferencia|artık\s+önemli\s+değil|istemiyorum|fark\s+etmez)/iu;
const GENERIC_PREFERENCE_CLEAR = /(χωρίς\s+προτίμηση|δεν\s+έχω\s+προτίμηση|no\s+preference|don['’]?t\s+care\s*$|do\s+not\s+care\s*$|egal\s*$|sans\s+préférence|nessuna\s+preferenza|sin\s+preferencia|fark\s+etmez)/iu;
const PREFERENCE_INTENT = /(θέλω|θελω|προτιμ|χρειάζ|χρειαζ|want|prefer|need|looking\s+for|möcht|mocht|bevorzug|brauch|souhait|préf|pref|cherch|vorrei|prefer|cerco|quier|prefier|busco|istiyorum|tercih|arıyorum|ariyorum)/iu;
const PREFERENCE_QUESTION = /(ποιο|ποια|τι\s+έχει|τι\s+εχει|έχει\?|εχει\?|which|what\s+has|does\s+.*have|welch|hat\?|quel|quelle|a-t-il|quale|ha\?|cu[aá]l|tiene\?|hangi|var\s+m[ıi]|\?)/iu;

const PREFERENCE_PATTERNS: Array<[RoomFinderPreference, RegExp]> = [
  ["no_stairs", /(χωρίς σκάλ|χωρις σκαλ|no stairs|without stairs|keine treppen|sans escalier|senza scale|sin escaleras|merdivensiz)/iu],
  ["ground_floor", /(ισόγει|ισογει|ground floor|erdgeschoss|rez-de-chaussée|rez de chaussée|piano terra|planta baja|zemin kat)/iu],
  ["kitchen", /(κουζίν|κουζιν|kitchen|kitchenette|küche|küchenzeile|cuisine|angolo cottura|cucina|cocina|mutfak)/iu],
  ["balcony", /(μπαλκόν|μπαλκον|balcony|balkon|balcon|balcone|balcón)/iu],
  ["garden", /(κήπ|κηπ|αυλή|αυλη|garden|courtyard|garten|jardin|giardino|jardín|bahçe)/iu],
  ["budget", /(οικονομικ|φθην|budget|economy|cheap|preisgünst|économ|economica|económ|uygun fiyat|ekonomik)/iu],
  ["family", /(οικογέν|οικογεν|family|familie|famille|famiglia|familia|aile)/iu],
];

const MONTH_ALIASES: Array<[number, string[]]> = [
  [1, ["ιανουαριου", "ιανουαριο", "january", "jan", "januar", "janvier", "gennaio", "enero", "ocak"]],
  [2, ["φεβρουαριου", "φεβρουαριο", "february", "feb", "februar", "fevrier", "febbraio", "febrero", "subat"]],
  [3, ["μαρτιου", "μαρτιο", "march", "mar", "marz", "mars", "marzo", "mart"]],
  [4, ["απριλιου", "απριλιο", "april", "apr", "avril", "aprile", "abril", "nisan"]],
  [5, ["μαιου", "μαιο", "may", "mai", "maggio", "mayo", "mayis", "mayıs"]],
  [6, ["ιουνιου", "ιουνιο", "june", "jun", "juni", "juin", "giugno", "junio", "haziran"]],
  [7, ["ιουλιου", "ιουλιο", "july", "jul", "juli", "juillet", "luglio", "julio", "temmuz"]],
  [8, ["αυγουστου", "αυγουστο", "august", "aug", "aout", "agosto", "agustos"]],
  [9, ["σεπτεμβριου", "σεπτεμβριο", "september", "sep", "sept", "septembre", "settembre", "septiembre", "setiembre", "eylul"]],
  [10, ["οκτωβριου", "οκτωβριο", "october", "oct", "oktober", "octobre", "ottobre", "octubre", "ekim"]],
  [11, ["νοεμβριου", "νοεμβριο", "november", "nov", "novembre", "noviembre", "kasim", "kasım"]],
  [12, ["δεκεμβριου", "δεκεμβριο", "december", "dec", "dezember", "decembre", "dicembre", "diciembre", "aralik", "aralık"]],
];

const NUMBER_WORDS: Array<[number, string[]]> = [
  [1, ["ενα", "μια", "ενας", "one", "ein", "eine", "un", "une", "uno", "una", "bir"]],
  [2, ["δυο", "two", "zwei", "deux", "due", "dos", "iki"]],
  [3, ["τρεις", "τρια", "three", "drei", "trois", "tre", "tres", "uc"]],
  [4, ["τεσσερα", "four", "vier", "quatre", "quattro", "cuatro", "dort"]],
  [5, ["πεντε", "five", "funf", "cinq", "cinque", "cinco", "bes"]],
];

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLowerCase();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const MONTH_LOOKUP = new Map<string, number>();
for (const [month, aliases] of MONTH_ALIASES) {
  for (const alias of aliases) MONTH_LOOKUP.set(normalizeSearchText(alias), month);
}
const MONTH_PATTERN = [...MONTH_LOOKUP.keys()]
  .sort((left, right) => right.length - left.length)
  .map(escapeRegExp)
  .join("|");
const RANGE_SEPARATOR = "(?:-|–|—|εως|ως|με|to|until|bis|au|al|hasta|ile)";
const TOKEN_START = String.raw`(?<![\p{L}\p{N}])`;
const TOKEN_END = String.raw`(?![\p{L}\p{N}])`;

function isoFromParts(day: number, month: number, year: number) {
  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return "";
  const value = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return isStrictIsoDate(value) ? value : "";
}

function normalizeYear(rawYear: string | undefined, day: number, month: number, today: string) {
  const currentYear = Number(today.slice(0, 4));
  if (rawYear) {
    const parsed = Number(rawYear);
    return rawYear.length === 2 ? 2000 + parsed : parsed;
  }
  const thisYear = isoFromParts(day, month, currentYear);
  return thisYear && thisYear >= today ? currentYear : currentYear + 1;
}

function pushUniqueDate(
  values: Array<{ value: string; index: number }>,
  seenValues: Set<string>,
  day: number,
  month: number,
  rawYear: string | undefined,
  today: string,
  index: number,
) {
  const year = normalizeYear(rawYear, day, month, today);
  const value = isoFromParts(day, month, year);
  if (!value || seenValues.has(value)) return;
  seenValues.add(value);
  values.push({ value, index });
}

function extractDates(text: string, today: string) {
  const normalized = normalizeSearchText(text);
  const values: Array<{ value: string; index: number }> = [];
  const seenValues = new Set<string>();

  for (const match of normalized.matchAll(new RegExp(NUMERIC_DATE_SOURCE, "gu"))) {
    pushUniqueDate(values, seenValues, Number(match[1]), Number(match[2]), match[3], today, match.index ?? 0);
  }

  const condensedRange = new RegExp(
    `${TOKEN_START}(\\d{1,2})\\s*${RANGE_SEPARATOR}\\s*(\\d{1,2})\\s+(?:του\\s+)?(${MONTH_PATTERN})(?:\\s+(\\d{2,4}))?${TOKEN_END}`,
    "giu",
  );
  for (const match of normalized.matchAll(condensedRange)) {
    const month = MONTH_LOOKUP.get(match[3]) || 0;
    const index = match.index ?? 0;
    const firstYear = normalizeYear(match[4], Number(match[1]), month, today);
    const secondYear = match[4] ? firstYear : firstYear;
    const first = isoFromParts(Number(match[1]), month, firstYear);
    const second = isoFromParts(Number(match[2]), month, secondYear);
    if (first && !seenValues.has(first)) {
      seenValues.add(first);
      values.push({ value: first, index });
    }
    if (second && !seenValues.has(second)) {
      seenValues.add(second);
      values.push({ value: second, index: index + 1 });
    }
  }

  const monthFirstRange = new RegExp(
    `${TOKEN_START}(${MONTH_PATTERN})\\s+(\\d{1,2})\\s*${RANGE_SEPARATOR}\\s*(\\d{1,2})(?:,?\\s+(\\d{2,4}))?${TOKEN_END}`,
    "giu",
  );
  for (const match of normalized.matchAll(monthFirstRange)) {
    const month = MONTH_LOOKUP.get(match[1]) || 0;
    const index = match.index ?? 0;
    const year = normalizeYear(match[4], Number(match[2]), month, today);
    const first = isoFromParts(Number(match[2]), month, year);
    const second = isoFromParts(Number(match[3]), month, year);
    if (first && !seenValues.has(first)) {
      seenValues.add(first);
      values.push({ value: first, index });
    }
    if (second && !seenValues.has(second)) {
      seenValues.add(second);
      values.push({ value: second, index: index + 1 });
    }
  }

  const namedDayFirst = new RegExp(
    `${TOKEN_START}(\\d{1,2})\\.?\\s+(?:του\\s+)?(${MONTH_PATTERN})(?:\\s+(\\d{2,4}))?${TOKEN_END}`,
    "giu",
  );
  for (const match of normalized.matchAll(namedDayFirst)) {
    pushUniqueDate(values, seenValues, Number(match[1]), MONTH_LOOKUP.get(match[2]) || 0, match[3], today, match.index ?? 0);
  }

  const namedMonthFirst = new RegExp(
    `${TOKEN_START}(${MONTH_PATTERN})\\s+(\\d{1,2})(?:,?\\s+(\\d{2,4}))?${TOKEN_END}`,
    "giu",
  );
  for (const match of normalized.matchAll(namedMonthFirst)) {
    pushUniqueDate(values, seenValues, Number(match[2]), MONTH_LOOKUP.get(match[1]) || 0, match[3], today, match.index ?? 0);
  }

  return values.sort((left, right) => left.index - right.index);
}

function numberBeforeWords(text: string, words: RegExp, normalizedWordSource: string, max: number) {
  const digitMatch = text.match(new RegExp(`\\b(\\d{1,2})\\s*(?:${words.source})`, "iu"));
  if (digitMatch) {
    const value = Number(digitMatch[1]);
    if (Number.isInteger(value) && value >= 1 && value <= max) return value;
  }

  const normalized = normalizeSearchText(text);
  for (const [value, aliases] of NUMBER_WORDS) {
    if (value > max) continue;
    for (const alias of aliases) {
      const pattern = new RegExp(
        `${TOKEN_START}${escapeRegExp(normalizeSearchText(alias))}\\s*(?:${normalizedWordSource})${TOKEN_END}`,
        "iu",
      );
      if (pattern.test(normalized)) return value;
    }
  }
  return null;
}

function matchedPreferences(text: string) {
  return PREFERENCE_PATTERNS
    .filter(([, pattern]) => pattern.test(text))
    .map(([preference]) => preference);
}

function preferenceUpdateFromText(
  text: string,
  current: readonly RoomFinderPreference[],
): { recognized: boolean; preferences: RoomFinderPreference[] } {
  const matches = matchedPreferences(text);
  const removal = PREFERENCE_REMOVAL_WORDS.test(text);

  if (GENERIC_PREFERENCE_CLEAR.test(text) && matches.length === 0) {
    return { recognized: true, preferences: [] };
  }

  if (removal) {
    if (matches.length === 1) {
      return { recognized: true, preferences: current.filter(preference => preference !== matches[0]) };
    }
    return { recognized: false, preferences: [...current] };
  }

  if (PREFERENCE_QUESTION.test(text) && !PREFERENCE_INTENT.test(text)) {
    return { recognized: false, preferences: [...current] };
  }

  if (!matches.length) return { recognized: false, preferences: [...current] };
  return { recognized: true, preferences: Array.from(new Set([...current, ...matches])) };
}

function uniqueActions(actions: RoomFinderAction[]) {
  const seen = new Set<string>();
  return actions.filter(action => {
    const key = JSON.stringify(action);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function hasCoreBookingActions(command: RoomFinderCommand | null | undefined) {
  return Boolean(command?.actions.some(action =>
    action.type === "set_stay_dates"
    || action.type === "set_room_count"
    || action.type === "set_guest_count"
    || action.type === "restart_search",
  ));
}

function hasNamedMonth(text: string) {
  return new RegExp(`${TOKEN_START}(?:${MONTH_PATTERN})${TOKEN_END}`, "iu").test(normalizeSearchText(text));
}

export function canUseDeterministicCommandDirectly(
  message: string,
  context: RoomFinderConversationContext,
  command: RoomFinderCommand | null | undefined,
) {
  if (!command?.actions.length) return false;
  if (command.actions.some(action => action.type === "restart_search")) return true;

  const hasDateAction = command.actions.some(action =>
    action.type === "set_stay_dates" && Boolean(action.checkin || action.checkout || action.nights),
  );
  const hasNightAction = command.actions.some(action => action.type === "set_stay_dates" && Boolean(action.nights));
  const hasRoomAction = command.actions.some(action => action.type === "set_room_count" && action.roomCount != null);
  const hasGuestAction = command.actions.some(action => action.type === "set_guest_count" && (action.totalGuests != null || action.guests != null));
  const hasPreferenceAction = command.actions.some(action => action.type === "set_preferences");

  const mentionsDate = NUMERIC_DATE_HINT.test(normalizeSearchText(message))
    || hasNamedMonth(message)
    || CHECKIN_WORDS.test(message)
    || CHECKOUT_WORDS.test(message);
  const mentionsNights = NIGHT_WORDS.test(message);
  const mentionsRoom = ROOM_WORDS.test(message);
  const mentionsGuests = GUEST_WORDS.test(message) || COMPLEX_GUEST_HINT.test(message);

  if (mentionsDate && !hasDateAction) return false;
  if (mentionsNights && !hasNightAction && !command.actions.some(action => action.checkout)) return false;
  if (mentionsRoom && !hasRoomAction) return false;
  if (mentionsGuests && !hasGuestAction) return false;

  if (hasPreferenceAction && !hasCoreBookingActions(command)) return true;
  if (hasCoreBookingActions(command)) return true;

  const currentStep = context.currentStep;
  if (currentStep === "checkin") return hasDateAction;
  if (currentStep === "checkout") return hasDateAction;
  if (currentStep === "rooms") return hasRoomAction;
  if (currentStep === "guests") return hasGuestAction;
  return false;
}

export function fallbackRoomFinderCommand(
  message: string,
  context: RoomFinderConversationContext = {},
): RoomFinderCommand | null {
  const text = message.trim();
  if (!text) return null;

  const language = context.language || "en";
  if (RESTART_WORDS.test(text)) {
    return { language, replyMode: "execute", actions: [{ type: "restart_search" }] };
  }

  const today = todayInAthensIso();
  const parsedDates = extractDates(text, today);
  const dates = parsedDates.some(date => date.value < today) ? [] : parsedDates;
  const actions: RoomFinderAction[] = [];

  if (dates.length >= 2 && dates[1].value > dates[0].value) {
    actions.push({ type: "set_stay_dates", checkin: dates[0].value, checkout: dates[1].value });
  } else if (dates.length === 1) {
    const value = dates[0].value;
    if (CHECKOUT_WORDS.test(text) || context.currentStep === "checkout") {
      actions.push({ type: "set_stay_dates", checkout: value });
    } else if (CHECKIN_WORDS.test(text) || context.currentStep === "checkin") {
      actions.push({ type: "set_stay_dates", checkin: value });
    }
  }

  const hasExplicitCheckout = actions.some(action => Boolean(action.checkout));
  const nights = numberBeforeWords(text, NIGHT_WORDS, NIGHT_WORD_SOURCE, 60);
  if (nights && !hasExplicitCheckout) {
    actions.push({ type: "set_stay_dates", nights });
  }

  const roomCount = numberBeforeWords(text, ROOM_WORDS, ROOM_WORD_SOURCE, 99);
  if (roomCount) {
    actions.push({ type: "set_room_count", roomCount });
  } else if (context.currentStep === "rooms" && /^\s*\d{1,2}\s*$/.test(text)) {
    const value = Number(text);
    if (value >= 1 && value <= 99) actions.push({ type: "set_room_count", roomCount: value });
  }

  const explicitGuests = numberBeforeWords(text, GUEST_WORDS, GUEST_WORD_SOURCE, 15);
  if (explicitGuests) {
    if (context.currentStep === "guests" && context.currentRoom && explicitGuests <= 5) {
      actions.push({ type: "set_guest_count", guestRoom: context.currentRoom, guests: explicitGuests });
    } else {
      actions.push({ type: "set_guest_count", totalGuests: explicitGuests });
    }
  } else if (COMPLEX_GUEST_HINT.test(text)) {
    const adults = numberBeforeWords(text, ADULT_WORDS, ADULT_WORD_SOURCE, 15);
    const children = numberBeforeWords(text, CHILD_WORDS, CHILD_WORD_SOURCE, 15);
    if (adults != null && children != null && adults + children >= 1 && adults + children <= 15) {
      actions.push({ type: "set_guest_count", totalGuests: adults + children });
    }
  } else if (context.currentStep === "guests" && /^\s*[1-5]\s*$/.test(text)) {
    const guests = Number(text);
    actions.push(context.currentRoom
      ? { type: "set_guest_count", guestRoom: context.currentRoom, guests }
      : { type: "set_guest_count", totalGuests: guests });
  }

  const preferenceUpdate = preferenceUpdateFromText(text, context.preferences || []);
  if (preferenceUpdate.recognized) {
    actions.push({ type: "set_preferences", preferences: preferenceUpdate.preferences });
  }

  const normalized = uniqueActions(actions);
  if (!normalized.length) return null;
  return { language, replyMode: "execute", actions: normalized };
}
