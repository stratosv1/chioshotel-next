import { neon } from "@neondatabase/serverless";
import { get } from "@vercel/blob";
import { PDFDocument } from "pdf-lib";

const TOC_SCAN_PAGES = 24;
const MAX_VERIFY_PAGES = 56;
const OFFICIAL_MAPPING_VERSION = "official-auto-mapping-v1-anchor-first";

type TargetSubchapter = {
  id: string;
  numberLabel: string;
  title: string;
  sortOrder: number;
  existingFrom: number | null;
  existingTo: number | null;
};

type OfficialDocumentContext = {
  documentId: string;
  storageKey: string;
  originalName: string;
  pageCount: number;
  courseTitle: string;
  chapterId: string;
  chapterTitle: string;
  subchapters: TargetSubchapter[];
  target: TargetSubchapter;
  previousTarget: TargetSubchapter | null;
  nextTarget: TargetSubchapter | null;
  previousMappedTarget: TargetSubchapter | null;
  nextMappedTarget: TargetSubchapter | null;
};

type TocHint = {
  found: boolean;
  printedPageFrom: number;
  nextPrintedPageFrom: number;
  confidence: number;
  evidence: string;
};

export type OfficialMappingProposal = {
  documentId: string;
  subchapterId: string;
  numberLabel: string;
  title: string;
  chapterId: string;
  filePageFrom: number;
  filePageTo: number;
  confidence: number;
  complete: boolean;
  verificationPageFrom: number;
  verificationPageTo: number;
  evidence: string;
};

