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
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  });
  const errors = (result.diagnostics || []).filter(diagnostic => diagnostic.category === ts.DiagnosticCategory.Error);
  if (errors.length) {
    throw new Error(errors.map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")).join("\n"));
  }
  return result.outputText;
}

function execute(output, localRequire = require) {
  const module = { exports: {} };
  new Function("exports", "module", "require", output)(module.exports, module, localRequire);
  return module.exports;
}

const root = process.cwd();
const copyPath = path.join(root, "components/ai/room-finder-copy.ts");
const tonePath = path.join(root, "components/ai/room-finder-tone.ts");
const localizationPath = path.join(root, "components/ai/room-finder-message-localization.ts");
const chatPath = path.join(root, "components/ai/room-finder-chat-ui.tsx");

const copy = execute(transpile(copyPath));
const tone = execute(transpile(tonePath));
const localization = execute(transpile(localizationPath), id => {
  if (id === "./room-finder-copy") return copy;
  if (id === "./room-finder-tone") return tone;
  return require(id);
});

const welcome = { id: "a", role: "assistant", content: copy.ROOM_FINDER_COPY.el.welcome };
const welcomeEn = localization.relocalizeRoomFinderMessageToLanguage(welcome, "en");
assert(welcomeEn.content === copy.ROOM_FINDER_COPY.en.welcome, "Greek welcome did not relocalize to English");

const user = { id: "u", role: "user", content: "10–13 Σεπτεμβρίου, 2 άτομα" };
const userEn = localization.relocalizeRoomFinderMessageToLanguage(user, "en");
assert(userEn.content === user.content, "language switch modified the guest's original message");
assert(userEn === user, "language switch unnecessarily cloned a user message");

const guestPrompt = { id: "g", role: "assistant", content: tone.ROOM_FINDER_TONE.el.guests(2) };
assert(
  localization.relocalizeRoomFinderMessageToLanguage(guestPrompt, "de").content === tone.ROOM_FINDER_TONE.de.guests(2),
  "guest-allocation prompt did not relocalize to German",
);

const resultPrompt = { id: "r", role: "assistant", content: tone.ROOM_FINDER_TONE.el.results(1, 3) };
assert(
  localization.relocalizeRoomFinderMessageToLanguage(resultPrompt, "tr").content === tone.ROOM_FINDER_TONE.tr.results(1, 3),
  "results prompt did not relocalize to Turkish",
);

const unknown = { id: "x", role: "assistant", content: "Custom reception message" };
assert(
  localization.relocalizeRoomFinderMessageToLanguage(unknown, "en") === unknown,
  "custom/non-canned assistant message was unexpectedly translated",
);

const batch = localization.relocalizeRoomFinderMessages([welcome, user], "el", "fr");
assert(batch[0].content === copy.ROOM_FINDER_COPY.fr.welcome, "batch relocalization did not translate welcome");
assert(batch[1].content === user.content, "batch relocalization modified guest text");

const chatSource = fs.readFileSync(chatPath, "utf8");
assert(chatSource.includes("relocalizeRoomFinderMessageToLanguage(message, displayLanguage)"), "chat rendering is not wired to deterministic prompt relocalization");
assert(chatSource.includes("const queryLanguage = new URLSearchParams(window.location.search)"), "chat rendering does not prioritize the selected ?lang= locale during the same render");

console.log("Room Finder language-switch QA passed: canned prompts relocalize deterministically while guest/custom messages remain unchanged.");
