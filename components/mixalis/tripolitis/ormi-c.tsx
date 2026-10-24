"use client";

import { Ball, Box, C, Ground, T, Tag, Vec, Wall, bump, lerp, seg } from "@/components/mixalis/ormi/kit";
import type { Exercise } from "./ExerciseCard";
import { Clock, Graph, L, Lines, Ruler, Track, ex, num, pw, tau } from "./tkit";

const SRC = "Τριπολίτης σ. 169–171";

/* 4.101 ───────── */
const e101 = ex({
  id: "4.101",
  source: SRC,
  title: "Πλάγια δύναμη και τριβή",
  statement: "Σώμα 2 kg εκτοξεύεται τη στιγμή 0 με 4 m/s σε οριζόντιο δάπεδο (μ = 0,5) και ταυτόχρονα δέχεται σταθερή δύναμη 10 N υπό γωνία φ προς τα πάνω (ημφ = 0,6, συνφ = 0,8). Βρες: α) τον ρυθμό μεταβολής της ορμής τη στιγμή 1 s, β) το μέτρο της μεταβολής της ορμής στο 3ο δευτερόλεπτο (g = 10 m/s²).",
  given: "m = 2 kg, υ_0 = 4 m/s, F = 10 N, ημφ = 0,6, συνφ = 0,8, μ = 0,5, g = 10 m/s²",
  ask: "α) Δp/Δt στο 1 s  β) |Δp| από 2 s έως 3 s",
  legend: ["v", "F"],
  phases: [
    { until: 3, label: "Ανάλυση της F", say: "F_x = F·συνφ = 8 N (μπροστά). F_y = F·ημφ = 6 N (προς τα πάνω): «σηκώνει» λίγο το σώμα." },
    { until: 6, label: "Κάθετη και τριβή", say: "Κατακόρυφα: N + F_y = m·g, άρα N = 20 − 6 = 14 N. Τριβή T = μ·N = 0,5·14 = 7 N." },
    { until: 10, label: "ΣF", say: "ΣF = 8 − 7 = 1 N, σταθερή. Άρα Δp/Δt = 1 kg·m/s² κάθε στιγμή, και στο 3ο δευτερόλεπτο Δp = 1·1 = 1 kg·m/s." },
  ],
  Scene: ({ t }) => {
    const s = tau(t, 6, 10, 0, 3);
    const v = (q: number) => 4 + 0.5 * q;
    const gy = 112;
    const x = 40 + 8 * (4 * s + 0.25 * s * s);
    return (
      <g>
        <Ground y={gy} rough />
        <Box cx={x} y={gy} w={36} h={28} label="m" />
        <Vec x={x} y={gy - 14} dx={48} dy={-36} color={C.F} label="F" width={3} />
        {t > 1 ? <Vec x={x} y={gy - 14} dx={38} color={C.F} label="F_x" labelSide="below" dashed width={2} /> : null}
        {t > 1 ? <Vec x={x} y={gy - 14} dx={0} dy={-29} color={C.F} label="F_y" labelSide="left" dashed width={2} /> : null}
        {t > 3 ? (
          <g>
            <Vec x={x - 6} y={gy - 28} dx={0} dy={-22} color="#6b4fa0" label="N" labelSide="left" />
            <Vec x={x + 6} y={gy} dx={0} dy={34} color="#7a2c22" label="w" />
            <Vec x={x - 18} y={gy - 4} dx={-33} color="#7a2c22" label="T" labelSide="above" />
          </g>
        ) : null}
        <Vec x={x + 18} y={gy - 54} dx={v(s) * 5} label="υ" />
        <Clock s={s} />
        <Lines
          x={214}
          y={30}
          size={10}
          lines={[
            { s: "F_x = 8 N, F_y = 6 N", color: C.F },
            { s: t > 3 ? "N = 20 − 6 = 14 N" : "" },
            { s: t > 3 ? "T = 0,5·14 = 7 N" : "", color: "#7a2c22" },
            { s: t > 6 ? "ΣF = 8 − 7 = 1 N" : "", color: C.F },
          ]}
        />
      </g>
    );
  },
  steps: [
    { title: "Ανάλυση της F", body: "F_x = 10·0,8 = 8 N, F_y = 10·0,6 = 6 N." },
    { title: "Κάθετη αντίδραση", body: "Κατακόρυφα ισορροπεί: N + F_y = m·g  →  N = 20 − 6 = 14 N. (Όχι 20 N!)" },
    { title: "Τριβή και ΣF", body: "T = μ·N = 7 N. ΣF = F_x − T = 8 − 7 = 1 N." },
    { title: "α) Ρυθμός", body: "Δp/Δt = ΣF = 1 kg·m/s² (σταθερός, άρα και στο 1 s)." },
    { title: "β) 3ο δευτερόλεπτο", body: "Από t = 2 s έως t = 3 s: Δp = ΣF·Δt = 1·1 = 1 kg·m/s." },
  ],
  answer: "α) Δp/Δt = 1 kg·m/s²  β) |Δp| = 1 kg·m/s.",
  remember: "Πλάγια δύναμη προς τα πάνω μικραίνει την N, άρα και την τριβή. «3ο δευτερόλεπτο» = από 2 s έως 3 s.",
});

