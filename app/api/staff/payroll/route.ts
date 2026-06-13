import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type PayrollWorkRow = {
  id: string | number;
  work_date: string;
  clock_in: string;
  clock_out: string | null;
  hours_decimal: string | number;
  hourly_rate: string | number;
  daily_cost: string | number;
  comments: string | null;
  created_at: string;
  updated_at: string;
};

type PayrollPaymentRow = {
  id: string | number;
  payment_date: string;
  category: "salary" | "ika" | "extra";
  method: "cash" | "bank";
  amount: string | number;
  comments: string | null;
  created_at: string;
  updated_at: string;
};

type PayrollWorkEntry = {
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

type PayrollPayment = {
  id: string;
  paymentDate: string;
  category: "salary" | "ika" | "extra";
  method: "cash" | "bank";
  amount: number;
  comments: string;
};

function unauthorizedResponse() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "www-authenticate": 'Basic realm="Staff Area", charset="UTF-8"',
      "x-robots-tag": "noindex, nofollow",
      "cache-control": "no-store",
    },
  });
}

function isAuthorized(request: NextRequest) {
  const username = process.env.STAFF_USERNAME;
  const password = process.env.STAFF_PASSWORD;

  if (!username || !password) {
    return false;
  }

  const authorization = request.headers.get("authorization");

  if (!authorization || !authorization.startsWith("Basic ")) {
    return false;
  }

  try {
    const decoded = Buffer.from(authorization.slice("Basic ".length), "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return false;
    }

    const providedUsername = decoded.slice(0, separatorIndex);
    const providedPassword = decoded.slice(separatorIndex + 1);

    return providedUsername === username && providedPassword === password;
  } catch {
    return false;
  }
}

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return neon(databaseUrl);
}

