import { redirect } from "next/navigation";
import { getMixalisSession, isMixalisAuthConfigured } from "@/lib/mixalis/auth";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  credentials: "Το όνομα χρήστη ή ο κωδικός δεν είναι σωστός.",
  configuration: "Η ιδιωτική πρόσβαση δεν έχει ρυθμιστεί ακόμη στο περιβάλλον της εφαρμογής.",
};

export default async function MixalisLoginPage({ searchParams }: LoginPageProps) {
  const session = await getMixalisSession();
  if (session) {
    redirect("/mixalis");
  }

  const params = await searchParams;
  const errorMessage = params.error ? errorMessages[params.error] : null;
  const configured = isMixalisAuthConfigured();

  return (
    <main className="min-h-screen bg-[#f5f1ea] px-5 py-10 text-[#2d2926] sm:px-8">
      <div className="mx-auto flex min-h-[78vh] max-w-md items-center">
        <section className="w-full rounded-3xl border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(72,58,45,0.10)] sm:p-8">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#806f60]">
              Physics Workspace
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#25211e]">
              Χώρος μελέτης Μιχάλη
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#6b625b]">
              Ιδιωτικός χώρος για κεφάλαια Φυσικής, υλικό, tests και τον προσωπικό AI καθηγητή.
            </p>
          </div>

          {errorMessage ? (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-800">
              {errorMessage}
            </div>
          ) : null}

          <form action="/mixalis/auth/login" method="post" className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Όνομα χρήστη</span>
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
                defaultValue="mixalis"
                className="w-full rounded-2xl border border-black/15 bg-[#fbfaf8] px-4 py-3 text-base outline-none transition focus:border-[#725f4e] focus:ring-4 focus:ring-[#725f4e]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Κωδικός</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-2xl border border-black/15 bg-[#fbfaf8] px-4 py-3 text-base outline-none transition focus:border-[#725f4e] focus:ring-4 focus:ring-[#725f4e]/10"
              />
            </label>

            <button
              type="submit"
              disabled={!configured}
              className="w-full rounded-2xl bg-[#3e352f] px-5 py-3.5 text-base font-semibold text-white transition hover:bg-[#2f2823] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Είσοδος
            </button>
          </form>

          <p className="mt-6 text-xs leading-5 text-[#847b74]">
            Η πρόσβαση είναι προσωπική και η σελίδα δεν προορίζεται για δημόσια ευρετηρίαση.
          </p>
        </section>
      </div>
    </main>
  );
}
