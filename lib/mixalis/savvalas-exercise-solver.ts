import { neon } from "@neondatabase/serverless";
import { get } from "@vercel/blob";
import { PDFDocument } from "pdf-lib";

export type SavvalasExerciseSolution = {
  found: boolean;
  matchExplanation: string;
  exerciseLabel: string;
  sourcePdfPages: number[];
  title: string;
  problemSummary: string;
  givenData: Array<{ symbol: string; value: string; meaning: string }>;
  asked: string[];
  physicsIdeas: string[];
  plan: string[];
  steps: Array<{ title: string; explanation: string; calculation: string }>;
  finalAnswer: string;
  checks: string[];
  commonTraps: string[];
  takeaway: string;
};

type ExerciseContext = {
  storageKey: string;
  originalName: string;
  courseTitle: string;
  chapterNumberLabel: string | null;
  chapterTitle: string;
  subchapterNumberLabel: string;
  subchapterTitle: string;
  filePageFrom: number;
  filePageTo: number;
};

const EXERCISE_SOLUTION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "found", "matchExplanation", "exerciseLabel", "sourcePdfPages", "title",
    "problemSummary", "givenData", "asked", "physicsIdeas", "plan", "steps",
    "finalAnswer", "checks", "commonTraps", "takeaway",
  ],
  properties: {
    found: { type: "boolean" },
    matchExplanation: { type: "string" },
    exerciseLabel: { type: "string" },
    sourcePdfPages: { type: "array", items: { type: "integer" } },
    title: { type: "string" },
    problemSummary: { type: "string" },
    givenData: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["symbol", "value", "meaning"],
        properties: {
          symbol: { type: "string" },
          value: { type: "string" },
          meaning: { type: "string" },
        },
      },
    },
    asked: { type: "array", items: { type: "string" } },
    physicsIdeas: { type: "array", items: { type: "string" } },
    plan: { type: "array", items: { type: "string" } },
    steps: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "explanation", "calculation"],
        properties: {
          title: { type: "string" },
          explanation: { type: "string" },
          calculation: { type: "string" },
        },
      },
    },
    finalAnswer: { type: "string" },
    checks: { type: "array", items: { type: "string" } },
    commonTraps: { type: "array", items: { type: "string" } },
    takeaway: { type: "string" },
  },
} as const;

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing.");
  return neon(databaseUrl);
}

function configuredModel() {
  return (
    process.env.PHYSICS_TUTOR_MODEL?.trim() ||
    process.env.PHYSICS_GENERATION_MODEL?.trim() ||
    process.env.PHYSICS_ANALYSIS_MODEL?.trim() ||
    "gpt-5.6"
  );
}

function getOutputText(payload: any): string {
  if (typeof payload?.output_text === "string") return payload.output_text;
  for (const item of Array.isArray(payload?.output) ? payload.output : []) {
    for (const content of Array.isArray(item?.content) ? item.content : []) {
      if (typeof content?.text === "string") return content.text;
    }
  }
  return "";
}

async function getExerciseContext(subchapterId: string): Promise<ExerciseContext | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      sd.storage_key,
      sd.original_name,
      co.title AS course_title,
      c.number_label AS chapter_number_label,
      c.title AS chapter_title,
      sc.number_label AS subchapter_number_label,
      sc.title AS subchapter_title,
      sr.file_page_from,
      sr.file_page_to
    FROM physics.subchapters sc
    JOIN physics.chapters c ON c.id = sc.chapter_id
    JOIN physics.courses co ON co.id = c.course_id
    JOIN LATERAL (
      SELECT range_row.*
      FROM physics.source_ranges range_row
      JOIN physics.source_documents document ON document.id = range_row.document_id
      WHERE range_row.subchapter_id = sc.id
        AND document.source_kind = 'savvalas_book'
        AND document.status = 'ready'
      ORDER BY range_row.created_at DESC, range_row.file_page_from ASC
      LIMIT 1
    ) sr ON true
    JOIN physics.source_documents sd ON sd.id = sr.document_id
    WHERE sc.id::text = ${subchapterId}
      AND sc.status = 'active'
      AND c.status = 'active'
      AND co.status = 'active'
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  const row = rows[0] as any;
  return {
    storageKey: String(row.storage_key),
    originalName: String(row.original_name || "savvalas.pdf"),
    courseTitle: String(row.course_title),
    chapterNumberLabel: row.chapter_number_label ? String(row.chapter_number_label) : null,
    chapterTitle: String(row.chapter_title),
    subchapterNumberLabel: String(row.subchapter_number_label),
    subchapterTitle: String(row.subchapter_title),
    filePageFrom: Number(row.file_page_from),
    filePageTo: Number(row.file_page_to),
  };
}

