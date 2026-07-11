"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { RoomWizardRoom } from "@/content/rooms";

type WizardLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

type RoomWizardTailwindProps = {
  rooms: RoomWizardRoom[];
  whatsappPhone: string;
  language?: WizardLanguage;
};

type LeadData = {
  firstName: string;
  lastName: string;
  checkin: string;
  checkout: string;
  email: string;
  phone: string;
};

type WizardPrefs = {
  guests?: number;
  budget?: boolean;
  noStairs?: boolean;
  upperView?: boolean;
  gardenView?: boolean;
  kitchen?: boolean;
};

type Question = {
  id: keyof WizardPrefs;
  question: string;
  options: Array<{
    title: string;
    hint: string;
    icon: string;
    value: WizardPrefs[keyof WizardPrefs];
  }>;
};

type WizardCopy = {
  title: string;
  text: string;
  firstName: string;
  lastName: string;
  checkin: string;
  checkout: string;
  email: string;
  phone: string;
  consent: string;
  start: string;
  back: string;
  step: string;
  bestMatch: string;
  alternatives: string;
  startOver: string;
  whatsapp: string;
  emailCta: string;
  alert: string;
  perfect: string;
  room: string;
  guests: string;
  beds: string;
  why: string;
  same: string;
  more: string;
  less: string;
  questions: Question[];
};

const enCopy: WizardCopy = {
  title: "Find the room that fits you",
  text: "Answer a few quick questions and we’ll suggest the best room or apartment for your stay in Chios.",
  firstName: "First name",
  lastName: "Last name",
  checkin: "Check-in",
  checkout: "Check-out",
  email: "Email",
  phone: "Phone",
  consent: "I consent to the processing of my personal data for accommodation suggestions.",
  start: "Start room finder",
  back: "Back",
  step: "Step",
  bestMatch: "Best match",
  alternatives: "Alternative options",
  startOver: "Start over",
  whatsapp: "WhatsApp",
  emailCta: "Email",
  alert: "Check-out must be after check-in.",
  perfect: "This option matches your criteria and gives you the best balance of comfort, access and value.",
  room: "Room",
  guests: "Guests",
  beds: "Beds",
  why: "Why it fits",
  same: "Same price category",
  more: "Higher price category",
  less: "Lower price category",
  questions: [
    { id: "guests", question: "How many guests?", options: [
      { title: "2 guests", hint: "Couple or two adults", icon: "👥", value: 2 },
      { title: "3 guests", hint: "Family or friends", icon: "👨‍👩‍👦", value: 3 },
      { title: "4 guests", hint: "Maximum comfort", icon: "👨‍👩‍👧‍👦", value: 4 },
    ]},
    { id: "budget", question: "Which price level do you prefer?", options: [
      { title: "Economy", hint: "More budget-friendly", icon: "💶", value: true },
      { title: "Standard / Premium", hint: "More comfort and options", icon: "✨", value: false },
    ]},
    { id: "noStairs", question: "Access & stairs?", options: [
      { title: "No stairs", hint: "Ground floor or stand-alone apartment", icon: "🧳", value: true },
      { title: "Stairs are OK", hint: "Includes first-floor options", icon: "🪜", value: false },
    ]},
    { id: "upperView", question: "Preferred view?", options: [
      { title: "Upper view", hint: "A more premium feel", icon: "👁️", value: true },
      { title: "Garden view", hint: "Peaceful and relaxed", icon: "🌿", value: false },
    ]},
    { id: "kitchen", question: "Do you need a kitchen?", options: [
      { title: "Yes", hint: "Full kitchen or kitchenette", icon: "🍳", value: true },
      { title: "No", hint: "A simpler room is fine", icon: "🍽️", value: false },
    ]},
  ],
};

