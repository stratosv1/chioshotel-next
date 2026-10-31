"use client";

import { Children, cloneElement, isValidElement, useEffect, useState, type ReactNode } from "react";
import { StudyMark } from "@/components/mixalis/study/StudyMark";
import { usePlaying, useClock } from "@/components/mixalis/omali/shared";
import { C, H, W, type Case } from "./kit";

/** Turns "υ_1", "F_μ" or "p_{ολ,πριν}" inside plain text into real subscripts. */
export function rich(node: ReactNode): ReactNode {
  if (typeof node === "string") {
    const out: ReactNode[] = [];
    const re = /_\{([^}]*)\}|_([\p{L}\p{N}]+)/gu;
    let last = 0;
    let m: RegExpExecArray | null;
    let i = 0;
    while ((m = re.exec(node))) {
      if (m.index > last) out.push(node.slice(last, m.index));
      out.push(<sub key={i++}>{m[1] ?? m[2]}</sub>);
      last = m.index + m[0].length;
    }
    if (!out.length) return node;
    if (last < node.length) out.push(node.slice(last));
    return out;
  }
  if (Array.isArray(node)) return node.map((n, i) => <span key={i}>{rich(n)}</span>);
  if (isValidElement<{ children?: ReactNode }>(node) && node.props.children !== undefined) {
    return cloneElement(node, undefined, Children.map(node.props.children, (c) => rich(c)));
  }
  return node;
}

const LEGEND = {
  v: { color: C.v, label: "ταχύτητα" },
  F: { color: C.F, label: "δύναμη" },
  p: { color: C.p, label: "ορμή / Δp" },
  K: { color: C.K, label: "κινητική ενέργεια" },
} as const;

const EPS = 0.001;

