import { neon } from "@neondatabase/serverless";
import { get } from "@vercel/blob";
import { PDFDocument } from "pdf-lib";

const TOC_SCAN_PAGES = 28;
const MAX_VERIFY_PAGES = 72;
const AUTO_MAPPING_VERSION = "savvalas-auto-mapping-v4-anchor-first-skip-toc";

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
  target: TargetSubchapter;
  nextTarget: TargetSubchapter | null;
  previousMappedTarget: TargetSubchapter | null;
  nextMappedTarget: TargetSubchapter | null;
};

type TocHint = {
  found: boolean;
  printedPageFrom: number;
  nextPrintedPageFrom: number;
  matchedHeading: string;
  confidence: number;
  evidence: string;
};

type Verification = {
  found: boolean;
  filePageFrom: number;
  filePageTo: number;
  complete: boolean;
  confidence: number;
  evidence: string;
};

export type SavvalasMappingProposal = {
  documentId: string;
  subchapterId: string;
  numberLabel: string;
  title: string;
  filePageFrom: number;
  filePageTo: number;
  confidence: number;
  complete: boolean;
  tocFound: boolean;
  tocPrintedPageFrom: number | null;
  tocPrintedPageTo: number | null;
  tocPagesScanned: number;
  verificationPageFrom: number;
  verificationPageTo: number;
  evidence: string;
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

function emptyTocHint(): TocHint {
  return {
    found: false,
    printedPageFrom: 0,
    nextPrintedPageFrom: 0,
    matchedHeading: "",
    confidence: 0,
    evidence: "TOC pass skipped because a confirmed ORIGINAL PDF mapping is available as a stronger anchor.",
  };
}

async function getDocumentContext(
  documentId: string,
  subchapterId: string,
): Promise<DocumentContext> {
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

  const subchapters: TargetSubchapter[] = (rows as any[]).map((row) => ({
    id: String(row.subchapter_id),
    numberLabel: String(row.number_label),
    title: String(row.title),
    sortOrder: Number(row.combined_sort_order),
    existingFrom: row.file_page_from == null ? null : Number(row.file_page_from),
    existingTo: row.file_page_to == null ? null : Number(row.file_page_to),
  }));

  const targetIndex = subchapters.findIndex((item) => item.id === subchapterId);
  if (targetIndex < 0) {
    throw new Error("Το υποκεφάλαιο δεν ανήκει στο συγκεκριμένο βιβλίο.");
  }

  const previousMappedTarget =
    subchapters
      .slice(0, targetIndex)
      .reverse()
      .find((item) => item.existingTo != null) ?? null;
  const nextMappedTarget =
    subchapters
      .slice(targetIndex + 1)
      .find((item) => item.existingFrom != null) ?? null;

  return {
    documentId: String(doc.document_id),
    storageKey: String(doc.storage_key),
    originalName: String(doc.original_name || "savvalas.pdf"),
    pageCount: Number(doc.page_count),
    courseTitle: String(doc.course_title),
    subchapters,
    target: subchapters[targetIndex],
    nextTarget: subchapters[targetIndex + 1] ?? null,
    previousMappedTarget,
    nextMappedTarget,
  };
}

async function loadPdfBytes(storageKey: string) {
  const result = await get(storageKey, { access: "private" });
  if (!result || result.statusCode !== 200) {
    throw new Error("Το ιδιωτικό PDF του Σαββάλα δεν μπόρεσε να φορτωθεί.");
  }
  return new Uint8Array(await new Response(result.stream).arrayBuffer());
}

async function makeExcerpt(source: PDFDocument, from: number, to: number) {
  const excerpt = await PDFDocument.create();
  const indices = Array.from({ length: to - from + 1 }, (_, i) => from - 1 + i);
  const pages = await excerpt.copyPages(source, indices);
  for (const page of pages) excerpt.addPage(page);
  const bytes = await excerpt.save();
  return Buffer.from(bytes).toString("base64");
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
  const timeout = setTimeout(() => controller.abort(), 125_000);
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
      throw new Error(payload?.error?.message || `Savvalas mapping failed with HTTP ${response.status}`);
    }

    const output = getOutputText(payload);
    if (!output) throw new Error("Το AI δεν επέστρεψε αποτέλεσμα mapping.");
    return JSON.parse(output) as Record<string, unknown>;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Η ανάλυση AI ξεπέρασε το χρονικό όριο. Δοκίμασε ξανά· δεν αποθηκεύτηκε κανένα mapping.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

const TOC_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "found",
    "printedPageFrom",
    "nextPrintedPageFrom",
    "matchedHeading",
    "confidence",
    "evidence",
  ],
  properties: {
    found: { type: "boolean" },
    printedPageFrom: { type: "integer", minimum: 0 },
    nextPrintedPageFrom: { type: "integer", minimum: 0 },
    matchedHeading: { type: "string" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    evidence: { type: "string" },
  },
} as const;

