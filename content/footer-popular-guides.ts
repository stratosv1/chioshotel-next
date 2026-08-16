import { kamposChiosPaths } from "@/content/kampos-chios";
import { karfasBeachPaths } from "@/content/karfas-elinta-paths";
import type { LanguageCode } from "@/lib/languages";
import { getRoutesByItemId } from "@/lib/url-map";

type FooterGuideKey =
  | "kampos"
  | "mesta"
  | "pyrgi"
  | "mavraVolia"
  | "volissos"
  | "agiaDynami"
  | "karfas"
  | "masticMuseum"
  | "orchids";

export type FooterPopularGuideLink = Readonly<{
  label: string;
  href: string;
  featured: boolean;
}>;

const guideLabels: Readonly<Record<LanguageCode, Readonly<Record<FooterGuideKey, string>>>> = {
  en: {
    kampos: "Kampos Chios",
    mesta: "Mesta Village",
    pyrgi: "Pyrgi Village",
    mavraVolia: "Mavra Volia Beach",
    volissos: "Volissos Village",
    agiaDynami: "Agia Dynami Beach",
    karfas: "Karfas Beach",
    masticMuseum: "Chios Mastic Museum",
    orchids: "Chios Orchids",
  },
  el: {
    kampos: "Κάμπος Χίου",
    mesta: "Χωριό Μεστά",
    pyrgi: "Χωριό Πυργί",
    mavraVolia: "Παραλία Μαύρα Βόλια",
    volissos: "Βολισσός Χίου",
    agiaDynami: "Παραλία Αγία Δύναμη",
    karfas: "Παραλία Καρφάς",
    masticMuseum: "Μουσείο Μαστίχας Χίου",
    orchids: "Ορχιδέες της Χίου",
  },
  fr: {
    kampos: "Kambos de Chios",
    mesta: "Village de Mesta",
    pyrgi: "Village de Pyrgi",
    mavraVolia: "Plage de Mavra Volia",
    volissos: "Village de Volissos",
    agiaDynami: "Plage d’Agia Dynami",
    karfas: "Plage de Karfas",
    masticMuseum: "Musée du Mastic de Chios",
    orchids: "Orchidées de Chios",
  },
  de: {
    kampos: "Kampos auf Chios",
    mesta: "Mesta Dorf",
    pyrgi: "Pyrgi Dorf",
    mavraVolia: "Mavra Volia Strand",
    volissos: "Volissos Dorf",
    agiaDynami: "Agia Dynami Strand",
    karfas: "Karfas Strand",
    masticMuseum: "Chios Mastix Museum",
    orchids: "Orchideen auf Chios",
  },
  it: {
    kampos: "Kampos di Chios",
    mesta: "Villaggio di Mesta",
    pyrgi: "Villaggio di Pyrgi",
    mavraVolia: "Spiaggia di Mavra Volia",
    volissos: "Villaggio di Volissos",
    agiaDynami: "Spiaggia di Agia Dynami",
    karfas: "Spiaggia di Karfas",
    masticMuseum: "Museo del Mastice di Chios",
    orchids: "Orchidee di Chios",
  },
  es: {
    kampos: "Kampos de Quíos",
    mesta: "Pueblo de Mesta",
    pyrgi: "Pueblo de Pyrgi",
    mavraVolia: "Playa Mavra Volia",
    volissos: "Pueblo de Volissos",
    agiaDynami: "Playa Agia Dynami",
    karfas: "Playa de Karfas",
    masticMuseum: "Museo del Mastiha de Quíos",
    orchids: "Orquídeas de Quíos",
  },
  tr: {
    kampos: "Sakız Adası Kambos",
    mesta: "Mesta Köyü",
    pyrgi: "Pyrgi Köyü",
    mavraVolia: "Mavra Volia Plajı",
    volissos: "Volissos Köyü",
    agiaDynami: "Agia Dynami Plajı",
    karfas: "Karfas Plajı",
    masticMuseum: "Sakız Adası Mastik Müzesi",
    orchids: "Sakız Adası Orkideleri",
  },
};

const fixedGuideKeys: readonly FooterGuideKey[] = ["kampos", "mesta", "pyrgi", "mavraVolia"];

// January → December. The fifth footer guide follows seasonal visitor intent
// instead of rotating every few days, keeping the core internal-link signals stable.
const featuredGuideByMonth: readonly FooterGuideKey[] = [
  "masticMuseum",
  "masticMuseum",
  "orchids",
  "orchids",
  "karfas",
  "agiaDynami",
  "karfas",
  "agiaDynami",
  "volissos",
  "volissos",
  "masticMuseum",
  "masticMuseum",
];

function getRouteMapPath(itemId: string, language: LanguageCode): string {
  const route = getRoutesByItemId(itemId).find(
    (candidate) => candidate.language === language && candidate.action === "KEEP",
  );

  if (!route) {
    throw new Error(`Missing localized footer guide route for ${itemId} (${language})`);
  }

  return route.path;
}

function getGuidePath(key: FooterGuideKey, language: LanguageCode): string {
  switch (key) {
    case "kampos":
      return kamposChiosPaths[language];
    case "karfas":
      return karfasBeachPaths[language];
    case "mesta":
      return getRouteMapPath("mesta", language);
    case "pyrgi":
      return getRouteMapPath("pyrgi", language);
    case "mavraVolia":
      return getRouteMapPath("emporios", language);
    case "volissos":
      return getRouteMapPath("volissos", language);
    case "agiaDynami":
      return getRouteMapPath("agia-dynami", language);
    case "masticMuseum":
      return getRouteMapPath("mastic-museum", language);
    case "orchids":
      return getRouteMapPath("chios-activity-orchids", language);
  }
}

export function getFooterPopularGuides(
  language: LanguageCode,
  monthIndex = new Date().getUTCMonth(),
): FooterPopularGuideLink[] {
  const normalizedMonth = ((monthIndex % 12) + 12) % 12;
  const featuredGuide = featuredGuideByMonth[normalizedMonth];

  return [...fixedGuideKeys, featuredGuide].map((key) => ({
    label: guideLabels[language][key],
    href: getGuidePath(key, language),
    featured: key === featuredGuide,
  }));
}
