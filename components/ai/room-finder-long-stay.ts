import type { RoomFinderLanguage } from "./room-finder-copy";

export type LongStayDiscountInfo = {
  nights: number;
  standardDirectDiscountPercent: number;
  totalDiscountPercent: number;
  extraDiscountPercent: number;
  eligible: boolean;
};

export async function fetchLongStayDiscount(checkin: string, checkout: string) {
  const query = new URLSearchParams({ checkin, checkout });
  const response = await fetch(`/api/ai-room-finder/long-stay-discount?${query}`, { cache: "no-store" });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) return null;

  return {
    nights: Number(payload.nights || 0),
    standardDirectDiscountPercent: Number(payload.standardDirectDiscountPercent || 0),
    totalDiscountPercent: Number(payload.totalDiscountPercent || 0),
    extraDiscountPercent: Number(payload.extraDiscountPercent || 0),
    eligible: Boolean(payload.eligible),
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
