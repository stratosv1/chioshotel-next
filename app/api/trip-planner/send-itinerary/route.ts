import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { dayTripAreaById } from "@/content/trip-planner/day-trips";
import { buildDayPlan, directionsUrl, type DayPlan } from "@/lib/trip-planner/day-plan";

export const runtime = "nodejs";

type Payload = {
  email?: unknown;
  website?: unknown;
  area?: unknown;
  date?: unknown;
  start?: unknown;
  picks?: unknown;
};

const KIND_LABEL = { beach: "Παραλία", village: "Χωριό", sight: "Αξιοθέατο", food: "Φαγητό", drink: "Ποτό" } as const;
const KIND_EMOJI = { beach: "🏖️", village: "🏘️", sight: "🏛️", food: "🍽️", drink: "🍷" } as const;

// Best-effort abuse protection (per server instance): the endpoint sends email
// to arbitrary addresses, so it must never become an open relay.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_IP = 5;
const MAX_PER_EMAIL = 3;
const hits = new Map<string, number[]>();

function limited(key: string, max: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

const clean = (value: unknown) => String(value ?? "").trim();
const validEmail = (email: string) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/.test(email);
const esc = (value: unknown) =>
  clean(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

function dayTitle(isoDate: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return "";
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("el-GR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}

function emailHtml(plan: DayPlan, day: string) {
  const stops = plan.stops
    .map((stop) => {
      const place = stop.place;
      return `
        <tr>
          <td style="padding:18px 0;border-bottom:1px solid #e7ded3">
            <div style="font-size:13px;font-weight:800;color:#9a7653">${esc(stop.arrive)}–${esc(stop.leave)} · ${KIND_EMOJI[place.kind]} ${KIND_LABEL[place.kind]} <span style="color:#a39486;font-weight:600">· 🚗 ~${stop.driveMin}′</span></div>
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:24px;line-height:1.15;color:#30261f;font-weight:700;margin-top:4px">${esc(place.name)}</div>
            <div style="font-size:14px;line-height:1.6;color:#75695f;font-weight:600;margin-top:5px">${esc(place.summary)}</div>
            ${place.detail ? `<div style="font-size:14px;line-height:1.6;color:#5f554d;margin-top:6px">${esc(place.detail)}</div>` : ""}
            <a href="${esc(directionsUrl(place))}" style="display:inline-block;margin-top:10px;color:#3f6b4f;font-size:14px;font-weight:800;text-decoration:none">📍 Οδηγίες στο Google Maps</a>
          </td>
        </tr>`;
    })
    .join("");

  return `<!doctype html>
<html lang="el">
  <body style="margin:0;padding:0;background:#f3eee6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#302820">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#f3eee6">
      <tr><td align="center" style="padding:18px 8px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:#ffffff">
          <tr><td style="background:#4c3b30;padding:28px 22px;color:#ffffff">
            <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#eadfce;font-weight:800">VOULAMANDIS HOUSE · CHIOS DAY PLANNER</div>
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:30px;line-height:1.1;font-weight:700;margin-top:10px">${esc(plan.area.title)}</div>
            <div style="margin-top:10px;font-size:14px;color:#f1e9df;font-weight:600">${esc(day)} · ξεκίνημα ${esc(plan.start)} · επιστροφή ~${esc(plan.returnAt)}</div>
          </td></tr>
          <tr><td style="padding:18px 20px 0">
            <a href="${esc(plan.routeUrl)}" style="display:block;text-align:center;background:#3f6b4f;color:#ffffff;text-decoration:none;padding:15px 18px;border-radius:12px;font-size:15px;font-weight:800">🗺️ Όλη η διαδρομή στο Google Maps</a>
          </td></tr>
          <tr><td style="padding:4px 20px 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${stops}</table></td></tr>
          <tr><td style="padding:16px 20px;color:#536044;font-size:13px;line-height:1.6;background:#eef2e7">
            Οι ώρες και οι χρόνοι οδήγησης είναι εκτιμήσεις. Έλεγξε ωράρια μουσείων/αξιοθέατων· η θάλασσα μπορεί να αλλάξει μέσα στην ημέρα.
          </td></tr>
          <tr><td align="center" style="padding:20px">
            <a href="https://wa.me/306944474226" style="display:inline-block;background:#eef4ea;color:#4e654f;text-decoration:none;padding:13px 17px;border-radius:12px;border:1px solid #b9c8b4;font-size:14px;font-weight:800">Ερώτηση στη reception (WhatsApp)</a>
            <div style="margin-top:14px;font-size:11px;color:#a09285">Voulamandis House · Κάμπος Χίου · Καλή εκδρομή! 🌿</div>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as Payload | null;
    if (!body) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

    // Honeypot: real visitors never fill this in. Pretend success for bots.
    if (clean(body.website)) return NextResponse.json({ ok: true });

    const email = clean(body.email).toLowerCase();
    if (!validEmail(email)) return NextResponse.json({ ok: false, error: "email" }, { status: 400 });

    const areaId = clean(body.area);
    const area = dayTripAreaById[areaId];
    const start = /^\d{2}:\d{2}$/.test(clean(body.start)) ? clean(body.start) : "10:00";
    const rawPicks = Array.isArray(body.picks) ? body.picks.slice(0, 8) : [];
    if (!area) return NextResponse.json({ ok: false, error: "plan" }, { status: 400 });

    // Only places that belong to the chosen trip are accepted (no free text reaches the email).
    const picks = area.slots.map((slot, index) => {
      const value = clean(rawPicks[index]);
      return slot.options.includes(value) ? value : null;
    });
    const plan = buildDayPlan(area.id, picks, start);
    if (!plan || !plan.stops.length) return NextResponse.json({ ok: false, error: "plan" }, { status: 400 });

    const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
    if (limited(`ip:${ip}`, MAX_PER_IP) || limited(`email:${email}`, MAX_PER_EMAIL)) {
      return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || "465");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    const contactTo = process.env.CONTACT_TO || "chioshotel@gmail.com";
    if (!smtpUser || !smtpPass || !smtpFrom) return NextResponse.json({ ok: false, error: "smtp" }, { status: 500 });

    const day = dayTitle(clean(body.date));
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: email,
      replyTo: contactTo,
      subject: `Η εκδρομή σου στη Χίο: ${plan.area.title}`,
      html: emailHtml(plan, day),
      text: [
        `${plan.area.title} — ${day}`,
        `Όλη η διαδρομή: ${plan.routeUrl}`,
        "",
        ...plan.stops.map((stop) => `${stop.arrive}–${stop.leave} ${stop.place.name} (${KIND_LABEL[stop.place.kind]})\n${directionsUrl(stop.place)}`),
        "",
        `Επιστροφή ~${plan.returnAt}`,
        "WhatsApp reception: https://wa.me/306944474226",
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Day planner email error", error);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
