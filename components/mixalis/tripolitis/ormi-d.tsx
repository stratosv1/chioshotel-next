"use client";

import type { ReactNode } from "react";
import { Ball, Box, Bullet, Burst, C, Ground, StickPerson, T, Tag, Vec, Wall, bump, lerp, seg } from "@/components/mixalis/ormi/kit";
import { CollisionScene, type Collision } from "@/components/mixalis/ormi/collide";
import type { Exercise } from "./ExerciseCard";
import { Clock, L, Lines, Ruler, ex, num, tau } from "./tkit";

const SRC = "Τριπολίτης σ. 171–176";

const cPhases = (before: string, during: string, after: string) => [
  { until: 2.5, label: "Πριν", say: before },
  { until: 3.7, label: "Κρούση", say: during },
  { until: 7, label: "Μετά", say: after },
];
const coll = (c: Collision, extra?: (t: number) => ReactNode) =>
  function Scene({ t }: { t: number }) {
    return <CollisionScene c={{ tc: 2.5, dc: 1.2, ...c }} t={t} extra={extra ? extra(t) : undefined} />;
  };

type Line = { s: string; color?: string };

/**
 * Head-on collision followed by sliding with friction (both bodies decelerate by a).
 * Animation: approach 0–2.5, contact 2.5–3.5, sliding 3.5–8 (covers physical τ 0…τMax).
 */
function collideThenFriction(o: {
  t: number;
  u1: number;
  u2: number;
  v1: number;
  v2: number;
  a: number;
  px: number;
  stick?: boolean;
  labels?: [string, string];
  widths?: [number, number];
  X?: number;
  vs?: number;
  tauMax: number;
  lines: (tau: number) => Line[];
}) {
  const { t, a, px } = o;
  const X = o.X ?? 180;
  const [w1, w2] = o.widths ?? [32, 36];
  const vs = o.vs ?? 8;
  const gy = 96;
  const S = 12;
  const pos = (v: number, s: number) => {
    const stop = Math.abs(v) / a;
    const q = Math.min(s, stop);
    return Math.sign(v) * (Math.abs(v) * q - 0.5 * a * q * q);
  };
  const vel = (v: number, s: number) => Math.sign(v) * Math.max(0, Math.abs(v) - a * s);
  let x1: number;
  let x2: number;
  let s1: number;
  let s2: number;
  let s = 0;
  if (t < 2.5) {
    x1 = X - w1 / 2 - S * o.u1 * (2.5 - t);
    x2 = X + w2 / 2 - S * o.u2 * (2.5 - t);
    s1 = o.u1;
    s2 = o.u2;
  } else if (t < 3.5) {
    const k = t - 2.5;
    x1 = X - w1 / 2;
    x2 = X + w2 / 2;
    s1 = lerp(o.u1, o.v1, k);
    s2 = lerp(o.u2, o.v2, k);
  } else {
    s = tau(t, 3.5, 8, 0, o.tauMax);
    x1 = X - w1 / 2 + px * pos(o.v1, s);
    x2 = X + w2 / 2 + px * pos(o.v2, s);
    s1 = vel(o.v1, s);
    s2 = vel(o.v2, s);
  }
  const f = bump(t, 2.5, 3.5);
  const after = t >= 3.5;
  const [l1, l2] = o.labels ?? ["1", "2"];
  return (
    <g>
      <Ground y={gy} rough />
      <line x1={X} y1={gy - 2} x2={X} y2={gy + 8} stroke={C.ink} strokeWidth={1} />
      <Box cx={x1} y={gy} w={w1} h={26} label={l1} />
      <Box cx={x2} y={gy} w={w2} h={30} fill={C.b2} label={l2} />
      {o.stick && after ? (
        <Vec x={s1 >= 0 ? x2 + w2 / 2 : x1 - w1 / 2} y={gy - 44} dx={s1 * vs} label="V" />
      ) : (
        <g>
          <Vec x={s1 >= 0 ? x1 + w1 / 2 : x1 - w1 / 2} y={gy - 36} dx={s1 * vs} label="υ_1" />
          <Vec x={s2 >= 0 ? x2 + w2 / 2 : x2 - w2 / 2} y={gy - 50} dx={s2 * vs} label="υ_2" />
        </g>
      )}
      {f > 0.02 ? (
        <g>
          <Vec x={X} y={gy - 12} dx={f * 40} color={C.F} width={3} />
          <Vec x={X} y={gy - 12} dx={-f * 40} color={C.F} width={3} />
        </g>
      ) : null}
      {after && !o.stick && Math.abs(s1) > 0.01 ? <Vec x={x1 - Math.sign(s1) * (w1 / 2)} y={gy - 4} dx={-Math.sign(s1) * 18} color="#7a2c22" label="T_1" labelSide="above" /> : null}
      {after && Math.abs(s2) > 0.01 ? <Vec x={x2 - Math.sign(s2) * (w2 / 2)} y={gy - 4} dx={-Math.sign(s2) * 18} color="#7a2c22" label={o.stick ? "T" : "T_2"} labelSide="above" /> : null}
      <Tag x={14} y={22} s="κρούση · αργή κίνηση" color={C.F} show={t >= 2.5 && t < 3.5} />
      {after ? <Clock s={s} /> : null}
      <Lines y={140} size={10.5} lines={o.lines(after ? s : -1)} />
    </g>
  );
}

/* 4.107 ───────── */
const e107 = ex({
  id: "4.107",
  source: SRC,
  title: "Το πρώτο σταματά",
  statement: "Σώμα 1 kg με 10 m/s σε λείο δάπεδο χτυπά μετωπικά ακίνητο σώμα 2 kg, χωρίς συσσωμάτωμα. Το (1) ακινητοποιείται. Βρες: α) την ταχύτητα του (2), β) την απώλεια κινητικής ενέργειας.",
  given: "m_1 = 1 kg, υ_0 = 10 m/s, m_2 = 2 kg (ακίνητο), υ′_1 = 0",
  ask: "α) υ′_2  β) Q",
  legend: ["v", "F", "p", "K"],
  phases: cPhases(
    "Ορμή πριν: 1·10 = 10 kg·m/s. Κινητική: ½·1·100 = 50 J.",
    "Η ορμή περνά από το (1) στο (2).",
    "1·10 = 2·υ′_2, άρα υ′_2 = 5 m/s. K μετά = ½·2·25 = 25 J. Χάθηκαν 25 J.",
  ),
  Scene: coll({ m1: 1, m2: 2, u1: 10, u2: 0, v1: 0, v2: 5, widths: [26, 36], S: 6, vs: 5, showK: true, barMax: 55 }),
  steps: [
    { title: "α) ΑΔΟ", body: "m_1·υ_0 = m_2·υ′_2  →  10 = 2·υ′_2  →  υ′_2 = 5 m/s." },
    { title: "β) Κινητικές", body: "K_{πριν} = ½·1·10² = 50 J, K_{μετά} = ½·2·5² = 25 J." },
    { title: "β) Απώλεια", body: "Q = 50 − 25 = 25 J." },
  ],
  answer: "α) υ′_2 = 5 m/s  β) Q = 25 J.",
  remember: "Χωρίς συσσωμάτωμα δεν σημαίνει ελαστική. Ελέγχεις πάντα με τις κινητικές.",
});

/* 4.108 ───────── */
const e108 = ex({
  id: "4.108",
  source: SRC,
  title: "Αντίθετες ταχύτητες μετά",
  statement: "Μπίλια 2 kg με 12 m/s σε λείο δάπεδο χτυπά μετωπικά ακίνητη μπίλια 5 kg. Μετά την κρούση οι δύο έχουν αντίθετες ταχύτητες. Βρες: α) το μέτρο της ταχύτητας κάθε μπίλιας, β) το μέτρο της μεταβολής της ορμής της (1).",
  given: "m_1 = 2 kg, υ_1 = 12 m/s, m_2 = 5 kg (ακίνητη), υ′_1 = −υ′_2",
  ask: "α) |υ′_1| = |υ′_2|  β) |Δp_1|",
  legend: ["v", "F", "p"],
  phases: cPhases(
    "Ορμή πριν: 2·12 = 24 kg·m/s.",
    "«Αντίθετες ταχύτητες» = ίδιο μέτρο υ, αντίθετη φορά.",
    "2·(−υ) + 5·υ = 24, άρα 3υ = 24 και υ = 8 m/s. Δp_1 = 2·(−8 − 12) = −40 kg·m/s.",
  ),
  Scene: coll({ m1: 2, m2: 5, u1: 12, u2: 0, v1: -8, v2: 8, widths: [28, 40], S: 5, vs: 4, barMax: 42 }),
  steps: [
    { title: "ΑΔΟ", body: "Θετικά δεξιά. 2·12 = 2·(−υ) + 5·υ." },
    { title: "α) Λύνω", body: "24 = 3υ  →  υ = 8 m/s. Η (1) γυρίζει με 8 m/s, η (2) φεύγει με 8 m/s." },
    { title: "β) Μεταβολή ορμής της (1)", body: "Δp_1 = 2·(−8 − 12) = −40 kg·m/s, μέτρο 40 kg·m/s." },
  ],
  answer: "α) 8 m/s και οι δύο  β) |Δp_1| = 40 kg·m/s.",
  remember:
    "Για περιέργεια: K πριν = 144 J, K μετά = 64 + 160 = 224 J. Η κινητική θα αύξανε, πράγμα αδύνατο σε απλή κρούση. Τα νούμερα της άσκησης είναι «φτιαχτά». Η μέθοδος (ΑΔΟ) είναι αυτή που μετράει.",
});

