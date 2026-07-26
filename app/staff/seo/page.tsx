import type { Metadata } from "next";
import { getSeoAdvisorData } from "@/lib/gsc/advisor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SEO Advisor | Voulamandis House",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

function n(value: unknown, digits = 0) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("el-GR", { maximumFractionDigits: digits }).format(number);
}

function pct(value: unknown) {
  const number = Number(value || 0);
  return `${number > 0 ? "+" : ""}${n(number, 1)}%`;
}

function dateTime(value: unknown) {
  if (!value) return "—";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime())
    ? String(value)
    : new Intl.DateTimeFormat("el-GR", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Europe/Athens",
      }).format(date);
}

function path(value?: string) {
  if (!value) return "";
  return value.replace(/^https?:\/\/[^/]+/, "") || "/";
}

function toneClasses(tone: "good" | "neutral" | "attention") {
  if (tone === "good") return "border-emerald-200 bg-emerald-50 text-emerald-950";
  if (tone === "attention") return "border-amber-200 bg-amber-50 text-amber-950";
  return "border-[#ddcfba] bg-white text-[#44372d]";
}

function severityLabel(severity: "high" | "medium" | "low") {
  if (severity === "high") return "Προτεραιότητα";
  if (severity === "medium") return "Ευκαιρία";
  return "Παρακολούθηση";
}

function severityClasses(severity: "high" | "medium" | "low") {
  if (severity === "high") return "bg-red-50 text-red-800 border-red-200";
  if (severity === "medium") return "bg-amber-50 text-amber-800 border-amber-200";
  return "bg-emerald-50 text-emerald-800 border-emerald-200";
}

export default async function SeoAdvisorPage() {
  const data = await getSeoAdvisorData();
  const current = data.current;
  const previous = data.previous;
  const changes = "changes" in data ? data.changes : null;
  const sync = data.sync as any;

  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#44372d]">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
        <header className="rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a755f]">Voulamandis House · Staff</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">SEO Advisor</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#746454]">
                Δεν είναι αντίγραφο του Google Search Console. Διαβάζει τα δεδομένα και τα μετατρέπει σε αποφάσεις: τι χρειάζεται διόρθωση, τι αξίζει να κάνουμε μετά και ποια είναι η πραγματική εικόνα του site.
              </p>
            </div>
            <a href="/staff" className="inline-flex w-fit items-center rounded-full border border-[#cdbda7] px-4 py-2 text-sm font-medium hover:bg-[#f4ede3]">← Staff Area</a>
          </div>
        </header>

        <section className={`mt-5 rounded-3xl border p-5 shadow-sm sm:p-7 ${toneClasses(data.statusTone)}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">1. Κατάσταση site</p>
          <h2 className="mt-2 text-2xl font-semibold">{data.status}</h2>
          <p className="mt-3 max-w-4xl text-base leading-7">{data.summary}</p>
          <p className="mt-4 text-sm opacity-70">Δεδομένα έως {data.latestDate || "—"}. Η αξιολόγηση συγκρίνει τις τελευταίες 28 ημέρες με τις προηγούμενες 28.</p>
        </section>

        {current && previous && changes && (
          <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Clicks" value={n(current.clicks)} change={pct(changes.clicks)} />
            <Metric label="Impressions" value={n(current.impressions)} change={pct(changes.impressions)} />
            <Metric label="CTR" value={`${n(current.ctr * 100, 2)}%`} change={pct(changes.ctr)} />
            <Metric label="Μέση θέση" value={n(current.position, 1)} change={changes.position === 0 ? "σταθερή" : `${changes.position > 0 ? "+" : ""}${n(changes.position, 1)} θέσεις`} inverse />
          </section>
        )}

        <section className="mt-5 rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm sm:p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a755f]">2. Τι πρέπει να διορθώσουμε</p>
            <h2 className="mt-2 text-2xl font-semibold">Προτεραιότητες με εξήγηση</h2>
            <p className="mt-2 text-sm leading-6 text-[#746454]">Δεν προτείνουμε αλλαγές επειδή ένας αριθμός φαίνεται μικρός. Προτεραιότητα παίρνουν μόνο περιπτώσεις με αρκετά δεδομένα και πρακτική επίδραση.</p>
          </div>

          <div className="mt-5 space-y-4">
            {data.priorities.map((item, index) => (
              <article key={`${item.title}-${index}`} className="rounded-2xl border border-[#e8dccb] bg-[#fcfaf6] p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${severityClasses(item.severity)}`}>{severityLabel(item.severity)}</span>
                  <span className="text-xs text-[#8a755f]">#{index + 1}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#625446]">{item.explanation}</p>
                <div className="mt-4 rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8a755f]">Τι κάνουμε</p>
                  <p className="mt-1 text-sm leading-6 font-medium">{item.action}</p>
                </div>
                <p className="mt-3 text-xs leading-5 text-[#8a755f]">Γιατί το λέμε: {item.evidence}</p>
                {(item.page || item.query) && (
                  <p className="mt-2 text-xs text-[#8a755f]">
                    {item.query ? `Query: ${item.query}` : ""}{item.query && item.page ? " · " : ""}{item.page ? `Σελίδα: ${path(item.page)}` : ""}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a755f]">3. Τι κάνουμε για να βελτιωθούν οι δείκτες</p>
          <h2 className="mt-2 text-2xl font-semibold">Τρόπος δουλειάς</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Step number="01" title="Επιλέγουμε μία ευκαιρία" text="Δεν πειράζουμε δεκάδες σελίδες μαζί. Επιλέγουμε εκεί που υπάρχει πραγματική ζήτηση ή πτώση." />
            <Step number="02" title="Κάνουμε συγκεκριμένη αλλαγή" text="Title, περιεχόμενο, internal links ή δομή — ανάλογα με το πρόβλημα που δείχνουν query, θέση και CTR." />
            <Step number="03" title="Μετράμε πριν ξαναλλάξουμε" text="Δίνουμε χρόνο στη Google και συγκρίνουμε επόμενη περίοδο. Έτσι ξέρουμε αν η αλλαγή βοήθησε ή όχι." />
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Αξιοπιστία δεδομένων</p>
              <p className="mt-1 text-sm text-[#746454]">
                Τελευταίο sync: {dateTime(sync?.completed_at || sync?.started_at)} · {sync?.status || "—"}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${sync?.status === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
              {sync?.status === "success" ? "Δεδομένα ενημερωμένα" : "Χρειάζεται έλεγχος sync"}
            </span>
          </div>
          {sync?.error_message && <p className="mt-3 text-xs leading-5 text-amber-800">Σημείωση sync: {String(sync.error_message)}</p>}
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, change, inverse = false }: { label: string; value: string; change: string; inverse?: boolean }) {
  const numeric = Number(change.replace("%", "").replace("+", ""));
  const good = Number.isFinite(numeric) ? (inverse ? numeric <= 0 : numeric >= 0) : true;
  return (
    <div className="rounded-3xl border border-[#ddcfba] bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#8a755f]">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className={`mt-1 text-sm font-medium ${good ? "text-emerald-700" : "text-red-700"}`}>{change}</p>
      <p className="mt-1 text-xs text-[#8a755f]">έναντι προηγούμενων 28 ημερών</p>
    </div>
  );
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-[#faf7f1] p-4">
      <p className="text-xs font-semibold tracking-[0.18em] text-[#8a755f]">{number}</p>
      <h3 className="mt-2 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#746454]">{text}</p>
    </div>
  );
}
