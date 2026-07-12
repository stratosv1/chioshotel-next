"use client";

import { FormEvent, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const starterQuestions = [
  "Ποιο δωμάτιο είναι κατάλληλο για οικογένεια;",
  "Υπάρχει πρωινό;",
  "Which rooms have a kitchenette?",
];

export function GuestAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Γεια σας! Είμαι ο δοκιμαστικός βοηθός του Voulamandis House. Ρωτήστε με για τα δωμάτια, την άφιξη ή τη διαμονή σας. You can also write in English.",
    },
  ]);
  const [input, setInput] = useState("");
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
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();

      if (!response.ok || !data?.answer) {
        throw new Error(data?.error || "The assistant is unavailable.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.answer },
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

  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-5 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          Private test page
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-900 sm:text-4xl">
          Voulamandis Guest Assistant
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
          Δοκιμαστικός AI βοηθός για ερωτήσεις σχετικά με τη διαμονή. Δεν
          πραγματοποιεί ούτε επιβεβαιώνει κρατήσεις.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div
          className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6"
          aria-live="polite"
          aria-label="Conversation"
        >
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
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
          ))}

          {loading ? (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-stone-100 px-4 py-3 text-sm text-stone-600">
                Απαντά…
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
                  className="shrink-0 rounded-full border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
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
              placeholder="Γράψτε την ερώτησή σας…"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="shrink-0 rounded-full bg-stone-800 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Αποστολή
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
