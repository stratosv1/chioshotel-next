import type { Metadata } from "next";
import Link from "next/link";
import { StudyBar } from "@/components/mixalis/study/StudyBar";
import { StudyMark } from "@/components/mixalis/study/StudyMark";
import { ErgoLab, ErgoQuiz } from "@/components/mixalis/ergo/ErgoInteractive";

export const metadata: Metadata = {
  title: { absolute: "Έργο, Ενέργεια και Ισχύς · Β΄ Λυκείου · Physics Workspace" },
  description: "Ελληνικές σημειώσεις, τυπολόγιο, κινούμενα διαδραστικά πειράματα, λυμένες ασκήσεις και αυτοαξιολόγηση για το έργο, την ενέργεια και την ισχύ.",
  robots: { index: false, follow: false },
};

const topics = [
  { id: "work", title: "Έργο σταθερής δύναμης", formula: "W = F · s · συνθ", detail: "Η γωνία θ είναι ανάμεσα στη δύναμη και τη μετατόπιση. Μονάδα: 1 J = 1 N·m.", accent: "bg-[#fff1dd]", tag: "Έργο" },
  { id: "kinetic", title: "Κινητική ενέργεια", formula: "K = ½mυ²", detail: "Αν διπλασιαστεί η μάζα, διπλασιάζεται η Κ. Αν διπλασιαστεί η ταχύτητα, η Κ τετραπλασιάζεται.", accent: "bg-[#eaf2fc]", tag: "Ενέργεια" },
  { id: "gravity", title: "Βαρυτική δυναμική ενέργεια", formula: "U = mgh · ΔU = mgΔh", detail: "Διαλέγουμε αυθαίρετα επίπεδο U = 0. Το έργο του βάρους είναι WΒ = −ΔU.", accent: "bg-[#e8f4ea]", tag: "Ενέργεια" },
  { id: "spring", title: "Ελαστική δυναμική ενέργεια", formula: "Uελ = ½kx²", detail: "Για ιδανικό ελατήριο: Fελ = −kx. Διπλάσια παραμόρφωση σημαίνει τετραπλάσια ενέργεια.", accent: "bg-[#f0eafd]", tag: "Ελατήριο" },
  { id: "theorem", title: "Θεώρημα μεταβολής κινητικής", formula: "ΣW = ΔK = Kτελ − Kαρχ", detail: "Αθροίζουμε τα έργα ΟΛΩΝ των δυνάμεων, όχι μόνο της δύναμης που σπρώχνει.", accent: "bg-[#eaf2fc]", tag: "ΘΜΚΕ" },
  { id: "mech", title: "Μηχανική ενέργεια και ΑΔΜΕ", formula: "Eμηχ = K + U · Eαρχ = Eτελ", detail: "Η μηχανική ενέργεια διατηρείται όταν δεν υπάρχει έργο μη συντηρητικών δυνάμεων.", accent: "bg-[#e8f4ea]", tag: "ΑΔΜΕ" },
  { id: "friction", title: "Έργο τριβής ολίσθησης", formula: "T = μN · WT = −T·s", detail: "Όταν η τριβή αντιτίθεται στην ολίσθηση, αφαιρεί μηχανική ενέργεια.", accent: "bg-[#fceae7]", tag: "Τριβή" },
  { id: "other", title: "Μεταβολή μηχανικής ενέργειας", formula: "Wμη συντηρητικών = ΔEμηχ", detail: "Με τριβή η Eμηχ μειώνεται, αλλά η ολική ενέργεια του πλήρους συστήματος διατηρείται.", accent: "bg-[#fff1dd]", tag: "Απώλειες" },
  { id: "power", title: "Μέση και στιγμιαία ισχύς", formula: "Pμ = W/Δt · P = Fυ·συνθ", detail: "Η ισχύς δείχνει πόσο γρήγορα μεταφέρεται ενέργεια. 1 W = 1 J/s.", accent: "bg-[#eaf2fc]", tag: "Ισχύς" },
  { id: "eff", title: "Βαθμός απόδοσης", formula: "η = Eωφ/Eεισ = Pωφ/Pεισ", detail: "Η απόδοση γράφεται από 0 έως 1 ή ως ποσοστό 0–100%. Πάντα με ίδιο χρονικό διάστημα.", accent: "bg-[#e8f4ea]", tag: "Απόδοση" },
  { id: "elec", title: "Ηλεκτρική ισχύς και ενέργεια", formula: "P = V·I · E = P·t", detail: "Το kW είναι μονάδα ισχύος. Η kWh είναι μονάδα ενέργειας: 1 kWh = 3,6×10⁶ J.", accent: "bg-[#f0eafd]", tag: "Εφαρμογές" },
  { id: "variable", title: "Μεταβλητή δύναμη", formula: "W = εμβαδόν στο διάγραμμα F–x", detail: "Μετράμε το προσημασμένο εμβαδόν κάτω από τη γραφική παράσταση F(x). Στο F–t το εμβαδόν δίνει ώθηση.", accent: "bg-[#fff1dd]", tag: "Γραφήματα" },
];

