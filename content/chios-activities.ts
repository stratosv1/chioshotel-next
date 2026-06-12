import type { LanguageCode } from "@/lib/languages";

export type ChiosActivityKey =
  | "hub"
  | "mostra"
  | "greekCourses"
  | "hiking"
  | "thermalBaths"
  | "rocketWar"
  | "orchids";

export type ChiosActivityCard = {
  key: Exclude<ChiosActivityKey, "hub">;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  buttonLabel: string;
};

export type ChiosActivitiesPageData = {
  locale: LanguageCode;
  key: ChiosActivityKey;
  path: string;
  seo: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image?: string;
    imageAlt?: string;
  };
  intro?: {
    title: string;
    text: string[];
  };
  cards?: ChiosActivityCard[];
  sections?: {
    title: string;
    text: string[];
  }[];
  gallery?: {
    src: string;
    alt: string;
  }[];
  cta: {
    title: string;
    text: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
};

export const chiosActivitiesPaths: Record<LanguageCode, string> = {
  en: "/chios-activities/",
  el: "/el/drastiriotites-sti-xio/",
  fr: "/fr/activites-a-chios/",
  de: "/de/aktivitaeten-auf-chios/",
  it: "/it/attivita-a-chios/",
  es: "/es/actividades-en-quios/",
  tr: "/tr/sakiz-adasi-aktiviteleri/",
};

export const chiosActivityDetailPaths: Record<
  Exclude<ChiosActivityKey, "hub">,
  Record<LanguageCode, string>
> = {
  mostra: {
    en: "/chios-festival-mostra/",
    el: "/el/festival-mostra-thymiana-xios/",
    fr: "/fr/festival-mostra-chios/",
    de: "/de/mostra-festival-chios/",
    it: "/it/festival-mostra-chios/",
    es: "/es/festival-mostra-quios/",
    tr: "/tr/sakiz-adasi-mostra-festivali/",
  },
  greekCourses: {
    en: "/greek-language-courses-chios/",
    el: "/el/mathimata-ellinikon-sti-xio/",
    fr: "/fr/cours-de-grec-a-chios/",
    de: "/de/griechischkurse-auf-chios/",
    it: "/it/corsi-di-greco-a-chios/",
    es: "/es/cursos-de-griego-en-quios/",
    tr: "/tr/sakiz-adasi-yunanca-kurslari/",
  },
  hiking: {
    en: "/chios-hiking/",
    el: "/el/pezoporia-sti-xio/",
    fr: "/fr/randonnee-a-chios/",
    de: "/de/wandern-auf-chios/",
    it: "/it/trekking-a-chios/",
    es: "/es/senderismo-en-quios/",
    tr: "/tr/sakiz-adasi-yuruyus-rotalari/",
  },
  thermalBaths: {
    en: "/chios-thermal-baths/",
    el: "/el/iamatika-loutra-xiou/",
    fr: "/fr/sources-thermales-de-chios/",
    de: "/de/thermalquellen-auf-chios/",
    it: "/it/terme-di-chios/",
    es: "/es/banos-termales-de-quios/",
    tr: "/tr/sakiz-adasi-termal-kaplicalari/",
  },
  rocketWar: {
    en: "/rocket-war-chios/",
    el: "/el/rouketopolemos-xios/",
    fr: "/fr/guerre-des-fusees-chios/",
    de: "/de/raketenkrieg-chios/",
    it: "/it/guerra-dei-razzi-chios/",
    es: "/es/guerra-de-cohetes-quios/",
    tr: "/tr/sakiz-adasi-roket-savasi/",
  },
  orchids: {
    en: "/chios-orchids/",
    el: "/el/orchidees-xiou/",
    fr: "/fr/orchidees-de-chios/",
    de: "/de/orchideen-auf-chios/",
    it: "/it/orchidee-di-chios/",
    es: "/es/orquideas-de-quios/",
    tr: "/tr/sakiz-adasi-orkideleri/",
  },
};

const bookingLinks: Record<LanguageCode, string> = {
  en: "/chios-hotels-rates/",
  el: "/el/amesi-kratisi-voulamandis-house/",
  fr: "/fr/tarifs-des-hotels-a-chios/",
  de: "/de/hotelpreise-auf-der-insel-chios/",
  it: "/it/prezzi-hotel-chios/",
  es: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
  tr: "/tr/sakiz-adasi-rezervasyon/",
};

const images = {
  hubHero:
    "/images/activities/ChatGPT-Image-Feb-13-2026-06_09_19-PM.webp",
  mostra: "/images/activities/maxresdefault.webp",
  greekCourses:
    "/images/activities/chios-church-1024x576-1.webp",
  hiking:
    "/images/activities/---_Chios-Hiking-e1645969099488.webp",
  hikingAmani:
    "/images/activities/Hiking-Amani_1_Antonia-1.webp",
  hikingTrail:
    "/images/activities/Chios-trail.webp",
  thermalBaths:
    "/images/activities/the-thermal-baths-center-1.webp",
  rocketWar: "/images/activities/chios1_b-1.webp",
  orchids:
    "/images/activities/chios-orchids-e1645969063573.webp",
  orchidTours:
    "/images/activities/OrchidToursChios-1.webp",
  orchidClose:
    "/images/activities/chios-orchids-orchids-e1645969073154.webp",
  ophrysMastichorum:
    "/images/museums/Ophrys_mastichorum.webp",
  ophrys:
    "/images/activities/Ophrys-8-1.webp",
  ophrysRegis:
    "/images/activities/O.-regis-fernandii-89-Chios.webp",
  ophrysBlitopertha:
    "/images/activities/O.-blitopertha-579-Chios.webp",
};

const hubCardCopy: Record<
  LanguageCode,
  Record<
    Exclude<ChiosActivityKey, "hub">,
    {
      title: string;
      description: string;
      imageAlt: string;
      buttonLabel: string;
    }
  >
> = {
  en: {
    mostra: {
      title: "Chios Festival - Mostra",
      description:
        "Experience the colorful carnival tradition of Thymiana, with music, costumes, dancing and a joyful local atmosphere.",
      imageAlt: "Mostra festival in Thymiana Chios",
      buttonLabel: "Explore Mostra",
    },
    greekCourses: {
      title: "Greek Language Courses in Chios",
      description:
        "Learn Greek while discovering the culture, history, traditions and everyday island life of Chios.",
      imageAlt: "Greek language courses in Chios",
      buttonLabel: "Discover Greek Courses",
    },
    hiking: {
      title: "Chios Hiking",
      description:
        "Follow scenic trails through mastic villages, citrus landscapes, mountain paths and coastal views.",
      imageAlt: "Hiking trails in Chios",
      buttonLabel: "Go Hiking in Chios",
    },
    thermalBaths: {
      title: "Chios Thermal Baths",
      description:
        "Relax at the natural thermal springs of Agiasmata and enjoy a peaceful wellness escape in northern Chios.",
      imageAlt: "Agiasmata thermal baths in Chios",
      buttonLabel: "Relax at Thermal Baths",
    },
    rocketWar: {
      title: "Rocket War of Chios",
      description:
        "Experience Rouketopolemos, the famous Easter tradition of Vrontados that lights up the Chios night sky.",
      imageAlt: "Rocket War of Chios Island",
      buttonLabel: "Experience the Rocket War",
    },
    orchids: {
      title: "Chios Orchids",
      description:
        "Discover the wild orchids, spring flowers and botanical landscapes that make Chios a unique nature destination.",
      imageAlt: "Wild orchids of Chios",
      buttonLabel: "Discover Chios Orchids",
    },
  },
  el: {
    mostra: {
      title: "Μόστρα Θυμιανών",
      description:
        "Ζήστε το πολύχρωμο καρναβαλικό έθιμο των Θυμιανών με μουσική, στολές, χορό και γιορτινή ατμόσφαιρα.",
      imageAlt: "Μόστρα στα Θυμιανά της Χίου",
      buttonLabel: "Δείτε τη Μόστρα",
    },
    greekCourses: {
      title: "Μαθήματα Ελληνικών στη Χίο",
      description:
        "Μάθετε ελληνικά γνωρίζοντας τον πολιτισμό, την ιστορία, τις παραδόσεις και την καθημερινή ζωή της Χίου.",
      imageAlt: "Μαθήματα ελληνικών στη Χίο",
      buttonLabel: "Δείτε τα Μαθήματα",
    },
    hiking: {
      title: "Πεζοπορία στη Χίο",
      description:
        "Ακολουθήστε μονοπάτια σε μαστιχοχώρια, βουνά, περιβόλια, ακτές και φυσικά τοπία του νησιού.",
      imageAlt: "Πεζοπορικές διαδρομές στη Χίο",
      buttonLabel: "Δείτε τις Διαδρομές",
    },
    thermalBaths: {
      title: "Ιαματικά Λουτρά Χίου",
      description:
        "Χαλαρώστε στις φυσικές θερμές πηγές των Αγιασμάτων και απολαύστε μια ήρεμη εμπειρία ευεξίας.",
      imageAlt: "Ιαματικά λουτρά Αγιασμάτων στη Χίο",
      buttonLabel: "Δείτε τα Λουτρά",
    },
    rocketWar: {
      title: "Ρουκετοπόλεμος Χίου",
      description:
        "Ζήστε τον Ρουκετοπόλεμο, το διάσημο πασχαλινό έθιμο του Βροντάδου που φωτίζει τον ουρανό της Χίου.",
      imageAlt: "Ρουκετοπόλεμος στη Χίο",
      buttonLabel: "Δείτε τον Ρουκετοπόλεμο",
    },
    orchids: {
      title: "Ορχιδέες της Χίου",
      description:
        "Ανακαλύψτε τις άγριες ορχιδέες, τα ανοιξιάτικα λουλούδια και τη βοτανική ομορφιά της Χίου.",
      imageAlt: "Άγριες ορχιδέες της Χίου",
      buttonLabel: "Δείτε τις Ορχιδέες",
    },
  },
  fr: {
    mostra: {
      title: "Festival Mostra à Chios",
      description:
        "Découvrez la tradition carnavalesque colorée de Thymiana, avec musique, costumes, danse et ambiance locale.",
      imageAlt: "Festival Mostra à Thymiana Chios",
      buttonLabel: "Découvrir Mostra",
    },
    greekCourses: {
      title: "Cours de grec à Chios",
      description:
        "Apprenez le grec tout en découvrant la culture, l'histoire, les traditions et la vie quotidienne de Chios.",
      imageAlt: "Cours de grec à Chios",
      buttonLabel: "Voir les cours",
    },
    hiking: {
      title: "Randonnée à Chios",
      description:
        "Suivez des sentiers entre villages de mastiha, paysages d'agrumes, montagnes et côtes.",
      imageAlt: "Sentiers de randonnée à Chios",
      buttonLabel: "Voir les randonnées",
    },
    thermalBaths: {
      title: "Sources thermales de Chios",
      description:
        "Détendez-vous aux sources naturelles d'Agiasmata et profitez d'une escapade bien-être dans le nord de Chios.",
      imageAlt: "Sources thermales d'Agiasmata à Chios",
      buttonLabel: "Voir les sources",
    },
    rocketWar: {
      title: "Guerre des fusées de Chios",
      description:
        "Vivez le Rouketopolemos, la célèbre tradition de Pâques de Vrontados qui illumine le ciel de Chios.",
      imageAlt: "Guerre des fusées de Chios",
      buttonLabel: "Découvrir la tradition",
    },
    orchids: {
      title: "Orchidées de Chios",
      description:
        "Découvrez les orchidées sauvages, les fleurs printanières et les paysages botaniques de Chios.",
      imageAlt: "Orchidées sauvages de Chios",
      buttonLabel: "Voir les orchidées",
    },
  },
  de: {
    mostra: {
      title: "Mostra Festival auf Chios",
      description:
        "Erleben Sie die farbenfrohe Karnevalstradition von Thymiana mit Musik, Kostümen, Tanz und lokaler Feststimmung.",
      imageAlt: "Mostra Festival in Thymiana Chios",
      buttonLabel: "Mostra entdecken",
    },
    greekCourses: {
      title: "Griechischkurse auf Chios",
      description:
        "Lernen Sie Griechisch und entdecken Sie Kultur, Geschichte, Traditionen und Alltagsleben auf Chios.",
      imageAlt: "Griechischkurse auf Chios",
      buttonLabel: "Kurse ansehen",
    },
    hiking: {
      title: "Wandern auf Chios",
      description:
        "Folgen Sie Wegen durch Mastixdörfer, Zitruslandschaften, Berge und Küstenpfade.",
      imageAlt: "Wanderwege auf Chios",
      buttonLabel: "Wanderwege ansehen",
    },
    thermalBaths: {
      title: "Thermalquellen auf Chios",
      description:
        "Entspannen Sie an den natürlichen Quellen von Agiasmata und genießen Sie eine ruhige Wellness-Auszeit.",
      imageAlt: "Thermalquellen von Agiasmata auf Chios",
      buttonLabel: "Quellen ansehen",
    },
    rocketWar: {
      title: "Raketenkrieg auf Chios",
      description:
        "Erleben Sie Rouketopolemos, die berühmte Ostertradition von Vrontados, die den Nachthimmel von Chios erleuchtet.",
      imageAlt: "Raketenkrieg auf Chios",
      buttonLabel: "Tradition entdecken",
    },
    orchids: {
      title: "Orchideen auf Chios",
      description:
        "Entdecken Sie wilde Orchideen, Frühlingsblumen und die botanische Schönheit von Chios.",
      imageAlt: "Wilde Orchideen auf Chios",
      buttonLabel: "Orchideen ansehen",
    },
  },
  it: {
    mostra: {
      title: "Festival Mostra a Chios",
      description:
        "Vivi la colorata tradizione carnevalesca di Thymiana, con musica, costumi, danze e atmosfera locale.",
      imageAlt: "Festival Mostra a Thymiana Chios",
      buttonLabel: "Scopri Mostra",
    },
    greekCourses: {
      title: "Corsi di greco a Chios",
      description:
        "Impara il greco scoprendo cultura, storia, tradizioni e vita quotidiana dell'isola di Chios.",
      imageAlt: "Corsi di greco a Chios",
      buttonLabel: "Vedi i corsi",
    },
    hiking: {
      title: "Trekking a Chios",
      description:
        "Segui sentieri tra villaggi del mastice, agrumeti, montagne e panorami costieri.",
      imageAlt: "Sentieri di trekking a Chios",
      buttonLabel: "Vedi i percorsi",
    },
    thermalBaths: {
      title: "Terme di Chios",
      description:
        "Rilassati alle sorgenti naturali di Agiasmata e goditi una tranquilla esperienza di benessere.",
      imageAlt: "Terme di Agiasmata a Chios",
      buttonLabel: "Vedi le terme",
    },
    rocketWar: {
      title: "Guerra dei razzi di Chios",
      description:
        "Vivi il Rouketopolemos, la famosa tradizione pasquale di Vrontados che illumina il cielo di Chios.",
      imageAlt: "Guerra dei razzi di Chios",
      buttonLabel: "Scopri la tradizione",
    },
    orchids: {
      title: "Orchidee di Chios",
      description:
        "Scopri le orchidee selvatiche, i fiori primaverili e i paesaggi botanici di Chios.",
      imageAlt: "Orchidee selvatiche di Chios",
      buttonLabel: "Vedi le orchidee",
    },
  },
  es: {
    mostra: {
      title: "Festival Mostra en Quíos",
      description:
        "Vive la colorida tradición de carnaval de Thymiana, con música, trajes, baile y ambiente local.",
      imageAlt: "Festival Mostra en Thymiana Quíos",
      buttonLabel: "Descubrir Mostra",
    },
    greekCourses: {
      title: "Cursos de griego en Quíos",
      description:
        "Aprende griego mientras descubres la cultura, la historia, las tradiciones y la vida diaria de Quíos.",
      imageAlt: "Cursos de griego en Quíos",
      buttonLabel: "Ver cursos",
    },
    hiking: {
      title: "Senderismo en Quíos",
      description:
        "Sigue rutas por pueblos de mastiha, paisajes de cítricos, montañas y senderos costeros.",
      imageAlt: "Rutas de senderismo en Quíos",
      buttonLabel: "Ver rutas",
    },
    thermalBaths: {
      title: "Baños termales de Quíos",
      description:
        "Relájate en las fuentes naturales de Agiasmata y disfruta de una escapada tranquila de bienestar.",
      imageAlt: "Baños termales de Agiasmata en Quíos",
      buttonLabel: "Ver baños termales",
    },
    rocketWar: {
      title: "Guerra de cohetes de Quíos",
      description:
        "Vive el Rouketopolemos, la famosa tradición de Pascua de Vrontados que ilumina el cielo de Quíos.",
      imageAlt: "Guerra de cohetes de Quíos",
      buttonLabel: "Descubrir la tradición",
    },
    orchids: {
      title: "Orquídeas de Quíos",
      description:
        "Descubre las orquídeas silvestres, las flores de primavera y los paisajes botánicos de Quíos.",
      imageAlt: "Orquídeas silvestres de Quíos",
      buttonLabel: "Ver orquídeas",
    },
  },
  tr: {
    mostra: {
      title: "Sakız Adası Mostra Festivali",
      description:
        "Thymiana'nın renkli karnaval geleneğini müzik, kostümler, dans ve yerel kutlama havasıyla keşfedin.",
      imageAlt: "Thymiana Sakız Adası Mostra Festivali",
      buttonLabel: "Mostra'yı keşfet",
    },
    greekCourses: {
      title: "Sakız Adası'nda Yunanca Kursları",
      description:
        "Yunanca öğrenirken Sakız Adası'nın kültürünü, tarihini, geleneklerini ve günlük yaşamını keşfedin.",
      imageAlt: "Sakız Adası'nda Yunanca kursları",
      buttonLabel: "Kursları gör",
    },
    hiking: {
      title: "Sakız Adası'nda yürüyüş",
      description:
        "Mastik köyleri, narenciye bahçeleri, dağlar ve kıyı manzaraları arasında yürüyüş yapın.",
      imageAlt: "Sakız Adası yürüyüş rotaları",
      buttonLabel: "Rotaları gör",
    },
    thermalBaths: {
      title: "Sakız Adası termal kaplıcaları",
      description:
        "Agiasmata'nın doğal termal sularında rahatlayın ve kuzey Sakız'da huzurlu bir dinlenme deneyimi yaşayın.",
      imageAlt: "Sakız Adası Agiasmata termal kaplıcaları",
      buttonLabel: "Kaplıcaları gör",
    },
    rocketWar: {
      title: "Sakız Adası Roket Savaşı",
      description:
        "Vrontados'un ünlü Paskalya geleneği Rouketopolemos'u ve Sakız gecesini aydınlatan gösteriyi yaşayın.",
      imageAlt: "Sakız Adası Roket Savaşı",
      buttonLabel: "Geleneği keşfet",
    },
    orchids: {
      title: "Sakız Adası orkideleri",
      description:
        "Sakız Adası'nın yabani orkidelerini, bahar çiçeklerini ve botanik manzaralarını keşfedin.",
      imageAlt: "Sakız Adası yabani orkideleri",
      buttonLabel: "Orkideleri gör",
    },
  },
};

