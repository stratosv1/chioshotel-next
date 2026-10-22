import type { Metadata } from "next";
import Link from "next/link";
import { Note } from "@/components/mixalis/omali/shared";
import { PedioAnimationsClient } from "@/components/mixalis/pedio/PedioAnimationsClient";
import { PedioIntroEmbed } from "@/components/mixalis/pedio/PedioIntroEmbed";

export const metadata: Metadata = {
  title: { absolute: "Ηλεκτρικό πεδίο · Τυπολόγιο · Physics Workspace" },
  description:
    "30 περιπτώσεις ηλεκτρικού πεδίου (ένταση, ομογενές πεδίο, δυναμική ενέργεια, δυναμικό, πυκνωτής) από το σχολικό βιβλίο και τον Σαββάλα, με κινούμενο σχέδιο για κάθε περίπτωση.",
};

const POSTER_W = 1212;
const POSTER_H = 1720;

const sectionNames = ["Ένταση", "Ομογενές πεδίο", "Δυναμική ενέργεια", "Δυναμικό", "Τάση & ένταση", "Πυκνωτής"];

const groups: { range: string; title: string; text: string }[] = [
  {
    range: "1–5",
    title: "Ένταση ηλεκτρικού πεδίου",
    text: "Βάλε νοερά ένα +q στο σημείο: η δύναμη πάνω του δείχνει τη φορά της E. Μέτρα με E = k|Q|/r² (χωρίς πρόσημα). Για δύο φορτία: πρόσθεση διανυσμάτων. E = 0: ομόσημα ανάμεσα, ετερόσημα έξω, κοντά στο μικρό.",
  },
  {
    range: "6–10",
    title: "Ομογενές πεδίο",
    text: "F = qE σταθερή παντού ⇒ α = qE/m σταθερή. Ισορροπία: qE = mg. Εκκρεμές: εφφ = qE/(mg). Κινήσεις: οι εξισώσεις της ευθύγραμμης ομαλά μεταβαλλόμενης.",
  },
  {
    range: "11–15",
    title: "Δυναμική ενέργεια",
    text: "U = kQq/r με πρόσημα. Ομόσημα U > 0, ετερόσημα U < 0. W(A→B) = U(A) − U(B). Κίνηση με μεταβλητή δύναμη ⇒ μόνο με ενέργεια: K + U = σταθ.",
  },
  {
    range: "16–20",
    title: "Δυναμικό",
    text: "V = kQ/r (με πρόσημο), U = qV, W(A→B) = q·(V(A) − V(B)). Δυναμικά προστίθενται αλγεβρικά. E = 0 και V = 0 είναι διαφορετικές συνθήκες.",
  },
  {
    range: "21–25",
    title: "Τάση και ένταση στο ομογενές",
    text: "E = V/ℓ (ℓ σε m). Το δυναμικό πέφτει γραμμικά κατά τη φορά της E. W = qV = qEℓ. Επιτάχυνση από ηρεμία με τάση V: K = |q|V (για ηλεκτρόνιο: V volt ⇒ V eV).",
  },
  {
    range: "26–30",
    title: "Πυκνωτής",
    text: "C = Q/V = εε₀S/ℓ, U = ½QV = ½CV² = Q²/(2C). Πρώτη ερώτηση πάντα: συνδεδεμένος (V σταθ.) ή αποσυνδεδεμένος (Q σταθ.);",
  },
];

/** Clickable areas over the poster cells (same grid as the poster SVG). */
const cells = Array.from({ length: 30 }, (_, i) => {
  const section = Math.floor(i / 5);
  const col = i % 5;
  return { n: i + 1, x: 17 + 238 * col, y: 146 + 256 * section, w: 226, h: 212 };
});

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;

