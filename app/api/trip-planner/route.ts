import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type RateLimitEntry = { count: number; resetAt: number };
type GlobalWithTripPlannerRateLimit = typeof globalThis & {
  __tripPlannerRateLimit?: Map<string, RateLimitEntry>;
};

const globalStore = globalThis as GlobalWithTripPlannerRateLimit;
const rateLimitStore = globalStore.__tripPlannerRateLimit ?? new Map<string, RateLimitEntry>();
globalStore.__tripPlannerRateLimit = rateLimitStore;

type PlannerStop = {
  name?: string;
  kind?: string;
  distanceKm?: number;
  driveMin?: number;
  duration?: string;
};

type PlannerPayload = {
  email?: string;
  wantsStayOffer?: boolean;
  days?: PlannerStop[][];
  totalDriveMin?: number;
  website?: string;
};

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt <= now) rateLimitStore.delete(key);
  }
  const current = rateLimitStore.get(ip);
  if (!current || current.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  rateLimitStore.set(ip, current);
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function normalizeDays(days: unknown): PlannerStop[][] {
  if (!Array.isArray(days)) return [[], [], []];
  return days.slice(0, 3).map((day) => {
    if (!Array.isArray(day)) return [];
    return day.slice(0, 12).map((stop) => {
      const raw = (stop && typeof stop === "object" ? stop : {}) as Record<string, unknown>;
      return {
        name: clean(raw.name).slice(0, 100),
        kind: clean(raw.kind).slice(0, 30),
        distanceKm: Number(raw.distanceKm) || 0,
        driveMin: Number(raw.driveMin) || 0,
        duration: clean(raw.duration).slice(0, 120),
      };
    }).filter((stop) => stop.name);
  });
}

function dayHtml(day: PlannerStop[], index: number): string {
  const stops = day.length
    ? day.map((stop, stopIndex) => `
      <div style="padding:12px 0;border-bottom:1px solid #eee4d8;">
        <div style="font-weight:700;color:#3f342b;">${stopIndex + 1}. ${escapeHtml(stop.name || "")}</div>
        <div style="margin-top:4px;color:#817466;font-size:13px;">
          ${escapeHtml(stop.kind === "beach" ? "Παραλία" : stop.kind === "village" ? "Χωριό" : stop.kind || "Στάση")}
          ${stop.distanceKm ? ` · ${stop.distanceKm} km` : ""}
          ${stop.driveMin ? ` · ~${stop.driveMin}′` : ""}
        </div>
        ${stop.duration ? `<div style="margin-top:4px;color:#9a8877;font-size:12px;">${escapeHtml(stop.duration)}</div>` : ""}
      </div>`).join("")
    : `<div style="padding:12px 0;color:#9a8877;font-size:13px;">Δεν έχουν προστεθεί στάσεις.</div>`;

  return `
    <section style="margin:18px 0;padding:18px;border:1px solid #e6d9c8;border-radius:14px;background:#fffdf9;">
      <h2 style="margin:0 0 6px;color:#4b3a2b;font-size:18px;">Ημέρα ${index + 1}</h2>
      ${stops}
    </section>`;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
    }

    const body = (await request.json()) as PlannerPayload;
    if (clean(body.website)) return NextResponse.json({ ok: true });

    const email = clean(body.email).toLowerCase();
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    const days = normalizeDays(body.days);
    const totalStops = days.reduce((sum, day) => sum + day.length, 0);
    if (totalStops === 0) {
      return NextResponse.json({ ok: false, error: "Please add at least one stop to your plan." }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || "465");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    const contactTo = process.env.CONTACT_TO || "chioshotel@gmail.com";

    if (!smtpUser || !smtpPass || !smtpFrom) {
      return NextResponse.json({ ok: false, error: "Email service is not configured." }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const totalDriveMin = Math.max(0, Math.round(Number(body.totalDriveMin) || 0));
    const itineraryHtml = days.map(dayHtml).join("");
    const bookingUrl = "https://chioshotel.gr/el/amesi-kratisi-voulamandis-house/";
    const roomsUrl = "https://chioshotel.gr/el/domatia-xios/";

    await transporter.sendMail({
      from: smtpFrom,
      to: email,
      subject: "Το προσωπικό σου Chios Trip Planner",
      html: `
        <div style="font-family:Arial,sans-serif;background:#f7f2ea;padding:28px;color:#44382e;">
          <div style="max-width:680px;margin:0 auto;background:white;border-radius:20px;padding:28px;border:1px solid #e8ddcf;">
            <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#9a7956;font-weight:700;">Voulamandis House · Chios Trip Planner</div>
            <h1 style="font-family:Georgia,serif;font-size:30px;margin:10px 0 8px;color:#34281f;">Το πρόγραμμά σου για τη Χίο</h1>
            <p style="line-height:1.6;color:#75685c;">Κράτησε αυτό το email ως οδηγό για τις στάσεις που επέλεξες. Οι χρόνοι οδήγησης είναι εκτιμήσεις σχεδιασμού και όχι live navigation.</p>
            <div style="margin:14px 0;padding:12px 14px;background:#faf5ee;border-radius:12px;color:#6d5944;font-size:14px;"><strong>${totalStops}</strong> στάσεις · περίπου <strong>${totalDriveMin}′</strong> συνολικές εκτιμήσεις οδήγησης</div>
            ${itineraryHtml}
            <div style="margin-top:24px;padding:20px;border-radius:14px;background:#f5eadc;">
              <h2 style="font-family:Georgia,serif;margin:0 0 8px;color:#463426;">Κάνε το Voulamandis House βάση για το ταξίδι σου</h2>
              <p style="margin:0 0 14px;line-height:1.55;color:#735f4d;">Αν δεν έχεις ακόμη κλείσει διαμονή, μπορείς να δεις τα δωμάτιά μας στον Κάμπο και τις διαθέσιμες τιμές απευθείας.</p>
              <a href="${bookingUrl}" style="display:inline-block;background:#8f6f4f;color:white;text-decoration:none;padding:11px 16px;border-radius:10px;font-weight:700;margin-right:8px;">Έλεγχος διαθεσιμότητας</a>
              <a href="${roomsUrl}" style="display:inline-block;color:#765737;text-decoration:none;padding:11px 4px;font-weight:700;">Δες τα δωμάτια</a>
            </div>
            <p style="margin-top:22px;font-size:12px;line-height:1.5;color:#9a8b7d;">Σύντομα θα μπορείς να λαμβάνεις το ίδιο πρόγραμμα και ως PDF attachment. Το email αυτό περιέχει ήδη όλες τις επιλογές σου.</p>
          </div>
        </div>`,
    });

    if (body.wantsStayOffer && contactTo) {
      const leadText = days.map((day, index) => `Ημέρα ${index + 1}: ${day.map((stop) => stop.name).join(", ") || "-"}`).join("\n");
      await transporter.sendMail({
        from: smtpFrom,
        to: contactTo,
        replyTo: email,
        subject: `Trip Planner lead · ενδιαφέρον για διαμονή · ${email}`,
        text: [
          "Νέο lead από Chios Trip Planner",
          `Email: ${email}`,
          `Στάσεις: ${totalStops}`,
          `Εκτίμηση οδήγησης: ${totalDriveMin} λεπτά`,
          "Ο χρήστης επέλεξε: Θέλω πρόταση διαμονής στο Voulamandis House",
          "",
          leadText,
        ].join("\n"),
      });
    }

    return NextResponse.json({ ok: true, pdfAttachment: false });
  } catch (error) {
    console.error("Trip planner email error", error);
    return NextResponse.json({ ok: false, error: "Could not send your trip plan." }, { status: 500 });
  }
}
