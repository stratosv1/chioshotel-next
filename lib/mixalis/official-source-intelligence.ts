import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { get } from "@vercel/blob";
import { PDFDocument } from "pdf-lib";

const OFFICIAL_PROMPT_VERSION = "school-book-intelligence-v1";

const OFFICIAL_ITEM_TYPES = [
  "concept",
  "definition",
  "physical_quantity",
  "law",
  "formula",
  "assumption",
  "prerequisite",
  "curriculum_boundary",
  "worked_example",
] as const;

type OfficialItemType = (typeof OFFICIAL_ITEM_TYPES)[number];
type Importance = "core" | "supporting" | "advanced";

type RawOfficialItem = {
  layer?: unknown;
  itemType?: unknown;
  title?: unknown;
  content?: unknown;
  importance?: unknown;
  confidence?: unknown;
  evidenceFilePages?: unknown;
};

type OfficialItem = {
  itemType: OfficialItemType;
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
  printedPageFrom: number | null;
  printedPageTo: number | null;
};

export type OfficialAnalysisView = {
  analysisId: string;
  status: string;
  processedUnits: number;
  totalUnits: number;
  errorMessage: string | null;
  model: string;
  range: RangeContext;
  items: Array<{
    id: string;
    itemType: OfficialItemType;
    title: string;
    content: string;
    importance: Importance;
    confidence: number;
    evidenceCount: number;
  }>;
};

const OFFICIAL_RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["items"],
  properties: {
    items: {
      type: "array",
      maxItems: 40,
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
          layer: { type: "string", enum: ["curriculum"] },
          itemType: { type: "string", enum: OFFICIAL_ITEM_TYPES },
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
  return (
    process.env.PHYSICS_ANALYSIS_MODEL?.trim() ||
    "gpt-5.6"
  );
}

function fingerprint(parts: string[]) {
  return createHash("sha256").update(parts.join("|"), "utf8").digest("hex");
}

function dedupeKey(item: OfficialItem) {
  const normalize = (value: string) =>
    value.normalize("NFKC").toLocaleLowerCase("el-GR").replace(/\s+/g, " ").trim();
  return fingerprint([
    "curriculum",
    item.itemType,
    normalize(item.title),
    normalize(item.content).slice(0, 800),
  ]);
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

function clampConfidence(value: unknown) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(1, number));
}

function cleanOfficialItems(rawItems: unknown, context: RangeContext): OfficialItem[] {
  const allowedTypes = new Set<string>(OFFICIAL_ITEM_TYPES);
  const allowedImportance = new Set<string>(["core", "supporting", "advanced"]);
  const items: OfficialItem[] = [];

  for (const raw of Array.isArray(rawItems) ? (rawItems as RawOfficialItem[]) : []) {
    if (String(raw.layer ?? "") !== "curriculum") continue;
    const itemType = String(raw.itemType ?? "");
    const importance = String(raw.importance ?? "");
    const title = String(raw.title ?? "").trim();
    const content = String(raw.content ?? "").trim();
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
      !allowedImportance.has(importance) ||
      !title ||
      !content ||
      evidenceFilePages.length === 0
    ) {
      continue;
    }

    items.push({
      itemType: itemType as OfficialItemType,
      title: title.slice(0, 260),
      content: content.slice(0, 5000),
      importance: importance as Importance,
      confidence: clampConfidence(raw.confidence),
      evidenceFilePages,
    });
  }

  return items;
}

async function getRangeContextByRangeId(rangeId: string): Promise<RangeContext | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      sr.id::text AS range_id,
      sd.id::text AS document_id,
      sd.storage_key,
      sd.original_name,
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
      sr.file_page_to,
      sr.printed_page_from,
      sr.printed_page_to
    FROM physics.source_ranges sr
    JOIN physics.source_documents sd ON sd.id = sr.document_id
    JOIN physics.courses co ON co.id = sd.course_id
    JOIN physics.chapters c ON c.id = sr.chapter_id AND c.course_id = sd.course_id
    JOIN physics.subchapters sc ON sc.id = sr.subchapter_id AND sc.chapter_id = sr.chapter_id
    WHERE sr.id::text = ${rangeId}
      AND sd.source_kind = 'school_book'
      AND sd.status = 'ready'
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  const row = rows[0] as any;
  return {
    rangeId: String(row.range_id),
    documentId: String(row.document_id),
    storageKey: String(row.storage_key),
    originalName: String(row.original_name || "school-book.pdf"),
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
    printedPageFrom: row.printed_page_from == null ? null : Number(row.printed_page_from),
    printedPageTo: row.printed_page_to == null ? null : Number(row.printed_page_to),
  };
}