/* 4.102 ───────── */
const v102 = pw([
  [0, 0],
  [5, 15],
  [20, 0],
]);
const e102 = ex({
  id: "4.102",
  source: SRC,
  title: "Η δύναμη σβήνει, η τριβή μένει",
  statement: "Ακίνητος κύβος 3 kg σε δάπεδο με μ δέχεται από τη στιγμή 0 οριζόντια σταθερή δύναμη F. Στα 5 s η F καταργείται και ο κύβος σταματά στα 20 s. Αμέσως μετά τα 5 s, ο ρυθμός μεταβολής της ορμής έχει μέτρο 3 kg·m/s². Βρες: α) το μ, β) την ορμή στα 5 s, γ) την F (g = 10 m/s²).",
  given: "m = 3 kg, t_1 = 5 s (σβήνει η F), t_2 = 20 s (σταματά), |Δp/Δt| = 3 μετά τα 5 s",
  ask: "α) μ  β) p(5 s)  γ) F",
  legend: ["v", "F"],
  phases: [
    { until: 4, label: "Με την F", say: "Από 0 έως 5 s δρουν η F και η τριβή. Ο κύβος επιταχύνεται." },
    { until: 8, label: "Μόνο τριβή", say: "Μετά τα 5 s μένει μόνο η τριβή: |Δp/Δt| = T = 3 N. Άρα μ·m·g = 3, μ = 0,1. Σε 15 s η τριβή μηδενίζει την ορμή: p(5) = 3·15 = 45 kg·m/s." },
    { until: 10, label: "Πίσω στην F", say: "Στα πρώτα 5 s: (F − 3)·5 = 45, άρα F − 3 = 9 και F = 12 N." },
  ],
  Scene: ({ t }) => {
    const s = t < 4 ? tau(t, 0, 4, 0, 5) : tau(t, 4, 8, 5, 20);
    const onF = s < 5;
    return (
      <g>
        <Track
          s={s}
          v={v102}
          x0={30}
          px={1.6}
          gy={64}
          rough
          vs={2.5}
          fs={3}
          forces={[...(onF ? [{ f: 12, label: "F" }] : []), ...(v102(s) > 0.05 ? [{ f: -3, label: "T", color: "#7a2c22" }] : [])]}
        />
        <Clock s={s} />
        <Graph x={60} y={96} w={220} h={74} tMax={20} yMin={0} yMax={50} fn={(q) => 3 * v102(q)} now={s} xTicks={[5, 20]} yTicks={[45]} yLabel="p (kg·m/s)" marks={s >= 5 ? [{ s: 5, label: "45" }] : []} />
      </g>
    );
  },
  steps: [
    { title: "α) Μετά τα 5 s", body: "Μόνη οριζόντια δύναμη η τριβή: |Δp/Δt| = T = μ·m·g  →  3 = μ·30  →  μ = 0,1." },
    { title: "β) Ορμή στα 5 s", body: "Από 5 s έως 20 s: Δp = −T·Δt = −3·15 = −45 kg·m/s. Τελική ορμή 0, άρα p(5 s) = 45 kg·m/s." },
    { title: "γ) Η δύναμη F", body: L("Από 0 έως 5 s: ΣF = F − T και Δp = 45 − 0.", "(F − 3)·5 = 45  →  F = 12 N.") },
  ],
  answer: "α) μ = 0,1  β) p = 45 kg·m/s  γ) F = 12 N.",
  remember: "Δp = ΣF·Δt σε κάθε κομμάτι της κίνησης χωριστά. Λύσε πρώτα το κομμάτι που ξέρεις περισσότερα.",
});

