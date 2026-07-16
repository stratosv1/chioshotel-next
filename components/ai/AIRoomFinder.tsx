"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { RoomCarousel } from "@/components/ui/RoomCarousel";

type Language = "el" | "en";
type SearchState = { checkin?: string; checkout?: string; guests?: number };
type Offer = {
  roomId: string;
  unitId: string;
  name: string;
  category: string;
  floor: string;
  maxGuests: number;
  features: string[];
  image: string;
  nights: number;
  originalTotal: number;
  directTotal: number;
  saving: number;
};
type Message = { role: "user" | "assistant"; content: string; offers?: Offer[] };
type IconProps = { className?: string };

const WHATSAPP_NUMBER = "306944474226";
const ACCESSIBILITY_WIDGET_SELECTORS = [
  "#INDmenu-btn",
  ".INDmenu-btn",
  "#userwayAccessibilityIcon",
  ".uwy",
  ".acsb-trigger",
  "[id*='accessibility' i]",
  "[class*='accessibility' i]",
  "[aria-label*='accessibility' i]",
  "[title*='accessibility' i]",
  "iframe[src*='accessibility' i]",
].join(",");

const COPY = {
  el: {
    title: "AI Room Finder", badge: "Live διαθεσιμότητα",
    welcome: "Θα σας βοηθήσω να βρείτε διαθέσιμο δωμάτιο. Ποια ημερομηνία θέλετε για check-in;",
    placeholder: "Γράψτε ημερομηνία ή απάντηση…", send: "Αποστολή", loading: "Ελέγχω τη διαθεσιμότητα…",
    live: "Απευθείας προσφορά", best: "Κορυφαία επιλογή", upTo: "έως", guests: "άτομα", close: "Κλείσιμο",
    email: "Email", whatsapp: "WhatsApp", requestTitle: "Αίτημα προς reception", name: "Ονοματεπώνυμο",
    contact: "Κινητό ή email", message: "Μήνυμα", optional: "προαιρετικό", submit: "Στείλε email", sending: "Αποστολή…",
    successTitle: "Το αίτημα στάλθηκε.", success: "Η reception θα επικοινωνήσει μαζί σας. Δεν έχει πραγματοποιηθεί κράτηση.",
    disclaimer: "Δεν γίνεται κράτηση ή πληρωμή. Στέλνεται μόνο αίτημα ενδιαφέροντος στη reception.",
    error: "Κάτι πήγε στραβά. Δοκιμάστε ξανά.", nights: ["νύχτα", "νύχτες"],
    whatsappIntro: "Γεια σας, ενδιαφέρομαι για αυτό το δωμάτιο:",
    manualTitle: "Άμεσος έλεγχος από reception",
    manualText: "Συμπληρώστε τα στοιχεία σας και η reception θα ελέγξει άμεσα τη διαθεσιμότητα για τις ημερομηνίες σας.",
    manualSuccess: "Το αίτημα ελέγχου στάλθηκε στη reception. Θα επικοινωνήσει μαζί σας απευθείας.",
    manualWhatsapp: "Γεια σας, θα ήθελα άμεσο έλεγχο διαθεσιμότητας από τη reception.",
    perNight: "/ βράδυ", totalFor: "συνολικά για", visitors: "επισκέπτες",
    save: "Εξοικονομείτε", directBooking: "με απευθείας κράτηση",
    interestedRoom: "Ενδιαφέρομαι για αυτό το δωμάτιο",
  },
  en: {
    title: "AI Room Finder", badge: "Live availability",
    welcome: "I will help you find an available room. What is your check-in date?",
    placeholder: "Enter a date or reply…", send: "Send", loading: "Checking availability…",
    live: "Direct offer", best: "Top choice", upTo: "up to", guests: "guests", close: "Close",
    email: "Email", whatsapp: "WhatsApp", requestTitle: "Request to reception", name: "Full name",
    contact: "Mobile or email", message: "Message", optional: "optional", submit: "Send email", sending: "Sending…",
    successTitle: "Request sent.", success: "Reception will contact you. No booking has been made.",
    disclaimer: "No booking or payment is completed. This only sends an enquiry to reception.",
    error: "Something went wrong. Please try again.", nights: ["night", "nights"],
    whatsappIntro: "Hello, I am interested in this room:",
    manualTitle: "Immediate reception check",
    manualText: "Enter your details and reception will immediately check availability for your dates.",
    manualSuccess: "The availability-check request was sent to reception. They will contact you directly.",
    manualWhatsapp: "Hello, I would like reception to check availability immediately.",
    perNight: "/ night", totalFor: "total for", visitors: "guests",
    save: "You save", directBooking: "with direct booking",
    interestedRoom: "I'm interested in this room",
  },
} as const;

