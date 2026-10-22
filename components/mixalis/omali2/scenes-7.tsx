"use client";

import { Ball, C, T, Tag, lerp, num, seg } from "@/components/mixalis/ormi/kit";
import { Along, ArcPath, K, Orbit, P, Panel, tang, type OCase } from "./kit2";

/* ───────── 31. Δείκτες ρολογιού: πότε σχηματίζουν 90° ───────── */
const T90 = 180 / 11; // min
const T270 = 540 / 11; // min
const case31: OCase = {
  n: 31,
  title: "Ωροδείκτης και λεπτοδείκτης: 90°",
  what: "Ρολόι που ξεκινά στις 12:00. Ο λεπτοδείκτης τρέχει πιο γρήγορα και «ανοίγει» γωνία με τον ωροδείκτη. Ψάχνουμε πότε η γωνία τους γίνεται 90°.",
  given: "Περίοδος λεπτοδείκτη T_λ = 60 min, ωροδείκτη T_ω = 12 h = 720 min. Τη στιγμή t = 0 δείχνουν και οι δύο στο 12.",
  ask: "Πότε σχηματίζουν για πρώτη φορά γωνία 90°; Και πότε για δεύτερη φορά;",
  period: 13,
  legend: [],
  phases: [
    {
      until: 3,
      label: "Γωνιακές ταχύτητες",
      say: "ω_λ = 2π/60 rad/min και ω_ω = 2π/720 rad/min. Κινούνται ομόρροπα (δεξιόστροφα), άρα η γωνία ανάμεσά τους μεγαλώνει με ω_λ − ω_ω = 2π·11/720 rad/min.",
    },
    {
      until: 6.5,
      label: "Πρώτη φορά 90°",
      say: "Θέλουμε (ω_λ − ω_ω)·t = π/2 ⇒ t = (π/2)·720/(22π) = 180/11 ≈ 16,4 min. Δηλαδή στις 12:16 και 22 s, όχι στις 12:15! Σε 15 λεπτά ο ωροδείκτης έχει ήδη προχωρήσει.",
    },
    {
      until: 10,
      label: "Δεύτερη φορά",
      say: "Ο λεπτοδείκτης συνεχίζει. Η γωνία γίνεται 180° και μετά 270°, που είναι πάλι ορθή γωνία από την άλλη μεριά: (ω_λ − ω_ω)·t = 3π/2 ⇒ t = 540/11 ≈ 49,1 min.",
    },
    {
      until: 13,
      label: "Κάθε πότε",
      say: "Από ορθή σε ορθή γωνία η σχετική γωνία αλλάζει κατά π: Δt = 360/11 ≈ 32,7 min. Άρα 90° γίνονται 2 φορές σχεδόν κάθε ώρα (44 φορές σε 24 h).",
    },
  ],
  Scene: ({ t }) => {
    let tm: number; // minutes after 12:00
    if (t < 3) tm = lerp(0, 6, seg(t, 0.3, 2.8));
    else if (t < 6.5) tm = lerp(6, T90, seg(t, 3.2, 6));
    else if (t < 10) tm = lerp(T90, T270, seg(t, 6.7, 9.6));
    else tm = T270;
    const cx = 100;
    const cy = 102;
    const r = 78;
    const am = Math.PI / 2 - (2 * Math.PI * tm) / 60;
    const ah = Math.PI / 2 - (2 * Math.PI * tm) / 720;
    let rel = ((((tm / 60) - tm / 720) * 360) % 360 + 360) % 360;
    const [mx, my] = P(cx, cy, r * 0.86, am);
    const [hx, hy] = P(cx, cy, r * 0.55, ah);
    const mins = Math.floor(tm);
    const secs = Math.round((tm - mins) * 60);
    const shown = rel > 180 ? 360 - rel : rel;
    const isRight = Math.abs(shown - 90) < 0.6;
    if (rel > 359.5) rel = 0;
    return (
      <g>
        <circle cx={cx} cy={cy} r={r + 6} fill="#ffffff" stroke={C.edge} strokeWidth={2} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = Math.PI / 2 - (i * Math.PI) / 6;
          const [x1, y1] = P(cx, cy, r, a);
          const [x2, y2] = P(cx, cy, r - (i % 3 ? 5 : 9), a);
          const [tx, ty] = P(cx, cy, r - 17, a);
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.ink} strokeWidth={i % 3 ? 1 : 2} />
              {i % 3 === 0 ? <T x={tx} y={ty + 4} s={String(i || 12)} size={10} color={C.muted} /> : null}
            </g>
          );
        })}
        <ArcPath cx={cx} cy={cy} r={24} a0={ah} a1={rel <= 180 ? ah - (rel * Math.PI) / 180 : ah + ((360 - rel) * Math.PI) / 180} color={isRight ? K.a : C.muted} width={isRight ? 2.4 : 1.3} />
        <line x1={cx} y1={cy} x2={hx} y2={hy} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={mx} y2={my} stroke={K.v} strokeWidth={3} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={4} fill={C.ink} />
        <Panel
          x={206}
          y={14}
          w={148}
          lines={[
            `12:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`,
            `t = ${num(tm, 1)} min`,
            `γωνία = ${num(shown, 0)}°`,
            isRight ? "ορθή γωνία ✓" : t < 3 ? "ω_λ − ω_ω = 22π/720" : "…",
          ]}
        />
        <g transform="translate(212 128)">
          <line x1={0} y1={0} x2={18} y2={0} stroke={K.v} strokeWidth={3} strokeLinecap="round" />
          <T x={24} y={4} s="λεπτοδείκτης" size={10} color={C.muted} anchor="start" bold={false} />
          <line x1={0} y1={16} x2={18} y2={16} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
          <T x={24} y={20} s="ωροδείκτης" size={10} color={C.muted} anchor="start" bold={false} />
        </g>
      </g>
    );
  },
  solve: (
    <>
      Ομόρροπα: (ω_λ − ω_ω)·t = π/2 με ω_λ − ω_ω = 2π/60 − 2π/720 = 22π/720 rad/min ⇒ <b>t₁ = 180/11 ≈ 16,4 min</b> (12:16:22). Δεύτερη φορά: (ω_λ − ω_ω)·t = 3π/2 ⇒{" "}
      <b>t₂ = 540/11 ≈ 49,1 min</b> (12:49:05).
    </>
  ),
  trap: "Δεν είναι στις 12:15. Σε 15 λεπτά ο ωροδείκτης έχει προχωρήσει 7,5°, οπότε η γωνία είναι 82,5°. Πάντα δούλευε με τη σχετική γωνιακή ταχύτητα ω_λ − ω_ω.",
};

