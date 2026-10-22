"use client";

import { Ball, C, T, Tag, lerp, num, seg } from "@/components/mixalis/ormi/kit";
import { Along, Angle, K, MagBars, Panel, type OCase } from "./kit2";

/* Conical pendulum drawn in light perspective: the horizontal circle is an ellipse. */
const SIN = 0.6;
const COS = 0.8;
const PHI = Math.atan2(SIN, COS); // 36,87°

type Pend = { px: number; py: number; Lpx: number; phi: number };

function geom(p: Pend, alpha: number) {
  const R = p.Lpx * Math.sin(p.phi);
  const h = p.Lpx * Math.cos(p.phi);
  const cy = p.py + h;
  const ry = R * 0.22;
  const x = p.px + R * Math.cos(alpha);
  const y = cy + ry * Math.sin(alpha);
  return { R, h, cy, ry, x, y };
}

function Pendulum({ p, alpha, fill = C.ball, r = 8, showAxis = true, label }: { p: Pend; alpha: number; fill?: string; r?: number; showAxis?: boolean; label?: string }) {
  const g = geom(p, alpha);
  const front = Math.sin(alpha) > 0;
  return (
    <g>
      {showAxis ? <line x1={p.px} y1={p.py} x2={p.px} y2={g.cy + 18} stroke={C.faint} strokeDasharray="4 3" /> : null}
      <ellipse cx={p.px} cy={g.cy} rx={g.R} ry={g.ry} fill="none" stroke={K.orbit} strokeDasharray="5 4" />
      <circle cx={p.px} cy={g.cy} r={2.2} fill={C.ink} />
      <line x1={p.px - 16} y1={p.py} x2={p.px + 16} y2={p.py} stroke={C.edge} strokeWidth={3} />
      <line x1={p.px} y1={p.py} x2={g.x} y2={g.y} stroke={C.ink} strokeWidth={1.4} opacity={front ? 1 : 0.85} />
      <Ball cx={g.x} cy={g.y} r={r * (front ? 1 : 0.9)} fill={fill} label={label} />
    </g>
  );
}

const STD: Pend = { px: 100, py: 22, Lpx: 130, phi: PHI };

