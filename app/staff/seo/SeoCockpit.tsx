import CopySeoAdviceButton from "./CopySeoAdviceButton";
import SeoActionStatusButtons from "./SeoActionStatusButtons";

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

function verdictLabel(value?: string) {
  if (value === "healthy") return "Υγιής εικόνα";
  if (value === "action") return "Χρειάζεται ενέργεια";
  return "Παρακολούθηση";
}

function verdictClasses(value?: string) {
  if (value === "healthy") return "bg-emerald-100 text-emerald-900";
  if (value === "action") return "bg-red-100 text-red-900";
  return "bg-amber-100 text-amber-900";
}

function classificationLabel(value?: string) {
  if (value === "problem") return "SEO πρόβλημα";
  if (value === "opportunity") return "Ευκαιρία";
  if (value === "seasonality") return "Εποχικότητα";
  if (value === "cannibalization") return "Cannibalisation";
  return "Αναμονή / noise";
}

function lifecycleLabel(value?: string) {
  if (value === "new") return "Νέο";
  if (value === "persistent") return "Επιμένει";
  return "Παρακολούθηση";
}

function confidenceLabel(value?: string) {
  if (value === "high") return "Υψηλή βεβαιότητα";
  if (value === "medium") return "Μέτρια βεβαιότητα";
  return "Χαμηλή βεβαιότητα";
}

function impactLabel(value?: string) {
  if (value === "high") return "Υψηλό impact";
  if (value === "medium") return "Μεσαίο impact";
  return "Χαμηλό impact";
}

function statusLabel(status: string) {
  if (status === "implemented") return "Υλοποιήθηκε";
  if (status === "dismissed") return "Δεν θα γίνει";
  return "Προτεινόμενη";
}

function statusClasses(status: string) {
  if (status === "implemented") return "bg-emerald-100 text-emerald-900";
  if (status === "dismissed") return "bg-stone-200 text-stone-700";
  return "bg-amber-100 text-amber-900";
}

function moverScore(row: any) {
  return Math.abs(Number(row?.changes?.clicks || 0)) + Math.abs(Number(row?.changes?.position || 0)) * 12;
}

function topMovers(rows: any[], limit = 3) {
  return [...(rows || [])].sort((a, b) => moverScore(b) - moverScore(a)).slice(0, limit);
}

function changeText(value: number, inverse = false) {
  if (inverse) return `${value > 0 ? "+" : ""}${n(value, 1)} θέσεις`;
  return pct(value);
}

