import type { Metadata } from "next";
import TasksBoard from "./TasksBoard";

export const metadata: Metadata = {
  title: "Πύργος ελέγχου · Βλάβες & εργασίες | Staff Area",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

export default function PyrgosTasksPage() {
  return <TasksBoard />;
}
