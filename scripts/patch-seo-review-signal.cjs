const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const enginePath = path.join(root, "lib", "seo-health", "engine.ts");
const fullAuditPath = path.join(root, "lib", "seo-health", "full-audit.ts");

function replaceAllRequired(filePath, before, after, expectedMinimum, label) {
  let source = fs.readFileSync(filePath, "utf8");
  const beforeCount = source.split(before).length - 1;

  if (beforeCount === 0) {
    if (source.includes(after)) return { changed: false, replacements: 0 };
    throw new Error(`SEO review-signal patch anchor not found: ${label}`);
  }

  if (beforeCount < expectedMinimum) {
    throw new Error(`SEO review-signal patch found only ${beforeCount}/${expectedMinimum} anchors: ${label}`);
  }

  source = source.split(before).join(after);
  fs.writeFileSync(filePath, source, "utf8");
  return { changed: true, replacements: beforeCount };
}

const engine = replaceAllRequired(
  enginePath,
  'if (decision.severity !== "healthy" && !decision.autoExecuted) summary.review += 1;',
  'if ((decision.severity === "warning" || decision.severity === "critical") && !decision.autoExecuted) summary.review += 1;',
  1,
  "engine actionable review count",
);

const fullAudit = replaceAllRequired(
  fullAuditPath,
  "count(*) filter (where severity <> 'healthy' and auto_executed = false)::integer as review,",
  "count(*) filter (where severity in ('warning', 'critical') and auto_executed = false)::integer as review,",
  2,
  "full-audit actionable review count",
);

console.log(
  `SEO review signal: engine=${engine.changed ? `patched(${engine.replacements})` : "already"}, full-audit=${fullAudit.changed ? `patched(${fullAudit.replacements})` : "already"}`,
);
