const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const routeFile = path.join(root, "app/api/ai-assistant/route.ts");
const smartFile = path.join(root, "app/api/ai-assistant/smart/route.ts");
const chatFile = path.join(root, "components/ai/AiRoomChatPreview.tsx");

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, source) {
  fs.writeFileSync(file, source);
}

// 1) The AI interpreter must understand generic corrections semantically from context.
{
  let source = read(routeFile);
  const marker = "Generic correction messages must be resolved from conversational context";
  if (!source.includes(marker)) {
    const anchor = '                "The user\'s explicit semantic intent always overrides the question the assistant asked previously.",';
    if (!source.includes(anchor)) throw new Error("Semantic intent prompt anchor not found");
    const guidance = [
      '                "Generic correction messages must be resolved from conversational context, not from a hard-coded phrase list.",',
      '                "If the user says they made a mistake, were wrong, want to redo the previous answer, or otherwise signals a correction without naming a field, infer the field they mean from the immediately preceding booking exchange.",',
      '                "If check-in was just accepted and the assistant is now asking for check-out, a generic correction with no replacement value means the user wants to re-enter that just-provided check-in: use edit_search, put checkin in clearFields, and do not treat the message as an invalid check-out date.",',
      '                "More generally, a generic correction should target the most recently supplied booking field when the conversation makes that reference unambiguous.",',
    ].join("\n");
    source = source.replace(anchor, `${anchor}\n${guidance}`);
  }
  if (!source.includes(marker)) throw new Error("Semantic correction guidance was not applied");

  // A structured clear is authoritative. If the model also repeats an old value from context,
  // never re-apply that old value after clearing the field.
  if (!source.includes("const clearedFields = new Set<SearchField>")) {
    const applyPattern = /function applyDecision\(current: SearchState, decision: AiDecision\): SearchState \{[\s\S]*?\n\}\n\nfunction isBookingIntent/;
    if (!applyPattern.test(source)) throw new Error("applyDecision block not found");
    const applyReplacement = `function applyDecision(current: SearchState, decision: AiDecision): SearchState {
  const restarting = decision.intent === "restart_search";
  const next: SearchState = restarting
    ? { checkin: null, checkout: null, guests: null }
    : { ...current };
  const clearedFields = new Set<SearchField>(decision.clearFields || []);

  for (const field of clearedFields) {
    if (field === "checkin") next.checkin = null;
    if (field === "checkout") next.checkout = null;
    if (field === "guests") next.guests = null;
  }

  if (!restarting && !clearedFields.has("checkin") && isIsoDate(decision.checkin)) next.checkin = decision.checkin;
  if (!restarting && !clearedFields.has("checkout") && isIsoDate(decision.checkout)) next.checkout = decision.checkout;
  if (!restarting && !clearedFields.has("guests") && decision.guests >= 1 && decision.guests <= 5) next.guests = decision.guests;

  return next;
}

function isBookingIntent`;
    source = source.replace(applyPattern, applyReplacement);
  }
  if (!source.includes("const clearedFields = new Set<SearchField>")) {
    throw new Error("Authoritative semantic clear handling was not applied");
  }
  write(routeFile, source);
}

// 2) The active Room Finder explicitly marks its conversation mode so free-form date/correction
// messages reach the AI interpreter even when no booking value has been stored yet.
{
  let source = read(smartFile);
  if (!source.includes('body?.mode === "room_finder"')) {
    const anchor = "  return Boolean(\n    body?.selectedRoom ||";
    if (!source.includes(anchor)) throw new Error("Room scope context anchor not found");
    source = source.replace(
      anchor,
      '  return Boolean(\n    body?.mode === "room_finder" ||\n    body?.selectedRoom ||',
    );
  }
  if (!source.includes('body?.mode === "room_finder"')) throw new Error("Room Finder semantic mode was not applied");
  write(smartFile, source);
}

// 3) The live /ai-assistant UI used to run a second step-bound date parser after the backend.
// Replace that date branch so every free-text check-in/check-out message is interpreted by AI first,
// then the deterministic client state follows the structured search state returned by the server.
{
  let source = read(chatFile);
  const marker = 'mode: "room_finder"';
  const blockPattern = /  async function interpretDate\(value: string, currentStep: "checkin" \| "checkout"\) \{[\s\S]*?\n  function chooseRoomCount/;

  if (!source.includes(marker)) {
    if (!blockPattern.test(source)) throw new Error("Active Room Finder date-flow block not found");

    const replacement = `  async function interpretDate(value: string) {
    const response = await fetch("/api/ai-assistant/smart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "room_finder",
        messages: [...messages, { role: "user", content: value }],
        search: { checkin: checkin || null, checkout: checkout || null },
        language,
      }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload) throw new Error("date interpretation failed");
    return payload as {
      search?: { checkin?: string | null; checkout?: string | null };
      action?: string;
      answer?: string;
      error?: string;
    };
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value || !["checkin", "checkout", "rooms", "guests"].includes(step)) return;
    setInput("");
    setError("");
    addMessage("user", value);

    if (step === "checkin" || step === "checkout") {
      const previous = step;
      setTyping(true);
      try {
        const result = await interpretDate(value);
        const search = result.search && typeof result.search === "object" ? result.search : {};
        const nextCheckin = typeof search.checkin === "string" ? search.checkin : "";
        const nextCheckout = typeof search.checkout === "string" ? search.checkout : "";

        // Apply the server state exactly. Empty/null values intentionally clear a field after
        // semantic corrections such as “I made a mistake” or “change the check-in”.
        setCheckin(nextCheckin);
        setCheckout(nextCheckout);

        if (!nextCheckin) {
          setStep("checkin");
          addMessage("assistant", result.answer || copy.invalidDate);
          return;
        }

        const today = new Date();
        const minimumCheckin = isoDate(today.getFullYear(), today.getMonth() + 1, today.getDate()) || "";
        if (minimumCheckin && nextCheckin < minimumCheckin) {
          setCheckin("");
          setCheckout("");
          setStep("checkin");
          addMessage("assistant", result.answer || copy.invalidPastDate);
          return;
        }

        if (!nextCheckout) {
          setStep("checkout");
          addMessage("assistant", result.answer || copy.checkout);
          return;
        }

        if (nightsBetween(nextCheckin, nextCheckout) < 1) {
          setCheckout("");
          setStep("checkout");
          addMessage("assistant", result.answer || copy.invalidCheckout);
          return;
        }

        setStep("rooms");
        addMessage("assistant", copy.rooms);
      } catch {
        setStep(previous);
        setError(copy.availabilityError);
      } finally {
        setTyping(false);
      }
      return;
    }

    const number = Number(value.match(/\\d+/)?.[0]);
    if (step === "rooms") {
      if (!Number.isInteger(number) || number < 1 || number > 3) {
        setError(copy.invalidRooms);
        return;
      }
      chooseRoomCount(number, false);
      return;
    }

    if (!Number.isInteger(number) || number < 1 || number > 5) {
      setError(copy.invalidGuests);
      return;
    }
    chooseGuestCount(number, false);
  }

  function chooseRoomCount`;

    source = source.replace(blockPattern, replacement);
  }

  if (!source.includes(marker)) throw new Error("Semantic Room Finder date mode was not applied");
  if (source.includes("const numeric = parseNumericDates(value")) {
    throw new Error("Step-bound numeric date bypass is still active");
  }
  if (!source.includes("Apply the server state exactly")) {
    throw new Error("Semantic date state application was not applied");
  }
  write(chatFile, source);
}

console.log("AI Room Finder now routes all free-text date/correction input through semantic AI interpretation");
