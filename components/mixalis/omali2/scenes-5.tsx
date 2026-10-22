"use client";

import { C, Tag, lerp, num, seg } from "@/components/mixalis/ormi/kit";
import { Along, ArcPath, Block, Car, K, MagBars, P, Panel, inward, tang, type OCase } from "./kit2";

/* Tracks: loops (rider 60 kg, R = 10 m), a hill and a valley (car 1000 kg). */

const LX = 100;
const LY = 98;
const LR = 66;

function Loop() {
  return (
    <g>
      <circle cx={LX} cy={LY} r={LR + 2} fill="none" stroke={K.track} strokeWidth={4} />
      <circle cx={LX} cy={LY} r={2.4} fill={C.ink} />
    </g>
  );
}

/** Cart riding on the inside of the loop at angle θ (moving counter-clockwise). */
function LoopCart({ th }: { th: number }) {
  const [x, y] = P(LX, LY, LR - 7, th);
  const rot = (-th * 180) / Math.PI - 90;
  return <Block x={x} y={y} w={22} h={13} rot={rot + 180} fill="#e8a65d" />;
}

/* ───────── 21. Λούπα (κάτω) ───────── */
const case21: OCase = {
  n: 21,
  title: "Λούπα (κάτω)",
  what: "Βαγονάκι λούνα παρκ περνά από το χαμηλότερο σημείο μιας κατακόρυφης λούπας. Δείχνει γιατί εκεί ο επιβάτης «νιώθει» πολύ βαρύτερος.",
  given: "Επιβάτης m = 60 kg, ακτίνα λούπας R = 10 m, ταχύτητα στο κατώτερο σημείο υ = 20 m/s.",
  ask: "Την κάθετη δύναμη N από το κάθισμα στον επιβάτη. Πόσες φορές το βάρος του είναι;",
  period: 10.5,
  legend: ["v", "F"],
  phases: [
    {
      until: 3.5,
      label: "Στον πάτο",
      say: "Στο κατώτερο σημείο το κέντρο της λούπας είναι από πάνω. Το κάθισμα σπρώχνει τον επιβάτη προς τα πάνω (N, προς το κέντρο), το βάρος τον τραβά κάτω.",
    },
    {
      until: 7,
      label: "Η εξίσωση",
      say: "Θετικά προς το κέντρο: N − mg = mυ²/R ⇒ N = 600 + 60·400/10 = 600 + 2400 = 3000 N.",
    },
    {
      until: 10.5,
      label: "5 φορές βαρύτερος",
      say: "Το «βάρος που νιώθεις» είναι η N. Εδώ N = 3000 N = 5·mg: ο επιβάτης νιώθει πέντε φορές βαρύτερος, σαν να ζύγιζε 300 kg.",
    },
  ],
  Scene: ({ t }) => {
    const th = t < 3.5 ? lerp(-Math.PI / 2 - 0.9, -Math.PI / 2, seg(t, 0, 3.2)) : -Math.PI / 2;
    const [x, y] = P(LX, LY, LR - 7, th);
    const k = 0.02;
    return (
      <g>
        <Loop />
        <LoopCart th={th} />
        <Along x={x} y={y} u={tang(th)} len={40} color={K.v} label="υ" labelSide="above" />
        <Along x={x - 3} y={y} u={inward(th)} len={3000 * k} color={K.F} label="N" width={3} labelSide="left" />
        <Along x={x + 3} y={y} u={[0, 1]} len={600 * k} color={K.g} label="mg" labelSide="right" />
        <Panel
          x={206}
          y={14}
          w={148}
          lines={t < 3.5 ? ["Θετικά προς κέντρο", "N: + (πάνω)", "mg: − (κάτω)"] : t < 7 ? ["Κατώτερο σημείο", "N − mg = mυ²/R", "N = 600 + 2400", "N = 3000 N"] : ["Αίσθηση βάρους", "N / mg = 3000/600", "= 5"]}
        />
        <MagBars x={206} y={150} w={150} max={3200} items={[{ label: "N", value: 3000, color: K.F }, { label: "mg", value: 600, color: K.g }]} />
      </g>
    );
  },
  solve: (
    <>
      N − mg = mυ²/R ⇒ <b>N = 60·10 + 60·20²/10 = 600 + 2400 = 3000 N</b>, δηλαδή <b>N = 5·mg</b>.
    </>
  ),
  trap: "Η ζυγαριά (ή το κάθισμα) δείχνει την N, όχι το mg. Στον πάτο της λούπας N > mg.",
};

