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

const MONTH_ALIASES: Record<string, number> = {
  january: 1, januar: 1, janvier: 1, gennaio: 1, enero: 1, ocak: 1, ιανουαριος: 1, ιανουαριου: 1,
  february: 2, februar: 2, fevrier: 2, febbraio: 2, febrero: 2, subat: 2, φεβρουαριος: 2, φεβρουαριου: 2,
  march: 3, marz: 3, mars: 3, marzo: 3, mart: 3, μαρτιος: 3, μαρτιου: 3,
  april: 4, avril: 4, aprile: 4, abril: 4, nisan: 4, απριλιος: 4, απριλιου: 4,
  may: 5, mai: 5, maggio: 5, mayo: 5, mayis: 5, μαιος: 5, μαιου: 5,
  june: 6, juni: 6, juin: 6, giugno: 6, junio: 6, haziran: 6, ιουνιος: 6, ιουνιου: 6,
  july: 7, juli: 7, juillet: 7, luglio: 7, julio: 7, temmuz: 7, ιουλιος: 7, ιουλιου: 7,
  august: 8, aout: 8, agosto: 8, agustos: 8, αυγουστος: 8, αυγουστου: 8,
  september: 9, septembre: 9, settembre: 9, septiembre: 9, eylul: 9, σεπτεμβριος: 9, σεπτεμβριου: 9,
  october: 10, oktober: 10, octobre: 10, ottobre: 10, octubre: 10, ekim: 10, οκτωβριος: 10, οκτωβριου: 10,
  november: 11, novembre: 11, noviembre: 11, kasim: 11, νοεμβριος: 11, νοεμβριου: 11,
  december: 12, dezember: 12, decembre: 12, dicembre: 12, diciembre: 12, aralik: 12, δεκεμβριος: 12, δεκεμβριου: 12,
};

const MONTH_PATTERN = Object.keys(MONTH_ALIASES)
  .sort((left, right) => right.length - left.length)
  .join("|");

const DESTINATION_PATTERNS = [
  /(?:μειν\p{L}*|διαμον\p{L}*)\s+(?:(?:στον|στην|στο|στη|στα)\s+)+([\p{L}][\p{L}'-]*(?:\s+[\p{L}][\p{L}'-]*){0,3}?)(?=\s+(?:για|απο|στις|\d)|[,.!?]|$)/iu,
  /(?:stay(?:ing)?|accommodation)\s+(?:in|at)\s+([\p{L}][\p{L}'-]*(?:\s+[\p{L}][\p{L}'-]*){0,3}?)(?=\s+(?:for|from|between|on|\d)|[,.!?]|$)/iu,
  /(?:ubernachten|bleiben|wohnen)\s+(?:in|im)\s+([\p{L}][\p{L}'-]*(?:\s+[\p{L}][\p{L}'-]*){0,3}?)(?=\s+(?:fur|vom|von|zwischen|\d)|[,.!?]|$)/iu,
  /(?:in|im)\s+([\p{L}][\p{L}'-]*(?:\s+[\p{L}][\p{L}'-]*){0,3}?)(?=\s+(?:ubernachten|bleiben|wohnen|fur|vom|von|zwischen|\d)|[,.!?]|$)/iu,
  /(?:sejourner|rester|loger)\s+(?:a|au|aux|dans)\s+([\p{L}][\p{L}'-]*(?:\s+[\p{L}][\p{L}'-]*){0,3}?)(?=\s+(?:pour|du|de|entre|\d)|[,.!?]|$)/iu,
  /(?:soggiornare|restare|alloggiare)\s+(?:a|ad|nel|nella|nei|nelle)\s+([\p{L}][\p{L}'-]*(?:\s+[\p{L}][\p{L}'-]*){0,3}?)(?=\s+(?:per|dal|da|tra|\d)|[,.!?]|$)/iu,
  /(?:alojarnos|alojarse|quedarnos|quedarse|hospedarnos|hospedarse)\s+en\s+([\p{L}][\p{L}'-]*(?:\s+[\p{L}][\p{L}'-]*){0,3}?)(?=\s+(?:por|del|desde|entre|\d)|[,.!?]|$)/iu,
  /([\p{L}][\p{L}'-]*(?:\s+[\p{L}][\p{L}'-]*){0,3}?)(?:'da|'de|da|de)\s+(?:kalmak|konaklamak|kalacagiz|konaklayacagiz)/iu,
];

const ROOM_WORDS = /(δωμάτι(?:ο|α)|rooms?|zimmer|chambres?|camere?|habitaciones?|odas?)/iu;
const GUEST_WORDS = /(άτομα|ατομα|επισκέπτες|επισκεπτες|guests?|people|persons?|gäste|personen|personnes?|persone|personas?|kişi)/iu;
const RESTART_WORDS = /(από την αρχή|απο την αρχη|νέα αναζήτηση|νεα αναζητηση|start over|new search|restart|neu beginnen|nouvelle recherche|ricomincia|nueva búsqueda|yeniden başla|yeni arama)/iu;
const CONTACT_INTENT_WORDS = /(θα\s+(?:σας\s+)?(?:καλέσω|τηλεφωνήσω|τηλεφωνησω|επικοινωνήσω|επικοινωνησω|γράψω|γραψω|στείλω|στειλω)|θα\s+πάρω\s+τηλέφωνο|i(?:'|’)ll\s+(?:call|contact|message|write)|i\s+will\s+(?:call|contact|message|write)|i(?:'|’)ll\s+get\s+in\s+touch|ich\s+(?:rufe|melde)|werde\s+(?:anrufen|kontaktieren|schreiben)|je\s+vais\s+(?:appeler|contacter|écrire)|j(?:'|’)appellerai|je\s+vous\s+contacterai|(?:vi\s+)?(?:chiamerò|contatterò|scriverò)|voy\s+a\s+(?:llamar|contactar|escribir)|(?:les\s+)?(?:llamaré|contactaré|escribiré)|(?:sizi\s+)?arayacağım|iletişime\s+geçeceğim|mesaj\s+atacağım|yazacağım)/iu;
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

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/\s+/g, " ")
    .trim();
}

