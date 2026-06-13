"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type WorkEntry = {
  id: string;
  workDate: string;
  clockIn: string;
  clockOut: string | null;
  hoursDecimal: number;
  hourlyRate: number;
  dailyCost: number;
  comments: string;
  paidAmount: number;
  outstanding: number;
  status: "paid" | "unpaid" | "open";
  statusLabel: string;
};

type Payment = {
  id: string;
  paymentDate: string;
  category: "salary" | "ika" | "extra";
  method: "cash" | "bank";
  amount: number;
  comments: string;
};

type PayrollState = {
  settings: {
    hourlyRate: number;
  };
  liveState: {
    isOpen: boolean;
    canClockIn: boolean;
    canClockOut: boolean;
    statusText: string;
  };
  summary: {
    totalHours: number;
    totalWorkCost: number;
    paidWorkCost: number;
    salaryPaid: number;
    currentDebt: number;
    currentHours: number;
    currentDays: number;
    creditBalance: number;
    periodText: string;
    salaryCash: number;
    salaryBank: number;
    extraCash: number;
    extraBank: number;
    extraTotal: number;
    ikaTotal: number;
    fullPayrollCost: number;
  };
  workEntries: WorkEntry[];
  payments: Payment[];
};

const emptyState: PayrollState = {
  settings: { hourlyRate: 0 },
  liveState: {
    isOpen: false,
    canClockIn: true,
    canClockOut: false,
    statusText: "Φόρτωση...",
  },
  summary: {
    totalHours: 0,
    totalWorkCost: 0,
    paidWorkCost: 0,
    salaryPaid: 0,
    currentDebt: 0,
    currentHours: 0,
    currentDays: 0,
    creditBalance: 0,
    periodText: "",
    salaryCash: 0,
    salaryBank: 0,
    extraCash: 0,
    extraBank: 0,
    extraTotal: 0,
    ikaTotal: 0,
    fullPayrollCost: 0,
  },
  workEntries: [],
  payments: [],
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function money(value: number) {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
  }).format(value || 0);
}

function formatDate(value: string) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("el-GR").format(new Date(`${value}T12:00:00`));
}

function paymentCategoryLabel(category: Payment["category"]) {
  if (category === "salary") {
    return "Μισθός";
  }

  if (category === "ika") {
    return "ΙΚΑ";
  }

  return "Extra";
}

function paymentMethodLabel(method: Payment["method"]) {
  return method === "cash" ? "Μετρητά" : "Τράπεζα";
}

