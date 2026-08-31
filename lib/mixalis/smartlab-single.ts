import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { callTeacherJsonStream } from "@/lib/mixalis/openai-json-stream";
import {
  buildSmartLabPrompt,
  SMARTLAB_PROMPT_REFERENCE,
  SMARTLAB_PROMPT_VERSION,
  type SmartLabPromptQuantityInput,
} from "@/lib/mixalis/smartlab-prompt";
import { assertLessonFormulaContract, assertRuntimePhysicsFormulas } from "@/lib/mixalis/smartlab-physics-audit";
import { derivePhysicsImpactModel } from "@/lib/mixalis/smartlab-impact";
import { getSmartLabRevisionView } from "@/lib/mixalis/smartlab";
import type { LessonFormula, LessonQuantity, StartLessonContent } from "@/lib/mixalis/start-lesson";
import type {
  SmartLabContent,
  SmartLabControl,
  SmartLabControlRole,
  SmartLabPhysicsPreset,
  SmartLabQuantity,
  SmartLabQuantityPhysicsRole,
  SmartLabQuantityRole,
  SmartLabRevisionView,
  SmartLabVisualRepresentation,
  SmartLabWidget,
} from "@/lib/mixalis/smartlab-types";

const SINGLE_SNAPSHOT_PREFIX = "single:";
const SINGLE_RUNTIME_SCHEMA_VERSION = "single-subchapter-v1";

const PRESETS = ["horizontal_projectile", "uniform_circular_motion", "centripetal_force", "generic_relation"] as const;
const CONTROL_ROLES = ["initial_speed", "height", "gravity", "radius", "angular_speed", "linear_speed", "mass", "frequency", "generic"] as const;
const QUANTITY_ROLES = ["controllable", "time_state", "derived", "fixed", "model_assumption"] as const;
const PHYSICS_ROLES = [
  "initial_speed", "height", "gravity", "time", "horizontal_position", "vertical_displacement",
  "horizontal_velocity", "vertical_velocity", "speed", "velocity_angle", "range", "radius", "arc_length",
  "angular_displacement", "revolution_count", "angular_speed", "linear_speed", "frequency", "period",
  "centripetal_acceleration", "centripetal_force", "mass", "generic",
] as const;
const VISUAL_REPRESENTATIONS = [
  "vertical_distance", "horizontal_distance", "displacement_vector", "velocity_vector", "vector_component",
  "acceleration_vector", "force_vector", "radius", "angle", "arc", "trajectory", "position",
  "scalar_measurement", "time_state", "none",
] as const;

const QUANTITY_CONFIG_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["id", "physicsRole", "role", "dependsOn", "affects", "visualRepresentation"],
  properties: {
    id: { type: "string" },
    physicsRole: { type: "string", enum: PHYSICS_ROLES },
    role: { type: "string", enum: QUANTITY_ROLES },
    dependsOn: { type: "array", items: { type: "string" } },
    affects: { type: "array", items: { type: "string" } },
    visualRepresentation: { type: "string", enum: VISUAL_REPRESENTATIONS },
  },
} as const;

const CONTROL_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["quantityId", "role", "type", "min", "max", "defaultValue", "step", "invariants", "affects"],
  properties: {
    quantityId: { type: "string" },
    role: { type: "string", enum: CONTROL_ROLES },
    type: { type: "string", enum: ["slider", "toggle"] },
    min: { type: "number" },
    max: { type: "number" },
    defaultValue: { type: "number" },
    step: { type: "number" },
    invariants: { type: "array", items: { type: "string" } },
    affects: { type: "array", items: { type: "string" } },
  },
} as const;

const IMPACT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["controlQuantityId", "changes", "unchanged", "explanation"],
  properties: {
    controlQuantityId: { type: "string" },
    changes: { type: "array", items: { type: "string" } },
    unchanged: { type: "array", items: { type: "string" } },
    explanation: { type: "string" },
  },
} as const;