function getHubCards(locale: LanguageCode): ChiosActivityCard[] {
  const copy = hubCardCopy[locale] ?? hubCardCopy.en;

  return [
    {
      key: "mostra",
      image: images.mostra,
      href: chiosActivityDetailPaths.mostra[locale],
      ...copy.mostra,
    },
    {
      key: "greekCourses",
      image: images.greekCourses,
      href: chiosActivityDetailPaths.greekCourses[locale],
      ...copy.greekCourses,
    },
    {
      key: "hiking",
      image: images.hiking,
      href: chiosActivityDetailPaths.hiking[locale],
      ...copy.hiking,
    },
    {
      key: "thermalBaths",
      image: images.thermalBaths,
      href: chiosActivityDetailPaths.thermalBaths[locale],
      ...copy.thermalBaths,
    },
    {
      key: "rocketWar",
      image: images.rocketWar,
      href: chiosActivityDetailPaths.rocketWar[locale],
      ...copy.rocketWar,
    },
    {
      key: "orchids",
      image: images.orchids,
      href: chiosActivityDetailPaths.orchids[locale],
      ...copy.orchids,
    },
  ];
}

function baseCta(locale: LanguageCode) {
  const copy: Record<
    LanguageCode,
    {
      title: string;
      text: string;
      primaryLabel: string;
    }
  > = {
    en: {
      title: "Plan your Chios experience",
      text: "Stay at Voulamandis House and discover Chios through culture, nature, tradition and authentic local experiences.",
      primaryLabel: "Book Your Stay",
    },
    el: {
      title: "Οργανώστε την εμπειρία σας στη Χίο",
      text: "Μείνετε στο Voulamandis House και γνωρίστε τη Χίο μέσα από πολιτισμό, φύση, παράδοση και αυθεντικές τοπικές εμπειρίες.",
      primaryLabel: "Κάντε Κράτηση",
    },
    fr: {
      title: "Organisez votre expérience à Chios",
      text: "Séjournez à Voulamandis House et découvrez Chios à travers la culture, la nature, la tradition et les expériences locales.",
      primaryLabel: "Réserver",
    },
    de: {
      title: "Planen Sie Ihr Chios-Erlebnis",
      text: "Übernachten Sie im Voulamandis House und entdecken Sie Chios durch Kultur, Natur, Tradition und authentische lokale Erlebnisse.",
      primaryLabel: "Jetzt buchen",
    },
    it: {
      title: "Organizza la tua esperienza a Chios",
      text: "Soggiorna al Voulamandis House e scopri Chios attraverso cultura, natura, tradizione ed esperienze locali autentiche.",
      primaryLabel: "Prenota",
    },
    es: {
      title: "Organiza tu experiencia en Quíos",
      text: "Alójate en Voulamandis House y descubre Quíos a través de la cultura, la naturaleza, la tradición y las experiencias locales.",
      primaryLabel: "Reservar",
    },
    tr: {
      title: "Sakız Adası deneyiminizi planlayın",
      text: "Voulamandis House'ta konaklayın ve Sakız Adası'nı kültür, doğa, gelenek ve otantik yerel deneyimlerle keşfedin.",
      primaryLabel: "Rezervasyon",
    },
  };

  return {
    ...copy[locale],
    primaryHref: bookingLinks[locale],
  };
}

const englishPages: Record<ChiosActivityKey, ChiosActivitiesPageData> = {
  hub: {
    locale: "en",
    key: "hub",
    path: chiosActivitiesPaths.en,
    seo: {
      title: "Chios Activities - What to Do in Chios | Voulamandis House",
      description:
        "Discover the best things to do in Chios, including Greek language courses, hiking, thermal baths, Mostra Festival, Rocket War and Chios orchids.",
    },
    hero: {
      eyebrow: "Voulamandis House recommends",
      title: "What Can You Do in Chios?",
      subtitle:
        "Language, hiking adventures, wellness escapes and rich cultural heritage: Chios has something special for every traveler.",
      image: images.hubHero,
      imageAlt: "Chios activities and experiences recommended by Voulamandis House",
    },
    intro: {
      title: "Discover authentic Chios experiences",
      text: [
        "Chios is an island of culture, nature and living traditions. From the citrus estates of Kampos to the mastic villages, mountain trails and seaside landscapes, every day can become a different experience.",
        "Take a look below and discover the activities that match your interests, whether you love language, nature, local customs, wellness or unforgettable seasonal events.",
      ],
    },
    cards: getHubCards("en"),
    cta: baseCta("en"),
  },

  mostra: {
    locale: "en",
    key: "mostra",
    path: chiosActivityDetailPaths.mostra.en,
    seo: {
      title: "Chios Festival Mostra in Thymiana | Voulamandis House",
      description:
        "Discover Mostra, the colorful carnival fiesta of Thymiana in Chios, with costumes, music, dancing and local tradition near Kampos.",
    },
    hero: {
      eyebrow: "Chios activities",
      title: "Chios Festival - Mostra",
      subtitle:
        "Experience the colorful carnival fiesta of Thymiana, one of the most joyful local traditions of Chios.",
      image: images.mostra,
      imageAlt: "Mostra festival in Thymiana Chios",
    },
    sections: [
      {
        title: "A colorful carnival tradition near Kampos",
        text: [
          "Mostra takes place in the village of Thymiana, close to the Kampos region of Chios. The name comes from the Italian word for a show or display, and the celebration truly lives up to it.",
          "During the carnival period, the streets fill with music, dancing, masks, costumes and a festive village atmosphere that brings locals and visitors together.",
        ],
      },
      {
        title: "A local celebration with deep roots",
        text: [
          "Mostra is more than a parade. It is a celebration of local identity, history and community spirit, connected with the long cultural memory of Thymiana and Chios.",
          "Visitors can enjoy traditional food, local music and the welcoming rhythm of a village celebration that feels both lively and authentic.",
        ],
      },
      {
        title: "Stay close to the celebration",
        text: [
          "Voulamandis House in Kampos is a peaceful and convenient base for discovering Mostra, Thymiana and the surrounding area of Chios.",
          "After the celebration, return to the calm atmosphere of Kampos and enjoy a more relaxed side of the island.",
        ],
      },
    ],
    cta: {
      ...baseCta("en"),
      title: "Discover Chios during carnival season",
      text: "Stay at Voulamandis House and experience one of the island's most colorful local traditions.",
      secondaryLabel: "Back to Chios Activities",
      secondaryHref: chiosActivitiesPaths.en,
    },
  },

  greekCourses: {
    locale: "en",
    key: "greekCourses",
    path: chiosActivityDetailPaths.greekCourses.en,
    seo: {
      title: "Greek Language Courses in Chios | Alexandria Institute",
      description:
        "Join Greek language and culture courses in Chios by Alexandria Institute and discover local history, traditions, mastiha, Easter customs and island life.",
    },
    hero: {
      eyebrow: "Chios activities",
      title: "Greek Language Courses in Chios",
      subtitle:
        "Learn Greek while experiencing the culture, history and everyday life of Chios.",
      image: images.greekCourses,
      imageAlt: "Greek language courses in Chios",
    },
    sections: [
      {
        title: "Learn Greek on a distinctive Aegean island",
        text: [
          "Alexandria Institute organizes Greek language and culture courses in Chios for different levels, usually during Easter, June and September.",
          "Students can choose one-week, two-week, three-week or four-week programs depending on their time and learning goals.",
        ],
      },
      {
        title: "Language, conversation and culture",
        text: [
          "The courses focus on practical language skills, with special attention to speaking, listening and communication in everyday situations.",
          "Greek culture is part of the experience: local customs, music, literature, mythology, history and island life become part of the learning journey.",
        ],
      },
      {
        title: "Discover Chios while you study",
        text: [
          "Chios offers a rich setting for language learning, from Nea Moni and the medieval mastic villages to Kampos orchards, Easter customs and the island's distinctive flavors.",
          "Voulamandis House offers a quiet base in Kampos for students and travelers who want to combine study with an authentic stay in Chios.",
        ],
      },
    ],
    cta: {
      title: "Combine your course with a stay in Kampos",
      text: "Stay at Voulamandis House and enjoy a peaceful base while attending Greek language courses in Chios.",
      primaryLabel: "Visit Alexandria Institute",
      primaryHref: "https://alexandria-institute.com",
      secondaryLabel: "Book Your Stay",
      secondaryHref: bookingLinks.en,
    },
  },

  hiking: {
    locale: "en",
    key: "hiking",
    path: chiosActivityDetailPaths.hiking.en,
    seo: {
      title: "Chios Hiking Trails | Voulamandis House",
      description:
        "Explore Chios hiking routes through mastic villages, Kampos orchards, Amani mountains, coastal trails, forests and traditional villages.",
    },
    hero: {
      eyebrow: "Chios activities",
      title: "Chios Hiking",
      subtitle:
        "Explore the landscapes, villages, mountains and coastal paths of Chios on foot.",
      image: images.hiking,
      imageAlt: "Chios hiking trail",
    },
    sections: [
      {
        title: "Why hike in Chios?",
        text: [
          "Hiking is one of the best ways to explore the nature of Chios. The island offers citrus orchards in Kampos, mastic trees in the south, rocky mountains, forests, ravines and coastal paths.",
          "Walking routes across the mastic villages reveal fortified medieval settlements, traditional architecture and the cultural importance of mastiha.",
        ],
      },
      {
        title: "Trails for different levels",
        text: [
          "Chios offers routes for relaxed walks, scenic nature observation and more demanding mountain hikes. The central and northern parts of the island are ideal for travelers who enjoy quiet villages, geological landscapes and wide Aegean views.",
          "The Amani area, Pelinaio mountain landscapes and coastal routes offer rewarding experiences for outdoor lovers.",
        ],
      },
      {
        title: "Nature, history and local life",
        text: [
          "A hiking holiday in Chios can combine natural beauty with Byzantine monasteries, medieval villages, local tavernas and seasonal wildflowers.",
          "Voulamandis House in Kampos is a comfortable base for exploring different parts of the island by car before starting your walks.",
        ],
      },
    ],
    gallery: [
      { src: images.hikingAmani, alt: "Hiking in Amani Chios" },
      { src: images.hikingTrail, alt: "Chios trail landscape" },
    ],
    cta: {
      ...baseCta("en"),
      title: "Start your Chios hiking holiday from Voulamandis House",
      text: "Stay in Kampos and explore the hiking routes, villages and natural landscapes of Chios.",
      secondaryLabel: "Back to Chios Activities",
      secondaryHref: chiosActivitiesPaths.en,
    },
  },

  thermalBaths: {
    locale: "en",
    key: "thermalBaths",
    path: chiosActivityDetailPaths.thermalBaths.en,
    seo: {
      title: "Chios Thermal Baths - Agiasmata Springs | Voulamandis House",
      description:
        "Relax at the natural thermal baths of Agiasmata in northern Chios, a peaceful wellness destination surrounded by greenery and nature.",
    },
    hero: {
      eyebrow: "Chios activities",
      title: "Chios Thermal Baths",
      subtitle:
        "Relax at the natural thermal springs of Agiasmata in northern Chios.",
      image: images.thermalBaths,
      imageAlt: "Thermal baths center in Agiasmata Chios",
    },
    sections: [
      {
        title: "A peaceful wellness destination",
        text: [
          "Agiasmata, in northern Chios, is known for its natural thermal waters and calm green surroundings.",
          "The springs have been connected with relaxation and wellbeing since ancient times, making the area a quiet escape for visitors who want a slower rhythm during their stay.",
        ],
      },
      {
        title: "Nature, calm and local exploration",
        text: [
          "A visit to Agiasmata can be combined with gentle walks, scenic views, local food and exploration of northern Chios.",
          "It is a good choice for travelers who want to balance beach days and sightseeing with a more restful experience.",
        ],
      },
      {
        title: "A day trip from Kampos",
        text: [
          "From Voulamandis House, Agiasmata can be part of a longer day trip through the villages and landscapes of northern Chios.",
          "Return to Kampos in the evening and enjoy the quiet atmosphere of the historic citrus area.",
        ],
      },
    ],
    cta: {
      ...baseCta("en"),
      title: "Add a wellness day to your Chios holiday",
      text: "Stay at Voulamandis House and discover the relaxing thermal springs of Agiasmata.",
      secondaryLabel: "Back to Chios Activities",
      secondaryHref: chiosActivitiesPaths.en,
    },
  },

  rocketWar: {
    locale: "en",
    key: "rocketWar",
    path: chiosActivityDetailPaths.rocketWar.en,
    seo: {
      title: "Rocket War of Chios | Voulamandis House",
      description:
        "Experience the famous Rocket War of Chios, the spectacular Easter tradition in Vrontados, and stay at Voulamandis House in Kampos.",
    },
    hero: {
      eyebrow: "Chios activities",
      title: "Rocket War of Chios Island",
      subtitle:
        "Experience the famous Rouketopolemos tradition in Vrontados during Greek Orthodox Easter.",
      image: images.rocketWar,
      imageAlt: "Rocket War of Chios Island",
    },
    sections: [
      {
        title: "The famous Rouketopolemos tradition",
        text: [
          "The Rocket War of Chios, known locally as Rouketopolemos, is one of the island's most famous Easter traditions.",
          "It takes place in Vrontados on the night before Greek Orthodox Easter Sunday and is connected with the rival parishes of Saint Mark and Panagia Ereithiani.",
        ],
      },
      {
        title: "A spectacular Easter experience",
        text: [
          "The event has become known far beyond Chios and attracts visitors who want to witness a unique local custom filled with sound, light and emotion.",
          "For the people of Chios, it remains a powerful symbol of Easter, faith, identity and local tradition.",
        ],
      },
      {
        title: "Watch safely and respectfully",
        text: [
          "Visitors should always follow local safety instructions and watch from recommended viewing areas.",
          "Voulamandis House in Kampos offers a peaceful base for experiencing Easter in Chios while staying within reach of Vrontados and the island's other traditions.",
        ],
      },
    ],
    cta: {
      ...baseCta("en"),
      title: "Stay at Voulamandis House during Easter in Chios",
      text: "Plan your Easter stay in Chios and experience one of the island's most unforgettable traditions.",
      primaryLabel: "Book Your Easter Stay",
      secondaryLabel: "Back to Chios Activities",
      secondaryHref: chiosActivitiesPaths.en,
    },
  },

  orchids: {
    locale: "en",
    key: "orchids",
    path: chiosActivityDetailPaths.orchids.en,
    seo: {
      title: "Chios Orchids - Wild Flowers and Nature | Voulamandis House",
      description:
        "Discover the wild orchids of Chios, spring flowers, botanical sites and nature walks across one of the richest orchid destinations in Europe.",
    },
    hero: {
      eyebrow: "Chios activities",
      title: "Chios Orchids",
      subtitle:
        "Discover the wild flowers, rare orchids and botanical beauty of Chios.",
      image: images.orchids,
      imageAlt: "Wild orchids of Chios",
    },
    sections: [
      {
        title: "The beauty of Chios orchids",
        text: [
          "Chios is known for its remarkable wildflowers and orchids. The most impressive variety appears from late winter until early summer.",
          "Cyclamens, crocuses, lilies, anemones, wild tulips known locally as lalades, poppies, irises, sage and oregano add color and fragrance to the island's landscapes.",
        ],
      },
      {
        title: "Where to discover wild flowers",
        text: [
          "Beautiful sites for flowers and orchids include Kato Fana, Managros, Pelinaio Mountain, Kampia ravine and the hills around Pyrgi, Olympoi and Mesta.",
          "Different areas bloom at different moments of the season, so a short drive can reveal changing landscapes and new botanical surprises.",
        ],
      },
      {
        title: "A botanical destination in the Aegean",
        text: [
          "Traditional, non-intensive agricultural practices have helped preserve areas of botanical interest across Chios.",
          "The island has attracted attention from botanists and nature lovers as one of the richest places in Europe for wild orchids.",
        ],
      },
    ],
    gallery: [
      { src: images.orchidTours, alt: "Orchid tours in Chios" },
      { src: images.orchidClose, alt: "Chios orchid flower" },
      { src: images.ophrysMastichorum, alt: "Ophrys mastichorum in Chios" },
      { src: images.ophrys, alt: "Wild Ophrys orchid in Chios" },
      { src: images.ophrysRegis, alt: "Ophrys regis fernandii in Chios" },
      { src: images.ophrysBlitopertha, alt: "Ophrys blitopertha in Chios" },
    ],
    cta: {
      ...baseCta("en"),
      title: "Discover spring nature in Chios",
      text: "Stay at Voulamandis House and explore the wildflowers and orchid landscapes of Chios.",
      secondaryLabel: "Back to Chios Activities",
      secondaryHref: chiosActivitiesPaths.en,
    },
  },
};

