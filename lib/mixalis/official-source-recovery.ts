import { neon } from "@neondatabase/serverless";

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

export async function recoverStaleOfficialSourceAnalysis(analysisId: string) {
  const sql = getSql();

  const recovered = await sql`
    UPDATE physics.source_analysis_chunks
    SET
      status = 'error',
      error_message = COALESCE(
        error_message,
        'Previous official source processing attempt did not complete.'
      ),
      updated_at = NOW()
    WHERE analysis_id::text = ${analysisId}
      AND chunk_index = 0
      AND status = 'processing'
      AND updated_at < NOW() - INTERVAL '6 minutes'
    RETURNING id::text
  `;

  if (recovered.length > 0) {
    await sql`
      UPDATE physics.source_analyses
      SET
        status = 'error',
        error_message = 'Previous official source processing attempt did not complete.',
        updated_at = NOW()
      WHERE id::text = ${analysisId}
        AND status = 'processing'
    `;
  }

  return recovered.length > 0;
}
