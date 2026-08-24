import { after, NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import {
  claimSmartLabRun,
  getSmartLabRevisionView,
  runSmartLabRevision,
} from "@/lib/mixalis/smartlab-verified";

export const runtime = "nodejs";
export const maxDuration = 900;

const MAX_AUTOMATIC_ATTEMPTS = 3;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryable(message: string | null | undefined) {
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

async function runWithRetries(revisionId: string) {
  for (let attempt = 1; attempt <= MAX_AUTOMATIC_ATTEMPTS; attempt += 1) {
    try {
      const view = await runSmartLabRevision(revisionId);
      if (view.status === "current" || view.status === "superseded") return;
      if (!retryable(view.errorMessage) || attempt >= MAX_AUTOMATIC_ATTEMPTS) return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!retryable(message) || attempt >= MAX_AUTOMATIC_ATTEMPTS) return;
    }
    await sleep(1400 * 2 ** (attempt - 1));
    const claimed = await claimSmartLabRun(revisionId);
    if (!claimed) return;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ revisionId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { revisionId } = await params;
  const view = await getSmartLabRevisionView(revisionId);
  if (!view) return NextResponse.json({ error: "SMARTLAB revision not found." }, { status: 404 });
  return NextResponse.json({ status: view.status, view });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ revisionId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { revisionId } = await params;
  try {
    const claimed = await claimSmartLabRun(revisionId);
    const view = await getSmartLabRevisionView(revisionId);
    if (!view) return NextResponse.json({ error: "SMARTLAB revision not found." }, { status: 404 });

    if (claimed) {
      after(async () => {
        try {
          await runWithRetries(revisionId);
        } catch (error) {
          console.error("Mixalis background SMARTLAB generation failed", error);
        }
      });
    }

    return NextResponse.json({ accepted: claimed, status: view.status, view }, { status: claimed ? 202 : 200 });
  } catch (error) {
    console.error("Mixalis SMARTLAB generation failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "SMARTLAB generation failed." },
      { status: 500 },
    );
  }
}