/* Runners on a circular track: circumference 400 m (R = 200/π m), υ_A = 5 m/s, υ_B = 3 m/s. */
const CX = 100;
const CY = 100;
const RT = 70;

function Runners({ thA, thB, dirB }: { thA: number; thB: number; dirB: 1 | -1 }) {
  const [ax, ay] = P(CX, CY, RT, thA);
  const [bx, by] = P(CX, CY, RT, thB);
  const uB = tang(thB);
  return (
    <g>
      <circle cx={CX} cy={CY} r={RT} fill="none" stroke="#e1cdb3" strokeWidth={14} />
      <Orbit cx={CX} cy={CY} r={RT} showCentre />
      <line x1={CX + RT - 9} y1={CY} x2={CX + RT + 9} y2={CY} stroke={C.ink} strokeWidth={2} />
      <T x={CX + RT + 12} y={CY + 4} s="Σ" size={10} color={C.muted} anchor="start" />
      <Ball cx={bx} cy={by} r={7} fill={C.b2} label="B" />
      <Ball cx={ax} cy={ay} r={7} fill={C.ball} label="A" />
      <Along x={ax} y={ay} u={tang(thA)} len={26} color={K.v} />
      <Along x={bx} y={by} u={[uB[0] * dirB, uB[1] * dirB]} len={16} color={K.v} />
    </g>
  );
}