async function extractRangePdf(context: ExerciseContext) {
  const result = await get(context.storageKey, { access: "private" });
  if (!result || result.statusCode !== 200) {
    throw new Error("Το ιδιωτικό PDF του Σαββάλα δεν μπόρεσε να φορτωθεί.");
  }

  const bytes = new Uint8Array(await new Response(result.stream).arrayBuffer());
  const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
  if (
    context.filePageFrom < 1 ||
    context.filePageTo < context.filePageFrom ||
    context.filePageTo > source.getPageCount()
  ) {
    throw new Error("Οι δηλωμένες σελίδες βρίσκονται έξω από τα όρια του PDF.");
  }

  const excerpt = await PDFDocument.create();
  const indices = Array.from(
    { length: context.filePageTo - context.filePageFrom + 1 },
    (_, index) => context.filePageFrom - 1 + index,
  );
  const copiedPages = await excerpt.copyPages(source, indices);
  for (const page of copiedPages) excerpt.addPage(page);
  return Buffer.from(await excerpt.save()).toString("base64");
}

function buildPrompt(context: ExerciseContext, requestedExercise: string) {
  const pageMap = Array.from(
    { length: context.filePageTo - context.filePageFrom + 1 },
    (_, index) => `excerpt page ${index + 1} = ORIGINAL PDF page ${context.filePageFrom + index}`,
  ).join("\n");

  return `Είσαι προσωπικός καθηγητής Φυσικής για μαθητή Β΄ Λυκείου στην Ελλάδα.

ΣΤΟΧΟΣ
Εντόπισε στο συνημμένο απόσπασμα του βιβλίου Σαββάλας ΑΚΡΙΒΩΣ την άσκηση με αναγνωριστικό «${requestedExercise}» και, μόνο αν η ταυτοποίηση είναι βέβαιη, λύσε την αναλυτικά και διδακτικά.

ΠΛΑΙΣΙΟ
Μάθημα: ${context.courseTitle}
Κεφάλαιο: ${context.chapterNumberLabel || ""} ${context.chapterTitle}
Υποκεφάλαιο: ${context.subchapterNumberLabel} ${context.subchapterTitle}
Αρχείο: ${context.originalName}
Δηλωμένες ORIGINAL PDF σελίδες: ${context.filePageFrom}-${context.filePageTo}

ΑΝΤΙΣΤΟΙΧΙΣΗ ΣΕΛΙΔΩΝ
${pageMap}

ΚΑΝΟΝΕΣ ΑΚΡΙΒΟΥΣ ΕΝΤΟΠΙΣΜΟΥ
1. Ο αριθμός «${requestedExercise}» είναι αναγνωριστικό άσκησης του βιβλίου, όχι αριθμός σελίδας.
2. Έλεγξε τον ορατό τίτλο/αριθμό της άσκησης. Μην επιλέξεις άσκηση με παρόμοιο αριθμό.
3. Αν η άσκηση δεν φαίνεται ολόκληρη, αν λείπει σχήμα ή δεδομένο, αν ο αριθμός είναι αμφίβολος ή αν δεν βρίσκεται στις δηλωμένες σελίδες, βάλε found=false. Μην μαντέψεις και μην τη λύσεις.
4. Στο matchExplanation εξήγησε σύντομα γιατί η ταυτοποίηση είναι ή δεν είναι ασφαλής.
5. Τα sourcePdfPages είναι οι ORIGINAL PDF σελίδες όπου φαίνεται η συγκεκριμένη άσκηση.

ΚΑΝΟΝΕΣ ΔΙΔΑΣΚΑΛΙΑΣ
- Γράψε αποκλειστικά στα ελληνικά, σε γλώσσα κατανοητή για μαθητή 16 ετών.
- Μην αντιγράψεις αυτούσια μεγάλα αποσπάσματα της εκφώνησης. Δώσε σύντομη πιστή περίληψη.
- Ξεκίνα από τη φυσική ιδέα και μετά πέρασε στους τύπους.
- Ξεχώρισε καθαρά δεδομένα, ζητούμενα, σχέδιο λύσης και αριθμητικές πράξεις.
- Σε κάθε βήμα εξήγησε γιατί επιλέγεται ο συγκεκριμένος νόμος ή τύπος.
- Κράτησε σύμβολα, μονάδες SI, πρόσημα και διανύσματα συνεπή.
- Χρησιμοποίησε ασφαλή απλή μαθηματική γραφή Unicode: v0, vx, vy, ΣF, mg, ½mv², ⇒.
- Μην χρησιμοποιήσεις LaTeX εντολές, σύμβολα $ ή combining χαρακτήρες βέλους πάνω από γράμματα (όπως v⃗, i⃗, g⃗), επειδή δεν εμφανίζονται σωστά στην οθόνη.
- Για διανύσματα γράψε τη διεύθυνση με λέξεις, π.χ. «v0 = 200 m/s οριζόντια προς τα δεξιά» και «ΣF = mg κατακόρυφα προς τα κάτω».
- Κάνε έλεγχο μονάδων και φυσικής λογικής του αποτελέσματος.
- Αν υπάρχει σχήμα, περιέγραψε πώς πρέπει να το διαβάσει ο μαθητής.
- Αν found=false, όλα τα πεδία της λύσης πρέπει να είναι κενά, εκτός από matchExplanation και exerciseLabel.`;
}