export function AnimCard({ data, accent, study }: { data: Case; accent: string; study?: { lesson: string; path: string } }) {
  const [playing, setPlaying] = usePlaying(true);
  const [slow, setSlow] = useState(false);
  // "step": each phase plays once and waits, so there is time to read. "loop": plays non-stop.
  const [mode, setMode] = useState<"step" | "loop">("step");
  const [stepIdx, setStepIdx] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const { ref, t, setT } = useClock(playing, slow ? 0.45 : 1);

  const phases = data.phases;
  const last = phases.length - 1;
  const stepEnd = phases[stepIdx].until;

  // In step mode, stop at the end of the current phase.
  useEffect(() => {
    if (mode === "step" && playing && t >= stepEnd - EPS) {
      setPlaying(false);
      setT(stepEnd - EPS);
    }
  }, [mode, playing, t, stepEnd, setPlaying, setT]);

  const tt = mode === "loop" ? t % data.period : Math.min(t, data.period - EPS);
  const phaseIndex = Math.max(0, phases.findIndex((p) => tt < p.until));
  const phase = phases[phaseIndex];
  const waiting = mode === "step" && !playing && t >= stepEnd - 2 * EPS;
  const finished = waiting && stepIdx === last;

  useEffect(() => {
    if (finished) setShowSolution(true);
  }, [finished]);

  const goTo = (i: number) => {
    const from = i ? phases[i - 1].until : 0;
    setStepIdx(i);
    setT(from + EPS);
    setPlaying(true);
  };

  const primary = () => {
    if (mode === "loop") {
      setPlaying(!playing);
      return;
    }
    if (playing) {
      setPlaying(false);
    } else if (finished) {
      goTo(0);
    } else if (waiting) {
      setStepIdx(stepIdx + 1);
      setPlaying(true);
    } else {
      setPlaying(true);
    }
  };

  const primaryLabel =
    mode === "loop"
      ? playing
        ? "❚❚ Παύση"
        : "▶ Κίνηση"
      : playing
        ? "❚❚ Παύση"
        : finished
          ? "↺ Ξανά από την αρχή"
          : waiting
            ? `Επόμενο βήμα ▶ (${stepIdx + 2}/${phases.length})`
            : "▶ Συνέχεια";

  const switchMode = () => {
    if (mode === "step") {
      setMode("loop");
      setPlaying(true);
    } else {
      setMode("step");
      goTo(0);
    }
  };

  const Scene = data.Scene;

  return (
    <article
      id={`k${data.n}`}
      data-study-lesson={study?.lesson}
      data-study-id={study ? `k${data.n}` : undefined}
      ref={ref}
      className="scroll-mt-24"
    >
      <header className="flex items-center gap-3">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: accent }}
        >
          {data.n}
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-[#1c2433]">{data.title}</h3>
      </header>

      <p className="mt-2 text-[15px] leading-6 text-[#3d4452]">
        <span className="font-semibold" style={{ color: accent }}>
          Τι βλέπεις:{" "}
        </span>
        {data.what}
      </p>

      <dl className="mt-2 grid gap-1 text-sm leading-6">
        <div>
          <dt className="inline font-semibold text-[#1c2433]">Δεδομένα: </dt>
          <dd className="inline text-[#3d4452]">{rich(data.given)}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-[#1c2433]">Ζητάμε: </dt>
          <dd className="inline text-[#3d4452]">{rich(data.ask)}</dd>
        </div>
      </dl>

      <div className="mt-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full"
          role="img"
          aria-label={`Κινούμενο σχέδιο: ${data.title}`}
          fontFamily="Inter, 'Segoe UI', Roboto, Arial, sans-serif"
        >
          {Scene({ t: tt })}
        </svg>
      </div>

      {/* phase timeline */}
      <div className="pt-2">
        <div className="flex gap-1">
          {phases.map((p, i) => {
            const from = i ? phases[i - 1].until : 0;
            const share = (p.until - from) / data.period;
            const fill = i < phaseIndex ? 1 : i === phaseIndex ? Math.min(1, (tt - from) / (p.until - from)) : 0;
            return (
              <button
                type="button"
                key={p.label}
                onClick={() => goTo(i)}
                className="group min-w-0 text-left"
                style={{ flexGrow: share, flexBasis: 0, minWidth: "3.2rem" }}
                title={`Πήγαινε στο βήμα: ${p.label}`}
              >
                <span className="block h-1.5 overflow-hidden rounded-full bg-[#e4ddd0]">
                  <span className="block h-full rounded-full" style={{ width: `${fill * 100}%`, backgroundColor: accent }} />
                </span>
                <span
                  className={`mt-1 block break-words text-[11px] font-semibold leading-tight ${
                    i === phaseIndex ? "text-[#1c2433]" : "text-[#9aa3b2] group-hover:text-[#5b6577]"
                  }`}
                >
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

      <div className="flex flex-wrap items-center gap-2 pb-3">
        <button
          type="button"
          onClick={primary}
          className="rounded-full px-4 py-1.5 text-sm font-semibold text-white shadow-sm"
          style={{ backgroundColor: accent }}
        >
          {primaryLabel}
        </button>
        <button
          type="button"
          onClick={() => setSlow(!slow)}
          aria-pressed={slow}
          className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${
            slow ? "bg-[#2c2825] text-white" : "border border-[#ddd5c7] bg-white text-[#4d4138] hover:bg-[#f3efe8]"
          }`}
        >
          🐢 Αργά
        </button>
        <button
          type="button"
          onClick={switchMode}
          className="rounded-full border border-[#ddd5c7] bg-white px-3.5 py-1.5 text-sm font-semibold text-[#4d4138] hover:bg-[#f3efe8]"
          title={mode === "step" ? "Να παίζει συνέχεια, χωρίς στάσεις" : "Να σταματά μετά από κάθε βήμα"}
        >
          {mode === "step" ? "∞ Συνεχόμενα" : "⏯ Βήμα-βήμα"}
        </button>
        {data.legend ? (
          <span className="ml-auto flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#5b6577]">
            {data.legend.map((k) => (
              <span key={k} className="inline-flex items-center gap-1">
                <span className="inline-block h-[3px] w-4 rounded" style={{ backgroundColor: LEGEND[k].color }} />
                {LEGEND[k].label}
              </span>
            ))}
          </span>
        ) : null}
      </div>

      <div className="border-t border-[#ddd5c7] py-3 text-sm leading-6">
        {showSolution ? (
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-[#1f9d55]">Γράφεις: </span>
              {rich(data.solve)}
            </p>
            {data.trap ? (
              <p className="text-[#7a2c22]">
                <span className="font-semibold">Προσοχή: </span>
                {rich(data.trap)}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[#5b6577]">Προσπάθησε πρώτα να το λύσεις με τα δεδομένα. Η λύση ανοίγει και μόνη της στο τέλος.</p>
            <button
              type="button"
              onClick={() => setShowSolution(true)}
              className="rounded-full border border-[#1f9d55]/40 bg-white px-3.5 py-1 text-sm font-semibold text-[#1f9d55] hover:bg-[#ecf7f0]"
            >
              Δείξε τη λύση
            </button>
          </div>
        )}
      </div>
      {study ? (
        <StudyMark lesson={study.lesson} id={`k${data.n}`} title={`${data.n}. ${data.title}`} path={study.path} className="border-t border-[#ddd5c7] py-3" />
      ) : null}
    </article>
  );
}