/* ───────── 32. Συνάντηση ομόρροπα ───────── */
const case32: OCase = {
  n: 32,
  title: "Συνάντηση ομόρροπα",
  what: "Δύο δρομείς ξεκινούν μαζί από το ίδιο σημείο Σ κυκλικού στίβου και τρέχουν προς την ίδια φορά. Ο γρήγορος (Α) αφήνει πίσω τον αργό (Β) και τον ξαναπιάνει όταν τον «περάσει» κατά έναν γύρο.",
  given: "Μήκος στίβου 2πR = 400 m, υ_A = 5 m/s, υ_B = 3 m/s, ίδια φορά, ξεκινούν μαζί από το Σ.",
  ask: "Μετά από πόσο χρόνο συναντώνται για πρώτη φορά; Πόσο έχει τρέξει ο καθένας;",
  period: 11,
  legend: ["v"],
  phases: [
    {
      until: 3.6,
      label: "Ανοίγει η απόσταση",
      say: "Ο Α τρέχει 2 m/s πιο γρήγορα από τον Β. Κάθε δευτερόλεπτο του «παίρνει» 2 m. Στην αρχή απλώς απομακρύνεται.",
    },
    {
      until: 7.4,
      label: "Τον ξαναπιάνει",
      say: "Συναντώνται όταν ο Α έχει τρέξει ακριβώς έναν γύρο παραπάνω: s_A − s_B = 400 m ⇒ (υ_A − υ_B)·t = 2πR ⇒ t = 400/2 = 200 s.",
    },
    {
      until: 11,
      label: "Πού συναντώνται",
      say: "Σε 200 s ο Α έτρεξε 1000 m (2,5 γύρους) και ο Β 600 m (1,5 γύρο). Συναντώνται στο αντιδιαμετρικό του Σ. Με γωνίες: (ω_A − ω_B)·t = 2π.",
    },
  ],
  Scene: ({ t }) => {
    const tp = t < 3.6 ? lerp(0, 40, seg(t, 0.2, 3.4)) : t < 7.4 ? lerp(40, 200, seg(t, 3.8, 7.2)) : 200;
    const sA = 5 * tp;
    const sB = 3 * tp;
    const thA = (2 * Math.PI * sA) / 400;
    const thB = (2 * Math.PI * sB) / 400;
    const met = tp >= 199.9;
    return (
      <g>
        <Runners thA={thA} thB={thB} dirB={1} />
        {met ? <Tag x={12} y={200} s="συνάντηση!" color={K.a} /> : null}
        <Panel
          x={196}
          y={14}
          w={158}
          lines={[`t = ${num(tp, 0)} s`, `s_A = ${num(sA, 0)} m`, `s_B = ${num(sB, 0)} m`, `s_A − s_B = ${num(sA - sB, 0)} m`]}
        />
        <g>
          <T x={198} y={130} s="ομόρροπα:" size={10} color={C.muted} anchor="start" bold={false} />
          <T x={198} y={146} s="(υ_A − υ_B)·t = 2πR" size={11} color={C.ink} anchor="start" />
          <T x={198} y={162} s="t = 400/(5 − 3) = 200 s" size={11} color={met ? K.a : C.ink} anchor="start" />
        </g>
      </g>
    );
  },
  solve: (
    <>
      Ομόρροπα: (υ_A − υ_B)·t = 2πR ⇒ <b>t = 400/(5 − 3) = 200 s</b>. Ο Α έτρεξε <b>1000 m</b>, ο Β <b>600 m</b>: διαφορά ακριβώς ένας γύρος.
    </>
  ),
  trap: "Στην ομόρροπη κίνηση αφαιρείς τις ταχύτητες (ή τις ω). Και η πρώτη συνάντηση δεν γίνεται όταν ο Α κάνει έναν γύρο, αλλά όταν κάνει έναν γύρο περισσότερο από τον Β.",
};

