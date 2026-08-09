import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { beaches, villages } from "@/content/trip-planner";
import { plannerExtraPlaces } from "@/content/trip-planner/extra-places";

export const runtime = "nodejs";

type LeadGroup = { category: string; names: string[] };
type Payload = {
  email?: string;
  groups?: LeadGroup[];
  region?: string;
  accommodationConsent?: boolean;
};

type DetailRow = { label: string; value: string };
type ItineraryStop = {
  title: string;
  category: string;
  summary: string;
  rows: DetailRow[];
  tip?: string;
};

const categoryLabels: Record<string, string> = {
  "Παραλία": "Παραλία",
  "Χωριό": "Χωριό",
  "Αξιοθέατα": "Αξιοθέατο",
  "Φαγητό": "Φαγητό",
  "Ποτό": "Ποτό",
};

const categoryEmoji: Record<string, string> = {
  "Παραλία": "🏖️",
  "Χωριό": "🏘️",
  "Αξιοθέατο": "🏛️",
  "Φαγητό": "🍽️",
  "Ποτό": "🍸",
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function esc(value: unknown) {
  return clean(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function describePlace(name: string, category: string): ItineraryStop {
  const beach = beaches.find((item) => item.name === name);
  if (beach) {
    const rows: DetailRow[] = [];
    if (beach.surface?.length) rows.push({ label: "Ακτή", value: beach.surface.join(", ") });
    if (beach.organization) rows.push({ label: "Οργάνωση", value: beach.organization });
    if (beach.access?.length) rows.push({ label: "Πρόσβαση", value: beach.access.join(" · ") });
    if (beach.bestTime) rows.push({ label: "Καλύτερη ώρα", value: beach.bestTime });
    if (beach.recommendedDuration) rows.push({ label: "Χρόνος", value: beach.recommendedDuration });

    return {
      title: beach.name,
      category: "Παραλία",
      summary: beach.character?.length
        ? beach.character.join(" · ")
        : "Παραλία που ταιριάζει στο προσωπικό σου πλάνο.",
      rows,
      tip: beach.tip || undefined,
    };
  }

  const village = villages.find((item) => item.name === name);
  if (village) {
    const rows: DetailRow[] = [];
    if (village.highlights?.length) rows.push({ label: "Μην χάσεις", value: village.highlights.slice(0, 3).join(" · ") });
    if (village.access?.length) rows.push({ label: "Πρόσβαση", value: village.access.join(" · ") });
    if (village.bestTime) rows.push({ label: "Καλύτερη ώρα", value: village.bestTime });
    if (village.recommendedDuration) rows.push({ label: "Χρόνος", value: village.recommendedDuration });

    return {
      title: village.name,
      category: "Χωριό",
      summary: village.character?.length
        ? village.character.join(" · ")
        : "Χωριό που ταιριάζει στη διαδρομή σου.",
      rows,
      tip: village.localTip || undefined,
    };
  }

  const extra = plannerExtraPlaces.find((item) => item.name === name);
  if (extra) {
    const label = extra.category === "food" ? "Φαγητό" : extra.category === "drink" ? "Ποτό" : "Αξιοθέατο";
    return {
      title: extra.name,
      category: label,
      summary: extra.meta,
      rows: [],
    };
  }

  return {
    title: name,
    category: categoryLabels[category] ?? category,
    summary: "Στάση που επέλεξες στο προσωπικό σου Chios Trip Planner.",
    rows: [],
  };
}

function suggestedTime(index: number) {
  const minutes = 9 * 60 + 30 + index * 105;
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function rowsHtml(rows: DetailRow[]) {
  if (!rows.length) return "";

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;border-collapse:separate;border-spacing:0 7px">
      ${rows.map((row) => `
        <tr>
          <td style="width:118px;padding:0 12px 0 0;vertical-align:top;color:#9a7653;font-size:12px;line-height:1.5;font-weight:800;text-transform:uppercase;letter-spacing:.04em">${esc(row.label)}</td>
          <td style="padding:0;vertical-align:top;color:#5e554d;font-size:14px;line-height:1.55;font-weight:600">${esc(row.value)}</td>
        </tr>`).join("")}
    </table>`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;
    const email = clean(body.email).toLowerCase();
    const groups = Array.isArray(body.groups)
      ? body.groups
          .map((group) => ({ category: clean(group.category), names: Array.isArray(group.names) ? group.names.map(clean).filter(Boolean).slice(0, 12) : [] }))
          .filter((group) => group.category && group.names.length)
          .slice(0, 8)
      : [];

    if (!validEmail(email)) return NextResponse.json({ ok: false, error: "Βάλε ένα έγκυρο email." }, { status: 400 });
    if (!groups.length) return NextResponse.json({ ok: false, error: "Δεν βρέθηκαν επιλογές για το πρόγραμμα." }, { status: 400 });

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || "465");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    const contactTo = process.env.CONTACT_TO || "chioshotel@gmail.com";

    if (!smtpUser || !smtpPass || !smtpFrom) {
      return NextResponse.json({ ok: false, error: "Η υπηρεσία email δεν είναι διαθέσιμη αυτή τη στιγμή." }, { status: 500 });
    }

    const stops = groups.flatMap((group) => group.names.map((name) => describePlace(name, group.category)));
    const region = clean(body.region) || "Η διαδρομή που επέλεξες";

    const stopHtml = stops.map((stop, index) => {
      const emoji = categoryEmoji[stop.category] || "📍";
      return `
        <tr>
          <td style="padding:0 0 16px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7ded3;border-radius:18px;background:#fffdfa;border-collapse:separate;overflow:hidden">
              <tr>
                <td style="width:84px;padding:20px 10px 20px 18px;vertical-align:top">
                  <div style="display:inline-block;border-radius:999px;background:#edf0e5;color:#5f694b;padding:7px 10px;font-size:13px;line-height:1;font-weight:800">${suggestedTime(index)}</div>
                </td>
                <td style="padding:18px 20px 20px 4px;vertical-align:top">
                  <div style="font-size:11px;line-height:1.4;letter-spacing:.11em;text-transform:uppercase;color:#9a7653;font-weight:800">${emoji} ${esc(stop.category)}</div>
                  <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.16;color:#30261f;font-weight:700;margin-top:5px">${esc(stop.title)}</div>
                  <div style="font-size:14px;line-height:1.6;color:#75695f;font-weight:700;margin-top:6px">${esc(stop.summary)}</div>
                  ${rowsHtml(stop.rows)}
                  ${stop.tip ? `<div style="margin-top:14px;border-left:3px solid #c29b72;background:#f8f1e7;border-radius:0 10px 10px 0;padding:10px 12px;color:#62564d;font-size:13px;line-height:1.55"><strong style="color:#4d4138">Local tip:</strong> ${esc(stop.tip)}</div>` : ""}
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
    }).join("");

    const html = `<!doctype html>
<html lang="el">
  <body style="margin:0;padding:0;background:#f3eee6;font-family:Arial,Helvetica,sans-serif;color:#302820">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#f3eee6;margin:0;padding:0">
      <tr>
        <td align="center" style="padding:28px 12px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:700px;background:#ffffff;border-radius:24px;border-collapse:separate;overflow:hidden;box-shadow:0 16px 44px rgba(72,55,42,.10)">
            <tr>
              <td style="background:#4c3b30;padding:32px 30px 30px;color:#ffffff">
                <div style="font-size:11px;line-height:1.4;letter-spacing:.20em;text-transform:uppercase;color:#eadfce;font-weight:800">VOULAMANDIS HOUSE · CHIOS TRIP PLANNER</div>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:36px;line-height:1.08;font-weight:700;margin-top:11px">Το προσωπικό σου πρόγραμμα για τη Χίο</div>
                <div style="margin-top:14px;font-size:14px;line-height:1.6;color:#f1e9df;font-weight:600">${esc(region)} · ${stops.length} ${stops.length === 1 ? "στάση" : "στάσεις"}</div>
              </td>
            </tr>

            <tr>
              <td style="padding:26px 28px 8px">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate">
                  <tr>
                    <td style="padding:0">
                      <div style="font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.2;color:#342a23;font-weight:700">Η διαδρομή σου, οργανωμένη</div>
                      <div style="margin-top:8px;font-size:15px;line-height:1.7;color:#665b53;font-weight:600">Έβαλα τις επιλογές σου σε μια πρακτική σειρά για να έχεις ένα εύκολο σημείο εκκίνησης. Οι ώρες είναι ενδεικτικές — κράτα χρόνο για μπάνιο, φαγητό, φωτογραφίες και αυθόρμητες στάσεις.</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:12px 28px 6px">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${stopHtml}</table>
              </td>
            </tr>

            <tr>
              <td style="padding:8px 28px 24px">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:16px;background:#eef2e7">
                  <tr>
                    <td style="padding:17px 18px;color:#536044;font-size:14px;line-height:1.65;font-weight:600">
                      <strong style="color:#455036">✓ Πριν ξεκινήσεις:</strong> έλεγξε ωράρια για μουσεία και αξιοθέατα και χρησιμοποίησε Google Maps για live χρόνους οδήγησης. Για τις παραλίες, οι συνθήκες μπορεί να αλλάξουν μέσα στην ημέρα.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="border-top:1px solid #ece4da;background:#fbf8f4;padding:26px 28px 30px">
                <div style="font-size:11px;line-height:1.4;letter-spacing:.14em;text-transform:uppercase;color:#9a7653;font-weight:800">VOULAMANDIS HOUSE · ΚΑΜΠΟΣ ΧΙΟΥ</div>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:27px;line-height:1.15;font-weight:700;color:#332820;margin-top:7px">Δεν έχεις κλείσει ακόμη διαμονή;</div>
                <div style="font-size:14px;line-height:1.65;color:#6e6259;margin-top:9px;font-weight:600">Μείνε στον ήρεμο Κάμπο της Χίου και δες άμεσα ποιο δωμάτιο ταιριάζει στις ημερομηνίες σου ή μίλησε απευθείας μαζί μας.</div>

                <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:18px">
                  <tr>
                    <td style="padding:0 8px 8px 0">
                      <a href="https://chioshotel.gr/ai-assistant/?lang=el" style="display:inline-block;background:#737d58;color:#ffffff;text-decoration:none;padding:14px 19px;border-radius:12px;font-size:14px;font-weight:800">Δες διαθεσιμότητα</a>
                    </td>
                    <td style="padding:0 0 8px 0">
                      <a href="https://wa.me/306944474226" style="display:inline-block;background:#eef4ea;color:#4e654f;text-decoration:none;padding:13px 18px;border-radius:12px;border:1px solid #b9c8b4;font-size:14px;font-weight:800">WhatsApp</a>
                    </td>
                  </tr>
                </table>

                <div style="margin-top:13px;font-size:12px;line-height:1.55;color:#94877b">Το Voulamandis House είναι στον Κάμπο της Χίου. Κράτηση απευθείας, χωρίς μεσάζοντα.</div>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:18px 24px 22px;background:#ffffff;color:#a09285;font-size:11px;line-height:1.55">
                Το πρόγραμμα δημιουργήθηκε από το Chios Trip Planner του chioshotel.gr<br />Καλή εξερεύνηση της Χίου 🌿
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

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
      subject: "Το προσωπικό σου Chios Trip Plan είναι έτοιμο",
      html,
      text: `Το προσωπικό σου Chios Trip Plan\n\n${stops.map((stop, index) => `${suggestedTime(index)} — ${stop.title}\n${stop.summary}\n${stop.rows.map((row) => `${row.label}: ${row.value}`).join("\n")}${stop.tip ? `\nTip: ${stop.tip}` : ""}`).join("\n\n")}\n\nAI Room Finder: https://chioshotel.gr/ai-assistant/?lang=el\nWhatsApp: https://wa.me/306944474226`,
    });

    if (body.accommodationConsent && contactTo) {
      await transporter.sendMail({
        from: smtpFrom,
        to: contactTo,
        replyTo: email,
        subject: "Trip Planner lead — ζητά πρόταση διαμονής",
        text: `Email: ${email}\nΠλευρά: ${region}\nΕπιλογές: ${stops.map((stop) => stop.title).join(", ")}\n\nΟ επισκέπτης επέλεξε να λάβει προσωπική πρόταση διαμονής.`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Trip Planner itinerary email error", error);
    return NextResponse.json({ ok: false, error: "Δεν μπορέσαμε να στείλουμε το πρόγραμμα. Δοκίμασε ξανά." }, { status: 500 });
  }
}
