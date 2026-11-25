import type { Metadata } from "next";
import { StudyBar } from "@/components/mixalis/study/StudyBar";
import { OrmiNav } from "@/components/mixalis/ormi/OrmiNav";
import { OrmiLawTrainer } from "@/components/mixalis/ormi/OrmiLawTrainer";
import { TripolitisClient } from "@/components/mixalis/tripolitis/TripolitisClient";

export const metadata: Metadata = {
  title: { absolute: "Ορμή και κρούσεις · Εξάσκηση · Physics Workspace" },
  description: "Τεστ επιλογής νόμου (ΑΔΟ ή μεταβολή ορμής;) και όλες οι λυμένες ασκήσεις του Τριπολίτη (4.67–4.123) με κινούμενο σχέδιο.",
  robots: { index: false, follow: false },
};

export default function OrmiAskiseisPage() {
  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <OrmiNav active="askiseis" />

        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Φυσική Προσανατολισμού Β΄ Λυκείου · Βήμα 2</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Ορμή και κρούσεις: εξάσκηση</h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#5c534c] sm:text-base">
            Πρώτα μάθε να αποφασίζεις <b>ποιο εργαλείο</b> ταιριάζει (ΑΔΟ ή μεταβολή ορμής), με 12 σύντομες περιπτώσεις. Μετά λύσε τις ασκήσεις του
            Τριπολίτη με τη σειρά του βιβλίου. Όταν τις τελειώσεις, πέρνα στο <b>βήμα 3 · Τράπεζα Θεμάτων</b>.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
            <a href="#epilogi-nomou" className="rounded-full bg-[#2c2825] px-4 py-1.5 text-white hover:bg-black">
              ΑΔΟ ή Δp; · Τεστ επιλογής ↓
            </a>
            <a href="#askiseis" className="rounded-full bg-[#2c2825] px-4 py-1.5 text-white hover:bg-black">
              Λυμένες ασκήσεις Τριπολίτη ↓
            </a>
          </div>
        </header>

        <StudyBar lesson="ormi" />

        <OrmiLawTrainer />

        <section id="askiseis" className="scroll-mt-20 space-y-6">
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Ασκήσεις του βιβλίου</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Λυμένες ασκήσεις Τριπολίτη (4.67–4.123)</h2>
            <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#5c534c]">
              Όλες οι ασκήσεις και τα προβλήματα από τις φωτοτυπίες, με τη σειρά του βιβλίου. Σε κάθε άσκηση: τι λέει με λίγα λόγια, ένα κινούμενο
              σχέδιο που προχωράει <b>ένα βήμα τη φορά</b> και η λύση που ανοίγει επίσης βήμα βήμα. Δοκίμασε πρώτα μόνος σου, μετά άνοιξε τη λύση.
            </p>
          </div>
          <TripolitisClient embedded />
        </section>

        <OrmiNav active="askiseis" />
      </div>
    </main>
  );
}
