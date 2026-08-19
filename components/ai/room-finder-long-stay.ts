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
  const standard = percent(info.standardDirectDiscountPercent);

  const messages: Record<RoomFinderLanguage, string> = {
    el: `✨ Ωραία! Επειδή θα μείνετε ${info.nights} νύχτες, έχετε αυτόματα καλύτερη τιμή για απευθείας κράτηση.\n🏷️ ${total}% συνολική έκπτωση αντί για το συνηθισμένο ${standard}%.\n✅ Δεν χρειάζεται κωδικός — θα τη δείτε ήδη υπολογισμένη στην τελική τιμή.`,
    en: `✨ Nice! Because you are staying ${info.nights} nights, your direct-booking rate automatically gets better.\n🏷️ ${total}% total discount instead of the usual ${standard}%.\n✅ No code is needed — it will already be included in the final price.`,
    de: `✨ Schön! Weil Sie ${info.nights} Nächte bleiben, erhalten Sie automatisch einen besseren Direktbuchungspreis.\n🏷️ ${total}% Gesamtrabatt statt der üblichen ${standard}%.\n✅ Kein Code nötig — der Rabatt ist bereits im Endpreis berücksichtigt.`,
    fr: `✨ Bonne nouvelle ! Comme vous restez ${info.nights} nuits, votre tarif en réservation directe s’améliore automatiquement.\n🏷️ ${total}% de remise totale au lieu des ${standard}% habituels.\n✅ Aucun code n’est nécessaire — la remise sera déjà incluse dans le prix final.`,
    it: `✨ Ottimo! Poiché soggiornerete ${info.nights} notti, la tariffa per la prenotazione diretta migliora automaticamente.\n🏷️ ${total}% di sconto totale invece del consueto ${standard}%.\n✅ Non serve alcun codice — lo sconto sarà già incluso nel prezzo finale.`,
    es: `✨ ¡Bien! Como se alojarán ${info.nights} noches, la tarifa de reserva directa mejora automáticamente.\n🏷️ ${total}% de descuento total en lugar del ${standard}% habitual.\n✅ No necesitan ningún código — el descuento ya aparecerá incluido en el precio final.`,
    tr: `✨ Güzel! ${info.nights} gece kalacağınız için doğrudan rezervasyon fiyatınız otomatik olarak daha avantajlı oluyor.\n🏷️ Standart ${standard}% yerine toplam ${total}% indirim.\n✅ Kod gerekmez — indirim son fiyata otomatik olarak yansıtılır.`,
  };

  return messages[language];
}
