"use client";

import { Ball, C, StickPerson, T, Tag, lerp, num, seg } from "@/components/mixalis/ormi/kit";
import { Along, Angle, ArcPath, Block, CarBack, K, MagBars, Orbit, P, Panel, inward, tang, type OCase } from "./kit2";

const CX = 100;
const CY = 92;
const R = 62;

/** Screen rotation (degrees) that points a top-view block along the motion at θ. */
const heading = (th: number) => {
  const [ux, uy] = tang(th);
  return (Math.atan2(uy, ux) * 180) / Math.PI;
};

/* ───────── 6. Στροφή με κλίση ───────── */
const PHI = Math.atan(0.4); // εφφ = 0,4
const case6: OCase = {
  n: 6,
  title: "Στροφή με κλίση",
  what: "Ένα αυτοκίνητο παίρνει στροφή σε δρόμο που γέρνει προς το κέντρο της στροφής. Το βλέπουμε από πίσω. Δείχνει πώς η κάθετη δύναμη του δρόμου δίνει μόνη της την κεντρομόλο, χωρίς τριβή.",
  given: "m = 1000 kg, ακτίνα στροφής R = 100 m, ταχύτητα υ = 20 m/s. Ο δρόμος είναι λείος (χωρίς τριβή).",
  ask: "Την κλίση φ του δρόμου (την εφφ) και την κάθετη δύναμη N.",
  period: 10.5,
  legend: ["F"],
  phases: [
    {
      until: 3.5,
      label: "Δύο δυνάμεις",
      say: "Πάνω στο αυτοκίνητο ασκούνται μόνο δύο δυνάμεις: το βάρος mg (κατακόρυφα) και η κάθετη δύναμη N (κάθετα στον δρόμο, άρα γερμένη προς το κέντρο).",
    },
    {
      until: 7,
      label: "Ανάλυση της N",
      say: "Αναλύουμε την N σε κατακόρυφη N·συνφ και οριζόντια N·ημφ. Η κατακόρυφη ισορροπεί το βάρος: N·συνφ = mg. Η οριζόντια δείχνει στο κέντρο της στροφής.",
    },
    {
      until: 10.5,
      label: "Κεντρομόλος",
      say: "Η N·ημφ είναι η κεντρομόλος: N·ημφ = mυ²/R. Διαιρώντας κατά μέλη: εφφ = υ²/(gR) = 400/1000 = 0,4. Η μάζα φεύγει!",
    },
  ],
  Scene: ({ t }) => {
    const x0 = 22;
    const y0 = 172;
    const slope = Math.tan(PHI);
    const roadY = (x: number) => y0 - slope * (x - x0);
    const cxCar = 118;
    const cyRoad = roadY(cxCar);
    const nU: [number, number] = [-Math.sin(PHI), -Math.cos(PHI)];
    const ax = cxCar + nU[0] * 16;
    const ay = cyRoad + nU[1] * 16 - 2;
    const k = 0.0062; // px per N
    const mg = 10000;
    const N = mg / Math.cos(PHI);
    const p2 = t >= 3.5;
    const p3 = t >= 7;
    return (
      <g>
        <path d={`M ${x0} ${y0} L 196 ${roadY(196)} L 196 ${y0} Z`} fill="#e9e4da" stroke={C.edge} strokeWidth={1.4} />
        <line x1={x0} y1={y0} x2={196} y2={y0} stroke={C.ground} strokeWidth={1} strokeDasharray="4 3" />
        <Angle cx={x0} cy={y0} r={26} a0={0} a1={PHI} label="φ" />
        <CarBack x={cxCar} y={cyRoad} rot={(-PHI * 180) / Math.PI} />
        <circle cx={ax} cy={ay} r={2.4} fill={C.ink} />
        <Along x={ax} y={ay} u={nU} len={N * k} color={K.F} label="N" width={3} labelSide="left" opacity={p2 ? 0.45 : 1} />
        <Along x={ax} y={ay} u={[0, 1]} len={mg * k} color={K.g} label="mg" width={3} labelSide="right" />
        {p2 ? (
          <g opacity={seg(t, 3.5, 4.2)}>
            <Along x={ax} y={ay} u={[0, -1]} len={mg * k} color={K.F} label="N·συνφ" dashed labelSide="right" opacity={p3 ? 0.4 : 1} />
            <Along x={ax} y={ay} u={[-1, 0]} len={N * Math.sin(PHI) * k} color={p3 ? "#8f1d16" : K.F} dashed={!p3} width={p3 ? 3.6 : 2.6} />
            <T x={ax - N * Math.sin(PHI) * k - 5} y={ay + 4} s={p3 ? "ΣF = N·ημφ" : "N·ημφ"} size={11} color={p3 ? "#8f1d16" : K.F} anchor="end" italic />
          </g>
        ) : null}
        <T x={14} y={26} s="← κέντρο της στροφής" size={10} color={C.muted} anchor="start" bold={false} />
        <Panel
          x={206}
          y={14}
          w={148}
          lines={
            !p2
              ? ["Δυνάμεις", "βάρος: mg = 10000 N", "κάθετη: N ⊥ δρόμο", "τριβή: καμία"]
              : !p3
                ? ["Κατακόρυφα: ισορροπία", "N·συνφ = mg", "Οριζόντια: προς κέντρο", "N·ημφ = mυ²/R"]
                : ["Κατά μέλη", "εφφ = υ²/(gR)", "εφφ = 400/1000 = 0,4", "N = mg/συνφ ≈ 10770 N"]
          }
        />
        <MagBars
          y={150}
          x={206}
          w={150}
          max={11000}
          unit="N"
          items={[
            { label: "mg", value: mg, color: K.g },
            { label: "N", value: N, color: K.F },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      N·συνφ = mg και N·ημφ = mυ²/R. Κατά μέλη: <b>εφφ = υ²/(gR) = 20²/(10·100) = 0,4</b> (φ ≈ 22°). <b>N = mg/συνφ = 10000·√1,16 ≈ 10770 N</b>.
    </>
  ),
  trap: "Η N δεν είναι ίση με mg στον κεκλιμένο δρόμο: είναι μεγαλύτερη (N = mg/συνφ), γιατί μόνο η κατακόρυφη συνιστώσα της ισορροπεί το βάρος.",
};

/* ───────── 7. Λείο τραπέζι ───────── */
const case7: OCase = {
  n: 7,
  title: "Λείο τραπέζι (κάτοψη)",
  what: "Ένα σώμα γλιστράει σε κύκλο πάνω σε λείο τραπέζι, δεμένο με νήμα σε καρφί στο κέντρο. Δείχνει ότι εδώ την κεντρομόλο τη δίνει μόνο η τάση του νήματος.",
  given: "m = 0,5 kg, μήκος νήματος R = 0,4 m, υ = 2 m/s, τραπέζι λείο.",
  ask: "Την τάση T του νήματος και την κάθετη δύναμη N του τραπεζιού.",
  period: 11,
  legend: ["v", "F"],
  phases: [
    {
      until: 4,
      label: "Από πάνω",
      say: "Κοιτάμε από ψηλά. Η μόνη οριζόντια δύναμη είναι η τάση T, που τραβά το σώμα προς το καρφί. Αυτή είναι η κεντρομόλος: T = mυ²/R = 5 N.",
    },
    {
      until: 7.5,
      label: "Από το πλάι",
      say: "Από το πλάι βλέπουμε και τις κατακόρυφες: βάρος mg και κάθετη N. Κατακόρυφα δεν κινείται, άρα N = mg = 5 N. Αυτές δεν μπαίνουν στην κεντρομόλο.",
    },
    {
      until: 11,
      label: "Κόβεται το νήμα",
      say: "Αν κοπεί το νήμα, χάνεται η κεντρομόλος. Το σώμα φεύγει σε ευθεία, πάνω στην εφαπτομένη (όχι προς τα έξω, ακτινικά!).",
    },
  ],
  Scene: ({ t }) => {
    const om = 1.4;
    const p2 = t >= 4 && t < 7.5;
    const p3 = t >= 7.5;
    const cut = 8.6;
    let th: number;
    let x: number;
    let y: number;
    if (!p3 || t < cut) {
      th = 0.4 + om * (p3 ? t - 7.5 : t);
      [x, y] = P(CX, CY, R, th);
    } else {
      th = 0.4 + om * (cut - 7.5);
      const [x0, y0] = P(CX, CY, R, th);
      const u = tang(th);
      const d = om * R * (t - cut);
      x = x0 + u[0] * d;
      y = y0 + u[1] * d;
    }
    const attached = !p3 || t < cut;
    return (
      <g>
        <rect x={20} y={14} width={162} height={160} rx={8} fill="#efe6d8" stroke="#c9b79c" />
        <Orbit cx={CX} cy={CY} r={R} showCentre={false} />
        {attached ? <line x1={CX} y1={CY} x2={x} y2={y} stroke={C.ink} strokeWidth={1.4} /> : null}
        {p3 && !attached ? (
          <g>
            <line x1={CX} y1={CY} x2={P(CX, CY, R * 0.55, th)[0]} y2={P(CX, CY, R * 0.55, th)[1]} stroke={C.ink} strokeWidth={1.4} />
            <line x1={P(CX, CY, R, th)[0]} y1={P(CX, CY, R, th)[1]} x2={x} y2={y} stroke={C.v} strokeWidth={1} strokeDasharray="4 3" />
          </g>
        ) : null}
        <circle cx={CX} cy={CY} r={3.4} fill="#6b6b6b" />
        <Block x={x} y={y} w={16} h={16} rot={heading(th)} />
        {(!p2 || true) && (
          <Along x={x} y={y} u={tang(th)} len={34} color={K.v} label="υ" labelSide="right" />
        )}
        {attached ? <Along x={x} y={y} u={inward(th)} len={30} color={K.F} label="T" width={3} labelSide="below" /> : null}
        <T x={28} y={30} s="κάτοψη" size={9.5} color={C.muted} anchor="start" bold={false} />
        {p2 ? (
          <g>
            <rect x={206} y={92} width={148} height={110} rx={8} fill="#ffffff" stroke="#d6dae1" />
            <T x={212} y={106} s="πλάγια όψη" size={9.5} color={C.muted} anchor="start" bold={false} />
            <line x1={214} y1={160} x2={346} y2={160} stroke={C.ground} strokeWidth={3} />
            <circle cx={226} cy={152} r={2.6} fill="#6b6b6b" />
            <line x1={226} y1={150} x2={300} y2={150} stroke={C.ink} strokeWidth={1.2} />
            <Block x={308} y={152} w={18} h={16} />
            <Along x={308} y={152} u={[0, -1]} len={32} color={K.F} label="N" labelSide="right" />
            <Along x={308} y={152} u={[0, 1]} len={32} color={K.g} label="mg" labelSide="right" />
            <Along x={300} y={150} u={[-1, 0]} len={30} color={K.F} label="T" labelSide="above" />
          </g>
        ) : null}
        <Panel
          x={206}
          y={14}
          w={148}
          lines={p3 ? ["Χωρίς νήμα", "ΣF = 0 οριζόντια", "⇒ ευθύγραμμη ομαλή", "πάνω στην εφαπτομένη"] : ["Κεντρομόλος = T", "T = mυ²/R", "T = 0,5·4/0,4 = 5 N", "N = mg = 5 N"]}
        />
        <Tag x={214} y={186} s="κόπηκε!" color={K.F} show={p3 && t > cut} />
      </g>
    );
  },
  solve: (
    <>
      <b>T = mυ²/R = 0,5·2²/0,4 = 5 N</b>. Κατακόρυφα ισορροπία: <b>N = mg = 0,5·10 = 5 N</b>.
    </>
  ),
  trap: "Όταν κοπεί το νήμα το σώμα δεν «πετάγεται προς τα έξω». Συνεχίζει ευθεία με την ταχύτητα που είχε, κατά την εφαπτομένη.",
};

/* ───────── 8. Οριζόντια στροφή με τριβή ───────── */
const case8: OCase = {
  n: 8,
  title: "Οριζόντια στροφή",
  what: "Αυτοκίνητο σε επίπεδη στροφή, από ψηλά. Την κεντρομόλο τη δίνει η στατική τριβή των ελαστικών. Αν πάει πολύ γρήγορα, η τριβή δεν φτάνει και το αυτοκίνητο ξεφεύγει.",
  given: "m = 1000 kg, R = 50 m, συντελεστής στατικής τριβής μ_σ = 0,8.",
  ask: "Την τριβή που χρειάζεται με υ = 10 m/s και τη μέγιστη ταχύτητα υ_{max} για να μη γλιστρήσει.",
  period: 10.5,
  legend: ["v", "F"],
  phases: [
    {
      until: 3.5,
      label: "Με 10 m/s",
      say: "Η στατική τριβή T_σ δείχνει προς το κέντρο (εμποδίζει το αυτοκίνητο να γλιστρήσει προς τα έξω). Χρειάζεται T_σ = mυ²/R = 2000 N, ενώ η μέγιστη είναι μ_σ·mg = 8000 N.",
    },
    {
      until: 7,
      label: "Πιο γρήγορα",
      say: "Η υ ανεβαίνει ως 20 m/s. Η τριβή που χρειάζεται μεγαλώνει με το υ²: στα 20 m/s φτάνει ακριβώς τη μέγιστη (8000 N). Αυτή είναι η υ_{max}.",
    },
    {
      until: 10.5,
      label: "Πάνω από υ_{max}",
      say: "Με 25 m/s θα χρειαζόταν 12500 N, αλλά η τριβή δεν μπορεί να δώσει πάνω από 8000 N. Η κεντρομόλος δεν φτάνει και το αυτοκίνητο ανοίγει προς τα έξω.",
    },
  ],
  Scene: ({ t }) => {
    let v: number;
    if (t < 3.5) v = 10;
    else if (t < 7) v = lerp(10, 20, seg(t, 3.7, 6.6));
    else v = 25;
    const need = (1000 * v * v) / 50;
    const Fmax = 8000;
    const supplied = Math.min(need, Fmax);
    const p3 = t >= 7;
    const omScreen = 0.1 * v; // rad/s shown
    const start = p3 ? 7 : 0;
    const th = 0.2 + omScreen * (t - start) * (p3 ? 0.8 : 1);
    const slide = p3 ? Math.pow(seg(t, 7.6, 10.3), 1.6) * 70 : 0;
    const r = R + slide;
    const [x, y] = P(CX, CY, r, th);
    const k = 0.005;
    return (
      <g>
        <circle cx={CX} cy={CY} r={R + 12} fill="none" stroke="#c8ccd3" strokeWidth={18} />
        <Orbit cx={CX} cy={CY} r={R} label="κέντρο" />
        <Block x={x} y={y} w={22} h={12} rot={heading(th)} fill="#7fa7d9" />
        <Along x={x} y={y} u={tang(th)} len={v * 1.6} color={K.v} label="υ" labelSide="right" />
        <Along x={x} y={y} u={inward(th)} len={supplied * k} color={K.F} label="T_σ" width={3} labelSide="below" />
        <Tag x={12} y={22} s="από πάνω" color={C.muted} />
        <Tag x={12} y={196} s="γλιστράει προς τα έξω!" color={K.F} show={p3 && slide > 4} />
        <Panel
          x={206}
          y={14}
          w={148}
          lines={[`υ = ${num(v, 1)} m/s`, `χρειάζεται: ${num(need, 0)} N`, "μέγιστη: μ_σ·mg = 8000 N", p3 ? "δεν φτάνει ✗" : need >= Fmax - 1 ? "ακριβώς στο όριο" : "φτάνει ✓"]}
        />
        <MagBars
          y={150}
          x={206}
          w={150}
          max={12500}
          unit="N"
          items={[
            { label: "χρειάζ.", value: need, color: K.F },
            { label: "T_{σ,max}", value: Fmax, color: C.muted },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      Με 10 m/s: <b>T_σ = mυ²/R = 1000·100/50 = 2000 N</b> (&lt; 8000 N, άρα δεν γλιστράει). Όριο: mυ²/R ≤ μ_σ·mg ⇒ <b>υ<sub>max</sub> = √(μ_σ·g·R) = √(0,8·10·50) = 20 m/s</b> (72 km/h).
    </>
  ),
  trap: "Η στατική τριβή δεν είναι πάντα μ_σ·N. Είναι όση χρειάζεται (εδώ 2000 N) μέχρι το μέγιστο μ_σ·N. Το μ_σ·N το γράφεις μόνο στο όριο.",
};

/* ───────── 9. Περιστρεφόμενος δίσκος ───────── */
const case9: OCase = {
  n: 9,
  title: "Περιστρεφόμενος δίσκος",
  what: "Ένα κέρμα πάνω σε δίσκο που γυρίζει όλο και πιο γρήγορα. Η στατική τριβή κρατά το κέρμα σε κύκλο, μέχρι το ω να γίνει τόσο μεγάλο που η τριβή δεν φτάνει.",
  given: "Κέρμα m = 0,1 kg σε απόσταση r = 0,2 m από τον άξονα, μ_σ = 0,5.",
  ask: "Τη μέγιστη γωνιακή ταχύτητα ω_{max} του δίσκου ώστε το κέρμα να μη γλιστρήσει.",
  period: 10.5,
  legend: ["F"],
  phases: [
    {
      until: 3.5,
      label: "Γυρίζει αργά",
      say: "Με ω = 2 rad/s χρειάζεται T_σ = mω²r = 0,1·4·0,2 = 0,08 N. Η μέγιστη στατική τριβή είναι μ_σ·mg = 0,5 N, άρα το κέρμα «κρατιέται» άνετα.",
    },
    {
      until: 7,
      label: "Αυξάνεται το ω",
      say: "Το ω ανεβαίνει ως 5 rad/s. Η τριβή που χρειάζεται μεγαλώνει με το ω² και στα 5 rad/s γίνεται 0,5 N: ακριβώς η μέγιστη.",
    },
    {
      until: 10.5,
      label: "Γλιστράει",
      say: "Με ω = 6 rad/s θα χρειαζόταν 0,72 N. Η τριβή δεν φτάνει, το κέρμα γλιστράει πάνω στον δίσκο προς τα έξω και πέφτει.",
    },
  ],
  Scene: ({ t }) => {
    let w: number;
    if (t < 3.5) w = 2;
    else if (t < 7) w = lerp(2, 5, seg(t, 3.7, 6.6));
    else w = 6;
    const need = 0.1 * w * w * 0.2;
    const Fmax = 0.5;
    const p3 = t >= 7;
    // disk angle: integrate a shown speed of 0.35·ω
    const disk = 0.35 * (t < 3.5 ? 2 * t : t < 7 ? 7 + (t - 3.5) * (2 + w) / 2 : 7 + 3.5 * 3.5 + 6 * (t - 7));
    const r0 = 40;
    const slide = p3 ? Math.pow(seg(t, 7.6, 10.2), 1.7) * 52 : 0;
    const coinAng = disk + 0.6 - (p3 ? slide * 0.012 : 0);
    const [x, y] = P(CX, CY, r0 + slide, coinAng);
    const marks = [0, 1, 2, 3, 4, 5].map((i) => P(CX, CY, R - 6, disk + (i * Math.PI) / 3));
    return (
      <g>
        <circle cx={CX} cy={CY} r={R + 4} fill="#eef1f6" stroke={C.edge} strokeWidth={1.3} />
        {marks.map(([mx, my], i) => (
          <circle key={i} cx={mx} cy={my} r={2} fill={C.faint} />
        ))}
        <circle cx={CX} cy={CY} r={2.8} fill={C.ink} />
        <ArcPath cx={CX} cy={CY} r={R + 14} a0={0.3} a1={1.2} color={C.muted} />
        <Along x={P(CX, CY, R + 14, 1.15)[0]} y={P(CX, CY, R + 14, 1.15)[1]} u={tang(1.2)} len={6} color={C.muted} />
        <T x={P(CX, CY, R + 24, 0.75)[0]} y={P(CX, CY, R + 24, 0.75)[1]} s="ω" size={11} color={C.muted} italic />
        <Ball cx={x} cy={y} r={6} fill="#e6c35c" />
        {!p3 || slide < 2 ? <Along x={x} y={y} u={inward(coinAng)} len={(need / Fmax) * 30} color={K.F} label="T_σ" width={3} labelSide="below" /> : null}
        <Tag x={12} y={196} s="γλιστράει!" color={K.F} show={p3 && slide > 3} />
        <Panel x={206} y={14} w={148} lines={[`ω = ${num(w, 1)} rad/s`, `χρειάζεται mω²r = ${num(need, 2)} N`, "μέγιστη μ_σ·mg = 0,5 N", p3 ? "δεν φτάνει ✗" : need >= Fmax - 0.001 ? "ακριβώς στο όριο" : "φτάνει ✓"]} />
        <MagBars
          y={150}
          x={206}
          w={150}
          max={0.75}
          unit="N"
          items={[
            { label: "χρειάζ.", value: need, color: K.F },
            { label: "T_{σ,max}", value: Fmax, color: C.muted },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      Για να μη γλιστρήσει: mω²r ≤ μ_σ·mg ⇒ ω² ≤ μ_σ·g/r = 0,5·10/0,2 = 25 ⇒ <b>ω<sub>max</sub> = 5 rad/s</b>. Η μάζα του κέρματος δεν παίζει ρόλο.
    </>
  ),
  trap: "Πιο έξω (μεγαλύτερο r) το κέρμα γλιστράει πιο νωρίς, γιατί χρειάζεται περισσότερη τριβή για το ίδιο ω.",
};

/* ───────── 10. Ρότορας ───────── */
const case10: OCase = {
  n: 10,
  title: "Ρότορας (κύλινδρος)",
  what: "Ο «ρότορας» του λούνα παρκ: ένας μεγάλος κύλινδρος γυρίζει, ο επιβάτης κολλάει στον τοίχο και μετά το πάτωμα φεύγει. Τον κρατά η στατική τριβή με τον τοίχο.",
  given: "Ακτίνα κυλίνδρου R = 2 m, μ_σ = 0,5 ανάμεσα στον επιβάτη και τον τοίχο, m = 50 kg.",
  ask: "Την ελάχιστη γωνιακή ταχύτητα ω_{min} ώστε ο επιβάτης να μη γλιστρήσει όταν φύγει το πάτωμα.",
  period: 10.5,
  legend: ["F"],
  phases: [
    {
      until: 3.5,
      label: "Γυρίζει",
      say: "Ο τοίχος σπρώχνει τον επιβάτη προς τον άξονα με την κάθετη δύναμη N: αυτή είναι η κεντρομόλος, N = mω²R. Με ω = 4 rad/s: N = 50·16·2 = 1600 N.",
    },
    {
      until: 7,
      label: "Φεύγει το πάτωμα",
      say: "Το πάτωμα κατεβαίνει. Τώρα το βάρος (500 N) το κρατά μόνο η στατική τριβή του τοίχου, προς τα πάνω: T_σ = mg. Η μέγιστη τριβή είναι μ_σ·N = 800 N, άρα φτάνει.",
    },
    {
      until: 10.5,
      label: "Με μικρό ω",
      say: "Με ω = 3 rad/s: N = 900 N και μέγιστη τριβή 450 N < 500 N. Η τριβή δεν φτάνει και ο επιβάτης γλιστράει προς τα κάτω. Όριο: ω_{min} = √(g/(μ_σR)) ≈ 3,16 rad/s.",
    },
  ],
  Scene: ({ t }) => {
    const p2 = t >= 3.5;
    const p3 = t >= 7;
    const w = p3 ? 3 : 4;
    const N = 50 * w * w * 2;
    const fmax = 0.5 * N;
    const mg = 500;
    const fric = p2 ? Math.min(mg, fmax) : 0;
    const floorDrop = p2 && !p3 ? seg(t, 3.8, 5.5) * 26 : p3 ? 26 : 0;
    const slideDown = p3 ? Math.pow(seg(t, 7.8, 10.2), 1.5) * 34 : 0;
    const wallX = 32;
    const axisX = 132;
    const floorY = 176 + floorDrop;
    const feetY = 176 + slideDown;
    const px = wallX + 12;
    const midY = feetY - 36;
    const k = 0.04;
    return (
      <g>
        <line x1={wallX} y1={26} x2={wallX} y2={204} stroke={C.edge} strokeWidth={4} />
        <line x1={232} y1={26} x2={232} y2={204} stroke={C.edge} strokeWidth={4} />
        <line x1={axisX} y1={20} x2={axisX} y2={206} stroke={C.faint} strokeDasharray="5 4" />
        <path d={`M ${axisX - 22} 30 A 22 6 0 1 0 ${axisX + 22} 30`} fill="none" stroke={C.muted} strokeWidth={1.2} />
        <T x={axisX + 30} y={24} s="ω" size={11} color={C.muted} italic />
        <rect x={wallX + 2} y={floorY} width={198} height={6} fill="#b9ab9b" />
        <StickPerson x={px} y={feetY} scale={1.5} />
        <Along x={wallX + 2} y={midY - 12} u={[1, 0]} len={N * k} color={K.F} label="N" width={3} labelSide="above" />
        <Along x={px + 12} y={midY} u={[0, 1]} len={mg * 0.08} color={K.g} label="mg" labelSide="right" />
        {p2 && slideDown < 1 ? <Along x={wallX + 5} y={midY + 4} u={[0, -1]} len={fric * 0.08} color={K.F} label="T_σ" labelSide="left" /> : null}
        {p3 && slideDown >= 1 ? <Along x={wallX + 5} y={midY + 4} u={[0, -1]} len={fmax * 0.08} color={K.F} label="T_σ" labelSide="left" opacity={0.7} /> : null}
        <Tag x={150} y={196} s="το πάτωμα φεύγει" color={C.muted} show={p2 && !p3} />
        <Tag x={150} y={196} s="γλιστράει κάτω!" color={K.F} show={p3 && slideDown > 3} />
        <Panel
          x={242}
          y={14}
          w={114}
          size={9.5}
          lines={[`ω = ${w} rad/s`, `N = mω²R = ${num(N, 0)} N`, `T_{σ,max} = ${num(fmax, 0)} N`, `mg = 500 N`, fmax >= mg ? "κρατιέται ✓" : "γλιστράει ✗"]}
        />
        
      </g>
    );
  },
  solve: (
    <>
      N = mω²R και T_σ = mg. Για να μη γλιστρήσει: mg ≤ μ_σ·N = μ_σ·mω²R ⇒ <b>ω ≥ √(g/(μ_σR)) = √(10/(0,5·2)) = √10 ≈ 3,16 rad/s</b>. Δεν εξαρτάται από τη μάζα: όλοι οι
      επιβάτες μένουν πάνω στον τοίχο.
    </>
  ),
  trap: "Εδώ η κεντρομόλος είναι η κάθετη N (οριζόντια) και η τριβή είναι κατακόρυφη. Μην τις μπερδέψεις με την οριζόντια στροφή, όπου την κεντρομόλο τη δίνει η τριβή.",
};

export const section2 = [case6, case7, case8, case9, case10];
