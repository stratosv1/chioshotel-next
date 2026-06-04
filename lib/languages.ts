export type LanguageCode = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

export type Language = {
  code: LanguageCode;
  hreflang: LanguageCode;
  locale: string;
  pathPrefix: string;
  label: string;
};

export const defaultLanguage: LanguageCode = "en";

export const languages: readonly Language[] = [
  {
    code: "en",
    hreflang: "en",
    locale: "en_US",
    pathPrefix: "",
    label: "English",
  },
  {
    code: "el",
    hreflang: "el",
    locale: "el_GR",
    pathPrefix: "/el",
    label: "Ελληνικά",
  },
  {
    code: "fr",
    hreflang: "fr",
    locale: "fr_FR",
    pathPrefix: "/fr",
    label: "Français",
  },
  {
    code: "de",
    hreflang: "de",
    locale: "de_DE",
    pathPrefix: "/de",
    label: "Deutsch",
  },
  {
    code: "it",
    hreflang: "it",
    locale: "it_IT",
    pathPrefix: "/it",
    label: "Italiano",
  },
  {
    code: "es",
    hreflang: "es",
    locale: "es_ES",
    pathPrefix: "/es",
    label: "Español",
  },
  {
    code: "tr",
    hreflang: "tr",
    locale: "tr_TR",
    pathPrefix: "/tr",
    label: "Türkçe",
  },
] as const;

export function isLanguageCode(value: string): value is LanguageCode {
  return languages.some((language) => language.code === value);
}

export function normalizePath(path: string): string {
  if (!path) {
    return "/";
  }

  const withoutHash = path.split("#")[0] || "/";
  const withoutQuery = withoutHash.split("?")[0] || "/";

  let normalizedPath = withoutQuery.replace(/\/+/g, "/");

  if (!normalizedPath.startsWith("/")) {
    normalizedPath = `/${normalizedPath}`;
  }

  const lastSegment = normalizedPath.split("/").filter(Boolean).pop();
  const looksLikeFile = Boolean(lastSegment && lastSegment.includes("."));

  if (normalizedPath !== "/" && !looksLikeFile && !normalizedPath.endsWith("/")) {
    normalizedPath = `${normalizedPath}/`;
  }

  if (normalizedPath.length > 1 && normalizedPath.endsWith("//")) {
    normalizedPath = normalizedPath.replace(/\/+$/, "/");
  }

  return normalizedPath;
}
