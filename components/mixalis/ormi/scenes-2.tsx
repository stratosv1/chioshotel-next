"use client";

import { Ball, Bars, Box, Burst, C, Cart, Ground, MiniGraph, StickPerson, T, Tag, Vec, Wall, bump, clamp, lerp, num, seg, type Case } from "./kit";
import { CollisionScene } from "./collide";

/* ═════════════ ΕΝΟΤΗΤΑ 2 · Δύναμη και ρυθμός μεταβολής ορμής ═════════════ */

/* 6. 2ος νόμος με ορμή: m = 2 kg, υ1 = 1 m/s, ΣF = 4 N για 2 s → υ2 = 5 m/s */
const case6: Case = {
  n: 6,
  title: "2ος νόμος με ορμή",
  period: 7,
  legend: ["v", "F", "p"],
  phases: [
    { until: 1.2, label: "Πριν", say: "Το σώμα (2 kg) γλιστράει σε λείο δάπεδο με υ₁ = 1 m/s. Δεν ασκείται δύναμη, άρα η ορμή του μένει p = 2 kg·m/s." },
    {
      until: 4.2,
      label: "ΣF για Δt = 2 s",
      say: "Τώρα ασκούμε ΣF = 4 N. Σε κάθε δευτερόλεπτο η ορμή μεγαλώνει κατά 4 kg·m/s. Αυτό σημαίνει ΣF = Δp/Δt: η δύναμη είναι ο ρυθμός που αλλάζει η ορμή.",
    },
    { until: 7, label: "Μετά", say: "Η δύναμη σταμάτησε: η ορμή έμεινε 2 + 8 = 10 kg·m/s, άρα υ₂ = 10/2 = 5 m/s." },
  ],
  Scene: ({ t }) => {
    const f = 1.5; // anim seconds per physical second
    const S = 18; // px per metre
    const phys = t / f;
    const tA = 1.2 / f;
    let s: number;
    let v: number;
    if (t < 1.2) {
      s = phys;
      v = 1;
    } else if (t < 4.2) {
      const tau = phys - tA;
      s = tA + tau + tau * tau; // a = 2 m/s²
      v = 1 + 2 * tau;
    } else {
      const tau = phys - tA - 2;
      s = tA + 6 + 5 * tau;
      v = 5;
    }
    const x = 40 + S * s;
    const pushing = t >= 1.2 && t < 4.2;
    const dp = clamp((phys - tA) * 4, 0, 8);
    return (
      <g>
        <Ground y={110} />
        <Box cx={x} y={110} w={36} h={28} label="m" />
        <Vec x={x + 18} y={74} dx={v * 10} label="υ" />
        {pushing ? <Vec x={x - 18 - 44} y={96} dx={42} color={C.F} label="ΣF = 4 N" width={3.4} labelSide="above" /> : null}
        <Tag x={14} y={24} s={`Δt μέχρι τώρα: ${num(clamp(phys - tA, 0, 2))} s`} color={C.F} show={t >= 1.2} />
        <Bars
          y={150}
          max={11}
          title="ορμή και μεταβολή της"
          items={[
            { label: "p", value: 2 * v },
            { label: "Δp", value: dp },
            { label: "ΣF·Δt", value: dp, color: C.F, unit: "N·s" },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      Δp = ΣF·Δt = 4·2 = <b>8 kg·m/s</b>. Άρα mυ₂ = mυ₁ + 8 ⇒ 2υ₂ = 2 + 8 ⇒ <b>υ₂ = 5 m/s</b>.
    </>
  ),
  trap: "Στον τύπο μπαίνει η συνισταμένη ΣF. Αν υπάρχει τριβή, γράφεις ΣF = F − T, όχι σκέτο F.",
};

/* 7. Μέση δύναμη στην κρούση: τένις 0,1 kg, 20 → −12 m/s, Δt = 0,02 s */
const case7: Case = {
  n: 7,
  title: "Μέση δύναμη στην κρούση",
  period: 8,
  legend: ["v", "F"],
  phases: [
    { until: 1.5, label: "Πριν", say: "Το μπαλάκι (0,1 kg) πλησιάζει τον τοίχο με 20 m/s. Πάνω δεξιά θα σχεδιαστεί πώς αλλάζει η δύναμη του τοίχου." },
    {
      until: 4.5,
      label: "Επαφή 0,02 s",
      say: "Η δύναμη δεν είναι σταθερή: ξεκινά από μηδέν, γίνεται μέγιστη όταν το μπαλάκι ζουλιέται περισσότερο και ξαναμηδενίζεται.",
    },
    {
      until: 8,
      label: "Μέση δύναμη",
      say: "Μέση δύναμη F_μ είναι η σταθερή δύναμη που θα έδινε την ίδια Δp στον ίδιο χρόνο: F_μ = Δp/Δt = 160 N. Και το μπαλάκι σπρώχνει τον τοίχο με αντίθετη δύναμη (3ος νόμος).",
    },
  ],
  Scene: ({ t }) => {
    const wallX = 330;
    const r = 11;
    const y = 150;
    const hit = wallX - r;
    const k = seg(t, 1.5, 4.5);
    let x: number;
    let v: number;
    if (t < 1.5) {
      x = lerp(40, hit, t / 1.5);
      v = 20;
    } else if (t < 4.5) {
      x = hit;
      // velocity follows the integral of a half-sine force
      v = 20 - 32 * ((1 - Math.cos(Math.PI * k)) / 2);
    } else {
      x = hit - ((hit - 40) / 1.5) * 0.6 * (t - 4.5);
      v = -12;
    }
    const Fmax = (160 * Math.PI) / 2; // half-sine with mean 160 N
    const Fnow = t > 1.5 && t < 4.5 ? Fmax * Math.sin(Math.PI * k) : 0;
    const squash = 0.35 * (Fnow / Fmax);
    const gx = 34;
    const gw = 230;
    return (
      <g>
        <Ground y={y + r} x2={wallX} />
        <Wall x={wallX} y1={110} y2={y + r} />
        <Ball cx={x + squash * r} cy={y} r={r} squash={squash} />
        <Vec x={v > 0 ? Math.min(x, wallX - 8 - v * 3.5) : x} y={y - 22} dx={v * 3.5} label={v > 0 ? "υ" : "υ′"} />
        <Vec x={wallX - 2} y={y} dx={-(Fnow / Fmax) * 70} color={C.F} label="F" width={3.4} labelSide="below" />
        <Vec x={wallX + 2} y={y - 6} dx={(Fnow / Fmax) * 24} color={C.F} width={2.4} opacity={0.7} />
        <MiniGraph
          x={gx}
          y={18}
          w={gw}
          h={74}
          tMax={1}
          yMin={0}
          yMax={Fmax * 1.1}
          fn={(u) => Fmax * Math.sin(Math.PI * u)}
          tNow={t < 1.5 ? 0 : k}
          color={C.F}
          fillArea
          xLabel="t"
          yLabel="F (N)"
        />
        {t > 4.5 ? (
          <g opacity={seg(t, 4.5, 5.2)}>
            <line x1={gx} y1={18 + 74 - (160 / (Fmax * 1.1)) * 74} x2={gx + gw} y2={18 + 74 - (160 / (Fmax * 1.1)) * 74} stroke={C.F} strokeDasharray="5 4" strokeWidth={1.6} />
            <T x={gx + gw - 2} y={14 + 74 - (160 / (Fmax * 1.1)) * 74} s="F_μ = 160 N" size={10} color={C.F} anchor="end" />
            <T x={gx + gw / 2} y={106} s="εμβαδόν = Δp = 3,2 N·s" size={10} color={C.F} />
          </g>
        ) : (
          <T x={gx + gw / 2} y={106} s={`F τώρα: ${num(Fnow, 0)} N`} size={10} color={C.F} />
        )}
      </g>
    );
  },
  solve: (
    <>
      |Δp| = m(υ + υ′) = 0,1·32 = 3,2 kg·m/s ⇒ F_μ = |Δp|/Δt = 3,2/0,02 = <b>160 N</b>. Η μπάλα ασκεί στον τοίχο 160 N προς τα δεξιά.
    </>
  ),
  trap: "Η μέγιστη δύναμη είναι μεγαλύτερη από τη μέση. Ο τύπος Δp/Δt δίνει πάντα τη μέση.",
};

/* 8. Διάγραμμα F–t: τρίγωνο 0 → 20 N → 0 σε 2 s, m = 2 kg από ηρεμία */
const triF = (tau: number) => (tau <= 0 ? 0 : tau < 1 ? 20 * tau : tau < 2 ? 20 * (2 - tau) : 0);
const triV = (tau: number) => {
  if (tau <= 0) return 0;
  if (tau < 1) return 5 * tau * tau;
  if (tau < 2) {
    const u = tau - 1;
    return 5 + 10 * u - 5 * u * u;
  }
  return 10;
};
const triS = (tau: number) => {
  if (tau <= 0) return 0;
  if (tau < 1) return (5 * tau ** 3) / 3;
  if (tau < 2) {
    const u = tau - 1;
    return 5 / 3 + 5 * u + 5 * u * u - (5 * u ** 3) / 3;
  }
  return 10 + 10 * (tau - 2);
};
const case8: Case = {
  n: 8,
  title: "Διάγραμμα F – t",
  period: 7,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2, label: "F αυξάνεται", say: "Η δύναμη μεγαλώνει από 0 σε 20 N. Το σκιασμένο εμβαδόν κάτω από τη γραμμή μεγαλώνει, και μαζί του η ορμή." },
    { until: 4, label: "F μειώνεται", say: "Η δύναμη μικραίνει, αλλά είναι ακόμα θετική: η ορμή συνεχίζει να αυξάνεται, πιο αργά." },
    { until: 7, label: "Αποτέλεσμα", say: "Εμβαδόν τριγώνου = ½·2·20 = 20 N·s = Δp. Αφού ξεκίνησε από ηρεμία: p = 20 kg·m/s, άρα υ = 10 m/s." },
  ],
  Scene: ({ t }) => {
    const tau = Math.min(t / 2, 2 + (t - 4) / 2);
    const phys = t < 4 ? t / 2 : 2 + (t - 4) / 2;
    const x = 40 + 9 * triS(phys);
    const F = triF(phys);
    const v = triV(phys);
    return (
      <g>
        <MiniGraph x={36} y={16} w={260} h={70} tMax={2} yMin={0} yMax={22} fn={triF} tNow={Math.min(tau, 2)} color={C.F} fillArea yLabel="F (N)" />
        <T x={170} y={104} s={`εμβαδόν μέχρι τώρα = ${num(2 * triV(Math.min(phys, 2)), 1)} N·s`} size={10} color={C.F} />
        <Ground y={150} />
        <Box cx={x} y={150} w={34} h={26} label="m" />
        <Vec x={x - 17 - (F / 20) * 50} y={138} dx={(F / 20) * 50} color={C.F} label="F" width={3.2} labelSide="below" />
        <Vec x={x + 17} y={118} dx={v * 5} label="υ" />
        <Bars y={170} max={22} items={[{ label: "p", value: 2 * v }]} />
      </g>
    );
  },
  solve: (
    <>
      Δp = εμβαδόν = ½·2 s·20 N = <b>20 kg·m/s</b>. Από ηρεμία: 2υ = 20 ⇒ <b>υ = 10 m/s</b>. Μέση δύναμη: F_μ = 20/2 = 10 N.
    </>
  ),
  trap: "Το εμβαδόν κάτω από τον άξονα t (αρνητική F) αφαιρείται.",
};

/* 9. Διάγραμμα p–t: m = 1 kg. +3 N (0–2 s), 0 (2–4 s), −3,5 N (4–6 s) */
const pT = (tau: number) => (tau < 2 ? 1 + 3 * tau : tau < 4 ? 7 : Math.max(0, 7 - 3.5 * (tau - 4)));
const sT = (tau: number) =>
  tau < 2 ? tau + 1.5 * tau * tau : tau < 4 ? 8 + 7 * (tau - 2) : 22 + 7 * (tau - 4) - 1.75 * (tau - 4) ** 2;
const case9: Case = {
  n: 9,
  title: "Διάγραμμα p – t",
  period: 7.5,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2, label: "ΣF = +3 N", say: "Σταθερή ΣF = 3 N: η ορμή αυξάνεται ομαλά. Η γραφική p–t είναι ευθεία με κλίση 3 kg·m/s² = ΣF." },
    { until: 4, label: "ΣF = 0", say: "Καμία δύναμη: η ορμή μένει σταθερή και η γραμμή γίνεται οριζόντια. Κλίση 0 ⇒ ΣF = 0." },
    { until: 6, label: "ΣF = −3,5 N", say: "Φρενάρει: η κλίση είναι αρνητική, −3,5 N. Σε 2 s η ορμή πέφτει από 7 σε 0." },
    { until: 7.5, label: "Κανόνας", say: "Θυμήσου: κλίση p–t = ΣF. Όσο πιο απότομη η γραμμή, τόσο μεγαλύτερη η δύναμη." },
  ],
  Scene: ({ t }) => {
    const tau = Math.min(t, 6);
    const F = tau < 2 ? 3 : tau < 4 ? 0 : tau < 6 ? -3.5 : 0;
    const x = 30 + 9.4 * sT(tau);
    const p = pT(tau);
    const slope = tau < 2 ? "κλίση = +3" : tau < 4 ? "κλίση = 0" : "κλίση = −3,5";
    return (
      <g>
        <MiniGraph x={36} y={16} w={270} h={78} tMax={6} yMin={0} yMax={8} fn={pT} tNow={tau} color={C.p} yLabel="p (kg·m/s)" />
        <T x={300} y={30} s={slope} size={11} color={C.F} anchor="end" />
        <Ground y={160} />
        <Box cx={x} y={160} w={30} h={24} label="m" />
        <Vec x={x + 15} y={128} dx={p * 7} label="υ" />
        {F !== 0 ? <Vec x={F > 0 ? x - 15 - F * 12 : x - 15} y={150} dx={F * 12} color={C.F} label="ΣF" width={3} labelSide="above" /> : null}
        <T x={180} y={196} s={`p = ${num(p, 1)} kg·m/s · ΣF = ${num(F, 1)} N`} size={11} color={C.ink} />
      </g>
    );
  },
  solve: (
    <>
      ΣF = Δp/Δt: (7 − 1)/2 = <b>3 N</b>, (7 − 7)/2 = <b>0</b>, (0 − 7)/2 = <b>−3,5 N</b>.
    </>
  ),
  trap: "Οριζόντια γραμμή στο p–t δεν σημαίνει ότι το σώμα σταμάτησε. Σημαίνει ΣF = 0 (σταθερή ταχύτητα).",
};

