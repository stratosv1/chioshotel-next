"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Offer = {
  roomId: string;
  unitId: string;
  name: string;
  category: string;
  floor: string;
  maxGuests: number;
  features: string[];
  image: string;
  detailsUrl: string;
  bookingUrl: string;
  nights: number;
  originalTotal: number;
  directTotal: number;
  saving: number;
  preview?: boolean;
};

type KnowledgeCard = {
  id: string;
  kind: string;
  title: string;
  summary: string;
  facts?: string[];
  image?: string;
  url?: string;
};

type SearchState = { checkin?: string; checkout?: string; guests?: number };
type Message = {
  role: "user" | "assistant";
  content: string;
  offers?: Offer[];
  knowledge?: KnowledgeCard[];
};

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

const QUICK_QUESTIONS = [
  "Πρότεινέ μου δωμάτιο χωρίς σκάλες",
  "Τι μπορούμε να κάνουμε με παιδιά στη Χίο;",
  "Ποιες παραλίες είναι κοντά;",
  "Θέλω να ελέγξω διαθεσιμότητα",
];

function unique(values: string[]) {
  return values.filter(Boolean).filter((value, index, all) => all.indexOf(value) === index);
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("el-GR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

export function GuestAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Είμαι ο ψηφιακός concierge του Voulamandis House. Ρωτήστε με για δωμάτια, παροχές, ζωντανές τιμές και διαθεσιμότητα ή για παραλίες, χωριά, μουσεία και οικογενειακές διακοπές στη Χίο." },
  ]);
  const [search, setSearch] = useState<SearchState>({});
  const [language, setLanguage] = useState("el");
  const [selectedRoom, setSelectedRoom] = useState<number | undefined>();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailsOffer, setDetailsOffer] = useState<Offer | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
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
    return unique(ROOM_GALLERIES[`${detailsOffer.roomId}:${detailsOffer.unitId}`] || [detailsOffer.image]);
  }, [detailsOffer]);

  useEffect(() => {
    if (!detailsOffer && !selectedOffer) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [detailsOffer, selectedOffer]);

  function openDetails(offer: Offer) {
    scrollPositionRef.current = window.scrollY;
    setGalleryIndex(0);
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
    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-assistant/smart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
          search,
          language,
          selectedRoom,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data?.answer) throw new Error(data?.error || "Ο βοηθός δεν είναι διαθέσιμος αυτή τη στιγμή.");
      if (data.search) setSearch(data.search);
      if (data.language) setLanguage(data.language);
      if (typeof data.selectedRoom === "number") setSelectedRoom(data.selectedRoom);
      const offers = Array.isArray(data.offers) ? data.offers : [];
      const knowledge = Array.isArray(data.knowledge) ? data.knowledge.slice(0, 4) : [];
      setMessages((current) => [...current, { role: "assistant", content: data.answer, offers, knowledge }]);
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Κάτι πήγε στραβά.");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
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
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Voulamandis House</p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">AI concierge Χίου</h1>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">Live τιμές · απευθείας</div>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100dvh-82px)] max-w-5xl flex-col px-4 sm:px-8">
        <div className="flex-1 space-y-6 py-8 sm:py-12" aria-live="polite">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`}>
              <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[92%] whitespace-pre-line rounded-[1.4rem] px-4 py-3 text-[15px] leading-6 sm:max-w-[75%] sm:px-5 sm:py-4 sm:text-base ${message.role === "user" ? "rounded-br-md bg-stone-950 text-white" : "rounded-bl-md border border-stone-200 bg-white text-stone-800 shadow-sm"}`}>{message.content}</div>
              </div>

              {index === 0 && messages.length === 1 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {QUICK_QUESTIONS.map((question) => <button key={question} type="button" onClick={() => void sendMessage(question)} className="rounded-full border border-stone-300 bg-white px-3 py-2 text-left text-xs font-medium text-stone-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-800">{question}</button>)}
                </div>
              ) : null}

              {message.role === "assistant" && message.offers?.length ? (
                <div className="mt-5 space-y-3">
                  {message.offers.map((offer) => (
                    <button key={`${offer.roomId}:${offer.unitId}`} type="button" onClick={() => openDetails(offer)} className="group flex w-full overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-100">
                      <div className="relative w-28 shrink-0 bg-stone-100 sm:w-40"><Image src={ROOM_GALLERIES[`${offer.roomId}:${offer.unitId}`]?.[0] || offer.image} alt={`${offer.name} - ${offer.category}`} fill sizes="160px" className="object-cover" /></div>
                      <div className="flex min-w-0 flex-1 items-center justify-between gap-4 p-3.5 sm:p-5">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-base font-semibold sm:text-lg">{offer.name}</h2><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">{offer.preview ? "Φωτογραφίες" : "Live τιμή"}</span></div>
                          <p className="mt-1 text-xs text-stone-500 sm:text-sm">{offer.category} · έως {offer.maxGuests} άτομα</p>
                          <div className="mt-2 hidden flex-wrap gap-1.5 sm:flex">{unique([offer.floor, ...offer.features]).slice(0, 3).map((feature) => <span key={feature} className="rounded-full bg-stone-100 px-2 py-1 text-xs text-stone-600">{feature}</span>)}</div>
                        </div>
                        <div className="shrink-0 text-right">
                          {offer.preview ? <><p className="text-sm font-semibold text-emerald-800">Δείτε το δωμάτιο</p><p className="mt-1 text-xs text-stone-500">Gallery & παροχές</p></> : <><p className="text-[11px] text-stone-400 line-through">{formatEuro(offer.originalTotal)}</p><p className="text-lg font-bold text-emerald-800 sm:text-2xl">{formatEuro(offer.directTotal)}</p><p className="text-[11px] text-emerald-700">{offer.nights} {offer.nights === 1 ? "νύχτα" : "νύχτες"}</p></>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}

              {message.role === "assistant" && message.knowledge?.length ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {message.knowledge.map((item) => (
                    <article key={item.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                      {item.image ? <div className="relative aspect-[16/8] bg-stone-100"><Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" /></div> : null}
                      <div className="p-4 sm:p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">{item.kind}</p>
                        <h2 className="mt-1 text-lg font-semibold text-stone-950">{item.title}</h2>
                        <p className="mt-2 text-sm leading-6 text-stone-600">{item.summary}</p>
                        {item.facts?.length ? <ul className="mt-3 space-y-1.5 text-sm text-stone-600">{item.facts.slice(0, 2).map((fact) => <li key={fact} className="flex gap-2"><span className="text-emerald-600">✓</span><span>{fact}</span></li>)}</ul> : null}
                        {item.url ? <a href={item.url} className="mt-4 inline-flex rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800">Δείτε περισσότερα</a> : null}
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          {loading ? <div className="flex justify-start"><div className="flex items-center gap-2 rounded-[1.4rem] rounded-bl-md border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 shadow-sm"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />Αναζητώ τις καλύτερες επιβεβαιωμένες επιλογές…</div></div> : null}
          <div ref={endRef} />
        </div>

        <div className="sticky bottom-0 border-t border-stone-200 bg-[#fbfaf7]/95 py-4 backdrop-blur sm:py-5">
          {error ? <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-2xl border border-stone-300 bg-white p-2 shadow-lg shadow-stone-200/60 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
            <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} disabled={loading} maxLength={1200} placeholder="Ρωτήστε για διαμονή ή για τη Χίο…" className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-base outline-none placeholder:text-stone-400" />
            <button type="submit" disabled={loading || !input.trim()} className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-40">Αποστολή</button>
          </form>
          <p className="mt-2 text-center text-xs text-stone-400">Οι τιμές και η διαθεσιμότητα ελέγχονται ζωντανά. Η κράτηση επιβεβαιώνεται από τη reception.</p>
        </div>
      </section>

      {detailsOffer ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-stone-950/60 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label={`Λεπτομέρειες για ${detailsOffer.name}`}>
          <div className="relative flex max-h-[96dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:max-h-[92dvh] sm:rounded-[2rem]">
            <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-stone-100 sm:aspect-[16/8]">
              <Image src={gallery[galleryIndex] || detailsOffer.image} alt={`${detailsOffer.name} φωτογραφία ${galleryIndex + 1}`} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" priority />
              <button type="button" onClick={closeDetails} className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/95 text-2xl text-stone-700 shadow-lg" aria-label="Κλείσιμο">✕</button>
              <span className="absolute left-4 top-4 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow">{detailsOffer.preview ? "Φωτογραφίες δωματίου" : "Live απευθείας τιμή"}</span>
              {gallery.length > 1 ? <><button type="button" onClick={() => setGalleryIndex((galleryIndex - 1 + gallery.length) % gallery.length)} className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl shadow" aria-label="Προηγούμενη φωτογραφία">‹</button><button type="button" onClick={() => setGalleryIndex((galleryIndex + 1) % gallery.length)} className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl shadow" aria-label="Επόμενη φωτογραφία">›</button></> : null}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5 pb-28 sm:p-7 sm:pb-28">
              <div className="flex items-start justify-between gap-4"><div><h2 className="text-2xl font-semibold">{detailsOffer.name}</h2><p className="mt-1 text-sm text-stone-600">{detailsOffer.category} · έως {detailsOffer.maxGuests} άτομα</p></div>{!detailsOffer.preview ? <div className="text-right"><p className="text-xs text-stone-400 line-through">{formatEuro(detailsOffer.originalTotal)}</p><p className="text-2xl font-bold text-emerald-800">{formatEuro(detailsOffer.directTotal)}</p></div> : null}</div>
              {!detailsOffer.preview && search.checkin && search.checkout ? <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-950"><strong>{formatDate(search.checkin)} → {formatDate(search.checkout)}</strong><br />{search.guests} άτομα · {detailsOffer.nights} νύχτες</div> : null}
              <div className="mt-5 flex flex-wrap gap-2">{unique([detailsOffer.floor, ...detailsOffer.features]).map((feature) => <span key={feature} className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs text-stone-700">{feature}</span>)}</div>
            </div>
            <div className="absolute inset-x-0 bottom-0 border-t border-stone-200 bg-white/95 p-4 backdrop-blur sm:rounded-b-[2rem] sm:px-7">
              {detailsOffer.preview ? <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold">Δείτε πρώτα το δωμάτιο χωρίς ημερομηνίες</p><button type="button" onClick={closeDetails} className="rounded-2xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white">Επιστροφή</button></div> : <div className="flex items-center justify-between gap-3"><p className="text-xl font-bold text-emerald-800">{formatEuro(detailsOffer.directTotal)}</p><button type="button" onClick={() => openRequest(detailsOffer)} className="rounded-2xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white">Αίτημα κράτησης</button></div>}
            </div>
          </div>
        </div>
      ) : null}

      {selectedOffer ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/55 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true">
          <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-white p-5 shadow-2xl sm:rounded-[2rem] sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Αίτημα προς reception</p><h2 className="mt-1 text-2xl font-semibold">{selectedOffer.name}</h2><p className="mt-1 text-sm text-stone-600">{formatDate(search.checkin)} → {formatDate(search.checkout)} · {search.guests} άτομα</p></div><button type="button" onClick={() => setSelectedOffer(null)} className="rounded-full border border-stone-200 px-3 py-2 text-sm text-stone-600">✕</button></div>
            <div className="mt-4 rounded-2xl bg-emerald-50 p-4"><p className="text-sm text-stone-500">Τιμή απευθείας κράτησης</p><p className="mt-1 text-2xl font-bold text-emerald-800">{formatEuro(selectedOffer.directTotal)}</p></div>
            {requestSuccess ? <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900"><p className="font-semibold">Το αίτημα καταχωρήθηκε.</p><p className="mt-1">{requestSuccess}</p></div> : <form onSubmit={submitBookingRequest} className="mt-5 space-y-4"><label className="block text-sm font-medium text-stone-700">Ονοματεπώνυμο<input required value={requestName} onChange={(event) => setRequestName(event.target.value)} className="mt-1.5 w-full rounded-2xl border border-stone-300 px-4 py-3" /></label><label className="block text-sm font-medium text-stone-700">Τηλέφωνο ή email<input required value={requestContact} onChange={(event) => setRequestContact(event.target.value)} className="mt-1.5 w-full rounded-2xl border border-stone-300 px-4 py-3" /></label><label className="block text-sm font-medium text-stone-700">Μήνυμα <span className="font-normal text-stone-400">(προαιρετικό)</span><textarea rows={3} value={requestMessage} onChange={(event) => setRequestMessage(event.target.value)} className="mt-1.5 w-full resize-none rounded-2xl border border-stone-300 px-4 py-3" /></label><button type="submit" disabled={requestSending} className="w-full rounded-2xl bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-50">{requestSending ? "Αποστολή…" : "Στείλε αίτημα στη reception"}</button></form>}
          </div>
        </div>
      ) : null}
    </main>
  );
}
