import type { Metadata } from "next";
import { getSeoAdvisorWithIntentData } from "@/lib/gsc/advisor-intents";
import {
  getLatestGscSyncState,
  getLatestSeoAdvisorSnapshot,
  getSeoAdvisorSnapshotHistory,
} from "@/lib/gsc/advisor-snapshots";
import SeoCockpit from "./SeoCockpit";

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
  const [snapshot, latestSync, history] = await Promise.all([
    getLatestSeoAdvisorSnapshot(),
    getLatestGscSyncState(),
    getSeoAdvisorSnapshotHistory(4),
  ]);
  const fallbackData = snapshot?.payload ? null : await getSeoAdvisorWithIntentData();

  return (
    <SeoCockpit
      snapshot={snapshot}
      history={history}
      sync={latestSync}
      fallbackData={fallbackData}
    />
  );
}
