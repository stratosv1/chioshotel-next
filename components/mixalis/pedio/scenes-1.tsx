"use client";

import { C, Tag, lerp, seg } from "@/components/mixalis/ormi/kit";
import { Arr, BarsE, Charge, Dot, EC, HLines, PanelE, Radial, TE, sci, type ECase } from "./kitE";

const k = 9e9;

/* ───────── 1. Ένταση και δύναμη ───────── */
const case1: ECase = {
  n: 1,
  title: "Ένταση και δύναμη",
  what: "Σε ένα σημείο του πεδίου βάζουμε διαδοχικά διαφορετικά φορτία. Η δύναμη αλλάζει, αλλά το πηλίκο F/q μένει ίδιο: αυτό είναι η ένταση, ιδιότητα του σημείου και όχι του φορτίου.",
  given: "Σε σημείο Γ η ένταση έχει μέτρο E = 5·10⁴ N/C, προς τα δεξιά. Βάζουμε q₁ = +2 nC, μετά q₂ = +4 nC και τέλος ένα ηλεκτρόνιο (e = 1,6·10⁻¹⁹ C).",
  ask: "Τη δύναμη που δέχεται κάθε φορτίο (μέτρο και φορά).",
  period: 10.5,
  legend: ["E", "F"],
  phases: [
    {
      until: 3.5,
      label: "+2 nC",
      say: "F = |q|·E = 2·10⁻⁹·5·10⁴ = 10⁻⁴ N. Θετικό φορτίο: η δύναμη έχει τη φορά της έντασης (δεξιά).",
    },
    {
      until: 7,
      label: "+4 nC",
      say: "Με διπλάσιο φορτίο η δύναμη διπλασιάζεται: 2·10⁻⁴ N. Το F/q όμως μένει 5·10⁴ N/C: η ένταση δεν εξαρτάται από το φορτίο που βάζουμε στο σημείο.",
    },
    {
      until: 10.5,
      label: "Ηλεκτρόνιο",
      say: "Για το ηλεκτρόνιο: F = 1,6·10⁻¹⁹·5·10⁴ = 8·10⁻¹⁵ N, αλλά αντίθετα από την ένταση (αριστερά), γιατί είναι αρνητικό.",
    },
  ],
  Scene: ({ t }) => {
    const ph = t < 3.5 ? 0 : t < 7 ? 1 : 2;
    const q = ph === 0 ? 2e-9 : ph === 1 ? 4e-9 : -1.6e-19;
    const F = Math.abs(q) * 5e4;
    const len = ph === 2 ? 40 : (F / 1e-4) * 26;
    const x = 100;
    const y = 104;
    const appear = seg(t % 3.5, 0.2, 0.9);
    return (
      <g>
        <HLines x1={10} x2={190} ys={[46, 162]} />
        <TE x={182} y={36} s="E" size={12} color={EC.E} italic />
        <Dot x={x} y={y + 22} r={2.5} />
        <TE x={x} y={y + 38} s="Γ" size={11} />
        <g opacity={appear}>
          {ph < 2 ? <Charge x={x} y={y} sign={1} r={ph === 0 ? 9 : 12} /> : <Charge x={x} y={y} sign={-1} r={6} />}
          <Arr x={ph < 2 ? x + 12 : x - 9} y={y} dx={ph < 2 ? len : -len} color={EC.F} label="F" width={3} />
        </g>
        <PanelE
          lines={[
            ph === 0 ? "q = +2 nC" : ph === 1 ? "q = +4 nC" : "q = −e (ηλεκτρόνιο)",
            `F = |q|·E = ${sci(F, 2)} N`,
            ph < 2 ? "φορά: ίδια με την E" : "φορά: αντίθετη στην E",
            "F/|q| = 5·10⁴ N/C",
          ]}
        />
        <Tag x={200} y={196} s="η E δεν άλλαξε" color={EC.E} show={ph === 1} />
      </g>
    );
  },
  solve: (
    <>
      F = |q|·E: <b>q₁: 10⁻⁴ N</b> προς τα δεξιά, <b>q₂: 2·10⁻⁴ N</b> προς τα δεξιά, <b>ηλεκτρόνιο: 8·10⁻¹⁵ N</b> προς τα αριστερά.
    </>
  ),
  trap: "Η ένταση δεν είναι ιδιότητα του φορτίου που βάζουμε στο σημείο. Αν το απομακρύνουμε, η E εκεί μένει ίδια· αυτό που αλλάζει με το φορτίο είναι μόνο η δύναμη.",
};

