"use client";

import { Ground, easeInOut, lerp, seg } from "@/components/mixalis/ormi/kit";
import { Arr, PanelE, TE, type ECase } from "@/components/mixalis/pedio/kitE";
import { Block, Dim, G, HeatMarks, VBars, VDim, WC, gr } from "./kitW";

/* ───────── 1. Έργο σταθερής δύναμης ───────── */
const case1: ECase = {
  n: 1,
  title: "Έργο σταθερής δύναμης",
  what: "Ένα κιβώτιο σε λείο δάπεδο. Μια σταθερή οριζόντια δύναμη το σπρώχνει και αυτό μετατοπίζεται. Όσο προχωράει, η δύναμη «δίνει» ενέργεια στο κιβώτιο.",
  given: "F = 10 N οριζόντια, μετατόπιση s = 3 m, λείο δάπεδο (χωρίς τριβή).",
  ask: "Το έργο της F και πού πήγε η ενέργεια.",
  period: 10,
  legend: ["F", "v", "W", "K"],
  phases: [
    { until: 3, label: "Η δύναμη", say: "Η δύναμη F = 10 N έχει την ίδια φορά με την κίνηση. Το έργο μετράει πόση ενέργεια μεταφέρει μια δύναμη όταν το σώμα μετακινείται." },
    { until: 7, label: "Το έργο μεγαλώνει", say: "Κάθε μέτρο που προχωράει, η F κάνει έργο 10 J. Σε 3 m: W = F·s = 10·3 = 30 J. Μονάδα: 1 J = 1 N·m." },
    { until: 10, label: "Πού πήγε;", say: "Χωρίς τριβή, όλο το έργο της F έγινε κινητική ενέργεια του κιβωτίου: K = 30 J. Το έργο είναι μεταφορά ενέργειας." },
  ],
  Scene: ({ t }) => {
    const k = easeInOut(seg(t, 3, 7));
    const x0 = 34;
    const px = 42;
    const cx = x0 + 17 + k * 3 * px;
    const W = 10 * 3 * k;
    return (
      <g>
        <Ground y={150} x1={8} x2={192} />
        <Block cx={cx} y={150} />
        <Arr x={cx + 17} y={137} dx={34} color={WC.F} label="F" width={3} />
        {t >= 3 ? <Dim x1={x0 + 17} x2={cx} y={170} label={`s = ${gr(3 * k)} m`} /> : null}
        {t >= 3 && k > 0.05 ? <Arr x={cx - 8} y={110} dx={10 + 26 * k} color={WC.v} label="υ" size={10} /> : null}
        <PanelE
          lines={
            t < 3
              ? ["Σταθερή δύναμη", "F = 10 N →", "ίδια φορά με την s", "θ = 0°"]
              : t < 7
                ? ["W = F·s", `W = 10·${gr(3 * k)}`, `W = ${gr(W)} J`]
                : ["W = 30 J", "λείο δάπεδο ⇒", "K = W = 30 J"]
          }
        />
        <VBars x={232} base={186} max={30} height={56} items={[{ label: "W", value: W, color: WC.W }, ...(t >= 7 ? [{ label: "K", value: 30, color: WC.K }] : [])]} />
      </g>
    );
  },
  solve: (
    <>
      <b>W = F·s = 10·3 = 30 J</b>. Χωρίς τριβή όλη αυτή η ενέργεια γίνεται κινητική: K = 30 J.
    </>
  ),
  trap: "Το W = F·s ισχύει μόνο όταν η δύναμη είναι σταθερή και έχει τη φορά της μετατόπισης. Αλλιώς χρειάζεται το συνθ (κουτάκι 2).",
};

