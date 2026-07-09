import type { LanguageCode } from "@/lib/languages";
import { absoluteUrl } from "@/lib/seo";
import type { OrganizedBeachesPageData, OrganizedBeachCard } from "@/content/organized-beaches";

const images = {
  hero: "/images/beaches/salagona-e1645969502155.webp",
  elinta: "/images/beaches/salagona-e1645969502155.webp",
  vroulidia: "/images/beaches/vroulidia-2-1.jpg",
  nagos: "/images/beaches/salagona-e1645969502155.webp",
  stay: "/images/beaches/voulamandis-house-chios-courtyard-hero-desktop.webp",
};

export const quietBeachPaths: Record<LanguageCode, string> = {
  en: "/chios-quiet-beaches/",
  el: "/el/isixes-paralies-xios/",
  fr: "/fr/plages-calmes-chios/",
  de: "/de/ruhige-straende-chios/",
  it: "/it/spiagge-tranquille-chios/",
  es: "/es/playas-tranquilas-quios/",
  tr: "/tr/sakiz-adasi-sakin-plajlar/",
};

export const quietBeachAlternates = {
  en: absoluteUrl(quietBeachPaths.en),
  el: absoluteUrl(quietBeachPaths.el),
  fr: absoluteUrl(quietBeachPaths.fr),
  de: absoluteUrl(quietBeachPaths.de),
  it: absoluteUrl(quietBeachPaths.it),
  es: absoluteUrl(quietBeachPaths.es),
  tr: absoluteUrl(quietBeachPaths.tr),
  "x-default": absoluteUrl(quietBeachPaths.en),
};

const hrefs = {
  en: { elinta: "/chios/chios-beaches/#quiet-beaches", vroulidia: "/chios/chios-beaches/vroulidia-beach/", nagos: "/chios/chios-beaches/nagos-beach/", rooms: "/chios-rooms/", beaches: "/chios/chios-beaches/" },
  el: { elinta: "/el/paralies-xios/#quiet-beaches", vroulidia: "/el/paralies-xios/paralia-vroulidia/", nagos: "/el/paralies-xios/paralia-nagos/", rooms: "/el/domatia-xios/", beaches: "/el/paralies-xios/" },
  fr: { elinta: "/fr/plages-de-chios/#quiet-beaches", vroulidia: "/fr/plages-de-chios/plage-vroulidia/", nagos: "/fr/plages-de-chios/plage-nagos/", rooms: "/fr/chambres-a-chios/", beaches: "/fr/plages-de-chios/" },
  de: { elinta: "/de/straende-chios/#quiet-beaches", vroulidia: "/de/straende-chios/vroulidia-strand/", nagos: "/de/straende-chios/nagos-strand/", rooms: "/de/chios-zimmer/", beaches: "/de/straende-chios/" },
  it: { elinta: "/it/spiagge-chios/#quiet-beaches", vroulidia: "/it/spiagge-chios/spiaggia-vroulidia/", nagos: "/it/spiagge-chios/spiaggia-nagos/", rooms: "/it/camere-a-chios/", beaches: "/it/spiagge-chios/" },
  es: { elinta: "/es/playas-chios/#quiet-beaches", vroulidia: "/es/playas-chios/playa-vroulidia/", nagos: "/es/playas-chios/playa-nagos/", rooms: "/es/habitaciones-en-chios/", beaches: "/es/playas-chios/" },
  tr: { elinta: "/tr/sakiz-adasi-plajlari/#quiet-beaches", vroulidia: "/tr/sakiz-adasi-plajlari/vroulidia-plaji/", nagos: "/tr/sakiz-adasi-plajlari/nagos-plaji/", rooms: "/tr/sakiz-adasi-odalari/", beaches: "/tr/sakiz-adasi-plajlari/" },
} as const;

