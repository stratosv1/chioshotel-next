import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import {
  categoryBelongsToEntity,
  categoryExists,
  entityExists,
} from "@/lib/staff-expenses-config";

export const runtime = "nodejs";

type StaffExpenseRow = {
  id: number;
  expense_date: string;
  primary_account: "kampos" | "family";
  category: string;
  entity: string;
  amount: string;
  comments: string | null;
  created_at: string;
  updated_at: string;
};

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

async function ensureTable() {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS staff_expenses (
      id BIGSERIAL PRIMARY KEY,
      expense_date DATE NOT NULL,
      primary_account VARCHAR(20) NOT NULL CHECK (primary_account IN ('kampos', 'family')),
      category VARCHAR(80) NOT NULL,
      entity VARCHAR(80) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
      comments TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS staff_expenses_expense_date_idx
    ON staff_expenses (expense_date DESC)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS staff_expenses_category_idx
    ON staff_expenses (category)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS staff_expenses_entity_idx
    ON staff_expenses (entity)
  `;
}

function normalizeAmount(value: unknown) {
  const raw = String(value ?? "")
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");

  const amount = Number(raw);

  if (!Number.isFinite(amount)) {
    return 0;
  }

  return Math.round(amount * 100) / 100;
}

function normalizeDate(value: unknown) {
  const raw = String(value ?? "");
  const isValid = /^\d{4}-\d{2}-\d{2}$/.test(raw);

  if (isValid) {
    return raw;
  }

  return new Date().toISOString().slice(0, 10);
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

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  await ensureTable();

  const sql = getSql();
  const { searchParams } = request.nextUrl;
  const month = searchParams.get("month") ?? "";
  const account = searchParams.get("account") ?? "";
  const search = searchParams.get("search") ?? "";

  const rows = await sql`
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
        OR comments ILIKE ${"%" + search + "%"}
        OR category ILIKE ${"%" + search + "%"}
        OR entity ILIKE ${"%" + search + "%"}
      )
    ORDER BY expense_date DESC, id DESC
    LIMIT 1000
  `;

  return NextResponse.json(
    { expenses: (rows as StaffExpenseRow[]).map(mapRow) },
    {
      headers: {
        "x-robots-tag": "noindex, nofollow",
        "cache-control": "no-store",
      },
    },
  );
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  await ensureTable();

  const body = await request.json();
  const expenseDate = normalizeDate(body.expenseDate);
  const primaryAccount = body.primaryAccount === "kampos" ? "kampos" : "family";
  const category = String(body.category ?? "");
  const entity = String(body.entity ?? "");
  const amount = normalizeAmount(body.amount);
  const comments = String(body.comments ?? "").trim();

  if (!categoryExists(category)) {
    return NextResponse.json(
      { message: "Δεν καταχωρήθηκε: μη έγκυρη κατηγορία." },
      { status: 400 },
    );
  }

  if (!entityExists(entity)) {
    return NextResponse.json(
      { message: "Δεν καταχωρήθηκε: μη έγκυρη ενότητα/πρόσωπο." },
      { status: 400 },
    );
  }

  if (!categoryBelongsToEntity(entity, category)) {
    return NextResponse.json(
      { message: "Δεν καταχωρήθηκε: η κατηγορία δεν αντιστοιχεί σε αυτή την ενότητα." },
      { status: 400 },
    );
  }

  if (amount <= 0) {
    return NextResponse.json(
      { message: "Δεν καταχωρήθηκε: βάλε σωστό ποσό." },
      { status: 400 },
    );
  }

  if (category === "service" && comments.length === 0) {
    return NextResponse.json(
      { message: "Δεν καταχωρήθηκε: για την Υπηρεσία χρειάζεται σχόλιο." },
      { status: 400 },
    );
  }

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
    {
      headers: {
        "x-robots-tag": "noindex, nofollow",
        "cache-control": "no-store",
      },
    },
  );
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  await ensureTable();

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
    RETURNING id
  `;

  if (rows.length === 0) {
    return NextResponse.json(
      { message: "Δεν διαγράφηκε: δεν βρέθηκε το έξοδο." },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { message: "Το έξοδο διαγράφηκε." },
    {
      headers: {
        "x-robots-tag": "noindex, nofollow",
        "cache-control": "no-store",
      },
    },
  );
}
