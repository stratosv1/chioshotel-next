import Link from "next/link";

export default async function NewMixalisChapterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

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
            Δημιούργησε πρώτα τον φάκελο του κεφαλαίου. Μετά θα προσθέτεις ξεχωριστά το υλικό από κάθε μάθημα.
          </p>

          {error ? (
            <div className="mt-6 rounded-2xl border border-[#d9b4a6] bg-[#fbf1ed] px-4 py-3 text-sm text-[#7a4938]">
              {error === "title"
                ? "Ο τίτλος πρέπει να έχει από 2 έως 160 χαρακτήρες."
                : "Η σημείωση είναι πολύ μεγάλη."}
            </div>
          ) : null}

          <form action="/mixalis/api/chapters" method="post" className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Τίτλος κεφαλαίου</span>
              <input
                name="title"
                type="text"
                required
                minLength={2}
                maxLength={160}
                placeholder="π.χ. Ευθύγραμμη κίνηση"
                className="w-full rounded-2xl border border-black/15 bg-[#fbfaf8] px-4 py-3 text-base outline-none transition focus:border-[#725f4e] focus:ring-4 focus:ring-[#725f4e]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Σημείωση</span>
              <textarea
                name="note"
                rows={4}
                maxLength={1000}
                placeholder="π.χ. Κεφάλαιο 1 από το σχολικό βιβλίο"
                className="w-full resize-none rounded-2xl border border-black/15 bg-[#fbfaf8] px-4 py-3 text-base outline-none transition focus:border-[#725f4e] focus:ring-4 focus:ring-[#725f4e]/10"
              />
            </label>

            <div className="rounded-2xl border border-[#d8cbbb] bg-[#f7f2eb] px-4 py-4 text-sm leading-6 text-[#675a50]">
              Το κεφάλαιο αποθηκεύεται στη Neon και παραμένει «ζωντανό»: μπορεί να δεχτεί πολλές προσθήκες υλικού σε διαφορετικά μαθήματα.
            </div>

            <button
              type="submit"
              className="rounded-xl bg-[#403630] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2f2824]"
            >
              Δημιουργία κεφαλαίου
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
