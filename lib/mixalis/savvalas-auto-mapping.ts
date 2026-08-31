import { neon } from "@neondatabase/serverless";
import { get } from "@vercel/blob";
import { PDFDocument } from "pdf-lib";
import { upsertSavvalasSourceRange } from "@/lib/mixalis/savvalas-book-audit";

const CHUNK_SIZE = 32;
const CHUNK_OVERLAP = 2;
const AUTO_MAPPING_VERSION = "savvalas-auto-mapping-v1";

type TargetSubchapter = {
  id: string;
  numberLabel: string;
  title: string;
  sortOrder: number;
  existingFrom: number | null;
  existingTo: number | null;
};

type DocumentContext = {
  documentId: string;
  storageKey: string;
  originalName: string;
  pageCount: number;
  courseTitle: string;
  subchapters: TargetSubchapter[];
};

type Candidate = {
  subchapterId: string;
  filePageFrom: number;
  filePageTo: number;
  confidence: number;
  reason: string;
};

type MappingResult = {
  subchapterId: string;
  numberLabel: string;
  title: string;
  filePageFrom: number;
  filePageTo: number;
  confidence: number;
  changed: boolean;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

function configuredModel() {
  return process.env.PHYSICS_ANALYSIS_MODEL?.trim() || "gpt-5.6";
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

async function getDocumentContext(documentId: string): Promise<DocumentContext> {
  const sql = getSql();
  const docs = await sql`
    SELECT
      sd.id::text AS document_id,
      sd.storage_key,
      sd.original_name,
      sd.page_count,
      co.id::text AS course_id,
      co.title AS course_title
    FROM physics.source_documents sd
    JOIN physics.courses co ON co.id = sd.course_id
    WHERE sd.id::text = ${documentId}
      AND sd.source_kind = 'savvalas_book'
      AND sd.status = 'ready'
      AND co.status = 'active'
    LIMIT 1
  `;

  if (docs.length === 0) throw new Error("Το βιβλίο Σαββάλα δεν βρέθηκε.");
  const doc = docs[0] as any;
  if (!doc.page_count || Number(doc.page_count) < 1) {
    throw new Error("Το PDF δεν έχει έγκυρο page count.");
  }

  const rows = await sql`
    SELECT
      sc.id::text AS subchapter_id,
      sc.number_label,
      sc.title,
      (c.sort_order * 1000 + sc.sort_order) AS combined_sort_order,
      sr.file_page_from,
      sr.file_page_to
    FROM physics.chapters c
    JOIN physics.subchapters sc
      ON sc.chapter_id = c.id
     AND sc.status = 'active'
    LEFT JOIN physics.source_ranges sr
      ON sr.document_id = ${documentId}::uuid
     AND sr.subchapter_id = sc.id
    WHERE c.course_id = ${String(doc.course_id)}::uuid
      AND c.status = 'active'
    ORDER BY c.sort_order ASC, sc.sort_order ASC
  `;

  return {
    documentId: String(doc.document_id),
    storageKey: String(doc.storage_key),
    originalName: String(doc.original_name || "savvalas.pdf"),
    pageCount: Number(doc.page_count),
    courseTitle: String(doc.course_title),
    subchapters: (rows as any[]).map((row) => ({
      id: String(row.subchapter_id),
      numberLabel: String(row.number_label),
      title: String(row.title),
      sortOrder: Number(row.combined_sort_order),
      existingFrom: row.file_page_from == null ? null : Number(row.file_page_from),
      existingTo: row.file_page_to == null ? null : Number(row.file_page_to),
    })),
  };
}

async function loadPdfBytes(storageKey: string) {
  const result = await get(storageKey, { access: "private" });
  if (!result || result.statusCode !== 200) {
    throw new Error("Το ιδιωτικό PDF του Σαββάλα δεν μπόρεσε να φορτωθεί.");
  }
  return new Uint8Array(await new Response(result.stream).arrayBuffer());
}

async function makeChunk(source: PDFDocument, from: number, to: number) {
  const excerpt = await PDFDocument.create();
  const indices = Array.from({ length: to - from + 1 }, (_, i) => from - 1 + i);
  const pages = await excerpt.copyPages(source, indices);
  for (const page of pages) excerpt.addPage(page);
  const bytes = await excerpt.save();
  return Buffer.from(bytes).toString("base64");
}

function resultSchema(subchapterIds: string[]) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["matches"],
    properties: {
      matches: {
        type: "array",
        maxItems: Math.max(8, subchapterIds.length),
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "subchapterId",
            "filePageFrom",
            "filePageTo",
            "confidence",
            "reason",
          ],
          properties: {
            subchapterId: { type: "string", enum: subchapterIds },
            filePageFrom: { type: "integer" },
            filePageTo: { type: "integer" },
            confidence: { type: "number", minimum: 0, maximum: 1 },
            reason: { type: "string" },
          },
        },
      },
    },
  } as const;
}