export async function getOfficialRangeForSubchapter(subchapterId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT sr.id::text
    FROM physics.source_ranges sr
    JOIN physics.source_documents sd ON sd.id = sr.document_id
    WHERE sr.subchapter_id::text = ${subchapterId}
      AND sd.source_kind = 'school_book'
      AND sd.status = 'ready'
    ORDER BY sr.sort_order ASC, sr.file_page_from ASC
    LIMIT 1
  `;
  return rows.length > 0 ? String(rows[0].id) : null;
}

export async function createOfficialAnalysisFromRange(rangeId: string) {
  const context = await getRangeContextByRangeId(rangeId);
  if (!context) throw new Error("Official school-book range not found.");

  const sql = getSql();
  const model = configuredModel();
  const totalUnits = context.filePageTo - context.filePageFrom + 1;
  if (totalUnits <= 0) throw new Error("Official school-book range is invalid.");

  const sourceFingerprint = fingerprint([
    "source_range",
    context.rangeId,
    OFFICIAL_PROMPT_VERSION,
    model,
  ]);

  const existing = await sql`
    SELECT id::text
    FROM physics.source_analyses
    WHERE subchapter_id::text = ${context.subchapterId}
      AND source_fingerprint = ${sourceFingerprint}
    LIMIT 1
  `;

  let analysisId: string;
  let created = false;
  if (existing.length > 0) {
    analysisId = String(existing[0].id);
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
        'official',
        ${`Σχολικό βιβλίο · ${context.subchapterNumberLabel} ${context.subchapterTitle}`},
        ${context.rangeId}::uuid,
        'pending',
        ${model},
        ${OFFICIAL_PROMPT_VERSION},
        ${sourceFingerprint},
        0,
        ${totalUnits}
      )
      RETURNING id::text
    `;
    analysisId = String(inserted[0].id);
    created = true;
  }

  const pages = Array.from({ length: totalUnits }, (_, index) => {
    const filePage = context.filePageFrom + index;
    const printedPage =
      context.printedPageFrom == null ? null : context.printedPageFrom + index;
    return { filePage, printedPage };
  });
  const locator = JSON.stringify({ pages });

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

  return { analysisId, created };
}

