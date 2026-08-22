import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import {
  getMaterialBatchContext,
  registerSourceFile,
} from "@/lib/mixalis/source-files";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

type UploadPayload = {
  chapterId: string;
  batchId: string;
  originalName: string;
  sortOrder: number;
  sizeBytes?: number;
};

function parsePayload(value: string | null | undefined): UploadPayload {
  if (!value) throw new Error("Missing upload context.");
  const payload = JSON.parse(value) as Partial<UploadPayload>;

  if (
    !payload.chapterId ||
    !payload.batchId ||
    !payload.originalName ||
    typeof payload.sortOrder !== "number"
  ) {
    throw new Error("Invalid upload context.");
  }

  return {
    chapterId: payload.chapterId,
    batchId: payload.batchId,
    originalName: payload.originalName.slice(0, 255),
    sortOrder: Math.max(0, Math.floor(payload.sortOrder)),
    sizeBytes:
      typeof payload.sizeBytes === "number" && Number.isFinite(payload.sizeBytes)
        ? Math.max(0, Math.floor(payload.sizeBytes))
        : undefined,
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const session = await getMixalisSession();
        if (!session) throw new Error("Unauthorized.");

        const payload = parsePayload(clientPayload);
        const context = await getMaterialBatchContext(payload.batchId);
        if (!context || context.chapterId !== payload.chapterId) {
          throw new Error("Invalid material batch.");
        }

        const expectedPrefix = `mixalis/chapters/${payload.chapterId}/batches/${payload.batchId}/`;
        if (!pathname.startsWith(expectedPrefix) || pathname.includes("..")) {
          throw new Error("Invalid upload pathname.");
        }

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_FILE_SIZE,
          addRandomSuffix: true,
          allowOverwrite: false,
          tokenPayload: JSON.stringify(payload),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = parsePayload(tokenPayload);
        await registerSourceFile({
          batchId: payload.batchId,
          originalName: payload.originalName,
          storageKey: blob.pathname,
          contentType: blob.contentType,
          sizeBytes: payload.sizeBytes ?? null,
          sortOrder: payload.sortOrder,
        });
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 },
    );
  }
}
