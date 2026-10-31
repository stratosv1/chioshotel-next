import type { Metadata } from "next";
import Link from "next/link";
import { StudyBar } from "@/components/mixalis/study/StudyBar";
import { StudyMark } from "@/components/mixalis/study/StudyMark";
import { Note } from "@/components/mixalis/omali/shared";
import { OrmiAnimationsClient } from "@/components/mixalis/ormi/OrmiAnimationsClient";
import { OrmiTheoryEmbed } from "@/components/mixalis/ormi/OrmiTheoryEmbed";
import { OrmiMathimaEmbed } from "@/components/mixalis/ormi/OrmiMathimaEmbed";
import { TripolitisClient } from "@/components/mixalis/tripolitis/TripolitisClient";
import { TrapezaOrmi } from "@/components/mixalis/ormi/trapeza/TrapezaOrmi";
import { PosterCells, PosterRevisionNote } from "@/components/mixalis/ormi/PosterCells";

export const metadata: Metadata = {
  title: { absolute: "Ορμή και κρούσεις · Τυπολόγιο · Physics Workspace" },
  description:
    "Διαδραστικό μάθημα του κεφαλαίου 2 (ορμή) με κίνηση και λυμένες όλες τις ασκήσεις του βιβλίου, 43 περιπτώσεις ορμής και κρούσεων σε ένα poster, και όλα τα Θέματα 2 της Τράπεζας λυμένα.",
};

const POSTER_W = 1212;
const POSTER_H = 2488;

const sectionNames = [
  "Ορμή",
  "Δύναμη",
  "ΑΔΟ",
  "Πλαστική",
  "Βλήμα",
  "Εκρήξεις",
  "Άλλες κρούσεις",
  "Ωθήσεις & ροές",
  "Ειδικές",
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
  { range: "41–43", title: "Ειδικές περιπτώσεις", text: "Ελαστική: έλεγχος με K πριν = K μετά, το ελαφρύ γυρίζει πίσω. Τρία κομμάτια: τα βέλη ορμής κλείνουν τρίγωνο. Κινούμενο όχημα: p πριν ≠ 0." },
];

/** Clickable areas over the poster cells (SVG coordinates of the poster). */
const cells = Array.from({ length: 43 }, (_, i) => {
  const section = Math.floor(i / 5);
  const col = i % 5;
  return { n: i + 1, x: 17 + 238 * col, y: 146 + 256 * section, w: 226, h: 212 };
});


