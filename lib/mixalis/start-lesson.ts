import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import {
  getSubchapterIntelligenceView,
  type SubchapterIntelligenceContent,
} from "@/lib/mixalis/subchapter-intelligence";
import {
  buildStartPrompt,
  START_PROMPT_REFERENCE,
  START_PROMPT_VERSION,
} from "@/lib/mixalis/start-prompt";

export { START_PROMPT_REFERENCE, START_PROMPT_VERSION } from "@/lib/mixalis/start-prompt";

type LessonOrigin = "intelligence" | "start_enrichment";

export type LessonTextBlock = {
  title: string;
  body: string;
  origin: LessonOrigin;
  sourceItemIds: string[];
};

export type LessonQuantity = {
  symbol: string;
  name: string;
  meaning: string;
  unit: string;
  whyItMatters: string;
  sourceItemIds: string[];
};

export type LessonFormula = {
  expression: string;
  readAs: string;
  physicalMeaning: string;
  conditions: string;
  sourceItemIds: string[];
};

export type LessonCheck = {
  level: "easy" | "advanced" | "hidden_context" | "trap";
  question: string;
  hint1: string;
  hint2: string;
  teacherAnswer: string;
  sourceItemIds: string[];
};

export type StartLessonContent = {
  title: string;
  subtitle: string;
  openingPhenomenon: LessonTextBlock;
  intuitiveMeaning: LessonTextBlock[];
  hiddenRealWorldExample: LessonTextBlock;
  physicsReveal: LessonTextBlock;
  quantities: LessonQuantity[];
  dependencies: LessonTextBlock[];
  formalTerminology: LessonTextBlock[];
  formulas: LessonFormula[];
  guidedApplications: LessonTextBlock[];
  misconceptionRepairs: LessonTextBlock[];
  engineeringBridge: LessonTextBlock;
  comprehensionChecks: LessonCheck[];
  closingMentalModel: LessonTextBlock;
};

export type LessonRevisionView = {
  id: string;
  courseId: string;
  courseTitle: string;
  chapterId: string;
  chapterNumberLabel: string | null;
  chapterTitle: string;
  subchapterId: string;
  subchapterNumberLabel: string;
  subchapterTitle: string;
  intelligenceVersionId: string;
  intelligenceVersionNumber: number;
  revisionNumber: number;
  status: "draft" | "processing" | "current" | "superseded" | "error";
  generationMode: "initial" | "update" | "full_regeneration";
  model: string;
  promptReference: string;
  promptVersion: string;
  content: StartLessonContent | { state?: string };
  provenance: Record<string, unknown>;
  errorMessage: string | null;
  updatedAt: string;
  completedAt: string | null;
};

const TEXT_BLOCK_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "body", "origin", "sourceItemIds"],
  properties: {
    title: { type: "string" },
    body: { type: "string" },
    origin: { type: "string", enum: ["intelligence", "start_enrichment"] },
    sourceItemIds: { type: "array", items: { type: "string" } },
  },
} as const;

const QUANTITY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["symbol", "name", "meaning", "unit", "whyItMatters", "sourceItemIds"],
  properties: {
    symbol: { type: "string" },
    name: { type: "string" },
    meaning: { type: "string" },
    unit: { type: "string" },
    whyItMatters: { type: "string" },
    sourceItemIds: { type: "array", items: { type: "string" } },
  },
} as const;

const FORMULA_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["expression", "readAs", "physicalMeaning", "conditions", "sourceItemIds"],
  properties: {
    expression: { type: "string" },
    readAs: { type: "string" },
    physicalMeaning: { type: "string" },
    conditions: { type: "string" },
    sourceItemIds: { type: "array", items: { type: "string" } },
  },
} as const;

const CHECK_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["level", "question", "hint1", "hint2", "teacherAnswer", "sourceItemIds"],
  properties: {
    level: { type: "string", enum: ["easy", "advanced", "hidden_context", "trap"] },
    question: { type: "string" },
    hint1: { type: "string" },
    hint2: { type: "string" },
    teacherAnswer: { type: "string" },
    sourceItemIds: { type: "array", items: { type: "string" } },
  },
} as const;

const LESSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "subtitle",
    "openingPhenomenon",
    "intuitiveMeaning",
    "hiddenRealWorldExample",
    "physicsReveal",
    "quantities",
    "dependencies",
    "formalTerminology",
    "formulas",
    "guidedApplications",
    "misconceptionRepairs",
    "engineeringBridge",
    "comprehensionChecks",
    "closingMentalModel",
  ],
  properties: {
    title: { type: "string" },
    subtitle: { type: "string" },
    openingPhenomenon: TEXT_BLOCK_SCHEMA,
    intuitiveMeaning: { type: "array", items: TEXT_BLOCK_SCHEMA },
    hiddenRealWorldExample: TEXT_BLOCK_SCHEMA,
    physicsReveal: TEXT_BLOCK_SCHEMA,
    quantities: { type: "array", items: QUANTITY_SCHEMA },
    dependencies: { type: "array", items: TEXT_BLOCK_SCHEMA },
    formalTerminology: { type: "array", items: TEXT_BLOCK_SCHEMA },
    formulas: { type: "array", items: FORMULA_SCHEMA },
    guidedApplications: { type: "array", items: TEXT_BLOCK_SCHEMA },
    misconceptionRepairs: { type: "array", items: TEXT_BLOCK_SCHEMA },
    engineeringBridge: TEXT_BLOCK_SCHEMA,
    comprehensionChecks: { type: "array", items: CHECK_SCHEMA, minItems: 4 },
    closingMentalModel: TEXT_BLOCK_SCHEMA,
  },
} as const;

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

function configuredGenerationModel() {
  return (
    process.env.PHYSICS_GENERATION_MODEL?.trim() ||
    process.env.PHYSICS_ANALYSIS_MODEL?.trim() ||
    "gpt-5.6"
  );
}

function hash(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function getOutputText(payload: any): string {
  if (typeof payload?.output_text === "string") return payload.output_text;
  for (const item of Array.isArray(payload?.output) ? payload.output : []) {
    for (const outputContent of Array.isArray(item?.content) ? item.content : []) {
      if (typeof outputContent?.text === "string") return outputContent.text;
    }
  }
  return "";
}

function collectAllowedSourceItemIds(content: SubchapterIntelligenceContent) {
  const ids = new Set<string>();
  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (!value || typeof value !== "object") return;
    const object = value as Record<string, unknown>;
    if (Array.isArray(object.sourceItemIds)) {
      for (const id of object.sourceItemIds) ids.add(String(id));
    }
    for (const nested of Object.values(object)) visit(nested);
  };
  visit(content);
  return ids;
}

function cleanIds(raw: unknown, allowed: Set<string>) {
  const values = Array.isArray(raw) ? raw : [];
  return Array.from(new Set(values.map((value) => String(value)).filter((id) => allowed.has(id))));
}

function cleanTextBlock(raw: any, allowed: Set<string>): LessonTextBlock {
  const origin = raw?.origin === "intelligence" ? "intelligence" : "start_enrichment";
  return {
    title: String(raw?.title ?? "").trim().slice(0, 240),
    body: String(raw?.body ?? "").trim().slice(0, 7000),
    origin,
    sourceItemIds: origin === "intelligence" ? cleanIds(raw?.sourceItemIds, allowed) : [],
  };
}

