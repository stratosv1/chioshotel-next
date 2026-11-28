import type { Metadata } from "next";
import { StudyBar } from "@/components/mixalis/study/StudyBar";
import { StudyMark } from "@/components/mixalis/study/StudyMark";
import { Note } from "@/components/mixalis/omali/shared";
import { OrmiAnimationsClient } from "@/components/mixalis/ormi/OrmiAnimationsClient";
import { OrmiMapEmbed } from "@/components/mixalis/ormi/OrmiMapEmbed";
import { OrmiMathimaEmbed } from "@/components/mixalis/ormi/OrmiMathimaEmbed";
import { PosterCells, PosterRevisionNote } from "@/components/mixalis/ormi/PosterCells";
import { OrmiNav } from "@/components/mixalis/ormi/OrmiNav";

export const metadata: Metadata = {
  title: { absolute: "Ορμή και κρούσεις · Τυπολόγιο · Physics Workspace" },
  description:
    "Διαδραστικό μάθημα του κεφαλαίου 2 (ορμή) με κίνηση και λυμένες όλες τις ασκήσεις του βιβλίου, και 77 περιπτώσεις ορμής και κρούσεων σε ένα poster με κινούμενο σχέδιο για καθεμία.",
};

const POSTER_W = 1212;
const POSTER_H = 4536;

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
  "Ασκήσεις Τριπολίτη",
];

/** Box range of each animated section (sections 1–9 run 1–43, section 10 is 54–72). */
const sectionRanges = ["1–5", "6–10", "11–15", "16–20", "21–25", "26–30", "31–35", "36–40", "41–43", "54–72"];

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
  { range: "44–48", title: "Κρούση και μετά", text: "Πρώτα ΑΔΟ για την κρούση. Μετά: κύκλος (κεντρομόλος στην κορυφή), ράμπα (ΑΔΜΕ ή ΘΜΚΕ), ελατήριο ή σανίδα (κοινή ταχύτητα στο τέλος), εκκρεμές (υ = √(2gh))." },
  { range: "49–53", title: "Διαγράμματα, πολλές κρούσεις, ποσοστά", text: "Στο x–t η κλίση είναι η ταχύτητα. Πολλές κρούσεις: μία τη φορά. Ποσοστό ενέργειας ⇒ λόγος μαζών. Φορτισμένα σωματίδια: ΑΔΟ μαζί με ΑΔΜΕ." },
  { range: "54–72", title: "Ασκήσεις Τριπολίτη · Διαγράμματα δυνάμεων στην κρούση", text: "Απομόνωσε το σώμα και βάλε ΜΟΝΟ τις δυνάμεις που δέχεται. Τοίχος: μόνο C. Δάπεδο ή χέρι: N (ή C) και mg, οπότε N = mg + Δp/Δt. Σύστημα A + B: οι C είναι εσωτερικές ⇒ ΑΔΟ. Πολύ μικρό Δt: η τριβή δεν προλαβαίνει (σφυρί και πατάτα). Ασκήσεις Τριπολίτη (65–77): ψάρι, τεταρτοκύκλιο, βλήματα, θερμότητα, τοίχος, αναπήδηση, 4.107–4.117. Τα 73–77 ανοίγουν τη λυμένη άσκηση." },
];

/** Clickable areas over the poster cells (SVG coordinates of the poster). */
// Boxes 44–53 open the matching worked example (combined stories on /mixalis/ormi2#s…, the 20-case page, or the field page).
const EXTRA_BOX: Record<number, string> = {
  44: "/mixalis/ormi2#s9",
  45: "/mixalis/ormi2#s21",
  46: "/mixalis/ormi2#s11",
  47: "/mixalis/ormi2#s23",
  48: "/mixalis/ormi2#s3",
  49: "/mixalis/ormi2#s28",
  50: "/mixalis/ormi2#s22",
  51: "/mixalis/ormi2#s30",
  52: "/mixalis/ormi/periptoseis#pc2",
  53: "/mixalis/pedio#k69",
  73: "/mixalis/ormi/askiseis#a4-108",
  74: "/mixalis/ormi/askiseis#a4-109",
  75: "/mixalis/ormi/askiseis#a4-113",
  76: "/mixalis/ormi/askiseis#a4-115",
  77: "/mixalis/ormi/askiseis#a4-117",
};