const elCopy: WizardCopy = {
  ...enCopy,
  title: "Βρες το δωμάτιο που σου ταιριάζει",
  text: "Απάντησε σε λίγες γρήγορες ερωτήσεις και θα σου προτείνουμε το καλύτερο δωμάτιο ή διαμέρισμα για τη διαμονή σου στη Χίο.",
  firstName: "Όνομα",
  lastName: "Επώνυμο",
  checkin: "Άφιξη",
  checkout: "Αναχώρηση",
  email: "Email",
  phone: "Τηλέφωνο",
  consent: "Συναινώ στην επεξεργασία των προσωπικών μου δεδομένων για να λάβω πρόταση διαμονής.",
  start: "Ξεκίνα",
  back: "Πίσω",
  step: "Βήμα",
  bestMatch: "Καλύτερη επιλογή",
  alternatives: "Εναλλακτικές επιλογές",
  startOver: "Ξεκίνα ξανά",
  alert: "Η αναχώρηση πρέπει να είναι μετά την άφιξη.",
  perfect: "Αυτή η επιλογή ταιριάζει καλύτερα στα κριτήριά σου, με καλή ισορροπία άνεσης, πρόσβασης και τιμής.",
  room: "Δωμάτιο",
  guests: "Άτομα",
  beds: "Κρεβάτια",
  why: "Γιατί ταιριάζει",
  same: "Ίδια κατηγορία τιμής",
  more: "Υψηλότερη κατηγορία τιμής",
  less: "Χαμηλότερη κατηγορία τιμής",
  questions: [
    { id: "guests", question: "Πόσα άτομα είστε;", options: [
      { title: "2 άτομα", hint: "Ζευγάρι ή δύο ενήλικες", icon: "👥", value: 2 },
      { title: "3 άτομα", hint: "Οικογένεια ή φίλοι", icon: "👨‍👩‍👦", value: 3 },
      { title: "4 άτομα", hint: "Μέγιστη άνεση", icon: "👨‍👩‍👧‍👦", value: 4 },
    ]},
    { id: "budget", question: "Ποια κατηγορία τιμής προτιμάς;", options: [
      { title: "Οικονομικό", hint: "Πιο budget επιλογή", icon: "💶", value: true },
      { title: "Standard / Premium", hint: "Περισσότερη άνεση", icon: "✨", value: false },
    ]},
    { id: "noStairs", question: "Πρόσβαση και σκάλες;", options: [
      { title: "Χωρίς σκάλες", hint: "Ισόγειο ή αυτόνομο διαμέρισμα", icon: "🧳", value: true },
      { title: "Οι σκάλες είναι ΟΚ", hint: "Περιλαμβάνει επιλογές ορόφου", icon: "🪜", value: false },
    ]},
    { id: "upperView", question: "Τι θέα προτιμάς;", options: [
      { title: "Θέα από ψηλά", hint: "Πιο premium αίσθηση", icon: "👁️", value: true },
      { title: "Θέα στον κήπο", hint: "Ήρεμη ατμόσφαιρα", icon: "🌿", value: false },
    ]},
    { id: "kitchen", question: "Χρειάζεσαι κουζίνα;", options: [
      { title: "Ναι", hint: "Πλήρης κουζίνα ή kitchenette", icon: "🍳", value: true },
      { title: "Όχι", hint: "Ένα πιο απλό δωμάτιο είναι ΟΚ", icon: "🍽️", value: false },
    ]},
  ],
};

const copyByLanguage: Record<WizardLanguage, WizardCopy> = {
  en: enCopy,
  el: elCopy,
  fr: enCopy,
  de: enCopy,
  it: enCopy,
  es: enCopy,
  tr: enCopy,
};

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

function scoreRoom(room: RoomWizardRoom, prefs: WizardPrefs) {
  let score = 0;
  if (prefs.guests) score += room.maxGuests >= prefs.guests ? 34 : -1000;
  if (prefs.budget !== undefined) score += room.budget === prefs.budget ? 22 : -8;
  if (prefs.noStairs !== undefined) score += prefs.noStairs ? (!room.stairs ? 20 : -18) : 8;
  if (prefs.upperView !== undefined) score += prefs.upperView ? (room.upperView ? 14 : -6) : room.gardenView ? 14 : 0;
  if (prefs.kitchen !== undefined) score += prefs.kitchen ? (room.fullKitchen || room.kitchenette ? 16 : -10) : 4;
  score -= room.priceLevel * 0.4;
  return score;
}

