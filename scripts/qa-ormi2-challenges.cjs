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
  "stick-friction": [{ V: 4, u: 400, Q: 1584 }, { V: 5, u: 500, Q: 2475 }],
  ballistic: [{ V: 3, u: 120, loss: 97.5 }, { V: 4, u: 80, loss: 95 }],
  "pass-edge": [{ t: 0.5, V: 4, uout: 100, Q: 792 }, { t: 0.4, V: 3, uout: 150, Q: 670.5 }],
  "elastic-ramp": [{ v1: -6, v2: 4, h: 0.8 }, { v1: -2, v2: 8, h: 3.2 }],
  "friction-collision-flight": [{ before: 8, V: 2, x: 1 }, { before: 12, V: 3, x: 1.5 }],
  "bounce-force": [{ down: 6, up: 4, F: 42 }, { down: 8, up: 6, F: 63 }],
  "spring-explosion": [{ v2: 2, v1: -6, V: 1.5, Q: 1.5 }, { v2: 3, v1: -9, V: 2.25, Q: 3.375 }],
  "pendulum-elastic-spring": [{ u: 4, v1: -2, v2: 2, x: 0.4 }, { u: 5, v1: -2.5, v2: 2.5, x: 0.5 }],

  "collision-rough-ramp": [
    { V: 2, d: 1/3, h: 0.2, W: 0 },
    { V: 2, d: 0.25, h: 0.15, W: 1 },
  ],
  "double-collision-spring": [
    { V: 6, v12: -2, v3: 4, x: 0.8 },
    { V: 6, v12: 2, v3: 8, x: 1 },
  ],
  "penetration-capture": [
    { V1: 2, V2: Math.sqrt(2), uout: 10*Math.sqrt(2), uin: 40 + 10*Math.sqrt(2) },
    { V1: 3, V2: Math.sqrt(8), uout: 10*Math.sqrt(8), uin: 60 + 10*Math.sqrt(8) },
  ],
  "collision-pendulum-tension": [
    { V: 2, u: 10, T: 12, cos: 0.9 },
    { V: 3, u: 15, T: 16, cos: 0.7 },
  ],
  "wall-rebound-catch": [
    { v1: -6, v2: 4, wall: 6, V: 4.4, s: 2.42, Q: 1.6 },
    { v1: -8, v2: 4, wall: 8, V: 14/3, s: 196/90, Q: 20/3 },
  ],
};

assert.equal(CHALLENGES.length, 13, "expected thirteen families");
assert.equal(new Set(CHALLENGES.map((c) => c.id)).size, 13, "duplicate family ids");
assert(answerMatches("−2,5", -2.5), "accept Unicode minus and Greek decimal comma");
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
    assert(result.steps.every((s) => s.law && s.formula && s.hint && s.explanation && typeof s.unit === "string"), "missing method in " + family.id);
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

      case "collision-rough-ramp":
        near(p.m*p.u, (p.m+p.M)*answers.V, "ramp collision momentum");
        near(0.5*(p.m+p.M)*answers.V**2,
          (p.m+p.M)*p.g*answers.h + answers.W, "ramp climb energy balance");
        near(answers.h, answers.d*p.sn, "ramp height");
        near(answers.W, p.mu*(p.M+p.m)*p.g*p.cs*answers.d, "ramp friction work");
        if (p.mu === 0) assert.equal(answers.W, 0, "smooth slope must have zero friction");
        break;
      case "double-collision-spring": {
        const mass=p.m1+p.m2;
        near(p.m1*p.u, mass*answers.V, "double first plastic momentum");
        near(mass*answers.V, mass*answers.v12+p.m3*answers.v3, "double elastic momentum");
        near(mass*answers.V**2, mass*answers.v12**2+p.m3*answers.v3**2, "double elastic kinetic");
        near(p.m3*answers.v3**2, p.k*answers.x**2, "double spring compression");
        assert(Math.sign(answers.v12)===(i===0?-1:1), "variant must change the rebound direction");
        break;
      }
      case "penetration-capture":
        near(answers.V1**2, 2*p.g*p.h, "first block swing");
        near(answers.V2**2, 2*p.mu*p.g*p.s, "second block slide");
        near(p.m*answers.uout, (p.m+p.M2)*answers.V2, "capture momentum");
        near(p.m*answers.uin, p.m*answers.uout+p.M1*answers.V1, "penetration momentum");
        assert(answers.uin>answers.uout,"initial bullet speed > exit speed");
        break;
      case "collision-pendulum-tension":
        near(p.m*answers.u,(p.m+p.M)*answers.V,"pendulum plastic momentum");
        near(answers.V**2,2*p.g*p.h,"pendulum height conservation");
        near(answers.T-(p.m+p.M)*p.g,(p.m+p.M)*answers.V**2/p.L,"centripetal radial balance");
        near(p.h,p.L*(1-answers.cos),"pendulum geometry");
        assert(answers.cos>0&&answers.cos<=1,"pendulum stays below horizontal");
        break;
      case "wall-rebound-catch":
        near(p.m1*p.u,p.m1*answers.v1+p.m2*answers.v2,"first elastic momentum");
        near(p.m1*p.u**2,p.m1*answers.v1**2+p.m2*answers.v2**2,"first elastic energy");
        near(answers.wall,-answers.v1,"ideal wall reflects direction");
        assert(answers.wall>answers.v2,"the first cart must catch the second");
        near(p.m1*answers.wall+p.m2*answers.v2,(p.m1+p.m2)*answers.V,"second plastic momentum");
        near(answers.V**2,2*p.mu*p.g*answers.s,"post collision friction");
        near(answers.Q,0.5*p.m1*answers.wall**2+0.5*p.m2*answers.v2**2-0.5*(p.m1+p.m2)*answers.V**2,"loss at second cart collision");
        assert(answers.Q>0,"positive plastic collision loss");
        break;
      default: throw new Error("Unhandled family: "+family.id);
    }
    variants++;
  }
}
console.log("Ormi2 challenge QA passed: "+CHALLENGES.length+" families, "+variants+" variants, "+checks+" verified numeric answers; momentum & energy invariants checked.");
