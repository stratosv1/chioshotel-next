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

const DATE_TOKEN = /\b(\d{1,2})[\/.\-](\d{1,2})(?:[\/.\-](\d{2,4}))?\b/g;

const ROOM_WORDS = /(δωμάτι(?:ο|α)|rooms?|zimmer|chambres?|camere?|habitaciones?|odas?)/iu;
const GUEST_WORDS = /(άτομα|ατομα|επισκέπτες|επισκεπτες|guests?|people|persons?|gäste|personen|personnes?|persone|personas?|kişi)/iu;
const RESTART_WORDS = /(από την αρχή|απο την αρχη|νέα αναζήτηση|νεα αναζητηση|start over|new search|restart|neu beginnen|nouvelle recherche|ricomincia|nueva búsqueda|yeniden başla|yeni arama)/iu;
const CHECKIN_WORDS = /(check\s*-?\s*in|άφιξ|αφιξ|arrival|ankunft|arrivée|arrivo|llegada|giriş)/iu;
const CHECKOUT_WORDS = /(check\s*-?\s*out|αναχώρ|αναχωρ|departure|abreise|départ|partenza|salida|çıkış)/iu;
const PREFERENCE_REMOVAL_WORDS = /(δεν\s+(?:με\s+)?νοιάζ|δεν\s+θέλω\s+πια|όχι\s+πια|χωρίς\s+προτίμηση|don['’]?t\s+care|do\s+not\s+care|no\s+longer|don['’]?t\s+want|do\s+not\s+want|nicht\s+mehr|nicht\s+wichtig|peu\s+importe|ne\s+veux\s+plus|non\s+importa|non\s+voglio\s+più|ya\s+no|no\s+me\s+importa|no\s+quiero|artık\s+önemli\s+değil|istemiyorum)/iu;

const PREFERENCE_PATTERNS: Array<[RoomFinderPreference, RegExp]> = [
  ["no_stairs", /(χωρίς σκάλ|χωρις σκαλ|no stairs|without stairs|keine treppen|sans escalier|senza scale|sin escaleras|merdivensiz)/iu],
  ["ground_floor", /(ισόγει|ισογει|ground floor|erdgeschoss|rez-de-chaussée|rez de chaussée|piano terra|planta baja|zemin kat)/iu],
  ["kitchen", /(κουζίν|κουζιν|kitchen|kitchenette|küche|küchenzeile|cuisine|angolo cottura|cucina|cocina|mutfak)/iu],
  ["balcony", /(μπαλκόν|μπαλκον|balcony|balkon|balcon|balcone|balcón)/iu],
  ["garden", /(κήπ|κηπ|αυλή|αυλη|garden|courtyard|garten|jardin|giardino|jardín|bahçe)/iu],
  ["budget", /(οικονομικ|φθην|budget|economy|cheap|preisgünst|économ|economica|económ|uygun fiyat|ekonomik)/iu],
  ["family", /(οικογέν|οικογεν|family|familie|famille|famiglia|familia|aile)/iu],
];

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

function extractDates(text: string, today: string) {
  const values: Array<{ value: string; index: number }> = [];
  for (const match of text.matchAll(DATE_TOKEN)) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = normalizeYear(match[3], day, month, today);
    const value = isoFromParts(day, month, year);
    if (value) values.push({ value, index: match.index ?? 0 });
  }
  return values;
}

function numberBeforeWords(text: string, words: RegExp, max: number) {
  const source = words.source;
  const match = text.match(new RegExp(`\\b(\\d{1,2})\\s*(?:${source})`, "iu"));
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isInteger(value) && value >= 1 && value <= max ? value : null;
}

function preferencesFromText(text: string) {
  if (PREFERENCE_REMOVAL_WORDS.test(text)) return [];
  return PREFERENCE_PATTERNS
    .filter(([, pattern]) => pattern.test(text))
    .map(([preference]) => preference);
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
  // A rescue parser must never reinterpret a partly past range as a different future stay.
  const dates = parsedDates.some(date => date.value < today) ? [] : parsedDates;
  const actions: RoomFinderAction[] = [];

  if (dates.length >= 2) {
    actions.push({ type: "set_stay_dates", checkin: dates[0].value, checkout: dates[1].value });
  } else if (dates.length === 1) {
    const value = dates[0].value;
    if (CHECKOUT_WORDS.test(text) || context.currentStep === "checkout") {
      actions.push({ type: "set_stay_dates", checkout: value });
    } else if (CHECKIN_WORDS.test(text) || context.currentStep === "checkin") {
      actions.push({ type: "set_stay_dates", checkin: value });
    }
  }

  const roomCount = numberBeforeWords(text, ROOM_WORDS, 99);
  if (roomCount) {
    actions.push({ type: "set_room_count", roomCount });
  } else if (context.currentStep === "rooms" && /^\s*\d{1,2}\s*$/.test(text)) {
    const value = Number(text);
    if (value >= 1 && value <= 99) actions.push({ type: "set_room_count", roomCount: value });
  }

  const explicitGuests = numberBeforeWords(text, GUEST_WORDS, 15);
  if (explicitGuests) {
    if (context.currentStep === "guests" && context.currentRoom && explicitGuests <= 5) {
      actions.push({ type: "set_guest_count", guestRoom: context.currentRoom, guests: explicitGuests });
    } else {
      actions.push({ type: "set_guest_count", totalGuests: explicitGuests });
    }
  } else if (context.currentStep === "guests" && /^\s*[1-5]\s*$/.test(text)) {
    const guests = Number(text);
    actions.push(context.currentRoom
      ? { type: "set_guest_count", guestRoom: context.currentRoom, guests }
      : { type: "set_guest_count", totalGuests: guests });
  }

  const preferences = preferencesFromText(text);
  if (preferences.length) {
    const merged = Array.from(new Set([...(context.preferences || []), ...preferences]));
    actions.push({ type: "set_preferences", preferences: merged });
  }

  const normalized = uniqueActions(actions);
  if (!normalized.length) return null;
  return { language, replyMode: "execute", actions: normalized };
}
