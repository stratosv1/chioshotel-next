import { get } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { getMixalisSession } from "@/lib/mixalis/auth";
import {
  getCourseForSourceUpload,
  isPhysicsCourseCode,
  isPhysicsSourceDocumentKind,
  registerSavvalasBookDocument,
  registerSchoolBookDocument,
  type PhysicsCourseCode,
  type PhysicsSourceDocumentKind,
} from "@/lib/mixalis/source-documents";

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = ["application/pdf"];

const SOURCE_BOOKS: Record<
  PhysicsSourceDocumentKind,
  Record<PhysicsCourseCode, { title: string; pageCount: number | null }>
> = {
  school_book: {
    general_education: {
      title: "Φυσική Β΄ Λυκείου — Γενικής Παιδείας — Βιβλίο Μαθητή",
      pageCount: 210,
    },
    orientation: {
      title: "Φυσική Β΄ Λυκείου — Προσανατολισμού Θετικών Σπουδών — Βιβλίο Μαθητή",
      pageCount: 226,
    },
  },
  savvalas_book: {
    general_education: {
      title: "Σαββάλας — Φυσική Β΄ Λυκείου Γενικής Παιδείας",
      pageCount: null,
    },
    orientation: {
      title: "Σαββάλας — Φυσική Β΄ Λυκείου Προσανατολισμού",
      pageCount: null,
    },
  },
};

type UploadPayload = {
  courseCode: PhysicsCourseCode;
  sourceKind: PhysicsSourceDocumentKind;
  originalName: string;
  sizeBytes?: number;
};

function parsePayload(value: string | null | undefined): UploadPayload {
  if (!value) throw new Error("Missing upload context.");
  const payload = JSON.parse(value) as Partial<UploadPayload>;
  const sourceKind = payload.sourceKind || "school_book";

  if (
    !payload.courseCode ||
    !isPhysicsCourseCode(payload.courseCode) ||
    !isPhysicsSourceDocumentKind(sourceKind) ||
    !payload.originalName
  ) {
    throw new Error("Invalid upload context.");
  }

  return {
    courseCode: payload.courseCode,
    sourceKind,
    originalName: payload.originalName.slice(0, 255),
    sizeBytes:
      typeof payload.sizeBytes === "number" && Number.isFinite(payload.sizeBytes)
        ? Math.max(0, Math.floor(payload.sizeBytes))
        : undefined,
  };
}

async function readPrivatePdfPageCount(storageKey: string) {
  try {
    const result = await get(storageKey, { access: "private" });
    if (!result || result.statusCode !== 200) return null;
    const bytes = new Uint8Array(await new Response(result.stream).arrayBuffer());
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    return pdf.getPageCount();
  } catch (error) {
    console.error("Mixalis PDF page-count detection failed", error);
    return null;
  }
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

        const expectedPrefix = `mixalis/source-documents/${payload.courseCode}/${payload.sourceKind}/`;
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
        const book = SOURCE_BOOKS[payload.sourceKind][payload.courseCode];
        const detectedPageCount = await readPrivatePdfPageCount(blob.pathname);

        if (payload.sourceKind === "savvalas_book") {
          await registerSavvalasBookDocument({
            courseCode: payload.courseCode,
            title: book.title,
            originalName: payload.originalName,
            storageKey: blob.pathname,
            contentType: blob.contentType,
            sizeBytes: payload.sizeBytes ?? null,
            pageCount: detectedPageCount,
          });
          return;
        }

        await registerSchoolBookDocument({
          courseCode: payload.courseCode,
          title: book.title,
          originalName: payload.originalName,
          storageKey: blob.pathname,
          contentType: blob.contentType,
          sizeBytes: payload.sizeBytes ?? null,
          pageCount: detectedPageCount ?? book.pageCount ?? 0,
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
