"use client";

import { FormEvent, useMemo, useRef, useState } from "react";

type Offer = {
  roomId: string;
  unitId: string;
  name: string;
  category: string;
  floor: string;
  maxGuests: number;
  features: string[];
  nights: number;
  originalTotal: number;
  directTotal: number;
  saving: number;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  offers?: Offer[];
};

const starterQuestions = [
  "Ποιο δωμάτιο είναι κατάλληλο για οικογένεια;",
  "Υπάρχει πρωινό;",
  "Which rooms have a kitchenette?",
];

function formatEuro(value: number) {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function GuestAssistant() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Γεια σας! Επιλέξτε ημερομηνίες και επισκέπτες για να ελέγξω ζωντανά διαθεσιμότητα και τιμές από τη βάση μας. Η τιμή απευθείας κράτησης περιλαμβάνει μία έκπτωση 10% και δεν συνδυάζεται με άλλη προσφορά.",
    },
  ]);
  const [input, setInput] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
          search: { checkin, checkout, guests },
        }),
      });
      const data = await response.json();

      if (!response.ok || !data?.answer) {
        throw new Error(data?.error || "The assistant is unavailable.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
          offers: Array.isArray(data.offers) ? data.offers : [],
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
    void sendMessage(input);
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
    void sendMessage(
      `Έλεγξε διαθεσιμότητα για ${guests} επισκέπτες από ${checkin} έως ${checkout} και δείξε αρχική τιμή, τιμή απευθείας κράτησης και χαρακτηριστικά δωματίου.`,
    );
  }

  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-4xl flex-col px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-5 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          Private test page
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-900 sm:text-4xl">
          Voulamandis Guest Assistant
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
          Ζωντανός έλεγχος διαθεσιμότητας και τιμής από τη Neon. Η έκπτωση 10%
          εφαρμόζεται μόνο μία φορά και δεν συνδυάζεται με άλλη προσφορά.
        </p>
      </div>

      <div className="mb-4 grid gap-3 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_1fr_140px_auto] sm:items-end">
        <label className="text-sm font-medium text-stone-700">
          Άφιξη
          <input
            type="date"
            min={today}
            value={checkin}
            onChange={(event) => setCheckin(event.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-stone-900 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
          />
        </label>
        <label className="text-sm font-medium text-stone-700">
          Αναχώρηση
          <input
            type="date"
            min={checkin || today}
            value={checkout}
            onChange={(event) => setCheckout(event.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-stone-900 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
          />
        </label>
        <label className="text-sm font-medium text-stone-700">
          Επισκέπτες
          <select
            value={guests}
            onChange={(event) => setGuests(Number(event.target.value))}
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-stone-900 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
          >
            {[1, 2, 3, 4].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={checkAvailability}
          disabled={loading}
          className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
        >
          Έλεγχος
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div
          className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6"
          aria-live="polite"
          aria-label="Conversation"
        >
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`}>
              <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[80%] ${
                    message.role === "user"
                      ? "bg-stone-800 text-white"
                      : "bg-stone-100 text-stone-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>

              {message.role === "assistant" && message.offers?.length ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {message.offers.map((offer) => (
                    <article
                      key={`${offer.roomId}:${offer.unitId}`}
                      className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="font-semibold text-stone-900">{offer.name}</h2>
                          <p className="text-sm text-stone-600">{offer.category}</p>
                        </div>
                        <span className="rounded-full bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white">
                          -10% direct
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {[offer.floor, ...offer.features]
                          .filter(Boolean)
                          .map((feature) => (
                            <span
                              key={feature}
                              className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs text-stone-700"
                            >
                              {feature}
                            </span>
                          ))}
                      </div>

                      <div className="mt-4 border-t border-emerald-200 pt-3">
                        <p className="text-sm text-stone-500">
                          Αρχική τιμή: <span className="line-through">{formatEuro(offer.originalTotal)}</span>
                        </p>
                        <p className="mt-1 text-lg font-bold text-emerald-800">
                          Τιμή απευθείας κράτησης: {formatEuro(offer.directTotal)}
                        </p>
                        <p className="mt-1 text-sm font-medium text-emerald-700">
                          Κερδίζετε {formatEuro(offer.saving)} για {offer.nights} νύχτες
                        </p>
                        <p className="mt-2 text-xs leading-5 text-stone-500">
                          Η έκπτωση 10% εφαρμόζεται μία φορά και δεν συνδυάζεται με άλλη προσφορά.
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          {loading ? (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-stone-100 px-4 py-3 text-sm text-stone-600">
                Ελέγχω διαθεσιμότητα και τιμές…
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t border-stone-200 p-4 sm:p-5">
          {messages.length === 1 ? (
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {starterQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void sendMessage(question)}
                  className="shrink-0 rounded-full border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50"
                >
                  {question}
                </button>
              ))}
            </div>
          ) : null}

          {error ? (
            <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <label htmlFor="guest-question" className="sr-only">
              Γράψτε την ερώτησή σας
            </label>
            <input
              ref={inputRef}
              id="guest-question"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={1200}
              disabled={loading}
              placeholder="Ρωτήστε για δωμάτια, παροχές ή τη διαμονή σας…"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="shrink-0 rounded-full bg-stone-800 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-700 disabled:opacity-50"
            >
              Αποστολή
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
