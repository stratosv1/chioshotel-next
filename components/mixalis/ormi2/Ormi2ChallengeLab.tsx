"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronRight,
  CircleHelp, Eye, GitBranch, Lightbulb, LockKeyhole, RefreshCw,
  Target, Trophy, XCircle,
} from "lucide-react";
import {
  CHALLENGES, answerMatches, formatAnswer, solveChallenge,
  type ChallengeFamily, type ChallengeVariant, type SolutionStep,
} from "./challenges-data";
import { appendSkillEvents, numericSkillEvents } from "./learning-data";
import { AdvancedMotionScene } from "./AdvancedMotionScenes";

type Attempt = {
  attempts: number;
  independent: number;
  lastScore: number;
  lastAt: number;
};
type History = Record<string, Attempt>;
type Rating = "all" | "very-hard" | "review";
const STORAGE_KEY = "mixalis-ormi2-numeric-challenges-v1";
const keyFor = (family: ChallengeFamily, variant: ChallengeVariant) => family.id + ":" + variant.id;
const fmt = (n: number) => new Intl.NumberFormat("el-GR", { maximumFractionDigits: 3 }).format(n);
const GreekParamLabels: Record<string, string> = {
  m: "Μάζα βλήματος / σώματος", M: "Μάζα στόχου", m1: "Πρώτη μάζα", m2: "Δεύτερη μάζα",
  m3: "Τρίτη μάζα", mu: "Συντελεστής τριβής", s: "Διάστημα ακινητοποίησης",
  d: "Απόσταση πριν την κρούση", u: "Αρχική ταχύτητα", H: "Ύψος τραπεζιού",
  h: "Ύψος", h1: "Ύψος πτώσης", h2: "Ύψος αναπήδησης", x: "Οριζόντια απόσταση",
  g: "Επιτάχυνση βαρύτητας", dt: "Χρόνος επαφής", E: "Ενέργεια ελατηρίου", k: "Σταθερά ελατηρίου",
  M1: "Πρώτο ξύλο", M2: "Δεύτερος στόχος", L: "Μήκος νήματος", sn: "ημθ", cs: "συνθ",
};
function loadHistory(): History {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value as History : {};
  } catch { return {}; }
}

