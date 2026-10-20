"use client";

import type { ReactNode } from "react";
import { Arrow } from "@/components/mixalis/omali/shared";

/* Poster palette, so the animations look like the poster cells. */
export const C = {
  v: "#1f6fd1", // ταχύτητα
  F: "#d9342b", // δύναμη
  p: "#1f9d55", // ορμή / αποτέλεσμα
  K: "#e08a1e", // κινητική ενέργεια
  ink: "#1c2433",
  muted: "#5b6577",
  faint: "#9aa3b2",
  ground: "#8a8f99",
  b1: "#9fb3c8",
  b2: "#f2c46d",
  wood: "#c8a27a",
  ball: "#f4a261",
  edge: "#4a5568",
  water: "#7fb3e6",
  paper: "#fbfaf7",
};

export const W = 360;
export const H = 210;

export type Phase = { until: number; label: string; say: ReactNode };

export type Case = {
  n: number;
  title: string;
  /** Loop length in seconds of animation time. */
  period: number;
  phases: Phase[];
  Scene: (props: { t: number }) => ReactNode;
  /** What the student writes, with the example numbers. */
  solve: ReactNode;
  trap?: ReactNode;
  legend?: ("v" | "F" | "p" | "K")[];
};

/* ───────── time helpers ───────── */

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
/** 0→1 progress of t through [a, b]. */
export const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const easeInOut = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
/** Smooth bump 0→1→0 over [a, b]. */
export const bump = (t: number, a: number, b: number) => {
  const k = seg(t, a, b);
  return t < a || t > b ? 0 : Math.sin(Math.PI * k);
};

/* ───────── text ───────── */

/** Renders "υ_1" or "K_{πριν}" with real subscripts inside SVG text. */
export function Sub({ s }: { s: string }) {
  const parts: ReactNode[] = [];
  const re = /_\{([^}]*)\}|_(\S)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) parts.push(s.slice(last, m.index));
    parts.push(
      <tspan key={i++} baselineShift="sub" fontSize="70%">
        {m[1] ?? m[2]}
      </tspan>,
    );
    last = m.index + m[0].length;
  }
  if (last < s.length) parts.push(s.slice(last));
  return <>{parts}</>;
}

export function T({
  x,
  y,
  s,
  size = 11,
  color = C.ink,
  anchor = "middle",
  bold = true,
  italic = false,
  opacity = 1,
}: {
  x: number;
  y: number;
  s: string;
  size?: number;
  color?: string;
  anchor?: "start" | "middle" | "end";
  bold?: boolean;
  italic?: boolean;
  opacity?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fill={color}
      textAnchor={anchor}
      fontWeight={bold ? 700 : 400}
      fontStyle={italic ? "italic" : "normal"}
      opacity={opacity}
    >
      <Sub s={s} />
    </text>
  );
}

/* ───────── vectors ───────── */

/**
 * Vector from (x, y) by (dx, dy) with an optional label near its tip.
 * Tiny vectors are hidden so a zero velocity simply disappears.
 */
export function Vec({
  x,
  y,
  dx,
  dy = 0,
  color = C.v,
  label,
  width = 2.6,
  dashed = false,
  opacity = 1,
  labelSide = "auto",
}: {
  x: number;
  y: number;
  dx: number;
  dy?: number;
  color?: string;
  label?: string;
  width?: number;
  dashed?: boolean;
  opacity?: number;
  labelSide?: "auto" | "above" | "below" | "left" | "right";
}) {
  const len = Math.hypot(dx, dy);
  if (len < 3) return null;
  let lx = x + dx / 2;
  let ly = y + dy / 2;
  const horizontal = Math.abs(dx) >= Math.abs(dy);
  const side = labelSide === "auto" ? (horizontal ? "above" : "right") : labelSide;
  if (side === "above") ly -= 7;
  if (side === "below") ly += 15;
  if (side === "right") lx += 10;
  if (side === "left") lx -= 10;
  return (
    <g opacity={opacity}>
      <Arrow x1={x} y1={y} x2={x + dx} y2={y + dy} color={color} width={width} head={9} dashed={dashed} />
      {label ? (
        <T
          x={lx}
          y={ly + (side === "right" || side === "left" ? 4 : 0)}
          s={label}
          size={11.5}
          color={color}
          italic
          anchor={side === "right" ? "start" : side === "left" ? "end" : "middle"}
        />
      ) : null}
    </g>
  );
}

