"use client";

import { C, Tag, lerp, num, seg } from "@/components/mixalis/ormi/kit";
import { Arr, BarsE, Charge, EC, PanelE, TE, sci, type ECase } from "./kitE";

const k = 9e9;

/* ───────── 11. Ομόσημα φορτία ───────── */
const case11: ECase = {
  n: 11,
  title: "Ομόσημα φορτία",
  what: "Δύο θετικά φορτία κοντά το ένα στο άλλο. Το σύστημα έχει θετική δυναμική ενέργεια: αν αφήσουμε το μικρό φορτίο ελεύθερο, φεύγει μόνο του και η ενέργεια γίνεται κινητική.",
  given: "Ακλόνητο Q = +10 μC. Δοκιμαστικό q = +1 nC σε r = 10 cm, αρχικά ακίνητο. k = 9·10⁹ N·m²/C².",
  ask: "Την ένταση και τη δύναμη στη θέση του q, τη δυναμική ενέργεια του συστήματος και την κινητική ενέργεια του q στο άπειρο.",
  period: 11,
  legend: ["F", "U"],
  phases: [
    {
      until: 3.5,
      label: "E και F",
      say: "E = k|Q|/r² = 9·10⁹·10⁻⁵/10⁻² = 9·10⁶ N/C. F = qE = 10⁻⁹·9·10⁶ = 9·10⁻³ N, απωστική.",
    },
    {
      until: 7,
      label: "U > 0",
      say: "U = kQq/r = 9·10⁹·10⁻⁵·10⁻⁹/0,1 = 9·10⁻⁴ J. Θετική, γιατί τα φορτία είναι ομόσημα (απωθούνται).",
    },
    {
      until: 11,
      label: "Φεύγει",
      say: "Το αφήνουμε. Απομακρύνεται μόνο του: η U μικραίνει και η κινητική μεγαλώνει. Στο άπειρο U = 0, οπότε K_∞ = 9·10⁻⁴ J (όλη η αρχική U).",
    },
  ],
  Scene: ({ t }) => {
    const r = t < 7 ? 0.1 : lerp(0.1, 1.2, Math.pow(seg(t, 7.2, 10.8), 1.4));
    const U = (k * 1e-5 * 1e-9) / r;
    const Kk = 9e-4 - U;
    const qx = 28;
    const y = 96;
    const px = qx + 30 + (r - 0.1) * 120;
    const F = (k * 1e-5 * 1e-9) / (r * r);
    return (
      <g>
        <Charge x={qx} y={y} sign={1} r={13} label="+Q" labelDy={-20} />
        <Charge x={px} y={y} sign={1} r={6} label="q" labelDy={-12} />
        <Arr x={px + 8} y={y} dx={Math.max(4, (F / 9e-3) * 32)} color={EC.F} label="F" />
        <line x1={qx} y1={y + 20} x2={px} y2={y + 20} stroke={C.faint} strokeDasharray="2 3" />
        <TE x={(qx + px) / 2} y={y + 32} s={`r = ${num(r * 100, 0)} cm`} size={9.5} color={C.muted} bold={false} />
        <PanelE
          lines={
            t < 3.5
              ? ["Στη θέση Γ", "E = 9·10⁶ N/C", "F = qE = 9·10⁻³ N"]
              : t < 7
                ? ["Δυναμική ενέργεια", "U = kQq/r", "U = +9·10⁻⁴ J (>0)"]
                : ["Διατήρηση ενέργειας", `U = ${sci(U, 2)} J`, `K = ${sci(Math.max(0, Kk), 2)} J`, "K_∞ = U_Γ = 9·10⁻⁴ J"]
          }
        />
        <BarsE
          y={150}
          max={9e-4}
          items={[
            { label: "U", value: U, text: `${sci(U, 2)} J`, color: EC.U },
            { label: "K", value: Kk, text: `${sci(Math.max(0, Kk), 2)} J`, color: EC.v },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      <b>E = 9·10⁶ N/C</b>, <b>F = 9·10⁻³ N</b>. <b>U = kQq/r = 9·10⁻⁴ J</b>. Στο άπειρο: <b>K_∞ = U_Γ = 9·10⁻⁴ J</b>.
    </>
  ),
  trap: "Η δυναμική ενέργεια ανήκει στο σύστημα των δύο φορτίων. Τη λέμε «του q» μόνο επειδή το Q είναι ακλόνητο.",
};

/* ───────── 12. Ετερόσημα φορτία ───────── */
const case12: ECase = {
  n: 12,
  title: "Ετερόσημα φορτία",
  what: "Ένα θετικό φορτίο κοντά σε αρνητικό. Έλκονται και η δυναμική ενέργεια είναι αρνητική: για να τα χωρίσουμε ως το άπειρο πρέπει εμείς να προσφέρουμε ενέργεια.",
  given: "Ακλόνητο Q = −20 μC. Φορτίο q = +1 μC σε r = 3 cm. k = 9·10⁹ N·m²/C².",
  ask: "Την ένταση στη θέση του q, τη δυναμική ενέργεια του συστήματος και το έργο της δύναμης του πεδίου ως το άπειρο.",
  period: 11,
  legend: ["F", "U"],
  phases: [
    {
      until: 3.5,
      label: "Έλξη",
      say: "E = k|Q|/r² = 9·10⁹·20·10⁻⁶/9·10⁻⁴ = 2·10⁸ N/C, προς το Q. Το θετικό q έλκεται.",
    },
    {
      until: 7,
      label: "U < 0",
      say: "U = kQq/r = 9·10⁹·(−20·10⁻⁶)·10⁻⁶/0,03 = −6 J. Αρνητική, γιατί τα φορτία είναι ετερόσημα.",
    },
    {
      until: 11,
      label: "Τραβάμε στο άπειρο",
      say: "Το έργο της δύναμης του πεδίου ως το άπειρο είναι W = U_Γ = −6 J. Για να πάει το q εκεί πρέπει εμείς (εξωτερική δύναμη) να δώσουμε τουλάχιστον 6 J. Η U ανεβαίνει από −6 J ως το 0.",
    },
  ],
  Scene: ({ t }) => {
    const r = t < 7 ? 0.03 : lerp(0.03, 0.6, Math.pow(seg(t, 7.2, 10.8), 1.3));
    const U = (k * -20e-6 * 1e-6) / r;
    const qx = 28;
    const y = 96;
    const px = qx + 34 + (r - 0.03) * 230;
    return (
      <g>
        <Charge x={qx} y={y} sign={-1} r={13} label="−Q" labelDy={-20} />
        <Charge x={px} y={y} sign={1} r={6} label="q" labelDy={-12} />
        <Arr x={px - 8} y={y} dx={-Math.max(4, 22 * Math.min(1, 0.03 / r) ** 1)} color={EC.F} label="F" />
        {t >= 7 ? <Arr x={px + 8} y={y} dx={26} color="#7a4fb5" label="F_{εξ}" /> : null}
        <TE x={(qx + px) / 2} y={y + 32} s={`r = ${num(r * 100, 0)} cm`} size={9.5} color={C.muted} bold={false} />
        <PanelE
          lines={
            t < 3.5
              ? ["Στη θέση Γ", "E = 2·10⁸ N/C → προς Q", "F: ελκτική"]
              : t < 7
                ? ["Δυναμική ενέργεια", "U = kQq/r", "U = −6 J (<0)"]
                : ["Προς το άπειρο", `U = ${num(U, 2)} J`, "W_{πεδίου} = −6 J", "W_{εξ} ≥ +6 J"]
          }
        />
        <BarsE y={150} max={6} items={[{ label: "U", value: U, text: `${num(U, 2)} J`, color: EC.U }]} />
        <Tag x={200} y={190} s="U < 0: δεμένα" color={EC.U} show={t >= 3.5 && t < 7} />
      </g>
    );
  },
  solve: (
    <>
      <b>E = 2·10⁸ N/C</b> προς το Q. <b>U = kQq/r = −6 J</b>. <b>W<sub>Γ→∞</sub> = U_Γ = −6 J</b>: πρέπει να προσφερθούν 6 J για τον χωρισμό.
    </>
  ),
  trap: "Στο U = kQq/r τα φορτία μπαίνουν με το πρόσημό τους (σε αντίθεση με το E = k|Q|/r²). Το πρόσημο της U έχει φυσική σημασία.",
};

/* ───────── 13. Έργο και ΔU ───────── */
const case13: ECase = {
  n: 13,
  title: "Έργο και ΔU",
  what: "Ένα φορτίο μεταφέρεται από ένα σημείο σε ένα πιο μακρινό του ίδιου πεδίου. Το έργο της δύναμης του πεδίου ισούται με τη μείωση της δυναμικής ενέργειας και δεν εξαρτάται από τη διαδρομή.",
  given: "Ακλόνητο Q = +20 μC. Φορτίο q = +1 μC μεταφέρεται από το A (r_A = 20 cm) στο B (r_B = 80 cm). k = 9·10⁹ N·m²/C².",
  ask: "Τις δυναμικές ενέργειες U_A, U_B και το έργο W_{A→B} της δύναμης του πεδίου.",
  period: 11,
  legend: ["U"],
  phases: [
    {
      until: 3.5,
      label: "Στο A",
      say: "U_A = kQq/r_A = 9·10⁹·20·10⁻⁶·10⁻⁶/0,2 = 0,9 J.",
    },
    {
      until: 7,
      label: "Στο B",
      say: "U_B = kQq/r_B = 0,18/0,8 = 0,225 J. Η δυναμική ενέργεια μειώθηκε.",
    },
    {
      until: 11,
      label: "W = U_A − U_B",
      say: "W_{A→B} = U_A − U_B = 0,9 − 0,225 = 0,675 J > 0. Από όποια διαδρομή κι αν πάει (ευθεία ή καμπύλη), το έργο είναι το ίδιο: η δύναμη είναι συντηρητική.",
    },
  ],
  Scene: ({ t }) => {
    const qx = 24;
    const y = 104;
    const ra = 0.2;
    const rb = 0.8;
    const sc = 200;
    const curved = t >= 7;
    const s = t < 3.5 ? 0 : t < 7 ? seg(t, 3.7, 6.6) : seg(t, 7.3, 10.6);
    const r = lerp(ra, rb, s);
    const xA = qx + ra * sc;
    const xB = qx + rb * sc;
    const px = lerp(xA, xB, s);
    const py = curved ? y - Math.sin(Math.PI * s) * 50 : y;
    const rr = curved ? Math.hypot(px - qx, py - y) / sc : r;
    const U = (k * 20e-6 * 1e-6) / rr;
    return (
      <g>
        <Charge x={qx} y={y} sign={1} r={12} label="+Q" labelDy={-18} />
        <circle cx={xA} cy={y} r={2.5} fill={C.ink} />
        <circle cx={xB} cy={y} r={2.5} fill={C.ink} />
        <TE x={xA} y={y + 18} s="A" size={10} />
        <TE x={xB} y={y + 18} s="B" size={10} />
        {curved ? <path d={`M ${xA} ${y} Q ${(xA + xB) / 2} ${y - 100} ${xB} ${y}`} fill="none" stroke={EC.v} strokeDasharray="3 3" /> : <line x1={xA} y1={y} x2={xB} y2={y} stroke={EC.v} strokeDasharray="3 3" />}
        <Charge x={px} y={py} sign={1} r={6} />
        <PanelE
          lines={
            t < 3.5
              ? ["Στο A (20 cm)", "U_A = kQq/r_A", "U_A = 0,9 J"]
              : t < 7
                ? ["Στο B (80 cm)", "U_B = 0,225 J", `τώρα: U = ${num(U, 3)} J`]
                : ["Έργο πεδίου", "W = U_A − U_B", "W = 0,675 J", "ίδιο από κάθε δρόμο"]
          }
        />
        <BarsE y={150} max={0.9} items={[{ label: "U", value: U, text: `${num(U, 3)} J`, color: EC.U }]} />
      </g>
    );
  },
  solve: (
    <>
      <b>U_A = 0,9 J</b>, <b>U_B = 0,225 J</b>, <b>W<sub>A→B</sub> = U_A − U_B = 0,675 J</b>, ανεξάρτητα από τη διαδρομή.
    </>
  ),
  trap: "W = −ΔU = U_αρχ − U_τελ. Αν γράψεις U_τελ − U_αρχ, βγάζεις λάθος πρόσημο στο έργο.",
};

/* ───────── 14. Η U γίνεται κινητική ───────── */
const case14: ECase = {
  n: 14,
  title: "U γίνεται κινητική",
  what: "Αφήνουμε ελεύθερο ένα φορτισμένο σωματίδιο κοντά σε ομόσημο ακλόνητο φορτίο. Όσο απομακρύνεται, η δυναμική ενέργεια μετατρέπεται σε κινητική. Το άθροισμά τους μένει σταθερό.",
  given: "Ακλόνητο Q = +20 μC. Σωματίδιο με q = +1 μC και m = 2·10⁻⁵ kg αφήνεται ακίνητο σε r = 20 cm. Μόνο ηλεκτρικές δυνάμεις.",
  ask: "Την ταχύτητα του σωματιδίου όταν περνά από τα 80 cm και την ταχύτητα «στο άπειρο».",
  period: 11,
  legend: ["v", "U"],
  phases: [
    {
      until: 3.5,
      label: "Αρχή",
      say: "Αρχικά K = 0 και U = kQq/r = 0,9 J. Η ολική ενέργεια είναι 0,9 J και θα μείνει σταθερή.",
    },
    {
      until: 7.5,
      label: "Στα 80 cm",
      say: "Στα 80 cm: U = 0,225 J, άρα K = 0,9 − 0,225 = 0,675 J ⇒ υ = √(2K/m) = √(67500) ≈ 260 m/s.",
    },
    {
      until: 11,
      label: "Στο άπειρο",
      say: "Πολύ μακριά U → 0, άρα K_∞ = 0,9 J ⇒ υ_∞ = √(2·0,9/2·10⁻⁵) = √(9·10⁴) = 300 m/s. Πλησιάζει αυτή την τιμή χωρίς να την ξεπεράσει.",
    },
  ],
  Scene: ({ t }) => {
    const r = t < 3.5 ? 0.2 : t < 7.5 ? lerp(0.2, 0.8, seg(t, 3.7, 7.1)) : lerp(0.8, 3, Math.pow(seg(t, 7.7, 10.7), 0.8));
    const U = 0.18 / r;
    const Kk = 0.9 - U;
    const v = Math.sqrt((2 * Math.max(0, Kk)) / 2e-5);
    const qx = 24;
    const y = 100;
    const px = qx + 30 + Math.min(150, (r - 0.2) * 140);
    return (
      <g>
        <Charge x={qx} y={y} sign={1} r={12} label="+Q" labelDy={-18} />
        <Charge x={px} y={y} sign={1} r={6} />
        <Arr x={px + 8} y={y - 12} dx={v / 7} color={EC.v} label="υ" />
        <PanelE lines={[`r = ${num(r * 100, 0)} cm`, `U = ${num(U, 3)} J`, `K = ${num(Math.max(0, Kk), 3)} J`, `υ = ${num(v, 0)} m/s`]} />
        <BarsE
          y={150}
          max={0.9}
          items={[
            { label: "U", value: U, text: `${num(U, 3)} J`, color: EC.U },
            { label: "K", value: Kk, text: `${num(Math.max(0, Kk), 3)} J`, color: EC.v },
            { label: "U+K", value: 0.9, text: "0,9 J", color: C.ink },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      K + U = σταθ. = 0,9 J. Στα 80 cm: K = 0,675 J ⇒ <b>υ ≈ 260 m/s</b>. Στο άπειρο: K = 0,9 J ⇒ <b>υ_∞ = 300 m/s</b>.
    </>
  ),
  trap: "Δεν μπορείς να βρεις την ταχύτητα με εξισώσεις ομαλά επιταχυνόμενης κίνησης: η δύναμη αλλάζει με την απόσταση. Μόνο με ενέργεια.",
};

/* ───────── 15. Άτομο υδρογόνου ───────── */
const case15: ECase = {
  n: 15,
  title: "Άτομο υδρογόνου",
  what: "Το ηλεκτρόνιο γυρίζει γύρω από το πρωτόνιο σε κύκλο. Η ελκτική δύναμη Coulomb παίζει τον ρόλο της κεντρομόλου, όπως στην κυκλική κίνηση.",
  given: "Ακτίνα τροχιάς r = 0,53·10⁻¹⁰ m, e = 1,6·10⁻¹⁹ C, m_e = 9,1·10⁻³¹ kg, k = 9·10⁹ N·m²/C², 1 eV = 1,6·10⁻¹⁹ J.",
  ask: "Την ταχύτητα του ηλεκτρονίου, την κινητική, τη δυναμική και την ολική του ενέργεια.",
  period: 11,
  legend: ["v", "F", "U"],
  phases: [
    {
      until: 3.6,
      label: "Κεντρομόλος",
      say: "F = ke²/r² ≈ 8,2·10⁻⁸ N, προς το πρωτόνιο. Αυτή είναι η κεντρομόλος: ke²/r² = m_e·υ²/r ⇒ υ = e·√(k/(m_e·r)) ≈ 2,2·10⁶ m/s.",
    },
    {
      until: 7.2,
      label: "Ενέργειες",
      say: "K = ½m_{e}υ² = ke²/(2r) ≈ 2,17·10⁻¹⁸ J = 13,6 eV. U = −ke²/r ≈ −4,35·10⁻¹⁸ J = −27,2 eV. Ισχύει K = −U/2.",
    },
    {
      until: 11,
      label: "Ολική",
      say: "E_ολ = K + U = −ke²/(2r) ≈ −13,6 eV. Αρνητική: το ηλεκτρόνιο είναι «δεμένο». Για να φύγει (ιονισμός) χρειάζεται να πάρει 13,6 eV.",
    },
  ],
  Scene: ({ t }) => {
    const cx = 92;
    const cy = 102;
    const R = 62;
    const th = t * 1.6;
    const ex = cx + R * Math.cos(th);
    const ey = cy - R * Math.sin(th);
    const ux = -Math.sin(th);
    const uy = -Math.cos(th);
    return (
      <g>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.faint} strokeDasharray="5 4" />
        <Charge x={cx} y={cy} sign={1} r={10} />
        <TE x={cx} y={cy + 24} s="p⁺" size={10} />
        <Charge x={ex} y={ey} sign={-1} r={5} />
        <Arr x={ex} y={ey} dx={(cx - ex) * 0.4} dy={(cy - ey) * 0.4} color={EC.F} label="F" />
        <Arr x={ex} y={ey} dx={ux * 30} dy={uy * 30} color={EC.v} label="υ" />
        <PanelE
          lines={
            t < 3.6
              ? ["F_{Coulomb} = F_κ", "ke²/r² = m_{e}υ²/r", "υ ≈ 2,2·10⁶ m/s"]
              : t < 7.2
                ? ["Ενέργειες", "K = ke²/(2r) = 13,6 eV", "U = −ke²/r = −27,2 eV"]
                : ["Ολική", "E = K + U", "E = −13,6 eV < 0"]
          }
        />
        <BarsE
          y={150}
          max={27.2}
          items={[
            { label: "K", value: 13.6, text: "+13,6 eV", color: EC.v },
            { label: "U", value: 27.2, text: "−27,2 eV", color: EC.U },
            { label: "E", value: t >= 7.2 ? 13.6 : 0, text: t >= 7.2 ? "−13,6 eV" : "", color: C.ink },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      <b>υ = e√(k/(m_e·r)) ≈ 2,2·10⁶ m/s</b>. <b>K ≈ 13,6 eV</b>, <b>U ≈ −27,2 eV</b>, <b>E_ολ = −ke²/(2r) ≈ −13,6 eV</b>.
    </>
  ),
  trap: "Η ολική ενέργεια βγαίνει αρνητική και αυτό είναι σωστό: σημαίνει δέσμιο σύστημα. Μην «διορθώσεις» το πρόσημο.",
};

export const section3 = [case11, case12, case13, case14, case15];
