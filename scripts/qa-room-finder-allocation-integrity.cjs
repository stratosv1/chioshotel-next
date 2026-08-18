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
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
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

const root = process.cwd();
const datePath = path.join(root, "lib/ai-assistant/room-finder-date.ts");
const flowPath = path.join(root, "components/ai/room-finder-booking-flow.ts");
const date = execute(transpile(datePath));
const flow = execute(transpile(flowPath), id => {
  if (id === "@/lib/ai-assistant/room-finder-date") return date;
  return require(id);
});

function command(actions, language = "el") {
  return { language, replyMode: "execute", actions };
}

let state = flow.resolveAssistantTurn(
  flow.createInitialBookingFlowState(),
  command([
    { type: "set_stay_dates", checkin: "2026-10-10", checkout: "2026-10-12" },
    { type: "set_room_count", roomCount: 2 },
    { type: "set_guest_count", totalGuests: 5 },
  ]),
).state;
assert(state.step === "guests" && state.draft.totalGuests === 5, "2 rooms / 5 guests setup failed");

state = flow.resolveAssistantTurn(state, command([
  { type: "set_guest_count", guestRoom: 1, guests: 5 },
])).state;
assert(state.draft.totalGuests === 5, "assigning room 1 silently rewrote the booking total");

const conflicting = flow.resolveAssistantTurn(state, command([
  { type: "set_guest_count", guestRoom: 2, guests: 1 },
]));
assert(conflicting.outcome.kind === "clarification", "5+1 room allocation did not trigger a clarification against totalGuests=5");
assert(conflicting.state.step === "guests", "allocation conflict did not remain in guest-allocation step");
assert(conflicting.state.draft.totalGuests === 5, "allocation conflict silently changed totalGuests from 5 to 6");

let compatible = flow.resolveAssistantTurn(
  flow.createInitialBookingFlowState(),
  command([
    { type: "set_stay_dates", checkin: "2026-10-10", checkout: "2026-10-12" },
    { type: "set_room_count", roomCount: 2 },
    { type: "set_guest_count", totalGuests: 5 },
    { type: "set_guest_count", guestRoom: 1, guests: 2 },
    { type: "set_guest_count", guestRoom: 2, guests: 3 },
  ]),
);
assert(compatible.outcome.kind === "ready", "valid 2+3 allocation for totalGuests=5 did not become ready");
assert(compatible.state.draft.totalGuests === 5, "valid allocation changed the declared total");

const allocationOnly = flow.resolveAssistantTurn(
  flow.createInitialBookingFlowState(),
  command([
    { type: "set_stay_dates", checkin: "2026-10-10", checkout: "2026-10-12" },
    { type: "set_room_count", roomCount: 2 },
    { type: "set_guest_count", guestRoom: 1, guests: 2 },
    { type: "set_guest_count", guestRoom: 2, guests: 3 },
  ]),
);
assert(allocationOnly.outcome.kind === "ready", "explicit complete room allocation without top-level total did not become ready");
assert(allocationOnly.state.draft.totalGuests === 5, "complete per-room allocation did not derive totalGuests=5 when no total was declared");

console.log("Room Finder allocation integrity QA passed: declared totals and per-room assignments cannot silently diverge.");
