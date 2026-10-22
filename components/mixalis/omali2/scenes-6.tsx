"use client";

import { Ball, C, T, Tag, lerp, num, seg } from "@/components/mixalis/ormi/kit";
import { Along, ArcPath, Car, K, MagBars, Orbit, P, Panel, inward, loopState, tang, type OCase } from "./kit2";

/* ───────── 26. Δορυφόρος ───────── */
const case26: OCase = {
  n: 26,
  title: "Κυκλική τροχιά δορυφόρου",
  what: "Ένας δορυφόρος γυρίζει γύρω από τη Γη. Την κεντρομόλο τη δίνει η βαρυτική έλξη. Στο τέλος βάζουμε και έναν δεύτερο, πιο ψηλά, που γυρίζει πιο αργά.",
  given: "Ακτίνα Γης R_Γ = 6400 km, g₀ = 10 m/s² στην επιφάνεια (άρα GM = g₀·R_{Γ}²). Ο δορυφόρος γυρίζει σε r = 2R_Γ.",
  ask: "Την ταχύτητα υ του δορυφόρου και την περίοδό του T.",
  period: 11,
  legend: ["v", "F"],
  phases: [
    {
      until: 3.6,
      label: "Η έλξη",
      say: "Η μόνη δύναμη στον δορυφόρο είναι η έλξη της Γης, F = GMm/r², προς το κέντρο της Γης. Αυτή είναι η κεντρομόλος: δεν χρειάζεται «καύσιμο» για να στρίβει.",
    },
    {
      until: 7.2,
      label: "Η ταχύτητα",
      say: "GMm/r² = mυ²/r ⇒ υ = √(GM/r). Με GM = g₀R_{Γ}² και r = 2R_Γ: υ = √(g₀R_Γ/2) = √(3,2·10⁷) ≈ 5,66 km/s. Η μάζα του δορυφόρου φεύγει.",
    },
    {
      until: 11,
      label: "Πιο ψηλά",
      say: "Ο δεύτερος (r = 3R_Γ) έχει υ = √(g₀R_Γ/3) ≈ 4,62 km/s και πολύ μεγαλύτερη περίοδο. Πιο ψηλά ⇒ πιο αργά, και γραμμικά και σε γωνία.",
    },
  ],
  Scene: ({ t }) => {
    const ex = 100;
    const ey = 102;
    const Re = 26;
    const w1 = 0.9;
    const th1 = 0.5 + w1 * t;
    const [x1, y1] = P(ex, ey, 2 * Re, th1);
    const both = t >= 7.2;
    const th2 = 2.2 + w1 * Math.pow(2 / 3, 1.5) * (t - 7.2);
    const [x2, y2] = P(ex, ey, 3 * Re, th2);
    return (
      <g>
        <circle cx={ex} cy={ey} r={Re} fill="#9cc3e6" stroke="#4a7fb3" strokeWidth={1.4} />
        <path d={`M ${ex - 14} ${ey - 10} q 8 -6 14 2 q 6 8 -2 14 q -10 2 -12 -8 Z`} fill="#8fbf7f" opacity={0.9} />
        <T x={ex} y={ey + 4} s="Γη" size={10} color={C.ink} />
        <Orbit cx={ex} cy={ey} r={2 * Re} showCentre={false} />
        {both ? <Orbit cx={ex} cy={ey} r={3 * Re} showCentre={false} /> : null}
        <rect x={x1 - 5} y={y1 - 4} width={10} height={8} fill="#c8ced6" stroke={C.edge} />
        <line x1={x1 - 11} y1={y1} x2={x1 + 11} y2={y1} stroke="#3e6fb0" strokeWidth={3} />
        <Along x={x1} y={y1} u={inward(th1)} len={24} color={K.F} label="F" width={3} labelSide="below" />
        <Along x={x1} y={y1} u={tang(th1)} len={5.66 * 5} color={K.v} label="υ" labelSide="right" />
        {both ? (
          <g>
            <rect x={x2 - 5} y={y2 - 4} width={10} height={8} fill="#e8d28a" stroke={C.edge} />
            <line x1={x2 - 11} y1={y2} x2={x2 + 11} y2={y2} stroke="#3e6fb0" strokeWidth={3} />
            <Along x={x2} y={y2} u={tang(th2)} len={4.62 * 5} color={K.v} label="υ₂" labelSide="right" />
            <Along x={x2} y={y2} u={inward(th2)} len={24 * (4 / 9)} color={K.F} />
          </g>
        ) : null}
        <Panel
          x={206}
          y={14}
          w={148}
          lines={
            t < 3.6
              ? ["Κεντρομόλος = βαρύτητα", "F = GMm/r²", "r = 2R_Γ = 12800 km"]
              : t < 7.2
                ? ["GMm/r² = mυ²/r", "υ = √(GM/r) = √(g₀R_Γ/2)", "υ ≈ 5,66 km/s", "T = 2πr/υ ≈ 3,95 h"]
                : ["r = 3R_Γ", "υ₂ = √(g₀R_Γ/3)", "υ₂ ≈ 4,62 km/s", "T₂ ≈ 7,3 h"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      GMm/r² = mυ²/r ⇒ υ = √(GM/r) = √(g₀R<sub>Γ</sub>²/(2R_Γ)) = √(g₀R_Γ/2) = √(10·6,4·10⁶/2) ⇒ <b>υ ≈ 5660 m/s ≈ 5,66 km/s</b>. <b>T = 2πr/υ = 2π·12,8·10⁶/5660 ≈ 14200 s ≈ 3,95 h</b>.
    </>
  ),
  trap: "Στον τύπο μπαίνει η απόσταση από το κέντρο της Γης (r = R_Γ + ύψος), όχι το ύψος πάνω από την επιφάνεια.",
};

/* Vertical circle on a string, m = 0,2 kg, R = 0,5 m (as in section 4). */
const CX = 100;
const CY = 102;
const RP = 64;
const PXM = RP / 0.5;
const MG = 2;

/** Body on a string: full loop, or slack and projectile after `stopSin`. */
function stringMotion(tShown: number, v2b: number, rate: number, stopSin = 2) {
  const s = loopState(tShown, v2b, 0.5, rate, stopSin);
  if (!s.stopped || s.v2 <= 0) {
    const [x, y] = P(CX, CY, RP, s.th);
    return { x, y, th: s.th, v2: s.v2, free: false, tau: 0 };
  }
  const [x0, y0] = P(CX, CY, RP, s.th);
  const v = Math.sqrt(s.v2);
  const u = tang(s.th);
  const tau = (tShown - s.tStop) * rate * 0.9;
  const x = x0 + u[0] * v * tau * PXM;
  const y = y0 + (u[1] * v * tau + 5 * tau * tau) * PXM;
  return { x, y, th: s.th, v2: s.v2, free: true, tau, x0, y0 };
}

/* ───────── 27. Ελάχιστη υ κάτω ───────── */
const case27: OCase = {
  n: 27,
  title: "Ελάχιστη υ κάτω",
  what: "Δίνουμε ώθηση στο σώμα στον πάτο του κύκλου. Με αρκετή ταχύτητα κάνει όλο τον κύκλο. Με λίγο μικρότερη, το νήμα χαλαρώνει πριν από την κορυφή.",
  given: "m = 0,2 kg, R = 0,5 m. Δοκιμάζουμε υ_{κάτω} = 5 m/s και υ_{κάτω} = 4 m/s.",
  ask: "Την ελάχιστη ταχύτητα στο κατώτερο σημείο ώστε το σώμα να κάνει πλήρη κύκλο.",
  period: 12,
  legend: ["v", "F"],
  phases: [
    {
      until: 4,
      label: "Με 5 m/s",
      say: "Το σώμα ανεβαίνει, χάνει ταχύτητα (κινητική → δυναμική) και φτάνει στην κορυφή με υ = √5 ≈ 2,24 m/s = √(gR). Εκεί T = 0: ίσα ίσα τα καταφέρνει.",
    },
    {
      until: 8,
      label: "ΑΔΜΕ",
      say: "Από κάτω ως πάνω το ύψος αλλάζει κατά 2R: ½mυ_{κ}² = ½mυ_{π}² + mg·2R. Με υ_{π}² = gR βγαίνει υ_{κ}² = 5gR ⇒ υ_{κ,min} = √(5gR) = 5 m/s.",
    },
    {
      until: 12,
      label: "Με 4 m/s",
      say: "Με 4 m/s η τάση μηδενίζεται πιο νωρίς (εκεί που ημθ = 0,4 πάνω από την οριζόντια). Το νήμα χαλαρώνει και το σώμα κάνει πλάγια βολή μέσα στον κύκλο.",
    },
  ],
  Scene: ({ t }) => {
    const p3 = t >= 8;
    const v2b = p3 ? 16 : 25;
    const local = p3 ? t - 8 : t < 4 ? t : t - 4;
    const m = stringMotion(local, v2b, 0.16, p3 ? 0.4 : 2);
    const Tn = m.free ? 0 : Math.max(0, 0.4 * m.v2 - MG * Math.sin(m.th));
    const dist = Math.hypot(m.x - CX, m.y - CY);
    if (m.free && dist > RP && m.tau > 0.1) {
      // the string is taut again: keep the body on the circle where it landed
      m.x = CX + ((m.x - CX) / dist) * RP;
      m.y = CY + ((m.y - CY) / dist) * RP;
    }
    return (
      <g>
        <Orbit cx={CX} cy={CY} r={RP} showCentre={false} />
        {m.free ? (
          <path d={`M ${CX} ${CY} Q ${(CX + m.x) / 2 + 8} ${(CY + m.y) / 2 + 12} ${m.x} ${m.y}`} fill="none" stroke={C.ink} strokeWidth={1.1} strokeDasharray="2 2" />
        ) : (
          <line x1={CX} y1={CY} x2={m.x} y2={m.y} stroke={C.ink} strokeWidth={1.4} />
        )}
        <circle cx={CX} cy={CY} r={3.4} fill={C.ink} />
        <Ball cx={m.x} cy={m.y} r={8} />
        {!m.free ? <Along x={m.x} y={m.y} u={tang(m.th)} len={Math.sqrt(m.v2) * 7} color={K.v} label="υ" labelSide="right" /> : null}
        {Tn > 0.05 ? <Along x={m.x} y={m.y} u={inward(m.th)} len={Tn * 3} color={K.F} label="T" width={3} labelSide="above" /> : null}
        <Tag x={12} y={200} s="το νήμα χαλάρωσε" color={K.F} show={m.free} />
        <Panel
          x={206}
          y={14}
          w={148}
          lines={
            t < 4
              ? ["υ_{κάτω} = 5 m/s", `υ = ${num(Math.sqrt(m.v2), 2)} m/s`, `T = ${num(Tn, 1)} N`]
              : t < 8
                ? ["ΑΔΜΕ κάτω → πάνω", "υ_{κ}² = υ_{π}² + 4gR", "υ_{π,min}² = gR", "υ_{κ,min} = √(5gR) = 5 m/s"]
                : ["υ_{κάτω} = 4 m/s < 5", m.free ? "T = 0 πριν την κορυφή" : `T = ${num(Tn, 1)} N`, "⇒ δεν κάνει κύκλο"]
          }
        />
        <MagBars x={206} y={150} w={150} max={12} items={[{ label: "T", value: Tn, color: K.F }, { label: "mg", value: MG, color: K.g }]} />
      </g>
    );
  },
  solve: (
    <>
      Κορυφή, όριο T = 0: υ<sub>π</sub>² = gR. ΑΔΜΕ: ½mυ<sub>κ</sub>² = ½mυ<sub>π</sub>² + mg·2R ⇒ υ<sub>κ</sub>² = gR + 4gR = 5gR ⇒ <b>υ<sub>κ,min</sub> = √(5·10·0,5) = 5 m/s</b>.
    </>
  ),
  trap: "Η απάντηση δεν είναι «υ_κ τόση ώστε να φτάσει στην κορυφή με υ = 0» (√(4gR)). Με νήμα πρέπει να φτάσει εκεί με υ ≥ √(gR).",
};

/* ───────── 28. Όριο επαφής στον λόφο ───────── */
const HX = 120;
const HY = 300;
const HRp = 200; // R = 40 m → 5 px/m
const case28: OCase = {
  n: 28,
  title: "Όριο επαφής στον λόφο",
  what: "Το ίδιο αυτοκίνητο περνά από την κορυφή του λόφου όλο και πιο γρήγορα. Η κάθετη δύναμη μικραίνει, μηδενίζεται και μετά το αυτοκίνητο «πετάει».",
  given: "m = 1000 kg, ακτίνα καμπυλότητας λόφου R = 40 m. Δοκιμάζουμε υ = 15, 20 και 25 m/s στην κορυφή.",
  ask: "Τη μέγιστη ταχύτητα υ_{όριο} στην κορυφή ώστε να μη χάσει την επαφή.",
  period: 11,
  legend: ["v", "F"],
  phases: [
    {
      until: 3.6,
      label: "15 m/s",
      say: "mg − N = mυ²/R ⇒ N = 10000 − 1000·225/40 = 4375 N. Η N έχει μικρύνει, αλλά υπάρχει: οι ρόδες πατάνε.",
    },
    {
      until: 7.2,
      label: "20 m/s",
      say: "Με υ = √(gR) = √400 = 20 m/s βγαίνει N = 0: όλη την κεντρομόλο τη δίνει το βάρος. Οι επιβάτες νιώθουν «αβαρείς». Αυτό είναι το όριο.",
    },
    {
      until: 11,
      label: "25 m/s",
      say: "Με 25 m/s θα χρειαζόταν mυ²/R = 15625 N προς το κέντρο, αλλά το βάρος δίνει μόνο 10000 N και ο δρόμος δεν τραβά. Ο δρόμος «φεύγει» από κάτω: οριζόντια βολή.",
    },
  ],
  Scene: ({ t }) => {
    const top = Math.PI / 2;
    const [tx, ty] = P(HX, HY, HRp, top);
    const v = t < 3.6 ? 15 : t < 7.2 ? 20 : 25;
    const N = Math.max(0, 10000 - (1000 * v * v) / 40);
    const k = 0.0042;
    let x = tx;
    let y = ty;
    let rot = 0;
    let flying = false;
    let trail = "";
    if (t < 7.2) {
      const local = t < 3.6 ? t : t - 3.6;
      const a = lerp(top + 0.3, top - 0.12, seg(local, 0.1, 3.4));
      [x, y] = P(HX, HY, HRp, a);
      rot = 90 - (a * 180) / Math.PI;
    } else {
      const tau = Math.max(0, (t - 7.6) * 0.45);
      x = tx + v * tau * 5;
      y = ty + 5 * tau * tau * 5;
      flying = tau > 0;
      trail = Array.from({ length: 20 }, (_, i) => {
        const s = (i / 19) * tau;
        return `${i ? "L" : "M"}${(tx + v * s * 5).toFixed(1)},${(ty + 25 * s * s).toFixed(1)}`;
      }).join(" ");
    }
    return (
      <g>
        <ArcPath cx={HX} cy={HY} r={HRp} a0={top + 0.55} a1={top - 0.55} color={K.track} width={4} />
        {flying ? <path d={trail} fill="none" stroke={K.v} strokeDasharray="3 3" /> : null}
        <Car x={x} y={y - 2} rot={rot} />
        <Along x={x} y={y - 14} u={[1, 0]} len={v * 1.6} color={K.v} label="υ" labelSide="above" />
        {!flying && N > 10 ? <Along x={x - 4} y={y} u={[0, -1]} len={N * k} color={K.F} label="N" width={3} labelSide="left" /> : null}
        <Along x={x + 4} y={y} u={[0, 1]} len={10000 * k} color={K.g} label="mg" width={3} labelSide="right" />
        <Tag x={12} y={200} s={flying ? "χάνει την επαφή!" : "N = 0: «αβαρής»"} color={K.F} show={flying || (t >= 3.6 && t < 7.2)} />
        <Panel x={206} y={14} w={148} lines={[`υ = ${v} m/s`, `mυ²/R = ${num((1000 * v * v) / 40, 0)} N`, "mg = 10000 N", v > 20 ? "N < 0; αδύνατο ⇒ πετάει" : `N = ${num(N, 0)} N`]} />
        <MagBars x={206} y={150} w={150} max={16000} items={[{ label: "mυ²/R", value: (1000 * v * v) / 40, color: K.a }, { label: "mg", value: 10000, color: K.g }]} />
      </g>
    );
  },
  solve: (
    <>
      Όριο N = 0: mg = mυ²/R ⇒ <b>υ<sub>όριο</sub> = √(gR) = √(10·40) = 20 m/s</b> (72 km/h). Με 15 m/s: N = 4375 N.
    </>
  ),
  trap: "Η N δεν γίνεται αρνητική: ο δρόμος μόνο σπρώχνει. Όταν ο τύπος δίνει N < 0, σημαίνει ότι το σώμα έχει ήδη φύγει από την επιφάνεια.",
};

/* ───────── 29. Διαφορά τάσεων ───────── */
const tension6 = (th: number) => 0.4 * (36 - 10 * (1 + Math.sin(th))) - MG * Math.sin(th);
const case29: OCase = {
  n: 29,
  title: "Διαφορά τάσεων",
  what: "Το σώμα κάνει ολόκληρο κατακόρυφο κύκλο. Συγκρίνουμε την τάση στον πάτο και στην κορυφή. Η διαφορά τους βγαίνει πάντα 6mg, όποια κι αν είναι η ταχύτητα.",
  given: "m = 0,2 kg (mg = 2 N), R = 0,5 m, υ_{κάτω} = 6 m/s.",
  ask: "Την ταχύτητα στην κορυφή, τις τάσεις T_{κάτω} και T_{πάνω} και τη διαφορά τους.",
  period: 12,
  legend: ["v", "F"],
  phases: [
    {
      until: 3.6,
      label: "Κάτω",
      say: "Στον πάτο: T_{κάτω} − mg = mυ_{κ}²/R ⇒ T_{κάτω} = 2 + 0,2·36/0,5 = 16,4 N.",
    },
    {
      until: 7.2,
      label: "Πάνω",
      say: "ΑΔΜΕ: υ_{π}² = υ_{κ}² − 4gR = 36 − 20 = 16 ⇒ υ_π = 4 m/s. Στην κορυφή: T_{πάνω} + mg = mυ_{π}²/R ⇒ T_{πάνω} = 6,4 − 2 = 4,4 N.",
    },
    {
      until: 12,
      label: "Πάντα 6mg",
      say: "T_{κάτω} − T_{πάνω} = 16,4 − 4,4 = 12 N = 6·mg. Γενικά: (mg + mυ_{κ}²/R) − (mυ_{π}²/R − mg) = 2mg + m(υ_{κ}² − υ_{π}²)/R = 2mg + 4mg = 6mg.",
    },
  ],
  Scene: ({ t }) => {
    let th: number;
    if (t < 3.6) th = -Math.PI / 2;
    else if (t < 7.2) th = Math.PI / 2;
    else th = loopState(t - 7.2, 36, 0.5, 0.2).th;
    const [x, y] = P(CX, CY, RP, th);
    const Tn = tension6(th);
    const v = Math.sqrt(Math.max(0, 36 - 10 * (1 + Math.sin(th))));
    return (
      <g>
        <Orbit cx={CX} cy={CY} r={RP} showCentre={false} />
        <line x1={CX} y1={CY} x2={x} y2={y} stroke={C.ink} strokeWidth={1.4} />
        <circle cx={CX} cy={CY} r={3.4} fill={C.ink} />
        <Ball cx={x} cy={y} r={8} />
        <Along x={x} y={y} u={tang(th)} len={v * 6} color={K.v} label="υ" labelSide="right" />
        <Along x={x - 3} y={y} u={inward(th)} len={Tn * 3.5} color={K.F} label="T" width={3} labelSide="left" />
        <Along x={x + 3} y={y} u={[0, 1]} len={MG * 10} color={K.g} label="mg" labelSide="right" />
        <Panel
          x={206}
          y={14}
          w={148}
          lines={t < 3.6 ? ["Κάτω (υ = 6 m/s)", "T_{κάτω} = mg + mυ²/R", "T_{κάτω} = 16,4 N"] : t < 7.2 ? ["Πάνω (υ = 4 m/s)", "T_{πάνω} = mυ²/R − mg", "T_{πάνω} = 4,4 N"] : ["Διαφορά", "16,4 − 4,4 = 12 N", "= 6·mg ✓"]}
        />
        <MagBars
          x={206}
          y={142}
          w={150}
          max={17}
          items={[
            { label: "T", value: Tn, color: K.F },
            { label: "T_{κάτω}", value: 16.4, color: C.muted },
            { label: "T_{πάνω}", value: 4.4, color: C.muted },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      ΑΔΜΕ: υ<sub>π</sub>² = υ<sub>κ</sub>² − 4gR = 16 ⇒ <b>υ_π = 4 m/s</b>. <b>T<sub>κάτω</sub> = 16,4 N</b>, <b>T<sub>πάνω</sub> = 4,4 N</b>, <b>T<sub>κάτω</sub> − T<sub>πάνω</sub> = 12 N = 6mg</b>.
    </>
  ),
  trap: "Το 6mg ισχύει μόνο για πλήρη κατακόρυφο κύκλο με νήμα (ή λούπα), χωρίς τριβές. Ανάμεσα σε πάτο και οριζόντια θέση η διαφορά είναι 3mg.",
};

/* ───────── 30. Ύψος για λούπα ───────── */
const LCX = 262;
const LCY = 150;
const LRp = 40; // R = 2 m → 20 px/m
const PX30 = LRp / 2;
const RAMP_X0 = 20;
const BOT = LCY + LRp;

function rampPoint(u: number, h: number): [number, number] {
  return [RAMP_X0 + (LCX - RAMP_X0) * u, BOT - h * PX30 * (1 - u) * (1 - u)];
}

const case30: OCase = {
  n: 30,
  title: "Ύψος για λούπα",
  what: "Ένα μικρό σώμα αφήνεται από ηρεμία σε ύψος h, κατεβαίνει χωρίς τριβές και μπαίνει σε λούπα. Από αρκετό ύψος κάνει όλη τη λούπα. Από λίγο πιο χαμηλά ξεκολλάει.",
  given: "Ακτίνα λούπας R = 2 m, χωρίς τριβές, το σώμα ξεκινά από ηρεμία. Δοκιμάζουμε h = 5 m και h = 4 m.",
  ask: "Το ελάχιστο ύψος h_{min} για να κάνει ολόκληρη τη λούπα.",
  period: 12.5,
  legend: ["v", "F"],
  phases: [
    {
      until: 4.4,
      label: "Από h = 5 m",
      say: "Αφήνεται από 5 m = 2,5R. Στην κορυφή της λούπας φτάνει με υ² = gR: η N μηδενίζεται για μια στιγμή, αλλά περνάει. Είναι το οριακό ύψος.",
    },
    {
      until: 8,
      label: "Γιατί 5R/2",
      say: "Στην κορυφή, όριο N = 0: υ_{π}² = gR. ΑΔΜΕ από την αφετηρία ως την κορυφή (ύψος 2R): mgh = mg·2R + ½mυ_{π}² ⇒ h = 2R + R/2 = 5R/2 = 5 m.",
    },
    {
      until: 12.5,
      label: "Από h = 4 m",
      say: "Από 4 m δεν φτάνει: η N μηδενίζεται πριν από την κορυφή (ημθ = 2/3 πάνω από το κέντρο). Το σώμα ξεκολλάει και κάνει πλάγια βολή.",
    },
  ],
  Scene: ({ t }) => {
    const p3 = t >= 8;
    const h = p3 ? 4 : 5;
    const local = p3 ? t - 8 : t < 4.4 ? t : t - 4.4;
    const rampT = 1.3;
    const rate = 0.32;
    let x: number;
    let y: number;
    let v2 = 0;
    let th = -Math.PI / 2;
    let free = false;
    let onLoop = false;
    let trail = "";
    if (local < rampT) {
      const u = Math.pow(local / rampT, 1.6);
      [x, y] = rampPoint(u, h);
      v2 = 2 * 10 * h * (1 - (1 - u) * (1 - u));
    } else {
      onLoop = true;
      const s = loopState(local - rampT, 20 * h, 2, rate, p3 ? 2 / 3 : 2);
      th = s.th;
      v2 = s.v2;
      if (s.stopped && p3) {
        const [x0, y0] = P(LCX, LCY, LRp - 6, th);
        const v = Math.sqrt(s.v2);
        const u = tang(th);
        const tau = Math.max(0, (local - rampT - s.tStop) * 0.25);
        x = x0 + u[0] * v * tau * PX30;
        y = y0 + (u[1] * v * tau + 5 * tau * tau) * PX30;
        free = true;
        // fly until the body meets the track again
        let tEnd = tau;
        for (let q = 0; q <= tau; q += 0.005) {
          const xq = x0 + u[0] * v * q * PX30;
          const yq = y0 + (u[1] * v * q + 5 * q * q) * PX30;
          if (q > 0.1 && Math.hypot(xq - LCX, yq - LCY) > LRp - 6) {
            tEnd = q;
            break;
          }
        }
        x = x0 + u[0] * v * tEnd * PX30;
        y = y0 + (u[1] * v * tEnd + 5 * tEnd * tEnd) * PX30;
        trail = Array.from({ length: 20 }, (_, i) => {
          const q = (i / 19) * tEnd;
          return `${i ? "L" : "M"}${(x0 + u[0] * v * q * PX30).toFixed(1)},${(y0 + (u[1] * v * q + 5 * q * q) * PX30).toFixed(1)}`;
        }).join(" ");
      } else {
        [x, y] = P(LCX, LCY, LRp - 6, th);
      }
    }
    const N = onLoop && !free ? v2 / 2 - 10 * Math.sin(th) : 0; // per unit mass: υ²/R − g·sinθ
    const ramp = Array.from({ length: 30 }, (_, i) => rampPoint(i / 29, h));
    return (
      <g>
        <path d={ramp.map(([a, b], i) => `${i ? "L" : "M"}${a.toFixed(1)},${b.toFixed(1)}`).join(" ")} fill="none" stroke={K.track} strokeWidth={3} />
        <line x1={LCX} y1={BOT} x2={356} y2={BOT} stroke={K.track} strokeWidth={3} />
        <circle cx={LCX} cy={LCY} r={LRp} fill="none" stroke={K.track} strokeWidth={3} />
        <line x1={RAMP_X0 - 8} y1={BOT} x2={RAMP_X0 - 8} y2={BOT - h * PX30} stroke={C.muted} />
        <T x={RAMP_X0 - 4} y={BOT - (h * PX30) / 2} s={`h = ${h} m`} size={10} color={C.muted} anchor="start" />
        {trail ? <path d={trail} fill="none" stroke={K.v} strokeDasharray="3 3" /> : null}
        <Ball cx={x} cy={y} r={6} />
        {!free ? <Along x={x} y={y} u={onLoop ? tang(th) : [1, 0]} len={Math.sqrt(v2) * 2.4} color={K.v} label="υ" labelSide="above" /> : null}
        {onLoop && !free && N > 0.3 ? <Along x={x} y={y} u={inward(th)} len={N * 1.6} color={K.F} label="N" labelSide="below" /> : null}
        <Tag x={12} y={200} s="ξεκόλλησε!" color={K.F} show={free} />
        <Panel
          x={12}
          y={8}
          w={150}
          size={9.5}
          lines={
            t < 4.4
              ? ["h = 5 m = 2,5R", "κορυφή: υ² = gR", "N = 0 ακριβώς"]
              : t < 8
                ? ["ΑΔΜΕ αφετηρία → κορυφή", "mgh = mg·2R + ½mυ²", "υ² = gR ⇒ h = 5R/2", "h_{min} = 5 m"]
                : ["h = 4 m < 5 m", "N = 0 όταν ημθ = 2/3", "⇒ ξεκολλάει"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      Κορυφή, όριο N = 0: υ<sub>π</sub>² = gR. ΑΔΜΕ: mgh = mg·2R + ½m·gR ⇒ <b>h<sub>min</sub> = 5R/2 = 5·2/2 = 5 m</b>.
    </>
  ),
  trap: "Δεν αρκεί h = 2R (όσο το ύψος της λούπας). Στην κορυφή το σώμα πρέπει να έχει ακόμα ταχύτητα √(gR), αλλιώς ξεκολλάει πιο πριν.",
};

export const section6 = [case26, case27, case28, case29, case30];
