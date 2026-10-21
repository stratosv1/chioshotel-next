"use client";

import { Bars, Box, Bullet, C, Ground, Heat, T, Tag, Vec, num, seg, type Case } from "./kit";
import { CollisionScene } from "./collide";

/* ═════════════ ΕΝΟΤΗΤΑ 4 · Πλαστική κρούση ═════════════ */

const case16: Case = {
  n: 16,
  what: "Ένα γρήγορο αμαξάκι προλαβαίνει ένα πιο αργό και κολλάνε. Δείχνει πλαστική κρούση με σώματα που πάνε προς την ίδια φορά.",
  title: "Ίδια φορά κίνησης",
  period: 5.5,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2, label: "Πριν", say: "Το m₁ (2 kg, 6 m/s) προλαβαίνει το m₂ (4 kg, 3 m/s). Πάνε προς την ίδια φορά, άρα και οι δύο ορμές είναι θετικές." },
    { until: 2.7, label: "Κρούση", say: "Κολλάνε μεταξύ τους. Οι δυνάμεις της κρούσης είναι εσωτερικές, οπότε η ολική ορμή μένει 24 kg·m/s." },
    { until: 5.5, label: "Μετά", say: "Το συσσωμάτωμα (6 kg) κινείται με κοινή V = 24/6 = 4 m/s. Η V είναι ανάμεσα στις δύο αρχικές ταχύτητες." },
  ],
  Scene: ({ t }) => <CollisionScene t={t} c={{ m1: 2, m2: 4, u1: 6, u2: 3, v1: 4, v2: 4, stick: true, S: 10 }} />,
  solve: (
    <>
      m₁υ₁ + m₂υ₂ = (m₁ + m₂)V ⇒ 2·6 + 4·3 = 6V ⇒ <b>V = 4 m/s</b>.
    </>
  ),
  trap: "Δεν γράφεις ποτέ διατήρηση κινητικής ενέργειας σε πλαστική κρούση.",
};

const case17: Case = {
  n: 17,
  what: "Δύο αμαξάκια έρχονται το ένα προς το άλλο, κολλάνε και φεύγουν προς τη μεριά του βαρύτερου. Δείχνει πλαστική κρούση με αντίθετες φορές και τι σημαίνει το «−» στην απάντηση.",
  title: "Αντίθετη φορά κίνησης",
  period: 5.5,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2, label: "Πριν", say: "Πλησιάζουν από αντίθετες μεριές: m₁ = 2 kg με +10 m/s, m₂ = 8 kg με −5 m/s. Η ορμή του m₂ μπαίνει με «−»." },
    { until: 2.7, label: "Κρούση", say: "Ολική ορμή: 20 − 40 = −20 kg·m/s. Είναι αρνητική, άρα το συσσωμάτωμα θα πάει αριστερά." },
    { until: 5.5, label: "Μετά", say: "V = −20/10 = −2 m/s. Το «−» δεν είναι λάθος: σημαίνει ότι κινείται αντίθετα από τη θετική φορά." },
  ],
  Scene: ({ t }) => <CollisionScene t={t} c={{ m1: 2, m2: 8, u1: 10, u2: -5, v1: -2, v2: -2, stick: true, S: 7, widths: [30, 46] }} />,
  solve: (
    <>
      m₁υ₁ − m₂υ₂ = (m₁ + m₂)V ⇒ 2·10 − 8·5 = 10V ⇒ <b>V = −2 m/s</b> (προς τα αριστερά).
    </>
  ),
  trap: "Βάζεις το πρόσημο στην εξίσωση και αφήνεις τη V ως άγνωστο με «+». Το πρόσημο του αποτελέσματος σου λέει τη φορά.",
};

