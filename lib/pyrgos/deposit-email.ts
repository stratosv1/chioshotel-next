import "server-only";
import { ROOM_TYPE_NAMES } from "@/lib/crm/booking-confirmation-email";
import { detailRows, emailShell, esc, htmlToText, paragraph, sectionTitle, stayTicket, subjectPrefix, type EmailLanguage } from "@/lib/crm/email-design";
import { chooseLanguage, deliverEmail } from "@/lib/crm/guest-emails";
import { ActionError } from "./actions";
import { logHistory } from "./ledger";
import { getBookingDetail } from "./plan";
import { CLIMATE_FEE_PER_NIGHT, roomByNumber } from "./rooms";
import { getSql } from "./store";

// Manual email (owner, 2026-11-19): "we have received your deposit for this booking".

const TEXT: Record<EmailLanguage, Record<string, string>> = {
  el: {
    subject: "Λάβαμε την προκαταβολή σας",
    eyebrow: "✓ Προκαταβολή",
    heading: "Λάβαμε την προκαταβολή σας",
    preheader: "Επιβεβαίωση παραλαβής προκαταβολής για την κράτησή σας.",
    dear: "Αγαπητέ/ή",
    intro: "Σας ευχαριστούμε! Επιβεβαιώνουμε ότι λάβαμε την προκαταβολή σας για την παρακάτω κράτηση.",
    summary: "Πληρωμή",
    bookingNo: "Αριθμός κράτησης",
    deposit: "Προκαταβολή που λάβαμε",
    total: "Σύνολο διαμονής",
    balance: "Υπόλοιπο",
    balanceNote: "Το υπόλοιπο εξοφλείται κατά την άφιξή σας, με μετρητά ή κάρτα.",
    paidNote: "Η κράτησή σας είναι πλέον εξοφλημένη.",
    outro: "Ανυπομονούμε να σας καλωσορίσουμε στο Voulamandis House!",
  },
  en: {
    subject: "We have received your deposit",
    eyebrow: "✓ Deposit received",
    heading: "We have received your deposit",
    preheader: "Confirmation that we received the deposit for your booking.",
    dear: "Dear",
    intro: "Thank you! We confirm that we have received your deposit for the booking below.",
    summary: "Payment",
    bookingNo: "Booking no.",
    deposit: "Deposit received",
    total: "Total for the stay",
    balance: "Balance",
    balanceNote: "The balance is paid on arrival, in cash or by card.",
    paidNote: "Your booking is now fully paid.",
    outro: "We look forward to welcoming you at Voulamandis House!",
  },
  tr: {
    subject: "Ön ödemenizi aldık",
    eyebrow: "✓ Ön ödeme alındı",
    heading: "Ön ödemenizi aldık",
    preheader: "Rezervasyonunuz için ön ödemenin alındığının onayı.",
    dear: "Sevgili",
    intro: "Teşekkür ederiz! Aşağıdaki rezervasyon için ön ödemenizi aldığımızı onaylarız.",
    summary: "Ödeme",
    bookingNo: "Rezervasyon no.",
    deposit: "Alınan ön ödeme",
    total: "Konaklama toplamı",
    balance: "Kalan",
    balanceNote: "Kalan tutar varışta nakit veya kartla ödenir.",
    paidNote: "Rezervasyonunuzun ödemesi tamamlandı.",
    outro: "Sizi Voulamandis House'ta ağırlamayı dört gözle bekliyoruz!",
  },
};

const euro = (n: number) => `€${(Math.round(n * 100) / 100).toFixed(2)}`;

export async function sendDepositEmail(body: any) {
  const id = String(body.id ?? "").trim();
  const to = String(body.to ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) throw new ActionError("Μη έγκυρο email.");
  const detail = await getBookingDetail(id);
  if (!detail) throw new ActionError("Η κράτηση δεν βρέθηκε.", 404);
  const b = detail.booking;
  // Price and deposit live on the master booking of a group.
  const master = b.masterId ? (await getBookingDetail(b.masterId))?.booking ?? b : b;
  const deposit = master.deposit ?? 0;
  if (!deposit) throw new ActionError("Δεν έχει αποθηκευτεί προκαταβολή σε αυτή την κράτηση.");
  const stay = master.totalPrice ?? master.beds24Price ?? null;


  const [row] = (await getSql()`select language, country from public.pyrgos_bookings where booking_id = ${master.id}`) as any[];
  const language = chooseLanguage(row?.language ?? null, row?.country ?? null);
  const t = TEXT[language];
  const rooms = detail.group.length > 1 ? detail.group : [{ id: b.id, room: b.room }];
  const ticketRooms = await Promise.all(
    rooms.map(async (g) => {
      const other = g.id === b.id ? b : (await getBookingDetail(g.id))?.booking ?? b;
      const roomId = String(roomByNumber(other.room)?.roomId ?? "");
      return { room: ROOM_TYPE_NAMES[roomId]?.[language] ?? roomByNumber(other.room)?.label ?? "", checkin: other.checkin, checkout: other.checkout };
    }),
  );
  // Stay + climate fee (nights × €2 per room) + extra charges.
  const nightsAll = ticketRooms.reduce((sum, r) => sum + Math.max(Math.round((Date.parse(r.checkout) - Date.parse(r.checkin)) / 86_400_000), 0), 0);
  const total = stay !== null ? Math.round((stay + nightsAll * CLIMATE_FEE_PER_NIGHT + master.chargesTotal) * 100) / 100 : null;
  const balance = total !== null ? Math.max(total - deposit, 0) : null;
  const fullName = `${master.firstName} ${master.lastName}`.trim();
  const ids = rooms.map((g) => g.id);

  const body_ =
    paragraph(`${t.dear} <strong>${esc(fullName)}</strong>,`) +
    paragraph(t.intro) +
    stayTicket(language, ticketRooms, "") +
    sectionTitle(t.summary) +
    detailRows([
      { label: t.bookingNo, value: esc(ids.join(", ")) },
      { label: t.deposit, value: `<strong>${euro(deposit)}</strong>` },
      { label: t.total, value: total !== null ? euro(total) : "" },
      { label: t.balance, value: balance !== null ? `<strong>${euro(balance)}</strong>` : "" },
    ]) +
    paragraph(balance === 0 || master.paid ? t.paidNote : t.balanceNote) +
    paragraph(t.outro);
  const html = emailShell({ language, preheader: t.preheader, eyebrow: t.eyebrow, heading: t.heading, body: body_ });
  const subject = `${subjectPrefix(ids, master.lastName)} - ${t.subject}`;
  await deliverEmail(to, subject, html, htmlToText(html));

  await getSql()`insert into public.staff_guest_communications (booking_id, guest_name, channel, direction, message_type, recipient_email, subject, message, status, provider, source)
    values (${master.id}, ${fullName}, 'email', 'outbound', 'deposit_receipt', ${to}, ${subject}, ${`Προκαταβολή ${euro(deposit)} · υπόλοιπο ${balance !== null ? euro(balance) : "-"}`}, 'sent', 'smtp', 'pyrgos')`;
  await logHistory(master.id, "Email προκαταβολής", `${euro(deposit)} → ${to}`, "ok");
  return { id: master.id };
}
