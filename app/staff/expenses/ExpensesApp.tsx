"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Download,
  List,
  Plus,
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
import { ExpensesPwaInstall } from "./ExpensesPwaInstall";

/* ------------------------------------------------------------------ types */

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

type MonthlyPoint = {
  month: string;
  account: StaffExpenseAccount;
  category: string;
  total: number;
  count: number;
};

type UsagePoint = { account: StaffExpenseAccount; category: string; count: number };

type ExpensesResponse = {
  expenses: StaffExpense[];
  summary: ExpenseSummary;
  monthly?: MonthlyPoint[];
  usage?: UsagePoint[];
};

type Tab = "add" | "analysis" | "list";
type FilterAccount = "all" | StaffExpenseAccount;
type ToastState = { message: string; canUndo?: boolean };

type ExpensePayload = {
  expenseDate: string;
  amount: string;
  category: string;
  entity: string;
  comments: string;
};

/* ---------------------------------------------------------------- helpers */

const EMPTY_SUMMARY: ExpenseSummary = {
  todayTotal: 0,
  currentMonthTotal: 0,
  allTotal: 0,
  filteredTotal: 0,
  filteredCount: 0,
  accountTotals: { kampos: 0, family: 0, tailormade: 0 },
  categoryTotals: [],
};

const ACCOUNT_STORAGE_KEY = "staff-expenses:last-account";

function athensToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Athens",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function shiftDate(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function shiftMonth(month: string, delta: number) {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, m - 1 + delta, 1));
  return date.toISOString().slice(0, 7);
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" }).format(amount);
}

