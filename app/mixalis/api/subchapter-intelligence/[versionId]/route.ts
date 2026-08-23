import { after, NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { claimSubchapterIntelligenceRun } from "@/lib/mixalis/subchapter-intelligence-run-lock";
import {
  getSubchapterIntelligenceView,
  runSubchapterIntelligence,
} from "@/lib/mixalis/subchapter-intelligence";

export const runtime = "nodejs";
export const maxDuration = 420;

const MAX_AUTOMATIC_ATTEMPTS = 3;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableSynthesisError(message: string | null | undefined) {
  const value = String(message || "").toLowerCase();
  return [
    "fetch failed",
    "network",
    "econnreset",
    "socket",
    "und_err",
    "timed out",
    "timeout",
    "aborted",
    "http 408",
    "http 429",
    "http 500",
    "http 502",
    "http 503",
    "http 504",
  ].some((needle) => value.includes(needle));
}

async function runWithAutomaticRetries(versionId: string) {
  for (let attempt = 1; attempt <= MAX_AUTOMATIC_ATTEMPTS; attempt += 1) {
    const view = await runSubchapterIntelligence(versionId);
    if (!view || view.status === "current" || view.status === "superseded") return;

    const errorMessage = view.errorMessage;
    if (!isRetryableSynthesisError(errorMessage) || attempt >= MAX_AUTOMATIC_ATTEMPTS) return;

    await sleep(1200 * 2 ** (attempt - 1));
    const reclaimed = await claimSubchapterIntelligenceRun(versionId);
    if (!reclaimed) return;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ versionId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { versionId } = await params;
  try {
    const view = await getSubchapterIntelligenceView(versionId);
    if (!view) {
      return NextResponse.json({ error: "Subchapter Intelligence version not found." }, { status: 404 });
    }
    return NextResponse.json({ status: view.status, view });
  } catch (error) {
    console.error("Mixalis subchapter intelligence status failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Subchapter Intelligence status failed." },
      { status: 500 },
    );
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ versionId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { versionId } = await params;
  try {
    const claimed = await claimSubchapterIntelligenceRun(versionId);

    if (!claimed) {
      const existing = await getSubchapterIntelligenceView(versionId);
      if (!existing) {
        return NextResponse.json({ error: "Subchapter Intelligence version not found." }, { status: 404 });
      }
      return NextResponse.json({ accepted: false, status: existing.status, view: existing });
    }

    const acceptedView = await getSubchapterIntelligenceView(versionId);
    if (!acceptedView) {
      return NextResponse.json({ error: "Subchapter Intelligence version not found." }, { status: 404 });
    }

    after(async () => {
      try {
        await runWithAutomaticRetries(versionId);
      } catch (error) {
        console.error("Mixalis background subchapter intelligence synthesis failed", error);
      }
    });

    return NextResponse.json(
      { accepted: true, status: acceptedView.status, view: acceptedView },
      { status: 202 },
    );
  } catch (error) {
    console.error("Mixalis subchapter intelligence synthesis failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Subchapter Intelligence synthesis failed." },
      { status: 500 },
    );
  }
}
