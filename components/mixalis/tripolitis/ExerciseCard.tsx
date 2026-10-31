"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePlaying, useClock } from "@/components/mixalis/omali/shared";
import { rich } from "@/components/mixalis/ormi/AnimCard";
import { StudyMark } from "@/components/mixalis/study/StudyMark";
import { C, H, W, type Phase } from "@/components/mixalis/ormi/kit";

export type Exercise = {
  /** Book number, e.g. "4.71". Also used as the anchor id. */
  id: string;
  source: string;
  title: string;
  /** The exercise statement, transcribed. */
  statement: ReactNode;
  given: string;
  ask: string;
  period: number;
  phases: Phase[];
  Scene: (props: { t: number }) => ReactNode;
  /** Solution, one step at a time. */
  steps: { title: string; body: ReactNode }[];
  answer: ReactNode;
  remember?: ReactNode;
  legend?: ("v" | "F" | "p" | "K")[];
};

const LEGEND = {
  v: { color: C.v, label: "ταχύτητα" },
  F: { color: C.F, label: "δύναμη" },
  p: { color: C.p, label: "ορμή / Δp" },
  K: { color: C.K, label: "κινητική ενέργεια" },
} as const;

const EPS = 0.001;

export function ExerciseCard({ ex, accent = "#1f6f5c" }: { ex: Exercise; accent?: string }) {
  const [playing, setPlaying] = usePlaying(true);
  const [slow, setSlow] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [shown, setShown] = useState(0); // solution steps revealed
  const { ref, t, setT } = useClock(playing, slow ? 0.45 : 1);

  const phases = ex.phases;
  const last = phases.length - 1;
  const stepEnd = phases[stepIdx].until;

  // Each phase plays once and waits, so there is time to read the caption.
  useEffect(() => {
    if (playing && t >= stepEnd - EPS) {
      setPlaying(false);
      setT(stepEnd - EPS);
    }
  }, [playing, t, stepEnd, setPlaying, setT]);

  const tt = Math.min(t, ex.period - EPS);
  const phaseIndex = Math.max(0, phases.findIndex((p) => tt < p.until));
  const phase = phases[phaseIndex];
  const waiting = !playing && t >= stepEnd - 2 * EPS;
  const finished = waiting && stepIdx === last;

  const goTo = (i: number) => {
    setStepIdx(i);
    setT((i ? phases[i - 1].until : 0) + EPS);
    setPlaying(true);
  };
  const primary = () => {
    if (playing) setPlaying(false);
    else if (finished) goTo(0);
    else if (waiting) {
      setStepIdx(stepIdx + 1);
      setPlaying(true);
    } else setPlaying(true);
  };
  const primaryLabel = playing
    ? "❚❚ Παύση"
    : finished
      ? "↺ Ξανά από την αρχή"
      : waiting
        ? `Επόμενο βήμα ▶ (${stepIdx + 2}/${phases.length})`
        : "▶ Συνέχεια";

  const Scene = ex.Scene;
  const allShown = shown >= ex.steps.length;

  return (
    <article id={`a${ex.id.replace(".", "-")}`} data-study-lesson="ormi" data-study-id={`a${ex.id.replace(".", "-")}`} ref={ref} className="scroll-mt-24 border-t border-[#ddd5c7] pt-6">
      <header className="flex flex-wrap items-center gap-3">
        <span className="rounded-full px-3 py-1 font-mono text-sm font-bold text-white" style={{ backgroundColor: accent }}>
          {ex.id}
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-[#1c2433] sm:text-xl">{ex.title}</h3>
        <span className="ml-auto text-xs font-semibold text-[#857261]">{ex.source}</span>
      </header>

      <div className="mt-3 max-w-5xl text-[15px] leading-7 text-[#2c2825]">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#a07a3c]">Η άσκηση με λίγα λόγια</p>
        {rich(ex.statement)}
      </div>

      <dl className="mt-2 grid max-w-5xl gap-1 text-sm leading-6">
        <div>
          <dt className="inline font-semibold text-[#1c2433]">Δεδομένα: </dt>
          <dd className="inline text-[#3d4452]">{rich(ex.given)}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-[#1c2433]">Ζητάμε: </dt>
          <dd className="inline text-[#3d4452]">{rich(ex.ask)}</dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-x-[3rem] gap-y-[1.5rem] lg:grid-cols-[3fr_2fr]">
        {/* animation */}
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`Κινούμενο σχέδιο της άσκησης ${ex.id}`} fontFamily="Inter, 'Segoe UI', Roboto, Arial, sans-serif">
            {Scene({ t: tt })}
          </svg>
          <div className="px-4 pt-3 sm:px-5">
            <div className="flex gap-1">
              {phases.map((p, i) => {
                const from = i ? phases[i - 1].until : 0;
                const fill = i < phaseIndex ? 1 : i === phaseIndex ? Math.min(1, (tt - from) / (p.until - from)) : 0;
                return (
                  <button
                    type="button"
                    key={p.label}
                    onClick={() => goTo(i)}
                    className="group min-w-0 text-left"
                    style={{ flexGrow: (p.until - from) / ex.period, flexBasis: 0, minWidth: "3.2rem" }}
                  >
                    <span className="block h-1.5 overflow-hidden rounded-full bg-[#e4ddd0]">
                      <span className="block h-full rounded-full" style={{ width: `${fill * 100}%`, backgroundColor: accent }} />
                    </span>
                    <span className={`mt-1 block break-words text-[11px] font-semibold leading-tight ${i === phaseIndex ? "text-[#1c2433]" : "text-[#9aa3b2]"}`}>
                      {i + 1}. {p.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 min-h-[4.5rem] text-[15px] leading-6 text-[#2c2825]" aria-live="polite">
              {rich(phase.say)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 px-4 pb-4 sm:px-5">
            <button type="button" onClick={primary} className="rounded-full px-4 py-1.5 text-sm font-semibold text-white shadow-sm" style={{ backgroundColor: accent }}>
              {primaryLabel}
            </button>
            <button
              type="button"
              onClick={() => setSlow(!slow)}
              aria-pressed={slow}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${slow ? "bg-[#2c2825] text-white" : "border border-[#ddd5c7] bg-white text-[#4d4138] hover:bg-[#f3efe8]"}`}
            >
              🐢 Αργά
            </button>
            {ex.legend ? (
              <span className="ml-auto flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#5b6577]">
                {ex.legend.map((k) => (
                  <span key={k} className="inline-flex items-center gap-1">
                    <span className="inline-block h-[3px] w-4 rounded" style={{ backgroundColor: LEGEND[k].color }} />
                    {LEGEND[k].label}
                  </span>
                ))}
              </span>
            ) : null}
          </div>
        </div>

        {/* solution */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
            Λύση βήμα βήμα
          </p>
          {shown === 0 ? (
            <p className="mt-2 text-sm leading-6 text-[#5b6577]">Προσπάθησε πρώτα μόνος σου με τα δεδομένα. Μετά άνοιξε τη λύση ένα βήμα τη φορά.</p>
          ) : null}
          <ol className="mt-3 space-y-3">
            {ex.steps.slice(0, shown).map((s, i) => (
              <li key={s.title} className="border-l-2 border-[#cfc6b6] pl-4 text-[15px] leading-7">
                <p className="text-sm font-semibold text-[#1c2433]">
                  Βήμα {i + 1}: {rich(s.title)}
                </p>
                <div className="text-[#2c2825]">{rich(s.body)}</div>
              </li>
            ))}
          </ol>
          {allShown ? (
            <div className="mt-3 space-y-3">
              <div className="border-l-4 pl-4 text-[15px] leading-7" style={{ borderColor: accent }}>
                <p className="text-sm font-semibold" style={{ color: accent }}>
                  Απάντηση
                </p>
                <div>{rich(ex.answer)}</div>
              </div>
              {ex.remember ? (
                <div className="border-l-4 border-[#c0392b]/60 pl-4 text-sm leading-6 text-[#7a2c22]">
                  <span className="font-semibold">Τι να θυμάσαι: </span>
                  {rich(ex.remember)}
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {!allShown ? (
              <>
                <button type="button" onClick={() => setShown(shown + 1)} className="rounded-full px-4 py-1.5 text-sm font-semibold text-white" style={{ backgroundColor: accent }}>
                  {shown === 0 ? "Ξεκίνα τη λύση" : "Επόμενο βήμα λύσης"} ({shown + 1}/{ex.steps.length})
                </button>
                <button type="button" onClick={() => setShown(ex.steps.length)} className="rounded-full border border-[#ddd5c7] bg-white px-4 py-1.5 text-sm font-semibold text-[#4d4138] hover:bg-[#f3efe8]">
                  Όλη η λύση
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setShown(0)} className="rounded-full border border-[#ddd5c7] bg-white px-4 py-1.5 text-sm font-semibold text-[#4d4138] hover:bg-[#f3efe8]">
                Κρύψε τη λύση
              </button>
            )}
          </div>
        </div>
      </div>
      <StudyMark lesson="ormi" id={`a${ex.id.replace(".", "-")}`} title={`Άσκηση ${ex.id}: ${ex.title}`} path="/mixalis/ormi" className="mt-4 border-t border-[#ddd5c7] py-3" />
    </article>
  );
}
