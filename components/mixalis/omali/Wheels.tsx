"use client";

import { useState } from "react";
import { Arrow, COLORS, Legend, Pill, PlayButton, Slider, Stat, fmt, useClock, usePlaying } from "./shared";

/** Παρατήρηση 3: rotating disk — same T, f, ω for every point, υ = ωr. */
export function RotatingDisk() {
  const [omega, setOmega] = useState(1);
  const [playing, setPlaying] = usePlaying(true);
  const clock = useClock(playing);
  const th = omega * clock.t;
  const C = 150;
  const RD = 120;
  const points = [
    { r: 0.33, color: "#2f5fb3", name: "A" },
    { r: 0.66, color: COLORS.mandarin, name: "B" },
    { r: 1, color: COLORS.danger, name: "Γ" },
  ];
  const Rreal = 0.3; // m, disk radius

  return (
    <div ref={clock.ref} className="grid gap-5 lg:grid-cols-2">
      <div>
        <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-2">
          <svg viewBox="0 0 300 300" className="mx-auto block w-full max-w-[360px]" role="img" aria-label="Περιστρεφόμενος δίσκος με τρία σημεία σε διαφορετικές αποστάσεις από το κέντρο">
            <circle cx={C} cy={C} r={RD} fill="#efe6da" stroke={COLORS.track} strokeWidth="2" />
            {[0.33, 0.66].map((r) => (
              <circle key={r} cx={C} cy={C} r={RD * r} fill="none" stroke={COLORS.track} strokeDasharray="3 4" />
            ))}
            <line x1={C} y1={C} x2={C + RD * Math.cos(th)} y2={C - RD * Math.sin(th)} stroke={COLORS.muted} strokeWidth="2" />
            {points.map((p) => {
              const x = C + RD * p.r * Math.cos(th);
              const y = C - RD * p.r * Math.sin(th);
              const len = 70 * p.r;
              return (
                <g key={p.name}>
                  <Arrow x1={x} y1={y} x2={x - Math.sin(th) * len} y2={y - Math.cos(th) * len} color={COLORS.velocity} width={3.5} />
                  <circle cx={x} cy={y} r="7" fill={p.color} stroke="white" strokeWidth="2" />
                  <text x={x + 9} y={y + 14} fontSize="12" fontWeight="700" fill={p.color}>
                    {p.name}
                  </text>
                </g>
              );
            })}
            <circle cx={C} cy={C} r="4" fill={COLORS.ink} />
          </svg>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <PlayButton playing={playing} onToggle={() => setPlaying(!playing)} />
          <Legend items={[{ color: COLORS.velocity, label: "γραμμική ταχύτητα" }]} />
        </div>
      </div>
      <div className="space-y-4">
        <Slider label="Γωνιακή ταχύτητα ω" value={omega} min={0.2} max={4} step={0.1} onChange={setOmega} display={`${fmt(omega, 1)} rad/s`} />
        <div className="grid gap-3">
          {points.map((p) => (
            <div key={p.name} className="flex flex-col gap-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span className="font-semibold" style={{ color: p.color }}>
                Σημείο {p.name} · r = {fmt(Rreal * p.r, 2)} m
              </span>
              <span className="font-mono tabular-nums">
                ω = {fmt(omega, 1)} · υ = <b style={{ color: COLORS.velocity }}>{fmt(omega * Rreal * p.r, 3)} m/s</b>
              </span>
            </div>
          ))}
        </div>
        <Stat label="Ίδια περίοδος για όλα: T = 2π/ω" value={fmt((2 * Math.PI) / omega, 2)} unit="s" />
        <p className="text-sm leading-6 text-[#6b625b]">
          Όλα τα σημεία κάνουν μία στροφή στον ίδιο χρόνο — όμως το Γ διανύει μεγαλύτερο κύκλο, άρα πρέπει να «τρέχει» πιο γρήγορα:
          <b> υ = ω·r</b>.
        </p>
      </div>
    </div>
  );
}

function Wheel({ cx, cy, r, angle, color, teeth }: { cx: number; cy: number; r: number; angle: number; color: string; teeth?: boolean }) {
  const spokes = 6;
  const toothCount = Math.max(8, Math.round(r / 4));
  return (
    <g>
      {teeth ? (
        <g transform={`rotate(${(-angle * 180) / Math.PI} ${cx} ${cy})`}>
          {Array.from({ length: toothCount }, (_, i) => {
            const a = (i / toothCount) * 360;
            return <rect key={i} x={cx - 3} y={cy - r - 6} width="6" height="8" fill={color} transform={`rotate(${a} ${cx} ${cy})`} />;
          })}
        </g>
      ) : null}
      <circle cx={cx} cy={cy} r={r} fill="#f7f1e8" stroke={color} strokeWidth="4" />
      {Array.from({ length: spokes }, (_, i) => {
        const a = angle + (i * 2 * Math.PI) / spokes;
        return <line key={i} x1={cx} y1={cy} x2={cx + r * 0.9 * Math.cos(a)} y2={cy - r * 0.9 * Math.sin(a)} stroke={color} strokeWidth="2" />;
      })}
      <circle cx={cx + r * 0.9 * Math.cos(angle)} cy={cy - r * 0.9 * Math.sin(angle)} r="5" fill={COLORS.danger} />
      <circle cx={cx} cy={cy} r="5" fill={color} />
    </g>
  );
}