const copy = {
  en: { names: ["Elinta", "Vroulidia", "Nagos"], tag: "Quiet", desc: "A calmer choice for travellers who want a more authentic, less busy beach day.", why: "Good when you prefer silence, natural scenery and fewer distractions.", title: "Quiet beaches in Chios for slower, calmer days", cta: "See quiet beaches", all: "All Chios beaches", intro: "When to choose a quiet beach", introA: "Quiet beaches are best when the goal is not beach service or crowds, but calm, natural scenery and a slower rhythm.", introB: "For this category we start with Elinta, Vroulidia and Nagos.", hTitle: "Quiet beaches to consider", hSub: "A practical list for travellers who want a more peaceful Chios beach day.", stayTitle: "Return to a quiet garden after the beach", stayText: "Voulamandis House is a calm base for travellers who like peaceful beaches and slow evenings in Kambos.", rooms: "View rooms", finalTitle: "Looking for a calmer beach day?", finalText: "Ask us during your stay and we will suggest the quiet beach that fits the day.", finalBeach: "Explore beaches" },
  el: { names: ["Ελίντα", "Βρουλίδια", "Ναγός"], tag: "Ήσυχη", desc: "Πιο ήρεμη επιλογή για επισκέπτες που θέλουν αυθεντική μέρα στη θάλασσα με λιγότερο κόσμο.", why: "Καλή όταν προτιμάτε ησυχία, φυσικό τοπίο και λιγότερη κίνηση.", title: "Ήσυχες παραλίες στη Χίο για πιο ήρεμες μέρες", cta: "Δείτε ήσυχες", all: "Όλες οι παραλίες", intro: "Πότε να επιλέξετε ήσυχη παραλία", introA: "Οι ήσυχες παραλίες είναι ιδανικές όταν δεν ζητάτε υπηρεσίες και πολυκοσμία, αλλά ηρεμία, φυσικό τοπίο και πιο αργό ρυθμό.", introB: "Για αυτή την κατηγορία ξεκινάμε με Ελίντα, Βρουλίδια και Ναγό.", hTitle: "Ήσυχες παραλίες που αξίζει να δείτε", hSub: "Πρακτική λίστα για επισκέπτες που θέλουν πιο ήρεμη μέρα στη θάλασσα.", stayTitle: "Επιστροφή σε ήρεμο κήπο μετά τη θάλασσα", stayText: "Το Voulamandis House είναι ήρεμη βάση για επισκέπτες που αγαπούν ήσυχες παραλίες και χαλαρά βράδια στον Κάμπο.", rooms: "Δείτε δωμάτια", finalTitle: "Θέλετε πιο ήρεμη παραλία;", finalText: "Ρωτήστε μας στη διαμονή σας και θα σας προτείνουμε την ήσυχη παραλία που ταιριάζει στη μέρα.", finalBeach: "Παραλίες Χίου" },
  fr: { names: ["Elinta", "Vroulidia", "Nagos"], tag: "Calme", desc: "Un choix plus paisible pour une journée de plage authentique et moins fréquentée.", why: "Idéale pour le silence, le paysage naturel et moins d’agitation.", title: "Plages calmes à Chios pour des journées paisibles", cta: "Voir les plages", all: "Toutes les plages", intro: "Quand choisir une plage calme", introA: "Les plages calmes sont idéales pour le paysage naturel et un rythme plus lent.", introB: "Pour cette catégorie, commencez par Elinta, Vroulidia et Nagos.", hTitle: "Plages calmes à considérer", hSub: "Une liste pratique pour une journée plus paisible.", stayTitle: "Retour à un jardin calme", stayText: "Voulamandis House est une base paisible pour les amateurs de plages calmes.", rooms: "Voir chambres", finalTitle: "Envie d’une plage plus calme ?", finalText: "Demandez-nous pendant votre séjour et nous vous conseillerons.", finalBeach: "Plages de Chios" },
  de: { names: ["Elinta", "Vroulidia", "Nagos"], tag: "Ruhig", desc: "Eine ruhigere Wahl für einen authentischen Strandtag mit weniger Betrieb.", why: "Gut für Stille, Natur und weniger Ablenkung.", title: "Ruhige Strände auf Chios für langsamere Tage", cta: "Strände ansehen", all: "Alle Strände", intro: "Wann ein ruhiger Strand passt", introA: "Ruhige Strände sind ideal für Natur, Ruhe und einen langsameren Rhythmus.", introB: "Starten Sie mit Elinta, Vroulidia und Nagos.", hTitle: "Ruhige Strände zur Auswahl", hSub: "Eine praktische Liste für einen ruhigeren Strandtag.", stayTitle: "Zurück in einen ruhigen Garten", stayText: "Voulamandis House ist eine ruhige Basis für entspannte Strandtage.", rooms: "Zimmer ansehen", finalTitle: "Suchen Sie einen ruhigeren Strand?", finalText: "Fragen Sie uns während Ihres Aufenthalts.", finalBeach: "Chios Strände" },
  it: { names: ["Elinta", "Vroulidia", "Nagos"], tag: "Tranquilla", desc: "Una scelta più calma per una giornata autentica e meno affollata.", why: "Ideale per silenzio, natura e meno movimento.", title: "Spiagge tranquille a Chios per giornate lente", cta: "Vedi spiagge", all: "Tutte le spiagge", intro: "Quando scegliere una spiaggia tranquilla", introA: "Le spiagge tranquille sono ideali per natura, calma e ritmo lento.", introB: "Per questa categoria partiamo da Elinta, Vroulidia e Nagos.", hTitle: "Spiagge tranquille da considerare", hSub: "Una lista pratica per una giornata più calma.", stayTitle: "Ritorno a un giardino tranquillo", stayText: "Voulamandis House è una base calma per chi ama spiagge tranquille.", rooms: "Vedi camere", finalTitle: "Cercate una spiaggia più calma?", finalText: "Chiedeteci durante il soggiorno.", finalBeach: "Spiagge di Chios" },
  es: { names: ["Elinta", "Vroulidia", "Nagos"], tag: "Tranquila", desc: "Una opción más calmada para un día de playa auténtico y menos concurrido.", why: "Buena para silencio, naturaleza y menos distracciones.", title: "Playas tranquilas en Quíos para días lentos", cta: "Ver playas", all: "Todas las playas", intro: "Cuándo elegir una playa tranquila", introA: "Las playas tranquilas son ideales para naturaleza, calma y ritmo lento.", introB: "Para esta categoría empezamos con Elinta, Vroulidia y Nagos.", hTitle: "Playas tranquilas para considerar", hSub: "Una lista práctica para un día más calmado.", stayTitle: "Volver a un jardín tranquilo", stayText: "Voulamandis House es una base tranquila para quienes aman playas calmadas.", rooms: "Ver habitaciones", finalTitle: "¿Buscas una playa más tranquila?", finalText: "Pregúntanos durante tu estancia.", finalBeach: "Playas de Quíos" },
  tr: { names: ["Elinta", "Vroulidia", "Nagos"], tag: "Sakin", desc: "Daha otantik ve daha az kalabalık bir deniz günü isteyenler için sakin seçenek.", why: "Sessizlik, doğal manzara ve daha az hareket isteyenler için iyi.", title: "Daha sakin günler için Sakız Adası plajları", cta: "Plajları gör", all: "Tüm plajlar", intro: "Ne zaman sakin plaj seçilmeli", introA: "Sakin plajlar doğa, huzur ve daha yavaş tempo için idealdir.", introB: "Bu kategori için Elinta, Vroulidia ve Nagos ile başlıyoruz.", hTitle: "Değerlendirilecek sakin plajlar", hSub: "Daha huzurlu bir deniz günü için pratik liste.", stayTitle: "Sakin bahçeye dönüş", stayText: "Voulamandis House sakin plajları sevenler için huzurlu bir başlangıç noktasıdır.", rooms: "Odaları gör", finalTitle: "Daha sakin bir plaj mı arıyorsunuz?", finalText: "Konaklamanız sırasında bize sorun.", finalBeach: "Sakız plajları" },
} as const;

