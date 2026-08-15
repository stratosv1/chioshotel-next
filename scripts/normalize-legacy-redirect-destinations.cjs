const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const nextConfigPath = path.join(root, "next.config.ts");
const proxyPath = path.join(root, "proxy.ts");

function normalizeInternalDestination(value) {
  if (!value.startsWith("/") || value === "/") return value;

  const match = value.match(/^([^?#]*)([?#].*)?$/);
  if (!match) return value;

  const pathname = match[1] || "/";
  const suffix = match[2] || "";
  if (pathname.endsWith("/")) return value;

  const lastSegment = pathname.split("/").pop() || "";
  if (/\.[a-z0-9]{1,10}$/i.test(lastSegment)) return value;

  return `${pathname}/${suffix}`;
}

function normalizeNextConfig() {
  if (!fs.existsSync(nextConfigPath)) return 0;
  const source = fs.readFileSync(nextConfigPath, "utf8");
  let changed = 0;

  const output = source.replace(
    /((?:"destination"|destination)\s*:\s*")([^"]+)(")/g,
    (full, prefix, destination, suffix) => {
      const normalized = normalizeInternalDestination(destination);
      if (normalized !== destination) changed += 1;
      return `${prefix}${normalized}${suffix}`;
    },
  );

  if (output !== source) fs.writeFileSync(nextConfigPath, output, "utf8");
  return changed;
}

function normalizeProxyRedirectMap() {
  if (!fs.existsSync(proxyPath)) return 0;
  const source = fs.readFileSync(proxyPath, "utf8");
  const start = source.indexOf("const legacyRedirects");
  if (start < 0) return 0;
  const end = source.indexOf("\n};", start);
  if (end < 0) return 0;

  const before = source.slice(0, start);
  const block = source.slice(start, end + 3);
  const after = source.slice(end + 3);
  let changed = 0;

  const normalizedBlock = block.replace(/(:\s*")([^"]+)("\s*,?)/g, (full, prefix, destination, suffix) => {
    const normalized = normalizeInternalDestination(destination);
    if (normalized !== destination) changed += 1;
    return `${prefix}${normalized}${suffix}`;
  });

  const output = `${before}${normalizedBlock}${after}`;
  if (output !== source) fs.writeFileSync(proxyPath, output, "utf8");
  return changed;
}

const nextChanges = normalizeNextConfig();
const proxyChanges = normalizeProxyRedirectMap();
console.log(`Normalized legacy redirect destinations: next.config=${nextChanges}, proxy=${proxyChanges}`);