function chunkPrompt(context: DocumentContext, from: number, to: number) {
  const targets = context.subchapters
    .map((s) => `${s.id} | ${s.numberLabel} | ${s.title}`)
    .join("\n");

  return `You are mapping a Greek B' Lykeiou Physics study guide (Savvalas) to the OFFICIAL course subchapters used by a private learning system.

MAPPING VERSION: ${AUTO_MAPPING_VERSION}
COURSE: ${context.courseTitle}
SOURCE: ${context.originalName}
THIS EXCERPT IS ORIGINAL PDF PAGES ${from}-${to}.
Excerpt page 1 = original PDF page ${from}.

OFFICIAL TARGET SUBCHAPTERS, in curriculum order:
${targets}

TASK:
- Inspect the PDF pages visually and semantically.
- Report only target subchapters that are substantially taught, explained, or exercised in this excerpt.
- For each match, give the FIRST and LAST ORIGINAL PDF page in this excerpt that belong to that target.
- Do not match a subchapter merely because it is mentioned in a table of contents, cross-reference, summary list, index, or answer key.
- Prefer the actual theory/examples/exercises body of the section.
- A target may continue beyond this excerpt; then use this excerpt's boundary page and the next chunk will continue it.
- Use ORIGINAL PDF page numbers only (${from}-${to}), never printed page numbers.
- Keep confidence below 0.75 when the section identity is inferred rather than explicit.
- If the excerpt contains front matter, contents, unrelated material, solutions, or material outside these official targets, omit it.
- Never invent a target. Return an empty matches array when appropriate.`;
}

async function analyzeChunk(
  context: DocumentContext,
  from: number,
  to: number,
  chunkBase64: string,
): Promise<Candidate[]> {
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
              { type: "input_text", text: chunkPrompt(context, from, to) },
              {
                type: "input_file",
                filename: `savvalas-map-${from}-${to}.pdf`,
                file_data: `data:application/pdf;base64,${chunkBase64}`,
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "savvalas_auto_mapping_chunk",
            strict: true,
            schema: resultSchema(context.subchapters.map((s) => s.id)),
          },
        },
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.error?.message || `Auto mapping failed with HTTP ${response.status}`);
    }
    const output = getOutputText(payload);
    if (!output) return [];
    const parsed = JSON.parse(output) as { matches?: Candidate[] };

    return (Array.isArray(parsed.matches) ? parsed.matches : [])
      .map((item) => ({
        subchapterId: String(item.subchapterId),
        filePageFrom: Number(item.filePageFrom),
        filePageTo: Number(item.filePageTo),
        confidence: Math.max(0, Math.min(1, Number(item.confidence) || 0)),
        reason: String(item.reason || "").slice(0, 500),
      }))
      .filter(
        (item) =>
          context.subchapters.some((s) => s.id === item.subchapterId) &&
          Number.isInteger(item.filePageFrom) &&
          Number.isInteger(item.filePageTo) &&
          item.filePageFrom >= from &&
          item.filePageTo <= to &&
          item.filePageTo >= item.filePageFrom,
      );
  } finally {
    clearTimeout(timeout);
  }
}

