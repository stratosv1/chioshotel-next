const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const WRONG_VESSA_IMAGE =
  "/images/villages/29651245457_aa8f702ef7_b-768x432.webp";

// Public-domain Pyrgi photo (Wikimedia Commons, Pyrgi house1.JPG).
// Use one central URL everywhere Pyrgi is rendered or exposed in metadata.
const PYRGI_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Pyrgi_house1.JPG/1280px-Pyrgi_house1.JPG";

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function write(relativePath, content) {
  fs.writeFileSync(path.join(ROOT, relativePath), content, "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function patchHubImage() {
  const file = "content/chios-villages.ts";
  const source = read(file);
  const pyrgiPattern = new RegExp(
    `(pyrgi:\\s*\\n\\s*\")${escapeRegExp(WRONG_VESSA_IMAGE)}(\")`,
  );

  let next = source;
  if (pyrgiPattern.test(source)) {
    next = source.replace(pyrgiPattern, `$1${PYRGI_IMAGE}$2`);
  }

  if (!next.includes(`pyrgi:\n    \"${PYRGI_IMAGE}\"`)) {
    throw new Error("Could not verify the central Pyrgi village-card image.");
  }

  // Vessa must continue to use its own existing photo.
  if (!next.includes(`vessa:\n    \"${WRONG_VESSA_IMAGE}\"`)) {
    throw new Error("Vessa image mapping changed unexpectedly.");
  }

  if (next !== source) write(file, next);
  return next !== source;
}

function patchBlocksByKey(relativePath, keyName) {
  const source = read(relativePath);
  const lines = source.split("\n");
  let inPyrgiBlock = false;
  let replaced = 0;
  let verified = 0;

  const keyPattern = new RegExp(`^\\s*${keyName}:\\s*\"([^\"]+)\"`);

  const nextLines = lines.map((line) => {
    const keyMatch = line.match(keyPattern);
    if (keyMatch) {
      inPyrgiBlock = /pyrgi/i.test(keyMatch[1]);
    }

    if (!inPyrgiBlock) return line;

    if (line.includes(PYRGI_IMAGE)) {
      verified += 1;
      return line;
    }

    if (line.includes(WRONG_VESSA_IMAGE)) {
      replaced += 1;
      verified += 1;
      return line.replace(WRONG_VESSA_IMAGE, PYRGI_IMAGE);
    }

    return line;
  });

  if (verified === 0) {
    throw new Error(`No Pyrgi image references were verified in ${relativePath}.`);
  }

  const next = nextLines.join("\n");
  if (next !== source) write(relativePath, next);

  return { changed: next !== source, replaced, verified };
}

function assertNoPyrgiVessaLeak(relativePath, keyName) {
  const lines = read(relativePath).split("\n");
  let inPyrgiBlock = false;
  const keyPattern = new RegExp(`^\\s*${keyName}:\\s*\"([^\"]+)\"`);

  for (const line of lines) {
    const keyMatch = line.match(keyPattern);
    if (keyMatch) {
      inPyrgiBlock = /pyrgi/i.test(keyMatch[1]);
    }

    if (inPyrgiBlock && line.includes(WRONG_VESSA_IMAGE)) {
      throw new Error(
        `Pyrgi still points to the Vessa image in ${relativePath}: ${line.trim()}`,
      );
    }
  }
}

const hubChanged = patchHubImage();
const detailsResult = patchBlocksByKey("content/village-details.ts", "slug");
const plannerResult = patchBlocksByKey("content/trip-planner/villages.ts", "id");

assertNoPyrgiVessaLeak("content/village-details.ts", "slug");
assertNoPyrgiVessaLeak("content/trip-planner/villages.ts", "id");

console.log(
  `Pyrgi image patch OK: hub=${hubChanged ? "updated" : "already-correct"}, ` +
    `details=${detailsResult.replaced} replacements/${detailsResult.verified} verified, ` +
    `trip-planner=${plannerResult.replaced} replacements/${plannerResult.verified} verified.`,
);
