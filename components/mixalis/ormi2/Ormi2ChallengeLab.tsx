"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, RefreshCw } from "lucide-react";
import {
  CHALLENGES, answerMatches, formatAnswer, solveChallenge,
  type ChallengeFamily, type ChallengeVariant, type SolutionStep,
} from "./challenges-data";
import { appendSkillEvents, numericSkillEvents } from "./learning-data";
import { AdvancedMotionScene } from "./AdvancedMotionScenes";
import { StudyMark } from "@/components/mixalis/study/StudyMark";
import { Ormi2Navbar, Ormi2Secs, Ormi2Shell } from "./Ormi2Shell";

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
    <svg viewBox="0 0 600 240" className="o2-cv" fontFamily="Commissioner, 'Segoe UI', system-ui, sans-serif" role="img" aria-label={"Σχηματική κίνηση. " + description} xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="592" height="232" rx="19" fill="#f7f4ec" />
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
      <rect x="23" y="17" width="244" height="30" rx="15" fill="#efe7da" />
      <text x="37" y="37" fontSize="14" fontWeight="700" fill="#8a5a1c">{active + 1} / {family.phases.length} · {description.length > 27 ? description.slice(0, 27)+"…" : description}</text>
      <text x="300" y="226" textAnchor="middle" fill="#657d71" fontSize="11">Σχηματικά στιγμιότυπα, όχι απεικόνιση σε φυσική κλίμακα</text>
    </svg>
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
  const [libraryOpen, setLibraryOpen] = useState(false);

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
          // Ποσοστό βημάτων που λύθηκαν με την πρώτη, χωρίς υπόδειξη.
          lastScore: Math.round(solved.steps.filter((_, i) => !(wrongByStep[i] ?? 0) && !(hints[i] ?? 0)).length / solved.steps.length * 100),
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
  const prevFamily = () => reset((selected - 1 + CHALLENGES.length) % CHALLENGES.length, "a");
  const nextFamily = () => reset((selected + 1) % CHALLENGES.length, "a");
  const stepHints = hints[stepIndex] ?? 0;
  const doneSteps = solved.steps.filter((_, i) => i < stepIndex || (i === stepIndex && stepPassed)).length;

  return (
    <Ormi2Shell page="numeric" subtitle="Αριθμητικές προκλήσεις"
      counter={<>Πρόκληση {selected + 1}/{CHALLENGES.length} · {tried}/{totalVariations} δοκιμασμένες · {mastered} αυτόνομα</>}>
      <Ormi2Secs label="Βήματα της λύσης" items={solved.steps.map((step, i) => ({
        key: step.id,
        label: "Βήμα " + (i + 1),
        fill: i < stepIndex || (i === stepIndex && stepPassed) ? 1 : i === stepIndex ? 0.4 : 0,
        current: i === stepIndex,
      }))} />

      <section className="o2-slide">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="o2-kicker">Πρόκληση {selected + 1} · Δυσκολία {family.difficulty}/5 · {family.phases.length} φάσεις</p>
          {record?.independent ? <span className="o2-tag">✓ Έχει λυθεί αυτόνομα</span> : null}
        </div>
        <h1 className="o2-h1">{family.title}</h1>
        <p className="o2-lead">{family.summary}</p>
        <div className="o2-seg">
          {family.tags.map((tag) => <span className="o2-tag" key={tag}>{tag}</span>)}
        </div>
        <div className="o2-seg" role="group" aria-label="Παραλλαγή">
          {family.variants.map((v) => (
            <button type="button" key={v.id} onClick={() => reset(selected, v.id)} aria-pressed={variantId === v.id} className="o2-btn">
              {v.id === "a" ? "Α · Αρχική" : "Β · Παραλλαγή"}
            </button>
          ))}
        </div>

        <div className="o2-bench">
          <div className="o2-bench-head"><span><b>Παρατήρησε την κίνηση</b> · φάση {phase + 1} από {family.phases.length}</span></div>
          <MotionDiagram family={family} phase={phase} variant={variant} />
          <div className="o2-ctrls">
            <button type="button" onClick={() => setPhase((old) => (old + 1) % family.phases.length)} className="o2-btn pri">Επόμενη φάση →</button>
            <button type="button" onClick={() => setPhase(0)} aria-label="Επανεκκίνηση σκηνής" className="o2-btn"><RefreshCw size={15}/> Από την αρχή</button>
            <span className="o2-muted">{family.phases[phase]}</span>
          </div>
        </div>

        <div className="o2-card">
          <p className="o2-card-title">Εκφώνηση</p>
          <p>{solved.prompt}</p>
        </div>
        <div className="o2-cols">
          <div className="o2-card tip">
            <p className="o2-card-title">Χάρτης φάσεων · χρονική σειρά</p>
            <ol className="list-decimal pl-5 o2-small">
              {family.phases.map((p, i) => <li key={i}>{p}</li>)}
            </ol>
          </div>
          <div className="o2-card key">
            <p className="o2-card-title">Στόχος</p>
            <p className="o2-small">{family.keyIdea}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="o2-h2">Επίλυσε τις γέφυρες φάσεων</h2>
          <span className="o2-counter">{doneSteps} / {solved.steps.length} σωστές</span>
        </div>
        <p className="o2-muted">Κάθε απάντηση ξεκλειδώνει την επόμενη. Βρες την ποσότητα στο τετράδιο και πληκτρολόγησε το αριθμητικό αποτέλεσμα.</p>

        <div className="o2-card white">
          <p className="o2-kicker">Βήμα {stepIndex + 1} / {solved.steps.length}</p>
          <p className="o2-h3">{activeStep.question}</p>
          <form onSubmit={(event) => { event.preventDefault(); verify(); }} className="flex flex-col gap-2">
            <label htmlFor="ormi2-challenge-answer" className="o2-display o2-small o2-muted">Η αριθμητική απάντησή σου</label>
            <div className="flex flex-wrap items-stretch gap-2">
              <input id="ormi2-challenge-answer" inputMode="decimal" autoComplete="off" value={input}
                onChange={(event) => { setInput(event.target.value); setErrorText(""); }} disabled={stepPassed}
                placeholder="π.χ. 4 ή −2,5" className="o2-input w-40 min-w-0 flex-1" />
              <span className="o2-input" style={{ display: "flex", alignItems: "center", fontWeight: 500 }}>{activeStep.unit || "—"}</span>
              <button type="submit" disabled={stepPassed} className="o2-btn dark big">Έλεγχος</button>
            </div>
          </form>
          {errorText && <p role="alert" className="o2-fb bad o2-pop">{errorText}</p>}
          {stepPassed && <div role="status" className="o2-fb ok o2-pop">
            <p><b>Σωστό: {formatAnswer(activeStep.answer)} {activeStep.unit}</b></p>
            <p className="mt-1"><b>{activeStep.law}:</b> <span className="o2-m">{activeStep.formula}</span></p>
            <p className="mt-1">{activeStep.explanation}</p>
          </div>}
          {!stepPassed && <div className="o2-card key">
            <p className="o2-card-title">Βοήθεια · αποκάλυψη σταδιακά</p>
            {stepHints === 0 && <p className="o2-small o2-muted">Δοκίμασε πρώτα μόνος σου.</p>}
            {stepHints >= 1 && <p className="o2-small o2-pop"><b>Σκέψου:</b> {activeStep.hint}</p>}
            {stepHints >= 2 && <p className="o2-small o2-pop"><b>Νόμος:</b> {activeStep.law}. <b>Εξίσωση:</b> <span className="o2-m">{activeStep.formula}</span></p>}
            {stepHints >= 3 && <div className="o2-fb ok o2-pop">
              <b>Απάντηση:</b> {formatAnswer(activeStep.answer)} {activeStep.unit}. {activeStep.explanation}
              <div className="mt-2"><button type="button" onClick={() => { setInput(String(activeStep.answer)); setErrorText(""); setStepPassed(true); }} className="o2-btn teal">Προχώρησε με την απάντηση</button></div>
            </div>}
            {stepHints < 3 && <div><button type="button" onClick={() => setHints((old) => ({ ...old, [stepIndex]: Math.min(3, (old[stepIndex] ?? 0) + 1) }))} className="o2-btn">
              {stepHints === 0 ? "Μικρή υπόδειξη" : stepHints === 1 ? "Δείξε εξίσωση" : "Αποκάλυψε απάντηση"}
            </button></div>}
          </div>}
          {stepPassed && !complete && <div><button type="button" onClick={nextStep} className="o2-btn pri big">Συνέχισε στο επόμενο βήμα →</button></div>}
          {complete && !completed && <div><button type="button" onClick={finish} className="o2-btn teal big"><CheckCircle2 size={18}/> Ολοκλήρωση άσκησης</button></div>}
        </div>

        {completed && <div role="status" className="o2-card ok o2-pop">
          <p className="o2-card-title">Η άσκηση ολοκληρώθηκε</p>
          {wrong === 0 && !Object.values(hints).some((n) => n > 0)
            ? <p className="o2-small">Όλα τα ενδιάμεσα αποτελέσματα ήταν σωστά με την πρώτη προσπάθεια, χωρίς βοήθεια. Καταγράφηκε ως αυτόνομη λύση.</p>
            : <p className="o2-small">Καταγράφηκε ως καθοδηγούμενη εξάσκηση. Δοκίμασε την άλλη παραλλαγή για να ελέγξεις αν καταλαβαίνεις την ίδια ιδέα με άλλους αριθμούς.</p>}
          <div className="o2-seg">
            <button type="button" onClick={() => reset(selected, variantId === "a" ? "b" : "a")} className="o2-btn pri">Δοκίμασε την άλλη παραλλαγή →</button>
            <button type="button" onClick={() => reset(selected, variantId)} className="o2-btn"><RefreshCw size={15}/> Ξανά</button>
          </div>
        </div>}

        <p className="o2-small o2-muted">Αποδεκτές αριθμητικές αποκλίσεις: έως 0,5% ή 0,015 σε μονάδες SI για στρογγυλοποίηση. Τα πρόσημα ελέγχονται.</p>
        <StudyMark lesson="ormi2" id={"c-" + family.id} title={"Πρόκληση: " + family.title}
          path={"/mixalis/ormi2/prokliseis?family=" + encodeURIComponent(family.id)} />
      </section>

      <Ormi2Navbar prevLabel="Προηγούμενη" nextLabel="Επόμενη πρόκληση" onPrev={prevFamily} onNext={nextFamily}
        hint="← → αλλάζουν πρόκληση" />

      <section className="o2-slide">
        <p className="o2-kicker">Σύγκριση παραλλαγών</p>
        <h2 className="o2-h2">Τι αλλάζει στη δεύτερη παραλλαγή;</h2>
        <p className="o2-muted">Σύγκρινε τις συνθήκες των δύο εκφωνήσεων. Μερικές αλλαγές επηρεάζουν μόνο τους αριθμούς· άλλες αλλάζουν και τον νόμο ή το πρόσημο.</p>
        {family.id === "collision-rough-ramp" && <div className="o2-card tip"><p className="o2-small">
          <b>Αλλάζει ο νόμος:</b> Α: λείο κεκλιμένο, ισχύει ΑΔΜΕ στην άνοδο. Β: τραχύ κεκλιμένο, εφαρμόζουμε ΘΜΚΕ με έργο τριβής. Η ΑΔΟ της σύντομης κρούσης μένει ίδια.
        </p></div>}
        {family.id === "double-collision-spring" && <div className="o2-card key"><p className="o2-small">
          <b>Αλλάζει το πρόσημο:</b> στην Α το συσσωμάτωμα ανακρούεται μετά τη δεύτερη κρούση, ενώ στη Β συνεχίζει προς τα δεξιά. Η ελαστική κρούση δίνει πρόσημο, μην το μαντεύεις.
        </p></div>}
        {family.id === "wall-rebound-catch" && <div className="o2-card tip"><p className="o2-small">
          <b>Ελέγχω τη συνάντηση:</b> το πρώτο αμαξίδιο, μετά τον τοίχο, πρέπει να κινείται γρηγορότερα από το δεύτερο. Διαφορετικά δεν θα συναντηθούν ποτέ.
        </p></div>}
        <div className="o2-mapgrid">
          {changing.map((key) => <div key={key} className="o2-card">
            <span className="o2-small o2-muted">{GreekParamLabels[key] ?? key}</span>
            <b className="o2-m">{fmt(family.variants[0].p[key])} → {fmt(family.variants[1].p[key])}</b>
          </div>)}
        </div>
        <div className="o2-card trap">
          <p className="o2-h3">Παγίδα της οικογένειας</p>
          <p className="o2-small">{family.trap}</p>
        </div>
      </section>

      <section className="o2-acc">
        <button type="button" aria-expanded={libraryOpen} onClick={() => setLibraryOpen((v) => !v)}>
          <span className="n">☰</span>
          <span>Όλες οι {CHALLENGES.length} προκλήσεις · {mastered} από {totalVariations} παραλλαγές αυτόνομα</span>
          <ChevronDown size={18} className={"chev " + (libraryOpen ? "rotate-180" : "")} />
        </button>
        {libraryOpen && <div className="body">
          <div className="o2-seg" aria-label="Φίλτρο">
            {([["all", "Όλες"], ["very-hard", "Πολύ δύσκολες"], ["review", "Για εξάσκηση"]] as const).map(([id, name]) => (
              <button key={id} type="button" aria-pressed={rating === id} onClick={() => setRating(id)} className="o2-btn sm">{name}</button>
            ))}
          </div>
          {filtered.length === 0 && <p className="o2-small o2-muted">Όλες οι παραλλαγές έχουν ήδη λυθεί χωρίς βοήθεια.</p>}
          <div className="o2-mapgrid">
            {filtered.map(({ item, index }) => (
              <button type="button" key={item.id} onClick={() => { reset(index, "a"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                aria-current={selected === index ? "true" : undefined}>
                <b>{index + 1}. {item.title}</b>
                <span className="inline-flex items-center gap-1">
                  Δυσκολία {item.difficulty}/5 · {item.phases.length} φάσεις
                  {item.variants.every((v) => history[keyFor(item, v)]?.independent) ? <CheckCircle2 size={14} color="var(--ok)" /> : null}
                </span>
              </button>
            ))}
          </div>
          <p className="o2-small o2-muted"><b>Αυτόνομη λύση:</b> σωστή αριθμητική απάντηση σε κάθε βήμα, με την πρώτη προσπάθεια και χωρίς καμία υπόδειξη.</p>
        </div>}
      </section>
      <div className="pb-4" />
    </Ormi2Shell>
  );
}
