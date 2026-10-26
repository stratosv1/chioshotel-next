import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Note } from "@/components/mixalis/omali/shared";

export const metadata: Metadata = {
  title: { absolute: "Βολές · Τυπολόγιο · Physics Workspace" },
  description:
    "Τυπολόγιο πλάγιας και οριζόντιας βολής στα ελληνικά, με σχέδιο τροχιάς και εξήγηση κάθε τύπου για μαθητή Β΄ Λυκείου.",
};

/* ---------- μικρά βοηθητικά για τύπους ---------- */

function Frac({ n, d }: { n: ReactNode; d: ReactNode }) {
  return (
    <span className="mx-0.5 inline-flex flex-col items-center align-middle leading-tight">
      <span className="border-b border-current px-1 pb-0.5">{n}</span>
      <span className="px-1 pt-0.5">{d}</span>
    </span>
  );
}

function Sqrt({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-stretch align-middle">
      <span className="pr-0.5 text-[1.2em] leading-none">√</span>
      <span className="border-t border-current px-1 pt-0.5">{children}</span>
    </span>
  );
}

/** υ με δείκτη, π.χ. <U s="0x" /> → υ₀ₓ */
function U({ s }: { s?: string }) {
  return (
    <>
      υ{s ? <sub>{s}</sub> : null}
    </>
  );
}

function Formula({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "teal" | "amber" | "rose" }) {
  const styles = {
    blue: "border-[#1f6fd1]/25 bg-[#eef4fc]",
    teal: "border-[#1f9d8a]/25 bg-[#ecf7f5]",
    amber: "border-[#c9822f]/30 bg-[#fdf3e6]",
    rose: "border-[#d9342b]/25 bg-[#fdeeec]",
  }[tone];
  return (
    <div className={`flex min-h-[64px] items-center justify-center rounded-xl border px-4 py-3 font-serif text-xl text-[#1c2433] sm:text-2xl ${styles}`}>
      <span>{children}</span>
    </div>
  );
}

function Case({
  n,
  id,
  title,
  formulas,
  children,
  color,
}: {
  n: number | string;
  id: string;
  title: string;
  formulas: ReactNode;
  children: ReactNode;
  color: string;
}) {
  return (
    <section id={id} className="scroll-mt-20 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white" style={{ background: color }}>
          {n}
        </span>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{formulas}</div>
      <div className="mt-5 space-y-3 text-[15px] leading-7 text-[#3d4452] sm:text-base">{children}</div>
    </section>
  );
}

