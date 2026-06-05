const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const root = process.cwd();
const scanDirs = ["app", "components", "content", "lib", "schema"].filter((d) =>
  fs.existsSync(path.join(root, d))
);

const exts = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".json", ".cjs", ".mjs"]);
const imageRegex = /https?:\/\/chioshotel\.gr\/wp-content\/uploads\/[^"'`\s)]+?\.(?:webp|jpg|jpeg|png|gif|svg)/gi;

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (exts.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

function folderFor(url, sources) {
  const s = sources.join(" ").toLowerCase();
  const u = url.toLowerCase();

  if (s.includes("room") || s.includes("rooms") || s.includes("find-your-room")) return "rooms";
  if (s.includes("beach") || u.includes("beach") || u.includes("paralia")) return "beaches";
  if (s.includes("village") || s.includes("xoria")) return "villages";
  if (s.includes("museum") || s.includes("museums") || u.includes("mousio") || u.includes("mastic")) return "museums";
  if (s.includes("activit") || s.includes("hiking") || s.includes("thermal") || s.includes("orchid") || s.includes("rocket") || s.includes("mostra")) return "activities";
  if (s.includes("family")) return "family";
  if (s.includes("taste")) return "taste";
  if (s.includes("chios-island") || s.includes("chios-explorer")) return "chios-guide";
  return "site";
}

function safeName(url, used) {
  const parsed = new URL(url);
  let base = decodeURIComponent(path.basename(parsed.pathname));
  base = base.replace(/[^\w.\-]+/g, "-");
  const ext = path.extname(base);
  const stem = path.basename(base, ext) || "image";
  let name = stem + ext.toLowerCase();
  let i = 2;
  while (used.has(name.toLowerCase())) {
    name = `${stem}-${i}${ext.toLowerCase()}`;
    i++;
  }
  used.add(name.toLowerCase());
  return name;
}

function download(url, outPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(outPath)) return resolve("skip");

    const client = url.startsWith("https:") ? https : http;
    const file = fs.createWriteStream(outPath);

    client
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          fs.unlinkSync(outPath);
          return download(res.headers.location, outPath).then(resolve).catch(reject);
        }

        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(outPath);
          return reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        }

        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve("downloaded");
        });
      })
      .on("error", (err) => {
        file.close();
        if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
        reject(err);
      });
  });
}

async function main() {
  const found = new Map();

  for (const dir of scanDirs) {
    for (const file of walk(path.join(root, dir))) {
      const rel = path.relative(root, file).replace(/\\/g, "/");
      const text = fs.readFileSync(file, "utf8");
      const matches = text.match(imageRegex) || [];

      for (const raw of matches) {
        const url = raw.replace(/[),.;]+$/, "");
        if (!found.has(url)) found.set(url, new Set());
        found.get(url).add(rel);
      }
    }
  }

  const usedByFolder = {};
  const map = [];

  for (const [url, sourceSet] of found.entries()) {
    const sources = Array.from(sourceSet);
    const folder = folderFor(url, sources);
    usedByFolder[folder] ||= new Set();

    const filename = safeName(url, usedByFolder[folder]);
    const localRel = path.posix.join("/images", folder, filename);
    const outDir = path.join(root, "public", "images", folder);
    const outPath = path.join(outDir, filename);

    fs.mkdirSync(outDir, { recursive: true });

    try {
      const result = await download(url, outPath);
      console.log(`${result === "skip" ? "SKIP" : "GET "} ${localRel}`);
      map.push({ old: url, local: localRel, sources });
    } catch (err) {
      console.error(`FAIL ${url}`);
      console.error(err.message);
    }
  }

  fs.writeFileSync(
    path.join(root, "image-url-map.json"),
    JSON.stringify(map, null, 2),
    "utf8"
  );

  console.log("");
  console.log(`Found URLs: ${found.size}`);
  console.log(`Mapped/downloaded: ${map.length}`);
  console.log("Map written to image-url-map.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
