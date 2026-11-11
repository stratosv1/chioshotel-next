"use client";

import { useEffect, useState } from "react";
import { StudyMark } from "@/components/mixalis/study/StudyMark";

type Law = "ado" | "delta" | "energy" | "combo";
type Question = {
  id: string;
  situation: string;
  ask: string;
  answer: Law;
  why: string;
  system: string;
  interval: string;
  animation: number;
};

const ANSWERS_KEY = "mixalis-ormi-law-trainer-v1";
const OPTIONS: { id: Law; label: string; hint: string }[] = [
  { id: "ado", label: "ΑΔΟ", hint: "Ολική ορμή συστήματος: πριν = μετά" },
  { id: "delta", label: "Μεταβολή ορμής / ΣF", hint: "Δp = ΣFμ·Δt για σώμα ή σύστημα" },
  { id: "energy", label: "Ενέργεια / ΘΜΚΕ", hint: "Ενέργεια, τριβή, ύψος ή απόσταση" },
  { id: "combo", label: "Συνδυασμός νόμων", hint: "Διαφορετικό εργαλείο σε κάθε στάδιο" },
];

const STAGES = [
  {
    title: "1. ΠΡΙΝ από την κρούση",
    tag: "Το σώμα ολισθαίνει με τριβή",
    system: "Ένα κινούμενο σώμα",
    external: "Η τριβή είναι εξωτερική δύναμη και δρα σε όλη τη διαδρομή.",
    law: "Μεταβολή ορμής / ΘΜΚΕ",
    formula: "ΣF = Δp/Δt ή ½mυ² − ½mυ₀² = −T·s",
    why: "Δεν γράφουμε ΑΔΟ για το σώμα σε αυτή τη διαδρομή: η τριβή αλλάζει την ορμή του.",
    color: "border-[#bd6942] bg-[#fff5ed]",
  },
  {
    title: "2. ΚΑΤΑ την κρούση",
    tag: "Τα σώματα συγκρούονται και κολλάνε",
    system: "Τα δύο σώματα μαζί",
    external: "Η εξωτερική ώθηση της τριβής είναι αμελητέα στη σύντομη κρούση.",
    law: "ΑΔΟ",
    formula: "pολ, αμέσως πριν = pολ, αμέσως μετά",
    why: "Οι μεγάλες δυνάμεις μεταξύ των σωμάτων είναι εσωτερικές για το σύστημα. Η ολική ορμή διατηρείται περίπου στη σύντομη κρούση.",
    color: "border-[#1f6f5c] bg-[#edf8f3]",
  },
  {
    title: "3. ΜΕΤΑ την κρούση",
    tag: "Το συσσωμάτωμα γλιστρά και σταματά",
    system: "Το συσσωμάτωμα",
    external: "Η τριβή δρα για αρκετό χρόνο και μειώνει την ορμή.",
    law: "Μεταβολή ορμής / ΘΜΚΕ",
    formula: "ΣF = Δp/Δt · ή · 0 − ½MV² = −T·s",
    why: "Η ΑΔΟ στη σύγκρουση δεν σημαίνει διατήρηση της ορμής σε όλη την επόμενη ολίσθηση.",
    color: "border-[#bd6942] bg-[#fff5ed]",
  },
] as const;

