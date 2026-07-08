"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  staffExpenseCategories,
  staffExpenseEntities,
  staffExpenseEntityCategoryMap,
  staffTuitionSubjects,
} from "@/lib/staff-expenses-config";

type StaffExpense = {
  id: string;
  expenseDate: string;
  primaryAccount: "kampos" | "family";
  category: string;
  entity: string;
  amount: number;
  comments: string;
  createdAt: string;
  updatedAt: string;
};

type Area = "kampos" | "home";

type FilterAccount = "all" | "kampos" | "family";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function currentMonth() {
  return todayIso().slice(0, 7);
}

function monthKey(date: string) {
  return date.slice(0, 7);
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("el-GR").format(new Date(`${date}T12:00:00`));
}

function parseMoney(value: string) {
  const amount = Number(value.replace(",", ".").replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function categoryBySlug(slug: string) {
  return staffExpenseCategories.find((category) => category.slug === slug);
}

function entityBySlug(slug: string) {
  return staffExpenseEntities.find((entity) => entity.slug === slug);
}

function canUseCategory(entity: string, category: string) {
  return staffExpenseEntityCategoryMap[entity]?.includes(category) ?? false;
}

function accountLabel(account: "kampos" | "family") {
  return account === "kampos" ? "ΚΑΜΠΟΣ" : "ΣΠΙΤΙ";
}

function csvEscape(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export default function ExpensesApp() {
  const [expenses, setExpenses] = useState<StaffExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [expenseDate, setExpenseDate] = useState(todayIso());
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("electricity");
  const [area, setArea] = useState<Area>("kampos");
  const [person, setPerson] = useState("");
  const [subject, setSubject] = useState("");
  const [comments, setComments] = useState("");

  const [filterMonth, setFilterMonth] = useState(currentMonth());
  const [filterAccount, setFilterAccount] = useState<FilterAccount>("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const people = staffExpenseEntities.filter(
    (entity) => entity.account === "family" && entity.slug !== "home",
  );

  const selectedCategory = categoryBySlug(category);
  const hasKampos = canUseCategory("kampos", category);
  const hasHome = canUseCategory("home", category);
  const availablePeople = people.filter((item) => canUseCategory(item.slug, category));
  const needsPerson = area === "home" && !hasHome && availablePeople.length > 0;
  const needsSubject =
    category === "tuition" && area === "home" && ["michalis", "sideris"].includes(person);
  const entity = area === "kampos" ? "kampos" : person || "home";
  const primaryAccount = area === "kampos" ? "kampos" : "family";

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const expenseCategory = categoryBySlug(expense.category);
      const expenseEntity = entityBySlug(expense.entity);
      const haystack = [
        expense.expenseDate,
        expense.comments,
        expenseCategory?.label,
        expenseCategory?.slug,
        expenseEntity?.label,
        expenseEntity?.slug,
        accountLabel(expense.primaryAccount),
      ]
        .join(" ")
        .toLowerCase();

      const matchesMonth =
        filterMonth === "" || monthKey(expense.expenseDate) === filterMonth;
      const matchesAccount =
        filterAccount === "all" || expense.primaryAccount === filterAccount;
      const matchesSearch = haystack.includes(search.toLowerCase());

      return matchesMonth && matchesAccount && matchesSearch;
    });
  }, [expenses, filterAccount, filterMonth, search]);

  const todayTotal = expenses
    .filter((expense) => expense.expenseDate === todayIso())
    .reduce((sum, expense) => sum + expense.amount, 0);

  const monthTotal = expenses
    .filter((expense) => monthKey(expense.expenseDate) === currentMonth())
    .reduce((sum, expense) => sum + expense.amount, 0);

  const allTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const filteredTotal = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  const kamposFilteredTotal = filteredExpenses
    .filter((expense) => expense.primaryAccount === "kampos")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const familyFilteredTotal = filteredExpenses
    .filter((expense) => expense.primaryAccount === "family")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotals = staffExpenseCategories
    .map((item) => ({
      ...item,
      total: filteredExpenses
        .filter((expense) => expense.category === item.slug)
        .reduce((sum, expense) => sum + expense.amount, 0),
    }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }

  async function loadExpenses() {
    setLoading(true);

    const params = new URLSearchParams();
    params.set("month", "");
    params.set("account", "");
    params.set("search", "");

    const response = await fetch(`/api/staff/expenses?${params.toString()}`, {
      credentials: "same-origin",
      cache: "no-store",
    });

    if (!response.ok) {
      setLoading(false);
      showToast("Δεν φορτώθηκαν τα έξοδα.");
      return;
    }

    const data = (await response.json()) as { expenses: StaffExpense[] };
    setExpenses(data.expenses);
    setLoading(false);
  }

  useEffect(() => {
    void loadExpenses();
  }, []);

  function chooseCategory(nextCategory: string) {
    setCategory(nextCategory);
    setPerson("");
    setSubject("");

    const nextHasKampos = canUseCategory("kampos", nextCategory);
    const nextHasHome =
      canUseCategory("home", nextCategory) ||
      people.some((item) => canUseCategory(item.slug, nextCategory));

    if (nextHasKampos && !nextHasHome) {
      setArea("kampos");
    } else if (!nextHasKampos && nextHasHome) {
      setArea("home");
    }
  }

  async function addExpense(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = parseMoney(amount);

    if (parsedAmount <= 0) {
      showToast("Βάλε σωστό ποσό.");
      return;
    }

    if (needsPerson && !person) {
      showToast("Πρέπει να επιλέξεις πρόσωπο.");
      return;
    }

    if (needsSubject && !subject) {
      showToast("Πρέπει να επιλέξεις μάθημα.");
      return;
    }

    if (category === "service" && comments.trim().length === 0) {
      showToast("Για την Υπηρεσία χρειάζεται σχόλιο.");
      return;
    }

    const finalComments =
      needsSubject && subject
        ? comments.trim()
          ? `Μάθημα: ${subject} — ${comments.trim()}`
          : `Μάθημα: ${subject}`
        : comments.trim();

    setSaving(true);

    const response = await fetch("/api/staff/expenses/", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        expenseDate,
        primaryAccount,
        category,
        entity,
        amount: parsedAmount,
        comments: finalComments,
      }),
    });

    const data = (await response.json()) as {
      message?: string;
      expense?: StaffExpense;
    };

    setSaving(false);

    if (!response.ok || !data.expense) {
      showToast(data.message ?? "Δεν αποθηκεύτηκε.");
      return;
    }

    setExpenses((current) => [data.expense!, ...current]);
    setAmount("");
    setComments("");
    setSubject("");
    showToast("Το έξοδο αποθηκεύτηκε.");
  }

  async function deleteExpense(id: string) {
    const confirmed = window.confirm("Να διαγραφεί αυτό το έξοδο;");

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/staff/expenses/?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: "same-origin",
    });

    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      showToast(data.message ?? "Δεν διαγράφηκε.");
      return;
    }

    setExpenses((current) => current.filter((expense) => expense.id !== id));
    showToast("Το έξοδο διαγράφηκε.");
  }

  function exportCsv() {
    const header = [
      "Ημερομηνία",
      "Ποσό",
      "Πρωτοβάθμιος",
      "Κατηγορία",
      "Ενότητα",
      "Σχόλιο",
      "Created",
    ];

    const rows = filteredExpenses.map((expense) => {
      const expenseCategory = categoryBySlug(expense.category);
      const expenseEntity = entityBySlug(expense.entity);

      return [
        expense.expenseDate,
        expense.amount.toFixed(2),
        accountLabel(expense.primaryAccount),
        expenseCategory?.label ?? expense.category,
        expenseEntity?.label ?? expense.entity,
        expense.comments,
        expense.createdAt,
      ];
    });

    const csv = [header, ...rows]
      .map((row) => row.map(csvEscape).join(","))
      .join("\n");

    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8",
    });

    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `voulamandis-expenses-${filterMonth || "all"}.csv`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fdfcfb_0%,#e2d1c3_100%)] px-3 py-4 text-slate-950 md:px-8 md:py-6">
      {toast ? (
        <div className="fixed inset-x-3 top-3 z-50 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-black text-emerald-900 shadow-2xl md:left-auto md:right-4 md:max-w-sm">
          {toast}
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl">
        <header className="mb-4 rounded-3xl border border-white/70 bg-white/70 p-4 shadow-xl shadow-stone-900/10 md:mb-6 md:rounded-[2rem] md:p-8">
          <Link
            href="/staff"
            className="mb-3 inline-flex rounded-2xl bg-white px-3 py-2 text-xs font-black text-amber-800 shadow-sm ring-1 ring-amber-200 hover:bg-amber-50 md:text-sm"
          >
            ← Staff
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#bc6c25]">
                Voulamandis House
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-[#5d4037] md:text-6xl">
                Έξοδα
              </h1>
              <p className="mt-2 text-sm font-medium leading-6 text-[#5d4037]/75 md:max-w-3xl md:text-base">
                Γρήγορη καταχώρηση και απλή προβολή από κινητό.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <div className="rounded-2xl border border-white/80 bg-white/70 p-3 text-center shadow-sm md:p-4">
                <p className="text-[10px] font-black uppercase text-slate-500 md:text-xs">
                  Σήμερα
                </p>
                <p className="mt-1 text-sm font-black text-[#5d4037] md:text-lg">
                  {formatMoney(todayTotal)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/70 p-3 text-center shadow-sm md:p-4">
                <p className="text-[10px] font-black uppercase text-slate-500 md:text-xs">
                  Μήνας
                </p>
                <p className="mt-1 text-sm font-black text-[#5d4037] md:text-lg">
                  {formatMoney(monthTotal)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/70 p-3 text-center shadow-sm md:p-4">
                <p className="text-[10px] font-black uppercase text-slate-500 md:text-xs">
                  Σύνολο
                </p>
                <p className="mt-1 text-sm font-black text-[#5d4037] md:text-lg">
                  {formatMoney(allTotal)}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.35fr] xl:gap-6">
          <section className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-xl shadow-stone-900/10 md:rounded-[2rem] md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#bc6c25]">
                  Νέα καταχώρηση
                </p>
                <h2 className="mt-1 text-2xl font-black text-[#5d4037]">
                  Νέο έξοδο
                </h2>
              </div>
              <div className="rounded-2xl bg-[#bc6c25]/10 px-4 py-3 text-2xl">
                {selectedCategory?.icon ?? "🧾"}
              </div>
            </div>

            <form onSubmit={addExpense} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-[#5d4037]">
                    Ημερομηνία
                  </span>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(event) => setExpenseDate(event.target.value)}
                    className="w-full rounded-2xl border border-stone-200 bg-white px-3 py-3 text-sm font-bold outline-none ring-[#bc6c25]/20 focus:ring-4 md:px-4 md:text-base"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-black text-[#5d4037]">
                    Ποσό (€)
                  </span>
                  <input
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    inputMode="decimal"
                    placeholder="85,50"
                    className="w-full rounded-2xl border border-stone-200 bg-white px-3 py-3 text-sm font-bold outline-none ring-[#bc6c25]/20 focus:ring-4 md:px-4 md:text-base"
                  />
                </label>
              </div>

              <div>
                <label className="block md:hidden">
                  <span className="mb-2 block text-sm font-black text-[#5d4037]">
                    Κατηγορία εξόδου
                  </span>
                  <select
                    value={category}
                    onChange={(event) => chooseCategory(event.target.value)}
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-4 text-base font-black outline-none ring-[#bc6c25]/20 focus:ring-4"
                  >
                    {staffExpenseCategories.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.icon} {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="hidden md:block">
                  <p className="mb-2 text-sm font-black text-[#5d4037]">
                    Κατηγορία εξόδου
                  </p>
                  <div className="flex max-h-64 flex-wrap gap-2 overflow-auto rounded-3xl border border-stone-200 bg-white/55 p-3">
                    {staffExpenseCategories.map((item) => (
                      <button
                        key={item.slug}
                        type="button"
                        onClick={() => chooseCategory(item.slug)}
                        className={`rounded-full border px-3 py-2 text-sm font-black transition ${
                          item.slug === category
                            ? "border-slate-950 bg-slate-950 text-white shadow-lg"
                            : "border-stone-200 bg-white text-slate-700 hover:border-[#bc6c25] hover:bg-orange-50"
                        }`}
                      >
                        {item.icon} {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-black text-[#5d4037]">
                  Βασική ενότητα
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={!hasKampos}
                    onClick={() => {
                      setArea("kampos");
                      setPerson("");
                      setSubject("");
                    }}
                    className={`rounded-2xl border px-3 py-4 text-left text-sm font-black transition md:p-4 md:text-base ${
                      area === "kampos"
                        ? "border-[#6b8e23] bg-[#6b8e23]/15 text-[#334414]"
                        : "border-stone-200 bg-white hover:border-[#6b8e23]"
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    🏡 ΚΑΜΠΟΣ
                  </button>
                  <button
                    type="button"
                    disabled={!hasHome && availablePeople.length === 0}
                    onClick={() => {
                      setArea("home");
                      setSubject("");
                    }}
                    className={`rounded-2xl border px-3 py-4 text-left text-sm font-black transition md:p-4 md:text-base ${
                      area === "home"
                        ? "border-[#4a6984] bg-[#4a6984]/15 text-[#263847]"
                        : "border-stone-200 bg-white hover:border-[#4a6984]"
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    🏠 ΣΠΙΤΙ
                  </button>
                </div>
              </div>

              {area === "home" ? (
                <div>
                  <p className="mb-2 text-sm font-black text-[#5d4037]">
                    Πρόσωπο {needsPerson ? "— υποχρεωτικό" : ""}
                  </p>
                  <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
                    {hasHome ? (
                      <button
                        type="button"
                        onClick={() => {
                          setPerson("");
                          setSubject("");
                        }}
                        className={`rounded-2xl border px-3 py-3 text-sm font-black md:rounded-full md:py-2 ${
                          person === ""
                            ? "border-slate-950 bg-slate-950 text-white"
                            : "border-stone-200 bg-white"
                        }`}
                      >
                        🏠 ΣΠΙΤΙ γενικά
                      </button>
                    ) : null}

                    {availablePeople.map((item) => (
                      <button
                        key={item.slug}
                        type="button"
                        onClick={() => {
                          setPerson(item.slug);
                          setSubject("");
                        }}
                        className={`rounded-2xl border px-3 py-3 text-sm font-black md:rounded-full md:py-2 ${
                          person === item.slug
                            ? "border-slate-950 bg-slate-950 text-white"
                            : "border-stone-200 bg-white"
                        }`}
                      >
                        {item.icon} {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {needsSubject ? (
                <div>
                  <p className="mb-2 text-sm font-black text-[#5d4037]">
                    Μάθημα
                  </p>
                  <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
                    {staffTuitionSubjects.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSubject(item)}
                        className={`rounded-2xl border px-3 py-3 text-sm font-black md:rounded-full md:py-2 ${
                          subject === item
                            ? "border-slate-950 bg-slate-950 text-white"
                            : "border-stone-200 bg-white"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-black text-[#5d4037]">
                Επιλογή: {selectedCategory?.icon} {selectedCategory?.label} →{" "}
                {entityBySlug(entity)?.icon} {entityBySlug(entity)?.label}
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-[#5d4037]">
                  {category === "service" ? "Σχόλιο υπηρεσίας" : "Σχόλιο / σημείωση"}
                </span>
                <textarea
                  value={comments}
                  onChange={(event) => setComments(event.target.value)}
                  rows={3}
                  placeholder={
                    category === "service"
                      ? "Υποχρεωτικό για Υπηρεσία"
                      : "Προαιρετικό σχόλιο"
                  }
                  className="w-full resize-y rounded-2xl border border-stone-200 bg-white px-4 py-3 font-medium outline-none ring-[#bc6c25]/20 focus:ring-4"
                />
              </label>

              <button
                type="submit"
                disabled={saving}
                className="sticky bottom-3 z-10 w-full rounded-2xl bg-gradient-to-r from-[#bc6c25] to-[#5d4037] px-5 py-4 text-base font-black text-white shadow-xl shadow-[#bc6c25]/20 transition hover:scale-[1.01] disabled:cursor-progress disabled:opacity-60 md:static"
              >
                {saving ? "Αποθήκευση..." : "Καταχώρηση εξόδου"}
              </button>
            </form>
          </section>

          <section className="space-y-4 md:space-y-6">
            <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-xl shadow-stone-900/10 md:rounded-[2rem] md:p-6">
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#bc6c25]">
                    Reports
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-[#5d4037]">
                    Αναζήτηση & σύνολα
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap">
                  <button
                    type="button"
                    onClick={exportCsv}
                    className="rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-black text-slate-800 hover:bg-stone-50 md:px-4 md:text-sm"
                  >
                    CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-black text-slate-800 hover:bg-stone-50 md:px-4 md:text-sm"
                  >
                    PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => void loadExpenses()}
                    className="rounded-full bg-slate-950 px-3 py-2 text-xs font-black text-white md:px-4 md:text-sm"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-3 md:gap-3">
                <input
                  value={filterMonth}
                  onChange={(event) => setFilterMonth(event.target.value)}
                  type="month"
                  className="rounded-2xl border border-stone-200 bg-white px-4 py-3 font-bold outline-none"
                />
                <select
                  value={filterAccount}
                  onChange={(event) => setFilterAccount(event.target.value as FilterAccount)}
                  className="rounded-2xl border border-stone-200 bg-white px-4 py-3 font-bold outline-none"
                >
                  <option value="all">Όλα</option>
                  <option value="kampos">ΚΑΜΠΟΣ</option>
                  <option value="family">ΣΠΙΤΙ</option>
                </select>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Αναζήτηση π.χ. ΔΕΗ, Lidl"
                  className="rounded-2xl border border-stone-200 bg-white px-4 py-3 font-bold outline-none"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
                <div className="rounded-2xl bg-slate-950 p-3 text-white md:p-4">
                  <p className="text-[10px] font-black uppercase text-white/60 md:text-xs">
                    Φίλτρο
                  </p>
                  <p className="mt-1 text-lg font-black md:text-2xl">
                    {formatMoney(filteredTotal)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#6b8e23]/15 p-3 text-[#334414] md:p-4">
                  <p className="text-[10px] font-black uppercase md:text-xs">ΚΑΜΠΟΣ</p>
                  <p className="mt-1 text-lg font-black md:text-2xl">
                    {formatMoney(kamposFilteredTotal)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#4a6984]/15 p-3 text-[#263847] md:p-4">
                  <p className="text-[10px] font-black uppercase md:text-xs">ΣΠΙΤΙ</p>
                  <p className="mt-1 text-lg font-black md:text-2xl">
                    {formatMoney(familyFilteredTotal)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#bc6c25]/15 p-3 text-[#5d4037] md:p-4">
                  <p className="text-[10px] font-black uppercase md:text-xs">Κινήσεις</p>
                  <p className="mt-1 text-lg font-black md:text-2xl">
                    {filteredExpenses.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 2xl:grid-cols-[0.75fr_1.25fr] 2xl:gap-6">
              <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-xl shadow-stone-900/10 md:rounded-[2rem] md:p-6">
                <h3 className="text-xl font-black text-[#5d4037]">
                  Σύνολα ανά κατηγορία
                </h3>

                <div className="mt-4 grid gap-2 md:space-y-3">
                  {categoryTotals.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-stone-300 p-5 text-center text-sm font-bold text-slate-500">
                      Δεν υπάρχουν κινήσεις για το φίλτρο.
                    </p>
                  ) : (
                    categoryTotals.map((item) => (
                      <div
                        key={item.slug}
                        className="rounded-2xl border border-stone-200 bg-white p-3 md:p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-black text-[#5d4037]">
                            {item.icon} {item.label}
                          </span>
                          <span className="font-black text-slate-950">
                            {formatMoney(item.total)}
                          </span>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100">
                          <div
                            className="h-full rounded-full bg-[#bc6c25]"
                            style={{
                              width: `${Math.max(
                                8,
                                Math.round((item.total / Math.max(filteredTotal, 1)) * 100),
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-xl shadow-stone-900/10 md:rounded-[2rem] md:p-6">
                <h3 className="text-xl font-black text-[#5d4037]">Κινήσεις</h3>

                <div className="mt-4 rounded-2xl border border-stone-200 bg-white">
                  {loading ? (
                    <p className="p-8 text-center font-black text-slate-500">
                      Φόρτωση από Neon...
                    </p>
                  ) : filteredExpenses.length === 0 ? (
                    <p className="p-8 text-center font-black text-slate-500">
                      Δεν υπάρχουν κινήσεις.
                    </p>
                  ) : (
                    <>
                      <div className="divide-y divide-stone-100 md:hidden">
                        {filteredExpenses.map((expense) => {
                          const expenseCategory = categoryBySlug(expense.category);
                          const expenseEntity = entityBySlug(expense.entity);

                          return (
                            <article key={expense.id} className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-xs font-black text-slate-500">
                                    {formatDate(expense.expenseDate)} • {accountLabel(expense.primaryAccount)}
                                  </p>
                                  <h4 className="mt-1 text-base font-black text-[#5d4037]">
                                    {expenseCategory?.icon} {expenseCategory?.label}
                                  </h4>
                                  <p className="mt-1 text-sm font-bold text-slate-600">
                                    {expenseEntity?.icon} {expenseEntity?.label}
                                  </p>
                                </div>
                                <p className="shrink-0 text-base font-black text-slate-950">
                                  {formatMoney(expense.amount)}
                                </p>
                              </div>
                              {expense.comments ? (
                                <p className="mt-3 rounded-2xl bg-stone-50 px-3 py-2 text-sm font-medium text-slate-600">
                                  {expense.comments}
                                </p>
                              ) : null}
                              <button
                                type="button"
                                onClick={() => void deleteExpense(expense.id)}
                                className="mt-3 rounded-full bg-red-50 px-3 py-2 text-xs font-black text-red-700"
                              >
                                Διαγραφή
                              </button>
                            </article>
                          );
                        })}
                      </div>

                      <div className="hidden max-h-[680px] overflow-auto md:block">
                        <table className="w-full min-w-[820px] text-left text-sm">
                          <thead className="sticky top-0 bg-stone-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                              <th className="px-4 py-3">Ημερομηνία</th>
                              <th className="px-4 py-3">Ποσό</th>
                              <th className="px-4 py-3">Πρωτοβάθμιος</th>
                              <th className="px-4 py-3">Κατηγορία</th>
                              <th className="px-4 py-3">Ενότητα</th>
                              <th className="px-4 py-3">Σχόλιο</th>
                              <th className="px-4 py-3"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredExpenses.map((expense) => {
                              const expenseCategory = categoryBySlug(expense.category);
                              const expenseEntity = entityBySlug(expense.entity);

                              return (
                                <tr
                                  key={expense.id}
                                  className="border-t border-stone-100 align-top"
                                >
                                  <td className="px-4 py-3 font-bold">
                                    {formatDate(expense.expenseDate)}
                                  </td>
                                  <td className="px-4 py-3 font-black text-slate-950">
                                    {formatMoney(expense.amount)}
                                  </td>
                                  <td className="px-4 py-3 font-bold">
                                    {accountLabel(expense.primaryAccount)}
                                  </td>
                                  <td className="px-4 py-3 font-bold">
                                    {expenseCategory?.icon} {expenseCategory?.label}
                                  </td>
                                  <td className="px-4 py-3 font-bold">
                                    {expenseEntity?.icon} {expenseEntity?.label}
                                  </td>
                                  <td className="max-w-xs px-4 py-3 text-slate-600">
                                    {expense.comments || "—"}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <button
                                      type="button"
                                      onClick={() => void deleteExpense(expense.id)}
                                      className="rounded-full bg-red-50 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-100"
                                    >
                                      Διαγραφή
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
