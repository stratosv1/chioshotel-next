"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, BookOpen, BrainCircuit, CalendarClock, CheckCircle2,
  ClipboardList, GitBranch, RefreshCw, Target, TrendingUp,
} from "lucide-react";
import { SCENARIOS } from "@/components/mixalis/ormi/OrmiPhaseQuiz";
import { CHALLENGES } from "./challenges-data";
import {
  NUMERIC_STEP_SKILLS, SKILLS, SKILL_CHANGED_EVENT,
  nextSkillForPractice, readSkillEvents, summarizeSkills,
  type SkillEvent, type SkillId,
} from "./learning-data";

type PhaseRecord = { attempts?: number; cleanPlans?: number; needsReview?: boolean };
type NumericRecord = { attempts?: number; independent?: number };
type PhaseHistory = Record<string, PhaseRecord>;
type NumericHistory = Record<string, NumericRecord>;

function fromStorage<T>(key: string): T {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) ?? "{}");
    if (value && typeof value === "object" && !Array.isArray(value)) return value as T;
  } catch { /* optional */ }
  return {} as T;
}

function niceDate(timestamp: number): string {
  if (!timestamp) return "Χωρίς ακόμη καταγραφή";
  return new Intl.DateTimeFormat("el-GR", { day: "numeric", month: "short" }).format(new Date(timestamp));
}

const stateLabel = {
  "not-started": "Δεν έχει δοκιμαστεί",
  practice: "Χρειάζεται ενίσχυση",
  learning: "Σε εξέλιξη",
  strong: "Σταθερή επίδοση",
};

