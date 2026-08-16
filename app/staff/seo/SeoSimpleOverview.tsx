function n(value: unknown, digits = 0) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("el-GR", { maximumFractionDigits: digits }).format(number);
}

function pct(value: unknown) {
  const number = Number(value || 0);
  return `${number > 0 ? "+" : ""}${n(number, 1)}%`;
}

function dateOnly(value: unknown) {
  if (!value) return "—";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("el-GR", {
    dateStyle: "medium",
    timeZone: "Europe/Athens",
  }).format(date);
}

function dateTime(value: unknown) {
  if (!value) return "—";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("el-GR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Athens",
  }).format(date);
}

function compact(value: unknown, max = 260) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/[\s,;:.-]+$/, "")}…`;
}

function normalizeScope(value: unknown) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "";
  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://chioshotel.gr${raw.startsWith("/") ? raw : `/${raw}`}`);
    return (url.pathname.replace(/\/+$/, "") || "/").toLowerCase();
  } catch {
    return raw.replace(/^https?:\/\/[^/]+/i, "").replace(/\/+$/, "") || "/";
  }
}

function verdictLabel(value?: string) {
  if (value === "healthy") return "Δεν χρειάζεται αλλαγή";
  if (value === "action") return "Χρειάζεται στοχευμένη ενέργεια";
  return "Παρακολούθηση";
}

function verdictClasses(value?: string) {
  if (value === "healthy") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (value === "action") return "border-amber-200 bg-amber-50 text-amber-950";
  return "border-sky-200 bg-sky-50 text-sky-950";
}

function impactWeight(value?: string) {
  if (value === "high") return 3;
  if (value === "medium") return 2;
  return 1;
}

function findingWeight(item: any) {
  const type = item?.classification === "problem" ? 10 : item?.classification === "opportunity" ? 5 : 0;
  return type + impactWeight(item?.impact);
}

function reviewDue(action: any) {
  if (action?.status !== "implemented" || !action?.implementedAt) return null;
  const implementedAt = new Date(action.implementedAt);
  if (Number.isNaN(implementedAt.getTime())) return null;
  implementedAt.setUTCDate(implementedAt.getUTCDate() + Math.max(3, Number(action?.reviewInDays || 14)));
  return implementedAt;
}

