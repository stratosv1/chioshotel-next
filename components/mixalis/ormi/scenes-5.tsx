"use client";

import { Ball, Bars, C, Cart, Ground, MiniGraph, StickPerson, T, Vec, bump, lerp, num, seg, type Case } from "./kit";

/* ═════════════ ΕΝΟΤΗΤΑ 8 · Ωθήσεις, ροές και κατακόρυφη βολή ═════════════ */

/* 36. Ελατήριο ανάμεσα: m1 = 1 kg ← 4 m/s, m2 = 2 kg → 2 m/s, U = 12 J */
const case36: Case = {
  n: 36,
  title: "Ελατήριο ανάμεσα",
  period: 6,
  legend: ["v", "F", "p", "K"],
  phases: [
    { until: 1.2, label: "Δεμένα", say: "Δύο αμαξάκια (1 kg και 2 kg) είναι δεμένα με νήμα και ανάμεσά τους υπάρχει συμπιεσμένο ελατήριο με ενέργεια 12 J." },
    { until: 1.9, label: "Κόβουμε το νήμα", say: "Το ελατήριο σπρώχνει και τα δύο με ίσες και αντίθετες δυνάμεις. Είναι εσωτερικές: η ορμή μένει 0." },
    { until: 6, label: "Μετά", say: "Φεύγουν αντίθετα με 1·4 = 2·2. Η ενέργεια του ελατηρίου έγινε κινητική: 8 J + 4 J = 12 J." },
  ],
  Scene: ({ t }) => {
    const gy = 104;
    const k = seg(t, 1.2, 1.9);
    const e = (1 - Math.cos(Math.PI * k)) / 2;
    const after = Math.max(0, t - 1.9);
    const S = 10;
    // during the push the two carts move apart in the ratio 2 : 1 (centre of mass fixed)
    const gap0 = 30;
    const gap1 = 66;
    const extra = (gap1 - gap0) * e;
    const x1face = 176 - (extra * 2) / 3 - S * 4 * after;
    const x2face = 176 + gap0 + extra / 3 + S * 2 * after;
    const v1 = -4 * e;
    const v2 = 2 * e;
    const springEnd = after > 0 ? x1face + gap1 : x2face;
    const n = 9;
    const zz = Array.from({ length: n + 1 }, (_, i) => {
      const x = lerp(x1face, springEnd, i / n);
      const y = gy - 15 + (i === 0 || i === n ? 0 : i % 2 ? -6 : 6);
      return `${i ? "L" : "M"}${x},${y}`;
    }).join(" ");
    const F = bump(t, 1.2, 1.9);
    const U = 12 * (1 - e);
    return (
      <g>
        <Ground y={gy} />
        <Cart cx={x1face - 23} y={gy} w={46} label="m_1" fill={C.b1} />
        <Cart cx={x2face + 28} y={gy} w={56} label="m_2" fill={C.b2} />
        <path d={zz} fill="none" stroke={C.muted} strokeWidth={1.8} />
        {t < 1.2 ? <path d={`M ${x1face - 20} ${gy - 24} Q ${(x1face + x2face) / 2} ${gy - 44} ${x2face + 26} ${gy - 24}`} fill="none" stroke={C.ink} strokeDasharray="3 3" /> : null}
        {t < 1.2 ? <T x={(x1face + x2face) / 2} y={gy - 46} s="νήμα" size={10} color={C.muted} bold={false} /> : null}
        {t >= 1.15 && t < 1.4 ? <T x={(x1face + x2face) / 2} y={gy - 46} s="✂" size={16} color={C.F} /> : null}
        {F > 0.05 ? (
          <g>
            <Vec x={x1face - 4} y={gy - 34} dx={-F * 34} color={C.F} label="F" width={3} />
            <Vec x={x2face + 4} y={gy - 34} dx={F * 34} color={C.F} label="−F" width={3} />
          </g>
        ) : null}
        <Vec x={x1face - 50} y={gy - 50} dx={v1 * 9} label="υ_1" />
        <Vec x={x2face + 60} y={gy - 50} dx={v2 * 9} label="υ_2" />
        <Bars
          y={132}
          max={13}
          items={[
            { label: "p_1", value: 1 * v1 },
            { label: "p_2", value: 2 * v2 },
            { label: "p_{ολ}", value: 0, color: C.ink },
            { label: "U_{ελ}", value: U, color: C.muted, unit: "J" },
            { label: "K_{ολ}", value: 12 - U, color: C.K, unit: "J" },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      0 = m₁υ₁ − m₂υ₂ ⇒ υ₁ = 2υ₂. U = ½m₁υ₁² + ½m₂υ₂² ⇒ 12 = ½·1·4υ₂² + ½·2·υ₂² = 3υ₂² ⇒ <b>υ₂ = 2 m/s, υ₁ = 4 m/s</b>.
    </>
  ),
  trap: "Η ενέργεια του ελατηρίου μοιράζεται ανάποδα από τις μάζες: το ελαφρύ παίρνει τα 2/3.",
};

/* 37. Πύραυλος: 10 kg, κάθε «ριπή» 0,5 kg αερίων με 40 m/s προς τα πίσω */
const puffTimes = [1, 1.8, 2.6, 3.4];
const rocketV = (n: number) => (20 * n) / (10 - 0.5 * n);
const case37: Case = {
  n: 37,
  title: "Πύραυλος",
  period: 7,
  legend: ["v", "p"],
  phases: [
    { until: 1, label: "Ακίνητος", say: "Πύραυλος 10 kg ακίνητος στο διάστημα (καμία εξωτερική δύναμη). Ολική ορμή μηδέν." },
    { until: 3.6, label: "Ριπές αερίων", say: "Κάθε ριπή πετάει 0,5 kg αερίων προς τα πίσω με 40 m/s, δηλαδή ορμή −20 kg·m/s. Ο πύραυλος παίρνει +20 kg·m/s κάθε φορά." },
    { until: 7, label: "Μετά", say: "Μετά από 4 ριπές: αέρια −80, πύραυλος +80 kg·m/s. Ζυγίζει πια 8 kg, άρα V = 80/8 = 10 m/s. Το άθροισμα είναι πάντα 0." },
  ],
  Scene: ({ t }) => {
    const n = puffTimes.filter((x) => t >= x).length;
    // integrate rocket position piecewise (3 px per metre)
    let x = 90;
    let last = 0;
    let v = 0;
    for (let i = 0; i <= 4; i++) {
      const end = i < 4 ? Math.min(t, puffTimes[i]) : t;
      if (end > last) x += 3 * v * (end - last);
      last = Math.max(last, end);
      if (i < 4 && t >= puffTimes[i]) v = rocketV(i + 1);
      else break;
    }
    const cy = 86;
    const puffs = puffTimes
      .map((pt, i) => ({ pt, i }))
      .filter(({ pt }) => t >= pt)
      .map(({ pt, i }) => {
        // nozzle position at ejection time
        let xx = 90;
        let ll = 0;
        let vv = 0;
        for (let j = 0; j < i; j++) {
          xx += 3 * vv * (puffTimes[j] - ll);
          ll = puffTimes[j];
          vv = rocketV(j + 1);
        }
        xx += 3 * vv * (pt - ll);
        return { x: xx - 34 - 40 * 3 * (t - pt), i };
      });
    return (
      <g>
        <rect x={0} y={0} width={360} height={130} fill="#eef1f8" />
        {[30, 80, 140, 210, 260, 320, 50, 180, 300].map((sx, i) => (
          <circle key={i} cx={sx} cy={12 + ((i * 37) % 110)} r={1.2} fill="#9aa3b2" />
        ))}
        {puffs.map((p) =>
          p.x > -20 ? <circle key={p.i} cx={p.x} cy={cy} r={8} fill="#ffd166" stroke="#e67e22" opacity={0.9} /> : null,
        )}
        <g transform={`translate(${x},0)`}>
          <path d={`M -30 ${cy - 14} L 30 ${cy - 14} L 52 ${cy} L 30 ${cy + 14} L -30 ${cy + 14} Z`} fill={C.b1} stroke={C.edge} />
          <path d={`M -30 ${cy - 14} L -42 ${cy - 26} L -30 ${cy - 4} Z M -30 ${cy + 14} L -42 ${cy + 26} L -30 ${cy + 4} Z`} fill={C.edge} />
          <T x={6} y={cy + 4} s={`${num(10 - 0.5 * n, 1)} kg`} size={10} italic />
        </g>
        {v > 0 ? <Vec x={x + 56} y={cy - 22} dx={v * 4} label={`V = ${num(v, 1)} m/s`} /> : null}
        {puffs.length && puffs[puffs.length - 1].x > 20 ? (
          <Vec x={puffs[puffs.length - 1].x - 10} y={cy + 24} dx={-30} label="40 m/s" labelSide="below" />
        ) : null}
        <Bars
          y={146}
          max={90}
          items={[
            { label: "p_{πυρ}", value: 20 * n },
            { label: "p_{αερ}", value: -20 * n },
            { label: "p_{ολ}", value: 0, color: C.ink },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      Για κάθε ριπή: 0 = M·V − m_α·υ_α. Μετά από 4 ριπές: 0 = 8·V − 2·40 ⇒ <b>V = 10 m/s</b>.
    </>
  ),
  trap: "Ο πύραυλος δεν «σπρώχνει τον αέρα». Κινείται και στο κενό, γιατί σπρώχνει τα δικά του αέρια.",
};

/* 38. Περπάτημα σε σανίδα: γυναίκα 60 kg, σανίδα 40 kg, ℓ = 5 m → σανίδα 3 m πίσω */
const case38: Case = {
  n: 38,
  title: "Περπάτημα σε σανίδα",
  period: 7,
  legend: ["v"],
  phases: [
    { until: 1, label: "Αρχή", say: "Γυναίκα 60 kg στέκεται στην άκρη σανίδας 40 kg, μήκους 5 m, που επιπλέει ακίνητη. Η μαύρη γραμμή είναι το κέντρο μάζας." },
    { until: 4.6, label: "Περπατάει", say: "Κάθε βήμα της σπρώχνει τη σανίδα προς τα πίσω. Ό,τι ορμή παίρνει εκείνη μπροστά, την παίρνει η σανίδα πίσω. Το κέντρο μάζας δεν κουνιέται!" },
    { until: 7, label: "Τέλος", say: "Η σανίδα πήγε 3 m πίσω και η γυναίκα 2 m μπροστά (ως προς την προβλήτα). 60·2 = 40·3 και 2 + 3 = 5 = ℓ." },
  ],
  Scene: ({ t }) => {
    const S = 26; // px per metre
    const k = easeWalk(seg(t, 1, 4.6));
    const xs = -3 * k; // plank displacement (m)
    const xg = 2 * k; // woman displacement (m)
    const plankL = 110 + S * xs;
    const plankR = plankL + S * 5;
    const woman = 110 + S * xg;
    const cm = (60 * woman + 40 * ((plankL + plankR) / 2)) / 100;
    const wy = 112;
    const walking = t > 1 && t < 4.6;
    return (
      <g>
        <rect x={0} y={wy} width={360} height={70} fill={C.water} opacity={0.2} />
        <path d={`M 0 ${wy} Q 20 ${wy - 4} 40 ${wy} T 80 ${wy} T 120 ${wy} T 160 ${wy} T 200 ${wy} T 240 ${wy} T 280 ${wy} T 320 ${wy} T 360 ${wy}`} fill="none" stroke={C.water} strokeWidth={2} />
        <rect x={plankL} y={wy - 8} width={plankR - plankL} height={10} rx={2} fill={C.wood} stroke={C.edge} />
        <StickPerson x={woman} y={wy - 8} step={walking ? t * 9 : 0} />
        <line x1={cm} y1={20} x2={cm} y2={wy + 40} stroke={C.ink} strokeWidth={1.5} strokeDasharray="4 3" />
        <T x={cm + 4} y={30} s="κέντρο μάζας" size={9.5} color={C.ink} anchor="start" bold={false} />
        <line x1={110} y1={wy + 52} x2={110} y2={wy + 62} stroke={C.muted} />
        <T x={110} y={wy + 74} s="αρχική θέση" size={9} color={C.muted} bold={false} />
        {k > 0.02 ? (
          <g>
            <Vec x={110} y={wy + 26} dx={S * xs} color={C.v} label={`x_σ = ${num(-xs, 1)} m`} labelSide="below" />
            <Vec x={110} y={wy - 64} dx={S * xg} color={C.v} label={`x_γ = ${num(xg, 1)} m`} />
          </g>
        ) : null}
        <T x={300} y={40} s="m_γ = 60 kg" size={10} color={C.muted} bold={false} />
        <T x={300} y={56} s="m_σ = 40 kg, ℓ = 5 m" size={10} color={C.muted} bold={false} />
      </g>
    );
  },
  solve: (
    <>
      m_γ·x_γ = m_σ·x_σ και x_γ + x_σ = ℓ ⇒ x_σ = m_γ·ℓ/(m_γ + m_σ) = 60·5/100 = <b>3 m</b>, x_γ = <b>2 m</b>.
    </>
  ),
  trap: "Οι μετατοπίσεις μετριούνται ως προς την ακτή. Ως προς τη σανίδα η γυναίκα περπάτησε όλο το ℓ = 5 m.",
};
function easeWalk(k: number) {
  return k * k * (3 - 2 * k);
}

/* 39. Βροχή σε υπόστεγο: 500 σταγόνες/s, m = 3·10⁻⁵ kg, υ = 17 m/s → F = 0,255 N */
const case39: Case = {
  n: 39,
  title: "Βροχή σε υπόστεγο",
  period: 6,
  legend: ["v", "F"],
  phases: [
    { until: 3, label: "Μία σταγόνα", say: "Κάθε σταγόνα (3·10⁻⁵ kg) φτάνει με 17 m/s και σταματά πάνω στο υπόστεγο χωρίς να αναπηδήσει: Δp = mυ = 5,1·10⁻⁴ kg·m/s." },
    { until: 6, label: "Πολλές σταγόνες", say: "Πέφτουν 500 σταγόνες κάθε δευτερόλεπτο. Σε Δt = 1 s η συνολική Δp είναι 500·5,1·10⁻⁴ = 0,255 kg·m/s, άρα F = 0,255 N." },
  ],
  Scene: ({ t }) => {
    const roofY = 120;
    const cols = 11;
    const drops = [];
    for (let i = 0; i < cols * 3; i++) {
      const cx = 64 + (i % cols) * 22 + ((i * 7) % 5);
      const offset = ((i * 0.37) % 1) * 1.2;
      const y = 10 + ((t * 70 + offset * 100) % 112);
      drops.push(
        <path key={i} d={`M ${cx} ${y} q 3 6 0 9 q -3 -3 0 -9 Z`} fill={C.water} opacity={y > roofY - 14 ? 0.3 : 0.95} />,
      );
    }
    const counter = Math.floor((t % 1) * 500);
    return (
      <g>
        {drops}
        <rect x={50} y={roofY} width={250} height={9} fill={C.wood} stroke={C.edge} />
        <line x1={64} y1={roofY + 9} x2={64} y2={176} stroke={C.edge} strokeWidth={4} />
        <line x1={286} y1={roofY + 9} x2={286} y2={176} stroke={C.edge} strokeWidth={4} />
        <Ground y={176} />
        <Vec x={316} y={30} dx={0} dy={40} label="υ = 17 m/s" labelSide="left" />
        <Vec x={175} y={roofY + 10} dx={0} dy={40} color={C.F} label="F = 0,255 N" labelSide="right" width={3.4} />
        <T x={180} y={200} s={t < 3 ? "Δp μίας σταγόνας = 3·10⁻⁵·17 = 5,1·10⁻⁴ kg·m/s" : `σταγόνες σε αυτό το δευτερόλεπτο: ${counter} / 500`} size={10} color={C.ink} />
      </g>
    );
  },
  solve: (
    <>
      F = (N/Δt)·m·υ = 500·3·10⁻⁵·17 = <b>0,255 N</b> (μέση δύναμη στο υπόστεγο, προς τα κάτω).
    </>
  ),
  trap: "Αν οι σταγόνες αναπηδούσαν, η Δp κάθε σταγόνας θα ήταν μεγαλύτερη και η δύναμη επίσης.",
};

/* 40. Κατακόρυφη βολή: m = 2 kg, υ0 = 20 m/s, 4 s */
const case40: Case = {
  n: 40,
  title: "Κατακόρυφη βολή",
  period: 6,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2, label: "Άνοδος", say: "Σώμα 2 kg φεύγει προς τα πάνω με 20 m/s: p = +40 kg·m/s. Το βάρος (20 N) το φρενάρει: η ορμή πέφτει 20 kg·m/s κάθε δευτερόλεπτο." },
    { until: 4, label: "Κάθοδος", say: "Στο ψηλότερο σημείο p = 0, όμως ο ρυθμός μεταβολής είναι ακόμα −20 N! Γι' αυτό δεν μένει εκεί: αρχίζει να πέφτει." },
    { until: 6, label: "Συμπέρασμα", say: "Επιστρέφει με 20 m/s προς τα κάτω: p = −40. Συνολικά Δp = −40 − 40 = −80 kg·m/s ≠ 0, αν και η ταχύτητα έχει το ίδιο μέτρο." },
  ],
  Scene: ({ t }) => {
    const tau = Math.min(t, 4);
    const h = 20 * tau - 5 * tau * tau;
    const v = 20 - 10 * tau;
    const gy = 190;
    const S = 7.5;
    const y = gy - 10 - S * h;
    return (
      <g>
        <Ground y={gy} x1={20} x2={140} />
        <line x1={70} y1={gy} x2={70} y2={gy - S * 20 - 10} stroke={C.faint} strokeDasharray="3 4" />
        <Ball cx={70} cy={y} r={9} />
        {t < 4 ? (
          <g>
            <Vec x={104} y={y} dx={0} dy={-v * 2.4} label="υ" />
            <Vec x={58} y={y + 4} dx={0} dy={22} color={C.F} label="mg" labelSide="left" width={3} />
          </g>
        ) : null}
        {Math.abs(v) < 1.2 ? <T x={84} y={y - 14} s="υ = 0, p = 0" size={10.5} color={C.ink} anchor="start" /> : null}
        <MiniGraph x={176} y={24} w={150} h={130} tMax={4} yMin={-44} yMax={44} fn={(u) => 40 - 20 * u} tNow={tau} color={C.p} yLabel="p (kg·m/s), ↑ θετικά" />
        <T x={250} y={176} s={`p = ${num(2 * v, 1)} kg·m/s · dp/dt = −20 N`} size={10.5} color={C.ink} />
        <T x={250} y={194} s={t > 4 ? "Δp_{ολ} = −80 kg·m/s" : ""} size={11} color={C.p} />
      </g>
    );
  },
  solve: (
    <>
      Θετική φορά πάνω: Δp = −mυ₀ − mυ₀ = <b>−80 kg·m/s</b>. dp/dt = −mg = <b>−20 N</b> σε κάθε στιγμή, και στο ψηλότερο σημείο.
    </>
  ),
  trap: "p = 0 δεν σημαίνει ΣF = 0. Στο ψηλότερο σημείο το σώμα σταματά για μια στιγμή, αλλά το βάρος συνεχίζει να ασκείται.",
};

export const section8: Case[] = [case36, case37, case38, case39, case40];
