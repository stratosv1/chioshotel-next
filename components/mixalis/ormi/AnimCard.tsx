"use client";

import { Children, cloneElement, isValidElement, useState, type ReactNode } from "react";
import { usePlaying, useClock } from "@/components/mixalis/omali/shared";
import { C, H, W, type Case } from "./kit";

/** Turns "υ_1", "F_μ" or "p_{ολ,πριν}" inside plain text into real subscripts. */
function rich(node: ReactNode): ReactNode {
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

export function AnimCard({ data, accent }: { data: Case; accent: string }) {
  const [playing, setPlaying] = usePlaying(true);
  const [slow, setSlow] = useState(false);
  const { ref, t, setT } = useClock(playing, slow ? 0.45 : 1);
  const tt = t % data.period;
  const phaseIndex = Math.max(0, data.phases.findIndex((p) => tt < p.until));
  const phase = data.phases[phaseIndex];
  const Scene = data.Scene;

  return (
    <article
      id={`k${data.n}`}
      ref={ref}
      className="scroll-mt-24 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm"
    >
      <header className="flex items-center gap-3 px-4 pt-4 sm:px-5">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: accent }}
        >
          {data.n}
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-[#1c2433]">{data.title}</h3>
      </header>

      <p className="mt-2 px-4 text-[15px] leading-6 text-[#3d4452] sm:px-5">
        <span className="font-semibold" style={{ color: accent }}>
          Τι βλέπεις:{" "}
        </span>
        {data.what}
      </p>

      <div className="mt-3 border-y border-black/5 bg-[#fbfaf7]">
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
      <div className="px-4 pt-3 sm:px-5">
        <div className="flex gap-1">
          {data.phases.map((p, i) => {
            const from = i ? data.phases[i - 1].until : 0;
            const share = (p.until - from) / data.period;
            const fill = i < phaseIndex ? 1 : i === phaseIndex ? (tt - from) / (p.until - from) : 0;
            return (
              <button
                type="button"
                key={p.label}
                onClick={() => setT(from + 0.001)}
                className="group min-w-0 text-left"
                style={{ flexGrow: share, flexBasis: 0 }}
                title={`Πήγαινε στη φάση: ${p.label}`}
              >
                <span className="block h-1.5 overflow-hidden rounded-full bg-black/10">
                  <span className="block h-full rounded-full" style={{ width: `${fill * 100}%`, backgroundColor: accent }} />
                </span>
                <span
                  className={`mt-1 block truncate text-[11px] font-semibold ${i === phaseIndex ? "text-[#1c2433]" : "text-[#9aa3b2] group-hover:text-[#5b6577]"}`}
                >
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 min-h-[4.5rem] text-[15px] leading-6 text-[#2c2825]" aria-live="polite">
          {rich(phase.say)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-4 pb-3 sm:px-5">
        <button
          type="button"
          onClick={() => setPlaying(!playing)}
          className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm"
          style={{ backgroundColor: accent }}
        >
          {playing ? "❚❚ Παύση" : "▶ Κίνηση"}
        </button>
        <button
          type="button"
          onClick={() => setT(0)}
          className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-sm font-semibold text-[#4d4138] hover:bg-[#f3efe8]"
        >
          ↺ Από την αρχή
        </button>
        <button
          type="button"
          onClick={() => setSlow(!slow)}
          aria-pressed={slow}
          className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${
            slow ? "bg-[#2c2825] text-white" : "border border-black/10 bg-white text-[#4d4138] hover:bg-[#f3efe8]"
          }`}
        >
          🐢 Αργά
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

      <div className="space-y-2 border-t border-black/5 bg-[#fbf8f3] px-4 py-3 text-sm leading-6 sm:px-5">
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
    </article>
  );
}
