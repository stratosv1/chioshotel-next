"use client";

import { QFig } from "./MoreQuestions";
import { C, T, Vec, type MoreQuestion } from "./kit";

/* Teacher questions on box 25 (ballistic pendulum: M + m = 4 kg, V = 2,5 m/s, ℓ = 1 m). */

const PX = 64;
const PY = 12;
const L = 70;
const PURPLE = "#7a5ea8";
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Pendulum at angle `deg` from the vertical (positive to the right). */
function Pend({ deg, circle = false, dashedRest = false }: { deg: number; circle?: boolean; dashedRest?: boolean }) {
  const a = rad(deg);
  const bx = PX + L * Math.sin(a);
  const by = PY + L * Math.cos(a);
  return (
    <g>
      <line x1={PX - 24} y1={PY} x2={PX + 24} y2={PY} stroke={C.edge} strokeWidth={2.4} />
      {circle ? <circle cx={PX} cy={PY} r={L} fill="none" stroke={C.faint} strokeDasharray="3 4" /> : null}
      {dashedRest ? <line x1={PX} y1={PY} x2={PX} y2={PY + L + 8} stroke={C.faint} strokeDasharray="3 3" /> : null}
      <line x1={PX} y1={PY} x2={bx} y2={by} stroke={C.edge} strokeWidth={1.4} />
      <g transform={`rotate(${-deg} ${bx} ${by})`}>
        <rect x={bx - 11} y={by - 9} width={22} height={18} rx={2} fill={C.wood} stroke={C.edge} />
      </g>
    </g>
  );
}

function angleArc(deg: number, r = 20, label = "θ") {
  const a = rad(deg);
  const x2 = PX + r * Math.sin(a);
  const y2 = PY + r * Math.cos(a);
  return (
    <g>
      <path d={`M${PX},${PY + r} A${r},${r} 0 0 0 ${x2},${y2}`} fill="none" stroke={C.muted} strokeWidth={1} />
      <T x={PX + (r + 9) * Math.sin(a / 2)} y={PY + (r + 9) * Math.cos(a / 2) + 3} s={label} size={9} color={C.muted} />
    </g>
  );
}

const figCos = (
  <QFig>
    <Pend deg={35} dashedRest />
    {angleArc(35)}
    {(() => {
      const a = rad(35);
      const bx = PX + L * Math.sin(a);
      const by = PY + L * Math.cos(a);
      const W = 34;
      const r = W * Math.cos(a);
      const t = W * Math.sin(a);
      return (
        <g>
          <line x1={bx + Math.sin(a) * r} y1={by + Math.cos(a) * r} x2={bx} y2={by + W} stroke={PURPLE} strokeDasharray="2 2" />
          <line x1={bx - Math.cos(a) * t} y1={by + Math.sin(a) * t} x2={bx} y2={by + W} stroke={PURPLE} strokeDasharray="2 2" />
          <Vec x={bx} y={by} dx={0} dy={W} color={C.F} width={2.2} />
          <Vec x={bx} y={by} dx={Math.sin(a) * r} dy={Math.cos(a) * r} color={PURPLE} width={2} />
          <Vec x={bx} y={by} dx={-Math.cos(a) * t} dy={Math.sin(a) * t} color={PURPLE} width={2} />
          <Vec x={bx - Math.sin(a) * 10} y={by - Math.cos(a) * 10} dx={-Math.sin(a) * 26} dy={-Math.cos(a) * 26} color={C.F} width={2.2} />
          <T x={bx - Math.sin(a) * 40 - 4} y={by - Math.cos(a) * 40} s="T" size={10} color={C.F} anchor="end" />
          <T x={bx + Math.sin(a) * r + 3} y={by + Math.cos(a) * r + 9} s="mg·συνθ" size={8.5} color={PURPLE} anchor="start" />
          <T x={bx - Math.cos(a) * t - 2} y={by + Math.sin(a) * t + 10} s="mg·ημθ" size={8.5} color={PURPLE} anchor="end" />
          <T x={bx + 4} y={by + W + 8} s="mg" size={9} color={C.F} anchor="start" />
        </g>
      );
    })()}
  </QFig>
);

const THMAX = (Math.acos(0.6875) * 180) / Math.PI;