const WIDGET_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "subchapterId", "title", "concept", "physicsPreset", "sceneDescription", "quantities", "controls",
    "diagramDescription", "representedQuantityIds", "liveMeasurements", "impactModel",
  ],
  properties: {
    subchapterId: { type: "string" },
    title: { type: "string" },
    concept: { type: "string" },
    physicsPreset: { type: "string", enum: PRESETS },
    sceneDescription: { type: "string" },
    quantities: { type: "array", items: QUANTITY_CONFIG_SCHEMA, minItems: 1, maxItems: 20 },
    controls: { type: "array", items: CONTROL_SCHEMA, minItems: 1, maxItems: 4 },
    diagramDescription: { type: "string" },
    representedQuantityIds: { type: "array", items: { type: "string" } },
    liveMeasurements: { type: "array", items: { type: "string" } },
    impactModel: { type: "array", items: IMPACT_SCHEMA, minItems: 1, maxItems: 4 },
  },
} as const;

const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["widget"],
  properties: { widget: WIDGET_SCHEMA },
} as const;

type SingleLessonContext = {
  courseId: string;
  courseTitle: string;
  chapterId: string;
  chapterLabel: string;
  chapterTitle: string;
  subchapterId: string;
  subchapterLabel: string;
  subchapterTitle: string;
  lessonRevisionId: string;
  revisionNumber: number;
  quantities: LessonQuantity[];
  formulas: LessonFormula[];
};

export type SingleSmartLabPipelineState = {
  subchapterId: string;
  subchapterLabel: string;
  subchapterTitle: string;
  lessonRevisionId: string | null;
  lessonRevisionNumber: number | null;
  quantityCount: number;
  currentRevisionId: string | null;
  currentStatus: SmartLabRevisionView["status"] | null;
  currentLessonRevisionId: string | null;
  upToDate: boolean;
};

function sqlClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing.");
  return neon(url);
}

function configuredModel() {
  return process.env.PHYSICS_GENERATION_MODEL?.trim() || process.env.PHYSICS_ANALYSIS_MODEL?.trim() || "gpt-5.6";
}