/* 4.109 ───────── */
const e109 = ex({
  id: "4.109",
  source: "Τριπολίτης σ. 171–172",
  title: "Τριπλάσια ορμή",
  statement: "Σώμα m_1 με υ_0 σφηνώνεται σε ακίνητο σώμα 3 kg. Η ορμή του (1) πριν είναι τριπλάσια της ορμής του (2) αμέσως μετά. Το συσσωμάτωμα (μ = 0,1) κινείται 4 s ώσπου να σταματήσει. Βρες: α) την ταχύτητα του συσσωματώματος, β) τη μάζα m_1 (g = 10 m/s²).",
  given: "m_2 = 3 kg, p_1 = 3·p′_2, μ = 0,1, σταματά σε 4 s, g = 10 m/s²",
  ask: "α) V  β) m_1",
  legend: ["v", "F"],
  phases: [
    { until: 2.5, label: "Πριν", say: "Το (1) έρχεται. Δεν ξέρουμε ούτε μάζα ούτε ταχύτητα: ξεκινάμε από το τέλος." },
    { until: 3.5, label: "Κρούση", say: "Πλαστική: μετά κινούνται μαζί με V." },
    { until: 8, label: "Τριβή, 4 s", say: "Επιβράδυνση α = μ·g = 1 m/s², σταματά σε 4 s: V = 4 m/s. p′_2 = 3·4 = 12, άρα p_1 = 36 = (m_1 + 3)·4, m_1 = 6 kg." },
  ],
  Scene: ({ t }) =>
    collideThenFriction({
      t,
      u1: 6,
      u2: 0,
      v1: 4,
      v2: 4,
      a: 1,
      px: 14,
      stick: true,
      X: 110,
      widths: [36, 30],
      tauMax: 4,
      lines: (s) => [
        { s: s >= 0 ? `α = μ·g = 1 m/s²   V = α·t = 4 m/s` : "", color: C.v },
        { s: s >= 0 ? "p′_2 = 3·4 = 12   p_1 = 3·12 = 36 kg·m/s" : "", color: C.p },
        { s: s >= 0 ? "36 = (m_1 + 3)·4  →  m_1 = 6 kg" : "" },
      ],
    }),
  steps: [
    { title: "α) Μετά την κρούση", body: "Μόνη οριζόντια δύναμη η τριβή: α = μ·g = 1 m/s². Σταματά σε 4 s: 0 = V − α·t, άρα V = 4 m/s." },
    { title: "Ορμή του (2) μετά", body: "p′_2 = m_2·V = 3·4 = 12 kg·m/s, άρα p_1 = 3·12 = 36 kg·m/s." },
    { title: "β) ΑΔΟ", body: "p_1 = (m_1 + m_2)·V  →  36 = (m_1 + 3)·4  →  m_1 = 6 kg." },
  ],
  answer: "α) V = 4 m/s  β) m_1 = 6 kg (και υ_0 = 6 m/s).",
  remember: "Η «ορμή του (2) μετά» είναι m_2·V, όχι η ορμή όλου του συσσωματώματος.",
});

/* 4.110 ───────── */
const e110 = ex({
  id: "4.110",
  source: "Τριπολίτης σ. 172",
  title: "Ποιος γυρίζει πίσω;",
  statement: "Σώμα 2 kg χτυπά μετωπικά ακίνητο σώμα 4 kg σε λείο δάπεδο, χωρίς συσσωμάτωμα. Η ορμή του συστήματος μετά είναι 10 kg·m/s και το (2) φεύγει με 3 m/s. Βρες: α) την ταχύτητα του (1) πριν, β) την ορμή και την ταχύτητα του (1) μετά.",
  given: "m_1 = 2 kg, m_2 = 4 kg (ακίνητο), p_{ολ} = 10 kg·m/s, υ′_2 = 3 m/s",
  ask: "α) υ_1  β) p′_1 και υ′_1",
  legend: ["v", "F", "p"],
  phases: cPhases(
    "Η ορμή του συστήματος είναι 10 και πριν (ΑΔΟ). Πριν είναι μόνο του (1): 2·υ_1 = 10, υ_1 = 5 m/s.",
    "Το (2) παίρνει 4·3 = 12 kg·m/s, περισσότερο από το 10!",
    "Άρα p′_1 = 10 − 12 = −2 kg·m/s, υ′_1 = −1 m/s: το (1) γυρίζει πίσω με 1 m/s.",
  ),
  Scene: coll({ m1: 2, m2: 4, u1: 5, u2: 0, v1: -1, v2: 3, widths: [28, 40], S: 10, vs: 8 }),
  steps: [
    { title: "α) ΑΔΟ", body: "p_{πριν} = p_{μετά} = 10. Πριν: m_1·υ_1 = 10, άρα υ_1 = 5 m/s." },
    { title: "β) Ορμή του (1) μετά", body: "p′_1 = 10 − m_2·υ′_2 = 10 − 12 = −2 kg·m/s." },
    { title: "β) Ταχύτητα", body: "υ′_1 = p′_1/m_1 = −1 m/s, αντίθετα από την αρχική κίνηση." },
  ],
  answer: "α) υ_1 = 5 m/s  β) p′_1 = −2 kg·m/s, υ′_1 = 1 m/s προς τα πίσω.",
});

/* 4.111 ───────── */
const e111 = ex({
  id: "4.111",
  source: "Τριπολίτης σ. 172",
  title: "Πλαστική κρούση, ίδια φορά",
  statement: "Σώματα 1 kg (8 m/s) και 3 kg (4 m/s) κινούνται με την ίδια φορά σε λείο δρόμο και συγκρούονται πλαστικά. Βρες: α) την ταχύτητα του συσσωματώματος, β) τη μεταβολή της ορμής κάθε σώματος, γ) την απώλεια κινητικής ενέργειας.",
  given: "m_1 = 1 kg, υ_1 = 8 m/s, m_2 = 3 kg, υ_2 = 4 m/s, ίδια φορά",
  ask: "α) V  β) Δp_1, Δp_2  γ) Q",
  legend: ["v", "F", "p", "K"],
  phases: cPhases(
    "Ορμή πριν: 1·8 + 3·4 = 20 kg·m/s.",
    "Η ορμή που χάνει το (1) την παίρνει το (2): Δp_1 = −Δp_2.",
    "V = 20/4 = 5 m/s. Δp_1 = 1·(5 − 8) = −3, Δp_2 = 3·(5 − 4) = +3. K: 56 J → 50 J, Q = 6 J.",
  ),
  Scene: coll({ m1: 1, m2: 3, u1: 8, u2: 4, v1: 5, v2: 5, stick: true, widths: [26, 40], S: 8, vs: 4, showK: true, barMax: 60 }),
  steps: [
    { title: "α) ΑΔΟ", body: "1·8 + 3·4 = 4·V  →  V = 5 m/s." },
    { title: "β) Μεταβολές ορμής", body: "Δp_1 = 1·(5 − 8) = −3 kg·m/s, Δp_2 = 3·(5 − 4) = +3 kg·m/s. Αντίθετες, όπως λέει η ΑΔΟ." },
    { title: "γ) Απώλεια", body: "K_{πριν} = ½·1·64 + ½·3·16 = 32 + 24 = 56 J. K_{μετά} = ½·4·25 = 50 J. Q = 6 J." },
  ],
  answer: "α) V = 5 m/s  β) Δp_1 = −3 kg·m/s, Δp_2 = +3 kg·m/s  γ) Q = 6 J.",
  remember: "Σε κάθε κρούση Δp_1 = −Δp_2.",
});

/* 4.112 ───────── */
const e112 = ex({
  id: "4.112",
  source: "Τριπολίτης σ. 172",
  title: "Από την απώλεια ενέργειας στην ταχύτητα",
  statement: "Σώμα 6 kg χτυπά τη στιγμή 0 πλαστικά ακίνητο σώμα 4 kg. Η απώλεια κινητικής ενέργειας είναι 30 J. Το συσσωμάτωμα έχει μ = 0,25 με το δάπεδο. Βρες: α) την ταχύτητα του 6 kg πριν, β) τον ρυθμό μεταβολής της ορμής του συσσωματώματος, γ) πότε σταματά (g = 10 m/s²).",
  given: "m_1 = 6 kg, m_2 = 4 kg (ακίνητο), Q = 30 J, μ = 0,25, g = 10 m/s²",
  ask: "α) υ_1  β) |Δp/Δt|  γ) t_1",
  legend: ["v", "F"],
  phases: [
    { until: 2.5, label: "Πριν", say: "Άγνωστη υ_1. Δύο εξισώσεις: ΑΔΟ και απώλεια ενέργειας." },
    { until: 3.5, label: "Κρούση", say: "ΑΔΟ: 6·υ_1 = 10·V, άρα V = 0,6·υ_1. Απώλεια: ½·6·υ_1² − ½·10·V² = 30, δηλαδή 1,2·υ_1² = 30, υ_1 = 5 m/s, V = 3 m/s." },
    { until: 8, label: "Τριβή", say: "T = μ·10·10 = 25 N: Δp/Δt = −25 kg·m/s². Από 30 kg·m/s στο 0: t_1 = 30/25 = 1,2 s." },
  ],
  Scene: ({ t }) =>
    collideThenFriction({
      t,
      u1: 5,
      u2: 0,
      v1: 3,
      v2: 3,
      a: 2.5,
      px: 40,
      stick: true,
      X: 120,
      widths: [38, 30],
      tauMax: 1.2,
      lines: (s) => [
        { s: "6·υ_1 = 10·V,  ½·6·υ_1² − ½·10·V² = 30", color: C.p },
        { s: s >= 0 ? "υ_1 = 5 m/s, V = 3 m/s, p = 30 kg·m/s" : "", color: C.v },
        { s: s >= 0 ? `Δp/Δt = −T = −25 N   p = ${num(Math.max(0, 30 - 25 * s), 1)} kg·m/s` : "", color: C.F },
      ],
    }),
  steps: [
    { title: "ΑΔΟ", body: "m_1·υ_1 = (m_1 + m_2)·V  →  V = 0,6·υ_1." },
    { title: "α) Απώλεια ενέργειας", body: L("½·6·υ_1² − ½·10·(0,6υ_1)² = 30", "3υ_1² − 1,8υ_1² = 30  →  1,2υ_1² = 30  →  υ_1 = 5 m/s (και V = 3 m/s).") },
    { title: "β) Ρυθμός μεταβολής ορμής", body: "Μόνη οριζόντια δύναμη η τριβή: |Δp/Δt| = μ·(m_1 + m_2)·g = 0,25·100 = 25 kg·m/s²." },
    { title: "γ) Πότε σταματά", body: "Η ορμή πέφτει από 10·3 = 30 στο 0 με ρυθμό 25: t_1 = 30/25 = 1,2 s." },
  ],
  answer: "α) υ_1 = 5 m/s  β) 25 kg·m/s²  γ) t_1 = 1,2 s.",
  remember: "Δύο άγνωστοι (υ_1, V) θέλουν δύο εξισώσεις: ΑΔΟ + ενέργεια.",
});