const ROOM_GALLERIES: Record<string, string[]> = {
  "267788:1": ["/images/rooms/DSC07776-2-e1675109942622.webp", "/images/rooms/DSC07769-1.webp", "/images/rooms/----1-1.webp", "/images/rooms/voulamandis-house-bathrooms-1.webp"],
  "268803:1": ["/images/rooms/DSC07803-1.webp", "/images/rooms/DSC07839.webp", "/images/rooms/DSC07832.webp", "/images/rooms/received_1385287484893642_1500478431120_1200x800_3240x2160-1.webp"],
  "267788:2": ["/images/rooms/DSC07867-1.webp", "/images/rooms/DSC07860-1.webp", "/images/rooms/DSC07849-1.webp", "/images/rooms/DSC07891-1.webp"],
  "267788:3": ["/images/rooms/received_1748354861920234.webp", "/images/rooms/received_1748358935253160.webp", "/images/rooms/received_1748356725253381.webp", "/images/rooms/received_1748356718586715.webp"],
  "626129:1": ["/images/rooms/voulamandis-house-rooms.webp", "/images/rooms/chios-hotels-triple-rooms_1646x1080.webp", "/images/rooms/voulamandis-house-double-room-bathroom_1620x1080.webp", "/images/rooms/hotels-chios-voulamandis_1620x1080.webp"],
  "268803:2": ["/images/rooms/received_1753964631359257.webp", "/images/rooms/received_1753964581359262.webp", "/images/rooms/received_1753968691358851.webp", "/images/rooms/received_1753969201358800.webp"],
  "626129:2": ["/images/rooms/double-triple-room.jpg", "/images/rooms/view-double-room-chios-hotels.webp", "/images/rooms/double-room-bathroom.webp", "/images/rooms/voulamandis-stone-bathroom.webp"],
  "265595:1": ["/images/rooms/chios-apartments-voulamandis.webp", "/images/rooms/chios-hotels-family-apartments.webp", "/images/rooms/family-room.webp", "/images/rooms/voulamandis-apartment-bathroom..webp"],
  "265595:2": ["/images/rooms/chios-apartments-voulamandis.webp", "/images/rooms/chios-hotels-family-apartments.webp", "/images/rooms/family-room.webp", "/images/rooms/voulamandis-apartment-bathroom..webp"],
  "265595:3": ["/images/rooms/DSC07899.webp", "/images/rooms/DSC07909.webp", "/images/rooms/DSC07940.webp", "/images/rooms/DSC07943.webp"],
};

