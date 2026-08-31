import { neon } from "@neondatabase/serverless";
import type { LessonFormula, StartLessonContent } from "@/lib/mixalis/start-lesson";
import {
  assertLessonFormulaContract,
  assertRuntimePhysicsFormulas,
} from "@/lib/mixalis/smartlab-physics-audit";
import { derivePhysicsImpactModel } from "@/lib/mixalis/smartlab-impact";
import {
  claimSmartLabRun,
  createSmartLabRevision as createBaseSmartLabRevision,
  getSmartLabChapterState,
  getSmartLabRevisionView,
  getCurrentSmartLabForChapter,
  runSmartLabRevision as runBaseSmartLabRevision,
} from "@/lib/mixalis/smartlab";
import type { SmartLabContent, SmartLabRevisionView, SmartLabWidget } from "@/lib/mixalis/smartlab-types";

export {
  claimSmartLabRun,
  getSmartLabChapterState,
  getSmartLabRevisionView,
  getCurrentSmartLabForChapter,
};
export type { SmartLabContent, SmartLabRevisionView } from "@/lib/mixalis/smartlab-types";

function sqlClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing.");
  return neon(url);
}

function lessonFormulas(content: unknown): LessonFormula[] {
  const formulas = (content as StartLessonContent | undefined)?.formulas;
  if (!Array.isArray(formulas)) return [];
  return formulas
    .map((formula: any) => ({
      expression: String(formula?.expression || "").trim(),
      readAs: String(formula?.readAs || "").trim(),
      physicalMeaning: String(formula?.physicalMeaning || "").trim(),
      conditions: String(formula?.conditions || "").trim(),
      sourceItemIds: Array.isArray(formula?.sourceItemIds) ? formula.sourceItemIds.map((id: unknown) => String(id)) : [],
    }))
    .filter((formula) => formula.expression);
}

async function assertCurrentLessonFormulaContracts(chapterId: string) {
  const sql = sqlClient();
  const rows = await sql`
    SELECT sc.number_label, sc.title, lr.content
    FROM physics.subchapters sc
    JOIN LATERAL (
      SELECT content
      FROM physics.lesson_revisions
      WHERE subchapter_id = sc.id AND status = 'current'
      ORDER BY revision_number DESC
      LIMIT 1
    ) lr ON true
    WHERE sc.chapter_id::text = ${chapterId}
      AND sc.status = 'active'
    ORDER BY sc.sort_order, sc.number_label
  `;

  for (const row of rows as any[]) {
    const title = String(row.title || "");
    const lower = title.toLocaleLowerCase("el-GR");
    if (!lower.includes("οριζόντια βολή") && !lower.includes("ομαλή κυκλική κίνηση")) continue;
    const formulas = lessonFormulas(row.content);
    if (!formulas.length) {
      throw new Error(`SMARTLAB formula verification cannot run: ${String(row.number_label)} ${title} has no lesson formulas.`);
    }
    assertLessonFormulaContract(title, formulas);
  }
}

function assertRendererContract(subchapterTitle: string, widget: SmartLabWidget) {
  const lower = subchapterTitle.toLocaleLowerCase("el-GR");

  if (lower.includes("κεντρομόλος δύναμη")) {
    if (widget.physicsPreset !== "centripetal_force") {
      throw new Error(`SMARTLAB renderer audit failed for '${subchapterTitle}': centripetal_force renderer is required.`);
    }

    const roles = new Set(widget.quantities.map((quantity) => quantity.physicsRole));
    if (!roles.has("centripetal_force")) {
      throw new Error(`SMARTLAB renderer audit failed for '${subchapterTitle}': centripetal_force quantity is missing.`);
    }
    if (!roles.has("radius")) {
      throw new Error(`SMARTLAB renderer audit failed for '${subchapterTitle}': radius quantity is missing.`);
    }

    const forceQuantity = widget.quantities.find((quantity) => quantity.physicsRole === "centripetal_force");
    if (forceQuantity && widget.controls.some((control) => control.quantityId === forceQuantity.id)) {
      throw new Error(`SMARTLAB renderer audit failed for '${subchapterTitle}': centripetal force cannot be an independent control.`);
    }

    const speedDrivers = widget.controls.filter((control) =>
      control.role === "angular_speed" || control.role === "linear_speed" || control.role === "frequency",
    );
    if (speedDrivers.length !== 1) {
      throw new Error(`SMARTLAB renderer audit failed for '${subchapterTitle}': exactly one speed driver is required.`);
    }
  }
}

function verifiedContent(view: SmartLabRevisionView): SmartLabContent {
  const content = view.content as SmartLabContent;
  if (!content || !Array.isArray(content.subchapters)) {
    throw new Error("SMARTLAB numerical verification cannot run because generated content is missing.");
  }

  return {
    ...content,
    subchapters: content.subchapters.map((section) => ({
      ...section,
      widgets: section.widgets.map((widget) => {
        assertRendererContract(section.subchapterTitle, widget);
        assertRuntimePhysicsFormulas(widget);
        return {
          ...widget,
          impactModel: derivePhysicsImpactModel(widget),
        };
      }),
    })),
  };
}

async function persistVerifiedContent(view: SmartLabRevisionView, content: SmartLabContent) {
  const sql = sqlClient();
  await sql`
    UPDATE physics.smartlab_revisions
    SET content = ${JSON.stringify(content)}::jsonb,
        error_message = NULL,
        updated_at = now()
    WHERE id::text = ${view.id}
  `;
}

async function failVerificationAndRestore(view: SmartLabRevisionView, error: unknown) {
  const sql = sqlClient();
  const message = error instanceof Error ? error.message : String(error);
  await sql`
    UPDATE physics.smartlab_revisions
    SET status = 'error', error_message = ${message}, updated_at = now()
    WHERE id::text = ${view.id}
  `;
  await sql`
    UPDATE physics.smartlab_revisions
    SET status = 'current', updated_at = now()
    WHERE id = (
      SELECT id
      FROM physics.smartlab_revisions
      WHERE chapter_id::text = ${view.chapterId}
        AND status = 'superseded'
        AND id::text <> ${view.id}
      ORDER BY revision_number DESC
      LIMIT 1
    )
  `;
}

export async function createSmartLabRevision(chapterId: string) {
  // Formulas are verification input only and are never sent to the SMARTLAB AI prompt.
  await assertCurrentLessonFormulaContracts(chapterId);
  return createBaseSmartLabRevision(chapterId);
}

export async function runSmartLabRevision(revisionId: string) {
  const before = await getSmartLabRevisionView(revisionId);
  if (!before) throw new Error("SMARTLAB revision not found.");

  // Always verify the current START lesson formulas before generation or reuse.
  await assertCurrentLessonFormulaContracts(before.chapterId);

  const view = await runBaseSmartLabRevision(revisionId);
  if (view.status !== "current" && view.status !== "superseded") return view;

  try {
    // Every generated or reused widget must pass deterministic renderer and numerical identities.
    // The impact list is then recalculated from real before/after physics states, never trusted from AI.
    const content = verifiedContent(view);
    await persistVerifiedContent(view, content);
    return (await getSmartLabRevisionView(revisionId)) || view;
  } catch (error) {
    await failVerificationAndRestore(view, error);
    throw error;
  }
}
