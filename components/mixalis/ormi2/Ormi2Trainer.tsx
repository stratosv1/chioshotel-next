"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { CheckCircle2, ChevronDown, RotateCcw } from "lucide-react";
import { SCENARIOS, type Scenario, type Tool } from "@/components/mixalis/ormi/OrmiPhaseQuiz";
import { appendSkillEvents, phaseSkillEvents } from "@/components/mixalis/ormi2/learning-data";
import { getThinkingTrick } from "@/components/mixalis/ormi2/thinking-tricks-data";
import { StudyMark } from "@/components/mixalis/study/StudyMark";
import { Ormi2Navbar, Ormi2Secs, Ormi2Shell } from "./Ormi2Shell";

const Ormi2MotionScene = dynamic(() => import("./Ormi2MotionScene").then((m) => m.Ormi2MotionScene), {
  ssr: false,
  loading: () => <div className="o2-bench o2-readout">Φόρτωση κινούμενου φυσικού σχήματος…</div>,
});

type Step = "observe" | "cuts" | "laws" | "start" | "solve";
type Check = "cuts" | "laws" | "start";
type Verdicts = Record<Check, boolean | null>;
type HistoryEntry = { attempts: number; bestDecisions: number; cleanPlans: number; needsReview: boolean; last: number };
type History = Record<string, HistoryEntry>;

