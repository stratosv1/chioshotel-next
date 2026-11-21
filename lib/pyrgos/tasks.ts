import "server-only";
import { getSql } from "./store";

// Πύργος ελέγχου · Βλάβες & εργασίες (owner, 2026-11-21).
// Faults, repairs and jobs per room (or for the whole house). Purely internal:
// nothing here touches Beds24 or availability.

import { TASK_KINDS, TASK_PRIORITIES, type PyrgosTask, type TaskKind, type TaskPriority, type TaskStatus } from "./task-types";

export { TASK_KINDS, TASK_PRIORITIES };
export type { PyrgosTask, TaskKind, TaskPriority, TaskStatus };

let ready = false;

async function ensureTasksTable() {
  if (ready) return;
  const sql = getSql();
  const rows = (await sql`select to_regclass('public.pyrgos_tasks') as t`) as { t: string | null }[];
  if (!rows[0]?.t) {
    await sql`create table if not exists public.pyrgos_tasks (
      id bigserial primary key,
      room int,
      kind text not null default 'job',
      title text not null,
      notes text,
      priority text not null default 'normal',
      due date,
      status text not null default 'open',
      created_at timestamptz not null default now(),
      done_at timestamptz
    )`;
  }
  ready = true;
}

function mapRow(row: any): PyrgosTask {
  return {
    id: Number(row.id),
    room: row.room === null || row.room === undefined ? null : Number(row.room),
    kind: row.kind,
    title: row.title,
    notes: row.notes ?? "",
    priority: row.priority,
    due: row.due ?? null,
    status: row.status,
    createdAt: row.created_at,
    doneAt: row.done_at ?? null,
  };
}

/** Open tasks (urgent first, then by due date) plus the last 60 days of finished ones. */
export async function listTasks(): Promise<PyrgosTask[]> {
  await ensureTasksTable();
  const rows = (await getSql()`
    select id, room, kind, title, notes, priority, to_char(due, 'YYYY-MM-DD') as due, status,
      to_char(created_at at time zone 'Europe/Athens', 'YYYY-MM-DD HH24:MI') as created_at,
      to_char(done_at at time zone 'Europe/Athens', 'YYYY-MM-DD HH24:MI') as done_at
    from public.pyrgos_tasks
    where status = 'open' or done_at > now() - interval '60 days'
    order by (status = 'open') desc,
      case priority when 'urgent' then 0 when 'normal' then 1 else 2 end,
      due asc nulls last, created_at desc
  `) as any[];
  return rows.map(mapRow);
}

export type TaskInput = {
  room: number | null;
  kind: TaskKind;
  title: string;
  notes: string;
  priority: TaskPriority;
  due: string | null;
};

export async function addTask(input: TaskInput) {
  await ensureTasksTable();
  const rows = (await getSql()`
    insert into public.pyrgos_tasks (room, kind, title, notes, priority, due)
    values (${input.room}, ${input.kind}, ${input.title}, ${input.notes || null}, ${input.priority}, ${input.due}::date)
    returning id
  `) as { id: number }[];
  return Number(rows[0]?.id);
}

export async function updateTask(id: number, input: TaskInput) {
  await ensureTasksTable();
  await getSql()`
    update public.pyrgos_tasks set room = ${input.room}, kind = ${input.kind}, title = ${input.title},
      notes = ${input.notes || null}, priority = ${input.priority}, due = ${input.due}::date
    where id = ${id}
  `;
}

export async function setTaskStatus(id: number, status: TaskStatus) {
  await ensureTasksTable();
  if (status === "done") {
    await getSql()`update public.pyrgos_tasks set status = 'done', done_at = now() where id = ${id}`;
  } else {
    await getSql()`update public.pyrgos_tasks set status = 'open', done_at = null where id = ${id}`;
  }
}

export async function deleteTask(id: number) {
  await ensureTasksTable();
  await getSql()`delete from public.pyrgos_tasks where id = ${id}`;
}