/* ───────── 2. Πλάγια δύναμη ───────── */
const case2: ECase = {
  n: 2,
  title: "Πλάγια δύναμη",
  what: "Τραβάμε ένα κιβώτιο με σκοινί που κάνει γωνία με το δάπεδο. Μόνο ένα μέρος της δύναμης βοηθάει την κίνηση: αυτό που είναι παράλληλο στη μετατόπιση.",
  given: "F = 20 N, γωνία θ = 60° με την οριζόντια, μετατόπιση s = 4 m.",
  ask: "Το έργο της F.",
  period: 10.5,
  legend: ["F", "W"],
  phases: [
    { until: 3.5, label: "Ανάλυση", say: "Αναλύουμε τη F σε δύο συνιστώσες: F_x = F·συνθ = 20·0,5 = 10 N κατά την κίνηση και F_y = F·ημθ ≈ 17,3 N κάθετα." },
    { until: 7.5, label: "Κίνηση", say: "Το κιβώτιο κινείται οριζόντια. Έργο κάνει μόνο η F_x, γιατί η F_y είναι κάθετη στη μετατόπιση." },
    { until: 10.5, label: "Αποτέλεσμα", say: "W = F·s·συνθ = 20·4·0,5 = 40 J. Αν ξεχάσεις τη γωνία βγάζεις 80 J: λάθος!" },
  ],
  Scene: ({ t }) => {
    const k = easeInOut(seg(t, 3.5, 7.5));
    const cx = 40 + k * 4 * 26;
    const L = 64;
    const a = Math.PI / 3;
    const showComp = t < 3.5 ? seg(t, 0.6, 2.2) : 1;
    const W = 10 * 4 * k;
    return (
      <g>
        <Ground y={160} x1={8} x2={192} />
        <Block cx={cx} y={160} />
        <Arr x={cx + 6} y={146} dx={L * Math.cos(a)} dy={-L * Math.sin(a)} color={WC.F} label="F" lx={10} ly={0} width={3} />
        <g opacity={showComp}>
          <Arr x={cx + 6} y={146} dx={L * Math.cos(a)} color={WC.F} width={2} dashed label="F_x" ly={14} size={10} />
          <Arr x={cx + 6} y={146} dy={-L * Math.sin(a)} dx={0} color={WC.F} width={2} dashed label="F_y" lx={-12} ly={0} size={10} opacity={0.6} />
        </g>
        <path d={`M ${cx + 22} 146 A 16 16 0 0 0 ${cx + 6 + 16 * Math.cos(a)} ${146 - 16 * Math.sin(a)}`} fill="none" stroke={WC.s} strokeWidth={1} />
        <TE x={cx + 28} y={140} s="θ" size={10} color={WC.s} italic />
        {t >= 3.5 ? <Dim x1={40} x2={cx} y={178} label={`s = ${gr(4 * k)} m`} /> : null}
        <PanelE
          lines={
            t < 3.5
              ? ["F = 20 N, θ = 60°", "F_x = F·συνθ = 10 N", "F_y = F·ημθ ≈ 17,3 N"]
              : t < 7.5
                ? ["Έργο κάνει η F_x", `W = 10·${gr(4 * k)}`, `W = ${gr(W)} J`, "F_y ⊥ s ⇒ W_y = 0"]
                : ["W = F·s·συνθ", "W = 20·4·0,5", "W = 40 J", "(όχι 80 J!)"]
          }
        />
        <VBars x={250} base={186} max={80} height={64} items={[{ label: "W", value: W, color: WC.W }]} />
      </g>
    );
  },
  solve: (
    <>
      <b>W = F·s·συνθ = 20·4·συν60° = 20·4·0,5 = 40 J</b>.
    </>
  ),
  trap: "Η γωνία θ είναι ανάμεσα στη δύναμη και στη μετατόπιση, όχι απαραίτητα με το δάπεδο. Σε κεκλιμένο επίπεδο πρόσεξε ποια είναι.",
};