function HomeIcon({ className = "h-6 w-6" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true"><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-7h6v7"/></svg>;
}

function CutleryIcon({ className = "h-6 w-6" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true"><path d="M6 3v8M3.5 3v5a2.5 2.5 0 0 0 5 0V3M6 11v10M16 3v18M16 3c3 2 4 5 4 8h-4"/></svg>;
}

function GuestsIcon({ className = "h-6 w-6" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true"><circle cx="9" cy="7" r="3"/><path d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M16 5.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 3.5 4.8V20"/></svg>;
}

function CalendarIcon({ className = "h-6 w-6" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>;
}

function TagIcon({ className = "h-6 w-6" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true"><path d="M20.6 13.6 11 23l-9-9V4h10l8.6 8.6a1.4 1.4 0 0 1 0 2Z"/><circle cx="7" cy="9" r="1.3"/></svg>;
}

function WhatsappIcon({ className = "h-6 w-6" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z"/><path d="M8.5 8.2c.4 3.1 2.2 5 5.3 5.8l1.1-1.3 2 .9c-.2 1.5-1.1 2.3-2.6 2.3-4.2-.4-7.6-3.8-8-8 0-1.5.8-2.4 2.3-2.6l.9 2-1 1Z"/></svg>;
}

function MailIcon({ className = "h-6 w-6" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>;
}

function roomNumber(text: string) {
  const value = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  return value.match(/(?:room|δωματιο|διαμερισμα|apartment|το)?\s*(10|[1-9])\s*$/i)?.[1] || null;
}

function isAffirmative(text: string) {
  const value = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  return /^(ναι|βεβαια|φυσικα|οκ|ok|yes|yeah|yep|sure|please|προχωρα|στειλε)(\b|$)/i.test(value);
}

function cardPills(offer: Offer) {
  return [offer.floor, `👤×${offer.maxGuests}`, ...offer.features].filter(Boolean).slice(0, 4);
}

function dateRange(checkin: string | undefined, checkout: string | undefined, language: Language) {
  if (!checkin || !checkout) return "";
  const locale = language === "el" ? "el-GR" : "en-GB";
  const start = new Date(`${checkin}T12:00:00`);
  const end = new Date(`${checkout}T12:00:00`);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    const month = new Intl.DateTimeFormat(locale, { month: "long" }).format(end);
    return `${start.getDate()}–${end.getDate()} ${month}`;
  }
  const formatter = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

export function AIRoomFinder() {
  const [language, setLanguage] = useState<Language>("el");
  const t = COPY[language];
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: COPY.el.welcome }]);
  const [search, setSearch] = useState<SearchState>({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const [requestOffer, setRequestOffer] = useState<Offer | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [noAvailabilityPending, setNoAvailabilityPending] = useState(false);
  const [manualCardOpen, setManualCardOpen] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualContact, setManualContact] = useState("");
  const [manualSending, setManualSending] = useState(false);
  const [manualSuccess, setManualSuccess] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const lastOffers = useMemo(() => [...messages].reverse().find((item) => item.offers?.length)?.offers || [], [messages]);
  const gallery = useMemo(() => {
    if (!activeOffer) return [];
    return Array.from(new Set([activeOffer.image, ...(ROOM_GALLERIES[`${activeOffer.roomId}:${activeOffer.unitId}`] || [])])).slice(0, 4);
  }, [activeOffer]);
  const money = (value: number) => new Intl.NumberFormat(language === "el" ? "el-GR" : "en-GB", { style: "currency", currency: "EUR" }).format(value);

  const activeNights = Math.max(1, activeOffer?.nights || 1);
  const activeOriginalPerNight = activeOffer ? activeOffer.originalTotal / activeNights : 0;
  const activeDirectPerNight = activeOffer ? activeOffer.directTotal / activeNights : 0;
  const activeSaving = activeOffer ? Math.max(0, activeOffer.originalTotal - activeOffer.directTotal) : 0;
  const activeAmenities = activeOffer ? [activeOffer.floor, ...activeOffer.features].filter(Boolean).slice(0, 2) : [];

  useEffect(() => {
    if (!activeOffer && !requestOffer && !manualCardOpen) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const root = document.documentElement;
    const previousBody = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    const hiddenWidgets = new Map<HTMLElement, { visibility: string; pointerEvents: string }>();

    const hideAccessibilityWidgets = () => {
      document.querySelectorAll<HTMLElement>(ACCESSIBILITY_WIDGET_SELECTORS).forEach((element) => {
        if (element.closest('[role="dialog"]') || hiddenWidgets.has(element)) return;
        hiddenWidgets.set(element, {
          visibility: element.style.visibility,
          pointerEvents: element.style.pointerEvents,
        });
        element.style.setProperty("visibility", "hidden", "important");
        element.style.setProperty("pointer-events", "none", "important");
      });
    };

    body.dataset.aiRoomModalOpen = "true";
    root.dataset.aiRoomModalOpen = "true";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    hideAccessibilityWidgets();

    const observer = new MutationObserver(hideAccessibilityWidgets);
    observer.observe(body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      hiddenWidgets.forEach((previous, element) => {
        element.style.visibility = previous.visibility;
        element.style.pointerEvents = previous.pointerEvents;
      });
      delete body.dataset.aiRoomModalOpen;
      delete root.dataset.aiRoomModalOpen;
      body.style.position = previousBody.position;
      body.style.top = previousBody.top;
      body.style.width = previousBody.width;
      body.style.overflow = previousBody.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [activeOffer, requestOffer, manualCardOpen]);

  const whatsappHref = useMemo(() => {
    if (!activeOffer) return "#";
    const text = [
      t.whatsappIntro,
      "",
      `${activeOffer.name} · ${activeOffer.category}`,
      search.checkin ? `Check-in: ${search.checkin}` : "",
      search.checkout ? `Check-out: ${search.checkout}` : "",
      search.guests ? `${language === "el" ? "Επισκέπτες" : "Guests"}: ${search.guests}` : "",
      `${language === "el" ? "Συνολική τιμή" : "Total price"}: ${money(activeOffer.directTotal)}`,
      "",
      language === "el" ? "Παρακαλώ επικοινωνήστε μαζί μου. Δεν πρόκειται για επιβεβαιωμένη κράτηση." : "Please contact me. This is not a confirmed booking.",
    ].filter(Boolean).join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }, [activeOffer, language, search.checkin, search.checkout, search.guests, t.whatsappIntro]);

  const manualWhatsappHref = useMemo(() => {
    const text = [
      t.manualWhatsapp,
      "",
      `${t.name}: ${manualName}`,
      `${t.contact}: ${manualContact}`,
      search.checkin ? `Check-in: ${search.checkin}` : "",
      search.checkout ? `Check-out: ${search.checkout}` : "",
      search.guests ? `${language === "el" ? "Επισκέπτες" : "Guests"}: ${search.guests}` : "",
      "",
      language === "el" ? "Με βάση τα πρόσφατα στοιχεία δεν προέκυψε επιβεβαιωμένη διαθεσιμότητα. Παρακαλώ ελέγξτε το άμεσα." : "No confirmed availability appeared in the latest data. Please check immediately.",
    ].filter(Boolean).join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }, [language, manualContact, manualName, search.checkin, search.checkout, search.guests, t.contact, t.manualWhatsapp, t.name]);

  async function sendMessage(raw: string) {
    const text = raw.trim();
    if (!text || loading) return;

    if (noAvailabilityPending && isAffirmative(text)) {
      setMessages((current) => [...current, { role: "user", content: text }]);
      setInput("");
      setNoAvailabilityPending(false);
      setManualSuccess("");
      setManualCardOpen(true);
      return;
    }

    const selectedNumber = roomNumber(text);
    if (selectedNumber && lastOffers.length) {
      const selected = lastOffers.find((offer) => offer.name.match(/(10|[1-9])/g)?.at(-1) === selectedNumber);
      if (selected) { setInput(""); setActiveOffer(selected); return; }
    }

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-assistant/smart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: nextMessages.map(({ role, content }) => ({ role, content })), search, language }) });
      const data = await response.json();
      if (!response.ok || !data?.answer) throw new Error(data?.error || t.error);
      if (data.search) setSearch(data.search);
      const offers = Array.isArray(data.offers) ? data.offers : [];
      setMessages((current) => [...current, { role: "assistant", content: data.answer, offers }]);
      setNoAvailabilityPending(Boolean(data.noAvailability));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.error);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!requestOffer || !search.checkin || !search.checkout || !search.guests) return;
    setSending(true); setError("");
    const payload = { name, contact, message: note, checkin: search.checkin, checkout: search.checkout, guests: search.guests, roomId: requestOffer.roomId, unitId: requestOffer.unitId, roomName: requestOffer.name, originalTotal: requestOffer.originalTotal, directTotal: requestOffer.directTotal, conversation: messages.slice(-12).map(({ role, content }) => ({ role, content })) };
    try {
      const response = await fetch("/api/ai-assistant/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok || !result?.ok) throw new Error(result?.error || t.error);
      const emailResponse = await fetch("/api/ai-assistant/request-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, requestId: result.requestId }) });
      const emailResult = await emailResponse.json().catch(() => null);
      if (!emailResponse.ok || !emailResult?.ok) throw new Error(emailResult?.error || t.error);
      setSuccess(t.success);
    } catch (cause) { setError(cause instanceof Error ? cause.message : t.error); } finally { setSending(false); }
  }

  async function submitManualRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!search.checkin || !search.checkout || !search.guests || !manualName.trim() || !manualContact.trim()) return;
    setManualSending(true); setError("");
    try {
      const response = await fetch("/api/ai-assistant/no-availability-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: manualName, contact: manualContact, checkin: search.checkin, checkout: search.checkout, guests: search.guests, language, conversation: messages.slice(-16).map(({ role, content }) => ({ role, content })) }) });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) throw new Error(result?.error || t.error);
      setManualSuccess(t.manualSuccess);
    } catch (cause) { setError(cause instanceof Error ? cause.message : t.error); } finally { setManualSending(false); }
  }

  function openManualWhatsapp() {
    if (!manualName.trim() || !manualContact.trim()) return;
    window.open(manualWhatsappHref, "_blank", "noopener,noreferrer");
  }

  function openRequest(offer: Offer) {
    setRequestOffer(offer);
    setActiveOffer(null);
    setSuccess("");
  }

  return (
    <main className="min-h-[100dvh] bg-[#fbfaf7] text-stone-950">
      <header className="border-b border-stone-200 bg-white"><div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-8"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Voulamandis House</p><h1 className="mt-1 text-2xl font-bold">{t.title}</h1></div><div className="flex items-center gap-2"><select value={language} onChange={(event) => { const next = event.target.value as Language; setLanguage(next); setMessages([{ role: "assistant", content: COPY[next].welcome }]); setSearch({}); setNoAvailabilityPending(false); }} className="rounded-xl border px-3 py-2"><option value="el">EL</option><option value="en">EN</option></select><span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 sm:block">{t.badge}</span></div></div></header>

      <section className="mx-auto flex min-h-[calc(100dvh-82px)] max-w-5xl flex-col px-4 sm:px-8">
        <div className="flex-1 space-y-5 py-8">
          {messages.map((message, index) => <div key={`${message.role}-${index}`}><div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[92%] rounded-2xl px-4 py-3 text-[15px] leading-6 sm:max-w-[75%] ${message.role === "user" ? "bg-stone-950 text-white" : "border bg-white shadow-sm"}`}>{message.content}</div></div>{message.offers?.length ? <div className="mt-5 -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 [scrollbar-width:thin]">{message.offers.map((offer, offerIndex) => <button key={`${offer.roomId}:${offer.unitId}`} onClick={() => setActiveOffer(offer)} className={`group relative w-[300px] shrink-0 snap-start overflow-hidden rounded-[20px] border bg-white text-left shadow-[0_8px_24px_rgba(46,35,27,0.10)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(46,35,27,0.16)] sm:w-[310px] ${offerIndex === 0 ? "border-[#a7b777] ring-1 ring-[#dce5bf]" : "border-[#e7dfd5]"}`}><div className="relative h-[166px] overflow-hidden bg-stone-100"><Image src={offer.image} alt={offer.name} fill sizes="310px" className="object-cover transition duration-300 group-hover:scale-[1.02]" /><span className="absolute left-3 top-3 rounded-lg border border-[#ead6b5] bg-[#fff5df]/95 px-2.5 py-1 text-[10px] font-extrabold text-[#8a5a19] shadow-sm">{offerIndex === 0 ? t.best : t.live}</span></div><div className="p-3.5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate text-[20px] font-black leading-tight text-stone-950">{offer.name}</h2><p className="mt-0.5 truncate text-[12px] font-bold text-[#b45309]">{offer.category}</p></div><div className="shrink-0 text-right"><p className="text-[11px] text-stone-400 line-through">{money(offer.originalTotal)}</p><p className="text-[23px] font-black leading-none text-[#43551b]">{money(offer.directTotal)}</p></div></div><div className="mt-3 flex flex-wrap gap-1.5"><span className="rounded-md border border-[#ead6b5] bg-[#fff5df] px-2 py-1 text-[10px] font-bold text-[#8a5a19]">{t.live}</span>{cardPills(offer).map((pill) => <span key={pill} className="max-w-full truncate rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-[10px] font-semibold text-stone-700">{pill}</span>)}</div><p className="mt-3 text-[12px] font-semibold text-[#5f6f28]">{offer.nights} {t.nights[offer.nights === 1 ? 0 : 1]}</p></div></button>)}</div> : null}</div>)}
          {loading ? <div className="w-fit rounded-2xl border bg-white px-4 py-3 text-sm text-stone-600 shadow-sm">{t.loading}</div> : null}
        </div>
        <div className="sticky bottom-0 border-t bg-[#fbfaf7]/95 py-4 backdrop-blur">{error ? <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}<form onSubmit={(event) => { event.preventDefault(); void sendMessage(input); }} className="flex gap-2 rounded-2xl border bg-white p-2 shadow-lg"><input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder={t.placeholder} className="min-w-0 flex-1 bg-transparent px-3 py-2.5 outline-none" /><button disabled={loading || !input.trim()} className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">{t.send}</button></form><p className="mt-2 text-center text-xs text-stone-500">{t.disclaimer}</p></div>
      </section>

      {activeOffer ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden overscroll-none bg-stone-950/60 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={activeOffer.name}>
          <div className="relative flex h-[calc(100dvh-0.75rem)] w-full max-w-3xl flex-col overflow-hidden rounded-t-[2rem] bg-[#fffdf9] shadow-2xl sm:h-auto sm:max-h-[94dvh] sm:rounded-[2rem]">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-2 touch-pan-y sm:px-5 sm:pt-5">
              <div className="mx-auto mb-3 h-1.5 w-28 rounded-full bg-stone-300 sm:hidden" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[1.75rem] bg-stone-100 ring-1 ring-stone-200/70">
                <RoomCarousel images={gallery} roomName={activeOffer.name} compact showThumbnails={false} />
                <button onClick={() => setActiveOffer(null)} className="absolute right-3 top-3 z-20 grid h-12 w-12 place-items-center rounded-full bg-white/95 text-2xl shadow-md ring-1 ring-stone-200" aria-label={t.close}>✕</button>
              </div>

              <div className="px-3 pb-2 pt-5 sm:px-4">
                <h2 className="text-[2rem] font-black leading-[1.05] tracking-[-0.02em] text-[#43551b] sm:text-4xl">{activeOffer.name}</h2>
                <p className="mt-2 text-base font-semibold text-[#9a5b22]">{activeOffer.category} · {t.upTo} {activeOffer.maxGuests} {t.guests}</p>

                <div className="mt-5 grid grid-cols-3 gap-2.5">
                  <div className="flex min-h-20 items-center justify-center gap-2 rounded-2xl border border-[#ded7c9] bg-white px-2 py-3 text-center text-[13px] leading-5 text-stone-600">
                    <HomeIcon className="h-7 w-7 shrink-0 text-[#61752b]" />
                    <span>{activeAmenities[0] || activeOffer.floor}</span>
                  </div>
                  <div className="flex min-h-20 items-center justify-center gap-2 rounded-2xl border border-[#ded7c9] bg-white px-2 py-3 text-center text-[13px] leading-5 text-stone-600">
                    <CutleryIcon className="h-7 w-7 shrink-0 text-[#61752b]" />
                    <span>{activeAmenities[1] || activeOffer.features[0] || activeOffer.category}</span>
                  </div>
                  <div className="flex min-h-20 items-center justify-center gap-2 rounded-2xl border border-[#ded7c9] bg-white px-2 py-3 text-center text-[13px] leading-5 text-stone-600">
                    <GuestsIcon className="h-7 w-7 shrink-0 text-[#61752b]" />
                    <span>{t.upTo} {activeOffer.maxGuests} {t.guests}</span>
                  </div>
                </div>

                {search.checkin && search.checkout ? (
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#ded7c9] bg-white px-4 py-3.5 text-sm text-stone-600">
                    <CalendarIcon className="h-7 w-7 shrink-0 text-stone-600" />
                    <span>{dateRange(search.checkin, search.checkout, language)} · {activeNights} {t.nights[activeNights === 1 ? 0 : 1]} · {search.guests} {t.visitors}</span>
                  </div>
                ) : null}

                <div className="mt-5">
                  <p className="text-base text-stone-400 line-through">{money(activeOriginalPerNight)} {t.perNight}</p>
                  <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="text-[2.6rem] font-black leading-none tracking-[-0.03em] text-[#43551b]">{money(activeDirectPerNight)}</p>
                    <span className="text-base text-stone-600">{t.perNight}</span>
                  </div>
                  <p className="mt-2 text-base text-stone-700"><strong>{money(activeOffer.directTotal)}</strong> {t.totalFor} {activeNights} {t.nights[activeNights === 1 ? 0 : 1]}</p>
                  {activeSaving > 0 ? <p className="mt-4 flex items-center gap-3 text-base font-semibold leading-6 text-[#61752b]"><TagIcon className="h-7 w-7 shrink-0" /><span>{t.save} {money(activeSaving)} {t.directBooking}</span></p> : null}
                </div>

                <button onClick={() => openRequest(activeOffer)} className="mt-5 w-full rounded-[1.4rem] bg-[#435f12] px-5 py-4 text-center text-lg font-medium text-white shadow-[0_12px_26px_rgba(67,95,18,0.20)]">{t.interestedRoom}</button>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center gap-2 rounded-[1.35rem] border border-[#d8d1c3] bg-white px-4 py-3 text-base font-semibold text-stone-900"><WhatsappIcon className="h-7 w-7 text-[#17944b]" />{t.whatsapp}</a>
                  <button type="button" onClick={() => openRequest(activeOffer)} className="flex min-h-14 items-center justify-center gap-2 rounded-[1.35rem] border border-[#d8d1c3] bg-white px-4 py-3 text-base font-medium text-[#43551b]"><MailIcon className="h-7 w-7" />{t.email}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {requestOffer ? <div className="fixed inset-0 z-[110] flex items-end justify-center bg-stone-950/55 sm:items-center sm:p-5" role="dialog" aria-modal="true"><div className="max-h-[94dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-[2rem] bg-white p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] shadow-2xl sm:rounded-[2rem]"><div className="flex justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{t.requestTitle}</p><h2 className="mt-1 text-2xl font-bold">{requestOffer.name}</h2></div><button onClick={() => setRequestOffer(null)} className="rounded-full border px-3 py-2" aria-label={t.close}>✕</button></div>{success ? <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="font-semibold">{t.successTitle}</p><p className="mt-1 text-sm">{success}</p></div> : <form onSubmit={submitRequest} className="mt-5 space-y-4"><label className="block text-sm font-medium">{t.name}<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-2xl border px-4 py-3" /></label><label className="block text-sm font-medium">{t.contact}<input required value={contact} onChange={(event) => setContact(event.target.value)} className="mt-1.5 w-full rounded-2xl border px-4 py-3" /></label><label className="block text-sm font-medium">{t.message} <span className="font-normal text-stone-400">({t.optional})</span><textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} className="mt-1.5 w-full rounded-2xl border px-4 py-3" /></label><button disabled={sending} className="w-full rounded-2xl bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-50">{sending ? t.sending : t.submit}</button><p className="text-center text-xs text-stone-500">{t.disclaimer}</p></form>}</div></div> : null}

      {manualCardOpen ? <div className="fixed inset-0 z-[110] flex items-end justify-center bg-stone-950/55 sm:items-center sm:p-5" role="dialog" aria-modal="true"><div className="max-h-[94dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-[2rem] bg-white p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] shadow-2xl sm:rounded-[2rem]"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">AI Room Finder</p><h2 className="mt-1 text-2xl font-bold">{t.manualTitle}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{t.manualText}</p></div><button onClick={() => setManualCardOpen(false)} className="rounded-full border px-3 py-2" aria-label={t.close}>✕</button></div>{manualSuccess ? <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="font-semibold">{t.successTitle}</p><p className="mt-1 text-sm">{manualSuccess}</p></div> : <form onSubmit={submitManualRequest} className="mt-5 space-y-4"><div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-700"><p><strong>Check-in:</strong> {search.checkin}</p><p><strong>Check-out:</strong> {search.checkout}</p><p><strong>{language === "el" ? "Επισκέπτες" : "Guests"}:</strong> {search.guests}</p></div><label className="block text-sm font-medium">{t.name}<input required value={manualName} onChange={(event) => setManualName(event.target.value)} className="mt-1.5 w-full rounded-2xl border px-4 py-3" /></label><label className="block text-sm font-medium">{t.contact}<input required value={manualContact} onChange={(event) => setManualContact(event.target.value)} className="mt-1.5 w-full rounded-2xl border px-4 py-3" /></label><div className="grid grid-cols-2 gap-3"><button type="submit" disabled={manualSending || !manualName.trim() || !manualContact.trim()} className="rounded-2xl bg-stone-950 px-4 py-3.5 text-sm font-semibold text-white disabled:opacity-40">✉️ {manualSending ? t.sending : t.email}</button><button type="button" disabled={!manualName.trim() || !manualContact.trim()} onClick={openManualWhatsapp} className="rounded-2xl bg-[#25D366] px-4 py-3.5 text-sm font-semibold text-white disabled:opacity-40">💬 {t.whatsapp}</button></div><p className="text-center text-xs text-stone-500">{t.disclaimer}</p></form>}</div></div> : null}
    </main>
  );
}