const cells = Array.from({ length: 77 }, (_, i) => {
  // Section 9 has boxes 41–43 and a related-boxes panel, so boxes 44+ start a new row of five.
  const k = i < 43 ? i : i + 2;
  const section = Math.floor(k / 5);
  const col = k % 5;
  return { n: i + 1, href: EXTRA_BOX[i + 1], x: 17 + 238 * col, y: 146 + 256 * section, w: 226, h: 212 };
});


export default function OrmiPage() {
  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <OrmiNav active="theoria" />

        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Φυσική Προσανατολισμού Β΄ Λυκείου · Βήμα 1</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Ορμή και κρούσεις: θεωρία και τυπολόγιο</h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#5c534c] sm:text-base">
            Ξεκίνα από το μάθημα με κίνηση και μετά πέρνα στο τυπολόγιο: 77 περιπτώσεις σε ένα σχέδιο, από την Τράπεζα Θεμάτων, το σχολικό βιβλίο, τις λυμένες
            του Σαββάλα και τις συνθετικές ασκήσεις. Σε κάθε κουτάκι βλέπεις ταχύτητες (μπλε), δυνάμεις (κόκκινο) και αποτελέσματα (πράσινο).{" "}
            <b>Πάτα ένα κουτάκι</b> και θα σε πάει στο κινούμενο σχέδιό του, όπου το φαινόμενο εξηγείται βήμα βήμα. Όταν τελειώσεις, συνέχισε στο{" "}
            <b>βήμα 2 · Εξάσκηση</b> από την μπάρα πάνω.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
            <a href="#mathima" className="rounded-full bg-[#2c2825] px-4 py-1.5 text-white hover:bg-black">
              ▶ Το μάθημα με κίνηση ↓
            </a>
            <a href="#typologio" className="rounded-full bg-[#2c2825] px-4 py-1.5 text-white hover:bg-black">
              Το τυπολόγιο ↓
            </a>
            <a href="/mixalis/ormi-typologio.svg" target="_blank" rel="noopener" className="rounded-full border border-black/10 bg-white px-4 py-1.5 hover:bg-[#f3efe8]">
              Poster σε πλήρες μέγεθος
            </a>
            <a href="/mixalis/ormi-typologio-A4.pdf" target="_blank" rel="noopener" className="rounded-full border border-black/10 bg-white px-4 py-1.5 hover:bg-[#f3efe8]">
              Εκτύπωση σε A4 (PDF, 2 σελίδες)
            </a>
            <a href="/mixalis/ormi-krouseis-parousiasi.pdf" download className="rounded-full border border-black/10 bg-white px-4 py-1.5 hover:bg-[#f3efe8]">
              ⬇ Παρουσίαση με λυμένα παραδείγματα (PDF)
            </a>
          </div>
        </header>

        <StudyBar lesson="ormi" />

        <section id="mathima" data-study-lesson="ormi" data-study-id="mathima" className="scroll-mt-20 rounded-3xl border border-black/10 bg-white p-3 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3 px-2 pb-3 pt-1 sm:px-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Ξεκίνα από εδώ · Το μάθημα</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Όλο το κεφάλαιο 2 του βιβλίου, με κίνηση</h2>
              <p className="mt-1 max-w-3xl text-[15px] leading-7 text-[#5c534c]">
                41 διαφάνειες που ακολουθούν το σχολικό βιβλίο ενότητα προς ενότητα (2.1–2.7), μαζί με τη θεωρία του Σαββάλα: σύστημα, κρούση, ορμή,
                ΣF = Δp/Δt, δύναμη από το δάπεδο, αρχή διατήρησης της ορμής, K = p²/2m, είδη κρούσεων, κρούση σε κάθετες διευθύνσεις, ελατήριο,
                ανάκρουση, πύραυλος, εκρήξεις. Κάθε διαφάνεια έχει κινούμενο σχέδιο που πειράζεις, και στο
                τέλος είναι λυμένες <b>όλες</b> οι 17 ασκήσεις και οι 19 ερωτήσεις του βιβλίου, με 3 quiz.
              </p>
            </div>
            <a href="/mixalis/ormi-mathima.html" target="_blank" rel="noopener" className="shrink-0 rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-semibold hover:bg-[#f3efe8]">
              Σε πλήρη οθόνη ↗
            </a>
          </div>
          <OrmiMathimaEmbed />
          <StudyMark lesson="ormi" id="mathima" title="Μάθημα κεφ. 2 (41 διαφάνειες)" path="/mixalis/ormi" className="mt-4 px-2 sm:px-1" />
        </section>

        <section id="typologio" className="scroll-mt-20 rounded-3xl border border-black/10 bg-white p-3 shadow-sm sm:p-5">
          <div className="px-2 pb-3 pt-1 sm:px-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Το τυπολόγιο</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">77 περιπτώσεις σε ένα σχέδιο</h2>
          </div>
          <div className="mb-4 rounded-2xl border border-black/10 bg-[#fbf8f3] p-3 sm:hidden">
            <h3 className="text-base font-bold">Το τυπολόγιο ανά ενότητα</h3>
            <p className="mt-1 text-xs leading-5 text-[#5b6577]">Το poster κυλάει οριζόντια στο κινητό για να διαβάζονται οι τύποι. Ή διάλεξε μια ενότητα και άνοιξε τα κινούμενα σχέδια.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {sectionNames.map((name, i) => (
                <a key={name} href={`#enotita-${i + 1}`} className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold leading-5 text-[#3d4452]">
                  {i + 1}. {name} · {sectionRanges[i]}
                </a>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-black/10 bg-[#fbfaf7]" aria-label="Τυπολόγιο 77 περιπτώσεων, κυλήστε οριζόντια στο κινητό">
            <div className="relative min-w-[850px] sm:min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mixalis/ormi-typologio.svg"
              alt="Τυπολόγιο ορμής και κρούσεων: 77 περιπτώσεις με σχήματα και εξισώσεις"
              width={POSTER_W}
              height={POSTER_H}
              decoding="async"
              className="mx-auto h-auto w-full"
            />
            <PosterCells cells={cells} posterW={POSTER_W} posterH={POSTER_H} lesson="ormi" />
            </div>
          </div>
          <PosterRevisionNote lesson="ormi" />
        </section>

        <nav className="sticky top-2 z-10 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-sm backdrop-blur" aria-label="Ενότητες">
          <div className="flex gap-1.5 overflow-x-auto text-sm font-semibold">
            {sectionNames.map((name, i) => (
              <a key={name} href={`#enotita-${i + 1}`} className="shrink-0 rounded-full px-3 py-1.5 text-[#4d4138] hover:bg-[#f3efe8]">
                {i + 1}. {name}
              </a>
            ))}
            <a href="#odigos" className="shrink-0 rounded-full px-3 py-1.5 text-[#4d4138] hover:bg-[#f3efe8]">
              Οδηγός
            </a>
            <a href="#xartis" className="shrink-0 rounded-full px-3 py-1.5 text-[#4d4138] hover:bg-[#f3efe8]">
              Χάρτης οικογενειών
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

        <section id="odigos" className="scroll-mt-20 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
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
            <Note tone="ok" title="Ίδια ορμή, ίδιο φρένο: χρόνος ή απόσταση; (κουτάκι 2 · κλασικό Θέμα Β)">
              <p className="mt-1">
                <b>Η ορμή καθορίζει τον χρόνο φρεναρίσματος, η κινητική ενέργεια καθορίζει την απόσταση.</b>
              </p>
              <ul className="mt-1 space-y-1">
                <li>• Χρόνος: ΣF·Δt = Δp ⇒ Δt = p/F. Ίδια p και ίδια F ⇒ ίδιος χρόνος.</li>
                <li>• Απόσταση: ΘΜΚΕ −F·x = 0 − K ⇒ x = K/F. Με K = p²/2m, το ελαφρύτερο έχει μεγαλύτερη K ⇒ πάει πιο μακριά.</li>
                <li>• Παράδειγμα: 1 kg με 4 m/s και 4 kg με 1 m/s, F = 2 N. Και τα δύο σταματούν σε 2 s, αλλά το πρώτο σε 4 m και το δεύτερο σε 1 m.</li>
              </ul>
            </Note>
            <Note tone="ok" title="Σύμβολα του poster">
              T = τριβή στο 22 και τάση νήματος στο 25 • Q = θερμότητα (χαμένη κινητική) • ℓ = μήκος νήματος ή σανίδας • N = κάθετη δύναμη • d =
              διείσδυση βλήματος • g = 10 m/s².
            </Note>
          </div>
        </section>

        <div id="xartis" className="scroll-mt-20">
          <OrmiMapEmbed />
        </div>

        <OrmiNav active="theoria" />
      </div>
    </main>
  );
}