const VERIFY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "found",
    "filePageFrom",
    "filePageTo",
    "complete",
    "confidence",
    "evidence",
  ],
  properties: {
    found: { type: "boolean" },
    filePageFrom: { type: "integer", minimum: 0 },
    filePageTo: { type: "integer", minimum: 0 },
    complete: { type: "boolean" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    evidence: { type: "string" },
  },
} as const;

function tocPrompt(context: DocumentContext, tocTo: number) {
  const officialTargets = context.subchapters
    .map((item) => `${item.numberLabel} | ${item.title}`)
    .join("\n");

  return `You are doing the TABLE-OF-CONTENTS FIRST PASS for a Greek B' Lykeiou Physics study guide by Savvalas.

MAPPING VERSION: ${AUTO_MAPPING_VERSION}
COURSE: ${context.courseTitle}
SOURCE: ${context.originalName}
THE ATTACHED EXCERPT IS ORIGINAL PDF PAGES 1-${tocTo}.

TARGET OFFICIAL SUBCHAPTER:
${context.target.numberLabel} | ${context.target.title}

ALL OFFICIAL SUBCHAPTERS IN CURRICULUM ORDER (for semantic context):
${officialTargets}

TASK:
- The user says the first pages contain the book's structure/table of contents. Actively inspect these front-matter pages and USE that structure.
- Find the Savvalas heading/section that semantically corresponds to the target official subchapter. The wording and numbering may differ.
- printedPageFrom = the PRINTED BOOK page where the matching Savvalas section begins, as stated in the contents/structure. This is NOT the PDF page index.
- nextPrintedPageFrom = the printed page where the next distinct Savvalas section begins, if visible. Otherwise use 0.
- If the target is not actually represented in the contents excerpt, set found=false and both page fields to 0.
- Do not invent page numbers. Explain briefly what heading/page evidence you used.
- This pass is only a NAVIGATION HINT. It does not create a trusted mapping.`;
}

function verificationWindow(context: DocumentContext, hint: TocHint) {
  const previousEnd = context.previousMappedTarget?.existingTo ?? null;
  const nextStart = context.nextMappedTarget?.existingFrom ?? null;

  // Trusted ORIGINAL PDF ranges are stronger anchors than printed book page numbers.
  // Keep a small overlap around the boundary so the AI can see the transition itself.
  if (previousEnd != null) {
    const from = Math.max(1, previousEnd - 2);
    const maxTo = Math.min(context.pageCount, from + MAX_VERIFY_PAGES - 1);
    const to =
      nextStart != null && nextStart > previousEnd
        ? Math.min(maxTo, nextStart + 2)
        : maxTo;
    return { from, to };
  }

  if (nextStart != null) {
    const to = Math.min(context.pageCount, nextStart + 2);
    const from = Math.max(1, to - MAX_VERIFY_PAGES + 1);
    return { from, to };
  }

  // Only when no confirmed PDF anchor exists do we use the printed TOC page as a rough
  // navigation coordinate. The verification pass must still prove actual PDF boundaries.
  if (hint.found && hint.printedPageFrom > 0) {
    const printedSpan =
      hint.nextPrintedPageFrom > hint.printedPageFrom
        ? hint.nextPrintedPageFrom - hint.printedPageFrom
        : 24;
    const from = Math.max(1, hint.printedPageFrom - 4);
    const desiredLength = Math.min(
      MAX_VERIFY_PAGES,
      Math.max(44, printedSpan + TOC_SCAN_PAGES + 12),
    );
    const to = Math.min(context.pageCount, from + desiredLength - 1);
    return { from, to };
  }

  const from = 1;
  const to = Math.min(context.pageCount, MAX_VERIFY_PAGES);
  return { from, to };
}

