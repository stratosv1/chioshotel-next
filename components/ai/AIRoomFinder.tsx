"use client";

import Image from "next/image";
import { FormEvent, useMemo, useRef, useState } from "react";
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

const COPY = {
  el: {
    title: "AI Room Finder",
    badge: "Live διαθεσιμότητα",
    welcome: "Θα σας βοηθήσω να βρείτε διαθέσιμο δωμάτιο. Ποια ημερομηνία θέλετε για check-in;",
    placeholder: "Γράψτε ημερομηνία ή απάντηση…",
    send: "Αποστολή",
    loading: "Ελέγχω τη διαθεσιμότητα…",
    live: "Απευθείας προσφορά",
    best: "Κορυφαία επιλογή",
    upTo: "έως",
    guests: "άτομα",
    close: "Κλείσιμο",
    interested: "Ενδιαφέρομαι",
    requestTitle: "Αίτημα προς reception",
    name: "Ονοματεπώνυμο",
    contact: "Τηλέφωνο ή email",
    message: "Μήνυμα",
    optional: "προαιρετικό",
    submit: "Στείλε αίτημα",
    sending: "Αποστολή…",
    successTitle: "Το αίτημα στάλθηκε.",
    success: "Η reception θα επικοινωνήσει μαζί σας. Δεν έχει πραγματοποιηθεί κράτηση.",
    disclaimer: "Δεν γίνεται κράτηση ή πληρωμή. Στέλνεται μόνο αίτημα ενδιαφέροντος στη reception.",
    error: "Κάτι πήγε στραβά. Δοκιμάστε ξανά.",
    nights: ["νύχτα", "νύχτες"],
  },
  en: {
    title: "AI Room Finder",
    badge: "Live availability",
    welcome: "I will help you find an available room. What is your check-in date?",
    placeholder: "Enter a date or reply…",
    send: "Send",
    loading: "Checking availability…",
    live: "Direct offer",
    best: "Top choice",
    upTo: "up to",
    guests: "guests",
    close: "Close",
    interested: "I'm interested",
    requestTitle: "Request to reception",
    name: "Full name",
    contact: "Phone or email",
    message: "Message",
    optional: "optional",
    submit: "Send request",
    sending: "Sending…",
    successTitle: "Request sent.",
    success: "Reception will contact you. No booking has been made.",
    disclaimer: "No booking or payment is completed. This only sends an enquiry to reception.",
    error: "Something went wrong. Please try again.",
    nights: ["night", "nights"],
  },
} as const;

const ROOM_GALLERIES: Record<string, string[]> = {
  "267788:1": ["/images/rooms/DSC07776-2-e1675109942622.webp", "/images/rooms/DSC07769-1.webp"],
  "268803:1": ["/images/rooms/DSC07803-1.webp", "/images/rooms/DSC07839.webp"],
  "267788:2": ["/images/rooms/DSC07867-1.webp", "/images/rooms/DSC07860-1.webp"],
  "267788:3": ["/images/rooms/received_1748354861920234.webp"],
  "626129:1": ["/images/rooms/voulamandis-house-rooms.webp"],
  "268803:2": ["/images/rooms/received_1753964631359257.webp"],
  "626129:2": ["/images/rooms/double-triple-room.jpg"],
  "265595:1": ["/images/rooms/chios-apartments-voulamandis.webp"],
  "265595:2": ["/images/rooms/chios-apartments-voulamandis.webp"],
  "265595:3": ["/images/rooms/DSC07899.webp"],
};

function roomNumber(text: string) {
  const value = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  return value.match(/(?:room|δωματιο|διαμερισμα|apartment|το)?\s*(10|[1-9])\s*$/i)?.[1] || null;
}

