"use client";

import { useEffect, useState } from "react";
import { roomByNumber } from "@/lib/pyrgos/rooms";
import { KIND_ICONS, type PyrgosTask } from "@/lib/pyrgos/task-types";

const PREVIEW = 5;

/** Σήμερα: open faults / repairs / jobs, urgent first. */
export default function OpenTasksCard() {
  const [tasks, setTasks] = useState<PyrgosTask[] | null>(null);

  useEffect(() => {
    fetch("/api/staff/pyrgos/tasks", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => setTasks(json.ok ? json.tasks.filter((t: PyrgosTask) => t.status === "open") : []))
      .catch(() => setTasks([]));
  }, []);

  if (!tasks) return null;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Athens" }).format(new Date());

  return (
    <section aria-labelledby="tasks" className="space-y-2 rounded-2xl border border-[#e3e9f0] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="tasks" className="text-lg font-black">
          Βλάβες & εργασίες <span className="text-sm font-semibold text-[#5b6b80]">· {tasks.length} ανοιχτές</span>
        </h2>
        <div className="flex gap-2">
          <a href="/staff/pyrgos/ergasies?new=1" className="rounded-full bg-[#5443c9] px-3.5 py-1.5 text-xs font-bold text-white">
            + Νέα
          </a>
          <a href="/staff/pyrgos/ergasies" className="rounded-full border border-[#cfd9e4] px-3.5 py-1.5 text-xs font-bold">
            Όλες
          </a>
        </div>
      </div>
      {tasks.length === 0 ? (
        <p className="text-sm text-[#5b6b80]">Όλα εντάξει, καμία ανοιχτή εργασία.</p>
      ) : (
        <ul className="divide-y divide-[#eef2f6]">
          {tasks.slice(0, PREVIEW).map((t) => {
            const late = t.due && t.due < today;
            return (
              <li key={t.id} className="flex items-start gap-2 py-2 text-sm">
                <span aria-hidden="true">{KIND_ICONS[t.kind]}</span>
                <span className="min-w-0 flex-1">
                  <strong>{t.room === null ? "Σπίτι" : roomByNumber(t.room)?.label}</strong> · {t.title}
                  {t.priority === "urgent" && <span className="ml-2 rounded-full bg-[#fee2e2] px-2 py-0.5 text-xs font-bold text-[#991b1b]">Επείγον</span>}
                  {late && <span className="ml-2 text-xs font-bold text-[#b91c1c]">Εκπρόθεσμο</span>}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {tasks.length > PREVIEW && <p className="text-xs text-[#5b6b80]">+{tasks.length - PREVIEW} ακόμα</p>}
    </section>
  );
}
