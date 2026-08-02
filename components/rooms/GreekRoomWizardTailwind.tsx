"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { RoomWizardRoom } from "@/content/rooms";

type Props = {
  rooms: RoomWizardRoom[];
  whatsappPhone: string;
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

const questions: Question[] = [
  {
    id: "guests",
    question: "Πόσα άτομα θα μείνετε;",
    options: [
      { title: "2 άτομα", hint: "Ζευγάρι ή δύο ενήλικες", icon: "👥", value: 2 },
      { title: "3 άτομα", hint: "Οικογένεια ή φίλοι", icon: "👨‍👩‍👦", value: 3 },
      { title: "4 άτομα", hint: "Περισσότερος χώρος για οικογένεια", icon: "👨‍👩‍👧‍👦", value: 4 },
    ],
  },
  {
    id: "budget",
    question: "Ποια κατηγορία τιμής προτιμάτε;",
    options: [
      { title: "Οικονομική", hint: "Πιο προσιτή επιλογή", icon: "💶", value: true },
      { title: "Άνεση / αναβαθμισμένη επιλογή", hint: "Περισσότερες επιλογές χώρου και θέσης", icon: "✨", value: false },
    ],
  },
  {
    id: "noStairs",
    question: "Προτιμάτε πρόσβαση χωρίς σκάλες;",
    options: [
      { title: "Χωρίς σκάλες", hint: "Ισόγειο ή ανεξάρτητο διαμέρισμα", icon: "🧳", value: true },
      { title: "Οι σκάλες δεν είναι πρόβλημα", hint: "Περιλαμβάνονται και επιλογές ορόφου", icon: "🪜", value: false },
    ],
  },
  {
    id: "upperView",
    question: "Ποια θέση προτιμάτε;",
    options: [
      { title: "Όροφος και θέα", hint: "Πιο φωτεινή και ανοιχτή αίσθηση", icon: "👁️", value: true },
      { title: "Κοντά στον κήπο", hint: "Ήρεμη ατμόσφαιρα και εύκολη πρόσβαση", icon: "🌿", value: false },
    ],
  },
  {
    id: "kitchen",
    question: "Χρειάζεστε κουζίνα;",
    options: [
      { title: "Ναι", hint: "Πλήρης κουζίνα ή μικρή κουζίνα", icon: "🍳", value: true },
      { title: "Όχι", hint: "Ένα δωμάτιο χωρίς κουζίνα είναι αρκετό", icon: "🍽️", value: false },
    ],
  },
];

const roomTypeLabels: Record<string, string> = {
  "First Floor Double/Triple room": "Δίκλινο / τρίκλινο δωμάτιο ορόφου",
  "Ground Floor Double/Triple room": "Ισόγειο δίκλινο / τρίκλινο δωμάτιο",
  "Economy double": "Οικονομικό δίκλινο δωμάτιο",
  Apartment: "Οικογενειακό διαμέρισμα",
};

const locationLabels: Record<string, string> = {
  "First Floor": "Όροφος",
  "Ground Floor": "Ισόγειο",
  "Stand Alone": "Ανεξάρτητο διαμέρισμα",
};

function roomName(name: string) {
  return name.replace(/^Room\s+(\d+)$/i, "Δωμάτιο $1").replace(/^Apartment\s+(\d+)$/i, "Διαμέρισμα $1");
}

function roomType(type: string) {
  return roomTypeLabels[type] || type;
}

function roomLocation(location: string) {
  return locationLabels[location] || location;
}

function tomorrowDate() {
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

function getWhatsAppUrl(room: RoomWizardRoom, lead: LeadData, prefs: WizardPrefs, phone: string) {
  const guests = prefs.guests ? String(prefs.guests) : "-";
  const text = `Γεια σας! Ονομάζομαι ${lead.firstName} ${lead.lastName} και θα ήθελα πληροφορίες για:\n\nΔωμάτιο: ${roomName(room.name)}\nΆφιξη: ${lead.checkin}\nΑναχώρηση: ${lead.checkout}\nΆτομα: ${guests}\nEmail: ${lead.email}\nΤηλέφωνο: ${lead.phone}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function roomTags(room: RoomWizardRoom, prefs: WizardPrefs) {
  const tags: string[] = [];
  if (prefs.guests) tags.push(`${room.maxGuests >= prefs.guests ? "✓" : "✕"} ${prefs.guests} άτομα`);
  if (prefs.budget !== undefined) tags.push(room.budget ? "Οικονομική κατηγορία" : "Αναβαθμισμένη κατηγορία");
  if (prefs.noStairs) tags.push(room.stairs ? "Με σκάλες" : "Χωρίς σκάλες");
  if (prefs.upperView !== undefined) tags.push(prefs.upperView ? "Όροφος / θέα" : "Κοντά στον κήπο");
  if (prefs.kitchen) tags.push(room.fullKitchen ? "Πλήρης κουζίνα" : room.kitchenette ? "Μικρή κουζίνα" : "Χωρίς κουζίνα");
  return tags;
}

export function GreekRoomWizardTailwind({ rooms, whatsappPhone }: Props) {
  const minDate = tomorrowDate();
  const [lead, setLead] = useState<LeadData>({ firstName: "", lastName: "", checkin: "", checkout: "", email: "", phone: "" });
  const [prefs, setPrefs] = useState<WizardPrefs>({});
  const [hasStarted, setHasStarted] = useState(false);
  const [step, setStep] = useState(0);

  const currentQuestion = questions[step];
  const isFinished = hasStarted && step >= questions.length;
  const results = useMemo(
    () =>
      rooms
        .map((room) => ({ room, score: scoreRoom(room, prefs) }))
        .filter((item) => item.score > -999)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.room),
    [prefs, rooms],
  );
  const visibleResults = results.slice(0, 3);

  function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lead.checkin || !lead.checkout || lead.checkout <= lead.checkin) {
      alert("Η αναχώρηση πρέπει να είναι μετά την άφιξη.");
      return;
    }
    setHasStarted(true);
    setStep(0);
  }

  return (
    <section className="mx-auto mb-12 w-[min(780px,100%)] scroll-mt-20" id="room-wizard-app" aria-labelledby="greek-room-wizard-title">
      <div className="overflow-hidden rounded-[2rem] border border-[#6f7f3f]/20 bg-[radial-gradient(circle_at_top_left,rgba(111,127,63,.16),transparent_22rem),linear-gradient(180deg,#fffdfa,#f7f9f1)] p-[clamp(24px,5vw,46px)] shadow-2xl shadow-stone-900/10">
        {!hasStarted ? (
          <>
            <header className="mb-8 text-center">
              <h3 className="m-0 text-[clamp(28px,4vw,42px)] font-black leading-none tracking-[-0.045em] text-[#2f261f]" id="greek-room-wizard-title">Βρείτε το δωμάτιο που σας ταιριάζει</h3>
              <p className="mx-auto mt-4 max-w-[560px] text-base leading-7 text-stone-600">Απαντήστε σε λίγες ερωτήσεις και θα προτείνουμε το δωμάτιο ή διαμέρισμα που ταιριάζει καλύτερα στη διαμονή σας στη Χίο.</p>
            </header>
            <form onSubmit={handleLeadSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["firstName", "Όνομα", "given-name", "text"],
                  ["lastName", "Επώνυμο", "family-name", "text"],
                  ["checkin", "Άφιξη", undefined, "date"],
                  ["checkout", "Αναχώρηση", undefined, "date"],
                  ["email", "Email", "email", "email"],
                  ["phone", "Τηλέφωνο", "tel", "tel"],
                ].map(([key, label, autoComplete, type]) => (
                  <label className="grid gap-2" key={key}>
                    <span className="ml-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#3f4f2f]">{label}</span>
                    <input className="min-h-[58px] rounded-full border-2 border-[#6f7f3f]/20 bg-white px-5 text-base text-[#2f261f] outline-none transition focus:border-[#3f4f2f] focus:ring-4 focus:ring-[#6f7f3f]/15" type={type} min={type === "date" ? minDate : undefined} required autoComplete={autoComplete} value={lead[key as keyof LeadData]} onChange={(event) => setLead((current) => ({ ...current, [key]: event.target.value }))} />
                  </label>
                ))}
                <label className="flex items-start gap-3 px-2 text-sm leading-6 text-stone-600 md:col-span-2"><input className="mt-1 h-5 w-5 accent-[#3f4f2f]" type="checkbox" required />Συναινώ στην επεξεργασία των προσωπικών μου δεδομένων για να λάβω πρόταση διαμονής.</label>
              </div>
              <button type="submit" className="mt-7 w-full rounded-full bg-[#3f4f2f] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-xl shadow-stone-900/15 transition hover:-translate-y-0.5 hover:bg-[#53683b]">Ξεκινήστε</button>
            </form>
          </>
        ) : null}

        {hasStarted && !isFinished && currentQuestion ? (
          <div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <strong className="text-sm text-[#3f4f2f]">Βήμα {step + 1}/{questions.length}</strong>
              <button type="button" className="rounded-full border border-[#6f7f3f]/20 bg-white px-4 py-2 text-xs font-black text-[#3f4f2f]" onClick={() => setStep((current) => Math.max(0, current - 1))}>Πίσω</button>
            </div>
            <h3 className="text-[clamp(26px,4vw,40px)] font-black leading-none tracking-[-0.045em] text-[#2f261f]">{currentQuestion.question}</h3>
            <div className="mt-6 grid gap-4">
              {currentQuestion.options.map((option) => (
                <button type="button" className="group flex w-full items-center gap-4 rounded-3xl border-2 border-transparent bg-white p-4 text-left shadow-lg shadow-stone-900/5 transition hover:-translate-y-0.5 hover:border-[#3f4f2f]/40 hover:shadow-xl" key={option.title} onClick={() => { setPrefs((current) => ({ ...current, [currentQuestion.id]: option.value })); setStep((current) => current + 1); }}>
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eef3e5] text-3xl ring-1 ring-[#6f7f3f]/20">{option.icon}</span>
                  <span><strong className="block text-lg font-black text-[#2f261f]">{option.title}</strong><small className="mt-1 block text-sm leading-6 text-stone-600">{option.hint}</small></span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {isFinished && visibleResults.length ? (
          <div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-2xl font-black tracking-[-0.04em] text-[#2f261f]">Οι καλύτερες επιλογές για εσάς</h3>
              <span className="rounded-full bg-[#eef3e5] px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#3f4f2f]">Σύρετε →</span>
            </div>
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {visibleResults.map((room, index) => {
                const tags = roomTags(room, prefs);
                const label = index === 0 ? "Καλύτερη επιλογή" : "Εναλλακτική επιλογή";
                return (
                  <article className="w-[86vw] max-w-[430px] flex-none snap-start rounded-[2rem] border border-[#6f7f3f]/20 bg-white p-5 shadow-xl shadow-stone-900/5 md:w-[560px] md:max-w-[560px] md:p-7" key={room.id}>
                    <span className="inline-flex rounded-full bg-[#3f4f2f] px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-white">{label}</span>
                    <h4 className="mt-4 text-3xl font-black leading-none tracking-[-0.04em] text-[#2f261f]">{roomName(room.name)}</h4>
                    <p className="mt-2 text-sm italic text-stone-600">{roomType(room.type)} • {roomLocation(room.location)}</p>
                    <div className="mt-4 flex flex-wrap gap-2">{tags.map((tag) => <span className="inline-flex rounded-full bg-[#eef3e5] px-3 py-1.5 text-xs font-black text-[#3f4f2f]" key={tag}>{tag}</span>)}</div>
                    {room.images[0] ? <img className="mt-5 h-[240px] w-full rounded-3xl object-cover" src={room.images[0]} alt={`${roomName(room.name)} στο Voulamandis House`} loading="lazy" /> : null}
                    <div className="mt-4 flex flex-wrap gap-2" aria-label="Κρεβάτια">
                      {room.beds.double > 0 ? <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold">🛏️ Διπλό ×{room.beds.double}</span> : null}
                      {room.beds.single > 0 ? <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold">🛌 Μονό ×{room.beds.single}</span> : null}
                      {room.beds.sofa > 0 ? <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold">🛋️ Καναπές-κρεβάτι ×{room.beds.sofa}</span> : null}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-stone-600">Η επιλογή αυτή ταιριάζει στα κριτήριά σας με βάση χωρητικότητα, πρόσβαση, θέση, κουζίνα και κατηγορία τιμής.</p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <a className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25d366] px-5 text-xs font-black uppercase tracking-[0.1em] text-white" href={getWhatsAppUrl(room, lead, prefs, whatsappPhone)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                      <a className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#6f7f3f]/25 bg-[#efe6d8] px-5 text-xs font-black uppercase tracking-[0.1em] text-[#3f4f2f]" href={`mailto:chioshotel@gmail.com?subject=${encodeURIComponent(`Δωμάτιο - ${lead.firstName} ${lead.lastName} - ${roomName(room.name)}`)}`}>Email</a>
                    </div>
                  </article>
                );
              })}
            </div>
            <button type="button" className="mt-2 w-full rounded-full border border-[#6f7f3f]/20 bg-[#eef3e5] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#3f4f2f]" onClick={() => { setHasStarted(false); setStep(0); setPrefs({}); }}>Ξεκινήστε ξανά</button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
