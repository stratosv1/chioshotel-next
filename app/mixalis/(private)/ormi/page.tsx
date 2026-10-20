import type { Metadata } from "next";
import Link from "next/link";
import { Note } from "@/components/mixalis/omali/shared";

export const metadata: Metadata = {
  title: { absolute: "Ορμή και κρούσεις · Τυπολόγιο · Physics Workspace" },
  description: "30 περιπτώσεις ασκήσεων ορμής και κρούσεων της Τράπεζας Θεμάτων Φυσικής Β΄ Λυκείου σε ένα poster.",
};

const groups: { range: string; title: string; text: string }[] = [
  { range: "1–5", title: "Ορμή και μεταβολή ορμής", text: "Πάντα διάλεξε θετική φορά πριν γράψεις Δp = p_τελ − p_αρχ. Στην αναπήδηση τα πρόσημα «προστίθενται»." },
  { range: "6–10", title: "Δύναμη και ρυθμός μεταβολής", text: "ΣF = Δp/Δt. Σε διάγραμμα F–t το εμβαδόν είναι Δp, σε διάγραμμα p–t η κλίση είναι ΣF." },
  { range: "11–15", title: "ΑΔΟ σε συστήματα", text: "Έλεγξε ότι ΣF_εξ = 0 (ή ότι η κρούση/έκρηξη διαρκεί ελάχιστα). Αρχικά ακίνητο σύστημα ⇒ p_ολ = 0." },
  { range: "16–20", title: "Πλαστική κρούση", text: "Μία κοινή ταχύτητα V. Η ορμή διατηρείται, η κινητική όχι: Q = K_πριν − K_μετά." },
  { range: "21–25", title: "Βλήμα και στόχος", text: "Πρώτα ΑΔΟ για την κρούση, μετά ΘΜΚΕ (τριβή), ΑΔΜΕ (ύψος h) ή κεντρομόλο (τάση νήματος)." },
  { range: "26–30", title: "Εκρήξεις και συνδυαστικά", text: "Στην έκρηξη η κινητική αυξάνεται. Μετά την κρούση συχνά ακολουθεί οριζόντια βολή: t = √(2H/g)." },
];

export default function OrmiPage() {
  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <Link href="/mixalis" prefetch={false} className="text-sm font-semibold text-[#857261] hover:text-[#5f5045]">
            ← Physics Workspace
          </Link>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Φυσική Προσανατολισμού Β΄ Λυκείου</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Ορμή και κρούσεις: τυπολόγιο</h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#5c534c] sm:text-base">
            Όλες οι περιπτώσεις ασκήσεων της Τράπεζας Θεμάτων για την ορμή σε ένα σχέδιο. Σε κάθε κουτάκι βλέπεις το «πριν» και το «μετά», ποιες
            ταχύτητες (μπλε), δυνάμεις (κόκκινο) και αποτελέσματα (πράσινο) παίζουν ρόλο, και την εξίσωση που γράφεις. Πάτα την εικόνα για να την
            ανοίξεις σε πλήρες μέγεθος.
          </p>
        </header>

        <section className="rounded-3xl border border-black/10 bg-white p-3 shadow-sm sm:p-5">
          <a href="/mixalis/ormi-typologio.svg" target="_blank" rel="noopener" className="block overflow-hidden rounded-2xl border border-black/10 bg-[#fbfaf7]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mixalis/ormi-typologio.svg"
              alt="Τυπολόγιο ορμής και κρούσεων: 30 περιπτώσεις με σχήματα και εξισώσεις"
              width={1212}
              height={1720}
              decoding="async"
              className="mx-auto h-auto w-full"
            />
          </a>
        </section>

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
              T = τριβή στο 22 και τάση νήματος στο 25 • Q = θερμότητα (χαμένη κινητική) • ℓ = μήκος νήματος • g = 10 m/s².
            </Note>
          </div>
        </section>
      </div>
    </main>
  );
}
