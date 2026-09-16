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

const circularMotion = [
  String.raw`s = r\phi`,
  String.raw`f = \frac{1}{T}`,
  String.raw`\Delta\phi = \omega\Delta t`,
  String.raw`v = \omega r`,
  String.raw`\omega = 2\pi f`,
  String.raw`\alpha_\kappa = \frac{v^2}{r}`,
  String.raw`\alpha_\kappa = \omega^2 r`,
].map((expression) => ({
  expression,
  readAs: "",
  physicalMeaning: "",
  conditions: "",
  sourceItemIds: [],
}));
assert.doesNotThrow(() => assertLessonFormulaContract("Ομαλή κυκλική κίνηση", circularMotion));

const circularWithInitialAngle = circularMotion.map((formula) => (
  formula.expression === String.raw`\Delta\phi = \omega\Delta t`
    ? { ...formula, expression: String.raw`\theta = \theta_0 + \omega t` }
    : formula
));
assert.doesNotThrow(() => assertLessonFormulaContract("Ομαλή κυκλική κίνηση", circularWithInitialAngle));

const incomplete = lessonFormulas.filter((formula) => !formula.expression.includes("v_y = g t"));
assert.throws(
  () => assertLessonFormulaContract("Οριζόντια βολή", incomplete),
  /lesson formula missing 'υy=gt'/,
);

console.log("SMARTLAB formula contract QA passed: equivalent horizontal-projectile and circular-motion notation is accepted, while missing physics is rejected.");