const case18: Case = {
  n: 18,
  what: "Δύο αμαξάκια με ίσες και αντίθετες ορμές συγκρούονται, κολλάνε και σταματούν επιτόπου. Δείχνει ότι μηδενική ολική ορμή σημαίνει ακινησία μετά.",
  title: "Το συσσωμάτωμα σταματά",
  period: 5.5,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2, label: "Πριν", say: "m₁ = 2 kg με 6 m/s και m₂ = 3 kg με −4 m/s. Οι ορμές είναι +12 και −12 kg·m/s: ίσες και αντίθετες." },
    { until: 2.7, label: "Κρούση", say: "Η ολική ορμή πριν είναι 0. Άρα και μετά πρέπει να είναι 0." },
    { until: 5.5, label: "Μετά", say: "Κολλημένα με ολική ορμή μηδέν ⇒ V = 0. Σταματούν στο σημείο της κρούσης. Όλη η κινητική έγινε θερμότητα!" },
  ],
  Scene: ({ t }) => <CollisionScene t={t} c={{ m1: 2, m2: 3, u1: 6, u2: -4, v1: 0, v2: 0, stick: true, S: 10, showK: true, barMax: 64 }} />,
  solve: (
    <>
      p_ολ = 2·6 − 3·4 = 0 ⇒ <b>V = 0</b>. Q = K_πριν = ½·2·36 + ½·3·16 = <b>60 J</b>.
    </>
  ),
  trap: "Σταματούν όταν οι ορμές (m·υ) είναι ίσες, όχι όταν οι ταχύτητες είναι ίσες.",
};

const case19: Case = {
  n: 19,
  what: "Ένα αμαξάκι κολλάει σε ένα όμοιο ακίνητο. Δείχνει ότι η ορμή μένει ίδια, αλλά η μισή κινητική ενέργεια γίνεται θερμότητα.",
  title: "Απώλεια ενέργειας",
  period: 6,
  legend: ["v", "p", "K"],
  phases: [
    { until: 2, label: "Πριν", say: "Ένα αμαξάκι 2 kg με 6 m/s πάει να κολλήσει σε όμοιο ακίνητο. Κινητική πριν: K = ½·2·36 = 36 J." },
    { until: 2.7, label: "Κρούση", say: "Η ορμή διατηρείται (12 kg·m/s), αλλά ένα μέρος της κινητικής γίνεται θερμότητα και παραμόρφωση." },
    { until: 6, label: "Μετά", say: "V = 12/4 = 3 m/s, K_μετά = ½·4·9 = 18 J. Χάθηκαν Q = 18 J, δηλαδή 50%. Η πορτοκαλί ράβδος έπεσε, η μαύρη όχι!" },
  ],
  Scene: ({ t }) => <CollisionScene t={t} c={{ m1: 2, m2: 2, u1: 6, u2: 0, v1: 3, v2: 3, stick: true, S: 10, showK: true, widths: [34, 34], barMax: 40 }} />,
  solve: (
    <>
      Q = K_πριν − K_μετά = 36 − 18 = <b>18 J</b>. Ποσοστό: Q/K_πριν·100% = <b>50%</b> (γενικά m₂/(m₁ + m₂) όταν το m₂ ήταν ακίνητο).
    </>
  ),
  trap: "Το ποσοστό απώλειας με ακίνητο στόχο δεν εξαρτάται από την ταχύτητα, μόνο από τις μάζες.",
};