const localizedActivityCopy: Partial<
  Record<LanguageCode, Partial<Record<ChiosActivityKey, Partial<ChiosActivitiesPageData>>>>
> = {
  el: {
    hub: {
      seo: {
        title: "Δραστηριότητες στη Χίο | Voulamandis House",
        description:
          "Ανακαλύψτε δραστηριότητες στη Χίο: μαθήματα ελληνικών, πεζοπορία, ιαματικά λουτρά, Μόστρα, Ρουκετοπόλεμος και ορχιδέες.",
      },
      hero: {
        eyebrow: "Προτάσεις από το Voulamandis House",
        title: "Τι μπορείτε να κάνετε στη Χίο;",
        subtitle:
          "Γλώσσα, πεζοπορία, ευεξία και πλούσια πολιτιστική κληρονομιά: η Χίος έχει κάτι ξεχωριστό για κάθε ταξιδιώτη.",
      },
      intro: {
        title: "Ανακαλύψτε αυθεντικές εμπειρίες στη Χίο",
        text: [
          "Η Χίος είναι ένα νησί με πολιτισμό, φύση και ζωντανές παραδόσεις. Από τον Κάμπο και τα Μαστιχοχώρια μέχρι τα βουνά, τα μονοπάτια και τις ακτές, κάθε μέρα μπορεί να γίνει μια διαφορετική εμπειρία.",
          "Δείτε παρακάτω τις δραστηριότητες που ταιριάζουν στα ενδιαφέροντά σας, είτε αγαπάτε τη γλώσσα, τη φύση, τα τοπικά έθιμα, την ευεξία ή τις ξεχωριστές εποχιακές εμπειρίες.",
        ],
      },
      cards: getHubCards("el"),
      cta: baseCta("el"),
    },
    mostra: {
      seo: {
        title: "Μόστρα Θυμιανών στη Χίο | Voulamandis House",
        description:
          "Γνωρίστε τη Μόστρα Θυμιανών, την πολύχρωμη καρναβαλική γιορτή της Χίου με μουσική, στολές, χορό και τοπική παράδοση.",
      },
      hero: {
        eyebrow: "Δραστηριότητες στη Χίο",
        title: "Μόστρα Θυμιανών",
        subtitle:
          "Ζήστε την πολύχρωμη καρναβαλική γιορτή των Θυμιανών, μία από τις πιο χαρούμενες παραδόσεις της Χίου.",
      },
      sections: [
        {
          title: "Μια ζωντανή παράδοση κοντά στον Κάμπο",
          text: [
            "Η Μόστρα γίνεται στα Θυμιανά, κοντά στην περιοχή του Κάμπου. Το όνομά της συνδέεται με την ιταλική λέξη για την επίδειξη και η γιορτή είναι πραγματικά ένα πολύχρωμο θέαμα.",
            "Την περίοδο του καρναβαλιού, οι δρόμοι γεμίζουν μουσική, χορό, μάσκες, στολές και γιορτινή ατμόσφαιρα.",
          ],
        },
        {
          title: "Γιορτή με ιστορία και τοπική ταυτότητα",
          text: [
            "Η Μόστρα δεν είναι απλώς μια παρέλαση. Είναι μια γιορτή κοινότητας, ιστορίας και τοπικής ταυτότητας.",
            "Οι επισκέπτες μπορούν να χαρούν παραδοσιακές γεύσεις, μουσική και τη ζεστή ατμόσφαιρα ενός αυθεντικού χιώτικου χωριού.",
          ],
        },
        {
          title: "Διαμονή κοντά στη γιορτή",
          text: [
            "Το Voulamandis House στον Κάμπο είναι μια ήρεμη και βολική βάση για να γνωρίσετε τη Μόστρα, τα Θυμιανά και τη γύρω περιοχή.",
            "Μετά τη γιορτή, μπορείτε να επιστρέψετε στην ησυχία του Κάμπου και να απολαύσετε μια πιο χαλαρή πλευρά της Χίου.",
          ],
        },
      ],
      cta: {
        ...baseCta("el"),
        title: "Ανακαλύψτε τη Χίο την περίοδο του καρναβαλιού",
        text: "Μείνετε στο Voulamandis House και ζήστε μία από τις πιο πολύχρωμες τοπικές παραδόσεις του νησιού.",
        secondaryLabel: "Πίσω στις Δραστηριότητες",
        secondaryHref: chiosActivitiesPaths.el,
      },
    },
    greekCourses: {
      seo: {
        title: "Μαθήματα Ελληνικών στη Χίο | Alexandria Institute",
        description:
          "Συνδυάστε μαθήματα ελληνικής γλώσσας στη Χίο με πολιτισμό, ιστορία, μαστίχα, πασχαλινά έθιμα και αυθεντική νησιωτική ζωή.",
      },
      hero: {
        eyebrow: "Δραστηριότητες στη Χίο",
        title: "Μαθήματα Ελληνικών στη Χίο",
        subtitle:
          "Μάθετε ελληνικά γνωρίζοντας τον πολιτισμό, την ιστορία και την καθημερινή ζωή της Χίου.",
      },
      sections: [
        {
          title: "Μάθετε ελληνικά σε ένα ξεχωριστό νησί του Αιγαίου",
          text: [
            "Το Alexandria Institute οργανώνει μαθήματα ελληνικής γλώσσας και πολιτισμού στη Χίο για διαφορετικά επίπεδα, συνήθως το Πάσχα, τον Ιούνιο και τον Σεπτέμβριο.",
            "Οι μαθητές μπορούν να επιλέξουν πρόγραμμα μίας, δύο, τριών ή τεσσάρων εβδομάδων ανάλογα με τον χρόνο και τους στόχους τους.",
          ],
        },
        {
          title: "Γλώσσα, επικοινωνία και πολιτισμός",
          text: [
            "Τα μαθήματα δίνουν έμφαση στην πρακτική χρήση της γλώσσας, στην ομιλία, στην κατανόηση και στην επικοινωνία σε καθημερινές περιστάσεις.",
            "Ο ελληνικός πολιτισμός είναι μέρος της εμπειρίας, με τοπικά έθιμα, μουσική, λογοτεχνία, μυθολογία, ιστορία και ζωή στο νησί.",
          ],
        },
        {
          title: "Γνωρίστε τη Χίο όσο μαθαίνετε",
          text: [
            "Η Χίος προσφέρει πλούσιο πλαίσιο για γλωσσική μάθηση, από τη Νέα Μονή και τα Μαστιχοχώρια μέχρι τον Κάμπο, τα πασχαλινά έθιμα και τις ιδιαίτερες γεύσεις του νησιού.",
            "Το Voulamandis House είναι μια ήσυχη βάση στον Κάμπο για μαθητές και ταξιδιώτες που θέλουν να συνδυάσουν μάθηση και αυθεντική διαμονή.",
          ],
        },
      ],
      cta: {
        title: "Συνδυάστε τα μαθήματα με διαμονή στον Κάμπο",
        text: "Μείνετε στο Voulamandis House και απολαύστε ήρεμη διαμονή κατά τη διάρκεια των μαθημάτων ελληνικών στη Χίο.",
        primaryLabel: "Δείτε το Alexandria Institute",
        primaryHref: "https://alexandria-institute.com",
        secondaryLabel: "Κάντε Κράτηση",
        secondaryHref: bookingLinks.el,
      },
    },
    hiking: {
      seo: {
        title: "Πεζοπορία στη Χίο | Voulamandis House",
        description:
          "Ανακαλύψτε πεζοπορικές διαδρομές στη Χίο μέσα από μαστιχοχώρια, περιβόλια του Κάμπου, βουνά, δάση, ακτές και παραδοσιακά χωριά.",
      },
      hero: {
        eyebrow: "Δραστηριότητες στη Χίο",
        title: "Πεζοπορία στη Χίο",
        subtitle:
          "Εξερευνήστε με τα πόδια τα τοπία, τα χωριά, τα βουνά και τις ακτές της Χίου.",
      },
      sections: [
        {
          title: "Γιατί να κάνετε πεζοπορία στη Χίο;",
          text: [
            "Η πεζοπορία είναι ένας από τους καλύτερους τρόπους για να γνωρίσετε τη φύση της Χίου. Το νησί προσφέρει περιβόλια εσπεριδοειδών στον Κάμπο, μαστιχόδεντρα στον νότο, βουνά, δάση, φαράγγια και ακτές.",
            "Οι διαδρομές στα Μαστιχοχώρια αποκαλύπτουν μεσαιωνικούς οικισμούς, παραδοσιακή αρχιτεκτονική και τη σημασία της μαστίχας.",
          ],
        },
        {
          title: "Διαδρομές για διαφορετικά επίπεδα",
          text: [
            "Η Χίος προσφέρει χαλαρές βόλτες, διαδρομές παρατήρησης της φύσης αλλά και πιο απαιτητικές πεζοπορίες σε βουνά και βόρεια τοπία.",
            "Η Αμανή, το Πελινναίο και οι παραθαλάσσιες διαδρομές χαρίζουν όμορφη θέα και αυθεντικές εικόνες του νησιού.",
          ],
        },
        {
          title: "Φύση, ιστορία και τοπική ζωή",
          text: [
            "Μια πεζοπορική εμπειρία στη Χίο μπορεί να συνδυάσει φύση, βυζαντινά μοναστήρια, μεσαιωνικά χωριά, ταβέρνες και εποχιακά αγριολούλουδα.",
            "Το Voulamandis House στον Κάμπο είναι άνετη βάση για να εξερευνήσετε διαφορετικές περιοχές του νησιού.",
          ],
        },
      ],
      cta: {
        ...baseCta("el"),
        title: "Ξεκινήστε τις πεζοπορίες σας από το Voulamandis House",
        text: "Μείνετε στον Κάμπο και ανακαλύψτε τα μονοπάτια, τα χωριά και τα φυσικά τοπία της Χίου.",
        secondaryLabel: "Πίσω στις Δραστηριότητες",
        secondaryHref: chiosActivitiesPaths.el,
      },
    },
    thermalBaths: {
      seo: {
        title: "Ιαματικά Λουτρά Χίου - Αγιάσματα | Voulamandis House",
        description:
          "Χαλαρώστε στα φυσικά ιαματικά λουτρά των Αγιασμάτων στη βόρεια Χίο, έναν ήρεμο προορισμό ευεξίας μέσα στη φύση.",
      },
      hero: {
        eyebrow: "Δραστηριότητες στη Χίο",
        title: "Ιαματικά Λουτρά Χίου",
        subtitle:
          "Χαλαρώστε στις φυσικές θερμές πηγές των Αγιασμάτων στη βόρεια Χίο.",
      },
      sections: [
        {
          title: "Ένας ήρεμος προορισμός ευεξίας",
          text: [
            "Τα Αγιάσματα στη βόρεια Χίο είναι γνωστά για τα φυσικά θερμά νερά και το ήρεμο πράσινο περιβάλλον.",
            "Οι πηγές συνδέονται παραδοσιακά με τη χαλάρωση και την ευεξία και αποτελούν μια ήσυχη απόδραση για επισκέπτες που θέλουν πιο αργό ρυθμό στις διακοπές τους.",
          ],
        },
        {
          title: "Φύση, ηρεμία και εξερεύνηση",
          text: [
            "Η επίσκεψη στα Αγιάσματα μπορεί να συνδυαστεί με ήπιες βόλτες, θέα, τοπικό φαγητό και γνωριμία με τη βόρεια Χίο.",
            "Είναι ιδανική επιλογή για όσους θέλουν να ισορροπήσουν τις παραλίες και τις εκδρομές με μια πιο χαλαρή εμπειρία.",
          ],
        },
        {
          title: "Εκδρομή από τον Κάμπο",
          text: [
            "Από το Voulamandis House, τα Αγιάσματα μπορούν να γίνουν μέρος μιας ημερήσιας εκδρομής στα χωριά και τα τοπία της βόρειας Χίου.",
            "Το βράδυ επιστρέφετε στην ήρεμη ατμόσφαιρα του ιστορικού Κάμπου.",
          ],
        },
      ],
      cta: {
        ...baseCta("el"),
        title: "Προσθέστε μια μέρα ευεξίας στις διακοπές σας",
        text: "Μείνετε στο Voulamandis House και ανακαλύψτε τις χαλαρωτικές θερμές πηγές των Αγιασμάτων.",
        secondaryLabel: "Πίσω στις Δραστηριότητες",
        secondaryHref: chiosActivitiesPaths.el,
      },
    },
    rocketWar: {
      seo: {
        title: "Ρουκετοπόλεμος Χίου | Voulamandis House",
        description:
          "Ζήστε τον διάσημο Ρουκετοπόλεμο της Χίου, το εντυπωσιακό πασχαλινό έθιμο του Βροντάδου, με διαμονή στο Voulamandis House.",
      },
      hero: {
        eyebrow: "Δραστηριότητες στη Χίο",
        title: "Ρουκετοπόλεμος Χίου",
        subtitle:
          "Ζήστε το διάσημο έθιμο του Ρουκετοπόλεμου στον Βροντάδο το Πάσχα.",
      },
      sections: [
        {
          title: "Το διάσημο έθιμο του Ρουκετοπόλεμου",
          text: [
            "Ο Ρουκετοπόλεμος, γνωστός και ως Rouketopolemos, είναι ένα από τα πιο γνωστά πασχαλινά έθιμα της Χίου.",
            "Γίνεται στον Βροντάδο το βράδυ πριν από την Κυριακή του Πάσχα και συνδέεται με τις ενορίες του Αγίου Μάρκου και της Παναγίας Ερειθιανής.",
          ],
        },
        {
          title: "Μια εντυπωσιακή πασχαλινή εμπειρία",
          text: [
            "Το έθιμο έχει γίνει γνωστό πέρα από τη Χίο και προσελκύει επισκέπτες που θέλουν να δουν μια μοναδική τοπική παράδοση γεμάτη φως, ήχο και συναίσθημα.",
            "Για τους Χιώτες παραμένει ισχυρό σύμβολο Πάσχα, πίστης, ταυτότητας και τοπικής μνήμης.",
          ],
        },
        {
          title: "Παρακολούθηση με ασφάλεια και σεβασμό",
          text: [
            "Οι επισκέπτες πρέπει πάντα να ακολουθούν τις τοπικές οδηγίες ασφαλείας και να παρακολουθούν από προτεινόμενα σημεία.",
            "Το Voulamandis House στον Κάμπο προσφέρει ήρεμη βάση για να ζήσετε το Πάσχα στη Χίο και να γνωρίσετε τις παραδόσεις του νησιού.",
          ],
        },
      ],
      cta: {
        ...baseCta("el"),
        title: "Μείνετε στο Voulamandis House το Πάσχα στη Χίο",
        text: "Οργανώστε τη διαμονή σας στη Χίο και ζήστε μία από τις πιο αξέχαστες παραδόσεις του νησιού.",
        primaryLabel: "Κάντε Κράτηση για Πάσχα",
        secondaryLabel: "Πίσω στις Δραστηριότητες",
        secondaryHref: chiosActivitiesPaths.el,
      },
    },
    orchids: {
      seo: {
        title: "Ορχιδέες της Χίου | Voulamandis House",
        description:
          "Ανακαλύψτε τις άγριες ορχιδέες της Χίου, τα ανοιξιάτικα λουλούδια, τους βοτανικούς τόπους και τη φύση του νησιού.",
      },
      hero: {
        eyebrow: "Δραστηριότητες στη Χίο",
        title: "Ορχιδέες της Χίου",
        subtitle:
          "Ανακαλύψτε τα άγρια λουλούδια, τις σπάνιες ορχιδέες και τη βοτανική ομορφιά της Χίου.",
      },
      sections: [
        {
          title: "Η ομορφιά των ορχιδέων της Χίου",
          text: [
            "Η Χίος είναι γνωστή για τα αγριολούλουδα και τις ορχιδέες της. Η πιο εντυπωσιακή ποικιλία εμφανίζεται από το τέλος του χειμώνα έως τις αρχές του καλοκαιριού.",
            "Κυκλάμινα, κρόκοι, κρίνα, ανεμώνες, λαλάδες, παπαρούνες, ίριδες, φασκόμηλο και ρίγανη δίνουν χρώμα και άρωμα στα τοπία του νησιού.",
          ],
        },
        {
          title: "Πού θα ανακαλύψετε άγρια λουλούδια",
          text: [
            "Όμορφα σημεία για λουλούδια και ορχιδέες είναι ο Κάτω Φανάς, ο Μάναγρος, το Πελινναίο, η Καμπιά και οι λόφοι γύρω από το Πυργί, τους Ολύμπους και τα Μεστά.",
            "Διαφορετικές περιοχές ανθίζουν σε διαφορετικές στιγμές της εποχής, προσφέροντας συνεχώς νέες εικόνες.",
          ],
        },
        {
          title: "Ένας βοτανικός προορισμός στο Αιγαίο",
          text: [
            "Οι παραδοσιακές και ήπιες αγροτικές πρακτικές βοήθησαν να διατηρηθούν περιοχές με μεγάλο βοτανικό ενδιαφέρον στη Χίο.",
            "Το νησί έχει προσελκύσει το ενδιαφέρον βοτανολόγων και φυσιολατρών ως ένας από τους πιο πλούσιους τόπους της Ευρώπης σε άγριες ορχιδέες.",
          ],
        },
      ],
      cta: {
        ...baseCta("el"),
        title: "Ανακαλύψτε την ανοιξιάτικη φύση της Χίου",
        text: "Μείνετε στο Voulamandis House και εξερευνήστε τα αγριολούλουδα και τις ορχιδέες της Χίου.",
        secondaryLabel: "Πίσω στις Δραστηριότητες",
        secondaryHref: chiosActivitiesPaths.el,
      },
    },
  },

  fr: {
    hub: {
      seo: {
        title: "Activités à Chios - Que faire à Chios | Voulamandis House",
        description:
          "Découvrez les activités à Chios : cours de grec, randonnée, sources thermales, festival Mostra, Guerre des fusées et orchidées sauvages.",
      },
      hero: {
        eyebrow: "Recommandé par Voulamandis House",
        title: "Que faire à Chios ?",
        subtitle:
          "Langue, randonnée, bien-être et patrimoine culturel : Chios offre une expérience spéciale à chaque voyageur.",
      },
      intro: {
        title: "Découvrez des expériences authentiques à Chios",
        text: [
          "Chios est une île de culture, de nature et de traditions vivantes. Du Kampos aux villages de mastiha, des montagnes aux sentiers côtiers, chaque journée peut révéler une nouvelle facette de l'île.",
          "Explorez les activités ci-dessous et choisissez celles qui correspondent à vos envies : langue, nature, coutumes locales, bien-être ou grands événements saisonniers.",
        ],
      },
      cards: getHubCards("fr"),
      cta: baseCta("fr"),
    },
    mostra: {
      seo: {
        title: "Festival Mostra à Chios | Voulamandis House",
        description:
          "Découvrez Mostra, la fête carnavalesque colorée de Thymiana à Chios, avec musique, costumes, danse et tradition locale.",
      },
      hero: {
        eyebrow: "Activités à Chios",
        title: "Festival Mostra",
        subtitle:
          "Vivez la fête carnavalesque colorée de Thymiana, l'une des traditions les plus joyeuses de Chios.",
      },
      sections: [
        {
          title: "Une tradition vivante près de Kampos",
          text: [
            "Mostra se déroule à Thymiana, près de la région historique de Kampos. Son nom évoque l'idée de spectacle, et la fête porte bien ce sens.",
            "Pendant la période du carnaval, les rues se remplissent de musique, de danse, de masques, de costumes et d'une atmosphère villageoise festive.",
          ],
        },
        {
          title: "Une fête locale pleine d'identité",
          text: [
            "Mostra est plus qu'un défilé. C'est une fête de communauté, d'histoire et d'identité locale.",
            "Les visiteurs peuvent profiter de saveurs traditionnelles, de musique locale et de l'accueil chaleureux d'un village de Chios.",
          ],
        },
        {
          title: "Séjourner près de la fête",
          text: [
            "Voulamandis House, à Kampos, est une base paisible et pratique pour découvrir Mostra, Thymiana et les environs.",
            "Après la fête, vous retrouvez le calme de Kampos et une autre facette de Chios.",
          ],
        },
      ],
      cta: {
        ...baseCta("fr"),
        title: "Découvrez Chios pendant la saison du carnaval",
        text: "Séjournez à Voulamandis House et vivez l'une des traditions locales les plus colorées de l'île.",
        secondaryLabel: "Retour aux activités",
        secondaryHref: chiosActivitiesPaths.fr,
      },
    },
    greekCourses: {
      seo: {
        title: "Cours de grec à Chios | Alexandria Institute",
        description:
          "Suivez des cours de grec et de culture à Chios avec Alexandria Institute et découvrez l'histoire, les traditions et la vie locale.",
      },
      hero: {
        eyebrow: "Activités à Chios",
        title: "Cours de grec à Chios",
        subtitle:
          "Apprenez le grec tout en découvrant la culture, l'histoire et la vie quotidienne de Chios.",
      },
      sections: [
        {
          title: "Apprendre le grec sur une île unique de l'Égée",
          text: [
            "Alexandria Institute organise des cours de langue et de culture grecques à Chios pour différents niveaux, généralement à Pâques, en juin et en septembre.",
            "Les étudiants peuvent choisir des programmes d'une, deux, trois ou quatre semaines selon leur temps disponible.",
          ],
        },
        {
          title: "Langue, conversation et culture",
          text: [
            "Les cours mettent l'accent sur les compétences pratiques, la conversation, la compréhension orale et la communication dans des situations quotidiennes.",
            "La culture grecque fait partie de l'expérience : coutumes locales, musique, littérature, mythologie, histoire et vie insulaire.",
          ],
        },
        {
          title: "Découvrir Chios pendant le séjour",
          text: [
            "Chios offre un cadre riche pour apprendre, de Nea Moni aux villages de mastiha, en passant par Kampos, les coutumes de Pâques et les saveurs locales.",
            "Voulamandis House offre une base calme à Kampos pour les étudiants et les voyageurs.",
          ],
        },
      ],
      cta: {
        title: "Combinez vos cours avec un séjour à Kampos",
        text: "Séjournez à Voulamandis House et profitez d'une base paisible pendant vos cours de grec à Chios.",
        primaryLabel: "Voir Alexandria Institute",
        primaryHref: "https://alexandria-institute.com",
        secondaryLabel: "Réserver",
        secondaryHref: bookingLinks.fr,
      },
    },
    hiking: {
      seo: {
        title: "Randonnée à Chios | Voulamandis House",
        description:
          "Explorez les sentiers de randonnée de Chios à travers villages de mastiha, Kampos, montagnes, forêts, côtes et villages traditionnels.",
      },
      hero: {
        eyebrow: "Activités à Chios",
        title: "Randonnée à Chios",
        subtitle:
          "Explorez à pied les paysages, villages, montagnes et chemins côtiers de Chios.",
      },
      sections: [
        {
          title: "Pourquoi randonner à Chios ?",
          text: [
            "La randonnée est l'une des meilleures façons de découvrir la nature de Chios. L'île offre des vergers d'agrumes à Kampos, des arbres à mastiha, des montagnes, des forêts, des ravins et des sentiers côtiers.",
            "Les itinéraires dans les villages de mastiha révèlent des villages médiévaux, une architecture traditionnelle et l'importance culturelle de la mastiha.",
          ],
        },
        {
          title: "Des sentiers pour différents niveaux",
          text: [
            "Chios propose des promenades faciles, des itinéraires d'observation de la nature et des randonnées plus exigeantes en montagne.",
            "Les paysages d'Amani, du mont Pelinaio et des côtes offrent de très belles vues sur l'Égée.",
          ],
        },
        {
          title: "Nature, histoire et vie locale",
          text: [
            "Une randonnée à Chios peut combiner nature, monastères byzantins, villages médiévaux, tavernes et fleurs sauvages de saison.",
            "Voulamandis House, à Kampos, est une base confortable pour explorer différentes parties de l'île.",
          ],
        },
      ],
      cta: {
        ...baseCta("fr"),
        title: "Commencez vos randonnées depuis Voulamandis House",
        text: "Séjournez à Kampos et explorez les sentiers, villages et paysages naturels de Chios.",
        secondaryLabel: "Retour aux activités",
        secondaryHref: chiosActivitiesPaths.fr,
      },
    },
    thermalBaths: {
      seo: {
        title: "Sources thermales de Chios - Agiasmata | Voulamandis House",
        description:
          "Détendez-vous aux sources thermales naturelles d'Agiasmata, au nord de Chios, dans un cadre paisible entouré de verdure.",
      },
      hero: {
        eyebrow: "Activités à Chios",
        title: "Sources thermales de Chios",
        subtitle:
          "Détendez-vous aux sources naturelles d'Agiasmata, dans le nord de Chios.",
      },
      sections: [
        {
          title: "Un lieu paisible de bien-être",
          text: [
            "Agiasmata, dans le nord de Chios, est connue pour ses eaux thermales naturelles et son environnement calme et verdoyant.",
            "Les sources sont traditionnellement associées à la détente et au bien-être, offrant une pause tranquille pendant le séjour.",
          ],
        },
        {
          title: "Nature, calme et exploration",
          text: [
            "Une visite à Agiasmata peut se combiner avec de petites promenades, des vues pittoresques, une cuisine locale et l'exploration du nord de Chios.",
            "C'est un bon choix pour équilibrer plages, visites et moments de repos.",
          ],
        },
        {
          title: "Une excursion depuis Kampos",
          text: [
            "Depuis Voulamandis House, Agiasmata peut faire partie d'une excursion à travers les villages et paysages du nord de Chios.",
            "Le soir, vous retrouvez l'atmosphère paisible de Kampos.",
          ],
        },
      ],
      cta: {
        ...baseCta("fr"),
        title: "Ajoutez une journée bien-être à vos vacances",
        text: "Séjournez à Voulamandis House et découvrez les sources relaxantes d'Agiasmata.",
        secondaryLabel: "Retour aux activités",
        secondaryHref: chiosActivitiesPaths.fr,
      },
    },
    rocketWar: {
      seo: {
        title: "Guerre des fusées de Chios | Voulamandis House",
        description:
          "Découvrez la célèbre Guerre des fusées de Chios, la spectaculaire tradition de Pâques à Vrontados.",
      },
      hero: {
        eyebrow: "Activités à Chios",
        title: "Guerre des fusées de Chios",
        subtitle:
          "Vivez la célèbre tradition de Rouketopolemos à Vrontados pendant la Pâque orthodoxe grecque.",
      },
      sections: [
        {
          title: "La célèbre tradition de Rouketopolemos",
          text: [
            "La Guerre des fusées de Chios, appelée localement Rouketopolemos, est l'une des traditions de Pâques les plus célèbres de l'île.",
            "Elle se déroule à Vrontados la veille du dimanche de Pâques orthodoxe et est liée aux paroisses de Saint Marc et de Panagia Ereithiani.",
          ],
        },
        {
          title: "Une expérience pascale spectaculaire",
          text: [
            "L'événement est connu bien au-delà de Chios et attire des visiteurs qui souhaitent voir une coutume locale unique, pleine de lumière, de son et d'émotion.",
            "Pour les habitants de Chios, il reste un symbole fort de Pâques, de foi, d'identité et de tradition locale.",
          ],
        },
        {
          title: "Observer avec sécurité et respect",
          text: [
            "Les visiteurs doivent toujours suivre les consignes locales de sécurité et regarder depuis les zones recommandées.",
            "Voulamandis House, à Kampos, offre une base paisible pour vivre Pâques à Chios.",
          ],
        },
      ],
      cta: {
        ...baseCta("fr"),
        title: "Séjournez à Voulamandis House pendant Pâques à Chios",
        text: "Planifiez votre séjour de Pâques et découvrez l'une des traditions les plus mémorables de l'île.",
        primaryLabel: "Réserver pour Pâques",
        secondaryLabel: "Retour aux activités",
        secondaryHref: chiosActivitiesPaths.fr,
      },
    },
    orchids: {
      seo: {
        title: "Orchidées de Chios | Voulamandis House",
        description:
          "Découvrez les orchidées sauvages de Chios, les fleurs printanières, les sites botaniques et les promenades nature de l'île.",
      },
      hero: {
        eyebrow: "Activités à Chios",
        title: "Orchidées de Chios",
        subtitle:
          "Découvrez les fleurs sauvages, les orchidées rares et la beauté botanique de Chios.",
      },
      sections: [
        {
          title: "La beauté des orchidées de Chios",
          text: [
            "Chios est connue pour ses fleurs sauvages et ses orchidées. La plus grande variété apparaît de la fin de l'hiver au début de l'été.",
            "Cyclamens, crocus, lys, anémones, tulipes sauvages, coquelicots, iris, sauge et origan colorent et parfument les paysages.",
          ],
        },
        {
          title: "Où découvrir les fleurs sauvages",
          text: [
            "Parmi les beaux sites figurent Kato Fana, Managros, le mont Pelinaio, le ravin de Kampia et les collines autour de Pyrgi, Olympoi et Mesta.",
            "Les différentes régions fleurissent à des moments différents, révélant sans cesse de nouveaux paysages.",
          ],
        },
        {
          title: "Une destination botanique en Égée",
          text: [
            "Les pratiques agricoles traditionnelles et peu intensives ont aidé à préserver des zones de grand intérêt botanique.",
            "Chios attire botanistes et amoureux de la nature comme l'un des lieux les plus riches d'Europe pour les orchidées sauvages.",
          ],
        },
      ],
      cta: {
        ...baseCta("fr"),
        title: "Découvrez la nature printanière de Chios",
        text: "Séjournez à Voulamandis House et explorez les fleurs sauvages et les orchidées de Chios.",
        secondaryLabel: "Retour aux activités",
        secondaryHref: chiosActivitiesPaths.fr,
      },
    },
  },

  de: {
    hub: {
      seo: {
        title: "Aktivitäten auf Chios | Voulamandis House",
        description:
          "Entdecken Sie Aktivitäten auf Chios: Griechischkurse, Wandern, Thermalquellen, Mostra Festival, Raketenkrieg und wilde Orchideen.",
      },
      hero: {
        eyebrow: "Empfohlen von Voulamandis House",
        title: "Was kann man auf Chios unternehmen?",
        subtitle:
          "Sprache, Wandern, Wellness und kulturelles Erbe: Chios bietet jedem Reisenden etwas Besonderes.",
      },
      intro: {
        title: "Authentische Erlebnisse auf Chios",
        text: [
          "Chios ist eine Insel voller Kultur, Natur und lebendiger Traditionen. Von Kampos und den Mastixdörfern bis zu Bergen, Wanderwegen und Küsten zeigt jeder Tag eine andere Seite der Insel.",
          "Entdecken Sie die Aktivitäten unten und wählen Sie, was zu Ihren Interessen passt: Sprache, Natur, lokale Bräuche, Wellness oder besondere saisonale Ereignisse.",
        ],
      },
      cards: getHubCards("de"),
      cta: baseCta("de"),
    },
    mostra: {
      seo: {
        title: "Mostra Festival auf Chios | Voulamandis House",
        description:
          "Entdecken Sie Mostra, das farbenfrohe Karnevalsfest von Thymiana auf Chios, mit Musik, Kostümen, Tanz und lokaler Tradition.",
      },
      hero: {
        eyebrow: "Aktivitäten auf Chios",
        title: "Mostra Festival",
        subtitle:
          "Erleben Sie das farbenfrohe Karnevalsfest von Thymiana, eine der fröhlichsten Traditionen auf Chios.",
      },
      sections: [
        {
          title: "Eine farbenfrohe Tradition nahe Kampos",
          text: [
            "Mostra findet im Dorf Thymiana nahe der historischen Region Kampos statt. Der Name erinnert an eine Schau oder Vorführung, und genau das bietet dieses Fest.",
            "Während der Karnevalszeit füllen Musik, Tanz, Masken, Kostüme und festliche Stimmung die Straßen des Dorfes.",
          ],
        },
        {
          title: "Ein lokales Fest mit Identität",
          text: [
            "Mostra ist mehr als ein Umzug. Es ist ein Fest der Gemeinschaft, der Geschichte und der lokalen Identität.",
            "Besucher erleben traditionelle Speisen, Musik und die herzliche Atmosphäre eines echten Dorfes auf Chios.",
          ],
        },
        {
          title: "Nahe am Fest übernachten",
          text: [
            "Voulamandis House in Kampos ist eine ruhige und praktische Basis, um Mostra, Thymiana und die Umgebung zu entdecken.",
            "Nach dem Fest kehren Sie in die entspannte Atmosphäre von Kampos zurück.",
          ],
        },
      ],
      cta: {
        ...baseCta("de"),
        title: "Entdecken Sie Chios zur Karnevalszeit",
        text: "Übernachten Sie im Voulamandis House und erleben Sie eine der farbenfrohen Traditionen der Insel.",
        secondaryLabel: "Zurück zu den Aktivitäten",
        secondaryHref: chiosActivitiesPaths.de,
      },
    },
    greekCourses: {
      seo: {
        title: "Griechischkurse auf Chios | Alexandria Institute",
        description:
          "Besuchen Sie Griechisch- und Kulturkurse auf Chios mit Alexandria Institute und entdecken Sie Geschichte, Traditionen und Inselleben.",
      },
      hero: {
        eyebrow: "Aktivitäten auf Chios",
        title: "Griechischkurse auf Chios",
        subtitle:
          "Lernen Sie Griechisch und erleben Sie Kultur, Geschichte und Alltag auf Chios.",
      },
      sections: [
        {
          title: "Griechisch lernen auf einer besonderen Ägäisinsel",
          text: [
            "Alexandria Institute organisiert Griechisch- und Kulturkurse auf Chios für verschiedene Niveaus, meist zu Ostern, im Juni und im September.",
            "Studierende können Programme von einer, zwei, drei oder vier Wochen wählen.",
          ],
        },
        {
          title: "Sprache, Gespräch und Kultur",
          text: [
            "Die Kurse konzentrieren sich auf praktische Sprachkenntnisse, Sprechen, Hörverstehen und Kommunikation im Alltag.",
            "Griechische Kultur ist Teil der Erfahrung: lokale Bräuche, Musik, Literatur, Mythologie, Geschichte und Inselleben.",
          ],
        },
        {
          title: "Chios während des Lernens entdecken",
          text: [
            "Chios bietet ein reiches Umfeld zum Lernen, von Nea Moni und den Mastixdörfern bis zu Kampos, Osterbräuchen und lokalen Aromen.",
            "Voulamandis House bietet eine ruhige Basis in Kampos für Studierende und Reisende.",
          ],
        },
      ],
      cta: {
        title: "Kombinieren Sie Ihren Kurs mit einem Aufenthalt in Kampos",
        text: "Übernachten Sie im Voulamandis House und genießen Sie eine ruhige Basis während Ihres Griechischkurses auf Chios.",
        primaryLabel: "Alexandria Institute ansehen",
        primaryHref: "https://alexandria-institute.com",
        secondaryLabel: "Jetzt buchen",
        secondaryHref: bookingLinks.de,
      },
    },
    hiking: {
      seo: {
        title: "Wandern auf Chios | Voulamandis House",
        description:
          "Entdecken Sie Wanderwege auf Chios durch Mastixdörfer, Kampos, Berge, Wälder, Küsten und traditionelle Dörfer.",
      },
      hero: {
        eyebrow: "Aktivitäten auf Chios",
        title: "Wandern auf Chios",
        subtitle:
          "Entdecken Sie die Landschaften, Dörfer, Berge und Küstenwege von Chios zu Fuß.",
      },
      sections: [
        {
          title: "Warum auf Chios wandern?",
          text: [
            "Wandern ist eine der besten Möglichkeiten, die Natur von Chios kennenzulernen. Die Insel bietet Zitrusgärten in Kampos, Mastixbäume im Süden, Berge, Wälder, Schluchten und Küstenwege.",
            "Die Routen durch die Mastixdörfer zeigen mittelalterliche Siedlungen, traditionelle Architektur und die kulturelle Bedeutung von Mastiha.",
          ],
        },
        {
          title: "Wege für verschiedene Niveaus",
          text: [
            "Chios bietet leichte Spaziergänge, Naturbeobachtung und anspruchsvollere Bergwanderungen.",
            "Die Region Amani, der Pelinaio und die Küstenwege bieten beeindruckende Ausblicke auf die Ägäis.",
          ],
        },
        {
          title: "Natur, Geschichte und lokales Leben",
          text: [
            "Eine Wanderreise auf Chios kann Natur, byzantinische Klöster, mittelalterliche Dörfer, Tavernen und saisonale Wildblumen verbinden.",
            "Voulamandis House in Kampos ist eine komfortable Basis, um verschiedene Teile der Insel zu erkunden.",
          ],
        },
      ],
      cta: {
        ...baseCta("de"),
        title: "Starten Sie Ihren Wanderurlaub im Voulamandis House",
        text: "Übernachten Sie in Kampos und entdecken Sie die Wanderwege, Dörfer und Naturlandschaften von Chios.",
        secondaryLabel: "Zurück zu den Aktivitäten",
        secondaryHref: chiosActivitiesPaths.de,
      },
    },
    thermalBaths: {
      seo: {
        title: "Thermalquellen auf Chios - Agiasmata | Voulamandis House",
        description:
          "Entspannen Sie an den natürlichen Thermalquellen von Agiasmata im Norden von Chios, einem ruhigen Wellness-Ort in der Natur.",
      },
      hero: {
        eyebrow: "Aktivitäten auf Chios",
        title: "Thermalquellen auf Chios",
        subtitle:
          "Entspannen Sie an den natürlichen Thermalquellen von Agiasmata im Norden von Chios.",
      },
      sections: [
        {
          title: "Ein ruhiger Wellness-Ort",
          text: [
            "Agiasmata im Norden von Chios ist bekannt für natürliche Thermalwasser und eine ruhige grüne Umgebung.",
            "Die Quellen werden traditionell mit Entspannung und Wohlbefinden verbunden und bieten eine ruhige Auszeit während des Aufenthalts.",
          ],
        },
        {
          title: "Natur, Ruhe und Erkundung",
          text: [
            "Ein Besuch in Agiasmata lässt sich mit kleinen Spaziergängen, schönen Ausblicken, lokaler Küche und der Erkundung des Nordens von Chios verbinden.",
            "Es ist ideal für Reisende, die Strandtage und Besichtigungen mit Ruhe ausgleichen möchten.",
          ],
        },
        {
          title: "Ein Tagesausflug von Kampos",
          text: [
            "Vom Voulamandis House aus kann Agiasmata Teil eines Tagesausflugs durch die Dörfer und Landschaften Nordchios sein.",
            "Am Abend kehren Sie in die ruhige Atmosphäre von Kampos zurück.",
          ],
        },
      ],
      cta: {
        ...baseCta("de"),
        title: "Fügen Sie Ihrem Urlaub einen Wellness-Tag hinzu",
        text: "Übernachten Sie im Voulamandis House und entdecken Sie die entspannenden Quellen von Agiasmata.",
        secondaryLabel: "Zurück zu den Aktivitäten",
        secondaryHref: chiosActivitiesPaths.de,
      },
    },
    rocketWar: {
      seo: {
        title: "Raketenkrieg auf Chios - Rouketopolemos | Voulamandis House",
        description:
          "Erleben Sie den berühmten Raketenkrieg von Chios, die spektakuläre Ostertradition in Vrontados.",
      },
      hero: {
        eyebrow: "Aktivitäten auf Chios",
        title: "Raketenkrieg auf Chios",
        subtitle:
          "Erleben Sie die berühmte Rouketopolemos-Tradition in Vrontados während des griechisch-orthodoxen Osterfestes.",
      },
      sections: [
        {
          title: "Die berühmte Rouketopolemos-Tradition",
          text: [
            "Der Raketenkrieg von Chios, lokal Rouketopolemos genannt, ist eine der bekanntesten Ostertraditionen der Insel.",
            "Er findet in Vrontados in der Nacht vor dem orthodoxen Ostersonntag statt und ist mit den Gemeinden Saint Mark und Panagia Ereithiani verbunden.",
          ],
        },
        {
          title: "Ein spektakuläres Ostererlebnis",
          text: [
            "Das Ereignis ist weit über Chios hinaus bekannt und zieht Besucher an, die eine einzigartige lokale Tradition voller Licht, Klang und Emotion erleben möchten.",
            "Für die Menschen auf Chios bleibt es ein starkes Symbol von Ostern, Glauben, Identität und lokaler Tradition.",
          ],
        },
        {
          title: "Sicher und respektvoll beobachten",
          text: [
            "Besucher sollten immer den lokalen Sicherheitshinweisen folgen und nur von empfohlenen Aussichtspunkten beobachten.",
            "Voulamandis House in Kampos bietet eine ruhige Basis, um Ostern auf Chios zu erleben.",
          ],
        },
      ],
      cta: {
        ...baseCta("de"),
        title: "Übernachten Sie zu Ostern im Voulamandis House",
        text: "Planen Sie Ihren Osteraufenthalt auf Chios und erleben Sie eine der unvergesslichsten Traditionen der Insel.",
        primaryLabel: "Osteraufenthalt buchen",
        secondaryLabel: "Zurück zu den Aktivitäten",
        secondaryHref: chiosActivitiesPaths.de,
      },
    },
    orchids: {
      seo: {
        title: "Orchideen auf Chios | Voulamandis House",
        description:
          "Entdecken Sie wilde Orchideen auf Chios, Frühlingsblumen, botanische Orte und Naturspaziergänge auf der Insel.",
      },
      hero: {
        eyebrow: "Aktivitäten auf Chios",
        title: "Orchideen auf Chios",
        subtitle:
          "Entdecken Sie Wildblumen, seltene Orchideen und die botanische Schönheit von Chios.",
      },
      sections: [
        {
          title: "Die Schönheit der Orchideen auf Chios",
          text: [
            "Chios ist für seine Wildblumen und Orchideen bekannt. Die größte Vielfalt erscheint vom späten Winter bis zum Frühsommer.",
            "Zyklamen, Krokusse, Lilien, Anemonen, wilde Tulpen, Mohn, Iris, Salbei und Oregano färben und duften die Landschaften der Insel.",
          ],
        },
        {
          title: "Wo man Wildblumen entdecken kann",
          text: [
            "Schöne Orte für Blumen und Orchideen sind Kato Fana, Managros, der Berg Pelinaio, die Kampia-Schlucht und die Hügel um Pyrgi, Olympoi und Mesta.",
            "Verschiedene Regionen blühen zu unterschiedlichen Zeiten und zeigen immer neue Landschaften.",
          ],
        },
        {
          title: "Ein botanisches Ziel in der Ägäis",
          text: [
            "Traditionelle und wenig intensive Landwirtschaft hat dazu beigetragen, Gebiete von botanischem Interesse zu erhalten.",
            "Chios zieht Botaniker und Naturliebhaber als einer der reichsten Orte Europas für wilde Orchideen an.",
          ],
        },
      ],
      cta: {
        ...baseCta("de"),
        title: "Entdecken Sie die Frühlingsnatur von Chios",
        text: "Übernachten Sie im Voulamandis House und erkunden Sie die Wildblumen und Orchideen von Chios.",
        secondaryLabel: "Zurück zu den Aktivitäten",
        secondaryHref: chiosActivitiesPaths.de,
      },
    },
  },

  it: {
    hub: {
      seo: {
        title: "Attività a Chios - Cosa fare a Chios | Voulamandis House",
        description:
          "Scopri cosa fare a Chios: corsi di greco, trekking, terme, Festival Mostra, Guerra dei razzi e orchidee selvatiche.",
      },
      hero: {
        eyebrow: "Consigliato da Voulamandis House",
        title: "Cosa fare a Chios?",
        subtitle:
          "Lingua, trekking, benessere e patrimonio culturale: Chios offre qualcosa di speciale a ogni viaggiatore.",
      },
      intro: {
        title: "Scopri esperienze autentiche a Chios",
        text: [
          "Chios è un'isola di cultura, natura e tradizioni vive. Da Kampos ai villaggi del mastice, dalle montagne ai sentieri costieri, ogni giorno può mostrare un volto diverso dell'isola.",
          "Scopri le attività qui sotto e scegli quelle più adatte ai tuoi interessi: lingua, natura, usanze locali, benessere o eventi stagionali indimenticabili.",
        ],
      },
      cards: getHubCards("it"),
      cta: baseCta("it"),
    },
    mostra: {
      seo: {
        title: "Festival Mostra a Chios | Voulamandis House",
        description:
          "Scopri Mostra, la colorata festa di carnevale di Thymiana a Chios, con musica, costumi, danze e tradizione locale.",
      },
      hero: {
        eyebrow: "Attività a Chios",
        title: "Festival Mostra",
        subtitle:
          "Vivi la festa carnevalesca colorata di Thymiana, una delle tradizioni più gioiose di Chios.",
      },
      sections: [
        {
          title: "Una tradizione colorata vicino a Kampos",
          text: [
            "Mostra si svolge nel villaggio di Thymiana, vicino alla storica zona di Kampos. Il nome richiama l'idea di uno spettacolo, e la festa lo dimostra pienamente.",
            "Durante il periodo di carnevale, le strade si riempiono di musica, balli, maschere, costumi e atmosfera festosa.",
          ],
        },
        {
          title: "Una festa locale con identità",
          text: [
            "Mostra è più di una sfilata. È una celebrazione della comunità, della storia e dell'identità locale.",
            "I visitatori possono godere sapori tradizionali, musica e l'atmosfera accogliente di un villaggio di Chios.",
          ],
        },
        {
          title: "Soggiornare vicino alla festa",
          text: [
            "Voulamandis House a Kampos è una base tranquilla e comoda per scoprire Mostra, Thymiana e la zona circostante.",
            "Dopo la festa, si torna alla calma di Kampos e a un lato più rilassato dell'isola.",
          ],
        },
      ],
      cta: {
        ...baseCta("it"),
        title: "Scopri Chios durante il Carnevale",
        text: "Soggiorna al Voulamandis House e vivi una delle tradizioni locali più colorate dell'isola.",
        secondaryLabel: "Torna alle attività",
        secondaryHref: chiosActivitiesPaths.it,
      },
    },
    greekCourses: {
      seo: {
        title: "Corsi di greco a Chios | Alexandria Institute",
        description:
          "Partecipa a corsi di lingua e cultura greca a Chios con Alexandria Institute e scopri storia, tradizioni e vita locale.",
      },
      hero: {
        eyebrow: "Attività a Chios",
        title: "Corsi di greco a Chios",
        subtitle:
          "Impara il greco vivendo la cultura, la storia e la vita quotidiana di Chios.",
      },
      sections: [
        {
          title: "Imparare il greco su un'isola speciale dell'Egeo",
          text: [
            "Alexandria Institute organizza corsi di lingua e cultura greca a Chios per diversi livelli, di solito a Pasqua, in giugno e in settembre.",
            "Gli studenti possono scegliere programmi di una, due, tre o quattro settimane.",
          ],
        },
        {
          title: "Lingua, conversazione e cultura",
          text: [
            "I corsi si concentrano sulle competenze pratiche, sulla conversazione, sull'ascolto e sulla comunicazione quotidiana.",
            "La cultura greca fa parte dell'esperienza: usanze locali, musica, letteratura, mitologia, storia e vita dell'isola.",
          ],
        },
        {
          title: "Scoprire Chios mentre studi",
          text: [
            "Chios offre un contesto ricco per imparare, da Nea Moni ai villaggi del mastice, da Kampos alle tradizioni pasquali e ai sapori locali.",
            "Voulamandis House offre una base tranquilla a Kampos per studenti e viaggiatori.",
          ],
        },
      ],
      cta: {
        title: "Abbina il corso a un soggiorno a Kampos",
        text: "Soggiorna al Voulamandis House e goditi una base tranquilla durante i corsi di greco a Chios.",
        primaryLabel: "Visita Alexandria Institute",
        primaryHref: "https://alexandria-institute.com",
        secondaryLabel: "Prenota",
        secondaryHref: bookingLinks.it,
      },
    },
    hiking: {
      seo: {
        title: "Trekking a Chios | Voulamandis House",
        description:
          "Esplora i percorsi trekking di Chios tra villaggi del mastice, Kampos, montagne, boschi, coste e villaggi tradizionali.",
      },
      hero: {
        eyebrow: "Attività a Chios",
        title: "Trekking a Chios",
        subtitle:
          "Esplora a piedi paesaggi, villaggi, montagne e sentieri costieri di Chios.",
      },
      sections: [
        {
          title: "Perché fare trekking a Chios?",
          text: [
            "Il trekking è uno dei modi migliori per scoprire la natura di Chios. L'isola offre agrumeti a Kampos, alberi di mastice, montagne, boschi, gole e sentieri costieri.",
            "I percorsi nei villaggi del mastice rivelano insediamenti medievali, architettura tradizionale e l'importanza culturale della mastiha.",
          ],
        },
        {
          title: "Sentieri per diversi livelli",
          text: [
            "Chios offre passeggiate facili, itinerari di osservazione della natura e camminate più impegnative in montagna.",
            "Amani, il monte Pelinaio e i percorsi costieri regalano viste memorabili sull'Egeo.",
          ],
        },
        {
          title: "Natura, storia e vita locale",
          text: [
            "Un'esperienza trekking a Chios può combinare natura, monasteri bizantini, villaggi medievali, taverne e fiori selvatici stagionali.",
            "Voulamandis House a Kampos è una base comoda per esplorare diverse zone dell'isola.",
          ],
        },
      ],
      cta: {
        ...baseCta("it"),
        title: "Inizia la tua vacanza trekking da Voulamandis House",
        text: "Soggiorna a Kampos e scopri sentieri, villaggi e paesaggi naturali di Chios.",
        secondaryLabel: "Torna alle attività",
        secondaryHref: chiosActivitiesPaths.it,
      },
    },
    thermalBaths: {
      seo: {
        title: "Terme di Chios - Sorgenti di Agiasmata | Voulamandis House",
        description:
          "Rilassati alle sorgenti termali naturali di Agiasmata, nel nord di Chios, in un ambiente tranquillo immerso nel verde.",
      },
      hero: {
        eyebrow: "Attività a Chios",
        title: "Terme di Chios",
        subtitle:
          "Rilassati alle sorgenti termali naturali di Agiasmata, nel nord di Chios.",
      },
      sections: [
        {
          title: "Una destinazione tranquilla per il benessere",
          text: [
            "Agiasmata, nel nord di Chios, è nota per le sue acque termali naturali e l'ambiente verde e silenzioso.",
            "Le sorgenti sono tradizionalmente associate al relax e al benessere, offrendo una pausa lenta durante il soggiorno.",
          ],
        },
        {
          title: "Natura, calma ed esplorazione",
          text: [
            "Una visita ad Agiasmata può essere abbinata a passeggiate leggere, panorami, cucina locale e scoperta del nord di Chios.",
            "È una buona scelta per alternare giornate di mare, visite e momenti di riposo.",
          ],
        },
        {
          title: "Una gita da Kampos",
          text: [
            "Dal Voulamandis House, Agiasmata può diventare parte di una gita tra villaggi e paesaggi del nord dell'isola.",
            "La sera si torna alla calma atmosfera di Kampos.",
          ],
        },
      ],
      cta: {
        ...baseCta("it"),
        title: "Aggiungi una giornata di benessere alla vacanza",
        text: "Soggiorna al Voulamandis House e scopri le rilassanti sorgenti di Agiasmata.",
        secondaryLabel: "Torna alle attività",
        secondaryHref: chiosActivitiesPaths.it,
      },
    },
    rocketWar: {
      seo: {
        title: "Guerra dei razzi di Chios | Voulamandis House",
        description:
          "Vivi la famosa Guerra dei razzi di Chios, la spettacolare tradizione pasquale di Vrontados.",
      },
      hero: {
        eyebrow: "Attività a Chios",
        title: "Guerra dei razzi di Chios",
        subtitle:
          "Vivi la famosa tradizione del Rouketopolemos a Vrontados durante la Pasqua greco-ortodossa.",
      },
      sections: [
        {
          title: "La famosa tradizione del Rouketopolemos",
          text: [
            "La Guerra dei razzi di Chios, chiamata localmente Rouketopolemos, è una delle tradizioni pasquali più famose dell'isola.",
            "Si svolge a Vrontados la notte prima della domenica di Pasqua ortodossa ed è legata alle parrocchie di San Marco e Panagia Ereithiani.",
          ],
        },
        {
          title: "Un'esperienza pasquale spettacolare",
          text: [
            "L'evento è conosciuto ben oltre Chios e attira visitatori che desiderano vedere una tradizione locale unica, ricca di luce, suono ed emozione.",
            "Per gli abitanti di Chios rimane un simbolo forte di Pasqua, fede, identità e tradizione.",
          ],
        },
        {
          title: "Osservare in sicurezza e con rispetto",
          text: [
            "I visitatori devono sempre seguire le indicazioni locali di sicurezza e osservare dagli spazi consigliati.",
            "Voulamandis House a Kampos offre una base tranquilla per vivere la Pasqua a Chios.",
          ],
        },
      ],
      cta: {
        ...baseCta("it"),
        title: "Soggiorna al Voulamandis House durante la Pasqua a Chios",
        text: "Organizza il tuo soggiorno pasquale e vivi una delle tradizioni più indimenticabili dell'isola.",
        primaryLabel: "Prenota per Pasqua",
        secondaryLabel: "Torna alle attività",
        secondaryHref: chiosActivitiesPaths.it,
      },
    },
    orchids: {
      seo: {
        title: "Orchidee di Chios | Voulamandis House",
        description:
          "Scopri le orchidee selvatiche di Chios, i fiori primaverili, i luoghi botanici e le passeggiate nella natura.",
      },
      hero: {
        eyebrow: "Attività a Chios",
        title: "Orchidee di Chios",
        subtitle:
          "Scopri i fiori selvatici, le orchidee rare e la bellezza botanica di Chios.",
      },
      sections: [
        {
          title: "La bellezza delle orchidee di Chios",
          text: [
            "Chios è conosciuta per i suoi fiori selvatici e le sue orchidee. La varietà più impressionante appare dalla fine dell'inverno all'inizio dell'estate.",
            "Ciclamini, crochi, gigli, anemoni, tulipani selvatici, papaveri, iris, salvia e origano colorano e profumano i paesaggi.",
          ],
        },
        {
          title: "Dove scoprire i fiori selvatici",
          text: [
            "Tra i luoghi più belli ci sono Kato Fana, Managros, il monte Pelinaio, la gola di Kampia e le colline intorno a Pyrgi, Olympoi e Mesta.",
            "Le diverse zone fioriscono in momenti diversi della stagione, offrendo paesaggi sempre nuovi.",
          ],
        },
        {
          title: "Una destinazione botanica nell'Egeo",
          text: [
            "Le pratiche agricole tradizionali e poco intensive hanno aiutato a preservare zone di grande interesse botanico.",
            "Chios attira botanici e amanti della natura come uno dei luoghi più ricchi d'Europa per orchidee selvatiche.",
          ],
        },
      ],
      cta: {
        ...baseCta("it"),
        title: "Scopri la natura primaverile di Chios",
        text: "Soggiorna al Voulamandis House ed esplora i fiori selvatici e le orchidee di Chios.",
        secondaryLabel: "Torna alle attività",
        secondaryHref: chiosActivitiesPaths.it,
      },
    },
  },

  es: {
    hub: {
      seo: {
        title: "Actividades en Quíos | Voulamandis House",
        description:
          "Descubre qué hacer en Quíos: cursos de griego, senderismo, baños termales, Festival Mostra, Guerra de cohetes y orquídeas silvestres.",
      },
      hero: {
        eyebrow: "Recomendado por Voulamandis House",
        title: "¿Qué hacer en Quíos?",
        subtitle:
          "Idioma, senderismo, bienestar y patrimonio cultural: Quíos ofrece algo especial para cada viajero.",
      },
      intro: {
        title: "Descubre experiencias auténticas en Quíos",
        text: [
          "Quíos es una isla de cultura, naturaleza y tradiciones vivas. Desde Kampos hasta los pueblos de mastiha, desde las montañas hasta los senderos costeros, cada día puede mostrar una parte diferente de la isla.",
          "Mira las actividades de abajo y elige las que encajan con tus intereses: idioma, naturaleza, costumbres locales, bienestar o eventos estacionales inolvidables.",
        ],
      },
      cards: getHubCards("es"),
      cta: baseCta("es"),
    },
    mostra: {
      seo: {
        title: "Festival Mostra en Quíos | Voulamandis House",
        description:
          "Descubre Mostra, la colorida fiesta de carnaval de Thymiana en Quíos, con música, trajes, baile y tradición local.",
      },
      hero: {
        eyebrow: "Actividades en Quíos",
        title: "Festival Mostra",
        subtitle:
          "Vive la colorida fiesta de carnaval de Thymiana, una de las tradiciones más alegres de Quíos.",
      },
      sections: [
        {
          title: "Una tradición colorida cerca de Kampos",
          text: [
            "Mostra se celebra en el pueblo de Thymiana, cerca de la histórica zona de Kampos. Su nombre evoca la idea de espectáculo, y la celebración lo confirma.",
            "Durante el carnaval, las calles se llenan de música, baile, máscaras, trajes y ambiente festivo.",
          ],
        },
        {
          title: "Una fiesta local con identidad",
          text: [
            "Mostra es más que un desfile. Es una celebración de comunidad, historia e identidad local.",
            "Los visitantes pueden disfrutar de sabores tradicionales, música y la atmósfera acogedora de un pueblo de Quíos.",
          ],
        },
        {
          title: "Alojarse cerca de la fiesta",
          text: [
            "Voulamandis House en Kampos es una base tranquila y cómoda para descubrir Mostra, Thymiana y los alrededores.",
            "Después de la fiesta, puedes volver a la calma de Kampos y disfrutar de un lado más relajado de la isla.",
          ],
        },
      ],
      cta: {
        ...baseCta("es"),
        title: "Descubre Quíos durante el carnaval",
        text: "Alójate en Voulamandis House y vive una de las tradiciones locales más coloridas de la isla.",
        secondaryLabel: "Volver a actividades",
        secondaryHref: chiosActivitiesPaths.es,
      },
    },
    greekCourses: {
      seo: {
        title: "Cursos de griego en Quíos | Alexandria Institute",
        description:
          "Participa en cursos de lengua y cultura griega en Quíos con Alexandria Institute y descubre historia, tradiciones y vida local.",
      },
      hero: {
        eyebrow: "Actividades en Quíos",
        title: "Cursos de griego en Quíos",
        subtitle:
          "Aprende griego mientras vives la cultura, la historia y la vida diaria de Quíos.",
      },
      sections: [
        {
          title: "Aprender griego en una isla especial del Egeo",
          text: [
            "Alexandria Institute organiza cursos de lengua y cultura griega en Quíos para distintos niveles, normalmente en Semana Santa, junio y septiembre.",
            "Los estudiantes pueden elegir programas de una, dos, tres o cuatro semanas.",
          ],
        },
        {
          title: "Idioma, conversación y cultura",
          text: [
            "Los cursos se centran en habilidades prácticas, conversación, comprensión oral y comunicación diaria.",
            "La cultura griega forma parte de la experiencia: costumbres locales, música, literatura, mitología, historia y vida de la isla.",
          ],
        },
        {
          title: "Descubrir Quíos mientras estudias",
          text: [
            "Quíos ofrece un entorno rico para aprender, desde Nea Moni y los pueblos de mastiha hasta Kampos, las costumbres de Pascua y los sabores locales.",
            "Voulamandis House ofrece una base tranquila en Kampos para estudiantes y viajeros.",
          ],
        },
      ],
      cta: {
        title: "Combina tu curso con una estancia en Kampos",
        text: "Alójate en Voulamandis House y disfruta de una base tranquila durante tus cursos de griego en Quíos.",
        primaryLabel: "Ver Alexandria Institute",
        primaryHref: "https://alexandria-institute.com",
        secondaryLabel: "Reservar",
        secondaryHref: bookingLinks.es,
      },
    },
    hiking: {
      seo: {
        title: "Senderismo en Quíos | Voulamandis House",
        description:
          "Explora rutas de senderismo en Quíos por pueblos de mastiha, Kampos, montañas, bosques, costas y pueblos tradicionales.",
      },
      hero: {
        eyebrow: "Actividades en Quíos",
        title: "Senderismo en Quíos",
        subtitle:
          "Explora a pie los paisajes, pueblos, montañas y caminos costeros de Quíos.",
      },
      sections: [
        {
          title: "¿Por qué hacer senderismo en Quíos?",
          text: [
            "El senderismo es una de las mejores formas de descubrir la naturaleza de Quíos. La isla ofrece huertos de cítricos en Kampos, árboles de mastiha, montañas, bosques, barrancos y senderos costeros.",
            "Las rutas por los pueblos de mastiha muestran asentamientos medievales, arquitectura tradicional y la importancia cultural de la mastiha.",
          ],
        },
        {
          title: "Rutas para distintos niveles",
          text: [
            "Quíos ofrece paseos fáciles, rutas de observación de la naturaleza y caminatas de montaña más exigentes.",
            "La zona de Amani, el monte Pelinaio y las rutas costeras ofrecen vistas memorables del Egeo.",
          ],
        },
        {
          title: "Naturaleza, historia y vida local",
          text: [
            "Una experiencia de senderismo en Quíos puede combinar naturaleza, monasterios bizantinos, pueblos medievales, tabernas y flores silvestres de temporada.",
            "Voulamandis House en Kampos es una base cómoda para explorar distintas zonas de la isla.",
          ],
        },
      ],
      cta: {
        ...baseCta("es"),
        title: "Empieza tus rutas desde Voulamandis House",
        text: "Alójate en Kampos y descubre senderos, pueblos y paisajes naturales de Quíos.",
        secondaryLabel: "Volver a actividades",
        secondaryHref: chiosActivitiesPaths.es,
      },
    },
    thermalBaths: {
      seo: {
        title: "Baños termales de Quíos - Agiasmata | Voulamandis House",
        description:
          "Relájate en las fuentes termales naturales de Agiasmata, en el norte de Quíos, un destino tranquilo rodeado de naturaleza.",
      },
      hero: {
        eyebrow: "Actividades en Quíos",
        title: "Baños termales de Quíos",
        subtitle:
          "Relájate en las fuentes termales naturales de Agiasmata, en el norte de Quíos.",
      },
      sections: [
        {
          title: "Un destino tranquilo de bienestar",
          text: [
            "Agiasmata, en el norte de Quíos, es conocido por sus aguas termales naturales y su entorno verde y tranquilo.",
            "Las fuentes se asocian tradicionalmente con la relajación y el bienestar, ofreciendo una pausa tranquila durante la estancia.",
          ],
        },
        {
          title: "Naturaleza, calma y exploración",
          text: [
            "Una visita a Agiasmata puede combinarse con paseos suaves, vistas, comida local y exploración del norte de Quíos.",
            "Es una buena opción para equilibrar playas, visitas y momentos de descanso.",
          ],
        },
        {
          title: "Una excursión desde Kampos",
          text: [
            "Desde Voulamandis House, Agiasmata puede formar parte de una excursión por los pueblos y paisajes del norte de Quíos.",
            "Por la noche, regresas a la tranquila atmósfera de Kampos.",
          ],
        },
      ],
      cta: {
        ...baseCta("es"),
        title: "Añade un día de bienestar a tus vacaciones",
        text: "Alójate en Voulamandis House y descubre las relajantes fuentes de Agiasmata.",
        secondaryLabel: "Volver a actividades",
        secondaryHref: chiosActivitiesPaths.es,
      },
    },
    rocketWar: {
      seo: {
        title: "Guerra de cohetes de Quíos | Voulamandis House",
        description:
          "Vive la famosa Guerra de cohetes de Quíos, la espectacular tradición de Pascua en Vrontados.",
      },
      hero: {
        eyebrow: "Actividades en Quíos",
        title: "Guerra de cohetes de Quíos",
        subtitle:
          "Vive la famosa tradición del Rouketopolemos en Vrontados durante la Pascua ortodoxa griega.",
      },
      sections: [
        {
          title: "La famosa tradición del Rouketopolemos",
          text: [
            "La Guerra de cohetes de Quíos, conocida localmente como Rouketopolemos, es una de las tradiciones de Pascua más famosas de la isla.",
            "Tiene lugar en Vrontados la noche anterior al domingo de Pascua ortodoxa y está relacionada con las parroquias de San Marcos y Panagia Ereithiani.",
          ],
        },
        {
          title: "Una experiencia de Pascua espectacular",
          text: [
            "El evento es conocido mucho más allá de Quíos y atrae a visitantes que quieren ver una costumbre local única, llena de luz, sonido y emoción.",
            "Para la gente de Quíos, sigue siendo un símbolo fuerte de Pascua, fe, identidad y tradición local.",
          ],
        },
        {
          title: "Observar con seguridad y respeto",
          text: [
            "Los visitantes deben seguir siempre las instrucciones locales de seguridad y mirar desde las zonas recomendadas.",
            "Voulamandis House en Kampos ofrece una base tranquila para vivir la Pascua en Quíos.",
          ],
        },
      ],
      cta: {
        ...baseCta("es"),
        title: "Alójate en Voulamandis House durante la Pascua en Quíos",
        text: "Planifica tu estancia de Pascua y vive una de las tradiciones más inolvidables de la isla.",
        primaryLabel: "Reservar para Pascua",
        secondaryLabel: "Volver a actividades",
        secondaryHref: chiosActivitiesPaths.es,
      },
    },
    orchids: {
      seo: {
        title: "Orquídeas de Quíos | Voulamandis House",
        description:
          "Descubre las orquídeas silvestres de Quíos, flores de primavera, lugares botánicos y paseos por la naturaleza.",
      },
      hero: {
        eyebrow: "Actividades en Quíos",
        title: "Orquídeas de Quíos",
        subtitle:
          "Descubre las flores silvestres, las orquídeas raras y la belleza botánica de Quíos.",
      },
      sections: [
        {
          title: "La belleza de las orquídeas de Quíos",
          text: [
            "Quíos es conocida por sus flores silvestres y sus orquídeas. La variedad más impresionante aparece desde finales del invierno hasta principios del verano.",
            "Ciclamen, crocos, lirios, anémonas, tulipanes silvestres, amapolas, iris, salvia y orégano dan color y aroma a los paisajes.",
          ],
        },
        {
          title: "Dónde descubrir flores silvestres",
          text: [
            "Entre los lugares más bonitos están Kato Fana, Managros, el monte Pelinaio, el barranco de Kampia y las colinas alrededor de Pyrgi, Olympoi y Mesta.",
            "Las distintas zonas florecen en momentos diferentes de la temporada, ofreciendo paisajes siempre nuevos.",
          ],
        },
        {
          title: "Un destino botánico en el Egeo",
          text: [
            "Las prácticas agrícolas tradicionales y poco intensivas han ayudado a conservar zonas de gran interés botánico.",
            "Quíos atrae a botánicos y amantes de la naturaleza como uno de los lugares más ricos de Europa en orquídeas silvestres.",
          ],
        },
      ],
      cta: {
        ...baseCta("es"),
        title: "Descubre la naturaleza primaveral de Quíos",
        text: "Alójate en Voulamandis House y explora las flores silvestres y orquídeas de Quíos.",
        secondaryLabel: "Volver a actividades",
        secondaryHref: chiosActivitiesPaths.es,
      },
    },
  },

  tr: {
    hub: {
      seo: {
        title: "Sakız Adası Aktiviteleri | Voulamandis House",
        description:
          "Sakız Adası'nda yapılacakları keşfedin: Yunanca kursları, yürüyüş, termal kaplıcalar, Mostra Festivali, Roket Savaşı ve yabani orkideler.",
      },
      hero: {
        eyebrow: "Voulamandis House öneriyor",
        title: "Sakız Adası'nda ne yapılır?",
        subtitle:
          "Dil, yürüyüş, dinlenme ve zengin kültürel miras: Sakız Adası her gezgin için özel bir deneyim sunar.",
      },
      intro: {
        title: "Sakız Adası'nda otantik deneyimler",
        text: [
          "Sakız Adası kültür, doğa ve yaşayan geleneklerle dolu bir adadır. Kampos'tan mastik köylerine, dağlardan kıyı yollarına kadar her gün adanın farklı bir yönünü gösterebilir.",
          "Aşağıdaki aktiviteleri inceleyin ve ilgi alanlarınıza uygun deneyimleri seçin: dil, doğa, yerel gelenekler, dinlenme veya unutulmaz mevsimsel etkinlikler.",
        ],
      },
      cards: getHubCards("tr"),
      cta: baseCta("tr"),
    },
    mostra: {
      seo: {
        title: "Sakız Adası Mostra Festivali | Voulamandis House",
        description:
          "Thymiana'daki renkli Mostra karnavalını müzik, kostümler, dans ve yerel geleneklerle keşfedin.",
      },
      hero: {
        eyebrow: "Sakız Adası aktiviteleri",
        title: "Mostra Festivali",
        subtitle:
          "Thymiana'nın renkli karnavalını, Sakız Adası'nın en neşeli geleneklerinden birini yaşayın.",
      },
      sections: [
        {
          title: "Kampos yakınında renkli bir gelenek",
          text: [
            "Mostra, tarihi Kampos bölgesine yakın Thymiana köyünde düzenlenir. Adı bir gösteri fikrini çağrıştırır ve festival bunu tam anlamıyla yaşatır.",
            "Karnaval döneminde sokaklar müzik, dans, maskeler, kostümler ve bayram havasıyla dolar.",
          ],
        },
        {
          title: "Kimlik taşıyan yerel bir kutlama",
          text: [
            "Mostra yalnızca bir geçit töreni değildir. Topluluk, tarih ve yerel kimliğin kutlanmasıdır.",
            "Ziyaretçiler geleneksel tatları, müziği ve Sakız köylerinin sıcak atmosferini yaşayabilir.",
          ],
        },
        {
          title: "Kutlamaya yakın konaklama",
          text: [
            "Kampos'taki Voulamandis House, Mostra'yı, Thymiana'yı ve çevreyi keşfetmek için sakin ve pratik bir konaklama noktasıdır.",
            "Kutlamadan sonra Kampos'un huzurlu atmosferine dönebilirsiniz.",
          ],
        },
      ],
      cta: {
        ...baseCta("tr"),
        title: "Karnaval döneminde Sakız Adası'nı keşfedin",
        text: "Voulamandis House'ta konaklayın ve adanın en renkli yerel geleneklerinden birini yaşayın.",
        secondaryLabel: "Aktivitelere dön",
        secondaryHref: chiosActivitiesPaths.tr,
      },
    },
    greekCourses: {
      seo: {
        title: "Sakız Adası'nda Yunanca Kursları | Alexandria Institute",
        description:
          "Alexandria Institute ile Sakız Adası'nda Yunanca ve kültür kurslarına katılın; tarih, gelenekler ve ada yaşamını keşfedin.",
      },
      hero: {
        eyebrow: "Sakız Adası aktiviteleri",
        title: "Sakız Adası'nda Yunanca Kursları",
        subtitle:
          "Yunanca öğrenirken Sakız Adası'nın kültürünü, tarihini ve günlük yaşamını deneyimleyin.",
      },
      sections: [
        {
          title: "Ege'nin özel bir adasında Yunanca öğrenin",
          text: [
            "Alexandria Institute, Sakız Adası'nda farklı seviyeler için Yunanca dil ve kültür kursları düzenler. Kurslar genellikle Paskalya döneminde, haziranda ve eylülde yapılır.",
            "Öğrenciler zamanlarına göre bir, iki, üç veya dört haftalık programlar seçebilir.",
          ],
        },
        {
          title: "Dil, konuşma ve kültür",
          text: [
            "Kurslar pratik dil becerilerine, konuşmaya, dinleme-anlamaya ve günlük iletişime odaklanır.",
            "Yunan kültürü deneyimin bir parçasıdır: yerel gelenekler, müzik, edebiyat, mitoloji, tarih ve ada yaşamı.",
          ],
        },
        {
          title: "Öğrenirken Sakız Adası'nı keşfedin",
          text: [
            "Sakız Adası, Nea Moni'den mastik köylerine, Kampos'tan Paskalya geleneklerine ve yerel tatlara kadar zengin bir öğrenme ortamı sunar.",
            "Voulamandis House, öğrenciler ve gezginler için Kampos'ta sakin bir konaklama noktasıdır.",
          ],
        },
      ],
      cta: {
        title: "Kursunuzu Kampos'ta konaklama ile birleştirin",
        text: "Voulamandis House'ta konaklayın ve Sakız Adası'ndaki Yunanca kurslarınız sırasında sakin bir ortamın tadını çıkarın.",
        primaryLabel: "Alexandria Institute'u ziyaret edin",
        primaryHref: "https://alexandria-institute.com",
        secondaryLabel: "Rezervasyon",
        secondaryHref: bookingLinks.tr,
      },
    },
    hiking: {
      seo: {
        title: "Sakız Adası Yürüyüş Rotaları | Voulamandis House",
        description:
          "Sakız Adası'nda mastik köyleri, Kampos, dağlar, ormanlar, kıyılar ve geleneksel köyler arasında yürüyüş rotalarını keşfedin.",
      },
      hero: {
        eyebrow: "Sakız Adası aktiviteleri",
        title: "Sakız Adası'nda yürüyüş",
        subtitle:
          "Sakız Adası'nın manzaralarını, köylerini, dağlarını ve kıyı yollarını yürüyerek keşfedin.",
      },
      sections: [
        {
          title: "Neden Sakız Adası'nda yürüyüş?",
          text: [
            "Yürüyüş, Sakız Adası'nın doğasını tanımanın en iyi yollarından biridir. Ada Kampos'taki narenciye bahçeleri, güneydeki mastik ağaçları, dağlar, ormanlar, vadiler ve kıyı yolları sunar.",
            "Mastik köylerindeki rotalar, Orta Çağ yerleşimlerini, geleneksel mimariyi ve mastiha kültürünün önemini gösterir.",
          ],
        },
        {
          title: "Farklı seviyeler için rotalar",
          text: [
            "Sakız Adası kolay yürüyüşler, doğa gözlem rotaları ve daha zorlu dağ yürüyüşleri sunar.",
            "Amani bölgesi, Pelinaio Dağı ve kıyı rotaları Ege manzaralarıyla ödüllendirir.",
          ],
        },
        {
          title: "Doğa, tarih ve yerel yaşam",
          text: [
            "Sakız Adası'nda yürüyüş, doğayı Bizans manastırları, Orta Çağ köyleri, tavernalar ve mevsimlik yabani çiçeklerle birleştirebilir.",
            "Kampos'taki Voulamandis House, adanın farklı bölgelerini keşfetmek için rahat bir başlangıç noktasıdır.",
          ],
        },
      ],
      cta: {
        ...baseCta("tr"),
        title: "Yürüyüş tatilinize Voulamandis House'tan başlayın",
        text: "Kampos'ta konaklayın ve Sakız Adası'nın yürüyüş rotalarını, köylerini ve doğal manzaralarını keşfedin.",
        secondaryLabel: "Aktivitelere dön",
        secondaryHref: chiosActivitiesPaths.tr,
      },
    },
    thermalBaths: {
      seo: {
        title: "Sakız Adası Termal Kaplıcaları | Voulamandis House",
        description:
          "Kuzey Sakız'daki Agiasmata doğal termal sularında, doğayla çevrili sakin bir dinlenme noktasında rahatlayın.",
      },
      hero: {
        eyebrow: "Sakız Adası aktiviteleri",
        title: "Sakız Adası Termal Kaplıcaları",
        subtitle:
          "Kuzey Sakız'daki Agiasmata doğal termal sularında rahatlayın.",
      },
      sections: [
        {
          title: "Sakin bir dinlenme noktası",
          text: [
            "Kuzey Sakız'daki Agiasmata, doğal termal suları ve huzurlu yeşil çevresiyle bilinir.",
            "Kaynaklar geleneksel olarak rahatlama ve iyi hissetme ile ilişkilendirilir ve tatil sırasında daha yavaş bir gün sunar.",
          ],
        },
        {
          title: "Doğa, huzur ve keşif",
          text: [
            "Agiasmata ziyareti hafif yürüyüşler, güzel manzaralar, yerel yemekler ve kuzey Sakız'ın keşfiyle birleştirilebilir.",
            "Plaj günleri ve gezileri dinlenme ile dengelemek isteyenler için iyi bir seçimdir.",
          ],
        },
        {
          title: "Kampos'tan günübirlik gezi",
          text: [
            "Voulamandis House'tan Agiasmata, kuzey Sakız'ın köyleri ve manzaraları arasında bir günlük geziye dahil edilebilir.",
            "Akşam Kampos'un huzurlu atmosferine dönebilirsiniz.",
          ],
        },
      ],
      cta: {
        ...baseCta("tr"),
        title: "Tatilinize bir dinlenme günü ekleyin",
        text: "Voulamandis House'ta konaklayın ve Agiasmata'nın rahatlatıcı termal sularını keşfedin.",
        secondaryLabel: "Aktivitelere dön",
        secondaryHref: chiosActivitiesPaths.tr,
      },
    },
    rocketWar: {
      seo: {
        title: "Sakız Adası Roket Savaşı | Voulamandis House",
        description:
          "Sakız Adası'nın ünlü Roket Savaşı'nı, Vrontados'taki etkileyici Paskalya geleneğini deneyimleyin.",
      },
      hero: {
        eyebrow: "Sakız Adası aktiviteleri",
        title: "Sakız Adası Roket Savaşı",
        subtitle:
          "Yunan Ortodoks Paskalyası sırasında Vrontados'taki ünlü Rouketopolemos geleneğini yaşayın.",
      },
      sections: [
        {
          title: "Ünlü Rouketopolemos geleneği",
          text: [
            "Sakız Adası Roket Savaşı, yerel adıyla Rouketopolemos, adanın en ünlü Paskalya geleneklerinden biridir.",
            "Vrontados'ta Ortodoks Paskalya Pazarından önceki gece gerçekleşir ve Aziz Markos ile Panagia Ereithiani kiliseleriyle bağlantılıdır.",
          ],
        },
        {
          title: "Etkileyici bir Paskalya deneyimi",
          text: [
            "Etkinlik Sakız Adası'nın çok ötesinde tanınır ve ışık, ses ve duygu dolu benzersiz bir yerel geleneği görmek isteyen ziyaretçileri çeker.",
            "Sakız halkı için Paskalya, inanç, kimlik ve yerel geleneğin güçlü bir sembolü olarak kalır.",
          ],
        },
        {
          title: "Güvenli ve saygılı izleme",
          text: [
            "Ziyaretçiler her zaman yerel güvenlik talimatlarına uymalı ve önerilen izleme alanlarından takip etmelidir.",
            "Kampos'taki Voulamandis House, Sakız Adası'nda Paskalya'yı yaşamak için huzurlu bir konaklama noktası sunar.",
          ],
        },
      ],
      cta: {
        ...baseCta("tr"),
        title: "Paskalya döneminde Voulamandis House'ta konaklayın",
        text: "Sakız Adası'nda Paskalya konaklamanızı planlayın ve adanın en unutulmaz geleneklerinden birini yaşayın.",
        primaryLabel: "Paskalya konaklaması ayırtın",
        secondaryLabel: "Aktivitelere dön",
        secondaryHref: chiosActivitiesPaths.tr,
      },
    },
    orchids: {
      seo: {
        title: "Sakız Adası Orkideleri | Voulamandis House",
        description:
          "Sakız Adası'nın yabani orkidelerini, bahar çiçeklerini, botanik alanlarını ve doğa yürüyüşlerini keşfedin.",
      },
      hero: {
        eyebrow: "Sakız Adası aktiviteleri",
        title: "Sakız Adası Orkideleri",
        subtitle:
          "Sakız Adası'nın yabani çiçeklerini, nadir orkidelerini ve botanik güzelliğini keşfedin.",
      },
      sections: [
        {
          title: "Sakız orkidelerinin güzelliği",
          text: [
            "Sakız Adası yabani çiçekleri ve orkideleriyle bilinir. En etkileyici çeşitlilik kış sonundan yaz başına kadar görülür.",
            "Siklamenler, çiğdemler, zambaklar, anemonlar, yabani laleler, gelincikler, süsenler, adaçayı ve kekik adanın manzaralarına renk ve koku katar.",
          ],
        },
        {
          title: "Yabani çiçekler nerede görülür?",
          text: [
            "Kato Fana, Managros, Pelinaio Dağı, Kampia vadisi ve Pyrgi, Olympoi ile Mesta çevresindeki tepeler güzel çiçek ve orkide alanlarıdır.",
            "Farklı bölgeler mevsimin farklı zamanlarında çiçeklenir ve sürekli değişen manzaralar sunar.",
          ],
        },
        {
          title: "Ege'de botanik bir destinasyon",
          text: [
            "Geleneksel ve düşük yoğunluklu tarım uygulamaları, Sakız Adası'nda botanik açıdan ilginç alanların korunmasına yardımcı olmuştur.",
            "Ada, yabani orkideler açısından Avrupa'nın en zengin yerlerinden biri olarak botanikçilerin ve doğa severlerin ilgisini çeker.",
          ],
        },
      ],
      cta: {
        ...baseCta("tr"),
        title: "Sakız Adası'nın bahar doğasını keşfedin",
        text: "Voulamandis House'ta konaklayın ve Sakız Adası'nın yabani çiçeklerini ve orkidelerini keşfedin.",
        secondaryLabel: "Aktivitelere dön",
        secondaryHref: chiosActivitiesPaths.tr,
      },
    },
  },
};

