"use client";

import { useEffect, useState } from "react";
import { BANK, BANK_TOPIC_LABELS, type BankItem, type BankPart, type BankTopic } from "./trapeza-data";

const STORAGE_KEY = "mixalis-dianismata-trapeza-v1";

type Mark = "done" | "again";
type Progress = Record<string, Mark>;

const partKey = (item: BankItem, part: BankPart) => `${item.code}-${part.label}`;

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

function PartCard({ part, mark, onMark }: { part: BankPart; mark?: Mark; onMark: (m: Mark | null) => void }) {
  const [hint, setHint] = useState(false);
  const [shown, setShown] = useState(0);
  const total = part.steps.length;
  const allShown = shown >= total;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-start gap-3">
        <span
          className={`inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full px-2 text-sm font-bold ${
            mark === "done" ? "bg-[#2e8b57] text-white" : mark === "again" ? "bg-[#c0392b] text-white" : "bg-[#2c2825] text-white"
          }`}
        >
          {mark === "done" ? "✓" : `${part.label})`}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] leading-8 text-[#2c2825]">{part.prompt}</div>
          <p className="mt-0.5 text-xs font-semibold text-[#857261]">Μονάδες {part.marks}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {!hint ? (
          <button
            type="button"
            onClick={() => setHint(true)}
            className="rounded-full border border-[#c9822f]/40 bg-[#fdf3e6] px-3.5 py-1.5 text-sm font-semibold text-[#8a5a22] hover:bg-[#fbe8cf]"
          >
            💡 Υπόδειξη
          </button>
        ) : null}
        {!allShown ? (
          <button
            type="button"
            onClick={() => setShown((s) => s + 1)}
            className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-sm font-semibold text-[#4d4138] hover:bg-[#f3efe8]"
          >
            {shown === 0 ? "Δείξε το 1ο βήμα της λύσης" : `Επόμενο βήμα (${shown + 1}/${total})`}
          </button>
        ) : null}
        {!allShown && shown > 0 ? (
          <button type="button" onClick={() => setShown(total)} className="px-2 text-xs font-semibold text-[#857261] underline underline-offset-2">
            Όλη η λύση
          </button>
        ) : null}
      </div>

      {hint ? (
        <div className="mt-3 rounded-xl bg-[#fdf3e6] px-3 py-2 text-sm leading-7 text-[#5f4630]">
          <b>💡 Υπόδειξη:</b> {part.hint}
        </div>
      ) : null}

      {shown > 0 ? (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#857261]">Λύση βήμα-βήμα</p>
          <ol className="space-y-1.5">
            {part.steps.slice(0, shown).map((s, i) => (
              <li key={i} className="flex gap-2 rounded-xl bg-[#fbf8f3] px-3 py-2 text-[14px] leading-8 text-[#2c2825] ring-1 ring-black/5">
                <span className="font-bold text-[#c9822f]">{i + 1}.</span>
                <span className="min-w-0">{s}</span>
              </li>
            ))}
          </ol>
          {allShown && part.figure ? <div className="mt-3 rounded-xl border border-black/5 bg-white p-2">{part.figure}</div> : null}
        </div>
      ) : null}

      {allShown ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-black/5 pt-3">
          <span className="text-xs font-semibold text-[#857261]">Πώς πήγε;</span>
          <button
            type="button"
            onClick={() => onMark(mark === "done" ? null : "done")}
            aria-pressed={mark === "done"}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
              mark === "done" ? "bg-[#2e8b57] text-white" : "border border-[#2e8b57]/40 bg-white text-[#245c3d] hover:bg-[#ecf7f0]"
            }`}
          >
            ✓ Το είχα σωστά
          </button>
          <button
            type="button"
            onClick={() => onMark(mark === "again" ? null : "again")}
            aria-pressed={mark === "again"}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
              mark === "again" ? "bg-[#c0392b] text-white" : "border border-[#c0392b]/40 bg-white text-[#7a2c22] hover:bg-[#fdeeec]"
            }`}
          >
            ↺ Θέλω επανάληψη
          </button>
          <button
            type="button"
            onClick={() => {
              setShown(0);
              setHint(false);
            }}
            className="ml-auto text-xs font-semibold text-[#857261] underline underline-offset-2"
          >
            Κρύψε τη λύση
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ItemCard({ item, index, progress, onMark }: { item: BankItem; index: number; progress: Progress; onMark: (k: string, m: Mark | null) => void }) {
  const done = item.parts.filter((p) => progress[partKey(item, p)] === "done").length;
  const [showKey, setShowKey] = useState(false);

  return (
    <article id={`thema-${item.code}`} className="scroll-mt-24 rounded-3xl border border-black/10 bg-[#fffdf9] p-4 shadow-sm sm:p-6">
      <header className="flex flex-wrap items-center gap-2">
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[#c9822f] px-2 text-sm font-bold text-white">{index}</span>
        <span className="rounded-full bg-[#2c2825]/5 px-2.5 py-1 font-mono text-xs font-semibold text-[#4d4138]">
          Τράπεζα · {item.code} · Θέμα {item.thema}
        </span>
        <span className="rounded-full bg-[#fdf3e6] px-2.5 py-1 text-xs font-semibold text-[#8a5a22]">{BANK_TOPIC_LABELS[item.topic]}</span>
        <span className={`ml-auto text-xs font-semibold ${done === item.parts.length ? "text-[#2e8b57]" : "text-[#857261]"}`}>
          {done}/{item.parts.length} ερωτήματα ✓
        </span>
      </header>

      <h3 className="mt-3 text-lg font-semibold tracking-tight sm:text-xl">{item.title}</h3>
      <div className="mt-2 text-[15px] leading-8 text-[#2c2825]">{item.statement}</div>
      {item.figure ? <div className="mt-3 rounded-xl border border-black/5 bg-white p-2">{item.figure}</div> : null}

      <div className="mt-4 space-y-3">
        {item.parts.map((part) => (
          <PartCard key={part.label} part={part} mark={progress[partKey(item, part)]} onMark={(m) => onMark(partKey(item, part), m)} />
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {showKey ? (
          <p className="rounded-xl bg-[#ecf7f0] px-3 py-2 text-sm leading-7 text-[#245c3d]">
            <b>🔑 Η ιδέα του θέματος:</b> {item.key}
          </p>
        ) : (
          <button type="button" onClick={() => setShowKey(true)} className="text-sm font-semibold text-[#2e8b57] underline underline-offset-2">
            🔑 Ποια είναι η βασική ιδέα του θέματος;
          </button>
        )}
        {item.note ? (
          <p className="rounded-xl bg-[#fdeeec] px-3 py-2 text-sm leading-6 text-[#7a2c22]">
            <b>Προσοχή:</b> {item.note}
          </p>
        ) : null}
      </div>
    </article>
  );
}

type Filter = "all" | "todo" | "t2" | "t4" | BankTopic;

export function Trapeza() {
  const [filter, setFilter] = useState<Filter>("all");
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const setMark = (k: string, m: Mark | null) => {
    setProgress((prev) => {
      const next = { ...prev };
      if (m) next[k] = m;
      else delete next[k];
      saveProgress(next);
      return next;
    });
  };

  const allParts = BANK.flatMap((item) => item.parts.map((p) => partKey(item, p)));
  const doneCount = allParts.filter((k) => progress[k] === "done").length;
  const againCount = allParts.filter((k) => progress[k] === "again").length;

  const numbered = BANK.map((item, i) => ({ item, n: i + 1 }));
  const list = numbered.filter(({ item }) => {
    if (filter === "all") return true;
    if (filter === "t2") return item.thema === 2;
    if (filter === "t4") return item.thema === 4;
    if (filter === "todo") return item.parts.some((p) => progress[partKey(item, p)] !== "done");
    return item.topic === filter;
  });

  const topics = Object.keys(BANK_TOPIC_LABELS) as BankTopic[];
  const filters: [Filter, string][] = [
    ["all", `Όλα (${BANK.length})`],
    ["t2", `Θέμα 2 (${BANK.filter((i) => i.thema === 2).length})`],
    ["t4", `Θέμα 4 (${BANK.filter((i) => i.thema === 4).length})`],
    ...topics.map((t) => [t, `${BANK_TOPIC_LABELS[t]} (${BANK.filter((i) => i.topic === t).length})`] as [Filter, string]),
    ["todo", "Για επανάληψη"],
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3 text-sm">
          <span className="font-semibold text-[#4d4138]">Πρόοδος</span>
          <span className="font-mono font-semibold text-[#2e8b57]">
            {doneCount} / {allParts.length} ερωτήματα σωστά{againCount ? ` · ${againCount} για επανάληψη` : ""}
          </span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e9e0d5]">
          <div className="h-full rounded-full bg-[#2e8b57] transition-all" style={{ width: `${Math.round((doneCount / allParts.length) * 100)}%` }} />
        </div>
        <p className="mt-2 text-xs leading-5 text-[#857261]">
          Η πρόοδος κρατιέται σε αυτή τη συσκευή.
          {doneCount + againCount > 0 ? (
            <>
              {" "}
              <button
                type="button"
                onClick={() => {
                  setProgress({});
                  saveProgress({});
                }}
                className="font-semibold underline underline-offset-2"
              >
                Μηδένισε την πρόοδο
              </button>
            </>
          ) : null}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map(([key, label]) => (
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

      <div className="grid gap-5">
        {list.map(({ item, n }) => (
          <ItemCard key={item.code} item={item} index={n} progress={progress} onMark={setMark} />
        ))}
        {list.length === 0 ? <p className="text-sm text-[#857261]">Τα έλυσες όλα σωστά! 🎉</p> : null}
      </div>
    </div>
  );
}
