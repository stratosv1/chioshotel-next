import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trip Planner Lead Funnel Preview",
  robots: { index: false, follow: false },
};

const itinerary = [
  { time: "10:00", title: "Καρφάς", text: "Ήρεμο ξεκίνημα δίπλα στη θάλασσα, με χρόνο για μπάνιο και καφέ." },
  { time: "13:00", title: "Πυργί", text: "Βόλτα στα ξυστά, μικρές στάσεις για φωτογραφίες και τοπικές γεύσεις." },
  { time: "15:30", title: "Μεστά", text: "Περιήγηση στο μεσαιωνικό χωριό και χρόνος για φαγητό." },
  { time: "19:00", title: "Απογευματινή στάση", text: "Η τελική σειρά προσαρμόζεται στις επιλογές και στις σημερινές συνθήκες." },
];

export default function LeadFunnelPreviewPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ec] pb-12 text-[#2f261f]">
      <section className="relative mx-auto max-w-[760px] overflow-hidden bg-white shadow-[0_26px_70px_rgba(61,46,35,.16)] sm:mt-6 sm:rounded-[28px]">
        <div className="relative h-[250px] overflow-hidden sm:h-[300px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/rooms/DSC07867-1-v2.webp" alt="Voulamandis House" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2d2119]/85 via-[#2d2119]/15 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-7 sm:left-7 sm:right-7">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-white/80">Voulamandis House · Κάμπος Χίου</div>
            <h1 className="mt-2 font-serif text-[33px] font-semibold leading-[1.04] sm:text-[42px]">Το προσωπικό σου Chios Trip Plan είναι σχεδόν έτοιμο.</h1>
          </div>
        </div>

        <div className="border-b border-[#e8dfd4] bg-[#4c3a2d] px-5 py-4 text-white sm:px-7">
          <div className="flex flex-wrap gap-2 text-[12px] font-bold sm:text-[13px]">
            <span className="rounded-full bg-white/10 px-3 py-1.5">🌿 Ήρεμος Κάμπος</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">🍊 Πρωινό στον κήπο</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">🎁 -10% direct</span>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#a17d58]">Ολοκλήρωση</p>
          <h2 className="mt-2 font-serif text-[32px] font-semibold leading-[1.05] sm:text-[40px]">Πάρε όλο το πρόγραμμα στο email σου</h2>
          <p className="mt-3 text-[15px] font-semibold leading-6 text-[#6c6158] sm:text-[16px]">
            Θα σου στείλουμε το πλήρες itinerary με ώρες, σωστή σειρά στάσεων, αποστάσεις, πρακτικά tips και αναλυτικές πληροφορίες για κάθε περιοχή που θα επισκεφθείς.
          </p>

          <div className="mt-6 rounded-[22px] border border-[#e3d9cc] bg-[#fbf9f5] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[13px] font-extrabold text-[#73675d]">Το πρόγραμμά σου</div>
                <div className="mt-1 text-[18px] font-extrabold">4 στάσεις · 1 ημέρα</div>
              </div>
              <span className="rounded-full bg-[#edf0e5] px-3 py-1.5 text-[12px] font-extrabold text-[#66704e]">Προσωπικό</span>
            </div>

            <div className="mt-4 space-y-2.5">
              {itinerary.slice(0, 3).map((stop) => (
                <div key={stop.time} className="grid grid-cols-[58px_1fr] gap-3 rounded-2xl bg-white p-3 shadow-[inset_0_0_0_1px_rgba(226,218,208,.9)]">
                  <div className="text-[13px] font-extrabold text-[#9b7957]">{stop.time}</div>
                  <div>
                    <div className="text-[14px] font-extrabold">{stop.title}</div>
                    <p className="mt-0.5 text-[12.5px] font-semibold leading-5 text-[#74685f]">{stop.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-center text-[12px] font-bold text-[#8a7c70]">+ περισσότερες λεπτομέρειες και πρακτικά tips στο email</div>
          </div>

          <label className="mt-6 block text-[14px] font-extrabold text-[#433831]" htmlFor="lead-email">Πού να σου στείλουμε το πλήρες πρόγραμμα;</label>
          <input id="lead-email" type="email" placeholder="name@example.com" className="mt-2 h-[58px] w-full rounded-2xl border border-[#cfc3b5] bg-white px-4 text-[17px] font-semibold outline-none transition placeholder:font-medium placeholder:text-[#a9a096] focus:border-[#87906c] focus:ring-4 focus:ring-[#87906c]/12" />

          <label className="mt-4 flex cursor-pointer gap-3 rounded-2xl border border-[#dfc7aa] bg-[#f8ecdc] p-4 shadow-sm">
            <input type="checkbox" className="mt-1 h-5 w-5 accent-[#7b674f]" />
            <span>
              <span className="block text-[14px] font-extrabold text-[#4a3e35]">Θέλω και προσωπική πρόταση διαμονής</span>
              <span className="mt-1 block text-[12.5px] font-semibold leading-5 text-[#807267]">Η reception μπορεί να σου στείλει διαθεσιμότητα και επιλογές που ταιριάζουν στις ημερομηνίες του ταξιδιού σου.</span>
            </span>
          </label>

          <button type="button" className="mt-5 flex min-h-[58px] w-full items-center justify-center rounded-2xl bg-[#7a835d] px-5 text-[16px] font-extrabold text-white shadow-[0_12px_28px_rgba(91,101,65,.22)] transition hover:bg-[#69734f]">
            Στείλε το πλήρες πρόγραμμά μου →
          </button>
          <p className="mt-3 text-center text-[11px] font-semibold leading-4 text-[#94887d]">Το email χρησιμοποιείται για την αποστολή του itinerary. Επικοινωνία για διαμονή μόνο αν το επιλέξεις.</p>

          <div className="my-7 h-px bg-[#e8dfd4]" />

          <div className="rounded-[24px] border border-[#ddd3c6] bg-[#fffdfa] p-5 sm:p-6">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#9b7957]">Μετά την αποστολή</p>
            <h3 className="mt-2 font-serif text-[28px] font-semibold leading-[1.08]">Έχεις ήδη κανονίσει τη διαμονή σου στη Χίο;</h3>
            <p className="mt-2 text-[14px] font-semibold leading-6 text-[#70645b]">Αν όχι, μπορείς να δεις ποιο δωμάτιο ταιριάζει στο ταξίδι σου ή να μιλήσεις απευθείας μαζί μας.</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" className="min-h-[56px] rounded-2xl bg-[#43362d] px-4 text-[15px] font-extrabold text-white shadow-sm">Δες διαθεσιμότητα · AI Room Finder</button>
              <button type="button" className="min-h-[56px] rounded-2xl border border-[#a7ae91] bg-[#f3f5ed] px-4 text-[15px] font-extrabold text-[#566044]">WhatsApp με τη reception</button>
            </div>
            <button type="button" className="mt-3 w-full py-2 text-[13px] font-extrabold text-[#7c6b5d]">Έχω ήδη κλείσει διαμονή</button>
          </div>
        </div>
      </section>
    </main>
  );
}
