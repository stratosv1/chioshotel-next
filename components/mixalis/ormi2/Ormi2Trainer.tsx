"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, BookOpen, BrainCircuit, CheckCircle2, ChevronRight,
  CircleHelp, ClipboardCheck, Eye, GitBranch, Lightbulb, RotateCcw,
  Sparkles, Target, Trophy, XCircle,
} from "lucide-react";
import { SCENARIOS, type Scenario, type Tool } from "@/components/mixalis/ormi/OrmiPhaseQuiz";

type Step = "observe" | "cuts" | "laws" | "start" | "solve";
type Check = "cuts" | "laws" | "start";
type Verdicts = Record<Check, boolean | null>;
type HistoryEntry = { attempts: number; bestDecisions: number; cleanPlans: number; needsReview: boolean; last: number };
type History = Record<string, HistoryEntry>;

const STORAGE_KEY = "mixalis-ormi2-lab-v1";
const STEPS: { id: Step; name: string; short: string }[] = [
  { id: "observe", name: "Παρατήρηση", short: "Βλέπω" },
  { id: "cuts", name: "Φάσεις", short: "Χωρίζω" },
  { id: "laws", name: "Νόμοι", short: "Επιλέγω" },
  { id: "start", name: "Στρατηγική", short: "Συνδέω" },
  { id: "solve", name: "Επίλυση", short: "Λύνω" },
];

const TOOLS: { id: Tool; label: string; description: string }[] = [
  { id: "ado", label: "ΑΔΟ", description: "Ολική ορμή ενός συστήματος" },
  { id: "dpdt", label: "ΣF = Δp/Δt", description: "Ώθηση και μέση δύναμη" },
  { id: "q", label: "Κινητική ενέργεια", description: "Απώλεια / μεταβολή K" },
  { id: "thmke", label: "ΘΜΚΕ", description: "Έργο δυνάμεων" },
  { id: "adme", label: "ΑΔΜΕ", description: "Μηχανική ενέργεια" },
  { id: "kin", label: "Κινηματική", description: "Χρόνος, επιτάχυνση, απόσταση" },
  { id: "bolh", label: "Οριζόντια βολή", description: "Ελεύθερη πτώση και οριζόντια κίνηση" },
  { id: "kentro", label: "Κεντρομόλος", description: "Στιγμιαία ακτινική συνισταμένη" },
  { id: "rate", label: "Ρυθμοί", description: "dp/dt και dK/dt" },
];

const blankVerdicts = (): Verdicts => ({ cuts: null, laws: null, start: null });
const sameNumbers = (a: number[], b: number[]) =>
  a.length === b.length && a.every((v) => b.includes(v));

function groupsFor(s: Scenario): string[][] {
  const groups: string[][] = [[]];
  s.segs.forEach((part, i) => {
    groups[groups.length - 1].push(part);
    if (s.cuts.includes(i) && i !== s.segs.length - 1) groups.push([]);
  });
  return groups;
}

function lawsCorrect(s: Scenario, selected: Record<number, Tool[]>): boolean {
  return s.phases.every((p, i) => {
    const picked = new Set(selected[i] ?? []);
    const allowed = new Set([...p.best, ...(p.ok ?? [])]);
    return p.best.every((law) => picked.has(law)) &&
      [...picked].every((law) => allowed.has(law));
  });
}

function readHistory(): History {
  try {
    const json: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    if (!json || typeof json !== "object" || Array.isArray(json)) return {};
    return json as History;
  } catch {
    return {};
  }
}

