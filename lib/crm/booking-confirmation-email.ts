import {
  button,
  callout,
  dateLabel,
  detailRows,
  emailShell,
  esc,
  htmlToText,
  paragraph as p,
  sectionTitle,
  stayTicket,
  subjectPrefix,
  SITE_URL,
  type EmailLanguage,
} from "@/lib/crm/email-design";

export type ConfirmationCharge = { description: string; qty: number; amount: number };
export type ConfirmationPayment = { description: string; amount: number };
export type ConfirmationRoom = { room: string; checkin: string; checkout: string };

export type ConfirmationData = {
  language: EmailLanguage;
  bookingIds: string[];
  title: string;
  firstName: string;
  lastName: string;
  guestLogin: string;
  bookingDate: string;
  guestsNames: string;
  rooms: ConfirmationRoom[];
  adults: number;
  children: number;
  phone: string;
  email: string;
  breakfast: string;
  charges: ConfirmationCharge[];
  payments: ConfirmationPayment[];
  comments: string;
  /** Channel that already collected payment (e.g. "Booking.com"); empty when the guest still pays us. */
  prepaidVia?: string;
};

export type BankDetails = { iban: string; holder: string; bank: string; swift: string; iris: string };

/** Guest-facing room-type names, keyed by Beds24 room id (same names guests see on Booking.com). */
export const ROOM_TYPE_NAMES: Record<string, Record<EmailLanguage, string>> = {
  "268803": { en: "Economy Double Room", el: "Οικονομικό Δίκλινο Δωμάτιο", tr: "Ekonomik Çift Kişilik Oda" },
  "626129": { en: "Double or Twin Room - Ground Floor", el: "Δίκλινο Δωμάτιο - Ισόγειο", tr: "Çift veya İki Yataklı Oda - Zemin Kat" },
  "267788": { en: "Double or Triple Room - First Floor", el: "Δίκλινο ή Τρίκλινο Δωμάτιο - Πρώτος όροφος", tr: "Çift veya Üç Kişilik Oda - Birinci Kat" },
  "265595": { en: "Family Apartment", el: "Οικογενειακό Διαμέρισμα", tr: "Aile Dairesi" },
};

const FEE_NAMES: Record<EmailLanguage, string> = {
  el: "Τέλος ανθεκτικότητας στην κλιματική κρίση",
  en: "Climate resilience fee",
  tr: "İklim krizi direnç vergisi",
};

/**
 * Beds24 invoice lines sometimes arrive with unresolved template tags such as
 * "[ROOMNAME1] [FIRSTNIGHT] - [LEAVINGDAY]", and the climate fee always comes in Greek.
 * Turn them into something a guest can read.
 */
