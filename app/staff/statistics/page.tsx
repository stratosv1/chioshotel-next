import type { Metadata } from "next";
import StatisticsDashboard from "./StatisticsDashboard";

export const metadata: Metadata = {
  title: "Στατιστικά | Voulamandis House Staff",
  robots: { index: false, follow: false },
};

export default function StaffStatisticsPage() {
  return <StatisticsDashboard />;
}
