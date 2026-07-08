import type { LanguageCode } from "@/lib/languages";
import { absoluteUrl } from "@/lib/seo";

export type FamilyBeachCard = {
  name: string;
  image: string;
  href: string;
  tag: string;
  description: string;
  why: string;
};

export type FamilyBeachesPageData = {
  locale: LanguageCode;
  path: string;
  seo: {
    canonicalPath: string;
    title: string;
    description: string;
    ogImage: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: { src: string; alt: string };
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  intro: {
    title: string;
    text: string[];
  };
  highlights: {
    title: string;
    subtitle: string;
    cards: FamilyBeachCard[];
  };
  tips: {
    title: string;
    items: { icon: string; title: string; text: string }[];
  };
  stay: {
    title: string;
    text: string;
    image: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  finalCta: {
    title: string;
    text: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
};

const images = {
  hero: "/images/beaches/2017-06-28-1024x768.webp",
  komi: "/images/beaches/42ba5ae2ff96d99dfb12b1e06fa90b45-e1703437426681.webp",
  karfas: "/images/beaches/agia-fotia.jpg",
  lithi: "/images/beaches/2017-06-28-1024x768.webp",
  agiaDynami: "/images/beaches/691-e1645969589226.webp",
  stay: "/images/beaches/voulamandis-house-chios-courtyard-hero-desktop.webp",
};

export const familyBeachPaths: Record<LanguageCode, string> = {
  en: "/chios-family-beaches/",
  el: "/el/paralies-xios-gia-paidia/",
  fr: "/fr/plages-de-chios-pour-enfants/",
  de: "/de/chios-straende-fuer-kinder/",
  it: "/it/spiagge-chios-per-bambini/",
  es: "/es/playas-de-quios-para-ninos/",
  tr: "/tr/cocuklar-icin-sakiz-adasi-plajlari/",
};

export const familyBeachAlternates = {
  en: absoluteUrl(familyBeachPaths.en),
  el: absoluteUrl(familyBeachPaths.el),
  fr: absoluteUrl(familyBeachPaths.fr),
  de: absoluteUrl(familyBeachPaths.de),
  it: absoluteUrl(familyBeachPaths.it),
  es: absoluteUrl(familyBeachPaths.es),
  tr: absoluteUrl(familyBeachPaths.tr),
  "x-default": absoluteUrl(familyBeachPaths.en),
};

const beachHrefs = {
  en: {
    komi: "/chios/chios-beaches/komi-beach/",
    karfas: "/chios/chios-beaches/agia-fotia-beach/",
    lithi: "/chios/chios-beaches/lithi-beach/",
    agiaDynami: "/chios/chios-beaches/agia-dynami-beach-chios/",
    rooms: "/chios-rooms/",
    beaches: "/chios/chios-beaches/",
  },
  el: {
    komi: "/el/paralies-xios/paralia-komi/",
    karfas: "/el/paralies-xios/paralia-agia-fotia/",
    lithi: "/el/paralies-xios/paralia-lithi/",
    agiaDynami: "/el/paralies-xios/paralia-agia-dynami/",
    rooms: "/el/domatia-xios/",
    beaches: "/el/paralies-xios/",
  },
  fr: {
    komi: "/fr/plages-de-chios/plage-komi/",
    karfas: "/fr/plages-de-chios/plage-agia-fotia/",
    lithi: "/fr/plages-de-chios/plage-lithi/",
    agiaDynami: "/fr/plages-de-chios/plage-agia-dynami/",
    rooms: "/fr/chambres-a-chios/",
    beaches: "/fr/plages-de-chios/",
  },
  de: {
    komi: "/de/straende-chios/komi-strand/",
    karfas: "/de/straende-chios/agia-fotia-strand/",
    lithi: "/de/straende-chios/lithi-strand/",
    agiaDynami: "/de/straende-chios/agia-dynami-strand/",
    rooms: "/de/chios-zimmer/",
    beaches: "/de/straende-chios/",
  },
  it: {
    komi: "/it/spiagge-chios/spiaggia-komi/",
    karfas: "/it/spiagge-chios/spiaggia-agia-fotia/",
    lithi: "/it/spiagge-chios/spiaggia-lithi/",
    agiaDynami: "/it/spiagge-chios/spiaggia-agia-dynami/",
    rooms: "/it/camere-a-chios/",
    beaches: "/it/spiagge-chios/",
  },
  es: {
    komi: "/es/playas-chios/playa-komi/",
    karfas: "/es/playas-chios/playa-agia-fotia/",
    lithi: "/es/playas-chios/playa-lithi/",
    agiaDynami: "/es/playas-chios/playa-agia-dynami/",
    rooms: "/es/habitaciones-en-chios/",
    beaches: "/es/playas-chios/",
  },
  tr: {
    komi: "/tr/sakiz-adasi-plajlari/komi-plaji/",
    karfas: "/tr/sakiz-adasi-plajlari/agia-fotia-plaji/",
    lithi: "/tr/sakiz-adasi-plajlari/lithi-plaji/",
    agiaDynami: "/tr/sakiz-adasi-plajlari/agia-dynami-plaji/",
    rooms: "/tr/sakiz-adasi-odalari/",
    beaches: "/tr/sakiz-adasi-plajlari/",
  },
} as const;

export const familyBeachesPages: Record<LanguageCode, FamilyBeachesPageData> = {
  en: {
    locale: "en",
    path: familyBeachPaths.en,
    seo: {
      canonicalPath: familyBeachPaths.en,
      title: "Best Chios Beaches for Families & Children | Voulamandis House",
      description: "A local guide to family-friendly beaches in Chios for children: Komi, Karfas, Lithi and Agia Dynami, with practical tips from Voulamandis House.",
      ogImage: images.hero,
    },
    hero: {
      eyebrow: "Family beach guide",
      title: "The best Chios beaches for children and families",
      subtitle: "Choose calmer, easier and more practical beaches for a family day by the sea in Chios, based on local advice from Voulamandis House.",
      image: { src: images.hero, alt: "Family-friendly beach in Chios with shallow water" },
      primaryCta: { label: "See family beaches", href: "#family-beaches" },
      secondaryCta: { label: "View all Chios beaches", href: beachHrefs.en.beaches },
    },
    intro: {
      title: "How to choose a beach with children in Chios",
      text: ["For families, the best beach is not always the most famous one. Easy access, softer sea entry, nearby food and a relaxed route often matter more.", "These four choices are practical starting points for a family beach day: Komi, Karfas, Lithi and Agia Dynami."],
    },
    highlights: {
      title: "Family-friendly beaches to start with",
      subtitle: "A simple list for parents who want easier planning and less stress.",
      cards: [
        { name: "Komi", image: images.komi, href: beachHrefs.en.komi, tag: "Sand + food", description: "A lively sandy beach with food options and an easy summer mood.", why: "Good when the family wants beach life, swimming and food in one stop." },
        { name: "Karfas", image: images.karfas, href: beachHrefs.en.karfas, tag: "Practical choice", description: "A convenient east-coast beach option, useful for an easier day from Kambos.", why: "Good for families who want a simple route and organized surroundings." },
        { name: "Lithi", image: images.lithi, href: beachHrefs.en.lithi, tag: "Shallow + taverns", description: "Shallow sandy water and seaside taverns make Lithi a classic family choice.", why: "Good when children need easier swimming and parents want food nearby." },
        { name: "Agia Dynami", image: images.agiaDynami, href: beachHrefs.en.agiaDynami, tag: "Beautiful cove", description: "An exotic cove with memorable colours for a quieter family outing.", why: "Good for families who want a special beach experience and beautiful photos." },
      ],
    },
    tips: { title: "Quick family beach tips", items: [
      { icon: "🌬️", title: "Check the wind", text: "Ask locally before driving far, because the best family beach can change with the wind." },
      { icon: "🚗", title: "Keep the route simple", text: "With children, choose one good beach and a nearby meal instead of trying to see too much." },
      { icon: "🧴", title: "Plan shade and water", text: "Bring water, hats and sun protection, especially for beaches with limited natural shade." },
    ]},
    stay: { title: "Stay in Kambos and plan beach days easily", text: "Voulamandis House is a practical base for family beach days, with local guidance, peaceful garden moments and easy access to routes around Chios.", image: images.stay, primaryCta: { label: "View rooms", href: beachHrefs.en.rooms }, secondaryCta: { label: "All beaches", href: beachHrefs.en.beaches } },
    finalCta: { title: "Need help choosing the right beach?", text: "Ask us during your stay and we will suggest the best family beach for the day’s weather and your route.", primaryCta: { label: "View rooms", href: beachHrefs.en.rooms }, secondaryCta: { label: "Explore Chios beaches", href: beachHrefs.en.beaches } },
  },
  el: {
    locale: "el", path: familyBeachPaths.el,
    seo: { canonicalPath: familyBeachPaths.el, title: "Παραλίες Χίου για παιδιά και οικογένειες | Voulamandis House", description: "Τοπικός οδηγός για παραλίες της Χίου κατάλληλες για παιδιά: Κώμη, Καρφάς, Λιθί και Αγία Δύναμη, με πρακτικές συμβουλές από το Voulamandis House.", ogImage: images.hero },
    hero: { eyebrow: "Οικογενειακές παραλίες", title: "Οι καλύτερες παραλίες της Χίου για παιδιά και οικογένειες", subtitle: "Διαλέξτε πιο εύκολες, πρακτικές και άνετες επιλογές για οικογενειακή μέρα στη θάλασσα στη Χίο.", image: { src: images.hero, alt: "Οικογενειακή παραλία στη Χίο με εύκολη είσοδο στη θάλασσα" }, primaryCta: { label: "Δείτε τις παραλίες", href: "#family-beaches" }, secondaryCta: { label: "Όλες οι παραλίες Χίου", href: beachHrefs.el.beaches } },
    intro: { title: "Πώς να διαλέξετε παραλία με παιδιά στη Χίο", text: ["Για μια οικογένεια, η καλύτερη παραλία δεν είναι πάντα η πιο διάσημη. Η εύκολη πρόσβαση, η πιο βολική είσοδος στη θάλασσα, το φαγητό κοντά και η απλή διαδρομή κάνουν μεγάλη διαφορά.", "Οι τέσσερις επιλογές που προτείνουμε για αρχή είναι: Κώμη, Καρφάς, Λιθί και Αγία Δύναμη."] },
    highlights: { title: "Παραλίες για παιδιά που αξίζει να ξεκινήσετε", subtitle: "Μια απλή λίστα για γονείς που θέλουν λιγότερη ταλαιπωρία και πιο εύκολο πρόγραμμα.", cards: [
      { name: "Κώμη", image: images.komi, href: beachHrefs.el.komi, tag: "Άμμος + φαγητό", description: "Ζωντανή αμμώδης παραλία με επιλογές για φαγητό και καλοκαιρινή ατμόσφαιρα.", why: "Καλή όταν θέλετε μπάνιο, φαγητό και εύκολη οργάνωση σε ένα σημείο." },
      { name: "Καρφάς", image: images.karfas, href: beachHrefs.el.karfas, tag: "Πρακτική επιλογή", description: "Βολική επιλογή για πιο εύκολη οικογενειακή έξοδο από τον Κάμπο.", why: "Καλή για οικογένειες που θέλουν απλή διαδρομή και οργανωμένο περιβάλλον." },
      { name: "Λιθί", image: images.lithi, href: beachHrefs.el.lithi, tag: "Ρηχά + ταβέρνες", description: "Ρηχά αμμώδη νερά και ταβέρνες δίπλα στη θάλασσα.", why: "Καλή όταν τα παιδιά χρειάζονται πιο εύκολο μπάνιο και οι γονείς φαγητό κοντά." },
      { name: "Αγία Δύναμη", image: images.agiaDynami, href: beachHrefs.el.agiaDynami, tag: "Όμορφος όρμος", description: "Εξωτικός όρμος με ιδιαίτερα χρώματα για πιο ξεχωριστή οικογενειακή βόλτα.", why: "Καλή για οικογένειες που θέλουν όμορφη εμπειρία και φωτογραφίες." },
    ]},
    tips: { title: "Γρήγορες συμβουλές για οικογένειες", items: [{ icon: "🌬️", title: "Ελέγξτε τον άνεμο", text: "Ρωτήστε τοπικά πριν οδηγήσετε μακριά, γιατί η καλύτερη οικογενειακή παραλία αλλάζει ανάλογα με τον αέρα." }, { icon: "🚗", title: "Κρατήστε απλή τη διαδρομή", text: "Με παιδιά, συνήθως είναι καλύτερα μία καλή παραλία και κοντινό φαγητό παρά πολλές στάσεις." }, { icon: "🧴", title: "Νερό και σκιά", text: "Πάρτε νερό, καπέλα και αντηλιακό, ειδικά σε παραλίες με περιορισμένη φυσική σκιά." }] },
    stay: { title: "Μείνετε στον Κάμπο και οργανώστε εύκολα τις παραλίες", text: "Το Voulamandis House είναι πρακτική βάση για οικογενειακές μέρες στη θάλασσα, με τοπική καθοδήγηση, ήρεμο κήπο και εύκολη πρόσβαση σε διαδρομές της Χίου.", image: images.stay, primaryCta: { label: "Δείτε δωμάτια", href: beachHrefs.el.rooms }, secondaryCta: { label: "Όλες οι παραλίες", href: beachHrefs.el.beaches } },
    finalCta: { title: "Θέλετε βοήθεια για τη σωστή παραλία;", text: "Ρωτήστε μας στη διαμονή σας και θα σας προτείνουμε την καλύτερη οικογενειακή επιλογή ανάλογα με τον καιρό και τη διαδρομή.", primaryCta: { label: "Δείτε δωμάτια", href: beachHrefs.el.rooms }, secondaryCta: { label: "Παραλίες Χίου", href: beachHrefs.el.beaches } },
  },
  fr: {
    locale: "fr", path: familyBeachPaths.fr,
    seo: { canonicalPath: familyBeachPaths.fr, title: "Plages de Chios pour enfants et familles | Voulamandis House", description: "Guide local des plages familiales de Chios pour les enfants : Komi, Karfas, Lithi et Agia Dynami, avec conseils pratiques de Voulamandis House.", ogImage: images.hero },
    hero: { eyebrow: "Plages familiales", title: "Les meilleures plages de Chios pour enfants et familles", subtitle: "Choisissez des plages plus simples, pratiques et confortables pour une journée en famille au bord de la mer à Chios.", image: { src: images.hero, alt: "Plage familiale à Chios" }, primaryCta: { label: "Voir les plages", href: "#family-beaches" }, secondaryCta: { label: "Toutes les plages", href: beachHrefs.fr.beaches } },
    intro: { title: "Comment choisir une plage avec des enfants à Chios", text: ["Pour une famille, la meilleure plage n’est pas toujours la plus célèbre. L’accès, l’entrée dans l’eau, la nourriture à proximité et un trajet simple comptent beaucoup.", "Commencez avec quatre choix pratiques : Komi, Karfas, Lithi et Agia Dynami."] },
    highlights: { title: "Plages familiales pour commencer", subtitle: "Une liste simple pour organiser une journée plus facile.", cards: [
      { name: "Komi", image: images.komi, href: beachHrefs.fr.komi, tag: "Sable + repas", description: "Plage de sable animée avec options pour manger.", why: "Idéale pour combiner baignade, repas et ambiance estivale." },
      { name: "Karfas", image: images.karfas, href: beachHrefs.fr.karfas, tag: "Choix pratique", description: "Option pratique pour une journée plus facile depuis Kambos.", why: "Bonne option pour un trajet simple et un environnement organisé." },
      { name: "Lithi", image: images.lithi, href: beachHrefs.fr.lithi, tag: "Peu profond + tavernes", description: "Eaux sablonneuses peu profondes et tavernes au bord de l’eau.", why: "Pratique pour les enfants et pour déjeuner près de la mer." },
      { name: "Agia Dynami", image: images.agiaDynami, href: beachHrefs.fr.agiaDynami, tag: "Belle crique", description: "Crique exotique aux couleurs mémorables.", why: "Pour une sortie plus spéciale et de belles photos." },
    ]},
    tips: { title: "Conseils rapides pour familles", items: [{ icon: "🌬️", title: "Vérifiez le vent", text: "Demandez localement avant de conduire loin." }, { icon: "🚗", title: "Gardez un trajet simple", text: "Avec des enfants, une bonne plage et un repas proche suffisent souvent." }, { icon: "🧴", title: "Prévoyez eau et protection", text: "Apportez eau, chapeaux et protection solaire." }] },
    stay: { title: "Séjourner à Kambos facilite les journées plage", text: "Voulamandis House est une base pratique pour les familles, avec conseils locaux, jardin calme et accès facile aux itinéraires de Chios.", image: images.stay, primaryCta: { label: "Voir les chambres", href: beachHrefs.fr.rooms }, secondaryCta: { label: "Toutes les plages", href: beachHrefs.fr.beaches } },
    finalCta: { title: "Besoin d’aide pour choisir ?", text: "Demandez-nous pendant votre séjour et nous vous proposerons la meilleure plage familiale selon la météo.", primaryCta: { label: "Voir les chambres", href: beachHrefs.fr.rooms }, secondaryCta: { label: "Plages de Chios", href: beachHrefs.fr.beaches } },
  },
  de: {
    locale: "de", path: familyBeachPaths.de,
    seo: { canonicalPath: familyBeachPaths.de, title: "Chios Strände für Kinder und Familien | Voulamandis House", description: "Lokaler Guide zu familienfreundlichen Stränden auf Chios: Komi, Karfas, Lithi und Agia Dynami, mit praktischen Tipps von Voulamandis House.", ogImage: images.hero },
    hero: { eyebrow: "Familienstrände", title: "Die besten Strände auf Chios für Kinder und Familien", subtitle: "Wählen Sie einfachere und praktischere Strände für einen entspannten Familientag am Meer.", image: { src: images.hero, alt: "Familienfreundlicher Strand auf Chios" }, primaryCta: { label: "Strände ansehen", href: "#family-beaches" }, secondaryCta: { label: "Alle Strände", href: beachHrefs.de.beaches } },
    intro: { title: "So wählen Sie einen Strand mit Kindern auf Chios", text: ["Für Familien ist der bekannteste Strand nicht immer die beste Wahl. Einfacher Zugang, leichter Einstieg ins Meer, Essen in der Nähe und eine einfache Route sind oft wichtiger.", "Starten Sie mit Komi, Karfas, Lithi und Agia Dynami."] },
    highlights: { title: "Familienfreundliche Strände zum Start", subtitle: "Eine einfache Liste für weniger Stress bei der Planung.", cards: [
      { name: "Komi", image: images.komi, href: beachHrefs.de.komi, tag: "Sand + Essen", description: "Lebhafter Sandstrand mit Essensmöglichkeiten.", why: "Gut für Schwimmen, Essen und Sommerstimmung an einem Ort." },
      { name: "Karfas", image: images.karfas, href: beachHrefs.de.karfas, tag: "Praktisch", description: "Eine bequeme Option für einen einfachen Tag von Kambos aus.", why: "Gut für Familien, die eine einfache Route und organisierte Umgebung möchten." },
      { name: "Lithi", image: images.lithi, href: beachHrefs.de.lithi, tag: "Flach + Tavernen", description: "Flacher Sandbereich und Tavernen direkt am Meer.", why: "Praktisch für Kinder und für Essen in der Nähe." },
      { name: "Agia Dynami", image: images.agiaDynami, href: beachHrefs.de.agiaDynami, tag: "Schöne Bucht", description: "Eine exotische Bucht mit besonderen Farben.", why: "Für ein besonderes Familienerlebnis und schöne Fotos." },
    ]},
    tips: { title: "Schnelle Tipps für Familien", items: [{ icon: "🌬️", title: "Wind prüfen", text: "Fragen Sie lokal nach, bevor Sie weit fahren." }, { icon: "🚗", title: "Route einfach halten", text: "Mit Kindern ist oft ein guter Strand mit naher Essensoption ideal." }, { icon: "🧴", title: "Wasser und Schutz", text: "Wasser, Hüte und Sonnenschutz mitnehmen." }] },
    stay: { title: "Von Kambos aus Strandtage einfach planen", text: "Voulamandis House ist eine praktische Basis für Familien, mit lokalen Tipps, ruhigem Garten und gutem Zugang zu Chios-Routen.", image: images.stay, primaryCta: { label: "Zimmer ansehen", href: beachHrefs.de.rooms }, secondaryCta: { label: "Alle Strände", href: beachHrefs.de.beaches } },
    finalCta: { title: "Hilfe bei der Strandwahl?", text: "Fragen Sie uns während Ihres Aufenthalts und wir empfehlen je nach Wetter den passenden Familienstrand.", primaryCta: { label: "Zimmer ansehen", href: beachHrefs.de.rooms }, secondaryCta: { label: "Strände auf Chios", href: beachHrefs.de.beaches } },
  },
  it: {
    locale: "it", path: familyBeachPaths.it,
    seo: { canonicalPath: familyBeachPaths.it, title: "Spiagge di Chios per bambini e famiglie | Voulamandis House", description: "Guida locale alle spiagge di Chios adatte ai bambini: Komi, Karfas, Lithi e Agia Dynami, con consigli pratici da Voulamandis House.", ogImage: images.hero },
    hero: { eyebrow: "Spiagge per famiglie", title: "Le migliori spiagge di Chios per bambini e famiglie", subtitle: "Scegliete spiagge più facili, pratiche e comode per una giornata al mare in famiglia a Chios.", image: { src: images.hero, alt: "Spiaggia per famiglie a Chios" }, primaryCta: { label: "Vedi le spiagge", href: "#family-beaches" }, secondaryCta: { label: "Tutte le spiagge", href: beachHrefs.it.beaches } },
    intro: { title: "Come scegliere una spiaggia con bambini a Chios", text: ["Per una famiglia, la spiaggia più famosa non è sempre la migliore. Accesso facile, ingresso in mare semplice, cibo vicino e un percorso comodo contano molto.", "Iniziate da Komi, Karfas, Lithi e Agia Dynami."] },
    highlights: { title: "Spiagge per famiglie da cui iniziare", subtitle: "Una lista semplice per organizzare meglio la giornata.", cards: [
      { name: "Komi", image: images.komi, href: beachHrefs.it.komi, tag: "Sabbia + cibo", description: "Spiaggia sabbiosa vivace con opzioni per mangiare.", why: "Ideale per unire bagno, pranzo e atmosfera estiva." },
      { name: "Karfas", image: images.karfas, href: beachHrefs.it.karfas, tag: "Scelta pratica", description: "Opzione comoda per una giornata più semplice da Kambos.", why: "Buona per famiglie che vogliono un percorso facile." },
      { name: "Lithi", image: images.lithi, href: beachHrefs.it.lithi, tag: "Bassa + taverne", description: "Acqua sabbiosa poco profonda e taverne sul mare.", why: "Comoda per bambini e per mangiare vicino." },
      { name: "Agia Dynami", image: images.agiaDynami, href: beachHrefs.it.agiaDynami, tag: "Bella cala", description: "Cala esotica dai colori memorabili.", why: "Per un’esperienza speciale e belle foto." },
    ]},
    tips: { title: "Consigli rapidi per famiglie", items: [{ icon: "🌬️", title: "Controllate il vento", text: "Chiedete localmente prima di guidare lontano." }, { icon: "🚗", title: "Percorso semplice", text: "Con bambini, meglio una buona spiaggia e un pranzo vicino." }, { icon: "🧴", title: "Acqua e protezione", text: "Portate acqua, cappelli e protezione solare." }] },
    stay: { title: "Da Kambos è più facile organizzare le giornate al mare", text: "Voulamandis House è una base pratica per famiglie, con consigli locali, giardino tranquillo e facile accesso alle strade di Chios.", image: images.stay, primaryCta: { label: "Vedi camere", href: beachHrefs.it.rooms }, secondaryCta: { label: "Tutte le spiagge", href: beachHrefs.it.beaches } },
    finalCta: { title: "Serve aiuto per scegliere?", text: "Chiedeteci durante il soggiorno e vi suggeriremo la spiaggia più adatta alla giornata.", primaryCta: { label: "Vedi camere", href: beachHrefs.it.rooms }, secondaryCta: { label: "Spiagge di Chios", href: beachHrefs.it.beaches } },
  },
  es: {
    locale: "es", path: familyBeachPaths.es,
    seo: { canonicalPath: familyBeachPaths.es, title: "Playas de Quíos para niños y familias | Voulamandis House", description: "Guía local de playas familiares en Quíos para niños: Komi, Karfas, Lithi y Agia Dynami, con consejos prácticos de Voulamandis House.", ogImage: images.hero },
    hero: { eyebrow: "Playas familiares", title: "Las mejores playas de Quíos para niños y familias", subtitle: "Elige playas más fáciles, prácticas y cómodas para un día de mar en familia en Quíos.", image: { src: images.hero, alt: "Playa familiar en Quíos" }, primaryCta: { label: "Ver playas", href: "#family-beaches" }, secondaryCta: { label: "Todas las playas", href: beachHrefs.es.beaches } },
    intro: { title: "Cómo elegir una playa con niños en Quíos", text: ["Para una familia, la playa más famosa no siempre es la mejor. Acceso fácil, entrada cómoda al mar, comida cerca y una ruta sencilla importan mucho.", "Empieza por Komi, Karfas, Lithi y Agia Dynami."] },
    highlights: { title: "Playas familiares para empezar", subtitle: "Una lista sencilla para planificar con menos estrés.", cards: [
      { name: "Komi", image: images.komi, href: beachHrefs.es.komi, tag: "Arena + comida", description: "Playa de arena animada con opciones para comer.", why: "Buena para combinar baño, comida y ambiente de verano." },
      { name: "Karfas", image: images.karfas, href: beachHrefs.es.karfas, tag: "Práctica", description: "Opción cómoda para un día sencillo desde Kambos.", why: "Buena para familias que quieren una ruta fácil." },
      { name: "Lithi", image: images.lithi, href: beachHrefs.es.lithi, tag: "Poco profunda + tabernas", description: "Aguas arenosas poco profundas y tabernas junto al mar.", why: "Práctica para niños y para comer cerca." },
      { name: "Agia Dynami", image: images.agiaDynami, href: beachHrefs.es.agiaDynami, tag: "Cala bonita", description: "Cala exótica con colores memorables.", why: "Para una experiencia especial y buenas fotos." },
    ]},
    tips: { title: "Consejos rápidos para familias", items: [{ icon: "🌬️", title: "Comprueba el viento", text: "Pregunta localmente antes de conducir lejos." }, { icon: "🚗", title: "Ruta sencilla", text: "Con niños, una buena playa y comida cerca suele ser mejor." }, { icon: "🧴", title: "Agua y protección", text: "Lleva agua, sombreros y protección solar." }] },
    stay: { title: "Desde Kambos es más fácil planificar la playa", text: "Voulamandis House es una base práctica para familias, con consejos locales, jardín tranquilo y buen acceso a rutas por Quíos.", image: images.stay, primaryCta: { label: "Ver habitaciones", href: beachHrefs.es.rooms }, secondaryCta: { label: "Todas las playas", href: beachHrefs.es.beaches } },
    finalCta: { title: "¿Necesitas ayuda para elegir?", text: "Pregúntanos durante tu estancia y te sugeriremos la mejor playa familiar según el tiempo.", primaryCta: { label: "Ver habitaciones", href: beachHrefs.es.rooms }, secondaryCta: { label: "Playas de Quíos", href: beachHrefs.es.beaches } },
  },
  tr: {
    locale: "tr", path: familyBeachPaths.tr,
    seo: { canonicalPath: familyBeachPaths.tr, title: "Çocuklar ve Aileler için Sakız Adası Plajları | Voulamandis House", description: "Çocuklar için aile dostu Sakız Adası plajları: Komi, Karfas, Lithi ve Agia Dynami. Voulamandis House’tan pratik yerel öneriler.", ogImage: images.hero },
    hero: { eyebrow: "Aile plajları", title: "Çocuklar ve aileler için Sakız Adası’nın en iyi plajları", subtitle: "Sakız Adası’nda ailece deniz günü için daha kolay, pratik ve rahat plajlar seçin.", image: { src: images.hero, alt: "Sakız Adası’nda aile dostu plaj" }, primaryCta: { label: "Plajları gör", href: "#family-beaches" }, secondaryCta: { label: "Tüm plajlar", href: beachHrefs.tr.beaches } },
    intro: { title: "Sakız’da çocuklarla plaj nasıl seçilir", text: ["Aileler için en ünlü plaj her zaman en iyi seçenek değildir. Kolay ulaşım, denize rahat giriş, yakın yemek seçenekleri ve basit rota önemlidir.", "Komi, Karfas, Lithi ve Agia Dynami ile başlayabilirsiniz."] },
    highlights: { title: "Başlamak için aile dostu plajlar", subtitle: "Daha az stresle plan yapmak için sade bir liste.", cards: [
      { name: "Komi", image: images.komi, href: beachHrefs.tr.komi, tag: "Kum + yemek", description: "Yemek seçenekleri olan canlı kumlu plaj.", why: "Deniz, yemek ve yaz havasını tek yerde isteyen aileler için iyi." },
      { name: "Karfas", image: images.karfas, href: beachHrefs.tr.karfas, tag: "Pratik seçim", description: "Kambos’tan daha kolay bir gün için kullanışlı seçenek.", why: "Basit rota ve düzenli çevre isteyen aileler için iyi." },
      { name: "Lithi", image: images.lithi, href: beachHrefs.tr.lithi, tag: "Sığ + tavernalar", description: "Sığ kumlu su ve deniz kenarında tavernalar.", why: "Çocuklar için daha kolay yüzme ve yakında yemek için pratik." },
      { name: "Agia Dynami", image: images.agiaDynami, href: beachHrefs.tr.agiaDynami, tag: "Güzel koy", description: "Unutulmaz renklere sahip özel bir koy.", why: "Özel bir aile gezisi ve güzel fotoğraflar için iyi." },
    ]},
    tips: { title: "Aileler için hızlı ipuçları", items: [{ icon: "🌬️", title: "Rüzgârı kontrol edin", text: "Uzağa gitmeden önce yerel olarak sorun." }, { icon: "🚗", title: "Rotayı basit tutun", text: "Çocuklarla bir iyi plaj ve yakın yemek seçeneği çoğu zaman daha iyidir." }, { icon: "🧴", title: "Su ve koruma", text: "Su, şapka ve güneş koruması alın." }] },
    stay: { title: "Kambos’tan plaj günlerini kolay planlayın", text: "Voulamandis House aileler için pratik bir üs: yerel öneriler, sakin bahçe ve Sakız rotalarına kolay erişim.", image: images.stay, primaryCta: { label: "Odaları gör", href: beachHrefs.tr.rooms }, secondaryCta: { label: "Tüm plajlar", href: beachHrefs.tr.beaches } },
    finalCta: { title: "Doğru plajı seçmek için yardım ister misiniz?", text: "Konaklamanız sırasında bize sorun; hava durumuna göre en uygun aile plajını önerelim.", primaryCta: { label: "Odaları gör", href: beachHrefs.tr.rooms }, secondaryCta: { label: "Sakız plajları", href: beachHrefs.tr.beaches } },
  },
};

export function getFamilyBeachesPageByLocale(locale: LanguageCode) {
  return familyBeachesPages[locale];
}

export function getFamilyBeachesPageByPath(path: string) {
  return Object.values(familyBeachesPages).find((page) => page.path === path);
}
