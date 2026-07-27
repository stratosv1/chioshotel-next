import type { Metadata } from "next";
import { getSeoAdvisorWithIntentData } from "@/lib/gsc/advisor-intents";
import CopySeoAdviceButton from "./CopySeoAdviceButton";

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
  const data = await getSeoAdvisorWithIntentData();
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
                Διαβάζει τα πραγματικά δεδομένα Google Search Console και τα ελέγχει πλέον απέναντι στο commercial intent map #1–#9, ώστε να ξεχωρίζει πραγματικές ευκαιρίες από cannibalisation ή λάθος owner.
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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a755f]">2. SEO αρχιτεκτονική</p>
          <h2 className="mt-2 text-2xl font-semibold">Owners #1–#9 που δεν πρέπει να κανιβαλίζονται</h2>
          <p className="mt-2 text-sm leading-6 text-[#746454]">{data.architectureNote}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {data.architecture.map((audit) => (
              <article key={audit.audit} className="rounded-2xl border border-[#e8dccb] bg-[#fcfaf6] p-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-[#44372d] px-2 text-sm font-semibold text-white">#{audit.audit}</span>
                  <div className="min-w-0">
                    <h3 className="font-semibold">{audit.label}</h3>
                    <p className="mt-1 text-xs text-[#8a755f]">
                      {audit.strategy === "split-owner" ? "Δύο ξεχωριστά transactional intents" : audit.strategy === "shared-owner" ? "Μοιράζεται σκόπιμα owner" : "Ένας owner ανά γλώσσα"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {audit.owners.map((owner) => (
                    <div key={owner.key} className="rounded-xl bg-white p-3">
                      <p className="text-sm font-semibold">{owner.label}</p>
                      <p className="mt-1 break-all text-xs text-[#6f6051]">EL owner: {owner.path}</p>
                      {owner.note && <p className="mt-1 text-xs leading-5 text-[#8a755f]">{owner.note}</p>}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm sm:p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a755f]">3. Τι πρέπει να διορθώσουμε</p>
            <h2 className="mt-2 text-2xl font-semibold">Προτεραιότητες με owner-aware διάγνωση</h2>
            <p className="mt-2 text-sm leading-6 text-[#746454]">Δεν προτείνουμε αλλαγές επειδή ένας αριθμός φαίνεται μικρός. Προτεραιότητα παίρνουν μόνο περιπτώσεις με αρκετά δεδομένα, και πριν από κάθε αλλαγή ελέγχουμε ποια σελίδα έχει οριστεί ως owner του intent.</p>
          </div>

          <div className="mt-5 space-y-4">
            {data.priorities.map((item, index) => (
              <article key={`${item.title}-${index}`} className="rounded-2xl border border-[#e8dccb] bg-[#fcfaf6] p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${severityClasses(item.severity)}`}>{severityLabel(item.severity)}</span>
                  <span className="text-xs text-[#8a755f]">#{index + 1}</span>
                  {item.intent && (
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${item.intent.isOwner ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
                      Audit #{item.intent.audit} · {item.intent.isOwner ? "σωστός owner" : "πιθανό intent drift"}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#625446]">{item.explanation}</p>

                {item.intent && (
                  <div className="mt-4 rounded-2xl border border-[#d9ccb9] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#8a755f]">Intent ownership</p>
                    <p className="mt-1 text-sm font-semibold">#{item.intent.audit} · {item.intent.targetLabel}</p>
                    <p className="mt-1 break-all text-xs leading-5 text-[#6f6051]">Owner: {item.intent.ownerPath}</p>
                    {!item.intent.isOwner && <p className="mt-1 break-all text-xs leading-5 text-amber-800">Τώρα εμφανίζεται: {item.intent.pagePath}</p>}
                  </div>
                )}

                {item.diagnosis && (
                  <div className="mt-4 rounded-2xl border border-[#e5d8c6] bg-[#f7f2e9] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#8a755f]">Τι δείχνει πραγματικά το εύρημα</p>
                    <p className="mt-1 text-sm leading-6">{item.diagnosis}</p>
                  </div>
                )}

                {item.queryBreakdown && item.queryBreakdown.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-[#e8dccb] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#8a755f]">
                      {item.queryBreakdownTitle || "Queries που εξηγούν το εύρημα"}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#8a755f]">
                      {item.queryBreakdownNote || "Προηγούμενες 28 ημέρες → τελευταίες 28 ημέρες."}
                    </p>
                    <div className="mt-3 space-y-3">
                      {item.queryBreakdown.slice(0, 8).map((row) => (
                        <div key={row.query} className="rounded-xl bg-[#faf7f1] p-3">
                          <p className="break-words text-sm font-semibold">{row.query}</p>
                          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-[#6f6051] sm:grid-cols-4">
                            <span>Clicks {n(row.previousClicks)} → {n(row.currentClicks)}</span>
                            <span>Impr. {n(row.previousImpressions)} → {n(row.currentImpressions)}</span>
                            <span>Θέση {row.previousPosition > 0 ? n(row.previousPosition, 1) : "—"} → {row.currentPosition > 0 ? n(row.currentPosition, 1) : "—"}</span>
                            <span>CTR {n(row.previousCtr * 100, 2)}% → {n(row.currentCtr * 100, 2)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                <div className="mt-4 flex justify-end">
                  <CopySeoAdviceButton
                    title={item.title}
                    explanation={item.explanation}
                    diagnosis={item.diagnosis}
                    action={item.action}
                    evidence={item.evidence}
                    page={item.page}
                    query={item.query}
                    queryBreakdown={item.queryBreakdown}
                    queryBreakdownTitle={item.queryBreakdownTitle}
                    queryBreakdownNote={item.queryBreakdownNote}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a755f]">4. Τι κάνουμε για να βελτιωθούν οι δείκτες</p>
          <h2 className="mt-2 text-2xl font-semibold">Τρόπος δουλειάς</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Step number="01" title="Βρίσκουμε το intent και τον owner" text="Πριν πειράξουμε σελίδα, ελέγχουμε αν το query ανήκει ήδη σε κάποιο από τα #1–#9 και ποια localized σελίδα είναι ο owner." />
            <Step number="02" title="Κάνουμε μία συγκεκριμένη αλλαγή" text="Title, περιεχόμενο, internal links ή δομή — στη σωστή owner σελίδα και μόνο όταν τα δεδομένα δείχνουν πραγματικό πρόβλημα ή ευκαιρία." />
            <Step number="03" title="Μετράμε πριν ξαναλλάξουμε" text="Δίνουμε χρόνο στη Google και συγκρίνουμε την επόμενη περίοδο. Νέα landing δημιουργείται μόνο για νέο, αποδεδειγμένο intent χωρίς υπάρχον owner." />
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
