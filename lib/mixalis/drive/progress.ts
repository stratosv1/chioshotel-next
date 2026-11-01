// Practice record for /mixalis/drive, shared by the page and the sync API.
//
// Every answer is recorded per question. A question that was ever answered
// wrong goes to "Θέλουν δουλειά" and stays there until it is answered right
// twice in a row, with the second right answer at least RECHECK_MS after the
// first one (so it is re-checked on another day, not just repeated at once).

export type QStat = {
  /** Times answered. */
  seen: number;
  /** Times answered wrong. */
  wrong: number;
  /** Right answers in a row since the last wrong one. */
  streak: number;
  /** Time of the last answer. */
  last: number;
  /** Time of the last wrong answer. */
  wrongAt?: number;
  /** Time of the first right answer after the last wrong one. */
  fixAt?: number;
  /** Set once a missed question has been confirmed on a later check. */
  learnedAt?: number;
};

export type Stats = Record<string, QStat>;

/** Stats plus a reset marker, as stored on the server. */
export type ProgressDoc = { stats: Stats; resetAt: number };

export const RECHECK_MS = 16 * 60 * 60 * 1000; // "the next day", even for a late-night session

export type QStatus = "new" | "ok" | "work" | "recheck" | "learned";

export function statusOf(s: QStat | undefined, now = Date.now()): QStatus {
  if (!s || s.seen === 0) return "new";
  if (s.wrong === 0) return "ok";
  if (s.learnedAt) return "learned";
  if (s.streak === 0) return "work";
  return "recheck";
}

/** Still on the "Θέλουν δουλειά" list. */
export const needsWork = (s?: QStat) => !!s && s.wrong > 0 && !s.learnedAt;

/** A "recheck" question whose waiting time has passed. */
export const recheckDue = (s: QStat | undefined, now = Date.now()) =>
  !!s && needsWork(s) && s.streak > 0 && !!s.fixAt && now - s.fixAt >= RECHECK_MS;

export function recordAnswer(prev: QStat | undefined, ok: boolean, now = Date.now()): QStat {
  const p: QStat = prev ?? { seen: 0, wrong: 0, streak: 0, last: 0 };
  if (!ok) {
    return { seen: p.seen + 1, wrong: p.wrong + 1, streak: 0, last: now, wrongAt: now };
  }
  const next: QStat = { ...p, seen: p.seen + 1, streak: p.streak + 1, last: now };
  if (p.wrong > 0 && !p.learnedAt) {
    if (p.streak === 0 || !p.fixAt) next.fixAt = now;
    else if (now - p.fixAt >= RECHECK_MS) next.learnedAt = now;
  }
  return next;
}

/** Combine two records of the same learner (two devices): newest answer per question wins. */
export function mergeDocs(a: ProgressDoc, b: ProgressDoc): ProgressDoc {
  const resetAt = Math.max(a.resetAt || 0, b.resetAt || 0);
  const stats: Stats = {};
  for (const src of [a.stats, b.stats]) {
    for (const [id, s] of Object.entries(src || {})) {
      if (!isQStat(s) || s.last <= resetAt) continue;
      const cur = stats[id];
      if (!cur || s.last > cur.last || (s.last === cur.last && s.seen > cur.seen)) stats[id] = s;
    }
  }
  return { stats, resetAt };
}

export function isQStat(v: unknown): v is QStat {
  if (!v || typeof v !== "object") return false;
  const s = v as Record<string, unknown>;
  const num = (x: unknown) => typeof x === "number" && Number.isFinite(x) && x >= 0;
  const opt = (x: unknown) => x === undefined || num(x);
  return num(s.seen) && num(s.wrong) && num(s.streak) && num(s.last) && opt(s.wrongAt) && opt(s.fixAt) && opt(s.learnedAt);
}

/** Keep only well-formed entries with question-like ids. */
export function sanitizeDoc(v: unknown): ProgressDoc | null {
  if (!v || typeof v !== "object") return null;
  const raw = v as { stats?: unknown; resetAt?: unknown };
  if (!raw.stats || typeof raw.stats !== "object") return null;
  const stats: Stats = {};
  let n = 0;
  for (const [id, s] of Object.entries(raw.stats as Record<string, unknown>)) {
    if (!/^p\d{1,4}-\d{1,4}$/.test(id) || !isQStat(s)) continue;
    const { seen, wrong, streak, last, wrongAt, fixAt, learnedAt } = s;
    stats[id] = { seen, wrong, streak, last, wrongAt, fixAt, learnedAt };
    if (++n > 5000) break;
  }
  const resetAt = typeof raw.resetAt === "number" && Number.isFinite(raw.resetAt) ? raw.resetAt : 0;
  return { stats, resetAt };
}
