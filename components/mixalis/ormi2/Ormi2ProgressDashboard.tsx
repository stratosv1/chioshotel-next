"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Ormi2Shell } from "./Ormi2Shell";
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
      // Στόχευση της ΣΥΓΚΕΚΡΙΜΕΝΗΣ δεξιότητας: πρώτα σενάρια όπου η τελευταία
      // προσπάθεια σε αυτή τη δεξιότητα δεν ήταν ανεξάρτητη (τα παλαιότερα πρώτα),
      // μετά σενάρια που δεν έχουν δοκιμαστεί καθόλου.
      const latest = new Map<string, SkillEvent>();
      for (const e of events) {
        if (e.source !== "phases" || e.skill !== skill) continue;
        const seen = latest.get(e.item);
        if (!seen || e.at >= seen.at) latest.set(e.item, e);
      }
      const weak = SCENARIOS.filter((sc) => latest.has(sc.id) && !latest.get(sc.id)!.independent)
        .sort((a, b) => latest.get(a.id)!.at - latest.get(b.id)!.at);
      const candidate = weak[0]
        ?? SCENARIOS.find((sc) => !latest.has(sc.id) && !phases[sc.id]?.attempts)
        ?? SCENARIOS.find((sc) => !latest.has(sc.id))
        ?? SCENARIOS.find((sc) => !phases[sc.id]?.cleanPlans)
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
  }, [focus, phases, numeric, events]);

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

  const stateTag = (state: keyof typeof stateLabel) =>
    state === "strong" ? "ok" : state === "practice" ? "warn" : "";

  return (
    <Ormi2Shell page="progress" subtitle="Χάρτης προόδου"
      counter={<>{observedSkills}/12 δεξιότητες δοκιμασμένες · {strongSkills} σταθερές</>}>
      <section className="o2-slide">
        <p className="o2-kicker">Προσωπική εξάσκηση</p>
        <h1 className="o2-h1">Ο χάρτης προόδου μου</h1>
        <p className="o2-lead">Δεν μετράμε απλώς πόσες λύσεις είδες. Εντοπίζουμε σε ποιες επιλογές νόμων, ταχύτητες και συνδέσεις φάσεων χρειάζεσαι νέα εξάσκηση.</p>

        <div className="o2-cols">
          <div className="o2-card">
            <p className="o2-card-title">Εργαστήριο φάσεων</p>
            <p><span className="o2-stat">{phaseTried}</span> <span className="o2-muted">/ {SCENARIOS.length} σενάρια</span></p>
            <div className="o2-meter"><i className="ok" style={{ width: Math.round(phaseIndependent / SCENARIOS.length * 100) + "%" }} /></div>
            <p className="o2-small o2-muted">{phaseIndependent} με ανεξάρτητο σχέδιο</p>
            <div><Link href="/mixalis/ormi2" className="o2-btn">Πήγαινε στις φάσεις →</Link></div>
          </div>
          <div className="o2-card">
            <p className="o2-card-title">Αριθμητικές προκλήσεις</p>
            <p><span className="o2-stat">{numericTried}</span> <span className="o2-muted">/ {CHALLENGES.length * 2} παραλλαγές</span></p>
            <div className="o2-meter"><i className="ok" style={{ width: Math.round(numericIndependent / (CHALLENGES.length * 2) * 100) + "%" }} /></div>
            <p className="o2-small o2-muted">{numericIndependent} με σωστά αποτελέσματα χωρίς βοήθεια</p>
            <div><Link href="/mixalis/ormi2/prokliseis" className="o2-btn">Πήγαινε στις προκλήσεις →</Link></div>
          </div>
        </div>

        <div className="o2-card key">
          <p className="o2-kicker">Η επόμενη καλύτερη άσκηση</p>
          {!ready ? <p className="o2-small o2-muted">Φόρτωση τοπικής προόδου…</p> :
            !events.length ?
            <div className="o2-small">
              <p><b>Ξεκινά η προσωπική διάγνωση.</b></p>
              <p className="o2-muted">Η πρόοδος από προηγούμενες εκδόσεις διατηρείται. Οι ειδικές καταγραφές λαθών αρχίζουν από την επόμενη ολοκληρωμένη άσκηση: δεν επινοούμε αναδρομικά λάθη που δεν καταγράφηκαν.</p>
            </div>
            : <p className="o2-small o2-muted">
              {focus?.state === "strong" ? "Έχει έρθει η στιγμή για επανέλεγχο μιας παλαιότερης δεξιότητας." :
                focus?.attempts ? "Προτεραιότητα: η δεξιότητα με τη μεγαλύτερη ανάγκη εξάσκησης." : "Δεν καταγράφεται αδυναμία: ας καλύψουμε μια δεξιότητα που δεν έχει δοκιμαστεί ακόμη."}
            </p>}
          {focus && recommended && <>
            <p className="o2-tag" style={{ alignSelf: "flex-start" }}>{recommended.tag} · Εστίαση: {focus.label}</p>
            <p className="o2-h2">{recommended.title}</p>
            <p className="o2-small">{recommended.detail}</p>
            <div className="o2-seg">
              <Link href={recommended.href} className="o2-btn pri big">Ξεκίνα την άσκηση →</Link>
              {afterThat && <Link href={afterThat.href} className="o2-btn big" title={afterThat.description}>{afterThat.title}</Link>}
            </div>
          </>}
        </div>
      </section>

      <section className="o2-slide">
        <p className="o2-kicker">Οι 12 δεξιότητες</p>
        <p className="o2-muted o2-small">Η ένδειξη είναι διδακτική, όχι σχολικός βαθμός. «Σταθερή επίδοση» απαιτεί επιτυχία χωρίς βοήθεια σε τουλάχιστον δύο διαφορετικά προβλήματα της ίδιας δεξιότητας.</p>
        <div className="o2-cols">
          {summary.map((item) => {
            const meta = SKILLS.find((skill) => skill.id === item.skill);
            return <div key={item.skill} className={"o2-card " + (item.state === "strong" ? "tip" : item.state === "practice" ? "key" : "")}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="o2-card-title">{item.label}</p>
                <span className={"o2-tag " + stateTag(item.state)}>{stateLabel[item.state]}</span>
              </div>
              <p className="o2-small o2-muted">{meta?.description}</p>
              {item.attempts ? <>
                <div className="o2-meter"><i className={item.state === "strong" ? "ok" : ""} style={{ width: item.score + "%" }} /></div>
                <p className="o2-m o2-muted" style={{ fontSize: 13 }}>{item.independent} αυτόνομα · {item.guided} με βοήθεια · {item.unresolved} εκκρεμή · {item.score}% · {niceDate(item.lastAt)}</p>
              </> : <p className="o2-small o2-muted">Δεν υπάρχει ακόμη αξιολόγηση σε αυτή τη δεξιότητα.</p>}
            </div>;
          })}
        </div>
      </section>

      <section className="o2-card tip">
        <p className="o2-card-title">Πώς γίνεται ο επανέλεγχος</p>
        <p className="o2-small">Όταν μια δεξιότητα έχει σταθεροποιηθεί, προτείνουμε ξανά εξάσκηση εφόσον έχουν περάσει τουλάχιστον τρεις ημέρες από την τελευταία προσπάθεια. Ο επανέλεγχος εμφανίζεται όταν ανοίξεις αυτή τη σελίδα.</p>
        <p className="o2-small o2-muted">Οι καταγραφές μένουν στο πρόγραμμα περιήγησης αυτής της συσκευής και δεν μεταφέρονται σε άλλη συσκευή.</p>
      </section>
      <div className="pb-4" />
    </Ormi2Shell>
  );
}
