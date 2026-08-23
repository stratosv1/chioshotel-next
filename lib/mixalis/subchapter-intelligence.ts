import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";

export const SUBCHAPTER_INTELLIGENCE_PROMPT_VERSION = "subchapter-intelligence-v2";

type Importance = "core" | "supporting" | "advanced";

export type ScopeRelation =
  | "official_core"
  | "within_official_scope"
  | "exercise_extension"
  | "boundary_only"
  | "unclassified_depth";

type SourceFinding = {
  id: string;
  analysisId: string;
  sourceRole: string;
  sourceLabel: string | null;
  layer: string;
  itemType: string;
  title: string;
  content: string;
  importance: string;
  confidence: number;
};

type CanonicalEntry = {
  title: string;
  content: string;
  importance: Importance;
  scopeRelation: ScopeRelation;
  sourceItemIds: string[];
};

type StartBrief = {
  mustEstablishBeforeFormulas: CanonicalEntry[];
  mustExplainDeeply: CanonicalEntry[];
  mustPrevent: CanonicalEntry[];
  mustTestForTransfer: CanonicalEntry[];
};

export type SubchapterIntelligenceContent = {
  summary: string;
  curriculum: {
    conceptsDefinitionsQuantities: CanonicalEntry[];
    lawsFormulasAssumptions: CanonicalEntry[];
    prerequisitesAndBoundaries: CanonicalEntry[];
  };
  depth: {
    dependenciesAndReasoning: CanonicalEntry[];
    misconceptionsAndTraps: CanonicalEntry[];
    combinationsContextsAndStrategies: CanonicalEntry[];
  };
  teaching: {
    sequenceRequirements: CanonicalEntry[];
    explanationRequirements: CanonicalEntry[];
    transferAndAssessmentRequirements: CanonicalEntry[];
  };
  scopeGuardrails: CanonicalEntry[];
  startBrief: StartBrief;
};

export type SubchapterIntelligenceView = {
  id: string;
  courseId: string;
  courseTitle: string;
  chapterId: string;
  chapterNumberLabel: string | null;
  chapterTitle: string;
  subchapterId: string;
  subchapterNumberLabel: string;
  subchapterTitle: string;
  versionNumber: number;
  status: "draft" | "current" | "superseded";
  model: string;
  promptVersion: string;
  sourceSnapshotHash: string;
  content: SubchapterIntelligenceContent | { state?: string; sourceCount?: number; findingCount?: number };
  errorMessage: string | null;
  sources: Array<{
    analysisId: string;
    sourceRole: string;
    sourceLabel: string | null;
    itemCount: number;
  }>;
};

const SCOPE_RELATIONS: ScopeRelation[] = [
  "official_core",
  "within_official_scope",
  "exercise_extension",
  "boundary_only",
  "unclassified_depth",
];

const ENTRY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "content", "importance", "scopeRelation", "sourceItemIds"],
  properties: {
    title: { type: "string" },
    content: { type: "string" },
    importance: { type: "string", enum: ["core", "supporting", "advanced"] },
    scopeRelation: {
      type: "string",
      enum: [
        "official_core",
        "within_official_scope",
        "exercise_extension",
        "boundary_only",
        "unclassified_depth",
      ],
    },
    sourceItemIds: {
      type: "array",
      minItems: 1,
      items: { type: "string" },
    },
  },
} as const;

