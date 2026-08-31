import { after, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { runSavvalasSourceIntelligence } from "@/lib/mixalis/savvalas-source-intelligence";
import {
  createOfficialAnalysisFromRange,
  runOfficialSourceIntelligence,
} from "@/lib/mixalis/official-source-intelligence";
import { createCanonicalSubchapterIntelligenceVersion } from "@/lib/mixalis/canonical-subchapter-sources";
import { claimSubchapterIntelligenceRun } from "@/lib/mixalis/subchapter-intelligence-run-lock";
import { runSubchapterIntelligence } from "@/lib/mixalis/subchapter-intelligence";
import {
  createLessonRevisionFromIntelligence,
  runLessonRevision,
} from "@/lib/mixalis/start-lesson";

export const runtime = "nodejs";
export const maxDuration = 900;

type BuildState = {
  chapterId: string;
  savvalasRangeId: string | null;
  savvalasStatus: string;
  officialRangeId: string | null;
  officialAnalysisId: string | null;
  officialStatus: string;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

async function getBuildState(subchapterId: string): Promise<BuildState | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      sc.chapter_id::text AS chapter_id,
      savr.id::text AS savvalas_range_id,
      sav.status AS savvalas_status,
      offr.id::text AS official_range_id,
      offa.id::text AS official_analysis_id,
      offa.status AS official_status
    FROM physics.subchapters sc
    LEFT JOIN LATERAL (
      SELECT r.id
      FROM physics.source_ranges r
      JOIN physics.source_documents sd ON sd.id = r.document_id
      WHERE r.subchapter_id = sc.id
        AND sd.source_kind = 'savvalas_book'
        AND sd.status = 'ready'
      ORDER BY r.created_at DESC
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
      SELECT r.id
      FROM physics.source_ranges r
      JOIN physics.source_documents sd ON sd.id = r.document_id
      WHERE r.subchapter_id = sc.id
        AND sd.source_kind = 'school_book'
        AND sd.status = 'ready'
      ORDER BY r.created_at DESC
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
    WHERE sc.id::text = ${subchapterId}
      AND sc.status = 'active'
    LIMIT 1
  `;
  if (!rows.length) return null;
  const row = rows[0] as any;
  return {
    chapterId: String(row.chapter_id),
    savvalasRangeId: row.savvalas_range_id ? String(row.savvalas_range_id) : null,
    savvalasStatus: String(row.savvalas_status || "missing"),
    officialRangeId: row.official_range_id ? String(row.official_range_id) : null,
    officialAnalysisId: row.official_analysis_id ? String(row.official_analysis_id) : null,
    officialStatus: String(row.official_status || "missing"),
  };
}

function accepted(stage: string, message: string) {
  return NextResponse.json({ done: false, stage, message }, { status: 202 });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ subchapterId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subchapterId } = await params;
  try {
    const state = await getBuildState(subchapterId);
    if (!state) return NextResponse.json({ error: "Το υποκεφάλαιο δεν βρέθηκε." }, { status: 404 });
    if (!state.savvalasRangeId || !state.officialRangeId) {
      return NextResponse.json(
        { error: "Συμπλήρωσε πρώτα χειροκίνητα τις ORIGINAL PDF σελίδες για Σαββάλα και σχολικό βιβλίο." },
        { status: 409 },
      );
    }

    // 1. Depth Audit: only the manually supplied Savvalas range is sent for analysis.
    if (state.savvalasStatus !== "ready") {
      if (state.savvalasStatus !== "processing" && state.savvalasStatus !== "pending") {
        after(async () => {
          try {
            await runSavvalasSourceIntelligence(state.savvalasRangeId!);
          } catch (error) {
            console.error("One-click lesson build: Savvalas Depth failed", error);
          }
        });
      }
      return accepted("depth", state.savvalasStatus === "processing" ? "Αναλύεται το range του Σαββάλα…" : "Ξεκίνησε η ανάλυση του Σαββάλα…");
    }

    // 2. Official Intelligence: only the manually supplied official range is sent for analysis.
    let officialAnalysisId = state.officialAnalysisId;
    let officialStatus = state.officialStatus;
    if (!officialAnalysisId || officialStatus === "superseded") {
      const created = await createOfficialAnalysisFromRange(state.officialRangeId);
      officialAnalysisId = created.analysisId;
      officialStatus = "pending";
    }
    if (officialStatus !== "ready") {
      if (officialStatus !== "processing") {
        const analysisId = officialAnalysisId;
        after(async () => {
          try {
            await runOfficialSourceIntelligence(analysisId!);
          } catch (error) {
            console.error("One-click lesson build: Official Intelligence failed", error);
          }
        });
      }
      return accepted("official", officialStatus === "processing" ? "Αναλύεται η επίσημη ύλη…" : "Ξεκίνησε η ανάλυση της επίσημης ύλης…");
    }

    // 3. Canonical Intelligence: always resolve by source snapshot so a manual range edit cannot reuse stale knowledge.
    const canonical = await createCanonicalSubchapterIntelligenceVersion(subchapterId);
    let canonicalStatus = canonical.status;
    if (canonicalStatus === "superseded") {
      const sql = getSql();
      await sql`
        UPDATE physics.subchapter_intelligence_versions
        SET status = 'draft', updated_at = NOW()
        WHERE id::text = ${canonical.id}
          AND status = 'superseded'
      `;
      canonicalStatus = "draft";
    }
    if (canonicalStatus !== "current") {
      if (canonicalStatus !== "processing") {
        const claimed = await claimSubchapterIntelligenceRun(canonical.id);
        if (claimed) {
          after(async () => {
            try {
              await runSubchapterIntelligence(canonical.id);
            } catch (error) {
              console.error("One-click lesson build: Canonical Intelligence failed", error);
            }
          });
        }
      }
      return accepted("canonical", canonicalStatus === "processing" ? "Συντίθεται η γνώση του μαθήματος…" : "Ξεκίνησε η σύνθεση της γνώσης…");
    }

    // 4. START: create/reuse the revision linked to this exact canonical version and generate it automatically.
    const lesson = await createLessonRevisionFromIntelligence(canonical.id);
    let lessonStatus = lesson.status;
    if (lessonStatus === "superseded") {
      const sql = getSql();
      await sql`
        UPDATE physics.lesson_revisions
        SET status = 'draft', updated_at = NOW()
        WHERE id::text = ${lesson.id}
          AND status = 'superseded'
      `;
      lessonStatus = "draft";
    }
    if (lessonStatus !== "current") {
      if (lessonStatus !== "processing") {
        after(async () => {
          try {
            await runLessonRevision(lesson.id);
          } catch (error) {
            console.error("One-click lesson build: START generation failed", error);
          }
        });
      }
      return accepted("start", lessonStatus === "processing" ? "Δημιουργείται το START μάθημα…" : "Ξεκίνησε η δημιουργία του START μαθήματος…");
    }

    return NextResponse.json({
      done: true,
      stage: "done",
      message: "Το μάθημα είναι έτοιμο.",
      lessonRevisionId: lesson.id,
      lessonUrl: `/mixalis/lessons/${lesson.id}`,
    });
  } catch (error) {
    console.error("Mixalis one-click lesson build failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Η δημιουργία του μαθήματος απέτυχε." },
      { status: 500 },
    );
  }
}