/* ───────── 2. Πεδίο Coulomb ───────── */
const case2: ECase = {
  n: 2,
  title: "Πεδίο Coulomb",
  what: "Ένα ακλόνητο σημειακό φορτίο Q και ένα σημείο που απομακρύνεται από αυτό. Η ένταση μικραίνει γρήγορα, με το τετράγωνο της απόστασης.",
  given: "Q = +2 μC, k = 9·10⁹ N·m²/C². Σημεία σε απόσταση r = 1 m, 2 m και 3 m.",
  ask: "Την ένταση E σε κάθε σημείο. Τι αλλάζει αν το φορτίο είναι −2 μC;",
  period: 11,
  legend: ["E"],
  phases: [
    {
      until: 4,
      label: "Απομακρύνεται",
      say: "E = k|Q|/r². Στο 1 m: 9·10⁹·2·10⁻⁶/1 = 1,8·10⁴ N/C. Στα 2 m το r² τετραπλασιάζεται, άρα E = 4,5·10³ N/C (το ¼). Στα 3 m: 2·10³ N/C (το 1/9).",
    },
    {
      until: 7.5,
      label: "Η φορά",
      say: "Για θετική πηγή η ένταση δείχνει μακριά από το Q, πάνω στην ευθεία που ενώνει το Q με το σημείο (ακτινικά).",
    },
    {
      until: 11,
      label: "Αρνητικό Q",
      say: "Αν Q = −2 μC, τα μέτρα μένουν ίδια, αλλά η ένταση δείχνει προς το φορτίο. Στον τύπο E = k|Q|/r² βάζουμε την απόλυτη τιμή· το πρόσημο δίνει μόνο τη φορά.",
    },
  ],
  Scene: ({ t }) => {
    const neg = t >= 7.5;
    const r = t < 4 ? lerp(1, 3, seg(t, 0.3, 3.7)) : 1.6;
    const E = (k * 2e-6) / (r * r);
    const qx = 26;
    const y = 96;
    const px = qx + r * 52;
    const len = (E / 1.8e4) * 44;
    return (
      <g>
        <Radial x={qx} y={y} sign={neg ? -1 : 1} r0={16} r1={36} n={8} opacity={0.4} />
        <Charge x={qx} y={y} sign={neg ? -1 : 1} r={11} label={neg ? "−Q" : "+Q"} labelDy={-18} />
        {[1, 2, 3].map((m) => (
          <g key={m}>
            <line x1={qx + m * 52} y1={y + 18} x2={qx + m * 52} y2={y + 24} stroke={C.muted} />
            <TE x={qx + m * 52} y={y + 36} s={`${m} m`} size={9.5} color={C.muted} bold={false} />
          </g>
        ))}
        <line x1={qx} y1={y + 21} x2={qx + 160} y2={y + 21} stroke={C.faint} strokeDasharray="2 3" />
        <Dot x={px} y={y} r={3} />
        <Arr x={neg ? px - 3 : px + 3} y={y} dx={neg ? -len : len} color={EC.E} label="E" width={3} />
        <PanelE lines={[neg ? "Q = −2 μC" : "Q = +2 μC", `r = ${r.toFixed(1).replace(".", ",")} m`, `E = k|Q|/r² = ${sci(E, 2)} N/C`, neg ? "φορά: προς το Q" : "φορά: μακριά από Q"]} />
        <BarsE
          y={150}
          max={1.8e4}
          items={[
            { label: "E(1m)", value: 1.8e4, text: "1,8·10⁴", color: EC.E },
            { label: "E(2m)", value: 4.5e3, text: "4,5·10³", color: EC.E },
            { label: "E(3m)", value: 2e3, text: "2·10³", color: EC.E },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      E = k|Q|/r²: <b>1,8·10⁴ N/C</b> (1 m), <b>4,5·10³ N/C</b> (2 m), <b>2·10³ N/C</b> (3 m). Με −2 μC ίδια μέτρα, φορά προς το φορτίο.
    </>
  ),
  trap: "Η ένταση δεν πέφτει «στο μισό» όταν διπλασιάζεις την απόσταση· πέφτει στο ¼, γιατί στον τύπο υπάρχει r².",
};

/* ───────── 3. Δυναμικές γραμμές ───────── */
const case3: ECase = {
  n: 3,
  title: "Δυναμικές γραμμές",
  what: "Οι δυναμικές γραμμές μάς δείχνουν πώς είναι το πεδίο: σε κάθε σημείο τους η ένταση είναι εφαπτόμενη. Ένα μικρό θετικό φορτίο που αφήνεται ελεύθερο αρχίζει να κινείται κατά την εφαπτομένη της γραμμής.",
  given: "Σημειακό φορτίο Q = +4 μC (μετά −4 μC). Κοιτάμε σημεία σε r = 1 m και r = 2 m.",
  ask: "Τη φορά των γραμμών για θετικό και αρνητικό Q και την ένταση στα δύο σημεία.",
  period: 10.5,
  legend: ["E", "F"],
  phases: [
    {
      until: 3.5,
      label: "Θετικό Q",
      say: "Για θετικό Q οι γραμμές ξεκινούν από το φορτίο και απομακρύνονται προς το άπειρο. Ένα θετικό υπόθεμα απωθείται προς τα έξω, κατά μήκος της γραμμής.",
    },
    {
      until: 7,
      label: "Αρνητικό Q",
      say: "Για αρνητικό Q οι γραμμές έρχονται από το άπειρο και καταλήγουν στο φορτίο. Το θετικό υπόθεμα φορτίο τώρα έλκεται προς τα μέσα.",
    },
    {
      until: 10.5,
      label: "Πυκνότητα",
      say: "Κοντά στο φορτίο οι γραμμές είναι πυκνές (ισχυρό πεδίο), μακριά αραιές. Στο 1 m: E = 3,6·10⁴ N/C, στα 2 m: 9·10³ N/C, δηλαδή 4 φορές μικρότερη.",
    },
  ],
  Scene: ({ t }) => {
    const neg = t >= 3.5 && t < 7;
    const cx = 96;
    const cy = 100;
    const local = t < 3.5 ? t : t - 3.5;
    const d = neg ? lerp(78, 22, seg(local, 0.4, 3.2)) : lerp(22, 80, seg(local, 0.4, 3.2));
    const ang = -0.6;
    const tx = cx + Math.cos(ang) * d;
    const ty = cy + Math.sin(ang) * d;
    const dense = t >= 7;
    return (
      <g>
        <Radial x={cx} y={cy} sign={neg ? -1 : 1} r0={16} r1={86} n={12} />
        {dense ? (
          <g>
            <circle cx={cx} cy={cy} r={34} fill="none" stroke={C.muted} strokeDasharray="3 3" />
            <circle cx={cx} cy={cy} r={68} fill="none" stroke={C.muted} strokeDasharray="3 3" />
            <TE x={cx + 26} y={cy + 40} s="1 m" size={9.5} color={C.muted} bold={false} />
            <TE x={cx + 54} y={cy + 72} s="2 m" size={9.5} color={C.muted} bold={false} />
          </g>
        ) : null}
        <Charge x={cx} y={cy} sign={neg ? -1 : 1} r={12} />
        {!dense ? (
          <g>
            <circle cx={tx} cy={ty} r={5} fill={EC.pos} stroke="#2b3545" />
            <Arr x={tx + Math.cos(ang) * 6 * (neg ? -1 : 1)} y={ty + Math.sin(ang) * 6 * (neg ? -1 : 1)} dx={Math.cos(ang) * 22 * (neg ? -1 : 1)} dy={Math.sin(ang) * 22 * (neg ? -1 : 1)} color={EC.F} label="F" />
          </g>
        ) : null}
        <PanelE
          lines={
            dense
              ? ["Q = +4 μC", "E(1 m) = 3,6·10⁴ N/C", "E(2 m) = 9·10³ N/C", "πυκνές γραμμές = ισχυρό E"]
              : neg
                ? ["Q αρνητικό", "γραμμές: προς το Q", "+q: έλκεται"]
                : ["Q θετικό", "γραμμές: από το Q", "+q: απωθείται"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      Θετικό Q: γραμμές <b>από το φορτίο προς το άπειρο</b>. Αρνητικό: <b>από το άπειρο προς το φορτίο</b>. E = k|Q|/r²: <b>3,6·10⁴ N/C</b> στο 1 m και <b>9·10³ N/C</b> στα 2 m.
    </>
  ),
  trap: "Οι δυναμικές γραμμές δεν είναι τροχιές. Η ένταση είναι εφαπτόμενη σε αυτές· ένα φορτίο που κινείται δεν ακολουθεί αναγκαστικά μια καμπύλη γραμμή.",
};

/* ───────── 4. Δύο φορτία στην ίδια ευθεία ───────── */
const case4: ECase = {
  n: 4,
  title: "Δύο φορτία στην ευθεία",
  what: "Δύο ακλόνητα φορτία, ένα θετικό και ένα αρνητικό, και ένα σημείο Γ ανάμεσά τους. Η ολική ένταση είναι το διανυσματικό άθροισμα των δύο εντάσεων.",
  given: "Q₁ = +40 μC στο A, Q₂ = −20 μC στο B. Το Γ είναι ανάμεσα, με (AΓ) = 4 m και (ΓB) = 2 m. k = 9·10⁹ N·m²/C².",
  ask: "Την ένταση E_Γ του πεδίου στο Γ.",
  period: 10.5,
  legend: ["E"],
  phases: [
    {
      until: 3.5,
      label: "Από το Q₁",
      say: "Φανταζόμαστε ένα +q στο Γ. Το Q₁ (θετικό) το απωθεί προς τα δεξιά: E₁ = k|Q₁|/(AΓ)² = 9·10⁹·40·10⁻⁶/16 = 2,25·10⁴ N/C, δεξιά.",
    },
    {
      until: 7,
      label: "Από το Q₂",
      say: "Το Q₂ (αρνητικό) έλκει το +q προς τα δεξιά, προς το B: E₂ = 9·10⁹·20·10⁻⁶/4 = 4,5·10⁴ N/C, επίσης δεξιά.",
    },
    {
      until: 10.5,
      label: "Άθροισμα",
      say: "Οι δύο εντάσεις είναι ομόρροπες, άρα προστίθενται: E_Γ = 2,25·10⁴ + 4,5·10⁴ = 6,75·10⁴ N/C, προς το B.",
    },
  ],
  Scene: ({ t }) => {
    const ax = 22;
    const bx = 178;
    const y = 104;
    const gx = ax + (4 / 6) * (bx - ax);
    const s = 0.00085; // px per N/C
    const e1 = 2.25e4 * s;
    const e2 = 4.5e4 * s;
    const p2 = t >= 3.5;
    const p3 = t >= 7;
    return (
      <g>
        <line x1={ax} y1={y} x2={bx} y2={y} stroke={C.faint} strokeDasharray="3 3" />
        <Charge x={ax} y={y} sign={1} r={12} label="Q₁" labelDy={-18} />
        <Charge x={bx} y={y} sign={-1} r={10} label="Q₂" labelDy={-18} />
        <Dot x={gx} y={y} r={3} />
        <TE x={gx} y={y + 18} s="Γ" size={11} />
        <TE x={(ax + gx) / 2} y={y + 18} s="4 m" size={9.5} color={C.muted} bold={false} />
        <TE x={(gx + bx) / 2} y={y + 18} s="2 m" size={9.5} color={C.muted} bold={false} />
        <Arr x={gx} y={y - 14} dx={e1} color={EC.E} label="E₁" opacity={p3 ? 0.5 : 1} />
        {p2 ? <Arr x={gx} y={y - 34} dx={e2} color={EC.E} label="E₂" opacity={p3 ? 0.5 : 1} /> : null}
        {p3 ? <Arr x={gx - 60} y={y + 40} dx={e1 + e2} color="#0f6b39" label="E_Γ" width={3.4} ly={16} /> : null}
        <PanelE
          lines={
            !p2
              ? ["Από το Q₁", "E₁ = 9·10⁹·40·10⁻⁶/4²", "E₁ = 2,25·10⁴ N/C →"]
              : !p3
                ? ["Από το Q₂", "E₂ = 9·10⁹·20·10⁻⁶/2²", "E₂ = 4,5·10⁴ N/C →"]
                : ["Ομόρροπες: προσθέτω", "E_Γ = E₁ + E₂", "E_Γ = 6,75·10⁴ N/C →"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      E₁ = 2,25·10⁴ N/C και E₂ = 4,5·10⁴ N/C, και οι δύο προς το B. <b>E_Γ = 6,75·10⁴ N/C</b>, προς το B.
    </>
  ),
  trap: "Στους τύπους των μέτρων βάζεις |Q| χωρίς πρόσημο. Τα πρόσημα τα έχεις ήδη χρησιμοποιήσει για να βρεις τις φορές.",
};

/* ───────── 5. Σημείο όπου E = 0 ───────── */
const case5: ECase = {
  n: 5,
  title: "Σημείο όπου E = 0",
  what: "Ψάχνουμε σημείο της ευθείας όπου οι δύο εντάσεις αλληλοαναιρούνται. Πρέπει να είναι αντίθετες και ίσες κατά μέτρο. Για ομόσημα φορτία βρίσκεται ανάμεσα, για ετερόσημα έξω, κοντά στο μικρότερο.",
  given: "(AB) = ℓ = 12 m. α) Q₁ = +10 μC στο A, Q₂ = +40 μC στο B. β) Q₁ = +10 μC, Q₂ = −40 μC.",
  ask: "Σε ποιο σημείο της ευθείας η ολική ένταση είναι μηδέν, σε κάθε περίπτωση.",
  period: 11,
  legend: ["E"],
  phases: [
    {
      until: 4,
      label: "Ψάχνουμε",
      say: "Ομόσημα: ανάμεσα στα A και B οι εντάσεις είναι αντίθετες. Κοντά στο A κερδίζει η E₁, κοντά στο B η E₂. Κάπου ενδιάμεσα γίνονται ίσες.",
    },
    {
      until: 7.5,
      label: "x = 4 m",
      say: "k·10/x² = k·40/(12 − x)² ⇒ (12 − x)/x = 2 ⇒ x = 4 m από το A. Το σημείο είναι πιο κοντά στο μικρότερο φορτίο.",
    },
    {
      until: 11,
      label: "Ετερόσημα",
      say: "Με Q₂ = −40 μC ανάμεσα οι εντάσεις είναι ομόρροπες, δεν μηδενίζονται. Μηδενίζονται έξω, αριστερά του A (του μικρότερου): (12 + x)/x = 2 ⇒ x = 12 m αριστερά του A.",
    },
  ],
  Scene: ({ t }) => {
    const ax = 136;
    const bx = 256;
    const sc = 10; // px per m
    const y = 70;
    const het = t >= 7.5;
    let xm: number; // position from A in m (negative = left)
    if (t < 4) xm = lerp(1.5, 9, seg(t, 0.3, 3.6));
    else if (t < 7.5) xm = 4;
    else xm = lerp(-4, -12, seg(t, 7.8, 10.3));
    const px = ax + xm * sc;
    const r1 = Math.abs(xm);
    const r2 = Math.abs(12 - xm);
    const E1 = (k * 10e-6) / (r1 * r1);
    const E2 = (k * 40e-6) / (r2 * r2);
    const d1 = xm > 0 ? 1 : -1; // E1 points away from A
    const d2 = het ? (xm < 12 ? 1 : -1) : xm < 12 ? -1 : 1; // E2: from B (positive) or towards B (negative)
    const L = (E: number) => Math.max(4, Math.min(60, 10 + 16 * Math.log10(E / 400)));
    const zero = Math.abs(E1 - E2) / Math.max(E1, E2) < 0.03;
    return (
      <g>
        <line x1={14} y1={y} x2={346} y2={y} stroke={C.faint} strokeDasharray="3 3" />
        <Charge x={ax} y={y} sign={1} r={9} label="+10 μC" labelDy={-15} />
        <Charge x={bx} y={y} sign={het ? -1 : 1} r={13} label={het ? "−40 μC" : "+40 μC"} labelDy={-18} />
        <Dot x={px} y={y} r={3} />
        <Arr x={px} y={y + 14} dx={d1 * L(E1)} color={EC.E} label="E₁" ly={14} />
        <Arr x={px} y={y + 30} dx={d2 * L(E2)} color={EC.E} label="E₂" ly={14} />
        {zero ? <TE x={px} y={y - 12} s="E = 0" size={11} color={EC.E} /> : null}
        <PanelE
          x={14}
          y={118}
          w={300}
          lines={
            t < 7.5
              ? ["Ομόσημα: ανάμεσα στα A, B", `x = ${xm.toFixed(1).replace(".", ",")} m από το A`, `E₁ = ${sci(E1, 2)} · E₂ = ${sci(E2, 2)} N/C`, t >= 4 ? "10/x² = 40/(12 − x)² ⇒ x = 4 m" : "…"]
              : ["Ετερόσημα: έξω, κοντά στο μικρό", `x = ${Math.abs(xm).toFixed(1).replace(".", ",")} m αριστερά του A`, `E₁ = ${sci(E1, 2)} · E₂ = ${sci(E2, 2)} N/C`, "10/x² = 40/(12 + x)² ⇒ x = 12 m"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      α) Ομόσημα, ανάμεσα: 10/x² = 40/(12 − x)² ⇒ <b>x = 4 m από το A</b>. β) Ετερόσημα, αριστερά του A: 10/x² = 40/(12 + x)² ⇒ <b>x = 12 m αριστερά του A</b>.
    </>
  ),
  trap: "Η εξίσωση δίνει δύο ρίζες. Κράτα μόνο αυτή που είναι στη σωστή περιοχή (π.χ. ανάμεσα στα A, B για ομόσημα) και απόρριψε την άλλη.",
};

export const section1 = [case1, case2, case3, case4, case5];
