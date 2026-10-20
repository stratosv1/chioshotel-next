"use client";

import { useState } from "react";
import { Arrow, Pill, Slider, Stat, fmt } from "../omali/shared";
import { AngleArc, C, Sb, Txt, VL } from "./figures";

const W = 360;
const H = 256;
const OX = 50;
const OY = 210;
const SCALE = 16; // px per N

export function ComponentsLab() {
  const [F, setF] = useState(10);
  const [deg, setDeg] = useState(30);
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const Fx = F * cos;
  const Fy = F * sin;

  const tipX = OX + Fx * SCALE;
  const tipY = OY - Fy * SCALE;
  const midX = (OX + tipX) / 2;
  const midY = (OY + tipY) / 2;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
      <div className="rounded-2xl border border-black/10 bg-white p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Δύναμη F και οι συνιστώσες της">
          {/* axes */}
          <Arrow x1={OX - 10} y1={OY} x2={W - 12} y2={OY} color="#cbbfb1" width={1.5} head={8} />
          <Arrow x1={OX} y1={OY + 10} x2={OX} y2={14} color="#cbbfb1" width={1.5} head={8} />
          <Txt x={W - 14} y={OY + 18} color={C.muted} italic>x</Txt>
          <Txt x={OX - 12} y={20} color={C.muted} italic>y</Txt>
          <Txt x={OX - 10} y={OY + 18} color={C.muted} italic>O</Txt>

          {/* triangle sides */}
          <line x1={OX} y1={tipY} x2={tipX} y2={tipY} stroke={C.green} strokeWidth={1} strokeDasharray="3 4" opacity={0.6} />
          <line x1={tipX} y1={OY} x2={tipX} y2={tipY} stroke={C.green} strokeWidth={2} strokeDasharray="5 4" />
          {deg > 2 && deg < 88 ? (
            <path d={`M${tipX - 10},${OY} L${tipX - 10},${OY - 10} L${tipX},${OY - 10}`} fill="none" stroke={C.muted} strokeWidth={1} />
          ) : null}

          {/* components */}
          <Arrow x1={OX} y1={OY} x2={tipX} y2={OY} color={C.teal} width={4} head={11} />
          <Arrow x1={OX} y1={OY} x2={OX} y2={tipY} color={C.green} width={4} head={11} />
          {/* the force */}
          <Arrow x1={OX} y1={OY} x2={tipX} y2={tipY} color={C.orange} width={4.5} head={13} />

          {deg > 3 ? <AngleArc cx={OX} cy={OY} r={34} a1={deg} label="θ" labelR={46} color={C.ink} /> : null}

          <VL x={midX - 14 * sin} y={midY - 10 * cos} color={C.orange}>F</VL>
          {Fx > 1.2 ? (
            <Txt x={(OX + tipX) / 2} y={OY + 22} color={C.teal} size={13} italic>
              F<Sb>x</Sb> = {fmt(Fx, 2)} N
            </Txt>
          ) : null}
          {Fx > 3 ? (
            <Txt x={(OX + tipX) / 2} y={OY + 36} color={C.teal} size={11}>
              (προσκείμενη)
            </Txt>
          ) : null}
          {Fy > 1.2 ? (
            <Txt x={OX - 6} y={(OY + tipY) / 2} color={C.green} size={13} anchor="end" italic>
              F<Sb>y</Sb>
            </Txt>
          ) : null}
          {Fy > 2 && Fx > 2 ? (
            <Txt x={tipX + 6} y={(OY + tipY) / 2 + 4} color={C.green} size={11} anchor="start">
              {fmt(Fy, 2)} N (απέναντι)
            </Txt>
          ) : null}
        </svg>
      </div>

      <div className="space-y-4">
        <Slider label="Μέτρο δύναμης F" value={F} min={1} max={12} step={1} onChange={setF} display={`${F} N`} color={C.orange} />
        <Slider label="Γωνία θ με τον άξονα x" value={deg} min={0} max={90} step={1} onChange={setDeg} display={`${deg}°`} color={C.ink} />
        <div className="flex flex-wrap gap-2">
          {[0, 30, 45, 60, 90].map((a) => (
            <Pill key={a} active={deg === a} onClick={() => setDeg(a)}>
              {a}°
            </Pill>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat
            label={<>F<sub>x</sub> = F·συνθ</>}
            value={fmt(Fx, 2)}
            unit="N"
            color={C.teal}
            hint={`${F} · συν${deg}° = ${F} · ${fmt(cos, 3)}`}
          />
          <Stat
            label={<>F<sub>y</sub> = F·ημθ</>}
            value={fmt(Fy, 2)}
            unit="N"
            color={C.green}
            hint={`${F} · ημ${deg}° = ${F} · ${fmt(sin, 3)}`}
          />
        </div>
        <p className="rounded-xl bg-[#f3efe8] px-3 py-2 text-[13px] leading-6 text-[#5c534c]">
          <b>Έλεγχος με Πυθαγόρειο:</b> √(F<sub>x</sub>² + F<sub>y</sub>²) = √({fmt(Fx * Fx, 2)} + {fmt(Fy * Fy, 2)}) = <b>{fmt(Math.hypot(Fx, Fy), 2)} N</b> = F ✔
        </p>
      </div>
    </div>
  );
}
