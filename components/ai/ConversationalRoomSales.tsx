"use client";

import Image from "next/image";
import { FormEvent, useMemo, useRef, useState } from "react";

type Language = "el" | "en";
type Step = "checkin" | "checkout" | "rooms" | "guests" | "searching" | "selecting" | "breakfast" | "complete";
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
type ChatMessage = { role: "assistant" | "user"; content: string };
type RoomChoice = { group: number; guests: number; offer: Offer };

const BREAKFAST_IMAGE = "/images/welcome/voulamandis-breakfast.jpg";

const COPY = {
  el: {
    title: "AI Room Finder",
    badge: "Live διαθεσιμότητα",
    welcome: "Θα σας βοηθήσω να βρείτε και να επιλέξετε τα κατάλληλα δωμάτια. Ποια ημερομηνία θέλετε για check-in;",
    checkOut: "Ποια ημερομηνία θέλετε για check-out;",
    rooms: "Πόσα δωμάτια χρειάζεστε; Μπορείτε να ζητήσετε από 1 έως 3 δωμάτια.",
    guests: (room: number) => `Πόσα άτομα θα μείνουν στο δωμάτιο ${room};`,
    searching: "Ελέγχω τη live διαθεσιμότητα για κάθε δωμάτιο…",
    choose: (room: number, guests: number) => `Επιλέξτε το δωμάτιο που προτιμάτε για την ομάδα ${room} (${guests} άτομα).`,
    selected: (room: number, name: string) => `Επιλέξατε ${name} για την ομάδα ${room}.`,
    changing: (room: number) => `Αλλάζουμε την επιλογή για την ομάδα ${room}. Επιλέξτε άλλο διαθέσιμο δωμάτιο.`,
    noAvailability: (room: number) => `Δεν βρέθηκε διαθέσιμη επιλογή για την ομάδα ${room}. Δοκιμάστε άλλες ημερομηνίες ή διαφορετική κατανομή ατόμων.`,
    breakfast: "Ολοκληρώθηκαν οι επιλογές δωματίων. Θέλετε να προσθέσετε πρωινό με 12€ ανά άτομο, ανά ημέρα;",
    breakfastYes: "Ναι, προσθήκη πρωινού",
    breakfastNo: "Όχι, χωρίς πρωινό",
    complete: "Η επιλογή διαμονής ολοκληρώθηκε. Μπορείτε να ελέγξετε τη σύνοψη και να συνεχίσετε με αίτημα προς τη reception.",
    placeholder: "Γράψτε την απάντησή σας…",
    send: "Αποστολή",
    select: (room: number) => `Επιλογή για δωμάτιο ${room}`,
    selectedLabel: "Επιλέχθηκε",
    summary: "Σύνοψη διαμονής",
    dates: "Ημερομηνίες",
    total: "Σύνολο δωματίων",
    breakfastLabel: "Πρωινό",
    grandTotal: "Τελικό σύνολο",
    people: "άτομα",
    nights: "νύχτες",
    roomGroup: "Ομάδα",
    change: "Αλλαγή",
    newSearch: "Νέα αναζήτηση",
    yourChoices: "Οι επιλογές σας",
    invalidDate: "Γράψτε ημερομηνία όπως 20/07 ή 20/07/2026.",
    invalidCheckout: "Το check-out πρέπει να είναι μετά το check-in.",
    invalidRooms: "Γράψτε 1, 2 ή 3 δωμάτια.",
    invalidGuests: "Γράψτε αριθμό ατόμων από 1 έως 5.",
  },
  en: {
    title: "AI Room Finder",
    badge: "Live availability",
    welcome: "I will help you find and select the right rooms. What is your check-in date?",
    checkOut: "What is your check-out date?",
    rooms: "How many rooms do you need? You can request 1 to 3 rooms.",
    guests: (room: number) => `How many guests will stay in room ${room}?`,
    searching: "Checking live availability for each room…",
    choose: (room: number, guests: number) => `Choose your preferred room for group ${room} (${guests} guests).`,
    selected: (room: number, name: string) => `You selected ${name} for group ${room}.`,
    changing: (room: number) => `Changing the choice for group ${room}. Select another available room.`,
    noAvailability: (room: number) => `No available option was found for group ${room}. Try different dates or a different guest allocation.`,
    breakfast: "All rooms have been selected. Would you like to add breakfast for €12 per guest, per day?",
    breakfastYes: "Yes, add breakfast",
    breakfastNo: "No breakfast",
    complete: "Your stay selection is complete. Review the summary and continue with an enquiry to reception.",
    placeholder: "Type your answer…",
    send: "Send",
    select: (room: number) => `Select for room ${room}`,
    selectedLabel: "Selected",
    summary: "Stay summary",
    dates: "Dates",
    total: "Rooms total",
    breakfastLabel: "Breakfast",
    grandTotal: "Grand total",
    people: "guests",
    nights: "nights",
    roomGroup: "Group",
    change: "Change",
    newSearch: "New search",
    yourChoices: "Your choices",
    invalidDate: "Enter a date such as 20/07 or 20/07/2026.",
    invalidCheckout: "Check-out must be after check-in.",
    invalidRooms: "Enter 1, 2 or 3 rooms.",
    invalidGuests: "Enter a guest count from 1 to 5.",
  },
} as const;

