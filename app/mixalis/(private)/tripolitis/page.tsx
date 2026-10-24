import type { Metadata } from "next";
import Link from "next/link";
import { TripolitisClient } from "@/components/mixalis/tripolitis/TripolitisClient";

export const metadata: Metadata = {
  title: { absolute: "Φωτοτυπίες Τριπολίτη · Ορμή · Physics Workspace" },
  description: "Λυμένες ασκήσεις ορμής από τις φωτοτυπίες Τριπολίτη, με κινούμενο σχέδιο και λύση βήμα βήμα.",
};

export default function TripolitisPage() {
  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <Link href="/mixalis" prefetch={false} className="text-sm font-semibold text-[#857261] hover:text-[#5f5045]">
            ← Physics Workspace
          </Link>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Φυσική Προσανατολισμού Β΄ Λυκείου</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Φωτοτυπίες Τριπολίτη: Ορμή</h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#5c534c] sm:text-base">
            Όλες οι ασκήσεις και τα προβλήματα από τις φωτοτυπίες, με τη σειρά του βιβλίου. Σε κάθε άσκηση: τι λέει με λίγα λόγια, ένα κινούμενο σχέδιο
            που προχωράει <b>ένα βήμα τη φορά</b>, και η λύση που ανοίγει επίσης βήμα βήμα. Δοκίμασε πρώτα μόνος σου, μετά άνοιξε τη λύση.
          </p>
          <p className="mt-3 text-sm leading-6 text-[#857261]">
            Χρώματα: <span className="font-semibold text-[#1f6fd1]">μπλε = ταχύτητα</span>,{" "}
            <span className="font-semibold text-[#d9342b]">κόκκινο = δύναμη</span>, <span className="font-semibold text-[#1f9d55]">πράσινο = ορμή</span>,{" "}
            <span className="font-semibold text-[#e08a1e]">πορτοκαλί = κινητική ενέργεια</span>. Για τη θεωρία:{" "}
            <Link href="/mixalis/ormi" prefetch={false} className="font-semibold underline">
              Ορμή και κρούσεις
            </Link>
            .
          </p>
        </header>
        <TripolitisClient />
      </div>
    </main>
  );
}