/* 4.103 ───────── */
const e103 = ex({
  id: "4.103",
  source: "Τριπολίτης σ. 169–170",
  title: "Ο χρόνος κρούσης από τα δευτερόλεπτα",
  statement: "Σώμα 0,4 kg κινείται σε λείο δάπεδο με 40 m/s και τη στιγμή 0 περνά από σημείο Α, 20 m από κατακόρυφο τοίχο. Χτυπά κάθετα στον τοίχο, γυρίζει με ταχύτητα κατά 75% μικρότερη και ξαναπερνά από το Α τη στιγμή 2,52 s. Βρες: α) τη μεταβολή της ορμής, β) τη μέση δύναμη από τον τοίχο.",
  given: "m = 0,4 kg, υ_1 = 40 m/s, d = 20 m, υ_2 = 25% του υ_1 = 10 m/s, t_A = 2,52 s",
  ask: "α) Δp  β) F",
  legend: ["v", "F", "p"],
  phases: [
    { until: 2.5, label: "Πηγαίνει", say: "Μέχρι τον τοίχο: t = 20/40 = 0,5 s." },
    { until: 3.7, label: "Κρούση", say: "Μειωμένη κατά 75% σημαίνει ότι μένει το 25%: υ_2 = 10 m/s." },
    { until: 7, label: "Γυρίζει", say: "Επιστροφή: 20/10 = 2 s. Σύνολο 0,5 + Δt_κ + 2 = 2,52, άρα Δt_κ = 0,02 s. Δp = 0,4·(−10 − 40) = −20, F = 20/0,02 = 1000 N." },
  ],
  Scene: ({ t }) => {
    const wx = 320;
    const A = 80;
    const k = (wx - 16 - A) / 20;
    const tc = 2.5;
    const contact = t >= tc && t < tc + 1.2;
    let x: number;
    let v: number;
    if (t < tc) {
      x = lerp(A, wx - 16, t / tc);
      v = 40;
    } else if (contact) {
      x = wx - 16;
      v = lerp(40, -10, (t - tc) / 1.2);
    } else {
      x = lerp(wx - 16, A, Math.min(1, (t - tc - 1.2) / 3.3));
      v = -10;
    }
    const f = bump(t, tc, tc + 1.2);
    return (
      <g>
        <Ground y={90} />
        <Wall x={wx} y1={36} y2={90} />
        <line x1={A} y1={86} x2={A} y2={96} stroke={C.ink} />
        <T x={A} y={108} s="Α" size={11} />
        <Ruler x1={A} x2={A + 20 * k} y={120} s="d = 20 m" />
        <Box cx={x} y={90} w={30} h={24} />
        <Vec x={v > 0 ? x + 15 : x - 15} y={56} dx={v * 1.6} label={v > 0 ? "40 m/s" : "10 m/s"} />
        <Vec x={x + 15} y={78} dx={-f * 46} color={C.F} label="F" width={3} labelSide="above" />
        <Tag x={14} y={22} s="κρούση · αργή κίνηση" color={C.F} show={contact} />
        <Lines
          y={150}
          size={10.5}
          lines={[
            { s: "πηγαίνει: 20/40 = 0,5 s   γυρίζει: 20/10 = 2 s", color: C.v },
            { s: t > 3.7 ? "Δt_κ = 2,52 − 0,5 − 2 = 0,02 s" : "" },
            { s: t > 3.7 ? "Δp = 0,4·(−10 − 40) = −20 kg·m/s   F = 20/0,02 = 1000 N" : "", color: C.F },
          ]}
        />
      </g>
    );
  },
  steps: [
    { title: "Ταχύτητα επιστροφής", body: "Μειωμένη κατά 75% → μένει 25%: υ_2 = 0,25·40 = 10 m/s." },
    { title: "α) Μεταβολή ορμής", body: "Θετικά προς τον τοίχο: Δp = m·(−υ_2 − υ_1) = 0,4·(−10 − 40) = −20 kg·m/s (μέτρο 20, προς τα έξω από τον τοίχο)." },
    { title: "Χρόνοι", body: "Πηγαίνει: 20/40 = 0,5 s. Γυρίζει: 20/10 = 2 s. Άρα Δt_κ = 2,52 − 0,5 − 2 = 0,02 s." },
    { title: "β) Δύναμη", body: "F = |Δp|/Δt_κ = 20/0,02 = 1000 N." },
  ],
  answer: "α) Δp = −20 kg·m/s (μέτρο 20 kg·m/s)  β) F = 1000 N.",
  remember: "«Μειωμένη κατά 75%» ≠ «το 75%». Μένει το 25%.",
});