function parseDate(input: string) {
  const value = input.trim();
  const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const short = value.match(/^(\d{1,2})[\/.\-](\d{1,2})(?:[\/.\-](\d{2,4}))?$/);
  let year: number;
  let month: number;
  let day: number;
  if (iso) {
    year = Number(iso[1]); month = Number(iso[2]); day = Number(iso[3]);
  } else if (short) {
    day = Number(short[1]); month = Number(short[2]);
    year = short[3] ? Number(short[3]) : new Date().getFullYear();
    if (year < 100) year += 2000;
  } else return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function nightsBetween(checkin: string, checkout: string) {
  return Math.round((new Date(`${checkout}T12:00:00Z`).getTime() - new Date(`${checkin}T12:00:00Z`).getTime()) / 86_400_000);
}

export function ConversationalRoomSales() {
  const [language, setLanguage] = useState<Language>("el");
  const t = COPY[language];
  const [step, setStep] = useState<Step>("checkin");
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: COPY.el.welcome }]);
  const [input, setInput] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [roomCount, setRoomCount] = useState(1);
  const [guestGroups, setGuestGroups] = useState<number[]>([]);
  const [guestIndex, setGuestIndex] = useState(0);
  const [offersByGroup, setOffersByGroup] = useState<Offer[][]>([]);
  const [activeGroup, setActiveGroup] = useState(0);
  const [choices, setChoices] = useState<RoomChoice[]>([]);
  const [breakfast, setBreakfast] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const nights = checkin && checkout ? nightsBetween(checkin, checkout) : 0;
  const roomsTotal = choices.reduce((sum, choice) => sum + Number(choice.offer.directTotal || 0), 0);
  const totalGuests = guestGroups.reduce((sum, value) => sum + value, 0);
  const breakfastTotal = breakfast ? totalGuests * nights * 12 : 0;
  const grandTotal = roomsTotal + breakfastTotal;
  const usedUnits = useMemo(() => new Set(choices.map((choice) => `${choice.offer.roomId}:${choice.offer.unitId}`)), [choices]);
  const visibleOffers = (offersByGroup[activeGroup] || []).filter((offer) => !usedUnits.has(`${offer.roomId}:${offer.unitId}`));

  function addUser(content: string) { setMessages((current) => [...current, { role: "user", content }]); }
  function addAssistant(content: string) { setMessages((current) => [...current, { role: "assistant", content }]); }

  async function searchAll(groups: number[]) {
    setStep("searching");
    addAssistant(t.searching);
    try {
      const results: Offer[][] = [];
      for (const guests of groups) {
        const response = await fetch("/api/ai-assistant/smart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: `Check live availability from ${checkin} to ${checkout} for ${guests} guests.` }],
            search: { checkin, checkout, guests },
            language,
          }),
        });
        const payload = await response.json();
        results.push(Array.isArray(payload?.offers) ? payload.offers : []);
      }
      setOffersByGroup(results);
      setActiveGroup(0);
      if (!results[0]?.length) {
        addAssistant(t.noAvailability(1));
        setStep("complete");
        return;
      }
      addAssistant(t.choose(1, groups[0]));
      setStep("selecting");
    } catch {
      setError(language === "el" ? "Δεν ήταν δυνατός ο live έλεγχος. Δοκιμάστε ξανά." : "Live availability could not be checked. Please try again.");
      setStep("complete");
    }
  }

  function submitAnswer(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value || step === "searching" || step === "selecting" || step === "breakfast" || step === "complete") return;
    setError("");
    addUser(value);
    setInput("");

    if (step === "checkin") {
      const parsed = parseDate(value);
      if (!parsed) { setError(t.invalidDate); return; }
      setCheckin(parsed); setStep("checkout"); addAssistant(t.checkOut); return;
    }
    if (step === "checkout") {
      const parsed = parseDate(value);
      if (!parsed) { setError(t.invalidDate); return; }
      if (nightsBetween(checkin, parsed) < 1) { setError(t.invalidCheckout); return; }
      setCheckout(parsed); setStep("rooms"); addAssistant(t.rooms); return;
    }
    if (step === "rooms") {
      const count = Number(value.match(/\d+/)?.[0]);
      if (!Number.isInteger(count) || count < 1 || count > 3) { setError(t.invalidRooms); return; }
      setRoomCount(count); setGuestGroups([]); setGuestIndex(0); setStep("guests"); addAssistant(t.guests(1)); return;
    }
    if (step === "guests") {
      const guests = Number(value.match(/\d+/)?.[0]);
      if (!Number.isInteger(guests) || guests < 1 || guests > 5) { setError(t.invalidGuests); return; }
      const next = [...guestGroups, guests];
      setGuestGroups(next);
      if (guestIndex + 1 < roomCount) {
        setGuestIndex((index) => index + 1);
        addAssistant(t.guests(guestIndex + 2));
      } else {
        void searchAll(next);
      }
    }
  }

  function selectOffer(offer: Offer) {
    const nextChoices = [...choices.filter((choice) => choice.group !== activeGroup + 1), { group: activeGroup + 1, guests: guestGroups[activeGroup], offer }].sort((a, b) => a.group - b.group);
    setChoices(nextChoices);
    addUser(`${t.select(activeGroup + 1)}: ${offer.name}`);
    addAssistant(t.selected(activeGroup + 1, offer.name));

    const nextMissingGroup = Array.from({ length: roomCount }, (_, index) => index).find((index) => !nextChoices.some((choice) => choice.group === index + 1));
    if (typeof nextMissingGroup === "number") {
      const remaining = (offersByGroup[nextMissingGroup] || []).filter((candidate) => !new Set(nextChoices.map((choice) => `${choice.offer.roomId}:${choice.offer.unitId}`)).has(`${candidate.roomId}:${candidate.unitId}`));
      if (!remaining.length) {
        addAssistant(t.noAvailability(nextMissingGroup + 1));
        setStep("complete");
        return;
      }
      setActiveGroup(nextMissingGroup);
      addAssistant(t.choose(nextMissingGroup + 1, guestGroups[nextMissingGroup]));
    } else {
      setStep("breakfast");
      addAssistant(t.breakfast);
    }
  }

  function changeChoice(group: number) {
    setChoices((current) => current.filter((choice) => choice.group !== group));
    setBreakfast(null);
    setActiveGroup(group - 1);
    setStep("selecting");
    addAssistant(t.changing(group));
  }

  function chooseBreakfast(value: boolean) {
    setBreakfast(value);
    addUser(value ? t.breakfastYes : t.breakfastNo);
    addAssistant(t.complete);
    setStep("complete");
  }

  function reset() {
    setStep("checkin"); setMessages([{ role: "assistant", content: t.welcome }]); setInput(""); setCheckin(""); setCheckout("");
    setRoomCount(1); setGuestGroups([]); setGuestIndex(0); setOffersByGroup([]); setActiveGroup(0); setChoices([]); setBreakfast(null); setError("");
  }

  return (
    <main className="min-h-[100dvh] bg-[#fbfaf7] text-stone-950">
      <header className="border-b border-stone-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Voulamandis House</p><h1 className="mt-1 text-2xl font-bold">{t.title}</h1></div><div className="flex items-center gap-2"><select value={language} onChange={(event) => { const next = event.target.value as Language; setLanguage(next); setMessages([{ role: "assistant", content: COPY[next].welcome }]); }} className="rounded-xl border px-3 py-2"><option value="el">EL</option><option value="en">EN</option></select><span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 sm:block">{t.badge}</span></div></div></header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-7 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0">
          <div className="space-y-4 pb-32">
            {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[92%] rounded-2xl px-4 py-3 text-[15px] leading-6 sm:max-w-[78%] ${message.role === "user" ? "bg-stone-950 text-white" : "border border-stone-200 bg-white shadow-sm"}`}>{message.content}</div></div>)}

            {choices.length ? <div className="rounded-[24px] border border-stone-200 bg-white p-4 shadow-sm"><h2 className="text-base font-black">{t.yourChoices}</h2><div className="mt-3 grid gap-3 sm:grid-cols-2">{choices.map((choice) => <div key={choice.group} className="flex gap-3 rounded-2xl border border-stone-200 p-3"><div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100"><Image src={choice.offer.image} alt={choice.offer.name} fill sizes="96px" className="object-cover" /></div><div className="min-w-0 flex-1"><p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">{t.roomGroup} {choice.group}</p><p className="truncate font-bold">{choice.offer.name}</p><p className="text-xs text-stone-500">{choice.guests} {t.people} · €{choice.offer.directTotal.toFixed(0)}</p><button type="button" onClick={() => changeChoice(choice.group)} className="mt-2 text-xs font-bold text-emerald-700 underline underline-offset-2">{t.change}</button></div></div>)}</div></div> : null}

            {step === "selecting" ? <div className="grid gap-4 sm:grid-cols-2">{visibleOffers.map((offer, index) => <article key={`${offer.roomId}:${offer.unitId}`} className={`overflow-hidden rounded-[22px] border bg-white shadow-sm ${index === 0 ? "border-[#a7b777] ring-1 ring-[#dce5bf]" : "border-stone-200"}`}><div className="relative h-44 bg-stone-100"><Image src={offer.image} alt={offer.name} fill sizes="(max-width:640px) 100vw, 50vw" className="object-cover" /></div><div className="p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-black">{offer.name}</h2><p className="mt-1 text-xs font-semibold text-amber-700">{offer.category}</p></div><div className="text-right"><p className="text-xs text-stone-400 line-through">€{offer.originalTotal.toFixed(0)}</p><p className="text-2xl font-black text-[#43551b]">€{offer.directTotal.toFixed(0)}</p></div></div><div className="mt-3 flex flex-wrap gap-1.5">{[offer.floor, ...offer.features].filter(Boolean).slice(0, 4).map((item) => <span key={item} className="rounded-md border bg-stone-50 px-2 py-1 text-[10px] font-semibold">{item}</span>)}</div><button onClick={() => selectOffer(offer)} className="mt-4 w-full rounded-2xl bg-[#435f12] px-4 py-3.5 text-sm font-semibold text-white">{t.select(activeGroup + 1)}</button></div></article>)}</div> : null}

            {step === "breakfast" ? <div className="overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-sm"><div className="relative h-40 w-full sm:h-44"><Image src={BREAKFAST_IMAGE} alt={t.breakfastLabel} fill sizes="(max-width:640px) 100vw, 720px" className="object-cover" /></div><div className="p-4"><p className="text-sm leading-6 text-stone-700">{t.breakfast}</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><button onClick={() => chooseBreakfast(true)} className="rounded-2xl bg-[#435f12] px-5 py-4 font-semibold text-white">{t.breakfastYes}</button><button onClick={() => chooseBreakfast(false)} className="rounded-2xl border border-stone-300 bg-white px-5 py-4 font-semibold">{t.breakfastNo}</button></div></div></div> : null}
          </div>

          <div className="sticky bottom-0 border-t border-stone-200 bg-[#fbfaf7]/95 py-4 backdrop-blur">{error ? <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}<form onSubmit={submitAnswer} className="flex gap-2 rounded-2xl border bg-white p-2 shadow-lg"><input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} disabled={["searching", "selecting", "breakfast", "complete"].includes(step)} placeholder={t.placeholder} className="min-w-0 flex-1 bg-transparent px-3 py-2.5 outline-none disabled:opacity-50" /><button disabled={!input.trim() || ["searching", "selecting", "breakfast", "complete"].includes(step)} className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">{t.send}</button></form></div>
        </section>

        <aside className="h-fit rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm lg:sticky lg:top-6"><div className="flex items-center justify-between"><h2 className="text-lg font-black">{t.summary}</h2>{step === "complete" ? <button onClick={reset} className="text-xs font-semibold text-emerald-700">{t.newSearch}</button> : null}</div><div className="mt-4 space-y-3 text-sm"><div className="rounded-2xl bg-stone-50 p-3"><p className="text-xs text-stone-500">{t.dates}</p><p className="mt-1 font-semibold">{checkin || "—"} → {checkout || "—"}</p>{nights > 0 ? <p className="mt-1 text-xs text-stone-500">{nights} {t.nights}</p> : null}</div>{choices.map((choice) => <div key={choice.group} className="rounded-2xl border border-stone-200 p-3"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-emerald-700">{t.roomGroup} {choice.group}</p><p className="mt-1 font-semibold">{choice.offer.name}</p><p className="mt-1 text-xs text-stone-500">{choice.guests} {t.people}</p></div><button type="button" onClick={() => changeChoice(choice.group)} className="text-xs font-bold text-emerald-700">{t.change}</button></div><p className="mt-2 text-right font-black text-[#43551b]">€{choice.offer.directTotal.toFixed(0)}</p></div>)}<div className="border-t pt-3"><div className="flex justify-between"><span>{t.total}</span><strong>€{roomsTotal.toFixed(0)}</strong></div>{breakfast !== null ? <div className="mt-2 flex justify-between"><span>{t.breakfastLabel}</span><strong>{breakfast ? `€${breakfastTotal.toFixed(0)}` : "—"}</strong></div> : null}<div className="mt-3 flex justify-between text-lg"><span>{t.grandTotal}</span><strong className="text-[#43551b]">€{grandTotal.toFixed(0)}</strong></div></div></div></aside>
      </div>
    </main>
  );
}
