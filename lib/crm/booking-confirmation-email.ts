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
};

export type BankDetails = { iban: string; holder: string; bank: string; swift: string; iris: string };

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
  },
  en: {
    subject: "Your booking is confirmed", eyebrow: "✓ Booking confirmed", heading: "Your booking is confirmed", preheader: "All the details of your booking.",
    dear: "Dear", intro: "Thank you! We look forward to hosting you. Here are all the details of your booking.",
    details: "Booking details", bookingNo: "Booking no.", bookingDate: "Booking date", name: "Name", adults: "Adults", children: "Children", phone: "Phone", email: "Email", breakfast: "Breakfast", login: "Guest login",
    billing: "Billing summary", item: "Description", amount: "Amount", total: "Total", paid: "Paid", balance: "Balance", comments: "Guest comments",
    payment: "Payment details", iban: "Bank IBAN", holder: "Account holder", bank: "Bank", swift: "SWIFT", iris: "IRIS", methods: "Payment", methodsValue: "Cash or credit card (Visa / Mastercard)", faq: "Frequently asked questions",
  },
  tr: {
    subject: "Rezervasyonunuz onaylandı", eyebrow: "✓ Rezervasyon onaylandı", heading: "Rezervasyonunuz onaylandı", preheader: "Rezervasyonunuzun tüm bilgileri.",
    dear: "Sevgili", intro: "Teşekkür ederiz! Sizi ağırlamak için sabırsızlanıyoruz. Rezervasyonunuzun tüm bilgileri aşağıda.",
    details: "Rezervasyon bilgileri", bookingNo: "Rezervasyon no.", bookingDate: "Rezervasyon tarihi", name: "İsim", adults: "Yetişkin", children: "Çocuk", phone: "Telefon", email: "E-posta", breakfast: "Kahvaltı", login: "Misafir girişi",
    billing: "Ödeme özeti", item: "Açıklama", amount: "Tutar", total: "Toplam", paid: "Ödenen", balance: "Kalan", comments: "Misafir yorumları",
    payment: "Ödeme bilgileri", iban: "Banka IBAN", holder: "Hesap sahibi", bank: "Banka", swift: "SWIFT", iris: "IRIS", methods: "Ödeme", methodsValue: "Nakit veya kredi kartı (Visa / Mastercard)", faq: "Sık sorulan sorular",
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
  const bankRows = bank ? detailRows([
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