export default function PedioPage() {
  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/mixalis" prefetch={false} className="text-sm font-semibold text-[#857261] hover:text-[#5f5045]">
              ← Physics Workspace
            </Link>
            <Link href="/mixalis/courses/general_education" prefetch={false} className="text-sm font-semibold text-[#857261] hover:text-[#5f5045]">
              Φυσική Γενικής Παιδείας →
            </Link>
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Φυσική Γενικής Παιδείας Β΄ Λυκείου</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Ηλεκτρικό πεδίο: τυπολόγιο</h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#5c534c] sm:text-base">
            30 περιπτώσεις σε ένα σχέδιο, από τα κεφάλαια 3–8 του Σαββάλα και τις ενότητες 1.2–1.5 του σχολικού βιβλίου: ένταση, ομογενές πεδίο,
            δυναμική ενέργεια, δυναμικό, τάση και πυκνωτής. Οι αριθμοί των κινούμενων σχεδίων είναι από τις λυμένες ασκήσεις του Σαββάλα.{" "}
            <b>Πάτα ένα κουτάκι</b> και θα σε πάει στο κινούμενο σχέδιό του, όπου το φαινόμενο εξηγείται βήμα βήμα.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
            <a href="/mixalis/pedio-typologio.svg" target="_blank" rel="noopener" className="rounded-full border border-black/10 bg-white px-4 py-1.5 hover:bg-[#f3efe8]">
              Poster σε πλήρες μέγεθος
            </a>
            <a href="/mixalis/pedio-typologio-A4.pdf" target="_blank" rel="noopener" className="rounded-full bg-[#2c2825] px-4 py-1.5 text-white hover:bg-black">
              Εκτύπωση σε A4 (PDF, 1 σελίδα)
            </a>
          </div>
        </header>

        <section id="eisagogi" className="scroll-mt-20 rounded-3xl border border-black/10 bg-white p-3 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3 px-2 pb-3 pt-1 sm:px-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Ξεκίνα από εδώ</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Πρώτη γνωριμία με το ηλεκτρικό πεδίο</h2>
              <p className="mt-1 max-w-3xl text-[15px] leading-7 text-[#5c534c]">
                14 σύντομες διαφάνειες με κινούμενα σχέδια: τι είναι το πεδίο, η ένταση, οι δυναμικές γραμμές, το δυναμικό και ο πυκνωτής. Μετά πέρασε στο τυπολόγιο.
              </p>
            </div>
            <a href="/mixalis/pedio-intro.html" target="_blank" rel="noopener" className="shrink-0 rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-semibold hover:bg-[#f3efe8]">
              Σε πλήρη οθόνη ↗
            </a>
          </div>
          <PedioIntroEmbed />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-3 shadow-sm sm:p-5">
          <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#fbfaf7]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mixalis/pedio-typologio.svg"
              alt="Τυπολόγιο ηλεκτρικού πεδίου: 30 περιπτώσεις με σχήματα και τύπους"
              width={POSTER_W}
              height={POSTER_H}
              decoding="async"
              className="mx-auto h-auto w-full"
            />
            {cells.map((c) => (
              <a
                key={c.n}
                href={`#k${c.n}`}
                aria-label={`Κινούμενο σχέδιο για το κουτάκι ${c.n}`}
                className="absolute rounded-lg outline-none ring-[#c9822f] transition hover:bg-[#c9822f]/10 hover:ring-2 focus-visible:ring-2"
                style={{ left: pct(c.x, POSTER_W), top: pct(c.y, POSTER_H), width: pct(c.w, POSTER_W), height: pct(c.h, POSTER_H) }}
              />
            ))}
          </div>
        </section>

        <nav className="sticky top-2 z-10 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-sm backdrop-blur" aria-label="Ενότητες">
          <div className="flex gap-1.5 overflow-x-auto text-sm font-semibold">
            {sectionNames.map((name, i) => (
              <a key={name} href={`#enotita-${i + 1}`} className="shrink-0 rounded-full px-3 py-1.5 text-[#4d4138] hover:bg-[#f3efe8]">
                {i + 1}. {name}
              </a>
            ))}
          </div>
        </nav>

        <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Κινούμενα σχέδια</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Πώς διαβάζεις τα σχέδια</h2>
          <ol className="mt-4 max-w-3xl list-decimal space-y-2 pl-5 text-[15px] leading-7 text-[#3d4452]">
            <li>
              Διάβασε το <b>«Τι βλέπεις»</b> και τα <b>Δεδομένα</b>: είναι σαν την εκφώνηση μιας άσκησης.
            </li>
            <li>
              Το σχέδιο παίζει <b>ένα βήμα τη φορά</b> και σταματά. Διάβασε την εξήγηση κάτω από την εικόνα και πάτα <b>«Επόμενο βήμα»</b>. Αν θες
              να το δεις ξανά, πάτα πάνω στο όνομα του βήματος.
            </li>
            <li>
              Πριν ανοίξεις τη λύση, προσπάθησε να τη γράψεις μόνος σου. Μετά πάτα <b>«Δείξε τη λύση»</b> και σύγκρινε.
            </li>
          </ol>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-4 text-sm leading-6 text-[#3d4452]">
              <p className="font-semibold text-[#1c2433]">Τα χρώματα</p>
              <p className="mt-1">
                <span className="font-semibold text-[#1f9d55]">Πράσινο</span> = ένταση E και δυναμικές γραμμές ·{" "}
                <span className="font-semibold text-[#d9342b]">κόκκινο</span> = δύναμη (το βάρος mg λίγο πιο σκούρο) ·{" "}
                <span className="font-semibold text-[#1f6fd1]">μπλε</span> = ταχύτητα ·{" "}
                <span className="font-semibold text-[#e08a1e]">πορτοκαλί</span> = δυναμικό ή ενέργεια. Θετικά φορτία κόκκινοι δίσκοι με «+», αρνητικά μπλε με «−».
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-4 text-sm leading-6 text-[#3d4452]">
              <p className="font-semibold text-[#1c2433]">Οι ράβδοι και το κουτάκι δεξιά</p>
              <p className="mt-1">
                Οι ράβδοι δείχνουν μέτρα (εντάσεις, ενέργειες, φορτία) και αλλάζουν μαζί με το σχέδιο· η τιμή γράφεται δεξιά με τη μονάδα της. Στο λευκό
                κουτάκι γράφονται οι πράξεις του βήματος που βλέπεις.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-4 text-sm leading-6 text-[#3d4452] sm:col-span-2">
              <p className="font-semibold text-[#1c2433]">Σύμβολα και σταθερές</p>
              <ul className="mt-1 grid gap-x-6 gap-y-1 sm:grid-cols-2">
                <li>
                  <b>E</b>: ένταση (N/C = V/m) · <b>V</b>: δυναμικό ή τάση (volt)
                </li>
                <li>
                  <b>U</b>: δυναμική ενέργεια (J) · <b>W</b>: έργο της δύναμης του πεδίου
                </li>
                <li>
                  <b>k</b> = 9·10⁹ N·m²/C² · <b>ε₀</b> = 8,85·10⁻¹² C²/(N·m²)
                </li>
                <li>
                  <b>e</b> = 1,6·10⁻¹⁹ C · 1 eV = 1,6·10⁻¹⁹ J
                </li>
                <li>
                  <b>ℓ</b>: απόσταση οπλισμών (στον Σαββάλα <b>d</b>) · <b>S</b>: εμβαδόν
                </li>
                <li>
                  <b>ε</b>: σχετική διηλεκτρική σταθερά (αέρας ε = 1)
                </li>
                <li>
                  <b>V<sub>AΓ</sub></b> = V<sub>A</sub> − V<sub>Γ</sub>: η σειρά των δεικτών μετράει
                </li>
                <li>
                  1 μC = 10⁻⁶ C · 1 nC = 10⁻⁹ C · 1 pF = 10⁻¹² F
                </li>
              </ul>
            </div>
          </div>
        </section>

        <PedioAnimationsClient />

        <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Οδηγός</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Τι προσέχεις σε κάθε ενότητα</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {groups.map((g) => (
              <div key={g.range} className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-4">
                <p className="text-xs font-semibold text-[#857261]">{g.range === "31–34" ? "Επιπλέον ασκήσεις" : "Κουτάκια"} {g.range}</p>
                <p className="mt-1 font-semibold">{g.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#5c534c]">{g.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-4">
            <Note tone="warn" title="Οι 3 πιο συχνές παγίδες">
              <ul className="mt-1 space-y-1">
                <li>• Στο E = k|Q|/r² βάζεις απόλυτες τιμές, στο V = kQ/r και U = kQq/r βάζεις τα πρόσημα.</li>
                <li>• Εντάσεις προσθέτεις σαν διανύσματα, δυναμικά σαν αριθμούς. E = 0 δεν σημαίνει V = 0.</li>
                <li>• Μονάδες: cm → m, μC → 10⁻⁶ C, mg (χιλιοστόγραμμα) → 10⁻⁶ kg, μF → 10⁻⁶ F.</li>
              </ul>
            </Note>
            <Note tone="ok" title="Από πού είναι">
              Θεωρία: σχολικό βιβλίο Φυσικής Γενικής Παιδείας (ενότητες 1.2–1.5) και Σαββάλας (κεφάλαια 3–8). Οι αριθμοί των παραδειγμάτων είναι κυρίως
              από τις βασικές λυμένες ασκήσεις του Σαββάλα. Στο σχολικό βιβλίο η απόσταση των οπλισμών λέγεται ℓ, στον Σαββάλα d.
            </Note>
          </div>
        </section>
      </div>
    </main>
  );
}
