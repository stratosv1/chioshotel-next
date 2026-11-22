import Link from "next/link";
import { PrintButton } from "@/components/sideris/physics/PrintButton";

// Ανακεφαλαίωση Κεφ. 2 (Φυσική Α΄ Γυμνασίου) σε μία σελίδα A4.

const ROWS: [string, string][] = [
  ["Μονάδα χρόνου", "Η διεθνής μονάδα μέτρησης του χρόνου είναι το δευτερόλεπτο (s)."],
  ["Πολλαπλάσια", "1 min = 60 s · 1 h = 60 min = 3.600 s · (1 ημέρα = 24 h)"],
  ["Μετατροπές", "Από μεγάλη σε μικρή μονάδα: × 60. Από μικρή σε μεγάλη: : 60. Ώρες ↔ δευτερόλεπτα: × ή : 3600."],
  ["Χρονική στιγμή (t)", "Η ένδειξη του ρολογιού που δείχνει πότε συμβαίνει ένα γεγονός."],
  ["Χρονική διάρκεια (Δt)", "Ο χρόνος ανάμεσα σε δύο γεγονότα (δύο στιγμές): Δt = t₂ − t₁ (τέλος − αρχή). Ποτέ αρνητική."],
  ["Αναλογικά όργανα", "Χρησιμοποιούν αναλογίες: ρολόι με δείκτες, ηλιακό ρολόι, κλεψύδρα."],
  ["Ψηφιακά όργανα", "Έχουν μόνο ψηφία (π.χ. 12:28:58)."],
  ["Ακρίβεια", "Μεγαλύτερη ακρίβεια έχουμε με τη μικρότερη μονάδα μέτρησης (χιλιοστά > εκατοστά του s)."],
  ["Ακριβέστερο όργανο", "Το ατομικό ρολόι."],
  ["Γιατί διαφέρουν οι μετρήσεις", "Όργανο (αντικειμενικός παράγοντας) και ο άνθρωπος που μετρά (υποκειμενικός)."],
  ["Μέση τιμή", "Μέση τιμή = άθροισμα των μετρήσεων : πλήθος των μετρήσεων."],
  ["Πείραμα", "Πλαστελίνη σε νήμα. Την εκτρέπουμε, μετράμε 10 ταλαντώσεις, 5 φορές, και βρίσκουμε τη μέση τιμή."],
  ["Ταλάντωση", "Η πλαστελίνη ξεκινά από την άκρη και ξαναγυρίζει στην ίδια άκρη (Α → Ο → Γ → Ο → Α)."],
];

export default function AnakefalaiosiPage() {
  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] print:bg-white print:p-0 sm:px-8">
      <div className="mx-auto max-w-[210mm] rounded-3xl bg-white p-6 shadow-sm print:rounded-none print:p-0 print:shadow-none sm:p-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href="/sideris/fysiki/kefalaio-2#kartes" prefetch={false} className="text-sm font-semibold text-[#5f5045] hover:underline">
            ← Πίσω στο κεφάλαιο
          </Link>
          <PrintButton />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#857261]">Φυσική Α΄ Γυμνασίου · Κεφάλαιο 2</p>
        <h1 className="mt-1 text-2xl font-bold">Μετρήσεις χρόνου – Η ακρίβεια · Ανακεφαλαίωση</h1>
        <table className="mt-4 w-full border-collapse text-[13.5px] leading-snug">
          <tbody>
            {ROWS.map(([k, v]) => (
              <tr key={k}>
                <th className="w-[32%] border border-black/20 bg-[#f1eafa] px-2 py-1.5 text-left align-top font-bold text-[#55307f]">{k}</th>
                <td className="border border-black/20 px-2 py-1.5">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
          <div className="rounded-xl border border-black/20 p-2">
            <p className="font-bold">Λυμένο: μέση τιμή</p>
            <p>8,4 + 8,5 + 8,7 + 9 + 9 = 43,6 s → 43,6 : 5 = 8,72 s</p>
          </div>
          <div className="rounded-xl border border-black/20 p-2">
            <p className="font-bold">Λυμένο: διάρκεια</p>
            <p>t₁ = 08:15, t₂ = 08:55 → Δt = 40 min = 2400 s</p>
          </div>
        </div>
      </div>
    </main>
  );
}
