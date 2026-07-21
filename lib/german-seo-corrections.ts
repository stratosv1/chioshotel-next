import {
  localizedBeachDetails,
  type BeachDetailData,
} from "../content/beach-details";
import {
  localizedVillageDetails,
  type VillageDetailData,
} from "../content/village-details";
import { seoSnippetOverrides } from "./seo-snippet-overrides";

type SeoCorrection = {
  title: string;
  description: string;
};

type DetailCorrection = SeoCorrection & {
  heroTitle: string;
  heroDescription: string;
};

const germanPageSeoCorrections = new Map<string, SeoCorrection>([
  [
    "/de/",
    {
      title: "Zimmer und Apartments auf Chios | Voulamandis House",
      description:
        "Übernachten Sie im historischen Kambos auf Chios: ruhige Zimmer und Familienapartments nahe Stadt, Flughafen und Stränden mit persönlicher Gastfreundschaft.",
    },
  ],
  [
    "/de/chios-zimmer/",
    {
      title: "Zimmer und Apartments auf Chios | Kambos",
      description:
        "Vergleichen Sie Economy-Doppelzimmer, Standardzimmer und Familienapartments im Voulamandis House im historischen Kambos auf Chios.",
    },
  ],
  [
    "/de/zimmer-chios/economy-zimmer-auf-chios/",
    {
      title: "Economy-Doppelzimmer auf Chios | Ruhig in Kambos",
      description:
        "Renovierte Economy-Doppelzimmer für zwei Personen in Kambos mit Klimaanlage, WLAN, Kühlschrank und eigenem Bad.",
    },
  ],
  [
    "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
    {
      title: "Standard-Doppel- und Dreibettzimmer auf Chios",
      description:
        "Wählen Sie ein Standard-Doppel- oder Dreibettzimmer im Erdgeschoss mit Gartenzugang oder im ersten Stock mit Terrasse in Kambos.",
    },
  ],
  [
    "/de/zimmer-chios/familienapartments-in-chios/",
    {
      title: "Familienapartments auf Chios | Küche & viel Platz",
      description:
        "Geräumige Familienapartments mit 40–45 m² in Kambos, vollständiger Küche, Wohnbereich und Platz für bis zu vier Personen.",
    },
  ],
  [
    "/de/finde-dein-zimmer/",
    {
      title: "Zimmer auf Chios finden | Live-Verfügbarkeit",
      description:
        "Wählen Sie Reisedaten und Gäste, vergleichen Sie verfügbare Zimmer und Direktpreise und senden Sie Ihre Anfrage an das Voulamandis House.",
    },
  ],
  [
    "/de/hotelpreise-auf-der-insel-chios/",
    {
      title: "Direktbuchung auf Chios | Preise & Verfügbarkeit",
      description:
        "Prüfen Sie die aktuelle Verfügbarkeit, wählen Sie ein Zimmer oder Apartment und buchen Sie direkt im Voulamandis House ohne Vermittlungsprovision.",
    },
  ],
  [
    "/de/kontaktieren-voulamandis-house/",
    {
      title: "Kontakt zum Voulamandis House | Zimmeranfrage",
      description:
        "Kontaktieren Sie das Voulamandis House in Kambos für Zimmeranfragen, Verfügbarkeit, Anreiseinformationen und persönliche Hilfe bei Ihrer Reise nach Chios.",
    },
  ],
  [
    "/de/straende-chios/",
    {
      title: "Strände auf Chios | Karte, Zugang & lokale Tipps",
      description:
        "Vergleichen Sie die schönsten Strände auf Chios nach Lage, Zugang, Ausstattung und Charakter – mit lokalen Tipps für Familien und ruhige Badetage.",
    },
  ],
  [
    "/de/doerfer-chios/",
    {
      title: "Dörfer auf Chios | Mittelalter, Mastix & Küste",
      description:
        "Entdecken Sie Pyrgi, Mesta, Olympoi, Armolia, Lagada, Vessa und Volissos mit Tipps für mittelalterliche Dörfer, Mastixkultur und Küstenrouten.",
    },
  ],
  [
    "/de/museen-chios/",
    {
      title: "Museen auf Chios | Geschichte, Kultur & Mastix",
      description:
        "Entdecken Sie Museen auf Chios zu Archäologie, byzantinischer Kunst, Schifffahrt, Literatur, Volkskunde und der Mastixkultur des Südens.",
    },
  ],
  [
    "/de/familienurlaub-auf-chios/",
    {
      title: "Chios mit Kindern | Familienstrände & Ausflugstipps",
      description:
        "Planen Sie Familienurlaub auf Chios mit flachen Sandstränden, kinderfreundlichen Ausflügen, ruhigen Dörfern und praktischen lokalen Tipps.",
    },
  ],
  [
    "/de/griechischkurse-auf-chios/",
    {
      title: "Griechischkurse auf Chios | Alexandria Institute",
      description:
        "Informationen zu Griechisch- und Kulturkursen des Alexandria Institute auf Chios, verfügbaren Niveaus, Kurszeiten und Reiseplanung.",
    },
  ],
  [
    "/de/thermalquellen-auf-chios/",
    {
      title: "Thermalquellen auf Chios | Agiasmata im Norden",
      description:
        "Entdecken Sie Agiasmata im Norden von Chios, einen ruhigen Ort mit natürlichen Thermalquellen, grüner Umgebung und entspannter Atmosphäre.",
    },
  ],
  [
    "/de/wandern-auf-chios/",
    {
      title: "Wandern auf Chios | Wege, Routen & Natur",
      description:
        "Entdecken Sie Wanderwege auf Chios durch Kambos, Mastixdörfer, Berge und Küstenlandschaften mit praktischen Ideen für unterschiedliche Routen.",
    },
  ],
]);