function getTags(room: RoomWizardRoom, prefs: WizardPrefs, copy: WizardCopy) {
  const tags: Array<{ text: string; good: boolean }> = [];
  if (prefs.guests) tags.push({ text: `${room.maxGuests >= prefs.guests ? "✓" : "✕"} ${prefs.guests} ${copy.guests}`, good: room.maxGuests >= prefs.guests });
  if (prefs.budget !== undefined) tags.push({ text: room.budget ? "Economy" : "Standard", good: room.budget === prefs.budget });
  if (prefs.noStairs) tags.push({ text: room.stairs ? "Stairs" : "No stairs", good: !room.stairs });
  if (prefs.upperView !== undefined) tags.push({ text: prefs.upperView ? "Upper view" : "Garden view", good: prefs.upperView ? room.upperView : room.gardenView });
  if (prefs.kitchen) tags.push({ text: room.fullKitchen ? "Full kitchen" : room.kitchenette ? "Kitchenette" : "No kitchen", good: room.fullKitchen || room.kitchenette });
  return tags;
}

function getWhatsAppUrl(room: RoomWizardRoom, lead: LeadData, prefs: WizardPrefs, phone: string, copy: WizardCopy) {
  const text = `Hello! My name is ${lead.firstName} ${lead.lastName} and I would like to ask about:\n\n${copy.room}: ${room.name}\n${copy.checkin}: ${lead.checkin}\n${copy.checkout}: ${lead.checkout}\n${copy.guests}: ${prefs.guests || "-"}\n${copy.email}: ${lead.email}\n${copy.phone}: ${lead.phone}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function RoomGallery({ room }: { room: RoomWizardRoom }) {
  const [activeImage, setActiveImage] = useState(room.images[0] || "");
  if (!room.images.length) return null;
  return (
    <div className="my-5 overflow-hidden rounded-3xl border border-[#6f7f3f]/20 bg-white">
      <img className="h-[240px] w-full object-cover md:h-[300px]" src={activeImage} alt={room.name} loading="lazy" />
      <div className="grid grid-cols-4 gap-2 p-2">
        {room.images.slice(0, 4).map((image, index) => (
          <button type="button" className={`aspect-square overflow-hidden rounded-2xl border-2 ${activeImage === image ? "border-[#3f4f2f]" : "border-transparent"}`} key={image} onClick={() => setActiveImage(image)} aria-label={`${room.name} photo ${index + 1}`}>
            <img className="h-full w-full object-cover" src={image} alt={`${room.name} ${index + 1}`} loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}

function RoomCard({ room, bestRoom, lead, prefs, whatsappPhone, copy, label }: { room: RoomWizardRoom; bestRoom: RoomWizardRoom; lead: LeadData; prefs: WizardPrefs; whatsappPhone: string; copy: WizardCopy; label: string }) {
  const tags = getTags(room, prefs, copy);
  const priceText = room.priceLevel > bestRoom.priceLevel ? copy.more : room.priceLevel < bestRoom.priceLevel ? copy.less : copy.same;
  return (
    <article className="rounded-[2rem] border border-[#6f7f3f]/20 bg-white p-5 shadow-xl shadow-stone-900/5 md:p-7">
      <span className="inline-flex rounded-full bg-[#3f4f2f] px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-white">{label}</span>
      <h3 className="mt-4 text-3xl font-black leading-none tracking-[-0.04em] text-[#2f261f] md:text-4xl">{room.name}</h3>
      <p className="mt-2 text-sm italic text-stone-600">{room.type} • {room.location}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex rounded-full border border-[#6f7f3f]/20 bg-[#eef3e5] px-3 py-1.5 text-xs font-black text-[#3f4f2f]">{priceText}</span>
        {tags.map((tag) => <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ${tag.good ? "bg-[#eef3e5] text-[#3f4f2f]" : "bg-rose-50 text-rose-800"}`} key={tag.text}>{tag.text}</span>)}
      </div>
      <div className="mt-4 flex flex-wrap gap-2" aria-label={copy.beds}>
        {room.beds.double > 0 && <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold">🛏️ Double x{room.beds.double}</span>}
        {room.beds.single > 0 && <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold">🛌 Single x{room.beds.single}</span>}
        {room.beds.sofa > 0 && <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold">🛋️ Sofa x{room.beds.sofa}</span>}
      </div>
      <RoomGallery room={room} />
      <div className="rounded-3xl border border-[#6f7f3f]/20 bg-[#f7f9f1] p-4">
        <h4 className="text-xs font-black uppercase tracking-[0.12em] text-[#3f4f2f]">{copy.why}</h4>
        <p className="mt-2 text-sm leading-6 text-stone-600">{copy.perfect}</p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25d366] px-5 text-xs font-black uppercase tracking-[0.1em] text-white" href={getWhatsAppUrl(room, lead, prefs, whatsappPhone, copy)} target="_blank" rel="noopener noreferrer">{copy.whatsapp}</a>
        <a className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#6f7f3f]/25 bg-[#efe6d8] px-5 text-xs font-black uppercase tracking-[0.1em] text-[#3f4f2f]" href={`mailto:info@chioshotel.gr?subject=${encodeURIComponent(`${copy.room} - ${lead.firstName} ${lead.lastName} - ${room.name}`)}`}>{copy.emailCta}</a>
      </div>
    </article>
  );
}