function MotionDiagram({ family, phase, variant }: { family: ChallengeFamily; phase: number; variant: ChallengeVariant }) {
  const id = family.id;
  if (["collision-rough-ramp", "double-collision-spring", "penetration-capture",
    "collision-pendulum-tension", "wall-rebound-catch"].includes(id)) {
    return <AdvancedMotionScene family={family} phase={phase} variant={variant} />;
  }
  const pendulum = id === "ballistic" || id === "pendulum-elastic-spring";
  const bounce = id === "bounce-force";
  const explosion = id === "spring-explosion";
  const ramp = id === "elastic-ramp";
  const flight = id === "pass-edge" || id === "friction-collision-flight";
  const active = Math.min(phase, family.phases.length - 1);
  const description = family.phases[active];
  const shift = active * 68;
  const move = (x: number, y = 0) => ({
    transform: "translate(" + x + "px, " + y + "px)",
    transition: "transform 600ms ease",
  });

  return (
    <svg viewBox="0 0 600 240" className="block w-full" role="img" aria-label={"Σχηματική κίνηση. " + description} xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="592" height="232" rx="19" fill="#f3f8f6" />
      <path d="M21 191H580" stroke="#a9bcb2" strokeWidth="4" strokeLinecap="round" />
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={"M" + (28 + 34 * i) + " 192l-9 12"} fill="none" stroke="#c3d1c9" strokeWidth="2" />)}
      {flight && <path d="M340 190V103H18" fill="none" stroke="#829b90" strokeWidth="8" strokeLinejoin="round" />}
      {ramp && <path d="M356 190L547 75" stroke="#879e93" strokeWidth="9" strokeLinecap="round" />}
      {bounce ? (
        <>
          <circle cx="300" cy="46" r="17" fill="#337da3" style={move(0, active === 1 ? 123 : active === 2 ? 27 : 0)} />
          <path d="M331 76v58m-8-9 8 9 8-9" fill="none" stroke="#337da3" strokeWidth="3" opacity={active === 0 ? 1 : 0} />
          <path d="M331 148v-58m-8 9 8-9 8 9" fill="none" stroke="#337da3" strokeWidth="3" opacity={active === 2 ? 1 : 0} />
          {active === 1 && <path d="M260 174v-40m-8 8 8-8 8 8" fill="none" stroke="#be6842" strokeWidth="3" />}
          <text x="65" y="44" fill="#47695c" fontSize="14">Θετική φορά: προς τα πάνω</text>
        </>
      ) : pendulum ? (
        <>
          <circle cx="268" cy="23" r="6" fill="#62756b" />
          <path d={active === 0 ? "M268 23L178 121" : "M268 23L268 155"} stroke="#596e63" strokeWidth="3" />
          <g style={move(active === 0 ? -90 : 0, active === 0 ? -34 : 0)}>
            <circle cx="268" cy="159" r="21" fill="#b78352" />
          </g>
          <path d="M290 191h223" stroke="#90a99d" strokeWidth="5" />
          {id === "ballistic" ? (
            <g style={move(active === 0 ? 0 : 132)}>
              <circle cx="54" cy="159" r="8" fill="#32759a" />
              <path d="M67 159h67m-10-8 10 8-10 8" stroke="#32759a" strokeWidth="3" fill="none" />
            </g>
          ) : (
            <>
              <g style={move(active === 2 ? 100 : 0)}><rect x="306" y="153" width="47" height="37" rx="7" fill="#337da3" /></g>
              <path d="M488 155v37m0-30-12 7 12 8-12 7 12 8-12 7" fill="none" stroke="#b37943" strokeWidth="3" />
            </>
          )}
        </>
      ) : explosion ? (
        <>
          <g style={move(-shift * 1.3)}><rect x="235" y="150" width="66" height="38" rx="8" fill="#b57c4b" /><circle cx="252" cy="191" r="7" fill="#49594f" /><circle cx="283" cy="191" r="7" fill="#49594f" /></g>
          <g style={move(shift)}><rect x="307" y="150" width="82" height="38" rx="8" fill="#337da3" /><circle cx="324" cy="191" r="7" fill="#49594f" /><circle cx="373" cy="191" r="7" fill="#49594f" /></g>
          <path d="M295 166l7 10 7-10" fill="none" stroke="#cb8e44" strokeWidth="4" opacity={active === 0 ? 1 : 0.15} />
          <rect x="522" y="151" width="42" height="37" rx="5" fill="#719885" />
        </>
      ) : (
        <>
          {ramp && <g style={move(active === 1 ? 60 : 0, active === 1 ? -34 : 0)}><circle cx="369" cy="171" r="18" fill="#337da3" /></g>}
          <g style={move(flight ? (active * 65) : (active === 0 ? 0 : 85),flight && active === family.phases.length - 1 ? 48 : 0)}>
            <rect x="272" y={flight ? 66 : 152} width="60" height="38" rx="7" fill="#b78352" />
            {!ramp && <path d={flight ? "M327 83h44m-8-7 8 7-8 7" : "M337 170h49m-8-7 8 7-8 7"} stroke="#337da3" fill="none" strokeWidth="3" />}
          </g>
          <g style={move(shift)}><circle cx="74" cy={flight ? 86 : 171} r="10" fill="#337da3" /></g>
          {active === family.phases.length-1 && !flight && !ramp && <path d="M386 169H340m8-7-8 7 8 7" stroke="#b45c46" strokeWidth="3" fill="none" />}
        </>
      )}
      <rect x="23" y="17" width="244" height="30" rx="9" fill="#e1eee7" />
      <text x="37" y="37" fontSize="14" fontWeight="600" fill="#275e49">{active + 1} / {family.phases.length} · {description.length > 27 ? description.slice(0, 27)+"…" : description}</text>
      <text x="300" y="226" textAnchor="middle" fill="#657d71" fontSize="11">Σχηματικά στιγμιότυπα, όχι απεικόνιση σε φυσική κλίμακα</text>
    </svg>
  );
}

