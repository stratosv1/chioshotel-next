"use client";

import { C, Tag, lerp, seg, easeInOut } from "@/components/mixalis/ormi/kit";
import { Arr, BarsE, Charge, Dot, EC, HLines, PanelE, Plates, TE, VLines, type ECase } from "./kitE";

/*
 * Οι λυμένες εφαρμογές του βοηθήματος Καρατζίκου (Ενότητα 7 σελ. 425–432, Ενότητα 8 σελ. 467–480)
 * ως κινούμενα σχέδια. Όλες οι πράξεις ελέγχθηκαν ξανά (owner, 2026-11-23).
 * Αριθμοί 41–50 για τα anchors (#k41 …), με badge Κ1–Κ10 στην κάρτα.
 */

/** Exercise types: one place for the labels used by the map and the cards. */
export const KINDS = {
  uCalc: "Coulomb · μόνο υπολογισμός U",
  coulombK: "Coulomb + κινητική ενέργεια (ΑΔΜΕ)",
  coulombP: "Coulomb + ορμή + κινητική (ΑΔΟ + ΑΔΜΕ)",
  coulombG: "Coulomb + βάρος (ΑΔΜΕ με δύο U)",
  uniformV: "Ομογενές · διαφορά δυναμικού (V = E·x)",
  uniformLine: "Ομογενές + ευθύγραμμη κίνηση (α σταθερή)",
  uniformBolt: "Ομογενές + «οριζόντια βολή» (υ₀ ⊥ E)",
  eqG: "Ομογενές + βάρος · ισορροπία qE = mg",
  vertG: "Ομογενές + βάρος · κατακόρυφη κίνηση",
  backForth: "Ομογενές · πήγαινε–έλα (στάση και επιστροφή)",
  hole: "Ομογενές · οπή στην πλάκα (ΘΜΚΕ: ½mυ² = |q|V)",
  twoFields: "Δύο ομογενή πεδία στη σειρά",
  boltOffset: "«Βολή» · είσοδος σε απόσταση d₁, όριο τάσης",
  boltScreen: "Τάση επιτάχυνσης + «βολή» + οθόνη",
  boltG: "«Βολή» + βάρος · «ξυστά» και ευθεία",
  boltAngle: "«Βολή» · γωνία από κινητικές ενέργειες",
  mixed: "Ομογενές + Coulomb στην ίδια άσκηση",
  collision: "Ομογενές + κρούση + οριζόντια βολή",
  cDist: "Coulomb · αλλαγή απόστασης (E = ΔU)",
  cInverse: "Coulomb · αντίστροφο: άγνωστο φορτίο",
  cShape: "Coulomb · φορτία σε σχήμα (Πυθαγόρειο, συντεταγμένες)",
  cWork: "Coulomb · έργο εξωτερικής δύναμης (W = ΔU + ΔK)",
  cOrbit: "Coulomb · κυκλική τροχιά (F = κεντρομόλος)",
  cRails: "Coulomb · κυκλικές ράγες και απελευθέρωση",
  cEscape: "Coulomb · διαφυγή ή στάση (πρόσημο της E)",
  cTogether: "Και τα δύο ελεύθερα · κοινή ταχύτητα",
  cGmax: "Coulomb + βάρος · υ_max εκεί όπου F = B",
  cIncline: "Coulomb + βάρος σε κεκλιμένο",
  cSymmetry: "Coulomb · συμμετρία με δύο ακλόνητα",
  cThree: "Τρία φορτία · κάποια ελεύθερα",
  cShare: "Δύο ελεύθερα από ηρεμία · μοιρασιά της K",
  cCollision: "Coulomb + κρούση + τριβή",
} as const;

const K_NUM = 9e9;

