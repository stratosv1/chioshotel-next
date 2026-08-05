import { Buffer } from "node:buffer";
import chunk1 from "@/content/karfas-images/vertical-1";
import chunk2 from "@/content/karfas-images/vertical-2";

export const runtime = "nodejs";
export const dynamic = "force-static";

const image = Buffer.from(chunk1 + chunk2, "base64");

export async function GET() {
  return new Response(image, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(image.length),
      "Content-Type": "image/webp",
    },
  });
}
