import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";

export const SOURCE_INTELLIGENCE_PROMPT_VERSION = "source-intelligence-v1";
export const SOURCE_INTELLIGENCE_CHUNK_SIZE = 3;

export type SourceAnalysisStatus =
  | "pending"
  | "processing"
  | "ready"
  | "error"
  | "superseded";

export type SourceRole =
  | "official"
  | "depth"
  | "teacher"
  | "assessment"
  | "supplemental";

export type IntelligenceLayer = "curriculum" | "understanding" | "teaching";

export type IntelligenceImportance = "core" | "supporting" | "advanced";

export type IntelligenceItemType =
  | "concept"
  | "definition"
  | "physical_quantity"
  | "law"
  | "formula"
  | "assumption"
  | "prerequisite"
  | "curriculum_boundary"
  | "worked_example"
  | "reasoning_requirement"
  | "quantity_dependency"
  | "hidden_information"
  | "misconception"
  | "trap"
  | "combined_concepts"
  | "unusual_context"
  | "difficult_case"
  | "solution_strategy"
  | "understanding_depth"
  | "teaching_implication"
  | "teacher_emphasis";

export type ExtractedIntelligenceItem = {
  layer: IntelligenceLayer;
  itemType: IntelligenceItemType;
  title: string;
  content: string;
  importance: IntelligenceImportance;
  confidence: number;
  evidenceFileIds: string[];
};

export type SourceAnalysisFile = {
  id: string;
  originalName: string;
  storageKey: string;
  contentType: string | null;
  sortOrder: number;
};

export type SourceAnalysisContext = {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  chapterId: string;
  chapterNumberLabel: string | null;
  chapterTitle: string;
  subchapterId: string;
  subchapterNumberLabel: string;
  subchapterTitle: string;
  sourceKind: "material_batch" | "source_range";
  sourceRole: SourceRole;
  sourceLabel: string | null;
  sourceType: string | null;
  materialBatchId: string | null;
  segmentationRunId: string | null;
  sourceRangeId: string | null;
  status: SourceAnalysisStatus;
  model: string;
  promptVersion: string;
  processedUnits: number;
  totalUnits: number;
  errorMessage: string | null;
};

export type SourceAnalysisChunk = {
  id: string;
  chunkIndex: number;
  status: "pending" | "processing" | "ready" | "error";
  locator: {
    files?: Array<{ id: string; sortOrder: number; originalName: string }>;
  };
  errorMessage: string | null;
};