/* ───────── 22. Κορυφή λόφου ───────── */
const HX = 120;
const HY = 250;
const HR = 150;
const case22: OCase = {
  n: 22,
  title: "Κορυφή λόφου",
  what: "Αυτοκίνητο περνά πάνω από ένα κυρτό λόφο. Εδώ το κέντρο του κύκλου είναι κάτω από τον δρόμο, οπότε η κάθετη δύναμη γίνεται μικρότερη από το βάρος.",
  given: "m = 1000 kg, ακτίνα καμπυλότητας R = 40 m, υ = 10 m/s στην κορυφή.",
  ask: "Την κάθετη δύναμη N του δρόμου στην κορυφή.",
  period: 10.5,
  legend: ["v", "F"],
  phases: [
    {
      until: 3.5,
      label: "Ανεβαίνει",
      say: "Το αυτοκίνητο ανεβαίνει στον λόφο. Στην κορυφή το κέντρο του κύκλου είναι από κάτω: προς το κέντρο σημαίνει προς τα κάτω.",
    },
    {
      until: 7,
      label: "Στην κορυφή",
      say: "Τώρα το βάρος δείχνει προς το κέντρο (+) και η N μακριά από αυτό (−): mg − N = mυ²/R ⇒ N = 10000 − 1000·100/40 = 7500 N.",
    },
    {
      until: 10.5,
      label: "Πιο «ελαφρύ»",
      say: "N < mg: το αυτοκίνητο πιέζει λιγότερο τον δρόμο, οι επιβάτες νιώθουν πιο ελαφριοί. Όσο πιο γρήγορα, τόσο μικρότερη η N (δες το κουτάκι 28).",
    },
  ],
  Scene: ({ t }) => {
    const top = Math.PI / 2;
    const a = t < 3.5 ? lerp(top + 0.42, top, seg(t, 0, 3.2)) : t < 7 ? top : lerp(top, top - 0.42, seg(t, 7.3, 10.3));
    const [x, y] = P(HX, HY, HR, a);
    const rot = 90 - (a * 180) / Math.PI;
    const n = inward(a);
    const k = 0.004;
    const atTop = t >= 3.5 && t < 7;
    return (
      <g>
        <ArcPath cx={HX} cy={HY} r={HR} a0={top + 0.62} a1={top - 0.62} color={K.track} width={4} />
        <Car x={x} y={y - 2} rot={rot} />
        <Along x={x} y={y - 14} u={tang(a).map((c) => -c) as [number, number]} len={30} color={K.v} label="υ" labelSide="above" />
        {atTop || t >= 7 ? (
          <g>
            <Along x={x - 4} y={y} u={[-n[0], -n[1]]} len={7500 * k} color={K.F} label="N" width={3} labelSide="left" />
            <Along x={x + 4} y={y} u={[0, 1]} len={10000 * k} color={K.g} label="mg" width={3} labelSide="right" />
          </g>
        ) : null}
        <Panel x={206} y={14} w={148} lines={t < 3.5 ? ["Κυρτή επιφάνεια", "κέντρο: από κάτω"] : ["Θετικά προς κέντρο (κάτω)", "mg − N = mυ²/R", "N = 10000 − 2500", "N = 7500 N"]} />
        <MagBars x={206} y={150} w={150} max={10500} items={[{ label: "N", value: t < 3.5 ? 0 : 7500, color: K.F }, { label: "mg", value: 10000, color: K.g }]} />
      </g>
    );
  },
  solve: (
    <>
      Θετικά προς το κέντρο (κάτω): mg − N = mυ²/R ⇒ <b>N = mg − mυ²/R = 10000 − 1000·10²/40 = 7500 N</b>.
    </>
  ),
  trap: "Στην κορυφή λόφου ο τύπος είναι mg − N, ανάποδα από την κοιλάδα. Ρώτα πάντα: πού είναι το κέντρο του κύκλου;",
};

