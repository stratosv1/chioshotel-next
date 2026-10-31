"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { readStore, shuffle, speak, writeStore } from "./speak";

type Word = { id: string; term: string; meaning: string; note: string; example: string; unitNumber: number };
type Kind = "meaning" | "term" | "write";
type Question = { word: Word; kind: Kind; options: string[] };
type Answer = { question: Question; given: string; correct: boolean };

const ARTICLES = /^(der|die|das|the|to|a|an)\s+/i;

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFC")
    .replace(/[.,!?;:()"“”'’]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function pickOptions(word: Word, pool: Word[], field: "meaning" | "term") {
  const right = word[field];
  const others = shuffle(pool.filter((w) => w.id !== word.id && normalize(w[field]) !== normalize(right)))
    .map((w) => w[field])
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 3);
  return shuffle([right, ...others]);
}

function buildQuestions(words: Word[], pool: Word[]): Question[] {
  return shuffle(words).map((word, i) => {
    const kind: Kind = pool.length < 4 ? "write" : (["meaning", "term", "write"] as Kind[])[i % 3];
    return {
      word,
      kind,
      options: kind === "write" ? [] : pickOptions(word, pool, kind === "meaning" ? "meaning" : "term"),
    };
  });
}

export function Revision({
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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [current, setCurrent] = useState<Answer | null>(null);
  const [typed, setTyped] = useState("");
  const [best, setBest] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuestions(buildQuestions(words, words));
    setBest(readStore<number | null>(storageKey, null));
  }, [words, storageKey]);

  const question = questions[index];
  const finished = questions.length > 0 && index >= questions.length;
  const score = answers.filter((a) => a.correct).length;
  const percent = questions.length ? Math.round((score / questions.length) * 100) : 0;

  useEffect(() => {
    if (question?.kind === "write" && !current) inputRef.current?.focus();
  }, [question, current]);

  useEffect(() => {
    if (finished && (best === null || percent > best)) {
      setBest(percent);
      writeStore(storageKey, percent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  function answer(given: string) {
    if (!question || current) return;
    let correct: boolean;
    if (question.kind === "write") {
      const want = normalize(question.word.term);
      const got = normalize(given);
      correct = got === want || (speechLang.startsWith("en") && got.replace(ARTICLES, "") === want.replace(ARTICLES, ""));
    } else {
      const field = question.kind === "meaning" ? "meaning" : "term";
      correct = given === question.word[field];
    }
    const result = { question, given, correct };
    setCurrent(result);
    setAnswers((a) => [...a, result]);
    if (question.kind !== "meaning") speak(question.word.term, speechLang);
  }

  function next() {
    setCurrent(null);
    setTyped("");
    setIndex((i) => i + 1);
  }

  function restart(list: Word[]) {
    setQuestions(buildQuestions(list, words));
    setAnswers([]);
    setCurrent(null);
    setTyped("");
    setIndex(0);
  }

  const mistakes = useMemo(() => answers.filter((a) => !a.correct), [answers]);

  if (questions.length === 0) return null;

  if (finished) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm">
          <p className="text-5xl font-semibold tracking-tight">{percent}%</p>
          <p className="mt-2 text-[#6f665f]">
            {score} σωστές από {questions.length}
            {best !== null ? ` · καλύτερο σκορ ${best}%` : ""}
          </p>
          <p className="mt-3 text-lg font-medium">
            {percent >= 90 ? "Τέλεια! 🌟" : percent >= 70 ? "Πολύ καλά! 💪" : percent >= 50 ? "Καλή προσπάθεια, κάνε τα λάθη ξανά." : "Ξαναδές τα flashcards και δοκίμασε πάλι."}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {mistakes.length > 0 ? (
              <button type="button" onClick={() => restart(mistakes.map((m) => m.question.word))} className={`rounded-xl px-5 py-2.5 text-sm font-semibold ${accent}`}>
                Ξανά μόνο τα λάθη ({mistakes.length})
              </button>
            ) : null}
            <button type="button" onClick={() => restart(words)} className="rounded-xl border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold">
              Νέο τεστ με όλες
            </button>
          </div>
        </div>
        {mistakes.length > 0 ? (
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <h3 className="font-semibold">Τα λάθη σου</h3>
            <ul className="mt-3 divide-y divide-black/5">
              {mistakes.map((m, i) => (
                <li key={i} className="py-2.5 text-sm">
                  <span className="font-semibold">{m.question.word.term}</span> · {m.question.word.meaning}
                  <span className="ml-2 text-xs text-[#9a8f86]">κεφ. {m.question.word.unitNumber}</span>
                  {m.given ? <span className="block text-xs text-red-700">Έγραψες: {m.given}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }

  const { word, kind } = question;
  const prompt = kind === "meaning" ? word.term : word.meaning;
  const right = kind === "meaning" ? word.meaning : word.term;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-[#857a70]">
        <span>
          Ερώτηση {index + 1} από {questions.length}
        </span>
        <span className="font-semibold text-[#5f7d4a]">✓ {score}</span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-black/10">
        <div className={`h-full transition-all ${accent}`} style={{ width: `${(index / questions.length) * 100}%` }} />
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(72,58,45,0.10)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a8f86]">
          {kind === "meaning" ? "Τι σημαίνει;" : kind === "term" ? `Πώς λέγεται στα ${termLabel === "English" ? "Αγγλικά" : "Γερμανικά"};` : `Γράψ' το στα ${termLabel === "English" ? "Αγγλικά" : "Γερμανικά"}`}
        </p>
        <p className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{prompt}</p>
        {kind === "meaning" ? (
          <button type="button" onClick={() => speak(word.term, speechLang)} className="mt-2 text-sm text-[#6f665f] hover:underline">
            🔊 Άκου
          </button>
        ) : null}

        {kind === "write" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (current) next();
              else if (typed.trim()) answer(typed);
            }}
            className="mt-6"
          >
            <input
              ref={inputRef}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              disabled={Boolean(current)}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder={speechLang.startsWith("de") ? "π.χ. der Hund" : "Γράψε τη λέξη"}
              className="w-full rounded-2xl border border-black/15 bg-[#fbfaf8] px-4 py-3 text-lg outline-none focus:border-[#725f4e] focus:ring-4 focus:ring-[#725f4e]/10"
            />
            {!current ? (
              <button type="submit" className={`mt-3 rounded-xl px-5 py-2.5 text-sm font-semibold ${accent}`}>
                Έλεγχος
              </button>
            ) : null}
          </form>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {question.options.map((option) => {
              const chosen = current?.given === option;
              const isRight = option === right;
              const tone = !current
                ? "border-black/10 bg-[#faf8f5] hover:bg-[#f1ebe3]"
                : isRight
                  ? "border-[#7fae62] bg-[#e5f2dc] text-[#2f5420]"
                  : chosen
                    ? "border-red-300 bg-red-50 text-red-800"
                    : "border-black/10 bg-[#faf8f5] opacity-60";
              return (
                <button key={option} type="button" onClick={() => answer(option)} disabled={Boolean(current)} className={`rounded-2xl border px-4 py-3.5 text-left text-base font-medium transition ${tone}`}>
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {current ? (
          <div className={`mt-5 rounded-2xl px-4 py-3 text-sm ${current.correct ? "bg-[#e5f2dc] text-[#2f5420]" : "bg-red-50 text-red-800"}`}>
            <p className="font-semibold">{current.correct ? "Σωστό! ✓" : `Η σωστή απάντηση: ${right}`}</p>
            <p className="mt-1 text-[#4d4138]">
              {word.term} · {word.meaning}
              {word.note ? ` · ${word.note}` : ""}
            </p>
            {word.example ? <p className="mt-1 italic text-[#6f665f]">“{word.example}”</p> : null}
          </div>
        ) : null}

        {current ? (
          <button type="button" onClick={next} autoFocus className={`mt-4 rounded-xl px-5 py-2.5 text-sm font-semibold ${accent}`}>
            {index + 1 < questions.length ? "Επόμενη →" : "Δες το αποτέλεσμα"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