/* ───────── Κ1. Δύο φορτία: U ───────── */
const k1: ECase = {
  n: 41,
  badge: "Κ1",
  kind: KINDS.uCalc,
  title: "Δυναμική ενέργεια δύο φορτίων",
  what: "Φέρνουμε το Q₂ από πολύ μακριά (άπειρο) κοντά στο Q₁. Τα φορτία είναι ετερόσημα, έλκονται, οπότε η U του συστήματος βγαίνει αρνητική.",
  given: "Q_1 = +4 μC, Q_2 = −6 μC, απόσταση r = 3 cm. k = 9·10⁹ N·m²/C².",
  ask: "Τη δυναμική ενέργεια του συστήματος.",
  period: 12,
  legend: ["F", "U"],
  phases: [
    { until: 4, label: "Από το άπειρο", say: "Το Q₂ έρχεται από πολύ μακριά. Η έλξη το τραβά, οπότε για να έρθει αργά (χωρίς κινητική) η εξωτερική δύναμη το κρατά προς τα πίσω: δίνει αρνητικό έργο." },
    { until: 8, label: "Τύπος", say: "U = k·Q₁·Q₂/r με τα πρόσημα: U = 9·10⁹·(4·10⁻⁶)·(−6·10⁻⁶)/(3·10⁻²). Το cm γίνεται m." },
    { until: 12, label: "Αποτέλεσμα", say: "U = −7,2 J. Αρνητική επειδή τα φορτία είναι ετερόσημα: για να τα χωρίσεις ξανά μέχρι το άπειρο χρειάζεσαι +7,2 J." },
  ],
  Scene: ({ t }) => {
    const y = 110;
    const x1 = 40;
    const x2 = lerp(188, 130, easeInOut(seg(t, 0.4, 3.6)));
    const near = t >= 3.6;
    return (
      <g>
        <line x1={x1} y1={y} x2={190} y2={y} stroke={C.faint} strokeDasharray="3 3" />
        <Charge x={x1} y={y} sign={1} r={13} label="Q₁" labelDy={-20} />
        <Charge x={x2} y={y} sign={-1} r={13} label="Q₂" labelDy={-20} />
        <Arr x={x1 + 16} y={y + 24} dx={near ? 26 : 14} color={EC.F} label="F" ly={14} width={2.4} />
        <Arr x={x2 - 16} y={y + 24} dx={near ? -26 : -14} color={EC.F} label="F" ly={14} width={2.4} />
        {t < 3.6 ? <Arr x={x2 + 16} y={y + 4} dx={22} color="#6b3fa0" label="F_{εξ}" ly={16} width={2.2} /> : null}
        {near ? (
          <g>
            <line x1={x1} y1={y + 46} x2={130} y2={y + 46} stroke={C.muted} />
            <TE x={85} y={y + 60} s="r = 3 cm = 3·10^{-2} m" size={9.5} color={C.muted} bold={false} />
          </g>
        ) : null}
        <Tag x={14} y={196} s="ετερόσημα ⇒ U < 0" color={EC.U} show={t >= 8} />
        <PanelE
          lines={
            t < 4
              ? ["Σχηματισμός", "Q₂ από το άπειρο", "αργά: K = 0", "U = W_{εξ}"]
              : t < 8
                ? ["U = k·Q₁·Q₂/r", "= 9·10⁹·4·10^{-6}·(−6·10^{-6})", "  / 3·10^{-2}", "πρόσημα μέσα!"]
                : ["Αποτέλεσμα", "U = −7,2 J", "για διάλυση:", "E_{απ} = −U = +7,2 J"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      U = k·Q_1·Q_2/r = 9·10⁹·(4·10⁻⁶)·(−6·10⁻⁶)/(3·10⁻²) ⇒ <b>U = −7,2 J</b>.
    </>
  ),
  trap: "Στο U μπαίνουν τα πρόσημα των φορτίων (όχι απόλυτες τιμές, όπως στη δύναμη Coulomb). Και το r σε μέτρα.",
};

/* ───────── Κ2. Τρία φορτία σε ισόπλευρο ───────── */
const PAIRS = [
  { a: 0, b: 1, v: -0.9, name: "q₁q₂", f: "k·(−4)·(1)·10^{-12}/0,04", r: "= −0,9 J" },
  { a: 0, b: 2, v: -3.6, name: "q₁q₃", f: "k·(−4)·(4)·10^{-12}/0,04", r: "= −3,6 J" },
  { a: 1, b: 2, v: 0.9, name: "q₂q₃", f: "k·(1)·(4)·10^{-12}/0,04", r: "= +0,9 J" },
];
const k2: ECase = {
  n: 42,
  badge: "Κ2",
  kind: KINDS.uCalc,
  title: "Τρία φορτία: ένας όρος για κάθε ζευγάρι",
  what: "Τρία φορτία στις κορυφές ισόπλευρου τριγώνου. Η U του συστήματος είναι το άθροισμα τριών όρων, ένας για κάθε πλευρά (ζευγάρι φορτίων).",
  given: "q_1 = −4 μC (A), q_2 = +1 μC (B), q_3 = +4 μC (Γ), πλευρά α = 4 cm. k = 9·10⁹ N·m²/C².",
  ask: "Τη δυναμική ενέργεια του συστήματος.",
  period: 14,
  legend: ["U"],
  phases: [
    { until: 3.5, label: "Ζεύγος q₁q₂", say: "Πλευρά AB: k·(−4·10⁻⁶)·(1·10⁻⁶)/0,04 = −0,9 J." },
    { until: 7, label: "Ζεύγος q₁q₃", say: "Πλευρά AΓ: k·(−4·10⁻⁶)·(4·10⁻⁶)/0,04 = −3,6 J." },
    { until: 10.5, label: "Ζεύγος q₂q₃", say: "Πλευρά BΓ: k·(1·10⁻⁶)·(4·10⁻⁶)/0,04 = +0,9 J (ομόσημα, θετικό)." },
    { until: 14, label: "Άθροισμα", say: "U = −0,9 − 3,6 + 0,9 = −3,6 J. Τρία φορτία ⇒ τρεις όροι, όχι δύο." },
  ],
  Scene: ({ t }) => {
    const P = [
      { x: 36, y: 172, s: -1 as const, l: "q₁" },
      { x: 104, y: 56, s: 1 as const, l: "q₂" },
      { x: 172, y: 172, s: 1 as const, l: "q₃" },
    ];
    const active = t < 3.5 ? 0 : t < 7 ? 1 : t < 10.5 ? 2 : 3;
    return (
      <g>
        {PAIRS.map((p, i) => {
          const on = active === i || active === 3;
          return (
            <line
              key={i}
              x1={P[p.a].x}
              y1={P[p.a].y}
              x2={P[p.b].x}
              y2={P[p.b].y}
              stroke={on ? (p.v < 0 ? EC.neg : EC.pos) : C.faint}
              strokeWidth={on ? 3.2 : 1.2}
              strokeDasharray={on ? undefined : "3 3"}
            />
          );
        })}
        {P.map((p) => (
          <Charge key={p.l} x={p.x} y={p.y} sign={p.s} r={11} label={p.l} labelDy={p.y < 100 ? -16 : 26} />
        ))}
        <TE x={104} y={186} s="α = 4 cm" size={9.5} color={C.muted} bold={false} />
        <BarsE
          y={96}
          max={3.6}
          items={PAIRS.map((p, i) => ({
            label: ["12", "13", "23"][i],
            value: active >= i ? p.v : 0,
            text: active >= i ? `${p.v > 0 ? "+" : "−"}${Math.abs(p.v).toLocaleString("el-GR")} J` : "",
            color: p.v < 0 ? EC.neg : EC.pos,
          }))}
        />
        <PanelE lines={active < 3 ? ["Ζεύγος " + PAIRS[active].name, PAIRS[active].f, PAIRS[active].r] : ["Άθροισμα", "U = −0,9 − 3,6 + 0,9", "U = −3,6 J"]} size={10} />
      </g>
    );
  },
  solve: (
    <>
      U = kq_1q_2/α + kq_1q_3/α + kq_2q_3/α = −0,9 − 3,6 + 0,9 ⇒ <b>U = −3,6 J</b>.
    </>
  ),
  trap: "Η U ανήκει σε όλο το σύστημα. Η U «του q₁ μέσα στο σύστημα» είναι μόνο οι όροι που έχουν το q₁: −0,9 − 3,6 = −4,5 J.",
};

/* ───────── Κ3. Coulomb + κινητική: ελάχιστη απόσταση ───────── */
const kQq3 = K_NUM * 5e-6 * 3e-6; // 0,135
const k3: ECase = {
  n: 43,
  badge: "Κ3",
  kind: KINDS.coulombK,
  title: "Εκτόξευση προς ακλόνητο φορτίο",
  what: "Εκτοξεύουμε σωματίδιο προς ομόσημο ακλόνητο φορτίο. Η άπωση το φρενάρει όλο και πιο δυνατά, μέχρι να σταματήσει στιγμιαία στην ελάχιστη απόσταση. Η κινητική ενέργεια γίνεται δυναμική.",
  given: "Ακλόνητο Q = 5 μC. Σωματίδιο q = 3 μC, m = 6 g, ξεκινά από d = 5 cm με ταχύτητα υ_0 και φτάνει ως d_{min} = 1 cm. Μόνο η δύναμη Coulomb. k = 9·10⁹ N·m²/C².",
  ask: "Την αρχική ταχύτητα υ_0.",
  period: 15,
  legend: ["F", "v", "K", "U"],
  phases: [
    { until: 3.5, label: "Γιατί ενέργεια", say: "Η δύναμη Coulomb αλλάζει με το r (σαν 1/r²), άρα η επιβράδυνση δεν είναι σταθερή. Δεν χρησιμοποιείς υ = υ₀ − αt. Χρησιμοποιείς ΑΔΜΕ." },
    { until: 9.5, label: "Πλησιάζει", say: "Όσο πλησιάζει: η F μεγαλώνει, η υ μικραίνει. Η K μειώνεται και η U = kQq/r αυξάνεται. Το άθροισμα μένει 13,5 J." },
    { until: 12, label: "Σταματά", say: "Στο d_{min} = 1 cm η ταχύτητα είναι μηδέν: όλη η αρχική κινητική έγινε δυναμική." },
    { until: 15, label: "Λύση", say: "½mυ₀² + kQq/d = kQq/d_{min} ⇒ υ₀² = 2kQq(1/d_{min} − 1/d)/m = 2·0,135·80/(6·10⁻³) = 3600 ⇒ υ₀ = 60 m/s." },
  ],
  Scene: ({ t }) => {
    const qx = 22;
    const y = 104;
    const px = 3000; // px per m (5 cm = 150 px)
    const u = 1 - Math.pow(1 - seg(t, 3.6, 9.4), 2);
    const r = lerp(0.05, 0.01, u);
    const x = qx + r * px;
    const v2 = Math.max(0, 3600 - ((2 * kQq3) / 6e-3) * (1 / r - 20));
    const v = Math.sqrt(v2);
    const K = 0.5 * 6e-3 * v2;
    const U = kQq3 / r;
    const F = kQq3 / (r * r);
    return (
      <g>
        <line x1={qx} y1={y} x2={qx + 0.052 * px} y2={y} stroke={C.faint} strokeDasharray="3 3" />
        <Charge x={qx} y={y} sign={1} r={12} label="Q" labelDy={-18} />
        <Charge x={x} y={y} sign={1} r={8} />
        <Arr x={x + 10} y={y - 18} dx={Math.min(46, 6 + (F / 1350) * 40)} color={EC.F} label="F" width={2.6} />
        <Arr x={x - 10} y={y + 22} dx={-(v / 60) * 40} color={EC.v} label="υ" ly={14} width={2.6} />
        {[0.01, 0.05].map((rr) => (
          <g key={rr}>
            <line x1={qx + rr * px} y1={y + 34} x2={qx + rr * px} y2={y + 40} stroke={C.muted} />
            <TE x={qx + rr * px} y={y + 52} s={rr === 0.01 ? "1 cm" : "5 cm"} size={9} color={C.muted} bold={false} />
          </g>
        ))}
        <Tag x={14} y={196} s="F ∝ 1/r²: όχι σταθερή α" color={EC.F} show={t < 3.5} />
        <Tag x={14} y={196} s="K + U = 13,5 J σταθερό" color="#1f9d55" show={t >= 3.5 && t < 12} />
        <Tag x={14} y={196} s="υ = 0 στο d_{min}" color={EC.v} show={t >= 12} />
        <BarsE
          y={104}
          max={13.5}
          items={[
            { label: "K", value: K, text: `${K.toFixed(1).replace(".", ",")} J`, color: "#e08a1e" },
            { label: "U", value: U, text: `${U.toFixed(1).replace(".", ",")} J`, color: "#1f9d55" },
          ]}
        />
        <PanelE
          lines={
            t < 12
              ? ["ΑΔΜΕ", "K_{αρχ} + U_{αρχ} = K_{τελ} + U_{τελ}", "½mυ₀² + kQq/d =", "   = 0 + kQq/d_{min}"]
              : ["Λύση", "υ₀² = 2kQq(1/d_{min} − 1/d)/m", "= 2·0,135·(100 − 20)/0,006", "υ₀² = 3600 ⇒ υ₀ = 60 m/s"]
          }
          size={9.6}
        />
      </g>
    );
  },
  solve: (
    <>
      ΑΔΜΕ: ½mυ_0² + kQq/d = 0 + kQq/d_min ⇒ υ_0² = 2kQq(1/d_min − 1/d)/m = 3600 ⇒ <b>υ_0 = 60 m/s</b>.
    </>
  ),
  trap: "Πεδίο Coulomb ⇒ μεταβλητή δύναμη ⇒ ΜΟΝΟ ενέργεια (ΑΔΜΕ ή ΘΜΚΕ). Οι τύποι υ = υ₀ ± αt ισχύουν μόνο στο ομογενές πεδίο.",
  more: [{ q: "Πόση είναι η κινητική ενέργεια όταν το σωματίδιο απέχει 2 cm από το Q;", a: "K = 13,5 − kQq/0,02 = 13,5 − 6,75 = 6,75 J (η μισή από την αρχική U μένει κινητική)." }],
};

/* ───────── Κ4. Δύο ελεύθερα σωματίδια ───────── */
const k4: ECase = {
  n: 44,
  badge: "Κ4",
  kind: KINDS.coulombP,
  title: "Δύο σωματίδια φεύγουν το ένα από το άλλο",
  what: "Αφήνουμε ελεύθερα δύο ομόσημα σωματίδια. Απωθούνται και φεύγουν αντίθετα. Το ελαφρύτερο αποκτά τριπλάσια ταχύτητα, γιατί οι ορμές τους είναι ίσες και αντίθετες.",
  given: "m_1 = 3 g, m_2 = 1 g, q_1 = q_2 = 4 μC, αρχική απόσταση r = 16 dm = 1,6 m, αρχικά ακίνητα. Βαρυτικές αλληλεπιδράσεις αμελητέες. k = 9·10⁹ N·m²/C².",
  ask: "Τις ταχύτητες υ_1 και υ_2 όταν βρίσκονται πολύ μακριά (στο άπειρο).",
  period: 15,
  legend: ["v", "K", "U"],
  phases: [
    { until: 3.5, label: "Αρχή", say: "Ακίνητα: K = 0, U = kq₁q₂/r = 9·10⁹·16·10⁻¹²/1,6 = 0,09 J. Ασκούνται μόνο εσωτερικές δυνάμεις ⇒ μονωμένο σύστημα." },
    { until: 7.5, label: "ΑΔΟ", say: "Ορμή πριν = 0 = −m₁υ₁ + m₂υ₂ ⇒ υ₂ = m₁υ₁/m₂ = 3υ₁. Ίσες ορμές, αντίθετες φορές." },
    { until: 11.5, label: "ΑΔΜΕ", say: "Στο άπειρο U = 0: 0,09 = ½·3·10⁻³·υ₁² + ½·10⁻³·(3υ₁)² = 6·10⁻³·υ₁²." },
    { until: 15, label: "Λύση", say: "υ₁² = 15 ⇒ υ₁ = √15 ≈ 3,9 m/s και υ₂ = 3√15 ≈ 11,6 m/s. Η K₂ είναι τριπλάσια της K₁." },
  ],
  Scene: ({ t }) => {
    const y = 96;
    const u = seg(t, 3.6, 14.5);
    const s = 22 * Math.pow(u, 0.8);
    const x1 = 82 - s;
    const x2 = 118 + 3 * s;
    const U = (0.09 * 36) / (x2 - x1); // starting separation 36 px stands for 1,6 m
    const K = 0.09 - U;
    return (
      <g>
        <line x1={6} y1={y} x2={194} y2={y} stroke={C.faint} strokeDasharray="3 3" />
        <Charge x={x1} y={y} sign={1} r={13} label="m₁" labelDy={-20} />
        <Charge x={x2} y={y} sign={1} r={8} label="m₂" labelDy={-15} />
        {t >= 3.6 ? (
          <g>
            <Arr x={x1 - 15} y={y + 26} dx={-12} color={EC.v} label="υ₁" ly={14} width={2.6} />
            <Arr x={x2 + 10} y={y + 26} dx={36} color={EC.v} label="υ₂ = 3υ₁" ly={14} width={2.6} size={10} />
          </g>
        ) : null}
        <Tag x={14} y={196} s="ορμή: m₁υ₁ = m₂υ₂" color={EC.v} show={t >= 3.5 && t < 7.5} />
        <Tag x={14} y={196} s="ενέργεια: U_{αρχ} = K₁ + K₂" color="#1f9d55" show={t >= 7.5} />
        <BarsE
          y={150}
          max={0.09}
          items={[
            { label: "U", value: U, text: `${U.toFixed(3).replace(".", ",")} J`, color: "#1f9d55" },
            { label: "K", value: K, text: `${K.toFixed(3).replace(".", ",")} J`, color: "#e08a1e" },
          ]}
        />
        <PanelE
          lines={
            t < 3.5
              ? ["Αρχή (ακίνητα)", "U = kq₁q₂/r = 0,09 J", "δύο ελεύθερα ⇒", "ΑΔΟ + ΑΔΜΕ"]
              : t < 7.5
                ? ["ΑΔΟ", "0 = −m₁υ₁ + m₂υ₂", "υ₂ = 3υ₁"]
                : t < 11.5
                  ? ["ΑΔΜΕ", "0,09 = ½m₁υ₁² + ½m₂υ₂²", "0,09 = 6·10^{-3}·υ₁²"]
                  : ["Λύση (στο άπειρο U = 0)", "υ₁ = √15 ≈ 3,9 m/s", "υ₂ = 3√15 ≈ 11,6 m/s"]
          }
          size={10}
        />
      </g>
    );
  },
  solve: (
    <>
      ΑΔΟ: υ_2 = 3υ_1. ΑΔΜΕ: kq_1q_2/r = ½m_1υ_1² + ½m_2υ_2² ⇒ 0,09 = 6·10⁻³·υ_1² ⇒ <b>υ_1 = √15 m/s ≈ 3,9 m/s</b>, <b>υ_2 = 3√15 m/s ≈ 11,6 m/s</b>.
    </>
  ),
  trap: "Όταν κινούνται και τα δύο, η ΑΔΜΕ μόνη της δεν αρκεί (δύο άγνωστοι). Χρειάζεσαι και ΑΔΟ. Αν το ένα είναι ακλόνητο (Κ3), αρκεί η ΑΔΜΕ.",
};

/* ───────── Κ5. Coulomb + βάρος ───────── */
const k5: ECase = {
  n: 45,
  badge: "Κ5",
  kind: KINDS.coulombG,
  title: "Ανεβαίνει πάνω από φορτίο στο δάπεδο",
  what: "Ένα φορτίο είναι ακλόνητο στο δάπεδο και από πάνω του αφήνουμε ομόσημο σωματίδιο. Στην αρχή η άπωση νικά το βάρος και το σωματίδιο ανεβαίνει. Ψηλότερα το βάρος νικά, το σωματίδιο φρενάρει και σταματά.",
  given: "Q = +2 μC στο δάπεδο. Σωματίδιο q = 0,5 μC, m = 9 g, αφήνεται ακίνητο σε r = 10 cm πάνω από το Q. g = 10 m/s², k = 9·10⁹ N·m²/C².",
  ask: "Το μέγιστο ύψος από το Q στο οποίο φτάνει το σωματίδιο.",
  period: 16,
  legend: ["F", "v", "K", "U"],
  phases: [
    { until: 3.5, label: "Δυνάμεις", say: "B = mg = 0,09 N. F = kqQ/r² = 9·10⁹·10⁻¹²/0,01 = 0,9 N. Αφού F > B, το σωματίδιο κινείται προς τα πάνω." },
    { until: 10, label: "Ανεβαίνει", say: "Η F μικραίνει σαν 1/r². Ως τα ≈ 32 cm επιταχύνεται (F > B), μετά φρενάρει (F < B) μέχρι να σταματήσει." },
    { until: 13, label: "ΑΔΜΕ", say: "Δύο δυναμικές: βαρυτική mgh (μηδέν στο δάπεδο) και ηλεκτρική kqQ/r. mg·r + kqQ/r = mg·h + kqQ/h ⇒ 0,099 = 0,09h + 0,009/h." },
    { until: 16, label: "Δύο ρίζες", say: "10h² − 11h + 1 = 0 ⇒ h = 0,1 m ή h = 1 m. Η 0,1 m είναι η αρχική θέση (κι εκεί υ = 0). Άρα h_{max} = 1 m." },
  ],
  Scene: ({ t }) => {
    const floor = 188;
    const qc = floor - 8; // centre of Q: heights are measured from here
    const px = 150; // px per m
    const qx = 70;
    const h = lerp(0.1, 1, easeInOut(seg(t, 3.6, 9.8)));
    const y = qc - h * px;
    const F = (K_NUM * 1e-12) / (h * h);
    const K = Math.max(0, 0.099 - 0.09 * h - 0.009 / h);
    const v = Math.sqrt((2 * K) / 9e-3);
    return (
      <g>
        <line x1={14} y1={floor} x2={186} y2={floor} stroke={C.ground} strokeWidth={2} />
        <Charge x={qx} y={qc} sign={1} r={7} />
        <TE x={qx - 14} y={qc + 4} s="Q" size={10} italic anchor="end" />
        <line x1={qx + 30} y1={qc} x2={qx + 30} y2={qc - px} stroke={C.faint} strokeDasharray="2 3" />
        {[0.1, 1].map((hh) => (
          <g key={hh}>
            <line x1={qx + 26} y1={qc - hh * px} x2={qx + 34} y2={qc - hh * px} stroke={C.muted} />
            <TE x={qx + 38} y={qc - hh * px + 3} s={hh === 1 ? "1 m" : "0,1 m"} size={9} color={C.muted} bold={false} anchor="start" />
          </g>
        ))}
        <Charge x={qx} y={y} sign={1} r={6} />
        <Arr x={qx - 14} y={y} dx={0} dy={-Math.min(44, F * 100)} color={EC.F} label="F" lx={-8} ly={0} width={2.6} />
        <Arr x={qx - 26} y={y} dx={0} dy={9} color={EC.g} label="B" lx={-8} ly={4} width={2.6} />
        {v > 0.05 ? <Arr x={qx + 14} y={y} dx={0} dy={-(v / 1.5) * 26} color={EC.v} label="υ" lx={8} ly={0} width={2.4} /> : null}
        <BarsE
          y={110}
          max={0.099}
          items={[
            { label: "U_{ηλ}", value: 0.009 / h, text: `${(0.009 / h).toFixed(3).replace(".", ",")} J`, color: "#1f9d55" },
            { label: "U_{βαρ}", value: 0.09 * h, text: `${(0.09 * h).toFixed(3).replace(".", ",")} J`, color: EC.g },
            { label: "K", value: K, text: `${K.toFixed(3).replace(".", ",")} J`, color: "#e08a1e" },
          ]}
        />
        <PanelE
          lines={
            t < 3.5
              ? ["Δυνάμεις στην αρχή", "B = mg = 0,09 N", "F = kqQ/r² = 0,9 N", "F > B ⇒ ανεβαίνει"]
              : t < 13
                ? ["ΑΔΜΕ (δύο U)", "mg·r + kqQ/r =", "  mg·h + kqQ/h", "0,099 = 0,09h + 0,009/h"]
                : ["Δύο ρίζες", "10h² − 11h + 1 = 0", "h = 0,1 m (αρχή)", "h_{max} = 1 m"]
          }
          size={10}
        />
      </g>
    );
  },
  solve: (
    <>
      F = 0,9 N &gt; B = 0,09 N ⇒ ανεβαίνει. ΑΔΜΕ: mg·r + kqQ/r = mg·h + kqQ/h ⇒ 10h² − 11h + 1 = 0 ⇒ <b>h_max = 1 m</b> (η ρίζα 0,1 m είναι η αρχική
      θέση).
    </>
  ),
  trap: "Η εξίσωση βγάζει δύο ρίζες. Η μία είναι πάντα η αρχική θέση (κι εκεί υ = 0). Γράψε ποια κρατάς και γιατί.",
};

/* ───────── Κ6. Διαφορά δυναμικού στο ομογενές ───────── */
const k6: ECase = {
  n: 46,
  badge: "Κ6",
  kind: KINDS.uniformV,
  title: "Πλάγια διαδρομή: μετράει η προβολή",
  what: "Σε ομογενές πεδίο πηγαίνουμε από το A στο Γ πλάγια. Για τη διαφορά δυναμικού μετράει μόνο πόσο προχωρήσαμε κατά μήκος των δυναμικών γραμμών (το ΑΔ).",
  given: "Ομογενές πεδίο E = 200 V/m. ΑΓ = 0,8 m, με γωνία φ = 60° ως προς τις δυναμικές γραμμές. Τα BA και ΓΔ είναι κάθετα στις γραμμές.",
  ask: "Τις διαφορές δυναμικού V_{ΑΔ}, V_{ΑΓ} και V_{ΒΑ}.",
  period: 14,
  legend: ["E", "U"],
  phases: [
    { until: 3.5, label: "Πλάγια", say: "Η διαδρομή ΑΓ σχηματίζει 60° με τις δυναμικές γραμμές. Το E = V/x ισχύει μόνο με απόσταση πάνω στη γραμμή." },
    { until: 7, label: "Προβολή", say: "Προβάλλουμε: ΑΔ = ΑΓ·συν60° = 0,8·0,5 = 0,4 m." },
    { until: 10.5, label: "V = E·x", say: "V_{ΑΔ} = E·ΑΔ = 200·0,4 = 80 V. Το δυναμικό πέφτει κατά τη φορά της E, άρα V_A > V_Δ." },
    { until: 14, label: "Ισοδυναμικές", say: "Οι κάθετες στις γραμμές έχουν ίδιο δυναμικό: V_Γ = V_Δ ⇒ V_{ΑΓ} = 80 V, και V_B = V_A ⇒ V_{ΒΑ} = 0." },
  ],
  Scene: ({ t }) => {
    const A = { x: 34, y: 168 };
    const D = { x: 94, y: 168 };
    const G = { x: 94, y: 64 };
    const B = { x: 34, y: 64 };
    const k = seg(t, 0.4, 3.3);
    const mover = { x: lerp(A.x, G.x, k), y: lerp(A.y, G.y, k) };
    const proj = seg(t, 3.6, 6.5);
    return (
      <g>
        <HLines x1={8} x2={190} ys={[48, 80, 112, 144, 176]} opacity={0.5} />
        <TE x={182} y={40} s="E" size={11} color={EC.E} italic />
        {t >= 10.5 ? (
          <g>
            <line x1={A.x} y1={36} x2={A.x} y2={190} stroke={EC.U} strokeWidth={2} strokeDasharray="5 4" />
            <line x1={D.x} y1={36} x2={D.x} y2={190} stroke={EC.U} strokeWidth={2} strokeDasharray="5 4" />
          </g>
        ) : null}
        <line x1={A.x} y1={A.y} x2={G.x} y2={G.y} stroke={C.ink} strokeWidth={1.6} />
        <line x1={G.x} y1={G.y} x2={D.x} y2={D.y} stroke={C.muted} strokeDasharray="3 3" />
        <line x1={B.x} y1={B.y} x2={A.x} y2={A.y} stroke={C.muted} strokeDasharray="3 3" />
        {t >= 3.5 ? <line x1={A.x} y1={A.y + 1} x2={lerp(A.x, D.x, proj)} y2={A.y + 1} stroke={EC.E} strokeWidth={4} /> : null}
        <TE x={A.x + 18} y={A.y - 10} s="60°" size={9} color={C.muted} bold={false} />
        <TE x={(A.x + G.x) / 2 - 22} y={(A.y + G.y) / 2 - 8} s="0,8 m" size={9} color={C.ink} bold={false} />
        {t >= 6.5 ? <TE x={(A.x + D.x) / 2} y={A.y + 16} s="ΑΔ = 0,4 m" size={9.5} color={EC.E} /> : null}
        {[
          [A, "A", -10, 4],
          [D, "Δ", 10, 4],
          [G, "Γ", 10, 0],
          [B, "B", -10, 0],
        ].map(([p, l, dx, dy]) => (
          <g key={l as string}>
            <Dot x={(p as typeof A).x} y={(p as typeof A).y} r={3} />
            <TE x={(p as typeof A).x + (dx as number)} y={(p as typeof A).y + (dy as number)} s={l as string} size={11} />
          </g>
        ))}
        {t < 3.5 ? <circle cx={mover.x} cy={mover.y} r={5} fill={EC.pos} stroke="#2b3545" /> : null}
        <Tag x={110} y={196} s="ίδια κάθετη ⇒ ίδιο V" color={EC.U} show={t >= 10.5} />
        <PanelE
          x={200}
          y={50}
          lines={
            t < 3.5
              ? ["Πλάγια διαδρομή", "x ≠ ΑΓ", "θέλουμε την προβολή"]
              : t < 7
                ? ["Προβολή", "ΑΔ = ΑΓ·συν60°", "ΑΔ = 0,4 m"]
                : t < 10.5
                  ? ["V = E·x", "V_{ΑΔ} = 200·0,4", "V_{ΑΔ} = 80 V"]
                  : ["Ισοδυναμικές", "V_{ΑΓ} = V_{ΑΔ} = 80 V", "V_{ΒΑ} = 0"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      ΑΔ = ΑΓ·συν60° = 0,4 m ⇒ <b>V_ΑΔ = E·ΑΔ = 80 V</b>. Γ, Δ στην ίδια κάθετη ⇒ <b>V_ΑΓ = 80 V</b>. B, A στην ίδια κάθετη ⇒ <b>V_ΒΑ = 0</b>.
    </>
  ),
  trap: "Στο E = V/x το x είναι πάντα πάνω στη δυναμική γραμμή. Με πλάγια απόσταση (0,8 m) θα έβγαζες λάθος 160 V.",
};

/* ───────── Κ7. Από ηρεμία ως την απέναντι πλάκα ───────── */
const k7: ECase = {
  n: 47,
  badge: "Κ7",
  kind: KINDS.uniformLine,
  title: "Από ηρεμία ως την αρνητική πλάκα",
  what: "Θετικό σωματίδιο αφήνεται δίπλα στη θετική πλάκα. Η δύναμη F = qE είναι σταθερή, άρα κάνει ευθύγραμμη ομαλά επιταχυνόμενη κίνηση: όπως ένα σώμα που πέφτει.",
  given: "Απόσταση πλακών d = 10 cm, E = 1000 V/m. q = +8 μC, m = 4·10⁻⁶ kg, αφήνεται ακίνητο τη στιγμή t_0 = 0. Βαρυτικές αλληλεπιδράσεις αμελητέες.",
  ask: "Πότε φτάνει στην αρνητική πλάκα και με ποια ταχύτητα.",
  period: 12,
  legend: ["E", "F", "v"],
  phases: [
    { until: 3.5, label: "Επιτάχυνση", say: "F = qE σταθερή, ομόρροπη της E. α = qE/m = 8·10⁻⁶·10³/(4·10⁻⁶) = 2·10³ m/s²." },
    { until: 8.5, label: "Κίνηση", say: "Από ηρεμία: x = ½αt², υ = αt. Σε ίσους χρόνους διανύει όλο και μεγαλύτερες αποστάσεις." },
    { until: 12, label: "Άφιξη", say: "d = ½αt₁² ⇒ t₁ = √(2d/α) = √(0,2/2000) = 10⁻² s. υ₁ = α·t₁ = 20 m/s." },
  ],
  Scene: ({ t }) => {
    const x1 = 24;
    const x2 = 176;
    const y = 106;
    const k = seg(t, 3.6, 8.4);
    const x = lerp(x1 + 9, x2 - 9, k * k);
    return (
      <g>
        <HLines x1={x1 + 4} x2={x2 - 4} ys={[50, 78, 134, 162]} opacity={0.55} />
        <Plates x1={x1} x2={x2} y1={36} y2={176} />
        <Charge x={x} y={y} sign={1} r={7} />
        <Arr x={Math.min(x + 9, x2 - 72)} y={y - 16} dx={26} color={EC.F} label="F" width={2.6} />
        {k > 0.02 ? <Arr x={Math.min(x + 9, x2 - 48)} y={y + 16} dx={k * 40} color={EC.v} label="υ" ly={14} width={2.6} /> : null}
        <line x1={x1} y1={190} x2={x2} y2={190} stroke={C.muted} />
        <TE x={(x1 + x2) / 2} y={204} s="d = 10 cm" size={9.5} color={C.muted} bold={false} />
        <PanelE
          lines={
            t < 3.5
              ? ["α = qE/m", "= 8·10^{-6}·10³/4·10^{-6}", "α = 2·10³ m/s²"]
              : t < 8.5
                ? ["Ομαλά επιταχυνόμενη", "x = ½αt²", "υ = αt"]
                : ["Άφιξη (x = d)", "t₁ = √(2d/α) = 10^{-2} s", "υ₁ = αt₁ = 20 m/s"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      α = qE/m = 2·10³ m/s². d = ½αt_1² ⇒ <b>t_1 = 10⁻² s</b>, <b>υ_1 = αt_1 = 20 m/s</b> (ή υ_1 = √(2αd)).
    </>
  ),
  trap: "Εδώ η κινηματική επιτρέπεται, επειδή το πεδίο είναι ομογενές (α σταθερή). Θα έβγαινε το ίδιο και με ενέργεια: ½mυ² = q·E·d.",
};

/* ───────── Κ8. Αρνητικό φορτίο φρενάρει ───────── */
const k8: ECase = {
  n: 48,
  badge: "Κ8",
  kind: KINDS.uniformLine,
  title: "Αρνητικό φορτίο με τη φορά της E: φρενάρει",
  what: "Αρνητικό σωματίδιο μπαίνει με ταχύτητα ίδιας φοράς με την ένταση. Η δύναμη είναι αντίθετη στην E (αρνητικό φορτίο), άρα αντίθετη στην κίνηση: το σωματίδιο φρενάρει, σταματά στιγμιαία και γυρίζει πίσω.",
  given: "q = −4 μC, m = 4·10⁻⁸ kg, E = 2000 V/m. Τη στιγμή t_0 = 0 έχει υ_0 = 20 m/s, ομόρροπη της E. Βαρυτικές αλληλεπιδράσεις αμελητέες.",
  ask: "Τη στιγμή που το σωματίδιο ακινητοποιείται στιγμιαία.",
  period: 12,
  legend: ["E", "F", "v"],
  phases: [
    { until: 3.5, label: "Φορά δύναμης", say: "Αρνητικό φορτίο ⇒ F αντίρροπη της E, άρα αντίθετη στην υ₀. α = |q|E/m = 4·10⁻⁶·2000/(4·10⁻⁸) = 2·10⁵ m/s²." },
    { until: 8.5, label: "Φρενάρει", say: "Ομαλά επιβραδυνόμενη: υ = υ₀ − αt. Η ταχύτητα μικραίνει κατά 2·10⁵ m/s κάθε δευτερόλεπτο." },
    { until: 12, label: "Σταματά", say: "0 = υ₀ − αt₁ ⇒ t₁ = υ₀/α = 20/(2·10⁵) = 10⁻⁴ s. Μετά γυρίζει πίσω, γιατί η F συνεχίζει να ασκείται." },
  ],
  Scene: ({ t }) => {
    const y = 106;
    const x0 = 48;
    const L = 124;
    const k = seg(t, 3.6, 8.4);
    const back = seg(t, 8.8, 11.8);
    const x = x0 + L * (1 - (1 - k) * (1 - k)) - 40 * back * back;
    const v = 1 - k;
    return (
      <g>
        <HLines x1={8} x2={192} ys={[46, 74, 138, 166]} opacity={0.55} />
        <TE x={184} y={38} s="E" size={11} color={EC.E} italic />
        <line x1={x0} y1={y} x2={x0 + L + 8} y2={y} stroke={C.faint} strokeDasharray="3 3" />
        <TE x={x0} y={y + 20} s="A" size={11} />
        <Charge x={x} y={y} sign={-1} r={7} />
        <Arr x={x - 9} y={y - 16} dx={-26} color={EC.F} label="F" width={2.6} />
        {t < 8.5 && v > 0.04 ? <Arr x={x + 9} y={y + 18} dx={v * 40} color={EC.v} label="υ" ly={14} width={2.6} /> : null}
        {t >= 8.5 ? <TE x={x0 + L} y={y + 36} s="υ = 0" size={10} color={EC.v} /> : null}
        <Tag x={14} y={196} s="F αντίθετη της υ ⇒ φρενάρει" color={EC.F} show={t >= 3.5} />
        <PanelE
          lines={
            t < 3.5
              ? ["q < 0 ⇒ F αντίθετη της E", "α = |q|E/m", "α = 2·10⁵ m/s²"]
              : t < 8.5
                ? ["Επιβραδυνόμενη", "υ = υ₀ − αt", "x = υ₀t − ½αt²"]
                : ["Στιγμιαία στάση", "0 = υ₀ − αt₁", "t₁ = υ₀/α = 10^{-4} s"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      α = |q|E/m = 2·10⁵ m/s², αντίθετη στην υ_0. 0 = υ_0 − αt_1 ⇒ <b>t_1 = 10⁻⁴ s</b>.
    </>
  ),
  trap: "Πρώτα βρίσκεις τη φορά της δύναμης από το πρόσημο του φορτίου. Αρνητικό φορτίο ⇒ δύναμη αντίθετη της E.",
  more: [{ q: "Πόσο απομακρύνθηκε από το A μέχρι να σταματήσει;", a: "x = υ₀²/(2α) = 400/(4·10⁵) = 10⁻³ m = 1 mm." }],
};

/* ───────── Κ9. Κάθετη είσοδος: η παγίδα του y₁ ≤ d ───────── */
const k9: ECase = {
  n: 49,
  badge: "Κ9",
  kind: KINDS.uniformBolt,
  title: "Βγαίνει από το πεδίο ή χτυπά την πλάκα;",
  what: "Θετικό σωματίδιο μπαίνει ανάμεσα σε οριζόντιες πλάκες παράλληλα σε αυτές. Κινείται σαν οριζόντια βολή, με την ηλεκτρική δύναμη στη θέση του βάρους. Με αυτά τα δεδομένα του βιβλίου χτυπά την κάτω πλάκα πριν βγει.",
  given: "m = 4·10⁻⁸ kg, q = +2 μC, υ_0 = 250 m/s κάθετη στις δυναμικές γραμμές. Πλάκες μήκους L = 1 m, τάση V = 400 V, απόσταση d = 0,2 m. Μπαίνει στο O, δίπλα στην πάνω (θετική) πλάκα. Βάρος αμελητέο. (Το σχέδιο δεν είναι σε κλίμακα.)",
  ask: "Τον χρόνο παραμονής στο πεδίο και την κατακόρυφη απόκλιση στην έξοδο.",
  period: 16,
  legend: ["E", "F", "v"],
  phases: [
    { until: 3.5, label: "Δύο κινήσεις", say: "Στον x: ευθύγραμμη ομαλή με υ₀. Στον y: από ηρεμία με α = qV/(md) = 2·10⁻⁶·400/(4·10⁻⁸·0,2) = 10⁵ m/s²." },
    { until: 8, label: "Τροχιά", say: "x = υ₀t, y = ½αt². Η απόκλιση μεγαλώνει με το τετράγωνο του χρόνου: παραβολή." },
    { until: 12, label: "Το βιβλίο", say: "Το βιβλίο παίρνει t₁ = L/υ₀ = 4·10⁻³ s και y₁ = ½α t₁² = 0,8 m. Όμως y₁ = 0,8 m > d = 0,2 m: αδύνατο." },
    { until: 16, label: "Σωστά", say: "Η απόκλιση φτάνει τα 0,2 m όταν ½αt² = 0,2 ⇒ t = 2·10⁻³ s, στο x = 250·0,002 = 0,5 m. Χτυπά την αρνητική πλάκα στη μέση της και δεν βγαίνει." },
  ],
  Scene: ({ t }) => {
    const x0 = 18;
    const Lpx = 170;
    const top = 50;
    const bot = 160;
    const ys = (y: number) => top + 6 + (y / 0.2) * (bot - top - 9);
    const xs = (x: number) => x0 + x * Lpx;
    const tt = seg(t, 3.6, 7.8) * 2e-3;
    const xm = 250 * tt;
    const ym = 0.5 * 1e5 * tt * tt;
    const path = Array.from({ length: 21 }, (_, i) => {
      const ti = (i / 20) * 2e-3;
      return `${xs(250 * ti)},${ys(0.5 * 1e5 * ti * ti)}`;
    }).join(" ");
    return (
      <g>
        <VLines y1={top + 4} y2={bot - 4} xs={[40, 80, 120, 160]} opacity={0.5} />
        <Plates x1={x0} x2={x0 + Lpx} y1={top} y2={bot} vertical={false} />
        <polyline points={path} fill="none" stroke={C.muted} strokeDasharray="3 3" strokeWidth={1.2} />
        {t >= 8 && t < 12 ? (
          <g>
            <line x1={xs(0.5)} y1={ys(0.2)} x2={xs(0.58)} y2={196} stroke="#c0392b" strokeDasharray="4 3" strokeWidth={1.5} />
            <TE x={xs(0.62)} y={182} s="y₁ = 0,8 m: έξω από τις πλάκες!" size={9} color="#c0392b" anchor="start" />
          </g>
        ) : null}
        <TE x={x0 - 6} y={ys(0) + 4} s="O" size={10} anchor="end" />
        <Charge x={xs(xm)} y={ys(ym)} sign={1} r={6} />
        {t < 8 ? <Arr x={xs(xm)} y={ys(ym) + 8} dx={0} dy={18} color={EC.F} label="F" lx={9} ly={2} width={2.4} /> : null}
        {t < 8 ? <Arr x={xs(xm) + 8} y={ys(ym)} dx={24} color={EC.v} label="υ₀" width={2.2} /> : null}
        {t >= 12 ? <TE x={xs(0.5)} y={bot + 16} s="χτυπά στο x = 0,5 m" size={9.5} color="#c0392b" /> : null}
        <TE x={x0 + Lpx / 2} y={top - 12} s="L = 1 m" size={9} color={C.muted} bold={false} />
        <Tag x={14} y={200} s="πάντα έλεγχος: y₁ ≤ d;" color="#c0392b" show={t >= 8} />
        <PanelE
          x={200}
          y={26}
          lines={
            t < 3.5
              ? ["x: ευθ. ομαλή", "y: α = qV/(md)", "α = 10⁵ m/s²"]
              : t < 8
                ? ["Τροχιά", "x = υ₀t", "y = ½αt²"]
                : t < 12
                  ? ["Βιβλίο ✗", "t₁ = L/υ₀ = 4·10^{-3} s", "y₁ = 0,8 m > d = 0,2 m", "αδύνατο!"]
                  : ["Σωστά ✓", "½αt² = d ⇒ t = 2·10^{-3} s", "x = υ₀t = 0,5 m < L", "χτυπά την πλάκα"]
          }
          size={10}
        />
      </g>
    );
  },
  solve: (
    <>
      α = qV/(md) = 10⁵ m/s². Το βιβλίο δίνει t_1 = L/υ_0 = 4·10⁻³ s και y_1 = 0,8 m. Αφού <b>y_1 = 0,8 m &gt; d = 0,2 m</b>, το σωματίδιο δεν βγαίνει:
      χτυπά την αρνητική πλάκα σε <b>t = 2·10⁻³ s</b>, στο <b>x = 0,5 m</b>.
    </>
  ),
  trap: "Λάθος στα δεδομένα του βιβλίου (σελ. 477–478): οι πράξεις του είναι σωστές, αλλά ξεχνά τη συνθήκη εξόδου y₁ ≤ d που γράφει το ίδιο στη σελ. 469. Σε κάθε τέτοια άσκηση ελέγχεις πρώτα αν βγαίνει.",
};

/* ───────── Κ10. Κάθετη είσοδος: έξοδος, γωνία, τροχιά ───────── */
const k10: ECase = {
  n: 50,
  badge: "Κ10",
  kind: KINDS.uniformBolt,
  title: "Ταχύτητα εξόδου, γωνία 45° και τροχιά y = 5x²",
  what: "Θετικό σωματίδιο μπαίνει κάθετα στις δυναμικές γραμμές. Στην έξοδο η κατακόρυφη ταχύτητα βγαίνει ίση με την οριζόντια, άρα φεύγει υπό γωνία 45°. Το σχέδιο είναι σε κλίμακα.",
  given: "m = 4·10⁻⁷ kg, q = +4 μC, υ_0 = 100 m/s κάθετη στις δυναμικές γραμμές, μήκος πλακών L = 0,1 m, E = 10.000 V/m. Βάρος αμελητέο.",
  ask: "Την ταχύτητα εξόδου (μέτρο και γωνία) και την εξίσωση της τροχιάς.",
  period: 16,
  legend: ["E", "F", "v"],
  phases: [
    { until: 3.5, label: "Επιτάχυνση", say: "α = qE/m = 4·10⁻⁶·10⁴/(4·10⁻⁷) = 10⁵ m/s², κατακόρυφη. Χρόνος στο πεδίο t₁ = L/υ₀ = 0,1/100 = 10⁻³ s." },
    { until: 8, label: "Μέσα στο πεδίο", say: "Η υ_x μένει 100 m/s. Η υ_y μεγαλώνει: υ_y = αt." },
    { until: 12, label: "Έξοδος", say: "υ₁y = α·t₁ = 10⁵·10⁻³ = 100 m/s. υ₁ = √(100² + 100²) = 100√2 m/s. εφφ = υ₁y/υ₁x = 1 ⇒ φ = 45°." },
    { until: 16, label: "Τροχιά", say: "Από x = υ₀t βγάζω t = x/υ₀ και το βάζω στο y = ½αt²: y = ½·10⁵·(x/100)² = 5x² (SI), για 0 ≤ x ≤ 0,1 m." },
  ],
  Scene: ({ t }) => {
    const x0 = 22;
    const s = 1500; // px per m, same on both axes
    const top = 30;
    const yO = top + 8;
    const bot = 150;
    const xs = (x: number) => x0 + x * s;
    const ys = (y: number) => yO + y * s;
    const tt = seg(t, 3.6, 7.8) * 1e-3;
    const xm = 100 * tt;
    const ym = 0.5 * 1e5 * tt * tt;
    const vy = 1e5 * tt;
    const out = t >= 8;
    const path = Array.from({ length: 21 }, (_, i) => {
      const x = (i / 20) * 0.1;
      return `${xs(x)},${ys(5 * x * x)}`;
    }).join(" ");
    return (
      <g>
        <VLines y1={top + 4} y2={bot - 4} xs={[50, 90, 130, 165]} opacity={0.5} />
        <Plates x1={x0} x2={xs(0.1)} y1={top} y2={bot} vertical={false} />
        <polyline points={path} fill="none" stroke={t >= 12 ? EC.U : C.muted} strokeDasharray={t >= 12 ? undefined : "3 3"} strokeWidth={t >= 12 ? 2.2 : 1.2} />
        {t >= 12 ? <TE x={xs(0.05)} y={ys(5 * 0.0025) + 22} s="y = 5x²" size={10.5} color={EC.U} /> : null}
        <TE x={x0 - 6} y={yO + 4} s="O" size={10} anchor="end" />
        <Charge x={out ? xs(0.1) : xs(xm)} y={out ? ys(0.05) : ys(ym)} sign={1} r={6} />
        {!out ? (
          <g>
            <Arr x={xs(xm) + 8} y={ys(ym)} dx={30} color={EC.v} label="υ_x" ly={14} width={2.2} size={10} />
            {vy > 4 ? <Arr x={xs(xm)} y={ys(ym) + 8} dx={0} dy={(vy / 100) * 30} color={EC.v} label="υ_y" lx={12} ly={2} width={2.2} size={10} /> : null}
          </g>
        ) : (
          <g>
            <Arr x={xs(0.1)} y={ys(0.05)} dx={30} color={EC.v} label="υ₁x" width={2} size={9.5} opacity={0.8} />
            <Arr x={xs(0.1)} y={ys(0.05)} dx={0} dy={30} color={EC.v} label="υ₁y" lx={-14} ly={2} width={2} size={9.5} opacity={0.8} />
            <Arr x={xs(0.1)} y={ys(0.05)} dx={30} dy={30} color={EC.v} label="υ₁" lx={16} ly={6} width={2.8} />
            <TE x={xs(0.1) + 16} y={ys(0.05) + 12} s="45°" size={9} color={C.muted} bold={false} />
          </g>
        )}
        <TE x={(x0 + xs(0.1)) / 2} y={top - 10} s="L = 0,1 m" size={9} color={C.muted} bold={false} />
        <PanelE
          x={200}
          y={30}
          lines={
            t < 3.5
              ? ["α = qE/m = 10⁵ m/s²", "t₁ = L/υ₀ = 10^{-3} s"]
              : t < 8
                ? ["Μέσα στο πεδίο", "υ_x = υ₀ = 100 m/s", "υ_y = αt"]
                : t < 12
                  ? ["Έξοδος", "υ₁y = αt₁ = 100 m/s", "υ₁ = 100√2 m/s", "εφφ = 1 ⇒ φ = 45°"]
                  : ["Τροχιά", "t = x/υ₀", "y = ½α(x/υ₀)²", "y = 5x²,  0 ≤ x ≤ 0,1 m"]
          }
          size={10}
        />
      </g>
    );
  },
  solve: (
    <>
      α = 10⁵ m/s², t_1 = 10⁻³ s, υ_1y = 100 m/s ⇒ <b>υ_1 = 100√2 m/s</b>, εφφ = 1 ⇒ <b>φ = 45°</b>. Τροχιά: <b>y = 5x² (SI)</b>, 0 ≤ x ≤ 0,1 m.
    </>
  ),
  trap: "Η τροχιά ισχύει μόνο μέσα στο πεδίο (0 ≤ x ≤ L). Έξω από τις πλάκες δεν ασκείται δύναμη και το σωματίδιο συνεχίζει ευθύγραμμα με την υ₁.",
  more: [{ q: "Πόση είναι η κατακόρυφη απόκλιση στην έξοδο;", a: "y₁ = 5·(0,1)² = 0,05 m = 5 cm." }],
};

export const karatzikos7: ECase[] = [k1, k2, k3, k4, k5];
export const karatzikos8: ECase[] = [k6, k7, k8, k9, k10];
