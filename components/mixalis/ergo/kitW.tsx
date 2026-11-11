"use client";

import { C, T } from "@/components/mixalis/ormi/kit";
import { TE } from "@/components/mixalis/pedio/kitE";

/** Colours of the work–energy poster. */
export const WC = {
  F: "#d9342b",
  v: "#1f6fd1",
  K: "#e08a1e",
  U: "#1f9d55",
  Q: "#b04a3c",
  W: "#6b3fa0",
  N: "#1f9d55",
  g: "#b04a3c",
  s: "#5b6577",
};

export const G = 10;

/** Greek number formatting: 2.5 → "2,5". */
export const gr = (v: number, digits = 1) => {
  const r = Math.abs(v) < 0.005 ? 0 : v;
  return r.toLocaleString("el-GR", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
};

/** Block standing on y (its bottom), centred at cx. */
export function Block({ cx, y, w = 34, h = 26, label = "m", fill = "#f2c46d" }: { cx: number; y: number; w?: number; h?: number; label?: string; fill?: string }) {
  return (
    <g>
      <rect x={cx - w / 2} y={y - h} width={w} height={h} rx={3} fill={fill} stroke={C.edge} strokeWidth={1.3} />
      {label ? <T x={cx} y={y - h / 2 + 4} s={label} size={11} italic /> : null}
    </g>
  );
}

/** Vertical energy bars standing on `base`, with value on top and label below. */
export function VBars({
  x,
  base,
  items,
  max,
  height = 80,
  w = 24,
  gap = 12,
}: {
  x: number;
  base: number;
  items: { label: string; value: number; color: string; text?: string }[];
  max: number;
  height?: number;
  w?: number;
  gap?: number;
}) {
  return (
    <g>
      <line x1={x - 4} y1={base} x2={x + items.length * (w + gap) - gap + 4} y2={base} stroke={C.faint} strokeWidth={1} />
      {items.map((it, i) => {
        const xx = x + i * (w + gap);
        const h = Math.max(0, Math.min(1, it.value / max)) * height;
        return (
          <g key={it.label + i}>
            <rect x={xx} y={base - h} width={w} height={h} rx={2} fill={it.color} opacity={0.85} />
            <TE x={xx + w / 2} y={base - h - 4} s={it.text ?? `${gr(it.value)} J`} size={9.5} color={it.color} />
            <TE x={xx + w / 2} y={base + 12} s={it.label} size={10} color={it.color} italic />
          </g>
        );
      })}
    </g>
  );
}

/** Dimension line with a label underneath. */
export function Dim({ x1, x2, y, label, color = WC.s }: { x1: number; x2: number; y: number; label: string; color?: string }) {
  if (Math.abs(x2 - x1) < 2) return null;
  return (
    <g>
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} stroke={color} strokeWidth={1} />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} stroke={color} strokeWidth={1} />
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={1} />
      <TE x={(x1 + x2) / 2} y={y + 13} s={label} size={10.5} color={color} italic />
    </g>
  );
}

/** Vertical height marker with label on the right. */
export function VDim({ x, y1, y2, label, color = WC.s }: { x: number; y1: number; y2: number; label: string; color?: string }) {
  if (Math.abs(y2 - y1) < 2) return null;
  return (
    <g>
      <line x1={x - 4} y1={y1} x2={x + 4} y2={y1} stroke={color} strokeWidth={1} />
      <line x1={x - 4} y1={y2} x2={x + 4} y2={y2} stroke={color} strokeWidth={1} />
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth={1} />
      <TE x={x + 7} y={(y1 + y2) / 2 + 4} s={label} size={10.5} color={color} anchor="start" italic />
    </g>
  );
}

/** Wavy heat marks above a sliding surface. */
export function HeatMarks({ x, y, k }: { x: number; y: number; k: number }) {
  if (k <= 0.02) return null;
  return (
    <g opacity={Math.min(1, k)}>
      {[0, 8, 16].map((d) => (
        <path key={d} d={`M ${x + d} ${y} q 3 -5 0 -10 q -3 -5 0 -10`} fill="none" stroke={WC.Q} strokeWidth={1.2} />
      ))}
    </g>
  );
}

/** Simple crane: mast at x, jib to x + jib, load hanging at hookY. */
export function Crane({ x, ground, top, jib = 70, hookY, label = "m" }: { x: number; ground: number; top: number; jib?: number; hookY: number; label?: string }) {
  return (
    <g>
      <rect x={x} y={top} width={7} height={ground - top} fill="#846b58" />
      <rect x={x} y={top} width={jib} height={6} fill="#846b58" />
      <circle cx={x + jib} cy={top + 5} r={5} fill="#e7d7c6" stroke="#846b58" strokeWidth={1.5} />
      <line x1={x + jib} y1={top + 10} x2={x + jib} y2={hookY} stroke="#7a7068" strokeWidth={1.3} />
      <Block cx={x + jib} y={hookY + 22} w={28} h={22} label={label} />
    </g>
  );
}
