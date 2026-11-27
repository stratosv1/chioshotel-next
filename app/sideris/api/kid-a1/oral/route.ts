import { getSiderisSession } from "@/lib/sideris/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const headers = {"Cache-Control":"private, no-store, max-age=0","Vary":"Cookie"};

export async function GET() {
  if (!(await getSiderisSession())) return Response.json({error:"Unauthorized"},{status:401,headers});
  try {
    const answers: unknown = JSON.parse(process.env.SIDERIS_KID_A1_ORAL_ANSWERS ?? "null");
    if (!Array.isArray(answers) || answers.length !== 32 || !answers.every(a=>a && typeof a.de==="string" && typeof a.el==="string")) {
      return Response.json({error:"Answers unavailable"},{status:503,headers});
    }
    return Response.json({answers},{headers});
  } catch {
    return Response.json({error:"Answers unavailable"},{status:503,headers});
  }
}
