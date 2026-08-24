const fs = require("node:fs");
const path = require("node:path");

const configPath = path.join(process.cwd(), "next.config.ts");
const source = fs.readFileSync(configPath, "utf8");

const startMarker = "const legacyRedirects = [";
const start = source.indexOf(startMarker);
const end = source.indexOf("];", start + startMarker.length);

if (start === -1 || end === -1) {
  throw new Error("Could not locate legacyRedirects in next.config.ts");
}

const block = source.slice(start + startMarker.length, end);
const redirects = [];
const entryPattern = /\{\s*(?:"?source"?)\s*:\s*(["'])(.*?)\1\s*,\s*(?:"?destination"?)\s*:\s*(["'])(.*?)\3\s*,\s*(?:"?permanent"?)\s*:\s*true\s*,?\s*\}/gs;

let match;
while ((match = entryPattern.exec(block)) !== null) {
  redirects.push({ source: match[2], destination: match[4] });
}

if (redirects.length === 0) {
  throw new Error("No legacy redirects could be parsed from next.config.ts");
}

const bySource = new Map();
const duplicateSources = [];
const selfRedirects = [];
const malformed = [];

for (const redirect of redirects) {
  if (!redirect.source.startsWith("/") || !redirect.destination.startsWith("/")) {
    malformed.push(redirect);
  }

  const normalizedSource = normalizePath(redirect.source);
  const normalizedDestination = normalizePath(redirect.destination);

  if (normalizedSource === normalizedDestination) {
    selfRedirects.push(redirect);
  }

  const existing = bySource.get(redirect.source);
  if (existing) {
    duplicateSources.push({
      source: redirect.source,
      destinations: [existing.destination, redirect.destination],
    });
  } else {
    bySource.set(redirect.source, redirect);
  }
}

const sources = new Set(redirects.map((redirect) => normalizePath(redirect.source)));
const chains = redirects.filter((redirect) =>
  sources.has(normalizePath(redirect.destination)),
);

if (duplicateSources.length) {
  console.error("Duplicate legacy redirect sources found:");
  for (const duplicate of duplicateSources) {
    console.error(`  ${duplicate.source} -> ${duplicate.destinations.join(" | ")}`);
  }
}

if (selfRedirects.length) {
  console.error("Self redirects found:");
  for (const redirect of selfRedirects) {
    console.error(`  ${redirect.source} -> ${redirect.destination}`);
  }
}

if (malformed.length) {
  console.error("Malformed legacy redirects found:");
  for (const redirect of malformed) {
    console.error(`  ${redirect.source} -> ${redirect.destination}`);
  }
}

if (chains.length) {
  console.warn(`Redirect chains to review: ${chains.length}`);
  for (const redirect of chains.slice(0, 20)) {
    console.warn(`  ${redirect.source} -> ${redirect.destination}`);
  }
  if (chains.length > 20) {
    console.warn(`  ...and ${chains.length - 20} more`);
  }
}

console.log(`Legacy redirects parsed: ${redirects.length}`);

if (duplicateSources.length || selfRedirects.length || malformed.length) {
  process.exitCode = 1;
} else {
  console.log("Legacy redirect QA passed.");
}

function normalizePath(value) {
  if (value === "/") return "/";
  return value.endsWith("/") ? value.slice(0, -1) : value;
}