/* 4.113 ───────── */
const e113 = ex({
  id: "4.113",
  source: "Τριπολίτης σ. 172–173",
  title: "Αντίθετες ταχύτητες, πλαστική κρούση",
  statement: "Σώματα 4 kg και 6 kg πλησιάζουν με αντίθετες ταχύτητες και συγκρούονται πλαστικά. Το συσσωμάτωμα (μ = 0,1) σταματά αφού διανύσει 0,5 m. Βρες: α) την ορμή του συσσωματώματος μετά, β) το μέτρο της ταχύτητας των σωμάτων πριν (g = 10 m/s²).",
  given: "m_1 = 4 kg, m_2 = 6 kg, υ_1 = −υ_2 (ίσα μέτρα υ), μ = 0,1, s = 0,5 m",
  ask: "α) p_{συσ}  β) υ",
  legend: ["v", "F"],
  phases: [
    { until: 2.5, label: "Πριν", say: "Ίσα μέτρα, αντίθετες φορές. Το βαρύτερο (2) «κερδίζει»: το συσσωμάτωμα θα πάει προς τη μεριά που κινούνταν το (2)." },
    { until: 3.5, label: "Κρούση", say: "Πλαστική: μία κοινή ταχύτητα V." },
    { until: 8, label: "0,5 m", say: "α = μ·g = 1 m/s². V² = 2·1·0,5 = 1, V = 1 m/s, p = 10 kg·m/s. ΑΔΟ: 6υ − 4υ = 10, υ = 5 m/s." },
  ],
  Scene: ({ t }) =>
    collideThenFriction({
      t,
      u1: 5,
      u2: -5,
      v1: -1,
      v2: -1,
      a: 1,
      px: 70,
      stick: true,
      X: 200,
      widths: [30, 38],
      vs: 6,
      tauMax: 1,
      lines: (s) => [
        { s: s >= 0 ? "α = μ·g = 1 m/s²,  V² = 2·α·s = 1  →  V = 1 m/s" : "", color: C.v },
        { s: s >= 0 ? "p = 10·1 = 10 kg·m/s (φορά του (2))" : "", color: C.p },
        { s: s >= 0 ? "6υ − 4υ = 10  →  υ = 5 m/s" : "" },
      ],
    }),
  steps: [
    { title: "Μετά την κρούση", body: "Η τριβή φρενάρει: α = μ·g = 1 m/s². 0 = V² − 2·α·s  →  V² = 1  →  V = 1 m/s." },
    { title: "α) Ορμή", body: "p = (m_1 + m_2)·V = 10 kg·m/s, με τη φορά του (2) (το βαρύτερο)." },
    { title: "β) ΑΔΟ", body: "Θετική η φορά του (2): 6υ − 4υ = 10  →  2υ = 10  →  υ = 5 m/s." },
  ],
  answer: "α) p = 10 kg·m/s  β) υ = 5 m/s.",
  remember: "«Αντίθετες ταχύτητες» = ίσα μέτρα, αντίθετες φορές.",
});

/* 4.114 ───────── */
const e114 = ex({
  id: "4.114",
  source: "Τριπολίτης σ. 173",
  title: "Βλήμα σε κεκλιμένο επίπεδο",
  statement: "Βλήμα 0,4 kg κινείται παράλληλα σε κεκλιμένο επίπεδο (ημφ = 0,6, συνφ = 0,8) με κινητική ενέργεια 12500 J και σφηνώνεται σε ακίνητο σώμα 4,6 kg. Το συσσωμάτωμα έχει μ = 0,5. Βρες: α) την ταχύτητα του βλήματος, β) την ορμή του συσσωματώματος μετά, γ) το μέγιστο ύψος που ανεβαίνει από το σημείο κρούσης (g = 10 m/s²).",
  given: "m_β = 0,4 kg, K_β = 12500 J, M = 4,6 kg, ημφ = 0,6, συνφ = 0,8, μ = 0,5",
  ask: "α) υ_0  β) p  γ) h_{max}",
  legend: ["v", "F"],
  phases: [
    { until: 2.5, label: "Το βλήμα", say: "Από την κινητική: ½·0,4·υ_0² = 12500, υ_0² = 62500, υ_0 = 250 m/s." },
    { until: 3.5, label: "Κρούση", say: "ΑΔΟ κατά μήκος του επιπέδου: p = 0,4·250 = 100 kg·m/s = 5·V, V = 20 m/s." },
    { until: 8, label: "Ανεβαίνει", say: "Φρενάρουν η συνιστώσα του βάρους (m·g·ημφ) και η τριβή (μ·m·g·συνφ): α = 10·(0,6 + 0,4) = 10 m/s². s = 400/20 = 20 m, h = s·ημφ = 12 m." },
  ],
  Scene: ({ t }) => {
    const ang = Math.atan2(0.6, 0.8);
    const deg = (ang * 180) / Math.PI;
    const O = { x: 30, y: 180 };
    const k = 6;
    const A = 4;
    const s = tau(t, 3.5, 8, 0, 2);
    const up = t < 3.5 ? 0 : 20 * s - 5 * s * s;
    const V = t < 3.5 ? 0 : Math.max(0, 20 - 10 * s);
    const bx = t < 2.5 ? lerp(0.5, A - 0.6, seg(t, 0, 2.5)) : A;
    const blockS = A + up;
    return (
      <g>
        <line x1={O.x} y1={O.y} x2={O.x + 330} y2={O.y} stroke={C.ground} strokeWidth={2} />
        <g transform={`translate(${O.x} ${O.y}) rotate(${-deg})`}>
          <line x1={0} y1={0} x2={50 * k} y2={0} stroke={C.ground} strokeWidth={2.4} />
          <rect x={blockS * k} y={-20} width={26} height={20} fill={C.b1} stroke={C.edge} strokeWidth={1.3} rx={2} />
          {t < 2.5 ? (
            <g>
              <Bullet x={bx * k} y={-10} />
              <Vec x={bx * k + 4} y={-30} dx={50} label="υ_0" />
            </g>
          ) : (
            <g>
              <Vec x={blockS * k + 26} y={-30} dx={V * 3} label="V" />
              {V > 0.05 ? <Vec x={blockS * k} y={-6} dx={-28} color={C.F} label="w_x + T" labelSide="below" width={3} /> : null}
            </g>
          )}
          <line x1={A * k} y1={3} x2={A * k} y2={-3} stroke={C.ink} />
        </g>
        <T x={O.x + 40} y={O.y - 6} s="φ" size={11} color={C.muted} />
        {t > 3.5 ? (
          <g>
            <line x1={O.x + (A + up) * k * 0.8} y1={O.y - (A + up) * k * 0.6} x2={O.x + (A + up) * k * 0.8} y2={O.y - A * k * 0.6} stroke={C.muted} strokeDasharray="3 3" />
            <T x={O.x + (A + up) * k * 0.8 - 6} y={O.y - (A + up / 2) * k * 0.6 + 14} s={`h = ${num(up * 0.6, 1)} m`} size={10} color={C.muted} anchor="end" />
          </g>
        ) : null}
        <Lines
          x={186}
          y={128}
          size={10}
          lines={[
            { s: "υ_0 = √(2K/m) = 250 m/s", color: C.v },
            { s: t > 2.5 ? "p = 100 kg·m/s,  V = 100/5 = 20 m/s" : "", color: C.p },
            { s: t > 3.5 ? "α = g(ημφ + μ·συνφ) = 10 m/s²" : "", color: C.F },
            { s: t > 3.5 ? "s = V²/2α = 20 m,  h = s·ημφ = 12 m" : "" },
          ]}
        />
      </g>
    );
  },
  steps: [
    { title: "α) Ταχύτητα βλήματος", body: "K = ½·m·υ_0²  →  12500 = 0,2·υ_0²  →  υ_0 = 250 m/s." },
    { title: "β) ΑΔΟ", body: "Η κρούση είναι στιγμιαία, κατά μήκος του επιπέδου: p = m_β·υ_0 = 100 kg·m/s. (V = 100/5 = 20 m/s.)" },
    { title: "γ) Επιβράδυνση", body: "Ανεβαίνοντας: ΣF = m·g·ημφ + μ·m·g·συνφ  →  α = 10·0,6 + 0,5·10·0,8 = 10 m/s²." },
    { title: "γ) Ύψος", body: "Διάστημα: s = V²/(2α) = 400/20 = 20 m. Ύψος: h = s·ημφ = 12 m." },
  ],
  answer: "α) υ_0 = 250 m/s  β) p = 100 kg·m/s  γ) h_{max} = 12 m.",
  remember: "Στο κεκλιμένο: ζητάει ΥΨΟΣ, όχι διάστημα. h = s·ημφ.",
});

