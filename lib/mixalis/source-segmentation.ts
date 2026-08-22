import { neon } from "@neondatabase/serverless";

export type SegmentationRelation = "primary" | "related" | "boundary";
export type SegmentationRunStatus =
  | "processing"
  | "needs_review"
  | "ready"
  | "confirmed"
  | "error";

export type SegmentationSourceFile = {
  id: string;
  originalName: string;
  storageKey: string;
  contentType: string | null;
  sizeBytes: number | null;
  sortOrder: number;
  createdAt: string;
};

export type SegmentationSubchapter = {
  id: string;
  numberLabel: string;
  title: string;
  sortOrder: number;
};

export type SegmentationBatchInput = {
  batchId: string;
  chapterId: string;
  chapterNumberLabel: string | null;
  chapterTitle: string;
  courseCode: string | null;
  courseTitle: string | null;
  sourceType: string;
  label: string | null;
  subchapterId: string | null;
  subchapters: SegmentationSubchapter[];
  files: SegmentationSourceFile[];
};

export type SegmentationMappingInput = {
  subchapterId: string;
  relation: SegmentationRelation;
  confidence: number;
  reason: string;
};

export type SegmentationReviewMapping = SegmentationMappingInput & {
  subchapterNumberLabel: string;
  subchapterTitle: string;
  assignmentSource: "ai" | "manual";
  status: "proposed" | "confirmed";
};

export type SegmentationReviewFile = {
  id: string;
  originalName: string;
  position: number;
  contentType: string | null;
  mappings: SegmentationReviewMapping[];
};

