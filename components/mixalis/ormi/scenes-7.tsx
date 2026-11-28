"use client";

import type { ReactNode } from "react";
import { Ball, Bars, Box, C, Ground, MiniGraph, SystemFrame, T, Tag, Vec, Wall, bump, clamp, lerp, num, seg, type Case } from "./kit";

/* ═════════════ ΕΝΟΤΗΤΑ 10 · Διαγράμματα δυνάμεων στην κρούση (κουτάκια 54–63) ═════════════
 * Every scene has a white panel «μόνο το σώμα»: the body cut out of the picture, with ONLY
 * the forces it receives during the impact. Same palette as the poster: blue = velocity,
 * red = force, green = momentum. */

/** The isolated-body panel. */
function Panel({ x, y, w, h, title = "μόνο το σώμα", children }: { x: number; y: number; w: number; h: number; title?: string; children?: ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="#ffffff" stroke="#e3b4b0" strokeDasharray="4 3" />
      <T x={x + w / 2} y={y + 13} s={title} size={9.5} color={C.F} />
      {children}
    </g>
  );
}

/** Pulse shape of a real impact force: average Cμ, peak (π/2)·Cμ. */
const pulse = (k: number) => (Math.PI / 2) * Math.sin(Math.PI * clamp(k));

/* ───────── shared wall scene for 54, 55, 56 ───────── */

function wallScene({ m, u, u2, Cavg, clay = false }: { m: number; u: number; u2: number; Cavg: number; clay?: boolean }) {
  const Scene = ({ t }: { t: number }) => {
    const wallX = 220;
    const r = 10;
    const y = 84;
    const hitX = wallX - r;
    const k = seg(t, 2, 3.6);
    let x: number;
    let v: number;
    if (t < 2) {
      x = lerp(36, hitX, t / 2);
      v = u;
    } else if (t < 3.6) {
      x = hitX;
      v = lerp(u, -u2, k);
    } else {
      x = hitX - ((hitX - 36) / 2) * (u2 / u) * (Math.min(t, 5.6) - 3.6);
      v = -u2;
    }
    const contact = t >= 2 && t < 3.6;
    const squash = clay ? 0.45 * Math.min(1, k * 1.6) : 0.35 * bump(t, 2, 3.6);
    const Cnow = contact ? Cavg * pulse(k) : 0;
    const fill = clay ? "#b08968" : C.ball;
    const after = t >= 3.6;
    return (
      <g>
        <Ground y={y + r + 14} x2={wallX} />
        <Wall x={wallX} y1={34} y2={y + r + 14} />
        <Ball cx={x + (clay && after ? r * 0.45 : squash * r)} cy={y} r={r} squash={clay && after ? 0.45 : squash} fill={fill} />
        <Vec x={v > 0 ? x - 8 - v * 3 : x - 12} y={y - 24} dx={v * 3} label={Math.abs(v) > 2 ? (v > 0 ? "υ" : "υ′") : undefined} />
        {clay && after ? <T x={x - 8} y={y - 26} s="υ′ = 0" size={10.5} color={C.v} italic /> : null}
        <Tag x={14} y={22} s="αργή κίνηση" color={C.F} show={contact} />
        <T x={20} y={50} s="+ →" size={10} color={C.muted} anchor="start" />
        <Panel x={236} y={14} w={118} h={116}>
          <Ball cx={322} cy={66} r={11} fill={fill} />
          {contact ? <Vec x={310} y={66} dx={-Cnow * 0.42} color={C.F} label="C" width={3.4} /> : null}
          <T
            x={295}
            y={96}
            s={contact ? `C τώρα: ${num(Cnow, 0)} N` : "καμία οριζόντια δύναμη"}
            size={9}
            color={contact ? C.F : C.muted}
            bold={contact}
          />
          <T x={295} y={111} s={t >= 3.6 ? `μέση C = ${num(Cavg, 0)} N` : ""} size={9.5} color={C.F} />
          <T x={295} y={124} s={t >= 3.6 ? `μέγιστη ≈ ${num(Cavg * 1.57, 0)} N` : ""} size={9} color={C.muted} bold={false} />
        </Panel>
        <Bars
          y={150}
          max={m * Math.max(u, u2) * 1.05}
          title="ορμή της μπάλας (θετικά →)"
          items={[
            { label: "p", value: m * v },
            { label: "Δp", value: t >= 3.6 ? m * (-u2 - u) : 0, color: "#137a3f" },
          ]}
        />
      </g>
    );
  };
  return Scene;
}

/* 54. Μπάλα χτυπά τοίχο και γυρίζει πιο αργά: 0,2 kg, 10 → 6 m/s, Δt = 0,04 s */
const case54: Case = {
  n: 54,
  title: "Μπάλα χτυπά τοίχο",
  what: "Μια μπάλα χτυπά κάθετα σε τοίχο και γυρίζει πίσω πιο αργά. Δεξιά τη βλέπεις «κομμένη» από το σχήμα, με μόνη τη δύναμη C που της ασκεί ο τοίχος.",
  given: "m = 0,2 kg, υ = 10 m/s προς τον τοίχο, υ′ = 6 m/s προς τα πίσω, χρόνος επαφής Δt = 0,04 s.",
  ask: "Το διάγραμμα δυνάμεων στη μπάλα, τη Δp και τη μέση δύναμη C του τοίχου.",
  period: 8,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2, label: "Πριν", say: "Θετική φορά προς τον τοίχο. Στον αέρα η μπάλα δεν δέχεται καμία ΟΡΙΖΟΝΤΙΑ δύναμη (το βάρος είναι κατακόρυφο)." },
    {
      until: 3.6,
      label: "Επαφή · αργή κίνηση",
      say: "Απομονώνω τη μπάλα: ο τοίχος της ασκεί τη C, προς τα αριστερά. Η C δεν είναι σταθερή: ανεβαίνει, κορυφώνεται και σβήνει.",
    },
    { until: 5.6, label: "Μετά", say: "Φεύγει με 6 m/s αντίθετα. Δp = 0,2·(−6) − 0,2·10 = −3,2 kg·m/s: αρνητική, όπως η C." },
    { until: 8, label: "Μέση C", say: "Μέση C = |Δp|/Δt = 3,2/0,04 = 80 N. Η μέγιστη στιγμιαία δύναμη είναι μεγαλύτερη από τη μέση." },
  ],
  Scene: wallScene({ m: 0.2, u: 10, u2: 6, Cavg: 80 }),
  solve: (
    <>
      Θετική φορά →. Δp = m(−υ′) − mυ = 0,2·(−6) − 0,2·10 = <b>−3,2 kg·m/s</b>. Στο διάγραμμα υπάρχει μόνο η C, άρα C·Δt = Δp ⇒ <b>C = 80 N</b> (μέση), προς τα
      αριστερά.
    </>
  ),
  trap: "Η μέση δύναμη δεν είναι η μέγιστη. Και το βάρος δεν μπαίνει στην οριζόντια εξίσωση.",
};

/* 55. Ίδιο μέτρο ταχύτητας: 0,2 kg, 10 → 10 m/s */
const case55: Case = {
  n: 55,
  title: "Γυρίζει με ίδια ταχύτητα",
  what: "Η μπάλα γυρίζει πίσω με την ίδια ταχύτητα. Η κινητική ενέργεια μένει ίδια, όμως η ορμή αλλάζει, και μάλιστα όσο το δυνατόν περισσότερο.",
  given: "m = 0,2 kg, υ = 10 m/s, υ′ = 10 m/s αντίθετα, Δt = 0,04 s.",
  ask: "Δp, ΔK και τη μέση δύναμη C.",
  period: 8,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2, label: "Πριν", say: "p = +2 kg·m/s, K = ½·0,2·10² = 10 J." },
    { until: 3.6, label: "Επαφή", say: "Ο τοίχος πρέπει να σταματήσει τη μπάλα ΚΑΙ να την ξαναστείλει πίσω με 10 m/s: διπλή δουλειά για τη C." },
    { until: 5.6, label: "Μετά", say: "p′ = −2 kg·m/s, K′ = 10 J. Άρα ΔK = 0, αλλά Δp = −4 kg·m/s." },
    { until: 8, label: "Μέση C", say: "C = 4/0,04 = 100 N. Η ορμή είναι διάνυσμα: η αλλαγή φοράς μετράει." },
  ],
  Scene: wallScene({ m: 0.2, u: 10, u2: 10, Cavg: 100 }),
  solve: (
    <>
      Δp = −mυ − mυ = <b>−2mυ = −4 kg·m/s</b>, ΔK = 10 − 10 = <b>0</b>, C = 4/0,04 = <b>100 N</b>.
    </>
  ),
  trap: "«Ίδια ταχύτητα» σημαίνει ίδιο ΜΕΤΡΟ. Η ταχύτητα άλλαξε φορά, άρα Δp ≠ 0.",
};

/* 56. Σταματά (πηλός): 0,2 kg, 10 → 0 */
const case56: Case = {
  n: 56,
  title: "Σταματά, δεν αναπηδά",
  what: "Μια μπάλα πηλού κολλάει στον τοίχο. Χρειάζεται μόνο να σταματήσει, οπότε η δύναμη του τοίχου είναι η μισή από ό,τι στην αναπήδηση του 55.",
  given: "m = 0,2 kg, υ = 10 m/s, μένει κολλημένη (υ′ = 0), Δt = 0,04 s.",
  ask: "Δp και μέση δύναμη C. Σύγκρινε με το κουτάκι 55.",
  period: 8,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2, label: "Πριν", say: "Ίδια μπάλα, ίδια ταχύτητα με το 55. Αλλά τώρα είναι πηλός." },
    { until: 3.6, label: "Επαφή", say: "Η C απλώς τη φρενάρει μέχρι το μηδέν. Δεν τη στέλνει πίσω." },
    { until: 5.6, label: "Μετά", say: "υ′ = 0, άρα Δp = 0 − 2 = −2 kg·m/s: η μισή από το 55." },
    { until: 8, label: "Μέση C", say: "C = 2/0,04 = 50 N. Με τον ίδιο χρόνο επαφής, η αναπήδηση θέλει διπλάσια δύναμη." },
  ],
  Scene: wallScene({ m: 0.2, u: 10, u2: 0, Cavg: 50, clay: true }),
  solve: (
    <>
      Δp = 0 − mυ = <b>−2 kg·m/s</b>, C = 2/0,04 = <b>50 N</b>. Στο 55 (αναπήδηση): 100 N.
    </>
  ),
  trap: "Για να σταματήσει, η τελική ταχύτητα είναι 0: η Δp είναι −mυ, όχι −2mυ.",
};

