import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { callTeacherJsonStream } from "@/lib/mixalis/openai-json-stream";
import {
  buildSmartLabPrompt,
  SMARTLAB_PROMPT_REFERENCE,
  SMARTLAB_PROMPT_VERSION,
  type SmartLabPromptQuantityInput,
} from "@/lib/mixalis/smartlab-prompt";
import type { LessonQuantity, StartLessonContent } from "@/lib/mixalis/start-lesson";
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

export { SMARTLAB_PROMPT_REFERENCE, SMARTLAB_PROMPT_VERSION } from "@/lib/mixalis/smartlab-prompt";
export type { SmartLabContent, SmartLabRevisionView, SmartLabWidget } from "@/lib/mixalis/smartlab-types";

const SMARTLAB_RUNTIME_SCHEMA_VERSION = "finalver1-lesson-quantities-per-subchapter-v1";

type LessonRow = {
  subchapterId: string;
  subchapterLabel: string;
  subchapterTitle: string;
  lessonRevisionId: string;
  revisionNumber: number;
  quantities: LessonQuantity[];
};

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

async function chapterContext(chapterId: string) {
  const sql = sqlClient();
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
           lr.id::text AS lesson_revision_id, lr.revision_number, lr.content
    FROM physics.subchapters sc
    LEFT JOIN LATERAL (
      SELECT id, revision_number, content
      FROM physics.lesson_revisions
      WHERE subchapter_id = sc.id AND status = 'current'
      ORDER BY revision_number DESC
      LIMIT 1
    ) lr ON true
    WHERE sc.chapter_id::text = ${chapterId} AND sc.status = 'active'
    ORDER BY sc.sort_order, sc.number_label
  `;

  const lessons: LessonRow[] = [];
  const missingLessons: Array<{ subchapterId: string; subchapterLabel: string; subchapterTitle: string }> = [];
  for (const row of rows as any[]) {
    const base = {
      subchapterId: String(row.subchapter_id),
      subchapterLabel: String(row.number_label),
      subchapterTitle: String(row.title),
    };
    if (!row.lesson_revision_id) {
      missingLessons.push(base);
      continue;
    }
    const quantities = asLessonQuantities(row.content);
    if (!quantities.length) {
      missingLessons.push(base);
      continue;
    }
    lessons.push({
      ...base,
      lessonRevisionId: String(row.lesson_revision_id),
      revisionNumber: Number(row.revision_number),
      quantities,
    });
  }

  const chapter = chapterRows[0] as any;
  return {
    courseId: String(chapter.course_id),
    courseTitle: String(chapter.course_title),
    chapterId: String(chapter.chapter_id),
    chapterLabel: chapter.number_label ? String(chapter.number_label) : "",
    chapterTitle: String(chapter.chapter_title),
    lessons,
    missingLessons,
  };
}

function snapshotHash(lessons: LessonRow[]) {
  return hash(JSON.stringify({
    promptVersion: SMARTLAB_PROMPT_VERSION,
    runtimeSchemaVersion: SMARTLAB_RUNTIME_SCHEMA_VERSION,
    lessons: lessons.map((lesson) => ({
      subchapterId: lesson.subchapterId,
      subchapterLabel: lesson.subchapterLabel,
      subchapterTitle: lesson.subchapterTitle,
      quantities: lesson.quantities.map(({ sourceItemIds: _sourceItemIds, ...quantity }) => quantity),
    })),
  }));
}

function promptQuantities(lesson: LessonRow): SmartLabPromptQuantityInput[] {
  return lesson.quantities.map((quantity, index) => ({
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

function cleanWidget(raw: any, lesson: LessonRow): SmartLabWidget {
  if (String(raw?.subchapterId || "") !== lesson.subchapterId) {
    throw new Error(`SMARTLAB returned the wrong subchapterId for ${lesson.subchapterLabel} ${lesson.subchapterTitle}.`);
  }

  const inputs = promptQuantities(lesson);
  const allowedIds = new Set(inputs.map((item) => item.id));
  const rawConfigs = Array.isArray(raw?.quantities) ? raw.quantities : [];
  const configIds = rawConfigs.map((item: any) => String(item?.id || ""));
  if (rawConfigs.length !== inputs.length || new Set(configIds).size !== inputs.length || configIds.some((id: string) => !allowedIds.has(id))) {
    throw new Error(`SMARTLAB must use all and only the lesson quantities for ${lesson.subchapterLabel} ${lesson.subchapterTitle}.`);
  }
  const configById = new Map(rawConfigs.map((item: any) => [String(item.id), item]));

  const quantities: SmartLabQuantity[] = inputs.map((input, index) => {
    const source = lesson.quantities[index];
    const config: any = configById.get(input.id);
    const physicsRaw = String(config?.physicsRole || "generic");
    const roleRaw = String(config?.role || "derived");
    const visualRaw = String(config?.visualRepresentation || "scalar_measurement");
    const physicsRole: SmartLabQuantityPhysicsRole = PHYSICS_ROLES.includes(physicsRaw as SmartLabQuantityPhysicsRole)
      ? physicsRaw as SmartLabQuantityPhysicsRole : "generic";
    const role: SmartLabQuantityRole = QUANTITY_ROLES.includes(roleRaw as SmartLabQuantityRole)
      ? roleRaw as SmartLabQuantityRole : "derived";
    const visualRepresentation: SmartLabVisualRepresentation = VISUAL_REPRESENTATIONS.includes(visualRaw as SmartLabVisualRepresentation)
      ? visualRaw as SmartLabVisualRepresentation : "scalar_measurement";
    return {
      id: input.id,
      physicsRole,
      name: source.name,
      symbol: source.symbol,
      unit: source.unit,
      meaning: source.meaning,
      whyItMatters: source.whyItMatters,
      role,
      dependsOn: stringList(config?.dependsOn, allowedIds),
      affects: stringList(config?.affects, allowedIds),
      visualRepresentation,
      sourceItemIds: source.sourceItemIds,
    };
  });

  const byId = new Map(quantities.map((quantity) => [quantity.id, quantity]));
  const controls: SmartLabControl[] = (Array.isArray(raw?.controls) ? raw.controls : []).map((item: any, index: number) => {
    const quantityId = String(item?.quantityId || "");
    const quantity = byId.get(quantityId);
    if (!quantity) throw new Error(`SMARTLAB control references unknown lesson quantity '${quantityId}'.`);
    const roleRaw = String(item?.role || "generic");
    const role: SmartLabControlRole = CONTROL_ROLES.includes(roleRaw as SmartLabControlRole)
      ? roleRaw as SmartLabControlRole : "generic";
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
      role,
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
  const physicsPreset: SmartLabPhysicsPreset = PRESETS.includes(presetRaw as SmartLabPhysicsPreset)
    ? presetRaw as SmartLabPhysicsPreset : "generic_relation";

  const widget: SmartLabWidget = {
    id: `smartlab-${lesson.subchapterId}`,
    subchapterId: lesson.subchapterId,
    title: String(raw?.title || lesson.subchapterTitle).trim().slice(0, 180),
    concept: String(raw?.concept || lesson.subchapterTitle).trim().slice(0, 700),
    physicsPreset,
    scene: { description: String(raw?.sceneDescription || "").trim().slice(0, 1200) },
    quantities,
    controls,
    diagram: {
      description: String(raw?.diagramDescription || "").trim().slice(0, 1600),
      representedQuantityIds: stringList(raw?.representedQuantityIds, allowedIds),
    },
    liveMeasurements: stringList(raw?.liveMeasurements, allowedIds),
    impactModel: (Array.isArray(raw?.impactModel) ? raw.impactModel : []).map((item: any) => ({
      controlQuantityId: String(item?.controlQuantityId || ""),
      changes: stringList(item?.changes, allowedIds),
      unchanged: stringList(item?.unchanged, allowedIds),
      explanation: String(item?.explanation || "").trim().slice(0, 700),
    })).filter((item: any) => allowedIds.has(item.controlQuantityId)),
    sourceItemIds: Array.from(new Set(lesson.quantities.flatMap((quantity) => quantity.sourceItemIds))),
    smartEntryIds: [],
  };

  assertWidgetPhysics(widget, lesson);
  return widget;
}

function roleQuantity(widget: SmartLabWidget, role: SmartLabQuantityPhysicsRole) {
  return widget.quantities.find((quantity) => quantity.physicsRole === role);
}

function controlRoles(widget: SmartLabWidget) {
  return new Set(widget.controls.map((control) => control.role));
}

function assertWidgetPhysics(widget: SmartLabWidget, lesson: LessonRow) {
  const errors: string[] = [];
  const byId = new Map(widget.quantities.map((quantity) => [quantity.id, quantity]));
  const controlQuantityIds = new Set<string>();

  for (const quantity of widget.quantities) {
    for (const id of [...quantity.dependsOn, ...quantity.affects]) {
      if (!byId.has(id)) errors.push(`${quantity.id} references unknown quantity '${id}'`);
    }
    if (quantity.role === "derived" && quantity.dependsOn.length === 0) {
      errors.push(`derived quantity '${quantity.name}' has no dependencies`);
    }
  }

  for (const control of widget.controls) {
    if (controlQuantityIds.has(control.quantityId)) errors.push(`duplicate control for '${control.quantityId}'`);
    controlQuantityIds.add(control.quantityId);
    const quantity = byId.get(control.quantityId);
    if (!quantity) continue;
    if (quantity.role !== "controllable" && quantity.role !== "model_assumption") {
      errors.push(`control '${quantity.name}' targets a ${quantity.role} quantity`);
    }
    if (control.role !== "generic" && quantity.physicsRole !== control.role) {
      errors.push(`control role '${control.role}' does not match '${quantity.physicsRole}' for '${quantity.name}'`);
    }
    const impact = widget.impactModel.find((item) => item.controlQuantityId === control.quantityId);
    if (!impact) errors.push(`missing impact rule for '${quantity.name}'`);
    else {
      for (const affected of control.affects) if (!impact.changes.includes(affected)) errors.push(`impact rule omits '${affected}' for '${quantity.name}'`);
    }
  }

  for (const quantity of widget.quantities.filter((item) => item.role === "controllable")) {
    if (!controlQuantityIds.has(quantity.id)) errors.push(`controllable quantity '${quantity.name}' has no control`);
  }
  for (const quantity of widget.quantities.filter((item) => item.role === "time_state")) {
    if (controlQuantityIds.has(quantity.id)) errors.push(`time_state quantity '${quantity.name}' must use the shared state scrubber`);
  }

  const covered = new Set([...widget.diagram.representedQuantityIds, ...widget.liveMeasurements]);
  for (const quantity of widget.quantities) {
    if (!covered.has(quantity.id)) errors.push(`lesson quantity '${quantity.name}' is not represented in the diagram or live measurements`);
  }

  const lowerTitle = lesson.subchapterTitle.toLocaleLowerCase("el-GR");
  if (lowerTitle.includes("οριζόντια βολή")) {
    if (widget.physicsPreset !== "horizontal_projectile") errors.push("Οριζόντια βολή requires horizontal_projectile renderer");
    const required: SmartLabQuantityPhysicsRole[] = [
      "initial_speed", "time", "horizontal_position", "vertical_displacement", "height", "horizontal_velocity",
      "vertical_velocity", "speed", "gravity", "velocity_angle",
    ];
    required.forEach((role) => { if (!roleQuantity(widget, role)) errors.push(`horizontal_projectile missing '${role}'`); });
    if (roleQuantity(widget, "time")?.role !== "time_state") errors.push("horizontal_projectile time must be time_state");
    const roles = controlRoles(widget);
    if (!roles.has("initial_speed")) errors.push("horizontal_projectile must expose initial_speed");
    if (!roles.has("height")) errors.push("horizontal_projectile must expose height");
    if ([...roles].some((role) => !["initial_speed", "height", "gravity"].includes(role))) errors.push("horizontal_projectile has unsupported independent control");
  }

  if (lowerTitle.includes("ομαλή κυκλική κίνηση")) {
    if (widget.physicsPreset !== "uniform_circular_motion") errors.push("Ομαλή κυκλική κίνηση requires uniform_circular_motion renderer");
    const required: SmartLabQuantityPhysicsRole[] = [
      "radius", "arc_length", "angular_displacement", "revolution_count", "period", "frequency",
      "linear_speed", "angular_speed", "centripetal_acceleration",
    ];
    required.forEach((role) => { if (!roleQuantity(widget, role)) errors.push(`uniform_circular_motion missing '${role}'`); });
    if (roleQuantity(widget, "angular_displacement")?.role !== "time_state") errors.push("angular displacement must be the circular motion state");
    const roles = controlRoles(widget);
    if (!roles.has("radius")) errors.push("uniform_circular_motion must expose radius");
    const speedDrivers = ["angular_speed", "linear_speed", "frequency"].filter((role) => roles.has(role as SmartLabControlRole));
    if (speedDrivers.length !== 1) errors.push("uniform_circular_motion must expose exactly one speed driver");
  }

  if (errors.length) {
    throw new Error(`SMARTLAB physics audit failed for '${lesson.subchapterLabel} ${lesson.subchapterTitle}': ${errors.join("; ")}`);
  }
}

async function generateWidget(context: NonNullable<Awaited<ReturnType<typeof chapterContext>>>, lesson: LessonRow, model: string) {
  const quantities = promptQuantities(lesson);
  const prompt = buildSmartLabPrompt({
    courseTitle: context.courseTitle,
    chapterLabel: context.chapterLabel,
    chapterTitle: context.chapterTitle,
    subchapterId: lesson.subchapterId,
    subchapterLabel: lesson.subchapterLabel,
    subchapterTitle: lesson.subchapterTitle,
    quantities,
  });
  const raw = await callTeacherJsonStream({
    model,
    prompt,
    schemaName: "physics_smartlab_single_widget_v3",
    schema: RESULT_SCHEMA,
    reasoningEffort: "high",
  });
  return cleanWidget(raw?.widget, lesson);
}

export async function createSmartLabRevision(chapterId: string) {
  const context = await chapterContext(chapterId);
  if (!context) throw new Error("Physics chapter not found.");
  if (context.missingLessons.length) {
    throw new Error(`SMARTLAB needs a current START lesson with physical quantities for: ${context.missingLessons.map((item) => `${item.subchapterLabel} ${item.subchapterTitle}`).join(", ")}`);
  }
  if (!context.lessons.length) throw new Error("SMARTLAB needs at least one current START lesson with physical quantities.");

  const sql = sqlClient();
  const inputSnapshotHash = snapshotHash(context.lessons);
  const existing = await sql`
    SELECT id::text, revision_number, status
    FROM physics.smartlab_revisions
    WHERE chapter_id::text = ${chapterId}
      AND input_snapshot_hash = ${inputSnapshotHash}
      AND prompt_reference = ${SMARTLAB_PROMPT_REFERENCE}
      AND prompt_version = ${SMARTLAB_PROMPT_VERSION}
    ORDER BY revision_number DESC LIMIT 1
  `;
  if (existing.length) {
    return { id: String(existing[0].id), revisionNumber: Number(existing[0].revision_number), status: String(existing[0].status), created: false };
  }

  const prior = await sql`SELECT COALESCE(MAX(revision_number),0)::int + 1 AS next_revision FROM physics.smartlab_revisions WHERE chapter_id::text = ${chapterId}`;
  const revisionNumber = Number(prior[0]?.next_revision || 1);
  const lessonVersions = context.lessons.map((lesson) => ({
    subchapterId: lesson.subchapterId,
    subchapterLabel: lesson.subchapterLabel,
    subchapterTitle: lesson.subchapterTitle,
    lessonRevisionId: lesson.lessonRevisionId,
    revisionNumber: lesson.revisionNumber,
    quantityCount: lesson.quantities.length,
  }));
  const inserted = await sql`
    INSERT INTO physics.smartlab_revisions (
      course_id, chapter_id, revision_number, status, model, prompt_reference,
      prompt_version, input_snapshot_hash, smart_versions, content
    ) VALUES (
      ${context.courseId}::uuid, ${chapterId}::uuid, ${revisionNumber}, 'draft', ${configuredModel()},
      ${SMARTLAB_PROMPT_REFERENCE}, ${SMARTLAB_PROMPT_VERSION}, ${inputSnapshotHash},
      ${JSON.stringify(lessonVersions)}::jsonb, ${JSON.stringify({ state: "pending" })}::jsonb
    ) RETURNING id::text
  `;
  return { id: String(inserted[0].id), revisionNumber, status: "draft", created: true };
}

export async function getSmartLabRevisionView(revisionId: string): Promise<SmartLabRevisionView | null> {
  const sql = sqlClient();
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
  const storedVersions = Array.isArray(row.smart_versions) ? row.smart_versions : [];
  return {
    id: String(row.id),
    courseId: String(row.course_id),
    courseTitle: String(row.course_title),
    chapterId: String(row.chapter_id),
    chapterNumberLabel: row.chapter_number_label ? String(row.chapter_number_label) : null,
    chapterTitle: String(row.chapter_title),
    revisionNumber: Number(row.revision_number),
    status: String(row.status) as SmartLabRevisionView["status"],
    model: String(row.model),
    promptReference: String(row.prompt_reference),
    promptVersion: String(row.prompt_version),
    inputSnapshotHash: String(row.input_snapshot_hash),
    lessonVersions: storedVersions.map((item: any) => ({
      subchapterId: String(item?.subchapterId || ""),
      subchapterLabel: String(item?.subchapterLabel || ""),
      subchapterTitle: String(item?.subchapterTitle || ""),
      lessonRevisionId: String(item?.lessonRevisionId || ""),
      revisionNumber: Number(item?.revisionNumber || 0),
      quantityCount: Number(item?.quantityCount || 0),
    })),
    content: row.content as SmartLabRevisionView["content"],
    errorMessage: row.error_message ? String(row.error_message) : null,
    updatedAt: new Date(row.updated_at).toISOString(),
    completedAt: row.completed_at ? new Date(row.completed_at).toISOString() : null,
  };
}

export async function getCurrentSmartLabForChapter(chapterId: string) {
  const sql = sqlClient();
  const rows = await sql`SELECT id::text FROM physics.smartlab_revisions WHERE chapter_id::text = ${chapterId} AND status = 'current' ORDER BY revision_number DESC LIMIT 1`;
  return rows.length ? getSmartLabRevisionView(String(rows[0].id)) : null;
}

export async function claimSmartLabRun(revisionId: string) {
  const sql = sqlClient();
  const rows = await sql`
    UPDATE physics.smartlab_revisions
    SET status='processing', content=${JSON.stringify({ state: "processing" })}::jsonb,
        error_message=NULL, updated_at=now()
    WHERE id::text=${revisionId}
      AND (status IN ('draft','error') OR (status='processing' AND updated_at < now() - interval '15 minutes'))
    RETURNING id::text
  `;
  return rows.length > 0;
}

export async function runSmartLabRevision(revisionId: string) {
  const view = await getSmartLabRevisionView(revisionId);
  if (!view) throw new Error("SMARTLAB revision not found.");
  if (view.status === "current" || view.status === "superseded") return view;

  const context = await chapterContext(view.chapterId);
  if (!context) throw new Error("Linked Physics chapter not found.");
  if (context.missingLessons.length) throw new Error("A current START lesson or its physical quantities are missing. Create/update the lesson before SMARTLAB.");
  if (snapshotHash(context.lessons) !== view.inputSnapshotHash) {
    throw new Error("The lesson physical quantities changed after this SMARTLAB revision was created. Create a new SMARTLAB revision.");
  }

  const sql = sqlClient();
  try {
    // Deliberately one independent AI call per lesson/subchapter. No call can see another lesson.
    const widgets = await Promise.all(context.lessons.map((lesson) => generateWidget(context, lesson, view.model)));
    const sections = context.lessons.map((lesson, index) => ({
      subchapterId: lesson.subchapterId,
      subchapterLabel: lesson.subchapterLabel,
      subchapterTitle: lesson.subchapterTitle,
      lessonRevisionId: lesson.lessonRevisionId,
      lessonRevisionNumber: lesson.revisionNumber,
      widgets: [widgets[index]],
    }));

    if (sections.length !== context.lessons.length || sections.some((section) => section.widgets.length !== 1)) {
      throw new Error("SMARTLAB must return exactly one widget for every current lesson.");
    }

    const allQuantities = widgets.flatMap((widget) => widget.quantities);
    const represented = new Set(widgets.flatMap((widget) => [...widget.diagram.representedQuantityIds, ...widget.liveMeasurements]));
    const content: SmartLabContent = {
      title: context.chapterTitle,
      summary: "Ένα διαδραστικό σχεδιάγραμμα ανά φυσική έννοια, βασισμένο αποκλειστικά στα φυσικά μεγέθη του current μαθήματος.",
      subchapters: sections,
      coverage: {
        totalQuantities: allQuantities.length,
        representedQuantities: represented.size,
        controllableQuantities: allQuantities.filter((quantity) => quantity.role === "controllable").length,
      },
    };

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
  const context = await chapterContext(chapterId);
  if (!context) return null;
  const current = await getCurrentSmartLabForChapter(chapterId);
  const currentSnapshot = context.lessons.length && !context.missingLessons.length ? snapshotHash(context.lessons) : null;
  return {
    chapter: {
      id: context.chapterId,
      label: context.chapterLabel,
      title: context.chapterTitle,
      courseTitle: context.courseTitle,
    },
    lessonVersions: context.lessons.map((lesson) => ({
      subchapterId: lesson.subchapterId,
      subchapterLabel: lesson.subchapterLabel,
      subchapterTitle: lesson.subchapterTitle,
      lessonRevisionId: lesson.lessonRevisionId,
      revisionNumber: lesson.revisionNumber,
      quantityCount: lesson.quantities.length,
    })),
    missingLessons: context.missingLessons,
    current,
    upToDate: Boolean(current && currentSnapshot && current.inputSnapshotHash === currentSnapshot && current.promptVersion === SMARTLAB_PROMPT_VERSION),
  };
}