function cards(locale: LanguageCode): OrganizedBeachCard[] {
  const h = hrefs[locale];
  const c = copy[locale];
  return [
    { name: c.names[0], image: images.elinta, href: h.elinta, tag: c.tag, description: c.desc, why: c.why },
    { name: c.names[1], image: images.vroulidia, href: h.vroulidia, tag: c.tag, description: c.desc, why: c.why },
    { name: c.names[2], image: images.nagos, href: h.nagos, tag: c.tag, description: c.desc, why: c.why },
  ];
}

const tips = {
  en: [{ icon: "🧭", title: "Plan the route", text: "Quiet beaches may need more careful driving and timing." }, { icon: "🥤", title: "Bring supplies", text: "Take water and snacks, because services may be limited." }, { icon: "🌿", title: "Respect the place", text: "Keep these quiet places clean and calm for everyone." }],
  el: [{ icon: "🧭", title: "Οργανώστε τη διαδρομή", text: "Οι ήσυχες παραλίες θέλουν λίγο καλύτερο προγραμματισμό στη διαδρομή." }, { icon: "🥤", title: "Πάρτε τα απαραίτητα", text: "Νερό και κάτι πρόχειρο είναι χρήσιμα, γιατί οι υπηρεσίες μπορεί να είναι περιορισμένες." }, { icon: "🌿", title: "Σεβαστείτε το μέρος", text: "Κρατάμε τις ήσυχες παραλίες καθαρές και ήρεμες." }],
  fr: [{ icon: "🧭", title: "Planifiez la route", text: "Les plages calmes demandent parfois plus d’organisation." }, { icon: "🥤", title: "Prévoyez le nécessaire", text: "Eau et snacks sont utiles car les services peuvent être limités." }, { icon: "🌿", title: "Respectez le lieu", text: "Gardons ces endroits propres et calmes." }],
  de: [{ icon: "🧭", title: "Route planen", text: "Ruhige Strände brauchen oft etwas mehr Planung." }, { icon: "🥤", title: "Vorräte mitnehmen", text: "Wasser und Snacks sind sinnvoll, da Services begrenzt sein können." }, { icon: "🌿", title: "Ort respektieren", text: "Diese ruhigen Orte sauber und ruhig halten." }],
  it: [{ icon: "🧭", title: "Pianificate la strada", text: "Le spiagge tranquille richiedono un po’ più di organizzazione." }, { icon: "🥤", title: "Portate il necessario", text: "Acqua e snack sono utili perché i servizi possono essere limitati." }, { icon: "🌿", title: "Rispettate il luogo", text: "Manteniamo questi luoghi puliti e tranquilli." }],
  es: [{ icon: "🧭", title: "Planifica la ruta", text: "Las playas tranquilas pueden requerir más planificación." }, { icon: "🥤", title: "Lleva lo necesario", text: "Agua y snacks son útiles porque puede haber pocos servicios." }, { icon: "🌿", title: "Respeta el lugar", text: "Mantengamos estos lugares limpios y calmados." }],
  tr: [{ icon: "🧭", title: "Rotayı planlayın", text: "Sakin plajlar biraz daha planlama gerektirebilir." }, { icon: "🥤", title: "Gerekli şeyleri alın", text: "Su ve atıştırmalık alın; hizmetler sınırlı olabilir." }, { icon: "🌿", title: "Yere saygı gösterin", text: "Bu sakin yerleri temiz ve huzurlu tutalım." }],
};