/* 57. Μαξιλάρι: ίδια Δp, Δt 0,01 s vs 0,1 s */
const case57: Case = {
  n: 57,
  title: "Μαξιλάρι: πιο πολύς χρόνος",
  what: "Δύο ίδιες μπάλες σταματούν: η μία σε σκληρό τοίχο, η άλλη σε μαξιλάρι. Η Δp είναι ίδια, αλλά στο μαξιλάρι ο χρόνος είναι πολύ μεγαλύτερος.",
  given: "m = 0,2 kg, υ = 10 m/s, σταματούν. Σκληρός τοίχος: Δt = 0,01 s. Μαξιλάρι: Δt = 0,1 s.",
  ask: "Τη μέση δύναμη στη μπάλα σε κάθε περίπτωση.",
  period: 7,
  legend: ["v", "F"],
  phases: [
    { until: 2, label: "Πριν", say: "Ίδια μάζα, ίδια ταχύτητα: ίδια ορμή 2 kg·m/s. Και οι δύο θα σταματήσουν, άρα Δp = −2 kg·m/s και για τις δύο." },
    { until: 4, label: "Φρενάρισμα", say: "Στον σκληρό τοίχο σταματά σχεδόν ακαριαία. Στο μαξιλάρι «βουλιάζει» και σταματά αργά." },
    { until: 7, label: "Σύγκριση", say: "Τα εμβαδά C–t είναι ίσα (= Δp). Δέκα φορές πιο πολύς χρόνος ⇒ δέκα φορές μικρότερη δύναμη: 200 N έναντι 20 N." },
  ],
  Scene: ({ t }) => {
    const wallX = 214;
    const lanes = [
      { y: 52, label: "σκληρός τοίχος", dt: 0.01, F: 200, stop: 0.12, cushion: false, color: C.F },
      { y: 112, label: "μαξιλάρι", dt: 0.1, F: 20, stop: 1.6, cushion: true, color: C.p },
    ];
    return (
      <g>
        {lanes.map((l) => {
          const r = 10;
          const front = l.cushion ? wallX - 20 : wallX;
          const k = clamp((t - 2) / l.stop);
          const sink = l.cushion ? 14 * (2 * k - k * k) : 0;
          const x = t < 2 ? lerp(40, front - r, t / 2) : front - r + sink;
          const v = t < 2 ? 10 : 10 * (1 - k);
          const braking = t >= 2 && k < 1;
          return (
            <g key={l.label}>
              <Wall x={wallX} y1={l.y - 22} y2={l.y + 16} />
              {l.cushion ? <rect x={front + sink - 2} y={l.y - 18} width={wallX - front - sink + 2} height={34} rx={5} fill="#cfe3c8" stroke={C.edge} /> : null}
              <Ball cx={x} cy={l.y} r={r} />
              <Vec x={x - 8 - v * 3} y={l.y - 18} dx={v * 3} />
              <T x={40} y={l.y + 26} s={l.label} size={9.5} color={C.muted} anchor="start" bold={false} />
              <Panel x={238} y={l.y - 34} w={116} h={56} title="μόνο η μπάλα">
                <Ball cx={334} cy={l.y} r={9} />
                {braking ? <Vec x={324} y={l.y} dx={-l.F * 0.3 - 1} color={C.F} label="C" width={3.2} /> : null}
                <T x={290} y={l.y + 17} s={t > 2 ? `C = ${l.F} N` : ""} size={9.5} color={C.F} />
              </Panel>
            </g>
          );
        })}
        <T x={180} y={166} s="ίδια Δp = 2 kg·m/s · ίδιο εμβαδόν C–t" size={10.5} color={C.p} />
        <MiniGraph
          x={20}
          y={174}
          w={150}
          h={30}
          tMax={0.12}
          yMin={0}
          yMax={210}
          fn={(u) => (u < 0.01 ? 200 : 0)}
          tNow={t < 2 ? 0 : 0.12}
          color={C.F}
          fillArea
          ghost={false}
        />
        <MiniGraph
          x={192}
          y={174}
          w={150}
          h={30}
          tMax={0.12}
          yMin={0}
          yMax={210}
          fn={(u) => (u < 0.1 ? 20 : 0)}
          tNow={t < 2 ? 0 : Math.min(0.12, ((t - 2) / 1.6) * 0.1 + (t > 3.6 ? 0.02 : 0))}
          color={C.p}
          fillArea
          ghost={false}
        />
      </g>
    );
  },
  solve: (
    <>
      Δp = 0 − 0,2·10 = −2 kg·m/s και στις δύο. Τοίχος: C = 2/0,01 = <b>200 N</b>. Μαξιλάρι: C = 2/0,1 = <b>20 N</b>.
    </>
  ),
  trap: "Το μαξιλάρι δεν μικραίνει τη Δp. Μεγαλώνει το Δt, κι έτσι μικραίνει τη δύναμη.",
};

/* ───────── shared two-block scene for 58, 59, 63 ───────── */

type Duo = { mA: number; mB: number; u: number; vA: number; vB: number; wA: number; wB: number; labelA: string; labelB: string };

function duoMotion(d: Duo, t: number, end = 5.2) {
  const S = 9; // px per (m/s · s)
  const meet = 150;
  const k = seg(t, 2, 3.2);
  let xA: number;
  let xB: number;
  let vA: number;
  let vB: number;
  if (t < 2) {
    xA = meet - d.wA / 2 - S * d.u * (2 - t);
    xB = meet + d.wB / 2;
    vA = d.u;
    vB = 0;
  } else if (t < 3.2) {
    xA = meet - d.wA / 2;
    xB = meet + d.wB / 2;
    vA = lerp(d.u, d.vA, k);
    vB = lerp(0, d.vB, k);
  } else {
    const after = Math.min(t, end) - 3.2;
    xA = meet - d.wA / 2 + S * d.vA * after;
    xB = meet + d.wB / 2 + S * d.vB * after;
    vA = d.vA;
    vB = d.vB;
  }
  return { xA, xB, vA, vB, k, contact: t >= 2 && t < 3.2 };
}