/* ───────── 33. Συνάντηση αντίρροπα ───────── */
const case33: OCase = {
  n: 33,
  title: "Συνάντηση αντίρροπα",
  what: "Οι ίδιοι δρομείς ξεκινούν από το Σ, αλλά τώρα τρέχουν αντίθετα. Πάνε ο ένας προς τον άλλον, οπότε συναντώνται πολύ πιο γρήγορα.",
  given: "Μήκος στίβου 2πR = 400 m, υ_A = 5 m/s, υ_B = 3 m/s, αντίθετη φορά, ξεκινούν μαζί από το Σ.",
  ask: "Μετά από πόσο χρόνο συναντώνται για πρώτη φορά; Κάθε πότε συναντώνται μετά;",
  period: 11,
  legend: ["v"],
  phases: [
    {
      until: 3.6,
      label: "Αντίθετα",
      say: "Ο Α πάει αριστερόστροφα, ο Β δεξιόστροφα. Η απόσταση που τους χωρίζει (πάνω στον στίβο) μικραίνει κατά 5 + 3 = 8 m κάθε δευτερόλεπτο.",
    },
    {
      until: 7.4,
      label: "Συνάντηση",
      say: "Συναντώνται όταν μαζί έχουν καλύψει ολόκληρο τον στίβο: s_A + s_B = 400 m ⇒ (υ_A + υ_B)·t = 2πR ⇒ t = 400/8 = 50 s.",
    },
    {
      until: 11,
      label: "Και ξανά",
      say: "Ο Α έτρεξε 250 m, ο Β 150 m. Μετά από κάθε συνάντηση η ιστορία ξαναρχίζει από την αρχή: συναντώνται κάθε 50 s (ενώ ομόρροπα κάθε 200 s).",
    },
  ],
  Scene: ({ t }) => {
    let tp: number;
    if (t < 3.6) tp = lerp(0, 20, seg(t, 0.2, 3.4));
    else if (t < 7.4) tp = lerp(20, 50, seg(t, 3.8, 7.2));
    else tp = lerp(50, 100, seg(t, 7.6, 10.6));
    const sA = 5 * tp;
    const sB = 3 * tp;
    const thA = (2 * Math.PI * sA) / 400;
    const thB = -(2 * Math.PI * sB) / 400;
    const k = Math.floor(tp / 50 + 1e-6);
    const met = k >= 1 && Math.abs(tp - 50 * k) < 0.4;
    return (
      <g>
        <Runners thA={thA} thB={thB} dirB={-1} />
        {met ? <Tag x={12} y={200} s={`συνάντηση #${k}`} color={K.a} /> : null}
        <Panel x={196} y={14} w={158} lines={[`t = ${num(tp, 0)} s`, `s_A = ${num(sA, 0)} m`, `s_B = ${num(sB, 0)} m`, `s_A + s_B = ${num(sA + sB, 0)} m`]} />
        <T x={198} y={130} s="αντίρροπα:" size={10} color={C.muted} anchor="start" bold={false} />
        <T x={198} y={146} s="(υ_A + υ_B)·t = 2πR" size={11} color={C.ink} anchor="start" />
        <T x={198} y={162} s="t = 400/(5 + 3) = 50 s" size={11} color={met ? K.a : C.ink} anchor="start" />
      </g>
    );
  },
  solve: (
    <>
      Αντίρροπα: (υ_A + υ_B)·t = 2πR ⇒ <b>t = 400/(5 + 3) = 50 s</b>. Ο Α έτρεξε 250 m, ο Β 150 m. Συναντώνται <b>κάθε 50 s</b>.
    </>
  ),
  trap: "Αντίρροπα προσθέτεις τις ταχύτητες, ομόρροπα τις αφαιρείς. Με γωνίες ισχύει το ίδιο: (ω_A + ω_B)·t = 2π.",
};

