/**
 * Independent physics QA for Ormi2 parameterized challenge families.
 * Runs in the production build before Next.js compilation.
 * Zero external/online dependencies beyond project's TypeScript dependency.
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const ts = require("typescript");

const entry = path.join(__dirname, "..", "components/mixalis/ormi2/challenges-data.ts");
const raw = fs.readFileSync(entry, "utf8");
const output = ts.transpileModule(raw, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const context = { exports: {}, Math, Intl };
vm.runInNewContext(output, context, { timeout: 3000, filename: "challenges-data.js" });
const { CHALLENGES, solveChallenge, answerMatches } = context.exports;

function near(a, b, name, eps = 1e-8) {
  assert(Number.isFinite(a) && Number.isFinite(b), name + ": nonfinite quantity");
  assert(Math.abs(a - b) <= eps * Math.max(1, Math.abs(a), Math.abs(b)), name + ": " + a + " ≠ " + b);
}
function byId(steps) {
  return Object.fromEntries(steps.map((s) => [s.id, s.answer]));
}

const fixtures = {
  "stick-friction": [{ V: 4, u: 400, Q: 1584 }, { V: 5, u: 500, Q: 2480 }],
  ballistic: [{ V: 3, u: 120, loss: 97.5 }, { V: 4, u: 80, loss: 95 }],
  "pass-edge": [{ t: 0.5, V: 4, uout: 100, Q: 792 }, { t: 0.4, V: 3, uout: 150, Q: 670.5 }],
  "elastic-ramp": [{ v1: -6, v2: 4, h: 0.8 }, { v1: -2, v2: 8, h: 3.2 }],
  "friction-collision-flight": [{ before: 8, V: 2, x: 1 }, { before: 12, V: 3, x: 1.5 }],
  "bounce-force": [{ down: 6, up: 4, F: 42 }, { down: 8, up: 6, F: 63 }],
  "spring-explosion": [{ v2: 2, v1: -6, V: 1.5, Q: 1.5 }, { v2: 3, v1: -9, V: 2.25, Q: 3.375 }],
  "pendulum-elastic-spring": [{ u: 4, v1: -2, v2: 2, x: 0.4 }, { u: 5, v1: -2.5, v2: 2.5, x: 0.5 }],
};

assert.equal(CHALLENGES.length, 8, "expected eight families");
assert.equal(new Set(CHALLENGES.map((c) => c.id)).size, 8, "duplicate family ids");
let variants = 0;
let checks = 0;
for (const family of CHALLENGES) {
  assert.equal(family.variants.length, 2, family.id + ": expected two variants");
  assert(family.phases.length >= 2, family.id + ": should have multiple phases");
  for (let i = 0; i < 2; i++) {
    const variant = family.variants[i];
    const p = variant.p;
    const result = solveChallenge(family, variant);
    const answers = byId(result.steps);
    assert.equal(result.steps.length, Object.keys(fixtures[family.id][i]).length);
    assert(result.prompt.length > 100, family.id + ": missing prompt");
    assert(result.steps.every((s) => s.law && s.formula && s.hint && s.explanation && s.unit), "missing method in " + family.id);
    for (const [key, expected] of Object.entries(fixtures[family.id][i])) {
      near(answers[key], expected, family.id + "/" + variant.id + "/" + key);
      assert(answerMatches(String(expected), answers[key]));
      checks++;
    }
    assert(!answerMatches("", result.steps[0].answer));
    assert(!answerMatches("αβγ", result.steps[0].answer));
    assert(!answerMatches(String(result.steps[0].answer + 9), result.steps[0].answer));
    switch (family.id) {
      case "stick-friction":
        near(p.m * answers.u, (p.M + p.m) * answers.V, "momentum stick");
        near(0.5 * (p.M + p.m) * answers.V ** 2, p.mu*(p.M+p.m)*p.g*p.s, "energy friction");
        assert(answers.Q > 0); break;
      case "ballistic":
        near(p.m*answers.u, (p.M+p.m)*answers.V, "momentum ballistic");
        near(0.5 * answers.V**2, p.g*p.h, "energy ballistic");
        break;
      case "pass-edge":
        near(p.m*p.u, p.m*answers.uout + p.M*answers.V, "momentum pass");
        near(p.x, answers.V*answers.t, "range pass");
        assert(answers.uout > 0 && answers.Q > 0); break;
      case "elastic-ramp":
        near(p.m1*p.u, p.m1*answers.v1+p.m2*answers.v2, "momentum elastic");
        near(p.m1*p.u**2, p.m1*answers.v1**2+p.m2*answers.v2**2, "energy elastic");
        near(answers.v2**2, 2*p.g*answers.h, "ramp height"); break;
      case "friction-collision-flight":
        near(p.u**2-answers.before**2, 2*p.mu*p.g*p.d, "friction speed");
        near(p.m*answers.before, (p.m+p.M)*answers.V, "collision momentum");
        near(answers.x, answers.V*Math.sqrt(2*p.H/p.g), "projectile range"); break;
      case "bounce-force":
        near(answers.down**2, 2*p.g*p.h1, "drop speed");
        near(answers.up**2, 2*p.g*p.h2, "rise speed");
        near((answers.F-p.m*p.g)*p.dt, p.m*(answers.down+answers.up), "impulse contact"); break;
      case "spring-explosion":
        near(p.m1*answers.v1 + p.m2*answers.v2, 0, "spring momentum");
        near(0.5*p.m1*answers.v1**2+0.5*p.m2*answers.v2**2, p.E, "spring energy");
        near(p.m2*answers.v2, (p.m2+p.m3)*answers.V, "second momentum");
        assert(answers.Q>0); break;
      case "pendulum-elastic-spring":
        near(answers.u**2, 2*p.g*p.h, "pendulum fall");
        near(p.m1*answers.u, p.m1*answers.v1+p.m2*answers.v2, "pendulum momentum");
        near(p.m1*answers.u**2, p.m1*answers.v1**2+p.m2*answers.v2**2, "pendulum elastic");
        near(p.m2*answers.v2**2, p.k*answers.x**2, "spring compression"); break;
      default: throw new Error("Unhandled family: "+family.id);
    }
    variants++;
  }
}
console.log("Ormi2 challenge QA passed: "+CHALLENGES.length+" families, "+variants+" variants, "+checks+" verified numeric answers; momentum & energy invariants checked.");
