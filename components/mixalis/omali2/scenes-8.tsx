"use client";

import { Ball, C, T, Tag, seg } from "@/components/mixalis/ormi/kit";
import { Along, Angle, CarBack, K, MagBars, Orbit, P, Panel, inward, tang, type OCase } from "./kit2";

/* Extra cases for section 2 (roads and rotating surfaces), not on the poster grid. */

/* ───────── 35. Στροφή με κλίση και τριβή ───────── */
const SIN = 0.6;
const COS = 0.8;
const PHI35 = Math.atan2(SIN, COS); // ημφ = 0,6, συνφ = 0,8
const M35 = 1000;
const R35 = 40;
const MG35 = M35 * 10;
const FC35 = (M35 * 20 * 20) / R35; // mυ²/R = 10000 N
const N35 = MG35 * COS + FC35 * SIN; // 14000 N
const F35 = FC35 * COS - MG35 * SIN; // 2000 N, down the slope

const case35: OCase = {
  n: 35,
  title: "Στροφή με κλίση και τριβή",
  what: "Αυτοκίνητο σε στροφή με κλίση, όπως στο κουτάκι 6, αλλά τώρα πάει πιο γρήγορα από την «ιδανική» ταχύτητα του δρόμου. Τείνει να γλιστρήσει προς τα πάνω (έξω), οπότε η στατική τριβή δείχνει προς τα κάτω στην πλαγιά. Το βλέπουμε από πίσω.",
  given: "m = 1000 kg, R = 40 m, ημφ = 0,6 και συνφ = 0,8 (φ ≈ 37°), υ = 20 m/s, g = 10 m/s².",
  ask: "Την κάθετη δύναμη N και τη στατική τριβή T_σ. Ποια είναι η ταχύτητα υ₀ με την οποία δεν χρειάζεται καθόλου τριβή;",
  period: 14,
  legend: ["F"],
  phases: [
    {
      until: 3.5,
      label: "Τρεις δυνάμεις",
      say: "Βάρος mg κατακόρυφα, κάθετη N κάθετα στον δρόμο και στατική τριβή T_σ πάνω στην πλαγιά, προς τα κάτω: το αυτοκίνητο «θέλει» να βγει προς τα έξω και η τριβή το εμποδίζει.",
    },
    {
      until: 7,
      label: "Κατακόρυφα",
      say: "Αναλύουμε οριζόντια και κατακόρυφα (όχι κατά την πλαγιά!). Κατακόρυφα ισορροπία: N·συνφ − T_σ·ημφ = mg. Η τριβή εδώ δείχνει λίγο προς τα κάτω, γι' αυτό μπαίνει με «−».",
    },
    {
      until: 10.5,
      label: "Οριζόντια",
      say: "Οριζόντια, προς το κέντρο, δείχνουν και οι δύο: N·ημφ + T_σ·συνφ = mυ²/R = 10000 N. Λύνουμε το σύστημα: N = 14000 N και T_σ = 2000 N.",
    },
    {
      until: 14,
      label: "Πότε δεν θέλει τριβή",
      say: "Χωρίς τριβή (κουτάκι 6): εφφ = υ₀²/(gR) ⇒ υ₀ = √(gR·εφφ) = √300 ≈ 17,3 m/s. Με υ > υ₀ η τριβή δείχνει προς τα κάτω, με υ < υ₀ προς τα πάνω.",
    },
  ],
  Scene: ({ t }) => {
    const x0 = 22;
    const y0 = 180;
    const slope = SIN / COS;
    const roadY = (x: number) => y0 - slope * (x - x0);
    const xEnd = 190;
    const cxCar = 112;
    const cyRoad = roadY(cxCar);
    const nU: [number, number] = [-SIN, -COS];
    const downU: [number, number] = [-COS, SIN];
    const ax = cxCar + nU[0] * 16;
    const ay = cyRoad + nU[1] * 16 - 2;
    const k = 0.0052; // px per N
    const p2 = t >= 3.5;
    const p3 = t >= 7;
    const p4 = t >= 10.5;
    const fade = (on: boolean) => (on ? 0.35 : 1);
    return (
      <g>
        <path d={`M ${x0} ${y0} L ${xEnd} ${roadY(xEnd)} L ${xEnd} ${y0} Z`} fill="#e9e4da" stroke={C.edge} strokeWidth={1.4} />
        <line x1={x0} y1={y0} x2={xEnd} y2={y0} stroke={C.ground} strokeWidth={1} strokeDasharray="4 3" />
        <Angle cx={x0} cy={y0} r={26} a0={0} a1={PHI35} label="φ" />
        <CarBack x={cxCar} y={cyRoad} rot={(-PHI35 * 180) / Math.PI} />
        <circle cx={ax} cy={ay} r={2.4} fill={C.ink} />
        <Along x={ax} y={ay} u={nU} len={N35 * k} color={K.F} label="N" width={3} labelSide="left" opacity={fade(p2 && !p4)} />
        <Along x={ax} y={ay} u={downU} len={F35 * k * 2.2} color={K.F} label="T_σ" width={3} labelSide="left" opacity={fade(p2 && !p4)} />
        <Along x={ax} y={ay} u={[0, 1]} len={MG35 * k} color={K.g} label="mg" width={3} labelSide="right" />
        {p2 && !p3 ? (
          <g opacity={seg(t, 3.5, 4.2)}>
            <Along x={ax} y={ay} u={[0, -1]} len={N35 * COS * k} color={K.F} label="N·συνφ" dashed labelSide="right" />
            <Along x={ax - 6} y={ay} u={[0, 1]} len={F35 * SIN * k * 2.2} color={K.F} dashed />
            <T x={ax - 30} y={ay + 30} s="T_σ·ημφ" size={9.5} color={K.F} anchor="end" italic />
          </g>
        ) : null}
        {p3 && !p4 ? (
          <g opacity={seg(t, 7, 7.7)}>
            <Along x={ax} y={ay} u={[-1, 0]} len={N35 * SIN * k} color={K.F} dashed />
            <T x={ax - N35 * SIN * k - 4} y={ay - 5} s="N·ημφ" size={10} color={K.F} anchor="end" italic />
            <Along x={ax} y={ay + 7} u={[-1, 0]} len={F35 * COS * k * 2.2} color={K.F} dashed />
            <T x={ax - F35 * COS * k * 2.2 - 4} y={ay + 18} s="T_σ·συνφ" size={9.5} color={K.F} anchor="end" italic />
          </g>
        ) : null}
        {p4 ? <Tag x={20} y={42} s="υ > υ₀ ⇒ T_σ προς τα κάτω" color={K.F} show /> : null}
        <T x={14} y={22} s="← κέντρο της στροφής" size={10} color={C.muted} anchor="start" bold={false} />
        <Panel
          x={206}
          y={14}
          w={148}
          lines={
            !p2
              ? ["Δυνάμεις", "mg = 10000 N", "N ⊥ δρόμο", "T_σ κατά την πλαγιά ↙"]
              : !p3
                ? ["Κατακόρυφα: ισορροπία", "N·συνφ − T_σ·ημφ = mg", "0,8N − 0,6T_σ = 10000"]
                : !p4
                  ? ["Οριζόντια: προς κέντρο", "N·ημφ + T_σ·συνφ = mυ²/R", "0,6N + 0,8T_σ = 10000", "⇒ N = 14000 N", "⇒ T_σ = 2000 N"]
                  : ["Χωρίς τριβή", "υ₀² = gR·εφφ = 300", "υ₀ ≈ 17,3 m/s", "υ > υ₀: T_σ ↙", "υ < υ₀: T_σ ↗"]
          }
        />
        <MagBars
          y={150}
          x={206}
          w={150}
          max={15000}
          unit="N"
          items={
            p3
              ? [
                  { label: "mg", value: MG35, color: K.g },
                  { label: "N", value: N35, color: K.F },
                  { label: "T_σ", value: F35, color: K.F },
                ]
              : [{ label: "mg", value: MG35, color: K.g }]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      Κατακόρυφα: N·συνφ − T<sub>σ</sub>·ημφ = mg. Οριζόντια (προς το κέντρο): N·ημφ + T<sub>σ</sub>·συνφ = mυ²/R = 10000 N. Πολλαπλασιάζοντας με συνφ
      και ημφ και προσθέτοντας: <b>N = mg·συνφ + (mυ²/R)·ημφ = 8000 + 6000 = 14000 N</b>. Αφαιρώντας:{" "}
      <b>T<sub>σ</sub> = (mυ²/R)·συνφ − mg·ημφ = 8000 − 6000 = 2000 N</b>, προς τα κάτω στην πλαγιά. Χωρίς τριβή:{" "}
      <b>υ₀ = √(gR·εφφ) = √(10·40·0,75) ≈ 17,3 m/s</b>.
    </>
  ),
  trap: "Ανάλυσε σε οριζόντιο και κατακόρυφο άξονα, όχι κατά την πλαγιά: η επιτάχυνση (κεντρομόλος) είναι οριζόντια. Και η φορά της τριβής δεν είναι δεδομένη: προς τα κάτω αν υ > υ₀, προς τα πάνω αν υ < υ₀.",
};

/* ───────── 36. Χάντρα σε λείο οριζόντιο δαχτυλίδι ───────── */
const M36 = 0.1;
const R36 = 0.5;
const V36 = 2;
const MG36 = M36 * 10; // 1 N
const NC36 = (M36 * V36 * V36) / R36; // 0,8 N
const CX = 100;
const CY = 92;
const RR = 62;

const case36: OCase = {
  n: 36,
  title: "Χάντρα σε οριζόντιο δαχτυλίδι",
  what: "Μια χάντρα γλιστράει χωρίς τριβή σε σύρμα λυγισμένο σε οριζόντιο κύκλο. Το σύρμα της ασκεί δύο δυνάμεις: μία οριζόντια προς το κέντρο (η κεντρομόλος) και μία κατακόρυφη προς τα πάνω (κρατά το βάρος).",
  given: "m = 0,1 kg, ακτίνα δαχτυλιδιού r = 0,5 m, υ = 2 m/s, g = 10 m/s², χωρίς τριβή.",
  ask: "Την οριζόντια δύναμη N του σύρματος, την κατακόρυφη R και τη συνολική δύναμη που ασκεί το σύρμα.",
  period: 13,
  legend: ["v", "F"],
  phases: [
    {
      until: 4,
      label: "Από πάνω",
      say: "Από ψηλά: η χάντρα γράφει κύκλο με σταθερό μέτρο υ. Η μόνη οριζόντια δύναμη είναι η N του σύρματος προς το κέντρο: N = mυ²/r = 0,1·4/0,5 = 0,8 N.",
    },
    {
      until: 7.5,
      label: "Από το πλάι",
      say: "Από το πλάι: κατακόρυφα η χάντρα δεν κινείται, άρα το σύρμα τη σπρώχνει και προς τα πάνω με R = mg = 1 N. Αυτή δεν μπαίνει στην κεντρομόλο.",
    },
    {
      until: 10,
      label: "Συνολική δύναμη",
      say: "Το σύρμα ασκεί συνολικά F = √(N² + R²) = √(0,64 + 1) ≈ 1,28 N, γερμένη προς τα πάνω και προς το κέντρο.",
    },
    {
      until: 13,
      label: "Διπλάσια ταχύτητα",
      say: "Με υ = 4 m/s η N γίνεται τετραπλάσια (3,2 N), γιατί N ∝ υ². Η R μένει 1 N: το βάρος δεν αλλάζει.",
    },
  ],
  Scene: ({ t }) => {
    const p2 = t >= 4 && t < 10;
    const p3 = t >= 7.5 && t < 10;
    const p4 = t >= 10;
    const v = p4 ? 2 * V36 : V36;
    const nc = (M36 * v * v) / R36;
    const om = p4 ? 2.4 : 1.2;
    const th = 0.5 + om * t;
    const [x, y] = P(CX, CY, RR, th);
    const kN = 22; // px per N in the top view
    const sx = 300; // side view bead
    const sy = 150;
    return (
      <g>
        <Orbit cx={CX} cy={CY} r={RR} showCentre={false} />
        <circle cx={CX} cy={CY} r={RR} fill="none" stroke="#8a8f99" strokeWidth={4} opacity={0.55} />
        <circle cx={CX} cy={CY} r={2.6} fill="#6b6b6b" />
        <T x={CX + 6} y={CY + 4} s="κέντρο" size={9} color={C.muted} anchor="start" bold={false} />
        <Ball cx={x} cy={y} r={7} fill={C.b1} />
        <Along x={x} y={y} u={tang(th)} len={p4 ? 44 : 28} color={K.v} label="υ" labelSide="right" />
        <Along x={x} y={y} u={inward(th)} len={nc * kN} color={K.F} label="N" width={3} labelSide="below" />
        <T x={22} y={26} s="κάτοψη" size={9.5} color={C.muted} anchor="start" bold={false} />
        {p2 ? (
          <g>
            <rect x={206} y={92} width={148} height={110} rx={8} fill="#ffffff" stroke="#d6dae1" />
            <T x={212} y={106} s="πλάγια όψη" size={9.5} color={C.muted} anchor="start" bold={false} />
            <line x1={214} y1={sy} x2={346} y2={sy} stroke="#8a8f99" strokeWidth={4} opacity={0.55} />
            <T x={218} y={sy - 8} s="← προς το κέντρο" size={8.5} color={C.muted} anchor="start" bold={false} />
            <Ball cx={sx} cy={sy} r={7} fill={C.b1} />
            <Along x={sx} y={sy} u={[0, -1]} len={MG36 * 34} color={K.F} label="R" labelSide="right" opacity={p3 ? 0.4 : 1} />
            <Along x={sx} y={sy} u={[0, 1]} len={MG36 * 34} color={K.g} label="mg" labelSide="right" />
            <Along x={sx} y={sy} u={[-1, 0]} len={NC36 * 34} color={K.F} label="N" labelSide="above" opacity={p3 ? 0.4 : 1} />
            {p3 ? (
              <Along
                x={sx}
                y={sy}
                u={[-NC36 / Math.hypot(NC36, MG36), -MG36 / Math.hypot(NC36, MG36)]}
                len={Math.hypot(NC36, MG36) * 34}
                color="#8f1d16"
                label="F"
                width={3.4}
                labelSide="left"
              />
            ) : null}
          </g>
        ) : null}
        <Panel
          x={206}
          y={14}
          w={148}
          lines={
            p4
              ? ["υ = 4 m/s", "N = 0,1·16/0,5 = 3,2 N", "R = mg = 1 N (ίδια)"]
              : p3
                ? ["Συνολικά από το σύρμα", "F = √(N² + R²)", "F = √1,64 ≈ 1,28 N"]
                : p2
                  ? ["Κατακόρυφα: ισορροπία", "R = mg = 1 N"]
                  : ["Κεντρομόλος = N", "N = mυ²/r", "N = 0,1·4/0,5 = 0,8 N"]
          }
        />
        {!p2 ? (
          <MagBars
            y={150}
            x={206}
            w={150}
            max={3.5}
            unit="N"
            items={[
              { label: "N", value: nc, color: K.F },
              { label: "R", value: MG36, color: K.F },
            ]}
          />
        ) : null}
      </g>
    );
  },
  solve: (
    <>
      Οριζόντια (κεντρομόλος): <b>N = mυ²/r = 0,1·2²/0,5 = 0,8 N</b>. Κατακόρυφα ισορροπία: <b>R = mg = 1 N</b>. Συνολική δύναμη από το σύρμα:{" "}
      <b>F = √(N² + R²) = √1,64 ≈ 1,28 N</b>.
    </>
  ),
  trap: "Το σύρμα δεν ασκεί μόνο την κεντρομόλο: ασκεί και την κατακόρυφη R που κρατά τη χάντρα. Στο ΣF = mυ²/r γράφεις μόνο την οριζόντια N.",
};

export const section2Extra: OCase[] = [case35, case36];
