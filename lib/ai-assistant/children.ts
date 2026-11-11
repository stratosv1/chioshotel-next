/**
 * Ref 14: children in a guest message ("2 ενήλικες και 2 παιδιά 4 και 6
 * ετών", "2 adults, 2 kids aged 4 and 6", "we have a baby") so reception sees
 * the ages and the guest gets the verified cot / extra-bed rule. The guest
 * counts themselves are still handled by the booking flow.
 */

export type ChildrenInfo = {
  /** Number of children when stated ("2 παιδιά"), else null. */
  count: number | null;
  /** Stated ages in years (infants as 0). */
  ages: number[];
  /** A baby / infant is mentioned (cot rule applies). */
  infant: boolean;
};

const CHILD_WORDS = /(παιδ[ιί]|παιδάκ|ανήλικ|μωρ[όοά]|βρέφ|μπέμπ|child|children|kids?\b|toddler|baby|babies|infant|kind(?:er)?\b|kleinkind|enfants?|bébé|bambin[io]|neonat|niñ[oa]s?|beb[ée]s?|çocuk|bebek)/iu;
const INFANT_WORDS = /(μωρ[όοά]|βρέφ|μπέμπ|baby|babies|infant|kleinkind|bébé|neonat|beb[ée]s?|bebek|(?:\d{1,2})\s*(?:μην[ώω]ν|months?|monate?n?|mois|mesi|meses|aylık))/iu;

const NUMBER_WORDS: Record<string, number> = {
  ένα: 1, ενα: 1, μία: 1, μια: 1, δύο: 2, δυο: 2, τρία: 3, τρια: 3, τέσσερα: 4, τεσσερα: 4,
  one: 1, two: 2, three: 3, four: 4, ein: 1, eins: 1, zwei: 2, drei: 3, vier: 4,
  un: 1, une: 1, deux: 2, trois: 3, quatre: 4, uno: 1, una: 1, due: 2, tre: 3, quattro: 4,
  dos: 2, tres: 3, cuatro: 4, bir: 1, iki: 2, üç: 3, dört: 4,
};

const COUNT_BEFORE_CHILD = /(\d{1,2}|ένα|ενα|μία|μια|δύο|δυο|τρία|τρια|τέσσερα|τεσσερα|one|two|three|four|ein|eins|zwei|drei|vier|un|une|deux|trois|quatre|uno|una|due|tre|quattro|dos|tres|cuatro|bir|iki|üç|dört)\s+(?:μικρ[άα]\s+)?(?:παιδ|child|kids?\b|kind(?:er)?\b|enfants?|bambin|niñ|çocuk)/iu;

// "4 και 6 ετών", "aged 4 and 6", "4 & 6 years old", "ages 4, 6", "(4, 6)",
// "3 χρονών", "8 Jahre", "5 ans", "7 anni", "6 años", "4 yaşında".
const AGE_LIST = /(?:ηλικ[ίι]ας|ηλικ[ίι]ες|aged?|ages|im\s+alter\s+von|âgés?\s+de|di|de|età|edad(?:es)?)?\s*((?:\d{1,2}\s*(?:,|και|κ\.?|&|and|und|et|e|y|ve|-)\s*)*\d{1,2})\s*(?:ετ[ώω]ν|χρον[ώω]ν|χρονων|years?(?:\s+old)?|yrs?|jahre?n?|ans|anni|años|yaşında|yaş)/iu;
const AGED_LIST = /(?:aged|ages|ηλικ[ίι]ας|ηλικ[ίι]ες)\s+((?:\d{1,2}\s*(?:,|και|κ\.?|&|and|-)\s*)*\d{1,2})/iu;
const PAREN_AGES = /(?:παιδ\w*|kids?|children|kind(?:er)?|enfants?|bambini|niños|çocuk\w*)\s*\(\s*((?:\d{1,2}\s*(?:,|&|and|και)\s*)*\d{1,2})\s*\)/iu;

function numbersIn(text: string) {
  return (text.match(/\d{1,2}/g) || []).map(Number).filter(age => age >= 0 && age <= 17);
}

export function extractChildren(text: string): ChildrenInfo | null {
  if (!CHILD_WORDS.test(text)) return null;
  let ages: number[] = [];
  const list = text.match(AGE_LIST) || text.match(AGED_LIST) || text.match(PAREN_AGES);
  if (list) ages = numbersIn(list[1]);

  const months = text.match(/(\d{1,2})\s*(?:μην[ώω]ν|months?|monate?n?|mois|mesi|meses|aylık)/iu);
  if (months && Number(months[1]) < 24 && !ages.includes(0)) ages.push(0);

  const countMatch = text.match(COUNT_BEFORE_CHILD);
  let count: number | null = null;
  if (countMatch) {
    const raw = countMatch[1].toLowerCase();
    count = /\d/.test(raw) ? Number(raw) : NUMBER_WORDS[raw] ?? null;
  }
  if (count === null && ages.length) count = ages.length;

  const infant = INFANT_WORDS.test(text) || ages.some(age => age < 2);
  return { count, ages, infant };
}
