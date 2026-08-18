#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function transpile(filePath) {
  const result = ts.transpileModule(fs.readFileSync(filePath, "utf8"), {
    fileName: filePath,
    reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  });
  const errors = (result.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
  if (errors.length) throw new Error(errors.map(d => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("\n"));
  return result.outputText;
}

function execute(output, localRequire = require) {
  const module = { exports: {} };
  new Function("exports", "module", "require", output)(module.exports, module, localRequire);
  return module.exports;
}

function fact(actions, key) {
  return [...actions].reverse().find(action => action?.[key] != null)?.[key];
}

const root = process.cwd();
const datePath = path.join(root, "lib/ai-assistant/room-finder-date.ts");
const fallbackPath = path.join(root, "lib/ai-assistant/room-finder-fallback.ts");
const flowPath = path.join(root, "components/ai/room-finder-booking-flow.ts");
const intentPath = path.join(root, "lib/ai-assistant/room-finder-intent.ts");

const date = execute(transpile(datePath));
const fallback = execute(transpile(fallbackPath), id => id === "./room-finder-date" ? date : require(id));
const flow = execute(transpile(flowPath), id => id === "@/lib/ai-assistant/room-finder-date" ? date : require(id));

for (const [language, message] of [
  ["el", "10-13 Σεπτεμβρίου, 3 δωμάτια, 16 άτομα"],
  ["en", "September 10-13, 3 rooms, 16 guests"],
]) {
  const context = { language, currentStep: "checkin" };
  const command = fallback.fallbackRoomFinderCommand(message, context);
  assert(command?.actions?.length, `${language}: large-party parser returned no actions`);
  assert(Number(fact(command.actions, "roomCount")) === 3, `${language}: large-party parser lost room count`);
  assert(Number(fact(command.actions, "totalGuests")) === 16, `${language}: large-party parser did not preserve exact totalGuests=16`);
  assert(fallback.canUseDeterministicCommandDirectly(message, context, command), `${language}: large-party input still depends on AI`);
  const resolved = flow.resolveAssistantTurn(flow.createInitialBookingFlowState(), command);
  assert(resolved.outcome.kind === "clarification", `${language}: >15 guests did not hand off from automated flow`);
  assert(resolved.state.step === "unavailable", `${language}: >15 guests did not enter reception-handoff state`);
}

const intentSource = fs.readFileSync(intentPath, "utf8");
assert(intentSource.includes('totalGuests: { type: ["integer", "null"], minimum: 1, maximum: 99 }'), "AI schema still prevents exact >15 guest counts from reaching the state machine");
assert(intentSource.includes("15 or more") || intentSource.includes("more than 15") || intentSource.includes("above 15"), "AI prompt does not explicitly preserve large-party totals for handoff");

console.log("Room Finder large-party QA passed: real 16-guest input reaches deterministic reception handoff without clamping or loss.");
