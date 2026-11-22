/**
 * Ensures that each of the 36 Ormi2 scenarios has a UNIQUE, correct existing
 * physics SVG animation from the original Ormi lesson. Prevents silent fallback
 * to text-only placeholders or accidental pairing with a different exercise.
 */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

function read(file) {
  return fs.readFileSync(path.join(__dirname, "..", file), "utf8");
}

const baseQuiz = read("components/mixalis/ormi/OrmiPhaseQuiz.tsx");
const extraQuiz = read("components/mixalis/ormi/sintheta/extra-quiz.ts");
const baseStories = read("components/mixalis/ormi/sintheta/stories.tsx");
const extraStories = read("components/mixalis/ormi/sintheta/extra-stories.tsx");
const motion = read("components/mixalis/ormi2/Ormi2MotionScene.tsx");
const trainer = read("components/mixalis/ormi2/Ormi2Trainer.tsx");

const quizzes = [baseQuiz, extraQuiz].flatMap((src) => [...src.matchAll(
  /^\s+id: "([^"]+)",\s*\n\s+title: "([^"]+)"/gm,
)].map((m) => ({ id: m[1], title: m[2] })));

const stories = [baseStories, extraStories].flatMap((src) => [...src.matchAll(
  /^const s(\d+): Story = \{\s*\n\s+n: (\d+),\s*\n\s+title: "([^"]+)"/gm,
)].map((m) => ({ declared: Number(m[1]), number: Number(m[2]), title: m[3] })));

const idsBody = motion.match(/export const SCENE_IDS = \[([\s\S]*?)\] as const;/);
assert(idsBody, "Explicit id mapping missing");
const ids = [...idsBody[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

assert.equal(quizzes.length, 36, "Expected 36 quiz scenarios");
assert.equal(stories.length, 36, "Expected 36 distinct animated stories");
assert.equal(ids.length, 36, "Every quiz scenario needs its own storyboard");
assert.equal(new Set(ids).size, 36, "Duplicate id in motion mapping");
assert.equal(new Set(quizzes.map((s) => s.id)).size, 36, "Duplicate quiz scenario id");

for (let i = 0; i < 36; i++) {
  const q = quizzes[i], s = stories[i];
  assert.equal(ids[i], q.id, "Motion/quiz id order mismatch at scenario " + (i + 1));
  assert.equal(s.declared, i + 1, "Story constant mismatch at scenario " + (i + 1));
  assert.equal(s.number, i + 1, "Story index mismatch at scenario " + (i + 1));
  assert.equal(s.title, q.title, "Wrong physics story for scenario " + (i + 1));
}
assert.equal((baseStories.match(/^\s*draw:\s*\(/gm)||[]).length, 17, "A base story is missing its SVG drawing");
assert.equal((extraStories.match(/^\s*draw:\s*\(/gm)||[]).length, 19, "An extra story is missing its SVG drawing");

for (const exact of [
  "elastic-slides", "tension-angle", "rocket-split", "bullet-floor", "pass-edge",
]) {
  assert(ids.includes(exact), "Missing motion of " + exact);
}
assert(motion.includes('story.draw(progress, { mode: "play", phase: -1 })'),
  "Observation scene must show the physical phenomenon without revealing the method");
assert(motion.includes('prefers-reduced-motion: reduce'),
  "Must respect reduced-motion preferences");
assert(motion.includes('type="range"') && motion.includes("requestAnimationFrame"),
  "Motion controls must support scrubbing and animation");
assert(!trainer.includes("function PhysicsScene("), "Remove text-only fallback renderer");
assert(trainer.includes("<Ormi2MotionScene key={s.id} scenario={s} />"),
  "Render the correct motion for every selected scenario across all solving stages");

console.log("Ormi2 motion QA passed: 36/36 scenario-to-story matches, 36 real SVG drawings, accessible animation controls, no text-only fallback.");
