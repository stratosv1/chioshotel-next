"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SummaryResponse = {
  success: boolean;
  generatedAt?: string;
  message?: string;
  counts?: Record<string, number>;
  dateRanges?: Record<string, string | null>;
  recentRefreshRuns?: Array<{
    id: number;
    run_type: string;
    status: string;
    started_at: string;
    finished_at: string | null;
    duration_ms: number | null;
    message: string | null;
  }>;
  units?: Array<{
    room_id: string;
    room_name: string;
    unit_id: string;
    unit_name: string;
    label: string;
    location: string | null;
    max_guests: number;
    is_active: boolean;
  }>;
};

const labelMap: Record<string, string> = {
  staff_units: "Δωμάτια / Units",
  staff_rate_cache: "Rate Cache",
  staff_availability_calendar: "Availability Calendar",
  staff_bookings_snapshot: "Bookings Snapshot",
  staff_price_imports: "Price Imports",
  staff_refresh_runs: "Refresh Runs",
  staff_deals_cache: "Deals Cache",
  staff_housekeeping_stays: "Housekeeping Stays",
  staff_housekeeping_tasks: "Housekeeping Tasks",
};

export default function OperationsApp() {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  async function loadSummary() {
    setLoading(true);
    setToast("");

    const response = await fetch("/api/staff/operations/summary/", {
      cache: "no-store",
      credentials: "same-origin",
    });

    const json = (await response.json().catch(() => null)) as SummaryResponse | null;

    if (!response.ok || !json?.success) {
      setToast(json?.message || "Δεν φορτώθηκε η Neon operations database.");
      setLoading(false);
      return;
    }

    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    void loadSummary();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f1e8] px-4 py-8 text-stone-900 md:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2rem] bg-gradient-to-br from-amber-50 via-white to-stone-100 p-5 shadow-xl ring-1 ring-amber-100 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <Link
                href="/staff"
                className="mb-4 inline-flex items-center rounded-2xl bg-white px-4 py-2 text-sm font-black text-amber-800 shadow-sm ring-1 ring-amber-200 hover:bg-amber-50"
              >
                ← Επιστροφή στην κεντρική πλατφόρμα Staff
              </Link>

              <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-700">
                Voulamandis Staff
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-stone-800 md:text-6xl">
                Operations Database
              </h1>
              <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-stone-600 md:text-base">
                Η νέα Neon βάση που θα αντικαταστήσει σταδιακά το μεγάλο Google Sheet / Excel σύστημα.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadSummary()}
              className="rounded-2xl bg-stone-950 px-5 py-3 text-sm font-black text-white shadow-lg hover:bg-stone-800"
            >
              Ανανέωση
            </button>
          </div>

          {toast ? (
            <div className="mt-6 rounded-2xl bg-red-100 px-4 py-3 text-sm font-black text-red-800">
              {toast}
            </div>
          ) : null}

          <div className="mt-6 rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-stone-200">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-500">
              Status
            </p>
            <p className="mt-2 text-lg font-black text-stone-800">
              {loading ? "Φόρτωση από Neon..." : "Neon operations schema connected"}
            </p>
            {data?.generatedAt ? (
              <p className="mt-1 text-sm font-semibold text-stone-500">
                Generated: {new Date(data.generatedAt).toLocaleString("el-GR")}
              </p>
            ) : null}
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {Object.entries(data?.counts || {}).map(([key, value]) => (
            <div key={key} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-stone-500">
                {labelMap[key] || key}
              </p>
              <p className="mt-3 text-4xl font-black text-stone-900">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-5 shadow-xl ring-1 ring-stone-200 md:p-7">
            <h2 className="text-2xl font-black text-stone-800">Date ranges</h2>
            <div className="mt-5 grid gap-3">
              {Object.entries(data?.dateRanges || {}).map(([key, value]) => (
                <div key={key} className="rounded-2xl bg-stone-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-stone-500">
                    {key}
                  </p>
                  <p className="mt-1 text-lg font-black text-stone-800">{value || "-"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-xl ring-1 ring-stone-200 md:p-7">
            <h2 className="text-2xl font-black text-stone-800">Refresh runs</h2>
            <div className="mt-5 space-y-3">
              {data?.recentRefreshRuns?.length ? (
                data.recentRefreshRuns.map((run) => (
                  <div key={run.id} className="rounded-2xl bg-stone-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black text-stone-800">{run.run_type}</p>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                        {run.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-stone-500">
                      {new Date(run.started_at).toLocaleString("el-GR")}
                    </p>
                    {run.message ? (
                      <p className="mt-2 text-sm font-semibold text-stone-600">{run.message}</p>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-stone-50 p-4 text-sm font-bold text-stone-500">
                  Δεν υπάρχουν refresh runs ακόμα.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] bg-white p-5 shadow-xl ring-1 ring-stone-200 md:p-7">
          <h2 className="text-2xl font-black text-stone-800">Rooms / Units</h2>

          <div className="mt-5 overflow-hidden rounded-3xl border border-stone-200">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-stone-100 text-xs uppercase tracking-[0.14em] text-stone-500">
                  <tr>
                    <th className="px-4 py-3">Label</th>
                    <th className="px-4 py-3">Room ID</th>
                    <th className="px-4 py-3">Unit ID</th>
                    <th className="px-4 py-3">Room Type</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {data?.units?.map((unit) => (
                    <tr key={`${unit.room_id}:${unit.unit_id}`}>
                      <td className="px-4 py-3 font-black text-stone-800">{unit.label}</td>
                      <td className="px-4 py-3 font-semibold text-stone-600">{unit.room_id}</td>
                      <td className="px-4 py-3 font-semibold text-stone-600">{unit.unit_id}</td>
                      <td className="px-4 py-3 font-semibold text-stone-600">{unit.room_name}</td>
                      <td className="px-4 py-3 font-semibold text-stone-600">{unit.location || "-"}</td>
                      <td className="px-4 py-3 font-black text-stone-800">{unit.max_guests}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
