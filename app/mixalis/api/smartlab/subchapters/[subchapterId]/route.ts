import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { createSingleSmartLabRevision } from "@/lib/mixalis/smartlab-single";

export const runtime = "nodejs";

function labPageErrorRedirect(request: Request, subchapterId: string) {
  const referer = request.headers.get("referer");
  if (!referer) return null;

  try {
    const requestUrl = new URL(request.url);
    const returnUrl = new URL(referer);
    const isLabPage = /^\/mixalis\/chapters\/[^/]+\/lab\/?$/.test(returnUrl.pathname);
    if (returnUrl.origin !== requestUrl.origin || !isLabPage) return null;

    returnUrl.searchParams.set("subchapter", subchapterId);
    returnUrl.searchParams.delete("revision");
    returnUrl.searchParams.set("labError", "creation_failed");
    return NextResponse.redirect(returnUrl, { status: 303 });
  } catch {
    return null;
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ subchapterId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subchapterId } = await params;
  try {
    const revision = await createSingleSmartLabRevision(subchapterId);
    const url = new URL(`/mixalis/chapters/${revision.chapterId}/lab`, request.url);
    url.searchParams.set("subchapter", subchapterId);
    url.searchParams.set("revision", revision.id);
    return NextResponse.redirect(url, { status: 303 });
  } catch (error) {
    console.error("Mixalis per-subchapter SMARTLAB creation failed", error);
    const redirect = labPageErrorRedirect(request, subchapterId);
    if (redirect) return redirect;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "SMARTLAB creation failed." },
      { status: 500 },
    );
  }
}
