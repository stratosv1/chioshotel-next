import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { get } from "@vercel/blob";
import { PDFDocument } from "pdf-lib";

const SAVVALAS_PROMPT_VERSION = "savvalas-book-intelligence-v1";

const UNDERSTANDING_TYPES = [
  "reasoning_requirement",
  "quantity_dependency",
  "hidden_information",
  "misconception",
  "trap",
  "combined_concepts",
  "unusual_context",
  "difficult_case",
  "solution_strategy",
  "understanding_depth",
] as const;

const TEACHING_TYPES = ["teaching_implication"] as const;
const ALL_TYPES = [...UNDERSTANDING_TYPES, ...TEACHING_TYPES] as const;

type Layer = "understanding" | "teaching";
type ItemType = (typeof ALL_TYPES)[number];
type Importance = "core" | "supporting" | "advanced";

type RawItem = {
  layer?: unknown;
  itemType?: unknown;
  title?: unknown;
  content?: unknown;
  importance?: unknown;
  confidence?: unknown;
  evidenceFilePages?: unknown;
};

type CleanItem = {
  layer: Layer;
  itemType: ItemType;
  title: string;
  content: string;
  importance: Importance;
  confidence: number;
  evidenceFilePages: number[];
};

type RangeContext = {
  rangeId: string;
  documentId: string;
  storageKey: string;
  originalName: string;
  documentUpdatedAt: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  chapterId: string;
  chapterNumberLabel: string | null;
  chapterTitle: string;
  subchapterId: string;
  subchapterNumberLabel: string;
  subchapterTitle: string;
  filePageFrom: number;
  filePageTo: number;
};

const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["items"],
  properties: {
    items: {
      type: "array",
      maxItems: 60,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "layer",
          "itemType",
          "title",
          "content",
          "importance",
          "confidence",
          "evidenceFilePages",
        ],
        properties: {
          layer: { type: "string", enum: ["understanding", "teaching"] },
          itemType: { type: "string", enum: ALL_TYPES },
          title: { type: "string" },
          content: { type: "string" },
          importance: { type: "string", enum: ["core", "supporting", "advanced"] },
          confidence: { type: "number", minimum: 0, maximum: 1 },
          evidenceFilePages: {
            type: "array",
            minItems: 1,
            items: { type: "integer" },
          },
        },
      },
    },
  },
} as const;

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

function configuredModel() {
  return process.env.PHYSICS_ANALYSIS_MODEL?.trim() || "gpt-5.6";
}

function fingerprint(parts: string[]) {
  return createHash("sha256").update(parts.join("|"), "utf8").digest("hex");
}

function getOutputText(payload: any): string {
  if (typeof payload?.output_text === "string") return payload.output_text;
  for (const item of Array.isArray(payload?.output) ? payload.output : []) {
    for (const content of Array.isArray(item?.content) ? item.content : []) {
      if (typeof content?.text === "string") return content.text;
    }
  }
  return "";
}

async function getRangeContext(rangeId: string): Promise<RangeContext | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      sr.id::text AS range_id,
      sd.id::text AS document_id,
      sd.storage_key,
      sd.original_name,
      sd.updated_at::text AS document_updated_at,
      co.id::text AS course_id,
      co.code AS course_code,
      co.title AS course_title,
      c.id::text AS chapter_id,
      c.number_label AS chapter_number_label,
      c.title AS chapter_title,
      sc.id::text AS subchapter_id,
      sc.number_label AS subchapter_number_label,
      sc.title AS subchapter_title,
      sr.file_page_from,
      sr.file_page_to
    FROM physics.source_ranges sr
    JOIN physics.source_documents sd ON sd.id = sr.document_id
    JOIN physics.courses co ON co.id = sd.course_id
    JOIN physics.chapters c ON c.id = sr.chapter_id AND c.course_id = sd.course_id
    JOIN physics.subchapters sc ON sc.id = sr.subchapter_id AND sc.chapter_id = sr.chapter_id
    WHERE sr.id::text = ${rangeId}
      AND sd.source_kind = 'savvalas_book'
      AND sd.status = 'ready'
      AND co.status = 'active'
      AND c.status = 'active'
      AND sc.status = 'active'
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  const row = rows[0] as any;
  return {
    rangeId: String(row.range_id),
    documentId: String(row.document_id),
    storageKey: String(row.storage_key),
    originalName: String(row.original_name || "savvalas.pdf"),
    documentUpdatedAt: String(row.document_updated_at),
    courseId: String(row.course_id),
    courseCode: String(row.course_code),
    courseTitle: String(row.course_title),
    chapterId: String(row.chapter_id),
    chapterNumberLabel: row.chapter_number_label ? String(row.chapter_number_label) : null,
    chapterTitle: String(row.chapter_title),
    subchapterId: String(row.subchapter_id),
    subchapterNumberLabel: String(row.subchapter_number_label),
    subchapterTitle: String(row.subchapter_title),
    filePageFrom: Number(row.file_page_from),
    filePageTo: Number(row.file_page_to),
  };
}