/* 20. Κάθετες διευθύνσεις (κάτοψη): 2 kg·4 m/s → ανατολή, 3 kg·2 m/s → βορράς */
const case20: Case = {
  n: 20,
  what: "Από πάνω (κάτοψη) δύο σώματα κινούνται κάθετα το ένα στο άλλο, συναντιούνται, κολλάνε και φεύγουν λοξά. Δείχνει την ΑΔΟ χωριστά σε κάθε άξονα.",
  title: "Κάθετες διευθύνσεις",
  period: 7,
  legend: ["v", "p"],
  phases: [
    { until: 2.2, label: "Πριν", say: "Κάτοψη: το m₁ (2 kg) πάει δεξιά με 4 m/s, το m₂ (3 kg) πάει πάνω με 2 m/s. Θα συναντηθούν στο σημείο Σ." },
    { until: 2.8, label: "Κρούση", say: "Κολλάνε. Η ΑΔΟ γράφεται χωριστά σε κάθε άξονα: στον x μόνο η p₁ = 8, στον y μόνο η p₂ = 6 kg·m/s." },
    { until: 7, label: "Μετά", say: "Το συσσωμάτωμα πάει λοξά. Πυθαγόρειο: p = √(8² + 6²) = 10 kg·m/s ⇒ V = 10/5 = 2 m/s, με εφφ = 6/8." },
  ],
  Scene: ({ t }) => {
    const P = { x: 150, y: 118 };
    const S = 16;
    const tc = 2.2;
    const after = Math.min(2.4, Math.max(0, t - 2.8));
    const before = t < tc;
    const V = 2;
    const phi = Math.atan2(6, 8);
    const x1 = before ? P.x - S * 4 * (tc - t) : P.x;
    const y2 = before ? P.y + S * 2 * (tc - t) : P.y;
    const cx = P.x + S * V * Math.cos(phi) * after;
    const cy = P.y - S * V * Math.sin(phi) * after;
    return (
      <g>
        <rect x={6} y={8} width={348} height={196} rx={8} fill="#eef5ee" opacity={0.6} />
        <T x={14} y={22} s="κάτοψη (λείο οριζόντιο)" size={9.5} color={C.muted} anchor="start" bold={false} />
        <line x1={20} y1={P.y} x2={P.x} y2={P.y} stroke={C.faint} strokeDasharray="3 4" />
        <line x1={P.x} y1={200} x2={P.x} y2={P.y} stroke={C.faint} strokeDasharray="3 4" />
        <T x={P.x + 8} y={P.y + 16} s="Σ" size={10} color={C.muted} anchor="start" />
        {t < 2.8 ? (
          <g>
            <circle cx={x1 - 11} cy={P.y} r={11} fill={C.b1} stroke={C.edge} />
            <T x={x1 - 11} y={P.y + 4} s="m_1" size={9.5} italic />
            <circle cx={P.x} cy={y2 + 13} r={13} fill={C.b2} stroke={C.edge} />
            <T x={P.x} y={y2 + 17} s="m_2" size={9.5} italic />
            {before ? (
              <g>
                <Vec x={x1 - 22} y={P.y - 18} dx={4 * 8} label="υ_1" />
                <Vec x={P.x + 20} y={y2 + 20} dx={0} dy={-2 * 8} label="υ_2" />
              </g>
            ) : null}
          </g>
        ) : (
          <g>
            <circle cx={cx} cy={cy} r={15} fill="#cfd6a8" stroke={C.edge} />
            <T x={cx} y={cy + 4} s="m_1+m_2" size={8.5} italic />
            <Vec x={cx} y={cy} dx={2 * 16 * Math.cos(phi)} dy={-2 * 16 * Math.sin(phi)} label="V" labelSide="right" />
          </g>
        )}
        <g>
          <rect x={232} y={30} width={118} height={112} rx={8} fill="#ffffff" stroke="#d6dae1" />
          <T x={240} y={44} s="ορμές (kg·m/s)" size={9.5} color={C.muted} anchor="start" bold={false} />
          <Vec x={250} y={128} dx={64} color={C.p} label="p_1 = 8" labelSide="below" />
          <Vec x={314} y={128} dx={0} dy={-48} color={C.p} label="p_2 = 6" />
          {t > 2.2 ? <Vec x={250} y={128} dx={64} dy={-48} color={C.ink} label="p = 10" labelSide="left" width={3.2} /> : null}
          {t > 2.8 ? (
            <path d={`M 272 128 A 22 22 0 0 0 ${250 + 22 * Math.cos(phi)} ${128 - 22 * Math.sin(phi)}`} fill="none" stroke={C.muted} />
          ) : null}
        </g>
        <T x={290} y={160} s={t > 2.8 ? "V = 10/5 = 2 m/s" : ""} size={11} color={C.v} />
        <T x={290} y={176} s={t > 2.8 ? "εφφ = 6/8 ⇒ φ ≈ 37°" : ""} size={10.5} color={C.muted} />
      </g>
    );
  },
  solve: (
    <>
      x: 2·4 = 5·V_x ⇒ V_x = 1,6 · y: 3·2 = 5·V_y ⇒ V_y = 1,2 · <b>V = √(1,6² + 1,2²) = 2 m/s</b>, εφφ = 6/8 = 0,75.
    </>
  ),
  trap: "Μην προσθέσεις τις ορμές σαν αριθμούς (8 + 6 = 14). Είναι κάθετα διανύσματα: Πυθαγόρειο.",
};

/* ═════════════ ΕΝΟΤΗΤΑ 5 · Βλήμα και στόχος ═════════════ */