export function cleanChargeDescription(raw: string, language: EmailLanguage, context: { room: string; checkin: string; checkout: string }) {
  let value = String(raw ?? "").trim();
  if (/περιβαλλοντικ|ανθεκτικ|climate|resilience/i.test(value)) return FEE_NAMES[language];
  if (/\[[A-Z0-9_]+\]/.test(value)) {
    const day = (iso: string) => (iso ? dateLabel(iso, language, true) : "");
    value = value
      .replace(/\[ROOMNAME\d*\]\s*/gi, `${context.room} · `)
      .replace(/\[(FIRSTNIGHT|ARRIVALDATE|FIRSTDAY)\]/gi, day(context.checkin))
      .replace(/\[(LEAVINGDAY|DEPARTUREDATE|LASTDAY)\]/gi, day(context.checkout))
      .replace(/\[[A-Z0-9_]+\]/g, "")
      .replace(/\s+[-·]\s*$/, "")
      .replace(/^\s*-\s+/, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }
  return value || context.room;
}

/** Booking.com / Expedia system lines that are meant for us, not for the guest. */
const CHANNEL_NOTE = /^\s*(\*+.*pre-?paid.*\**|booking note\s*:.*|.*payment charge is.*|.*virtual (credit )?card.*|.*commission.*)\s*$/i;

export function cleanGuestComments(raw: string) {
  const lines = String(raw ?? "").split(/\r?\n/);
  const prepaid = lines.some((line) => /pre-?paid|paid online|virtual (credit )?card/i.test(line));
  const comments = lines.filter((line) => !CHANNEL_NOTE.test(line)).join("\n").replace(/\n{3,}/g, "\n\n").trim();
  return { comments, prepaid };
}

export const DEFAULT_BREAKFAST: Record<EmailLanguage, string> = {
  el: "Δεν περιλαμβάνεται, εκτός αν αναφέρεται στα σχόλια",
  en: "Not included, unless noted in comments",
  tr: "Yorumlarda belirtilmedikçe dahil değildir",
};

const STAMP_IMAGE = "https://media.xmlcal.com/pic/p0011/7813/39.png";
const FAQ_URL: Record<EmailLanguage, string> = {
  el: `${SITE_URL}/el/syxnes-erotiseis/`,
  en: `${SITE_URL}/frequently-asked-questions/`,
  tr: `${SITE_URL}/tr/sik-sorulan-sorular/`,
};

const TEXT = {
  el: {
    subject: "Η κράτησή σας επιβεβαιώθηκε", eyebrow: "✓ Επιβεβαιωμένη κράτηση", heading: "Η κράτησή σας επιβεβαιώθηκε", preheader: "Όλα τα στοιχεία της κράτησής σας.",
    dear: "Αγαπητέ/ή", intro: "Σας ευχαριστούμε! Ανυπομονούμε να σας φιλοξενήσουμε. Εδώ είναι όλα τα στοιχεία της κράτησής σας.",
    details: "Στοιχεία κράτησης", bookingNo: "Αριθμός κράτησης", bookingDate: "Ημερομηνία κράτησης", name: "Όνομα", adults: "Ενήλικες", children: "Παιδιά", phone: "Τηλέφωνο", email: "Email", breakfast: "Πρωινό", login: "Πρόσβαση",
    billing: "Οικονομικά στοιχεία", item: "Περιγραφή", amount: "Ποσό", total: "Σύνολο", paid: "Πληρωμένο", balance: "Υπόλοιπο", comments: "Σχόλια πελάτη",
    payment: "Τρόποι πληρωμής", iban: "IBAN", holder: "Δικαιούχος", bank: "Τράπεζα", swift: "SWIFT", iris: "IRIS", methods: "Πληρωμή", methodsValue: "Μετρητά ή πιστωτική κάρτα (Visa / Mastercard)", faq: "Συχνές ερωτήσεις",
    prepaid: "Προπληρωμένο μέσω {channel}", prepaidTitle: "Η κράτηση είναι πληρωμένη", prepaidBody: "Η κράτησή σας έχει προπληρωθεί μέσω {channel}. Δεν χρειάζεται να μας στείλετε κάποιο ποσό για αυτές τις χρεώσεις.",
  },
  en: {
    subject: "Your booking is confirmed", eyebrow: "✓ Booking confirmed", heading: "Your booking is confirmed", preheader: "All the details of your booking.",
    dear: "Dear", intro: "Thank you! We look forward to hosting you. Here are all the details of your booking.",
    details: "Booking details", bookingNo: "Booking no.", bookingDate: "Booking date", name: "Name", adults: "Adults", children: "Children", phone: "Phone", email: "Email", breakfast: "Breakfast", login: "Guest login",
    billing: "Billing summary", item: "Description", amount: "Amount", total: "Total", paid: "Paid", balance: "Balance", comments: "Guest comments",
    payment: "Payment details", iban: "Bank IBAN", holder: "Account holder", bank: "Bank", swift: "SWIFT", iris: "IRIS", methods: "Payment", methodsValue: "Cash or credit card (Visa / Mastercard)", faq: "Frequently asked questions",
    prepaid: "Prepaid via {channel}", prepaidTitle: "Your booking is paid", prepaidBody: "Your booking has been prepaid through {channel}. There is no need to send us any payment for these charges.",
  },
  tr: {
    subject: "Rezervasyonunuz onaylandı", eyebrow: "✓ Rezervasyon onaylandı", heading: "Rezervasyonunuz onaylandı", preheader: "Rezervasyonunuzun tüm bilgileri.",
    dear: "Sevgili", intro: "Teşekkür ederiz! Sizi ağırlamak için sabırsızlanıyoruz. Rezervasyonunuzun tüm bilgileri aşağıda.",
    details: "Rezervasyon bilgileri", bookingNo: "Rezervasyon no.", bookingDate: "Rezervasyon tarihi", name: "İsim", adults: "Yetişkin", children: "Çocuk", phone: "Telefon", email: "E-posta", breakfast: "Kahvaltı", login: "Misafir girişi",
    billing: "Ödeme özeti", item: "Açıklama", amount: "Tutar", total: "Toplam", paid: "Ödenen", balance: "Kalan", comments: "Misafir yorumları",
    payment: "Ödeme bilgileri", iban: "Banka IBAN", holder: "Hesap sahibi", bank: "Banka", swift: "SWIFT", iris: "IRIS", methods: "Ödeme", methodsValue: "Nakit veya kredi kartı (Visa / Mastercard)", faq: "Sık sorulan sorular",
    prepaid: "{channel} üzerinden ön ödendi", prepaidTitle: "Rezervasyonunuz ödendi", prepaidBody: "Rezervasyonunuz {channel} üzerinden önceden ödendi. Bu tutarlar için bize ayrıca ödeme göndermenize gerek yok.",
  },
};

const money = (value: number) => `€${(Math.round(value * 100) / 100).toFixed(2)}`;

export const chargesTotal = (charges: ConfirmationCharge[]) => charges.reduce((sum, row) => sum + (Number(row.qty) || 1) * (Number(row.amount) || 0), 0);
export const paymentsTotal = (payments: ConfirmationPayment[]) => payments.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);

