"use client";

import { Ball, C, T, Tag, lerp, num, seg } from "@/components/mixalis/ormi/kit";
import { Along, Angle, K, MagBars, Orbit, P, Panel, inward, loopState, tang, type OCase } from "./kit2";

/* Vertical circle on a string: m = 0,2 kg (mg = 2 N), R = 0,5 m. */
const CX = 100;
const CY = 102;
const RP = 64; // px for R = 0,5 m
const PXM = RP / 0.5;
const k = 3.5; // px per N
const MG = 2;

/** Tension anywhere on the circle when υ at the bottom is 6 m/s: T = 10,4 − 6·sinθ. */
/** Shown time for loopState to bring the body from the bottom to angle `target`. */
function timeTo(target: number, v2b: number, rate: number) {
  let lo = 0;
  let hi = 20;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (loopState(mid, v2b, 0.5, rate).th < target) lo = mid;
    else hi = mid;
  }
  return lo;
}
const T16 = timeTo(0, 35, 0.05);
const T16end = timeTo(1.2, 35, 0.05);
const T19 = timeTo(Math.PI / 2, 36, 0.2);

const tension6 = (th: number) => 0.4 * (36 - 10 * (1 + Math.sin(th))) - MG * Math.sin(th);

function StringBody({ th, slack = false, x, y }: { th: number; slack?: boolean; x?: number; y?: number }) {
  const [bx, by] = x !== undefined && y !== undefined ? [x, y] : P(CX, CY, RP, th);
  return (
    <g>
      {slack ? (
        <path d={`M ${CX} ${CY} Q ${(CX + bx) / 2 + 10} ${(CY + by) / 2 + 14} ${bx} ${by}`} fill="none" stroke={C.ink} strokeWidth={1.2} strokeDasharray="2 2" />
      ) : (
        <line x1={CX} y1={CY} x2={bx} y2={by} stroke={C.ink} strokeWidth={1.4} />
      )}
      <Ball cx={bx} cy={by} r={8} />
    </g>
  );
}

const pivot = (
  <g>
    <circle cx={CX} cy={CY} r={3.4} fill={C.ink} />
    <T x={CX - 8} y={CY + 4} s="O" size={10} color={C.muted} italic anchor="end" />
  </g>
);