/** Παρατηρήσεις 4–5: belt / gears — same rim speed υ, different ω. */
export function Wheels() {
  const [mode, setMode] = useState<"belt" | "gears">("belt");
  const [R1, setR1] = useState(60);
  const [R2, setR2] = useState(30);
  const [playing, setPlaying] = usePlaying(true);
  const clock = useClock(playing);
  const vRim = 40; // px/s, common rim speed
  const w1 = vRim / R1;
  const w2 = vRim / R2;
  const gears = mode === "gears";
  const c1 = { x: 95, y: 110 };
  const c2 = gears ? { x: c1.x + R1 + R2 + 4, y: 110 } : { x: 250, y: 110 };
  // Belt: CCW rotation for both. Gears: they turn in opposite senses.
  const a1 = w1 * clock.t;
  const a2 = gears ? -w2 * clock.t : w2 * clock.t;

  // Simple outer tangent lines for the belt.
  const dx = c2.x - c1.x;
  const alpha = Math.asin((R1 - R2) / dx);
  const top1 = { x: c1.x + R1 * Math.sin(alpha), y: c1.y - R1 * Math.cos(alpha) };
  const top2 = { x: c2.x + R2 * Math.sin(alpha), y: c2.y - R2 * Math.cos(alpha) };
  const bot1 = { x: c1.x + R1 * Math.sin(alpha), y: c1.y + R1 * Math.cos(alpha) };
  const bot2 = { x: c2.x + R2 * Math.sin(alpha), y: c2.y + R2 * Math.cos(alpha) };
  const dash = (clock.t * vRim) % 20;

  const ratio = R1 / R2;

  return (
    <div ref={clock.ref} className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Pill active={!gears} onClick={() => setMode("belt")}>Τροχοί με ιμάντα</Pill>
        <Pill active={gears} onClick={() => setMode("gears")}>Οδοντωτοί τροχοί</Pill>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-2">
            <svg viewBox="0 0 320 220" className="mx-auto block w-full max-w-[460px]" role="img" aria-label="Δύο τροχοί με ίδια γραμμική ταχύτητα στην περιφέρεια">
              {!gears ? (
                <g stroke="#3a332d" strokeWidth="3" strokeDasharray="10 10" strokeDashoffset={-dash}>
                  <line x1={top1.x} y1={top1.y} x2={top2.x} y2={top2.y} />
                  <line x1={bot2.x} y1={bot2.y} x2={bot1.x} y2={bot1.y} />
                </g>
              ) : null}
              <Wheel cx={c1.x} cy={c1.y} r={R1} angle={a1} color="#2f5fb3" teeth={gears} />
              <Wheel cx={c2.x} cy={c2.y} r={R2} angle={a2} color={COLORS.mandarin} teeth={gears} />
              <text x="10" y="210" fontSize="12" fill={COLORS.muted}>
                {gears ? "Γυρίζουν αντίθετα · ίδιο υ στο σημείο επαφής" : "Γυρίζουν ομόρροπα · ίδιο υ με τον ιμάντα"}
              </text>
            </svg>
          </div>
          <div className="mt-3">
            <PlayButton playing={playing} onToggle={() => setPlaying(!playing)} />
          </div>
        </div>
        <div className="space-y-4">
          <Slider label="Ακτίνα μεγάλου τροχού R₁" value={R1} min={30} max={80} step={1} onChange={(x) => setR1(Math.max(x, R2))} display={`${R1} cm`} color="#2f5fb3" />
          <Slider label="Ακτίνα μικρού τροχού R₂" value={R2} min={10} max={60} step={1} onChange={(x) => setR2(Math.min(x, R1))} display={`${R2} cm`} />
          <div className="grid grid-cols-2 gap-3">
            <Stat label="υ₁ = υ₂" value="ίδια" color={COLORS.velocity} hint="σημεία στην περιφέρεια" />
            <Stat label="ω₂ / ω₁ = R₁ / R₂" value={fmt(ratio, 2)} color={COLORS.mandarin} hint={`Ο μικρός κάνει ${fmt(ratio, 2)} στροφές για κάθε 1 του μεγάλου`} />
            <Stat label="ω₁" value={fmt(w1, 2)} unit="rad/s" color="#2f5fb3" />
            <Stat label="ω₂" value={fmt(w2, 2)} unit="rad/s" color={COLORS.mandarin} />
          </div>
          <p className="text-sm leading-6 text-[#6b625b]">
            Ο ιμάντας (ή τα δόντια) δεν γλιστράει, άρα κάθε σημείο της περιφέρειας τρέχει με την ίδια υ. Από <b>υ = ωR</b>: ο μικρός τροχός
            πρέπει να γυρίζει πιο γρήγορα. Ίδιες ακτίνες ⇒ ω₁ = ω₂.
          </p>
        </div>
      </div>
    </div>
  );
}