const QUESTIONS: Question[] = [
  {
    id: "collision", situation: "Δύο αμαξάκια συγκρούονται πλαστικά σε λείο δάπεδο.",
    ask: "Ζητείται η κοινή ταχύτητα αμέσως μετά την κρούση.",
    answer: "ado", system: "Τα δύο αμαξάκια", interval: "Μόνο η κρούση",
    why: "Για το σύστημα των δύο σωμάτων οι δυνάμεις της κρούσης είναι εσωτερικές. Η εξωτερική ώθηση είναι αμελητέα, άρα pολ πριν = pολ μετά.",
    animation: 16,
  },
  {
    id: "wall", situation: "Μπάλα χτυπά τοίχο, επιστρέφει και η επαφή διαρκεί 0,02 s.",
    ask: "Ζητείται η μέση δύναμη του τοίχου στη μπάλα.",
    answer: "delta", system: "Η μπάλα", interval: "Η διάρκεια επαφής",
    why: "Η δύναμη του τοίχου είναι εξωτερική για τη μπάλα. Υπολογίζουμε Δp της μπάλας με πρόσημα και έπειτα ΣFμ = Δp/Δt.",
    animation: 7,
  },
  {
    id: "after", situation: "Δύο σώματα κολλάνε και το συσσωμάτωμα ολισθαίνει σε τραχύ επίπεδο.",
    ask: "Ξέρουμε την κοινή ταχύτητα. Ζητείται ο χρόνος μέχρι να σταματήσει.",
    answer: "delta", system: "Το συσσωμάτωμα", interval: "Η ολίσθηση μετά την κρούση",
    why: "Η τριβή είναι εξωτερική δύναμη, οπότε η ορμή μεταβάλλεται: −T·Δt = 0 − MV. Η ΑΔΟ αφορούσε την προηγούμενη, σύντομη κρούση.",
    animation: 22,
  },
  {
    id: "distance", situation: "Συσσωμάτωμα μάζας M κινείται σε τραχύ δάπεδο με γνωστή αρχική ταχύτητα V.",
    ask: "Ζητείται αποκλειστικά η απόσταση μέχρι να σταματήσει.",
    answer: "energy", system: "Το συσσωμάτωμα", interval: "Η ολίσθηση",
    why: "Το ΘΜΚΕ είναι ο πιο άμεσος δρόμος: 0 − ½MV² = −T·s. Θα μπορούσαμε και με τον 2ο νόμο και την κινηματική, αλλά όχι με ΑΔΟ.",
    animation: 22,
  },
  {
    id: "bullet-speed", situation: "Βλήμα σφηνώνεται σε ακίνητο ξύλο πάνω σε λείο δάπεδο.",
    ask: "Ζητείται η κοινή ταχύτητα αμέσως μετά.",
    answer: "ado", system: "Βλήμα + ξύλο", interval: "Η κρούση",
    why: "Εφαρμόζουμε ΑΔΟ στο σύστημα βλήματος–ξύλου: mυ = (M+m)V. Η κινητική ενέργεια ΔΕΝ διατηρείται στην πλαστική κρούση.",
    animation: 21,
  },
  {
    id: "bullet-force", situation: "Το ίδιο βλήμα σφηνώνεται στο ξύλο. Ξέρουμε τη διάρκεια της κρούσης και την τελική κοινή ταχύτητα.",
    ask: "Ζητείται η μέση δύναμη που άσκησε το βλήμα στο ξύλο.",
    answer: "delta", system: "Μόνο το ξύλο", interval: "Η κρούση",
    why: "Αλλάζουμε σύστημα: για το ξύλο η δύναμη από το βλήμα είναι εξωτερική. Γράφουμε ΣFμ = Δpξύλου/Δt. Η ΑΔΟ του ζεύγους δεν δίνει από μόνη της δύναμη.",
    animation: 23,
  },
  {
    id: "cart-horizontal", situation: "Σώμα πέφτει κατακόρυφα πάνω σε καρότσι που κινείται σε λείο οριζόντιο επίπεδο.",
    ask: "Ζητείται η κοινή οριζόντια ταχύτητα αμέσως μετά.",
    answer: "ado", system: "Σώμα + καρότσι στον άξονα x", interval: "Η πρόσκρουση",
    why: "Η εξωτερική ώθηση στον x είναι μηδενική, οπότε διατηρείται η οριζόντια ορμή. Στον y η ώθηση από το δάπεδο δεν επιτρέπει την ίδια εξίσωση.",
    animation: 30,
  },
  {
    id: "cart-vertical", situation: "Στην προηγούμενη πρόσκρουση το σώμα σταματά να κατεβαίνει επειδή το στηρίζει το καρότσι.",
    ask: "Ζητείται η κατακόρυφη ώθηση που ασκείται στο συνολικό σύστημα.",
    answer: "delta", system: "Σώμα + καρότσι στον y", interval: "Η πρόσκρουση",
    why: "Στον y υπάρχει εξωτερική ώθηση από το έδαφος (και βάρος). Χρησιμοποιούμε (ΣFεξ,y)μ·Δt = Δpολ,y και όχι ΑΔΟ στον y.",
    animation: 30,
  },
  {
    id: "pendulum", situation: "Βλήμα σφηνώνεται σε εκκρεμές. Το συσσωμάτωμα ανεβαίνει.",
    ask: "Ζητείται το μέγιστο ύψος από την αρχική ταχύτητα του βλήματος.",
    answer: "combo", system: "Βλήμα + εκκρεμές, έπειτα συσσωμάτωμα", interval: "Κρούση → άνοδος",
    why: "Στην πολύ σύντομη κρούση βρίσκουμε V με ΑΔΟ (οριζόντια συνιστώσα). Μετά χρησιμοποιούμε διατήρηση μηχανικής ενέργειας για την άνοδο: ½(M+m)V² = (M+m)gh.",
    animation: 24,
  },
  {
    id: "spring", situation: "Δύο αμαξάκια αρχικά ακίνητα απομακρύνονται από συμπιεσμένο ελατήριο σε λείο δάπεδο.",
    ask: "Ζητείται η ταχύτητα του δεύτερου, ενώ είναι γνωστή η ταχύτητα του πρώτου.",
    answer: "ado", system: "Και τα δύο αμαξάκια", interval: "Η εκτόνωση του ελατηρίου",
    why: "Το ελατήριο ασκεί εσωτερικές δυνάμεις στο σύστημα. Αν δεν υπάρχει εξωτερική ώθηση: 0 = m₁υ₁ + m₂υ₂, με πρόσημα.",
    animation: 36,
  },
  {
    id: "rope", situation: "Δύο σώματα συνδέονται με νήμα και ένα εξωτερικό χέρι τα τραβά σε λείο επίπεδο.",
    ask: "Ζητείται η μεταβολή της ολικής ορμής τους σε 3 s.",
    answer: "delta", system: "Τα δύο σώματα μαζί", interval: "Τα 3 s δράσης της εξωτερικής δύναμης",
    why: "Ακόμη και για δύο σώματα δεν γράφουμε ΑΔΟ όταν υπάρχει μη μηδενική εξωτερική ώθηση. Γράφουμε Δpολ = ΣFεξ,μ·Δt.",
    animation: 6,
  },
  {
    id: "three-stage", situation: "Σώμα φρενάρει από τριβή, έπειτα συγκρούεται πλαστικά με άλλο και μετά το συσσωμάτωμα συνεχίζει να ολισθαίνει.",
    ask: "Ζητούνται η ταχύτητα πριν, η κοινή ταχύτητα και η απόσταση ακινητοποίησης.",
    answer: "combo", system: "Ένα σώμα → δύο σώματα → συσσωμάτωμα", interval: "Τρία διαφορετικά στάδια",
    why: "Πριν: μεταβολή ορμής ή ΘΜΚΕ λόγω τριβής. Κατά την κρούση: ΑΔΟ για τα δύο σώματα. Μετά: ΘΜΚΕ ή μεταβολή ορμής + κινηματική. Δεν ισχύει ένας νόμος σε όλη την άσκηση.",
    animation: 22,
  },
];

