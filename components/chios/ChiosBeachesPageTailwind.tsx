import type { ChiosBeachesPageData } from "@/content/chios-beaches";

type ChiosBeachesPageProps = {
  data: ChiosBeachesPageData;
};

const beachesPageUiCopy = {
  en: {
    beachesKicker: "Top Chios beaches",
    beachesTitle: "A visual guide to the island’s coast",
    beachesText:
      "From volcanic black pebbles to golden sand and hidden emerald coves, these are the Chios beaches worth planning your days around.",
    exploreBeach: "Explore beach →",
  },
  el: {
    beachesKicker: "Κορυφαίες παραλίες της Χίου",
    beachesTitle: "Οπτικός οδηγός στις ακτές του νησιού",
    beachesText:
      "Από ηφαιστειακά μαύρα βότσαλα μέχρι χρυσαφένια άμμο και κρυφούς σμαραγδένιους όρμους, αυτές είναι οι παραλίες της Χίου που αξίζει να βάλετε στο πρόγραμμά σας.",
    exploreBeach: "Δείτε την παραλία →",
  },
  fr: {
    beachesKicker: "Plus belles plages de Chios",
    beachesTitle: "Un guide visuel du littoral de l’île",
    beachesText:
      "Des galets noirs volcaniques au sable doré et aux criques émeraude cachées, voici les plages de Chios autour desquelles organiser vos journées.",
    exploreBeach: "Explorer la plage →",
  },
  de: {
    beachesKicker: "Top-Strände auf Chios",
    beachesTitle: "Ein visueller Guide zur Küste der Insel",
    beachesText:
      "Von vulkanischen schwarzen Kieseln bis zu goldenem Sand und versteckten smaragdgrünen Buchten: Diese Strände auf Chios lohnen sich für Ihre Tagesplanung.",
    exploreBeach: "Strand ansehen →",
  },
  it: {
    beachesKicker: "Le migliori spiagge di Chios",
    beachesTitle: "Una guida visiva alla costa dell’isola",
    beachesText:
      "Dai ciottoli neri vulcanici alla sabbia dorata e alle calette color smeraldo nascoste, queste sono le spiagge di Chios da inserire nel vostro itinerario.",
    exploreBeach: "Esplora la spiaggia →",
  },
  es: {
    beachesKicker: "Mejores playas de Chios",
    beachesTitle: "Una guía visual de la costa de la isla",
    beachesText:
      "Desde guijarros negros volcánicos hasta arena dorada y calas escondidas de color esmeralda, estas son las playas de Chios que merece la pena planificar.",
    exploreBeach: "Explorar playa →",
  },
  tr: {
    beachesKicker: "Sakız Adası’nın öne çıkan plajları",
    beachesTitle: "Adanın kıyıları için görsel bir rehber",
    beachesText:
      "Volkanik siyah çakıllardan altın kumlara ve gizli zümrüt koylara kadar, günlerinizi planlamaya değer Sakız Adası plajları burada.",
    exploreBeach: "Plajı keşfet →",
  },
} as const;

type BeachesPageUiLanguage = keyof typeof beachesPageUiCopy;

type BeachGuideCategory = {
  id: string;
  emoji: string;
  title: string;
  text: string;
  beaches: string[];
};

type BeachGuideCopy = {
  badgeLabel: string;
  allBeachesLabel: string;
  kicker: string;
  title: string;
  text: string;
  categories: BeachGuideCategory[];
};

