#!/usr/bin/env node
/* QA: Φυσική Σιδέρη, Κεφάλαιο 2 (Μετρήσεις χρόνου).
 * - ξαναϋπολογίζει κάθε αριθμητική απάντηση από το `calc`,
 * - ελέγχει ότι κάθε ερώτηση πολλαπλής επιλογής έχει μία έγκυρη σωστή επιλογή και εξήγηση,
 * - ελέγχει ότι κάθε άσκηση της φωτοτυπίας του καθηγητή λύνεται στη σελίδα.
 */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(root, "lib/sideris/physics-k2-quiz.ts"), "utf8");
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const mod = { exports: {} };
new Function("module", "exports", "require", js)(mod, mod.exports, require);
const { MINI, FINAL, TEACHER_EXERCISES } = mod.exports;

const errors = [];
const ids = new Set();
const SAFE = /^[\d+\-*/().\s]+$/;
const evalCalc = (expr) => {
  if (!SAFE.test(expr)) throw new Error(`μη ασφαλής πράξη: ${expr}`);
  return Function(`"use strict"; return (${expr});`)();
};
const close = (a, b) => Math.abs(a - b) <= Math.max(1e-9, Math.abs(b) * 1e-9);

function checkQ(q, where) {
  if (ids.has(q.id)) errors.push(`${where}: διπλό id ${q.id}`);
  ids.add(q.id);
  if (!q.q || !q.why) errors.push(`${where}/${q.id}: λείπει εκφώνηση ή εξήγηση`);
  if (q.kind === "mc") {
    if (!Array.isArray(q.choices) || q.choices.length < 2) errors.push(`${where}/${q.id}: λιγότερες από 2 επιλογές`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.choices.length) errors.push(`${where}/${q.id}: η σωστή επιλογή δεν υπάρχει`);
    if (new Set(q.choices).size !== q.choices.length) errors.push(`${where}/${q.id}: διπλές επιλογές`);
  } else if (q.kind === "tf") {
    if (typeof q.answer !== "boolean") errors.push(`${where}/${q.id}: σωστό/λάθος χωρίς boolean απάντηση`);
  } else if (q.kind === "num") {
    if (!q.calc) errors.push(`${where}/${q.id}: λείπει calc`);
    else {
      const v = evalCalc(q.calc);
      if (!close(v, q.answer)) errors.push(`${where}/${q.id}: calc ${q.calc} = ${v}, αλλά answer = ${q.answer}`);
    }
    if (!q.unit) errors.push(`${where}/${q.id}: λείπει μονάδα`);
  } else errors.push(`${where}/${q.id}: άγνωστο είδος ${q.kind}`);
}

let count = 0;
for (const [sec, qs] of Object.entries(MINI)) {
  if (qs.length < 3 || qs.length > 5) errors.push(`τεστάκι ${sec}: ${qs.length} ερωτήσεις (θέλουμε 3–5)`);
  qs.forEach((q) => (checkQ(q, `MINI ${sec}`), count++));
}
for (const g of FINAL) g.questions.forEach((q) => (checkQ(q, `FINAL ${g.title}`), count++));

// ασκήσεις καθηγητή: αριθμητικές ξαναϋπολογίζονται, και όλες πρέπει να έχουν λύση στη σελίδα
const page = fs.readFileSync(path.join(root, "components/sideris/physics/chapters/Kefalaio2.tsx"), "utf8");
const teacherBlocks = page.split("<Ask").filter((b) => /^\s+teacher/.test(b));
if (teacherBlocks.length !== TEACHER_EXERCISES.length) errors.push(`ασκήσεις καθηγητή: ${teacherBlocks.length} στη σελίδα, ${TEACHER_EXERCISES.length} στη λίστα`);
for (const ex of TEACHER_EXERCISES) {
  const block = teacherBlocks.find((b) => b.includes(`n="${ex.label}"`));
  if (!block) errors.push(`άσκηση καθηγητή ${ex.label}: δεν βρέθηκε στη σελίδα`);
  else if (!/<Solve|work=/.test(block)) errors.push(`άσκηση καθηγητή ${ex.label}: χωρίς λύση`);
  if (ex.calc) {
    const v = evalCalc(ex.calc);
    if (!close(v, ex.answer)) errors.push(`άσκηση καθηγητή ${ex.label}: ${ex.calc} = ${v}, όχι ${ex.answer}`);
    const shown = String(ex.answer).replace(".", ",");
    if (block && !block.includes(shown)) errors.push(`άσκηση καθηγητή ${ex.label}: η λύση δεν δείχνει ${shown}`);
  } else if (block && !block.includes(ex.answer)) errors.push(`άσκηση καθηγητή ${ex.label}: η λύση δεν λέει «${ex.answer}»`);
}

if (errors.length) {
  console.error(`✗ qa-sideris-fysiki-k2: ${errors.length} πρόβλημα(τα)`);
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}
console.log(`✓ qa-sideris-fysiki-k2: ${count} ερωτήσεις και ${TEACHER_EXERCISES.length} ασκήσεις καθηγητή OK`);
