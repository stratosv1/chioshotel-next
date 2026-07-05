const fs = require("fs");

const file = "app/layout.tsx";
const backup = `${file}.backup-force-prearrival-var-${new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14)}`;

let s = fs.readFileSync(file, "utf8");
fs.writeFileSync(backup, s, "utf8");

if (!s.includes("const isPreArrivalPage =")) {
  const marker = "  const htmlLanguage = getHtmlLanguage(pathname);\n";

  if (!s.includes(marker)) {
    throw new Error("Could not find htmlLanguage line in app/layout.tsx");
  }

  s = s.replace(
    marker,
    `${marker}  const normalizedPathname = pathname.endsWith("/") ? pathname : \`\${pathname}/\`;\n  const isPreArrivalPage =\n    normalizedPathname === "/pre-arrival/" ||\n    normalizedPathname.endsWith("/pre-arrival/");\n`
  );
}

fs.writeFileSync(file, s, "utf8");

console.log("Inserted isPreArrivalPage:", s.includes("const isPreArrivalPage =") ? "OK" : "MISSING");
console.log("Backup:", backup);