const beachGuideCopy: Record<BeachesPageUiLanguage, BeachGuideCopy> = {
  en: {
    badgeLabel: "Beach categories",
    allBeachesLabel: "All beaches",
    kicker: "Choose by need",
    title: "Find the right Chios beach faster",
    text:
      "Use these local categories to choose a beach by the kind of day you want: organized, family-friendly, sheltered, sandy, quiet or close to Voulamandis House.",
    categories: [
      {
        id: "organized-beaches",
        emoji: "⛱",
        title: "Organized beaches",
        text: "Good choices when you want easier access, beach service, cafés, taverns or a more practical beach day.",
        beaches: ["Karfas", "Agia Fotia", "Komi", "Emporios", "Lefkathia", "Lithi"],
      },
      {
        id: "family-beaches",
        emoji: "👨‍👩‍👧",
        title: "Beaches for families",
        text: "Better options for children and families, with easier swimming conditions or a more convenient day by the sea.",
        beaches: ["Komi", "Karfas", "Lithi", "Agia Dynami"],
      },
      {
        id: "sheltered-beaches",
        emoji: "🌊",
        title: "Sheltered beaches",
        text: "Local picks that are often useful to consider when the wind makes beach planning more difficult.",
        beaches: ["Salagona", "Agia Dynami", "Vroulidia", "Kato Fana", "Elinta"],
      },
      {
        id: "sandy-beaches",
        emoji: "🏜",
        title: "Sandy beaches",
        text: "Beaches with sand or easier sea entry for visitors who prefer a softer, simpler swimming experience.",
        beaches: ["Lithi", "Karfas", "Komi"],
      },
      {
        id: "quiet-beaches",
        emoji: "🏝",
        title: "Quiet beaches",
        text: "Good choices for a calmer, more authentic beach day away from the busiest parts of the island.",
        beaches: ["Elinta", "Vroulidia", "Nagos"],
      },
      {
        id: "nearby-beaches",
        emoji: "📍",
        title: "Nearby beaches from Voulamandis House",
        text: "Practical beaches to consider when staying in Kambos and looking for an easier drive from Voulamandis House.",
        beaches: ["Karfas", "Glari Beach", "Agia Fotia", "Daskalopetra"],
      },
    ],
  },
  el: {
    badgeLabel: "Κατηγορίες παραλιών",
    allBeachesLabel: "Όλες οι παραλίες",
    kicker: "Διαλέξτε ανάλογα με τη μέρα",
    title: "Βρείτε πιο γρήγορα την κατάλληλη παραλία στη Χίο",
    text:
      "Χρησιμοποιήστε αυτές τις τοπικές κατηγορίες για να επιλέξετε παραλία ανάλογα με τη μέρα που θέλετε: οργανωμένη, οικογενειακή, απάνεμη, αμμώδης, ήσυχη ή κοντινή από το Voulamandis House.",
    categories: [
      {
        id: "organized-beaches",
        emoji: "⛱",
        title: "Οργανωμένες παραλίες",
        text: "Καλές επιλογές όταν θέλετε πιο εύκολη πρόσβαση, beach service, καφέ, ταβέρνα ή γενικά μια πιο πρακτική μέρα στη θάλασσα.",
        beaches: ["Καρφάς", "Αγία Φωτιά", "Κώμη", "Εμπορειός", "Λευκάθια", "Λιθί"],
      },
      {
        id: "family-beaches",
        emoji: "👨‍👩‍👧",
        title: "Παραλίες για παιδιά",
        text: "Πιο βολικές επιλογές για οικογένειες, με ευκολότερες συνθήκες για μπάνιο ή πιο άνετη οργάνωση της ημέρας.",
        beaches: ["Κώμη", "Καρφάς", "Λιθί", "Αγία Δύναμη"],
      },
      {
        id: "sheltered-beaches",
        emoji: "🌊",
        title: "Απάνεμες παραλίες",
        text: "Τοπικές επιλογές που αξίζει να έχετε στο μυαλό σας όταν ο αέρας δυσκολεύει τον προγραμματισμό για μπάνιο.",
        beaches: ["Σαλάγωνα", "Αγία Δύναμη", "Βρουλίδια", "Κάτω Φανά", "Ελίντα"],
      },
      {
        id: "sandy-beaches",
        emoji: "🏜",
        title: "Παραλίες με άμμο",
        text: "Παραλίες με άμμο ή πιο εύκολη είσοδο στη θάλασσα για όσους προτιμούν πιο απλή και άνετη εμπειρία μπάνιου.",
        beaches: ["Λιθί", "Καρφάς", "Κώμη"],
      },
      {
        id: "quiet-beaches",
        emoji: "🏝",
        title: "Ήσυχες παραλίες",
        text: "Καλές επιλογές για πιο ήρεμη και αυθεντική μέρα στη θάλασσα, μακριά από τα πιο πολυσύχναστα σημεία.",
        beaches: ["Ελίντα", "Βρουλίδια", "Ναγός"],
      },
      {
        id: "nearby-beaches",
        emoji: "📍",
        title: "Κοντινές παραλίες από το Voulamandis House",
        text: "Πρακτικές επιλογές για επισκέπτες που μένουν στον Κάμπο και θέλουν πιο εύκολη διαδρομή με αυτοκίνητο.",
        beaches: ["Καρφάς", "Παραλία των Γλάρων", "Αγία Φωτιά", "Δασκαλόπετρα"],
      },
    ],
  },
  fr: {
    badgeLabel: "Catégories de plages",
    allBeachesLabel: "Toutes les plages",
    kicker: "Choisir selon la journée",
    title: "Trouvez plus vite la plage de Chios adaptée",
    text:
      "Utilisez ces catégories locales pour choisir une plage selon votre journée : organisée, familiale, abritée, sableuse, calme ou proche de Voulamandis House.",
    categories: [
      {
        id: "organized-beaches",
        emoji: "⛱",
        title: "Plages organisées",
        text: "De bons choix si vous souhaitez un accès plus facile, des services de plage, cafés, tavernes ou une journée plus pratique.",
        beaches: ["Karfas", "Agia Fotia", "Komi", "Emporios", "Lefkathia", "Lithi"],
      },
      {
        id: "family-beaches",
        emoji: "👨‍👩‍👧",
        title: "Plages pour les enfants",
        text: "Des options plus pratiques pour les familles, avec des conditions de baignade plus faciles ou une journée plus confortable.",
        beaches: ["Komi", "Karfas", "Lithi", "Agia Dynami"],
      },
      {
        id: "sheltered-beaches",
        emoji: "🌊",
        title: "Plages abritées",
        text: "Des suggestions locales à considérer lorsque le vent complique le choix de la plage.",
        beaches: ["Salagona", "Agia Dynami", "Vroulidia", "Kato Fana", "Elinta"],
      },
      {
        id: "sandy-beaches",
        emoji: "🏜",
        title: "Plages de sable",
        text: "Des plages avec sable ou entrée plus facile dans l’eau pour une baignade simple et confortable.",
        beaches: ["Lithi", "Karfas", "Komi"],
      },
      {
        id: "quiet-beaches",
        emoji: "🏝",
        title: "Plages calmes",
        text: "De bons choix pour une journée plus paisible et authentique, loin des endroits les plus fréquentés.",
        beaches: ["Elinta", "Vroulidia", "Nagos"],
      },
      {
        id: "nearby-beaches",
        emoji: "📍",
        title: "Plages proches de Voulamandis House",
        text: "Des plages pratiques si vous séjournez à Kambos et souhaitez un trajet plus simple en voiture.",
        beaches: ["Karfas", "Plage de Glari", "Agia Fotia", "Daskalopetra"],
      },
    ],
  },
  de: {
    badgeLabel: "Strandkategorien",
    allBeachesLabel: "Alle Strände",
    kicker: "Nach Tagesplan wählen",
    title: "Finden Sie schneller den passenden Strand auf Chios",
    text:
      "Nutzen Sie diese lokalen Kategorien, um den Strand passend zu Ihrem Tag zu wählen: organisiert, familienfreundlich, geschützt, sandig, ruhig oder nahe bei Voulamandis House.",
    categories: [
      {
        id: "organized-beaches",
        emoji: "⛱",
        title: "Organisierte Strände",
        text: "Gute Optionen, wenn Sie einfachen Zugang, Strandservice, Cafés, Tavernen oder einen praktischen Strandtag möchten.",
        beaches: ["Karfas", "Agia Fotia", "Komi", "Emporios", "Lefkathia", "Lithi"],
      },
      {
        id: "family-beaches",
        emoji: "👨‍👩‍👧",
        title: "Strände für Kinder",
        text: "Praktischere Optionen für Familien, mit einfacheren Badebedingungen oder einem bequemeren Tag am Meer.",
        beaches: ["Komi", "Karfas", "Lithi", "Agia Dynami"],
      },
      {
        id: "sheltered-beaches",
        emoji: "🌊",
        title: "Geschützte Strände",
        text: "Lokale Empfehlungen, die bei Wind oft hilfreich für die Strandplanung sind.",
        beaches: ["Salagona", "Agia Dynami", "Vroulidia", "Kato Fana", "Elinta"],
      },
      {
        id: "sandy-beaches",
        emoji: "🏜",
        title: "Sandstrände",
        text: "Strände mit Sand oder einfacherem Einstieg ins Meer für ein unkompliziertes Badeerlebnis.",
        beaches: ["Lithi", "Karfas", "Komi"],
      },
      {
        id: "quiet-beaches",
        emoji: "🏝",
        title: "Ruhige Strände",
        text: "Gute Optionen für einen ruhigeren, authentischeren Strandtag abseits der meistbesuchten Orte.",
        beaches: ["Elinta", "Vroulidia", "Nagos"],
      },
      {
        id: "nearby-beaches",
        emoji: "📍",
        title: "Strände nahe Voulamandis House",
        text: "Praktische Strände für Gäste in Kambos, die eine leichtere Fahrt mit dem Auto wünschen.",
        beaches: ["Karfas", "Glari Beach", "Agia Fotia", "Daskalopetra"],
      },
    ],
  },
  it: {
    badgeLabel: "Categorie di spiagge",
    allBeachesLabel: "Tutte le spiagge",
    kicker: "Scegliere in base alla giornata",
    title: "Trovate più velocemente la spiaggia giusta a Chios",
    text:
      "Usate queste categorie locali per scegliere la spiaggia in base al tipo di giornata: attrezzata, per famiglie, riparata, sabbiosa, tranquilla o vicina a Voulamandis House.",
    categories: [
      {
        id: "organized-beaches",
        emoji: "⛱",
        title: "Spiagge attrezzate",
        text: "Buone opzioni quando desiderate accesso facile, servizi in spiaggia, caffè, taverne o una giornata più pratica.",
        beaches: ["Karfas", "Agia Fotia", "Komi", "Emporios", "Lefkathia", "Lithi"],
      },
      {
        id: "family-beaches",
        emoji: "👨‍👩‍👧",
        title: "Spiagge per bambini",
        text: "Scelte più comode per famiglie, con condizioni di balneazione più semplici o una giornata al mare più agevole.",
        beaches: ["Komi", "Karfas", "Lithi", "Agia Dynami"],
      },
      {
        id: "sheltered-beaches",
        emoji: "🌊",
        title: "Spiagge riparate",
        text: "Suggerimenti locali utili da considerare quando il vento rende più difficile la scelta della spiaggia.",
        beaches: ["Salagona", "Agia Dynami", "Vroulidia", "Kato Fana", "Elinta"],
      },
      {
        id: "sandy-beaches",
        emoji: "🏜",
        title: "Spiagge di sabbia",
        text: "Spiagge con sabbia o ingresso in mare più facile per un bagno più semplice e confortevole.",
        beaches: ["Lithi", "Karfas", "Komi"],
      },
      {
        id: "quiet-beaches",
        emoji: "🏝",
        title: "Spiagge tranquille",
        text: "Buone scelte per una giornata più calma e autentica, lontano dai punti più affollati.",
        beaches: ["Elinta", "Vroulidia", "Nagos"],
      },
      {
        id: "nearby-beaches",
        emoji: "📍",
        title: "Spiagge vicine a Voulamandis House",
        text: "Opzioni pratiche per chi soggiorna a Kambos e cerca un tragitto più semplice in auto.",
        beaches: ["Karfas", "Spiaggia di Glari", "Agia Fotia", "Daskalopetra"],
      },
    ],
  },
  es: {
    badgeLabel: "Categorías de playas",
    allBeachesLabel: "Todas las playas",
    kicker: "Elegir según el día",
    title: "Encuentra más rápido la playa adecuada en Quíos",
    text:
      "Usa estas categorías locales para elegir playa según el tipo de día: organizada, familiar, resguardada, de arena, tranquila o cercana a Voulamandis House.",
    categories: [
      {
        id: "organized-beaches",
        emoji: "⛱",
        title: "Playas organizadas",
        text: "Buenas opciones si buscas acceso fácil, servicios de playa, cafés, tabernas o un día de playa más práctico.",
        beaches: ["Karfas", "Agia Fotia", "Komi", "Emporios", "Lefkathia", "Lithi"],
      },
      {
        id: "family-beaches",
        emoji: "👨‍👩‍👧",
        title: "Playas para niños",
        text: "Opciones más cómodas para familias, con condiciones de baño más sencillas o un día más práctico junto al mar.",
        beaches: ["Komi", "Karfas", "Lithi", "Agia Dynami"],
      },
      {
        id: "sheltered-beaches",
        emoji: "🌊",
        title: "Playas resguardadas",
        text: "Sugerencias locales útiles cuando el viento complica la elección de playa.",
        beaches: ["Salagona", "Agia Dynami", "Vroulidia", "Kato Fana", "Elinta"],
      },
      {
        id: "sandy-beaches",
        emoji: "🏜",
        title: "Playas de arena",
        text: "Playas con arena o entrada más fácil al mar para una experiencia de baño más cómoda.",
        beaches: ["Lithi", "Karfas", "Komi"],
      },
      {
        id: "quiet-beaches",
        emoji: "🏝",
        title: "Playas tranquilas",
        text: "Buenas opciones para un día de playa más calmado y auténtico, lejos de las zonas más concurridas.",
        beaches: ["Elinta", "Vroulidia", "Nagos"],
      },
      {
        id: "nearby-beaches",
        emoji: "📍",
        title: "Playas cerca de Voulamandis House",
        text: "Playas prácticas para huéspedes alojados en Kambos que buscan un trayecto más sencillo en coche.",
        beaches: ["Karfas", "Playa de Glari", "Agia Fotia", "Daskalopetra"],
      },
    ],
  },
  tr: {
    badgeLabel: "Plaj kategorileri",
    allBeachesLabel: "Tüm plajlar",
    kicker: "Güne göre seçin",
    title: "Sakız Adası’nda doğru plajı daha hızlı bulun",
    text:
      "Bu yerel kategorilerle gününüze uygun plajı seçin: düzenli, aile dostu, korunaklı, kumlu, sakin veya Voulamandis House’a yakın.",
    categories: [
      {
        id: "organized-beaches",
        emoji: "⛱",
        title: "Düzenli plajlar",
        text: "Kolay erişim, plaj hizmeti, kafe, taverna veya daha pratik bir deniz günü isteyenler için iyi seçenekler.",
        beaches: ["Karfas", "Agia Fotia", "Komi", "Emporios", "Lefkathia", "Lithi"],
      },
      {
        id: "family-beaches",
        emoji: "👨‍👩‍👧",
        title: "Çocuklar için plajlar",
        text: "Aileler için daha rahat seçenekler; denize giriş veya günü planlamak genellikle daha kolaydır.",
        beaches: ["Komi", "Karfas", "Lithi", "Agia Dynami"],
      },
      {
        id: "sheltered-beaches",
        emoji: "🌊",
        title: "Korunaklı plajlar",
        text: "Rüzgâr plaj planını zorlaştırdığında değerlendirmeye değer yerel öneriler.",
        beaches: ["Salagona", "Agia Dynami", "Vroulidia", "Kato Fana", "Elinta"],
      },
      {
        id: "sandy-beaches",
        emoji: "🏜",
        title: "Kumlu plajlar",
        text: "Kumlu veya denize girişi daha kolay olan plajlar; daha rahat bir yüzme deneyimi isteyenler için.",
        beaches: ["Lithi", "Karfas", "Komi"],
      },
      {
        id: "quiet-beaches",
        emoji: "🏝",
        title: "Sakin plajlar",
        text: "Kalabalıktan uzak, daha sakin ve otantik bir deniz günü isteyenler için iyi seçenekler.",
        beaches: ["Elinta", "Vroulidia", "Nagos"],
      },
      {
        id: "nearby-beaches",
        emoji: "📍",
        title: "Voulamandis House’a yakın plajlar",
        text: "Kambos’ta kalan ve arabayla daha kolay ulaşılabilecek plaj arayan misafirler için pratik seçenekler.",
        beaches: ["Karfas", "Glari Plajı", "Agia Fotia", "Daskalopetra"],
      },
    ],
  },
};

