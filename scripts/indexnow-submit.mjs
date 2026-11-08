#!/usr/bin/env node
// Announces a list of changed URLs (one per line) to IndexNow.
//   node scripts/indexnow-submit.mjs changed.txt
// The key and host are read from lib/indexnow.ts so there is one source.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(ROOT, "lib", "indexnow.ts"), "utf8");
const key = /INDEXNOW_KEY\s*=\s*"([^"]+)"/.exec(source)?.[1];
const host = /INDEXNOW_HOST\s*=\s*"([^"]+)"/.exec(source)?.[1];
if (!key || !host) throw new Error("Could not read the IndexNow key/host from lib/indexnow.ts");

const file = process.argv[2];
const urls = file
  ? readFileSync(file, "utf8").split("\n").map((line) => line.trim()).filter(Boolean)
  : [];

if (!urls.length) {
  console.log("IndexNow: nothing to announce.");
  process.exit(0);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urls.slice(0, 10_000) }),
});

console.log(`IndexNow: ${urls.length} URL(s) → HTTP ${response.status}`);
if (response.status !== 200 && response.status !== 202) process.exitCode = 1;
