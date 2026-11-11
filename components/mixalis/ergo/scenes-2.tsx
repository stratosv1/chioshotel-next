"use client";

import { Ground, easeInOut, lerp, seg } from "@/components/mixalis/ormi/kit";
import { Arr, PanelE, TE, type ECase } from "@/components/mixalis/pedio/kitE";
import { Block, Dim, VBars, VDim, WC, gr } from "./kitW";

/* ───────── 6. Κινητική ενέργεια ───────── */
const case6: ECase = {
  n: 6,
  title: "Κινητική ενέργεια",
  what: "Δύο ίδια καροτσάκια: το ένα κινείται με διπλάσια ταχύτητα από το άλλο. Η κινητική ενέργεια εξαρτάται από το τετράγωνο της ταχύτητας.",
  given: "m = 4 kg. Καρότσι Α: υ = 3 m/s. Καρότσι Β: υ = 6 m/s.",
  ask: "Την κινητική ενέργεια κάθε καροτσιού.",
  period: 10,
  legend: ["v", "K"],
  phases: [
    { until: 3.5, label: "Καρότσι Α", say: "K = ½·m·υ² = ½·4·3² = 2·9 = 18 J. Η κινητική ενέργεια είναι πάντα θετική ή μηδέν." },
    { until: 7, label: "Καρότσι Β", say: "Με διπλάσια ταχύτητα: K = ½·4·6² = 2·36 = 72 J. Δηλαδή 4 φορές μεγαλύτερη, όχι 2." },
    { until: 10, label: "Ο κανόνας", say: "Διπλάσια μάζα ⇒ διπλάσια K (K ∝ m). Διπλάσια ταχύτητα ⇒ τετραπλάσια K (K ∝ υ²)." },
  ],
  Scene: ({ t }) => {
    const xa = 20 + ((t * 18) % 160);
    const xb = 20 + ((t * 36) % 160);
    const showB = t >= 3.5;
    return (
      <g>
        <Ground y={86} x1={8} x2={192} />
        <Block cx={xa} y={80} w={30} h={20} label="A" fill="#9fc3ef" />
        <circle cx={xa - 8} cy={82} r={4} fill="#2b3545" />
        <circle cx={xa + 8} cy={82} r={4} fill="#2b3545" />
        <Arr x={xa + 16} y={70} dx={18} color={WC.v} label="3 m/s" size={9.5} width={2.2} />
        <g opacity={showB ? 1 : 0.25}>
          <Ground y={166} x1={8} x2={192} />
          <Block cx={xb} y={160} w={30} h={20} label="B" fill="#f2c46d" />
          <circle cx={xb - 8} cy={162} r={4} fill="#2b3545" />
          <circle cx={xb + 8} cy={162} r={4} fill="#2b3545" />
          <Arr x={xb + 16} y={150} dx={36} color={WC.v} label="6 m/s" size={9.5} width={2.2} />
        </g>
        <PanelE
          lines={
            t < 3.5
              ? ["K = ½·m·υ^2", "K_A = ½·4·3^2", "K_A = 18 J"]
              : t < 7
                ? ["K_B = ½·4·6^2", "K_B = 72 J", "72/18 = 4"]
                : ["υ × 2 ⇒ K × 4", "m × 2 ⇒ K × 2", "K ≥ 0 πάντα"]
          }
        />
        <VBars x={240} base={190} max={72} height={60} w={28} gap={20} items={[{ label: "K_A", value: 18, color: WC.K }, ...(showB ? [{ label: "K_B", value: 72, color: WC.K }] : [])]} />
      </g>
    );
  },
  solve: (
    <>
      <b>K_A = ½·4·3² = 18 J</b>, <b>K_B = ½·4·6² = 72 J</b>. Διπλάσια ταχύτητα ⇒ τετραπλάσια κινητική ενέργεια.
    </>
  ),
  trap: "Πρώτα υψώνεις την ταχύτητα στο τετράγωνο και μετά πολλαπλασιάζεις. Η μάζα πάντα σε kg (500 g = 0,5 kg).",
};