function cleanLesson(raw: any, allowed: Set<string>): StartLessonContent {
  const blocks = (value: unknown) =>
    (Array.isArray(value) ? value : []).map((item) => cleanTextBlock(item, allowed)).filter((item) => item.body);

  const quantities: LessonQuantity[] = (Array.isArray(raw?.quantities) ? raw.quantities : [])
    .map((item: any) => ({
      symbol: String(item?.symbol ?? "").trim().slice(0, 80),
      name: String(item?.name ?? "").trim().slice(0, 180),
      meaning: String(item?.meaning ?? "").trim().slice(0, 3000),
      unit: String(item?.unit ?? "").trim().slice(0, 120),
      whyItMatters: String(item?.whyItMatters ?? "").trim().slice(0, 3000),
      sourceItemIds: cleanIds(item?.sourceItemIds, allowed),
    }))
    .filter((item: LessonQuantity) => item.name && item.meaning);

  const formulas: LessonFormula[] = (Array.isArray(raw?.formulas) ? raw.formulas : [])
    .map((item: any) => ({
      expression: String(item?.expression ?? "").trim().slice(0, 500),
      readAs: String(item?.readAs ?? "").trim().slice(0, 1500),
      physicalMeaning: String(item?.physicalMeaning ?? "").trim().slice(0, 3000),
      conditions: String(item?.conditions ?? "").trim().slice(0, 3000),
      sourceItemIds: cleanIds(item?.sourceItemIds, allowed),
    }))
    .filter((item: LessonFormula) => item.expression && item.physicalMeaning);

  const allowedLevels = new Set(["easy", "advanced", "hidden_context", "trap"]);
  const comprehensionChecks: LessonCheck[] = (Array.isArray(raw?.comprehensionChecks) ? raw.comprehensionChecks : [])
    .map((item: any) => ({
      level: allowedLevels.has(String(item?.level)) ? String(item.level) as LessonCheck["level"] : "easy",
      question: String(item?.question ?? "").trim().slice(0, 2500),
      hint1: String(item?.hint1 ?? "").trim().slice(0, 1800),
      hint2: String(item?.hint2 ?? "").trim().slice(0, 1800),
      teacherAnswer: String(item?.teacherAnswer ?? "").trim().slice(0, 3500),
      sourceItemIds: cleanIds(item?.sourceItemIds, allowed),
    }))
    .filter((item: LessonCheck) => item.question && item.teacherAnswer);

  return {
    title: String(raw?.title ?? "").trim().slice(0, 240),
    subtitle: String(raw?.subtitle ?? "").trim().slice(0, 500),
    openingPhenomenon: cleanTextBlock(raw?.openingPhenomenon, allowed),
    intuitiveMeaning: blocks(raw?.intuitiveMeaning),
    hiddenRealWorldExample: cleanTextBlock(raw?.hiddenRealWorldExample, allowed),
    physicsReveal: cleanTextBlock(raw?.physicsReveal, allowed),
    quantities,
    dependencies: blocks(raw?.dependencies),
    formalTerminology: blocks(raw?.formalTerminology),
    formulas,
    guidedApplications: blocks(raw?.guidedApplications),
    misconceptionRepairs: blocks(raw?.misconceptionRepairs),
    engineeringBridge: cleanTextBlock(raw?.engineeringBridge, allowed),
    comprehensionChecks,
    closingMentalModel: cleanTextBlock(raw?.closingMentalModel, allowed),
  };
}

async function callOpenAI(model: string, prompt: string) {
  const apiKey = process.env.TEACHER;
  if (!apiKey) throw new Error("TEACHER is not configured for the Physics pipeline.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 900_000);
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
        reasoning: {
          effort: "high",
        },
        input: [{ role: "user", content: [{ type: "input_text", text: prompt }] }],
        text: {
          format: {
            type: "json_schema",
            name: "physics_start_lesson_revision",
            strict: true,
            schema: LESSON_SCHEMA,
          },
        },
      }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.error?.message || `START generation failed with HTTP ${response.status}`);
    }
    const output = getOutputText(payload);
    if (!output) throw new Error("START generation returned an empty response.");
    return JSON.parse(output);
  } finally {
    clearTimeout(timeout);
  }
}

