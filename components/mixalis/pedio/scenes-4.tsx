"use client";

import { C, Tag, lerp, num, seg } from "@/components/mixalis/ormi/kit";
import { Arr, BarsE, Charge, Dot, EC, PanelE, TE, sci, type ECase } from "./kitE";

const k = 9e9;

/* ───────── 16. Δυναμικό σημείου ───────── */
const case16: ECase = {
  n: 16,
  title: "Δυναμικό σημείου",
  what: "Το δυναμικό είναι ένας αριθμός (με πρόσημο) για κάθε σημείο του πεδίου. Γύρω από αρνητικό φορτίο είναι παντού αρνητικό και πλησιάζει το μηδέν όσο απομακρυνόμαστε.",
  given: "Ακλόνητο Q = −20 μC. Σημείο A σε r = 10 cm. Στο A βάζουμε q = +1 nC. k = 9·10⁹ N·m²/C², V_∞ = 0.",
  ask: "Το δυναμικό V_A, τη δυναμική ενέργεια του q στο A και το έργο της δύναμης του πεδίου από το A στο άπειρο.",
  period: 11,
  legend: ["U"],
  phases: [
    {
      until: 3.6,
      label: "V_A",
      say: "V_A = kQ/r = 9·10⁹·(−20·10⁻⁶)/0,1 = −1,8·10⁶ V. Το Q μπαίνει με το πρόσημό του: αρνητική πηγή ⇒ αρνητικό δυναμικό.",
    },
    {
      until: 7.2,
      label: "U = qV",
      say: "U_A = q·V_A = 10⁻⁹·(−1,8·10⁶) = −1,8·10⁻³ J. Το δυναμικό χαρακτηρίζει το σημείο, η U το συγκεκριμένο φορτίο σε αυτό.",
    },
    {
      until: 11,
      label: "Προς το άπειρο",
      say: "W_{A→∞} = q(V_A − V_∞) = −1,8·10⁻³ J. Αρνητικό: το +q δεν φεύγει μόνο του (έλκεται). Από το άπειρο στο A το έργο είναι +1,8·10⁻³ J.",
    },
  ],
  Scene: ({ t }) => {
    const qx = 60;
    const y = 104;
    const r = t < 7.2 ? 0.1 : lerp(0.1, 0.5, seg(t, 7.4, 10.6));
    const V = (k * -20e-6) / r;
    const px = qx + r * 260;
    return (
      <g>
        {[0.1, 0.2, 0.4].map((rr) => (
          <circle key={rr} cx={qx} cy={y} r={rr * 260} fill="none" stroke={EC.U} strokeDasharray="3 3" opacity={0.6} />
        ))}
        <TE x={qx + 26} y={y - 30} s="−1,8·10⁶ V" size={8.5} color={EC.U} />
        <TE x={qx + 52} y={y - 56} s="−9·10⁵ V" size={8.5} color={EC.U} />
        <Charge x={qx} y={y} sign={-1} r={11} />
        {t >= 3.6 ? <Charge x={px} y={y} sign={1} r={5} /> : <Dot x={px} y={y} r={3} />}
        <TE x={px} y={y + 16} s="A" size={10} />
        <PanelE
          lines={
            t < 3.6
              ? ["Δυναμικό", "V_A = kQ/r", "V_A = −1,8·10⁶ V"]
              : t < 7.2
                ? ["Ενέργεια του q", "U_A = q·V_A", "U_A = −1,8·10⁻³ J"]
                : [`r = ${num(r * 100, 0)} cm`, `V = ${sci(V, 2)} V`, "W_{A→∞} = q(V_A − 0)", "= −1,8·10⁻³ J"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      <b>V_A = kQ/r = −1,8·10⁶ V</b>, <b>U_A = qV_A = −1,8·10⁻³ J</b>, <b>W<sub>A→∞</sub> = −1,8·10⁻³ J</b> (από το άπειρο στο A: +1,8·10⁻³ J).
    </>
  ),
  trap: "Το δυναμικό είναι μονόμετρο: δεν έχει φορά. Το πρόσημο του V δείχνει μόνο αν είναι πάνω ή κάτω από το μηδέν του απείρου.",
};

/* ───────── 17. Διαφορά δυναμικού ───────── */
const case17: ECase = {
  n: 17,
  title: "Διαφορά δυναμικού",
  what: "Ένα αρνητικό φορτίο μεταφέρεται από σημείο κοντά σε θετική πηγή σε σημείο πιο μακριά. Το έργο του πεδίου βγαίνει από τη διαφορά δυναμικού, με το πρόσημο του φορτίου.",
  given: "Ακλόνητο Q = +20 μC. Σημεία A (r_A = 20 cm) και Γ (r_Γ = 80 cm). Φορτίο q = −1 μC μεταφέρεται από το A στο Γ.",
  ask: "Τη διαφορά δυναμικού V_{AΓ} και το έργο της δύναμης του πεδίου W_{A→Γ}.",
  period: 11,
  legend: ["U"],
  phases: [
    {
      until: 3.6,
      label: "Δυναμικά",
      say: "V_A = kQ/r_A = 9·10⁹·20·10⁻⁶/0,2 = 9·10⁵ V. V_Γ = kQ/r_Γ = 2,25·10⁵ V.",
    },
    {
      until: 7.2,
      label: "Διαφορά",
      say: "V_{AΓ} = V_A − V_Γ = 9·10⁵ − 2,25·10⁵ = 6,75·10⁵ V. Η σειρά των δεικτών μετράει: V_{ΓA} = −6,75·10⁵ V.",
    },
    {
      until: 11,
      label: "Έργο",
      say: "W_{A→Γ} = q·V_{AΓ} = (−10⁻⁶)·6,75·10⁵ = −0,675 J. Αρνητικό: το αρνητικό φορτίο έλκεται από το Q, οπότε δεν πάει «μόνο του» προς τα έξω.",
    },
  ],
  Scene: ({ t }) => {
    const qx = 24;
    const y = 104;
    const sc = 200;
    const s = t < 7.2 ? 0 : seg(t, 7.4, 10.6);
    const r = lerp(0.2, 0.8, s);
    const V = (k * 20e-6) / r;
    return (
      <g>
        <Charge x={qx} y={y} sign={1} r={12} label="+Q" labelDy={-18} />
        <Dot x={qx + 0.2 * sc} y={y} />
        <Dot x={qx + 0.8 * sc} y={y} />
        <TE x={qx + 0.2 * sc} y={y + 18} s="A" size={10} />
        <TE x={qx + 0.8 * sc} y={y + 18} s="Γ" size={10} />
        <TE x={qx + 0.2 * sc} y={y - 30} s="9·10⁵ V" size={9} color={EC.U} />
        <TE x={qx + 0.8 * sc} y={y - 30} s="2,25·10⁵ V" size={9} color={EC.U} />
        <Charge x={qx + r * sc} y={y} sign={-1} r={6} />
        {t >= 7.2 ? <Arr x={qx + r * sc - 8} y={y + 16} dx={-22} color={EC.F} label="F" ly={14} /> : null}
        <PanelE
          lines={
            t < 3.6
              ? ["Δυναμικά", "V_A = 9·10⁵ V", "V_Γ = 2,25·10⁵ V"]
              : t < 7.2
                ? ["Διαφορά", "V_{AΓ} = V_A − V_Γ", "V_{AΓ} = 6,75·10⁵ V"]
                : [`V = ${sci(V, 3)} V`, "W = q·V_{AΓ}", "W = (−10⁻⁶)(6,75·10⁵)", "W = −0,675 J"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      <b>V<sub>AΓ</sub> = 6,75·10⁵ V</b>. <b>W<sub>A→Γ</sub> = q·V<sub>AΓ</sub> = −0,675 J</b>.
    </>
  ),
  trap: "Στο W = q·V_{AΓ} το q μπαίνει με το πρόσημό του. Με q = +1 μC το ίδιο έργο θα ήταν +0,675 J.",
};

/* ───────── 18. Δυναμικό δύο φορτίων ───────── */
const case18: ECase = {
  n: 18,
  title: "Δυναμικό δύο φορτίων",
  what: "Δύο θετικά φορτία πάνω σε ευθεία. Βρίσκουμε το σημείο όπου η ένταση μηδενίζεται και δείχνουμε ότι εκεί το δυναμικό ΔΕΝ είναι μηδέν: τα δυναμικά προστίθενται αλγεβρικά.",
  given: "q₁ = +1 μC στο A, q₂ = +4 μC στο B, (AB) = 30 cm. k = 9·10⁹ N·m²/C².",
  ask: "Το σημείο όπου E = 0 και το δυναμικό του πεδίου εκεί.",
  period: 11,
  legend: ["E", "U"],
  phases: [
    {
      until: 3.6,
      label: "E = 0",
      say: "Ομόσημα ⇒ ανάμεσα: k·1/x² = k·4/(0,3 − x)² ⇒ (0,3 − x)/x = 2 ⇒ x = 0,1 m = 10 cm από το A.",
    },
    {
      until: 7.2,
      label: "Δυναμικό εκεί",
      say: "Το δυναμικό είναι αριθμός, οπότε προσθέτουμε: V = kq₁/0,1 + kq₂/0,2 = 9·10⁴ + 1,8·10⁵ = 2,7·10⁵ V.",
    },
    {
      until: 11,
      label: "E = 0 ≠ V = 0",
      say: "Εκεί ένα φορτίο δεν δέχεται δύναμη (E = 0), αλλά έχει δυναμική ενέργεια U = qV ≠ 0. Η ένταση και το δυναμικό είναι διαφορετικά πράγματα.",
    },
  ],
  Scene: ({ t }) => {
    const ax = 30;
    const bx = 180;
    const y = 100;
    const sc = 500; // px per m
    const xm = t < 3.6 ? lerp(0.04, 0.1, seg(t, 0.3, 3.3)) : 0.1;
    const px = ax + xm * sc;
    const E1 = (k * 1e-6) / (xm * xm);
    const E2 = (k * 4e-6) / ((0.3 - xm) * (0.3 - xm));
    const L = (E: number) => Math.max(4, Math.min(50, 8 + 18 * Math.log10(E / 2e5)));
    const zero = Math.abs(E1 - E2) / E2 < 0.03;
    return (
      <g>
        <line x1={ax} y1={y} x2={bx} y2={y} stroke={C.faint} strokeDasharray="3 3" />
        <Charge x={ax} y={y} sign={1} r={8} label="q₁" labelDy={-14} />
        <Charge x={bx} y={y} sign={1} r={13} label="q₂" labelDy={-19} />
        <Dot x={px} y={y} />
        <Arr x={px} y={y - 14} dx={L(E1)} color={EC.E} label="E₁" />
        <Arr x={px} y={y - 32} dx={-L(E2)} color={EC.E} label="E₂" />
        <TE x={(ax + px) / 2} y={y + 18} s={`${num(xm * 100, 0)} cm`} size={9.5} color={C.muted} bold={false} />
        {zero ? <TE x={px} y={y + 34} s="E = 0" size={11} color={EC.E} /> : null}
        {t >= 3.6 ? <TE x={px} y={y + 50} s="V = 2,7·10⁵ V" size={11} color={EC.U} /> : null}
        <PanelE
          lines={
            t < 3.6
              ? ["Πού E = 0;", "1/x² = 4/(0,3 − x)²", "x = 10 cm από το A"]
              : t < 7.2
                ? ["Δυναμικό (άθροισμα)", "V = kq₁/r₁ + kq₂/r₂", "V = 9·10⁴ + 1,8·10⁵", "V = 2,7·10⁵ V"]
                : ["Στο ίδιο σημείο", "E = 0", "V = 2,7·10⁵ V ≠ 0"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      E = 0 στο σημείο <b>10 cm από το A</b> (20 cm από το B). Εκεί <b>V = 9·10⁴ + 1,8·10⁵ = 2,7·10⁵ V</b>.
    </>
  ),
  trap: "Οι εντάσεις προστίθενται σαν διανύσματα (μπορεί να αλληλοαναιρεθούν). Τα δυναμικά προστίθενται σαν αριθμοί με πρόσημο.",
};

/* ───────── 19. Σημεία με V = 0 ───────── */
const case19: ECase = {
  n: 19,
  title: "Σημεία με V = 0",
  what: "Με ένα θετικό και ένα αρνητικό φορτίο υπάρχουν σημεία όπου τα δύο δυναμικά αλληλοαναιρούνται. Στην ευθεία που τα ενώνει βρίσκουμε δύο τέτοια σημεία, και τα δύο πιο κοντά στο μικρό φορτίο.",
  given: "q₁ = +3 μC στο A, q₂ = −12 μC στο B, (AB) = ℓ = 15 m. k = 9·10⁹ N·m²/C².",
  ask: "Τα σημεία της ευθείας AB όπου το δυναμικό είναι μηδέν.",
  period: 11,
  legend: ["U"],
  phases: [
    {
      until: 3.6,
      label: "Ανάμεσα",
      say: "Σημείο Γ ανάμεσα, σε απόσταση x από το A: k·3/x + k·(−12)/(15 − x) = 0 ⇒ 3(15 − x) = 12x ⇒ x = 3 m.",
    },
    {
      until: 7.2,
      label: "Αριστερά του A",
      say: "Σημείο Δ αριστερά του A, σε απόσταση x: 3/x = 12/(15 + x) ⇒ 45 + 3x = 12x ⇒ x = 5 m αριστερά του A.",
    },
    {
      until: 11,
      label: "Δεξιά του B;",
      say: "Δεξιά του B είναι πάντα πιο κοντά στο μεγάλο (αρνητικό) φορτίο, άρα V < 0· η εξίσωση δίνει λύση που απορρίπτεται. Άρα μόνο δύο σημεία: 3 m δεξιά και 5 m αριστερά του A.",
    },
  ],
  Scene: ({ t }) => {
    const sc = 10;
    const ax = 110;
    const bx = ax + 15 * sc;
    const y = 74;
    let xm: number;
    if (t < 3.6) xm = lerp(1, 3, seg(t, 0.3, 3.3));
    else if (t < 7.2) xm = lerp(-1.5, -5, seg(t, 3.6, 6.9));
    else xm = lerp(16, 22, seg(t, 7.4, 10.6));
    const r1 = Math.abs(xm);
    const r2 = Math.abs(15 - xm);
    const V = k * (3e-6 / r1 - 12e-6 / r2);
    const px = ax + xm * sc;
    return (
      <g>
        <line x1={10} y1={y} x2={350} y2={y} stroke={C.faint} strokeDasharray="3 3" />
        <Charge x={ax} y={y} sign={1} r={8} label="+3 μC" labelDy={-14} />
        <Charge x={bx} y={y} sign={-1} r={13} label="−12 μC" labelDy={-19} />
        <circle cx={ax + 3 * sc} cy={y} r={4} fill={EC.U} opacity={t >= 3.4 ? 1 : 0.25} />
        <circle cx={ax - 5 * sc} cy={y} r={4} fill={EC.U} opacity={t >= 7 ? 1 : 0.25} />
        <Dot x={px} y={y} r={3} />
        <TE x={px} y={y + 20} s={`V = ${sci(V, 2)} V`} size={10} color={EC.U} />
        <PanelE
          x={14}
          y={118}
          w={300}
          lines={
            t < 3.6
              ? ["Ανάμεσα στα A και B", "3/x − 12/(15 − x) = 0", "x = 3 m δεξιά του A"]
              : t < 7.2
                ? ["Αριστερά του A", "3/x − 12/(15 + x) = 0", "x = 5 m αριστερά του A"]
                : ["Δεξιά του B", "κοντά στο −12 μC ⇒ V < 0", "καμία λύση εκεί"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      <b>3 m δεξιά του A</b> (ανάμεσα στα φορτία) και <b>5 m αριστερά του A</b>. Δεξιά του B δεν υπάρχει σημείο με V = 0.
    </>
  ),
  trap: "Τα σημεία με V = 0 δεν είναι τα ίδια με τα σημεία όπου E = 0. Για δύο ετερόσημα φορτία η E μηδενίζεται μόνο έξω από αυτά.",
};

/* ───────── 20. V = 0 αλλά E ≠ 0 ───────── */
const case20: ECase = {
  n: 20,
  title: "V = 0 αλλά E ≠ 0",
  what: "Ορθογώνιο τρίγωνο με φορτία στις δύο κορυφές. Στην ορθή γωνία τα δυναμικά αλληλοαναιρούνται, αλλά οι εντάσεις είναι κάθετες και δεν μπορούν να αλληλοαναιρεθούν.",
  given: "Ορθογώνιο τρίγωνο ABΓ (A = 90°), (AB) = 4 m, (AΓ) = 3 m. Q_B = +80 μC, Q_Γ = −60 μC. k = 9·10⁹ N·m²/C².",
  ask: "Το δυναμικό και την ένταση στην κορυφή A.",
  period: 11,
  legend: ["E", "U"],
  phases: [
    {
      until: 3.6,
      label: "Δυναμικό",
      say: "V_A = kQ_B/4 + kQ_Γ/3 = 9·10⁹(20·10⁻⁶ − 20·10⁻⁶) = 0. Ένα φορτίο στο A έχει U = 0.",
    },
    {
      until: 7.2,
      label: "Εντάσεις",
      say: "E_B = 9·10⁹·80·10⁻⁶/16 = 4,5·10⁴ N/C, μακριά από το B. E_Γ = 9·10⁹·60·10⁻⁶/9 = 6·10⁴ N/C, προς το Γ. Είναι κάθετες μεταξύ τους.",
    },
    {
      until: 11,
      label: "Συνισταμένη",
      say: "E_A = √(4,5² + 6²)·10⁴ = 7,5·10⁴ N/C. Το δυναμικό μηδέν, η ένταση όχι: ένα φορτίο στο A θα δεχτεί δύναμη.",
    },
  ],
  Scene: ({ t }) => {
    const ax = 50;
    const ay = 50;
    const s = 30;
    const bx = ax + 4 * s;
    const gy = ay + 3 * s;
    const kk = 0.0006;
    const eB = 4.5e4 * kk;
    const eG = 6e4 * kk;
    return (
      <g>
        <line x1={ax} y1={ay} x2={bx} y2={ay} stroke={C.faint} strokeDasharray="3 3" />
        <line x1={ax} y1={ay} x2={ax} y2={gy} stroke={C.faint} strokeDasharray="3 3" />
        <line x1={bx} y1={ay} x2={ax} y2={gy} stroke={C.faint} strokeDasharray="3 3" />
        <path d={`M ${ax + 10} ${ay} L ${ax + 10} ${ay + 10} L ${ax} ${ay + 10}`} fill="none" stroke={C.muted} />
        <Charge x={bx} y={ay} sign={1} r={12} label="Q_B" labelDy={-18} />
        <Charge x={ax} y={gy} sign={-1} r={11} label="" />
        <TE x={ax + 22} y={gy + 4} s="Q_Γ" size={10.5} italic />
        <Dot x={ax} y={ay} r={3} />
        <TE x={ax + 8} y={ay - 8} s="A" size={11} />
        <TE x={(ax + bx) / 2} y={ay - 8} s="4 m" size={9.5} color={C.muted} bold={false} />
        <TE x={ax - 16} y={(ay + gy) / 2 + 20} s="3 m" size={9.5} color={C.muted} bold={false} />
        {t >= 3.6 ? (
          <g>
            <Arr x={ax} y={ay} dx={-eB} color={EC.E} label="E_B" ly={-10} opacity={t >= 7.2 ? 0.5 : 1} />
            <Arr x={ax} y={ay} dx={0} dy={eG} color={EC.E} label="E_Γ" lx={14} ly={4} opacity={t >= 7.2 ? 0.5 : 1} />
          </g>
        ) : null}
        {t >= 7.2 ? <Arr x={ax} y={ay} dx={-eB} dy={eG} color="#0f6b39" label="E_A" lx={-14} width={3.4} /> : null}
        <PanelE
          lines={
            t < 3.6
              ? ["Δυναμικό στο A", "V = k(80/4 − 60/3)·10⁻⁶", "V_A = 0"]
              : t < 7.2
                ? ["Εντάσεις στο A", "E_B = 4,5·10⁴ N/C", "E_Γ = 6·10⁴ N/C", "κάθετες"]
                : ["Συνισταμένη", "E_A = √(E_B² + E_Γ²)", "E_A = 7,5·10⁴ N/C", "V_A = 0, E_A ≠ 0"]
          }
        />
      </g>
    );
  },
  solve: (
    <>
      <b>V_A = 0</b> (άρα και U = 0 για κάθε φορτίο στο A). <b>E_A = √((4,5·10⁴)² + (6·10⁴)²) = 7,5·10⁴ N/C</b>.
    </>
  ),
  trap: "V = 0 δεν σημαίνει E = 0 (ούτε το αντίστροφο). Το δυναμικό είναι αριθμός, η ένταση διάνυσμα.",
};

export const section4 = [case16, case17, case18, case19, case20];
