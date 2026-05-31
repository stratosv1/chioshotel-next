export const defaultLanguage = "en" as const;

export const languages = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    locale: "en_US",
    hreflang: "en",
    pathPrefix: "",
    isDefault: true,
  },
  {
    code: "el",
    label: "Greek",
    nativeLabel: "Ελληνικά",
    locale: "el_GR",
    hreflang: "el",
    pathPrefix: "/el",
    isDefault: false,
  },
  {
    code: "fr",
    label: "French",
    nativeLabel: "Français",
    locale: "fr_FR",
    hreflang: "fr",
    pathPrefix: "/fr",
    isDefault: false,
  },
  {
    code: "de",
    label: "German",
    nativeLabel: "Deutsch",
    locale: "de_DE",
    hreflang: "de",
    pathPrefix: "/de",
    isDefault: false,
  },
  {
    code: "it",
    label: "Italian",
    nativeLabel: "Italiano",
    locale: "it_IT",
    hreflang: "it",
    pathPrefix: "/it",
    isDefault: false,
  },
  {
    code: "es",
    label: "Spanish",
    nativeLabel: "Español",
    locale: "es_ES",
    hreflang: "es",
    pathPrefix: "/es",
    isDefault: false,
  },
  {
    code: "tr",
    label: "Turkish",
    nativeLabel: "Türkçe",
    locale: "tr_TR",
    hreflang: "tr",
    pathPrefix: "/tr",
    isDefault: false,
  },
] as const;

export type Language = (typeof languages)[number];
export type LanguageCode = Language["code"];

export function getLanguage(code: string): Language | undefined {
  return languages.find((language) => language.code === code);
}

export function isLanguageCode(code: string): code is LanguageCode {
  return languages.some((language) => language.code === code);
}

export function getLanguagePrefix(code: LanguageCode): string {
  const language = getLanguage(code);

  if (!language) {
    return "";
  }

  return language.pathPrefix;
}

export function normalizePath(path: string): string {
  if (!path) {
    return "/";
  }

  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;

  if (withLeadingSlash === "/") {
    return "/";
  }

  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
}

export function withLanguagePrefix(code: LanguageCode, path: string): string {
  const prefix = getLanguagePrefix(code);

  if (code === defaultLanguage) {
    return path === "/" ? "/" : normalizePath(path);
  }

  if (path === "/") {
    return prefix;
  }

  return normalizePath(`${prefix}${path}`);
}

export function removeDomainFromUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return normalizePath(parsedUrl.pathname);
  } catch {
    return normalizePath(url);
  }
}