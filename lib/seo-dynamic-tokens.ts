type SupportedSeoLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

type MonthLabels = {
  nominative: readonly string[];
  genitive: readonly string[];
};

const monthLabels: Record<SupportedSeoLanguage, MonthLabels> = {
  en: {
    nominative: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    genitive: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  },
  el: {
    nominative: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"],
    genitive: ["Ιανουαρίου", "Φεβρουαρίου", "Μαρτίου", "Απριλίου", "Μαΐου", "Ιουνίου", "Ιουλίου", "Αυγούστου", "Σεπτεμβρίου", "Οκτωβρίου", "Νοεμβρίου", "Δεκεμβρίου"],
  },
  fr: {
    nominative: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    genitive: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  },
  de: {
    nominative: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    genitive: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  },
  it: {
    nominative: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
    genitive: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
  },
  es: {
    nominative: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    genitive: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  },
  tr: {
    nominative: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
    genitive: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
  },
};

function getLanguageFromPath(path: string): SupportedSeoLanguage {
  if (path.startsWith("/el/")) return "el";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  if (path.startsWith("/tr/")) return "tr";
  return "en";
}

function getAthensDateParts(now: Date) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Athens",
    year: "numeric",
    month: "numeric",
  });
  const parts = formatter.formatToParts(now);
  const year = Number(parts.find((part) => part.type === "year")?.value || now.getUTCFullYear());
  const month = Number(parts.find((part) => part.type === "month")?.value || now.getUTCMonth() + 1);

  return { year, monthIndex: Math.max(0, Math.min(11, month - 1)) };
}

export function resolveSeoDynamicTokens(value: string, path: string, now = new Date()) {
  if (!value.includes("{{")) return value;

  const language = getLanguageFromPath(path);
  const labels = monthLabels[language];
  const { year, monthIndex } = getAthensDateParts(now);

  return value
    .replaceAll("{{currentYear}}", String(year))
    .replaceAll("{{currentMonth}}", labels.nominative[monthIndex])
    .replaceAll("{{currentMonthGenitive}}", labels.genitive[monthIndex]);
}
