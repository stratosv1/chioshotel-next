"use client";

import { Ground, easeInOut, lerp, seg } from "@/components/mixalis/ormi/kit";
import { Arr, PanelE, TE, type ECase } from "@/components/mixalis/pedio/kitE";
import { Block, Dim, HeatMarks, VBars, VDim, WC, gr } from "./kitW";

/* ───────── 11. ΘΜΚΕ ───────── */
const case11: ECase = {
  n: 11,
  title: "ΘΜΚΕ",
  what: "Ένα σώμα σπρώχνεται σε τραχύ δάπεδο. Δύο δυνάμεις κάνουν έργο: η F (θετικό) και η τριβή (αρνητικό). Το άθροισμα των έργων είναι ακριβώς η αλλαγή της κινητικής ενέργειας.",
  given: "m = 2 kg, υ_{αρχ} = 2 m/s, F = 10 N οριζόντια, τριβή T = 2 N, μετατόπιση s = 4 m.",
  ask: "Την τελική ταχύτητα με το Θεώρημα Μεταβολής της Κινητικής Ενέργειας (ΘΜΚΕ).",
  period: 12,
  legend: ["F", "v", "W", "K"],
  phases: [
    { until: 3.5, label: "Οι δυνάμεις", say: "Βάρος και N είναι κάθετες στη μετατόπιση: έργο μηδέν. Έργο κάνουν μόνο η F (προς τα εμπρός) και η τριβή T (προς τα πίσω)." },
    { until: 8, label: "Τα έργα", say: "W_F = F·s = 10·4 = 40 J. W_T = −T·s = −2·4 = −8 J. Άθροισμα: ΣW = 40 − 8 = 32 J." },
    { until: 12, label: "ΘΜΚΕ", say: "ΣW = K_{τελ} − K_{αρχ}. K_{αρχ} = ½·2·2² = 4 J, άρα K_{τελ} = 4 + 32 = 36 J ⇒ ½·2·υ² = 36 ⇒ υ = 6 m/s." },
  ],
  Scene: ({ t }) => {
    const k = easeInOut(seg(t, 3.5, 8));
    const cx = 34 + k * 4 * 30;
    const v = Math.sqrt(4 + 32 * k);
    const WF = 40 * k;
    const WT = -8 * k;
    return (
      <g>
        <Ground y={150} x1={8} x2={192} rough />
        <Block cx={cx} y={150} />
        <Arr x={cx + 17} y={137} dx={34} color={WC.F} label="F" width={3} />
        <Arr x={cx - 17} y={145} dx={-16} color={WC.Q} label="T" width={2.6} size={10} />
        <Arr x={cx - 8} y={104} dx={6 + v * 5} color={WC.v} label={`${gr(v)} m/s`} size={9.5} width={2.2} />
        {t >= 3.5 ? <Dim x1={34} x2={cx} y={174} label={`s = ${gr(4 * k)} m`} /> : null}
        <PanelE
          lines={
            t < 3.5
              ? ["Ποιες κάνουν έργο;", "W_B = W_N = 0", "F → (+) · T ← (−)"]
              : t < 8
                ? [`W_F = 10·${gr(4 * k)} = ${gr(WF)} J`, `W_T = ${gr(WT)} J`, `ΣW = ${gr(WF + WT)} J`]
                : ["ΣW = K_{τελ} − K_{αρχ}", "32 = K_{τελ} − 4", "K_{τελ} = 36 J", "υ = 6 m/s"]
          }
        />
        <VBars
          x={226}
          base={190}
          max={40}
          height={58}
          w={24}
          gap={14}
          items={[
            { label: "W_F", value: WF, color: WC.W },
            { label: "|W_T|", value: -WT, color: WC.Q, text: `${gr(WT)} J` },
            { label: "K", value: 4 + 32 * k, color: WC.K },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      W_F = 40 J, W_T = −8 J ⇒ <b>ΣW = 32 J</b>. ΘΜΚΕ: <b>K_τελ = K_αρχ + ΣW = 4 + 32 = 36 J</b> ⇒ ½·2·υ² = 36 ⇒ <b>υ = 6 m/s</b>.
    </>
  ),
  trap: "Στο ΘΜΚΕ μπαίνουν τα έργα ΟΛΩΝ των δυνάμεων με τα πρόσημά τους, όχι μόνο της δύναμης που σπρώχνει. Μόνο αυτό το άθροισμα ισούται με ΔK.",
};

/* ───────── 12. Μηχανική ενέργεια ───────── */
const case12: ECase = {
  n: 12,
  title: "Μηχανική ενέργεια",
  what: "Μια μπάλα κυλάει στην άκρη ενός γκρεμού. Έχει κινητική ενέργεια επειδή κινείται και δυναμική επειδή είναι ψηλά. Το άθροισμά τους είναι η μηχανική ενέργεια.",
  given: "m = 2 kg, ύψος h = 5 m από το έδαφος, ταχύτητα υ = 3 m/s, g = 10 m/s². U = 0 στο έδαφος.",
  ask: "Την κινητική, τη δυναμική και τη μηχανική ενέργεια.",
  period: 11,
  legend: ["v", "K", "Ug"],
  phases: [
    { until: 3.5, label: "Κινητική", say: "K = ½·m·υ² = ½·2·3² = 9 J." },
    { until: 6.5, label: "Δυναμική", say: "U = m·g·h = 2·10·5 = 100 J (με U = 0 στο έδαφος)." },
    { until: 11, label: "Άθροισμα", say: "E_{μηχ} = K + U = 9 + 100 = 109 J. Καθώς πέφτει χωρίς αντίσταση αέρα, η U γίνεται K, αλλά το άθροισμα μένει 109 J." },
  ],
  Scene: ({ t }) => {
    const ppm = 22;
    const ground = 182;
    const top = ground - 5 * ppm;
    const edge = 70;
    const kf = seg(t, 6.8, 9.6);
    const tau = kf * 1; // seconds of fall
    const yDrop = Math.min(5, 5 * tau * tau);
    const bx = t < 6.8 ? lerp(24, edge - 6, seg(t, 0, 3)) : edge - 6 + 3 * 7 * tau;
    const by = top - 8 + yDrop * ppm;
    const h = 5 - yDrop;
    const U = 2 * 10 * h;
    const K = 109 - U;
    return (
      <g>
        <path d={`M 8 ${top} L ${edge} ${top} L ${edge} ${ground}`} fill="#e8dfd2" stroke="#8a8f99" strokeWidth={2} />
        <Ground y={ground} x1={edge} x2={192} />
        <circle cx={bx} cy={by} r={8} fill="#f4a261" stroke="#4a5568" strokeWidth={1.3} />
        <Arr x={bx + 9} y={by - 2} dx={20} dy={t >= 6.8 ? 20 * Math.min(1.4, tau * 1.4) : 0} color={WC.v} label="υ" size={10} width={2.2} />
        <VDim x={edge + 14} y1={top} y2={ground} label="h = 5 m" />
        <PanelE
          lines={
            t < 3.5
              ? ["K = ½·m·υ^2", "K = ½·2·3^2", "K = 9 J"]
              : t < 6.5
                ? ["U = m·g·h", "U = 2·10·5", "U = 100 J"]
                : ["E_{μηχ} = K + U", "E_{μηχ} = 9 + 100", "E_{μηχ} = 109 J", t >= 6.8 ? `U = ${gr(U, 0)} · K = ${gr(K, 0)}` : "σταθερή στην πτώση"]
          }
        />
        <VBars
          x={228}
          base={190}
          max={110}
          height={56}
          w={26}
          gap={14}
          items={[
            { label: "K", value: t < 6.8 ? 9 : K, color: WC.K },
            ...(t >= 3.5 ? [{ label: "U", value: t < 6.8 ? 100 : U, color: WC.U }] : []),
            ...(t >= 6.5 ? [{ label: "E_{μηχ}", value: 109, color: WC.W }] : []),
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      K = ½·2·3² = 9 J, U = 2·10·5 = 100 J ⇒ <b>E_μηχ = K + U = 109 J</b>.
    </>
  ),
  trap: "Αν υπάρχει και ελατήριο, προσθέτεις και την ελαστική: E_{μηχ} = K + U_{βαρ} + U_{ελ}. Η U εξαρτάται από το πού έβαλες το U = 0.",
};

/* ───────── 13. ΑΔΜΕ – ελεύθερη πτώση ───────── */
const case13: ECase = {
  n: 13,
  title: "ΑΔΜΕ – ελεύθερη πτώση",
  what: "Αφήνουμε μια μπάλα να πέσει χωρίς αντίσταση αέρα. Η δυναμική ενέργεια μετατρέπεται σιγά σιγά σε κινητική. Το άθροισμα K + U μένει σταθερό: Αρχή Διατήρησης της Μηχανικής Ενέργειας (ΑΔΜΕ).",
  given: "m = 1 kg, αφήνεται από ύψος h = 5 m (υ_{αρχ} = 0), g = 10 m/s², χωρίς αντίσταση αέρα.",
  ask: "Την ταχύτητα λίγο πριν φτάσει στο έδαφος.",
  period: 11,
  legend: ["F", "v", "K", "Ug"],
  phases: [
    { until: 3, label: "Πάνω", say: "Στην αρχή: υ = 0 ⇒ K = 0. Όλη η ενέργεια είναι δυναμική: U = m·g·h = 1·10·5 = 50 J." },
    { until: 7, label: "Πτώση", say: "Έργο κάνει μόνο το βάρος, που είναι συντηρητική δύναμη. Η U μειώνεται, η K αυξάνεται κατά το ίδιο ποσό. Στη μέση: U = 25 J, K = 25 J." },
    { until: 11, label: "Κάτω", say: "ΑΔΜΕ: 0 + m·g·h = ½·m·υ² + 0 ⇒ υ = √(2·g·h) = √(2·10·5) = 10 m/s. Η μάζα απλοποιείται!" },
  ],
  Scene: ({ t }) => {
    const ppm = 26;
    const ground = 184;
    const top = ground - 5 * ppm;
    const kf = seg(t, 3, 7);
    const y = 5 * (1 - kf * kf);
    const by = ground - 9 - y * ppm;
    const U = 10 * y;
    const K = 50 - U;
    const v = Math.sqrt(2 * K);
    return (
      <g>
        <Ground y={ground} x1={8} x2={192} />
        <line x1={60} y1={top - 9} x2={60} y2={ground} stroke="#c7ccd4" strokeDasharray="3 3" />
        <circle cx={60} cy={by} r={9} fill="#f4a261" stroke="#4a5568" strokeWidth={1.3} />
        <Arr x={60} y={by + 9} dx={0} dy={22} color={WC.F} label="mg" lx={-16} ly={4} size={10} width={2.2} />
        {v > 0.3 ? <Arr x={78} y={by - 10} dx={0} dy={v * 3.4} color={WC.v} label={`${gr(v)} m/s`} lx={26} ly={4} size={9.5} width={2.2} /> : null}
        {y > 0.4 ? <VDim x={28} y1={by} y2={ground} label={`${gr(y)} m`} /> : null}
        <PanelE
          lines={
            t < 3
              ? ["Πάνω: υ = 0", "K = 0", "U = 1·10·5 = 50 J"]
              : t < 7
                ? ["K + U = σταθ.", `U = ${gr(U)} J`, `K = ${gr(K)} J`, "K + U = 50 J"]
                : ["m·g·h = ½·m·υ^2", "υ = √(2·g·h)", "υ = √100 = 10 m/s"]
          }
        />
        <VBars
          x={240}
          base={190}
          max={50}
          height={58}
          w={26}
          gap={16}
          items={[
            { label: "U", value: U, color: WC.U },
            { label: "K", value: K, color: WC.K },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      ΑΔΜΕ: K_αρχ + U_αρχ = K_τελ + U_τελ ⇒ 0 + m·g·h = ½·m·υ² + 0 ⇒ <b>υ = √(2·g·h) = √(2·10·5) = 10 m/s</b>.
    </>
  ),
  trap: "Την ΑΔΜΕ τη χρησιμοποιείς μόνο αν έργο κάνουν μόνο βάρος ή ελατήριο. Αν υπάρχει τριβή ή αντίσταση αέρα, πας σε ΘΜΚΕ (κουτάκια 11, 15).",
};

/* ───────── 14. Συντηρητικές δυνάμεις ───────── */
const case14: ECase = {
  n: 14,
  title: "Συντηρητικές δυνάμεις",
  what: "Ένα σώμα πάει από το A στο B από δύο διαφορετικούς δρόμους. Το έργο του βάρους βγαίνει ίδιο, γιατί εξαρτάται μόνο από την αρχή και το τέλος. Αυτό σημαίνει «συντηρητική δύναμη».",
  given: "m = 2 kg, το A είναι h = 3 m ψηλότερα από το B, g = 10 m/s².",
  ask: "Το έργο του βάρους από A σε B για κάθε δρόμο και σε κλειστή διαδρομή.",
  period: 13,
  legend: ["W"],
  phases: [
    { until: 4, label: "Δρόμος 1", say: "Από τον ευθύ δρόμο: W_B = m·g·h = 2·10·3 = 60 J." },
    { until: 8, label: "Δρόμος 2", say: "Από τον καμπύλο, μακρύτερο δρόμο: πάλι W_B = 60 J. Το βάρος «νοιάζεται» μόνο για την υψομετρική διαφορά h." },
    { until: 13, label: "Κλειστή διαδρομή", say: "Από A σε B και πίσω στο A: +60 − 60 = 0. Το έργο συντηρητικής δύναμης σε κλειστή διαδρομή είναι μηδέν. Η τριβή δεν είναι συντηρητική: σε μακρύτερο δρόμο κάνει περισσότερο (αρνητικό) έργο." },
  ],
  Scene: ({ t }) => {
    const A = { x: 30, y: 60 };
    const B = { x: 170, y: 160 };
    const curve = (u: number) => {
      // cubic Bezier A → (70,10) → (110,200) → B
      const p0 = A, p1 = { x: 70, y: 0 }, p2 = { x: 120, y: 210 }, p3 = B;
      const m = 1 - u;
      return {
        x: m * m * m * p0.x + 3 * m * m * u * p1.x + 3 * m * u * u * p2.x + u * u * u * p3.x,
        y: m * m * m * p0.y + 3 * m * m * u * p1.y + 3 * m * u * u * p2.y + u * u * u * p3.y,
      };
    };
    let p = A;
    let W = 0;
    if (t < 4) {
      const k = easeInOut(seg(t, 0.5, 3.5));
      p = { x: lerp(A.x, B.x, k), y: lerp(A.y, B.y, k) };
      W = 60 * k;
    } else if (t < 8) {
      const k = easeInOut(seg(t, 4.5, 7.5));
      p = curve(k);
      W = 60 * ((p.y - A.y) / (B.y - A.y));
    } else {
      const k = seg(t, 8.5, 12.5);
      if (k < 0.5) {
        const kk = easeInOut(k * 2);
        p = { x: lerp(A.x, B.x, kk), y: lerp(A.y, B.y, kk) };
        W = 60 * kk;
      } else {
        const kk = easeInOut((k - 0.5) * 2);
        p = curve(1 - kk);
        W = 60 * ((p.y - A.y) / (B.y - A.y));
      }
    }
    return (
      <g>
        <line x1={8} y1={B.y + 6} x2={192} y2={B.y + 6} stroke="#8a8f99" strokeWidth={1.5} />
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={t < 4 || t >= 8 ? "#1f6fd1" : "#c7ccd4"} strokeWidth={2} />
        <path d={`M ${A.x} ${A.y} C 70 0 120 210 ${B.x} ${B.y}`} fill="none" stroke={t >= 4 ? "#1f6fd1" : "#c7ccd4"} strokeWidth={2} strokeDasharray="5 3" />
        <circle cx={A.x} cy={A.y} r={3.5} fill="#1c2433" />
        <circle cx={B.x} cy={B.y} r={3.5} fill="#1c2433" />
        <TE x={A.x - 8} y={A.y - 6} s="A" size={11} />
        <TE x={B.x + 8} y={B.y - 6} s="B" size={11} />
        <VDim x={186} y1={A.y} y2={B.y} label="" />
        <TE x={176} y={112} s="h" size={10.5} color={WC.s} italic />
        <circle cx={p.x} cy={p.y - 7} r={7} fill="#f2c46d" stroke="#4a5568" strokeWidth={1.2} />
        <PanelE
          lines={
            t < 4
              ? ["Δρόμος 1 (ευθύς)", "W_B = m·g·h", `W_B = ${gr(W, 0)} J`]
              : t < 8
                ? ["Δρόμος 2 (καμπύλος)", "W_B = m·g·h", `W_B = ${gr(W, 0)} J`, "ίδιο με τον 1!"]
                : ["A → B → A", `W_B = ${gr(W, 0)} J τώρα`, "συνολικά: 60 − 60 = 0", "W_{κλειστή} = 0"]
          }
        />
        <VBars x={258} base={190} max={60} height={56} w={30} items={[{ label: "W_B", value: W, color: WC.W, text: `${gr(W, 0)} J` }]} />
      </g>
    );
  },
  solve: (
    <>
      <b>W_B = m·g·h = 2·10·3 = 60 J</b> και για τους δύο δρόμους. Σε κλειστή διαδρομή <b>W_B = 0</b>. Συντηρητικές: βάρος, δύναμη ελατηρίου. Μη συντηρητικές: τριβή, αντίσταση αέρα.
    </>
  ),
  trap: "Μόνο για συντηρητικές δυνάμεις ορίζεται δυναμική ενέργεια (U, U_{ελ}). Για την τριβή δεν υπάρχει «δυναμική ενέργεια τριβής».",
};

/* ───────── 15. Απώλειες με τριβή ───────── */
const case15: ECase = {
  n: 15,
  title: "Απώλειες με τριβή",
  what: "Ένα κιβώτιο γλιστράει σε τραχύ κεκλιμένο επίπεδο. Η τριβή «τρώει» μηχανική ενέργεια και τη μετατρέπει σε θερμότητα. Η συνολική ενέργεια όμως δεν χάνεται.",
  given: "Μηχανική ενέργεια στην αρχή E_{αρχ} = 50 J. Η τριβή κάνει έργο W_T = −15 J μέχρι το τέλος.",
  ask: "Την τελική μηχανική ενέργεια και τη θερμότητα που παράγεται.",
  period: 11,
  legend: ["v", "W", "Q"],
  phases: [
    { until: 3, label: "Αρχή", say: "Στην αρχή E_{μηχ} = K + U = 50 J. Υπάρχει τριβή, άρα δεν ισχύει ΑΔΜΕ." },
    { until: 7.5, label: "Ολίσθηση", say: "Η μηχανική ενέργεια μειώνεται όσο το (αρνητικό) έργο της τριβής: W_T = ΔE_{μηχ} = E_{τελ} − E_{αρχ}." },
    { until: 11, label: "Αποτέλεσμα", say: "−15 = E_{τελ} − 50 ⇒ E_{τελ} = 35 J. Τα 15 J έγιναν θερμότητα Q = |W_T|. Συνολικά: 35 + 15 = 50 J, η ενέργεια διατηρείται." },
  ],
  Scene: ({ t }) => {
    const k = seg(t, 3, 7.5);
    const x0 = 22, y0 = 64, x1 = 176, y1 = 170;
    const ang = Math.atan2(y1 - y0, x1 - x0);
    const along = lerp(10, 150, easeInOut(k));
    const bx = x0 + along * Math.cos(ang);
    const by = y0 + along * Math.sin(ang);
    const Q = 15 * k;
    const deg = (ang * 180) / Math.PI;
    return (
      <g>
        <path d={`M ${x0} ${y0} L ${x1} ${y1} L ${x0} ${y1} Z`} fill="#e8dfd2" stroke="#8a8f99" strokeWidth={1.5} />
        <path
          d={Array.from({ length: 30 }, (_, i) => {
            const u = i / 29;
            const px = lerp(x0, x1, u) + (i % 2 ? 1.5 : 0);
            const py = lerp(y0, y1, u) - (i % 2 ? 1.5 : 0);
            return `${i ? "L" : "M"}${px},${py}`;
          }).join(" ")}
          fill="none"
          stroke="#8a8f99"
          strokeWidth={1}
        />
        <g transform={`translate(${bx} ${by}) rotate(${deg})`}>
          <rect x={-15} y={-20} width={30} height={20} rx={3} fill="#f2c46d" stroke="#4a5568" strokeWidth={1.3} />
          <TE x={0} y={-6} s="m" size={11} italic />
          <Arr x={-15} y={-4} dx={-22} color={WC.Q} label="T" size={10} width={2.4} />
          {t >= 3 && t < 7.5 ? <Arr x={2} y={-28} dx={22} color={WC.v} label="υ" size={10} width={2.2} /> : null}
        </g>
        <HeatMarks x={bx - 20} y={by - 26} k={seg(t, 3.5, 5) * (t < 7.5 ? 1 : 0.6)} />
        <PanelE
          lines={
            t < 3
              ? ["E_{αρχ} = 50 J", "υπάρχει τριβή", "⇒ όχι ΑΔΜΕ"]
              : t < 7.5
                ? ["W_T = ΔE_{μηχ}", `W_T = −${gr(Q)} J`, `E_{μηχ} = ${gr(50 - Q)} J`]
                : ["−15 = E_{τελ} − 50", "E_{τελ} = 35 J", "Q = |W_T| = 15 J", "35 + 15 = 50 J"]
          }
        />
        <VBars
          x={244}
          base={190}
          max={50}
          height={58}
          w={28}
          gap={16}
          items={[
            { label: "E_{μηχ}", value: 50 - Q, color: WC.W },
            { label: "Q", value: Q, color: WC.Q },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      <b>W_T = E_τελ − E_αρχ</b> ⇒ −15 = E_τελ − 50 ⇒ <b>E_τελ = 35 J</b>. Θερμότητα <b>Q = |W_T| = 15 J</b>.
    </>
  ),
  trap: "Η μηχανική ενέργεια μειώνεται, η ολική ενέργεια όχι. Μην γράψεις «χάθηκε ενέργεια»: έγινε θερμότητα.",
};

export const section3: ECase[] = [case11, case12, case13, case14, case15];
