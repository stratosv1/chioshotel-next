// Shared (client + server) types and labels for Βλάβες & εργασίες.

export type TaskKind = "fault" | "repair" | "job";
export type TaskPriority = "urgent" | "normal" | "low";
export type TaskStatus = "open" | "done";

export type PyrgosTask = {
  id: number;
  room: number | null; // null = whole house / common areas
  kind: TaskKind;
  title: string;
  notes: string;
  priority: TaskPriority;
  due: string | null; // YYYY-MM-DD
  status: TaskStatus;
  createdAt: string; // YYYY-MM-DD HH:MI (Athens)
  doneAt: string | null;
};

export const TASK_KINDS: TaskKind[] = ["fault", "repair", "job"];
export const TASK_PRIORITIES: TaskPriority[] = ["urgent", "normal", "low"];

export const KIND_LABELS: Record<TaskKind, string> = {
  fault: "Βλάβη",
  repair: "Διόρθωση",
  job: "Εργασία",
};

export const KIND_ICONS: Record<TaskKind, string> = {
  fault: "⚠️",
  repair: "🔧",
  job: "📋",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  urgent: "Επείγον",
  normal: "Κανονικό",
  low: "Όποτε γίνει",
};