function restoreDestination(text: string, normalizedDestination: string) {
  const words = [...text.matchAll(/[\p{L}][\p{L}'’-]*/gu)];
  for (let start = 0; start < words.length; start += 1) {
    for (let end = start; end < Math.min(words.length, start + 4); end += 1) {
      const firstIndex = words[start].index ?? 0;
      const lastIndex = (words[end].index ?? 0) + words[end][0].length;
      const candidate = text.slice(firstIndex, lastIndex);
      if (normalizeText(candidate) === normalizedDestination) return candidate;
    }
  }
  return normalizedDestination.charAt(0).toLocaleUpperCase() + normalizedDestination.slice(1);
}

function destinationKind(destination: string): "property" | "island" | "other" {
  const normalized = normalizeText(destination);
  if (/(?:^|\s)(?:voulamandis|καμπο(?:ς|υ|ν)?|kampos|kambos|campos)(?:\s|$)/u.test(normalized)) return "property";
  if (/^(?:η\s+)?(?:χιος|chios(?:\s+island)?|island\s+of\s+chios|sakiz(?:\s+adasi)?|scio)$/u.test(normalized)) return "island";
  return "other";
}

function extractStayDestination(text: string, context: RoomFinderConversationContext) {
  const normalized = normalizeText(text);
  for (const pattern of DESTINATION_PATTERNS) {
    const match = normalized.match(pattern);
    const extracted = match?.[1]?.trim();
    if (extracted) return restoreDestination(text, extracted);
  }

  if (context.currentStep === "destination") {
    const knownDestination = normalized.match(/(?:voulamandis(?:\s+house)?|καμπο(?:ς|υ|ν)?|kampos|kambos|campos|χιος|chios(?:\s+island)?|sakiz(?:\s+adasi)?|scio)/u)?.[0];
    if (knownDestination) return restoreDestination(text, knownDestination);
    if (/^[\p{L}\s'’.-]{2,80}$/u.test(text)) {
      return text.replace(/[.!?]+$/g, "").trim();
    }
  }

  return "";
}

function extractNamedDates(text: string, today: string) {
  const normalized = normalizeText(text);
  const values: Array<{ value: string; index: number }> = [];
  const occupied: Array<[number, number]> = [];
  const rangePattern = new RegExp(
    `\\b(\\d{1,2})\\.?\\s*(?:-|–|—|εως|to|bis|au|al|hasta|a|ile)\\s*(\\d{1,2})\\.?\\s*(?:de\\s+)?(${MONTH_PATTERN})(?:\\s+(?:de\\s+)?(\\d{4}))?\\b`,
    "giu",
  );

  for (const match of normalized.matchAll(rangePattern)) {
    const month = MONTH_ALIASES[match[3]];
    const firstDay = Number(match[1]);
    const secondDay = Number(match[2]);
    const year = normalizeYear(match[4], firstDay, month, today);
    const checkin = isoFromParts(firstDay, month, year);
    const checkout = isoFromParts(secondDay, month, year);
    if (checkin && checkout) {
      const index = match.index ?? 0;
      values.push({ value: checkin, index }, { value: checkout, index: index + match[0].length - 1 });
      occupied.push([index, index + match[0].length]);
    }
  }

  const singlePattern = new RegExp(
    `\\b(\\d{1,2})\\.?\\s+(?:de\\s+)?(${MONTH_PATTERN})(?:\\s+(?:de\\s+)?(\\d{4}))?\\b`,
    "giu",
  );
  for (const match of normalized.matchAll(singlePattern)) {
    const index = match.index ?? 0;
    if (occupied.some(([start, end]) => index >= start && index < end)) continue;
    const day = Number(match[1]);
    const month = MONTH_ALIASES[match[2]];
    const year = normalizeYear(match[3], day, month, today);
    const value = isoFromParts(day, month, year);
    if (value) values.push({ value, index });
  }

  return values;
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
  values.push(...extractNamedDates(text, today));
  return values
    .sort((left, right) => left.index - right.index)
    .filter((date, index, dates) => index === 0 || date.value !== dates[index - 1].value || date.index !== dates[index - 1].index);
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
  if (CONTACT_INTENT_WORDS.test(text)) {
    return { language, replyMode: "execute", actions: [{ type: "acknowledge_contact" }] };
  }

  const today = todayInAthensIso();
  const parsedDates = extractDates(text, today);
  // A rescue parser must never reinterpret a partly past range as a different future stay.
  const dates = parsedDates.some(date => date.value < today) ? [] : parsedDates;
  const actions: RoomFinderAction[] = [];

  const stayDestination = extractStayDestination(text, context);
  if (stayDestination) {
    actions.push({
      type: "set_stay_destination",
      destination: stayDestination,
      destinationKind: destinationKind(stayDestination),
    });
  }

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