const germanBeachCorrections = new Map<string, DetailCorrection>([
  [
    "/de/straende-chios/agia-dynami-strand/",
    {
      title: "Agia-Dynami-Strand auf Chios | Anfahrt & Tipps",
      description:
        "Planen Sie Ihren Besuch am Agia-Dynami-Strand im Süden von Chios: türkisfarbenes Wasser, kleine Bucht, Zugang und Tipps für einen ruhigen Badetag.",
      heroTitle: "Agia-Dynami-Strand: Türkisfarbene Bucht im Süden",
      heroDescription:
        "Eine kleine Bucht im Süden von Chios mit türkisfarbenem Wasser, heller Küste und ruhiger Atmosphäre nahe den Mastixdörfern.",
    },
  ],
  [
    "/de/straende-chios/agia-fotia-strand/",
    {
      title: "Agia-Fotia-Strand auf Chios | Wasser, Tavernen & Zugang",
      description:
        "Entdecken Sie Agia Fotia auf Chios: klarer Kiesstrand mit Liegen, Cafés, Tavernen und einfachem Zugang nahe Kambos und Chios-Stadt.",
      heroTitle: "Agia-Fotia-Strand: Klares Wasser und lebhafte Atmosphäre",
      heroDescription:
        "Ein beliebter organisierter Kiesstrand nahe Kambos mit klarem Wasser, Liegen, Cafés und Tavernen direkt an der Küste.",
    },
  ],
  [
    "/de/straende-chios/avlonia-strand/",
    {
      title: "Avlonia-Strand auf Chios | Ruhige Bucht im Süden",
      description:
        "Entdecken Sie Avlonia im Süden von Chios, eine abgelegene Bucht nahe Pyrgi mit türkisfarbenem Wasser, natürlicher Landschaft und ruhiger Atmosphäre.",
      heroTitle: "Avlonia-Strand: Versteckte Bucht im Süden von Chios",
      heroDescription:
        "Eine abgelegene Bucht nahe Pyrgi mit türkisfarbenem Wasser, natürlicher Küste und einer ruhigen Atmosphäre abseits organisierter Strände.",
    },
  ],
  [
    "/de/straende-chios/kato-fana-strand/",
    {
      title: "Kato-Fana-Strand auf Chios | Ruhe im Süden",
      description:
        "Entdecken Sie Kato Fana im Süden von Chios, einen ruhigen Strand nahe der historischen Fana-Region mit weitem Meerblick und natürlicher Umgebung.",
      heroTitle: "Kato-Fana-Strand: Ruhige Auszeit im Süden",
      heroDescription:
        "Ein ruhiger Strand im Süden von Chios nahe der historischen Fana-Region, ideal für offene Meerblicke und einen entspannten Zwischenstopp.",
    },
  ],
  [
    "/de/straende-chios/komi-strand/",
    {
      title: "Komi-Strand auf Chios | Sand, Liegen & Restaurants",
      description:
        "Planen Sie Ihren Besuch am Komi-Strand: Sand, flaches Wasser, Liegen, Restaurants, einfacher Zugang und praktische Tipps für Familien.",
      heroTitle: "Komi-Strand: Sand, flaches Wasser und Sommerleben",
      heroDescription:
        "Einer der beliebtesten Sandstrände im Südosten von Chios mit flachem Wasser, Liegen, Restaurants und guter Erreichbarkeit.",
    },
  ],
  [
    "/de/straende-chios/lefkathia-strand/",
    {
      title: "Lefkathia-Strand bei Volissos | Wasser & Sonnenuntergang",
      description:
        "Entdecken Sie Lefkathia bei Volissos: klares Wasser, organisierter Strand, Tamarisken und schöne Sonnenuntergänge im Nordwesten von Chios.",
      heroTitle: "Lefkathia-Strand: Klares Wasser bei Volissos",
      heroDescription:
        "Ein gut erreichbarer Strand bei Volissos und Limnia mit klarem Wasser, Tamarisken, organisierter Ausstattung und schönen Sonnenuntergängen.",
    },
  ],
  [
    "/de/straende-chios/lithi-strand/",
    {
      title: "Lithi-Strand auf Chios | Sand, Familien & Tavernen",
      description:
        "Entdecken Sie Lithi im Westen von Chios: geschützter Sandstrand, flaches Wasser, ruhige Atmosphäre und Fischtavernen direkt am Meer.",
      heroTitle: "Lithi-Strand: Sand, flaches Wasser und Tavernen",
      heroDescription:
        "Ein geschützter Sandstrand im Westen von Chios mit flachem Wasser, ruhiger Atmosphäre und Fischtavernen direkt am Meer.",
    },
  ],
  [
    "/de/straende-chios/mavra-volia-strand/",
    {
      title: "Mavra-Volia-Strand auf Chios | Schwarze Vulkansteine",
      description:
        "Besuchen Sie Mavra Volia bei Emporios, den berühmten Strand von Chios mit schwarzen Vulkansteinen, tiefblauem Wasser und dramatischer Landschaft.",
      heroTitle: "Mavra Volia: Schwarze Vulkansteine bei Emporios",
      heroDescription:
        "Der bekannteste Vulkanstrand von Chios mit schwarzen Kieseln, tiefblauem Wasser und einer eindrucksvollen Landschaft nahe Emporios.",
    },
  ],
  [
    "/de/straende-chios/nagos-strand/",
    {
      title: "Nagos-Strand auf Chios | Quellen, Bäume & Kiesel",
      description:
        "Entdecken Sie Nagos im Norden von Chios nahe Kardamyla, wo Quellen, Platanen, bunte Kiesel und klares Wasser eine grüne Küstenlandschaft bilden.",
      heroTitle: "Nagos-Strand: Grüne Landschaft im Norden",
      heroDescription:
        "Ein besonderer Strand nahe Kardamyla, an dem Quellen, Platanen, bunte Kiesel und klares Wasser eine kühle grüne Landschaft schaffen.",
    },
  ],
  [
    "/de/straende-chios/salagona-strand/",
    {
      title: "Salagona-Strand auf Chios | Ruhige türkisfarbene Bucht",
      description:
        "Entdecken Sie Salagona im Südwesten von Chios, eine ruhige Bucht nahe den mittelalterlichen Dörfern mit türkisfarbenem Wasser und feinen Kieseln.",
      heroTitle: "Salagona-Strand: Versteckte türkisfarbene Bucht",
      heroDescription:
        "Eine ruhige Bucht im Südwesten von Chios mit türkisfarbenem Wasser, feinen Kieseln und natürlicher Landschaft nahe den mittelalterlichen Dörfern.",
    },
  ],
  [
    "/de/straende-chios/vroulidia-strand/",
    {
      title: "Vroulidia-Strand auf Chios | Kleine türkisfarbene Bucht",
      description:
        "Entdecken Sie Vroulidia im Süden von Chios, eine kleine Bucht nahe Emporios mit türkisfarbenem Wasser, weitem Meerblick und ruhiger Atmosphäre.",
      heroTitle: "Vroulidia-Strand: Kleine türkisfarbene Bucht im Süden",
      heroDescription:
        "Eine kleine natürliche Bucht nahe Emporios mit türkisfarbenem Wasser, offenem Meerblick und einer entspannten Atmosphäre.",
    },
  ],
]);

