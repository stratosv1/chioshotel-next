// Study marks shared by every Mixalis lesson: "✓ Τελείωσα" / "★ Να το ξαναδώ".
// Stored per device in localStorage. The standalone organic chemistry page
// (lib/mixalis/organiki1-html.ts) reads and writes the same keys and format.

export type StudyState = "done" | "again";
export type StudyMarkEntry = { s: StudyState; t: string; h: string; at: number };
export type StudyData = Record<string, Record<string, StudyMarkEntry>>;

export const STUDY_KEY = "mixalis-study-v1";
export const STUDY_TOTALS_KEY = "mixalis-study-total-v1";
export const STUDY_EVENT = "mixalis-study";

export const STUDY_LESSONS: Record<string, string> = {
  ormi: "Ορμή και κρούσεις",
  pedio: "Ηλεκτρικό πεδίο",
  organiki1: "Οργανική χημεία",
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage blocked (private mode): marks simply won't persist
  }
}

export function readStudy(): StudyData {
  return readJson<StudyData>(STUDY_KEY, {});
}

export function readTotals(): Record<string, number> {
  return readJson<Record<string, number>>(STUDY_TOTALS_KEY, {});
}

export function setStudyMark(lesson: string, id: string, state: StudyState | null, title: string, href: string) {
  const data = readStudy();
  const forLesson = { ...(data[lesson] ?? {}) };
  if (state) forLesson[id] = { s: state, t: title, h: href, at: Date.now() };
  else delete forLesson[id];
  data[lesson] = forLesson;
  writeJson(STUDY_KEY, data);
  window.dispatchEvent(new CustomEvent(STUDY_EVENT));
}

export function setLessonTotal(lesson: string, total: number) {
  const totals = readTotals();
  if (totals[lesson] === total) return;
  totals[lesson] = total;
  writeJson(STUDY_TOTALS_KEY, totals);
}

/** Subscribe to mark changes from this tab and from other tabs. */
export function onStudyChange(cb: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STUDY_KEY || e.key === STUDY_TOTALS_KEY) cb();
  };
  window.addEventListener(STUDY_EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(STUDY_EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}