export type SourceAnalysisView = {
  context: SourceAnalysisContext;
  chunks: {
    total: number;
    ready: number;
    processing: number;
    error: number;
  };
  schoolBookMapped: boolean;
  items: Array<{
    id: string;
    layer: IntelligenceLayer;
    itemType: IntelligenceItemType;
    title: string;
    content: string;
    importance: IntelligenceImportance;
    confidence: number;
    evidenceCount: number;
  }>;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

export function getConfiguredPhysicsAnalysisModel() {
  const model =
    process.env.PHYSICS_ANALYSIS_MODEL?.trim() ||
    process.env.OPENAI_ASSISTANT_MODEL?.trim();
  if (!model) {
    throw new Error(
      "PHYSICS_ANALYSIS_MODEL (or OPENAI_ASSISTANT_MODEL fallback) is not configured.",
    );
  }
  return model;
}

function sourceRoleForMaterialSource(sourceType: string): SourceRole {
  if (sourceType === "savvalas" || sourceType === "tripolitis") return "depth";
  if (sourceType === "school_teacher") return "teacher";
  return "supplemental";
}

function fingerprint(parts: string[]) {
  return createHash("sha256").update(parts.join("|"), "utf8").digest("hex");
}

function normalizeDedupeText(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("el-GR")
    .replace(/\s+/g, " ")
    .trim();
}

function itemDedupeKey(item: ExtractedIntelligenceItem) {
  return fingerprint([
    item.layer,
    item.itemType,
    normalizeDedupeText(item.title),
    normalizeDedupeText(item.content).slice(0, 800),
  ]);
}

export async function createAnalysesFromConfirmedSegmentation(runId: string) {
  const sql = getSql();
  const model = getConfiguredPhysicsAnalysisModel();

  const rows = await sql`
    SELECT
      r.id::text AS run_id,
      r.batch_id::text AS batch_id,
      r.chapter_id::text AS chapter_id,
      r.status AS run_status,
      mb.source_type,
      mb.label,
      c.course_id::text AS course_id,
      co.code AS course_code,
      co.title AS course_title,
      c.number_label AS chapter_number_label,
      c.title AS chapter_title,
      l.subchapter_id::text AS subchapter_id,
      sc.number_label AS subchapter_number_label,
      sc.title AS subchapter_title,
      COUNT(DISTINCT l.source_file_id)::text AS source_file_count
    FROM physics.source_segmentation_runs r
    JOIN physics.material_batches mb ON mb.id = r.batch_id
    JOIN physics.chapters c ON c.id = r.chapter_id
    JOIN physics.courses co ON co.id = c.course_id
    JOIN physics.source_file_subchapter_links l ON l.run_id = r.id
    JOIN physics.subchapters sc
      ON sc.id = l.subchapter_id
     AND sc.chapter_id = r.chapter_id
    WHERE r.id::text = ${runId}
      AND r.status = 'confirmed'
    GROUP BY
      r.id,
      mb.id,
      c.id,
      co.id,
      l.subchapter_id,
      sc.id
    ORDER BY sc.sort_order ASC, sc.number_label ASC
  `;

  if (rows.length === 0) {
    throw new Error("Confirmed segmentation run not found or has no confirmed mappings.");
  }

  const analyses: Array<{ id: string; subchapterId: string; created: boolean }> = [];

  for (const row of rows as any[]) {
    const sourceRole = sourceRoleForMaterialSource(String(row.source_type));
    const sourceFingerprint = fingerprint([
      "segmentation",
      String(row.run_id),
      String(row.subchapter_id),
      SOURCE_INTELLIGENCE_PROMPT_VERSION,
      model,
    ]);

    const existingRows = await sql`
      SELECT id::text
      FROM physics.source_analyses
      WHERE subchapter_id::text = ${String(row.subchapter_id)}
        AND source_fingerprint = ${sourceFingerprint}
      LIMIT 1
    `;

    let analysisId: string;
    let created = false;

    if (existingRows.length > 0) {
      analysisId = String(existingRows[0].id);
    } else {
      const inserted = await sql`
        INSERT INTO physics.source_analyses (
          course_id,
          chapter_id,
          subchapter_id,
          source_kind,
          source_role,
          source_label,
          material_batch_id,
          segmentation_run_id,
          status,
          model,
          prompt_version,
          source_fingerprint,
          processed_units,
          total_units
        )
        VALUES (
          ${String(row.course_id)}::uuid,
          ${String(row.chapter_id)}::uuid,
          ${String(row.subchapter_id)}::uuid,
          'material_batch',
          ${sourceRole},
          ${row.label ? String(row.label) : null},
          ${String(row.batch_id)}::uuid,
          ${String(row.run_id)}::uuid,
          'pending',
          ${model},
          ${SOURCE_INTELLIGENCE_PROMPT_VERSION},
          ${sourceFingerprint},
          0,
          ${Number(row.source_file_count)}
        )
        RETURNING id::text
      `;
      analysisId = String(inserted[0].id);
      created = true;
    }

    const files = await listSourceFilesForAnalysis(analysisId);
    for (let start = 0; start < files.length; start += SOURCE_INTELLIGENCE_CHUNK_SIZE) {
      const chunkFiles = files.slice(start, start + SOURCE_INTELLIGENCE_CHUNK_SIZE);
      const locator = JSON.stringify({
        files: chunkFiles.map((file) => ({
          id: file.id,
          sortOrder: file.sortOrder,
          originalName: file.originalName,
        })),
      });

      await sql`
        INSERT INTO physics.source_analysis_chunks (
          analysis_id,
          chunk_index,
          status,
          locator,
          model
        )
        VALUES (
          ${analysisId}::uuid,
          ${Math.floor(start / SOURCE_INTELLIGENCE_CHUNK_SIZE)},
          'pending',
          ${locator}::jsonb,
          ${model}
        )
        ON CONFLICT (analysis_id, chunk_index) DO NOTHING
      `;
    }

    analyses.push({
      id: analysisId,
      subchapterId: String(row.subchapter_id),
      created,
    });
  }

  return analyses;
}

export async function getSourceAnalysisContext(
  analysisId: string,
): Promise<SourceAnalysisContext | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      a.id::text,
      a.course_id::text,
      co.code AS course_code,
      co.title AS course_title,
      a.chapter_id::text,
      c.number_label AS chapter_number_label,
      c.title AS chapter_title,
      a.subchapter_id::text,
      sc.number_label AS subchapter_number_label,
      sc.title AS subchapter_title,
      a.source_kind,
      a.source_role,
      a.source_label,
      mb.source_type,
      a.material_batch_id::text,
      a.segmentation_run_id::text,
      a.source_range_id::text,
      a.status,
      a.model,
      a.prompt_version,
      a.processed_units,
      a.total_units,
      a.error_message
    FROM physics.source_analyses a
    JOIN physics.courses co ON co.id = a.course_id
    JOIN physics.chapters c ON c.id = a.chapter_id
    JOIN physics.subchapters sc ON sc.id = a.subchapter_id
    LEFT JOIN physics.material_batches mb ON mb.id = a.material_batch_id
    WHERE a.id::text = ${analysisId}
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  const row = rows[0] as any;
  return {
    id: String(row.id),
    courseId: String(row.course_id),
    courseCode: String(row.course_code),
    courseTitle: String(row.course_title),
    chapterId: String(row.chapter_id),
    chapterNumberLabel: row.chapter_number_label ? String(row.chapter_number_label) : null,
    chapterTitle: String(row.chapter_title),
    subchapterId: String(row.subchapter_id),
    subchapterNumberLabel: String(row.subchapter_number_label),
    subchapterTitle: String(row.subchapter_title),
    sourceKind: row.source_kind,
    sourceRole: row.source_role,
    sourceLabel: row.source_label ? String(row.source_label) : null,
    sourceType: row.source_type ? String(row.source_type) : null,
    materialBatchId: row.material_batch_id ? String(row.material_batch_id) : null,
    segmentationRunId: row.segmentation_run_id ? String(row.segmentation_run_id) : null,
    sourceRangeId: row.source_range_id ? String(row.source_range_id) : null,
    status: row.status,
    model: String(row.model),
    promptVersion: String(row.prompt_version),
    processedUnits: Number(row.processed_units ?? 0),
    totalUnits: Number(row.total_units ?? 0),
    errorMessage: row.error_message ? String(row.error_message) : null,
  };
}