function verifyPrompt(
  context: DocumentContext,
  hint: TocHint,
  from: number,
  to: number,
) {
  const nextTarget = context.nextTarget
    ? `${context.nextTarget.numberLabel} | ${context.nextTarget.title}`
    : "none / end of official course list";
  const previousAnchor =
    context.previousMappedTarget?.existingFrom != null &&
    context.previousMappedTarget?.existingTo != null
      ? `${context.previousMappedTarget.numberLabel} | ${context.previousMappedTarget.title} = confirmed ORIGINAL PDF ${context.previousMappedTarget.existingFrom}-${context.previousMappedTarget.existingTo}`
      : "none";
  const nextAnchor =
    context.nextMappedTarget?.existingFrom != null &&
    context.nextMappedTarget?.existingTo != null
      ? `${context.nextMappedTarget.numberLabel} | ${context.nextMappedTarget.title} = confirmed ORIGINAL PDF ${context.nextMappedTarget.existingFrom}-${context.nextMappedTarget.existingTo}`
      : "none";

  return `You are VERIFYING a proposed page range in a Greek B' Lykeiou Savvalas Physics PDF.

MAPPING VERSION: ${AUTO_MAPPING_VERSION}
COURSE: ${context.courseTitle}
TARGET: ${context.target.numberLabel} | ${context.target.title}
NEXT OFFICIAL TARGET: ${nextTarget}
SOURCE: ${context.originalName}
THIS ATTACHED EXCERPT IS ORIGINAL PDF PAGES ${from}-${to}.
Excerpt page 1 = original PDF page ${from}.

CONFIRMED ORIGINAL-PDF ANCHORS:
- Previous mapped material: ${previousAnchor}
- Next mapped material: ${nextAnchor}
- These confirmed ranges are trusted ORIGINAL PDF coordinates. Use them as navigation anchors and inspect the overlap pages to prove the transition.

TABLE-OF-CONTENTS HINT:
- found: ${hint.found ? "yes" : "no"}
- matching Savvalas heading: ${hint.matchedHeading || "unknown"}
- printed start page: ${hint.printedPageFrom || "unknown"}
- next printed section page: ${hint.nextPrintedPageFrom || "unknown"}
- TOC confidence: ${hint.confidence.toFixed(2)}
- IMPORTANT: printed book page numbers are NOT PDF page numbers. Never use them directly as ORIGINAL PDF coordinates.

TASK:
- Ignore the table of contents as proof now. Inspect the ACTUAL theory/examples/exercises in this excerpt.
- Identify the exact ORIGINAL PDF page where substantive teaching/exercises for the target begin.
- Identify the last ORIGINAL PDF page belonging to the target before the material clearly changes to the next distinct official topic.
- If a previous confirmed mapping ends immediately before this target, normally the target begins after that boundary; verify the visible transition rather than guessing.
- Include contiguous Savvalas internal subsections, examples and exercises that materially teach the target.
- Do not include answer keys, indexes, front matter, unrelated revision lists, or a page merely mentioning the target.
- Use ORIGINAL PDF page numbers only (${from}-${to}), never printed book page numbers.
- Set complete=true only if BOTH the start boundary and end boundary are visible and justified inside this excerpt.
- If the target is absent, set found=false, complete=false and page fields to 0.
- If only part of the target is visible, report the visible bounds but set complete=false and keep confidence below 0.70.
- Evidence must briefly name the visible section/transition that supports the boundaries.

IMPORTANT: This is a PROPOSAL ONLY. It will be shown to a human before any trusted mapping is saved.`;
}

