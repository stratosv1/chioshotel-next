import { get } from "@vercel/blob";
import {
  claimNextAnalysisChunk,
  getAnalysisChunkState,
  getReadyAnalysisChunkResults,
  getSourceAnalysisContext,
  getSourceAnalysisView,
  listSourceFilesForAnalysis,
  markAnalysisChunkError,
  markSourceAnalysisError,
  markSourceAnalysisProcessing,
  markSourceAnalysisReady,
  replaceSourceAnalysisItems,
  saveAnalysisChunkResult,
  type ExtractedIntelligenceItem,
  type IntelligenceImportance,
  type IntelligenceItemType,
  type IntelligenceLayer,
  type SourceAnalysisContext,
  type SourceAnalysisFile,
} from "@/lib/mixalis/source-intelligence";

const SUPPORTED_DIRECT_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

const DEPTH_ITEM_TYPES: IntelligenceItemType[] = [
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
  "teaching_implication",
  "teacher_emphasis",
];

const ITEM_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "layer",
    "itemType",
    "title",
    "content",
    "importance",
    "confidence",
    "evidenceFileIds",
  ],
  properties: {
    layer: { type: "string", enum: ["understanding", "teaching"] },
    itemType: { type: "string", enum: DEPTH_ITEM_TYPES },
    title: { type: "string" },
    content: { type: "string" },
    importance: { type: "string", enum: ["core", "supporting", "advanced"] },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    evidenceFileIds: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
    },
  },
} as const;

const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["items"],
  properties: {
    items: {
      type: "array",
      maxItems: 40,
      items: ITEM_SCHEMA,
    },
  },
} as const;

type PreparedImage = {
  file: SourceAnalysisFile;
  position: number;
  dataUrl: string;
};

type RawItem = {
  layer?: unknown;
  itemType?: unknown;
  title?: unknown;
  content?: unknown;
  importance?: unknown;
  confidence?: unknown;
  evidenceFileIds?: unknown;
};

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

function cleanItems(rawItems: unknown, allowedFileIds: Set<string>) {
  const allowedLayers = new Set<IntelligenceLayer>(["understanding", "teaching"]);
  const allowedTypes = new Set<IntelligenceItemType>(DEPTH_ITEM_TYPES);
  const allowedImportance = new Set<IntelligenceImportance>([
    "core",
    "supporting",
    "advanced",
  ]);
  const items: ExtractedIntelligenceItem[] = [];

  for (const raw of Array.isArray(rawItems) ? (rawItems as RawItem[]) : []) {
    const layer = String(raw.layer ?? "") as IntelligenceLayer;
    const itemType = String(raw.itemType ?? "") as IntelligenceItemType;
    const importance = String(raw.importance ?? "") as IntelligenceImportance;
    const title = String(raw.title ?? "").trim();
    const content = String(raw.content ?? "").trim();
    const evidenceFileIds = Array.from(
      new Set(
        (Array.isArray(raw.evidenceFileIds) ? raw.evidenceFileIds : [])
          .map((value) => String(value))
          .filter((id) => allowedFileIds.has(id)),
      ),
    );

    if (
      !allowedLayers.has(layer) ||
      !allowedTypes.has(itemType) ||
      !allowedImportance.has(importance) ||
      !title ||
      !content ||
      evidenceFileIds.length === 0
    ) {
      continue;
    }

    items.push({
      layer,
      itemType,
      title: title.slice(0, 260),
      content: content.slice(0, 5000),
      importance,
      confidence: clampConfidence(raw.confidence),
      evidenceFileIds,
    });
  }

  return items;
}

async function normalizeImage(buffer: Buffer, contentType: string | null) {
  try {
    const sharpModule = await import("sharp");
    const sharp = sharpModule.default;
    const normalized = await sharp(buffer, { failOn: "none" })
      .rotate()
      .resize({
        width: 1700,
        height: 2200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 84, mozjpeg: true })
      .toBuffer();
    return { mime: "image/jpeg", buffer: normalized };
  } catch (error) {
    if (
      contentType &&
      SUPPORTED_DIRECT_MIME.has(contentType) &&
      buffer.length <= 8 * 1024 * 1024
    ) {
      return { mime: contentType, buffer };
    }
    throw error;
  }
}

async function prepareImage(file: SourceAnalysisFile, position: number): Promise<PreparedImage> {
  const result = await get(file.storageKey, { access: "private" });
  if (!result || result.statusCode !== 200) {
    throw new Error(`Private source image not found: ${file.originalName}`);
  }

  const bytes = Buffer.from(await new Response(result.stream).arrayBuffer());
  const normalized = await normalizeImage(bytes, file.contentType);
  return {
    file,
    position,
    dataUrl: `data:${normalized.mime};base64,${normalized.buffer.toString("base64")}`,
  };
}

