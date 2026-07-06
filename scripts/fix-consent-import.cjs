const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "components", "analytics", "ConsentAnalytics.tsx");
let source = fs.readFileSync(filePath, "utf8");

const wrongImport = 'import { Analytics, track } from "@vercel/analytics/react";';
const correctImport = 'import { track } from "@vercel/analytics";\nimport { Analytics } from "@vercel/analytics/react";';

if (source.includes(wrongImport)) {
  source = source.replace(wrongImport, correctImport);
  fs.writeFileSync(filePath, source, "utf8");
}

const updated = fs.readFileSync(filePath, "utf8");
if (!updated.includes(correctImport)) {
  throw new Error("Consent analytics import was not fixed.");
}
