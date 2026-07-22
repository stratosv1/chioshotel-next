import { neon } from "@neondatabase/serverless";

export type MonthlyMetric = {
  month: number;
  occupiedNights: number;
  capacityNights: number;
  bookings: number;
  charges: number;
};

export type SeasonSnapshot = {
  year: number;
  label: string;
  importedAt: string;
  sourceFilename: string | null;
  monthly: MonthlyMetric[];
};

const MONTHS = [4, 5, 6, 7, 8, 9, 10] as const;
const DAYS: Record<number, number> = { 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31 };
const ROOM_COUNT = 10;

const seed: Record<number, MonthlyMetric[]> = {
  2025: [
    { month: 4, occupiedNights: 114, capacityNights: 300, bookings: 31, charges: 9031.92 },
    { month: 5, occupiedNights: 92, capacityNights: 310, bookings: 36, charges: 9024.24 },
    { month: 6, occupiedNights: 226, capacityNights: 300, bookings: 28, charges: 15750.61 },
    { month: 7, occupiedNights: 227, capacityNights: 310, bookings: 72, charges: 30431.99 },
    { month: 8, occupiedNights: 249, capacityNights: 310, bookings: 74, charges: 36920.91 },
    { month: 9, occupiedNights: 230, capacityNights: 300, bookings: 19, charges: 10844.6 },
    { month: 10, occupiedNights: 2, capacityNights: 310, bookings: 1, charges: 142.6 },
  ],
  2026: [
    { month: 4, occupiedNights: 96, capacityNights: 300, bookings: 20, charges: 8136.24 },
    { month: 5, occupiedNights: 129, capacityNights: 310, bookings: 56, charges: 15550.06 },
    { month: 6, occupiedNights: 236, capacityNights: 300, bookings: 19, charges: 12395.2 },
    { month: 7, occupiedNights: 253, capacityNights: 310, bookings: 82, charges: 31113.26 },
    { month: 8, occupiedNights: 223, capacityNights: 310, bookings: 53, charges: 21984.39 },
    { month: 9, occupiedNights: 228, capacityNights: 300, bookings: 21, charges: 16362.91 },
    { month: 10, occupiedNights: 6, capacityNights: 310, bookings: 1, charges: 280 },
  ],
};

function sqlClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing.");
  return neon(url);
}

export async function ensureStatisticsSchema() {
  const sql = sqlClient();

  await sql`
    create table if not exists staff_statistics_reports (
      id bigserial primary key,
      report_year integer not null,
      report_label text not null,
      source_filename text,
      imported_at timestamptz not null default now(),
      is_current boolean not null default true,
      raw_payload jsonb not null default '{}'::jsonb
    )
  `;

  await sql`
    create table if not exists staff_statistics_monthly (
      id bigserial primary key,
      report_id bigint not null references staff_statistics_reports(id) on delete cascade,
      month integer not null check (month between 4 and 10),
      occupied_nights integer not null default 0,
      capacity_nights integer not null default 0,
      bookings integer not null default 0,
      charges numeric(14,2) not null default 0,
      unique(report_id, month)
    )
  `;

  await sql`create index if not exists staff_statistics_reports_year_idx on staff_statistics_reports(report_year, imported_at desc)`;

  for (const year of [2025, 2026]) {
    const exists = await sql`select id from staff_statistics_reports where report_year = ${year} limit 1`;
    if (exists.length) continue;

    const inserted = await sql`
      insert into staff_statistics_reports (report_year, report_label, source_filename, raw_payload)
      values (${year}, ${`Σεζόν ${year}`}, ${year === 2025 ? "payments (5).xls" : "payments (4).xls"}, ${JSON.stringify({ seededFromPreviousReports: true })}::jsonb)
      returning id
    `;
    const reportId = Number(inserted[0].id);

    for (const row of seed[year]) {
      await sql`
        insert into staff_statistics_monthly
          (report_id, month, occupied_nights, capacity_nights, bookings, charges)
        values
          (${reportId}, ${row.month}, ${row.occupiedNights}, ${row.capacityNights}, ${row.bookings}, ${row.charges})
      `;
    }
  }
}

export async function getCurrentSnapshots(): Promise<SeasonSnapshot[]> {
  await ensureStatisticsSchema();
  const sql = sqlClient();
  const reports = await sql`
    select distinct on (report_year)
      id, report_year, report_label, source_filename, imported_at
    from staff_statistics_reports
    where is_current = true
    order by report_year asc, imported_at desc, id desc
  `;

  const result: SeasonSnapshot[] = [];
  for (const report of reports as any[]) {
    const monthly = await sql`
      select month, occupied_nights, capacity_nights, bookings, charges
      from staff_statistics_monthly
      where report_id = ${report.id}
      order by month asc
    `;
    result.push({
      year: Number(report.report_year),
      label: String(report.report_label),
      sourceFilename: report.source_filename ? String(report.source_filename) : null,
      importedAt: new Date(report.imported_at).toISOString(),
      monthly: (monthly as any[]).map((row) => ({
        month: Number(row.month),
        occupiedNights: Number(row.occupied_nights),
        capacityNights: Number(row.capacity_nights),
        bookings: Number(row.bookings),
        charges: Number(row.charges),
      })),
    });
  }
  return result;
}

export async function saveSnapshot(input: {
  year: number;
  filename: string;
  monthly: MonthlyMetric[];
  rawPayload?: unknown;
}) {
  await ensureStatisticsSchema();
  const sql = sqlClient();
  await sql`update staff_statistics_reports set is_current = false where report_year = ${input.year}`;
  const inserted = await sql`
    insert into staff_statistics_reports (report_year, report_label, source_filename, raw_payload)
    values (${input.year}, ${`Σεζόν ${input.year}`}, ${input.filename}, ${JSON.stringify(input.rawPayload ?? {})}::jsonb)
    returning id
  `;
  const reportId = Number(inserted[0].id);

  for (const month of MONTHS) {
    const row = input.monthly.find((item) => item.month === month) ?? {
      month,
      occupiedNights: 0,
      capacityNights: DAYS[month] * ROOM_COUNT,
      bookings: 0,
      charges: 0,
    };
    await sql`
      insert into staff_statistics_monthly
        (report_id, month, occupied_nights, capacity_nights, bookings, charges)
      values
        (${reportId}, ${month}, ${row.occupiedNights}, ${row.capacityNights}, ${row.bookings}, ${row.charges})
    `;
  }

  return reportId;
}