/* 4.104 ───────── */
const e104 = ex({
  id: "4.104",
  source: SRC,
  title: "Πτώση, αναπήδηση και χρόνος κρούσης",
  statement: "Σφαίρα 0,2 kg αφήνεται από ύψος h_1. Λίγο πριν το έδαφος έχει ορμή 4 kg·m/s. Μετά την κρούση ανεβαίνει μέχρι 0,8 m. Η μέση δύναμη από το έδαφος είναι 26 N. Βρες: α) το h_1, β) τη μεταβολή της ορμής, γ) τη διάρκεια της κρούσης (g = 10 m/s², χωρίς αέρα).",
  given: "m = 0,2 kg, p_1 = 4 kg·m/s (κάτω), h_2 = 0,8 m, N = 26 N, g = 10 m/s²",
  ask: "α) h_1  β) Δp  γ) Δt",
  legend: ["v", "F"],
  phases: [
    { until: 3, label: "Πέφτει", say: "υ_1 = p_1/m = 4/0,2 = 20 m/s. Ελεύθερη πτώση: υ_1² = 2·g·h_1, άρα h_1 = 400/20 = 20 m." },
    { until: 4.4, label: "Κρούση", say: "Στην κρούση δρουν το βάρος (2 N, κάτω) και η N = 26 N (πάνω). ΣF = 24 N προς τα πάνω." },
    { until: 8, label: "Ανεβαίνει", say: "Για ύψος 0,8 m: υ_2² = 2·10·0,8 = 16, υ_2 = 4 m/s. Δp = 0,2·(4 + 20) = 4,8 kg·m/s. Δt = 4,8/24 = 0,2 s." },
  ],
  Scene: ({ t }) => {
    const gy = 170;
    const r = 11;
    const tc = 3;
    const contact = t >= tc && t < tc + 1.4;
    const fall = seg(t, 0, tc);
    const up = seg(t, tc + 1.4, 8);
    const y = t < tc ? lerp(26, gy - r, fall * fall) : contact ? gy - r : gy - r - 30 * (1 - (1 - up) * (1 - up));
    const vel = t < tc ? -20 * fall : contact ? lerp(-20, 4, (t - tc) / 1.4) : 4 * (1 - up);
    const f = bump(t, tc, tc + 1.4);
    return (
      <g>
        <Ground y={gy} />
        <line x1={60} y1={26} x2={60} y2={gy} stroke={C.faint} strokeDasharray="3 3" />
        <T x={54} y={100} s="h_1" size={11} color={C.muted} anchor="end" />
        <line x1={150} y1={gy - 30 - r} x2={150} y2={gy} stroke={C.faint} strokeDasharray="3 3" />
        {t > tc ? <T x={156} y={gy - 18} s="h_2" size={11} color={C.muted} anchor="start" /> : null}
        <Ball cx={110} cy={y} r={r} squash={f * 0.3} axis="y" />
        <Vec x={128} y={y} dx={0} dy={-vel * 2.2} label="υ" />
        <Vec x={110} y={gy + 2} dx={0} dy={-f * 52} color={C.F} label="N" labelSide="left" width={3} />
        <Tag x={14} y={22} s="κρούση · αργή κίνηση" color={C.F} show={contact} />
        <Lines
          x={190}
          y={40}
          size={10.5}
          lines={[
            { s: "+ προς τα πάνω" },
            { s: "υ_1 = 4/0,2 = 20 m/s", color: C.v },
            { s: "h_1 = υ_1²/2g = 20 m" },
            { s: t > tc ? "υ_2 = √(2·g·h_2) = 4 m/s" : "", color: C.v },
            { s: t > tc + 1.4 ? "Δp = 0,2·(4 + 20) = 4,8" : "", color: C.p },
            { s: t > tc + 1.4 ? "ΣF = 26 − 2 = 24 N" : "", color: C.F },
            { s: t > tc + 1.4 ? "Δt = 4,8/24 = 0,2 s" : "" },
          ]}
        />
      </g>
    );
  },
  steps: [
    { title: "α) Ύψος h_1", body: "υ_1 = p_1/m = 20 m/s. Ελεύθερη πτώση (ή ΑΔΜΕ): h_1 = υ_1²/(2g) = 400/20 = 20 m." },
    { title: "Ταχύτητα μετά", body: "Ανεβαίνει 0,8 m: υ_2 = √(2·g·h_2) = √16 = 4 m/s (προς τα πάνω)." },
    { title: "β) Μεταβολή ορμής", body: "Θετικά πάνω: Δp = m·(υ_2 − (−υ_1)) = 0,2·(4 + 20) = 4,8 kg·m/s, προς τα πάνω." },
    { title: "γ) Διάρκεια", body: "ΣF = N − m·g = 26 − 2 = 24 N. Δt = Δp/ΣF = 4,8/24 = 0,2 s." },
  ],
  answer: "α) h_1 = 20 m  β) Δp = 4,8 kg·m/s (πάνω)  γ) Δt = 0,2 s.",
  remember: "Στο Δp/Δt μπαίνει η ΣΥΝΙΣΤΑΜΕΝΗ: δύναμη εδάφους μείον βάρος.",
});

