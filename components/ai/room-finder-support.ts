import type { DirectDiscounts } from "@/lib/ai-assistant/room-type-cards";
import type { SupportIntent } from "@/lib/ai-assistant/support-intent";
import type { RoomFinderLanguage } from "./room-finder-copy";

/** Ref 18: answers for an existing booking, a person, a better price. */

type SupportCopy = {
  existing: string;
  human: string;
  price: (discounts: DirectDiscounts | null, datesKnown: boolean) => string;
};

const PHONE = "+30 694 476 4654";

const COPY: Record<RoomFinderLanguage, SupportCopy> = {
  el: {
    existing: `Για κράτηση που έχετε ήδη (αλλαγή, ακύρωση ή ερώτηση), σας εξυπηρετεί απευθείας η reception, ώστε να δει την κράτησή σας. Καλέστε μας στο ${PHONE} ή στείλτε μας μήνυμα στο WhatsApp με το όνομα της κράτησης.`,
    human: `Βεβαίως 😊 Μπορείτε να μιλήσετε απευθείας με τη reception του Voulamandis House στο ${PHONE} ή στο WhatsApp.`,
    price: (d, datesKnown) => [
      d
        ? `Η απευθείας κράτηση εδώ είναι ήδη η καλύτερη τιμή: ${d.nights1to2}% χαμηλότερα από τις online πλατφόρμες και μεγαλύτερη έκπτωση όσο μένετε περισσότερο: ${d.nights3to4}% για 3–4 νύχτες, ${d.nights5to6}% για 5–6 και ${d.nights7plus}% για 7+ νύχτες.`
        : "Η απευθείας κράτηση εδώ είναι ήδη η καλύτερη τιμή, χαμηλότερη από τις online πλατφόρμες, με μεγαλύτερη έκπτωση όσο μένετε περισσότερο.",
      datesKnown ? "Οι τιμές που βλέπετε έχουν ήδη την έκπτωση." : "Γράψτε μου ημερομηνίες για να σας δείξω την τελική τιμή με την έκπτωση.",
    ].join(" "),
  },
  en: {
    existing: `For a booking you already have (a change, a cancellation or a question), our reception helps you directly so they can see your reservation. Call us on ${PHONE} or message us on WhatsApp with the booking name.`,
    human: `Of course 😊 You can talk directly with Voulamandis House reception on ${PHONE} or on WhatsApp.`,
    price: (d, datesKnown) => [
      d
        ? `Booking directly here already gives you the best price: ${d.nights1to2}% lower than online booking platforms, and a bigger discount the longer you stay: ${d.nights3to4}% for 3–4 nights, ${d.nights5to6}% for 5–6 and ${d.nights7plus}% for 7+ nights.`
        : "Booking directly here already gives you the best price, lower than online booking platforms, with a bigger discount the longer you stay.",
      datesKnown ? "The prices you see already include it." : "Tell me your dates and I’ll show you the final discounted price.",
    ].join(" "),
  },
  de: {
    existing: `Für eine bestehende Buchung (Änderung, Stornierung oder Frage) hilft Ihnen unsere Rezeption direkt, damit sie Ihre Reservierung sieht. Rufen Sie uns unter ${PHONE} an oder schreiben Sie uns per WhatsApp mit dem Buchungsnamen.`,
    human: `Natürlich 😊 Sie erreichen die Rezeption des Voulamandis House direkt unter ${PHONE} oder per WhatsApp.`,
    price: (d, datesKnown) => [
      d
        ? `Die Direktbuchung hier ist bereits der beste Preis: ${d.nights1to2}% günstiger als Buchungsplattformen und mehr Rabatt bei längerem Aufenthalt: ${d.nights3to4}% für 3–4 Nächte, ${d.nights5to6}% für 5–6 und ${d.nights7plus}% ab 7 Nächten.`
        : "Die Direktbuchung hier ist bereits der beste Preis, günstiger als Buchungsplattformen, mit mehr Rabatt bei längerem Aufenthalt.",
      datesKnown ? "Die angezeigten Preise enthalten den Rabatt bereits." : "Nennen Sie mir Ihre Reisedaten, dann zeige ich Ihnen den Endpreis mit Rabatt.",
    ].join(" "),
  },
  fr: {
    existing: `Pour une réservation existante (modification, annulation ou question), notre réception vous aide directement afin de voir votre réservation. Appelez-nous au ${PHONE} ou écrivez-nous sur WhatsApp avec le nom de la réservation.`,
    human: `Bien sûr 😊 Vous pouvez parler directement avec la réception de Voulamandis House au ${PHONE} ou sur WhatsApp.`,
    price: (d, datesKnown) => [
      d
        ? `Réserver ici en direct vous donne déjà le meilleur prix : ${d.nights1to2} % de moins que les plateformes en ligne, et une remise plus forte pour les séjours plus longs : ${d.nights3to4} % pour 3–4 nuits, ${d.nights5to6} % pour 5–6 et ${d.nights7plus} % dès 7 nuits.`
        : "Réserver ici en direct vous donne déjà le meilleur prix, inférieur aux plateformes en ligne, avec une remise plus forte pour les séjours plus longs.",
      datesKnown ? "Les prix affichés l’incluent déjà." : "Donnez-moi vos dates et je vous montrerai le prix final remisé.",
    ].join(" "),
  },
  it: {
    existing: `Per una prenotazione già effettuata (modifica, cancellazione o domanda), vi aiuta direttamente la reception, così può vedere la vostra prenotazione. Chiamateci al ${PHONE} o scriveteci su WhatsApp con il nome della prenotazione.`,
    human: `Certo 😊 Potete parlare direttamente con la reception di Voulamandis House al ${PHONE} o su WhatsApp.`,
    price: (d, datesKnown) => [
      d
        ? `Prenotando qui direttamente avete già il prezzo migliore: il ${d.nights1to2}% in meno rispetto alle piattaforme online e uno sconto maggiore per soggiorni più lunghi: ${d.nights3to4}% per 3–4 notti, ${d.nights5to6}% per 5–6 e ${d.nights7plus}% da 7 notti.`
        : "Prenotando qui direttamente avete già il prezzo migliore, inferiore alle piattaforme online, con uno sconto maggiore per soggiorni più lunghi.",
      datesKnown ? "I prezzi che vedete lo includono già." : "Scrivetemi le date e vi mostrerò il prezzo finale scontato.",
    ].join(" "),
  },
  es: {
    existing: `Para una reserva que ya tienen (cambio, cancelación o consulta), les atiende directamente recepción para ver su reserva. Llámennos al ${PHONE} o escríbannos por WhatsApp con el nombre de la reserva.`,
    human: `Por supuesto 😊 Pueden hablar directamente con la recepción de Voulamandis House en el ${PHONE} o por WhatsApp.`,
    price: (d, datesKnown) => [
      d
        ? `Reservar aquí directamente ya les da el mejor precio: un ${d.nights1to2}% menos que las plataformas online y más descuento cuanto más tiempo se quedan: ${d.nights3to4}% para 3–4 noches, ${d.nights5to6}% para 5–6 y ${d.nights7plus}% desde 7 noches.`
        : "Reservar aquí directamente ya les da el mejor precio, más bajo que las plataformas online, con más descuento cuanto más tiempo se quedan.",
      datesKnown ? "Los precios que ven ya lo incluyen." : "Díganme sus fechas y les mostraré el precio final con descuento.",
    ].join(" "),
  },
  tr: {
    existing: `Mevcut bir rezervasyon için (değişiklik, iptal veya soru) rezervasyonunuzu görebilmesi için resepsiyonumuz size doğrudan yardımcı olur. Bizi ${PHONE} numarasından arayın veya rezervasyon adıyla WhatsApp’tan yazın.`,
    human: `Elbette 😊 Voulamandis House resepsiyonuyla ${PHONE} numarasından veya WhatsApp’tan doğrudan konuşabilirsiniz.`,
    price: (d, datesKnown) => [
      d
        ? `Burada doğrudan rezervasyon zaten en iyi fiyattır: online platformlardan %${d.nights1to2} daha düşük ve uzun konaklamada daha fazla indirim: 3–4 gece %${d.nights3to4}, 5–6 gece %${d.nights5to6}, 7+ gece %${d.nights7plus}.`
        : "Burada doğrudan rezervasyon zaten en iyi fiyattır; online platformlardan daha düşüktür ve uzun konaklamada indirim artar.",
      datesKnown ? "Gördüğünüz fiyatlara indirim zaten dahildir." : "Tarihlerinizi yazın, size indirimli son fiyatı göstereyim.",
    ].join(" "),
  },
};

export function supportMessage(
  language: RoomFinderLanguage,
  intent: SupportIntent,
  discounts: DirectDiscounts | null,
  datesKnown: boolean,
) {
  const copy = COPY[language] || COPY.en;
  if (intent === "existing_booking") return copy.existing;
  if (intent === "human") return copy.human;
  return copy.price(discounts, datesKnown);
}

export async function fetchDirectDiscounts(language: RoomFinderLanguage): Promise<DirectDiscounts | null> {
  try {
    const response = await fetch(`/api/ai-room-finder/room-types/?lang=${language}`);
    const data = await response.json().catch(() => null);
    const d = data?.discounts;
    if (!response.ok || !d || [d.nights1to2, d.nights3to4, d.nights5to6, d.nights7plus].some(v => typeof v !== "number")) {
      return null;
    }
    return d as DirectDiscounts;
  } catch {
    return null;
  }
}