/* 58. Ζεύγος δυνάμεων επαφής: A 1 kg, 6 m/s → B 2 kg ακίνητο (ελαστική): υA′ = −2, υB′ = 4 */
const D58: Duo = { mA: 1, mB: 2, u: 6, vA: -2, vB: 4, wA: 30, wB: 30, labelA: "A", labelB: "B" };
const case58: Case = {
  n: 58,
  title: "Ζεύγος δυνάμεων επαφής",
  what: "Δύο σώματα συγκρούονται. Αν απομονώσεις το καθένα, βλέπεις ότι δέχονται ίσες και αντίθετες δυνάμεις επαφής, για τον ίδιο χρόνο.",
  given: "m_A = 1 kg με 6 m/s, m_B = 2 kg ακίνητο, λείο δάπεδο. Μετά: υ_A′ = −2 m/s, υ_B′ = 4 m/s. Δt = 0,02 s.",
  ask: "Δp_A, Δp_B και τη μέση δύναμη επαφής.",
  period: 7.5,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2, label: "Πριν", say: "Το A πάει προς το ακίνητο B. Θετική φορά προς τα δεξιά." },
    {
      until: 3.2,
      label: "Επαφή · αργή κίνηση",
      say: "Απομονώνω το καθένα: το B σπρώχνει το A προς τα πίσω με C, το A σπρώχνει το B μπροστά με C. Ίσα μέτρα, αντίθετες φορές, ίδιος χρόνος.",
    },
    { until: 5.2, label: "Μετά", say: "Δp_A = 1·(−2) − 1·6 = −8 και Δp_B = 2·4 − 0 = +8 kg·m/s. Ίσες και αντίθετες, όπως οι ωθήσεις." },
    { until: 7.5, label: "Μέση C", say: "C = 8/0,02 = 400 N σε κάθε σώμα. Η ολική ορμή (μαύρη ράβδος) δεν άλλαξε: 6 kg·m/s." },
  ],
  Scene: ({ t }) => {
    const gy = 112;
    const m = duoMotion(D58, t);
    const Cn = m.contact ? 400 * pulse(m.k) : 0;
    return (
      <g>
        <Ground y={gy} />
        <Box cx={m.xA} y={gy} w={D58.wA} h={24} label="A" fill={C.b1} />
        <Box cx={m.xB} y={gy} w={D58.wB} h={24} label="B" fill={C.b2} />
        <Vec x={m.vA >= 0 ? m.xA - 10 : m.xA + 6} y={gy - 32} dx={m.vA * 5} label={Math.abs(m.vA) > 1 ? "υ_A" : undefined} />
        <Vec x={m.xB - 6} y={gy - 32} dx={m.vB * 5} label={m.vB > 1 ? "υ_B" : undefined} />
        <Tag x={14} y={22} s="αργή κίνηση" color={C.F} show={m.contact} />
        <Panel x={196} y={6} w={158} h={72} title="κάθε σώμα χωριστά">
          <Box cx={240} y={52} w={24} h={20} label="A" fill={C.b1} />
          <Box cx={310} y={52} w={24} h={20} label="B" fill={C.b2} />
          {m.contact ? (
            <g>
              <Vec x={228} y={42} dx={-Cn * 0.06} color={C.F} label="C" width={3} />
              <Vec x={322} y={42} dx={Cn * 0.06} color={C.F} label="C" width={3} />
            </g>
          ) : null}
          <T x={275} y={71} s={m.contact ? "ίσες και αντίθετες" : t >= 3.2 ? "μέση C = 400 N στο καθένα" : "καμία δύναμη επαφής"} size={9} color={m.contact || t >= 3.2 ? C.F : C.muted} bold={false} />
        </Panel>
        <Bars
          y={140}
          max={9}
          items={[
            { label: "p_A", value: D58.mA * m.vA, color: C.p },
            { label: "p_B", value: D58.mB * m.vB, color: "#137a3f" },
            { label: "p_{ολ}", value: 6, color: C.ink },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      Δp_A = −8 kg·m/s, Δp_B = +8 kg·m/s ⇒ <b>Δp_A = −Δp_B</b>. Μέση C = 8/0,02 = <b>400 N</b> και στα δύο, με αντίθετες φορές.
    </>
  ),
  trap: "Οι δύο C ασκούνται σε ΔΙΑΦΟΡΕΤΙΚΑ σώματα, γι' αυτό δεν «αλληλοαναιρούνται» στο κάθε σώμα. Φεύγουν μόνο αν πάρεις σύστημα A + B (κουτάκι 63).",
};

/* 59. Άνισες μάζες: m 1 kg, 5 m/s → M 4 kg (ελαστική): υ′ = −3, V′ = 2 */
const D59: Duo = { mA: 1, mB: 4, u: 5, vA: -3, vB: 2, wA: 22, wB: 44, labelA: "m", labelB: "M" };
const case59: Case = {
  n: 59,
  title: "Άνισες μάζες, ίδια C",
  what: "Ένα ελαφρύ σώμα χτυπά ένα βαρύ. Η δύναμη επαφής έχει ίδιο μέτρο στα δύο, όμως το ελαφρύ αποκτά πολύ μεγαλύτερη επιτάχυνση και αλλάζει πολύ περισσότερο ταχύτητα.",
  given: "m = 1 kg με 5 m/s, M = 4 kg ακίνητο. Μετά: υ′ = −3 m/s, V′ = 2 m/s. Δt = 0,02 s.",
  ask: "Τη μέση δύναμη επαφής και τη μέση επιτάχυνση κάθε σώματος.",
  period: 7.5,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2, label: "Πριν", say: "Το ελαφρύ m πάει προς το βαρύ M, που είναι ακίνητο." },
    { until: 3.2, label: "Επαφή", say: "Ίδια C στα δύο (δράση–αντίδραση). Αλλά α = C/μάζα: το m επιταχύνεται 4 φορές πιο πολύ από το M." },
    { until: 5.2, label: "Μετά", say: "Δυ_m = −3 − 5 = −8 m/s, ενώ Δυ_M = +2 m/s. Οι Δp όμως είναι ίσες κατά μέτρο: 8 kg·m/s." },
    { until: 7.5, label: "Αριθμοί", say: "C = 8/0,02 = 400 N. α_m = 400/1 = 400 m/s², α_M = 400/4 = 100 m/s²." },
  ],
  Scene: ({ t }) => {
    const gy = 112;
    const m = duoMotion(D59, t, 4.4);
    const Cn = m.contact ? 400 * pulse(m.k) : 0;
    return (
      <g>
        <Ground y={gy} />
        <Box cx={m.xA} y={gy} w={D59.wA} h={18} label="m" fill={C.b1} />
        <Box cx={m.xB} y={gy} w={D59.wB} h={36} label="M" fill={C.b2} />
        <Vec x={m.vA >= 0 ? m.xA - 10 : m.xA + 6} y={gy - 28} dx={m.vA * 5} label={Math.abs(m.vA) > 1 ? "υ" : undefined} />
        <Vec x={m.xB - 8} y={gy - 46} dx={m.vB * 5} label={m.vB > 0.8 ? "V" : undefined} />
        <Tag x={14} y={22} s="αργή κίνηση" color={C.F} show={m.contact} />
        <Panel x={196} y={8} w={158} h={70} title="κάθε σώμα χωριστά">
          <Box cx={242} y={50} w={18} h={16} label="m" fill={C.b1} />
          <Box cx={308} y={56} w={34} h={28} label="M" fill={C.b2} />
          {m.contact ? (
            <g>
              <Vec x={232} y={42} dx={-Cn * 0.05} color={C.F} label="C" width={3} />
              <Vec x={325} y={42} dx={Cn * 0.05} color={C.F} label="C" width={3} />
            </g>
          ) : null}
          <T x={242} y={72} s={t >= 3.2 ? "α_m = 400 m/s²" : "α = C / μάζα"} size={9} color={t >= 3.2 ? C.ink : C.muted} bold={t >= 3.2} anchor={t >= 3.2 ? "middle" : "start"} />
          <T x={312} y={72} s={t >= 3.2 ? "α_M = 100 m/s²" : ""} size={9} color={C.ink} />
        </Panel>
        <Bars
          y={136}
          max={8.5}
          items={[
            { label: "Δp_m", value: t >= 3.2 ? -8 : 0, color: C.p },
            { label: "Δp_M", value: t >= 3.2 ? 8 : 0, color: "#137a3f" },
            { label: "Δυ_m", value: t >= 3.2 ? -8 : 0, color: C.v, unit: "m/s" },
            { label: "Δυ_M", value: t >= 3.2 ? 2 : 0, color: C.v, unit: "m/s" },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      |Δp| = 8 kg·m/s στο καθένα ⇒ C = 8/0,02 = <b>400 N</b>. α_m = C/m = <b>400 m/s²</b>, α_M = C/M = <b>100 m/s²</b>.
    </>
  ),
  trap: "Ίσες δυνάμεις δεν σημαίνει ίσες επιταχύνσεις ή ίσες αλλαγές ταχύτητας. Ίσες είναι μόνο οι Δp.",
};

/* 60. Μπάλα σε δάπεδο: 0,5 kg, 8 m/s κάτω → 6 m/s πάνω, Δt = 0,05 s */
const case60: Case = {
  n: 60,
  title: "Μπάλα χτυπά το δάπεδο",
  what: "Μια μπάλα πέφτει, χτυπά στο πάτωμα και αναπηδά. Στο διάγραμμα δυνάμεων υπάρχουν δύο δυνάμεις: η N από το πάτωμα και το βάρος mg.",
  given: "m = 0,5 kg, φτάνει με 8 m/s, φεύγει με 6 m/s προς τα πάνω, Δt = 0,05 s, g = 10 m/s².",
  ask: "Τη μέση δύναμη N του δαπέδου.",
  period: 7,
  legend: ["v", "F"],
  phases: [
    { until: 1.5, label: "Πτώση", say: "Στον αέρα δέχεται μόνο το βάρος mg = 5 N. Θετική φορά προς τα πάνω." },
    { until: 2.7, label: "Επαφή · αργή κίνηση", say: "Απομονώνω τη μπάλα: N προς τα πάνω (πολύ μεγάλη) και mg προς τα κάτω (μικρό). Η ΣΥΝΙΣΤΑΜΕΝΗ τους αλλάζει την ορμή." },
    { until: 4.6, label: "Αναπήδηση", say: "Δp = 0,5·6 − 0,5·(−8) = 7 kg·m/s. ΣF = 7/0,05 = 140 N." },
    { until: 7, label: "Η N", say: "N − mg = 140 ⇒ N = 145 N. Το βάρος (5 N) είναι μικρό, αλλά η άσκηση το ζητά: το προσθέτουμε." },
  ],
  Scene: ({ t }) => {
    const gy = 176;
    const r = 11;
    const x = 80;
    const S = 7;
    let cy: number;
    let vUp: number;
    if (t < 1.5) {
      const tau = t / 1.5;
      cy = gy - r - S * 16 * (1 - tau * tau) * 0.5;
      vUp = -8 * tau;
    } else if (t < 2.7) {
      cy = gy - r + 2 * Math.sin(Math.PI * seg(t, 1.5, 2.7));
      vUp = lerp(-8, 6, seg(t, 1.5, 2.7));
    } else {
      const tau = Math.min((t - 2.7) / 1.5, 0.75);
      cy = gy - r - S * 16 * 0.5 * (1.5 * tau - tau * tau) * 0.9;
      vUp = 6 - 8 * tau;
    }
    const contact = t >= 1.5 && t < 2.7;
    const Nnow = contact ? 145 * pulse(seg(t, 1.5, 2.7)) : 0;
    return (
      <g>
        <Ground y={gy} x2={170} />
        <Ball cx={x} cy={cy} r={r} squash={contact ? 0.25 * Math.sin(Math.PI * seg(t, 1.5, 2.7)) : 0} axis="y" />
        <Vec x={x + 30} y={cy} dx={0} dy={-vUp * 4} label={vUp < -0.5 ? "υ" : vUp > 0.5 ? "υ′" : undefined} />
        <Tag x={14} y={22} s="αργή κίνηση" color={C.F} show={contact} />
        <T x={150} y={40} s="+ ↑" size={10} color={C.muted} />
        <Panel x={196} y={10} w={158} h={130}>
          <Ball cx={234} cy={86} r={12} />
          {contact ? <Vec x={234} y={74} dx={0} dy={-Nnow * 0.22} color={C.F} label="N" width={3.4} labelSide="left" /> : null}
          <Vec x={234} y={98} dx={0} dy={16} color={C.F} label="mg" width={2.6} labelSide="left" />
          <T x={258} y={56} s={t >= 4.6 ? "N − mg = Δp/Δt" : "ΣF = N − mg"} size={9.5} color={C.F} anchor="start" />
          <T x={258} y={74} s={t >= 2.7 ? "Δp = 7 kg·m/s" : ""} size={9.5} color={C.p} anchor="start" />
          <T x={258} y={92} s={t >= 2.7 ? "ΣF = 140 N" : ""} size={9.5} color={C.F} anchor="start" />
          <T x={258} y={110} s={t >= 4.6 ? "N = 145 N" : contact ? `N τώρα ${num(Nnow, 0)}` : ""} size={10.5} color={C.F} anchor="start" />
          <T x={258} y={128} s="mg = 5 N" size={9} color={C.muted} anchor="start" bold={false} />
        </Panel>
        <Bars x={196} w={158} y={158} max={240} unit="N" items={[{ label: "N", value: Nnow, color: C.F }, { label: "mg", value: 5, color: C.F }]} />
      </g>
    );
  },
  solve: (
    <>
      Θετικά ↑: Δp = 0,5·6 − 0,5·(−8) = 7 kg·m/s. (N − mg)·Δt = Δp ⇒ N − 5 = 140 ⇒ <b>N = 145 N</b>.
    </>
  ),
  trap: "Το Δp/Δt δίνει τη ΣΥΝΙΣΤΑΜΕΝΗ. Αν ζητούν τη δύναμη του δαπέδου, πρόσθεσε το βάρος.",
};

/* 61. Φρενάρισμα με τριβή: 2 kg, 10 m/s, μ = 0,5 ⇒ T = 10 N, Δt = 2 s */
const case61: Case = {
  n: 61,
  title: "Φρενάρει με τριβή",
  what: "Ένα κιβώτιο γλιστρά σε τραχύ δάπεδο και σταματά. Εδώ η «κρούση» κρατά πολύ: η τριβή αφαιρεί σιγά σιγά την ορμή, με σταθερό ρυθμό.",
  given: "m = 2 kg, υ = 10 m/s, μ = 0,5, g = 10 m/s².",
  ask: "Το διάγραμμα δυνάμεων και τον χρόνο μέχρι να σταματήσει.",
  period: 7.5,
  legend: ["v", "F", "p"],
  phases: [
    { until: 1, label: "Αρχή", say: "Απομονώνω το κιβώτιο: N πάνω, mg κάτω, τριβή T αντίθετα στην κίνηση." },
    { until: 5, label: "Φρενάρισμα", say: "N = mg = 20 N, άρα αλληλοαναιρούνται. Μένει μόνο η T = μN = 10 N: η ορμή μειώνεται κατά 10 kg·m/s κάθε δευτερόλεπτο." },
    { until: 7.5, label: "Σταμάτησε", say: "−T·Δt = 0 − mυ ⇒ Δt = 20/10 = 2 s. Ίδιο με υ/(μg). Μόλις σταματήσει, η τριβή ολίσθησης σβήνει." },
  ],
  Scene: ({ t }) => {
    const gy = 108;
    const tp = clamp((t - 1) / 4) * 2; // physical seconds 0..2
    const moving = t >= 1 && tp < 2;
    const v = t < 1 ? 10 : 10 - 5 * tp;
    const s = t < 1 ? -10 * (1 - t) * 0.6 : 10 * tp - 2.5 * tp * tp;
    const cx = 56 + 17 * s;
    return (
      <g>
        <Ground y={gy} rough />
        <Box cx={cx} y={gy} w={36} h={26} label="m" fill={C.b2} />
        <Vec x={cx - 4} y={gy - 38} dx={v * 4} label={v > 1 ? "υ" : undefined} />
        <T x={20} y={gy + 22} s="τραχύ δάπεδο, μ = 0,5" size={9.5} color={C.muted} anchor="start" bold={false} />
        <T x={330} y={gy + 22} s={`t = ${num(Math.min(tp, 2), 1)} s`} size={10} color={C.ink} anchor="end" />
        <Panel x={236} y={6} w={118} h={70}>
          <Box cx={296} y={54} w={28} h={20} label="m" fill={C.b2} />
          <Vec x={296} y={34} dx={0} dy={-14} color={C.F} label="N" width={2.4} />
          <Vec x={296} y={54} dx={0} dy={14} color={C.F} label="mg" width={2.4} />
          {moving || t < 1 ? <Vec x={282} y={47} dx={-26} color={C.K} label="T" width={3} /> : <T x={260} y={50} s="T = 0" size={9} color={C.muted} />}
        </Panel>
        <Bars y={150} max={21} items={[{ label: "p", value: 2 * Math.max(0, v) }, { label: "T·Δt", value: t >= 1 ? -10 * Math.min(tp, 2) : 0, color: C.K }]} />
      </g>
    );
  },
  solve: (
    <>
      T = μmg = 0,5·2·10 = 10 N. Ώθηση: −T·Δt = 0 − mυ ⇒ Δt = 20/10 = <b>2 s</b> (= υ/(μg)).
    </>
  ),
  trap: "Ζητούν ΧΡΟΝΟ ⇒ ώθηση (ΣF·Δt = Δp). Ζητούν ΑΠΟΣΤΑΣΗ ⇒ ΘΜΚΕ.",
};

/* 62. Πιάνω μπάλα: 0,4 kg, 5 m/s, Δt 0,02 s ή 0,2 s */
const case62: Case = {
  n: 62,
  title: "Πιάνω μπάλα που πέφτει",
  what: "Πιάνεις μια μπάλα που πέφτει, μία φορά με σφιχτό χέρι και μία λυγίζοντας το χέρι προς τα κάτω. Στο διάγραμμα δυνάμεων: η C από το χέρι πάνω και το βάρος κάτω.",
  given: "m = 0,4 kg, φτάνει με 5 m/s και σταματά. Σφιχτό χέρι: Δt = 0,02 s. Λυγισμένο: Δt = 0,2 s. g = 10 m/s².",
  ask: "Τη μέση δύναμη C του χεριού σε κάθε περίπτωση.",
  period: 7,
  legend: ["v", "F"],
  phases: [
    { until: 1.5, label: "Πτώση", say: "Ίδια μπάλα, ίδια ταχύτητα. Θετική φορά προς τα πάνω, άρα Δp = 0 − 0,4·(−5) = +2 kg·m/s." },
    { until: 3.6, label: "Πιάσιμο", say: "Απομονώνω τη μπάλα: C από το χέρι προς τα πάνω, mg = 4 N προς τα κάτω. (C − mg)·Δt = Δp." },
    { until: 7, label: "Σύγκριση", say: "Σφιχτό: C − 4 = 100 ⇒ C = 104 N. Λυγισμένο: C − 4 = 10 ⇒ C = 14 N. Γι' αυτό «συνοδεύεις» τη μπάλα με το χέρι." },
  ],
  Scene: ({ t }) => {
    const lanes = [
      { x: 60, label: "σφιχτό χέρι", stop: 0.15, Cv: 104, bend: false },
      { x: 160, label: "λυγίζω το χέρι", stop: 1.8, Cv: 14, bend: true },
    ];
    const handY = 112;
    return (
      <g>
        {lanes.map((l) => {
          const k = clamp((t - 1.5) / l.stop);
          const drop = l.bend ? 22 * (2 * k - k * k) : 0;
          const r = 10;
          const cy = t < 1.5 ? handY - r - 4 - 70 * (1 - t / 1.5) : handY - r - 4 + drop;
          const v = t < 1.5 ? 5 : 5 * (1 - k);
          const hy = handY + drop;
          return (
            <g key={l.label}>
              <path d={`M${l.x - 26},${hy - 4} q26,16 52,0 l4,-6 q3,-4 -2,-5 l-6,4 q-20,9 -44,1 z`} fill="#f1c9a5" stroke={C.edge} strokeWidth={1.1} />
              <Ball cx={l.x} cy={cy} r={r} />
              <Vec x={l.x + 22} y={cy - 16} dx={0} dy={v * 4} label={v > 1 ? "υ" : undefined} />
              <T x={l.x} y={152} s={l.label} size={9.5} color={C.muted} bold={false} />
              <T x={l.x} y={168} s={t > 1.5 ? `C = ${l.Cv} N` : ""} size={10.5} color={C.F} />
            </g>
          );
        })}
        <Panel x={222} y={10} w={132} h={170} title="μόνο η μπάλα">
          {lanes.map((l, i) => {
            const k = clamp((t - 1.5) / l.stop);
            const on = (t >= 1.5 && k < 1) || t >= 3.6;
            const bx = 256 + i * 64;
            return (
              <g key={l.label}>
                <Ball cx={bx} cy={96} r={10} />
                {on ? <Vec x={bx} y={86} dx={0} dy={-(l.Cv * 0.5 + 2)} color={C.F} label="C" width={3} labelSide="right" /> : null}
                <Vec x={bx} y={106} dx={0} dy={12} color={C.F} label="mg" width={2.4} labelSide="right" />
                <T x={bx} y={148} s={i === 0 ? "σφιχτό" : "λυγισμένο"} size={9} color={C.muted} bold={false} />
                <T x={bx} y={164} s={`Δt = ${i === 0 ? "0,02" : "0,2"} s`} size={9} color={C.muted} bold={false} />
              </g>
            );
          })}
        </Panel>
        <T x={110} y={24} s="+ ↑" size={10} color={C.muted} />
        <T x={110} y={196} s="ίδια Δp = 2 kg·m/s" size={10.5} color={C.p} />
      </g>
    );
  },
  solve: (
    <>
      Θετικά ↑: Δp = 0 − 0,4·(−5) = 2 kg·m/s. (C − mg)·Δt = Δp ⇒ C = mg + Δp/Δt. Σφιχτό: 4 + 100 = <b>104 N</b>. Λυγισμένο: 4 + 10 = <b>14 N</b>.
    </>
  ),
  trap: "Με μεγάλο Δt το βάρος δεν είναι αμελητέο (εδώ 4 από τα 14 N). Μην το ξεχνάς.",
};

/* 63. Σύστημα A + B: A 1 kg, 6 m/s → B 2 kg, κολλάνε: V = 2 m/s */
const D63: Duo = { mA: 1, mB: 2, u: 6, vA: 2, vB: 2, wA: 30, wB: 30, labelA: "A", labelB: "B" };
const case63: Case = {
  n: 63,
  title: "Σύστημα A + B",
  what: "Η ίδια σύγκρουση με το 58, αλλά τώρα απομονώνουμε ΚΑΙ τα δύο σώματα μαζί. Οι δυνάμεις επαφής γίνονται εσωτερικές και φεύγουν από το διάγραμμα.",
  given: "m_A = 1 kg με 6 m/s, m_B = 2 kg ακίνητο, λείο δάπεδο. Κολλάνε.",
  ask: "Το διάγραμμα δυνάμεων του συστήματος και την κοινή ταχύτητα V.",
  period: 7.5,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2, label: "Πριν", say: "Παίρνω ως σύστημα το A μαζί με το B (διακεκομμένο πλαίσιο)." },
    {
      until: 3.2,
      label: "Επαφή",
      say: "Οι C ανάμεσα στα A και B είναι μέσα στο πλαίσιο: εσωτερικές. Στο διάγραμμα του συστήματος μένουν μόνο N_ολ και βάρος, που είναι κατακόρυφες.",
    },
    { until: 5.2, label: "Μετά", say: "Οριζόντια ΣF_εξ = 0 ⇒ ΑΔΟ: 1·6 = 3·V ⇒ V = 2 m/s." },
    { until: 7.5, label: "Έλεγχος", say: "Η μαύρη ράβδος (ολική ορμή) δεν κουνήθηκε ποτέ: 6 kg·m/s πριν και μετά." },
  ],
  Scene: ({ t }) => {
    const gy = 112;
    const m = duoMotion(D63, t, 4.4);
    const Cn = m.contact ? 1 : 0;
    const left = m.xA - 15 - 8;
    const right = m.xB + 15 + 8;
    return (
      <g>
        <Ground y={gy} />
        <SystemFrame x={left} y={gy - 44} w={right - left} h={42} />
        <Box cx={m.xA} y={gy} w={30} h={24} label="A" fill={C.b1} />
        <Box cx={m.xB} y={gy} w={30} h={24} label="B" fill={C.b2} />
        {Cn ? (
          <g opacity={0.8}>
            <Vec x={m.xA + 4} y={gy - 12} dx={-20} color={C.F} width={2} />
            <Vec x={m.xB - 4} y={gy - 12} dx={20} color={C.F} width={2} />

          </g>
        ) : null}
        <Tag x={14} y={22} s="εσωτερικές C: μέσα στο πλαίσιο" color={C.F} show={!!Cn} />
        <Vec x={m.xA - 8} y={gy - 54} dx={m.vA * 5} label={m.vA > 1 ? (t >= 3.2 ? "V" : "υ") : undefined} />
        <Panel x={236} y={6} w={118} h={92} title="μόνο το σύστημα">
          <Box cx={295} y={64} w={46} h={22} label="A+B" fill="#d9c9a3" />
          <Vec x={295} y={42} dx={0} dy={-18} color={C.F} label="N_{ολ}" width={2.6} />
          <Vec x={295} y={64} dx={0} dy={18} color={C.F} label="m_{ολ}g" width={2.6} />
          <T x={295} y={94} s="καμία οριζόντια ⇒ ΑΔΟ" size={8.5} color={C.p} />
        </Panel>
        <Bars
          y={140}
          max={7}
          items={[
            { label: "p_A", value: D63.mA * m.vA, color: C.p },
            { label: "p_B", value: D63.mB * m.vB, color: "#137a3f" },
            { label: "p_{ολ}", value: 6, color: C.ink },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      Σύστημα A + B: οριζόντια ΣF_εξ = 0 ⇒ ΑΔΟ: m_A·υ = (m_A + m_B)·V ⇒ 6 = 3V ⇒ <b>V = 2 m/s</b>. Κατακόρυφα N_ολ = (m_A + m_B)g = 30 N.
    </>
  ),
  trap: "Ένα σώμα: οι C φαίνονται και αλλάζουν την ορμή του. Σύστημα: οι C είναι εσωτερικές και δεν μπαίνουν. Πρώτα διαλέγεις τι απομονώνεις!",
};

/* 64. Σφυρί, μαχαίρι, πατάτα: η λάμα γλιστρά, η πατάτα «ανεβαίνει».
 * Πατάτα 0,2 kg, μέγιστη τριβή 4 N, το μαχαίρι παίρνει 3 m/s σε 0,005 s. */
const case64: Case = {
  n: 64,
  title: "Σφυρί, μαχαίρι, πατάτα",
  what: "Μια πατάτα είναι καρφωμένη στη λάμα ενός μαχαιριού. Χτυπάμε με σφυρί την κορυφή της λαβής: το μαχαίρι πετάγεται προς τα κάτω, η πατάτα σχεδόν μένει στη θέση της και «ανεβαίνει» πάνω στη λάμα.",
  given: "Πατάτα m = 0,2 kg, μέγιστη τριβή από τη λάμα T = 4 N, g = 10 m/s². Το σφυρί δίνει στο μαχαίρι 3 m/s σε Δt = 0,005 s.",
  ask: "Τι δύναμη θα χρειαζόταν για να ακολουθήσει η πατάτα και πόση ταχύτητα παίρνει τελικά.",
  period: 7.5,
  legend: ["v", "F"],
  phases: [
    { until: 1.5, label: "Πριν", say: "Το μαχαίρι κρέμεται με τη λάμα προς τα κάτω και η πατάτα είναι καρφωμένη πάνω της. Το σφυρί έρχεται να χτυπήσει την κορυφή της λαβής." },
    {
      until: 3.5,
      label: "Χτύπημα · αργή κίνηση",
      say: "Το σφυρί χτυπά ΜΟΝΟ το μαχαίρι. Απομονώνω την πατάτα: δέχεται το βάρος της και την τριβή T από τη λάμα, που την τραβά προς τα κάτω. Τη δύναμη του σφυριού δεν τη δέχεται.",
    },
    {
      until: 5.5,
      label: "Η λάμα γλιστρά",
      say: "Για να πάρει κι αυτή 3 m/s σε 0,005 s θα ήθελε F = 0,2·3/0,005 = 120 N. Η τριβή όμως δίνει το πολύ 4 N. Η λάμα γλιστρά μέσα από την πατάτα.",
    },
    { until: 7.5, label: "Αποτέλεσμα", say: "Δυ = (T + mg)·Δt/m = 6·0,005/0,2 = 0,15 m/s. Το μαχαίρι κατέβηκε, η πατάτα σχεδόν όχι: τη βλέπουμε πιο ψηλά πάνω στη λάμα." },
  ],
  Scene: ({ t }) => {
    const x = 96;
    const k = seg(t, 1.5, 5.5); // the knife slides down during the blow
    const sliding = t >= 1.5 && t < 5.5;
    const knifeDy = 46 * (1 - Math.pow(1 - k, 2));
    const potatoDy = 2.3 * (1 - Math.pow(1 - k, 2));
    const hy = 34 + knifeDy; // top of the handle
    const hammerY = t < 1.5 ? lerp(-4, hy - 14, t / 1.5) : hy - 14 - 10 * seg(t, 1.6, 2.6);
    const hitting = t >= 1.5 && t < 2.3;
    const vKnife = sliding ? 3 : 0;
    const vPotato = sliding ? 0.15 * clamp((t - 1.5) / 0.8) : 0;
    const py = 132 + potatoDy;
    return (
      <g>
        <rect x={x - 22} y={hammerY} width={44} height={14} rx={3} fill="#9aa3b2" stroke={C.edge} />
        <line x1={x + 22} y1={hammerY + 7} x2={x + 60} y2={hammerY - 20} stroke="#c8a27a" strokeWidth={5} strokeLinecap="round" />
        {hitting ? <Vec x={x - 34} y={hy - 18} dx={0} dy={20} color={C.F} label="σφυρί" labelSide="left" width={3.2} /> : null}
        <rect x={x - 6} y={hy} width={12} height={30} rx={2} fill="#7a5a3a" stroke={C.edge} />
        <polygon points={`${x - 6},${hy + 30} ${x + 6},${hy + 30} ${x + 4},${hy + 104} ${x - 2},${hy + 112}`} fill="#e1e4e9" stroke={C.edge} />
        <ellipse cx={x} cy={py} rx={30} ry={13} fill="#c9a06a" stroke={C.edge} strokeWidth={1.3} />
        <T x={14} y={204} s={`λάμα κάτω από την πατάτα: ${num(Math.max(0, 112 + hy - py - 13) / 10, 1)} cm`} size={9.5} color={C.muted} anchor="start" bold={false} />
        <Vec x={x + 26} y={hy + 6} dx={0} dy={vKnife * 10} label={vKnife ? "υ_{μαχ}" : undefined} labelSide="right" />
        <Tag x={14} y={22} s="αργή κίνηση" color={C.F} show={sliding} />
        <Panel x={226} y={10} w={128} h={170} title="μόνο η πατάτα">
          <ellipse cx={290} cy={62} rx={26} ry={12} fill="#c9a06a" stroke={C.edge} strokeWidth={1.3} />
          <Vec x={278} y={74} dx={0} dy={18} color={C.F} label="mg" labelSide="left" width={2.4} />
          {sliding ? <Vec x={302} y={74} dx={0} dy={26} color={C.K} label="T" labelSide="right" width={3} /> : null}
          <T x={290} y={116} s={sliding ? "T ≤ 4 N" : t >= 5.5 ? "η λάμα σταμάτησε" : "ακίνητη"} size={9.5} color={sliding ? C.K : C.muted} />
          <T x={290} y={129} s="όχι δύναμη σφυριού" size={8.5} color={C.muted} bold={false} />
          <line x1={234} y1={138} x2={346} y2={138} stroke="#eceef2" />
          <T x={236} y={155} s={`υ_{μαχ} = ${num(vKnife, 2)} m/s`} size={10} color={C.v} anchor="start" />
          <T x={236} y={172} s={`υ_{πατ} = ${num(vPotato, 2)} m/s`} size={10} color={C.p} anchor="start" />
        </Panel>

      </g>
    );
  },
  solve: (
    <>
      Για να ακολουθήσει: F = mΔυ/Δt = 0,2·3/0,005 = <b>120 N</b>, ενώ η τριβή φτάνει το πολύ 4 N. Πραγματικά: (T + mg)·Δt = m·Δυ ⇒ Δυ = 6·0,005/0,2 ={" "}
      <b>0,15 m/s</b>, είκοσι φορές λιγότερο από το μαχαίρι. Η λάμα γλιστρά μέσα από την πατάτα.
    </>
  ),
  trap: "Το σφυρί δεν σπρώχνει την πατάτα. Και η πατάτα δεν «ανεβαίνει»: σχεδόν μένει ακίνητη, το μαχαίρι κατεβαίνει. Είναι το αντίθετο του 57 και του 62: εκεί μεγάλο Δt ⇒ μικρή δύναμη, εδώ μικρό Δt ⇒ η μικρή τριβή δεν προλαβαίνει.",
};

/** Fish facing right (body, tail, eye). */
function Fish({ x, y, rx, ry, fill, label, opacity = 1 }: { x: number; y: number; rx: number; ry: number; fill: string; label?: string; opacity?: number }) {
  return (
    <g opacity={opacity}>
      <polygon points={`${x - rx + 2},${y} ${x - rx - ry * 1.1},${y - ry} ${x - rx - ry * 1.1},${y + ry}`} fill={fill} stroke={C.edge} />
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={fill} stroke={C.edge} strokeWidth={1.2} />
      <circle cx={x + rx * 0.55} cy={y - ry * 0.3} r={1.8} fill={C.ink} />
      {label ? <T x={x - rx * 0.15} y={y + 4} s={label} size={11} color={C.ink} italic /> : null}
    </g>
  );
}

/* 65. Ψάρι τρώει ψάρι (Τριπολίτης): M = 8 kg με 0,6 m/s, m = 2 kg με 0,1 m/s, ίδια φορά, κατάποση 2 s. */
const case65: Case = {
  n: 65,
  title: "Ψάρι τρώει ψάρι",
  what: "Ένα μεγάλο ψάρι κυνηγά ένα μικρό που κολυμπά προς την ίδια μεριά, και το καταπίνει. Είναι πλαστική κρούση: μετά κινούνται μαζί. Η κατάποση κρατά 2 s, οπότε βρίσκουμε και τη μέση δύναμη ανάμεσά τους.",
  given: "Μεγάλο ψάρι M = 8 kg με 0,6 m/s, μικρό m = 2 kg με 0,1 m/s προς την ίδια φορά. Χρόνος κατάποσης Δt = 2 s. (Άσκηση Τριπολίτη.)",
  ask: "α) Την ταχύτητα V του μεγάλου ψαριού μετά την κατάποση. β) Την απώλεια ενέργειας. γ) Τη Δp του μικρού και τη μέση δύναμη που δέχεται το μεγάλο από το μικρό.",
  period: 9.5,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2.5, label: "Πριν", say: "Θετική φορά προς τα δεξιά. p_ολ = 8·0,6 + 2·0,1 = 4,8 + 0,2 = 5 kg·m/s. Το νερό δεν ασκεί οριζόντια δύναμη: ΑΔΟ." },
    {
      until: 5,
      label: "Κατάποση · 2 s",
      say: "Απομονώνω κάθε ψάρι: το μεγάλο σπρώχνει το μικρό μπροστά με F, το μικρό σπρώχνει το μεγάλο πίσω με ίση F. Το μεγάλο φρενάρει, το μικρό επιταχύνεται.",
    },
    { until: 7, label: "Μετά", say: "α) 5 = (8 + 2)·V ⇒ V = 0,5 m/s. Η ολική ορμή (μαύρη ράβδος) έμεινε 5 kg·m/s." },
    {
      until: 9.5,
      label: "Ενέργεια, δύναμη",
      say: "β) K πριν = 1,44 + 0,01 = 1,45 J, μετά ½·10·0,5² = 1,25 J ⇒ Q = 0,2 J. γ) Δp_μικ = 2·0,5 − 2·0,1 = 0,8 kg·m/s, άρα Δp_μεγ = −0,8 και F = −0,8/2 = −0,4 N.",
    },
  ],
  Scene: ({ t }) => {
    const y = 84;
    const k = seg(t, 2.5, 5);
    let bigX: number;
    let smallX: number;
    let vBig: number;
    let vSmall: number;
    if (t < 2.5) {
      bigX = 58 + 12 * t;
      smallX = 127 + 2 * t;
      vBig = 0.6;
      vSmall = 0.1;
    } else if (t < 5) {
      bigX = 88 + 11 * (t - 2.5);
      smallX = lerp(132, bigX + 20, k);
      vBig = lerp(0.6, 0.5, k);
      vSmall = lerp(0.1, 0.5, k);
    } else {
      bigX = 115.5 + 10 * (Math.min(t, 7) - 5);
      smallX = bigX + 20;
      vBig = 0.5;
      vSmall = 0.5;
    }
    const swallowing = t >= 2.5 && t < 5;
    const F = swallowing ? 0.4 : 0;
    const smallGone = t >= 5;
    return (
      <g>
        <rect x={6} y={30} width={204} height={96} rx={8} fill="#e8f3fb" />
        <path d="M6,34 q12,-6 24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t12,0" fill="none" stroke="#9cc3e4" strokeWidth={1.2} />
        <Fish x={bigX} y={y} rx={32} ry={15} fill="#7fa7c9" label={smallGone ? "M+m" : "M"} />
        {!smallGone ? <Fish x={smallX} y={y + (swallowing ? -2 * k : 0)} rx={10 * (1 - 0.5 * k)} ry={6 * (1 - 0.5 * k)} fill="#f2c46d" opacity={1 - 0.6 * k} /> : null}
        <Vec x={bigX - 16} y={y - 26} dx={vBig * 45} label={smallGone ? "V" : "U"} />
        {!smallGone ? <Vec x={smallX - 4} y={y + 22} dx={vSmall * 45 + 2} label="υ" labelSide="below" /> : null}
        <Tag x={14} y={22} s="κατάποση: Δt = 2 s" color={C.F} show={swallowing} />
        <T x={108} y={142} s={t >= 7 ? "Q = 1,45 − 1,25 = 0,2 J" : t >= 5 ? "V = 5 / 10 = 0,5 m/s" : "p_{ολ} = 5 kg·m/s"} size={10.5} color={t >= 7 ? C.K : C.p} />
        <Panel x={218} y={8} w={136} h={118} title="κάθε ψάρι χωριστά">
          <Fish x={252} y={48} rx={10} ry={6} fill="#f2c46d" />
          <Fish x={300} y={92} rx={24} ry={11} fill="#7fa7c9" label="M" />
          {swallowing ? (
            <g>
              <Vec x={264} y={48} dx={30} color={C.F} label="F" width={3} />
              <Vec x={270} y={74} dx={-30} color={C.F} label="F" width={3} />
            </g>
          ) : null}
          <T x={286} y={120} s={swallowing || t >= 7 ? `F = ${num(t >= 7 ? 0.4 : F, 1)} N (μέση)` : "καμία δύναμη μεταξύ τους"} size={9} color={swallowing || t >= 7 ? C.F : C.muted} bold={swallowing || t >= 7} />
        </Panel>
        <Bars
          y={152}
          max={5.2}
          items={[
            { label: "p_M", value: 8 * vBig, color: C.p },
            { label: "p_m", value: 2 * vSmall, color: "#137a3f" },
            { label: "p_{ολ}", value: 5, color: C.ink },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      α) ΑΔΟ: 8·0,6 + 2·0,1 = 10·V ⇒ <b>V = 0,5 m/s</b>. β) K<sub>πριν</sub> = 1,44 + 0,01 = 1,45 J, K<sub>μετά</sub> = 1,25 J ⇒ <b>Q = 0,2 J</b> (≈ 13,8 %). γ) Δp<sub>μικ</sub> ={" "}
      <b>+0,8 kg·m/s</b>, Δp<sub>μεγ</sub> = −0,8 kg·m/s ⇒ <b>F = −0,4 N</b>: μέτρο 0,4 N, αντίθετα στην κίνηση.
    </>
  ),
  trap: "Η δύναμη στο μεγάλο ψάρι βγαίνει από τη ΔΙΚΗ του Δp (−0,8), όχι του μικρού. Και μετά την κατάποση το μεγάλο έχει μάζα 10 kg, όχι 8.",
};

/** Little FBD block: N up, mg down, optional friction to the left. */
function FbdBlock({ x, y, w = 30, h = 20, label, fill, T: Tf }: { x: number; y: number; w?: number; h?: number; label: string; fill: string; T?: boolean }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={3} fill={fill} stroke={C.edge} />
      <T x={x} y={y + 4} s={label} size={10} color={C.ink} italic />
      <Vec x={x} y={y - h / 2} dx={0} dy={-18} color={C.F} label="N" width={2.4} />
      <Vec x={x} y={y + h / 2} dx={0} dy={18} color={C.F} label="mg" width={2.4} />
      {Tf ? <Vec x={x - w / 2} y={y + 3} dx={-24} color={C.K} label="T" width={3} /> : null}
    </g>
  );
}

/* 66. Τριπολίτης: A 5 kg, 10 m/s, μ = 0,2· σε 2 s συγκρούεται πλαστικά με B 2 kg (1 m/s αντίθετα)·
 * μετά λείο δάπεδο και τραχύ τεταρτοκύκλιο R = 0,2 m, στην κορυφή υ = √2 m/s. */
const case66: Case = {
  n: 66,
  title: "Κρούση και τεταρτοκύκλιο",
  what: "Σύνθετη άσκηση σε τρία κομμάτια: το A φρενάρει με τριβή, συγκρούεται πλαστικά με το B, και το συσσωμάτωμα ανεβαίνει σε τραχύ τεταρτοκύκλιο. Σε κάθε κομμάτι αλλάζει το διάγραμμα δυνάμεων, και μαζί του ο νόμος που χρησιμοποιούμε.",
  given: "m_A = 5 kg με υ₀ = 10 m/s, μ = 0,2 στο πρώτο κομμάτι. Μετά από 2 s συγκρούεται πλαστικά με m_B = 2 kg που κινείται αντίθετα με 1 m/s. Μετά λείο δάπεδο και τεταρτοκύκλιο R = 0,2 m. Στο πάνω άκρο υ = √2 m/s. g = 10 m/s².",
  ask: "Την ταχύτητα του A πριν την κρούση, την κοινή ταχύτητα V και το έργο της τριβής στο τεταρτοκύκλιο.",
  period: 11,
  legend: ["v", "F"],
  phases: [
    { until: 2.5, label: "Τριβή", say: "Μόνο το A: N, mg και τριβή T = μmg = 10 N προς τα πίσω. α = −2 m/s², άρα σε 2 s: υ_A = 10 − 2·2 = 6 m/s." },
    { until: 3.3, label: "Κρούση", say: "Σύστημα A + B: οι δυνάμεις επαφής είναι εσωτερικές, η τριβή αμελητέα στο ελάχιστο Δt. ΑΔΟ: 5·6 − 2·1 = 7V ⇒ V = 4 m/s." },
    { until: 5, label: "Λείο", say: "Στο λείο δάπεδο μένουν μόνο N και mg, που αλληλοαναιρούνται: ΣF = 0, άρα V = 4 m/s σταθερή μέχρι το τεταρτοκύκλιο." },
    { until: 8, label: "Τεταρτοκύκλιο", say: "Στην καμπύλη: N προς το κέντρο, mg κάτω, T αντίθετα στην κίνηση. Η N αλλάζει σε κάθε σημείο, άρα και η T: δεν μπορώ να πω W_T = −T·s." },
    { until: 11, label: "ΘΜΚΕ", say: "ΘΜΚΕ: ½·7·2 − ½·7·16 = W_T − 7·10·0,2 ⇒ 7 − 56 = W_T − 14 ⇒ W_T = −35 J." },
  ],
  Scene: ({ t }) => {
    const gy = 160;
    const R = 66;
    const cx = 250;
    const cy = gy - R;
    let body: ReactNode;
    let vText = "";
    if (t < 2.5) {
      const tau = (t / 2.5) * 2;
      const xA = 26 + 7 * (10 * tau - tau * tau);
      const xB = 161 + 7 * (2 - tau);
      body = (
        <g>
          <Box cx={xA} y={gy} w={22} h={18} label="A" fill={C.b1} />
          <Box cx={xB} y={gy} w={16} h={14} label="B" fill={C.b2} />
          <Vec x={xA - 6} y={gy - 28} dx={(10 - 2 * tau) * 3} label="υ_A" />
          <Vec x={xB + 6} y={gy - 24} dx={-8} />
        </g>
      );
      vText = `υ_A = ${num(10 - 2 * tau, 1)} m/s`;
    } else if (t < 5) {
      const k = seg(t, 3.3, 5);
      const xc = t < 3.3 ? 144 : lerp(144, cx - 19, k);
      body = (
        <g>
          <Box cx={xc - 8} y={gy} w={22} h={18} label="A" fill={C.b1} />
          <Box cx={xc + 11} y={gy} w={16} h={14} label="B" fill={C.b2} />
          <Vec x={xc - 10} y={gy - 30} dx={12} label="V" />
        </g>
      );
      vText = "V = 4 m/s";
    } else {
      const u = seg(t, 5, 8);
      const phi = (Math.PI / 2) * (1 - (1 - u) * (1 - u));
      const r = R - 12;
      const bx = cx + r * Math.sin(phi);
      const by = cy + r * Math.cos(phi);
      body = <rect x={bx - 12} y={by - 12} width={24} height={24} rx={3} fill="#d9c9a3" stroke={C.edge} transform={`rotate(${(-phi * 180) / Math.PI} ${bx} ${by})`} />;
      vText = t >= 8 ? "πάνω: υ = √2 m/s" : "ανεβαίνει, επιβραδύνεται";
    }
    const part = t < 2.5 ? 0 : t < 3.3 ? 1 : t < 5 ? 2 : 3;
    return (
      <g>
        <line x1={8} y1={gy} x2={150} y2={gy} stroke={C.edge} strokeWidth={2.4} />
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i} x1={12 + i * 10} y1={gy + 1} x2={6 + i * 10} y2={gy + 7} stroke={C.muted} />
        ))}
        <line x1={150} y1={gy} x2={cx} y2={gy} stroke={C.edge} strokeWidth={1.6} />
        <path d={`M${cx},${gy} A${R},${R} 0 0 0 ${cx + R},${cy}`} fill="none" stroke={C.edge} strokeWidth={2} />
        <T x={78} y={gy + 22} s="μ = 0,2" size={9.5} color={C.muted} bold={false} />
        <T x={198} y={gy + 22} s="λείο" size={9.5} color={C.muted} bold={false} />
        <T x={cx + R + 8} y={cy + 30} s="R" size={10} color={C.muted} anchor="start" />
        {body}
        <Panel x={8} y={6} w={230} h={96} title={part === 1 ? "μόνο το σύστημα A + B" : "μόνο το σώμα"}>
          {part === 0 ? <FbdBlock x={56} y={60} label="A" fill={C.b1} T /> : null}
          {part === 1 || part === 2 ? <FbdBlock x={56} y={60} w={40} label="A+B" fill="#d9c9a3" /> : null}
          {part === 3 ? (
            <g>
              <rect x={44} y={48} width={22} height={22} rx={3} fill="#d9c9a3" stroke={C.edge} transform="rotate(-45 55 59)" />
              <Vec x={47} y={51} dx={-16} dy={-16} color={C.F} label="N" width={2.6} />
              <Vec x={55} y={71} dx={0} dy={18} color={C.F} label="mg" width={2.4} />
              <Vec x={46} y={68} dx={-14} dy={14} color={C.K} label="T" width={2.8} />
            </g>
          ) : null}
          {[
            ["T = μmg = 10 N", "α = −2 m/s²", "υ_A = 10 − 2·2 = 6"],
            ["C εσωτερικές ⇒ ΑΔΟ", "5·6 − 2·1 = 7V", "V = 4 m/s"],
            ["N = mg ⇒ ΣF = 0", "V σταθερή", "= 4 m/s"],
            t >= 8 ? ["ΘΜΚΕ:", "7 − 56 = W_T − 14", "W_T = −35 J"] : ["N αλλάζει ⇒", "T όχι σταθερή", "⇒ ΘΜΚΕ"],
          ][part].map((line, i) => (
            <T key={i} x={108} y={42 + 18 * i} s={line} size={10} color={i === 2 ? C.F : C.ink} anchor="start" bold={i === 2} />
          ))}
        </Panel>
        <T x={300} y={24} s={vText} size={10.5} color={C.v} anchor="end" />
      </g>
    );
  },
  solve: (
    <>
      Τριβή: α = −μg = −2 m/s² ⇒ υ_A = 10 − 4 = <b>6 m/s</b>. ΑΔΟ: 5·6 − 2·1 = 7V ⇒ <b>V = 4 m/s</b>. ΘΜΚΕ στο τεταρτοκύκλιο: ½·7·(√2)² − ½·7·4² = W_T − 7·10·0,2 ⇒{" "}
      <b>W_T = −35 J</b>.
    </>
  ),
  trap: "Στην καμπύλη η N δεν είναι ίση με mg ούτε με τη συνιστώσα του βάρους: μπαίνει και η κεντρομόλος. Γι' αυτό η T δεν είναι σταθερή και το έργο της βγαίνει μόνο από το ΘΜΚΕ.",
};

