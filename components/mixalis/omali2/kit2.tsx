"use client";

import type { ReactNode } from "react";
import { C, T, Vec, type Phase } from "@/components/mixalis/ormi/kit";

/**
 * Circular-motion helpers on top of the ormi animation kit.
 * Angles are in radians, counter-clockwise from the +x axis (maths convention);
 * the SVG y axis points down, so screen y = cy − r·sinθ.
 */

export type LegendKey = "v" | "F" | "a" | "E";

export type OCase = {
  n: number;
  title: string;
  /** One plain sentence: what the student is looking at. */
  what: string;
  /** The data of the example, as in an exercise statement. */
  given: string;
  /** What we are asked to find. */
  ask: string;
  /** Total animation length in seconds. */
  period: number;
  phases: Phase[];
  Scene: (props: { t: number }) => ReactNode;
  solve: ReactNode;
  trap?: ReactNode;
  legend?: LegendKey[];
};

/** Colours of the omali poster: υ blue, forces red, accelerations green, energy orange. */
export const K = {
  v: C.v,
  F: C.F,
  a: C.p,
  E: C.K,
  g: "#b04a3c", // weight, a slightly darker red so it stands apart from N / T
  track: "#2b3545",
  orbit: "#9aa3b2",
};

export const P = (cx: number, cy: number, r: number, th: number): [number, number] => [cx + r * Math.cos(th), cy - r * Math.sin(th)];

/** Unit tangent (screen coordinates) for counter-clockwise motion at angle θ. */
export const tang = (th: number): [number, number] => [-Math.sin(th), -Math.cos(th)];

/** Unit vector (screen coordinates) from the body at angle θ towards the centre. */
export const inward = (th: number): [number, number] => [-Math.cos(th), Math.sin(th)];

export const deg = (d: number) => (d * Math.PI) / 180;

/** Dashed path of the motion with the centre O. */
export function Orbit({
  cx,
  cy,
  r,
  ry,
  label = "O",
  dashed = true,
  showCentre = true,
  color = K.orbit,
}: {
  cx: number;
  cy: number;
  r: number;
  ry?: number;
  label?: string;
  dashed?: boolean;
  showCentre?: boolean;
  color?: string;
}) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={r} ry={ry ?? r} fill="none" stroke={color} strokeWidth={1.3} strokeDasharray={dashed ? "5 4" : undefined} />
      {showCentre ? (
        <g>
          <circle cx={cx} cy={cy} r={2.6} fill={C.ink} />
          {label ? <T x={cx - 8} y={cy + 4} s={label} size={10} color={C.muted} italic anchor="end" /> : null}
        </g>
      ) : null}
    </g>
  );
}

/** Thin radius line from the centre to a point. */
export function Radius({ cx, cy, x, y, label, color = C.muted }: { cx: number; cy: number; x: number; y: number; label?: string; color?: string }) {
  return (
    <g>
      <line x1={cx} y1={cy} x2={x} y2={y} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
      {label ? <T x={(cx + x) / 2} y={(cy + y) / 2 - 5} s={label} size={10} color={color} italic /> : null}
    </g>
  );
}

/** Arc of radius r between two angles (screen convention like P). */
export function ArcPath({
  cx,
  cy,
  r,
  a0,
  a1,
  color = C.muted,
  width = 1.2,
  dashed = false,
  opacity = 1,
}: {
  cx: number;
  cy: number;
  r: number;
  a0: number;
  a1: number;
  color?: string;
  width?: number;
  dashed?: boolean;
  opacity?: number;
}) {
  if (Math.abs(a1 - a0) < 0.005) return null;
  const n = Math.max(6, Math.ceil(Math.abs(a1 - a0) * 24));
  const d = Array.from({ length: n + 1 }, (_, i) => {
    const [x, y] = P(cx, cy, r, a0 + ((a1 - a0) * i) / n);
    return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dashed ? "4 3" : undefined} opacity={opacity} />;
}

/** Angle mark: small arc at (cx, cy) between angles a0 and a1, with a label. */
export function Angle({ cx, cy, r = 18, a0, a1, label, color = C.muted }: { cx: number; cy: number; r?: number; a0: number; a1: number; label: string; color?: string }) {
  const mid = (a0 + a1) / 2;
  const [lx, ly] = P(cx, cy, r + 9, mid);
  return (
    <g>
      <ArcPath cx={cx} cy={cy} r={r} a0={a0} a1={a1} color={color} />
      <T x={lx} y={ly + 4} s={label} size={10.5} color={color} italic />
    </g>
  );
}

/** Force / velocity / acceleration arrow along a unit direction with a length in px. */
export function Along({
  x,
  y,
  u,
  len,
  color,
  label,
  width,
  dashed,
  labelSide,
  opacity,
}: {
  x: number;
  y: number;
  u: [number, number];
  len: number;
  color: string;
  label?: string;
  width?: number;
  dashed?: boolean;
  labelSide?: "auto" | "above" | "below" | "left" | "right";
  opacity?: number;
}) {
  return <Vec x={x} y={y} dx={u[0] * len} dy={u[1] * len} color={color} label={label} width={width} dashed={dashed} labelSide={labelSide} opacity={opacity} />;
}

/** Small block drawn centred on (x, y), rotated by `rot` degrees (screen, clockwise). */
export function Block({ x, y, w = 18, h = 14, rot = 0, fill = C.b1, label }: { x: number; y: number; w?: number; h?: number; rot?: number; fill?: string; label?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={2.5} fill={fill} stroke={C.edge} strokeWidth={1.3} />
      {label ? <T x={0} y={4} s={label} size={9.5} italic /> : null}
    </g>
  );
}

/** Side view of a little car whose bottom-centre sits on (x, y), tilted by `rot` degrees. */
export function Car({ x, y, rot = 0, scale = 1, fill = "#7fa7d9" }: { x: number; y: number; rot?: number; scale?: number; fill?: string }) {
  const s = scale;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M -20 -7 L -20 -15 L -10 -16 L -5 -24 L 8 -24 L 13 -16 L 20 -14 L 20 -7 Z" fill={fill} stroke={C.edge} strokeWidth={1.2} />
      <rect x={-3.5} y={-22} width={10} height={5.5} rx={1} fill="#e7f0fb" stroke={C.edge} strokeWidth={0.6} />
      <circle cx={-11} cy={-5} r={4.6} fill="#2f3640" />
      <circle cx={11} cy={-5} r={4.6} fill="#2f3640" />
      <circle cx={-11} cy={-5} r={1.6} fill="#c8ced6" />
      <circle cx={11} cy={-5} r={1.6} fill="#c8ced6" />
    </g>
  );
}

