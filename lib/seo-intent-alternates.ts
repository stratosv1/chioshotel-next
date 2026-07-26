import { absoluteUrl } from "@/lib/seo";

export function buildIntentAlternates(
  canonicalPath: string,
  paths: Record<string, string>,
) {
  const languages = Object.fromEntries(
    Object.entries(paths).map(([language, path]) => [language, absoluteUrl(path)]),
  ) as Record<string, string>;

  if (paths.en) {
    languages["x-default"] = absoluteUrl(paths.en);
  }

  return {
    canonical: absoluteUrl(canonicalPath),
    languages,
  };
}
