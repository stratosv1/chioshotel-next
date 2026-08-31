import { neon } from "@neondatabase/serverless";
import { START_PROMPT_VERSION } from "@/lib/mixalis/start-prompt";
import { CANONICAL_SUBCHAPTER_INTELLIGENCE_PROMPT_VERSION } from "@/lib/mixalis/canonical-subchapter-sources";

export type CurrentLessonNavigation = {
  subchapterId: string;
  revisionId: string;
  revisionNumber: number;
  completedAt: string | null;
};

export type PhysicsPipelineNavigation = {
  subchapterId: string;
  savvalas: {
    rangeId: string | null;
    pageFrom: number | null;
    pageTo: number | null;
    status: string;
    analysisId: string | null;
  };
  official: {
    rangeId: string | null;
    pageFrom: number | null;
    pageTo: number | null;
    status: string;
    analysisId: string | null;
  };
  intelligence: {
    status: string;
    versionId: string | null;
    versionNumber: number | null;
    promptVersion: string | null;
    upToDate: boolean;
  };
  lesson: {
    status: string;
    revisionId: string | null;
    revisionNumber: number | null;
    intelligenceVersionId: string | null;
    promptVersion: string | null;
    upToDate: boolean;
  };
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

function mapCurrentLesson(row: any): CurrentLessonNavigation {
  return {
    subchapterId: String(row.subchapter_id),
    revisionId: String(row.revision_id),
    revisionNumber: Number(row.revision_number),
    completedAt: row.completed_at ? String(row.completed_at) : null,
  };
}

export async function listCurrentLessonsByChapter(chapterId: string): Promise<CurrentLessonNavigation[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      lr.subchapter_id::text AS subchapter_id,
      lr.id::text AS revision_id,
      lr.revision_number,
      lr.completed_at::text
    FROM physics.lesson_revisions lr
    WHERE lr.chapter_id::text = ${chapterId}
      AND lr.status = 'current'
    ORDER BY lr.revision_number DESC
  `;
  return rows.map(mapCurrentLesson);
}

export async function getCurrentLessonBySubchapter(subchapterId: string): Promise<CurrentLessonNavigation | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      lr.subchapter_id::text AS subchapter_id,
      lr.id::text AS revision_id,
      lr.revision_number,
      lr.completed_at::text
    FROM physics.lesson_revisions lr
    WHERE lr.subchapter_id::text = ${subchapterId}
      AND lr.status = 'current'
    ORDER BY lr.revision_number DESC
    LIMIT 1
  `;
  return rows.length > 0 ? mapCurrentLesson(rows[0]) : null;
}

function sourceStatus(value: unknown) {
  return String(value || "missing") || "missing";
}

export async function listPhysicsPipelineByChapter(chapterId: string): Promise<PhysicsPipelineNavigation[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      sc.id::text AS subchapter_id,
      savr.id::text AS savvalas_range_id,
      savr.file_page_from AS savvalas_page_from,
      savr.file_page_to AS savvalas_page_to,
      sav.id::text AS savvalas_analysis_id,
      sav.status AS savvalas_status,
      offr.id::text AS official_range_id,
      offr.file_page_from AS official_page_from,
      offr.file_page_to AS official_page_to,
      offa.id::text AS official_analysis_id,
      offa.status AS official_status,
      siv.id::text AS intelligence_version_id,
      siv.version_number AS intelligence_version_number,
      siv.status AS intelligence_status,
      siv.prompt_version AS intelligence_prompt_version,
      lr.id::text AS lesson_revision_id,
      lr.revision_number AS lesson_revision_number,
      lr.status AS lesson_status,
      lr.intelligence_version_id::text AS lesson_intelligence_version_id,
      lr.prompt_version AS lesson_prompt_version
    FROM physics.subchapters sc
    LEFT JOIN LATERAL (
      SELECT r.id, r.file_page_from, r.file_page_to
      FROM physics.source_ranges r
      JOIN physics.source_documents sd ON sd.id = r.document_id
      WHERE r.subchapter_id = sc.id
        AND sd.source_kind = 'savvalas_book'
        AND sd.status = 'ready'
      ORDER BY r.created_at DESC, r.file_page_from ASC
      LIMIT 1
    ) savr ON true
    LEFT JOIN LATERAL (
      SELECT a.id, a.status
      FROM physics.source_analyses a
      WHERE a.subchapter_id = sc.id
        AND a.source_role = 'depth'
        AND a.source_kind = 'source_range'
        AND a.source_range_id = savr.id
      ORDER BY
        CASE a.status WHEN 'ready' THEN 0 WHEN 'processing' THEN 1 WHEN 'pending' THEN 2 WHEN 'error' THEN 3 ELSE 4 END,
        a.created_at DESC
      LIMIT 1
    ) sav ON true
    LEFT JOIN LATERAL (
      SELECT r.id, r.file_page_from, r.file_page_to
      FROM physics.source_ranges r
      JOIN physics.source_documents sd ON sd.id = r.document_id
      WHERE r.subchapter_id = sc.id
        AND sd.source_kind = 'school_book'
        AND sd.status = 'ready'
      ORDER BY r.created_at DESC, r.file_page_from ASC
      LIMIT 1
    ) offr ON true
    LEFT JOIN LATERAL (
      SELECT a.id, a.status
      FROM physics.source_analyses a
      WHERE a.subchapter_id = sc.id
        AND a.source_role = 'official'
        AND a.source_kind = 'source_range'
        AND a.source_range_id = offr.id
      ORDER BY
        CASE a.status WHEN 'ready' THEN 0 WHEN 'processing' THEN 1 WHEN 'pending' THEN 2 WHEN 'error' THEN 3 ELSE 4 END,
        a.created_at DESC
      LIMIT 1
    ) offa ON true
    LEFT JOIN LATERAL (
      SELECT v.id, v.version_number, v.status, v.prompt_version
      FROM physics.subchapter_intelligence_versions v
      WHERE v.subchapter_id = sc.id
      ORDER BY
        CASE WHEN v.prompt_version = ${CANONICAL_SUBCHAPTER_INTELLIGENCE_PROMPT_VERSION} THEN 0 ELSE 1 END,
        CASE v.status WHEN 'current' THEN 0 WHEN 'processing' THEN 1 WHEN 'draft' THEN 2 WHEN 'error' THEN 3 ELSE 4 END,
        v.version_number DESC
      LIMIT 1
    ) siv ON true
    LEFT JOIN LATERAL (
      SELECT l.id, l.revision_number, l.status, l.intelligence_version_id, l.prompt_version
      FROM physics.lesson_revisions l
      WHERE l.subchapter_id = sc.id
      ORDER BY
        CASE
          WHEN l.intelligence_version_id = siv.id AND l.status = 'current' THEN 0
          WHEN l.intelligence_version_id = siv.id AND l.status = 'processing' THEN 1
          WHEN l.intelligence_version_id = siv.id THEN 2
          WHEN l.status = 'current' THEN 3
          ELSE 4
        END,
        l.revision_number DESC
      LIMIT 1
    ) lr ON true
    WHERE sc.chapter_id::text = ${chapterId}
      AND sc.status = 'active'
    ORDER BY sc.sort_order ASC, sc.number_label ASC
  `;

  return rows.map((row: any) => {
    const savvalasStatus = sourceStatus(row.savvalas_status);
    const officialStatus = sourceStatus(row.official_status);
    const intelligenceStatus = sourceStatus(row.intelligence_status);
    const lessonStatus = sourceStatus(row.lesson_status);
    const intelligenceVersionId = row.intelligence_version_id ? String(row.intelligence_version_id) : null;
    const intelligencePromptVersion = row.intelligence_prompt_version ? String(row.intelligence_prompt_version) : null;
    const intelligenceUpToDate =
      intelligenceStatus === "current" &&
      intelligencePromptVersion === CANONICAL_SUBCHAPTER_INTELLIGENCE_PROMPT_VERSION;
    const lessonRevisionId = row.lesson_revision_id ? String(row.lesson_revision_id) : null;
    const lessonIntelligenceVersionId = row.lesson_intelligence_version_id ? String(row.lesson_intelligence_version_id) : null;
    const lessonPromptVersion = row.lesson_prompt_version ? String(row.lesson_prompt_version) : null;
    const lessonUpToDate =
      intelligenceUpToDate &&
      lessonStatus === "current" &&
      Boolean(intelligenceVersionId) &&
      lessonIntelligenceVersionId === intelligenceVersionId &&
      lessonPromptVersion === START_PROMPT_VERSION;

    return {
      subchapterId: String(row.subchapter_id),
      savvalas: {
        rangeId: row.savvalas_range_id ? String(row.savvalas_range_id) : null,
        pageFrom: row.savvalas_page_from == null ? null : Number(row.savvalas_page_from),
        pageTo: row.savvalas_page_to == null ? null : Number(row.savvalas_page_to),
        status: savvalasStatus,
        analysisId: row.savvalas_analysis_id ? String(row.savvalas_analysis_id) : null,
      },
      official: {
        rangeId: row.official_range_id ? String(row.official_range_id) : null,
        pageFrom: row.official_page_from == null ? null : Number(row.official_page_from),
        pageTo: row.official_page_to == null ? null : Number(row.official_page_to),
        status: officialStatus,
        analysisId: row.official_analysis_id ? String(row.official_analysis_id) : null,
      },
      intelligence: {
        status: intelligenceStatus,
        versionId: intelligenceVersionId,
        versionNumber: row.intelligence_version_number == null ? null : Number(row.intelligence_version_number),
        promptVersion: intelligencePromptVersion,
        upToDate: intelligenceUpToDate,
      },
      lesson: {
        status: lessonStatus,
        revisionId: lessonRevisionId,
        revisionNumber: row.lesson_revision_number == null ? null : Number(row.lesson_revision_number),
        intelligenceVersionId: lessonIntelligenceVersionId,
        promptVersion: lessonPromptVersion,
        upToDate: lessonUpToDate,
      },
    };
  });
}

export async function getPhysicsPipelineBySubchapter(subchapterId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT chapter_id::text
    FROM physics.subchapters
    WHERE id::text = ${subchapterId}
      AND status = 'active'
    LIMIT 1
  `;
  if (!rows.length) return null;
  const chapterId = String((rows[0] as any).chapter_id);
  const pipelines = await listPhysicsPipelineByChapter(chapterId);
  return pipelines.find((item) => item.subchapterId === subchapterId) ?? null;
}