const examples = [
  { id: "ex1", title: "Έργο πλάγιας δύναμης", level: "Βασική", question: "Δύναμη 20 N σχηματίζει γωνία 60° με μετατόπιση 4 m. Να βρεθεί το έργο της.", steps: ["Δεδομένα: F = 20 N, s = 4 m, θ = 60°.", "W = F·s·συνθ.", "W = 20·4·0,5 = 40 J."], result: "W = +40 J", tip: "Πρόσεξε: δεν είναι F·s = 80 J. Χρειάζεται το συν60°." },
  { id: "ex2", title: "Τριβή και ταχύτητα", level: "Συνδυαστική", question: "Σώμα 5 kg έχει αρχική κινητική ενέργεια 100 J και ολισθαίνει 8 m σε οριζόντιο επίπεδο με μ = 0,2. Να βρεθεί η τελική ταχύτητα (g = 10 m/s²).", steps: ["N = mg = 5·10 = 50 N.", "T = μN = 0,2·50 = 10 N και WT = −T·s = −80 J.", "ΘΜΚΕ: Kτελ − Kαρχ = −80 ⇒ Kτελ = 20 J.", "½mυ² = 20 ⇒ υ = √(40/5) = √8 m/s."], result: "υτελ ≈ 2,83 m/s", tip: "Το έργο της τριβής είναι αρνητικό. Η μάζα πρέπει να είναι σε kg." },
  { id: "ex3", title: "Ελεύθερη πτώση και ΑΔΜΕ", level: "Βασική", question: "Σώμα αφήνεται από ύψος h = 5 m χωρίς αντίσταση αέρα. Να βρεθεί η ταχύτητα λίγο πριν το έδαφος (g = 10 m/s²).", steps: ["ΑΔΜΕ: Kαρχ + Uαρχ = Kτελ + Uτελ.", "0 + mgh = ½mυ² + 0.", "Απλοποιείται το m: υ = √(2gh) = √(2·10·5)."], result: "υ = 10 m/s", tip: "Σε ιδανική ελεύθερη πτώση η τελική ταχύτητα δεν εξαρτάται από τη μάζα." },
  { id: "ex4", title: "Ενέργεια ελατηρίου", level: "Βασική", question: "Ιδανικό ελατήριο k = 200 N/m επιμηκύνεται κατά 10 cm. Πόση ενέργεια αποθηκεύεται;", steps: ["Μετατροπή: x = 10 cm = 0,10 m.", "Uελ = ½kx².", "Uελ = ½·200·(0,10)² = 100·0,01."], result: "Uελ = 1 J", tip: "Πρώτα μετατρέπουμε τα cm σε m. Το x είναι στο τετράγωνο." },
  { id: "ex5", title: "Γερανός: έργο, ισχύς και απόδοση", level: "Συνδυαστική", question: "Γερανός ανεβάζει φορτίο 100 kg κατά 10 m σε 20 s, με απόδοση 80%. Βρείτε την ωφέλιμη και την εισερχόμενη ισχύ (g = 10 m/s²).", steps: ["Ωφέλιμο έργο: Wωφ = mgh = 100·10·10 = 10.000 J.", "Μέση ωφέλιμη ισχύς: Pωφ = 10.000/20 = 500 W.", "η = Pωφ/Pεισ = 0,8 ⇒ Pεισ = 500/0,8."], result: "Pωφ = 500 W · Pεισ = 625 W", tip: "Η ισχύς εισόδου είναι μεγαλύτερη από την ωφέλιμη εξαιτίας των απωλειών." },
  { id: "ex6", title: "Ενέργεια με απώλειες", level: "Συνδυαστική", question: "Σώμα έχει αρχική μηχανική ενέργεια 50 J. Κατά την κίνηση η τριβή κάνει έργο −15 J. Ποια είναι η τελική μηχανική ενέργεια;", steps: ["Wμη συντηρητικών = ΔEμηχ.", "−15 = Eτελ − 50.", "Eτελ = 50 − 15."], result: "Eτελ = 35 J", tip: "Δεν χάθηκε συνολική ενέργεια· μέρος της μετατράπηκε σε εσωτερική/θερμική." },
  { id: "ex7", title: "Έργο από διάγραμμα F–x", level: "Μέτρια", question: "Η δύναμη αυξάνεται γραμμικά από 0 N σε 10 N όταν η θέση μεταβάλλεται από 0 m σε 4 m. Πόσο είναι το έργο;", steps: ["Το εμβαδόν κάτω από τη γραμμή F–x είναι τρίγωνο.", "Βάση = 4 m, ύψος = 10 N.", "W = ½·4·10."], result: "W = 20 J", tip: "Μην το μπερδεύεις με διάγραμμα F–t, που δίνει ώθηση." },
  { id: "ex8", title: "Λάμπα και κιλοβατώρες", level: "Εφαρμογή", question: "Λάμπα ισχύος 100 W λειτουργεί 5 ώρες. Πόση ηλεκτρική ενέργεια καταναλώνει;", steps: ["P = 100 W = 0,1 kW.", "E = P·t = 0,1 kW·5 h = 0,5 kWh.", "Σε Joule: 0,5·3,6×10⁶ = 1,8×10⁶ J."], result: "E = 0,5 kWh = 1,8 MJ", tip: "Το kWh είναι ενέργεια, όχι ισχύς." },
];

