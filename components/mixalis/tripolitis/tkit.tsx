"use client";

import type { ReactNode } from "react";
import { Box, C, Ground, T, Vec, clamp, num, seg } from "@/components/mixalis/ormi/kit";
import type { Exercise } from "./ExerciseCard";

/** Builds an exercise; the period is the end of the last phase. */
export function ex(o: Omit<Exercise, "period">): Exercise {
  return { ...o, period: o.phases[o.phases.length - 1].until };
}

/** Physical time τ (s) shown during animation window [a, b] that covers [τ0, τ1]. */
export const tau = (t: number, a: number, b: number, t0: number, t1: number) => t0 + (t1 - t0) * seg(t, a, b);

/** Displacement ∫ v dτ from 0 to τ (numeric, good enough for drawings). */
export function disp(v: (s: number) => number, s: number, n = 60) {
  if (s <= 0) return 0;
  const h = s / n;
  let x = 0;
  for (let i = 0; i < n; i++) x += v((i + 0.5) * h) * h;
  return x;
}

/** Text lines at the bottom-left of a scene (read-outs). */
export function Lines({ x = 12, y, lines, size = 11 }: { x?: number; y: number; lines: { s: string; color?: string }[]; size?: number }) {
  return (
    <g>
      {lines.map((l, i) => (
        <T key={i} x={x} y={y + i * (size + 5)} s={l.s} size={size} color={l.color ?? C.ink} anchor="start" bold={false} />
      ))}
    </g>
  );
}

/** A clock badge "t = 2,5 s". */
export function Clock({ x = W2 - 8, y = 18, s }: { x?: number; y?: number; s: number }) {
  return <T x={x} y={y} s={`t = ${num(s, 2)} s`} size={11} color={C.muted} anchor="end" />;
}
const W2 = 360;

export type F1 = { f: number; label: string; color?: string; y?: number };

/**
 * A box on a floor with its velocity arrow and any horizontal forces.
 * Forces with f > 0 point right. vs/fs: px per m/s and per N.
 */
export function Body({
  x,
  gy,
  v,
  vs = 6,
  forces = [],
  fs = 3,
  w = 34,
  h = 26,
  label,
  fill = C.b1,
  vLabel = "υ",
}: {
  x: number;
  gy: number;
  v: number;
  vs?: number;
  forces?: F1[];
  fs?: number;
  w?: number;
  h?: number;
  label?: string;
  fill?: string;
  vLabel?: string;
}) {
  return (
    <g>
      <Box cx={x} y={gy} w={w} h={h} fill={fill} label={label} />
      <Vec x={v >= 0 ? x + w / 2 : x - w / 2} y={gy - h - 16} dx={v * vs} label={vLabel} />
      {forces.map((F, i) => (
        <Vec
          key={i}
          x={F.f >= 0 ? x + w / 2 : x - w / 2}
          y={F.y ?? gy - h / 2}
          dx={F.f * fs}
          color={F.color ?? C.F}
          label={F.label}
          labelSide="above"
          width={3}
        />
      ))}
    </g>
  );
}

/** Distance ruler under the floor from x1 to x2 (px) with a caption. */
export function Ruler({ x1, x2, y, s, color = C.muted }: { x1: number; x2: number; y: number; s: string; color?: string }) {
  if (Math.abs(x2 - x1) < 2) return null;
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={1} />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} stroke={color} strokeWidth={1} />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} stroke={color} strokeWidth={1} />
      <T x={(x1 + x2) / 2} y={y + 13} s={s} size={10} color={color} />
    </g>
  );
}

/**
 * A graph with tick labels: points of a piecewise-linear (or any) function,
 * revealed up to τNow. Optionally shades the area under it.
 */