function cleanItems(rawItems: unknown, context: RangeContext): CleanItem[] {
  const allowedTypes = new Set<string>(ALL_TYPES);
  const understanding = new Set<string>(UNDERSTANDING_TYPES);
  const allowedImportance = new Set<string>(["core", "supporting", "advanced"]);
  const items: CleanItem[] = [];

  for (const raw of Array.isArray(rawItems) ? (rawItems as RawItem[]) : []) {
    const itemType = String(raw.itemType ?? "");
    const layer = String(raw.layer ?? "");
    const importance = String(raw.importance ?? "");
    const title = String(raw.title ?? "").trim();
    const content = String(raw.content ?? "").trim();
    const expectedLayer = understanding.has(itemType) ? "understanding" : "teaching";
    const evidenceFilePages = Array.from(
      new Set(
        (Array.isArray(raw.evidenceFilePages) ? raw.evidenceFilePages : [])
          .map((value) => Number(value))
          .filter(
            (page) =>
              Number.isInteger(page) &&
              page >= context.filePageFrom &&
              page <= context.filePageTo,
          ),
      ),
    ).sort((a, b) => a - b);

    if (
      !allowedTypes.has(itemType) ||
      layer !== expectedLayer ||
      !allowedImportance.has(importance) ||
      !title ||
      !content ||
      evidenceFilePages.length === 0
    ) {
      continue;
    }

    items.push({
      layer: expectedLayer as Layer,
      itemType: itemType as ItemType,
      title: title.slice(0, 260),
      content: content.slice(0, 5000),
      importance: importance as Importance,
      confidence: Math.max(0, Math.min(1, Number(raw.confidence) || 0)),
      evidenceFilePages,
    });
  }

  return items;
}

async function extractRangePdf(context: RangeContext) {
  const result = await get(context.storageKey, { access: "private" });
  if (!result || result.statusCode !== 200) {
    throw new Error("Το ιδιωτικό PDF του Σαββάλα δεν μπόρεσε να φορτωθεί.");
  }

  const bytes = new Uint8Array(await new Response(result.stream).arrayBuffer());
  const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
  if (context.filePageFrom < 1 || context.filePageTo > source.getPageCount()) {
    throw new Error("Το mapped range βρίσκεται έξω από τις σελίδες του PDF.");
  }

  const excerpt = await PDFDocument.create();
  const indices = Array.from(
    { length: context.filePageTo - context.filePageFrom + 1 },
    (_, index) => context.filePageFrom - 1 + index,
  );
  const copied = await excerpt.copyPages(source, indices);
  for (const page of copied) excerpt.addPage(page);
  const excerptBytes = await excerpt.save();
  return Buffer.from(excerptBytes).toString("base64");
}

