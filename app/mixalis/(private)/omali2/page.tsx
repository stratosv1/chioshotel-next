import type { Metadata } from "next";
import Link from "next/link";
import { Note } from "@/components/mixalis/omali/shared";
import { Omali2AnimationsClient } from "@/components/mixalis/omali2/Omali2AnimationsClient";

export const metadata: Metadata = {
  title: { absolute: "Κυκλική κίνηση · Τυπολόγιο · Physics Workspace" },
  description:
    "30 περιπτώσεις κυκλικής κίνησης (δρόμοι, κωνικό εκκρεμές, νήμα σε κατακόρυφο κύκλο, λόφοι, λούπες, όρια) σε ένα poster, με κινούμενο σχέδιο για κάθε περίπτωση.",
};

const POSTER_W = 1212;
const POSTER_H = 1720;

const sectionNames = ["Κίνηση", "Δρόμοι & δίσκοι", "Κωνικό εκκρεμές", "Νήμα κατακόρυφα", "Λόφοι & λούπες", "Όρια & ενέργεια"];

const groups: { range: string; title: string; text: string }[] = [
  {
    range: "1–5",
    title: "Κίνηση και επιτάχυνση",
    text: "«Ομαλή» = σταθερό μέτρο υ, όχι σταθερή ταχύτητα. Η α_κ = υ²/R = ω²R δείχνει πάντα στο κέντρο. Αν αλλάζει και το μέτρο, μπαίνει και α_ε: α = √(α_κ² + α_ε²).",
  },
  {
    range: "6–10",
    title: "Δρόμοι και περιστρεφόμενες επιφάνειες",
    text: "Ρώτα: ποια πραγματική δύναμη δείχνει στο κέντρο; N·ημφ, τάση, στατική τριβή ή η N του τοίχου. Η στατική τριβή είναι όση χρειάζεται, ως το μ_σ·N.",
  },
  {
    range: "11–15",
    title: "Κωνικό εκκρεμές",
    text: "R = L·ημφ. Κατακόρυφα ισορροπία: T·συνφ = mg. Οριζόντια κεντρομόλος: T·ημφ = mυ²/R. Κατά μέλη: εφφ = υ²/(gR). Πάντα T > mg.",
  },
  {
    range: "16–20",
    title: "Νήμα σε κατακόρυφο κύκλο",
    text: "Θετικά προς το κέντρο. Κάτω: T − mg = mυ²/R. Πάνω: T + mg = mυ²/R. Πλάι: μόνο T. Όριο στην κορυφή: T = 0 ⇒ υ_min = √(gR).",
  },
  {
    range: "21–25",
    title: "Λόφοι, κοιλάδες και λούπες",
    text: "Ίδια λογική με την N στη θέση της T. Λόφος (κέντρο από κάτω): mg − N. Κοιλάδα ή κάτω μέρος λούπας (κέντρο από πάνω): N − mg.",
  },
  {
    range: "26–30",
    title: "Ενέργεια, όρια και τροχιές",
    text: "Όριο = N = 0 ή T = 0. Μετά ΑΔΜΕ ανάμεσα σε δύο θέσεις: υ_κάτω,min = √(5gR), h_min = 5R/2, T_κάτω − T_πάνω = 6mg. Δορυφόρος: υ = √(GM/r).",
  },
];

/** Clickable areas over the poster cells (same grid as the poster SVG). */
const cells = Array.from({ length: 30 }, (_, i) => {
  const section = Math.floor(i / 5);
  const col = i % 5;
  return { n: i + 1, x: 17 + 238 * col, y: 146 + 256 * section, w: 226, h: 212 };
});

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;