/* ───────── 11. Γεωμετρία ───────── */
const case11: OCase = {
  n: 11,
  title: "Γεωμετρία κωνικού εκκρεμούς",
  what: "Ένα σώμα δεμένο σε νήμα γράφει οριζόντιο κύκλο, και το νήμα σαρώνει την επιφάνεια ενός κώνου. Δείχνει ποιο είναι το ορθογώνιο τρίγωνο που λύνει όλη τη γεωμετρία.",
  given: "Μήκος νήματος L = 1 m, γωνία νήματος με την κατακόρυφο φ = 37° (ημφ = 0,6, συνφ = 0,8).",
  ask: "Την ακτίνα R του κύκλου και το ύψος h του κώνου (από το σημείο ανάρτησης ως το επίπεδο του κύκλου).",
  period: 10,
  legend: [],
  phases: [
    {
      until: 3.5,
      label: "Γυρίζει",
      say: "Το σώμα γράφει οριζόντιο κύκλο. Το κέντρο του κύκλου δεν είναι το σημείο ανάρτησης, αλλά το σημείο του άξονα στο ίδιο ύψος με το σώμα.",
    },
    {
      until: 7,
      label: "Το τρίγωνο",
      say: "Σταματάμε το σώμα στο πλάι. Νήμα L (υποτείνουσα), ακτίνα R (οριζόντια) και ύψος h (στον άξονα) φτιάχνουν ορθογώνιο τρίγωνο, με τη γωνία φ στην κορυφή.",
    },
    {
      until: 10,
      label: "Οι τύποι",
      say: "Απέναντι από τη φ είναι η R: R = L·ημφ = 0,6 m. Δίπλα στη φ είναι το h: h = L·συνφ = 0,8 m. Αυτά τα δύο θα τα χρειαστείς σε κάθε άσκηση κωνικού.",
    },
  ],
  Scene: ({ t }) => {
    const alpha = t < 3.5 ? 1.6 * t : 0;
    const g = geom(STD, alpha);
    const show = t >= 3.5;
    return (
      <g>
        <Pendulum p={STD} alpha={alpha} />
        {show ? (
          <g opacity={seg(t, 3.5, 4.2)}>
            <line x1={STD.px} y1={g.cy} x2={g.x} y2={g.cy} stroke={C.v} strokeWidth={2.4} />
            <line x1={STD.px} y1={STD.py} x2={STD.px} y2={g.cy} stroke={K.a} strokeWidth={2.4} />
            <line x1={STD.px} y1={STD.py} x2={g.x} y2={g.y} stroke={C.ink} strokeWidth={2.4} />
            <path d={`M ${STD.px + 9} ${g.cy} L ${STD.px + 9} ${g.cy - 9} L ${STD.px} ${g.cy - 9}`} fill="none" stroke={C.muted} />
            <T x={(STD.px + g.x) / 2} y={g.cy + 15} s="R" size={12} color={C.v} italic />
            <T x={STD.px - 10} y={(STD.py + g.cy) / 2} s="h" size={12} color={K.a} italic anchor="end" />
            <T x={(STD.px + g.x) / 2 + 12} y={(STD.py + g.y) / 2} s="L" size={12} italic />
            <Angle cx={STD.px} cy={STD.py} r={24} a0={-Math.PI / 2} a1={-Math.PI / 2 + PHI} label="φ" />
          </g>
        ) : null}
        <Panel
          x={214}
          y={14}
          w={140}
          lines={t < 7 ? ["Δεδομένα", "L = 1 m", "φ = 37°", "ημφ = 0,6 · συνφ = 0,8"] : ["Από το τρίγωνο", "R = L·ημφ = 0,6 m", "h = L·συνφ = 0,8 m", "εφφ = R/h = 0,75"]}
        />
      </g>
    );
  },
  solve: (
    <>
      <b>R = L·ημφ = 1·0,6 = 0,6 m</b> και <b>h = L·συνφ = 1·0,8 = 0,8 m</b>. Έλεγχος: R² + h² = 0,36 + 0,64 = 1 = L².
    </>
  ),
  trap: "Η ακτίνα του κύκλου δεν είναι το μήκος του νήματος! R = L·ημφ, πάντα μικρότερη από το L.",
};

