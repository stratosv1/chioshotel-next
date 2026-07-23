import type { Metadata } from "next";
import StatisticsDashboard from "./StatisticsDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Στατιστικά | Voulamandis House Staff",
  robots: { index: false, follow: false },
};

export default function StaffStatisticsPage() {
  return <StatisticsDashboard />;
}
