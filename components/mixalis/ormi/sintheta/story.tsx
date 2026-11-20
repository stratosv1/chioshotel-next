"use client";

import type { ReactNode } from "react";
import { C, H, T, W, lerp, seg, type Case, type Phase } from "../kit";

/**
 * Παρουσίαση σύνθετης άσκησης (owner, 2026-11-20): το φαινόμενο παίζει ολόκληρο,
 * μετά «τι ζητάει», μετά κάθε φάση ξαναπαίζει με το εργαλείο της και το γιατί,
 * και στο τέλος η σειρά λύσης. Χρησιμοποιεί το ίδιο AnimCard με το τυπολόγιο.
 */

export type Ctx = { mode: "play" | "ask" | "phase" | "order"; phase: number };

export type Story = {
  n: number;
  title: string;
  what: string;
  given: string;
  ask: string;
  playSay: string;
  askSay: string;
  /** Μία εγγραφή ανά φάση του φαινομένου. */
  phases: { name: string; tool: string; range: [number, number]; say: string }[];
  /** Σειρά λύσης (indexes των φάσεων). */
  order: number[];
  orderSay: string;
  solve: ReactNode;
  trap?: string;
  draw: (tau: number, ctx: Ctx) => ReactNode;
};

const T_PLAY = 5;
const T_ASK = 3;
const T_PHASE = 4.5;
const T_ORDER = 3;

const TOOL_COLOR = "#6b4fa0";

function Banner({ s, color = TOOL_COLOR }: { s: string; color?: string }) {
  const w = Math.min(W - 12, s.length * 7.6 + 20);
  return (
    <g>
      <rect x={6} y={5} width={w} height={19} rx={9.5} fill={color} opacity={0.95} />
      <T x={15} y={18.5} s={s} size={11} color="#ffffff" anchor="start" />
    </g>
  );
}

function OrderOverlay({ story }: { story: Story }) {
  const lines = story.order.map((p, k) => `${k + 1}ο → Φάση ${p + 1} (${story.phases[p].name}): ${story.phases[p].tool}`);
  const top = 40;
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="#ffffff" opacity={0.86} />
      <T x={W / 2} y={top} s="Με ποια σειρά λύνω;" size={13} color={C.ink} />
      {lines.map((line, i) => (
        <g key={i}>
          <rect x={18} y={top + 14 + i * 30} width={W - 36} height={24} rx={12} fill={i === 0 ? TOOL_COLOR : "#f1edf8"} />
          <T x={30} y={top + 30 + i * 30} s={line} size={10.5} color={i === 0 ? "#ffffff" : C.ink} anchor="start" />
          {i < lines.length - 1 ? <T x={W / 2} y={top + 46 + i * 30} s="↓" size={10} color={TOOL_COLOR} /> : null}
        </g>
      ))}
    </g>
  );
}

/** Mark for an unknown: «x = ?» in a soft red pill. */
export function Ask({ x, y, s }: { x: number; y: number; s: string }) {
  const w = s.length * 6.4 + 14;
  return (
    <g>
      <rect x={x - w / 2} y={y - 12} width={w} height={17} rx={8.5} fill="#fff1e9" stroke="#ae583a" strokeWidth={1} />
      <T x={x} y={y + 1} s={s} size={10.5} color="#9e4a2a" />
    </g>
  );
}

/** Given value marker in green. */
export function Given({ x, y, s, anchor = "middle" }: { x: number; y: number; s: string; anchor?: "start" | "middle" | "end" }) {
  return <T x={x} y={y} s={s} size={10} color={C.p} anchor={anchor} />;
}

export function makeCase(story: Story): Case {
  const phaseStart = T_PLAY + T_ASK;
  const orderStart = phaseStart + story.phases.length * T_PHASE;
  const period = orderStart + T_ORDER;

  const phases: Phase[] = [
    { until: T_PLAY, label: "Τι συμβαίνει", say: story.playSay },
    { until: phaseStart, label: "Τι ζητάει", say: story.askSay },
    ...story.phases.map((p, i) => ({
      until: phaseStart + (i + 1) * T_PHASE,
      label: `Φάση ${i + 1}: ${p.name}`,
      say: `${p.tool} — ${p.say}`,
    })),
    { until: period, label: "Σειρά λύσης", say: story.orderSay },
  ];

  const Scene = ({ t }: { t: number }) => {
    if (t < T_PLAY) {
      return (
        <g>
          {story.draw(seg(t, 0, T_PLAY - 0.4), { mode: "play", phase: -1 })}
          <Banner s="Το φαινόμενο" color={C.muted} />
        </g>
      );
    }
    if (t < phaseStart) {
      return (
        <g>
          {story.draw(1, { mode: "ask", phase: -1 })}
          <Banner s="Τι ζητάει η άσκηση;" color="#ae583a" />
        </g>
      );
    }
    if (t < orderStart) {
      const i = Math.min(story.phases.length - 1, Math.floor((t - phaseStart) / T_PHASE));
      const from = phaseStart + i * T_PHASE;
      const [a, b] = story.phases[i].range;
      const tau = lerp(a, b, seg(t, from + 0.3, from + T_PHASE - 0.6));
      return (
        <g>
          {story.draw(tau, { mode: "phase", phase: i })}
          <Banner s={`Φάση ${i + 1} · ${story.phases[i].name} → ${story.phases[i].tool}`} />
        </g>
      );
    }
    return (
      <g>
        {story.draw(1, { mode: "order", phase: -1 })}
        <OrderOverlay story={story} />
      </g>
    );
  };

  return {
    n: story.n,
    title: story.title,
    what: story.what,
    given: story.given,
    ask: story.ask,
    period,
    phases,
    Scene,
    solve: story.solve,
    trap: story.trap,
    legend: ["v", "F"],
  };
}