function Example({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-4 text-sm leading-6 text-[#3d4452]">
      <p className="font-semibold text-[#1c2433]">Με αριθμούς (υ₀ = 20 m/s, θ₀ = 30°, g = 10 m/s²)</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

/* ---------- σχέδιο τροχιάς ---------- */

function T({ x, y, children, anchor = "middle", size = 17, color = "#1c2433" }: { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end"; size?: number; color?: string }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={color} fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic">
      {children}
    </text>
  );
}

function Sub({ children }: { children: ReactNode }) {
  return (
    <tspan fontSize="72%" dy="5">
      {children}
    </tspan>
  );
}

function TrajectoryDiagram() {
  const V = "#1f6fd1"; // συνολική ταχύτητα
  const C = "#5b8fc9"; // συνιστώσες
  const G = "#d9342b"; // g
  return (
    <svg viewBox="0 0 760 420" className="mx-auto h-auto w-full max-w-3xl" role="img" aria-label="Τροχιά πλάγιας βολής με τις συνιστώσες της ταχύτητας σε τέσσερα σημεία">
      <defs>
        {[
          ["av", V],
          ["ac", C],
          ["ag", G],
          ["ak", "#1c2433"],
        ].map(([id, c]) => (
          <marker key={id} id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={c} />
          </marker>
        ))}
      </defs>

      {/* έδαφος και άξονες */}
      <rect x="30" y="340" width="700" height="10" fill="#f4e3c4" />
      <line x1="30" y1="340" x2="735" y2="340" stroke="#1c2433" strokeWidth="2" markerEnd="url(#ak)" />
      <line x1="60" y1="350" x2="60" y2="30" stroke="#1c2433" strokeWidth="2" markerEnd="url(#ak)" />
      <T x={745} y={346}>x</T>
      <T x={72} y={36}>y</T>

      {/* τροχιά */}
      <path d="M60,340 Q370,-160 680,340" fill="none" stroke="#1c2433" strokeWidth="2" strokeDasharray="7 6" />

      {/* αρχικό σημείο */}
      <path d="M60,340 L100,340 A40,40 0 0 0 81.2,306.1 Z" fill="#bfe6e0" fillOpacity="0.8" stroke="#1f9d8a" />
      <line x1="60" y1="340" x2="118" y2="247" stroke={V} strokeWidth="3" markerEnd="url(#av)" />
      <line x1="60" y1="340" x2="118" y2="340" stroke={C} strokeWidth="3" markerEnd="url(#ac)" />
      <line x1="60" y1="340" x2="60" y2="247" stroke={C} strokeWidth="3" markerEnd="url(#ac)" />
      <T x={106} y={242} color={V}>υ<Sub>0</Sub></T>
      <T x={110} y={326} size={15}>θ<Sub>0</Sub></T>
      <T x={92} y={366} color={C} size={15}>υ<Sub>0x</Sub></T>
      <T x={38} y={262} color={C} size={15}>υ<Sub>0y</Sub></T>

      {/* ανεβαίνει */}
      <line x1="180" y1="184" x2="237" y2="128" stroke={V} strokeWidth="3" markerEnd="url(#av)" />
      <line x1="180" y1="184" x2="237" y2="184" stroke={C} strokeWidth="2.5" markerEnd="url(#ac)" />
      <line x1="180" y1="184" x2="180" y2="128" stroke={C} strokeWidth="2.5" markerEnd="url(#ac)" />
      <T x={248} y={126} color={V}>υ</T>
      <T x={228} y={205} color={C} size={15}>υ<Sub>x</Sub></T>
      <T x={160} y={136} color={C} size={15}>υ<Sub>y</Sub></T>

      {/* κορυφή */}
      <line x1="370" y1="90" x2="440" y2="90" stroke={V} strokeWidth="3" markerEnd="url(#av)" />
      <T x={455} y={86} color={V} size={15} anchor="start">υ = υ<Sub>x</Sub></T>
      <T x={370} y={70} size={15}>υ<Sub>y</Sub> = 0</T>
      <line x1="370" y1="96" x2="370" y2="336" stroke="#1c2433" strokeDasharray="4 5" markerEnd="url(#ak)" />
      <T x={385} y={225} anchor="start">H</T>

      {/* κατεβαίνει */}
      <line x1="560" y1="184" x2="617" y2="240" stroke={V} strokeWidth="3" markerEnd="url(#av)" />
      <line x1="560" y1="184" x2="617" y2="184" stroke={C} strokeWidth="2.5" markerEnd="url(#ac)" />
      <line x1="560" y1="184" x2="560" y2="240" stroke={C} strokeWidth="2.5" markerEnd="url(#ac)" />
      <T x={628} y={254} color={V}>υ</T>
      <T x={612} y={172} color={C} size={15}>υ<Sub>x</Sub></T>
      <T x={540} y={240} color={C} size={15}>υ<Sub>y</Sub></T>

      {[[60, 340], [180, 184], [370, 90], [560, 184], [680, 340]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="7" fill="#f2b33d" stroke="#8a5a12" strokeWidth="1.5" />
      ))}

      {/* g */}
      <line x1="715" y1="50" x2="715" y2="125" stroke={G} strokeWidth="3" markerEnd="url(#ag)" />
      <T x={735} y={95} color={G}>g</T>

      {/* βεληνεκές */}
      <line x1="60" y1="380" x2="680" y2="380" stroke="#1c2433" strokeDasharray="5 5" markerStart="url(#ak)" markerEnd="url(#ak)" />
      <rect x="350" y="368" width="40" height="24" fill="white" />
      <T x={370} y={386}>R</T>
    </svg>
  );
}

const nav = [
  ["idea", "Η ιδέα"],
  ["k1", "1. Αρχική ταχύτητα"],
  ["k2", "2. Ταχύτητα"],
  ["k3", "3. Μέτρο & γωνία"],
  ["k4", "4. Θέση"],
  ["k5", "5. Τροχιά"],
  ["k6", "6. Μέγιστο ύψος"],
  ["k7", "7. Βεληνεκές"],
  ["k8", "8. Οριζόντια βολή"],
  ["pagides", "Παγίδες"],
];

export default function VoliPage() {
  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/mixalis" prefetch={false} className="text-sm font-semibold text-[#857261] hover:text-[#5f5045]">
              ← Physics Workspace
            </Link>
            <Link href="/mixalis/omali2" prefetch={false} className="text-sm font-semibold text-[#857261] hover:text-[#5f5045]">
              Τυπολόγιο κυκλικής κίνησης →
            </Link>
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Φυσική Προσανατολισμού Β΄ Λυκείου</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Βολές: τυπολόγιο</h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#5c534c] sm:text-base">
            Όλη η πλάγια βολή σε μία σελίδα: το σχέδιο της τροχιάς και οι 6 ομάδες τύπων, και για τον καθένα <b>τι σημαίνει</b>, <b>από πού
            βγαίνει</b> και <b>ένα παράδειγμα με αριθμούς</b>. Στο τέλος θα βρεις το βεληνεκές και την <b>οριζόντια βολή</b>, που είναι ειδική
            περίπτωση της πλάγιας (θ₀ = 0).
          </p>
        </header>

        <nav className="sticky top-2 z-10 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-sm backdrop-blur" aria-label="Ενότητες">
          <div className="flex gap-1.5 overflow-x-auto text-sm font-semibold">
            {nav.map(([id, name]) => (
              <a key={id} href={`#${id}`} className="shrink-0 rounded-full px-3 py-1.5 text-[#4d4138] hover:bg-[#f3efe8]">
                {name}
              </a>
            ))}
          </div>
        </nav>

        <section id="idea" className="scroll-mt-20 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Τροχιά και βασικοί τύποι</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Η μεγάλη ιδέα: δύο κινήσεις μαζί</h2>
          <div className="mt-5 rounded-2xl border border-black/10 bg-[#fbfaf7] p-3 sm:p-5">
            <TrajectoryDiagram />
          </div>
          <div className="mt-5 space-y-3 text-[15px] leading-7 text-[#3d4452] sm:text-base">
            <p>
              Ρίχνουμε ένα σώμα με ταχύτητα <b>υ₀</b> υπό γωνία <b>θ₀</b> με το οριζόντιο έδαφος. Μόλις φύγει από το χέρι, η μόνη δύναμη που
              δέχεται είναι το <b>βάρος</b> (αγνοούμε τον αέρα). Το βάρος είναι κατακόρυφο, άρα:
            </p>
            <ul className="space-y-2 pl-1">
              <li>
                • <b>Οριζόντια (άξονας x):</b> καμία δύναμη ⇒ καμία επιτάχυνση ⇒ <b>ευθύγραμμη ομαλή κίνηση</b>. Η υ<sub>x</sub> δεν αλλάζει ποτέ.
              </li>
              <li>
                • <b>Κατακόρυφα (άξονας y):</b> μόνο το βάρος ⇒ επιτάχυνση <b>g</b> προς τα κάτω ⇒ <b>ομαλά μεταβαλλόμενη κίνηση</b>, ακριβώς
                σαν την κατακόρυφη βολή προς τα πάνω.
              </li>
            </ul>
            <p>
              Οι δύο κινήσεις γίνονται <b>ταυτόχρονα και ανεξάρτητα</b> (αρχή ανεξαρτησίας των κινήσεων). Το μόνο κοινό τους είναι ο
              <b> χρόνος t</b>. Αυτό είναι όλο το κόλπο: λύνεις χωριστά τον x και τον y, και τα «δένεις» με το t.
            </p>
          </div>
          <div className="mt-5">
            <Note tone="info" title="Συμφωνία για όλους τους τύπους">
              Αρχή των αξόνων στο σημείο βολής, x οριζόντια, y κατακόρυφα με <b>θετικά προς τα πάνω</b>. Γι&apos; αυτό η g μπαίνει με «−». Η
              ταχύτητα γράφεται <b>υ</b> (όπως στο σχολικό βιβλίο).
            </Note>
          </div>
        </section>

        <Case
          n={1}
          id="k1"
          color="#1f8a70"
          title="Συνιστώσες της αρχικής ταχύτητας"
          formulas={
            <>
              <Formula tone="teal">
                <U s="0x" /> = <U s="0" />·συνθ<sub>0</sub>
              </Formula>
              <Formula tone="amber">
                <U s="0y" /> = <U s="0" />·ημθ<sub>0</sub>
              </Formula>
            </>
          }
        >
          <p>
            Χωρίζουμε την υ₀ σε δύο κομμάτια: ένα <b>οριζόντιο</b> (πόσο γρήγορα «προχωράει») και ένα <b>κατακόρυφο</b> (πόσο γρήγορα «ανεβαίνει»).
            Είναι η γνωστή ανάλυση διανύσματος σε ορθογώνιο τρίγωνο: η υ₀ είναι η υποτείνουσα.
          </p>
          <p>
            Κανόνας για να μην τα μπερδεύεις: <b>η πλευρά που ακουμπά τη γωνία θ₀ παίρνει συνημίτονο</b>, η απέναντι παίρνει ημίτονο. Η θ₀
            μετριέται από το οριζόντιο έδαφος, άρα η οριζόντια συνιστώσα παίρνει το συν.
          </p>
          <Example>
            υ₀x = 20·συν30° = 20·0,866 ≈ <b>17,3 m/s</b> · υ₀y = 20·ημ30° = 20·0,5 = <b>10 m/s</b>.
          </Example>
        </Case>

        <Case
          n={2}
          id="k2"
          color="#1f6fd1"
          title="Συνιστώσες της ταχύτητας τη στιγμή t"
          formulas={
            <>
              <Formula tone="blue">
                <U s="x" /> = <U s="0" />·συνθ<sub>0</sub>
              </Formula>
              <Formula tone="rose">
                <U s="y" /> = <U s="0" />·ημθ<sub>0</sub> − g·t
              </Formula>
            </>
          }
        >
          <p>
            <b>Οριζόντια:</b> η υ<sub>x</sub> μένει <b>ίδια σε όλη τη διαδρομή</b>, γιατί δεν υπάρχει οριζόντια δύναμη. Στο σχέδιο, όλα τα
            οριζόντια βελάκια έχουν το ίδιο μήκος.
          </p>
          <p>
            <b>Κατακόρυφα:</b> είναι ο τύπος υ = υ₀ − g·t της κατακόρυφης βολής. Κάθε δευτερόλεπτο η υ<sub>y</sub> χάνει 10 m/s. Όσο είναι
            <b> θετική</b> το σώμα ανεβαίνει, γίνεται <b>μηδέν</b> στην κορυφή, και μετά γίνεται <b>αρνητική</b>: το σώμα κατεβαίνει.
          </p>
          <Example>
            Τη στιγμή t = 0,5 s: υx = 17,3 m/s (ίδια με πριν) και υy = 10 − 10·0,5 = <b>5 m/s</b> (ακόμη ανεβαίνει). Τη στιγμή t = 1,5 s: υy =
            10 − 15 = <b>−5 m/s</b> (κατεβαίνει).
          </Example>
        </Case>

        <Case
          n={3}
          id="k3"
          color="#d39a1c"
          title="Μέτρο και κατεύθυνση της ταχύτητας"
          formulas={
            <>
              <Formula tone="amber">
                υ = <Sqrt>
                  <U s="x" />² + <U s="y" />²
                </Sqrt>
              </Formula>
              <Formula tone="amber">
                εφθ = <Frac n={<U s="y" />} d={<U s="x" />} />
              </Formula>
            </>
          }
        >
          <p>
            Οι δύο συνιστώσες είναι κάθετες, άρα το μέτρο της πραγματικής ταχύτητας βγαίνει με <b>Πυθαγόρειο θεώρημα</b>. Η γωνία θ είναι η
            γωνία της ταχύτητας με το οριζόντιο: δείχνει <b>πού «κοιτάει» το σώμα</b> εκείνη τη στιγμή.
          </p>
          <p>
            Η ταχύτητα είναι πάντα <b>εφαπτόμενη στην τροχιά</b>. Όταν η υ<sub>y</sub> είναι αρνητική, η εφθ βγαίνει αρνητική: η ταχύτητα δείχνει
            κάτω από το οριζόντιο. Στην κορυφή υ<sub>y</sub> = 0, άρα υ = υ<sub>x</sub>: εκεί η ταχύτητα έχει το <b>μικρότερο μέτρο</b>, αλλά
            <b> δεν είναι μηδέν</b>.
          </p>
          <Example>
            Στα t = 0,5 s: υ = √(17,3² + 5²) = √(300 + 25) ≈ <b>18 m/s</b> και εφθ = 5/17,3 ≈ 0,29 ⇒ θ ≈ <b>16°</b> πάνω από το οριζόντιο.
          </Example>
        </Case>

        <Case
          n={4}
          id="k4"
          color="#2563b8"
          title="Θέση του σώματος τη στιγμή t"
          formulas={
            <>
              <Formula tone="blue">x = <U s="0" />·συνθ<sub>0</sub>·t</Formula>
              <Formula tone="blue">
                y = <U s="0" />·ημθ<sub>0</sub>·t − <Frac n="1" d="2" />g·t²
              </Formula>
            </>
          }
        >
          <p>
            <b>x:</b> ευθύγραμμη ομαλή, άρα «απόσταση = ταχύτητα × χρόνος». <b>y:</b> ο τύπος y = υ₀t − ½gt² της κατακόρυφης βολής, με
            αρχική ταχύτητα την υ₀y.
          </p>
          <p>
            Το ζευγάρι (x, y) σου λέει <b>πού ακριβώς βρίσκεται</b> το σώμα. Αν η άσκηση ρωτάει «πότε φτάνει στον τοίχο που απέχει d;», βάζεις
            x = d, βρίσκεις το t, και μετά βάζεις αυτό το t στο y για να δεις σε ποιο ύψος χτυπάει.
          </p>
          <Example>
            Στα t = 0,5 s: x = 17,3·0,5 ≈ <b>8,7 m</b> και y = 10·0,5 − ½·10·0,25 = 5 − 1,25 = <b>3,75 m</b>.
          </Example>
        </Case>

        <Case
          n={5}
          id="k5"
          color="#d9342b"
          title="Εξίσωση της τροχιάς"
          formulas={
            <div className="sm:col-span-2">
              <Formula tone="rose">
                y = x·εφθ<sub>0</sub> − <Frac n={<>g·x²</>} d={<>2·<U s="0" />²·συν²θ<sub>0</sub></>} />
              </Formula>
            </div>
          }
        >
          <p>
            Αυτή η εξίσωση <b>δεν έχει χρόνο</b>: συνδέει κατευθείαν το ύψος y με την οριζόντια απόσταση x. Είναι το «σχήμα» του δρόμου που
            ακολουθεί το σώμα, και είναι <b>παραβολή</b> (μορφή y = αx + βx² με β αρνητικό, γι&apos; αυτό «κοιτάει» προς τα κάτω).
          </p>
          <p>
            <b>Από πού βγαίνει:</b> από τον τύπο του x λύνω ως προς t: t = x / (υ₀συνθ₀). Το βάζω στον τύπο του y. Ο πρώτος όρος γίνεται
            x·ημθ₀/συνθ₀ = x·εφθ₀ και ο δεύτερος ½g·x²/(υ₀²συν²θ₀). Δεν χρειάζεται να τον αποστηθίσεις αν ξέρεις να κάνεις αυτή την αντικατάσταση.
          </p>
          <Example>
            Για x = 8,7 m: y = 8,7·0,577 − 10·75 / (2·400·0,75) ≈ 5 − 1,25 = <b>3,75 m</b>. Ίδιο με το βήμα 4, όπως πρέπει.
          </Example>
        </Case>

        <Case
          n={6}
          id="k6"
          color="#1f8a70"
          title="Μέγιστο ύψος και χρόνος ανόδου"
          formulas={
            <>
              <Formula tone="teal">
                H = <Frac n={<><U s="0" />²·ημ²θ<sub>0</sub></>} d="2g" />
              </Formula>
              <Formula tone="teal">
                t<sub>α</sub> = <Frac n={<><U s="0" />·ημθ<sub>0</sub></>} d="g" />
              </Formula>
            </>
          }
        >
          <p>
            <b>Χρόνος ανόδου t<sub>α</sub>:</b> στην κορυφή το σώμα σταματά να ανεβαίνει, δηλαδή <b>υ<sub>y</sub> = 0</b>. Βάζω 0 στον τύπο
            του βήματος 2: 0 = υ₀ημθ₀ − g·t<sub>α</sub> ⇒ t<sub>α</sub> = υ₀ημθ₀/g.
          </p>
          <p>
            <b>Μέγιστο ύψος H:</b> βάζω τον t<sub>α</sub> στον τύπο του y (βήμα 4) και κάνω πράξεις. Πιο γρήγορα: με τον τύπο υ² = υ₀² − 2gh
            της κατακόρυφης κίνησης, με υ<sub>y</sub> = 0 στην κορυφή: 0 = (υ₀ημθ₀)² − 2gH.
          </p>
          <Example>
            t<sub>α</sub> = 20·0,5/10 = <b>1 s</b> · H = 400·0,25 / 20 = <b>5 m</b>.
          </Example>
        </Case>

        <Case
          n={7}
          id="k7"
          color="#6a4c93"
          title="Χρόνος πτήσης και βεληνεκές (επιπλέον)"
          formulas={
            <>
              <Formula tone="blue">
                t<sub>ολ</sub> = 2·t<sub>α</sub> = <Frac n={<>2·<U s="0" />·ημθ<sub>0</sub></>} d="g" />
              </Formula>
              <Formula tone="blue">
                R = <Frac n={<><U s="0" />²·ημ2θ<sub>0</sub></>} d="g" />
              </Formula>
            </>
          }
        >
          <p>
            Δεν είναι στην εικόνα, αλλά τα ζητούν συχνά. Αν το σώμα <b>πέφτει στο ίδιο ύψος</b> απ&apos; όπου ξεκίνησε, η κίνηση είναι συμμετρική:
            κάνει τον ίδιο χρόνο να ανέβει και να κατέβει, άρα t<sub>ολ</sub> = 2t<sub>α</sub>. Τότε το <b>βεληνεκές</b> R (πόσο μακριά πέφτει)
            είναι R = υ₀x·t<sub>ολ</sub>, που με τον τύπο 2ημθσυνθ = ημ2θ γίνεται ο τύπος δεξιά.
          </p>
          <p>
            Δύο ωραία συμπεράσματα: το R γίνεται <b>μέγιστο για θ₀ = 45°</b> (ημ90° = 1), και δύο γωνίες που κάνουν άθροισμα 90° (π.χ. 30° και
            60°) δίνουν <b>το ίδιο βεληνεκές</b>.
          </p>
          <Example>
            t<sub>ολ</sub> = <b>2 s</b> · R = 400·ημ60° / 10 = 40·0,866 ≈ <b>34,6 m</b> (ή απλά R = 17,3·2).
          </Example>
          <Note tone="warn" title="Προσοχή">
            Οι δύο αυτοί τύποι ισχύουν <b>μόνο</b> όταν το σημείο πτώσης είναι στο ίδιο ύψος με το σημείο βολής. Αν ρίχνεις από ταράτσα ή
            γκρεμό, βάζεις στον τύπο του y το κατάλληλο ύψος (π.χ. y = −h) και λύνεις ως προς t.
          </Note>
        </Case>

        <Case
          n={8}
          id="k8"
          color="#c9822f"
          title="Οριζόντια βολή: η περίπτωση θ₀ = 0"
          formulas={
            <>
              <Formula tone="amber">
                x = <U s="0" />·t , &nbsp;<U s="x" /> = <U s="0" />
              </Formula>
              <Formula tone="amber">
                y = <Frac n="1" d="2" />g·t² , &nbsp;<U s="y" /> = g·t
              </Formula>
              <Formula tone="amber">
                t<sub>πτ</sub> = <Sqrt><Frac n="2h" d="g" /></Sqrt>
              </Formula>
              <Formula tone="amber">
                s = <U s="0" />·<Sqrt><Frac n="2h" d="g" /></Sqrt>
              </Formula>
            </>
          }
        >
          <p>
            Αυτή είναι η βολή του σχολικού βιβλίου: ρίχνεις το σώμα <b>οριζόντια</b> από ύψος h. Βάζεις θ₀ = 0 στους παραπάνω τύπους (συν0 = 1,
            ημ0 = 0) και όλα απλοποιούνται. Εδώ συνήθως παίρνουμε τον y με <b>θετικά προς τα κάτω</b>, γι&apos; αυτό οι τύποι δεν έχουν «−».
          </p>
          <p>
            Ο χρόνος πτώσης βγαίνει από το y = h: h = ½gt² ⇒ t = √(2h/g). Το εντυπωσιακό: <b>δεν εξαρτάται από την υ₀</b>. Μια μπάλα που την
            πετάς οριζόντια και μια που την αφήνεις απλώς να πέσει από το ίδιο ύψος, φτάνουν στο έδαφος <b>την ίδια στιγμή</b>.
          </p>
          <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-4 text-sm leading-6 text-[#3d4452]">
            <p className="font-semibold text-[#1c2433]">Με αριθμούς (h = 20 m, υ₀ = 15 m/s, g = 10 m/s²)</p>
            <p className="mt-1">
              t<sub>πτ</sub> = √(40/10) = <b>2 s</b> · s = 15·2 = <b>30 m</b> · τη στιγμή που χτυπά: υy = 10·2 = 20 m/s, υ = √(225 + 400) =
              <b> 25 m/s</b>.
            </p>
          </div>
        </Case>

        <section id="pagides" className="scroll-mt-20 space-y-4 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Οδηγός</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Οι πιο συχνές παγίδες</h2>
          <Note tone="warn" title="Μην πέσεις σε αυτά">
            <ul className="mt-1 space-y-1">
              <li>• «Στην κορυφή η ταχύτητα είναι μηδέν». Λάθος: μηδέν είναι μόνο η υ<sub>y</sub>. Η υ<sub>x</sub> υπάρχει πάντα.</li>
              <li>• «Στην κορυφή η επιτάχυνση είναι μηδέν». Λάθος: η επιτάχυνση είναι <b>g</b> σε κάθε σημείο της τροχιάς, και στην κορυφή.</li>
              <li>• Βάζεις συν στην υ₀y και ημ στην υ₀x. Κοίτα από πού μετριέται η γωνία: αν η άσκηση τη δίνει από την κατακόρυφο, αλλάζουν.</li>
              <li>• Χρησιμοποιείς R = υ₀²ημ2θ₀/g ενώ το σώμα πέφτει σε άλλο ύψος (από ταράτσα, σε τοίχο, σε σκαλί).</li>
              <li>• Ξεχνάς το πρόσημο: με θετικά προς τα πάνω, ένα σημείο κάτω από το σημείο βολής έχει <b>y αρνητικό</b>.</li>
            </ul>
          </Note>
          <Note tone="ok" title="Η συνταγή για κάθε άσκηση">
            1) Σχέδιο και άξονες. 2) Ανάλυσε την υ₀ σε υ₀x και υ₀y. 3) Γράψε χωριστά τις εξισώσεις του x και του y. 4) Βρες τον <b>χρόνο</b> από
            αυτό που ξέρεις (υy = 0 στην κορυφή, y = 0 ή y = −h στην πτώση, x = d στον τοίχο). 5) Βάλε τον χρόνο στις υπόλοιπες εξισώσεις.
          </Note>
          <p className="text-sm leading-6 text-[#857261]">Ιδανικό μοντέλο: χωρίς αντίσταση αέρα, g = 10 m/s². Η γωνία θ μετριέται από το οριζόντιο.</p>
        </section>
      </div>
    </main>
  );
}
