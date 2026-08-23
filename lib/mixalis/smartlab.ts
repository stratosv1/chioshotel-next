import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import {
  buildSmartLabPrompt,
  SMARTLAB_PROMPT_REFERENCE,
  SMARTLAB_PROMPT_VERSION,
} from "@/lib/mixalis/smartlab-prompt";
import type { SubchapterIntelligenceContent } from "@/lib/mixalis/subchapter-intelligence";
import type {
  SmartLabContent,
  SmartLabControl,
  SmartLabControlRole,
  SmartLabImportance,
  SmartLabPhysicsPreset,
  SmartLabRevisionView,
  SmartLabScopeRelation,
  SmartLabWidget,
} from "@/lib/mixalis/smartlab-types";

export { SMARTLAB_PROMPT_REFERENCE, SMARTLAB_PROMPT_VERSION } from "@/lib/mixalis/smartlab-prompt";
export type { SmartLabContent, SmartLabRevisionView, SmartLabWidget } from "@/lib/mixalis/smartlab-types";

type SmartRow = {
  subchapterId: string;
  subchapterLabel: string;
  subchapterTitle: string;
  intelligenceVersionId: string;
  versionNumber: number;
  sourceSnapshotHash: string;
  intelligence: SubchapterIntelligenceContent;
};

type EntryCatalogItem = {
  smartEntryId: string;
  subchapterId: string;
  importance: string;
  scopeRelation: string;
  title: string;
  content: string;
  sourceItemIds: string[];
};

const IMPORTANCE = ["core", "supporting", "advanced"] as const;
const SCOPE = [
  "official_core",
  "within_official_scope",
  "exercise_extension",
  "boundary_only",
  "unclassified_depth",
] as const;
const PRESETS = [
  "horizontal_projectile",
  "uniform_circular_motion",
  "centripetal_force",
  "generic_relation",
] as const;
const CONTROL_ROLES = [
  "initial_speed",
  "height",
  "gravity",
  "radius",
  "angular_speed",
  "linear_speed",
  "mass",
  "frequency",
  "generic",
] as const;

const CONTROL_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["id", "role", "type", "label", "symbol", "min", "max", "defaultValue", "step", "unit"],
  properties: {
    id: { type: "string" },
    role: { type: "string", enum: CONTROL_ROLES },
    type: { type: "string", enum: ["slider", "toggle"] },
    label: { type: "string" },
    symbol: { type: "string" },
    min: { type: "number" },
    max: { type: "number" },
    defaultValue: { type: "number" },
    step: { type: "number" },
    unit: { type: "string" },
  },
} as const;

const WIDGET_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "id", "subchapterId", "title", "concept", "importance", "scopeRelation",
    "smartEntryIds", "sourceItemIds", "physicsPreset", "scene", "question", "prediction",
    "controls", "liveFeedback", "discovery", "equation", "challenge", "transferCheck",
    "targetInsight", "implementationNotes",
  ],
  properties: {
    id: { type: "string" },
    subchapterId: { type: "string" },
    title: { type: "string" },
    concept: { type: "string" },
    importance: { type: "string", enum: IMPORTANCE },
    scopeRelation: { type: "string", enum: SCOPE },
    smartEntryIds: { type: "array", items: { type: "string" }, minItems: 1 },
    sourceItemIds: { type: "array", items: { type: "string" } },
    physicsPreset: { type: "string", enum: PRESETS },
    scene: {
      type: "object",
      additionalProperties: false,
      required: ["dimension", "description"],
      properties: {
        dimension: { type: "string", enum: ["2d", "3d"] },
        description: { type: "string" },
      },
    },
    question: { type: "string" },
    prediction: { type: "string" },
    controls: { type: "array", items: CONTROL_SCHEMA, minItems: 1, maxItems: 4 },
    liveFeedback: { type: "string" },
    discovery: { type: "string" },
    equation: { type: "string" },
    challenge: {
      type: "object",
      additionalProperties: false,
      required: ["instruction", "successHint"],
      properties: {
        instruction: { type: "string" },
        successHint: { type: "string" },
      },
    },
    transferCheck: { type: "string" },
    targetInsight: { type: "string" },
    implementationNotes: { type: "array", items: { type: "string" } },
  },
} as const;