/* 10. Ελεύθερη πτώση: m = 1 kg, 2 s */
const case10: Case = {
  n: 10,
  title: "Ελεύθερη πτώση",
  period: 6,
  legend: ["v", "F", "p"],
  phases: [
    { until: 4, label: "Πέφτει", say: "Η μόνη δύναμη είναι το βάρος mg = 10 N και είναι σταθερή. Άρα σε κάθε δευτερόλεπτο η ορμή αυξάνεται κατά 10 kg·m/s." },
    { until: 6, label: "Συμπέρασμα", say: "Το p–t είναι ευθεία με κλίση mg. Σε Δt = 2 s: Δp = mg·Δt = 20 kg·m/s, προς τα κάτω." },
  ],
  Scene: ({ t }) => {
    const phys = Math.min(t / 2, 2);
    const y = 24 + 7.5 * 5 * phys * phys;
    const v = 10 * phys;
    return (
      <g>
        <Ground y={186} x1={20} x2={140} />
        <Ball cx={70} cy={Math.min(y, 176)} r={10} />
        {t < 4 ? (
          <g>
            <Vec x={70} y={y + 2} dx={0} dy={34} color={C.F} label="mg" width={3.2} />
            <Vec x={104} y={y - 10} dx={0} dy={v * 3.2} label="υ" />
          </g>
        ) : null}
        <MiniGraph x={176} y={30} w={150} h={120} tMax={2} yMin={0} yMax={22} fn={(u) => 10 * u} tNow={phys} color={C.p} yLabel="p (kg·m/s), ↓ θετικά" />
        <T x={250} y={186} s={`p = ${num(10 * phys, 1)} kg·m/s, Δp/Δt = 10 N`} size={10.5} color={C.p} />
      </g>
    );
  },
  solve: (
    <>
      Δp/Δt = ΣF = mg = 1·10 = <b>10 kg·m/s²</b> σε κάθε στιγμή. Σε 2 s: Δp = mgΔt = <b>20 kg·m/s</b> προς τα κάτω.
    </>
  ),
  trap: "Ο ρυθμός μεταβολής της ορμής δεν εξαρτάται από την ταχύτητα. Είναι mg από την αρχή ως το τέλος.",
};