function formatMoneyShort(amount: number) {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDay(date: string) {
  return new Intl.DateTimeFormat("el-GR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

function formatMonthLong(month: string) {
  const text = new Intl.DateTimeFormat("el-GR", { month: "long", year: "numeric" }).format(
    new Date(`${month}-15T12:00:00`),
  );
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatMonthShort(month: string) {
  return new Intl.DateTimeFormat("el-GR", { month: "short" })
    .format(new Date(`${month}-15T12:00:00`))
    .replace(".", "");
}

function parseMoney(value: string) {
  let raw = value.trim().replace(/\s/g, "").replace(/€/g, "").replace(/[^0-9.,]/g, "");
  if (!raw) return 0;

  const lastComma = raw.lastIndexOf(",");
  const lastDot = raw.lastIndexOf(".");

  if (lastComma >= 0 && lastDot >= 0) {
    raw = lastComma > lastDot ? raw.replace(/\./g, "").replace(",", ".") : raw.replace(/,/g, "");
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
      raw = decimal.length <= 2 ? `${parts.slice(0, -1).join("")}.${decimal}` : parts.join("");
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

const PERSON_NAMES: Record<string, string> = {
  michalis: "Μιχάλης",
  sideris: "Σιδέρης",
  aggeliki: "Αγγελική",
  stratis: "Στράτης",
};

function personName(slug: string) {
  return PERSON_NAMES[slug] ?? entityBySlug(slug)?.label ?? slug;
}

function formatDayShort(date: string) {
  return new Intl.DateTimeFormat("el-GR", { day: "numeric", month: "short" })
    .format(new Date(`${date}T12:00:00`))
    .replace(".", "");
}

function csvEscape(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

const accountTone: Record<StaffExpenseAccount, string> = {
  kampos: "border-[#78915b] bg-[#edf2e7] text-[#42552f]",
  family: "border-[#7892a5] bg-[#edf3f6] text-[#405866]",
  tailormade: "border-[#b58a51] bg-[#f8f0e3] text-[#71522d]",
};

/* --------------------------------------------------------- small pieces */

function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: Array<{ value: T; label: string; icon?: string; activeClass?: string }>;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex min-w-0 gap-1 rounded-2xl bg-[#ebe3d9] p-1"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1 rounded-xl px-1.5 text-sm font-extrabold whitespace-nowrap transition ${
              active
                ? `border bg-white shadow-sm ${option.activeClass ?? "border-[#c9a77f] text-[#5b3f29]"}`
                : "border border-transparent text-stone-600"
            }`}
          >
            {option.icon ? <span aria-hidden="true">{option.icon}</span> : null}
            <span className="min-w-0 truncate">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function MonthNav({
  month,
  maxMonth,
  onChange,
}: {
  month: string;
  maxMonth: string;
  onChange: (month: string) => void;
}) {
  const atMax = month >= maxMonth;
  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl bg-white p-1 ring-1 ring-stone-200">
      <button
        type="button"
        onClick={() => onChange(shiftMonth(month, -1))}
        className="grid size-11 place-items-center rounded-xl text-stone-600 active:bg-stone-100"
        aria-label="Προηγούμενος μήνας"
      >
        <ChevronLeft className="size-5" />
      </button>
      <p className="text-base font-black">{formatMonthLong(month)}</p>
      <button
        type="button"
        onClick={() => onChange(shiftMonth(month, 1))}
        disabled={atMax}
        className="grid size-11 place-items-center rounded-xl text-stone-600 active:bg-stone-100 disabled:opacity-30"
        aria-label="Επόμενος μήνας"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

function Sheet({
  title,
  eyebrow,
  onClose,
  children,
}: {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-stone-950/40 md:items-center md:justify-center md:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="max-h-[92dvh] w-full overflow-auto overscroll-contain rounded-t-[2rem] bg-[#fbfaf7] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl md:max-w-lg md:rounded-[2rem] md:p-6"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#a86f35]">{eyebrow}</p>
            ) : null}
            <h2 className="mt-0.5 truncate text-2xl font-black text-[#49392f]">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-stone-200 bg-white text-stone-600"
            aria-label="Κλείσιμο"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-11 rounded-full border px-3.5 text-sm font-extrabold transition ${
        active ? "border-[#8c633b] bg-[#f4eadc] text-[#674722]" : "border-stone-200 bg-white text-stone-600"
      }`}
    >
      {children}
    </button>
  );
}

/* --------------------------------------------------- entry / edit sheet */

function ExpenseForm({
  account,
  category,
  initial,
  saving,
  submitLabel,
  onSubmit,
  onDelete,
}: {
  account: StaffExpenseAccount;
  category: string;
  initial?: StaffExpense;
  saving: boolean;
  submitLabel: string;
  onSubmit: (payload: ExpensePayload) => void;
  onDelete?: () => void;
}) {
  const today = athensToday();
  const yesterday = shiftDate(today, -1);
  const initialSubject = initial?.comments.match(/^Μάθημα: ([^—]+?)(?: — |$)/)?.[1] ?? "";
  const initialNote = initialSubject
    ? (initial?.comments.split(" — ").slice(1).join(" — ") ?? "")
    : (initial?.comments ?? "");

  const [amount, setAmount] = useState(initial ? String(initial.amount).replace(".", ",") : "");
  const [expenseDate, setExpenseDate] = useState(initial?.expenseDate ?? today);
  const [person, setPerson] = useState(
    initial && account === "family" && initial.entity !== "home" && canUseCategory(initial.entity, category)
      ? initial.entity
      : "",
  );
  const [subject, setSubject] = useState(initialSubject);
  const [note, setNote] = useState(initialNote);
  const [error, setError] = useState("");
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!initial) amountRef.current?.focus();
  }, [initial]);

  const people = staffExpenseEntities.filter(
    (item) => item.account === "family" && item.slug !== "home" && canUseCategory(item.slug, category),
  );
  const hasHome = canUseCategory("home", category);
  const showPeople = account === "family" && people.length > 0;
  const needsPerson = account === "family" && !hasHome && people.length > 0;
  const showSubject = category === "tuition" && account === "family" && ["michalis", "sideris"].includes(person);
  const parsed = parseMoney(amount);
  const customDate = expenseDate !== today && expenseDate !== yesterday;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (parsed <= 0) return setError("Βάλε ποσό.");
    if (needsPerson && !person) return setError("Διάλεξε για ποιον είναι.");
    if (category === "service" && !note.trim()) return setError("Για την Υπηρεσία γράψε μια σημείωση.");
    setError("");

    const trimmed = note.trim();
    const comments = showSubject && subject
      ? trimmed ? `Μάθημα: ${subject} — ${trimmed}` : `Μάθημα: ${subject}`
      : trimmed;
    const entity = account === "family" ? person || "home" : defaultEntityForAccount(account);

    onSubmit({ expenseDate, amount, category, entity, comments });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center rounded-3xl border-2 border-[#d9c9b9] bg-white px-4 py-2 focus-within:border-[#a86f35]">
        <span className="mr-2 text-3xl font-black text-[#9a7655]">€</span>
        <input
          ref={amountRef}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          inputMode="decimal"
          enterKeyHint="done"
          placeholder="0,00"
          autoComplete="off"
          aria-label="Ποσό"
          className="min-w-0 flex-1 bg-transparent py-1 text-5xl font-black tracking-tight text-[#49392f] tabular-nums outline-none placeholder:text-stone-300"
        />
      </div>

      {showPeople ? (
        <div>
          <p className="mb-2 text-sm font-extrabold text-stone-600">
            Για ποιον{needsPerson ? "" : " · προαιρετικό"}
          </p>
          <div className="flex flex-wrap gap-2">
            {hasHome ? (
              <Chip active={person === ""} onClick={() => { setPerson(""); setSubject(""); }}>
                🏠 Σπίτι
              </Chip>
            ) : null}
            {people.map((item) => (
              <Chip key={item.slug} active={person === item.slug} onClick={() => { setPerson(item.slug); setSubject(""); }}>
                {personName(item.slug)}
              </Chip>
            ))}
          </div>
        </div>
      ) : null}

      {showSubject ? (
        <div>
          <p className="mb-2 text-sm font-extrabold text-stone-600">Μάθημα</p>
          <div className="flex flex-wrap gap-2">
            {staffTuitionSubjects.map((item) => (
              <Chip key={item} active={subject === item} onClick={() => setSubject(subject === item ? "" : item)}>
                {item}
              </Chip>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="mb-2 text-sm font-extrabold text-stone-600">Πότε</p>
        <div className="flex flex-wrap items-center gap-2">
          <Chip active={expenseDate === today} onClick={() => setExpenseDate(today)}>Σήμερα</Chip>
          <Chip active={expenseDate === yesterday} onClick={() => setExpenseDate(yesterday)}>Χθες</Chip>
          <label
            className={`relative inline-flex min-h-11 items-center rounded-full border px-3.5 text-sm font-extrabold ${
              customDate ? "border-[#8c633b] bg-[#f4eadc] text-[#674722]" : "border-stone-200 bg-white text-stone-600"
            }`}
          >
            {customDate ? formatDay(expenseDate) : "Άλλη μέρα"}
            <input
              type="date"
              value={expenseDate}
              max={today}
              onChange={(event) => event.target.value && setExpenseDate(event.target.value)}
              className="absolute inset-0 opacity-0"
              aria-label="Επιλογή ημερομηνίας"
            />
          </label>
        </div>
      </div>

      <input
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder={category === "service" ? "Σημείωση (υποχρεωτική) π.χ. τεχνικός" : "Σημείωση (προαιρετικά)"}
        className="min-h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-base font-semibold outline-none focus:border-[#b17a43]"
      />

      {error ? <p className="text-sm font-extrabold text-red-700" role="alert">{error}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#805536] px-4 text-lg font-black text-white shadow-lg shadow-stone-400/30 active:scale-[0.99] disabled:opacity-60"
      >
        {saving ? "Αποθήκευση..." : parsed > 0 ? `${submitLabel} ${formatMoney(parsed)}` : submitLabel}
      </button>

      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red-50 text-sm font-extrabold text-red-700"
        >
          <Trash2 className="size-4" /> Διαγραφή εξόδου
        </button>
      ) : null}
    </form>
  );
}

function EditSheet({
  expense,
  saving,
  onClose,
  onSave,
  onDelete,
}: {
  expense: StaffExpense;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: ExpensePayload & { id: string }) => void;
  onDelete: () => void;
}) {
  const [category, setCategory] = useState(expense.category);
  const account = expense.primaryAccount;
  const allowed = categoriesForAccount(account);
  const meta = categoryBySlug(category);

  return (
    <Sheet title={`${meta?.icon ?? ""} ${meta?.label ?? category}`} eyebrow={`Επεξεργασία · ${accountLabel(account)}`} onClose={onClose}>
      <label className="mb-4 block">
        <span className="mb-1.5 block text-sm font-extrabold text-stone-600">Κατηγορία</span>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="min-h-12 w-full rounded-2xl border border-stone-200 bg-white px-3 font-bold outline-none focus:border-[#b17a43]"
        >
          {allowed.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.icon} {item.label}
            </option>
          ))}
        </select>
      </label>
      <ExpenseForm
        key={category}
        account={account}
        category={category}
        initial={expense}
        saving={saving}
        submitLabel="Αποθήκευση"
        onSubmit={(payload) => onSave({ ...payload, id: expense.id })}
        onDelete={onDelete}
      />
    </Sheet>
  );
}

/* ---------------------------------------------------------- expense row */

function ExpenseRow({ expense, onClick, showAccount }: { expense: StaffExpense; onClick: () => void; showAccount?: boolean }) {
  const category = categoryBySlug(expense.category);
  const who = expense.primaryAccount === "family" && expense.entity !== "home" ? personName(expense.entity) : null;
  const sub = [showAccount ? accountLabel(expense.primaryAccount) : null, who, expense.comments || null]
    .filter(Boolean)
    .join(" · ");
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-stone-50"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f2e7da] text-lg" aria-hidden="true">
        {category?.icon ?? "🧾"}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-black text-[#49392f]">{category?.label ?? expense.category}</span>
        {sub ? <span className="block truncate text-xs font-bold text-stone-500">{sub}</span> : null}
      </span>
      <span className="shrink-0 text-base font-black tabular-nums text-[#49392f]">{formatMoney(expense.amount)}</span>
    </button>
  );
}

/* ------------------------------------------------------------- main app */

export default function ExpensesApp() {
  const today = athensToday();
  const thisMonth = today.slice(0, 7);

  const [tab, setTab] = useState<Tab>("add");
  const [account, setAccount] = useState<StaffExpenseAccount>("kampos");
  const [entryCategory, setEntryCategory] = useState<string | null>(null);
  const [editing, setEditing] = useState<StaffExpense | null>(null);
  const [pendingDelete, setPendingDelete] = useState<StaffExpense | null>(null);
  const [lastDeleted, setLastDeleted] = useState<StaffExpense | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [month, setMonth] = useState(thisMonth);
  const [filterAccount, setFilterAccount] = useState<FilterAccount>("all");
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  // base data: recent entries, global totals, 12-month trend, usage counts
  const [recent, setRecent] = useState<StaffExpense[]>([]);
  const [globalSummary, setGlobalSummary] = useState<ExpenseSummary>(EMPTY_SUMMARY);
  const [monthly, setMonthly] = useState<MonthlyPoint[]>([]);
  const [usage, setUsage] = useState<UsagePoint[]>([]);
  // period data: the selected month / account / search
  const [periodExpenses, setPeriodExpenses] = useState<StaffExpense[]>([]);
  const [periodSummary, setPeriodSummary] = useState<ExpenseSummary>(EMPTY_SUMMARY);
  const [periodLoading, setPeriodLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);
      if (stored === "kampos" || stored === "family" || stored === "tailormade") setAccount(stored);
    } catch {
      /* storage unavailable */
    }
  }, []);

  function chooseAccount(next: StaffExpenseAccount) {
    setAccount(next);
    try {
      window.localStorage.setItem(ACCOUNT_STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }

  const modalOpen = Boolean(entryCategory || editing || pendingDelete);
  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setEntryCategory(null);
      setEditing(null);
      setPendingDelete(null);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen]);

  function showToast(message: string, canUndo = false) {
    setToast({ message, canUndo });
    window.setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, canUndo ? 6500 : 3000);
  }

  const fetchExpenses = useCallback(async (params: Record<string, string>) => {
    const query = new URLSearchParams(params);
    const response = await fetch(`/api/staff/expenses/?${query.toString()}`, {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (!response.ok) throw new Error(String(response.status));
    return (await response.json()) as ExpensesResponse;
  }, []);

  const loadBase = useCallback(async () => {
    try {
      const data = await fetchExpenses({ month: "", account: "", search: "", limit: "20" });
      setRecent(data.expenses.slice(0, 8));
      setGlobalSummary(data.summary);
      setMonthly(data.monthly ?? []);
      setUsage(data.usage ?? []);
    } catch {
      showToast("Δεν φορτώθηκαν τα έξοδα.");
    }
  }, [fetchExpenses]);

  const loadPeriod = useCallback(async () => {
    setPeriodLoading(true);
    try {
      const data = await fetchExpenses({
        month,
        account: filterAccount === "all" ? "" : filterAccount,
        search: search.trim(),
        limit: "500",
      });
      setPeriodExpenses(data.expenses);
      setPeriodSummary(data.summary);
    } catch {
      showToast("Δεν φορτώθηκαν τα έξοδα.");
    } finally {
      setPeriodLoading(false);
    }
  }, [fetchExpenses, month, filterAccount, search]);

  useEffect(() => {
    void loadBase();
  }, [loadBase]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadPeriod(), search ? 280 : 0);
    return () => window.clearTimeout(timer);
  }, [loadPeriod, search]);

  async function refreshAll() {
    await Promise.all([loadBase(), loadPeriod()]);
  }

  /* -------------------------------------------------------- mutations */

  async function send(method: "POST" | "PATCH", body: Record<string, unknown>) {
    const response = await fetch("/api/staff/expenses/", {
      method,
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json()) as { message?: string; expense?: StaffExpense };
    return response.ok && data.expense ? { expense: data.expense } : { error: data.message ?? "Κάτι πήγε στραβά." };
  }

  async function addExpense(payload: ExpensePayload) {
    setSaving(true);
    try {
      const result = await send("POST", { ...payload });
      if ("error" in result) return showToast(result.error);
      setEntryCategory(null);
      showToast(`✓ ${categoryBySlug(payload.category)?.label} ${formatMoney(result.expense.amount)}`);
      await refreshAll();
    } finally {
      setSaving(false);
    }
  }

  async function updateExpense(payload: ExpensePayload & { id: string }) {
    setSaving(true);
    try {
      const result = await send("PATCH", { ...payload });
      if ("error" in result) return showToast(result.error);
      setEditing(null);
      showToast("Το έξοδο ενημερώθηκε.");
      await refreshAll();
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const expense = pendingDelete;
    setPendingDelete(null);
    setEditing(null);
    const response = await fetch(`/api/staff/expenses/?id=${encodeURIComponent(expense.id)}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    const data = (await response.json()) as { message?: string; expense?: StaffExpense };
    if (!response.ok || !data.expense) return showToast(data.message ?? "Δεν διαγράφηκε.");
    setLastDeleted(data.expense);
    showToast("Το έξοδο διαγράφηκε.", true);
    await refreshAll();
  }

  async function undoDelete() {
    if (!lastDeleted) return;
    const expense = lastDeleted;
    setLastDeleted(null);
    setToast(null);
    const result = await send("POST", {
      expenseDate: expense.expenseDate,
      category: expense.category,
      entity: expense.entity,
      amount: expense.amount,
      comments: expense.comments,
    });
    if ("error" in result) return showToast(result.error);
    showToast("Το έξοδο επανήλθε.");
    await refreshAll();
  }

  function exportCsv() {
    const header = ["Ημερομηνία", "Ποσό", "Λογαριασμός", "Κατηγορία", "Ενότητα", "Σχόλιο"];
    const rows = periodExpenses.map((expense) => [
      expense.expenseDate,
      expense.amount.toFixed(2).replace(".", ","),
      accountLabel(expense.primaryAccount),
      categoryBySlug(expense.category)?.label ?? expense.category,
      entityBySlug(expense.entity)?.label ?? expense.entity,
      expense.comments,
    ]);
    const csv = [header, ...rows].map((row) => row.map(csvEscape).join(";")).join("\n");
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `exoda-${month}${filterAccount === "all" ? "" : `-${filterAccount}`}.csv`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  /* -------------------------------------------------------- derived */

  // categories for the entry grid, most-used first
  const entryCategories = useMemo(() => {
    const counts = new Map(usage.filter((u) => u.account === account).map((u) => [u.category, u.count]));
    const order = categoriesForAccount(account);
    return [...order].sort((a, b) => (counts.get(b.slug) ?? 0) - (counts.get(a.slug) ?? 0));
  }, [usage, account]);

  const monthSpentByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const point of monthly) {
      if (point.month !== thisMonth || point.account !== account) continue;
      map.set(point.category, (map.get(point.category) ?? 0) + point.total);
    }
    return map;
  }, [monthly, thisMonth, account]);

  const accountMonthTotal = useMemo(
    () => [...monthSpentByCategory.values()].reduce((sum, value) => sum + value, 0),
    [monthSpentByCategory],
  );

  const trend = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, index) => shiftMonth(thisMonth, index - 11));
    return months.map((m) => ({
      month: m,
      total: monthly
        .filter((p) => p.month === m && (filterAccount === "all" || p.account === filterAccount))
        .reduce((sum, p) => sum + p.total, 0),
    }));
  }, [monthly, thisMonth, filterAccount]);

  const trendMax = Math.max(1, ...trend.map((t) => t.total));
  const previousTotal = monthly
    .filter((p) => p.month === shiftMonth(month, -1) && (filterAccount === "all" || p.account === filterAccount))
    .reduce((sum, p) => sum + p.total, 0);
  const hasPreviousData = monthly.some((p) => p.month <= shiftMonth(month, -1));

  const categoryRows = useMemo(() => {
    const counts = new Map<string, number>();
    for (const expense of periodExpenses) counts.set(expense.category, (counts.get(expense.category) ?? 0) + 1);
    return periodSummary.categoryTotals.map((row) => ({
      ...row,
      meta: categoryBySlug(row.category),
      count: counts.get(row.category) ?? 0,
    }));
  }, [periodSummary.categoryTotals, periodExpenses]);

  const categoryMax = Math.max(1, ...categoryRows.map((row) => row.total));

  const groupedByDay = useMemo(() => {
    const groups: Array<{ date: string; total: number; items: StaffExpense[] }> = [];
    for (const expense of periodExpenses) {
      const last = groups.at(-1);
      if (last && last.date === expense.expenseDate) {
        last.items.push(expense);
        last.total += expense.amount;
      } else {
        groups.push({ date: expense.expenseDate, total: expense.amount, items: [expense] });
      }
    }
    return groups;
  }, [periodExpenses]);

  const filterOptions: Array<{ value: FilterAccount; label: string; activeClass?: string }> = [
    { value: "all", label: "Όλα" },
    ...staffExpenseAccounts.map((item) => ({
      value: item.slug as FilterAccount,
      label: item.shortLabel,
      activeClass: accountTone[item.slug],
    })),
  ];

  const periodControls = (
    <div className="space-y-2">
      <MonthNav month={month} maxMonth={thisMonth} onChange={(m) => { setMonth(m); setOpenCategory(null); }} />
      <Segmented label="Λογαριασμός" value={filterAccount} options={filterOptions} onChange={(v) => { setFilterAccount(v); setOpenCategory(null); }} />
    </div>
  );

  /* -------------------------------------------------------- render */

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4efe8] pb-[calc(6.5rem+env(safe-area-inset-bottom))] text-[#49392f]">
      {toast ? (
        <div
          className="fixed inset-x-3 top-[calc(.75rem+env(safe-area-inset-top))] z-[70] mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-[#dfd1c2] bg-white px-4 py-3 text-base font-extrabold shadow-xl"
          role="status"
          aria-live="polite"
        >
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

      <div className="mx-auto min-w-0 max-w-2xl px-4 pt-[calc(.75rem+env(safe-area-inset-top))]">
        <header className="mb-4 flex items-center justify-between gap-3">
          <Link
            href="/staff"
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-stone-200 bg-white px-3 text-sm font-extrabold text-[#6a4a35]"
          >
            <ArrowLeft className="size-4" /> Staff
          </Link>
          <div className="text-right">
            <p className="text-xs font-extrabold text-stone-500">Αυτόν τον μήνα</p>
            <p className="text-2xl font-black tabular-nums tracking-tight">{formatMoney(globalSummary.currentMonthTotal)}</p>
          </div>
        </header>

        {/* ------------------------------------------------ ADD */}
        {tab === "add" ? (
          <div className="space-y-4">
            <ExpensesPwaInstall />

            <Segmented
              label="Πού ανήκει το έξοδο"
              value={account}
              onChange={chooseAccount}
              options={staffExpenseAccounts.map((item) => ({
                value: item.slug,
                label: item.shortLabel,
                icon: item.icon,
                activeClass: accountTone[item.slug],
              }))}
            />

            <div className="flex items-baseline justify-between px-1">
              <h1 className="text-lg font-black">Τι πλήρωσες;</h1>
              <p className="text-sm font-bold text-stone-500">
                {formatMonthShort(thisMonth)}: <span className="tabular-nums">{formatMoney(accountMonthTotal)}</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {entryCategories.map((item) => {
                const spent = monthSpentByCategory.get(item.slug) ?? 0;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setEntryCategory(item.slug)}
                    className="flex min-h-[6.25rem] min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border border-stone-200 bg-white px-1.5 py-2 text-center shadow-sm transition active:scale-[0.97] active:bg-[#f6eadc]"
                  >
                    <span className="text-3xl leading-none" aria-hidden="true">{item.icon}</span>
                    <span className="line-clamp-2 text-[13px] leading-tight font-extrabold text-[#4f3d31]">{item.label}</span>
                    <span className={`text-[11px] font-bold tabular-nums ${spent > 0 ? "text-[#8a5f37]" : "text-transparent"}`}>
                      {spent > 0 ? formatMoneyShort(spent) : "–"}
                    </span>
                  </button>
                );
              })}
            </div>

            {recent.length > 0 ? (
              <section>
                <h2 className="mb-2 px-1 text-sm font-black text-stone-600">Τελευταίες καταχωρήσεις</h2>
                <div className="divide-y divide-stone-100 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200">
                  {recent.slice(0, 5).map((expense) => (
                    <div key={expense.id} className="flex items-center">
                      <div className="min-w-0 flex-1">
                        <ExpenseRow expense={expense} showAccount onClick={() => setEditing(expense)} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}

        {/* ------------------------------------------------ ANALYSIS */}
        {tab === "analysis" ? (
          <div className="space-y-4">
            {periodControls}

            <section className="rounded-3xl bg-white p-4 ring-1 ring-stone-200">
              <p className="text-sm font-extrabold text-stone-500">Σύνολο {formatMonthLong(month)}</p>
              <p className="mt-0.5 text-4xl font-black tabular-nums tracking-tight">{formatMoney(periodSummary.filteredTotal)}</p>
              <p className="mt-1 text-sm font-bold text-stone-500">
                {periodSummary.filteredCount} {periodSummary.filteredCount === 1 ? "κίνηση" : "κινήσεις"}
                {hasPreviousData && month >= shiftMonth(thisMonth, -11) ? (
                  <>
                    {" · "}
                    {previousTotal > 0
                      ? `${periodSummary.filteredTotal >= previousTotal ? "+" : "−"}${formatMoney(Math.abs(periodSummary.filteredTotal - previousTotal))} από ${formatMonthShort(shiftMonth(month, -1))}`
                      : `0 € τον ${formatMonthShort(shiftMonth(month, -1))}`}
                  </>
                ) : null}
              </p>

              {/* 12-month trend */}
              <div className="mt-4" role="group" aria-label="Έξοδα ανά μήνα, τελευταίοι 12 μήνες">
                <div className="flex h-28 items-end gap-[2px]">
                  {trend.map((point) => {
                    const selected = point.month === month;
                    const height = point.total > 0 ? Math.max(4, (point.total / trendMax) * 80) : 0;
                    return (
                      <button
                        key={point.month}
                        type="button"
                        onClick={() => { setMonth(point.month); setOpenCategory(null); }}
                        title={`${formatMonthLong(point.month)}: ${formatMoney(point.total)}`}
                        aria-label={`${formatMonthLong(point.month)}: ${formatMoney(point.total)}`}
                        aria-pressed={selected}
                        className="group relative flex h-full min-w-0 flex-1 items-end justify-center"
                      >
                        {selected && point.total > 0 ? (
                          <span className="absolute -top-0.5 z-10 whitespace-nowrap text-[10px] font-black tabular-nums text-[#49392f]">
                            {formatMoneyShort(point.total)}
                          </span>
                        ) : null}
                        <span
                          className={`w-full max-w-7 rounded-t-[4px] transition ${
                            selected ? "bg-[#805536]" : "bg-[#d9c3aa] group-hover:bg-[#c4a27d]"
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="mt-1 flex gap-[2px] border-t border-stone-200 pt-1">
                  {trend.map((point) => (
                    <span
                      key={point.month}
                      className={`min-w-0 flex-1 truncate text-center text-[10px] font-bold ${
                        point.month === month ? "text-[#49392f]" : "text-stone-400"
                      }`}
                    >
                      {formatMonthShort(point.month)}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white ring-1 ring-stone-200">
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <h2 className="text-base font-black">Ανά κατηγορία</h2>
                {periodExpenses.length > 0 ? (
                  <button
                    type="button"
                    onClick={exportCsv}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-stone-200 px-3 text-xs font-extrabold text-stone-600"
                  >
                    <Download className="size-3.5" /> CSV
                  </button>
                ) : null}
              </div>

              {periodLoading && categoryRows.length === 0 ? (
                <p className="p-8 text-center text-sm font-extrabold text-stone-500">Φόρτωση...</p>
              ) : categoryRows.length === 0 ? (
                <p className="p-8 text-center text-sm font-extrabold text-stone-500">Κανένα έξοδο αυτόν τον μήνα.</p>
              ) : (
                <ul className="divide-y divide-stone-100">
                  {categoryRows.map((row) => {
                    const share = periodSummary.filteredTotal > 0 ? (row.total / periodSummary.filteredTotal) * 100 : 0;
                    const open = openCategory === row.category;
                    const items = open ? periodExpenses.filter((e) => e.category === row.category) : [];
                    return (
                      <li key={row.category}>
                        <button
                          type="button"
                          onClick={() => setOpenCategory(open ? null : row.category)}
                          aria-expanded={open}
                          className="w-full px-4 py-3 text-left active:bg-stone-50"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl" aria-hidden="true">{row.meta?.icon ?? "🧾"}</span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[15px] font-black">{row.meta?.label ?? row.category}</span>
                              <span className="block text-xs font-bold text-stone-500">
                                {row.count} {row.count === 1 ? "κίνηση" : "κινήσεις"} · {Math.round(share)}%
                              </span>
                            </span>
                            <span className="shrink-0 text-base font-black tabular-nums">{formatMoney(row.total)}</span>
                            <ChevronRight className={`size-4 shrink-0 text-stone-400 transition ${open ? "rotate-90" : ""}`} />
                          </div>
                          <div className="mt-2 ml-8 h-2 rounded-full bg-[#f1ebe4]">
                            <div
                              className="h-2 rounded-full bg-[#a5764b]"
                              style={{ width: `${Math.max(2, (row.total / categoryMax) * 100)}%` }}
                            />
                          </div>
                        </button>
                        {open ? (
                          <div className="mx-3 mb-3 divide-y divide-stone-100 overflow-hidden rounded-2xl bg-[#faf7f3] ring-1 ring-stone-100">
                            {items.map((expense) => (
                              <button
                                key={expense.id}
                                type="button"
                                onClick={() => setEditing(expense)}
                                className="flex w-full items-center gap-3 px-3 py-2.5 text-left active:bg-white"
                              >
                                <span className="w-14 shrink-0 text-xs font-extrabold text-stone-500">{formatDayShort(expense.expenseDate)}</span>
                                <span className="min-w-0 flex-1 truncate text-sm font-bold text-stone-600">
                                  {[
                                    filterAccount === "all" ? accountLabel(expense.primaryAccount) : null,
                                    expense.primaryAccount === "family" && expense.entity !== "home" ? personName(expense.entity) : null,
                                    expense.comments || null,
                                  ].filter(Boolean).join(" · ") || "—"}
                                </span>
                                <span className="shrink-0 text-sm font-black tabular-nums">{formatMoney(expense.amount)}</span>
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {filterAccount === "all" && periodSummary.filteredTotal > 0 ? (
              <section className="grid grid-cols-3 gap-2">
                {staffExpenseAccounts.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setFilterAccount(item.slug)}
                    className="min-w-0 rounded-2xl bg-white px-2 py-3 text-center ring-1 ring-stone-200"
                  >
                    <p className="truncate text-xs font-extrabold text-stone-500">{item.icon} {item.shortLabel}</p>
                    <p className="mt-0.5 text-sm font-black tabular-nums">{formatMoney(periodSummary.accountTotals[item.slug])}</p>
                  </button>
                ))}
              </section>
            ) : null}
          </div>
        ) : null}

        {/* ------------------------------------------------ LIST */}
        {tab === "list" ? (
          <div className="space-y-3">
            {periodControls}
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Αναζήτηση (κατηγορία, πρόσωπο, σημείωση)"
                className="min-h-12 w-full rounded-2xl border border-stone-200 bg-white pl-10 pr-10 font-bold outline-none focus:border-[#b17a43]"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-stone-500"
                  aria-label="Καθαρισμός αναζήτησης"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </label>

            <p className="px-1 text-sm font-bold text-stone-500">
              {periodSummary.filteredCount} κινήσεις · <span className="font-black text-[#49392f] tabular-nums">{formatMoney(periodSummary.filteredTotal)}</span>
            </p>

            {periodLoading && periodExpenses.length === 0 ? (
              <p className="p-8 text-center text-sm font-extrabold text-stone-500">Φόρτωση...</p>
            ) : groupedByDay.length === 0 ? (
              <p className="rounded-2xl bg-white p-8 text-center text-sm font-extrabold text-stone-500 ring-1 ring-stone-200">
                Δεν βρέθηκαν κινήσεις.
              </p>
            ) : (
              groupedByDay.map((group) => (
                <section key={group.date}>
                  <div className="mb-1 flex items-center justify-between px-1 text-xs font-extrabold text-stone-500">
                    <span>{group.date === today ? "Σήμερα" : group.date === shiftDate(today, -1) ? "Χθες" : formatDay(group.date)}</span>
                    <span className="tabular-nums">{formatMoney(group.total)}</span>
                  </div>
                  <div className="divide-y divide-stone-100 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200">
                    {group.items.map((expense) => (
                      <ExpenseRow key={expense.id} expense={expense} showAccount={filterAccount === "all"} onClick={() => setEditing(expense)} />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        ) : null}
      </div>

      {/* ------------------------------------------------ bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-[#fbfaf7]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
        aria-label="Ενότητες"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-3">
          {([
            { value: "add", label: "Καταχώρηση", Icon: Plus },
            { value: "analysis", label: "Ανάλυση", Icon: BarChart3 },
            { value: "list", label: "Κινήσεις", Icon: List },
          ] as const).map(({ value, label, Icon }) => {
            const active = tab === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => { setTab(value); window.scrollTo({ top: 0 }); }}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs font-extrabold ${
                  active ? "text-[#805536]" : "text-stone-500"
                }`}
              >
                <span className={`grid h-8 w-14 place-items-center rounded-full ${active ? "bg-[#f2e3d1]" : ""}`}>
                  <Icon className="size-5" />
                </span>
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ------------------------------------------------ sheets */}
      {entryCategory ? (
        <Sheet
          title={`${categoryBySlug(entryCategory)?.icon ?? ""} ${categoryBySlug(entryCategory)?.label ?? ""}`}
          eyebrow={`Νέο έξοδο · ${accountLabel(account)}`}
          onClose={() => setEntryCategory(null)}
        >
          <ExpenseForm
            account={account}
            category={entryCategory}
            saving={saving}
            submitLabel="Καταχώρηση"
            onSubmit={(payload) => void addExpense(payload)}
          />
        </Sheet>
      ) : null}

      {editing ? (
        <EditSheet
          expense={editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={(payload) => void updateExpense(payload)}
          onDelete={() => setPendingDelete(editing)}
        />
      ) : null}

      {pendingDelete ? (
        <div className="fixed inset-0 z-[60] flex items-end bg-stone-950/40 md:items-center md:justify-center md:p-6">
          <div
            className="w-full rounded-t-[2rem] bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl md:max-w-sm md:rounded-[2rem] md:pb-5"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-expense-title"
          >
            <h2 id="delete-expense-title" className="text-xl font-black">Διαγραφή εξόδου;</h2>
            <p className="mt-1 text-sm font-medium text-stone-500">
              {categoryBySlug(pendingDelete.category)?.label} · {formatMoney(pendingDelete.amount)} · {formatDay(pendingDelete.expenseDate)}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setPendingDelete(null)} className="min-h-12 rounded-2xl border border-stone-200 bg-white font-extrabold">
                Ακύρωση
              </button>
              <button type="button" onClick={() => void confirmDelete()} className="min-h-12 rounded-2xl bg-red-600 font-extrabold text-white">
                Διαγραφή
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
