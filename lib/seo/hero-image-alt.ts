/**
 * Descriptive, localized alt text for the main (hero) photo of stay pages.
 * The hero photo is the image Google is most likely to use as the result
 * thumbnail, so it must not be marked decorative (alt="").
 */

type HeroLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
export type HeroAltKind = "room" | "courtyard";

const heroAlt: Record<HeroAltKind, Record<HeroLanguage, string>> = {
  room: {
    el: "Πέτρινο δωμάτιο στο Voulamandis House, στον Κάμπο της Χίου",
    en: "Stone-walled room at Voulamandis House in Kambos, Chios",
    fr: "Chambre aux murs de pierre à Voulamandis House, Kambos, Chios",
    de: "Zimmer mit Steinwänden im Voulamandis House in Kambos, Chios",
    it: "Camera con pareti in pietra al Voulamandis House a Kambos, Chios",
    es: "Habitación con paredes de piedra en Voulamandis House, Kambos, Quíos",
    tr: "Kambos, Sakız Adası’ndaki Voulamandis House’ta taş duvarlı oda",
  },
  courtyard: {
    el: "Η αυλή του Voulamandis House με το παραδοσιακό μαγγανοπήγαδο, στον Κάμπο της Χίου",
    en: "Courtyard of Voulamandis House with the traditional water wheel, Kambos, Chios",
    fr: "La cour de Voulamandis House et sa noria traditionnelle, Kambos, Chios",
    de: "Innenhof des Voulamandis House mit traditionellem Schöpfrad, Kambos, Chios",
    it: "Il cortile del Voulamandis House con la tradizionale noria, Kambos, Chios",
    es: "Patio de Voulamandis House con la noria tradicional, Kambos, Quíos",
    tr: "Kambos, Sakız Adası’nda Voulamandis House’un geleneksel su dolabıyla avlusu",
  },
};

export function heroImageAlt(kind: HeroAltKind, path: string) {
  const prefix = path.split("/").filter(Boolean)[0] as HeroLanguage;
  return heroAlt[kind][prefix in heroAlt[kind] ? prefix : "en"];
}