/* ───────── 7. Βαρυτική δυναμική ενέργεια ───────── */
const case7: ECase = {
  n: 7,
  title: "Βαρυτική δυναμική",
  what: "Σηκώνουμε αργά ένα σώμα ψηλότερα. Η ενέργεια που του δίνουμε αποθηκεύεται ως βαρυτική δυναμική ενέργεια. Το «μηδέν» της U το διαλέγουμε εμείς.",
  given: "m = 5 kg, το ανεβάζουμε κατά h = 2 m, g = 10 m/s². Επίπεδο αναφοράς (U = 0): το δάπεδο.",
  ask: "Τη δυναμική ενέργεια στο νέο ύψος και το έργο του βάρους.",
  period: 11,
  legend: ["F", "Ug"],
  phases: [
    { until: 4.5, label: "Ανύψωση", say: "Ανεβάζουμε το σώμα αργά. Η U μεγαλώνει ανάλογα με το ύψος: U = m·g·h. Στα 2 m: U = 5·10·2 = 100 J." },
    { until: 8, label: "Έργο βάρους", say: "Στην άνοδο το βάρος (50 N, προς τα κάτω) κάνει αρνητικό έργο: W_B = −m·g·h = −100 J. Ισχύει W_B = −ΔU." },
    { until: 11, label: "Άλλο μηδέν", say: "Αν βάλουμε το U = 0 στο τραπέζι (1 m), οι τιμές της U αλλάζουν (−50 J και +50 J), αλλά η μεταβολή ΔU = 100 J μένει ίδια. Μόνο η ΔU έχει φυσική σημασία." },
  ],
  Scene: ({ t }) => {
    const k = easeInOut(seg(t, 0.4, 4));
    const ppm = 50;
    const floor = 176;
    const h = 2 * k;
    const y = floor - 22 - h * ppm;
    const ref = t >= 8 ? floor - ppm : floor;
    const U = 5 * 10 * (h - (t >= 8 ? 1 : 0));
    return (
      <g>
        <Ground y={floor} x1={8} x2={192} />
        <line x1={8} y1={ref} x2={192} y2={ref} stroke={WC.U} strokeWidth={1.2} strokeDasharray="5 3" />
        <TE x={12} y={ref - 4} s="U = 0" size={9.5} color={WC.U} anchor="start" />
        {t >= 8 ? <rect x={110} y={floor - ppm} width={60} height={ppm} fill="#d8c3a5" stroke="#8a7255" /> : null}
        <Block cx={70} y={y + 22} w={30} h={22} />
        <Arr x={70} y={y + 22} dx={0} dy={26} color={WC.F} label="mg" lx={-16} ly={4} width={2.4} size={10} />
        {t < 4.5 ? <Arr x={70} y={y} dx={0} dy={-26} color={WC.N} label="F" lx={10} ly={4} width={2.4} size={10} /> : null}
        <VDim x={30} y1={y + 22} y2={floor} label={`${gr(h)} m`} />
        <PanelE
          lines={
            t < 4.5
              ? ["U = m·g·h", `U = 5·10·${gr(h)}`, `U = ${gr(U)} J`]
              : t < 8
                ? ["Άνοδος", "W_B = −m·g·h", "W_B = −100 J", "W_B = −ΔU"]
                : ["U = 0 στο 1 m", "U_{αρχ} = −50 J", "U_{τελ} = +50 J", "ΔU = 100 J ίδια"]
          }
        />
        <VBars x={258} base={190} max={100} height={50} w={30} items={[{ label: "U", value: Math.max(0, U), color: WC.U, text: `${gr(U)} J` }]} />
      </g>
    );
  },
  solve: (
    <>
      <b>U = m·g·h = 5·10·2 = 100 J</b> (με U = 0 στο δάπεδο). Το βάρος στην άνοδο: <b>W_B = −ΔU = −100 J</b>.
    </>
  ),
  trap: "Η U μπορεί να είναι και αρνητική, αν το σώμα είναι κάτω από το επίπεδο αναφοράς. Γράψε πάντα πού έβαλες το U = 0.",
};