/** Bullet into / through a block: shared scene for 67 and 68. */
function bulletScene({ m, M, u, uOut, V, through, Fn }: { m: number; M: number; u: number; uOut: number; V: number; through: boolean; Fn: string }) {
  const Scene = ({ t }: { t: number }) => {
    const gy = 132;
    const bw = 52;
    const k = seg(t, 2, 4.5);
    const blockX = 196 + (t < 2 ? 0 : t < 4.5 ? 3 * k * k : 3 + 12 * (Math.min(t, 6.5) - 4.5));
    let bx: number;
    let vb: number;
    if (t < 2) {
      bx = lerp(16, 196, t / 2);
      vb = u;
    } else if (t < 4.5) {
      const depth = through ? bw + 6 : 34;
      bx = blockX + depth * (2 * k - k * k);
      vb = lerp(u, through ? uOut : V, k);
    } else {
      bx = through ? blockX + bw + 6 + 40 * (Math.min(t, 6.5) - 4.5) : blockX + 34;
      vb = through ? uOut : V;
    }
    const inside = t >= 2 && t < 4.5;
    const vBlock = t < 2 ? 0 : t < 4.5 ? V * k : V;
    return (
      <g>
        <Ground y={gy} />
        <rect x={blockX} y={gy - 36} width={bw} height={36} rx={3} fill="#c9a06a" stroke={C.edge} />
        <T x={blockX + bw / 2} y={gy - 14} s="M" size={12} color={C.ink} italic />
        <rect x={bx - 12} y={gy - 21} width={14} height={6} rx={2} fill="#5d6470" stroke={C.edge} opacity={!through && t >= 4.5 ? 0.5 : 1} />
        {!(!through && t >= 4.5) ? <Vec x={bx - 14 - Math.min(vb, 200) * 0.18} y={gy - 34} dx={Math.min(vb, 200) * 0.18} label={`${num(vb, 0)} m/s`} /> : null}
        {vBlock > 0.2 ? <Vec x={blockX + 8} y={gy - 46} dx={vBlock * 4 + 4} label="V" /> : null}
        <Tag x={14} y={22} s="μέσα στο ξύλο · αργή κίνηση" color={C.F} show={inside} />
        <Panel x={8} y={6} w={176} h={82} title="κάθε σώμα χωριστά">
          <rect x={34} y={46} width={16} height={6} rx={2} fill="#5d6470" stroke={C.edge} />
          <rect x={100} y={44} width={36} height={28} rx={3} fill="#c9a06a" stroke={C.edge} />
          {inside ? (
            <g>
              <Vec x={32} y={49} dx={-24} color={C.F} label="F" width={3} />
              <Vec x={136} y={58} dx={24} color={C.F} label="F" width={3} />
            </g>
          ) : null}
          <T x={96} y={84} s={inside || t >= 6.5 ? Fn : "καμία δύναμη μεταξύ τους"} size={9} color={inside || t >= 6.5 ? C.F : C.muted} />
        </Panel>
        <Bars
          y={150}
          max={m * u * 1.05}
          items={[
            { label: "p_m", value: m * vb, color: C.p },
            { label: "p_M", value: M * vBlock, color: "#137a3f" },
            { label: "p_{ολ}", value: m * u, color: C.ink },
          ]}
        />
      </g>
    );
  };
  return Scene;
}

