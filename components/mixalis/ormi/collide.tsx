"use client";

import { Bars, Box, C, Ground, Heat, T, Tag, Vec, bump, type BarItem } from "./kit";

const W_FRAME = 360;

export type Collision = {
  m1: number;
  m2: number;
  /** velocities just before (m/s, + to the right) */
  u1: number;
  u2: number;
  /** velocities just after; for a plastic collision v1 = v2 = V */
  v1: number;
  v2: number;
  stick?: boolean;
  labels?: [string, string];
  /** start of contact and its (slow-motion) duration, in animation seconds */
  tc?: number;
  dc?: number;
  /** px per (m/s · s) */
  S?: number;
  /** x where the faces touch */
  X?: number;
  groundY?: number;
  /** @deprecated sizes now follow the masses; kept so older configs still type-check */
  widths?: [number, number];
  showK?: boolean;
  barMax?: number;
  pUnit?: string;
  kUnit?: string;
  system?: boolean;
  /** caption shown during contact (default «κρούση · αργή κίνηση») */
  tag?: string;
  /** px per m/s for velocity arrows (default 9) */
  vs?: number;
};

/** Positions and velocities of both bodies at animation time t. */
export function collisionState(c: Collision, t: number) {
  const tc = c.tc ?? 2;
  const dc = c.dc ?? 0.7;
  const S = c.S ?? 14;
  const X = c.X ?? 180;
  const vs = c.vs ?? 9;
  // Size follows mass (same rule for every case): equal masses look identical, the heavier body is bigger.
  const ref = Math.max(c.m1, c.m2);
  const size = (m: number) => ({ w: Math.round(24 + 22 * Math.sqrt(m / ref)), h: Math.round(16 + 14 * Math.sqrt(m / ref)) });
  const { w: w1, h: h1 } = size(c.m1);
  const { w: w2, h: h2 } = size(c.m2);
  let x1: number;
  let x2: number;
  let s1: number;
  let s2: number;
  let phase: "before" | "contact" | "after";
  if (t < tc) {
    phase = "before";
    x1 = X - w1 / 2 - S * c.u1 * (tc - t);
    x2 = X + w2 / 2 - S * c.u2 * (tc - t);
    s1 = c.u1;
    s2 = c.u2;
  } else if (t < tc + dc) {
    phase = "contact";
    const k = (t - tc) / dc;
    x1 = X - w1 / 2;
    x2 = X + w2 / 2;
    // during contact both velocities change smoothly while momentum stays fixed
    s1 = c.u1 + (c.v1 - c.u1) * k;
    s2 = c.u2 + (c.v2 - c.u2) * k;
  } else {
    phase = "after";
    // Stop drifting before a body (or its arrow) leaves the 360 px frame,
    // so the frame where the step pauses still shows both bodies.
    const room = (x: number, v: number, half: number) =>
      v > 0.01 ? (W_FRAME - 12 - (x + half) - v * vs) / (S * v) : v < -0.01 ? (x - half - 12 - Math.abs(v) * vs) / (S * Math.abs(v)) : Infinity;
    const dtMax = Math.max(0, Math.min(room(X - w1 / 2, c.v1, w1 / 2), room(X + w2 / 2, c.v2, w2 / 2)));
    const dt = Math.min(t - tc - dc, dtMax);
    x1 = X - w1 / 2 + S * c.v1 * dt;
    x2 = X + w2 / 2 + S * c.v2 * dt;
    s1 = c.v1;
    s2 = c.v2;
  }
  return { x1, x2, s1, s2, phase, tc, dc, w1, w2, h1, h2 };
}

