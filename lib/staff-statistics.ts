import { neon } from "@neondatabase/serverless";

export type MonthlyMetric = { month: number; occupiedNights: number; capacityNights: number; bookings: number; charges: number };
export type RoomMetric = { room: number; occupiedNights: number; capacityNights: number; bookings: number; charges: number };
export type ChannelMetric = { channel: string; occupiedNights: number; bookings: number; charges: number };
export type SeasonSnapshot = {
  year: number;
  label: string;
  importedAt: string;
  sourceFilename: string | null;
  monthly: MonthlyMetric[];
  rooms: RoomMetric[];
  channels: ChannelMetric[];
};

const MONTHS = [4, 5, 6, 7, 8, 9, 10] as const;
const DAYS: Record<number, number> = { 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31 };
const ROOM_COUNT = 10;

const seedMonthly: Record<number, MonthlyMetric[]> = {
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

const seedRooms: Record<number, RoomMetric[]> = {
  2025: [
    [1,138,30,12888.94],[2,138,34,10383.15],[3,132,28,11846.99],[4,143,43,21593.5],[5,123,33,12547.03],
    [6,96,20,7471.68],[7,0,0,0],[8,129,26,12664.11],[9,120,23,11701.23],[10,121,24,11050.24],
  ].map(([room, occupiedNights, bookings, charges]) => ({ room, occupiedNights, capacityNights: 214, bookings, charges })),
  2026: [
    [1,127,30,12029.58],[2,137,31,9953.94],[3,116,23,10798.18],[4,112,21,9862.07],[5,114,27,10187.82],
    [6,109,28,8692.83],[7,116,25,9651.56],[8,116,23,11140.89],[9,118,24,12211.59],[10,106,20,11293.6],
  ].map(([room, occupiedNights, bookings, charges]) => ({ room, occupiedNights, capacityNights: 214, bookings, charges })),
};

const seedChannels: Record<number, ChannelMetric[]> = {
  2025: [
    { channel: "Απευθείας", bookings: 144, occupiedNights: 938, charges: 80553.6 },
    { channel: "Booking.com", bookings: 65, occupiedNights: 170, charges: 18739 },
    { channel: "Expedia / Hotels.com", bookings: 41, occupiedNights: 87, charges: 5888.37 },
    { channel: "Airbnb", bookings: 2, occupiedNights: 3, charges: 261.9 },
    { channel: "Άλλο", bookings: 9, occupiedNights: 50, charges: 6704 },
  ],
  2026: [
    { channel: "Απευθείας", bookings: 147, occupiedNights: 879, charges: 76193.6 },
    { channel: "Booking.com", bookings: 67, occupiedNights: 214, charges: 23440 },
    { channel: "Expedia / Hotels.com", bookings: 38, occupiedNights: 79, charges: 6188.46 },
  ],
};

function sqlClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing.");
  return neon(url);
}

export async function ensureStatisticsSchema() {
  const sql = sqlClient();
  await sql`create table if not exists staff_statistics_reports (
    id bigserial primary key,
    report_year integer not null,
    report_label text not null,
    source_filename text,
    imported_at timestamptz not null default now(),
    is_current boolean not null default true,
    raw_payload jsonb not null default '{}'::jsonb
  )`;
  await sql`create table if not exists staff_statistics_monthly (
    id bigserial primary key,
    report_id bigint not null references staff_statistics_reports(id) on delete cascade,
    month integer not null check (month between 4 and 10),
    occupied_nights integer not null default 0,
    capacity_nights integer not null default 0,
    bookings integer not null default 0,
    charges numeric(14,2) not null default 0,
    unique(report_id, month)
  )`;
  await sql`create index if not exists staff_statistics_reports_year_idx on staff_statistics_reports(report_year, imported_at desc)`;

  for (const year of [2025, 2026]) {
    const exists = await sql`select id, raw_payload from staff_statistics_reports where report_year = ${year} and is_current = true order by imported_at desc, id desc limit 1`;
    if (!exists.length) {
      const payload = { seededFromPreviousReports: true, rooms: seedRooms[year], channels: seedChannels[year] };
      const inserted = await sql`insert into staff_statistics_reports (report_year, report_label, source_filename, raw_payload)
        values (${year}, ${`Σεζόν ${year}`}, ${year === 2025 ? "payments (5).xls" : "payments (4).xls"}, ${JSON.stringify(payload)}::jsonb) returning id`;
      const reportId = Number(inserted[0].id);
      for (const row of seedMonthly[year]) {
        await sql`insert into staff_statistics_monthly (report_id, month, occupied_nights, capacity_nights, bookings, charges)
          values (${reportId}, ${row.month}, ${row.occupiedNights}, ${row.capacityNights}, ${row.bookings}, ${row.charges})`;
      }
    }
  }
}

export async function getCurrentSnapshots(): Promise<SeasonSnapshot[]> {
  await ensureStatisticsSchema();
  const sql = sqlClient();
  const reports = await sql`select distinct on (report_year) id, report_year, report_label, source_filename, imported_at, raw_payload
    from staff_statistics_reports where is_current = true order by report_year asc, imported_at desc, id desc`;
  const result: SeasonSnapshot[] = [];
  for (const report of reports as any[]) {
    const monthly = await sql`select month, occupied_nights, capacity_nights, bookings, charges
      from staff_statistics_monthly where report_id = ${report.id} order by month asc`;
    const raw = report.raw_payload && typeof report.raw_payload === "object" ? report.raw_payload : {};
    result.push({
      year: Number(report.report_year),
      label: String(report.report_label),
      sourceFilename: report.source_filename ? String(report.source_filename) : null,
      importedAt: new Date(report.imported_at).toISOString(),
      monthly: (monthly as any[]).map((row) => ({ month: Number(row.month), occupiedNights: Number(row.occupied_nights), capacityNights: Number(row.capacity_nights), bookings: Number(row.bookings), charges: Number(row.charges) })),
      rooms: Array.isArray(raw.rooms) ? raw.rooms : seedRooms[Number(report.report_year)] ?? [],
      channels: Array.isArray(raw.channels) ? raw.channels : seedChannels[Number(report.report_year)] ?? [],
    });
  }
  return result;
}

export async function saveSnapshot(input: { year: number; filename: string; monthly: MonthlyMetric[]; rooms: RoomMetric[]; channels: ChannelMetric[]; rawPayload?: unknown }) {
  await ensureStatisticsSchema();
  const sql = sqlClient();
  await sql`update staff_statistics_reports set is_current = false where report_year = ${input.year}`;
  const payload = { ...(input.rawPayload && typeof input.rawPayload === "object" ? input.rawPayload : {}), rooms: input.rooms, channels: input.channels };
  const inserted = await sql`insert into staff_statistics_reports (report_year, report_label, source_filename, raw_payload)
    values (${input.year}, ${`Σεζόν ${input.year}`}, ${input.filename}, ${JSON.stringify(payload)}::jsonb) returning id`;
  const reportId = Number(inserted[0].id);
  for (const month of MONTHS) {
    const row = input.monthly.find((item) => item.month === month) ?? { month, occupiedNights: 0, capacityNights: DAYS[month] * ROOM_COUNT, bookings: 0, charges: 0 };
    await sql`insert into staff_statistics_monthly (report_id, month, occupied_nights, capacity_nights, bookings, charges)
      values (${reportId}, ${month}, ${row.occupiedNights}, ${row.capacityNights}, ${row.bookings}, ${row.charges})`;
  }
  return reportId;
}
