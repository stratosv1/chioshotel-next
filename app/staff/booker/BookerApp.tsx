"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type RoomMapping = {
  roomId: number;
  unitId: number;
  label: string;
  categoryLabel: string;
};

type BookerConfig = {
  rooms: RoomMapping[];
  hasPropertyId: boolean;
  hasRefreshToken: boolean;
  hasInviteCode: boolean;
  viberLink: string;
};

type BookingResult = {
  message?: string;
  bookingId?: string | number;
  reference?: string | null;
  roomLabel?: string;
  categoryLabel?: string;
  whatsappUrl?: string;
  viberMessage?: string;
  viberLink?: string;
  customerPhone?: string;
};

type StaffOffer = {
  roomId: string;
  unitId: string;
  roomNumber: number;
  name: string;
  category: string;
  floor: string;
  maxGuests: number;
  nights: number;
  originalTotal: number;
  directTotal: number;
  saving: number;
  image?: string;
  features?: string[];
};

type AvailabilityResponse = {
  success: boolean;
  message?: string;
  code?: string;
  offers?: StaffOffer[];
};

type Step =
  | "checkin"
  | "checkout"
  | "adults"
  | "children"
  | "rooms"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "language"
  | "price"
  | "comments"
  | "notes"
  | "review"
  | "done";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const languageOptions = [
  ["en", "English"],
  ["el", "Ελληνικά"],
  ["de", "Deutsch"],
  ["fr", "Français"],
  ["it", "Italiano"],
  ["es", "Español"],
  ["tr", "Türkçe"],
] as const;

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function nightsBetween(arrival: string, departure: string) {
  const start = new Date(`${arrival}T00:00:00Z`).getTime();
  const end = new Date(`${departure}T00:00:00Z`).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.round((end - start) / 86400000);
}

