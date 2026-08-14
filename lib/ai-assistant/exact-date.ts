import type { AssistantCommand, ConversationContext } from "./types";

const NUMERIC_DATE = /(^|\D)(\d{1,2})[/.\-](\d{1,2})(?:[/.\-](\d{2}|\d{4}))?(?=\D|$)/;
const ONLY_NUMERIC_DATE = /^\s*(\d{1,2})[/.\-](\d{1,2})(?:[/.\-](\d{2}|\d{4}))?\s*$/;

function validIso(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) return null;
  return date.toISOString().slice(0, 10);
}

function resolveYear(day: number, month: number, rawYear?: string): number {
  if (rawYear) {
    const parsed = Number(rawYear);
    return rawYear.length === 2 ? 2000 + parsed : parsed;
  }

  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const thisYear = Date.UTC(now.getUTCFullYear(), month - 1, day);
  return thisYear >= today ? now.getUTCFullYear() : now.getUTCFullYear() + 1;
}

function resolveMatch(dayRaw: string, monthRaw: string, yearRaw?: string): string | null {
  const day = Number(dayRaw);
  const month = Number(monthRaw);
  const year = resolveYear(day, month, yearRaw);
  return validIso(year, month, day);
}

export function extractExactNumericDate(message: string): string | null {
  const match = message.match(NUMERIC_DATE);
  if (!match) return null;
  return resolveMatch(match[2], match[3], match[4]);
}

export function extractStandaloneNumericDate(message: string): string | null {
  const match = message.match(ONLY_NUMERIC_DATE);
  if (!match) return null;
  return resolveMatch(match[1], match[2], match[3]);
}

export function buildStandaloneDateCommand(
  message: string,
  context: ConversationContext,
): AssistantCommand | null {
  const step = context.currentStep;
  if (step !== "checkin" && step !== "checkout") return null;

  const exactDate = extractStandaloneNumericDate(message);
  if (!exactDate) return null;

  return {
    language: context.language || "en",
    replyMode: "execute",
    selectedRoom: context.selectedRoom,
    actions: [{ type: "search_availability", [step]: exactDate }],
  };
}

function actionHasField(command: AssistantCommand, field: "checkin" | "checkout") {
  return command.actions.some(action => Boolean(action[field]));
}

export function applyExactDateFact(
  command: AssistantCommand,
  message: string,
  context: ConversationContext,
): AssistantCommand {
  const step = context.currentStep;
  if (step !== "checkin" && step !== "checkout") return command;
  if (actionHasField(command, step)) return command;

  const exactDate = extractExactNumericDate(message);
  if (!exactDate) return command;

  const actions = command.actions
    .filter(action => !(
      action.type === "ask_clarification" &&
      action.missingFields?.includes(step)
    ));

  actions.push({
    type: "search_availability",
    [step]: exactDate,
  });

  return {
    ...command,
    replyMode: "execute",
    actions,
  };
}
