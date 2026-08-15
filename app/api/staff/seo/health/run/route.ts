import { NextRequest, NextResponse } from "next/server";
import { runWeeklySeoHealth } from "@/lib/seo-health/engine";
import {
  FULL_AUDIT_BATCH_SIZE,
  finalizeFullAuditSession,
  getOrCreateFullAuditSession,
  recordFullAuditBatch,
  seedSeoUrlsFromLiveSitemap,
} from "@/lib/seo-health/full-audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const SITE_URL = "sc-domain:chioshotel.gr";

function isAuthorized(request: NextRequest) {
  const expectedUser = process.env.STAFF_USERNAME;
  const expectedPass = process.env.STAFF_PASSWORD;
  if (!expectedUser || !expectedPass) return false;

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return false;

  try {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    return (
      separator > -1 &&
      decoded.slice(0, separator) === expectedUser &&
      decoded.slice(separator + 1) === expectedPass
    );
  } catch {
    return false;
  }
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return json({ ok: false, error: "Unauthorized" }, 401);
  if (!isSameOrigin(request)) return json({ ok: false, error: "Cross-origin request rejected" }, 403);

  try {
    const body = await request.json().catch(() => ({}));
    const requestedSessionId = typeof body?.sessionId === "string" ? body.sessionId : undefined;

    await seedSeoUrlsFromLiveSitemap();
    let session = await getOrCreateFullAuditSession(SITE_URL, requestedSessionId);

    if (session.status === "success") {
      return json({ ok: true, done: true, sessionId: session.id, session });
    }

    // If all batches were already persisted but a previous request failed during
    // aggregation/finalization, resume at finalization instead of running an
    // unnecessary extra batch and double-counting results.
    if (session.batchesTarget === 0 || session.batchesCompleted >= session.batchesTarget) {
      const finalized = await finalizeFullAuditSession(session.id);
      return json({ ok: true, done: true, sessionId: session.id, session: finalized });
    }

    const result = await runWeeklySeoHealth(request, {
      siteUrl: SITE_URL,
      limit: FULL_AUDIT_BATCH_SIZE,
    });

    session = await recordFullAuditBatch(session.id, result);
    const done = session.batchesCompleted >= session.batchesTarget;

    if (done) {
      const finalized = await finalizeFullAuditSession(session.id);
      return json({
        ok: true,
        done: true,
        sessionId: session.id,
        batch: result,
        session: finalized,
      });
    }

    return json({
      ok: true,
      done: false,
      sessionId: session.id,
      batch: result,
      session,
      progress: {
        batchesCompleted: session.batchesCompleted,
        batchesTarget: session.batchesTarget,
        inspected: session.inspected,
        totalUrls: session.totalUrls,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[seo-health] manual full audit batch failed", error);
    return json({ ok: false, error: message }, 500);
  }
}
