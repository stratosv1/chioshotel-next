import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { getLessonRevisionView, type StartLessonContent } from "@/lib/mixalis/start-lesson";

export const runtime = "nodejs";
export const maxDuration = 60;

type ClarificationTarget = {
  text: string;
  heading: string;
};

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

function resolveClarificationTarget(
  lesson: StartLessonContent,
  blockKey: string,
): ClarificationTarget | null {
  if (blockKey === "subtitle") {
    return lesson.subtitle
      ? { text: lesson.subtitle, heading: lesson.title || "Η κεντρική ιδέα" }
      : null;
  }

  const singleBlocks: Record<string, { body: string; title: string }> = {
    "openingPhenomenon.body": lesson.openingPhenomenon,
    "hiddenRealWorldExample.body": lesson.hiddenRealWorldExample,
    "physicsReveal.body": lesson.physicsReveal,
    "engineeringBridge.body": lesson.engineeringBridge,
    "closingMentalModel.body": lesson.closingMentalModel,
  };
  const singleBlock = singleBlocks[blockKey];
  if (singleBlock?.body) {
    return { text: singleBlock.body, heading: singleBlock.title };
  }

  const textBlockMatch = blockKey.match(
    /^(intuitiveMeaning|dependencies|formalTerminology|guidedApplications|misconceptionRepairs)\.(\d+)\.body$/,
  );
  if (textBlockMatch) {
    const groups: Record<string, StartLessonContent["intuitiveMeaning"]> = {
      intuitiveMeaning: lesson.intuitiveMeaning,
      dependencies: lesson.dependencies,
      formalTerminology: lesson.formalTerminology,
      guidedApplications: lesson.guidedApplications,
      misconceptionRepairs: lesson.misconceptionRepairs,
    };
    const item = groups[textBlockMatch[1]]?.[Number(textBlockMatch[2])];
    return item?.body ? { text: item.body, heading: item.title } : null;
  }

  const quantityMatch = blockKey.match(/^quantities\.(\d+)\.(meaning|whyItMatters)$/);
  if (quantityMatch) {
    const quantity = lesson.quantities[Number(quantityMatch[1])];
    if (!quantity) return null;
    const field = quantityMatch[2] as "meaning" | "whyItMatters";
    const text = quantity[field];
    if (!text) return null;
    return {
      text,
      heading:
        field === "whyItMatters"
          ? `${quantity.symbol} · ${quantity.name} — Γιατί έχει σημασία`
          : `${quantity.symbol} · ${quantity.name}`,
    };
  }

  const formulaMatch = blockKey.match(/^formulas\.(\d+)\.(readAs|physicalMeaning|conditions)$/);
  if (formulaMatch) {
    const formula = lesson.formulas[Number(formulaMatch[1])];
    if (!formula) return null;
    const field = formulaMatch[2] as "readAs" | "physicalMeaning" | "conditions";
    const text = formula[field];
    if (!text) return null;
    const suffix =
      field === "readAs"
        ? " — Πώς διαβάζεται"
        : field === "conditions"
          ? " — Πότε ισχύει"
          : " — Φυσική σημασία";
    return { text, heading: `${formula.expression}${suffix}` };
  }

  return null;
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
    const blockKey = String(body?.blockKey ?? "").trim().slice(0, 200);

    if (!blockKey || !/^[A-Za-z0-9.]+$/.test(blockKey)) {
      return NextResponse.json({ error: "Μη έγκυρο σημείο μαθήματος." }, { status: 400 });
    }

    const view = await getLessonRevisionView(revisionId);
    if (!view) return NextResponse.json({ error: "Lesson revision not found." }, { status: 404 });
    if (view.status !== "current" && view.status !== "superseded") {
      return NextResponse.json({ error: "Το μάθημα δεν είναι ακόμη έτοιμο." }, { status: 409 });
    }

    const lesson = view.content as StartLessonContent;
    const target = resolveClarificationTarget(lesson, blockKey);
    if (!target || target.text.trim().length < 10) {
      return NextResponse.json({ error: "Το σημείο δεν ανήκει σε αυτό το μάθημα." }, { status: 400 });
    }

    const lessonContext = JSON.stringify(lesson);

    const prompt = `Είσαι η λειτουργία «Διευκρίνιση» μέσα σε ένα συγκεκριμένο μάθημα Φυσικής Β΄ Λυκείου για 16χρονο μαθητή.

ΣΤΟΧΟΣ:
Εξήγησε ΜΟΝΟ το συγκεκριμένο αποθηκευμένο σημείο του μαθήματος που δεν κατάλαβε ο μαθητής. Δεν είσαι γενικό chatbot και δεν ανοίγεις νέο κεφάλαιο.

ΚΑΝΟΝΕΣ:
- Γράψε στα φυσικά, απλά ελληνικά ενός καλού καθηγητή που μιλά σε 16χρονο.
- Χρησιμοποίησε το υπόλοιπο μάθημα μόνο ως πλαίσιο, ώστε η εξήγηση να ταιριάζει με όσα έχουν ήδη διδαχθεί.
- Το block key δείχνει το ακριβές σημείο του μαθήματος. Μην αλλάζεις θέμα και μην απαντάς σε άσχετα αιτήματα.
- Μην εισάγεις καινούργια ορολογία, τύπους ή έννοιες που εμφανίζονται αργότερα, εκτός αν είναι απολύτως απαραίτητο για να εξηγηθεί η συγκεκριμένη φράση.
- Αν υπάρχει αφηρημένη διατύπωση, κάν' την συγκεκριμένη με ένα μικρό αριθμητικό ή καθημερινό παράδειγμα.
- Μην επαναλαμβάνεις απλώς την ίδια πρόταση με άλλα συνώνυμα.
- Μην κάνεις επίδειξη γνώσεων. Προτίμησε 3-6 σύντομες προτάσεις.
- Αν χρειάζεται επίσημος όρος, δώσε πρώτα την απλή ιδέα και μετά πες «Στη Φυσική αυτό λέγεται…».
- Να είσαι απολύτως σωστός επιστημονικά.

ΜΑΘΗΜΑ:
${lessonContext}

ΑΚΡΙΒΕΣ BLOCK KEY:
${blockKey}

ΣΗΜΕΙΟ ΤΟΥ ΜΑΘΗΜΑΤΟΣ:
${target.heading || "Χωρίς ξεχωριστό τίτλο"}

ΑΠΟΘΗΚΕΥΜΕΝΟ ΚΕΙΜΕΝΟ ΠΟΥ ΔΕΝ ΚΑΤΑΛΑΒΕ:
${target.text}

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
