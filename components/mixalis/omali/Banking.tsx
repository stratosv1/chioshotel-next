"use client";

import { useState } from "react";
import { Arrow, COLORS, G, Legend, Note, Pill, Slider, Stat, fmt } from "./shared";

/** Cases (α) airplane banking and (β) frictionless banked road: tanφ = υ²/(gR). */
export function Banking() {
  const [mode, setMode] = useState<"plane" | "road">("plane");
  const [kmh, setKmh] = useState(360);
  const [R, setR] = useState(1000);
  const [roadDeg, setRoadDeg] = useState(15);
  const [roadR, setRoadR] = useState(100);

  const isPlane = mode === "plane";
  const v = isPlane ? kmh / 3.6 : Math.sqrt(Math.tan((roadDeg * Math.PI) / 180) * G * roadR);
  const radius = isPlane ? R : roadR;
  const phi = isPlane ? Math.atan((v * v) / (G * radius)) : (roadDeg * Math.PI) / 180;
  const phiDeg = (phi * 180) / Math.PI;

  // Drawing: front view, centre of the turn is to the LEFT.
  const W = 320;
  const H = 240;
  const cx = 190;
  const cy = 130;
  const B = 70; // weight arrow length (px)
  const N = B / Math.cos(phi); // so that N_y = B exactly
  const Nlen = Math.min(N, 150);
  const k = Nlen / N; // shrink everything consistently if N too long
  const Bv = B * k;
  const nx = -Math.sin(phi) * Nlen;
  const ny = -Math.cos(phi) * Nlen;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Pill active={isPlane} onClick={() => setMode("plane")}>α) Αεροπλάνο που στρίβει</Pill>
        <Pill active={!isPlane} onClick={() => setMode("road")}>β) Λείος κεκλιμένος δρόμος</Pill>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-[#eef4f8] p-2">
          <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label="Ανάλυση δυνάμεων σε κλίση γωνίας φ">
            <text x="10" y="20" fontSize="11" fill={COLORS.muted}>← κέντρο της στροφής</text>
            {isPlane ? (
              <g transform={`translate(${cx} ${cy}) rotate(${-phiDeg})`}>
                <rect x="-110" y="-4" width="220" height="8" rx="4" fill="#5c6b7a" />
                <ellipse cx="0" cy="0" rx="18" ry="14" fill="#3e4a56" />
                <rect x="-4" y="-34" width="8" height="24" rx="3" fill="#5c6b7a" />
              </g>
            ) : (
              <g>
                {/* road surface rising towards the outside (right) */}
                <polygon
                  points={`${cx - 130},${cy + 8 + 130 * Math.tan(phi)} ${cx + 110},${cy + 8 - 110 * Math.tan(phi)} ${cx + 110},${H} ${cx - 130},${H}`}
                  fill="#c8bfb3"
                />
                <line
                  x1={cx - 130}
                  y1={cy + 8 + 130 * Math.tan(phi)}
                  x2={cx + 110}
                  y2={cy + 8 - 110 * Math.tan(phi)}
                  stroke="#7d7062"
                  strokeWidth="3"
                />
                <g transform={`translate(${cx} ${cy - 6}) rotate(${-phiDeg})`}>
                  <rect x="-30" y="-14" width="60" height="22" rx="5" fill="#2f5fb3" />
                  <circle cx="-17" cy="10" r="6" fill="#222" />
                  <circle cx="17" cy="10" r="6" fill="#222" />
                </g>

              </g>
            )}
            {/* forces */}
            <Arrow x1={cx} y1={cy} x2={cx} y2={cy + Bv} color={COLORS.muted} width={4} />
            <text x={cx + 6} y={cy + Bv} fontSize="13" fill={COLORS.muted} fontWeight="700">B</text>
            <Arrow x1={cx} y1={cy} x2={cx + nx} y2={cy + ny} color="#2f5fb3" width={4} />
            <text x={cx + nx - 18} y={cy + ny} fontSize="13" fill="#2f5fb3" fontWeight="700">N</text>
            <Arrow x1={cx} y1={cy} x2={cx + nx} y2={cy} color={COLORS.accel} width={3} dashed />
            <text x={cx + nx / 2 - 18} y={cy + 16} fontSize="11" fill={COLORS.accel} fontWeight="700">Nx = mυ²/R</text>
            <Arrow x1={cx + nx} y1={cy} x2={cx + nx} y2={cy + ny} color="#2f5fb3" width={1.5} dashed opacity={0.6} />
            <text x={cx + 8} y={cy - 40} fontSize="11" fill="#2f5fb3">Ny = B</text>
            <line x1={cx} y1={cy} x2={cx} y2={cy - 70} stroke={COLORS.muted} strokeDasharray="2 3" />
            <text x={cx - 22} y={cy - 46} fontSize="13" fill={COLORS.ink} fontWeight="700">φ</text>
            <text x="10" y={H - 10} fontSize="12" fill={COLORS.ink} fontWeight="600">
              φ = {fmt(phiDeg, 1)}°
            </text>
          </svg>
        </div>

        <div className="space-y-4">
          {isPlane ? (
            <>
              <Slider label="Ταχύτητα αεροπλάνου υ" value={kmh} min={100} max={900} step={10} onChange={setKmh} display={`${kmh} km/h`} color={COLORS.velocity} />
              <Slider label="Ακτίνα στροφής R" value={R} min={200} max={5000} step={50} onChange={setR} display={`${fmt(R, 0)} m`} />
            </>
          ) : (
            <>
              <Slider label="Κλίση δρόμου φ" value={roadDeg} min={2} max={40} step={1} onChange={setRoadDeg} display={`${roadDeg}°`} />
              <Slider label="Ακτίνα στροφής R" value={roadR} min={20} max={400} step={10} onChange={setRoadR} display={`${roadR} m`} />
            </>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Stat label={isPlane ? "Κλίση που χρειάζεται" : "Κλίση δρόμου"} value={fmt(phiDeg, 1)} unit="°" />
            <Stat label="εφφ = υ²/(gR)" value={fmt(Math.tan(phi), 3)} />
            <Stat label={isPlane ? "Ταχύτητα" : "Ταχύτητα σχεδιασμού υ = √(εφφ·g·R)"} value={fmt(v * 3.6, 0)} unit="km/h" color={COLORS.velocity} />
            <Stat label="Ν / Β = 1/συνφ" value={fmt(1 / Math.cos(phi), 2)} hint="Πόσες φορές «βαρύτερος» νιώθεις" />
          </div>
          <Legend
            items={[
              { color: COLORS.muted, label: "βάρος B" },
              { color: "#2f5fb3", label: isPlane ? "δύναμη αέρα N" : "κάθετη αντίδραση N" },
              { color: COLORS.accel, label: "οριζόντια συνιστώσα = κεντρομόλος", dashed: true },
            ]}
          />
        </div>
      </div>

      <Note>
        Η λογική είναι ίδια και στα δύο: <b>N<sub>y</sub> = B</b> (δεν ανεβαίνει ούτε πέφτει) και <b>N<sub>x</sub> = mυ²/R</b> (στρίβει). Διαιρώντας κατά μέλη
        <b> Nημφ / Nσυνφ = υ²/(gR)</b> ⇒ <b>εφφ = υ²/(gR)</b>. Η μάζα απλοποιείται — η κλίση δεν εξαρτάται από το πόσο βαρύ είναι το όχημα!
      </Note>
    </div>
  );
}
