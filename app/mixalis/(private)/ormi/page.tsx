import type { Metadata } from "next";
import Link from "next/link";
import { Note } from "@/components/mixalis/omali/shared";
import { OrmiAnimationsClient } from "@/components/mixalis/ormi/OrmiAnimationsClient";
import { OrmiTheoryEmbed } from "@/components/mixalis/ormi/OrmiTheoryEmbed";
import { TripolitisClient } from "@/components/mixalis/tripolitis/TripolitisClient";
import { TrapezaOrmi } from "@/components/mixalis/ormi/trapeza/TrapezaOrmi";

export const metadata: Metadata = {
  title: { absolute: "Ορμή και κρούσεις · Τυπολόγιο · Physics Workspace" },
  description:
    "40 περιπτώσεις ορμής και κρούσεων (Τράπεζα Θεμάτων, σχολικό βιβλίο, Σαββάλας) σε ένα poster, με κινούμενο σχέδιο για κάθε περίπτωση, και όλα τα Θέματα 2 της Τράπεζας λυμένα.",
};

const POSTER_W = 1212;
const POSTER_H = 2232;

const sectionNames = [
  "Ορμή",
  "Δύναμη",
  "ΑΔΟ",
  "Πλαστική",
  "Βλήμα",
  "Εκρήξεις",
  "Άλλες κρούσεις",
  "Ωθήσεις & ροές",
];

const groups: { range: string; title: string; text: string }[] = [
  { range: "1–5", title: "Ορμή και μεταβολή ορμής", text: "Πάντα διάλεξε θετική φορά πριν γράψεις Δp = p_τελ − p_αρχ. Στην αναπήδηση τα μέτρα «προστίθενται»." },
  { range: "6–10", title: "Δύναμη και ρυθμός μεταβολής", text: "ΣF = Δp/Δt. Σε διάγραμμα F–t το εμβαδόν είναι Δp, σε διάγραμμα p–t η κλίση είναι ΣF." },
  { range: "11–15", title: "ΑΔΟ σε συστήματα", text: "Έλεγξε ότι ΣF_εξ = 0 (ή ότι η κρούση/έκρηξη διαρκεί ελάχιστα). Αρχικά ακίνητο σύστημα ⇒ p_ολ = 0." },
  { range: "16–20", title: "Πλαστική κρούση", text: "Μία κοινή ταχύτητα V. Η ορμή διατηρείται, η κινητική όχι: Q = K_πριν − K_μετά." },
  { range: "21–25", title: "Βλήμα και στόχος", text: "Πρώτα ΑΔΟ για την κρούση, μετά ΘΜΚΕ (τριβή), ΑΔΜΕ (ύψος h) ή κεντρομόλο (τάση νήματος)." },
  { range: "26–30", title: "Εκρήξεις και συνδυαστικά", text: "Στην έκρηξη η κινητική αυξάνεται. Μετά την κρούση συχνά ακολουθεί οριζόντια βολή: t = √(2H/g)." },
  { range: "31–35", title: "Κρούσεις χωρίς συσσωμάτωση", text: "Δύο ταχύτητες μετά: θέλεις τη μία δοσμένη. Δύναμη εδάφους: N = Δp/Δt + mg. Βλήμα μέσα σε ξύλο: Q = F·d." },
  { range: "36–40", title: "Ωθήσεις, ροές, κατακόρυφη βολή", text: "Ελατήριο και πύραυλος είναι «εκρήξεις». Σανίδα: το κέντρο μάζας μένει ακίνητο. Βροχή: F = (N/Δt)·m·υ." },
];

/** Clickable areas over the poster cells (SVG coordinates of the poster). */
const cells = Array.from({ length: 40 }, (_, i) => {
  const section = Math.floor(i / 5);
  const col = i % 5;
  return { n: i + 1, x: 17 + 238 * col, y: 146 + 256 * section, w: 226, h: 212 };
});

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;