/* 67. Τριπολίτης: βλήμα 0,04 kg με 200 m/s σφηνώνεται σε ξύλο 0,96 kg, διεισδύει 7,68 cm. */
const case67: Case = {
  n: 67,
  title: "Βλήμα σφηνώνεται σε ξύλο",
  what: "Ένα βλήμα σφηνώνεται σε ξύλο που ηρεμεί σε λείο δάπεδο. Από την ΑΔΟ βρίσκουμε την κοινή ταχύτητα, από τη θερμότητα και το βάθος διείσδυσης τη δύναμη, και από τη Δp του ξύλου τον χρόνο.",
  given: "Βλήμα m = 0,04 kg με 200 m/s, ξύλο M = 0,96 kg ακίνητο, λείο δάπεδο. Το βλήμα μπαίνει 7,68 cm μέσα στο ξύλο. (Άσκηση Τριπολίτη· τα 7,68 cm τα διαβάζουμε ως βάθος μέσα στο ξύλο.)",
  ask: "V, απώλεια ενέργειας, μέση δύναμη, χρόνος διείσδυσης, μετατόπιση του ξύλου.",
  period: 9,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2, label: "Πριν", say: "p_ολ = 0,04·200 = 8 kg·m/s. K = ½·0,04·200² = 800 J." },
    { until: 4.5, label: "Διείσδυση", say: "Μέσα στο ξύλο: το ξύλο φρενάρει το βλήμα με F, το βλήμα σπρώχνει το ξύλο με ίση F. Ίσες και αντίθετες." },
    { until: 6.5, label: "Μαζί", say: "ΑΔΟ: 8 = 1·V ⇒ V = 8 m/s. K μετά = ½·1·8² = 32 J ⇒ Q = 768 J (96 %)." },
    {
      until: 9,
      label: "F και Δt",
      say: "Η θερμότητα είναι έργο της F στο βάθος d (σχετική μετατόπιση): F = 768/0,0768 = 10⁴ N. Για το ξύλο: F·Δt = M·V ⇒ Δt = 7,68/10⁴ = 7,68·10⁻⁴ s. Το ξύλο μετακινήθηκε (V/2)·Δt ≈ 3,1 mm.",
    },
  ],
  Scene: bulletScene({ m: 0.04, M: 0.96, u: 200, uOut: 8, V: 8, through: false, Fn: "F = 10⁴ N (μέση)" }),
  solve: (
    <>
      V = 8/1 = <b>8 m/s</b>. Q = 800 − 32 = <b>768 J</b>. Q = F·d ⇒ F = 768/0,0768 = <b>10 000 N</b>. Δt = MV/F = 7,68/10⁴ = <b>7,68·10⁻⁴ s</b>. Μετατόπιση ξύλου = (0 + 8)/2·Δt ≈{" "}
      <b>3,1 mm</b>.
    </>
  ),
  trap: "Το βάθος d είναι ΣΧΕΤΙΚΗ μετατόπιση (βλήμα ως προς ξύλο), όχι η απόσταση που διάνυσε το βλήμα ως προς το έδαφος. Με το d δουλεύεις ενέργεια (Q = F·d), με τη Δp του ξύλου βρίσκεις το Δt.",
};