/* ───────── 34. Κυκλική και ευθύγραμμη κίνηση ───────── */
const case34: OCase = {
  n: 34,
  title: "Κυκλική και ευθύγραμμη",
  what: "Δύο σώματα ξεκινούν μαζί από το άκρο Γ μιας διαμέτρου. Το Α κάνει ομαλή κυκλική κίνηση πάνω στο ημικύκλιο, το Β ευθύγραμμη ομαλή πάνω στη διάμετρο. Φτάνουν ταυτόχρονα στο άλλο άκρο Δ.",
  given: "Ακτίνα R = 2 m, υ_A = π m/s ≈ 3,14 m/s (κυκλική). Το Β κινείται ευθύγραμμα ομαλά από το Γ στο Δ, πάνω στη διάμετρο.",
  ask: "Την ταχύτητα υ_B ώστε να φτάσουν μαζί στο Δ, και τον λόγο υ_A/υ_B.",
  period: 11,
  legend: ["v"],
  phases: [
    {
      until: 4,
      label: "Ξεκινούν μαζί",
      say: "Και τα δύο ξεκινούν από το Γ. Το Α γράφει τόξο, το Β πάει ίσια. Σε κάθε στιγμή το Β βρίσκεται πάνω στη διάμετρο ΓΔ, το Α πάνω στο ημικύκλιο.",
    },
    {
      until: 7.5,
      label: "Φτάνουν μαζί",
      say: "Το Α διανύει μισό κύκλο, πR = 2π m, σε t = πR/υ_A = 2 s. Στον ίδιο χρόνο το Β διανύει τη διάμετρο 2R = 4 m: υ_B = 4/2 = 2 m/s. Στο Δ τα Γ, Ο, Δ και τα δύο σώματα είναι στην ίδια ευθεία.",
    },
    {
      until: 11,
      label: "Ο λόγος",
      say: "υ_A/υ_B = πR/(2R) = π/2 ≈ 1,57. Ίδιος χρόνος, άρα οι ταχύτητες είναι ανάλογες των διαδρομών: τόξο πR προς χορδή 2R.",
    },
  ],
  Scene: ({ t }) => {
    const cx = 110;
    const cy = 120;
    const r = 72;
    const tp = t < 4 ? lerp(0, 1.2, seg(t, 0.3, 3.8)) : t < 7.5 ? lerp(1.2, 2, seg(t, 4.2, 7.2)) : 2;
    const thA = Math.PI - (Math.PI / 2) * tp; // from Γ (left) over the top to Δ (right)
    const [ax, ay] = P(cx, cy, r, thA);
    const bx = cx - r + (2 * r * tp) / 2;
    const done = tp >= 1.999;
    return (
      <g>
        <ArcPath cx={cx} cy={cy} r={r} a0={Math.PI} a1={0} color={K.orbit} dashed />
        <ArcPath cx={cx} cy={cy} r={r} a0={Math.PI} a1={thA} color={K.v} width={2.6} opacity={0.5} />
        <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={C.edge} strokeWidth={1.4} />
        <line x1={cx - r} y1={cy} x2={bx} y2={cy} stroke={K.v} strokeWidth={2.6} opacity={0.5} />
        <circle cx={cx} cy={cy} r={2.6} fill={C.ink} />
        <T x={cx} y={cy + 16} s="O" size={10} color={C.muted} italic />
        <T x={cx - r - 4} y={cy + 16} s="Γ" size={11} color={C.ink} />
        <T x={cx + r + 4} y={cy + 16} s="Δ" size={11} color={C.ink} />
        {done ? <line x1={cx - r - 20} y1={cy} x2={cx + r + 20} y2={cy} stroke={K.a} strokeWidth={1.4} strokeDasharray="5 3" /> : null}
        <Ball cx={bx} cy={cy} r={7} fill={C.b2} label="B" />
        <Ball cx={ax} cy={ay} r={7} fill={C.ball} label="A" />
        {!done ? (
          <g>
            <Along x={ax} y={ay} u={[-tang(thA)[0], -tang(thA)[1]]} len={30} color={K.v} label="υ_A" labelSide="above" />
            <Along x={bx} y={cy + 14} u={[1, 0]} len={19} color={K.v} label="υ_B" labelSide="below" />
          </g>
        ) : null}
        <Panel
          x={206}
          y={14}
          w={148}
          lines={
            t < 7.5
              ? [`t = ${num(tp, 2)} s`, `τόξο A: ${num(Math.PI * tp, 2)} m`, `ευθεία B: ${num(2 * tp, 2)} m`, done ? "μαζί στο Δ ✓" : "…"]
              : ["Ίδιος χρόνος t = 2 s", "υ_A = πR/t = π m/s", "υ_B = 2R/t = 2 m/s", "υ_A/υ_B = π/2 ≈ 1,57"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      t = πR/υ_A = 2π/π = 2 s. <b>υ_B = 2R/t = 4/2 = 2 m/s</b>. <b>υ_A/υ_B = πR/(2R) = π/2 ≈ 1,57</b>.
    </>
  ),
  trap: "Στο ίδιο χρονικό διάστημα δεν διανύουν την ίδια απόσταση: το τόξο (πR) είναι μεγαλύτερο από τη διάμετρο (2R). Γι' αυτό το Α πρέπει να είναι πιο γρήγορο.",
};

export const section7 = [case31, case32, case33, case34];