/* common bullet → block geometry */
function bulletScene(t: number, opts: { through?: boolean; V: number; vOut?: number; tc?: number; pxPerV?: number }) {
  const tc = opts.tc ?? 1.6;
  const bx0 = 190; // block left face at impact
  const bw = 54;
  const bulletSpeed = 120; // px/s on screen (the real 100 m/s is far faster)
  const after = Math.max(0, t - tc);
  const k = opts.pxPerV ?? 12;
  const blockCx = bx0 + bw / 2 + k * opts.V * after;
  let bulletX: number | null;
  if (t < tc) bulletX = bx0 - bulletSpeed * (tc - t);
  else if (opts.through) bulletX = bx0 + bw + k * opts.V * after + 6 + bulletSpeed * 0.5 * after;
  else bulletX = null;
  return { tc, bx0, bw, blockCx, bulletX, after };
}

const case21: Case = {
  n: 21,
  what: "Ένα βλήμα σφηνώνεται σε ξύλο που γλιστράει σε λείο δάπεδο. Δείχνει ότι το σφήνωμα είναι πλαστική κρούση.",
  title: "Σφηνώνεται σε ξύλο (λείο)",
  period: 6,
  legend: ["v", "p"],
  phases: [
    { until: 1.6, label: "Πριν", say: "Βλήμα 0,1 kg με 100 m/s πάει προς ακίνητο ξύλο 4,9 kg σε λείο δάπεδο. Ορμή συστήματος: 10 kg·m/s." },
    { until: 6, label: "Μετά", say: "Σφηνώθηκε: είναι πλαστική κρούση. Το σύνολο (5 kg) κινείται με V = 10/5 = 2 m/s. Πολύ μικρότερη ταχύτητα, ίδια ορμή." },
  ],
  Scene: ({ t }) => {
    const s = bulletScene(t, { V: 2 });
    const gy = 104;
    return (
      <g>
        <Ground y={gy} />
        <Box cx={s.blockCx} y={gy} w={s.bw} h={40} fill={C.wood} label="M" />
        {s.bulletX !== null ? <Bullet x={s.bulletX} y={gy - 20} /> : <Bullet x={s.blockCx - s.bw / 2 + 14} y={gy - 20} />}
        {t < s.tc ? <Vec x={Math.max(8, (s.bulletX ?? 0) - 54)} y={gy - 34} dx={44} label="υ" /> : <Vec x={s.blockCx + s.bw / 2 + 2} y={gy - 48} dx={2 * 9} label="V = 2 m/s" />}
        <Tag x={14} y={22} s="τα μήκη των βελών δεν είναι σε κλίμακα" color={C.muted} />
        <Bars
          y={138}
          max={11}
          items={[
            { label: "p_{βλ}", value: t < s.tc ? 10 : 0.2 },
            { label: "p_{ξύλ}", value: t < s.tc ? 0 : 9.8 },
            { label: "p_{ολ}", value: 10, color: C.ink },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      mυ = (M + m)V ⇒ 0,1·100 = 5·V ⇒ <b>V = 2 m/s</b>. Χάθηκε Q = 500 − 10 = 490 J (98%).
    </>
  ),
  trap: "Σφήνωμα = πλαστική κρούση, μία κοινή ταχύτητα για βλήμα και ξύλο.",
};

const case22: Case = {
  n: 22,
  what: "Το ξύλο με το σφηνωμένο βλήμα γλιστράει σε τραχύ δάπεδο και σταματά από την τριβή. Δείχνει πώς βρίσκουμε πόσο θα προχωρήσει: πρώτα ΑΔΟ, μετά ΘΜΚΕ.",
  title: "Μετά ολισθαίνει (τραχύ)",
  period: 6,
  legend: ["v", "F", "K"],
  phases: [
    { until: 1.6, label: "Κρούση", say: "Η κρούση κρατά ελάχιστα, γι' αυτό η τριβή δεν προλαβαίνει να επηρεάσει: ΑΔΟ ⇒ V = 2 m/s (όπως στο 21)." },
    { until: 4.6, label: "Ολίσθηση", say: "Τώρα η τριβή T = μ(M + m)g = 0,2·5·10 = 10 N φρενάρει το σύνολο. Η κινητική του (10 J) γίνεται θερμότητα." },
    { until: 6, label: "Σταμάτησε", say: "ΘΜΚΕ: 0 − ½(M + m)V² = −T·d ⇒ d = 10/10 = 1 m." },
  ],
  Scene: ({ t }) => {
    const gy = 104;
    const S = 120; // px per metre
    const k = seg(t, 1.6, 4.6); // physical time 0 → 1 s
    const tau = k; // s
    const V = Math.max(0, 2 - 2 * tau);
    const d = 2 * tau - tau * tau; // m
    const startX = 170;
    const x = t < 1.6 ? startX : startX + S * d;
    const bulletX = t < 1.6 ? startX - 27 - 80 * (1.6 - t) : null;
    const K = 0.5 * 5 * V * V;
    return (
      <g>
        <Ground y={gy} rough />
        <Box cx={x} y={gy} w={54} h={40} fill={C.wood} label="M + m" />
        {bulletX !== null ? <Bullet x={bulletX} y={gy - 20} /> : null}
        {t >= 1.6 && V > 0.05 ? (
          <g>
            <Vec x={x + 27} y={gy - 50} dx={V * 18} label="V" />
            <Vec x={x - 4} y={gy - 3} dx={-34} color={C.F} label="T" width={3.2} labelSide="above" />
          </g>
        ) : null}
        <line x1={startX} y1={gy + 14} x2={startX + S * d} y2={gy + 14} stroke={C.p} strokeWidth={1.5} />
        <T x={startX + (S * d) / 2} y={gy + 28} s={t > 1.6 ? `d = ${num(d, 2)} m` : ""} size={10.5} color={C.p} />
        <Heat cx={x} cy={gy - 46} k={t > 1.7 ? Math.min(1, k * 1.3) : 0} />
        <Bars y={160} max={11} items={[{ label: "K", value: t < 1.6 ? 0 : K, color: C.K, unit: "J" }, { label: "W_T", value: t < 1.6 ? 0 : -(10 - K), color: C.F, unit: "J" }]} />
      </g>
    );
  },
  solve: (
    <>
      ½(M + m)V² = μ(M + m)g·d ⇒ V² = 2μgd ⇒ 4 = 2·0,2·10·d ⇒ <b>d = 1 m</b>.
    </>
  ),
  trap: "Η μάζα απλοποιείται. Αλλά πρόσεξε: ΑΔΟ μόνο για τη στιγμή της κρούσης, ΘΜΚΕ για την ολίσθηση.",
};

const case23: Case = {
  n: 23,
  what: "Ένα βλήμα περνάει μέσα από ένα ξύλο και βγαίνει πιο αργό, ενώ το ξύλο αρχίζει να κινείται. Δείχνει κρούση όπου τα σώματα δεν κολλάνε.",
  title: "Βλήμα διαπερνά το ξύλο",
  period: 6,
  legend: ["v", "p"],
  phases: [
    { until: 1.6, label: "Πριν", say: "Βλήμα 0,1 kg με 200 m/s, ξύλο 2 kg ακίνητο σε λείο δάπεδο. Ορμή συστήματος 20 kg·m/s." },
    { until: 6, label: "Μετά", say: "Βγαίνει από την άλλη μεριά με 100 m/s. Η ορμή που «έχασε» (10 kg·m/s) την πήρε το ξύλο: V = 10/2 = 5 m/s." },
  ],
  Scene: ({ t }) => {
    const s = bulletScene(t, { through: true, V: 5, pxPerV: 4, tc: 1.6 });
    const gy = 104;
    return (
      <g>
        <Ground y={gy} />
        <Box cx={s.blockCx} y={gy} w={s.bw} h={40} fill={C.wood} label="M" />
        {s.bulletX !== null && s.bulletX < 360 ? <Bullet x={s.bulletX} y={gy - 20} /> : null}
        {t < s.tc ? (
          <Vec x={Math.max(8, (s.bulletX ?? 0) - 54)} y={gy - 34} dx={44} label="υ" />
        ) : (
          <g>
            <Vec x={s.blockCx - 20} y={gy - 50} dx={5 * 6} label="V = 5 m/s" />
            {s.bulletX !== null && s.bulletX < 330 ? <Vec x={s.bulletX + 4} y={gy - 34} dx={22} label="υ′ = 100" /> : null}
          </g>
        )}
        <Bars
          y={138}
          max={22}
          items={[
            { label: "p_{βλ}", value: t < s.tc ? 20 : 10 },
            { label: "p_{ξύλ}", value: t < s.tc ? 0 : 10 },
            { label: "p_{ολ}", value: 20, color: C.ink },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      mυ = mυ′ + MV ⇒ 0,1·200 = 0,1·100 + 2V ⇒ <b>V = 5 m/s</b>. Q = 2000 − 500 − 25 = <b>1475 J</b>.
    </>
  ),
  trap: "Δεν είναι πλαστική: βλήμα και ξύλο έχουν διαφορετικές ταχύτητες μετά.",
};

/* 24. Βαλλιστικό εκκρεμές: M = 3,9 kg, m = 0,1 kg, υ = 100 m/s, ℓ = 1 m */
const thetaMax = Math.acos(1 - 0.3125);
function pendulumAngle(t: number, tc: number) {
  if (t < tc) return 0;
  const tau = t - tc;
  const quarter = 1.3;
  return thetaMax * Math.sin((Math.PI / 2) * (tau / quarter));
}
const case24: Case = {
  n: 24,
  what: "Ένα βλήμα σφηνώνεται σε κύβο που κρέμεται από νήμα, και ο κύβος ανεβαίνει σαν κούνια. Δείχνει το βαλλιστικό εκκρεμές: πρώτα ΑΔΟ, μετά ΑΔΜΕ.",
  title: "Βαλλιστικό εκκρεμές",
  period: 7.2,
  legend: ["v", "p", "K"],
  phases: [
    { until: 1.6, label: "Πριν", say: "Βλήμα 0,1 kg με 100 m/s πάει να σφηνωθεί σε κύβο 3,9 kg που κρέμεται από νήμα 1 m." },
    { until: 2.9, label: "Κρούση → άνοδος", say: "Πρώτα ΑΔΟ: V = 10/4 = 2,5 m/s. Μετά το σύνολο ανεβαίνει σαν εκκρεμές: η κινητική του γίνεται δυναμική." },
    { until: 7.2, label: "Ύψος h", say: "ΑΔΜΕ: ½(M + m)V² = (M + m)gh ⇒ h = V²/2g = 6,25/20 ≈ 0,31 m. Δύο στάδια, δύο νόμοι!" },
  ],
  Scene: ({ t }) => {
    const tc = 1.6;
    const pivot = { x: 200, y: 12 };
    const L = 100;
    const th = pendulumAngle(t, tc);
    const bx = pivot.x + L * Math.sin(th);
    const by = pivot.y + L * Math.cos(th);
    const bulletX = t < tc ? pivot.x - 20 - 130 * (tc - t) : null;
    const h = L * (1 - Math.cos(th));
    return (
      <g>
        <line x1={pivot.x - 40} y1={pivot.y} x2={pivot.x + 40} y2={pivot.y} stroke={C.edge} strokeWidth={3} />
        <line x1={pivot.x} y1={pivot.y} x2={pivot.x} y2={pivot.y + L + 18} stroke={C.faint} strokeDasharray="3 4" />
        <line x1={pivot.x} y1={pivot.y} x2={bx} y2={by} stroke={C.edge} strokeWidth={1.6} />
        <g transform={`rotate(${(-th * 180) / Math.PI} ${bx} ${by})`}>
          <rect x={bx - 20} y={by} width={40} height={34} rx={3} fill={C.wood} stroke={C.edge} />
          <T x={bx} y={by + 21} s="M" size={11} italic />
        </g>
        {bulletX !== null ? (
          <g>
            <Bullet x={bulletX} y={pivot.y + L + 17} />
            <Vec x={bulletX - 50} y={pivot.y + L + 4} dx={40} label="υ" />
          </g>
        ) : null}
        {t >= tc && t < tc + 0.6 ? <Vec x={bx + 24} y={by + 17} dx={36} label="V = 2,5 m/s" /> : null}
        {h > 2 ? (
          <g>
            <line x1={300} y1={pivot.y + L} x2={300} y2={pivot.y + L - h} stroke={C.p} strokeWidth={2} />
            <line x1={bx} y1={by} x2={300} y2={by} stroke={C.p} strokeDasharray="2 3" />
            <T x={306} y={pivot.y + L - h / 2 + 4} s="h" size={12} color={C.p} anchor="start" italic />
          </g>
        ) : null}
        <T x={300} y={pivot.y + L + 52} s={t > 2.9 ? "h = 0,31 m" : ""} size={11} color={C.p} />
        <Bars
          y={176}
          max={14}
          title="ενέργεια του συστήματος (J), αμέσως μετά την κρούση"
          items={[
            { label: "K", value: t < tc ? 0 : 12.5 * (1 - h / (L * 0.3125)), color: C.K, unit: "J" },
            { label: "U", value: t < tc ? 0 : 12.5 * (h / (L * 0.3125)), color: C.p, unit: "J" },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      mυ = (M + m)V ⇒ V = 10/4 = <b>2,5 m/s</b>. h = V²/2g = <b>0,3125 m</b>. Χάθηκε στην κρούση 500 − 12,5 = 487,5 J (97,5%).
    </>
  ),
  trap: "Δεν γράφεις ΑΔΜΕ από το βλήμα ως το ύψος h: στην κρούση χάνεται ενέργεια. Πρώτα ΑΔΟ, μετά ΑΔΜΕ.",
};

const case25: Case = {
  n: 25,
  what: "Ο κύβος της κούνιας αμέσως μετά το χτύπημα, με τις δυνάμεις πάνω του. Δείχνει γιατί η τάση του νήματος μεγαλώνει (κεντρομόλος).",
  title: "Τάση νήματος μετά",
  period: 6,
  legend: ["v", "F"],
  phases: [
    { until: 1.6, label: "Πριν", say: "Ο κύβος (3,9 kg) κρέμεται ακίνητος: T = Mg = 39 N. Τάση και βάρος ισορροπούν." },
    { until: 6, label: "Αμέσως μετά", say: "Τώρα το σύνολο (4 kg) κάνει κυκλική κίνηση με V = 2,5 m/s. Χρειάζεται κεντρομόλος: T − (M + m)g = (M + m)V²/ℓ ⇒ T = 40 + 25 = 65 N." },
  ],
  Scene: ({ t }) => {
    const tc = 1.6;
    const pivot = { x: 150, y: 16 };
    const L = 110;
    const by = pivot.y + L;
    const after = t >= tc;
    const Tn = after ? 65 : 39;
    const W = after ? 40 : 39;
    const sc = 1.1;
    const bulletX = t < tc ? pivot.x - 20 - 110 * (tc - t) : null;
    return (
      <g>
        <line x1={pivot.x - 40} y1={pivot.y} x2={pivot.x + 40} y2={pivot.y} stroke={C.edge} strokeWidth={3} />
        <line x1={pivot.x} y1={pivot.y} x2={pivot.x} y2={by} stroke={C.edge} strokeWidth={1.6} />
        <rect x={pivot.x - 20} y={by} width={40} height={34} rx={3} fill={C.wood} stroke={C.edge} />
        {bulletX !== null ? <Bullet x={bulletX} y={by + 17} /> : null}
        <Vec x={pivot.x + 26} y={by + 6} dx={0} dy={-Tn * sc} color={C.F} label={`T = ${Tn} N`} width={3.4} />
        <Vec x={pivot.x - 26} y={by + 28} dx={0} dy={W * sc} color={C.F} label={after ? "(M+m)g = 40 N" : "Mg = 39 N"} labelSide="left" width={3.4} />
        {after ? <Vec x={pivot.x + 24} y={by + 50} dx={40} label="V" /> : null}
        {after ? (
          <g>
            <T x={296} y={40} s="ΣF_{κ} = T − (M+m)g" size={11} color={C.ink} />
            <T x={296} y={58} s="= 65 − 40 = 25 N" size={11} color={C.ink} />
            <T x={296} y={84} s="(M+m)V²/ℓ = 4·6,25/1" size={10.5} color={C.muted} />
            <T x={296} y={100} s="= 25 N ✓" size={10.5} color={C.p} />
          </g>
        ) : null}
        <Bars y={176} max={70} items={[{ label: "T", value: Tn, color: C.F, unit: "N" }, { label: "βάρος", value: W, color: C.F, unit: "N" }]} />
      </g>
    );
  },
  solve: (
    <>
      T = (M + m)g + (M + m)V²/ℓ = 40 + 4·2,5²/1 = <b>65 N</b>. Πριν την κρούση ήταν 39 N.
    </>
  ),
  trap: "«Αμέσως μετά» το σώμα είναι ακόμα στην κατώτατη θέση, αλλά ήδη κάνει κυκλική κίνηση: T > βάρος.",
};

export const section4: Case[] = [case16, case17, case18, case19, case20];
export const section5: Case[] = [case21, case22, case23, case24, case25];