export async function createLessonRevisionFromIntelligence(intelligenceVersionId: string) {
  const intelligenceView = await getSubchapterIntelligenceView(intelligenceVersionId);
  if (!intelligenceView) throw new Error("Subchapter Intelligence version not found.");
  if (intelligenceView.status !== "current") {
    throw new Error("Only the current Subchapter Intelligence can generate a lesson revision.");
  }

  const sql = getSql();
  const existing = await sql`
    SELECT id::text, revision_number, status
    FROM physics.lesson_revisions
    WHERE intelligence_version_id::text = ${intelligenceVersionId}
      AND prompt_reference = ${START_PROMPT_REFERENCE}
      AND prompt_version = ${START_PROMPT_VERSION}
    ORDER BY revision_number DESC
    LIMIT 1
  `;
  if (existing.length > 0) {
    return {
      id: String(existing[0].id),
      revisionNumber: Number(existing[0].revision_number),
      status: String(existing[0].status),
      created: false,
    };
  }

  const prior = await sql`
    SELECT COALESCE(MAX(revision_number), 0)::int AS max_revision,
           COUNT(*) FILTER (WHERE status = 'current')::int AS current_count
    FROM physics.lesson_revisions
    WHERE subchapter_id::text = ${intelligenceView.subchapterId}
  `;
  const revisionNumber = Number(prior[0]?.max_revision ?? 0) + 1;
  const generationMode = Number(prior[0]?.current_count ?? 0) > 0 ? "update" : "initial";
  const model = configuredGenerationModel();
  const inputSnapshotHash = hash(
    `${intelligenceView.sourceSnapshotHash}|${START_PROMPT_REFERENCE}|${START_PROMPT_VERSION}`,
  );
  const placeholder = JSON.stringify({ state: "pending" });
  const provenance = JSON.stringify({
    intelligenceVersionId: intelligenceView.id,
    intelligenceVersionNumber: intelligenceView.versionNumber,
    intelligenceSourceSnapshotHash: intelligenceView.sourceSnapshotHash,
    sourceAnalysisIds: intelligenceView.sources.map((source) => source.analysisId),
    promptReference: START_PROMPT_REFERENCE,
    promptVersion: START_PROMPT_VERSION,
    startEnrichmentAllowed: true,
  });

  const rows = await sql`
    INSERT INTO physics.lesson_revisions (
      course_id, chapter_id, subchapter_id, intelligence_version_id,
      revision_number, status, generation_mode, model,
      prompt_reference, prompt_version, input_snapshot_hash,
      content, provenance, error_message
    ) VALUES (
      ${intelligenceView.courseId}::uuid,
      ${intelligenceView.chapterId}::uuid,
      ${intelligenceView.subchapterId}::uuid,
      ${intelligenceVersionId}::uuid,
      ${revisionNumber}, 'draft', ${generationMode}, ${model},
      ${START_PROMPT_REFERENCE}, ${START_PROMPT_VERSION}, ${inputSnapshotHash},
      ${placeholder}::jsonb, ${provenance}::jsonb, NULL
    )
    RETURNING id::text
  `;

  return { id: String(rows[0].id), revisionNumber, status: "draft", created: true };
}

