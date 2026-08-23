import { neon } from "@neondatabase/serverless";

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

/**
 * Atomically claims one Subchapter Intelligence synthesis run.
 * Fresh running claims block duplicate requests. A stale claim can be
 * recovered after eight minutes, which is longer than the route budget.
 */
export async function claimSubchapterIntelligenceRun(versionId: string) {
  const sql = getSql();
  const rows = await sql`
    UPDATE physics.subchapter_intelligence_versions
    SET content = jsonb_build_object(
      'state', 'running',
      'startedAt', now(),
      'sourceCount', COALESCE(NULLIF(content->>'sourceCount', '')::int, 0),
      'findingCount', COALESCE(NULLIF(content->>'findingCount', '')::int, 0)
    )
    WHERE id::text = ${versionId}
      AND status = 'draft'
      AND (
        content->>'state' IS DISTINCT FROM 'running'
        OR COALESCE(
          NULLIF(content->>'startedAt', '')::timestamptz,
          'epoch'::timestamptz
        ) < now() - interval '8 minutes'
      )
    RETURNING id::text
  `;

  return rows.length > 0;
}