/** Car seen from behind (for banked roads). Bottom-centre at (x, y). */
export function CarBack({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-17} y={-22} width={34} height={15} rx={4} fill="#7fa7d9" stroke={C.edge} strokeWidth={1.2} />
      <rect x={-12} y={-30} width={24} height={9} rx={3} fill="#a9c4e6" stroke={C.edge} strokeWidth={1} />
      <rect x={-16} y={-8} width={7} height={8} rx={1.5} fill="#2f3640" />
      <rect x={9} y={-8} width={7} height={8} rx={1.5} fill="#2f3640" />
    </g>
  );
}

/** Rounded white panel with lines of small text (formulas next to the drawing). */
export function Panel({ x, y, w, lines, color = C.ink, size = 10.5, opacity = 1 }: { x: number; y: number; w: number; lines: string[]; color?: string; size?: number; opacity?: number }) {
  const lh = size + 5;
  return (
    <g opacity={opacity}>
      <rect x={x} y={y} width={w} height={lines.length * lh + 8} rx={7} fill="#ffffff" stroke="#d6dae1" />
      {lines.map((l, i) => (
        <T key={i} x={x + 7} y={y + 4 + (i + 1) * lh - 3} s={l} size={size} color={color} anchor="start" bold={i === 0} />
      ))}
    </g>
  );
}

/** Polyline helper for tracks: points → path string. */
export const path = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

/** Compact magnitude bars for the narrow right column: label · bar · value. */
export function MagBars({
  x,
  y,
  w,
  items,
  max,
  unit = "N",
  title,
}: {
  x: number;
  y: number;
  w: number;
  items: { label: string; value: number; color?: string; unit?: string }[];
  max: number;
  unit?: string;
  title?: string;
}) {
  const labelW = 40;
  const valueW = 58;
  const barW = Math.max(10, w - labelW - valueW - 4);
  const rowH = 15;
  return (
    <g>
      {title ? <T x={x} y={y - 3} s={title} size={9} color={C.muted} anchor="start" bold={false} /> : null}
      {items.map((it, i) => {
        const yy = y + i * rowH;
        const color = it.color ?? C.ink;
        const len = Math.max(0, Math.min(1, it.value / max)) * barW;
        return (
          <g key={it.label + i}>
            <T x={x} y={yy + 11} s={it.label} size={10.5} color={color} anchor="start" italic />
            <rect x={x + labelW} y={yy + 3} width={barW} height={9} rx={2} fill="#eceef2" />
            <rect x={x + labelW} y={yy + 3} width={len} height={9} rx={2} fill={color} opacity={0.85} />
            <text x={x + w} y={yy + 11} fontSize={10.5} fill={color} textAnchor="end" fontWeight={700} style={{ fontVariantNumeric: "tabular-nums" }}>
              {fmtNum(it.value, Math.abs(it.value) >= 100 ? 0 : 2)} {it.unit ?? unit}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function fmtNum(v: number, digits = 2) {
  const r = Math.abs(v) < 0.005 ? 0 : v;
  return r.toLocaleString("el-GR", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}

/**
 * Body on a vertical circle (string or loop track), starting at the bottom and
 * moving counter-clockwise. Energy conservation gives υ² at each angle; we step
 * θ forward for `t` seconds of shown time. Returns the angle and υ² there.
 * `stopSin`: stop when sinθ reaches this value (e.g. where the string goes slack).
 */
export function loopState(t: number, v2bottom: number, Rm: number, rate = 1, stopSin = 2) {
  let th = -Math.PI / 2;
  const dt = 0.008;
  let s = 0;
  let stopped = false;
  for (; s < t; s += dt) {
    const v2 = v2bottom - 2 * 10 * Rm * (1 + Math.sin(th));
    if (v2 <= 1e-6 || Math.sin(th) >= stopSin) {
      stopped = true;
      break;
    }
    th += (Math.sqrt(v2) / Rm) * dt * rate;
  }
  const v2 = Math.max(0, v2bottom - 2 * 10 * Rm * (1 + Math.sin(th)));
  return { th, v2, tStop: stopped ? s : t, stopped };
}
