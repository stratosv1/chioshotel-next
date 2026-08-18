const fs = require("node:fs");
const path = require("node:path");

const proxyPath = path.join(process.cwd(), "proxy.ts");
const redirectEntry = '  "/pre arrival": "/pre-arrival/",';

let source = fs.readFileSync(proxyPath, "utf8");

if (source.includes('"/pre arrival": "/pre-arrival/"')) {
  console.log("Pre-arrival legacy redirect already applied.");
  process.exit(0);
}

const functionIndex = source.indexOf("function normalizeLegacyPathname");
if (functionIndex === -1) {
  throw new Error("normalizeLegacyPathname anchor not found");
}

const mapEnd = source.lastIndexOf("\n};", functionIndex);
if (mapEnd === -1) {
  throw new Error("legacyRedirects closing anchor not found");
}

const block = [
  "",
  "  // Legacy malformed URL: /pre%20arrival/ -> canonical private pre-arrival page",
  redirectEntry,
].join("\n");

source = source.slice(0, mapEnd) + block + source.slice(mapEnd);
fs.writeFileSync(proxyPath, source, "utf8");
console.log("Pre-arrival legacy redirect applied.");