async function getRangeContextForAnalysis(analysisId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT source_range_id::text
    FROM physics.source_analyses
    WHERE id::text = ${analysisId}
      AND source_kind = 'source_range'
      AND source_role = 'official'
    LIMIT 1
  `;
  if (rows.length === 0 || !rows[0].source_range_id) return null;
  return getRangeContextByRangeId(String(rows[0].source_range_id));
}

export async function getOfficialAnalysisView(
  analysisId: string,
): Promise<OfficialAnalysisView | null> {
  const sql = getSql();
  const range = await getRangeContextForAnalysis(analysisId);
  if (!range) return null;

  const [analysisRows, itemRows] = await Promise.all([
    sql`
      SELECT id::text, status, processed_units, total_units, error_message, model
      FROM physics.source_analyses
      WHERE id::text = ${analysisId}
      LIMIT 1
    `,
    sql`
      SELECT
        ii.id::text,
        ii.item_type,
        ii.title,
        ii.content,
        ii.importance,
        ii.confidence,
        COUNT(ie.id)::text AS evidence_count
      FROM physics.intelligence_items ii
      LEFT JOIN physics.intelligence_evidence ie ON ie.item_id = ii.id
      WHERE ii.analysis_id::text = ${analysisId}
        AND ii.layer = 'curriculum'
        AND ii.status = 'active'
      GROUP BY ii.id
      ORDER BY
        CASE ii.importance WHEN 'core' THEN 1 WHEN 'supporting' THEN 2 ELSE 3 END,
        ii.created_at ASC
    `,
  ]);

  if (analysisRows.length === 0) return null;
  const row = analysisRows[0] as any;
  return {
    analysisId: String(row.id),
    status: String(row.status),
    processedUnits: Number(row.processed_units ?? 0),
    totalUnits: Number(row.total_units ?? 0),
    errorMessage: row.error_message ? String(row.error_message) : null,
    model: String(row.model),
    range,
    items: (itemRows as any[]).map((item) => ({
      id: String(item.id),
      itemType: item.item_type as OfficialItemType,
      title: String(item.title),
      content: String(item.content),
      importance: item.importance as Importance,
      confidence: Number(item.confidence ?? 0),
      evidenceCount: Number(item.evidence_count ?? 0),
    })),
  };
}

async function extractRangePdf(context: RangeContext) {
  const result = await get(context.storageKey, { access: "private" });
  if (!result || result.statusCode !== 200) {
    throw new Error("Private school-book PDF could not be loaded.");
  }

  const bytes = new Uint8Array(await new Response(result.stream).arrayBuffer());
  const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
  if (context.filePageFrom < 1 || context.filePageTo > source.getPageCount()) {
    throw new Error("Mapped school-book range is outside the stored PDF.");
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

function officialPrompt(context: RangeContext) {
  const pageMap = Array.from(
    { length: context.filePageTo - context.filePageFrom + 1 },
    (_, index) => {
      const originalFilePage = context.filePageFrom + index;
      const printedPage =
        context.printedPageFrom == null ? null : context.printedPageFrom + index;
      return `excerpt page ${index + 1} = original PDF page ${originalFilePage}${
        printedPage == null ? "" : ` = printed page ${printedPage}`
      }`;
    },
  ).join("\n");

  return `You are performing OFFICIAL School Book Source Intelligence for a private Greek B' Lykeiou Physics learning system.

COURSE: ${context.courseTitle}
CHAPTER: ${context.chapterNumberLabel || ""} ${context.chapterTitle}
SUBCHAPTER: ${context.subchapterNumberLabel} ${context.subchapterTitle}
OFFICIAL SOURCE: ${context.originalName}
MAPPED RANGE: original PDF pages ${context.filePageFrom}-${context.filePageTo}$${""}

PAGE MAP:
${pageMap}

NON-NEGOTIABLE START/PHASE3 CONTRACT:
- This official school book is the authority for curriculum and scope.
- Extract ONLY what these mapped pages support.
- Do NOT import outside Physics knowledge, study-guide extensions, common exam tricks or assumptions that are absent from these pages.
- You are NOT writing the lesson.
- Exercises/study guides will later provide depth; this stage defines the official curriculum layer.

EXTRACT AS STRUCTURED CURRICULUM INTELLIGENCE:
1. concepts explicitly introduced or used as teaching targets,
2. definitions,
3. physical quantities and their meaning/role,
4. laws/principles explicitly stated,
5. formulas/relations and what they express,
6. assumptions/conditions stated by the book,
7. prerequisites explicitly relied on or recalled,
8. curriculum boundaries: what this mapped subchapter does and does not establish,
9. worked examples used by the book to formalize the official idea.

RULES:
- Output in Greek.
- Every item must cite one or more ORIGINAL PDF page numbers using evidenceFilePages, not excerpt page numbers.
- Allowed evidence pages are only ${context.filePageFrom}-${context.filePageTo}.
- Keep formula notation readable in plain Unicode/LaTeX-like text.
- Prefer precise items over broad summaries.
- Do not infer a misconception, trap or advanced extension here; those belong to depth sources.
- Confidence reflects how directly the official pages support the item.`;
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
              { type: "input_text", text: officialPrompt(context) },
              {
                type: "input_file",
                filename: `school-book-${context.subchapterNumberLabel}.pdf`,
                file_data: `data:application/pdf;base64,${excerptBase64}`,
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "physics_official_school_book_intelligence",
            strict: true,
            schema: OFFICIAL_RESULT_SCHEMA,
          },
        },
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(
        payload?.error?.message || `Official Source Intelligence failed with HTTP ${response.status}`,
      );
    }
    const output = getOutputText(payload);
    if (!output) throw new Error("Official Source Intelligence returned an empty response.");
    return JSON.parse(output) as { items?: RawOfficialItem[] };
  } finally {
    clearTimeout(timeout);
  }
}

async function replaceOfficialItems(
  analysisId: string,
  context: RangeContext,
  items: OfficialItem[],
) {
  const sql = getSql();
  await sql`DELETE FROM physics.intelligence_items WHERE analysis_id::text = ${analysisId}`;

  for (const item of items) {
    const key = dedupeKey(item);
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
        'curriculum',
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
    const itemId = String(inserted[0].id);

    const printedPages = item.evidenceFilePages.map((filePage) =>
      context.printedPageFrom == null
        ? null
        : context.printedPageFrom + (filePage - context.filePageFrom),
    );
    const locator = JSON.stringify({
      filePages: item.evidenceFilePages,
      printedPages,
    });

    await sql`
      INSERT INTO physics.intelligence_evidence (
        item_id,
        evidence_kind,
        source_range_id,
        locator,
        evidence_note
      ) VALUES (
        ${itemId}::uuid,
        'source_range',
        ${context.rangeId}::uuid,
        ${locator}::jsonb,
        'Official school-book evidence'
      )
    `;
  }
}

export async function runOfficialSourceIntelligence(analysisId: string) {
  const sql = getSql();
  const view = await getOfficialAnalysisView(analysisId);
  if (!view) throw new Error("Official source analysis not found.");
  if (view.status === "ready") return view;

  const claim = await sql`
    UPDATE physics.source_analysis_chunks
    SET status = 'processing', error_message = NULL, updated_at = NOW()
    WHERE analysis_id::text = ${analysisId}
      AND chunk_index = 0
      AND status IN ('pending', 'error')
    RETURNING id::text
  `;

  if (claim.length === 0) {
    const active = await sql`
      SELECT status
      FROM physics.source_analysis_chunks
      WHERE analysis_id::text = ${analysisId} AND chunk_index = 0
      LIMIT 1
    `;
    if (String(active[0]?.status || "") === "processing") {
      return getOfficialAnalysisView(analysisId);
    }
    if (String(active[0]?.status || "") === "ready") {
      return getOfficialAnalysisView(analysisId);
    }
    throw new Error("Official source analysis chunk could not be claimed.");
  }

  await sql`
    UPDATE physics.source_analyses
    SET status = 'processing', error_message = NULL, updated_at = NOW()
    WHERE id::text = ${analysisId}
  `;

  try {
    const excerpt = await extractRangePdf(view.range);
    const parsed = await callOpenAI(view.range, excerpt);
    const items = cleanOfficialItems(parsed.items, view.range);
    if (items.length === 0) {
      throw new Error("Official Source Intelligence produced no valid curriculum items.");
    }

    const structuredResult = JSON.stringify({
      promptVersion: OFFICIAL_PROMPT_VERSION,
      rangeId: view.range.rangeId,
      filePageFrom: view.range.filePageFrom,
      filePageTo: view.range.filePageTo,
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

    await replaceOfficialItems(analysisId, view.range, items);
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Official Source Intelligence failed.";
    await sql`
      UPDATE physics.source_analysis_chunks
      SET status = 'error', error_message = ${message.slice(0, 1800)}, updated_at = NOW()
      WHERE analysis_id::text = ${analysisId} AND chunk_index = 0
    `;
    await sql`
      UPDATE physics.source_analyses
      SET status = 'error', error_message = ${message.slice(0, 1800)}, updated_at = NOW()
      WHERE id::text = ${analysisId} AND status <> 'ready'
    `;
  }

  return getOfficialAnalysisView(analysisId);
}
