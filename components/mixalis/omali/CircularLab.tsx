"use client";

import { useState } from "react";
import { Arrow, COLORS, Legend, Pill, PlayButton, Slider, Stat, fmt, useClock, usePlaying } from "./shared";

const W = 340;
const C = W / 2;

/** Main lab: R and T sliders, live υ, f, ω, α_κ with vectors on the circle. */
export function CircularLab() {
  const [R, setR] = useState(4);
  const [T, setT] = useState(4);
  const [playing, setPlaying] = usePlaying(true);
  const [showV, setShowV] = useState(true);
  const [showA, setShowA] = useState(true);
  const [showTrail, setShowTrail] = useState(true);
  const [showRadius, setShowRadius] = useState(true);
  const clock = useClock(playing);
  const t = clock.t;

  const v = (2 * Math.PI * R) / T;
  const f = 1 / T;
  const w = (2 * Math.PI) / T;
  const a = (v * v) / R;
  const laps = Math.floor(t / T);
  const phase = (t % T) / T;

  const rPx = 22 + R * 12; // R ∈ [1,10] → 34…142 px
  const theta = 2 * Math.PI * phase; // counter-clockwise
  const x = C + rPx * Math.cos(theta);
  const y = C - rPx * Math.sin(theta);

  // Arrow lengths: indicative, monotonic in the true value.
  const vLen = 14 + 86 * Math.min(1, v / 40);
  const aLen = 10 + 80 * Math.min(1, Math.sqrt(a / 200));
  const tx = -Math.sin(theta);
  const ty = -Math.cos(theta);
  const cx = (C - x) / rPx;
  const cy = (C - y) / rPx;

  const trail = Array.from({ length: 12 }, (_, i) => {
    const th = theta - ((i + 1) * 2 * Math.PI) / 16;
    return { x: C + rPx * Math.cos(th), y: C - rPx * Math.sin(th), o: 0.55 - i * 0.04 };
  });

  return (
    <div ref={clock.ref} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div>
        <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-2">
          <svg viewBox={`0 0 ${W} ${W}`} className="mx-auto block w-full max-w-[420px]" role="img" aria-label="Υλικό σημείο σε ομαλή κυκλική κίνηση με διανύσματα ταχύτητας και επιτάχυνσης">
            {/* grid */}
            {Array.from({ length: 9 }, (_, i) => (
              <g key={i} stroke={COLORS.grid} strokeWidth="1">
                <line x1={(i + 1) * 34} y1="0" x2={(i + 1) * 34} y2={W} />
                <line x1="0" y1={(i + 1) * 34} x2={W} y2={(i + 1) * 34} />
              </g>
            ))}
            <circle cx={C} cy={C} r={rPx} fill="none" stroke={COLORS.track} strokeWidth="2" strokeDasharray="4 5" />
            <circle cx={C} cy={C} r="4" fill={COLORS.danger} />
            {showRadius ? (
              <g>
                <line x1={C} y1={C} x2={x} y2={y} stroke={COLORS.muted} strokeWidth="1.5" />
                <text x={(C + x) / 2 + 6} y={(C + y) / 2 - 6} fontSize="13" fill={COLORS.muted} fontStyle="italic">
                  R
                </text>
              </g>
            ) : null}
            {showTrail ? trail.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="5" fill={COLORS.accel} opacity={p.o} />) : null}
            {showA ? <Arrow x1={x} y1={y} x2={x + cx * aLen} y2={y + cy * aLen} color={COLORS.accel} width={4} /> : null}
            {showV ? <Arrow x1={x} y1={y} x2={x + tx * vLen} y2={y + ty * vLen} color={COLORS.velocity} width={4} /> : null}
            <circle cx={x} cy={y} r="8" fill="#2f5fb3" stroke="white" strokeWidth="2" />
            <text x="10" y="22" fontSize="13" fill={COLORS.muted}>
              t = {fmt(t, 1)} s · περιστροφές: {laps}
            </text>
          </svg>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <PlayButton playing={playing} onToggle={() => setPlaying(!playing)} onReset={() => clock.setT(0)} />
          <Legend
            items={[
              { color: COLORS.velocity, label: "ταχύτητα υ" },
              { color: COLORS.accel, label: "κεντρομόλος επιτάχυνση α" },
            ]}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Pill active={showV} onClick={() => setShowV(!showV)}>υ</Pill>
          <Pill active={showA} onClick={() => setShowA(!showA)}>α</Pill>
          <Pill active={showTrail} onClick={() => setShowTrail(!showTrail)}>ίχνος</Pill>
          <Pill active={showRadius} onClick={() => setShowRadius(!showRadius)}>ακτίνα</Pill>
        </div>
      </div>

      <div className="space-y-5">
        <Slider label="Ακτίνα R" value={R} min={1} max={10} step={0.5} onChange={setR} display={`${fmt(R, 1)} m`} />
        <Slider label="Περίοδος T" value={T} min={1} max={10} step={0.5} onChange={setT} display={`${fmt(T, 1)} s`} color={COLORS.velocity} />

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Συχνότητα f = 1/T" value={fmt(f, 3)} unit="Hz" hint={`${fmt(f, 2)} περιστροφές κάθε δευτερόλεπτο`} />
          <Stat label="Μήκος κύκλου 2πR" value={fmt(2 * Math.PI * R, 1)} unit="m" />
          <Stat label="Ταχύτητα υ = 2πR/T" value={fmt(v, 2)} unit="m/s" color={COLORS.velocity} />
          <Stat label="Γωνιακή ω = 2π/T" value={fmt(w, 2)} unit="rad/s" />
          <div className="col-span-2">
            <Stat
              label="Κεντρομόλος επιτάχυνση α = υ²/R"
              value={fmt(a, 2)}
              unit="m/s²"
              color={COLORS.accel}
              hint="Πάντα κάθετη στην ταχύτητα, πάντα προς το κέντρο. Το μέτρο της μένει σταθερό, η κατεύθυνση όχι."
            />
          </div>
        </div>

        <p className="text-xs leading-5 text-[#857261]">
          Τα μήκη των βελών είναι ενδεικτικά (μεγαλώνουν όταν μεγαλώνει το μέγεθος), όχι σε ακριβή κλίμακα.
        </p>
      </div>
    </div>
  );
}
