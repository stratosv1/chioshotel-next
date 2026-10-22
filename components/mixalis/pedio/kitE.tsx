"use client";

import type { ReactNode } from "react";
import { C, T, Vec, type Phase } from "@/components/mixalis/ormi/kit";

/** Colours of the electric-field poster: E green, F red, υ blue, V / U orange. */
export const EC = {
  E: "#1f9d55",
  F: "#d9342b",
  v: "#1f6fd1",
  U: "#e08a1e",
  pos: "#e8574c",
  neg: "#3d7fd6",
  g: "#b04a3c",
};

export type ELegend = "v" | "F" | "E" | "U";

export type ECase = {
  n: number;
  title: string;
  what: string;
  given: string;
  ask: string;
  period: number;
  phases: Phase[];
  Scene: (props: { t: number }) => ReactNode;
  solve: ReactNode;
  trap?: ReactNode;
  legend?: ELegend[];
};

/** Point charge drawn as a coloured disc with its sign. */
export function Charge({ x, y, sign, r = 11, label, labelDy = -16, opacity = 1 }: { x: number; y: number; sign: 1 | -1; r?: number; label?: string; labelDy?: number; opacity?: number }) {
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={r} fill={sign > 0 ? EC.pos : EC.neg} stroke="#2b3545" strokeWidth={1.2} />
      <T x={x} y={y + r * 0.42} s={sign > 0 ? "+" : "−"} size={r * 1.25} color="#ffffff" />
      {label ? <T x={x} y={y + labelDy} s={label} size={10.5} italic /> : null}
    </g>
  );
}

/** Pair of parallel plates. vertical: plates at x1 and x2 from y1 to y2. `plusFirst`: first plate positive. */
export function Plates({
  x1,
  x2,
  y1,
  y2,
  vertical = true,
  plusFirst = true,
  signs = true,
}: {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  vertical?: boolean;
  plusFirst?: boolean;
  signs?: boolean;
}) {
  const a = plusFirst;
  if (vertical) {
    return (
      <g>
        {[
          [x1, a],
          [x2, !a],
        ].map(([x, s]) => (
          <g key={String(x)}>
            <rect x={(x as number) - 3} y={y1} width={6} height={y2 - y1} fill={s ? EC.pos : EC.neg} stroke="#2b3545" strokeWidth={1} />
            {signs ? <T x={x as number} y={y1 - 5} s={s ? "+" : "−"} size={13} color={s ? EC.pos : EC.neg} /> : null}
          </g>
        ))}
      </g>
    );
  }
  return (
    <g>
      {[
        [y1, a],
        [y2, !a],
      ].map(([y, s]) => (
        <g key={String(y)}>
          <rect x={x1} y={(y as number) - 3} width={x2 - x1} height={6} fill={s ? EC.pos : EC.neg} stroke="#2b3545" strokeWidth={1} />
          {signs ? <T x={x1 - 9} y={(y as number) + 4} s={s ? "+" : "−"} size={13} color={s ? EC.pos : EC.neg} /> : null}
        </g>
      ))}
    </g>
  );
}

/** Horizontal field lines (dir = 1 → to the right). */
export function HLines({ x1, x2, ys, dir = 1, opacity = 1 }: { x1: number; x2: number; ys: number[]; dir?: 1 | -1; opacity?: number }) {
  return (
    <g opacity={opacity}>
      {ys.map((y) => {
        const mx = (x1 + x2) / 2;
        return (
          <g key={y}>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke={EC.E} strokeWidth={1.1} />
            <polygon points={`${mx + 5 * dir},${y} ${mx - 3 * dir},${y - 3.5} ${mx - 3 * dir},${y + 3.5}`} fill={EC.E} />
          </g>
        );
      })}
    </g>
  );
}

/** Vertical field lines (dir = 1 → downwards). */
export function VLines({ y1, y2, xs, dir = 1, opacity = 1 }: { y1: number; y2: number; xs: number[]; dir?: 1 | -1; opacity?: number }) {
  return (
    <g opacity={opacity}>
      {xs.map((x) => {
        const my = (y1 + y2) / 2;
        return (
          <g key={x}>
            <line x1={x} y1={y1} x2={x} y2={y2} stroke={EC.E} strokeWidth={1.1} />
            <polygon points={`${x},${my + 5 * dir} ${x - 3.5},${my - 3 * dir} ${x + 3.5},${my - 3 * dir}`} fill={EC.E} />
          </g>
        );
      })}
    </g>
  );
}

/** Radial field lines around a point charge. */
export function Radial({ x, y, sign, r0 = 14, r1 = 60, n = 8, opacity = 1 }: { x: number; y: number; sign: 1 | -1; r0?: number; r1?: number; n?: number; opacity?: number }) {
  return (
    <g opacity={opacity}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i * 2 * Math.PI) / n;
        const c = Math.cos(a);
        const s = Math.sin(a);
        const xa = x + c * r0;
        const ya = y + s * r0;
        const xb = x + c * r1;
        const yb = y + s * r1;
        return sign > 0 ? (
          <Vec key={i} x={xa} y={ya} dx={xb - xa} dy={yb - ya} color={EC.E} width={1.3} />
        ) : (
          <Vec key={i} x={xb} y={yb} dx={xa - xb} dy={ya - yb} color={EC.E} width={1.3} />
        );
      })}
    </g>
  );
}

