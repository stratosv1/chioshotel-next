#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function loadHelper() {
  const filePath = path.join(process.cwd(), "components/ai/room-finder-conversation-history.ts");
  const source = fs.readFileSync(filePath, "utf8");
  const output = ts.transpileModule(source, {
    fileName: filePath,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
    },
  }).outputText;
  const module = { exports: {} };
  new Function("exports", "module", "require", output)(module.exports, module, require);
  return module.exports;
}

const { rewindToAssistantPrompt } = loadHelper();

const assistant = (id, content) => ({ id, role: "assistant", content });
const user = (id, content, kind = "date") => ({ id, role: "user", content, kind });

function ids(messages) {
  return messages.map(message => message.id).join(",");
}

const checkinHistory = [
  assistant("welcome", "CHECKIN"),
  user("checkin-answer", "15/09"),
  assistant("checkout-question", "CHECKOUT"),
];
assert(
  ids(rewindToAssistantPrompt(checkinHistory, ["CHECKIN"])) === "welcome",
  "Back from checkout must remove the old check-in answer and checkout question",
);

const checkoutHistory = [
  assistant("welcome", "CHECKIN"),
  user("checkin-answer", "15/09"),
  assistant("checkout-question", "CHECKOUT"),
  user("checkout-answer", "16/09"),
  assistant("rooms-question", "ROOMS"),
];
assert(
  ids(rewindToAssistantPrompt(checkoutHistory, ["CHECKOUT"])) === "welcome,checkin-answer,checkout-question",
  "Back from rooms must restore the original checkout question without the old checkout answer",
);

const invalidCheckoutHistory = [
  assistant("welcome", "CHECKIN"),
  user("checkin-answer", "15/09"),
  assistant("checkout-question", "CHECKOUT"),
  user("bad-checkout", "14/09"),
  assistant("checkout-error", "INVALID CHECKOUT"),
  user("good-checkout", "16/09"),
  assistant("rooms-question", "ROOMS"),
];
assert(
  ids(rewindToAssistantPrompt(invalidCheckoutHistory, ["CHECKOUT"])) === "welcome,checkin-answer,checkout-question",
  "Back must remove all attempts made after the target step prompt",
);

const guestHistory = [
  assistant("guest-1", "GUESTS 1"),
  user("guest-1-answer", "3", "guest"),
  assistant("guest-2", "GUESTS 2"),
];
assert(
  ids(rewindToAssistantPrompt(guestHistory, ["GUESTS 1"])) === "guest-1",
  "Multi-room guest back must restore the previous room question cleanly",
);

console.log("Room Finder back-history QA passed.");