/* 4.115 ───────── */
const e115 = ex({
  id: "4.115",
  source: "Τριπολίτης σ. 173",
  title: "Μετά την κρούση, η τριβή",
  statement: "Σώματα 4 kg (2 m/s) και 1 kg (10 m/s) κινούνται αντίθετα σε δάπεδο με μ = 0,2 και συγκρούονται μετωπικά τη στιγμή 0, χωρίς συσσωμάτωμα. Μετά το (1) έχει 1 m/s αντίθετα από πριν. Βρες την απόσταση των σωμάτων τη στιγμή που ακινητοποιείται α) το (1), β) το (2) (g = 10 m/s²).",
  given: "m_1 = 4 kg, υ_1 = 2 m/s (→), m_2 = 1 kg, υ_2 = 10 m/s (←), μ = 0,2, υ′_1 = 1 m/s (←)",
  ask: "Απόσταση όταν σταματά α) το (1)  β) το (2)",
  legend: ["v", "F"],
  phases: [
    { until: 2.5, label: "Πριν", say: "Θετικά δεξιά: p = 4·2 − 1·10 = −2 kg·m/s." },
    { until: 3.5, label: "Κρούση", say: "Μετά: 4·(−1) + 1·υ′_2 = −2, άρα υ′_2 = +2 m/s. Το (1) πάει αριστερά με 1, το (2) δεξιά με 2." },
    { until: 8, label: "Φρενάρουν", say: "Και τα δύο φρενάρουν με α = μ·g = 2 m/s². Το (1): σταματά στα 0,5 s μετά από 0,25 m. Το (2): στα 1 s μετά από 1 m." },
  ],
  Scene: ({ t }) =>
    collideThenFriction({
      t,
      u1: 2,
      u2: -10,
      v1: -1,
      v2: 2,
      a: 2,
      px: 110,
      X: 140,
      widths: [36, 26],
      vs: 7,
      tauMax: 1,
      lines: (s) => {
        const x1 = -Math.min(s, 0.5) + Math.min(s, 0.5) ** 2;
        const x2 = 2 * Math.min(s, 1) - Math.min(s, 1) ** 2;
        return [
          { s: "4·2 − 1·10 = 4·(−1) + 1·υ′_2  →  υ′_2 = 2 m/s", color: C.p },
          { s: s >= 0 ? `x_1 = ${num(x1, 2)} m,  x_2 = ${num(x2, 2)} m` : "", color: C.v },
          { s: s >= 0 ? `απόσταση = ${num(x2 - x1, 2)} m` : "" },
        ];
      },
    }),
  steps: [
    { title: "ΑΔΟ", body: "Θετικά δεξιά: 4·2 + 1·(−10) = 4·(−1) + 1·υ′_2  →  −2 = −4 + υ′_2  →  υ′_2 = 2 m/s (δεξιά)." },
    { title: "Επιβράδυνση", body: "Για κάθε σώμα α = μ·g = 2 m/s²." },
    { title: "α) Σταματά το (1)", body: L("t = 1/2 = 0,5 s, διάστημα x_1 = 1²/(2·2) = 0,25 m (αριστερά).", "Το (2) στα 0,5 s: x_2 = 2·0,5 − ½·2·0,25 = 0,75 m (δεξιά).", "Απόσταση: 0,25 + 0,75 = 1 m.") },
    { title: "β) Σταματά το (2)", body: L("t = 2/2 = 1 s, x_2 = 2²/(2·2) = 1 m.", "Το (1) έχει ήδη σταματήσει στα 0,25 m.", "Απόσταση: 1 + 0,25 = 1,25 m.") },
  ],
  answer: "α) 1 m  β) 1,25 m.",
  remember: "Όταν ένα σώμα σταματήσει λόγω τριβής, ΜΕΝΕΙ ακίνητο. Μη βάζεις τον τύπο θέσης μετά τη στιγμή που σταμάτησε.",
});

/* 4.116 ───────── */
const e116 = ex({
  id: "4.116",
  source: "Τριπολίτης σ. 173–174",
  title: "Οβίδα που εκρήγνυται στην κορυφή",
  statement: "Οβίδα εκτοξεύεται κατακόρυφα με 60 m/s και στο μέγιστο ύψος εκρήγνυται σε δύο θραύσματα με m_1 = 3m_2. Το (1) φεύγει οριζόντια και πέφτει σε σημείο Α, 1200 m από το σημείο Β όπου πέφτει το (2). Βρες: α) το ύψος της έκρηξης, β) δείξε ότι η υ_2 είναι οριζόντια, γ) τις υ_1 και υ_2 (g = 10 m/s²).",
  given: "υ_0 = 60 m/s, m_1 = 3m_2, AB = 1200 m, g = 10 m/s²",
  ask: "α) H  β) υ_2 οριζόντια  γ) υ_1, υ_2",
  legend: ["v"],
  phases: [
    { until: 3, label: "Ανεβαίνει", say: "Κατακόρυφη βολή: στο μέγιστο ύψος υ = 0. H = υ_0²/(2g) = 3600/20 = 180 m." },
    { until: 4.2, label: "Έκρηξη", say: "Ακριβώς πριν η ταχύτητα είναι 0, άρα και η ορμή 0. Μετά: m_1·υ_1 + m_2·υ_2 = 0, άρα υ_2 = −3υ_1: οριζόντια και αντίθετη." },
    { until: 9, label: "Πέφτουν", say: "Οριζόντιες βολές από 180 m: t = √(2H/g) = 6 s. Αποστάσεις 6υ_1 + 6·3υ_1 = 24υ_1 = 1200, υ_1 = 50 m/s, υ_2 = 150 m/s." },
  ],
  Scene: ({ t }) => {
    const gy = 186;
    const cx = 265;
    const k = 0.6; // px per m (vertical)
    const kx = 0.27; // px per m (horizontal)
    const top = gy - 180 * k;
    const r = seg(t, 0, 3);
    const yUp = gy - 180 * (1 - (1 - r) * (1 - r)) * k;
    const f = seg(t, 4.2, 9);
    const tt = 6 * f;
    const drop = 5 * tt * tt * k;
    const x1 = cx + 50 * tt * kx;
    const x2 = cx - 150 * tt * kx;
    const xs = (n: number) =>
      Array.from({ length: 30 }, (_, i) => {
        const q = (i / 29) * tt;
        return `${i ? "L" : "M"}${(cx + n * q * kx).toFixed(1)},${(top + 5 * q * q * k).toFixed(1)}`;
      }).join(" ");
    return (
      <g>
        <Ground y={gy} />
        <line x1={cx} y1={gy} x2={cx} y2={top} stroke={C.faint} strokeDasharray="3 3" />
        <T x={cx + 6} y={(gy + top) / 2} s="H" size={11} color={C.muted} anchor="start" />
        {t < 3.6 ? <Ball cx={cx} cy={t < 3 ? yUp : top} r={7} fill="#6b7280" /> : null}
        {t < 3 ? <Vec x={cx + 12} y={yUp} dx={0} dy={-(60 * (1 - r)) * 0.6} label="υ" /> : null}
        <Burst cx={cx} cy={top} k={seg(t, 3, 4.2)} />
        {t >= 3.6 ? (
          <g>
            <path d={xs(50)} fill="none" stroke={C.v} strokeDasharray="3 3" opacity={0.5} />
            <path d={xs(-150)} fill="none" stroke={C.v} strokeDasharray="3 3" opacity={0.5} />
            <Ball cx={x1} cy={top + drop} r={8} label="1" />
            <Ball cx={x2} cy={top + drop} r={5} fill={C.b2} />
            {t < 4.4 ? (
              <g>
                <Vec x={cx + 9} y={top} dx={15} label="υ_1" />
                <Vec x={cx - 9} y={top} dx={-45} label="υ_2" />
              </g>
            ) : null}
          </g>
        ) : null}
        {f >= 1 ? (
          <g>
            <T x={x2} y={gy + 14} s="Β" size={11} />
            <T x={x1} y={gy + 14} s="Α" size={11} />
          </g>
        ) : null}
        <Lines
          x={14}
          y={22}
          size={10}
          lines={[
            { s: t > 2 ? "H = 60²/20 = 180 m" : "" },
            { s: t > 3.6 ? "υ_2 = −3υ_1 (οριζόντια)" : "", color: C.p },
            { s: t > 4.2 ? "t = √(2H/g) = 6 s" : "" },
            { s: t > 4.2 ? "6υ_1 + 6·3υ_1 = 1200" : "" },
            { s: t > 4.2 ? "υ_1 = 50 m/s, υ_2 = 150 m/s" : "", color: C.v },
          ]}
        />
      </g>
    );
  },
  steps: [
    { title: "α) Ύψος", body: "Στο μέγιστο ύψος υ = 0: H = υ_0²/(2g) = 3600/20 = 180 m." },
    { title: "β) Γιατί οριζόντια", body: "Ακριβώς πριν την έκρηξη p = 0. ΑΔΟ: m_1·υ_1 + m_2·υ_2 = 0, άρα υ_2 = −(m_1/m_2)·υ_1 = −3υ_1: ίδια διεύθυνση με την υ_1 (οριζόντια), αντίθετη φορά." },
    { title: "γ) Χρόνος πτώσης", body: "Και τα δύο κάνουν οριζόντια βολή από 180 m: t = √(2H/g) = √36 = 6 s." },
    { title: "γ) Ταχύτητες", body: L("Αποστάσεις από τη βάση: x_1 = 6υ_1, x_2 = 6·3υ_1 = 18υ_1.", "Αντίθετες μεριές: 6υ_1 + 18υ_1 = 1200  →  υ_1 = 50 m/s, υ_2 = 150 m/s.") },
  ],
  answer: "α) H = 180 m  β) υ_2 = −3υ_1  γ) υ_1 = 50 m/s, υ_2 = 150 m/s.",
  remember: "Έκρηξη στο ψηλότερο σημείο: η ορμή εκεί είναι 0. Τα θραύσματα κάνουν οριζόντιες βολές με τον ίδιο χρόνο πτώσης.",
});

