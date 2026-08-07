import {
  chiosBeachesPageDe,
  chiosBeachesPageEl,
  chiosBeachesPageEn,
  chiosBeachesPageEs,
  chiosBeachesPageFr,
  chiosBeachesPageIt,
  chiosBeachesPageTr,
  type ChiosBeachesPageData,
} from "@/content/chios-beaches";
import {
  elintaBeachByLanguage,
  karfasBeachByLanguage,
} from "@/content/karfas-elinta-data";
import type { LanguageCode } from "@/lib/languages";

type BeachCard = ChiosBeachesPageData["beaches"][number];
type BeachCardLabels = Pick<
  BeachCard,
  "name" | "region" | "mood" | "badges"
>;

const pagesByLanguage: Record<LanguageCode, ChiosBeachesPageData> = {
  en: chiosBeachesPageEn,
  el: chiosBeachesPageEl,
  fr: chiosBeachesPageFr,
  de: chiosBeachesPageDe,
  it: chiosBeachesPageIt,
  es: chiosBeachesPageEs,
  tr: chiosBeachesPageTr,
};

const labelsByLanguage: Record<
  LanguageCode,
  { karfas: BeachCardLabels; elinta: BeachCardLabels }
> = {
  en: {
    karfas: {
      name: "Karfas",
      region: "Central Chios",
      mood: "Organized and family friendly",
      badges: ["Sandy", "Shallow water", "Near Chios Town"],
    },
    elinta: {
      name: "Elinta",
      region: "Western Chios",
      mood: "Quiet and natural",
      badges: ["White pebbles", "Sheltered", "Unorganized"],
    },
  },
  el: {
    karfas: {
      name: "Καρφάς",
      region: "Κεντρική Χίος",
      mood: "Οργανωμένη και οικογενειακή",
      badges: ["Αμμώδης", "Ρηχά νερά", "Κοντά στην πόλη"],
    },
    elinta: {
      name: "Ελίντα",
      region: "Δυτική Χίος",
      mood: "Ήσυχη και φυσική",
      badges: ["Λευκά βότσαλα", "Απάνεμη", "Μη οργανωμένη"],
    },
  },
  fr: {
    karfas: {
      name: "Karfas",
      region: "Centre de Chios",
      mood: "Organisée et familiale",
      badges: ["Sable", "Eaux peu profondes", "Près de la ville"],
    },
    elinta: {
      name: "Elinta",
      region: "Ouest de Chios",
      mood: "Calme et naturelle",
      badges: ["Galets blancs", "Baie abritée", "Non organisée"],
    },
  },
  de: {
    karfas: {
      name: "Karfas",
      region: "Zentral-Chios",
      mood: "Organisiert und familienfreundlich",
      badges: ["Sandstrand", "Flaches Wasser", "Stadtnah"],
    },
    elinta: {
      name: "Elinta",
      region: "West-Chios",
      mood: "Ruhig und naturbelassen",
      badges: ["Weiße Kiesel", "Geschützte Bucht", "Nicht organisiert"],
    },
  },
  it: {
    karfas: {
      name: "Karfas",
      region: "Chios centrale",
      mood: "Organizzata e adatta alle famiglie",
      badges: ["Sabbia", "Acqua bassa", "Vicino alla città"],
    },
    elinta: {
      name: "Elinta",
      region: "Chios occidentale",
      mood: "Tranquilla e naturale",
      badges: ["Ciottoli bianchi", "Baia riparata", "Non organizzata"],
    },
  },
  es: {
    karfas: {
      name: "Karfas",
      region: "Centro de Quíos",
      mood: "Organizada y familiar",
      badges: ["Arena", "Aguas poco profundas", "Cerca de la ciudad"],
    },
    elinta: {
      name: "Elinta",
      region: "Oeste de Quíos",
      mood: "Tranquila y natural",
      badges: ["Guijarros blancos", "Bahía protegida", "No organizada"],
    },
  },
  tr: {
    karfas: {
      name: "Karfas",
      region: "Orta Sakız",
      mood: "Organize ve aile dostu",
      badges: ["Kumlu", "Sığ deniz", "Şehre yakın"],
    },
    elinta: {
      name: "Elinta",
      region: "Batı Sakız",
      mood: "Sakin ve doğal",
      badges: ["Beyaz çakıllar", "Korunaklı koy", "Organize değil"],
    },
  },
};

function buildCard(
  id: "karfas" | "elinta",
  language: LanguageCode,
): BeachCard {
  const beach =
    id === "karfas"
      ? karfasBeachByLanguage[language]
      : elintaBeachByLanguage[language];
  const labels = labelsByLanguage[language][id];

  return {
    id,
    name: labels.name,
    title: beach.hero.title,
    description: beach.hero.description,
    image: beach.hero.image,
    imageAlt: beach.hero.title,
    href: beach.seo.canonicalPath,
    region: labels.region,
    mood: labels.mood,
    badges: labels.badges,
    size: "wide",
  };
}

export function ensureKarfasElintaBeachCards() {
  (Object.keys(pagesByLanguage) as LanguageCode[]).forEach((language) => {
    const page = pagesByLanguage[language];
    const missingCards = (["karfas", "elinta"] as const)
      .filter((id) => !page.beaches.some((beach) => beach.id === id))
      .map((id) => buildCard(id, language));

    if (missingCards.length === 0) return;

    const lithiIndex = page.beaches.findIndex((beach) => beach.id === "lithi");
    const insertAt = lithiIndex >= 0 ? lithiIndex + 1 : page.beaches.length;
    page.beaches.splice(insertAt, 0, ...missingCards);
  });
}