const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "summary", "subchapters", "chapterSynthesisWidgets", "nonInteractiveCore", "coverage"],
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    subchapters: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["subchapterId", "subchapterLabel", "subchapterTitle", "intelligenceVersionId", "widgets"],
        properties: {
          subchapterId: { type: "string" },
          subchapterLabel: { type: "string" },
          subchapterTitle: { type: "string" },
          intelligenceVersionId: { type: "string" },
          widgets: { type: "array", items: WIDGET_SCHEMA },
        },
      },
    },
    chapterSynthesisWidgets: { type: "array", items: WIDGET_SCHEMA, maxItems: 1 },
    nonInteractiveCore: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["smartEntryId", "reason"],
        properties: {
          smartEntryId: { type: "string" },
          reason: { type: "string" },
        },
      },
    },
    coverage: {
      type: "object",
      additionalProperties: false,
      required: ["totalCoreEntries", "interactiveCoreEntries", "nonInteractiveCoreEntries"],
      properties: {
        totalCoreEntries: { type: "integer", minimum: 0 },
        interactiveCoreEntries: { type: "integer", minimum: 0 },
        nonInteractiveCoreEntries: { type: "integer", minimum: 0 },
      },
    },
  },
} as const;

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing.");
  return neon(url);
}

function model() {
  return process.env.PHYSICS_GENERATION_MODEL?.trim() || process.env.PHYSICS_ANALYSIS_MODEL?.trim() || "gpt-5.6";
}