export default function PayrollApp() {
  const [state, setState] = useState<PayrollState>(emptyState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [paymentDate, setPaymentDate] = useState(todayIso());
  const [paymentCategory, setPaymentCategory] = useState<Payment["category"]>("salary");
  const [paymentMethod, setPaymentMethod] = useState<Payment["method"]>("bank");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentComments, setPaymentComments] = useState("");
  const [workDate, setWorkDate] = useState(todayIso());
  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");
  const [manualRate, setManualRate] = useState("");
  const [workComments, setWorkComments] = useState("");
  const [quickComments, setQuickComments] = useState("");

  async function loadPayroll() {
    setLoading(true);

    try {
      const response = await fetch("/api/staff/payroll/", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Δεν φορτώθηκε η μισθοδοσία.");
      }

      setState(data);
      setHourlyRate(String(data.settings.hourlyRate || ""));
      setManualRate(String(data.settings.hourlyRate || ""));
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Δεν φορτώθηκε η μισθοδοσία.");
    } finally {
      setLoading(false);
    }
  }

  async function postAction(payload: Record<string, unknown>) {
    setSaving(true);
    setToast("");

    try {
      const response = await fetch("/api/staff/payroll/", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Δεν αποθηκεύτηκε.");
      }

      if (data.state) {
        setState(data.state);
        setHourlyRate(String(data.state.settings.hourlyRate || ""));
        setManualRate(String(data.state.settings.hourlyRate || ""));
      }

      setToast(data.message || "Η ενέργεια ολοκληρώθηκε.");
      return true;
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Δεν αποθηκεύτηκε.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadPayroll();
  }, []);

  const groupedEntries = useMemo(() => {
    const groups = new Map<string, WorkEntry[]>();

    state.workEntries.forEach((entry) => {
      const key = entry.workDate.slice(0, 7);
      groups.set(key, [...(groups.get(key) || []), entry]);
    });

    return Array.from(groups.entries());
  }, [state.workEntries]);

  async function updateRate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await postAction({ action: "update_hourly_rate", hourlyRate });
  }

  async function clockInAction() {
    const ok = await postAction({ action: "clock_in", comments: quickComments });
    if (ok) {
      setQuickComments("");
    }
  }

  async function clockOutAction() {
    const ok = await postAction({ action: "clock_out", comments: quickComments });
    if (ok) {
      setQuickComments("");
    }
  }

  async function addPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const ok = await postAction({
      action: "add_payment",
      paymentDate,
      category: paymentCategory,
      method: paymentMethod,
      amount: paymentAmount,
      comments: paymentComments,
    });

    if (ok) {
      setPaymentAmount("");
      setPaymentComments("");
    }
  }

  async function addManualWork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const ok = await postAction({
      action: "manual_work",
      workDate,
      clockIn,
      clockOut,
      hourlyRate: manualRate,
      comments: workComments,
    });

    if (ok) {
      setClockIn("");
      setClockOut("");
      setWorkComments("");
    }
  }

  async function deleteWork(id: string) {
    if (!confirm("Να διαγραφεί αυτή η καταχώρηση εργασίας;")) {
      return;
    }

    await postAction({ action: "delete_work", id });
  }

  async function deletePayment(id: string) {
    if (!confirm("Να διαγραφεί αυτή η πληρωμή;")) {
      return;
    }

    await postAction({ action: "delete_payment", id });
  }

  return (
    <main className="min-h-screen bg-[#f6f0e8] px-4 py-6 text-slate-900">
      <section className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/staff" className="text-sm font-bold text-amber-800">
              ← Πίσω στο Staff
            </Link>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.32em] text-amber-700">
              Voulamandis Staff
            </p>
            <h1 className="mt-2 text-3xl font-black md:text-5xl">Μισθοδοσία</h1>
            <p className="mt-3 max-w-3xl text-slate-600">
              Αυτόνομη εφαρμογή Vercel/Neon για ώρες εργασίας, πληρωμές μισθού, ΙΚΑ, extra και τρέχουσα οφειλή.
            </p>
          </div>

          <button
            type="button"
            onClick={loadPayroll}
            disabled={loading || saving}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
          >
            Ανανέωση
          </button>
        </div>

        {toast ? (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-white px-4 py-3 font-bold text-slate-800 shadow-sm">
            {toast}
          </div>
        ) : null}

        <div className="mb-5 rounded-[2rem] border border-white/70 bg-white p-4 shadow-sm md:p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-black">Σχόλια IN/OUT</label>
              <input
                value={quickComments}
                onChange={(event) => setQuickComments(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Προαιρετικό σχόλιο"
              />
              <p className="mt-2 text-sm font-bold text-slate-500">{state.liveState.statusText}</p>
            </div>

            <button
              type="button"
              onClick={clockInAction}
              disabled={saving || !state.liveState.canClockIn}
              className="rounded-3xl bg-green-600 px-8 py-5 text-3xl font-black tracking-widest text-white shadow-lg disabled:opacity-40"
            >
              IN
            </button>

            <button
              type="button"
              onClick={clockOutAction}
              disabled={saving || !state.liveState.canClockOut}
              className="rounded-3xl bg-red-600 px-8 py-5 text-3xl font-black tracking-widest text-white shadow-lg disabled:opacity-40"
            >
              OUT
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className={`rounded-[1.75rem] border p-5 shadow-sm ${state.summary.currentDebt > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
            <p className="text-sm font-black text-slate-500">Τρέχουσα οφειλή</p>
            <strong className="mt-2 block text-3xl font-black">{money(state.summary.currentDebt)}</strong>
            <small className="mt-2 block font-bold text-slate-500">
              {state.summary.currentDays} ημέρες / {state.summary.currentHours.toFixed(2)} ώρες
            </small>
          </div>

          <div className="rounded-[1.75rem] border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <p className="text-sm font-black text-slate-500">Πιστωτικό υπόλοιπο</p>
            <strong className="mt-2 block text-3xl font-black">{money(state.summary.creditBalance)}</strong>
            <small className="mt-2 block font-bold text-slate-500">Συμψηφίζεται με επόμενες ώρες</small>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-slate-500">Πλήρες μισθολογικό κόστος</p>
            <strong className="mt-2 block text-3xl font-black">{money(state.summary.fullPayrollCost)}</strong>
            <small className="mt-2 block font-bold text-slate-500">Εργασία + ΙΚΑ + Extra</small>
          </div>
        </div>

        <div className="mt-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-black">{state.summary.periodText}</p>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <form onSubmit={updateRate} className="rounded-[2rem] border border-white/70 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Ρύθμιση ωρομισθίου</h2>
            <label className="mt-4 block text-sm font-black">Αποζημίωση ανά ώρα (€)</label>
            <div className="mt-2 flex gap-2">
              <input
                value={hourlyRate}
                onChange={(event) => setHourlyRate(event.target.value)}
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
              <button disabled={saving} className="rounded-2xl bg-slate-900 px-5 py-3 font-black text-white disabled:opacity-50">
                Αποθήκευση
              </button>
            </div>
          </form>

          <form onSubmit={addPayment} className="rounded-[2rem] border border-white/70 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Πληρωμή μισθού / ΙΚΑ / Extra</h2>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-black">Ημερομηνία</span>
                <input value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} type="date" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
              </label>

              <label className="block">
                <span className="text-sm font-black">Είδος</span>
                <select value={paymentCategory} onChange={(event) => setPaymentCategory(event.target.value as Payment["category"])} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                  <option value="salary">Πληρωμή μισθού</option>
                  <option value="ika">Πληρωμή ΙΚΑ</option>
                  <option value="extra">Πληρωμή Extra</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-black">Τρόπος</span>
                <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as Payment["method"])} disabled={paymentCategory === "ika"} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 disabled:opacity-50">
                  <option value="bank">Τράπεζα</option>
                  <option value="cash">Μετρητά</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-black">Ποσό (€)</span>
                <input value={paymentAmount} onChange={(event) => setPaymentAmount(event.target.value)} type="number" min="0" step="0.01" required className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
              </label>
            </div>

            <label className="mt-3 block">
              <span className="text-sm font-black">Σχόλια</span>
              <textarea value={paymentComments} onChange={(event) => setPaymentComments(event.target.value)} rows={3} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </label>

            <button disabled={saving} className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 font-black text-white disabled:opacity-50">
              Καταχώρηση πληρωμής
            </button>
          </form>
        </div>

        <form onSubmit={addManualWork} className="mt-5 rounded-[2rem] border border-white/70 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Χειροκίνητη καταχώρηση εργασίας</h2>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <label className="block">
              <span className="text-sm font-black">Ημερομηνία</span>
              <input value={workDate} onChange={(event) => setWorkDate(event.target.value)} type="date" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </label>

            <label className="block">
              <span className="text-sm font-black">Ώρα εισόδου</span>
              <input value={clockIn} onChange={(event) => setClockIn(event.target.value)} type="time" required className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </label>

            <label className="block">
              <span className="text-sm font-black">Ώρα εξόδου</span>
              <input value={clockOut} onChange={(event) => setClockOut(event.target.value)} type="time" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </label>

            <label className="block">
              <span className="text-sm font-black">Ωρομίσθιο (€)</span>
              <input value={manualRate} onChange={(event) => setManualRate(event.target.value)} type="number" min="0" step="0.01" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </label>
          </div>

          <label className="mt-3 block">
            <span className="text-sm font-black">Σχόλια</span>
            <textarea value={workComments} onChange={(event) => setWorkComments(event.target.value)} rows={3} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </label>

          <button disabled={saving} className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 font-black text-white disabled:opacity-50">
            Καταχώρηση εργασίας
          </button>
        </form>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <section className="rounded-[2rem] border border-white/70 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Ημέρες εργασίας</h2>

            <div className="mt-4 space-y-4">
              {groupedEntries.length === 0 ? (
                <p className="rounded-2xl bg-slate-50 p-4 font-bold text-slate-500">Δεν υπάρχουν ακόμα καταχωρήσεις εργασίας.</p>
              ) : (
                groupedEntries.map(([month, entries]) => (
                  <details key={month} className="rounded-2xl border border-slate-200 bg-slate-50">
                    <summary className="cursor-pointer px-4 py-3 font-black">{month}</summary>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[780px] text-sm">
                        <thead>
                          <tr className="bg-white text-left">
                            <th className="p-3">Κατάσταση</th>
                            <th className="p-3">Ημερομηνία</th>
                            <th className="p-3">IN</th>
                            <th className="p-3">OUT</th>
                            <th className="p-3">Ώρες</th>
                            <th className="p-3">Κόστος</th>
                            <th className="p-3">Υπόλοιπο</th>
                            <th className="p-3">Ενέργεια</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entries.map((entry) => (
                            <tr key={entry.id} className="border-t border-slate-200">
                              <td className="p-3 font-black">{entry.statusLabel}</td>
                              <td className="p-3">{formatDate(entry.workDate)}</td>
                              <td className="p-3">{entry.clockIn}</td>
                              <td className="p-3">{entry.clockOut || "Ανοιχτό"}</td>
                              <td className="p-3">{entry.hoursDecimal.toFixed(2)}</td>
                              <td className="p-3">{money(entry.dailyCost)}</td>
                              <td className="p-3">{money(entry.outstanding)}</td>
                              <td className="p-3">
                                <button onClick={() => deleteWork(entry.id)} className="rounded-xl bg-red-600 px-3 py-2 text-xs font-black text-white">
                                  Διαγραφή
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/70 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Πρόσφατες πληρωμές</h2>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[650px] text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="p-3">Ημερομηνία</th>
                    <th className="p-3">Είδος</th>
                    <th className="p-3">Τρόπος</th>
                    <th className="p-3">Ποσό</th>
                    <th className="p-3">Ενέργεια</th>
                  </tr>
                </thead>
                <tbody>
                  {state.payments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 font-bold text-slate-500">
                        Δεν υπάρχουν ακόμα πληρωμές.
                      </td>
                    </tr>
                  ) : (
                    state.payments.map((payment) => (
                      <tr key={payment.id} className="border-t border-slate-200">
                        <td className="p-3">{formatDate(payment.paymentDate)}</td>
                        <td className="p-3">{paymentCategoryLabel(payment.category)}</td>
                        <td className="p-3">{paymentMethodLabel(payment.method)}</td>
                        <td className="p-3">{money(payment.amount)}</td>
                        <td className="p-3">
                          <button onClick={() => deletePayment(payment.id)} className="rounded-xl bg-red-600 px-3 py-2 text-xs font-black text-white">
                            Διαγραφή
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
