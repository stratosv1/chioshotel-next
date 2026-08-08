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
    return day
      .slice(0, 12)
      .map((stop) => {
        const raw = (stop && typeof stop === "object" ? stop : {}) as Record<string, unknown>;
        return {
          name: clean(raw.name).slice(0, 100),
          kind: clean(raw.kind).slice(0, 30),
          distanceKm: Number(raw.distanceKm) || 0,
          driveMin: Number(raw.driveMin) || 0,
          duration: clean(raw.duration).slice(0, 120),
        };
      })
      .filter((stop) => stop.name);
  });
}

function stopKindLabel(kind?: string) {
  if (kind === "beach") return "Παραλία";
  if (kind === "village") return "Χωριό";
  return kind || "Στάση";
}

function dayHtml(day: PlannerStop[], index: number): string {
  const stops = day.length
    ? day
        .map(
          (stop, stopIndex) => `
            <tr>
              <td style="padding:0 0 10px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #eadfd2;border-radius:14px;background:#ffffff;">
                  <tr>
                    <td width="44" valign="top" style="padding:14px 0 14px 14px;">
                      <div style="width:30px;height:30px;line-height:30px;text-align:center;border-radius:50%;background:#96704a;color:#ffffff;font-weight:700;font-size:12px;">${stopIndex + 1}</div>
                    </td>
                    <td style="padding:13px 14px 13px 10px;">
                      <div style="font-size:16px;line-height:21px;font-weight:700;color:#3f342b;">${escapeHtml(stop.name || "")}</div>
                      <div style="margin-top:5px;font-size:12px;line-height:18px;color:#8b7968;">
                        ${escapeHtml(stopKindLabel(stop.kind))}
                        ${stop.distanceKm ? ` &nbsp;•&nbsp; ${stop.distanceKm} km` : ""}
                        ${stop.driveMin ? ` &nbsp;•&nbsp; ~${stop.driveMin}′` : ""}
                      </div>
                      ${stop.duration ? `<div style="margin-top:4px;font-size:12px;line-height:18px;color:#a08d7b;">${escapeHtml(stop.duration)}</div>` : ""}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`,
        )
        .join("")
    : `<tr><td style="padding:6px 0 4px;font-size:13px;line-height:20px;color:#9a8877;">Δεν έχουν προστεθεί στάσεις σε αυτή την ημέρα.</td></tr>`;

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 22px 0;">
      <tr>
        <td style="padding:0 0 10px 0;">
          <span style="display:inline-block;padding:6px 10px;border-radius:999px;background:#f1e7da;color:#76583b;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;">Ημέρα ${index + 1}</span>
        </td>
      </tr>
      ${stops}
    </table>`;
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
    const aiRoomFinderUrl = "https://chioshotel.gr/ai-assistant/?lang=el";
    const bookingUrl = "https://chioshotel.gr/el/amesi-kratisi-voulamandis-house/";
    const roomsUrl = "https://chioshotel.gr/el/domatia-xios/";
    const heroImage = "https://chioshotel.gr/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp";

    await transporter.sendMail({
      from: `Voulamandis House <${smtpFrom}>`,
      to: email,
      replyTo: contactTo,
      subject: "Το προσωπικό σου πρόγραμμα για τη Χίο · Voulamandis House",
      text: [
        "Voulamandis House · Chios Trip Planner",
        "",
        `Το προσωπικό σου πρόγραμμα είναι έτοιμο: ${totalStops} στάσεις σε 3 ημέρες.`,
        `Εκτιμώμενη συνολική οδήγηση: περίπου ${totalDriveMin} λεπτά.`,
        "",
        ...days.flatMap((day, index) => [
          `Ημέρα ${index + 1}`,
          ...(day.length
            ? day.map((stop, stopIndex) => `${stopIndex + 1}. ${stop.name} · ${stopKindLabel(stop.kind)}${stop.driveMin ? ` · ~${stop.driveMin}′` : ""}`)
            : ["Δεν έχουν προστεθεί στάσεις."]),
          "",
        ]),
        "Βρες το δωμάτιο που ταιριάζει στο ταξίδι σου με το AI Room Finder:",
        aiRoomFinderUrl,
        "",
        "Voulamandis House · Κάμπος Χίου",
        "Mayor Kalvokoresi 117 · Kambos, Chios 82100",
        "+30 22710 31733 · chioshotel@gmail.com",
      ].join("\n"),
      html: `
        <!doctype html>
        <html lang="el">
          <body style="margin:0;padding:0;background:#f3eee7;font-family:Arial,Helvetica,sans-serif;color:#41362d;">
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Το προσωπικό σου πρόγραμμα για τη Χίο είναι έτοιμο. Δες τις στάσεις σου και βρες το δωμάτιο που ταιριάζει στο ταξίδι σου.</div>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3eee7;">
              <tr>
                <td align="center" style="padding:28px 12px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:700px;background:#fffdf9;border:1px solid #e6d9ca;border-radius:24px;overflow:hidden;box-shadow:0 12px 34px rgba(74,54,35,.08);">
                    <tr>
                      <td style="padding:22px 26px 16px;background:#fffdf9;border-bottom:1px solid #eee3d6;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td>
                              <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:26px;color:#34281f;">Voulamandis House</div>
                              <div style="margin-top:4px;font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:#9a7956;font-weight:700;">Κάμπος Χίου · Chios Trip Planner</div>
                            </td>
                            <td align="right" style="font-size:12px;color:#8e7d6c;">Το ταξίδι σου, οργανωμένο.</td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:30px 26px 20px;">
                        <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#9a7956;font-weight:700;">Το προσωπικό σου itinerary</div>
                        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:40px;margin:8px 0 10px;color:#30251d;font-weight:400;">Η Χίος σου, μέρα με τη μέρα</h1>
                        <p style="margin:0;max-width:590px;font-size:15px;line-height:24px;color:#75685c;">Οι στάσεις που επέλεξες είναι έτοιμες σε ένα καθαρό πρόγραμμα. Κράτησε αυτό το email μαζί σου όσο εξερευνάς το νησί.</p>

                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px;background:#f8f2e9;border-radius:16px;">
                          <tr>
                            <td align="center" width="50%" style="padding:15px;border-right:1px solid #e5d8c8;">
                              <div style="font-size:22px;font-weight:700;color:#503f31;">${totalStops}</div>
                              <div style="margin-top:3px;font-size:11px;color:#8d7b6a;">επιλεγμένες στάσεις</div>
                            </td>
                            <td align="center" width="50%" style="padding:15px;">
                              <div style="font-size:22px;font-weight:700;color:#503f31;">~${totalDriveMin}′</div>
                              <div style="margin-top:3px;font-size:11px;color:#8d7b6a;">εκτίμηση οδήγησης*</div>
                            </td>
                          </tr>
                        </table>

                        <div style="margin-top:26px;">${itineraryHtml}</div>
                        <p style="margin:0 0 6px;font-size:11px;line-height:18px;color:#a08f80;">* Οι χρόνοι είναι εκτιμήσεις σχεδιασμού από το Voulamandis House και όχι live navigation.</p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:0 18px 18px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#3f3025;border-radius:20px;overflow:hidden;">
                          <tr>
                            <td style="padding:0;">
                              <img src="${heroImage}" alt="Voulamandis House στον Κάμπο της Χίου" width="664" style="display:block;width:100%;max-width:664px;height:auto;border:0;">
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:26px 24px 24px;color:#fffaf4;">
                              <div style="font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:#d7ba94;font-weight:700;">Η βάση σου για να γνωρίσεις τη Χίο</div>
                              <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:29px;line-height:35px;margin:8px 0 10px;font-weight:400;color:#ffffff;">Μείνε στο Voulamandis House στον Κάμπο</h2>
                              <p style="margin:0;font-size:14px;line-height:23px;color:#eadfd3;">Έφτιαξες ήδη το πρόγραμμά σου. Τώρα βρες τη διαμονή που ταιριάζει στις ημέρες, την παρέα και τον τρόπο που θέλεις να ταξιδέψεις.</p>

                              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:18px;">
                                <tr>
                                  <td style="padding:5px 0;font-size:13px;line-height:20px;color:#f2e8de;">✓ Ήσυχο οικογενειακό κατάλυμα στον ιστορικό Κάμπο</td>
                                </tr>
                                <tr>
                                  <td style="padding:5px 0;font-size:13px;line-height:20px;color:#f2e8de;">✓ Κοντά σε Χώρα, αεροδρόμιο και παραλίες</td>
                                </tr>
                                <tr>
                                  <td style="padding:5px 0;font-size:13px;line-height:20px;color:#f2e8de;">✓ Κήπος, περιβόλια και πρωινό κατόπιν αιτήματος</td>
                                </tr>
                                <tr>
                                  <td style="padding:5px 0;font-size:13px;line-height:20px;color:#f2e8de;">✓ Απευθείας κράτηση με προσωπική επικοινωνία</td>
                                </tr>
                              </table>

                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px;">
                                <tr>
                                  <td style="border-radius:12px;background:#c69a63;">
                                    <a href="${aiRoomFinderUrl}" style="display:inline-block;padding:14px 18px;color:#241b15;text-decoration:none;font-size:14px;font-weight:700;">✨ Βρες το δωμάτιό σου με AI</a>
                                  </td>
                                  <td width="10"></td>
                                  <td style="border-radius:12px;border:1px solid #806b58;">
                                    <a href="${roomsUrl}" style="display:inline-block;padding:13px 16px;color:#fff8f0;text-decoration:none;font-size:13px;font-weight:700;">Δες τα δωμάτια</a>
                                  </td>
                                </tr>
                              </table>

                              <div style="margin-top:16px;padding-top:15px;border-top:1px solid #655244;font-size:12px;line-height:19px;color:#d8cabc;">Το AI Room Finder σε βοηθά να ελέγξεις ποια δωμάτια ταιριάζουν στις ημερομηνίες και στον αριθμό των επισκεπτών σου. Για απευθείας κράτηση μπορείς επίσης να <a href="${bookingUrl}" style="color:#e4c69f;font-weight:700;text-decoration:underline;">δεις διαθεσιμότητα εδώ</a>.</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:22px 26px 26px;text-align:center;border-top:1px solid #eee3d6;">
                        <div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#3c3027;">Voulamandis House</div>
                        <div style="margin-top:6px;font-size:12px;line-height:20px;color:#8f7f70;">Mayor Kalvokoresi 117 · Κάμπος, Χίος 82100<br>+30 22710 31733 · chioshotel@gmail.com</div>
                        <div style="margin-top:10px;font-size:11px;line-height:18px;color:#aa9a8b;">Έλαβες αυτό το email επειδή ζήτησες να σου σταλεί το προσωπικό σου Chios Trip Planner.</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>`,
    });

    if (body.wantsStayOffer && contactTo) {
      const leadText = days
        .map((day, index) => `Ημέρα ${index + 1}: ${day.map((stop) => stop.name).join(", ") || "-"}`)
        .join("\n");
      await transporter.sendMail({
        from: `Voulamandis House <${smtpFrom}>`,
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