const figHeight = (
  <QFig>
    <Pend deg={THMAX} dashedRest />
    {angleArc(THMAX, 22, "θmax")}
    {(() => {
      const by = PY + L * Math.cos(rad(THMAX));
      const bottom = PY + L;
      return (
        <g>
          <line x1={PX - 16} y1={bottom + 9} x2={150} y2={bottom + 9} stroke={C.faint} strokeDasharray="3 3" />
          <line x1={PX + 40} y1={by + 9} x2={150} y2={by + 9} stroke={C.faint} strokeDasharray="3 3" />
          <line x1={146} y1={by + 9} x2={146} y2={bottom + 9} stroke={C.p} strokeWidth={2} />
          <T x={142} y={(by + bottom) / 2 + 13} s="h" size={10} color={C.p} anchor="end" italic />
          <rect x={PX - 11} y={bottom - 9 + 9} width={22} height={18} rx={2} fill="none" stroke={C.faint} strokeDasharray="2 2" />
          <T x={PX} y={116} s="κάτω: V = 2,5 m/s" size={8.5} color={C.v} />
        </g>
      );
    })()}
  </QFig>
);

const figTop = (
  <QFig>
    <Pend deg={THMAX} circle />
    {(() => {
      const a = rad(THMAX);
      const bx = PX + L * Math.sin(a);
      const by = PY + L * Math.cos(a);
      return (
        <g>
          <Vec x={bx - Math.sin(a) * 10} y={by - Math.cos(a) * 10} dx={-Math.sin(a) * 20} dy={-Math.cos(a) * 20} color={C.F} width={2.2} />
          <T x={bx - Math.sin(a) * 34 - 2} y={by - Math.cos(a) * 34 + 4} s="T = 27,5 N" size={8.5} color={C.F} anchor="end" />
          <Vec x={bx} y={by + 9} dx={0} dy={28} color={C.F} width={2.2} />
          <T x={bx + 4} y={by + 36} s="40 N" size={8.5} color={C.F} anchor="start" />
          <T x={bx + 14} y={by - 10} s="υ = 0" size={9} color={C.v} anchor="start" />
        </g>
      );
    })()}
  </QFig>
);

const fig30 = (
  <QFig>
    <Pend deg={30} circle />
    {angleArc(30, 22, "30°")}
    {(() => {
      const a = rad(30);
      const bx = PX + L * Math.sin(a);
      const by = PY + L * Math.cos(a);
      return (
        <g>
          <Vec x={bx - Math.sin(a) * 10} y={by - Math.cos(a) * 10} dx={-Math.sin(a) * 34} dy={-Math.cos(a) * 34} color={C.F} width={2.2} />
          <T x={bx - Math.sin(a) * 30 + 8} y={by - Math.cos(a) * 30 + 2} s="T = ;" size={9} color={C.F} anchor="start" />
          <Vec x={bx + Math.cos(a) * 12} y={by - Math.sin(a) * 12} dx={Math.cos(a) * 22} dy={-Math.sin(a) * 22} color={C.v} width={2} />
          <T x={bx + 34} y={by - 22} s="υ" size={9} color={C.v} />
        </g>
      );
    })()}
  </QFig>
);

const figBreak = (
  <QFig>
    <Pend deg={0} />
    <Vec x={PX} y={PY + L - 10} dx={0} dy={-44} color={C.F} width={2.6} />
    <T x={PX + 6} y={PY + 30} s="T ≤ 100 N" size={9} color={C.F} anchor="start" />
    <T x={PX - 6} y={PY + 40} s="✂" size={13} color={C.muted} anchor="end" />
    <Vec x={PX + 14} y={PY + L} dx={30} color={C.v} width={2.2} />
    <T x={PX + 30} y={PY + L - 6} s="V max ;" size={8.5} color={C.v} />
    <rect x={10} y={PY + L - 3} width={10} height={4} rx={1.5} fill="#5d6470" />
    <Vec x={22} y={PY + L - 1} dx={26} color={C.v} width={1.8} />
    <T x={30} y={PY + L + 18} s="υ₀ ;" size={9} color={C.v} />
  </QFig>
);