export async function getLessonRevisionView(revisionId: string): Promise<LessonRevisionView | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      lr.id::text,
      lr.intelligence_version_id::text,
      lr.revision_number,
      lr.status,
      lr.generation_mode,
      lr.model,
      lr.prompt_reference,
      lr.prompt_version,
      lr.content,
      lr.provenance,
      lr.error_message,
      lr.updated_at,
      lr.completed_at,
      sc.id::text AS subchapter_id,
      sc.number_label AS subchapter_number_label,
      sc.title AS subchapter_title,
      c.id::text AS chapter_id,
      c.number_label AS chapter_number_label,
      c.title AS chapter_title,
      co.id::text AS course_id,
      co.title AS course_title,
      siv.version_number AS intelligence_version_number
    FROM physics.lesson_revisions lr
    JOIN physics.subchapters sc ON sc.id = lr.subchapter_id
    JOIN physics.chapters c ON c.id = lr.chapter_id
    JOIN physics.courses co ON co.id = lr.course_id
    JOIN physics.subchapter_intelligence_versions siv ON siv.id = lr.intelligence_version_id
    WHERE lr.id::text = ${revisionId}
    LIMIT 1
  `;
  if (rows.length === 0) return null;
  const row = rows[0] as any;
  return {
    id: String(row.id),
    courseId: String(row.course_id),
    courseTitle: String(row.course_title),
    chapterId: String(row.chapter_id),
    chapterNumberLabel: row.chapter_number_label ? String(row.chapter_number_label) : null,
    chapterTitle: String(row.chapter_title),
    subchapterId: String(row.subchapter_id),
    subchapterNumberLabel: String(row.subchapter_number_label),
    subchapterTitle: String(row.subchapter_title),
    intelligenceVersionId: String(row.intelligence_version_id),
    intelligenceVersionNumber: Number(row.intelligence_version_number),
    revisionNumber: Number(row.revision_number),
    status: String(row.status) as LessonRevisionView["status"],
    generationMode: String(row.generation_mode) as LessonRevisionView["generationMode"],
    model: String(row.model),
    promptReference: String(row.prompt_reference),
    promptVersion: String(row.prompt_version),
    content: row.content as LessonRevisionView["content"],
    provenance: (row.provenance || {}) as Record<string, unknown>,
    errorMessage: row.error_message ? String(row.error_message) : null,
    updatedAt: new Date(row.updated_at).toISOString(),
    completedAt: row.completed_at ? new Date(row.completed_at).toISOString() : null,
  };
}

export async function runLessonRevision(revisionId: string) {
  const currentView = await getLessonRevisionView(revisionId);
  if (!currentView) throw new Error("Lesson revision not found.");
  if (currentView.status === "current" || currentView.status === "superseded") return currentView;

  if (currentView.status === "processing") {
    const ageMs = Date.now() - new Date(currentView.updatedAt).getTime();
    if (ageMs < 8 * 60_000) return currentView;
  }

  const intelligenceView = await getSubchapterIntelligenceView(currentView.intelligenceVersionId);
  if (!intelligenceView) throw new Error("Linked Subchapter Intelligence not found.");
  if (intelligenceView.status !== "current" && intelligenceView.status !== "superseded") {
    throw new Error("Linked Subchapter Intelligence is not finalized.");
  }
  const intelligence = intelligenceView.content as SubchapterIntelligenceContent;
  const allowedIds = collectAllowedSourceItemIds(intelligence);
  const sql = getSql();

  await sql`
    UPDATE physics.lesson_revisions
    SET status = 'processing', content = ${JSON.stringify({ state: "processing" })}::jsonb,
        error_message = NULL, updated_at = now()
    WHERE id::text = ${revisionId}
  `;

  try {
    const raw = await callOpenAI(
      currentView.model,
      buildStartPrompt({
        courseTitle: currentView.courseTitle,
        chapterLabel: currentView.chapterNumberLabel || "",
        chapterTitle: currentView.chapterTitle,
        subchapterLabel: currentView.subchapterNumberLabel,
        subchapterTitle: currentView.subchapterTitle,
        intelligence,
      }),
    );
    const lesson = cleanLesson(raw, allowedIds);
    if (!lesson.title || !lesson.openingPhenomenon.body || lesson.comprehensionChecks.length < 4) {
      throw new Error("START returned an incomplete lesson structure.");
    }

    await sql`
      UPDATE physics.lesson_revisions
      SET status = 'superseded', updated_at = now()
      WHERE subchapter_id::text = ${currentView.subchapterId}
        AND status = 'current'
        AND id::text <> ${revisionId}
    `;
    await sql`
      UPDATE physics.lesson_revisions
      SET status = 'current', content = ${JSON.stringify(lesson)}::jsonb,
          error_message = NULL, updated_at = now(), completed_at = now()
      WHERE id::text = ${revisionId}
    `;
  } catch (error) {
    const message = error instanceof Error ? error.message : "START lesson generation failed.";
    await sql`
      UPDATE physics.lesson_revisions
      SET status = 'error', error_message = ${message}, updated_at = now()
      WHERE id::text = ${revisionId}
    `;
    throw error;
  }

  const finalView = await getLessonRevisionView(revisionId);
  if (!finalView) throw new Error("Lesson revision disappeared after generation.");
  return finalView;
}