export async function listSourceFilesForAnalysis(
  analysisId: string,
): Promise<SourceAnalysisFile[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT DISTINCT
      sf.id::text,
      sf.original_name,
      sf.storage_key,
      sf.content_type,
      sf.sort_order,
      sf.created_at
    FROM physics.source_analyses a
    JOIN physics.source_file_subchapter_links l
      ON l.run_id = a.segmentation_run_id
     AND l.subchapter_id = a.subchapter_id
    JOIN physics.source_files sf ON sf.id = l.source_file_id
    JOIN physics.source_segmentation_runs r ON r.id = l.run_id
    WHERE a.id::text = ${analysisId}
      AND a.source_kind = 'material_batch'
      AND r.status = 'confirmed'
    ORDER BY sf.sort_order ASC, sf.created_at ASC
  `;

  return (rows as any[]).map((row) => ({
    id: String(row.id),
    originalName: String(row.original_name),
    storageKey: String(row.storage_key),
    contentType: row.content_type ? String(row.content_type) : null,
    sortOrder: Number(row.sort_order ?? 0),
  }));
}

export async function recoverStaleAnalysisChunk(analysisId: string) {
  const sql = getSql();
  await sql`
    UPDATE physics.source_analysis_chunks
    SET
      status = 'error',
      error_message = COALESCE(error_message, 'Previous processing attempt did not complete.'),
      updated_at = NOW()
    WHERE analysis_id::text = ${analysisId}
      AND status = 'processing'
      AND updated_at < NOW() - INTERVAL '3 minutes'
  `;
}

export async function claimNextAnalysisChunk(
  analysisId: string,
): Promise<SourceAnalysisChunk | null> {
  const sql = getSql();
  await recoverStaleAnalysisChunk(analysisId);

  const rows = await sql`
    WITH candidate AS (
      SELECT ch.id
      FROM physics.source_analysis_chunks ch
      WHERE ch.analysis_id::text = ${analysisId}
        AND ch.status IN ('pending', 'error')
        AND NOT EXISTS (
          SELECT 1
          FROM physics.source_analysis_chunks active
          WHERE active.analysis_id = ch.analysis_id
            AND active.status = 'processing'
        )
      ORDER BY ch.chunk_index ASC
      LIMIT 1
    )
    UPDATE physics.source_analysis_chunks ch
    SET
      status = 'processing',
      error_message = NULL,
      updated_at = NOW()
    WHERE ch.id = (SELECT id FROM candidate)
      AND ch.status IN ('pending', 'error')
    RETURNING
      ch.id::text,
      ch.chunk_index,
      ch.status,
      ch.locator,
      ch.error_message
  `;

  if (rows.length === 0) return null;
  const row = rows[0] as any;

  await sql`
    UPDATE physics.source_analyses
    SET status = 'processing', error_message = NULL, updated_at = NOW()
    WHERE id::text = ${analysisId}
      AND status <> 'ready'
  `;

  return {
    id: String(row.id),
    chunkIndex: Number(row.chunk_index),
    status: row.status,
    locator: (row.locator || {}) as SourceAnalysisChunk["locator"],
    errorMessage: row.error_message ? String(row.error_message) : null,
  };
}

export async function saveAnalysisChunkResult(input: {
  analysisId: string;
  chunkId: string;
  structuredResult: unknown;
}) {
  const sql = getSql();
  const payload = JSON.stringify(input.structuredResult ?? {});

  await sql`
    UPDATE physics.source_analysis_chunks
    SET
      status = 'ready',
      structured_result = ${payload}::jsonb,
      error_message = NULL,
      completed_at = NOW(),
      updated_at = NOW()
    WHERE id::text = ${input.chunkId}
      AND analysis_id::text = ${input.analysisId}
  `;

  await refreshSourceAnalysisProgress(input.analysisId);
}

export async function markAnalysisChunkError(input: {
  analysisId: string;
  chunkId: string;
  message: string;
}) {
  const sql = getSql();
  await sql`
    UPDATE physics.source_analysis_chunks
    SET
      status = 'error',
      error_message = ${input.message.slice(0, 1800)},
      updated_at = NOW()
    WHERE id::text = ${input.chunkId}
      AND analysis_id::text = ${input.analysisId}
  `;
  await sql`
    UPDATE physics.source_analyses
    SET
      status = 'error',
      error_message = ${input.message.slice(0, 1800)},
      updated_at = NOW()
    WHERE id::text = ${input.analysisId}
      AND status <> 'ready'
  `;
}

export async function refreshSourceAnalysisProgress(analysisId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT COALESCE(
      SUM(jsonb_array_length(locator -> 'files')) FILTER (WHERE status = 'ready'),
      0
    )::text AS processed_units
    FROM physics.source_analysis_chunks
    WHERE analysis_id::text = ${analysisId}
  `;
  const processed = Number(rows[0]?.processed_units ?? 0);
  await sql`
    UPDATE physics.source_analyses
    SET processed_units = LEAST(total_units, ${processed}), updated_at = NOW()
    WHERE id::text = ${analysisId}
  `;
  return processed;
}