/* ───────── 16. Οριζόντια θέση ───────── */
const case16: OCase = {
  n: 16,
  title: "Οριζόντια θέση",
  what: "Σώμα δεμένο σε νήμα γυρίζει σε κατακόρυφο κύκλο. Το κοιτάμε τη στιγμή που περνά από την οριζόντια θέση, στο ύψος του κέντρου.",
  given: "m = 0,2 kg, μήκος νήματος R = 0,5 m. Στην οριζόντια θέση η ταχύτητα είναι υ = 5 m/s (προς τα πάνω).",
  ask: "Την τάση του νήματος T σε αυτή τη θέση. Τι κάνει το βάρος;",
  period: 10.5,
  legend: ["v", "F"],
  phases: [
    {
      until: 3.5,
      label: "Στο πλάι",
      say: "Το σώμα φτάνει στην οριζόντια θέση. Η τάση T δείχνει οριζόντια προς το κέντρο O. Το βάρος mg δείχνει κάτω, δηλαδή κάθετα στην ακτίνα.",
    },
    {
      until: 7,
      label: "Μόνο η T",
      say: "Στη διεύθυνση της ακτίνας υπάρχει μόνο η T, άρα αυτή είναι η κεντρομόλος: T = mυ²/R = 0,2·25/0,5 = 10 N. Το βάρος δεν μπαίνει σε αυτή την εξίσωση.",
    },
    {
      until: 10.5,
      label: "Το βάρος φρενάρει",
      say: "Το βάρος είναι αντίθετο στην ταχύτητα: είναι επιτρόχια δύναμη και μικραίνει την υ (α_ε = g). Γι' αυτό η κίνηση δεν είναι ομαλή.",
    },
  ],
  Scene: ({ t }) => {
    let th: number;
    let v: number;
    if (t < 3.5) {
      th = lerp(-0.7, 0, seg(t, 0, 3.2));
      v = 5;
    } else if (t < 7) {
      th = 0;
      v = 5;
    } else {
      const s = loopState(Math.min(T16 + (t - 7) * 0.6, T16end), 35, 0.5, 0.05);
      th = s.th;
      v = Math.sqrt(s.v2);
    }
    const [x, y] = P(CX, CY, RP, th);
    const Tn = 0.4 * v * v - MG * Math.sin(th);
    return (
      <g>
        <Orbit cx={CX} cy={CY} r={RP} showCentre={false} />
        <StringBody th={th} />
        {pivot}
        <Along x={x} y={y} u={tang(th)} len={v * 7} color={K.v} label="υ" labelSide="right" />
        <Along x={x} y={y} u={inward(th)} len={Tn * k} color={K.F} label="T" width={3} labelSide="above" />
        <Along x={x + 4} y={y} u={[0, 1]} len={MG * k * 4} color={K.g} label="mg" labelSide="right" />
        {t >= 7 ? <Tag x={12} y={200} s="το βάρος μικραίνει την υ" color={K.g} /> : null}
        <Panel
          x={206}
          y={14}
          w={148}
          lines={
            t < 7
              ? ["Ακτινικά (προς O)", "μόνο η T", "T = mυ²/R", "T = 0,2·25/0,5 = 10 N"]
              : ["Επιτρόχια", "mg αντίθετη στην υ", "α_ε = g = 10 m/s²", `υ = ${num(v, 1)} m/s`]
          }
        />
        <MagBars x={206} y={150} w={150} max={12} items={[{ label: "T", value: Tn, color: K.F }, { label: "mg", value: MG, color: K.g }]} />
      </g>
    );
  },
  solve: (
    <>
      Ακτινικά μόνο η τάση: <b>T = mυ²/R = 0,2·5²/0,5 = 10 N</b>. Το βάρος είναι εφαπτομενικό, αντίθετο στην υ: επιβραδύνει το σώμα με α_ε = g.
    </>
  ),
  trap: "Στην οριζόντια θέση το mg δεν προστίθεται ούτε αφαιρείται από την T: είναι κάθετο στην ακτίνα.",
};

