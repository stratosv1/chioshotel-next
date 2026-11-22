/**
 * Ορμή 2 — deterministic adaptive recommendations.
 * No network dependency, no AI-generated grading.
 * Skill events are recorded ONLY after the learner finishes a problem.
 * Older learning histories are left untouched; diagnostic evidence cannot be
 * retroactively reconstructed from an aggregate success counter.
 */
export type SkillId =
  | "phases" | "laws" | "strategy" | "momentum" | "work"
  | "mechanical" | "elastic" | "projectile" | "impulse"
  | "loss" | "signs" | "bridge";

export type SkillEvent = {
  v: 1;
  source: "phases" | "numeric";
  item: string;
  skill: SkillId;
  correct: boolean;
  independent: boolean;
  hints: number;
  mistakes: number;
  at: number;
};

export type SkillOverview = {
  skill: SkillId;
  label: string;
  attempts: number;
  independent: number;
  guided: number;
  unresolved: number;
  distinctItems: number;
  score: number;
  lastAt: number;
  state: "not-started" | "learning" | "practice" | "strong";
};

export const SKILLS: { id: SkillId; label: string; description: string }[] = [
  { id: "phases", label: "Διάκριση φάσεων", description: "Πού αλλάζει το φυσικό φαινόμενο;" },
  { id: "laws", label: "Επιλογή νόμων", description: "Ποιο εργαλείο ταιριάζει σε κάθε φάση;" },
  { id: "strategy", label: "Σειρά επίλυσης", description: "Ξεκινώ από τη σωστή γνωστή ποσότητα." },
  { id: "momentum", label: "Αρχή διατήρησης ορμής", description: "Σύστημα, άξονας, εξωτερική ώθηση." },
  { id: "work", label: "Θεώρημα έργου–ενέργειας", description: "Τριβή, έργο και μεταβολή κινητικής." },
  { id: "mechanical", label: "Μηχανική ενέργεια", description: "Μετατροπή δυναμικής και κινητικής." },
  { id: "elastic", label: "Ελαστική κρούση", description: "ΑΔΟ και διατήρηση κινητικής μαζί." },
  { id: "projectile", label: "Οριζόντια βολή", description: "Χρόνος πτώσης και βεληνεκές." },
  { id: "impulse", label: "Ώθηση και δύναμη", description: "Δp, μέση δύναμη, χρόνος επαφής." },
  { id: "loss", label: "Απώλεια ενέργειας", description: "Πριν/μετά την κρούση, όχι άλλη φάση." },
  { id: "signs", label: "Πρόσημα και φορά", description: "Διανύσματα και αντίθετη κίνηση." },
  { id: "bridge", label: "Σύνδεση φάσεων", description: "Πώς μεταφέρω το άγνωστο στην επόμενη εξίσωση;" },
];

export const SKILL_EVENT_KEY = "mixalis-ormi2-skill-events-v1";
export const SKILL_CHANGED_EVENT = "mixalis-ormi2-skill-progress";
export const MAX_EVENTS = 600;
const IDS = new Set(SKILLS.map((s) => s.id));
const SOURCE_IDS = new Set(["phases", "numeric"]);

export function normalizeSkillEvents(input: unknown): SkillEvent[] {
  if (!Array.isArray(input)) return [];
  return input.filter((e): e is SkillEvent =>
    e && typeof e === "object" && e.v === 1 &&
    SOURCE_IDS.has(e.source) && typeof e.item === "string" &&
    e.item.length > 0 && e.item.length <= 160 &&
    IDS.has(e.skill) && typeof e.correct === "boolean" &&
    typeof e.independent === "boolean" &&
    Number.isInteger(e.hints) && e.hints >= 0 && e.hints <= 50 &&
    Number.isInteger(e.mistakes) && e.mistakes >= 0 && e.mistakes <= 200 &&
    typeof e.at === "number" && Number.isFinite(e.at) && e.at > 0
  ).slice(-MAX_EVENTS);
}

export function readSkillEvents(): SkillEvent[] {
  if (typeof window === "undefined") return [];
  try { return normalizeSkillEvents(JSON.parse(window.localStorage.getItem(SKILL_EVENT_KEY) ?? "[]")); }
  catch { return []; }
}

export function appendSkillEvents(next: SkillEvent[]): void {
  if (typeof window === "undefined" || next.length === 0) return;
  try {
    const all = normalizeSkillEvents([...readSkillEvents(), ...next]);
    window.localStorage.setItem(SKILL_EVENT_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event(SKILL_CHANGED_EVENT));
  } catch { /* storage is optional, learning interactions still work */ }
}

