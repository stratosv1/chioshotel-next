"use client";

import { C, Tag, lerp, num, seg } from "@/components/mixalis/ormi/kit";
import { BarsE, EC, HLines, PanelE, Plates, TE, sci, type ECase } from "./kitE";

/** Capacitor drawn as two vertical plates around x = 96, with a battery when connected. */
function Cap({ gap, connected, diel = 0, plus = "+Q", minus = "−Q" }: { gap: number; connected: boolean; diel?: number; plus?: string; minus?: string }) {
  const cx = 96;
  const x1 = cx - gap / 2;
  const x2 = cx + gap / 2;
  return (
    <g>
      {diel > 0 ? <rect x={x1 + 4} y={42} width={gap - 8} height={112} fill="#c8e6c9" opacity={diel} /> : null}
      <Plates x1={x1} x2={x2} y1={40} y2={156} signs={false} />
      <HLines x1={x1 + 5} x2={x2 - 5} ys={[62, 98, 134]} opacity={0.6} />
      <TE x={x1 - 6} y={36} s={plus} size={10} color={EC.pos} anchor="end" />
      <TE x={x2 + 6} y={36} s={minus} size={10} color={EC.neg} anchor="start" />
      {connected ? (
        <g stroke={C.edge} strokeWidth={1.4} fill="none">
          <path d={`M ${x1} 156 L ${x1} 186 L ${cx - 6} 186`} />
          <path d={`M ${x2} 156 L ${x2} 186 L ${cx + 6} 186`} />
          <line x1={cx - 6} y1={178} x2={cx - 6} y2={194} strokeWidth={2.4} />
          <line x1={cx + 6} y1={182} x2={cx + 6} y2={190} strokeWidth={2.4} />
        </g>
      ) : (
        <TE x={cx} y={190} s="αποσυνδεδεμένος" size={9.5} color={C.muted} bold={false} />
      )}
    </g>
  );
}