function prompt(context: RangeContext) {
  const pageMap = Array.from(
    { length: context.filePageTo - context.filePageFrom + 1 },
    (_, index) => `excerpt page ${index + 1} = original PDF page ${context.filePageFrom + index}`,
  ).join("\n");

  return `You are performing DEPTH Source Intelligence on a Greek B' Lykeiou Physics study guide (Savvalas) for a private learning system.

COURSE: ${context.courseTitle}
CHAPTER: ${context.chapterNumberLabel || ""} ${context.chapterTitle}
TARGET SUBCHAPTER: ${context.subchapterNumberLabel} ${context.subchapterTitle}
SOURCE: ${context.originalName}
MAPPED ORIGINAL PDF PAGES: ${context.filePageFrom}-${context.filePageTo}

PAGE MAP:
${pageMap}

ARCHITECTURE CONTRACT:
- The official school book — NOT Savvalas — remains the authority for curriculum and scope.
- Savvalas is a DEPTH / PROBLEM-SOLVING source.
- Do not create or expand official curriculum from this source.
- Do not write the final student lesson.
- Extract structured intelligence that can later strengthen START teaching.
- Do not reproduce exercise statements or worked solutions verbatim. Abstract the Physics reasoning patterns.

AUDIT THESE DIMENSIONS:
1. reasoning requirements students need before solving the exercises,
2. dependencies between physical quantities that exercises repeatedly exploit,
3. information that is implicit/hidden and must be inferred,
4. likely misconceptions revealed by the exercise design,
5. traps that cause plausible wrong reasoning,
6. combinations of concepts that raise difficulty,
7. unusual/transfer contexts,
8. difficult or edge cases,
9. reusable solution strategies and decision rules,
10. required depth of conceptual understanding beyond formula substitution,
11. teaching implications: exactly what the theory explanation should clarify, contrast, prepare or reinforce before exercises.

QUALITY RULES:
- Output in Greek.
- Every item needs evidenceFilePages using ORIGINAL PDF page numbers only (${context.filePageFrom}-${context.filePageTo}).
- Prefer patterns supported by multiple examples when present, but retain specific high-value difficult cases.
- A trap is not merely 'the exercise is hard'; identify the tempting wrong inference.
- A solution strategy must describe reasoning, not copy a source solution.
- A teaching implication should be actionable for START: what must be explained more clearly and why.
- Use layer='understanding' for all item types except teaching_implication, which must use layer='teaching'.
- Confidence reflects how directly these pages support the finding.`;
}

async function callOpenAI(context: RangeContext, excerptBase64: string) {
  const apiKey = process.env.TEACHER;
  if (!apiKey) throw new Error("TEACHER is not configured for the Physics pipeline.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 240_000);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: configuredModel(),
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: prompt(context) },
              {
                type: "input_file",
                filename: `savvalas-${context.subchapterNumberLabel}.pdf`,
                file_data: `data:application/pdf;base64,${excerptBase64}`,
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "physics_savvalas_depth_intelligence",
            strict: true,
            schema: RESULT_SCHEMA,
          },
        },
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.error?.message || `Savvalas audit failed with HTTP ${response.status}`);
    }
    const output = getOutputText(payload);
    if (!output) throw new Error("Το audit του Σαββάλα επέστρεψε κενό αποτέλεσμα.");
    return JSON.parse(output) as { items?: RawItem[] };
  } finally {
    clearTimeout(timeout);
  }
}

