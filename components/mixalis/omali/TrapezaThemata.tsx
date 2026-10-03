"use client";

import { Children, Fragment, cloneElement, isValidElement, useEffect, useMemo, useState, type ReactElement, type ReactNode } from "react";
import { BANK, BANK_TOPIC_LABELS, type BankQuestion, type BankTopic } from "./trapeza-data";

const STORAGE_KEY = "mixalis-omali-trapeza-v1";

type Progress = Record<string, "right" | "wrong" | "read">;


/** Γράφει τα «T_Α», «υ_κ» κ.λπ. με κανονικούς δείκτες. */
const SUB = /_([A-Za-zΑ-Ωα-ωΆ-ώ0-9]+)/g;
function Sub({ children }: { children: ReactNode }): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string") {
      if (!child.includes("_")) return child;
      const out: ReactNode[] = [];
      let last = 0;
      for (const m of child.matchAll(SUB)) {
        out.push(child.slice(last, m.index));
        out.push(
          <sub key={m.index} className="text-[0.75em]">
            {m[1]}
          </sub>,
        );
        last = (m.index ?? 0) + m[0].length;
      }
      out.push(child.slice(last));
      return out;
    }
    if (isValidElement(child)) {
      const el = child as ReactElement<{ children?: ReactNode }>;
      if ((typeof el.type === "string" || el.type === Fragment) && el.props.children !== undefined) {
        return cloneElement(el, undefined, <Sub>{el.props.children}</Sub>);
      }
    }
    return child;
  });
}

const keyOf = (q: BankQuestion) => `${q.code}-${q.part}`;

function loadProgress(): Progress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(value: Progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* χωρίς αποθήκευση απλώς δεν θυμάται την πρόοδο */
  }
}