/* ───────── 26. Χωρητικότητα ───────── */
const case26: ECase = {
  n: 26,
  title: "Χωρητικότητα",
  what: "Ένας επίπεδος πυκνωτής αέρα συνδέεται με μπαταρία και φορτίζεται. Η χωρητικότητα εξαρτάται μόνο από τη γεωμετρία· το φορτίο από τη χωρητικότητα και την τάση.",
  given: "Εμβαδόν οπλισμού S = 5 cm² = 5·10⁻⁴ m², απόσταση ℓ = 8,85 mm, αέρας (ε₀ = 8,85·10⁻¹² C²/(N·m²)), τάση V = 885 V.",
  ask: "Τη χωρητικότητα, το φορτίο, την ένταση ανάμεσα στους οπλισμούς και την ενέργεια του πυκνωτή.",
  period: 11,
  legend: ["E", "U"],
  phases: [
    {
      until: 3.6,
      label: "C",
      say: "C = ε₀·S/ℓ = 8,85·10⁻¹²·5·10⁻⁴/8,85·10⁻³ = 5·10⁻¹³ F = 0,5 pF. Δεν εξαρτάται από V ή Q.",
    },
    {
      until: 7.2,
      label: "Φόρτιση",
      say: "Συνδέουμε τη μπαταρία: ηλεκτρόνια φεύγουν από τον έναν οπλισμό και πάνε στον άλλο, ώσπου η τάση του πυκνωτή να γίνει 885 V. Q = CV = 4,4·10⁻¹⁰ C.",
    },
    {
      until: 11,
      label: "E και U",
      say: "E = V/ℓ = 885/8,85·10⁻³ = 10⁵ V/m. U = ½QV = ½CV² ≈ 1,96·10⁻⁷ J.",
    },
  ],
  Scene: ({ t }) => {
    const ch = t < 3.6 ? 0 : t < 7.2 ? seg(t, 3.8, 6.8) : 1;
    const V = 885 * ch;
    const C0 = 5e-13;
    return (
      <g>
        <Cap gap={70} connected={t >= 3.6} plus={ch > 0 ? "+Q" : ""} minus={ch > 0 ? "−Q" : ""} />
        <PanelE
          lines={
            t < 3.6
              ? ["C = ε₀·S/ℓ", "C = 5·10⁻¹³ F = 0,5 pF"]
              : t < 7.2
                ? [`V = ${num(V, 0)} V`, `Q = CV = ${sci(C0 * V, 2)} C`]
                : ["E = V/ℓ = 10⁵ V/m", "U = ½CV²", "U ≈ 1,96·10⁻⁷ J"]
          }
        />
        <BarsE
          y={150}
          max={885}
          items={[
            { label: "V", value: V, text: `${num(V, 0)} V`, color: EC.U },
            { label: "Q", value: V, text: `${sci(C0 * V, 2)} C`, color: EC.pos },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      <b>C = 0,5 pF</b>, <b>Q = CV ≈ 4,4·10⁻¹⁰ C</b>, <b>E = V/ℓ = 10⁵ V/m</b>, <b>U = ½QV ≈ 1,96·10⁻⁷ J</b>.
    </>
  ),
  trap: "«C = Q/V» δεν σημαίνει ότι η C αλλάζει με το Q ή το V. Αν διπλασιάσεις την τάση, διπλασιάζεται το Q και η C μένει ίδια.",
};

/* ───────── 27. Ενέργεια πυκνωτή ───────── */
const case27: ECase = {
  n: 27,
  title: "Ενέργεια πυκνωτή",
  what: "Φορτίζουμε πυκνωτή από 0 ως 100 V. Το διάγραμμα Q–V είναι ευθεία· το εμβαδόν κάτω από αυτή είναι η ενέργεια που αποθηκεύεται.",
  given: "Χωρητικότητα C = 10 μF. Φόρτιση ως V = 100 V.",
  ask: "Το τελικό φορτίο και την ενέργεια του πυκνωτή.",
  period: 10.5,
  legend: ["U"],
  phases: [
    {
      until: 5,
      label: "Φορτίζει",
      say: "Καθώς φορτίζεται, Q = CV: το Q μεγαλώνει ανάλογα με το V. Στα 100 V: Q = 10·10⁻⁶·100 = 10⁻³ C.",
    },
    {
      until: 10.5,
      label: "Εμβαδόν = U",
      say: "Η ενέργεια είναι το εμβαδόν του τριγώνου: U = ½QV = ½·10⁻³·100 = 0,05 J. Ισοδύναμα U = ½CV² = Q²/(2C).",
    },
  ],
  Scene: ({ t }) => {
    const V = t < 5 ? lerp(0, 100, seg(t, 0.3, 4.6)) : 100;
    const Q = 1e-5 * V;
    const gx = 40;
    const gy = 170;
    const W = 140;
    const H = 120;
    const px = gx + (V / 100) * W;
    const py = gy - (V / 100) * H;
    return (
      <g>
        <line x1={gx} y1={gy} x2={gx + W + 12} y2={gy} stroke={C.muted} />
        <line x1={gx} y1={gy} x2={gx} y2={gy - H - 12} stroke={C.muted} />
        <TE x={gx + W + 14} y={gy + 14} s="V" size={10} color={C.muted} italic />
        <TE x={gx - 8} y={gy - H - 12} s="Q" size={10} color={C.muted} italic anchor="end" />
        <path d={`M ${gx} ${gy} L ${px} ${py} L ${px} ${gy} Z`} fill={EC.U} opacity={t >= 5 ? 0.35 : 0.15} />
        <line x1={gx} y1={gy} x2={px} y2={py} stroke={EC.U} strokeWidth={2.4} />
        <circle cx={px} cy={py} r={3} fill={EC.U} />
        {t >= 5 ? <TE x={gx + W * 0.66} y={gy - 24} s="U" size={14} color="#9a5a0c" italic /> : null}
        <PanelE lines={[`V = ${num(V, 0)} V`, `Q = ${sci(Q, 2)} C`, `U = ½QV = ${num(0.5 * Q * V, 3)} J`]} />
      </g>
    );
  },
  solve: (
    <>
      <b>Q = CV = 10⁻³ C</b>. <b>U = ½QV = ½CV² = 0,05 J</b>.
    </>
  ),
  trap: "U = ½QV, όχι QV. Το ½ υπάρχει γιατί η τάση ανεβαίνει σταδιακά από το 0 κατά τη φόρτιση.",
};

/* ───────── 28. Αλλάζει το ℓ με V σταθερή ───────── */
const case28: ECase = {
  n: 28,
  title: "Αλλάζει το ℓ, V σταθερή",
  what: "Ο πυκνωτής μένει συνδεδεμένος με την πηγή και απομακρύνουμε τους οπλισμούς στη διπλάσια απόσταση. Η τάση δεν αλλάζει (την κρατά η πηγή), όλα τα άλλα αλλάζουν.",
  given: "C₀ = 10 μF, συνδεδεμένος με πηγή V = 100 V, ℓ₀ = 2 mm. Η απόσταση γίνεται ℓ = 4 mm.",
  ask: "Τη νέα χωρητικότητα, το φορτίο, την ένταση και την ενέργεια.",
  period: 10.5,
  legend: ["E", "U"],
  phases: [
    {
      until: 3.5,
      label: "Αρχικά",
      say: "Q₀ = C₀V = 10⁻³ C, E₀ = V/ℓ₀ = 5·10⁴ V/m, U₀ = ½C₀V² = 0,05 J.",
    },
    {
      until: 7,
      label: "Απομακρύνουμε",
      say: "C = ε₀S/ℓ: διπλάσιο ℓ ⇒ C = 5 μF. Η τάση μένει 100 V (συνδεδεμένος), άρα Q = CV = 5·10⁻⁴ C: μέρος του φορτίου γυρίζει στην πηγή.",
    },
    {
      until: 10.5,
      label: "E και U",
      say: "E = V/ℓ = 100/0,004 = 2,5·10⁴ V/m (μισή). U = ½CV² = 0,025 J (μισή).",
    },
  ],
  Scene: ({ t }) => {
    const f = t < 3.5 ? 0 : seg(t, 3.7, 6.6);
    const l = 2 + 2 * f;
    const Cf = 20 / l;
    const Q = Cf * 1e-6 * 100;
    const E = 100 / (l * 1e-3);
    const U = 0.5 * Cf * 1e-6 * 1e4;
    return (
      <g>
        <Cap gap={l * 22} connected plus="+Q" minus="−Q" />
        <PanelE lines={[`ℓ = ${num(l, 1)} mm · V = 100 V`, `C = ${num(Cf, 1)} μF`, `Q = ${sci(Q, 2)} C`, `E = ${sci(E, 2)} V/m`]} />
        <BarsE
          y={136}
          max={1}
          items={[
            { label: "V", value: 1, text: "100 V", color: EC.U },
            { label: "C", value: Cf / 10, text: `${num(Cf, 1)} μF`, color: C.ink },
            { label: "Q", value: Q / 1e-3, text: `${sci(Q, 2)} C`, color: EC.pos },
            { label: "U", value: U / 0.05, text: `${num(U, 3)} J`, color: "#9a5a0c" },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      <b>C = 5 μF</b>, V = 100 V (σταθερή), <b>Q = 5·10⁻⁴ C</b>, <b>E = 2,5·10⁴ V/m</b>, <b>U = 0,025 J</b>: όλα υποδιπλασιάζονται εκτός από την τάση.
    </>
  ),
  trap: "Πρώτα ρώτα: «είναι συνδεδεμένος με πηγή;». Αν ναι, σταθερό είναι το V. Αν όχι, σταθερό είναι το Q (κουτάκι 29).",
};

/* ───────── 29. Αλλάζει το ℓ με Q σταθερό ───────── */
const case29: ECase = {
  n: 29,
  title: "Αλλάζει το ℓ, Q σταθερό",
  what: "Φορτίζουμε τον πυκνωτή, τον αποσυνδέουμε και μετά τραβάμε τους οπλισμούς στη διπλάσια απόσταση. Το φορτίο δεν έχει πού να πάει· η τάση ανεβαίνει και η ενέργεια μεγαλώνει.",
  given: "C₀ = 20 μF φορτισμένος σε V₀ = 200 V με ℓ₀ = 1 cm. Αποσυνδέεται και η απόσταση γίνεται ℓ = 2 cm.",
  ask: "Τη νέα χωρητικότητα, την τάση, την ένταση και την ενέργεια.",
  period: 10.5,
  legend: ["E", "U"],
  phases: [
    {
      until: 3.5,
      label: "Αποσύνδεση",
      say: "Q = C₀V₀ = 20·10⁻⁶·200 = 4·10⁻³ C. Μετά την αποσύνδεση το φορτίο μένει σταθερό. E₀ = V₀/ℓ₀ = 2·10⁴ V/m, U₀ = ½QV₀ = 0,4 J.",
    },
    {
      until: 7,
      label: "Τραβάμε",
      say: "C = C₀/2 = 10 μF. Το Q μένει 4·10⁻³ C, άρα V = Q/C = 400 V: η τάση διπλασιάστηκε.",
    },
    {
      until: 10.5,
      label: "E και U",
      say: "E = V/ℓ = 400/0,02 = 2·10⁴ V/m: ίδια! U = ½QV = 0,8 J: διπλασιάστηκε. Την επιπλέον ενέργεια τη δώσαμε εμείς τραβώντας τους οπλισμούς που έλκονται.",
    },
  ],
  Scene: ({ t }) => {
    const f = t < 3.5 ? 0 : seg(t, 3.7, 6.6);
    const l = 1 + f;
    const Cf = 20 / l;
    const Q = 4e-3;
    const V = Q / (Cf * 1e-6);
    const E = V / (l * 1e-2);
    const U = 0.5 * Q * V;
    return (
      <g>
        <Cap gap={l * 46} connected={false} plus="+Q" minus="−Q" />
        <PanelE lines={[`ℓ = ${num(l, 2)} cm · Q σταθ.`, `C = ${num(Cf, 1)} μF`, `V = Q/C = ${num(V, 0)} V`, `E = ${sci(E, 2)} V/m`]} />
        <BarsE
          y={136}
          max={1}
          items={[
            { label: "Q", value: 0.5, text: "4·10⁻³ C", color: EC.pos },
            { label: "C", value: Cf / 40, text: `${num(Cf, 1)} μF`, color: C.ink },
            { label: "V", value: V / 400, text: `${num(V, 0)} V`, color: EC.U },
            { label: "U", value: U / 0.8, text: `${num(U, 2)} J`, color: "#9a5a0c" },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      <b>C = 10 μF</b>, Q = 4·10⁻³ C (σταθερό), <b>V = 400 V</b>, <b>E = 2·10⁴ V/m</b> (ίδια), <b>U = 0,8 J</b> (από 0,4 J).
    </>
  ),
  trap: "Με σταθερό Q η ένταση E = Q/(ε₀S) δεν εξαρτάται από το ℓ. Γι' αυτό δεν αλλάζει, παρότι αλλάζουν και V και ℓ.",
};

/* ───────── 30. Διηλεκτρικό ───────── */
const case30: ECase = {
  n: 30,
  title: "Διηλεκτρικό",
  what: "Γεμίζουμε τον χώρο ανάμεσα στους οπλισμούς με μονωτικό (διηλεκτρικό). Η χωρητικότητα πολλαπλασιάζεται επί ε. Τι άλλο αλλάζει εξαρτάται από το αν ο πυκνωτής είναι συνδεδεμένος.",
  given: "α) Συνδεδεμένος: C₀ = 1 μF, V = 100 V, ℓ = 5 cm, νερό ε = 80. β) Αποσυνδεδεμένος: C₀ = 5 μF φορτισμένος σε 100 V, διηλεκτρικό ε = 5.",
  ask: "Χωρητικότητα, φορτίο, τάση, ένταση και ενέργεια μετά το διηλεκτρικό, σε κάθε περίπτωση.",
  period: 11,
  legend: ["E", "U"],
  phases: [
    {
      until: 3.6,
      label: "Συνδεδεμένος",
      say: "C = εC₀ = 80 μF. V = 100 V (η πηγή). Q = CV = 8·10⁻³ C (80 φορές πάνω). E = V/ℓ = 2·10³ V/m (ίδια). U = ½CV² = 0,4 J (από 5·10⁻³ J): την ενέργεια την έδωσε η πηγή.",
    },
    {
      until: 7.2,
      label: "Αποσυνδεδεμένος",
      say: "C = 5·5 = 25 μF. Q = C₀V₀ = 5·10⁻⁴ C (σταθερό). V = Q/C = 20 V (το 1/5). U = ½QV = 5·10⁻³ J (από 0,025 J): η ενέργεια μειώθηκε.",
    },
    {
      until: 11,
      label: "Σύγκριση",
      say: "Και στις δύο C ×ε. Με V σταθερή: Q ×ε, U ×ε. Με Q σταθερό: V ÷ε, E ÷ε, U ÷ε.",
    },
  ],
  Scene: ({ t }) => {
    const connected = t < 3.6 || t >= 7.2;
    const local = t < 3.6 ? t : t < 7.2 ? t - 3.6 : 0;
    const d = t >= 7.2 ? 1 : seg(local, 0.4, 2.6);
    const eps = connected ? 80 : 5;
    const C0 = connected ? 1 : 5;
    const Cf = C0 * (1 + (eps - 1) * d);
    const Q = connected ? Cf * 1e-6 * 100 : 5e-4;
    const V = connected ? 100 : Q / (Cf * 1e-6);
    const U = 0.5 * Q * V;
    return (
      <g>
        <Cap gap={74} connected={connected} diel={0.85 * d} plus="+Q" minus="−Q" />
        {d > 0.3 ? <TE x={96} y={84} s={`ε = ${eps}`} size={11} color="#2e7d32" /> : null}
        <PanelE
          lines={
            t < 7.2
              ? [connected ? "α) V = 100 V σταθ." : "β) Q σταθερό", `C = ${num(Cf, 1)} μF`, `Q = ${sci(Q, 2)} C`, `V = ${num(V, 1)} V`, `U = ${sci(U, 2)} J`]
              : ["Σύγκριση", "V σταθ.: Q×ε, U×ε", "Q σταθ.: V÷ε, U÷ε", "πάντα: C×ε"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      α) <b>C = 80 μF, Q = 8·10⁻³ C, V = 100 V, E = 2·10³ V/m, U = 0,4 J</b>. β) <b>C = 25 μF, Q = 5·10⁻⁴ C, V = 20 V, U = 5·10⁻³ J</b>.
    </>
  ),
  trap: "Το διηλεκτρικό πάντα αυξάνει τη C. Αν η ενέργεια αυξάνεται ή μειώνεται εξαρτάται από το αν ο πυκνωτής είναι συνδεδεμένος με πηγή.",
};

export const section6 = [case26, case27, case28, case29, case30];