export default function OrmiPage() {
  return (
    <main className="min-h-screen bg-[#f4f1ea] px-4 py-6 text-[#2c2825] sm:px-8 sm:py-10 lg:px-[3rem]">
      <div className="w-full space-y-[4rem]">
        <header>
          <Link href="/mixalis" prefetch={false} className="text-sm font-semibold text-[#857261] hover:text-[#5f5045]">
            ← Τα μαθήματά μου
          </Link>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Φυσική Προσανατολισμού Β΄ Λυκείου</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Ορμή και κρούσεις: τυπολόγιο</h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#5c534c] sm:text-base">
            43 περιπτώσεις σε ένα σχέδιο: όλες της Τράπεζας Θεμάτων, μαζί με όσες προσθέτουν το σχολικό βιβλίο και οι λυμένες του Σαββάλα. Σε κάθε
            κουτάκι βλέπεις ταχύτητες (μπλε), δυνάμεις (κόκκινο) και αποτελέσματα (πράσινο). <b>Πάτα ένα κουτάκι</b> και θα σε πάει στο κινούμενο
            σχέδιό του, όπου το φαινόμενο εξηγείται βήμα βήμα.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
            <a href="/mixalis/ormi-typologio.svg" target="_blank" rel="noopener" className="rounded-full border border-[#ddd5c7] bg-white px-4 py-1.5 hover:bg-[#f3efe8]">
              Poster σε πλήρες μέγεθος
            </a>
            <a href="/mixalis/ormi-typologio-A4.pdf" target="_blank" rel="noopener" className="rounded-full bg-[#2c2825] px-4 py-1.5 text-white hover:bg-black">
              Εκτύπωση σε A4 (PDF, 2 σελίδες)
            </a>
            <a href="/mixalis/ormi-krouseis-parousiasi.pdf" download className="rounded-full bg-[#c9822f] px-4 py-1.5 text-white hover:bg-[#a96b22]">
              ⬇ Παρουσίαση: όλες οι περιπτώσεις με λυμένα παραδείγματα (PDF, 20 διαφάνειες)
            </a>
            <a href="#mathima" className="rounded-full bg-[#1f6f5c] px-4 py-1.5 text-white hover:bg-[#185747]">
              ▶ Το μάθημα με κίνηση (κεφ. 2) ↓
            </a>
            <a href="#askiseis" className="rounded-full border border-[#ddd5c7] bg-white px-4 py-1.5 hover:bg-[#f3efe8]">
              Λυμένες ασκήσεις Τριπολίτη ↓
            </a>
            <a href="#trapeza" className="rounded-full border border-[#ddd5c7] bg-white px-4 py-1.5 hover:bg-[#f3efe8]">
              Τράπεζα Θεμάτων · Θέμα 2 ↓
            </a>
          </div>
        </header>

        <StudyBar lesson="ormi" />

        <section id="mathima" data-study-lesson="ormi" data-study-id="mathima" className="scroll-mt-20 border-t border-[#ddd5c7] pt-8">
          <div className="flex flex-wrap items-end justify-between gap-3 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Ξεκίνα από εδώ · Το μάθημα</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Όλο το κεφάλαιο 2 του βιβλίου, με κίνηση</h2>
              <p className="mt-1 max-w-3xl text-[15px] leading-7 text-[#5c534c]">
                38 διαφάνειες που ακολουθούν το σχολικό βιβλίο ενότητα προς ενότητα (2.1–2.7): σύστημα, κρούση, ορμή, ΣF = Δp/Δt, αρχή διατήρησης
                της ορμής, κινητική ενέργεια, ελατήριο, ανάκρουση, πύραυλος, εκρήξεις. Κάθε διαφάνεια έχει κινούμενο σχέδιο που πειράζεις, και στο
                τέλος είναι λυμένες <b>όλες</b> οι 17 ασκήσεις και οι 19 ερωτήσεις του βιβλίου, με 3 quiz.
              </p>
            </div>
            <a href="/mixalis/ormi-mathima.html" target="_blank" rel="noopener" className="shrink-0 rounded-full border border-[#ddd5c7] bg-white px-4 py-1.5 text-sm font-semibold hover:bg-[#f3efe8]">
              Σε πλήρη οθόνη ↗
            </a>
          </div>
          <OrmiMathimaEmbed />
          <StudyMark lesson="ormi" id="mathima" title="Μάθημα κεφ. 2 (38 διαφάνειες)" path="/mixalis/ormi" className="mt-4" />
        </section>

        <section id="theoria" data-study-lesson="ormi" data-study-id="theoria" className="scroll-mt-20 border-t border-[#ddd5c7] pt-8">
          <div className="flex flex-wrap items-end justify-between gap-3 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Επανάληψη</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Η θεωρία, βήμα βήμα</h2>
              <p className="mt-1 max-w-3xl text-[15px] leading-7 text-[#5c534c]">
                Όλη η θεωρία του σχολικού βιβλίου (κεφ. 2) και του Σαββάλα (κεφ. 4–6) σε 29 διαφάνειες: ορμή, ΣF = Δp/Δt, αρχή διατήρησης της ορμής,
                κρούσεις και ενέργεια. Με κινούμενα σχέδια, τρία εργαστήρια για πειράματα και τρία quiz. Μετά πέρασε στο τυπολόγιο.
              </p>
            </div>
            <a href="/mixalis/ormi-theory.html" target="_blank" rel="noopener" className="shrink-0 rounded-full border border-[#ddd5c7] bg-white px-4 py-1.5 text-sm font-semibold hover:bg-[#f3efe8]">
              Σε πλήρη οθόνη ↗
            </a>
          </div>
          <OrmiTheoryEmbed />
          <StudyMark lesson="ormi" id="theoria" title="Θεωρία (29 διαφάνειες)" path="/mixalis/ormi" className="mt-4" />
        </section>

        <section className="border-t border-[#ddd5c7] pt-8">
          <div className="relative mx-auto max-w-[1500px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mixalis/ormi-typologio.svg"
              alt="Τυπολόγιο ορμής και κρούσεων: 43 περιπτώσεις με σχήματα και εξισώσεις"
              width={POSTER_W}
              height={POSTER_H}
              decoding="async"
              className="mx-auto h-auto w-full"
            />
            <PosterCells cells={cells} posterW={POSTER_W} posterH={POSTER_H} lesson="ormi" />
          </div>
          <PosterRevisionNote lesson="ormi" />
        </section>

        <nav className="sticky top-0 z-10 -mx-4 border-b border-[#ddd5c7] bg-[rgba(244,241,234,0.92)] px-4 py-2 backdrop-blur sm:-mx-[2rem] sm:px-8 lg:-mx-[3rem] lg:px-[3rem]" aria-label="Ενότητες">
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

        <section className="border-t border-[#ddd5c7] pt-8">
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
          <div className="mt-6 grid gap-x-[2.5rem] gap-y-[1.5rem] lg:grid-cols-3">
            <div className="border-l-2 border-[#c9822f]/50 pl-4 text-sm leading-6 text-[#3d4452]">
              <p className="font-semibold text-[#1c2433]">Τα χρώματα</p>
              <p className="mt-1">
                <span className="font-semibold text-[#1f6fd1]">Μπλε βέλος</span> = ταχύτητα ·{" "}
                <span className="font-semibold text-[#d9342b]">κόκκινο</span> = δύναμη ·{" "}
                <span className="font-semibold text-[#1f9d55]">πράσινο</span> = ορμή ή Δp ·{" "}
                <span className="font-semibold text-[#e08a1e]">πορτοκαλί</span> = κινητική ενέργεια. Όσο πιο μακρύ το βέλος, τόσο μεγαλύτερο το μέγεθος.
              </p>
            </div>
            <div className="border-l-2 border-[#c9822f]/50 pl-4 text-sm leading-6 text-[#3d4452]">
              <p className="font-semibold text-[#1c2433]">Οι ράβδοι κάτω από την εικόνα</p>
              <p className="mt-1">
                Δείχνουν ορμές με πρόσημο. Ράβδος <b>δεξιά</b> από τη γκρι γραμμή = θετική (προς τα δεξιά ή όπως λέει η «θετική φορά»),{" "}
                <b>αριστερά</b> = αρνητική. Η <b>μαύρη ράβδος</b> είναι η ολική ορμή. Όταν ισχύει η ΑΔΟ, δεν κουνιέται.
              </p>
            </div>
            <div className="border-l-2 border-[#c9822f]/50 pl-4 text-sm leading-6 text-[#3d4452]">
              <p className="font-semibold text-[#1c2433]">Συντομογραφίες</p>
              <ul className="mt-1 grid gap-y-1">
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

        <section className="border-t border-[#ddd5c7] pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Οδηγός</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Τι προσέχεις σε κάθε ενότητα</h2>
          <div className="mt-6 grid gap-x-[2.5rem] gap-y-[1.5rem] sm:grid-cols-2 xl:grid-cols-3">
            {groups.map((g) => (
              <div key={g.range} className="border-t border-[#ddd5c7] pt-3">
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

        <section id="askiseis" className="scroll-mt-20 space-y-10">
          <div className="border-t border-[#ddd5c7] pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Εξάσκηση</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Λυμένες ασκήσεις Τριπολίτη (4.67–4.123)</h2>
            <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#5c534c]">
              Όλες οι ασκήσεις και τα προβλήματα από τις φωτοτυπίες, με τη σειρά του βιβλίου. Σε κάθε άσκηση: τι λέει με λίγα λόγια, ένα κινούμενο
              σχέδιο που προχωράει <b>ένα βήμα τη φορά</b> και η λύση που ανοίγει επίσης βήμα βήμα. Δοκίμασε πρώτα μόνος σου, μετά άνοιξε τη λύση.
            </p>
          </div>
          <TripolitisClient embedded />
        </section>

        <section id="trapeza" className="scroll-mt-20 space-y-8">
          <div className="border-t border-[#ddd5c7] pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Τράπεζα Θεμάτων</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">ΤΡΑΠΕΖΑ ΘΕΜΑΤΩΝ · Θέμα 2</h2>
            <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#5c534c]">
              Όλα τα ερωτήματα ορμής από τα Θέματα 2 της επίσημης Τράπεζας Θεμάτων, χωρισμένα ανά είδος. Για κάθε ένα: διάβασε την εκφώνηση,{" "}
              <b>διάλεξε απάντηση</b> και γράψε στο τετράδιο <b>γιατί</b>, πριν δεις τη λύση. Μετά διάβασε την αιτιολόγηση βήμα-βήμα: αυτά τα
              βήματα γράφεις στο γραπτό για να πάρεις τις μονάδες (η αιτιολόγηση μετράει 8–9 από τις 12–13 μονάδες).
            </p>
          </div>
          <TrapezaOrmi />
        </section>
      </div>
    </main>
  );
}