/* ───────── 17. Κατώτερη θέση ───────── */
const case17: OCase = {
  n: 17,
  title: "Κατώτερη θέση",
  what: "Το σώμα περνά από το χαμηλότερο σημείο του κύκλου. Εκεί η τάση και το βάρος είναι στην ίδια ευθεία αλλά αντίθετα: η τάση πρέπει να νικήσει το βάρος και να δώσει και την κεντρομόλο.",
  given: "m = 0,2 kg, R = 0,5 m. Στο κατώτερο σημείο υ = 6 m/s.",
  ask: "Την τάση του νήματος T στο κατώτερο σημείο.",
  period: 11,
  legend: ["v", "F"],
  phases: [
    {
      until: 3.5,
      label: "Στον πάτο",
      say: "Στο κατώτερο σημείο η T δείχνει πάνω (προς το O) και το mg κάτω (μακριά από το O). Θετική φορά: προς το κέντρο.",
    },
    {
      until: 7,
      label: "Η εξίσωση",
      say: "ΣF προς το κέντρο = mυ²/R: T − mg = mυ²/R ⇒ T = 2 + 0,2·36/0,5 = 2 + 14,4 = 16,4 N. Η τάση είναι πολύ μεγαλύτερη από το βάρος!",
    },
    {
      until: 11,
      label: "Ολόκληρος γύρος",
      say: "Αφήνουμε το σώμα να κάνει όλο τον κύκλο. Δες τη ράβδο της T: είναι μέγιστη στον πάτο (16,4 N) και ελάχιστη στην κορυφή (4,4 N). Εκεί σπάνε τα νήματα: στο κάτω σημείο.",
    },
  ],
  Scene: ({ t }) => {
    let th = -Math.PI / 2;
    let v = 6;
    if (t < 3.5) th = lerp(-Math.PI / 2 - 0.8, -Math.PI / 2, seg(t, 0, 3.2));
    else if (t >= 7) {
      const s = loopState(t - 7 + 0.001, 36, 0.5, 0.2);
      th = s.th;
      v = Math.sqrt(s.v2);
    }
    const [x, y] = P(CX, CY, RP, th);
    const Tn = t < 7 ? 16.4 : tension6(th);
    return (
      <g>
        <Orbit cx={CX} cy={CY} r={RP} showCentre={false} />
        <StringBody th={th} />
        {pivot}
        <Along x={x} y={y} u={tang(th)} len={v * 6} color={K.v} label="υ" labelSide="below" />
        <Along x={x - 3} y={y} u={inward(th)} len={Tn * k} color={K.F} label="T" width={3} labelSide="left" />
        <Along x={x + 3} y={y} u={[0, 1]} len={MG * k * 3} color={K.g} label="mg" labelSide="right" />
        <Panel
          x={206}
          y={14}
          w={148}
          lines={t < 3.5 ? ["Θετικά προς O", "T: +", "mg: −"] : t < 7 ? ["Κατώτερη θέση", "T − mg = mυ²/R", "T = 2 + 14,4", "T = 16,4 N"] : [`υ = ${num(v, 1)} m/s`, `T = ${num(Tn, 1)} N`, "μέγιστη στον πάτο"]}
        />
        <MagBars x={206} y={150} w={150} max={17} items={[{ label: "T", value: Tn, color: K.F }, { label: "mg", value: MG, color: K.g }]} />
      </g>
    );
  },
  solve: (
    <>
      Θετικά προς το κέντρο: T − mg = mυ²/R ⇒ <b>T = mg + mυ²/R = 2 + 0,2·36/0,5 = 16,4 N</b>.
    </>
  ),
  trap: "Στον πάτο η τάση δεν είναι ίση με το βάρος (αυτό ισχύει μόνο αν το σώμα κρέμεται ακίνητο). Όσο πιο γρήγορα, τόσο μεγαλύτερη.",
};