export default function OrmiPage() {
  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <Link href="/mixalis" prefetch={false} className="text-sm font-semibold text-[#857261] hover:text-[#5f5045]">
            ← Physics Workspace
          </Link>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Φυσική Προσανατολισμού Β΄ Λυκείου</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Ορμή και κρούσεις: τυπολόγιο</h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#5c534c] sm:text-base">
            40 περιπτώσεις σε ένα σχέδιο: όλες της Τράπεζας Θεμάτων, μαζί με όσες προσθέτουν το σχολικό βιβλίο και οι λυμένες του Σαββάλα. Σε κάθε
            κουτάκι βλέπεις ταχύτητες (μπλε), δυνάμεις (κόκκινο) και αποτελέσματα (πράσινο). <b>Πάτα ένα κουτάκι</b> και θα σε πάει στο κινούμενο
            σχέδιό του, όπου το φαινόμενο εξηγείται βήμα βήμα.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
            <a href="/mixalis/ormi-typologio.svg" target="_blank" rel="noopener" className="rounded-full border border-black/10 bg-white px-4 py-1.5 hover:bg-[#f3efe8]">
              Poster σε πλήρες μέγεθος
            </a>
            <a href="/mixalis/ormi-typologio-A4.pdf" target="_blank" rel="noopener" className="rounded-full bg-[#2c2825] px-4 py-1.5 text-white hover:bg-black">
              Εκτύπωση σε A4 (PDF, 2 σελίδες)
            </a>
            <a href="#askiseis" className="rounded-full border border-black/10 bg-white px-4 py-1.5 hover:bg-[#f3efe8]">
              Λυμένες ασκήσεις Τριπολίτη ↓
            </a>
            <a href="#trapeza" className="rounded-full border border-black/10 bg-white px-4 py-1.5 hover:bg-[#f3efe8]">
              Τράπεζα Θεμάτων · Θέμα 2 ↓
            </a>
          </div>
        </header>

        <section id="theoria" className="scroll-mt-20 rounded-3xl border border-black/10 bg-white p-3 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3 px-2 pb-3 pt-1 sm:px-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Ξεκίνα από εδώ</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Η θεωρία, βήμα βήμα</h2>
              <p className="mt-1 max-w-3xl text-[15px] leading-7 text-[#5c534c]">
                Όλη η θεωρία του σχολικού βιβλίου (κεφ. 2) και του Σαββάλα (κεφ. 4–6) σε 25 διαφάνειες: ορμή, ΣF = Δp/Δt, αρχή διατήρησης της ορμής,
                κρούσεις και ενέργεια. Με κινούμενα σχέδια, τρία εργαστήρια για πειράματα και τρία quiz. Μετά πέρασε στο τυπολόγιο.
              </p>
            </div>
            <a href="/mixalis/ormi-theory.html" target="_blank" rel="noopener" className="shrink-0 rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-semibold hover:bg-[#f3efe8]">
              Σε πλήρη οθόνη ↗
            </a>
          </div>
          <OrmiTheoryEmbed />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-3 shadow-sm sm:p-5">
          <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#fbfaf7]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mixalis/ormi-typologio.svg"
              alt="Τυπολόγιο ορμής και κρούσεων: 40 περιπτώσεις με σχήματα και εξισώσεις"
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
            <a href="#askiseis" className="shrink-0 rounded-full bg-[#2c2825] px-3 py-1.5 text-white hover:bg-black">
              Ασκήσεις Τριπολίτη
            </a>
            <a href="#trapeza" className="shrink-0 rounded-full bg-[#c9822f] px-3 py-1.5 text-white hover:bg-[#a96b22]">
              Τράπεζα Θεμάτων
            </a>
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
              Το σχέδιο παίζει <b>ένα βήμα τη φορά</b> και σταματά. Διάβασε την εξήγηση κάτω από την εικόνα και πάτα <b>«Επόμενο βήμα»</b>. Αν
              θες να το δεις ξανά, πάτα πάνω στο όνομα του βήματος.
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
                <span className="font-semibold text-[#d9342b]">κόκκινο</span> = δύναμη ·{" "}
                <span className="font-semibold text-[#1f9d55]">πράσινο</span> = ορμή ή Δp ·{" "}
                <span className="font-semibold text-[#e08a1e]">πορτοκαλί</span> = κινητική ενέργεια. Όσο πιο μακρύ το βέλος, τόσο μεγαλύτερο το μέγεθος.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-4 text-sm leading-6 text-[#3d4452]">
              <p className="font-semibold text-[#1c2433]">Οι ράβδοι κάτω από την εικόνα</p>
              <p className="mt-1">
                Δείχνουν ορμές με πρόσημο. Ράβδος <b>δεξιά</b> από τη γκρι γραμμή = θετική (προς τα δεξιά ή όπως λέει η «θετική φορά»),{" "}
                <b>αριστερά</b> = αρνητική. Η <b>μαύρη ράβδος</b> είναι η ολική ορμή. Όταν ισχύει η ΑΔΟ, δεν κουνιέται.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-4 text-sm leading-6 text-[#3d4452] sm:col-span-2">
              <p className="font-semibold text-[#1c2433]">Συντομογραφίες</p>
              <ul className="mt-1 grid gap-x-6 gap-y-1 sm:grid-cols-2">
                <li><b>ΑΔΟ</b>: Αρχή Διατήρησης της Ορμής</li>
                <li><b>ΑΔΜΕ</b>: Αρχή Διατήρησης της Μηχανικής Ενέργειας</li>
                <li><b>ΘΜΚΕ</b>: Θεώρημα Μεταβολής της Κινητικής Ενέργειας</li>
                <li>
                  <b>ΣF<sub>εξ</sub></b>: συνισταμένη των εξωτερικών δυνάμεων
                </li>
                <li><b>Δp</b>: μεταβολή ορμής = τελική − αρχική</li>
                <li><b>Q</b>: θερμότητα, δηλαδή η κινητική ενέργεια που «χάθηκε»</li>
                <li><b>F<sub>μ</sub></b>: μέση δύναμη (F<sub>μ</sub> = Δp/Δt)</li>
                <li><b>υ′</b>: ταχύτητα μετά την κρούση</li>
              </ul>
            </div>
          </div>
        </section>

        <OrmiAnimationsClient />

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
                <li>• Ξεχνάς το πρόσημο: ταχύτητα αντίθετη στη θετική φορά μπαίνει με «−».</li>
                <li>• Γράφεις διατήρηση κινητικής ενέργειας σε πλαστική κρούση ή έκρηξη. Δεν ισχύει!</li>
                <li>• Σε κάθετες διευθύνσεις προσθέτεις μέτρα. Η ΑΔΟ γράφεται χωριστά σε x και y (Πυθαγόρειο στο τέλος).</li>
              </ul>
            </Note>
            <Note tone="ok" title="Σύμβολα του poster">
              T = τριβή στο 22 και τάση νήματος στο 25 • Q = θερμότητα (χαμένη κινητική) • ℓ = μήκος νήματος ή σανίδας • N = κάθετη δύναμη • d =
              διείσδυση βλήματος • g = 10 m/s².
            </Note>
          </div>
        </section>

        <section id="askiseis" className="scroll-mt-20 space-y-6">
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Εξάσκηση</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Λυμένες ασκήσεις Τριπολίτη (4.67–4.123)</h2>
            <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#5c534c]">
              Όλες οι ασκήσεις και τα προβλήματα από τις φωτοτυπίες, με τη σειρά του βιβλίου. Σε κάθε άσκηση: τι λέει με λίγα λόγια, ένα κινούμενο
              σχέδιο που προχωράει <b>ένα βήμα τη φορά</b> και η λύση που ανοίγει επίσης βήμα βήμα. Δοκίμασε πρώτα μόνος σου, μετά άνοιξε τη λύση.
            </p>
          </div>
          <TripolitisClient embedded />
        </section>

        <section id="trapeza" className="scroll-mt-20 space-y-6">
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Τράπεζα Θεμάτων</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">ΤΡΑΠΕΖΑ ΘΕΜΑΤΩΝ · Θέμα 2</h2>
            <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#5c534c]">
              Όλα τα ερωτήματα ορμής από τα Θέματα 2 της επίσημης Τράπεζας Θεμάτων, χωρισμένα ανά είδος. Για κάθε ένα: διάβασε την εκφώνηση,{" "}
              <b>διάλεξε απάντηση</b> και γράψε στο τετράδιο <b>γιατί</b>, πριν δεις τη λύση. Μετά διάβασε την αιτιολόγηση βήμα-βήμα: αυτά τα
              βήματα γράφεις στο γραπτό για να πάρεις τις μονάδες (η αιτιολόγηση μετράει 8–9 από τις 12–13 μονάδες).
            </p>
          </div>
          <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-6">
            <TrapezaOrmi />
          </div>
        </section>
      </div>
    </main>
  );
}