/* 4.117 ───────── */
const e117 = ex({
  id: "4.117",
  source: "Τριπολίτης σ. 174",
  title: "Κρούση σε κυκλική κίνηση",
  statement: "Σώμα 4 kg κάνει ομαλή κυκλική κίνηση σε λείο οριζόντιο δάπεδο, δεμένο σε νήμα μήκους 2 m. Η τάση του νήματος είναι 50 N. Σε ένα σημείο συγκρούεται πλαστικά με μπίλια 2 kg που έρχεται με 16 m/s αντίθετα στη γραμμική του ταχύτητα. Βρες: α) την ορμή του 4 kg πριν, β) τη μεταβολή του μέτρου της τάσης, γ) τη μεταβολή της γωνιακής ταχύτητας.",
  given: "m_1 = 4 kg, l = 2 m, T = 50 N, m_2 = 2 kg, υ_2 = 16 m/s (αντίθετα)",
  ask: "α) p_1  β) ΔT  γ) Δω",
  legend: ["v", "F"],
  phases: [
    { until: 3, label: "Κυκλική κίνηση", say: "Η τάση είναι η κεντρομόλος: m·υ²/l = 50, υ² = 25, υ = 5 m/s. p_1 = 4·5 = 20 kg·m/s." },
    { until: 4.2, label: "Κρούση", say: "Η μπίλια έρχεται αντίθετα: ορμή −2·16 = −32. Σύνολο 20 − 32 = −12 kg·m/s." },
    { until: 9, label: "Μετά", say: "V = −12/6 = −2 m/s: γυρίζει ανάποδα πιο αργά. Νέα τάση 6·4/2 = 12 N (ΔT = −38 N). ω από 2,5 σε 1 rad/s, με αντίθετη φορά." },
  ],
  Scene: ({ t }) => {
    const K = { x: 96, y: 104 };
    const R = 62;
    let th: number;
    if (t < 3) th = -1.2 + 2.5 * 0.42 * t;
    else if (t < 4.2) th = -1.2 + 2.5 * 0.42 * 3;
    else th = -1.2 + 2.5 * 0.42 * 3 - 1 * 0.42 * (t - 4.2);
    const bx = K.x + R * Math.cos(th);
    const by = K.y + R * Math.sin(th);
    const dir = t < 4.2 ? 1 : -1;
    const sp = t < 3 ? 5 : t < 4.2 ? 5 : 2;
    const tx = -Math.sin(th) * dir;
    const ty = Math.cos(th) * dir;
    const thC = -1.2 + 2.5 * 0.42 * 3;
    const ball = t < 3 ? seg(t, 0, 3) : 1;
    const cxB = K.x + R * Math.cos(thC) - Math.sin(thC) * 90 * (1 - ball);
    const cyB = K.y + R * Math.sin(thC) + Math.cos(thC) * 90 * (1 - ball);
    const T1 = t < 4.2 ? 50 : 12;
    return (
      <g>
        <circle cx={K.x} cy={K.y} r={R} fill="none" stroke={C.faint} strokeDasharray="4 4" />
        <circle cx={K.x} cy={K.y} r={3} fill={C.ink} />
        <T x={K.x - 8} y={K.y + 4} s="K" size={11} anchor="end" />
        <line x1={K.x} y1={K.y} x2={bx} y2={by} stroke="#a0784a" strokeWidth={1.5} />
        <Vec x={bx} y={by} dx={(K.x - bx) * (T1 / 50) * 0.55} dy={(K.y - by) * (T1 / 50) * 0.55} color={C.F} label={`T = ${T1} N`} width={2.6} labelSide="below" />
        <rect x={bx - 9} y={by - 9} width={18} height={18} fill={C.b1} stroke={C.edge} rx={2} />
        <Vec x={bx} y={by} dx={tx * sp * 7} dy={ty * sp * 7} label={t < 4.2 ? "5 m/s" : "2 m/s"} />
        {t < 3.2 ? <Ball cx={cxB} cy={cyB} r={7} fill={C.b2} /> : null}
        {t < 2.8 ? <Vec x={cxB} y={cyB} dx={Math.sin(thC) * 40} dy={-Math.cos(thC) * 40} label="16 m/s" /> : null}
        <Tag x={14} y={22} s="πλαστική κρούση" color={C.F} show={t >= 3 && t < 4.2} />
        <Lines
          x={214}
          y={40}
          size={10}
          lines={[
            { s: "m·υ²/l = 50 → υ = 5 m/s", color: C.v },
            { s: "p_1 = 20 kg·m/s", color: C.p },
            { s: t > 3 ? "20 − 32 = 6·V → V = −2" : "", color: C.p },
            { s: t > 4.2 ? "T′ = 6·4/2 = 12 N" : "", color: C.F },
            { s: t > 4.2 ? "ΔT = 12 − 50 = −38 N" : "", color: C.F },
            { s: t > 4.2 ? "ω: 2,5 → 1 rad/s (ανάποδα)" : "" },
          ]}
        />
      </g>
    );
  },
  steps: [
    { title: "α) Ταχύτητα από την τάση", body: "Η τάση είναι η κεντρομόλος: T = m_1·υ²/l  →  50 = 4υ²/2  →  υ = 5 m/s. p_1 = 4·5 = 20 kg·m/s." },
    { title: "ΑΔΟ στην κρούση", body: "Θετική η φορά του m_1: 4·5 − 2·16 = 6·V  →  −12 = 6V  →  V = −2 m/s (γυρίζει ανάποδα)." },
    { title: "β) Νέα τάση", body: "T′ = (m_1 + m_2)·V²/l = 6·4/2 = 12 N. ΔT = 12 − 50 = −38 N (μειώνεται κατά 38 N)." },
    { title: "γ) Γωνιακή ταχύτητα", body: L("ω = υ/l: πριν 5/2 = 2,5 rad/s, μετά 2/2 = 1 rad/s με αντίθετη φορά.", "Με πρόσημα: Δω = −1 − 2,5 = −3,5 rad/s (μέτρο 3,5 rad/s).") },
  ],
  answer: "α) p_1 = 20 kg·m/s  β) ΔT = −38 N  γ) Δω = −3,5 rad/s (από +2,5 σε −1 rad/s).",
  remember: "Η τάση του νήματος σε κυκλική κίνηση είναι κεντρομόλος: T = m·υ²/l. Μετά την πλαστική κρούση βάζεις τη ΝΕΑ μάζα.",
});