/** The three introductory scenes have dedicated motion drawings; others use a truthful event storyboard. */
function PhysicsScene({ s, frame }: { s: Scenario; frame: number }) {
  const stageText = ["Αρχική κατάσταση", "Η αλλαγή / κρούση", "Κίνηση μετά το γεγονός"];
  if (s.id === "bullet-floor") {
    return (
      <svg viewBox="0 0 500 190" role="img" aria-label="Βλήμα, πλαστική κρούση σε ξύλο και ολίσθηση με τριβή" className="w-full">
        <rect x="12" y="9" width="476" height="172" rx="16" fill="#f4f8f7" />
        <path d="M28 143H470" stroke="#a4b6b0" strokeWidth="4" strokeLinecap="round" />
        {Array.from({ length: 13 }, (_, i) => <path key={i} d={"M" + (32 + i * 34) + " 145l-9 10"} stroke="#c5d1cc" strokeWidth="2" />)}
        <rect x={218 + (frame === 2 ? 105 : 0)} y="93" width="59" height="49" rx="5" fill="#b77a49" style={{ transition: "x 700ms ease" }} />
        <rect x={frame === 0 ? 75 : frame === 1 ? 208 : 313} y="111" width="21" height="13" rx="5" fill="#276f9a" style={{ transition: "x 700ms ease" }} />
        <path d={frame === 0 ? "M110 118h65m-9-7 9 7-9 7" : frame === 1 ? "M283 117h45m-8-7 8 7-8 7" : "M383 117h37m-8-7 8 7-8 7"} stroke="#276f9a" strokeWidth="3" fill="none" strokeLinecap="round" />
        {frame === 2 && <path d="M325 169h-51m8-7-8 7 8 7" stroke="#bb5c43" strokeWidth="3" fill="none" />}
        <text x="250" y="37" textAnchor="middle" fontSize="17" fill="#304239" fontWeight="700">{stageText[frame]}</text>
        <text x="250" y="65" textAnchor="middle" fontSize="13" fill="#62756e">{frame === 2 ? "Τριβή αντίθετη στην κίνηση" : "Οριζόντια κίνηση"}</text>
      </svg>
    );
  }
  if (s.id === "ballistic") {
    return (
      <svg viewBox="0 0 500 190" role="img" aria-label="Βλήμα που σφηνώνεται σε εκκρεμές και στη συνέχεια ανεβαίνει" className="w-full">
        <rect x="12" y="9" width="476" height="172" rx="16" fill="#f4f8f7" />
        <circle cx="303" cy="27" r="6" fill="#59685e" />
        <path d={frame === 2 ? "M303 27L364 106" : "M303 27L303 137"} stroke="#636c67" strokeWidth="3" />
        <rect x={frame === 2 ? 348 : 286} y={frame === 2 ? 100 : 131} width="35" height="33" rx="6" fill="#b77a49" />
        <circle cx={frame === 0 ? 102 : frame === 1 ? 284 : 348} cy={frame === 2 ? 116 : 148} r="7" fill="#276f9a" />
        {frame === 0 && <path d="M124 148h82m-9-8 9 8-9 8" stroke="#276f9a" strokeWidth="3" fill="none" />}
        {frame === 2 && <path d="M394 118q17-37-2-66" fill="none" stroke="#348a61" strokeWidth="3" strokeDasharray="5 5" />}
        <text x="245" y="51" textAnchor="middle" fontSize="16" fill="#304239" fontWeight="700">{stageText[frame]}</text>
        <text x="245" y="71" textAnchor="middle" fontSize="12" fill="#62756e">{frame === 2 ? "Άνοδος του συσσωματώματος" : "Σύντομη πλαστική κρούση"}</text>
      </svg>
    );
  }
  if (s.id === "table-edge") {
    return (
      <svg viewBox="0 0 500 190" role="img" aria-label="Πλαστελίνη συγκρούεται με κύβο στην άκρη τραπεζιού και ακολουθεί οριζόντια βολή" className="w-full">
        <rect x="12" y="9" width="476" height="172" rx="16" fill="#f4f8f7" />
        <path d="M30 124H322V170" stroke="#a5b3ae" strokeWidth="8" fill="none" strokeLinejoin="round" />
        <rect x={frame === 2 ? 352 : 280} y={frame === 2 ? 148 : 95} width="32" height="28" rx="5" fill="#b77a49" />
        <circle cx={frame === 0 ? 100 : frame === 1 ? 276 : 352} cy={frame === 2 ? 162 : 109} r="7" fill="#276f9a" />
        {frame === 0 && <path d="M119 109h95m-9-8 9 8-9 8" stroke="#276f9a" strokeWidth="3" fill="none" />}
        {frame === 2 && <path d="M322 111Q355 118 370 163" fill="none" stroke="#348a61" strokeWidth="3" strokeDasharray="5 5" />}
        <text x="231" y="43" textAnchor="middle" fontSize="16" fill="#304239" fontWeight="700">{stageText[frame]}</text>
        <text x="231" y="64" textAnchor="middle" fontSize="12" fill="#62756e">{frame === 2 ? "Οριζόντια βολή" : "Πλαστελίνη και κύβος"}</text>
      </svg>
    );
  }
  return (
    <div className="rounded-2xl bg-[#f4f8f7] p-4 sm:p-6" aria-label="Αφήγηση διαδοχικών γεγονότων">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#56766a]">Αφήγηση γεγονότων · βήμα {frame + 1}/3</p>
      <div className="flex items-center gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className={"h-2 flex-1 rounded-full transition-colors " + (i <= frame ? "bg-[#237b65]" : "bg-[#d7e4dd]")} />
        ))}
      </div>
      <div className="mt-4 flex min-h-28 items-center justify-center rounded-xl border border-[#d6e4dc] bg-white px-5 py-6 text-center text-base leading-7 text-[#2e453b]">
        {s.segs[Math.min(s.segs.length - 1, Math.floor(frame * s.segs.length / 3))]}
      </div>
      <p className="mt-3 text-center text-xs text-[#66776e]">Αφήγηση εκφώνησης, όχι αριθμητική προσομοίωση.</p>
    </div>
  );
}