/* ───────── 23. Λούπα (πλάι) ───────── */
const case23: OCase = {
  n: 23,
  title: "Λούπα (πλάι)",
  what: "Το βαγονάκι περνά από το πλάι της λούπας, στο ύψος του κέντρου. Η τροχιά «σπρώχνει» οριζόντια και το βάρος δείχνει κατά μήκος της τροχιάς.",
  given: "Επιβάτης m = 60 kg, R = 10 m. Στο πλάι της λούπας υ = 15 m/s.",
  ask: "Την κάθετη δύναμη N εκεί. Τι κάνει το βάρος;",
  period: 10.5,
  legend: ["v", "F"],
  phases: [
    {
      until: 3.5,
      label: "Στο πλάι",
      say: "Στο πλάι, η N είναι οριζόντια, προς το κέντρο. Το βάρος είναι κατακόρυφο, άρα κάθετο στην ακτίνα: δεν μπαίνει στην κεντρομόλο.",
    },
    {
      until: 7,
      label: "Η εξίσωση",
      say: "Μόνη ακτινική δύναμη η N: N = mυ²/R = 60·225/10 = 1350 N.",
    },
    {
      until: 10.5,
      label: "Επιβραδύνει",
      say: "Το βάρος είναι αντίθετο στην ταχύτητα (το βαγόνι ανεβαίνει), άρα μικραίνει το μέτρο της υ με α_ε = g. Όσο ανεβαίνει, πάει πιο αργά.",
    },
  ],
  Scene: ({ t }) => {
    const th = t < 3.5 ? lerp(-0.8, 0, seg(t, 0, 3.2)) : t < 7 ? 0 : lerp(0, 0.7, seg(t, 7.2, 10.3));
    const v = t < 7 ? 15 : Math.sqrt(Math.max(0, 225 - 200 * Math.sin(th)));
    const [x, y] = P(LX, LY, LR - 7, th);
    const k = 0.03;
    const N = 60 * (v * v) / 10 - 600 * Math.sin(th);
    return (
      <g>
        <Loop />
        <LoopCart th={th} />
        <Along x={x} y={y} u={tang(th)} len={v * 2.6} color={K.v} label="υ" labelSide="right" />
        <Along x={x} y={y} u={inward(th)} len={N * k} color={K.F} label="N" width={3} labelSide="above" />
        <Along x={x + 4} y={y} u={[0, 1]} len={600 * k} color={K.g} label="mg" labelSide="right" />
        <Panel x={206} y={14} w={148} lines={t < 7 ? ["Ακτινικά μόνο η N", "N = mυ²/R", "N = 60·225/10", "N = 1350 N"] : ["Επιτρόχια: mg", "α_ε = g (φρενάρει)", `υ = ${num(v, 1)} m/s`]} />
        <MagBars x={206} y={150} w={150} max={1500} items={[{ label: "N", value: N, color: K.F }, { label: "mg", value: 600, color: K.g }]} />
      </g>
    );
  },
  solve: (
    <>
      Ακτινικά μόνο η N: <b>N = mυ²/R = 60·15²/10 = 1350 N</b>. Το βάρος είναι εφαπτομενικό και επιβραδύνει το βαγόνι (α_ε = g).
    </>
  ),
  trap: "Στο πλάι της λούπας η N ≠ mg. Δεν έχει καμία σχέση με το βάρος: εξαρτάται μόνο από το υ²/R.",
};

/* ───────── 24. Κοιλάδα ───────── */
const VX = 120;
const VY = -50;
const VR = 160;
const case24: OCase = {
  n: 24,
  title: "Κοιλάδα (πυθμένας)",
  what: "Αυτοκίνητο περνά από τον πυθμένα μιας κοίλης κοιλάδας. Το κέντρο του κύκλου είναι από πάνω, όπως στον πάτο της λούπας.",
  given: "m = 1000 kg, ακτίνα καμπυλότητας R = 50 m, υ = 20 m/s στο χαμηλότερο σημείο.",
  ask: "Την κάθετη δύναμη N του δρόμου στον πυθμένα.",
  period: 10.5,
  legend: ["v", "F"],
  phases: [
    {
      until: 3.5,
      label: "Κατεβαίνει",
      say: "Το αυτοκίνητο κατεβαίνει στην κοιλάδα. Στον πυθμένα το κέντρο είναι από πάνω: η N δείχνει προς το κέντρο (+), το βάρος μακριά (−).",
    },
    {
      until: 7,
      label: "Στον πυθμένα",
      say: "N − mg = mυ²/R ⇒ N = 10000 + 1000·400/50 = 10000 + 8000 = 18000 N. Η ανάρτηση «κάθεται», οι επιβάτες πιέζονται στο κάθισμα.",
    },
    {
      until: 10.5,
      label: "Λόφος vs κοιλάδα",
      say: "Λόφος: mg − N = mυ²/R (N < mg). Κοιλάδα: N − mg = mυ²/R (N > mg). Η διαφορά είναι μόνο πού βρίσκεται το κέντρο.",
    },
  ],
  Scene: ({ t }) => {
    const bot = -Math.PI / 2;
    const a = t < 3.5 ? lerp(bot - 0.42, bot, seg(t, 0, 3.2)) : t < 7 ? bot : lerp(bot, bot + 0.42, seg(t, 7.3, 10.3));
    const [x, y] = P(VX, VY, VR, a);
    const rot = -((a * 180) / Math.PI + 90);
    const n = inward(a);
    const k = 0.0035;
    const showF = t >= 3.5;
    return (
      <g>
        <ArcPath cx={VX} cy={VY} r={VR} a0={bot - 0.62} a1={bot + 0.62} color={K.track} width={4} />
        <Car x={x} y={y - 2} rot={rot} />
        <Along x={x} y={y - 14} u={tang(a)} len={30} color={K.v} label="υ" labelSide="above" />
        {showF ? (
          <g>
            <Along x={x - 4} y={y - 4} u={n} len={18000 * k} color={K.F} label="N" width={3} labelSide="left" />
            <Along x={x + 4} y={y} u={[0, 1]} len={10000 * k} color={K.g} label="mg" width={3} labelSide="right" />
          </g>
        ) : null}
        <Panel x={206} y={14} w={148} lines={t < 7 ? ["Κοίλη επιφάνεια", "N − mg = mυ²/R", "N = 10000 + 8000", "N = 18000 N"] : ["Σύγκριση", "λόφος: mg − N", "κοιλάδα: N − mg", "(= mυ²/R και στα δύο)"]} />
        <MagBars x={206} y={150} w={150} max={19000} items={[{ label: "N", value: showF ? 18000 : 0, color: K.F }, { label: "mg", value: 10000, color: K.g }]} />
      </g>
    );
  },
  solve: (
    <>
      N − mg = mυ²/R ⇒ <b>N = 10000 + 1000·20²/50 = 18000 N</b> (1,8 φορές το βάρος).
    </>
  ),
  trap: "Στην κοιλάδα το αυτοκίνητο δεν «χάνει» ποτέ την επαφή. Όσο πιο γρήγορα, τόσο μεγαλύτερη η N.",
};