function hash(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function entriesForSmart(subchapterId: string, intelligence: SubchapterIntelligenceContent): EntryCatalogItem[] {
  const output: EntryCatalogItem[] = [];
  const visit = (value: unknown, path: string) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${path}.${index}`));
      return;
    }
    if (!value || typeof value !== "object") return;
    const object = value as Record<string, unknown>;
    if (
      typeof object.title === "string" &&
      typeof object.content === "string" &&
      typeof object.importance === "string" &&
      typeof object.scopeRelation === "string" &&
      Array.isArray(object.sourceItemIds)
    ) {
      output.push({
        smartEntryId: `${subchapterId}:${path}`,
        subchapterId,
        importance: String(object.importance),
        scopeRelation: String(object.scopeRelation),
        title: String(object.title),
        content: String(object.content),
        sourceItemIds: object.sourceItemIds.map(String),
      });
      return;
    }
    for (const [key, nested] of Object.entries(object)) visit(nested, path ? `${path}.${key}` : key);
  };
  visit(intelligence, "smart");
  return output;
}

async function loadChapterSmart(chapterId: string) {
  const sql = getSql();
  const chapterRows = await sql`
    SELECT c.id::text AS chapter_id, c.number_label, c.title AS chapter_title,
           co.id::text AS course_id, co.title AS course_title
    FROM physics.chapters c
    JOIN physics.courses co ON co.id = c.course_id
    WHERE c.id::text = ${chapterId} AND c.status = 'active'
    LIMIT 1
  `;
  if (!chapterRows.length) return null;

  const rows = await sql`
    SELECT sc.id::text AS subchapter_id, sc.number_label, sc.title,
           siv.id::text AS intelligence_version_id, siv.version_number,
           siv.source_snapshot_hash, siv.content
    FROM physics.subchapters sc
    JOIN physics.subchapter_intelligence_versions siv
      ON siv.subchapter_id = sc.id AND siv.status = 'current'
    WHERE sc.chapter_id::text = ${chapterId}
      AND sc.status = 'active'
    ORDER BY sc.sort_order, sc.number_label
  `;
  const smart: SmartRow[] = (rows as any[]).map((row) => ({
    subchapterId: String(row.subchapter_id),
    subchapterLabel: String(row.number_label),
    subchapterTitle: String(row.title),
    intelligenceVersionId: String(row.intelligence_version_id),
    versionNumber: Number(row.version_number),
    sourceSnapshotHash: String(row.source_snapshot_hash),
    intelligence: row.content as SubchapterIntelligenceContent,
  }));
  const chapter = chapterRows[0] as any;
  return {
    courseId: String(chapter.course_id),
    courseTitle: String(chapter.course_title),
    chapterId: String(chapter.chapter_id),
    chapterLabel: chapter.number_label ? String(chapter.number_label) : "",
    chapterTitle: String(chapter.chapter_title),
    smart,
  };
}

function inputHash(smart: SmartRow[]) {
  return hash(JSON.stringify({
    prompt: SMARTLAB_PROMPT_VERSION,
    versions: smart.map((item) => ({
      subchapterId: item.subchapterId,
      intelligenceVersionId: item.intelligenceVersionId,
      versionNumber: item.versionNumber,
      sourceSnapshotHash: item.sourceSnapshotHash,
    })),
  }));
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

async function callOpenAI(generationModel: string, prompt: string) {
  const apiKey = process.env.TEACHER;
  if (!apiKey) throw new Error("TEACHER is not configured for SMARTLAB.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 890_000);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: generationModel,
        stream: true,
        reasoning: { effort: "high" },
        input: [{ role: "user", content: [{ type: "input_text", text: prompt }] }],
        text: {
          format: {
            type: "json_schema",
            name: "physics_smartlab_chapter",
            strict: true,
            schema: RESULT_SCHEMA,
          },
        },
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error?.message || `SMARTLAB generation failed with HTTP ${response.status}`);
    }
    if (!response.body) throw new Error("SMARTLAB returned no stream.");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let streamed = "";
    let completed = "";
    let streamError = "";
    const consume = (block: string) => {
      const data = block.split("\n").filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart()).join("\n").trim();
      if (!data || data === "[DONE]") return;
      let event: any;
      try { event = JSON.parse(data); } catch { return; }
      if (event?.type === "response.output_text.delta" && typeof event.delta === "string") streamed += event.delta;
      else if (event?.type === "response.output_text.done" && typeof event.text === "string") completed = event.text;
      else if (event?.type === "response.completed") completed = getOutputText(event.response) || completed;
      else if (event?.type === "response.failed") streamError = event?.response?.error?.message || "SMARTLAB stream failed.";
      else if (event?.type === "error") streamError = event?.error?.message || event?.message || "SMARTLAB stream error.";
    };
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() || "";
      blocks.forEach(consume);
      if (streamError) throw new Error(streamError);
    }
    buffer += decoder.decode();
    if (buffer.trim()) consume(buffer.replace(/\r\n/g, "\n"));
    if (streamError) throw new Error(streamError);
    const text = streamed || completed;
    if (!text) throw new Error("SMARTLAB returned empty output.");
    return JSON.parse(text);
  } finally {
    clearTimeout(timeout);
  }
}

function cleanControl(raw: any): SmartLabControl {
  const role = CONTROL_ROLES.includes(String(raw?.role) as SmartLabControlRole)
    ? String(raw.role) as SmartLabControlRole : "generic";
  const min = Number(raw?.min ?? 0);
  const max = Number(raw?.max ?? 10);
  const low = Number.isFinite(min) ? min : 0;
  const high = Number.isFinite(max) && max > low ? max : low + 10;
  const step = Number(raw?.step ?? (high - low) / 100);
  const fallbackDefault = (low + high) / 2;
  const suppliedDefault = Number(raw?.defaultValue);
  return {
    id: String(raw?.id || role).slice(0, 80),
    role,
    type: raw?.type === "toggle" ? "toggle" : "slider",
    label: String(raw?.label || role).slice(0, 160),
    symbol: String(raw?.symbol || "").slice(0, 40),
    min: low,
    max: high,
    defaultValue: Math.min(high, Math.max(low, Number.isFinite(suppliedDefault) ? suppliedDefault : fallbackDefault)),
    step: Number.isFinite(step) && step > 0 ? step : Math.max((high - low) / 100, 0.01),
    unit: String(raw?.unit || "").slice(0, 40),
  };
}

function cleanWidget(
  raw: any,
  allowedEntries: Map<string, EntryCatalogItem>,
  allowedSubchapters: Set<string>,
): SmartLabWidget | null {
  const smartEntryIds = Array.from(new Set((Array.isArray(raw?.smartEntryIds) ? raw.smartEntryIds : [])
    .map(String).filter((id: string) => allowedEntries.has(id))));
  if (!smartEntryIds.length) return null;
  const subchapterId = String(raw?.subchapterId || "");
  if (!allowedSubchapters.has(subchapterId)) return null;
  const inheritedSourceIds = new Set<string>();
  smartEntryIds.forEach((id) => allowedEntries.get(id)?.sourceItemIds.forEach((sourceId) => inheritedSourceIds.add(sourceId)));
  const suppliedSourceIds = new Set((Array.isArray(raw?.sourceItemIds) ? raw.sourceItemIds : []).map(String));
  const sourceItemIds = Array.from(inheritedSourceIds).filter((id) => suppliedSourceIds.size === 0 || suppliedSourceIds.has(id));
  const importance = IMPORTANCE.includes(String(raw?.importance) as SmartLabImportance)
    ? String(raw.importance) as SmartLabImportance : "supporting";
  const scopeRelation = SCOPE.includes(String(raw?.scopeRelation) as SmartLabScopeRelation)
    ? String(raw.scopeRelation) as SmartLabScopeRelation : "unclassified_depth";
  const physicsPreset = PRESETS.includes(String(raw?.physicsPreset) as SmartLabPhysicsPreset)
    ? String(raw.physicsPreset) as SmartLabPhysicsPreset : "generic_relation";
  return {
    id: String(raw?.id || `lab-${smartEntryIds[0]}`).slice(0, 140),
    subchapterId,
    title: String(raw?.title || "Εικονικό Εργαστήριο").trim().slice(0, 220),
    concept: String(raw?.concept || "").trim().slice(0, 1200),
    importance,
    scopeRelation,
    smartEntryIds,
    sourceItemIds,
    physicsPreset,
    scene: {
      dimension: raw?.scene?.dimension === "3d" ? "3d" : "2d",
      description: String(raw?.scene?.description || "").trim().slice(0, 2500),
    },
    question: String(raw?.question || "").trim().slice(0, 1200),
    prediction: String(raw?.prediction || "").trim().slice(0, 1200),
    controls: (Array.isArray(raw?.controls) ? raw.controls : []).slice(0, 4).map(cleanControl),
    liveFeedback: String(raw?.liveFeedback || "").trim().slice(0, 2500),
    discovery: String(raw?.discovery || "").trim().slice(0, 2500),
    equation: String(raw?.equation || "").trim().slice(0, 500),
    challenge: {
      instruction: String(raw?.challenge?.instruction || "").trim().slice(0, 1500),
      successHint: String(raw?.challenge?.successHint || "").trim().slice(0, 1200),
    },
    transferCheck: String(raw?.transferCheck || "").trim().slice(0, 1500),
    targetInsight: String(raw?.targetInsight || "").trim().slice(0, 1800),
    implementationNotes: (Array.isArray(raw?.implementationNotes) ? raw.implementationNotes : [])
      .map((value: unknown) => String(value).trim().slice(0, 700)).filter(Boolean).slice(0, 10),
  };
}

function cleanContent(raw: any, smart: SmartRow[], catalog: EntryCatalogItem[]): SmartLabContent {
  const allowedEntries = new Map(catalog.map((entry) => [entry.smartEntryId, entry]));
  const allowedSubchapters = new Set(smart.map((item) => item.subchapterId));
  const smartBySubchapter = new Map(smart.map((item) => [item.subchapterId, item]));
  const subchapters = (Array.isArray(raw?.subchapters) ? raw.subchapters : []).map((section: any) => {
    const id = String(section?.subchapterId || "");
    const source = smartBySubchapter.get(id);
    if (!source) return null;
    return {
      subchapterId: id,
      subchapterLabel: source.subchapterLabel,
      subchapterTitle: source.subchapterTitle,
      intelligenceVersionId: source.intelligenceVersionId,
      widgets: (Array.isArray(section?.widgets) ? section.widgets : [])
        .map((widget: any) => cleanWidget(widget, allowedEntries, allowedSubchapters))
        .filter((widget: SmartLabWidget | null): widget is SmartLabWidget => Boolean(widget)),
    };
  }).filter(Boolean) as SmartLabContent["subchapters"];
  const synthesis = (Array.isArray(raw?.chapterSynthesisWidgets) ? raw.chapterSynthesisWidgets : [])
    .map((widget: any) => cleanWidget(widget, allowedEntries, allowedSubchapters))
    .filter((widget: SmartLabWidget | null): widget is SmartLabWidget => Boolean(widget)).slice(0, 1);
  const nonInteractiveCore = (Array.isArray(raw?.nonInteractiveCore) ? raw.nonInteractiveCore : [])
    .map((item: any) => ({ smartEntryId: String(item?.smartEntryId || ""), reason: String(item?.reason || "").slice(0, 1200) }))
    .filter((item: { smartEntryId: string; reason: string }) => allowedEntries.has(item.smartEntryId) && item.reason);
  const coreIds = new Set(catalog.filter((entry) => entry.importance === "core").map((entry) => entry.smartEntryId));
  const interactiveCore = new Set<string>();
  [...subchapters.flatMap((section) => section.widgets), ...synthesis].forEach((widget) => {
    widget.smartEntryIds.forEach((id) => { if (coreIds.has(id)) interactiveCore.add(id); });
  });
  const nonInteractiveIds = new Set(nonInteractiveCore.map((item) => item.smartEntryId).filter((id) => coreIds.has(id)));
  return {
    title: String(raw?.title || "SMARTLAB").trim().slice(0, 240),
    summary: String(raw?.summary || "").trim().slice(0, 3000),
    subchapters,
    chapterSynthesisWidgets: synthesis,
    nonInteractiveCore,
    coverage: {
      totalCoreEntries: coreIds.size,
      interactiveCoreEntries: interactiveCore.size,
      nonInteractiveCoreEntries: nonInteractiveIds.size,
    },
  };
}

export async function createSmartLabRevision(chapterId: string) {
  const context = await loadChapterSmart(chapterId);
  if (!context) throw new Error("Physics chapter not found.");
  if (!context.smart.length) throw new Error("SMARTLAB needs at least one current SMART version in this chapter.");
  const sql = getSql();
  const snapshot = inputHash(context.smart);
  const existing = await sql`
    SELECT id::text, revision_number, status FROM physics.smartlab_revisions
    WHERE chapter_id::text = ${chapterId}
      AND input_snapshot_hash = ${snapshot}
      AND prompt_reference = ${SMARTLAB_PROMPT_REFERENCE}
      AND prompt_version = ${SMARTLAB_PROMPT_VERSION}
    ORDER BY revision_number DESC LIMIT 1
  `;
  if (existing.length) return { id: String(existing[0].id), revisionNumber: Number(existing[0].revision_number), status: String(existing[0].status), created: false };
  const prior = await sql`SELECT COALESCE(MAX(revision_number),0)::int + 1 AS next_revision FROM physics.smartlab_revisions WHERE chapter_id::text = ${chapterId}`;
  const revisionNumber = Number(prior[0]?.next_revision || 1);
  const smartVersions = context.smart.map((item) => ({ subchapterId: item.subchapterId, intelligenceVersionId: item.intelligenceVersionId, versionNumber: item.versionNumber }));
  const inserted = await sql`
    INSERT INTO physics.smartlab_revisions (
      course_id, chapter_id, revision_number, status, model,
      prompt_reference, prompt_version, input_snapshot_hash, smart_versions, content
    ) VALUES (
      ${context.courseId}::uuid, ${chapterId}::uuid, ${revisionNumber}, 'draft', ${model()},
      ${SMARTLAB_PROMPT_REFERENCE}, ${SMARTLAB_PROMPT_VERSION}, ${snapshot},
      ${JSON.stringify(smartVersions)}::jsonb, ${JSON.stringify({ state: "pending" })}::jsonb
    ) RETURNING id::text
  `;
  return { id: String(inserted[0].id), revisionNumber, status: "draft", created: true };
}

export async function getSmartLabRevisionView(revisionId: string): Promise<SmartLabRevisionView | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT sl.id::text, sl.revision_number, sl.status, sl.model, sl.prompt_reference,
           sl.prompt_version, sl.input_snapshot_hash, sl.smart_versions, sl.content,
           sl.error_message, sl.updated_at, sl.completed_at,
           c.id::text AS chapter_id, c.number_label AS chapter_number_label, c.title AS chapter_title,
           co.id::text AS course_id, co.title AS course_title
    FROM physics.smartlab_revisions sl
    JOIN physics.chapters c ON c.id = sl.chapter_id
    JOIN physics.courses co ON co.id = sl.course_id
    WHERE sl.id::text = ${revisionId} LIMIT 1
  `;
  if (!rows.length) return null;
  const row = rows[0] as any;
  return {
    id: String(row.id), courseId: String(row.course_id), courseTitle: String(row.course_title),
    chapterId: String(row.chapter_id), chapterNumberLabel: row.chapter_number_label ? String(row.chapter_number_label) : null,
    chapterTitle: String(row.chapter_title), revisionNumber: Number(row.revision_number),
    status: String(row.status) as SmartLabRevisionView["status"], model: String(row.model),
    promptReference: String(row.prompt_reference), promptVersion: String(row.prompt_version),
    inputSnapshotHash: String(row.input_snapshot_hash), smartVersions: Array.isArray(row.smart_versions) ? row.smart_versions : [],
    content: row.content as SmartLabRevisionView["content"], errorMessage: row.error_message ? String(row.error_message) : null,
    updatedAt: new Date(row.updated_at).toISOString(), completedAt: row.completed_at ? new Date(row.completed_at).toISOString() : null,
  };
}

export async function getCurrentSmartLabForChapter(chapterId: string) {
  const sql = getSql();
  const rows = await sql`SELECT id::text FROM physics.smartlab_revisions WHERE chapter_id::text = ${chapterId} AND status = 'current' ORDER BY revision_number DESC LIMIT 1`;
  return rows.length ? getSmartLabRevisionView(String(rows[0].id)) : null;
}

export async function claimSmartLabRun(revisionId: string) {
  const sql = getSql();
  const rows = await sql`
    UPDATE physics.smartlab_revisions
    SET status = 'processing', content = ${JSON.stringify({ state: "processing" })}::jsonb,
        error_message = NULL, updated_at = now()
    WHERE id::text = ${revisionId}
      AND (status IN ('draft','error') OR (status = 'processing' AND updated_at < now() - interval '15 minutes'))
    RETURNING id::text
  `;
  return rows.length > 0;
}

export async function runSmartLabRevision(revisionId: string) {
  const view = await getSmartLabRevisionView(revisionId);
  if (!view) throw new Error("SMARTLAB revision not found.");
  if (view.status === "current" || view.status === "superseded") return view;
  const context = await loadChapterSmart(view.chapterId);
  if (!context) throw new Error("Linked Physics chapter not found.");
  const currentSnapshot = inputHash(context.smart);
  if (currentSnapshot !== view.inputSnapshotHash) throw new Error("SMART changed after this SMARTLAB revision was created. Create a new LAB revision.");
  const catalog = context.smart.flatMap((item) => entriesForSmart(item.subchapterId, item.intelligence));
  const entryCatalogText = JSON.stringify(catalog);
  const presetContract = `\n\nRUNTIME CONTRACT — REQUIRED:\nChoose physicsPreset only from: horizontal_projectile, uniform_circular_motion, centripetal_force, generic_relation.\nUse horizontal_projectile for ideal horizontal launch relationships; uniform_circular_motion for period/frequency/angular-linear speed/centripetal-acceleration exploration; centripetal_force when mass and radial force are central; generic_relation otherwise.\nControls MUST use semantic roles from: initial_speed, height, gravity, radius, angular_speed, linear_speed, mass, frequency, generic.\nThe frontend executes only these safe presets. Do not invent executable formulas or code.\nSMART ENTRY CATALOG WITH VALID smartEntryIds:\n${entryCatalogText}`;
  const prompt = buildSmartLabPrompt({
    courseTitle: context.courseTitle,
    chapterId: context.chapterId,
    chapterLabel: context.chapterLabel,
    chapterTitle: context.chapterTitle,
    subchapters: context.smart.map((item) => ({
      subchapterId: item.subchapterId,
      subchapterLabel: item.subchapterLabel,
      subchapterTitle: item.subchapterTitle,
      intelligenceVersionId: item.intelligenceVersionId,
      intelligence: item.intelligence,
    })),
  }) + presetContract;
  const sql = getSql();
  try {
    const raw = await callOpenAI(view.model, prompt);
    const content = cleanContent(raw, context.smart, catalog);
    if (!content.subchapters.some((section) => section.widgets.length > 0)) throw new Error("SMARTLAB returned no usable interactive widgets.");
    await sql`UPDATE physics.smartlab_revisions SET status='superseded', updated_at=now() WHERE chapter_id::text=${view.chapterId} AND status='current' AND id::text<>${revisionId}`;
    await sql`UPDATE physics.smartlab_revisions SET status='current', content=${JSON.stringify(content)}::jsonb, error_message=NULL, updated_at=now(), completed_at=now() WHERE id::text=${revisionId}`;
  } catch (error) {
    const message = error instanceof Error ? error.message : "SMARTLAB generation failed.";
    await sql`UPDATE physics.smartlab_revisions SET status='error', error_message=${message}, updated_at=now() WHERE id::text=${revisionId}`;
    throw error;
  }
  const final = await getSmartLabRevisionView(revisionId);
  if (!final) throw new Error("SMARTLAB revision disappeared after generation.");
  return final;
}

export async function getSmartLabChapterState(chapterId: string) {
  const context = await loadChapterSmart(chapterId);
  if (!context) return null;
  const current = await getCurrentSmartLabForChapter(chapterId);
  const snapshot = context.smart.length ? inputHash(context.smart) : null;
  return {
    chapter: { id: context.chapterId, label: context.chapterLabel, title: context.chapterTitle, courseTitle: context.courseTitle },
    smartVersions: context.smart.map((item) => ({ subchapterId: item.subchapterId, subchapterLabel: item.subchapterLabel, subchapterTitle: item.subchapterTitle, intelligenceVersionId: item.intelligenceVersionId, versionNumber: item.versionNumber })),
    current,
    upToDate: Boolean(current && snapshot && current.inputSnapshotHash === snapshot && current.promptVersion === SMARTLAB_PROMPT_VERSION),
  };
}
