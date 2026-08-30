"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Download,
  FileText,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import {
  accountLabel,
  categoriesForAccount,
  staffExpenseAccounts,
  staffExpenseCategories,
  staffExpenseEntities,
  staffExpenseEntityCategoryMap,
  staffTuitionSubjects,
  type StaffExpenseAccount,
} from "@/lib/staff-expenses-config";

type StaffExpense = {
  id: string;
  expenseDate: string;
  primaryAccount: StaffExpenseAccount;
  category: string;
  entity: string;
  amount: number;
  comments: string;
  createdAt: string;
  updatedAt: string;
};

type ExpenseSummary = {
  todayTotal: number;
  currentMonthTotal: number;
  allTotal: number;
  filteredTotal: number;
  filteredCount: number;
  accountTotals: Record<StaffExpenseAccount, number>;
  categoryTotals: Array<{ category: string; total: number }>;
};

type ExpensesResponse = {
  expenses: StaffExpense[];
  summary: ExpenseSummary;
};

type FilterAccount = "all" | StaffExpenseAccount;

type ToastState = {
  message: string;
  canUndo?: boolean;
};

const EMPTY_SUMMARY: ExpenseSummary = {
  todayTotal: 0,
  currentMonthTotal: 0,
  allTotal: 0,
  filteredTotal: 0,
  filteredCount: 0,
  accountTotals: { kampos: 0, family: 0, tailormade: 0 },
  categoryTotals: [],
};

const QUICK_CATEGORY_SLUGS: Record<StaffExpenseAccount, string[]> = {
  kampos: [
    "supermarket",
    "fuel",
    "cleaning_supplies",
    "service",
    "electricity",
    "tools",
  ],
  family: [
    "supermarket",
    "fuel",
    "tuition",
    "delivery",
    "electricity",
    "entertainment",
  ],
  tailormade: [
    "fuel",
    "travel",
    "service",
    "supermarket",
    "car",
    "mobile",
  ],
};

const accountButtonStyles: Record<StaffExpenseAccount, { active: string; idle: string }> = {
  kampos: {
    active: "border-[#78915b] bg-[#edf2e7] text-[#42552f] shadow-sm",
    idle: "border-stone-200 bg-white text-[#5b4a40]",
  },
  family: {
    active: "border-[#7892a5] bg-[#edf3f6] text-[#405866] shadow-sm",
    idle: "border-stone-200 bg-white text-[#5b4a40]",
  },
  tailormade: {
    active: "border-[#b58a51] bg-[#f8f0e3] text-[#71522d] shadow-sm",
    idle: "border-stone-200 bg-white text-[#5b4a40]",
  },
};

function athensToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Athens",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function currentMonth() {
  return athensToday().slice(0, 7);
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function parseMoney(value: string) {
  let raw = value
    .trim()
    .replace(/\s/g, "")
    .replace(/€/g, "")
    .replace(/[^0-9.,]/g, "");

  if (!raw) return 0;

  const lastComma = raw.lastIndexOf(",");
  const lastDot = raw.lastIndexOf(".");

  if (lastComma >= 0 && lastDot >= 0) {
    raw = lastComma > lastDot
      ? raw.replace(/\./g, "").replace(",", ".")
      : raw.replace(/,/g, "");
  } else if (lastComma >= 0) {
    const parts = raw.split(",");
    if (parts.length > 2) {
      const decimal = parts.pop() ?? "";
      raw = `${parts.join("")}.${decimal}`;
    } else {
      raw = raw.replace(",", ".");
    }
  } else if (lastDot >= 0) {
    const parts = raw.split(".");
    if (parts.length === 2 && parts[1].length === 3 && parts[0].length <= 3) {
      raw = parts.join("");
    } else if (parts.length > 2) {
      const decimal = parts.at(-1) ?? "";
      raw = decimal.length <= 2
        ? `${parts.slice(0, -1).join("")}.${decimal}`
        : parts.join("");
    }
  }

  const amount = Number(raw);
  return Number.isFinite(amount) ? Math.round(amount * 100) / 100 : 0;
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

function defaultEntityForAccount(account: StaffExpenseAccount) {
  if (account === "kampos") return "kampos";
  if (account === "tailormade") return "tailormade";
  return "home";
}

function csvEscape(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function ExpenseAccountPicker({
  value,
  onChange,
}: {
  value: StaffExpenseAccount;
  onChange: (account: StaffExpenseAccount) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {staffExpenseAccounts.map((account) => {
        const active = account.slug === value;
        const styles = accountButtonStyles[account.slug];
        return (
          <button
            key={account.slug}
            type="button"
            onClick={() => onChange(account.slug)}
            className={`min-h-14 rounded-2xl border px-2 py-3 text-center text-sm font-extrabold transition active:scale-[0.98] ${
              active ? styles.active : styles.idle
            }`}
          >
            <span className="block text-lg" aria-hidden="true">
              {account.icon}
            </span>
            <span className="mt-0.5 block">{account.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}

function EditExpenseModal({
  expense,
  saving,
  onClose,
  onSave,
}: {
  expense: StaffExpense;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: {
    id: string;
    expenseDate: string;
    amount: string;
    category: string;
    entity: string;
    comments: string;
  }) => void;
}) {
  const [account, setAccount] = useState<StaffExpenseAccount>(expense.primaryAccount);
  const [expenseDate, setExpenseDate] = useState(expense.expenseDate);
  const [amount, setAmount] = useState(String(expense.amount).replace(".", ","));
  const [category, setCategory] = useState(expense.category);
  const [entity, setEntity] = useState(expense.entity);
  const [comments, setComments] = useState(expense.comments);

  const allowedCategories = categoriesForAccount(account);
  const familyEntities = staffExpenseEntities.filter(
    (item) => item.account === "family" && canUseCategory(item.slug, category),
  );

  function changeAccount(nextAccount: StaffExpenseAccount) {
    setAccount(nextAccount);
    const nextAllowed = categoriesForAccount(nextAccount);
    const nextCategory = nextAllowed.some((item) => item.slug === category)
      ? category
      : nextAllowed[0]?.slug ?? category;
    setCategory(nextCategory);
    setEntity(defaultEntityForAccount(nextAccount));
  }

  function changeCategory(nextCategory: string) {
    setCategory(nextCategory);
    if (account !== "family") {
      setEntity(defaultEntityForAccount(account));
      return;
    }

    if (!canUseCategory(entity, nextCategory)) {
      setEntity(canUseCategory("home", nextCategory) ? "home" : "");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-stone-950/35 p-0 md:items-center md:justify-center md:p-6">
      <div className="max-h-[92vh] w-full overflow-auto rounded-t-[2rem] bg-[#fbfaf7] p-4 shadow-2xl md:max-w-xl md:rounded-[2rem] md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#a86f35]">
              Επεξεργασία
            </p>
            <h2 className="mt-1 text-2xl font-black text-[#49392f]">Αλλαγή εξόδου</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 place-items-center rounded-full border border-stone-200 bg-white text-stone-600"
            aria-label="Κλείσιμο"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4">
          <ExpenseAccountPicker value={account} onChange={changeAccount} />

          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="mb-1.5 block text-xs font-extrabold text-stone-600">Ημερομηνία</span>
              <input
                type="date"
                value={expenseDate}
                onChange={(event) => setExpenseDate(event.target.value)}
                className="min-h-12 w-full rounded-2xl border border-stone-200 bg-white px-3 font-bold outline-none focus:border-[#b17a43]"
              />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-extrabold text-stone-600">Ποσό</span>
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                inputMode="decimal"
                className="min-h-12 w-full rounded-2xl border border-stone-200 bg-white px-3 font-extrabold outline-none focus:border-[#b17a43]"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-extrabold text-stone-600">Κατηγορία</span>
            <select
              value={category}
              onChange={(event) => changeCategory(event.target.value)}
              className="min-h-12 w-full rounded-2xl border border-stone-200 bg-white px-3 font-bold outline-none focus:border-[#b17a43]"
            >
              {allowedCategories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.icon} {item.label}
                </option>
              ))}
            </select>
          </label>

          {account === "family" ? (
            <div>
              <p className="mb-1.5 text-xs font-extrabold text-stone-600">Ενότητα / πρόσωπο</p>
              <div className="flex flex-wrap gap-2">
                {familyEntities.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setEntity(item.slug)}
                    className={`min-h-11 rounded-full border px-3 text-sm font-extrabold ${
                      entity === item.slug
                        ? "border-[#8c633b] bg-[#f4eadc] text-[#674722]"
                        : "border-stone-200 bg-white text-stone-600"
                    }`}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <label className="block">
            <span className="mb-1.5 block text-xs font-extrabold text-stone-600">Σημείωση</span>
            <textarea
              value={comments}
              onChange={(event) => setComments(event.target.value)}
              rows={3}
              className="w-full resize-none rounded-2xl border border-stone-200 bg-white px-3 py-3 font-medium outline-none focus:border-[#b17a43]"
            />
          </label>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              onSave({
                id: expense.id,
                expenseDate,
                amount,
                category,
                entity: entity || defaultEntityForAccount(account),
                comments,
              })
            }
            className="min-h-14 w-full rounded-2xl bg-[#805536] px-4 text-base font-black text-white shadow-lg shadow-stone-400/20 disabled:opacity-60"
          >
            {saving ? "Αποθήκευση..." : "Αποθήκευση αλλαγών"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExpensesApp() {
  const [expenses, setExpenses] = useState<StaffExpense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<StaffExpense | null>(null);
  const [pendingDelete, setPendingDelete] = useState<StaffExpense | null>(null);
  const [lastDeleted, setLastDeleted] = useState<StaffExpense | null>(null);

  const [expenseDate, setExpenseDate] = useState(athensToday());
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState<StaffExpenseAccount>("kampos");
  const [category, setCategory] = useState("supermarket");
  const [person, setPerson] = useState("");
  const [subject, setSubject] = useState("");
  const [comments, setComments] = useState("");
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  const [filterMonth, setFilterMonth] = useState(currentMonth());
  const [filterAccount, setFilterAccount] = useState<FilterAccount>("all");
  const [search, setSearch] = useState("");
  const [reportsOpen, setReportsOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const allowedCategories = categoriesForAccount(account);
  const quickCategories = QUICK_CATEGORY_SLUGS[account]
    .map(categoryBySlug)
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .filter((item) => allowedCategories.some((allowed) => allowed.slug === item.slug));

  const filteredCategoryPickerItems = allowedCategories.filter((item) =>
    `${item.label} ${item.slug}`.toLowerCase().includes(categorySearch.trim().toLowerCase()),
  );

  const familyPeople = staffExpenseEntities.filter(
    (item) => item.account === "family" && item.slug !== "home",
  );
  const availablePeople = familyPeople.filter((item) => canUseCategory(item.slug, category));
  const hasHome = canUseCategory("home", category);
  const needsPerson = account === "family" && !hasHome && availablePeople.length > 0;
  const needsSubject =
    category === "tuition" && account === "family" && ["michalis", "sideris"].includes(person);
  const entity =
    account === "kampos"
      ? "kampos"
      : account === "tailormade"
        ? "tailormade"
        : person || "home";
  const selectedCategory = categoryBySlug(category);
  const selectedEntity = entityBySlug(entity);
  const parsedAmount = parseMoney(amount);

  const categoryTotals = useMemo(
    () =>
      summary.categoryTotals
        .map((item) => ({ ...item, meta: categoryBySlug(item.category) }))
        .filter((item) => item.meta),
    [summary.categoryTotals],
  );

  function showToast(message: string, canUndo = false) {
    setToast({ message, canUndo });
    window.setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, canUndo ? 6500 : 3200);
  }

  async function loadExpenses() {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("month", filterMonth);
    params.set("account", filterAccount === "all" ? "" : filterAccount);
    params.set("search", search.trim());
    params.set("limit", "100");

    try {
      const response = await fetch(`/api/staff/expenses?${params.toString()}`, {
        credentials: "same-origin",
        cache: "no-store",
      });

      if (!response.ok) {
        showToast("Δεν φορτώθηκαν τα έξοδα.");
        return;
      }

      const data = (await response.json()) as ExpensesResponse;
      setExpenses(data.expenses);
      setSummary(data.summary);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadExpenses();
    }, search ? 280 : 0);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterMonth, filterAccount, search]);

  function chooseAccount(nextAccount: StaffExpenseAccount) {
    setAccount(nextAccount);
    setPerson("");
    setSubject("");
    const nextAllowed = categoriesForAccount(nextAccount);
    if (!nextAllowed.some((item) => item.slug === category)) {
      setCategory(nextAllowed[0]?.slug ?? category);
    }
  }

  function chooseCategory(nextCategory: string) {
    setCategory(nextCategory);
    setCategoryPickerOpen(false);
    setCategorySearch("");
    setSubject("");

    if (account !== "family") {
      setPerson("");
      return;
    }

    if (person && !canUseCategory(person, nextCategory)) {
      setPerson("");
    }
  }

  async function addExpense(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (parsedAmount <= 0) {
      showToast("Βάλε σωστό ποσό.");
      return;
    }
    if (needsPerson && !person) {
      showToast("Επίλεξε πρόσωπο.");
      return;
    }
    if (needsSubject && !subject) {
      showToast("Επίλεξε μάθημα.");
      return;
    }
    if (category === "service" && comments.trim().length === 0) {
      showToast("Για την Υπηρεσία χρειάζεται σημείωση.");
      return;
    }

    const finalComments =
      needsSubject && subject
        ? comments.trim()
          ? `Μάθημα: ${subject} — ${comments.trim()}`
          : `Μάθημα: ${subject}`
        : comments.trim();

    setSaving(true);
    try {
      const response = await fetch("/api/staff/expenses/", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          expenseDate,
          category,
          entity,
          amount,
          comments: finalComments,
        }),
      });
      const data = (await response.json()) as { message?: string; expense?: StaffExpense };

      if (!response.ok || !data.expense) {
        showToast(data.message ?? "Δεν αποθηκεύτηκε.");
        return;
      }

      setAmount("");
      setComments("");
      setSubject("");
      setPerson("");
      setExpenseDate(athensToday());
      showToast(`Καταχωρήθηκε ${formatMoney(data.expense.amount)}.`);
      await loadExpenses();
    } finally {
      setSaving(false);
    }
  }

  async function updateExpense(payload: {
    id: string;
    expenseDate: string;
    amount: string;
    category: string;
    entity: string;
    comments: string;
  }) {
    if (parseMoney(payload.amount) <= 0) {
      showToast("Βάλε σωστό ποσό.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/staff/expenses/", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { message?: string; expense?: StaffExpense };

      if (!response.ok || !data.expense) {
        showToast(data.message ?? "Δεν ενημερώθηκε.");
        return;
      }

      setEditing(null);
      showToast("Το έξοδο ενημερώθηκε.");
      await loadExpenses();
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const expense = pendingDelete;
    setPendingDelete(null);

    const response = await fetch(`/api/staff/expenses/?id=${encodeURIComponent(expense.id)}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    const data = (await response.json()) as { message?: string; expense?: StaffExpense };

    if (!response.ok || !data.expense) {
      showToast(data.message ?? "Δεν διαγράφηκε.");
      return;
    }

    setLastDeleted(data.expense);
    showToast("Το έξοδο διαγράφηκε.", true);
    await loadExpenses();
  }

  async function undoDelete() {
    if (!lastDeleted) return;
    const expense = lastDeleted;
    setLastDeleted(null);
    setToast(null);

    const response = await fetch("/api/staff/expenses/", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        expenseDate: expense.expenseDate,
        category: expense.category,
        entity: expense.entity,
        amount: expense.amount,
        comments: expense.comments,
      }),
    });
    const data = (await response.json()) as { message?: string; expense?: StaffExpense };

    if (!response.ok || !data.expense) {
      showToast(data.message ?? "Δεν έγινε επαναφορά.");
      return;
    }

    showToast("Το έξοδο επανήλθε.");
    await loadExpenses();
  }

  async function exportCsv() {
    const params = new URLSearchParams();
    params.set("month", filterMonth);
    params.set("account", filterAccount === "all" ? "" : filterAccount);
    params.set("search", search.trim());
    params.set("limit", "500");

    const response = await fetch(`/api/staff/expenses?${params.toString()}`, {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (!response.ok) {
      showToast("Δεν δημιουργήθηκε το CSV.");
      return;
    }

    const data = (await response.json()) as ExpensesResponse;
    const header = ["Ημερομηνία", "Ποσό", "Λογαριασμός", "Κατηγορία", "Ενότητα", "Σχόλιο"];
    const rows = data.expenses.map((expense) => [
      expense.expenseDate,
      expense.amount.toFixed(2),
      accountLabel(expense.primaryAccount),
      categoryBySlug(expense.category)?.label ?? expense.category,
      entityBySlug(expense.entity)?.label ?? expense.entity,
      expense.comments,
    ]);
    const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `expenses-${filterMonth || "all"}.csv`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#f4efe8] pb-28 text-[#49392f] md:pb-10">
      {toast ? (
        <div className="fixed inset-x-3 top-3 z-[70] mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-[#dfd1c2] bg-white px-4 py-3 text-sm font-extrabold shadow-xl">
          <span>{toast.message}</span>
          {toast.canUndo && lastDeleted ? (
            <button
              type="button"
              onClick={() => void undoDelete()}
              className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-[#f2e7da] px-3 text-[#795333]"
            >
              <Undo2 className="size-4" /> Αναίρεση
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="mx-auto max-w-6xl px-3 py-3 md:px-6 md:py-6">
        <header className="mb-4 flex items-center justify-between gap-3">
          <Link
            href="/staff"
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-stone-200 bg-white px-3 text-sm font-extrabold text-[#6a4a35]"
          >
            <ArrowLeft className="size-4" /> Staff
          </Link>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#a86f35]">
              Voulamandis House
            </p>
            <h1 className="text-2xl font-black tracking-tight">Έξοδα</h1>
          </div>
        </header>

        <section className="mb-4 grid grid-cols-3 gap-2" aria-label="Σύνολα εξόδων">
          <div className="rounded-2xl bg-white px-2 py-3 text-center shadow-sm ring-1 ring-stone-200/70">
            <p className="text-[10px] font-extrabold uppercase text-stone-500">Σήμερα</p>
            <p className="mt-1 text-sm font-black">{formatMoney(summary.todayTotal)}</p>
          </div>
          <div className="rounded-2xl bg-white px-2 py-3 text-center shadow-sm ring-1 ring-stone-200/70">
            <p className="text-[10px] font-extrabold uppercase text-stone-500">Μήνας</p>
            <p className="mt-1 text-sm font-black">{formatMoney(summary.currentMonthTotal)}</p>
          </div>
          <div className="rounded-2xl bg-white px-2 py-3 text-center shadow-sm ring-1 ring-stone-200/70">
            <p className="text-[10px] font-extrabold uppercase text-stone-500">Σύνολο</p>
            <p className="mt-1 text-sm font-black">{formatMoney(summary.allTotal)}</p>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
          <section className="rounded-[1.75rem] bg-[#fbfaf7] p-4 shadow-sm ring-1 ring-stone-200/70 md:p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#a86f35]">Νέα κίνηση</p>
                <h2 className="mt-1 text-xl font-black">Καταχώρηση εξόδου</h2>
              </div>
              <div className="grid size-12 place-items-center rounded-2xl bg-[#f2e7da] text-xl" aria-hidden="true">
                {selectedCategory?.icon ?? "🧾"}
              </div>
            </div>

            <form onSubmit={addExpense} className="space-y-5">
              <div>
                <label htmlFor="expense-amount" className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-stone-500">
                  Ποσό
                </label>
                <div className="flex items-center rounded-3xl border border-[#d9c9b9] bg-white px-4 py-3 shadow-inner shadow-stone-100 focus-within:border-[#a86f35]">
                  <span className="mr-2 text-2xl font-black text-[#9a7655]">€</span>
                  <input
                    id="expense-amount"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    inputMode="decimal"
                    placeholder="0,00"
                    autoComplete="off"
                    className="min-w-0 flex-1 bg-transparent text-4xl font-black tracking-tight text-[#49392f] outline-none placeholder:text-stone-300"
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-stone-500">Πού;</p>
                <ExpenseAccountPicker value={account} onChange={chooseAccount} />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-stone-500">Κατηγορία</p>
                  <button
                    type="button"
                    onClick={() => setCategoryPickerOpen(true)}
                    className="inline-flex min-h-9 items-center gap-1 text-xs font-extrabold text-[#8c6038]"
                  >
                    Όλες <ChevronDown className="size-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {quickCategories.map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => chooseCategory(item.slug)}
                      className={`min-h-12 rounded-2xl border px-3 text-left text-sm font-extrabold transition active:scale-[0.98] ${
                        category === item.slug
                          ? "border-[#b17a43] bg-[#f6eadc] text-[#704c2b]"
                          : "border-stone-200 bg-white text-stone-600"
                      }`}
                    >
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>
                {!quickCategories.some((item) => item.slug === category) ? (
                  <button
                    type="button"
                    onClick={() => setCategoryPickerOpen(true)}
                    className="mt-2 flex min-h-12 w-full items-center justify-between rounded-2xl border border-[#b17a43] bg-[#f6eadc] px-3 text-left text-sm font-extrabold text-[#704c2b]"
                  >
                    <span>{selectedCategory?.icon} {selectedCategory?.label}</span>
                    <ChevronDown className="size-4" />
                  </button>
                ) : null}
              </div>

              {account === "family" && (hasHome || availablePeople.length > 0) ? (
                <div>
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-stone-500">
                    Για ποιον; {needsPerson ? "· υποχρεωτικό" : "· προαιρετικό"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {hasHome ? (
                      <button
                        type="button"
                        onClick={() => {
                          setPerson("");
                          setSubject("");
                        }}
                        className={`min-h-11 rounded-full border px-3 text-sm font-extrabold ${
                          person === ""
                            ? "border-[#7c91a0] bg-[#eef3f5] text-[#405866]"
                            : "border-stone-200 bg-white text-stone-600"
                        }`}
                      >
                        🏠 Σπίτι γενικά
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
                        className={`min-h-11 rounded-full border px-3 text-sm font-extrabold ${
                          person === item.slug
                            ? "border-[#7c91a0] bg-[#eef3f5] text-[#405866]"
                            : "border-stone-200 bg-white text-stone-600"
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
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-stone-500">Μάθημα</p>
                  <div className="flex flex-wrap gap-2">
                    {staffTuitionSubjects.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSubject(item)}
                        className={`min-h-11 rounded-full border px-3 text-sm font-extrabold ${
                          subject === item
                            ? "border-[#9b7448] bg-[#f4eadc] text-[#674722]"
                            : "border-stone-200 bg-white text-stone-600"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-[1fr_auto] gap-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-stone-500">
                    {category === "service" ? "Σημείωση · υποχρεωτική" : "Σημείωση"}
                  </span>
                  <input
                    value={comments}
                    onChange={(event) => setComments(event.target.value)}
                    placeholder={category === "service" ? "π.χ. τεχνικός κλιματισμού" : "Προαιρετικά..."}
                    className="min-h-12 w-full rounded-2xl border border-stone-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#b17a43]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-stone-500">Ημερομηνία</span>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-500" />
                    <input
                      type="date"
                      value={expenseDate}
                      onChange={(event) => setExpenseDate(event.target.value)}
                      className="min-h-12 w-[145px] rounded-2xl border border-stone-200 bg-white pl-9 pr-2 text-xs font-extrabold outline-none focus:border-[#b17a43]"
                    />
                  </div>
                </label>
              </div>

              <div className="rounded-2xl bg-[#f2ede6] px-3 py-2.5 text-xs font-bold text-stone-600">
                {selectedCategory?.icon} {selectedCategory?.label} · {selectedEntity?.icon} {selectedEntity?.label}
                {expenseDate === athensToday() ? " · Σήμερα" : ` · ${formatDate(expenseDate)}`}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="sticky bottom-3 z-20 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#805536] px-4 text-base font-black text-white shadow-xl shadow-stone-400/30 transition active:scale-[0.99] disabled:opacity-60 md:static"
              >
                <Plus className="size-5" />
                {saving
                  ? "Αποθήκευση..."
                  : parsedAmount > 0
                    ? `Καταχώρηση ${formatMoney(parsedAmount)}`
                    : "Καταχώρηση εξόδου"}
              </button>
            </form>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#a86f35]">Ιστορικό</p>
                <h2 className="mt-0.5 text-xl font-black">Πρόσφατες κινήσεις</h2>
              </div>
              <button
                type="button"
                onClick={() => void loadExpenses()}
                className="grid size-11 place-items-center rounded-full border border-stone-200 bg-white text-stone-600"
                aria-label="Ανανέωση"
              >
                <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="rounded-[1.75rem] bg-white shadow-sm ring-1 ring-stone-200/70">
              {loading ? (
                <p className="p-8 text-center text-sm font-extrabold text-stone-500">Φόρτωση...</p>
              ) : expenses.length === 0 ? (
                <p className="p-8 text-center text-sm font-extrabold text-stone-500">Δεν υπάρχουν κινήσεις για το φίλτρο.</p>
              ) : (
                <div className="divide-y divide-stone-100">
                  {expenses.map((expense) => {
                    const expenseCategory = categoryBySlug(expense.category);
                    const expenseEntity = entityBySlug(expense.entity);
                    return (
                      <article key={expense.id} className="p-4 md:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-stone-500">
                              <span>{formatDate(expense.expenseDate)}</span>
                              <span>·</span>
                              <span>{accountLabel(expense.primaryAccount)}</span>
                            </div>
                            <h3 className="mt-1.5 text-base font-black text-[#49392f]">
                              {expenseCategory?.icon} {expenseCategory?.label ?? expense.category}
                            </h3>
                            <p className="mt-0.5 text-sm font-bold text-stone-500">
                              {expenseEntity?.icon} {expenseEntity?.label ?? expense.entity}
                            </p>
                          </div>
                          <p className="shrink-0 text-lg font-black text-[#49392f]">{formatMoney(expense.amount)}</p>
                        </div>

                        {expense.comments ? (
                          <p className="mt-2.5 rounded-xl bg-[#f8f5f1] px-3 py-2 text-sm font-medium leading-5 text-stone-600">
                            {expense.comments}
                          </p>
                        ) : null}

                        <div className="mt-3 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditing(expense)}
                            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 text-xs font-extrabold text-stone-600"
                          >
                            <Pencil className="size-3.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(expense)}
                            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-red-50 px-3 text-xs font-extrabold text-red-700"
                          >
                            <Trash2 className="size-3.5" /> Διαγραφή
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setReportsOpen((value) => !value)}
              className="flex min-h-12 w-full items-center justify-between rounded-2xl border border-stone-200 bg-[#fbfaf7] px-4 text-sm font-extrabold text-[#684a35]"
            >
              <span>Αναζήτηση & αναφορές</span>
              <ChevronDown className={`size-4 transition ${reportsOpen ? "rotate-180" : ""}`} />
            </button>

            {reportsOpen ? (
              <div className="space-y-4 rounded-[1.75rem] bg-[#fbfaf7] p-4 shadow-sm ring-1 ring-stone-200/70 md:p-5">
                <div className="grid gap-2 md:grid-cols-3">
                  <input
                    type="month"
                    value={filterMonth}
                    onChange={(event) => setFilterMonth(event.target.value)}
                    className="min-h-12 rounded-2xl border border-stone-200 bg-white px-3 font-bold outline-none focus:border-[#b17a43]"
                  />
                  <select
                    value={filterAccount}
                    onChange={(event) => setFilterAccount(event.target.value as FilterAccount)}
                    className="min-h-12 rounded-2xl border border-stone-200 bg-white px-3 font-bold outline-none focus:border-[#b17a43]"
                  >
                    <option value="all">Όλα</option>
                    {staffExpenseAccounts.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.icon} {item.label}
                      </option>
                    ))}
                  </select>
                  <label className="relative block">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Αναζήτηση..."
                      className="min-h-12 w-full rounded-2xl border border-stone-200 bg-white pl-9 pr-3 font-bold outline-none focus:border-[#b17a43]"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  <div className="rounded-2xl bg-[#eee5dc] p-3">
                    <p className="text-[10px] font-extrabold uppercase text-stone-500">Φίλτρο</p>
                    <p className="mt-1 text-lg font-black">{formatMoney(summary.filteredTotal)}</p>
                    <p className="text-xs font-bold text-stone-500">{summary.filteredCount} κινήσεις</p>
                  </div>
                  {staffExpenseAccounts.map((item) => (
                    <div key={item.slug} className="rounded-2xl bg-white p-3 ring-1 ring-stone-200">
                      <p className="text-[10px] font-extrabold uppercase text-stone-500">{item.icon} {item.shortLabel}</p>
                      <p className="mt-1 text-lg font-black">{formatMoney(summary.accountTotals[item.slug])}</p>
                    </div>
                  ))}
                </div>

                {categoryTotals.length > 0 ? (
                  <div>
                    <h3 className="mb-2 text-sm font-black">Ανά κατηγορία</h3>
                    <div className="space-y-2">
                      {categoryTotals.slice(0, 8).map((item) => (
                        <div key={item.category} className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 ring-1 ring-stone-200">
                          <span className="text-sm font-bold">{item.meta?.icon} {item.meta?.label}</span>
                          <span className="text-sm font-black">{formatMoney(item.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => void exportCsv()}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white text-sm font-extrabold"
                  >
                    <Download className="size-4" /> CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white text-sm font-extrabold"
                  >
                    <FileText className="size-4" /> PDF / Print
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>

      {categoryPickerOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-stone-950/35 md:items-center md:justify-center md:p-6">
          <div className="max-h-[86vh] w-full overflow-auto rounded-t-[2rem] bg-[#fbfaf7] p-4 shadow-2xl md:max-w-2xl md:rounded-[2rem] md:p-6">
            <div className="sticky top-0 z-10 -mx-1 mb-4 bg-[#fbfaf7] px-1 pb-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#a86f35]">Κατηγορία</p>
                  <h2 className="mt-1 text-xl font-black">Επίλεξε έξοδο</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setCategoryPickerOpen(false)}
                  className="grid size-11 place-items-center rounded-full border border-stone-200 bg-white"
                  aria-label="Κλείσιμο"
                >
                  <X className="size-5" />
                </button>
              </div>
              <label className="relative mt-3 block">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                <input
                  value={categorySearch}
                  onChange={(event) => setCategorySearch(event.target.value)}
                  placeholder="Βρες κατηγορία..."
                  autoFocus
                  className="min-h-12 w-full rounded-2xl border border-stone-200 bg-white pl-9 pr-3 font-bold outline-none focus:border-[#b17a43]"
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {filteredCategoryPickerItems.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => chooseCategory(item.slug)}
                  className={`min-h-14 rounded-2xl border px-3 text-left text-sm font-extrabold ${
                    category === item.slug
                      ? "border-[#b17a43] bg-[#f6eadc] text-[#704c2b]"
                      : "border-stone-200 bg-white text-stone-600"
                  }`}
                >
                  <span className="mr-1 text-lg">{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {editing ? (
        <EditExpenseModal
          expense={editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={(payload) => void updateExpense(payload)}
        />
      ) : null}

      {pendingDelete ? (
        <div className="fixed inset-0 z-[60] flex items-end bg-stone-950/35 md:items-center md:justify-center md:p-6">
          <div className="w-full rounded-t-[2rem] bg-white p-5 shadow-2xl md:max-w-sm md:rounded-[2rem]">
            <div className="grid size-12 place-items-center rounded-2xl bg-red-50 text-red-700">
              <Trash2 className="size-5" />
            </div>
            <h2 className="mt-4 text-xl font-black">Διαγραφή εξόδου;</h2>
            <p className="mt-1 text-sm font-medium text-stone-500">
              {categoryBySlug(pendingDelete.category)?.label} · {formatMoney(pendingDelete.amount)}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="min-h-12 rounded-2xl border border-stone-200 bg-white font-extrabold"
              >
                Ακύρωση
              </button>
              <button
                type="button"
                onClick={() => void confirmDelete()}
                className="min-h-12 rounded-2xl bg-red-600 font-extrabold text-white"
              >
                Διαγραφή
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
