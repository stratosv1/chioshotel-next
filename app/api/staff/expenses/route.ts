import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import {
  accountExists,
  accountForEntity,
  categoryBelongsToEntity,
  categoryExists,
  entityExists,
  parseExpenseAmount,
  staffExpenseAccounts,
  staffExpenseCategories,
  staffExpenseEntities,
  type StaffExpenseAccount,
} from "@/lib/staff-expenses-config";

export const runtime = "nodejs";

type StaffExpenseRow = {
  id: number;
  expense_date: string;
  primary_account: StaffExpenseAccount;
  category: string;
  entity: string;
  amount: string;
  comments: string | null;
  created_at: string;
  updated_at: string;
};

type AggregateRow = {
  total: string;
  count: number;
};

type GlobalSummaryRow = {
  today_total: string;
  current_month_total: string;
  all_total: string;
};

type AccountTotalRow = {
  primary_account: StaffExpenseAccount;
  total: string;
};

type CategoryTotalRow = {
  category: string;
  total: string;
};

type MonthlyRow = {
  month: string;
  primary_account: StaffExpenseAccount;
  category: string;
  total: string;
  count: number;
};

type TrendRow = {
  month: string;
  total: string;
};

type UsageRow = {
  primary_account: StaffExpenseAccount;
  category: string;
  count: number;
};

const GREEK_ACCENTED = "άέήίόύώϊϋΐΰ";
const GREEK_PLAIN = "αεηιουωιυιυ";

function normalizeSearch(value: string) {
  return value
    .toLocaleLowerCase("el-GR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ς/g, "σ")
    .trim();
}

// Greek labels for each stored slug, so "βενζινη" or "Μιχάλης" match even though
// the DB stores English slugs. Passed to SQL as JSON.
const SEARCH_LABELS = JSON.stringify(
  Object.fromEntries(
    [...staffExpenseCategories, ...staffExpenseEntities, ...staffExpenseAccounts].map((item) => [
      item.slug,
      normalizeSearch(`${item.label} ${item.slug}`),
    ]),
  ),
);

// Every word must match, in any order and in part: "σπιτι μιχ φροντιστηρια".
// Word endings are dropped so plural and singular find the same expenses.
function searchPatterns(search: string) {
  return normalizeSearch(search)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6)
    .map((term) => {
      const stem = term.replace(/(ων|ασ|εσ|ησ|οσ|ια|ιο|α|ε|η|ι|ο|υ|ω)$/, "");
      return term.length >= 5 && stem.length >= 4 ? stem : term;
    })
    .map((term) => `%${term.replace(/[\\%_]/g, "\\$&")}%`);
}

const ATHENS_TIME_ZONE = "Europe/Athens";

function unauthorizedResponse() {
  return NextResponse.json(
    { message: "Authentication required" },
    {
      status: 401,
      headers: {
        "www-authenticate": 'Basic realm="Staff Area", charset="UTF-8"',
        "x-robots-tag": "noindex, nofollow",
        "cache-control": "no-store",
      },
    },
  );
}

function responseHeaders() {
  return {
    "x-robots-tag": "noindex, nofollow",
    "cache-control": "no-store",
  };
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
    const encodedCredentials = authorization.slice("Basic ".length);
    const decodedCredentials = Buffer.from(encodedCredentials, "base64").toString("utf8");
    const separatorIndex = decodedCredentials.indexOf(":");

    if (separatorIndex === -1) {
      return false;
    }

    const providedUsername = decodedCredentials.slice(0, separatorIndex);
    const providedPassword = decodedCredentials.slice(separatorIndex + 1);

    return providedUsername === username && providedPassword === password;
  } catch {
    return false;
  }
}

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }

  return neon(databaseUrl);
}

function athensIsoDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ATHENS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function normalizeDate(value: unknown) {
  const raw = String(value ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const date = new Date(`${raw}T12:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== raw) return null;
  return raw <= athensIsoDate() ? raw : null;
}

function mapRow(row: StaffExpenseRow) {
  return {
    id: String(row.id),
    expenseDate: row.expense_date,
    primaryAccount: row.primary_account,
    category: row.category,
    entity: row.entity,
    amount: Number(row.amount),
    comments: row.comments ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function parseFilters(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const requestedMonth = searchParams.get("month") ?? "";
  const requestedAccount = searchParams.get("account") ?? "";
  const requestedEntity = searchParams.get("entity") ?? "";
  const requestedCategory = searchParams.get("category") ?? "";
  const search = (searchParams.get("search") ?? "").trim().slice(0, 120);
  const requestedLimit = Number(searchParams.get("limit") ?? "80");

  return {
    month: /^\d{4}-\d{2}$/.test(requestedMonth) ? requestedMonth : "",
    account: accountExists(requestedAccount) ? requestedAccount : "",
    entity: entityExists(requestedEntity) ? requestedEntity : "",
    category: categoryExists(requestedCategory) ? requestedCategory : "",
    search,
    limit: Number.isFinite(requestedLimit)
      ? Math.min(500, Math.max(20, Math.round(requestedLimit)))
      : 80,
  };
}

type ExpenseFilters = ReturnType<typeof parseFilters>;

function filterClause(sql: ReturnType<typeof getSql>, filters: ExpenseFilters, month = filters.month) {
  const { account, entity, category, search } = filters;

  return sql`
    deleted_at IS NULL
    AND (${month} = '' OR to_char(expense_date, 'YYYY-MM') = ${month})
    AND (${account} = '' OR primary_account = ${account})
    AND (${entity} = '' OR entity = ${entity})
    AND (${category} = '' OR category = ${category})
    AND NOT EXISTS (
      SELECT 1
      FROM unnest(${searchPatterns(search)}::text[]) AS term
      WHERE concat_ws(
        ' ',
        replace(translate(lower(COALESCE(comments, '')), ${GREEK_ACCENTED}, ${GREEK_PLAIN}), 'ς', 'σ'),
        ${SEARCH_LABELS}::jsonb ->> category::text,
        ${SEARCH_LABELS}::jsonb ->> entity::text,
        ${SEARCH_LABELS}::jsonb ->> primary_account::text
      ) NOT LIKE term
    )
  `;
}

async function readBody(request: NextRequest) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

const INVALID_REQUEST = { message: "Το αίτημα δεν ήταν έγκυρο." };

function validateExpenseInput(body: Record<string, unknown>) {
  const expenseDate = normalizeDate(body.expenseDate);
  const category = String(body.category ?? "");
  const entity = String(body.entity ?? "");
  const amount = parseExpenseAmount(body.amount);
  const comments = String(body.comments ?? "").trim();

  if (!expenseDate) {
    return { error: "Δεν καταχωρήθηκε: βάλε σωστή ημερομηνία, όχι μελλοντική." } as const;
  }

  if (!categoryExists(category)) {
    return { error: "Δεν καταχωρήθηκε: μη έγκυρη κατηγορία." } as const;
  }

  if (!entityExists(entity)) {
    return { error: "Δεν καταχωρήθηκε: μη έγκυρη ενότητα/πρόσωπο." } as const;
  }

  const primaryAccount = accountForEntity(entity);
  if (!primaryAccount) {
    return { error: "Δεν καταχωρήθηκε: μη έγκυρος λογαριασμός." } as const;
  }

  if (!categoryBelongsToEntity(entity, category)) {
    return {
      error: "Δεν καταχωρήθηκε: η κατηγορία δεν αντιστοιχεί σε αυτή την ενότητα.",
    } as const;
  }

  if (amount <= 0) {
    return { error: "Δεν καταχωρήθηκε: βάλε σωστό ποσό." } as const;
  }

  if (category === "service" && comments.length === 0) {
    return {
      error: "Δεν καταχωρήθηκε: για την Υπηρεσία χρειάζεται σχόλιο.",
    } as const;
  }

  return {
    value: {
      expenseDate,
      primaryAccount,
      category,
      entity,
      amount,
      comments,
    },
  } as const;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  const sql = getSql();
  const filters = parseFilters(request);
  const today = athensIsoDate();
  const currentMonth = today.slice(0, 7);
  const [startYear, startMonth] = currentMonth.split("-").map(Number);
  const trendStart = new Date(Date.UTC(startYear, startMonth - 12, 1)).toISOString().slice(0, 10);

  const [rows, aggregateRows, accountRows, categoryRows, globalRows, monthlyRows, usageRows, trendRows] = await Promise.all([
    sql`
      SELECT
        id,
        expense_date::text,
        primary_account,
        category,
        entity,
        amount::text,
        comments,
        created_at::text,
        updated_at::text
      FROM staff_expenses
      WHERE ${filterClause(sql, filters)}
      ORDER BY expense_date DESC, id DESC
      LIMIT ${filters.limit}
    `,
    sql`
      SELECT
        COALESCE(SUM(amount), 0)::text AS total,
        COUNT(*)::int AS count
      FROM staff_expenses
      WHERE ${filterClause(sql, filters)}
    `,
    sql`
      SELECT primary_account, COALESCE(SUM(amount), 0)::text AS total
      FROM staff_expenses
      WHERE ${filterClause(sql, filters)}
      GROUP BY primary_account
    `,
    sql`
      SELECT category, COALESCE(SUM(amount), 0)::text AS total
      FROM staff_expenses
      WHERE ${filterClause(sql, filters)}
      GROUP BY category
      ORDER BY SUM(amount) DESC
    `,
    sql`
      SELECT
        COALESCE(SUM(amount) FILTER (WHERE expense_date = CAST(${today} AS date)), 0)::text AS today_total,
        COALESCE(SUM(amount) FILTER (WHERE to_char(expense_date, 'YYYY-MM') = ${currentMonth}), 0)::text AS current_month_total,
        COALESCE(SUM(amount), 0)::text AS all_total
      FROM staff_expenses
      WHERE deleted_at IS NULL
    `,
    sql`
      SELECT
        to_char(expense_date, 'YYYY-MM') AS month,
        primary_account,
        category,
        SUM(amount)::text AS total,
        COUNT(*)::int AS count
      FROM staff_expenses
      WHERE deleted_at IS NULL AND expense_date >= CAST(${trendStart} AS date)
      GROUP BY 1, 2, 3
    `,
    sql`
      SELECT primary_account, category, COUNT(*)::int AS count
      FROM staff_expenses
      WHERE deleted_at IS NULL
      GROUP BY 1, 2
    `,
    sql`
      SELECT to_char(expense_date, 'YYYY-MM') AS month, SUM(amount)::text AS total
      FROM staff_expenses
      WHERE ${filterClause(sql, filters, "")} AND expense_date >= CAST(${trendStart} AS date)
      GROUP BY 1
    `,
  ]);

  const aggregate = (aggregateRows as AggregateRow[])[0] ?? { total: "0", count: 0 };
  const global = (globalRows as GlobalSummaryRow[])[0] ?? {
    today_total: "0",
    current_month_total: "0",
    all_total: "0",
  };
  const accountTotals: Record<StaffExpenseAccount, number> = {
    kampos: 0,
    family: 0,
    tailormade: 0,
  };

  for (const row of accountRows as AccountTotalRow[]) {
    if (accountExists(row.primary_account)) {
      accountTotals[row.primary_account] = Number(row.total);
    }
  }

  return NextResponse.json(
    {
      expenses: (rows as StaffExpenseRow[]).map(mapRow),
      summary: {
        todayTotal: Number(global.today_total),
        currentMonthTotal: Number(global.current_month_total),
        allTotal: Number(global.all_total),
        filteredTotal: Number(aggregate.total),
        filteredCount: aggregate.count,
        accountTotals,
        categoryTotals: (categoryRows as CategoryTotalRow[]).map((row) => ({
          category: row.category,
          total: Number(row.total),
        })),
      },
      monthly: (monthlyRows as MonthlyRow[]).map((row) => ({
        month: row.month,
        account: row.primary_account,
        category: row.category,
        total: Number(row.total),
        count: row.count,
      })),
      filteredTrend: (trendRows as TrendRow[]).map((row) => ({
        month: row.month,
        total: Number(row.total),
      })),
      usage: (usageRows as UsageRow[]).map((row) => ({
        account: row.primary_account,
        category: row.category,
        count: row.count,
      })),
    },
    { headers: responseHeaders() },
  );
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  const body = await readBody(request);
  if (!body) {
    return NextResponse.json(INVALID_REQUEST, { status: 400 });
  }

  const validation = validateExpenseInput(body);

  if ("error" in validation) {
    return NextResponse.json({ message: validation.error }, { status: 400 });
  }

  const { expenseDate, primaryAccount, category, entity, amount, comments } = validation.value;
  const sql = getSql();
  // A retry of the same form carries the same ref, so it can't save twice.
  const clientRef = /^[\w-]{8,64}$/.test(String(body.clientRef ?? "")) ? String(body.clientRef) : null;

  const rows = await sql`
    INSERT INTO staff_expenses (
      expense_date,
      primary_account,
      category,
      entity,
      amount,
      comments,
      client_ref
    )
    VALUES (
      ${expenseDate},
      ${primaryAccount},
      ${category},
      ${entity},
      ${amount},
      ${comments},
      ${clientRef}
    )
    ON CONFLICT (client_ref) DO UPDATE SET client_ref = EXCLUDED.client_ref
    RETURNING
      id,
      expense_date::text,
      primary_account,
      category,
      entity,
      amount::text,
      comments,
      created_at::text,
      updated_at::text
  `;

  return NextResponse.json(
    {
      message: "Το έξοδο καταχωρήθηκε.",
      expense: mapRow((rows as StaffExpenseRow[])[0]),
    },
    { headers: responseHeaders() },
  );
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  const body = await readBody(request);
  if (!body) {
    return NextResponse.json(INVALID_REQUEST, { status: 400 });
  }

  const id = Number(body.id);

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json(
      { message: "Δεν ενημερώθηκε: λείπει σωστό ID." },
      { status: 400 },
    );
  }

  if (body.restore === true) {
    const restored = await getSql()`
      UPDATE staff_expenses
      SET deleted_at = NULL, updated_at = NOW()
      WHERE id = ${id} AND deleted_at IS NOT NULL
      RETURNING
        id,
        expense_date::text,
        primary_account,
        category,
        entity,
        amount::text,
        comments,
        created_at::text,
        updated_at::text
    `;

    if (restored.length === 0) {
      return NextResponse.json(
        { message: "Δεν επανήλθε: δεν βρέθηκε το έξοδο." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Το έξοδο επανήλθε.",
        expense: mapRow((restored as StaffExpenseRow[])[0]),
      },
      { headers: responseHeaders() },
    );
  }

  const validation = validateExpenseInput(body);
  if ("error" in validation) {
    return NextResponse.json(
      { message: validation.error.replace("Δεν καταχωρήθηκε", "Δεν ενημερώθηκε") },
      { status: 400 },
    );
  }

  const { expenseDate, primaryAccount, category, entity, amount, comments } = validation.value;
  const sql = getSql();

  const rows = await sql`
    UPDATE staff_expenses
    SET
      expense_date = ${expenseDate},
      primary_account = ${primaryAccount},
      category = ${category},
      entity = ${entity},
      amount = ${amount},
      comments = ${comments},
      updated_at = NOW()
    WHERE id = ${id} AND deleted_at IS NULL
    RETURNING
      id,
      expense_date::text,
      primary_account,
      category,
      entity,
      amount::text,
      comments,
      created_at::text,
      updated_at::text
  `;

  if (rows.length === 0) {
    return NextResponse.json(
      { message: "Δεν ενημερώθηκε: δεν βρέθηκε το έξοδο." },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      message: "Το έξοδο ενημερώθηκε.",
      expense: mapRow((rows as StaffExpenseRow[])[0]),
    },
    { headers: responseHeaders() },
  );
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  const { searchParams } = request.nextUrl;
  const id = Number(searchParams.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json(
      { message: "Δεν διαγράφηκε: λείπει σωστό ID." },
      { status: 400 },
    );
  }

  const sql = getSql();

  const rows = await sql`
    UPDATE staff_expenses
    SET deleted_at = NOW(), updated_at = NOW()
    WHERE id = ${id} AND deleted_at IS NULL
    RETURNING
      id,
      expense_date::text,
      primary_account,
      category,
      entity,
      amount::text,
      comments,
      created_at::text,
      updated_at::text
  `;

  if (rows.length === 0) {
    return NextResponse.json(
      { message: "Δεν διαγράφηκε: δεν βρέθηκε το έξοδο." },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      message: "Το έξοδο διαγράφηκε.",
      expense: mapRow((rows as StaffExpenseRow[])[0]),
    },
    { headers: responseHeaders() },
  );
}
