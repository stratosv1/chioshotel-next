"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { RoomCarousel } from "@/components/ui/RoomCarousel";

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

type SearchState = { checkin?: string; checkout?: string; guests?: number };
type Message = { role: "user" | "assistant"; content: string; offers?: Offer[] };

type AmenityBadge = { icon: string; label: string };

const ROOM_GALLERIES: Record<string, string[]> = {
  "267788:1": [
    "/images/rooms/DSC07776-2-e1675109942622.webp",
    "/images/rooms/DSC07769-1.webp",
    "/images/rooms/----1-1.webp",
    "/images/rooms/voulamandis-house-bathrooms-1.webp",
  ],
  "268803:1": ["/images/rooms/DSC07803-1.webp"],
  "267788:2": [
    "/images/rooms/DSC07867-1.webp",
    "/images/rooms/DSC07860-1.webp",
    "/images/rooms/DSC07849-1.webp",
    "/images/rooms/DSC07891-1.webp",
  ],
  "267788:3": [
    "/images/rooms/received_1748354861920234.webp",
    "/images/rooms/received_1748358935253160.webp",
    "/images/rooms/received_1748356725253381.webp",
    "/images/rooms/received_1748356718586715.webp",
  ],
  "626129:1": [
    "/images/rooms/voulamandis-house-rooms.webp",
    "/images/rooms/chios-hotels-triple-rooms_1646x1080.webp",
    "/images/rooms/voulamandis-house-double-room-bathroom_1620x1080.webp",
    "/images/rooms/hotels-chios-voulamandis_1620x1080.webp",
  ],
  "268803:2": ["/images/rooms/received_1753964631359257.webp"],
  "626129:2": [
    "/images/rooms/double-triple-room.jpg",
    "/images/rooms/view-double-room-chios-hotels.webp",
    "/images/rooms/double-room-bathroom.webp",
    "/images/rooms/voulamandis-stone-bathroom.webp",
  ],
  "265595:1": [
    "/images/rooms/chios-apartments-voulamandis.webp",
    "/images/rooms/DSC07899.webp",
  ],
  "265595:2": [
    "/images/rooms/chios-apartments-voulamandis.webp",
    "/images/rooms/DSC07899.webp",
  ],
  "265595:3": [
    "/images/rooms/DSC07899.webp",
    "/images/rooms/chios-apartments-voulamandis.webp",
  ],
};