function cardPills(offer: Offer) {
  return [offer.floor, `👤×${offer.maxGuests}`, ...offer.features].filter(Boolean).slice(0, 4);
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
  const inputRef = useRef<HTMLInputElement>(null);

  const lastOffers = useMemo(
    () => [...messages].reverse().find((item) => item.offers?.length)?.offers || [],
    [messages],
  );
  const gallery = useMemo(
    () => activeOffer
      ? Array.from(new Set([activeOffer.image, ...(ROOM_GALLERIES[`${activeOffer.roomId}:${activeOffer.unitId}`] || [])]))
      : [],
    [activeOffer],
  );
  const money = (value: number) => new Intl.NumberFormat(language === "el" ? "el-GR" : "en-GB", {
    style: "currency",
    currency: "EUR",
  }).format(value);

  async function sendMessage(raw: string) {
    const text = raw.trim();
    if (!text || loading) return;

    const selectedNumber = roomNumber(text);
    if (selectedNumber && lastOffers.length) {
      const selected = lastOffers.find((offer) => offer.name.match(/(10|[1-9])/g)?.at(-1) === selectedNumber);
      if (selected) {
        setInput("");
        setActiveOffer(selected);
        return;
      }
    }

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
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
        }),
      });
      const data = await response.json();
      if (!response.ok || !data?.answer) throw new Error(data?.error || t.error);
      if (data.search) setSearch(data.search);
      const offers = Array.isArray(data.offers) ? data.offers : [];
      setMessages((current) => [...current, { role: "assistant", content: data.answer, offers }]);
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
    setSending(true);
    setError("");

    const payload = {
      name,
      contact,
      message: note,
      checkin: search.checkin,
      checkout: search.checkout,
      guests: search.guests,
      roomId: requestOffer.roomId,
      unitId: requestOffer.unitId,
      roomName: requestOffer.name,
      originalTotal: requestOffer.originalTotal,
      directTotal: requestOffer.directTotal,
      conversation: messages.slice(-12).map(({ role, content }) => ({ role, content })),
    };

    try {
      const response = await fetch("/api/ai-assistant/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result?.ok) throw new Error(result?.error || t.error);

      await fetch("/api/ai-assistant/request-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, requestId: result.requestId }),
      });
      setSuccess(t.success);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.error);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-[100dvh] bg-[#fbfaf7] text-stone-950">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Voulamandis House</p>
            <h1 className="mt-1 text-2xl font-bold">{t.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(event) => {
                const next = event.target.value as Language;
                setLanguage(next);
                setMessages([{ role: "assistant", content: COPY[next].welcome }]);
                setSearch({});
              }}
              className="rounded-xl border px-3 py-2"
            >
              <option value="el">EL</option>
              <option value="en">EN</option>
            </select>
            <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 sm:block">{t.badge}</span>
          </div>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100dvh-82px)] max-w-5xl flex-col px-4 sm:px-8">
        <div className="flex-1 space-y-5 py-8">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`}>
              <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[92%] rounded-2xl px-4 py-3 text-[15px] leading-6 sm:max-w-[75%] ${message.role === "user" ? "bg-stone-950 text-white" : "border bg-white shadow-sm"}`}>
                  {message.content}
                </div>
              </div>

              {message.offers?.length ? (
                <div className="mt-5 -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 [scrollbar-width:thin]">
                  {message.offers.map((offer, offerIndex) => (
                    <button
                      key={`${offer.roomId}:${offer.unitId}`}
                      onClick={() => setActiveOffer(offer)}
                      className={`group relative w-[300px] shrink-0 snap-start overflow-hidden rounded-[20px] border bg-white text-left shadow-[0_8px_24px_rgba(46,35,27,0.10)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(46,35,27,0.16)] sm:w-[310px] ${offerIndex === 0 ? "border-[#a7b777] ring-1 ring-[#dce5bf]" : "border-[#e7dfd5]"}`}
                    >
                      <div className="relative h-[166px] overflow-hidden bg-stone-100">
                        <Image
                          src={offer.image}
                          alt={offer.name}
                          fill
                          sizes="310px"
                          className="object-cover transition duration-300 group-hover:scale-[1.02]"
                        />
                        <span className="absolute left-3 top-3 rounded-lg border border-[#ead6b5] bg-[#fff5df]/95 px-2.5 py-1 text-[10px] font-extrabold text-[#8a5a19] shadow-sm">
                          {offerIndex === 0 ? t.best : t.live}
                        </span>
                        <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-stone-900/55 text-sm text-white backdrop-blur">♡</span>
                      </div>

                      <div className="p-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="truncate text-[20px] font-black leading-tight text-stone-950">{offer.name}</h2>
                            <p className="mt-0.5 truncate text-[12px] font-bold text-[#b45309]">{offer.category}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-[11px] text-stone-400 line-through">{money(offer.originalTotal)}</p>
                            <p className="text-[23px] font-black leading-none text-[#43551b]">{money(offer.directTotal)}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className="rounded-md border border-[#ead6b5] bg-[#fff5df] px-2 py-1 text-[10px] font-bold text-[#8a5a19]">{t.live}</span>
                          {cardPills(offer).map((pill) => (
                            <span key={pill} className="max-w-full truncate rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-[10px] font-semibold text-stone-700">
                              {pill}
                            </span>
                          ))}
                        </div>

                        <p className="mt-3 text-[12px] font-semibold text-[#5f6f28]">
                          {offer.nights} {t.nights[offer.nights === 1 ? 0 : 1]}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          {loading ? <div className="w-fit rounded-2xl border bg-white px-4 py-3 text-sm text-stone-600 shadow-sm">{t.loading}</div> : null}
        </div>

        <div className="sticky bottom-0 border-t bg-[#fbfaf7]/95 py-4 backdrop-blur">
          {error ? <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          <form onSubmit={(event) => { event.preventDefault(); void sendMessage(input); }} className="flex gap-2 rounded-2xl border bg-white p-2 shadow-lg">
            <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder={t.placeholder} className="min-w-0 flex-1 bg-transparent px-3 py-2.5 outline-none" />
            <button disabled={loading || !input.trim()} className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">{t.send}</button>
          </form>
          <p className="mt-2 text-center text-xs text-stone-500">{t.disclaimer}</p>
        </div>
      </section>

      {activeOffer ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-stone-950/60 sm:items-center sm:p-5" role="dialog" aria-modal="true">
          <div className="relative flex max-h-[96dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]">
            <div className="relative">
              <RoomCarousel images={gallery} roomName={activeOffer.name} />
              <button onClick={() => setActiveOffer(null)} className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-xl shadow">✕</button>
            </div>
            <div className="overflow-y-auto p-5 pb-24">
              <h2 className="text-2xl font-bold">{activeOffer.name}</h2>
              <p className="mt-1 text-sm font-semibold text-[#b45309]">{activeOffer.category} · {t.upTo} {activeOffer.maxGuests} {t.guests}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[activeOffer.floor, ...activeOffer.features].filter(Boolean).map((feature) => (
                  <span key={feature} className="rounded-full border bg-stone-50 px-3 py-1.5 text-xs">{feature}</span>
                ))}
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t bg-white p-4">
              <div>
                <p className="text-xs text-stone-400 line-through">{money(activeOffer.originalTotal)}</p>
                <p className="text-2xl font-black text-[#43551b]">{money(activeOffer.directTotal)}</p>
              </div>
              <button onClick={() => { setRequestOffer(activeOffer); setActiveOffer(null); setSuccess(""); }} className="rounded-2xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white">{t.interested}</button>
            </div>
          </div>
        </div>
      ) : null}

      {requestOffer ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/55 sm:items-center sm:p-5" role="dialog" aria-modal="true">
          <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-white p-5 shadow-2xl sm:rounded-[2rem]">
            <div className="flex justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{t.requestTitle}</p>
                <h2 className="mt-1 text-2xl font-bold">{requestOffer.name}</h2>
              </div>
              <button onClick={() => setRequestOffer(null)} className="rounded-full border px-3 py-2">✕</button>
            </div>
            {success ? (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="font-semibold">{t.successTitle}</p>
                <p className="mt-1 text-sm">{success}</p>
              </div>
            ) : (
              <form onSubmit={submitRequest} className="mt-5 space-y-4">
                <label className="block text-sm font-medium">{t.name}<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-2xl border px-4 py-3" /></label>
                <label className="block text-sm font-medium">{t.contact}<input required value={contact} onChange={(event) => setContact(event.target.value)} className="mt-1.5 w-full rounded-2xl border px-4 py-3" /></label>
                <label className="block text-sm font-medium">{t.message} <span className="font-normal text-stone-400">({t.optional})</span><textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} className="mt-1.5 w-full rounded-2xl border px-4 py-3" /></label>
                <button disabled={sending} className="w-full rounded-2xl bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-50">{sending ? t.sending : t.submit}</button>
                <p className="text-center text-xs text-stone-500">{t.disclaimer}</p>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
}