function sourceRoleExplanation(context: SourceAnalysisContext) {
  if (context.sourceRole === "depth") {
    return `This is a DEPTH source (for example a study guide such as Savvalas/Tripolitis). It can reveal required understanding depth, exercise patterns, dependencies, traps, misconceptions, difficult cases and teaching implications. It MUST NOT define or expand the official curriculum.`;
  }
  if (context.sourceRole === "teacher") {
    return `This is TEACHER material. It can reveal emphasis, reasoning patterns, likely assessment focus and teaching implications. It MUST NOT silently redefine the official curriculum.`;
  }
  return `This is SUPPLEMENTAL material. Treat it as supporting evidence only. It MUST NOT redefine the official curriculum.`;
}

function chunkPrompt(context: SourceAnalysisContext, images: PreparedImage[]) {
  const files = images
    .map(
      (image) =>
        `${image.file.id} | position ${image.position}/${context.totalUnits} | ${image.file.originalName}`,
    )
    .join("\n");

  return `You are performing Source Intelligence for a private Greek B' Lykeiou Physics learning system.

COURSE: ${context.courseTitle}
CHAPTER: ${context.chapterNumberLabel || ""} ${context.chapterTitle}
SUBCHAPTER: ${context.subchapterNumberLabel} ${context.subchapterTitle}
SOURCE: ${context.sourceLabel || context.sourceType || context.sourceRole}
SOURCE ROLE: ${context.sourceRole}

${sourceRoleExplanation(context)}

FILES IN THIS CHUNK:
${files}

NON-NEGOTIABLE PEDAGOGICAL CONTRACT (START/PHASE3):
- The official school book defines official curriculum and scientific scope.
- Exercises and study guides reveal the depth of understanding required and may enrich how THEORY should later be taught.
- You are NOT writing the lesson now.
- You are NOT creating official curriculum claims from this source.
- You are NOT copying full exercise solutions or long source text.
- Extract structured pedagogical intelligence only.

LOOK FOR:
1. reasoning requirements the student must actually understand,
2. dependencies between physical quantities,
3. hidden information that must be inferred,
4. recurring or plausible misconceptions supported by the source design,
5. traps where a superficially plausible path is physically wrong,
6. combinations of ideas inside the same task,
7. unusual/hidden contexts where the same Physics appears,
8. difficult cases or boundary cases,
9. useful abstract solution strategies without reproducing a solution,
10. the level/depth of understanding expected,
11. TEACHING IMPLICATIONS: what the future theory explanation must make clearer, contrast explicitly, or prepare before exercises.

RULES:
- Output in Greek.
- Every item MUST cite one or more exact FILE_ID values from this chunk.
- Never invent evidence or a misconception just because it is common in Physics teaching.
- A teaching_implication should say HOW the theory later needs strengthening; do not write the final teaching prose.
- Prefer fewer strong findings over many vague findings.
- Confidence reflects how clearly the finding is supported by these photographed pages.`;
}

async function callOpenAI(input: {
  model: string;
  content: any[];
  schemaName: string;
  timeoutMs?: number;
}) {
  const apiKey = process.env.TEACHER;
  if (!apiKey) throw new Error("TEACHER is not configured for the Physics pipeline.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), input.timeoutMs ?? 90_000);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: input.model,
        input: [{ role: "user", content: input.content }],
        text: {
          format: {
            type: "json_schema",
            name: input.schemaName,
            strict: true,
            schema: RESULT_SCHEMA,
          },
        },
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(
        payload?.error?.message || `OpenAI Source Intelligence failed with HTTP ${response.status}`,
      );
    }

    const output = getOutputText(payload);
    if (!output) throw new Error("Source Intelligence returned an empty response.");
    return JSON.parse(output) as { items?: RawItem[] };
  } finally {
    clearTimeout(timeout);
  }
}

async function analyzeChunk(
  context: SourceAnalysisContext,
  files: SourceAnalysisFile[],
  positions: Map<string, number>,
) {
  const prepared: PreparedImage[] = [];
  for (const file of files) {
    prepared.push(await prepareImage(file, positions.get(file.id) || 1));
  }

  const content: any[] = [
    { type: "input_text", text: chunkPrompt(context, prepared) },
  ];
  for (const image of prepared) {
    content.push({
      type: "input_text",
      text: `FILE_ID=${image.file.id} · PAGE_POSITION=${image.position}/${context.totalUnits} · ORIGINAL_NAME=${image.file.originalName}`,
    });
    content.push({
      type: "input_image",
      image_url: image.dataUrl,
      detail: "high",
    });
  }

  const parsed = await callOpenAI({
    model: context.model,
    content,
    schemaName: "physics_source_intelligence_chunk",
  });
  return cleanItems(parsed.items, new Set(files.map((file) => file.id)));
}