export type OfficialMappingPageData = {
  documentId: string;
  documentName: string;
  pageCount: number;
  courseTitle: string;
  chapterId: string;
  chapterTitle: string;
  subchapterId: string;
  numberLabel: string;
  title: string;
  existingFrom: number | null;
  existingTo: number | null;
  previousMappedLabel: string | null;
  previousMappedFrom: number | null;
  previousMappedTo: number | null;
  nextMappedLabel: string | null;
  nextMappedFrom: number | null;
  nextMappedTo: number | null;
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

function clampConfidence(value: unknown) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

async function getContext(subchapterId: string): Promise<OfficialDocumentContext> {
  const sql = getSql();
  const docs = await sql`
    SELECT
      sd.id::text AS document_id,
      sd.storage_key,
      sd.original_name,
      sd.page_count,
      co.id::text AS course_id,
      co.title AS course_title,
      c.id::text AS chapter_id,
      c.title AS chapter_title
    FROM physics.subchapters sc
    JOIN physics.chapters c ON c.id = sc.chapter_id
    JOIN physics.courses co ON co.id = c.course_id
    JOIN physics.source_documents sd
      ON sd.course_id = co.id
     AND sd.source_kind = 'school_book'
     AND sd.status = 'ready'
    WHERE sc.id::text = ${subchapterId}
      AND sc.status = 'active'
      AND c.status = 'active'
      AND co.status = 'active'
    ORDER BY sd.created_at DESC
    LIMIT 1
  `;

  if (docs.length === 0) {
    throw new Error("Δεν βρέθηκε αποθηκευμένο επίσημο σχολικό PDF για αυτό το μάθημα.");
  }

  const doc = docs[0] as any;
  const pageCount = Number(doc.page_count || 0);
  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw new Error("Το επίσημο σχολικό PDF δεν έχει έγκυρο page count.");
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
      ON sr.document_id = ${String(doc.document_id)}::uuid
     AND sr.subchapter_id = sc.id
    WHERE c.course_id = ${String(doc.course_id)}::uuid
      AND c.status = 'active'
    ORDER BY c.sort_order ASC, sc.sort_order ASC
  `;

  const subchapters: TargetSubchapter[] = (rows as any[]).map((row) => ({
    id: String(row.subchapter_id),
    numberLabel: String(row.number_label),
    title: String(row.title),
    sortOrder: Number(row.combined_sort_order),
    existingFrom: row.file_page_from == null ? null : Number(row.file_page_from),
    existingTo: row.file_page_to == null ? null : Number(row.file_page_to),
  }));

  const targetIndex = subchapters.findIndex((item) => item.id === subchapterId);
  if (targetIndex < 0) throw new Error("Το υποκεφάλαιο δεν ανήκει στο επίσημο σχολικό βιβλίο.");

  return {
    documentId: String(doc.document_id),
    storageKey: String(doc.storage_key),
    originalName: String(doc.original_name || "school-book.pdf"),
    pageCount,
    courseTitle: String(doc.course_title),
    chapterId: String(doc.chapter_id),
    chapterTitle: String(doc.chapter_title),
    subchapters,
    target: subchapters[targetIndex],
    previousTarget: subchapters[targetIndex - 1] ?? null,
    nextTarget: subchapters[targetIndex + 1] ?? null,
    previousMappedTarget:
      subchapters
        .slice(0, targetIndex)
        .reverse()
        .find((item) => item.existingTo != null) ?? null,
    nextMappedTarget:
      subchapters.slice(targetIndex + 1).find((item) => item.existingFrom != null) ?? null,
  };
}

export async function getOfficialMappingPageData(
  subchapterId: string,
): Promise<OfficialMappingPageData> {
  const context = await getContext(subchapterId);
  return {
    documentId: context.documentId,
    documentName: context.originalName,
    pageCount: context.pageCount,
    courseTitle: context.courseTitle,
    chapterId: context.chapterId,
    chapterTitle: context.chapterTitle,
    subchapterId: context.target.id,
    numberLabel: context.target.numberLabel,
    title: context.target.title,
    existingFrom: context.target.existingFrom,
    existingTo: context.target.existingTo,
    previousMappedLabel: context.previousMappedTarget
      ? `${context.previousMappedTarget.numberLabel} · ${context.previousMappedTarget.title}`
      : null,
    previousMappedFrom: context.previousMappedTarget?.existingFrom ?? null,
    previousMappedTo: context.previousMappedTarget?.existingTo ?? null,
    nextMappedLabel: context.nextMappedTarget
      ? `${context.nextMappedTarget.numberLabel} · ${context.nextMappedTarget.title}`
      : null,
    nextMappedFrom: context.nextMappedTarget?.existingFrom ?? null,
    nextMappedTo: context.nextMappedTarget?.existingTo ?? null,
  };
}

async function loadPdfBytes(storageKey: string) {
  const result = await get(storageKey, { access: "private" });
  if (!result || result.statusCode !== 200) {
    throw new Error("Το ιδιωτικό σχολικό PDF δεν μπόρεσε να φορτωθεί.");
  }
  return new Uint8Array(await new Response(result.stream).arrayBuffer());
}

async function makeExcerpt(source: PDFDocument, from: number, to: number) {
  const excerpt = await PDFDocument.create();
  const indices = Array.from({ length: to - from + 1 }, (_, i) => from - 1 + i);
  const pages = await excerpt.copyPages(source, indices);
  for (const page of pages) excerpt.addPage(page);
  return Buffer.from(await excerpt.save()).toString("base64");
}

async function callStructuredPdf(input: {
  prompt: string;
  filename: string;
  pdfBase64: string;
  schemaName: string;
  schema: Record<string, unknown>;
}) {
  const apiKey = process.env.TEACHER;
  if (!apiKey) throw new Error("TEACHER is not configured for the Physics pipeline.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 145_000);
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
        reasoning: { effort: "high" },
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: input.prompt },
              {
                type: "input_file",
                filename: input.filename,
                file_data: `data:application/pdf;base64,${input.pdfBase64}`,
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: input.schemaName,
            strict: true,
            schema: input.schema,
          },
        },
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.error?.message || `Official mapping failed with HTTP ${response.status}`);
    }
    const output = getOutputText(payload);
    if (!output) throw new Error("Το AI δεν επέστρεψε αποτέλεσμα official mapping.");
    return JSON.parse(output) as Record<string, unknown>;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Η ανάλυση του σχολικού PDF ξεπέρασε το χρονικό όριο. Δεν αποθηκεύτηκε mapping — μπορείς να δοκιμάσεις ξανά.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

const TOC_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["found", "printedPageFrom", "nextPrintedPageFrom", "confidence", "evidence"],
  properties: {
    found: { type: "boolean" },
    printedPageFrom: { type: "integer", minimum: 0 },
    nextPrintedPageFrom: { type: "integer", minimum: 0 },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    evidence: { type: "string" },
  },
} as const;

const VERIFY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["found", "filePageFrom", "filePageTo", "complete", "confidence", "evidence"],
  properties: {
    found: { type: "boolean" },
    filePageFrom: { type: "integer", minimum: 0 },
    filePageTo: { type: "integer", minimum: 0 },
    complete: { type: "boolean" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    evidence: { type: "string" },
  },
} as const;

async function getTocHint(context: OfficialDocumentContext, pdf: PDFDocument): Promise<TocHint> {
  const tocTo = Math.min(context.pageCount, TOC_SCAN_PAGES);
  const pdfBase64 = await makeExcerpt(pdf, 1, tocTo);
  const result = await callStructuredPdf({
    filename: `official-toc-${context.documentId}.pdf`,
    pdfBase64,
    schemaName: "official_school_book_toc_hint",
    schema: TOC_SCHEMA,
    prompt: `You are locating an OFFICIAL Greek B' Lykeiou Physics subchapter in the student's official school-book PDF.

MAPPING VERSION: ${OFFICIAL_MAPPING_VERSION}
COURSE: ${context.courseTitle}
TARGET: ${context.target.numberLabel} | ${context.target.title}
ATTACHED: ORIGINAL PDF pages 1-${tocTo}.

Inspect front matter / contents if present. Return the PRINTED BOOK page where the target begins and the printed page where the next official subchapter begins. Printed page numbers are navigation hints only and are NOT PDF page indexes. If the contents do not prove the target, found=false and page values 0. Never invent page numbers.`,
  });

  return {
    found: Boolean(result.found),
    printedPageFrom: Math.max(0, Number(result.printedPageFrom) || 0),
    nextPrintedPageFrom: Math.max(0, Number(result.nextPrintedPageFrom) || 0),
    confidence: clampConfidence(result.confidence),
    evidence: String(result.evidence || ""),
  };
}

function verificationWindow(context: OfficialDocumentContext, hint: TocHint | null) {
  const previousEnd = context.previousMappedTarget?.existingTo ?? null;
  const nextStart = context.nextMappedTarget?.existingFrom ?? null;

  if (previousEnd != null && nextStart != null && nextStart > previousEnd) {
    return {
      from: Math.max(1, previousEnd - 2),
      to: Math.min(context.pageCount, nextStart + 2),
    };
  }

  if (previousEnd != null) {
    const from = Math.max(1, previousEnd - 2);
    return { from, to: Math.min(context.pageCount, from + MAX_VERIFY_PAGES - 1) };
  }

  if (nextStart != null) {
    const to = Math.min(context.pageCount, nextStart + 2);
    return { from: Math.max(1, to - MAX_VERIFY_PAGES + 1), to };
  }

  if (hint?.found && hint.printedPageFrom > 0) {
    const roughStart = Math.max(1, hint.printedPageFrom - 8);
    const span =
      hint.nextPrintedPageFrom > hint.printedPageFrom
        ? hint.nextPrintedPageFrom - hint.printedPageFrom
        : 16;
    const length = Math.min(MAX_VERIFY_PAGES, Math.max(28, span + 20));
    return {
      from: roughStart,
      to: Math.min(context.pageCount, roughStart + length - 1),
    };
  }

  return { from: 1, to: Math.min(context.pageCount, MAX_VERIFY_PAGES) };
}

export async function proposeOfficialMapping(
  subchapterId: string,
): Promise<OfficialMappingProposal> {
  const context = await getContext(subchapterId);
  if (context.target.existingFrom != null && context.target.existingTo != null) {
    throw new Error(`Το ${context.target.numberLabel} έχει ήδη official mapping PDF ${context.target.existingFrom}-${context.target.existingTo}.`);
  }

  const bytes = await loadPdfBytes(context.storageKey);
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });

  const hasPdfAnchor =
    context.previousMappedTarget?.existingTo != null ||
    context.nextMappedTarget?.existingFrom != null;
  const hint = hasPdfAnchor ? null : await getTocHint(context, pdf);
  const { from, to } = verificationWindow(context, hint);
  const excerptBase64 = await makeExcerpt(pdf, from, to);

  const previousAnchor = context.previousMappedTarget
    ? `${context.previousMappedTarget.numberLabel} | ${context.previousMappedTarget.title} = confirmed PDF ${context.previousMappedTarget.existingFrom}-${context.previousMappedTarget.existingTo}`
    : "none";
  const nextAnchor = context.nextMappedTarget
    ? `${context.nextMappedTarget.numberLabel} | ${context.nextMappedTarget.title} = confirmed PDF ${context.nextMappedTarget.existingFrom}-${context.nextMappedTarget.existingTo}`
    : "none";

  const result = await callStructuredPdf({
    filename: `official-verify-${context.documentId}-${from}-${to}.pdf`,
    pdfBase64: excerptBase64,
    schemaName: "official_school_book_mapping_verification",
    schema: VERIFY_SCHEMA,
    prompt: `You are verifying the exact ORIGINAL PDF page range for one OFFICIAL Greek B' Lykeiou Physics curriculum subchapter.

MAPPING VERSION: ${OFFICIAL_MAPPING_VERSION}
COURSE: ${context.courseTitle}
TARGET: ${context.target.numberLabel} | ${context.target.title}
PREVIOUS OFFICIAL TARGET: ${context.previousTarget ? `${context.previousTarget.numberLabel} | ${context.previousTarget.title}` : "none"}
NEXT OFFICIAL TARGET: ${context.nextTarget ? `${context.nextTarget.numberLabel} | ${context.nextTarget.title}` : "none"}
CONFIRMED PREVIOUS PDF ANCHOR: ${previousAnchor}
CONFIRMED NEXT PDF ANCHOR: ${nextAnchor}
ATTACHED EXCERPT: ORIGINAL PDF pages ${from}-${to}. Excerpt page 1 equals ORIGINAL PDF page ${from}.
${hint?.found ? `TOC navigation hint only: target printed page ${hint.printedPageFrom}${hint.nextPrintedPageFrom ? `, next printed page ${hint.nextPrintedPageFrom}` : ""}. Never treat printed numbering as PDF numbering.` : ""}

TASK:
- Find the first ORIGINAL PDF page where the official target's curriculum content actually starts.
- Find the last ORIGINAL PDF page that still belongs to that target, stopping immediately before the next distinct official subchapter begins.
- Use semantic headings and content boundaries, not merely printed page numbers.
- filePageFrom/filePageTo MUST be ORIGINAL PDF page numbers inside ${from}-${to}.
- complete=true ONLY when both start and end boundaries are visible/provable in this excerpt (or a confirmed neighboring anchor proves the boundary).
- If only part of the target is visible, complete=false and confidence must be below 0.70.
- Do not absorb the next official subchapter merely because it appears on the same printed page; map the PDF page only when the target has substantive content on it.
- Explain the concrete boundary evidence briefly.`,
  });

  const found = Boolean(result.found);
  const filePageFrom = Number(result.filePageFrom) || 0;
  const filePageTo = Number(result.filePageTo) || 0;
  const complete = Boolean(result.complete);
  const confidence = clampConfidence(result.confidence);

  if (
    !found ||
    !Number.isInteger(filePageFrom) ||
    !Number.isInteger(filePageTo) ||
    filePageFrom < from ||
    filePageTo > to ||
    filePageTo < filePageFrom
  ) {
    throw new Error("Το AI δεν μπόρεσε να αποδείξει ασφαλές official PDF range. Δοκίμασε ξανά ή έλεγξε πρώτα γειτονικό υποκεφάλαιο.");
  }

  return {
    documentId: context.documentId,
    subchapterId: context.target.id,
    numberLabel: context.target.numberLabel,
    title: context.target.title,
    chapterId: context.chapterId,
    filePageFrom,
    filePageTo,
    confidence,
    complete,
    verificationPageFrom: from,
    verificationPageTo: to,
    evidence: String(result.evidence || ""),
  };
}

export async function upsertOfficialSourceRange(input: {
  documentId: string;
  subchapterId: string;
  filePageFrom: number;
  filePageTo: number;
}) {
  const sql = getSql();
  const filePageFrom = Math.floor(input.filePageFrom);
  const filePageTo = Math.floor(input.filePageTo);
  if (filePageFrom < 1 || filePageTo < filePageFrom) throw new Error("Μη έγκυρο official PDF range.");

  const rows = await sql`
    SELECT
      sd.page_count,
      sc.chapter_id::text AS chapter_id,
      c.id::text AS matched_chapter_id
    FROM physics.source_documents sd
    JOIN physics.subchapters sc ON sc.id::text = ${input.subchapterId}
    JOIN physics.chapters c
      ON c.id = sc.chapter_id
     AND c.course_id = sd.course_id
    WHERE sd.id::text = ${input.documentId}
      AND sd.source_kind = 'school_book'
      AND sd.status = 'ready'
      AND sc.status = 'active'
      AND c.status = 'active'
    LIMIT 1
  `;
  if (rows.length === 0) throw new Error("Το σχολικό PDF και το υποκεφάλαιο δεν ανήκουν στο ίδιο μάθημα.");

  const pageCount = Number((rows[0] as any).page_count || 0);
  if (pageCount > 0 && filePageTo > pageCount) throw new Error(`Το σχολικό PDF έχει ${pageCount} σελίδες.`);
  const chapterId = String((rows[0] as any).chapter_id);

  const existing = await sql`
    SELECT id::text, file_page_from, file_page_to
    FROM physics.source_ranges
    WHERE document_id::text = ${input.documentId}
      AND subchapter_id::text = ${input.subchapterId}
    ORDER BY created_at ASC
    LIMIT 1
  `;

  let rangeId: string;
  let changed = true;
  if (existing.length > 0) {
    rangeId = String((existing[0] as any).id);
    changed =
      Number((existing[0] as any).file_page_from) !== filePageFrom ||
      Number((existing[0] as any).file_page_to) !== filePageTo;
    await sql`
      UPDATE physics.source_ranges
      SET chapter_id = ${chapterId}::uuid,
          file_page_from = ${filePageFrom},
          file_page_to = ${filePageTo},
          printed_page_from = NULL,
          printed_page_to = NULL
      WHERE id::text = ${rangeId}
    `;
  } else {
    const inserted = await sql`
      INSERT INTO physics.source_ranges (
        document_id, chapter_id, subchapter_id,
        file_page_from, file_page_to,
        printed_page_from, printed_page_to, created_at
      ) VALUES (
        ${input.documentId}::uuid, ${chapterId}::uuid, ${input.subchapterId}::uuid,
        ${filePageFrom}, ${filePageTo}, NULL, NULL, NOW()
      )
      RETURNING id::text
    `;
    rangeId = String((inserted[0] as any).id);
  }

  if (changed) {
    await sql`
      UPDATE physics.source_analyses
      SET status = 'superseded', updated_at = NOW()
      WHERE subchapter_id::text = ${input.subchapterId}
        AND source_role = 'official'
        AND status <> 'superseded'
    `;
    await sql`
      UPDATE physics.subchapter_intelligence_versions
      SET status = 'superseded', updated_at = NOW()
      WHERE subchapter_id::text = ${input.subchapterId}
        AND status <> 'superseded'
    `;
  }

  return { rangeId, changed, chapterId };
}
