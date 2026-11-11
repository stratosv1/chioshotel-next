/**
 * Ref 12: the time a guest says they arrive ("Άφιξη 11/9 22:30 το βράδυ",
 * "we land at 10pm", "φτάνουμε στις 9 το βράδυ") is picked up so reception
 * gets it with the request, instead of chasing the guest for it later.
 * Dates such as 11/9 or 11.9 are never read as times.
 */

const CONTEXT = "(?:άφιξη|αφιξη|φτάν\\w*|φταν\\w*|ερχ[όο]μαστε|έρχομαι|ερχομαι|πτήση|πτηση|πλοίο|πλοιο|ferry|flight|land\\w*|arriv\\w*|ankunft|ankommen|komme\\w*|landen|arrivée|arrivons|arriverons|arrivo|arriviamo|arriveremo|llegada|llegamos|llegaremos|varış|varıyoruz|geliyoruz)";
const AT = "(?:στις|στη|γύρω\\s+στις|περίπου\\s+στις|at|around|about|approx\\.?|um|gegen|à|vers|alle|verso|a\\s+las|sobre\\s+las|saat)";

// 22:30 / 9:15 — a colon is always a time.
const COLON_TIME = /\b([01]?\d|2[0-3]):([0-5]\d)\b/u;
// 22.30 only next to an arrival word or "at"-word (otherwise it may be a date).
const DOT_TIME = new RegExp(`(?:${CONTEXT}|${AT})[^\\d]{0,24}\\b([01]?\\d|2[0-3])\\.([0-5]\\d)\\b`, "iu");
// 10pm / 10 p.m. / 9 μ.μ. / 9 π.μ.
const AMPM_TIME = /\b(1[0-2]|0?[1-9])(?:[:.]([0-5]\d))?\s*(am|a\.m\.|pm|p\.m\.|π\.?\s?μ\.?|μ\.?\s?μ\.?)(?![\p{L}])/iu;
// "στις 10 το βράδυ", "at 9 in the evening", "um 8 Uhr abends"
const PART_OF_DAY_TIME = new RegExp(
  `${AT}\\s*(1[0-2]|0?[1-9])(?:[:.]([0-5]\\d))?\\s*(?:η\\s+ώρα\\s+)?(το\\s+βρ[άα]δυ|το\\s+απ[όο]γευμα|το\\s+μεσημ[έε]ρι|το\\s+πρω[ίι]|in\\s+the\\s+(?:evening|afternoon|morning)|at\\s+night|uhr\\s+(?:abends|nachmittags|morgens)|abends|du\\s+soir|de\\s+l['’]après-midi|du\\s+matin|di\\s+sera|del\\s+pomeriggio|di\\s+mattina|de\\s+la\\s+(?:tarde|noche|mañana)|akşam|öğleden\\s+sonra|sabah)`,
  "iu",
);
// "at 18h", "à 18h30", "um 18 Uhr" with an arrival word.
const H_TIME = new RegExp(`(?:${CONTEXT}|${AT})[^\\d]{0,24}\\b([01]?\\d|2[0-3])\\s*(?:h|uhr)\\s*([0-5]\\d)?\\b`, "iu");

const EVENING = /(βρ[άα]δυ|απ[όο]γευμα|evening|afternoon|night|abends|nachmittags|soir|après-midi|sera|pomeriggio|tarde|noche|akşam|öğleden)/iu;
const NOON = /(μεσημ[έε]ρι)/iu;

function pad(hours: number, minutes: number) {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** The stated arrival time as "HH:MM", or "" when the message has none. */
export function extractArrivalTime(text: string): string {
  const colon = text.match(COLON_TIME);
  if (colon) {
    let hours = Number(colon[1]);
    const after = text.slice((colon.index || 0) + colon[0].length, (colon.index || 0) + colon[0].length + 24);
    if (hours < 12 && EVENING.test(after)) hours += 12;
    return pad(hours, Number(colon[2]));
  }

  const ampm = text.match(AMPM_TIME);
  if (ampm) {
    let hours = Number(ampm[1]) % 12;
    if (/^(pm|p\.m\.|μ)/iu.test(ampm[3])) hours += 12;
    return pad(hours, Number(ampm[2] || 0));
  }

  const partOfDay = text.match(PART_OF_DAY_TIME);
  if (partOfDay) {
    let hours = Number(partOfDay[1]);
    if (hours < 12 && EVENING.test(partOfDay[3])) hours += 12;
    if (hours < 12 && NOON.test(partOfDay[3]) && hours < 6) hours += 12;
    return pad(hours, Number(partOfDay[2] || 0));
  }

  const dot = text.match(DOT_TIME);
  if (dot) {
    let hours = Number(dot[1]);
    const after = text.slice((dot.index || 0) + dot[0].length, (dot.index || 0) + dot[0].length + 24);
    if (hours < 12 && EVENING.test(after)) hours += 12;
    return pad(hours, Number(dot[2]));
  }

  const h = text.match(H_TIME);
  if (h) return pad(Number(h[1]), Number(h[2] || 0));

  return "";
}
