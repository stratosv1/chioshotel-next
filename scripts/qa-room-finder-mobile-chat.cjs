#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const root = process.cwd();
const production = fs.readFileSync(path.join(root, "components/ai/RoomFinderProduction.tsx"), "utf8");
const page = fs.readFileSync(path.join(root, "app/ai-assistant/page.tsx"), "utf8");
const pageLocalization = fs.readFileSync(path.join(root, "lib/ai-assistant/page-localization.ts"), "utf8");
const hook = fs.readFileSync(path.join(root, "components/ai/use-room-finder.ts"), "utf8");

assert(production.includes("window.visualViewport"), "Room Finder is missing VisualViewport keyboard handling");
assert(production.includes('data-room-finder-shell="true"'), "Room Finder mobile shell marker is missing");
assert(production.includes("--rf-visual-height"), "Room Finder visual viewport height variable is missing");
assert(production.includes("--rf-visual-offset-top"), "Room Finder visual viewport offset handling is missing");
assert(production.includes('data-keyboard-open="false"'), "Room Finder keyboard state marker is missing");
assert(production.includes("env(safe-area-inset-bottom)"), "Room Finder bottom safe-area protection is missing");
assert(production.includes("env(safe-area-inset-top)"), "Room Finder top safe-area protection is missing");
assert(production.includes('enterKeyHint="send"'), "Room Finder mobile send keyboard hint is missing");
assert(production.includes("onPointerDown={event => event.preventDefault()}"), "Send button no longer preserves composer focus");
assert(production.includes("aria-disabled={!inputEnabled}"), "Composer busy semantics are missing");
assert(production.includes("<textarea"), "Composer is no longer a multi-line chat textarea");
assert(production.includes('event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing'), "Composer no longer sends on Enter while keeping Shift+Enter and IME composition safe");
assert(production.includes("onChange={event => finder.setInput(event.target.value)}"), "Composer drops what the guest types while the assistant is replying");
assert(production.includes("disabled={!inputEnabled || !finder.input.trim()}"), "Send button is no longer blocked while the assistant is replying");
assert(production.includes("stickToBottomRef"), "Conversation no longer pauses auto-scroll while the guest reads earlier messages");
assert(production.includes("text-[16px]"), "Composer is below the iOS-safe 16px text size");
assert(production.includes("overscroll-contain"), "Conversation scroller is missing overscroll containment");
assert(production.includes("fixed inset-x-0 top-0"), "Room Finder is no longer pinned to the visible viewport");
assert(!production.includes("disabled={!inputEnabled}\n            placeholder"), "Composer input is still disabled during AI turns and can dismiss the mobile keyboard");

assert(hook.includes("turnLocked.current = true;\n    setTyping(true);"), "Composer is not locked immediately when a user turn starts");
assert(hook.includes("turnLocked.current = false;\n    setTyping(false);"), "Composer is not unlocked when the assistant turn ends");

assert(pageLocalization.includes('interactiveWidget: "resizes-content"'), "AI Room Finder viewport does not request keyboard content resizing");
assert(pageLocalization.includes('viewportFit: "cover"'), "AI Room Finder viewport is missing safe-area cover support");
assert(!page.includes("RoomFinderAutoFocus"), "Legacy programmatic keyboard reopening is still mounted");
const experience = fs.readFileSync(path.join(root, "components/ai/AiAssistantExperience.tsx"), "utf8");
assert(!experience.includes("RoomFinderResultsViewportGuard"), "Composer-locking results viewport guard is mounted again");

console.log("Room Finder Android/iOS mobile chat QA passed.");