const mistakes = [
  { title: "Το έργο δεν είναι πάντα F·s", body: "Χρειάζεται η γωνία: W = F·s·συνθ. Κάθετη δύναμη ⇒ W = 0." },
  { title: "Μόνο η συνισταμένη των έργων ισούται με ΔK", body: "Στο ΘΜΚΕ προσθέτουμε το έργο του βάρους, της τριβής, της εξωτερικής δύναμης κ.λπ." },
  { title: "ΑΔΜΕ δεν εφαρμόζεται άκριτα με τριβή", body: "Όταν δρα τριβή, χρησιμοποιούμε Wμη συντηρητικών = ΔEμηχ ή το ΘΜΚΕ." },
  { title: "Μηχανική ≠ συνολική ενέργεια", body: "Με τριβή η μηχανική μπορεί να μειώνεται, όμως η συνολική ενέργεια διατηρείται." },
  { title: "kW και kWh είναι διαφορετικά", body: "Το kW μετρά ισχύ και η kWh μετρά ενέργεια. 2 kW επί 3 h = 6 kWh." },
  { title: "Διάγραμμα F–x ≠ F–t", body: "Εμβαδόν F–x: έργο σε J. Εμβαδόν F–t: ώθηση σε N·s." },
];

function UnitMark({ id, title }: { id: string; title: string }) {
  return <StudyMark lesson="ergo" id={id} title={title} path="/mixalis/ergo" className="mt-5" />;
}

