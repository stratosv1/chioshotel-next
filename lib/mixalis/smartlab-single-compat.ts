import { neon } from "@neondatabase/serverless";
import { SMARTLAB_PROMPT_REFERENCE, SMARTLAB_PROMPT_VERSION } from "@/lib/mixalis/smartlab-prompt";
import {
  getSingleSmartLabState as getBaseSingleSmartLabState,
  isSingleSmartLabRevision,
  runSingleSmartLabRevision,
  type SingleSmartLabPipelineState,
} from "@/lib/mixalis/smartlab-single";
import { getSmartLabRevisionView } from "@/lib/mixalis/smartlab";

function sqlClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing.");
  return neon(url);
}

/**
 * The original SMARTLAB table has a legacy unique index that allows only one
 * status='current' revision per chapter. Per-lesson LABs are independent, so
 * older successful single-LAB revisions are intentionally kept as
 * 'superseded' records and still count as the active saved LAB for their own
 * subchapter. Nothing is regenerated or deleted.
 */
export async function runSingleSmartLabRevisionCompat(revisionId: string) {
  const view = await getSmartLabRevisionView(revisionId);
  if (!view) throw new Error("SMARTLAB revision not found.");
  if (!isSingleSmartLabRevision(view)) throw new Error("This is not a per-subchapter SMARTLAB revision.");
  if (view.status === "current" || view.status === "superseded") return view;

  const sql = sqlClient();

  // Free the legacy one-current-per-chapter slot before promoting this LAB.
  // Previous LABs remain fully stored and are resolved per subchapter below.
  await sql`
    UPDATE physics.smartlab_revisions
    SET status = 'superseded', updated_at = now()
    WHERE chapter_id::text = ${view.chapterId}
      AND status = 'current'
      AND id::text <> ${revisionId}
  `;

  return runSingleSmartLabRevision(revisionId);
}

export async function getSingleSmartLabStateCompat(
  subchapterId: string,
): Promise<SingleSmartLabPipelineState | null> {
  const base = await getBaseSingleSmartLabState(subchapterId);
  if (!base) return null;

  const sql = sqlClient();
  const rows = await sql`
    SELECT sl.id::text AS lab_revision_id,
           sl.status AS lab_status,
           sl.prompt_reference,
           sl.prompt_version,
           sl.input_snapshot_hash,
           sl.smart_versions,
           sl.completed_at
    FROM physics.smartlab_revisions sl
    JOIN physics.subchapters sc ON sc.chapter_id = sl.chapter_id
    WHERE sc.id::text = ${subchapterId}
      AND sl.status IN ('current', 'superseded')
      AND sl.completed_at IS NOT NULL
      AND sl.input_snapshot_hash LIKE 'single:%'
      AND sl.prompt_reference = ${SMARTLAB_PROMPT_REFERENCE}
      AND jsonb_array_length(sl.smart_versions) = 1
      AND sl.smart_versions->0->>'subchapterId' = ${subchapterId}
    ORDER BY sl.revision_number DESC
    LIMIT 1
  `;

  if (!rows.length) {
    return {
      ...base,
      currentRevisionId: null,
      currentStatus: null,
      currentLessonRevisionId: null,
      upToDate: false,
    };
  }

  const row = rows[0] as any;
  const smartVersions = Array.isArray(row.smart_versions) ? row.smart_versions : [];
  const linkedLessonRevisionId = smartVersions[0]?.lessonRevisionId
    ? String(smartVersions[0].lessonRevisionId)
    : null;
  const promptMatches = String(row.prompt_version || "") === SMARTLAB_PROMPT_VERSION;
  const lessonMatches = Boolean(
    base.lessonRevisionId &&
      linkedLessonRevisionId &&
      linkedLessonRevisionId === base.lessonRevisionId,
  );

  return {
    ...base,
    currentRevisionId: String(row.lab_revision_id),
    currentStatus: String(row.lab_status) as SingleSmartLabPipelineState["currentStatus"],
    currentLessonRevisionId: linkedLessonRevisionId,
    upToDate: Boolean(promptMatches && lessonMatches),
  };
}

export async function listSingleSmartLabStatesByChapterCompat(
  chapterId: string,
): Promise<SingleSmartLabPipelineState[]> {
  const sql = sqlClient();
  const rows = await sql`
    SELECT id::text AS subchapter_id
    FROM physics.subchapters
    WHERE chapter_id::text = ${chapterId}
      AND status = 'active'
    ORDER BY sort_order, number_label
  `;

  const states = await Promise.all(
    rows.map((row: any) => getSingleSmartLabStateCompat(String(row.subchapter_id))),
  );
  return states.filter((state): state is SingleSmartLabPipelineState => Boolean(state));
}
