/**
 * Ref 18: messages that are not a new availability search.
 *
 * - existing_booking: the guest already has a reservation and wants to change,
 *   cancel or ask about it → reception, never a new search (their own room
 *   would show as "not available").
 * - human: the guest wants to talk to a person → phone / WhatsApp.
 * - better_price: the guest asks for a discount or a better price → the
 *   direct-booking discounts that already apply.
 */

export type SupportIntent = "existing_booking" | "human" | "better_price";

const EXISTING_BOOKING = /(έχω\s+(?:ήδη\s+)?(?:κάνει\s+)?(?:μια\s+|μία\s+)?κράτηση|εχω\s+(?:ηδη\s+)?(?:κανει\s+)?κρατηση|(?:την\s+)?κράτησ[ηή]\s+μου|κρατηση\s+μου|ακυρ[ώω]σω|ακυρ[ώω]στε|να\s+ακυρωθεί|αλλαγ[ήη]\s+(?:στην\s+|της\s+)?κράτησ|αλλάξω\s+(?:την\s+)?κράτησ|αριθμ[όο]ς\s+κράτησης|i\s+(?:have|made|already\s+have)\s+a\s+(?:booking|reservation)|(?:my|our)\s+(?:booking|reservation)|already\s+booked|we\s+booked|i\s+booked|cancel\s+(?:my|our|the)\s+(?:booking|reservation|stay)|booking\s+(?:number|reference|confirmation)|meine\s+(?:buchung|reservierung)|unsere\s+(?:buchung|reservierung)|stornieren|ma\s+réservation|notre\s+réservation|annuler\s+(?:ma|notre)|la\s+mia\s+prenotazione|la\s+nostra\s+prenotazione|cancellare\s+la\s+prenotazione|mi\s+reserva|nuestra\s+reserva|cancelar\s+(?:mi|la)\s+reserva|rezervasyonum|rezervasyonumu|iptal\s+etmek)/iu;

// Questions about the cancellation POLICY are answered from verified
// knowledge, not routed to reception.
const POLICY_QUESTION = /(πολιτικ[ήη]|όρο[ιυ]|ορο[ιυ]|δωρε[άα]ν\s+ακύρωση|policy|terms|free\s+cancellation|stornobedingungen|kostenlose\s+stornierung|conditions\s+d['’]annulation|annulation\s+gratuite|politica\s+di\s+cancellazione|cancellazione\s+gratuita|política\s+de\s+cancelación|cancelación\s+gratuita|iptal\s+politikası|ücretsiz\s+iptal)/iu;

const HUMAN = /(μιλ[ήη]σω\s+με\s+(?:κάποιον|καποιον|άνθρωπο|ανθρωπο|υπάλληλο|υπαλληλο|τη\s+reception|τη\s+ρεσεψι[όο]ν|τον\s+ιδιοκτήτη|τον\s+ιδιοκτητη)|θέλω\s+(?:να\s+μιλήσω|άνθρωπο|τηλέφωνο\s+επικοινωνίας)|real\s+person|(?:speak|talk)\s+(?:to|with)\s+(?:someone|somebody|a\s+(?:real\s+)?(?:person|human)|a\s+member\s+of\s+staff|staff|reception|the\s+owner)|\bhuman\b|mit\s+(?:einem\s+menschen|jemandem|der\s+rezeption)\s+sprechen|parler\s+(?:à|avec)\s+(?:quelqu['’]un|une\s+personne|la\s+réception)|parlare\s+con\s+(?:qualcuno|una\s+persona|la\s+reception)|hablar\s+con\s+(?:alguien|una\s+persona|recepción)|biriyle\s+konuşmak|resepsiyonla\s+konuşmak)/iu;

const BETTER_PRICE = /(καλύτερη\s+τιμή|καλυτερη\s+τιμη|έκπτωσ|εκπτωσ|πιο\s+(?:φθην|φτην|οικονομικ)|κάνετε\s+(?:κάτι\s+)?καλύτερ|better\s+(?:price|rate|deal|offer)|best\s+(?:price|rate)|any\s+discount|a\s+discount|discounts?\b|cheaper|lower\s+(?:price|rate)|rabatt|günstiger|bester\s+preis|meilleur\s+prix|réduction|remise|moins\s+cher|sconto|prezzo\s+migliore|più\s+economico|descuento|mejor\s+precio|más\s+barato|indirim|daha\s+ucuz)/iu;

export function detectSupportIntent(text: string): SupportIntent | null {
  const message = text.trim();
  if (!message) return null;
  if (EXISTING_BOOKING.test(message) && !POLICY_QUESTION.test(message)) return "existing_booking";
  if (HUMAN.test(message)) return "human";
  // A discount question with booking facts ("10/6 2 nights, any discount?")
  // goes through the normal flow, which shows the discounted live price.
  if (BETTER_PRICE.test(message) && !/\d/.test(message)) return "better_price";
  return null;
}