function loadAnswers(): Record<string, Law> {
  try {
    const value = JSON.parse(window.localStorage.getItem(ANSWERS_KEY) ?? "{}") as Record<string, Law>;
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

export function OrmiLawTrainer() {
  const [stage, setStage] = useState(1);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Law>>({});
  const [ready, setReady] = useState(false);
  const [wrongOnly, setWrongOnly] = useState(false);

  useEffect(() => {
    setAnswers(loadAnswers());
    setReady(true);
  }, []);

  const choose = (id: string, answer: Law) => {
    if (answers[id]) return; // One honest first attempt per question.
    const next = { ...answers, [id]: answer };
    setAnswers(next);
    try {
      window.localStorage.setItem(ANSWERS_KEY, JSON.stringify(next));
    } catch {
      // Practice remains available even if storage is blocked.
    }
  };

  const done = QUESTIONS.filter((q) => answers[q.id]).length;
  const correct = QUESTIONS.filter((q) => answers[q.id] === q.answer).length;
  const mistakes = QUESTIONS.map((q, i) => ({ q, i })).filter(({ q }) => answers[q.id] && answers[q.id] !== q.answer);
  const visible = QUESTIONS.map((q, i) => ({ q, i })).filter(({ q }) => !wrongOnly || (answers[q.id] && answers[q.id] !== q.answer));
  const q = QUESTIONS[index];
  const picked = answers[q.id];
  const activeStage = STAGES[stage];

  const go = (next: number) => setIndex(Math.max(0, Math.min(QUESTIONS.length - 1, next)));
  const changeReview = (next: boolean) => {
    setWrongOnly(next);
    if (next && mistakes.length) setIndex(mistakes[0].i);
    if (!next) setIndex(0);
  };

  return (
    <section id="epilogi-nomou" className="scroll-mt-24 space-y-5 rounded-3xl border border-[#1f6f5c]/30 bg-white p-4 shadow-sm sm:p-7">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#1f6f5c]">Πριν επιλέξεις τύπο</p>
        <h2 className="mt-2 text-2xl font-bold text-[#1c2433] sm:text-3xl">ΑΔΟ ή μεταβολή ορμής; Μάθε να αποφασίζεις</h2>
        <p className="mt-3 max-w-4xl text-[15px] leading-7 text-[#3d4452]">
          Αυτό είναι εξάσκηση πάνω στο αναλυτικό μάθημα 2.5 που βρίσκεται στις 41 διαφάνειες πιο πάνω.
          Δεν αρκεί να δεις αν υπάρχουν δύο σώματα ή αν δίνεται χρόνος. Πρώτα ορίζεις
          <b> σύστημα, χρονικό διάστημα και εξωτερικές δυνάμεις/ωθήσεις</b>.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["1", "Ποιο σύστημα;", "Μπάλα; Ή μπάλα + τοίχος; Τα ίδια φαινόμενα, διαφορετικές εξωτερικές δυνάμεις."],
          ["2", "Πότε;", "Αμέσως πριν/μετά την κρούση ή κατά την επόμενη ολίσθηση;"],
          ["3", "Υπάρχει εξωτερική ώθηση;", "Αμελητέα ⇒ ΑΔΟ για την ολική ορμή. Σημαντική ⇒ Δpολ = (ΣFεξ)μ·Δt."],
        ].map(([n, heading, body]) => (
          <div key={n} className="rounded-2xl bg-[#f3f6f4] p-4">
            <div className="text-sm font-bold text-[#1f6f5c]">{n}. {heading}</div>
            <p className="mt-2 text-sm leading-6 text-[#3d4452]">{body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-4 sm:p-5">
        <h3 className="text-lg font-bold text-[#1c2433]">Η ίδια άσκηση σε 3 στάδια</h3>
        <p className="mt-1 text-sm text-[#5b6577]">Διάλεξε στάδιο. Παρατήρησε ότι αλλάζει το χρονικό διάστημα και μαζί του το κατάλληλο εργαλείο.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3" role="group" aria-label="Επιλογή σταδίου">
          {STAGES.map((s, i) => (
            <button key={s.title} type="button" aria-pressed={stage === i} onClick={() => setStage(i)}
              className={`rounded-xl border px-3 py-3 text-left text-sm font-bold transition ${stage === i ? "border-[#1f6f5c] bg-[#1f6f5c] text-white" : "border-black/10 bg-white text-[#3d4452] hover:bg-[#edf8f3]"}`}>
              {s.title}
            </button>
          ))}
        </div>
        <div className={`mt-3 rounded-2xl border p-4 ${activeStage.color}`}>
          <p className="text-sm font-bold text-[#1c2433]">{activeStage.tag}</p>
          <dl className="mt-3 grid gap-2 text-sm leading-6 sm:grid-cols-2">
            <div><dt className="font-bold">Σύστημα</dt><dd>{activeStage.system}</dd></div>
            <div><dt className="font-bold">Εξωτερική ώθηση</dt><dd>{activeStage.external}</dd></div>
          </dl>
          <p className="mt-3 font-bold text-[#1f6f5c]">Εφαρμόζω: {activeStage.law}</p>
          <p className="mt-1 rounded-lg bg-white/75 px-3 py-2 font-mono text-sm text-[#1c2433]">{activeStage.formula}</p>
          <p className="mt-3 text-sm leading-6 text-[#3d4452]">{activeStage.why}</p>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#5b6577]">
          Σημαντικό: η σχέση Δp = Jεξ ισχύει γενικά. Η ΑΔΟ είναι η ειδική περίπτωση όπου η συνολική εξωτερική ώθηση είναι μηδέν (ή αμελητέα).
          Αν η δύναμη μεταβάλλεται, ΣFμ = Δp/Δt είναι η <b>μέση</b> συνισταμένη.
        </p>
      </div>

      <div className="rounded-2xl border border-black/10 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-[#1c2433]">Τεστ επιλογής νόμου · {QUESTIONS.length} περιπτώσεις</h3>
            <p className="mt-1 text-sm text-[#5b6577]">Διάλεξε μόνο τον καταλληλότερο τρόπο για το συγκεκριμένο ζητούμενο. Η πρώτη απάντηση καταγράφεται.</p>
          </div>
          <span className="rounded-full bg-[#edf8f3] px-3 py-1.5 text-sm font-semibold text-[#1f6f5c]">
            {ready ? `${correct} σωστά · ${done}/${QUESTIONS.length} απαντημένα` : "Φόρτωση προόδου…"}
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eae7e0]" aria-label="Πρόοδος τεστ">
          <div className="h-full bg-[#1f6f5c] transition-all" style={{ width: `${(done / QUESTIONS.length) * 100}%` }} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => changeReview(false)} aria-pressed={!wrongOnly}
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${!wrongOnly ? "bg-[#1c2433] text-white" : "border border-black/10 text-[#3d4452]"}`}>
            Όλα τα ερωτήματα
          </button>
          <button type="button" disabled={!mistakes.length} onClick={() => changeReview(true)} aria-pressed={wrongOnly}
            className={`rounded-full px-3 py-1.5 text-sm font-bold disabled:opacity-40 ${wrongOnly ? "bg-[#9e4a2a] text-white" : "border border-black/10 text-[#3d4452]"}`}>
            Λάθη για επανάληψη ({mistakes.length})
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Μετάβαση σε ερώτημα">
          {visible.map(({ q: item, i }) => {
            const a = answers[item.id];
            const bg = !a ? "border-black/15 bg-white text-[#3d4452]" : a === item.answer ? "border-[#1f6f5c] bg-[#e6f5ed] text-[#1f6f5c]" : "border-[#ae583a] bg-[#fff1e9] text-[#9e4a2a]";
            return <button key={item.id} type="button" onClick={() => go(i)} aria-label={`Ερώτημα ${i + 1}`}
              aria-current={index === i ? "step" : undefined}
              className={`h-9 min-w-9 rounded-lg border px-2 text-sm font-semibold ${bg} ${index === i ? "ring-2 ring-[#1c2433] ring-offset-2" : ""}`}>
              {i + 1}
            </button>;
          })}
        </div>

        <div className="mt-5 rounded-2xl bg-[#f7f8fb] p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#857261]">Ερώτημα {index + 1} από {QUESTIONS.length}</p>
          <p className="mt-2 text-base font-medium leading-7 text-[#1c2433]">{q.situation}</p>
          <p className="mt-2 text-base font-bold leading-7 text-[#1c2433]">{q.ask}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {OPTIONS.map((option) => {
              const active = picked === option.id;
              const revealed = Boolean(picked);
              const isRight = q.answer === option.id;
              const style = revealed && isRight
                ? "border-[#1f6f5c] bg-[#e6f5ed]"
                : revealed && active ? "border-[#ae583a] bg-[#fff1e9]"
                : "border-black/10 bg-white hover:bg-[#edf8f3]";
              return (
                <button key={option.id} type="button" disabled={!ready || revealed} onClick={() => choose(q.id, option.id)}
                  className={`rounded-xl border p-3 text-left transition disabled:cursor-default ${style}`}>
                  <span className="block text-sm font-bold text-[#1c2433]">
                    {revealed && isRight ? "✓ " : revealed && active ? "✗ " : ""}{option.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#5b6577]">{option.hint}</span>
                </button>
              );
            })}
          </div>
          {picked ? (
            <div className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${picked === q.answer ? "border-[#1f6f5c]/30 bg-[#e6f5ed]" : "border-[#ae583a]/30 bg-[#fff1e9]"}`} role="status">
              <p className="font-bold">{picked === q.answer ? "Σωστά. Έλεγξε και το σκεπτικό." : "Όχι. Δες πού αλλάζει το σύστημα ή το χρονικό στάδιο."}</p>
              <p className="mt-2"><b>Σύστημα:</b> {q.system}</p>
              <p><b>Χρονικό διάστημα:</b> {q.interval}</p>
              <p className="mt-2">{q.why}</p>
              <a href={`#k${q.animation}`} className="mt-3 inline-block font-bold text-[#1f6f5c] underline underline-offset-2">
                Δες το κινούμενο σχέδιο {q.animation} ↓
              </a>
            </div>
          ) : null}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button type="button" disabled={index === 0} onClick={() => { changeReview(false); go(index - 1); }}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-bold text-[#3d4452] disabled:opacity-40">← Προηγούμενο</button>
          <button type="button" disabled={index === QUESTIONS.length - 1} onClick={() => { changeReview(false); go(index + 1); }}
            className="rounded-full bg-[#1f6f5c] px-4 py-2 text-sm font-bold text-white disabled:opacity-40">Επόμενο →</button>
        </div>
        {done === QUESTIONS.length && ready ? (
          <div className="mt-4 rounded-xl border border-[#1f6f5c]/25 bg-[#edf8f3] p-4 text-sm leading-6">
            <p className="font-bold">Αποτέλεσμα πρώτης προσπάθειας: {correct}/{QUESTIONS.length}</p>
            <p>Τα λάθη διατηρούνται στη συσκευή για επανάληψη. Για νέα προσπάθεια, μπορείς να μηδενίσεις το τεστ.</p>
          </div>
        ) : null}
        {done > 0 ? (
          <button type="button" className="mt-4 text-xs font-semibold text-[#857261] underline underline-offset-2"
            onClick={() => {
              if (!window.confirm("Να διαγραφούν οι απαντήσεις του τεστ από αυτή τη συσκευή;")) return;
              setAnswers({}); setWrongOnly(false); setIndex(0);
              try { window.localStorage.removeItem(ANSWERS_KEY); } catch { /* ignore */ }
            }}>
            Νέα προσπάθεια · μηδενισμός τεστ
          </button>
        ) : null}
        <p className="mt-3 text-xs leading-5 text-[#857261]">
          Η πρόοδος και τα λάθη αποθηκεύονται μόνο σε αυτόν τον browser. Δεν κοινοποιούνται ούτε συγχρονίζονται με άλλη συσκευή.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <a href="#mathima" className="font-bold text-[#1f6f5c] underline underline-offset-2">Ξαναδιάβασε το αναλυτικό μάθημα 2.5 ↑</a>
      </div>
      <StudyMark lesson="ormi" id="epilogi-nomou" title="ΑΔΟ ή μεταβολή ορμής — τεστ επιλογής" path="/mixalis/ormi" />
    </section>
  );
}
