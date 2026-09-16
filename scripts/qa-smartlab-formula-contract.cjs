const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const sourcePath = path.join(process.cwd(), "lib/mixalis/smartlab-formula-contract.ts");
const source = fs.readFileSync(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: sourcePath,
}).outputText;

const formulaModule = { exports: {} };
new Function("exports", "module", "require", compiled)(formulaModule.exports, formulaModule, require);
const { assertLessonFormulaContract, normalizeLessonFormula } = formulaModule.exports;

const latexHorizontalProjectile = [
  String.raw`v_x = v_0`,
  String.raw`x = v_0 t`,
  String.raw`v_y = g t`,
  String.raw`y = \frac{1}{2} g t^2`,
  String.raw`t_{πτ} = \sqrt{\frac{2h}{g}}`,
  String.raw`v^2 = v_x^2 + v_y^2`,
  String.raw`\tan\theta = \frac{v_y}{v_x}`,
  String.raw`y = \frac{g}{2v_0^2} x^2`,
];

const lessonFormulas = latexHorizontalProjectile.map((expression) => ({
  expression,
  readAs: "",
  physicalMeaning: "",
  conditions: "",
  sourceItemIds: [],
}));

assert.equal(normalizeLessonFormula("υᵧ = g·t"), "υy=gt");
assert.equal(normalizeLessonFormula("y = ½ g t²"), "y=1/2gt2");
assert.equal(normalizeLessonFormula(String.raw`\tan\theta = \frac{v_y}{v_x}`), "tanθ=υy/υx");
assert.equal(
  normalizeLessonFormula(String.raw`\left|\vec{v}\right| = \sqrt{v_x^2 + v_y^2}`),
  "υ=√υx2+υy2",
);
assert.doesNotThrow(() => assertLessonFormulaContract("Οριζόντια βολή", lessonFormulas));

const substitutedSpeed = lessonFormulas.map((formula) => (
  formula.expression === String.raw`v^2 = v_x^2 + v_y^2`
    ? { ...formula, expression: String.raw`v = \sqrt{v_0^2 + (g t)^2}` }
    : formula
));
assert.doesNotThrow(() => assertLessonFormulaContract("Οριζόντια βολή", substitutedSpeed));

const incomplete = lessonFormulas.filter((formula) => !formula.expression.includes("v_y = g t"));
assert.throws(
  () => assertLessonFormulaContract("Οριζόντια βολή", incomplete),
  /lesson formula missing 'υy=gt'/,
);

console.log("SMARTLAB formula contract QA passed: Unicode, plain-text and LaTeX-equivalent horizontal-projectile formulas are accepted, while missing physics is rejected.");
