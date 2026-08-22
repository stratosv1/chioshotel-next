import Link from "next/link";

export default function NewMixalisChapterPage() {
  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/mixalis"
          className="mb-5 inline-flex text-sm font-medium text-[#6e5d50] hover:underline"
        >
          ← Πίσω στον χώρο μελέτης
        </Link>

        <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
            Νέο κεφάλαιο
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Δημιουργία κεφαλαίου Φυσικής
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b625b] sm:text-base">
            Το κεφάλαιο θα λειτουργεί ως ζωντανός φάκελος. Αργότερα θα μπορείς να προσθέτεις νέο υλικό από κάθε μάθημα χωρίς να χάνεται το προηγούμενο.
          </p>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Τίτλος κεφαλαίου</span>
              <input
                type="text"
                placeholder="π.χ. Ευθύγραμμη κίνηση"
                disabled
                className="w-full rounded-2xl border border-black/15 bg-[#f7f5f2] px-4 py-3 text-base text-[#827970]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Σημείωση</span>
              <textarea
                rows={4}
                placeholder="π.χ. Κεφάλαιο 1 από το σχολικό βιβλίο"
                disabled
                className="w-full resize-none rounded-2xl border border-black/15 bg-[#f7f5f2] px-4 py-3 text-base text-[#827970]"
              />
            </label>
          </div>

          <div className="mt-7 rounded-2xl border border-[#d8cbbb] bg-[#f7f2eb] px-4 py-4 text-sm leading-6 text-[#675a50]">
            Η φόρμα είναι έτοιμη ως skeleton. Η πραγματική αποθήκευση κεφαλαίων θα ενεργοποιηθεί στο επόμενο βήμα, μαζί με το απομονωμένο schema <strong>physics</strong> στη Neon.
          </div>

          <button
            type="button"
            disabled
            className="mt-6 rounded-xl bg-[#403630] px-5 py-3 text-sm font-semibold text-white opacity-45"
          >
            Δημιουργία κεφαλαίου
          </button>
        </section>
      </div>
    </main>
  );
}
