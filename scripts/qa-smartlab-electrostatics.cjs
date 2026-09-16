const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const sourcePath = path.join(process.cwd(), "lib/mixalis/smartlab-electrostatics.ts");
const source = fs.readFileSync(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: sourcePath,
}).outputText;

const electrostaticsModule = { exports: {} };
new Function("exports", "module", "require", compiled)(electrostaticsModule.exports, electrostaticsModule, require);
const {
  calculateCoulombPair,
  calculatePointChargeField,
  electrostaticsMode,
  parseFixedCharge,
} = electrostaticsModule.exports;

function approximately(actual, expected, relativeTolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= Math.abs(expected) * relativeTolerance, `${actual} is not approximately ${expected}`);
}

assert.equal(electrostaticsMode({ title: "Ο νόμος του Coulomb", concept: "", scene: { description: "δύο φορτία" } }), "coulomb_pair");
assert.equal(electrostaticsMode({ title: "Ηλεκτρικό πεδίο σημειακού φορτίου", concept: "", scene: { description: "" } }), "point_charge_field");
assert.equal(electrostaticsMode({ title: "Έργο", concept: "μηχανική ενέργεια", scene: { description: "" } }), null);

approximately(parseFixedCharge("Σταθερό φορτίο Q=+1,6×10^-6 C", 0), 1.6e-6);

const repulsion = calculateCoulombPair(2e-6, 3e-6, 2);
const attraction = calculateCoulombPair(2e-6, -3e-6, 2);
const neutral = calculateCoulombPair(2e-6, 0, 2);
assert.equal(repulsion.interaction, "repulsion");
assert.equal(attraction.interaction, "attraction");
assert.equal(neutral.interaction, "none");
approximately(repulsion.forceMagnitude, attraction.forceMagnitude);
assert.equal(neutral.forceMagnitude, 0);

const near = calculateCoulombPair(2e-6, 3e-6, 1);
const far = calculateCoulombPair(2e-6, 3e-6, 2);
approximately(far.forceMagnitude, near.forceMagnitude / 4);

const field = calculatePointChargeField(-2e-6, 3e-6, 2);
assert.equal(field.fieldDirection, "inward");
assert.equal(field.interaction, "attraction");
assert.ok(field.potential < 0);
assert.ok(field.potentialEnergy < 0);
approximately(field.forceMagnitude, Math.abs(field.testCharge) * field.electricFieldMagnitude);

console.log("SMARTLAB electrostatics QA passed: renderer routing, charge parsing, Coulomb inverse-square behavior, field direction, force, potential, and energy are consistent.");