const germanVillageCorrections = new Map<string, DetailCorrection>([
  [
    "/de/doerfer-chios/pyrgi-dorf/",
    {
      title: "Pyrgi auf Chios | Xysta & mittelalterliche Gassen",
      description:
        "Entdecken Sie Pyrgi auf Chios mit schwarz-weißen Xysta-Fassaden, mittelalterlichen Gassen, lebendigem Dorfplatz und Mastixtradition.",
      heroTitle: "Pyrgi auf Chios: Xysta und mittelalterliche Gassen",
      heroDescription:
        "Pyrgi ist für seine schwarz-weißen Xysta-Fassaden, engen mittelalterlichen Gassen und seine lebendige Mastixtradition bekannt.",
    },
  ],
  [
    "/de/doerfer-chios/mesta-dorf/",
    {
      title: "Mesta auf Chios | Mittelalterliches Festungsdorf",
      description:
        "Entdecken Sie Mesta auf Chios, ein hervorragend erhaltenes mittelalterliches Festungsdorf mit Steingassen, Gewölben und authentischer Atmosphäre.",
      heroTitle: "Mesta auf Chios: Mittelalterliches Festungsdorf",
      heroDescription:
        "Mesta ist eines der am besten erhaltenen mittelalterlichen Dörfer von Chios, mit engen Steingassen, Gewölben und einer geschlossenen Festungsstruktur.",
    },
  ],
  [
    "/de/doerfer-chios/olympoi-dorf/",
    {
      title: "Olympoi auf Chios | Ruhiges Mastixdorf nahe Mesta",
      description:
        "Entdecken Sie Olympoi, ein ruhiges mittelalterliches Mastixdorf im Süden von Chios mit Steingassen, traditioneller Architektur und Nähe zu Mesta.",
      heroTitle: "Olympoi auf Chios: Ruhiges mittelalterliches Mastixdorf",
      heroDescription:
        "Olympoi ist ein ruhiges mittelalterliches Mastixdorf mit Steingassen, traditioneller Architektur und einer entspannten Atmosphäre nahe Mesta.",
    },
  ],
  [
    "/de/doerfer-chios/armolia-dorf/",
    {
      title: "Armolia auf Chios | Töpferdorf & lokales Handwerk",
      description:
        "Entdecken Sie Armolia im Süden von Chios, bekannt für Töpferei, Keramikwerkstätten, lokalen Handel und seine Lage an der Route der Mastixdörfer.",
      heroTitle: "Armolia auf Chios: Töpferdorf und lokales Handwerk",
      heroDescription:
        "Armolia ist ein traditionelles Dorf im Süden von Chios, bekannt für Töpferei, Keramikwerkstätten und seine Lage an der Route der Mastixdörfer.",
    },
  ],
  [
    "/de/doerfer-chios/lagada-dorf/",
    {
      title: "Lagada auf Chios | Hafen, Meer & Fischtavernen",
      description:
        "Entdecken Sie Lagada an der Küste von Chios mit kleinem Hafen, Fischtavernen, Meerblick und entspannter Atmosphäre für einen ruhigen Ausflug.",
      heroTitle: "Lagada auf Chios: Hafen und Fischtavernen am Meer",
      heroDescription:
        "Lagada ist ein entspanntes Küstendorf mit kleinem Hafen, Fischtavernen und Meerblick – ideal für einen ruhigen Ausflug und ein Essen am Wasser.",
    },
  ],
  [
    "/de/doerfer-chios/vessa-dorf/",
    {
      title: "Vessa auf Chios | Ruhiges mittelalterliches Mastixdorf",
      description:
        "Entdecken Sie Vessa auf Chios, ein ruhiges mittelalterliches Mastixdorf mit Steingassen, traditioneller Architektur und authentischer Atmosphäre.",
      heroTitle: "Vessa auf Chios: Ruhiges mittelalterliches Mastixdorf",
      heroDescription:
        "Vessa ist ein ruhiges mittelalterliches Mastixdorf mit schmalen Steingassen, traditioneller Architektur und einem langsamen lokalen Rhythmus.",
    },
  ],
  [
    "/de/doerfer-chios/volissos-dorf/",
    {
      title: "Volissos auf Chios | Burg, Amani & Nordwesten",
      description:
        "Entdecken Sie Volissos im Nordwesten von Chios mit Burg, Blick auf die Amani-Region, traditionellen Gassen und Zugang zu nördlichen Stränden.",
      heroTitle: "Volissos auf Chios: Burg, Amani und Nordwesten",
      heroDescription:
        "Volissos ist das wichtigste Dorf im Nordwesten von Chios, mit Burg, traditionellen Gassen, Blick auf Amani und guter Verbindung zu nördlichen Stränden.",
    },
  ],
]);

