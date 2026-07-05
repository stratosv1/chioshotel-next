const fs = require("fs");

const file = "app/layout.tsx";
const backup = `${file}.backup-fix-isPreArrivalPage-${new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14)}`;

let s = fs.readFileSync(file, "utf8");
fs.writeFileSync(backup, s, "utf8");

if (!s.includes("const isPreArrivalPage =")) {
  s = s.replace(
`  const htmlLanguage = getHtmlLanguage(pathname);

  return (`,
`  const htmlLanguage = getHtmlLanguage(pathname);
  const normalizedPathname = pathname.endsWith("/") ? pathname : \`\${pathname}/\`;
  const isPreArrivalPage =
    normalizedPathname === "/pre-arrival/" ||
    normalizedPathname.endsWith("/pre-arrival/");

  return (`
  );
}

fs.writeFileSync(file, s, "utf8");

console.log("Fixed isPreArrivalPage in app/layout.tsx");
console.log("Backup:", backup);
