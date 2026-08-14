import type { AssistantCommand, AssistantLanguage, ConversationContext } from "./types";

const NUMERIC_DATE = /(^|\D)(\d{1,2})[/.\-](\d{1,2})(?:[/.\-](\d{2}|\d{4}))?(?=\D|$)/;
const ONLY_NUMERIC_DATE = /^\s*(\d{1,2})[/.\-](\d{1,2})(?:[/.\-](\d{2}|\d{4}))?\s*$/;

const MONTHS: Record<AssistantLanguage, string[][]> = {
  el: [
    ["ιανουαριου", "ιανουαριος"], ["φεβρουαριου", "φεβρουαριος"], ["μαρτιου", "μαρτιος"],
    ["απριλιου", "απριλιος"], ["μαιου", "μαιος"], ["ιουνιου", "ιουνιος"],
    ["ιουλιου", "ιουλιος"], ["αυγουστου", "αυγουστος"], ["σεπτεμβριου", "σεπτεμβριος"],
    ["οκτωβριου", "οκτωβριος"], ["νοεμβριου", "νοεμβριος"], ["δεκεμβριου", "δεκεμβριος"],
  ],
  en: [["january", "jan"], ["february", "feb"], ["march", "mar"], ["april", "apr"], ["may"], ["june", "jun"], ["july", "jul"], ["august", "aug"], ["september", "sep", "sept"], ["october", "oct"], ["november", "nov"], ["december", "dec"]],
  de: [["januar"], ["februar"], ["marz"], ["april"], ["mai"], ["juni"], ["juli"], ["august"], ["september"], ["oktober"], ["november"], ["dezember"]],
  fr: [["janvier"], ["fevrier"], ["mars"], ["avril"], ["mai"], ["juin"], ["juillet"], ["aout"], ["septembre"], ["octobre"], ["novembre"], ["decembre"]],
  it: [["gennaio"], ["febbraio"], ["marzo"], ["aprile"], ["maggio"], ["giugno"], ["luglio"], ["agosto"], ["settembre"], ["ottobre"], ["novembre"], ["dicembre"]],
  es: [["enero"], ["febrero"], ["marzo"], ["abril"], ["mayo"], ["junio"], ["julio"], ["agosto"], ["septiembre", "setiembre"], ["octubre"], ["noviembre"], ["diciembre"]],
  tr: [["ocak"], ["subat"], ["mart"], ["nisan"], ["mayis"], ["haziran"], ["temmuz"], ["agustos"], ["eylul"], ["ekim"], ["kasim"], ["aralik"]],
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLocaleLowerCase()
    .replace(/[’']/g, " ")
    .replace(/\s+/g, " ")
    .trim();

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

function resolveNamedMonth(dayRaw: string, monthName: string, language: AssistantLanguage, yearRaw?: string) {
  const monthIndex = MONTHS[language].findIndex((aliases) => aliases.includes(monthName));
  if (monthIndex < 0) return null;
  const day = Number(dayRaw);
  const month = monthIndex + 1;
  const year = resolveYear(day, month, yearRaw);
  return validIso(year, month, day);
}

function textualDatePattern(language: AssistantLanguage, standalone: boolean) {
  const aliases = MONTHS[language]
    .flat()
    .sort((a, b) => b.length - a.length)
    .map((month) => month.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const body = `(\\d{1,2})\\s+(?:${aliases})(?:\\s+(\\d{4}))?`;
  return standalone
    ? new RegExp(`^\\s*${body}\\s*$`, "u")
    : new RegExp(`(?:^|[^\\p{L}\\p{N}])${body}(?=$|[^\\p{L}\\p{N}])`, "u");
}

function extractTextualDate(message: string, language: AssistantLanguage, standalone: boolean): string | null {
  const text = normalize(message);
  const pattern = textualDatePattern(language, standalone);
  const match = text.match(pattern);
  if (!match) return null;

  // The month is easier and safer to identify from the matched text than by
  // relying on a huge alternation capture group.
  const matchedText = normalize(match[0]);
  const monthName = MONTHS[language].flat().find((alias) =>
    new RegExp(`(?:^|[^\\p{L}])${alias}(?=$|[^\\p{L}])`, "u").test(matchedText),
  );
  if (!monthName) return null;
  return resolveNamedMonth(match[1], monthName, language, match[2]);
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

export function extractExactDate(message: string, context: ConversationContext, standalone = false): string | null {
  const numeric = standalone ? extractStandaloneNumericDate(message) : extractExactNumericDate(message);
  if (numeric) return numeric;
  return extractTextualDate(message, context.language || "en", standalone);
}

export function buildStandaloneDateCommand(
  message: string,
  context: ConversationContext,
): AssistantCommand | null {
  const step = context.currentStep;
  if (step !== "checkin" && step !== "checkout") return null;

  const exactDate = extractExactDate(message, context, true);
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

  const exactDate = extractExactDate(message, context, false);
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
