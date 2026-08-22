import { neon } from "@neondatabase/serverless";

export type CurrentLessonNavigation = {
  subchapterId: string;
  revisionId: string;
  revisionNumber: number;
  completedAt: string | null;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

export async function listCurrentLessonsByChapter(
  chapterId: string,
): Promise<CurrentLessonNavigation[]> {
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

  return rows.map((row: any) => ({
    subchapterId: String(row.subchapter_id),
    revisionId: String(row.revision_id),
    revisionNumber: Number(row.revision_number),
    completedAt: row.completed_at ? String(row.completed_at) : null,
  }));
}
