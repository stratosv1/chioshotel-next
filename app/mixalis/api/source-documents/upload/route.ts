import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import {
  getCourseForSourceUpload,
  isPhysicsCourseCode,
  registerSchoolBookDocument,
  type PhysicsCourseCode,
} from "@/lib/mixalis/source-documents";

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = ["application/pdf"];

const SCHOOL_BOOKS: Record<
  PhysicsCourseCode,
  { title: string; pageCount: number }
> = {
  general_education: {
    title: "Φυσική Β΄ Λυκείου — Γενικής Παιδείας — Βιβλίο Μαθητή",
    pageCount: 210,
  },
  orientation: {
    title: "Φυσική Β΄ Λυκείου — Προσανατολισμού Θετικών Σπουδών — Βιβλίο Μαθητή",
    pageCount: 226,
  },
};

type UploadPayload = {
  courseCode: PhysicsCourseCode;
  originalName: string;
  sizeBytes?: number;
};

function parsePayload(value: string | null | undefined): UploadPayload {
  if (!value) throw new Error("Missing upload context.");
  const payload = JSON.parse(value) as Partial<UploadPayload>;

  if (
    !payload.courseCode ||
    !isPhysicsCourseCode(payload.courseCode) ||
    !payload.originalName
  ) {
    throw new Error("Invalid upload context.");
  }

  return {
    courseCode: payload.courseCode,
    originalName: payload.originalName.slice(0, 255),
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
        const course = await getCourseForSourceUpload(payload.courseCode);
        if (!course) throw new Error("Physics course not found.");

        const expectedPrefix = `mixalis/source-documents/${payload.courseCode}/`;
        if (
          !pathname.startsWith(expectedPrefix) ||
          pathname.includes("..") ||
          !pathname.toLowerCase().endsWith(".pdf")
        ) {
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
        const book = SCHOOL_BOOKS[payload.courseCode];

        await registerSchoolBookDocument({
          courseCode: payload.courseCode,
          title: book.title,
          originalName: payload.originalName,
          storageKey: blob.pathname,
          contentType: blob.contentType,
          sizeBytes: payload.sizeBytes ?? null,
          pageCount: book.pageCount,
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
