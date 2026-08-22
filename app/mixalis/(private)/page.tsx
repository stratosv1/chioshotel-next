import Link from "next/link";

const cards = [
  {
    title: "Κεφάλαια",
    description: "Δημιούργησε και οργάνωσε τα κεφάλαια που θα εξελίσσονται μάθημα-μάθημα.",
    href: "/mixalis/chapters/new",
    action: "+ Νέο κεφάλαιο",
  },
  {
    title: "Τεστ κατανόησης",
    description: "Τα tests θα δημιουργούνται από τη θεωρία και θα προσαρμόζονται στην πρόοδό σου.",
    href: null,
    action: "Phase 5",
  },
  {
    title: "Ρώτα τον καθηγητή",
    description: "Ο AI καθηγητής θα γνωρίζει το τρέχον κεφάλαιο, τις πηγές και τα σημεία που χρειάζονται ενίσχυση.",
    href: null,
    action: "Phase 6",
  },
];

export default function MixalisDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
              Physics Workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Καλημέρα, Μιχάλη
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b625b] sm:text-base">
              Εδώ θα χτίζονται τα κεφάλαια της Φυσικής σταδιακά, μαζί με το υλικό, τις ασκήσεις και τα tests κατανόησης.
            </p>
          </div>

          <form action="/mixalis/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-[#f7f4ef]"
            >
              Αποσύνδεση
            </button>
          </form>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-[#ded4c7] p-5">
            <p className="text-sm text-[#64584e]">Κεφάλαια</p>
            <p className="mt-2 text-3xl font-semibold">0</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="text-sm text-[#736a63]">Υλικό</p>
            <p className="mt-2 text-3xl font-semibold">0</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="text-sm text-[#736a63]">Τελευταία ενημέρωση</p>
            <p className="mt-2 text-lg font-semibold">Δεν υπάρχει ακόμη</p>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
                Ο χώρος σου
              </p>
              <h2 className="mt-1 text-2xl font-semibold">Ξεκίνα από ένα κεφάλαιο</h2>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {cards.map((card) => (
              <article
                key={card.title}
                className="flex min-h-56 flex-col rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold">{card.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-[#6f665f]">
                  {card.description}
                </p>
                {card.href ? (
                  <Link
                    href={card.href}
                    className="mt-6 inline-flex w-fit rounded-xl bg-[#403630] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f2824]"
                  >
                    {card.action}
                  </Link>
                ) : (
                  <span className="mt-6 inline-flex w-fit rounded-xl bg-[#f1ede7] px-4 py-2.5 text-sm font-medium text-[#8a817a]">
                    {card.action}
                  </span>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