async function ensureTables() {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS staff_payroll_work_entries (
      id BIGSERIAL PRIMARY KEY,
      work_date DATE NOT NULL,
      clock_in TIME NOT NULL,
      clock_out TIME NULL,
      hours_decimal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
      hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
      daily_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
      comments TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS staff_payroll_payments (
      id BIGSERIAL PRIMARY KEY,
      payment_date DATE NOT NULL,
      category VARCHAR(20) NOT NULL DEFAULT 'salary' CHECK (category IN ('salary', 'ika', 'extra')),
      method VARCHAR(20) NOT NULL DEFAULT 'bank' CHECK (method IN ('cash', 'bank')),
      amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (amount > 0),
      comments TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS staff_payroll_settings (
      setting_key VARCHAR(80) PRIMARY KEY,
      setting_value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    INSERT INTO staff_payroll_settings (setting_key, setting_value)
    VALUES ('hourly_rate', '0.00')
    ON CONFLICT (setting_key) DO NOTHING
  `;

  await sql`CREATE INDEX IF NOT EXISTS staff_payroll_work_date_idx ON staff_payroll_work_entries (work_date DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS staff_payroll_open_idx ON staff_payroll_work_entries (clock_out)`;
  await sql`CREATE INDEX IF NOT EXISTS staff_payroll_payment_date_idx ON staff_payroll_payments (payment_date DESC)`;
}

function normalizeDate(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "";
  }

  return value;
}

function normalizeTime(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(trimmed)) {
    return "";
  }

  return trimmed;
}

function normalizeMoney(value: unknown) {
  const raw = typeof value === "string" ? value.replace(",", ".") : String(value ?? "");
  const amount = Number.parseFloat(raw.replace(/[^0-9.-]/g, ""));

  if (!Number.isFinite(amount) || amount <= 0) {
    return 0;
  }

  return Math.round(amount * 100) / 100;
}

function toNumber(value: unknown) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return 0;
  }

  return Math.round(amount * 100) / 100;
}

function timeToSeconds(time: string) {
  const parts = time.split(":").map(Number);
  return (parts[0] ?? 0) * 3600 + (parts[1] ?? 0) * 60 + (parts[2] ?? 0);
}

function datePart(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value ?? "").slice(0, 10);
}

function timePart(value: unknown) {
  return String(value ?? "").slice(0, 5);
}

function athensParts() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Athens",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    date: `${map.year}-${map.month}-${map.day}`,
    time: `${map.hour}:${map.minute}:${map.second}`,
  };
}

function mapPayment(row: PayrollPaymentRow): PayrollPayment {
  return {
    id: String(row.id),
    paymentDate: datePart(row.payment_date),
    category: row.category,
    method: row.method,
    amount: toNumber(row.amount),
    comments: row.comments ?? "",
  };
}

function computeLedger(workRows: PayrollWorkRow[], paymentRows: PayrollPaymentRow[], hourlyRate: number) {
  const payments = paymentRows.map(mapPayment);
  const salaryPaid = payments
    .filter((payment) => payment.category === "salary")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const ikaTotal = payments
    .filter((payment) => payment.category === "ika")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const extraTotal = payments
    .filter((payment) => payment.category === "extra")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const salaryCash = payments
    .filter((payment) => payment.category === "salary" && payment.method === "cash")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const salaryBank = payments
    .filter((payment) => payment.category === "salary" && payment.method === "bank")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const extraCash = payments
    .filter((payment) => payment.category === "extra" && payment.method === "cash")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const extraBank = payments
    .filter((payment) => payment.category === "extra" && payment.method === "bank")
    .reduce((sum, payment) => sum + payment.amount, 0);

  let remainingPayment = Math.round(salaryPaid * 100) / 100;
  let totalHours = 0;
  let totalWorkCost = 0;
  let paidWorkCost = 0;
  let currentDebt = 0;
  let currentHours = 0;
  let currentDays = 0;
  let periodStart = "";
  let periodEnd = "";

  const entriesAsc: PayrollWorkEntry[] = workRows
    .slice()
    .sort((a, b) => `${datePart(a.work_date)} ${timePart(a.clock_in)} ${a.id}`.localeCompare(`${datePart(b.work_date)} ${timePart(b.clock_in)} ${b.id}`))
    .map((row) => {
      const dailyCost = toNumber(row.daily_cost);
      const hoursDecimal = toNumber(row.hours_decimal);
      const workDate = datePart(row.work_date);
      const clockOut = row.clock_out ? timePart(row.clock_out) : null;

      totalHours += hoursDecimal;
      totalWorkCost += dailyCost;

      let covered = 0;

      if (remainingPayment > 0 && dailyCost > 0) {
        covered = Math.min(remainingPayment, dailyCost);
        remainingPayment = Math.round((remainingPayment - covered) * 100) / 100;
      }

      const outstanding = Math.max(Math.round((dailyCost - covered) * 100) / 100, 0);
      paidWorkCost += Math.min(covered, dailyCost);

      let status: "paid" | "unpaid" | "open" = "paid";
      let statusLabel = "Εξοφλημένο";

      if (!clockOut) {
        status = "open";
        statusLabel = "Ανοιχτό";
      } else if (outstanding > 0.009) {
        status = "unpaid";
        statusLabel = "Τρέχουσα οφειλή";
        currentDebt += outstanding;
        currentHours += hoursDecimal;
        currentDays += 1;

        if (!periodStart || workDate < periodStart) {
          periodStart = workDate;
        }

        if (!periodEnd || workDate > periodEnd) {
          periodEnd = workDate;
        }
      }

      return {
        id: String(row.id),
        workDate,
        clockIn: timePart(row.clock_in),
        clockOut,
        hoursDecimal,
        hourlyRate: toNumber(row.hourly_rate),
        dailyCost,
        comments: row.comments ?? "",
        paidAmount: Math.round(covered * 100) / 100,
        outstanding,
        status,
        statusLabel,
      };
    });

  const creditBalance = Math.max(Math.round(remainingPayment * 100) / 100, 0);
  let periodText = "Δεν υπάρχει τρέχουσα οφειλή.";

  if (currentDebt > 0 && periodStart && periodEnd) {
    periodText = `Η τρέχουσα οφειλή αφορά από ${periodStart} έως ${periodEnd}.`;
  } else if (creditBalance > 0) {
    periodText = `Δεν υπάρχει οφειλή. Υπάρχει πιστωτικό υπόλοιπο ${creditBalance.toFixed(2)} € για συμψηφισμό με επόμενες ώρες.`;
  }

  const openEntry = entriesAsc.find((entry) => entry.status === "open") ?? null;

  return {
    settings: {
      hourlyRate,
    },
    liveState: openEntry
      ? {
          isOpen: true,
          canClockIn: false,
          canClockOut: true,
          statusText: `Ανοιχτή βάρδια από ${openEntry.workDate} στις ${openEntry.clockIn}.`,
        }
      : {
          isOpen: false,
          canClockIn: true,
          canClockOut: false,
          statusText: "Δεν υπάρχει ανοιχτή βάρδια αυτή τη στιγμή.",
        },
    summary: {
      totalHours: Math.round(totalHours * 100) / 100,
      totalWorkCost: Math.round(totalWorkCost * 100) / 100,
      paidWorkCost: Math.round(paidWorkCost * 100) / 100,
      salaryPaid: Math.round(salaryPaid * 100) / 100,
      currentDebt: Math.round(currentDebt * 100) / 100,
      currentHours: Math.round(currentHours * 100) / 100,
      currentDays,
      creditBalance,
      periodStart,
      periodEnd,
      periodText,
      salaryCash: Math.round(salaryCash * 100) / 100,
      salaryBank: Math.round(salaryBank * 100) / 100,
      extraCash: Math.round(extraCash * 100) / 100,
      extraBank: Math.round(extraBank * 100) / 100,
      extraTotal: Math.round(extraTotal * 100) / 100,
      ikaTotal: Math.round(ikaTotal * 100) / 100,
      fullPayrollCost: Math.round((totalWorkCost + ikaTotal + extraTotal) * 100) / 100,
    },
    workEntries: entriesAsc.slice().reverse(),
    payments: payments.sort((a, b) => `${b.paymentDate} ${b.id}`.localeCompare(`${a.paymentDate} ${a.id}`)),
  };
}

async function getHourlyRate() {
  const sql = getSql();
  const rows = await sql`SELECT setting_value FROM staff_payroll_settings WHERE setting_key = 'hourly_rate' LIMIT 1`;
  return toNumber(rows[0]?.setting_value ?? 0);
}

async function getState() {
  const sql = getSql();

  const [workRows, paymentRows, hourlyRate] = await Promise.all([
    sql`SELECT * FROM staff_payroll_work_entries ORDER BY work_date DESC, id DESC LIMIT 1000`,
    sql`SELECT * FROM staff_payroll_payments ORDER BY payment_date DESC, id DESC LIMIT 500`,
    getHourlyRate(),
  ]);

  return computeLedger(workRows as PayrollWorkRow[], paymentRows as PayrollPaymentRow[], hourlyRate);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  try {
    await ensureTables();
    const state = await getState();
    return NextResponse.json(state);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Δεν ήταν δυνατή η φόρτωση της μισθοδοσίας." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  try {
    await ensureTables();

    const sql = getSql();
    const body = await request.json().catch(() => ({}));
    const action = String(body.action ?? "");

    if (action === "update_hourly_rate") {
      const hourlyRate = normalizeMoney(body.hourlyRate);

      await sql`
        INSERT INTO staff_payroll_settings (setting_key, setting_value, updated_at)
        VALUES ('hourly_rate', ${hourlyRate.toFixed(2)}, NOW())
        ON CONFLICT (setting_key)
        DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = NOW()
      `;

      return NextResponse.json({ message: "Το ωρομίσθιο αποθηκεύτηκε.", state: await getState() });
    }

    if (action === "clock_in") {
      const openRows = await sql`SELECT id FROM staff_payroll_work_entries WHERE clock_out IS NULL ORDER BY work_date DESC, clock_in DESC LIMIT 1`;

      if (openRows.length > 0) {
        return NextResponse.json({ message: "Υπάρχει ήδη ανοιχτό clock in. Πρώτα κάντε OUT." }, { status: 400 });
      }

      const now = athensParts();
      const hourlyRate = await getHourlyRate();
      const comments = String(body.comments ?? "").trim();

      await sql`
        INSERT INTO staff_payroll_work_entries (work_date, clock_in, clock_out, hours_decimal, hourly_rate, daily_cost, comments, created_at, updated_at)
        VALUES (${now.date}, ${now.time}, NULL, 0, ${hourlyRate}, 0, ${comments}, NOW(), NOW())
      `;

      return NextResponse.json({ message: "Καταχωρήθηκε έναρξη.", state: await getState() });
    }

    if (action === "clock_out") {
      const openRows = await sql`SELECT * FROM staff_payroll_work_entries WHERE clock_out IS NULL ORDER BY work_date DESC, clock_in DESC LIMIT 1`;
      const open = openRows[0] as PayrollWorkRow | undefined;

      if (!open) {
        return NextResponse.json({ message: "Δεν βρέθηκε ανοιχτό clock in." }, { status: 400 });
      }

      const now = athensParts();
      const startSeconds = timeToSeconds(String(open.clock_in));
      const endSeconds = timeToSeconds(now.time);

      if (datePart(open.work_date) !== now.date || endSeconds <= startSeconds) {
        return NextResponse.json({ message: "Η ώρα OUT πρέπει να είναι μετά την ώρα IN της ίδιας ημέρας." }, { status: 400 });
      }

      const hours = Math.round(((endSeconds - startSeconds) / 3600) * 100) / 100;
      const dailyCost = Math.round(hours * toNumber(open.hourly_rate) * 100) / 100;
      const comments = [open.comments ?? "", String(body.comments ?? "").trim()].filter(Boolean).join("\n");

      await sql`
        UPDATE staff_payroll_work_entries
        SET clock_out = ${now.time},
            hours_decimal = ${hours},
            daily_cost = ${dailyCost},
            comments = ${comments},
            updated_at = NOW()
        WHERE id = ${open.id}
      `;

      return NextResponse.json({ message: "Καταχωρήθηκε αναχώρηση.", state: await getState() });
    }

    if (action === "manual_work") {
      const workDate = normalizeDate(body.workDate);
      const clockIn = normalizeTime(body.clockIn);
      const clockOut = normalizeTime(body.clockOut);
      const hourlyRate = normalizeMoney(body.hourlyRate) || (await getHourlyRate());
      const comments = String(body.comments ?? "").trim();

      if (!workDate || !clockIn) {
        return NextResponse.json({ message: "Συμπληρώστε έγκυρη ημερομηνία και ώρα εισόδου." }, { status: 400 });
      }

      if (!clockOut) {
        const openRows = await sql`SELECT id FROM staff_payroll_work_entries WHERE clock_out IS NULL ORDER BY work_date DESC, clock_in DESC LIMIT 1`;

        if (openRows.length > 0) {
          return NextResponse.json({ message: "Υπάρχει ήδη ανοιχτή βάρδια. Πρώτα κάντε OUT ή διαγράψτε την." }, { status: 400 });
        }

        await sql`
          INSERT INTO staff_payroll_work_entries (work_date, clock_in, clock_out, hours_decimal, hourly_rate, daily_cost, comments, created_at, updated_at)
          VALUES (${workDate}, ${clockIn}, NULL, 0, ${hourlyRate}, 0, ${comments}, NOW(), NOW())
        `;

        return NextResponse.json({ message: "Καταχωρήθηκε χειροκίνητο IN.", state: await getState() });
      }

      const startSeconds = timeToSeconds(`${clockIn}:00`);
      const endSeconds = timeToSeconds(`${clockOut}:00`);

      if (endSeconds <= startSeconds) {
        return NextResponse.json({ message: "Η ώρα εξόδου πρέπει να είναι μετά την ώρα εισόδου." }, { status: 400 });
      }

      const hours = Math.round(((endSeconds - startSeconds) / 3600) * 100) / 100;
      const dailyCost = Math.round(hours * hourlyRate * 100) / 100;

      await sql`
        INSERT INTO staff_payroll_work_entries (work_date, clock_in, clock_out, hours_decimal, hourly_rate, daily_cost, comments, created_at, updated_at)
        VALUES (${workDate}, ${clockIn}, ${clockOut}, ${hours}, ${hourlyRate}, ${dailyCost}, ${comments}, NOW(), NOW())
      `;

      return NextResponse.json({ message: "Καταχωρήθηκε εργασία.", state: await getState() });
    }

    if (action === "add_payment") {
      const paymentDate = normalizeDate(body.paymentDate);
      const category = ["salary", "ika", "extra"].includes(String(body.category)) ? String(body.category) : "salary";
      const method = category === "ika" ? "bank" : ["cash", "bank"].includes(String(body.method)) ? String(body.method) : "bank";
      const amount = normalizeMoney(body.amount);
      const comments = String(body.comments ?? "").trim();

      if (!paymentDate || amount <= 0) {
        return NextResponse.json({ message: "Συμπληρώστε έγκυρη ημερομηνία και ποσό." }, { status: 400 });
      }

      await sql`
        INSERT INTO staff_payroll_payments (payment_date, category, method, amount, comments, created_at, updated_at)
        VALUES (${paymentDate}, ${category}, ${method}, ${amount}, ${comments}, NOW(), NOW())
      `;

      return NextResponse.json({ message: "Καταχωρήθηκε πληρωμή.", state: await getState() });
    }

    if (action === "delete_work") {
      const id = String(body.id ?? "");

      if (!id) {
        return NextResponse.json({ message: "Δεν βρέθηκε η καταχώρηση εργασίας." }, { status: 400 });
      }

      await sql`DELETE FROM staff_payroll_work_entries WHERE id = ${id}`;
      return NextResponse.json({ message: "Η καταχώρηση εργασίας διαγράφηκε.", state: await getState() });
    }

    if (action === "delete_payment") {
      const id = String(body.id ?? "");

      if (!id) {
        return NextResponse.json({ message: "Δεν βρέθηκε η πληρωμή." }, { status: 400 });
      }

      await sql`DELETE FROM staff_payroll_payments WHERE id = ${id}`;
      return NextResponse.json({ message: "Η πληρωμή διαγράφηκε.", state: await getState() });
    }

    return NextResponse.json({ message: "Άγνωστη ενέργεια." }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Δεν ήταν δυνατή η αποθήκευση." }, { status: 500 });
  }
}
