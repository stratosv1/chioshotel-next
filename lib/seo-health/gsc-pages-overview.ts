import { neon } from "@neondatabase/serverless";

export type GscPagesOverviewIssue = {
  reason: string;
  source: string;
  validation: string;
  pages: number;
  severity: "critical" | "non-critical";
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

async function ensureOverviewTables() {
  const sql = getSql();
  await sql`
    create table if not exists seo_gsc_pages_overview_imports (
      id bigserial primary key,
      file_name text not null,
      imported_at timestamptz not null default now(),
      sitemap_scope text not null default '',
      issue_count integer not null default 0,
      total_reported_pages integer not null default 0,
      issues jsonb not null default '[]'::jsonb
    )
  `;
}

export async function importGscPagesOverview(input: {
  fileName: string;
  sitemapScope: string;
  issues: GscPagesOverviewIssue[];
}) {
  await ensureOverviewTables();
  const sql = getSql();
  const totalReportedPages = input.issues.reduce((sum, item) => sum + Math.max(0, Number(item.pages) || 0), 0);
  const rows = await sql`
    insert into seo_gsc_pages_overview_imports (
      file_name, sitemap_scope, issue_count, total_reported_pages, issues
    ) values (
      ${input.fileName},
      ${input.sitemapScope},
      ${input.issues.length},
      ${totalReportedPages},
      ${JSON.stringify(input.issues)}::jsonb
    )
    returning id::text, imported_at
  `;
  return {
    importId: String((rows as Array<{ id?: string }>)[0]?.id || ""),
    importedAt: (rows as Array<{ imported_at?: string }>)[0]?.imported_at || null,
    issueCount: input.issues.length,
    totalReportedPages,
    issues: input.issues,
  };
}
