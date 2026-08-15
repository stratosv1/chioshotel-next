import { neon } from "@neondatabase/serverless";
import { bulkUpsertSeoUrls, ensureSeoHealthTables } from "@/lib/seo-health/store";

export type GscPagesImportRow = {
  url: string;
  issue: string;
  lastCrawled: string;
  raw: Record<string, unknown>;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

function priorityForIssue(issue: string) {
  const value = issue.toLowerCase();
  if (/server error|5xx|redirect error/.test(value)) return 100;
  if (/not found|404|soft 404/.test(value)) return 95;
  if (/duplicate|canonical|noindex|robots/.test(value)) return 90;
  if (/crawled.*not indexed|discovered.*not indexed/.test(value)) return 85;
  if (/page with redirect|alternate page/.test(value)) return 75;
  return 80;
}

async function ensureImportTables() {
  await ensureSeoHealthTables();
  const sql = getSql();

  await sql`
    create table if not exists seo_gsc_pages_imports (
      id bigserial primary key,
      file_name text not null,
      imported_at timestamptz not null default now(),
      row_count integer not null default 0,
      url_count integer not null default 0,
      categories jsonb not null default '{}'::jsonb
    )
  `;

  await sql`
    create table if not exists seo_gsc_page_issues (
      id bigserial primary key,
      import_id bigint not null references seo_gsc_pages_imports(id) on delete cascade,
      url text not null,
      issue text not null,
      last_crawled_text text not null default '',
      imported_at timestamptz not null default now(),
      raw jsonb not null default '{}'::jsonb
    )
  `;

  await sql`
    create index if not exists seo_gsc_page_issues_url_idx
    on seo_gsc_page_issues (url, imported_at desc)
  `;
}

export async function importGscPagesRows(input: {
  fileName: string;
  rows: GscPagesImportRow[];
  originalRowCount: number;
}) {
  await ensureImportTables();

  const byKey = new Map<string, GscPagesImportRow>();
  for (const row of input.rows) {
    const key = `${row.url}\u0000${row.issue}`;
    if (!byKey.has(key)) byKey.set(key, row);
  }
  const rows = Array.from(byKey.values());

  await bulkUpsertSeoUrls(
    rows.map((row) => ({
      url: row.url,
      source: "gsc" as const,
      expectedKind: "unknown" as const,
      priority: priorityForIssue(row.issue),
    })),
  );

  const categories: Record<string, number> = {};
  for (const row of rows) {
    categories[row.issue] = (categories[row.issue] || 0) + 1;
  }

  const sql = getSql();
  const importRows = await sql`
    insert into seo_gsc_pages_imports (file_name, row_count, url_count, categories)
    values (
      ${input.fileName},
      ${input.originalRowCount},
      ${rows.length},
      ${JSON.stringify(categories)}::jsonb
    )
    returning id::text
  `;
  const importId = String((importRows as Array<{ id?: string }>)[0]?.id || "");
  if (!importId) throw new Error("Failed to create GSC Pages import record.");

  const chunkSize = 500;
  for (let index = 0; index < rows.length; index += chunkSize) {
    const chunk = rows.slice(index, index + chunkSize);
    await sql`
      insert into seo_gsc_page_issues (
        import_id, url, issue, last_crawled_text, raw
      )
      select
        ${importId}::bigint,
        url,
        issue,
        "lastCrawled",
        raw
      from jsonb_to_recordset(${JSON.stringify(chunk)}::jsonb) as x(
        url text,
        issue text,
        "lastCrawled" text,
        raw jsonb
      )
    `;
  }

  const urlsJson = JSON.stringify(Array.from(new Set(rows.map((row) => row.url))));
  await sql`
    update seo_url_inventory
    set last_inspected_at = null,
        last_seen_at = now()
    where url in (
      select value
      from jsonb_array_elements_text(${urlsJson}::jsonb)
    )
  `;

  try {
    await sql`
      update seo_full_audit_sessions
      set status = 'failed',
          completed_at = coalesce(completed_at, now()),
          error_message = 'Superseded by a newer GSC Pages CSV import'
      where status = 'running'
    `;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/seo_full_audit_sessions|does not exist/i.test(message)) throw error;
  }

  return {
    importId,
    fileName: input.fileName,
    originalRowCount: input.originalRowCount,
    importedUrls: rows.length,
    categories,
  };
}