/* ───────── 18. Τυχαία θέση ───────── */
const PHI18 = (60 * Math.PI) / 180;
const case18: OCase = {
  n: 18,
  title: "Τυχαία θέση",
  what: "Το σώμα σε μια ενδιάμεση θέση, με το νήμα γερμένο κατά φ από την κατακόρυφη (από το κατώτερο σημείο). Εδώ το βάρος πρέπει να αναλυθεί.",
  given: "m = 0,2 kg, R = 0,5 m, φ = 60° από την κατώτερη θέση (συνφ = 0,5), υ = 5 m/s.",
  ask: "Την τάση T σε αυτή τη θέση.",
  period: 10.5,
  legend: ["v", "F"],
  phases: [
    {
      until: 3.5,
      label: "Δυνάμεις",
      say: "Η T δείχνει κατά μήκος του νήματος προς το O. Το βάρος δείχνει κατακόρυφα κάτω, δηλαδή ούτε στην ακτίνα ούτε στην εφαπτομένη.",
    },
    {
      until: 7,
      label: "Ανάλυση βάρους",
      say: "Αναλύουμε το mg: mg·συνφ στην ακτίνα (μακριά από το κέντρο, άρα με «−») και mg·ημφ στην εφαπτομένη (αυτό φρενάρει το σώμα).",
    },
    {
      until: 10.5,
      label: "Η εξίσωση",
      say: "Ακτινικά: T − mg·συνφ = mυ²/R ⇒ T = 2·0,5 + 0,2·25/0,5 = 1 + 10 = 11 N. Για φ = 0° βγαίνει ο τύπος του πάτου, για φ = 180° της κορυφής.",
    },
  ],
  Scene: ({ t }) => {
    const th = -Math.PI / 2 + PHI18;
    const [x, y] = P(CX, CY, RP, th);
    const n = inward(th);
    const out: [number, number] = [-n[0], -n[1]];
    const u = tang(th);
    const p2 = t >= 3.5;
    const kg = MG * k * 4;
    return (
      <g>
        <Orbit cx={CX} cy={CY} r={RP} showCentre={false} />
        <line x1={CX} y1={CY} x2={CX} y2={CY + RP + 14} stroke={C.faint} strokeDasharray="4 3" />
        <Angle cx={CX} cy={CY} r={22} a0={-Math.PI / 2} a1={th} label="φ" />
        <StringBody th={th} />
        {pivot}
        <Along x={x} y={y} u={u} len={5 * 6} color={K.v} label="υ" labelSide="right" />
        <Along x={x} y={y} u={n} len={11 * k} color={K.F} label="T" width={3} labelSide="above" opacity={t < 7 && p2 ? 0.5 : 1} />
        <Along x={x} y={y} u={[0, 1]} len={kg} color={K.g} label="mg" width={3} labelSide="left" opacity={p2 ? 0.45 : 1} />
        {p2 ? (
          <g opacity={seg(t, 3.5, 4.2)}>
            <Along x={x} y={y} u={out} len={kg * Math.cos(PHI18)} color={K.g} label="mg·συνφ" dashed labelSide="right" />
            <Along x={x} y={y} u={[-u[0], -u[1]]} len={kg * Math.sin(PHI18)} color={K.g} label="mg·ημφ" dashed labelSide="left" />
          </g>
        ) : null}
        <Panel
          x={206}
          y={14}
          w={148}
          lines={t < 7 ? ["Ανάλυση του mg", "ακτινικά: mg·συνφ = 1 N", "εφαπτ.: mg·ημφ ≈ 1,73 N"] : ["Ακτινικά (+ προς O)", "T − mg·συνφ = mυ²/R", "T = 1 + 10 = 11 N"]}
        />
        <MagBars x={206} y={150} w={150} max={12} items={[{ label: "T", value: 11, color: K.F }, { label: "mg", value: MG, color: K.g }]} />
      </g>
    );
  },
  solve: (
    <>
      Θετικά προς το κέντρο: T − mg·συνφ = mυ²/R ⇒ <b>T = 0,2·10·0,5 + 0,2·25/0,5 = 1 + 10 = 11 N</b>.
    </>
  ),
  trap: "Η φ εδώ μετριέται από την κατώτερη θέση. Αν μια άσκηση δίνει τη γωνία από την οριζόντια, η ακτινική συνιστώσα του βάρους γίνεται mg·ημ, όχι mg·συν.",
};

