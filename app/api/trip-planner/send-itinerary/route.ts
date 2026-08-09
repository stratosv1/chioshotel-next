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

const categoryLabels: Record<string, string> = {
  "Παραλία": "Παραλία",
  "Χωριό": "Χωριό",
  "Αξιοθέατα": "Αξιοθέατο",
  "Φαγητό": "Φαγητό",
  "Ποτό": "Ποτό",
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

function describePlace(name: string, category: string) {
  const beach = beaches.find((item) => item.name === name);
  if (beach) {
    const detail = [
      beach.character?.length ? `Χαρακτήρας: ${beach.character.join(", ")}.` : "",
      beach.surface?.length ? `Ακτή: ${beach.surface.join(", ")}.` : "",
      beach.organization ? `Οργάνωση: ${beach.organization}.` : "",
      beach.access?.length ? `Πρόσβαση: ${beach.access.join(" · ")}.` : "",
      beach.bestTime ? `Καλύτερη ώρα: ${beach.bestTime}.` : "",
      beach.recommendedDuration ? `Προτεινόμενος χρόνος: ${beach.recommendedDuration}.` : "",
      beach.tip ? `Tip: ${beach.tip}` : "",
    ].filter(Boolean).join(" ");
    return { title: beach.name, category: "Παραλία", detail };
  }

  const village = villages.find((item) => item.name === name);
  if (village) {
    const detail = [
      village.character?.length ? `Χαρακτήρας: ${village.character.join(", ")}.` : "",
      village.highlights?.length ? `Μην χάσεις: ${village.highlights.slice(0, 3).join(" · ")}.` : "",
      village.access?.length ? `Πρόσβαση: ${village.access.join(" · ")}.` : "",
      village.bestTime ? `Καλύτερη ώρα: ${village.bestTime}.` : "",
      village.recommendedDuration ? `Προτεινόμενος χρόνος: ${village.recommendedDuration}.` : "",
      village.localTip ? `Local tip: ${village.localTip}` : "",
    ].filter(Boolean).join(" ");
    return { title: village.name, category: "Χωριό", detail };
  }

  const extra = plannerExtraPlaces.find((item) => item.name === name);
  if (extra) {
    const label = extra.category === "food" ? "Φαγητό" : extra.category === "drink" ? "Ποτό" : "Αξιοθέατο";
    return { title: extra.name, category: label, detail: extra.meta };
  }

  return { title: name, category: categoryLabels[category] ?? category, detail: "Στάση που επέλεξες στο προσωπικό σου Chios Trip Planner." };
}

function suggestedTime(index: number) {
  const minutes = 9 * 60 + 30 + index * 105;
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
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
    const region = clean(body.region) || "Η πλευρά που επέλεξες";

    const stopHtml = stops.map((stop, index) => `
      <tr><td style="padding:0 0 14px">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5ddd2;border-radius:16px;background:#fffdfa">
          <tr>
            <td style="width:72px;padding:16px 10px 16px 16px;vertical-align:top;color:#9a7653;font-weight:800;font-size:14px">${suggestedTime(index)}</td>
            <td style="padding:16px 16px 16px 4px;vertical-align:top">
              <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#8b806f;font-weight:800">${esc(stop.category)}</div>
              <div style="font-family:Georgia,serif;font-size:23px;line-height:1.15;color:#2f261f;font-weight:700;margin-top:4px">${esc(stop.title)}</div>
              <div style="font-size:14px;line-height:1.65;color:#675c53;font-weight:600;margin-top:8px">${esc(stop.detail)}</div>
            </td>
          </tr>
        </table>
      </td></tr>`).join("");

    const html = `<!doctype html><html><body style="margin:0;background:#f4efe7;font-family:Arial,sans-serif;color:#302820">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe7;padding:24px 10px"><tr><td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 16px 44px rgba(72,55,42,.12)">
          <tr><td style="background:#4b392d;padding:28px 28px 25px;color:white">
            <div style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#eadfce;font-weight:800">Voulamandis House · Chios Trip Planner</div>
            <div style="font-family:Georgia,serif;font-size:34px;line-height:1.08;font-weight:700;margin-top:10px">Το προσωπικό σου πρόγραμμα για τη Χίο</div>
            <div style="font-size:14px;line-height:1.6;color:#f2ebe3;margin-top:10px">${esc(region)} · ${stops.length} προτεινόμενες στάσεις</div>
          </td></tr>
          <tr><td style="padding:26px 26px 8px">
            <div style="font-size:15px;line-height:1.7;color:#62574f;font-weight:600">Οργάνωσα τις επιλογές σου σε μια πρακτική σειρά για να έχεις ένα εύκολο σημείο εκκίνησης. Οι ώρες είναι ενδεικτικές — άφησε χώρο για μπάνιο, φαγητό, φωτογραφίες και αυθόρμητες στάσεις.</div>
          </td></tr>
          <tr><td style="padding:12px 26px 6px"><table width="100%" cellpadding="0" cellspacing="0">${stopHtml}</table></td></tr>
          <tr><td style="padding:10px 26px 24px">
            <div style="border-radius:18px;background:#eef1e7;padding:18px;color:#536044;font-size:14px;line-height:1.65;font-weight:600"><strong>Πρακτικό tip:</strong> Πριν ξεκινήσεις, έλεγξε ωράρια για μουσεία/αξιοθέατα και χρησιμοποίησε Google Maps για live χρόνους οδήγησης. Για τις παραλίες, οι συνθήκες μπορούν να αλλάξουν μέσα στην ημέρα.</div>
          </td></tr>
          <tr><td style="border-top:1px solid #ece4da;padding:24px 26px 30px">
            <div style="font-family:Georgia,serif;font-size:25px;font-weight:700;color:#332820">Δεν έχεις κλείσει ακόμη διαμονή;</div>
            <div style="font-size:14px;line-height:1.6;color:#6e6259;margin-top:7px">Το Voulamandis House βρίσκεται στον ήρεμο Κάμπο της Χίου. Μπορείς να δεις διαθέσιμα δωμάτια με το AI Room Finder ή να μιλήσεις απευθείας μαζί μας.</div>
            <div style="margin-top:18px"><a href="https://chioshotel.gr/ai-assistant/?lang=el" style="display:inline-block;background:#78815c;color:white;text-decoration:none;padding:13px 18px;border-radius:12px;font-weight:800;margin-right:8px;margin-bottom:8px">Δες διαθεσιμότητα</a><a href="https://wa.me/306944474226" style="display:inline-block;background:#f0f3e9;color:#556044;text-decoration:none;padding:13px 18px;border-radius:12px;font-weight:800;margin-bottom:8px">WhatsApp</a></div>
          </td></tr>
        </table>
      </td></tr></table>
    </body></html>`;

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
      text: `Το προσωπικό σου Chios Trip Plan\n\n${stops.map((stop, index) => `${suggestedTime(index)} — ${stop.title}\n${stop.detail}`).join("\n\n")}\n\nAI Room Finder: https://chioshotel.gr/ai-assistant/?lang=el\nWhatsApp: https://wa.me/306944474226`,
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