export function phaseSkillEvents(
  scenario: string,
  result: Record<"cuts" | "laws" | "start", boolean | null>,
  hintLevels: Record<"cuts" | "laws" | "start", number>,
  timestamp: number,
): SkillEvent[] {
  return ([
    ["cuts", "phases"],
    ["laws", "laws"],
    ["start", "strategy"],
  ] as const).map(([key, skill]) => ({
    v: 1 as const, source: "phases" as const, item: scenario,
    skill, correct: result[key] === true,
    independent: result[key] === true && hintLevels[key] === 0,
    hints: hintLevels[key], mistakes: result[key] === false ? 1 : 0,
    at: timestamp,
  }));
}

/** Manual classification avoids unreliable keyword guesses about physical laws. */
export const NUMERIC_STEP_SKILLS: Record<string, Record<string, SkillId[]>> = {
  "stick-friction": {
    V: ["work", "bridge"], u: ["momentum", "strategy"], Q: ["loss"],
  },
  ballistic: {
    V: ["mechanical", "strategy"], u: ["momentum", "bridge"], loss: ["loss"],
  },
  "pass-edge": {
    t: ["projectile"], V: ["projectile", "bridge"],
    uout: ["momentum", "bridge"], Q: ["loss"],
  },
  "elastic-ramp": {
    v1: ["elastic", "signs"], v2: ["elastic"], h: ["mechanical", "bridge"],
  },
  "friction-collision-flight": {
    before: ["work"], V: ["momentum", "bridge"], x: ["projectile", "bridge"],
  },
  "bounce-force": {
    down: ["mechanical"], up: ["mechanical"], F: ["impulse", "signs", "bridge"],
  },
  "spring-explosion": {
    v2: ["momentum", "mechanical"], v1: ["momentum", "signs"],
    V: ["momentum", "bridge"], Q: ["loss"],
  },
  "pendulum-elastic-spring": {
    u: ["mechanical"], v1: ["elastic", "signs"],
    v2: ["elastic"], x: ["mechanical", "bridge"],
  },
};

export type StepEvidence = {
  stepId: string;
  mistakes: number;
  hints: number;
  revealed: boolean;
  correct: boolean;
};

export function numericSkillEvents(
  familyId: string, variant: string, steps: StepEvidence[], timestamp: number,
): SkillEvent[] {
  return steps.flatMap((step) => {
    const skills = NUMERIC_STEP_SKILLS[familyId]?.[step.stepId] ?? [];
    return skills.map((skill) => ({
      v: 1 as const,
      source: "numeric" as const,
      item: familyId + ":" + variant,
      skill,
      correct: step.correct && !step.revealed,
      independent: step.correct && step.mistakes === 0 && step.hints === 0 && !step.revealed,
      hints: step.hints,
      mistakes: step.mistakes,
      at: timestamp,
    }));
  });
}

export function summarizeSkills(events: SkillEvent[]): SkillOverview[] {
  const safe = normalizeSkillEvents(events);
  return SKILLS.map(({ id, label }) => {
    const group = safe.filter((e) => e.skill === id);
    const attempts = group.length;
    const independent = group.filter((e) => e.independent).length;
    const guided = group.filter((e) => e.correct && !e.independent).length;
    const unresolved = attempts - independent - guided;
    const score = attempts ? Math.round((independent + guided * 0.5) / attempts * 100) : 0;
    const distinctIndependent = new Set(group.filter((e) => e.independent).map((e) => e.item)).size;
    const state: SkillOverview["state"] = !attempts
      ? "not-started"
      : distinctIndependent >= 2 && score >= 75 && unresolved === 0
        ? "strong"
        : independent >= 1 && score >= 60 && unresolved === 0
          ? "learning"
          : "practice";
    return {
      skill: id, label, attempts, independent, guided, unresolved,
      distinctItems: new Set(group.map((e) => e.item)).size,
      score, lastAt: group.reduce((best, e) => Math.max(best, e.at), 0), state,
    };
  });
}

export function nextSkillForPractice(
  summary: SkillOverview[], now = Date.now(),
): SkillOverview | null {
  const observed = summary.filter((s) => s.attempts > 0 && s.state !== "strong");
  if (observed.length) {
    return observed.sort((a, b) =>
      (a.score - b.score) || (b.unresolved - a.unresolved) || (a.lastAt - b.lastAt)
    )[0];
  }
  const due = summary.filter((s) => s.state === "strong" && now - s.lastAt >= 3 * 86400000);
  if (due.length) return due.sort((a, b) => a.lastAt - b.lastAt)[0];
  return summary.find((s) => s.attempts === 0) ?? summary[0] ?? null;
}