export function Ormi2Trainer() {
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState<Step>("observe");
  const [frame, setFrame] = useState(0);
  const [cuts, setCuts] = useState<number[]>([]);
  const [selectedLaws, setSelectedLaws] = useState<Record<number, Tool[]>>({});
  const [startAt, setStartAt] = useState<number | null>(null);
  const [verdicts, setVerdicts] = useState<Verdicts>(blankVerdicts);
  const [first, setFirst] = useState<Verdicts>(blankVerdicts);
  const [help, setHelp] = useState(0);
  const [plan, setPlan] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [history, setHistory] = useState<History>({});
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<"all" | "basic" | "advanced" | "review">("all");
  const [search, setSearch] = useState("");
  const [savedThisRound, setSavedThisRound] = useState(false);

  const s = SCENARIOS[index];
  const grouped = useMemo(() => groupsFor(s), [s]);
  const total = SCENARIOS.length;

  useEffect(() => {
    setHistory(readHistory());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } catch { /* optional local storage */ }
  }, [history, ready]);

  const progress = Object.values(history).filter((entry) => entry.attempts > 0).length;
  const independent = Object.values(history).filter((entry) => entry.cleanPlans > 0).length;

  const filtered = SCENARIOS.map((item, i) => ({ item, i })).filter(({ item }) => {
    if (search && !(item.title + " " + item.ask).toLocaleLowerCase("el").includes(search.toLocaleLowerCase("el"))) return false;
    if (filter === "basic" && item.phases.length > 2) return false;
    if (filter === "advanced" && item.phases.length < 3) return false;
    if (filter === "review" && !history[item.id]?.needsReview) return false;
    return true;
  });

  function openScenario(nextIndex: number) {
    setIndex(nextIndex);
    setStep("observe");
    setFrame(0);
    setCuts([]);
    setSelectedLaws({});
    setStartAt(null);
    setVerdicts(blankVerdicts());
    setFirst(blankVerdicts());
    setHelp(0);
    setPlan("");
    setShowSolution(false);
    setSavedThisRound(false);
  }

  function checkStage(which: Check) {
    let correct = false;
    if (which === "cuts") correct = sameNumbers(cuts, s.cuts);
    if (which === "laws") correct = lawsCorrect(s, selectedLaws);
    if (which === "start") correct = startAt !== null && s.start.includes(startAt);
    setVerdicts((current) => ({ ...current, [which]: correct }));
    setFirst((current) => current[which] === null ? { ...current, [which]: correct } : current);
  }

  function switchCut(position: number) {
    setCuts((old) => old.includes(position) ? old.filter((v) => v !== position) : [...old, position]);
    setVerdicts((old) => ({ ...old, cuts: null }));
  }

  function switchLaw(phase: number, law: Tool) {
    setSelectedLaws((old) => {
      const before = old[phase] ?? [];
      return { ...old, [phase]: before.includes(law) ? before.filter((v) => v !== law) : [...before, law] };
    });
    setVerdicts((old) => ({ ...old, laws: null }));
  }

  function nextStage() {
    const place = STEPS.findIndex((item) => item.id === step);
    if (place >= 0 && place < STEPS.length - 1) setStep(STEPS[place + 1].id);
  }

  function finish() {
    if (savedThisRound) return;
    const points = [first.cuts, first.laws, first.start].filter(Boolean).length;
    const clean = points === 3 && help === 0 && !showSolution && plan.trim().length >= 20;
    setHistory((old) => {
      const current = old[s.id] ?? { attempts: 0, bestDecisions: 0, cleanPlans: 0, needsReview: true, last: 0 };
      return {
        ...old,
        [s.id]: {
          attempts: current.attempts + 1,
          bestDecisions: Math.max(current.bestDecisions, points),
          cleanPlans: current.cleanPlans + (clean ? 1 : 0),
          needsReview: !clean,
          last: Date.now(),
        },
      };
    });
    setSavedThisRound(true);
  }

  const related = useMemo(() => {
    const currentLaws = new Set(s.phases.flatMap((p) => p.best));
    return SCENARIOS.map((candidate, i) => ({
      candidate, i,
      similarity: candidate.phases.flatMap((p) => p.best).filter((tool) => currentLaws.has(tool)).length
        - Math.abs(candidate.phases.length - s.phases.length),
    })).filter((entry) => entry.i !== index).sort((a, b) => b.similarity - a.similarity).slice(0, 3);
  }, [index, s]);

  if (!s) return null;

  return (
    <main className="min-h-screen bg-[#f3efe8] px-3 py-5 text-[#2c2825] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="overflow-hidden rounded-3xl bg-[#183d35] px-5 py-7 text-white sm:px-9 sm:py-9">
          <Link href="/mixalis/ormi" className="inline-flex items-center gap-2 text-sm text-[#cce6d6] hover:text-white">
            <ArrowLeft size={16} /> Πίσω στο τυπολόγιο και τη θεωρία
          </Link>
          <div className="mt-6 flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a7d4bd]">Physics Workspace · Μιχάλης</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Ορμή 2</h1>
              <p className="mt-2 text-lg font-medium text-[#d6ecde]">Εργαστήριο συνδυαστικών ασκήσεων</p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#d2e4d9]">
                Βλέπω το φαινόμενο. Χωρίζω σε φάσεις. Επιλέγω νόμους. Συνδέω τα άγνωστα.
                Στο τέλος δοκιμάζω να λύσω χωρίς βοήθεια.
              </p>
            </div>
            <div className="grid w-full grid-cols-3 gap-2 sm:w-auto sm:min-w-[310px]">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 text-center"><p className="text-2xl font-bold">{total}</p><p className="text-[11px] text-[#d2e4d9]">Σενάρια</p></div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 text-center"><p className="text-2xl font-bold">{progress}</p><p className="text-[11px] text-[#d2e4d9]">Δοκιμασμένα</p></div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 text-center"><p className="text-2xl font-bold">{independent}</p><p className="text-[11px] text-[#d2e4d9]">Χωρίς βοήθεια*</p></div>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-[#b6d5c4]">*Καταγράφεται η ανεξάρτητη μεθοδολογική προσπάθεια, όχι αυτόματη βαθμολόγηση των αριθμητικών πράξεων.</p>
        </header>

        <div className="grid items-start gap-5 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-black/10 bg-white p-4 lg:sticky lg:top-4">
            <div className="flex items-center justify-between gap-2"><h2 className="font-semibold">Βιβλιοθήκη σεναρίων</h2><BookOpen size={18} className="text-[#668072]" /></div>
            <label htmlFor="ormi2-search" className="mt-4 block text-xs font-semibold text-[#655c52]">Αναζήτηση</label>
            <input id="ormi2-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="π.χ. εκκρεμές, βλήμα" className="mt-1 w-full rounded-xl border border-black/15 bg-[#faf8f4] px-3 py-2.5 text-sm outline-offset-2 focus:border-[#35745d]" />
            <div className="mt-3 grid grid-cols-2 gap-1.5" aria-label="Φίλτρο δυσκολίας">
              {([
                ["all", "Όλες"], ["basic", "2 φάσεις"], ["advanced", "3+ φάσεις"], ["review", "Για επανάληψη"],
              ] as const).map(([id, text]) => (
                <button type="button" key={id} onClick={() => setFilter(id)} aria-pressed={filter === id}
                  className={"min-h-10 rounded-xl px-2 py-2 text-xs font-semibold " + (filter === id ? "bg-[#1f6f5c] text-white" : "border border-black/10 bg-[#faf8f4] text-[#5d594f]")}>
                  {text}
                </button>
              ))}
            </div>
            <div className="mt-3 max-h-[330px] space-y-1 overflow-y-auto pr-1 lg:max-h-[560px]" aria-label="Επιλογή σεναρίου">
              {filtered.length === 0 && <p className="py-5 text-sm text-[#786f65]">Δεν βρέθηκαν ασκήσεις για αυτό το φίλτρο.</p>}
              {filtered.map(({ item, i }) => (
                <button type="button" key={item.id} onClick={() => openScenario(i)}
                  aria-current={index === i ? "true" : undefined}
                  className={"flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors " + (index === i ? "border-[#1f6f5c] bg-[#e6f4ed] text-[#1c5645]" : "border-transparent hover:bg-[#f6f4ef]")}>
                  <span className="w-6 shrink-0 text-xs tabular-nums text-[#857d71]">{i + 1}.</span>
                  <span className="flex-1 leading-5">{item.title}</span>
                  {history[item.id]?.cleanPlans ? <CheckCircle2 className="shrink-0 text-[#25835a]" size={16} /> : history[item.id]?.attempts ? <RotateCcw className="shrink-0 text-[#b17b35]" size={15} /> : null}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => openScenario((index + 1) % total)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f1ece5] px-3 py-3 text-sm font-semibold hover:bg-[#e8e0d5]">
              Άλλο σενάριο <ArrowRight size={16} />
            </button>
          </aside>

          <div className="min-w-0 space-y-4">
            <section className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#277860]">Σενάριο {index + 1} από {total}</p>
                <span className="rounded-full bg-[#f0ede7] px-3 py-1 text-xs font-semibold text-[#6b6053]">{s.phases.length} φάσεις</span>
              </div>
              <h2 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">{s.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#5b554e]"><strong>Ζητούμενο:</strong> {s.ask}</p>
              <div className="mt-5 grid grid-cols-5 gap-1.5" aria-label="Στάδια επίλυσης">
                {STEPS.map((item, pos) => {
                  const active = item.id === step;
                  const passed = STEPS.findIndex((a) => a.id === step) > pos;
                  return <button type="button" key={item.id} onClick={() => { if (passed) setStep(item.id); }} disabled={!passed && !active}
                    aria-current={active ? "step" : undefined}
                    className={"rounded-xl px-1 py-3 text-center text-[11px] font-semibold sm:text-sm " + (active ? "bg-[#1f6f5c] text-white" : passed ? "bg-[#def1e7] text-[#255f4b]" : "bg-[#f2f0eb] text-[#9a9085]")}>
                    <span className="block text-base sm:text-lg">{pos + 1}</span>{item.short}
                  </button>;
                })}
              </div>

              {step === "observe" && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 text-[#226451]"><Eye size={19} /><h3 className="text-lg font-semibold">Πρώτα παρατήρησε τι συμβαίνει</h3></div>
                  <PhysicsScene s={s} frame={frame} />
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setFrame((old) => (old + 1) % 3)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1f6f5c] px-5 py-2.5 text-sm font-semibold text-white">
                      Επόμενη στιγμή <ArrowRight size={17} />
                    </button>
                    <button type="button" onClick={() => setFrame(0)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-black/15 px-4 py-2 text-sm font-semibold"><RotateCcw size={16} /> Από την αρχή</button>
                  </div>
                  <div className="space-y-2 rounded-2xl border border-black/10 bg-[#fbfaf7] p-4">
                    <p className="text-sm font-semibold">Η εκφώνηση, χωρίς έτοιμη ανάλυση</p>
                    {s.segs.map((part, i) => <p key={i} className="text-sm leading-7 text-[#4f4a43]"><span className="mr-2 font-semibold text-[#237860]">{i + 1}.</span>{part}</p>)}
                  </div>
                  <button type="button" onClick={nextStage} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#242c2a] px-6 py-3 font-semibold text-white">Θα τη χωρίσω σε φάσεις <ArrowRight size={17} /></button>
                </div>
              )}

              {step === "cuts" && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 text-[#226451]"><GitBranch size={20} /><h3 className="text-lg font-semibold">Πού αλλάζει το φυσικό φαινόμενο;</h3></div>
                  <p className="text-sm leading-6 text-[#655e55]">Πάτησε σε κάθε θέση όπου τελειώνει μία φάση και αρχίζει άλλη. Μπορείς να επιλέξεις περισσότερες από μία τομές ή καμία.</p>
                  <div className="space-y-1">
                    {s.segs.map((part, i) => (
                      <div key={i}>
                        <div className="rounded-xl bg-[#f7f6f1] p-4 text-sm leading-7">{part}</div>
                        {i < s.segs.length - 1 && (
                          <button type="button" onClick={() => switchCut(i)} aria-pressed={cuts.includes(i)}
                            className={"my-1 flex min-h-10 w-full items-center justify-center rounded-xl border border-dashed text-sm font-semibold " + (cuts.includes(i) ? "border-[#1f6f5c] bg-[#e2f3e9] text-[#1f6f5c]" : "border-[#cfccc4] text-[#887d6f] hover:bg-[#f4f0e9]")}>
                            {cuts.includes(i) ? "✓ Τομή φάσης εδώ" : "+ Χώρισμα φάσης εδώ;"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {verdicts.cuts !== null && <div role="status" className={"rounded-xl p-3 text-sm " + (verdicts.cuts ? "bg-[#e2f3e9] text-[#1c694d]" : "bg-[#fff1e3] text-[#8f521d]")}>
                    {verdicts.cuts ? "Σωστή διάκριση των φάσεων." : "Οι τομές δεν είναι ακόμη σωστές. Δοκίμασε ξανά: πότε αλλάζει το σύστημα ή ο νόμος που χρειάζεται;"}
                  </div>}
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => checkStage("cuts")} className="min-h-11 rounded-xl bg-[#1f6f5c] px-5 py-2.5 text-sm font-semibold text-white">Έλεγχος φάσεων</button>
                    {verdicts.cuts === true && <button type="button" onClick={nextStage} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#242c2a] px-5 py-2.5 text-sm font-semibold text-white">Επιλογή νόμων <ArrowRight size={16} /></button>}
                  </div>
                </div>
              )}

              {step === "laws" && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 text-[#226451]"><BrainCircuit size={20} /><h3 className="text-lg font-semibold">Ποιοι νόμοι χρειάζονται;</h3></div>
                  <p className="text-sm leading-6 text-[#655e55]">Για κάθε φάση επίλεξε όλους τους νόμους που χρειάζονται. Μερικές φάσεις απαιτούν συνδυασμό δύο νόμων.</p>
                  {grouped.map((parts, i) => (
                    <div key={i} className="rounded-2xl border border-black/10 p-4">
                      <p className="text-sm font-semibold text-[#237860]">Φάση {i + 1}: {s.phases[i]?.label}</p>
                      <p className="mt-2 text-sm leading-6 text-[#6a6259]">{parts.join(" ")}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {TOOLS.map((tool) => {
                          const active = (selectedLaws[i] ?? []).includes(tool.id);
                          return <button type="button" key={tool.id} onClick={() => switchLaw(i, tool.id)} aria-pressed={active} title={tool.description}
                            className={"min-h-10 rounded-full border px-3 py-2 text-xs font-semibold " + (active ? "border-[#1f6f5c] bg-[#1f6f5c] text-white" : "border-black/15 bg-white text-[#514c45] hover:bg-[#edf4ee]")}>{tool.label}</button>;
                        })}
                      </div>
                    </div>
                  ))}
                  {verdicts.laws !== null && <div role="status" className={"rounded-xl p-3 text-sm " + (verdicts.laws ? "bg-[#e2f3e9] text-[#1c694d]" : "bg-[#fff1e3] text-[#8f521d]")}>
                    {verdicts.laws ? "Σωστά εργαλεία για όλες τις φάσεις." : "Κάποια φάση χρειάζεται άλλο ή επιπλέον εργαλείο. Έλεγξε ιδιαίτερα τις περιπτώσεις με δύο ζητούμενα."}
                  </div>}
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => checkStage("laws")} className="min-h-11 rounded-xl bg-[#1f6f5c] px-5 py-2.5 text-sm font-semibold text-white">Έλεγχος νόμων</button>
                    {verdicts.laws === true && <button type="button" onClick={nextStage} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#242c2a] px-5 py-2.5 text-sm font-semibold text-white">Στρατηγική επίλυσης <ArrowRight size={16} /></button>}
                  </div>
                </div>
              )}

              {step === "start" && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 text-[#226451]"><Target size={20} /><h3 className="text-lg font-semibold">Από ποια φάση ξεκινά η λύση;</h3></div>
                  <p className="text-sm leading-7 text-[#655e55]">Τα φυσικά γεγονότα έχουν χρονική σειρά. Όμως οι υπολογισμοί μπορεί να πρέπει να ξεκινήσουν από το τέλος. Δες τα δεδομένα και τα ζητούμενα.</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {s.phases.map((phase, i) => <button type="button" key={i} onClick={() => { setStartAt(i); setVerdicts((old) => ({ ...old, start: null })); }}
                      aria-pressed={startAt === i} className={"rounded-xl border px-4 py-4 text-left text-sm font-semibold " + (startAt === i ? "border-[#1f6f5c] bg-[#e2f3e9] text-[#1c694d]" : "border-black/15 bg-[#faf9f6]")}>
                      <span className="mb-1 block text-xs font-normal text-[#85786c]">Φάση {i + 1}</span>{phase.label}
                    </button>)}
                  </div>
                  {verdicts.start !== null && <div role="status" className={"rounded-xl p-4 text-sm leading-6 " + (verdicts.start ? "bg-[#e2f3e9] text-[#1c694d]" : "bg-[#fff1e3] text-[#8f521d]")}>
                    {verdicts.start ? "Σωστή αφετηρία. " + s.startWhy : "Δοκίμασε να εντοπίσεις σε ποια φάση έχεις αρκετά γνωστά μεγέθη για να βρεις ένα άγνωστο."}
                  </div>}
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={startAt === null} onClick={() => checkStage("start")} className="min-h-11 rounded-xl bg-[#1f6f5c] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40">Έλεγχος στρατηγικής</button>
                    {verdicts.start === true && <button type="button" onClick={nextStage} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#242c2a] px-5 py-2.5 text-sm font-semibold text-white">Θα φτιάξω τη λύση <ArrowRight size={16} /></button>}
                  </div>
                </div>
              )}

              {step === "solve" && (
                <div className="mt-6 space-y-5">
                  <div className="flex items-center gap-2 text-[#226451]"><ClipboardCheck size={20} /><h3 className="text-lg font-semibold">Σύνδεσε τις φάσεις και προσπάθησε</h3></div>
                  <p className="text-sm leading-7 text-[#655e55]">Γράψε το σχέδιο της λύσης. Ποιο μέγεθος βρίσκεις πρώτο; Σε ποια εξίσωση θα το χρησιμοποιήσεις μετά; Συνέχισε τους αριθμητικούς υπολογισμούς στο τετράδιό σου.</p>
                  <label htmlFor="ormi2-plan" className="block text-sm font-semibold">Το δικό μου σχέδιο επίλυσης</label>
                  <textarea id="ormi2-plan" value={plan} onChange={(event) => setPlan(event.target.value)} rows={5}
                    placeholder="1. Ξεκινώ από... γιατί γνωρίζω...&#10;2. Βρίσκω τη μεταβλητή...&#10;3. Τη χρησιμοποιώ στη φάση..."
                    className="block w-full resize-y rounded-xl border border-black/15 bg-[#faf9f5] p-4 text-sm leading-7 focus:border-[#24735a] focus:outline-2 focus:outline-offset-1 focus:outline-[#24735a]" />
                  <div className="rounded-2xl border border-[#e7d7b7] bg-[#fffaf0] p-4">
                    <div className="flex items-center gap-2 text-[#835a25]"><Lightbulb size={18} /><h4 className="font-semibold">Βοήθεια μόνο όταν τη χρειάζεσαι</h4></div>
                    {help === 0 && <p className="mt-2 text-sm leading-6">Δοκίμασε πρώτα μόνος σου. Οι υποδείξεις εμφανίζονται μία-μία.</p>}
                    {help >= 1 && <p className="mt-3 text-sm leading-6"><strong>1. Μικρή υπόδειξη:</strong> Αναζήτησε ποια φάση έχει τα περισσότερα γνωστά μεγέθη. Το ζητούμενο δεν είναι πάντα η αφετηρία.</p>}
                    {help >= 2 && <div className="mt-3 rounded-xl bg-white p-3 text-sm leading-7"><strong>2. Χάρτης φάσεων:</strong><div className="mt-2 flex flex-wrap gap-2">{s.phases.map((p, i) => <span key={i} className="rounded-lg bg-[#e5f3e9] px-3 py-1.5 text-xs font-semibold text-[#235e4b]">{i + 1}. {p.label}</span>)}</div><p className="mt-2">Εντόπισε την κοινή ταχύτητα ή το άλλο μέγεθος που μεταφέρεται από φάση σε φάση.</p></div>}
                    <button type="button" disabled={help === 2 || showSolution} onClick={() => setHelp((old) => Math.min(2, old + 1))}
                      className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#c7a971] bg-white px-4 py-2 text-sm font-semibold text-[#755123] disabled:opacity-40"><CircleHelp size={16} /> Επόμενη υπόδειξη</button>
                  </div>
                  <div className="rounded-2xl border border-black/10 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div><h4 className="font-semibold">Αναλυτική μεθοδολογία</h4><p className="mt-1 text-xs text-[#73695e]">Αν την ανοίξεις, η προσπάθεια θα καταγραφεί ως εξάσκηση με λύση.</p></div>
                      <button type="button" disabled={plan.trim().length < 20} onClick={() => setShowSolution((old) => !old)}
                        className="min-h-10 rounded-xl bg-[#262f2c] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">{showSolution ? "Κρύψε τη λύση" : "Δες τη μεθοδολογία"}</button>
                    </div>
                    {showSolution && <div className="mt-4 space-y-3">
                      <p className="rounded-xl bg-[#e4f2e9] p-3 text-sm font-semibold text-[#1f684b]">{s.startWhy}</p>
                      {s.phases.map((phase, i) => <div key={i} className="rounded-xl bg-[#faf9f6] p-4">
                        <p className="text-sm font-semibold">Φάση {i + 1} · {phase.label}</p>
                        <p className="mt-2 text-sm leading-7 text-[#655a4d]">{phase.why}</p>
                        <p className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg bg-white p-3 font-mono text-xs leading-6 text-[#244735]">{phase.eq}</p>
                      </div>)}
                    </div>}
                  </div>
                  {savedThisRound ? <div role="status" className="rounded-xl bg-[#e2f3e9] p-4 text-sm font-semibold text-[#1f694d]">Η προσπάθεια καταγράφηκε σε αυτή τη συσκευή. Δοκίμασε τώρα μία συγγενική άσκηση με διαφορετικές συνθήκες.</div> :
                    <button type="button" disabled={plan.trim().length < 20} onClick={finish} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#1f6f5c] px-6 py-3 font-semibold text-white disabled:opacity-40"><CheckCircle2 size={19} /> Καταχώριση προσπάθειας</button>}
                  <p className="text-xs leading-5 text-[#887f74]">Η εφαρμογή ελέγχει τη διάκριση φάσεων, τους νόμους και τη στρατηγική. Δεν ισχυρίζεται ότι διόρθωσε τις πράξεις που έγιναν στο τετράδιο.</p>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-5 sm:p-7">
              <div className="flex items-center gap-2"><Sparkles size={19} className="text-[#986525]" /><h3 className="text-lg font-semibold">Επόμενη πρόκληση: άλλαξε τις συνθήκες</h3></div>
              <p className="mt-2 text-sm leading-6 text-[#73695e]">Συγγενικές ασκήσεις από την ίδια υπάρχουσα τράπεζα. Σύγκρινε ποια φάση ή ποιος νόμος αλλάζει.</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {related.map(({ candidate, i }) => <button type="button" key={candidate.id} onClick={() => openScenario(i)}
                  className="flex min-h-24 flex-col items-start justify-between gap-2 rounded-xl border border-[#dfddd5] bg-[#faf9f6] p-3 text-left hover:border-[#1f6f5c]">
                  <span className="text-sm font-semibold leading-5">{candidate.title}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#24735a]">{candidate.phases.length} φάσεις <ChevronRight size={13}/></span>
                </button>)}
              </div>
            </section>

            <div className="flex flex-wrap gap-2 pb-5 text-sm">
              <Link href="/mixalis/ormi" className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-3 font-semibold"><BookOpen size={16} /> Θεωρία & λυμένες</Link>
              <Link href="/mixalis/ormi/periptoseis" className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-3 font-semibold"><Trophy size={16} /> 20 μεθοδολογίες</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
