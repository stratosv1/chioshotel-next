"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { readStore, shuffle, speak, writeStore } from "./speak";

type Word = { id: string; term: string; meaning: string; note: string; example: string };
type Marks = Record<string, "known" | "again">;

export function Flashcards({
  words,
  storageKey,
  speechLang,
  termLabel,
  accent,
}: {
  words: Word[];
  storageKey: string;
  speechLang: string;
  termLabel: string;
  accent: string;
}) {
  const [marks, setMarks] = useState<Marks>({});
  const [reverse, setReverse] = useState(false); // false: ξένη λέξη → ελληνικά
  const [deck, setDeck] = useState<Word[]>(words);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setMarks(readStore<Marks>(storageKey, {}));
  }, [storageKey]);

  const mark = useCallback(
    (id: string, value: "known" | "again") => {
      setMarks((current) => {
        const next = { ...current, [id]: value };
        writeStore(storageKey, next);
        return next;
      });
      setFlipped(false);
      setIndex((i) => i + 1);
    },
    [storageKey],
  );

  const start = (list: Word[], mix: boolean) => {
    setDeck(mix ? shuffle(list) : list);
    setIndex(0);
    setFlipped(false);
  };

  const knownCount = useMemo(() => words.filter((w) => marks[w.id] === "known").length, [words, marks]);
  const toReview = useMemo(() => words.filter((w) => marks[w.id] !== "known"), [words, marks]);
  const card = deck[index];
  const done = index >= deck.length;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!card || (e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && e.key === "ArrowRight") mark(card.id, "known");
      else if (flipped && e.key === "ArrowLeft") mark(card.id, "again");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [card, flipped, mark]);

  const pill = "rounded-full border border-black/10 px-3 py-1.5 text-sm font-medium transition";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => start(words, true)} className={`${pill} bg-white hover:bg-[#f7f4ef]`}>
          🔀 Ανακάτεμα
        </button>
        <button type="button" onClick={() => start(words, false)} className={`${pill} bg-white hover:bg-[#f7f4ef]`}>
          Με τη σειρά
        </button>
        <button
          type="button"
          onClick={() => start(toReview, true)}
          disabled={toReview.length === 0}
          className={`${pill} bg-white hover:bg-[#f7f4ef] disabled:opacity-40`}
        >
          Μόνο όσες δεν ξέρω ({toReview.length})
        </button>
        <button
          type="button"
          onClick={() => {
            setReverse((r) => !r);
            setFlipped(false);
          }}
          className={`${pill} bg-[#3e352f] text-white`}
        >
          {reverse ? `Ελληνικά → ${termLabel}` : `${termLabel} → Ελληνικά`}
        </button>
        <span className="ml-auto text-sm font-semibold text-[#5f7d4a]">
          ✓ {knownCount}/{words.length}
        </span>
      </div>

      <div className="mb-3 h-2 overflow-hidden rounded-full bg-black/10">
        <div className={`h-full transition-all ${accent}`} style={{ width: `${deck.length ? (Math.min(index, deck.length) / deck.length) * 100 : 0}%` }} />
      </div>

      {done ? (
        <div className="rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm">
          <p className="text-4xl">🎉</p>
          <h3 className="mt-3 text-2xl font-semibold">Τέλος!</h3>
          <p className="mt-2 text-[#6f665f]">
            Ξέρεις {knownCount} από τις {words.length} λέξεις.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {toReview.length > 0 ? (
              <button type="button" onClick={() => start(toReview, true)} className={`rounded-xl px-5 py-2.5 text-sm font-semibold ${accent}`}>
                Ξανά όσες δεν ξέρω ({toReview.length})
              </button>
            ) : null}
            <button type="button" onClick={() => start(words, true)} className="rounded-xl border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold">
              Από την αρχή
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-2 text-center text-sm text-[#857a70]">
            Κάρτα {index + 1} από {deck.length}
          </p>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="relative flex min-h-[16rem] w-full flex-col items-center justify-center rounded-3xl border border-black/10 bg-white p-8 text-center shadow-[0_20px_60px_rgba(72,58,45,0.10)] transition hover:shadow-[0_24px_70px_rgba(72,58,45,0.16)] sm:min-h-[19rem]"
          >
            {!flipped ? (
              <>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a8f86]">{reverse ? "Ελληνικά" : termLabel}</span>
                <span className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">{reverse ? card.meaning : card.term}</span>
                <span className="mt-8 text-sm text-[#9a8f86]">Πάτα για να δεις την απάντηση</span>
              </>
            ) : (
              <>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a8f86]">{reverse ? termLabel : "Ελληνικά"}</span>
                <span className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">{reverse ? card.term : card.meaning}</span>
                <span className="mt-3 text-base text-[#6f665f]">{reverse ? card.meaning : card.term}</span>
                {card.note ? <span className="mt-3 rounded-full bg-[#f3efe8] px-3 py-1 text-sm text-[#5f5045]">{card.note}</span> : null}
                {card.example ? <span className="mt-4 max-w-lg text-base italic text-[#4d4138]">“{card.example}”</span> : null}
              </>
            )}
          </button>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => speak(card.example && flipped ? `${card.term}. ${card.example}` : card.term, speechLang)}
              className="rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-medium hover:bg-[#f7f4ef]"
              aria-label="Άκου την προφορά"
            >
              🔊 Άκου
            </button>
            {flipped ? (
              <>
                <button type="button" onClick={() => mark(card.id, "again")} className="rounded-xl bg-[#f6e3d8] px-5 py-3 text-sm font-semibold text-[#8a3a17] hover:bg-[#f0d2c1]">
                  ↺ Ξανά
                </button>
                <button type="button" onClick={() => mark(card.id, "known")} className="rounded-xl bg-[#dcebd2] px-5 py-3 text-sm font-semibold text-[#3d6328] hover:bg-[#cfe3c2]">
                  ✓ Το ξέρω
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setFlipped(true)} className={`rounded-xl px-5 py-3 text-sm font-semibold ${accent}`}>
                Δες την απάντηση
              </button>
            )}
          </div>
        </>
      )}

      <details className="mt-8 rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
        <summary className="cursor-pointer text-sm font-semibold">Όλες οι λέξεις του κεφαλαίου ({words.length})</summary>
        <ul className="mt-4 divide-y divide-black/5">
          {words.map((w) => (
            <li key={w.id} className="flex items-start gap-3 py-2.5">
              <span className="w-5 pt-0.5 text-sm">{marks[w.id] === "known" ? "✓" : marks[w.id] === "again" ? "↺" : ""}</span>
              <button type="button" onClick={() => speak(w.term, speechLang)} className="min-w-0 flex-1 text-left">
                <span className="font-semibold">{w.term}</span>
                <span className="text-[#6f665f]"> · {w.meaning}</span>
                {w.note ? <span className="block text-xs text-[#9a8f86]">{w.note}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