export function CollisionScene({ c, t, extra }: { c: Collision; t: number; extra?: React.ReactNode }) {
  const st = collisionState(c, t);
  const vs = c.vs ?? 9;
  const gy = c.groundY ?? 104;
  const [l1, l2] = c.labels ?? ["m_1", "m_2"];
  const force = bump(t, st.tc, st.tc + st.dc);
  const after = st.phase === "after";
  const K = (m: number, v: number) => 0.5 * m * v * v;
  const Kb = K(c.m1, c.u1) + K(c.m2, c.u2);
  const Ka = K(c.m1, st.s1) + K(c.m2, st.s2);
  const p1 = c.m1 * st.s1;
  const p2 = c.m2 * st.s2;
  const items: BarItem[] = [
    { label: `p_${l1.replace("m_", "")}`, value: p1, unit: c.pUnit },
    { label: `p_${l2.replace("m_", "")}`, value: p2, unit: c.pUnit },
    { label: "p_{ολ}", value: p1 + p2, color: C.ink, unit: c.pUnit },
  ];
  if (c.showK) items.push({ label: "K_{ολ}", value: Ka, color: C.K, unit: c.kUnit ?? "J" });
  const pmax = c.barMax ?? Math.max(Math.abs(c.m1 * c.u1), Math.abs(c.m2 * c.u2), Math.abs(c.m1 * c.u1 + c.m2 * c.u2), Kb * (c.showK ? 1 : 0)) * 1.1;
  const lost = Math.max(0, Kb - Ka);
  const vy = gy - 34;
  return (
    <g>
      <Ground y={gy} />
      {c.system ? (
        <g>
          <rect x={10} y={gy - 64} width={340} height={70} rx={10} fill="none" stroke={C.muted} strokeDasharray="5 4" />
          <T x={18} y={gy - 52} s="σύστημα (ΣF_{εξ} = 0)" size={9.5} color={C.muted} anchor="start" bold={false} />
        </g>
      ) : null}
      {c.stick && after ? (
        <g>
          <Box cx={st.x1} y={gy} w={st.w1} h={st.h1} fill={C.b1} label={l1} />
          <Box cx={st.x2} y={gy} w={st.w2} h={st.h2} fill={C.b2} label={l2} />
          <Vec x={st.x2 + st.w2 / 2 + 2} y={vy} dx={st.s1 * vs} label="V" />
          {Math.abs(st.s1) < 0.05 ? <T x={(st.x1 + st.x2) / 2} y={vy - 4} s="V = 0" size={11} color={C.v} italic /> : null}
        </g>
      ) : (
        <g>
          <Box cx={st.x1} y={gy} w={st.w1} h={st.h1} fill={C.b1} label={l1} />
          <Box cx={st.x2} y={gy} w={st.w2} h={st.h2} fill={C.b2} label={l2} />
          <Vec
            x={st.s1 >= 0 ? st.x1 - st.w1 / 2 : st.x1 + st.w1 / 2}
            y={vy}
            dx={st.s1 * vs}
            label={after ? `υ′_${l1.replace("m_", "")}` : `υ_${l1.replace("m_", "")}`}
            opacity={st.phase === "contact" ? 0.5 : 1}
          />
          <Vec
            x={st.s2 >= 0 ? st.x2 - st.w2 / 2 : st.x2 + st.w2 / 2}
            y={vy - 12}
            dx={st.s2 * vs}
            label={after ? `υ′_${l2.replace("m_", "")}` : `υ_${l2.replace("m_", "")}`}
            opacity={st.phase === "contact" ? 0.5 : 1}
          />
        </g>
      )}
      {force > 0.02 ? (
        <g>
          <Vec x={st.x2 - st.w2 / 2} y={gy - 12} dx={force * 46} color={C.F} label="F" width={3.2} labelSide="below" />
          <Vec x={st.x1 + st.w1 / 2} y={gy - 12} dx={-force * 46} color={C.F} label="−F" width={3.2} labelSide="below" />
        </g>
      ) : null}
      <Tag x={14} y={22} s={c.tag ?? "κρούση · αργή κίνηση"} color={C.F} show={st.phase === "contact"} />
      {c.showK ? <Heat cx={(st.x1 + st.x2) / 2} cy={gy - 30} k={after ? Math.min(1, lost / Math.max(1e-6, Kb)) * 2 : 0} /> : null}
      {extra}
      <Bars y={gy + 32} max={pmax} items={items} unit="kg·m/s" />
    </g>
  );
}