const germanMuseumSeoCorrections = new Map<string, SeoCorrection>([
  [
    "/de/museen-chios/archaeologisches-museum-chios/",
    {
      title: "Archäologisches Museum auf Chios | Antike Geschichte",
      description:
        "Besuchen Sie das Archäologische Museum von Chios und entdecken Sie Keramik, Skulpturen, Schmuck und Funde aus der antiken Geschichte der Insel.",
    },
  ],
  [
    "/de/museen-chios/byzantinisches-museum-chios/",
    {
      title: "Byzantinisches Museum auf Chios | Kunst & Geschichte",
      description:
        "Entdecken Sie im Byzantinischen Museum von Chios Ikonen, Fresken und Exponate zur byzantinischen und nachbyzantinischen Geschichte der Insel.",
    },
  ],
  [
    "/de/museen-chios/korais-bibliothek-chios/",
    {
      title: "Korais-Bibliothek auf Chios | Bücher & Geschichte",
      description:
        "Besuchen Sie die Korais-Bibliothek auf Chios und entdecken Sie seltene Bücher, Handschriften, Archive und Sammlungen zur griechischen Geistesgeschichte.",
    },
  ],
  [
    "/de/museen-chios/mastix-museum-chios/",
    {
      title: "Mastixmuseum auf Chios | Besuch & Geschichte",
      description:
        "Besuchen Sie das Mastixmuseum auf Chios und erfahren Sie mehr über Anbau, Ernte, Verarbeitung und kulturelle Bedeutung des Mastix im Süden der Insel.",
    },
  ],
  [
    "/de/museen-chios/schifffahrtsmuseum-chios/",
    {
      title: "Schifffahrtsmuseum auf Chios | Maritime Geschichte",
      description:
        "Besuchen Sie das Schifffahrtsmuseum von Chios und entdecken Sie die maritime Geschichte der Insel, Schiffsmodelle, Navigation, Handel und Seefahrt.",
    },
  ],
  [
    "/de/museen-chios/volkskundemuseum-kallimasia/",
    {
      title: "Volkskundemuseum Kallimasia | Alltag auf Chios",
      description:
        "Entdecken Sie im Volkskundemuseum von Kallimasia traditionelle Werkzeuge, Kleidung und Gegenstände aus dem früheren Alltagsleben der Dörfer von Chios.",
    },
  ],
]);

