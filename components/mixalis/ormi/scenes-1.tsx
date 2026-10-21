"use client";

import { Ball, Bars, Box, C, Ground, T, Tag, Vec, Wall, bump, lerp, seg, type Case } from "./kit";

/* ───────── 1. Ορμή σώματος ───────── */
const case1: Case = {
  n: 1,
  what: "Δύο κουτιά γλιστράνε δίπλα δίπλα με την ίδια ταχύτητα, το ένα με διπλάσια μάζα. Δείχνει ότι η ορμή είναι βέλος (p = m·υ) που μεγαλώνει με τη μάζα και γυρίζει όταν γυρίσει η κίνηση.",
  title: "Ορμή σώματος",
  period: 8,
  legend: ["v", "p"],
  phases: [
    {
      until: 4,
      label: "Προς τα δεξιά",
      say: "Δύο σώματα τρέχουν με την ίδια ταχύτητα υ = 3 m/s. Το κάτω έχει διπλάσια μάζα, άρα και διπλάσια ορμή: p = m·υ.",
    },
    {
      until: 8,
      label: "Προς τα αριστερά",
      say: "Τώρα γύρισαν. Η ορμή είναι διάνυσμα, οπότε γύρισε κι αυτή. Με θετική φορά προς τα δεξιά, τη γράφουμε με «−».",
    },
  ],
  Scene: ({ t }) => {
    const right = t < 4;
    const x = right ? lerp(70, 270, t / 4) : lerp(270, 70, (t - 4) / 4);
    const s = right ? 1 : -1;
    const lanes = [
      { y: 62, m: 2, label: "m = 2 kg", w: 30, fill: C.b1 },
      { y: 128, m: 4, label: "2m = 4 kg", w: 44, fill: C.b2 },
    ];
    return (
      <g>
        {lanes.map((l) => (
          <g key={l.y}>
            <Ground y={l.y} />
            <Box cx={x} y={l.y} w={l.w} h={24} fill={l.fill} />
            <T x={x} y={l.y - 8} s={l.label.split(" = ")[0]} size={10.5} italic />
            <Vec x={x + (s * l.w) / 2} y={l.y - 12} dx={s * 36} label="υ" />
            <Vec x={x} y={l.y - 34} dx={s * l.m * 3 * 5} color={C.p} label="p" width={3.2} />
          </g>
        ))}
        <Bars
          y={150}
          max={14}
          title="ορμή (θετική φορά →)"
          items={[
            { label: "p_{2kg}", value: s * 6, color: C.p },
            { label: "p_{4kg}", value: s * 12, color: C.p },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      p = 2·3 = <b>6 kg·m/s</b> και p = 4·3 = <b>12 kg·m/s</b>. Όταν κινούνται αριστερά: p = −6 και p = −12 kg·m/s.
    </>
  ),
  trap: "Η ορμή δεν είναι «δύναμη που έχει το σώμα». Είναι μάζα × ταχύτητα και έχει την κατεύθυνση της ταχύτητας.",
};

/* ───────── 2. Ορμή και κινητική ενέργεια ───────── */
const case2: Case = {
  n: 2,
  what: "Ένα ελαφρύ γρήγορο και ένα βαρύ αργό κουτί, με την ίδια κινητική ενέργεια. Δείχνει ότι ίδια K δεν σημαίνει ίδια ορμή.",
  title: "Ορμή και κινητική ενέργεια",
  period: 8,
  legend: ["v", "p", "K"],
  phases: [
    {
      until: 4,
      label: "Ίδια K",
      say: "Το ελαφρύ (1 kg) τρέχει με 4 m/s, το βαρύ (4 kg) με 2 m/s. Μέτρησε: και τα δύο έχουν κινητική ενέργεια 8 J.",
    },
    {
      until: 8,
      label: "Άλλη ορμή",
      say: "Η ορμή όμως του βαρύτερου είναι διπλάσια! Από K = p²/2m βγαίνει p = √(2mK): ίδια K, μεγαλύτερη μάζα ⇒ μεγαλύτερη ορμή.",
    },
  ],
  Scene: ({ t }) => {
    const lanes = [
      { y: 58, m: 1, v: 4, w: 26, fill: C.b1, name: "m" },
      { y: 118, m: 4, v: 2, w: 46, fill: C.b2, name: "4m" },
    ];
    return (
      <g>
        {lanes.map((l) => {
          const x = 40 + ((l.v * 18 * t) % 280);
          const op = Math.min(1, (x - 40) / 18, (320 - x) / 18);
          return (
            <g key={l.y}>
              <Ground y={l.y} />
              <g opacity={Math.max(0, op)}>
                <Box cx={x} y={l.y} w={l.w} h={22} fill={l.fill} label={l.name} />
                <Vec x={x + l.w / 2} y={l.y - 11} dx={l.v * 9} label={`υ = ${l.v}`} />
                <Vec x={x - l.w / 2} y={l.y - 30} dx={l.m * l.v * 5} color={C.p} label="p" width={3.2} />
              </g>
            </g>
          );
        })}
        <Bars
          y={140}
          max={10}
          title="μέτρα"
          items={[
            { label: "K_{1kg}", value: 8, color: C.K, unit: "J" },
            { label: "K_{4kg}", value: 8, color: C.K, unit: "J" },
            { label: "p_{1kg}", value: 4 },
            { label: "p_{4kg}", value: 8 },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      K = ½·1·4² = 8 J και K = ½·4·2² = 8 J. Ορμές: p = √(2·1·8) = <b>4</b> και p = √(2·4·8) = <b>8 kg·m/s</b>.
    </>
  ),
  trap: "Ίδια κινητική ενέργεια δεν σημαίνει ίδια ορμή (και ανάποδα). Πάντα πέρνα από τον τύπο K = p²/2m.",
};

/* ───────── 3. Κάθετη κρούση σε τοίχο ───────── */
const case3: Case = {
  n: 3,
  what: "Μια μπάλα χτυπά κάθετα έναν τοίχο και γυρίζει πίσω πιο αργά. Δείχνει γιατί η μεταβολή της ορμής είναι μεγάλη όταν το σώμα αλλάζει φορά.",
  title: "Κάθετη κρούση σε τοίχο",
  period: 8.5,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2.2, label: "Πριν", say: "Η μπάλα (0,1 kg) πάει προς τον τοίχο με υ = 20 m/s. Παίρνουμε θετική φορά προς τα δεξιά, άρα p = +2 kg·m/s." },
    {
      until: 3.6,
      label: "Κρούση · αργή κίνηση",
      say: "Για Δt = 0,02 s ο τοίχος σπρώχνει τη μπάλα προς τα αριστερά. Η ταχύτητα μικραίνει, μηδενίζεται για μια στιγμή και γυρίζει ανάποδα.",
    },
    { until: 5.4, label: "Μετά", say: "Φεύγει με υ′ = 12 m/s προς τα αριστερά. Επειδή είναι αντίθετη στη θετική φορά: p′ = −1,2 kg·m/s." },
    { until: 8.5, label: "Δp", say: "Δp = p′ − p = −1,2 − 2 = −3,2 kg·m/s. Τα μέτρα προστέθηκαν, γιατί η μπάλα γύρισε πίσω!" },
  ],
  Scene: ({ t }) => {
    const wallX = 312;
    const r = 11;
    const y = 96;
    const hitX = wallX - r;
    let x: number;
    let v: number; // m/s, + to the right
    const k = seg(t, 2.2, 3.6);
    if (t < 2.2) {
      x = lerp(70, hitX, t / 2.2);
      v = 20;
    } else if (t < 3.6) {
      x = hitX + 3 * Math.sin(Math.PI * k);
      v = lerp(20, -12, k);
    } else {
      x = hitX - ((hitX - 70) / 2.2) * 0.6 * (Math.min(t, 5.4) - 3.6);
      v = -12;
    }
    const squash = 0.35 * bump(t, 2.2, 3.6);
    const F = bump(t, 2.2, 3.6);
    const showDp = t > 5.4;
    return (
      <g>
        <Ground y={y + r} x2={wallX} />
        <Wall x={wallX} y1={40} y2={y + r} />
        <Ball cx={x + squash * r} cy={y} r={r} squash={squash} />
        <Vec x={v > 0 ? Math.min(x, wallX - 8 - v * 4) : x} y={y - 22} dx={v * 4} label={Math.abs(v) > 3 ? (v > 0 ? "υ" : "υ′") : undefined} />
        <Vec x={wallX - 2} y={y} dx={-F * 70} color={C.F} label="F" width={3.4} labelSide="below" />
        <Tag x={14} y={24} s="αργή κίνηση" color={C.F} show={t > 2.2 && t < 3.6} />
        <T x={330} y={30} s="+ →" size={10} color={C.muted} />
        {showDp ? (
          <g opacity={seg(t, 5.4, 6)}>
            <rect x={196} y={20} width={110} height={64} rx={8} fill="#ffffff" stroke="#d6dae1" />
            <T x={204} y={34} s="Δp = p′ + (−p)" size={10} color={C.ink} anchor="start" />
            <Vec x={292} y={54} dx={-24} color={C.p} label="p′" width={3} />
            <Vec x={268} y={54} dx={-40} color={C.p} label="−p" width={3} dashed />
            <Vec x={292} y={70} dx={-64} color={C.p} label="Δp" width={3.6} labelSide="below" />
          </g>
        ) : null}
        <Bars
          y={150}
          max={3.5}
          title="ορμή της μπάλας"
          items={[
            { label: "p", value: 0.1 * v },
            { label: "Δp", value: showDp ? -3.2 : t > 2.2 ? 0.1 * v - 2 : 0 },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      Δp = −mυ′ − mυ = −0,1·12 − 0,1·20 = <b>−3,2 kg·m/s</b>. Μέση δύναμη τοίχου: F = Δp/Δt = −3,2/0,02 = <b>−160 N</b> (προς τα αριστερά).
    </>
  ),
  trap: "Μη γράψεις Δp = mυ′ − mυ = −0,8. Η υ′ έχει αντίθετη φορά και μπαίνει με «−».",
};

/* ───────── 4. Αναπήδηση στο έδαφος ───────── */
const case4: Case = {
  n: 4,
  what: "Μια μπάλα πέφτει από ύψος, χτυπά στο πάτωμα και αναπηδά πιο χαμηλά. Δείχνει την αλλαγή της ορμής στην αναπήδηση και ότι η Δp δείχνει προς τα πάνω.",
  title: "Αναπήδηση στο έδαφος",
  period: 4.6,
  legend: ["v", "F", "p"],
  phases: [
    { until: 1.5, label: "Πτώση", say: "Η μπάλα (0,5 kg) πέφτει από h₁ = 1,8 m. Φτάνει στο έδαφος με υ₁ = √(2gh₁) = 6 m/s." },
    { until: 2.1, label: "Επαφή", say: "Το έδαφος τη σπρώχνει προς τα πάνω με μεγάλη δύναμη N. Η ταχύτητα γυρίζει από κάτω σε πάνω." },
    { until: 3.1, label: "Άνοδος", say: "Ανεβαίνει με υ₂ = 4 m/s και φτάνει ως h₂ = 0,8 m, γιατί υ₂ = √(2gh₂)." },
    { until: 4.6, label: "Δp", say: "Θετική φορά προς τα πάνω: Δp = mυ₂ − (−mυ₁) = 0,5·(4 + 6) = 5 kg·m/s, προς τα πάνω." },
  ],
  Scene: ({ t }) => {
    const gy = 150;
    const r = 10;
    const cyHit = gy - r;
    const S = 55; // px per metre
    const slow = 2.5;
    let cy: number;
    let vUp: number; // m/s, + upward
    if (t < 1.5) {
      const tau = t / slow;
      cy = cyHit - S * (1.8 - 5 * tau * tau);
      vUp = -10 * tau;
    } else if (t < 2.1) {
      const k = seg(t, 1.5, 2.1);
      cy = cyHit + 2 * Math.sin(Math.PI * k);
      vUp = lerp(-6, 4, k);
    } else if (t < 3.1) {
      const tau = (t - 2.1) / slow;
      cy = cyHit - S * (4 * tau - 5 * tau * tau);
      vUp = 4 - 10 * tau;
    } else {
      cy = cyHit - S * 0.8;
      vUp = 0;
    }
    const squash = 0.3 * bump(t, 1.5, 2.1);
    const N = bump(t, 1.5, 2.1);
    const x = 120;
    const p = 0.5 * vUp;
    const after = t >= 3.1;
    return (
      <g>
        <Ground y={gy} x2={220} />
        <line x1={70} y1={cyHit} x2={70} y2={cyHit - S * 1.8} stroke={C.muted} strokeWidth={1} />
        <T x={64} y={cyHit - S * 0.9} s="h_1" size={10} color={C.muted} anchor="end" italic />
        <line x1={84} y1={cyHit} x2={84} y2={cyHit - S * 0.8} stroke={C.muted} strokeWidth={1} strokeDasharray="3 3" />
        <T x={90} y={cyHit - S * 0.4} s="h_2" size={10} color={C.muted} anchor="start" italic />
        <Ball cx={x} cy={cy + squash * r} r={r} squash={squash} axis="y" />
        <Vec x={x + 20} y={cy} dx={0} dy={-vUp * 7} label={vUp < -0.5 ? "υ_1" : vUp > 0.5 ? "υ_2" : undefined} />
        <Vec x={x} y={gy} dx={0} dy={-N * 80} color={C.F} label="N" width={3.4} labelSide="left" />
        <Tag x={150} y={24} s="αργή κίνηση" color={C.F} show={t > 1.5 && t < 2.1} />
        <Bars
          y={170}
          max={5.5}
          title="ορμή (θετική φορά ↑)"
          items={[
            { label: "p", value: p },
            { label: "Δp", value: after ? 5 : t > 1.5 ? p + 3 : 0 },
          ]}
        />
        {after ? (
          <g>
            <Vec x={270} y={120} dx={0} dy={-60} color={C.p} label="Δp" width={4} />
            <T x={270} y={136} s="ίδια φορά με την N" size={10} color={C.p} />
          </g>
        ) : null}
      </g>
    );
  },
  solve: (
    <>
      υ₁ = √(2·10·1,8) = 6 m/s, υ₂ = √(2·10·0,8) = 4 m/s. |Δp| = m(υ₁ + υ₂) = 0,5·10 = <b>5 kg·m/s</b>, προς τα πάνω.
    </>
  ),
  trap: "Η Δp δείχνει προς τα πάνω, αντίθετα από την υ₁. Από εκεί σπρώχνει το έδαφος.",
};

/* ───────── 5. Πλάγια κρούση σε τοίχο ───────── */
const case5: Case = {
  n: 5,
  what: "Μια μπάλα χτυπά λοξά έναν τοίχο και φεύγει με την ίδια γωνία, σαν φως σε καθρέφτη. Δείχνει ότι αλλάζει μόνο η κάθετη στον τοίχο ταχύτητα.",
  title: "Πλάγια κρούση σε τοίχο",
  period: 8,
  legend: ["v", "F", "p"],
  phases: [
    {
      until: 2.4,
      label: "Πριν",
      say: "Μπάλα 0,2 kg έρχεται λοξά με υ = 10 m/s, με γωνία φ = 60° από την κάθετη στον τοίχο. Σπάμε την υ σε υ_x (προς τον τοίχο) και υ_y (παράλληλα στον τοίχο).",
    },
    { until: 3.3, label: "Κρούση", say: "Ο τοίχος σπρώχνει μόνο κάθετα, στον άξονα x. Γι' αυτό αλλάζει μόνο η υ_x. Η υ_y δεν αλλάζει καθόλου." },
    {
      until: 8,
      label: "Μετά",
      say: "Φεύγει με την ίδια γωνία. Στον x: Δp_x = −2mυσυνφ. Στον y: Δp_y = 0. Η Δp είναι κάθετη στον τοίχο.",
    },
  ],
  Scene: ({ t }) => {
    const wallX = 340;
    const r = 9;
    const hx = wallX - r;
    const hy = 112;
    const L = 82;
    const c = Math.cos(Math.PI / 3);
    const s = Math.sin(Math.PI / 3);
    let x: number;
    let y: number;
    let vx: number; // m/s
    const vy = 10 * s; // upward
    if (t < 2.4) {
      const k = t / 2.4;
      x = hx - L * c * (1 - k);
      y = hy + L * s * (1 - k);
      vx = 10 * c;
    } else if (t < 3.3) {
      x = hx;
      y = hy;
      vx = lerp(10 * c, -10 * c, seg(t, 2.4, 3.3));
    } else {
      const k = Math.min(1, (t - 3.3) / 2.4);
      x = hx - L * c * k;
      y = hy - L * s * k;
      vx = -10 * c;
    }
    const F = bump(t, 2.4, 3.3);
    const sc = 4.2;
    const after = t > 3.3;
    const o = { x: 100, y: 150 };
    const P = 30; // px per kg·m/s
    const dpx = after ? -2 : t > 2.4 ? 0.2 * (vx - 5) : 0;
    return (
      <g>
        <Wall x={wallX} y1={14} y2={204} />
        <line x1={wallX - 58} y1={hy} x2={wallX} y2={hy} stroke={C.muted} strokeWidth={1} strokeDasharray="3 3" />
        <T x={wallX - 60} y={hy + 4} s="κάθετη" size={9} color={C.muted} anchor="end" bold={false} />
        <Ball cx={x} cy={y} r={r} />
        <Vec x={x} y={y} dx={vx * sc} dy={0} dashed label="υ_x" labelSide="below" opacity={0.75} />
        <Vec x={x} y={y} dx={0} dy={-vy * sc} dashed opacity={0.75} />
        <Vec x={x} y={y} dx={vx * sc} dy={-vy * sc} label="υ" labelSide="left" />
        <Vec x={wallX - 2} y={hy} dx={-F * 60} color={C.F} label="F" width={3.4} labelSide="below" />
        <rect x={10} y={16} width={196} height={186} rx={10} fill="#ffffff" stroke="#d6dae1" />
        <T x={20} y={32} s="ορμές με κοινή αρχή" size={10} color={C.muted} anchor="start" bold={false} />
        <Vec x={o.x} y={o.y} dx={P * 2 * c} dy={-P * 2 * s} color={C.p} label="p" labelSide="right" width={3} />
        {after ? (
          <>
            <Vec x={o.x} y={o.y} dx={-P * 2 * c} dy={-P * 2 * s} color={C.p} label="p′" labelSide="left" width={3} />
            <Vec x={o.x + P * 2 * c} y={o.y - P * 2 * s} dx={-P * 4 * c} dy={0} color={C.p} label="Δp" width={3.8} labelSide="above" />
          </>
        ) : null}
        <T x={20} y={174} s={`Δp_x = ${dpx.toFixed(1).replace(".", ",").replace("-", "−")} kg·m/s`} size={11} color={C.p} anchor="start" />
        <T x={20} y={192} s="Δp_y = 0 (η υ_y δεν αλλάζει)" size={11} color={C.p} anchor="start" />
      </g>
    );
  },
  solve: (
    <>
      Δp_x = −2mυσυνφ = −2·0,2·10·½ = <b>−2 kg·m/s</b>, Δp_y = 0. Η Δp είναι κάθετη στον τοίχο, με μέτρο 2 kg·m/s.
    </>
  ),
  trap: "Η φ μετριέται από την κάθετη, γι' αυτό συνφ. Αν σου δώσουν γωνία από τον τοίχο, τότε βάζεις ημ.",
};

export const section1: Case[] = [case1, case2, case3, case4, case5];