export default function ErgoPage() {
  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap gap-2 text-sm font-semibold text-[#857261]">
            <Link href="/mixalis" prefetch={false} className="hover:underline">← Τα μαθήματά μου</Link>
            <span>·</span>
            <Link href="/mixalis/ormi" prefetch={false} className="hover:underline">Ορμή και κρούσεις →</Link>
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Φυσική · Β΄ Λυκείου · Διαδραστικό βοήθημα</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Έργο, Ενέργεια και Ισχύς</h1>
          <p className="mt-4 max-w-4xl text-[15px] leading-7 text-[#5c534c] sm:text-base">
            Από την αρχή, με απλές εξηγήσεις, όλα τα βασικά μαθηματικά, κινούμενα σχέδια που αλλάζουν με τις τιμές σου,
            λυμένες ασκήσεις βήμα βήμα και τεστ. Το μάθημα βασίζεται στα 20 εκπαιδευτικά διαγράμματα που δόθηκαν και είναι προσαρμοσμένο σε μαθητή Β΄ Λυκείου.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
            <a href="#typoi" className="rounded-full border border-[#ddd5c7] px-4 py-2 hover:bg-[#f7f4ef]">Τυπολόγιο</a>
            <a href="#ergastirio" className="rounded-full bg-[#c9822f] px-4 py-2 text-white hover:bg-[#b37226]">Διαδραστικό εργαστήριο</a>
            <a href="#askiseis" className="rounded-full border border-[#ddd5c7] px-4 py-2 hover:bg-[#f7f4ef]">8 λυμένες ασκήσεις</a>
            <a href="#test" className="rounded-full bg-[#2c2825] px-4 py-2 text-white hover:bg-black">Τεστ κατανόησης</a>
          </div>
        </header>

        <StudyBar lesson="ergo" />

        <nav aria-label="Ενότητες μαθήματος" className="sticky top-2 z-10 overflow-x-auto rounded-2xl border border-black/10 bg-white/95 p-2 shadow-sm backdrop-blur">
          <div className="flex w-max min-w-full gap-1 text-sm font-semibold">
            {[
              ["eisagogi", "1. Οι έννοιες"], ["typoi", "2. Τυπολόγιο"], ["proshma", "3. Πρόσημα"],
              ["grafimata", "4. Γραφήματα"], ["ergastirio", "5. Εργαστήριο"], ["askiseis", "6. Λυμένα"],
              ["lathi", "7. Παγίδες"], ["test", "8. Τεστ"]
            ].map(([id, label]) => <a key={id} href={"#" + id} className="shrink-0 rounded-full px-3 py-2 text-[#4d4138] hover:bg-[#f3efe8]">{label}</a>)}
          </div>
        </nav>

        <section id="eisagogi" data-study-lesson="ergo" data-study-id="eisagogi" className="scroll-mt-24 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">1 · Πρώτα οι έννοιες</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Ποια είναι η διαφορά έργου, ενέργειας και ισχύος;</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              {head: "Έργο (W)", num: "W = F·s·συνθ", body: "Μεταφορά ενέργειας όταν μια δύναμη δρα κατά τη μετατόπιση. Μονάδα Joule (J).", eg: "10 N για 3 m στην ίδια φορά ⇒ 30 J."},
              {head: "Ενέργεια (E)", num: "K = ½mυ²", body: "Μετρά τη δυνατότητα μεταφοράς ενέργειας ή παραγωγής έργου. Έχει πολλές μορφές. Μονάδα Joule (J).", eg: "Κινούμενο σώμα: κινητική. Σώμα ψηλά: δυναμική."},
              {head: "Ισχύς (P)", num: "Pμ = W/Δt", body: "Δείχνει πόσο γρήγορα εκτελείται έργο ή μεταφέρεται ενέργεια. Μονάδα Watt (W).", eg: "30 J σε 5 s ⇒ μέση ισχύς 6 W."},
            ].map((item) => <div key={item.head} className="rounded-2xl border border-[#e6ddd0] bg-[#fbf8f3] p-5">
              <h3 className="text-lg font-semibold">{item.head}</h3>
              <p className="mt-3 rounded-xl bg-[#fff0cf] px-3 py-2 font-mono text-lg font-semibold">{item.num}</p>
              <p className="mt-3 text-sm leading-6 text-[#5c534c]">{item.body}</p>
              <p className="mt-3 text-sm font-medium text-[#805522]">{item.eg}</p>
            </div>)}
          </div>
          <p className="mt-5 rounded-2xl bg-[#ecf5ee] p-4 text-sm leading-6 text-[#245c3d]">
            <b>Κανόνας:</b> Η ενέργεια δεν δημιουργείται ούτε καταστρέφεται. Μεταφέρεται ή αλλάζει μορφή. Η μηχανική ενέργεια όμως δεν διατηρείται πάντα.
          </p>
          <UnitMark id="eisagogi" title="Οι βασικές έννοιες" />
        </section>

        <section id="typoi" className="scroll-mt-24 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">2 · Τυπολόγιο</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Οι 12 πιο χρήσιμοι τύποι</h2>
          <p className="mt-2 text-sm leading-6 text-[#5c534c]">Κάθε κάρτα μπορείς να τη σημειώσεις ως ολοκληρωμένη ή για επανάληψη.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topics.map((topic, i) => <article key={topic.id} id={"typ-" + topic.id} data-study-lesson="ergo" data-study-id={"typ-" + topic.id} className="scroll-mt-24 rounded-2xl border border-[#e6ddd0] bg-[#fcfbf9] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-[#937d63]">{String(i + 1).padStart(2, "0")}</span><span className="rounded-full bg-[#f2e9de] px-2.5 py-1 text-xs font-semibold text-[#6a5341]">{topic.tag}</span></div>
              <h3 className="mt-2 font-semibold">{topic.title}</h3>
              <p className={"mt-3 rounded-xl px-3 py-3 font-mono text-[15px] font-semibold leading-7 sm:text-base " + topic.accent}>{topic.formula}</p>
              <p className="mt-3 text-sm leading-6 text-[#5c534c]">{topic.detail}</p>
              <UnitMark id={"typ-" + topic.id} title={topic.title}/>
            </article>)}
          </div>
        </section>

        <section id="proshma" data-study-lesson="ergo" data-study-id="proshma" className="scroll-mt-24 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">3 · Πρόσημο έργου</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Πότε το έργο είναι θετικό, αρνητικό ή μηδέν;</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              {angle: "θ = 0°", sign: "W = +Fs", caption: "Θετικό έργο", text: "Δύναμη και μετατόπιση ομόρροπες. Παράδειγμα: σπρώχνουμε καρότσι.", tone: "bg-[#e8f4ea] text-[#245c3d]", direction: "→ F   → s"},
              {angle: "θ = 180°", sign: "W = −Fs", caption: "Αρνητικό έργο", text: "Δύναμη αντίθετη στη μετατόπιση. Παράδειγμα: τριβή ολίσθησης.", tone: "bg-[#fceae7] text-[#883228]", direction: "← F   → s"},
              {angle: "θ = 90°", sign: "W = 0", caption: "Μηδενικό έργο", text: "Δύναμη κάθετη στη μετατόπιση. Παράδειγμα: κάθετη αντίδραση σε οριζόντιο δάπεδο.", tone: "bg-[#eaf2fc] text-[#315677]", direction: "↑ F   → s"},
            ].map((c) => <div key={c.angle} className={"rounded-2xl p-5 " + c.tone}>
              <p className="text-xs font-semibold">{c.angle}</p><p className="mt-2 text-2xl font-bold">{c.sign}</p><p className="mt-3 font-mono text-lg">{c.direction}</p><h3 className="mt-3 font-semibold">{c.caption}</h3><p className="mt-2 text-sm leading-6">{c.text}</p>
            </div>)}
          </div>
          <UnitMark id="proshma" title="Πρόσημο έργου" />
        </section>

        <section id="grafimata" data-study-lesson="ergo" data-study-id="grafimata" className="scroll-mt-24 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">4 · Διαγράμματα</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Τι σημαίνει το εμβαδόν κάτω από το διάγραμμα;</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#cbddea] bg-[#f4f9fd] p-4">
              <h3 className="font-semibold text-[#244d72]">Δύναμη – θέση (F–x)</h3>
              <svg viewBox="0 0 420 250" role="img" aria-label="Διάγραμμα F-x: αυξανόμενη δύναμη, τρίγωνο με βάση 4 m και ύψος 10 N, έργο 20 J" className="mt-3 w-full">
                <line x1="54" y1="204" x2="385" y2="204" stroke="#2c2825" strokeWidth="3"/><line x1="54" y1="204" x2="54" y2="20" stroke="#2c2825" strokeWidth="3"/>
                <polygon points="54,204 328,49 328,204" fill="#9dc7e5" opacity=".75"/>
                <polyline points="54,204 328,49" fill="none" stroke="#206193" strokeWidth="5"/>
                <line x1="328" x2="328" y1="49" y2="204" stroke="#206193" strokeDasharray="6 5"/>
                <text x="15" y="23" fontSize="18">F(N)</text><text x="378" y="228" fontSize="18">x(m)</text>
                <text x="318" y="225" fontSize="18">4</text><text x="20" y="55" fontSize="18">10</text>
                <text x="135" y="175" fontSize="25" fill="#244d72" fontWeight="bold">20 J</text>
              </svg>
              <p className="text-sm leading-6 text-[#36566f]"><b>Εμβαδόν = Έργο.</b> Τρίγωνο: W = ½·4 m·10 N = 20 J.</p>
            </div>
            <div className="rounded-2xl border border-[#ead8c8] bg-[#fff9f2] p-4">
              <h3 className="font-semibold text-[#805522]">Δύναμη – χρόνος (F–t)</h3>
              <svg viewBox="0 0 420 250" role="img" aria-label="Διάγραμμα F-t: σταθερή δύναμη 10 N για 4 s, ώθηση 40 N s" className="mt-3 w-full">
                <line x1="54" y1="204" x2="385" y2="204" stroke="#2c2825" strokeWidth="3"/><line x1="54" y1="204" x2="54" y2="20" stroke="#2c2825" strokeWidth="3"/>
                <rect x="54" y="49" width="274" height="155" fill="#eed0a1" opacity=".8"/>
                <polyline points="54,49 328,49" fill="none" stroke="#a46b29" strokeWidth="5"/>
                <line x1="328" x2="328" y1="49" y2="204" stroke="#a46b29" strokeDasharray="6 5"/>
                <text x="15" y="23" fontSize="18">F(N)</text><text x="378" y="228" fontSize="18">t(s)</text>
                <text x="318" y="225" fontSize="18">4</text><text x="20" y="55" fontSize="18">10</text>
                <text x="125" y="140" fontSize="24" fill="#805522" fontWeight="bold">40 N·s</text>
              </svg>
              <p className="text-sm leading-6 text-[#78532c]"><b>Εμβαδόν = Ώθηση.</b> Ορθογώνιο: J = 10 N·4 s = 40 N·s, όχι έργο.</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#5c534c]">Για μεταβλητή δύναμη το προσημασμένο εμβαδόν στο F–x ισοδυναμεί με W = ∫Fₓ dx. Δεν χρειάζεσαι ολοκληρώματα για τα απλά σχήματα: υπολογίζεις τα εμβαδά.</p>
          <UnitMark id="grafimata" title="Διαγράμματα F–x και F–t" />
        </section>

        <section id="ergastirio" data-study-lesson="ergo" data-study-id="ergastirio" className="scroll-mt-24 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">5 · Εργαστήριο</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Παίξε με τις δυνάμεις και την ενέργεια</h2>
          <p className="mb-5 mt-2 max-w-3xl text-sm leading-6 text-[#5c534c]">Σύρε τους διακόπτες, παρατήρησε τα διανύσματα και τα αποτελέσματα και προσπάθησε να προβλέψεις τι θα αλλάξει πριν μετακινήσεις έναν διακόπτη.</p>
          <ErgoLab />
          <UnitMark id="ergastirio" title="Διαδραστικό εργαστήριο έργου και ενέργειας" />
        </section>

        <section id="askiseis" className="scroll-mt-24 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">6 · Λυμένα παραδείγματα</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">8 ασκήσεις με πλήρη λύση</h2>
          <p className="mt-2 text-sm leading-6 text-[#5c534c]">Διάβασε πρώτα τα δεδομένα, λύσε μόνος σου και μετά άνοιξε τα βήματα.</p>
          <div className="mt-5 space-y-4">
            {examples.map((ex, i) => <article key={ex.id} id={ex.id} data-study-lesson="ergo" data-study-id={ex.id} className="scroll-mt-24 rounded-2xl border border-[#e6ddd0] bg-[#fcfbf9] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold sm:text-lg">{i + 1}. {ex.title}</h3>
                <span className="rounded-full bg-[#f2e9de] px-3 py-1 text-xs font-semibold text-[#6a5341]">{ex.level}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#4d4138]">{ex.question}</p>
              <details className="mt-4 rounded-xl border border-[#e1d8cc] bg-white p-3 sm:p-4">
                <summary className="cursor-pointer font-semibold text-[#805522]">Δείξε τη λύση βήμα βήμα</summary>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-[#4d4138]">{ex.steps.map((step, j) => <li key={j}>{step}</li>)}</ol>
                <p className="mt-4 rounded-xl bg-[#e9f5ec] p-3 font-mono font-semibold text-[#245c3d]">{ex.result}</p>
                <p className="mt-3 text-sm leading-6 text-[#885f32]"><b>Πρόσεξε:</b> {ex.tip}</p>
              </details>
              <UnitMark id={ex.id} title={ex.title} />
            </article>)}
          </div>
        </section>

        <section id="lathi" data-study-lesson="ergo" data-study-id="lathi" className="scroll-mt-24 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">7 · Συνήθη λάθη</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Οι 6 παγίδες που πρέπει να αποφύγεις</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {mistakes.map((m, i) => <div key={m.title} className="rounded-2xl border border-[#ead8d2] bg-[#fff7f4] p-4">
              <h3 className="font-semibold text-[#883228]">{i + 1}. {m.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6b4d43]">{m.body}</p>
            </div>)}
          </div>
          <UnitMark id="lathi" title="Συνηθισμένα λάθη" />
        </section>

        <section id="test" className="scroll-mt-24 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">8 · Αυτοαξιολόγηση</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Τεστ κατανόησης: 7 ερωτήσεις</h2>
          <p className="mb-5 mt-2 text-sm leading-6 text-[#5c534c]">Διάλεξε απάντηση. Βλέπεις αμέσως αν είναι σωστή και την αιτιολόγηση.</p>
          <ErgoQuiz />
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 text-sm text-[#5c534c]">
          <p>Υπολογισμοί με g = 10 m/s², εκτός αν αναφέρεται διαφορετικά. Στις ιδανικές περιπτώσεις αμελούμε τις αντιστάσεις.</p>
          <Link href="/mixalis" prefetch={false} className="font-semibold text-[#805522] hover:underline">← Επιστροφή στα μαθήματα</Link>
        </footer>
      </div>
    </main>
  );
}
