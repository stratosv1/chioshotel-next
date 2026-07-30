import { NextRequest, NextResponse } from "next/server";
import { getSeoAdvisorActions, syncSeoAdvisorActions } from "@/lib/gsc/advisor-actions";
import { buildSeoDecisionContext } from "@/lib/gsc/advisor-context";
import { getSeoAdvisorWithIntentData } from "@/lib/gsc/advisor-intents";
import { interpretSeoAdvisorData } from "@/lib/gsc/advisor-interpretation";
import { saveSeoAdvisorSnapshot } from "@/lib/gsc/advisor-snapshots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const ANALYSIS_ANCHOR = "2026-07-30";
const ANALYSIS_INTERVAL_DAYS = 3;
const DEFAULT_SITE = "sc-domain:chioshotel.gr";
const ATHENS_TZ = "Europe/Athens";

function isAuthorized(request: NextRequest) {
  if (request.headers.get("user-agent") === "vercel-cron/1.0") return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const authorization = request.headers.get("authorization") || "";
  return authorization === `Bearer ${secret}`;
}

function localDateKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: ATHENS_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function utcDayNumber(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

function isDueDate(dateKey: string) {
  const delta = utcDayNumber(dateKey) - utcDayNumber(ANALYSIS_ANCHOR);
  return delta >= 0 && delta % ANALYSIS_INTERVAL_DAYS === 0;
}

function nextDueDate(dateKey: string) {
  let day = utcDayNumber(dateKey);
  const anchor = utcDayNumber(ANALYSIS_ANCHOR);
  if (day < anchor) day = anchor;
  while ((day - anchor) % ANALYSIS_INTERVAL_DAYS !== 0) day += 1;
  return new Date(day * 86_400_000).toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const today = localDateKey(new Date());
  const force = request.nextUrl.searchParams.get("force") === "1";
  const siteUrl = request.nextUrl.searchParams.get("site") || DEFAULT_SITE;
  if (!force && !isDueDate(today)) {
    return NextResponse.json({ ok: true, skipped: true, reason: "Not an analysis day", today, nextAnalysisDate: nextDueDate(today), intervalDays: ANALYSIS_INTERVAL_DAYS, anchorDate: ANALYSIS_ANCHOR });
  }

  const startedAt = Date.now();
  console.info("[gsc-analysis] start", { today, siteUrl, force });
  try {
    const [baseData, analysisContext, trackedActions] = await Promise.all([
      getSeoAdvisorWithIntentData(),
      buildSeoDecisionContext(siteUrl),
      getSeoAdvisorActions(siteUrl, 20),
    ]);
    const aiData = {
      ...baseData,
      seasonality: {
        ...(baseData.seasonality || {}),
        trackedActions,
      },
    };
    const interpretation = await interpretSeoAdvisorData(aiData, analysisContext);
    await syncSeoAdvisorActions(today, interpretation.findings, siteUrl);
    const data = { ...baseData, latestDate: analysisContext.latestCompleteDate || baseData.latestDate, analysisContext, aiInterpretation: interpretation };
    const snapshot = await saveSeoAdvisorSnapshot(today, data, siteUrl);

    console.info("[gsc-analysis] success", { durationMs: Date.now() - startedAt, ...snapshot, verdict: interpretation.verdict, healthScore: interpretation.healthScore, interpretedFindings: interpretation.findings.length, contextCoverage: analysisContext.coverage });
    return NextResponse.json({ ok: true, skipped: false, durationMs: Date.now() - startedAt, intervalDays: ANALYSIS_INTERVAL_DAYS, anchorDate: ANALYSIS_ANCHOR, nextAnalysisDate: nextDueDate(new Date((utcDayNumber(today) + 1) * 86_400_000).toISOString().slice(0, 10)), snapshot, interpretation: { verdict: interpretation.verdict, healthScore: interpretation.healthScore, headline: interpretation.headline, findingCount: interpretation.findings.length }, contextCoverage: analysisContext.coverage });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[gsc-analysis] failed", { durationMs: Date.now() - startedAt, message, stack: error instanceof Error ? error.stack : undefined });
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