/* ───────── objects ───────── */

export function Ground({ y, x1 = 6, x2 = W - 6, rough = false }: { y: number; x1?: number; x2?: number; rough?: boolean }) {
  const ticks: ReactNode[] = [];
  for (let x = x1 + 6; x < x2; x += 12) {
    ticks.push(<line key={x} x1={x} y1={y + 1} x2={x - 6} y2={y + 7} stroke={C.ground} strokeWidth={1} />);
  }
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={C.ground} strokeWidth={2.2} strokeLinecap="round" />
      {rough ? (
        <path
          d={Array.from({ length: Math.floor((x2 - x1) / 6) }, (_, i) => `${i ? "L" : "M"}${x1 + i * 6},${y - (i % 2 ? 2 : 0)}`).join(" ")}
          fill="none"
          stroke={C.ground}
          strokeWidth={1}
        />
      ) : null}
      {ticks}
    </g>
  );
}

export function Wall({ x, y1, y2, side = "right" }: { x: number; y1: number; y2: number; side?: "left" | "right" }) {
  const dir = side === "right" ? 1 : -1;
  const ticks: ReactNode[] = [];
  for (let y = y1 + 4; y < y2; y += 10) {
    ticks.push(<line key={y} x1={x} y1={y} x2={x + 7 * dir} y2={y + 6} stroke={C.ground} strokeWidth={1} />);
  }
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={C.ground} strokeWidth={3} strokeLinecap="round" />
      {ticks}
    </g>
  );
}

/** Box resting with its bottom at y, horizontally centred on cx. */
export function Box({
  cx,
  y,
  w = 34,
  h = 26,
  label,
  fill = C.b1,
  opacity = 1,
}: {
  cx: number;
  y: number;
  w?: number;
  h?: number;
  label?: string;
  fill?: string;
  opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      <rect x={cx - w / 2} y={y - h} width={w} height={h} rx={3} fill={fill} stroke={C.edge} strokeWidth={1.3} />
      {label ? <T x={cx} y={y - h / 2 + 4} s={label} size={11} italic /> : null}
    </g>
  );
}

/** Ball with optional squash (0 = round, 0.4 = very flat) against a surface. */
export function Ball({
  cx,
  cy,
  r = 10,
  fill = C.ball,
  squash = 0,
  axis = "x",
  label,
}: {
  cx: number;
  cy: number;
  r?: number;
  fill?: string;
  squash?: number;
  axis?: "x" | "y";
  label?: string;
}) {
  const a = axis === "x" ? r * (1 - squash) : r * (1 + squash * 0.6);
  const b = axis === "x" ? r * (1 + squash * 0.6) : r * (1 - squash);
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={a} ry={b} fill={fill} stroke={C.edge} strokeWidth={1.3} />
      {label ? <T x={cx} y={cy + 4} s={label} size={10} italic /> : null}
    </g>
  );
}

export function Bullet({ x, y }: { x: number; y: number }) {
  return <path d={`M ${x - 9} ${y - 2.5} L ${x - 2} ${y - 2.5} Q ${x + 4} ${y} ${x - 2} ${y + 2.5} L ${x - 9} ${y + 2.5} Z`} fill="#3b3f46" />;
}