/* ───────── 25. Λούπα (πάνω) ───────── */
const case25: OCase = {
  n: 25,
  title: "Λούπα (πάνω)",
  what: "Το βαγονάκι στην κορυφή της λούπας, ανάποδα. Τώρα και η N και το βάρος δείχνουν προς τα κάτω, προς το κέντρο.",
  given: "Επιβάτης m = 60 kg, R = 10 m. Στην κορυφή υ = 12 m/s.",
  ask: "Την κάθετη δύναμη N στην κορυφή και την ελάχιστη ταχύτητα για να μην πέσει.",
  period: 10.5,
  legend: ["v", "F"],
  phases: [
    {
      until: 3.5,
      label: "Ανάποδα",
      say: "Στην κορυφή ο επιβάτης είναι ανάποδα. Η τροχιά (το κάθισμα) σπρώχνει προς τα κάτω, προς το κέντρο, και το βάρος επίσης.",
    },
    {
      until: 7,
      label: "Η εξίσωση",
      say: "N + mg = mυ²/R ⇒ N = 60·144/10 − 600 = 864 − 600 = 264 N. Μικρή, αλλά θετική: ο επιβάτης ακουμπά ακόμα στο κάθισμα.",
    },
    {
      until: 10.5,
      label: "Το όριο",
      say: "Αν η υ πέσει στα √(gR) = 10 m/s, τότε N = 0: μόνο το βάρος δίνει την κεντρομόλο. Πιο αργά από αυτό, το βαγόνι θα ξεκολλούσε από την τροχιά.",
    },
  ],
  Scene: ({ t }) => {
    const top = Math.PI / 2;
    const th = t < 3.5 ? lerp(top - 0.9, top, seg(t, 0, 3.2)) : top;
    const v = t < 7 ? 12 : lerp(12, 10, seg(t, 7.3, 9.6));
    const N = 6 * v * v - 600;
    const [x, y] = P(LX, LY, LR - 7, th);
    const k = 0.05;
    return (
      <g>
        <Loop />
        <LoopCart th={th} />
        <Along x={x} y={y} u={tang(th)} len={v * 3} color={K.v} label="υ" labelSide="above" />
        {N > 2 ? <Along x={x - 3} y={y} u={inward(th)} len={N * k} color={K.F} label="N" width={3} labelSide="left" /> : null}
        <Along x={x + 3} y={y} u={[0, 1]} len={600 * k} color={K.g} label="mg" width={3} labelSide="right" />
        <Panel x={206} y={14} w={148} lines={t < 7 ? ["Θετικά προς κέντρο (κάτω)", "N + mg = mυ²/R", "N = 864 − 600", "N = 264 N"] : [`υ = ${num(v, 1)} m/s`, `N = 6υ² − 600 = ${num(Math.max(0, N), 0)} N`, "όριο: υ = √(gR) = 10 m/s"]} />
        <MagBars x={206} y={150} w={150} max={700} items={[{ label: "N", value: Math.max(0, N), color: K.F }, { label: "mg", value: 600, color: K.g }]} />
        <Tag x={12} y={200} s="N = 0: μόνο το βάρος" color={K.F} show={N <= 2} />
      </g>
    );
  },
  solve: (
    <>
      N + mg = mυ²/R ⇒ <b>N = 60·12²/10 − 600 = 264 N</b>. Όριο (N = 0): <b>υ<sub>min</sub> = √(gR) = √100 = 10 m/s</b>.
    </>
  ),
  trap: "Η κορυφή της λούπας μοιάζει με το νήμα στην κορυφή (κουτάκι 19): N στη θέση της T. Και τα δύο προς τα κάτω, άρα και τα δύο με «+».",
};

export const section5 = [case21, case22, case23, case24, case25];