const figLoop = (
  <QFig>
    <circle cx={PX} cy={62} r={44} fill="none" stroke={C.faint} strokeDasharray="3 4" />
    <circle cx={PX} cy={62} r={3} fill={C.edge} />
    <line x1={PX} y1={62} x2={PX} y2={18} stroke={C.edge} strokeWidth={1.4} />
    <rect x={PX - 10} y={10} width={20} height={16} rx={2} fill={C.wood} stroke={C.edge} />
    <Vec x={PX} y={26} dx={0} dy={22} color={C.F} width={2.2} />
    <T x={PX - 5} y={44} s="mg" size={9} color={C.F} anchor="end" />
    <Vec x={PX + 12} y={18} dx={26} color={C.v} width={2.2} />
    <T x={PX + 44} y={14} s="υκ" size={9} color={C.v} anchor="start" />
    <T x={PX + 34} y={34} s="T = 0" size={9} color={C.muted} anchor="start" />
    <rect x={PX - 10} y={98} width={20} height={16} rx={2} fill="none" stroke={C.faint} strokeDasharray="2 2" />
    <T x={PX + 24} y={111} s="V ;" size={9} color={C.v} anchor="start" />
  </QFig>
);

const figHeat = (
  <QFig>
    <line x1={6} y1={90} x2={154} y2={90} stroke={C.faint} />
    <rect x={88} y={50} width={44} height={36} rx={3} fill={C.wood} stroke={C.edge} />
    <rect x={70} y={64} width={22} height={6} rx={2} fill="#5d6470" stroke={C.edge} />
    <Vec x={68} y={58} dx={-28} color={C.F} width={2.4} />
    <T x={52} y={52} s="F στο βλήμα" size={8.5} color={C.F} />
    <Vec x={132} y={46} dx={18} color={C.F} width={2.4} />
    <T x={140} y={40} s="F" size={9} color={C.F} />
    <path d="M100,46 q4,-10 8,0 q4,-12 8,0 q4,-9 8,0" fill="none" stroke={C.K} strokeWidth={2} />
    <T x={112} y={30} s="Q" size={11} color={C.K} />
    <T x={80} y={108} s="Δt = 0,01 s" size={9} color={C.muted} />
  </QFig>
);

