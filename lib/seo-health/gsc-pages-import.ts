import { neon } from "@neondatabase/serverless";
import { bulkUpsertSeoUrls, ensureSeoHealthTables } from "@/lib/seo-health/store";

const SITE_URL = "sc-domain:chioshotel.gr";

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

function extractSnapshotKey(fileName: string) {
  const match = fileName.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
  return match?.[1] || new Date().toISOString().slice(0, 10);
}

function normalizeIssueText(value: string) {
  return value
    .replace(/â|â/g, "'")
    .replace(/â|â/g, "-")
    .trim();
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
    alter table seo_gsc_pages_imports
    add column if not exists snapshot_key text not null default ''
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

  await sql`
    create index if not exists seo_gsc_pages_imports_snapshot_idx
    on seo_gsc_pages_imports (snapshot_key, imported_at desc)
  `;

  await sql`
    create table if not exists seo_gsc_pages_state (
      id smallint primary key check (id = 1),
      active_snapshot_key text not null default '',
      activated_at timestamptz
    )
  `;

  await sql`
    insert into seo_gsc_pages_state (id, active_snapshot_key)
    values (1, '')
    on conflict (id) do nothing
  `;
}

async function activateSnapshot(snapshotKey: string) {
  const sql = getSql();
  const rows = await sql`
    select active_snapshot_key as "activeSnapshotKey"
    from seo_gsc_pages_state
    where id = 1
    limit 1
  `;
  const activeSnapshotKey = String((rows as Array<{ activeSnapshotKey?: string }>)[0]?.activeSnapshotKey || "");

  if (activeSnapshotKey && snapshotKey < activeSnapshotKey) {
    return { isCurrentSnapshot: false, snapshotChanged: false, previousSnapshotKey: activeSnapshotKey };
  }

  if (snapshotKey > activeSnapshotKey) {
    await sql`
      update seo_gsc_pages_state
      set active_snapshot_key = ${snapshotKey}, activated_at = now()
      where id = 1
    `;

    // Retire only URLs that entered the inventory through historical GSC Pages
    // drill-down exports and have no recent Search Analytics visibility. Canonical,
    // manual and Googlebot inventory is never deactivated by a Pages snapshot.
    await sql`
      update seo_url_inventory inventory
      set active = false
      where inventory.source = 'gsc'
        and inventory.expected_kind = 'unknown'
        and exists (
          select 1 from seo_gsc_page_issues issue
          where issue.url = inventory.url
        )
        and not exists (
          select 1
          from gsc_search_analytics analytics
          where analytics.site_url = ${SITE_URL}
            and analytics.grain = 'page'
            and analytics.page = inventory.url
            and analytics.date >= current_date - 180
            and (analytics.clicks > 0 or analytics.impressions > 0)
        )
    `;

    return { isCurrentSnapshot: true, snapshotChanged: true, previousSnapshotKey: activeSnapshotKey || null };
  }

  return { isCurrentSnapshot: true, snapshotChanged: false, previousSnapshotKey: activeSnapshotKey || null };
}

export async function importGscPagesRows(input: {
  fileName: string;
  rows: GscPagesImportRow[];
  originalRowCount: number;
}) {
  await ensureImportTables();

  const snapshotKey = extractSnapshotKey(input.fileName);
  const snapshot = await activateSnapshot(snapshotKey);

  const byKey = new Map<string, GscPagesImportRow>();
  for (const rawRow of input.rows) {
    const row = { ...rawRow, issue: normalizeIssueText(rawRow.issue) };
    const key = `${row.url}\u0000${row.issue}`;
    if (!byKey.has(key)) byKey.set(key, row);
  }
  const rows = Array.from(byKey.values());

  if (snapshot.isCurrentSnapshot) {
    await bulkUpsertSeoUrls(
      rows.map((row) => ({
        url: row.url,
        source: "gsc" as const,
        expectedKind: "unknown" as const,
        priority: priorityForIssue(row.issue),
      })),
    );
  }

  const categories: Record<string, number> = {};
  for (const row of rows) {
    categories[row.issue] = (categories[row.issue] || 0) + 1;
  }

  const sql = getSql();
  const importRows = await sql`
    insert into seo_gsc_pages_imports (file_name, snapshot_key, row_count, url_count, categories)
    values (
      ${input.fileName},
      ${snapshotKey},
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

  if (snapshot.isCurrentSnapshot) {
    const urlsJson = JSON.stringify(Array.from(new Set(rows.map((row) => row.url))));
    await sql`
      update seo_url_inventory
      set last_inspected_at = null,
          last_seen_at = now(),
          active = true
      where url in (
        select value
        from jsonb_array_elements_text(${urlsJson}::jsonb)
      )
    `;
  }

  try {
    await sql`
      update seo_full_audit_sessions
      set status = 'failed',
          completed_at = coalesce(completed_at, now()),
          error_message = 'Superseded by a newer GSC Pages import'
      where status = 'running'
    `;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/seo_full_audit_sessions|does not exist/i.test(message)) throw error;
  }

  return {
    importId,
    fileName: input.fileName,
    snapshotKey,
    snapshotChanged: snapshot.snapshotChanged,
    activeSnapshot: snapshot.isCurrentSnapshot,
    originalRowCount: input.originalRowCount,
    importedUrls: rows.length,
    categories,
  };
}