function normalizeGermanTags(tags: string[]): string[] {
  return tags.map((tag) =>
    tag.replace(/^#/, "").replaceAll("_", " ").trim(),
  );
}

function applySeoCorrections(
  corrections: ReadonlyMap<string, SeoCorrection>,
): void {
  for (const [path, correction] of corrections) {
    seoSnippetOverrides.set(path, {
      title: correction.title,
      description: correction.description,
    });
  }
}

function updateVillageContent(village: VillageDetailData): void {
  const correction = germanVillageCorrections.get(village.seo.canonicalPath);

  if (!correction) return;

  Object.assign(village.seo, {
    title: correction.title,
    description: correction.description,
  });
  Object.assign(village.hero, {
    title: correction.heroTitle,
    description: correction.heroDescription,
    tags: normalizeGermanTags(village.hero.tags),
  });

  if (village.seo.canonicalPath === "/de/doerfer-chios/mesta-dorf/") {
    village.details = [
      {
        icon: "📍",
        title: "Lage und Zugang",
        text: "Mesta liegt im Süden von Chios. Das Dorf lässt sich gut mit Pyrgi, Olympoi und dem Mastixmuseum zu einer Tagesroute verbinden.",
      },
      {
        icon: "🏰",
        title: "Dorfcharakter",
        text: "Die geschlossene Festungsstruktur, Steinhäuser, schmalen Gassen und überdachten Durchgänge bewahren den mittelalterlichen Charakter des Dorfes.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text: "Parken Sie außerhalb der historischen Mauern und erkunden Sie Mesta am Morgen oder am späten Nachmittag in ruhigem Tempo.",
      },
    ];
    village.highlights = {
      title: "Was Sie in Mesta sehen können",
      items: [
        "Mittelalterliche Festungsstruktur",
        "Schmale Steingassen und Gewölbe",
        "Historischer Dorfplatz",
        "Traditionelle Häuser und Kirchen",
      ],
    };
    village.experience = {
      title: "Warum Mesta besuchen?",
      paragraphs: [
        "Mesta vermittelt besonders deutlich, wie die befestigten Mastixdörfer im Süden von Chios aufgebaut waren. Die kompakte Struktur und die überdachten Passagen machen den Rundgang abwechslungsreich.",
        "Nehmen Sie sich Zeit für die kleinen Gassen und den Dorfplatz. Mesta eignet sich ideal als Hauptstopp einer Route durch die südlichen Mastixdörfer.",
      ],
    };
    village.routeIdeas = {
      title: "Mesta mit anderen Stopps verbinden",
      items: [
        {
          icon: "🏘️",
          title: "Route der Mastixdörfer",
          text: "Kombinieren Sie Mesta mit Pyrgi, Olympoi oder Vessa.",
        },
        {
          icon: "🌿",
          title: "Mastixmuseum",
          text: "Besuchen Sie das Museum, um die Kultur der Region besser zu verstehen.",
        },
        {
          icon: "🏖️",
          title: "Strand am Nachmittag",
          text: "Fahren Sie anschließend nach Komi, Mavra Volia oder Agia Dynami.",
        },
      ],
    };
  }

  if (village.seo.canonicalPath === "/de/doerfer-chios/olympoi-dorf/") {
    village.details = [
      {
        icon: "📍",
        title: "Lage und Zugang",
        text: "Olympoi liegt im Süden von Chios zwischen den bekannten Mastixdörfern und lässt sich leicht mit Mesta, Pyrgi und Vessa verbinden.",
      },
      {
        icon: "🏘️",
        title: "Dorfcharakter",
        text: "Das Dorf bewahrt eine kompakte mittelalterliche Struktur mit Steingassen, traditionellen Häusern und einer ruhigeren Atmosphäre als die bekanntesten Nachbardörfer.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text: "Olympoi eignet sich als entspannter Zwischenstopp, wenn Sie die südlichen Dörfer ohne Eile und abseits der größten Besucherströme erleben möchten.",
      },
    ];
    village.highlights = {
      title: "Was Olympoi besonders macht",
      items: [
        "Ruhige mittelalterliche Gassen",
        "Traditionelle Mastixdorf-Architektur",
        "Gute Lage zwischen Pyrgi und Mesta",
        "Authentischer lokaler Rhythmus",
      ],
    };
  }

  if (village.seo.canonicalPath === "/de/doerfer-chios/armolia-dorf/") {
    village.details = [
      {
        icon: "📍",
        title: "Lage und Zugang",
        text: "Armolia liegt im Süden von Chios an einer praktischen Route zu Pyrgi, Mesta, Olympoi und den südlichen Stränden.",
      },
      {
        icon: "🏺",
        title: "Töpferei und Handwerk",
        text: "Das Dorf ist für seine Keramiktradition, Werkstätten und Geschäfte mit handgefertigten Töpferwaren bekannt.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text: "Planen Sie eine kurze Pause für den Dorfplatz und die Keramikläden ein, bevor Sie Ihre Route durch die Mastixdörfer fortsetzen.",
      },
    ];
    village.highlights = {
      title: "Was Sie in Armolia erleben können",
      items: [
        "Lokale Töpferwerkstätten",
        "Handgefertigte Keramik",
        "Entspannter Dorfplatz",
        "Gute Lage für eine Süd-Chios-Route",
      ],
    };
  }

  if (village.seo.canonicalPath === "/de/doerfer-chios/lagada-dorf/") {
    village.details = [
      {
        icon: "📍",
        title: "Lage und Zugang",
        text: "Lagada liegt an der Ostküste von Chios und ist mit dem Auto gut erreichbar. Das Dorf eignet sich für einen entspannten Ausflug ans Meer.",
      },
      {
        icon: "⚓",
        title: "Hafen und Küstenleben",
        text: "Der kleine Hafen, die Boote und die Tavernen am Wasser prägen den Charakter von Lagada und machen das Dorf zu einem beliebten Essensstopp.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text: "Kommen Sie am späten Nachmittag, spazieren Sie am Hafen entlang und lassen Sie Zeit für Fisch oder Meeresfrüchte direkt am Wasser.",
      },
    ];
    village.highlights = {
      title: "Was Lagada besonders macht",
      items: [
        "Kleiner Hafen und Fischerboote",
        "Fischtavernen am Meer",
        "Entspannte Küstenatmosphäre",
        "Schöne Pause für Essen und Aussicht",
      ],
    };
    village.experience = {
      title: "Warum Lagada besuchen?",
      paragraphs: [
        "Lagada bietet eine andere Erfahrung als die mittelalterlichen Dörfer im Süden. Hier stehen Hafenleben, Meerblick und lokale Küche im Mittelpunkt.",
        "Das Dorf ist besonders angenehm für einen ruhigen Spaziergang und ein längeres Essen am Wasser.",
      ],
    };
  }
}

function updateBeachContent(beach: BeachDetailData): void {
  const correction = germanBeachCorrections.get(beach.seo.canonicalPath);

  if (!correction) return;

  Object.assign(beach.seo, {
    title: correction.title,
    description: correction.description,
  });
  Object.assign(beach.hero, {
    title: correction.heroTitle,
    description: correction.heroDescription,
    tags: normalizeGermanTags(beach.hero.tags),
  });

  if (beach.seo.canonicalPath === "/de/straende-chios/lithi-strand/") {
    beach.details = [
      {
        icon: "📍",
        title: "Lage und Zugang",
        text: "Lithi liegt an der Westküste von Chios und ist über eine asphaltierte Straße gut erreichbar. Parkmöglichkeiten befinden sich nahe dem Strand und den Tavernen.",
      },
      {
        icon: "🌊",
        title: "Strandcharakter",
        text: "Der geschützte Sandstrand hat flaches Wasser und eignet sich besonders für Familien, entspanntes Schwimmen und einen längeren Aufenthalt am Meer.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text: "Verbinden Sie Lithi mit Anavatos oder Avgonyma und planen Sie anschließend ein Essen in einer der Fischtavernen direkt am Wasser ein.",
      },
    ];
  }
}

export function applyGermanSeoCorrections(): void {
  applySeoCorrections(germanPageSeoCorrections);
  applySeoCorrections(germanBeachCorrections);
  applySeoCorrections(germanVillageCorrections);
  applySeoCorrections(germanMuseumSeoCorrections);

  for (const village of localizedVillageDetails) {
    if (village.seo.canonicalPath.startsWith("/de/")) {
      updateVillageContent(village);
    }
  }

  for (const beach of localizedBeachDetails) {
    if (beach.seo.canonicalPath.startsWith("/de/")) {
      updateBeachContent(beach);
    }
  }
}
