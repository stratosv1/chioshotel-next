import SeoActionStatusButtons from "./SeoActionStatusButtons";

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

function statusLabel(status: string) {
  if (status === "implemented") return "Υλοποιήθηκε";
  if (status === "dismissed") return "Δεν θα γίνει";
  return "Προτεινόμενη";
}

function statusClasses(status: string) {
  if (status === "implemented") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (status === "dismissed") return "border-[#e4d7c4] bg-[#faf7f1] text-[#8a755f]";
  return "border-amber-200 bg-amber-50 text-amber-800";
}

export default function SeoActionTrackerPanel({ actions }: { actions: any[] }) {
  return (
    <div className="bg-[#f7f2e9] pb-8 text-[#44372d]">
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a755f]">Action tracker</p>
          <h2 className="mt-2 text-2xl font-semibold">Τι προτείναμε και τι υλοποιήθηκε</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[#746454]">Ο Advisor δεν θεωρεί ότι μια αλλαγή έγινε απλώς επειδή την πρότεινε. Εδώ σημειώνεται η πραγματική κατάσταση ώστε οι επόμενες αναλύσεις να μπορούν να μετρούν το αποτέλεσμα της υλοποιημένης ενέργειας.</p>

          <div className="mt-5 space-y-3">
            {actions.length ? actions.map((action: any) => (
              <article key={action.actionKey} className="rounded-2xl border border-[#e4d7c4] bg-[#fcfaf6] p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(action.status)}`}>{statusLabel(action.status)}</span>
                      <span className="text-xs text-[#8a755f]">Από ανάλυση {action.analysisDate}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold">{action.title}</h3>
                    {action.scopeLabel && <p className="mt-1 break-words text-xs text-[#8a755f]">Scope: {action.scopeLabel}</p>}
                    <p className="mt-3 text-sm font-medium leading-6">{action.actionText}</p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#746454]">
                      <span>Μετράμε: {action.trackingMetric || "—"}</span>
                      <span>Review window: {action.reviewInDays} ημέρες</span>
                      {action.implementedAt && <span>Υλοποίηση: {dateTime(action.implementedAt)}</span>}
                    </div>
                  </div>
                  <SeoActionStatusButtons actionKey={action.actionKey} status={action.status} />
                </div>
              </article>
            )) : (
              <p className="rounded-2xl bg-[#faf7f1] p-4 text-sm text-[#746454]">Δεν υπάρχουν ακόμη αποθηκευμένες SEO ενέργειες. Θα δημιουργηθούν από την επόμενη ολοκληρωμένη AI ανάλυση.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
