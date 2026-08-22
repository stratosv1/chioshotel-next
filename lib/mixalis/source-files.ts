import { neon } from "@neondatabase/serverless";

export type PhysicsSourceFile = {
  id: string;
  batchId: string;
  originalName: string;
  storageKey: string;
  contentType: string | null;
  sizeBytes: number | null;
  sortOrder: number;
  status: "uploaded" | "processing" | "ready" | "needs_retake" | "error";
  createdAt: string;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }
  return neon(databaseUrl);
}

export async function getMaterialBatchContext(batchId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT
      mb.id::text AS batch_id,
      mb.chapter_id::text AS chapter_id
    FROM physics.material_batches mb
    JOIN physics.chapters c ON c.id = mb.chapter_id
    WHERE mb.id::text = ${batchId}
      AND c.status = 'active'
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  return {
    batchId: String(rows[0].batch_id),
    chapterId: String(rows[0].chapter_id),
  };
}

export async function registerSourceFile(input: {
  batchId: string;
  originalName: string;
  storageKey: string;
  contentType?: string | null;
  sizeBytes?: number | null;
  sortOrder?: number;
}) {
  const sql = getSql();
  const context = await getMaterialBatchContext(input.batchId);
  if (!context) {
    throw new Error("Material batch not found.");
  }

  await sql`
    INSERT INTO physics.source_files (
      batch_id,
      original_name,
      storage_provider,
      storage_key,
      content_type,
      size_bytes,
      sort_order,
      status
    )
    VALUES (
      ${input.batchId}::uuid,
      ${input.originalName},
      'vercel_blob',
      ${input.storageKey},
      ${input.contentType || null},
      ${input.sizeBytes ?? null},
      ${input.sortOrder ?? 0},
      'uploaded'
    )
    ON CONFLICT (storage_provider, storage_key) DO NOTHING
  `;

  await sql`
    UPDATE physics.material_batches
    SET status = 'uploaded', updated_at = NOW()
    WHERE id::text = ${input.batchId}
  `;

  await sql`
    UPDATE physics.chapters
    SET updated_at = NOW()
    WHERE id::text = ${context.chapterId}
  `;
}

export async function listSourceFiles(batchId: string): Promise<PhysicsSourceFile[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      id::text,
      batch_id::text,
      original_name,
      storage_key,
      content_type,
      size_bytes,
      sort_order,
      status,
      created_at::text
    FROM physics.source_files
    WHERE batch_id::text = ${batchId}
    ORDER BY sort_order ASC, created_at ASC
  `;

  return rows.map((row) => ({
    id: String(row.id),
    batchId: String(row.batch_id),
    originalName: String(row.original_name),
    storageKey: String(row.storage_key),
    contentType: row.content_type ? String(row.content_type) : null,
    sizeBytes: row.size_bytes == null ? null : Number(row.size_bytes),
    sortOrder: Number(row.sort_order ?? 0),
    status: row.status as PhysicsSourceFile["status"],
    createdAt: String(row.created_at),
  }));
}