function mergeLocalizedPage(
  page: ChiosActivitiesPageData,
  locale: LanguageCode,
): ChiosActivitiesPageData {
  if (locale === "en") return page;

  const overrides = localizedActivityCopy[locale]?.[page.key];

  if (page.key === "hub") {
    return {
      ...page,
      ...overrides,
      locale,
      path: chiosActivitiesPaths[locale],
      seo: {
        ...page.seo,
        ...overrides?.seo,
      },
      hero: {
        ...page.hero,
        ...overrides?.hero,
      },
      intro: overrides?.intro ?? page.intro,
      cards: overrides?.cards ?? getHubCards(locale),
      cta: {
        ...baseCta(locale),
        ...overrides?.cta,
        primaryHref: bookingLinks[locale],
      },
    };
  }

  return {
    ...page,
    ...overrides,
    locale,
    path: chiosActivityDetailPaths[page.key][locale],
    seo: {
      ...page.seo,
      ...overrides?.seo,
    },
    hero: {
      ...page.hero,
      ...overrides?.hero,
    },
    sections: overrides?.sections ?? page.sections,
    gallery: page.gallery,
    cta: {
      ...page.cta,
      ...overrides?.cta,
      primaryHref:
        page.key === "greekCourses" ? page.cta.primaryHref : bookingLinks[locale],
      secondaryHref: chiosActivitiesPaths[locale],
    },
  };
}