function mergeCandidates(context: DocumentContext, candidates: Candidate[]) {
  const byTarget = new Map<string, Candidate[]>();
  for (const candidate of candidates) {
    const items = byTarget.get(candidate.subchapterId) || [];
    items.push(candidate);
    byTarget.set(candidate.subchapterId, items);
  }

  const merged = new Map<string, { from: number; to: number; confidence: number }>();

  for (const subchapter of context.subchapters) {
    const raw = (byTarget.get(subchapter.id) || [])
      .filter((item) => item.confidence >= 0.6)
      .sort((a, b) => a.filePageFrom - b.filePageFrom);
    if (raw.length === 0) continue;

    const groups: Candidate[][] = [];
    for (const item of raw) {
      const current = groups[groups.length - 1];
      if (!current) {
        groups.push([item]);
        continue;
      }
      const currentTo = Math.max(...current.map((entry) => entry.filePageTo));
      if (item.filePageFrom <= currentTo + CHUNK_OVERLAP + 2) current.push(item);
      else groups.push([item]);
    }

    groups.sort((a, b) => {
      const scoreA = a.reduce((sum, item) => sum + item.confidence * (item.filePageTo - item.filePageFrom + 1), 0);
      const scoreB = b.reduce((sum, item) => sum + item.confidence * (item.filePageTo - item.filePageFrom + 1), 0);
      return scoreB - scoreA;
    });

    const best = groups[0];
    const from = Math.min(...best.map((item) => item.filePageFrom));
    const to = Math.max(...best.map((item) => item.filePageTo));
    const confidence = best.reduce((sum, item) => sum + item.confidence, 0) / best.length;
    merged.set(subchapter.id, { from, to, confidence });
  }

  return merged;
}

export async function runSavvalasAutoMapping(documentId: string): Promise<{
  scannedPages: number;
  mapped: MappingResult[];
  skippedExisting: number;
  unresolved: Array<{ subchapterId: string; numberLabel: string; title: string }>;
}> {
  const context = await getDocumentContext(documentId);
  const bytes = await loadPdfBytes(context.storageKey);
  const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const actualPageCount = source.getPageCount();
  if (actualPageCount !== context.pageCount) context.pageCount = actualPageCount;

  const candidates: Candidate[] = [];
  for (let from = 1; from <= context.pageCount; from += CHUNK_SIZE - CHUNK_OVERLAP) {
    const to = Math.min(context.pageCount, from + CHUNK_SIZE - 1);
    const chunk = await makeChunk(source, from, to);
    const found = await analyzeChunk(context, from, to, chunk);
    candidates.push(...found);
    if (to === context.pageCount) break;
  }

  const merged = mergeCandidates(context, candidates);
  const mapped: MappingResult[] = [];
  let skippedExisting = 0;

  for (const subchapter of context.subchapters) {
    if (subchapter.existingFrom != null && subchapter.existingTo != null) {
      skippedExisting += 1;
      continue;
    }
    const match = merged.get(subchapter.id);
    if (!match || match.confidence < 0.7) continue;

    const result = await upsertSavvalasSourceRange({
      documentId: context.documentId,
      subchapterId: subchapter.id,
      filePageFrom: match.from,
      filePageTo: match.to,
    });

    mapped.push({
      subchapterId: subchapter.id,
      numberLabel: subchapter.numberLabel,
      title: subchapter.title,
      filePageFrom: match.from,
      filePageTo: match.to,
      confidence: match.confidence,
      changed: result.changed,
    });
  }

  const mappedIds = new Set(mapped.map((item) => item.subchapterId));
  const unresolved = context.subchapters
    .filter(
      (s) =>
        s.existingFrom == null &&
        s.existingTo == null &&
        !mappedIds.has(s.id),
    )
    .map((s) => ({ subchapterId: s.id, numberLabel: s.numberLabel, title: s.title }));

  return {
    scannedPages: context.pageCount,
    mapped,
    skippedExisting,
    unresolved,
  };
}