function PhaseGuide({ family }: { family: ChallengeFamily }) {
  return (
    <div className="rounded-2xl bg-[#f1f8f3] p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#34745b]">Χάρτης φάσεων · χρονική σειρά</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {family.phases.map((phase, i) => (
          <div className="flex items-center gap-2" key={i}>
            {i > 0 && <ArrowRight className="text-[#719884]" size={16} />}
            <span className="rounded-xl border border-[#b4d6c3] bg-white px-3 py-2 text-sm font-semibold text-[#285b47]">{i + 1}. {phase}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Ormi2ChallengeLab() {
  const [selected, setSelected] = useState(0);
  const [variantId, setVariantId] = useState<"a" | "b">("a");
  const [phase, setPhase] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState("");
  const [stepPassed, setStepPassed] = useState(false);
  const [wrong, setWrong] = useState(0);
  const [wrongByStep, setWrongByStep] = useState<Record<number, number>>({});
  const [hints, setHints] = useState<Record<number, number>>({});
  const [history, setHistory] = useState<History>({});
  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [rating, setRating] = useState<Rating>("all");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    setHistory(loadHistory());
    const query = new URLSearchParams(window.location.search);
    const requestedIndex = CHALLENGES.findIndex((family) => family.id === query.get("family"));
    if (requestedIndex >= 0) setSelected(requestedIndex);
    if (query.get("variant") === "b") setVariantId("b");
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) { try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } catch { /* optional */ } }
  }, [history, ready]);

  const family = CHALLENGES[selected];
  const variant = family.variants.find((v) => v.id === variantId) ?? family.variants[0];
  const solved = useMemo(() => solveChallenge(family, variant), [family, variant]);
  const activeStep = solved.steps[stepIndex];
  const label = keyFor(family, variant);
  const record = history[label];
  const totalVariations = CHALLENGES.length * 2;
  const tried = Object.keys(history).filter((key) => history[key]?.attempts).length;
  const mastered = Object.keys(history).filter((key) => history[key]?.independent).length;
  const complete = stepIndex === solved.steps.length - 1 && stepPassed;

  const changing = Object.keys(family.variants[0].p).filter((p) => family.variants[0].p[p] !== family.variants[1].p[p]);

  function reset(nextIndex = selected, nextVariant: "a" | "b" = variantId) {
    setSelected(nextIndex);
    setVariantId(nextVariant);
    setPhase(0);
    setStepIndex(0);
    setInput("");
    setStepPassed(false);
    setWrong(0);
    setWrongByStep({});
    setHints({});
    setErrorText("");
    setCompleted(false);
  }

  function verify() {
    if (!activeStep || stepPassed) return;
    if (!input.trim()) { setErrorText("Γράψε μια αριθμητική απάντηση πριν από τον έλεγχο."); return; }
    if (!Number.isFinite(Number(input.replace(/−/g, "-").replace(",", ".")))) { setErrorText("Χρειάζεται αριθμός. Μπορείς να γράψεις δεκαδικό με κόμμα ή τελεία."); return; }
    if (answerMatches(input, activeStep.answer)) {
      setErrorText("");
      setStepPassed(true);
    } else {
      setWrong((x) => x + 1);
      setWrongByStep((old) => ({ ...old, [stepIndex]: (old[stepIndex] ?? 0) + 1 }));
      setErrorText("Δεν συμφωνεί με το αποτέλεσμα. Έλεγξε μονάδες, πρόσημα και το μέγεθος που μετέφερες από την προηγούμενη φάση.");
    }
  }

  function nextStep() {
    if (!stepPassed || complete) return;
    setStepIndex((i) => i + 1);
    setInput("");
    setStepPassed(false);
    setErrorText("");
  }

  function finish() {
    if (!complete || completed) return;
    const wasHelped = Object.values(hints).some((n) => n > 0);
    const clean = wrong === 0 && !wasHelped;
    setHistory((prev) => {
      const old = prev[label] ?? { attempts: 0, independent: 0, lastScore: 0, lastAt: 0 };
      return {
        ...prev,
        [label]: {
          attempts: old.attempts + 1,
          independent: old.independent + (clean ? 1 : 0),
          lastScore: Math.round((solved.steps.length / solved.steps.length) * 100),
          lastAt: Date.now(),
        },
      };
    });
    appendSkillEvents(numericSkillEvents(family.id, variant.id,
      solved.steps.map((step) => {
        const i = solved.steps.findIndex((candidate) => candidate.id === step.id);
        return {
          stepId: step.id,
          mistakes: wrongByStep[i] ?? 0,
          hints: hints[i] ?? 0,
          revealed: (hints[i] ?? 0) >= 3,
          correct: true,
        };
      }), Date.now()));
    setCompleted(true);
  }

  const filtered = CHALLENGES.map((item, index) => ({ item, index })).filter(({ item }) => {
    if (rating === "very-hard" && item.difficulty < 5) return false;
    if (rating === "review" && item.variants.every((v) => history[keyFor(item, v)]?.independent)) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-[#f3efe8] px-3 py-5 text-[#272c29] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-3xl bg-[#192f3e] px-5 py-7 text-white sm:px-9 sm:py-9">
          <Link href="/mixalis/ormi2" className="inline-flex items-center gap-2 text-sm text-[#bdd9e7] hover:text-white">
            <ArrowLeft size={16} /> Πίσω στο εργαστήριο φάσεων
          </Link>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a8c9de]">Ορμή 2 · Δεύτερο επίπεδο εξάσκησης</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Εργαστήριο προκλήσεων</h1>
              <p className="mt-3 text-sm leading-7 text-[#d2e1e8]">
                Πρωτότυποι συνδυασμοί με πραγματικά αριθμητικά αποτελέσματα. Κάθε βήμα ελέγχεται ξεχωριστά:
                η ταχύτητα που βρίσκεις γίνεται δεδομένο για το επόμενο φαινόμενο.
              </p>
            </div>
            <div className="grid min-w-[260px] grid-cols-3 gap-2">
              {[
                { v: totalVariations, label: "Παραλλαγές" },
                { v: tried, label: "Δοκιμάστηκαν" },
                { v: mastered, label: "Αυτόνομα" },
              ].map((item) => <div className="rounded-xl border border-white/15 bg-white/10 p-3 text-center" key={item.label}>
                <span className="block text-2xl font-semibold">{item.v}</span>
                <span className="text-[11px] text-[#c1d5de]">{item.label}</span>
              </div>)}
            </div>
          </div>
        </header>

        <Link href="/mixalis/ormi2/proodos"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#aacbbc] bg-white px-5 py-4 text-[#245b48] hover:bg-[#e8f3ea]">
          <span>
            <span className="block text-xs font-bold uppercase tracking-wider text-[#317e5b]">Προσωπική πρόοδος</span>
            <span className="mt-1 block text-lg font-semibold">Ποιοι τύποι ασκήσεων χρειάζονται ενίσχυση;</span>
            <span className="mt-1 block text-sm text-[#668072]">Η εφαρμογή καταγράφει σε ποιο ενδιάμεσο αποτέλεσμα χρειάστηκες βοήθεια.</span>
          </span>
          <span className="rounded-xl bg-[#245e4a] px-4 py-2.5 text-sm font-semibold text-white">Χάρτης προόδου →</span>
        </Link>

        <div className="grid items-start gap-5 lg:grid-cols-[292px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-black/10 bg-white p-4 lg:sticky lg:top-4">
            <div className="flex items-center gap-2"><Trophy className="text-[#946c39]" size={20}/><h2 className="font-semibold">Οικογένειες προβλημάτων</h2></div>
            <div className="mt-4 flex gap-1.5">
              {([["all","Όλες"],["very-hard","Πολύ δύσκολες"],["review","Για εξάσκηση"]] as const).map(([id, name]) => (
                <button key={id} type="button" aria-pressed={rating === id} onClick={() => setRating(id)}
                  className={"rounded-xl px-2.5 py-2 text-[11px] font-semibold " + (rating === id ? "bg-[#264a40] text-white" : "bg-[#f1f0eb] text-[#605b53]")}>{name}</button>
              ))}
            </div>
            <div className="mt-3 space-y-1">
              {filtered.map(({ item, index }) => (
                <button type="button" key={item.id} onClick={() => reset(index, "a")} aria-current={selected === index ? "true" : undefined}
                  className={"flex w-full items-start gap-2 rounded-xl px-3 py-3 text-left transition " +
                    (selected === index ? "bg-[#e5f3e9] text-[#174e3d]" : "hover:bg-[#f5f3ee]")}>
                  <span className="mt-0.5 w-5 shrink-0 text-xs font-semibold text-[#9b8165]">{index + 1}</span>
                  <span className="min-w-0 flex-1 text-sm leading-5">
                    <span className="block font-semibold">{item.title}</span>
                    <span className="mt-1 block text-xs text-[#7f776b]">Δυσκολία {item.difficulty}/5 · {item.phases.length} φάσεις</span>
                  </span>
                  {item.variants.every((v) => history[keyFor(item, v)]?.independent) ? <CheckCircle2 size={17} className="mt-1 shrink-0 text-[#26865b]" /> : <ChevronRight size={15} className="mt-1 shrink-0 text-[#a3a09a]" />}
                </button>
              ))}
              {filtered.length === 0 && <p className="p-3 text-sm text-[#70675c]">Όλες οι παραλλαγές έχουν ήδη λυθεί χωρίς βοήθεια.</p>}
            </div>
            <div className="mt-4 rounded-xl bg-[#f7f4ed] p-3 text-xs leading-6 text-[#6c6459]">
              <strong>Αυτόνομη λύση:</strong> σωστή αριθμητική απάντηση σε κάθε βήμα, με την πρώτη προσπάθεια και χωρίς καμία υπόδειξη.
            </div>
          </aside>

          <div className="min-w-0 space-y-4">
            <section className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-[#eff3ed] px-3 py-1 text-xs font-semibold text-[#316c51]">Πρόκληση {selected + 1}/{CHALLENGES.length} · Δυσκολία {family.difficulty}/5</span>
                {record?.independent ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#24845a]"><CheckCircle2 size={15} /> Έχει λυθεί αυτόνομα</span> : null}
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{family.title}</h2>
              <p className="mt-2 text-sm leading-7 text-[#6d6459]">{family.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {family.tags.map((tag) => <span className="rounded-full bg-[#f3f0e9] px-3 py-1 text-xs text-[#625c52]" key={tag}>{tag}</span>)}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {family.variants.map((v) => (
                  <button type="button" key={v.id} onClick={() => reset(selected, v.id)} aria-pressed={variantId === v.id}
                    className={"min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold " +
                      (variantId === v.id ? "bg-[#245d4a] text-white" : "border border-black/15 bg-white text-[#454a44]")}>
                    {v.id === "a" ? "Α · Αρχική" : "Β · Παραλλαγή"}
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-[#d8e5db] bg-[#f6faf7] p-3 sm:p-4">
                <div className="flex items-center gap-2 text-[#2f674f]"><Eye size={18} /><h3 className="text-sm font-semibold">Παρατήρησε την κίνηση</h3></div>
                <MotionDiagram family={family} phase={phase} variant={variant} />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-[#416c55]">{family.phases[phase]}</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setPhase((old) => (old + 1) % family.phases.length)}
                      className="inline-flex min-h-10 items-center gap-1 rounded-lg bg-[#245d4a] px-3 py-2 text-xs font-semibold text-white">Επόμενη φάση <ArrowRight size={15}/></button>
                    <button type="button" onClick={() => setPhase(0)} title="Από την αρχή" aria-label="Επανεκκίνηση σκηνής"
                      className="min-h-10 rounded-lg border border-[#afcec0] bg-white p-2.5 text-[#28634b]"><RefreshCw size={17}/></button>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2"><BookOpen size={19} className="text-[#7f6b4c]" /><h3 className="text-lg font-semibold">Εκφώνηση</h3></div>
                <p className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-4 text-[15px] leading-8 text-[#3e403c]">{solved.prompt}</p>
                <PhaseGuide family={family} />
                <p className="text-sm leading-7 text-[#596b5c]"><strong>Στόχος:</strong> {family.keyIdea}</p>
              </div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2"><Target size={19} className="text-[#287658]"/><h3 className="text-lg font-semibold">Επίλυσε τις γέφυρες φάσεων</h3></div>
                <span className="text-xs font-semibold text-[#6a7367]">{solved.steps.filter((_, i) => i < stepIndex || (i === stepIndex && stepPassed)).length} / {solved.steps.length} σωστές</span>
              </div>
              <p className="mt-2 text-sm leading-7 text-[#696257]">Κάθε απάντηση ξεκλειδώνει την επόμενη. Βρες την ποσότητα στο τετράδιο και πληκτρολόγησε το αριθμητικό αποτέλεσμα, με πρόσημο όπου χρειάζεται.</p>
              <div className="mt-5 flex gap-1.5" aria-label="Πρόοδος άσκησης">
                {solved.steps.map((step, i) => {
                  const done = i < stepIndex || (i === stepIndex && stepPassed);
                  return <div key={step.id} className={"h-2 flex-1 rounded-full " + (done ? "bg-[#26835a]" : i === stepIndex ? "bg-[#d9b274]" : "bg-[#eae8e2]")} />;
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-[#dcd9ce] bg-[#fdfcf9] p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#867250]">Βήμα {stepIndex + 1}/{solved.steps.length}</p>
                <h4 className="mt-2 text-lg font-semibold leading-7">{activeStep.question}</h4>
                <form className="mt-4" onSubmit={(event) => { event.preventDefault(); verify(); }}>
                  <label htmlFor="ormi2-challenge-answer" className="block text-sm font-semibold text-[#575d54]">Η αριθμητική απάντησή σου</label>
                  <div className="mt-2 flex flex-wrap items-stretch gap-2">
                    <input id="ormi2-challenge-answer" inputMode="decimal" autoComplete="off" value={input}
                      onChange={(event) => { setInput(event.target.value); setErrorText(""); }} disabled={stepPassed}
                      placeholder="π.χ. 4 ή −2,5" className="min-h-12 w-40 min-w-0 flex-1 rounded-xl border border-[#c9cec5] bg-white px-4 text-lg font-semibold focus:border-[#33785a] focus:outline-2 focus:outline-offset-1 focus:outline-[#33785a] disabled:bg-[#e9f4ec]" />
                    <span className="flex min-w-16 items-center justify-center rounded-xl border border-[#e2e2dc] bg-white px-3 text-sm font-semibold">{activeStep.unit}</span>
                    <button type="submit" disabled={stepPassed} className="min-h-12 rounded-xl bg-[#26634e] px-5 font-semibold text-white disabled:opacity-45">Έλεγχος</button>
                  </div>
                </form>
                {errorText && <p role="alert" className="mt-3 flex items-start gap-2 rounded-xl bg-[#fdf0e5] p-3 text-sm leading-6 text-[#8a512b]"><XCircle className="mt-0.5 shrink-0" size={17}/>{errorText}</p>}

                {stepPassed && <div role="status" className="mt-4 rounded-xl border border-[#b4d6bf] bg-[#e7f5eb] p-4 text-sm leading-7 text-[#245a42]">
                  <p className="flex items-center gap-2 font-semibold"><CheckCircle2 size={18}/> Σωστό: {formatAnswer(activeStep.answer)} {activeStep.unit}</p>
                  <p className="mt-1"><strong>{activeStep.law}:</strong> {activeStep.formula}</p>
                  <p className="mt-1">{activeStep.explanation}</p>
                </div>}

                {!stepPassed && <div className="mt-4 rounded-xl border border-[#e8dfc7] bg-[#fffbf0] p-4 text-sm">
                  <p className="flex items-center gap-2 font-semibold text-[#86622e]"><Lightbulb size={17}/> Βοήθεια — αποκάλυψη σταδιακά</p>
                  {(hints[stepIndex] ?? 0) >= 1 && <p className="mt-2 leading-7 text-[#635542]"><strong>Σκέψου:</strong> {activeStep.hint}</p>}
                  {(hints[stepIndex] ?? 0) >= 2 && <p className="mt-2 rounded-lg bg-white p-3 leading-7 text-[#5d594c]"><strong>Νόμος:</strong> {activeStep.law}. <strong>Εξίσωση:</strong> {activeStep.formula}</p>}
                  {(hints[stepIndex] ?? 0) >= 3 && <div className="mt-2 rounded-lg bg-white p-3 leading-7 text-[#2e6549]">
                    <strong>Απάντηση:</strong> {formatAnswer(activeStep.answer)} {activeStep.unit}. {activeStep.explanation}
                    <button type="button" onClick={() => { setInput(String(activeStep.answer)); setErrorText(""); setStepPassed(true); }} className="mt-3 block min-h-10 rounded-lg bg-[#34785b] px-3 py-2 font-semibold text-white">Προχώρησε με την εμφανισμένη λύση</button>
                  </div>}
                  {(hints[stepIndex] ?? 0) < 3 && <button type="button" onClick={() => setHints((old) => ({ ...old, [stepIndex]: Math.min(3, (old[stepIndex] ?? 0) + 1) }))}
                    className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#d2b890] bg-white px-4 py-2 font-semibold text-[#785a2f]">
                    <CircleHelp size={16}/> {(hints[stepIndex] ?? 0) === 0 ? "Μικρή υπόδειξη" : (hints[stepIndex] ?? 0) === 1 ? "Δείξε εξίσωση" : "Αποκάλυψε απάντηση"}
                  </button>}
                </div>}

                {stepPassed && !complete && <button type="button" onClick={nextStep} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#273a32] px-5 py-2.5 text-sm font-semibold text-white">Συνέχισε στο επόμενο βήμα <ArrowRight size={16}/></button>}
                {complete && !completed && <button type="button" onClick={finish} className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#26634e] px-5 py-3 font-semibold text-white"><Trophy size={17}/> Ολοκλήρωση άσκησης</button>}
              </div>

              {completed && <div role="status" className="mt-5 rounded-2xl border border-[#b7d8c5] bg-[#edf8f0] p-5">
                <p className="flex items-center gap-2 text-lg font-semibold text-[#255f43]"><Trophy size={21}/> Η άσκηση ολοκληρώθηκε</p>
                {wrong === 0 && !Object.values(hints).some((n) => n > 0) ?
                  <p className="mt-2 text-sm leading-7 text-[#3b654e]">Όλα τα ενδιάμεσα αποτελέσματα ήταν σωστά με την πρώτη προσπάθεια, χωρίς βοήθεια. Καταγράφηκε ως αυτόνομη επίλυση.</p> :
                  <p className="mt-2 text-sm leading-7 text-[#3b654e]">Καταγράφηκε ως καθοδηγούμενη εξάσκηση. Δοκίμασε την άλλη παραλλαγή για να ελέγξεις αν καταλαβαίνεις τη μέθοδο, χωρίς βοήθεια.</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => reset(selected, variantId === "a" ? "b" : "a")} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#255f47] px-4 py-2.5 text-sm font-semibold text-white">Δοκίμασε την άλλη παραλλαγή <ArrowRight size={16}/></button>
                  <button type="button" onClick={() => reset(selected, variantId)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#bad3c4] bg-white px-4 py-2.5 text-sm font-semibold"><RefreshCw size={15}/> Ξανά</button>
                </div>
              </div>}
              <p className="mt-4 text-xs leading-6 text-[#877e72]">Αποδεκτές αριθμητικές αποκλίσεις: έως 0,5% ή 0,015 σε μονάδες SI για στρογγυλοποίηση. Τα πρόσημα ελέγχονται. Πρόοδος αποθηκεύεται μόνο σε αυτή τη συσκευή.</p>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-5 sm:p-7">
              <div className="flex items-center gap-2"><GitBranch size={19} className="text-[#2b7958]"/><h3 className="text-lg font-semibold">Τι αλλάζει στη δεύτερη παραλλαγή;</h3></div>
              <p className="mt-2 text-sm leading-7 text-[#6c655c]">Σύγκρινε τις συνθήκες των δύο εκφωνήσεων. Μερικές αλλαγές επηρεάζουν μόνο τους αριθμούς· άλλες αλλάζουν τον κατάλληλο νόμο ή τη φορά της ταχύτητας.</p>

              {family.id === "collision-rough-ramp" && (
                <div className="mt-3 rounded-xl border border-[#add4bf] bg-[#eef9f0] p-4 text-sm leading-7 text-[#286049]">
                  <strong>Αλλάζει ο νόμος:</strong> Α — λεία ράμπα, ισχύει ΑΔΜΕ στην άνοδο. Β — τραχιά ράμπα, εφαρμόζουμε ΘΜΚΕ με έργο τριβής. Η ΑΔΟ της σύντομης κρούσης παραμένει ίδια.
                </div>
              )}
              {family.id === "double-collision-spring" && (
                <div className="mt-3 rounded-xl border border-[#e7c7a6] bg-[#fff8ed] p-4 text-sm leading-7 text-[#80532a]">
                  <strong>Αλλάζει το πρόσημο:</strong> στην Α το συσσωμάτωμα ανακρούεται μετά τη δεύτερη κρούση, ενώ στη Β συνεχίζει προς τα δεξιά. Η ελαστική κρούση απαιτεί προσημασμένες ταχύτητες.
                </div>
              )}
              {family.id === "wall-rebound-catch" && (
                <div className="mt-3 rounded-xl border border-[#add4bf] bg-[#eef9f0] p-4 text-sm leading-7 text-[#286049]">
                  <strong>Ελέγχω τη συνάντηση:</strong> το πρώτο αμαξίδιο, μετά τον τοίχο, πρέπει να κινείται γρηγορότερα από το δεύτερο. Διαφορετικά δεν θα συνέβαινε η δεύτερη μεταξύ τους κρούση.
                </div>
              )}
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {changing.map((key) => <div key={key} className="rounded-xl border border-[#e5e1d8] bg-[#fbfaf6] p-3">
                  <span className="block text-xs text-[#81796e]">{GreekParamLabels[key] ?? key}</span>
                  <span className="mt-1 block text-sm font-semibold">{fmt(family.variants[0].p[key])} → {fmt(family.variants[1].p[key])}</span>
                </div>)}
              </div>
              <div className="mt-4 rounded-xl bg-[#f4f2ec] p-4 text-sm leading-7 text-[#64584c]">
                <strong>Παγίδα της οικογένειας:</strong> {family.trap}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/mixalis/ormi2" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#dedbd2] bg-white px-4 py-2 text-sm font-semibold"><BookOpen size={16}/> Επιστροφή στο εργαστήριο φάσεων</Link>
                <button type="button" onClick={() => reset((selected+1) % CHALLENGES.length, "a")} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#24372f] px-4 py-2 text-sm font-semibold text-white">Άλλη οικογένεια <ArrowRight size={16}/></button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