/* ───────── 3. Πρόσημο του έργου ───────── */
const case3: ECase = {
  n: 3,
  title: "Πρόσημο του έργου",
  what: "Το κιβώτιο κινείται πάντα προς τα δεξιά. Αλλάζουμε τη γωνία της δύναμης από 0° έως 180° και βλέπουμε το έργο να γίνεται θετικό, μηδέν ή αρνητικό.",
  given: "F = 10 N, μετατόπιση s = 2 m προς τα δεξιά, η γωνία θ αλλάζει.",
  ask: "Το έργο W = F·s·συνθ για θ = 0°, 90°, 180°.",
  period: 12,
  legend: ["F", "v", "W"],
  phases: [
    { until: 4, label: "θ = 0° ως 60°", say: "Όσο η F έχει συνιστώσα προς τη φορά της κίνησης, το έργο είναι θετικό: η δύναμη δίνει ενέργεια. Για θ = 0°: W = +20 J." },
    { until: 8, label: "θ = 90°", say: "Στις 90° η δύναμη είναι κάθετη στη μετατόπιση: συν90° = 0 ⇒ W = 0. Έτσι κάνουν η κάθετη αντίδραση N και το βάρος σε οριζόντια κίνηση." },
    { until: 12, label: "θ = 180°", say: "Όταν η F έχει συνιστώσα αντίθετη στην κίνηση, το έργο είναι αρνητικό: η δύναμη παίρνει ενέργεια. Για θ = 180°: W = −F·s = −20 J (όπως η τριβή)." },
  ],
  Scene: ({ t }) => {
    const deg = t < 4 ? lerp(0, 60, seg(t, 0.5, 3.5)) : t < 8 ? lerp(60, 90, seg(t, 4, 5.5)) : lerp(90, 180, seg(t, 8.3, 11));
    const a = (deg * Math.PI) / 180;
    const W = 10 * 2 * Math.cos(a);
    const cx = 90;
    const color = W > 0.3 ? WC.U : W < -0.3 ? WC.F : WC.s;
    return (
      <g>
        <Ground y={150} x1={8} x2={192} />
        <Block cx={cx} y={150} />
        <Arr x={cx} y={124} dx={50 * Math.cos(a)} dy={-50 * Math.sin(a)} color={WC.F} label="F" lx={8 * Math.cos(a)} ly={-8} width={3} />
        <Arr x={60} y={175} dx={70} color={WC.v} label="μετατόπιση s" ly={-6} size={10} width={2} />
        <PanelE lines={[`θ = ${Math.round(deg)}°`, `συνθ = ${gr(Math.cos(a), 2)}`, `W = 10·2·συνθ`, `W = ${gr(W)} J`]} />
        <TE x={278} y={120} s={W > 0.3 ? "Θετικό έργο" : W < -0.3 ? "Αρνητικό έργο" : "Μηδενικό έργο"} size={13} color={color} />
        <rect x={210} y={138} width={136} height={10} rx={3} fill="#eceef2" />
        <line x1={278} y1={134} x2={278} y2={152} stroke={WC.s} strokeWidth={1} />
        <rect x={W >= 0 ? 278 : 278 + (W / 20) * 66} y={138} width={Math.abs(W / 20) * 66} height={10} rx={2} fill={color} opacity={0.85} />
        <TE x={212} y={166} s="−20 J" size={9} color={WC.s} anchor="start" bold={false} />
        <TE x={344} y={166} s="+20 J" size={9} color={WC.s} anchor="end" bold={false} />
      </g>
    );
  },
  solve: (
    <>
      θ = 0°: <b>W = +20 J</b> · θ = 90°: <b>W = 0</b> · θ = 180°: <b>W = −20 J</b>. Γενικά W = F·s·συνθ: θ &lt; 90° θετικό, θ &gt; 90° αρνητικό.
    </>
  ),
  trap: "Αρνητικό έργο δεν σημαίνει «αρνητική δύναμη». Σημαίνει ότι η δύναμη αφαιρεί ενέργεια από το σώμα.",
};

