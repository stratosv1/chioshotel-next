"use client";

import { useMemo, useState } from "react";
import { Arrow, COLORS, Legend, Pill, Slider, fmt } from "./shared";

/** Integrates a path where α keeps a fixed angle φ to υ (|α| constant). */
function simulatePath(angleDeg: number) {
  const phi = (angleDeg * Math.PI) / 180;
  let vx = 1;
  let vy = 0;
  let x = 0;
  let y = 0;
  const dt = 0.01;
  const pts: { x: number; y: number }[] = [{ x, y }];
  for (let i = 0; i < 700; i++) {
    const s = Math.hypot(vx, vy);
    if (s < 0.04) break;
    const ux = vx / s;
    const uy = vy / s;
    // rotate unit velocity by φ (counter-clockwise, y up)
    const ax = ux * Math.cos(phi) - uy * Math.sin(phi);
    const ay = ux * Math.sin(phi) + uy * Math.cos(phi);
    vx += ax * dt;
    vy += ay * dt;
    x += vx * dt;
    y += vy * dt;
    if (i % 4 === 0) pts.push({ x, y });
  }
  return { pts, finalSpeed: Math.hypot(vx, vy) };
}

export function AccelDirection() {
  const [angle, setAngle] = useState(90);
  const rad = (angle * Math.PI) / 180;
  const along = Math.cos(rad);
  const perp = Math.sin(rad);
  const verdict =
    Math.abs(along) < 0.02
      ? { text: "ούτε αυξάνεται ούτε ελαττώνεται — αλλάζει μόνο κατεύθυνση (κυκλική κίνηση!)", color: COLORS.velocity }
      : along > 0
        ? { text: "αυξάνεται (και, αν φ ≠ 0°, στρίβει)", color: COLORS.ok }
        : { text: "ελαττώνεται (και, αν φ ≠ 180°, στρίβει)", color: COLORS.danger };

  // Left panel: the vectors at one instant
  const ox = 70;
  const oy = 120;
  const vL = 120;
  const aL = 80;
  const axEnd = ox + aL * Math.cos(rad);
  const ayEnd = oy - aL * Math.sin(rad);

  const sim = useMemo(() => simulatePath(angle), [angle]);
  const box = 200;
  const bounds = sim.pts.reduce(
    (b, p) => ({
      minX: Math.min(b.minX, p.x),
      maxX: Math.max(b.maxX, p.x),
      minY: Math.min(b.minY, p.y),
      maxY: Math.max(b.maxY, p.y),
    }),
    { minX: 0, maxX: 0.1, minY: 0, maxY: 0.1 },
  );
  const span = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY, 0.5);
  const scale = (box - 30) / span;
  const mapX = (px: number) => 15 + (px - bounds.minX) * scale + ((span - (bounds.maxX - bounds.minX)) * scale) / 2;
  const mapY = (py: number) => box - 15 - (py - bounds.minY) * scale - ((span - (bounds.maxY - bounds.minY)) * scale) / 2;
  const path = sim.pts.map((p, i) => `${i ? "L" : "M"}${mapX(p.x).toFixed(1)},${mapY(p.y).toFixed(1)}`).join(" ");

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-2">
          <p className="px-2 pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#857261]">Μια χρονική στιγμή</p>
          <svg viewBox="0 0 260 200" className="mx-auto block w-full max-w-[380px]" role="img" aria-label="Διανύσματα ταχύτητας και επιτάχυνσης με γωνία φ">
            <Arrow x1={ox} y1={oy} x2={ox + vL} y2={oy} color={COLORS.velocity} width={5} />
            <text x={ox + vL - 4} y={oy + 20} fontSize="14" fill={COLORS.velocity} fontWeight="600">υ</text>
            {/* components of α */}
            <Arrow x1={ox} y1={oy} x2={ox + aL * along} y2={oy} color={COLORS.accel} width={2} dashed opacity={0.7} />
            <Arrow x1={ox} y1={oy} x2={ox} y2={oy - aL * perp} color={COLORS.accel} width={2} dashed opacity={0.7} />
            <Arrow x1={ox} y1={oy} x2={axEnd} y2={ayEnd} color={COLORS.accel} width={5} />
            <text x={axEnd + 6} y={ayEnd - 4} fontSize="14" fill={COLORS.accel} fontWeight="600">α</text>
            <path
              d={`M ${ox + 26} ${oy} A 26 26 0 ${angle > 180 ? 1 : 0} 0 ${ox + 26 * Math.cos(rad)} ${oy - 26 * Math.sin(rad)}`}
              fill="none"
              stroke={COLORS.muted}
              strokeWidth="1.5"
            />
            <text x={ox + 30} y={oy - 30} fontSize="13" fill={COLORS.muted}>φ</text>
            <circle cx={ox} cy={oy} r="9" fill={COLORS.accel} stroke="white" strokeWidth="2" />
            <text x="12" y="188" fontSize="9.5" fill={COLORS.muted}>
              α∥ = {fmt(along, 2)}·α (αλλάζει το μέτρο) · α⊥ = {fmt(perp, 2)}·α (στρίβει)
            </text>
          </svg>
        </div>
        <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-2">
          <p className="px-2 pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#857261]">Η τροχιά που προκύπτει</p>
          <svg viewBox={`0 0 ${box} ${box}`} className="mx-auto block w-full max-w-[260px]" role="img" aria-label="Τροχιά όταν η επιτάχυνση σχηματίζει σταθερή γωνία με την ταχύτητα">
            <path d={path} fill="none" stroke={COLORS.accel} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={mapX(0)} cy={mapY(0)} r="5" fill="#2f5fb3" />
            <text x={mapX(0) + 8} y={mapY(0) + 14} fontSize="11" fill={COLORS.muted}>αρχή</text>
          </svg>
        </div>
      </div>

      <Slider label="Γωνία φ ανάμεσα σε α και υ" value={angle} min={0} max={180} step={1} onChange={setAngle} display={`${angle}°`} color={COLORS.accel} />
      <div className="flex flex-wrap gap-2">
        <Pill active={angle === 0} onClick={() => setAngle(0)}>0° · ομόρροπα</Pill>
        <Pill active={angle === 180} onClick={() => setAngle(180)}>180° · αντίρροπα</Pill>
        <Pill active={angle === 90} onClick={() => setAngle(90)}>90° · κάθετα</Pill>
        <Pill active={angle === 60} onClick={() => setAngle(60)}>60°</Pill>
        <Pill active={angle === 120} onClick={() => setAngle(120)}>120°</Pill>
      </div>
      <p className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm leading-6">
        Με φ = <b>{angle}°</b> το μέτρο της ταχύτητας <b style={{ color: verdict.color }}>{verdict.text}</b>.
      </p>
      <Legend
        items={[
          { color: COLORS.velocity, label: "ταχύτητα" },
          { color: COLORS.accel, label: "επιτάχυνση" },
          { color: COLORS.accel, label: "συνιστώσες της α", dashed: true },
        ]}
      />
    </div>
  );
}