function normalizePhysicsText(value: unknown) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/\\(?:overrightarrow|vec)\s*\{([^{}]+)\}/g, "$1")
    .replace(/[\u20d0-\u20ff]/g, "")
    .replace(/\uFFFD/g, "")
    .replace(/\\frac\s*\{1\}\s*\{2\}/g, "½")
    .replace(/\\cdot/g, "·")
    .replace(/\\times/g, "×")
    .replace(/\\(?:Rightarrow|implies)/g, "⇒")
    .replace(/\\rightarrow/g, "→")
    .replace(/\\(?:left|right)/g, "")
    .replace(/\$+/g, "")
    .normalize("NFC");
}

function cleanText(value: unknown, maxLength: number) {
  return normalizePhysicsText(value).trim().slice(0, maxLength);
}

function cleanTextArray(value: unknown, maxItems: number, maxLength: number) {
  return (Array.isArray(value) ? value : [])
    .map((item) => cleanText(item, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function emptySolution(raw: any): SavvalasExerciseSolution {
  return {
    found: false,
    matchExplanation: cleanText(raw?.matchExplanation, 1200) ||
      "Η άσκηση δεν ταυτοποιήθηκε με ασφάλεια στις δηλωμένες σελίδες.",
    exerciseLabel: cleanText(raw?.exerciseLabel, 80),
    sourcePdfPages: [],
    title: "",
    problemSummary: "",
    givenData: [],
    asked: [],
    physicsIdeas: [],
    plan: [],
    steps: [],
    finalAnswer: "",
    checks: [],
    commonTraps: [],
    takeaway: "",
  };
}

function cleanSolution(raw: any, context: ExerciseContext): SavvalasExerciseSolution {
  if (raw?.found !== true) return emptySolution(raw);

  const pages = Array.from(
    new Set<number>(
      (Array.isArray(raw?.sourcePdfPages) ? raw.sourcePdfPages : [])
        .map((page: unknown) => Number(page))
        .filter(
          (page: number) =>
            Number.isInteger(page) && page >= context.filePageFrom && page <= context.filePageTo,
        ),
    ),
  ).sort((a, b) => a - b);
  const givenData = (Array.isArray(raw?.givenData) ? raw.givenData : [])
    .map((item: any) => ({
      symbol: cleanText(item?.symbol, 80),
      value: cleanText(item?.value, 180),
      meaning: cleanText(item?.meaning, 500),
    }))
    .filter((item: { symbol: string; value: string; meaning: string }) =>
      item.symbol || item.value || item.meaning,
    )
    .slice(0, 20);
  const steps = (Array.isArray(raw?.steps) ? raw.steps : [])
    .map((item: any) => ({
      title: cleanText(item?.title, 220),
      explanation: cleanText(item?.explanation, 2200),
      calculation: cleanText(item?.calculation, 2200),
    }))
    .filter((item: { title: string; explanation: string; calculation: string }) =>
      item.title && item.explanation,
    )
    .slice(0, 16);

  if (pages.length === 0 || steps.length === 0) {
    return emptySolution({
      exerciseLabel: raw?.exerciseLabel,
      matchExplanation: "Η άσκηση δεν ταυτοποιήθηκε με αρκετά ισχυρά στοιχεία για ασφαλή λύση.",
    });
  }

  return {
    found: true,
    matchExplanation: cleanText(raw?.matchExplanation, 1200),
    exerciseLabel: cleanText(raw?.exerciseLabel, 80),
    sourcePdfPages: pages,
    title: cleanText(raw?.title, 260),
    problemSummary: cleanText(raw?.problemSummary, 3500),
    givenData,
    asked: cleanTextArray(raw?.asked, 12, 700),
    physicsIdeas: cleanTextArray(raw?.physicsIdeas, 12, 1200),
    plan: cleanTextArray(raw?.plan, 12, 1200),
    steps,
    finalAnswer: cleanText(raw?.finalAnswer, 3000),
    checks: cleanTextArray(raw?.checks, 12, 1200),
    commonTraps: cleanTextArray(raw?.commonTraps, 12, 1200),
    takeaway: cleanText(raw?.takeaway, 2200),
  };
}

export function normalizeExerciseIdentifier(value: unknown) {
  const normalized = String(value ?? "").normalize("NFKC").trim();
  if (!normalized || normalized.length > 30) return null;
  if (!/\p{N}/u.test(normalized)) return null;
  if (!/^[\p{L}\p{N}][\p{L}\p{N}._\- /()]*$/u.test(normalized)) return null;
  return normalized;
}

export async function solveSavvalasExercise(
  subchapterId: string,
  exerciseIdentifier: string,
): Promise<SavvalasExerciseSolution> {
  const context = await getExerciseContext(subchapterId);
  if (!context) {
    throw new Error("Δεν έχουν αποθηκευτεί σελίδες Σαββάλα για αυτό το υποκεφάλαιο.");
  }

  const apiKey = process.env.TEACHER;
  if (!apiKey) throw new Error("TEACHER is not configured for the Physics pipeline.");
  const excerptBase64 = await extractRangePdf(context);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 280_000);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: configuredModel(),
        reasoning: { effort: "high" },
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: buildPrompt(context, exerciseIdentifier) },
              {
                type: "input_file",
                filename: `savvalas-${context.subchapterNumberLabel}.pdf`,
                file_data: `data:application/pdf;base64,${excerptBase64}`,
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "savvalas_exercise_solution",
            strict: true,
            schema: EXERCISE_SOLUTION_SCHEMA,
          },
        },
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.error?.message || `Η επίλυση απέτυχε με HTTP ${response.status}.`);
    }
    const output = getOutputText(payload);
    if (!output) throw new Error("Η επίλυση επέστρεψε κενό αποτέλεσμα.");
    return cleanSolution(JSON.parse(output), context);
  } finally {
    clearTimeout(timeout);
  }
}
