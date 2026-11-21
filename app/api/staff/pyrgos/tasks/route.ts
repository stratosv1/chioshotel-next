import { NextRequest, NextResponse } from "next/server";
import {
  addTask,
  deleteTask,
  listTasks,
  setTaskStatus,
  TASK_KINDS,
  TASK_PRIORITIES,
  updateTask,
  type TaskInput,
} from "@/lib/pyrgos/tasks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

const headers = { "Cache-Control": "no-store" };
const bad = (error: string) => NextResponse.json({ ok: false, error }, { status: 400, headers });

function parseInput(body: any): TaskInput | string {
  const title = String(body.title ?? "").replace(/\s+/g, " ").trim().slice(0, 140);
  if (!title) return "Γράψε τι χρειάζεται.";
  const room = body.room === null || body.room === "" || body.room === undefined ? null : Number(body.room);
  if (room !== null && (!Number.isInteger(room) || room < 1 || room > 11)) return "Μη έγκυρο δωμάτιο.";
  const kind = TASK_KINDS.includes(body.kind) ? body.kind : "job";
  const priority = TASK_PRIORITIES.includes(body.priority) ? body.priority : "normal";
  const due = typeof body.due === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.due) ? body.due : null;
  const notes = String(body.notes ?? "").trim().slice(0, 1000);
  return { room, kind, title, notes, priority, due };
}

export async function GET() {
  try {
    return NextResponse.json({ ok: true, tasks: await listTasks() }, { headers });
  } catch (error) {
    console.error("[pyrgos] tasks list failed", error);
    return NextResponse.json({ ok: false, error: "Δεν φόρτωσαν οι εργασίες." }, { status: 500, headers });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (body.action === "add" || body.action === "update") {
      const input = parseInput(body);
      if (typeof input === "string") return bad(input);
      if (body.action === "add") {
        return NextResponse.json({ ok: true, id: await addTask(input) }, { headers });
      }
      if (!Number.isInteger(id) || id < 1) return bad("Μη έγκυρη εργασία.");
      await updateTask(id, input);
      return NextResponse.json({ ok: true }, { headers });
    }

    if (!Number.isInteger(id) || id < 1) return bad("Μη έγκυρη εργασία.");

    if (body.action === "done" || body.action === "reopen") {
      await setTaskStatus(id, body.action === "done" ? "done" : "open");
      return NextResponse.json({ ok: true }, { headers });
    }
    if (body.action === "delete") {
      await deleteTask(id);
      return NextResponse.json({ ok: true }, { headers });
    }
    return bad("Άγνωστη ενέργεια.");
  } catch (error) {
    console.error("[pyrgos] tasks action failed", error);
    return NextResponse.json({ ok: false, error: "Η αποθήκευση απέτυχε." }, { status: 500, headers });
  }
}