function money(value: number) {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function prettyDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function assistant(text: string): ChatMessage {
  return { id: makeId(), role: "assistant", text };
}

function user(text: string): ChatMessage {
  return { id: makeId(), role: "user", text };
}

const initialMessages = () => [
  assistant("Πάμε να καταχωρήσουμε νέα κράτηση στο Beds24. Θα σε ρωτήσω ένα-ένα τα στοιχεία και πριν την τελική καταχώρηση θα σου δείξω πλήρη σύνοψη."),
  assistant("Ποια είναι η ημερομηνία check-in;"),
];

export default function BookerApp() {
  const [config, setConfig] = useState<BookerConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<Step>("checkin");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [composer, setComposer] = useState("");
  const [offers, setOffers] = useState<StaffOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<StaffOffer | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);

  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [language, setLanguage] = useState("en");
  const [price, setPrice] = useState(0);
  const [comments, setComments] = useState("");
  const [notes, setNotes] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  const nights = useMemo(() => nightsBetween(arrival, departure), [arrival, departure]);
  const totalGuests = adults + children;
  const apiReady = Boolean(config?.hasPropertyId && (config?.hasRefreshToken || config?.hasInviteCode));

  useEffect(() => {
    async function loadConfig() {
      setLoadingConfig(true);
      const response = await fetch("/api/staff/booker/", {
        cache: "no-store",
        credentials: "same-origin",
      });

      if (response.ok) {
        setConfig((await response.json()) as BookerConfig);
      } else {
        setMessages((current) => [...current, assistant("Δεν μπόρεσα να φορτώσω τη σύνδεση με το Beds24. Κάνε refresh πριν προχωρήσεις σε πραγματική κράτηση.")]);
      }
      setLoadingConfig(false);
    }

    void loadConfig();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, step, offers, saving, searching]);

  function push(...items: ChatMessage[]) {
    setMessages((current) => [...current, ...items]);
  }

  function resetChat() {
    setStep("checkin");
    setMessages(initialMessages());
    setComposer("");
    setOffers([]);
    setSelectedOffer(null);
    setResult(null);
    setArrival("");
    setDeparture("");
    setAdults(2);
    setChildren(0);
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setLanguage("en");
    setPrice(0);
    setComments("");
    setNotes("");
  }

  async function findRooms(nextAdults: number, nextChildren: number) {
    const guests = nextAdults + nextChildren;
    setSearching(true);
    setOffers([]);
    push(assistant("Ελέγχω τώρα τη διαθεσιμότητα και τις τιμές στο Booking Core…"));

    const query = new URLSearchParams({
      checkin: arrival,
      checkout: departure,
      guests: String(guests),
      lang: "el",
      allowSplit: "0",
    });

    const response = await fetch(`/api/ai-room-finder/availability/?${query.toString()}`, {
      cache: "no-store",
      credentials: "same-origin",
    });
    const data = (await response.json().catch(() => null)) as AvailabilityResponse | null;
    setSearching(false);

    if (!response.ok || !data?.success) {
      push(assistant(data?.message || "Δεν μπόρεσα να ελέγξω τη διαθεσιμότητα. Ξεκίνα ξανά και δοκίμασε σε λίγο."));
      setStep("done");
      return;
    }

    const nextOffers = data.offers || [];
    setOffers(nextOffers);

    if (nextOffers.length === 0) {
      push(assistant("Δεν υπάρχει ένα διαθέσιμο δωμάτιο για όλη τη διαμονή. Δεν θα δημιουργήσω κράτηση."));
      setStep("done");
      return;
    }

    push(assistant(`Βρήκα ${nextOffers.length} διαθέσιμες επιλογές. Επίλεξε το δωμάτιο που θέλεις να καταχωρήσουμε.`));
    setStep("rooms");
  }

  function chooseOffer(offer: StaffOffer) {
    setSelectedOffer(offer);
    setPrice(offer.directTotal);
    push(
      user(`${offer.name} · ${money(offer.directTotal)}`),
      assistant("Ποιο είναι το όνομα του πελάτη;"),
    );
    setStep("firstName");
    setComposer("");
  }

  function chooseLanguage(value: string, label: string) {
    setLanguage(value);
    push(
      user(label),
      assistant(`Η προτεινόμενη συνολική τιμή από το Room Finder είναι ${money(selectedOffer?.directTotal || 0)}. Ποια τελική συνολική τιμή θέλεις να περάσω στο Beds24;`),
    );
    setStep("price");
    setComposer(selectedOffer ? String(selectedOffer.directTotal) : "");
  }

  function useSuggestedPrice() {
    if (!selectedOffer) return;
    setPrice(selectedOffer.directTotal);
    push(
      user(money(selectedOffer.directTotal)),
      assistant("Υπάρχει κάποιο μήνυμα/σχόλιο του πελάτη; Αν όχι, πάτησε Παράλειψη."),
    );
    setStep("comments");
    setComposer("");
  }

  function skipOptional() {
    if (step === "email") {
      setEmail("");
      push(user("Χωρίς email"), assistant("Ποιο είναι το κινητό/τηλέφωνο του πελάτη; Αν δεν υπάρχει, πάτησε Παράλειψη."));
      setStep("phone");
    } else if (step === "phone") {
      setMobile("");
      push(user("Χωρίς τηλέφωνο"), assistant("Σε ποια γλώσσα θέλεις να αποθηκευτεί η κράτηση;"));
      setStep("language");
    } else if (step === "comments") {
      setComments("");
      push(user("Χωρίς σχόλιο πελάτη"), assistant("Θέλεις κάποια εσωτερική σημείωση για το staff; Αν όχι, πάτησε Παράλειψη."));
      setStep("notes");
    } else if (step === "notes") {
      setNotes("");
      push(user("Χωρίς εσωτερική σημείωση"), assistant("Έχω όλα τα στοιχεία. Έλεγξε τη σύνοψη και μόνο αν είναι σωστά πάτησε «Καταχώρηση στο Beds24»."));
      setStep("review");
    }
    setComposer("");
  }

  function composerType() {
    if (step === "checkin" || step === "checkout") return "date";
    if (step === "adults" || step === "children" || step === "price") return "number";
    if (step === "email") return "email";
    if (step === "phone") return "tel";
    return "text";
  }

  function placeholder() {
    const values: Partial<Record<Step, string>> = {
      checkin: "Check-in",
      checkout: "Check-out",
      adults: "Αριθμός ενηλίκων",
      children: "Αριθμός παιδιών",
      firstName: "Όνομα",
      lastName: "Επώνυμο",
      email: "Email πελάτη",
      phone: "Τηλέφωνο / κινητό",
      price: "Συνολική τιμή €",
      comments: "Μήνυμα πελάτη",
      notes: "Εσωτερική σημείωση",
    };
    return values[step] || "Απάντηση";
  }

  async function handleComposerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = composer.trim();

    if (step === "checkin") {
      if (!value) return;
      setArrival(value);
      push(user(prettyDate(value)), assistant("Ποια είναι η ημερομηνία check-out;"));
      setStep("checkout");
      setComposer("");
      return;
    }

    if (step === "checkout") {
      if (!value || value <= arrival) {
        push(assistant("Το check-out πρέπει να είναι μετά το check-in. Δώσε ξανά ημερομηνία."));
        return;
      }
      setDeparture(value);
      push(user(prettyDate(value)), assistant("Πόσοι ενήλικες θα μείνουν;"));
      setStep("adults");
      setComposer("2");
      return;
    }

    if (step === "adults") {
      const parsed = Number.parseInt(value, 10);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
        push(assistant("Βάλε αριθμό ενηλίκων από 1 έως 5."));
        return;
      }
      setAdults(parsed);
      push(user(`${parsed} ${parsed === 1 ? "ενήλικας" : "ενήλικες"}`), assistant("Πόσα παιδιά; Αν δεν υπάρχουν, γράψε 0."));
      setStep("children");
      setComposer("0");
      return;
    }

    if (step === "children") {
      const parsed = Number.parseInt(value, 10);
      if (!Number.isInteger(parsed) || parsed < 0 || parsed > 4 || adults + parsed > 5) {
        push(assistant("Ο συνολικός αριθμός επισκεπτών πρέπει να είναι έως 5. Δώσε ξανά τον αριθμό παιδιών."));
        return;
      }
      setChildren(parsed);
      push(user(`${parsed} ${parsed === 1 ? "παιδί" : "παιδιά"}`));
      setComposer("");
      await findRooms(adults, parsed);
      return;
    }

    if (step === "firstName") {
      if (!value) return;
      setFirstName(value);
      push(user(value), assistant("Ποιο είναι το επώνυμο του πελάτη;"));
      setStep("lastName");
      setComposer("");
      return;
    }

    if (step === "lastName") {
      if (!value) return;
      setLastName(value);
      push(user(value), assistant("Ποιο είναι το email του πελάτη; Αν δεν υπάρχει, πάτησε Παράλειψη."));
      setStep("email");
      setComposer("");
      return;
    }

    if (step === "email") {
      if (!isEmail(value)) {
        push(assistant("Το email δεν φαίνεται έγκυρο. Δώσε ξανά email ή πάτησε Παράλειψη."));
        return;
      }
      setEmail(value);
      push(user(value), assistant("Ποιο είναι το κινητό/τηλέφωνο του πελάτη; Αν δεν υπάρχει, πάτησε Παράλειψη."));
      setStep("phone");
      setComposer("");
      return;
    }

    if (step === "phone") {
      if (!value) return;
      setMobile(value);
      push(user(value), assistant("Σε ποια γλώσσα θέλεις να αποθηκευτεί η κράτηση;"));
      setStep("language");
      setComposer("");
      return;
    }

    if (step === "price") {
      const parsed = Number(value.replace(",", "."));
      if (!Number.isFinite(parsed) || parsed < 0) {
        push(assistant("Δώσε έγκυρη συνολική τιμή."));
        return;
      }
      setPrice(parsed);
      push(user(money(parsed)), assistant("Υπάρχει κάποιο μήνυμα/σχόλιο του πελάτη; Αν όχι, πάτησε Παράλειψη."));
      setStep("comments");
      setComposer("");
      return;
    }

    if (step === "comments") {
      if (!value) return;
      setComments(value);
      push(user(value), assistant("Θέλεις κάποια εσωτερική σημείωση για το staff; Αν όχι, πάτησε Παράλειψη."));
      setStep("notes");
      setComposer("");
      return;
    }

    if (step === "notes") {
      if (!value) return;
      setNotes(value);
      push(user(value), assistant("Έχω όλα τα στοιχεία. Έλεγξε τη σύνοψη και μόνο αν είναι σωστά πάτησε «Καταχώρηση στο Beds24»."));
      setStep("review");
      setComposer("");
    }
  }

  async function createBooking() {
    if (!selectedOffer || saving || !apiReady) return;

    setSaving(true);
    push(user("Καταχώρηση στο Beds24"), assistant("Κάνω έναν τελευταίο server-side έλεγχο διαθεσιμότητας και δημιουργώ την κράτηση…"));

    const response = await fetch("/api/staff/booker/", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId: Number(selectedOffer.roomId),
        unitId: Number(selectedOffer.unitId),
        arrival,
        departure,
        title: "Mr",
        firstName,
        lastName,
        email,
        mobile,
        phone: "",
        language,
        adults,
        children,
        price,
        comments,
        notes,
        referrer: "Staff Direct",
      }),
    });

    const data = (await response.json().catch(() => null)) as BookingResult | null;
    setSaving(false);

    if (!response.ok || !data?.bookingId) {
      push(assistant(data?.message || "Η κράτηση δεν δημιουργήθηκε. Δεν έγινε επιτυχής καταχώρηση στο Beds24."));
      setStep("done");
      return;
    }

    setResult(data);
    push(assistant(`Η κράτηση δημιουργήθηκε επιτυχώς στο Beds24. Booking ID: ${data.bookingId}`));
    setStep("done");
  }

  const canCompose = !searching && !saving && !["rooms", "language", "review", "done"].includes(step);
  const optionalStep = ["email", "phone", "comments", "notes"].includes(step);

  return (
    <main className="min-h-screen bg-[#f3eee7] px-3 py-4 text-[#352f29] md:px-6 md:py-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-4 flex items-center justify-between gap-3 rounded-[22px] border border-[#ded5ca] bg-white px-4 py-3 shadow-sm md:px-5">
          <div className="min-w-0">
            <Link href="/staff" className="text-xs font-bold text-[#7c6a56] hover:underline">← Staff Area</Link>
            <h1 className="mt-1 truncate text-xl font-black md:text-2xl">Staff Booking Assistant</h1>
            <p className="text-xs text-[#746b60]">Booking Core → επιλογή δωματίου → Beds24</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className={`hidden rounded-full px-3 py-1.5 text-[11px] font-black sm:inline-flex ${apiReady ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-red-50 text-red-700 ring-1 ring-red-200"}`}>
              {loadingConfig ? "Έλεγχος API…" : apiReady ? "Beds24 ready" : "Beds24 unavailable"}
            </span>
            <button type="button" onClick={resetChat} className="rounded-xl border border-[#ded5ca] bg-[#faf7f2] px-3 py-2 text-xs font-black text-[#5f5347] hover:bg-[#f3ede5]">
              Νέα κράτηση
            </button>
          </div>
        </header>

        <section className="flex min-h-[76vh] flex-col overflow-hidden rounded-[26px] border border-[#d9d0c4] bg-[#faf8f4] shadow-[0_18px_50px_rgba(71,59,45,0.10)]">
          <div className="border-b border-[#e4ddd4] bg-white px-4 py-3 text-xs font-semibold text-[#70665c] md:px-5">
            Η κράτηση γράφεται στο Beds24 μόνο μετά την τελική επιβεβαίωση.
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-3 py-5 md:px-5">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" ? (
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#d7cdc0] bg-[#efe7dc] text-[11px] font-black text-[#6b5c4d]">VH</div>
                ) : null}
                <div className={`max-w-[84%] whitespace-pre-line px-4 py-3 text-[15px] leading-6 shadow-sm ${message.role === "user" ? "rounded-[20px] rounded-br-[6px] bg-[#6b604f] text-white" : "rounded-[20px] rounded-bl-[6px] border border-[#dfd6ca] bg-white"}`}>
                  {message.text}
                </div>
              </div>
            ))}

            {searching ? (
              <div className="ml-10 inline-flex h-10 items-center gap-1 rounded-[18px] rounded-bl-[6px] border border-[#dfd6ca] bg-white px-4 shadow-sm" aria-label="Searching">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9a8f82]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9a8f82] [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9a8f82] [animation-delay:300ms]" />
              </div>
            ) : null}

            {step === "rooms" && offers.length > 0 ? (
              <div className="ml-0 grid gap-3 md:ml-10 md:grid-cols-2">
                {offers.map((offer) => (
                  <button
                    type="button"
                    key={`${offer.roomId}:${offer.unitId}`}
                    onClick={() => chooseOffer(offer)}
                    className="overflow-hidden rounded-[20px] border border-[#ded5ca] bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#bca98f] hover:shadow-md"
                  >
                    {offer.image ? (
                      <div className="h-28 overflow-hidden bg-[#eee7de]">
                        <img src={offer.image} alt="" className="h-full w-full object-cover" />
                      </div>
                    ) : null}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black text-[#3f382f]">{offer.name}</p>
                          <p className="mt-1 text-xs font-semibold text-[#817568]">{offer.category} · {offer.floor}</p>
                        </div>
                        <span className="rounded-full bg-[#f2eadf] px-2.5 py-1 text-xs font-black text-[#6a5c4c]">έως {offer.maxGuests}</span>
                      </div>
                      <div className="mt-4 flex items-end justify-between gap-3">
                        <div>
                          {offer.originalTotal > offer.directTotal ? <p className="text-xs text-[#998d80] line-through">{money(offer.originalTotal)}</p> : null}
                          <p className="text-xl font-black text-[#4f453a]">{money(offer.directTotal)}</p>
                          <p className="text-[11px] font-semibold text-[#8c8074]">σύνολο · {offer.nights} νύχτες</p>
                        </div>
                        <span className="rounded-xl bg-[#6b604f] px-3 py-2 text-xs font-black text-white">Επιλογή</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}

            {step === "language" ? (
              <div className="ml-0 flex flex-wrap gap-2 md:ml-10">
                {languageOptions.map(([value, label]) => (
                  <button key={value} type="button" onClick={() => chooseLanguage(value, label)} className="rounded-full border border-[#d7cdc0] bg-white px-4 py-2.5 text-sm font-black text-[#5f5347] shadow-sm hover:bg-[#f3ede5]">
                    {label}
                  </button>
                ))}
              </div>
            ) : null}

            {step === "price" && selectedOffer ? (
              <div className="ml-0 md:ml-10">
                <button type="button" onClick={useSuggestedPrice} className="rounded-full border border-[#d7cdc0] bg-white px-4 py-2.5 text-sm font-black text-[#5f5347] shadow-sm hover:bg-[#f3ede5]">
                  Χρήση προτεινόμενης τιμής {money(selectedOffer.directTotal)}
                </button>
              </div>
            ) : null}

            {step === "review" && selectedOffer ? (
              <div className="ml-0 rounded-[22px] border border-[#d9d0c4] bg-white p-4 shadow-sm md:ml-10 md:p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a755e]">Τελικός έλεγχος</p>
                <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <div className="rounded-xl bg-[#faf7f2] p-3"><span className="text-[#897e72]">Διαμονή</span><strong className="mt-1 block">{prettyDate(arrival)} → {prettyDate(departure)} · {nights} νύχτες</strong></div>
                  <div className="rounded-xl bg-[#faf7f2] p-3"><span className="text-[#897e72]">Επισκέπτες</span><strong className="mt-1 block">{adults} ενήλικες · {children} παιδιά</strong></div>
                  <div className="rounded-xl bg-[#faf7f2] p-3"><span className="text-[#897e72]">Δωμάτιο</span><strong className="mt-1 block">{selectedOffer.name}</strong></div>
                  <div className="rounded-xl bg-[#faf7f2] p-3"><span className="text-[#897e72]">Τιμή</span><strong className="mt-1 block text-lg">{money(price)}</strong></div>
                  <div className="rounded-xl bg-[#faf7f2] p-3"><span className="text-[#897e72]">Πελάτης</span><strong className="mt-1 block">{firstName} {lastName}</strong></div>
                  <div className="rounded-xl bg-[#faf7f2] p-3"><span className="text-[#897e72]">Επικοινωνία</span><strong className="mt-1 block break-all">{email || "—"}<br />{mobile || "—"}</strong></div>
                </div>
                {comments || notes ? (
                  <div className="mt-2 rounded-xl bg-[#faf7f2] p-3 text-sm">
                    {comments ? <p><span className="text-[#897e72]">Guest:</span> <strong>{comments}</strong></p> : null}
                    {notes ? <p className="mt-1"><span className="text-[#897e72]">Staff note:</span> <strong>{notes}</strong></p> : null}
                  </div>
                ) : null}
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button type="button" onClick={() => void createBooking()} disabled={saving || !apiReady} className="rounded-xl bg-[#5f5548] px-5 py-3 text-sm font-black text-white hover:bg-[#50473d] disabled:cursor-not-allowed disabled:opacity-50">
                    {saving ? "Καταχώρηση…" : "Καταχώρηση στο Beds24"}
                  </button>
                  <button type="button" onClick={resetChat} className="rounded-xl border border-[#d7cdc0] bg-white px-5 py-3 text-sm font-black text-[#665a4d] hover:bg-[#f8f4ee]">
                    Ακύρωση / νέα κράτηση
                  </button>
                </div>
              </div>
            ) : null}

            {step === "done" ? (
              <div className="ml-0 flex flex-wrap gap-2 md:ml-10">
                {result?.whatsappUrl ? (
                  <a href={result.whatsappUrl} target="_blank" rel="noreferrer" className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-black text-white">WhatsApp πελάτη</a>
                ) : null}
                <button type="button" onClick={resetChat} className="rounded-full border border-[#d7cdc0] bg-white px-4 py-2.5 text-sm font-black text-[#5f5347]">Νέα κράτηση</button>
              </div>
            ) : null}

            <div ref={endRef} />
          </div>

          <div className="border-t border-[#e0d8ce] bg-white p-3 md:p-4">
            {canCompose ? (
              <form onSubmit={handleComposerSubmit} className="flex items-end gap-2">
                <div className="flex-1">
                  <input
                    autoFocus
                    type={composerType()}
                    min={step === "adults" ? 1 : step === "children" || step === "price" ? 0 : undefined}
                    max={step === "adults" ? 5 : step === "children" ? 4 : undefined}
                    step={step === "price" ? "0.01" : undefined}
                    value={composer}
                    onChange={(event) => setComposer(event.target.value)}
                    placeholder={placeholder()}
                    className="w-full rounded-[18px] border border-[#d8cfc3] bg-[#faf8f4] px-4 py-3.5 text-[15px] font-semibold text-[#3f382f] outline-none transition focus:border-[#a9957b] focus:bg-white focus:ring-4 focus:ring-[#eee7dd]"
                  />
                  {optionalStep ? (
                    <button type="button" onClick={skipOptional} className="mt-2 px-1 text-xs font-black text-[#857565] hover:underline">Παράλειψη</button>
                  ) : null}
                </div>
                <button type="submit" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#6b604f] text-xl font-black text-white shadow-sm hover:bg-[#5c5245]" aria-label="Αποστολή">
                  ↑
                </button>
              </form>
            ) : (
              <div className="py-1 text-center text-xs font-semibold text-[#8a8076]">
                {searching ? "Έλεγχος διαθεσιμότητας…" : saving ? "Δημιουργία κράτησης…" : step === "rooms" ? "Επίλεξε ένα δωμάτιο από τις επιλογές παραπάνω." : step === "language" ? "Επίλεξε γλώσσα." : step === "review" ? "Έλεγξε τη σύνοψη πριν την καταχώρηση." : ""}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