/* ───────── 19. Ανώτατη θέση ───────── */
const case19: OCase = {
  n: 19,
  title: "Ανώτατη θέση",
  what: "Το σώμα στην κορυφή του κύκλου. Εκεί τάση και βάρος δείχνουν και τα δύο προς τα κάτω, δηλαδή προς το κέντρο: συνεργάζονται.",
  given: "m = 0,2 kg, R = 0,5 m. Στην κορυφή υ = 4 m/s.",
  ask: "Την τάση του νήματος T στην κορυφή.",
  period: 10.5,
  legend: ["v", "F"],
  phases: [
    {
      until: 3.5,
      label: "Στην κορυφή",
      say: "Στο ανώτατο σημείο το κέντρο O είναι από κάτω. Η T τραβά προς τα κάτω (προς το O) και το βάρος επίσης. Και οι δύο μπαίνουν με «+».",
    },
    {
      until: 7,
      label: "Η εξίσωση",
      say: "T + mg = mυ²/R ⇒ T = 0,2·16/0,5 − 2 = 6,4 − 2 = 4,4 N. Μέρος της κεντρομόλου το δίνει το βάρος, οπότε το νήμα χρειάζεται να τραβήξει λιγότερο.",
    },
    {
      until: 10.5,
      label: "Η μικρότερη T",
      say: "Σε όλο τον κύκλο, η τάση γίνεται ελάχιστη εδώ. Αν η υ στην κορυφή μικρύνει, η T μικραίνει κι άλλο. Πόσο μπορεί να μικρύνει; Δες το κουτάκι 20.",
    },
  ],
  Scene: ({ t }) => {
    let th = Math.PI / 2;
    let v = 4;
    if (t < 3.5) th = lerp(Math.PI / 2 - 0.8, Math.PI / 2, seg(t, 0, 3.2));
    else if (t >= 7) {
      const s = loopState(T19 + t - 7, 36, 0.5, 0.2);
      th = s.th;
      v = Math.sqrt(s.v2);
    }
    const [x, y] = P(CX, CY, RP, th);
    const Tn = t >= 3.5 && t < 7 ? 4.4 : tension6(th);
    return (
      <g>
        <Orbit cx={CX} cy={CY} r={RP} showCentre={false} />
        <StringBody th={th} />
        {pivot}
        <Along x={x} y={y} u={tang(th)} len={v * 7} color={K.v} label="υ" labelSide="above" />
        <Along x={x - 3} y={y} u={inward(th)} len={Tn * k} color={K.F} label="T" width={3} labelSide="left" />
        <Along x={x + 3} y={y} u={[0, 1]} len={MG * k * 3} color={K.g} label="mg" labelSide="right" />
        <Panel
          x={206}
          y={14}
          w={148}
          lines={t < 3.5 ? ["Θετικά προς O", "T: + (κάτω)", "mg: + (κάτω)"] : t < 7 ? ["Ανώτατη θέση", "T + mg = mυ²/R", "T = 6,4 − 2 = 4,4 N"] : [`υ = ${num(v, 1)} m/s`, `T = ${num(Tn, 1)} N`, "ελάχιστη στην κορυφή"]}
        />
        <MagBars x={206} y={150} w={150} max={17} items={[{ label: "T", value: Tn, color: K.F }, { label: "mg", value: MG, color: K.g }]} />
      </g>
    );
  },
  solve: (
    <>
      Θετικά προς το κέντρο (κάτω): T + mg = mυ²/R ⇒ <b>T = mυ²/R − mg = 0,2·16/0,5 − 2 = 4,4 N</b>.
    </>
  ),
  trap: "Στην κορυφή το mg μπαίνει με «+», γιατί δείχνει προς το κέντρο. Το συχνό λάθος είναι να γράψεις T − mg όπως στον πάτο.",
};