const STORAGE_KEY = "mixalis-ormi2-lab-v1";
const STEPS: { id: Step; name: string; short: string }[] = [
  { id: "observe", name: "Παρατήρηση", short: "1 · Βλέπω" },
  { id: "cuts", name: "Φάσεις", short: "2 · Χωρίζω" },
  { id: "laws", name: "Νόμοι", short: "3 · Επιλέγω" },
  { id: "start", name: "Στρατηγική", short: "4 · Συνδέω" },
  { id: "solve", name: "Επίλυση", short: "5 · Λύνω" },
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
const toolLabel = (id: Tool) => TOOLS.find((t) => t.id === id)?.label ?? id;

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

function StageSupport({ kind, level, s, onMore }: {
  kind: Check; level: number; s: Scenario; onMore: () => void;
}) {
  const nextLabel = level === 0 ? "Μικρή υπόδειξη" : level === 1 ? "Δες έναν χάρτη" : "Δείξε την απάντηση";
  return (
    <div className="o2-card key">
      <p className="o2-card-title">Σταδιακή βοήθεια</p>
      {level === 0 && <p className="o2-small o2-muted">Δοκίμασε πρώτα μόνος σου. Αν κολλήσεις, η βοήθεια ανοίγει ένα βήμα τη φορά.</p>}
      {level >= 1 && <p className="o2-small">
        {kind === "cuts" ? "Ψάξε πού αλλάζει το φαινόμενο ή το σύστημα. Δεν είναι κάθε πρόταση υποχρεωτικά νέα φάση."
          : kind === "laws" ? "Σκέψου ποια ποσότητα ζητείται σε κάθε φάση και αν εξετάζεις ένα σώμα ή ολόκληρο σύστημα."
          : "Η σειρά των υπολογισμών μπορεί να είναι αντίστροφη από τη χρονική σειρά της κίνησης."}
      </p>}
      {level >= 2 && <p className="o2-small">
        <b>Χάρτης σκέψης: </b>
        {kind === "cuts" && <>Το φαινόμενο αποτελείται από {s.phases.length} φάσεις. Δες πότε αλλάζει ο μηχανισμός της κίνησης.</>}
        {kind === "laws" && <>Εξέτασε ξεχωριστά: {s.phases.map((p) => p.label).join(" → ")}.</>}
        {kind === "start" && <>Εντόπισε σε ποια φάση μπορείς να σχηματίσεις εξίσωση με ένα μόνο άγνωστο.</>}
      </p>}
      {level >= 3 && <div className="o2-fb ok o2-pop">
        <b>Απάντηση του βήματος: </b>
        {kind === "cuts" && <>{s.phases.map((p, i) => (i + 1) + ". " + p.label).join(" → ")}</>}
        {kind === "laws" && s.phases.map((p, i) => <p key={i} className="mt-1"><b>{i + 1}. {p.label}:</b> {p.best.map(toolLabel).join(" + ")}. {p.why}</p>)}
        {kind === "start" && <>{s.startWhy}</>}
      </div>}
      {level < 3
        ? <div><button type="button" onClick={onMore} className="o2-btn">{nextLabel}</button></div>
        : <p className="o2-small o2-muted">Η απάντηση αποκαλύφθηκε. Μπορείς να συνεχίσεις, αλλά η προσπάθεια δεν θα χαρακτηριστεί ανεξάρτητη.</p>}
    </div>
  );
}

export function Ormi2Trainer() {
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState<Step>("observe");
  const [cuts, setCuts] = useState<number[]>([]);
  const [selectedLaws, setSelectedLaws] = useState<Record<number, Tool[]>>({});
  const [startAt, setStartAt] = useState<number | null>(null);
  const [verdicts, setVerdicts] = useState<Verdicts>(blankVerdicts);
  const [first, setFirst] = useState<Verdicts>(blankVerdicts);
  const [help, setHelp] = useState(0);
  const [support, setSupport] = useState<Record<Check, number>>({ cuts: 0, laws: 0, start: 0 });
  const [plan, setPlan] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [viewedSolution, setViewedSolution] = useState(false);
  const [history, setHistory] = useState<History>({});
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<"all" | "basic" | "advanced" | "review">("all");
  const [search, setSearch] = useState("");
  const [savedThisRound, setSavedThisRound] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const s = SCENARIOS[index];
  const featuredTrick = getThinkingTrick(s.id);
  const grouped = useMemo(() => groupsFor(s), [s]);
  const total = SCENARIOS.length;
  const stepPos = STEPS.findIndex((item) => item.id === step);

  useEffect(() => {
    setHistory(readHistory());
    const requested = new URLSearchParams(window.location.search).get("scenario");
    const chosenIndex = SCENARIOS.findIndex((scenario) => scenario.id === requested);
    if (chosenIndex >= 0) setIndex(chosenIndex);
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

  const openScenario = useCallback((nextIndex: number) => {
    setIndex(nextIndex);
    setStep("observe");
    setCuts([]);
    setSelectedLaws({});
    setStartAt(null);
    setVerdicts(blankVerdicts());
    setFirst(blankVerdicts());
    setHelp(0);
    setSupport({ cuts: 0, laws: 0, start: 0 });
    setPlan("");
    setShowSolution(false);
    setViewedSolution(false);
    setSavedThisRound(false);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("scenario", SCENARIOS[nextIndex].id);
      window.history.replaceState(null, "", url);
    } catch { /* address bar update is optional */ }
  }, []);
  const prevScenario = useCallback(() => openScenario((index - 1 + total) % total), [index, total, openScenario]);
  const nextScenario = useCallback(() => openScenario((index + 1) % total), [index, total, openScenario]);

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
    if (stepPos >= 0 && stepPos < STEPS.length - 1) setStep(STEPS[stepPos + 1].id);
  }

  function finish() {
    if (savedThisRound) return;
    const points = [first.cuts, first.laws, first.start].filter(Boolean).length;
    const clean = points === 3 && help === 0 && Object.values(support).every((level) => level === 0) && !viewedSolution && plan.trim().length >= 20;
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
    appendSkillEvents(phaseSkillEvents(s.id, verdicts, first, support, Date.now()));
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

  // Υποδείξεις επίλυσης φτιαγμένες από τα δεδομένα του ΣΥΓΚΕΚΡΙΜΕΝΟΥ σεναρίου.
  const firstPhase = s.start[0] ?? 0;
  const solveOrder = [firstPhase, ...s.phases.map((_, i) => i).filter((i) => i !== firstPhase)];

  if (!s) return null;
  const record = history[s.id];

  return (
    <Ormi2Shell page="phases" subtitle="Εργαστήριο φάσεων"
      counter={<>Σενάριο {index + 1}/{total} · {progress} δοκιμασμένα · {independent} αυτόνομα*</>}>
      <Ormi2Secs label="Στάδια επίλυσης" items={STEPS.map((item, pos) => ({
        key: item.id,
        label: item.short,
        fill: pos < stepPos ? 1 : pos === stepPos ? (item.id === "observe" || item.id === "solve" ? (savedThisRound ? 1 : 0.4) : verdicts[item.id as Check] ? 1 : 0.4) : 0,
        current: pos === stepPos,
        onClick: pos < stepPos ? () => setStep(item.id) : undefined,
      }))} />

      <section className="o2-slide">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="o2-kicker">Σενάριο {index + 1} · {s.phases.length} φάσεις · {STEPS[stepPos].name}</p>
          {record?.cleanPlans ? <span className="o2-tag">✓ Λύθηκε χωρίς βοήθεια</span>
            : record?.attempts ? <span className="o2-tag">↻ Για επανάληψη</span> : null}
        </div>
        <h1 className="o2-h1">{s.title}</h1>

        <div className="o2-card key">
          <p className="o2-kicker">Η αποστολή μας — Τι ψάχνουμε;</p>
          <p className="o2-lead"><b>{s.ask}</b></p>
          <p className="o2-small o2-muted">Θυμήσου αυτό το ζητούμενο ενώ παρακολουθείς το φαινόμενο. Μην ψάχνεις ακόμη τον νόμο: πρώτα κατάλαβε τι θέλεις να βρεις.</p>
        </div>

        <Ormi2MotionScene key={s.id} scenario={s} />

        {step === "observe" && (
          <div className="flex flex-col gap-4 o2-pop">
            <h2 className="o2-h2">Πρώτα παρατήρησε τι συμβαίνει</h2>
            <div className="o2-card">
              <p className="o2-card-title">Η εκφώνηση, χωρίς έτοιμη ανάλυση</p>
              {s.segs.map((part, i) => <p key={i}><span className="o2-m" style={{ color: "var(--accent2)" }}>{i + 1}.</span> {part}</p>)}
            </div>
            <div><button type="button" onClick={nextStage} className="o2-btn pri big">Θα τη χωρίσω σε φάσεις →</button></div>
          </div>
        )}

        {step === "cuts" && (
          <div className="flex flex-col gap-4 o2-pop">
            <h2 className="o2-h2">Πού αλλάζει το φυσικό φαινόμενο;</h2>
            <p className="o2-muted">Πάτησε σε κάθε θέση όπου τελειώνει μία φάση και αρχίζει άλλη. Μπορείς να επιλέξεις περισσότερες από μία τομές ή καμία.</p>
            <div>
              {s.segs.map((part, i) => (
                <div key={i}>
                  <div className="o2-card white">{part}</div>
                  {i < s.segs.length - 1 && (
                    <button type="button" onClick={() => switchCut(i)} aria-pressed={cuts.includes(i)} className="o2-cut">
                      {cuts.includes(i) ? "✂ Τομή φάσης εδώ" : "+ Χώρισμα φάσης εδώ;"}
                    </button>
                  )}
                </div>
              ))}
            </div>
            {verdicts.cuts !== null && <div role="status" className={"o2-fb o2-pop " + (verdicts.cuts ? "ok" : "bad")}>
              {verdicts.cuts ? "Σωστή διάκριση των φάσεων." : "Οι τομές δεν είναι ακόμη σωστές. Δοκίμασε ξανά: πότε αλλάζει το σύστημα ή ο νόμος που χρειάζεται;"}
            </div>}
            <StageSupport kind="cuts" level={support.cuts} s={s} onMore={() => setSupport((old) => ({ ...old, cuts: Math.min(3, old.cuts + 1) }))} />
            <div className="o2-seg">
              <button type="button" onClick={() => checkStage("cuts")} className="o2-btn dark big">Έλεγχος φάσεων</button>
              {(verdicts.cuts === true || support.cuts === 3) && <button type="button" onClick={nextStage} className="o2-btn pri big">Επιλογή νόμων →</button>}
            </div>
          </div>
        )}

        {step === "laws" && (
          <div className="flex flex-col gap-4 o2-pop">
            <h2 className="o2-h2">Ποιοι νόμοι χρειάζονται;</h2>
            <p className="o2-muted">Για κάθε φάση επίλεξε όλους τους νόμους που χρειάζονται. Μερικές φάσεις απαιτούν συνδυασμό δύο νόμων.</p>
            {grouped.map((parts, i) => (
              <div key={i} className="o2-card">
                <p className="o2-card-title"><span style={{ color: "var(--accent)" }}>Φάση {i + 1}</span> · {s.phases[i]?.label}</p>
                <p className="o2-small o2-muted">{parts.join(" ")}</p>
                <div className="o2-seg">
                  {TOOLS.map((tool) => {
                    const active = (selectedLaws[i] ?? []).includes(tool.id);
                    return <button type="button" key={tool.id} onClick={() => switchLaw(i, tool.id)} aria-pressed={active} title={tool.description} className="o2-chip">{tool.label}</button>;
                  })}
                </div>
              </div>
            ))}
            {verdicts.laws !== null && <div role="status" className={"o2-fb o2-pop " + (verdicts.laws ? "ok" : "bad")}>
              {verdicts.laws ? "Σωστά εργαλεία για όλες τις φάσεις." : "Κάποια φάση χρειάζεται άλλο ή επιπλέον εργαλείο. Έλεγξε ιδιαίτερα τις περιπτώσεις με δύο ζητούμενα."}
            </div>}
            <StageSupport kind="laws" level={support.laws} s={s} onMore={() => setSupport((old) => ({ ...old, laws: Math.min(3, old.laws + 1) }))} />
            <div className="o2-seg">
              <button type="button" onClick={() => checkStage("laws")} className="o2-btn dark big">Έλεγχος νόμων</button>
              {(verdicts.laws === true || support.laws === 3) && <button type="button" onClick={nextStage} className="o2-btn pri big">Στρατηγική επίλυσης →</button>}
            </div>
          </div>
        )}

        {step === "start" && (
          <div className="flex flex-col gap-4 o2-pop">
            <h2 className="o2-h2">Από ποια φάση ξεκινά η λύση;</h2>
            <p className="o2-muted">Τα φυσικά γεγονότα έχουν χρονική σειρά. Όμως οι υπολογισμοί μπορεί να πρέπει να ξεκινήσουν από το τέλος. Δες τα δεδομένα και τα ζητούμενα.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {s.phases.map((phase, i) => <button type="button" key={i} onClick={() => { setStartAt(i); setVerdicts((old) => ({ ...old, start: null })); }}
                aria-pressed={startAt === i}
                className={"o2-opt " + (verdicts.start !== null && startAt === i ? (verdicts.start ? "right" : "wrong") : "")}>
                <span className="o2-display o2-small o2-muted">Φάση {i + 1}</span><br /><b>{phase.label}</b>
              </button>)}
            </div>
            {verdicts.start !== null && <div role="status" className={"o2-fb o2-pop " + (verdicts.start ? "ok" : "bad")}>
              {verdicts.start ? "Σωστή αφετηρία. " + s.startWhy : "Δοκίμασε να εντοπίσεις σε ποια φάση έχεις αρκετά γνωστά μεγέθη για να βρεις ένα άγνωστο."}
            </div>}
            <StageSupport kind="start" level={support.start} s={s} onMore={() => setSupport((old) => ({ ...old, start: Math.min(3, old.start + 1) }))} />
            <div className="o2-seg">
              <button type="button" disabled={startAt === null} onClick={() => checkStage("start")} className="o2-btn dark big">Έλεγχος στρατηγικής</button>
              {(verdicts.start === true || support.start === 3) && <button type="button" onClick={nextStage} className="o2-btn pri big">Θα φτιάξω τη λύση →</button>}
            </div>
          </div>
        )}

        {step === "solve" && (
          <div className="flex flex-col gap-4 o2-pop">
            <h2 className="o2-h2">Σύνδεσε τις φάσεις και προσπάθησε</h2>
            <p className="o2-muted">Γράψε το σχέδιο της λύσης. Ποιο μέγεθος βρίσκεις πρώτο; Σε ποια εξίσωση θα το χρησιμοποιήσεις μετά; Συνέχισε τους αριθμητικούς υπολογισμούς στο τετράδιό σου.</p>
            <label htmlFor="ormi2-plan" className="o2-card-title">Το δικό μου σχέδιο επίλυσης</label>
            <textarea id="ormi2-plan" value={plan} onChange={(event) => setPlan(event.target.value)} rows={5}
              placeholder={"1. Ξεκινώ από... γιατί γνωρίζω...\n2. Βρίσκω τη μεταβλητή...\n3. Τη χρησιμοποιώ στη φάση..."}
              className="o2-textarea" />

            <div className="o2-card key">
              <p className="o2-card-title">Βοήθεια μόνο όταν τη χρειάζεσαι</p>
              {help === 0 && <p className="o2-small o2-muted">Δοκίμασε πρώτα μόνος σου. Οι υποδείξεις εμφανίζονται μία-μία και αφορούν αυτή την άσκηση.</p>}
              {help >= 1 && <p className="o2-small o2-pop">
                <b>1. Πρώτη εξίσωση:</b> ξεκινάς από τη Φάση {firstPhase + 1} ({s.phases[firstPhase]?.label}) με{" "}
                <b>{(s.phases[firstPhase]?.best ?? []).map(toolLabel).join(" + ")}</b>. Γράψε μόνο αυτή την εξίσωση και βρες τον έναν άγνωστό της.
              </p>}
              {help >= 2 && <div className="o2-small o2-pop">
                <b>2. Η αλυσίδα:</b>
                <ol className="mt-1 list-decimal pl-5">
                  {solveOrder.map((i) => <li key={i}>Φάση {i + 1} · {s.phases[i].label}: {s.phases[i].best.map(toolLabel).join(" + ")}</li>)}
                </ol>
                <p className="mt-1">Το μέγεθος που βρίσκεις σε κάθε βήμα (συνήθως μια ταχύτητα αμέσως πριν ή μετά την κρούση) είναι το δεδομένο του επόμενου.</p>
              </div>}
              {help < 2 && !showSolution && <div>
                <button type="button" onClick={() => setHelp((old) => Math.min(2, old + 1))} className="o2-btn">
                  {help === 0 ? "Από πού ξεκινώ;" : "Δείξε την αλυσίδα"}
                </button>
              </div>}
            </div>

            <div className="o2-acc">
              <button type="button" aria-expanded={showSolution} disabled={plan.trim().length < 20}
                onClick={() => { if (!showSolution) setViewedSolution(true); setShowSolution((old) => !old); }}
                style={plan.trim().length < 20 ? { opacity: .5, cursor: "default" } : undefined}>
                <span className="n">✎</span>
                <span>Αναλυτική μεθοδολογία{plan.trim().length < 20 ? " (γράψε πρώτα το σχέδιό σου)" : ""}</span>
                <ChevronDown size={18} className={"chev " + (showSolution ? "rotate-180" : "")} />
              </button>
              {showSolution && <div className="body o2-pop">
                <p className="o2-small o2-muted">Επειδή την άνοιξες, η προσπάθεια καταγράφεται ως εξάσκηση με λύση.</p>
                <div className="o2-fb ok">{s.startWhy}</div>
                {s.phases.map((phase, i) => <div key={i} className="o2-card">
                  <p className="o2-card-title">Φάση {i + 1} · {phase.label}</p>
                  <p className="o2-small">{phase.why}</p>
                  <code className="o2-formula">{phase.eq}</code>
                </div>)}
              </div>}
            </div>

            {savedThisRound
              ? <div role="status" className="o2-fb ok o2-pop">Η προσπάθεια καταγράφηκε σε αυτή τη συσκευή. Δοκίμασε τώρα ένα συγγενικό σενάριο με διαφορετικές συνθήκες.</div>
              : <div><button type="button" disabled={plan.trim().length < 20} onClick={finish} className="o2-btn teal big"><CheckCircle2 size={18} /> Καταχώριση προσπάθειας</button></div>}

            {featuredTrick && <div className="o2-card tip">
              <p className="o2-kicker" style={{ color: "var(--teal)" }}>Ένα από τα 5 δυνατά κόλπα</p>
              <p className="o2-h3">{featuredTrick.memorable}</p>
              <p className="o2-small">Δες την ειδική ανάλυση δυνάμεων και 4 άλλα ζητούμενα με την πλήρη διαδρομή σκέψης.</p>
              <div><Link href={"/mixalis/ormi2/kolpa?scenario=" + encodeURIComponent(s.id)} className="o2-btn teal">Εξήγησέ μου την πονηριά →</Link></div>
            </div>}
            <p className="o2-small o2-muted">Η εφαρμογή ελέγχει τη διάκριση φάσεων, τους νόμους και τη στρατηγική. Δεν ισχυρίζεται ότι διόρθωσε τις πράξεις που έγιναν στο τετράδιο.</p>
          </div>
        )}

        <StudyMark lesson="ormi2" id={"s-" + s.id} title={"Σενάριο " + (index + 1) + ": " + s.title} path={"/mixalis/ormi2?scenario=" + encodeURIComponent(s.id)} />
      </section>

      <Ormi2Navbar prevLabel="Προηγούμενο" nextLabel="Επόμενο σενάριο" onPrev={prevScenario} onNext={nextScenario}
        hint="← → αλλάζουν σενάριο" />

      <section className="o2-slide">
        <p className="o2-kicker">Επόμενη πρόκληση · άλλαξε τις συνθήκες</p>
        <p className="o2-muted o2-small">Συγγενικά σενάρια με παρόμοιους νόμους. Σύγκρινε ποια φάση ή ποιος νόμος αλλάζει.</p>
        <div className="o2-mapgrid">
          {related.map(({ candidate, i }) => <button type="button" key={candidate.id} onClick={() => { openScenario(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <b>{i + 1}. {candidate.title}</b>
            <span>{candidate.phases.length} φάσεις</span>
          </button>)}
        </div>
      </section>

      <section className="o2-acc">
        <button type="button" aria-expanded={libraryOpen} onClick={() => setLibraryOpen((v) => !v)}>
          <span className="n">☰</span>
          <span>Όλα τα {total} σενάρια · {progress} δοκιμασμένα · {independent} χωρίς βοήθεια</span>
          <ChevronDown size={18} className={"chev " + (libraryOpen ? "rotate-180" : "")} />
        </button>
        {libraryOpen && <div className="body">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="ormi2-search" className="sr-only">Αναζήτηση σεναρίου</label>
            <input id="ormi2-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Αναζήτηση: π.χ. εκκρεμές, βλήμα"
              className="o2-input min-w-0 flex-1" style={{ fontFamily: "var(--body)", fontWeight: 400, fontSize: 16 }} />
            <div className="o2-seg" aria-label="Φίλτρο">
              {([["all", "Όλα"], ["basic", "2 φάσεις"], ["advanced", "3+ φάσεις"], ["review", "Για επανάληψη"]] as const).map(([id, text]) => (
                <button type="button" key={id} onClick={() => setFilter(id)} aria-pressed={filter === id} className="o2-btn sm">{text}</button>
              ))}
            </div>
          </div>
          {filtered.length === 0 && <p className="o2-muted o2-small">Δεν βρέθηκαν σενάρια για αυτό το φίλτρο.</p>}
          <div className="o2-mapgrid">
            {filtered.map(({ item, i }) => (
              <button type="button" key={item.id} onClick={() => { openScenario(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                aria-current={index === i ? "true" : undefined}>
                <b>{i + 1}. {item.title}</b>
                <span className="inline-flex items-center gap-1">
                  {item.phases.length} φάσεις
                  {history[item.id]?.cleanPlans ? <><CheckCircle2 size={14} color="var(--ok)" /> χωρίς βοήθεια</>
                    : history[item.id]?.attempts ? <><RotateCcw size={13} color="var(--accent)" /> για επανάληψη</> : null}
                </span>
              </button>
            ))}
          </div>
        </div>}
      </section>

      <p className="o2-small o2-muted pb-4">*Καταγράφεται η ανεξάρτητη μεθοδολογική προσπάθεια σε αυτή τη συσκευή, όχι αυτόματη βαθμολόγηση των αριθμητικών πράξεων.{" "}
        <Link href="/mixalis/ormi/periptoseis" className="underline">Οι 20 μεθοδολογίες της Τράπεζας</Link>.</p>
    </Ormi2Shell>
  );
}
