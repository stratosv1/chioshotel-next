"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useRef, useState } from "react";

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

type Action = {
  label: string;
  href?: string;
  action?: "open_request";
  roomId?: string;
  unitId?: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  offers?: Offer[];
  actions?: Action[];
};

const starterQuestions = [
  "Ποιο δωμάτιο είναι κατάλληλο για οικογένεια;",
  "Ποια δωμάτια είναι χωρίς σκάλες;",
  "Which rooms have a kitchenette?",
];

function formatEuro(value: number) {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export function GuestAssistant() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Γεια σας! Επιλέξτε ημερομηνίες και επισκέπτες για να δω διαθέσιμα δωμάτια, φωτογραφίες και τιμές απευθείας κράτησης.",
    },
  ]);
  const [activeOffers, setActiveOffers] = useState<Offer[]>([]);
  const [input, setInput] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [requestName, setRequestName] = useState("");
  const [requestContact, setRequestContact] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [requestSending, setRequestSending] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function findOffer(roomId?: string, unitId?: string) {
    return activeOffers.find(
      (offer) => offer.roomId === roomId && offer.unitId === unitId,
    );
  }

  function openRequest(offer: Offer) {
    setSelectedOffer(offer);
    setRequestSuccess("");
    setRequestName("");
    setRequestContact("");
    setRequestMessage("");
  }

  async function sendMessage(text: string, includeOffers = false) {
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
          search: { checkin, checkout, guests },
          includeOffers,
          activeOffers,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data?.answer) {
        throw new Error(data?.error || "The assistant is unavailable.");
      }

      const returnedOffers = includeOffers && Array.isArray(data.offers) ? data.offers : [];
      if (includeOffers) setActiveOffers(returnedOffers);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
          offers: returnedOffers,
          actions: Array.isArray(data.actions) ? data.actions : [],
        },
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input, false);
  }

  function checkAvailability() {
    if (!checkin || !checkout) {
      setError("Επίλεξε ημερομηνία άφιξης και αναχώρησης.");
      return;
    }
    if (checkout <= checkin) {
      setError("Η αναχώρηση πρέπει να είναι μετά την άφιξη.");
      return;
    }
    setActiveOffers([]);
    void sendMessage(
      `Έλεγξε διαθεσιμότητα για ${guests} επισκέπτες από ${checkin} έως ${checkout}.`,
      true,
    );
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
          checkin,
          checkout,
          guests,
          roomId: selectedOffer.roomId,
          unitId: selectedOffer.unitId,
          roomName: selectedOffer.name,
          originalTotal: selectedOffer.originalTotal,
          directTotal: selectedOffer.directTotal,
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
    <main className="min-h-[100dvh] bg-[#f7f4ee] text-stone-900">
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white shadow-[0_20px_70px_rgba(41,37,36,0.10)]">
          <header className="relative overflow-hidden border-b border-stone-200 bg-stone-950 px-5 py-8 text-white sm:px-8 sm:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_35%)]" />
            <div className="relative max-w-3xl">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                AI Guest Assistant
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                Βρείτε το δωμάτιο που σας ταιριάζει
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300 sm:text-base">
                Ζωντανός έλεγχος διαθεσιμότητας, φωτογραφίες δωματίων και τιμή απευθείας κράτησης με έκπτωση 10%.
              </p>
            </div>
          </header>

          <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:p-8">
            <aside className="space-y-4">
              <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Αναζήτηση</p>
                    <h2 className="mt-1 text-lg font-semibold">Η διαμονή σας</h2>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Live</span>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-stone-700">
                    Άφιξη
                    <input type="date" min={today} value={checkin} onChange={(event) => setCheckin(event.target.value)} className="mt-1.5 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" />
                  </label>
                  <label className="block text-sm font-medium text-stone-700">
                    Αναχώρηση
                    <input type="date" min={checkin || today} value={checkout} onChange={(event) => setCheckout(event.target.value)} className="mt-1.5 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" />
                  </label>
                  <label className="block text-sm font-medium text-stone-700">
                    Επισκέπτες
                    <select value={guests} onChange={(event) => setGuests(Number(event.target.value))} className="mt-1.5 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100">
                      {[1, 2, 3, 4].map((value) => <option key={value} value={value}>{value} {value === 1 ? "επισκέπτης" : "επισκέπτες"}</option>)}
                    </select>
                  </label>
                  <button type="button" onClick={checkAvailability} disabled={loading} className="mt-2 flex w-full items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50">
                    {loading ? "Γίνεται έλεγχος…" : "Δείτε διαθεσιμότητα"}
                  </button>
                </div>

                {checkin && checkout ? (
                  <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-xs leading-5 text-stone-600">
                    <strong className="text-stone-900">{formatDate(checkin)}</strong> → <strong className="text-stone-900">{formatDate(checkout)}</strong><br />
                    {guests} {guests === 1 ? "επισκέπτης" : "επισκέπτες"}
                  </div>
                ) : null}
              </div>

              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
                <p className="font-semibold">Καλύτερη τιμή απευθείας</p>
                <p className="mt-1 text-emerald-800">Η έκπτωση 10% εφαρμόζεται μία φορά και δεν συνδυάζεται με άλλη προσφορά.</p>
              </div>
            </aside>

            <section className="flex min-h-[620px] min-w-0 flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white">
              <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6" aria-live="polite">
                {messages.map((message, index) => (
                  <div key={`${message.role}-${index}`}>
                    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[92%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-6 sm:max-w-[78%] ${message.role === "user" ? "rounded-br-lg bg-stone-900 text-white" : "rounded-bl-lg bg-stone-100 text-stone-800"}`}>
                        {message.content}
                      </div>
                    </div>

                    {message.role === "assistant" && message.actions?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.actions.map((action, actionIndex) => {
                          if (action.action === "open_request") {
                            const offer = findOffer(action.roomId, action.unitId);
                            return (
                              <button
                                key={`${action.label}-${actionIndex}`}
                                type="button"
                                disabled={!offer}
                                onClick={() => offer && openRequest(offer)}
                                className="rounded-2xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {action.label}
                              </button>
                            );
                          }

                          return action.href ? (
                            <Link
                              key={`${action.label}-${actionIndex}`}
                              href={action.href}
                              className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
                            >
                              {action.label}
                            </Link>
                          ) : null;
                        })}
                      </div>
                    ) : null}

                    {message.role === "assistant" && message.offers?.length ? (
                      <div className="mt-5 grid gap-5 xl:grid-cols-2">
                        {message.offers.map((offer) => (
                          <article key={`${offer.roomId}:${offer.unitId}`} className="group overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
                            <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                              <Image src={offer.image} alt={`${offer.name} - ${offer.category}`} fill sizes="(max-width: 1279px) 100vw, 50vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                              <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
                                <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-stone-900 shadow-sm">Διαθέσιμο</span>
                                <span className="rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm">-10% απευθείας</span>
                              </div>
                            </div>

                            <div className="p-4 sm:p-5">
                              <div className="flex items-start justify-between gap-3">
                                <div><h3 className="text-xl font-semibold text-stone-950">{offer.name}</h3><p className="mt-1 text-sm text-stone-600">{offer.category}</p></div>
                                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">έως {offer.maxGuests} άτομα</span>
                              </div>
                              <div className="mt-4 flex flex-wrap gap-2">
                                {[offer.floor, ...offer.features].filter(Boolean).filter((feature, i, all) => all.indexOf(feature) === i).slice(0, 6).map((feature) => <span key={feature} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-700">{feature}</span>)}
                              </div>
                              <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
                                <div className="flex items-end justify-between gap-4">
                                  <div><p className="text-xs text-stone-500">Αρχική τιμή <span className="line-through">{formatEuro(offer.originalTotal)}</span></p><p className="mt-1 text-2xl font-bold text-emerald-800">{formatEuro(offer.directTotal)}</p><p className="mt-1 text-xs text-emerald-700">για {offer.nights} {offer.nights === 1 ? "νύχτα" : "νύχτες"}</p></div>
                                  <div className="text-right"><p className="text-xs text-stone-500">Κερδίζετε</p><p className="text-base font-semibold text-emerald-700">{formatEuro(offer.saving)}</p></div>
                                </div>
                              </div>
                              <div className="mt-4 grid grid-cols-2 gap-2">
                                <Link href={offer.detailsUrl} className="rounded-2xl border border-stone-300 px-4 py-3 text-center text-sm font-semibold text-stone-800 hover:bg-stone-50">Φωτογραφίες & λεπτομέρειες</Link>
                                <button type="button" onClick={() => openRequest(offer)} className="rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white hover:bg-stone-800">Αίτημα κράτησης</button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}

                {loading ? <div className="flex justify-start"><div className="flex items-center gap-2 rounded-3xl rounded-bl-lg bg-stone-100 px-4 py-3 text-sm text-stone-600"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />Επεξεργάζομαι το αίτημά σας…</div></div> : null}
              </div>

              <div className="border-t border-stone-200 bg-white p-4 sm:p-5">
                {messages.length === 1 ? <div className="mb-3 flex gap-2 overflow-x-auto pb-1">{starterQuestions.map((question) => <button key={question} type="button" onClick={() => void sendMessage(question, false)} className="shrink-0 rounded-full border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-700 hover:border-emerald-300 hover:bg-emerald-50">{question}</button>)}</div> : null}
                {error ? <p className="mb-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p> : null}
                <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-2xl border border-stone-300 bg-stone-50 p-1.5 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
                  <label htmlFor="guest-question" className="sr-only">Γράψτε την ερώτησή σας</label>
                  <input ref={inputRef} id="guest-question" value={input} onChange={(event) => setInput(event.target.value)} maxLength={1200} disabled={loading} placeholder="Ρωτήστε για δωμάτια, παροχές ή τη διαμονή σας…" autoComplete="off" className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-base text-stone-900 outline-none placeholder:text-stone-400 disabled:opacity-60" />
                  <button type="submit" disabled={loading || !input.trim()} className="shrink-0 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-40">Αποστολή</button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </section>

      {selectedOffer ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Αίτημα κράτησης">
          <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-white p-5 shadow-2xl sm:rounded-[2rem] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Αίτημα προς reception</p><h2 className="mt-1 text-2xl font-semibold">{selectedOffer.name}</h2><p className="mt-1 text-sm text-stone-600">{formatDate(checkin)} → {formatDate(checkout)} · {guests} άτομα</p></div>
              <button type="button" onClick={() => setSelectedOffer(null)} className="rounded-full border border-stone-200 px-3 py-2 text-sm text-stone-600 hover:bg-stone-50" aria-label="Κλείσιμο">✕</button>
            </div>

            <div className="mt-4 rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm text-stone-500">Τιμή απευθείας κράτησης</p><p className="mt-1 text-2xl font-bold text-emerald-800">{formatEuro(selectedOffer.directTotal)}</p><p className="mt-1 text-xs text-stone-500">Η κράτηση επιβεβαιώνεται μόνο από τη reception.</p>
            </div>

            {requestSuccess ? (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                <p className="font-semibold">Το αίτημα καταχωρήθηκε.</p><p className="mt-1">{requestSuccess}</p>
                <a href={`https://wa.me/306944474226?text=${encodeURIComponent(`Νέο αίτημα κράτησης για ${selectedOffer.name}, ${checkin} έως ${checkout}, ${guests} άτομα. Όνομα: ${requestName}. Επικοινωνία: ${requestContact}.`)}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex w-full justify-center rounded-2xl bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-600">Συνέχεια στο WhatsApp</a>
              </div>
            ) : (
              <form onSubmit={submitBookingRequest} className="mt-5 space-y-4">
                <label className="block text-sm font-medium text-stone-700">Ονοματεπώνυμο<input required value={requestName} onChange={(event) => setRequestName(event.target.value)} className="mt-1.5 w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" /></label>
                <label className="block text-sm font-medium text-stone-700">Τηλέφωνο ή email<input required value={requestContact} onChange={(event) => setRequestContact(event.target.value)} className="mt-1.5 w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" /></label>
                <label className="block text-sm font-medium text-stone-700">Μήνυμα <span className="font-normal text-stone-400">(προαιρετικό)</span><textarea rows={3} value={requestMessage} onChange={(event) => setRequestMessage(event.target.value)} className="mt-1.5 w-full resize-none rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" /></label>
                <button type="submit" disabled={requestSending} className="flex w-full justify-center rounded-2xl bg-stone-900 px-5 py-3.5 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50">{requestSending ? "Αποστολή…" : "Στείλε αίτημα στη reception"}</button>
                <p className="text-center text-xs leading-5 text-stone-500">Δεν ολοκληρώνεται αυτόματα κράτηση ή πληρωμή.</p>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
}
