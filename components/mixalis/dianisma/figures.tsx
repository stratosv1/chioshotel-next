"use client";

import type { ReactNode } from "react";
import { Arrow } from "../omali/shared";

export const C = {
  ink: "#2c2825",
  muted: "#857261",
  teal: "#0f8b8d",
  orange: "#e0731f",
  green: "#2e8b57",
  purple: "#7b4fa3",
  grid: "#e7dfd4",
};

/** Vector letter with a small arrow above it, for use inside SVG. */
export function VL({
  x,
  y,
  children,
  color = C.ink,
  size = 15,
  arrowDx = 0,
  hat = false,
}: {
  x: number;
  y: number;
  children: ReactNode;
  color?: string;
  size?: number;
  /** Shift the arrow sideways (e.g. for "−A" so it sits over the A). */
  arrowDx?: number;
  /** Draw a hat (unit vector) instead of an arrow. */
  hat?: boolean;
}) {
  const ay = y - size + 1;
  const cx = x + arrowDx;
  return (
    <g>
      <text x={x} y={y} textAnchor="middle" fontSize={size} fontStyle="italic" fontWeight={700} fill={color}>
        {children}
      </text>
      {hat ? (
        <polyline points={`${cx - 5},${ay + 1} ${cx},${ay - 4} ${cx + 5},${ay + 1}`} fill="none" stroke={color} strokeWidth={1.5} />
      ) : (
        <Arrow x1={cx - 6} y1={ay - 1} x2={cx + 7} y2={ay - 1} color={color} width={1.4} head={4} />
      )}
    </g>
  );
}

/** Vector letter with an arrow above it, for use in normal text. */
export function V({ children, hat = false }: { children: ReactNode; hat?: boolean }) {
  return (
    <span className="relative inline-block px-[1px] font-semibold italic">
      {children}
      <span aria-hidden className="pointer-events-none absolute -top-[0.62em] left-0 right-0 text-center text-[0.72em] not-italic leading-none">
        {hat ? "^" : "→"}
      </span>
    </span>
  );
}

/** Angle arc from angle a0 to a1 (degrees, counter-clockwise, y up) around (cx, cy). */
export function AngleArc({
  cx,
  cy,
  r,
  a0 = 0,
  a1,
  color = C.muted,
  label,
  labelR,
}: {
  cx: number;
  cy: number;
  r: number;
  a0?: number;
  a1: number;
  color?: string;
  label?: string;
  labelR?: number;
}) {
  const t0 = (a0 * Math.PI) / 180;
  const t1 = (a1 * Math.PI) / 180;
  const sx = cx + r * Math.cos(t0);
  const sy = cy - r * Math.sin(t0);
  const ex = cx + r * Math.cos(t1);
  const ey = cy - r * Math.sin(t1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const mid = (t0 + t1) / 2;
  const lr = labelR ?? r + 11;
  return (
    <g>
      <path d={`M${sx},${sy} A${r},${r} 0 ${large} 0 ${ex},${ey}`} fill="none" stroke={color} strokeWidth={1.5} />
      {label ? (
        <text x={cx + lr * Math.cos(mid)} y={cy - lr * Math.sin(mid) + 5} textAnchor="middle" fontSize={13} fontStyle="italic" fill={color}>
          {label}
        </text>
      ) : null}
    </g>
  );
}

/** Subscript inside SVG text (HTML <sub> is not valid in SVG). */
export function Sb({ children }: { children: ReactNode }) {
  return (
    <tspan baselineShift="sub" fontSize="0.72em">
      {children}
    </tspan>
  );
}

export function Dot({ x, y, color = C.ink }: { x: number; y: number; color?: string }) {
  return <circle cx={x} cy={y} r={3.5} fill="white" stroke={color} strokeWidth={2} />;
}

export function Txt({
  x,
  y,
  children,
  color = C.muted,
  size = 12,
  anchor = "middle",
  italic = false,
}: {
  x: number;
  y: number;
  children: ReactNode;
  color?: string;
  size?: number;
  anchor?: "start" | "middle" | "end";
  italic?: boolean;
}) {
  return (
    <text x={x} y={y} fontSize={size} fill={color} textAnchor={anchor} fontStyle={italic ? "italic" : undefined}>
      {children}
    </text>
  );
}