/* ───────── 4. Έργο του βάρους ───────── */
const path1 = (k: number) => ({ x: lerp(34, 150, k), y: lerp(50, 150, k) });
const path2 = (k: number) => {
  // a wavy slide from A to B
  const x = lerp(34, 150, k);
  const y = 50 + 100 * (k * k * (3 - 2 * k)) - 18 * Math.sin(Math.PI * k * 2) * (1 - k);
  return { x, y };
};
const case4: ECase = {
  n: 4,
  title: "Έργο του βάρους",
  what: "Μια μπάλα κατεβαίνει από το A στο B μία φορά σε ευθεία και μία από καμπύλο δρόμο. Μετά ανεβαίνει πίσω. Το έργο του βάρους εξαρτάται μόνο από την υψομετρική διαφορά.",
  given: "m = 2 kg, υψομετρική διαφορά h = 3 m ανάμεσα στο A και στο B, g = 10 m/s².",
  ask: "Το έργο του βάρους στην κάθοδο (από δύο δρόμους) και στην άνοδο.",
  period: 12,
  legend: ["F", "W"],
  phases: [
    { until: 4, label: "Ευθεία κάθοδος", say: "Το βάρος mg = 20 N δείχνει κάτω και το σώμα κατεβαίνει κατά h = 3 m. Το έργο είναι θετικό: W_B = m·g·h = 2·10·3 = 60 J." },
    { until: 8, label: "Άλλος δρόμος", say: "Από τον καμπύλο δρόμο το έργο βγαίνει πάλι 60 J. Μετράει μόνο το πόσο κατέβηκε, όχι από πού πέρασε. Γι' αυτό λέμε το βάρος συντηρητική δύναμη." },
    { until: 12, label: "Άνοδος", say: "Όταν το σώμα ανεβαίνει από το B στο A, το βάρος είναι αντίθετο στην κίνηση: W_B = −m·g·h = −60 J." },
  ],
  Scene: ({ t }) => {
    const up = t >= 8;
    const k = t < 4 ? easeInOut(seg(t, 0.4, 3.6)) : t < 8 ? easeInOut(seg(t, 4.4, 7.6)) : 1 - easeInOut(seg(t, 8.4, 11.6));
    const p = t < 4 || up ? path1(k) : path2(k);
    const W = (up ? -1 : 1) * 2 * G * 3 * (up ? 1 - k : k);
    const pts2 = Array.from({ length: 30 }, (_, i) => path2(i / 29));
    return (
      <g>
        <Ground y={156} x1={8} x2={192} />
        <line x1={34} y1={50} x2={150} y2={150} stroke={WC.v} strokeWidth={1.4} strokeDasharray={t < 4 || up ? "0" : "5 3"} opacity={t < 4 || up ? 1 : 0.5} />
        <path d={"M " + pts2.map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" L ")} fill="none" stroke={WC.v} strokeWidth={1.4} strokeDasharray={t >= 4 && !up ? "0" : "5 3"} opacity={t >= 4 && !up ? 1 : 0.5} />
        <TE x={26} y={46} s="A" size={11} />
        <TE x={160} y={150} s="B" size={11} />
        <VDim x={180} y1={50} y2={150} label="h" />
        <circle cx={p.x} cy={p.y - 7} r={7} fill="#f4a261" stroke="#4a5568" strokeWidth={1.2} />
        <Arr x={p.x} y={p.y} dx={0} dy={28} color={WC.F} label="mg" lx={14} ly={4} width={2.6} size={10} />
        <PanelE
          lines={
            up
              ? ["Άνοδος B → A", "W_B = −m·g·h", `W_B = ${gr(W)} J`]
              : [t < 4 ? "Ευθύς δρόμος" : "Καμπύλος δρόμος", "W_B = m·g·h", `W_B = 2·10·${gr(3 * k)}`, `W_B = ${gr(W)} J`]
          }
        />
        <TE x={278} y={140} s={up ? "αρνητικό: ανεβαίνει" : "θετικό: κατεβαίνει"} size={11} color={up ? WC.F : WC.U} />
        <TE x={278} y={160} s="ίδιο για κάθε δρόμο" size={10.5} color={WC.s} bold={false} />
      </g>
    );
  },
  solve: (
    <>
      Κάθοδος από A σε B: <b>W_B = +m·g·h = 2·10·3 = 60 J</b> από όποιον δρόμο κι αν πάει. Άνοδος από B σε A: <b>W_B = −60 J</b>.
    </>
  ),
  trap: "Το h είναι κατακόρυφη υψομετρική διαφορά, όχι το μήκος του δρόμου ή της πλαγιάς.",
};