/* 4.105 ───────── */
const cases105 = [
  { k: "α", ang: 0, v2: 1, dp: 9, F: 45, say: "Ίδια κατεύθυνση, υ_2 = 1: Δp = 3·(1 − 4) = −9 kg·m/s, F = 9/0,2 = 45 N." },
  { k: "β", ang: 180, v2: 4, dp: 24, F: 120, say: "Αντίθετη ταχύτητα (ίδιο μέτρο 4): Δp = 3·(−4 − 4) = −24, F = 120 N." },
  { k: "γ", ang: 90, v2: 3, dp: 15, F: 75, say: "Κάθετες: Δp έχει πλευρές 3·4 = 12 και 3·3 = 9. Πυθαγόρειο: |Δp| = 15, F = 75 N." },
  { k: "δ", ang: 60, v2: 4, dp: 12, F: 60, say: "60° και ίσα μέτρα: ισόπλευρο τρίγωνο, |Δυ| = 4 m/s. |Δp| = 12, F = 60 N." },
];
const e105 = ex({
  id: "4.105",
  source: SRC,
  title: "Μεταβολή ορμής σε τέσσερις κατευθύνσεις",
  statement: "Σώμα 3 kg έχει ταχύτητα υ_1 = 4 m/s και, μέσα σε 0,2 s, αποκτά ταχύτητα υ_2. Βρες τη μέση συνισταμένη δύναμη όταν: α) η υ_2 έχει ίδια κατεύθυνση με την υ_1 και μέτρο 1 m/s, β) η υ_2 είναι αντίθετη της υ_1, γ) η υ_2 είναι κάθετη στην υ_1 με μέτρο 3 m/s, δ) η υ_2 σχηματίζει 60° με την υ_1 και έχει το ίδιο μέτρο.",
  given: "m = 3 kg, υ_1 = 4 m/s, Δt = 0,2 s",
  ask: "Τη μέση ΣF σε κάθε περίπτωση.",
  legend: ["p"],
  phases: cases105.map((c, i) => ({ until: 3 * (i + 1), label: `${c.k})`, say: c.say })),
  Scene: ({ t }) => {
    const i = Math.min(3, Math.floor(t / 3));
    const c = cases105[i];
    const k = seg(t, 3 * i, 3 * i + 1.6);
    const S = 7;
    const O = { x: 110, y: 120 };
    const p1 = { x: 3 * 4 * S, y: 0 };
    const a = (c.ang * Math.PI) / 180;
    const p2 = { x: 3 * c.v2 * S * Math.cos(a), y: -3 * c.v2 * S * Math.sin(a) };
    return (
      <g>
        <Tag x={14} y={22} s={`${c.k}) γωνία ${c.ang}°`} color={C.ink} />
        <circle cx={O.x} cy={O.y} r={2.5} fill={C.ink} />
        <Vec x={O.x} y={O.y + (c.ang === 180 || c.ang === 0 ? 6 : 0)} dx={p1.x} dy={p1.y} color={C.p} label="p_1" labelSide="below" />
        <Vec x={O.x} y={O.y - (c.ang === 180 || c.ang === 0 ? 6 : 0)} dx={p2.x * k} dy={p2.y * k} color="#127a3f" label="p_2" labelSide={c.ang > 0 && c.ang < 180 ? "left" : "above"} />
        {k > 0.99 ? <Vec x={O.x + p1.x} y={O.y + (c.ang === 0 || c.ang === 180 ? 18 : 0)} dx={p2.x - p1.x} dy={p2.y} color={C.ink} label="Δp" width={3} labelSide="right" /> : null}
        <Lines
          x={220}
          y={60}
          size={10.5}
          lines={[
            { s: "p_1 = 3·4 = 12 kg·m/s", color: C.p },
            { s: `p_2 = 3·${c.v2} = ${3 * c.v2} kg·m/s`, color: "#127a3f" },
            { s: k > 0.99 ? `|Δp| = ${c.dp} kg·m/s` : "", color: C.ink },
            { s: k > 0.99 ? `F = ${c.dp}/0,2 = ${c.F} N` : "", color: C.F },
          ]}
        />
      </g>
    );
  },
  steps: [
    { title: "Ο κανόνας", body: "Δp = p_2 − p_1 (διανυσματικά), και F = |Δp|/Δt. p_1 = 12 kg·m/s." },
    { title: "α) Ίδια κατεύθυνση", body: "Δp = 3·1 − 12 = −9 kg·m/s, F = 9/0,2 = 45 N." },
    { title: "β) Αντίθετη", body: "Δp = −12 − 12 = −24 kg·m/s, F = 24/0,2 = 120 N." },
    { title: "γ) Κάθετες", body: "p_2 = 9 κάθετα στο p_1 = 12: |Δp| = √(12² + 9²) = √225 = 15 kg·m/s, F = 75 N." },
    { title: "δ) 60°, ίσα μέτρα", body: "p_1 = p_2 = 12 με γωνία 60°: το τρίγωνο είναι ισόπλευρο, άρα |Δp| = 12 kg·m/s, F = 60 N." },
  ],
  answer: "α) 45 N  β) 120 N  γ) 75 N  δ) 60 N.",
  remember: "Όταν οι ταχύτητες δεν είναι στην ίδια ευθεία, σχεδιάζεις τρίγωνο: Δp = p_2 − p_1, με Πυθαγόρειο ή ισόπλευρο.",
});