export type SourceSegmentationReviewData = {
  run: {
    id: string;
    batchId: string;
    chapterId: string;
    status: SegmentationRunStatus;
    model: string;
    errorMessage: string | null;
    createdAt: string;
    completedAt: string | null;
    confirmedAt: string | null;
    sourceType: string;
    label: string | null;
  };
  files: SegmentationReviewFile[];
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

function confidence(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export async function getSegmentationBatchInput(
  batchId: string,
  chapterId: string,
): Promise<SegmentationBatchInput | null> {
  const sql = getSql();
  const batchRows = await sql`
    SELECT
      mb.id::text AS batch_id,
      mb.chapter_id::text AS chapter_id,
      mb.subchapter_id::text AS subchapter_id,
      mb.source_type,
      mb.label,
      c.number_label AS chapter_number_label,
      c.title AS chapter_title,
      co.code AS course_code,
      co.title AS course_title
    FROM physics.material_batches mb
    JOIN physics.chapters c ON c.id = mb.chapter_id
    LEFT JOIN physics.courses co ON co.id = c.course_id
    WHERE mb.id::text = ${batchId}
      AND mb.chapter_id::text = ${chapterId}
      AND c.status = 'active'
    LIMIT 1
  `;

  if (batchRows.length === 0) return null;
  const batch = batchRows[0];

  const [subchapterRows, fileRows] = await Promise.all([
    sql`
      SELECT
        id::text,
        number_label,
        title,
        sort_order
      FROM physics.subchapters
      WHERE chapter_id::text = ${chapterId}
        AND status = 'active'
      ORDER BY sort_order ASC, number_label ASC
    `,
    sql`
      SELECT
        id::text,
        original_name,
        storage_key,
        content_type,
        size_bytes,
        sort_order,
        created_at::text
      FROM physics.source_files
      WHERE batch_id::text = ${batchId}
      ORDER BY created_at ASC, sort_order ASC, id ASC
    `,
  ]);

  return {
    batchId: String(batch.batch_id),
    chapterId: String(batch.chapter_id),
    chapterNumberLabel: batch.chapter_number_label
      ? String(batch.chapter_number_label)
      : null,
    chapterTitle: String(batch.chapter_title),
    courseCode: batch.course_code ? String(batch.course_code) : null,
    courseTitle: batch.course_title ? String(batch.course_title) : null,
    sourceType: String(batch.source_type),
    label: batch.label ? String(batch.label) : null,
    subchapterId: batch.subchapter_id ? String(batch.subchapter_id) : null,
    subchapters: subchapterRows.map((row) => ({
      id: String(row.id),
      numberLabel: String(row.number_label),
      title: String(row.title),
      sortOrder: Number(row.sort_order ?? 0),
    })),
    files: fileRows.map((row) => ({
      id: String(row.id),
      originalName: String(row.original_name),
      storageKey: String(row.storage_key),
      contentType: row.content_type ? String(row.content_type) : null,
      sizeBytes: row.size_bytes == null ? null : Number(row.size_bytes),
      sortOrder: Number(row.sort_order ?? 0),
      createdAt: String(row.created_at),
    })),
  };
}

export async function createSegmentationRun(input: {
  batchId: string;
  chapterId: string;
  model: string;
}) {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO physics.source_segmentation_runs (
      batch_id,
      chapter_id,
      status,
      model
    )
    VALUES (
      ${input.batchId}::uuid,
      ${input.chapterId}::uuid,
      'processing',
      ${input.model}
    )
    RETURNING id::text
  `;

  return String(rows[0].id);
}

export async function saveSegmentationFileResult(input: {
  runId: string;
  sourceFileId: string;
  mappings: SegmentationMappingInput[];
}) {
  const sql = getSql();

  const validRows = await sql`
    SELECT 1
    FROM physics.source_segmentation_runs r
    JOIN physics.source_files sf ON sf.batch_id = r.batch_id
    WHERE r.id::text = ${input.runId}
      AND sf.id::text = ${input.sourceFileId}
      AND r.status <> 'confirmed'
    LIMIT 1
  `;
  if (validRows.length === 0) {
    throw new Error("Invalid source file for segmentation run.");
  }

  await sql`
    DELETE FROM physics.source_file_subchapter_links
    WHERE run_id::text = ${input.runId}
      AND source_file_id::text = ${input.sourceFileId}
  `;

  for (const mapping of input.mappings) {
    await sql`
      INSERT INTO physics.source_file_subchapter_links (
        run_id,
        source_file_id,
        subchapter_id,
        relation,
        confidence,
        reason,
        assignment_source,
        status
      )
      VALUES (
        ${input.runId}::uuid,
        ${input.sourceFileId}::uuid,
        ${mapping.subchapterId}::uuid,
        ${mapping.relation},
        ${confidence(mapping.confidence)},
        ${mapping.reason.slice(0, 800)},
        'ai',
        'proposed'
      )
      ON CONFLICT (run_id, source_file_id, subchapter_id)
      DO UPDATE SET
        relation = EXCLUDED.relation,
        confidence = EXCLUDED.confidence,
        reason = EXCLUDED.reason,
        assignment_source = 'ai',
        status = 'proposed',
        updated_at = NOW()
    `;
  }
}

export async function finalizeSegmentationRun(
  runId: string,
  errorMessage?: string | null,
): Promise<SegmentationRunStatus> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      COUNT(DISTINCT sf.id)::int AS total_files,
      COUNT(DISTINCT l.source_file_id) FILTER (
        WHERE l.relation IN ('primary', 'boundary')
      )::int AS mapped_files,
      COUNT(DISTINCT l.source_file_id) FILTER (
        WHERE l.confidence < 0.75
      )::int AS low_confidence_files
    FROM physics.source_segmentation_runs r
    JOIN physics.source_files sf ON sf.batch_id = r.batch_id
    LEFT JOIN physics.source_file_subchapter_links l
      ON l.run_id = r.id AND l.source_file_id = sf.id
    WHERE r.id::text = ${runId}
    GROUP BY r.id
  `;

  if (rows.length === 0) throw new Error("Segmentation run not found.");

  const totalFiles = Number(rows[0].total_files ?? 0);
  const mappedFiles = Number(rows[0].mapped_files ?? 0);
  const lowConfidenceFiles = Number(rows[0].low_confidence_files ?? 0);
  const nextStatus: SegmentationRunStatus =
    totalFiles > 0 && mappedFiles === totalFiles && lowConfidenceFiles === 0
      ? "ready"
      : "needs_review";

  await sql`
    UPDATE physics.source_segmentation_runs
    SET
      status = ${nextStatus},
      error_message = ${errorMessage || null},
      completed_at = NOW(),
      updated_at = NOW()
    WHERE id::text = ${runId}
  `;

  return nextStatus;
}

export async function markSegmentationRunError(runId: string, message: string) {
  const sql = getSql();
  await sql`
    UPDATE physics.source_segmentation_runs
    SET
      status = 'error',
      error_message = ${message.slice(0, 2000)},
      completed_at = NOW(),
      updated_at = NOW()
    WHERE id::text = ${runId}
  `;
}

export async function getSegmentationReview(
  runId: string,
  chapterId: string,
): Promise<SourceSegmentationReviewData | null> {
  const sql = getSql();
  const runRows = await sql`
    SELECT
      r.id::text,
      r.batch_id::text,
      r.chapter_id::text,
      r.status,
      r.model,
      r.error_message,
      r.created_at::text,
      r.completed_at::text,
      r.confirmed_at::text,
      mb.source_type,
      mb.label
    FROM physics.source_segmentation_runs r
    JOIN physics.material_batches mb ON mb.id = r.batch_id
    WHERE r.id::text = ${runId}
      AND r.chapter_id::text = ${chapterId}
    LIMIT 1
  `;

  if (runRows.length === 0) return null;
  const run = runRows[0];

  const fileRows = await sql`
    SELECT
      sf.id::text,
      sf.original_name,
      sf.content_type,
      sf.created_at::text,
      l.subchapter_id::text,
      l.relation,
      l.confidence,
      l.reason,
      l.assignment_source,
      l.status AS link_status,
      sc.number_label,
      sc.title AS subchapter_title
    FROM physics.source_files sf
    LEFT JOIN physics.source_file_subchapter_links l
      ON l.source_file_id = sf.id
      AND l.run_id::text = ${runId}
    LEFT JOIN physics.subchapters sc ON sc.id = l.subchapter_id
    WHERE sf.batch_id = ${String(run.batch_id)}::uuid
    ORDER BY sf.created_at ASC, sf.sort_order ASC, sf.id ASC, sc.sort_order ASC
  `;

  const filesById = new Map<string, SegmentationReviewFile>();
  for (const row of fileRows) {
    const id = String(row.id);
    let file = filesById.get(id);
    if (!file) {
      file = {
        id,
        originalName: String(row.original_name),
        position: filesById.size + 1,
        contentType: row.content_type ? String(row.content_type) : null,
        mappings: [],
      };
      filesById.set(id, file);
    }

    if (row.subchapter_id) {
      file.mappings.push({
        subchapterId: String(row.subchapter_id),
        relation: row.relation as SegmentationRelation,
        confidence: Number(row.confidence ?? 0),
        reason: row.reason ? String(row.reason) : "",
        subchapterNumberLabel: String(row.number_label),
        subchapterTitle: String(row.subchapter_title),
        assignmentSource: row.assignment_source as "ai" | "manual",
        status: row.link_status as "proposed" | "confirmed",
      });
    }
  }

  return {
    run: {
      id: String(run.id),
      batchId: String(run.batch_id),
      chapterId: String(run.chapter_id),
      status: run.status as SegmentationRunStatus,
      model: String(run.model),
      errorMessage: run.error_message ? String(run.error_message) : null,
      createdAt: String(run.created_at),
      completedAt: run.completed_at ? String(run.completed_at) : null,
      confirmedAt: run.confirmed_at ? String(run.confirmed_at) : null,
      sourceType: String(run.source_type),
      label: run.label ? String(run.label) : null,
    },
    files: Array.from(filesById.values()),
  };
}

export async function replaceSegmentationMappings(input: {
  runId: string;
  sourceFileId: string;
  mappings: Array<{
    subchapterId: string;
    relation: SegmentationRelation;
  }>;
}) {
  const sql = getSql();
  const runRows = await sql`
    SELECT r.chapter_id::text, r.status
    FROM physics.source_segmentation_runs r
    JOIN physics.source_files sf ON sf.batch_id = r.batch_id
    WHERE r.id::text = ${input.runId}
      AND sf.id::text = ${input.sourceFileId}
    LIMIT 1
  `;
  if (runRows.length === 0) throw new Error("Segmentation run or file not found.");
  if (String(runRows[0].status) === "confirmed") {
    throw new Error("Confirmed segmentation cannot be edited.");
  }

  const chapterId = String(runRows[0].chapter_id);
  const uniqueMappings = Array.from(
    new Map(
      input.mappings.map((mapping) => [mapping.subchapterId, mapping]),
    ).values(),
  ).slice(0, 3);

  if (uniqueMappings.length === 0) {
    throw new Error("At least one subchapter mapping is required.");
  }

  const allowedRelations: SegmentationRelation[] = ["primary", "related", "boundary"];
  if (uniqueMappings.some((mapping) => !allowedRelations.includes(mapping.relation))) {
    throw new Error("Invalid segmentation relation.");
  }

  for (const mapping of uniqueMappings) {
    const subchapterRows = await sql`
      SELECT 1
      FROM physics.subchapters
      WHERE id::text = ${mapping.subchapterId}
        AND chapter_id::text = ${chapterId}
        AND status = 'active'
      LIMIT 1
    `;
    if (subchapterRows.length === 0) {
      throw new Error("Subchapter does not belong to this chapter.");
    }
  }

  if (!uniqueMappings.some((mapping) => mapping.relation === "primary" || mapping.relation === "boundary")) {
    uniqueMappings[0] = { ...uniqueMappings[0], relation: "primary" };
  }

  await sql`
    DELETE FROM physics.source_file_subchapter_links
    WHERE run_id::text = ${input.runId}
      AND source_file_id::text = ${input.sourceFileId}
  `;

  for (const mapping of uniqueMappings) {
    await sql`
      INSERT INTO physics.source_file_subchapter_links (
        run_id,
        source_file_id,
        subchapter_id,
        relation,
        confidence,
        reason,
        assignment_source,
        status
      )
      VALUES (
        ${input.runId}::uuid,
        ${input.sourceFileId}::uuid,
        ${mapping.subchapterId}::uuid,
        ${mapping.relation},
        1,
        'Χειροκίνητη διόρθωση',
        'manual',
        'proposed'
      )
    `;
  }

  await finalizeSegmentationRun(input.runId);
}

export async function confirmSegmentationRun(runId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT
      r.status,
      COUNT(DISTINCT sf.id)::int AS total_files,
      COUNT(DISTINCT l.source_file_id) FILTER (
        WHERE l.relation IN ('primary', 'boundary')
      )::int AS mapped_files
    FROM physics.source_segmentation_runs r
    JOIN physics.source_files sf ON sf.batch_id = r.batch_id
    LEFT JOIN physics.source_file_subchapter_links l
      ON l.run_id = r.id AND l.source_file_id = sf.id
    WHERE r.id::text = ${runId}
    GROUP BY r.id
  `;

  if (rows.length === 0) throw new Error("Segmentation run not found.");
  if (String(rows[0].status) === "confirmed") return;

  const totalFiles = Number(rows[0].total_files ?? 0);
  const mappedFiles = Number(rows[0].mapped_files ?? 0);
  if (totalFiles === 0 || mappedFiles !== totalFiles) {
    throw new Error("Every photo must be assigned before confirmation.");
  }

  const invalidRows = await sql`
    SELECT 1
    FROM physics.source_file_subchapter_links l
    JOIN physics.source_segmentation_runs r ON r.id = l.run_id
    JOIN physics.subchapters sc ON sc.id = l.subchapter_id
    WHERE l.run_id::text = ${runId}
      AND sc.chapter_id <> r.chapter_id
    LIMIT 1
  `;
  if (invalidRows.length > 0) {
    throw new Error("Cross-chapter segmentation mapping detected.");
  }

  await sql`
    UPDATE physics.source_file_subchapter_links
    SET status = 'confirmed', updated_at = NOW()
    WHERE run_id::text = ${runId}
  `;

  await sql`
    UPDATE physics.source_segmentation_runs
    SET
      status = 'confirmed',
      confirmed_at = NOW(),
      completed_at = COALESCE(completed_at, NOW()),
      updated_at = NOW()
    WHERE id::text = ${runId}
  `;
}

export async function getSourceFileForPrivateView(fileId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT
      sf.id::text,
      sf.storage_key,
      sf.content_type,
      sf.original_name
    FROM physics.source_files sf
    JOIN physics.material_batches mb ON mb.id = sf.batch_id
    JOIN physics.chapters c ON c.id = mb.chapter_id
    WHERE sf.id::text = ${fileId}
      AND c.status = 'active'
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  return {
    id: String(rows[0].id),
    storageKey: String(rows[0].storage_key),
    contentType: rows[0].content_type ? String(rows[0].content_type) : null,
    originalName: String(rows[0].original_name),
  };
}