/* ───────── 8. Μεταβλητή δύναμη ───────── */
const case8: ECase = {
  n: 8,
  title: "Μεταβλητή δύναμη",
  what: "Η δύναμη που σπρώχνει το σώμα μεγαλώνει όσο αυτό προχωράει. Δεν μπορούμε να πούμε W = F·s, αλλά βρίσκουμε το έργο από το εμβαδόν στο διάγραμμα F–x.",
  given: "Η F αυξάνεται γραμμικά από 0 N σε 10 N, καθώς το σώμα πάει από x = 0 σε x = 4 m.",
  ask: "Το έργο της F.",
  period: 10,
  legend: ["F", "W"],
  phases: [
    { until: 5, label: "Η δύναμη μεγαλώνει", say: "Σε κάθε θέση η δύναμη είναι διαφορετική. Η γραφική παράσταση F–x είναι ευθεία που ξεκινά από το 0." },
    { until: 8, label: "Εμβαδόν", say: "Το έργο είναι το εμβαδόν κάτω από τη γραμμή. Εδώ είναι τρίγωνο: W = ½·βάση·ύψος = ½·4·10 = 20 J." },
    { until: 10, label: "Μέση δύναμη", say: "Ισοδύναμα: η μέση δύναμη είναι (0 + 10)/2 = 5 N, άρα W = 5·4 = 20 J. Ισχύει μόνο όταν η F αλλάζει γραμμικά." },
  ],
  Scene: ({ t }) => {
    const k = seg(t, 0.4, 4.6);
    const x = 4 * k;
    const F = 2.5 * x;
    const gx = 200;
    const gy = 170;
    const sx = 30;
    const sy = 9;
    const W = 0.5 * x * F;
    return (
      <g>
        <Ground y={100} x1={8} x2={186} />
        <Block cx={30 + x * 36} y={100} w={30} h={22} />
        <Arr x={45 + x * 36} y={88} dx={6 + F * 2.6} color={WC.F} label="F" size={10} width={2.6} />
        <Dim x1={30} x2={30 + x * 36} y={120} label={`x = ${gr(x)} m`} />
        <line x1={gx} y1={gy} x2={gx + 140} y2={gy} stroke="#9aa3b2" />
        <line x1={gx} y1={gy} x2={gx} y2={gy - 104} stroke="#9aa3b2" />
        <TE x={gx + 150} y={gy - 6} s="x (m)" size={9} color={WC.s} anchor="end" italic />
        <TE x={gx - 4} y={gy - 108} s="F (N)" size={9} color={WC.s} italic />
        <polygon points={`${gx},${gy} ${gx + x * sx},${gy - F * sy} ${gx + x * sx},${gy}`} fill={WC.W} opacity={0.25} />
        <line x1={gx} y1={gy} x2={gx + x * sx} y2={gy - F * sy} stroke={WC.F} strokeWidth={2.2} />
        <line x1={gx} y1={gy} x2={gx + 4 * sx} y2={gy - 10 * sy} stroke={WC.F} strokeWidth={1} opacity={0.2} />
        <TE x={gx + 4 * sx} y={gy + 12} s="4" size={9} color={WC.s} />
        <TE x={gx - 8} y={gy - 10 * sy + 3} s="10" size={9} color={WC.s} anchor="end" />
        {t >= 5 ? <TE x={gx + 84} y={gy - 20} s="W = 20 J" size={12} color={WC.W} /> : null}
        {t >= 8 ? <line x1={gx} y1={gy - 5 * sy} x2={gx + 4 * sx} y2={gy - 5 * sy} stroke={WC.F} strokeWidth={1.4} strokeDasharray="4 3" /> : null}
        {t >= 8 ? <TE x={gx + 4 * sx + 4} y={gy - 5 * sy + 4} s="5 N" size={9} color={WC.F} anchor="start" /> : null}
        <PanelE
          x={20}
          y={12}
          w={164}
          lines={t < 5 ? ["F = 2,5·x (N)", `F = ${gr(F)} N`, `W = εμβαδόν = ${gr(W)} J`] : t < 8 ? ["W = εμβαδόν", "W = ½·4·10", "W = 20 J"] : ["F_{μέση} = 5 N", "W = 5·4 = 20 J"]}
        />
      </g>
    );
  },
  solve: (
    <>
      <b>W = εμβαδόν τριγώνου = ½·4 m·10 N = 20 J</b>.
    </>
  ),
  trap: "Το εμβαδόν κάτω από τον άξονα x (F αρνητική) μετράει αρνητικό έργο. Στο τέλος αθροίζεις με πρόσημα.",
};