export function Burst({ cx, cy, k }: { cx: number; cy: number; k: number }) {
  if (k <= 0 || k >= 1) return null;
  const r = 6 + 28 * k;
  const pts = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    const rr = i % 2 ? r * 0.5 : r;
    return `${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`;
  }).join(" ");
  return <polygon points={pts} fill="#ffd166" stroke="#e67e22" strokeWidth={1.5} opacity={1 - k * 0.7} />;
}

/** Small heat glow used to show Q (lost kinetic energy). */
export function Heat({ cx, cy, k }: { cx: number; cy: number; k: number }) {
  if (k <= 0.01) return null;
  return (
    <g opacity={k}>
      <circle cx={cx} cy={cy} r={22} fill="#ff7a45" opacity={0.18} />
      <T x={cx} y={cy - 24} s="Q" size={12} color="#e2571e" italic />
    </g>
  );
}

export function StickPerson({ x, y, step = 0, scale = 1 }: { x: number; y: number; step?: number; scale?: number }) {
  const s = scale;
  const leg = Math.sin(step) * 6 * s;
  return (
    <g stroke={C.ink} strokeWidth={1.8} fill="none" strokeLinecap="round">
      <circle cx={x} cy={y - 34 * s} r={5.5 * s} />
      <line x1={x} y1={y - 28 * s} x2={x} y2={y - 13 * s} />
      <line x1={x} y1={y - 13 * s} x2={x - leg} y2={y} />
      <line x1={x} y1={y - 13 * s} x2={x + leg} y2={y} />
      <line x1={x - 7 * s} y1={y - 23 * s} x2={x + 7 * s} y2={y - 23 * s} />
    </g>
  );
}

export function Cart({ cx, y, w = 46, label, fill = C.b1 }: { cx: number; y: number; w?: number; label?: string; fill?: string }) {
  return (
    <g>
      <rect x={cx - w / 2} y={y - 24} width={w} height={17} rx={3} fill={fill} stroke={C.edge} strokeWidth={1.3} />
      <circle cx={cx - w / 3.2} cy={y - 4} r={4} fill="#ffffff" stroke={C.edge} strokeWidth={1.3} />
      <circle cx={cx + w / 3.2} cy={y - 4} r={4} fill="#ffffff" stroke={C.edge} strokeWidth={1.3} />
      {label ? <T x={cx} y={y - 12} s={label} size={10.5} italic /> : null}
    </g>
  );
}

/** Dashed frame around the bodies we treat as one system. */
export function SystemFrame({ x, y, w, h, label = "σύστημα" }: { x: number; y: number; w: number; h: number; label?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={C.muted} strokeWidth={1} strokeDasharray="5 4" />
      <T x={x + 8} y={y + 12} s={label} size={9.5} color={C.muted} anchor="start" bold={false} />
    </g>
  );
}

/* ───────── read-outs ───────── */

export type BarItem = { label: string; value: number; color?: string; unit?: string };

/**
 * Signed horizontal bars around a zero line: the "momentum meter".
 * Each row shows label, bar and the value with Greek decimals.
 */