export function Dot({ x, y, r = 3, color = C.ink }: { x: number; y: number; r?: number; color?: string }) {
  return <circle cx={x} cy={y} r={r} fill={color} />;
}

const SUP: Record<string, string> = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };

/** Scientific notation with Greek decimal comma and unicode exponent: sci(67500) → "6,75·10⁴". */
export function sci(v: number, digits = 2) {
  if (v === 0) return "0";
  const sgn = v < 0 ? "−" : "";
  const a = Math.abs(v);
  let e = Math.floor(Math.log10(a) + 1e-9);
  let m = a / Math.pow(10, e);
  if (Number(m.toFixed(digits)) >= 10) {
    e += 1;
    m /= 10;
  }
  const ms = Number(m.toFixed(digits)).toLocaleString("el-GR", { maximumFractionDigits: digits });
  if (e === 0) return `${sgn}${ms}`;
  const es = String(e).split("").map((c) => SUP[c] ?? c).join("");
  return `${sgn}${ms}·10${es}`;
}

/** Compact magnitude bars with free-text values (for tiny or huge numbers). */
export function BarsE({ x = 200, y, w = 156, items, max }: { x?: number; y: number; w?: number; items: { label: string; value: number; text: string; color: string }[]; max: number }) {
  const labelW = 34;
  const valueW = 70;
  const barW = Math.max(10, w - labelW - valueW - 4);
  return (
    <g>
      {items.map((it, i) => {
        const yy = y + i * 15;
        const len = Math.max(0, Math.min(1, Math.abs(it.value) / max)) * barW;
        return (
          <g key={it.label + i}>
            <TE x={x} y={yy + 11} s={it.label} size={10.5} color={it.color} anchor="start" italic />
            <rect x={x + labelW} y={yy + 3} width={barW} height={9} rx={2} fill="#eceef2" />
            <rect x={x + labelW} y={yy + 3} width={len} height={9} rx={2} fill={it.color} opacity={0.85} />
            <TE x={x + w} y={yy + 11} s={it.text} size={10} color={it.color} anchor="end" />
          </g>
        );
      })}
    </g>
  );
}

/** Like the kit's text, but understands both subscripts (_x, _{..}) and superscripts (^x, ^{..}). */
export function Rich({ s }: { s: string }) {
  const parts: ReactNode[] = [];
  const re = /_\{([^}]*)\}|_(\S)|\^\{([^}]*)\}|\^(\S)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) parts.push(s.slice(last, m.index));
    const sub = m[1] ?? m[2];
    const sup = m[3] ?? m[4];
    parts.push(
      <tspan key={i++} baselineShift={sub !== undefined ? "sub" : "super"} fontSize="70%">
        {sub ?? sup}
      </tspan>,
    );
    last = m.index + m[0].length;
  }
  if (last < s.length) parts.push(s.slice(last));
  return <>{parts}</>;
}

export function TE({
  x,
  y,
  s,
  size = 11,
  color = C.ink,
  anchor = "middle",
  bold = true,
  italic = false,
}: {
  x: number;
  y: number;
  s: string;
  size?: number;
  color?: string;
  anchor?: "start" | "middle" | "end";
  bold?: boolean;
  italic?: boolean;
}) {
  return (
    <text x={x} y={y} fontSize={size} fill={color} textAnchor={anchor} fontWeight={bold ? 700 : 400} fontStyle={italic ? "italic" : "normal"}>
      <Rich s={s} />
    </text>
  );
}

/** White panel with formula lines (first line bold), with superscripts. */
export function PanelE({ x = 200, y = 12, w = 156, lines, size = 10.5 }: { x?: number; y?: number; w?: number; lines: string[]; size?: number }) {
  const lh = size + 5.5;
  return (
    <g>
      <rect x={x} y={y} width={w} height={lines.length * lh + 8} rx={7} fill="#ffffff" stroke="#d6dae1" />
      {lines.map((l, i) => (
        <text key={i} x={x + 7} y={y + 4 + (i + 1) * lh - 3} fontSize={size} fill={C.ink} fontWeight={i === 0 ? 700 : 400}>
          <Rich s={l} />
        </text>
      ))}
    </g>
  );
}

/** Arrow with a label that understands superscripts. */
export function Arr({
  x,
  y,
  dx,
  dy = 0,
  color,
  label,
  width = 2.6,
  dashed = false,
  lx = 0,
  ly = -7,
  size = 11,
  opacity = 1,
}: {
  x: number;
  y: number;
  dx: number;
  dy?: number;
  color: string;
  label?: string;
  width?: number;
  dashed?: boolean;
  lx?: number;
  ly?: number;
  size?: number;
  opacity?: number;
}) {
  if (Math.hypot(dx, dy) < 3) return null;
  return (
    <g opacity={opacity}>
      <Vec x={x} y={y} dx={dx} dy={dy} color={color} width={width} dashed={dashed} />
      {label ? <TE x={x + dx / 2 + lx} y={y + dy / 2 + ly} s={label} size={size} color={color} italic /> : null}
    </g>
  );
}