export async function getAnalysisChunkState(analysisId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT
      COUNT(*)::text AS total,
      COUNT(*) FILTER (WHERE status = 'ready')::text AS ready,
      COUNT(*) FILTER (WHERE status = 'processing')::text AS processing,
      COUNT(*) FILTER (WHERE status = 'error')::text AS error,
      COUNT(*) FILTER (WHERE status = 'pending')::text AS pending
    FROM physics.source_analysis_chunks
    WHERE analysis_id::text = ${analysisId}
  `;
  const row = rows[0] as any;
  return {
    total: Number(row?.total ?? 0),
    ready: Number(row?.ready ?? 0),
    processing: Number(row?.processing ?? 0),
    error: Number(row?.error ?? 0),
    pending: Number(row?.pending ?? 0),
  };
}

export async function getReadyAnalysisChunkResults(analysisId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT chunk_index, structured_result
    FROM physics.source_analysis_chunks
    WHERE analysis_id::text = ${analysisId}
      AND status = 'ready'
    ORDER BY chunk_index ASC
  `;
  return (rows as any[]).map((row) => ({
    chunkIndex: Number(row.chunk_index),
    result: row.structured_result,
  }));
}

export async function replaceSourceAnalysisItems(input: {
  analysisId: string;
  items: ExtractedIntelligenceItem[];
}) {
  const sql = getSql();
  const context = await getSourceAnalysisContext(input.analysisId);
  if (!context) throw new Error("Source analysis not found.");

  const files = await listSourceFilesForAnalysis(input.analysisId);
  const allowedFileIds = new Set(files.map((file) => file.id));

  await sql`
    DELETE FROM physics.intelligence_items
    WHERE analysis_id::text = ${input.analysisId}
  `;

  for (const rawItem of input.items) {
    const layer = rawItem.layer;
    if (context.sourceRole !== "official" && layer === "curriculum") continue;

    const title = rawItem.title.trim().slice(0, 260);
    const content = rawItem.content.trim().slice(0, 5000);
    if (!title || !content) continue;

    const evidenceFileIds = Array.from(
      new Set(rawItem.evidenceFileIds.filter((id) => allowedFileIds.has(id))),
    );
    if (context.sourceKind === "material_batch" && evidenceFileIds.length === 0) continue;

    const item: ExtractedIntelligenceItem = {
      ...rawItem,
      title,
      content,
      evidenceFileIds,
      confidence: Math.max(0, Math.min(1, Number(rawItem.confidence) || 0)),
    };
    const dedupeKey = itemDedupeKey(item);

    const inserted = await sql`
      INSERT INTO physics.intelligence_items (
        analysis_id,
        subchapter_id,
        layer,
        item_type,
        title,
        content,
        importance,
        confidence,
        dedupe_key,
        metadata,
        status
      )
      VALUES (
        ${input.analysisId}::uuid,
        ${context.subchapterId}::uuid,
        ${item.layer},
        ${item.itemType},
        ${item.title},
        ${item.content},
        ${item.importance},
        ${item.confidence},
        ${dedupeKey},
        '{}'::jsonb,
        'active'
      )
      RETURNING id::text
    `;
    const itemId = String(inserted[0].id);

    for (const fileId of evidenceFileIds) {
      await sql`
        INSERT INTO physics.intelligence_evidence (
          item_id,
          evidence_kind,
          source_file_id,
          locator,
          evidence_note
        )
        VALUES (
          ${itemId}::uuid,
          'source_file',
          ${fileId}::uuid,
          '{}'::jsonb,
          NULL
        )
      `;
    }
  }
}