async function replaceItems(analysisId: string, context: RangeContext, items: CleanItem[]) {
  const sql = getSql();
  await sql`DELETE FROM physics.intelligence_items WHERE analysis_id::text = ${analysisId}`;

  for (const item of items) {
    const key = fingerprint([
      item.layer,
      item.itemType,
      item.title.normalize("NFKC").toLocaleLowerCase("el-GR"),
      item.content.normalize("NFKC").toLocaleLowerCase("el-GR").slice(0, 800),
    ]);

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
      ) VALUES (
        ${analysisId}::uuid,
        ${context.subchapterId}::uuid,
        ${item.layer},
        ${item.itemType},
        ${item.title},
        ${item.content},
        ${item.importance},
        ${item.confidence},
        ${key},
        '{}'::jsonb,
        'active'
      )
      RETURNING id::text
    `;
    const locator = JSON.stringify({ filePages: item.evidenceFilePages });

    await sql`
      INSERT INTO physics.intelligence_evidence (
        item_id,
        evidence_kind,
        source_range_id,
        locator,
        evidence_note
      ) VALUES (
        ${String(inserted[0].id)}::uuid,
        'source_range',
        ${context.rangeId}::uuid,
        ${locator}::jsonb,
        'Savvalas depth evidence'
      )
    `;
  }
}

export async function runSavvalasSourceIntelligence(rangeId: string) {
  const context = await getRangeContext(rangeId);
  if (!context) throw new Error("Το mapped range του Σαββάλα δεν βρέθηκε.");
  const totalUnits = context.filePageTo - context.filePageFrom + 1;
  if (totalUnits < 1) throw new Error("Το mapped range του Σαββάλα είναι κενό.");

  const sql = getSql();
  const model = configuredModel();
  const sourceFingerprint = fingerprint([
    "savvalas_source_range",
    context.documentId,
    context.documentUpdatedAt,
    context.rangeId,
    String(context.filePageFrom),
    String(context.filePageTo),
    SAVVALAS_PROMPT_VERSION,
    model,
  ]);

  const existing = await sql`
    SELECT id::text, status
    FROM physics.source_analyses
    WHERE subchapter_id::text = ${context.subchapterId}
      AND source_fingerprint = ${sourceFingerprint}
      AND source_role = 'depth'
    LIMIT 1
  `;

  let analysisId: string;
  if (existing.length > 0) {
    analysisId = String(existing[0].id);
    if (String(existing[0].status) === "ready") {
      const countRows = await sql`
        SELECT COUNT(*)::int AS count
        FROM physics.intelligence_items
        WHERE analysis_id::text = ${analysisId} AND status = 'active'
      `;
      return { analysisId, reused: true, itemCount: Number(countRows[0]?.count ?? 0) };
    }
  } else {
    const inserted = await sql`
      INSERT INTO physics.source_analyses (
        course_id,
        chapter_id,
        subchapter_id,
        source_kind,
        source_role,
        source_label,
        source_range_id,
        status,
        model,
        prompt_version,
        source_fingerprint,
        processed_units,
        total_units
      ) VALUES (
        ${context.courseId}::uuid,
        ${context.chapterId}::uuid,
        ${context.subchapterId}::uuid,
        'source_range',
        'depth',
        ${`Σαββάλας PDF · ${context.subchapterNumberLabel} ${context.subchapterTitle}`},
        ${context.rangeId}::uuid,
        'pending',
        ${model},
        ${SAVVALAS_PROMPT_VERSION},
        ${sourceFingerprint},
        0,
        ${totalUnits}
      )
      RETURNING id::text
    `;
    analysisId = String(inserted[0].id);
  }

  const locator = JSON.stringify({
    pages: Array.from({ length: totalUnits }, (_, index) => ({
      filePage: context.filePageFrom + index,
    })),
  });
  await sql`
    INSERT INTO physics.source_analysis_chunks (
      analysis_id,
      chunk_index,
      status,
      locator,
      model
    ) VALUES (
      ${analysisId}::uuid,
      0,
      'pending',
      ${locator}::jsonb,
      ${model}
    )
    ON CONFLICT (analysis_id, chunk_index) DO NOTHING
  `;

  const claim = await sql`
    UPDATE physics.source_analysis_chunks
    SET status = 'processing', error_message = NULL, updated_at = NOW()
    WHERE analysis_id::text = ${analysisId}
      AND chunk_index = 0
      AND status IN ('pending', 'error')
    RETURNING id::text
  `;
  if (claim.length === 0) {
    throw new Error("Το audit αυτού του range εκτελείται ήδη ή έχει ολοκληρωθεί.");
  }

  await sql`
    UPDATE physics.source_analyses
    SET status = 'processing', error_message = NULL, updated_at = NOW()
    WHERE id::text = ${analysisId}
  `;

  try {
    const excerpt = await extractRangePdf(context);
    const parsed = await callOpenAI(context, excerpt);
    const items = cleanItems(parsed.items, context);
    if (items.length === 0) {
      throw new Error("Το audit δεν παρήγαγε έγκυρα depth findings για αυτό το range.");
    }

    await replaceItems(analysisId, context, items);
    const structuredResult = JSON.stringify({
      promptVersion: SAVVALAS_PROMPT_VERSION,
      rangeId: context.rangeId,
      filePageFrom: context.filePageFrom,
      filePageTo: context.filePageTo,
      items,
    });

    await sql`
      UPDATE physics.source_analysis_chunks
      SET
        status = 'ready',
        structured_result = ${structuredResult}::jsonb,
        error_message = NULL,
        completed_at = NOW(),
        updated_at = NOW()
      WHERE analysis_id::text = ${analysisId} AND chunk_index = 0
    `;
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

    return { analysisId, reused: false, itemCount: items.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Savvalas audit failed.";
    await sql`
      UPDATE physics.source_analysis_chunks
      SET status = 'error', error_message = ${message.slice(0, 1800)}, updated_at = NOW()
      WHERE analysis_id::text = ${analysisId} AND chunk_index = 0
    `;
    await sql`
      UPDATE physics.source_analyses
      SET status = 'error', error_message = ${message.slice(0, 1800)}, updated_at = NOW()
      WHERE id::text = ${analysisId}
    `;
    throw error;
  }
}