/* ───────── 9. Ελατήριο ───────── */
const springPath = (x1: number, x2: number, y: number, n = 10, amp = 8) => {
  const pts: string[] = [`M ${x1} ${y}`];
  for (let i = 1; i < 2 * n; i++) pts.push(`L ${(x1 + ((x2 - x1) * i) / (2 * n)).toFixed(1)} ${y + (i % 2 ? amp : -amp)}`);
  pts.push(`L ${x2} ${y}`);
  return pts.join(" ");
};
const case9: ECase = {
  n: 9,
  title: "Ελατήριο",
  what: "Τεντώνουμε αργά ένα ελατήριο. Η δύναμη του ελατηρίου μεγαλώνει όσο το τεντώνουμε και είναι πάντα αντίθετη στην παραμόρφωση. Η ενέργεια αποθηκεύεται στο ελατήριο.",
  given: "k = 200 N/m, επιμήκυνση x = 10 cm = 0,10 m.",
  ask: "Τη δύναμη του ελατηρίου και την ελαστική δυναμική ενέργεια.",
  period: 11,
  legend: ["F", "U"],
  phases: [
    { until: 4.5, label: "Τέντωμα", say: "Νόμος του Hooke: F_{ελ} = −k·x. Το «−» λέει ότι η δύναμη τραβά προς τη θέση φυσικού μήκους. Στα 0,10 m: |F_{ελ}| = 200·0,1 = 20 N." },
    { until: 8, label: "Ενέργεια", say: "Η ενέργεια είναι το εμβαδόν του τριγώνου στο διάγραμμα F–x: U_{ελ} = ½·k·x² = ½·200·0,01 = 1 J." },
    { until: 11, label: "Διπλάσιο x", say: "Αν το τεντώσουμε 0,20 m, η δύναμη διπλασιάζεται (40 N), αλλά η ενέργεια τετραπλασιάζεται: U_{ελ} = ½·200·0,04 = 4 J." },
  ],
  Scene: ({ t }) => {
    const x = t < 8 ? 0.1 * easeInOut(seg(t, 0.4, 4)) : lerp(0.1, 0.2, easeInOut(seg(t, 8.3, 10.5)));
    const ppm = 300;
    const wall = 22;
    const nat = 100;
    const end = wall + nat + x * ppm;
    const F = 200 * x;
    const U = 0.5 * 200 * x * x;
    const gx = 222;
    const gy = 188;
    return (
      <g>
        <rect x={wall - 10} y={90} width={10} height={70} fill="#9c8c7d" />
        <Ground y={160} x1={12} x2={196} />
        <line x1={wall + nat} y1={78} x2={wall + nat} y2={166} stroke="#9aa3b2" strokeDasharray="3 3" />
        <TE x={wall + nat} y={74} s="φυσικό μήκος" size={8.5} color={WC.s} bold={false} />
        <path d={springPath(wall, end, 136)} fill="none" stroke={WC.v} strokeWidth={1.8} />
        <Block cx={end + 15} y={160} w={30} h={24} />
        <Arr x={end - 2} y={112} dx={-Math.max(0, F * 1.3)} color={WC.F} label="F_{ελ}" size={10} width={2.6} />
        {x > 0.005 ? <Dim x1={wall + nat} x2={end} y={178} label={`x = ${gr(x, 2)} m`} /> : null}
        <line x1={gx} y1={gy} x2={gx + 120} y2={gy} stroke="#9aa3b2" />
        <line x1={gx} y1={gy} x2={gx} y2={gy - 72} stroke="#9aa3b2" />
        <TE x={gx + 124} y={gy + 4} s="x" size={9} color={WC.s} anchor="start" italic />
        <TE x={gx} y={gy - 76} s="F" size={9} color={WC.s} italic />
        <polygon points={`${gx},${gy} ${gx + x * 550},${gy - F * 1.6} ${gx + x * 550},${gy}`} fill={WC.U} opacity={0.3} />
        <line x1={gx} y1={gy} x2={gx + x * 550} y2={gy - F * 1.6} stroke={WC.F} strokeWidth={2} />
        <PanelE
          lines={[t < 4.5 ? "|F_{ελ}| = k·x" : "U_{ελ} = ½·k·x^2", `x = ${gr(x, 2)} m`, `|F_{ελ}| = ${gr(F)} N`, `U_{ελ} = ${gr(U, 2)} J`]}
        />
      </g>
    );
  },
  solve: (
    <>
      <b>|F_ελ| = k·x = 200·0,10 = 20 N</b>, <b>U_ελ = ½·k·x² = ½·200·0,10² = 1 J</b>. Για x = 0,20 m: 4 J.
    </>
  ),
  trap: "Το x είναι η παραμόρφωση από το φυσικό μήκος (όχι όλο το μήκος του ελατηρίου) και πρέπει να είναι σε m.",
};

