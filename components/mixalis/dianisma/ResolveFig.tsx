"use client";

import type { ReactNode } from "react";
import { Arrow } from "../omali/shared";
import { AngleArc, C, Txt } from "./figures";

const rad = (d: number) => (d * Math.PI) / 180;

/**
 * A force split along a reference axis: the component that "touches" the angle
 * (adjacent, teal, συν) and the other one (opposite, green, ημ).
 * Angles are math angles in degrees (counter-clockwise, y up).
 */
export function ResolveFig({
  phi,
  refDeg,
  axisRot = 0,
  angleLabel,
  forceLabel,
  adjLabel,
  oppLabel,
  showComponents = true,
  incline = false,
  baseLabel = "θ",
  showRefArc = true,
  ariaLabel,
}: {
  /** Direction of the force. */
  phi: number;
  /** Direction of the axis the angle is measured from. */
  refDeg: number;
  /** Rotation of the x axis (0 = horizontal). */
  axisRot?: number;
  angleLabel: string;
  forceLabel: ReactNode;
  adjLabel?: ReactNode;
  oppLabel?: ReactNode;
  showComponents?: boolean;
  /** Draw a block on a 30° incline; the force is drawn from the block. */
  incline?: boolean;
  baseLabel?: string;
  showRefArc?: boolean;
  ariaLabel: string;
}) {
  let ox = 120;
  let oy = 100;
  let L = 74;
  let extra: ReactNode = null;

  if (incline) {
    // Incline of 30° rising to the right, base vertex A.
    const ax = 18;
    const ay = 186;
    const t = 128;
    const dx = Math.cos(rad(30));
    const dy = -Math.sin(rad(30));
    const px = ax + t * dx;
    const py = ay + t * dy;
    const nx = -Math.sin(rad(30));
    const ny = -Math.cos(rad(30));
    ox = px + 15 * nx;
    oy = py + 15 * ny;
    L = 62;
    const rx = 226;
    const topY = ay - (rx - ax) * Math.tan(rad(30));
    extra = (
      <g>
        <polygon points={`${ax},${ay} ${rx},${ay} ${rx},${topY}`} fill="#efe7dc" stroke="#b9ab9b" strokeWidth={1.5} />
        <AngleArc cx={ax} cy={ay} r={34} a0={0} a1={30} label={baseLabel} labelR={baseLabel.length > 2 ? 66 : 50} color={C.ink} />
        <rect
          x={ox - 15}
          y={oy - 15}
          width={30}
          height={30}
          rx={3}
          fill="#c9822f"
          opacity={0.75}
          transform={`rotate(-30 ${ox} ${oy})`}
        />
      </g>
    );
  }

  const P = (X: number, Y: number) => [ox + X, oy - Y] as const;
  const ux = Math.cos(rad(phi));
  const uy = Math.sin(rad(phi));
  const rx = Math.cos(rad(refDeg));
  const ry = Math.sin(rad(refDeg));
  const dot = ux * rx + uy * ry;
  const [tx, ty] = P(ux * L, uy * L);
  const [ax2, ay2] = P(rx * dot * L, ry * dot * L);

  // Projections on the (possibly rotated) axes, for the "hidden" mode.
  const ex = Math.cos(rad(axisRot));
  const ey = Math.sin(rad(axisRot));
  const fx = -ey;
  const fy = ex;
  const pX = ux * ex + uy * ey;
  const pY = ux * fx + uy * fy;
  const [px1, py1] = P(ex * pX * L, ey * pX * L);
  const [px2, py2] = P(fx * pY * L, fy * pY * L);

  // Arc from the reference axis to the force, always counter-clockwise.
  const d = ((((phi - refDeg) % 360) + 540) % 360) - 180;
  const a0 = d >= 0 ? refDeg : refDeg + d;
  const a1 = a0 + Math.abs(d);

  // Label offsets: adjacent label pushed away from the tip, opposite label pushed outwards along the reference axis.
  const oppDx = tx - ax2;
  const oppDy = ty - ay2;
  const oppLen = Math.hypot(oppDx, oppDy) || 1;
  const adjOffX = -(oppDx / oppLen) * 10;
  const adjOffY = -(oppDy / oppLen) * 10;
  const adjMx = (ox + ax2) / 2 + adjOffX;
  const adjMy = (oy + ay2) / 2 + adjOffY + 4;
  const sgn = dot >= 0 ? 1 : -1;
  const oppOffX = rx * sgn * 10;
  const oppOffY = -ry * sgn * 10;
  const oppMx = (ax2 + tx) / 2 + oppOffX;
  const oppMy = (ay2 + ty) / 2 + oppOffY + 4;
  const anchorFor = (dx: number, dy: number): "start" | "middle" | "end" =>
    Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "end" : "start") : "middle";
  const adjAnchor = anchorFor(adjOffX, adjOffY);
  const oppAnchor = anchorFor(oppOffX, oppOffY);
  let [flx, fly] = P(ux * (L + 16), uy * (L + 16));
  let fAnchor: "start" | "middle" | "end" = ux < -0.35 ? "end" : ux > 0.35 ? "start" : "middle";
  if (fAnchor !== "middle") [flx, fly] = P(ux * (L + 6), uy * (L + 6) + (uy >= 0 ? 6 : -10));
  if (incline) {
    flx = ox - 7;
    fly = oy + L * 0.45;
    fAnchor = "end";
  }

  const axisLen = incline ? 60 : 105;
  const [xa1, ya1] = P(-ex * axisLen, -ey * axisLen);
  const [xa2, ya2] = P(ex * axisLen, ey * axisLen);
  const [yb1, yb2] = P(-fx * (incline ? 50 : 88), -fy * (incline ? 50 : 88));
  const [yc1, yc2] = P(fx * (incline ? 50 : 88), fy * (incline ? 50 : 88));

  return (
    <svg viewBox="0 0 240 200" className="w-full" role="img" aria-label={ariaLabel}>
      {extra}
      <line x1={xa1} y1={ya1} x2={xa2} y2={ya2} stroke="#cbbfb1" strokeWidth={1.2} strokeDasharray={incline ? "4 4" : undefined} />
      <line x1={yb1} y1={yb2} x2={yc1} y2={yc2} stroke="#cbbfb1" strokeWidth={1.2} strokeDasharray={incline ? "4 4" : undefined} />
      {!incline ? (
        <>
          <Txt x={xa2 - 2} y={ya2 + 14} color={C.muted} italic>x</Txt>
          <Txt x={yc1 - 9} y={yc2 + 6} color={C.muted} italic>y</Txt>
        </>
      ) : null}

      {showComponents ? (
        <>
          <Arrow x1={ox} y1={oy} x2={ax2} y2={ay2} color={C.teal} width={3.5} head={10} />
          <Arrow x1={ax2} y1={ay2} x2={tx} y2={ty} color={C.green} width={3} head={10} dashed />
        </>
      ) : (
        <>
          <line x1={tx} y1={ty} x2={px1} y2={py1} stroke={C.muted} strokeWidth={1} strokeDasharray="3 4" />
          <line x1={tx} y1={ty} x2={px2} y2={py2} stroke={C.muted} strokeWidth={1} strokeDasharray="3 4" />
        </>
      )}
      <Arrow x1={ox} y1={oy} x2={tx} y2={ty} color={C.orange} width={4.5} head={12} />
      {showRefArc ? <AngleArc cx={ox} cy={oy} r={incline ? 22 : 18} a0={a0} a1={a1} label={angleLabel} labelR={incline ? 36 : 31} color={C.ink} /> : null}
      <Txt x={flx} y={fly + 4} color={C.orange} size={13} anchor={fAnchor}>
        {forceLabel}
      </Txt>
      {showComponents && adjLabel ? (
        <Txt x={adjMx} y={adjMy} color={C.teal} size={12} anchor={adjAnchor}>
          {adjLabel}
        </Txt>
      ) : null}
      {showComponents && oppLabel ? (
        <Txt x={oppMx} y={oppMy} color={C.green} size={12} anchor={oppAnchor}>
          {oppLabel}
        </Txt>
      ) : null}
    </svg>
  );
}