/* ───────── 12. Περίοδος ───────── */
const L2 = { px: 100, py: 26, Lpx: 0, phi: Math.acos(0.5) };
const case12: OCase = {
  n: 12,
  title: "Περίοδος κωνικού εκκρεμούς",
  what: "Μετράμε πόσο κάνει ένας γύρος. Στο τέλος βάζουμε δίπλα και ένα πιο μακρύ εκκρεμές με ίδιο ύψος κώνου: γυρίζουν μαζί! Η περίοδος εξαρτάται μόνο από το h.",
  given: "L = 1 m, φ = 37° (συνφ = 0,8), g = 10 m/s².",
  ask: "Την περίοδο T της κίνησης.",
  period: 11,
  legend: [],
  phases: [
    {
      until: 3.6,
      label: "Ένας γύρος",
      say: "Το χρονόμετρο μετρά έναν πλήρη γύρο: T ≈ 1,78 s. Για να τη βρούμε χωρίς χρονόμετρο, χρειαζόμαστε τον τύπο της περιόδου.",
    },
    {
      until: 7.2,
      label: "Ο τύπος",
      say: "Από εφφ = υ²/(gR) και T = 2πR/υ βγαίνει T = 2π√(L·συνφ/g). Το L·συνφ είναι το ύψος h του κώνου: T = 2π√(0,8/10) ≈ 1,78 s.",
    },
    {
      until: 11,
      label: "Ίδιο h, ίδια T",
      say: "Το δεύτερο εκκρεμές έχει νήμα 1,6 m και φ = 60°, αλλά h = 1,6·0,5 = 0,8 m, ίδιο. Γυρίζουν συγχρονισμένα: ίδια περίοδος, ανεξάρτητα από L, φ και μάζα χωριστά.",
    },
  ],
  Scene: ({ t }) => {
    const Tp = 2 * Math.PI * Math.sqrt(0.08);
    const scale = 80; // px per m
    const p1: Pend = { px: 100, py: 26, Lpx: 1 * scale, phi: PHI };
    const p2: Pend = { ...L2, Lpx: 1.6 * scale };
    const slow = 2; // shown 2× slower
    const tp = t < 3.6 ? Math.min(t / slow, Tp) : t < 7.2 ? (t - 3.6) / slow : (t - 7.2) / slow;
    const alpha = (2 * Math.PI * tp) / Tp - 0.2;
    const both = t >= 7.2;
    return (
      <g>
        {both ? <Pendulum p={p2} alpha={alpha} fill={C.b2} label="2" showAxis={false} /> : null}
        <Pendulum p={p1} alpha={alpha} label={both ? "1" : undefined} />
        <line x1={20} y1={26 + 64} x2={206} y2={26 + 64} stroke={K.a} strokeWidth={0.8} strokeDasharray="2 3" opacity={both ? 1 : 0} />
        {both ? <T x={24} y={26 + 60} s="ίδιο h" size={9.5} color={K.a} anchor="start" /> : null}
        <Tag x={12} y={200} s="αργή κίνηση ×½" color={C.muted} />
        <Panel
          x={214}
          y={14}
          w={140}
          lines={
            t < 3.6
              ? ["Χρονόμετρο", `t = ${num(tp, 2)} s`, tp >= Tp - 0.01 ? "1 γύρος ✓" : "…"]
              : t < 7.2
                ? ["Περίοδος", "T = 2π√(L·συνφ/g)", "T = 2π√(0,08)", "T ≈ 1,78 s"]
                : ["h = L·συνφ", "1: 1·0,8 = 0,8 m", "2: 1,6·0,5 = 0,8 m", "⇒ ίδια T ≈ 1,78 s"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      <b>T = 2π√(L·συνφ/g) = 2π√(1·0,8/10) = 2π·0,283 ≈ 1,78 s</b>.
    </>
  ),
  trap: "Στο κουτάκι αυτό το T είναι περίοδος, όχι τάση. Και στον τύπο μπαίνει συνφ (το ύψος h = L·συνφ), όχι ημφ.",
};

/* ───────── 13. Συνιστώσες δυνάμεων ───────── */
const case13: OCase = {
  n: 13,
  title: "Συνιστώσες δυνάμεων",
  what: "Πάνω στο σώμα ασκούνται μόνο δύο δυνάμεις: η τάση του νήματος και το βάρος. Αναλύουμε την τάση σε κατακόρυφη και οριζόντια συνιστώσα και βλέπουμε τι κάνει η καθεμία.",
  given: "m = 0,5 kg, L = 1 m, φ = 37° (ημφ = 0,6, συνφ = 0,8), άρα R = 0,6 m.",
  ask: "Την τάση T του νήματος και την ταχύτητα υ του σώματος.",
  period: 10.5,
  legend: ["v", "F"],
  phases: [
    {
      until: 3.5,
      label: "Δύο δυνάμεις",
      say: "Το σώμα σταματημένο στο πλάι: τάση T κατά μήκος του νήματος (προς την ανάρτηση) και βάρος mg = 5 N. Καμία άλλη δύναμη (η «κεντρομόλος» δεν είναι τρίτη δύναμη!).",
    },
    {
      until: 7,
      label: "Ανάλυση της T",
      say: "T·συνφ (κατακόρυφη) ισορροπεί το βάρος: T·συνφ = mg ⇒ T = 5/0,8 = 6,25 N. T·ημφ (οριζόντια, προς τον άξονα) είναι η κεντρομόλος: T·ημφ = 3,75 N.",
    },
    {
      until: 10.5,
      label: "Κεντρομόλος",
      say: "Η T·ημφ γυρίζει μαζί με το σώμα και δείχνει πάντα στο κέντρο του κύκλου. Από T·ημφ = mυ²/R: υ² = 3,75·0,6/0,5 = 4,5 ⇒ υ ≈ 2,12 m/s.",
    },
  ],
  Scene: ({ t }) => {
    const p3 = t >= 7;
    const alpha = p3 ? (t - 7) * 1.5 : 0;
    const g = geom(STD, alpha);
    const k = 8; // px per N
    const Tn = 6.25;
    const ux = (STD.px - g.x) / STD.Lpx;
    const uy = (STD.py - g.y) / STD.Lpx;
    const p2 = t >= 3.5;
    const toAxis: [number, number] = [STD.px - g.x, g.cy - g.y];
    const ta = Math.hypot(toAxis[0], toAxis[1]) || 1;
    return (
      <g>
        <Pendulum p={STD} alpha={alpha} />
        {!p3 ? (
          <g>
            <Along x={g.x} y={g.y} u={[ux, uy]} len={Tn * k} color={K.F} label="T" width={3} labelSide="right" opacity={p2 ? 0.45 : 1} />
            <Along x={g.x} y={g.y} u={[0, 1]} len={5 * k} color={K.g} label="mg" width={3} labelSide="right" />
            {p2 ? (
              <g opacity={seg(t, 3.5, 4.2)}>
                <Along x={g.x} y={g.y} u={[0, -1]} len={Tn * COS * k} color={K.F} label="T·συνφ" dashed labelSide="right" />
                <Along x={g.x} y={g.y} u={[-1, 0]} len={Tn * SIN * k} color={K.F} dashed />
                <T x={g.x - Tn * SIN * k - 4} y={g.y + 4} s="T·ημφ" size={11} color={K.F} italic anchor="end" />
              </g>
            ) : null}
          </g>
        ) : (
          <g>
            <Along x={g.x} y={g.y} u={[toAxis[0] / ta, toAxis[1] / ta]} len={Tn * SIN * k} color="#8f1d16" label="T·ημφ" width={3.2} labelSide="below" />
            <Along x={g.x} y={g.y} u={[-Math.sin(alpha), 0.22 * Math.cos(alpha)].map((c, i, a) => c / Math.hypot(a[0], a[1])) as [number, number]} len={26} color={K.v} label="υ" labelSide="above" />
          </g>
        )}
        <Panel
          x={214}
          y={14}
          w={140}
          lines={
            !p2
              ? ["Δυνάμεις", "τάση T (νήμα)", "βάρος mg = 5 N"]
              : !p3
                ? ["Ανάλυση", "T·συνφ = mg", "T = 5/0,8 = 6,25 N", "T·ημφ = 3,75 N"]
                : ["Κεντρομόλος", "T·ημφ = mυ²/R", "υ² = 3,75·0,6/0,5", "υ ≈ 2,12 m/s"]
          }
        />
        <MagBars
          x={214}
          y={150}
          w={140}
          max={7}
          items={[
            { label: "T", value: Tn, color: K.F },
            { label: "mg", value: 5, color: K.g },
            { label: "T·ημφ", value: p2 ? Tn * SIN : 0, color: K.F },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      Κατακόρυφα: T·συνφ = mg ⇒ <b>T = 0,5·10/0,8 = 6,25 N</b>. Οριζόντια: T·ημφ = mυ²/R ⇒ υ² = 6,25·0,6·0,6/0,5 = 4,5 ⇒ <b>υ ≈ 2,12 m/s</b>. (Ή κατά μέλη: υ² = g·R·εφφ = 10·0,6·0,75 = 4,5.)
    </>
  ),
  trap: "Μη σχεδιάσεις «κεντρομόλο» ως τρίτη δύναμη. Η κεντρομόλος εδώ είναι απλώς η οριζόντια συνιστώσα της τάσης, T·ημφ.",
};

/* ───────── 14. Γωνιακή ταχύτητα ───────── */
const case14: OCase = {
  n: 14,
  title: "Γωνιακή ταχύτητα",
  what: "Δύο σώματα με διαφορετική μάζα, με ίδιο μήκος νήματος και ίδια γωνία, γυρίζουν μαζί. Μετά αυξάνουμε το ω και το νήμα ανοίγει. Δείχνει ότι το ω καθορίζει τη γωνία, όχι η μάζα.",
  given: "L = 1 m, φ = 37° (συνφ = 0,8), g = 10 m/s². Μάζες 0,5 kg και 2 kg.",
  ask: "Τη γωνιακή ταχύτητα ω. Και τη γωνία φ αν το ω γίνει 5 rad/s.",
  period: 10.5,
  legend: [],
  phases: [
    {
      until: 3.5,
      label: "Ίδιο ω",
      say: "Το ελαφρύ (πορτοκαλί) και το βαρύ (κίτρινο) σώμα, με ίδιο L και ίδια φ, γυρίζουν στον ίδιο κύκλο, το ένα απέναντι στο άλλο, χωρίς να «προλαβαίνει» κανένα: ω² = g/(L·συνφ) = 12,5 ⇒ ω ≈ 3,54 rad/s, χωρίς m στον τύπο.",
    },
    {
      until: 7,
      label: "Από πού βγαίνει",
      say: "T·ημφ = mω²R με R = L·ημφ δίνει T = mω²L. Βάζουμε στο T·συνφ = mg: mω²L·συνφ = mg ⇒ ω² = g/(L·συνφ). Η m απλοποιείται.",
    },
    {
      until: 10.5,
      label: "Πιο γρήγορα",
      say: "Αυξάνουμε το ω ως 5 rad/s: συνφ = g/(ω²L) = 10/25 = 0,4 ⇒ φ ≈ 66°. Πιο γρήγορα ⇒ το νήμα ανοίγει (ποτέ όμως οριζόντιο).",
    },
  ],
  Scene: ({ t }) => {
    const om = t < 7 ? Math.sqrt(12.5) : lerp(Math.sqrt(12.5), 5, seg(t, 7.3, 9.8));
    const cphi = Math.min(1, 10 / (om * om * 1));
    const phi = Math.acos(cphi);
    const scale = 100;
    const shownRate = 0.45; // shown angular speed factor
    const alpha = t * om * shownRate;
    const pA: Pend = { px: 100, py: 24, Lpx: scale, phi };
        return (
      <g>
        <Pendulum p={pA} alpha={alpha} />
        <Pendulum p={pA} alpha={alpha + Math.PI} fill={C.b2} r={11} showAxis={false} />
        <Angle cx={pA.px} cy={pA.py} r={22} a0={-Math.PI / 2} a1={-Math.PI / 2 + phi * 0.98} label="φ" />
        <Tag x={12} y={200} s="αργή κίνηση" color={C.muted} />
        <Panel
          x={214}
          y={14}
          w={140}
          lines={
            t < 7
              ? ["ω² = g/(L·συνφ)", "ω² = 10/0,8 = 12,5", "ω ≈ 3,54 rad/s", "(χωρίς m!)"]
              : [`ω = ${num(om, 2)} rad/s`, `συνφ = g/(ω²L) = ${num(cphi, 2)}`, `φ ≈ ${num((phi * 180) / Math.PI, 0)}°`]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      <b>ω² = g/(L·συνφ) = 10/0,8 = 12,5 ⇒ ω ≈ 3,54 rad/s</b>, ίδιο για 0,5 kg και 2 kg. Με ω = 5 rad/s: <b>συνφ = g/(ω²L) = 0,4 ⇒ φ ≈ 66°</b>.
    </>
  ),
  trap: "Το βαρύτερο σώμα δεν «κρεμάει» πιο κάθετα. Η γωνία εξαρτάται μόνο από ω και L. Η μάζα αλλάζει μόνο την τάση (T = mω²L).",
};

/* ───────── 15. Τάση νήματος ───────── */
const case15: OCase = {
  n: 15,
  title: "Τάση νήματος",
  what: "Η γωνία του νήματος μεγαλώνει από 0° ως σχεδόν 90° και βλέπουμε την τάση. Δείχνει γιατί T = mg/συνφ και γιατί το νήμα δεν μπορεί ποτέ να γίνει οριζόντιο.",
  given: "m = 0,5 kg (mg = 5 N). Κοιτάμε τις γωνίες φ = 0°, 60° και 80°.",
  ask: "Την τάση T για φ = 60°. Τι γίνεται όσο το φ πλησιάζει τις 90°;",
  period: 10.5,
  legend: ["F"],
  phases: [
    {
      until: 3.5,
      label: "Από 0° σε 60°",
      say: "Με φ = 0° το σώμα απλώς κρέμεται: T = mg = 5 N. Όσο ανοίγει η γωνία, η τάση μεγαλώνει. Στις 60°: T = mg/συνφ = 5/0,5 = 10 N, διπλάσια του βάρους.",
    },
    {
      until: 7,
      label: "Γιατί T > mg",
      say: "Μόνο η κατακόρυφη συνιστώσα T·συνφ κρατά το βάρος. Όσο πιο γερμένο το νήμα, τόσο μικρότερο το συνφ, άρα τόσο μεγαλύτερη T χρειάζεται για να βγει T·συνφ = mg.",
    },
    {
      until: 10.5,
      label: "Προς τις 90°",
      say: "Στις 80°: T = 5/0,174 ≈ 29 N. Στις 90° θα ήταν συνφ = 0, άρα καμία κατακόρυφη συνιστώσα: δεν γίνεται, θα έπρεπε T → ∞. Γι' αυτό 0° < φ < 90°.",
    },
  ],
  Scene: ({ t }) => {
    let phiDeg: number;
    if (t < 3.5) phiDeg = lerp(0, 60, seg(t, 0.3, 3.2));
    else if (t < 7) phiDeg = 60;
    else phiDeg = lerp(60, 80, seg(t, 7.3, 9.8));
    const phi = (phiDeg * Math.PI) / 180;
    const Lpx = 110;
    const px = 70;
    const py = 30;
    const bx = px + Lpx * Math.sin(phi);
    const by = py + Lpx * Math.cos(phi);
    const Tn = 5 / Math.cos(phi);
    const k = 3.4;
    const ux = (px - bx) / Lpx;
    const uy = (py - by) / Lpx;
    return (
      <g>
        <line x1={px - 18} y1={py} x2={px + 18} y2={py} stroke={C.edge} strokeWidth={3} />
        <line x1={px} y1={py} x2={px} y2={py + Lpx + 10} stroke={C.faint} strokeDasharray="4 3" />
        <line x1={px} y1={py} x2={bx} y2={by} stroke={C.ink} strokeWidth={1.4} />
        {phiDeg > 3 ? <Angle cx={px} cy={py} r={22} a0={-Math.PI / 2} a1={-Math.PI / 2 + phi} label="φ" /> : null}
        <Ball cx={bx} cy={by} r={8} />
        <Along x={bx} y={by} u={[ux, uy]} len={Math.min(Tn, 30) * k} color={K.F} label="T" width={3} labelSide="right" />
        <Along x={bx} y={by} u={[0, 1]} len={5 * k} color={K.g} label="mg" width={3} labelSide="right" />
        {t >= 3.5 && t < 7 ? <Along x={bx} y={by} u={[0, -1]} len={5 * k} color={K.F} label="T·συνφ" dashed labelSide="left" /> : null}
        <Panel x={214} y={14} w={140} lines={[`φ = ${num(phiDeg, 0)}°`, `συνφ = ${num(Math.cos(phi), 3)}`, `T = mg/συνφ = ${num(Tn, 1)} N`]} />
        <MagBars
          x={214}
          y={150}
          w={140}
          max={30}
          items={[
            { label: "T", value: Tn, color: K.F },
            { label: "mg", value: 5, color: K.g },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      T·συνφ = mg ⇒ <b>T = mg/συνφ = 5/0,5 = 10 N</b> για φ = 60°. Για φ → 90° το συνφ → 0, άρα T → ∞: το νήμα δεν γίνεται ποτέ οριζόντιο.
    </>
  ),
  trap: "Στο κωνικό εκκρεμές πάντα T > mg. Αν σου βγει T < mg, έχεις βάλει ημφ αντί για συνφ.",
};

export const section3 = [case11, case12, case13, case14, case15];