async function synthesizeSourceAnalysis(
  context: SourceAnalysisContext,
  chunkResults: Array<{ chunkIndex: number; result: any }>,
  allowedFileIds: Set<string>,
) {
  const compact = chunkResults.map((chunk) => ({
    chunkIndex: chunk.chunkIndex,
    items: Array.isArray(chunk.result?.items) ? chunk.result.items : [],
  }));

  const prompt = `You are consolidating already-extracted Source Intelligence for Greek B' Lykeiou Physics.

COURSE: ${context.courseTitle}
SUBCHAPTER: ${context.subchapterNumberLabel} ${context.subchapterTitle}
SOURCE ROLE: ${context.sourceRole}
SOURCE: ${context.sourceLabel || context.sourceType || context.sourceRole}

The raw photographed pages have already been analyzed. Below you receive ONLY structured findings from those chunks.

Your job:
- merge semantic duplicates,
- preserve meaningful distinctions,
- union evidence FILE_IDs when findings repeat,
- keep important reasoning dependencies, traps, misconceptions, difficult cases and teaching implications,
- do not invent new Physics or new evidence,
- do not promote anything to official curriculum,
- do not write a lesson,
- do not turn teaching implications into final START prose,
- output in Greek.

A strong teaching_implication states what the future theory must clarify/contrast/prepare because the source evidence demands it.

STRUCTURED CHUNK FINDINGS:
${JSON.stringify(compact)}`;

  const parsed = await callOpenAI({
    model: context.model,
    content: [{ type: "input_text", text: prompt }],
    schemaName: "physics_source_intelligence_consolidated",
    timeoutMs: 240_000,
  });
  return cleanItems(parsed.items, allowedFileIds);
}

export async function runNextSourceIntelligenceStep(analysisId: string) {
  const context = await getSourceAnalysisContext(analysisId);
  if (!context) throw new Error("Source analysis not found.");
  if (context.sourceKind !== "material_batch") {
    throw new Error("This engine currently handles confirmed photographed material batches only.");
  }
  if (context.status === "ready") {
    const view = await getSourceAnalysisView(analysisId);
    return { status: "ready" as const, step: "complete" as const, view };
  }

  const allFiles = await listSourceFilesForAnalysis(analysisId);
  const byId = new Map(allFiles.map((file) => [file.id, file]));
  const positions = new Map(allFiles.map((file, index) => [file.id, index + 1]));
  const chunk = await claimNextAnalysisChunk(analysisId);

  if (chunk) {
    const locatorFiles = Array.isArray(chunk.locator?.files) ? chunk.locator.files : [];
    const files = locatorFiles
      .map((entry) => byId.get(String(entry.id)))
      .filter((file): file is SourceAnalysisFile => Boolean(file));

    if (files.length === 0) {
      const message = "Analysis chunk contains no valid confirmed source files.";
      await markAnalysisChunkError({ analysisId, chunkId: chunk.id, message });
      return { status: "error" as const, step: "chunk" as const, message };
    }

    try {
      const items = await analyzeChunk(context, files, positions);
      await saveAnalysisChunkResult({
        analysisId,
        chunkId: chunk.id,
        structuredResult: {
          promptVersion: context.promptVersion,
          files: files.map((file) => file.id),
          items,
        },
      });
      const view = await getSourceAnalysisView(analysisId);
      return { status: "processing" as const, step: "chunk" as const, view };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Source Intelligence chunk failed.";
      await markAnalysisChunkError({ analysisId, chunkId: chunk.id, message });
      return { status: "error" as const, step: "chunk" as const, message };
    }
  }

  const chunkState = await getAnalysisChunkState(analysisId);
  if (chunkState.processing > 0) {
    const view = await getSourceAnalysisView(analysisId);
    return { status: "processing" as const, step: "busy" as const, view };
  }

  if (chunkState.pending > 0 || chunkState.error > 0) {
    const view = await getSourceAnalysisView(analysisId);
    return { status: "processing" as const, step: "resume" as const, view };
  }

  if (chunkState.total === 0 || chunkState.ready !== chunkState.total) {
    const message = "Source Intelligence chunks are incomplete.";
    await markSourceAnalysisError(analysisId, message);
    return { status: "error" as const, step: "finalize" as const, message };
  }

  try {
    await markSourceAnalysisProcessing(analysisId);
    const chunkResults = await getReadyAnalysisChunkResults(analysisId);
    const consolidated = await synthesizeSourceAnalysis(
      context,
      chunkResults,
      new Set(allFiles.map((file) => file.id)),
    );
    await replaceSourceAnalysisItems({ analysisId, items: consolidated });
    await markSourceAnalysisReady(analysisId);
    const view = await getSourceAnalysisView(analysisId);
    return { status: "ready" as const, step: "finalize" as const, view };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Source Intelligence consolidation failed.";
    await markSourceAnalysisError(analysisId, message);
    return { status: "error" as const, step: "finalize" as const, message };
  }
}
