import { neon } from "@neondatabase/serverless";
import { mergeDocs, sanitizeDoc, type ProgressDoc } from "@/lib/mixalis/drive/progress";

// One row per learner: the whole practice record as JSON. Written only when the
// page syncs (end of a round, leaving the page, or after a burst of answers).

let ensureTablePromise: Promise<void> | null = null;

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

async function ensureTable() {
  if (ensureTablePromise) return ensureTablePromise;
  ensureTablePromise = (async () => {
    const sql = getSql();
    await sql`
      CREATE TABLE IF NOT EXISTS physics.drive_progress (
        learner text PRIMARY KEY,
        doc jsonb NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT NOW()
      )
    `;
  })().catch((error) => {
    ensureTablePromise = null;
    throw error;
  });
  return ensureTablePromise;
}

export async function loadProgress(learner: string): Promise<ProgressDoc> {
  await ensureTable();
  const sql = getSql();
  const rows = (await sql`SELECT doc FROM physics.drive_progress WHERE learner = ${learner}`) as { doc: unknown }[];
  return sanitizeDoc(rows[0]?.doc) ?? { stats: {}, resetAt: 0 };
}

/** Merge an incoming record into the stored one and return the result. */
export async function saveProgress(learner: string, incoming: ProgressDoc, replace = false): Promise<ProgressDoc> {
  const current = replace ? { stats: {}, resetAt: 0 } : await loadProgress(learner);
  const merged = mergeDocs(current, incoming);
  const sql = getSql();
  await ensureTable();
  await sql`
    INSERT INTO physics.drive_progress (learner, doc, updated_at)
    VALUES (${learner}, ${JSON.stringify(merged)}::jsonb, NOW())
    ON CONFLICT (learner) DO UPDATE SET doc = EXCLUDED.doc, updated_at = NOW()
  `;
  return merged;
}