/* ───────── 20. Ελάχιστη υ στην κορυφή ───────── */
const case20: OCase = {
  n: 20,
  title: "Ελάχιστη υ στην κορυφή",
  what: "Το ίδιο σώμα περνά από την κορυφή με όλο και μικρότερη ταχύτητα. Κάτω από ένα όριο το νήμα χαλαρώνει και το σώμα πέφτει μέσα από τον κύκλο.",
  given: "m = 0,2 kg, R = 0,5 m. Δοκιμάζουμε υ = 3 m/s, υ = √5 ≈ 2,24 m/s και υ = 2 m/s στην κορυφή.",
  ask: "Την ελάχιστη ταχύτητα υ_{min} στην κορυφή ώστε το νήμα να μείνει τεντωμένο.",
  period: 11,
  legend: ["v", "F"],
  phases: [
    {
      until: 3.5,
      label: "υ = 3 m/s",
      say: "Με 3 m/s χρειάζεται κεντρομόλος mυ²/R = 3,6 N. Το βάρος δίνει τα 2 N, το νήμα δίνει τα υπόλοιπα: T = 1,6 N. Όλα καλά.",
    },
    {
      until: 7,
      label: "υ = √(gR)",
      say: "Με υ = √(gR) = √5 ≈ 2,24 m/s χρειάζεται ακριβώς mυ²/R = 2 N = mg. Το βάρος φτάνει μόνο του: T = 0. Αυτή είναι η υ_{min}.",
    },
    {
      until: 11,
      label: "υ = 2 m/s",
      say: "Με 2 m/s χρειάζεται μόνο 1,6 N, αλλά το βάρος είναι 2 N και το νήμα δεν μπορεί να «σπρώξει». Το βάρος τραβά το σώμα πιο απότομα: το νήμα χαλαρώνει και το σώμα κάνει βολή.",
    },
  ],
  Scene: ({ t }) => {
    const top = Math.PI / 2;
    const [tx, ty] = P(CX, CY, RP, top);
    if (t < 7) {
      const v = t < 3.5 ? 3 : Math.sqrt(5);
      const Tn = 0.4 * v * v - MG;
      const local = t < 3.5 ? t : t - 3.5;
      const th = lerp(top - 0.7, top + 0.25, seg(local, 0.2, 3.3));
      const [x, y] = P(CX, CY, RP, th);
      return (
        <g>
          <Orbit cx={CX} cy={CY} r={RP} showCentre={false} />
          <StringBody th={th} />
          {pivot}
          <Along x={x} y={y} u={tang(th)} len={v * 9} color={K.v} label="υ" labelSide="above" />
          {Tn > 0.05 ? <Along x={x - 3} y={y} u={inward(th)} len={Tn * k * 3} color={K.F} label="T" width={3} labelSide="left" /> : null}
          <Along x={x + 3} y={y} u={[0, 1]} len={MG * k * 3} color={K.g} label="mg" labelSide="right" />
          <Panel x={206} y={14} w={148} lines={[`υ = ${num(v, 2)} m/s`, `χρειάζεται mυ²/R = ${num(0.4 * v * v, 1)} N`, "βάρος: 2 N", `T = ${num(Math.max(0, Tn), 1)} N`]} />
          <MagBars x={206} y={150} w={150} max={4} items={[{ label: "mυ²/R", value: 0.4 * v * v, color: K.a }, { label: "mg", value: MG, color: K.g }]} />
        </g>
      );
    }
    // υ = 2 m/s at the top: free fall from the top, moving left, until the string is taut again (τ = 0,2 s).
    const TAU_LAND = 0.2;
    const tau = Math.min(TAU_LAND, Math.max(0, (t - 7.6) * 0.08));
    const xx = tx - 2 * tau * PXM;
    const yy = ty + 0.5 * 10 * tau * tau * PXM;
    const trail = Array.from({ length: 24 }, (_, i) => {
      const s = (i / 23) * tau;
      return `${i ? "L" : "M"}${(tx - 2 * s * PXM).toFixed(1)},${(ty + 5 * s * s * PXM).toFixed(1)}`;
    }).join(" ");
    return (
      <g>
        <Orbit cx={CX} cy={CY} r={RP} showCentre={false} />
        {tau > 0 ? <path d={trail} fill="none" stroke={K.v} strokeDasharray="3 3" /> : null}
        <StringBody th={top} slack={tau > 0} x={xx} y={yy} />
        {pivot}
        <Along x={xx} y={yy} u={[0, 1]} len={MG * k * 3} color={K.g} label="mg" labelSide="right" />
        {tau === 0 ? <Along x={xx} y={yy} u={[-1, 0]} len={18} color={K.v} label="υ" labelSide="above" /> : null}
        <Tag x={12} y={200} s="το νήμα χαλάρωσε" color={K.F} show={tau > 0.02} />
        <Panel x={206} y={14} w={148} lines={["υ = 2 m/s", "χρειάζεται 1,6 N", "βάρος 2 N > 1,6 N", "⇒ T = 0, βολή"]} />
      </g>
    );
  },
  solve: (
    <>
      Στο όριο T = 0: mg = mυ²/R ⇒ <b>υ<sub>min</sub> = √(gR) = √(10·0,5) = √5 ≈ 2,24 m/s</b>. Δεν εξαρτάται από τη μάζα.
    </>
  ),
  trap: "Το νήμα μόνο τραβά, δεν σπρώχνει: T ≥ 0. Γι' αυτό το όριο βγαίνει από T = 0, όχι από υ = 0 στην κορυφή.",
};

export const section4 = [case16, case17, case18, case19, case20];
