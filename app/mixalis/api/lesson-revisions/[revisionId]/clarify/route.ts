import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { getLessonRevisionView, type StartLessonContent } from "@/lib/mixalis/start-lesson";

export const runtime = "nodejs";
export const maxDuration = 60;

function outputText(payload: any) {
  if (typeof payload?.output_text === "string") return payload.output_text.trim();
  for (const item of Array.isArray(payload?.output) ? payload.output : []) {
    for (const content of Array.isArray(item?.content) ? item.content : []) {
      if (typeof content?.text === "string" && content.text.trim()) return content.text.trim();
    }
  }
  return "";
}

function clarificationModel() {
  return (
    process.env.PHYSICS_CLARIFICATION_MODEL?.trim() ||
    process.env.OPENAI_ASSISTANT_MODEL?.trim() ||
    process.env.PHYSICS_GENERATION_MODEL?.trim() ||
    "gpt-5.6"
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ revisionId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "OPENAI_API_KEY is missing." }, { status: 500 });

  const { revisionId } = await params;

  try {
    const body = await request.json().catch(() => null);
    const text = String(body?.text ?? "").trim().slice(0, 5000);
    const heading = String(body?.heading ?? "").trim().slice(0, 400);

    if (text.length < 10) {
      return NextResponse.json({ error: "Δεν υπάρχει αρκετό κείμενο για διευκρίνιση." }, { status: 400 });
    }

    const view = await getLessonRevisionView(revisionId);
    if (!view) return NextResponse.json({ error: "Lesson revision not found." }, { status: 404 });
    if (view.status !== "current" && view.status !== "superseded") {
      return NextResponse.json({ error: "Το μάθημα δεν είναι ακόμη έτοιμο." }, { status: 409 });
    }

    const lesson = view.content as StartLessonContent;
    const lessonContext = JSON.stringify(lesson);

    const prompt = `Είσαι η λειτουργία «Διευκρίνιση» μέσα σε ένα συγκεκριμένο μάθημα Φυσικής Β΄ Λυκείου για 16χρονο μαθητή.

ΣΤΟΧΟΣ:
Εξήγησε ΜΟΝΟ το σημείο που δεν κατάλαβε ο μαθητής. Δεν είσαι γενικό chatbot και δεν ανοίγεις νέο κεφάλαιο.

ΚΑΝΟΝΕΣ:
- Γράψε στα φυσικά, απλά ελληνικά ενός καλού καθηγητή που μιλά σε 16χρονο.
- Χρησιμοποίησε το υπόλοιπο μάθημα μόνο ως πλαίσιο, ώστε η εξήγηση να ταιριάζει με όσα έχουν ήδη διδαχθεί.
- Μην εισάγεις καινούργια ορολογία, τύπους ή έννοιες που εμφανίζονται αργότερα, εκτός αν είναι απολύτως απαραίτητο για να εξηγηθεί η συγκεκριμένη φράση.
- Αν υπάρχει αφηρημένη διατύπωση, κάν' την συγκεκριμένη με ένα μικρό αριθμητικό ή καθημερινό παράδειγμα.
- Μην επαναλαμβάνεις απλώς την ίδια πρόταση με άλλα συνώνυμα.
- Μην κάνεις επίδειξη γνώσεων. Προτίμησε 3-6 σύντομες προτάσεις.
- Αν χρειάζεται επίσημος όρος, δώσε πρώτα την απλή ιδέα και μετά πες «Στη Φυσική αυτό λέγεται…».
- Να είσαι απολύτως σωστός επιστημονικά.

ΜΑΘΗΜΑ:
${lessonContext}

ΣΗΜΕΙΟ ΤΟΥ ΜΑΘΗΜΑΤΟΣ:
${heading || "Χωρίς ξεχωριστό τίτλο"}

ΠΑΡΑΓΡΑΦΟΣ ΠΟΥ ΔΕΝ ΚΑΤΑΛΑΒΕ:
${text}

Απάντησε μόνο με τη διευκρίνιση. Όπου βοηθά, χρησιμοποίησε αυτή τη μικρή δομή:
Με απλά λόγια: ...
Παράδειγμα: ...
Τι να κρατήσεις: ...`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 50_000);

    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: clarificationModel(),
          reasoning: { effort: "low" },
          input: prompt,
          max_output_tokens: 700,
        }),
        signal: controller.signal,
      });

      const payload = await response.json();
      if (!response.ok) {
        console.error("Mixalis clarification OpenAI failed", payload);
        return NextResponse.json({ error: "Η διευκρίνιση δεν ήταν διαθέσιμη. Δοκίμασε ξανά." }, { status: 502 });
      }

      const clarification = outputText(payload);
      if (!clarification) {
        return NextResponse.json({ error: "Δεν δημιουργήθηκε διευκρίνιση. Δοκίμασε ξανά." }, { status: 502 });
      }

      return NextResponse.json({ clarification });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error("Mixalis lesson clarification failed", error);
    return NextResponse.json(
      { error: error instanceof Error && error.name === "AbortError" ? "Η διευκρίνιση άργησε πολύ. Δοκίμασε ξανά." : "Δεν ήταν δυνατή η διευκρίνιση." },
      { status: 500 },
    );
  }
}
