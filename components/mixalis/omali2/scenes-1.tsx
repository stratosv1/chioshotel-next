"use client";

import { Ball, Bars, C, T, Tag, lerp, num, seg } from "@/components/mixalis/ormi/kit";
import { Along, ArcPath, K, Orbit, P, Panel, Radius, inward, tang, type OCase } from "./kit2";

/* Shared layout for the "circle on the left, read-outs on the right" scenes. */
const CX = 100;
const CY = 92;
const R = 62;

/* ───────── 1. Επιτρόχια συνισταμένη ───────── */
const case1: OCase = {
  n: 1,
  title: "Επιτρόχια συνισταμένη",
  what: "Ένα σώμα κάνει κύκλο και ταυτόχρονα τρέχει όλο και πιο γρήγορα. Δείχνει ποια δύναμη αλλάζει το μέτρο της ταχύτητας και ποια την κατεύθυνσή της.",
  given: "m = 2 kg, R = 10 m. Η ταχύτητα αυξάνεται ομαλά από 2 m/s σε 8 m/s μέσα σε Δt = 3 s.",
  ask: "Την επιτρόχια συνισταμένη ΣF_ε και την κεντρομόλο δύναμη F_κ στο τέλος των 3 s.",
  period: 9.6,
  legend: ["v", "F"],
  phases: [
    {
      until: 3.2,
      label: "Επιταχύνει",
      say: "Η ΣF_ε έχει τη διεύθυνση της ταχύτητας (εφαπτομένη). Σπρώχνει «μπροστά», γι' αυτό το μπλε βέλος της υ μεγαλώνει: από 2 σε 8 m/s.",
    },
    {
      until: 6.4,
      label: "Και η κεντρομόλος",
      say: "Την ίδια ώρα υπάρχει και δύναμη προς το κέντρο, F_κ = mυ²/R. Αυτή στρίβει το σώμα. Επειδή η υ μεγαλώνει, η F_κ μεγαλώνει πολύ πιο γρήγορα (με το τετράγωνο).",
    },
    {
      until: 9.6,
      label: "Η συνολική",
      say: "Στο τέλος: ΣF_ε = 4 N κατά μήκος της τροχιάς και F_κ = 12,8 N προς το κέντρο. Η συνολική δύναμη είναι το διανυσματικό τους άθροισμα και δεν δείχνει στο κέντρο.",
    },
  ],
  Scene: ({ t }) => {
    const tp = t < 3.2 ? Math.min(t, 3) : t < 6.4 ? Math.min(t - 3.2, 3) : 3;
    const s = 2 * tp + tp * tp; // m
    const v = 2 + 2 * tp;
    const th = -1.75 + s / 10;
    const [x, y] = P(CX, CY, R, th);
    const u = tang(th);
    const n = inward(th);
    const Fk = (2 * v * v) / 10;
    const showK = t >= 3.2;
    const showSum = t >= 6.4;
    const k = 5; // px per N
    return (
      <g>
        <Orbit cx={CX} cy={CY} r={R} />
        <ArcPath cx={CX} cy={CY} r={R} a0={-1.75} a1={th} color={C.v} width={2} opacity={0.35} />
        <Ball cx={x} cy={y} r={7} />
        <Along x={x} y={y} u={u} len={v * 5} color={K.v} label="υ" />
        <Along x={x - n[0] * 15} y={y - n[1] * 15} u={u} len={4 * k} color={K.F} label="ΣF_ε" width={3} labelSide="left" />
        {showK ? <Along x={x} y={y} u={n} len={Fk * k} color={K.F} label="F_κ" width={3} labelSide="below" /> : null}
        {showSum ? (
          <g opacity={seg(t, 6.4, 7)}>
            <line x1={x + n[0] * Fk * k} y1={y + n[1] * Fk * k} x2={x + n[0] * Fk * k + u[0] * 4 * k} y2={y + n[1] * Fk * k + u[1] * 4 * k} stroke={K.F} strokeDasharray="3 3" />
            <Along x={x} y={y} u={[n[0] * Fk + u[0] * 4, n[1] * Fk + u[1] * 4].map((c) => c / Math.hypot(Fk, 4)) as [number, number]} len={Math.hypot(Fk, 4) * k} color="#8f1d16" label="ΣF" width={3.4} labelSide="right" />
          </g>
        ) : null}
        <Panel
          x={196}
          y={14}
          w={156}
          lines={showSum ? ["Στο τέλος (t = 3 s)", "α_ε = Δυ/Δt = 2 m/s²", "ΣF_ε = m·α_ε = 4 N", "F_κ = 2·8²/10 = 12,8 N", "ΣF = √(4² + 12,8²) ≈ 13,4 N"] : ["Τώρα", `t = ${num(tp, 1)} s`, `υ = ${num(v, 1)} m/s`, "ΣF_ε = 4 N (σταθερή)"]}
        />
        <Bars
          y={166}
          max={14}
          unit="N"
          title="δυνάμεις"
          items={[
            { label: "ΣF_ε", value: 4, color: K.F },
            { label: "F_κ", value: showK ? Fk : 0, color: K.F },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      α_ε = Δυ/Δt = (8 − 2)/3 = 2 m/s², άρα <b>ΣF_ε = m·α_ε = 2·2 = 4 N</b>. Στο τέλος: <b>F_κ = mυ²/R = 2·8²/10 = 12,8 N</b>. Η συνολική δύναμη είναι
      √(4² + 12,8²) ≈ 13,4 N.
    </>
  ),
  trap: "Το μέτρο της ταχύτητας το αλλάζει μόνο η επιτρόχια ΣF_ε. Η κεντρομόλος είναι κάθετη στην υ, άρα μόνο στρίβει το σώμα.",
};

/* ───────── 2. Περίοδος και συχνότητα ───────── */
const case2: OCase = {
  n: 2,
  title: "Περίοδος και συχνότητα",
  what: "Ένα σώμα κάνει κύκλους με σταθερό ρυθμό και μετράμε πόσους γύρους κάνει. Δείχνει τι είναι η περίοδος T, η συχνότητα f και πώς βγαίνουν από αυτές η υ και η α_κ.",
  given: "R = 2 m. Το σώμα κάνει N = 5 πλήρεις γύρους σε t = 10 s, με σταθερή ταχύτητα.",
  ask: "Την περίοδο T, τη συχνότητα f, το μέτρο της ταχύτητας υ και την κεντρομόλο επιτάχυνση α_κ.",
  period: 12,
  legend: ["v", "a"],
  phases: [
    {
      until: 5,
      label: "Μετράμε γύρους",
      say: "Το ρολόι μετρά 10 s και ο μετρητής 5 γύρους (το σχέδιο τρέχει 2 φορές πιο γρήγορα). Περίοδος T = χρόνος ενός γύρου = t/N.",
    },
    {
      until: 8.5,
      label: "Ένας γύρος",
      say: "Σε μία περίοδο T = 2 s το σώμα διανύει όλη την περιφέρεια, 2πR. Άρα υ = 2πR/T. Η συχνότητα είναι γύροι ανά δευτερόλεπτο: f = 1/T = 0,5 Hz.",
    },
    {
      until: 12,
      label: "υ και α_κ",
      say: "Με την περίοδο βρίσκουμε τα πάντα: υ = 2πR/T ≈ 6,28 m/s και α_κ = υ²/R = 4π²R/T² ≈ 19,7 m/s², πάντα προς το κέντρο.",
    },
  ],
  Scene: ({ t }) => {
    const Tper = 2;
    let tp: number; // physical seconds
    if (t < 5) tp = 2 * t;
    else if (t < 8.5) tp = Math.min(Tper, ((t - 5) / 3) * Tper);
    else tp = t - 8.5;
    const th = -Math.PI / 2 + (2 * Math.PI * tp) / Tper;
    const [x, y] = P(CX, CY, R, th);
    const laps = t < 5 ? Math.min(5, Math.floor(tp / Tper + 1e-6)) : t < 8.5 ? (tp >= Tper - 1e-3 ? 1 : 0) : 0;
    const phase2 = t >= 5 && t < 8.5;
    const phase3 = t >= 8.5;
    return (
      <g>
        <Orbit cx={CX} cy={CY} r={R} />
        <Radius cx={CX} cy={CY} x={CX} y={CY + R} label="R" />
        {phase2 ? <ArcPath cx={CX} cy={CY} r={R} a0={-Math.PI / 2} a1={th} color={C.v} width={3} opacity={0.5} /> : null}
        <Ball cx={x} cy={y} r={7} />
        {phase3 ? (
          <g>
            <Along x={x} y={y} u={tang(th)} len={6.28 * 5} color={K.v} label="υ" />
            <Along x={x} y={y} u={inward(th)} len={19.7 * 2} color={K.a} label="α_κ" labelSide="below" />
          </g>
        ) : null}
        <Tag x={12} y={22} s="γρήγορα ×2" color={C.muted} show={t < 5} />
        <Panel
          x={196}
          y={14}
          w={156}
          lines={
            t < 5
              ? ["Μέτρηση", `ρολόι: ${num(Math.min(tp, 10), 1)} s`, `γύροι: ${laps}`]
              : phase2
                ? ["Ένας γύρος", "T = t/N = 10/5 = 2 s", "f = 1/T = 0,5 Hz", "διαδρομή: 2πR ≈ 12,6 m"]
                : ["Από την περίοδο", "υ = 2πR/T ≈ 6,28 m/s", "α_κ = 4π²R/T²", "     ≈ 19,7 m/s²"]
          }
        />
        <Bars
          y={166}
          max={20}
          unit=""
          title="μεγέθη"
          items={[
            { label: "υ", value: phase3 ? 6.28 : 0, color: K.v, unit: "m/s" },
            { label: "α_κ", value: phase3 ? 19.74 : 0, color: K.a, unit: "m/s²" },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      <b>T = t/N = 10/5 = 2 s</b>, <b>f = 1/T = 0,5 Hz</b>. <b>υ = 2πR/T = 2π·2/2 = 2π ≈ 6,28 m/s</b>. <b>α_κ = 4π²R/T² = 4π²·2/4 = 2π² ≈ 19,7 m/s²</b>.
    </>
  ),
  trap: "Το T εδώ είναι περίοδος (σε s), όχι τάση νήματος. Και η f μετριέται σε Hz = γύροι ανά δευτερόλεπτο, όχι σε rad/s.",
};

/* ───────── 3. Ομαλή κυκλική κίνηση ───────── */
const case3: OCase = {
  n: 3,
  title: "Ομαλή κυκλική κίνηση",
  what: "Ένα σώμα γυρίζει με σταθερή ταχύτητα. Το βέλος της υ έχει πάντα το ίδιο μήκος, αλλά γυρίζει. Δείχνει γιατί υπάρχει επιτάχυνση χωρίς να αλλάζει το μέτρο της ταχύτητας.",
  given: "m = 0,2 kg, R = 0,5 m, υ = 2 m/s (σταθερό μέτρο).",
  ask: "Την κεντρομόλο επιτάχυνση α_κ, την κεντρομόλο δύναμη F_κ και την περίοδο T.",
  period: 11,
  legend: ["v", "a"],
  phases: [
    {
      until: 4,
      label: "Ίδιο μέτρο",
      say: "Τα αχνά βέλη είναι η υ σε προηγούμενες στιγμές. Όλα έχουν το ίδιο μήκος (2 m/s) αλλά άλλη κατεύθυνση: η ταχύτητα ως διάνυσμα αλλάζει συνέχεια.",
    },
    {
      until: 8,
      label: "Πού δείχνει η Δυ",
      say: "Παίρνουμε δύο κοντινές στιγμές και κάνουμε Δυ = υ₂ − υ₁ (πράσινο, δεξιά). Όσο οι στιγμές πλησιάζουν, η Δυ δείχνει όλο και πιο ακριβώς προς το κέντρο.",
    },
    {
      until: 11,
      label: "α_κ προς το κέντρο",
      say: "Αφού α = Δυ/Δt, η επιτάχυνση δείχνει πάντα προς το κέντρο: κεντρομόλος, α_κ = υ²/R = 8 m/s². Για να υπάρχει, χρειάζεται δύναμη F_κ = m·α_κ = 1,6 N προς το κέντρο.",
    },
  ],
  Scene: ({ t }) => {
    const omega = 0.5 * 4; // 4 rad/s shown at half speed
    if (t >= 4 && t < 8) {
      const dth = lerp(1.1, 0.25, seg(t, 4.3, 7.3));
      const thm = Math.PI / 2;
      const a1 = thm - dth / 2;
      const a2 = thm + dth / 2;
      const [x1, y1] = P(CX, CY, R, a1);
      const [x2, y2] = P(CX, CY, R, a2);
      const L = 44;
      const u1 = tang(a1);
      const u2 = tang(a2);
      const ox = 270;
      const oy = 120;
      const dvx = (u2[0] - u1[0]) * L;
      const dvy = (u2[1] - u1[1]) * L;
      return (
        <g>
          <Orbit cx={CX} cy={CY} r={R} />
          <Ball cx={x1} cy={y1} r={6} />
          <Ball cx={x2} cy={y2} r={6} />
          <Along x={x1} y={y1} u={u1} len={L} color={K.v} label="υ₁" labelSide="above" />
          <Along x={x2} y={y2} u={u2} len={L} color={K.v} label="υ₂" labelSide="below" />
          <T x={ox} y={30} s="υ₂ = υ₁ + Δυ" size={10.5} color={C.ink} />
          <Along x={ox + 30} y={oy - 40} u={u1} len={L} color={K.v} label="υ₁" labelSide="above" />
          <Along x={ox + 30} y={oy - 40} u={u2} len={L} color={K.v} label="υ₂" labelSide="below" opacity={0.6} />
          <line x1={ox + 30 + u1[0] * L} y1={oy - 40 + u1[1] * L} x2={ox + 30 + u2[0] * L} y2={oy - 40 + u2[1] * L} stroke={K.a} strokeWidth={2.6} />
          <circle cx={ox + 30 + u2[0] * L} cy={oy - 40 + u2[1] * L} r={2.6} fill={K.a} />
          <T x={ox + 30 + u1[0] * L - 6} y={oy - 40 + (u1[1] * L + u2[1] * L) / 2 + 10} s="Δυ" size={11} color={K.a} italic anchor="end" />
          <Along x={CX} y={CY - R + 12} u={[dvx, dvy].map((c) => c / Math.hypot(dvx, dvy)) as [number, number]} len={26} color={K.a} label="Δυ" labelSide="right" />
          <T x={ox} y={oy + 34} s={`Δθ = ${num((dth * 180) / Math.PI, 0)}°`} size={10.5} color={C.muted} />
        </g>
      );
    }
    const tt = t < 4 ? t : t - 8 + 4;
    const th = -Math.PI / 2 + omega * tt;
    const [x, y] = P(CX, CY, R, th);
    const ghosts = t < 4 ? [1, 2, 3, 4, 5].map((i) => th - i * 0.75).filter((a) => a > -Math.PI / 2) : [];
    return (
      <g>
        <Orbit cx={CX} cy={CY} r={R} />
        {ghosts.map((a) => {
          const [gx, gy] = P(CX, CY, R, a);
          return <Along key={a} x={gx} y={gy} u={tang(a)} len={40} color={K.v} opacity={0.25} />;
        })}
        <Ball cx={x} cy={y} r={7} />
        <Along x={x} y={y} u={tang(th)} len={40} color={K.v} label="υ" />
        {t >= 8 ? <Along x={x} y={y} u={inward(th)} len={36} color={K.a} label="α_κ" labelSide="below" /> : null}
        <Tag x={12} y={22} s="αργή κίνηση ×½" color={C.muted} />
        <Panel
          x={196}
          y={14}
          w={156}
          lines={t < 4 ? ["Σταθερό μέτρο", "|υ| = 2 m/s πάντα", "κατεύθυνση: αλλάζει"] : ["Κεντρομόλος", "α_κ = υ²/R = 4/0,5 = 8 m/s²", "F_κ = m·α_κ = 1,6 N", "T = 2πR/υ ≈ 1,57 s"]}
        />
      </g>
    );
  },
  solve: (
    <>
      <b>α_κ = υ²/R = 2²/0,5 = 8 m/s²</b>, <b>F_κ = m·α_κ = 0,2·8 = 1,6 N</b>, <b>T = 2πR/υ = 2π·0,5/2 = π/2 ≈ 1,57 s</b>.
    </>
  ),
  trap: "«Ομαλή» σημαίνει σταθερό μέτρο υ, όχι σταθερή ταχύτητα. Η ταχύτητα (διάνυσμα) αλλάζει, άρα υπάρχει επιτάχυνση και δύναμη.",
};

/* ───────── 4. Μη ομαλή κυκλική: α_κ και α_ε ───────── */
const case4: OCase = {
  n: 4,
  title: "Μεταβαλλόμενη ταχύτητα",
  what: "Το σώμα κάνει κύκλο και επιταχύνει. Τώρα η επιτάχυνση έχει δύο κομμάτια: ένα προς το κέντρο και ένα κατά μήκος της τροχιάς.",
  given: "R = 4 m. Τη στιγμή που κοιτάμε: υ = 4 m/s και η υ αυξάνεται με ρυθμό α_ε = 3 m/s².",
  ask: "Την κεντρομόλο α_κ και το μέτρο της ολικής επιτάχυνσης α εκείνη τη στιγμή.",
  period: 10,
  legend: ["v", "a"],
  phases: [
    {
      until: 3.5,
      label: "Επιταχύνει",
      say: "Η υ μεγαλώνει από 1 σε 4 m/s (αργή κίνηση). Η α_ε (κατά μήκος της τροχιάς) μένει 3 m/s², ενώ η α_κ = υ²/R μεγαλώνει μαζί με την υ.",
    },
    {
      until: 7,
      label: "Η ολική α",
      say: "Τη στιγμή που υ = 4 m/s: α_κ = 16/4 = 4 m/s² και α_ε = 3 m/s². Είναι κάθετες, οπότε α = √(4² + 3²) = 5 m/s². Δεν δείχνει στο κέντρο, γέρνει προς τα μπροστά.",
    },
    {
      until: 10,
      label: "Αν γίνει ομαλή",
      say: "Αν η υ σταματήσει να αυξάνεται, α_ε = 0 και μένει μόνο η α_κ: η ολική επιτάχυνση ξαναδείχνει ακριβώς στο κέντρο (ομαλή κυκλική).",
    },
  ],
  Scene: ({ t }) => {
    const sc = 10; // px per m/s²
    let tp: number;
    if (t < 3.5) tp = Math.min(1, t / 3.3);
    else tp = 1;
    const v = 1 + 3 * tp;
    const s = tp + 1.5 * tp * tp;
    const th = -1.2 + s / 4 + (t >= 7 ? (v / 4) * (t - 7) * 0.6 : 0);
    const ae = t < 7 ? 3 : 3 * (1 - seg(t, 7.3, 9));
    const ak = (v * v) / 4;
    const [x, y] = P(CX, CY, R, th);
    const u = tang(th);
    const n = inward(th);
    const showTot = t >= 3.5;
    const ax = n[0] * ak + u[0] * ae;
    const ay = n[1] * ak + u[1] * ae;
    const amag = Math.hypot(ak, ae);
    return (
      <g>
        <Orbit cx={CX} cy={CY} r={R} />
        <Ball cx={x} cy={y} r={7} />
        <Along x={x - n[0] * 14} y={y - n[1] * 14} u={u} len={v * 8} color={K.v} label="υ" labelSide="right" />
        <Along x={x} y={y} u={n} len={ak * sc} color={K.a} label="α_κ" labelSide="below" />
        <Along x={x} y={y} u={u} len={ae * sc} color={K.a} label={ae > 0.2 ? "α_ε" : undefined} dashed labelSide="left" />
        {showTot ? (
          <g opacity={seg(t, 3.5, 4.2)}>
            <line x1={x + n[0] * ak * sc} y1={y + n[1] * ak * sc} x2={x + ax * sc} y2={y + ay * sc} stroke={K.a} strokeDasharray="3 3" />
            <line x1={x + u[0] * ae * sc} y1={y + u[1] * ae * sc} x2={x + ax * sc} y2={y + ay * sc} stroke={K.a} strokeDasharray="3 3" />
            <Along x={x} y={y} u={[ax / amag, ay / amag]} len={amag * sc} color="#0f6b39" label="α" width={3.4} labelSide="right" />
          </g>
        ) : null}
        <Panel
          x={196}
          y={14}
          w={156}
          lines={
            t < 3.5
              ? ["Τώρα", `υ = ${num(v, 1)} m/s`, `α_κ = υ²/R = ${num(ak, 1)} m/s²`, "α_ε = 3 m/s²"]
              : t < 7
                ? ["Όταν υ = 4 m/s", "α_κ = 4²/4 = 4 m/s²", "α_ε = 3 m/s²", "α = √(4² + 3²) = 5 m/s²"]
                : ["Ομαλή πια", `α_ε = ${num(ae, 1)} m/s²`, `α = ${num(amag, 1)} m/s²`, "προς το κέντρο"]
          }
        />
        <Bars
          y={166}
          max={6}
          unit="m/s²"
          title="επιταχύνσεις"
          items={[
            { label: "α_κ", value: ak, color: K.a },
            { label: "α_ε", value: ae, color: K.a },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      <b>α_κ = υ²/R = 4²/4 = 4 m/s²</b>. Οι α_κ και α_ε είναι κάθετες: <b>α = √(α<sub>κ</sub>² + α<sub>ε</sub>²) = √(16 + 9) = 5 m/s²</b>.
    </>
  ),
  trap: "Μην προσθέτεις α_κ + α_ε = 7. Είναι κάθετες, άρα Πυθαγόρειο. Και η α_ε δεν αλλάζει την κατεύθυνση, μόνο το μέτρο της υ.",
};

/* ───────── 5. Γωνιακή ταχύτητα ───────── */
const case5: OCase = {
  n: 5,
  title: "Γωνιακή ταχύτητα",
  what: "Ένας δίσκος γυρίζει. Δύο σημεία του, ένα στην άκρη (Α) και ένα στη μέση της ακτίνας (Β), σαρώνουν την ίδια γωνία, αλλά το Α διανύει διπλάσια απόσταση.",
  given: "Δίσκος ακτίνας R = 0,3 m κάνει 2 στροφές το δευτερόλεπτο (f = 2 Hz). Το Β απέχει R/2 = 0,15 m από τον άξονα.",
  ask: "Τη γωνιακή ταχύτητα ω, τις ταχύτητες υ_Α, υ_Β και την κεντρομόλο επιτάχυνση του Α.",
  period: 11,
  legend: ["v", "a"],
  phases: [
    {
      until: 4,
      label: "Ίδια γωνία",
      say: "Το Α και το Β είναι πάνω στην ίδια ακτίνα, άρα σε κάθε Δt σαρώνουν την ίδια γωνία Δθ. Γι' αυτό έχουν το ίδιο ω = Δθ/Δt = 2πf.",
    },
    {
      until: 8,
      label: "Άλλη ταχύτητα",
      say: "Στον ίδιο χρόνο το Α γράφει διπλάσιο τόξο από το Β, γιατί είναι διπλάσια μακριά. Άρα υ = ω·R: υ_Α = 2·υ_Β.",
    },
    {
      until: 11,
      label: "Οι τύποι",
      say: "ω = 2π·2 = 4π ≈ 12,6 rad/s. υ_Α = ωR ≈ 3,77 m/s, υ_Β ≈ 1,88 m/s. α_κ = ω²R ≈ 47,4 m/s² για το Α: όσο πιο έξω, τόσο μεγαλύτερη.",
    },
  ],
  Scene: ({ t }) => {
    const slowOmega = (2 * Math.PI) / 4; // shown: one turn per 4 s
    const start = t < 4 ? 0 : t < 8 ? 4 : 8;
    const th = -0.3 + slowOmega * (t - start);
    const [ax, ay] = P(CX, CY, R, th);
    const [bx, by] = P(CX, CY, R / 2, th);
    return (
      <g>
        <circle cx={CX} cy={CY} r={R + 4} fill="#eef1f6" stroke={C.edge} strokeWidth={1.2} />
        <circle cx={CX} cy={CY} r={2.6} fill={C.ink} />
        <line x1={CX} y1={CY} x2={ax} y2={ay} stroke={C.edge} strokeWidth={1.6} />
        <path d={`M ${CX} ${CY} L ${P(CX, CY, 26, -0.3)[0]} ${P(CX, CY, 26, -0.3)[1]}`} stroke={C.faint} strokeDasharray="3 3" />
        {t < 4 ? <ArcPath cx={CX} cy={CY} r={22} a0={-0.3} a1={th} color={C.ink} width={1.6} /> : null}
        {t < 4 ? <T x={CX + 30} y={CY - 26} s="Δθ" size={11} color={C.ink} italic /> : null}
        {t >= 4 && t < 8 ? (
          <g>
            <ArcPath cx={CX} cy={CY} r={R} a0={-0.3} a1={th} color={K.v} width={3} opacity={0.5} />
            <ArcPath cx={CX} cy={CY} r={R / 2} a0={-0.3} a1={th} color={K.v} width={3} opacity={0.5} />
          </g>
        ) : null}
        <Ball cx={ax} cy={ay} r={6} fill={C.b2} label="Α" />
        <Ball cx={bx} cy={by} r={6} fill={C.b2} label="Β" />
        {t >= 4 ? (
          <g>
            <Along x={ax} y={ay} u={tang(th)} len={3.77 * 10} color={K.v} label="υ_Α" />
            <Along x={bx} y={by} u={tang(th)} len={1.885 * 10} color={K.v} label="υ_Β" labelSide="left" />
          </g>
        ) : null}
        {t >= 8 ? <Along x={ax} y={ay} u={inward(th)} len={30} color={K.a} label="α_κ" labelSide="below" /> : null}
        <Tag x={12} y={22} s="αργή κίνηση" color={C.muted} />
        <Panel
          x={196}
          y={14}
          w={156}
          lines={
            t < 4
              ? ["Ίδιο ω για όλα", "ω = Δθ/Δt = 2πf", "ω = 4π ≈ 12,6 rad/s"]
              : t < 8
                ? ["υ = ω·R", "υ_Α = 4π·0,3 ≈ 3,77 m/s", "υ_Β = 4π·0,15 ≈ 1,88 m/s"]
                : ["Κεντρομόλος", "α_κ = ω²·R", "α_Α = 16π²·0,3 ≈ 47,4 m/s²", "α_Β = α_Α/2 ≈ 23,7 m/s²"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      <b>ω = 2πf = 4π ≈ 12,6 rad/s</b> (ίδιο για Α και Β). <b>υ_Α = ωR = 4π·0,3 ≈ 3,77 m/s</b>, <b>υ_Β = 4π·0,15 ≈ 1,88 m/s</b>.{" "}
      <b>α_κ,Α = ω²R = 16π²·0,3 ≈ 47,4 m/s²</b>.
    </>
  ),
  trap: "Σημεία του ίδιου δίσκου έχουν ίδιο ω, όχι ίδια υ. Αντίθετα, δύο τροχοί που συνδέονται με ιμάντα έχουν ίδια υ στην περιφέρεια, όχι ίδιο ω.",
};

export const section1 = [case1, case2, case3, case4, case5];