export function Bars({
  x = 8,
  y,
  w = W - 16,
  items,
  max,
  unit = "kg·m/s",
  title,
}: {
  x?: number;
  y: number;
  w?: number;
  items: BarItem[];
  max: number;
  unit?: string;
  title?: string;
}) {
  const labelW = 52;
  const valueW = 86;
  const zero = x + labelW + (w - labelW - valueW) / 2;
  const half = (w - labelW - valueW) / 2 - 2;
  const rowH = 13;
  return (
    <g>
      {title ? <T x={x} y={y - 3} s={title} size={9} color={C.muted} anchor="start" bold={false} /> : null}
      <line x1={zero} y1={y} x2={zero} y2={y + items.length * rowH} stroke={C.faint} strokeWidth={1} />
      {items.map((it, i) => {
        const yy = y + i * rowH;
        const len = clamp(it.value / max, -1, 1) * half;
        const color = it.color ?? C.p;
        return (
          <g key={it.label}>
            <T x={x} y={yy + 10} s={it.label} size={10} color={color} anchor="start" italic />
            <rect x={Math.min(zero, zero + len)} y={yy + 2} width={Math.abs(len)} height={9} rx={2} fill={color} opacity={0.85} />
            <text x={x + w} y={yy + 10} fontSize={10} fill={color} textAnchor="end" fontWeight={700} style={{ fontVariantNumeric: "tabular-nums" }}>
              {num(it.value)} {it.unit ?? unit}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function num(v: number, digits = 2) {
  const r = Math.abs(v) < 0.005 ? 0 : v;
  return r.toLocaleString("el-GR", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}

/** A small plot: samples fn on [0, tMax] and reveals it up to tNow. */
export function MiniGraph({
  x,
  y,
  w,
  h,
  tMax,
  yMin,
  yMax,
  fn,
  tNow,
  color = C.p,
  fillArea = false,
  xLabel = "t",
  yLabel,
  ghost = true,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tMax: number;
  yMin: number;
  yMax: number;
  fn: (t: number) => number;
  tNow: number;
  color?: string;
  fillArea?: boolean;
  xLabel?: string;
  yLabel?: string;
  ghost?: boolean;
}) {
  const X = (t: number) => x + (t / tMax) * w;
  const Y = (v: number) => y + h - ((v - yMin) / (yMax - yMin)) * h;
  const N = 90;
  const full: string[] = [];
  const shown: string[] = [];
  const end = clamp(tNow, 0, tMax);
  for (let i = 0; i <= N; i++) {
    const tt = (i / N) * tMax;
    full.push(`${i ? "L" : "M"}${X(tt).toFixed(1)},${Y(fn(tt)).toFixed(1)}`);
  }
  const M = Math.max(2, Math.round((end / tMax) * N));
  for (let i = 0; i <= M; i++) {
    const tt = (i / M) * end;
    shown.push(`${i ? "L" : "M"}${X(tt).toFixed(1)},${Y(fn(tt)).toFixed(1)}`);
  }
  const area = fillArea && end > 0 ? `${shown.join(" ")} L${X(end).toFixed(1)},${Y(0).toFixed(1)} L${X(0).toFixed(1)},${Y(0).toFixed(1)} Z` : null;
  const y0 = clamp(Y(0), y, y + h);
  return (
    <g>
      <rect x={x - 4} y={y - 6} width={w + 14} height={h + 12} rx={6} fill="#ffffff" opacity={0.85} />
      <line x1={x} y1={y} x2={x} y2={y + h} stroke={C.faint} strokeWidth={1} />
      <line x1={x} y1={y0} x2={x + w + 6} y2={y0} stroke={C.faint} strokeWidth={1} />
      {ghost ? <path d={full.join(" ")} fill="none" stroke={color} strokeWidth={1} opacity={0.2} /> : null}
      {area ? <path d={area} fill={color} opacity={0.22} /> : null}
      {end > 0 ? <path d={shown.join(" ")} fill="none" stroke={color} strokeWidth={2} /> : null}
      {end > 0 && end < tMax ? <circle cx={X(end)} cy={Y(fn(end))} r={2.8} fill={color} /> : null}
      <T x={x + w + 8} y={y0 + 11} s={xLabel} size={9} color={C.muted} italic />
      {yLabel ? <T x={x + 3} y={y + 4} s={yLabel} size={9} color={C.muted} anchor="start" italic /> : null}
    </g>
  );
}

/** Thin caption strip inside the scene (e.g. «αργή κίνηση»). */
export function Tag({ x, y, s, color = C.muted, show = true }: { x: number; y: number; s: string; color?: string; show?: boolean }) {
  if (!show) return null;
  return (
    <g>
      <rect x={x - 3} y={y - 11} width={s.length * 5.6 + 10} height={15} rx={7.5} fill="#ffffff" stroke={color} strokeWidth={0.8} />
      <T x={x + 2} y={y} s={s} size={9} color={color} anchor="start" />
    </g>
  );
}
