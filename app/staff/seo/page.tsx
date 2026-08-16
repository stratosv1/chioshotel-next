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

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SEO Cockpit | Voulamandis House",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

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
      <section className="bg-[#eee9e1] px-4 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.7fr)] lg:items-start">
          <GscPagesCsvUpload />
          <RunSeoAuditButton />
        </div>
      </section>
      <SeoManagerMonitor monitor={managerMonitor} />
      <SeoHealthPanel health={health} />
      <Ga4SeoPanel analytics={analytics} sync={ga4Sync} />
      <SeoCockpit
        snapshot={snapshot}
        history={history}
        sync={latestSync}
        fallbackData={fallbackData}
        actions={actions}
      />
    </>
  );
}
