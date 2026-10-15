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

// Asked before the results when one more night reaches a higher
// length-of-stay discount (2 → 3, 4 → 5, 6 → 7 nights).
export function stayExtensionMessage(language: RoomFinderLanguage, s: StayExtensionSuggestion, money: (value: number) => string) {
  const from = percent(s.fromPercent);
  const to = percent(s.toPercent);
  const total = money(s.newTotal);
  const extra = s.extraCost !== null && s.extraCost > 0 ? money(s.extraCost) : null;
  const messages: Record<RoomFinderLanguage, string> = {
    el: `🎁 Προσφορά για εσάς: αν ${s.direction === "later" ? "μείνετε 1 νύχτα ακόμα" : "έρθετε 1 μέρα νωρίτερα"} (${s.stay}, ${s.nights} νύχτες), η συνολική σας έκπτωση ανεβαίνει από ${from}% σε ${to}%.\n${extra ? `Π.χ. στο ${s.room} η επιπλέον νύχτα κοστίζει μόνο ${extra} (${total} για ${s.nights} νύχτες).` : `Π.χ. το ${s.room}: ${total} για ${s.nights} νύχτες.`}\nΣας ενδιαφέρει;`,
    en: `🎁 A special offer for you: if you ${s.direction === "later" ? "stay 1 more night" : "arrive 1 day earlier"} (${s.stay}, ${s.nights} nights), your total discount goes up from ${from}% to ${to}%.\n${extra ? `For example, in ${s.room} the extra night costs just ${extra} (${total} for ${s.nights} nights).` : `For example, ${s.room}: ${total} for ${s.nights} nights.`}\nWould you like that?`,
    de: `🎁 Ein Angebot für Sie: Wenn Sie ${s.direction === "later" ? "1 Nacht länger bleiben" : "1 Tag früher anreisen"} (${s.stay}, ${s.nights} Nächte), steigt Ihr Gesamtrabatt von ${from}% auf ${to}%.\n${extra ? `Zum Beispiel kostet in ${s.room} die zusätzliche Nacht nur ${extra} (${total} für ${s.nights} Nächte).` : `Zum Beispiel ${s.room}: ${total} für ${s.nights} Nächte.`}\nInteressiert?`,
    fr: `🎁 Une offre pour vous : si vous ${s.direction === "later" ? "restez 1 nuit de plus" : "arrivez 1 jour plus tôt"} (${s.stay}, ${s.nights} nuits), votre réduction totale passe de ${from}% à ${to}%.\n${extra ? `Par exemple, pour ${s.room}, la nuit supplémentaire ne coûte que ${extra} (${total} pour ${s.nights} nuits).` : `Par exemple, ${s.room} : ${total} pour ${s.nights} nuits.`}\nCela vous intéresse ?`,
    it: `🎁 Un’offerta per voi: se ${s.direction === "later" ? "restate 1 notte in più" : "arrivate 1 giorno prima"} (${s.stay}, ${s.nights} notti), lo sconto totale sale dal ${from}% al ${to}%.\n${extra ? `Ad esempio, in ${s.room} la notte in più costa solo ${extra} (${total} per ${s.nights} notti).` : `Ad esempio ${s.room}: ${total} per ${s.nights} notti.`}\nVi interessa?`,
    es: `🎁 Una oferta para usted: si ${s.direction === "later" ? "se queda 1 noche más" : "llega 1 día antes"} (${s.stay}, ${s.nights} noches), su descuento total sube del ${from}% al ${to}%.\n${extra ? `Por ejemplo, en ${s.room} la noche extra cuesta solo ${extra} (${total} por ${s.nights} noches).` : `Por ejemplo, ${s.room}: ${total} por ${s.nights} noches.`}\n¿Le interesa?`,
    tr: `🎁 Size özel teklif: ${s.direction === "later" ? "1 gece daha kalırsanız" : "1 gün erken gelirseniz"} (${s.stay}, ${s.nights} gece) toplam indiriminiz %${from} yerine %${to} olur.\n${extra ? `Örneğin ${s.room} için ek gece yalnızca ${extra} (${s.nights} gece için ${total}).` : `Örneğin ${s.room}: ${s.nights} gece için ${total}.`}\nİlginizi çeker mi?`,
  };
  return messages[language];
}

export function stayExtensionDecline(language: RoomFinderLanguage, currentNights: number) {
  const labels: Record<RoomFinderLanguage, string> = {
    el: `Όχι, κρατάω ${currentNights} ${currentNights === 1 ? "νύχτα" : "νύχτες"}`,
    en: `No, keep ${currentNights} ${currentNights === 1 ? "night" : "nights"}`,
    de: `Nein, bei ${currentNights} ${currentNights === 1 ? "Nacht" : "Nächten"} bleiben`,
    fr: `Non, garder ${currentNights} ${currentNights === 1 ? "nuit" : "nuits"}`,
    it: `No, tengo ${currentNights} ${currentNights === 1 ? "notte" : "notti"}`,
    es: `No, mantener ${currentNights} ${currentNights === 1 ? "noche" : "noches"}`,
    tr: `Hayır, ${currentNights} gece kalsın`,
  };
  return labels[language];
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