function billingTable(data: ConfirmationData, t: (typeof TEXT)["en"]) {
  const row = (label: string, value: string, strong = false) => `<tr>
    <td style="padding:10px 12px 10px 0;border-bottom:1px solid #e8e3da;font-size:15px;color:${strong ? "#1d2b25" : "#4a5550"};font-weight:${strong ? 700 : 400}">${label}</td>
    <td align="right" style="padding:10px 0;border-bottom:1px solid #e8e3da;font-size:15px;color:#1d2b25;font-weight:${strong ? 700 : 600};white-space:nowrap">${value}</td></tr>`;
  const charges = data.charges.map((item) => row(`${esc(item.description)}${(Number(item.qty) || 1) > 1 ? ` × ${item.qty}` : ""}`, money((Number(item.qty) || 1) * (Number(item.amount) || 0)))).join("");
  const total = chargesTotal(data.charges);
  const paid = paymentsTotal(data.payments);
  const payments = data.payments.map((item) => row(esc(item.description || t.paid), `−${money(Number(item.amount) || 0)}`)).join("");
  const channel = (data.prepaidVia ?? "").trim();
  if (channel && !paid) {
    const prepaidRow = row(esc(t.prepaid.replace("{channel}", channel)), `−${money(total)}`);
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${charges}${row(t.total, money(total), true)}${prepaidRow}${row(t.balance, money(0), true)}</table>`;
  }
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${charges}${row(t.total, money(total), true)}${payments}${paid ? row(t.balance, money(total - paid), true) : ""}</table>`;
}

export function buildConfirmationEmail(data: ConfirmationData, bank: BankDetails | null) {
  const language = data.language;
  const t = TEXT[language];
  const fullName = [data.title, data.firstName, data.lastName].filter(Boolean).join(" ");
  const details = detailRows([
    { label: t.bookingNo, value: esc(data.bookingIds.join(", ")) },
    { label: t.bookingDate, value: data.bookingDate ? esc(dateLabel(data.bookingDate, language)) : "" },
    { label: t.name, value: esc(data.guestsNames) },
    { label: t.adults, value: String(data.adults) },
    { label: t.children, value: String(data.children) },
    { label: t.phone, value: esc(data.phone) },
    { label: t.email, value: esc(data.email) },
    { label: t.breakfast, value: esc(data.breakfast) },
    { label: t.login, value: esc(data.guestLogin) },
  ]);
  const prepaidVia = (data.prepaidVia ?? "").trim();
  // A prepaid booking must not show bank details: guests may think they have to pay again.
  const bankRows = bank && !prepaidVia ? detailRows([
    { label: t.iban, value: esc(bank.iban) },
    { label: t.holder, value: esc(bank.holder) },
    { label: t.bank, value: esc(bank.bank) },
    { label: t.swift, value: esc(bank.swift) },
    { label: t.iris, value: esc(bank.iris) },
    { label: t.methods, value: esc(t.methodsValue) },
  ]) : "";
  const body = p(`${t.dear} <strong>${esc(fullName)}</strong>,`) + p(t.intro)
    + stayTicket(language, data.rooms, "")
    + sectionTitle(t.details) + details
    + sectionTitle(t.billing) + billingTable(data, t)
    + (data.comments ? callout(t.comments, esc(data.comments).replace(/\n/g, "<br>")) : "")
    + (prepaidVia ? callout(t.prepaidTitle, esc(t.prepaidBody.replace("{channel}", prepaidVia))) : "")
    + (bankRows ? sectionTitle(t.payment) + bankRows : "")
    + `<p style="margin:22px 0 0;text-align:center"><img src="${STAMP_IMAGE}" width="170" alt="Voulamandis House" style="width:170px;height:auto;border:0"></p>`
    + button(FAQ_URL[language], t.faq);
  const html = emailShell({ language, preheader: t.preheader, eyebrow: t.eyebrow, heading: t.heading, body });
  return {
    subject: `${subjectPrefix(data.bookingIds, data.lastName)} - ${t.subject}`,
    html,
    text: htmlToText(html),
  };
}
