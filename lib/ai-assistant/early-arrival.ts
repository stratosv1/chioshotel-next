/**
 * Ref 13: a guest arriving in the early hours ("Ξημερώματα Τρίτης 08/09",
 * "arriving at 3am on the 8th") needs the room from the night before, or
 * they wait until the 14:00 check-in. The Room Finder asks instead of
 * silently booking the wrong night.
 */

const EARLY_WORDS = /(ξημερ[ώω]ματ|πολ[ύυ]\s+νωρ[ίι]ς\s+το\s+πρω[ίι]|νωρ[ίι]ς\s+το\s+πρω[ίι]|πρω[ίι]\s+πρω[ίι]|μετ[άα]\s+τα\s+μεσ[άα]νυχτα|early\s+(?:in\s+the\s+)?morning|in\s+the\s+early\s+hours|after\s+midnight|in\s+the\s+middle\s+of\s+the\s+night|frühmorgens|früh\s+am\s+morgen|nach\s+mitternacht|tôt\s+le\s+matin|très\s+tôt|après\s+minuit|all['’]alba|di\s+primo\s+mattino|dopo\s+mezzanotte|de\s+madrugada|muy\s+temprano|sabah\s+erken|gece\s+yarısından\s+sonra)/iu;
// A clock time between 00:00 and 06:59 tied to the arrival ("at 3:30",
// "στις 04:00", "5am", "3 π.μ.").
const EARLY_TIME = /(?:στις|at|um|à|alle|a\s+las|saat|ώρα|arriv\w*|φτ[άα]ν\w*|άφιξη|αφιξη|ankunft|arrivée|arrivo|llegada|varış)\s*0?[0-6][:.][0-5]\d\b|\b0?[1-6]\s*(?:am|a\.m\.|π\.?\s?μ\.?|uhr\s+morgens|du\s+matin|di\s+mattina|de\s+la\s+mañana)/iu;

export function mentionsEarlyMorningArrival(text: string) {
  return EARLY_WORDS.test(text) || EARLY_TIME.test(text);
}

/** The night before the stated arrival day (YYYY-MM-DD), or "". */
export function nightBefore(checkin: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkin)) return "";
  const date = new Date(`${checkin}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}