export const MORE25: MoreQuestion[] = [
  {
    q: "Γιατί στον τύπο της τάσης T = (M+m)(g·συνθ + υ²/ℓ) υπάρχει συνθ;",
    fig: figCos,
    steps: [
      "Όταν το νήμα γέρνει κατά θ, το βάρος δείχνει ακόμα κατακόρυφα, όχι πάνω στο νήμα.",
      "Το αναλύουμε σε δύο κάθετες συνιστώσες (μωβ): mg·συνθ κατά μήκος του νήματος, προς τα έξω, και mg·ημθ στην εφαπτομένη της τροχιάς.",
      "Η κεντρομόλος είναι η συνισταμένη ΠΑΝΩ στο νήμα, προς το κέντρο. Εκεί υπάρχουν μόνο η T (μέσα) και το mg·συνθ (έξω): T − mg·συνθ = mυ²/ℓ.",
      "Το mg·ημθ δεν μπαίνει σε αυτή την εξίσωση: είναι αυτό που φρενάρει τον κύβο καθώς ανεβαίνει.",
    ],
    a: "T = m(g·συνθ + υ²/ℓ). Στο κάτω σημείο θ = 0, συν0 = 1 ⇒ T = mg + mυ²/ℓ = 65 N.",
  },
  {
    q: "Πόσο ψηλά ανεβαίνει ο κύβος και ποια είναι η μέγιστη γωνία του νήματος;",
    fig: figHeight,
    steps: [
      "Μετά την κρούση δεν υπάρχουν τριβές και η τάση δεν παράγει έργο (είναι κάθετη στην κίνηση) ⇒ ΑΔΜΕ.",
      "Στο ψηλότερο σημείο ο κύβος σταματά στιγμιαία (υ = 0): ½(M+m)V² = (M+m)g·h ⇒ h = V²/(2g) = 6,25/20 = 0,3125 m.",
      "Από το σχήμα: το κάτω σημείο απέχει ℓ από την ανάρτηση, το πάνω ℓ·συνθ. Άρα h = ℓ − ℓ·συνθ = ℓ(1 − συνθ).",
      "0,3125 = 1·(1 − συνθ_max) ⇒ συνθ_max = 0,6875.",
    ],
    a: "h ≈ 0,31 m και θ_max ≈ 46,6° (συνθ_max = 0,6875).",
  },
  {
    q: "Πόση είναι η τάση στο ψηλότερο σημείο;",
    fig: figTop,
    steps: [
      "Στο ψηλότερο σημείο υ = 0, άρα η κεντρομόλος (M+m)υ²/ℓ είναι μηδέν.",
      "Ο τύπος δίνει T = (M+m)·g·συνθ_max = 4·10·0,6875.",
      "Η τάση είναι μικρότερη από το βάρος. Αυτό δεν είναι ισορροπία: η συνιστώσα mg·ημθ μένει χωρίς αντίπαλο και γυρίζει τον κύβο πίσω.",
    ],
    a: "T = 27,5 N, η ελάχιστη τάση σε όλη την κίνηση.",
  },
  {
    q: "Πόση είναι η τάση όταν το νήμα σχηματίζει 30° με την κατακόρυφο;",
    fig: fig30,
    steps: [
      "Πρώτα η ταχύτητα σε εκείνο το σημείο, με ΑΔΜΕ από το κάτω σημείο. Το ύψος που ανέβηκε: h = ℓ(1 − συν30°) = 1·(1 − 0,866) = 0,134 m.",
      "½V² = ½υ² + g·h ⇒ υ² = 6,25 − 2·10·0,134 ≈ 3,57 m²/s².",
      "Μετά ο τύπος της τάσης: T = (M+m)(g·συν30° + υ²/ℓ) = 4·(10·0,866 + 3,57) = 4·12,23.",
    ],
    a: "T ≈ 48,9 N: ανάμεσα στο 65 N (κάτω) και στο 27,5 N (ψηλότερα).",
  },
  {
    q: "Αν το νήμα αντέχει το πολύ 100 N, με ποια μέγιστη ταχύτητα μπορεί να έρθει το βλήμα χωρίς να κοπεί;",
    fig: figBreak,
    steps: [
      "Η τάση είναι μέγιστη στο κάτω σημείο, αμέσως μετά την κρούση. Εκεί κρίνεται αν θα κοπεί.",
      "Οριακά T = 100 N: 100 = (M+m)g + (M+m)V²/ℓ = 40 + 4·V² ⇒ V² = 15 ⇒ V ≈ 3,87 m/s.",
      "ΑΔΟ στην κρούση: m·υ₀ = (M+m)·V ⇒ 0,1·υ₀ = 4·3,87.",
    ],
    a: "υ₀ ≈ 155 m/s. Με πιο γρήγορο βλήμα το νήμα κόβεται αμέσως μετά την κρούση.",
  },
  {
    q: "Με ποια ελάχιστη ταχύτητα πρέπει να έρθει το βλήμα ώστε ο κύβος να κάνει ολόκληρο κύκλο;",
    fig: figLoop,
    steps: [
      "Το κρίσιμο σημείο είναι η κορυφή του κύκλου. Με νήμα, «οριακά» σημαίνει T = 0 εκεί: μόνο το βάρος δίνει την κεντρομόλο.",
      "(M+m)g = (M+m)υ_κ²/ℓ ⇒ υ_κ² = g·ℓ = 10.",
      "ΑΔΜΕ από το κάτω σημείο ως την κορυφή (ανεβαίνει 2ℓ): ½V² = ½υ_κ² + g·2ℓ ⇒ V² = 10 + 40 = 50 ⇒ V ≈ 7,07 m/s.",
      "ΑΔΟ στην κρούση: 0,1·υ₀ = 4·7,07.",
    ],
    a: "υ₀ ≈ 283 m/s. (Προσοχή: στην κορυφή υ_κ ≠ 0. Με ράβδο αντί για νήμα θα ήταν υ_κ = 0.)",
  },
  {
    q: "Πόση θερμότητα έγινε στην κρούση και πόση μέση δύναμη δέχτηκε το βλήμα, αν η κρούση κράτησε 0,01 s;",
    fig: figHeat,
    steps: [
      "Κινητική πριν (μόνο το βλήμα): ½·0,1·100² = 500 J. Κινητική μετά (σύνολο): ½·4·2,5² = 12,5 J.",
      "Q = 500 − 12,5 = 487,5 J: το 97,5 % έγινε θερμότητα και παραμόρφωση.",
      "Μόνο το βλήμα: Δp = m(V − υ₀) = 0,1·(2,5 − 100) = −9,75 kg·m/s.",
      "F = Δp/Δt = −9,75/0,01. Το ίδιο μέτρο δύναμης δέχεται και ο κύβος, αντίθετα (3ος νόμος).",
    ],
    a: "Q = 487,5 J και F = 975 N, αντίθετα στην κίνηση του βλήματος.",
  },
];
