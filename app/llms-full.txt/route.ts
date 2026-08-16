import { buildLlmsFullTxt } from "@/lib/ai-discovery";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