/* 68. Τριπολίτης: βλήμα 0,2 kg με 100 m/s διαπερνά ξύλο 5 kg χάνοντας 75 % της K του, Δt = 0,01 s. */
const case68: Case = {
  n: 68,
  title: "Βλήμα διαπερνά ξύλο",
  what: "Το βλήμα περνά μέσα από το ξύλο και βγαίνει από την άλλη μεριά, χάνοντας το 75 % της κινητικής του ενέργειας. Η ταχύτητα εξόδου βγαίνει από την ενέργεια, η ταχύτητα του ξύλου από την ΑΔΟ.",
  given: "Βλήμα m = 0,2 kg με 100 m/s, ξύλο M = 5 kg ακίνητο σε οριζόντιο επίπεδο. Το βλήμα χάνει το 75 % της K του. Διάρκεια διέλευσης Δt = 0,01 s.",
  ask: "α) υ′ του βλήματος. β) Ποσοστό της αρχικής ενέργειας του βλήματος που πήρε το ξύλο. γ) Δp του ξύλου. δ) Μέση δύναμη στο ξύλο.",
  period: 9,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2, label: "Πριν", say: "K = ½·0,2·100² = 1000 J, p = 20 kg·m/s." },
    { until: 4.5, label: "Διέλευση", say: "Όσο το βλήμα είναι μέσα: F στο βλήμα προς τα πίσω, ίση F στο ξύλο προς τα μπρος." },
    { until: 6.5, label: "Μετά", say: "α) Μένει 25 %: K′ = 250 J ⇒ υ′ = 50 m/s. ΑΔΟ: 20 = 5V + 0,2·50 ⇒ V = 2 m/s." },
    { until: 9, label: "Ενέργεια, F", say: "β) K_ξύλου = ½·5·2² = 10 J ⇒ 1 % των 1000 J (τα 740 J έγιναν θερμότητα). γ) Δp = 5·2 = 10 kg·m/s. δ) F = 10/0,01 = 1000 N." },
  ],
  Scene: bulletScene({ m: 0.2, M: 5, u: 100, uOut: 50, V: 2, through: true, Fn: "F = 1000 N (μέση)" }),
  solve: (
    <>
      α) <b>υ′ = 50 m/s</b>. ΑΔΟ ⇒ <b>V = 2 m/s</b>. β) 10 J / 1000 J = <b>1 %</b>. γ) <b>Δp = 10 kg·m/s</b>. δ) <b>F = 1000 N</b>.
    </>
  ),
  trap: "Το 75 % που χάνει το βλήμα δεν πάει όλο στο ξύλο: μόνο 10 J γίνονται κινητική του ξύλου, τα 740 J γίνονται θερμότητα.",
};