function getBeachesPageLanguage(
  data: ChiosBeachesPageData,
): BeachesPageUiLanguage {
  const path = data.seo.canonicalPath;

  if (path.startsWith("/el/")) return "el";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  if (path.startsWith("/tr/")) return "tr";

  return "en";
}

function getBeachCardClass(size: string) {
  const base =
    "group relative min-h-[360px] overflow-hidden rounded-[30px] border border-white/55 bg-stone-900 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl";

  if (size === "large") {
    return `${base} md:col-span-2 md:row-span-2 md:min-h-[560px]`;
  }

  if (size === "wide") {
    return `${base} md:col-span-2`;
  }

  return base;
}

function BeachCategoryBadges({ copy }: { copy: BeachGuideCopy }) {
  const badges = [
    { href: "#beaches", emoji: "🏖", label: copy.allBeachesLabel },
    ...copy.categories.map((category) => ({
      href: `#${category.id}`,
      emoji: category.emoji,
      label: category.title,
    })),
  ];

  return (
    <nav
      aria-label={copy.badgeLabel}
      className="relative bg-[#e0f0ed] px-3 py-4 md:px-5"
    >
      <div className="mx-auto flex max-w-[1180px] gap-2 overflow-x-auto pb-1 pr-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible md:pr-0">
        {badges.map((badge) => (
          <a
            key={badge.href}
            href={badge.href}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-cyan-900/10 bg-white px-3.5 py-2 text-xs font-black text-cyan-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-50 md:text-sm"
          >
            <span aria-hidden="true">{badge.emoji}</span>
            <span>{badge.label}</span>
          </a>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-[#e0f0ed] via-[#e0f0ed] to-transparent pl-8 pr-3 md:hidden"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-900/10 bg-white text-lg font-black text-cyan-800 shadow-md">
          →
        </span>
      </div>
    </nav>
  );
}

function BeachCategoryGuide({ copy }: { copy: BeachGuideCopy }) {
  return (
    <section className="px-3 py-14 md:px-5 md:py-24" aria-labelledby="cb-category-title">
      <div className="mx-auto max-w-[1180px]">
        <header className="mb-8 max-w-[820px] md:mb-12">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-800">
            {copy.kicker}
          </span>
          <h2
            id="cb-category-title"
            className="mt-3 text-3xl font-black leading-none tracking-[-0.05em] text-slate-950 md:text-5xl"
          >
            {copy.title}
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-700">{copy.text}</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {copy.categories.map((category) => (
            <article
              key={category.id}
              id={category.id}
              className="scroll-mt-28 rounded-[30px] bg-white p-5 shadow-lg ring-1 ring-slate-900/5 md:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef7f4] text-2xl shadow-sm">
                  {category.emoji}
                </span>
                <div>
                  <h3 className="text-xl font-black tracking-[-0.03em] text-slate-950">
                    {category.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{category.text}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {category.beaches.map((beach) => (
                  <span
                    key={`${category.id}-${beach}`}
                    className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-900 ring-1 ring-cyan-900/10"
                  >
                    {beach}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ChiosBeachesPageTailwind({ data }: ChiosBeachesPageProps) {
  const language = getBeachesPageLanguage(data);
  const copy = beachesPageUiCopy[language];
  const guideCopy = beachGuideCopy[language];

  const getExploreBeachLabel = (beachTitle: string) => {
    const beachName = beachTitle.split(":")[0].trim();

    if (language === "el") return `Δείτε ${beachName} →`;
    if (language === "fr") return `Voir ${beachName} →`;
    if (language === "de") return `${beachName} ansehen →`;
    if (language === "it") return `Scopri ${beachName} →`;
    if (language === "es") return `Ver ${beachName} →`;
    if (language === "tr") return `${beachName} keşfet →`;

    return `Explore ${beachName} →`;
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#eef7f4] text-slate-950">
      <section
        className="relative flex min-h-[64svh] items-end overflow-hidden text-white md:min-h-[520px]"
        aria-labelledby="cb-hero-title"
      >
        <img
          src={data.hero.image}
          alt=""
          loading="eager"
          className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent md:bg-[linear-gradient(90deg,rgba(2,34,44,0.86),rgba(2,34,44,0.46),rgba(2,34,44,0.08))]" />

        <div className="relative z-20 mx-auto w-full max-w-[1180px] px-3 pb-6 pt-24 md:px-5 md:pb-20">
          <div className="max-w-[760px] rounded-none border-0 bg-transparent p-0 md:rounded-[34px] md:border md:border-white/25 md:bg-white/15 md:p-12 md:shadow-2xl md:backdrop-blur">
            <span className="mb-4 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-white">
              <span className="h-px w-8 bg-current opacity-80" />
              {data.hero.kicker}
            </span>

            <h1
              id="cb-hero-title"
              className="max-w-[11ch] text-[40px] font-black leading-[0.96] tracking-[-0.06em] text-white drop-shadow-xl md:text-[clamp(46px,7vw,86px)]"
            >
              {data.hero.title}
            </h1>

            <p className="mt-4 max-w-[680px] text-sm leading-6 text-white/95 md:mt-5 md:text-lg md:leading-8">
              {data.hero.description}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5 md:mt-8 md:flex md:flex-wrap md:gap-3">
              <a
                className="inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-700 to-teal-700 px-3 text-center text-[10.5px] font-black uppercase leading-tight tracking-[0.08em] text-white shadow-lg transition hover:-translate-y-0.5 md:min-h-[54px] md:rounded-full md:px-7 md:text-xs"
                href={data.hero.primaryCta.href}
              >
                {data.hero.primaryCta.label}
              </a>

              <a
                className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-white/40 bg-white/15 px-3 text-center text-[10.5px] font-black uppercase leading-tight tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-white/25 md:min-h-[54px] md:rounded-full md:px-7 md:text-xs"
                href={data.hero.secondaryCta.href}
              >
                {data.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <BeachCategoryBadges copy={guideCopy} />

      <section className="px-3 py-14 md:px-5 md:py-24" aria-labelledby="cb-intro-title">
        <div className="mx-auto grid max-w-[1180px] gap-5 md:grid-cols-[1.35fr_0.65fr]">
          <article className="rounded-[32px] bg-white/80 p-6 shadow-lg ring-1 ring-slate-900/5 md:p-10">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-800">
              {data.intro.kicker}
            </span>
            <h2
              id="cb-intro-title"
              className="mt-3 max-w-[12ch] text-3xl font-black leading-none tracking-[-0.05em] text-slate-950 md:text-5xl"
            >
              {data.intro.title}
            </h2>
            <p className="mt-4 max-w-[720px] text-base leading-8 text-slate-700">
              {data.intro.description}
            </p>
          </article>

          <aside className="flex gap-4 rounded-[32px] bg-slate-950 p-6 text-white shadow-lg md:p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/15 text-2xl">
              {data.intro.tip.icon}
            </div>
            <div>
              <h3 className="text-xl font-black tracking-[-0.03em]">{data.intro.tip.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/75">{data.intro.tip.text}</p>
              <a className="mt-4 inline-flex text-sm font-black text-cyan-200" href={data.intro.tip.href}>
                {data.intro.tip.linkLabel}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <BeachCategoryGuide copy={guideCopy} />

      <section id="beaches" className="scroll-mt-28 px-3 py-14 md:px-5 md:py-24" aria-labelledby="cb-beaches-title">
        <div className="mx-auto max-w-[1180px]">
          <header className="mb-8 max-w-[760px] md:mb-12">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-800">
              {copy.beachesKicker}
            </span>
            <h2
              id="cb-beaches-title"
              className="mt-3 text-3xl font-black leading-none tracking-[-0.05em] text-slate-950 md:text-5xl"
            >
              {copy.beachesTitle}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-700">{copy.beachesText}</p>
          </header>

          <div className="grid auto-rows-[minmax(340px,auto)] gap-4 md:grid-cols-4 md:gap-5">
            {data.beaches.map((beach) => (
              <a
                className={getBeachCardClass(beach.size)}
                href={beach.href}
                key={beach.href}
                style={{
                  backgroundImage: `url(${beach.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent transition duration-700 group-hover:from-black/55" />

                <div className="absolute inset-x-0 bottom-0 z-20 p-5 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)] md:p-7">
                  <div className="mb-3 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/80">
                    <span>{beach.region}</span>
                    <span>•</span>
                    <span>{beach.mood}</span>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {beach.badges.map((badge) => (
                      <span
                        className="rounded-full border border-white/35 bg-white/18 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.04em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_18px_rgba(0,0,0,0.18)] backdrop-blur-md"
                        key={badge}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-2xl font-black tracking-[-0.04em] md:text-3xl">{beach.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/82">{beach.description}</p>
                  <strong className="mt-4 inline-flex text-sm font-black text-cyan-100">
                    {getExploreBeachLabel(beach.title)}
                  </strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 py-14 md:px-5 md:py-24" aria-labelledby="cb-planning-title">
        <div className="mx-auto grid max-w-[1180px] gap-5 rounded-[36px] bg-white p-5 shadow-xl ring-1 ring-slate-900/5 md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <article>
            <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-800">
              {data.planning.kicker}
            </span>
            <h2
              id="cb-planning-title"
              className="mt-3 text-3xl font-black leading-none tracking-[-0.05em] md:text-5xl"
            >
              {data.planning.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-700">{data.planning.description}</p>
          </article>

          <div className="grid gap-3">
            {data.planning.items.map((item) => (
              <div className="flex gap-4 rounded-[26px] bg-[#eef7f4] p-5" key={item.title}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                  {item.icon}
                </span>
                <div>
                  <h3 className="font-black tracking-[-0.03em]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 py-14 md:px-5 md:py-24" aria-labelledby="cb-stay-title">
        <div className="mx-auto max-w-[1180px]">
          <article className="overflow-hidden rounded-[38px] bg-gradient-to-br from-slate-950 to-cyan-950 p-7 text-white shadow-2xl md:p-12">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
              {data.stay.kicker}
            </span>
            <h2
              id="cb-stay-title"
              className="mt-3 max-w-[760px] text-3xl font-black leading-none tracking-[-0.05em] md:text-5xl"
            >
              {data.stay.title}
            </h2>
            <p className="mt-4 max-w-[780px] text-base leading-8 text-white/78">{data.stay.text}</p>

            <div className="mt-7 grid grid-cols-2 gap-2.5 md:flex md:flex-wrap md:gap-3">
              <a
                className="inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-white px-3 text-center text-[10.5px] font-black uppercase tracking-[0.08em] !text-slate-950 transition hover:-translate-y-0.5 md:rounded-full md:px-7 md:text-xs"
                href={data.stay.primaryCta.href}
              >
                {data.stay.primaryCta.label || "View rooms"}
              </a>

              <a
                className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-white/35 px-3 text-center text-[10.5px] font-black uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-white/10 md:rounded-full md:px-7 md:text-xs"
                href={data.stay.secondaryCta.href}
              >
                {data.stay.secondaryCta.label}
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