export async function markSourceAnalysisReady(analysisId: string) {
  const sql = getSql();
  await sql`
    UPDATE physics.source_analyses
    SET
      status = 'ready',
      processed_units = total_units,
      error_message = NULL,
      completed_at = NOW(),
      updated_at = NOW()
    WHERE id::text = ${analysisId}
  `;
}

export async function markSourceAnalysisError(analysisId: string, message: string) {
  const sql = getSql();
  await sql`
    UPDATE physics.source_analyses
    SET
      status = 'error',
      error_message = ${message.slice(0, 1800)},
      updated_at = NOW()
    WHERE id::text = ${analysisId}
      AND status <> 'ready'
  `;
}

export async function getSourceAnalysisView(
  analysisId: string,
): Promise<SourceAnalysisView | null> {
  const sql = getSql();
  const context = await getSourceAnalysisContext(analysisId);
  if (!context) return null;

  const [chunkState, mappedRows, itemRows] = await Promise.all([
    getAnalysisChunkState(analysisId),
    sql`
      SELECT EXISTS (
        SELECT 1
        FROM physics.source_ranges sr
        JOIN physics.source_documents sd ON sd.id = sr.document_id
        WHERE sr.subchapter_id::text = ${context.subchapterId}
          AND sr.chapter_id::text = ${context.chapterId}
          AND sd.course_id::text = ${context.courseId}
          AND sd.source_kind = 'school_book'
          AND sd.status = 'ready'
      ) AS school_book_mapped
    `,
    sql`
      SELECT
        ii.id::text,
        ii.layer,
        ii.item_type,
        ii.title,
        ii.content,
        ii.importance,
        ii.confidence,
        COUNT(ie.id)::text AS evidence_count
      FROM physics.intelligence_items ii
      LEFT JOIN physics.intelligence_evidence ie ON ie.item_id = ii.id
      WHERE ii.analysis_id::text = ${analysisId}
        AND ii.status = 'active'
      GROUP BY ii.id
      ORDER BY
        CASE ii.layer WHEN 'understanding' THEN 1 WHEN 'teaching' THEN 2 ELSE 3 END,
        CASE ii.importance WHEN 'core' THEN 1 WHEN 'supporting' THEN 2 ELSE 3 END,
        ii.created_at ASC
    `,
  ]);

  return {
    context,
    chunks: {
      total: chunkState.total,
      ready: chunkState.ready,
      processing: chunkState.processing,
      error: chunkState.error,
    },
    schoolBookMapped: Boolean(mappedRows[0]?.school_book_mapped),
    items: (itemRows as any[]).map((row) => ({
      id: String(row.id),
      layer: row.layer,
      itemType: row.item_type,
      title: String(row.title),
      content: String(row.content),
      importance: row.importance,
      confidence: Number(row.confidence ?? 0),
      evidenceCount: Number(row.evidence_count ?? 0),
    })),
  };
}
