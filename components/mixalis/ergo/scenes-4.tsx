"use client";

import { Ground, easeInOut, lerp, seg } from "@/components/mixalis/ormi/kit";
import { Arr, PanelE, TE, type ECase } from "@/components/mixalis/pedio/kitE";
import { Block, Crane, VBars, VDim, WC, gr } from "./kitW";

/* ───────── 16. Μέση ισχύς ───────── */
const case16: ECase = {
  n: 16,
  title: "Μέση ισχύς",
  what: "Δύο γερανοί σηκώνουν το ίδιο φορτίο στο ίδιο ύψος. Κάνουν το ίδιο έργο, αλλά ο ένας τελειώνει στο μισό χρόνο. Αυτός έχει διπλάσια ισχύ.",
  given: "Κάθε γερανός κάνει έργο W = 600 J. Ο Α σε Δt = 3 s, ο Β σε Δt = 6 s.",
  ask: "Τη μέση ισχύ κάθε γερανού.",
  period: 11,
  legend: ["W"],
  phases: [
    { until: 7, label: "Ανύψωση", say: "Και οι δύο ξεκινούν μαζί. Ο Α φτάνει πάνω στα 3 s, ο Β στα 6 s. Το έργο στο τέλος είναι ίδιο: 600 J." },
    { until: 11, label: "Ισχύς", say: "P_μ = W/Δt. Α: 600/3 = 200 W. Β: 600/6 = 100 W. Ίδιο έργο σε μισό χρόνο ⇒ διπλάσια ισχύς. 1 W = 1 J/s." },
  ],
  Scene: ({ t }) => {
    const tt = Math.min(t, 7);
    const kA = seg(tt, 0.5, 3.5);
    const kB = seg(tt, 0.5, 6.5);
    const ground = 182;
    const low = ground - 22 - 22;
    const high = 64;
    return (
      <g>
        <Ground y={ground} x1={8} x2={192} />
        <Crane x={14} ground={ground} top={40} jib={52} hookY={lerp(low, high, kA)} label="A" />
        <Crane x={104} ground={ground} top={40} jib={52} hookY={lerp(low, high, kB)} label="B" />
        <TE x={66} y={200} s={`${gr(Math.min(3, Math.max(0, tt - 0.5)))} s`} size={10} color={WC.s} />
        <TE x={156} y={200} s={`${gr(Math.min(6, Math.max(0, tt - 0.5)))} s`} size={10} color={WC.s} />
        <PanelE
          lines={
            t < 7
              ? ["Ίδιο έργο W = 600 J", `W_A = ${gr(600 * kA, 0)} J`, `W_B = ${gr(600 * kB, 0)} J`]
              : ["P_μ = W/Δt", "P_A = 600/3 = 200 W", "P_B = 600/6 = 100 W"]
          }
        />
        <VBars
          x={240}
          base={190}
          max={600}
          height={58}
          w={26}
          gap={18}
          items={
            t < 7
              ? [
                  { label: "W_A", value: 600 * kA, color: WC.W, text: `${gr(600 * kA, 0)} J` },
                  { label: "W_B", value: 600 * kB, color: WC.W, text: `${gr(600 * kB, 0)} J` },
                ]
              : [
                  { label: "P_A", value: 400, color: WC.K, text: "200 W" },
                  { label: "P_B", value: 200, color: WC.K, text: "100 W" },
                ]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      <b>P_μ = W/Δt</b>: P_A = 600/3 = <b>200 W</b>, P_B = 600/6 = <b>100 W</b>.
    </>
  ),
  trap: "Ο χρόνος πάντα σε δευτερόλεπτα: 2 min = 120 s. Αλλιώς η ισχύς δεν βγαίνει σε watt.",
};

/* ───────── 17. Στιγμιαία ισχύς ───────── */
const case17: ECase = {
  n: 17,
  title: "Στιγμιαία ισχύς",
  what: "Μια δύναμη σπρώχνει ένα σώμα που κινείται. Η ισχύς της τη συγκεκριμένη στιγμή εξαρτάται από τη δύναμη και από την ταχύτητα εκείνης της στιγμής.",
  given: "F = 100 N, υ = 2 m/s. Μετά η F γέρνει κατά θ = 60°. Τέλος η ταχύτητα γίνεται 4 m/s.",
  ask: "Τη στιγμιαία ισχύ της F σε κάθε περίπτωση.",
  period: 12,
  legend: ["F", "v"],
  phases: [
    { until: 4, label: "θ = 0°", say: "F και υ έχουν την ίδια φορά: P = F·υ = 100·2 = 200 W. Κάθε δευτερόλεπτο η F δίνει 200 J." },
    { until: 8, label: "θ = 60°", say: "Μόνο η συνιστώσα κατά την κίνηση μετράει: P = F·υ·συνθ = 100·2·0,5 = 100 W." },
    { until: 12, label: "Διπλάσια υ", say: "Με θ = 0° και υ = 4 m/s: P = 100·4 = 400 W. Ίδια δύναμη σε μεγαλύτερη ταχύτητα ⇒ μεγαλύτερη ισχύς." },
  ],
  Scene: ({ t }) => {
    const v = t < 8 ? 2 : 4;
    const ang = t >= 4 && t < 8 ? (Math.PI / 3) * easeInOut(seg(t, 4, 5)) : 0;
    const cx = 20 + ((t * v * 12) % 170);
    const P = 100 * v * Math.cos(ang);
    const L = 44;
    return (
      <g>
        <Ground y={150} x1={8} x2={192} />
        <Block cx={cx} y={150} />
        <Arr x={cx + 6} y={138} dx={L * Math.cos(ang)} dy={-L * Math.sin(ang)} color={WC.F} label="F" lx={8} ly={-2} width={3} />
        <Arr x={cx - 8} y={104} dx={v * 9} color={WC.v} label={`${v} m/s`} size={9.5} width={2.2} />
        <PanelE
          lines={
            t < 4
              ? ["P = F·υ", "P = 100·2", "P = 200 W"]
              : t < 8
                ? ["P = F·υ·συνθ", `θ = ${gr((ang * 180) / Math.PI, 0)}°`, `P = ${gr(P, 0)} W`]
                : ["υ = 4 m/s, θ = 0°", "P = 100·4", "P = 400 W"]
          }
        />
        <VBars x={258} base={190} max={400} height={58} w={30} items={[{ label: "P", value: P, color: WC.K, text: `${gr(P, 0)} W` }]} />
      </g>
    );
  },
  solve: (
    <>
      <b>P = F·υ·συνθ</b>: 100·2·1 = <b>200 W</b> · 100·2·0,5 = <b>100 W</b> · 100·4·1 = <b>400 W</b>.
    </>
  ),
  trap: "Η μέση ισχύς (W/Δt) και η στιγμιαία (F·υ) είναι ίδιες μόνο όταν η ταχύτητα είναι σταθερή.",
};

/* ───────── 18. Βαθμός απόδοσης ───────── */
const case18: ECase = {
  n: 18,
  title: "Βαθμός απόδοσης",
  what: "Ένας κινητήρας παίρνει ηλεκτρική ενέργεια. Ένα μέρος της γίνεται χρήσιμο έργο και το υπόλοιπο χάνεται ως θερμότητα και ήχος. Ο βαθμός απόδοσης δείχνει πόσο μέρος είναι χρήσιμο.",
  given: "Ο κινητήρας παίρνει E_{εισ} = 800 J και δίνει χρήσιμη ενέργεια E_{ωφ} = 600 J.",
  ask: "Τον βαθμό απόδοσης και τις απώλειες.",
  period: 10,
  legend: ["W", "Q"],
  phases: [
    { until: 4, label: "Ροή ενέργειας", say: "Ενέργεια μπαίνει στον κινητήρα: 800 J. Βγαίνουν 600 J χρήσιμα και 200 J απώλειες. E_{εισ} = E_{ωφ} + απώλειες." },
    { until: 10, label: "Απόδοση", say: "η = E_{ωφ}/E_{εισ} = 600/800 = 0,75 = 75%. Σε κάθε πραγματική μηχανή η < 1 (κάτω από 100%)." },
  ],
  Scene: ({ t }) => {
    const k = seg(t, 0.3, 3.5);
    const flow = (t * 30) % 20;
    return (
      <g>
        <rect x={14} y={60} width={52} height={56} rx={4} fill="#e9e1f6" stroke="#6b3fa0" />
        <TE x={40} y={84} s="E_{εισ}" size={11} color="#6b3fa0" italic />
        <TE x={40} y={100} s="800 J" size={10.5} color="#6b3fa0" />
        <rect x={74} y={66} width={46} height={44} rx={6} fill="#dfe3ea" stroke="#4a5568" />
        <circle cx={97} cy={88} r={12} fill="#fff" stroke="#4a5568" />
        <path d={`M 97 88 L ${97 + 10 * Math.cos(t * 6)} ${88 + 10 * Math.sin(t * 6)}`} stroke="#4a5568" strokeWidth={2} />
        <TE x={97} y={124} s="κινητήρας" size={9.5} color={WC.s} bold={false} />
        <line x1={66} y1={88} x2={74} y2={88} stroke="#6b3fa0" strokeWidth={6} strokeDasharray={`6 4`} strokeDashoffset={-flow} />
        <g opacity={k}>
          <line x1={120} y1={80} x2={186} y2={80} stroke={WC.K} strokeWidth={14} strokeDasharray="10 6" strokeDashoffset={-flow} opacity={0.8} />
          <TE x={160} y={66} s="E_{ωφ} = 600 J" size={10} color={WC.K} />
          <path d={`M 120 100 Q 140 140 168 152`} fill="none" stroke={WC.Q} strokeWidth={6} strokeDasharray="6 5" strokeDashoffset={-flow} opacity={0.8} />
          <TE x={150} y={174} s="απώλειες 200 J" size={10} color={WC.Q} />
        </g>
        <PanelE
          lines={
            t < 4
              ? ["E_{εισ} = E_{ωφ} + απώλειες", "800 = 600 + 200", "(θερμότητα, ήχος)"]
              : ["η = E_{ωφ}/E_{εισ}", "η = 600/800", "η = 0,75 = 75%"]
          }
        />
        <VBars
          x={226}
          base={190}
          max={800}
          height={58}
          w={26}
          gap={14}
          items={[
            { label: "E_{εισ}", value: 800, color: WC.W },
            { label: "E_{ωφ}", value: 600 * k, color: WC.K, text: `${gr(600 * k, 0)} J` },
            { label: "απώλ.", value: 200 * k, color: WC.Q, text: `${gr(200 * k, 0)} J` },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      <b>η = E_ωφ/E_εισ = 600/800 = 0,75 = 75%</b>. Απώλειες: 800 − 600 = <b>200 J</b>. Το ίδιο με ισχύ: η = P_ωφ/P_εισ.
    </>
  ),
  trap: "Ο βαθμός απόδοσης είναι καθαρός αριθμός (χωρίς μονάδα) και πάντα μικρότερος από 1. Αν σου βγει 1,33, έχεις αντιστρέψει το κλάσμα.",
};

/* ───────── 19. Ανύψωση με γερανό ───────── */
const case19: ECase = {
  n: 19,
  title: "Ανύψωση με γερανό",
  what: "Ένας γερανός σηκώνει φορτίο με σταθερή ταχύτητα. Αφού η ταχύτητα δεν αλλάζει, η δύναμη του συρματόσχοινου είναι ίση με το βάρος. Ο κινητήρας όμως έχει και απώλειες.",
  given: "m = 100 kg, ύψος h = 10 m, χρόνος Δt = 20 s, σταθερή ταχύτητα, απόδοση η = 80%, g = 10 m/s².",
  ask: "Το ωφέλιμο έργο, την ωφέλιμη ισχύ και την ισχύ που καταναλώνει ο κινητήρας.",
  period: 13,
  legend: ["F", "v", "W"],
  phases: [
    { until: 6, label: "Ανύψωση", say: "Σταθερή ταχύτητα υ = h/Δt = 10/20 = 0,5 m/s ⇒ F = m·g = 1000 N. Ωφέλιμο έργο: W_{ωφ} = m·g·h = 100·10·10 = 10.000 J." },
    { until: 9.5, label: "Ωφέλιμη ισχύς", say: "P_{ωφ} = W_{ωφ}/Δt = 10.000/20 = 500 W. Το ίδιο βγαίνει και με P = F·υ = 1000·0,5 = 500 W." },
    { until: 13, label: "Με απώλειες", say: "η = P_{ωφ}/P_{εισ} ⇒ P_{εισ} = P_{ωφ}/η = 500/0,8 = 625 W. Τα 125 W είναι απώλειες (θερμότητα στον κινητήρα)." },
  ],
  Scene: ({ t }) => {
    const k = seg(t, 0.5, 5.5);
    const ground = 184;
    const ppm = 10.5;
    const hookY = ground - 44 - k * 10 * ppm;
    const W = 10000 * k;
    return (
      <g>
        <Ground y={ground} x1={8} x2={192} />
        <Crane x={22} ground={ground} top={28} jib={80} hookY={hookY} label="m" />
        <Arr x={128} y={hookY + 30} dx={0} dy={-22} color={WC.F} label="F" lx={10} ly={4} size={10} width={2.4} />
        <Arr x={102} y={hookY + 22} dx={0} dy={22} color={WC.F} label="mg" lx={-14} ly={6} size={10} width={2.4} />
        {t < 5.5 ? <Arr x={148} y={hookY + 30} dx={0} dy={-18} color={WC.v} label="υ" lx={8} ly={4} size={10} width={2.2} /> : null}
        <VDim x={176} y1={ground - 44 - 10 * ppm + 22} y2={ground - 22} label="10 m" />
        <PanelE
          lines={
            t < 6
              ? ["υ = 10/20 = 0,5 m/s", "F = m·g = 1000 N", "W_{ωφ} = m·g·h", `W_{ωφ} = ${gr(W, 0)} J`]
              : t < 9.5
                ? ["P_{ωφ} = W/Δt", "P_{ωφ} = 10.000/20", "P_{ωφ} = 500 W", "(ή F·υ = 1000·0,5)"]
                : ["P_{εισ} = P_{ωφ}/η", "P_{εισ} = 500/0,8", "P_{εισ} = 625 W", "απώλειες 125 W"]
          }
        />
        <VBars
          x={244}
          base={190}
          max={t < 6 ? 10000 : 625}
          height={52}
          w={28}
          gap={16}
          items={
            t < 6
              ? [{ label: "W_{ωφ}", value: W, color: WC.W, text: `${gr(W, 0)} J` }]
              : [
                  { label: "P_{ωφ}", value: 500, color: WC.K, text: "500 W" },
                  ...(t >= 9.5 ? [{ label: "P_{εισ}", value: 625, color: WC.W, text: "625 W" }] : []),
                ]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      <b>W_ωφ = m·g·h = 10.000 J</b>, <b>P_ωφ = 10.000/20 = 500 W</b> (= F·υ = 1000·0,5), <b>P_εισ = 500/0,8 = 625 W</b>.
    </>
  ),
  trap: "Η ισχύς εισόδου είναι πάντα μεγαλύτερη από την ωφέλιμη. Διαιρείς με το η, δεν πολλαπλασιάζεις.",
};

/* ───────── 20. Ηλεκτρική ενέργεια ───────── */
const case20: ECase = {
  n: 20,
  title: "Ηλεκτρική ενέργεια",
  what: "Μια λάμπα μένει αναμμένη αρκετές ώρες. Η ισχύς της δείχνει πόσο γρήγορα καταναλώνει ενέργεια. Ο λογαριασμός του ρεύματος μετράει ενέργεια σε κιλοβατώρες (kWh).",
  given: "Λάμπα P = 100 W στα V = 230 V, ανοιχτή για t = 5 h.",
  ask: "Το ρεύμα που διαρρέει τη λάμπα και την ενέργεια που καταναλώνει σε kWh και σε J.",
  period: 12,
  legend: ["W"],
  phases: [
    { until: 3.5, label: "Ρεύμα", say: "P = V·I ⇒ I = P/V = 100/230 ≈ 0,43 A." },
    { until: 8, label: "Ενέργεια", say: "E = P·t. Σε kW και ώρες: P = 0,1 kW, άρα E = 0,1·5 = 0,5 kWh." },
    { until: 12, label: "Σε joule", say: "1 kWh = 1000 W · 3600 s = 3,6·10⁶ J. Άρα E = 0,5·3,6·10⁶ = 1,8·10⁶ J. Το kW μετράει ισχύ, η kWh μετράει ενέργεια." },
  ],
  Scene: ({ t }) => {
    const k = seg(t, 3.5, 8);
    const hours = 5 * k;
    const glow = 0.75 + 0.15 * Math.sin(t * 5);
    return (
      <g>
        <circle cx={70} cy={80} r={34 * glow} fill="#ffe9a8" opacity={0.6} />
        <circle cx={70} cy={80} r={22} fill="#fff2b8" stroke="#c9a227" strokeWidth={1.5} />
        <path d="M 62 84 q 4 -10 8 0 q 4 -10 8 0" fill="none" stroke="#c9822f" strokeWidth={1.5} />
        <rect x={61} y={102} width={18} height={14} rx={2} fill="#9aa3b2" />
        <line x1={70} y1={116} x2={70} y2={150} stroke="#4a5568" strokeWidth={1.5} />
        <rect x={40} y={150} width={60} height={22} rx={4} fill="#fff" stroke="#4a5568" />
        <TE x={70} y={165} s="230 V" size={10} />
        <circle cx={150} cy={90} r={26} fill="#fff" stroke="#4a5568" strokeWidth={1.5} />
        <line x1={150} y1={90} x2={150 + 18 * Math.sin((hours / 12) * 2 * Math.PI)} y2={90 - 18 * Math.cos((hours / 12) * 2 * Math.PI)} stroke={WC.F} strokeWidth={2} />
        <TE x={150} y={132} s={`${gr(hours)} h`} size={10.5} color={WC.s} />
        <PanelE
          lines={
            t < 3.5
              ? ["P = V·I", "I = P/V = 100/230", "I ≈ 0,43 A"]
              : t < 8
                ? ["E = P·t", `E = 0,1 kW · ${gr(hours)} h`, `E = ${gr(0.1 * hours, 2)} kWh`]
                : ["1 kWh = 3,6·10^6 J", "E = 0,5·3,6·10^6", "E = 1,8·10^6 J"]
          }
        />
        <VBars x={258} base={190} max={0.5} height={56} w={30} items={[{ label: "E", value: 0.1 * hours, color: WC.W, text: `${gr(0.1 * hours, 2)} kWh` }]} />
      </g>
    );
  },
  solve: (
    <>
      <b>I = P/V ≈ 0,43 A</b>. <b>E = P·t = 0,1 kW · 5 h = 0,5 kWh = 1,8·10⁶ J</b>.
    </>
  ),
  trap: "Για kWh βάζεις την ισχύ σε kW και τον χρόνο σε ώρες. Για joule βάζεις watt και δευτερόλεπτα. Μην τα ανακατεύεις.",
};

export const section4: ECase[] = [case16, case17, case18, case19, case20];
