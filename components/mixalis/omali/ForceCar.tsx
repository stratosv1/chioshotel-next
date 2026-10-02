"use client";

import { useState } from "react";
import { Arrow, COLORS, G, Legend, Note, Pill, PlayButton, Slider, Stat, fmt, useClock, usePlaying } from "./shared";

const W = 300;
const C = W / 2;
const TRACK = 105;

export function ForceCar() {
  const [m, setM] = useState(1200);
  const [R, setR] = useState(20);
  const [kmh, setKmh] = useState(72);
  const [mu, setMu] = useState(0.8);
  const [playing, setPlaying] = usePlaying(true);
  const clock = useClock(playing);

  const v = kmh / 3.6;
  const F = (m * v * v) / R;
  const Tmax = mu * m * G;
  const safe = F <= Tmax;
  const vmax = Math.sqrt(mu * G * R);
  const needMu = (v * v) / (G * R);

  // Animation: visual angular speed grows with real ω but stays watchable.
  const omegaVis = Math.min(3.2, 0.25 + (v / R) * 0.9);
  const cycle = 4; // seconds per replay when sliding
  let x: number;
  let y: number;
  let heading: number;
  let sliding = false;
  if (safe) {
    const th = omegaVis * clock.t;
    x = C + TRACK * Math.cos(th);
    y = C - TRACK * Math.sin(th);
    heading = th + Math.PI / 2;
  } else {
    const local = clock.t % cycle;
    const tTurn = 1.1;
    const th0 = Math.PI * 1.5;
    if (local < tTurn) {
      const th = th0 + omegaVis * local;
      x = C + TRACK * Math.cos(th);
      y = C - TRACK * Math.sin(th);
      heading = th + Math.PI / 2;
    } else {
      sliding = true;
      const th = th0 + omegaVis * tTurn;
      const sx = C + TRACK * Math.cos(th);
      const sy = C - TRACK * Math.sin(th);
      heading = th + Math.PI / 2;
      const d = (local - tTurn) * TRACK * omegaVis;
      x = sx + d * Math.cos(heading);
      y = sy - d * Math.sin(heading);
    }
  }
  const dist = Math.hypot(C - x, C - y) || 1;
  const toCx = (C - x) / dist;
  const toCy = (C - y) / dist;
  const fLen = sliding ? 0 : 18 + 60 * Math.min(1, F / Math.max(Tmax, F));
  const deg = (-heading * 180) / Math.PI;

  // F–υ graph
  const gw = 300;
  const gh = 170;
  const pad = { l: 44, r: 10, t: 12, b: 28 };
  const vMaxPlot = 150; // km/h
  const fAt = (k: number) => (m * (k / 3.6) ** 2) / R;
  const fPlotMax = Math.max(fAt(vMaxPlot), Tmax) * 1.05;
  const gx = (k: number) => pad.l + (k / vMaxPlot) * (gw - pad.l - pad.r);
  const gy = (f: number) => gh - pad.b - (f / fPlotMax) * (gh - pad.t - pad.b);
  const curve = Array.from({ length: 61 }, (_, i) => {
    const k = (i / 60) * vMaxPlot;
    return `${i ? "L" : "M"}${gx(k).toFixed(1)},${gy(fAt(k)).toFixed(1)}`;
  }).join(" ");
  const k2 = kmh * 2;

  return (
    <div ref={clock.ref} className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <div className="rounded-2xl border border-black/10 bg-[#eef1ea] p-2">
            <svg viewBox={`0 0 ${W} ${W}`} className="mx-auto block w-full max-w-[380px]" role="img" aria-label="Αυτοκίνητο σε κυκλική στροφή με τη δύναμη της στατικής τριβής προς το κέντρο">
              <circle cx={C} cy={C} r={TRACK} fill="none" stroke="#9aa39a" strokeWidth="26" />
              <circle cx={C} cy={C} r={TRACK} fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="8 8" />
              <circle cx={C} cy={C} r="4" fill={COLORS.danger} />
              {!sliding ? <Arrow x1={x} y1={y} x2={x + toCx * fLen} y2={y + toCy * fLen} color={COLORS.accel} width={4} /> : null}
              <g transform={`translate(${x} ${y}) rotate(${deg})`}>
                <rect x="-13" y="-7.5" width="26" height="15" rx="4" fill={safe ? "#2f5fb3" : COLORS.danger} />
                <rect x="3" y="-6" width="7" height="12" rx="2" fill="white" opacity="0.7" />
              </g>
              {sliding ? (
                <text x={C} y={C + 6} textAnchor="middle" fontSize="15" fontWeight="700" fill={COLORS.danger}>
                  Ολίσθηση! Φεύγει εφαπτομενικά
                </text>
              ) : (
                <text x={C} y={C + 24} textAnchor="middle" fontSize="12" fill={COLORS.muted}>
                  Τ<tspan fontSize="9">στ</tspan> = mυ²/R
                </text>
              )}
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <PlayButton playing={playing} onToggle={() => setPlaying(!playing)} onReset={() => clock.setT(0)} />
            <Legend items={[{ color: COLORS.accel, label: "στατική τριβή = κεντρομόλος δύναμη" }]} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Pill
              active={m === 1200 && R === 20 && kmh === 72}
              onClick={() => {
                setM(1200);
                setR(20);
                setKmh(72);
              }}
            >
              Παράδειγμα σημειώσεων
            </Pill>
            <Pill active={kmh === 144} onClick={() => setKmh(144)}>Διπλάσια ταχύτητα</Pill>
          </div>
          <Slider label="Μάζα m" value={m} min={500} max={2500} step={50} onChange={setM} display={`${fmt(m, 0)} kg`} />
          <Slider label="Ακτίνα στροφής R" value={R} min={10} max={150} step={5} onChange={setR} display={`${R} m`} />
          <Slider
            label="Ταχύτητα υ"
            value={kmh}
            min={10}
            max={150}
            step={2}
            onChange={setKmh}
            display={`${kmh} km/h = ${fmt(v, 1)} m/s`}
            color={COLORS.velocity}
          />
          <Slider
            label="Συντελεστής τριβής μ (στεγνή άσφαλτος ≈ 0,8 · βρεγμένη ≈ 0,5 · πάγος ≈ 0,1)"
            value={mu}
            min={0.1}
            max={1.2}
            step={0.05}
            onChange={setMu}
            display={fmt(mu, 2)}
            color={COLORS.force}
          />
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Απαιτούμενη F = mυ²/R" value={fmt(F, 0)} unit="N" color={COLORS.accel} />
            <Stat label="Μέγιστη τριβή μmg" value={fmt(Tmax, 0)} unit="N" color={COLORS.force} />
            <Stat
              label="Μέγιστη ασφαλής υ = √(μgR)"
              value={`${fmt(vmax * 3.6, 0)}`}
              unit="km/h"
              color={safe ? COLORS.ok : COLORS.danger}
            />
            <Stat label="Χρειάζεται μ ≥ υ²/(gR)" value={fmt(needMu, 2)} color={safe ? COLORS.ok : COLORS.danger} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-2">
        <p className="px-2 pt-1 text-xs font-semibold text-[#857261]">
          Πόση δύναμη χρειάζεται σε κάθε ταχύτητα; (παραβολή: F ∝ υ²)
        </p>
        <svg viewBox={`0 0 ${gw} ${gh}`} className="mx-auto block w-full max-w-[560px]" role="img" aria-label="Γράφημα κεντρομόλου δύναμης ως προς την ταχύτητα">
          <rect x={pad.l} y={gy(fPlotMax)} width={gw - pad.l - pad.r} height={Math.max(0, gy(Tmax) - gy(fPlotMax))} fill={COLORS.danger} opacity="0.08" />
          <line x1={pad.l} y1={gh - pad.b} x2={gw - pad.r} y2={gh - pad.b} stroke={COLORS.muted} />
          <line x1={pad.l} y1={pad.t} x2={pad.l} y2={gh - pad.b} stroke={COLORS.muted} />
          {[0, 50, 100, 150].map((k) => (
            <text key={k} x={gx(k)} y={gh - 10} fontSize="10" textAnchor="middle" fill={COLORS.muted}>
              {k}
            </text>
          ))}
          <text x={gw - pad.r} y={gh - 1} fontSize="10" textAnchor="end" fill={COLORS.muted}>
            υ (km/h)
          </text>
          <text x={pad.l + 6} y={pad.t + 8} fontSize="10" fill={COLORS.muted}>
            F (kN)
          </text>
          {[0.5, 1].map((p) => (
            <text key={p} x={pad.l - 4} y={gy(fPlotMax * p) + 3} fontSize="10" textAnchor="end" fill={COLORS.muted}>
              {fmt((fPlotMax * p) / 1000, 0)}
            </text>
          ))}
          <line x1={pad.l} y1={gy(Tmax)} x2={gw - pad.r} y2={gy(Tmax)} stroke={COLORS.force} strokeWidth="1.5" strokeDasharray="5 4" />
          <text x={gw - pad.r - 2} y={gy(Tmax) - 4} fontSize="10" textAnchor="end" fill={COLORS.force}>
            όριο τριβής μmg
          </text>
          <path d={curve} fill="none" stroke={COLORS.accel} strokeWidth="2.5" />
          {k2 <= vMaxPlot ? (
            <g>
              <line x1={gx(kmh)} y1={gy(F)} x2={gx(k2)} y2={gy(fAt(k2))} stroke={COLORS.muted} strokeDasharray="3 3" />
              <circle cx={gx(k2)} cy={gy(fAt(k2))} r="4.5" fill="white" stroke={COLORS.accel} strokeWidth="2" />
              <text x={gx(k2) - 6} y={gy(fAt(k2)) + 4} fontSize="11" textAnchor="end" fill={COLORS.ink} fontWeight="600">
                2υ → 4F
              </text>
            </g>
          ) : null}
          <circle cx={gx(kmh)} cy={gy(F)} r="6" fill={safe ? COLORS.ok : COLORS.danger} stroke="white" strokeWidth="2" />
        </svg>
      </div>

      {m === 1200 && R === 20 && kmh === 72 ? (
        <Note title="Το παράδειγμα των σημειώσεων: F = 1200·20²/20 = 24 000 N">
          Για να γίνει αυτό με τριβή, χρειάζεται μ ≥ 2 — καμία πραγματική άσφαλτος δεν το δίνει! Στην πράξη ένα αυτοκίνητο
          με 72 km/h σε στροφή 20 m θα έφευγε από τον δρόμο. Γι' αυτό στις κλειστές στροφές οι πινακίδες λένε 30–40 km/h.
        </Note>
      ) : null}
    </div>
  );
}