function Metric({ label, value, change, yoy, inverse = false }: { label: string; value: string; change: number; yoy?: number | null; inverse?: boolean }) {
  const good = inverse ? change <= 0 : change >= 0;
  return (
    <div className="min-w-0 py-5 sm:px-5 lg:px-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">{label}</p>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-3xl font-semibold tracking-tight text-[#332b25]">{value}</p>
        <span className={`text-sm font-semibold ${good ? "text-emerald-700" : "text-red-700"}`}>{changeText(change, inverse)}</span>
      </div>
      <p className="mt-1 text-xs text-[#8a755f]">28ημ. vs προηγούμενες{yoy == null ? "" : ` · YoY ${inverse ? changeText(yoy, true) : pct(yoy)}`}</p>
    </div>
  );
}

function RadarColumn({ title, items, type }: { title: string; items: any[]; type: "country" | "device" | "appearance" | "cannibalization" }) {
  return (
    <div className="min-w-0 py-5 sm:px-5 lg:px-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">{title}</p>
      <div className="mt-4 space-y-4">
        {items.length ? items.map((item, index) => {
          if (type === "cannibalization") {
            return (
              <div key={`${item.query}-${index}`}>
                <p className="break-words text-sm font-semibold text-[#332b25]">{item.query}</p>
                <p className="mt-1 text-xs leading-5 text-[#7a6b5d]">{n(item.pageCount)} URLs · {n(item.totalImpressions)} impressions</p>
              </div>
            );
          }
          const secondary = type === "device"
            ? `Clicks ${pct(item.changes.clicks)} · Impr. ${pct(item.changes.impressions)}`
            : type === "appearance"
              ? `Impr. ${pct(item.changes.impressions)} · CTR ${pct(item.changes.ctr)}`
              : `Clicks ${pct(item.changes.clicks)} · θέση ${item.changes.position > 0 ? "+" : ""}${n(item.changes.position, 1)}`;
          return (
            <div key={`${item.key}-${index}`}>
              <p className="break-words text-sm font-semibold capitalize text-[#332b25]">{item.label}</p>
              <p className="mt-1 text-xs leading-5 text-[#7a6b5d]">{secondary}</p>
            </div>
          );
        }) : <p className="text-sm text-[#8a755f]">Δεν υπάρχει ισχυρό signal.</p>}
      </div>
    </div>
  );
}

export default function SeoCockpit({ snapshot, history, sync, fallbackData, actions }: { snapshot: any; history: any[]; sync: any; fallbackData: any; actions: any[] }) {
  const data = snapshot?.payload || fallbackData || {};
  const interpretation = data?.aiInterpretation || null;
  const context = data?.analysisContext || null;
  const site = context?.site || null;
  const comparison = data?.snapshotComparison || {};
  const countries = topMovers(context?.countries || []);
  const devices = topMovers(context?.devices || [], 3);
  const appearances = topMovers(context?.searchAppearances || []);
  const cannibalization = (context?.cannibalization || []).slice(0, 3);
  const findings = Array.isArray(interpretation?.findings) ? interpretation.findings : [];
  const healthScore = Number.isFinite(Number(interpretation?.healthScore)) ? Number(interpretation.healthScore) : null;

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#3e342d]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="flex min-h-20 items-center justify-between border-b border-[#d8d0c5] py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a755f]">Voulamandis House · Staff</p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#332b25]">SEO Cockpit</h1>
          </div>
          <a href="/staff" className="text-sm font-semibold text-[#6f6051] underline decoration-[#c9bcab] underline-offset-4 hover:text-[#332b25]">Staff Area</a>
        </header>

        <section className="grid border-b border-[#d8d0c5] py-10 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12 lg:py-14">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${verdictClasses(interpretation?.verdict)}`}>{verdictLabel(interpretation?.verdict)}</span>
              <span className="text-xs font-medium text-[#8a755f]">Πλήρη GSC δεδομένα έως {context?.latestCompleteDate || data?.latestDate || "—"}</span>
            </div>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#2f2823] sm:text-4xl lg:text-[46px]">
              {interpretation?.headline || data?.status || "Περιμένουμε ολοκληρωμένη ανάλυση"}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#6e6156] sm:text-lg sm:leading-8">
              {interpretation?.executiveSummary || data?.summary || "Δεν υπάρχει ακόμη αποθηκευμένη ερμηνεία."}
            </p>
          </div>

          <div className="mt-8 border-t border-[#d8d0c5] pt-6 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">SEO health</p>
            <p className="mt-2 text-6xl font-semibold tracking-[-0.06em] text-[#332b25]">{healthScore == null ? "—" : healthScore}</p>
            <p className="mt-1 text-sm text-[#8a755f]">/ 100</p>
            <div className="mt-7 space-y-2 text-sm text-[#6e6156]">
              <p><strong className="text-[#332b25]">{n(snapshot?.newFindings ?? comparison?.newFindings)}</strong> νέα</p>
              <p><strong className="text-[#332b25]">{n(snapshot?.persistentFindings ?? comparison?.persistentFindings)}</strong> επιμένουν</p>
              <p><strong className="text-[#332b25]">{n(snapshot?.resolvedFindings ?? comparison?.resolvedFindings)}</strong> λύθηκαν</p>
            </div>
          </div>
        </section>

        {interpretation?.whatChanged && (
          <section className="grid border-b border-[#d8d0c5] py-7 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Από την προηγούμενη ανάλυση</p>
            <p className="max-w-4xl text-base leading-7 text-[#51463e]">{interpretation.whatChanged}</p>
          </section>
        )}

        {site && (
          <section className="grid border-b border-[#d8d0c5] sm:grid-cols-2 sm:divide-x sm:divide-[#d8d0c5] lg:grid-cols-4">
            <Metric label="Organic clicks" value={n(site.current.clicks)} change={site.changes.clicks} yoy={site.yoy?.clicks} />
            <Metric label="Impressions" value={n(site.current.impressions)} change={site.changes.impressions} yoy={site.yoy?.impressions} />
            <Metric label="CTR" value={`${n(site.current.ctr * 100, 2)}%`} change={site.changes.ctr} yoy={site.yoy?.ctr} />
            <Metric label="Μέση θέση" value={n(site.current.position, 1)} change={site.changes.position} yoy={site.yoy?.position} inverse />
          </section>
        )}

        <section className="grid border-b border-[#d8d0c5] py-9 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Απόφαση</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#332b25]">Τι κάνουμε τώρα</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="text-xl font-semibold leading-8 text-[#332b25]">{interpretation?.primaryAction || "Περιμένουμε την επόμενη ολοκληρωμένη ερμηνεία."}</p>
              {interpretation?.nextReviewFocus && <p className="mt-4 text-sm leading-6 text-[#77695e]">Επόμενος έλεγχος: {interpretation.nextReviewFocus}</p>}
            </div>
            <div className="lg:border-l lg:border-[#d8d0c5] lg:pl-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Δεν πειράζουμε</p>
              <p className="mt-3 text-sm leading-7 text-[#62574e]">{interpretation?.doNotDo || "Δεν κάνουμε μαζικές SEO αλλαγές χωρίς επιβεβαιωμένο signal."}</p>
            </div>
          </div>
        </section>

        <section className="border-b border-[#d8d0c5] py-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Προτεραιότητες</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#332b25]">Ό,τι αξίζει απόφαση</h2>
            </div>
            <p className="text-sm text-[#8a755f]">{findings.length} ενεργά findings</p>
          </div>

          <div className="mt-7">
            {findings.length ? findings.map((finding: any, index: number) => (
              <article key={`${finding.title}-${index}`} className="grid border-t border-[#d8d0c5] py-7 first:border-t-0 first:pt-0 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
                <div className="space-y-2">
                  <p className="text-4xl font-semibold tracking-[-0.05em] text-[#d1c6b7]">{String(index + 1).padStart(2, "0")}</p>
                  <p className="text-xs font-semibold text-[#6f6051]">{classificationLabel(finding.classification)}</p>
                  <p className="text-xs text-[#8a755f]">{impactLabel(finding.impact)}</p>
                  <p className="text-xs text-[#8a755f]">{lifecycleLabel(finding.lifecycle)} · {confidenceLabel(finding.confidence)}</p>
                </div>

                <div className="min-w-0">
                  <h3 className="text-xl font-semibold leading-8 text-[#332b25] sm:text-2xl">{finding.title}</h3>
                  {finding.scopeLabel && <p className="mt-1 break-words text-xs text-[#8a755f]">{finding.scopeLabel}</p>}

                  <div className="mt-5 grid gap-6 lg:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a755f]">Τι σημαίνει</p>
                      <p className="mt-2 text-sm leading-7 text-[#51463e]">{finding.meaning}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a755f]">Πιθανότερη αιτία</p>
                      <p className="mt-2 text-sm leading-7 text-[#51463e]">{finding.likelyCause}</p>
                    </div>
                  </div>

                  <div className="mt-6 border-l-2 border-[#9d856a] pl-4 sm:pl-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a755f]">Απόφαση</p>
                    <p className="mt-2 text-base font-semibold leading-7 text-[#332b25]">{finding.action}</p>
                    {finding.doNotDo && <p className="mt-2 text-sm leading-6 text-[#77695e]">Όχι τώρα: {finding.doNotDo}</p>}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs leading-5 text-[#77695e]">
                    <span>Μετράμε: {finding.trackingMetric || "—"}</span>
                    <span>Επανέλεγχος: {n(finding.reviewInDays)} ημέρες</span>
                  </div>
                  {finding.evidence && <p className="mt-3 text-xs leading-5 text-[#8a755f]">Evidence: {finding.evidence}</p>}
                </div>
              </article>
            )) : <p className="border-t border-[#d8d0c5] py-7 text-sm text-[#77695e]">Δεν υπάρχει αυτή τη στιγμή finding που να απαιτεί απόφαση.</p>}
          </div>
        </section>

        <section className="border-b border-[#d8d0c5] py-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Radar</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-semibold tracking-tight text-[#332b25]">Πού μετακινείται η εικόνα</h2>
            <p className="text-sm text-[#8a755f]">Αγορές, συσκευές, SERP και overlap</p>
          </div>
          <div className="mt-6 grid border-y border-[#d8d0c5] sm:grid-cols-2 sm:divide-x sm:divide-[#d8d0c5] xl:grid-cols-4">
            <RadarColumn title="Χώρες" items={countries} type="country" />
            <RadarColumn title="Συσκευές" items={devices} type="device" />
            <RadarColumn title="SERP appearance" items={appearances} type="appearance" />
            <RadarColumn title="Cannibalisation" items={cannibalization} type="cannibalization" />
          </div>
        </section>

        <section className="border-b border-[#d8d0c5] py-10">
          <div className="grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Action tracker</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#332b25]">Τι προτείναμε και τι έγινε</h2>
            </div>
            <div className="mt-6 lg:mt-0">
              {actions.length ? actions.map((action: any, index: number) => (
                <article key={action.actionKey} className="border-t border-[#d8d0c5] py-6 first:border-t-0 first:pt-0">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses(action.status)}`}>{statusLabel(action.status)}</span>
                        <span className="text-xs text-[#8a755f]">{action.analysisDate}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold leading-7 text-[#332b25]">{action.title}</h3>
                      {action.scopeLabel && <p className="mt-1 break-words text-xs text-[#8a755f]">{action.scopeLabel}</p>}
                      <p className="mt-3 text-sm leading-7 text-[#51463e]">{action.actionText}</p>
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#77695e]">
                        <span>Μετράμε: {action.trackingMetric || "—"}</span>
                        <span>Review: {action.reviewInDays} ημέρες</span>
                        {action.implementedAt && <span>Υλοποίηση: {dateTime(action.implementedAt)}</span>}
                      </div>
                    </div>
                    <div className="shrink-0 xl:pt-1">
                      <SeoActionStatusButtons actionKey={action.actionKey} status={action.status} />
                    </div>
                  </div>
                </article>
              )) : <p className="text-sm text-[#77695e]">Δεν υπάρχουν ακόμη αποθηκευμένες SEO ενέργειες.</p>}
            </div>
          </div>
        </section>

        <section className="border-b border-[#d8d0c5] py-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Μνήμη</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#332b25]">Προηγούμενες αποφάσεις</h2>
          <div className="mt-6 divide-y divide-[#d8d0c5] border-y border-[#d8d0c5]">
            {(history || []).slice(0, 4).map((item: any) => (
              <div key={item.analysisDate} className="grid gap-2 py-4 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-center sm:gap-6">
                <p className="text-xs font-semibold text-[#8a755f]">{item.analysisDate}</p>
                <p className="text-sm font-semibold leading-6 text-[#40362f]">{item.payload?.aiInterpretation?.headline || "Χωρίς ερμηνεία"}</p>
                <p className="text-xs text-[#77695e]">Score {n(item.payload?.aiInterpretation?.healthScore)} · +{n(item.newFindings)} / −{n(item.resolvedFindings)}</p>
              </div>
            ))}
          </div>
        </section>

        <details className="border-b border-[#d8d0c5] py-7">
          <summary className="cursor-pointer list-none text-sm font-semibold text-[#51463e]">Τεχνικές λεπτομέρειες και rule-based findings <span className="ml-2 text-[#9a8b7c]">+</span></summary>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-[#77695e]">{data?.architectureNote || ""}</p>
          <div className="mt-5 divide-y divide-[#d8d0c5] border-y border-[#d8d0c5]">
            {(data?.priorities || []).map((item: any, index: number) => (
              <article key={`${item.title}-${index}`} className="py-5">
                <h3 className="font-semibold text-[#332b25]">{item.title}</h3>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-[#51463e]">{item.diagnosis || item.explanation}</p>
                <p className="mt-2 max-w-4xl text-sm font-medium leading-6 text-[#40362f]">{item.action}</p>
                {(item.page || item.query) && <p className="mt-2 text-xs text-[#8a755f]">{item.query ? `Query: ${item.query}` : ""}{item.query && item.page ? " · " : ""}{item.page ? `Σελίδα: ${path(item.page)}` : ""}</p>}
                <div className="mt-3">
                  <CopySeoAdviceButton title={item.title} explanation={item.explanation} diagnosis={item.diagnosis} action={item.action} evidence={item.evidence} page={item.page} query={item.query} queryBreakdown={item.queryBreakdown} queryBreakdownTitle={item.queryBreakdownTitle} queryBreakdownNote={item.queryBreakdownNote} />
                </div>
              </article>
            ))}
          </div>
        </details>

        <footer className="flex flex-col gap-2 py-7 text-xs text-[#77695e] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <span>GSC sync: {dateTime(sync?.completedAt || sync?.startedAt)}</span>
            <span>AI απόφαση: {snapshot ? dateTime(snapshot.analyzedAt) : "δεν έχει εκτελεστεί"}</span>
            <span>Ανάλυση κάθε 3 ημέρες</span>
          </div>
          <span className={`font-semibold ${sync?.status === "success" ? "text-emerald-700" : "text-red-700"}`}>{sync?.status === "success" ? "● Δεδομένα ενημερωμένα" : "● Χρειάζεται έλεγχος sync"}</span>
        </footer>
      </div>
    </main>
  );
}