async function readTocHint(
  context: DocumentContext,
  source: PDFDocument,
): Promise<{ hint: TocHint; scannedPages: number }> {
  const tocTo = Math.min(context.pageCount, TOC_SCAN_PAGES);
  const pdfBase64 = await makeExcerpt(source, 1, tocTo);
  const raw = await callStructuredPdf({
    prompt: tocPrompt(context, tocTo),
    filename: `savvalas-toc-1-${tocTo}.pdf`,
    pdfBase64,
    schemaName: "savvalas_toc_hint",
    schema: TOC_SCHEMA,
  });

  const printedPageFrom = Math.max(0, Math.floor(Number(raw.printedPageFrom) || 0));
  const nextPrintedPageFrom = Math.max(0, Math.floor(Number(raw.nextPrintedPageFrom) || 0));
  const found = Boolean(raw.found) && printedPageFrom > 0;

  return {
    scannedPages: tocTo,
    hint: {
      found,
      printedPageFrom: found ? printedPageFrom : 0,
      nextPrintedPageFrom:
        found && nextPrintedPageFrom > printedPageFrom ? nextPrintedPageFrom : 0,
      matchedHeading: String(raw.matchedHeading || "").trim().slice(0, 240),
      confidence: clampConfidence(raw.confidence),
      evidence: String(raw.evidence || "").trim().slice(0, 600),
    },
  };
}

async function verifyTarget(
  context: DocumentContext,
  source: PDFDocument,
  hint: TocHint,
) {
  const window = verificationWindow(context, hint);
  const pdfBase64 = await makeExcerpt(source, window.from, window.to);
  const raw = await callStructuredPdf({
    prompt: verifyPrompt(context, hint, window.from, window.to),
    filename: `savvalas-verify-${window.from}-${window.to}.pdf`,
    pdfBase64,
    schemaName: "savvalas_target_verification",
    schema: VERIFY_SCHEMA,
  });

  const verification: Verification = {
    found: Boolean(raw.found),
    filePageFrom: Math.floor(Number(raw.filePageFrom) || 0),
    filePageTo: Math.floor(Number(raw.filePageTo) || 0),
    complete: Boolean(raw.complete),
    confidence: clampConfidence(raw.confidence),
    evidence: String(raw.evidence || "").trim().slice(0, 700),
  };

  const validBounds =
    verification.found &&
    verification.filePageFrom >= window.from &&
    verification.filePageTo >= verification.filePageFrom &&
    verification.filePageTo <= window.to;

  if (!validBounds) {
    throw new Error(
      hint.found
        ? "Το TOC βρέθηκε, αλλά δεν επιβεβαιώθηκε ασφαλές πραγματικό PDF range. Χρειάζεται έλεγχος."
        : "Δεν βρέθηκε ασφαλές range ούτε από τα περιεχόμενα ούτε από τον στοχευμένο έλεγχο.",
    );
  }

  return { verification, window };
}

export async function proposeSavvalasMapping(
  documentId: string,
  subchapterId: string,
): Promise<SavvalasMappingProposal> {
  const context = await getDocumentContext(documentId, subchapterId);
  const bytes = await loadPdfBytes(context.storageKey);
  const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const actualPageCount = source.getPageCount();
  if (actualPageCount !== context.pageCount) context.pageCount = actualPageCount;

  const hasConfirmedPdfAnchor =
    context.previousMappedTarget?.existingTo != null ||
    context.nextMappedTarget?.existingFrom != null;

  const { hint, scannedPages } = hasConfirmedPdfAnchor
    ? { hint: emptyTocHint(), scannedPages: 0 }
    : await readTocHint(context, source);

  const { verification, window } = await verifyTarget(context, source, hint);

  const combinedConfidence = hasConfirmedPdfAnchor
    ? verification.confidence
    : hint.found
      ? Math.min(1, verification.confidence * 0.8 + hint.confidence * 0.2)
      : verification.confidence * 0.85;

  return {
    documentId: context.documentId,
    subchapterId: context.target.id,
    numberLabel: context.target.numberLabel,
    title: context.target.title,
    filePageFrom: verification.filePageFrom,
    filePageTo: verification.filePageTo,
    confidence: combinedConfidence,
    complete: verification.complete,
    tocFound: hint.found,
    tocPrintedPageFrom: hint.found ? hint.printedPageFrom : null,
    tocPrintedPageTo:
      hint.found && hint.nextPrintedPageFrom > 0
        ? hint.nextPrintedPageFrom - 1
        : null,
    tocPagesScanned: scannedPages,
    verificationPageFrom: window.from,
    verificationPageTo: window.to,
    evidence: [hint.evidence, verification.evidence].filter(Boolean).join(" · ").slice(0, 900),
  };
}
