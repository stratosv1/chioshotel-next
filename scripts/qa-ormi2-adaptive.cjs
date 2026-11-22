/**
 * QA for Ormi2 skill diagnoses. Focus on no false mastery,
 * older-record independence, storage validation, and working recommendations.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function loadTs(relative) {
  const file = path.join(__dirname, "..", relative);
  const raw = fs.readFileSync(file, "utf8");
  const script = ts.transpileModule(raw, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const values = new Map();
  const mockWindow = {
    localStorage: {
      getItem(k) { return values.has(k) ? values.get(k) : null; },
      setItem(k,v) { values.set(k,v); },
    },
    dispatchEvent() {},
  };
  const ctx = { exports: {}, window: mockWindow, Event: class Event { constructor(type) { this.type=type; } }, Math, Intl, Date, JSON, Set };
  vm.runInNewContext(script, ctx, { timeout: 3000, filename: relative });
  return ctx.exports;
}

const data = loadTs("components/mixalis/ormi2/learning-data.ts");
const challenges = loadTs("components/mixalis/ormi2/challenges-data.ts");
const now = 1795349999999;

assert.equal(data.SKILLS.length, 12);
assert.equal(new Set(data.SKILLS.map((s) => s.id)).size, 12);
assert.equal(data.normalizeSkillEvents({}).length, 0);
assert.equal(data.normalizeSkillEvents("wrong").length, 0);
assert.equal(data.readSkillEvents().length, 0);
assert.equal(data.summarizeSkills([]).every((s) => s.state === "not-started"), true);

const skills = data.NUMERIC_STEP_SKILLS;
for (const family of challenges.CHALLENGES) {
  const known = skills[family.id] || {};
  assert.equal(Object.keys(known).sort().join(","), challenges.solveChallenge(family, family.variants[0]).steps.map((s) => s.id).sort().join(","), "Incomplete skills mapping for " + family.id);
  for (const ids of Object.values(known)) {
    assert(ids.length);
    assert(ids.every((id) => data.SKILLS.some((s) => s.id === id)));
  }
}

const first = { cuts: false, laws: true, start: null };
const final = { cuts: true, laws: true, start: null };
const hints = { cuts: 0, laws: 0, start: 3 };
const pe = data.phaseSkillEvents("s1", final, first, hints, now);
assert.equal(pe.length, 3);
assert.equal(pe[0].skill, "phases");
assert.equal(pe[0].correct, true);
assert.equal(pe[0].independent, false, "A corrected error cannot count as autonomous");
assert.equal(pe[0].mistakes, 1);
assert.equal(pe[1].independent, true);
assert.equal(pe[2].correct, false);

const nr = data.numericSkillEvents("bounce-force", "a", [
  {stepId:"down", mistakes:0, hints:0, revealed:false, correct:true},
  {stepId:"up", mistakes:2, hints:0, revealed:false, correct:true},
  {stepId:"F", mistakes:0, hints:3, revealed:true, correct:true},
], now);
assert.equal(nr.length, 5);
assert.equal(nr.find((e) => e.skill === "impulse").correct, false);
assert.equal(nr.find((e) => e.skill === "impulse").independent, false);
assert.equal(nr.filter((e) => e.skill === "mechanical" && e.independent).length, 1);

const valid = data.normalizeSkillEvents([...pe, ...nr, {v:1, source:"phases", item:"bad", skill:"wrong", correct:true, independent:true, hints:0, mistakes:0, at:now}]);
assert.equal(valid.length, 8);
data.appendSkillEvents([...pe, ...nr]);
assert.equal(data.readSkillEvents().length, 8);
const summary = data.summarizeSkills(data.readSkillEvents());
const phase = summary.find((s) => s.skill === "phases");
assert.equal(phase.attempts, 1);
assert.equal(phase.guided, 1);
assert.equal(phase.state, "practice");

const independent = (item, at) => ({
  v:1, source:"numeric",item,skill:"momentum",
  correct:true,independent:true,hints:0,mistakes:0,at,
});
const one = data.summarizeSkills([independent("same:a",now), independent("same:a",now+1)]);
assert.notEqual(one.find((s) => s.skill === "momentum").state, "strong", "Repeating one task must not prove transfer");
const two = data.summarizeSkills([independent("one:a",now), independent("two:b",now+1)]);
assert.equal(two.find((s) => s.skill === "momentum").state, "strong");
const later = data.nextSkillForPractice(two, now + 10_000);
assert(later && later.skill !== "momentum", "recommend unseen skill before recently mastered one");
const due = data.nextSkillForPractice(two.filter((s)=>s.skill==="momentum"), now + 5*86400000);
assert.equal(due.skill, "momentum", "return mastered skill for review after 3 days");

const truncated = data.normalizeSkillEvents(Array.from({length:650},(_,i)=>independent("i"+i,now+i)));
assert.equal(truncated.length, data.MAX_EVENTS);
assert.equal(truncated[0].item, "i50");
console.log("Ormi2 adaptive QA passed: 12 skill categories, 8 mapped families, first-try grading, hints, local storage, recency, and mastery transfer.");