function Metric({ label, value, change, note }: { label: string; value: string; change?: number | null; note: string }) {
  const hasChange = change != null && Number.isFinite(Number(change));
  return (
    <div className="min-w-0 rounded-2xl border border-[#d8d0c5] bg-white p-4 sm:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a755f]">{label}</p>
      <div className="mt-2 flex flex-wrap items-baseline gap-2">
        <p className="text-2xl font-semibold tracking-tight text-[#332b25] sm:text-3xl">{value}</p>
        {hasChange && (
          <span className={`text-xs font-semibold ${Number(change) >= 0 ? "text-emerald-700" : "text-red-700"}`}>
            {pct(change)}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs leading-5 text-[#8a755f]">{note}</p>
    </div>
  );
}

function PriorityCard({ finding, index }: { finding: any; index: number }) {
  return (
    <article className="rounded-2xl border border-[#d8d0c5] bg-white p-5">
      <div className="flex items-start gap-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eee9e1] text-sm font-bold text-[#6f6051]">{index + 1}</span>
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${finding?.classification === "problem" ? "bg-red-100 text-red-900" : "bg-emerald-100 text-emerald-900"}`}>
              {finding?.classification === "problem" ? "Πρόβλημα" : "Ευκαιρία"}
            </span>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-700">
              {finding?.impact === "high" ? "Υψηλή προτεραιότητα" : "Μεσαία προτεραιότητα"}
            </span>
          </div>
          <h3 className="mt-3 text-lg font-semibold leading-7 text-[#332b25]">{finding?.title || "SEO ενέργεια"}</h3>
          {finding?.scopeLabel && <p className="mt-1 break-all text-xs text-[#8a755f]">{finding.scopeLabel}</p>}
          <p className="mt-3 text-sm leading-6 text-[#62574e]">{compact(finding?.meaning, 220)}</p>
          <div className="mt-4 border-l-2 border-[#9d856a] pl-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a755f]">Τι κάνουμε</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-[#40362f]">{compact(finding?.action, 300)}</p>
          </div>
          <p className="mt-3 text-xs leading-5 text-[#8a755f]">
            Επανέλεγχος σε {n(finding?.reviewInDays || 14)} ημέρες · Βεβαιότητα {finding?.confidence === "high" ? "υψηλή" : finding?.confidence === "medium" ? "μέτρια" : "χαμηλή"}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function SeoSimpleOverview({
  snapshot,
  fallbackData,
  analytics,
  health,
  managerMonitor,
  actions,
}: {
  snapshot: any;
  fallbackData: any;
  analytics: any;
  health: any;
  managerMonitor: any;
  actions: any[];
}) {
  const data = snapshot?.payload || fallbackData || {};
  const interpretation = data?.aiInterpretation || null;
  const context = data?.analysisContext || null;
  const gscSite = context?.site || null;
  const gscCurrent = gscSite?.current || data?.current || null;
  const gscChanges = gscSite?.changes || data?.changes || null;
  const gscYoy = gscSite?.yoy || data?.yearOverYear || null;
  const ga4Site = analytics?.site || null;
  const findings = Array.isArray(interpretation?.findings) ? interpretation.findings : [];
  const actionRows = Array.isArray(actions) ? actions : [];
  const now = new Date();

  function matchedAction(finding: any) {
    const scope = normalizeScope(finding?.scopeLabel);
    if (!scope) return null;
    return actionRows.find((action) => normalizeScope(action?.scopeLabel) === scope) || null;
  }

  const activeFindings = findings
    .filter((finding: any) => finding?.classification === "problem" || finding?.classification === "opportunity")
    .filter((finding: any) => !(finding?.classification === "opportunity" && String(finding?.scopeLabel || "").startsWith("device:")))
    .filter((finding: any) => {
      const action = matchedAction(finding);
      const due = reviewDue(action);
      if (action?.status === "implemented" && due && due > now) return false;
      return action?.status !== "dismissed";
    })
    .sort((a: any, b: any) => findingWeight(b) - findingWeight(a))
    .slice(0, 3);

  const measuringActions = actionRows
    .filter((action) => {
      const due = reviewDue(action);
      return Boolean(due && due > now);
    })
    .slice(0, 3);

  const criticalTechnical = Number(health?.latestRun?.criticalCount || 0);
  const latestGscDate = context?.latestCompleteDate || data?.latestDate || managerMonitor?.freshness?.latestGscDataDate || null;
  const latestGa4Date = analytics?.latestDate || null;
  const pageIndexingAt = managerMonitor?.freshness?.pageIndexing?.importedAt || null;
  const technicalAt = health?.latestRun?.completedAt || health?.latestRun?.startedAt || null;

  const verdict = interpretation?.verdict || (activeFindings.length ? "action" : "watch");
  const actionCount = activeFindings.length;

  return (
    <main className="bg-[#f7f5f0] text-[#3e342d]">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pb-12">
        <header className="flex min-h-16 items-center justify-between border-b border-[#d8d0c5] py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a755f]">Voulamandis House · Staff</p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#332b25]">SEO — απλή εικόνα</h1>
          </div>
          <a href="/staff" className="text-sm font-semibold text-[#6f6051] underline decoration-[#c9bcab] underline-offset-4">Staff Area</a>
        </header>

        <section className="py-8 lg:py-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${verdictClasses(verdict)}`}>{verdictLabel(verdict)}</span>
            <span className="text-xs font-medium text-[#8a755f]">{actionCount} {actionCount === 1 ? "ενέργεια" : "ενέργειες"} τώρα · {measuringActions.length} σε μέτρηση</span>
          </div>
          <h2 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#2f2823] sm:text-4xl">
            {interpretation?.headline || data?.status || "Περιμένουμε την επόμενη ολοκληρωμένη SEO ανάλυση"}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#6e6156]">
            Αυτή είναι η οθόνη που χρειάζεται να κοιτάς. Τα τεχνικά tables, exports και πλήρη diagnostics έχουν μεταφερθεί στα «Προχωρημένα» πιο κάτω.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Clicks από Google"
            value={gscCurrent ? n(gscCurrent.clicks) : "—"}
            change={gscChanges?.clicks}
            note={gscYoy?.clicks == null ? "τελευταίες 28 ημέρες" : `28 ημέρες · YoY ${pct(gscYoy.clicks)}`}
          />
          <Metric
            label="Εμφανίσεις Google"
            value={gscCurrent ? n(gscCurrent.impressions) : "—"}
            change={gscChanges?.impressions}
            note="τελευταίες 28 ημέρες"
          />
          <Metric
            label="Organic sessions"
            value={ga4Site ? n(ga4Site.current.sessions) : "—"}
            change={ga4Site?.changes?.sessions}
            note={ga4Site ? "μετά το click από Organic Search" : "GA4: αναμονή πρώτου επιτυχούς sync"}
          />
          <Metric
            label="Engagement"
            value={ga4Site ? `${n(ga4Site.current.engagementRate * 100, 1)}%` : "—"}
            change={ga4Site?.changes?.engagementRate}
            note={criticalTechnical ? `${criticalTechnical} critical technical θέματα` : "0 critical technical θέματα"}
          />
        </section>

        <section className="mt-9 grid gap-7 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)]">
          <div>
            <div className="flex items-end justify-between gap-4 border-b border-[#d8d0c5] pb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Προτεραιότητες</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#332b25]">Τι κάνουμε τώρα</h2>
              </div>
              <p className="text-xs text-[#8a755f]">μέχρι 3 ενέργειες</p>
            </div>
            <div className="mt-4 space-y-4">
              {activeFindings.length ? activeFindings.map((finding: any, index: number) => (
                <PriorityCard key={`${finding?.scopeLabel || finding?.title}-${index}`} finding={finding} index={index} />
              )) : (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-950">
                  Δεν υπάρχει αυτή τη στιγμή νέα SEO αλλαγή που να χρειάζεται να κάνεις. Συνεχίζουμε μέτρηση.
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-[#d8d0c5] bg-[#eee9e1] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Μην πειράξεις τώρα</p>
              <p className="mt-3 text-sm leading-6 text-[#51463e]">
                {compact(interpretation?.doNotDo || "Δεν κάνουμε μαζικές αλλαγές σε URLs, canonicals, titles ή περιεχόμενο χωρίς επιβεβαιωμένο signal.", 320)}
              </p>
            </div>

            <div className="rounded-2xl border border-[#d8d0c5] bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Έγινε — τώρα μετράμε</p>
              <div className="mt-3 space-y-4">
                {measuringActions.length ? measuringActions.map((action: any) => {
                  const due = reviewDue(action);
                  return (
                    <div key={action.actionKey} className="border-t border-[#e5ded5] pt-3 first:border-t-0 first:pt-0">
                      <p className="text-sm font-semibold leading-6 text-[#40362f]">{compact(action.title, 150)}</p>
                      <p className="mt-1 text-xs leading-5 text-[#8a755f]">Υλοποιήθηκε {dateOnly(action.implementedAt)} · επανέλεγχος {dateOnly(due)}</p>
                    </div>
                  );
                }) : <p className="text-sm leading-6 text-[#77695e]">Δεν υπάρχει πρόσφατη αλλαγή σε περίοδο μέτρησης.</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-[#d8d0c5] bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Πόσο φρέσκα είναι τα δεδομένα</p>
              <div className="mt-3 space-y-2 text-xs leading-5 text-[#6e6156]">
                <p><strong className="text-[#40362f]">Search Console:</strong> {dateOnly(latestGscDate)}</p>
                <p><strong className="text-[#40362f]">Analytics:</strong> {latestGa4Date ? dateOnly(latestGa4Date) : "αναμονή sync"}</p>
                <p><strong className="text-[#40362f]">Page indexing export:</strong> {dateTime(pageIndexingAt)}</p>
                <p><strong className="text-[#40362f]">Technical audit:</strong> {dateTime(technicalAt)}</p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