/* ───────── 10. Διάγραμμα F–x ή F–t ───────── */
const case10: ECase = {
  n: 10,
  title: "Διάγραμμα F–x ή F–t;",
  what: "Δύο διαγράμματα που μοιάζουν, αλλά το εμβαδόν τους σημαίνει άλλο πράγμα. Το μυστικό είναι τι έχει ο οριζόντιος άξονας.",
  given: "Σταθερή δύναμη F = 10 N. Στο πρώτο διάγραμμα ο άξονας είναι θέση έως 4 m, στο δεύτερο χρόνος έως 4 s.",
  ask: "Τι δίνει το εμβαδόν σε κάθε διάγραμμα και πόσο είναι.",
  period: 10,
  legend: ["W"],
  phases: [
    { until: 4, label: "F–x", say: "Οριζόντιος άξονας θέση x: εμβαδόν = F·x = έργο. Εδώ W = 10·4 = 40 J." },
    { until: 8, label: "F–t", say: "Οριζόντιος άξονας χρόνος t: εμβαδόν = F·Δt = ώθηση = μεταβολή ορμής Δp. Εδώ 10·4 = 40 N·s. Ίδιος αριθμός, άλλο μέγεθος!" },
    { until: 10, label: "Τι κοιτάς", say: "Πριν υπολογίσεις εμβαδόν, διάβασε τον οριζόντιο άξονα. F–x ⇒ έργο (J). F–t ⇒ ώθηση (N·s). Η ώθηση ανήκει στο κεφάλαιο της ορμής." },
  ],
  Scene: ({ t }) => {
    const k1 = seg(t, 0.4, 3.4);
    const k2 = seg(t, 4.4, 7.4);
    const draw = (gx: number, k: number, xl: string, col: string, label: string, show: boolean) => (
      <g opacity={show ? 1 : 0.35}>
        <line x1={gx} y1={160} x2={gx + 130} y2={160} stroke="#9aa3b2" />
        <line x1={gx} y1={160} x2={gx} y2={60} stroke="#9aa3b2" />
        <TE x={gx + 134} y={164} s={xl} size={10} color={WC.s} anchor="start" italic />
        <TE x={gx} y={54} s="F (N)" size={9.5} color={WC.s} italic />
        <rect x={gx} y={90} width={110 * k} height={70} fill={col} opacity={0.3} />
        <line x1={gx} y1={90} x2={gx + 110} y2={90} stroke={WC.F} strokeWidth={2.2} />
        <TE x={gx - 4} y={94} s="10" size={9} color={WC.s} anchor="end" />
        <TE x={gx + 110} y={174} s="4" size={9} color={WC.s} />
        {k > 0.98 ? <TE x={gx + 55} y={130} s={label} size={12} color={col} /> : null}
      </g>
    );
    return (
      <g>
        {draw(24, t >= 8 ? 1 : k1, "x (m)", WC.W, "W = 40 J", t < 4 || t >= 8)}
        {draw(198, t >= 8 ? 1 : k2, "t (s)", "#a46b29", "Δp = 40 N·s", t >= 4)}
        <TE x={90} y={30} s="εμβαδόν = έργο" size={12} color={WC.W} />
        <TE x={264} y={30} s="εμβαδόν = ώθηση" size={12} color="#a46b29" />
      </g>
    );
  },
  solve: (
    <>
      F–x: <b>W = 10·4 = 40 J</b>. F–t: <b>ώθηση = 10·4 = 40 N·s = Δp</b>, όχι έργο.
    </>
  ),
};

export const section2: ECase[] = [case6, case7, case8, case9, case10];
