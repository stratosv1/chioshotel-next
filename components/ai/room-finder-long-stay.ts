import type { RoomFinderLanguage } from "./room-finder-copy";

export type LongStayDiscountInfo = {
  nights: number;
  standardDirectDiscountPercent: number;
  totalDiscountPercent: number;
  extraDiscountPercent: number;
  eligible: boolean;
  nextTier: { nights: number; totalDiscountPercent: number } | null;
};

export async function fetchLongStayDiscount(checkin: string, checkout: string) {
  const query = new URLSearchParams({ checkin, checkout });
  // Optional notice: never let it hold up the conversation for long.
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10_000);
  let response: Response;
  try {
    response = await fetch(`/api/ai-room-finder/long-stay-discount?${query}`, { cache: "no-store", signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) return null;

  return {
    nights: Number(payload.nights || 0),
    standardDirectDiscountPercent: Number(payload.standardDirectDiscountPercent || 0),
    totalDiscountPercent: Number(payload.totalDiscountPercent || 0),
    extraDiscountPercent: Number(payload.extraDiscountPercent || 0),
    eligible: Boolean(payload.eligible),
    nextTier: payload.nextTier && Number(payload.nextTier.nights) > 0
      ? { nights: Number(payload.nextTier.nights), totalDiscountPercent: Number(payload.nextTier.totalDiscountPercent || 0) }
      : null,
  } satisfies LongStayDiscountInfo;
}

function percent(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export function longStayDiscountMessage(language: RoomFinderLanguage, info: LongStayDiscountInfo) {
  const total = percent(info.totalDiscountPercent);

  const messages: Record<RoomFinderLanguage, string> = {
    el: `✨ Για διαμονή ${info.nights} διανυκτερεύσεων, το Voulamandis House σας προσφέρει επιπλέον έκπτωση.\n🏷️ Στις διαθέσιμες επιλογές δωματίων που ακολουθούν, η τιμή θα υπολογιστεί αυτόματα με ${total}% έκπτωση.`,
    en: `✨ For a stay of ${info.nights} nights, Voulamandis House offers you an additional discount.\n🏷️ In the available room options below, the price will be calculated automatically with a ${total}% discount.`,
    de: `✨ Für einen Aufenthalt von ${info.nights} Nächten bietet Ihnen das Voulamandis House einen zusätzlichen Rabatt.\n🏷️ Bei den folgenden verfügbaren Zimmeroptionen wird der Preis automatisch mit ${total}% Rabatt berechnet.`,
    fr: `✨ Pour un séjour de ${info.nights} nuits, Voulamandis House vous offre une réduction supplémentaire.\n🏷️ Dans les options de chambres disponibles ci-dessous, le prix sera automatiquement calculé avec une réduction de ${total}%.`,
    it: `✨ Per un soggiorno di ${info.nights} notti, Voulamandis House vi offre uno sconto aggiuntivo.\n🏷️ Nelle opzioni di camere disponibili qui sotto, il prezzo sarà calcolato automaticamente con uno sconto del ${total}%.`,
    es: `✨ Para una estancia de ${info.nights} noches, Voulamandis House les ofrece un descuento adicional.\n🏷️ En las opciones de habitaciones disponibles que aparecen a continuación, el precio se calculará automáticamente con un ${total}% de descuento.`,
    tr: `✨ ${info.nights} gecelik konaklamanız için Voulamandis House size ek indirim sunuyor.\n🏷️ Aşağıdaki müsait oda seçeneklerinde fiyat otomatik olarak %${total} indirimli şekilde hesaplanacaktır.`,
  };

  return messages[language];
}

export type StayExtensionSuggestion = {
  checkin: string;
  checkout: string;
  nights: number;
  extraNights: number;
  // "later": check out later; "earlier": arrive earlier.
  direction: "later" | "earlier";
  fromPercent: number;
  toPercent: number;
  room: string;
  newTotal: number;
  // Price of the added night(s) for the same room, when it was in the results.
  extraCost: number | null;
  stay: string;
};

// Shown under the results when one more night reaches a higher length-of-stay
// discount (2 → 3, 4 → 5, 6 → 7 nights).
export function stayExtensionMessage(language: RoomFinderLanguage, s: StayExtensionSuggestion, money: (value: number) => string) {
  const from = percent(s.fromPercent);
  const to = percent(s.toPercent);
  const total = money(s.newTotal);
  const extra = s.extraCost !== null && s.extraCost > 0 ? money(s.extraCost) : null;
  const messages: Record<RoomFinderLanguage, string> = {
    el: `💡 Αν ${s.direction === "later" ? "μείνετε 1 νύχτα ακόμα" : "έρθετε 1 μέρα νωρίτερα"} (${s.stay}, ${s.nights} νύχτες), η έκπτωση ανεβαίνει από ${from}% σε ${to}%. ${extra ? `Το ${s.room} θα κοστίζει ${total} συνολικά, δηλαδή η επιπλέον νύχτα μόνο ${extra}.` : `Π.χ. το ${s.room}: ${total} συνολικά.`}`,
    en: `💡 If you ${s.direction === "later" ? "stay 1 more night" : "arrive 1 day earlier"} (${s.stay}, ${s.nights} nights), your discount goes up from ${from}% to ${to}%. ${extra ? `${s.room} would be ${total} in total, so the extra night costs just ${extra}.` : `For example, ${s.room}: ${total} in total.`}`,
    de: `💡 Wenn Sie ${s.direction === "later" ? "1 Nacht länger bleiben" : "1 Tag früher anreisen"} (${s.stay}, ${s.nights} Nächte), steigt Ihr Rabatt von ${from}% auf ${to}%. ${extra ? `${s.room} kostet dann insgesamt ${total} – die zusätzliche Nacht nur ${extra}.` : `Zum Beispiel ${s.room}: insgesamt ${total}.`}`,
    fr: `💡 Si vous ${s.direction === "later" ? "restez 1 nuit de plus" : "arrivez 1 jour plus tôt"} (${s.stay}, ${s.nights} nuits), votre réduction passe de ${from}% à ${to}%. ${extra ? `${s.room} coûterait ${total} au total : la nuit supplémentaire seulement ${extra}.` : `Par exemple, ${s.room} : ${total} au total.`}`,
    it: `💡 Se ${s.direction === "later" ? "restate 1 notte in più" : "arrivate 1 giorno prima"} (${s.stay}, ${s.nights} notti), lo sconto sale dal ${from}% al ${to}%. ${extra ? `${s.room} costerebbe ${total} in totale: la notte in più solo ${extra}.` : `Ad esempio ${s.room}: ${total} in totale.`}`,
    es: `💡 Si ${s.direction === "later" ? "se quedan 1 noche más" : "llegan 1 día antes"} (${s.stay}, ${s.nights} noches), el descuento sube del ${from}% al ${to}%. ${extra ? `${s.room} costaría ${total} en total: la noche extra solo ${extra}.` : `Por ejemplo, ${s.room}: ${total} en total.`}`,
    tr: `💡 ${s.direction === "later" ? "1 gece daha kalırsanız" : "1 gün erken gelirseniz"} (${s.stay}, ${s.nights} gece) indiriminiz %${from} yerine %${to} olur. ${extra ? `${s.room} toplam ${total} olur; ek gece yalnızca ${extra}.` : `Örneğin ${s.room}: toplam ${total}.`}`,
  };
  return messages[language];
}

export function stayExtensionButton(language: RoomFinderLanguage, s: StayExtensionSuggestion) {
  const labels: Record<RoomFinderLanguage, string> = {
    el: `Ναι, ${s.nights} νύχτες · −${percent(s.toPercent)}%`,
    en: `Yes, ${s.nights} nights · −${percent(s.toPercent)}%`,
    de: `Ja, ${s.nights} Nächte · −${percent(s.toPercent)}%`,
    fr: `Oui, ${s.nights} nuits · −${percent(s.toPercent)}%`,
    it: `Sì, ${s.nights} notti · −${percent(s.toPercent)}%`,
    es: `Sí, ${s.nights} noches · −${percent(s.toPercent)}%`,
    tr: `Evet, ${s.nights} gece · −%${percent(s.toPercent)}`,
  };
  return labels[language];
}