export function RoomWizardTailwind({ rooms, whatsappPhone, language = "en" }: RoomWizardTailwindProps) {
  const copy = copyByLanguage[language] ?? copyByLanguage.en;
  const minDate = getTomorrowDate();
  const [lead, setLead] = useState<LeadData>({ firstName: "", lastName: "", checkin: "", checkout: "", email: "", phone: "" });
  const [prefs, setPrefs] = useState<WizardPrefs>({});
  const [hasStarted, setHasStarted] = useState(false);
  const [step, setStep] = useState(0);
  const currentQuestion = copy.questions[step];
  const isFinished = hasStarted && step >= copy.questions.length;
  const results = useMemo(() => rooms.map((room) => ({ room, score: scoreRoom(room, prefs) })).filter((item) => item.score > -999).sort((a, b) => b.score - a.score).map((item) => item.room), [prefs, rooms]);
  const bestRoom = results[0];
  const alternativeRooms = results.slice(1, 3);

  function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lead.checkin || !lead.checkout || lead.checkout <= lead.checkin) {
      alert(copy.alert);
      return;
    }
    setHasStarted(true);
    setStep(0);
  }

  return (
    <section className="mx-auto mb-12 w-[min(780px,100%)] scroll-mt-20" id="room-wizard-app" aria-labelledby="rw-main-title">
      <div className="overflow-hidden rounded-[2rem] border border-[#6f7f3f]/20 bg-[radial-gradient(circle_at_top_left,rgba(111,127,63,.16),transparent_22rem),linear-gradient(180deg,#fffdfa,#f7f9f1)] p-[clamp(24px,5vw,46px)] shadow-2xl shadow-stone-900/10">
        {hasStarted && !isFinished ? (
          <header className="mb-8">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div className="text-xl font-black text-[#2f261f]">🏠 {copy.title}</div>
              <div className="text-xs font-black uppercase tracking-[0.12em] text-[#3f4f2f]">{copy.step} {Math.min(step + 1, copy.questions.length)}/{copy.questions.length}</div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#6f7f3f]/15"><div className="h-full rounded-full bg-gradient-to-r from-[#3f4f2f] to-[#6f7f3f] transition-all" style={{ width: `${((step + 1) / copy.questions.length) * 100}%` }} /></div>
          </header>
        ) : null}

        {!hasStarted ? (
          <>
            <header className="mb-8 text-center">
              <h3 className="m-0 text-[clamp(28px,4vw,42px)] font-black leading-none tracking-[-0.045em] text-[#2f261f]" id="rw-main-title">{copy.title}</h3>
              <p className="mx-auto mt-4 max-w-[560px] text-base leading-7 text-stone-600">{copy.text}</p>
            </header>
            <form onSubmit={handleLeadSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["firstName", copy.firstName, "given-name", "text"],
                  ["lastName", copy.lastName, "family-name", "text"],
                  ["checkin", copy.checkin, undefined, "date"],
                  ["checkout", copy.checkout, undefined, "date"],
                  ["email", copy.email, "email", "email"],
                  ["phone", copy.phone, "tel", "tel"],
                ].map(([key, label, autoComplete, type]) => (
                  <label className="grid gap-2" key={key}>
                    <span className="ml-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#3f4f2f]">{label}</span>
                    <input className="min-h-[58px] rounded-full border-2 border-[#6f7f3f]/20 bg-white px-5 text-base text-[#2f261f] outline-none transition focus:border-[#3f4f2f] focus:ring-4 focus:ring-[#6f7f3f]/15" type={type} min={type === "date" ? minDate : undefined} required autoComplete={autoComplete} value={lead[key as keyof LeadData]} onChange={(event) => setLead((current) => ({ ...current, [key]: event.target.value }))} />
                  </label>
                ))}
                <label className="flex items-start gap-3 px-2 text-sm leading-6 text-stone-600 md:col-span-2"><input className="mt-1 h-5 w-5 accent-[#3f4f2f]" type="checkbox" required />{copy.consent}</label>
              </div>
              <button type="submit" className="mt-7 w-full rounded-full bg-[#3f4f2f] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-xl shadow-stone-900/15 transition hover:-translate-y-0.5 hover:bg-[#53683b]">{copy.start}</button>
            </form>
          </>
        ) : null}

        {hasStarted && !isFinished && currentQuestion ? (
          <div>
            <h3 className="text-[clamp(26px,4vw,40px)] font-black leading-none tracking-[-0.045em] text-[#2f261f]">{currentQuestion.question}</h3>
            <div className="mt-6 grid gap-4">
              {currentQuestion.options.map((option) => (
                <button type="button" className="group flex w-full items-center gap-4 rounded-3xl border-2 border-transparent bg-white p-4 text-left shadow-lg shadow-stone-900/5 transition hover:-translate-y-0.5 hover:border-[#3f4f2f]/40 hover:shadow-xl" key={option.title} onClick={() => { setPrefs((current) => ({ ...current, [currentQuestion.id]: option.value })); setStep((current) => current + 1); }}>
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eef3e5] text-3xl ring-1 ring-[#6f7f3f]/20">{option.icon}</span>
                  <span><strong className="block text-lg font-black text-[#2f261f]">{option.title}</strong><small className="mt-1 block text-sm leading-6 text-stone-600">{option.hint}</small></span>
                </button>
              ))}
            </div>
            <button type="button" className="mt-5 rounded-full border border-[#6f7f3f]/20 bg-white px-5 py-3 text-sm font-black text-[#3f4f2f]" onClick={() => setStep((current) => Math.max(0, current - 1))}>{copy.back}</button>
          </div>
        ) : null}

        {isFinished && bestRoom ? (
          <div className="grid gap-6">
            <RoomCard room={bestRoom} bestRoom={bestRoom} lead={lead} prefs={prefs} whatsappPhone={whatsappPhone} copy={copy} label={copy.bestMatch} />
            {alternativeRooms.length ? <h3 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#2f261f]">{copy.alternatives}</h3> : null}
            {alternativeRooms.map((room) => <RoomCard key={room.id} room={room} bestRoom={bestRoom} lead={lead} prefs={prefs} whatsappPhone={whatsappPhone} copy={copy} label={copy.alternatives} />)}
            <button type="button" className="rounded-full border border-[#6f7f3f]/20 bg-[#eef3e5] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#3f4f2f]" onClick={() => { setHasStarted(false); setStep(0); setPrefs({}); }}>{copy.startOver}</button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