function page(locale: LanguageCode): OrganizedBeachesPageData {
  const c = copy[locale];
  const h = hrefs[locale];
  const titleByLocale = locale === "el" ? "Ήσυχες παραλίες Χίου | Voulamandis House" : `${c.title} | Voulamandis House`;
  return {
    locale,
    path: quietBeachPaths[locale],
    seo: { canonicalPath: quietBeachPaths[locale], title: titleByLocale, description: c.desc, ogImage: images.hero },
    hero: { eyebrow: locale === "el" ? "Ήσυχες παραλίες" : "Quiet beach guide", title: c.title, subtitle: c.desc, image: { src: images.hero, alt: c.title }, primaryCta: { label: c.cta, href: "#organized-beaches" }, secondaryCta: { label: c.all, href: h.beaches } },
    intro: { title: c.intro, text: [c.introA, c.introB] },
    highlights: { title: c.hTitle, subtitle: c.hSub, cards: cards(locale) },
    tips: { title: locale === "el" ? "Γρήγορες συμβουλές" : "Quick tips", items: tips[locale] },
    stay: { title: c.stayTitle, text: c.stayText, image: images.stay, primaryCta: { label: c.rooms, href: h.rooms }, secondaryCta: { label: c.all, href: h.beaches } },
    finalCta: { title: c.finalTitle, text: c.finalText, primaryCta: { label: c.rooms, href: h.rooms }, secondaryCta: { label: c.finalBeach, href: h.beaches } },
  };
}

export const quietBeachesPages: Record<LanguageCode, OrganizedBeachesPageData> = {
  en: page("en"),
  el: page("el"),
  fr: page("fr"),
  de: page("de"),
  it: page("it"),
  es: page("es"),
  tr: page("tr"),
};

export function getQuietBeachesPageByLocale(locale: LanguageCode) { return quietBeachesPages[locale]; }
export function getQuietBeachesPageByPath(path: string) { return Object.values(quietBeachesPages).find((page) => page.path === path); }