function localizePage(
  page: ChiosActivitiesPageData,
  locale: LanguageCode,
): ChiosActivitiesPageData {
  return mergeLocalizedPage(page, locale);
}

export function getChiosActivitiesPageByLocale(
  locale: LanguageCode = "en",
): ChiosActivitiesPageData {
  return localizePage(englishPages.hub, locale);
}

export function getChiosActivityPageByKey(
  key: Exclude<ChiosActivityKey, "hub">,
  locale: LanguageCode = "en",
): ChiosActivitiesPageData {
  return localizePage(englishPages[key], locale);
}

export function getChiosActivitiesPageByPath(
  path: string,
): ChiosActivitiesPageData | undefined {
  const normalizedPath = path.endsWith("/") ? path : `${path}/`;

  for (const locale of Object.keys(chiosActivitiesPaths) as LanguageCode[]) {
    if (chiosActivitiesPaths[locale] === normalizedPath) {
      return getChiosActivitiesPageByLocale(locale);
    }
  }

  for (const key of Object.keys(chiosActivityDetailPaths) as Exclude<
    ChiosActivityKey,
    "hub"
  >[]) {
    for (const locale of Object.keys(chiosActivityDetailPaths[key]) as LanguageCode[]) {
      if (chiosActivityDetailPaths[key][locale] === normalizedPath) {
        return getChiosActivityPageByKey(key, locale);
      }
    }
  }

  return undefined;
}

export const allChiosActivitiesPages: ChiosActivitiesPageData[] = [
  getChiosActivitiesPageByLocale("en"),
  getChiosActivityPageByKey("mostra", "en"),
  getChiosActivityPageByKey("greekCourses", "en"),
  getChiosActivityPageByKey("hiking", "en"),
  getChiosActivityPageByKey("thermalBaths", "en"),
  getChiosActivityPageByKey("rocketWar", "en"),
  getChiosActivityPageByKey("orchids", "en"),
];
