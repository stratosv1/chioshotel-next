import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";

export const CANONICAL_SUBCHAPTER_INTELLIGENCE_PROMPT_VERSION =
  "subchapter-intelligence-v3-pdf-only";

type CanonicalAnalysis = {
  id: string;
  role: "official" | "depth";
  label: string | null;
  itemCount: number;
  createdAt: string;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

function hash(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

async function getSubchapterContext(subchapterId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT
      sc.id::text AS subchapter_id,
      c.id::text AS chapter_id,
      co.id::text AS course_id
    FROM physics.subchapters sc
    JOIN physics.chapters c ON c.id = sc.chapter_id
    JOIN physics.courses co ON co.id = c.course_id
    WHERE sc.id::text = ${subchapterId}
      AND sc.status = 'active'
      AND c.status = 'active'
      AND co.status = 'active'
    LIMIT 1
  `;
  return rows.length > 0 ? (rows[0] as any) : null;
}

async function listCanonicalAnalyses(subchapterId: string): Promise<CanonicalAnalysis[]> {
  const sql = getSql();
  const rows = await sql`
    WITH eligible AS (
      SELECT
        a.id,
        a.source_role,
        a.source_label,
        a.created_at,
        ROW_NUMBER() OVER (
          PARTITION BY a.source_role
          ORDER BY a.created_at DESC, a.id DESC
        ) AS rn
      FROM physics.source_analyses a
      JOIN physics.source_ranges sr ON sr.id = a.source_range_id
      JOIN physics.source_documents sd ON sd.id = sr.document_id
      WHERE a.subchapter_id::text = ${subchapterId}
        AND a.status = 'ready'
        AND a.source_kind = 'source_range'
        AND (
          (a.source_role = 'official' AND sd.source_kind = 'school_book')
          OR
          (a.source_role = 'depth' AND sd.source_kind = 'savvalas_book')
        )
    )
    SELECT
      e.id::text AS analysis_id,
      e.source_role,
      e.source_label,
      e.created_at::text,
      COUNT(ii.id)::int AS item_count
    FROM eligible e
    LEFT JOIN physics.intelligence_items ii
      ON ii.analysis_id = e.id
     AND ii.status = 'active'
    WHERE e.rn = 1
    GROUP BY e.id, e.source_role, e.source_label, e.created_at
    ORDER BY CASE e.source_role WHEN 'official' THEN 1 ELSE 2 END
  `;

  return (rows as any[]).map((row) => ({
    id: String(row.analysis_id),
    role: String(row.source_role) as "official" | "depth",
    label: row.source_label ? String(row.source_label) : null,
    itemCount: Number(row.item_count ?? 0),
    createdAt: String(row.created_at),
  }));
}

async function sourceSnapshot(analyses: CanonicalAnalysis[]) {
  const sql = getSql();
  const snapshots: Array<Record<string, unknown>> = [];

  for (const analysis of analyses) {
    const findings = await sql`
      SELECT
        id::text,
        layer,
        item_type,
        title,
        content,
        importance,
        confidence
      FROM physics.intelligence_items
      WHERE analysis_id::text = ${analysis.id}
        AND status = 'active'
      ORDER BY created_at ASC, id ASC
    `;

    snapshots.push({
      analysisId: analysis.id,
      role: analysis.role,
      findings: (findings as any[]).map((item) => ({
        id: String(item.id),
        layer: String(item.layer),
        itemType: String(item.item_type),
        title: String(item.title),
        content: String(item.content),
        importance: String(item.importance),
        confidence: Number(item.confidence ?? 0),
      })),
    });
  }

  return hash(
    JSON.stringify({
      promptVersion: CANONICAL_SUBCHAPTER_INTELLIGENCE_PROMPT_VERSION,
      sources: snapshots,
    }),
  );
}

export async function getCanonicalSubchapterSourceReadiness(subchapterId: string) {
  const analyses = await listCanonicalAnalyses(subchapterId);
  const official = analyses.find((item) => item.role === "official") ?? null;
  const depth = analyses.find((item) => item.role === "depth") ?? null;

  return {
    ready: Boolean(official && depth && official.itemCount > 0 && depth.itemCount > 0),
    sourceCount: analyses.length,
    findingCount: analyses.reduce((sum, item) => sum + item.itemCount, 0),
    official,
    depth,
  };
}

export async function createCanonicalSubchapterIntelligenceVersion(subchapterId: string) {
  const context = await getSubchapterContext(subchapterId);
  if (!context) throw new Error("Physics subchapter not found.");

  const readiness = await getCanonicalSubchapterSourceReadiness(subchapterId);
  if (!readiness.official || readiness.official.itemCount === 0) {
    throw new Error(
      "Το Official School Book Intelligence πρέπει να ολοκληρωθεί πριν από τη σύνθεση.",
    );
  }
  if (!readiness.depth || readiness.depth.itemCount === 0) {
    throw new Error(
      "Το PDF-range Depth Audit του Σαββάλα πρέπει να ολοκληρωθεί πριν από τη σύνθεση.",
    );
  }

  const analyses = [readiness.official, readiness.depth];
  const snapshotHash = await sourceSnapshot(analyses);
  const sql = getSql();

  const existing = await sql`
    SELECT id::text, version_number, status
    FROM physics.subchapter_intelligence_versions
    WHERE subchapter_id::text = ${subchapterId}
      AND source_snapshot_hash = ${snapshotHash}
      AND prompt_version = ${CANONICAL_SUBCHAPTER_INTELLIGENCE_PROMPT_VERSION}
    ORDER BY version_number DESC
    LIMIT 1
  `;
  if (existing.length > 0) {
    return {
      id: String(existing[0].id),
      versionNumber: Number(existing[0].version_number),
      status: String(existing[0].status),
      created: false,
    };
  }

  const versionRows = await sql`
    SELECT COALESCE(MAX(version_number), 0)::int + 1 AS next_version
    FROM physics.subchapter_intelligence_versions
    WHERE subchapter_id::text = ${subchapterId}
  `;
  const versionNumber = Number(versionRows[0]?.next_version ?? 1);
  const model = process.env.PHYSICS_ANALYSIS_MODEL?.trim() || "gpt-5.6";
  const placeholder = JSON.stringify({
    state: "pending",
    sourceCount: 2,
    findingCount: readiness.findingCount,
    architecture: "pdf-only-canonical",
  });

  await sql`
    UPDATE physics.subchapter_intelligence_versions
    SET status = 'superseded'
    WHERE subchapter_id::text = ${subchapterId}
      AND status = 'draft'
      AND prompt_version <> ${CANONICAL_SUBCHAPTER_INTELLIGENCE_PROMPT_VERSION}
  `;

  const inserted = await sql`
    INSERT INTO physics.subchapter_intelligence_versions (
      course_id,
      chapter_id,
      subchapter_id,
      version_number,
      status,
      model,
      prompt_version,
      source_snapshot_hash,
      content,
      diff_summary
    ) VALUES (
      ${String(context.course_id)}::uuid,
      ${String(context.chapter_id)}::uuid,
      ${subchapterId}::uuid,
      ${versionNumber},
      'draft',
      ${model},
      ${CANONICAL_SUBCHAPTER_INTELLIGENCE_PROMPT_VERSION},
      ${snapshotHash},
      ${placeholder}::jsonb,
      NULL
    )
    RETURNING id::text
  `;
  const versionId = String(inserted[0].id);

  for (const analysis of analyses) {
    await sql`
      INSERT INTO physics.subchapter_intelligence_version_sources (
        version_id,
        analysis_id,
        subchapter_id
      ) VALUES (
        ${versionId}::uuid,
        ${analysis.id}::uuid,
        ${subchapterId}::uuid
      )
      ON CONFLICT (version_id, analysis_id) DO NOTHING
    `;
  }

  return { id: versionId, versionNumber, status: "draft", created: true };
}
