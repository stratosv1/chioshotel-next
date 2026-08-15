import type { Metadata } from "next";
import { getSeoAdvisorWithIntentData } from "@/lib/gsc/advisor-intents";
import { getSeoAdvisorActions, syncSeoAdvisorActions } from "@/lib/gsc/advisor-actions";
import {
  getLatestGscSyncState,
  getLatestSeoAdvisorSnapshot,
  getSeoAdvisorSnapshotHistory,
} from "@/lib/gsc/advisor-snapshots";
import { getSeoHealthDashboard } from "@/lib/seo-health/store";
import SeoCockpit from "./SeoCockpit";
import SeoHealthPanel from "./SeoHealthPanel";
import RunSeoAuditButton from "./RunSeoAuditButton";

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
  const [snapshot, latestSync, history, health] = await Promise.all([
    getLatestSeoAdvisorSnapshot(),
    getLatestGscSyncState(),
    getSeoAdvisorSnapshotHistory(4),
    getSeoHealthDashboard(),
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
        <div className="mx-auto flex max-w-7xl justify-end">
          <RunSeoAuditButton />
        </div>
      </section>
      <SeoHealthPanel health={health} />
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
