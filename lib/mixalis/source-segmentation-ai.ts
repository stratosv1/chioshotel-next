import { get } from "@vercel/blob";
import {
  createSegmentationRun,
  finalizeSegmentationRun,
  getSegmentationBatchInput,
  markSegmentationRunError,
  saveSegmentationFileResult,
  type SegmentationBatchInput,
  type SegmentationMappingInput,
  type SegmentationRelation,
  type SegmentationSourceFile,
} from "@/lib/mixalis/source-segmentation";

const CHUNK_SIZE = 4;
const LOW_CONFIDENCE = 0.75;
const SUPPORTED_DIRECT_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["results"],
  properties: {
    results: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["fileId", "needsReview", "mappings"],
        properties: {
          fileId: { type: "string" },
          needsReview: { type: "boolean" },
          mappings: {
            type: "array",
            maxItems: 3,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["subchapterId", "relation", "confidence", "reason"],
              properties: {
                subchapterId: { type: "string" },
                relation: {
                  type: "string",
                  enum: ["primary", "related", "boundary"],
                },
                confidence: { type: "number", minimum: 0, maximum: 1 },
                reason: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
} as const;

type PreparedImage = {
  file: SegmentationSourceFile;
  position: number;
  dataUrl: string;
};

type RawResult = {
  fileId?: unknown;
  needsReview?: unknown;
  mappings?: Array<{
    subchapterId?: unknown;
    relation?: unknown;
    confidence?: unknown;
    reason?: unknown;
  }>;
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

async function normalizeImage(buffer: Buffer, contentType: string | null) {
  try {
    const sharpModule = await import("sharp");
    const sharp = sharpModule.default;
    const normalized = await sharp(buffer, { failOn: "none" })
      .rotate()
      .resize({
        width: 1600,
        height: 2000,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    return {
      mime: "image/jpeg",
      buffer: normalized,
    };
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

async function prepareImage(
  file: SegmentationSourceFile,
  position: number,
): Promise<PreparedImage> {
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

function cleanMappings(
  raw: RawResult,
  allowedSubchapterIds: Set<string>,
): SegmentationMappingInput[] {
  const allowedRelations = new Set<SegmentationRelation>([
    "primary",
    "related",
    "boundary",
  ]);
  const seen = new Set<string>();
  const mappings: SegmentationMappingInput[] = [];
  const needsReview = raw.needsReview === true;

  for (const item of Array.isArray(raw.mappings) ? raw.mappings : []) {
    const subchapterId = String(item?.subchapterId ?? "");
    const relation = String(item?.relation ?? "") as SegmentationRelation;
    if (
      !allowedSubchapterIds.has(subchapterId) ||
      !allowedRelations.has(relation) ||
      seen.has(subchapterId)
    ) {
      continue;
    }

    seen.add(subchapterId);
    let confidence = clampConfidence(item?.confidence);
    if (needsReview) confidence = Math.min(confidence, LOW_CONFIDENCE - 0.01);

    mappings.push({
      subchapterId,
      relation,
      confidence,
      reason: String(item?.reason ?? "").slice(0, 800),
    });
  }

  if (
    mappings.length > 0 &&
    !mappings.some((mapping) =>
      mapping.relation === "primary" || mapping.relation === "boundary"
    )
  ) {
    mappings[0] = { ...mappings[0], relation: "primary" };
  }

  return mappings;
}

function chapterPrompt(input: SegmentationBatchInput) {
  const subchapters = input.subchapters
    .map(
      (item) =>
        `${item.id} | ${item.numberLabel} | ${item.title}`,
    )
    .join("\n");

  return `You classify photographed pages from ONE Greek high-school Physics chapter into the official subchapters below.

COURSE: ${input.courseTitle || input.courseCode || "Physics"}
CHAPTER: ${input.chapterNumberLabel || ""} ${input.chapterTitle}
SOURCE TYPE: ${input.sourceType}
SOURCE LABEL: ${input.label || ""}

ALLOWED SUBCHAPTERS — use ONLY these exact IDs:
${subchapters}

RULES:
- Classify each supplied image independently but use page order and continuity across neighboring images.
- Do not invent a subchapter. Never output an ID outside the list.
- A normal page should have one primary mapping.
- Use related only for a genuinely secondary subchapter also used on the page.
- Use boundary when the same photographed page visibly contains the end of one official subchapter and the start of another.
- If the page is unreadable, ambiguous, merely a cover/table of contents, or you cannot support a mapping from the image, return an empty mappings array and needsReview=true. Do NOT force a guess.
- If confidence is below 0.75, set needsReview=true.
- Do not solve exercises and do not generate teaching prose. This task is only segmentation.
- Return one result for every FILE_ID provided.`;
}

async function classifyChunk(
  input: SegmentationBatchInput,
  images: PreparedImage[],
  model: string,
): Promise<Map<string, SegmentationMappingInput[]>> {
  const apiKey = process.env.TEACHER;
  if (!apiKey) throw new Error("TEACHER is not configured for the Physics pipeline.");

  const content: any[] = [
    {
      type: "input_text",
      text: chapterPrompt(input),
    },
  ];

  for (const image of images) {
    content.push({
      type: "input_text",
      text: `FILE_ID=${image.file.id} · PAGE_POSITION=${image.position}/${input.files.length} · ORIGINAL_NAME=${image.file.originalName}`,
    });
    content.push({
      type: "input_image",
      image_url: image.dataUrl,
      detail: "high",
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        input: [{ role: "user", content }],
        text: {
          format: {
            type: "json_schema",
            name: "physics_source_segmentation",
            strict: true,
            schema: RESULT_SCHEMA,
          },
        },
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(
        payload?.error?.message ||
          `OpenAI segmentation failed with HTTP ${response.status}`,
      );
    }

    const output = getOutputText(payload);
    if (!output) throw new Error("OpenAI segmentation returned an empty response.");

    const parsed = JSON.parse(output) as { results?: RawResult[] };
    const byFile = new Map<string, SegmentationMappingInput[]>();
    const allowedSubchapterIds = new Set(input.subchapters.map((item) => item.id));
    const allowedFileIds = new Set(images.map((image) => image.file.id));

    for (const raw of Array.isArray(parsed.results) ? parsed.results : []) {
      const fileId = String(raw?.fileId ?? "");
      if (!allowedFileIds.has(fileId) || byFile.has(fileId)) continue;
      byFile.set(fileId, cleanMappings(raw, allowedSubchapterIds));
    }

    for (const image of images) {
      if (!byFile.has(image.file.id)) byFile.set(image.file.id, []);
    }

    return byFile;
  } finally {
    clearTimeout(timeout);
  }
}

export async function runSourceSegmentation(input: {
  batchId: string;
  chapterId: string;
}) {
  const context = await getSegmentationBatchInput(input.batchId, input.chapterId);
  if (!context) throw new Error("Material batch not found.");
  if (context.subchapterId) {
    throw new Error("This material batch is already scoped to one subchapter.");
  }
  if (context.subchapters.length === 0) {
    throw new Error("This chapter has no official subchapters.");
  }
  if (context.files.length === 0) {
    throw new Error("Upload chapter photos before segmentation.");
  }

  const model =
    process.env.PHYSICS_ANALYSIS_MODEL?.trim() ||
    "gpt-5-mini";
  const runId = await createSegmentationRun({
    batchId: input.batchId,
    chapterId: input.chapterId,
    model,
  });

  const partialErrors: string[] = [];

  try {
    for (let start = 0; start < context.files.length; start += CHUNK_SIZE) {
      const chunk = context.files.slice(start, start + CHUNK_SIZE);
      const prepared: PreparedImage[] = [];

      for (let index = 0; index < chunk.length; index += 1) {
        const file = chunk[index];
        try {
          prepared.push(await prepareImage(file, start + index + 1));
        } catch (error) {
          const message = error instanceof Error ? error.message : "Image preparation failed.";
          partialErrors.push(`${file.originalName}: ${message}`);
          await saveSegmentationFileResult({
            runId,
            sourceFileId: file.id,
            mappings: [],
          });
        }
      }

      if (prepared.length === 0) continue;

      try {
        const results = await classifyChunk(context, prepared, model);
        for (const image of prepared) {
          await saveSegmentationFileResult({
            runId,
            sourceFileId: image.file.id,
            mappings: results.get(image.file.id) || [],
          });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "AI segmentation failed.";
        partialErrors.push(`Pages ${start + 1}-${start + chunk.length}: ${message}`);
        for (const image of prepared) {
          await saveSegmentationFileResult({
            runId,
            sourceFileId: image.file.id,
            mappings: [],
          });
        }
      }
    }

    const status = await finalizeSegmentationRun(
      runId,
      partialErrors.length ? partialErrors.join("\n").slice(0, 2000) : null,
    );
    return { runId, status };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Segmentation failed.";
    await markSegmentationRunError(runId, message);
    return { runId, status: "error" as const };
  }
}