/* 4.118 ───────── */
const e118 = ex({
  id: "4.118",
  source: "Τριπολίτης σ. 174",
  title: "Η ανάκρουση του πυροβόλου",
  statement: "Ακίνητο πυροβόλο 500 kg εκτοξεύει οριζόντια βλήμα 4 kg και τινάζεται προς τα πίσω. Ένας μηχανισμός με μέση δύναμη 2000 N το σταματά σε 0,5 s. Βρες: α) την ταχύτητα ανάκρουσης, β) την ταχύτητα του βλήματος.",
  given: "M = 500 kg, m = 4 kg, F = 2000 N, Δt = 0,5 s, αρχικά ακίνητα",
  ask: "α) V ανάκρουσης  β) υ βλήματος",
  legend: ["v", "F"],
  phases: [
    { until: 2.5, label: "Βολή", say: "Το σύστημα ήταν ακίνητο: η ορμή είναι 0 πριν και αμέσως μετά. Βλήμα μπροστά, πυροβόλο πίσω." },
    { until: 6, label: "Το φρένο", say: "Ο μηχανισμός μηδενίζει την ορμή του πυροβόλου: M·V = F·Δt = 2000·0,5 = 1000, V = 2 m/s." },
    { until: 8, label: "Το βλήμα", say: "ΑΔΟ στη βολή: 4·υ = 500·2 = 1000, υ = 250 m/s." },
  ],
  Scene: ({ t }) => {
    const gy = 120;
    const s = tau(t, 1, 6, 0, 0.5);
    const xBack = 2 * s - 2 * s * s; // m, V = 2 - 4s
    const x = 150 - 60 * xBack;
    const V = t < 1 ? 0 : Math.max(0, 2 - 4 * s);
    const fired = t > 1;
    const bx = 196 + (t - 1) * 120;
    return (
      <g>
        <Ground y={gy} />
        <rect x={x - 44} y={gy - 30} width={64} height={22} fill="#5b6577" rx={4} />
        <rect x={x + 10} y={gy - 34} width={44} height={9} fill="#3b3f46" rx={3} />
        <circle cx={x - 22} cy={gy - 8} r={8} fill="#ffffff" stroke={C.edge} strokeWidth={2} />
        <T x={x - 12} y={gy - 16} s="M" size={10} color="#ffffff" />
        {fired && bx < 350 ? <Bullet x={bx} y={gy - 30} /> : null}
        {fired && bx < 330 ? <Vec x={bx + 6} y={gy - 46} dx={40} label="υ" /> : null}
        <Burst cx={200} cy={gy - 30} k={seg(t, 1, 1.8)} />
        {V > 0.05 ? (
          <g>
            <Vec x={x - 44} y={gy - 44} dx={-V * 14} label={`V = ${num(V, 1)} m/s`} />
            <Vec x={x - 44} y={gy - 18} dx={28} color={C.F} label="2000 N" labelSide="below" width={3} />
          </g>
        ) : null}
        <Clock s={s} />
        <Lines
          y={150}
          size={10.5}
          lines={[
            { s: t > 2.5 ? "M·V = F·Δt = 2000·0,5 = 1000  →  V = 2 m/s" : "", color: C.F },
            { s: t > 6 ? "ΑΔΟ: m·υ = M·V  →  4·υ = 1000  →  υ = 250 m/s" : "", color: C.p },
          ]}
        />
      </g>
    );
  },
  steps: [
    { title: "α) Το φρενάρισμα", body: "Για το πυροβόλο: Δp = F·Δt. Από M·V σε 0: M·V = 2000·0,5 = 1000 kg·m/s, άρα V = 1000/500 = 2 m/s." },
    { title: "β) ΑΔΟ στη βολή", body: "Ακίνητο σύστημα: 0 = m·υ − M·V  →  4·υ = 1000  →  υ = 250 m/s." },
  ],
  answer: "α) V = 2 m/s  β) υ = 250 m/s.",
  remember: "Δύο φάσεις: η βολή (ΑΔΟ) και το φρενάρισμα (Δp = F·Δt για το πυροβόλο μόνο).",
});

/* 4.119 ───────── */
const e119 = ex({
  id: "4.119",
  source: "Τριπολίτης σ. 174–175",
  title: "Ο ψαράς και η βάρκα",
  statement: "Ψαράς 80 kg πηδά οριζόντια από την ακίνητη βάρκα του (100 kg, μήκος 2 m) στον μόλο (1). Η βάρκα πρέπει να φτάσει στον μόλο (2), 17 m μακριά. Ο ψαράς τρέχοντας από ξηρά χρειάζεται τουλάχιστον 8 s για να πάει από τον (1) στον (2). Η θάλασσα αντιστέκεται με 10 N. α) Αν πηδήξει με 2,5 m/s, προλαβαίνει τη βάρκα στον μόλο (2); β) Με ποια ταχύτητα πρέπει να πηδήξει ώστε η βάρκα να φτάσει στον (2) με μηδενική ταχύτητα;",
  given: "m = 80 kg, M = 100 kg, l = 2 m, d = 17 m, t_{τρεξ} = 8 s, F_{αντ} = 10 N",
  ask: "α) προλαβαίνει με υ_1 = 2,5 m/s;  β) υ_1 για να φτάσει η βάρκα με υ = 0",
  legend: ["v", "F"],
  phases: [
    { until: 2.5, label: "Το πήδημα", say: "ΑΔΟ: 80·2,5 = 100·υ_2, άρα η βάρκα φεύγει προς τον (2) με υ_2 = 2 m/s." },
    { until: 8, label: "Ο αγώνας", say: "Η βάρκα έχει να διανύσει d − l = 15 m και φρενάρει με α = 10/100 = 0,1 m/s². Χρειάζεται 10 s. Ο ψαράς φτάνει στα 8 s: προλαβαίνει!" },
    { until: 10, label: "β) Χωρίς ταχύτητα", say: "Για να σταματήσει ακριβώς στα 15 m: υ_2² = 2·0,1·15 = 3, υ_2 = √3 m/s. Τότε υ_1 = 100·√3/80 ≈ 2,17 m/s." },
  ],
  Scene: ({ t }) => {
    const k = 15;
    const m2 = 40;
    const m1 = m2 + 17 * k;
    const s = tau(t, 2.5, 8, 0, 10);
    const boatX = 15 - (2 * s - 0.05 * s * s); // left end distance from mole 2, m
    const bl = m2 + boatX * k;
    const boatV = t < 2.5 ? 0 : 2 - 0.1 * s;
    const runner = t < 2.5 ? m1 - 10 + 30 * seg(t, 0, 2.5) : m1 + 20 - Math.min(1, s / 8) * (17 * k + 20);
    const wy = 110;
    return (
      <g>
        <rect x={0} y={wy} width={360} height={60} fill="#eaf4fb" />
        <rect x={0} y={wy - 8} width={m2} height={16} fill="#5b6577" />
        <rect x={m1} y={wy - 8} width={60} height={16} fill="#5b6577" />
        <T x={m2 / 2} y={wy + 26} s="μόλος 2" size={9.5} />
        <T x={m1 + 30} y={wy + 26} s="μόλος 1" size={9.5} />
        <path d="M 0 60 L 360 60" stroke="#9fae86" strokeWidth={6} opacity={0.5} />
        <T x={180} y={52} s="ξηρά (8 s)" size={9} color={C.muted} />
        <path d={`M ${bl} ${wy - 6} L ${bl + 2 * k} ${wy - 6} L ${bl + 2 * k - 4} ${wy + 4} L ${bl + 4} ${wy + 4} Z`} fill={C.wood} stroke={C.edge} />
        {t < 2.5 ? <StickPerson x={runner} y={wy - 6} scale={0.6} /> : <StickPerson x={runner} y={58} scale={0.6} step={t * 8} />}
        {boatV > 0.02 ? <Vec x={bl} y={wy - 18} dx={-boatV * 14} label={`${num(boatV, 1)} m/s`} /> : null}
        {boatV > 0.02 ? <Vec x={bl + 2 * k} y={wy} dx={10} color={C.F} label="10 N" labelSide="below" /> : null}
        <Clock s={s} x={352} y={22} />
        <Lines
          y={182}
          size={10}
          lines={[
            { s: t < 8 ? "80·2,5 = 100·υ_2 → υ_2 = 2 m/s,  α = 0,1 m/s²,  15 m σε 10 s > 8 s" : "β) υ_2 = √(2·0,1·15) = √3 m/s → υ_1 = 1,25·√3 ≈ 2,17 m/s", color: C.ink },
          ]}
        />
      </g>
    );
  },
  steps: [
    { title: "α) ΑΔΟ στο πήδημα", body: "Ακίνητο σύστημα: m·υ_1 = M·υ_2  →  80·2,5 = 100·υ_2  →  υ_2 = 2 m/s." },
    { title: "Πόσο πρέπει να πάει η βάρκα", body: "Η άκρη της βάρκας απέχει από τον μόλο (2) απόσταση d − l = 17 − 2 = 15 m." },
    { title: "Επιβράδυνση της βάρκας", body: "α = F_{αντ}/M = 10/100 = 0,1 m/s². Θα σταματούσε σε 2²/(2·0,1) = 20 m > 15 m, άρα φτάνει." },
    { title: "Χρόνος της βάρκας", body: L("15 = 2t − 0,05t²  →  t² − 40t + 300 = 0  →  t = 10 s (η άλλη ρίζα 30 s απορρίπτεται).", "Ο ψαράς φτάνει σε 8 s < 10 s: προλαβαίνει.") },
    { title: "β) Φτάνει με μηδενική ταχύτητα", body: L("0 = υ_2² − 2·α·15  →  υ_2 = √3 m/s.", "ΑΔΟ: 80·υ_1 = 100·√3  →  υ_1 = 1,25·√3 ≈ 2,17 m/s.") },
  ],
  answer: "α) Ναι: η βάρκα θέλει 10 s, ο ψαράς 8 s.  β) υ_1 = 1,25√3 ≈ 2,17 m/s.",
  remember: "Μέτρα σωστά την απόσταση από το σχήμα: η βάρκα έχει μήκος, οπότε διανύει d − l.",
});