export default function Omali2Page() {
  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/mixalis" prefetch={false} className="text-sm font-semibold text-[#857261] hover:text-[#5f5045]">
              ← Physics Workspace
            </Link>
            <Link href="/mixalis/omali" prefetch={false} className="text-sm font-semibold text-[#857261] hover:text-[#5f5045]">
              Το μάθημα της ομαλής κυκλικής →
            </Link>
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Φυσική Προσανατολισμού Β΄ Λυκείου</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Κυκλική κίνηση: τυπολόγιο</h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#5c534c] sm:text-base">
            30 περιπτώσεις σε ένα σχέδιο: δρόμοι με κλίση, δίσκοι, κωνικό εκκρεμές, νήμα σε κατακόρυφο κύκλο, λόφοι, λούπες και όρια. Σε κάθε κουτάκι
            βλέπεις ποιες δυνάμεις δείχνουν <b>προς το κέντρο</b>: αυτές γράφεις στο ΣF = mυ²/R. <b>Πάτα ένα κουτάκι</b> και θα σε πάει στο κινούμενο
            σχέδιό του, όπου το φαινόμενο εξηγείται βήμα βήμα, με αριθμούς σαν άσκηση.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
            <a href="/mixalis/omali-typologio.svg" target="_blank" rel="noopener" className="rounded-full border border-black/10 bg-white px-4 py-1.5 hover:bg-[#f3efe8]">
              Poster σε πλήρες μέγεθος
            </a>
            <a href="/mixalis/omali-typologio-A4.pdf" target="_blank" rel="noopener" className="rounded-full bg-[#2c2825] px-4 py-1.5 text-white hover:bg-black">
              Εκτύπωση σε A4 (PDF, 1 σελίδα)
            </a>
          </div>
        </header>

        <section className="rounded-3xl border border-black/10 bg-white p-3 shadow-sm sm:p-5">
          <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#fbfaf7]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mixalis/omali-typologio.svg"
              alt="Τυπολόγιο κυκλικής κίνησης: 30 περιπτώσεις με διαγράμματα δυνάμεων και τύπους"
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
                <span className="font-semibold text-[#1f6fd1]">Μπλε βέλος</span> = ταχύτητα ·{" "}
                <span className="font-semibold text-[#d9342b]">κόκκινο</span> = δύναμη (το βάρος mg λίγο πιο σκούρο) ·{" "}
                <span className="font-semibold text-[#1f9d55]">πράσινο</span> = επιτάχυνση ή «χρειαζόμενη» κεντρομόλος mυ²/R. Όσο πιο μακρύ το βέλος,
                τόσο μεγαλύτερο το μέγεθος.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-4 text-sm leading-6 text-[#3d4452]">
              <p className="font-semibold text-[#1c2433]">Οι ράβδοι και το κουτάκι δεξιά</p>
              <p className="mt-1">
                Οι ράβδοι δείχνουν μέτρα δυνάμεων σε N και αλλάζουν μαζί με την κίνηση. Η <b>γκρι ράβδος</b> είναι ένα όριο (π.χ. η μέγιστη στατική
                τριβή). Στο λευκό κουτάκι δεξιά γράφονται οι πράξεις του βήματος που βλέπεις.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-4 text-sm leading-6 text-[#3d4452] sm:col-span-2">
              <p className="font-semibold text-[#1c2433]">Συντομογραφίες</p>
              <ul className="mt-1 grid gap-x-6 gap-y-1 sm:grid-cols-2">
                <li>
                  <b>α<sub>κ</sub></b>: κεντρομόλος επιτάχυνση (υ²/R)
                </li>
                <li>
                  <b>α<sub>ε</sub></b>, <b>ΣF<sub>ε</sub></b>: επιτρόχια επιτάχυνση και δύναμη
                </li>
                <li>
                  <b>T</b>: τάση νήματος (στα κουτάκια 2 και 12: περίοδος)
                </li>
                <li>
                  <b>T<sub>σ</sub></b>, <b>μ<sub>σ</sub></b>: στατική τριβή και ο συντελεστής της
                </li>
                <li>
                  <b>N</b>: κάθετη δύναμη (αυτή «νιώθεις» σαν βάρος)
                </li>
                <li>
                  <b>φ</b>: γωνία (κωνικό: από την κατακόρυφο · νήμα: από την κατώτερη θέση)
                </li>
                <li>
                  <b>ω</b>: γωνιακή ταχύτητα (rad/s), υ = ω·R
                </li>
                <li>
                  <b>ΑΔΜΕ</b>: Αρχή Διατήρησης της Μηχανικής Ενέργειας
                </li>
              </ul>
            </div>
          </div>
        </section>

        <Omali2AnimationsClient />

        <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Οδηγός</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Τι προσέχεις σε κάθε ενότητα</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {groups.map((g) => (
              <div key={g.range} className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-4">
                <p className="text-xs font-semibold text-[#857261]">Κουτάκια {g.range}</p>
                <p className="mt-1 font-semibold">{g.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#5c534c]">{g.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-4">
            <Note tone="warn" title="Οι 3 πιο συχνές παγίδες">
              <ul className="mt-1 space-y-1">
                <li>• Σχεδιάζεις την «κεντρομόλο» σαν τρίτη δύναμη. Δεν είναι: είναι η συνισταμένη των πραγματικών δυνάμεων προς το κέντρο.</li>
                <li>• Ξεχνάς ότι θετικά είναι <b>προς το κέντρο</b>: στην κορυφή το mg μπαίνει με «+», στον πάτο με «−».</li>
                <li>• Γράφεις T<sub>σ</sub> = μ<sub>σ</sub>·N χωρίς να είσαι στο όριο. Η στατική τριβή είναι όση χρειάζεται.</li>
              </ul>
            </Note>
            <Note tone="ok" title="Σύμβολα του poster">
              Στο poster, στις ενότητες 4–6 το βάρος mg είναι σχεδιασμένο με μπλε, για να ξεχωρίζει από την τάση ή την N. Στα κινούμενα σχέδια όλες οι
              δυνάμεις είναι κόκκινες και το μπλε είναι μόνο η ταχύτητα. Ιδανικά μοντέλα: αβαρή νήματα, χωρίς αντίσταση αέρα, g = 10 m/s².
            </Note>
          </div>
        </section>
      </div>
    </main>
  );
}