function BankCard({
  q,
  index,
  status,
  onStatus,
}: {
  q: BankQuestion;
  index: number;
  status?: Progress[string];
  onStatus: (s: Progress[string] | null) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const hasChoices = !!q.choices?.length;
  const open = revealed || picked !== null;
  const right = picked !== null && picked === q.correct;

  const pick = (i: number) => {
    if (open) return;
    setPicked(i);
    onStatus(i === q.correct ? "right" : "wrong");
  };

  const reveal = () => {
    setRevealed(true);
    if (!status) onStatus("read");
  };

  const reset = () => {
    setPicked(null);
    setRevealed(false);
  };

  const badge =
    status === "right" ? "bg-[#2e8b57] text-white" : status === "wrong" ? "bg-[#c0392b] text-white" : status === "read" ? "bg-[#c9822f] text-white" : "bg-[#2c2825] text-white";

  return (
    <article className="rounded-2xl border border-black/10 bg-[#fffdf9] p-4 sm:p-5">
      <header className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-sm font-bold ${badge}`}>
          {status === "right" ? "✓" : status === "wrong" ? "✗" : index}
        </span>
        <span className="rounded-full bg-[#2c2825]/5 px-2.5 py-1 font-mono text-xs font-semibold text-[#4d4138]">
          Τράπεζα · {q.code} · Θέμα {q.part}
        </span>
        <span className="rounded-full bg-[#fdf3e6] px-2.5 py-1 text-xs font-semibold text-[#8a5a22]">{BANK_TOPIC_LABELS[q.topic]}</span>
        {q.alsoNeeds ? <span className="text-xs text-[#857261]">({q.alsoNeeds})</span> : null}
      </header>

      <div className="mt-3 text-[15px] leading-7 text-[#2c2825]">
        <Sub>{q.prompt}</Sub>
      </div>

      {q.figure ? <div className="mt-3 rounded-xl border border-black/5 bg-white p-2">{q.figure}</div> : null}

      {hasChoices ? (
        <div className="mt-3 grid gap-2">
          {q.choices!.map((choice, i) => {
            const isPicked = picked === i;
            const isCorrect = i === q.correct;
            let style = "border-black/10 bg-white hover:bg-[#f3efe8]";
            if (open && isCorrect) style = "border-[#2e8b57]/50 bg-[#ecf7f0]";
            else if (open && isPicked) style = "border-[#c0392b]/40 bg-[#fdeeec]";
            else if (open) style = "border-black/5 bg-white opacity-60";
            return (
              <button
                key={i}
                type="button"
                disabled={open}
                onClick={() => pick(i)}
                className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-left text-sm leading-6 transition ${style}`}
              >
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2c2825]/10 text-xs font-bold">
                  {open && isCorrect ? "✓" : open && isPicked ? "✗" : String.fromCharCode(945 + i)}
                </span>
                <span>
                  <Sub>{choice}</Sub>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {!open ? (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={reveal}
            className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-sm font-semibold text-[#4d4138] hover:bg-[#f3efe8]"
          >
            {hasChoices ? "Δείξε απάντηση & εξήγηση" : "Σκέψου πρώτα, μετά δες την απάντηση"}
          </button>
          {hasChoices ? <span className="text-xs text-[#857261]">ή διάλεξε πρώτα μια επιλογή</span> : null}
        </div>
      ) : (
        <div className="mt-4 space-y-3 text-sm leading-6">
          {picked !== null ? (
            <p className={`font-semibold ${right ? "text-[#2e8b57]" : "text-[#c0392b]"}`}>
              {right ? "Σωστά! Τώρα έλεγξε ότι η αιτιολόγησή σου έχει τα ίδια βήματα." : "Όχι αυτή. Διάβασε γιατί:"}
            </p>
          ) : null}
          {picked !== null && !right && q.whyWrong?.[picked] ? (
            <p className="rounded-xl bg-[#fdeeec] px-3 py-2 text-[#7a2c22]"><Sub>{q.whyWrong[picked]}</Sub></p>
          ) : null}

          <p className="rounded-xl bg-[#ecf7f0] px-3 py-2 font-semibold text-[#245c3d]">Απάντηση: <Sub>{q.answer}</Sub></p>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#857261]">Αιτιολόγηση βήμα-βήμα</p>
            <ol className="space-y-1.5">
              {q.steps.map((s, i) => (
                <li key={i} className="flex gap-2 rounded-xl bg-white px-3 py-2 text-[14px] leading-6 text-[#2c2825] ring-1 ring-black/5">
                  <span className="font-bold text-[#c9822f]">{i + 1}.</span>
                  <span>
                    <Sub>{s}</Sub>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <p className="rounded-xl bg-[#fdf3e6] px-3 py-2 text-[#5f4630]">
            <b>🔑 Το κλειδί:</b> <Sub>{q.key}</Sub>
          </p>

          <button type="button" onClick={reset} className="text-xs font-semibold text-[#857261] underline underline-offset-2">
            Κρύψε την απάντηση
          </button>
        </div>
      )}
    </article>
  );
}

export function TrapezaThemata() {
  const [filter, setFilter] = useState<BankTopic | "all" | "todo">("all");
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const setOne = (k: string, s: Progress[string] | null) => {
    setProgress((prev) => {
      const next = { ...prev };
      if (s) next[k] = s;
      else delete next[k];
      saveProgress(next);
      return next;
    });
  };

  const numbered = useMemo(() => BANK.map((q, i) => ({ q, n: i + 1 })), []);
  const list = numbered.filter(({ q }) =>
    filter === "all" ? true : filter === "todo" ? progress[keyOf(q)] !== "right" : q.topic === filter,
  );

  const rightCount = BANK.filter((q) => progress[keyOf(q)] === "right").length;
  const seenCount = BANK.filter((q) => progress[keyOf(q)]).length;
  const topics = Object.keys(BANK_TOPIC_LABELS) as BankTopic[];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3 text-sm">
          <span className="font-semibold text-[#4d4138]">Πρόοδος</span>
          <span className="font-mono font-semibold text-[#2e8b57]">
            {rightCount} σωστές · {seenCount} / {BANK.length} διαβασμένες
          </span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e9e0d5]">
          <div className="h-full rounded-full bg-[#2e8b57] transition-all" style={{ width: `${Math.round((rightCount / BANK.length) * 100)}%` }} />
        </div>
        <p className="mt-2 text-xs leading-5 text-[#857261]">
          Πράσινο = το βρήκες με την πρώτη. Κόκκινο = ξανακοίτα το (το φίλτρο «Για επανάληψη» δείχνει όσα δεν έχεις βρει ακόμα). Η πρόοδος κρατιέται σε
          αυτή τη συσκευή.
        </p>
        {seenCount > 0 ? (
          <button
            type="button"
            onClick={() => {
              setProgress({});
              saveProgress({});
            }}
            className="mt-2 text-xs font-semibold text-[#857261] underline underline-offset-2"
          >
            Μηδένισε την πρόοδο
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", `Όλα (${BANK.length})`],
            ["todo", "Για επανάληψη"],
            ...topics.map((t) => [t, `${BANK_TOPIC_LABELS[t]} (${BANK.filter((q) => q.topic === t).length})`]),
          ] as [typeof filter, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
              filter === key ? "bg-[#2c2825] text-white" : "border border-black/10 bg-white text-[#4d4138] hover:bg-[#f3efe8]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {list.map(({ q, n }) => (
          <BankCard key={keyOf(q)} q={q} index={n} status={progress[keyOf(q)]} onStatus={(s) => setOne(keyOf(q), s)} />
        ))}
        {list.length === 0 ? <p className="text-sm text-[#857261]">Τα βρήκες όλα σωστά! 🎉</p> : null}
      </div>

      <p className="text-xs leading-5 text-[#857261]">
        Πηγή εκφωνήσεων: Τράπεζα Θεμάτων Διαβαθμισμένης Δυσκολίας (ΙΕΠ), Β΄ Λυκείου, Φυσική Προσανατολισμού, ύλη 1.2–1.3 (33 θέματα). Από κάθε θέμα
        υπάρχει εδώ μόνο το ερώτημα που αφορά την κυκλική κίνηση· το άλλο ερώτημα είναι από άλλο κεφάλαιο. Τα σχήματα είναι ξανασχεδιασμένα και οι
        εξηγήσεις γραμμένες για μελέτη.
      </p>
    </div>
  );
}
