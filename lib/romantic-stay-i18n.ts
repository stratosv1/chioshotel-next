import { romanticStayPaths } from "@/content/romantic-stay";
import { absoluteUrl } from "@/lib/seo";

export function romanticStayLanguages() {
  return {
    en: absoluteUrl(romanticStayPaths.en),
    el: absoluteUrl(romanticStayPaths.el),
    fr: absoluteUrl(romanticStayPaths.fr),
    de: absoluteUrl(romanticStayPaths.de),
    it: absoluteUrl(romanticStayPaths.it),
    es: absoluteUrl(romanticStayPaths.es),
    tr: absoluteUrl(romanticStayPaths.tr),
    "x-default": absoluteUrl(romanticStayPaths.en),
  };
}