export function Ormi2ProgressDashboard() {
  const [events, setEvents] = useState<SkillEvent[]>([]);
  const [phases, setPhases] = useState<PhaseHistory>({});
  const [numeric, setNumeric] = useState<NumericHistory>({});
  const [ready, setReady] = useState(false);
  const [clock, setClock] = useState(0);

  useEffect(() => {
    const update = () => {
      setEvents(readSkillEvents());
      setPhases(fromStorage<PhaseHistory>("mixalis-ormi2-lab-v1"));
      setNumeric(fromStorage<NumericHistory>("mixalis-ormi2-numeric-challenges-v1"));
      setClock(Date.now());
      setReady(true);
    };
    update();
    window.addEventListener(SKILL_CHANGED_EVENT, update);
    window.addEventListener("storage", update);
    window.addEventListener("focus", update);
    return () => {
      window.removeEventListener(SKILL_CHANGED_EVENT, update);
      window.removeEventListener("storage", update);
      window.removeEventListener("focus", update);
    };
  }, []);

  const summary = useMemo(() => summarizeSkills(events), [events]);
  const focus = useMemo(() => nextSkillForPractice(summary, clock), [summary, clock]);
  const observedSkills = summary.filter((s) => s.attempts > 0).length;
  const strongSkills = summary.filter((s) => s.state === "strong").length;
  const phaseTried = Object.values(phases).filter((p) => p.attempts && p.attempts > 0).length;
  const phaseIndependent = Object.values(phases).filter((p) => p.cleanPlans && p.cleanPlans > 0).length;
  const numericTried = Object.values(numeric).filter((p) => p.attempts && p.attempts > 0).length;
  const numericIndependent = Object.values(numeric).filter((p) => p.independent && p.independent > 0).length;

  const recommended = useMemo(() => {
    if (!focus) return null;
    const skill = focus.skill;
    if (skill === "phases" || skill === "laws" || skill === "strategy") {
      const candidate = SCENARIOS.find((s) => phases[s.id]?.needsReview)
        ?? SCENARIOS.find((s) => !phases[s.id]?.attempts)
        ?? SCENARIOS.find((s) => !phases[s.id]?.cleanPlans)
        ?? SCENARIOS[0];
      return candidate ? {
        kind: "method" as const,
        title: candidate.title,
        href: "/mixalis/ormi2?scenario=" + encodeURIComponent(candidate.id),
        tag: "Εργαστήριο φάσεων",
        detail: "Δοκίμασε να χωρίσεις τα γεγονότα, να επιλέξεις νόμους και να ξεκινήσεις από τη σωστή φάση.",
      } : null;
    }
    const candidates = CHALLENGES.filter((family) =>
      Object.values(NUMERIC_STEP_SKILLS[family.id] ?? {}).some((skills) => skills.includes(skill))
    );
    const preferred = candidates.flatMap((family) => family.variants.map((variant) => ({
      family, variant,
      done: (numeric[family.id + ":" + variant.id]?.independent ?? 0) > 0,
      attempted: (numeric[family.id + ":" + variant.id]?.attempts ?? 0) > 0,
    })));
    preferred.sort((a, b) => Number(a.done) - Number(b.done) || Number(a.attempted) - Number(b.attempted) || a.family.difficulty - b.family.difficulty);
    const pick = preferred[0];
    return pick ? {
      kind: "numeric" as const,
      title: pick.family.title + " · " + (pick.variant.id === "a" ? "Α" : "Β"),
      href: "/mixalis/ormi2/prokliseis?family=" + encodeURIComponent(pick.family.id) + "&variant=" + pick.variant.id,
      tag: "Αριθμητική πρόκληση",
      detail: "Λύσε κάθε ενδιάμεσο ζητούμενο και εντόπισε ποιο αποτέλεσμα περνά στην επόμενη φάση.",
    } : null;
  }, [focus, phases, numeric]);

  const afterThat = useMemo(() => {
    if (!recommended) return null;
    if (recommended.kind === "method") {
      return {
        href: "/mixalis/ormi2/prokliseis",
        title: "Συνέχισε με αριθμητικές προκλήσεις",
        description: "Δοκίμασε την ίδια συλλογιστική με αριθμούς και ενδιάμεσους ελέγχους.",
      };
    }
    return {
      href: "/mixalis/ormi2",
      title: "Έλεγχος με νέο σενάριο φάσεων",
      description: "Αν οι πράξεις πήγαν σωστά, επανέλεγξε τη στρατηγική χωρίς αριθμούς.",
    };
  }, [recommended]);

  return (
    <main className="min-h-screen bg-[#f3efe8] px-3 py-5 text-[#272c29] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-3xl bg-[#1c3c37] p-6 text-white sm:p-9">
          <Link href="/mixalis/ormi2" className="inline-flex items-center gap-2 text-sm text-[#c6e0d1] hover:text-white">
            <ArrowLeft size={16}/> Πίσω στην Ορμή 2
          </Link>
          <div className="mt-6 flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#a6d8bf]">Στάδιο 3 · Προσωπική εξάσκηση</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-5xl">Ο χάρτης προόδου μου</h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#d4e7da]">
                Δεν μετράμε απλώς πόσες λύσεις είδες. Εντοπίζουμε σε ποιες επιλογές νόμων,
                ταχύτητες και συνδέσεις φάσεων χρειάζεσαι νέα εξάσκηση.
              </p>
            </div>
            <div className="grid w-full grid-cols-3 gap-2 sm:w-auto">
              {[
                ["12", "Δεξιότητες"],
                [String(observedSkills), "Δοκιμασμένες"],
                [String(strongSkills), "Σταθερές"],
              ].map(([value, title]) => <div key={title} className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center">
                <p className="text-2xl font-semibold">{value}</p><p className="text-[11px] text-[#c4dece]">{title}</p>
              </div>)}
            </div>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-3xl border border-black/10 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2"><GitBranch className="text-[#246b50]" size={20}/><h2 className="text-lg font-semibold">Εργαστήριο φάσεων</h2></div>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{phaseTried} <span className="text-base font-medium text-[#8c847b]">/ 36</span></p>
            <p className="mt-1 text-sm text-[#6c655c]">Ασκήσεις με καταγεγραμμένη προσπάθεια · {phaseIndependent} με ανεξάρτητο σχέδιο</p>
            <Link href="/mixalis/ormi2" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#227356]">Πήγαινε στις φάσεις <ArrowRight size={16}/></Link>
          </section>
          <section className="rounded-3xl border border-black/10 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2"><Target className="text-[#246b50]" size={20}/><h2 className="text-lg font-semibold">Εργαστήριο προκλήσεων</h2></div>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{numericTried} <span className="text-base font-medium text-[#8c847b]">/ {CHALLENGES.length * 2}</span></p>
            <p className="mt-1 text-sm text-[#6c655c]">Αριθμητικές παραλλαγές · {numericIndependent} με σωστά αποτελέσματα χωρίς βοήθεια</p>
            <Link href="/mixalis/ormi2/prokliseis" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#227356]">Πήγαινε στις προκλήσεις <ArrowRight size={16}/></Link>
          </section>
        </div>

        <section className="rounded-3xl border border-[#bed9c8] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-2 text-[#2b7654]"><BrainCircuit size={23}/><h2 className="text-xl font-semibold">Η επόμενη καλύτερη άσκηση</h2></div>
          {!ready ? <p className="mt-3 text-sm text-[#756c61]">Φόρτωση τοπικής προόδου…</p> :
            !events.length ?
            <div className="mt-4 rounded-2xl bg-[#f1f7f2] p-4 text-sm leading-7">
              <p className="font-semibold">Ξεκινά η προσωπική διάγνωση.</p>
              <p className="mt-1 text-[#5d6b60]">Η πρόοδος από προηγούμενες εκδόσεις διατηρείται. Οι ειδικές καταγραφές λαθών αρχίζουν από την επόμενη ολοκληρωμένη άσκηση — δεν θα επινοήσουμε αναδρομικά λάθη που δεν καταγράφηκαν.</p>
            </div>
            : <p className="mt-3 text-sm leading-7 text-[#6d685f]">
              {focus?.state === "strong" ? "Έχει έρθει η στιγμή για επανέλεγχο μιας παλαιότερης δεξιότητας." :
                focus?.attempts ? "Προτεραιότητα: η δεξιότητα με τη μεγαλύτερη ανάγκη εξάσκησης." : "Δεν καταγράφεται αδυναμία: ας καλύψουμε μια δεξιότητα που δεν έχει δοκιμαστεί ακόμη."}
            </p>}
          {focus && recommended && <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#338363]">{recommended.tag}</p>
              <h3 className="mt-1 text-xl font-semibold">{recommended.title}</h3>
              <p className="mt-2 text-sm text-[#666055]"><strong>Εστίαση:</strong> {focus.label}</p>
              <p className="mt-2 text-sm leading-7 text-[#666055]">{recommended.detail}</p>
            </div>
            <Link href={recommended.href} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#24634b] px-5 py-3 text-sm font-semibold text-white hover:bg-[#194832]">Ξεκίνα την άσκηση <ArrowRight size={16}/></Link>
          </div>}
          {afterThat && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f6f5f1] p-4">
            <div><p className="text-sm font-semibold">{afterThat.title}</p><p className="mt-1 text-xs leading-6 text-[#756e62]">{afterThat.description}</p></div>
            <Link href={afterThat.href} className="inline-flex items-center gap-1 text-sm font-semibold text-[#27654d]">Δεύτερη άσκηση <ArrowRight size={16}/></Link>
          </div>}
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-5 sm:p-7">
          <div className="flex items-center gap-2"><TrendingUp size={21} className="text-[#27765a]"/><h2 className="text-xl font-semibold">Οι 12 δεξιότητες</h2></div>
          <p className="mt-2 text-sm leading-7 text-[#6c665c]">Η ένδειξη είναι διδακτική, όχι σχολικός βαθμός. «Σταθερή επίδοση» απαιτεί επιτυχία χωρίς βοήθεια σε τουλάχιστον δύο διαφορετικά προβλήματα της ίδιας δεξιότητας.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {summary.map((item) => {
              const meta = SKILLS.find((skill) => skill.id === item.skill);
              return <div key={item.skill} className="rounded-2xl border border-[#e1e4dd] bg-[#fbfcf9] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{item.label}</p>
                  <span className={"rounded-full px-2.5 py-1 text-[11px] font-semibold " +
                    (item.state === "strong" ? "bg-[#e0f1e5] text-[#286849]" :
                    item.state === "practice" ? "bg-[#fff0df] text-[#925b29]" : "bg-[#eceee9] text-[#687065]")}>
                    {stateLabel[item.state]}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-[#746c61]">{meta?.description}</p>
                {item.attempts ? <>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e5e9e2]"><div className={"h-full rounded-full " + (item.state === "strong" ? "bg-[#2c8a59]" : "bg-[#c99e5f]")} style={{ width: item.score + "%" }} /></div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#796f62]">
                    <span>{item.independent} αυτόνομα · {item.guided} με βοήθεια · {item.unresolved} εκκρεμή</span>
                    <span>{item.score}% · {niceDate(item.lastAt)}</span>
                  </div>
                </> : <p className="mt-3 text-xs font-medium text-[#999084]">Δεν υπάρχει ακόμη αξιολόγηση σε αυτή τη δεξιότητα.</p>}
              </div>;
            })}
          </div>
        </section>
        <section className="rounded-3xl border border-black/10 bg-[#fffdf9] p-5 sm:p-7">
          <div className="flex items-center gap-2"><CalendarClock size={20} className="text-[#8e784e]"/><h2 className="text-lg font-semibold">Πώς γίνεται ο επανέλεγχος</h2></div>
          <p className="mt-2 text-sm leading-7 text-[#696357]">
            Όταν μια δεξιότητα έχει σταθεροποιηθεί, προτείνουμε ξανά εξάσκηση εφόσον έχουν περάσει τουλάχιστον τρεις ημέρες από την τελευταία προσπάθεια. Η εφαρμογή δεν στέλνει αυτόματες ειδοποιήσεις. Ο επανέλεγχος εμφανίζεται όταν ανοίξεις αυτή τη σελίδα.
          </p>
          <p className="mt-3 text-xs leading-6 text-[#8b8275]">Οι καταγραφές παραμένουν στο πρόγραμμα περιήγησης της συγκεκριμένης συσκευής. Δεν μεταφέρονται σε άλλη συσκευή και δεν μοιράζονται με τους διαχειριστές του ξενοδοχείου.</p>
        </section>
      </div>
    </main>
  );
}
