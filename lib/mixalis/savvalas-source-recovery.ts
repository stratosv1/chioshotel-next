import { neon } from "@neondatabase/serverless";

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

export async function recoverStaleSavvalasSourceAnalysisForRange(rangeId: string) {
  const sql = getSql();
  const analyses = await sql`
    SELECT id::text
    FROM physics.source_analyses
    WHERE source_range_id::text = ${rangeId}
      AND source_kind = 'source_range'
      AND source_role = 'depth'
      AND status = 'processing'
  `;

  let recovered = false;
  for (const analysis of analyses as any[]) {
    const analysisId = String(analysis.id);
    const chunks = await sql`
      UPDATE physics.source_analysis_chunks
      SET
        status = 'error',
        error_message = COALESCE(
          error_message,
          'Previous Savvalas PDF audit did not complete.'
        ),
        updated_at = NOW()
      WHERE analysis_id::text = ${analysisId}
        AND status = 'processing'
        AND updated_at < NOW() - INTERVAL '6 minutes'
      RETURNING id::text
    `;

    if (chunks.length > 0) {
      recovered = true;
      await sql`
        UPDATE physics.source_analyses
        SET
          status = 'error',
          error_message = 'Previous Savvalas PDF audit did not complete. Safe retry is available.',
          updated_at = NOW()
        WHERE id::text = ${analysisId}
          AND status = 'processing'
      `;
    }
  }

  return recovered;
}