/* 4.120 ───────── */
const e120 = ex({
  id: "4.120",
  source: "Τριπολίτης σ. 175",
  title: "Τρία σώματα, δύο κρούσεις",
  statement: "Σώματα (1) 4 kg, (2) 1 kg και (3) 3 kg σε λείο δάπεδο. Το (1) κινείται αριστερά με 3 m/s, τα (2) και (3) δεξιά. Τη στιγμή 0 τα (1) και (2) συγκρούονται πλαστικά και το συσσωμάτωμα μένει ακίνητο. Το (3) απέχει τότε 12 m και χτυπά πλαστικά το συσσωμάτωμα στα 3 s. Βρες την ταχύτητα: α) του (2) πριν, β) του (3), γ) του τελικού συσσωματώματος.",
  given: "m_1 = 4 kg (υ_1 = 3 m/s ←), m_2 = 1 kg (→), m_3 = 3 kg (→), d = 12 m, t_1 = 3 s",
  ask: "α) υ_2  β) υ_3  γ) V_{τελ}",
  legend: ["v", "p"],
  phases: [
    { until: 2.5, label: "1η κρούση", say: "Συσσωμάτωμα ακίνητο, άρα ολική ορμή 0: 1·υ_2 = 4·3, υ_2 = 12 m/s." },
    { until: 6.5, label: "Έρχεται το (3)", say: "Λείο δάπεδο: το (3) πάει ομαλά. 12 m σε 3 s: υ_3 = 4 m/s." },
    { until: 9, label: "2η κρούση", say: "ΑΔΟ: 3·4 = (4 + 1 + 3)·V, άρα V = 12/8 = 1,5 m/s." },
  ],
  Scene: ({ t }) => {
    const gy = 96;
    const k = 18;
    const X = 236;
    const pre = seg(t, 0, 2.5);
    const x1 = X + 10 + 3 * k * 0.3 * (1 - pre);
    const x2 = X - 10 - 12 * k * 0.3 * (1 - pre);
    const s3 = tau(t, 2.5, 6.5, 0, 3);
    const x3 = X - 24 - 12 * k + 4 * k * s3;
    const after = t > 6.5;
    const s4 = tau(t, 6.8, 9, 0, 1.2);
    const shift = after ? 1.5 * k * s4 * 0.5 : 0;
    return (
      <g>
        <Ground y={gy} />
        <Ball cx={x3 - shift * 0 + (after ? shift : 0)} cy={gy - 11} r={11} fill="#c7d2fe" label="3" />
        <Ball cx={(t < 2.5 ? x2 : X - 10) + shift} cy={gy - 8} r={8} fill={C.b2} label="2" />
        <Ball cx={(t < 2.5 ? x1 : X + 10) + shift} cy={gy - 12} r={12} label="1" />
        {t < 2.5 ? (
          <g>
            <Vec x={x1 - 12} y={gy - 34} dx={-24} label="3 m/s" />
            <Vec x={x2 + 8} y={gy - 50} dx={40} label="υ_2" />
          </g>
        ) : null}
        {t >= 2.5 && !after ? <Vec x={x3 + 11} y={gy - 30} dx={26} label="υ_3" /> : null}
        {t >= 2.5 && !after ? <Ruler x1={x3} x2={X} y={gy + 18} s={`${num(12 - 4 * s3, 1)} m`} /> : null}
        {after ? <Vec x={X + 22 + shift} y={gy - 30} dx={16} label="V" /> : null}
        {t >= 2.5 && t < 6.5 ? <Clock s={s3} /> : null}
        <Lines
          y={146}
          size={10.5}
          lines={[
            { s: t > 1.5 ? "4·3 = 1·υ_2  →  υ_2 = 12 m/s" : "", color: C.p },
            { s: t > 4 ? "υ_3 = 12 m / 3 s = 4 m/s" : "", color: C.v },
            { s: after ? "3·4 = 8·V  →  V = 1,5 m/s" : "", color: C.p },
          ]}
        />
      </g>
    );
  },
  steps: [
    { title: "α) 1η κρούση", body: "Το συσσωμάτωμα (1)+(2) είναι ακίνητο, άρα η ολική ορμή ήταν 0: m_2·υ_2 = m_1·υ_1  →  υ_2 = 12 m/s." },
    { title: "β) Το (3)", body: "Λείο δάπεδο, ομαλή κίνηση: υ_3 = d/t_1 = 12/3 = 4 m/s." },
    { title: "γ) 2η κρούση", body: "m_3·υ_3 + 0 = (m_1 + m_2 + m_3)·V  →  12 = 8·V  →  V = 1,5 m/s." },
  ],
  answer: "α) υ_2 = 12 m/s  β) υ_3 = 4 m/s  γ) V = 1,5 m/s.",
});

/* 4.121 ───────── */
const e121 = ex({
  id: "4.121",
  source: "Τριπολίτης σ. 175–176",
  title: "Βλήμα που διαπερνά σώμα στην άκρη τραπεζιού",
  statement: "Σώμα 4 kg είναι ακίνητο στην άκρη λείας επιφάνειας, σε ύψος 1,8 m. Μικρό σώμα 0,5 kg με 100 m/s το χτυπά και το διαπερνά. Το σώμα 4 kg πέφτει στο έδαφος 3 m πιο πέρα (οριζόντια). Βρες: α) την ταχύτητα του 4 kg αμέσως μετά, β) την ορμή του 0,5 kg μετά, γ) την απώλεια κινητικής ενέργειας (g = 10 m/s²).",
  given: "M = 4 kg, h = 1,8 m, m = 0,5 kg, υ_0 = 100 m/s, d = 3 m",
  ask: "α) V  β) p′_m  γ) Q",
  legend: ["v", "p", "K"],
  phases: [
    { until: 2.5, label: "Κρούση", say: "Το βλήμα περνά μέσα από το σώμα. Ορμή πριν: 0,5·100 = 50 kg·m/s." },
    { until: 6.5, label: "Οριζόντια βολή", say: "Το M πέφτει από 1,8 m: t = √(2h/g) = 0,6 s. Διανύει 3 m, άρα V = 3/0,6 = 5 m/s." },
    { until: 9, label: "Λογαριασμός", say: "ΑΔΟ: 50 = 4·5 + p′_m, άρα p′_m = 30 kg·m/s (υ = 60 m/s). K: 2500 → 900 + 50 = 950 J. Χάθηκαν 1550 J." },
  ],
  Scene: ({ t }) => {
    const top = 70;
    const gy = 186;
    const ex0 = 130;
    const kx = 32;
    const ky = (gy - top) / 1.8;
    const s = tau(t, 2.5, 6.5, 0, 0.6);
    const bx = ex0 - 14 + 5 * s * kx;
    const by = top + 5 * s * s * ky;
    const bulletX = t < 2.5 ? lerp(10, ex0 - 28, seg(t, 0, 2.5)) : ex0 + (t - 2.5) * 70;
    return (
      <g>
        <rect x={0} y={top} width={ex0} height={gy - top} fill="#f1ede6" stroke={C.ground} />
        <Ground y={gy} />
        <Ruler x1={ex0 - 14} x2={ex0 - 14 + 3 * kx} y={gy + 10} s="d = 3 m" />
        <T x={ex0 - 8} y={(top + gy) / 2} s="h = 1,8 m" size={10} color={C.muted} anchor="end" />
        <Box cx={t < 2.5 ? ex0 - 14 : bx} y={t < 2.5 ? top : by} w={26} h={22} label="M" />
        {bulletX < 350 ? <Bullet x={bulletX} y={top - 11} /> : null}
        {t < 2.5 ? <Vec x={bulletX + 4} y={top - 26} dx={40} label="100 m/s" /> : null}
        {t >= 2.5 && bulletX < 300 ? <Vec x={bulletX + 4} y={top - 26} dx={24} label="60 m/s" /> : null}
        {t >= 2.5 && s < 0.05 ? <Vec x={ex0} y={top - 30} dx={20} label="V" /> : null}
        <Lines
          x={180}
          y={96}
          size={10.5}
          lines={[
            { s: t > 2.5 ? "t = √(2h/g) = 0,6 s" : "" },
            { s: t > 2.5 ? "V = d/t = 5 m/s" : "", color: C.v },
            { s: t > 6.5 ? "p′_m = 50 − 20 = 30 kg·m/s" : "", color: C.p },
            { s: t > 6.5 ? "K: 2500 J → 950 J" : "", color: C.K },
            { s: t > 6.5 ? "Q = 1550 J" : "", color: "#e2571e" },
          ]}
        />
      </g>
    );
  },
  steps: [
    { title: "α) Οριζόντια βολή του M", body: "Χρόνος πτώσης: t = √(2h/g) = √0,36 = 0,6 s. Οριζόντια ομαλή: V = d/t = 3/0,6 = 5 m/s." },
    { title: "β) ΑΔΟ στην κρούση", body: "m·υ_0 = M·V + p′_m  →  50 = 20 + p′_m  →  p′_m = 30 kg·m/s (υ′ = 60 m/s)." },
    { title: "γ) Κινητικές", body: "K_{πριν} = ½·0,5·100² = 2500 J. K_{μετά} = ½·0,5·60² + ½·4·5² = 900 + 50 = 950 J." },
    { title: "γ) Απώλεια", body: "Q = 2500 − 950 = 1550 J." },
  ],
  answer: "α) V = 5 m/s  β) p′_m = 30 kg·m/s  γ) Q = 1550 J.",
  remember: "Η οριζόντια βολή δίνει την ταχύτητα αμέσως μετά την κρούση: V = d/t, t = √(2h/g).",
});