/* ───────── 5. Έργο της τριβής ───────── */
const case5: ECase = {
  n: 5,
  title: "Έργο της τριβής",
  what: "Ένα κιβώτιο γλιστράει σε τραχύ οριζόντιο δάπεδο. Η τριβή είναι πάντα αντίθετη στην κίνηση, οπότε του αφαιρεί κινητική ενέργεια και τη μετατρέπει σε θερμότητα.",
  given: "m = 5 kg, συντελεστής τριβής μ = 0,2, ολισθαίνει s = 8 m, g = 10 m/s².",
  ask: "Τη δύναμη της τριβής T και το έργο της.",
  period: 11,
  legend: ["F", "v", "W", "Q"],
  phases: [
    { until: 3.5, label: "Οι δυνάμεις", say: "Στον κατακόρυφο άξονα ισορροπεί: N = m·g = 50 N. Η τριβή ολίσθησης είναι T = μ·N = 0,2·50 = 10 N, αντίθετη στην ταχύτητα." },
    { until: 8, label: "Ολίσθηση", say: "Καθώς γλιστράει, η τριβή κάνει αρνητικό έργο: W_T = −T·s. Το βάρος και η N είναι κάθετα στη μετατόπιση, άρα W = 0." },
    { until: 11, label: "Αποτέλεσμα", say: "Σε 8 m: W_T = −10·8 = −80 J. Αυτά τα 80 J γίνονται θερμότητα Q (ζεσταίνονται κιβώτιο και δάπεδο)." },
  ],
  Scene: ({ t }) => {
    const k = seg(t, 3.5, 8);
    const kk = 1 - (1 - k) * (1 - k);
    const cx = 60 + kk * 100;
    const W = -10 * 8 * kk;
    return (
      <g>
        <Ground y={150} x1={8} x2={192} rough />
        <Block cx={cx} y={150} w={38} />
        <Arr x={cx} y={124} dx={0} dy={-28} color={WC.N} label="N" lx={10} ly={4} width={2.4} size={10} />
        <Arr x={cx} y={150} dx={0} dy={28} color={WC.F} label="mg" lx={14} ly={4} width={2.4} size={10} />
        <Arr x={cx - 19} y={145} dx={-30} color={WC.Q} label="T" ly={-7} width={2.8} />
        {t < 8 ? <Arr x={cx - 6} y={104} dx={lerp(34, 8, k)} color={WC.v} label="υ" size={10} width={2.2} /> : null}
        <HeatMarks x={cx - 8} y={124} k={seg(t, 4, 6) * (t < 11 ? 1 : 0)} />
        {t >= 3.5 ? <Dim x1={60} x2={cx} y={176} label={`s = ${gr(8 * kk)} m`} /> : null}
        <PanelE
          lines={
            t < 3.5
              ? ["N = m·g = 50 N", "T = μ·N", "T = 0,2·50 = 10 N"]
              : t < 8
                ? ["W_T = −T·s", `W_T = −10·${gr(8 * kk)}`, `W_T = ${gr(W)} J`, "W_N = W_B = 0"]
                : ["W_T = −80 J", "Q = |W_T| = 80 J", "θερμότητα"]
          }
        />
        <VBars x={250} base={186} max={80} height={54} items={[{ label: "|W_T|", value: -W, color: WC.Q, text: `${gr(W)} J` }]} />
      </g>
    );
  },
  solve: (
    <>
      N = mg = 50 N, <b>T = μN = 0,2·50 = 10 N</b>, <b>W_T = −T·s = −10·8 = −80 J</b>.
    </>
  ),
  trap: "Το N = mg ισχύει μόνο σε οριζόντιο δάπεδο χωρίς άλλη κατακόρυφη δύναμη. Με πλάγια δύναμη ή σε κεκλιμένο, βρίσκεις το N από την ισορροπία στον κάθετο άξονα.",
};

export const section1: ECase[] = [case1, case2, case3, case4, case5];
