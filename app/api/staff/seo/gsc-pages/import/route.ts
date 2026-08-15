import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { importGscPagesRows, type GscPagesImportRow } from "@/lib/seo-health/gsc-pages-import";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_ROWS = 10_000;

function isAuthorized(request: NextRequest) {
  const expectedUser = process.env.STAFF_USERNAME;
  const expectedPass = process.env.STAFF_PASSWORD;
  if (!expectedUser || !expectedPass) return false;

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return false;

  try {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    return (
      separator > -1 &&
      decoded.slice(0, separator) === expectedUser &&
      decoded.slice(separator + 1) === expectedPass
    );
  } catch {
    return false;
  }
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function normalizeHeader(value: string) {
  return value
    .replace(/^\uFEFF/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9α-ω]+/g, " ")
    .trim();
}

function pickCell(row: Record<string, unknown>, aliases: string[]) {
  const aliasSet = new Set(aliases.map(normalizeHeader));
  for (const [key, value] of Object.entries(row)) {
    if (aliasSet.has(normalizeHeader(key))) return String(value ?? "").trim();
  }
  return "";
}

function parseRows(data: Record<string, unknown>[], fallbackIssue: string) {
  const parsed: GscPagesImportRow[] = [];
  let missingIssueRows = 0;

  for (const row of data) {
    const urlValue = pickCell(row, ["URL", "Page", "Pages", "Address", "Σελίδα"]);
    if (!urlValue) continue;

    let url: URL;
    try {
      url = new URL(urlValue);
    } catch {
      continue;
    }

    if (!/^https?:$/.test(url.protocol)) continue;
    if (url.hostname.toLowerCase().replace(/^www\./, "") !== "chioshotel.gr") continue;

    const issue =
      pickCell(row, [
        "Issue",
        "Reason",
        "Category",
        "Problem",
        "Page indexing issue",
        "Coverage state",
      ]) || fallbackIssue;

    if (!issue) {
      missingIssueRows += 1;
      continue;
    }

    const lastCrawled = pickCell(row, [
      "Last crawled",
      "Last crawl",
      "Last crawl time",
      "Last crawled date",
    ]);

    parsed.push({
      url: url.toString(),
      issue,
      lastCrawled,
      raw: row,
    });
  }

  return { parsed, missingIssueRows };
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return json({ ok: false, error: "Unauthorized" }, 401);
  if (!isSameOrigin(request)) return json({ ok: false, error: "Cross-origin request rejected" }, 403);

  try {
    const form = await request.formData();
    const fileValue = form.get("file");
    const fallbackIssue = String(form.get("fallbackIssue") || "").trim();

    if (!fileValue || typeof fileValue === "string" || typeof fileValue.arrayBuffer !== "function") {
      return json({ ok: false, error: "Επίλεξε ένα CSV αρχείο." }, 400);
    }

    const file = fileValue as File;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      return json({ ok: false, error: "Υποστηρίζεται μόνο αρχείο CSV." }, 400);
    }
    if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
      return json({ ok: false, error: "Το CSV πρέπει να είναι έως 5 MB." }, 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer", raw: false });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return json({ ok: false, error: "Το CSV δεν περιέχει δεδομένα." }, 400);

    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
      raw: false,
    });

    if (!data.length) return json({ ok: false, error: "Το CSV δεν περιέχει γραμμές δεδομένων." }, 400);
    if (data.length > MAX_ROWS) {
      return json({ ok: false, error: `Το CSV έχει πάνω από ${MAX_ROWS.toLocaleString("el-GR")} γραμμές.` }, 400);
    }

    const { parsed, missingIssueRows } = parseRows(data, fallbackIssue);
    if (!parsed.length) {
      const detail = missingIssueRows
        ? " Βάλε στήλη Issue/Reason ή επίλεξε κατηγορία από το dropdown πριν το upload."
        : " Χρειάζεται στήλη URL με URLs του chioshotel.gr.";
      return json({ ok: false, error: `Δεν βρέθηκαν έγκυρα URLs για εισαγωγή.${detail}` }, 400);
    }

    const result = await importGscPagesRows({
      fileName: file.name,
      rows: parsed,
      originalRowCount: data.length,
    });

    return json({
      ok: true,
      ...result,
      skippedRows: Math.max(0, data.length - parsed.length),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[seo-health] GSC Pages CSV import failed", error);
    return json({ ok: false, error: message }, 500);
  }
}