function hash(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function asLessonQuantities(content: unknown): LessonQuantity[] {
  const quantities = (content as StartLessonContent | undefined)?.quantities;
  if (!Array.isArray(quantities)) return [];
  return quantities
    .map((item: any) => ({
      symbol: String(item?.symbol || "").trim(),
      name: String(item?.name || "").trim(),
      meaning: String(item?.meaning || "").trim(),
      unit: String(item?.unit || "").trim(),
      whyItMatters: String(item?.whyItMatters || "").trim(),
      sourceItemIds: Array.isArray(item?.sourceItemIds) ? item.sourceItemIds.map((id: unknown) => String(id)) : [],
    }))
    .filter((item) => item.name && item.symbol && item.meaning);
}

function asLessonFormulas(content: unknown): LessonFormula[] {
  const formulas = (content as StartLessonContent | undefined)?.formulas;
  if (!Array.isArray(formulas)) return [];
  return formulas
    .map((item: any) => ({
      expression: String(item?.expression || "").trim(),
      readAs: String(item?.readAs || "").trim(),
      physicalMeaning: String(item?.physicalMeaning || "").trim(),
      conditions: String(item?.conditions || "").trim(),
      sourceItemIds: Array.isArray(item?.sourceItemIds) ? item.sourceItemIds.map((id: unknown) => String(id)) : [],
    }))
    .filter((item) => item.expression);
}

async function lessonContext(subchapterId: string): Promise<SingleLessonContext | null> {
  const sql = sqlClient();
  const rows = await sql`
    SELECT co.id::text AS course_id, co.title AS course_title,
           c.id::text AS chapter_id, c.number_label AS chapter_label, c.title AS chapter_title,
           sc.id::text AS subchapter_id, sc.number_label AS subchapter_label, sc.title AS subchapter_title,
           lr.id::text AS lesson_revision_id, lr.revision_number, lr.content
    FROM physics.subchapters sc
    JOIN physics.chapters c ON c.id = sc.chapter_id
    JOIN physics.courses co ON co.id = c.course_id
    JOIN LATERAL (
      SELECT id, revision_number, content
      FROM physics.lesson_revisions
      WHERE subchapter_id = sc.id AND status = 'current'
      ORDER BY revision_number DESC
      LIMIT 1
    ) lr ON true
    WHERE sc.id::text = ${subchapterId}
      AND sc.status = 'active'
      AND c.status = 'active'
    LIMIT 1
  `;
  if (!rows.length) return null;
  const row = rows[0] as any;
  const quantities = asLessonQuantities(row.content);
  if (!quantities.length) return null;
  return {
    courseId: String(row.course_id),
    courseTitle: String(row.course_title),
    chapterId: String(row.chapter_id),
    chapterLabel: row.chapter_label ? String(row.chapter_label) : "",
    chapterTitle: String(row.chapter_title),
    subchapterId: String(row.subchapter_id),
    subchapterLabel: String(row.subchapter_label),
    subchapterTitle: String(row.subchapter_title),
    lessonRevisionId: String(row.lesson_revision_id),
    revisionNumber: Number(row.revision_number),
    quantities,
    formulas: asLessonFormulas(row.content),
  };
}

function singleSnapshot(context: SingleLessonContext) {
  return `${SINGLE_SNAPSHOT_PREFIX}${hash(JSON.stringify({
    promptVersion: SMARTLAB_PROMPT_VERSION,
    runtimeSchemaVersion: SINGLE_RUNTIME_SCHEMA_VERSION,
    subchapterId: context.subchapterId,
    lessonRevisionId: context.lessonRevisionId,
    quantities: context.quantities.map(({ sourceItemIds: _sourceItemIds, ...quantity }) => quantity),
  }))}`;
}

function lessonVersion(context: SingleLessonContext) {
  return {
    subchapterId: context.subchapterId,
    subchapterLabel: context.subchapterLabel,
    subchapterTitle: context.subchapterTitle,
    lessonRevisionId: context.lessonRevisionId,
    revisionNumber: context.revisionNumber,
    quantityCount: context.quantities.length,
  };
}

function promptQuantities(context: SingleLessonContext): SmartLabPromptQuantityInput[] {
  return context.quantities.map((quantity, index) => ({
    id: `q${index + 1}`,
    symbol: quantity.symbol,
    name: quantity.name,
    meaning: quantity.meaning,
    unit: quantity.unit,
    whyItMatters: quantity.whyItMatters,
  }));
}

function stringList(value: unknown, allowed?: Set<string>, limit = 30) {
  const list = (Array.isArray(value) ? value : [])
    .map((item) => String(item).trim())
    .filter(Boolean)
    .filter((item) => !allowed || allowed.has(item));
  return Array.from(new Set(list)).slice(0, limit);
}

function cleanWidget(raw: any, context: SingleLessonContext): SmartLabWidget {
  if (String(raw?.subchapterId || "") !== context.subchapterId) {
    throw new Error(`SMARTLAB returned the wrong subchapterId for ${context.subchapterLabel} ${context.subchapterTitle}.`);
  }

  const inputs = promptQuantities(context);
  const allowedIds = new Set(inputs.map((item) => item.id));
  const rawConfigs = Array.isArray(raw?.quantities) ? raw.quantities : [];
  const configIds = rawConfigs.map((item: any) => String(item?.id || ""));
  if (rawConfigs.length !== inputs.length || new Set(configIds).size !== inputs.length || configIds.some((id: string) => !allowedIds.has(id))) {
    throw new Error(`SMARTLAB must use all and only the lesson quantities for ${context.subchapterLabel} ${context.subchapterTitle}.`);
  }
  const configById = new Map(rawConfigs.map((item: any) => [String(item.id), item]));

  const quantities: SmartLabQuantity[] = inputs.map((input, index) => {
    const source = context.quantities[index];
    const config: any = configById.get(input.id);
    const physicsRaw = String(config?.physicsRole || "generic");
    const roleRaw = String(config?.role || "derived");
    const visualRaw = String(config?.visualRepresentation || "scalar_measurement");
    return {
      id: input.id,
      physicsRole: PHYSICS_ROLES.includes(physicsRaw as SmartLabQuantityPhysicsRole) ? physicsRaw as SmartLabQuantityPhysicsRole : "generic",
      name: source.name,
      symbol: source.symbol,
      unit: source.unit,
      meaning: source.meaning,
      whyItMatters: source.whyItMatters,
      role: QUANTITY_ROLES.includes(roleRaw as SmartLabQuantityRole) ? roleRaw as SmartLabQuantityRole : "derived",
      dependsOn: stringList(config?.dependsOn, allowedIds),
      affects: stringList(config?.affects, allowedIds),
      visualRepresentation: VISUAL_REPRESENTATIONS.includes(visualRaw as SmartLabVisualRepresentation)
        ? visualRaw as SmartLabVisualRepresentation
        : "scalar_measurement",
      sourceItemIds: source.sourceItemIds,
    };
  });

  const byId = new Map(quantities.map((quantity) => [quantity.id, quantity]));
  const controls: SmartLabControl[] = (Array.isArray(raw?.controls) ? raw.controls : []).map((item: any, index: number) => {
    const quantityId = String(item?.quantityId || "");
    const quantity = byId.get(quantityId);
    if (!quantity) throw new Error(`SMARTLAB control references unknown lesson quantity '${quantityId}'.`);
    const roleRaw = String(item?.role || "generic");
    const min = Number(item?.min);
    const max = Number(item?.max);
    const defaultValue = Number(item?.defaultValue);
    const step = Number(item?.step);
    if (![min, max, defaultValue, step].every(Number.isFinite) || max <= min || step <= 0 || defaultValue < min || defaultValue > max) {
      throw new Error(`SMARTLAB returned an invalid control range for '${quantity.name}'.`);
    }
    return {
      id: `control-${quantityId}-${index + 1}`,
      quantityId,
      role: CONTROL_ROLES.includes(roleRaw as SmartLabControlRole) ? roleRaw as SmartLabControlRole : "generic",
      type: item?.type === "toggle" ? "toggle" : "slider",
      label: quantity.name,
      symbol: quantity.symbol,
      min,
      max,
      defaultValue,
      step,
      unit: quantity.unit,
      invariants: stringList(item?.invariants, allowedIds),
      affects: stringList(item?.affects, allowedIds),
    };
  });

  const presetRaw = String(raw?.physicsPreset || "generic_relation");
  const widget: SmartLabWidget = {
    id: `smartlab-${context.subchapterId}`,
    subchapterId: context.subchapterId,
    title: String(raw?.title || context.subchapterTitle).trim().slice(0, 180),
    concept: String(raw?.concept || context.subchapterTitle).trim().slice(0, 700),
    physicsPreset: PRESETS.includes(presetRaw as SmartLabPhysicsPreset) ? presetRaw as SmartLabPhysicsPreset : "generic_relation",
    scene: { description: String(raw?.sceneDescription || "").trim().slice(0, 1200) },
    quantities,
    controls,
    diagram: {
      description: String(raw?.diagramDescription || "").trim().slice(0, 1600),
      representedQuantityIds: stringList(raw?.representedQuantityIds, allowedIds),
    },
    liveMeasurements: stringList(raw?.liveMeasurements, allowedIds),
    impactModel: (Array.isArray(raw?.impactModel) ? raw.impactModel : [])
      .map((item: any) => ({
        controlQuantityId: String(item?.controlQuantityId || ""),
        changes: stringList(item?.changes, allowedIds),
        unchanged: stringList(item?.unchanged, allowedIds),
        explanation: String(item?.explanation || "").trim().slice(0, 700),
      }))
      .filter((item: any) => allowedIds.has(item.controlQuantityId)),
    sourceItemIds: Array.from(new Set(context.quantities.flatMap((quantity) => quantity.sourceItemIds))),
    smartEntryIds: [],
  };

  assertWidgetContract(widget, context);
  return widget;
}

function quantityForRole(widget: SmartLabWidget, role: SmartLabQuantityPhysicsRole) {
  return widget.quantities.find((quantity) => quantity.physicsRole === role);
}

function assertWidgetContract(widget: SmartLabWidget, context: SingleLessonContext) {
  const errors: string[] = [];
  const byId = new Map(widget.quantities.map((quantity) => [quantity.id, quantity]));
  const controlIds = new Set<string>();

  for (const quantity of widget.quantities) {
    for (const id of [...quantity.dependsOn, ...quantity.affects]) {
      if (!byId.has(id)) errors.push(`${quantity.id} references unknown quantity '${id}'`);
    }
    if (quantity.role === "derived" && quantity.dependsOn.length === 0) errors.push(`derived quantity '${quantity.name}' has no dependencies`);
  }

  for (const control of widget.controls) {
    const quantity = byId.get(control.quantityId);
    if (!quantity) continue;
    if (controlIds.has(control.quantityId)) errors.push(`duplicate control for '${control.quantityId}'`);
    controlIds.add(control.quantityId);
    if (quantity.role !== "controllable" && quantity.role !== "model_assumption") errors.push(`control '${quantity.name}' targets a ${quantity.role} quantity`);
    if (control.role !== "generic" && control.role !== quantity.physicsRole) errors.push(`control role '${control.role}' does not match '${quantity.physicsRole}'`);
  }

  for (const quantity of widget.quantities.filter((item) => item.role === "controllable")) {
    if (!controlIds.has(quantity.id)) errors.push(`controllable quantity '${quantity.name}' has no control`);
  }
  for (const quantity of widget.quantities.filter((item) => item.role === "time_state")) {
    if (controlIds.has(quantity.id)) errors.push(`time_state quantity '${quantity.name}' cannot be a control`);
  }

  const covered = new Set([...widget.diagram.representedQuantityIds, ...widget.liveMeasurements]);
  for (const quantity of widget.quantities) {
    if (!covered.has(quantity.id)) errors.push(`lesson quantity '${quantity.name}' is not represented`);
  }

  const lower = context.subchapterTitle.toLocaleLowerCase("el-GR");
  const roles = new Set(widget.controls.map((control) => control.role));
  if (lower.includes("οριζόντια βολή")) {
    if (widget.physicsPreset !== "horizontal_projectile") errors.push("Οριζόντια βολή requires horizontal_projectile renderer");
    if (!roles.has("initial_speed")) errors.push("horizontal_projectile requires initial_speed control");
    if (!roles.has("height")) errors.push("horizontal_projectile requires height control");
    if (quantityForRole(widget, "time")?.role !== "time_state") errors.push("horizontal_projectile time must be time_state");
  }
  if (lower.includes("ομαλή κυκλική κίνηση")) {
    if (widget.physicsPreset !== "uniform_circular_motion") errors.push("Ομαλή κυκλική κίνηση requires uniform_circular_motion renderer");
    if (!roles.has("radius")) errors.push("uniform_circular_motion requires radius control");
    const speedDrivers = ["angular_speed", "linear_speed", "frequency"].filter((role) => roles.has(role as SmartLabControlRole));
    if (speedDrivers.length !== 1) errors.push("uniform_circular_motion requires exactly one speed driver");
  }
  if (lower.includes("κεντρομόλο") || lower.includes("κεντρομόλος")) {
    if (widget.physicsPreset !== "centripetal_force") errors.push("Κεντρομόλος δύναμη requires centripetal_force renderer");
    const force = quantityForRole(widget, "centripetal_force");
    if (force?.role !== "derived") errors.push("centripetal_force must be derived");
    if (force && controlIds.has(force.id)) errors.push("centripetal_force cannot be an independent control");
  }

  if (errors.length) throw new Error(`SMARTLAB physics contract failed for '${context.subchapterLabel} ${context.subchapterTitle}': ${errors.join("; ")}`);
}

function assertLessonContract(context: SingleLessonContext) {
  const lower = context.subchapterTitle.toLocaleLowerCase("el-GR");
  if (!lower.includes("οριζόντια βολή") && !lower.includes("ομαλή κυκλική κίνηση") && !lower.includes("κεντρομόλο") && !lower.includes("κεντρομόλος")) return;
  if (!context.formulas.length) throw new Error(`SMARTLAB formula verification cannot run: ${context.subchapterLabel} ${context.subchapterTitle} has no lesson formulas.`);
  assertLessonFormulaContract(context.subchapterTitle, context.formulas);
}

async function generateWidget(context: SingleLessonContext, model: string) {
  const raw = await callTeacherJsonStream({
    model,
    prompt: buildSmartLabPrompt({
      courseTitle: context.courseTitle,
      chapterLabel: context.chapterLabel,
      chapterTitle: context.chapterTitle,
      subchapterId: context.subchapterId,
      subchapterLabel: context.subchapterLabel,
      subchapterTitle: context.subchapterTitle,
      quantities: promptQuantities(context),
    }),
    schemaName: "physics_smartlab_single_subchapter_v1",
    schema: RESULT_SCHEMA,
    reasoningEffort: "high",
  });
  return cleanWidget(raw?.widget, context);
}

function contentFor(context: SingleLessonContext, widget: SmartLabWidget): SmartLabContent {
  const represented = new Set([...widget.diagram.representedQuantityIds, ...widget.liveMeasurements]);
  return {
    title: context.subchapterTitle,
    summary: "Ένα χειροκίνητο διαδραστικό εργαστήριο αποκλειστικά για το current START αυτού του μαθήματος.",
    subchapters: [{
      subchapterId: context.subchapterId,
      subchapterLabel: context.subchapterLabel,
      subchapterTitle: context.subchapterTitle,
      lessonRevisionId: context.lessonRevisionId,
      lessonRevisionNumber: context.revisionNumber,
      widgets: [widget],
    }],
    coverage: {
      totalQuantities: widget.quantities.length,
      representedQuantities: represented.size,
      controllableQuantities: widget.quantities.filter((quantity) => quantity.role === "controllable").length,
    },
  };
}

export function isSingleSmartLabRevision(view: SmartLabRevisionView) {
  return view.inputSnapshotHash.startsWith(SINGLE_SNAPSHOT_PREFIX) && view.lessonVersions.length === 1;
}

export async function createSingleSmartLabRevision(subchapterId: string) {
  const context = await lessonContext(subchapterId);
  if (!context) throw new Error("SMARTLAB needs a current START lesson with physical quantities for this subchapter.");
  assertLessonContract(context);

  const sql = sqlClient();
  const inputSnapshotHash = singleSnapshot(context);
  const existing = await sql`
    SELECT id::text, revision_number, status
    FROM physics.smartlab_revisions
    WHERE chapter_id::text = ${context.chapterId}
      AND input_snapshot_hash = ${inputSnapshotHash}
      AND prompt_reference = ${SMARTLAB_PROMPT_REFERENCE}
      AND prompt_version = ${SMARTLAB_PROMPT_VERSION}
    ORDER BY revision_number DESC
    LIMIT 1
  `;
  if (existing.length) {
    return {
      id: String(existing[0].id),
      revisionNumber: Number(existing[0].revision_number),
      status: String(existing[0].status),
      chapterId: context.chapterId,
      created: false,
    };
  }

  const prior = await sql`
    SELECT COALESCE(MAX(revision_number), 0)::int + 1 AS next_revision
    FROM physics.smartlab_revisions
    WHERE chapter_id::text = ${context.chapterId}
  `;
  const revisionNumber = Number(prior[0]?.next_revision || 1);
  const inserted = await sql`
    INSERT INTO physics.smartlab_revisions (
      course_id, chapter_id, revision_number, status, model, prompt_reference,
      prompt_version, input_snapshot_hash, smart_versions, content
    ) VALUES (
      ${context.courseId}::uuid, ${context.chapterId}::uuid, ${revisionNumber}, 'draft', ${configuredModel()},
      ${SMARTLAB_PROMPT_REFERENCE}, ${SMARTLAB_PROMPT_VERSION}, ${inputSnapshotHash},
      ${JSON.stringify([lessonVersion(context)])}::jsonb,
      ${JSON.stringify({ state: "pending", scope: "single-subchapter", subchapterId: context.subchapterId })}::jsonb
    )
    RETURNING id::text
  `;
  return { id: String(inserted[0].id), revisionNumber, status: "draft", chapterId: context.chapterId, created: true };
}

export async function runSingleSmartLabRevision(revisionId: string) {
  const view = await getSmartLabRevisionView(revisionId);
  if (!view) throw new Error("SMARTLAB revision not found.");
  if (!isSingleSmartLabRevision(view)) throw new Error("This is not a per-subchapter SMARTLAB revision.");
  if (view.status === "current" || view.status === "superseded") return view;

  const target = view.lessonVersions[0];
  const context = await lessonContext(target.subchapterId);
  if (!context) throw new Error("The linked current START lesson no longer exists.");
  if (singleSnapshot(context) !== view.inputSnapshotHash) throw new Error("The START lesson changed after this LAB revision was created. Create a new LAB revision.");
  assertLessonContract(context);

  const sql = sqlClient();
  try {
    const generated = await generateWidget(context, view.model);
    assertRuntimePhysicsFormulas(generated);
    const widget = { ...generated, impactModel: derivePhysicsImpactModel(generated) };
    const content = contentFor(context, widget);

    await sql`
      UPDATE physics.smartlab_revisions
      SET status = 'superseded', updated_at = now()
      WHERE chapter_id::text = ${context.chapterId}
        AND status = 'current'
        AND id::text <> ${revisionId}
        AND input_snapshot_hash LIKE 'single:%'
        AND jsonb_array_length(smart_versions) = 1
        AND smart_versions->0->>'subchapterId' = ${context.subchapterId}
    `;
    await sql`
      UPDATE physics.smartlab_revisions
      SET status = 'current', content = ${JSON.stringify(content)}::jsonb,
          error_message = NULL, updated_at = now(), completed_at = now()
      WHERE id::text = ${revisionId}
    `;
  } catch (error) {
    const message = error instanceof Error ? error.message : "SMARTLAB generation failed.";
    await sql`
      UPDATE physics.smartlab_revisions
      SET status = 'error', error_message = ${message}, updated_at = now()
      WHERE id::text = ${revisionId}
    `;
    throw error;
  }

  const final = await getSmartLabRevisionView(revisionId);
  if (!final) throw new Error("SMARTLAB revision disappeared after generation.");
  return final;
}

export async function getSingleSmartLabState(subchapterId: string): Promise<SingleSmartLabPipelineState | null> {
  const sql = sqlClient();
  const rows = await sql`
    SELECT sc.id::text AS subchapter_id, sc.number_label, sc.title,
           lr.id::text AS lesson_revision_id, lr.revision_number, lr.content,
           sl.id::text AS lab_revision_id, sl.status AS lab_status,
           sl.input_snapshot_hash, sl.smart_versions
    FROM physics.subchapters sc
    LEFT JOIN LATERAL (
      SELECT id, revision_number, content
      FROM physics.lesson_revisions
      WHERE subchapter_id = sc.id AND status = 'current'
      ORDER BY revision_number DESC
      LIMIT 1
    ) lr ON true
    LEFT JOIN LATERAL (
      SELECT id, status, input_snapshot_hash, smart_versions, revision_number
      FROM physics.smartlab_revisions
      WHERE chapter_id = sc.chapter_id
        AND status = 'current'
        AND input_snapshot_hash LIKE 'single:%'
        AND jsonb_array_length(smart_versions) = 1
        AND smart_versions->0->>'subchapterId' = sc.id::text
      ORDER BY revision_number DESC
      LIMIT 1
    ) sl ON true
    WHERE sc.id::text = ${subchapterId}
      AND sc.status = 'active'
    LIMIT 1
  `;
  if (!rows.length) return null;
  const row = rows[0] as any;
  const quantities = row.lesson_revision_id ? asLessonQuantities(row.content) : [];
  const currentLessonRevisionId = Array.isArray(row.smart_versions) && row.smart_versions[0]
    ? String(row.smart_versions[0]?.lessonRevisionId || "") || null
    : null;
  return {
    subchapterId: String(row.subchapter_id),
    subchapterLabel: String(row.number_label),
    subchapterTitle: String(row.title),
    lessonRevisionId: row.lesson_revision_id ? String(row.lesson_revision_id) : null,
    lessonRevisionNumber: row.revision_number ? Number(row.revision_number) : null,
    quantityCount: quantities.length,
    currentRevisionId: row.lab_revision_id ? String(row.lab_revision_id) : null,
    currentStatus: row.lab_status ? String(row.lab_status) as SmartLabRevisionView["status"] : null,
    currentLessonRevisionId,
    upToDate: Boolean(
      row.lesson_revision_id &&
      row.lab_revision_id &&
      currentLessonRevisionId === String(row.lesson_revision_id) &&
      row.input_snapshot_hash &&
      row.input_snapshot_hash === `${SINGLE_SNAPSHOT_PREFIX}${hash(JSON.stringify({
        promptVersion: SMARTLAB_PROMPT_VERSION,
        runtimeSchemaVersion: SINGLE_RUNTIME_SCHEMA_VERSION,
        subchapterId: String(row.subchapter_id),
        lessonRevisionId: String(row.lesson_revision_id),
        quantities: quantities.map(({ sourceItemIds: _sourceItemIds, ...quantity }) => quantity),
      }))}`,
    ),
  };
}

export async function listSingleSmartLabStatesByChapter(chapterId: string): Promise<SingleSmartLabPipelineState[]> {
  const sql = sqlClient();
  const rows = await sql`
    SELECT sc.id::text AS subchapter_id
    FROM physics.subchapters sc
    WHERE sc.chapter_id::text = ${chapterId}
      AND sc.status = 'active'
    ORDER BY sc.sort_order, sc.number_label
  `;
  const states = await Promise.all(rows.map((row: any) => getSingleSmartLabState(String(row.subchapter_id))));
  return states.filter((state): state is SingleSmartLabPipelineState => Boolean(state));
}