/* ═════════════ ΕΝΟΤΗΤΑ 3 · Σύστημα σωμάτων — ΑΔΟ ═════════════ */

/* 11. Εσωτερικές δυνάμεις: μαγνήτης 1 kg, σίδερο 2 kg, F = 2 N */
const case11: Case = {
  n: 11,
  title: "Εσωτερικές δυνάμεις",
  period: 6.5,
  legend: ["v", "F", "p"],
  phases: [
    {
      until: 3,
      label: "Έλξη",
      say: "Ο μαγνήτης τραβά το σίδερο και το σίδερο τραβά τον μαγνήτη, με ίσες και αντίθετες δυνάμεις (3ος νόμος). Αυτές είναι εσωτερικές δυνάμεις.",
    },
    { until: 3.6, label: "Κολλάνε", say: "Μόλις πριν ακουμπήσουν: p₁ = +2 και p₂ = −2 kg·m/s. Οι ορμές μεγάλωναν πάντα αντίθετα, γι' αυτό η ολική έμενε μηδέν." },
    { until: 6.5, label: "Σταματούν", say: "Κόλλησαν και σταμάτησαν! Οι εσωτερικές δυνάμεις αλλάζουν τις ορμές των σωμάτων, όχι την ορμή του συστήματος." },
  ],
  Scene: ({ t }) => {
    const f = 3; // anim per phys second, attraction lasts 1 s
    const tau = Math.min(t / f, 1);
    const S = 80; // the 120 px gap closes exactly at τ = 1 s
    const x1 = 120 + S * tau * tau; // a1 = 2 → s1 = τ²
    const x2 = 240 - S * 0.5 * tau * tau; // a2 = 1
    const stuck = t >= 3.6;
    const v1 = stuck ? 0 : 2 * tau;
    const v2 = stuck ? 0 : -tau;
    const pulling = t < 3;
    const gy = 104;
    return (
      <g>
        <Ground y={gy} />
        <Cart cx={x1 - 23 + 0} y={gy} w={46} label="μαγνήτης" fill="#e4b0ad" />
        <Cart cx={x2 + 23} y={gy} w={46} label="σίδερο" fill={C.b1} />
        {pulling ? (
          <g>
            <Vec x={x1 - 2} y={gy - 34} dx={30} color={C.F} label="F_{21}" width={3.2} />
            <Vec x={x2 + 2} y={gy - 34} dx={-30} color={C.F} label="F_{12}" width={3.2} />
          </g>
        ) : null}
        <Vec x={x1 - 46} y={gy - 50} dx={v1 * 16} label="υ_1" />
        <Vec x={x2 + 46} y={gy - 50} dx={v2 * 16} label="υ_2" />
        <T x={180} y={22} s="m_1 = 1 kg · m_2 = 2 kg · λείο δάπεδο" size={10} color={C.muted} bold={false} />
        <Bars
          y={138}
          max={2.4}
          items={[
            { label: "p_1", value: 1 * v1 },
            { label: "p_2", value: 2 * v2 },
            { label: "p_{ολ}", value: v1 + 2 * v2, color: C.ink },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      Σε κάθε στιγμή F₁₂ = −F₂₁ ⇒ Δp₁ = −Δp₂. Εδώ p₁ = +2 και p₂ = −2 kg·m/s λίγο πριν κολλήσουν: <b>p_ολ = 0</b> πάντα.
    </>
  ),
  trap: "Οι F₁₂ και F₂₁ δεν «αλληλοαναιρούνται» στο ίδιο σώμα. Ασκούνται σε διαφορετικά σώματα.",
};

/* 12. ΑΔΟ: m1 = 2 kg, 3 m/s → ακίνητο m2 = 1 kg (ελαστική): 1 και 4 m/s */
const case12: Case = {
  n: 12,
  title: "Αρχή διατήρησης ορμής",
  period: 6,
  legend: ["v", "F", "p"],
  phases: [
    {
      until: 2,
      label: "Πριν",
      say: "Παίρνουμε τα δύο αμαξάκια ως ένα σύστημα. Τα βάρη τους ισορροπούν με τις κάθετες δυνάμεις, άρα ΣF_εξ = 0: το σύστημα είναι μονωμένο.",
    },
    { until: 2.7, label: "Κρούση", say: "Στην κρούση εμφανίζονται μόνο εσωτερικές δυνάμεις F και −F. Η μαύρη ράβδος, η ολική ορμή, δεν κουνιέται." },
    { until: 6, label: "Μετά", say: "Οι ταχύτητες άλλαξαν, όμως p_ολ = 6 kg·m/s πριν και μετά. Αυτή είναι η ΑΔΟ: p_ολ,πριν = p_ολ,μετά." },
  ],
  Scene: ({ t }) => (
    <CollisionScene
      t={t}
      c={{ m1: 2, m2: 1, u1: 3, u2: 0, v1: 1, v2: 4, tc: 2, dc: 0.7, S: 18, X: 160, widths: [38, 30], system: true }}
      extra={
        <g opacity={0.55}>
          <T x={330} y={30} s="B ↓  N ↑" size={9.5} color={C.F} anchor="end" />
        </g>
      }
    />
  ),
  solve: (
    <>
      {"p_{ολ,πριν}"} = 2·3 + 1·0 = 6 kg·m/s. {"p_{ολ,μετά}"} = 2·1 + 1·4 = 6 kg·m/s. <b>Ίδια</b>, όπως λέει η ΑΔΟ.
    </>
  ),
  trap: "Η ΑΔΟ ισχύει όταν ΣF_εξ = 0 ή όταν η κρούση διαρκεί ελάχιστα. Με τριβή, ισχύει μόνο τη στιγμή της κρούσης.",
};

/* 13. Παγοδρόμοι: 60 kg και 40 kg, ακίνητοι, σπρώχνονται: 2 m/s και 3 m/s */
const case13: Case = {
  n: 13,
  title: "Δύο παγοδρόμοι",
  period: 6,
  legend: ["v", "F", "p"],
  phases: [
    { until: 1.4, label: "Ακίνητοι", say: "Δύο παγοδρόμοι (60 kg και 40 kg) στέκονται ακίνητοι στον πάγο. Η ολική ορμή είναι μηδέν." },
    { until: 2.4, label: "Σπρώχνονται", say: "Σπρώχνει ο ένας τον άλλον. Ίσες και αντίθετες δυνάμεις, για τον ίδιο χρόνο ⇒ ίσες και αντίθετες ορμές." },
    { until: 6, label: "Μετά", say: "Ο ελαφρύτερος φεύγει πιο γρήγορα: 3 m/s έναντι 2 m/s. Ίσες ορμές 120 kg·m/s, αντίθετη φορά, άθροισμα 0." },
  ],
  Scene: ({ t }) => {
    const gy = 112;
    const k = seg(t, 1.4, 2.4);
    const after = Math.max(0, t - 2.4);
    const v1 = -2 * k;
    const v2 = 3 * k;
    const x1 = 160 - 15 * after * 2 - 6 * k * k;
    const x2 = 198 + 15 * after * 3 + 9 * k * k;
    const F = bump(t, 1.4, 2.4);
    return (
      <g>
        <rect x={6} y={gy} width={348} height={8} fill="#dbeefa" />
        <Ground y={gy} />
        <StickPerson x={x1} y={gy} scale={1.25} />
        <StickPerson x={x2} y={gy} scale={1} />
        <T x={x1} y={gy - 52} s="60 kg" size={10} color={C.muted} />
        <T x={x2} y={gy - 44} s="40 kg" size={10} color={C.muted} />
        {F > 0.05 ? (
          <g>
            <Vec x={x2 - 8} y={gy - 26} dx={F * 34} color={C.F} label="F" width={3} />
            <Vec x={x1 + 8} y={gy - 30} dx={-F * 34} color={C.F} label="−F" width={3} labelSide="above" />
          </g>
        ) : null}
        <Vec x={x1 - 12} y={gy - 64} dx={v1 * 14} label="υ_1" />
        <Vec x={x2 + 12} y={gy - 64} dx={v2 * 14} label="υ_2" />
        <Bars
          y={140}
          max={140}
          items={[
            { label: "p_1", value: 60 * v1 },
            { label: "p_2", value: 40 * v2 },
            { label: "p_{ολ}", value: 60 * v1 + 40 * v2, color: C.ink },
            { label: "K_1 / K_2", value: k > 0.99 ? 120 : 0, color: C.K, unit: k > 0.99 ? "J / 180 J" : "J" },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      0 = m₁υ₁ − m₂υ₂ ⇒ 60·2 = 40·3. Κινητικές: K₁ = 120 J, K₂ = 180 J ⇒ <b>K₁/K₂ = m₂/m₁ = 2/3</b>.
    </>
  ),
  trap: "Ίσες ορμές δεν σημαίνει ίσες ταχύτητες. Το ελαφρύτερο σώμα φεύγει πιο γρήγορα και παίρνει περισσότερη K.",
};

/* 14. Άνθρωπος πηδά από βάρκα: 60 kg, 3 m/s · βάρκα 180 kg → 1 m/s */
const case14: Case = {
  n: 14,
  title: "Άνθρωπος πηδά από βάρκα",
  period: 6,
  legend: ["v", "p"],
  phases: [
    { until: 1.4, label: "Ακίνητοι", say: "Ο νεαρός (60 kg) στέκεται σε ακίνητη βάρκα (180 kg). Στον οριζόντιο άξονα το νερό δεν σπρώχνει (λείο), άρα ισχύει ΑΔΟ." },
    { until: 2.6, label: "Πήδημα", say: "Για να φύγει μπροστά, σπρώχνει τη βάρκα προς τα πίσω. Η βάρκα σπρώχνει αυτόν προς τα μπροστά." },
    { until: 6, label: "Μετά", say: "Αυτός φεύγει με 3 m/s, η βάρκα πάει πίσω με 1 m/s. 60·3 = 180·1: ίσες ορμές, αντίθετες." },
  ],
  Scene: ({ t }) => {
    const wy = 128;
    const k = seg(t, 1.4, 2.6);
    const after = Math.max(0, t - 1.4);
    const boatX = 150 - 19 * after;
    const manX = 176 + 57 * Math.min(after, 2.4);
    const jumpY = t > 1.4 ? -Math.max(0, 60 * Math.sin(Math.min(1, after / 2.4) * Math.PI)) : 0;
    const landed = after >= 2.4;
    const manY = landed ? 100 : wy - 10 + jumpY;
    return (
      <g>
        <path d={`M 6 ${wy} Q 30 ${wy - 5} 54 ${wy} T 102 ${wy} T 150 ${wy} T 198 ${wy} T 246 ${wy} T 280 ${wy}`} fill="none" stroke={C.water} strokeWidth={2} />
        <rect x={6} y={wy} width={274} height={60} fill={C.water} opacity={0.18} />
        <rect x={280} y={100} width={74} height={88} fill="#d8cbb8" stroke={C.edge} />
        <T x={318} y={118} s="προβλήτα" size={9.5} color={C.muted} bold={false} />
        <path d={`M ${boatX - 50} ${wy - 12} L ${boatX + 50} ${wy - 12} L ${boatX + 38} ${wy + 6} L ${boatX - 38} ${wy + 6} Z`} fill={C.wood} stroke={C.edge} />
        <StickPerson x={Math.min(manX, 300)} y={manY} />
        <Vec x={Math.min(manX, 300) + 8} y={manY - 48} dx={t > 1.4 && !landed ? 3 * 12 : 0} label="υ = 3" />
        <Vec x={boatX - 10} y={wy + 26} dx={t > 1.4 ? -12 : 0} label="V = 1" labelSide="below" />
        <Bars
          y={170}
          w={268}
          max={200}
          items={[
            { label: "p_{άνθρ}", value: t > 1.4 ? 180 * Math.min(1, k * 1.5) : 0 },
            { label: "p_{βάρκ}", value: t > 1.4 ? -180 * Math.min(1, k * 1.5) : 0 },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      0 = mυ − MV ⇒ V = mυ/M = 60·3/180 = <b>1 m/s</b>, αντίθετα από τον άνθρωπο.
    </>
  ),
  trap: "Οι ταχύτητες μετριούνται ως προς την ακτή (ακίνητο έδαφος), όχι ως προς τη βάρκα.",
};

/* 15. Ανάκρουση όπλου: M = 2000 kg, m = 10 kg, υ = 500 m/s → V = 2,5 m/s */
const case15: Case = {
  n: 15,
  title: "Ανάκρουση όπλου",
  period: 6,
  legend: ["v", "p"],
  phases: [
    { until: 1.2, label: "Πριν", say: "Πυροβόλο 2000 kg και βλήμα 10 kg, όλα ακίνητα. Ολική ορμή μηδέν." },
    { until: 1.8, label: "Έκρηξη", say: "Τα αέρια της πυρίτιδας σπρώχνουν το βλήμα μπροστά και το πυροβόλο πίσω. Είναι εσωτερικές δυνάμεις." },
    { until: 6, label: "Ανάκρουση", say: "Το βλήμα φεύγει με 500 m/s, το πυροβόλο κινείται πίσω με μόλις 2,5 m/s. Ίσες ορμές 5000 kg·m/s, πολύ διαφορετικές ταχύτητες!" },
  ],
  Scene: ({ t }) => {
    const gy = 110;
    const fired = t > 1.2;
    const after = Math.max(0, t - 1.2);
    const cx = 150 - 8 * after;
    const bx = 196 + 900 * after;
    return (
      <g>
        <Ground y={gy} />
        <g transform={`translate(${cx},0)`}>
          <rect x={-46} y={gy - 30} width={70} height={22} rx={4} fill="#6b7280" stroke={C.edge} />
          <rect x={10} y={gy - 34} width={44} height={10} rx={3} fill="#4b5563" transform={`rotate(-4 10 ${gy - 30})`} />
          <circle cx={-26} cy={gy - 8} r={8} fill="#ffffff" stroke={C.edge} strokeWidth={1.4} />
          <circle cx={6} cy={gy - 8} r={8} fill="#ffffff" stroke={C.edge} strokeWidth={1.4} />
          <T x={-12} y={gy - 15} s="M" size={11} color="#ffffff" italic />
        </g>
        <Burst cx={cx + 56} cy={gy - 30} k={seg(t, 1.2, 1.8)} />
        {fired && bx < 360 ? <Ball cx={bx} cy={gy - 32} r={5} fill="#3b3f46" /> : null}
        {!fired ? <Ball cx={cx + 40} cy={gy - 32} r={4} fill="#3b3f46" /> : null}
        {fired ? (
          <g>
            <Vec x={250} y={gy - 54} dx={80} label="υ = 500 m/s (βλήμα)" />
            <Vec x={cx - 48} y={gy - 44} dx={-14} label="V = 2,5 m/s" labelSide="above" />
          </g>
        ) : null}
        <Bars
          y={138}
          max={5500}
          items={[
            { label: "p_{βλ}", value: fired ? 5000 : 0 },
            { label: "p_{όπλ}", value: fired ? -5000 : 0 },
            { label: "p_{ολ}", value: 0, color: C.ink },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      0 = mυ − MV ⇒ V = mυ/M = 10·500/2000 = <b>2,5 m/s</b>, αντίθετα από το βλήμα.
    </>
  ),
  trap: "Το βλήμα παίρνει σχεδόν όλη την κινητική ενέργεια: K_βλ = 1.250.000 J, K_όπλ = 6.250 J.",
};

export const section2: Case[] = [case6, case7, case8, case9, case10];
export const section3: Case[] = [case11, case12, case13, case14, case15];
