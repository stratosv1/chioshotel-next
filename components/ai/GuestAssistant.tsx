"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

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
};

type SearchState = {
  checkin?: string;
  checkout?: string;
  guests?: number;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  offers?: Offer[];
};

function formatEuro(value: number) {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export function GuestAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Πότε θέλετε να έρθετε; Μπορείτε να γράψετε απλά, π.χ. «22 Αυγούστου για 3 νύχτες, 2 άτομα».",
    },
  ]);
  const [search, setSearch] = useState<SearchState>({});
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

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
          search,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data?.answer) {
        throw new Error(data?.error || "Ο βοηθός δεν είναι διαθέσιμος αυτή τη στιγμή.");
      }

      if (data.search) setSearch(data.search);
      const offers = Array.isArray(data.offers) ? data.offers : [];

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.answer, offers },
      ]);

      requestAnimationFrame(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
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

      setRequestSuccess(
        `Το αίτημά σας στάλθηκε στη reception${data.requestId ? ` με αριθμό #${data.requestId}` : ""}. Θα επικοινωνήσουμε μαζί σας για επιβεβαίωση.`,
      );
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
            <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Βοηθός διαμονής</h1>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">10% έκπτωση απευθείας</div>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100dvh-82px)] max-w-5xl flex-col px-4 sm:px-8">
        <div className="flex-1 space-y-6 py-8 sm:py-12" aria-live="polite">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`}>
              <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] rounded-[1.4rem] px-4 py-3 text-[15px] leading-6 sm:max-w-[70%] sm:px-5 sm:py-4 sm:text-base ${
                    message.role === "user"
                      ? "rounded-br-md bg-stone-950 text-white"
                      : "rounded-bl-md border border-stone-200 bg-white text-stone-800 shadow-sm"
                  }`}
                >
                  {message.content}
                </div>
              </div>

              {message.role === "assistant" && message.offers?.length ? (
                <div className="mt-5 space-y-3">
                  {message.offers.map((offer) => (
                    <button
                      key={`${offer.roomId}:${offer.unitId}`}
                      type="button"
                      onClick={() => setDetailsOffer(offer)}
                      className="group flex w-full overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-100"
                    >
                      <div className="relative w-28 shrink-0 bg-stone-100 sm:w-40">
                        <Image src={offer.image} alt={`${offer.name} - ${offer.category}`} fill sizes="160px" className="object-cover" />
                      </div>
                      <div className="flex min-w-0 flex-1 items-center justify-between gap-4 p-3.5 sm:p-5">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate text-base font-semibold sm:text-lg">{offer.name}</h2>
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">-10%</span>
                          </div>
                          <p className="mt-1 truncate text-xs text-stone-500 sm:text-sm">{offer.category} · έως {offer.maxGuests} άτομα</p>
                          <div className="mt-2 hidden flex-wrap gap-1.5 sm:flex">
                            {[offer.floor, ...offer.features].filter(Boolean).slice(0, 3).map((feature) => (
                              <span key={feature} className="rounded-full bg-stone-100 px-2 py-1 text-xs text-stone-600">{feature}</span>
                            ))}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-[11px] text-stone-400 line-through">{formatEuro(offer.originalTotal)}</p>
                          <p className="text-lg font-bold text-emerald-800 sm:text-2xl">{formatEuro(offer.directTotal)}</p>
                          <p className="text-[11px] text-emerald-700">{offer.nights} {offer.nights === 1 ? "νύχτα" : "νύχτες"}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          {loading ? (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-[1.4rem] rounded-bl-md border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 shadow-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />
                Ψάχνω διαθεσιμότητα…
              </div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="sticky bottom-0 border-t border-stone-200 bg-[#fbfaf7]/95 py-4 backdrop-blur sm:py-5">
          {error ? <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-2xl border border-stone-300 bg-white p-2 shadow-lg shadow-stone-200/60 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={loading}
              maxLength={1200}
              placeholder="Γράψτε ημερομηνίες, νύχτες και άτομα…"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-base outline-none placeholder:text-stone-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-40"
            >
              Αποστολή
            </button>
          </form>
          <p className="mt-2 text-center text-xs text-stone-400">Η κράτηση επιβεβαιώνεται μόνο από τη reception.</p>
        </div>
      </section>

      {detailsOffer ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-stone-950/55 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true">
          <div className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]">
            <div className="relative aspect-[16/9] overflow-hidden bg-stone-100 sm:rounded-t-[2rem]">
              <Image src={detailsOffer.image} alt={`${detailsOffer.name} - ${detailsOffer.category}`} fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover" />
              <button type="button" onClick={() => setDetailsOffer(null)} className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold text-stone-700 shadow">✕</button>
              <span className="absolute left-4 top-4 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow">-10% απευθείας</span>
            </div>
            <div className="p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">{detailsOffer.name}</h2>
                  <p className="mt-1 text-sm text-stone-600">{detailsOffer.category} · έως {detailsOffer.maxGuests} άτομα</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-400 line-through">{formatEuro(detailsOffer.originalTotal)}</p>
                  <p className="text-2xl font-bold text-emerald-800">{formatEuro(detailsOffer.directTotal)}</p>
                  <p className="text-xs text-emerald-700">Κερδίζετε {formatEuro(detailsOffer.saving)}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {[detailsOffer.floor, ...detailsOffer.features].filter(Boolean).map((feature) => (
                  <span key={feature} className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs text-stone-700">{feature}</span>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-950">
                <strong>{formatDate(search.checkin)} → {formatDate(search.checkout)}</strong><br />
                {search.guests} {search.guests === 1 ? "άτομο" : "άτομα"} · {detailsOffer.nights} {detailsOffer.nights === 1 ? "νύχτα" : "νύχτες"}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link href={detailsOffer.detailsUrl} className="rounded-2xl border border-stone-300 px-5 py-3.5 text-center text-sm font-semibold text-stone-800 hover:bg-stone-50">Όλες οι φωτογραφίες</Link>
                <button type="button" onClick={() => openRequest(detailsOffer)} className="rounded-2xl bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white hover:bg-stone-800">Αίτημα κράτησης</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedOffer ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/55 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true">
          <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-white p-5 shadow-2xl sm:rounded-[2rem] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Αίτημα προς reception</p>
                <h2 className="mt-1 text-2xl font-semibold">{selectedOffer.name}</h2>
                <p className="mt-1 text-sm text-stone-600">{formatDate(search.checkin)} → {formatDate(search.checkout)} · {search.guests} άτομα</p>
              </div>
              <button type="button" onClick={() => setSelectedOffer(null)} className="rounded-full border border-stone-200 px-3 py-2 text-sm text-stone-600">✕</button>
            </div>

            <div className="mt-4 rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm text-stone-500">Τιμή απευθείας κράτησης</p>
              <p className="mt-1 text-2xl font-bold text-emerald-800">{formatEuro(selectedOffer.directTotal)}</p>
            </div>

            {requestSuccess ? (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                <p className="font-semibold">Το αίτημα καταχωρήθηκε.</p>
                <p className="mt-1">{requestSuccess}</p>
              </div>
            ) : (
              <form onSubmit={submitBookingRequest} className="mt-5 space-y-4">
                <label className="block text-sm font-medium text-stone-700">Ονοματεπώνυμο<input required value={requestName} onChange={(event) => setRequestName(event.target.value)} className="mt-1.5 w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" /></label>
                <label className="block text-sm font-medium text-stone-700">Τηλέφωνο ή email<input required value={requestContact} onChange={(event) => setRequestContact(event.target.value)} className="mt-1.5 w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" /></label>
                <label className="block text-sm font-medium text-stone-700">Μήνυμα <span className="font-normal text-stone-400">(προαιρετικό)</span><textarea rows={3} value={requestMessage} onChange={(event) => setRequestMessage(event.target.value)} className="mt-1.5 w-full resize-none rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" /></label>
                <button type="submit" disabled={requestSending} className="w-full rounded-2xl bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50">{requestSending ? "Αποστολή…" : "Στείλε αίτημα στη reception"}</button>
                <p className="text-center text-xs text-stone-500">Δεν ολοκληρώνεται αυτόματα κράτηση ή πληρωμή.</p>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
}