/* 4.122 ───────── */
const e122 = ex({
  id: "4.122",
  source: "Τριπολίτης σ. 176",
  title: "Ελαστική ή ανελαστική;",
  statement: "Σώμα 2 kg χτυπά τη στιγμή 0 μετωπικά ακίνητο σώμα 4 kg με 6 m/s. Και τα δύο έχουν μ = 0,16 με το δάπεδο. Το (2) σταματά στα 2,5 s. α) Βρες την ταχύτητα του (2) μετά. β) Βρες την απόσταση των σωμάτων στα 2,5 s. γ) Είναι η κρούση ελαστική; (g = 10 m/s²)",
  given: "m_1 = 2 kg, υ_1 = 6 m/s, m_2 = 4 kg (ακίνητο), μ = 0,16, το (2) σταματά στα 2,5 s",
  ask: "α) υ′_2  β) απόσταση στα 2,5 s  γ) ελαστική;",
  legend: ["v", "F"],
  phases: [
    { until: 2.5, label: "Πριν", say: "Ορμή πριν 2·6 = 12, κινητική ½·2·36 = 36 J." },
    { until: 3.5, label: "Κρούση", say: "Επιβράδυνση από τριβή α = μ·g = 1,6 m/s². Το (2) σταματά σε 2,5 s, άρα υ′_2 = 1,6·2,5 = 4 m/s." },
    { until: 8, label: "Φρενάρουν", say: "ΑΔΟ: 12 = 2υ′_1 + 16, υ′_1 = −2: γυρίζει. Το (1) σταματά σε 1,25 m πίσω, το (2) σε 5 m μπροστά. Απόσταση 6,25 m. K μετά: 4 + 32 = 36 J = K πριν: ελαστική!" },
  ],
  Scene: ({ t }) =>
    collideThenFriction({
      t,
      u1: 6,
      u2: 0,
      v1: -2,
      v2: 4,
      a: 1.6,
      px: 30,
      X: 120,
      widths: [28, 38],
      vs: 6,
      tauMax: 2.5,
      lines: (s) => {
        const q1 = Math.min(s, 1.25);
        const x1 = -(2 * q1 - 0.8 * q1 * q1);
        const x2 = 4 * s - 0.8 * s * s;
        return [
          { s: "α = μ·g = 1,6 m/s²  →  υ′_2 = 4 m/s,  υ′_1 = −2 m/s", color: C.v },
          { s: s >= 0 ? `x_1 = ${num(x1, 2)} m,  x_2 = ${num(x2, 2)} m,  απόσταση ${num(x2 - x1, 2)} m` : "" },
          { s: s >= 0 ? "K: 36 J πριν, 4 + 32 = 36 J μετά → ελαστική" : "", color: C.K },
        ];
      },
    }),
  steps: [
    { title: "α) Από τον χρόνο στην ταχύτητα", body: "Μετά την κρούση: α = μ·g = 1,6 m/s². 0 = υ′_2 − α·t_1  →  υ′_2 = 1,6·2,5 = 4 m/s." },
    { title: "ΑΔΟ για το (1)", body: "2·6 = 2·υ′_1 + 4·4  →  υ′_1 = −2 m/s (γυρίζει πίσω)." },
    { title: "β) Διαστήματα", body: L("Το (1) σταματά σε 2/1,6 = 1,25 s, μετά από 2²/(2·1,6) = 1,25 m (πίσω).", "Το (2) στα 2,5 s έχει διανύσει 4²/(2·1,6) = 5 m (μπροστά).", "Απόσταση: 1,25 + 5 = 6,25 m.") },
    { title: "γ) Κινητικές", body: "K_{πριν} = ½·2·36 = 36 J. K_{μετά} = ½·2·4 + ½·4·16 = 4 + 32 = 36 J. Ίσες: η κρούση είναι ελαστική." },
  ],
  answer: "α) υ′_2 = 4 m/s  β) 6,25 m  γ) ελαστική (K_{πριν} = K_{μετά} = 36 J).",
  remember: "Ελαστική ⇔ η κινητική ενέργεια πριν = μετά. Το ελέγχεις με αριθμούς.",
});

/* 4.123 ───────── */
const e123 = ex({
  id: "4.123",
  source: "Τριπολίτης σ. 176",
  title: "Ελαστική κρούση και τοίχος",
  statement: "Σώμα 1 kg (3 m/s) χτυπά μετωπικά και ελαστικά σώμα 3 kg που έρχεται αντίθετα με 1 m/s, σε λείο δάπεδο. Δεξιά υπάρχει ακλόνητος τοίχος. α) Βρες την ταχύτητα του (1) μετά. β) Αν η κρούση κρατά 0,005 s, βρες τη μέση δύναμη στο (1). γ) Το (2) χτυπά ελαστικά στον τοίχο. Θα ξανασυγκρουστούν;",
  given: "m_1 = 1 kg, υ_1 = 3 m/s (→), m_2 = 3 kg, υ_2 = 1 m/s (←), ελαστική, Δt = 0,005 s",
  ask: "α) υ′_1  β) F  γ) νέα κρούση;",
  legend: ["v", "F", "p"],
  phases: [
    { until: 2.5, label: "Πριν", say: "Θετικά δεξιά: υ_1 = +3, υ_2 = −1. Ορμή 3 − 3 = 0!" },
    { until: 3.7, label: "Κρούση", say: "Ελαστική: με τους τύπους, υ′_1 = −3 m/s και υ′_2 = +1 m/s. Ορμή μετά: −3 + 3 = 0." },
    { until: 8, label: "Τοίχος", say: "Το (2) χτυπά στον τοίχο και γυρίζει με 1 m/s. Το (1) φεύγει αριστερά με 3 m/s, πιο γρήγορα. Το (2) δεν θα το φτάσει ποτέ: καμία νέα κρούση." },
  ],
  Scene: ({ t }) => {
    const gy = 100;
    const X = 190;
    const wx = 300;
    const S = 18;
    let x1: number;
    let x2: number;
    let v1: number;
    let v2: number;
    if (t < 2.5) {
      x1 = X - 15 - 3 * S * (2.5 - t);
      x2 = X + 18 + S * (2.5 - t);
      v1 = 3;
      v2 = -1;
    } else if (t < 3.7) {
      const k = (t - 2.5) / 1.2;
      x1 = X - 15;
      x2 = X + 18;
      v1 = lerp(3, -3, k);
      v2 = lerp(-1, 1, k);
    } else {
      const d = t - 3.7;
      x1 = X - 15 - 3 * S * 0.5 * d;
      const hit = (wx - 18 - (X + 18)) / (S * 0.5);
      x2 = d < hit ? X + 18 + S * 0.5 * d : wx - 18 - S * 0.5 * (d - hit);
      v1 = -3;
      v2 = d < hit ? 1 : -1;
    }
    const f = bump(t, 2.5, 3.7);
    return (
      <g>
        <Ground y={gy} />
        <Wall x={wx} y1={40} y2={gy} />
        <Box cx={x1} y={gy} w={30} h={24} label="1" />
        <Box cx={x2} y={gy} w={36} h={30} fill={C.b2} label="2" />
        <Vec x={v1 >= 0 ? x1 + 15 : x1 - 15} y={gy - 36} dx={v1 * 10} label="υ_1" />
        <Vec x={v2 >= 0 ? x2 + 18 : x2 - 18} y={gy - 46} dx={v2 * 10} label="υ_2" />
        {f > 0.02 ? <Vec x={X} y={gy - 12} dx={-f * 44} color={C.F} label="F" labelSide="below" width={3} /> : null}
        <Tag x={14} y={22} s="ελαστική κρούση · αργή κίνηση" color={C.F} show={t >= 2.5 && t < 3.7} />
        <Lines
          y={140}
          size={10.5}
          lines={[
            { s: "υ′_1 = ((m_1 − m_2)υ_1 + 2m_2υ_2)/(m_1 + m_2) = −3 m/s", color: C.v },
            { s: t > 3.7 ? "Δp_1 = 1·(−3 − 3) = −6,  F = 6/0,005 = 1200 N" : "", color: C.F },
            { s: t > 3.7 ? "μετά τον τοίχο: (1) ← 3 m/s, (2) ← 1 m/s → δεν ξαναχτυπούν" : "" },
          ]}
        />
      </g>
    );
  },
  steps: [
    { title: "α) Τύπος ελαστικής κρούσης", body: L("Θετικά δεξιά: υ_1 = 3, υ_2 = −1.", "υ′_1 = ((m_1 − m_2)·υ_1 + 2m_2·υ_2)/(m_1 + m_2) = ((1 − 3)·3 + 2·3·(−1))/4 = (−6 − 6)/4 = −3 m/s.") },
    { title: "Και το (2)", body: "υ′_2 = ((m_2 − m_1)·υ_2 + 2m_1·υ_1)/(m_1 + m_2) = (2·(−1) + 6)/4 = +1 m/s. (Έλεγχος ΑΔΟ: −3 + 3 = 0 = 3 − 3 ✓.)" },
    { title: "β) Δύναμη στο (1)", body: "Δp_1 = 1·(−3 − 3) = −6 kg·m/s. F = 6/0,005 = 1200 N (προς τα αριστερά)." },
    { title: "γ) Μετά τον τοίχο", body: "Ελαστικά στον ακλόνητο τοίχο: το (2) γυρίζει με 1 m/s αριστερά. Το (1) πάει αριστερά με 3 m/s. Το (2) είναι πίσω και πιο αργό, άρα δεν το φτάνει: δεν ξανασυγκρούονται." },
  ],
  answer: "α) υ′_1 = 3 m/s προς τα αριστερά  β) F = 1200 N  γ) Όχι, δεν ξανασυγκρούονται.",
  remember: "Σε ελαστική κρούση με ακλόνητο τοίχο το σώμα γυρίζει με το ίδιο μέτρο ταχύτητας.",
});

export const ORMI_D: Exercise[] = [e107, e108, e109, e110, e111, e112, e113, e114, e115, e116, e117, e118, e119, e120, e121, e122, e123];