function formatEuro(value: number) {
  return new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("el-GR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

function unique(values: string[]) {
  return values.filter(Boolean).filter((value, index, all) => all.indexOf(value) === index);
}

function featureToBadge(feature: string): AmenityBadge {
  const normalized = feature.toLowerCase();
  if (normalized.includes("wi-fi") || normalized.includes("wifi")) return { icon: "📶", label: "Δωρεάν Wi‑Fi" };
  if (normalized.includes("kitchen") || normalized.includes("κουζ")) return { icon: "🍽️", label: "Kitchenette" };
  if (normalized.includes("balcony") || normalized.includes("μπαλκ")) return { icon: "🌤️", label: "Μπαλκόνι" };
  if (normalized.includes("garden") || normalized.includes("κήπ")) return { icon: "🌿", label: "Θέα / πρόσβαση κήπου" };
  if (normalized.includes("no stairs") || normalized.includes("χωρίς σκάλ")) return { icon: "♿", label: "Χωρίς σκάλες" };
  if (normalized.includes("stairs") || normalized.includes("σκάλ")) return { icon: "🪜", label: "Πρόσβαση με σκάλες" };
  if (normalized.includes("double bed")) return { icon: "🛏️", label: "Διπλό κρεβάτι" };
  if (normalized.includes("single bed")) return { icon: "🛏️", label: "Μονό κρεβάτι" };
  if (normalized.includes("sofa bed")) return { icon: "🛋️", label: "Καναπές‑κρεβάτι" };
  if (normalized.includes("two spaces")) return { icon: "🚪", label: "Δύο χώροι" };
  if (normalized.includes("open-plan")) return { icon: "📐", label: "Ενιαίος χώρος" };
  if (normalized.includes("first floor")) return { icon: "⬆️", label: "Πρώτος όροφος" };
  if (normalized.includes("ground floor")) return { icon: "🏡", label: "Ισόγειο" };
  if (normalized.includes("kettle") || normalized.includes("coffee")) return { icon: "☕", label: "Βραστήρας καφέ / τσαγιού" };
  return { icon: "✓", label: feature };
}

export function GuestAssistantSales() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Πείτε μου πότε θέλετε να έρθετε, για πόσες νύχτες και για πόσα άτομα. Θα ψάξω αμέσως τις διαθέσιμες επιλογές." },
  ]);
  const [search, setSearch] = useState<SearchState>({});
  const [language, setLanguage] = useState("el");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailsOffer, setDetailsOffer] = useState<Offer | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [requestName, setRequestName] = useState("");
  const [requestContact, setRequestContact] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [requestSending, setRequestSending] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  const gallery = useMemo(() => {
    if (!detailsOffer) return [];
    return unique([detailsOffer.image, ...(ROOM_GALLERIES[`${detailsOffer.roomId}:${detailsOffer.unitId}`] || [])]);
  }, [detailsOffer]);

  const amenityBadges = useMemo(() => {
    if (!detailsOffer) return [];
    return unique([detailsOffer.floor, ...detailsOffer.features])
      .map(featureToBadge)
      .filter((item, index, all) => all.findIndex((other) => other.label === item.label) === index);
  }, [detailsOffer]);

  useEffect(() => {
    if (!detailsOffer && !selectedOffer) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = oldOverflow; };
  }, [detailsOffer, selectedOffer]);

  function openDetails(offer: Offer) {
    scrollPositionRef.current = window.scrollY;
    setDetailsOffer(offer);
  }

  function closeDetails() {
    setDetailsOffer(null);
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollPositionRef.current, behavior: "auto" });
      inputRef.current?.focus();
    });
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.map(({ role, content }) => ({ role, content })), search, language }),
      });
      const data = await response.json();
      if (!response.ok || !data?.answer) throw new Error(data?.error || "Ο βοηθός δεν είναι διαθέσιμος αυτή τη στιγμή.");
      if (data.search) setSearch(data.search);
      if (data.language) setLanguage(data.language);
      setMessages((current) => [...current, { role: "assistant", content: data.answer, offers: Array.isArray(data.offers) ? data.offers : [] }]);
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Κάτι πήγε στραβά.");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function openRequest(offer: Offer) {
    setDetailsOffer(null);
    setSelectedOffer(offer);
    setRequestSuccess("");
    setRequestName("");
    setRequestContact("");
    setRequestMessage("");
  }

  async function submitBookingRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedOffer) return;
    setRequestSending(true);
    setError("");
    try {
      const response = await fetch("/api/ai-assistant/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: requestName,
          contact: requestContact,
          message: requestMessage,
          checkin: search.checkin,
          checkout: search.checkout,
          guests: search.guests,
          roomId: selectedOffer.roomId,
          unitId: selectedOffer.unitId,
          roomName: selectedOffer.name,
          originalTotal: selectedOffer.originalTotal,
          directTotal: selectedOffer.directTotal,
          conversation: messages.slice(-18).map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) throw new Error(data?.error || "Η αποστολή απέτυχε.");
      setRequestSuccess(`Το αίτημά σας στάλθηκε στη reception${data.requestId ? ` με αριθμό #${data.requestId}` : ""}. Θα επικοινωνήσουμε μαζί σας για επιβεβαίωση.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Η αποστολή απέτυχε.");
    } finally {
      setRequestSending(false);
    }
  }

  return (
    <main className="min-h-[100dvh] bg-[#fbfaf7] text-stone-950">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Voulamandis House</p><h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Βοηθός διαμονής</h1></div>
          <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">10% καλύτερη direct τιμή</div>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100dvh-82px)] max-w-5xl flex-col px-4 sm:px-8">
        <div className="flex-1 space-y-6 py-8 sm:py-12" aria-live="polite">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`}>
              <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[88%] rounded-[1.4rem] px-4 py-3 text-[15px] leading-6 sm:max-w-[70%] sm:px-5 sm:py-4 sm:text-base ${message.role === "user" ? "rounded-br-md bg-stone-950 text-white" : "rounded-bl-md border border-stone-200 bg-white text-stone-800 shadow-sm"}`}>{message.content}</div>
              </div>

              {message.role === "assistant" && message.offers?.length ? (
                <div className="mt-5 space-y-3">
                  {message.offers.map((offer) => (
                    <button key={`${offer.roomId}:${offer.unitId}`} type="button" onClick={() => openDetails(offer)} className="group flex w-full overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-100">
                      <div className="relative w-28 shrink-0 bg-stone-100 sm:w-40"><Image src={offer.image} alt={`${offer.name} - ${offer.category}`} fill sizes="160px" className="object-cover" /></div>
                      <div className="flex min-w-0 flex-1 items-center justify-between gap-4 p-3.5 sm:p-5">
                        <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-base font-semibold sm:text-lg">{offer.name}</h2><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">-10% direct</span></div><p className="mt-1 truncate text-xs text-stone-500 sm:text-sm">{offer.category} · έως {offer.maxGuests} άτομα</p><p className="mt-2 text-xs font-medium text-emerald-700">Πατήστε για φωτογραφίες, παροχές και λεπτομέρειες</p></div>
                        <div className="shrink-0 text-right"><p className="text-[11px] text-stone-400 line-through">{formatEuro(offer.originalTotal)}</p><p className="text-lg font-bold text-emerald-800 sm:text-2xl">{formatEuro(offer.directTotal)}</p><p className="text-[11px] text-emerald-700">{offer.nights} {offer.nights === 1 ? "νύχτα" : "νύχτες"}</p></div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          {loading ? <div className="flex justify-start"><div className="flex items-center gap-2 rounded-[1.4rem] rounded-bl-md border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 shadow-sm"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />Ψάχνω την καλύτερη διαθέσιμη επιλογή…</div></div> : null}
          <div ref={endRef} />
        </div>

        <div className="sticky bottom-0 border-t border-stone-200 bg-[#fbfaf7]/95 py-4 backdrop-blur sm:py-5">
          {error ? <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          <form onSubmit={(event) => { event.preventDefault(); void sendMessage(input); }} className="flex items-center gap-2 rounded-2xl border border-stone-300 bg-white p-2 shadow-lg shadow-stone-200/60 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
            <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} disabled={loading} maxLength={1200} placeholder="Γράψτε ημερομηνίες, νύχτες και άτομα…" className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-base outline-none placeholder:text-stone-400" />
            <button type="submit" disabled={loading || !input.trim()} className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-40">Αποστολή</button>
          </form>
          <p className="mt-2 text-center text-xs text-stone-400">Η κράτηση επιβεβαιώνεται μόνο από τη reception.</p>
        </div>
      </section>

      {detailsOffer ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-stone-950/60 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label={`Λεπτομέρειες για ${detailsOffer.name}`}>
          <div className="relative flex max-h-[96dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:max-h-[92dvh] sm:rounded-[2rem]">
            <div className="relative shrink-0">
              <RoomCarousel images={gallery} roomName={detailsOffer.name} />
              <button type="button" onClick={closeDetails} className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/95 text-2xl text-stone-700 shadow-lg" aria-label="Κλείσιμο και επιστροφή στη συνομιλία">✕</button>
              <span className="absolute left-4 top-4 z-10 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow">Καλύτερη direct τιμή</span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5 pb-32 sm:p-7 sm:pb-28">
              <div className="flex items-start justify-between gap-4">
                <div><h2 className="text-2xl font-semibold">{detailsOffer.name}</h2><p className="mt-1 text-sm text-stone-600">{detailsOffer.category} · έως {detailsOffer.maxGuests} άτομα</p></div>
                <div className="text-right"><p className="text-xs text-stone-400 line-through">{formatEuro(detailsOffer.originalTotal)}</p><p className="text-2xl font-bold text-emerald-800">{formatEuro(detailsOffer.directTotal)}</p><p className="text-xs text-emerald-700">Κερδίζετε {formatEuro(detailsOffer.saving)}</p></div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {amenityBadges.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm text-stone-800 shadow-sm">
                    <span className="text-lg" aria-hidden="true">{item.icon}</span>
                    <span className="font-medium leading-5">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-950">
                <strong>{formatDate(search.checkin)} → {formatDate(search.checkout)}</strong><br />
                {search.guests} {search.guests === 1 ? "άτομο" : "άτομα"} · {detailsOffer.nights} {detailsOffer.nights === 1 ? "νύχτα" : "νύχτες"}
              </div>

              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                <p className="font-semibold">Πρόσθετες χρεώσεις που δεν περιλαμβάνονται</p>
                <p className="mt-1">• Φόρος ανθεκτικότητας στην κλιματική κρίση: <strong>2 € ανά διανυκτέρευση</strong>.</p>
                <p>• Πρωινό: προαιρετικό, <strong>12 € ανά άτομο ανά ημέρα</strong>.</p>
              </div>

              <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-6 text-stone-600">
                <p className="font-semibold text-stone-900">Απλή διαδικασία, χωρίς άμεση χρέωση</p>
                <p className="mt-1">Στέλνετε αίτημα και η reception επικοινωνεί μαζί σας για την τελική επιβεβαίωση. Η έκπτωση 10% εφαρμόζεται μία φορά και δεν συνδυάζεται με άλλη προσφορά.</p>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 border-t border-stone-200 bg-white/95 p-4 backdrop-blur sm:rounded-b-[2rem] sm:px-7">
              <div className="mx-auto flex max-w-3xl items-center gap-3"><div className="min-w-0 flex-1"><p className="text-xs text-stone-500">Τιμή απευθείας</p><p className="text-xl font-bold text-emerald-800">{formatEuro(detailsOffer.directTotal)}</p></div><button type="button" onClick={() => openRequest(detailsOffer)} className="rounded-2xl bg-stone-950 px-6 py-3.5 text-sm font-semibold text-white hover:bg-stone-800">Ενδιαφέρομαι</button></div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedOffer ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/55 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true">
          <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-white p-5 shadow-2xl sm:rounded-[2rem] sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Αίτημα προς reception</p><h2 className="mt-1 text-2xl font-semibold">{selectedOffer.name}</h2><p className="mt-1 text-sm text-stone-600">{formatDate(search.checkin)} → {formatDate(search.checkout)} · {search.guests} άτομα</p></div><button type="button" onClick={() => setSelectedOffer(null)} className="rounded-full border border-stone-200 px-3 py-2 text-sm text-stone-600">✕</button></div>
            <div className="mt-4 rounded-2xl bg-emerald-50 p-4"><p className="text-sm text-stone-500">Τιμή απευθείας κράτησης</p><p className="mt-1 text-2xl font-bold text-emerald-800">{formatEuro(selectedOffer.directTotal)}</p><p className="mt-2 text-xs leading-5 text-stone-600">Δεν περιλαμβάνονται φόρος 2 € ανά διανυκτέρευση και προαιρετικό πρωινό 12 € ανά άτομο ανά ημέρα.</p></div>
            {requestSuccess ? <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900"><p className="font-semibold">Το αίτημα καταχωρήθηκε.</p><p className="mt-1">{requestSuccess}</p></div> : <form onSubmit={submitBookingRequest} className="mt-5 space-y-4"><label className="block text-sm font-medium text-stone-700">Ονοματεπώνυμο<input required value={requestName} onChange={(event) => setRequestName(event.target.value)} className="mt-1.5 w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" /></label><label className="block text-sm font-medium text-stone-700">Τηλέφωνο ή email<input required value={requestContact} onChange={(event) => setRequestContact(event.target.value)} className="mt-1.5 w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" /></label><label className="block text-sm font-medium text-stone-700">Μήνυμα <span className="font-normal text-stone-400">(προαιρετικό)</span><textarea rows={3} value={requestMessage} onChange={(event) => setRequestMessage(event.target.value)} className="mt-1.5 w-full resize-none rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" /></label><button type="submit" disabled={requestSending} className="w-full rounded-2xl bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50">{requestSending ? "Αποστολή…" : "Στείλε αίτημα στη reception"}</button><p className="text-center text-xs text-stone-500">Δεν ολοκληρώνεται αυτόματα κράτηση ή πληρωμή.</p></form>}
          </div>
        </div>
      ) : null}
    </main>
  );
}
