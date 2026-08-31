import { neon } from "@neondatabase/serverless";
import { get } from "@vercel/blob";
import { getMixalisSession } from "@/lib/mixalis/auth";
import {
  isPhysicsCourseCode,
  isPhysicsSourceDocumentKind,
} from "@/lib/mixalis/source-documents";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

function contentDispositionFilename(name: string) {
  const fallback = name
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/["\\]/g, "_")
    .trim() || "physics-source.pdf";
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent(name)}`;
}

export async function GET(request: Request) {
  const session = await getMixalisSession();
  if (!session) {
    const login = new URL("/mixalis/login", request.url);
    login.searchParams.set("next", new URL(request.url).pathname + new URL(request.url).search);
    return Response.redirect(login, 303);
  }

  const url = new URL(request.url);
  const course = String(url.searchParams.get("course") || "");
  const kind = String(url.searchParams.get("kind") || "");

  if (!isPhysicsCourseCode(course) || !isPhysicsSourceDocumentKind(kind)) {
    return Response.json({ error: "Invalid Physics source document request." }, { status: 400 });
  }

  const sql = getSql();
  const rows = await sql`
    SELECT
      sd.storage_key,
      sd.original_name,
      sd.content_type
    FROM physics.source_documents sd
    JOIN physics.courses c ON c.id = sd.course_id
    WHERE c.code = ${course}
      AND sd.source_kind = ${kind}
      AND sd.status = 'ready'
    ORDER BY sd.updated_at DESC, sd.created_at DESC
    LIMIT 1
  `;

  if (rows.length === 0) {
    return Response.json({ error: "Το PDF δεν βρέθηκε στη Βιβλιοθήκη Πηγών." }, { status: 404 });
  }

  const row = rows[0] as {
    storage_key: string | null;
    original_name: string | null;
    content_type: string | null;
  };
  if (!row.storage_key) {
    return Response.json({ error: "Το PDF δεν έχει ενεργό storage key." }, { status: 404 });
  }

  const blob = await get(row.storage_key, { access: "private" });
  if (!blob || blob.statusCode !== 200 || !blob.stream) {
    return Response.json({ error: "Το ιδιωτικό PDF δεν μπόρεσε να φορτωθεί." }, { status: 502 });
  }

  const filename = row.original_name || `${course}-${kind}.pdf`;
  return new Response(blob.stream, {
    status: 200,
    headers: {
      "Content-Type": row.content_type || "application/pdf",
      "Content-Disposition": contentDispositionFilename(filename),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