/* 69. Τριπολίτης: πλαστική κρούση με ακίνητο σώμα. Ποσοστό της K που γίνεται θερμότητα. */
const case69: Case = {
  n: 69,
  title: "Πόσο γίνεται θερμότητα",
  what: "Σώμα m χτυπά ακίνητο σώμα M και κολλάνε. Το ποσοστό της αρχικής κινητικής ενέργειας που γίνεται θερμότητα εξαρτάται μόνο από τις μάζες: M/(m + M).",
  given: "Ερώτημα 1: m₁ = m₂, το δεύτερο ακίνητο (επιλογές 0 %, 25 %, 50 %). Ερώτημα 2: m με ταχύτητα u, M = 3m ακίνητο.",
  ask: "Το ποσοστό σε θερμότητα, την κοινή ταχύτητα V και τη ΔK.",
  period: 8,
  legend: ["v", "p"],
  phases: [
    { until: 2, label: "Πριν", say: "Σώμα m με u, σώμα M = 3m ακίνητο. K_αρχ = ½mu²." },
    { until: 3.2, label: "Κρούση", say: "Κολλάνε. ΑΔΟ: mu = 4m·V ⇒ V = u/4. Η ολική ορμή δεν αλλάζει: Δp_ολ = 0." },
    { until: 5.5, label: "Μετά", say: "K_τελ = ½·4m·(u/4)² = mu²/8 = το 1/4 της αρχικής. ΔK = mu²/8 − 4mu²/8 = −3mu²/8: το 75 % έγινε θερμότητα." },
    { until: 8, label: "Γενικά", say: "Q/K_αρχ = M/(m + M). Με m = M: 1/2 ⇒ 50 % (σωστό το γ). Με M = 3m: 3/4 ⇒ 75 %." },
  ],
  Scene: ({ t }) => {
    const gy = 120;
    const k = seg(t, 2, 3.2);
    const xm = t < 2 ? lerp(30, 128, t / 2) : t < 3.2 ? 128 : 128 + 10 * (Math.min(t, 5.5) - 3.2);
    const xM = xm + 14 + 22;
    const v = t < 2 ? 1 : t < 3.2 ? lerp(1, 0.25, k) : 0.25;
    const Kafter = t < 3.2 ? 1 - 0.75 * k * (t >= 2 ? 1 : 0) : 0.25;
    return (
      <g>
        <Ground y={gy} />
        <Box cx={xm} y={gy} w={26} h={22} label="m" fill={C.b1} />
        <Box cx={t < 2 ? 164 : xM} y={gy} w={44} h={36} label="M = 3m" fill={C.b2} />
        <Vec x={xm - 8} y={gy - 36} dx={v * 50} label={t < 2 ? "u" : "V = u/4"} />
        <T x={64} y={150} s="K (πράσινο) και Q (πορτοκαλί)" size={9.5} color={C.muted} anchor="start" bold={false} />
        <rect x={64} y={158} width={240} height={16} rx={3} fill="#eceef2" />
        <rect x={64} y={158} width={240 * Kafter} height={16} rx={3} fill={C.p} />
        <rect x={64 + 240 * Kafter} y={158} width={240 * (1 - Kafter)} height={16} rx={3} fill={C.K} />
        <T x={64 + 120} y={192} s={t >= 3.2 ? "K = 25 %   ·   Q = 75 %" : "K = 100 %"} size={11} color={t >= 3.2 ? C.K : C.p} />
        <Panel x={220} y={8} w={134} h={74} title="τύπος">
          <T x={287} y={42} s="Q / K = M / (m + M)" size={10} color={C.K} />
          <T x={287} y={58} s={t >= 5.5 ? "m = M ⇒ 50 %" : "M = 3m ⇒ 3/4"} size={10} color={C.ink} />
          <T x={287} y={74} s={t >= 5.5 ? "M = 3m ⇒ 75 %" : "= 75 %"} size={10} color={C.ink} />
        </Panel>
      </g>
    );
  },
  solve: (
    <>
      Ερώτημα 1: Q/K = m₂/(m₁ + m₂) = <b>50 %</b> (γ). Ερώτημα 2: <b>V = u/4</b>, Δp_ολ = 0, ΔK = mu²/8 − mu²/2 = <b>−3mu²/8</b> ⇒ <b>75 %</b> σε θερμότητα.
    </>
  ),
  trap: "Στον τύπο Q/K = M/(m + M) στον αριθμητή είναι η μάζα του ΑΚΙΝΗΤΟΥ σώματος. Με ίσες μάζες δεν φαίνεται η διαφορά, με M = 3m φαίνεται.",
};