/* 4.106 ───────── */
const p106 = pw([
  [0, 20],
  [2, 20],
  [4, 40],
  [6, 40],
  [8, 0],
]);
const F106 = (q: number) => (q < 2 ? 4 : q < 4 ? 14 : q < 6 ? 4 : -16);
const e106 = ex({
  id: "4.106",
  source: "Τριπολίτης σ. 170–171",
  title: "Διάγραμμα p–t με τριβή",
  statement: "Σώμα 2 kg κινείται σε οριζόντιο δάπεδο (μ = 0,2) και δέχεται οριζόντια δύναμη F στη διεύθυνση της κίνησης. Η ορμή: σταθερή p_1 ως τα 2 s, ανεβαίνει γραμμικά σε 2p_1 στα 4 s, μένει ως τα 6 s, πέφτει γραμμικά στο 0 στα 8 s. Από 6 s έως 8 s η μεταβολή της ορμής έχει μέτρο 40 kg·m/s. Βρες: α) την ταχύτητα στο 1 s, β) τη ΣF στα 3 s, γ) το διάγραμμα F–t από 0 έως 8 s (g = 10 m/s²).",
  given: "m = 2 kg, μ = 0,2, |Δp| (6 → 8 s) = 40 kg·m/s, διάγραμμα p–t",
  ask: "α) υ(1 s)  β) ΣF(3 s)  γ) F–t",
  legend: ["p", "F"],
  phases: [
    { until: 3, label: "Τιμές", say: "Από 6 s έως 8 s η ορμή πάει από 2p_1 στο 0: 2p_1 = 40, άρα p_1 = 20 kg·m/s. Στο 1 s: υ = 20/2 = 10 m/s." },
    { until: 7, label: "Κλίσεις = ΣF", say: "Κλίσεις: 0, (40 − 20)/2 = 10, 0, −40/2 = −20. Αυτές είναι οι ΣF σε κάθε διάστημα. Στα 3 s: ΣF = 10 N." },
    { until: 11, label: "Η δύναμη F", say: "Τριβή T = μ·m·g = 4 N. F = ΣF + T: 4, 14, 4 και −20 + 4 = −16 N (αντίθετα στην κίνηση)." },
  ],
  Scene: ({ t }) => {
    const s = t < 3 ? 8 : t < 7 ? tau(t, 3, 7, 0, 8) : 8;
    const s2 = t < 7 ? 0 : tau(t, 7, 11, 0, 8);
    return (
      <g>
        <Graph x={40} y={24} w={110} h={120} tMax={8} yMin={0} yMax={45} fn={p106} now={s} xTicks={[2, 4, 6, 8]} yTicks={[20, 40]} yLabel="p (kg·m/s)" />
        <Graph x={222} y={24} w={110} h={120} tMax={8} yMin={-18} yMax={16} fn={F106} now={s2} color={C.F} xTicks={[2, 4, 6, 8]} yTicks={[14, 4, -16]} yLabel="F (N)" />
        <Lines y={186} size={10.5} lines={[{ s: t < 3 ? "2p_1 = 40 → p_1 = 20 → υ(1) = 10 m/s" : t < 7 ? "ΣF = κλίση: 0, 10, 0, −20 N" : "T = 4 N → F = ΣF + T: 4, 14, 4, −16 N", color: C.ink }]} />
      </g>
    );
  },
  steps: [
    { title: "Βρίσκω το p_1", body: "Από 6 s σε 8 s: Δp = 0 − 2p_1, μέτρο 40, άρα p_1 = 20 kg·m/s." },
    { title: "α) Ταχύτητα στο 1 s", body: "p = p_1 = 20, υ = p/m = 10 m/s." },
    { title: "β) ΣF στα 3 s", body: "Κλίση από 2 s σε 4 s: ΣF = (40 − 20)/2 = 10 N." },
    { title: "γ) Τριβή", body: "T = μ·m·g = 0,2·2·10 = 4 N, πάντα αντίθετα στην κίνηση (το σώμα κινείται συνέχεια προς τα θετικά)." },
    {
      title: "γ) Η F σε κάθε διάστημα",
      body: L("ΣF = F − T, άρα F = ΣF + 4:", "0–2 s: F = 4 N   2–4 s: F = 14 N", "4–6 s: F = 4 N   6–8 s: F = −20 + 4 = −16 N"),
    },
  ],
  answer: "α) υ = 10 m/s  β) ΣF = 10 N  γ) F = 4 N, 14 N, 4 N, −16 N στα τέσσερα διαστήματα.",
  remember: "Κλίση p–t = ΣF, όχι F. Για να βρεις την F, πρόσθεσε πίσω την τριβή.",
});

export const ORMI_C: Exercise[] = [e101, e102, e103, e104, e105, e106];