export function Graph({
  x,
  y,
  w,
  h,
  tMax,
  yMin,
  yMax,
  fn,
  now,
  color = C.p,
  area = false,
  xTicks = [],
  yTicks = [],
  yLabel,
  xLabel = "t(s)",
  marks = [],
  bare = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tMax: number;
  yMin: number;
  yMax: number;
  fn: (s: number) => number;
  now: number;
  color?: string;
  area?: boolean;
  xTicks?: number[];
  yTicks?: number[];
  yLabel?: string;
  xLabel?: string;
  marks?: { s: number; label?: string }[];
  /** draw only the curve (to overlay a second curve on an existing graph) */
  bare?: boolean;
}) {
  const X = (s: number) => x + (s / tMax) * w;
  const Y = (v: number) => y + h - ((v - yMin) / (yMax - yMin)) * h;
  const end = clamp(now, 0, tMax);
  const N = 120;
  const pts: string[] = [];
  const ghost: string[] = [];
  for (let i = 0; i <= N; i++) {
    const s = (i / N) * tMax;
    ghost.push(`${i ? "L" : "M"}${X(s).toFixed(1)},${Y(fn(s)).toFixed(1)}`);
  }
  const M = Math.max(2, Math.round((end / tMax) * N));
  for (let i = 0; i <= M; i++) {
    const s = (i / M) * end;
    pts.push(`${i ? "L" : "M"}${X(s).toFixed(1)},${Y(fn(s)).toFixed(1)}`);
  }
  const y0 = Y(0);
  if (bare)
    return (
      <g>
        {area && end > 0 ? (
          <path d={`${pts.join(" ")} L${X(end).toFixed(1)},${y0.toFixed(1)} L${X(0).toFixed(1)},${y0.toFixed(1)} Z`} fill={color} opacity={0.2} />
        ) : null}
        {end > 0 ? <path d={pts.join(" ")} fill="none" stroke={color} strokeWidth={2.2} /> : null}
      </g>
    );
  return (
    <g>
      <rect x={x - 26} y={y - 14} width={w + 46} height={h + 32} rx={8} fill="#ffffff" opacity={0.92} />
      <line x1={x} y1={y - 6} x2={x} y2={y + h} stroke={C.faint} strokeWidth={1} />
      <line x1={x} y1={y0} x2={x + w + 8} y2={y0} stroke={C.faint} strokeWidth={1} />
      {yLabel ? <T x={x + 4} y={y - 4} s={yLabel} size={9.5} color={C.muted} anchor="start" italic /> : null}
      <T x={x + w + 18} y={y0 - 4} s={xLabel} size={9} color={C.muted} anchor="end" italic />
      {xTicks.map((s) => (
        <g key={`x${s}`}>
          <line x1={X(s)} y1={y0 - 2} x2={X(s)} y2={y0 + 2} stroke={C.faint} />
          <T x={X(s)} y={y0 + 11} s={num(s)} size={8.5} color={C.muted} bold={false} />
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={x} y1={Y(v)} x2={x + w} y2={Y(v)} stroke={C.faint} strokeDasharray="2 3" strokeWidth={0.6} />
          <T x={x - 3} y={Y(v) + 3} s={num(v)} size={8.5} color={C.muted} anchor="end" bold={false} />
        </g>
      ))}
      <path d={ghost.join(" ")} fill="none" stroke={color} strokeWidth={1} opacity={0.22} />
      {area && end > 0 ? (
        <path d={`${pts.join(" ")} L${X(end).toFixed(1)},${y0.toFixed(1)} L${X(0).toFixed(1)},${y0.toFixed(1)} Z`} fill={color} opacity={0.2} />
      ) : null}
      {end > 0 ? <path d={pts.join(" ")} fill="none" stroke={color} strokeWidth={2.2} /> : null}
      {end > 0 ? <circle cx={X(end)} cy={Y(fn(end))} r={3} fill={color} /> : null}
      {marks.map((m, i) =>
        end >= m.s - 0.02 ? (
          <g key={i}>
            <line x1={X(m.s)} y1={Y(fn(m.s))} x2={X(m.s)} y2={y0} stroke={color} strokeDasharray="3 3" strokeWidth={1} />
            {m.label ? <T x={X(m.s) + 4} y={Y(fn(m.s)) - 5} s={m.label} size={9.5} color={color} anchor="start" /> : null}
          </g>
        ) : null,
      )}
    </g>
  );
}

/** Piecewise-linear function through points [[t, v], ...]. */
export function pw(points: [number, number][]) {
  return (s: number) => {
    if (s <= points[0][0]) return points[0][1];
    for (let i = 1; i < points.length; i++) {
      const [a, va] = points[i - 1];
      const [b, vb] = points[i];
      if (s <= b) return b === a ? vb : va + ((vb - va) * (s - a)) / (b - a);
    }
    return points[points.length - 1][1];
  };
}

/** Floor + one box doing a 1-D motion driven by a physical velocity function. */
export function Track({
  s,
  v,
  x0,
  px,
  gy = 110,
  forces,
  label,
  fill,
  w,
  vs,
  fs,
  rough,
  children,
}: {
  s: number;
  v: (s: number) => number;
  x0: number;
  px: number;
  gy?: number;
  forces?: F1[];
  label?: string;
  fill?: string;
  w?: number;
  vs?: number;
  fs?: number;
  rough?: boolean;
  children?: ReactNode;
}) {
  const x = x0 + px * disp(v, s);
  return (
    <g>
      <Ground y={gy} rough={rough} />
      {children}
      <Body x={x} gy={gy} v={v(s)} forces={forces} label={label} fill={fill} w={w} vs={vs} fs={fs} />
    </g>
  );
}

/** Several lines of text, one per row (rich() still turns υ_1 into subscripts). */
export const L = (...lines: string[]) => (
  <>
    {lines.map((l, i) => (
      <span key={i} className="block">
        {l}
      </span>
    ))}
  </>
);

export { C, num };