/* 70. Τριπολίτης: m₁ = 1 kg χτυπά τοίχο, χάνει 36 % της K, Δt = 0,1 s, F = 180 N· μετά κολλά με m₂ (1 kg) που έρχεται αντίθετα και σταματούν. */
const case70: Case = {
  n: 70,
  title: "Τοίχος, μετά πλαστική",
  what: "Μια μπάλα χτυπά τοίχο και χάνει το 36 % της κινητικής της ενέργειας. Από τη δύναμη του τοίχου βρίσκουμε τις ταχύτητες. Μετά συγκρούεται πλαστικά με σώμα που έρχεται αντίθετα, και το συσσωμάτωμα μένει ακίνητο.",
  given: "Λείο δάπεδο, m₁ = 1 kg. Στην κρούση με τον τοίχο χάνει 36 % της K, Δt = 0,1 s, μέση δύναμη τοίχου F = 180 N. Μετά πλαστική κρούση με m₂ που κινείται αντίθετα, και το συσσωμάτωμα ακινητοποιείται. (Τριπολίτης· εδώ m₂ = 1 kg.)",
  ask: "Τις ταχύτητες υ₁, υ₁′ και υ₂.",
  period: 10,
  legend: ["v", "F"],
  phases: [
    { until: 2, label: "Πριν", say: "Μένει το 64 % της K: ½m υ₁′² = 0,64·½m υ₁² ⇒ υ₁′ = 0,8·υ₁ (η ρίζα του 0,64)." },
    { until: 3.4, label: "Τοίχος", say: "Μόνο η μπάλα: δέχεται τη F = 180 N από τον τοίχο. Θετικά προς τον τοίχο: −F·Δt = m(−υ₁′ − υ₁) ⇒ 18 = 1·(υ₁ + 0,8υ₁) = 1,8υ₁." },
    { until: 6, label: "Πίσω", say: "υ₁ = 18/1,8 = 10 m/s και υ₁′ = 8 m/s. Η μπάλα γυρίζει και συναντά το m₂ που έρχεται αντίθετα." },
    { until: 7.2, label: "Κολλάνε", say: "Το συσσωμάτωμα μένει ακίνητο ⇒ p_ολ = 0: m₁υ₁′ = m₂υ₂ ⇒ υ₂ = 1·8/1 = 8 m/s." },
    { until: 10, label: "Τέλος", say: "Ακίνητα. Όλη η K των δύο σωμάτων (32 + 32 = 64 J) έγινε θερμότητα." },
  ],
  Scene: ({ t }) => {
    const y = 110;
    const wallX = 330;
    const r = 10;
    let bx: number;
    let vb: number;
    if (t < 2) {
      bx = lerp(180, wallX - r, t / 2);
      vb = 10;
    } else if (t < 3.4) {
      bx = wallX - r;
      vb = lerp(10, -8, seg(t, 2, 3.4));
    } else if (t < 6) {
      bx = wallX - r - 58 * seg(t, 3.4, 6);
      vb = -8;
    } else {
      bx = wallX - r - 58;
      vb = t < 7.2 ? lerp(-8, 0, seg(t, 6, 7.2)) : 0;
    }
    const m2x = t < 6 ? lerp(40, bx - r - 12, seg(t, 0, 6)) : bx - r - 12;
    const v2 = t < 6 ? 8 : t < 7.2 ? lerp(8, 0, seg(t, 6, 7.2)) : 0;
    const onWall = t >= 2 && t < 3.4;
    const Fnow = onWall ? 180 * pulse(seg(t, 2, 3.4)) : 0;
    return (
      <g>
        <Ground y={y + r + 2} x2={wallX} />
        <Wall x={wallX} y1={60} y2={y + r + 2} />
        <Box cx={m2x} y={y + r + 2} w={24} h={22} label="m₂" fill={C.b2} />
        {v2 > 0.3 ? <Vec x={m2x - 8} y={y - 22} dx={v2 * 3} label="υ₂" /> : null}
        <Ball cx={bx} cy={y} r={r} />
        {Math.abs(vb) > 0.3 ? <Vec x={vb > 0 ? bx - 6 - vb * 3 : bx - 4} y={y - 22} dx={vb * 3} label={vb > 0 ? "υ₁" : "υ₁′"} /> : null}
        <Tag x={14} y={22} s={onWall ? "επαφή με τον τοίχο: 0,1 s" : "κολλάνε"} color={C.F} show={onWall || (t >= 6 && t < 7.2)} />
        <Panel x={8} y={6} w={168} h={84}>
          <Ball cx={130} cy={56} r={11} />
          {onWall ? <Vec x={118} y={56} dx={-Fnow * 0.3} color={C.F} label="F" width={3.2} /> : null}
          <T x={14} y={34} s={t >= 3.4 ? "υ₁ = 10 m/s" : "υ₁′ = 0,8·υ₁"} size={10} color={C.ink} anchor="start" />
          <T x={14} y={52} s={t >= 3.4 ? "υ₁′ = 8 m/s" : "18 = 1,8·υ₁"} size={10} color={C.ink} anchor="start" />
          <T x={14} y={84} s={t >= 7.2 ? "υ₂ = 8 m/s" : "μέση F = 180 N"} size={10} color={t >= 7.2 ? C.p : C.F} anchor="start" />
        </Panel>
        <Bars
          y={152}
          max={10.5}
          items={[
            { label: "p₁", value: vb, color: C.p },
            { label: "p₂", value: v2, color: "#137a3f" },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      υ₁′ = 0,8υ₁. F·Δt = m(υ₁ + υ₁′) ⇒ 18 = 1,8υ₁ ⇒ <b>υ₁ = 10 m/s</b>, <b>υ₁′ = 8 m/s</b>. Ακίνητο συσσωμάτωμα: m₁υ₁′ = m₂υ₂ ⇒ <b>υ₂ = 8 m/s</b> (με m₂ = 1 kg).
    </>
  ),
  trap: "«Χάνει το 36 %» σημαίνει ότι ΜΕΝΕΙ το 64 % της K, άρα η ταχύτητα γίνεται √0,64 = 0,8 φορές, όχι 0,64 φορές. Και στον τοίχο η Δp έχει άθροισμα ταχυτήτων, γιατί αλλάζει φορά.",
};

/* 71. Τριπολίτης: 2 kg από 20 m, αναπηδά με 8 m/s, επαφή 0,1 s. */
const case71: Case = {
  n: 71,
  title: "Πέφτει από 20 m, αναπηδά",
  what: "Σώμα πέφτει από 20 m, χτυπά στο έδαφος και αναπηδά με 8 m/s. Ελέγχουμε αν η κρούση είναι ελαστική και βρίσκουμε τη μέση δύναμη του εδάφους. Το πιο εύκολο λάθος: το πρόσημο της ταχύτητας αναπήδησης.",
  given: "m = 2 kg, h = 20 m, αναπηδά με υ′ = 8 m/s, διάρκεια επαφής Δt = 0,1 s, g = 10 m/s².",
  ask: "i) Ελαστική ή όχι; ii) Τη μέση δύναμη του δαπέδου.",
  period: 8,
  legend: ["v", "F"],
  phases: [
    { until: 2, label: "Πτώση", say: "ΑΔΜΕ: mgh = ½mυ₁² ⇒ υ₁ = √(2·10·20) = 20 m/s. K πριν = ½·2·400 = 400 J." },
    { until: 3.4, label: "Επαφή", say: "Μόνο το σώμα: N προς τα πάνω, mg = 20 N προς τα κάτω. Θετικά προς τα κάτω (όπως ο Μιχάλης): υ₁ = +20, υ′ = −8 γιατί πάει πάνω." },
    { until: 5.5, label: "Αναπήδηση", say: "K μετά = ½·2·64 = 64 J ⇒ Q = 336 J ≠ 0: η κρούση είναι ανελαστική." },
    { until: 8, label: "Η N", say: "Δp = 2·(−8) − 2·20 = −56 kg·m/s. mg − N = Δp/Δt = −560 ⇒ N = 20 + 560 = 580 N, προς τα πάνω." },
  ],
  Scene: ({ t }) => {
    const gy = 180;
    const r = 11;
    const x = 80;
    let cy: number;
    let vDown: number;
    if (t < 2) {
      cy = 30 + (gy - r - 30) * (t / 2) * (t / 2);
      vDown = 20 * (t / 2);
    } else if (t < 3.4) {
      cy = gy - r + 2 * Math.sin(Math.PI * seg(t, 2, 3.4));
      vDown = lerp(20, -8, seg(t, 2, 3.4));
    } else {
      const u = Math.min(seg(t, 3.4, 5.5), 1);
      cy = gy - r - 50 * (2 * u - u * u);
      vDown = -8 * (1 - u);
    }
    const contact = t >= 2 && t < 3.4;
    const Nnow = contact ? 580 * pulse(seg(t, 2, 3.4)) : 0;
    return (
      <g>
        <Ground y={gy} x2={170} />
        <line x1={40} y1={30} x2={40} y2={gy} stroke={C.muted} strokeDasharray="3 3" />
        <T x={34} y={100} s="20 m" size={9.5} color={C.muted} anchor="end" bold={false} />
        <Ball cx={x} cy={cy} r={r} squash={contact ? 0.25 * Math.sin(Math.PI * seg(t, 2, 3.4)) : 0} axis="y" />
        {Math.abs(vDown) > 0.5 ? <Vec x={x + 28} y={cy} dx={0} dy={vDown * 2} label={`${num(Math.abs(vDown), 0)} m/s`} labelSide="right" /> : null}
        <T x={150} y={40} s="+ ↓" size={11} color={C.muted} />
        <Tag x={14} y={22} s="επαφή 0,1 s" color={C.F} show={contact} />
        <Panel x={196} y={10} w={158} h={150}>
          <Ball cx={234} cy={92} r={12} />
          {contact ? <Vec x={234} y={80} dx={0} dy={-Nnow * 0.08} color={C.F} label="N" width={3.4} labelSide="left" /> : null}
          <Vec x={234} y={104} dx={0} dy={18} color={C.F} label="mg" width={2.6} labelSide="left" />
          <T x={258} y={50} s="υ₁ = +20 m/s" size={9.5} color={C.v} anchor="start" />
          <T x={258} y={68} s={t >= 3.4 ? "υ′ = −8 m/s (πάνω)" : "υ′ = ;"} size={9.5} color={C.v} anchor="start" />
          <T x={258} y={88} s={t >= 3.4 ? "Q = 400 − 64" : ""} size={9.5} color={C.K} anchor="start" />
          <T x={258} y={104} s={t >= 3.4 ? "= 336 J" : ""} size={9.5} color={C.K} anchor="start" />
          <T x={258} y={124} s={t >= 5.5 ? "Δp = −56" : ""} size={9.5} color={C.p} anchor="start" />
          <T x={258} y={142} s={t >= 5.5 ? "N = 580 N" : ""} size={11} color={C.F} anchor="start" />
        </Panel>
      </g>
    );
  },
  solve: (
    <>
      i) υ₁ = 20 m/s, K: 400 J → 64 J, Q = 336 J ⇒ <b>ανελαστική</b>. ii) Θετικά ↓: Δp = 2(−8) − 2·20 = −56 kg·m/s ⇒ mg − N = −560 ⇒ <b>N = 580 N</b> προς τα πάνω.
    </>
  ),
  trap: "Η ταχύτητα αναπήδησης έχει ΑΝΤΙΘΕΤΟ πρόσημο από την ταχύτητα πρόσκρουσης. Αν τη βάλεις +8 με θετικά προς τα κάτω, βγαίνει λάθος (και αρνητική) δύναμη.",
};

/* 72. Τριπολίτης 4.107: m₁ = 1 kg με 10 m/s χτυπά ακίνητο m₂ = 2 kg· το 1 σταματά. */
const D72: Duo = { mA: 1, mB: 2, u: 10, vA: 0, vB: 5, wA: 26, wB: 34, labelA: "1", labelB: "2" };
const case72: Case = {
  n: 72,
  title: "4.107: το 1 σταματά",
  what: "Το σώμα 1 χτυπά το ακίνητο σώμα 2 και μένει ακίνητο. Η ΑΔΟ δίνει την ταχύτητα του 2, και η σύγκριση των κινητικών ενεργειών δείχνει αν η κρούση είναι ελαστική.",
  given: "m₁ = 1 kg με υ₀ = 10 m/s, m₂ = 2 kg ακίνητο. Μετά την κρούση το 1 σταματά.",
  ask: "α) Την ταχύτητα του 2. β) Τη θερμότητα Q. Είναι ελαστική;",
  period: 7.5,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2, label: "Πριν", say: "p_ολ = 1·10 = 10 kg·m/s, K = ½·1·100 = 50 J." },
    { until: 3.2, label: "Κρούση", say: "Ίσες και αντίθετες δυνάμεις επαφής: Δp₁ = −10, Δp₂ = +10 kg·m/s." },
    { until: 5.2, label: "Μετά", say: "ΑΔΟ: 10 = 1·0 + 2·υ₂′ ⇒ υ₂′ = 5 m/s." },
    { until: 7.5, label: "Ενέργεια", say: "K μετά = ½·2·25 = 25 J. Q = 50 − 25 = 25 J ≠ 0 ⇒ η κρούση ΔΕΝ είναι ελαστική." },
  ],
  Scene: ({ t }) => {
    const gy = 112;
    const m = duoMotion(D72, t);
    const Cn = m.contact ? pulse(m.k) : 0;
    return (
      <g>
        <Ground y={gy} />
        <Box cx={m.xA} y={gy} w={D72.wA} h={24} label="1" fill={C.b1} />
        <Box cx={m.xB} y={gy} w={D72.wB} h={28} label="2" fill={C.b2} />
        {m.vA > 0.3 ? <Vec x={m.xA - 10} y={gy - 34} dx={m.vA * 3} label="υ₁" /> : null}
        {m.vB > 0.3 ? <Vec x={m.xB - 8} y={gy - 38} dx={m.vB * 3} label="υ₂′" /> : null}
        <Tag x={14} y={22} s="αργή κίνηση" color={C.F} show={m.contact} />
        <Panel x={196} y={6} w={158} h={72} title="κάθε σώμα χωριστά">
          <Box cx={240} y={52} w={22} h={20} label="1" fill={C.b1} />
          <Box cx={310} y={52} w={26} h={20} label="2" fill={C.b2} />
          {m.contact ? (
            <g>
              <Vec x={229} y={42} dx={-Cn * 22} color={C.F} label="C" width={3} />
              <Vec x={323} y={42} dx={Cn * 22} color={C.F} label="C" width={3} />
            </g>
          ) : null}
          <T x={275} y={71} s={t >= 5.2 ? "Q = 50 − 25 = 25 J" : "Δp₁ = −Δp₂"} size={9.5} color={t >= 5.2 ? C.K : C.p} />
        </Panel>
        <Bars
          y={140}
          max={10.5}
          items={[
            { label: "p₁", value: D72.mA * m.vA, color: C.p },
            { label: "p₂", value: D72.mB * m.vB, color: "#137a3f" },
            { label: "p_{ολ}", value: 10, color: C.ink },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      α) ΑΔΟ: 1·10 = 2·υ₂′ ⇒ <b>υ₂′ = 5 m/s</b>. β) Q = 50 − 25 = <b>25 J</b> ⇒ όχι ελαστική.
    </>
  ),
  trap: "Στο Q αφαιρείς ΟΛΕΣ τις κινητικές μετά (εδώ μόνο του 2, γιατί το 1 σταμάτησε), όχι μόνο ενός σώματος.",
};

export const section10: Case[] = [case54, case55, case56, case57, case58, case59, case60, case61, case62, case63, case64, case65, case66, case67, case68, case69, case70, case71, case72];
