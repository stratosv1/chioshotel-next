import "server-only";
import { appendBookingNote, getBeds24WriteToken } from "@/lib/crm/booking-notes";
import { addBeds24Charge } from "./beds24-write";
import { insertCharge, logHistory } from "./ledger";
import { saveExtras } from "./store";

const BREAKFAST_LABEL = "Πρωινό";
const round = (value: number) => Math.round(value * 100) / 100;

/**
 * Breakfast on a new booking (owner, 2026-11-26): the stay and the breakfast are two
 * separate lines. Ticks "Πρωινό περιλαμβάνεται" in the control tower, adds a
 * "Πρωινό" charge line (control tower + Beds24 invoice) when an amount is known,
 * and notes it in Beds24. Never throws: the booking already exists.
 */
export async function applyBreakfastToNewBooking(input: { bookingId: string; amount: number | null; nights: number; guests: number }) {
  const { bookingId, nights, guests } = input;
  const amount = input.amount !== null && Number.isFinite(input.amount) && input.amount > 0 ? round(input.amount) : null;
  const outcome = { extras: "ok", charge: amount ? "ok" : "none", note: "ok" };

  try {
    await saveExtras({ bookingId, bedSetup: null, cot: false, rollaway: false, other: "", breakfast: true });
  } catch (error) {
    console.error("[breakfast] tick failed", error);
    outcome.extras = "failed";
  }

  if (amount) {
    // "14 × €12" reads better on the invoice than "1 × €168" when it divides evenly.
    const portions = Math.max(nights, 0) * Math.max(guests, 0);
    const unit = portions > 0 ? round(amount / portions) : 0;
    const even = portions > 0 && Math.abs(unit * portions - amount) < 0.005;
    const qty = even ? portions : 1;
    const unitPrice = even ? unit : amount;
    let beds24 = "ok";
    try {
      await addBeds24Charge(bookingId, BREAKFAST_LABEL, qty, unitPrice);
    } catch (error) {
      console.error("[breakfast] Beds24 charge failed", error);
      beds24 = "failed";
      outcome.charge = "failed";
    }
    try {
      await insertCharge(bookingId, BREAKFAST_LABEL, qty, unitPrice, beds24);
      await logHistory(bookingId, "Χρέωση", `${BREAKFAST_LABEL} · ${qty} × €${unitPrice} = €${amount}`, beds24);
    } catch (error) {
      console.error("[breakfast] charge record failed", error);
      outcome.charge = "failed";
    }
  }

  try {
    const line = `Πρωινό: περιλαμβάνεται${amount ? ` (€${amount})` : ""}`;
    const token = await getBeds24WriteToken();
    const written = await appendBookingNote(bookingId, line, line, token);
    if (written !== "written" && written !== "already_noted") outcome.note = "failed";
  } catch (error) {
    console.error("[breakfast] Beds24 note failed", error);
    outcome.note = "failed";
  }

  return outcome;
}
