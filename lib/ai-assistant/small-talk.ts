/**
 * Ref 16: a message that is only thanks, a greeting or a goodbye gets a
 * natural reply instead of "nothing changed". Ref 17: a leading "no" that
 * introduces a full replacement ("Όχι 11/9 με 13/9. 2 άτομα") is a
 * correction, not something to clarify.
 */

export type SmallTalk = "thanks" | "greeting" | "goodbye";

const THANKS = /^\s*(?:(?:πολύ\s+|πολυ\s+)?ευχαριστ[ώω](?:\s+πολύ|\s+πολυ)?(?:\s+για\s+(?:όλα|ολα|τη\s+βοήθεια))?|ευχαριστούμε(?:\s+πολύ)?|σας\s+ευχαριστ[ώω](?:\s+πολύ)?|thanks?(?:\s+a\s+lot|\s+so\s+much)?|thank\s+you(?:\s+(?:so|very)\s+much)?|thx|ty|danke(?:\s+schön|\s+sehr)?|vielen\s+dank|merci(?:\s+beaucoup)?|grazie(?:\s+mille)?|gracias|muchas\s+gracias|teşekkür(?:ler|\s+ederim)?|sağ\s?ol(?:un)?)\s*[.!😊🙏👍❤️]*\s*$/iu;
const GREETING = /^\s*(?:γει[αά]\s*(?:σας|σου)?|γεια|καλημέρα|καλημερα|καλησπέρα|καλησπερα|χαίρετε|χαιρετε|hi|hello|hey|good\s+(?:morning|afternoon|evening)|hallo|guten\s+(?:tag|morgen|abend)|bonjour|bonsoir|salut|ciao|buongiorno|buonasera|hola|buenos\s+días|buenas\s+tardes|merhaba|selam|iyi\s+günler)(?:\s+σας)?\s*[.!,😊👋]*\s*$/iu;
const GOODBYE = /^\s*(?:αντίο|αντιο|καληνύχτα|καληνυχτα|τα\s+λέμε|τα\s+λεμε|bye|goodbye|good\s+night|see\s+you|tschüss|auf\s+wiedersehen|au\s+revoir|bonne\s+nuit|arrivederci|buonanotte|adiós|adios|hasta\s+luego|hoşça\s+kal|görüşürüz|iyi\s+geceler)\s*[.!😊👋]*\s*$/iu;

export function detectSmallTalk(text: string): SmallTalk | null {
  if (THANKS.test(text)) return "thanks";
  if (GOODBYE.test(text)) return "goodbye";
  if (GREETING.test(text)) return "greeting";
  return null;
}

const LEADING_NO = /^\s*(?:όχι|οχι|no|nope|nein|non|hayır|hayir)\s*[,.!:-]*\s+/iu;
const DATE = /\b\d{1,2}\s*[\/.\-]\s*\d{1,2}(?:\s*[\/.\-]\s*\d{2,4})?\b/gu;

/**
 * "Όχι 11/9 με 13/9. 2 άτομα" → "11/9 με 13/9. 2 άτομα": the "no" only
 * introduces the corrected stay. Only applied when the rest holds a full date
 * range (two dates), so "όχι 13/9, 14/9" style edits still go to the interpreter as is.
 */
export function stripCorrectionNo(text: string) {
  if (!LEADING_NO.test(text)) return text;
  const rest = text.replace(LEADING_NO, "");
  const isRange = /(?:^|\s)(?:με|έως|εως|ως|μέχρι|μεχρι|to|until|till|bis|au|al|fino\s+al|hasta)(?:\s|$)|\d\s*[-–]\s*\d/iu.test(rest);
  return (rest.match(DATE) || []).length >= 2 && isRange ? rest : text;
}
