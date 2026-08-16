import type { Metadata } from "next";
import { DEFAULT_GA4_PROPERTY_ID } from "@/lib/ga4/client";
import { getGa4SeoContext } from "@/lib/ga4/context";
import { getLatestGa4SyncState } from "@/lib/ga4/store";
import { getSeoAdvisorWithIntentData } from "@/lib/gsc/advisor-intents";
import { getSeoAdvisorActions, syncSeoAdvisorActions } from "@/lib/gsc/advisor-actions";
import {
  getLatestGscSyncState,
  getLatestSeoAdvisorSnapshot,
  getSeoAdvisorSnapshotHistory,
} from "@/lib/gsc/advisor-snapshots";
import { getSeoHealthDashboard } from "@/lib/seo-health/store";
import { getSeoManagerMonitor } from "@/lib/seo-manager/monitor";
import SeoCockpit from "./SeoCockpit";
import SeoHealthPanel from "./SeoHealthPanel";
import SeoManagerMonitor from "./SeoManagerMonitor";
import RunSeoAuditButton from "./RunSeoAuditButton";
import GscPagesCsvUpload from "./GscPagesCsvUpload";
import Ga4SeoPanel from "./Ga4SeoPanel";
import SeoSimpleOverview from "./SeoSimpleOverview";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SEO | Voulamandis House",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

function AdvancedSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <details className="overflow-hidden rounded-2xl border border-[#d8d0c5] bg-white">
      <summary className="cursor-pointer list-none px-5 py-5 sm:px-6 [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-5">
          <div>
            <h2 className="text-lg font-semibold text-[#332b25]">{title}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[#77695e]">{description}</p>
          </div>
          <span className="shrink-0 rounded-full bg-[#eee9e1] px-3 py-1 text-xs font-semibold text-[#6f6051]">Άνοιγμα</span>
        </div>
      </summary>
      <div className="border-t border-[#d8d0c5]">{children}</div>
    </details>
  );
}

export default async function SeoAdvisorPage() {
  const ga4PropertyId = process.env.GA4_PROPERTY_ID?.trim() || DEFAULT_GA4_PROPERTY_ID;
  const [snapshot, latestSync, history, health, managerMonitor, analytics, ga4Sync] = await Promise.all([
    getLatestSeoAdvisorSnapshot(),
    getLatestGscSyncState(),
    getSeoAdvisorSnapshotHistory(4),
    getSeoHealthDashboard(),
    getSeoManagerMonitor(),
    getGa4SeoContext(),
    getLatestGa4SyncState(ga4PropertyId),
  ]);

  const findings = snapshot?.payload?.aiInterpretation?.findings;
  if (snapshot?.analysisDate && Array.isArray(findings)) {
    await syncSeoAdvisorActions(snapshot.analysisDate, findings);
  }

  const actions = await getSeoAdvisorActions();
  const fallbackData = snapshot?.payload ? null : await getSeoAdvisorWithIntentData();

  return (
    <>
      <SeoSimpleOverview
        snapshot={snapshot}
        fallbackData={fallbackData}
        analytics={analytics}
        health={health}
        managerMonitor={managerMonitor}
        actions={actions}
      />

      <section className="bg-[#eee9e1] px-4 py-10 text-[#3e342d] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a755f]">Προχωρημένα</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#332b25]">Όλες οι λεπτομέρειες παραμένουν εδώ</h2>
            <p className="mt-2 text-sm leading-6 text-[#6e6156]">
              Δεν χρειάζεται να ανοίγεις αυτά τα sections καθημερινά. Χρησιμεύουν όταν θέλουμε να ερευνήσουμε συγκεκριμένο πρόβλημα ή να επιβεβαιώσουμε μια SEO απόφαση.
            </p>
          </div>

          <div className="space-y-4">
            <AdvancedSection
              title="Πλήρης ανάλυση Search Console & ιστορικό αποφάσεων"
              description="CTR, θέσεις, queries, χώρες, συσκευές, cannibalisation, findings και action tracker."
            >
              <SeoCockpit
                snapshot={snapshot}
                history={history}
                sync={latestSync}
                fallbackData={fallbackData}
                actions={actions}
              />
            </AdvancedSection>

            <AdvancedSection
              title="Google Analytics — τι κάνουν οι επισκέπτες μετά το click"
              description="Organic sessions, engagement, key events και landing pages με πτώση ή χαμηλό engagement."
            >
              <Ga4SeoPanel analytics={analytics} sync={ga4Sync} />
            </AdvancedSection>

            <AdvancedSection
              title="Indexing & technical SEO"
              description="Page Indexing exports, redirects, canonicals, URL Inspection και τεχνικά diagnostics."
            >
              <SeoManagerMonitor monitor={managerMonitor} />
              <SeoHealthPanel health={health} />
            </AdvancedSection>

            <AdvancedSection
              title="Εργαλεία & χειροκίνητοι έλεγχοι"
              description="Upload GSC Pages export ή εκτέλεση πλήρους technical audit μόνο όταν χρειάζεται."
            >
              <section className="bg-[#f7f5f0] px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.7fr)] lg:items-start">
                  <GscPagesCsvUpload />
                  <RunSeoAuditButton />
                </div>
              </section>
            </AdvancedSection>
          </div>
        </div>
      </section>
    </>
  );
}
