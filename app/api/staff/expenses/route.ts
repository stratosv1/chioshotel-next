import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import {
  accountExists,
  accountForEntity,
  categoryBelongsToEntity,
  categoryExists,
  entityExists,
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

// Map a free-text search to category/entity slugs by their Greek labels, so
// "βενζινη" or "Μιχάλης" match even though the DB stores English slugs.
function slugsMatching(search: string) {
  const term = normalizeSearch(search);
  if (!term) return { categories: [] as string[], entities: [] as string[] };
  const matches = (label: string, slug: string) =>
    normalizeSearch(label).includes(term) || slug.includes(term);
  return {
    categories: staffExpenseCategories.filter((c) => matches(c.label, c.slug)).map((c) => c.slug),
    entities: staffExpenseEntities.filter((e) => matches(e.label, e.slug)).map((e) => e.slug),
  };
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

function normalizeAmount(value: unknown) {
  let raw = String(value ?? "")
    .trim()
    .replace(/\s/g, "")
    .replace(/€/g, "")
    .replace(/[^0-9.,]/g, "");

  if (!raw) {
    return 0;
  }

  const lastComma = raw.lastIndexOf(",");
  const lastDot = raw.lastIndexOf(".");

  if (lastComma >= 0 && lastDot >= 0) {
    if (lastComma > lastDot) {
      raw = raw.replace(/\./g, "").replace(",", ".");
    } else {
      raw = raw.replace(/,/g, "");
    }
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

  if (!Number.isFinite(amount)) {
    return 0;
  }

  return Math.round(amount * 100) / 100;
}

function normalizeDate(value: unknown) {
  const raw = String(value ?? "");
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : athensIsoDate();
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
  const search = (searchParams.get("search") ?? "").trim().slice(0, 120);
  const requestedLimit = Number(searchParams.get("limit") ?? "80");

  return {
    month: /^\d{4}-\d{2}$/.test(requestedMonth) ? requestedMonth : "",
    account: accountExists(requestedAccount) ? requestedAccount : "",
    search,
    limit: Number.isFinite(requestedLimit)
      ? Math.min(500, Math.max(20, Math.round(requestedLimit)))
      : 80,
  };
}

function validateExpenseInput(body: Record<string, unknown>) {
  const expenseDate = normalizeDate(body.expenseDate);
  const category = String(body.category ?? "");
  const entity = String(body.entity ?? "");
  const amount = normalizeAmount(body.amount);
  const comments = String(body.comments ?? "").trim();

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
  const { month, account, search, limit } = parseFilters(request);
  const today = athensIsoDate();
  const currentMonth = today.slice(0, 7);
  const searchPattern = `%${normalizeSearch(search)}%`;
  const { categories: searchCategories, entities: searchEntities } = slugsMatching(search);
  const [startYear, startMonth] = currentMonth.split("-").map(Number);
  const trendStart = new Date(Date.UTC(startYear, startMonth - 12, 1)).toISOString().slice(0, 10);

  const [rows, aggregateRows, accountRows, categoryRows, globalRows, monthlyRows, usageRows] = await Promise.all([
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
      WHERE
        (${month} = '' OR to_char(expense_date, 'YYYY-MM') = ${month})
        AND (${account} = '' OR primary_account = ${account})
        AND (
          ${search} = ''
          OR replace(translate(lower(COALESCE(comments, '')), ${GREEK_ACCENTED}, ${GREEK_PLAIN}), 'ς', 'σ') LIKE ${searchPattern}
          OR category = ANY(${searchCategories})
          OR entity = ANY(${searchEntities})
        )
      ORDER BY expense_date DESC, id DESC
      LIMIT ${limit}
    `,
    sql`
      SELECT
        COALESCE(SUM(amount), 0)::text AS total,
        COUNT(*)::int AS count
      FROM staff_expenses
      WHERE
        (${month} = '' OR to_char(expense_date, 'YYYY-MM') = ${month})
        AND (${account} = '' OR primary_account = ${account})
        AND (
          ${search} = ''
          OR replace(translate(lower(COALESCE(comments, '')), ${GREEK_ACCENTED}, ${GREEK_PLAIN}), 'ς', 'σ') LIKE ${searchPattern}
          OR category = ANY(${searchCategories})
          OR entity = ANY(${searchEntities})
        )
    `,
    sql`
      SELECT primary_account, COALESCE(SUM(amount), 0)::text AS total
      FROM staff_expenses
      WHERE
        (${month} = '' OR to_char(expense_date, 'YYYY-MM') = ${month})
        AND (${account} = '' OR primary_account = ${account})
        AND (
          ${search} = ''
          OR replace(translate(lower(COALESCE(comments, '')), ${GREEK_ACCENTED}, ${GREEK_PLAIN}), 'ς', 'σ') LIKE ${searchPattern}
          OR category = ANY(${searchCategories})
          OR entity = ANY(${searchEntities})
        )
      GROUP BY primary_account
    `,
    sql`
      SELECT category, COALESCE(SUM(amount), 0)::text AS total
      FROM staff_expenses
      WHERE
        (${month} = '' OR to_char(expense_date, 'YYYY-MM') = ${month})
        AND (${account} = '' OR primary_account = ${account})
        AND (
          ${search} = ''
          OR replace(translate(lower(COALESCE(comments, '')), ${GREEK_ACCENTED}, ${GREEK_PLAIN}), 'ς', 'σ') LIKE ${searchPattern}
          OR category = ANY(${searchCategories})
          OR entity = ANY(${searchEntities})
        )
      GROUP BY category
      ORDER BY SUM(amount) DESC
    `,
    sql`
      SELECT
        COALESCE(SUM(amount) FILTER (WHERE expense_date = CAST(${today} AS date)), 0)::text AS today_total,
        COALESCE(SUM(amount) FILTER (WHERE to_char(expense_date, 'YYYY-MM') = ${currentMonth}), 0)::text AS current_month_total,
        COALESCE(SUM(amount), 0)::text AS all_total
      FROM staff_expenses
    `,
    sql`
      SELECT
        to_char(expense_date, 'YYYY-MM') AS month,
        primary_account,
        category,
        SUM(amount)::text AS total,
        COUNT(*)::int AS count
      FROM staff_expenses
      WHERE expense_date >= CAST(${trendStart} AS date)
      GROUP BY 1, 2, 3
    `,
    sql`
      SELECT primary_account, category, COUNT(*)::int AS count
      FROM staff_expenses
      GROUP BY 1, 2
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

  const body = (await request.json()) as Record<string, unknown>;
  const validation = validateExpenseInput(body);

  if ("error" in validation) {
    return NextResponse.json({ message: validation.error }, { status: 400 });
  }

  const { expenseDate, primaryAccount, category, entity, amount, comments } = validation.value;
  const sql = getSql();

  const rows = await sql`
    INSERT INTO staff_expenses (
      expense_date,
      primary_account,
      category,
      entity,
      amount,
      comments
    )
    VALUES (
      ${expenseDate},
      ${primaryAccount},
      ${category},
      ${entity},
      ${amount},
      ${comments}
    )
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

  const body = (await request.json()) as Record<string, unknown>;
  const id = Number(body.id);

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json(
      { message: "Δεν ενημερώθηκε: λείπει σωστό ID." },
      { status: 400 },
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
    WHERE id = ${id}
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
    DELETE FROM staff_expenses
    WHERE id = ${id}
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