const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "curriculum", "depth", "teaching", "scopeGuardrails", "startBrief"],
  properties: {
    summary: { type: "string" },
    curriculum: {
      type: "object",
      additionalProperties: false,
      required: [
        "conceptsDefinitionsQuantities",
        "lawsFormulasAssumptions",
        "prerequisitesAndBoundaries",
      ],
      properties: {
        conceptsDefinitionsQuantities: { type: "array", items: ENTRY_SCHEMA },
        lawsFormulasAssumptions: { type: "array", items: ENTRY_SCHEMA },
        prerequisitesAndBoundaries: { type: "array", items: ENTRY_SCHEMA },
      },
    },
    depth: {
      type: "object",
      additionalProperties: false,
      required: [
        "dependenciesAndReasoning",
        "misconceptionsAndTraps",
        "combinationsContextsAndStrategies",
      ],
      properties: {
        dependenciesAndReasoning: { type: "array", items: ENTRY_SCHEMA },
        misconceptionsAndTraps: { type: "array", items: ENTRY_SCHEMA },
        combinationsContextsAndStrategies: { type: "array", items: ENTRY_SCHEMA },
      },
    },
    teaching: {
      type: "object",
      additionalProperties: false,
      required: [
        "sequenceRequirements",
        "explanationRequirements",
        "transferAndAssessmentRequirements",
      ],
      properties: {
        sequenceRequirements: { type: "array", items: ENTRY_SCHEMA },
        explanationRequirements: { type: "array", items: ENTRY_SCHEMA },
        transferAndAssessmentRequirements: { type: "array", items: ENTRY_SCHEMA },
      },
    },
    scopeGuardrails: { type: "array", items: ENTRY_SCHEMA },
    startBrief: {
      type: "object",
      additionalProperties: false,
      required: [
        "mustEstablishBeforeFormulas",
        "mustExplainDeeply",
        "mustPrevent",
        "mustTestForTransfer",
      ],
      properties: {
        mustEstablishBeforeFormulas: { type: "array", items: ENTRY_SCHEMA },
        mustExplainDeeply: { type: "array", items: ENTRY_SCHEMA },
        mustPrevent: { type: "array", items: ENTRY_SCHEMA },
        mustTestForTransfer: { type: "array", items: ENTRY_SCHEMA },
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
  return process.env.PHYSICS_ANALYSIS_MODEL?.trim() || "gpt-5.6";
}

function hash(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
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

async function getSubchapterContext(subchapterId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT
      sc.id::text AS subchapter_id,
      sc.number_label AS subchapter_number_label,
      sc.title AS subchapter_title,
      c.id::text AS chapter_id,
      c.number_label AS chapter_number_label,
      c.title AS chapter_title,
      co.id::text AS course_id,
      co.title AS course_title
    FROM physics.subchapters sc
    JOIN physics.chapters c ON c.id = sc.chapter_id
    JOIN physics.courses co ON co.id = c.course_id
    WHERE sc.id::text = ${subchapterId}
    LIMIT 1
  `;
  return rows.length > 0 ? (rows[0] as any) : null;
}

async function listReadySourceFindings(subchapterId: string): Promise<SourceFinding[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      ii.id::text,
      a.id::text AS analysis_id,
      a.source_role,
      a.source_label,
      ii.layer,
      ii.item_type,
      ii.title,
      ii.content,
      ii.importance,
      ii.confidence
    FROM physics.source_analyses a
    JOIN physics.intelligence_items ii
      ON ii.analysis_id = a.id
     AND ii.status = 'active'
    WHERE a.subchapter_id::text = ${subchapterId}
      AND a.status = 'ready'
      AND a.source_role IN ('official', 'depth', 'teacher', 'assessment', 'supplemental')
    ORDER BY
      CASE a.source_role
        WHEN 'official' THEN 1
        WHEN 'depth' THEN 2
        WHEN 'teacher' THEN 3
        WHEN 'assessment' THEN 4
        ELSE 5
      END,
      CASE ii.importance WHEN 'core' THEN 1 WHEN 'supporting' THEN 2 ELSE 3 END,
      CASE ii.layer WHEN 'curriculum' THEN 1 WHEN 'understanding' THEN 2 ELSE 3 END,
      ii.created_at ASC
  `;
  return (rows as any[]).map((row) => ({
    id: String(row.id),
    analysisId: String(row.analysis_id),
    sourceRole: String(row.source_role),
    sourceLabel: row.source_label ? String(row.source_label) : null,
    layer: String(row.layer),
    itemType: String(row.item_type),
    title: String(row.title),
    content: String(row.content),
    importance: String(row.importance),
    confidence: Number(row.confidence ?? 0),
  }));
}

function sourceSnapshot(findings: SourceFinding[]) {
  const canonical = {
    promptVersion: SUBCHAPTER_INTELLIGENCE_PROMPT_VERSION,
    findings: findings.map((item) => ({
      id: item.id,
      analysisId: item.analysisId,
      role: item.sourceRole,
      layer: item.layer,
      type: item.itemType,
      title: item.title,
      content: item.content,
      importance: item.importance,
      confidence: item.confidence,
    })),
  };
  return hash(JSON.stringify(canonical));
}

export async function createSubchapterIntelligenceVersion(subchapterId: string) {
  const context = await getSubchapterContext(subchapterId);
  if (!context) throw new Error("Physics subchapter not found.");

  const findings = await listReadySourceFindings(subchapterId);
  const official = findings.filter((item) => item.sourceRole === "official");
  const depth = findings.filter((item) => item.sourceRole === "depth");
  if (official.length === 0) {
    throw new Error("Official School Book Intelligence must be ready first.");
  }
  if (depth.length === 0) {
    throw new Error("At least one depth Source Intelligence must be ready first.");
  }

  const sql = getSql();
  const snapshotHash = sourceSnapshot(findings);
  const existing = await sql`
    SELECT id::text, version_number, status
    FROM physics.subchapter_intelligence_versions
    WHERE subchapter_id::text = ${subchapterId}
      AND source_snapshot_hash = ${snapshotHash}
    ORDER BY version_number DESC
    LIMIT 1
  `;
  if (existing.length > 0) {
    return {
      id: String(existing[0].id),
      versionNumber: Number(existing[0].version_number),
      status: String(existing[0].status),
      created: false,
    };
  }

  const versionRows = await sql`
    SELECT COALESCE(MAX(version_number), 0)::int + 1 AS next_version
    FROM physics.subchapter_intelligence_versions
    WHERE subchapter_id::text = ${subchapterId}
  `;
  const versionNumber = Number(versionRows[0]?.next_version ?? 1);
  const model = configuredModel();
  const placeholder = JSON.stringify({
    state: "pending",
    sourceCount: new Set(findings.map((item) => item.analysisId)).size,
    findingCount: findings.length,
  });

  const inserted = await sql`
    INSERT INTO physics.subchapter_intelligence_versions (
      course_id,
      chapter_id,
      subchapter_id,
      version_number,
      status,
      model,
      prompt_version,
      source_snapshot_hash,
      content,
      diff_summary
    ) VALUES (
      ${String(context.course_id)}::uuid,
      ${String(context.chapter_id)}::uuid,
      ${subchapterId}::uuid,
      ${versionNumber},
      'draft',
      ${model},
      ${SUBCHAPTER_INTELLIGENCE_PROMPT_VERSION},
      ${snapshotHash},
      ${placeholder}::jsonb,
      NULL
    )
    RETURNING id::text
  `;
  const versionId = String(inserted[0].id);

  const analysisIds = Array.from(new Set(findings.map((item) => item.analysisId)));
  for (const analysisId of analysisIds) {
    await sql`
      INSERT INTO physics.subchapter_intelligence_version_sources (
        version_id,
        analysis_id,
        subchapter_id
      ) VALUES (
        ${versionId}::uuid,
        ${analysisId}::uuid,
        ${subchapterId}::uuid
      )
      ON CONFLICT (version_id, analysis_id) DO NOTHING
    `;
  }

  return { id: versionId, versionNumber, status: "draft", created: true };
}

async function listVersionFindings(versionId: string): Promise<SourceFinding[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      ii.id::text,
      a.id::text AS analysis_id,
      a.source_role,
      a.source_label,
      ii.layer,
      ii.item_type,
      ii.title,
      ii.content,
      ii.importance,
      ii.confidence
    FROM physics.subchapter_intelligence_version_sources vs
    JOIN physics.source_analyses a ON a.id = vs.analysis_id
    JOIN physics.intelligence_items ii ON ii.analysis_id = a.id AND ii.status = 'active'
    WHERE vs.version_id::text = ${versionId}
      AND a.status = 'ready'
    ORDER BY
      CASE a.source_role WHEN 'official' THEN 1 WHEN 'depth' THEN 2 WHEN 'teacher' THEN 3 ELSE 4 END,
      CASE ii.importance WHEN 'core' THEN 1 WHEN 'supporting' THEN 2 ELSE 3 END,
      CASE ii.layer WHEN 'curriculum' THEN 1 WHEN 'understanding' THEN 2 ELSE 3 END,
      ii.created_at ASC
  `;
  return (rows as any[]).map((row) => ({
    id: String(row.id),
    analysisId: String(row.analysis_id),
    sourceRole: String(row.source_role),
    sourceLabel: row.source_label ? String(row.source_label) : null,
    layer: String(row.layer),
    itemType: String(row.item_type),
    title: String(row.title),
    content: String(row.content),
    importance: String(row.importance),
    confidence: Number(row.confidence ?? 0),
  }));
}

function synthesisPrompt(input: {
  courseTitle: string;
  chapterLabel: string;
  chapterTitle: string;
  subchapterLabel: string;
  subchapterTitle: string;
  findings: SourceFinding[];
}) {
  const serialized = input.findings.map((item) => ({
    sourceItemId: item.id,
    sourceRole: item.sourceRole,
    sourceLabel: item.sourceLabel,
    layer: item.layer,
    itemType: item.itemType,
    importance: item.importance,
    confidence: item.confidence,
    title: item.title,
    content: item.content,
  }));

  return `You are synthesizing CANONICAL SUBCHAPTER INTELLIGENCE for a private Greek B' Lykeiou Physics learning system.

COURSE: ${input.courseTitle}
CHAPTER: ${input.chapterLabel} ${input.chapterTitle}
SUBCHAPTER: ${input.subchapterLabel} ${input.subchapterTitle}

NON-NEGOTIABLE START / PHASE3 ARCHITECTURE:
- The official school book (sourceRole=official, layer=curriculum) alone defines formal curriculum and scope.
- Depth sources (e.g. Savvalas) reveal required depth, dependencies, reasoning, traps, misconceptions, combined concepts, difficult cases, strategies and teaching needs.
- IMPORTANCE and CURRICULUM STATUS are independent dimensions. importance=core means pedagogically mandatory knowledge for genuine understanding or future exercise solving. It does NOT mean official curriculum, and it MUST NOT be downgraded merely because it is an exercise-derived extension.
- Every sourceRole=depth finding with importance=core MUST survive the synthesis. It must be represented in the Depth or Teaching sections and MUST also appear in the START Brief so START is explicitly instructed to teach it.
- A core depth finding that goes beyond the formal school-book scope is still teaching material. Preserve and teach the useful Physics deeply enough for the student to understand the distinction and handle or recognize the corresponding exercise. Do not reduce it to a one-line exclusion merely because it is not official core theory.
- Depth sources MUST enrich how official theory will be taught, but MUST NOT create new formal curriculum outside what official findings support.
- scopeRelation is framing, never a filter and never a reason to discard knowledge.
- Assign scopeRelation using the official findings as the authority:
  * official_core = formal knowledge directly supported by official curriculum findings,
  * within_official_scope = depth that deepens or operationalizes official knowledge without extending formal curriculum,
  * exercise_extension = additional case, connection, strategy or deeper relation demanded by exercises and useful to teach, although not formal official core,
  * boundary_only = a distinction mainly needed to recognize where the current model stops or avoid mechanical misuse,
  * unclassified_depth = safety fallback only when the relation cannot be established confidently from the supplied findings.
- For importance=core, scopeRelation=exercise_extension or boundary_only does NOT make the finding optional. It still must be taught with enough physical WHY, contrast, recognition cue or example to make it useful.
- A core depth finding must not live only in scopeGuardrails. It must also be present in Depth/Teaching and in START Brief.
- Do NOT write a lesson. Do NOT produce student-facing prose. Do NOT solve exercises.
- This output is the structured brief that START will later consume to generate a lesson revision.
- Do not use external knowledge. Synthesize only the supplied structured findings.
- Every synthesized entry must cite sourceItemIds from the supplied findings. Never invent IDs.
- Avoid duplicates. Merge overlapping findings while retaining the strongest pedagogical meaning and ALL relevant sourceItemIds.

OUTPUT PURPOSE:
1. organize official curriculum cleanly,
2. map the complete depth required to truly understand and solve unfamiliar exercises,
3. preserve every pedagogically core depth finding even when it is an exercise extension,
4. capture misconceptions/traps and transfer reasoning,
5. identify what theory must explain more deeply,
6. create explicit scope framing without using scope as a deletion filter,
7. produce a START brief that explicitly carries every core depth sourceItemId forward to lesson generation.

SUPPLIED STRUCTURED FINDINGS:
${JSON.stringify(serialized)}
`;
}

function cleanEntry(raw: any, allowedIds: Set<string>): CanonicalEntry | null {
  const title = String(raw?.title ?? "").trim();
  const content = String(raw?.content ?? "").trim();
  const importance = String(raw?.importance ?? "");
  const rawScopeRelation = String(raw?.scopeRelation ?? "");
  const scopeRelation = SCOPE_RELATIONS.includes(rawScopeRelation as ScopeRelation)
    ? (rawScopeRelation as ScopeRelation)
    : "unclassified_depth";
  const sourceItemIds: string[] = Array.from(
    new Set<string>(
      (Array.isArray(raw?.sourceItemIds) ? raw.sourceItemIds : [])
        .map((value: unknown) => String(value))
        .filter((id: string) => allowedIds.has(id)),
    ),
  );
  if (!title || !content || sourceItemIds.length === 0) return null;
  if (!new Set(["core", "supporting", "advanced"]).has(importance)) return null;
  return {
    title: title.slice(0, 260),
    content: content.slice(0, 5000),
    importance: importance as Importance,
    scopeRelation,
    sourceItemIds,
  };
}

function cleanEntries(raw: unknown, allowedIds: Set<string>) {
  return (Array.isArray(raw) ? raw : [])
    .map((item) => cleanEntry(item, allowedIds))
    .filter((item): item is CanonicalEntry => Boolean(item));
}

function cleanContent(raw: any, allowedIds: Set<string>): SubchapterIntelligenceContent {
  const summary = String(raw?.summary ?? "").trim();
  if (!summary) throw new Error("Subchapter Intelligence returned an empty summary.");
  return {
    summary: summary.slice(0, 4000),
    curriculum: {
      conceptsDefinitionsQuantities: cleanEntries(
        raw?.curriculum?.conceptsDefinitionsQuantities,
        allowedIds,
      ),
      lawsFormulasAssumptions: cleanEntries(
        raw?.curriculum?.lawsFormulasAssumptions,
        allowedIds,
      ),
      prerequisitesAndBoundaries: cleanEntries(
        raw?.curriculum?.prerequisitesAndBoundaries,
        allowedIds,
      ),
    },
    depth: {
      dependenciesAndReasoning: cleanEntries(raw?.depth?.dependenciesAndReasoning, allowedIds),
      misconceptionsAndTraps: cleanEntries(raw?.depth?.misconceptionsAndTraps, allowedIds),
      combinationsContextsAndStrategies: cleanEntries(
        raw?.depth?.combinationsContextsAndStrategies,
        allowedIds,
      ),
    },
    teaching: {
      sequenceRequirements: cleanEntries(raw?.teaching?.sequenceRequirements, allowedIds),
      explanationRequirements: cleanEntries(raw?.teaching?.explanationRequirements, allowedIds),
      transferAndAssessmentRequirements: cleanEntries(
        raw?.teaching?.transferAndAssessmentRequirements,
        allowedIds,
      ),
    },
    scopeGuardrails: cleanEntries(raw?.scopeGuardrails, allowedIds),
    startBrief: {
      mustEstablishBeforeFormulas: cleanEntries(
        raw?.startBrief?.mustEstablishBeforeFormulas,
        allowedIds,
      ),
      mustExplainDeeply: cleanEntries(raw?.startBrief?.mustExplainDeeply, allowedIds),
      mustPrevent: cleanEntries(raw?.startBrief?.mustPrevent, allowedIds),
      mustTestForTransfer: cleanEntries(raw?.startBrief?.mustTestForTransfer, allowedIds),
    },
  };
}

function depthAndTeachingEntries(content: SubchapterIntelligenceContent) {
  return [
    ...content.depth.dependenciesAndReasoning,
    ...content.depth.misconceptionsAndTraps,
    ...content.depth.combinationsContextsAndStrategies,
    ...content.teaching.sequenceRequirements,
    ...content.teaching.explanationRequirements,
    ...content.teaching.transferAndAssessmentRequirements,
  ];
}

function startBriefEntries(content: SubchapterIntelligenceContent) {
  return [
    ...content.startBrief.mustEstablishBeforeFormulas,
    ...content.startBrief.mustExplainDeeply,
    ...content.startBrief.mustPrevent,
    ...content.startBrief.mustTestForTransfer,
  ];
}

function findEntryForSourceId(entries: CanonicalEntry[], sourceItemId: string) {
  return entries.find((entry) => entry.sourceItemIds.includes(sourceItemId)) || null;
}

function fallbackCoreDepthEntry(finding: SourceFinding): CanonicalEntry {
  return {
    title: finding.title.slice(0, 260),
    content: finding.content.slice(0, 5000),
    importance: "core",
    scopeRelation: "unclassified_depth",
    sourceItemIds: [finding.id],
  };
}

function addCoreDepthToTeaching(
  content: SubchapterIntelligenceContent,
  finding: SourceFinding,
  entry: CanonicalEntry,
) {
  if (finding.itemType === "misconception" || finding.itemType === "trap") {
    content.depth.misconceptionsAndTraps.push(entry);
    return;
  }
  if (
    finding.itemType === "combined_concepts" ||
    finding.itemType === "unusual_context" ||
    finding.itemType === "difficult_case" ||
    finding.itemType === "solution_strategy"
  ) {
    content.depth.combinationsContextsAndStrategies.push(entry);
    return;
  }
  if (finding.itemType === "teaching_implication" || finding.itemType === "teacher_emphasis") {
    content.teaching.explanationRequirements.push(entry);
    return;
  }
  content.depth.dependenciesAndReasoning.push(entry);
}

function ensureCoreDepthCoverage(
  content: SubchapterIntelligenceContent,
  findings: SourceFinding[],
) {
  const coreDepthFindings = findings.filter(
    (finding) => finding.sourceRole === "depth" && finding.importance === "core",
  );

  for (const finding of coreDepthFindings) {
    let teachingEntry = findEntryForSourceId(depthAndTeachingEntries(content), finding.id);
    if (!teachingEntry) {
      teachingEntry = fallbackCoreDepthEntry(finding);
      addCoreDepthToTeaching(content, finding, teachingEntry);
    }

    const startEntry = findEntryForSourceId(startBriefEntries(content), finding.id);
    if (!startEntry) {
      const briefEntry: CanonicalEntry = {
        ...teachingEntry,
        sourceItemIds: Array.from(new Set([...teachingEntry.sourceItemIds, finding.id])),
      };
      if (finding.itemType === "misconception" || finding.itemType === "trap") {
        content.startBrief.mustPrevent.push(briefEntry);
      } else {
        content.startBrief.mustExplainDeeply.push(briefEntry);
      }
    }
  }

  return content;
}

function countCoreDepthStartCoverage(
  content: SubchapterIntelligenceContent,
  findings: SourceFinding[],
) {
  const coveredIds = new Set(
    startBriefEntries(content).flatMap((entry) => entry.sourceItemIds),
  );
  const coreDepth = findings.filter(
    (finding) => finding.sourceRole === "depth" && finding.importance === "core",
  );
  return {
    coreDepthFindingCount: coreDepth.length,
    coreDepthStartBriefCoverage: coreDepth.filter((finding) => coveredIds.has(finding.id)).length,
  };
}

async function callOpenAI(prompt: string) {
  const apiKey = process.env.TEACHER;
  if (!apiKey) throw new Error("TEACHER is not configured for the Physics pipeline.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 410_000);
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
        input: [{ role: "user", content: [{ type: "input_text", text: prompt }] }],
        text: {
          format: {
            type: "json_schema",
            name: "physics_subchapter_intelligence",
            strict: true,
            schema: RESULT_SCHEMA,
          },
        },
      }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(
        payload?.error?.message || `Subchapter Intelligence failed with HTTP ${response.status}`,
      );
    }
    const output = getOutputText(payload);
    if (!output) throw new Error("Subchapter Intelligence returned an empty response.");
    return JSON.parse(output);
  } finally {
    clearTimeout(timeout);
  }
}

export async function runSubchapterIntelligence(versionId: string) {
  const sql = getSql();
  const view = await getSubchapterIntelligenceView(versionId);
  if (!view) throw new Error("Subchapter Intelligence version not found.");
  if (view.status === "current" || view.status === "superseded") return view;

  const findings = await listVersionFindings(versionId);
  const allowedIds = new Set(findings.map((item) => item.id));
  if (findings.length === 0) throw new Error("No ready structured findings are linked to this version.");
  if (!findings.some((item) => item.sourceRole === "official")) {
    throw new Error("Official curriculum source is missing from this version.");
  }

  const prompt = synthesisPrompt({
    courseTitle: view.courseTitle,
    chapterLabel: view.chapterNumberLabel || "",
    chapterTitle: view.chapterTitle,
    subchapterLabel: view.subchapterNumberLabel,
    subchapterTitle: view.subchapterTitle,
    findings,
  });

  try {
    const raw = await callOpenAI(prompt);
    const content = ensureCoreDepthCoverage(cleanContent(raw, allowedIds), findings);
    const coverage = countCoreDepthStartCoverage(content, findings);
    const payload = JSON.stringify(content);
    const diffSummary = JSON.stringify({
      kind: view.versionNumber === 1 ? "initial" : "revision",
      sourceCount: view.sources.length,
      findingCount: findings.length,
      ...coverage,
    });

    await sql`
      UPDATE physics.subchapter_intelligence_versions
      SET status = 'superseded'
      WHERE subchapter_id = ${view.subchapterId}::uuid
        AND status = 'current'
        AND id::text <> ${versionId}
    `;
    await sql`
      UPDATE physics.subchapter_intelligence_versions
      SET
        status = 'current',
        content = ${payload}::jsonb,
        diff_summary = ${diffSummary}::jsonb
      WHERE id::text = ${versionId}
        AND status = 'draft'
    `;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Subchapter Intelligence synthesis failed.";
    const errorContent = JSON.stringify({
      state: "error",
      errorMessage: message.slice(0, 1800),
      sourceCount: view.sources.length,
      findingCount: findings.length,
    });
    await sql`
      UPDATE physics.subchapter_intelligence_versions
      SET content = ${errorContent}::jsonb
      WHERE id::text = ${versionId}
        AND status = 'draft'
    `;
  }

  return getSubchapterIntelligenceView(versionId);
}

export async function getSubchapterIntelligenceView(
  versionId: string,
): Promise<SubchapterIntelligenceView | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      v.id::text,
      v.course_id::text,
      co.title AS course_title,
      v.chapter_id::text,
      c.number_label AS chapter_number_label,
      c.title AS chapter_title,
      v.subchapter_id::text,
      sc.number_label AS subchapter_number_label,
      sc.title AS subchapter_title,
      v.version_number,
      v.status,
      v.model,
      v.prompt_version,
      v.source_snapshot_hash,
      v.content
    FROM physics.subchapter_intelligence_versions v
    JOIN physics.courses co ON co.id = v.course_id
    JOIN physics.chapters c ON c.id = v.chapter_id
    JOIN physics.subchapters sc ON sc.id = v.subchapter_id
    WHERE v.id::text = ${versionId}
    LIMIT 1
  `;
  if (rows.length === 0) return null;
  const row = rows[0] as any;

  const sourceRows = await sql`
    SELECT
      a.id::text AS analysis_id,
      a.source_role,
      a.source_label,
      COUNT(ii.id)::int AS item_count
    FROM physics.subchapter_intelligence_version_sources vs
    JOIN physics.source_analyses a ON a.id = vs.analysis_id
    LEFT JOIN physics.intelligence_items ii ON ii.analysis_id = a.id AND ii.status = 'active'
    WHERE vs.version_id::text = ${versionId}
    GROUP BY a.id
    ORDER BY CASE a.source_role WHEN 'official' THEN 1 WHEN 'depth' THEN 2 ELSE 3 END
  `;

  const rawContent = (row.content || {}) as any;
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
    versionNumber: Number(row.version_number),
    status: row.status,
    model: String(row.model),
    promptVersion: String(row.prompt_version),
    sourceSnapshotHash: String(row.source_snapshot_hash),
    content: rawContent,
    errorMessage: rawContent?.state === "error" ? String(rawContent.errorMessage || "Unknown error") : null,
    sources: (sourceRows as any[]).map((source) => ({
      analysisId: String(source.analysis_id),
      sourceRole: String(source.source_role),
      sourceLabel: source.source_label ? String(source.source_label) : null,
      itemCount: Number(source.item_count ?? 0),
    })),
  };
}
