const { spawn } = require("node:child_process");

const baseUrl = "http://127.0.0.1:3000";
const targetUrl = `${baseUrl}/el/`;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, attempts = 30) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: "follow" });
      if (response.ok) {
        return response.text();
      }
      lastError = new Error(`HTTP ${response.status} for ${url}`);
    } catch (error) {
      lastError = error;
    }

    await delay(1000);
  }

  throw lastError || new Error(`Unable to fetch ${url}`);
}

function extractJsonLd(html) {
  const matches = [
    ...html.matchAll(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];

  assert(matches.length > 0, "No JSON-LD scripts found in rendered Greek homepage HTML.");

  return matches.map((match) => JSON.parse(match[1]));
}

function graphNodes(jsonLdDocuments) {
  return jsonLdDocuments.flatMap((document) =>
    Array.isArray(document?.["@graph"]) ? document["@graph"] : [document],
  );
}

function typeIncludes(node, type) {
  const nodeType = node?.["@type"];
  return Array.isArray(nodeType) ? nodeType.includes(type) : nodeType === type;
}

async function main() {
  const server = spawn(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["run", "start", "--", "-H", "127.0.0.1", "-p", "3000"],
    {
      env: {
        ...process.env,
        NODE_ENV: "production",
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let serverOutput = "";
  server.stdout.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });

  try {
    const html = await fetchWithRetry(targetUrl);
    const documents = extractJsonLd(html);
    const nodes = graphNodes(documents);

    const lodging = nodes.find((node) => typeIncludes(node, "LodgingBusiness"));
    const breadcrumb = nodes.find((node) => typeIncludes(node, "BreadcrumbList"));
    const itemList = nodes.find((node) => typeIncludes(node, "ItemList"));
    const accommodations = nodes.filter((node) => typeIncludes(node, "Accommodation"));
    const primaryImage = nodes.find(
      (node) =>
        typeIncludes(node, "ImageObject") &&
        typeof node?.["@id"] === "string" &&
        node["@id"].includes("/el/#primaryimage"),
    );

    assert(lodging, "Rendered schema is missing LodgingBusiness.");
    assert(lodging.inLanguage === "el", "LodgingBusiness must have inLanguage=el.");

    assert(breadcrumb, "Rendered schema is missing BreadcrumbList.");
    assert(breadcrumb.inLanguage === "el", "BreadcrumbList must have inLanguage=el.");
    assert(
      breadcrumb.itemListElement?.[0]?.name === "Αρχική",
      "Greek breadcrumb must start with Αρχική.",
    );
    assert(
      breadcrumb.itemListElement?.[0]?.item === "https://chioshotel.gr/el/",
      "Greek breadcrumb must point to https://chioshotel.gr/el/.",
    );

    assert(primaryImage, "Rendered schema is missing the Greek primary ImageObject.");
    assert(primaryImage.inLanguage === "el", "Primary ImageObject must have inLanguage=el.");

    assert(itemList, "Rendered schema is missing the homepage ItemList.");
    assert(itemList.inLanguage === "el", "Homepage ItemList must have inLanguage=el.");

    assert(accommodations.length === 3, "Greek homepage must render exactly three Accommodation nodes.");
    for (const accommodation of accommodations) {
      assert(
        accommodation.inLanguage === "el",
        `Accommodation ${accommodation.name || accommodation["@id"]} must have inLanguage=el.`,
      );
      assert(
        typeof accommodation.url === "string" &&
          accommodation.url.startsWith("https://chioshotel.gr/el/"),
        `Accommodation ${accommodation.name || accommodation["@id"]} must use a Greek URL.`,
      );
    }

    const serialized = JSON.stringify(documents);
    for (const malformed of [
      '"ωρεάν WiFi"',
      '"σύρματη πρόσβαση στο διαδίκτυο για τους επισκέπτες"',
      '"λιματισμός"',
      '"διωτικό μπάνιο"',
      '"ηλεόραση επίπεδης οθόνης"',
      '"ήπος και βεράντα"',
      '"ιαθέσιμος χώρος στάθμευσης"',
      '"πηρεσία καθαριότητας"',
    ]) {
      assert(!serialized.includes(malformed), `Rendered schema contains malformed Greek value: ${malformed}`);
    }

    console.log("Rendered Greek homepage JSON-LD checks passed.");
  } catch (error) {
    console.error(serverOutput);
    throw error;
  } finally {
    server.kill("SIGTERM");
    await delay(500);
    if (!server.killed) {
      server.kill("SIGKILL");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
